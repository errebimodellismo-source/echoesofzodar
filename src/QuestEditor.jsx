/**
 * QuestEditor — Editor visuale di missioni per Echoes of Zodar
 * Layout: left sidebar | canvas | right panel
 */
import { useState, useRef, useEffect, useCallback } from "react";

// ─── Tipi di nodo ──────────────────────────────────────────────
const NODE_TYPES = [
  { type:"narrative", label:"Scena Narrativa", icon:"📜", color:"#6366f1", bg:"rgba(99,102,241,0.18)", border:"#4f46e5" },
  { type:"choice",    label:"Scelta / Bivio",  icon:"🔀", color:"#fbbf24", bg:"rgba(180,83,9,0.18)",  border:"#b45309" },
  { type:"combat",    label:"Combattimento",   icon:"⚔️", color:"#f87171", bg:"rgba(127,29,29,0.22)", border:"#991b1b" },
  { type:"reward",    label:"Ricompensa",      icon:"💰", color:"#34d399", bg:"rgba(6,78,59,0.2)",   border:"#065f46" },
  { type:"end",       label:"Fine Missione",   icon:"🏁", color:"#fde68a", bg:"rgba(120,53,15,0.22)", border:"#92400e" },
];

const DIFFICULTIES = ["facile","medio","difficile","epica"];
const NODE_W = 210;
const NODE_H = 80;

function uid() { return Math.random().toString(36).slice(2,10); }
function getNodeType(type) { return NODE_TYPES.find(n=>n.type===type) || NODE_TYPES[0]; }

function newNode(type) {
  return {
    id: "qn_" + uid(),
    type,
    title: getNodeType(type).label,
    text: "",
    next: null,
    choices: type === "choice" ? [
      { quality:"good",    label:"Scelta Buona",    xp:100, gold:10, next:null },
      { quality:"neutral", label:"Scelta Media",    xp:50,  gold:5,  next:null },
      { quality:"bad",     label:"Scelta Sbagliata",xp:0,   gold:0,  next:null },
    ] : [],
    combat: type === "combat" ? { enemies:[], successNext:null, failureNext:null } : null,
    reward: type === "reward" ? { xp:0, gold:0 } : null,
  };
}

