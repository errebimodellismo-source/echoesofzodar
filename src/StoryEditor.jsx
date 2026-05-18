/**
 * StoryEditor — Editor visuale di storie per Echoes of Zodar
 * Layout: left sidebar | canvas | right panel
 */
import { useState, useRef, useEffect, useCallback } from "react";

// ─── Costanti ──────────────────────────────────────────────────
const NODE_TYPES = [
  { type:"story",       label:"Scena Narrativa",      icon:"📜", color:"#6366f1", bg:"rgba(99,102,241,0.18)",  border:"#4f46e5" },
  { type:"choice",      label:"Scelta / Bivio",       icon:"🔀", color:"#fbbf24", bg:"rgba(180,83,9,0.18)",   border:"#b45309" },
  { type:"skillCheck",  label:"Prova Abilità",        icon:"🎲", color:"#c084fc", bg:"rgba(88,28,135,0.22)",  border:"#7e22ce" },
  { type:"combat",      label:"Combattimento",        icon:"⚔️", color:"#f87171", bg:"rgba(127,29,29,0.22)", border:"#991b1b" },
  { type:"reward",      label:"Ricompensa",           icon:"💰", color:"#34d399", bg:"rgba(6,78,59,0.2)",    border:"#065f46" },
  { type:"returnPoint", label:"Rientro Linea Princ.", icon:"🔁", color:"#fb923c", bg:"rgba(120,53,15,0.18)", border:"#92400e" },
  { type:"ending",      label:"Finale Capitolo",      icon:"🏁", color:"#fde68a", bg:"rgba(120,53,15,0.22)", border:"#92400e" },
  { type:"gameOver",    label:"Game Over",            icon:"💀", color:"#ff4444", bg:"rgba(80,0,0,0.3)",     border:"#7f1d1d" },
];

const NODE_W = 200;
const NODE_H = 80;

const STATS = ["atk","def","mag","init","hp"];
const ENDING_TYPES = ["good","neutral","fail","secret"];
const DIFFICULTIES = ["facile","normale","difficile","epico"];
const STATUS_OPTIONS = ["bozza","pubblicata","bloccata"];

function uid() {
  return Math.random().toString(36).slice(2,10);
}

function newScene(type = "story", chapterId = "") {
  return {
    id: "scena_" + uid(),
    chapterId,
    type,
    title: "Nuova scena",
    text: "",
    nextScene: null,
    choices: [],
    skillCheck: null,
    combat: null,
    rewards: null,
    requirements: null,
    setFlags: {},
    gameOver: null,
    endingType: null,
    isReturnPoint: type === "returnPoint",
    masterNotes: "",
  };
}

function newChapter(storyId) {
  return {
    id: "cap_" + uid(),
    storyId,
    title: "Nuovo Capitolo",
    startScene: null,
    status: "bozza",
    order: 0,
  };
}

