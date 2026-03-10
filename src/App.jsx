import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

/* ══════════════════════════════════════════════
   FONTS & GLOBAL CSS
══════════════════════════════════════════════ */
(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400;1,600&display=swap";
  document.head.appendChild(link);
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes goldenGlow { 0%,100%{text-shadow:0 0 20px rgba(251,191,36,.5)} 50%{text-shadow:0 0 50px rgba(251,191,36,.9),0 0 100px rgba(245,158,11,.4)} }
    @keyframes diceRoll { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.3)} 100%{transform:rotate(360deg) scale(1)} }
    @keyframes pulseRed { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,.3)} }
    .msg-in   { animation: fadeUp 0.25s ease; }
    .dice-spin{ animation: diceRoll 0.5s ease; }
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#080810}
    ::-webkit-scrollbar-thumb{background:#2d1b69;border-radius:3px}
    button{transition:all .15s}
    button:hover{filter:brightness(1.2)}
    select,input,textarea{outline:none}
    * { box-sizing: border-box; }
  `;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const CLASSES = {
  barbarian:{ name:"Barbaro",   emoji:"🪓", color:"#dc2626", hp:140, atk:17, def:8,  mag:0,  init:2, desc:"Furia incontrollabile, resistenza brutale" },
  bard:     { name:"Bardo",     emoji:"🎵", color:"#f97316", hp:78,  atk:9,  def:5,  mag:13, init:3, desc:"Magia attraverso musica e parole" },
  cleric:   { name:"Chierico",  emoji:"✨", color:"#f59e0b", hp:95,  atk:7,  def:9,  mag:15, init:1, desc:"Potere divino e guarigione sacra" },
  druid:    { name:"Druido",    emoji:"🌿", color:"#84cc16", hp:80,  atk:8,  def:7,  mag:14, init:2, desc:"Magia naturale e trasformazione" },
  warrior:  { name:"Guerriero", emoji:"⚔️", color:"#ef4444", hp:120, atk:15, def:11, mag:1,  init:2, desc:"Maestro delle armi e del combattimento" },
  monk:     { name:"Monaco",    emoji:"👊", color:"#06b6d4", hp:88,  atk:13, def:10, mag:4,  init:5, desc:"Arti marziali e disciplina del ki" },
  paladin:  { name:"Paladino",  emoji:"🛡️", color:"#facc15", hp:110, atk:12, def:13, mag:8,  init:1, desc:"Guerriero sacro, paladino della giustizia" },
  ranger:   { name:"Ranger",    emoji:"🏹", color:"#14b8a6", hp:90,  atk:13, def:7,  mag:6,  init:3, desc:"Esploratore e cacciatore di mostri" },
  rogue:    { name:"Ladro",     emoji:"🗡️", color:"#22c55e", hp:82,  atk:14, def:6,  mag:4,  init:5, desc:"Furtività, trappole e attacchi subdoli" },
  sorcerer: { name:"Stregone",  emoji:"🌀", color:"#8b5cf6", hp:68,  atk:6,  def:3,  mag:22, init:2, desc:"Magia innata nel sangue" },
  warlock:  { name:"Warlock",   emoji:"🔱", color:"#7c3aed", hp:72,  atk:8,  def:4,  mag:20, init:2, desc:"Patti con entità oscure e potere proibito" },
  mage:     { name:"Mago",      emoji:"🔮", color:"#a855f7", hp:65,  atk:5,  def:3,  mag:24, init:2, desc:"Studio arcano e incantesimi devastanti" },
};
const RACES = {
  human:     { name:"Umano",     emoji:"👤", hpB:5,  atkB:1, defB:1, magB:1, initB:1, desc:"Versatili e ambiziosi, eccellono in tutto" },
  dwarf:     { name:"Nano",      emoji:"⛏️", hpB:25, atkB:1, defB:5, magB:0, initB:-1,desc:"Resistenti come la roccia, esperti artigiani" },
  elf:       { name:"Elfo",      emoji:"🧝", hpB:0,  atkB:1, defB:1, magB:3, initB:2, desc:"Agili e magici, percezione soprannaturale" },
  halfling:  { name:"Halfling",  emoji:"🍀", hpB:0,  atkB:0, defB:2, magB:0, initB:4, desc:"Fortunati e furtivi, sempre positivi" },
  dragonborn:{ name:"Dragonide", emoji:"🐲", hpB:10, atkB:3, defB:2, magB:2, initB:0, desc:"Discendenti dei draghi, soffio draconico" },
  gnome:     { name:"Gnomo",     emoji:"🔧", hpB:0,  atkB:0, defB:1, magB:6, initB:2, desc:"Ingegnosi e curiosi, magia illusoria naturale" },
  halfelf:   { name:"Mezzelfo",  emoji:"🌙", hpB:0,  atkB:2, defB:1, magB:2, initB:2, desc:"Il meglio di due mondi, carismatici" },
  halforc:   { name:"Mezzorco",  emoji:"💪", hpB:15, atkB:5, defB:1, magB:0, initB:1, desc:"Forza bruta e resistenza feroce" },
  tiefling:  { name:"Tiefling",  emoji:"😈", hpB:0,  atkB:0, defB:1, magB:5, initB:1, desc:"Sangue infernale, resistenza al fuoco" },
};
const DIFF_COLOR = { "Facile":"#22c55e","Medio":"#fbbf24","Difficile":"#f97316","Molto Difficile":"#ef4444","Leggendario":"#a855f7" };

function xpForLevel(l){ return Math.floor(100*Math.pow(1.5,l-1)); }
function d(n){ return Math.floor(Math.random()*n)+1; }
function roll(sides,num=1){ let t=0; for(let i=0;i<num;i++) t+=d(sides); return t; }
function fmt(t=""){ return t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br/>"); }

/* ══════════════════════════════════════════════
   LOCAL STORAGE HELPERS (per quests/monsters/meta)
══════════════════════════════════════════════ */
function lsGet(key, def) { try { const r=localStorage.getItem(key); return r?JSON.parse(r):def; } catch { return def; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

function getQuests()   { return lsGet("eoz_quests",   DEFAULT_QUESTS()); }
function getMonsters() { return lsGet("eoz_monsters",  DEFAULT_MONSTERS); }
function getMeta()     { return lsGet("eoz_meta",      { worldName:"Echoes of Zodar", worldSub:"Dove l'Equilibrio Regna Supremo", logo:null }); }
function saveQuests(q)   { lsSet("eoz_quests", q); }
function saveMonsters(m) { lsSet("eoz_monsters", m); }
function saveMeta(m)     { lsSet("eoz_meta", m); }

/* ══════════════════════════════════════════════
   DEFAULT DATA
══════════════════════════════════════════════ */
function DEFAULT_QUESTS() {
  return [{
    id:"dq1", title:"La Miniera Maledetta", active:true,
    desc:"Creature delle tenebre hanno infestato la vecchia miniera di Stonehaven. I minatori non tornano più.",
    flavor:"«L'oscurità ha preso vita nei tunnel...» — Sindaco Aldric",
    difficulty:"Facile", xpReward:150, goldReward:60,
    steps:[
      "Il party parte all'alba verso la miniera abbandonata a nord della città. L'aria odora di zolfo.",
      "All'ingresso trovate ossa frantumate e artigli sul legno marcio. Qualcosa di grosso vive qui dentro.",
      "Nelle gallerie buie — i **Goblin delle Rocce** attaccano! Digita **combatti** per iniziare la battaglia.",
      "Una voce profonda echeggia nelle profondità: *«Chi osa disturbare il mio sonno eterno...»*",
      "Al terzo livello: il **Troll delle Caverne** vi sbarra la strada. Boss battle!",
      "Vittoria! Il troll cade tra un ruggito e il silenzio. I minatori sono liberi!",
    ],
    enemies:[
      {id:"e1",name:"Goblin delle Rocce",emoji:"👺",hp:22,maxHp:22,atk:6,def:2,xp:18,isBoss:false},
      {id:"e3",name:"Troll delle Caverne",emoji:"🧌",hp:95,maxHp:95,atk:16,def:7,xp:80,isBoss:true},
    ],
  }];
}
const DEFAULT_MONSTERS = [
  {id:"m1",name:"Goblin",       emoji:"👺",hp:20,atk:5,def:2,xp:15,desc:"Piccolo e subdolo"},
  {id:"m2",name:"Orco Guerriero",emoji:"💀",hp:60,atk:12,def:5,xp:40,desc:"Brutale e resistente"},
  {id:"m3",name:"Drago Rosso",  emoji:"🐉",hp:200,atk:30,def:15,xp:200,desc:"Terrore del continente",isBoss:true},
  {id:"m4",name:"Vampiro",      emoji:"🧛",hp:90,atk:18,def:8,xp:80,desc:"Signore della notte",isBoss:true},
  {id:"m5",name:"Scheletro",    emoji:"💀",hp:25,atk:7,def:3,xp:18,desc:"Non-morto eterno"},
];

/* ══════════════════════════════════════════════
   SUPABASE HELPERS
══════════════════════════════════════════════ */
async function dbSendMessage(msg) {
  await supabase.from("messages").insert({
    party_code: msg.party_code,
    author: msg.author,
    content: msg.content,
    type: msg.type || "chat",
  });
}

async function dbSavePlayer(p) {
  await supabase.from("players").upsert({
    id: p.id, name: p.name, party_code: p.partyCode,
    class: p.class, race: p.race,
    hp: p.hp, max_hp: p.maxHp, atk: p.atk, def: p.def,
    mag: p.mag, init: p.init, xp: p.xp, level: p.level, gold: p.gold,
    updated_at: new Date().toISOString(),
  });
}

async function dbGetPlayers(partyCode) {
  const { data } = await supabase.from("players").select("*").eq("party_code", partyCode);
  return (data || []).map(r => ({
    id: r.id, name: r.name, partyCode: r.party_code,
    class: r.class, race: r.race,
    hp: r.hp, maxHp: r.max_hp, atk: r.atk, def: r.def,
    mag: r.mag, init: r.init, xp: r.xp, level: r.level, gold: r.gold,
  }));
}

async function dbGetMessages(partyCode) {
  const { data } = await supabase.from("messages").select("*")
    .eq("party_code", partyCode).order("created_at", { ascending: true }).limit(100);
  return data || [];
}

async function dbSavePartyState(partyCode, state) {
  await supabase.from("party_state").upsert({
    party_code: partyCode,
    quest_id: state.currentId,
    quest_step: state.step,
    quest_active: state.active,
    quest_completed: state.completed,
    combat: state.combat || null,
    updated_at: new Date().toISOString(),
  });
}

async function dbGetPartyState(partyCode) {
  const { data } = await supabase.from("party_state").select("*").eq("party_code", partyCode).single();
  if (!data) return { currentId: null, step: 0, active: false, completed: [], combat: null };
  return {
    currentId: data.quest_id,
    step: data.quest_step || 0,
    active: data.quest_active || false,
    completed: data.quest_completed || [],
    combat: data.combat || null,
  };
}

/* ══════════════════════════════════════════════
   MASTER PASSWORD
══════════════════════════════════════════════ */
const MASTER_PASSWORD = "ByBy101112!";

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [myId, setMyId] = useState(() => localStorage.getItem("eoz_myId") || null);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setAuthUser(session?.user || null);
      setAuthLoading(false);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      setAuthUser(session?.user || null);
    });
    return ()=>subscription.unsubscribe();
  },[]);

  function goGame(id) {
    setMyId(id);
    localStorage.setItem("eoz_myId", id);
    setScreen("game");
  }

  if(authLoading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#06060e", color:"#4b5563", fontFamily:"'Cinzel',serif" }}>⏳ Caricamento...</div>;

  return (
    <div style={{ minHeight:"100vh", background:"#06060e", fontFamily:"'Crimson Pro',Georgia,serif", color:"#e2d9c5", position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 15% 50%,rgba(109,40,217,.1) 0%,transparent 55%),radial-gradient(ellipse at 85% 10%,rgba(180,83,9,.08) 0%,transparent 50%)", pointerEvents:"none", zIndex:0 }} />
      {screen==="master" && <MasterPanelAuth setScreen={setScreen} />}
      {screen!=="master" && !authUser && <AuthScreen setAuthUser={setAuthUser} setScreen={setScreen} setMyId={setMyId} goGame={goGame} />}
      {screen!=="master" && authUser && screen==="landing" && <Landing setScreen={setScreen} goGame={goGame} myId={myId} authUser={authUser} setAuthUser={setAuthUser} />}
      {screen!=="master" && authUser && screen==="create"  && <CreateChar setScreen={setScreen} goGame={goGame} authUser={authUser} />}
      {screen!=="master" && authUser && screen==="game"    && <GameScreen myId={myId} setScreen={setScreen} />}
    </div>
  );
}

/* ══════════════════════════════════════════════
   AUTH SCREEN
══════════════════════════════════════════════ */
function AuthScreen({ setAuthUser, setScreen, setMyId, goGame }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const meta = getMeta();

  async function handleAuth() {
    if(!email.trim()||!password.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    if(mode==="login") {
      const {data,error:e} = await supabase.auth.signInWithPassword({email,password});
      if(e) { setError("Email o password errati."); setLoading(false); return; }
      setAuthUser(data.user);
      const {data:players} = await supabase.from("players").select("id").eq("id", data.user.id);
      if(players&&players.length>0) { setMyId(data.user.id); localStorage.setItem("eoz_myId",data.user.id); setScreen("game"); }
      else setScreen("landing");
    } else {
      const {error:e} = await supabase.auth.signUp({email,password});
      if(e) { setError(e.message); setLoading(false); return; }
      setSuccess("✅ Registrazione completata! Ora puoi accedere.");
      setMode("login");
    }
    setLoading(false);
  }

  return (
    <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem 1rem" }}>
      <p style={{ fontFamily:"'Cinzel',serif", color:"#4c1d95", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>᛭ ZODAR ᛭</p>
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2rem,7vw,4rem)", margin:"0.2rem 0 2rem", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em" }}>
        {meta.worldName}
      </h1>
      <div style={{ width:"100%", maxWidth:400, background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:8, padding:"2rem" }}>
        <div style={{ display:"flex", gap:0, marginBottom:"1.5rem", border:"1px solid #1f2937", borderRadius:6, overflow:"hidden" }}>
          {[["login","🔑 Accedi"],["register","⚔️ Registrati"]].map(([k,l])=>(
            <button key={k} onClick={()=>{ setMode(k); setError(""); setSuccess(""); }}
              style={{ flex:1, padding:"0.6rem", background:mode===k?"rgba(109,40,217,0.3)":"transparent", border:"none", color:mode===k?"#c4b5fd":"#6b7280", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.8rem", letterSpacing:"0.05em" }}>
              {l}
            </button>
          ))}
        </div>
        <label style={labelStyle}>Email</label>
        <input style={{...inputStyle,marginBottom:12}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="la-tua@email.com" autoComplete="email" />
        <label style={labelStyle}>Password</label>
        <input style={{...inputStyle,marginBottom:16}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleAuth()} />
        {error && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(239,68,68,0.1)", border:"1px solid #7f1d1d", borderRadius:4 }}>{error}</div>}
        {success && <div style={{ color:"#6ee7b7", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(52,211,153,0.1)", border:"1px solid #065f46", borderRadius:4 }}>{success}</div>}
        <BigBtn onClick={handleAuth} gold disabled={loading} icon={mode==="login"?"🔑":"⚔️"}>
          {loading?"Attendere..." : mode==="login"?"Entra nel Mondo":"Crea Account"}
        </BigBtn>
        <div style={{ marginTop:"1.5rem", textAlign:"center" }}>
          <button onClick={()=>setScreen("master")} style={{ background:"none", border:"none", color:"#1f2937", cursor:"pointer", fontSize:"0.7rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.08em" }}>🎲 Accesso Master</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MASTER PANEL AUTH WRAPPER
══════════════════════════════════════════════ */
function MasterPanelAuth({ setScreen }) {
  const [pwd, setPwd] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(false);

  if(ok) return <MasterPanel setScreen={setScreen} />;

  return (
    <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem", background:"#06060e" }}>
      <div style={{ width:"100%", maxWidth:360, background:"rgba(255,255,255,0.02)", border:"1px solid #374151", borderRadius:8, padding:"2rem", textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎲</div>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", marginBottom:"0.5rem" }}>Pannello Master</h2>
        <p style={{ color:"#4b5563", fontSize:"0.78rem", marginBottom:"1.5rem" }}>Accesso riservato al Master</p>
        <label style={labelStyle}>Password</label>
        <input style={{...inputStyle,marginBottom:12,textAlign:"center",letterSpacing:"0.2em"}} type="password" value={pwd}
          onChange={e=>{ setPwd(e.target.value); setErr(false); }}
          placeholder="••••••••"
          onKeyDown={e=>e.key==="Enter"&&(pwd===MASTER_PASSWORD?setOk(true):setErr(true))} />
        {err && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12 }}>❌ Password errata!</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <BigBtn onClick={()=>pwd===MASTER_PASSWORD?setOk(true):setErr(true)} gold icon="🔓">Entra</BigBtn>
          <SmallBtn onClick={()=>setScreen("landing")}>← Indietro</SmallBtn>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LANDING
══════════════════════════════════════════════ */
function Landing({ setScreen, goGame, myId, authUser, setAuthUser }) {
  const meta = getMeta();
  async function logout() {
    await supabase.auth.signOut();
    setAuthUser(null);
    localStorage.removeItem("eoz_myId");
  }
  return (
    <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem 1rem", textAlign:"center" }}>
      {meta.logo
        ? <img src={meta.logo} alt="logo" style={{ maxWidth:260, maxHeight:160, objectFit:"contain", marginBottom:"1rem", filter:"drop-shadow(0 0 24px rgba(251,191,36,.5))" }} />
        : <p style={{ fontFamily:"'Cinzel',serif", color:"#4c1d95", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>᛭ ZODAR ᛭</p>
      }
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2.2rem,8vw,5rem)", margin:"0.2rem 0", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em", animation:"goldenGlow 4s ease-in-out infinite" }}>
        {meta.worldName}
      </h1>
      <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(0.65rem,2vw,0.85rem)", color:"#7c3aed", letterSpacing:"0.3em", textTransform:"uppercase", margin:"0.2rem 0 2.5rem" }}>{meta.worldSub}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:320 }}>
        <BigBtn onClick={()=>setScreen("create")} gold icon="⚔️">Crea il tuo Eroe</BigBtn>
        {myId && <BigBtn onClick={()=>goGame(myId)} icon="🗺️">Torna all'Avventura</BigBtn>}
        <BigBtn onClick={logout} dark icon="🚪">Esci</BigBtn>
      </div>
      {authUser && <p style={{ marginTop:"1rem", color:"#374151", fontSize:"0.72rem" }}>Connesso come {authUser.email}</p>}
      <p style={{ marginTop:"1.5rem", color:"#1f2937", fontSize:"0.7rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.12em" }}>GDR TESTUALE · FANTASY · MULTIPLAYER ONLINE</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CREATE CHARACTER
══════════════════════════════════════════════ */
function CreateChar({ setScreen, goGame, authUser }) {
  const [name, setName] = useState("");
  const [cls,  setCls]  = useState("warrior");
  const [race, setRace] = useState("human");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const c = CLASSES[cls]; const r = RACES[race];

  async function create() {
    if(!name.trim() || loading) return;
    setLoading(true);
    const id = authUser ? authUser.id : "p_"+Math.random().toString(36).slice(2,9);
    const partyCode = code.trim().toUpperCase() || Math.random().toString(36).slice(2,6).toUpperCase();
    const maxHp = c.hp + r.hpB;
    const player = {
      id, name:name.trim(), class:cls, race:race, partyCode,
      hp:maxHp, maxHp, atk:c.atk+r.atkB, def:c.def+r.defB,
      mag:c.mag+r.magB, init:c.init+r.initB,
      xp:0, level:1, gold:0,
    };
    await dbSavePlayer(player);
    const meta = getMeta();
    await dbSendMessage({ party_code:partyCode, author:"Sistema", type:"system",
      content:`🏰 **${player.name} il ${c.name}** è entrato nel mondo di **${meta.worldName}**! ${c.emoji}` });
    setLoading(false);
    goGame(id);
  }

  const steps = ["Nome","Classe","Razza","Party"];
  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:620, margin:"0 auto", padding:"1.5rem 1rem", minHeight:"100vh" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.5rem" }}>
        <button onClick={()=>setScreen("landing")} style={backBtnStyle}>← Indietro</button>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", margin:0 }}>Forgia il tuo Destino</h2>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:"1.5rem" }}>
        {steps.map((s,i)=>(
          <div key={s} onClick={()=>i<step&&setStep(i)} style={{ flex:1, padding:"0.4rem", textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:"0.68rem", letterSpacing:"0.06em", cursor:i<step?"pointer":"default", borderRadius:4, background:i===step?"rgba(109,40,217,0.35)":i<step?"rgba(109,40,217,0.15)":"rgba(255,255,255,0.02)", border:`1px solid ${i<=step?"#7c3aed":"#1f2937"}`, color:i<=step?"#c4b5fd":"#4b5563" }}>
            {i<step?"✓ ":""}{s}
          </div>
        ))}
      </div>

      {step===0 && (
        <Card title="🧙 Come ti chiamerai?">
          <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Il nome del tuo eroe..." maxLength={24} autoFocus onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(1)} />
          <div style={{ marginTop:"1rem" }}><BigBtn onClick={()=>name.trim()&&setStep(1)} gold disabled={!name.trim()}>Avanti →</BigBtn></div>
        </Card>
      )}
      {step===1 && (
        <Card title="⚔️ Scegli la tua Classe">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
            {Object.entries(CLASSES).map(([k,v])=>(
              <button key={k} onClick={()=>setCls(k)} style={{ padding:"0.8rem 0.5rem", background:cls===k?"rgba(109,40,217,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${cls===k?v.color:"#1f2937"}`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:"1.8rem" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:cls===k?v.color:"#d1d5db", fontSize:"0.82rem" }}>{v.name}</strong>
                {cls===k && <div style={{ fontSize:"0.62rem", color:"#9ca3af", textAlign:"center" }}>❤️{v.hp} ⚔️{v.atk} 🛡️{v.def} 🔮{v.mag}</div>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(0)}>← Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(2)} gold>Avanti →</BigBtn>
          </div>
        </Card>
      )}
      {step===2 && (
        <Card title="🧝 Scegli la tua Razza">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8 }}>
            {Object.entries(RACES).map(([k,v])=>(
              <button key={k} onClick={()=>setRace(k)} style={{ padding:"0.7rem 0.4rem", background:race===k?"rgba(109,40,217,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${race===k?"#a78bfa":"#1f2937"}`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:"1.5rem" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:"#d1d5db", fontSize:"0.78rem" }}>{v.name}</strong>
                {race===k && <small style={{ fontSize:"0.6rem", color:"#a78bfa", textAlign:"center", lineHeight:1.3 }}>
                  {[v.hpB&&`+${v.hpB}HP`,v.atkB&&`+${v.atkB}ATK`,v.defB&&`+${v.defB}DEF`,v.magB&&`+${v.magB}MAG`].filter(Boolean).join(" ")||"Versatile"}
                </small>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(1)}>← Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(3)} gold>Avanti →</BigBtn>
          </div>
        </Card>
      )}
      {step===3 && (
        <Card title="👥 Codice Party">
          <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #4c1d95", borderRadius:6, padding:"0.8rem", marginBottom:"1rem", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:"2rem" }}>{c.emoji}</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700 }}>{name||"Il tuo eroe"}</div>
              <div style={{ color:"#9ca3af", fontSize:"0.78rem" }}>{RACES[race].emoji} {RACES[race].name} · {c.name} · Lv.1</div>
              <div style={{ color:"#6b7280", fontSize:"0.7rem", marginTop:2 }}>❤️{c.hp+r.hpB} ⚔️{c.atk+r.atkB} 🛡️{c.def+r.defB} 🔮{c.mag+r.magB}</div>
            </div>
          </div>
          <label style={labelStyle}>Codice Party</label>
          <input style={inputStyle} value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Inserisci il codice di un amico — o lascia vuoto" maxLength={8} />
          <p style={{ color:"#4b5563", fontSize:"0.75rem", margin:"6px 0 0", lineHeight:1.5 }}>Il codice party è la tua stanza online. Condividilo con i tuoi giocatori!</p>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(2)}>← Indietro</SmallBtn>
            <BigBtn onClick={create} gold icon="⚔️" disabled={loading}>{loading?"Creando...":"Inizia l'Avventura!"}</BigBtn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MASTER PANEL
══════════════════════════════════════════════ */
function MasterPanel({ setScreen }) {
  const [tab, setTab]       = useState("world");
  const [meta, setMeta]     = useState(getMeta());
  const [quests, setQuests] = useState(getQuests());
  const [monsters, setMonsters] = useState(getMonsters());
  const [editQ, setEditQ]   = useState(null);
  const [editM, setEditM]   = useState(null);
  const [saved, setSaved]   = useState(false);
  const [newStep, setNewStep] = useState("");

  function saveAll() {
    saveMeta(meta); saveQuests(quests); saveMonsters(monsters);
    setSaved(true); setTimeout(()=>setSaved(false), 2200);
  }
  function handleLogo(e) {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>setMeta(m=>({...m,logo:ev.target.result})); r.readAsDataURL(f);
  }
  function addQuest() {
    const q={id:"q_"+Date.now(),title:"Nuova Missione",desc:"",flavor:"",difficulty:"Medio",xpReward:200,goldReward:100,steps:[],enemies:[],active:true};
    setQuests(prev=>[...prev,q]); setEditQ({...q});
  }
  function saveEditQ() { setQuests(prev=>prev.map(x=>x.id===editQ.id?editQ:x)); setEditQ(null); }
  function addStepToQ() { if(!newStep.trim()) return; setEditQ(q=>({...q,steps:[...q.steps,newStep.trim()]})); setNewStep(""); }
  function addEnemyToQ(monster) { setEditQ(q=>({...q,enemies:[...q.enemies,{...monster,maxHp:monster.hp,id:"e_"+Date.now()}]})); }
  function addMonster() {
    const m={id:"m_"+Date.now(),name:"Nuova Creatura",emoji:"👾",hp:30,atk:8,def:3,xp:20,desc:"",isBoss:false};
    setMonsters(prev=>[...prev,m]); setEditM({...m});
  }
  function saveEditM() { setMonsters(prev=>prev.map(x=>x.id===editM.id?editM:x)); setEditM(null); }

  const TABS = [{k:"world",l:"🌍 Mondo"},{k:"quests",l:"📜 Missioni"},{k:"monsters",l:"👾 Bestiari"},{k:"players",l:"👥 Giocatori"}];
  const EMOJIS=["👺","💀","🐉","🧛","👿","🦇","🕷️","🐺","🧟","🔥","🌊","⚡","☠️","🦁","🐍","🦂","👁️","🗿","🧌","😈"];

  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto", padding:"1rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.2rem", paddingBottom:"1rem", borderBottom:"1px solid #1f2937", flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.4rem", margin:0 }}>🎲 Pannello Master</h1>
          <p style={{ color:"#4b5563", fontSize:"0.78rem", margin:0 }}>Il tuo strumento di controllo</p>
        </div>
        <BigBtn onClick={saveAll} gold icon={saved?"✅":"💾"}>{saved?"Salvato!":"Salva tutto"}</BigBtn>
        <SmallBtn onClick={()=>setScreen("landing")}>← Esci</SmallBtn>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:"1.2rem", flexWrap:"wrap" }}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>{ setEditQ(null); setEditM(null); setTab(t.k); }}
            style={{ padding:"0.5rem 1.1rem", background:tab===t.k?"rgba(109,40,217,0.35)":"rgba(255,255,255,0.03)", border:`1px solid ${tab===t.k?"#7c3aed":"#374151"}`, borderRadius:4, color:tab===t.k?"#c4b5fd":"#6b7280", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", letterSpacing:"0.05em" }}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==="world" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          <Card title="🌍 Nome del Mondo">
            <label style={labelStyle}>Nome principale</label>
            <input style={inputStyle} value={meta.worldName} onChange={e=>setMeta(m=>({...m,worldName:e.target.value}))} />
            <label style={{...labelStyle,marginTop:10}}>Sottotitolo</label>
            <input style={inputStyle} value={meta.worldSub} onChange={e=>setMeta(m=>({...m,worldSub:e.target.value}))} />
          </Card>
          <Card title="🖼️ Logo del Gioco">
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
              {meta.logo && <img src={meta.logo} alt="logo" style={{ maxWidth:180, maxHeight:110, objectFit:"contain", borderRadius:4, border:"1px solid #374151" }} />}
              <div>
                <label style={{ display:"inline-block", padding:"0.7rem 1.4rem", background:"rgba(109,40,217,0.25)", border:"1px solid #7c3aed", borderRadius:5, cursor:"pointer", color:"#c4b5fd", fontFamily:"'Cinzel',serif", fontSize:"0.85rem" }}>
                  📁 Carica Logo
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display:"none" }} />
                </label>
                {meta.logo && <button onClick={()=>setMeta(m=>({...m,logo:null}))} style={{ marginLeft:8, padding:"0.5rem 0.8rem", background:"rgba(239,68,68,0.15)", border:"1px solid #ef4444", borderRadius:4, color:"#fca5a5", cursor:"pointer", fontSize:"0.8rem" }}>🗑️ Rimuovi</button>}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab==="quests" && !editQ && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <span style={{ color:"#6b7280", fontSize:"0.85rem" }}>{quests.length} missioni</span>
            <BigBtn onClick={addQuest} gold icon="✨">+ Nuova Missione</BigBtn>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {quests.map(q=>(
              <div key={q.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${q.active?"#4c1d95":"#1f2937"}`, borderRadius:6, padding:"0.9rem 1rem" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700, fontSize:"1rem" }}>{q.title}</span>
                      <span style={{ padding:"1px 8px", border:`1px solid ${DIFF_COLOR[q.difficulty]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[q.difficulty]||"#6b7280" }}>{q.difficulty}</span>
                      {!q.active && <span style={{ fontSize:"0.65rem", color:"#4b5563", border:"1px solid #1f2937", borderRadius:3, padding:"1px 5px" }}>PAUSA</span>}
                    </div>
                    <p style={{ color:"#6b7280", fontSize:"0.8rem", margin:"0 0 6px" }}>{q.desc||"Nessuna descrizione."}</p>
                    <div style={{ display:"flex", gap:14, fontSize:"0.72rem", color:"#4b5563" }}>
                      <span>✨ {q.xpReward} XP</span><span>💰 {q.goldReward} oro</span>
                      <span>📍 {q.steps.length} scene</span><span>👾 {q.enemies.length} nemici</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <SmallBtn onClick={()=>setQuests(prev=>prev.map(x=>x.id===q.id?{...x,active:!x.active}:x))}>{q.active?"⏸️":"▶️"}</SmallBtn>
                    <SmallBtn onClick={()=>setEditQ({...q})}>✏️</SmallBtn>
                    <SmallBtn red onClick={()=>{ if(window.confirm("Elimina?")) setQuests(prev=>prev.filter(x=>x.id!==q.id)); }}>🗑️</SmallBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="quests" && editQ && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, flex:1 }}>✏️ {editQ.title}</h3>
            <BigBtn onClick={saveEditQ} gold icon="💾">Salva Missione</BigBtn>
            <SmallBtn onClick={()=>setEditQ(null)}>← Annulla</SmallBtn>
          </div>
          <Card title="📋 Informazioni Base">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={labelStyle}>Titolo</label><input style={inputStyle} value={editQ.title} onChange={e=>setEditQ(q=>({...q,title:e.target.value}))} /></div>
              <div><label style={labelStyle}>Difficoltà</label>
                <select style={{...inputStyle,cursor:"pointer"}} value={editQ.difficulty} onChange={e=>setEditQ(q=>({...q,difficulty:e.target.value}))}>
                  {Object.keys(DIFF_COLOR).map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>XP</label><input style={inputStyle} type="number" value={editQ.xpReward} onChange={e=>setEditQ(q=>({...q,xpReward:+e.target.value}))} /></div>
              <div><label style={labelStyle}>Oro</label><input style={inputStyle} type="number" value={editQ.goldReward} onChange={e=>setEditQ(q=>({...q,goldReward:+e.target.value}))} /></div>
            </div>
            <label style={{...labelStyle,marginTop:10}}>Descrizione</label>
            <textarea style={{...inputStyle,height:75,resize:"vertical"}} value={editQ.desc} onChange={e=>setEditQ(q=>({...q,desc:e.target.value}))} placeholder="Descrivi la missione..." />
            <label style={{...labelStyle,marginTop:10}}>Citazione narrativa</label>
            <textarea style={{...inputStyle,height:52,resize:"vertical"}} value={editQ.flavor} onChange={e=>setEditQ(q=>({...q,flavor:e.target.value}))} placeholder="«Una frase epica...»" />
          </Card>
          <Card title="📍 Scene della Missione">
            <p style={{ color:"#4b5563", fontSize:"0.75rem", marginBottom:10 }}>Ogni scena viene narrata quando i giocatori digitano <strong style={{color:"#a78bfa"}}>avanza</strong>. Puoi usare **grassetto** e *corsivo*.</p>
            {editQ.steps.map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:6, marginBottom:6, alignItems:"flex-start" }}>
                <span style={{ color:"#4b5563", fontSize:"0.8rem", minWidth:22, paddingTop:10 }}>{i+1}.</span>
                <textarea style={{...inputStyle,flex:1,height:60,resize:"vertical",fontSize:"0.85rem"}} value={s}
                  onChange={e=>{ const st=[...editQ.steps]; st[i]=e.target.value; setEditQ(q=>({...q,steps:st})); }} />
                <div style={{ display:"flex", flexDirection:"column", gap:3, paddingTop:2 }}>
                  <button onClick={()=>{ const st=[...editQ.steps]; if(i>0){[st[i],st[i-1]]=[st[i-1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} style={iconBtnStyle}>↑</button>
                  <button onClick={()=>{ const st=[...editQ.steps]; if(i<st.length-1){[st[i],st[i+1]]=[st[i+1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} style={iconBtnStyle}>↓</button>
                  <button onClick={()=>setEditQ(q=>({...q,steps:q.steps.filter((_,j)=>j!==i)}))} style={{...iconBtnStyle,color:"#f87171"}}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <textarea style={{...inputStyle,flex:1,height:55,resize:"vertical",fontSize:"0.85rem"}} value={newStep} onChange={e=>setNewStep(e.target.value)} placeholder="Scrivi la prossima scena..." />
              <BigBtn onClick={addStepToQ} gold>+ Aggiungi</BigBtn>
            </div>
          </Card>
          <Card title="👾 Nemici della Missione">
            <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
              {editQ.enemies.map((en,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"0.4rem 0.7rem", background:"rgba(239,68,68,0.06)", border:`1px solid ${en.isBoss?"#f59e0b":"rgba(239,68,68,0.2)"}`, borderRadius:4 }}>
                  <span style={{ fontSize:"1.2rem" }}>{en.emoji}</span>
                  <span style={{ color:en.isBoss?"#fbbf24":"#e2d9c5", fontWeight:en.isBoss?700:400 }}>{en.name}{en.isBoss?" 👑":""}</span>
                  <span style={{ color:"#4b5563", fontSize:"0.72rem" }}>❤️{en.hp} ⚔️{en.atk} 🛡️{en.def} ✨{en.xp}xp</span>
                  <button onClick={()=>setEditQ(q=>({...q,enemies:q.enemies.filter((_,j)=>j!==i)}))} style={{ marginLeft:"auto", ...iconBtnStyle, color:"#f87171" }}>✕</button>
                </div>
              ))}
            </div>
            <p style={{ color:"#4b5563", fontSize:"0.75rem", marginBottom:8 }}>Aggiungi dal bestiario:</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {monsters.map(m=>(
                <button key={m.id} onClick={()=>addEnemyToQ(m)}
                  style={{ padding:"0.4rem 0.7rem", background:"rgba(255,255,255,0.04)", border:`1px solid ${m.isBoss?"#f59e0b":"#374151"}`, borderRadius:4, color:"#d1d5db", cursor:"pointer", fontSize:"0.8rem", fontFamily:"inherit" }}>
                  {m.emoji} {m.name}{m.isBoss?" 👑":""}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab==="monsters" && !editM && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <span style={{ color:"#6b7280", fontSize:"0.85rem" }}>{monsters.length} creature</span>
            <BigBtn onClick={addMonster} gold icon="✨">+ Nuova Creatura</BigBtn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:8 }}>
            {monsters.map(m=>(
              <div key={m.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${m.isBoss?"#92400e":"#1f2937"}`, borderRadius:6, padding:"0.8rem" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:"2rem" }}>{m.emoji}</span>
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", color:m.isBoss?"#fbbf24":"#e2d9c5", fontWeight:700 }}>{m.name}{m.isBoss?" 👑":""}</div>
                    <div style={{ color:"#4b5563", fontSize:"0.68rem" }}>{m.desc}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, fontSize:"0.73rem", color:"#6b7280", marginBottom:8 }}>
                  <span>❤️{m.hp}</span><span>⚔️{m.atk}</span><span>🛡️{m.def}</span><span>✨{m.xp}xp</span>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <SmallBtn onClick={()=>setEditM({...m})}>✏️</SmallBtn>
                  <SmallBtn red onClick={()=>{ if(window.confirm("Elimina?")) setMonsters(prev=>prev.filter(x=>x.id!==m.id)); }}>🗑️</SmallBtn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="monsters" && editM && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, flex:1 }}>✏️ Modifica Creatura</h3>
            <BigBtn onClick={saveEditM} gold icon="💾">Salva</BigBtn>
            <SmallBtn onClick={()=>setEditM(null)}>← Annulla</SmallBtn>
          </div>
          <Card title="Scheda Creatura">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={labelStyle}>Nome</label><input style={inputStyle} value={editM.name} onChange={e=>setEditM(m=>({...m,name:e.target.value}))} /></div>
              <div>
                <label style={labelStyle}>Emoji</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginBottom:4 }}>
                  {EMOJIS.map(e=><button key={e} onClick={()=>setEditM(m=>({...m,emoji:e}))} style={{ fontSize:"1.2rem", padding:"2px 5px", background:editM.emoji===e?"rgba(109,40,217,0.4)":"rgba(255,255,255,0.04)", border:`1px solid ${editM.emoji===e?"#7c3aed":"#1f2937"}`, borderRadius:3, cursor:"pointer" }}>{e}</button>)}
                </div>
              </div>
              <div><label style={labelStyle}>HP</label><input style={inputStyle} type="number" value={editM.hp} onChange={e=>setEditM(m=>({...m,hp:+e.target.value}))} /></div>
              <div><label style={labelStyle}>ATK</label><input style={inputStyle} type="number" value={editM.atk} onChange={e=>setEditM(m=>({...m,atk:+e.target.value}))} /></div>
              <div><label style={labelStyle}>DEF</label><input style={inputStyle} type="number" value={editM.def} onChange={e=>setEditM(m=>({...m,def:+e.target.value}))} /></div>
              <div><label style={labelStyle}>XP</label><input style={inputStyle} type="number" value={editM.xp} onChange={e=>setEditM(m=>({...m,xp:+e.target.value}))} /></div>
            </div>
            <label style={{...labelStyle,marginTop:10}}>Lore</label>
            <textarea style={{...inputStyle,height:70,resize:"vertical"}} value={editM.desc} onChange={e=>setEditM(m=>({...m,desc:e.target.value}))} />
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10 }}>
              <input type="checkbox" id="bossChk" checked={!!editM.isBoss} onChange={e=>setEditM(m=>({...m,isBoss:e.target.checked}))} style={{ width:18, height:18 }} />
              <label htmlFor="bossChk" style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontSize:"0.85rem", cursor:"pointer" }}>È un Boss 👑</label>
            </div>
          </Card>
        </div>
      )}

      {tab==="players" && <PlayersView />}
    </div>
  );
}

function PlayersView() {
  const [players, setPlayers] = useState([]);
  useEffect(()=>{
    const load = async () => {
      const { data } = await supabase.from("players").select("*").order("level", { ascending:false });
      setPlayers(data||[]);
    };
    load();
    const interval = setInterval(load, 3000);
    return ()=>clearInterval(interval);
  },[]);
  return (
    <div>
      <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1rem" }}>{players.length} avventurieri · aggiornamento automatico</p>
      {!players.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun giocatore ancora.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {players.map(p=>{ const cls=CLASSES[p.class]||{}; const race=RACES[p.race]||{};
          return (
            <div key={p.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:"1.5rem" }}>{cls.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{p.name}</div>
                  <div style={{ color:"#4b5563", fontSize:"0.68rem" }}>{race.emoji} {race.name} · {cls.name} · Lv.{p.level}</div>
                </div>
                <span style={{ padding:"2px 7px", background:"#3b0764", borderRadius:3, fontSize:"0.68rem", color:"#c4b5fd" }}>Lv.{p.level}</span>
              </div>
              <HpBar cur={p.hp} max={p.max_hp} />
              <div style={{ display:"flex", gap:10, fontSize:"0.72rem", color:"#6b7280", marginTop:5 }}>
                <span>✨{p.xp}/{xpForLevel(p.level)}XP</span><span>💰{p.gold}oro</span><span>🏷️{p.party_code}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GAME SCREEN
══════════════════════════════════════════════ */
function GameScreen({ myId, setScreen }) {
  const [me, setMeRaw] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partyPlayers, setPartyPlayers] = useState([]);
  const [qs, setQs] = useState({ currentId:null, step:0, active:false, completed:[], combat:null });
  const [input, setInput] = useState("");
  const [diceAnim, setDiceAnim] = useState(false);
  const [tab, setTab] = useState("chat");
  const msgEnd = useRef(null);
  const inputRef = useRef(null);
  const subRef = useRef(null);

  const code = me?.partyCode;

  async function refreshAll(partyCode) {
    if(!partyCode) return;
    const [msgs, players, state] = await Promise.all([
      dbGetMessages(partyCode),
      dbGetPlayers(partyCode),
      dbGetPartyState(partyCode),
    ]);
    setMessages(msgs);
    setPartyPlayers(players);
    setQs(state);
    const freshMe = players.find(p=>p.id===myId);
    if(freshMe) setMeRaw(freshMe);
  }

  useEffect(()=>{
    async function init() {
      const { data } = await supabase.from("players").select("*").eq("id", myId).single();
      if(!data) return;
      const p = { id:data.id, name:data.name, partyCode:data.party_code, class:data.class, race:data.race, hp:data.hp, maxHp:data.max_hp, atk:data.atk, def:data.def, mag:data.mag, init:data.init, xp:data.xp, level:data.level, gold:data.gold };
      setMeRaw(p);
      await refreshAll(p.partyCode);
      // Realtime subscription
      subRef.current = supabase.channel("party_"+p.partyCode)
        .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`party_code=eq.${p.partyCode}` },
          () => refreshAll(p.partyCode))
        .on("postgres_changes", { event:"*", schema:"public", table:"players", filter:`party_code=eq.${p.partyCode}` },
          () => refreshAll(p.partyCode))
        .on("postgres_changes", { event:"*", schema:"public", table:"party_state", filter:`party_code=eq.${p.partyCode}` },
          () => refreshAll(p.partyCode))
        .subscribe();
    }
    init();
    return ()=>{ if(subRef.current) supabase.removeChannel(subRef.current); };
  },[myId]);

  useEffect(()=>{ msgEnd.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  async function setMe(updater) {
    setMeRaw(prev => {
      const next = typeof updater==="function" ? updater(prev) : updater;
      dbSavePlayer(next);
      return next;
    });
  }

  async function addMsg(content, type="narration", author=null) {
    await dbSendMessage({ party_code:code, author:author||me?.name, content, type });
  }

  async function saveQState(newQs) {
    await dbSavePartyState(code, newQs);
    setQs(newQs);
  }

  // ── COMBATTIMENTO ──
  async function startCombat(quest) {
    const enemies = quest.enemies.map(e=>({...e, hp:e.maxHp||e.hp, maxHp:e.maxHp||e.hp}));
    const players = partyPlayers.map(p=>({ id:p.id, name:p.name, emoji:CLASSES[p.class]?.emoji||"⚔️", hp:p.hp, maxHp:p.maxHp, atk:p.atk, def:p.def, init:p.init||1, isPlayer:true }));
    const allCombatants = [...players,...enemies].map(c=>({...c, rollInit:(c.init||1)+roll(20)}));
    allCombatants.sort((a,b)=>b.rollInit-a.rollInit);
    const newCombat = { active:true, combatants:allCombatants, turn:0, round:1 };
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    await addMsg(`⚔️ **BATTAGLIA INIZIATA!** Round 1\n\n**Ordine di Iniziativa:**\n${allCombatants.map((c,i)=>`${i+1}. ${c.emoji||"👾"} ${c.name} (${c.rollInit})`).join("\n")}`, "combat", "Sistema");
    setTab("combat");
  }

  async function doAttack() {
    const combat = qs.combat;
    if(!combat?.active) return;
    const combatants = [...combat.combatants];
    const turn = combat.turn % combatants.length;
    const attacker = combatants[turn];
    if(!attacker?.isPlayer || attacker.id!==myId) {
      await addMsg(`⚠️ Non è il tuo turno! Tocca a **${combatants[turn]?.name}**`, "system","Sistema"); return;
    }
    const targets = combatants.filter(c=>!c.isPlayer&&c.hp>0);
    if(!targets.length) { await endCombat(); return; }
    const target = targets[0];
    const isCrit = roll(20)===20;
    const hitRoll = roll(20);
    const hit = hitRoll > target.def;
    let dmg = 0;
    if(hit) { dmg = Math.max(1, attacker.atk + roll(6) - Math.floor(target.def/2)); if(isCrit) dmg*=2; }
    const tidx = combatants.findIndex(c=>c.id===target.id);
    combatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};
    setDiceAnim(true); setTimeout(()=>setDiceAnim(false),500);

    let log = `${attacker.emoji||"⚔️"} **${attacker.name}** attacca ${target.emoji} **${target.name}**\n`;
    log += `🎲 Tiro: ${hitRoll}${isCrit?" — **CRITICO!**":""}\n`;
    if(hit) log += `💥 Danno: **${dmg}**${isCrit?" (×2 critico!)":""}\n❤️ ${target.name}: ${combatants[tidx].hp}/${target.maxHp} HP`;
    else log += `🛡️ Mancato!`;

    let nextTurn = combat.turn + 1;
    let nextRound = combat.round;
    if(nextTurn>=combatants.length){ nextTurn=0; nextRound++; }

    // Nemico contrattacca
    const nextActor = combatants[nextTurn%combatants.length];
    if(nextActor && !nextActor.isPlayer && nextActor.hp>0) {
      const pt = partyPlayers[Math.floor(Math.random()*partyPlayers.length)];
      if(pt) {
        const edmg = Math.max(1, nextActor.atk + roll(4) - Math.floor(pt.def/3));
        const updPt = {...pt, hp:Math.max(0,pt.hp-edmg)};
        await dbSavePlayer(updPt);
        if(pt.id===myId) setMeRaw(updPt);
        log += `\n\n${nextActor.emoji} **${nextActor.name}** contrattacca **${pt.name}** per **${edmg} danni**!`;
        nextTurn = nextTurn+1;
        if(nextTurn>=combatants.length){nextTurn=0;nextRound++;}
      }
    }

    const allDead = combatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
    const newCombat = {...combat, combatants, turn:nextTurn, round:nextRound};
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    await addMsg(log, "combat", "Battaglia");
    if(allDead) await endCombat();
  }

  async function endCombat() {
    const newQs = {...qs, combat:null};
    await saveQState(newQs);
    await addMsg("🏆 **BATTAGLIA VINTA!** Tutti i nemici sconfitti!", "victory","Sistema");
  }

  // ── QUEST ──
  async function acceptQuest(q) {
    const newQs = {...qs, currentId:q.id, step:0, active:true};
    await saveQState(newQs);
    await addMsg(`⚔️ **MISSIONE: ${q.title}**\n\n${q.desc}\n\n*${q.flavor}*\n\n🎯 Ricompensa: **${q.xpReward} XP** · **${q.goldReward} oro**\n\nDigita **avanza** per iniziare!`, "quest","Master");
  }

  async function advanceQuest() {
    const quests = getQuests();
    const q = quests.find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active){ await addMsg("📋 Nessuna missione attiva.","system","Sistema"); return; }
    const step = qs.step;
    await addMsg(`📍 **${q.title} — Scena ${step+1}/${q.steps.length}**\n\n${q.steps[step]||""}`, "quest","Master");
    if(step+1>=q.steps.length) {
      const xpE=Math.floor(q.xpReward/Math.max(partyPlayers.length,1));
      const goldE=Math.floor(q.goldReward/Math.max(partyPlayers.length,1));
      for(const p of partyPlayers) {
        let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
        while(up.xp>=xpForLevel(up.level)){up.xp-=xpForLevel(up.level);up.level++;up.maxHp+=10;up.hp=up.maxHp;up.atk+=2;up.def+=1;up.mag+=1;}
        await dbSavePlayer(up);
        if(up.id===myId) setMeRaw(up);
      }
      const newQs={...qs,active:false,step:0,currentId:null,completed:[...(qs.completed||[]),q.id]};
      await saveQState(newQs);
      await addMsg(`🎉 **MISSIONE COMPLETATA: ${q.title}!**\n\n✨ +${xpE} XP a testa · 💰 +${goldE} oro a testa`, "victory","Master");
    } else {
      const newQs={...qs,step:step+1};
      await saveQState(newQs);
    }
  }

  async function handleInput() {
    const raw=input.trim(); if(!raw) return;
    setInput("");
    const c=raw.toLowerCase();
    if(c==="avanza") await advanceQuest();
    else if(c==="aiuto") await addMsg(`📜 **Comandi:**\n• **avanza** — prosegui nella missione\n• **stato** — il tuo personaggio\n• **party** — chi c'è nel party\n• **classifica** — punti e livelli\n• Qualsiasi testo → chat`, "system","Sistema");
    else if(c==="stato") { if(me) await addMsg(`${CLASSES[me.class]?.emoji} **${me.name}** · ${RACES[me.race]?.name} ${CLASSES[me.class]?.name} · Lv.${me.level}\n❤️${me.hp}/${me.maxHp} ⚔️${me.atk} 🛡️${me.def} 🔮${me.mag}\n✨XP ${me.xp}/${xpForLevel(me.level)} · 💰${me.gold} oro`,"info",me.name); }
    else if(c==="party") { const lines=partyPlayers.map(p=>`${CLASSES[p.class]?.emoji} **${p.name}** Lv.${p.level} ❤️${p.hp}/${p.maxHp}`); await addMsg(`👥 **Party [${code}]**\n${lines.join("\n")}`,"info","Master"); }
    else if(c==="classifica") { const sorted=[...partyPlayers].sort((a,b)=>b.level-a.level); await addMsg(`🏆 **Classifica**\n${sorted.map((p,i)=>`${["🥇","🥈","🥉"][i]||"  "} ${CLASSES[p.class]?.emoji} **${p.name}** Lv.${p.level} · ${p.xp}XP`).join("\n")}`,"info","Master"); }
    else await addMsg(raw, "chat", me?.name);
    inputRef.current?.focus();
  }

  const MSG_COLORS={
    narration:{bg:"rgba(255,255,255,0.02)",border:"#1f2937",color:"#e2d9c5"},
    system:   {bg:"rgba(109,40,217,0.12)",border:"#5b21b6",color:"#c4b5fd"},
    quest:    {bg:"rgba(245,158,11,0.08)",border:"#b45309",color:"#fde68a"},
    victory:  {bg:"rgba(52,211,153,0.09)",border:"#065f46",color:"#6ee7b7"},
    combat:   {bg:"rgba(239,68,68,0.07)", border:"#7f1d1d",color:"#fca5a5"},
    info:     {bg:"rgba(99,102,241,0.08)",border:"#3730a3",color:"#a5b4fc"},
    chat:     {bg:"rgba(255,255,255,0.025)",border:"#1f2937",color:"#f3f4f6"},
  };

  const combat = qs?.combat;
  const myTurn = combat?.active && combat.combatants?.[combat.turn%combat.combatants.length]?.id===myId;
  const currentQ = qs?.active ? getQuests().find(x=>x.id===qs.currentId) : null;

  if(!me) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#4b5563", fontFamily:"'Cinzel',serif" }}>⏳ Connessione al mondo...</div>;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", position:"relative", zIndex:1 }}>
      {/* SIDEBAR */}
      <aside style={{ width:200, flexShrink:0, background:"rgba(4,4,12,0.98)", borderRight:"1px solid #0f172a", display:"flex", flexDirection:"column", gap:8, padding:"0.7rem", overflowY:"auto" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.75rem", color:"#4c1d95", letterSpacing:"0.1em", paddingBottom:8, borderBottom:"1px solid #0f172a" }}>⚜️ {getMeta().worldName}</div>
        <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #3b0764", borderRadius:5, padding:"0.6rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
            <span style={{ fontSize:"1.3rem" }}>{CLASSES[me.class]?.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#f9fafb", fontSize:"0.82rem", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{me.name}</div>
              <div style={{ color:"#4b5563", fontSize:"0.62rem" }}>{RACES[me.race]?.name} {CLASSES[me.class]?.name}</div>
            </div>
            <span style={{ padding:"1px 5px", background:"#3b0764", borderRadius:3, fontSize:"0.62rem", color:"#a78bfa", flexShrink:0 }}>Lv.{me.level}</span>
          </div>
          <HpBar cur={me.hp} max={me.maxHp} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", marginTop:4 }}>
            <span style={{ color:"#f87171" }}>❤️{me.hp}/{me.maxHp}</span>
            <span style={{ color:"#fb923c" }}>⚔️{me.atk}</span>
            <span style={{ color:"#60a5fa" }}>🛡️{me.def}</span>
          </div>
          <div style={{ height:3, background:"#0f172a", borderRadius:2, overflow:"hidden", marginTop:5 }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg,#6d28d9,#a78bfa)", width:`${Math.min(100,me.xp/xpForLevel(me.level)*100)}%`, transition:"width .5s" }} />
          </div>
          <div style={{ fontSize:"0.58rem", color:"#374151", textAlign:"right", marginTop:1 }}>{me.xp}/{xpForLevel(me.level)} XP</div>
        </div>

        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #0f172a", borderRadius:4, padding:"0.5rem" }}>
          <div style={{ fontSize:"0.58rem", color:"#374151", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>👥 Party · {code}</div>
          {partyPlayers.filter(p=>p.id!==myId).map(p=>(
            <div key={p.id} style={{ display:"flex", gap:5, alignItems:"center", marginBottom:3 }}>
              <span style={{ fontSize:"0.9rem" }}>{CLASSES[p.class]?.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.72rem", color:"#d1d5db", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ height:2, background:"#0f172a", borderRadius:1, overflow:"hidden", marginTop:1 }}>
                  <div style={{ height:"100%", background:p.hp/p.maxHp>0.5?"#22c55e":p.hp/p.maxHp>0.25?"#f59e0b":"#ef4444", width:`${Math.min(100,p.hp/p.maxHp*100)}%` }} />
                </div>
              </div>
              <span style={{ fontSize:"0.6rem", color:"#4b5563", flexShrink:0 }}>Lv.{p.level}</span>
            </div>
          ))}
          {partyPlayers.length<=1&&<div style={{ color:"#1f2937", fontSize:"0.68rem" }}>Solo per ora</div>}
        </div>

        {currentQ && (
          <div style={{ background:"rgba(180,83,9,0.08)", border:"1px solid #78350f", borderRadius:4, padding:"0.5rem" }}>
            <div style={{ fontSize:"0.58rem", color:"#78350f", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>⚔️ Missione</div>
            <div style={{ color:"#fbbf24", fontSize:"0.75rem", fontWeight:700, marginBottom:3 }}>{currentQ.title}</div>
            <div style={{ height:3, background:"#0f172a", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg,#b45309,#fbbf24)", width:`${qs.step/currentQ.steps.length*100}%` }} />
            </div>
            <div style={{ fontSize:"0.6rem", color:"#78350f", marginTop:2 }}>Scena {qs.step}/{currentQ.steps.length}</div>
          </div>
        )}

        {combat?.active && (
          <div style={{ background:myTurn?"rgba(239,68,68,0.15)":"rgba(239,68,68,0.06)", border:`1px solid ${myTurn?"#ef4444":"#7f1d1d"}`, borderRadius:4, padding:"0.5rem" }}>
            <div style={{ fontSize:"0.62rem", color:myTurn?"#ef4444":"#7f1d1d", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>⚔️ Round {combat.round}</div>
            <div style={{ color:myTurn?"#fca5a5":"#6b7280", fontSize:"0.75rem", fontWeight:700 }}>{myTurn?"🔴 TUO TURNO!":"Attendi..."}</div>
          </div>
        )}

        <button onClick={()=>setScreen("landing")} style={{ marginTop:"auto", padding:"0.35rem", background:"transparent", border:"1px solid #0f172a", borderRadius:3, color:"#1f2937", cursor:"pointer", fontSize:"0.62rem", fontFamily:"inherit" }}>← Menu</button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", gap:0, borderBottom:"1px solid #0f172a", background:"rgba(4,4,12,0.98)", flexShrink:0 }}>
          {[["chat","💬 Chat"],["quest","📜 Missioni"],["combat","⚔️ Battaglia"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ padding:"0.6rem 1.2rem", background:tab===k?"rgba(109,40,217,0.2)":"transparent", border:"none", borderBottom:tab===k?"2px solid #7c3aed":"2px solid transparent", color:tab===k?"#c4b5fd":"#4b5563", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", letterSpacing:"0.05em" }}>
              {l}{k==="combat"&&combat?.active&&<span style={{ marginLeft:5, padding:"1px 5px", background:"#7f1d1d", borderRadius:10, fontSize:"0.62rem", color:"#fca5a5" }}>LIVE</span>}
            </button>
          ))}
        </div>

        {tab==="chat" && <>
          <div style={{ flex:1, overflowY:"auto", padding:"0.8rem", display:"flex", flexDirection:"column", gap:5 }}>
            {messages.map(msg=>{
              const s=MSG_COLORS[msg.type]||MSG_COLORS.narration;
              return (
                <div key={msg.id} className="msg-in" style={{ padding:"0.5rem 0.8rem", borderRadius:4, background:s.bg, borderLeft:`3px solid ${s.border}` }}>
                  {msg.author&&<div style={{ fontSize:"0.58rem", letterSpacing:"0.1em", textTransform:"uppercase", color:s.border, marginBottom:2, fontFamily:"'Cinzel',serif" }}>{msg.author}</div>}
                  <div style={{ fontSize:"0.88rem", lineHeight:1.65, color:s.color }} dangerouslySetInnerHTML={{ __html:fmt(msg.content) }} />
                </div>
              );
            })}
            <div ref={msgEnd} />
          </div>
          <div style={{ display:"flex", gap:8, padding:"0.7rem", borderTop:"1px solid #0f172a", background:"rgba(4,4,12,0.98)", flexShrink:0 }}>
            <input ref={inputRef} style={{ flex:1, padding:"0.65rem 0.9rem", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:4, color:"#e2d9c5", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.92rem" }}
              placeholder='Scrivi o digita "avanza", "stato", "aiuto"...' value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleInput()} autoComplete="off" />
            <button onClick={handleInput} style={{ padding:"0.65rem 1.2rem", background:"#3b0764", border:"none", borderRadius:4, color:"#a78bfa", cursor:"pointer", fontSize:"1rem" }}>⏎</button>
          </div>
        </>}

        {tab==="quest" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>📜 Missioni</h3>
            {qs?.active && currentQ && (
              <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid #b45309", borderRadius:6, padding:"1rem", marginBottom:"1rem" }}>
                <div style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontWeight:700, marginBottom:4 }}>⚔️ IN CORSO: {currentQ.title}</div>
                <div style={{ height:5, background:"#0f172a", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ height:"100%", background:"linear-gradient(90deg,#b45309,#fbbf24)", width:`${qs.step/currentQ.steps.length*100}%` }} />
                </div>
                <p style={{ color:"#fde68a", fontSize:"0.85rem", marginBottom:10 }}>Scena {qs.step} di {currentQ.steps.length}</p>
                <BigBtn onClick={advanceQuest} gold icon="⏭️">Avanza</BigBtn>
                {currentQ.enemies?.length>0&&!combat?.active&&(
                  <div style={{ marginTop:8 }}><BigBtn onClick={()=>startCombat(currentQ)} icon="⚔️">Inizia Combattimento</BigBtn></div>
                )}
              </div>
            )}
            {getQuests().filter(q=>q.active).map(q=>{
              const done=(qs?.completed||[]).includes(q.id);
              return (
                <div key={q.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${done?"#1f2937":"#374151"}`, borderRadius:6, padding:"1rem", marginBottom:8, opacity:done?0.5:1 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                        <span style={{ fontFamily:"'Cinzel',serif", color:done?"#4b5563":"#fbbf24", fontWeight:700 }}>{q.title}</span>
                        <span style={{ padding:"1px 7px", border:`1px solid ${DIFF_COLOR[q.difficulty]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[q.difficulty]||"#6b7280" }}>{q.difficulty}</span>
                        {done&&<span style={{ fontSize:"0.7rem", color:"#22c55e" }}>✅ Completata</span>}
                      </div>
                      <p style={{ color:"#6b7280", fontSize:"0.82rem", margin:"0 0 6px" }}>{q.desc}</p>
                      {q.flavor&&<p style={{ color:"#4b5563", fontSize:"0.78rem", fontStyle:"italic", margin:"0 0 8px" }}>{q.flavor}</p>}
                      <div style={{ display:"flex", gap:14, fontSize:"0.73rem", color:"#4b5563" }}>
                        <span>✨ {q.xpReward} XP</span><span>💰 {q.goldReward} oro</span><span>📍 {q.steps.length} scene</span>
                      </div>
                    </div>
                    {!done&&!qs?.active&&<BigBtn onClick={()=>acceptQuest(q)} gold icon="▶️">Accetta</BigBtn>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="combat" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
            {!combat?.active ? (
              <div style={{ textAlign:"center", padding:"3rem", color:"#374151" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>⚔️</div>
                <p>Nessuna battaglia in corso.</p>
                <p style={{ fontSize:"0.8rem" }}>Accetta una missione e usa il tab Missioni per iniziare il combattimento.</p>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
                  <h3 style={{ fontFamily:"'Cinzel',serif", color:"#ef4444", margin:0 }}>⚔️ Battaglia — Round {combat.round}</h3>
                  {myTurn&&<span style={{ padding:"3px 10px", background:"rgba(239,68,68,0.3)", border:"1px solid #ef4444", borderRadius:4, color:"#fca5a5", fontSize:"0.78rem" }}>🔴 TUO TURNO</span>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:8, marginBottom:"1rem" }}>
                  {combat.combatants.map((c,i)=>{
                    const isActive = i===combat.turn%combat.combatants.length;
                    return (
                      <div key={c.id||i} style={{ background:isActive?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.02)", border:`2px solid ${isActive?"#ef4444":c.isPlayer?"#3b0764":"#7f1d1d"}`, borderRadius:6, padding:"0.7rem", opacity:c.hp<=0?0.4:1 }}>
                        <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5 }}>
                          <span style={{ fontSize:"1.4rem" }}>{c.emoji||"👾"}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Cinzel',serif", color:c.isPlayer?"#c4b5fd":"#fca5a5", fontSize:"0.8rem", fontWeight:700 }}>{c.name}{c.isBoss?" 👑":""}</div>
                            <div style={{ fontSize:"0.62rem", color:"#4b5563" }}>Init: {c.rollInit}</div>
                          </div>
                          {isActive&&<span style={{ fontSize:"0.6rem", padding:"1px 4px", background:"#7f1d1d", borderRadius:3, color:"#fca5a5" }}>◀</span>}
                        </div>
                        <HpBar cur={c.hp} max={c.maxHp} red={!c.isPlayer} />
                        <div style={{ fontSize:"0.65rem", color:"#4b5563", marginTop:2, textAlign:"right" }}>{c.hp}/{c.maxHp} HP</div>
                      </div>
                    );
                  })}
                </div>
                {myTurn && (
                  <div style={{ textAlign:"center", padding:"1.5rem", background:"rgba(239,68,68,0.08)", border:"1px solid #7f1d1d", borderRadius:6 }}>
                    <p style={{ color:"#fca5a5", fontFamily:"'Cinzel',serif", marginBottom:"1rem" }}>È il tuo turno!</p>
                    <button onClick={doAttack} style={{ padding:"1rem 3rem", background:"linear-gradient(135deg,#7f1d1d,#dc2626)", border:"2px solid #ef4444", borderRadius:6, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem", cursor:"pointer", letterSpacing:"0.08em" }}>
                      <span className={diceAnim?"dice-spin":""} style={{ display:"inline-block", marginRight:8 }}>🎲</span>
                      ATTACCA!
                    </button>
                    <p style={{ color:"#4b5563", fontSize:"0.72rem", marginTop:"0.5rem" }}>d20 + ATK vs DEF nemico</p>
                  </div>
                )}
                {!myTurn && (
                  <div style={{ textAlign:"center", padding:"1rem", color:"#4b5563" }}>
                    In attesa di <strong style={{ color:"#e2d9c5" }}>{combat.combatants[combat.turn%combat.combatants.length]?.name}</strong>...
                  </div>
                )}
                <div style={{ marginTop:"1rem" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.7rem", color:"#4b5563", marginBottom:6, letterSpacing:"0.08em" }}>LOG DI BATTAGLIA</div>
                  <div style={{ maxHeight:200, overflowY:"auto" }}>
                    {messages.filter(m=>m.type==="combat").slice(-10).map(m=>(
                      <div key={m.id} style={{ padding:"0.4rem 0.7rem", background:"rgba(239,68,68,0.05)", border:"1px solid #7f1d1d", borderRadius:3, marginBottom:4, fontSize:"0.78rem", color:"#fca5a5" }}
                        dangerouslySetInnerHTML={{ __html:fmt(m.content) }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════ */
function HpBar({ cur, max, red }) {
  const pct = Math.min(100, Math.max(0, (cur||0)/(max||1)*100));
  const color = red ? "#ef4444" : pct>60?"#22c55e":pct>30?"#f59e0b":"#ef4444";
  return (
    <div style={{ height:5, background:"#0f172a", borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:"100%", background:color, width:`${pct}%`, transition:"width .4s" }} />
    </div>
  );
}
function BigBtn({ children, onClick, gold, dark, icon, disabled }) {
  const base = { padding:"0.6rem 1.2rem", borderRadius:5, cursor:disabled?"not-allowed":"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", letterSpacing:"0.06em", border:"none", opacity:disabled?0.45:1, display:"inline-flex", alignItems:"center", gap:6 };
  if(gold) return <button onClick={onClick} disabled={disabled} style={{...base,background:"linear-gradient(135deg,#92400e,#d97706)",color:"#fef3c7",border:"1px solid #f59e0b"}}>{icon&&<span>{icon}</span>}{children}</button>;
  if(dark) return <button onClick={onClick} disabled={disabled} style={{...base,background:"rgba(255,255,255,0.05)",color:"#9ca3af",border:"1px solid #1f2937"}}>{icon&&<span>{icon}</span>}{children}</button>;
  return <button onClick={onClick} disabled={disabled} style={{...base,background:"rgba(109,40,217,0.3)",color:"#c4b5fd",border:"1px solid #6d28d9"}}>{icon&&<span>{icon}</span>}{children}</button>;
}
function SmallBtn({ children, onClick, red }) {
  return <button onClick={onClick} style={{ padding:"0.3rem 0.7rem", background:red?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.04)", border:`1px solid ${red?"#ef4444":"#1f2937"}`, borderRadius:4, color:red?"#fca5a5":"#6b7280", cursor:"pointer", fontSize:"0.78rem", fontFamily:"inherit" }}>{children}</button>;
}
function Card({ title, children }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #0f172a", borderRadius:6, padding:"1rem", marginBottom:"0.8rem" }}>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.68rem", color:"#374151", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.7rem", borderBottom:"1px solid #0f172a", paddingBottom:"0.4rem" }}>{title}</div>
      {children}
    </div>
  );
}

const inputStyle = { width:"100%", padding:"0.55rem 0.75rem", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:4, color:"#e2d9c5", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.92rem", display:"block" };
const labelStyle = { display:"block", color:"#374151", fontSize:"0.63rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontFamily:"'Cinzel',serif" };
const backBtnStyle = { padding:"0.35rem 0.8rem", background:"transparent", border:"1px solid #1f2937", borderRadius:4, color:"#4b5563", cursor:"pointer", fontFamily:"inherit", fontSize:"0.8rem" };
const iconBtnStyle = { padding:"2px 6px", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:3, color:"#6b7280", cursor:"pointer", fontSize:"0.8rem" };