function newQuest() {
  return {
    id: "q_" + uid(),
    title: "Nuova Missione",
    emoji: "⚔️",
    difficulty: "facile",
    flavor: "",
    nodes: {},
    nodePositions: {},
    startNode: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ─── Stili ─────────────────────────────────────────────────────
const inp = {
  background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6,
  color:"#e2e8f0", padding:"0.45rem 0.7rem", fontSize:"0.84rem", width:"100%",
  boxSizing:"border-box", outline:"none",
};
const btn = (accent="#6366f1", fill=false) => ({
  padding:"0.45rem 1rem", borderRadius:6, cursor:"pointer", fontSize:"0.8rem",
  border:`1px solid ${accent}`, fontFamily:"inherit",
  background: fill ? accent : "rgba(15,23,42,0.7)",
  color: fill ? "#fff" : accent, transition:"all 0.15s",
});
const lbl = { display:"block", fontSize:"0.68rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 };
const sec = { marginBottom:"1rem" };

const LIBRARY_KEY = "__quest_library__";

// ─── Main ──────────────────────────────────────────────────────
export default function QuestEditorPanel({ supabase }) {
  const [library, setLibrary]           = useState([]);
  const [activeQuestId, setActiveQuestId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectMode, setConnectMode]   = useState(false);
  const [connectFrom, setConnectFrom]   = useState(null);
  const [dragging, setDragging]         = useState(null);
  const [pan, setPan]                   = useState({ x:0, y:0 });
  const [panStart, setPanStart]         = useState(null);
  const [zoom, setZoom]                 = useState(1);
  const [fullscreen, setFullscreen]     = useState(false);
  const [hideLeft, setHideLeft]         = useState(false);
  const [hideRight, setHideRight]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saveOk, setSaveOk]             = useState(false);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const canvasRef = useRef(null);

  // Load
  useEffect(() => {
    supabase.from("party_state").select("combat").eq("party_code", LIBRARY_KEY).maybeSingle()
      .then(({ data }) => { setLibrary(data?.combat?.quests || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = (e) => { if(e.key==="Escape") setFullscreen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  async function saveLibrary(lib, confirm=false) {
    setSaving(true);
    try {
      const { error } = await supabase.from("party_state").upsert(
        { party_code: LIBRARY_KEY, combat: { quests: lib }, updated_at: new Date().toISOString() },
        { onConflict: "party_code" }
      );
      if(error) throw error;
      if(confirm) { setSaveOk(true); setTimeout(()=>setSaveOk(false),2000); }
    } catch(e) { alert("Errore: " + (e?.message||e)); }
    finally { setSaving(false); }
  }

  const updateLibrary = useCallback((fn) => {
    setLibrary(prev => { const next = fn(prev); saveLibrary(next); return next; });
  }, []);

  const activeQuest = library.find(q => q.id === activeQuestId) || null;
  const selectedNode = activeQuest?.nodes?.[selectedNodeId] || null;
  const questNodes = activeQuest ? Object.values(activeQuest.nodes || {}) : [];

  // ── Quest CRUD ──
  function createQuest() {
    const q = newQuest();
    updateLibrary(lib => [...lib, q]);
    setActiveQuestId(q.id);
    setSelectedNodeId(null);
  }
  function deleteQuest(id) {
    if(!window.confirm("Eliminare questa missione?")) return;
    updateLibrary(lib => lib.filter(q => q.id !== id));
    if(activeQuestId===id) { setActiveQuestId(null); setSelectedNodeId(null); }
  }
  function updateQuest(patch) {
    updateLibrary(lib => lib.map(q => q.id===activeQuestId ? { ...q, ...patch, updatedAt:Date.now() } : q));
  }

  // ── Node CRUD ──
  function createNode(type) {
    if(!activeQuestId) return;
    const n = newNode(type);
    const idx = questNodes.length;
    const pos = { x:100+(idx%4)*240, y:60+Math.floor(idx/4)*180 };
    updateLibrary(lib => lib.map(q => q.id!==activeQuestId ? q : {
      ...q,
      nodes: { ...q.nodes, [n.id]: n },
      nodePositions: { ...q.nodePositions, [n.id]: pos },
      startNode: q.startNode || n.id,
    }));
    setSelectedNodeId(n.id);
    setShowNodeMenu(false);
  }

  function deleteNode(nId) {
    if(!window.confirm("Eliminare questo nodo?")) return;
    updateLibrary(lib => lib.map(q => {
      if(q.id!==activeQuestId) return q;
      const nodes = { ...q.nodes };
      const np = { ...q.nodePositions };
      delete nodes[nId]; delete np[nId];
      return { ...q, nodes, nodePositions:np, startNode:q.startNode===nId?null:q.startNode };
    }));
    if(selectedNodeId===nId) setSelectedNodeId(null);
  }

  function updateNode(nId, patch) {
    updateLibrary(lib => lib.map(q => q.id!==activeQuestId ? q : {
      ...q, nodes: { ...q.nodes, [nId]: { ...q.nodes[nId], ...patch } }
    }));
  }

  // ── Node positions ──
  function updateNodePos(nId, pos) {
    setLibrary(prev => prev.map(q => q.id!==activeQuestId ? q : {
      ...q, nodePositions: { ...q.nodePositions, [nId]: pos }
    }));
  }

  // ── Connections ──
  function handlePortClick(nodeId, slot) {
    if(!connectMode) return;
    if(!connectFrom) { setConnectFrom({ nodeId, slot }); return; }
    const { nodeId:fromId, slot:fromSlot } = connectFrom;
    if(fromId===nodeId) { setConnectFrom(null); return; }
    const n = activeQuest?.nodes?.[fromId];
    if(!n) { setConnectFrom(null); return; }
    let patch = {};
    if(fromSlot==="next")           patch = { next: nodeId };
    else if(fromSlot==="success")   patch = { combat:{ ...n.combat, successNext:nodeId } };
    else if(fromSlot==="failure")   patch = { combat:{ ...n.combat, failureNext:nodeId } };
    else if(typeof fromSlot==="number") {
      const choices = [...(n.choices||[])];
      if(choices[fromSlot]) choices[fromSlot] = { ...choices[fromSlot], next:nodeId };
      patch = { choices };
    }
    updateNode(fromId, patch);
    setConnectFrom(null);
  }

  // ── Canvas ──
  function onCanvasMouseDown(e) {
    if(e.target!==canvasRef.current && !e.target.classList.contains("qe-canvas-bg")) return;
    setPanStart({ x:e.clientX-pan.x, y:e.clientY-pan.y });
  }
  function onCanvasMouseMove(e) {
    if(panStart) setPan({ x:e.clientX-panStart.x, y:e.clientY-panStart.y });
    if(dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX-rect.left-pan.x)/zoom - dragging.ox;
      const y = (e.clientY-rect.top -pan.y)/zoom - dragging.oy;
      updateNodePos(dragging.nodeId, { x, y });
    }
  }
  function onCanvasMouseUp() {
    if(dragging) saveLibrary(library);
    setPanStart(null); setDragging(null);
  }
  function onWheel(e) {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(2.5, z - e.deltaY*0.001)));
  }

  // ── Export ──
  function exportQuest() {
    if(!activeQuest) return;
    const json = JSON.stringify(activeQuest, null, 2);
    const blob = new Blob([json],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`${activeQuest.id}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Build connections ──
  function buildConnections() {
    const conns = [];
    if(!activeQuest) return conns;
    const positions = activeQuest.nodePositions || {};
    Object.values(activeQuest.nodes || {}).forEach(n => {
      const from = positions[n.id];
      if(!from) return;
      const add = (toId, label, color="#475569") => {
        const to = positions[toId];
        if(!to||!toId) return;
        conns.push({ fromId:n.id, toId, label, color, from, to });
      };
      if(n.next) add(n.next, "→", "#6366f1");
      n.choices?.forEach((c,i) => c.next && add(c.next,
        c.quality==="good" ? "✅" : c.quality==="neutral" ? "⚠️" : "❌",
        c.quality==="good" ? "#34d399" : c.quality==="neutral" ? "#fbbf24" : "#f87171"
      ));
      if(n.combat?.successNext) add(n.combat.successNext, "⚔️ Vittoria", "#34d399");
      if(n.combat?.failureNext) add(n.combat.failureNext, "💀 Sconfitta", "#f87171");
    });
    return conns;
  }
  const connections = buildConnections();

  if(loading) return <div style={{ padding:"2rem", color:"#64748b" }}>Caricamento...</div>;

  return (
    <div style={{
      display:"flex", flexDirection:"column", overflow:"hidden", background:"rgba(2,6,23,0.98)",
      ...(fullscreen ? { position:"fixed", inset:0, zIndex:9999, boxShadow:"0 0 0 3px #f87171" } : { height:"100%" }),
    }}>

      {/* ── TOP BAR ── */}
      <div style={{ display:"flex", gap:8, padding:"0.6rem 1rem", borderBottom:"1px solid #1e293b", background:"rgba(2,6,23,0.98)", flexShrink:0, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontFamily:"'Cinzel',serif", color:"#f87171", fontWeight:700, fontSize:"0.9rem", marginRight:4 }}>⚔️ Quest Builder</span>
        <div style={{ flex:1 }}/>
        {activeQuest && (
          <button style={btn(saveOk?"#22c55e":"#0ea5e9", saveOk)} onClick={()=>saveLibrary(library,true)} disabled={saving}>
            {saving ? "⏳..." : saveOk ? "✅ Salvato!" : "💾 Salva"}
          </button>
        )}
        {activeQuest && (
          <button style={btn(connectMode?"#c084fc":"#c084fc", connectMode)} onClick={()=>setConnectMode(m=>!m)}>
            {connectMode ? "🔗 Collega ON" : "🔗 Collega nodi"}
          </button>
        )}
        {activeQuest && <button style={btn("#34d399")} onClick={exportQuest}>📥 Esporta JSON</button>}
        <button style={btn("#22c55e",true)} onClick={createQuest}>+ Nuova Missione</button>
        <div style={{ width:1, height:20, background:"#1e293b" }}/>
        <button style={btn("#475569")} onClick={()=>setHideLeft(v=>!v)}>{hideLeft?"▶":"◀"}</button>
        <button style={btn("#475569")} onClick={()=>setHideRight(v=>!v)}>{hideRight?"◀":"▶"}</button>
        <button style={btn(fullscreen?"#f87171":"#a78bfa", fullscreen)} onClick={()=>setFullscreen(v=>!v)}>
          {fullscreen ? "✕ Esci" : "⛶ Fullscreen"}
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── LEFT SIDEBAR ── */}
        {!hideLeft && (
          <div style={{ width:240, flexShrink:0, borderRight:"1px solid #1e293b", display:"flex", flexDirection:"column", overflowY:"auto", background:"rgba(2,6,23,0.9)" }}>
            <div style={{ padding:"0.7rem" }}>
              <div style={{ color:"#475569", fontSize:"0.64rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Missioni ({library.length})</div>
              {library.length===0 && <div style={{ color:"#334155", fontSize:"0.78rem" }}>Nessuna missione. Creane una!</div>}
              {library.map(q => (
                <div key={q.id} onClick={()=>{ setActiveQuestId(q.id); setSelectedNodeId(null); }}
                  style={{ padding:"0.4rem 0.55rem", borderRadius:5, marginBottom:3, cursor:"pointer",
                    background:activeQuestId===q.id?"rgba(239,68,68,0.15)":"rgba(15,23,42,0.6)",
                    border:`1px solid ${activeQuestId===q.id?"#991b1b":"#1e293b"}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"0.82rem", color:"#e2d9c5" }}>{q.emoji} {q.title}</span>
                    <button style={{ background:"none", border:"none", color:"#7f1d1d", cursor:"pointer", fontSize:"0.7rem" }}
                      onClick={e=>{e.stopPropagation();deleteQuest(q.id)}} title="Elimina">✕</button>
                  </div>
                  <div style={{ fontSize:"0.64rem", color:"#475569", marginTop:1 }}>
                    {q.difficulty} · {Object.keys(q.nodes||{}).length} nodi
                  </div>
                </div>
              ))}
            </div>

            {/* Quest properties */}
            {activeQuest && (
              <div style={{ padding:"0.7rem", borderTop:"1px solid #1e293b" }}>
                <div style={{ color:"#475569", fontSize:"0.64rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Proprietà Missione</div>
                <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                  <input style={{...inp,width:36,textAlign:"center",flexShrink:0}} value={activeQuest.emoji} onChange={e=>updateQuest({emoji:e.target.value})} />
                  <input style={{...inp,flex:1}} value={activeQuest.title} onChange={e=>updateQuest({title:e.target.value})} placeholder="Titolo" />
                </div>
                <select style={{...inp,marginBottom:4}} value={activeQuest.difficulty} onChange={e=>updateQuest({difficulty:e.target.value})}>
                  {DIFFICULTIES.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                <textarea style={{...inp,height:52,resize:"vertical",fontSize:"0.76rem"}} value={activeQuest.flavor||""} onChange={e=>updateQuest({flavor:e.target.value})} placeholder="Frase iniziale / atmosfera..." />
                <div style={{ marginTop:6 }}>
                  <label style={lbl}>Nodo iniziale</label>
                  <select style={inp} value={activeQuest.startNode||""} onChange={e=>updateQuest({startNode:e.target.value||null})}>
                    <option value="">— nessuno —</option>
                    {questNodes.map(n=><option key={n.id} value={n.id}>{getNodeType(n.type).icon} {n.title}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CANVAS ── */}
        <div style={{ flex:1, position:"relative", overflow:"hidden", background:"#020617", cursor:connectMode?"crosshair":panStart?"grabbing":"default" }}
          ref={canvasRef}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          onMouseLeave={onCanvasMouseUp}
          onWheel={onWheel}
        >
          {/* Grid */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
            <defs>
              <pattern id="qgrid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(${pan.x%40} ${pan.y%40})`}>
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#qgrid)" />
          </svg>

          {!activeQuest && (
            <div className="qe-canvas-bg" style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, pointerEvents:"none" }}>
              <div style={{ fontSize:"3rem" }}>⚔️</div>
              <div style={{ color:"#334155", fontFamily:"'Cinzel',serif" }}>Seleziona o crea una missione</div>
            </div>
          )}

          {/* Add node button */}
          {activeQuest && (
            <div style={{ position:"absolute", top:12, left:12, zIndex:20, display:"flex", gap:6, flexWrap:"wrap" }}>
              <button style={{...btn("#f87171",true), position:"relative"}} onClick={()=>setShowNodeMenu(m=>!m)}>+ Nodo</button>
              {showNodeMenu && (
                <div style={{ position:"absolute", top:"110%", left:0, background:"rgba(2,6,23,0.98)", border:"1px solid #334155", borderRadius:8, padding:6, display:"grid", gap:4, minWidth:210, zIndex:100 }}>
                  {NODE_TYPES.map(nt => (
                    <button key={nt.type} onClick={()=>createNode(nt.type)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"0.45rem 0.7rem", borderRadius:6, cursor:"pointer",
                        background:nt.bg, border:`1px solid ${nt.border}`, color:nt.color, fontFamily:"inherit", fontSize:"0.82rem" }}>
                      {nt.icon} {nt.label}
                    </button>
                  ))}
                </div>
              )}
              {connectMode && !connectFrom && (
                <div style={{ background:"rgba(192,132,252,0.1)", border:"1px solid #7e22ce", borderRadius:6, padding:"0.3rem 0.7rem", color:"#c084fc", fontSize:"0.78rem" }}>
                  Clicca su una porta di uscita
                </div>
              )}
              {connectMode && connectFrom && (
                <div style={{ background:"rgba(192,132,252,0.2)", border:"1px solid #c084fc", borderRadius:6, padding:"0.3rem 0.7rem", color:"#c084fc", fontSize:"0.78rem" }}>
                  Clicca sul nodo di destinazione
                </div>
              )}
            </div>
          )}

          {/* World */}
          <div style={{ position:"absolute", transformOrigin:"0 0", transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`, width:"100%", height:"100%", pointerEvents:"none" }}>

            {/* SVG arrows */}
            <svg style={{ position:"absolute", left:0, top:0, width:"9999px", height:"9999px", pointerEvents:"none", overflow:"visible" }}>
              {connections.map((conn,i) => {
                const x1=conn.from.x+NODE_W, y1=conn.from.y+NODE_H/2;
                const x2=conn.to.x,          y2=conn.to.y+NODE_H/2;
                const cx=(x1+x2)/2;
                const d=`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke={conn.color} strokeWidth={2} opacity={0.7}/>
                    <polygon points={`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`} fill={conn.color} opacity={0.9}/>
                    <text x={(x1+x2)/2} y={(y1+y2)/2-5} textAnchor="middle" fill={conn.color} fontSize="10" opacity={0.8}>{conn.label}</text>
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {activeQuest && questNodes.map(n => {
              const pos = activeQuest.nodePositions?.[n.id] || { x:0, y:0 };
              const nt = getNodeType(n.type);
              const isSelected = selectedNodeId===n.id;
              const isStart = activeQuest.startNode===n.id;
              return (
                <div key={n.id} style={{ position:"absolute", left:pos.x, top:pos.y, width:NODE_W, pointerEvents:"all",
                  cursor:dragging?.nodeId===n.id?"grabbing":"grab", userSelect:"none", zIndex:isSelected?10:1 }}
                  onMouseDown={e=>{
                    e.stopPropagation();
                    const rect=canvasRef.current.getBoundingClientRect();
                    const cx=(e.clientX-rect.left-pan.x)/zoom;
                    const cy=(e.clientY-rect.top -pan.y)/zoom;
                    setDragging({ nodeId:n.id, ox:cx-pos.x, oy:cy-pos.y });
                    setSelectedNodeId(n.id);
                  }}
                >
                  <div style={{ background:nt.bg, border:`2px solid ${isSelected?nt.color:nt.border}`, borderRadius:8,
                    boxShadow:isSelected?`0 0 0 2px ${nt.color}44`:"none", overflow:"hidden", minHeight:NODE_H }}>
                    <div style={{ padding:"0.4rem 0.6rem", background:`${nt.color}22`, borderBottom:`1px solid ${nt.border}`, display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ fontSize:"0.9rem" }}>{nt.icon}</span>
                      <span style={{ fontSize:"0.72rem", color:nt.color, fontFamily:"'Cinzel',serif", fontWeight:700, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{n.title}</span>
                      {isStart && <span style={{ fontSize:"0.6rem", color:"#fbbf24", flexShrink:0 }}>▶ START</span>}
                    </div>
                    <div style={{ padding:"0.35rem 0.6rem", fontSize:"0.68rem", color:"#94a3b8" }}>
                      <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:185 }}>
                        {n.type==="combat" ? `⚔️ ${n.combat?.enemies?.length||0} nemici`
                         : n.type==="choice" ? `🔀 ${n.choices?.length||0} scelte`
                         : n.type==="reward" ? `💰 ${n.reward?.xp||0}xp ${n.reward?.gold||0}g`
                         : n.type==="end" ? "🏁 Missione completata"
                         : n.text?.slice(0,55)||"(nessun testo)"}
                      </div>
                      <div style={{ color:"#475569", marginTop:2, fontSize:"0.6rem" }}>{n.id}</div>
                    </div>
                    <div style={{ display:"flex", justifyContent:"flex-end", gap:3, padding:"0.2rem 0.5rem 0.3rem" }}>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"#64748b", fontSize:"0.66rem", padding:1 }}
                        onClick={e=>{e.stopPropagation();updateQuest({startNode:n.id})}} title="Imposta come Start">▶</button>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"#7f1d1d", fontSize:"0.66rem", padding:1 }}
                        onClick={e=>{e.stopPropagation();deleteNode(n.id)}} title="Elimina">✕</button>
                    </div>
                  </div>
                  <QuestPorts node={n} onPortClick={handlePortClick} connectMode={connectMode} connectFrom={connectFrom} color={nt.color} />
                </div>
              );
            })}
          </div>

          {/* Zoom */}
          <div style={{ position:"absolute", bottom:12, right:12, display:"flex", flexDirection:"column", gap:4, zIndex:20 }}>
            <button style={btn()} onClick={()=>setZoom(z=>Math.min(2.5,z+0.1))}>+</button>
            <button style={{...btn(),textAlign:"center",fontSize:"0.68rem",padding:"0.3rem"}} onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>{Math.round(zoom*100)}%</button>
            <button style={btn()} onClick={()=>setZoom(z=>Math.max(0.3,z-0.1))}>−</button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        {!hideRight && (
          <div style={{ width:320, flexShrink:0, borderLeft:"1px solid #1e293b", overflowY:"auto", background:"rgba(2,6,23,0.95)", padding:"0.8rem" }}>
            {selectedNode ? (
              <NodeEditor
                key={selectedNode.id}
                node={selectedNode}
                allNodes={activeQuest?.nodes||{}}
                onUpdate={patch=>updateNode(selectedNodeId,patch)}
                onClose={()=>setSelectedNodeId(null)}
              />
            ) : (
              <div style={{ textAlign:"center", padding:"2rem 0.5rem", color:"#334155" }}>
                <div style={{ fontSize:"2rem", marginBottom:8 }}>👈</div>
                <div style={{ fontSize:"0.82rem" }}>Clicca su un nodo per modificarlo</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Connection Ports ──────────────────────────────────────────
function QuestPorts({ node, onPortClick, connectMode, connectFrom, color }) {
  if(!connectMode) return null;
  const isFrom = connectFrom?.nodeId === node.id;
  const portStyle = (active) => ({
    width:12, height:12, borderRadius:"50%", border:`2px solid ${active?"#fbbf24":color}`,
    background:active?"#fbbf24":"rgba(2,6,23,0.9)", cursor:"pointer", display:"inline-block",
  });
  const ports = [];
  if(node.type==="narrative"||node.type==="reward") ports.push({ slot:"next", label:"→" });
  if(node.type==="combat") {
    ports.push({ slot:"success", label:"✅" }, { slot:"failure", label:"💀" });
  }
  if(node.type==="choice") {
    node.choices?.forEach((c,i) => ports.push({ slot:i, label:c.quality==="good"?"✅":c.quality==="neutral"?"⚠️":"❌" }));
  }
  return (
    <>
      <div style={{ position:"absolute", left:-8, top:"50%", transform:"translateY(-50%)" }}
        onClick={e=>{e.stopPropagation();onPortClick(node.id,"input");}}>
        <div style={{...portStyle(false), background:!isFrom&&connectFrom?"#4f46e5":"rgba(2,6,23,0.9)"}} />
      </div>
      <div style={{ position:"absolute", right:-8, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:4 }}>
        {ports.map(p => (
          <div key={String(p.slot)} onClick={e=>{e.stopPropagation();onPortClick(node.id,p.slot);}} title={p.label}>
            <div style={portStyle(isFrom && connectFrom?.slot===p.slot)} />
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Node Editor (pannello destro) ────────────────────────────
function NodeEditor({ node, allNodes, onUpdate, onClose }) {
  const nt = getNodeType(node.type);
  const nodeOptions = Object.values(allNodes).map(n=>({ id:n.id, title:n.title, type:n.type }));

  function NodeSelect({ value, onChange }) {
    return (
      <select style={inp} value={value||""} onChange={e=>onChange(e.target.value||null)}>
        <option value="">— nessuno —</option>
        {nodeOptions.map(n=><option key={n.id} value={n.id}>{getNodeType(n.type).icon} {n.title}</option>)}
      </select>
    );
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.8rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:"1.1rem" }}>{nt.icon}</span>
          <span style={{ fontFamily:"'Cinzel',serif", color:nt.color, fontWeight:700, fontSize:"0.88rem" }}>{nt.label}</span>
        </div>
        <button style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"0.9rem" }} onClick={onClose}>✕</button>
      </div>

      {/* Tipo */}
      <div style={sec}>
        <label style={lbl}>Tipo nodo</label>
        <select style={{...inp,borderColor:nt.border}} value={node.type} onChange={e=>onUpdate({type:e.target.value})}>
          {NODE_TYPES.map(t=><option key={t.type} value={t.type}>{t.icon} {t.label}</option>)}
        </select>
      </div>

      {/* Titolo */}
      <div style={sec}>
        <label style={lbl}>Titolo nodo</label>
        <input style={inp} value={node.title} onChange={e=>onUpdate({title:e.target.value})} />
      </div>

      {/* Testo narrativo (tutti tranne end) */}
      {node.type!=="end" && (
        <div style={sec}>
          <label style={lbl}>Testo narrativo</label>
          <textarea style={{...inp,height:110,resize:"vertical"}} value={node.text||""} onChange={e=>onUpdate({text:e.target.value})}
            placeholder="Scrivi il testo della scena che i player vedranno..." />
        </div>
      )}

      <hr style={{ border:"none", borderTop:"1px solid #1e293b", margin:"0.8rem 0" }} />

      {/* NARRATIVE */}
      {node.type==="narrative" && (
        <div style={sec}>
          <label style={lbl}>Prossimo nodo</label>
          <NodeSelect value={node.next} onChange={v=>onUpdate({next:v})} />
        </div>
      )}

      {/* CHOICE */}
      {node.type==="choice" && (
        <ChoicesEditor node={node} onUpdate={onUpdate} NodeSelect={NodeSelect} />
      )}

      {/* COMBAT */}
      {node.type==="combat" && (
        <CombatNodeEditor node={node} onUpdate={onUpdate} NodeSelect={NodeSelect} />
      )}

      {/* REWARD */}
      {node.type==="reward" && (
        <>
          <div style={sec}>
            <label style={{...lbl,color:"#34d399"}}>💰 Ricompense</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              <div>
                <label style={lbl}>XP</label>
                <input style={inp} type="number" value={node.reward?.xp||0} onChange={e=>onUpdate({reward:{...node.reward,xp:+e.target.value}})} />
              </div>
              <div>
                <label style={lbl}>Oro</label>
                <input style={inp} type="number" value={node.reward?.gold||0} onChange={e=>onUpdate({reward:{...node.reward,gold:+e.target.value}})} />
              </div>
            </div>
          </div>
          <div style={sec}>
            <label style={lbl}>Prossimo nodo</label>
            <NodeSelect value={node.next} onChange={v=>onUpdate({next:v})} />
          </div>
        </>
      )}

      {/* END */}
      {node.type==="end" && (
        <div style={{ color:"#fde68a", fontSize:"0.82rem", textAlign:"center", padding:"1rem 0" }}>
          🏁 Questo nodo completa la missione.<br/>
          <span style={{ color:"#64748b", fontSize:"0.74rem" }}>I player ricevono XP e oro dalla missione principale.</span>
        </div>
      )}
    </div>
  );
}

// ─── Choices Editor ────────────────────────────────────────────
function ChoicesEditor({ node, onUpdate, NodeSelect }) {
  const choices = node.choices || [];
  const QUALITY_COLORS = { good:"#34d399", neutral:"#fbbf24", bad:"#f87171" };
  const QUALITY_LABELS = { good:"✅ Buona", neutral:"⚠️ Media", bad:"❌ Sbagliata" };

  function updateChoice(i, patch) {
    onUpdate({ choices: choices.map((c,j) => j===i ? {...c,...patch} : c) });
  }

  return (
    <div style={sec}>
      {choices.map((c,i) => (
        <div key={i} style={{ background:`${QUALITY_COLORS[c.quality]}11`, border:`1px solid ${QUALITY_COLORS[c.quality]}55`, borderRadius:6, padding:"0.6rem", marginBottom:8 }}>
          <div style={{ fontSize:"0.72rem", fontWeight:700, color:QUALITY_COLORS[c.quality], marginBottom:6 }}>
            {QUALITY_LABELS[c.quality] || c.quality}
          </div>
          <label style={lbl}>Testo bottone</label>
          <input style={{...inp,marginBottom:5}} value={c.label||""} onChange={e=>updateChoice(i,{label:e.target.value})} placeholder="Testo della scelta..." />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:5 }}>
            <div>
              <label style={lbl}>XP bonus</label>
              <input style={inp} type="number" value={c.xp||0} onChange={e=>updateChoice(i,{xp:+e.target.value})} />
            </div>
            <div>
              <label style={lbl}>Oro bonus</label>
              <input style={inp} type="number" value={c.gold||0} onChange={e=>updateChoice(i,{gold:+e.target.value})} />
            </div>
          </div>
          <label style={lbl}>Prossimo nodo</label>
          <NodeSelect value={c.next} onChange={v=>updateChoice(i,{next:v})} />
        </div>
      ))}
    </div>
  );
}

// ─── Combat Node Editor ────────────────────────────────────────
function CombatNodeEditor({ node, onUpdate, NodeSelect }) {
  const cm = node.combat || { enemies:[], successNext:null, failureNext:null };
  const up = patch => onUpdate({ combat:{...cm,...patch} });

  function addEnemy() {
    up({ enemies:[...(cm.enemies||[]), { id:"e_"+uid(), name:"Nemico", emoji:"👹", hp:20, max_hp:20, atk:6, def:2, mag:0, init:5, xp:50, gold:10 }] });
  }
  function updateEnemy(i, patch) {
    up({ enemies:(cm.enemies||[]).map((e,j)=>j===i?{...e,...patch}:e) });
  }
  function removeEnemy(i) {
    up({ enemies:(cm.enemies||[]).filter((_,j)=>j!==i) });
  }

  return (
    <div>
      <div style={sec}>
        <label style={{...lbl,color:"#34d399"}}>⚔️ Vittoria → nodo</label>
        <NodeSelect value={cm.successNext} onChange={v=>up({successNext:v})} />
      </div>
      <div style={sec}>
        <label style={{...lbl,color:"#f87171"}}>💀 Sconfitta → nodo</label>
        <NodeSelect value={cm.failureNext} onChange={v=>up({failureNext:v})} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <label style={{...lbl,marginBottom:0,color:"#f87171"}}>Nemici ({cm.enemies?.length||0})</label>
        <button style={btn("#f87171")} onClick={addEnemy}>+ Aggiungi</button>
      </div>
      {(cm.enemies||[]).map((e,i) => (
        <div key={i} style={{ background:"rgba(127,29,29,0.15)", border:"1px solid #991b1b", borderRadius:6, padding:"0.5rem", marginBottom:6 }}>
          <div style={{ display:"flex", gap:4, marginBottom:5 }}>
            <input style={{...inp,width:36,textAlign:"center",flexShrink:0}} value={e.emoji} onChange={ev=>updateEnemy(i,{emoji:ev.target.value})} />
            <input style={{...inp,flex:1}} value={e.name} onChange={ev=>updateEnemy(i,{name:ev.target.value})} placeholder="Nome nemico" />
            <button style={{ background:"none", border:"none", color:"#7f1d1d", cursor:"pointer", fontSize:"0.9rem" }} onClick={()=>removeEnemy(i)}>🗑</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4 }}>
            {[["hp","❤️HP"],["atk","⚔️ATK"],["def","🛡️DEF"],["mag","✨MAG"],["init","⚡INIT"],["xp","⭐XP"],["gold","💰Oro"]].map(([k,ico])=>(
              <div key={k}>
                <label style={{...lbl,fontSize:"0.58rem"}}>{ico}</label>
                <input style={{...inp,padding:"2px 4px",fontSize:"0.74rem",textAlign:"center"}} type="number" value={e[k]||0}
                  onChange={ev=>updateEnemy(i,{[k]:+ev.target.value,...(k==="hp"?{max_hp:+ev.target.value}:{})})} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