function newStory() {
  return {
    id: "storia_" + uid(),
    version: "v2",
    title: "Nuova Storia",
    emoji: "📖",
    description: "",
    difficulty: "normale",
    tags: [],
    minPlayers: 1,
    maxPlayers: 6,
    status: "bozza",
    chapters: [],
    scenes: {},
    nodePositions: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ─── Stili base ────────────────────────────────────────────────
const inp = {
  background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6,
  color:"#e2e8f0", padding:"0.45rem 0.7rem", fontSize:"0.84rem", width:"100%",
  boxSizing:"border-box", outline:"none",
};
const btn = (accent="#6366f1", fill=false) => ({
  padding:"0.45rem 1rem", borderRadius:6, cursor:"pointer", fontSize:"0.8rem",
  border:`1px solid ${accent}`, fontFamily:"inherit",
  background: fill ? accent : "rgba(15,23,42,0.7)",
  color: fill ? "#fff" : accent,
  transition:"all 0.15s",
});
const label = { display:"block", fontSize:"0.68rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 };
const section = { marginBottom:"1rem" };

function getNodeType(type) {
  return NODE_TYPES.find(n=>n.type===type) || NODE_TYPES[0];
}

// ─── Main StoryEditorPanel ─────────────────────────────────────
export default function StoryEditorPanel({ dbGetPartyState, dbSavePartyState, STORIES: builtinStories = [], onLaunchPreview }) {
  const [library, setLibrary] = useState([]); // custom stories
  const [activeStoryId, setActiveStoryId] = useState(null);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState(null); // { sceneId, slot } slot = "next"|"success"|"failure"|"retry"|choiceIdx
  const [dragging, setDragging] = useState(null); // { sceneId, ox, oy }
  const [pan, setPan] = useState({ x:0, y:0 });
  const [panStart, setPanStart] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const canvasRef = useRef(null);

  const LIBRARY_KEY = "__story_library__";

  // Load
  useEffect(() => {
    dbGetPartyState(LIBRARY_KEY).then(data => {
      setLibrary(data?.stories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function saveLibrary(lib) {
    setSaving(true);
    try {
      const current = await dbGetPartyState(LIBRARY_KEY) || {};
      await dbSavePartyState(LIBRARY_KEY, { ...current, stories: lib });
    } finally { setSaving(false); }
  }

  const updateLibrary = useCallback((fn) => {
    setLibrary(prev => {
      const next = fn(prev);
      saveLibrary(next);
      return next;
    });
  }, []);

  // Derived
  const activeStory = library.find(s => s.id === activeStoryId) || null;
  const activeChapter = activeStory?.chapters?.find(c => c.id === activeChapterId) || null;
  const chapterScenes = activeChapter
    ? Object.values(activeStory.scenes || {}).filter(sc => sc.chapterId === activeChapterId)
    : [];
  const selectedScene = activeStory?.scenes?.[selectedSceneId] || null;

  // ── Story CRUD ──
  function createStory() {
    const s = newStory();
    updateLibrary(lib => [...lib, s]);
    setActiveStoryId(s.id);
    setActiveChapterId(null);
    setSelectedSceneId(null);
  }

  function deleteStory(id) {
    if(!window.confirm("Eliminare questa storia?")) return;
    updateLibrary(lib => lib.filter(s => s.id !== id));
    if(activeStoryId === id) { setActiveStoryId(null); setActiveChapterId(null); setSelectedSceneId(null); }
  }

  function duplicateStory(story) {
    const copy = { ...story, id:"storia_"+uid(), title:story.title+" (copia)", createdAt:Date.now(), updatedAt:Date.now() };
    updateLibrary(lib => [...lib, copy]);
    setActiveStoryId(copy.id);
  }

  function updateStory(id, patch) {
    updateLibrary(lib => lib.map(s => s.id===id ? { ...s, ...patch, updatedAt:Date.now() } : s));
  }

  // ── Chapter CRUD ──
  function createChapter() {
    if(!activeStoryId) return;
    const ch = newChapter(activeStoryId);
    ch.order = (activeStory?.chapters?.length || 0);
    updateLibrary(lib => lib.map(s => s.id===activeStoryId ? { ...s, chapters:[...s.chapters, ch] } : s));
    setActiveChapterId(ch.id);
    setSelectedSceneId(null);
  }

  function deleteChapter(chId) {
    if(!window.confirm("Eliminare il capitolo e tutte le sue scene?")) return;
    updateLibrary(lib => lib.map(s => {
      if(s.id !== activeStoryId) return s;
      const scenes = { ...s.scenes };
      Object.keys(scenes).forEach(k => { if(scenes[k].chapterId===chId) delete scenes[k]; });
      return { ...s, chapters:s.chapters.filter(c=>c.id!==chId), scenes };
    }));
    if(activeChapterId===chId) { setActiveChapterId(null); setSelectedSceneId(null); }
  }

  function updateChapter(chId, patch) {
    updateLibrary(lib => lib.map(s => s.id!==activeStoryId ? s : {
      ...s, chapters:s.chapters.map(c => c.id===chId ? {...c,...patch} : c)
    }));
  }

  // ── Scene CRUD ──
  function createScene(type) {
    if(!activeChapterId || !activeStoryId) return;
    const sc = newScene(type, activeChapterId);
    // Place in canvas at center-ish
    const pos = { x:100+(chapterScenes.length%4)*240, y:80+Math.floor(chapterScenes.length/4)*160 };
    updateLibrary(lib => lib.map(s => s.id!==activeStoryId ? s : {
      ...s,
      scenes: { ...s.scenes, [sc.id]: sc },
      nodePositions: { ...s.nodePositions, [sc.id]: pos },
    }));
    // Set as startScene of chapter if first scene
    if(chapterScenes.length === 0) {
      updateChapter(activeChapterId, { startScene: sc.id });
    }
    setSelectedSceneId(sc.id);
    setShowNodeMenu(false);
  }

  function deleteScene(scId) {
    if(!window.confirm("Eliminare questa scena?")) return;
    updateLibrary(lib => lib.map(s => {
      if(s.id!==activeStoryId) return s;
      const scenes = { ...s.scenes };
      delete scenes[scId];
      const np = { ...s.nodePositions };
      delete np[scId];
      return { ...s, scenes, nodePositions:np };
    }));
    if(selectedSceneId===scId) setSelectedSceneId(null);
  }

  function duplicateScene(scId) {
    const sc = activeStory?.scenes?.[scId];
    if(!sc) return;
    const copy = { ...sc, id:"scena_"+uid(), title:sc.title+" (copia)" };
    const origPos = activeStory?.nodePositions?.[scId] || {x:0,y:0};
    updateLibrary(lib => lib.map(s => s.id!==activeStoryId ? s : {
      ...s,
      scenes: { ...s.scenes, [copy.id]: copy },
      nodePositions: { ...s.nodePositions, [copy.id]: { x:origPos.x+220, y:origPos.y } },
    }));
    setSelectedSceneId(copy.id);
  }

  function updateScene(scId, patch) {
    updateLibrary(lib => lib.map(s => s.id!==activeStoryId ? s : {
      ...s, scenes: { ...s.scenes, [scId]: { ...s.scenes[scId], ...patch } }
    }));
  }

  // ── Node positions ──
  function updateNodePos(scId, pos) {
    setLibrary(prev => prev.map(s => s.id!==activeStoryId ? s : {
      ...s, nodePositions: { ...s.nodePositions, [scId]: pos }
    }));
  }

  function saveNodePositions() {
    saveLibrary(library);
  }

  // ── Connections ──
  function handlePortClick(sceneId, slot) {
    if(!connectMode) return;
    if(!connectFrom) {
      setConnectFrom({ sceneId, slot });
    } else {
      // Connect: connectFrom → (sceneId as target)
      const { sceneId:fromId, slot:fromSlot } = connectFrom;
      if(fromId === sceneId) { setConnectFrom(null); return; }
      const sc = activeStory?.scenes?.[fromId];
      if(!sc) { setConnectFrom(null); return; }
      let patch = {};
      if(fromSlot === "next") patch = { nextScene: sceneId };
      else if(fromSlot === "success") patch = { skillCheck:{ ...sc.skillCheck, successScene:sceneId } };
      else if(fromSlot === "failure") {
        if(sc.type==="skillCheck") patch = { skillCheck:{ ...sc.skillCheck, failureScene:sceneId } };
        else if(sc.type==="combat") patch = { combat:{ ...sc.combat, failureScene:sceneId } };
        else if(sc.type==="gameOver") patch = { gameOver:{ ...sc.gameOver, retryScene:sceneId } };
      }
      else if(fromSlot === "combatWin") patch = { combat:{ ...sc.combat, successScene:sceneId } };
      else if(fromSlot === "combatLose") patch = { combat:{ ...sc.combat, failureScene:sceneId } };
      else if(fromSlot === "retry") patch = { gameOver:{ ...sc.gameOver, retryScene:sceneId } };
      else if(typeof fromSlot === "number") {
        const choices = [...(sc.choices||[])];
        if(choices[fromSlot]) choices[fromSlot] = { ...choices[fromSlot], nextScene:sceneId };
        patch = { choices };
      }
      updateScene(fromId, patch);
      setConnectFrom(null);
    }
  }

  // ── Canvas drag ──
  function onCanvasMouseDown(e) {
    if(e.target !== canvasRef.current && !e.target.classList.contains("canvas-bg")) return;
    setPanStart({ x:e.clientX - pan.x, y:e.clientY - pan.y });
  }

  function onCanvasMouseMove(e) {
    if(panStart) {
      setPan({ x:e.clientX - panStart.x, y:e.clientY - panStart.y });
    }
    if(dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom - dragging.ox;
      const y = (e.clientY - rect.top  - pan.y) / zoom - dragging.oy;
      updateNodePos(dragging.sceneId, { x, y });
    }
  }

  function onCanvasMouseUp() {
    if(dragging) saveNodePositions();
    setPanStart(null);
    setDragging(null);
  }

  function onWheel(e) {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(2.5, z - e.deltaY * 0.001)));
  }

  // ── Export / Import ──
  function exportStory() {
    if(!activeStory) return;
    const json = JSON.stringify(activeStory, null, 2);
    const blob = new Blob([json], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`${activeStory.id}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  function importStory() {
    try {
      const parsed = JSON.parse(importJson);
      if(!parsed.id || !parsed.title) { alert("JSON non valido: mancano id o title"); return; }
      const story = { ...newStory(), ...parsed, id:"storia_"+uid(), updatedAt:Date.now() };
      updateLibrary(lib => [...lib, story]);
      setActiveStoryId(story.id);
      setShowImport(false);
      setImportJson("");
    } catch(e) { alert("Errore parsing JSON: " + e.message); }
  }

  // ── Build connections list ──
  function buildConnections(scenes, positions) {
    const conns = [];
    Object.values(scenes||{}).filter(sc=>sc.chapterId===activeChapterId).forEach(sc => {
      const from = positions?.[sc.id];
      if(!from) return;
      const addConn = (toId, label, color="#475569", style="solid") => {
        const to = positions?.[toId];
        if(!to || !toId) return;
        conns.push({ fromId:sc.id, toId, label, color, style, from, to });
      };
      if(sc.nextScene) addConn(sc.nextScene, "→", "#6366f1");
      sc.choices?.forEach((c,i) => c.nextScene && addConn(c.nextScene, c.text?.slice(0,14)||`Scelta ${i+1}`, "#fbbf24"));
      if(sc.skillCheck?.successScene) addConn(sc.skillCheck.successScene, "✅ Successo", "#34d399");
      if(sc.skillCheck?.failureScene) addConn(sc.skillCheck.failureScene, "❌ Fallimento", "#f87171");
      if(sc.combat?.successScene) addConn(sc.combat.successScene, "⚔️ Vittoria", "#34d399");
      if(sc.combat?.failureScene) addConn(sc.combat.failureScene, "💀 Sconfitta", "#f87171");
      if(sc.gameOver?.retryScene) addConn(sc.gameOver.retryScene, "🔄 Riprova", "#fb923c", "dashed");
    });
    return conns;
  }

  const connections = activeStory ? buildConnections(activeStory.scenes, activeStory.nodePositions) : [];

  if(loading) return <div style={{ padding:"2rem", color:"#64748b" }}>Caricamento...</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", background:"rgba(2,6,23,0.95)" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display:"flex", gap:8, padding:"0.6rem 1rem", borderBottom:"1px solid #1e293b", background:"rgba(2,6,23,0.98)", flexShrink:0, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700, fontSize:"0.9rem", marginRight:4 }}>✏️ Story Builder</span>
        {saving && <span style={{ color:"#64748b", fontSize:"0.74rem" }}>Salvataggio...</span>}
        <div style={{ flex:1 }}/>
        {activeStory && (
          <>
            <button style={btn("#c084fc")} onClick={()=>setConnectMode(m=>!m)}>
              {connectMode ? "🔗 Modalità collega ON" : "🔗 Collega nodi"}
            </button>
            <button style={btn("#34d399")} onClick={exportStory}>📥 Esporta JSON</button>
            {onLaunchPreview && activeChapterId && (
              <button style={btn("#fbbf24", true)} onClick={()=>onLaunchPreview(activeStory, activeChapterId)}>▶️ Prova Capitolo</button>
            )}
          </>
        )}
        <button style={btn("#6366f1")} onClick={()=>setShowImport(s=>!s)}>📤 Importa JSON</button>
        <button style={btn("#22c55e",true)} onClick={createStory}>+ Nuova Storia</button>
      </div>

      {/* Import panel */}
      {showImport && (
        <div style={{ padding:"0.8rem 1rem", borderBottom:"1px solid #1e293b", background:"rgba(15,23,42,0.98)", flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <textarea style={{...inp, flex:1, height:64, resize:"vertical"}} value={importJson} onChange={e=>setImportJson(e.target.value)} placeholder='Incolla il JSON della storia qui...' />
            <button style={btn("#22c55e",true)} onClick={importStory}>Importa</button>
            <button style={btn()} onClick={()=>setShowImport(false)}>✕</button>
          </div>
        </div>
      )}

      {/* ── BODY: left | canvas | right ── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width:240, flexShrink:0, borderRight:"1px solid #1e293b", display:"flex", flexDirection:"column", overflowY:"auto", background:"rgba(2,6,23,0.9)" }}>
          {/* Story list */}
          <div style={{ padding:"0.7rem", borderBottom:"1px solid #1e293b" }}>
            <div style={{ color:"#475569", fontSize:"0.64rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Storie</div>
            {/* Builtin stories label */}
            {builtinStories.length > 0 && (
              <div style={{ marginBottom:4 }}>
                <div style={{ color:"#334155", fontSize:"0.62rem", marginBottom:3 }}>— Demo (sola lettura) —</div>
                {builtinStories.map(s => (
                  <div key={s.id} style={{ padding:"0.35rem 0.55rem", borderRadius:5, marginBottom:2, background:"rgba(30,41,59,0.5)", border:"1px solid #1e293b", opacity:0.6 }}>
                    <span style={{ fontSize:"0.78rem", color:"#94a3b8" }}>{s.emoji} {s.title}</span>
                  </div>
                ))}
              </div>
            )}
            {library.length === 0 && <div style={{ color:"#334155", fontSize:"0.78rem" }}>Nessuna storia custom. Creane una!</div>}
            {library.map(s => (
              <div key={s.id} onClick={()=>{ setActiveStoryId(s.id); setActiveChapterId(null); setSelectedSceneId(null); }}
                style={{ padding:"0.4rem 0.55rem", borderRadius:5, marginBottom:2, cursor:"pointer",
                  background: activeStoryId===s.id ? "rgba(99,102,241,0.2)" : "rgba(15,23,42,0.6)",
                  border:`1px solid ${activeStoryId===s.id?"#4f46e5":"#1e293b"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"0.82rem", color:"#e2d9c5" }}>{s.emoji} {s.title}</span>
                  <div style={{ display:"flex", gap:3 }}>
                    <button style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"0.7rem", padding:1 }} onClick={e=>{e.stopPropagation();duplicateStory(s)}} title="Duplica">⧉</button>
                    <button style={{ background:"none", border:"none", color:"#7f1d1d", cursor:"pointer", fontSize:"0.7rem", padding:1 }} onClick={e=>{e.stopPropagation();deleteStory(s.id)}} title="Elimina">✕</button>
                  </div>
                </div>
                <div style={{ fontSize:"0.64rem", color:"#475569", marginTop:1 }}>{s.chapters?.length||0} cap · {s.status}</div>
              </div>
            ))}
          </div>

          {/* Story meta (if selected) */}
          {activeStory && (
            <div style={{ padding:"0.7rem", borderBottom:"1px solid #1e293b" }}>
              <div style={{ color:"#475569", fontSize:"0.64rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Proprietà Storia</div>
              <input style={{...inp,marginBottom:4}} value={activeStory.title} onChange={e=>updateStory(activeStoryId,{title:e.target.value})} placeholder="Titolo" />
              <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                <input style={{...inp,width:36,textAlign:"center",flexShrink:0}} value={activeStory.emoji} onChange={e=>updateStory(activeStoryId,{emoji:e.target.value})} />
                <select style={{...inp,flex:1}} value={activeStory.status} onChange={e=>updateStory(activeStoryId,{status:e.target.value})}>
                  {STATUS_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <textarea style={{...inp,height:46,resize:"vertical",fontSize:"0.76rem",marginBottom:4}} value={activeStory.description} onChange={e=>updateStory(activeStoryId,{description:e.target.value})} placeholder="Descrizione..." />
              <div style={{ display:"flex", gap:4 }}>
                <select style={{...inp,flex:1}} value={activeStory.difficulty} onChange={e=>updateStory(activeStoryId,{difficulty:e.target.value})}>
                  {DIFFICULTIES.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Chapter list */}
          {activeStory && (
            <div style={{ padding:"0.7rem", flex:1, overflowY:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <div style={{ color:"#475569", fontSize:"0.64rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>Capitoli</div>
                <button style={{ background:"none", border:"1px solid #334155", borderRadius:4, color:"#6366f1", cursor:"pointer", fontSize:"0.7rem", padding:"1px 6px" }} onClick={createChapter}>+ Cap</button>
              </div>
              {activeStory.chapters?.map(ch => (
                <div key={ch.id} onClick={()=>{ setActiveChapterId(ch.id); setSelectedSceneId(null); setPan({x:0,y:0}); setZoom(1); }}
                  style={{ padding:"0.35rem 0.55rem", borderRadius:5, marginBottom:3, cursor:"pointer",
                    background:activeChapterId===ch.id?"rgba(251,191,36,0.12)":"rgba(15,23,42,0.5)",
                    border:`1px solid ${activeChapterId===ch.id?"#b45309":"#1e293b"}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"0.8rem", color:activeChapterId===ch.id?"#fbbf24":"#e2d9c5" }}>{ch.title}</span>
                    <button style={{ background:"none", border:"none", color:"#7f1d1d", cursor:"pointer", fontSize:"0.68rem", padding:1 }} onClick={e=>{e.stopPropagation();deleteChapter(ch.id)}}>✕</button>
                  </div>
                  <div style={{ fontSize:"0.62rem", color:"#475569" }}>
                    {Object.values(activeStory.scenes||{}).filter(s=>s.chapterId===ch.id).length} scene · {ch.status}
                  </div>
                </div>
              ))}
              {activeStory.chapters?.length===0 && <div style={{ color:"#334155", fontSize:"0.74rem" }}>Nessun capitolo. Creane uno!</div>}
            </div>
          )}
        </div>

        {/* ── CANVAS ── */}
        <div style={{ flex:1, position:"relative", overflow:"hidden", background:"#020617", cursor:connectMode?"crosshair":panStart?"grabbing":"default" }}
          ref={canvasRef}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          onMouseLeave={onCanvasMouseUp}
          onWheel={onWheel}
        >
          {/* Grid background */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(${pan.x%40} ${pan.y%40})`}>
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {!activeChapterId && (
            <div className="canvas-bg" style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, pointerEvents:"none" }}>
              <div style={{ fontSize:"3rem" }}>📖</div>
              <div style={{ color:"#334155", fontFamily:"'Cinzel',serif" }}>{activeStory ? "Seleziona o crea un capitolo" : "Seleziona o crea una storia"}</div>
            </div>
          )}

          {/* Add node button */}
          {activeChapterId && (
            <div style={{ position:"absolute", top:12, left:12, zIndex:20, display:"flex", gap:6, flexWrap:"wrap" }}>
              <button style={{...btn("#6366f1",true),position:"relative"}} onClick={()=>setShowNodeMenu(m=>!m)}>
                + Nodo
              </button>
              {showNodeMenu && (
                <div style={{ position:"absolute", top:"110%", left:0, background:"rgba(2,6,23,0.98)", border:"1px solid #334155", borderRadius:8, padding:6, display:"grid", gap:4, minWidth:200, zIndex:100 }}>
                  {NODE_TYPES.map(nt => (
                    <button key={nt.type} onClick={()=>createScene(nt.type)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"0.45rem 0.7rem", borderRadius:6, cursor:"pointer",
                        background:nt.bg, border:`1px solid ${nt.border}`, color:nt.color, fontFamily:"inherit", fontSize:"0.82rem" }}>
                      {nt.icon} {nt.label}
                    </button>
                  ))}
                </div>
              )}
              {connectMode && connectFrom && (
                <div style={{ background:"rgba(192,132,252,0.2)", border:"1px solid #c084fc", borderRadius:6, padding:"0.3rem 0.7rem", color:"#c084fc", fontSize:"0.78rem" }}>
                  Clicca su una porta del nodo di destinazione
                </div>
              )}
              {connectMode && !connectFrom && (
                <div style={{ background:"rgba(192,132,252,0.1)", border:"1px solid #7e22ce", borderRadius:6, padding:"0.3rem 0.7rem", color:"#c084fc", fontSize:"0.78rem" }}>
                  Clicca su una porta di uscita
                </div>
              )}
            </div>
          )}

          {/* Transformed world */}
          <div style={{ position:"absolute", transformOrigin:"0 0", transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`, width:"100%", height:"100%", pointerEvents:"none" }}>

            {/* SVG connections */}
            <svg style={{ position:"absolute", left:0, top:0, width:"9999px", height:"9999px", pointerEvents:"none", overflow:"visible" }}>
              {connections.map((conn, i) => {
                const x1 = conn.from.x + NODE_W;
                const y1 = conn.from.y + NODE_H/2;
                const x2 = conn.to.x;
                const y2 = conn.to.y + NODE_H/2;
                const cx = (x1+x2)/2;
                const d = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
                const midX = (x1+x2)/2;
                const midY = (y1+y2)/2;
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke={conn.color} strokeWidth={conn.style==="dashed"?1.5:2}
                      strokeDasharray={conn.style==="dashed"?"6,4":undefined} opacity={0.7} />
                    <polygon points={`${x2},${y2} ${x2-8},${y2-5} ${x2-8},${y2+5}`} fill={conn.color} opacity={0.9} />
                    {conn.label && (
                      <text x={midX} y={midY-5} textAnchor="middle" fill={conn.color} fontSize="10" opacity={0.8}>{conn.label}</text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Node cards */}
            {activeStory && chapterScenes.map(sc => {
              const pos = activeStory.nodePositions?.[sc.id] || { x:0, y:0 };
              const nt = getNodeType(sc.type);
              const isSelected = selectedSceneId === sc.id;
              const isStartScene = activeChapter?.startScene === sc.id;
              return (
                <div key={sc.id}
                  style={{ position:"absolute", left:pos.x, top:pos.y, width:NODE_W, pointerEvents:"all",
                    cursor:dragging?.sceneId===sc.id?"grabbing":"grab", userSelect:"none",
                    zIndex:isSelected?10:1 }}
                  onMouseDown={e=>{
                    e.stopPropagation();
                    const rect = canvasRef.current.getBoundingClientRect();
                    const cx = (e.clientX - rect.left - pan.x) / zoom;
                    const cy = (e.clientY - rect.top  - pan.y) / zoom;
                    setDragging({ sceneId:sc.id, ox:cx-pos.x, oy:cy-pos.y });
                    setSelectedSceneId(sc.id);
                  }}
                >
                  {/* Node box */}
                  <div style={{ background:nt.bg, border:`2px solid ${isSelected?nt.color:nt.border}`, borderRadius:8,
                    boxShadow:isSelected?`0 0 0 2px ${nt.color}44`:"none", overflow:"hidden", minHeight:NODE_H }}>
                    {/* Header */}
                    <div style={{ padding:"0.4rem 0.6rem", background:`${nt.color}22`, borderBottom:`1px solid ${nt.border}`, display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ fontSize:"0.9rem" }}>{nt.icon}</span>
                      <span style={{ fontSize:"0.72rem", color:nt.color, fontFamily:"'Cinzel',serif", fontWeight:700, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sc.title}</span>
                      {isStartScene && <span style={{ fontSize:"0.6rem", color:"#fbbf24", flexShrink:0 }}>▶ START</span>}
                    </div>
                    {/* Body */}
                    <div style={{ padding:"0.35rem 0.6rem", fontSize:"0.68rem", color:"#94a3b8" }}>
                      <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>{sc.text?.slice(0,60)||"(nessun testo)"}</div>
                      <div style={{ color:"#475569", marginTop:2, fontSize:"0.62rem" }}>ID: {sc.id}</div>
                    </div>
                    {/* Buttons row */}
                    <div style={{ display:"flex", justifyContent:"flex-end", gap:3, padding:"0.2rem 0.5rem 0.35rem" }}>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"#64748b", fontSize:"0.68rem", padding:1 }} onClick={e=>{e.stopPropagation();if(window.confirm("Imposta come scena iniziale?"))updateChapter(activeChapterId,{startScene:sc.id})}} title="Imposta come Start">▶</button>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"#64748b", fontSize:"0.68rem", padding:1 }} onClick={e=>{e.stopPropagation();duplicateScene(sc.id)}} title="Duplica">⧉</button>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"#7f1d1d", fontSize:"0.68rem", padding:1 }} onClick={e=>{e.stopPropagation();deleteScene(sc.id)}} title="Elimina">✕</button>
                    </div>
                  </div>

                  {/* Connection ports */}
                  <ConnectionPorts scene={sc} onPortClick={handlePortClick} connectMode={connectMode} connectFrom={connectFrom} color={nt.color} />
                </div>
              );
            })}
          </div>

          {/* Zoom controls */}
          <div style={{ position:"absolute", bottom:12, right:12, display:"flex", flexDirection:"column", gap:4, zIndex:20 }}>
            <button style={btn()} onClick={()=>setZoom(z=>Math.min(2.5,z+0.1))}>+</button>
            <button style={{...btn(),textAlign:"center",fontSize:"0.68rem",padding:"0.3rem"}} onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>{Math.round(zoom*100)}%</button>
            <button style={btn()} onClick={()=>setZoom(z=>Math.max(0.3,z-0.1))}>−</button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ width:320, flexShrink:0, borderLeft:"1px solid #1e293b", overflowY:"auto", background:"rgba(2,6,23,0.95)", padding:"0.8rem" }}>
          {!selectedScene && activeChapter && (
            <ChapterEditor chapter={activeChapter} onUpdate={patch=>updateChapter(activeChapterId,patch)} scenes={chapterScenes} onSetStart={scId=>updateChapter(activeChapterId,{startScene:scId})} />
          )}
          {selectedScene && (
            <SceneEditor
              key={selectedScene.id}
              scene={selectedScene}
              allScenes={activeStory?.scenes||{}}
              onUpdate={patch=>updateScene(selectedSceneId,patch)}
              onClose={()=>setSelectedSceneId(null)}
              chapterId={activeChapterId}
            />
          )}
          {!selectedScene && !activeChapter && (
            <div style={{ textAlign:"center", padding:"2rem 0.5rem", color:"#334155" }}>
              <div style={{ fontSize:"2rem", marginBottom:8 }}>👈</div>
              <div style={{ fontSize:"0.82rem" }}>Seleziona una storia e un capitolo</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Connection Ports ──────────────────────────────────────────
function ConnectionPorts({ scene, onPortClick, connectMode, connectFrom, color }) {
  if(!connectMode) return null;
  const isFrom = connectFrom?.sceneId === scene.id;
  const portStyle = (active) => ({
    width:12, height:12, borderRadius:"50%", border:`2px solid ${active?"#fbbf24":color}`,
    background:active?"#fbbf24":"rgba(2,6,23,0.9)", cursor:"pointer", display:"inline-block",
    transition:"all 0.15s",
  });
  const ports = [];
  if(scene.type==="story"||scene.type==="reward"||scene.type==="returnPoint"||scene.type==="rest") {
    ports.push({ slot:"next", label:"→" });
  }
  if(scene.type==="skillCheck") {
    ports.push({ slot:"success", label:"✅" }, { slot:"failure", label:"❌" });
  }
  if(scene.type==="combat") {
    ports.push({ slot:"combatWin", label:"⚔️" }, { slot:"combatLose", label:"💀" });
  }
  if(scene.type==="gameOver") {
    ports.push({ slot:"retry", label:"🔄" });
  }
  if(scene.type==="choice") {
    (scene.choices||[]).forEach((c,i) => ports.push({ slot:i, label:c.text?.slice(0,8)||`C${i+1}` }));
  }
  // Always: input port (left side, for being a target)
  return (
    <>
      {/* Input port (left) */}
      <div style={{ position:"absolute", left:-8, top:"50%", transform:"translateY(-50%)" }}
        onClick={e=>{e.stopPropagation();onPortClick(scene.id,"input");}}>
        <div style={{...portStyle(!isFrom), background:!isFrom&&connectFrom?"#4f46e5":"rgba(2,6,23,0.9)"}} title="Destinazione" />
      </div>
      {/* Output ports (right) */}
      <div style={{ position:"absolute", right:-8, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:4, alignItems:"center" }}>
        {ports.map(p => (
          <div key={p.slot} onClick={e=>{e.stopPropagation();onPortClick(scene.id,p.slot);}} title={`Porta: ${p.label}`}>
            <div style={portStyle(isFrom && connectFrom?.slot===p.slot)} />
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Chapter Editor ────────────────────────────────────────────
function ChapterEditor({ chapter, onUpdate, scenes, onSetStart }) {
  return (
    <div>
      <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700, marginBottom:"0.8rem" }}>📖 Capitolo</div>
      <div style={section}>
        <label style={label}>Titolo</label>
        <input style={inp} value={chapter.title} onChange={e=>onUpdate({title:e.target.value})} />
      </div>
      <div style={section}>
        <label style={label}>Stato</label>
        <select style={inp} value={chapter.status} onChange={e=>onUpdate({status:e.target.value})}>
          {STATUS_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div style={section}>
        <label style={label}>Ordine</label>
        <input style={inp} type="number" value={chapter.order||0} onChange={e=>onUpdate({order:+e.target.value})} />
      </div>
      <div style={section}>
        <label style={label}>Scena iniziale</label>
        <select style={inp} value={chapter.startScene||""} onChange={e=>onSetStart(e.target.value)}>
          <option value="">— nessuna —</option>
          {scenes.map(sc=><option key={sc.id} value={sc.id}>{sc.title}</option>)}
        </select>
      </div>
      <div style={{ color:"#475569", fontSize:"0.74rem", marginTop:"1rem" }}>
        Clicca su un nodo nel canvas per modificarlo.
      </div>
    </div>
  );
}

// ─── Scene Editor ──────────────────────────────────────────────
function SceneEditor({ scene, allScenes, onUpdate, onClose }) {
  const nt = getNodeType(scene.type);
  const sceneOptions = Object.values(allScenes).map(s=>({ id:s.id, title:s.title }));

  function SceneSelect({ value, onChange, placeholder="— nessuna —" }) {
    return (
      <select style={inp} value={value||""} onChange={e=>onChange(e.target.value||null)}>
        <option value="">{placeholder}</option>
        {sceneOptions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
      </select>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.8rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:"1.1rem" }}>{nt.icon}</span>
          <span style={{ fontFamily:"'Cinzel',serif", color:nt.color, fontWeight:700, fontSize:"0.88rem" }}>{nt.label}</span>
        </div>
        <button style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"0.9rem" }} onClick={onClose}>✕</button>
      </div>

      {/* Type selector */}
      <div style={section}>
        <label style={label}>Tipo nodo</label>
        <select style={{...inp,borderColor:nt.border}} value={scene.type} onChange={e=>onUpdate({type:e.target.value,isReturnPoint:e.target.value==="returnPoint"})}>
          {NODE_TYPES.map(nt=><option key={nt.type} value={nt.type}>{nt.icon} {nt.label}</option>)}
        </select>
      </div>

      {/* ID */}
      <div style={section}>
        <label style={label}>ID scena</label>
        <input style={{...inp,fontFamily:"monospace",fontSize:"0.76rem"}} value={scene.id} onChange={e=>onUpdate({id:e.target.value})} />
      </div>

      {/* Title */}
      <div style={section}>
        <label style={label}>Titolo</label>
        <input style={inp} value={scene.title} onChange={e=>onUpdate({title:e.target.value})} />
      </div>

      {/* Text */}
      <div style={section}>
        <label style={label}>Testo narrativo</label>
        <textarea style={{...inp,height:120,resize:"vertical"}} value={scene.text||""} onChange={e=>onUpdate({text:e.target.value})} placeholder="Scrivi il testo della scena...&#10;&#10;Usa *corsivo* per enfasi, &quot;virgolette&quot; per dialoghi." />
      </div>

      {/* Master notes */}
      <div style={section}>
        <label style={label}>Note del Master (private)</label>
        <textarea style={{...inp,height:48,resize:"vertical",fontSize:"0.76rem",color:"#94a3b8"}} value={scene.masterNotes||""} onChange={e=>onUpdate({masterNotes:e.target.value})} placeholder="Note interne, suggerimenti di roleplay..." />
      </div>

      <hr style={{ border:"none", borderTop:"1px solid #1e293b", margin:"0.8rem 0" }} />

      {/* Type-specific fields */}

      {/* STORY / RETURNPOINT / REST: nextScene */}
      {(scene.type==="story"||scene.type==="returnPoint"||scene.type==="rest") && (
        <div style={section}>
          <label style={label}>Prossima scena</label>
          <SceneSelect value={scene.nextScene} onChange={v=>onUpdate({nextScene:v})} />
        </div>
      )}

      {/* CHOICE */}
      {scene.type==="choice" && (
        <ChoicesEditor scene={scene} onUpdate={onUpdate} SceneSelect={SceneSelect} />
      )}

      {/* SKILL CHECK */}
      {scene.type==="skillCheck" && (
        <SkillCheckEditor scene={scene} onUpdate={onUpdate} SceneSelect={SceneSelect} />
      )}

      {/* COMBAT */}
      {scene.type==="combat" && (
        <CombatEditor scene={scene} onUpdate={onUpdate} SceneSelect={SceneSelect} />
      )}

      {/* REWARD */}
      {scene.type==="reward" && (
        <>
          <RewardsEditor rewards={scene.rewards} onChange={r=>onUpdate({rewards:r})} />
          <div style={section}>
            <label style={label}>Prossima scena (dopo ricompensa)</label>
            <SceneSelect value={scene.nextScene} onChange={v=>onUpdate({nextScene:v})} />
          </div>
        </>
      )}

      {/* ENDING */}
      {scene.type==="ending" && (
        <>
          <div style={section}>
            <label style={label}>Tipo finale</label>
            <select style={inp} value={scene.endingType||"good"} onChange={e=>onUpdate({endingType:e.target.value})}>
              {ENDING_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <RewardsEditor rewards={scene.rewards} onChange={r=>onUpdate({rewards:r})} />
          <div style={section}>
            <label style={label}>Prossimo capitolo (scena iniziale)</label>
            <SceneSelect value={scene.nextScene} onChange={v=>onUpdate({nextScene:v})} />
          </div>
        </>
      )}

      {/* GAME OVER */}
      {scene.type==="gameOver" && (
        <div style={section}>
          <label style={label}>Scena di ritentativo (checkpoint)</label>
          <SceneSelect value={scene.gameOver?.retryScene} onChange={v=>onUpdate({gameOver:{...scene.gameOver,retryScene:v}})} />
          <label style={{...label,marginTop:6}}>Testo game over</label>
          <textarea style={{...inp,height:48,resize:"vertical"}} value={scene.gameOver?.text||""} onChange={e=>onUpdate({gameOver:{...scene.gameOver,text:e.target.value}})} placeholder="Descrizione del fallimento..." />
        </div>
      )}

      <hr style={{ border:"none", borderTop:"1px solid #1e293b", margin:"0.8rem 0" }} />

      {/* FLAGS */}
      <FlagsEditor
        setFlags={scene.setFlags||{}}
        requirements={scene.requirements}
        onSetFlags={f=>onUpdate({setFlags:f})}
        onRequirements={r=>onUpdate({requirements:r})}
      />
    </div>
  );
}

// ─── Choices Editor ────────────────────────────────────────────
function ChoicesEditor({ scene, onUpdate, SceneSelect }) {
  const choices = scene.choices || [];

  function updateChoice(i, patch) {
    const next = choices.map((c,j)=>j===i?{...c,...patch}:c);
    onUpdate({ choices:next });
  }
  function addChoice() {
    onUpdate({ choices:[...choices, { text:"Nuova scelta", nextScene:null, requirements:null, setFlags:{} }] });
  }
  function removeChoice(i) {
    onUpdate({ choices:choices.filter((_,j)=>j!==i) });
  }

  return (
    <div style={section}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <label style={{...label,marginBottom:0}}>Scelte ({choices.length})</label>
        <button style={btn("#fbbf24")} onClick={addChoice}>+ Aggiungi</button>
      </div>
      {choices.map((c,i) => (
        <div key={i} style={{ background:"rgba(180,83,9,0.1)", border:"1px solid #b45309", borderRadius:6, padding:"0.6rem", marginBottom:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <span style={{ color:"#fbbf24", fontSize:"0.72rem", fontWeight:700 }}>Scelta {i+1}</span>
            <button style={{ background:"none", border:"none", color:"#7f1d1d", cursor:"pointer", fontSize:"0.72rem" }} onClick={()=>removeChoice(i)}>✕</button>
          </div>
          <label style={label}>Testo bottone</label>
          <input style={{...inp,marginBottom:4}} value={c.text||""} onChange={e=>updateChoice(i,{text:e.target.value})} placeholder="Testo della scelta..." />
          <label style={label}>Destinazione</label>
          <SceneSelect value={c.nextScene} onChange={v=>updateChoice(i,{nextScene:v})} />
          <label style={{...label,marginTop:5}}>Set flag (nome=valore, uno per riga)</label>
          <textarea style={{...inp,height:36,resize:"vertical",fontSize:"0.72rem",marginBottom:4}} value={flagsToText(c.setFlags||{})} onChange={e=>updateChoice(i,{setFlags:textToFlags(e.target.value)})} placeholder="nome_flag=true" />
          <label style={label}>Requisito flag (nome=valore, uno per riga)</label>
          <textarea style={{...inp,height:36,resize:"vertical",fontSize:"0.72rem"}} value={flagsToText(c.requirements?.flags||{})} onChange={e=>updateChoice(i,{requirements:{...c.requirements,flags:textToFlags(e.target.value)}})} placeholder="nome_flag=true (necessario per mostrare)" />
        </div>
      ))}
    </div>
  );
}

// ─── SkillCheck Editor ─────────────────────────────────────────
function SkillCheckEditor({ scene, onUpdate, SceneSelect }) {
  const sc = scene.skillCheck || {};
  const up = patch => onUpdate({ skillCheck:{...sc,...patch} });
  return (
    <div style={section}>
      <label style={{...label,color:"#c084fc"}}>⚙️ Prova di abilità</label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:6 }}>
        <div>
          <label style={label}>Statistica</label>
          <select style={inp} value={sc.stat||"atk"} onChange={e=>up({stat:e.target.value})}>
            {STATS.map(s=><option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>DC (difficoltà)</label>
          <input style={inp} type="number" value={sc.dc||10} onChange={e=>up({dc:+e.target.value})} />
        </div>
      </div>
      <label style={label}>Scena successo</label>
      <SceneSelect value={sc.successScene} onChange={v=>up({successScene:v})} />
      <label style={{...label,marginTop:5}}>Testo successo</label>
      <input style={{...inp,marginBottom:5}} value={sc.successText||""} onChange={e=>up({successText:e.target.value})} placeholder="Descrizione breve del successo" />
      <label style={label}>Scena fallimento</label>
      <SceneSelect value={sc.failureScene} onChange={v=>up({failureScene:v})} />
      <label style={{...label,marginTop:5}}>Testo fallimento</label>
      <input style={inp} value={sc.failureText||""} onChange={e=>up({failureText:e.target.value})} placeholder="Descrizione breve del fallimento" />
    </div>
  );
}

// ─── Combat Editor ─────────────────────────────────────────────
function CombatEditor({ scene, onUpdate, SceneSelect }) {
  const cm = scene.combat || { monsters:[] };
  const up = patch => onUpdate({ combat:{...cm,...patch} });

  function addMonster() {
    up({ monsters:[...(cm.monsters||[]), { id:"m_"+uid(), name:"Nemico", emoji:"👹", hp:20, max_hp:20, atk:6, def:3, mag:0, init:5, xp:50, gold:10 }] });
  }
  function updateMonster(i, patch) {
    const next = (cm.monsters||[]).map((m,j)=>j===i?{...m,...patch}:m);
    up({ monsters:next });
  }
  function removeMonster(i) {
    up({ monsters:(cm.monsters||[]).filter((_,j)=>j!==i) });
  }

  return (
    <div style={section}>
      <label style={{...label,color:"#f87171"}}>⚙️ Combattimento</label>
      <label style={label}>Scena vittoria</label>
      <SceneSelect value={cm.successScene} onChange={v=>up({successScene:v})} />
      <label style={{...label,marginTop:5}}>Scena sconfitta</label>
      <SceneSelect value={cm.failureScene} onChange={v=>up({failureScene:v})} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, marginBottom:4 }}>
        <label style={{...label,marginBottom:0}}>Nemici ({cm.monsters?.length||0})</label>
        <button style={btn("#f87171")} onClick={addMonster}>+ Aggiungi</button>
      </div>
      {(cm.monsters||[]).map((m,i) => (
        <div key={i} style={{ background:"rgba(127,29,29,0.15)", border:"1px solid #991b1b", borderRadius:6, padding:"0.5rem", marginBottom:5 }}>
          <div style={{ display:"flex", gap:4, marginBottom:4 }}>
            <input style={{...inp,width:36,textAlign:"center"}} value={m.emoji} onChange={e=>updateMonster(i,{emoji:e.target.value})} />
            <input style={{...inp,flex:1}} value={m.name} onChange={e=>updateMonster(i,{name:e.target.value})} placeholder="Nome" />
            <button style={{ background:"none", border:"none", color:"#7f1d1d", cursor:"pointer" }} onClick={()=>removeMonster(i)}>✕</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:3 }}>
            {[["hp","❤️"],["atk","⚔️"],["def","🛡️"],["mag","✨"],["init","⚡"],["xp","⭐"],["gold","💰"]].map(([k,ico])=>(
              <div key={k}>
                <label style={{...label,fontSize:"0.6rem"}}>{ico}{k}</label>
                <input style={{...inp,padding:"2px 4px",fontSize:"0.74rem",textAlign:"center"}} type="number" value={m[k]||0} onChange={e=>updateMonster(i,{[k]:+e.target.value,[k==="hp"?"max_hp":k]:k==="hp"?+e.target.value:m[k==="hp"?"max_hp":k]})} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Rewards Editor ────────────────────────────────────────────
function RewardsEditor({ rewards, onChange }) {
  const r = rewards || {};
  const up = patch => onChange({ ...r, ...patch });
  return (
    <div style={section}>
      <label style={{...label,color:"#34d399"}}>💰 Ricompense</label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
        <div>
          <label style={label}>XP</label>
          <input style={inp} type="number" value={r.xp||0} onChange={e=>up({xp:+e.target.value})} />
        </div>
        <div>
          <label style={label}>Oro</label>
          <input style={inp} type="number" value={r.gold||0} onChange={e=>up({gold:+e.target.value})} />
        </div>
      </div>
    </div>
  );
}

// ─── Flags Editor ──────────────────────────────────────────────
function FlagsEditor({ setFlags, requirements, onSetFlags, onRequirements }) {
  return (
    <div style={section}>
      <label style={{...label,color:"#a5b4fc"}}>🚩 Flag narrativi</label>
      <label style={{...label,marginTop:0}}>Imposta flag (nome=valore, uno per riga)</label>
      <textarea style={{...inp,height:52,resize:"vertical",fontSize:"0.74rem",fontFamily:"monospace",marginBottom:6}} value={flagsToText(setFlags||{})} onChange={e=>onSetFlags(textToFlags(e.target.value))} placeholder={"helped_wanderer=true\nfound_key=true"} />
      <label style={label}>Richiedi flag (nome=valore, uno per riga)</label>
      <textarea style={{...inp,height:52,resize:"vertical",fontSize:"0.74rem",fontFamily:"monospace"}} value={flagsToText(requirements?.flags||{})} onChange={e=>onRequirements({...requirements,flags:textToFlags(e.target.value)})} placeholder={"found_key=true\nquest_done=true"} />
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────
function flagsToText(flags) {
  return Object.entries(flags||{}).map(([k,v])=>`${k}=${v}`).join("\n");
}
function textToFlags(text) {
  const result = {};
  text.split("\n").forEach(line => {
    const [k,...rest] = line.trim().split("=");
    if(k.trim()) {
      const val = rest.join("=").trim();
      result[k.trim()] = val==="true"?true:val==="false"?false:val||true;
    }
  });
  return result;
}
