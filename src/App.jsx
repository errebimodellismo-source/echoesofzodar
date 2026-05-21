import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "./supabase";
import { CLASSES, RACES, SECRET_UNLOCK_KEY, SECRET_PASSWORD } from "./data/characterData";
import { SPELL_SLOTS, SPELLS } from "./data/spellsData";
import { DEFAULT_QUESTS } from "./data/questsData";
import { DEFAULT_MONSTERS } from "./data/monstersData";
import { DEFAULT_ITEMS, DEFAULT_WEAPON } from "./data/itemsData";
import { STORIES } from "./data/storiesData";
import StoryEditorPanel from "./StoryEditor";
import QuestEditorPanel from "./QuestEditor";
import DiceRoller from "./components/DiceRoller";
import ParticleBackground from "./components/ParticleBackground";
import CombatVisualizer from "./components/CombatVisualizer";
import AnimatedBackground from "./components/AnimatedBackground";
import VoiceChat from "./components/VoiceChat";
import audioManager from "./utils/audioManager";

/* ----------------------------------------------
   FONTS & GLOBAL CSS
---------------------------------------------- */
(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400;1,600&display=swap";
  document.head.appendChild(link);
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.72;transform:scale(1.02)} }
    @keyframes goldenGlow { 0%,100%{text-shadow:0 0 20px rgba(251,191,36,.5)} 50%{text-shadow:0 0 50px rgba(251,191,36,.9),0 0 100px rgba(245,158,11,.4)} }
    @keyframes legNotifIn { from{opacity:0;transform:translateY(-40px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes logAutoDismiss { from{width:100%} to{width:0%} }
    @keyframes floatUp { 0%{opacity:0;transform:translate(-50%,10px) scale(.9)} 18%{opacity:1} 100%{opacity:0;transform:translate(-50%,-42px) scale(1.08)} }
    @keyframes hitShake { 0%,100%{transform:translateX(0)} 18%{transform:translateX(-6px)} 36%{transform:translateX(5px)} 54%{transform:translateX(-3px)} 72%{transform:translateX(2px)} }
    @keyframes combatCueIn { 0%{opacity:0;transform:translateY(10px) scale(.96)} 18%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes combatPulseRing { 0%,100%{box-shadow:0 0 0 rgba(251,191,36,0)} 50%{box-shadow:0 0 26px rgba(251,191,36,.28)} }
    @keyframes dice-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .dice-spin { animation:dice-spin .55s linear infinite; }
    @keyframes restOverlayIn { from{opacity:0} to{opacity:1} }
    @keyframes restStarFloat { 0%{opacity:0;transform:translateY(0) scale(.7)} 45%{opacity:.85} 100%{opacity:0;transform:translateY(-70px) scale(1.1)} }
    @keyframes restSigilPulse { 0%,100%{filter:drop-shadow(0 0 18px rgba(34,211,238,.3)) drop-shadow(0 0 42px rgba(251,191,36,.16));transform:scale(1)} 50%{filter:drop-shadow(0 0 32px rgba(34,211,238,.55)) drop-shadow(0 0 70px rgba(251,191,36,.28));transform:scale(1.015)} }
    @keyframes restRuneSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes restShortBlink { 0%,58%,74%,100%{transform:translateY(-92px)} 63%,68%{transform:translateY(78px)} }
    @keyframes restLongClose { 0%{transform:translateY(-92px)} 48%{transform:translateY(-18px)} 100%{transform:translateY(78px)} }
    @keyframes restUpperLidShort { 0%,56%,76%,100%{transform:translateY(-82px)} 62%,68%{transform:translateY(0)} }
    @keyframes restLowerLidShort { 0%,56%,76%,100%{transform:translateY(82px)} 62%,68%{transform:translateY(0)} }
    @keyframes restUpperLidLong { 0%{transform:translateY(-82px)} 48%{transform:translateY(-22px)} 100%{transform:translateY(0)} }
    @keyframes restLowerLidLong { 0%{transform:translateY(82px)} 48%{transform:translateY(22px)} 100%{transform:translateY(0)} }
    @keyframes restGlowDrift { 0%,100%{opacity:.45;transform:translateY(0)} 50%{opacity:.85;transform:translateY(-5px)} }
    @keyframes restMistSweep { 0%{transform:translateX(-26px);opacity:.18} 50%{opacity:.45} 100%{transform:translateX(26px);opacity:.18} }
    @keyframes legPulse { 0%,100%{box-shadow:0 0 18px rgba(109,40,217,0.5)} 50%{box-shadow:0 0 40px rgba(139,92,246,0.9),0 0 80px rgba(109,40,217,0.5)} }
.msg-in   { animation: fadeUp 0.25s ease; }
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#080810}
    ::-webkit-scrollbar-thumb{background:#2d1b69;border-radius:3px}
    button{transition:all .15s}
    button:hover{filter:brightness(1.2)}
    select,input,textarea{outline:none;cursor:text !important}
    * { box-sizing: border-box; }
    * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Crect x='15' y='2' width='3' height='20' fill='%23c0c0c0' rx='1'/%3E%3Crect x='14' y='20' width='5' height='3' fill='%23b8860b'/%3E%3Crect x='9' y='18' width='15' height='2' fill='%23b8860b' rx='1'/%3E%3Crect x='14' y='23' width='5' height='7' fill='%23b8860b' rx='1'/%3E%3Crect x='15' y='1' width='3' height='4' fill='%23ffd700' rx='1'/%3E%3C/g%3E%3C/svg%3E") 4 4, auto !important; }
    button { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Crect x='15' y='2' width='3' height='20' fill='%23ffd700' rx='1'/%3E%3Crect x='14' y='20' width='5' height='3' fill='%23ff8c00'/%3E%3Crect x='9' y='18' width='15' height='2' fill='%23ff8c00' rx='1'/%3E%3Crect x='14' y='23' width='5' height='7' fill='%23ff8c00' rx='1'/%3E%3Crect x='15' y='1' width='3' height='4' fill='%23fff' rx='1'/%3E%3C/g%3E%3C/svg%3E") 4 4, pointer !important; }
  `;
  document.head.appendChild(style);
})();

/* ----------------------------------------------
   CONSTANTS
---------------------------------------------- */
const DIFF_COLOR = { facile:"#22c55e", medio:"#f97316", difficile:"#ef4444", epica:"#a855f7" };
function normalizeMissionDifficulty(value) {
  const key = String(value || "").trim().toLowerCase();
  if(key === "facile") return "facile";
  if(key === "difficile") return "difficile";
  if(key === "epica" || key === "epico" || key === "epic" || key === "leggendaria" || key === "leggendario") return "epica";
  if(key === "speciale" || key === "molto difficile") return "difficile";
  return "medio";
}
function missionDifficultyLabel(value) {
  return ({
    facile: "Facile",
    medio: "Medio",
    difficile: "Difficile",
    epica: "Epica",
  })[normalizeMissionDifficulty(value)];
}
function questCombatSteps(q) {
  return (q?.steps || []).filter(step => step?.type === "combat");
}
function questMonsters(q) {
  const fromSteps = questCombatSteps(q).flatMap(step => step.monsters || []);
  return fromSteps.length ? fromSteps : (q?.enemies || []);
}
function questBossCount(q) {
  return questMonsters(q).filter(m => m?.isBoss || /boss|capo|signore|regina|re\b|troll|drago|lich/i.test(m?.name || "")).length;
}
function questRecommendedLevel(q) {
  if(Number.isFinite(Number(q?.recommendedLevel))) return Math.max(1, Number(q.recommendedLevel));
  if(Number.isFinite(Number(q?.minLevel))) return Math.max(1, Number(q.minLevel));
  const diff = normalizeMissionDifficulty(q?.difficulty);
  const diffBase = { facile:1, medio:3, difficile:6, epica:10 }[diff] || 3;
  const monsters = questMonsters(q);
  const maxHp = Math.max(0, ...monsters.map(m => Number(m?.maxHp || m?.hp || 0)));
  const maxAtk = Math.max(0, ...monsters.map(m => Number(m?.atk || 0)));
  const pressure = Math.floor(Math.max(maxHp / 45, maxAtk / 5, monsters.length / 2));
  return Math.max(1, Math.min(20, diffBase + pressure + questBossCount(q)));
}
function questRiskProfile(q, partyPlayers = []) {
  const monsters = questMonsters(q);
  const bosses = questBossCount(q);
  const combatCount = questCombatSteps(q).length;
  const recommendedLevel = questRecommendedLevel(q);
  const avgLevel = partyPlayers.length
    ? partyPlayers.reduce((sum, p) => sum + Number(p?.level || 1), 0) / partyPlayers.length
    : 1;
  const levelDelta = avgLevel - recommendedLevel;
  const diff = normalizeMissionDifficulty(q?.difficulty);
  const dangerScore = ({ facile:1, medio:2, difficile:3, epica:4 }[diff] || 2) + bosses + Math.max(0, -levelDelta);
  const risk = dangerScore >= 6 ? "Molto alta" : dangerScore >= 4 ? "Alta" : dangerScore >= 2 ? "Media" : "Bassa";
  const riskColor = dangerScore >= 6 ? "#ef4444" : dangerScore >= 4 ? "#f97316" : dangerScore >= 2 ? "#fbbf24" : "#22c55e";
  const advice = [];
  if(levelDelta < -1) advice.push("Party sottolivellato");
  if(bosses > 0) advice.push(`${bosses} boss`);
  if(monsters.length >= 4) advice.push("Nemici numerosi");
  if(combatCount >= 2) advice.push(`${combatCount} scontri`);
  if((q?.steps || []).some(s => s?.type === "choice")) advice.push("Scelte narrative");
  if(!combatCount) advice.push("Missione narrativa");
  if(diff === "difficile" || diff === "epica" || levelDelta < 0) advice.push("Porta pozioni");
  return { monsters, bosses, combatCount, recommendedLevel, avgLevel, risk, riskColor, advice: advice.slice(0, 4) };
}
const GAME_VERSION = "v1.4.0";
const BACKGROUND_URL = "/assets/Zodarsfondo.png";
const MAINTENANCE_CODE = "__maintenance__";
const AUCTION_HOUSE_CODE = "__world_auctions__";
const MASTER_PASSWORD = "ByBy101112!";
const PORTRAIT_FALLBACK_URL = 'https://fv5-2.files.fm/thumb_show.php?i=p532qftvxy&view&v=1';
function debugCharacterFlow(step, payload) {
  console.log(`[CHAR_FLOW] ${step}`, payload ?? "");
}
const MASTER_EMAILS = (import.meta.env.VITE_MASTER_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);
const PANEL_BG = "rgba(7,10,20,0.96)";
const PANEL_BG_SOFT = "rgba(7,10,20,0.90)";
const PANEL_BORDER = "rgba(148,163,184,0.16)";
const ONLINE_GRACE_MS = 2 * 60 * 1000;
const USER_HEARTBEAT_MS = 30 * 1000;
const LEGENDARY_ITEMS = [
  // Armi
  { id:"leg_excalibur",   name:"Excalibur",          emoji:"⚔️",  type:"weapon", weapon_die:"2d8",  bonus_atk:5, desc:"La leggendaria spada del re" },
  { id:"leg_vorpal",      name:"Lama Vorpal",         emoji:"🗡️",  type:"weapon", weapon_die:"2d6",  bonus_atk:4, desc:"Taglia il destino stesso" },
  { id:"leg_frostbrand",  name:"Frostbrand",          emoji:"❄️",  type:"weapon", weapon_die:"2d6",  bonus_atk:4, desc:"Congela i nemici con ogni colpo" },
  { id:"leg_flamebrand",  name:"Spada di Fuoco",      emoji:"🔥",  type:"weapon", weapon_die:"1d10", bonus_atk:4, desc:"Incendia l'avversario" },
  { id:"leg_moonbow",     name:"Arco della Luna",     emoji:"🏹",  type:"weapon", weapon_die:"2d6",  bonus_atk:4, desc:"Frecce d'argento guidate dalla luna" },
  { id:"leg_thunderhammer",name:"Martello del Tuono", emoji:"⚡",  type:"weapon", weapon_die:"2d10", bonus_atk:3, desc:"Ogni colpo fa tremare la terra" },
  // Armature
  { id:"leg_dragonscale", name:"Armatura del Drago",  emoji:"🐉",  type:"armor",  bonus_def:6, desc:"Squame di drago antico, impenetrabili" },
  { id:"leg_aegis",       name:"Egida degli Dei",     emoji:"🛡️",  type:"armor",  bonus_def:5, desc:"Protetto dalla volontà divina" },
  { id:"leg_shadowcloak", name:"Mantello d'Ombra",    emoji:"🌑",  type:"armor",  bonus_def:4, desc:"Si fonde con le tenebre" },
  { id:"leg_titanplate",  name:"Armatura Titanica",   emoji:"🔱",  type:"armor",  bonus_def:7, desc:"Forgiata dai Titani nel fuoco primordiale" },
  // Focus magici
  { id:"leg_phylactery",  name:"Filatteri del Lich",  emoji:"💀",  type:"magic",  bonus_mag:6, desc:"Frammento dell'anima di un lich" },
  { id:"leg_eye_gods",    name:"Occhio degli Dei",    emoji:"👁️",  type:"magic",  bonus_mag:5, desc:"Vede ogni punto debole del nemico" },
  { id:"leg_starstaff",   name:"Baculo delle Stelle", emoji:"🌟",  type:"magic",  bonus_mag:6, desc:"Forgia incantesimi di potere cosmico" },
  // Reliquie di Zodar — doni supremi del Master
  { id:"leg_zodar_sword", name:"Spada di Zodar",      emoji:"🌌",  type:"weapon", weapon_die:"5d20",   bonus_atk:10, desc:"Forgiata da Zodar nell'alba dei tempi — nessuna lama la eguaglia" },
  { id:"leg_zodar_armor", name:"Armatura di Zodar",   emoji:"✨",  type:"armor",  bonus_def:20, desc:"Ogni scaglia porta il sigillo di Zodar — il male non osa toccarla" },
  // Arma segreta del Master
  { id:"leg_dito_strabo", name:"Dito di Strabo",      emoji:"☝️",  type:"weapon", weapon_die:"100d20", bonus_atk:20, desc:"Il dito puntato di Strabo — ogni colpo riscrive la realtà stessa" },
];

const XP_TABLE = [0,0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000,415000,480000,550000,630000,720000,820000,930000,1050000,1180000,1320000,1470000,1630000,1800000,1980000,2170000,2370000,2580000,2800000,3030000,3270000];
function xpForLevel(l){ const lv = Math.max(1,Math.min(40,l)); return XP_TABLE[lv] ?? XP_TABLE[40]; }

const ACHIEVEMENTS = [
  { id:'first_blood',   tier:1, icon:'🩸', title:'Primo Sangue',      desc:'Uccidi il tuo primo mostro in battaglia',            check:(s)=>s.monstersKilled>=1 },
  { id:'adventurer',    tier:1, icon:'📜', title:'Avventuriero',      desc:'Completa la tua prima missione',                     check:(s)=>s.questsCompleted>=1 },
  { id:'slayer',        tier:2, icon:'⚔️', title:'Cacciatore',        desc:'Sconfiggi 10 mostri',                                check:(s)=>s.monstersKilled>=10 },
  { id:'veteran',       tier:2, icon:'🌟', title:'Veterano',          desc:'Completa 10 missioni',                               check:(s)=>s.questsCompleted>=10 },
  { id:'destroyer',     tier:2, icon:'🔥', title:'Distruttore',       desc:'Infliggi 1.000 danni totali',                        check:(s)=>s.totalDamage>=1000 },
  { id:'crit_master',   tier:2, icon:'🎯', title:'Colpo Preciso',     desc:'Esegui 10 colpi critici',                            check:(s)=>s.criticalHits>=10 },
  { id:'level5',        tier:2, icon:'⭐', title:'Combattente',       desc:'Raggiungi il livello 5',                             check:(s,p)=>(p?.level||1)>=5 },
  { id:'near_death',    tier:2, icon:'👻', title:'Sfidatore del Fato',desc:'Sopravvivi a un tiro salvezza contro la morte',      check:(s)=>s.deathSavesSurvived>=1 },
  { id:'rich',          tier:2, icon:'💰', title:'Tesoro di Guerra',  desc:'Accumula 1.000 monete d\'oro',                       check:(s,p)=>(p?.gold||0)>=1000 },
  { id:'exterminator',  tier:3, icon:'💀', title:'Sterminatore',      desc:'Sconfiggi 50 mostri',                                check:(s)=>s.monstersKilled>=50 },
  { id:'scourge',       tier:3, icon:'💥', title:'Flagello',          desc:'Infliggi 10.000 danni totali',                       check:(s)=>s.totalDamage>=10000 },
  { id:'quest_hero',    tier:3, icon:'🏆', title:'Eroe delle Terre',  desc:'Completa 25 missioni',                               check:(s)=>s.questsCompleted>=25 },
  { id:'level10',       tier:3, icon:'🌙', title:'Guerriero Scelto',  desc:'Raggiungi il livello 10',                            check:(s,p)=>(p?.level||1)>=10 },
  { id:'unkillable',    tier:3, icon:'💎', title:'Indistruttibile',   desc:'Sopravvivi a 5 tiri salvezza contro la morte',       check:(s)=>s.deathSavesSurvived>=5 },
  { id:'wealthy',       tier:3, icon:'🏅', title:'Magnate',           desc:'Accumula 5.000 monete d\'oro',                       check:(s,p)=>(p?.gold||0)>=5000 },
  { id:'death_angel',   tier:4, icon:'☠️', title:'Angelo della Morte',desc:'Sconfiggi 100 mostri',                               check:(s)=>s.monstersKilled>=100 },
  { id:'cataclysm',     tier:4, icon:'🌋', title:'Cataclisma',        desc:'Infliggi 50.000 danni totali',                       check:(s)=>s.totalDamage>=50000 },
  { id:'legend',        tier:4, icon:'👑', title:'Leggenda Vivente',  desc:'Raggiungi il livello 20',                            check:(s,p)=>(p?.level||1)>=20 },
];
function checkNewAchievements(stats, player) {
  const current = new Set(stats?.achievements || []);
  const newlyUnlocked = [];
  for(const a of ACHIEVEMENTS) {
    if(!current.has(a.id) && a.check(stats || {}, player)) { current.add(a.id); newlyUnlocked.push(a); }
  }
  return { achievements:[...current], newlyUnlocked };
}
function getPlayerTitle(stats) {
  const unlocked = stats?.achievements || [];
  for(let i = ACHIEVEMENTS.length - 1; i >= 0; i--) {
    if(unlocked.includes(ACHIEVEMENTS[i].id)) return ACHIEVEMENTS[i];
  }
  return null;
}

/* Guild system */
const GUILD_REGISTRY_CODE = "__world_guilds__";
const WORLD_EVENT_CODE = "__world_events__";

const DAILY_REWARDS = [
  { day:1, icon:"🪙", label:"50 Oro",                        gold:50,   xp:0,   item:null },
  { day:2, icon:"🧪", label:"100 Oro + Pozione di Cura",     gold:100,  xp:0,   item:"potion_hp" },
  { day:3, icon:"⚗️", label:"150 Oro + 2 Pozioni di Cura",   gold:150,  xp:50,  item:"potion_hp", itemQty:2 },
  { day:4, icon:"📦", label:"200 Oro + 100 XP",              gold:200,  xp:100, item:null },
  { day:5, icon:"💎", label:"350 Oro + 200 XP",              gold:350,  xp:200, item:null },
  { day:6, icon:"🏅", label:"500 Oro + Pozione Potenziata",  gold:500,  xp:300, item:"potion_atk" },
  { day:7, icon:"👑", label:"1000 Oro + 500 XP + Gemma Rara",gold:1000, xp:500, item:"gem_rare" },
];

function getDailyStreak(charId) {
  const key = `dailyStreak_${charId}`;
  try { return JSON.parse(localStorage.getItem(key)) || { streak:0, lastDate:"" }; }
  catch { return { streak:0, lastDate:"" }; }
}
function setDailyStreak(charId, data) {
  localStorage.setItem(`dailyStreak_${charId}`, JSON.stringify(data));
}
function checkDailyReward(charId) {
  const today = new Date().toLocaleDateString('en-CA');
  const { streak, lastDate } = getDailyStreak(charId);
  if(lastDate === today) return null; // già riscosso oggi
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
  const newStreak = lastDate === yesterday ? Math.min(streak + 1, 7) : 1;
  return { reward: DAILY_REWARDS[newStreak - 1], newStreak, today };
}

const MEGA_BOSSES = [
  // ── Classici ──
  { id:"zarath",    name:"Zarath il Distruttore",      emoji:"🐉", hp:50000,  atk:35, def:18, dmgDie:"3d12", isBoss:true, desc:"Un antico drago oscuro risvegliato dalle profondità di Zodar. La sua fiamma corrompe tutto ciò che tocca.",                   rewards:{ xp:2000, gold:1500 } },
  { id:"lich",      name:"Il Lich di Malachar",         emoji:"💀", hp:35000,  atk:28, def:14, dmgDie:"4d8",  isBoss:true, desc:"Un potente negromante che ha trasceso la morte. Comanda legioni di non-morti e non conosce pietà.",                           rewards:{ xp:1500, gold:1200 } },
  { id:"titan",     name:"Titano delle Rovine",         emoji:"🗿", hp:60000,  atk:40, def:22, dmgDie:"2d20", isBoss:true, desc:"Un costrutto antico alto come una torre, costruito per difendere una civiltà ormai dimenticata.",                             rewards:{ xp:2500, gold:2000 } },
  { id:"spider",    name:"Arachne la Tessitrice",       emoji:"🕷️", hp:28000,  atk:24, def:12, dmgDie:"3d8",  isBoss:true, desc:"Regina dei ragni giganti, intrappolata nelle caverne di Zodar per secoli. La sua vendetta è spietata.",                      rewards:{ xp:1200, gold:900  } },
  { id:"demon",     name:"Malphas Signore del Caos",    emoji:"😈", hp:45000,  atk:32, def:16, dmgDie:"4d10", isBoss:true, desc:"Un demone primordiale evocato da un culto folle. Distorce la realtà intorno a sé.",                                           rewards:{ xp:1800, gold:1400 } },
  // ── Nuovi ──
  { id:"hydra",     name:"Idra di Sangue Antico",       emoji:"🐍", hp:38000,  atk:30, def:13, dmgDie:"3d10", isBoss:true, desc:"Sette teste rigeneranti che crescono ogni volta che vengono mozzate. Serve coordinazione perfetta per abbatterla.",             rewards:{ xp:1600, gold:1100 } },
  { id:"golem",     name:"Golem di Ossidiana",          emoji:"🪨", hp:70000,  atk:38, def:28, dmgDie:"2d12", isBoss:true, desc:"Una montagna ambulante forgiata da una runa di Zodar. Quasi inattaccabile fisicamente — cercate i punti deboli magici.",       rewards:{ xp:3000, gold:2200 } },
  { id:"banshee",   name:"Banshee della Valle Perduta", emoji:"👻", hp:22000,  atk:26, def:8,  dmgDie:"4d6",  isBoss:true, desc:"Il grido della Banshee paralizza l'anima. Velocissima e letale, ma fragile se si riesce a colpirla.",                          rewards:{ xp:1000, gold:800  } },
  { id:"kraken",    name:"Il Kraken degli Abissi",      emoji:"🦑", hp:55000,  atk:36, def:20, dmgDie:"3d10", isBoss:true, desc:"Emerso dagli abissi di un oceano dimenticato, i suoi tentacoli avvolgono intere fortezze. Nessuno sa cosa vive nel suo occhio.",rewards:{ xp:2300, gold:1800 } },
  { id:"phoenix",   name:"Fenice della Fine dei Tempi", emoji:"🔥", hp:32000,  atk:29, def:11, dmgDie:"4d8",  isBoss:true, desc:"Una fenice che rinasce più forte a ogni morte. Potrebbe risorgere anche durante il combattimento — siate pronti.",              rewards:{ xp:1400, gold:1100 } },
  { id:"vampire",   name:"Conte Valdris il Divoratore", emoji:"🧛", hp:40000,  atk:31, def:15, dmgDie:"3d8",  isBoss:true, desc:"Un vampiro antico che si nutre dell'energia vitale dei combattenti. Più è ferito, più diventa pericoloso.",                     rewards:{ xp:1700, gold:1300 } },
  { id:"wyvern",    name:"Viverna del Vento Oscuro",    emoji:"🦅", hp:33000,  atk:27, def:14, dmgDie:"3d10", isBoss:true, desc:"Una viverna che attacca dal cielo con veleno e artigli. Impossibile da ignorare, impossibile da fermare da soli.",              rewards:{ xp:1400, gold:1050 } },
  { id:"necromancer",name:"Serafael il Necromante Eterno",emoji:"🌑",hp:42000, atk:33, def:16, dmgDie:"4d8",  isBoss:true, desc:"Convoca ondate di non-morti senza sosta. Deve essere abbattuto prima che il suo esercito sommerghi tutto.",                    rewards:{ xp:1800, gold:1350 } },
  { id:"behemoth",  name:"Behemoth delle Pianure Bruciate",emoji:"🦬",hp:80000,atk:42, def:25, dmgDie:"3d20", isBoss:true, desc:"Una bestia colossale che calpesta interi villaggi. Il boss più difficile mai avvistato a Zodar — solo i migliori sopravvivono.",rewards:{ xp:3500, gold:2800 } },
  { id:"medusa",    name:"Medusa Regina delle Pietrificazioni",emoji:"🐍",hp:26000,atk:22,def:10,dmgDie:"3d6",isBoss:true, desc:"Il suo sguardo pietrifica all'istante. Muoversi velocemente è l'unica speranza — fermarsi significa morire.",                  rewards:{ xp:1100, gold:850  } },
  { id:"djinn",     name:"Djinn del Deserto Eterno",    emoji:"🌪️", hp:36000,  atk:29, def:13, dmgDie:"2d12", isBoss:true, desc:"Un genio impazzito di potere cosmico. Distorce le leggi della fisica e lancia incantesimi devastanti ad ogni round.",           rewards:{ xp:1550, gold:1200 } },
  { id:"fungalking",name:"Re Fungale di Zodar",         emoji:"🍄", hp:29000,  atk:20, def:17, dmgDie:"2d10", isBoss:true, desc:"Una mostruosa intelligenza fungina che infetta e controlla i combattenti. Difficile ma non impossibile — occhio alle spore.",   rewards:{ xp:1250, gold:950  } },
];
const GUILD_XP_TABLE = [0,0,500,1500,3000,5000,8000,12000,17000,23000,30000,40000,52000,66000,82000,100000,120000,143000,168000,196000,228000];
const GUILD_EMOJIS = ["⚔️","🛡️","🏹","🔮","🐉","🦅","🌙","☀️","⚡","🔥","❄️","🌿","💀","👑","🌌"];
function getGuildLevel(xp) {
  let lv = 1;
  for(let l = 2; l <= 20; l++) { if((xp||0) >= (GUILD_XP_TABLE[l]||Infinity)) lv = l; else break; }
  return lv;
}
function getGuildGoldBonus(level) { return (level||1) * 2; }
function getGuildFeature(level) {
  if(level >= 20) return { label:"Guerra tra Gilde", icon:"⚔️", unlocked:true };
  if(level >= 10) return { label:"Missioni Epiche", icon:"📜", unlocked:true };
  if(level >= 5)  return { label:"Magazzino", icon:"📦", unlocked:true };
  return null;
}
function getPlayerGuild(guilds, playerId) {
  for(const g of Object.values(guilds||{})) {
    if((g.members||[]).some(m=>m.id===playerId)) return g;
  }
  return null;
}
const GUILD_HALL_STAGES = [
  { minLevel:1,  name:"Catapecchia di Legno", emoji:"🏚️", desc:"Quattro assi e un tetto bucato." },
  { minLevel:3,  name:"Fortezza",             emoji:"🏰", desc:"Mura di pietra che resistono al vento." },
  { minLevel:6,  name:"Castello",             emoji:"🏯", desc:"Torri alte, stendardi al vento." },
  { minLevel:10, name:"Cittadella Sospesa",   emoji:"🌌", desc:"Fluttua tra le nuvole, sfida la gravità." },
  { minLevel:15, name:"Roccaforte Draconica", emoji:"🐉", desc:"Forgiata con le ossa di draghi antichi." },
  { minLevel:20, name:"Bastione di Zodar",    emoji:"✨", desc:"La sede degli eletti. Nessuno osa attaccarla." },
];
function getGuildHallStage(level) {
  let stage = GUILD_HALL_STAGES[0];
  for(const s of GUILD_HALL_STAGES) { if((level||1)>=s.minLevel) stage=s; }
  return stage;
}
const GUILD_ROLES = {
  "Maestro di Gilda":        { icon:"👑", color:"#fbbf24", perms:["invite","kick","war","bank","events","bulletin","promote","roles"] },
  "Custode delle Rune":      { icon:"🔮", color:"#a78bfa", perms:["invite","bank","events","bulletin"] },
  "Tesoriere":               { icon:"💰", color:"#34d399", perms:["bank"] },
  "Araldo":                  { icon:"📯", color:"#60a5fa", perms:["invite","bulletin"] },
  "Cacciatore":              { icon:"🏹", color:"#f97316", perms:[] },
  "Archivista":              { icon:"📚", color:"#94a3b8", perms:["bulletin"] },
  "Inquisitore":             { icon:"⚖️", color:"#f87171", perms:["invite","kick"] },
};
const DEFAULT_ROLE = "Cacciatore";
function hasPerm(member, perm) {
  if(!member) return false;
  if(member.role==="leader") return true;
  const rd = GUILD_ROLES[member.customRole||DEFAULT_ROLE];
  return rd?.perms?.includes(perm)||false;
}

/* ── Stemma araldico ── */
const EMBLEM_SHAPES = [
  // Scudi
  { id:"classic",    label:"Classico",    group:"scudo" },
  { id:"heater",     label:"Triangolare", group:"scudo" },
  { id:"round",      label:"Arrotondato", group:"scudo" },
  { id:"gothic",     label:"Gotico",      group:"scudo" },
  { id:"banner",     label:"Stendardo",   group:"scudo" },
  // Geometrici
  { id:"circle",     label:"Cerchio",     group:"geo" },
  { id:"square",     label:"Quadrato",    group:"geo" },
  { id:"roundsq",    label:"Morbido",     group:"geo" },
  { id:"diamond",    label:"Diamante",    group:"geo" },
  { id:"hexagon",    label:"Esagono",     group:"geo" },
  // Fantasia
  { id:"star",       label:"Stella",      group:"fantasy" },
  { id:"cross",      label:"Croce",       group:"fantasy" },
  { id:"arch",       label:"Arco",        group:"fantasy" },
  { id:"scroll",     label:"Pergamena",   group:"fantasy" },
  { id:"wings",      label:"Ali",         group:"fantasy" },
];
const EMBLEM_PATTERNS = ["solid","pale","fess","quarterly","chevron","bend","saltire"];
const EMBLEM_SYMBOLS = ["⚔️","🛡️","🐉","🦅","👑","🌙","☀️","⚡","🔥","❄️","🌿","💀","🔮","🏹","⚖️","🌌","✨","🦁","🐺","🦊","🐻","🦋","🌹","⭐","💎","🗡️","🏰","🌊","🍃","🔱","🦄","🐍","🦂","🕷️","🦇","🌑","🌸","🍄","🐲","🗺️","🌋","🦴","👁️","🧿","⚜️","🌀","🪄","🏺","🌾","🍷"];
const EMBLEM_COLORS = [
  {id:"gold",     label:"Oro",         hex:"#fbbf24"},
  {id:"silver",   label:"Argento",     hex:"#cbd5e1"},
  {id:"white",    label:"Bianco",      hex:"#f8fafc"},
  {id:"sable",    label:"Nero",        hex:"#0f172a"},
  {id:"gules",    label:"Rosso",       hex:"#ef4444"},
  {id:"crimson",  label:"Cremisi",     hex:"#be123c"},
  {id:"azure",    label:"Azzurro",     hex:"#3b82f6"},
  {id:"navy",     label:"Blu Notte",   hex:"#1e3a8a"},
  {id:"vert",     label:"Verde",       hex:"#22c55e"},
  {id:"forest",   label:"Verde Bosco", hex:"#166534"},
  {id:"purple",   label:"Viola",       hex:"#7c3aed"},
  {id:"indigo",   label:"Indaco",      hex:"#4338ca"},
  {id:"orange",   label:"Arancio",     hex:"#f97316"},
  {id:"amber",    label:"Ambra",       hex:"#d97706"},
  {id:"teal",     label:"Teal",        hex:"#14b8a6"},
  {id:"rose",     label:"Rosa",        hex:"#f472b6"},
  {id:"sand",     label:"Sabbia",      hex:"#d4b483"},
  {id:"bone",     label:"Avorio",      hex:"#e8dcc8"},
];
const DEFAULT_EMBLEM = { shape:"classic", pattern:"solid", color1:"purple", color2:"gold", symbol:"⚔️", border:"gold" };

function _emblemShapePath(shapeId, w, h) {
  const s = {
    // Scudi
    classic:  `M${w*.1},${h*.08} L${w*.9},${h*.08} L${w*.9},${h*.65} Q${w*.5},${h*1.0} ${w*.1},${h*.65} Z`,
    heater:   `M${w*.1},${h*.08} L${w*.9},${h*.08} L${w*.9},${h*.55} Q${w*.5},${h*.92} ${w*.1},${h*.55} Z`,
    round:    `M${w*.1},${h*.08} L${w*.9},${h*.08} L${w*.9},${h*.7} Q${w*.5},${h*.95} ${w*.1},${h*.7} Z`,
    gothic:   `M${w*.1},${h*.08} L${w*.5},${h*.02} L${w*.9},${h*.08} L${w*.9},${h*.62} Q${w*.5},${h*.98} ${w*.1},${h*.62} Z`,
    banner:   `M${w*.1},${h*.08} L${w*.9},${h*.08} L${w*.9},${h*.78} L${w*.5},${h*.92} L${w*.1},${h*.78} Z`,
    // Geometrici
    circle:   `M${w*.5},${h*.05} C${w*.97},${h*.05} ${w*.97},${h*.95} ${w*.5},${h*.95} C${w*.03},${h*.95} ${w*.03},${h*.05} ${w*.5},${h*.05} Z`,
    square:   `M${w*.07},${h*.07} L${w*.93},${h*.07} L${w*.93},${h*.93} L${w*.07},${h*.93} Z`,
    roundsq:  `M${w*.2},${h*.07} Q${w*.07},${h*.07} ${w*.07},${h*.2} L${w*.07},${h*.8} Q${w*.07},${h*.93} ${w*.2},${h*.93} L${w*.8},${h*.93} Q${w*.93},${h*.93} ${w*.93},${h*.8} L${w*.93},${h*.2} Q${w*.93},${h*.07} ${w*.8},${h*.07} Z`,
    diamond:  `M${w*.5},${h*.04} L${w*.96},${h*.5} L${w*.5},${h*.96} L${w*.04},${h*.5} Z`,
    hexagon:  `M${w*.89},${h*.725} L${w*.5},${h*.95} L${w*.11},${h*.725} L${w*.11},${h*.275} L${w*.5},${h*.05} L${w*.89},${h*.275} Z`,
    // Fantasia
    star:     `M${w*.5},${h*.04} L${w*.612},${h*.346} L${w*.937},${h*.358} L${w*.681},${h*.559} L${w*.77},${h*.872} L${w*.5},${h*.69} L${w*.23},${h*.872} L${w*.319},${h*.559} L${w*.063},${h*.358} L${w*.388},${h*.346} Z`,
    cross:    `M${w*.36},${h*.06} L${w*.64},${h*.06} L${w*.64},${h*.36} L${w*.94},${h*.36} L${w*.94},${h*.64} L${w*.64},${h*.64} L${w*.64},${h*.94} L${w*.36},${h*.94} L${w*.36},${h*.64} L${w*.06},${h*.64} L${w*.06},${h*.36} L${w*.36},${h*.36} Z`,
    arch:     `M${w*.1},${h*.95} L${w*.1},${h*.42} Q${w*.1},${h*.05} ${w*.5},${h*.05} Q${w*.9},${h*.05} ${w*.9},${h*.42} L${w*.9},${h*.95} Z`,
    scroll:   `M${w*.5},${h*.04} C${w*.85},${h*.04} ${w*.92},${h*.18} ${w*.92},${h*.5} C${w*.92},${h*.82} ${w*.85},${h*.96} ${w*.5},${h*.96} C${w*.15},${h*.96} ${w*.08},${h*.82} ${w*.08},${h*.5} C${w*.08},${h*.18} ${w*.15},${h*.04} ${w*.5},${h*.04} Z`,
    wings:    `M${w*.5},${h*.45} C${w*.5},${h*.3} ${w*.3},${h*.1} ${w*.05},${h*.2} C${w*.1},${h*.4} ${w*.25},${h*.5} ${w*.5},${h*.45} Z M${w*.5},${h*.45} C${w*.5},${h*.3} ${w*.7},${h*.1} ${w*.95},${h*.2} C${w*.9},${h*.4} ${w*.75},${h*.5} ${w*.5},${h*.45} Z M${w*.38},${h*.45} L${w*.5},${h*.96} L${w*.62},${h*.45} Q${w*.5},${h*.55} ${w*.38},${h*.45} Z`,
  };
  return s[shapeId] || s.classic;
}

function GuildEmblemSVG({ emblem={}, size=80 }) {
  const e = { ...DEFAULT_EMBLEM, ...emblem };
  const c1 = EMBLEM_COLORS.find(c=>c.id===e.color1)?.hex || "#7c3aed";
  const c2 = EMBLEM_COLORS.find(c=>c.id===e.color2)?.hex || "#fbbf24";
  const bd = EMBLEM_COLORS.find(c=>c.id===e.border)?.hex  || "#fbbf24";
  const w=size, h=size;
  const clipId = `clip_${e.shape}_${size}_${e.color1}`;
  const shPath = _emblemShapePath(e.shape, w, h);
  const textY = ["wings"].includes(e.shape) ? h*.38 : h*.62;
  const patternFill = () => {
    const base = <path d={shPath} fill={c1}/>;
    const clip = <clipPath id={clipId}><path d={shPath}/></clipPath>;
    const cp = `url(#${clipId})`;
    if(e.pattern==="solid")     return base;
    if(e.pattern==="pale")      return <>{base}{clip}<rect x={w*.5} y="0" width={w*.5} height={h} fill={c2} clipPath={cp}/></>;
    if(e.pattern==="fess")      return <>{base}{clip}<rect x="0" y={h*.5} width={w} height={h*.5} fill={c2} clipPath={cp}/></>;
    if(e.pattern==="quarterly") return <>{base}{clip}<rect x={w*.5} y="0" width={w*.5} height={h*.5} fill={c2} clipPath={cp}/><rect x="0" y={h*.5} width={w*.5} height={h*.5} fill={c2} clipPath={cp}/></>;
    if(e.pattern==="chevron")   return <>{base}{clip}<polygon points={`0,${h} ${w*.5},${h*.35} ${w},${h}`} fill={c2} clipPath={cp}/></>;
    if(e.pattern==="bend")      return <>{base}{clip}<polygon points={`0,0 ${w},0 ${w},${h*.45} 0,${h*.45}`} fill={c2} clipPath={cp}/></>;
    if(e.pattern==="saltire")   return <>{base}{clip}<polygon points={`0,0 ${w*.15},0 ${w*.5},${h*.38} ${w*.85},0 ${w},0 ${w},${h*.15} ${w*.62},${h*.5} ${w},${h*.85} ${w},${h} ${w*.85},${h} ${w*.5},${h*.62} ${w*.15},${h} 0,${h} 0,${h*.85} ${w*.38},${h*.5} 0,${h*.15}`} fill={c2} clipPath={cp}/></>;
    return base;
  };
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ filter:`drop-shadow(0 2px 8px rgba(0,0,0,0.5))`, overflow:"visible" }}>
      <defs><clipPath id={clipId}><path d={shPath}/></clipPath></defs>
      {patternFill()}
      <path d={shPath} fill="none" stroke={bd} strokeWidth={w*0.045}/>
      <text x={w*.5} y={textY} textAnchor="middle" fontSize={w*.38} dominantBaseline="middle">{e.symbol}</text>
    </svg>
  );
}

function GuildEmblemEditor({ emblem, onChange }) {
  const e = { ...DEFAULT_EMBLEM, ...emblem };
  const Row = ({ label, children }) => (
    <div style={{ marginBottom:10 }}>
      <div style={{ fontSize:"0.68rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{label}</div>
      {children}
    </div>
  );
  const ColorPicker = ({ field }) => (
    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
      {EMBLEM_COLORS.map(c=>(
        <button key={c.id} onClick={()=>onChange({...e,[field]:c.id})} title={c.label}
          style={{ width:22, height:22, borderRadius:"50%", background:c.hex, border:`2px solid ${e[field]===c.id?"#fff":"transparent"}`, cursor:"pointer", outline:"none", flexShrink:0 }}/>
      ))}
    </div>
  );
  const shapeGroups = [
    { key:"scudo",   label:"🛡️ Scudi" },
    { key:"geo",     label:"🔵 Geometrici" },
    { key:"fantasy", label:"✨ Fantasia" },
  ];
  const patternLabels = { solid:"Pieno", pale:"Pale", fess:"Fascia", quarterly:"Quarti", chevron:"Chevron", bend:"Banda", saltire:"Croce X" };
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <div>
        <Row label="Forma logo">
          {shapeGroups.map(grp => (
            <div key={grp.key} style={{ marginBottom:8 }}>
              <div style={{ fontSize:"0.6rem", color:"#475569", marginBottom:4, letterSpacing:"0.06em" }}>{grp.label}</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {EMBLEM_SHAPES.filter(s=>s.group===grp.key).map(s => {
                  const sel = e.shape === s.id;
                  return (
                    <button key={s.id} onClick={()=>onChange({...e,shape:s.id})} title={s.label}
                      style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"5px 6px", background:sel?"rgba(109,40,217,0.35)":"rgba(15,23,42,0.5)", border:`1px solid ${sel?"#7c3aed":"#334155"}`, borderRadius:7, cursor:"pointer", minWidth:44 }}>
                      <svg width={28} height={28} viewBox="0 0 100 100" style={{ display:"block" }}>
                        <path d={_emblemShapePath(s.id,100,100)} fill={sel?"#7c3aed":"#334155"} stroke={sel?"#c4b5fd":"#64748b"} strokeWidth={4}/>
                      </svg>
                      <span style={{ fontSize:"0.55rem", color:sel?"#c4b5fd":"#64748b", whiteSpace:"nowrap" }}>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Row>
        <Row label="Partizione">
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {EMBLEM_PATTERNS.map(p=>(
              <button key={p} onClick={()=>onChange({...e,pattern:p})}
                style={{ padding:"3px 8px", background:e.pattern===p?"rgba(109,40,217,0.4)":"rgba(15,23,42,0.5)", border:`1px solid ${e.pattern===p?"#7c3aed":"#334155"}`, borderRadius:4, color:e.pattern===p?"#c4b5fd":"#64748b", cursor:"pointer", fontSize:"0.63rem" }}>
                {patternLabels[p]||p}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Colore 1"><ColorPicker field="color1"/></Row>
        <Row label="Colore 2"><ColorPicker field="color2"/></Row>
        <Row label="Bordo"><ColorPicker field="border"/></Row>
      </div>
      <div>
        <Row label="Simbolo">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:4, maxHeight:200, overflowY:"auto" }}>
            {EMBLEM_SYMBOLS.map(sym=>(
              <button key={sym} onClick={()=>onChange({...e,symbol:sym})}
                style={{ fontSize:"1.15rem", width:32, height:32, background:e.symbol===sym?"rgba(109,40,217,0.4)":"rgba(15,23,42,0.5)", border:`1px solid ${e.symbol===sym?"#7c3aed":"#334155"}`, borderRadius:5, cursor:"pointer" }}>
                {sym}
              </button>
            ))}
          </div>
        </Row>
        <div style={{ marginTop:14, textAlign:"center" }}>
          <div style={{ fontSize:"0.68rem", color:"#64748b", marginBottom:8, fontFamily:"'Cinzel',serif", letterSpacing:"0.06em" }}>Anteprima</div>
          <GuildEmblemSVG emblem={e} size={100}/>
          <div style={{ marginTop:6, fontSize:"0.62rem", color:"#475569" }}>
            {EMBLEM_SHAPES.find(s=>s.id===e.shape)?.label} · {patternLabels[e.pattern]||e.pattern}
          </div>
        </div>
      </div>
    </div>
  );
}
function useMobile() {
  const [mob, setMob] = useState(() => typeof window !== "undefined" && window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMob(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}
function d(n){ return Math.floor(Math.random()*n)+1; }
function roll(sides,num=1){ let t=0; for(let i=0;i<num;i++) t+=d(sides); return t; }
function randomIntInclusive(min, max) {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  return low + Math.floor(Math.random() * (high - low + 1));
}
function pickRandom(items=[]) {
  return items.length ? items[randomIntInclusive(0, items.length - 1)] : null;
}
function escapeHtml(t="") {
  return String(t).replace(/[&<>"']/g, char => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]
  ));
}
function fmt(t=""){
  return escapeHtml(t)
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/\n/g,"<br/>");
}
let _masterPasswordVerified = false;
function canAccessMasterPanel(user) {
  if(_masterPasswordVerified) return true;
  const email = user?.email?.trim().toLowerCase();
  return !!email && MASTER_EMAILS.includes(email);
}

const MAGIC_CLASSES = ['mage','sorcerer','cleric','druid','bard','warlock','paladin','ranger','necromancer','summoner','artificer','seductress'];

const STATUS_EFFECTS = {
  poison: { label: 'Avvelenato',  emoji: '🐍', color: '#4ade80', damagePerRound: 3 },
  burn:   { label: 'In fiamme',   emoji: '🔥', color: '#fb923c', damagePerRound: 5 },
  stun:   { label: 'Stordito',    emoji: '💫', color: '#facc15', skipTurn: true   },
};

function processStatusEffects(combatant) {
  const effects = combatant.statusEffects || [];
  if (!effects.length) return { combatant, log: null, skipTurn: false, died: false };
  let dmg = 0, skipTurn = false;
  const logs = [], remaining = [];
  for (const fx of effects) {
    const def = STATUS_EFFECTS[fx.type];
    if (!def) continue;
    if (def.damagePerRound) {
      dmg += def.damagePerRound;
      logs.push(`${def.emoji} **${combatant.name}** subisce **${def.damagePerRound}** danni da ${def.label.toLowerCase()}`);
    }
    if (def.skipTurn) {
      skipTurn = true;
      logs.push(`${def.emoji} **${combatant.name}** è ${def.label.toLowerCase()} e salta il turno!`);
    }
    const dur = (fx.duration || 1) - 1;
    if (dur > 0) remaining.push({ ...fx, duration: dur });
    else logs.push(`✨ L'effetto **${def.label}** su **${combatant.name}** è terminato.`);
  }
  const newHp = Math.max(0, (combatant.hp || 0) - dmg);
  return {
    combatant: { ...combatant, hp: newHp, statusEffects: remaining },
    log: logs.length ? logs.join('\n') : null,
    skipTurn,
    died: newHp <= 0,
  };
}
const SUBCLASSES = {
  warrior:  [ { id:'champion',  name:'Campione',             emoji:'🏆', desc:'+2 ATK, +10 HP max', bonus:{atk:2,maxHp:10} }, { id:'guardian',  name:'Guardiano',             emoji:'🛡️', desc:'+3 DEF',           bonus:{def:3} },         { id:'berserker', name:'Berserker',              emoji:'⚡', desc:'+4 ATK, -1 DEF',  bonus:{atk:4,def:-1} } ],
  mage:     [ { id:'archmage',  name:'Arcimago',             emoji:'🌟', desc:'+3 MAG',             bonus:{mag:3} },         { id:'elementalist',name:'Elementalista',          emoji:'🔥', desc:'+2 MAG, +10 HP max', bonus:{mag:2,maxHp:10} },{ id:'necromancer', name:'Negromante',              emoji:'💀', desc:'+4 MAG',           bonus:{mag:4} } ],
  rogue:    [ { id:'assassin',  name:'Assassino',            emoji:'🗡️', desc:'+3 ATK',            bonus:{atk:3} },         { id:'arcane_trickster',name:'Imbroglione Arcano', emoji:'🃏', desc:'+2 ATK, +2 MAG',   bonus:{atk:2,mag:2} },  { id:'shadowdancer',name:'Danzatore delle Ombre',   emoji:'🌑', desc:'+2 ATK, +2 DEF',  bonus:{atk:2,def:2} } ],
  ranger:   [ { id:'hunter',    name:'Cacciatore',           emoji:'🏹', desc:'+3 ATK',            bonus:{atk:3} },         { id:'beastmaster', name:'Signore delle Bestie',  emoji:'🐺', desc:'+2 ATK, +2 MAG',   bonus:{atk:2,mag:2} },  { id:'gloom_stalker',name:'Predatore Oscuro',        emoji:'🌑', desc:'+2 ATK, +2 DEF',  bonus:{atk:2,def:2} } ],
  paladin:  [ { id:'devotion',  name:'Giuramento di Devozione',emoji:'✨',desc:'+2 DEF, +2 MAG',   bonus:{def:2,mag:2} },   { id:'vengeance',   name:'Giuramento di Vendetta', emoji:'⚡', desc:'+3 ATK, +1 MAG',   bonus:{atk:3,mag:1} },  { id:'ancients',    name:'Giuramento degli Antichi', emoji:'🌿', desc:'+2 DEF, +10 HP max',bonus:{def:2,maxHp:10} } ],
  cleric:   [ { id:'sacred',    name:'Ordine Sacro',         emoji:'✝️', desc:'+2 MAG, +2 DEF',   bonus:{mag:2,def:2} },   { id:'war_cleric',  name:'Chierico di Guerra',    emoji:'⚔️', desc:'+3 ATK, +1 MAG',   bonus:{atk:3,mag:1} },  { id:'life_cleric', name:'Chierico della Vita',      emoji:'💚', desc:'+4 MAG, +10 HP max', bonus:{mag:4,maxHp:10} } ],
  druid:    [ { id:'land',      name:'Circolo della Terra',  emoji:'🌍', desc:'+4 MAG',            bonus:{mag:4} },         { id:'moon',        name:'Circolo della Luna',    emoji:'🌙', desc:'+2 DEF, +10 HP max', bonus:{def:2,maxHp:10} },{ id:'spores',      name:'Circolo delle Spore',      emoji:'🍄', desc:'+3 MAG, +1 DEF',  bonus:{mag:3,def:1} } ],
  bard:     [ { id:'lore',      name:'Bardo della Conoscenza',emoji:'📚',desc:'+3 MAG, +5 HP max', bonus:{mag:3,maxHp:5} }, { id:'valor',       name:'Bardo del Valore',       emoji:'🎺', desc:'+2 ATK, +2 MAG',   bonus:{atk:2,mag:2} },  { id:'swords',      name:'Bardo delle Spade',         emoji:'🗡️', desc:'+3 ATK',          bonus:{atk:3} } ],
  warlock:  [ { id:'fiend',     name:'Patto del Diavolo',    emoji:'😈', desc:'+4 MAG',            bonus:{mag:4} },         { id:'great_old_one',name:'Grande Antico',          emoji:'👁️', desc:'+3 MAG, +2 DEF',  bonus:{mag:3,def:2} },  { id:'celestial',   name:'Patto Celeste',             emoji:'☀️', desc:'+2 MAG, +10 HP max',bonus:{mag:2,maxHp:10} } ],
  sorcerer: [ { id:'draconic',  name:'Lignaggio Draconico',  emoji:'🐉', desc:'+3 MAG, +10 HP max',bonus:{mag:3,maxHp:10}}, { id:'storm',       name:'Anima della Tempesta',   emoji:'⛈️', desc:'+4 MAG',           bonus:{mag:4} },         { id:'shadow',      name:'Magia delle Ombre',         emoji:'🌑', desc:'+2 MAG, +2 DEF',  bonus:{mag:2,def:2} } ],
};
function getSubclassOptions(cls) { return SUBCLASSES[cls] || SUBCLASSES.warrior; }

const CRAFT_MATERIALS = [
  // Metalli (20)
  { id:"mat_iron_ore",        name:"Minerale di Ferro",      emoji:"🪨", type:"material", rarity:"common",    price:100,   description:"Minerale ferroso grezzo, base per qualsiasi forgiatura.", available:true },
  { id:"mat_copper_ore",      name:"Minerale di Rame",       emoji:"🟤", type:"material", rarity:"common",    price:80,    description:"Metallo tenero e malleabile.", available:true },
  { id:"mat_tin_ore",         name:"Minerale di Stagno",     emoji:"⚪", type:"material", rarity:"common",    price:70,    description:"Usato per leghe e saldature base.", available:true },
  { id:"mat_coal",            name:"Carbone",                emoji:"⚫", type:"material", rarity:"common",    price:60,    description:"Combustibile essenziale per le forge.", available:true },
  { id:"mat_bronze_ingot",    name:"Lingotto di Bronzo",     emoji:"🔶", type:"material", rarity:"common",    price:120,   description:"Lega resistente di rame e stagno.", available:true },
  { id:"mat_iron_ingot",      name:"Lingotto di Ferro",      emoji:"🔩", type:"material", rarity:"uncommon",  price:280,   description:"Ferro purificato, pronto per la lavorazione.", available:true },
  { id:"mat_silver_ore",      name:"Minerale d'Argento",     emoji:"🌕", type:"material", rarity:"uncommon",  price:320,   description:"Metallo nobile con proprietà magiche.", available:true },
  { id:"mat_steel_ingot",     name:"Lingotto d'Acciaio",     emoji:"⚙️", type:"material", rarity:"uncommon",  price:400,   description:"Acciaio temperato — richiesto per la 2ª forgiatura.", available:true },
  { id:"mat_gold_dust",       name:"Polvere d'Oro",          emoji:"✨", type:"material", rarity:"uncommon",  price:450,   description:"Oro macinato per incantesimi e rivestimenti.", available:true },
  { id:"mat_cold_iron",       name:"Ferro Freddo",           emoji:"🧊", type:"material", rarity:"uncommon",  price:350,   description:"Forgiato senza calore, bane per i fey.", available:true },
  { id:"mat_mithril_ore",     name:"Mithril Grezzo",         emoji:"💠", type:"material", rarity:"rare",      price:1200,  description:"Metallo leggendario — richiesto per la 3ª forgiatura.", available:true },
  { id:"mat_electrum_bar",    name:"Lingotto di Electrum",   emoji:"🌟", type:"material", rarity:"rare",      price:1000,  description:"Lega misteriosa di oro e argento.", available:true },
  { id:"mat_moonsilver",      name:"Argento Lunare",         emoji:"🌙", type:"material", rarity:"rare",      price:1400,  description:"Argento caricato dalla luce della luna piena.", available:true },
  { id:"mat_star_metal",      name:"Metallo Stellare",       emoji:"⭐", type:"material", rarity:"rare",      price:2000,  description:"Caduto dalle stelle — richiesto per la 4ª forgiatura.", available:true },
  { id:"mat_sunsteel",        name:"Acciaio Solare",         emoji:"☀️", type:"material", rarity:"epic",      price:7000,  description:"Acciaio benedetto dalla luce divina.", available:true },
  { id:"mat_adamantite_ore",  name:"Adamantite Grezzo",      emoji:"💎", type:"material", rarity:"epic",      price:9000,  description:"Il metallo più duro — richiesto per la 6ª forgiatura.", available:true },
  { id:"mat_orichalcum",      name:"Oricalco",               emoji:"🔱", type:"material", rarity:"epic",      price:10000, description:"Metallo mitico dalle profondità della terra.", available:true },
  { id:"mat_void_iron",       name:"Ferro del Vuoto",        emoji:"🌑", type:"material", rarity:"epic",      price:11000, description:"Forgiato nel vuoto assoluto.", available:true },
  { id:"mat_celestial_alloy", name:"Lega Celeste",           emoji:"👑", type:"material", rarity:"legendary", price:50000, description:"Metallo degli angeli, insuperabile.", available:true },
  { id:"mat_zodar_ore",       name:"Minerale di Zodar",      emoji:"🌌", type:"material", rarity:"legendary", price:80000, description:"Estratto dal cuore del mondo di Zodar.", available:true },
  // Legni (15)
  { id:"mat_oak_plank",       name:"Tavola di Quercia",      emoji:"🪵", type:"material", rarity:"common",    price:70,    description:"Legno robusto per manici e componenti.", available:true },
  { id:"mat_ashwood_log",     name:"Tronco di Frassino",     emoji:"🌲", type:"material", rarity:"common",    price:80,    description:"Elastico e resistente agli urti.", available:true },
  { id:"mat_pine_resin",      name:"Resina di Pino",         emoji:"🌿", type:"material", rarity:"common",    price:60,    description:"Collante naturale per assemblaggi.", available:true },
  { id:"mat_birchwood",       name:"Betulla Bianca",         emoji:"🤍", type:"material", rarity:"common",    price:75,    description:"Legno chiaro e flessibile.", available:true },
  { id:"mat_duskwood",        name:"Legno del Tramonto",     emoji:"🟫", type:"material", rarity:"uncommon",  price:260,   description:"Legno oscuro con strane proprietà.", available:true },
  { id:"mat_ironwood",        name:"Legno di Ferro",         emoji:"🪵", type:"material", rarity:"uncommon",  price:300,   description:"Duro come il metallo, leggero come il legno.", available:true },
  { id:"mat_ebonwood",        name:"Ebano",                  emoji:"🖤", type:"material", rarity:"uncommon",  price:350,   description:"Legno nero pregiato, assorbe le magie.", available:true },
  { id:"mat_spiritwood",      name:"Legno Spiritato",        emoji:"🌿", type:"material", rarity:"rare",      price:1100,  description:"Albero antico intriso di spiriti elementali.", available:true },
  { id:"mat_moonwood",        name:"Legno Lunare",           emoji:"🌙", type:"material", rarity:"rare",      price:1300,  description:"Raccolto sotto la luna piena, potenzia gli archi.", available:true },
  { id:"mat_dragonwood",      name:"Legno del Drago",        emoji:"🐲", type:"material", rarity:"rare",      price:1600,  description:"Tronco bruciato dal soffio draconico e recuperato.", available:true },
  { id:"mat_void_bark",       name:"Corteccia del Vuoto",    emoji:"🌑", type:"material", rarity:"epic",      price:7500,  description:"Corteccia nera di alberi cresciuti nel vuoto.", available:true },
  { id:"mat_elder_tree_heart",name:"Cuore d'Albero Antico",  emoji:"💚", type:"material", rarity:"epic",      price:9500,  description:"Il nucleo pulsante di un antico treant.", available:true },
  { id:"mat_worldtree_branch",name:"Ramo dell'Albero Mondo", emoji:"🌳", type:"material", rarity:"epic",      price:12000, description:"Frammento di Yggdrasil del mondo di Zodar.", available:true },
  { id:"mat_phoenixthorn",    name:"Spino della Fenice",     emoji:"🔥", type:"material", rarity:"legendary", price:55000, description:"Rami ardenti che non si consumano mai.", available:true },
  { id:"mat_zodar_driftwood", name:"Deriva di Zodar",        emoji:"🌌", type:"material", rarity:"legendary", price:70000, description:"Legno fluttuante trasportato dai venti cosmici di Zodar.", available:true },
  // Cuoi (10)
  { id:"mat_beast_hide",      name:"Pelle di Bestia",        emoji:"🟫", type:"material", rarity:"common",    price:90,    description:"Pelle grezza di una bestia comune.", available:true },
  { id:"mat_wolf_pelt",       name:"Pelliccia di Lupo",      emoji:"🐺", type:"material", rarity:"common",    price:110,   description:"Pelliccia folta e calda.", available:true },
  { id:"mat_bear_hide",       name:"Pelle d'Orso",           emoji:"🐻", type:"material", rarity:"uncommon",  price:290,   description:"Cuoio spesso e resistente.", available:true },
  { id:"mat_wyvern_scales",   name:"Scaglie di Viverna",     emoji:"🦎", type:"material", rarity:"uncommon",  price:380,   description:"Scaglie dure di viverna.", available:true },
  { id:"mat_shadow_leather",  name:"Cuoio d'Ombra",          emoji:"🌑", type:"material", rarity:"rare",      price:1200,  description:"Cuoio che assorbe la luce.", available:true },
  { id:"mat_treant_bark_leather",name:"Cuoio di Treant",     emoji:"🌳", type:"material", rarity:"rare",      price:1400,  description:"Pelle legnosa di un antico treant.", available:true },
  { id:"mat_basilisk_hide",   name:"Pelle di Basilisco",     emoji:"🐍", type:"material", rarity:"rare",      price:1600,  description:"Resistente agli incantesimi di pietrificazione.", available:true },
  { id:"mat_griffin_feather_leather",name:"Cuoio di Grifone",emoji:"🦅", type:"material", rarity:"epic",      price:8000,  description:"Lavorato dalle piume e dalla pelle di un grifone.", available:true },
  { id:"mat_phoenix_leather", name:"Cuoio di Fenice",        emoji:"🔥", type:"material", rarity:"epic",      price:10000, description:"Pelle ignifuga della fenice.", available:true },
  { id:"mat_dragon_hide",     name:"Pelle di Drago",         emoji:"🐉", type:"material", rarity:"legendary", price:60000, description:"La pelle più resistente del mondo.", available:true },
  // Gemme (20)
  { id:"mat_ruby_shard",      name:"Frammento di Rubino",    emoji:"🔴", type:"material", rarity:"common",    price:130,   description:"Scheggia di rubino grezzo.", available:true },
  { id:"mat_sapphire_shard",  name:"Frammento di Zaffiro",   emoji:"🔵", type:"material", rarity:"common",    price:130,   description:"Scheggia di zaffiro grezzo.", available:true },
  { id:"mat_emerald_shard",   name:"Frammento di Smeraldo",  emoji:"💚", type:"material", rarity:"common",    price:130,   description:"Scheggia di smeraldo grezzo.", available:true },
  { id:"mat_topaz_chip",      name:"Scheggia di Topazio",    emoji:"🟡", type:"material", rarity:"common",    price:110,   description:"Frammento di topazio dorato.", available:true },
  { id:"mat_amethyst_chip",   name:"Scheggia di Ametista",   emoji:"💜", type:"material", rarity:"common",    price:110,   description:"Frammento di ametista viola.", available:true },
  { id:"mat_garnet",          name:"Granato",                emoji:"❤️", type:"material", rarity:"uncommon",  price:350,   description:"Pietra rossa scura e preziosa.", available:true },
  { id:"mat_jade_stone",      name:"Giada",                  emoji:"🟢", type:"material", rarity:"uncommon",  price:320,   description:"Pietra verde sacra agli spiriti.", available:true },
  { id:"mat_onyx",            name:"Onice",                  emoji:"⚫", type:"material", rarity:"uncommon",  price:300,   description:"Pietra nera usata nei rituali.", available:true },
  { id:"mat_moonstone",       name:"Pietra di Luna",         emoji:"🌕", type:"material", rarity:"uncommon",  price:420,   description:"Brilla al chiaro di luna.", available:true },
  { id:"mat_bloodstone",      name:"Pietra di Sangue",       emoji:"🩸", type:"material", rarity:"uncommon",  price:390,   description:"Macchiata di sangue antico.", available:true },
  { id:"mat_star_ruby",       name:"Rubino Stellare",        emoji:"⭐", type:"material", rarity:"rare",      price:1500,  description:"Rubino con una stella a sei punte all'interno.", available:true },
  { id:"mat_star_sapphire",   name:"Zaffiro Stellare",       emoji:"💠", type:"material", rarity:"rare",      price:1500,  description:"Zaffiro con una stella luminosa.", available:true },
  { id:"mat_black_diamond",   name:"Diamante Nero",          emoji:"💎", type:"material", rarity:"rare",      price:1800,  description:"Diamante oscuro estremamente raro.", available:true },
  { id:"mat_fire_opal",       name:"Opale di Fuoco",         emoji:"🔥", type:"material", rarity:"rare",      price:1600,  description:"Pietra che brucia dall'interno.", available:true },
  { id:"mat_void_gem",        name:"Gemma del Vuoto",        emoji:"🌌", type:"material", rarity:"epic",      price:8500,  description:"Gemma nata nel vuoto, riflette l'oscurità.", available:true },
  { id:"mat_celestial_diamond",name:"Diamante Celeste",      emoji:"💎", type:"material", rarity:"epic",      price:11000, description:"Diamante caduto dal cielo.", available:true },
  { id:"mat_chaos_crystal",   name:"Cristallo del Caos",     emoji:"⚡", type:"material", rarity:"epic",      price:13000, description:"Cristallo instabile carico di energia caotica.", available:true },
  { id:"mat_infinity_stone",  name:"Pietra dell'Infinito",   emoji:"♾️", type:"material", rarity:"legendary", price:65000, description:"Pietra che contiene un frammento dell'infinito.", available:true },
  { id:"mat_zodar_gem",       name:"Gemma di Zodar",         emoji:"🌌", type:"material", rarity:"legendary", price:90000, description:"Gemma creata da Zodar per incanalare il suo potere.", available:true },
  { id:"mat_prismatic_shard", name:"Scheggia Prismatica",    emoji:"🌈", type:"material", rarity:"legendary", price:75000, description:"Frammento che contiene tutti i colori dell'esistenza.", available:true },
  // Essenze (15)
  { id:"mat_fire_essence",    name:"Essenza del Fuoco",      emoji:"🔥", type:"material", rarity:"common",    price:100,   description:"Energia del fuoco elementale.", available:true },
  { id:"mat_frost_essence",   name:"Essenza del Gelo",       emoji:"🧊", type:"material", rarity:"common",    price:100,   description:"Energia del gelo elementale.", available:true },
  { id:"mat_lightning_essence",name:"Essenza del Fulmine",   emoji:"⚡", type:"material", rarity:"uncommon",  price:300,   description:"Energia elettrica purificata.", available:true },
  { id:"mat_shadow_essence",  name:"Essenza dell'Ombra",     emoji:"🌑", type:"material", rarity:"uncommon",  price:300,   description:"Energia oscura dell'ombra.", available:true },
  { id:"mat_nature_essence",  name:"Essenza della Natura",   emoji:"🌿", type:"material", rarity:"uncommon",  price:280,   description:"Forza vitale della natura.", available:true },
  { id:"mat_storm_essence",   name:"Essenza della Tempesta", emoji:"⛈️", type:"material", rarity:"uncommon",  price:360,   description:"Energia della tempesta primordiale.", available:true },
  { id:"mat_ether_crystal",   name:"Cristallo di Etere",     emoji:"💠", type:"material", rarity:"rare",      price:1500,  description:"Cristallo etereo — richiesto per la 5ª forgiatura.", available:true },
  { id:"mat_arcane_surge",    name:"Aura Arcana",            emoji:"🔮", type:"material", rarity:"rare",      price:1100,  description:"Surplus di energia arcana pura.", available:true },
  { id:"mat_life_essence",    name:"Essenza della Vita",     emoji:"💚", type:"material", rarity:"rare",      price:1300,  description:"L'energia vitale distillata.", available:true },
  { id:"mat_death_essence",   name:"Essenza della Morte",    emoji:"💀", type:"material", rarity:"rare",      price:1700,  description:"L'energia dell'oltre-morte.", available:true },
  { id:"mat_time_fragment",   name:"Frammento del Tempo",    emoji:"⏳", type:"material", rarity:"epic",      price:10000, description:"Un attimo congelato nell'eternità.", available:true },
  { id:"mat_dragon_essence",  name:"Essenza di Drago",       emoji:"🐉", type:"material", rarity:"epic",      price:12000, description:"L'anima distillata di un grande drago.", available:true },
  { id:"mat_void_essence",    name:"Essenza del Vuoto",      emoji:"🌌", type:"material", rarity:"epic",      price:12000, description:"L'energia del nulla assoluto — richiesto per la 8ª forgiatura.", available:true },
  { id:"mat_phoenix_ash",     name:"Cenere di Fenice",       emoji:"🔥", type:"material", rarity:"legendary", price:55000, description:"Cenere che pulsa di vita eterna.", available:true },
  { id:"mat_zodar_essence",   name:"Essenza di Zodar",       emoji:"🌌", type:"material", rarity:"legendary", price:100000,description:"L'essenza pura di Zodar — richiesta per la forgiatura finale.", available:true },
  // Parti di Mostro (15)
  { id:"mat_goblin_ear",      name:"Orecchio di Goblin",     emoji:"👂", type:"material", rarity:"common",    price:65,    description:"Trofeo comune dai goblin.", available:true },
  { id:"mat_skeleton_bone",   name:"Osso di Scheletro",      emoji:"🦴", type:"material", rarity:"common",    price:80,    description:"Osso incantato di un non-morto.", available:true },
  { id:"mat_slime_core",      name:"Nucleo di Melma",        emoji:"🟢", type:"material", rarity:"common",    price:90,    description:"Il nucleo rigenerativo di uno slime.", available:true },
  { id:"mat_troll_hide",      name:"Pelle di Troll",         emoji:"🟤", type:"material", rarity:"uncommon",  price:280,   description:"Pelle rigenerante del troll.", available:true },
  { id:"mat_medusa_scale",    name:"Scaglia di Medusa",      emoji:"🐍", type:"material", rarity:"uncommon",  price:360,   description:"Scaglia con potere pietrificante residuo.", available:true },
  { id:"mat_vampire_fang",    name:"Zanna di Vampiro",       emoji:"🧛", type:"material", rarity:"uncommon",  price:430,   description:"Zanna che drena l'energia vitale.", available:true },
  { id:"mat_werewolf_claw",   name:"Artiglio di Mannaro",    emoji:"🐺", type:"material", rarity:"rare",      price:1100,  description:"Artiglio che mantiene il suo potere.", available:true },
  { id:"mat_griffin_claw",    name:"Artiglio di Grifone",    emoji:"🦅", type:"material", rarity:"rare",      price:1300,  description:"Affilato e resistente come l'acciaio.", available:true },
  { id:"mat_basilisk_eye",    name:"Occhio di Basilisco",    emoji:"👁️", type:"material", rarity:"rare",      price:1500,  description:"Ancora in grado di pietrificare.", available:true },
  { id:"mat_manticore_spike", name:"Spina di Manticore",     emoji:"🦁", type:"material", rarity:"rare",      price:1700,  description:"Veleno residuo nella spina.", available:true },
  { id:"mat_dragon_scale",    name:"Scaglia di Drago",       emoji:"🐉", type:"material", rarity:"epic",      price:10000, description:"Resistente al fuoco e alla magia — richiesta per la 7ª forgiatura.", available:true },
  { id:"mat_hydra_blood",     name:"Sangue di Idra",         emoji:"🩸", type:"material", rarity:"epic",      price:9000,  description:"Sangue rigenerante dell'idra.", available:true },
  { id:"mat_phoenix_feather", name:"Piuma di Fenice",        emoji:"🔥", type:"material", rarity:"epic",      price:15000, description:"Piuma che brucia e rinasce — richiesta per la 9ª forgiatura.", available:true },
  { id:"mat_tarrasque_hide",  name:"Pelle del Tarrasque",    emoji:"👹", type:"material", rarity:"legendary", price:70000, description:"La pelle più resistente dell'esistenza.", available:true },
  { id:"mat_dragon_heart",    name:"Cuore di Drago",         emoji:"🐉", type:"material", rarity:"legendary", price:50000, description:"Il cuore pulsante di un grande wyrm — 10ª forgiatura.", available:true },
  // Rune (5)
  { id:"mat_rune_of_power",      name:"Runa del Potere",     emoji:"🔴", type:"material", rarity:"rare",      price:1800,  description:"Runa che amplifica la forza offensiva.", available:true },
  { id:"mat_rune_of_protection", name:"Runa di Protezione",  emoji:"🔵", type:"material", rarity:"rare",      price:1700,  description:"Runa che rinforza la difesa.", available:true },
  { id:"mat_rune_of_swiftness",  name:"Runa della Velocità", emoji:"🟡", type:"material", rarity:"rare",      price:1600,  description:"Runa che accelera i movimenti.", available:true },
  { id:"mat_rune_of_wisdom",     name:"Runa della Saggezza", emoji:"💜", type:"material", rarity:"epic",      price:11000, description:"Runa che potenzia la mente.", available:true },
  { id:"mat_rune_of_zodar",      name:"Runa di Zodar",       emoji:"🌌", type:"material", rarity:"legendary", price:100000,description:"La runa suprema del mondo di Zodar.", available:true },
];

const FORGE_DIE_PROGRESSION = ['1d4','1d6','1d8','1d10','1d12','2d6','2d8','2d10','1d20','1d20+1d4','1d20+1d6','1d20+1d8','1d20+1d10','1d20+1d12','2d20'];
const FORGE_MATERIAL_REQ = [
  'mat_iron_ore',      // → 1d6       (idx 1)
  'mat_steel_ingot',   // → 1d8       (idx 2)
  'mat_mithril_ore',   // → 1d10      (idx 3)
  'mat_star_metal',    // → 1d12      (idx 4)
  'mat_ether_crystal', // → 2d6       (idx 5) — tier leggendario
  'mat_adamantite_ore',// → 2d8       (idx 6)
  'mat_dragon_scale',  // → 2d10      (idx 7)
  'mat_void_essence',  // → 1d20      (idx 8)
  'mat_phoenix_feather',// → 1d20+1d4 (idx 9)
  'mat_dragon_heart',  // → 1d20+1d6  (idx 10)
  'mat_zodar_essence', // → 1d20+1d8  (idx 11)
  'mat_phoenix_ash',   // → 1d20+1d10 (idx 12)
  'mat_tarrasque_hide',// → 1d20+1d12 (idx 13)
  'mat_rune_of_zodar', // → 2d20      (idx 14) — forgiatura suprema
];

function getForgeLevel(itemId) { const m = String(itemId||'').match(/__f(\d+)$/); return m ? Number(m[1]) : 0; }
function getBaseItemId(itemId) { return String(itemId||'').replace(/__f\d+$/, ''); }
function getNextForgeItemId(itemId) { return `${getBaseItemId(itemId)}__f${getForgeLevel(itemId)+1}`; }

/* ═══════════════════════════════════════════════
   DUNGEON PROCEDURALE
═══════════════════════════════════════════════ */
const DUNGEON_THEMES = [
  { id:'crypt',   name:'Cripta degli Antichi', emoji:'💀', adj:['buio','putrefatto','antico','silenzioso','maledetto'] },
  { id:'cave',    name:'Grotta Maledetta',     emoji:'🦇', adj:['umido','profondo','tortuoso','stretto','oscuro'] },
  { id:'ruins',   name:'Rovine della Torre',   emoji:'🏚️', adj:['crollante','antico','sgretolato','dimenticato','polveroso'] },
  { id:'forest',  name:'Bosco Oscuro',         emoji:'🌲', adj:['intricato','silenzioso','maledetto','angusto','misterioso'] },
  { id:'castle',  name:'Castello Maledetto',   emoji:'🏰', adj:['maestoso','sinistro','abbandonato','freddo','tetro'] },
  { id:'volcano', name:'Vulcano Infernale',    emoji:'🌋', adj:['incandescente','soffocante','ardente','infuocato','pericoloso'] },
  { id:'temple',  name:'Tempio Proibito',      emoji:'⛩️', adj:['sacro','misterioso','antico','sigillato','venerato'] },
  { id:'ship',    name:'Nave Fantasma',        emoji:'⛵', adj:['spettrale','marcio','lurido','silenzioso','infestato'] },
];
const DUNGEON_ROOM_CFG = {
  combat:   { emoji:'⚔️',  label:'Stanza di Combattimento', color:'#ef4444' },
  boss:     { emoji:'👹',  label:'Sala del Boss',           color:'#c026d3' },
  trap:     { emoji:'⚠️',  label:'Trappola',                color:'#f59e0b' },
  treasure: { emoji:'💰',  label:'Camera del Tesoro',       color:'#fbbf24' },
  rest:     { emoji:'🔥',  label:'Accampamento Segreto',    color:'#22c55e' },
  choice:   { emoji:'🔀',  label:'Bivio',                   color:'#60a5fa' },
  riddle:   { emoji:'🧩',  label:'Enigma',                  color:'#a78bfa' },
  event:    { emoji:'📖',  label:'Evento Narrativo',        color:'#94a3b8' },
  shrine:   { emoji:'🕯️',  label:'Altare Sacro',            color:'#fb923c' },
  merchant: { emoji:'🧙',  label:'Mercante del Dungeon',    color:'#34d399' },
};
const DUNGEON_TRAP_SKILLS = [
  { skill:'ATK', label:'Forza',    stat:'atk', desc:'Sforzate la struttura instabile' },
  { skill:'DEF', label:'Riflessi', stat:'def', desc:'Schivate il meccanismo scattato' },
  { skill:'MAG', label:'Magia',    stat:'mag', desc:'Neutralizzate il sigillo magico' },
];
function _dpick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function _buildDungeonRoom(type, idx, theme, rng, partyLevel) {
  const adj = _dpick(theme.adj, rng);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const monTier = Math.max(1, Math.ceil(partyLevel / 3));
  const dc = 10 + Math.floor(partyLevel / 2) * 2;
  const gold = Math.floor((30 + partyLevel * 20) * (0.8 + rng() * 0.4));
  if (type === 'combat') {
    const pool = DEFAULT_MONSTERS.filter(m => m.tier && m.tier <= monTier + 1 && m.tier >= Math.max(1, monTier - 1));
    const base = pool.length ? pool : DEFAULT_MONSTERS;
    const count = 1 + Math.floor(rng() * 2) + (partyLevel >= 5 ? 1 : 0) + (partyLevel >= 9 ? 1 : 0);
    // Scale HP and ATK with party level so monsters stay threatening at high levels
    const hpMult = 1 + (partyLevel - 1) * 0.13;
    const atkAdd = Math.floor(partyLevel * 0.35);
    return { id:`r${idx}`, type, idx, title:`Sala ${cap(adj)}`, desc:`Una stanza ${adj} brulicante di nemici. Prepararsi al combattimento.`, monsters: Array.from({length:count}, ()=>{ const m = _dpick(base, rng); const scaledHp = Math.floor((m.hp||10) * hpMult); return {...m, hp:scaledHp, maxHp:scaledHp, atk:(m.atk||5)+atkAdd}; }), cleared:false };
  }
  if (type === 'trap') {
    const ts = _dpick(DUNGEON_TRAP_SKILLS, rng);
    return { id:`r${idx}`, type, idx, title:`Corridoio ${cap(adj)}`, desc:`Un corridoio ${adj} nasconde una trappola. ${ts.desc} (DC ${dc}).`, skill:ts.skill, skillLabel:ts.label, skillStat:ts.stat, dc, failDmg: 5 + partyLevel * 3, cleared:false };
  }
  if (type === 'treasure') {
    return { id:`r${idx}`, type, idx, title:`Camera del Tesoro`, desc:`Una stanza ${adj} cela un tesoro. L'oro brilla nell'oscurità.`, gold, cleared:false };
  }
  if (type === 'rest') {
    return { id:`r${idx}`, type, idx, title:`Accampamento ${cap(adj)}`, desc:`Un angolo relativamente sicuro. Qui potete riposare brevemente.`, healPct:25, cleared:false };
  }
  if (type === 'choice') {
    return { id:`r${idx}`, type, idx, title:`Bivio ${cap(adj)}`, desc:`Due passaggi si aprono davanti a voi. Quale scegliere?`, options:[
      { label:'🛡️ Via Sicura',    desc:'Un percorso più lungo ma sicuro.',      effect:'gold',     effectValue: Math.floor(gold * 0.6) },
      { label:'⚔️ Via Rischiosa', desc:'Un percorso pericoloso ma più ricco.', effect:'gold_big', effectValue: Math.floor(gold * 1.8) },
    ], cleared:false };
  }
  if (type === 'riddle') {
    return { id:`r${idx}`, type, idx, title:`Enigma ${cap(adj)}`, desc:`Un'iscrizione ${adj} pone una domanda al gruppo. Rispondere correttamente porta ricompense.`, question:'Scrivi la tua domanda qui...', answer:'risposta', xpReward: 50 + partyLevel * 15, failDmg:0, cleared:false };
  }
  if (type === 'event') {
    return { id:`r${idx}`, type, idx, title:`Evento ${cap(adj)}`, desc:`Qualcosa di insolito accade in questo luogo ${adj}.`, effect:'xp', effectValue: 30 + partyLevel * 10, cleared:false };
  }
  if (type === 'shrine') {
    return { id:`r${idx}`, type, idx, title:`Altare ${cap(adj)}`, desc:`Un altare antico emana energia mistica. Sacrificando vitalità si ottiene forza.`, hpCost: Math.floor(partyLevel * 3 + 5), buffStat:'atk', buffAmount: Math.floor(partyLevel / 2) + 2, cleared:false };
  }
  if (type === 'merchant') {
    return { id:`r${idx}`, type, idx, title:`Mercante ${cap(adj)}`, desc:`Un misterioso mercante si è insediato in questo luogo. I suoi prezzi sono scontati.`, items:[], cleared:false };
  }
  return { id:`r${idx}`, type:'combat', idx, title:'Stanza', desc:'', monsters:[], cleared:false };
}
function generateDungeon({ roomCount=5, themeId='crypt', partyLevel=1, difficulty='normal', seed=Date.now() }) {
  const theme = DUNGEON_THEMES.find(t => t.id === themeId) || DUNGEON_THEMES[0];
  const rng = _makeRng(typeof seed === 'number' ? seed : _dateToSeed(String(seed)));
  const diffMult = { easy:0.7, normal:1, hard:1.6, deadly:2.4 }[difficulty] || 1;
  const adjPartyLevel = Math.max(1, Math.round(partyLevel * diffMult));
  const typePool = [];
  const W = difficulty === 'deadly'
    ? { combat:50, trap:25, treasure:10, rest:5, choice:10 }
    : difficulty === 'hard'
    ? { combat:40, trap:22, treasure:12, rest:8, choice:10, riddle:4, shrine:4 }
    : { combat:30, trap:15, treasure:15, rest:12, choice:12, riddle:8, event:5, shrine:3 };
  for (const [t,w] of Object.entries(W)) for (let i=0;i<w;i++) typePool.push(t);
  const rooms = [];
  for (let i = 0; i < roomCount - 1; i++) rooms.push(_buildDungeonRoom(_dpick(typePool, rng), i, theme, rng, adjPartyLevel));
  const monTier = Math.max(1, Math.ceil(adjPartyLevel/3));
  const bossPool = DEFAULT_MONSTERS.filter(m => m.tier >= monTier);
  const bossBase = bossPool.length ? bossPool : DEFAULT_MONSTERS;
  const boss = _dpick(bossBase, rng);
  const bossHpMult = difficulty === 'deadly' ? 3.5 : difficulty === 'hard' ? 2.5 : 1.5;
  const bossHp = Math.floor((boss.hp||20) * bossHpMult);
  rooms.push({ id:`r${roomCount-1}`, type:'boss', idx:roomCount-1, title:`Sala di ${boss.name||'Boss'}`, desc:`Il culmine del dungeon. ${boss.name||'Il boss'} vi attende.`, monsters:[{...boss, hp:bossHp, maxHp:bossHp}], gold:Math.floor((100+adjPartyLevel*30)*(0.9+rng()*0.2)), cleared:false });
  return { active:true, name:theme.name, themeId:theme.id, emoji:theme.emoji, difficulty, rooms, currentRoom:0, pendingCombatRoom:null, startedAt:new Date().toISOString(), completedAt:null, seed };
}

/* ═══════════════════════════════════════════════
   EVENTI GIORNALIERI
═══════════════════════════════════════════════ */
const DAILY_EVENTS = [
  { id:'blessing',    emoji:'✨', title:'Benedizione degli Dei',   desc:'Una luce celeste discende sul gruppo.',         effect:'heal_pct', value:25,  action:'Ricevi la benedizione' },
  { id:'lucky_coins', emoji:'🍀', title:'Monete Fortunate',        desc:'Trovate monete d\'oro lungo il sentiero.',      effect:'gold',     value:75,  action:'Raccogliere' },
  { id:'riddle',      emoji:'🧩', title:'Indovinello del Saggio',  desc:'Un saggio sfida il gruppo con un enigma.',      effect:'xp',       value:150, action:'Rispondere' },
  { id:'rest_night',  emoji:'🌙', title:'Notte Tranquilla',        desc:'Tutti riposano senza interruzioni.',            effect:'heal_pct', value:50,  action:'Riposare' },
  { id:'ancient_ruins',emoji:'🏚️',title:'Rovine Antiche',          desc:'Esplorate dei resti e trovate conoscenza.',     effect:'xp',       value:100, action:'Esplorare' },
  { id:'festival',    emoji:'🎉', title:'Giorno di Festa',         desc:'Un villaggio festeggia — cibo e musica.',       effect:'gold',     value:50,  action:'Unirsi alla festa' },
  { id:'lost_scroll', emoji:'📜', title:'Pergamena Perduta',       desc:'Una pergamena contiene sapere antico.',         effect:'xp',       value:200, action:'Leggere' },
  { id:'wanderer',    emoji:'🧝', title:'Elfo Errante',            desc:'Un elfo offre erbe curative al gruppo.',        effect:'heal_pct', value:20,  action:'Accettare' },
  { id:'chest',       emoji:'📦', title:'Cassa Naufragata',        desc:'Una cassa trascinata dal fiume emerge.',         effect:'gold',     value:120, action:'Aprire' },
  { id:'omen',        emoji:'☄️', title:'Presagio Celeste',        desc:'Una cometa passa — buon segno per l\'avventura.', effect:'xp',    value:75,  action:'Interpretare' },
  { id:'cursed_wind', emoji:'💀', title:'Vento Maledetto',         desc:'Un vento oscuro porta sfortuna al gruppo.',     effect:'heal_pct', value:-15, action:'Resistere alla maledizione' },
  { id:'thunder',     emoji:'⛈️', title:'Tempesta Magica',         desc:'Energia arcana investe il gruppo.',             effect:'heal_pct', value:-10, action:'Resistere' },
  { id:'merchant',    emoji:'🧙', title:'Mercante Ambulante',      desc:'Un mercante misterioso offre merce speciale.',  effect:'notice',   value:0,   action:'Visita il Negozio' },
  { id:'dragon',      emoji:'🐉', title:'Avvistamento di Drago',   desc:'Un drago sorvola — intimidatorio ma si allontana.', effect:'xp', value:50, action:'Osservare' },
  { id:'fog',         emoji:'🌫️', title:'Nebbia Mistica',          desc:'La nebbia arcana confonde i sensi oggi.',       effect:'notice',   value:0,   action:'Procedere con cautela' },
];
function generateDailyEvent(partyCode, date = new Date().toLocaleDateString('en-CA')) {
  const rng = _makeRng(_dateToSeed(date + '_daily_' + (partyCode || 'x')));
  return DAILY_EVENTS[Math.floor(rng() * DAILY_EVENTS.length)];
}

const ABILITY_LABELS = {
  str:{ short:"FOR", name:"Forza" },
  dex:{ short:"DES", name:"Destrezza" },
  con:{ short:"COS", name:"Costituzione" },
  int:{ short:"INT", name:"Intelligenza" },
  wis:{ short:"SAG", name:"Saggezza" },
  cha:{ short:"CAR", name:"Carisma" },
};
const CLASS_ABILITY_BASES = {
  barbarian:{ str:16, dex:14, con:16, int:8,  wis:12, cha:10 },
  warrior:  { str:16, dex:12, con:14, int:10, wis:10, cha:10 },
  monk:     { str:12, dex:16, con:13, int:10, wis:14, cha:10 },
  paladin:  { str:16, dex:10, con:14, int:10, wis:12, cha:14 },
  ranger:   { str:12, dex:16, con:13, int:10, wis:14, cha:10 },
  rogue:    { str:10, dex:16, con:13, int:12, wis:12, cha:12 },
  cleric:   { str:12, dex:10, con:14, int:10, wis:16, cha:12 },
  druid:    { str:10, dex:12, con:14, int:12, wis:16, cha:10 },
  bard:     { str:10, dex:14, con:12, int:12, wis:10, cha:16 },
  mage:     { str:8,  dex:14, con:12, int:16, wis:12, cha:10 },
  sorcerer: { str:8,  dex:14, con:12, int:10, wis:12, cha:16 },
  warlock:  { str:10, dex:12, con:14, int:12, wis:10, cha:16 },
};
const RACE_ABILITY_BONUSES = {
  human:     { str:1, dex:1, con:1, int:1, wis:1, cha:1 },
  dwarf:     { str:1, dex:0, con:2, int:0, wis:1, cha:0 },
  elf:       { str:0, dex:2, con:0, int:1, wis:1, cha:0 },
  halfling:  { str:0, dex:2, con:0, int:0, wis:0, cha:1 },
  dragonborn:{ str:2, dex:0, con:0, int:0, wis:0, cha:1 },
  gnome:     { str:0, dex:1, con:0, int:2, wis:0, cha:0 },
  halfelf:   { str:0, dex:1, con:1, int:0, wis:0, cha:2 },
  halforc:   { str:2, dex:0, con:1, int:0, wis:0, cha:0 },
  tiefling:  { str:0, dex:0, con:0, int:1, wis:0, cha:2 },
};
const CLASS_LEVEL_GAINS = {
  barbarian:{ hp:16, atk:3, def:1, mag:0, label:"+16 HP, +3 ATK, +1 DEF" },
  warrior:  { hp:14, atk:3, def:2, mag:0, label:"+14 HP, +3 ATK, +2 DEF" },
  monk:     { hp:10, atk:2, def:2, mag:0, label:"+10 HP, +2 ATK, +2 DEF" },
  paladin:  { hp:12, atk:2, def:2, mag:1, label:"+12 HP, +2 ATK, +2 DEF, +1 MAG" },
  ranger:   { hp:10, atk:2, def:1, mag:1, label:"+10 HP, +2 ATK, +1 DEF, +1 MAG" },
  rogue:    { hp:9,  atk:3, def:1, mag:0, label:"+9 HP, +3 ATK, +1 DEF" },
  cleric:   { hp:10, atk:1, def:2, mag:2, label:"+10 HP, +1 ATK, +2 DEF, +2 MAG" },
  druid:    { hp:9,  atk:1, def:1, mag:2, label:"+9 HP, +1 ATK, +1 DEF, +2 MAG" },
  bard:     { hp:8,  atk:1, def:1, mag:2, label:"+8 HP, +1 ATK, +1 DEF, +2 MAG" },
  mage:     { hp:6,  atk:0, def:1, mag:3, label:"+6 HP, +1 DEF, +3 MAG" },
  sorcerer: { hp:6,  atk:0, def:0, mag:4, label:"+6 HP, +4 MAG" },
  warlock:  { hp:7,  atk:1, def:1, mag:3, label:"+7 HP, +1 ATK, +1 DEF, +3 MAG" },
};
function levelGainForClass(cls) {
  return CLASS_LEVEL_GAINS[cls || "warrior"] || CLASS_LEVEL_GAINS.warrior;
}
function totalLevelGains(cls, level) {
  const gain = levelGainForClass(cls);
  const steps = Math.max(0, (Number(level) || 1) - 1);
  return {
    hp: gain.hp * steps,
    atk: gain.atk * steps,
    def: gain.def * steps,
    mag: gain.mag * steps,
  };
}
function applyLevelUpToPlayer(player) {
  const level = Math.max(1, Number(player?.level) || 1);
  const needed = xpForLevel(level);
  if((player?.xp || 0) < needed) return { player, leveled:false, needed };
  const gain = levelGainForClass(player?.class);
  const nextMaxHp = (player?.maxHp ?? player?.max_hp ?? 0) + gain.hp;
  const next = {
    ...player,
    xp: (player?.xp || 0) - needed,
    level: level + 1,
    maxHp: nextMaxHp,
    hp: nextMaxHp,
    atk: (player?.atk || 0) + gain.atk,
    def: (player?.def || 0) + gain.def,
    mag: (player?.mag || 0) + gain.mag,
  };
  return { player:next, leveled:true, needed, gain };
}
function clampAbility(score) {
  return Math.max(1, Math.min(30, Number(score) || 10));
}
function abilityModifier(score) {
  return Math.floor((clampAbility(score) - 10) / 2);
}
function signedModifier(value) {
  const n = Number(value) || 0;
  return `${n >= 0 ? "+" : ""}${n}`;
}
function getProficiencyBonus(level=1) {
  return Math.min(6, 2 + Math.floor((Math.max(1, Number(level) || 1) - 1) / 4));
}
function spellcastingAbilityForClass(cls) {
  if(["mage"].includes(cls)) return "int";
  if(["cleric","druid","ranger"].includes(cls)) return "wis";
  if(["bard","sorcerer","warlock","paladin"].includes(cls)) return "cha";
  return "int";
}
function getAbilityScores(actor={}) {
  if(actor.abilities) return actor.abilities;
  if(actor.class || actor.race) {
    const base = CLASS_ABILITY_BASES[actor.class] || CLASS_ABILITY_BASES.warrior;
    const race = RACE_ABILITY_BONUSES[actor.race] || {};
    return Object.fromEntries(Object.keys(ABILITY_LABELS).map(key => [key, clampAbility((base[key] || 10) + (race[key] || 0))]));
  }
  return {
    str: clampAbility(10 + Math.floor((actor.atk || 0) / 2)),
    dex: clampAbility(10 + Math.floor((actor.init || 0) * 1.5)),
    con: clampAbility(10 + Math.floor((actor.maxHp || actor.max_hp || actor.hp || 10) / 25)),
    int: 10,
    wis: 10,
    cha: 10,
  };
}
function getAbilityMod(actor, ability) {
  return abilityModifier(getAbilityScores(actor)[ability]);
}
function monsterXpValue(monster) {
  const hpSource = monster?.maxHp ?? monster?.max_hp ?? (Number(monster?.hp) > 0 ? monster?.hp : undefined);
  if(hpSource == null && Number(monster?.xp) > 0) return Number(monster.xp);
  const hp = Number(hpSource) || 0;
  const atk = Number(monster?.atk) || 0;
  const def = Number(monster?.def) || 0;
  const bossMultiplier = monster?.isBoss ? 1.75 : 1;
  const raw = (hp * 0.45) + (atk * 4.2) + (def * 3.2);
  return Math.max(5, Math.round((raw * bossMultiplier) / 5) * 5);
}
function monsterGoldValue(monster) {
  return Math.max(1, Math.floor(monsterXpValue(monster) * 0.35));
}
function monsterThreatTier(monster) {
  if(monster?.isBoss) return "boss";
  const xp = monsterXpValue(monster);
  if(xp >= 120) return "hard";
  if(xp >= 55) return "mid";
  return "base";
}

function getPortraitPath(cls, race, gender) {
  return `/assets/portraits/${cls}_${race}_${gender}.png`;
}
function getRacePortraitPath(race, gender) {
  return `/assets/portraits/${race}_${gender}.png`;
}
function getClassPortraitPath(cls, gender) {
  return `/assets/portraits/${cls}_${gender}.png`;
}
function characterGenderKey(playerId) {
  return `eoz_character_gender_${playerId}`;
}
function getStoredCharacterGender(playerId, fallback = "male") {
  if(!playerId) return fallback;
  return localStorage.getItem(characterGenderKey(playerId)) || fallback;
}
function saveStoredCharacterGender(playerId, gender) {
  if(playerId) localStorage.setItem(characterGenderKey(playerId), gender || "male");
}
function getGeneratedPortrait(clsKey, raceKey, gender) {
  const cls = CLASSES[clsKey] || CLASSES.warrior;
  const race = RACES[raceKey] || RACES.human;
  const accent = cls.color || "#fbbf24";
  const genderLabel = gender === "female" ? "Femmina" : "Maschio";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.34"/>
          <stop offset="46%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="512" height="512" fill="url(#bg)"/>
      <circle cx="256" cy="214" r="116" fill="#0f172a" stroke="${accent}" stroke-width="10" filter="url(#glow)"/>
      <text x="256" y="245" text-anchor="middle" font-size="96" font-family="Arial, sans-serif">${race.emoji || ""}</text>
      <text x="256" y="342" text-anchor="middle" fill="#f8fafc" font-size="35" font-family="Georgia, serif" font-weight="700">${race.name}</text>
      <text x="256" y="388" text-anchor="middle" fill="${accent}" font-size="32" font-family="Georgia, serif" font-weight="700">${cls.name}</text>
      <text x="256" y="426" text-anchor="middle" fill="#cbd5e1" font-size="22" font-family="Arial, sans-serif">${genderLabel}</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function parseDice(dice) {
  if(!dice) return 0;
  const m = String(dice).match(/^(-?\d+)d(\d+)([+-]\d+)?$/);
  if(!m) return Number(dice) || 0;
  const count = Number(m[1]);
  const sides = Number(m[2]);
  const mod = m[3] ? Number(m[3]) : 0;
  let total = 0;
  for(let i=0;i<count;i++) total += d(sides);
  return total + mod;
}

function rollDice(dice) {
  return parseDice(dice);
}
function getPrimaryDieSides(dice, fallback = 20) {
  const match = String(dice || "").match(/d(\d+)/i);
  return match ? Number(match[1]) : fallback;
}

function getSpellSlots(level) {
  const base = SPELL_SLOTS[level] || SPELL_SLOTS[1];
  return { ...base };
}

function availableSpellsFor(className, level) {
  const packs = SPELLS[className] || {};
  const slotsForLevel = SPELL_SLOTS[level] || SPELL_SLOTS[1];
  const maxSlot = Math.max(...Object.entries(slotsForLevel).filter(([,v])=>v>0).map(([k])=>Number(k)), 1);
  return Object.entries(packs)
    .filter(([slot]) => Number(slot) <= maxSlot)
    .flatMap(([slot, spells]) => spells.map(s => ({ ...s, slot: Number(slot) })));
}

function totalSlots(slots) {
  if(!slots) return 0;
  return Object.values(slots).reduce((sum,v)=>sum + (Number(v)||0), 0);
}

function formatSpellSlots(slots) {
  if(!slots) return "0";
  return Object.entries(slots).map(([lvl,count])=>`${lvl}:${count}`).join(" ");
}
function maxPreparedSpellsForLevel(level) {
  if(level <= 1) return 2;
  if(level === 2) return 3;
  if(level === 3) return 4;
  if(level === 4) return 5;
  return Math.min(10, level + 1);
}

/* ----------------------------------------------
   DAILY QUEST ROTATION
---------------------------------------------- */
function _dateToSeed(dateStr) {
  let h = 2166136261;
  for (const c of dateStr) { h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; }
  return h;
}
function _makeRng(seed) {
  let s = (seed || 1) >>> 0;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0x100000000; };
}
function getDailyQuests(allQuests, counts = { facile: 3, medio: 3, difficile: 2 }, extraSeed = 0) {
  const today = new Date().toLocaleDateString('en-CA');
  const rng = _makeRng(_dateToSeed(today + "_" + extraSeed));
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const byDiff = { facile: [], medio: [], difficile: [], epica: [] };
  for (const q of allQuests) {
    if (!q.active) continue;
    const d = normalizeMissionDifficulty(q.difficulty);
    if (byDiff[d]) byDiff[d].push(q);
  }
  return [
    ...shuffle(byDiff.facile).slice(0, counts.facile),
    ...shuffle(byDiff.medio).slice(0, counts.medio),
    ...shuffle([...byDiff.difficile, ...byDiff.epica]).slice(0, counts.difficile),
  ];
}
function hoursUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
  const ms = midnight - now;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function appendDiary(diary, entry) {
  const e = { ts: Date.now(), date: new Date().toLocaleDateString('it-IT', { day:'2-digit', month:'long', year:'numeric' }), ...entry };
  return [...(diary || []), e].slice(-60);
}

/* ----------------------------------------------
   LOCAL STORAGE HELPERS (per quests/monsters/meta)
---------------------------------------------- */
function lsGet(key, def) { try { const r=localStorage.getItem(key); return r?JSON.parse(r):def; } catch { return def; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } }
function slugifyAssetName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function monsterAssetPath(monster) {
  if(!monster) return "";
  return `/assets/monsters/${monster.id}-${slugifyAssetName(monster.name)}.png`;
}

const QUEST_MONSTER_IMAGE_ALIASES = {
  "zombi": "m39",
  "zombi-del-campo": "m39",
  "spettro": "m11",
  "guardiano-spettrale": "m87",
  "marinaio-spettrale": "m87",
  "scheletro-guerriero": "m18",
  "cavaliere-della-morte": "m87",
  "faraone-non-morto": "m148",
  "lich-eterno": "m169",
  "lich-morvane": "m169",
  "lich-paludoso": "m169",
  "re-non-morto-aldras": "m148",
  "vampiro-antico": "m168",
  "lord-vampiro-valthar": "m168",
  "signore-del-sangue": "m171",

  "statua-animata": "m68",
  "sentinella-eterna": "m147",
  "costrutto-arcano": "m28",
  "costrutto-carnoso": "m96",
  "golem-antico": "m147",
  "costrutto-del-giudizio": "m170",
  "cristallo-antico-violaceo": "m28",
  "cuore-del-labirinto": "m174",

  "sfinge-minore": "m126",
  "kraken-giovane": "m165",
  "kraken-antico": "m165",
  "squalo-spada": "m98",
  "sirena-maligna": "m98",
  "mostro-del-lago-nero": "m144",
  "scorpione-gigante": "m92",
  "verme-delle-sabbie": "m164",
  "grande-serpente-antico": "m176",
  "naga-velenos": "m176",
  "anaconda-reale-sseth": "m176",
  "chimera-del-deserto-cremisi": "m137",
  "idra-adulta": "m180",
  "hydra-delle-profondita": "m180",
  "unicorno-oscuro": "m105",
  "satiro": "m175",
  "centauro-ribelle": "m104",
  "pixie-maligna": "m54",
  "folletto-dispettoso": "m54",
  "driade-corrotta": "m113",
  "lord-dei-boschi": "m113",
  "antico-treant": "m113",
  "falco-nero": "m58",
  "aquila-gigante": "m166",
  "sciacallo": "m57",
  "lupo-di-ghiaccio": "m33",
  "lupo-da-guerra": "m59",
  "lupo-della-piana": "m57",
  "re-dei-lupi": "m33",
  "orso-bruno": "m138",
  "yeti": "m114",
  "yeti-alpha": "m114",

  "brigante": "m5",
  "ladro": "m5",
  "ladro-del-campanile": "m5",
  "sicario": "m12",
  "pirata": "m5",
  "pirata-veterano": "m12",
  "mozzo-posseduto": "m87",
  "marinaio-brutto": "m5",
  "bombardiere": "m12",
  "capobanda-brenn": "m12",
  "capitano-mortenero": "m26",
  "ammiraglio-spettrale-ironbay": "m87",
  "quartiermastro-demone": "m160",
  "predone-del-deserto": "m5",
  "goblin-esploratore": "m1",
  "orco-sciamano": "m16",
  "ogre": "m20",
  "re-orco-gruul": "m13",
  "re-dei-giganti": "m158",

  "cultista": "m8",
  "cultista-folle": "m23",
  "cultista-fanatico": "m23",
  "cultista-della-fiamma": "m27",
  "gran-sacerdote-pyrax": "m23",
  "sacerdote-corrotto": "m23",
  "mago-rinnegato": "m16",
  "apprendista-folle": "m16",
  "alchimista-pazzo": "m16",
  "alchimista-vrex-il-pazzo": "m16",
  "arcimago-rinnegato-thax": "m16",
  "mago-folle-kaelix": "m16",
  "necromante-supremo-nekrath": "m169",

  "aberrrazione": "m144",
  "aberrazione": "m144",
  "aberrazione-abissale": "m144",
  "aberrazione-suprema": "m173",
  "servo-mutato": "m76",
  "intelletto-divoratore": "m143",
  "maestro-dello-sguardo-nyssar": "m173",

  "diavolo-spinato": "m118",
  "imp": "m102",
  "arcidemone": "m160",
  "balrog": "m160",
  "grande-demonio-azkarath": "m160",
  "signore-dell-inferno": "m161",
  "diavolo-del-pozzo-skarrex": "m161",
  "demone-del-portale": "m32",
  "demone-del-chaos": "m37",

  "drago-del-ghiaccio-eterno-glacyon": "m153",
  "drago-di-bronzo-keldrath": "m154",
  "draghetto-di-bronzo": "m154",
  "avatar-della-fiamma-antica": "m27",
  "avatar-del-dio-del-fango": "m141",
  "avatar-del-vuoto": "m145",

  "omuncolo": "m102",
  "esperimento-fallito": "m106",
  "esperimento-vivente": "m96",
  "rospo-velenoso": "m52",
  "rana-velenosa": "m52",
  "pesce-morditore": "m98",
  "lucertolone": "m49",
  "hag-della-palude": "m19",
  "spirito-del-grano": "m113",
  "rapace-della-cresta": "m58",
  "rapace-di-ghiaccio": "m166",
  "ragno-selvatico": "m51",
  "scimmia-selvatica": "m114",
  "serpe-delle-rovine": "m22",
  "talpa-guerriera": "m92",
  "diavoletto-della-dispensa": "m102",
  "imp-del-pozzo": "m102",
  "topo-guardia-del-re": "m4",
  "muffa-vivente": "m55",
  "fungo-camminante": "m55",
  "larva-oscura": "m106",
  "pipistrello-spia": "m50",
  "draugr-fabbro": "m18",
  "gangster-cappello-grigio": "m5",
  "nano-corrotto": "m47",
  "arciere-oscuro": "m15",
  "guerriero-non-morto": "m18",
  "campione-non-morto": "m18",
  "contadino-maledetto": "m39",
  "elementale-del-vento": "m142",
  "elementale-della-tempesta": "m158",
  "signore-del-fango": "m141",
  "guerriero-mantide": "m92",
  "guerriero-del-ghiaccio": "m153",
  "nomade-guerriero": "m12",
  "monaco-della-lama": "m12",
  "gladiatore": "m12",
  "raksha-cacciatore": "m175",
  "giullare-maledetto": "m83",
  "cavaliere-traditore": "m30",
  "guerriero-di-cenere": "m27",
  "morto-potenziato": "m39",
  "non-morto-potenziato": "m39",
  "orrore-abissale": "m144",
  "salmandra-abissale": "m139",
  "salamandra-abissale": "m139",
  "mannaro": "m86",
  "regina-maligna": "m101",
  "genio-maledetto": "m142",
  "re-dimenticato": "m148",
  "guardia-corrotta": "m24",
  "servitore-del-vuoto": "m145",
  "troll-di-montagna": "m172",
  "arconte-dei-venti-zephyrix": "m142",
  "avatar-di-zogath": "m37",
  "basilisco-di-greystone": "m66",
  "boss-rexan-il-grigio": "m12",
  "campione-korvas": "m12",
  "cecchino-maestro-voss": "m15",
  "comandante-traditore-aldran": "m30",
  "domatore-corrotto-harlequin": "m12",
  "generale-non-morto-valdric": "m87",
  "generale-non-morto-valdrix": "m87",
  "gran-maestro-corrotto-shin": "m12",
  "lord-della-caccia-keroon": "m33",
  "maestro-dei-veleni-sorrax": "m97",
  "minotauro-di-mirthedge": "m72",
  "re-dei-ladri": "m5",
  "re-delle-ceneri-malachar": "m27",
  "re-oberon": "m175",
  "signore-dei-mannari-volkaan": "m86",
  "signore-del-gelo-frimor": "m153",
  "signore-della-morte-mordrex": "m169",
  "signore-raksha-tigraath": "m175",
  "spirito-dell-antichita": "m74",
  "sposa-del-chaos": "m101",
  "strega-del-silenzio-morra": "m19",
  "strega-della-foresta": "m19",
  "titano-della-tempesta-zepheron": "m158",
  "troll-delle-caverne": "m25",
  "warlord-grommash": "m13",
  "ape-regina-velena": "m43",
  "arbusto-carnivoro": "m62",
  "capobanda-fulmine": "m5",
  "capobranco-scarface": "m59",
  "diavoletto-capo-brux": "m102",
  "femmina-alfa": "m57",
  "gatto-selvatico-di-amberveil": "m78",
  "granchio-antico": "m117",
  "lumaca-madre": "m7",
  "mobili-animati": "m69",
  "poltergeist-della-biblioteca": "m74",
  "sciame-di-api-furiose": "m43",
  "scorticatore": "m143",
  "serpe-velenosissima": "m22",
  "spirito-dell-acqua": "m140",
  "spirito-volpe": "m54",
  "spora-mostruosa": "m55",
  "tomi-volanti": "m53",
  "truffatore-vrannix": "m5",
  "viticci-striscianti": "m62",
  "volpe-incantata": "m54",
};

const QUEST_MONSTER_IMAGE_RULES = [
  [/kraken/, "m165"],
  [/beholder|sguardo/, "m173"],
  [/lich|necromante/, "m169"],
  [/vampir|sangue/, "m168"],
  [/mummia|faraone/, "m148"],
  [/spettral|spettro|fantasma|ombra/, "m87"],
  [/scheletro|ossa|ossea|osseo/, "m18"],
  [/zombi|zombie|ghoul|ghast/, "m39"],
  [/golem.*ferro|ferro/, "m170"],
  [/golem|costrutt|statua|sentinella|guardiano/, "m147"],
  [/drago.*ghiaccio|ghiaccio.*drago/, "m153"],
  [/drago.*rosso|drago.*fuoco|drago.*fiamma/, "m149"],
  [/drago.*blu|drago.*tempesta|drago.*elettric/, "m150"],
  [/drago.*verde|drago.*velen/, "m151"],
  [/drago.*oro|bronzo|argento|metallic/, "m155"],
  [/drago|dragon/, "m38"],
  [/idra|hydra/, "m180"],
  [/serpente|naga|anaconda/, "m176"],
  [/sfinge/, "m126"],
  [/chimera/, "m137"],
  [/unicorno|pegaso/, "m105"],
  [/ragno/, "m51"],
  [/rospo|rana/, "m52"],
  [/fungo|muffa|myconide/, "m55"],
  [/pipistrello/, "m50"],
  [/scorpione|ankheg|insett|cavalletta|mantide|talpa/, "m92"],
  [/squalo|sirena|marina|mare|lago|pesce/, "m98"],
  [/pixie|folletto|fata|fatato|driade|treant|boschi|grano/, "m113"],
  [/lupo|sciacallo|yeti|orso|bestia|cinghiale|cane|ratto|topo|scimmia|cucciolo/, "m57"],
  [/aquila|falco|roc|uccello|rapace/, "m166"],
  [/demone|diavolo|inferno|balrog|apocalisse/, "m160"],
  [/cultista|sacerdote|alchimista|mago|arcimago|apprendista|omuncolo/, "m16"],
  [/pirata|marinaio|corsaro|mozzo|capitano|capobanda|ammiraglio|brigante|ladro|sicario|predone|bandito|contrabbandiere|assassino|gangster|gladiatore|nomade|monaco|vedetta|arciere|cavaliere|guerriero/, "m5"],
  [/orco|ogre/, "m13"],
  [/goblin|coboldo|nano/, "m1"],
  [/gigante/, "m158"],
  [/aberr|mutato|intelletto|esperimento|orrore|mangiatore/, "m144"],
];

function findMonsterImageById(id) {
  const match = DEFAULT_MONSTERS.find(m => m.id === id);
  return match ? monsterAssetPath(match) : "";
}

function getQuestMonsterImageByAlias(monster) {
  const slug = slugifyAssetName(monster?.name || "");
  const exactId = QUEST_MONSTER_IMAGE_ALIASES[slug];
  if(exactId) return findMonsterImageById(exactId);
  for(const [pattern, id] of QUEST_MONSTER_IMAGE_RULES) {
    if(pattern.test(slug)) return findMonsterImageById(id);
  }
  return "";
}

function getQuests() {
  const defaults = DEFAULT_QUESTS.map(normalizeQuest);
  const stored = lsGet("eoz_quests", null);
  if(!Array.isArray(stored) || !stored.length) return defaults;

  const normalizedStored = stored.map(normalizeQuest);
  // Always merge: stored quests keep their customisations, new defaults are appended
  const storedIds = new Set(normalizedStored.map(q => q.id));
  const newDefaults = defaults.filter(q => !storedIds.has(q.id));
  if(newDefaults.length) {
    const merged = [...normalizedStored, ...newDefaults];
    saveQuests(merged);
    return merged;
  }
  return normalizedStored;
}
function getMonsters() {
  const stored = lsGet("eoz_monsters", null);
  if(!Array.isArray(stored) || !stored.length) return DEFAULT_MONSTERS;
  const storedIds = new Set(stored.map(m => m.id));
  const newDefaults = DEFAULT_MONSTERS.filter(m => !storedIds.has(m.id));
  if(newDefaults.length) {
    const merged = [...stored, ...newDefaults];
    lsSet("eoz_monsters", merged);
    return merged;
  }
  return stored;
}
function getMeta()     { return lsGet("eoz_meta",      { worldName:"Echoes of Zodar", worldSub:"Dove l'Equilibrio Regna Supremo", logo:null }); }
function saveQuests(q)   { lsSet("eoz_quests", q); }
function saveMonsters(m) { lsSet("eoz_monsters", m); }
function saveMeta(m)     { lsSet("eoz_meta", m); }

/* ----------------------------------------------
   DEFAULT DATA
---------------------------------------------- */

const DEFAULT_ITEM_MAP = new Map(DEFAULT_ITEMS.map(item => [item.id, item]));

function normalizeLegendaryInventoryItem(item) {
  return {
    ...item,
    description: item.description || item.desc || "",
    slot: item.slot || (item.type === "armor" ? "armor" : item.type === "magic" ? "weapon" : item.type || null),
    type: item.type === "magic" ? "weapon" : item.type,
    rarity: item.rarity || "legendary",
    price: item.price || 999,
    available: item.available ?? false,
    weapon_die: item.weapon_die || null,
    heal_amount: item.heal_amount || 0,
    bonus_hp: item.bonus_hp || 0,
    bonus_init: item.bonus_init || 0,
  };
}

function mergeCatalogItems(items=[]) {
  const baseItems = [
    ...DEFAULT_ITEMS,
    ...LEGENDARY_ITEMS.map(normalizeLegendaryInventoryItem),
    ...CRAFT_MATERIALS,
  ];
  const merged = new Map(baseItems.map(item => [item.id, item]));
  for(const item of items) {
    const base = merged.get(item.id) || {};
    merged.set(item.id, { ...base, ...item, slot:item.slot || base.slot || null, weapon_die:item.weapon_die || base.weapon_die || null, heal_amount:item.heal_amount || base.heal_amount || 0, bonus_init:item.bonus_init ?? base.bonus_init ?? 0 });
  }
  // Auto-generate forge variants for weapons whose base die is in the progression
  const weaponItems = [...merged.values()].filter(it => it.weapon_die && it.type === 'weapon' && !it.id.includes('__f'));
  for(const weapon of weaponItems) {
    const baseDieIdx = FORGE_DIE_PROGRESSION.indexOf(weapon.weapon_die);
    if(baseDieIdx < 0 || baseDieIdx >= 14) continue;
    for(let targetDieIdx = baseDieIdx + 1; targetDieIdx <= 11; targetDieIdx++) {
      const forgeLevel = targetDieIdx - baseDieIdx;
      const forgeId = `${weapon.id}__f${forgeLevel}`;
      const newDie = FORGE_DIE_PROGRESSION[targetDieIdx];
      const forgeRarity = targetDieIdx >= 10 ? 'legendary' : targetDieIdx >= 8 ? 'epic' : targetDieIdx >= 6 ? 'rare' : targetDieIdx >= 4 ? 'uncommon' : weapon.rarity;
      merged.set(forgeId, { ...weapon, id:forgeId, name:`${weapon.name} +${forgeLevel}`, weapon_die:newDie, damageDice:newDie, bonus_atk:(weapon.bonus_atk||0)+forgeLevel, forgeLevel, rarity:forgeRarity, price:Math.round((weapon.price||50)*Math.pow(1.8,forgeLevel)), available:false });
    }
  }
  return Array.from(merged.values()).sort((a,b)=>a.name.localeCompare(b.name, "it"));
}
function itemSlot(item) {
  const raw = item?.slot;
  if(raw && raw !== "armor" && raw !== "shield" && raw !== "accessory") return raw;
  if(item?.type === "weapon" || item?.weapon_die) return "weapon";
  if(item?.type === "armor" || raw === "armor") return "chest";
  if(item?.type === "shield" || raw === "shield") return "offhand";
  if(item?.type === "accessory" || raw === "accessory") return "amulet";
  if(item?.type === "magic") return "weapon";
  return null;
}
function isEquippableItem(item) {
  return !!itemSlot(item);
}
function equipmentKey(playerId) {
  return `eoz_equipment_${playerId}`;
}
function preparedSpellsKey(playerId) {
  return `eoz_prepared_spells_${playerId}`;
}
const EQUIP_SLOTS = ["weapon","offhand","head","chest","legs","boots","gloves","ring1","ring2","amulet","cloak"];
function getStoredEquipment(playerId) {
  const defaults = Object.fromEntries(EQUIP_SLOTS.map(s => [s, null]));
  // legacy compat: map old keys
  const stored = lsGet(equipmentKey(playerId), {});
  if(stored.armor && !stored.chest) stored.chest = stored.armor;
  if(stored.shield && !stored.offhand) stored.offhand = stored.shield;
  if(stored.accessory && !stored.amulet) stored.amulet = stored.accessory;
  return { ...defaults, ...stored };
}
function saveStoredEquipment(playerId, equipment) {
  lsSet(equipmentKey(playerId), equipment);
}
function getStoredPreparedSpells(playerId, spells=[]) {
  return lsGet(preparedSpellsKey(playerId), spells.map(spell => spell.id));
}
function saveStoredPreparedSpells(playerId, spellIds) {
  lsSet(preparedSpellsKey(playerId), spellIds);
}
function spellEffectSummary(spell) {
  if(!spell) return [];
  const details = [];
  details.push(spell.slots === 0 ? "Gratis" : `Costo: slot ${spell.slots}`);
  if(spell.dmg && spell.dmg !== "0") details.push(spell.type === "heal" ? `Cura: ${spell.dmg}` : `Danno: ${spell.dmg}`);
  else details.push(`Tipo: ${spell.type || "speciale"}`);
  return details;
}
function getBaseStats(player) {
  const cls = CLASSES[player?.class || "warrior"] || CLASSES.warrior;
  const race = RACES[player?.race || "human"] || RACES.human;
  const level = Math.max(1, Number(player?.level) || 1);
  const gains = totalLevelGains(player?.class || "warrior", level);
  return {
    atk: cls.atk + race.atkB + gains.atk,
    def: cls.def + race.defB + gains.def,
    mag: cls.mag + race.magB + gains.mag,
    init: cls.init + race.initB,
    maxHp: cls.hp + race.hpB + gains.hp,
  };
}
function getEquipmentBonuses(equipment, itemMap) {
  const ids = EQUIP_SLOTS.map(s => equipment?.[s]).filter(Boolean);
  return ids.reduce((totals, itemId) => {
    const item = itemMap.get(itemId);
    if(!item) return totals;
    totals.atk += item.bonus_atk || 0;
    totals.def += item.bonus_def || 0;
    totals.mag += item.bonus_mag || 0;
    totals.hp += item.bonus_hp || 0;
    totals.init += item.bonus_init || 0;
    return totals;
  }, { atk:0, def:0, mag:0, hp:0, init:0 });
}
function applyEquipmentToPlayer(player, equipment, itemMap) {
  if(!player) return player;
  const base = getBaseStats(player);
  const bonus = getEquipmentBonuses(equipment, itemMap);
  const maxHp = Math.max(1, base.maxHp + bonus.hp);
  return {
    ...player,
    atk: base.atk + bonus.atk,
    def: base.def + bonus.def,
    mag: base.mag + bonus.mag,
    init: base.init + bonus.init,
    maxHp,
    hp: Math.min(maxHp, Math.max(0, Number(player.hp) || 0)),
  };
}
function normalizeQuestChoices(choices) {
  if(Array.isArray(choices)) return choices;
  if(!choices || typeof choices !== "object") return [];
  return Object.entries(choices).map(([key, value]) => ({
    label: value?.label || key,
    ...value,
    quality: value?.quality || key, // preserve good/neutral/bad
    next: value?.next ?? (value?.nextStep ? Number(value.nextStep) - 1 : undefined),
  }));
}
function normalizeQuestStep(step) {
  if(typeof step === "string") return { type:"narrative", text:step };
  if(!step || typeof step !== "object") return { type:"narrative", text:"" };
  if(step.type === "combat" || step.monsters || step.enemies) return { ...step, type:"combat", monsters:step.monsters || step.enemies || [] };
  if(step.type === "loot" || step.loot) return { ...step, type:"loot", loot:step.loot || {} };
  if(step.type === "choice" || step.choices) return { ...step, type:"choice", choices:normalizeQuestChoices(step.choices) };
  return { ...step, type:"narrative", text:step.text || "" };
}
function normalizeQuest(quest) {
  return {
    ...quest,
    specialPassword: quest.specialPassword || quest.password || "",
    steps:(quest.steps || []).map(normalizeQuestStep),
  };
}
function buildInventoryEntries(rows, items = DEFAULT_ITEMS) {
  const itemMap = new Map((items || []).map(item => [item.id, item]));
  return (rows || []).map((row, index) => {
    const itemId = row?.item_id || row?.itemId;
    const item = itemMap.get(itemId);
    if(!item) return null;
    return {
      rowId: row.id || `${itemId}_${row.created_at || index}`,
      itemId,
      playerId: row.player_id || null,
      createdAt: row.created_at || null,
      item,
    };
  }).filter(Boolean);
}
function groupInventoryEntries(entries) {
  return Array.from((entries || []).reduce((map, entry) => {
    const current = map.get(entry.itemId);
    if(current) {
      current.quantity += 1;
      current.rowIds.push(entry.rowId);
      current.entries.push(entry);
      return map;
    }
    map.set(entry.itemId, {
      itemId: entry.itemId,
      item: entry.item,
      quantity: 1,
      rowIds: [entry.rowId],
      entries: [entry],
    });
    return map;
  }, new Map()).values());
}
function countInventoryItems(entries) {
  return (entries || []).reduce((counts, entry) => {
    counts[entry.itemId] = (counts[entry.itemId] || 0) + 1;
    return counts;
  }, {});
}
function getEquippedWeapon(equipment, itemMap) {
  return (equipment?.weapon && itemMap.get(equipment.weapon)) || DEFAULT_WEAPON;
}
function weaponAttackProfile(weapon, actor={}) {
  const key = `${weapon?.id || ""} ${weapon?.name || ""}`.toLowerCase();
  const ranged = /bow|arco|crossbow|balestra|balista|sling|fionda/.test(key);
  const finesse = /dagger|pugnale|knife|coltello|rapier|frusta|whip/.test(key);
  const magical = /wand|bacchetta|staff|bastone|grimoire|grimorio|tome|tomo|orb|sfera|rod|verga/.test(key);
  const scores = getAbilityScores(actor);
  if(magical) {
    const ability = spellcastingAbilityForClass(actor.class);
    return { ability, type:"magica", mod:abilityModifier(scores[ability]) };
  }
  if(finesse) {
    const strMod = abilityModifier(scores.str);
    const dexMod = abilityModifier(scores.dex);
    const ability = dexMod >= strMod ? "dex" : "str";
    return { ability, type:"finesse", mod:Math.max(strMod, dexMod) };
  }
  if(ranged) return { ability:"dex", type:"distanza", mod:abilityModifier(scores.dex) };
  return { ability:"str", type:"mischia", mod:abilityModifier(scores.str) };
}
function getCombatDamageDie(actor) {
  if(actor?.weaponDie) return actor.weaponDie;
  if(actor?.isPlayer) return DEFAULT_WEAPON.weapon_die;
  if((actor?.atk || 0) >= 18) return "2d8";
  if((actor?.atk || 0) >= 12) return "1d10";
  if((actor?.atk || 0) >= 8) return "1d8";
  return "1d6";
}
function getCombatAttackBonus(actor, weapon=null) {
  if(actor?.isPlayer) {
    const profile = weaponAttackProfile(weapon, actor);
    return profile.mod + getProficiencyBonus(actor.level || 1) + (weapon?.bonus_atk || 0);
  }
  return Math.max(1, Math.floor((actor?.atk || 0) / 3));
}
function resolveWeaponAttack(attacker, target, weaponDie) {
  const hitRoll = roll(20);
  const isCrit = hitRoll === 20;
  const attackBonus = getCombatAttackBonus(attacker);
  const attackTotal = hitRoll + attackBonus;
  const targetCa = Math.max(8, target?.def || 10);
  const hit = hitRoll !== 1 && (isCrit || attackTotal >= targetCa);
  const damageRoll = hit ? rollDice(weaponDie || "1d6") : 0;
  const damage = hit ? damageRoll + (isCrit ? damageRoll : 0) : 0;
  return { hitRoll, isCrit, attackBonus, attackTotal, targetCa, hit, damageRoll, damage, weaponDie: weaponDie || "1d6" };
}
function formatWeaponAttackLog(attacker, target, resolved, weaponName, targetHpAfter, targetMaxHp, { resisted = false, statusApplied = null } = {}) {
  const header = `${attacker?.emoji || "⭐"} **${attacker?.name}** attacca ${target?.emoji || "⭐"} **${target?.name}**`;
  const hitLine = `🎯 Tiro per colpire: **d20 ${resolved.hitRoll} + bonus ${resolved.attackBonus} = ${resolved.attackTotal}** contro CA **${resolved.targetCa}**`;
  if(!resolved.hit) return `${header}\n${hitLine}\n❌ **Mancato**`;
  const critNote = resolved.isCrit ? " — **CRITICO!**" : "";
  const modStr = resolved.damageMod != null && resolved.damageMod !== 0 && resolved.damageAbility
    ? ` ${signedModifier(resolved.damageMod)} (${resolved.damageAbility.toUpperCase()})`
    : "";
  const dmgLine = resolved.isCrit
    ? `💥 Tiro danno: **${resolved.weaponDie} = ${resolved.damageRoll}**${modStr}, critico => **${resolved.damage}** con **${weaponName}**`
    : `💥 Tiro danno: **${resolved.weaponDie} = ${resolved.damageRoll}**${modStr} => **${resolved.damage}** con **${weaponName}**`;
  const hpLine = `❤️ ${target?.name}: ${targetHpAfter}/${targetMaxHp} HP`;
  const resistLine = resisted ? `\n🛡️ **Resistenza!** Danno ridotto a **${resolved.damage}**` : "";
  const statusLine = statusApplied ? `\n${STATUS_EFFECTS[statusApplied]?.emoji || "✨"} **${target?.name}** è ora **${STATUS_EFFECTS[statusApplied]?.label || statusApplied}**!` : "";
  return `${header}\n${hitLine}\n✅ **Colpisce**${critNote}\n${dmgLine}\n${hpLine}${resistLine}${statusLine}`;
}
function combatLogCue(log) {
  const text = String(log || "");
  if(!text) return null;
  const damageMatches = [...text.matchAll(/(?:Danno finale:|=>|danno.*?a|Danno ridotto a)\s*\**(\d+)\**/gi)].map(m => Number(m[1])).filter(Boolean);
  const hpMatch = text.match(/recupera\s+\**(\d+)\**\s*HP/i);
  const isCrit = /CRITICO|critico/i.test(text);
  const isMiss = /Mancato|manca|fallisce/i.test(text);
  const isHeal = /recupera|guarisce|cura/i.test(text);
  const isResist = /Resistenza|ridotto/i.test(text);
  const isSummon = /evocato|evoca/i.test(text);
  const isDeath = /morte|muore|Eliminato|sconfitto/i.test(text);
  if(isHeal) return { type:"heal", icon:"💚", title:"Cura", value:hpMatch ? `+${hpMatch[1]} HP` : "", color:"#22c55e", bg:"rgba(20,83,45,0.42)" };
  if(isCrit) return { type:"crit", icon:"💥", title:"Colpo Critico", value:damageMatches.length ? `${Math.max(...damageMatches)} danni` : "", color:"#fbbf24", bg:"rgba(120,53,15,0.46)" };
  if(isMiss) return { type:"miss", icon:"💨", title:"Mancato", value:"nessun danno", color:"#94a3b8", bg:"rgba(51,65,85,0.42)" };
  if(isResist) return { type:"resist", icon:"🛡️", title:"Resistenza", value:damageMatches.length ? `${damageMatches.at(-1)} danni` : "danno ridotto", color:"#60a5fa", bg:"rgba(30,64,175,0.35)" };
  if(isSummon) return { type:"summon", icon:"🔮", title:"Evocazione", value:"alleato in campo", color:"#a78bfa", bg:"rgba(76,29,149,0.38)" };
  if(isDeath) return { type:"death", icon:"🕯️", title:"Momento Critico", value:"vita appesa a un filo", color:"#f87171", bg:"rgba(127,29,29,0.42)" };
  if(damageMatches.length) return { type:"hit", icon:"⚔️", title:"Colpo a Segno", value:`${Math.max(...damageMatches)} danni`, color:"#f87171", bg:"rgba(127,29,29,0.38)" };
  return { type:"event", icon:"✨", title:"Evento", value:"", color:"#cbd5e1", bg:"rgba(30,41,59,0.42)" };
}
function isDyingCombatant(combatant) {
  return !!combatant?.isPlayer && !!combatant?.dying && !combatant?.dead;
}
function canTakeCombatTurn(combatant) {
  if(!combatant) return false;
  if(combatant.isPlayer) return !combatant.dead && ((combatant.hp || 0) > 0 || combatant.dying);
  return (combatant.hp || 0) > 0;
}
function hasActionablePlayerCombatants(combatants) {
  return (combatants || []).some(c => c?.isPlayer && !c?.dead && (((c?.hp || 0) > 0) || c?.dying));
}
function getNextCombatTurn(combatants, currentTurn, currentRound) {
  let nextTurn = currentTurn + 1;
  let nextRound = currentRound;
  if(nextTurn >= combatants.length) { nextTurn = 0; nextRound++; }
  let safety = 0;
  while(safety++ < combatants.length && !canTakeCombatTurn(combatants[nextTurn])) {
    nextTurn++;
    if(nextTurn >= combatants.length) { nextTurn = 0; nextRound++; }
  }
  return { nextTurn, nextRound };
}
function applyCombatDamageState(combatant, damage) {
  const nextHp = Math.max(0, (combatant?.hp || 0) - damage);
  if(nextHp > 0) return { ...combatant, hp: nextHp };
  if(combatant?.dead) return { ...combatant, hp: 0 };
  return {
    ...combatant,
    hp: 0,
    dying: true,
    stable: false,
    dead: false,
    deathSuccesses: combatant?.dying ? (combatant.deathSuccesses || 0) : 0,
    deathFailures: combatant?.dying ? (combatant.deathFailures || 0) : 0,
  };
}
function reviveCombatantState(combatant, hp) {
  return {
    ...combatant,
    hp,
    dying: false,
    stable: false,
    dead: false,
    deathSuccesses: 0,
    deathFailures: 0,
  };
}
function resolveDeathSave(combatant, forcedRoll) {
  const rollValue = forcedRoll ?? roll(20);
  if(rollValue === 20) {
    return {
      rollValue,
      result: "nat20",
      nextCombatant: reviveCombatantState(combatant, 1),
      log: `🕯️ **${combatant.name}** tira un **20 naturale** sulla salvezza contro la morte e ritorna a **1 HP**!`,
    };
  }
  const successGain = rollValue >= 10 ? 1 : 0;
  const failureGain = rollValue === 1 ? 2 : rollValue <= 9 ? 1 : 0;
  const successes = (combatant.deathSuccesses || 0) + successGain;
  const failures = (combatant.deathFailures || 0) + failureGain;
  if(failures >= 3) {
    return {
      rollValue,
      result: "dead",
      nextCombatant: { ...combatant, hp: 0, dying: false, stable: false, dead: true, deathSuccesses: successes, deathFailures: failures },
      log: `☠️ **${combatant.name}** fallisce la salvezza contro la morte (${successes}/3 successi, ${failures}/3 fallimenti) e **muore**.`,
    };
  }
  if(successes >= 3) {
    const revivedHp = Math.max(1, Math.ceil((combatant?.maxHp || combatant?.max_hp || 1) * 0.5));
    return {
      rollValue,
      result: "revived",
      nextCombatant: reviveCombatantState(combatant, revivedHp),
      log: `🕯️ **${combatant.name}** ottiene la terza salvezza (${successes}/3) e torna in piedi con **${revivedHp} HP**!`,
    };
  }
  return {
    rollValue,
    result: successGain ? "success" : "failure",
    nextCombatant: { ...combatant, hp: 0, dying: true, stable: false, dead: false, deathSuccesses: successes, deathFailures: failures },
    log: `🕯️ **${combatant.name}** tira una salvezza contro la morte: **d20 ${rollValue}** — ${successGain ? "successo" : "fallimento"} (${successes}/3 successi, ${failures}/3 fallimenti).`,
  };
}
function itemStatSummary(item) {
  if(!item) return [];
  const stats = [];
  if(item.weapon_die) stats.push(`🎲 ${item.weapon_die}`);
  if(item.bonus_atk) stats.push(`⚔️ +${item.bonus_atk}`);
  if(item.bonus_def) stats.push(`🛡️ +${item.bonus_def}`);
  if(item.bonus_mag) stats.push(`✨ +${item.bonus_mag}`);
  if(item.bonus_hp) stats.push(`❤️ +${item.bonus_hp}`);
  if(item.bonus_init) stats.push(`🦶 ${item.bonus_init>=0?"+":""}${item.bonus_init}`);
  if(item.heal_amount) stats.push(`🧪 Cura ${item.heal_amount}`);
  return stats;
}
function itemTypeLabel(type) {
  return ({
    weapon: "Arma",
    armor: "Armatura",
    shield: "Scudo",
    accessory: "Accessorio",
    potion: "Pozione",
  })[type] || type || "Oggetto";
}
function svgDataUrl(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function makeArchetypeImage({ icon, title, accent="#fbbf24", accent2="#7c3aed", bg1="#172033", bg2="#0b1120", border="#334155", subtitle="" }) {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${accent2}" stop-opacity="0.12"/>
        </linearGradient>
      </defs>
      <rect width="320" height="320" rx="36" fill="url(#bg)"/>
      <rect x="12" y="12" width="296" height="296" rx="28" fill="none" stroke="${border}" stroke-width="4"/>
      <circle cx="160" cy="134" r="88" fill="url(#shine)"/>
      <text x="160" y="162" text-anchor="middle" font-size="104">${icon}</text>
      <text x="160" y="248" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="Georgia,serif">${title}</text>
      <text x="160" y="275" text-anchor="middle" fill="#94a3b8" font-size="15" font-family="Georgia,serif">${subtitle}</text>
    </svg>
  `);
}
function itemImageTheme(item) {
  const key = `${item?.id || ""} ${item?.name || ""}`.toLowerCase();
  const rarityAccent = {
    common: ["#94a3b8", "#64748b"],
    uncommon: ["#22c55e", "#0ea5e9"],
    rare: ["#60a5fa", "#7c3aed"],
    epic: ["#a855f7", "#fb7185"],
    legendary: ["#f59e0b", "#fef08a"],
  }[item?.rarity] || ["#fbbf24", "#7c3aed"];
  const themed = (theme) => ({ accent:rarityAccent[0], accent2:rarityAccent[1], ...theme });
  const tests = [
    [/crossbow|balestra|ballista|balista/, { icon:"🏹", title:"Balestra", bg1:"#1f1a12", bg2:"#0c0906", border:"#92400e" }],
    [/bow|arco|longbow/, { icon:"🏹", title:"Arco", bg1:"#102319", bg2:"#070f0b", border:"#166534" }],
    [/spear|lancia|halberd|alabarda|glaive|asta/, { icon:"🔱", title:"Arma in Asta", bg1:"#172033", bg2:"#080b12", border:"#1d4ed8" }],
    [/axe|ascia|hatchet|accetta/, { icon:"🪓", title:"Ascia", bg1:"#28130f", bg2:"#0e0806", border:"#991b1b" }],
    [/mace|mazza|hammer|martello|club|randello/, { icon:"🔨", title:"Arma Pesante", bg1:"#241a12", bg2:"#0d0906", border:"#854d0e" }],
    [/dagger|pugnale|knife|coltello/, { icon:"🗡️", title:"Lama Leggera", bg1:"#1d1726", bg2:"#09070d", border:"#6d28d9" }],
    [/sword|spada|blade|lama|rapier|falchion|cutlass|sciabola|claymore/, { icon:"⚔️", title:"Lama", bg1:"#261019", bg2:"#09090b", border:"#7f1d1d" }],
    [/staff|bastone|wand|bacchetta|rod|verga/, { icon:"🪄", title:"Focus", bg1:"#171235", bg2:"#080714", border:"#5b21b6" }],
    [/grimoire|grimorio|tome|tomo|book|libro/, { icon:"📘", title:"Grimorio", bg1:"#111b35", bg2:"#080b16", border:"#3730a3" }],
    [/orb|sfera|crystal|cristallo|sintonia/, { icon:"🔮", title:"Reliquia", bg1:"#16152e", bg2:"#080712", border:"#6d28d9" }],
    [/whip|frusta/, { icon:"〰️", title:"Frusta", bg1:"#21140d", bg2:"#0d0704", border:"#9a3412" }],
    [/scythe|falce/, { icon:"🌙", title:"Falce", bg1:"#10201e", bg2:"#060d0c", border:"#0f766e" }],
    [/shield|scudo/, { icon:"🛡️", title:"Scudo", bg1:"#0f221d", bg2:"#08110f", border:"#166534" }],
    [/head_|helm|elmo|helmet|crown|corona|circlet|diadema/, { icon:"👑", title:"Copricapo", bg1:"#21170a", bg2:"#0d0904", border:"#a16207" }],
    [/hood|cappuccio|cap|berretto|cuffia|cowl|cappello/, { icon:"🧙", title:"Cappuccio", bg1:"#171225", bg2:"#080711", border:"#6d28d9" }],
    [/legs_|pants|greaves|legplates|kilt|gambali/, { icon:"🦵", title:"Gambali", bg1:"#161d2b", bg2:"#080b12", border:"#1e40af" }],
    [/boots|stivali|shoes|sandals|sabatons|calzari/, { icon:"🥾", title:"Calzature", bg1:"#1d1711", bg2:"#0b0805", border:"#854d0e" }],
    [/gloves|guanti|gauntlets|bracer|fist|hands/, { icon:"🧤", title:"Guanti", bg1:"#191f2a", bg2:"#080b10", border:"#334155" }],
    [/cloak|mantle|cape|robe|shroud|mantello|cappa/, { icon:"🧥", title:"Mantello", bg1:"#172033", bg2:"#080b12", border:"#334155" }],
    [/mail|maglia|chain|plate|piastre|armor|armatura|leather|cuoio|gambeson|coat|corazza/, { icon:"🛡️", title:"Armatura", bg1:"#102033", bg2:"#08111d", border:"#1d4ed8" }],
    [/escape|fuga|smoke|fumo/, { icon:"💨", title:"Pozione", bg1:"#202333", bg2:"#0b0d14", border:"#475569" }],
    [/heal|cura|vita|ristoro|mending|tonic|tonico/, { icon:"🧪", title:"Cura", bg1:"#2a1018", bg2:"#11060a", border:"#be123c" }],
    [/balm|balsamo|guardian|guardiano/, { icon:"🧴", title:"Balsamo", bg1:"#102033", bg2:"#08111d", border:"#1d4ed8" }],
    [/elixir|elisir|spark|scintilla|mag|arcane|arcano/, { icon:"✨", title:"Elisir", bg1:"#211235", bg2:"#0b0714", border:"#7c3aed" }],
    [/potion|pozione|infuso|ampolla|fiala/, { icon:"🧪", title:"Pozione", bg1:"#231236", bg2:"#120b1f", border:"#6d28d9" }],
    [/ring|anello/, { icon:"💍", title:"Anello", bg1:"#2a1d0a", bg2:"#140f09", border:"#b45309" }],
    [/charm|ciondolo|talisman|talismano|amulet|amuleto/, { icon:"📿", title:"Talismano", bg1:"#24170d", bg2:"#0d0805", border:"#92400e" }],
    [/sash|fascia|belt|cintura/, { icon:"🎗️", title:"Fascia", bg1:"#25130d", bg2:"#100704", border:"#c2410c" }],
  ];
  const match = tests.find(([rx]) => rx.test(key));
  if(match) return themed(match[1]);
  return {
    weapon:themed({ icon:"⚔️", title:"Arma", bg1:"#261019", bg2:"#09090b", border:"#7f1d1d" }),
    armor:themed({ icon:"🛡️", title:"Armatura", bg1:"#102033", bg2:"#08111d", border:"#1d4ed8" }),
    shield:themed({ icon:"🛡️", title:"Scudo", bg1:"#0f221d", bg2:"#08110f", border:"#166534" }),
    potion:themed({ icon:"🧪", title:"Pozione", bg1:"#231236", bg2:"#120b1f", border:"#6d28d9" }),
    accessory:themed({ icon:"💍", title:"Accessorio", bg1:"#2a1d0a", bg2:"#140f09", border:"#b45309" }),
  }[item?.type] || themed({ icon:item?.emoji || "⭐", title:"Oggetto", bg1:"#172033", bg2:"#0b1120", border:"#334155" });
}
function getItemImage(item) {
  if(!item) return "";
  if(item.image) return item.image;
  if(item.image_url) return item.image_url;
  // Strip enhancement suffix (e.g. "weapon_sword+2" → "weapon_sword") and try PNG
  const baseId = item.id ? item.id.replace(/[+\-]\d+$/, '') : null;
  if(baseId) return `/assets/items/${baseId}.png`;
  const theme = itemImageTheme(item);
  return makeArchetypeImage({ ...theme, title:theme.title || itemTypeLabel(item.type), subtitle:itemRarityLabel(item.rarity) });
}
function ItemImg({ item, size=56, style={} }) {
  const [useFallback, setUseFallback] = React.useState(false);
  const src = !useFallback ? getItemImage(item) : null;
  if (!item) return null;
  if (useFallback || !item.id) {
    const theme = itemImageTheme(item);
    const svg = makeArchetypeImage({ ...theme, title:theme.title || itemTypeLabel(item.type), subtitle:itemRarityLabel(item.rarity) });
    return <img src={svg} width={size} height={size} style={{ objectFit:'contain', borderRadius:6, ...style }} />;
  }
  return <img src={src} width={size} height={size} onError={()=>setUseFallback(true)} style={{ objectFit:'contain', borderRadius:6, ...style }} />;
}
function _darkenHex(hex, amt = 28) {
  const n = parseInt((hex||"#888888").replace("#",""), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}
function makeRaceClassPortrait(cls, race, gender) {
  const R = {
    human:      { skin:"#deb887", eye:"#5c3d2e", extra:"" },
    elf:        { skin:"#f0e0c0", eye:"#3a7a4a", extra:"elf_ears" },
    halfelf:    { skin:"#e8d5b0", eye:"#4a6a3a", extra:"halfelf_ears" },
    dwarf:      { skin:"#c8935a", eye:"#5c3d2e", extra:"beard" },
    halforc:    { skin:"#7aaa60", eye:"#884422", extra:"tusks" },
    dragonborn: { skin:"#9a7040", eye:"#cc4400", extra:"scales" },
    gnome:      { skin:"#f0c898", eye:"#4a2878", extra:"rosy_cheeks" },
    halfling:   { skin:"#f5c8a0", eye:"#5a3a28", extra:"rosy_cheeks" },
    tiefling:   { skin:"#c87898", eye:"#8a1a1a", extra:"horns" },
  }[race] || { skin:"#deb887", eye:"#5c3d2e", extra:"" };
  const C = {
    warrior:  { a:"#ef4444", a2:"#f59e0b", b1:"#2a1313", b2:"#10090a", bd:"#7f1d1d", bc:"#3a1a1a", icon:"⚔️" },
    barbarian:{ a:"#dc2626", a2:"#f97316", b1:"#2a1010", b2:"#100808", bd:"#991b1b", bc:"#4a1818", icon:"🪓" },
    mage:     { a:"#60a5fa", a2:"#a855f7", b1:"#111b35", b2:"#080b16", bd:"#3730a3", bc:"#1a2040", icon:"🔮" },
    sorcerer: { a:"#8b5cf6", a2:"#c084fc", b1:"#1a1135", b2:"#0c0820", bd:"#5b21b6", bc:"#251040", icon:"🪄" },
    warlock:  { a:"#7c3aed", a2:"#c4b5fd", b1:"#150c2a", b2:"#09060f", bd:"#4c1d95", bc:"#1f1030", icon:"🔮" },
    bard:     { a:"#f97316", a2:"#fbbf24", b1:"#2a1a08", b2:"#100a04", bd:"#c2410c", bc:"#3a2010", icon:"🎵" },
    cleric:   { a:"#fbbf24", a2:"#f8fafc", b1:"#2a2112", b2:"#110d08", bd:"#a16207", bc:"#3a3010", icon:"⛪" },
    druid:    { a:"#22c55e", a2:"#84cc16", b1:"#132418", b2:"#08100a", bd:"#166534", bc:"#1a3020", icon:"🌿" },
    monk:     { a:"#06b6d4", a2:"#0ea5e9", b1:"#0c2030", b2:"#060f18", bd:"#0e7490", bc:"#102028", icon:"🥋" },
    paladin:  { a:"#facc15", a2:"#fde68a", b1:"#252010", b2:"#100e08", bd:"#a16207", bc:"#302810", icon:"🛡️" },
    ranger:   { a:"#14b8a6", a2:"#22c55e", b1:"#0f2220", b2:"#060f0d", bd:"#0f766e", bc:"#102820", icon:"🏹" },
    rogue:    { a:"#22c55e", a2:"#4ade80", b1:"#0f2018", b2:"#060f0a", bd:"#166534", bc:"#102018", icon:"🗡️" },
  }[cls] || { a:"#c084fc", a2:"#60a5fa", b1:"#171c2a", b2:"#0b1020", bd:"#334155", bc:"#202030", icon:"⭐" };

  const { skin, eye, extra } = R;
  const { a, a2, b1, b2, bd, bc, icon } = C;
  const hairC = gender === "female" ? "#5a3020" : "#3a2010";
  const skinD = _darkenHex(skin, 22);

  const ears = extra === "elf_ears"
    ? `<ellipse cx="74" cy="148" rx="14" ry="26" fill="${skin}" stroke="${skinD}" stroke-width="1.5"/>
       <ellipse cx="246" cy="148" rx="14" ry="26" fill="${skin}" stroke="${skinD}" stroke-width="1.5"/>`
    : extra === "halfelf_ears"
    ? `<ellipse cx="77" cy="150" rx="11" ry="19" fill="${skin}"/>
       <ellipse cx="243" cy="150" rx="11" ry="19" fill="${skin}"/>`
    : "";

  const special = extra === "beard"
    ? `<ellipse cx="160" cy="204" rx="54" ry="32" fill="#7a5a38"/>`
    : extra === "tusks"
    ? `<rect x="140" y="198" width="13" height="24" rx="5" fill="#f0f0d8"/>
       <rect x="167" y="198" width="13" height="24" rx="5" fill="#f0f0d8"/>`
    : extra === "horns"
    ? `<path d="M128 82 Q105 38 118 16" stroke="#7a2828" stroke-width="11" stroke-linecap="round" fill="none"/>
       <path d="M192 82 Q215 38 202 16" stroke="#7a2828" stroke-width="11" stroke-linecap="round" fill="none"/>`
    : extra === "scales"
    ? `<circle cx="122" cy="130" r="9" fill="${a}" opacity="0.38"/>
       <circle cx="145" cy="112" r="9" fill="${a}" opacity="0.38"/>
       <circle cx="175" cy="112" r="9" fill="${a}" opacity="0.38"/>
       <circle cx="198" cy="130" r="9" fill="${a}" opacity="0.38"/>`
    : extra === "rosy_cheeks"
    ? `<circle cx="116" cy="165" r="18" fill="#ff8888" opacity="0.3"/>
       <circle cx="204" cy="165" r="18" fill="#ff8888" opacity="0.3"/>`
    : "";

  const hair = gender === "female"
    ? `<ellipse cx="160" cy="84" rx="84" ry="40" fill="${hairC}"/>
       <rect x="76" y="84" width="22" height="88" rx="11" fill="${hairC}"/>
       <rect x="222" y="84" width="22" height="88" rx="11" fill="${hairC}"/>`
    : `<ellipse cx="160" cy="84" rx="84" ry="34" fill="${hairC}"/>`;

  return svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${b1}"/><stop offset="100%" stop-color="${b2}"/></linearGradient>
      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${a}" stop-opacity="0.5"/><stop offset="100%" stop-color="${a2}" stop-opacity="0.05"/></linearGradient>
      <clipPath id="cl"><rect width="320" height="320" rx="36"/></clipPath>
    </defs>
    <rect width="320" height="320" rx="36" fill="url(#bg)"/>
    <ellipse cx="160" cy="310" rx="160" ry="72" fill="${bc}" opacity="0.9"/>
    <rect x="138" y="210" width="44" height="55" rx="10" fill="${skin}"/>
    <ellipse cx="160" cy="280" rx="96" ry="52" fill="${bc}"/>
    ${ears}
    <circle cx="160" cy="152" r="84" fill="${skin}"/>
    ${special}
    ${hair}
    <circle cx="130" cy="148" r="13" fill="${eye}"/>
    <circle cx="190" cy="148" r="13" fill="${eye}"/>
    <circle cx="126" cy="144" r="5" fill="white" opacity="0.55"/>
    <circle cx="186" cy="144" r="5" fill="white" opacity="0.55"/>
    <circle cx="160" cy="170" r="5" fill="${skinD}"/>
    <path d="M143 188 Q160 200 177 188" stroke="${skinD}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="268" cy="52" r="30" fill="${b1}" opacity="0.92"/>
    <circle cx="268" cy="52" r="30" fill="none" stroke="${a}" stroke-width="2.5"/>
    <text x="268" y="63" text-anchor="middle" font-size="28">${icon}</text>
    <rect x="10" y="10" width="300" height="300" rx="30" fill="none" stroke="${bd}" stroke-width="3" clip-path="url(#cl)"/>
    <rect x="10" y="10" width="300" height="300" rx="30" fill="url(#glow)" opacity="0.18" clip-path="url(#cl)"/>
  </svg>`);
}
function getPlayerPortrait(player) {
  if(!player) return "";
  if(player.portrait) return player.portrait;
  if(player.image) return player.image;
  const cls  = (player.class  || "warrior").toLowerCase();
  const race = (player.race   || "human").toLowerCase();
  const gender = player.gender || getStoredCharacterGender(player.id, "male");
  // Secret races don't have class-specific portraits — use race_gender directly
  const SECRET_RACES = ['minotaur','angel','succubus'];
  if(SECRET_RACES.includes(race)) return getRacePortraitPath(race, gender);
  return getPortraitPath(cls, race, gender);
}
function getMonsterImage(monster) {
  if(!monster) return "";
  if(monster.image) return monster.image;
  if(monster.image_url) return monster.image_url;
  if(monster.name) {
    // Try with monster's own id first (e.g. m1-goblin-delle-rovine.png)
    if(monster.id && monster.id.match(/^m\d+/)) return monsterAssetPath(monster);
    // For quest-specific enemies look up matching monster in catalogue by name
    const nameSlug = slugifyAssetName(monster.name);
    const catalogMatch = DEFAULT_MONSTERS.find(m => slugifyAssetName(m.name) === nameSlug);
    if(catalogMatch) return monsterAssetPath(catalogMatch);
    const aliasMatch = getQuestMonsterImageByAlias(monster);
    if(aliasMatch) return aliasMatch;
    // No file match — fall through to archetype generated image below
  }
  const key = `${monster.id || ""} ${monster.name || ""} ${monster.desc || ""}`.toLowerCase();
  const theme =
    /drago|dragon/.test(key) ? { icon:"🐉", title:"Drago", accent:"#ef4444", accent2:"#f59e0b", bg1:"#2b1010", bg2:"#120808", border:"#991b1b" } :
    /lich|scheletro|skeleton|spettro|vampir|undead|catacomb|zombie|revenant|mummia|wraith|banshee|fantasma|wight|ghoul|ghast/.test(key) ? { icon:"💀", title:"Non-morto", accent:"#c4b5fd", accent2:"#60a5fa", bg1:"#19142c", bg2:"#090b16", border:"#5b21b6" } :
    /demone|demon/.test(key) ? { icon:"😈", title:"Demone", accent:"#fb7185", accent2:"#ef4444", bg1:"#2a0d18", bg2:"#13070c", border:"#9f1239" } :
    /golem|guardiano|guardian|titano|construct|runic/.test(key) ? { icon:"🗿", title:"Costrutto", accent:"#94a3b8", accent2:"#60a5fa", bg1:"#17202b", bg2:"#0a0f16", border:"#475569" } :
    /ragno|spider|serpente|hydra|idra|lupo|wolf|ratto|boar|cervo|beast|slime|melma|orso|tigre|leone|bestia|animale|cinghiale|basilisco|coccodrillo|corvo|aquila|grifone|wyvern|viverna/.test(key) ? { icon:monster.emoji || "🐾", title:"Bestia", accent:"#22c55e", accent2:"#84cc16", bg1:"#142218", bg2:"#09110c", border:"#166534" } :
    /mago|strega|cultista|oracle|witch/.test(key) ? { icon:monster.emoji || "🪄", title:"Incantatore", accent:"#a855f7", accent2:"#60a5fa", bg1:"#1e1634", bg2:"#0b0b16", border:"#6d28d9" } :
    /goblin|orco|orc|gnoll|bandit|cobold|coboldo|mercenario|knight|armigero|brigante|pirata|assassin/.test(key) ? { icon:monster.emoji || "🪓", title:"Predone", accent:"#f59e0b", accent2:"#ef4444", bg1:"#25160d", bg2:"#0f0908", border:"#92400e" } :
    monster.isBoss ? { icon:monster.emoji || "👑", title:"Boss", accent:"#fbbf24", accent2:"#fb7185", bg1:"#271915", bg2:"#110b09", border:"#b45309" } :
    { icon:monster.emoji || "👾", title:"Creatura", accent:"#60a5fa", accent2:"#22c55e", bg1:"#172033", bg2:"#0b1120", border:"#334155" };
  return makeArchetypeImage({ ...theme, subtitle:monster.isBoss ? "Boss" : `${monster.hp || 0} HP` });
}
function TypewriterText({ text, speed=18, style={}, onDone }) {
  const [displayed, setDisplayed] = React.useState('');
  const [done, setDone] = React.useState(false);
  const idxRef = React.useRef(0);

  React.useEffect(() => {
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;
    if(!text) return;
    const interval = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(text.slice(0, idxRef.current));
      if(idxRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span style={style} onClick={() => { if(!done) { setDisplayed(text); setDone(true); idxRef.current = text.length; onDone?.(); } }}>
      {displayed}
      {!done && <span style={{ opacity: 0.7, animation:'blink 0.7s step-end infinite' }}>▌</span>}
    </span>
  );
}

function ArtThumb({ src, alt, size=56, radius=12, race, gender, cls }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={e => {
        // fallback chain: cls_race_gender → race_gender → cls_gender → archetype
        const cur = e.currentTarget.src;
        if(race && gender && cls && cur.includes(`${cls}_${race}_${gender}`)) {
          e.currentTarget.src = getRacePortraitPath(race, gender);
        } else if(race && gender && cur.includes(`${race}_${gender}`)) {
          e.currentTarget.src = getClassPortraitPath(cls || 'warrior', gender);
        } else {
          e.currentTarget.onerror = null;
          e.currentTarget.src = makeArchetypeImage({ icon:"👾", title:alt || "Creatura", subtitle:"" });
        }
      }}
      style={{ width:size, height:size, minWidth:size, borderRadius:radius, objectFit:"cover", display:"block", background:"rgba(15,23,42,0.72)", border:"1px solid rgba(148,163,184,0.16)", boxShadow:"0 10px 24px rgba(0,0,0,0.22)" }}
    />
  );
}
function itemRarityLabel(rarity) {
  return ({
    common: "Comune",
    uncommon: "Non comune",
    rare: "Raro",
    epic: "Epico",
    legendary: "Leggendario",
    base: "Base",
  })[String(rarity || "").toLowerCase()] || rarity || "Catalogo";
}
function resolveLootItem(spec, items) {
  if(!spec) return null;
  if(typeof spec === "object" && spec.id) return items.find(item => item.id === spec.id) || null;
  const search = String(spec).trim().toLowerCase();
  return items.find(item =>
    item.id.toLowerCase() === search ||
    item.name.toLowerCase() === search ||
    item.name.toLowerCase().includes(search) ||
    search.includes(item.name.toLowerCase())
  ) || null;
}

/* ----------------------------------------------
   SUPABASE HELPERS
---------------------------------------------- */
async function dbSendMessage(msg) {
  const { error } = await supabase.from("messages").insert({
    party_code: msg.party_code,
    author: msg.author,
    content: msg.content,
    type: msg.type || "chat",
  });
  if(error) console.error("[dbSendMessage] errore:", error.message, msg);
}

function parsePlayerMasterMeta(msg) {
  try {
    const parsed = JSON.parse(msg?.content || "{}");
    if(!parsed?.playerId) return null;
    return {
      playerId: parsed.playerId,
      realPlayerName: String(parsed.realPlayerName || "").trim(),
      heroName: String(parsed.heroName || "").trim(),
      partyCode: parsed.partyCode || msg.party_code || "",
      updatedAt: parsed.updatedAt || msg.created_at || "",
    };
  } catch {
    return null;
  }
}

function parseUserMasterMeta(msg) {
  try {
    const parsed = JSON.parse(msg?.content || "{}");
    if(!parsed?.userId || !parsed?.email) return null;
    return {
      userId: parsed.userId,
      email: String(parsed.email || "").trim().toLowerCase(),
      registeredAt: parsed.registeredAt || msg.created_at || "",
      lastSeenAt: parsed.lastSeenAt || msg.created_at || "",
      activeCharacterId: parsed.activeCharacterId || null,
      afk: parsed.afk || false,
    };
  } catch {
    return null;
  }
}

async function dbSaveUserMasterMeta(user, registeredAt, activeCharacterId, afk = false) {
  if(!user?.id || !user?.email) return;
  const now = new Date().toISOString();
  const payload = {
    userId: user.id,
    email: user.email,
    registeredAt: registeredAt || user.created_at || now,
    lastSeenAt: now,
    afk: afk || false,
  };
  if(activeCharacterId) payload.activeCharacterId = activeCharacterId;
  const content = JSON.stringify(payload);
  const { error } = await supabase.from("messages").insert({
    party_code: "__users",
    author: `user_meta:${user.id}`,
    content,
    type: "user_meta",
  });
  if(error) console.warn("Impossibile salvare metadati utente:", error.message);
}

async function dbSaveSessionEvent(user, eventType) {
  if(!user?.id || !user?.email) return;
  await supabase.from("messages").insert({
    party_code: "__users",
    author: `session:${user.id}`,
    content: JSON.stringify({ userId: user.id, email: user.email, event: eventType, ts: new Date().toISOString() }),
    type: "user_session",
  });
}

async function dbGetSessionHistory(limitDays = 7) {
  const since = new Date(Date.now() - limitDays * 86400000).toISOString();
  const { data } = await supabase
    .from("messages")
    .select("content,created_at")
    .eq("type", "user_session")
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(2000);
  // Group events into sessions per user
  const sessionsByUser = {};
  for(const row of (data || [])) {
    let parsed;
    try { parsed = JSON.parse(row.content); } catch { continue; }
    const { userId, email, event, ts } = parsed;
    if(!userId) continue;
    if(!sessionsByUser[userId]) sessionsByUser[userId] = { email, sessions: [], openSession: null };
    const u = sessionsByUser[userId];
    if(event === "login") {
      u.openSession = { start: ts, end: null };
    } else if(event === "logout" && u.openSession) {
      u.openSession.end = ts;
      u.sessions.push({ ...u.openSession });
      u.openSession = null;
    }
  }
  // Close any open sessions (user still online or page not closed cleanly)
  for(const u of Object.values(sessionsByUser)) {
    if(u.openSession) {
      u.sessions.push({ ...u.openSession, end: null });
      u.openSession = null;
    }
  }
  return sessionsByUser;
}

async function dbGetUserMasterMeta() {
  const { data, error } = await supabase
    .from("messages")
    .select("party_code,author,content,type,created_at")
    .eq("type", "user_meta")
    .order("created_at", { ascending: false })
    .limit(3000);
  if(error) throw error;
  const byUser = {};
  for(const msg of (data || [])) {
    const meta = parseUserMasterMeta(msg);
    if(meta && !byUser[meta.userId]) byUser[meta.userId] = meta;
  }
  return byUser;
}

function isRecentlyOnline(lastSeenAt, nowMs = Date.now()) {
  const seenMs = Date.parse(lastSeenAt || "");
  return Number.isFinite(seenMs) && nowMs - seenMs <= ONLINE_GRACE_MS;
}

function isPartyPlayerOnline(player, userMetaById, nowMs = Date.now()) {
  if(!player?.accountId) return false;
  const meta = userMetaById?.[player.accountId];
  if(!isRecentlyOnline(meta?.lastSeenAt, nowMs)) return false;
  // If the user has set an active character and it's NOT this one, they're offline here
  if(meta?.activeCharacterId && meta.activeCharacterId !== player.id) return false;
  // AFK players are excluded from combat even if online
  if(meta?.afk) return false;
  return true;
}

async function dbSavePlayerMasterMeta({ playerId, partyCode, heroName, realPlayerName }) {
  const cleanRealName = String(realPlayerName || "").trim();
  if(!playerId || !cleanRealName) return;
  const content = JSON.stringify({
    playerId,
    partyCode,
    heroName,
    realPlayerName: cleanRealName,
    updatedAt: new Date().toISOString(),
  });
  const { error } = await supabase.from("messages").insert({
    party_code: partyCode,
    author: `player_meta:${playerId}`,
    content,
    type: "player_meta",
  });
  if(error) throw error;
}

async function dbGetPlayerMasterMeta() {
  const { data, error } = await supabase
    .from("messages")
    .select("party_code,author,content,type,created_at")
    .eq("type", "player_meta")
    .order("created_at", { ascending: true })
    .limit(2000);
  if(error) throw error;
  const byPlayer = {};
  for(const msg of (data || [])) {
    const meta = parsePlayerMasterMeta(msg);
    if(meta) byPlayer[meta.playerId] = meta;
  }
  return byPlayer;
}

async function dbSavePlayer(p) {
  const payload = {
    id: p.id, name: p.name, party_code: p.partyCode,
    class: p?.class || 'warrior', race: p?.race || 'human',
    hp: p?.hp || 0, max_hp: p?.maxHp || 0, atk: p?.atk || 0, def: p?.def || 0,
    mag: p?.mag || 0, init: p?.init || 1, xp: p?.xp || 0, level: p?.level || 1, gold: p?.gold || 0,
    dead: !!p?.dead,
    updated_at: new Date().toISOString(),
  };
  if(p.accountId) payload.account_id = p.accountId;
  payload.avatar_config = { gender: p.gender || 'male', stats: p.stats || {}, achievements: p.achievements || [], subclass: p.subclass || null };
  const { data, error } = await supabase.from("players").upsert(payload).select("id,account_id,dead").single();
  return { data, error };
}

async function dbGetPlayers(partyCode) {
  let query = supabase.from("players").select("*");
  if(partyCode) query = query.eq("party_code", partyCode);
  const { data } = await query;
  return (data || []).map(r => ({
    id: r?.id, name: r?.name, partyCode: r?.party_code,
    accountId: r?.account_id || null,
    gender: getStoredCharacterGender(r?.id, typeof r?.avatar_config === 'string' ? r.avatar_config : (r?.avatar_config?.gender || 'male')),
    stats: (r?.avatar_config && typeof r.avatar_config === 'object') ? (r.avatar_config.stats || {}) : {},
    achievements: (r?.avatar_config && typeof r.avatar_config === 'object') ? (r.avatar_config.achievements || []) : [],
    subclass: (r?.avatar_config && typeof r.avatar_config === 'object') ? (r.avatar_config.subclass || null) : null,
    class: r?.class || 'warrior', race: r?.race || 'human',
    hp: r?.hp || 0, maxHp: r?.max_hp || 0, atk: r?.atk || 0, def: r?.def || 0,
    mag: r?.mag || 0, init: r?.init || 1, xp: r?.xp || 0, level: r?.level || 1, gold: r?.gold || 0, dead: !!r?.dead,
  }));
}
async function dbGetAccountCharacters(accountId) {
  if(!accountId) return [];
  const { data } = await supabase.from("players").select("*").eq("account_id", accountId).order("updated_at", { ascending:false });
  return (data || []).map(r => ({
    id: r?.id, name: r?.name, partyCode: r?.party_code,
    accountId: r?.account_id || null,
    gender: getStoredCharacterGender(r?.id, typeof r?.avatar_config === 'string' ? r.avatar_config : (r?.avatar_config?.gender || 'male')),
    stats: (r?.avatar_config && typeof r.avatar_config === 'object') ? (r.avatar_config.stats || {}) : {},
    achievements: (r?.avatar_config && typeof r.avatar_config === 'object') ? (r.avatar_config.achievements || []) : [],
    subclass: (r?.avatar_config && typeof r.avatar_config === 'object') ? (r.avatar_config.subclass || null) : null,
    class: r?.class || 'warrior', race: r?.race || 'human',
    hp: r?.hp || 0, maxHp: r?.max_hp || 0, atk: r?.atk || 0, def: r?.def || 0,
    mag: r?.mag || 0, init: r?.init || 1, xp: r?.xp || 0, level: r?.level || 1, gold: r?.gold || 0, dead: !!r?.dead,
  }));
}

async function dbGetMessages(partyCode) {
  if(!partyCode) {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(400);
    return (data || []).filter(msg => !["player_meta","user_meta"].includes(msg.type));
  }
  // Load chat and combat messages separately to avoid combat logs being pushed out by chat volume
  const [chatRes, combatRes] = await Promise.all([
    supabase.from("messages").select("*").eq("party_code", partyCode).not("type","eq","combat").order("created_at", { ascending: true }).limit(250),
    supabase.from("messages").select("*").eq("party_code", partyCode).eq("type","combat").order("created_at", { ascending: true }).limit(200),
  ]);
  const all = [...(chatRes.data || []), ...(combatRes.data || [])];
  all.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  return all.filter(msg => !["player_meta","user_meta"].includes(msg.type));
}

async function dbSavePartyState(partyCode, state) {
  // Pack all extra state into the combat JSONB column using a versioned wrapper.
  // v2 format: { __v:2, __combat, __masterBuffs, __rest, __persistentSpellSlots, __longRestSeed }
  const wrapped = {
    __v: 2,
    __combat: state.combat || null,
    __masterBuffs: state.masterBuffs || null,
    __rest: state.rest || null,
    __persistentSpellSlots: state.persistentSpellSlots || null,
    __longRestSeed: state.longRestSeed || 0,
    __questLog: state.questLog || [],
    __questDmgLog: state.questDmgLog || {},
    __partyDiary: state.partyDiary || [],
    __battleChat: state.battleChat || [],
    __questHistory: state.questHistory || [],
    __lastDailyReset: state.lastDailyReset || null,
    __story: state.story || null,
    __stories: state.stories || null,
    __dungeon: state.dungeon !== undefined ? state.dungeon : null,
  };
  const { error } = await supabase.from("party_state").upsert({
    party_code: partyCode,
    quest_id: state.currentId,
    quest_step: state.step,
    quest_active: state.active,
    quest_completed: state.completed,
    combat: wrapped,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function dbGetPartyState(partyCode) {
  const { data, error } = await supabase.from("party_state").select("*").eq("party_code", partyCode).maybeSingle();
  if (error) throw error;
  if (!data) return { currentId: null, step: 0, active: false, completed: [], combat: null, masterBuffs: null, rest: null, persistentSpellSlots: null, longRestSeed: 0, questLog: [], questDmgLog: {}, partyDiary: [], battleChat: [], questHistory: [] };
  const raw = data.combat || {};
  const isV2 = raw.__v === 2;
  const combat = isV2 ? (raw.__combat || null) : (raw && Object.keys(raw).length ? raw : null);
  return {
    currentId: data.quest_id,
    step: data.quest_step || 0,
    active: data.quest_active || false,
    completed: data.quest_completed || [],
    combat,
    masterBuffs: (isV2 ? raw.__masterBuffs : null) || null,
    rest: (isV2 ? raw.__rest : null) || null,
    persistentSpellSlots: (isV2 ? raw.__persistentSpellSlots : null) || null,
    longRestSeed: (isV2 ? raw.__longRestSeed : 0) || 0,
    questLog: (isV2 ? raw.__questLog : null) || [],
    questDmgLog: (isV2 ? raw.__questDmgLog : null) || {},
    partyDiary: (isV2 ? raw.__partyDiary : null) || [],
    battleChat: (isV2 ? raw.__battleChat : null) || [],
    questHistory: (isV2 ? raw.__questHistory : null) || [],
    lastDailyReset: (isV2 ? raw.__lastDailyReset : null) || null,
    story: (isV2 ? raw.__story : null) || null,
    stories: (isV2 ? raw.__stories : null) || null,
    dungeon: isV2 ? (raw.__dungeon ?? null) : null,
  };
}

async function dbGetMaintenanceMode() {
  const { data } = await supabase.from("party_state").select("quest_active").eq("party_code", MAINTENANCE_CODE).maybeSingle();
  return !!(data?.quest_active);
}
async function dbSetMaintenanceMode(active, message = "", patchNotes = "") {
  const ts = new Date().toISOString();
  const payload = {
    party_code: MAINTENANCE_CODE,
    quest_active: active,
    quest_id: message || null,
    updated_at: ts,
  };
  if(patchNotes) payload.state = { patch_notes: patchNotes, patch_ts: ts };
  const { error } = await supabase.from("party_state").upsert(payload, { onConflict: "party_code" });
  if(error) { console.error("dbSetMaintenanceMode error:", error); throw error; }
}

function getDailyResetSlot() {
  const now = new Date();
  const date = now.toLocaleDateString('en-CA');
  return now.getHours() >= 12 ? `${date}_noon` : `${date}_midnight`;
}

// Items / Shop
async function dbGetItems() {
  const { data } = await supabase.from("items").select("*").order("name", { ascending: true });
  return mergeCatalogItems(data || []);
}

async function dbSaveItem(item) {
  await supabase.from("items").upsert({
    id: item.id,
    name: item.name,
    emoji: item.emoji,
    type: item.type,
    description: item.description,
    bonus_atk: item.bonus_atk || 0,
    bonus_def: item.bonus_def || 0,
    bonus_mag: item.bonus_mag || 0,
    bonus_hp: item.bonus_hp || 0,
    price: item.price || 0,
    available: item.available !== false,
    updated_at: new Date().toISOString(),
  });
}

async function dbDeleteItem(itemId) {
  await supabase.from("items").delete().eq("id", itemId);
}

async function dbAddPlayerItem(playerId, itemId, quantity=1) {
  const amount = Math.max(1, Number(quantity) || 1);
  const payload = Array.from({ length: amount }, () => ({ player_id: playerId, item_id: itemId }));
  const { error } = await supabase.from("player_items").insert(payload);
  if(error) throw error;
}
async function dbTransferPlayerItem(rowId, nextPlayerId) {
  const { data, error } = await supabase
    .from("player_items")
    .update({ player_id: nextPlayerId })
    .eq("id", rowId)
    .select("id,player_id,item_id")
    .maybeSingle();
  if(error) throw error;
  if(!data) throw new Error("Oggetto non trovato o gia trasferito.");
  return data;
}
async function dbGetPlayerItems(playerId) {
  const { data } = await supabase.from("player_items").select("*").eq("player_id", playerId).order("created_at", { ascending: true });
  return data || [];
}
async function dbGetPlayerInventory(playerId, items = DEFAULT_ITEMS) {
  const rows = await dbGetPlayerItems(playerId);
  const entries = buildInventoryEntries(rows, items);
  return {
    rows,
    entries,
    counts: countInventoryItems(entries),
    groups: groupInventoryEntries(entries),
  };
}
async function dbRemovePlayerItem(rowId) {
  await supabase.from("player_items").delete().eq("id", rowId);
}
async function dbGetAuctionHouse() {
  const { data, error } = await supabase.from("party_state").select("combat").eq("party_code", AUCTION_HOUSE_CODE).maybeSingle();
  if(error) throw error;
  const raw = data?.combat || {};
  return {
    auctions: Array.isArray(raw.auctions) ? raw.auctions : [],
    updatedAt: raw.updatedAt || null,
  };
}
async function dbSaveAuctionHouse(state) {
  const payload = { auctions: state.auctions || [], updatedAt: new Date().toISOString() };
  const { error } = await supabase.from("party_state").upsert({
    party_code: AUCTION_HOUSE_CODE,
    quest_active: false,
    quest_id: "Mercato ad aste",
    quest_step: 0,
    quest_completed: [],
    combat: payload,
    updated_at: new Date().toISOString(),
  }, { onConflict: "party_code" });
  if(error) throw error;
}
async function dbDeleteCharacter(characterId) {
  await supabase.from("player_items").delete().eq("player_id", characterId);
  await supabase.from("players").delete().eq("id", characterId);
}
async function dbSyncCombatantPlayer(partyCode, playerId, updates={}) {
  if(!partyCode || !playerId) return;
  const state = await dbGetPartyState(partyCode);
  const combat = state?.combat;
  if(!combat?.combatants?.length) return;
  const combatants = combat.combatants.map(c => {
    if(!c?.isPlayer || c.id !== playerId) return c;
    const hp = updates.hp ?? c.hp;
    const maxHp = updates.maxHp ?? updates.max_hp ?? c.maxHp;
    const dead = updates.dead ?? c.dead;
    if((hp || 0) > 0 || dead === false) {
      return reviveCombatantState({ ...c, ...updates, maxHp }, Math.max(1, hp || 1));
    }
    return { ...c, ...updates, maxHp };
  });
  await dbSavePartyState(partyCode, { ...state, combat:{ ...combat, combatants } });
}
async function dbRemovePlayerFromPartyState(partyCode, playerId) {
  if(!partyCode || !playerId) return;
  const state = await dbGetPartyState(partyCode);
  const masterBuffs = { ...(state.masterBuffs || {}) };
  delete masterBuffs[playerId];
  const combat = state.combat?.combatants
    ? { ...state.combat, combatants: state.combat.combatants.filter(c => c.id !== playerId) }
    : state.combat;
  await dbSavePartyState(partyCode, { ...state, masterBuffs, combat });
}

async function dbDeleteMessages(partyCode) {
  await supabase.from("messages").delete().eq("party_code", partyCode);
}

async function dbDeletePlayers(partyCode) {
  await supabase.from("players").delete().eq("party_code", partyCode);
}

async function dbDeletePartyState(partyCode) {
  await supabase.from("party_state").delete().eq("party_code", partyCode);
}

/* ── Guild DB ── */
async function dbGetAllGuilds() {
  const { data } = await supabase.from("party_state").select("combat").eq("party_code", GUILD_REGISTRY_CODE).maybeSingle();
  return data?.combat?.guilds || {};
}
async function dbSaveAllGuilds(guilds) {
  const { error } = await supabase.from("party_state").upsert({ party_code: GUILD_REGISTRY_CODE, combat: { guilds }, updated_at: new Date().toISOString() });
  if(error) throw error;
}
async function dbGetWorldEvent() {
  const { data } = await supabase.from("party_state").select("combat").eq("party_code", WORLD_EVENT_CODE).maybeSingle();
  return data?.combat?.event || null;
}
async function dbSaveWorldEvent(event) {
  const { error } = await supabase.from("party_state").upsert({ party_code: WORLD_EVENT_CODE, combat: { event }, updated_at: new Date().toISOString() });
  if(error) throw error;
}
async function dbGetGuildWarehouse(guildId) {
  const virtualId = "guild_" + guildId;
  const rows = await dbGetPlayerItems(virtualId);
  return rows;
}
async function dbDepositToGuild(guildId, rowId) {
  const virtualId = "guild_" + guildId;
  return dbTransferPlayerItem(rowId, virtualId);
}
async function dbWithdrawFromGuild(guildId, rowId, playerId) {
  return dbTransferPlayerItem(rowId, playerId);
}

async function resetPartyCombat(partyCode) {
  const state = await dbGetPartyState(partyCode);
  await dbSavePartyState(partyCode, { ...state, combat: null });
}

async function resetPartyCampaign(partyCode) {
  await dbDeleteMessages(partyCode);
  await resetPartyCombat(partyCode);
}

async function deleteParty(partyCode) {
  await dbDeleteMessages(partyCode);
  await dbDeletePlayers(partyCode);
  await dbDeletePartyState(partyCode);
}

/* ----------------------------------------------
   ERROR BOUNDARY
---------------------------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if(this.state.error) {
      return (
        <div style={{ padding:20, color:"#f8fafc", background:"#091b2d", minHeight:"100vh" }}>
          <h2 style={{ color:"#f87171" }}>Errore durante il caricamento della schermata di gioco</h2>
          <p>{this.state.error?.message || this.state.error?.toString()}</p>
          <pre style={{ whiteSpace:"pre-wrap", fontSize:"0.75rem", color:"#cbd5e1" }}>{this.state.info?.componentStack}</pre>
          <button onClick={this.props.onReset} style={{ marginTop:12, padding:"0.6rem 1rem", background:"#4f46e5", color:"#f8fafc", border:"none", borderRadius:4, cursor:"pointer" }}>Torna al menu</button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ----------------------------------------------
   ROOT
---------------------------------------------- */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [myId, setMyId] = useState(() => localStorage.getItem("eoz_myId") || null);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [appMaintenance, setAppMaintenance] = useState(false);
  const [appMaintenanceMsg, setAppMaintenanceMsg] = useState("");

  useEffect(() => {
    async function checkAppMaintenance() {
      try {
        const { data } = await supabase.from("party_state").select("quest_active,quest_id").eq("party_code", MAINTENANCE_CODE).maybeSingle();
        setAppMaintenance(!!(data?.quest_active));
        setAppMaintenanceMsg(data?.quest_id || "");
      } catch(e) { /* silent */ }
    }
    checkAppMaintenance();
    const t = setInterval(checkAppMaintenance, 15_000);
    return () => clearInterval(t);
  }, []);

  // Try to autoplay BGM as soon as the app loads (falls back to first user gesture)
  useEffect(() => { audioManager.autoplayOnStartup('intro'); }, []);

  useEffect(() => {
    if (screen === "landing" || screen === "create" || screen === "master") {
      audioManager.playBGM("intro");
    }
  }, [screen]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setAuthUser(session?.user || null);
      if(session?.user) { dbSaveUserMasterMeta(session.user); dbSaveSessionEvent(session.user, "login"); }
      setAuthLoading(false);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((event, session)=>{
      setAuthUser(session?.user || null);
      if(session?.user) {
        dbSaveUserMasterMeta(session.user);
        if(event === "SIGNED_IN") dbSaveSessionEvent(session.user, "login");
        if(event === "SIGNED_OUT") dbSaveSessionEvent(session.user, "logout");
      }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(() => {
    if(!authUser) return;
    const activeId = myId || null;
    const readAfk = () => activeId ? localStorage.getItem(`afk_${activeId}`) === '1' : false;
    dbSaveUserMasterMeta(authUser, null, activeId, readAfk());
    const timer = setInterval(() => dbSaveUserMasterMeta(authUser, null, activeId, readAfk()), USER_HEARTBEAT_MS);
    const handleUnload = () => dbSaveSessionEvent(authUser, "logout");
    const handleVisibility = () => { if(document.visibilityState === "hidden") dbSaveSessionEvent(authUser, "logout"); };
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [authUser, myId]);

  // Inactivity timeout — 30 minutes no interaction → full signOut
  useEffect(() => {
    if (!authUser) return;
    const INACTIVITY_MS = 30 * 60 * 1000;
    let lastActivity = Date.now();
    const resetActivity = () => { lastActivity = Date.now(); };
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetActivity, { passive: true }));
    const check = setInterval(async () => {
      if (Date.now() - lastActivity >= INACTIVITY_MS) {
        clearInterval(check);
        await supabase.auth.signOut();
      }
    }, 30_000);
    return () => {
      clearInterval(check);
      events.forEach(e => window.removeEventListener(e, resetActivity));
    };
  }, [authUser]);

  async function goGame(characterOrId) {
    const selectedCharacter = characterOrId && typeof characterOrId === "object" ? characterOrId : null;
    const validId = (selectedCharacter?.id ?? characterOrId ?? "").toString().trim();
    debugCharacterFlow("go_game_start", {
      inputType: selectedCharacter ? "character" : "id",
      selectedId: validId || null,
      selectedCharacter,
    });
    if(!validId) {
      alert("ID personaggio non valido. Effettua il login o crea un personaggio.");
      setScreen("landing");
      return;
    }
    try {
      let data = selectedCharacter
        ? {
            id: validId,
            dead: !!selectedCharacter.dead,
            account_id: selectedCharacter.accountId ?? selectedCharacter.account_id ?? null,
          }
        : null;
      if(!data) {
        const { data: fetchedCharacter, error } = await supabase.from("players").select("id,dead,account_id").eq("id", validId).maybeSingle();
        debugCharacterFlow("go_game_fetch_result", {
          requestedId: validId,
          found: !!fetchedCharacter,
          fetchedCharacter,
          error: error?.message || null,
        });
        if(error) throw error;
        if(!fetchedCharacter) throw new Error("Personaggio non trovato");
        data = fetchedCharacter;
      }
      debugCharacterFlow("go_game_validation_input", data);
      if(authUser?.id && !data.account_id) {
        debugCharacterFlow("go_game_missing_account_bind", { requestedId: validId, accountId: authUser.id });
        const { error: bindError } = await supabase
          .from("players")
          .update({ account_id: authUser.id, updated_at: new Date().toISOString() })
          .eq("id", validId);
        debugCharacterFlow("go_game_bind_result", { requestedId: validId, error: bindError?.message || null });
        if(bindError) throw bindError;
      } else if(authUser?.id && data.account_id !== authUser.id) {
        debugCharacterFlow("go_game_validation_failed", { reason: "account_mismatch", requestedId: validId, expected: authUser.id, actual: data.account_id });
        throw new Error("Personaggio non appartenente a questo account");
      }
      if(data.dead) {
        debugCharacterFlow("go_game_validation_failed", { reason: "dead_character", requestedId: validId });
        throw new Error("Questo personaggio è morto e non può essere giocato");
      }
      debugCharacterFlow("selected_player_id_set", { playerId: validId });
      setMyId(validId);
      localStorage.setItem("eoz_myId", validId);
      setScreen("game");
    } catch(e) {
      debugCharacterFlow("go_game_failure", { requestedId: validId, error: e?.message || String(e) });
      console.error("Errore caricamento personaggio:", e);
      if((localStorage.getItem("eoz_myId") || "").trim() === validId) localStorage.removeItem("eoz_myId");
      setMyId(null);
      alert(`Caricamento personaggio fallito.\n\nPlayer ID: ${validId}\nMotivo: ${e?.message || "errore sconosciuto"}`);
      setScreen("landing");
    }
  }

  if(authLoading) return (
    <div style={{ minHeight:"100vh", width:"100vw", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
      <AnimatedBackground screen={screen} />
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.32)" }} />
      <div style={{ position:"relative", zIndex:1, color:"#e2d9c5", fontFamily:"'Cinzel',serif" }}>Caricamento...</div>
    </div>
  );

  // Master can bypass maintenance to access the panel
  const isMasterUser = canAccessMasterPanel(authUser);
  if(appMaintenance && !isMasterUser) return (
    <div style={{ minHeight:"100vh", width:"100vw", position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.5rem", padding:"2rem", textAlign:"center" }}>
      <AnimatedBackground screen={screen} />
      <div style={{ position:"absolute", inset:0, background:"rgba(2,4,14,0.97)", zIndex:0 }} />
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"1.2rem" }}>
        <div style={{ fontSize:"4rem" }}>🔧</div>
        <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.6rem", fontWeight:700, letterSpacing:"0.04em" }}>Gioco in Manutenzione</div>
        <div style={{ color:"#94a3b8", fontSize:"0.95rem", maxWidth:440, lineHeight:1.7 }}>
          {appMaintenanceMsg || "Il Dungeon Master sta aggiornando il mondo. Riprova tra qualche minuto."}
        </div>
        <div style={{ padding:"0.6rem 1.4rem", background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:8, color:"#fbbf24", fontSize:"0.78rem" }}>
          La pagina si aggiornerà automaticamente quando il gioco sarà di nuovo disponibile.
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", width:"100vw", fontFamily:"'Crimson Pro',Georgia,serif", color:"#e2d9c5", position:"relative" }}>
      <AnimatedBackground screen={screen} />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
        * { -webkit-tap-highlight-color: transparent; }
        input, select, textarea { font-size: 16px !important; }
        button { touch-action: manipulation; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(109,40,217,0.4); border-radius: 2px; }
        @media (max-width: 768px) {
          button { min-height: 40px; }
          input, select { min-height: 40px; padding: 0.5rem 0.75rem !important; }
        }
      `}</style>
      {screen==="master" && <MasterPanelAuth setScreen={setScreen} authUser={authUser} />}
      {screen!=="master" && !authUser && <AuthScreen setAuthUser={setAuthUser} setScreen={setScreen} setMyId={setMyId} />}
      {screen!=="master" && authUser && screen==="landing" && <Landing setScreen={setScreen} goGame={goGame} myId={myId} authUser={authUser} setAuthUser={setAuthUser} />}
      {screen!=="master" && authUser && screen==="create"  && <CreateChar setScreen={setScreen} goGame={goGame} authUser={authUser} />}
      {screen!=="master" && authUser && screen==="game" && (
        <ErrorBoundary onReset={()=>setScreen("landing")}> 
          <GameScreen myId={myId} setScreen={setScreen} authUser={authUser} />
        </ErrorBoundary>
      )}
    </div>
  );
}

/* ----------------------------------------------
   AUTH SCREEN
---------------------------------------------- */
function AuthScreen({ setAuthUser, setScreen, setMyId }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState({ body: 'male_base.svg', face: 'none', hair: 'short_brown.svg', outfit: 'none' });
  const [success, setSuccess] = useState("");
  const meta = getMeta();

  async function handleAuth() {
    if(!email.trim()||!password.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    if(mode==="login") {
      const {data,error:e} = await supabase.auth.signInWithPassword({email,password});
      if(e) { setError("Email o password errati."); setLoading(false); return; }
      setAuthUser(data.user);
      await dbSaveUserMasterMeta(data.user);
      const savedId = (localStorage.getItem("eoz_myId") || "").trim();
      if(savedId) setMyId(savedId);
      setScreen("landing");
    } else {
      const {data,error:e} = await supabase.auth.signUp({email,password});
      if(e) { setError(e.message); setLoading(false); return; }
      if(data?.user) await dbSaveUserMasterMeta(data.user, new Date().toISOString());
      setSuccess("? Registrazione completata! Ora puoi accedere.");
      setMode("login");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", width:"100vw", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.32)" }} />
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", width:"100%", padding:"2rem 1rem" }}>
      <p style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>⚔ ZODAR ⚔</p>
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2rem,7vw,4rem)", margin:"0.2rem 0 2rem", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em" }}>
        {meta.worldName}
      </h1>
      <div style={{ width:"100%", maxWidth:400, background:"rgba(0,0,0,0.55)", border:"1px solid #374151", borderRadius:8, padding:"2rem" }}>
        <div style={{ display:"flex", gap:0, marginBottom:"1.5rem", border:"1px solid #1f2937", borderRadius:6, overflow:"hidden" }}>
          {[["login","🔐 Accedi"],["register","📝 Registrati"]].map(([k,l])=>(
            <button key={k} onClick={()=>{ setMode(k); setError(""); setSuccess(""); }}
              style={{ flex:1, padding:"0.6rem", background:mode===k?"rgba(109,40,217,0.3)":"transparent", border:"none", color:mode===k?"#c4b5fd":"#6b7280", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.8rem", letterSpacing:"0.05em" }}>
              {l}
            </button>
          ))}
        </div>
        <label style={labelStyle}>Email</label>
        <input style={{...inputStyle,marginBottom:12}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="la-tua@email.com" autoComplete="email" />
        <label style={labelStyle}>Password</label>
        <input style={{...inputStyle,marginBottom:16}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&handleAuth()} />
        {error && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(239,68,68,0.1)", border:"1px solid #7f1d1d", borderRadius:4 }}>{error}</div>}
        {success && <div style={{ color:"#6ee7b7", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(52,211,153,0.1)", border:"1px solid #065f46", borderRadius:4 }}>{success}</div>}
        <BigBtn onClick={handleAuth} gold disabled={loading} icon={mode==="login"?"🔑":"📝"}>
          {loading?"Attendere..." : mode==="login"?"Entra nel Mondo":"Crea Account"}
        </BigBtn>
        <button
          onClick={()=>setScreen("master")}
          style={{
            width:"100%",
            marginTop:"0.9rem",
            padding:"0.75rem 1rem",
            background:"rgba(15,23,42,0.92)",
            border:"1px solid #fbbf24",
            borderRadius:6,
            color:"#f8e7b9",
            cursor:"pointer",
            fontFamily:"'Cinzel',serif",
            fontSize:"0.84rem",
            letterSpacing:"0.06em",
            fontWeight:700,
          }}
        >
          🛡️ Accesso Master
        </button>
      </div>
      <div style={{ marginTop:"2rem", color:"rgba(148,163,184,0.45)", fontSize:"0.68rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.12em" }}>
        {GAME_VERSION}
      </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   MASTER PANEL AUTH WRAPPER
---------------------------------------------- */
function MasterPanelAuth({ setScreen, authUser }) {
  const [pwd, setPwd] = useState("");
  const [ok, setOk] = useState(() => canAccessMasterPanel(authUser));
  const [err, setErr] = useState(false);

  useEffect(() => {
    if(canAccessMasterPanel(authUser)) setOk(true);
  }, [authUser]);

  if(ok) return <MasterPanel setScreen={setScreen} authUser={authUser} />;

  return (
    <div style={{ minHeight:"100vh", width:"100vw", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.36)" }} />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:360, background:"rgba(0,0,0,0.55)", border:"1px solid #374151", borderRadius:8, padding:"2rem", textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🛡️</div>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", marginBottom:"0.5rem" }}>🛡️ Pannello Master</h2>
        <p style={{ color:"#9ca3af", fontSize:"0.78rem", marginBottom:"1.5rem" }}>Accesso riservato al Master</p>
        <label style={labelStyle}>Password Master</label>
        <input
          style={{...inputStyle,marginBottom:12,textAlign:"center",letterSpacing:"0.2em"}}
          type="password"
          value={pwd}
          onChange={e=>{ setPwd(e.target.value); setErr(false); }}
          placeholder="Password"
          onKeyDown={e=>{ if(e.key==="Enter"){ if(pwd===MASTER_PASSWORD){ _masterPasswordVerified=true; setOk(true); } else setErr(true); } }}
        />
        {err && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12 }}>Password errata.</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <BigBtn onClick={()=>{ if(pwd===MASTER_PASSWORD){ _masterPasswordVerified=true; setOk(true); } else setErr(true); }} gold icon="🗝️">Entra</BigBtn>
          <SmallBtn onClick={()=>setScreen("landing")}>← Torna alla home</SmallBtn>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   LANDING
---------------------------------------------- */
function FireEmbers() {
  const particles = useMemo(() => {
    const embers = Array.from({ length: 60 }, (_, i) => ({
      id: `e${i}`,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 6 + 4,
      delay: -(Math.random() * 14),
      drift: (Math.random() - 0.5) * 120,
      color: ["#ff6b00","#ef4444","#fbbf24","#f97316","#dc2626","#fb923c","#fde68a"][Math.floor(Math.random()*7)],
      opacity: Math.random() * 0.65 + 0.3,
    }));
    const ash = Array.from({ length: 18 }, (_, i) => ({
      id: `a${i}`,
      left: Math.random() * 100,
      size: Math.random() * 4 + 3,
      duration: Math.random() * 9 + 9,
      delay: -(Math.random() * 18),
      drift: (Math.random() - 0.5) * 180,
      color: `rgba(255,${140 + Math.floor(Math.random()*80)},${Math.floor(Math.random()*50)},${(Math.random()*0.25+0.1).toFixed(2)})`,
      opacity: Math.random() * 0.22 + 0.08,
    }));
    return [...embers, ...ash];
  }, []);

  return (
    <>
      <style>{`
        @keyframes riseEmber {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--op); }
          70%  { opacity: calc(var(--op) * 0.5); }
          100% { transform: translateY(-108vh) translateX(var(--dx)) scale(0.08); opacity: 0; }
        }
        @keyframes fireGlow {
          0%, 100% { opacity: 0.22; }
          50%       { opacity: 0.40; }
        }
        @keyframes fireGlowSide {
          0%, 100% { opacity: 0.14; }
          50%       { opacity: 0.28; }
        }
        @keyframes vignettePulse {
          0%, 100% { opacity: 0.72; }
          50%       { opacity: 0.82; }
        }
      `}</style>

      {/* Vignette angoli */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)",
        animation:"vignettePulse 6s ease-in-out infinite" }} />

      {/* Bagliore fuoco basso-centro */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, height:"35vh", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 50% 100%, rgba(180,45,0,0.42) 0%, rgba(120,20,0,0.18) 45%, transparent 72%)",
        animation:"fireGlow 2.8s ease-in-out infinite" }} />

      {/* Bagliore laterale sinistro */}
      <div style={{ position:"fixed", bottom:0, left:0, height:"50vh", width:"28vw", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 0% 100%, rgba(200,55,0,0.26) 0%, transparent 68%)",
        animation:"fireGlowSide 3.5s 0.8s ease-in-out infinite" }} />

      {/* Bagliore laterale destro */}
      <div style={{ position:"fixed", bottom:0, right:0, height:"50vh", width:"28vw", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 100% 100%, rgba(200,55,0,0.26) 0%, transparent 68%)",
        animation:"fireGlowSide 3.5s 1.9s ease-in-out infinite" }} />

      {/* Particelle */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position:"absolute",
            bottom:"-6px",
            left:`${p.left}%`,
            width:`${p.size}px`,
            height:`${p.size}px`,
            borderRadius:"50%",
            background: p.color,
            boxShadow:`0 0 ${p.size*2}px ${p.color}, 0 0 ${p.size*5}px ${p.color}`,
            "--op": p.opacity,
            "--dx": `${p.drift}px`,
            animation:`riseEmber ${p.duration}s ${p.delay}s linear infinite`,
          }} />
        ))}
      </div>
    </>
  );
}

function FallingLeaves() {
  const leafEmojis = ['🍃','🍂','🍁','🌿'];
  const leaves = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: Math.random() * 98,
    size: 10 + Math.random() * 12,
    emoji: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
    duration: 10 + Math.random() * 12,
    swayDuration: 2.2 + Math.random() * 2.8,
    delay: Math.random() * 20,
    sw: Math.round(18 + Math.random() * 44),   // sway amplitude px (dimensionless for calc)
    rot: Math.round(150 + Math.random() * 390), // total rotation deg (dimensionless for calc)
  })), []);

  return (
    <>
      <style>{`
        @keyframes leafFall {
          0%   { transform: translateY(-40px); opacity: 0; }
          5%   { opacity: 0.85; }
          93%  { opacity: 0.7; }
          100% { transform: translateY(115vh); opacity: 0; }
        }
        @keyframes leafSway {
          0%   { transform: translateX(0px) rotate(0deg); }
          20%  { transform: translateX(calc(var(--sw) * 1px)) rotate(calc(var(--rot) * 0.18deg)); }
          45%  { transform: translateX(calc(var(--sw) * -0.65px)) rotate(calc(var(--rot) * 0.42deg)); }
          65%  { transform: translateX(calc(var(--sw) * 0.85px)) rotate(calc(var(--rot) * 0.68deg)); }
          85%  { transform: translateX(calc(var(--sw) * -0.4px)) rotate(calc(var(--rot) * 0.88deg)); }
          100% { transform: translateX(calc(var(--sw) * 0.3px)) rotate(calc(var(--rot) * 1deg)); }
        }
      `}</style>
      {leaves.map(l => (
        <div key={l.id} style={{
          position:'fixed', left:`${l.left}%`, top:'-30px',
          pointerEvents:'none', zIndex:9990,
          animation:`leafFall ${l.duration}s ${l.delay}s linear infinite`,
        }}>
          <div style={{
            fontSize:`${l.size}px`, lineHeight:1,
            '--sw': l.sw, '--rot': l.rot,
            animation:`leafSway ${l.swayDuration}s ${l.delay}s ease-in-out infinite`,
            userSelect:'none',
          }}>{l.emoji}</div>
        </div>
      ))}
    </>
  );
}

function Landing({ setScreen, goGame, myId, authUser, setAuthUser }) {
  const meta = getMeta();
  const [characters, setCharacters] = useState([]);
  const [loadingChars, setLoadingChars] = useState(true);
  const [recoverId, setRecoverId] = useState("");
  const [recoverError, setRecoverError] = useState("");

  async function loadCharacters() {
    if(!authUser?.id) { setCharacters([]); setLoadingChars(false); return; }
    setLoadingChars(true);
    try {
      let nextCharacters = await dbGetAccountCharacters(authUser.id);
      // Recovery: if no characters found but localStorage has an ID, try to re-bind it
      if(!nextCharacters.length) {
        const savedId = (localStorage.getItem("eoz_myId") || "").trim();
        if(savedId) {
          const { data: orphan } = await supabase.from("players").select("*").eq("id", savedId).maybeSingle();
          if(orphan && !orphan.account_id) {
            await supabase.from("players").update({ account_id: authUser.id, updated_at: new Date().toISOString() }).eq("id", savedId);
            nextCharacters = await dbGetAccountCharacters(authUser.id);
          }
        }
      }
      debugCharacterFlow("character_list_refresh_result", {
        accountId: authUser.id,
        count: nextCharacters.length,
        ids: nextCharacters.map(ch => ch.id),
      });
      setCharacters(nextCharacters);
    } finally {
      setLoadingChars(false);
    }
  }

  useEffect(()=>{ loadCharacters(); }, [authUser?.id]);

  async function logout() {
    await supabase.auth.signOut();
    setAuthUser(null);
    localStorage.removeItem("eoz_myId");
  }

  async function handleDeleteCharacter(character) {
    if(!character?.id) return;
    if(!window.confirm(`Vuoi eliminare ${character.name}?\n\nQuesta azione è irreversibile.`)) return;
    if(!window.confirm(`⚠️ Sei sicuro?\n\n"${character.name}" verrà cancellato definitivamente insieme a tutti i suoi oggetti e progressi.`)) return;
    await dbDeleteCharacter(character.id);
    localStorage.removeItem(equipmentKey(character.id));
    if((localStorage.getItem("eoz_myId") || "").trim() === character.id) localStorage.removeItem("eoz_myId");
    await loadCharacters();
  }

  return (
    <div onClick={() => audioManager.playBGM("intro")} style={{ minHeight:"100vh", width:"100vw", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem 1rem", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(at 15% 50%, rgba(109,40,217,0.3) 0%, rgba(0,0,0,0) 55%), radial-gradient(at 85% 30%, rgba(109,40,217,0.2) 0%, rgba(0,0,0,0) 50%), rgba(0,0,0,0.42)" }} />
      <FireEmbers />
      <FallingLeaves />
      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
      {meta.logo
        ? <img src={meta.logo} alt="logo" style={{ maxWidth:260, maxHeight:160, objectFit:"contain", marginBottom:"1rem", filter:"drop-shadow(0 0 24px rgba(251,191,36,.5))" }} />
        : <p style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>⚔ ZODAR ⚔</p>
      }
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2.2rem,8vw,5rem)", margin:"0.2rem 0", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em", animation:"goldenGlow 4s ease-in-out infinite" }}>
        {meta.worldName}
      </h1>
      <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(0.65rem,2vw,0.85rem)", color:"#7c3aed", letterSpacing:"0.3em", textTransform:"uppercase", margin:"0.2rem 0 1.6rem" }}>{meta.worldSub}</p>

      <div style={{ width:"100%", maxWidth:940, background:"rgba(0,0,0,0.42)", border:"1px solid #374151", borderRadius:14, padding:"1.4rem", backdropFilter:"blur(8px)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:"1rem", flexWrap:"wrap" }}>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#f8e7b9", fontSize:"1.25rem" }}>Selezione Eroe</div>
            <div style={{ color:"#9ca3af", fontSize:"0.82rem" }}>Scegli quale eroe far varcare il portale.</div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <BigBtn onClick={()=>setScreen("create")} gold icon="🛠️">Nuovo Eroe</BigBtn>
            <BigBtn onClick={logout} dark icon="🚪">Esci</BigBtn>
            {canAccessMasterPanel(authUser) && <BigBtn onClick={()=>setScreen("master")} dark icon="🛡️">Pannello Master</BigBtn>}
          </div>
        </div>

        {loadingChars && <div style={{ color:"#9ca3af", padding:"2rem 0" }}>Caricamento personaggi...</div>}
        {!loadingChars && !characters.length && (
          <div style={{ color:"#9ca3af", padding:"2.5rem 1rem", border:"1px dashed #374151", borderRadius:10 }}>
            Nessun eroe su questo account. Crea la tua prima scheda.
          </div>
        )}
        {!loadingChars && !!characters.length && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12, textAlign:"left" }}>
            {characters.map(ch=>{
              const cls = CLASSES[ch.class || "warrior"] || CLASSES.warrior;
              const race = RACES[ch.race || "human"] || RACES.human;
              const dead = !!ch.dead;
              const status = dead ? "Morto" : (ch.hp || 0) > 0 ? "Pronto" : "Ferito";
              return (
                <div key={ch.id} style={{ background:dead?"rgba(38,10,10,0.66)":"rgba(15,23,42,0.72)", border:`1px solid ${dead?"#7f1d1d":"#334155"}`, borderRadius:12, padding:"1rem", boxShadow:"0 14px 34px rgba(0,0,0,0.22)" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                    <ArtThumb src={getPlayerPortrait(ch)} alt={ch.name} size={72} radius={18} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:"'Cinzel',serif", color:dead?"#fca5a5":"#f8fafc", fontWeight:700, fontSize:"1rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ch.name}</div>
                      <div style={{ color:"#9ca3af", fontSize:"0.74rem" }}>{race.emoji} {race.name} • {cls.emoji} {cls.name}</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                        <span style={{ padding:"2px 8px", borderRadius:999, background:dead?"rgba(127,29,29,0.45)":"rgba(51,65,85,0.62)", color:dead?"#fecaca":"#cbd5e1", fontSize:"0.68rem" }}>{status}</span>
                        <span style={{ padding:"2px 8px", borderRadius:999, background:"rgba(91,33,182,0.35)", color:"#ddd6fe", fontSize:"0.68rem" }}>Lv.{ch.level || 1}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:10, fontSize:"0.74rem", color:"#94a3b8", marginBottom:10 }}>
                    <span>❤️ {ch.hp}/{ch.maxHp}</span>
                    <span>💰 {ch.gold || 0} oro</span>
                    <span>👥 {ch.partyCode || "-"}</span>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                    {!dead && <BigBtn onClick={()=>goGame(ch)} gold icon="⚔️">Gioca</BigBtn>}
                    <SmallBtn red onClick={()=>handleDeleteCharacter(ch)}>🗑️ Elimina</SmallBtn>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recupero personaggio per ID */}
      <div style={{ marginTop:"1rem", width:"100%", maxWidth:940, background:"rgba(0,0,0,0.32)", border:"1px solid #1f2937", borderRadius:10, padding:"0.85rem 1.2rem", backdropFilter:"blur(6px)" }}>
        <div style={{ color:"#64748b", fontSize:"0.74rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.06em", marginBottom:8 }}>🔍 Recupera personaggio per ID</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <input
            value={recoverId}
            onChange={e=>{ setRecoverId(e.target.value.trim()); setRecoverError(""); }}
            onKeyDown={e=>{ if(e.key==="Enter" && recoverId) goGame(recoverId).catch(err=>setRecoverError(err?.message||"Errore")); }}
            placeholder="Incolla qui l'ID del personaggio (chiedi al Master)"
            style={{ flex:"1 1 280px", padding:"0.5rem 0.75rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6, color:"#e2e8f0", fontSize:"0.8rem", outline:"none" }}
          />
          <button
            onClick={async ()=>{ if(!recoverId){ setRecoverError("Inserisci un ID."); return; } try{ await goGame(recoverId); }catch(e){ setRecoverError(e?.message||"ID non trovato o non valido."); } }}
            style={{ padding:"0.5rem 1rem", background:"rgba(109,40,217,0.3)", border:"1px solid #7c3aed", borderRadius:6, color:"#c4b5fd", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", whiteSpace:"nowrap" }}>
            Recupera →
          </button>
        </div>
        {recoverError && <div style={{ color:"#fca5a5", fontSize:"0.74rem", marginTop:6 }}>{recoverError}</div>}
      </div>

      {authUser && <p style={{ marginTop:"1rem", color:"#64748b", fontSize:"0.72rem" }}>Connesso come {authUser.email}</p>}
      <p style={{ marginTop:"1.5rem", color:"#1f2937", fontSize:"0.7rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.12em" }}>GDR TESTUALE • FANTASY • MULTIPLAYER ONLINE</p>
      <p style={{ marginTop:"0.5rem", color:"rgba(148,163,184,0.4)", fontSize:"0.65rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.14em" }}>{GAME_VERSION}</p>
      <a href="https://paypal.me/echoesofzodar" target="_blank" rel="noopener noreferrer"
        style={{ marginTop:"0.6rem", color:"rgba(148,163,184,0.35)", fontSize:"0.62rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.1em", textDecoration:"none" }}
        onMouseEnter={e=>e.currentTarget.style.color="rgba(251,191,36,0.7)"}
        onMouseLeave={e=>e.currentTarget.style.color="rgba(148,163,184,0.35)"}>
        ❤️ Supporta il progetto
      </a>
      </div>{/* /zIndex wrapper */}
    </div>
  );
}

/* ----------------------------------------------
   CREATE CHARACTER
---------------------------------------------- */
function CreateChar({ setScreen, goGame, authUser }) {
  const [name, setName] = useState("");
  const [realPlayerName, setRealPlayerName] = useState("");
  const [cls,  setCls]  = useState("warrior");
  const [race, setRace] = useState("human");
  const [gender, setGender] = useState("male");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [secretUnlocked, setSecretUnlocked] = useState(() => localStorage.getItem(SECRET_UNLOCK_KEY) === "1");
  const [secretError, setSecretError] = useState(false);
  const c = CLASSES[cls]; const r = RACES[race];

  function tryUnlock() {
    if (secretInput.trim().toLowerCase() === SECRET_PASSWORD) {
      localStorage.setItem(SECRET_UNLOCK_KEY, "1");
      setSecretUnlocked(true);
      setSecretError(false);
      setSecretInput("");
    } else {
      setSecretError(true);
      setTimeout(() => setSecretError(false), 2000);
    }
  }

  async function create() {
    if(!name.trim() || !realPlayerName.trim() || loading) return;
    setLoading(true);
    try {
      debugCharacterFlow("create_start", { accountId: authUser?.id || null, name: name.trim(), realPlayerName: realPlayerName.trim(), class: cls, race });
      const id = `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
      const partyCode = code.trim().toUpperCase() || Math.random().toString(36).slice(2,6).toUpperCase();
      const maxHp = c.hp + r.hpB;
      const player = {
        id, name:name.trim(), class:cls, race:race, gender:gender, partyCode,
        accountId: authUser?.id || null,
        hp:maxHp, maxHp, atk:c.atk+r.atkB, def:c.def+r.defB,
        mag:c.mag+r.magB, init:c.init+r.initB,
        xp:0, level:1, gold:20, dead:false,
      };
      debugCharacterFlow("create_player_generated", player);
      debugCharacterFlow("save_attempt", { id: player.id, accountId: player.accountId, partyCode: player.partyCode });
      const { error: saveError, data: savedPlayer } = await dbSavePlayer(player);
      debugCharacterFlow("save_result", {
        requestedId: player.id,
        savedId: savedPlayer?.id || null,
        accountId: savedPlayer?.account_id || null,
        dead: savedPlayer?.dead ?? null,
        error: saveError?.message || null,
      });
      if(saveError || !savedPlayer?.id) throw saveError || new Error("Salvataggio personaggio fallito");
      await dbAddPlayerItem(savedPlayer.id, "weapon_moonfork_dagger");
      await dbAddPlayerItem(savedPlayer.id, "potion_full_heal", 2);
      await dbAddPlayerItem(savedPlayer.id, "potion_escape", 2);
      saveStoredCharacterGender(savedPlayer.id, gender);
      await dbSavePlayerMasterMeta({
        playerId: savedPlayer.id,
        partyCode,
        heroName: player.name,
        realPlayerName: realPlayerName.trim(),
      });
      const charactersAfterSave = authUser?.id ? await dbGetAccountCharacters(authUser.id) : [];
      debugCharacterFlow("character_list_after_save", {
        accountId: authUser?.id || null,
        count: charactersAfterSave.length,
        ids: charactersAfterSave.map(ch => ch.id),
      });
      const meta = getMeta();
      await dbSendMessage({ party_code:partyCode, author:"Sistema", type:"system",
        content:`⚔️ **${player.name} il ${c.name}** è entrato nel mondo di **${meta.worldName}**! ${c.emoji}` });
      await goGame({
        id: savedPlayer.id,
        dead: !!savedPlayer.dead,
        accountId: savedPlayer.account_id || authUser?.id || null,
      });
    } catch(e) {
      debugCharacterFlow("create_failure", { error: e?.message || String(e) });
      console.error("Errore creazione personaggio:", e);
      alert(`Creazione personaggio fallita.\n\nMotivo: ${e?.message || "errore sconosciuto"}`);
    } finally {
      setLoading(false);
    }
  }

  const canContinueFromName = name.trim() && realPlayerName.trim();
  const steps = ["Nomi","Classe","Razza e Genere","Party"];
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
        <Card title="✏️ Nomi dell'eroe e del giocatore">
          <label style={labelStyle}>Nome dell'eroe</label>
          <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Il nome del tuo eroe..." maxLength={24} autoFocus onKeyDown={e=>e.key==="Enter"&&canContinueFromName&&setStep(1)} />
          <label style={{...labelStyle, marginTop:"0.9rem"}}>Nome e cognome del giocatore</label>
          <input style={inputStyle} value={realPlayerName} onChange={e=>setRealPlayerName(e.target.value)} placeholder="Es: Mario Rossi" maxLength={60} onKeyDown={e=>e.key==="Enter"&&canContinueFromName&&setStep(1)} />
          <p style={{ color:"#94a3b8", fontSize:"0.76rem", margin:"8px 0 0", lineHeight:1.5 }}>
            Serve solo al Master per riconoscere e organizzare tavoli, party e ricompense. Gli altri giocatori vedranno solo il nome dell'eroe.
          </p>
          <div style={{ marginTop:"1rem" }}><BigBtn onClick={()=>canContinueFromName&&setStep(1)} gold disabled={!canContinueFromName}>Avanti →</BigBtn></div>
        </Card>
      )}
      {step===1 && (
        <Card title="⚔️ Scegli la tua Classe">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
            {Object.entries(CLASSES).filter(([,v]) => !v._secret || secretUnlocked).map(([k,v])=>(
              <button key={k} onClick={()=>setCls(k)} style={{ padding:"0.8rem 0.5rem", background:cls===k?`${v.color}30`:"rgba(255,255,255,0.03)", border:`2px solid ${cls===k?v.color:v._secret?"#4b0082":"#1f2937"}`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4, position:"relative" }}>
                {v._secret && <span style={{ position:"absolute", top:4, right:4, fontSize:"0.5rem", color:"#a78bfa", fontFamily:"'Cinzel',serif", letterSpacing:"0.05em" }}>✦ SEGRETO</span>}
                <span style={{ fontSize:"1.8rem", filter:v._secret?"drop-shadow(0 0 6px #a78bfa)":"none" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:cls===k?v.color:v._secret?"#c4b5fd":"#d1d5db", fontSize:"0.82rem" }}>{v.name}</strong>
                {cls===k && <div style={{ fontSize:"0.62rem", color:"#9ca3af", textAlign:"center" }}>❤️{v.hp} ⚔️{v.atk} 🛡️{v.def} ✨{v.mag}</div>}
              </button>
            ))}
          </div>
          {!secretUnlocked && (
            <div style={{ marginTop:"1rem", padding:"0.8rem", background:"rgba(109,40,217,0.08)", border:"1px solid #3b1f6e", borderRadius:8 }}>
              <div style={{ color:"#7c3aed", fontSize:"0.72rem", fontFamily:"'Cinzel',serif", marginBottom:6 }}>🔒 Classi e Razze Segrete</div>
              <div style={{ display:"flex", gap:6 }}>
                <input
                  value={secretInput}
                  onChange={e=>setSecretInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&tryUnlock()}
                  placeholder="Inserisci la parola d'ordine..."
                  style={{ flex:1, padding:"0.4rem 0.6rem", background:"rgba(0,0,0,0.4)", border:`1px solid ${secretError?"#ef4444":"#3b1f6e"}`, borderRadius:6, color:"#e2d9c5", fontSize:"0.78rem", outline:"none" }}
                />
                <button onClick={tryUnlock} style={{ padding:"0.4rem 0.8rem", background:"rgba(109,40,217,0.25)", border:"1px solid #7c3aed", borderRadius:6, color:"#c4b5fd", cursor:"pointer", fontSize:"0.78rem" }}>
                  Sblocca
                </button>
              </div>
              {secretError && <div style={{ color:"#ef4444", fontSize:"0.7rem", marginTop:4 }}>Parola d'ordine errata.</div>}
            </div>
          )}
          {secretUnlocked && (
            <div style={{ marginTop:"0.5rem", color:"#a78bfa", fontSize:"0.7rem", fontFamily:"'Cinzel',serif" }}>✦ Classi e razze segrete sbloccate</div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(0)}>← Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(2)} gold>Avanti →</BigBtn>
          </div>
        </Card>
      )}
      {step===2 && (
        <Card title="🌍 Scegli Razza e Genere">
          {RACES[race]?._femaleOnly ? (
            <div style={{ padding:"0.6rem 0.8rem", background:"rgba(236,72,153,0.12)", border:"1px solid #f472b6", borderRadius:8, marginBottom:"1rem", color:"#fbcfe8", fontSize:"0.78rem", fontFamily:"'Cinzel',serif" }}>
              😈 La razza <strong>{RACES[race].name}</strong> è esclusivamente femminile.
            </div>
          ) : (
            <div style={{ display:"flex", gap:"1rem", marginBottom:"1rem" }}>
              <button onClick={()=>setGender("male")} style={{ flex:1, padding:"0.8rem", background:gender==="male"?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${gender==="male"?"#60a5fa":"#1f2937"}`, borderRadius:6, cursor:"pointer", color:gender==="male"?"#bfdbfe":"#9ca3af", fontFamily:"'Cinzel',serif" }}>♂️ Maschile</button>
              <button onClick={()=>setGender("female")} style={{ flex:1, padding:"0.8rem", background:gender==="female"?"rgba(236,72,153,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${gender==="female"?"#f472b6":"#1f2937"}`, borderRadius:6, cursor:"pointer", color:gender==="female"?"#fbcfe8":"#9ca3af", fontFamily:"'Cinzel',serif" }}>♀️ Femminile</button>
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8 }}>
            {Object.entries(RACES).filter(([,v]) => !v._secret || secretUnlocked).map(([k,v])=>(
              <button key={k} onClick={()=>{ setRace(k); if(v._femaleOnly) setGender("female"); }} style={{ padding:"0.7rem 0.4rem", background:race===k?`rgba(109,40,217,0.3)`:"rgba(255,255,255,0.03)", border:`2px solid ${race===k?"#a78bfa":v._secret?"#4b0082":"#1f2937"}`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3, position:"relative" }}>
                {v._secret && <span style={{ position:"absolute", top:3, right:3, fontSize:"0.45rem", color:"#a78bfa", fontFamily:"'Cinzel',serif" }}>✦</span>}
                {v._femaleOnly && <span style={{ position:"absolute", top:3, left:3, fontSize:"0.45rem", color:"#f472b6" }}>♀</span>}
                <span style={{ fontSize:"1.5rem", filter:v._secret?"drop-shadow(0 0 5px #a78bfa)":"none" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:v._secret?"#c4b5fd":"#d1d5db", fontSize:"0.78rem" }}>{v.name}</strong>
                {race===k && <small style={{ fontSize:"0.6rem", color:"#a78bfa", textAlign:"center", lineHeight:1.3 }}>
                  {[v.hpB&&`+${v.hpB}HP`,v.atkB&&`+${v.atkB}ATK`,v.defB&&`+${v.defB}DEF`,v.magB&&`+${v.magB}MAG`].filter(Boolean).join(" ")||"Versatile"}
                </small>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(1)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(3)} gold>Avanti ⏩</BigBtn>
          </div>
        </Card>
      )}
      {step===3 && (
        <Card title="👥 Conferma Eroe & Party">
          <div style={{ background:"rgba(10,14,23,0.8)", border:"1px solid #374151", borderRadius:6, padding:"1.2rem", marginBottom:"1rem", display:"flex", flexDirection:"column", alignItems:"center", gap:15 }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fbbf24', boxShadow: '0 0 20px rgba(251,191,36,0.3)', backgroundColor: '#000', position:'relative' }}>
              <img key={`${cls}-${race}-${gender}`}
                src={RACES[race]?._secret ? getRacePortraitPath(race, gender) : getPortraitPath(cls, race, gender)}
                alt={`${RACES[race].name} ${c.name} ${gender === "female" ? "femmina" : "maschio"}`}
                onError={(e)=>{
                  const racePort = getRacePortraitPath(race, gender);
                  const clsPort  = getClassPortraitPath(cls, gender);
                  if(!e.currentTarget.src.includes(`${race}_${gender}`)) { e.currentTarget.src = racePort; }
                  else if(!e.currentTarget.src.includes(`${cls}_${gender}`)) { e.currentTarget.src = clsPort; }
                  else { e.currentTarget.onerror = null; }
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontSize: "1.4rem", fontWeight:700 }}>{name||"Senza Nome"}</div>
              <div style={{ color:"#cbd5e1", fontSize:"0.9rem", margin: '4px 0' }}>{RACES[race].emoji} {RACES[race].name} • {c.emoji} {c.name}</div>
              <div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>❤️{c.hp+r.hpB} ⚔️{c.atk+r.atkB} 🛡️{c.def+r.defB} ✨{c.mag+r.magB}</div>
            </div>
          </div>
          <label style={labelStyle}>Codice Stanza Multiplayer</label>
          <input style={inputStyle} value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Es: DRAGON8" maxLength={8} />
          <p style={{ color:"#64748b", fontSize:"0.75rem", margin:"6px 0 0", lineHeight:1.5 }}>Se giochi da solo, lascia vuoto. Se giochi con amici, inserite tutti lo stesso codice.</p>
          <div style={{ display:"flex", gap:8, marginTop:"1.5rem" }}>
            <SmallBtn onClick={()=>setStep(2)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={create} gold icon="⭐" disabled={loading}>{loading?"Creazione in corso...":"Conferma ed Entra"}</BigBtn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ----------------------------------------------
   MASTER PANEL
---------------------------------------------- */
function MasterPanel({ setScreen, authUser }) {
  const [tab, setTab]       = useState("world");
  const [meta, setMeta]     = useState(getMeta());
  const [quests, setQuests] = useState(getQuests());
  const [monsters, setMonsters] = useState(getMonsters());
  const [editQ, setEditQ]   = useState(null);
  const [editM, setEditM]   = useState(null);
  const [saved, setSaved]   = useState(false);
  const [newStep, setNewStep] = useState("");
  const [dmBroadcast, setDmBroadcast] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [masterLogs, setMasterLogs] = useState([]);
  const [questSearch, setQuestSearch] = useState("");
  const [questDifficultyFilter, setQuestDifficultyFilter] = useState("all");
  const [monsterSearch, setMonsterSearch] = useState("");
  const [monsterTierFilter, setMonsterTierFilter] = useState("all");
  const [refreshingQuests, setRefreshingQuests] = useState(false);
  const [refreshingShop, setRefreshingShop] = useState(false);
  const [healingAll, setHealingAll] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceBusy, setMaintenanceBusy] = useState(false);
  const [maintenanceInput, setMaintenanceInput] = useState("");
  const [patchNotesInput, setPatchNotesInput] = useState("");
  const [masterParties, setMasterParties] = useState([]);

  useEffect(() => {
    dbGetMaintenanceMode().then(setMaintenance);
    supabase.from("party_state").select("party_code").then(({ data }) => {
      setMasterParties((data || []).map(r => r.party_code).filter(c => !["__world_guilds__","__world__","__master__","__maintenance__","__story_library__"].includes(c)));
    });
  }, []);

  async function refreshAllQuestSeeds() {
    if(refreshingQuests) return;
    if(!window.confirm("Aggiornare la rotazione missioni per tutti i party attivi?\n\nI giocatori vedranno un nuovo set di missioni giornaliere.")) return;
    setRefreshingQuests(true);
    try {
      const { data } = await supabase.from("party_state").select("*");
      for(const row of (data || [])) {
        const state = await dbGetPartyState(row.party_code);
        await dbSavePartyState(row.party_code, { ...state, longRestSeed: (state.longRestSeed || 0) + 1 });
      }
    } catch(e) {
      alert("Errore aggiornamento missioni: " + (e?.message || e));
    } finally {
      setRefreshingQuests(false);
    }
  }

  async function refreshShopInventory() {
    if(refreshingShop) return;
    if(!window.confirm("Aggiornare la rotazione del negozio per tutti i party attivi?\n\nI giocatori vedranno nuovi oggetti disponibili.")) return;
    setRefreshingShop(true);
    try {
      const { data } = await supabase.from("party_state").select("*");
      for(const row of (data || [])) {
        const state = await dbGetPartyState(row.party_code);
        await dbSavePartyState(row.party_code, { ...state, longRestSeed: (state.longRestSeed || 0) + 1 });
      }
    } catch(e) {
      alert("Errore aggiornamento negozio: " + (e?.message || e));
    } finally {
      setRefreshingShop(false);
    }
  }

  async function healAllPlayers() {
    if(healingAll) return;
    if(!window.confirm("Curare tutti i giocatori di tutti i party al massimo degli HP?")) return;
    setHealingAll(true);
    try {
      const { data } = await supabase.from("party_state").select("party_code");
      for(const row of (data || [])) {
        const players = await dbGetPlayers(row.party_code);
        for(const p of players) {
          if((p.hp || 0) < (p.maxHp || 0)) {
            await dbSavePlayer({ ...p, hp: p.maxHp });
          }
        }
      }
      alert("Tutti i giocatori sono stati curati!");
    } catch(e) {
      alert("Errore cura: " + (e?.message || e));
    } finally {
      setHealingAll(false);
    }
  }

  function saveAll() {
    saveMeta(meta); saveQuests(quests); saveMonsters(monsters);
    setSaved(true); setTimeout(()=>setSaved(false), 2200);
  }
  function handleLogo(e) {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>setMeta(m=>({...m,logo:ev.target.result})); r.readAsDataURL(f);
  }
  function addQuest() {
    const q={id:"q_"+Date.now(),title:"Nuova Missione",desc:"",flavor:"",difficulty:"medio",specialPassword:"",xpReward:200,goldReward:100,steps:[],enemies:[],active:true};
    setQuests(prev=>[...prev,q]); setEditQ({...q});
  }
  function addSpecialQuest() {
    const q={id:"sq_"+Date.now(),title:"Missione Speciale",desc:"",flavor:"",difficulty:"speciale",specialPassword:"",xpReward:500,goldReward:250,steps:[],enemies:[],active:true};
    setQuests(prev=>[...prev,q]); setEditQ({...q});
  }
  function saveEditQ() {
    const rawDifficulty = String(editQ?.difficulty || "").trim().toLowerCase();
    const savedDifficulty = rawDifficulty === "speciale" ? "speciale" : normalizeMissionDifficulty(editQ?.difficulty);
    const normalizedQuest = normalizeQuest({ ...editQ, difficulty: savedDifficulty });
    setQuests(prev=>prev.map(x=>x.id===normalizedQuest.id ? normalizedQuest : x));
    setEditQ(null);
  }
  function addStepToQ() {
    if(!newStep.trim()) return;
    setEditQ(q=>({...q,steps:[...q.steps,{ text:newStep.trim(), choices:{ good:{}, neutral:{}, bad:{} } }]}));
    setNewStep("");
  }
  function addEnemyToQ(monster) {
    const maxHp = monster.maxHp || monster.hp;
    const xp = monsterXpValue({ ...monster, maxHp });
    setEditQ(q=>({...q,enemies:[...q.enemies,{...monster,maxHp,xp,id:"e_"+Date.now()}]}));
  }
  function addMonster() {
    const m={id:"m_"+Date.now(),name:"Nuova Creatura",emoji:"🧩",hp:30,atk:8,def:3,xp:20,desc:"",isBoss:false};
    m.xp = monsterXpValue(m);
    setMonsters(prev=>[...prev,m]); setEditM({...m});
  }
  function saveEditM() {
    const normalized = { ...editM, xp: monsterXpValue(editM) };
    setMonsters(prev=>prev.map(x=>x.id===normalized.id?normalized:x));
    setEditM(null);
  }
  function syncDefaultQuests() {
    const current = quests.map(normalizeQuest);
    const currentIds = new Set(current.map(q => q.id));
    const missing = DEFAULT_QUESTS.map(normalizeQuest).filter(q => !currentIds.has(q.id));
    if(missing.length) setQuests([...current, ...missing]);
  }
  function syncDefaultMonsters() {
    const currentIds = new Set(monsters.map(m => m.id));
    const missing = DEFAULT_MONSTERS.filter(m => !currentIds.has(m.id));
    if(missing.length) setMonsters([...monsters, ...missing]);
  }
  async function sendDungeonMasterBroadcast() {
    const content = dmBroadcast.trim();
    if(!content || broadcasting) return;
    setBroadcasting(true);
    try {
      const players = await dbGetPlayers();
      const partyCodes = Array.from(new Set(players.map(player => player.partyCode).filter(Boolean)));
      for(const partyCode of partyCodes) {
        await dbSendMessage({ party_code:partyCode, author:"Dungeon Master", content, type:"narration" });
      }
      setDmBroadcast("");
    } finally {
      setBroadcasting(false);
    }
  }

  useEffect(()=>{
    if(tab !== "chat") return;
    let alive = true;
    const loadLogs = async () => {
      const msgs = await dbGetMessages();
      if(!alive) return;
      setMasterLogs(
        msgs
          .filter(msg => ["info","system"].includes(msg.type))
          .slice(-80)
          .reverse()
      );
    };
    loadLogs();
    const timer = setInterval(loadLogs, 5000);
    return ()=>{ alive = false; clearInterval(timer); };
  }, [tab]);

  const TABS = [{k:"world",l:"🌍 Mondo"},{k:"quests",l:"📜 Missioni"},{k:"questbuilder",l:"⚔️ Quest Builder"},{k:"stories",l:"📖 Storie"},{k:"editor",l:"✏️ Editor"},{k:"monsters",l:"👾 Bestiari"},{k:"players",l:"👥 Giocatori"},{k:"party",l:"🏰 Party"},{k:"dungeon",l:"🗺️ Dungeon"},{k:"guilds",l:"🏛️ Gilde"},{k:"worldevent",l:"🌋 Evento Mondiale"},{k:"leaderboard",l:"🏆 Classifiche"},{k:"chat",l:"📣 Broadcast"},{k:"market",l:"🏪 Market"},{k:"online",l:"👁️ Online"},{k:"users",l:"📊 Report"}];
  const EMOJIS=["🗡️","🛡️","🏹","🪄","🔮","💀","🧌","🐉","🧛","💪","⚔️","⭐","🐺","🦅","🌿","🔥","🧙","👹","🗿","😈"];
  const visibleQuests = quests.filter(q => {
    const term = questSearch.trim().toLowerCase();
    const diff = normalizeMissionDifficulty(q.difficulty);
    const matchesTerm = !term || [q.title, q.desc, q.flavor, q.id].some(value => String(value || "").toLowerCase().includes(term));
    const matchesDiff = questDifficultyFilter === "all" || diff === questDifficultyFilter || (questDifficultyFilter === "speciale" && !!q.specialPassword) || (questDifficultyFilter === "locked" && !!q.specialPassword);
    return matchesTerm && matchesDiff;
  });
  const visibleMonsters = monsters.filter(m => {
    const term = monsterSearch.trim().toLowerCase();
    const tier = monsterThreatTier(m);
    const matchesTerm = !term || [m.name, m.desc, m.id].some(value => String(value || "").toLowerCase().includes(term));
    const matchesTier = monsterTierFilter === "all" || tier === monsterTierFilter;
    return matchesTerm && matchesTier;
  });

  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:1180, margin:"0 auto", padding:"1rem", background:"rgba(5,8,18,0.92)", minHeight:"100vh" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.2rem", paddingBottom:"1rem", borderBottom:"1px solid #1f2937", flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.4rem", margin:0 }}>🛡️ Pannello Master</h1>
          <p style={{ color:"#94a3b8", fontSize:"0.78rem", margin:0 }}>Gestisci missioni, creature e contenuti del mondo</p>
        </div>
        <BigBtn onClick={saveAll} gold icon={saved?"?":"⭐"}>{saved?"Salvato!":"Salva tutto"}</BigBtn>
        <SmallBtn onClick={()=>setScreen("landing")}>← Torna al menu</SmallBtn>
      </div>
      {!canAccessMasterPanel(authUser) && (
        <div style={{ background:"rgba(127,29,29,0.88)", border:"1px solid #fca5a5", color:"#fff1f2", borderRadius:6, padding:"0.85rem 1rem", marginBottom:"1rem", fontSize:"0.86rem", lineHeight:1.45 }}>
          <strong>Accesso Master parziale.</strong> La password apre il pannello, ma per vedere e spostare i personaggi devi accedere al sito con l'account email Master autorizzato. Senza quella sessione Supabase la lista giocatori puo' risultare vuota.
        </div>
      )}
      <div style={{ display:"flex", gap:6, marginBottom:"1.2rem", flexWrap:"wrap" }}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>{ setEditQ(null); setEditM(null); setTab(t.k); }}
            style={{ padding:"0.5rem 1.1rem", background:tab===t.k?"#4c1d95":"rgba(15,23,42,0.92)", border:`1px solid ${tab===t.k?"#c4b5fd":"#64748b"}`, borderRadius:4, color:tab===t.k?"#ffffff":"#e2e8f0", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", letterSpacing:"0.05em", fontWeight:700, boxShadow:tab===t.k?"0 0 0 1px rgba(196,181,253,0.2), 0 8px 20px rgba(76,29,149,0.32)":"0 6px 16px rgba(0,0,0,0.2)", textShadow:"0 1px 2px rgba(0,0,0,0.75)" }}>
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
          <Card title="🎲 Missioni Giornaliere">
            <p style={{ color:"#94a3b8", fontSize:"0.82rem", margin:"0 0 1rem" }}>
              Le missioni e il negozio ruotano in base alla data + un seme interno. Se i giocatori li esauriscono durante i test, premi qui per caricare un nuovo set senza aspettare il giorno dopo.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <BigBtn onClick={refreshAllQuestSeeds} gold icon="🔄" disabled={refreshingQuests}>
                {refreshingQuests ? "Aggiornamento…" : "Aggiorna Missioni"}
              </BigBtn>
              <BigBtn onClick={refreshShopInventory} gold icon="🛒" disabled={refreshingShop}>
                {refreshingShop ? "Aggiornamento…" : "Aggiorna Negozio"}
              </BigBtn>
              <BigBtn onClick={healAllPlayers} icon="💚" disabled={healingAll}>
                {healingAll ? "Cura in corso…" : "Cura Tutti"}
              </BigBtn>
            </div>
          </Card>

          <Card title="🔧 Manutenzione">
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background: maintenance ? "#ef4444" : "#22c55e", boxShadow: maintenance ? "0 0 8px #ef4444" : "0 0 8px #22c55e", flexShrink:0 }} />
              <span style={{ color: maintenance ? "#fca5a5" : "#86efac", fontWeight:700, fontSize:"0.88rem" }}>
                {maintenance ? "Gioco CHIUSO — manutenzione attiva" : "Gioco APERTO — tutto regolare"}
              </span>
            </div>
            <label style={labelStyle}>Messaggio ai giocatori durante la manutenzione (opzionale)</label>
            <input
              style={{ ...inputStyle, marginBottom:"1rem" }}
              value={maintenanceInput}
              onChange={e => setMaintenanceInput(e.target.value)}
              placeholder="es. Aggiornamento in corso, torniamo tra 10 minuti…"
            />
            <label style={labelStyle}>📋 Patch Notes — mostrate ai giocatori alla riapertura</label>
            <textarea
              style={{ ...inputStyle, marginBottom:"1rem", minHeight:100, resize:"vertical", fontFamily:"monospace", fontSize:"0.82rem" }}
              value={patchNotesInput}
              onChange={e => setPatchNotesInput(e.target.value)}
              placeholder={"• Nuovi oggetti leggendari\n• Fix cura di massa\n• Armi a distanza usano DES\n• Visualizzatore combattimento"}
            />
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button
                disabled={maintenanceBusy || maintenance}
                onClick={async () => {
                  if(!window.confirm("Metti il gioco in manutenzione?\nTutti i giocatori vedranno un overlay bloccante.")) return;
                  setMaintenanceBusy(true);
                  try {
                    await dbSetMaintenanceMode(true, maintenanceInput.trim(), patchNotesInput.trim());
                    setMaintenance(true);
                  } catch(e) { alert("Errore manutenzione: " + (e?.message || e)); }
                  setMaintenanceBusy(false);
                }}
                style={{ padding:"0.7rem 1.4rem", background: maintenance ? "rgba(100,100,100,0.2)" : "linear-gradient(135deg,#7f1d1d,#dc2626)", border:"1px solid #ef4444", borderRadius:8, color:"#fee2e2", fontFamily:"'Cinzel',serif", fontSize:"0.88rem", cursor: maintenance ? "not-allowed" : "pointer", fontWeight:700, opacity: maintenance ? 0.4 : 1 }}>
                🔴 Metti in Manutenzione
              </button>
              <button
                disabled={maintenanceBusy || !maintenance}
                onClick={async () => {
                  setMaintenanceBusy(true);
                  try {
                    await dbSetMaintenanceMode(false, "", patchNotesInput.trim());
                    setMaintenance(false);
                  } catch(e) { alert("Errore riapertura: " + (e?.message || e)); }
                  setMaintenanceBusy(false);
                }}
                style={{ padding:"0.7rem 1.4rem", background: !maintenance ? "rgba(100,100,100,0.2)" : "linear-gradient(135deg,#14532d,#16a34a)", border:"1px solid #22c55e", borderRadius:8, color:"#dcfce7", fontFamily:"'Cinzel',serif", fontSize:"0.88rem", cursor: !maintenance ? "not-allowed" : "pointer", fontWeight:700, opacity: !maintenance ? 0.4 : 1 }}>
                🟢 Riapri il Gioco
              </button>
            </div>
          </Card>
        </div>
      )}

      {tab==="chat" && (
        <div style={{ display:"grid", gap:"1rem" }}>
          <Card title="📣 Messaggio ai Giocatori">
            <p style={{ color:"#9ca3af", fontSize:"0.8rem", margin:"0 0 0.9rem" }}>Invia un messaggio narrativo a tutti i party attivi. Ai giocatori apparirà come autore <strong style={{ color:"#e2d9c5" }}>Dungeon Master</strong>.</p>
            <textarea
              style={{...inputStyle,height:120,resize:"vertical"}}
              value={dmBroadcast}
              onChange={e=>setDmBroadcast(e.target.value)}
              placeholder="Scrivi il messaggio del Dungeon Master..."
            />
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"0.9rem" }}>
              <BigBtn onClick={sendDungeonMasterBroadcast} gold icon="📨" disabled={!dmBroadcast.trim() || broadcasting}>
                {broadcasting ? "Invio..." : "Invia a tutti"}
              </BigBtn>
            </div>
          </Card>
          <Card title="🧾 Log Tecnici">
            <p style={{ color:"#9ca3af", fontSize:"0.8rem", margin:"0 0 0.9rem" }}>Qui finiscono i messaggi filtrati dal player chat: economia, equipaggiamento e log di sistema.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:360, overflowY:"auto" }}>
              {!masterLogs.length && <div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Nessun log tecnico recente.</div>}
              {masterLogs.map(msg=>(
                <div key={msg.id} style={{ background:"rgba(15,23,42,0.76)", border:"1px solid #1e293b", borderRadius:6, padding:"0.75rem 0.85rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ color:"#a5b4fc", fontFamily:"'Cinzel',serif", fontSize:"0.72rem", letterSpacing:"0.05em" }}>{msg.author || "Sistema"}</span>
                    <span style={{ color:"#64748b", fontSize:"0.68rem" }}>{msg.party_code || "PARTY"}</span>
                  </div>
                  <div style={{ color:"#cbd5e1", fontSize:"0.82rem", lineHeight:1.55 }} dangerouslySetInnerHTML={{ __html:fmt(msg.content) }} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab==="quests" && !editQ && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
            <span style={{ color:"#94a3b8", fontSize:"0.85rem" }}>{visibleQuests.length}/{quests.length} missioni</span>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <SmallBtn onClick={syncDefaultQuests}>Mostra tutte le missioni base</SmallBtn>
              <BigBtn onClick={addSpecialQuest} gold icon="🔐">+ Speciale</BigBtn>
              <BigBtn onClick={addQuest} gold icon="?">+ Nuova Missione</BigBtn>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(220px,1fr) 180px", gap:8, marginBottom:"1rem" }}>
            <input style={inputStyle} value={questSearch} onChange={e=>setQuestSearch(e.target.value)} placeholder="Cerca per titolo, testo o ID..." />
            <select style={{...inputStyle,cursor:"pointer"}} value={questDifficultyFilter} onChange={e=>setQuestDifficultyFilter(e.target.value)}>
              <option value="all">Tutte</option>
              <option value="facile">Facili</option>
              <option value="medio">Medie</option>
              <option value="difficile">Difficili</option>
              <option value="epica">Epiche</option>
              <option value="speciale">Speciali</option>
              <option value="locked">Con password</option>
            </select>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {visibleQuests.map(q=>(
              <div key={q.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${q.active?"#4c1d95":"#1f2937"}`, borderRadius:6, padding:"0.9rem 1rem" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700, fontSize:"1rem" }}>{q.title}</span>
                      <span style={{ padding:"1px 8px", border:`1px solid ${DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#6b7280" }}>{missionDifficultyLabel(q.difficulty)}</span>
                      {!!q.specialPassword && <span style={{ fontSize:"0.65rem", color:"#c4b5fd", border:"1px solid #6d28d9", borderRadius:3, padding:"1px 5px" }}>PASSWORD</span>}
                      {!q.active && <span style={{ fontSize:"0.65rem", color:"#94a3b8", border:"1px solid #1f2937", borderRadius:3, padding:"1px 5px" }}>PAUSA</span>}
                    </div>
                    <p style={{ color:"#94a3b8", fontSize:"0.8rem", margin:"0 0 6px" }}>{q.desc||"Nessuna descrizione."}</p>
                    <div style={{ display:"flex", gap:14, fontSize:"0.72rem", color:"#94a3b8", flexWrap:"wrap" }}>
                      <span>⭐ {q.xpReward} XP</span><span>💰 {q.goldReward} oro</span>
                      <span>🎭 {q.steps.length} scene</span><span>👾 {q.enemies.length} nemici</span>
                      {q.minLevel > 1 && <span>🔒 Lv.{q.minLevel}+</span>}
                      {q.location && <span>📍 {q.location}</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <SmallBtn onClick={()=>setQuests(prev=>prev.map(x=>x.id===q.id?{...x,active:!x.active}:x))}>{q.active?"⭐":"⭐"}</SmallBtn>
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
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, flex:1 }}>📜 {editQ.title}</h3>
            <BigBtn onClick={saveEditQ} gold icon="⭐">Salva Missione</BigBtn>
            <SmallBtn onClick={()=>setEditQ(null)}>? Annulla</SmallBtn>
          </div>
          <Card title="📋 Informazioni Base">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={labelStyle}>Titolo</label>
                <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Il nome della missione visibile nella lista dei giocatori.</div>
                <input style={inputStyle} value={editQ.title} onChange={e=>setEditQ(q=>({...q,title:e.target.value}))} />
              </div>
              <div>
                <label style={labelStyle}>Difficoltà</label>
                <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Facile/Medio/Difficile → rotazione giornaliera pubblica. <span style={{color:"#a78bfa"}}>Speciale</span> → solo con password.</div>
                <select style={{...inputStyle,cursor:"pointer"}} value={String(editQ.difficulty || "").toLowerCase() === "speciale" ? "speciale" : normalizeMissionDifficulty(editQ.difficulty)} onChange={e=>setEditQ(q=>({...q,difficulty:e.target.value}))}>
                  <option value="facile">Facile</option>
                  <option value="medio">Medio</option>
                  <option value="difficile">Difficile</option>
                  <option value="epica">Epica</option>
                  <option value="speciale">Speciale (solo password)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ricompensa XP</label>
                <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Esperienza data a ogni giocatore al completamento.</div>
                <input style={inputStyle} type="number" value={editQ.xpReward} onChange={e=>setEditQ(q=>({...q,xpReward:+e.target.value}))} />
              </div>
              <div>
                <label style={labelStyle}>Ricompensa Oro</label>
                <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Oro aggiunto automaticamente all'inventario di ogni giocatore.</div>
                <input style={inputStyle} type="number" value={editQ.goldReward} onChange={e=>setEditQ(q=>({...q,goldReward:+e.target.value}))} />
              </div>
              <div>
                <label style={labelStyle}>Livello minimo</label>
                <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Chi è sotto questo livello non vede la missione. Usa 1 per tutti.</div>
                <input style={inputStyle} type="number" min="1" max="40" value={editQ.minLevel || 1} onChange={e=>setEditQ(q=>({...q,minLevel:Math.max(1,+e.target.value)}))} />
              </div>
              <div>
                <label style={labelStyle}>Luogo / Ambientazione</label>
                <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Tag geografico mostrato nella scheda. Es: "Foresta di Zodar".</div>
                <input style={inputStyle} value={editQ.location || ""} onChange={e=>setEditQ(q=>({...q,location:e.target.value}))} placeholder="es. Rovine di Drakmoor…" />
              </div>
            </div>

            <div style={{ margin:"14px 0 4px", padding:"10px 12px", background:"rgba(109,40,217,0.12)", border:"1px solid rgba(124,58,237,0.35)", borderRadius:8 }}>
              <label style={{...labelStyle, color:"#c4b5fd"}}>🔐 Password di sblocco</label>
              <div style={{ color:"#94a3b8", fontSize:"0.72rem", margin:"4px 0 8px", lineHeight:1.5 }}>
                Se compilata, la missione <strong>non appare nella lista pubblica</strong>. I giocatori digitano questa parola nel campo «Sblocca missione speciale» nella scheda Missioni. Perfetto per eventi segreti o sessioni speciali. Lascia vuoto per una missione normale.
              </div>
              <input
                style={inputStyle}
                value={editQ.specialPassword || ""}
                onChange={e=>setEditQ(q=>({...q,specialPassword:e.target.value.trim()}))}
                placeholder="es. dragodifuoco2025 — senza spazi, non sensibile alle maiuscole"
              />
            </div>

            <label style={{...labelStyle,marginTop:12}}>Descrizione breve</label>
            <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Appare sotto il titolo nella lista missioni. Deve incuriosire i giocatori (2-3 righe).</div>
            <textarea style={{...inputStyle,height:75,resize:"vertical"}} value={editQ.desc} onChange={e=>setEditQ(q=>({...q,desc:e.target.value}))} placeholder="Un antico male risvegliato nei sotterranei della città. Qualcuno deve indagare prima che sia troppo tardi…" />

            <label style={{...labelStyle,marginTop:12}}>Citazione narrativa (flavor text)</label>
            <div style={{ color:"#64748b", fontSize:"0.7rem", marginBottom:4 }}>Frase in corsivo mostrata prima delle scene. Crea atmosfera — una profezia, un detto locale, un grido di battaglia.</div>
            <textarea style={{...inputStyle,height:52,resize:"vertical"}} value={editQ.flavor} onChange={e=>setEditQ(q=>({...q,flavor:e.target.value}))} placeholder="«Nessuno torna dalle Rovine di Drakmoor. Non ancora.»" />
          </Card>
          <Card title="🎭 Scene della Missione">
            <div style={{ color:"#94a3b8", fontSize:"0.75rem", marginBottom:10, lineHeight:1.6 }}>
              Le scene sono i capitoli della missione. I giocatori digitano <strong style={{color:"#a78bfa"}}>avanza</strong> nella chat per passare alla scena successiva. Ogni scena può avere 3 scelte (buona/media/sbagliata) con XP e oro aggiuntivi — oppure nessuna scelta, solo narrazione pura. Le scelte compaiono come bottoni nella chat dei giocatori.
            </div>
            {editQ.steps.map((s,i)=>{
              const step = typeof s === "string" ? { text: s } : (s || { text: "" });
              const choices = step.choices || {};
              const setStepAt = (newStep) => { const st=[...editQ.steps]; st[i]=newStep; setEditQ(q=>({...q,steps:st})); };
              const updateStep = (updates) => setStepAt({ ...step, ...updates });
              const updateChoice = (key, field, value) => {
                const existing = choices[key] || {};
                setStepAt({ ...step, choices: { ...choices, [key]: { ...existing, [field]: value } } });
              };
              return (
                <div key={i} style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:8, marginBottom:8 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:6, alignItems:"flex-start" }}>
                    <span style={{ color:"#94a3b8", fontSize:"0.8rem", minWidth:22, paddingTop:10 }}>{i+1}.</span>
                    <textarea style={{...inputStyle,flex:1,height:60,resize:"vertical",fontSize:"0.85rem"}} value={step.text}
                      onChange={e=>updateStep({ text: e.target.value })} />
                    <div style={{ display:"flex", flexDirection:"column", gap:3, paddingTop:2 }}>
                      <button onClick={()=>{ const st=[...editQ.steps]; if(i>0){[st[i],st[i-1]]=[st[i-1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} title="Sposta su" style={iconBtnStyle}>↑</button>
                      <button onClick={()=>{ const st=[...editQ.steps]; if(i<st.length-1){[st[i],st[i+1]]=[st[i+1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} title="Sposta giù" style={iconBtnStyle}>↓</button>
                      <button onClick={()=>setEditQ(q=>({...q,steps:q.steps.filter((_,j)=>j!==i)}))} title="Elimina scena" style={{...iconBtnStyle,color:"#f87171"}}>🗑</button>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:6 }}>
                    {[
                      ["good","✅ Buona"],
                      ["neutral","⚠️ Media"],
                      ["bad","❌ Sbagliata"],
                    ].map(([key,label])=>{
                      const choice = choices[key] || {};
                      return (
                        <div key={key} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:8 }}>
                          <div style={{ fontSize:"0.72rem", fontWeight:700, marginBottom:4 }}>{label}</div>
                          <input style={{...inputStyle,marginBottom:6}} value={choice.text||""} placeholder="Testo scelta" onChange={e=>updateChoice(key,"text",e.target.value)} />
                          <div style={{ display:"flex", gap:6 }}>
                            <input style={{...inputStyle,flex:1}} type="number" value={choice.xp||0} placeholder="XP" onChange={e=>updateChoice(key,"xp",e.target.value)} />
                            <input style={{...inputStyle,flex:1}} type="number" value={choice.gold||0} placeholder="Oro" onChange={e=>updateChoice(key,"gold",e.target.value)} />
                          </div>
                          <input style={{...inputStyle,marginTop:6}} type="number" value={choice.nextStep||""} placeholder="Prossima scena (#)" onChange={e=>updateChoice(key,"nextStep",e.target.value)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
                  <span style={{ color:en.isBoss?"#fbbf24":"#e2d9c5", fontWeight:en.isBoss?700:400 }}>{en.name}{en.isBoss?" ⭐":""}</span>
                  <span style={{ color:"#94a3b8", fontSize:"0.72rem" }}>❤️{en.hp} ⚔️{en.atk} 🛡️{en.def} ⭐{monsterXpValue(en)}xp</span>
                  <button onClick={()=>setEditQ(q=>({...q,enemies:q.enemies.filter((_,j)=>j!==i)}))} title="Rimuovi nemico" style={{ marginLeft:"auto", ...iconBtnStyle, color:"#f87171" }}>🗑</button>
                </div>
              ))}
            </div>
            <p style={{ color:"#94a3b8", fontSize:"0.75rem", marginBottom:8 }}>Aggiungi dal bestiario:</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {monsters.map(m=>(
                <button key={m.id} onClick={()=>addEnemyToQ(m)}
                  style={{ padding:"0.4rem 0.7rem", background:"rgba(255,255,255,0.04)", border:`1px solid ${m.isBoss?"#f59e0b":"#374151"}`, borderRadius:4, color:"#d1d5db", cursor:"pointer", fontSize:"0.8rem", fontFamily:"inherit" }}>
                  {m.emoji} {m.name}{m.isBoss?" ⭐":""}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab==="stories" && (
        <MasterStoriesWrapper
          parties={masterParties}
          builtinStories={STORIES}
          dbGetPartyState={dbGetPartyState}
          dbSavePartyState={dbSavePartyState}
          supabase={supabase}
        />
      )}

      {tab==="questbuilder" && (
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <QuestEditorPanel supabase={supabase} />
        </div>
      )}

      {tab==="editor" && (
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <StoryEditorPanel
            supabase={supabase}
            dbGetPartyState={dbGetPartyState}
            dbSavePartyState={dbSavePartyState}
            STORIES={STORIES}
            onLaunchPreview={async (story, chapterId) => {
              // Save story to library temp + launch for a selected party
              const firstChap = story.chapters?.find(c=>c.id===chapterId);
              const firstSceneId = firstChap?.startScene;
              if(!firstSceneId) { alert("Imposta una scena iniziale per il capitolo prima di provarlo."); return; }
              const partyCode = window.prompt("Codice party su cui lanciare la preview:");
              if(!partyCode) return;
              const latestQs = await dbGetPartyState(partyCode.toUpperCase());
              // Merge custom story into party_state temporarily
              const newStoryState = {
                active:true, storyId:story.id,
                currentChapterId:chapterId, currentSceneId:firstSceneId,
                storyFlags:{}, choiceLog:[], visitedScenes:[firstSceneId], rewardCollected:[],
                battlePending:false, battleNext:null, battleNextFail:null, startedAt:Date.now(),
                _previewStory: story, // embed for lookup
              };
              await dbSavePartyState(partyCode.toUpperCase(), { ...latestQs, story:newStoryState });
              await supabase.from("messages").insert({ party_code:partyCode.toUpperCase(), author:"Master", content:`📖 **Preview**: ${story.emoji} *${story.title}* — ${firstChap?.title}`, type:"narration" });
              alert(`Preview avviata per il party ${partyCode.toUpperCase()}.`);
            }}
          />
        </div>
      )}

      {tab==="monsters" && !editM && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
            <span style={{ color:"#94a3b8", fontSize:"0.85rem" }}>{visibleMonsters.length}/{monsters.length} creature</span>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <SmallBtn onClick={syncDefaultMonsters}>Mostra tutto il bestiario base</SmallBtn>
              <BigBtn onClick={addMonster} gold icon="?">+ Nuova Creatura</BigBtn>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(220px,1fr) 180px", gap:8, marginBottom:"1rem" }}>
            <input style={inputStyle} value={monsterSearch} onChange={e=>setMonsterSearch(e.target.value)} placeholder="Cerca creatura..." />
            <select style={{...inputStyle,cursor:"pointer"}} value={monsterTierFilter} onChange={e=>setMonsterTierFilter(e.target.value)}>
              <option value="all">Tutti</option>
              <option value="base">Base</option>
              <option value="mid">Intermedi</option>
              <option value="hard">Duri</option>
              <option value="boss">Boss</option>
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:8 }}>
            {visibleMonsters.map(m=>(
              <div key={m.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${m.isBoss?"#92400e":"#1f2937"}`, borderRadius:6, padding:"0.8rem" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                  <ArtThumb src={getMonsterImage(m)} alt={m.name} size={68} radius={16} />
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", color:m.isBoss?"#fbbf24":"#e2d9c5", fontWeight:700 }}>{m.name}{m.isBoss?" ⭐":""}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.68rem" }}>{m.desc}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, fontSize:"0.73rem", color:"#94a3b8", marginBottom:8 }}>
                  <span>❤️{m.hp}</span><span>⚔️{m.atk}</span><span>🛡️{m.def}</span><span>⭐{monsterXpValue(m)}xp</span>
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
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, flex:1 }}>👾 Modifica Creatura</h3>
            <BigBtn onClick={saveEditM} gold icon="⭐">Salva</BigBtn>
            <SmallBtn onClick={()=>setEditM(null)}>? Annulla</SmallBtn>
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
              <div>
                <label style={labelStyle}>XP calcolata</label>
                <input style={{...inputStyle,color:"#fbbf24",fontWeight:700}} type="number" value={monsterXpValue(editM)} readOnly />
                <div style={{ color:"#94a3b8", fontSize:"0.72rem", marginTop:4 }}>Si aggiorna da HP, ATK, DEF e Boss.</div>
              </div>
            </div>
            <label style={{...labelStyle,marginTop:10}}>Lore</label>
            <textarea style={{...inputStyle,height:70,resize:"vertical"}} value={editM.desc} onChange={e=>setEditM(m=>({...m,desc:e.target.value}))} />
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10 }}>
              <input type="checkbox" id="bossChk" checked={!!editM.isBoss} onChange={e=>setEditM(m=>({...m,isBoss:e.target.checked}))} style={{ width:18, height:18 }} />
              <label htmlFor="bossChk" style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontSize:"0.85rem", cursor:"pointer" }}>⭐ un Boss ⭐</label>
            </div>
          </Card>
        </div>
      )}

      {tab==="players" && <PlayersView authUser={authUser} />}
      {tab==="party" && <PartiesView authUser={authUser} />}
      {tab==="guilds" && <MasterGuildsView />}
      {tab==="market" && <MarketView />}
      {tab==="online" && <OnlineView />}
      {tab==="users" && <UsersView authUser={authUser} />}
      {tab==="dungeon" && <MasterDungeonView />}
      {tab==="leaderboard" && <GlobalLeaderboardView />}
      {tab==="worldevent" && <MasterWorldEventView />}
    </div>
  );
}

function MasterDungeonView() {
  const IS = { padding:'0.38rem 0.7rem', background:'rgba(15,23,42,0.8)', border:'1px solid #1e3a5f', borderRadius:6, color:'#e2d9c5', fontSize:'0.83rem', width:'100%', boxSizing:'border-box' };
  const TA = { ...IS, resize:'vertical', minHeight:56, fontFamily:'inherit' };
  const Btn = ({ children, onClick, disabled, color='#7c3aed', bg='rgba(109,40,217,0.18)' }) => (
    <button onClick={onClick} disabled={disabled} style={{ padding:'0.42rem 1rem', background:bg, border:`1px solid ${color}`, borderRadius:7, color, cursor:disabled?'not-allowed':'pointer', fontFamily:"'Cinzel',serif", fontSize:'0.8rem', opacity:disabled?0.45:1, flexShrink:0 }}>{children}</button>
  );

  const [parties, setParties]       = useState([]);
  const [target, setTarget]         = useState('all');     // 'all' | 'party'
  const [selParty, setSelParty]     = useState('');
  const [mode, setMode]             = useState('proc');    // 'proc' | 'manual'
  // procedural
  const [roomCount, setRoomCount]   = useState(5);
  const [themeId, setThemeId]       = useState('crypt');
  const [partyLevel, setPartyLevel] = useState(3);
  const [difficulty, setDifficulty] = useState('normal');
  // manual
  const [dungeonName, setDungeonName] = useState('Il Dungeon Oscuro');
  const [manTheme, setManTheme]     = useState('crypt');
  const [manRooms, setManRooms]     = useState([]);
  const [monSearch, setMonSearch]   = useState('');
  // shared
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState('');
  const [library, setLibrary]       = useState([]);
  const [libName, setLibName]       = useState('');
  const [showLib, setShowLib]       = useState(false);

  const DUNGEON_LIB_KEY = '__dungeon_library__';
  useEffect(() => {
    supabase.from('party_state').select('combat').eq('party_code', DUNGEON_LIB_KEY).maybeSingle()
      .then(({ data }) => { if(data?.combat?.dungeons) setLibrary(data.combat.dungeons); }).catch(()=>{});
  }, []);
  async function saveToLibrary() {
    if(!preview) { setStatus('⚠️ Genera o costruisci un dungeon prima di salvarlo.'); return; }
    const name = libName.trim() || preview.name || 'Dungeon';
    const entry = { ...preview, _savedName: name, _savedAt: Date.now() };
    const updated = [...library.filter(d => d._savedName !== name), entry];
    setLibrary(updated);
    const { error } = await supabase.from('party_state').upsert(
      { party_code: DUNGEON_LIB_KEY, combat: { dungeons: updated }, updated_at: new Date().toISOString() },
      { onConflict: 'party_code' }
    );
    if(error) setStatus('❌ Errore salvataggio: ' + error.message);
    else setStatus(`✅ Dungeon "${name}" salvato in libreria.`);
  }
  async function deleteFromLibrary(name) {
    const updated = library.filter(d => d._savedName !== name);
    setLibrary(updated);
    await supabase.from('party_state').upsert(
      { party_code: DUNGEON_LIB_KEY, combat: { dungeons: updated }, updated_at: new Date().toISOString() },
      { onConflict: 'party_code' }
    );
  }

  useEffect(() => {
    supabase.from('party_state').select('party_code').then(({ data }) => {
      const SYSTEM = ['__world_guilds__','__world__','__master__','__maintenance__','__story_library__'];
      setParties((data || []).map(r => r.party_code).filter(c => !SYSTEM.includes(c)));
    });
  }, []);

  // ── Room helpers ──
  function newRoom(type) {
    const id = `r${Date.now()}`;
    const base = { id, type, idx:0, title: DUNGEON_ROOM_CFG[type]?.label || type, desc:'', cleared:false };
    if (type === 'combat' || type === 'boss') return { ...base, monsters:[] };
    if (type === 'trap')     return { ...base, skill:'ATK', skillLabel:'Forza', skillStat:'atk', dc:13, failDmg:10 };
    if (type === 'treasure') return { ...base, gold:100 };
    if (type === 'rest')     return { ...base, healPct:25 };
    if (type === 'choice')   return { ...base, options:[{ label:'🛡️ Via Sicura', desc:'Percorso sicuro.', effect:'gold', effectValue:50 },{ label:'⚔️ Via Rischiosa', desc:'Percorso pericoloso.', effect:'gold_big', effectValue:150 }] };
    if (type === 'riddle')   return { ...base, question:'Scrivi la domanda...', answer:'risposta', xpReward:150, failDmg:0 };
    if (type === 'event')    return { ...base, effect:'xp', effectValue:100 };
    if (type === 'shrine')   return { ...base, hpCost:10, buffStat:'atk', buffAmount:3 };
    if (type === 'merchant') return { ...base, items:[] };
    return base;
  }
  function updateRoom(id, patch) { setManRooms(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function moveRoom(idx, dir) {
    setManRooms(rs => {
      const a = [...rs]; const b = idx + dir;
      if (b < 0 || b >= a.length) return a;
      [a[idx], a[b]] = [a[b], a[idx]];
      return a.map((r, i) => ({ ...r, idx:i }));
    });
  }
  function removeRoom(id) { setManRooms(rs => rs.filter(r => r.id !== id).map((r,i) => ({ ...r, idx:i }))); }
  function addMonsterToRoom(roomId, monster) {
    setManRooms(rs => rs.map(r => r.id === roomId ? { ...r, monsters:[...(r.monsters||[]), { ...monster }] } : r));
  }
  function removeMonsterFromRoom(roomId, monIdx) {
    setManRooms(rs => rs.map(r => r.id === roomId ? { ...r, monsters:(r.monsters||[]).filter((_,i)=>i!==monIdx) } : r));
  }

  // ── Procedural generate ──
  function handleGenerate() {
    try {
      const d = generateDungeon({ roomCount, themeId, partyLevel, difficulty, seed:Date.now() });
      setPreview(d);
      setStatus('');
    } catch(e) {
      setStatus('❌ Errore generazione: ' + (e?.message || String(e)));
      console.error('generateDungeon error:', e);
    }
  }

  // ── Build dungeon from manual rooms ──
  function handleBuildManual() {
    if (!manRooms.length) { setStatus('⚠️ Aggiungi almeno una stanza.'); return; }
    const theme = DUNGEON_THEMES.find(t => t.id === manTheme) || DUNGEON_THEMES[0];
    const dungeon = {
      active:true, name: dungeonName || theme.name, themeId:manTheme, emoji:theme.emoji,
      rooms: manRooms.map((r,i) => ({ ...r, idx:i })),
      currentRoom:0, pendingCombatRoom:null,
      startedAt: new Date().toISOString(), completedAt:null, seed: Date.now(),
    };
    setPreview(dungeon); setStatus('');
  }

  // ── Launch / Stop ──
  async function getTargetParties() {
    if (target === 'all') return parties;
    return selParty ? [selParty] : [];
  }
  async function handleLaunch() {
    if (!preview) { setStatus('⚠️ Prima genera o costruisci il dungeon.'); return; }
    const targets = await getTargetParties();
    if (!targets.length) { setStatus('⚠️ Seleziona almeno un party.'); return; }
    setLoading(true); setStatus('');
    try {
      for (const pc of targets) {
        const state = await dbGetPartyState(pc);
        await dbSavePartyState(pc, { ...state, dungeon: { ...preview, active:true, currentRoom:0, pendingCombatRoom:null, startedAt:new Date().toISOString(), completedAt:null, rooms:preview.rooms.map(r=>({...r,cleared:false})) } });
      }
      setStatus(`✅ Dungeon "${preview.name}" avviato su ${targets.length === parties.length ? 'tutti i party' : targets.join(', ')}!`);
    } catch(e) { setStatus('❌ ' + (e?.message || e)); }
    finally { setLoading(false); }
  }
  async function handleStop() {
    const targets = await getTargetParties();
    if (!targets.length) { setStatus('⚠️ Seleziona almeno un party.'); return; }
    if (!window.confirm(`Terminare il dungeon su ${targets.length} party?`)) return;
    setLoading(true);
    try {
      for (const pc of targets) {
        const state = await dbGetPartyState(pc);
        await dbSavePartyState(pc, { ...state, dungeon:null });
      }
      setStatus(`🛑 Dungeon terminato su ${targets.length} party.`); setPreview(null);
    } catch(e) { setStatus('❌ ' + (e?.message||e)); }
    finally { setLoading(false); }
  }

  const filteredMonsters = DEFAULT_MONSTERS.filter(m =>
    !monSearch || m.name.toLowerCase().includes(monSearch.toLowerCase())
  );
  const trapSkills = [
    { skill:'ATK', skillLabel:'Forza',    skillStat:'atk' },
    { skill:'DEF', skillLabel:'Riflessi', skillStat:'def' },
    { skill:'MAG', skillLabel:'Magia',    skillStat:'mag' },
  ];

  return (
    <div style={{ padding:'1.2rem', maxWidth:820, overflowY:'auto', maxHeight:'calc(100vh - 120px)' }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:'#fbbf24', marginBottom:'1rem', fontSize:'1.1rem' }}>🗺️ Creatore di Dungeon</h3>

      {/* ── Target ── */}
      <section style={{ background:'rgba(15,23,42,0.7)', border:'1px solid #1e3a5f', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
        <div style={{ color:'#94a3b8', fontSize:'0.78rem', marginBottom:8, fontFamily:"'Cinzel',serif", letterSpacing:'0.05em' }}>DESTINATARI</div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
          <label style={{ display:'flex', gap:6, alignItems:'center', color:'#e2d9c5', cursor:'pointer', fontSize:'0.85rem' }}>
            <input type='radio' checked={target==='all'} onChange={()=>setTarget('all')} /> Tutti i party ({parties.length})
          </label>
          <label style={{ display:'flex', gap:6, alignItems:'center', color:'#e2d9c5', cursor:'pointer', fontSize:'0.85rem' }}>
            <input type='radio' checked={target==='party'} onChange={()=>setTarget('party')} /> Party specifico
          </label>
          {target==='party' && (
            <select value={selParty} onChange={e=>setSelParty(e.target.value)} style={{ ...IS, width:'auto' }}>
              <option value=''>— Seleziona —</option>
              {parties.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>
      </section>

      {/* ── Mode tabs ── */}
      <div style={{ display:'flex', gap:0, marginBottom:'1rem', borderRadius:8, overflow:'hidden', border:'1px solid #1e3a5f' }}>
        {[['proc','🎲 Procedurale'],['manual','✏️ Manuale']].map(([k,l]) => (
          <button key={k} onClick={()=>setMode(k)} style={{ flex:1, padding:'0.5rem', background:mode===k?'rgba(109,40,217,0.25)':'rgba(15,23,42,0.6)', border:'none', color:mode===k?'#c4b5fd':'#64748b', fontFamily:"'Cinzel',serif", fontSize:'0.82rem', cursor:'pointer', borderRight:k==='proc'?'1px solid #1e3a5f':'none' }}>{l}</button>
        ))}
      </div>

      {/* ── Procedural ── */}
      {mode==='proc' && (
        <section style={{ background:'rgba(15,23,42,0.7)', border:'1px solid #1e3a5f', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.75rem', display:'block', marginBottom:4 }}>Tema</label>
              <select value={themeId} onChange={e=>setThemeId(e.target.value)} style={IS}>
                {DUNGEON_THEMES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.75rem', display:'block', marginBottom:4 }}>Stanze: {roomCount}</label>
              <input type='range' min={3} max={10} value={roomCount} onChange={e=>setRoomCount(+e.target.value)} style={{ width:'100%', marginTop:6 }} />
            </div>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.75rem', display:'block', marginBottom:4 }}>Livello party: {partyLevel}</label>
              <input type='range' min={1} max={40} value={partyLevel} onChange={e=>setPartyLevel(+e.target.value)} style={{ width:'100%', marginTop:6 }} />
            </div>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.75rem', display:'block', marginBottom:4 }}>Difficoltà</label>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} style={IS}>
                <option value='easy'>🟢 Facile</option>
                <option value='normal'>🟡 Normale</option>
                <option value='hard'>🟠 Difficile</option>
                <option value='deadly'>🔴 Mortale</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop:12 }}>
            <Btn onClick={handleGenerate}>🎲 Genera Anteprima</Btn>
          </div>
        </section>
      )}

      {/* ── Manual builder ── */}
      {mode==='manual' && (
        <section style={{ background:'rgba(15,23,42,0.7)', border:'1px solid #1e3a5f', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:'1rem' }}>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.75rem', display:'block', marginBottom:4 }}>Nome dungeon</label>
              <input value={dungeonName} onChange={e=>setDungeonName(e.target.value)} style={IS} placeholder='Es. Cripta dei Traditori' />
            </div>
            <div>
              <label style={{ color:'#94a3b8', fontSize:'0.75rem', display:'block', marginBottom:4 }}>Tema</label>
              <select value={manTheme} onChange={e=>setManTheme(e.target.value)} style={IS}>
                {DUNGEON_THEMES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
              </select>
            </div>
          </div>

          {/* Rooms list */}
          {manRooms.length === 0 && (
            <div style={{ textAlign:'center', padding:'1.5rem', color:'#475569', fontSize:'0.83rem', border:'1px dashed #1e3a5f', borderRadius:8, marginBottom:'0.8rem' }}>Nessuna stanza. Aggiungine una.</div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:'0.8rem' }}>
            {manRooms.map((room, idx) => {
              const cfg = DUNGEON_ROOM_CFG[room.type];
              return (
                <div key={room.id} style={{ background:'rgba(0,0,0,0.35)', border:`1px solid ${cfg.color}55`, borderRadius:10, padding:'0.85rem' }}>
                  {/* Room header */}
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:'0.7rem', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'1.2rem' }}>{cfg.emoji}</span>
                    <select value={room.type} onChange={e=>updateRoom(room.id,{...newRoom(e.target.value), id:room.id, idx})} style={{ ...IS, width:'auto', flex:'0 0 auto' }}>
                      {Object.entries(DUNGEON_ROOM_CFG).map(([k,v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                    </select>
                    <input value={room.title} onChange={e=>updateRoom(room.id,{title:e.target.value})} style={{ ...IS, flex:1, minWidth:120 }} placeholder='Titolo stanza' />
                    <div style={{ display:'flex', gap:4 }}>
                      <button onClick={()=>moveRoom(idx,-1)} disabled={idx===0} style={{ padding:'2px 7px', background:'rgba(15,23,42,0.8)', border:'1px solid #334155', borderRadius:5, color:'#94a3b8', cursor:'pointer', fontSize:'0.8rem' }}>↑</button>
                      <button onClick={()=>moveRoom(idx,1)} disabled={idx===manRooms.length-1} style={{ padding:'2px 7px', background:'rgba(15,23,42,0.8)', border:'1px solid #334155', borderRadius:5, color:'#94a3b8', cursor:'pointer', fontSize:'0.8rem' }}>↓</button>
                      <button onClick={()=>removeRoom(room.id)} style={{ padding:'2px 7px', background:'rgba(127,29,29,0.3)', border:'1px solid #7f1d1d', borderRadius:5, color:'#fca5a5', cursor:'pointer', fontSize:'0.8rem' }}>🗑️</button>
                    </div>
                  </div>

                  {/* Description */}
                  <textarea value={room.desc} onChange={e=>updateRoom(room.id,{desc:e.target.value})} style={{ ...TA, marginBottom:'0.6rem' }} placeholder='Descrizione della stanza (opzionale)' rows={2} />

                  {/* Type-specific fields */}
                  {(room.type==='combat'||room.type==='boss') && (
                    <div>
                      <div style={{ color:'#94a3b8', fontSize:'0.75rem', marginBottom:6 }}>Mostri in questa stanza:</div>
                      {(room.monsters||[]).length === 0 && <div style={{ color:'#475569', fontSize:'0.75rem', marginBottom:6 }}>Nessun mostro aggiunto.</div>}
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                        {(room.monsters||[]).map((m, mi) => (
                          <span key={mi} style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 8px', background:'rgba(239,68,68,0.12)', border:'1px solid #7f1d1d', borderRadius:20, fontSize:'0.75rem', color:'#fca5a5' }}>
                            {m.emoji||'👾'} {m.name}
                            <button onClick={()=>removeMonsterFromRoom(room.id,mi)} style={{ background:'none', border:'none', color:'#fca5a5', cursor:'pointer', padding:0, fontSize:'0.8rem', lineHeight:1 }}>✕</button>
                          </span>
                        ))}
                      </div>
                      <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                        <input value={monSearch} onChange={e=>setMonSearch(e.target.value)} style={{ ...IS, width:160 }} placeholder='Cerca mostro…' />
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4, maxHeight:90, overflowY:'auto' }}>
                          {filteredMonsters.slice(0,30).map(m => (
                            <button key={m.id} onClick={()=>{ addMonsterToRoom(room.id, m); setMonSearch(''); }}
                              style={{ padding:'2px 8px', background:'rgba(15,23,42,0.8)', border:'1px solid #334155', borderRadius:20, color:'#94a3b8', cursor:'pointer', fontSize:'0.72rem', whiteSpace:'nowrap' }}>
                              {m.emoji||'👾'} {m.name} (T{m.tier})
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {room.type==='trap' && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Abilità richiesta</label>
                        <select value={room.skill} onChange={e=>{ const s=trapSkills.find(t=>t.skill===e.target.value)||trapSkills[0]; updateRoom(room.id,{skill:s.skill,skillLabel:s.skillLabel,skillStat:s.skillStat}); }} style={IS}>
                          {trapSkills.map(s=><option key={s.skill} value={s.skill}>{s.skillLabel} ({s.skill})</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>DC</label>
                        <input type='number' value={room.dc} onChange={e=>updateRoom(room.id,{dc:+e.target.value})} style={IS} min={5} max={30} />
                      </div>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Danno se fallisce</label>
                        <input type='number' value={room.failDmg} onChange={e=>updateRoom(room.id,{failDmg:+e.target.value})} style={IS} min={0} max={100} />
                      </div>
                    </div>
                  )}

                  {room.type==='treasure' && (
                    <div>
                      <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Oro totale (diviso tra i giocatori presenti)</label>
                      <input type='number' value={room.gold} onChange={e=>updateRoom(room.id,{gold:+e.target.value})} style={{ ...IS, width:120 }} min={0} />
                    </div>
                  )}

                  {room.type==='rest' && (
                    <div>
                      <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>% HP massimi recuperati: {room.healPct}%</label>
                      <input type='range' value={room.healPct} onChange={e=>updateRoom(room.id,{healPct:+e.target.value})} style={{ width:'100%' }} min={5} max={100} />
                    </div>
                  )}

                  {room.type==='choice' && (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {(room.options||[]).map((opt, oi) => (
                        <div key={oi} style={{ padding:'0.6rem', background:'rgba(15,23,42,0.6)', border:'1px solid #1e3a5f', borderRadius:8 }}>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:4 }}>
                            <input value={opt.label} onChange={e=>updateRoom(room.id,{options:room.options.map((o,i)=>i===oi?{...o,label:e.target.value}:o)})} style={IS} placeholder='Etichetta scelta' />
                            <input value={opt.desc} onChange={e=>updateRoom(room.id,{options:room.options.map((o,i)=>i===oi?{...o,desc:e.target.value}:o)})} style={IS} placeholder='Descrizione breve' />
                          </div>
                          <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
                            <label style={{ color:'#64748b', fontSize:'0.72rem' }}>Effetto:</label>
                            <select value={opt.effect} onChange={e=>updateRoom(room.id,{options:room.options.map((o,i)=>i===oi?{...o,effect:e.target.value}:o)})} style={{ ...IS, width:'auto' }}>
                              <option value='gold'>💰 Oro</option>
                              <option value='gold_big'>💰 Oro grande</option>
                              <option value='xp'>⭐ XP</option>
                              <option value='heal_pct'>❤️ Cura HP %</option>
                              <option value='dmg_pct'>💀 Danno HP %</option>
                              <option value='nothing'>— Nessun effetto</option>
                            </select>
                            {opt.effect !== 'nothing' && <input type='number' value={opt.effectValue||0} onChange={e=>updateRoom(room.id,{options:room.options.map((o,i)=>i===oi?{...o,effectValue:+e.target.value}:o)})} style={{ ...IS, width:80 }} placeholder='Valore' />}
                          </div>
                        </div>
                      ))}
                      {(room.options||[]).length < 3 && (
                        <button onClick={()=>updateRoom(room.id,{options:[...(room.options||[]),{label:`Opzione ${(room.options||[]).length+1}`,desc:'',effect:'gold',effectValue:50}]})}
                          style={{ padding:'3px 10px', background:'rgba(96,165,250,0.1)', border:'1px solid #3b82f6', borderRadius:6, color:'#60a5fa', cursor:'pointer', fontSize:'0.72rem', alignSelf:'flex-start' }}>+ Aggiungi opzione</button>
                      )}
                    </div>
                  )}

                  {room.type==='riddle' && (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Domanda</label>
                        <textarea value={room.question||''} onChange={e=>updateRoom(room.id,{question:e.target.value})} style={{ ...TA, minHeight:40 }} rows={2} placeholder='Scrivi la domanda per i giocatori...' />
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                        <div>
                          <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Risposta corretta</label>
                          <input value={room.answer||''} onChange={e=>updateRoom(room.id,{answer:e.target.value})} style={IS} placeholder='risposta' />
                        </div>
                        <div>
                          <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>⭐ XP se corretto</label>
                          <input type='number' value={room.xpReward||0} onChange={e=>updateRoom(room.id,{xpReward:+e.target.value})} style={IS} min={0} />
                        </div>
                        <div>
                          <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>💀 Danno se sbagliato</label>
                          <input type='number' value={room.failDmg||0} onChange={e=>updateRoom(room.id,{failDmg:+e.target.value})} style={IS} min={0} />
                        </div>
                      </div>
                    </div>
                  )}

                  {room.type==='event' && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Effetto</label>
                        <select value={room.effect||'xp'} onChange={e=>updateRoom(room.id,{effect:e.target.value})} style={IS}>
                          <option value='xp'>⭐ XP</option>
                          <option value='gold'>💰 Oro</option>
                          <option value='heal_pct'>❤️ Cura HP %</option>
                          <option value='dmg_pct'>💀 Danno HP %</option>
                          <option value='nothing'>— Solo narrazione</option>
                        </select>
                      </div>
                      {room.effect !== 'nothing' && <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Valore</label>
                        <input type='number' value={room.effectValue||0} onChange={e=>updateRoom(room.id,{effectValue:+e.target.value})} style={IS} min={0} />
                      </div>}
                    </div>
                  )}

                  {room.type==='shrine' && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>💀 HP sacrificati</label>
                        <input type='number' value={room.hpCost||10} onChange={e=>updateRoom(room.id,{hpCost:+e.target.value})} style={IS} min={1} max={99} />
                      </div>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Statistica potenziata</label>
                        <select value={room.buffStat||'atk'} onChange={e=>updateRoom(room.id,{buffStat:e.target.value})} style={IS}>
                          <option value='atk'>⚔️ ATK</option>
                          <option value='def'>🛡️ DEF</option>
                          <option value='mag'>🔮 MAG</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Bonus (per il prossimo combattimento)</label>
                        <input type='number' value={room.buffAmount||3} onChange={e=>updateRoom(room.id,{buffAmount:+e.target.value})} style={IS} min={1} max={30} />
                      </div>
                    </div>
                  )}

                  {room.type==='treasure' && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>Oro totale</label>
                        <input type='number' value={room.gold||0} onChange={e=>updateRoom(room.id,{gold:+e.target.value})} style={IS} min={0} />
                      </div>
                      <div>
                        <label style={{ color:'#94a3b8', fontSize:'0.72rem', display:'block', marginBottom:3 }}>⭐ XP bonus (opzionale)</label>
                        <input type='number' value={room.xpBonus||0} onChange={e=>updateRoom(room.id,{xpBonus:+e.target.value})} style={IS} min={0} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add room buttons */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:'1rem' }}>
            <span style={{ color:'#64748b', fontSize:'0.75rem', alignSelf:'center' }}>+ Aggiungi:</span>
            {Object.entries(DUNGEON_ROOM_CFG).map(([k,v]) => (
              <button key={k} onClick={()=>setManRooms(rs=>[...rs, {...newRoom(k), idx:rs.length}])}
                style={{ padding:'3px 10px', background:`${v.color}18`, border:`1px solid ${v.color}66`, borderRadius:20, color:v.color, cursor:'pointer', fontSize:'0.75rem' }}>
                {v.emoji} {v.label}
              </button>
            ))}
          </div>

          <Btn onClick={handleBuildManual}>👁️ Anteprima Dungeon</Btn>
        </section>
      )}

      {/* ── Preview ── */}
      {preview && (
        <section style={{ background:'rgba(15,23,42,0.7)', border:'1px solid #1e3a5f', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
          <div style={{ fontFamily:"'Cinzel',serif", color:'#fbbf24', marginBottom:'0.8rem', fontSize:'0.95rem' }}>{preview.emoji} {preview.name} — {preview.rooms.length} stanze</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {preview.rooms.map((r,i) => {
              const c = DUNGEON_ROOM_CFG[r.type];
              return (
                <div key={r.id||i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'0.55rem 0.8rem', background:'rgba(0,0,0,0.28)', borderRadius:8, border:`1px solid ${c.color}33` }}>
                  <span style={{ flexShrink:0, fontSize:'1.1rem' }}>{c.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:c.color, fontWeight:700, fontSize:'0.82rem' }}>{i+1}. {r.title}</div>
                    {(r.type==='combat'||r.type==='boss') && r.monsters?.length > 0 && (
                      <div style={{ color:'#64748b', fontSize:'0.72rem' }}>Mostri: {r.monsters.map(m=>`${m.emoji||'👾'} ${m.name}`).join(', ')}</div>
                    )}
                    {r.type==='trap' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>DC {r.dc} {r.skillLabel} — fallimento -{r.failDmg} HP</div>}
                    {r.type==='treasure' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>💰 {r.gold} oro{r.xpBonus>0?` · +${r.xpBonus} XP`:''}</div>}
                    {r.type==='rest' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>🔥 +{r.healPct}% HP</div>}
                    {r.type==='choice' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>Scelte: {r.options?.map(o=>o.label).join(' / ')}</div>}
                    {r.type==='riddle' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>❓ {r.question?.slice(0,60)} · +{r.xpReward} XP se corretto</div>}
                    {r.type==='event' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>📖 Effetto: {r.effect} {r.effectValue>0?`(${r.effectValue})`:''}</div>}
                    {r.type==='shrine' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>🕯️ -{r.hpCost} HP → +{r.buffAmount} {r.buffStat?.toUpperCase()}</div>}
                    {r.type==='merchant' && <div style={{ color:'#64748b', fontSize:'0.72rem' }}>🧙 Mercante disponibile</div>}
                    {r.desc && <div style={{ color:'#475569', fontSize:'0.7rem', marginTop:2 }}>{r.desc.slice(0,80)}{r.desc.length>80?'…':''}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Libreria Dungeon ── */}
      <section style={{ background:'rgba(15,23,42,0.7)', border:'1px solid #1e3a5f', borderRadius:10, padding:'1rem', marginBottom:'1rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ color:'#94a3b8', fontSize:'0.78rem', fontFamily:"'Cinzel',serif", letterSpacing:'0.05em' }}>📚 LIBRERIA DUNGEON ({library.length})</div>
          <button onClick={()=>setShowLib(v=>!v)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'0.8rem' }}>{showLib?'▲':'▼'}</button>
        </div>
        {showLib && (
          <div>
            {library.length === 0 && <div style={{ color:'#475569', fontSize:'0.8rem', marginBottom:8 }}>Nessun dungeon salvato.</div>}
            {library.map(d => (
              <div key={d._savedName} style={{ display:'flex', gap:8, alignItems:'center', padding:'0.4rem 0', borderBottom:'1px solid #1e3a5f' }}>
                <span style={{ fontSize:'1rem' }}>{d.emoji||'🗺️'}</span>
                <span style={{ flex:1, color:'#e2d9c5', fontSize:'0.84rem' }}>{d._savedName}</span>
                <span style={{ color:'#475569', fontSize:'0.72rem' }}>{d.rooms?.length} stanze</span>
                <Btn onClick={()=>{ setPreview(d); setStatus(`📂 "${d._savedName}" caricato.`); }} color='#6366f1' bg='rgba(99,102,241,0.15)'>📂 Carica</Btn>
                <button onClick={()=>{ if(window.confirm(`Eliminare "${d._savedName}"?`)) deleteFromLibrary(d._savedName); }} style={{ background:'rgba(127,29,29,0.2)', border:'1px solid #7f1d1d', borderRadius:6, color:'#fca5a5', cursor:'pointer', fontSize:'0.75rem', padding:'3px 8px' }}>🗑️</button>
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:10, alignItems:'center' }}>
              <input value={libName} onChange={e=>setLibName(e.target.value)} placeholder='Nome da salvare (opz.)' style={{ ...IS, flex:1 }} />
              <Btn onClick={saveToLibrary} disabled={!preview} color='#f59e0b' bg='rgba(245,158,11,0.15)'>💾 Salva in libreria</Btn>
            </div>
          </div>
        )}
        {!showLib && library.length > 0 && (
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {library.map(d => (
              <button key={d._savedName} onClick={()=>{ setPreview(d); setStatus(`📂 "${d._savedName}" caricato.`); }} style={{ padding:'3px 10px', background:'rgba(99,102,241,0.15)', border:'1px solid #6366f155', borderRadius:6, color:'#a5b4fc', cursor:'pointer', fontSize:'0.75rem' }}>{d.emoji||'🗺️'} {d._savedName}</button>
            ))}
          </div>
        )}
      </section>

      {/* ── Status & Actions ── */}
      {status && <div style={{ padding:'0.6rem 1rem', background:'rgba(15,23,42,0.8)', border:'1px solid #1e3a5f', borderRadius:8, color:'#e2d9c5', fontSize:'0.82rem', marginBottom:'0.8rem' }}>{status}</div>}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <Btn onClick={handleLaunch} disabled={!preview||loading} color='#22c55e' bg='rgba(34,197,94,0.15)'>🚀 Avvia Dungeon</Btn>
        <Btn onClick={handleStop} disabled={loading} color='#ef4444' bg='rgba(127,29,29,0.2)'>🛑 Termina Dungeon</Btn>
      </div>
    </div>
  );
}

function MasterGuildsView() {
  const [guilds, setGuilds] = useState({});
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try { setGuilds(await dbGetAllGuilds()); } finally { setLoading(false); }
  }
  useEffect(() => { reload(); }, []);

  async function handleDeleteGuild(guildId, guildName) {
    if(!window.confirm(`Eliminare la gilda "${guildName}"?\nTutti i membri verranno rimossi dalla gilda.`)) return;
    const next = { ...guilds };
    delete next[guildId];
    await dbSaveAllGuilds(next);
    setGuilds(next);
  }

  async function handleGuildXp(guildId, guild, sign) {
    const amt = parseInt(window.prompt(`${sign > 0 ? "Aggiungi" : "Rimuovi"} XP alla gilda "${guild.name}":`, "100"), 10);
    if(!amt || isNaN(amt)) return;
    const newXp = Math.max(0, (guild.xp || 0) + sign * amt);
    const updated = { ...guild, xp: newXp, level: getGuildLevel(newXp) };
    const next = { ...guilds, [guildId]: updated };
    await dbSaveAllGuilds(next);
    setGuilds(next);
  }

  async function handleRemoveMember(guildId, guild, memberId) {
    const member = (guild.members || []).find(m => m.id === memberId);
    if(!member) return;
    if(!window.confirm(`Rimuovere ${member.name} dalla gilda "${guild.name}"?`)) return;
    const newMembers = (guild.members || []).filter(m => m.id !== memberId);
    const updated = { ...guild, members: newMembers };
    if(updated.leaderId === memberId) updated.leaderId = newMembers[0]?.id || null;
    const next = { ...guilds, [guildId]: updated };
    await dbSaveAllGuilds(next);
    setGuilds(next);
  }

  async function handleDeleteMission(guildId, guild, missionId) {
    if(!window.confirm("Eliminare questa missione di gilda?")) return;
    const updated = { ...guild, missions: (guild.missions || []).filter(m => m.id !== missionId) };
    const next = { ...guilds, [guildId]: updated };
    await dbSaveAllGuilds(next);
    setGuilds(next);
  }

  async function handleCompleteMission(guildId, guild, missionId) {
    const mission = (guild.missions || []).find(m => m.id === missionId);
    if(!mission) return;
    const newXp = (guild.xp || 0) + (mission.rewardXp || 0);
    const updated = { ...guild, xp: newXp, level: getGuildLevel(newXp), missions: (guild.missions || []).map(m => m.id === missionId ? { ...m, completed: true, progress: m.goal } : m) };
    const next = { ...guilds, [guildId]: updated };
    await dbSaveAllGuilds(next);
    setGuilds(next);
    window.alert(`✅ Missione completata! +${mission.rewardXp} XP alla gilda.`);
  }

  const guildList = Object.values(guilds);

  if(loading) return <div style={{ color:"#94a3b8", padding:"2rem" }}>Caricamento gilde...</div>;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <p style={{ color:"#94a3b8", fontSize:"0.85rem", margin:0 }}>{guildList.length} gilde nel mondo</p>
        <SmallBtn onClick={reload}>🔄 Aggiorna</SmallBtn>
      </div>
      {!guildList.length && (
        <div style={{ color:"#94a3b8", textAlign:"center", padding:"3rem", border:"1px dashed #374151", borderRadius:6 }}>Nessuna gilda ancora.</div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:14 }}>
        {guildList.map(guild => {
          const members = guild.members || [];
          const missions = guild.missions || [];
          return (
            <div key={guild.id} style={{ background:"rgba(15,23,42,0.88)", border:"1px solid rgba(109,40,217,0.35)", borderRadius:10, padding:"1rem" }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:"1.8rem" }}>{guild.emoji || "⚔️"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontWeight:700, fontSize:"1rem" }}>{guild.name}</div>
                  <div style={{ fontSize:"0.7rem", color:"#7c3aed" }}>Livello {guild.level || 1} · {guild.xp || 0} XP</div>
                  <div style={{ fontSize:"0.65rem", color:"#64748b" }}>Fondatore: {guild.leaderName || "—"}</div>
                </div>
                <SmallBtn red onClick={() => handleDeleteGuild(guild.id, guild.name)}>✕ Elimina</SmallBtn>
              </div>

              {/* XP bar */}
              <div style={{ height:4, background:"rgba(30,41,59,0.7)", borderRadius:2, overflow:"hidden", marginBottom:8 }}>
                <div style={{ height:"100%", width:`${Math.min(100, ((guild.xp||0) % 500) / 5)}%`, background:"linear-gradient(90deg,#6d28d9,#a78bfa)", borderRadius:2 }} />
              </div>

              {/* XP controls */}
              <div style={{ display:"flex", gap:5, marginBottom:10 }}>
                <SmallBtn onClick={() => handleGuildXp(guild.id, guild, 1)}>+ XP</SmallBtn>
                <SmallBtn red onClick={() => handleGuildXp(guild.id, guild, -1)}>- XP</SmallBtn>
              </div>

              {/* Members */}
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:"0.65rem", color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>👥 Membri ({members.length})</div>
                {members.map(m => (
                  <div key={m.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 6px", borderRadius:4, background:"rgba(30,41,59,0.5)", marginBottom:3 }}>
                    <span style={{ fontSize:"0.75rem", color: m.id === guild.leaderId ? "#fbbf24" : "#e2e8f0", flex:1 }}>
                      {m.id === guild.leaderId ? "👑 " : ""}{m.name}
                      <span style={{ color:"#64748b", marginLeft:4, fontSize:"0.65rem" }}>({m.role || "member"})</span>
                    </span>
                    {m.id !== guild.leaderId && (
                      <SmallBtn red onClick={() => handleRemoveMember(guild.id, guild, m.id)} style={{ fontSize:"0.55rem", padding:"1px 5px" }}>✕</SmallBtn>
                    )}
                  </div>
                ))}
                {!members.length && <div style={{ fontSize:"0.7rem", color:"#4b5563" }}>Nessun membro</div>}
              </div>

              {/* Missions */}
              {missions.length > 0 && (
                <div>
                  <div style={{ fontSize:"0.65rem", color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>📋 Missioni ({missions.length})</div>
                  {missions.map(m => (
                    <div key={m.id} style={{ background:"rgba(30,41,59,0.5)", borderRadius:4, padding:"5px 8px", marginBottom:4, border:`1px solid ${m.completed ? "rgba(34,197,94,0.3)" : "rgba(75,85,99,0.4)"}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:"0.75rem", color: m.completed ? "#4ade80" : "#e2e8f0", flex:1, fontWeight:600 }}>{m.title}</span>
                        <span style={{ fontSize:"0.62rem", color:"#94a3b8" }}>{m.progress||0}/{m.goal} · +{m.rewardXp}XP</span>
                      </div>
                      <div style={{ display:"flex", gap:4, marginTop:4 }}>
                        {!m.completed && <SmallBtn onClick={() => handleCompleteMission(guild.id, guild, m.id)} style={{ fontSize:"0.6rem", padding:"1px 6px" }}>✅ Completa</SmallBtn>}
                        <SmallBtn red onClick={() => handleDeleteMission(guild.id, guild, m.id)} style={{ fontSize:"0.6rem", padding:"1px 6px" }}>✕</SmallBtn>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlayersView({ authUser }) {
  const [players, setPlayers] = useState([]);
  const [partyStates, setPartyStates] = useState({});
  const [playerMeta, setPlayerMeta] = useState({});
  const [busy, setBusy] = useState({});
  const [legendaryGrant, setLegendaryGrant] = useState({}); // { [playerId]: { itemId, turns } }

  useEffect(()=>{
    const load = async () => {
      const [{ data }, meta] = await Promise.all([
        supabase.from("players").select("*").order("level", { ascending:false }),
        dbGetPlayerMasterMeta().catch(() => ({})),
      ]);
      setPlayers(data||[]);
      setPlayerMeta(meta || {});
      // load party states for buff display
      const codes = [...new Set((data||[]).map(p=>p.party_code).filter(Boolean))];
      const states = {};
      await Promise.all(codes.map(async code=>{
        const ps = await dbGetPartyState(code).catch(()=>null);
        if(ps) states[code] = ps;
      }));
      setPartyStates(states);
    };
    load();
    const interval = setInterval(load, 4000);
    return ()=>clearInterval(interval);
  },[]);

  // Direct partial update — avoids the camelCase/snake_case bug in dbSavePlayer
  async function masterUpdate(playerId, fields, optimistic) {
    setBusy(b=>({...b,[playerId]:true}));
    await supabase.from("players").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", playerId);
    setPlayers(prev=>prev.map(x=>x.id===playerId?{...x,...optimistic}:x));
    setBusy(b=>({...b,[playerId]:false}));
  }
  async function masterUpdatePlayer(p, fields, optimistic) {
    await masterUpdate(p.id, fields, optimistic);
    if(p.party_code && ("hp" in optimistic || "dead" in optimistic || "max_hp" in optimistic)) {
      await dbSyncCombatantPlayer(p.party_code, p.id, {
        hp: optimistic.hp,
        maxHp: optimistic.max_hp ?? p.max_hp,
        dead: optimistic.dead,
      });
      const refreshed = await dbGetPartyState(p.party_code);
      setPartyStates(prev=>({...prev,[p.party_code]:refreshed}));
    }
  }

  async function masterGrantLegendary(p, itemId, turns) {
    const code = p.party_code;
    if(!code) { window.alert("Questo giocatore non è in un party attivo."); return; }
    const item = LEGENDARY_ITEMS.find(i => i.id === itemId);
    if(!item) return;
    const currentState = await dbGetPartyState(code);
    const currentBuffs = currentState.masterBuffs || {};
    const playerBuffs = currentBuffs[p.id] || {};
    const legendaryItem = turns > 0 ? { ...item, turnsLeft: turns } : null;
    const newState = { ...currentState, masterBuffs: { ...currentBuffs, [p.id]: { ...playerBuffs, legendaryItem } } };
    await dbSavePartyState(code, newState);
    setPartyStates(prev=>({...prev,[code]:newState}));
    if(turns > 0) window.alert(`✅ ${item.emoji} ${item.name} donato a ${p.name} per ${turns} turni.`);
    else window.alert(`✅ Oggetto leggendario rimosso da ${p.name}`);
  }
  async function masterSetBuff(p, buffKey, turns) {
    const code = p.party_code;
    if(!code) { window.alert("Questo giocatore non è in un party attivo."); return; }
    const currentState = await dbGetPartyState(code);
    const currentBuffs = currentState.masterBuffs || {};
    const playerBuffs = currentBuffs[p.id] || {};
    const newState = { ...currentState, masterBuffs: { ...currentBuffs, [p.id]: { ...playerBuffs, [buffKey]: turns } } };
    await dbSavePartyState(code, newState);
    setPartyStates(prev=>({...prev,[code]:newState}));
    window.alert(`✅ ${buffKey === "immortal" ? "Immortalità" : "Tiri Critici"} attivata per ${p.name} (${turns} turni)`);
  }
  async function masterDeletePlayer(p) {
    if(!p?.id) return;
    if(!window.confirm(`Eliminare definitivamente ${p.name}?\n\nVerranno cancellati il personaggio e i suoi oggetti.`)) return;
    setBusy(b=>({...b,[p.id]:true}));
    try {
      if(p.party_code) await dbRemovePlayerFromPartyState(p.party_code, p.id);
      await dbDeleteCharacter(p.id);
      setPlayers(prev=>prev.filter(x=>x.id!==p.id));
      setPlayerMeta(prev=>{
        const next = { ...prev };
        delete next[p.id];
        return next;
      });
      if(p.party_code) {
        const refreshed = await dbGetPartyState(p.party_code);
        setPartyStates(prev=>({...prev,[p.party_code]:refreshed}));
      }
    } catch(e) {
      window.alert("Errore eliminazione giocatore: " + (e?.message || e));
    } finally {
      setBusy(b=>({...b,[p.id]:false}));
    }
  }

  return (
    <div>
      {!canAccessMasterPanel(authUser) && (
        <div style={{ background:"rgba(127,29,29,0.78)", border:"1px solid #fca5a5", color:"#fff1f2", borderRadius:6, padding:"0.8rem 1rem", marginBottom:"1rem", fontSize:"0.82rem", lineHeight:1.45 }}>
          Per vedere tutti gli avventurieri devi accedere con l'account Master autorizzato. La sola password non ha i permessi database sui personaggi.
        </div>
      )}
      <p style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>{players.length} avventurieri — aggiornamento automatico</p>
      {!players.length && <div style={{ color:"#94a3b8", textAlign:"center", padding:"3rem", border:"1px dashed #374151", borderRadius:6 }}>Nessun giocatore ancora.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12 }}>
        {players.map(p=>{
          const cls=CLASSES[p?.class||'warrior']||{};
          const race=RACES[p?.race||'human']||{};
          const baseHp=(cls.hp||0)+(race.hpB||0);
          const baseAtk=(cls.atk||0)+(race.atkB||0);
          const baseDef=(cls.def||0)+(race.defB||0);
          const baseMag=(cls.mag||0)+(race.magB||0);
          const isBusy = !!busy[p.id];
          const pState = partyStates[p.party_code] || {};
          const pBuffs = (pState.masterBuffs || {})[p.id] || {};
          const masterMeta = playerMeta[p.id] || {};
          return (
            <div key={p?.id} style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(148,163,184,0.2)", borderRadius:10, padding:"1rem" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                <ArtThumb src={getPlayerPortrait({ id:p?.id, class:p?.class, race:p?.race, gender:p?.gender, portrait:p?.portrait, image:p?.image })} alt={p?.name||"PG"} size={56} radius={12} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, fontSize:"0.95rem" }}>{p?.name}</div>
                  {masterMeta.realPlayerName && <div style={{ color:"#fbbf24", fontSize:"0.72rem", marginTop:2 }}>Giocatore: {masterMeta.realPlayerName}</div>}
                  <div style={{ color:"#94a3b8", fontSize:"0.7rem" }}>{race.emoji} {race.name} · {cls.name} · Lv.{p?.level||1}</div>
                  <div style={{ color:"#94a3b8", fontSize:"0.68rem", marginTop:2 }}>❤️ {p?.hp||0}/{p?.max_hp||0} · 💰 {p?.gold||0} · ⭐ {p?.xp||0} XP</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                    <span style={{ color:"#4b5563", fontSize:"0.6rem", fontFamily:"monospace" }}>ID: {p?.id}</span>
                    <button onClick={()=>{ navigator.clipboard?.writeText(p?.id||""); window.alert("ID copiato!"); }} style={{ fontSize:"0.55rem", padding:"1px 5px", background:"rgba(30,41,59,0.6)", border:"1px solid #334155", borderRadius:3, color:"#64748b", cursor:"pointer" }}>📋 copia</button>
                  </div>
                </div>
                {p?.dead && <span style={{ padding:"2px 8px", background:"rgba(127,29,29,0.5)", border:"1px solid #ef4444", borderRadius:4, fontSize:"0.65rem", color:"#fca5a5" }}>💀 MORTO</span>}
              </div>
              <HpBar cur={p?.hp||0} max={p?.max_hp||0} />
              {(pBuffs.immortal > 0 || pBuffs.crit > 0 || pBuffs.legendaryItem) && (
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                  {pBuffs.immortal > 0 && <span style={{ fontSize:"0.68rem", color:"#fbbf24", background:"rgba(180,83,9,0.25)", border:"1px solid #fbbf24", borderRadius:999, padding:"1px 8px" }}>🛡️ Immortale {pBuffs.immortal}t</span>}
                  {pBuffs.crit > 0 && <span style={{ fontSize:"0.68rem", color:"#f87171", background:"rgba(127,29,29,0.25)", border:"1px solid #ef4444", borderRadius:999, padding:"1px 8px" }}>⚔️ Critico {pBuffs.crit}t</span>}
                  {pBuffs.legendaryItem && <span style={{ fontSize:"0.68rem", color:"#c4b5fd", background:"rgba(76,29,149,0.35)", border:"1px solid #7c3aed", borderRadius:999, padding:"1px 8px" }}>{pBuffs.legendaryItem.emoji} {pBuffs.legendaryItem.name} {pBuffs.legendaryItem.turnsLeft}t</span>}
                </div>
              )}

              {/* Azioni base */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10, paddingTop:10, borderTop:"1px solid rgba(148,163,184,0.1)" }}>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  await masterUpdatePlayer(p, { hp: p.max_hp, dead:false }, { hp: p.max_hp, dead:false });
                }}>❤️ Cura tutto</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  const amt = parseInt(window.prompt(`Quanti HP curare a ${p.name}?`, "10"),10);
                  if(!amt||isNaN(amt)) return;
                  const newHp = Math.min(p.max_hp, (p.hp||0)+amt);
                  await masterUpdatePlayer(p, { hp: newHp, dead:false }, { hp: newHp, dead:false });
                }}>💊 Cura parziale</SmallBtn>
                {p?.dead && <SmallBtn disabled={isBusy} onClick={async()=>{
                  await masterUpdatePlayer(p, { hp:1, dead:false }, { hp:1, dead:false });
                }}>✨ Resurrezione</SmallBtn>}
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  const add = parseInt(window.prompt(`Quanto oro a ${p.name}?`, "50"),10);
                  if(!add||isNaN(add)) return;
                  await masterUpdate(p.id, { gold:(p.gold||0)+add }, { gold:(p.gold||0)+add });
                }}>💰 Dai oro</SmallBtn>
                <SmallBtn disabled={isBusy} red onClick={async()=>{
                  const rem = parseInt(window.prompt(`Quanto oro togliere a ${p.name}?`, "50"),10);
                  if(!rem||isNaN(rem)) return;
                  const newGold = Math.max(0,(p.gold||0)-rem);
                  await masterUpdate(p.id, { gold:newGold }, { gold:newGold });
                }}>- Oro</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  const add = parseInt(window.prompt(`Quanta XP a ${p.name}?`, "50"),10);
                  if(!add||isNaN(add)) return;
                  await masterUpdate(p.id, { xp:(p.xp||0)+add }, { xp:(p.xp||0)+add });
                }}>⭐ Dai XP</SmallBtn>
                <SmallBtn disabled={isBusy} red onClick={async()=>{
                  const rem = parseInt(window.prompt(`Quanta XP togliere a ${p.name}?`, "50"),10);
                  if(!rem||isNaN(rem)) return;
                  const newXp = Math.max(0,(p.xp||0)-rem);
                  await masterUpdate(p.id, { xp:newXp }, { xp:newXp });
                }}>- XP</SmallBtn>
              </div>

              {/* Poteri divini */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8, paddingTop:8, borderTop:"1px solid rgba(251,191,36,0.15)" }}>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  await masterUpdatePlayer(p, { hp: p.max_hp, dead:false }, { hp: p.max_hp, dead:false });
                  // Also send a divine message if in party
                  if(p.party_code) await supabase.from("messages").insert({ party_code:p.party_code, author:"Dungeon Master", content:`✨ **Aiuto Divino!** Una luce celestiale avvolge **${p.name}** e lo riporta in piena salute!`, type:"narration" });
                }}>✨ Aiuto Divino</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={()=>masterSetBuff(p,"immortal",10)}>🛡️ Immortale (10t)</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={()=>masterSetBuff(p,"crit",10)}>⚔️ Critici (10t)</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  const xpStr = window.prompt(`Dona XP gilda a ${p.name} (alla sua gilda):`);
                  const xpAmt = parseInt(xpStr||"0");
                  if(!xpAmt||xpAmt<=0) return;
                  const allGuilds = await dbGetAllGuilds();
                  const pg = getPlayerGuild(allGuilds, p.id);
                  if(!pg) { window.alert("Questo player non è in nessuna gilda."); return; }
                  const newXp=(pg.xp||0)+xpAmt;
                  const newG={...pg,xp:newXp,level:getGuildLevel(newXp)};
                  await dbSaveAllGuilds({...allGuilds,[pg.id]:newG});
                  window.alert(`✅ +${xpAmt} XP alla gilda ${pg.name}`);
                }}>🏛️ XP Gilda</SmallBtn>
                <SmallBtn disabled={isBusy} red onClick={async()=>{
                  if(!window.confirm(`Reset completo di ${p.name}?`)) return;
                  await masterUpdatePlayer(p, { level:1,xp:0,gold:0,hp:baseHp,max_hp:baseHp,atk:baseAtk,def:baseDef,mag:baseMag,dead:false },
                    { level:1,xp:0,gold:0,hp:baseHp,max_hp:baseHp,atk:baseAtk,def:baseDef,mag:baseMag,dead:false });
                }}>🔄 Reset PG</SmallBtn>
                <SmallBtn disabled={isBusy} red onClick={()=>masterDeletePlayer(p)}>Elimina PG</SmallBtn>
              </div>

              {/* Oggetti Leggendari */}
              <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid rgba(167,139,250,0.2)" }}>
                <div style={{ color:"#a78bfa", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>🏆 Dono Leggendario</div>
                {pBuffs.legendaryItem && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, background:"rgba(76,29,149,0.25)", border:"1px solid #7c3aed", borderRadius:4, padding:"4px 8px" }}>
                    <span style={{ fontSize:"0.8rem" }}>{pBuffs.legendaryItem.emoji} <strong style={{ color:"#c4b5fd" }}>{pBuffs.legendaryItem.name}</strong> — {pBuffs.legendaryItem.turnsLeft} turni rimasti</span>
                    <SmallBtn disabled={isBusy} onClick={()=>masterGrantLegendary(p, pBuffs.legendaryItem.id, 0)} style={{ marginLeft:"auto", fontSize:"0.6rem", padding:"1px 6px" }}>✕</SmallBtn>
                  </div>
                )}
                <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:4 }}>
                  <select
                    value={(legendaryGrant[p.id]?.itemId) || ""}
                    onChange={e=>setLegendaryGrant(prev=>({...prev,[p.id]:{...prev[p.id],itemId:e.target.value}}))}
                    style={{ flex:1, minWidth:120, background:"rgba(15,23,42,0.9)", border:"1px solid #7c3aed", borderRadius:4, color:"#e2e8f0", fontSize:"0.72rem", padding:"3px 6px" }}
                  >
                    <option value="">-- Scegli oggetto --</option>
                    {[
                      { label:"🌌 Reliquie di Zodar", items: LEGENDARY_ITEMS.filter(i=>i.id.startsWith("leg_zodar")) },
                      { label:"⚔️ Armi", items: LEGENDARY_ITEMS.filter(i=>i.type==="weapon"&&!i.id.startsWith("leg_zodar")) },
                      { label:"🛡️ Armature", items: LEGENDARY_ITEMS.filter(i=>i.type==="armor"&&!i.id.startsWith("leg_zodar")) },
                      { label:"🌟 Focus magici", items: LEGENDARY_ITEMS.filter(i=>i.type==="magic"&&!i.id.startsWith("leg_zodar")) },
                    ].map(group=>(
                      <optgroup key={group.label} label={group.label}>
                        {group.items.map(item=>(
                          <option key={item.id} value={item.id}>{item.emoji} {item.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {legendaryGrant[p.id]?.itemId && (() => {
                  const item = LEGENDARY_ITEMS.find(i=>i.id===legendaryGrant[p.id]?.itemId);
                  if(!item) return null;
                  const statLine = [
                    item.bonus_atk ? `+${item.bonus_atk} ATK` : null,
                    item.bonus_def ? `+${item.bonus_def} DEF` : null,
                    item.bonus_mag ? `+${item.bonus_mag} MAG` : null,
                    item.weapon_die ? `dado ${item.weapon_die}` : null,
                  ].filter(Boolean).join(" · ");
                  return (
                    <div style={{ fontSize:"0.65rem", color:"#94a3b8", marginBottom:4, padding:"3px 4px", background:"rgba(15,23,42,0.5)", borderRadius:3 }}>
                      {item.desc} · <span style={{ color:"#c4b5fd" }}>{statLine}</span>
                    </div>
                  );
                })()}
                <div style={{ display:"flex", gap:4 }}>
                  {[10,20,30].map(t=>(
                    <SmallBtn key={t} disabled={isBusy||!legendaryGrant[p.id]?.itemId}
                      onClick={()=>masterGrantLegendary(p, legendaryGrant[p.id]?.itemId, t)}
                      style={{ flex:1, fontSize:"0.68rem" }}>
                      {t} turni
                    </SmallBtn>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PartiesView({ authUser }) {
  const [parties, setParties] = useState([]);
  const [partyPlayers, setPartyPlayers] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);
  const [playerMeta, setPlayerMeta] = useState({});
  const [working, setWorking] = useState({});
  const [banTarget, setBanTarget] = useState({});
  const [assignTarget, setAssignTarget] = useState({});
  const [newCode, setNewCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState({});
  const [error, setError] = useState(null);

  const reload = async () => {
    const [{ data, error }, { data: stateRows, error: stateError }, meta] = await Promise.all([
      supabase.from("players").select("id,name,party_code,class,level,hp,max_hp"),
      supabase.from("party_state").select("party_code"),
      dbGetPlayerMasterMeta().catch(() => ({})),
    ]);
    if(error || stateError) {
      setError((error || stateError)?.message || "Impossibile caricare i party");
      return;
    }
    setError(null);
    setAllPlayers(data || []);
    setPlayerMeta(meta || {});
    const codes = Array.from(new Set([
      ...(stateRows || []).map(r=>r.party_code).filter(Boolean),
      ...(data || []).map(r=>r.party_code).filter(Boolean),
    ])).sort();
    setParties(codes);
    const grouped = {};
    for(const p of (data||[])) {
      if(!p.party_code) continue;
      if(!grouped[p.party_code]) grouped[p.party_code] = [];
      grouped[p.party_code].push(p);
    }
    setPartyPlayers(grouped);
  };

  useEffect(()=>{
    let active = true;
    const load = async () => { if(active) await reload(); };
    load();
    const interval = setInterval(load, 5000);
    return ()=>{ active=false; clearInterval(interval); };
  },[]);

  const handleCreateParty = async () => {
    const code = newCode.trim().toUpperCase() || Math.random().toString(36).slice(2,6).toUpperCase();
    if(parties.includes(code)) { alert(`Il party "${code}" esiste gia'!`); return; }
    setCreating(true);
    try {
      await dbSavePartyState(code, { currentId:null, step:0, active:false, completed:[], combat:null });
      setParties(prev=>prev.includes(code) ? prev : [...prev, code].sort());
      setPartyPlayers(prev=>({...prev, [code]: prev[code] || []}));
      setNewCode("");
      await reload();
      alert(`Party "${code}" creato!\nCondividi questo codice con i tuoi giocatori.`);
    } catch(e) {
      alert("Errore creazione party: " + (e?.message || e));
    } finally { setCreating(false); }
  };

  const handleAssignPlayer = async (partyCode) => {
    const pid = assignTarget[partyCode];
    if(!pid) { alert("Seleziona un giocatore."); return; }
    const player = allPlayers.find(p=>p.id===pid);
    if(!player) return;
    setWorking(w=>({...w,[partyCode+"_assign"]:true}));
    try {
      await supabase.from("players").update({ party_code: partyCode, updated_at: new Date().toISOString() }).eq("id", pid);
      if(playerMeta[pid]?.realPlayerName) {
        await dbSavePlayerMasterMeta({
          playerId: pid,
          partyCode,
          heroName: player.name,
          realPlayerName: playerMeta[pid].realPlayerName,
        });
      }
      await reload();
      setAssignTarget(prev=>({...prev,[partyCode]:""}));
      alert(`${player.name} assegnato al party ${partyCode}!\nIl giocatore deve ricaricare la pagina.`);
    } catch(e) {
      alert("Errore assegnazione: " + (e?.message || e));
    } finally { setWorking(w=>({...w,[partyCode+"_assign"]:false})); }
  };

  const handleAction = async (partyCode, action) => {
    setWorking(w=>({ ...w, [partyCode]: action }));
    try {
      if(action === "combat") await resetPartyCombat(partyCode);
      if(action === "campaign") await resetPartyCampaign(partyCode);
      if(action === "delete") { await deleteParty(partyCode); await reload(); }
    } finally { setWorking(w=>({ ...w, [partyCode]: null })); }
  };

  const handleResetStoria = async (partyCode) => {
    if(!window.confirm(`Reset storia completo per party ${partyCode}?\nVerranno cancellati messaggi e stato missione.`)) return;
    setWorking(w=>({...w,[partyCode]:"storia"}));
    try {
      const state = await dbGetPartyState(partyCode);
      await dbSavePartyState(partyCode, {...state, combat:null, currentId:null, step:0, active:false, completed:[]});
      await dbDeleteMessages(partyCode);
    } finally { setWorking(w=>({...w,[partyCode]:null})); }
  };

  const handleTerminaCombattimento = async (partyCode) => {
    if(!window.confirm(`Terminare il combattimento in corso per party ${partyCode}?`)) return;
    setWorking(w=>({...w,[partyCode]:"combat"}));
    try { await resetPartyCombat(partyCode); }
    finally { setWorking(w=>({...w,[partyCode]:null})); }
  };

  const handleBanna = async (partyCode) => {
    const pid = banTarget[partyCode];
    if(!pid) { alert("Seleziona un giocatore da bannare."); return; }
    const player = (partyPlayers[partyCode]||[]).find(p=>p.id===pid);
    if(!window.confirm(`Bannare ${player?.name}? Il giocatore verrà rimosso dal party. Azione irreversibile.`)) return;
    setWorking(w=>({...w,[partyCode]:"ban"}));
    try {
      await supabase.from("players").delete().eq("id", pid);
      await reload();
      setBanTarget(prev=>({...prev,[partyCode]:""}));
    } finally { setWorking(w=>({...w,[partyCode]:null})); }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(()=>{
      setCopied(c=>({...c,[code]:true}));
      setTimeout(()=>setCopied(c=>({...c,[code]:false})), 2000);
    });
  };

  const dangerBtn = { background:"#dc2626", color:"white", fontWeight:"bold", padding:"8px 16px", borderRadius:"6px", margin:"4px", border:"none", cursor:"pointer", fontSize:"0.82rem" };

  return (
    <div>
      {!canAccessMasterPanel(authUser) && (
        <div style={{ background:"rgba(127,29,29,0.78)", border:"1px solid #fca5a5", color:"#fff1f2", borderRadius:6, padding:"0.8rem 1rem", marginBottom:"1rem", fontSize:"0.82rem", lineHeight:1.45 }}>
          Per assegnare player ai party devi accedere con l'account Master autorizzato. Se entri solo con la password, Supabase non mostra i personaggi e il menu resta a 0 disponibili.
        </div>
      )}
      {/* Crea nuovo party */}
      <div style={{ marginBottom:"1.5rem", background:"rgba(99,102,241,0.08)", border:"1px solid #4338ca", borderRadius:8, padding:"1rem" }}>
        <div style={{ fontFamily:"'Cinzel',serif", color:"#a5b4fc", fontSize:"0.9rem", fontWeight:700, marginBottom:"0.75rem" }}>✨ Crea Nuovo Party</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <input
            value={newCode}
            onChange={e=>setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8))}
            placeholder="Codice (es: ALFA) — vuoto = auto"
            style={{ flex:1, minWidth:180, background:"#0f172a", border:"1px solid #4338ca", color:"#e2d9c5", padding:"8px 10px", borderRadius:6, fontSize:"0.85rem", fontFamily:"monospace", letterSpacing:"0.15em" }}
          />
          <SmallBtn disabled={creating} onClick={handleCreateParty}>{creating ? "Creazione..." : "Crea Party"}</SmallBtn>
        </div>
        {allPlayers.filter(p=>!p.party_code).length > 0 && (
          <div style={{ marginTop:8, fontSize:"0.73rem", color:"#94a3b8" }}>
            Giocatori senza party: {allPlayers.filter(p=>!p.party_code).map(p=>p.name).join(", ")}
          </div>
        )}
      </div>

      <p style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>{parties.length} party trovati � aggiornamento automatico</p>
      {error && <div style={{ color:"#fca5a5", marginBottom:"1rem" }}>{error}</div>}
      {!parties.length && <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun party ancora. Creane uno sopra.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:12 }}>
        {parties.map(code=>{
          const members = partyPlayers[code] || [];
          const availablePlayers = allPlayers.filter(p => p.id && p.party_code !== code);
          const playersWithoutParty = availablePlayers.filter(p => !p.party_code);
          const playersFromOtherParties = availablePlayers.filter(p => p.party_code);
          return (
            <div key={code} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:8, padding:"1rem" }}>
              {/* Intestazione */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, fontSize:"1rem" }}>
                  Party: <span style={{ color:"#fbbf24", letterSpacing:"0.18em", fontFamily:"monospace" }}>{code}</span>
                </div>
                <button onClick={()=>copyCode(code)}
                  style={{ background:"rgba(251,191,36,0.1)", border:"1px solid #78350f", color:"#fbbf24", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:"0.72rem", whiteSpace:"nowrap" }}>
                  {copied[code] ? "Copiato!" : "Copia codice"}
                </button>
              </div>

              {/* Lista membri */}
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:"0.68rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Giocatori ({members.length})</div>
                {!members.length && <div style={{ color:"#374151", fontSize:"0.75rem", fontStyle:"italic" }}>Nessun membro ancora</div>}
                {members.map(p=>(
                  <div key={p.id} style={{ display:"flex", gap:6, alignItems:"center", padding:"4px 0", borderBottom:"1px solid #1a2030" }}>
                    <span style={{ fontSize:"0.85rem" }}>{CLASSES[p.class]?.emoji || "⚔️"}</span>
                    <span style={{ flex:1, fontSize:"0.8rem", color:"#d1d5db" }}>
                      {p.name}
                      {playerMeta[p.id]?.realPlayerName && <span style={{ display:"block", color:"#fbbf24", fontSize:"0.68rem", marginTop:2 }}>Giocatore: {playerMeta[p.id].realPlayerName}</span>}
                    </span>
                    <span style={{ fontSize:"0.68rem", color:"#64748b" }}>Lv.{p.level||1}</span>
                    <span style={{ fontSize:"0.68rem", color:(p.hp||0)/(p.max_hp||1)>0.5?"#4ade80":"#fca5a5" }}>{p.hp||0}/{p.max_hp||0} HP</span>
                  </div>
                ))}
              </div>

              {/* Aggiungi/sposta giocatore */}
              <div style={{ marginBottom:12, background:"rgba(30,41,59,0.92)", border:"1px solid #f59e0b", borderRadius:6, padding:"0.8rem", boxShadow:"0 10px 22px rgba(0,0,0,0.22)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.78rem", color:"#fef3c7", fontWeight:700, letterSpacing:"0.05em" }}>Aggiungi giocatore a questo party</div>
                  <span style={{ color:"#cbd5e1", fontSize:"0.68rem" }}>{availablePlayers.length} disponibili</span>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <select value={assignTarget[code]||""} onChange={e=>setAssignTarget(prev=>({...prev,[code]:e.target.value}))}
                    disabled={!availablePlayers.length}
                    style={{ flex:"1 1 220px", background:"#020617", border:"1px solid #94a3b8", color:"#f8fafc", padding:"8px 10px", borderRadius:4, fontSize:"0.82rem" }}>
                    <option value="">Seleziona giocatore...</option>
                    {playersWithoutParty.length > 0 && (
                      <optgroup label="Senza party">
                        {playersWithoutParty.map(p=>(
                          <option key={p.id} value={p.id}>{p.name}{playerMeta[p.id]?.realPlayerName ? ` - ${playerMeta[p.id].realPlayerName}` : ""} ({CLASSES[p.class]?.name||p.class})</option>
                        ))}
                      </optgroup>
                    )}
                    {playersFromOtherParties.length > 0 && (
                      <optgroup label="Da altri party">
                        {playersFromOtherParties.map(p=>(
                          <option key={p.id} value={p.id}>{p.name}{playerMeta[p.id]?.realPlayerName ? ` - ${playerMeta[p.id].realPlayerName}` : ""} [{p.party_code}]</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <SmallBtn disabled={!!working[code+"_assign"]} onClick={()=>handleAssignPlayer(code)}>
                    {working[code+"_assign"] ? "Sposto..." : "Aggiungi al party"}
                  </SmallBtn>
                </div>
                {!availablePlayers.length && <div style={{ color:"#94a3b8", fontSize:"0.72rem", marginTop:8 }}>Nessun altro giocatore disponibile da assegnare a questo party.</div>}
              </div>

              {/* Azioni */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                <SmallBtn disabled={!!working[code]} onClick={()=>handleAction(code, "combat")}>Reset Combattimento</SmallBtn>
                <SmallBtn disabled={!!working[code]} onClick={()=>{ if(window.confirm("Resetta chat e stato combattimento?")) handleAction(code, "campaign"); }}>Reset Campagna</SmallBtn>
                <SmallBtn red disabled={!!working[code]} onClick={()=>{ if(window.confirm("Eliminare completamente questo party?")) handleAction(code, "delete"); }}>Elimina</SmallBtn>
              </div>
              {working[code] && <div style={{ marginTop:4, color:"#a78bfa", fontSize:"0.78rem" }}>In corso: {working[code]}...</div>}

              {/* Zona pericolosa */}
              <div style={{ marginTop:8, background:"#1a0000", border:"1px solid #dc2626", borderRadius:6, padding:"0.8rem" }}>
                <div style={{ color:"#dc2626", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", fontWeight:700, marginBottom:8, letterSpacing:"0.05em" }}>Azioni Pericolose</div>
                <div style={{ display:"flex", flexWrap:"wrap" }}>
                  <button disabled={!!working[code]} onClick={()=>handleResetStoria(code)} style={dangerBtn}>Reset Storia</button>
                  <button disabled={!!working[code]} onClick={()=>handleTerminaCombattimento(code)} style={dangerBtn}>Termina Combattimento</button>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:6 }}>
                  <select value={banTarget[code]||""} onChange={e=>setBanTarget(prev=>({...prev,[code]:e.target.value}))}
                    style={{ flex:1, background:"#0a0000", border:"1px solid #7f1d1d", color:"#e2d9c5", padding:"6px 8px", borderRadius:4, fontSize:"0.78rem" }}>
                    <option value="">Banna giocatore...</option>
                    {members.map(p=>(
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button disabled={!!working[code]} onClick={()=>handleBanna(code)} style={dangerBtn}>Banna</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersView({ authUser }) {
  const [reportRows, setReportRows] = useState([]);
  const [stats, setStats] = useState({ accounts:0, characters:0, parties:0, withoutEmail:0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let active = true;
    const load = async () => {
      setLoading(true);
      const [{ data, error: playersErr }, userMeta, playerMeta] = await Promise.all([
        supabase.from("players").select("id,name,party_code,account_id,class,race,level,gold,xp,dead,updated_at").order("updated_at", { ascending:false }),
        dbGetUserMasterMeta().catch(() => ({})),
        dbGetPlayerMasterMeta().catch(() => ({})),
      ]);
      if(!active) return;
      if(playersErr) {
        setError(playersErr.message || "Impossibile caricare gli iscritti");
        setReportRows([]);
        setStats({ accounts:0, characters:0, parties:0, withoutEmail:0 });
      } else {
        setError(null);
        const byAccount = {};
        for(const meta of Object.values(userMeta || {})) {
          byAccount[meta.userId] = { userId: meta.userId, email: meta.email, registeredAt: meta.registeredAt, lastSeenAt: meta.lastSeenAt, characters: [] };
        }
        for(const p of (data || [])) {
          const accountId = p.account_id || `no_account:${p.id}`;
          if(!byAccount[accountId]) byAccount[accountId] = { userId: accountId, email: "", registeredAt: "", lastSeenAt: "", characters: [] };
          byAccount[accountId].characters.push({ ...p, realPlayerName: playerMeta?.[p.id]?.realPlayerName || "" });
        }
        const rows = Object.values(byAccount).sort((a,b) => {
          const ad = a.lastSeenAt || a.registeredAt || "";
          const bd = b.lastSeenAt || b.registeredAt || "";
          return bd.localeCompare(ad);
        });
        setReportRows(rows);
        setStats({
          accounts: rows.length,
          characters: (data || []).length,
          parties: new Set((data || []).map(p=>p.party_code).filter(Boolean)).size,
          withoutEmail: rows.filter(r=>!r.email).length,
        });
      }
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 5000);
    return ()=>{ active = false; clearInterval(interval); };
  },[]);

  return (
    <div>
      {!canAccessMasterPanel(authUser) && (
        <div style={{ background:"rgba(127,29,29,0.78)", border:"1px solid #fca5a5", color:"#fff1f2", borderRadius:6, padding:"0.8rem 1rem", marginBottom:"1rem", fontSize:"0.82rem", lineHeight:1.45 }}>
          Per vedere email e report completi devi accedere con l'account Master autorizzato. I nuovi utenti verranno tracciati da ora in poi al momento di registrazione/login.
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10, marginBottom:"1rem" }}>
        {[
          ["Account", stats.accounts],
          ["Personaggi", stats.characters],
          ["Party attivi", stats.parties],
          ["Senza email storica", stats.withoutEmail],
        ].map(([label,value])=>(
          <div key={label} style={{ background:"rgba(15,23,42,0.88)", border:"1px solid #334155", borderRadius:6, padding:"0.85rem" }}>
            <div style={{ color:"#94a3b8", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
            <div style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontSize:"1.35rem", fontWeight:700 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>Report iscritti: email account, personaggi collegati, party e nome/cognome giocatore quando disponibile.</div>
      {error && <div style={{ color:"#fca5a5", marginBottom:"1rem" }}>{error}</div>}
      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}
      {!loading && !reportRows.length && <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun iscritto trovato.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:10 }}>
        {reportRows.map(u=>(
          <div key={u.userId} style={{ background:"rgba(15,23,42,0.86)", border:"1px solid #334155", borderRadius:6, padding:"0.9rem" }}>
            <div style={{ fontFamily:"'Cinzel',serif", color:u.email?"#e2d9c5":"#fca5a5", fontWeight:700, wordBreak:"break-word" }}>{u.email || "Email non disponibile (utente storico)"}</div>
            <div style={{ fontSize:"0.68rem", color:"#64748b", marginTop:2, wordBreak:"break-all" }}>{u.userId}</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8, fontSize:"0.72rem", color:"#94a3b8" }}>
              <span>PG: {u.characters.length}</span>
              {u.registeredAt && <span>Registrato: {new Date(u.registeredAt).toLocaleDateString("it-IT")}</span>}
              {u.lastSeenAt && <span>Ultimo accesso: {new Date(u.lastSeenAt).toLocaleDateString("it-IT")}</span>}
            </div>
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:6 }}>
              {!u.characters.length && <div style={{ color:"#64748b", fontSize:"0.76rem", fontStyle:"italic" }}>Nessun personaggio creato.</div>}
              {u.characters.map(ch=>(
                <div key={ch.id} style={{ background:"rgba(2,6,23,0.62)", border:"1px solid #1e293b", borderRadius:5, padding:"0.55rem 0.65rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"center" }}>
                    <strong style={{ color:"#f8fafc", fontSize:"0.85rem" }}>{ch.name}</strong>
                    <span style={{ color:"#fbbf24", fontSize:"0.72rem", fontFamily:"monospace" }}>{ch.party_code || "NO PARTY"}</span>
                  </div>
                  <div style={{ color:"#94a3b8", fontSize:"0.72rem", marginTop:2 }}>
                    {(RACES[ch.race]?.name || ch.race || "Razza")} - {(CLASSES[ch.class]?.name || ch.class || "Classe")} - Lv.{ch.level || 1}
                    {ch.realPlayerName ? ` - Giocatore: ${ch.realPlayerName}` : ""}
                    {ch.dead ? " - MORTO" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDuration(ms) {
  if(!ms || ms < 0) return "—";
  const s = Math.floor(ms / 1000);
  if(s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if(m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function OnlineView() {
  const [users, setUsers] = useState([]);
  const [players, setPlayers] = useState({});
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState({});

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const [userMeta, { data: ps }, sessionData] = await Promise.all([
        dbGetUserMasterMeta().catch(() => ({})),
        supabase.from("players").select("id,name,class,race,level,account_id,party_code"),
        dbGetSessionHistory(7).catch(() => ({})),
      ]);
      if(!alive) return;
      const byAccount = {};
      for(const p of (ps || [])) {
        if(!p.account_id) continue;
        if(!byAccount[p.account_id]) byAccount[p.account_id] = [];
        byAccount[p.account_id].push(p);
      }
      setPlayers(byAccount);
      setSessions(sessionData);
      const sorted = Object.values(userMeta)
        .sort((a, b) => Date.parse(b.lastSeenAt || 0) - Date.parse(a.lastSeenAt || 0));
      setUsers(sorted);
      setLoading(false);
    };
    load();
    const dataTimer = setInterval(load, 15000);
    const clockTimer = setInterval(() => setNow(Date.now()), 1000);
    return () => { alive = false; clearInterval(dataTimer); clearInterval(clockTimer); };
  }, []);

  const online = users.filter(u => isRecentlyOnline(u.lastSeenAt, now));
  const offline = users.filter(u => !isRecentlyOnline(u.lastSeenAt, now));

  const UserRow = ({ u, isOnline }) => {
    const seenMs = Date.parse(u.lastSeenAt || "");
    const ago = Number.isFinite(seenMs) ? now - seenMs : null;
    const chars = players[u.userId] || [];
    const dot = isOnline ? (u.afk ? "#f59e0b" : "#22c55e") : "#374151";
    const dotLabel = isOnline ? (u.afk ? "AFK" : "Online") : "Offline";
    return (
      <div style={{ background:"rgba(15,23,42,0.9)", border:`1px solid ${isOnline ? (u.afk?"#78350f":"#14532d") : "#1e293b"}`, borderRadius:8, padding:"0.75rem 0.9rem", marginBottom:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:dot, flexShrink:0, boxShadow: isOnline ? `0 0 6px ${dot}` : "none" }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#e2d9c5", fontWeight:700, fontSize:"0.85rem", wordBreak:"break-word" }}>{u.email || "Utente anonimo"}</div>
            {chars.length > 0 && (
              <div style={{ color:"#64748b", fontSize:"0.7rem", marginTop:2 }}>
                {chars.map(c => `${CLASSES[c.class]?.emoji||"⚔️"} ${c.name} Lv.${c.level||1}`).join("  ·  ")}
              </div>
            )}
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:"0.72rem", color: isOnline ? (u.afk?"#f59e0b":"#22c55e") : "#475569", fontWeight:700 }}>{dotLabel}</div>
            <div style={{ fontSize:"0.65rem", color:"#475569", marginTop:1 }}>
              {ago !== null ? (isOnline ? `da ${formatDuration(ago)}` : `${formatDuration(ago)} fa`) : "—"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:"1.2rem" }}>
        {[
          ["🟢 Online ora", online.filter(u=>!u.afk).length, "#22c55e"],
          ["🟡 AFK", online.filter(u=>u.afk).length, "#f59e0b"],
          ["⚫ Offline", offline.length, "#475569"],
          ["👤 Totale account", users.length, "#94a3b8"],
        ].map(([label, val, color]) => (
          <div key={label} style={{ background:"rgba(15,23,42,0.9)", border:"1px solid #1e293b", borderRadius:8, padding:"0.8rem" }}>
            <div style={{ fontSize:"0.68rem", color:"#64748b", marginBottom:4 }}>{label}</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1.4rem", fontWeight:700, color }}>{val}</div>
          </div>
        ))}
      </div>

      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}

      {online.length > 0 && (
        <div style={{ marginBottom:"1.2rem" }}>
          <div style={{ fontSize:"0.7rem", color:"#22c55e", fontFamily:"'Cinzel',serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>
            🟢 Connessi ora ({online.length})
          </div>
          {online.map(u => <UserRow key={u.userId} u={u} isOnline={true} />)}
        </div>
      )}

      {offline.length > 0 && (
        <div>
          <div style={{ fontSize:"0.7rem", color:"#475569", fontFamily:"'Cinzel',serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>
            ⚫ Offline ({offline.length})
          </div>
          {offline.map(u => <UserRow key={u.userId} u={u} isOnline={false} />)}
        </div>
      )}

      {!loading && users.length === 0 && (
        <div style={{ textAlign:"center", color:"#4b5563", padding:"2rem" }}>Nessun dato disponibile — gli utenti vengono tracciati dal primo login in poi.</div>
      )}

      {/* Session history */}
      {Object.keys(sessions).length > 0 && (
        <div style={{ marginTop:"1.5rem" }}>
          <div style={{ fontSize:"0.7rem", color:"#6d28d9", fontFamily:"'Cinzel',serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>
            📋 Cronologia sessioni — ultimi 7 giorni
          </div>
          {Object.entries(sessions)
            .sort((a,b) => {
              const al = a[1].sessions.at(-1)?.start || "";
              const bl = b[1].sessions.at(-1)?.start || "";
              return bl.localeCompare(al);
            })
            .map(([userId, data]) => (
              <div key={userId} style={{ background:"rgba(15,23,42,0.9)", border:"1px solid #1e293b", borderRadius:8, padding:"0.75rem 0.9rem", marginBottom:8 }}>
                <div style={{ color:"#c4b5fd", fontWeight:700, fontSize:"0.8rem", marginBottom:6 }}>{data.email || userId}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {[...data.sessions].reverse().slice(0, 10).map((s, i) => {
                    const start = new Date(s.start);
                    const end = s.end ? new Date(s.end) : null;
                    const durMs = end ? end - start : (now - start);
                    const isLive = !s.end;
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.72rem", padding:"3px 0", borderBottom:"1px solid #0f172a" }}>
                        <span style={{ color:"#22c55e", minWidth:6 }}>{isLive ? "●" : "○"}</span>
                        <span style={{ color:"#94a3b8", minWidth:100 }}>
                          {start.toLocaleDateString("it-IT", { day:"2-digit", month:"2-digit" })} {start.toLocaleTimeString("it-IT", { hour:"2-digit", minute:"2-digit" })}
                        </span>
                        <span style={{ color:"#475569" }}>→</span>
                        <span style={{ color: isLive ? "#22c55e" : "#94a3b8", minWidth:50 }}>
                          {isLive ? "ora" : end.toLocaleTimeString("it-IT", { hour:"2-digit", minute:"2-digit" })}
                        </span>
                        <span style={{ color:"#fbbf24", fontWeight:600, marginLeft:4 }}>
                          {formatDuration(durMs)}
                        </span>
                        {isLive && <span style={{ color:"#22c55e", fontSize:"0.62rem" }}>● LIVE</span>}
                      </div>
                    );
                  })}
                  {data.sessions.length > 10 && (
                    <div style={{ fontSize:"0.65rem", color:"#475569", marginTop:2 }}>... e altre {data.sessions.length - 10} sessioni</div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      <div style={{ marginTop:"1rem", fontSize:"0.65rem", color:"#334155", textAlign:"right" }}>
        Aggiornamento ogni 15 secondi · Heartbeat utenti ogni 30s · Online = visto negli ultimi 2 minuti
      </div>
    </div>
  );
}

function ItemEditForm({ item, onSave, onCancel }) {
  const [ei, setEi] = useState(item);
  return (
    <div style={{ marginTop:10, padding:"0.8rem", background:"rgba(15,23,42,0.6)", borderRadius:8, border:"1px solid #334155" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <div><label style={labelStyle}>Nome</label><input style={inputStyle} value={ei.name} onChange={e=>setEi(i=>({...i,name:e.target.value}))} /></div>
        <div><label style={labelStyle}>Emoji</label><input style={inputStyle} value={ei.emoji} onChange={e=>setEi(i=>({...i,emoji:e.target.value}))} /></div>
        <div>
          <label style={labelStyle}>Tipo</label>
          <select style={{...inputStyle,cursor:"pointer"}} value={ei.type} onChange={e=>setEi(i=>({...i,type:e.target.value}))}>
            <option value="weapon">Arma</option>
            <option value="armor">Armatura</option>
            <option value="accessory">Accessorio</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Rarità</label>
          <select style={{...inputStyle,cursor:"pointer"}} value={ei.rarity||"common"} onChange={e=>setEi(i=>({...i,rarity:e.target.value}))}>
            <option value="common">⬜ Comune</option>
            <option value="uncommon">🟩 Non comune</option>
            <option value="rare">🟦 Raro</option>
            <option value="epic">🟪 Epico</option>
            <option value="legendary">🟨 Leggendario</option>
          </select>
        </div>
        <div><label style={labelStyle}>Prezzo</label><input style={inputStyle} type="number" value={ei.price} onChange={e=>setEi(i=>({...i,price:+e.target.value}))} /></div>
        {ei.type==="weapon" && (
          <div>
            <label style={labelStyle}>Dado danno</label>
            <select style={{...inputStyle,cursor:"pointer"}} value={ei.weapon_die||"1d6"} onChange={e=>setEi(i=>({...i,weapon_die:e.target.value}))}>
              {["1d4","1d6","1d8","1d10","1d12","1d20",
                "2d4","2d6","2d8","2d10","2d12","2d20",
                "3d4","3d6","3d8","3d10","3d12","3d20",
                "4d4","4d6","4d8","4d10","4d12","4d20",
                "5d6","5d8","5d10","5d12","5d20",
                "6d6","6d8","6d10","6d12","6d20",
                "8d6","8d8","8d10","8d12","8d20",
                "10d6","10d8","10d10","10d12","10d20",
              ].map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}
      </div>
      <label style={{...labelStyle,marginTop:8}}>Descrizione</label>
      <textarea style={{...inputStyle,height:55,resize:"vertical"}} value={ei.description} onChange={e=>setEi(i=>({...i,description:e.target.value}))} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:8 }}>
        <div><label style={labelStyle}>+ATK</label><input style={inputStyle} type="number" value={ei.bonus_atk} onChange={e=>setEi(i=>({...i,bonus_atk:+e.target.value}))} /></div>
        <div><label style={labelStyle}>+DEF</label><input style={inputStyle} type="number" value={ei.bonus_def} onChange={e=>setEi(i=>({...i,bonus_def:+e.target.value}))} /></div>
        <div><label style={labelStyle}>+MAG</label><input style={inputStyle} type="number" value={ei.bonus_mag} onChange={e=>setEi(i=>({...i,bonus_mag:+e.target.value}))} /></div>
        <div><label style={labelStyle}>+HP</label><input style={inputStyle} type="number" value={ei.bonus_hp} onChange={e=>setEi(i=>({...i,bonus_hp:+e.target.value}))} /></div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:10 }}>
        <BigBtn onClick={()=>onSave(ei)} gold icon="⭐">Salva</BigBtn>
        <SmallBtn onClick={onCancel}>Annulla</SmallBtn>
      </div>
    </div>
  );
}

const RARITY_COLOR_MAP = { common:"#9ca3af", uncommon:"#34d399", rare:"#60a5fa", epic:"#a78bfa", legendary:"#fbbf24" };
const TYPE_GROUPS = { weapon:"⚔️ Armi", armor:"🛡️ Armature", accessory:"💍 Accessori" };

function MarketView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [players, setPlayers] = useState([]);
  const [tab, setTab] = useState("items");
  const [itemSearch, setItemSearch] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [donateItemId, setDonateItemId] = useState("");
  const [donateQty, setDonateQty] = useState(1);
  const [donateStatus, setDonateStatus] = useState("");
  const [donateItemSearch, setDonateItemSearch] = useState("");

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      const [its, { data: ps }] = await Promise.all([
        dbGetItems(),
        supabase.from("players").select("id,name,class,level,party_code,race").order("name", { ascending: true }),
      ]);
      setItems(its);
      setPlayers(ps || []);
      setLoading(false);
    };
    load();
  },[]);

  const saveItem = async (item) => {
    await dbSaveItem(item);
    setSaved(true);
    setTimeout(()=>setSaved(false), 2200);
    setEditingItem(null);
    const fresh = await dbGetItems();
    setItems(fresh);
    setExpandedItem(item.id);
  };

  const removeItem = async (itemId) => {
    if(!window.confirm("Eliminare questo oggetto dal catalogo?")) return;
    await dbDeleteItem(itemId);
    setItems(prev=>prev.filter(i=>i.id!==itemId));
    if(expandedItem===itemId) setExpandedItem(null);
  };

  const handleDonate = async (playerId) => {
    if(!donateItemId) return;
    setDonateStatus("...");
    try {
      await dbAddPlayerItem(playerId, donateItemId, Math.max(1, donateQty));
      const item = items.find(i=>i.id===donateItemId);
      setDonateStatus(`✅ "${item?.name}" donato!`);
      setTimeout(()=>{ setDonateStatus(""); setDonateItemId(""); setDonateQty(1); setDonateItemSearch(""); }, 2500);
    } catch(e) {
      setDonateStatus("❌ " + (e?.message || e));
    }
  };

  const newItemBlank = () => ({
    id:`i_${Date.now()}`,name:"",emoji:"",type:"weapon",description:"",
    bonus_atk:0,bonus_def:0,bonus_mag:0,bonus_hp:0,price:100,rarity:"common",weapon_die:"1d6",available:true
  });

  const searchStyle = { ...inputStyle, marginBottom:8, width:"100%", boxSizing:"border-box" };
  const rowBase = { display:"flex", alignItems:"center", gap:8, padding:"0.45rem 0.6rem", borderRadius:6, cursor:"pointer", userSelect:"none" };

  // ── Items tab ─────────────────────────────────────────────────────────
  const filteredItems = items.filter(it =>
    (it.name||"").toLowerCase().includes(itemSearch.toLowerCase()) ||
    (it.type||"").toLowerCase().includes(itemSearch.toLowerCase()) ||
    (it.rarity||"").toLowerCase().includes(itemSearch.toLowerCase())
  );
  const groupedItems = Object.entries(TYPE_GROUPS).map(([type, label]) => ({
    type, label, list: filteredItems.filter(it => it.type === type)
  })).filter(g => g.list.length > 0);

  // ── Players tab ───────────────────────────────────────────────────────
  const filteredPlayers = players.filter(p =>
    (p.name||"").toLowerCase().includes(playerSearch.toLowerCase()) ||
    (p.party_code||"").toLowerCase().includes(playerSearch.toLowerCase())
  );
  const donateFilteredItems = items.filter(it =>
    (it.name||"").toLowerCase().includes(donateItemSearch.toLowerCase())
  );

  return (
    <div>
      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:"1rem" }}>
        {[["items","🏪 Oggetti"],["players","👥 Giocatori"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:"0.4rem 1rem", borderRadius:6, border:"none", cursor:"pointer", fontSize:"0.85rem", fontFamily:"'Cinzel',serif",
            background: tab===k ? "rgba(251,191,36,0.15)" : "rgba(30,41,59,0.6)",
            color: tab===k ? "#fbbf24" : "#94a3b8",
            borderBottom: tab===k ? "2px solid #fbbf24" : "2px solid transparent",
          }}>{l}</button>
        ))}
      </div>

      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}

      {/* ── ITEMS TAB ── */}
      {tab==="items" && !loading && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:"0.6rem", alignItems:"center" }}>
            <input style={{...searchStyle, marginBottom:0, flex:1}} placeholder="🔍 Cerca oggetto, tipo, rarità..." value={itemSearch} onChange={e=>setItemSearch(e.target.value)} />
            <BigBtn onClick={()=>{ setExpandedItem("__new__"); setEditingItem(newItemBlank()); }} gold icon="➕" style={{ whiteSpace:"nowrap" }}>Nuovo</BigBtn>
          </div>

          {/* New item form */}
          {expandedItem==="__new__" && editingItem && (
            <ItemEditForm item={editingItem} onSave={saveItem} onCancel={()=>{ setExpandedItem(null); setEditingItem(null); }} />
          )}

          {groupedItems.map(({ type, label, list }) => (
            <div key={type} style={{ marginBottom:"1rem" }}>
              <div style={{ fontSize:"0.7rem", color:"#64748b", fontFamily:"'Cinzel',serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>
                {label} ({list.length})
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {list.map(it => {
                  const isOpen = expandedItem === it.id;
                  const rc = RARITY_COLOR_MAP[it.rarity] || "#9ca3af";
                  return (
                    <div key={it.id} style={{ background: isOpen ? "rgba(30,41,59,0.8)" : "rgba(15,23,42,0.5)", border:`1px solid ${isOpen ? rc+"55" : "#1e293b"}`, borderRadius:7 }}>
                      {/* Row */}
                      <div style={{...rowBase, background:"transparent"}} onClick={()=>{ setExpandedItem(isOpen ? null : it.id); setEditingItem(null); }}>
                        <span style={{ fontSize:"1.1rem", minWidth:22 }}>{it.emoji||"⭐"}</span>
                        <span style={{ flex:1, fontSize:"0.85rem", color:"#e2d9c5", fontWeight:600 }}>{it.name}</span>
                        <span style={{ fontSize:"0.68rem", color:rc, minWidth:60 }}>{it.rarity||"—"}</span>
                        {it.weapon_die && <span style={{ fontSize:"0.68rem", color:"#94a3b8", minWidth:32 }}>{it.weapon_die}</span>}
                        <span style={{ fontSize:"0.68rem", color:"#c4b5fd" }}>💰{it.price}</span>
                        <span style={{ fontSize:"0.75rem", color:"#475569", marginLeft:4 }}>{isOpen?"▲":"▼"}</span>
                      </div>
                      {/* Expanded */}
                      {isOpen && (
                        <div style={{ padding:"0 0.7rem 0.7rem" }}>
                          {editingItem?.id === it.id ? (
                            <ItemEditForm item={editingItem} onSave={saveItem} onCancel={()=>setEditingItem(null)} />
                          ) : (
                            <>
                              <div style={{ fontSize:"0.75rem", color:"#94a3b8", marginBottom:6 }}>{it.description}</div>
                              <div style={{ display:"flex", gap:10, fontSize:"0.72rem", color:"#64748b", marginBottom:8 }}>
                                {it.bonus_atk!==0 && <span>⚔️+{it.bonus_atk}</span>}
                                {it.bonus_def!==0 && <span>🛡️+{it.bonus_def}</span>}
                                {it.bonus_mag!==0 && <span>✨+{it.bonus_mag}</span>}
                                {it.bonus_hp!==0 && <span>❤️+{it.bonus_hp}</span>}
                              </div>
                              <div style={{ display:"flex", gap:6 }}>
                                <SmallBtn onClick={()=>setEditingItem({...it})}>✏️ Modifica</SmallBtn>
                                <SmallBtn red onClick={()=>removeItem(it.id)}>🗑️ Elimina</SmallBtn>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredItems.length===0 && !loading && <div style={{ color:"#4b5563", fontSize:"0.85rem", textAlign:"center", padding:"1rem" }}>Nessun oggetto trovato</div>}
        </div>
      )}

      {/* ── PLAYERS TAB ── */}
      {tab==="players" && !loading && (
        <div>
          <input style={searchStyle} placeholder="🔍 Cerca giocatore o party..." value={playerSearch} onChange={e=>setPlayerSearch(e.target.value)} />
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {filteredPlayers.map(p => {
              const isOpen = expandedPlayer === p.id;
              const cls = CLASSES[p.class||"warrior"];
              return (
                <div key={p.id} style={{ background: isOpen ? "rgba(30,41,59,0.8)" : "rgba(15,23,42,0.5)", border:`1px solid ${isOpen ? "#6d28d955" : "#1e293b"}`, borderRadius:7 }}>
                  {/* Row */}
                  <div style={{...rowBase}} onClick={()=>{ setExpandedPlayer(isOpen ? null : p.id); setDonateItemId(""); setDonateStatus(""); setDonateItemSearch(""); }}>
                    <span style={{ fontSize:"1rem" }}>{cls?.emoji||"⚔️"}</span>
                    <span style={{ flex:1, fontSize:"0.85rem", color:"#e2d9c5", fontWeight:600 }}>{p.name}</span>
                    <span style={{ fontSize:"0.68rem", color:"#94a3b8" }}>Lv.{p.level||1}</span>
                    {p.party_code && <span style={{ fontSize:"0.62rem", color:"#475569", background:"rgba(255,255,255,0.05)", padding:"1px 5px", borderRadius:4 }}>{p.party_code}</span>}
                    <span style={{ fontSize:"0.75rem", color:"#475569", marginLeft:4 }}>{isOpen?"▲":"▼"}</span>
                  </div>
                  {/* Expanded */}
                  {isOpen && (
                    <div style={{ padding:"0 0.7rem 0.8rem" }}>
                      <div style={{ fontSize:"0.72rem", color:"#64748b", marginBottom:8 }}>
                        {cls?.name||p.class} · {p.race||"—"} · Party: {p.party_code||"nessuno"}
                      </div>
                      <div style={{ fontSize:"0.75rem", color:"#94a3b8", marginBottom:6, fontWeight:600 }}>🎁 Dona oggetto</div>
                      <input
                        style={{...inputStyle, marginBottom:6}}
                        placeholder="🔍 Cerca oggetto da donare..."
                        value={donateItemSearch}
                        onChange={e=>setDonateItemSearch(e.target.value)}
                      />
                      <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                        <select style={{...inputStyle, flex:1, cursor:"pointer", marginBottom:0}} value={donateItemId} onChange={e=>setDonateItemId(e.target.value)}>
                          <option value="">— Scegli oggetto —</option>
                          {donateFilteredItems.map(it=>(
                            <option key={it.id} value={it.id}>{it.emoji||"⭐"} {it.name} ({it.rarity||"comune"})</option>
                          ))}
                        </select>
                        <input style={{...inputStyle, width:60, marginBottom:0}} type="number" min="1" max="99" value={donateQty} onChange={e=>setDonateQty(Math.max(1,+e.target.value))} />
                        <BigBtn onClick={()=>handleDonate(p.id)} gold icon="🎁" disabled={!donateItemId}>Dona</BigBtn>
                      </div>
                      {donateStatus && <div style={{ marginTop:6, fontSize:"0.8rem", color: donateStatus.startsWith("✅")?"#34d399":"#fca5a5" }}>{donateStatus}</div>}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredPlayers.length===0 && <div style={{ color:"#4b5563", fontSize:"0.85rem", textAlign:"center", padding:"1rem" }}>Nessun giocatore trovato</div>}
          </div>
        </div>
      )}

      {saved && <div style={{ position:"fixed", bottom:16, right:16, padding:"0.8rem 1rem", background:"rgba(52,211,153,0.15)", border:"1px solid #065f46", borderRadius:6, color:"#34d399" }}>✅ Salvato!</div>}
    </div>
  );
}

function generateShopInventory(items, seed = 0) {
  const today = new Date().toLocaleDateString('en-CA');
  const rng = _makeRng(_dateToSeed(today + "_shop_" + seed));
  const shuffle = arr => {
    const a = [...arr];
    for(let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (pool, n) => shuffle(pool).slice(0, Math.min(n, pool.length));
  const isRanged = i => /bow|arco|crossbow|balestra|balista|sling|fionda/.test((i.id + " " + (i.name || "")).toLowerCase());
  const always = items.filter(i => i.id === "potion_escape" || i.id === "crystal_sintonia");
  const equip = items.filter(i => i.type !== 'material' && i.id !== "potion_escape" && i.id !== "crystal_sintonia");

  const commonPool    = equip.filter(i => i.rarity === "common");
  const uncommonPool  = equip.filter(i => i.rarity === "uncommon");
  const rareEpicPool  = equip.filter(i => i.rarity === "rare" || i.rarity === "epic");
  const legendPool    = equip.filter(i => i.rarity === "legendary");
  const rangedPool    = equip.filter(i => isRanged(i));

  // Guarantee 1-2 ranged weapons across all rarities
  const guaranteedRanged = pick(rangedPool, 2);
  const guaranteedRangedIds = new Set(guaranteedRanged.map(i => i.id));

  const filterOut = pool => pool.filter(i => !guaranteedRangedIds.has(i.id));

  return [
    ...always,
    ...guaranteedRanged,
    ...pick(filterOut(commonPool), 5),
    ...pick(filterOut(uncommonPool), 4),
    ...pick(filterOut(rareEpicPool), 2),
    ...pick(filterOut(legendPool), 1),
  ];
}

function ShopView({ me, items, loading, error, inventoryCounts, onBuy, restSeed = 0 }) {
  const [shopItems] = useState(() => items.length ? generateShopInventory(items, restSeed) : []);

  const RARITY_COLOR = { common:"#9ca3af", uncommon:"#34d399", rare:"#60a5fa", epic:"#a78bfa", legendary:"#fbbf24" };

  return (
    <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1.2rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, fontSize:"1.1rem" }}>🛒 Negozio — offerta del giorno</h3>
        <div style={{ padding:"0.6rem 1.4rem", background:"linear-gradient(135deg,rgba(180,83,9,0.3),rgba(180,83,9,0.1))", border:"3px solid #fbbf24", borderRadius:12, color:"#fbbf24", fontSize:"2.5rem", fontWeight:900, whiteSpace:"nowrap", textShadow:"0 2px 10px rgba(251,191,36,0.4)", lineHeight:1, display:"flex", alignItems:"center", gap:"0.8rem", boxShadow:"0 0 25px rgba(180,83,9,0.2)" }}>
          <span style={{ fontSize:"3rem" }}>💰</span> {me?.gold || 0}
        </div>
      </div>
      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}
      {error && <div style={{ color:"#fca5a5" }}>{error}</div>}
      {!loading && !shopItems.length && <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun oggetto disponibile.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {shopItems.map(it => {
          const canAfford = me && me.gold >= (it.price || 0);
          const owned = inventoryCounts?.[it.id] || 0;
          const rarityColor = RARITY_COLOR[it.rarity] || "#9ca3af";
          return (
            <div key={it.id} style={{ background:"rgba(15,23,42,0.7)", border:`1px solid ${rarityColor}44`, borderRadius:12, padding:"1.2rem", display:"flex", flexDirection:"column", gap:"0.8rem", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <ArtThumb src={getItemImage(it)} alt={it.name} size={72} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, fontSize:"1rem", lineHeight:1.3 }}>{it.name}</div>
                  <div style={{ fontSize:"0.78rem", color:"#94a3b8", marginTop:2 }}>{itemTypeLabel(it.type)}</div>
                  <div style={{ fontSize:"0.74rem", color:rarityColor, fontWeight:600, marginTop:2, textTransform:"capitalize" }}>{itemRarityLabel(it.rarity)}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:"1.3rem", color:"#fbbf24", fontWeight:900, lineHeight:1 }}>💰 {it.price}</div>
                  {owned > 0 && <div style={{ fontSize:"0.7rem", color:"#6ee7b7", marginTop:4 }}>Hai: {owned}</div>}
                </div>
              </div>
              <div style={{ fontSize:"0.85rem", color:"#94a3b8", lineHeight:1.55 }}>{it.description}</div>
              {itemStatSummary(it).length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {itemStatSummary(it).map(stat => (
                    <span key={stat} style={{ fontSize:"0.75rem", color:"#c4b5fd", background:"rgba(109,40,217,0.15)", border:"1px solid rgba(109,40,217,0.3)", borderRadius:999, padding:"2px 8px" }}>{stat}</span>
                  ))}
                </div>
              )}
              <button
                onClick={() => onBuy(it)}
                disabled={!canAfford}
                style={{ width:"100%", padding:"0.75rem", background:canAfford?"linear-gradient(135deg,#92400e,#d97706)":"rgba(255,255,255,0.04)", border:`1px solid ${canAfford?"#f59e0b":"#1f2937"}`, borderRadius:8, color:canAfford?"#fef3c7":"#4b5563", fontFamily:"'Cinzel',serif", fontSize:"0.9rem", cursor:canAfford?"pointer":"not-allowed", letterSpacing:"0.06em", fontWeight:700 }}>
                {canAfford ? `⭐ Compra` : `💰 ${it.price} (non abbastanza oro)`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Materials section */}
      {(() => {
        const materials = items.filter(i => i.type === 'material');
        if(!materials.length) return null;
        const MAT_RARITY = { common:"#9ca3af", uncommon:"#34d399", rare:"#60a5fa", epic:"#a78bfa", legendary:"#fbbf24" };
        const groups = ['common','uncommon','rare','epic','legendary'];
        return (
          <div style={{ marginTop:"2rem" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"0.5rem", fontSize:"1.05rem" }}>⚒️ Materiali da Forgia</h3>
            <p style={{ color:"#64748b", fontSize:"0.8rem", marginBottom:"1rem" }}>Acquista materiali per potenziare le armi alla Forgia.</p>
            {groups.map(rarity => {
              const mats = materials.filter(m => m.rarity === rarity);
              if(!mats.length) return null;
              return (
                <div key={rarity} style={{ marginBottom:"1.2rem" }}>
                  <div style={{ fontSize:"0.75rem", color:MAT_RARITY[rarity], fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.5rem" }}>{rarity}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
                    {mats.map(mat => {
                      const canAfford = me && me.gold >= (mat.price||0);
                      const owned = inventoryCounts?.[mat.id] || 0;
                      return (
                        <div key={mat.id} style={{ background:"rgba(15,23,42,0.7)", border:`1px solid ${MAT_RARITY[rarity]}33`, borderRadius:8, padding:"0.7rem", display:"flex", flexDirection:"column", gap:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:"1.5rem" }}>{mat.emoji}</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:"0.82rem", color:"#e2d9c5", fontWeight:600, lineHeight:1.2 }}>{mat.name}</div>
                              {owned > 0 && <div style={{ fontSize:"0.68rem", color:"#6ee7b7" }}>Hai: {owned}</div>}
                            </div>
                            <div style={{ fontSize:"0.85rem", color:"#fbbf24", fontWeight:700, flexShrink:0 }}>💰{mat.price}</div>
                          </div>
                          <div style={{ fontSize:"0.72rem", color:"#64748b", lineHeight:1.4 }}>{mat.description}</div>
                          <button onClick={()=>onBuy(mat)} disabled={!canAfford} style={{ padding:"0.4rem", background:canAfford?"rgba(120,53,15,0.5)":"rgba(255,255,255,0.03)", border:`1px solid ${canAfford?"#d97706":"#1f2937"}`, borderRadius:6, color:canAfford?"#fef3c7":"#374151", cursor:canAfford?"pointer":"not-allowed", fontSize:"0.78rem", fontFamily:"'Cinzel',serif" }}>
                            {canAfford ? "Acquista" : "Non abbastanza oro"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </>
  );
}

/* ─── DailyEventBanner ─── */
function DailyEventBanner({ event, claimed, onClaim, loading }) {
  if (!event) return null;
  const isNegative = event.value < 0;
  const isNotice = event.effect === 'notice';
  const bg = isNegative ? 'rgba(127,29,29,0.6)' : isNotice ? 'rgba(15,23,42,0.7)' : 'rgba(15,30,15,0.7)';
  const border = isNegative ? '#7f1d1d' : isNotice ? '#1e3a5f' : '#166534';
  const actionColor = isNegative ? '#ef4444' : isNotice ? '#60a5fa' : '#22c55e';
  return (
    <div style={{ margin:'0.8rem 1rem 0', padding:'0.8rem 1rem', background:bg, border:`1px solid ${border}`, borderRadius:10, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
      <span style={{ fontSize:'1.8rem', flexShrink:0 }}>{event.emoji}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"'Cinzel',serif", color:'#e2d9c5', fontWeight:700, fontSize:'0.88rem' }}>{event.title}</div>
        <div style={{ color:'#94a3b8', fontSize:'0.78rem', marginTop:2 }}>{event.desc}</div>
      </div>
      {claimed
        ? <span style={{ fontSize:'0.75rem', color:'#6ee7b7', flexShrink:0 }}>✓ Raccolto</span>
        : <button onClick={onClaim} disabled={loading} style={{ flexShrink:0, padding:'0.4rem 0.9rem', background:`${actionColor}22`, border:`1px solid ${actionColor}`, borderRadius:8, color:actionColor, fontFamily:"'Cinzel',serif", fontSize:'0.75rem', cursor:'pointer', fontWeight:700 }}>{event.action}</button>
      }
    </div>
  );
}

/* ─── DungeonView ─── */
const DUNGEON_READ_DELAY = 15; // secondi prima che il bottone azione appaia

function DungeonView({ dungeon, me, onRoomAction, loading }) {
  const [riddleAnswer, setRiddleAnswer] = React.useState('');
  const [readyToAct, setReadyToAct] = React.useState(false);
  const [countdown, setCountdown] = React.useState(DUNGEON_READ_DELAY);
  const roomKey = dungeon?.rooms?.[dungeon?.currentRoom]?.id;

  React.useEffect(() => {
    setReadyToAct(false);
    setCountdown(DUNGEON_READ_DELAY);
    const interval = setInterval(() => {
      setCountdown(c => {
        if(c <= 1) { clearInterval(interval); setReadyToAct(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [roomKey]);
  if (!dungeon?.active) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem', textAlign:'center' }}>
      <div>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🗺️</div>
        <div style={{ fontFamily:"'Cinzel',serif", color:'#e2d9c5', fontSize:'1.1rem', marginBottom:'0.5rem' }}>Nessun Dungeon Attivo</div>
        <div style={{ color:'#64748b', fontSize:'0.85rem' }}>Il Master può avviare un dungeon procedurale dal pannello di controllo.</div>
      </div>
    </div>
  );
  const { rooms, currentRoom, name, emoji } = dungeon;
  const room = rooms[currentRoom];
  const cfg = DUNGEON_ROOM_CFG[room?.type] || DUNGEON_ROOM_CFG.combat;
  const allCleared = rooms.every(r => r.cleared);
  return (
    <div style={{ flex:1, overflowY:'auto', padding:'1rem' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1rem' }}>
        <span style={{ fontSize:'2rem' }}>{emoji}</span>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", color:'#fbbf24', fontSize:'1.1rem', fontWeight:700 }}>{name}</div>
          <div style={{ color:'#94a3b8', fontSize:'0.75rem' }}>Stanza {currentRoom + 1} / {rooms.length}</div>
        </div>
      </div>

      {/* Room map */}
      <div style={{ display:'flex', gap:4, alignItems:'center', marginBottom:'1.4rem', flexWrap:'wrap' }}>
        {rooms.map((r, i) => {
          const c = DUNGEON_ROOM_CFG[r.type];
          const isCurrent = i === currentRoom;
          const isPast = r.cleared;
          return (
            <React.Fragment key={r.id}>
              <div style={{ position:'relative', width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', background: isPast ? 'rgba(34,197,94,0.15)' : isCurrent ? `${c.color}22` : 'rgba(15,23,42,0.5)', border: `2px solid ${isPast ? '#16a34a' : isCurrent ? c.color : '#1e293b'}`, transition:'all 0.2s', flexShrink:0 }}>
                {isPast ? '✓' : c.emoji}
                {isCurrent && <div style={{ position:'absolute', inset:-4, borderRadius:'50%', border:`2px solid ${c.color}`, animation:'none', opacity:0.6 }} />}
              </div>
              {i < rooms.length - 1 && <div style={{ flex:'0 0 12px', height:2, background: isPast ? '#16a34a' : '#1e293b' }} />}
            </React.Fragment>
          );
        })}
      </div>

      {allCleared ? (
        <div style={{ textAlign:'center', padding:'3rem', background:'rgba(251,191,36,0.08)', border:'1px solid #92400e', borderRadius:12 }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏆</div>
          <div style={{ fontFamily:"'Cinzel',serif", color:'#fbbf24', fontSize:'1.2rem', fontWeight:700 }}>Dungeon Completato!</div>
          <div style={{ color:'#94a3b8', marginTop:'0.5rem', fontSize:'0.85rem' }}>Avete superato tutte le stanze. In attesa del prossimo dungeon.</div>
        </div>
      ) : room ? (
        <div style={{ background:'rgba(15,23,42,0.7)', border:`1px solid ${cfg.color}44`, borderRadius:12, padding:'1.4rem' }}>
          {/* Room header */}
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:'1rem' }}>
            <span style={{ fontSize:'2.5rem' }}>{cfg.emoji}</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", color:cfg.color, fontWeight:700, fontSize:'1rem' }}>{room.title}</div>
              <div style={{ color:'#64748b', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>{cfg.label}</div>
            </div>
          </div>
          <p style={{ color:'#cbd5e1', fontSize:'0.88rem', lineHeight:1.7, marginBottom:'1.4rem' }}><TypewriterText text={room.desc} speed={14} /></p>

          {/* Countdown badge */}
          {!readyToAct && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'0.8rem', padding:'0.5rem 0.9rem', background:'rgba(15,23,42,0.7)', border:'1px solid #334155', borderRadius:8 }}>
              <span style={{ fontSize:'1rem' }}>⏳</span>
              <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Leggi la stanza… l'azione sarà disponibile tra </span>
              <span style={{ color:'#fbbf24', fontWeight:700, fontFamily:"'Cinzel',serif", minWidth:20, textAlign:'center' }}>{countdown}s</span>
            </div>
          )}

          {/* Room-specific UI */}
          {(room.type === 'combat' || room.type === 'boss') && (
            <div>
              <div style={{ color:'#94a3b8', fontSize:'0.78rem', marginBottom:'0.6rem' }}>Nemici: {room.monsters?.map(m=>`${m.emoji||'👾'} ${m.name}`).join(', ')}</div>
              <button onClick={()=>onRoomAction(room,'combat')} disabled={loading||!readyToAct} style={{ width:'100%', padding:'0.8rem', background: readyToAct ? 'linear-gradient(135deg,#7f1d1d,#dc2626)' : 'rgba(30,30,40,0.5)', border:`1px solid ${readyToAct ? '#ef4444' : '#374151'}`, borderRadius:8, color: readyToAct ? '#fee2e2' : '#4b5563', fontFamily:"'Cinzel',serif", fontSize:'0.9rem', cursor: readyToAct ? 'pointer' : 'not-allowed', fontWeight:700, transition:'all 0.3s' }}>
                ⚔️ Entra in Battaglia
              </button>
            </div>
          )}
          {room.type === 'trap' && (
            <div>
              <div style={{ color:'#fde68a', fontSize:'0.82rem', marginBottom:'0.6rem' }}>Tiro di {room.skillLabel} contro DC {room.dc} • Fallimento: -{room.failDmg} HP</div>
              <button onClick={()=>onRoomAction(room,'trap')} disabled={loading||!readyToAct} style={{ width:'100%', padding:'0.8rem', background: readyToAct ? 'linear-gradient(135deg,#78350f,#d97706)' : 'rgba(30,30,40,0.5)', border:`1px solid ${readyToAct ? '#f59e0b' : '#374151'}`, borderRadius:8, color: readyToAct ? '#fef3c7' : '#4b5563', fontFamily:"'Cinzel',serif", fontSize:'0.9rem', cursor: readyToAct ? 'pointer' : 'not-allowed', fontWeight:700, transition:'all 0.3s' }}>
                ⚠️ Affrontare la Trappola ({room.skillLabel})
              </button>
            </div>
          )}
          {room.type === 'treasure' && (
            <div>
              <div style={{ color:'#fde68a', fontSize:'0.82rem', marginBottom:'0.6rem' }}>Tesoro: 💰 {room.gold} oro (divisi tra i presenti)</div>
              <button onClick={()=>onRoomAction(room,'treasure')} disabled={loading||!readyToAct} style={{ width:'100%', padding:'0.8rem', background: readyToAct ? 'linear-gradient(135deg,#78350f,#b45309)' : 'rgba(30,30,40,0.5)', border:`1px solid ${readyToAct ? '#fbbf24' : '#374151'}`, borderRadius:8, color: readyToAct ? '#fef3c7' : '#4b5563', fontFamily:"'Cinzel',serif", fontSize:'0.9rem', cursor: readyToAct ? 'pointer' : 'not-allowed', fontWeight:700, transition:'all 0.3s' }}>
                💰 Raccogliere il Tesoro
              </button>
            </div>
          )}
          {room.type === 'rest' && (
            <div>
              <div style={{ color:'#86efac', fontSize:'0.82rem', marginBottom:'0.6rem' }}>Recupero: +{room.healPct}% HP massimi</div>
              <button onClick={()=>onRoomAction(room,'rest')} disabled={loading||!readyToAct} style={{ width:'100%', padding:'0.8rem', background: readyToAct ? 'linear-gradient(135deg,#14532d,#16a34a)' : 'rgba(30,30,40,0.5)', border:`1px solid ${readyToAct ? '#22c55e' : '#374151'}`, borderRadius:8, color: readyToAct ? '#dcfce7' : '#4b5563', fontFamily:"'Cinzel',serif", fontSize:'0.9rem', cursor: readyToAct ? 'pointer' : 'not-allowed', fontWeight:700, transition:'all 0.3s' }}>
                🔥 Riposare
              </button>
            </div>
          )}
          {room.type === 'choice' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {room.options?.map((opt, oi) => (
                <button key={oi} onClick={()=>onRoomAction(room,'choice',oi)} disabled={loading||!readyToAct} style={{ padding:'0.8rem', background: readyToAct ? 'rgba(15,23,42,0.8)' : 'rgba(30,30,40,0.4)', border:`1px solid ${readyToAct ? '#1e3a5f' : '#374151'}`, borderRadius:8, color: readyToAct ? '#e2d9c5' : '#4b5563', fontFamily:"'Cinzel',serif", fontSize:'0.82rem', cursor: readyToAct ? 'pointer' : 'not-allowed', lineHeight:1.5, textAlign:'left', transition:'all 0.3s' }}>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{opt.label}</div>
                  <div style={{ color:'#64748b', fontSize:'0.72rem' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          )}
          {room.type === 'riddle' && (
            <div>
              <div style={{ background:'rgba(109,40,217,0.1)', border:'1px solid rgba(109,40,217,0.3)', borderRadius:8, padding:'0.8rem 1rem', marginBottom:'0.8rem', color:'#c4b5fd', fontSize:'0.85rem', fontStyle:'italic', lineHeight:1.6 }}>
                🧩 {room.riddle}
              </div>
              <div style={{ color:'#94a3b8', fontSize:'0.75rem', marginBottom:'0.5rem' }}>Risposta corretta: +{room.xpReward} XP • Risposta sbagliata: -{room.failDmg} HP</div>
              <div style={{ display:'flex', gap:8 }}>
                <input
                  value={riddleAnswer}
                  onChange={e => setRiddleAnswer(e.target.value)}
                  onKeyDown={e => { if(e.key==='Enter' && riddleAnswer.trim() && readyToAct) { onRoomAction(room,'riddle',riddleAnswer.trim()); setRiddleAnswer(''); }}}
                  placeholder="La tua risposta..."
                  disabled={loading}
                  style={{ flex:1, padding:'0.7rem 1rem', background:'rgba(15,23,42,0.9)', border:'1px solid #3730a3', borderRadius:8, color:'#e2d9c5', fontSize:'0.88rem', outline:'none' }}
                />
                <button
                  onClick={()=>{ if(riddleAnswer.trim() && readyToAct) { onRoomAction(room,'riddle',riddleAnswer.trim()); setRiddleAnswer(''); }}}
                  disabled={loading || !riddleAnswer.trim()}
                  style={{ padding:'0.7rem 1.2rem', background:'linear-gradient(135deg,#3730a3,#6d28d9)', border:'1px solid #a78bfa', borderRadius:8, color:'#ede9fe', fontFamily:"'Cinzel',serif", fontSize:'0.88rem', cursor:'pointer', fontWeight:700 }}>
                  Rispondere
                </button>
              </div>
            </div>
          )}
          {room.type === 'event' && (
            <div>
              <div style={{ background:'rgba(148,163,184,0.08)', border:'1px solid #334155', borderRadius:8, padding:'0.8rem 1rem', marginBottom:'0.8rem', color:'#cbd5e1', fontSize:'0.85rem', lineHeight:1.7, fontStyle:'italic' }}>
                📖 <TypewriterText text={room.narrative} speed={14} />
              </div>
              {room.effect && room.effect !== 'nothing' && (
                <div style={{ color:'#94a3b8', fontSize:'0.75rem', marginBottom:'0.6rem' }}>
                  {room.effect === 'xp' && `✨ Guadagni ${room.amount} XP`}
                  {room.effect === 'gold' && `💰 Trovi ${room.amount} monete d'oro`}
                  {room.effect === 'heal_pct' && `💚 Recuperi il ${room.amount}% degli HP massimi`}
                  {room.effect === 'dmg_pct' && `💔 Subisci il ${room.amount}% degli HP massimi come danno`}
                </div>
              )}
              <button onClick={()=>onRoomAction(room,'event')} disabled={loading||!readyToAct} style={{ width:'100%', padding:'0.8rem', background: readyToAct ? 'linear-gradient(135deg,#0f172a,#1e293b)' : 'rgba(30,30,40,0.5)', border:`1px solid ${readyToAct ? '#475569' : '#374151'}`, borderRadius:8, color: readyToAct ? '#e2d9c5' : '#4b5563', fontFamily:"'Cinzel',serif", fontSize:'0.9rem', cursor: readyToAct ? 'pointer' : 'not-allowed', fontWeight:700, transition:'all 0.3s' }}>
                📖 Prosegui
              </button>
            </div>
          )}
          {room.type === 'shrine' && (
            <div>
              <div style={{ background:'rgba(251,146,60,0.08)', border:'1px solid #92400e', borderRadius:8, padding:'0.8rem 1rem', marginBottom:'0.8rem' }}>
                <div style={{ color:'#fdba74', fontSize:'0.85rem', fontWeight:700, marginBottom:4 }}>Offerta richiesta: ❤️ -{room.hpCost}% HP massimi</div>
                <div style={{ color:'#94a3b8', fontSize:'0.78rem' }}>In cambio: <span style={{ color:'#fcd34d' }}>{room.buffLabel}</span></div>
              </div>
              <button onClick={()=>onRoomAction(room,'shrine')} disabled={loading||!readyToAct} style={{ width:'100%', padding:'0.8rem', background: readyToAct ? 'linear-gradient(135deg,#431407,#ea580c)' : 'rgba(30,30,40,0.5)', border:`1px solid ${readyToAct ? '#fb923c' : '#374151'}`, borderRadius:8, color: readyToAct ? '#fff7ed' : '#4b5563', fontFamily:"'Cinzel',serif", fontSize:'0.9rem', cursor: readyToAct ? 'pointer' : 'not-allowed', fontWeight:700, transition:'all 0.3s' }}>
                🕯️ Sacrifica e Ricevi il Benedizione
              </button>
            </div>
          )}
          {room.type === 'merchant' && (
            <div style={{ textAlign:'center', padding:'1.5rem 1rem', color:'#94a3b8', fontSize:'0.88rem' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'0.6rem' }}>🧙</div>
              <div style={{ fontFamily:"'Cinzel',serif", color:'#34d399', fontWeight:700, marginBottom:'0.4rem' }}>Mercante del Dungeon</div>
              <div>Il mercante ha la sua merce esposta... ma per ora non accetta visitatori.</div>
              <div style={{ marginTop:'0.8rem', fontSize:'0.75rem', color:'#475569' }}>(funzionalità in arrivo)</div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ForgeView({ me, inventory, inventoryCounts, catalogItems, onForge, loading }) {
  const RARITY_COLOR = { common:"#9ca3af", uncommon:"#34d399", rare:"#60a5fa", epic:"#a78bfa", legendary:"#fbbf24" };
  const weaponEntries = inventory.filter(e => {
    const die = e.item?.weapon_die;
    if(!die) return false;
    const idx = FORGE_DIE_PROGRESSION.indexOf(die);
    return idx >= 0 && idx < 11;
  });
  const groups = groupInventoryEntries(weaponEntries);
  const forgeableGroups = groups.filter(g => g.quantity >= 2);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1.2rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, fontSize:"1.1rem" }}>⚒️ Forgia — Potenzia le tue armi</h3>
      </div>

      {/* Progression chart */}
      <div style={{ background:"rgba(15,23,42,0.7)", border:"1px solid #1e3a5f", borderRadius:10, padding:"1rem", marginBottom:"1.4rem" }}>
        <div style={{ fontSize:"0.8rem", color:"#94a3b8", marginBottom:8, fontFamily:"'Cinzel',serif", letterSpacing:"0.06em" }}>Progressione Dado Danno:</div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
          {FORGE_DIE_PROGRESSION.map((die, i) => (
            <React.Fragment key={die}>
              <span style={{ padding:"3px 8px", borderRadius:999, background:"rgba(109,40,217,0.2)", border:"1px solid rgba(109,40,217,0.4)", color:"#c4b5fd", fontSize:"0.75rem", fontWeight:700 }}>{die}</span>
              {i < FORGE_DIE_PROGRESSION.length - 1 && <span style={{ color:"#475569", fontSize:"0.8rem" }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <p style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1.4rem", lineHeight:1.6 }}>
        Porta <strong style={{ color:"#e2d9c5" }}>2 copie della stessa arma</strong> + il <strong style={{ color:"#e2d9c5" }}>materiale richiesto</strong> per forgiarla al livello successivo. Ogni forgiatura aumenta il dado danno e il bonus ATK.
      </p>

      {!forgeableGroups.length && (
        <div style={{ textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:8, color:"#64748b", fontFamily:"'Cinzel',serif" }}>
          Nessuna arma forgiabile.<br/>Acquista o trova 2 copie della stessa arma per iniziare.
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
        {forgeableGroups.map(group => {
          const currentDieIdx = FORGE_DIE_PROGRESSION.indexOf(group.item.weapon_die);
          if(currentDieIdx < 0 || currentDieIdx >= 14) return null;
          const targetDieIdx = currentDieIdx + 1;
          const matId = FORGE_MATERIAL_REQ[targetDieIdx - 1];
          const mat = catalogItems.find(i => i.id === matId);
          const hasMat = (inventoryCounts[matId] || 0) >= 1;
          const canForge = hasMat && !loading;
          const nextDie = FORGE_DIE_PROGRESSION[targetDieIdx];
          const rarityColor = RARITY_COLOR[group.item.rarity] || "#9ca3af";
          const fLevel = getForgeLevel(group.itemId);
          return (
            <div key={group.itemId} style={{ background:"rgba(15,23,42,0.7)", border:`1px solid ${rarityColor}44`, borderRadius:12, padding:"1.2rem", display:"flex", flexDirection:"column", gap:"0.8rem", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:"2.2rem", flexShrink:0 }}>{group.item.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, fontSize:"0.95rem", lineHeight:1.3 }}>{group.item.name}</div>
                  <div style={{ fontSize:"0.72rem", color:rarityColor, textTransform:"capitalize", fontWeight:600, marginTop:2 }}>{group.item.rarity}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:"0.78rem", color:"#94a3b8" }}>Copie:</div>
                  <div style={{ fontSize:"1.1rem", color:"#6ee7b7", fontWeight:700 }}>{group.quantity}</div>
                </div>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(109,40,217,0.1)", border:"1px solid rgba(109,40,217,0.3)", borderRadius:8, padding:"0.6rem 1rem" }}>
                <span style={{ color:"#c4b5fd", fontWeight:700, fontSize:"0.9rem" }}>{group.item.weapon_die}</span>
                <span style={{ color:"#7c3aed", fontSize:"1.2rem", margin:"0 4px" }}>→</span>
                <span style={{ color:"#fbbf24", fontWeight:700, fontSize:"0.9rem" }}>{nextDie}</span>
                <span style={{ marginLeft:"auto", fontSize:"0.72rem", color:"#94a3b8" }}>+ATK +{fLevel+1}</span>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0.5rem 0.8rem", background:hasMat?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${hasMat?"#16a34a44":"#dc262644"}`, borderRadius:8 }}>
                <span style={{ fontSize:"1.2rem" }}>{mat?.emoji || "🔮"}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.82rem", color:"#e2d9c5" }}>{mat?.name || matId}</div>
                  <div style={{ fontSize:"0.7rem", color:"#64748b" }}>Materiale richiesto × 1</div>
                </div>
                <div style={{ fontSize:"0.82rem", color:hasMat?"#6ee7b7":"#fca5a5", fontWeight:700, flexShrink:0 }}>Hai: {inventoryCounts[matId]||0}</div>
              </div>

              <button
                onClick={()=>canForge && onForge(group)}
                disabled={!canForge}
                style={{ width:"100%", padding:"0.75rem", background:canForge?"linear-gradient(135deg,#713f12,#d97706)":"rgba(255,255,255,0.04)", border:`1px solid ${canForge?"#f59e0b":"#1f2937"}`, borderRadius:8, color:canForge?"#fef3c7":"#4b5563", fontFamily:"'Cinzel',serif", fontSize:"0.9rem", cursor:canForge?"pointer":"not-allowed", letterSpacing:"0.06em", fontWeight:700 }}>
                {canForge ? "⚒️ Forgia" : hasMat ? "⏳ Caricamento…" : `Manca: ${mat?.name||matId}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const INV_CATEGORIES = [
  { key:"weapon",    label:"⚔️ Armi" },
  { key:"armor",     label:"🛡️ Armature" },
  { key:"shield",    label:"🔰 Scudi" },
  { key:"accessory", label:"💍 Accessori" },
  { key:"potion",    label:"🧪 Pozioni" },
  { key:"material",  label:"⚗️ Materiali" },
];
function _invCategory(item) {
  const t = item.type;
  if (t === "weapon" || t === "magic") return "weapon";
  if (t === "armor") return "armor";
  if (t === "shield") return "shield";
  if (t === "accessory") return "accessory";
  if (t === "potion" || t === "consumable") return "potion";
  if (t === "material") return "material";
  return "accessory";
}

const RARITY_ORDER = { common:0, uncommon:1, rare:2, epic:3, legendary:4 };
const RARITY_COLOR_INV = { common:"#9ca3af", uncommon:"#34d399", rare:"#60a5fa", epic:"#a78bfa", legendary:"#fbbf24" };

function InventoryView({ loading, groups, equipment, onEquip, onSell, onUse, canUseConsumables }) {
  const [expandedId, setExpandedId] = React.useState(null);
  const [collapsedCats, setCollapsedCats] = React.useState({});
  const [sortBy, setSortBy] = React.useState("cat"); // cat | name | price | rarity

  const byCategory = INV_CATEGORIES.map(cat => ({
    ...cat,
    items: groups.filter(g => _invCategory(g.item) === cat.key),
  })).filter(cat => cat.items.length > 0);

  const toggleCat = key => setCollapsedCats(p => ({ ...p, [key]: !p[key] }));

  const sortedItems = sortBy === "cat" ? null : [...groups].sort((a,b) => {
    if(sortBy === "name")   return a.item.name.localeCompare(b.item.name);
    if(sortBy === "price")  return (b.item.price||0) - (a.item.price||0);
    if(sortBy === "rarity") return (RARITY_ORDER[b.item.rarity]||0) - (RARITY_ORDER[a.item.rarity]||0);
    return 0;
  });

  const renderRow = (group) => {
    const slot = itemSlot(group.item);
    const equipped = !!slot && equipment?.[slot] === group.item.id;
    const open = expandedId === group.item.id;
    const rc = RARITY_COLOR_INV[group.item.rarity] || "#9ca3af";

    return (
      <div key={group.item.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        {/* Compact row */}
        <button onClick={()=>setExpandedId(open ? null : group.item.id)}
          style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"0.55rem 0.75rem",
            background: open ? "rgba(99,102,241,0.08)" : "transparent",
            border:"none", cursor:"pointer", color:"inherit", font:"inherit", textAlign:"left" }}>
          <span style={{ fontSize:"1.4rem", flexShrink:0, width:28, textAlign:"center" }}>{group.item.emoji || "📦"}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.82rem", color:"#e2d9c5", fontWeight:700,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {group.item.name}
              {equipped && <span style={{ marginLeft:6, fontSize:"0.62rem", color:"#fbbf24", fontFamily:"sans-serif" }}>★ equip</span>}
            </div>
            <div style={{ fontSize:"0.68rem", color:rc }}>{itemRarityLabel(group.item.rarity)}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            {group.quantity > 1 && <span style={{ fontSize:"0.72rem", color:"#c4b5fd", fontWeight:700 }}>×{group.quantity}</span>}
            <span style={{ fontSize:"0.72rem", color:"#64748b" }}>💰{group.item.price||0}</span>
            <span style={{ fontSize:"0.7rem", color: open?"#a78bfa":"#334155", transition:"color 0.15s" }}>{open?"▲":"▼"}</span>
          </div>
        </button>

        {/* Expanded detail */}
        {open && (
          <div style={{ padding:"0.75rem 1rem 1rem 1rem", background:"rgba(15,23,42,0.6)", borderTop:"1px solid rgba(99,102,241,0.15)" }}>
            <div style={{ display:"flex", gap:12, marginBottom:10 }}>
              <ArtThumb src={getItemImage(group.item)} alt={group.item.name} size={72} radius={8} />
              <div style={{ flex:1 }}>
                <div style={{ color:"#cbd5e1", fontSize:"0.84rem", lineHeight:1.6, marginBottom:6 }}>{group.item.description}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {itemStatSummary(group.item).map(stat => (
                    <span key={stat} style={{ fontSize:"0.7rem", color:"#d1d5db", background:"rgba(255,255,255,0.05)", border:"1px solid #1f2937", borderRadius:999, padding:"2px 8px" }}>{stat}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end", marginTop:4 }}>
              {isEquippableItem(group.item) && (
                <BigBtn onClick={()=>onEquip(group.entries[0])} gold disabled={equipped}>
                  {equipped ? "Equipaggiato" : "Equipaggia"}
                </BigBtn>
              )}
              {group.item.type === "potion" && canUseConsumables && (
                <BigBtn onClick={()=>onUse(group.entries[0])} gold icon="🧪">Usa</BigBtn>
              )}
              <SmallBtn onClick={()=>onSell(group)}>Vendi</SmallBtn>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"0.75rem" }}>
      {/* Header + sort */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.75rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, fontSize:"1rem", flex:1 }}>🎒 Inventario</h3>
        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
          <span style={{ fontSize:"0.68rem", color:"#475569" }}>Ordina:</span>
          {[["cat","📂 Cat."],["name","A→Z"],["rarity","✨ Rarità"],["price","💰 Prezzo"]].map(([k,l])=>(
            <button key={k} onClick={()=>setSortBy(k)}
              style={{ padding:"2px 8px", fontSize:"0.68rem", borderRadius:4, cursor:"pointer", fontFamily:"inherit",
                background: sortBy===k ? "rgba(99,102,241,0.3)" : "rgba(15,23,42,0.6)",
                border:`1px solid ${sortBy===k?"#6366f1":"#334155"}`,
                color: sortBy===k ? "#a5b4fc" : "#64748b" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}
      {!loading && !groups.length && (
        <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>
          Inventario vuoto. Saccheggia o compra qualcosa.
        </div>
      )}

      {/* By category */}
      {sortBy === "cat" && byCategory.map(cat => (
        <div key={cat.key} style={{ marginBottom:"0.75rem", background:"rgba(15,23,42,0.4)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, overflow:"hidden" }}>
          <button onClick={()=>toggleCat(cat.key)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"0.55rem 0.75rem",
              background:"rgba(255,255,255,0.03)", border:"none", cursor:"pointer", color:"inherit", font:"inherit" }}>
            <span style={{ fontFamily:"'Cinzel',serif", color:"#94a3b8", fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", flex:1, textAlign:"left" }}>
              {cat.label}
            </span>
            <span style={{ fontSize:"0.68rem", color:"#475569" }}>{cat.items.length} oggetti</span>
            <span style={{ fontSize:"0.7rem", color:"#334155", marginLeft:4 }}>{collapsedCats[cat.key]?"▶":"▼"}</span>
          </button>
          {!collapsedCats[cat.key] && cat.items.map(renderRow)}
        </div>
      ))}

      {/* Flat sorted list */}
      {sortBy !== "cat" && (
        <div style={{ background:"rgba(15,23,42,0.4)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, overflow:"hidden" }}>
          {sortedItems.map(renderRow)}
        </div>
      )}
    </div>
  );
}

function PartyTradeView({ me, players, groups, loading, equipment, onTrade }) {
  const partyMates = (players || []).filter(p => p.id !== me?.id && !p.dead);
  const [itemId, setItemId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [price, setPrice] = useState(0);
  const selectedGroup = groups.find(group => group.itemId === itemId) || null;
  const selectedTarget = partyMates.find(p => p.id === targetId) || null;
  const tradePrice = Math.max(0, Number(price) || 0);
  const canTrade = !!selectedGroup && !!selectedTarget && !loading;

  useEffect(() => {
    if(groups.length && (!itemId || !groups.some(group => group.itemId === itemId))) setItemId(groups[0].itemId);
  }, [groups, itemId]);
  useEffect(() => {
    if(partyMates.length && (!targetId || !partyMates.some(p => p.id === targetId))) setTargetId(partyMates[0].id);
  }, [partyMates, targetId]);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🤝 Scambi del Party</h3>
      <div style={{ maxWidth:820, margin:"0 auto", display:"grid", gap:"1rem" }}>
        <Card title="Passa un Oggetto">
          <p style={{ color:"#94a3b8", fontSize:"0.84rem", lineHeight:1.55, margin:"0 0 1rem" }}>
            Scegli un compagno, un oggetto e un prezzo. Prezzo 0 significa regalo.
          </p>
          {!partyMates.length && <div style={{ color:"#64748b", padding:"1rem", border:"1px dashed #334155", borderRadius:6 }}>Nessun altro giocatore nel party.</div>}
          {!loading && !groups.length && <div style={{ color:"#64748b", padding:"1rem", border:"1px dashed #334155", borderRadius:6 }}>Inventario vuoto.</div>}
          {!!partyMates.length && !!groups.length && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10 }}>
                <div>
                  <label style={labelStyle}>Oggetto</label>
                  <select style={{...inputStyle,cursor:"pointer"}} value={itemId} onChange={e=>setItemId(e.target.value)}>
                    {groups.map(group => (
                      <option key={group.itemId} value={group.itemId}>{group.item.name} x{group.quantity}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>A chi</label>
                  <select style={{...inputStyle,cursor:"pointer"}} value={targetId} onChange={e=>setTargetId(e.target.value)}>
                    {partyMates.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.gold || 0} oro)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Prezzo in oro</label>
                  <input style={inputStyle} type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} />
                </div>
              </div>
              {selectedGroup && (
                <div style={{ marginTop:"1rem", background:"rgba(15,23,42,0.78)", border:"1px solid #334155", borderRadius:6, padding:"0.85rem", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                  <ArtThumb src={getItemImage(selectedGroup.item)} alt={selectedGroup.item.name} size={58} />
                  <div style={{ flex:1, minWidth:220 }}>
                    <div style={{ color:"#e2d9c5", fontFamily:"'Cinzel',serif", fontWeight:700 }}>{selectedGroup.item.name}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.78rem" }}>{itemStatSummary(selectedGroup.item).join(" • ") || selectedGroup.item.description}</div>
                  </div>
                  <div style={{ color:tradePrice > 0 ? "#fbbf24" : "#86efac", fontFamily:"'Cinzel',serif", fontWeight:700 }}>
                    {tradePrice > 0 ? `${tradePrice} oro` : "Regalo"}
                  </div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"1rem" }}>
                <BigBtn onClick={()=>onTrade(selectedGroup, targetId, tradePrice)} gold disabled={!canTrade}>
                  {tradePrice > 0 ? "Scambia e incassa" : "Regala oggetto"}
                </BigBtn>
              </div>
            </>
          )}
        </Card>
        <Card title="Regola">
          <div style={{ color:"#cbd5e1", fontSize:"0.86rem", lineHeight:1.6 }}>
            Il compratore deve avere abbastanza oro. Se passi l'ultima copia di un oggetto equipaggiato, viene rimosso dall'equipaggiamento prima dello scambio.
          </div>
        </Card>
      </div>
    </div>
  );
}

function AuctionHouseView({ me, groups, auctions, loading, busy, onRefresh, onCreateAuction, onBid, onCancel, onSettle }) {
  const [mode, setMode] = useState("browse");
  const [itemId, setItemId] = useState("");
  const [startingBid, setStartingBid] = useState(10);
  const [buyout, setBuyout] = useState("");
  const [durationHours, setDurationHours] = useState(24);
  const [bidValues, setBidValues] = useState({});
  const listed = auctions.filter(a => a.status === "open");
  const mine = auctions.filter(a => a.sellerId === me?.id || a.bidderId === me?.id);
  const selectedGroup = groups.find(g => g.itemId === itemId) || null;
  const minBidFor = a => {
    const raw = Math.max(Number(a.startingBid || 1), Number(a.currentBid || 0) + Math.max(1, Math.ceil((a.currentBid || a.startingBid || 1) * 0.1)));
    return a.buyout > 0 ? Math.min(raw, a.buyout) : raw;
  };
  const timeLeft = a => {
    const ms = new Date(a.endsAt).getTime() - Date.now();
    if(ms <= 0) return "scaduta";
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  useEffect(() => {
    if(groups.length && (!itemId || !groups.some(g => g.itemId === itemId))) setItemId(groups[0].itemId);
  }, [groups, itemId]);

  const renderAuction = (a) => {
    const item = a.item || {};
    const expired = new Date(a.endsAt).getTime() <= Date.now();
    const isSeller = a.sellerId === me?.id;
    const isWinner = a.bidderId === me?.id;
    const minBid = minBidFor(a);
    const bidValue = bidValues[a.id] ?? minBid;
    return (
      <div key={a.id} style={{ background:"rgba(15,23,42,0.72)", border:`1px solid ${expired?"#92400e":"#334155"}`, borderRadius:8, padding:"0.85rem", display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap" }}>
        <ArtThumb src={getItemImage(item)} alt={item.name} size={64} radius={8} />
        <div style={{ flex:1, minWidth:240 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
            <span style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{item.name}</span>
            <span style={{ color:RARITY_COLOR_INV[item.rarity] || "#94a3b8", fontSize:"0.68rem", border:"1px solid rgba(148,163,184,0.18)", borderRadius:999, padding:"1px 7px" }}>{itemRarityLabel(item.rarity)}</span>
            {isSeller && <span style={{ color:"#fbbf24", fontSize:"0.65rem" }}>tua asta</span>}
            {isWinner && !isSeller && <span style={{ color:"#86efac", fontSize:"0.65rem" }}>miglior offerta</span>}
          </div>
          <div style={{ color:"#94a3b8", fontSize:"0.76rem", lineHeight:1.45, marginBottom:8 }}>{item.description}</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#cbd5e1" }}>
            <span>Venditore: {a.sellerName}</span>
            <span>Offerta: {a.currentBid ? `${a.currentBid} oro` : "nessuna"}</span>
            {a.bidderName && <span>Leader: {a.bidderName}</span>}
            {a.buyout > 0 && <span>Compra subito: {a.buyout} oro</span>}
            <span style={{ color:expired ? "#fbbf24" : "#94a3b8" }}>Tempo: {timeLeft(a)}</span>
          </div>
        </div>
        <div style={{ width:220, display:"grid", gap:7 }}>
          {!expired && !isSeller && (
            <>
              <input style={inputStyle} type="number" min={minBid} value={bidValue} onChange={e=>setBidValues(v=>({...v,[a.id]:e.target.value}))} />
              <BigBtn onClick={()=>onBid(a, Number(bidValue) || minBid)} gold disabled={busy || (Number(bidValue)||0) < minBid || (me?.gold||0) < (Number(bidValue)||0)}>
                Rilancia
              </BigBtn>
              {a.buyout > 0 && <SmallBtn onClick={()=>onBid(a, a.buyout)} disabled={busy || (me?.gold||0) < a.buyout}>Compra subito</SmallBtn>}
            </>
          )}
          {isSeller && !a.currentBid && !expired && <SmallBtn onClick={()=>onCancel(a)} disabled={busy}>Ritira asta</SmallBtn>}
          {(expired || (a.buyout > 0 && a.currentBid >= a.buyout)) && (isSeller || isWinner) && <BigBtn onClick={()=>onSettle(a)} gold disabled={busy}>Chiudi asta</BigBtn>}
          {expired && !a.currentBid && isSeller && <BigBtn onClick={()=>onCancel(a)} gold disabled={busy}>Riprendi oggetto</BigBtn>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, flex:1 }}>🏦 Mercato ad Aste</h3>
        <SmallBtn onClick={onRefresh} disabled={loading || busy}>Aggiorna</SmallBtn>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:"1rem", flexWrap:"wrap" }}>
        {[["browse","Aste aperte"],["sell","Metti all'asta"],["mine","Le mie aste"]].map(([k,l])=>(
          <button key={k} onClick={()=>setMode(k)} style={{ padding:"0.45rem 0.75rem", borderRadius:6, border:`1px solid ${mode===k?"#fbbf24":"#334155"}`, background:mode===k?"rgba(251,191,36,0.14)":"rgba(15,23,42,0.6)", color:mode===k?"#fde68a":"#94a3b8", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.76rem" }}>{l}</button>
        ))}
      </div>

      {mode === "sell" && (
        <Card title="Crea Asta">
          {!groups.length ? <div style={{ color:"#64748b" }}>Inventario vuoto.</div> : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10 }}>
                <div>
                  <label style={labelStyle}>Oggetto</label>
                  <select style={{...inputStyle,cursor:"pointer"}} value={itemId} onChange={e=>setItemId(e.target.value)}>
                    {groups.map(g => <option key={g.itemId} value={g.itemId}>{g.item.name} x{g.quantity}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Base d'asta</label><input style={inputStyle} type="number" min="1" value={startingBid} onChange={e=>setStartingBid(e.target.value)} /></div>
                <div><label style={labelStyle}>Compra subito</label><input style={inputStyle} type="number" min="0" placeholder="opzionale" value={buyout} onChange={e=>setBuyout(e.target.value)} /></div>
                <div>
                  <label style={labelStyle}>Durata</label>
                  <select style={{...inputStyle,cursor:"pointer"}} value={durationHours} onChange={e=>setDurationHours(Number(e.target.value))}>
                    <option value={6}>6 ore</option><option value={12}>12 ore</option><option value={24}>24 ore</option><option value={48}>48 ore</option>
                  </select>
                </div>
              </div>
              {selectedGroup && (
                <div style={{ marginTop:"1rem", display:"flex", gap:10, alignItems:"center", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:8, padding:"0.75rem" }}>
                  <ArtThumb src={getItemImage(selectedGroup.item)} alt={selectedGroup.item.name} size={58} radius={8} />
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#e2d9c5", fontFamily:"'Cinzel',serif", fontWeight:700 }}>{selectedGroup.item.name}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.76rem" }}>{itemStatSummary(selectedGroup.item).join(" · ") || selectedGroup.item.description}</div>
                  </div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"1rem" }}>
                <BigBtn onClick={()=>onCreateAuction(selectedGroup, { startingBid:Number(startingBid)||1, buyout:Number(buyout)||0, durationHours })} gold disabled={busy || !selectedGroup}>Apri asta</BigBtn>
              </div>
            </>
          )}
        </Card>
      )}

      {mode === "browse" && (
        <div style={{ display:"grid", gap:10 }}>
          {loading && <div style={{ color:"#94a3b8" }}>Caricamento aste...</div>}
          {!loading && !listed.length && <div style={{ color:"#64748b", textAlign:"center", padding:"2rem", border:"1px dashed #334155", borderRadius:8 }}>Nessuna asta aperta.</div>}
          {listed.map(renderAuction)}
        </div>
      )}

      {mode === "mine" && (
        <div style={{ display:"grid", gap:10 }}>
          {!mine.length && <div style={{ color:"#64748b", textAlign:"center", padding:"2rem", border:"1px dashed #334155", borderRadius:8 }}>Non hai aste o offerte attive.</div>}
          {mine.map(renderAuction)}
        </div>
      )}
    </div>
  );
}

const SLOT_CONFIG = [
  { key:"head",    label:"Testa",    icon:"⛑️",  pos:"top-left" },
  { key:"chest",   label:"Petto",    icon:"🧥",  pos:"left" },
  { key:"legs",    label:"Gambe",    icon:"👖",  pos:"bottom-left" },
  { key:"boots",   label:"Stivali",  icon:"👢",  pos:"bottom-left2" },
  { key:"gloves",  label:"Guanti",   icon:"🧤",  pos:"bottom-right2" },
  { key:"weapon",  label:"Arma",     icon:"⚔️",  pos:"top-right" },
  { key:"offhand", label:"Mano Sx",  icon:"🛡️",  pos:"right" },
  { key:"amulet",  label:"Amuleto",  icon:"📿",  pos:"bottom-right" },
  { key:"ring1",   label:"Anello 1", icon:"💍",  pos:"top-left2" },
  { key:"ring2",   label:"Anello 2", icon:"💍",  pos:"top-right2" },
  { key:"cloak",   label:"Mantello", icon:"🧣",  pos:"right2" },
];

function EquipSlotBox({ slotCfg, item, onUnequip, isSelected, onSelect, onPick }) {
  const isEmpty = !item;
  const rarityColors = { common:"#94a3b8", uncommon:"#22c55e", rare:"#3b82f6", epic:"#a855f7", legendary:"#f59e0b" };
  const borderColor = isEmpty ? "rgba(255,255,255,0.1)" : (rarityColors[item?.rarity] || "#94a3b8");
  return (
    <div
      onClick={() => onPick ? onPick(slotCfg.key) : (isEmpty ? null : onSelect(slotCfg.key))}
      style={{
        width:96, height:96, borderRadius:12,
        background: isEmpty ? "rgba(0,0,0,0.35)" : "rgba(15,23,42,0.9)",
        border: `2px solid ${isSelected ? "#fbbf24" : borderColor}`,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        cursor: isEmpty ? "default" : "pointer",
        transition:"border-color 0.2s, transform 0.15s",
        transform: isSelected ? "scale(1.08)" : "scale(1)",
        boxShadow: isSelected ? "0 0 12px rgba(251,191,36,0.4)" : isEmpty ? "none" : `0 0 8px ${borderColor}44`,
        position:"relative", overflow:"hidden",
      }}
      title={slotCfg.label}
    >
      {isEmpty ? (
        <>
          <span style={{ fontSize:"1.8rem", opacity:0.3 }}>{slotCfg.icon}</span>
          <span style={{ fontSize:"0.5rem", color:"#475569", marginTop:2, fontFamily:"'Cinzel',serif" }}>{slotCfg.label}</span>
        </>
      ) : (
        <>
          <ArtThumb src={getItemImage(item)} alt={item.name} size={78} radius={8} />
          <span style={{ fontSize:"0.44rem", color: rarityColors[item.rarity] || "#94a3b8", marginTop:2, fontFamily:"'Cinzel',serif", maxWidth:84, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</span>
        </>
      )}
    </div>
  );
}

function CharacterViewer({ me, equippedItems, size, fillContainer }) {
  const race = me?.race || "human";
  const gender = me?.gender || "male";
  const baseSprite = `/assets/equip/base_${race}_${gender}.png`;
  const overlaySlots = ["chest","legs","boots","gloves","head","weapon","offhand","cloak","amulet"];
  const containerStyle = fillContainer
    ? { position:"relative", width:"100%", height:"100%", maxWidth:"100%", maxHeight:"100%" }
    : { position:"relative", width: size||240, height: size ? size*2 : 480, margin:"0 auto", flexShrink:0 };
  return (
    <div style={containerStyle}>
      {/* Base character */}
      <img
        src={baseSprite}
        alt="personaggio"
        onError={e => { e.currentTarget.style.display="none"; }}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain", userSelect:"none" }}
      />
      {/* Equipment overlays */}
      {overlaySlots.map(slot => {
        const item = equippedItems[slot];
        if(!item?.equipSprite) return null;
        return (
          <img
            key={slot}
            src={`/assets/equip/${item.equipSprite}.png`}
            alt={item.name}
            onError={e => { e.currentTarget.style.display="none"; }}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"contain", userSelect:"none", pointerEvents:"none" }}
          />
        );
      })}
      {/* Fallback silhouette */}
      <svg viewBox="0 0 100 200" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.18, pointerEvents:"none" }} fill="rgba(167,139,250,0.8)">
        <ellipse cx="50" cy="22" rx="16" ry="18"/>
        <rect x="28" y="42" width="44" height="70" rx="8"/>
        <rect x="10" y="44" width="18" height="55" rx="7"/>
        <rect x="72" y="44" width="18" height="55" rx="7"/>
        <rect x="30" y="112" width="17" height="70" rx="7"/>
        <rect x="53" y="112" width="17" height="70" rx="7"/>
      </svg>
    </div>
  );
}

function DonateView({ me, players, groups, loading, onTrade }) {
  const partyMates = (players || []).filter(p => p.id !== me?.id && !p.dead);
  const [itemId, setItemId] = useState("");
  const [targetId, setTargetId] = useState("");
  const selectedGroup = groups.find(g => g.itemId === itemId) || null;

  useEffect(() => {
    if(groups.length && (!itemId || !groups.some(g => g.itemId === itemId))) setItemId(groups[0].itemId);
  }, [groups, itemId]);
  useEffect(() => {
    if(partyMates.length && (!targetId || !partyMates.some(p => p.id === targetId))) setTargetId(partyMates[0].id);
  }, [partyMates, targetId]);

  const canDonate = !!selectedGroup && !!targetId && !loading;

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🎁 Dona un Oggetto</h3>
      <div style={{ maxWidth:640, margin:"0 auto", display:"grid", gap:"1rem" }}>
        <Card title="Regalo al Compagno">
          <p style={{ color:"#94a3b8", fontSize:"0.84rem", lineHeight:1.55, margin:"0 0 1rem" }}>
            Scegli un compagno e un oggetto da regalare gratuitamente.
          </p>
          {!partyMates.length && <div style={{ color:"#64748b", padding:"1rem", border:"1px dashed #334155", borderRadius:6 }}>Nessun altro giocatore nel party.</div>}
          {!loading && !groups.length && <div style={{ color:"#64748b", padding:"1rem", border:"1px dashed #334155", borderRadius:6 }}>Inventario vuoto.</div>}
          {!!partyMates.length && !!groups.length && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10 }}>
                <div>
                  <label style={labelStyle}>Oggetto</label>
                  <select style={{...inputStyle,cursor:"pointer"}} value={itemId} onChange={e=>setItemId(e.target.value)}>
                    {groups.map(g => <option key={g.itemId} value={g.itemId}>{g.item.name} x{g.quantity}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>A chi</label>
                  <select style={{...inputStyle,cursor:"pointer"}} value={targetId} onChange={e=>setTargetId(e.target.value)}>
                    {partyMates.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              {selectedGroup && (
                <div style={{ marginTop:"1rem", background:"rgba(15,23,42,0.78)", border:"1px solid #334155", borderRadius:6, padding:"0.85rem", display:"flex", gap:10, alignItems:"center" }}>
                  <ArtThumb src={getItemImage(selectedGroup.item)} alt={selectedGroup.item.name} size={58} />
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#e2d9c5", fontFamily:"'Cinzel',serif", fontWeight:700 }}>{selectedGroup.item.name}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.78rem" }}>{itemStatSummary(selectedGroup.item).join(" • ") || selectedGroup.item.description}</div>
                  </div>
                  <div style={{ color:"#86efac", fontFamily:"'Cinzel',serif", fontWeight:700 }}>Gratis</div>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"1rem" }}>
                <BigBtn onClick={()=>onTrade(selectedGroup, targetId, 0)} gold disabled={!canDonate}>
                  🎁 Regala
                </BigBtn>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── StoryView v2 ─────────────────────────────────────────────
const STORY_TYPE_COLORS = {
  story:       { accent:"#a78bfa", bg:"rgba(109,40,217,0.12)", border:"#6d28d9" },
  narration:   { accent:"#a78bfa", bg:"rgba(109,40,217,0.12)", border:"#6d28d9" },
  choice:      { accent:"#fbbf24", bg:"rgba(180,83,9,0.12)",   border:"#b45309" },
  skillCheck:  { accent:"#c084fc", bg:"rgba(88,28,135,0.18)",  border:"#7e22ce" },
  combat:      { accent:"#f87171", bg:"rgba(127,29,29,0.18)",  border:"#991b1b" },
  reward:      { accent:"#34d399", bg:"rgba(6,78,59,0.18)",    border:"#065f46" },
  loot:        { accent:"#34d399", bg:"rgba(6,78,59,0.18)",    border:"#065f46" },
  event:       { accent:"#60a5fa", bg:"rgba(30,58,138,0.18)",  border:"#1e40af" },
  rest:        { accent:"#86efac", bg:"rgba(20,83,45,0.18)",   border:"#14532d" },
  ending:      { accent:"#fde68a", bg:"rgba(120,53,15,0.22)",  border:"#92400e" },
  gameOver:    { accent:"#ff4444", bg:"rgba(80,0,0,0.3)",      border:"#7f1d1d" },
  returnPoint: { accent:"#fb923c", bg:"rgba(120,53,15,0.14)",  border:"#92400e" },
};
const SCENE_ICON = { story:"📜", narration:"📜", choice:"🔀", skillCheck:"🎲", combat:"⚔️", reward:"💰", loot:"💰", event:"⚡", rest:"🏕️", ending:"🏁", gameOver:"💀", returnPoint:"🔁" };
const ENDING_ICONS = { good:"🏆", neutral:"🤝", fail:"💀", secret:"✨" };

function MasterStoriesWrapper({ parties, builtinStories, dbGetPartyState, dbSavePartyState, supabase }) {
  const [customStories, setCustomStories] = useState([]);
  useEffect(() => {
    supabase.from("party_state").select("combat").eq("party_code","__story_library__").maybeSingle()
      .then(({ data }) => { if(data?.combat?.stories) setCustomStories(data.combat.stories); }).catch(()=>{});
  }, []);
  const allStories = [
    ...builtinStories.map(s=>({...s, _builtin:true})),
    ...customStories,
  ];
  const findStory = id => allStories.find(s=>s.id===id);
  return (
    <MasterStoriesPanel
      parties={parties}
      stories={allStories}
      onDelete={async (storyId) => {
        const updated = customStories.filter(s=>s.id!==storyId);
        setCustomStories(updated);
        await supabase.from("party_state").upsert(
          { party_code:"__story_library__", combat:{ stories: updated }, updated_at: new Date().toISOString() },
          { onConflict:"party_code" }
        );
      }}
      onStart={async (storyId, partyCode, mode = "party") => {
        const story = findStory(storyId);
        if(!story || !partyCode) return;
        const latestQs = await dbGetPartyState(partyCode);
        const firstChapter = story.chapters[0];
        const firstSceneId = firstChapter?.startScene;
        const isCustom = !!customStories.find(s=>s.id===storyId);
        const newStory = { active:true, storyId, mode, soloPlayerId: null, votes:{}, currentChapterId:firstChapter?.id, currentSceneId:firstSceneId, storyFlags:{}, choiceLog:[], visitedScenes:[firstSceneId].filter(Boolean), rewardCollected:[], battlePending:false, battleNext:null, battleNextFail:null, startedAt:Date.now(), ...(isCustom?{_previewStory:story}:{}) };
        await dbSavePartyState(partyCode, { ...latestQs, story: newStory });
        await supabase.from("messages").insert({ party_code:partyCode, author:"Master", content:`📖 **La storia inizia**: ${story.emoji} *${story.title}*`, type:"narration" });
      }}
      onStop={async (partyCode) => {
        const latestQs = await dbGetPartyState(partyCode);
        await dbSavePartyState(partyCode, { ...latestQs, story:{ active:false } });
      }}
      onJump={async (storyId, partyCode, sceneId) => {
        const latestQs = await dbGetPartyState(partyCode);
        const story = findStory(storyId);
        const scene = story?.scenes?.[sceneId];
        await dbSavePartyState(partyCode, { ...latestQs, story:{ ...latestQs.story, currentSceneId:sceneId, currentChapterId:scene?.chapterId||latestQs.story?.currentChapterId } });
      }}
      dbGetPartyState={dbGetPartyState}
    />
  );
}

function MasterStoriesPanel({ parties, stories, onStart, onStop, onJump, onDelete, dbGetPartyState }) {
  const [selectedStory, setSelectedStory] = useState(stories[0]?.id || "");
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedMode, setSelectedMode] = useState("party");
  const [partyStoryStates, setPartyStoryStates] = useState({});
  const [jumpScene, setJumpScene] = useState("");
  const [busy, setBusy] = useState(false);
  const [expandedStory, setExpandedStory] = useState(null);
  const [showDiagram, setShowDiagram] = useState(null);

  useEffect(() => {
    if(!parties.length) return;
    Promise.all(parties.map(async p => {
      const qs = await dbGetPartyState(p).catch(()=>null);
      return [p, qs?.story || null];
    })).then(results => setPartyStoryStates(Object.fromEntries(results)));
  }, [parties]);

  const story = stories.find(s => s.id === selectedStory);
  const TYPE_COLOR = { story:"#6366f1", choice:"#f59e0b", skillCheck:"#c084fc", combat:"#ef4444", reward:"#22c55e", ending:"#fde68a", gameOver:"#ff4444", returnPoint:"#fb923c" };

  return (
    <div style={{ display:"grid", gap:"1.2rem" }}>
      <Card title="📚 Catalogo Storie">
        <div style={{ display:"grid", gap:"0.8rem" }}>
          {stories.map(s => (
            <div key={s.id} style={{ background:"rgba(15,23,42,0.7)", border:"1px solid #1e293b", borderRadius:8, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.7rem 0.9rem", cursor:"pointer" }} onClick={()=>setExpandedStory(expandedStory===s.id?null:s.id)}>
                <span style={{ fontSize:"1.5rem" }}>{s.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#e2d9c5", fontFamily:"'Cinzel',serif", fontWeight:700 }}>{s.title}</div>
                  <div style={{ color:"#64748b", fontSize:"0.75rem" }}>{s.difficulty} · {s.chapters?.length} capitoli · {Object.keys(s.scenes||{}).length} scene · {s.tags?.join(", ")}</div>
                </div>
                <SmallBtn onClick={e=>{e.stopPropagation();setShowDiagram(showDiagram===s.id?null:s.id);}}>🗺️ Mappa</SmallBtn>
                {onDelete && !s._builtin && <SmallBtn onClick={e=>{e.stopPropagation(); if(window.confirm(`Eliminare "${s.title}"?`)) onDelete(s.id);}} style={{color:"#f87171",borderColor:"#f87171"}}>🗑️</SmallBtn>}
                <span style={{ color:"#475569", fontSize:"0.8rem" }}>{expandedStory===s.id?"▲":"▼"}</span>
              </div>
              {expandedStory===s.id && (
                <div style={{ padding:"0 0.9rem 0.9rem", borderTop:"1px solid #1e293b" }}>
                  <p style={{ color:"#94a3b8", fontSize:"0.84rem", margin:"0.6rem 0 0.8rem" }}>{s.description}</p>
                  {s.chapters?.map(ch => (
                    <div key={ch.id} style={{ marginBottom:8 }}>
                      <div style={{ color:"#fbbf24", fontSize:"0.74rem", fontFamily:"'Cinzel',serif", marginBottom:4 }}>📖 {ch.title}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                        {Object.values(s.scenes||{}).filter(sc=>sc.chapterId===ch.id).map(sc => (
                          <span key={sc.id} style={{ fontSize:"0.68rem", padding:"2px 7px", borderRadius:4, background:"rgba(15,23,42,0.8)", border:`1px solid ${TYPE_COLOR[sc.type]||"#334155"}55`, color:TYPE_COLOR[sc.type]||"#94a3b8" }}>
                            {SCENE_ICON[sc.type]||"•"} {sc.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showDiagram===s.id && (
                <div style={{ borderTop:"1px solid #1e293b", padding:"0.8rem" }}>
                  <StoryDiagram story={s} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="▶️ Avvia Storia per un Party">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"0.8rem" }}>
          <div>
            <label style={labelStyle}>Storia</label>
            <select style={{...inputStyle,cursor:"pointer"}} value={selectedStory} onChange={e=>setSelectedStory(e.target.value)}>
              {stories.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.title}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Party</label>
            <select style={{...inputStyle,cursor:"pointer"}} value={selectedParty} onChange={e=>setSelectedParty(e.target.value)}>
              <option value="">— scegli party —</option>
              {parties.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <select style={{...inputStyle, cursor:"pointer", width:"auto"}} value={selectedMode} onChange={e=>setSelectedMode(e.target.value)}>
            <option value="party">👥 Party (voto maggioranza)</option>
            <option value="solo">🧍 Solitaria</option>
          </select>
          <BigBtn gold disabled={!selectedParty||!selectedStory||busy} onClick={async()=>{ setBusy(true); await onStart(selectedStory,selectedParty,selectedMode); setBusy(false); }}>▶️ Avvia</BigBtn>
          <SmallBtn disabled={!selectedParty||busy} onClick={async()=>{ if(!window.confirm("Interrompere la storia in corso?")) return; setBusy(true); await onStop(selectedParty); setBusy(false); }}>⏹ Interrompi</SmallBtn>
          <SmallBtn disabled={!selectedParty||!selectedStory||busy} onClick={async()=>{ if(!window.confirm("Resettare la storia dall'inizio?")) return; setBusy(true); await onStop(selectedParty); await new Promise(r=>setTimeout(r,300)); await onStart(selectedStory,selectedParty,selectedMode); setBusy(false); }}>🔄 Resetta</SmallBtn>
        </div>
      </Card>

      <Card title="📊 Stato Storie in Corso">
        {!parties.length && <div style={{ color:"#64748b", fontSize:"0.84rem" }}>Nessun party attivo.</div>}
        {parties.map(p => {
          const ps = partyStoryStates[p];
          if(!ps?.active) return (
            <div key={p} style={{ display:"flex", justifyContent:"space-between", padding:"0.5rem 0", borderBottom:"1px solid #1e293b", color:"#475569", fontSize:"0.82rem" }}>
              <span style={{ fontFamily:"'Cinzel',serif" }}>{p}</span><span>Nessuna storia attiva</span>
            </div>
          );
          const st = STORIES.find(s=>s.id===ps.storyId);
          const currentScene = st?.scenes?.[ps.currentSceneId];
          const currentChap = st?.chapters?.find(c=>c.id===ps.currentChapterId);
          return (
            <div key={p} style={{ background:"rgba(15,23,42,0.5)", border:"1px solid #312e81", borderRadius:6, padding:"0.7rem", marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:6 }}>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#a5b4fc", fontWeight:700 }}>{p}</div>
                  <div style={{ color:"#e2d9c5", fontSize:"0.84rem" }}>{st?.emoji} {st?.title}</div>
                  <div style={{ color:"#fbbf24", fontSize:"0.78rem", marginTop:2 }}>
                    {currentChap?.title} → <strong>{currentScene?.title}</strong>
                    <span style={{ color:TYPE_COLOR[currentScene?.type]||"#94a3b8", marginLeft:5 }}>({SCENE_ICON[currentScene?.type]||"?"} {currentScene?.type})</span>
                  </div>
                  {Object.keys(ps.storyFlags||{}).length > 0 && (
                    <div style={{ marginTop:4, display:"flex", flexWrap:"wrap", gap:4 }}>
                      {Object.entries(ps.storyFlags).map(([k,v])=>(
                        <span key={k} style={{ fontSize:"0.64rem", padding:"1px 6px", borderRadius:4, background:"rgba(99,102,241,0.15)", border:"1px solid #312e81", color:"#a5b4fc" }}>
                          {k}: {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", gap:6, flexDirection:"column", alignItems:"flex-end" }}>
                  <select style={{...inputStyle,fontSize:"0.74rem",padding:"4px 6px",cursor:"pointer"}} value={jumpScene} onChange={e=>setJumpScene(e.target.value)}>
                    <option value="">— salta a scena —</option>
                    {st && st.chapters?.map(ch=>(
                      <optgroup key={ch.id} label={`📖 ${ch.title}`}>
                        {Object.values(st.scenes||{}).filter(sc=>sc.chapterId===ch.id).map(sc=>(
                          <option key={sc.id} value={sc.id}>{SCENE_ICON[sc.type]||"•"} {sc.title}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <SmallBtn disabled={!jumpScene||busy} onClick={async()=>{ setBusy(true); await onJump(ps.storyId,p,jumpScene); setJumpScene(""); setBusy(false); }}>⏩ Salta</SmallBtn>
                </div>
              </div>
              {ps.choiceLog?.length > 0 && (
                <div style={{ marginTop:"0.6rem", borderTop:"1px solid #1e293b", paddingTop:"0.5rem" }}>
                  <div style={{ color:"#475569", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Scelte:</div>
                  {ps.choiceLog.slice(-4).map((log,i)=>(
                    <div key={i} style={{ fontSize:"0.74rem", color:"#64748b" }}>→ <span style={{ color:"#94a3b8" }}>{log.sceneTitle}</span>: <em style={{ color:"#fbbf24" }}>{log.choiceText}</em></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function StoryDiagram({ story }) {
  const ref = React.useRef(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if(!ref.current || !story?.scenes) return;

    // Build diagram inline
    const TYPE_COLOR = { story:"#4a7c59", choice:"#7c5a4a", skillCheck:"#5a4a7c", combat:"#7c1a1a", reward:"#4a6a7c", ending:"#2d6a4f", gameOver:"#333", returnPoint:"#7c6a1a" };
    const safeId = id => id.replace(/-/g,"_");
    const nodeLabel = (id, sc) => {
      const icon = SCENE_ICON[sc.type]||"•";
      return `"${icon} ${(sc.title||id).replace(/"/g,"'").slice(0,28)}"`;
    };
    const lines = ["flowchart TD"];
    const edges = [];
    const styles = [];
    Object.entries(story.scenes).forEach(([id, sc]) => {
      const sid = safeId(id);
      let shape;
      if(sc.type==="returnPoint"||sc.isReturnPoint) shape=`(((${nodeLabel(id,sc)})))`;
      else if(sc.type==="gameOver") shape=`[/${nodeLabel(id,sc)}/]`;
      else if(sc.type==="ending") shape=`([${nodeLabel(id,sc)}])`;
      else if(sc.type==="choice") shape=`{${nodeLabel(id,sc)}}`;
      else shape=`[${nodeLabel(id,sc)}]`;
      lines.push(`  ${sid}${shape}`);
      styles.push(`  style ${sid} fill:${TYPE_COLOR[sc.type]||"#334155"},color:#fff`);
      if(sc.nextScene) edges.push(`  ${sid} --> ${safeId(sc.nextScene)}`);
      sc.choices?.forEach(c=>{ edges.push(`  ${sid} -->|"${c.text.slice(0,18).replace(/"/g,"'")}..."| ${safeId(c.nextScene)}`); });
      if(sc.skillCheck) {
        edges.push(`  ${sid} -->|"✅"| ${safeId(sc.skillCheck.successScene)}`);
        edges.push(`  ${sid} -->|"❌"| ${safeId(sc.skillCheck.failureScene)}`);
      }
      if(sc.combat) {
        edges.push(`  ${sid} -->|"⚔️"| ${safeId(sc.combat.successScene)}`);
        edges.push(`  ${sid} -->|"💀"| ${safeId(sc.combat.failureScene)}`);
      }
      if(sc.gameOver?.retryScene) edges.push(`  ${sid} -.->|"🔄"| ${safeId(sc.gameOver.retryScene)}`);
    });
    const diagram = [...lines,...edges,...styles].join("\n");

    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad:false, theme:"dark", securityLevel:"loose" });
      const id = "mermaid-" + story.id;
      ref.current.innerHTML = `<div class="mermaid" id="${id}">${diagram}</div>`;
      mermaid.run({ nodes: [ref.current.querySelector(".mermaid")] }).catch(e => setError(e.message));
    }).catch(e => setError("Mermaid non disponibile: " + e.message));
  }, [story]);

  if(error) return <div style={{ color:"#f87171", fontSize:"0.78rem", padding:"0.5rem" }}>Errore diagramma: {error}</div>;
  return <div ref={ref} style={{ background:"rgba(2,6,23,0.6)", borderRadius:8, padding:"0.5rem", overflowX:"auto", minHeight:60 }} />;
}

function PlayerStoryLibrary({ stories, storyState, myId, onStartSolo, onStartParty, setTab }) {
  const [expanded, setExpanded] = useState(null);
  const abandonedId = myId ? localStorage.getItem(`eoz_story_abandoned_${myId}`) : null;
  const hasAbandoned = abandonedId && abandonedId === storyState?.storyId;
  const isActive = storyState?.active && !hasAbandoned;
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"0.3rem" }}>📚 Libreria Storie</h3>
      <p style={{ color:"#64748b", fontSize:"0.8rem", marginBottom:"1rem" }}>Scegli una storia e come vuoi giocarla.</p>
      {isActive && (
        <div style={{ background:"rgba(99,102,241,0.1)", border:"1px solid #6366f1", borderRadius:8, padding:"0.7rem 1rem", marginBottom:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"#a5b4fc", fontSize:"0.85rem" }}>📖 Storia in corso — <strong>{storyState.mode==="solo"?"Solitaria":"Party"}</strong></span>
          <button style={{ padding:"0.3rem 0.9rem", background:"#6366f1", border:"none", borderRadius:6, color:"#fff", cursor:"pointer", fontSize:"0.8rem" }} onClick={()=>setTab("story")}>▶ Vai alla storia</button>
        </div>
      )}
      <div style={{ display:"grid", gap:"0.7rem" }}>
        {stories.map(s => (
          <div key={s.id} style={{ background:"rgba(15,23,42,0.8)", border:"1px solid #1e293b", borderRadius:10, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.8rem 1rem", cursor:"pointer" }} onClick={()=>setExpanded(expanded===s.id?null:s.id)}>
              <span style={{ fontSize:"1.6rem" }}>{s.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:"#e2d9c5", fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"0.95rem" }}>{s.title}</div>
                <div style={{ color:"#64748b", fontSize:"0.73rem" }}>{s.difficulty} · {s.chapters?.length||0} capitoli · {Object.keys(s.scenes||{}).length} scene</div>
              </div>
              <span style={{ color:"#475569" }}>{expanded===s.id?"▲":"▼"}</span>
            </div>
            {expanded===s.id && (
              <div style={{ padding:"0 1rem 1rem", borderTop:"1px solid #1e293b" }}>
                <p style={{ color:"#94a3b8", fontSize:"0.84rem", margin:"0.6rem 0 1rem" }}>{s.description || "Nessuna descrizione."}</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <button
                    style={{ padding:"0.5rem 1.2rem", background:"linear-gradient(135deg,#6366f1,#4f46e5)", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", fontWeight:700 }}
                    onClick={()=>{ onStartSolo(s.id); setTab("story"); }}
                    disabled={isActive}
                  >🧍 Gioca in Solitaria</button>
                  <button
                    style={{ padding:"0.5rem 1.2rem", background:"linear-gradient(135deg,#f59e0b,#d97706)", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", fontWeight:700 }}
                    onClick={()=>{ onStartParty(s.id); setTab("story"); }}
                    disabled={isActive}
                  >👥 Gioca in Party</button>
                </div>
                {isActive && <div style={{ color:"#64748b", fontSize:"0.75rem", marginTop:6 }}>Termina la storia in corso prima di iniziarne una nuova.</div>}
              </div>
            )}
          </div>
        ))}
        {stories.length === 0 && <div style={{ color:"#475569", textAlign:"center", padding:"2rem" }}>Nessuna storia disponibile.</div>}
      </div>
    </div>
  );
}

function StoryView({ story, scene, storyState, isLeader, me, myId, partyPlayers, onAdvance, onChoice, onVote, onFight, onSkillCheck, onLeave }) {
  if(!story || !scene) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", textAlign:"center" }}>
      <div>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📖</div>
        <div style={{ color:"#475569", fontFamily:"'Cinzel',serif" }}>Nessuna storia in corso.</div>
        <div style={{ color:"#334155", fontSize:"0.82rem", marginTop:"0.5rem" }}>Il Master deve avviare una storia dal suo pannello.</div>
      </div>
    </div>
  );

  const col = STORY_TYPE_COLORS[scene.type] || STORY_TYPE_COLORS.story;
  const storyFlags = storyState?.storyFlags || {};

  const meetsRequirements = (req) => {
    if(!req) return true;
    if(req.flags) {
      for(const [k,v] of Object.entries(req.flags)) {
        if(storyFlags[k] !== v) return false;
      }
    }
    if(req.minLevel && me?.level < req.minLevel) return false;
    return true;
  };

  const paragraphs = (scene.text || "").split("\n").filter(p => p.trim());

  const renderText = () => (
    <div style={{ padding:"1.1rem", display:"flex", flexDirection:"column", gap:"0.8rem" }}>
      {paragraphs.map((p, i) => {
        const isItalic = p.startsWith("*") && p.endsWith("*");
        const isQuote = p.startsWith('"') || p.startsWith('“');
        const text = isItalic ? p.slice(1,-1) : p;
        return (
          <p key={i} style={{
            margin:0, lineHeight:1.8, fontSize:"0.95rem",
            color: isQuote ? "#fde68a" : isItalic ? "#94a3b8" : "#e2d9c5",
            fontFamily: isQuote ? "'Crimson Pro',Georgia,serif" : "inherit",
            fontStyle: (isQuote||isItalic) ? "italic" : "normal",
            paddingLeft: isQuote ? "1rem" : 0,
            borderLeft: isQuote ? `3px solid ${col.border}` : "none",
          }}>{text}</p>
        );
      })}
    </div>
  );

  const currentChapter = story.chapters?.find(c => c.id === storyState?.currentChapterId);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(2,6,23,0.45)" }}>
      <div style={{ maxWidth:760, margin:"0 auto", display:"flex", flexDirection:"column", gap:"1rem" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.6rem 0.9rem", background:"rgba(15,23,42,0.6)", borderRadius:8, border:"1px solid #1e293b" }}>
          <span style={{ fontSize:"1.4rem" }}>{story.emoji}</span>
          <div>
            <div style={{ color:"#94a3b8", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>
              Storia in corso · {storyState?.mode === "solo" ? "🧍 Solitaria" : "👥 Party"}
            </div>
            <div style={{ color:"#e2d9c5", fontFamily:"'Cinzel',serif", fontSize:"0.9rem", fontWeight:700 }}>{story.title}</div>
          </div>
          {currentChapter && (
            <div style={{ marginLeft:"auto", fontSize:"0.72rem", color:"#475569", fontFamily:"'Cinzel',serif", textAlign:"right" }}>
              <div>{currentChapter.title}</div>
              <div style={{ color:col.accent }}>{scene.title}</div>
            </div>
          )}
          <button
            onClick={()=>{
              if(isLeader) {
                if(window.confirm("Sei il leader — abbandonare termina la storia per tutto il party. Confermi?")) onAdvance(null);
              } else {
                if(window.confirm("Vuoi uscire dalla storia? Gli altri continueranno senza di te.")) onLeave();
              }
            }}
            style={{ marginLeft: currentChapter ? "0.5rem" : "auto", padding:"0.25rem 0.7rem", background:"transparent", border:"1px solid #475569", borderRadius:6, color:"#64748b", cursor:"pointer", fontSize:"0.72rem", whiteSpace:"nowrap" }}
          >✕ Abbandona</button>
        </div>

        {/* Scene card */}
        <div style={{ background:col.bg, border:`1px solid ${col.border}`, borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"0.8rem 1.1rem", borderBottom:`1px solid ${col.border}44`, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:"1.1rem" }}>{SCENE_ICON[scene.type]||"📜"}</span>
            <span style={{ fontFamily:"'Cinzel',serif", color:col.accent, fontSize:"1rem", fontWeight:700 }}>{scene.title}</span>
          </div>

          {renderText()}

          {/* Skill check info */}
          {scene.type === "skillCheck" && scene.skillCheck && (
            <div style={{ margin:"0 1.1rem 1rem", padding:"0.7rem", background:"rgba(88,28,135,0.2)", border:"1px solid #7e22ce", borderRadius:8 }}>
              <div style={{ color:"#c084fc", fontSize:"0.82rem", fontWeight:700, marginBottom:4 }}>🎲 Prova di Abilità</div>
              <div style={{ color:"#a78bfa", fontSize:"0.78rem" }}>
                Stat: <strong>{scene.skillCheck.stat?.toUpperCase()}</strong> · DC: <strong>{scene.skillCheck.dc}</strong>
              </div>
              <div style={{ color:"#7c3aed", fontSize:"0.74rem", marginTop:4 }}>
                {scene.skillCheck.successText && <div>✅ {scene.skillCheck.successText}</div>}
                {scene.skillCheck.failureText && <div>❌ {scene.skillCheck.failureText}</div>}
              </div>
            </div>
          )}

          {/* Combat monsters */}
          {scene.type === "combat" && scene.combat?.monsters?.length > 0 && (
            <div style={{ margin:"0 1.1rem 1rem", display:"flex", flexWrap:"wrap", gap:6 }}>
              {scene.combat.monsters.map(m => (
                <div key={m.id} style={{ fontSize:"0.78rem", padding:"6px 10px", borderRadius:6, background:"rgba(127,29,29,0.2)", border:"1px solid #991b1b", color:"#fca5a5", display:"flex", gap:5, alignItems:"center" }}>
                  <span>{m.emoji}</span>
                  <span style={{ fontFamily:"'Cinzel',serif", fontWeight:700 }}>{m.name}</span>
                  <span style={{ color:"#dc2626" }}>❤️{m.hp}</span>
                  <span style={{ color:"#f87171" }}>⚔️{m.atk}</span>
                </div>
              ))}
            </div>
          )}

          {/* Rewards preview */}
          {(scene.type==="reward"||scene.type==="ending") && scene.rewards && scene.outcomeType !== "partial" && scene.outcomeType !== "defeat" && (
            <div style={{ margin:"0 1.1rem 1rem", display:"flex", flexWrap:"wrap", gap:6 }}>
              {scene.rewards.xp > 0 && <span style={{ fontSize:"0.78rem", padding:"4px 10px", borderRadius:999, background:"rgba(6,78,59,0.2)", border:"1px solid #065f46", color:"#6ee7b7" }}>⭐ +{scene.rewards.xp} XP a testa</span>}
              {scene.rewards.gold > 0 && <span style={{ fontSize:"0.78rem", padding:"4px 10px", borderRadius:999, background:"rgba(6,78,59,0.2)", border:"1px solid #065f46", color:"#6ee7b7" }}>💰 +{scene.rewards.gold} oro a testa</span>}
            </div>
          )}
          {/* Partial failure rewards preview */}
          {scene.type==="ending" && scene.outcomeType==="partial" && scene.rewards?.xp > 0 && (
            <div style={{ margin:"0 1.1rem 1rem", display:"flex", flexWrap:"wrap", gap:6 }}>
              <span style={{ fontSize:"0.78rem", padding:"4px 10px", borderRadius:999, background:"rgba(120,53,15,0.2)", border:"1px solid #92400e", color:"#fcd34d" }}>⭐ +{Math.floor(scene.rewards.xp * 0.3)} XP a testa (30%)</span>
              <span style={{ fontSize:"0.78rem", padding:"4px 10px", borderRadius:999, background:"rgba(71,85,105,0.2)", border:"1px solid #475569", color:"#94a3b8" }}>💰 0 oro</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ padding:"0 1.1rem 1.1rem", display:"flex", gap:8, justifyContent:"flex-end", flexWrap:"wrap" }}>
            {/* story / returnPoint / reward */}
            {(scene.type==="story"||scene.type==="narration"||scene.type==="returnPoint"||scene.type==="rest") && isLeader && scene.nextScene && (
              <BigBtn onClick={()=>onAdvance(scene.nextScene)} gold>📜 Continua</BigBtn>
            )}
            {(scene.type==="story"||scene.type==="narration"||scene.type==="returnPoint"||scene.type==="rest") && !isLeader && (
              <span style={{ color:"#475569", fontSize:"0.78rem", alignSelf:"center" }}>In attesa del capo-party…</span>
            )}

            {/* choice */}
            {scene.type==="choice" && (() => {
              const isPartyMode = storyState?.mode === "party";
              const votes = storyState?.votes || {};
              const myVote = votes[myId];
              const totalPlayers = partyPlayers.length || 1;
              const allVoted = Object.keys(votes).length >= totalPlayers;
              return (
                <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:8 }}>
                  {isPartyMode && (
                    <div style={{ fontSize:"0.75rem", color:"#64748b", marginBottom:2 }}>
                      🗳️ Votazione — {Object.keys(votes).length}/{totalPlayers} hanno votato
                      {allVoted && <span style={{ color:"#22c55e", marginLeft:6 }}>✓ Risoluzione in corso…</span>}
                    </div>
                  )}
                  {scene.choices?.map((c, i) => {
                    const locked = !meetsRequirements(c.requirements);
                    const voteCount = isPartyMode ? Object.values(votes).filter(v=>v===i).length : 0;
                    const iMyVote = isPartyMode && myVote === i;
                    const bg = locked ? "rgba(15,23,42,0.5)" : iMyVote ? "rgba(99,102,241,0.3)" : i===0 ? "rgba(120,53,15,0.3)" : "rgba(15,23,42,0.7)";
                    const border = locked ? "#334155" : iMyVote ? "#6366f1" : i===0 ? "#b45309" : "#334155";
                    return (
                      <button key={i} disabled={locked}
                        onClick={()=> isPartyMode ? onVote(i) : (isLeader ? onChoice(i) : null)}
                        style={{ textAlign:"left", padding:"0.7rem 1rem", borderRadius:8, cursor:(locked||(!isPartyMode&&!isLeader))?"not-allowed":"pointer", opacity:locked?0.4:1, background:bg, border:`1px solid ${border}`, color:locked?"#475569":"#e2d9c5", fontSize:"0.9rem", transition:"background 0.15s", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span>{c.text}{locked && <span style={{ marginLeft:8, fontSize:"0.72rem", color:"#475569" }}>(richiede condizioni)</span>}</span>
                        {isPartyMode && voteCount > 0 && <span style={{ background:"rgba(99,102,241,0.4)", borderRadius:6, padding:"1px 8px", fontSize:"0.75rem", color:"#a5b4fc", flexShrink:0 }}>{voteCount} 🗳️</span>}
                        {iMyVote && <span style={{ fontSize:"0.72rem", color:"#818cf8", marginLeft:4 }}>✓ tuo voto</span>}
                      </button>
                    );
                  })}
                  {!isPartyMode && !isLeader && (
                    <span style={{ color:"#64748b", fontSize:"0.78rem", alignSelf:"center" }}>In attesa del capo-party…</span>
                  )}
                </div>
              );
            })()}

            {/* skillCheck */}
            {scene.type==="skillCheck" && isLeader && (
              <BigBtn onClick={()=>onSkillCheck(scene)} gold>🎲 Effettua la prova</BigBtn>
            )}
            {scene.type==="skillCheck" && !isLeader && (
              <span style={{ color:"#475569", fontSize:"0.78rem", alignSelf:"center" }}>Il capo-party effettua la prova…</span>
            )}

            {/* combat */}
            {scene.type==="combat" && isLeader && (
              <BigBtn onClick={()=>onFight(scene)} gold>⚔️ Affronta il nemico</BigBtn>
            )}
            {scene.type==="combat" && !isLeader && (
              <span style={{ color:"#f87171", fontSize:"0.82rem", alignSelf:"center" }}>Il capo-party deve avviare il combattimento.</span>
            )}

            {/* ending — successo pieno o fallimento narrativo */}
            {scene.type==="ending" && (() => {
              const isPartial = scene.outcomeType === "partial";
              const icon = isPartial ? "📖" : (ENDING_ICONS[scene.endingType] || "🏆");
              const label = isPartial ? "Fallimento Narrativo" : (scene.endingType==="good" ? "Fine Gloriosa" : scene.endingType==="fail" ? "Fine Amara" : "Fine della Storia");
              const labelColor = isPartial ? "#fbbf24" : col.accent;
              const rewardNote = isPartial
                ? "Il party sopravvive e porta a casa alcune informazioni. XP parziale, nessun oro."
                : "La missione è completata con successo!";
              return (
                <div style={{ width:"100%", textAlign:"center", padding:"0.5rem 0" }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:"0.4rem" }}>{icon}</div>
                  <div style={{ fontFamily:"'Cinzel',serif", color:labelColor, fontSize:"1rem", fontWeight:700, marginBottom:"0.2rem" }}>{label}</div>
                  <div style={{ color:"#94a3b8", fontSize:"0.8rem", marginBottom:"0.6rem" }}>{rewardNote}</div>
                  {scene.nextScene && isLeader && <BigBtn onClick={()=>onAdvance(scene.nextScene)} gold>📖 Prossimo capitolo</BigBtn>}
                  {!scene.nextScene && isLeader && <BigBtn onClick={()=>onAdvance(null)} gold>✅ Concludi la storia</BigBtn>}
                </div>
              );
            })()}

            {/* gameOver — sconfitta totale, personaggio salvo */}
            {scene.type==="gameOver" && (
              <div style={{ width:"100%", textAlign:"center", padding:"0.5rem 0" }}>
                <div style={{ fontSize:"2.5rem", marginBottom:"0.4rem" }}>💀</div>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#ef4444", fontSize:"1rem", fontWeight:700, marginBottom:"0.2rem" }}>Missione Fallita</div>
                <div style={{ color:"#94a3b8", fontSize:"0.8rem", marginBottom:"0.6rem" }}>Il party è stato sconfitto. I personaggi sopravvivono ma tornano a mani vuote. Nessuna ricompensa.</div>
                {scene.gameOver?.retryScene && isLeader && (
                  <BigBtn onClick={()=>onAdvance(scene.gameOver.retryScene)} gold>🔄 Riprova dall'ultimo punto</BigBtn>
                )}
                {!scene.gameOver?.retryScene && isLeader && (
                  <BigBtn onClick={()=>onAdvance(null)}>💀 Chiudi la missione</BigBtn>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Flags attivi */}
        {Object.keys(storyFlags).length > 0 && (
          <div style={{ background:"rgba(15,23,42,0.5)", border:"1px solid #1e293b", borderRadius:8, padding:"0.7rem" }}>
            <div style={{ color:"#475569", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.4rem" }}>🚩 Flag storia</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {Object.entries(storyFlags).map(([k,v])=>(
                <span key={k} style={{ fontSize:"0.7rem", padding:"2px 8px", borderRadius:4, background:"rgba(99,102,241,0.15)", border:"1px solid #312e81", color:"#a5b4fc" }}>{k}: {String(v)}</span>
              ))}
            </div>
          </div>
        )}

        {/* Choice log */}
        {storyState?.choiceLog?.length > 0 && (
          <div style={{ background:"rgba(15,23,42,0.5)", border:"1px solid #1e293b", borderRadius:8, padding:"0.8rem" }}>
            <div style={{ color:"#475569", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.5rem" }}>📋 Scelte precedenti</div>
            {storyState.choiceLog.slice(-5).map((log, i) => (
              <div key={i} style={{ fontSize:"0.76rem", color:"#64748b", padding:"2px 0" }}>
                → <span style={{ color:"#94a3b8" }}>{log.sceneTitle}</span>: <em style={{ color:"#fbbf24" }}>{log.choiceText}</em>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const RARITY_ORDER_INV = { common:0, uncommon:1, rare:2, epic:3, legendary:4 };

function EquipmentView({ me, equippedItems, equippedWeapon, onUnequip, onEquip, inventoryGroups, onSell, onUse, canUseConsumables, isMobile }) {
  const [activeSlot, setActiveSlot] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [sortBy, setSortBy] = useState("type"); // type | rarity | price | name
  const rarityColors = { common:"#94a3b8", uncommon:"#22c55e", rare:"#3b82f6", epic:"#a855f7", legendary:"#f59e0b" };

  const leftSlots  = ["head","chest","legs","boots","ring1"];
  const rightSlots = ["weapon","offhand","amulet","gloves","ring2"];
  const bottomSlots = ["cloak"];

  const activeSlotCfg = activeSlot ? SLOT_CONFIG.find(s => s.key === activeSlot) : null;
  const baseGroups = activeSlot && inventoryGroups
    ? inventoryGroups.filter(g => g.item && (g.item.slot === activeSlot || g.item.type === activeSlotCfg?.type))
    : inventoryGroups || [];

  const filteredGroups = [...baseGroups].sort((a, b) => {
    if(sortBy === "type")   return (a.item.type||"").localeCompare(b.item.type||"") || a.item.name.localeCompare(b.item.name);
    if(sortBy === "rarity") return (RARITY_ORDER_INV[b.item.rarity]||0) - (RARITY_ORDER_INV[a.item.rarity]||0);
    if(sortBy === "price")  return (b.item.price||0) - (a.item.price||0);
    if(sortBy === "name")   return a.item.name.localeCompare(b.item.name);
    return 0;
  });

  const equippableTypes = new Set(["weapon","armor","shield","head","legs","boots","gloves","cloak","accessory"]);

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden", height:"100%" }}>

      {/* ══ LEFT — mannequin + slots ══ */}
      <div style={{ width: isMobile ? "100%" : "50%", flexShrink:0, display:"flex", flexDirection:"column", borderRight:"1px solid rgba(255,255,255,0.07)", background:"rgba(5,8,18,0.6)" }}>

        {/* Stats bar */}
        <div style={{ display:"flex", gap:12, padding:"0.6rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.06)", flexWrap:"wrap" }}>
          {[["⚔️",me.atk],["🛡️",me.def],["✨",me.mag],["🦶",me.init],["❤️",me.maxHp],["🎲",equippedWeapon.weapon_die]].map(([icon,val],i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.78rem" }}>
              <span>{icon}</span><span style={{ color:"#e2d9c5", fontWeight:700 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Doll area */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:14, padding:"0.75rem", overflow:"hidden" }}>
          {/* Left slots */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {leftSlots.map(k => {
              const cfg = SLOT_CONFIG.find(s => s.key === k);
              return <EquipSlotBox key={k} slotCfg={cfg} item={equippedItems[k]} onUnequip={onUnequip} isSelected={activeSlot===k} onSelect={setActiveSlot} onPick={setActiveSlot} />;
            })}
          </div>

          {/* Character */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, minWidth:0, overflow:"hidden" }}>
            <div style={{ width:200, height:400, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <CharacterViewer me={me} equippedItems={equippedItems} size={200} />
            </div>
            <div style={{ display:"flex", gap:8, flexShrink:0 }}>
              {bottomSlots.map(k => {
                const cfg = SLOT_CONFIG.find(s => s.key === k);
                return <EquipSlotBox key={k} slotCfg={cfg} item={equippedItems[k]} onUnequip={onUnequip} isSelected={activeSlot===k} onSelect={setActiveSlot} onPick={setActiveSlot} />;
              })}
            </div>
          </div>

          {/* Right slots */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {rightSlots.map(k => {
              const cfg = SLOT_CONFIG.find(s => s.key === k);
              return <EquipSlotBox key={k} slotCfg={cfg} item={equippedItems[k]} onUnequip={onUnequip} isSelected={activeSlot===k} onSelect={setActiveSlot} onPick={setActiveSlot} />;
            })}
          </div>
        </div>

        {/* Active slot label */}
        {activeSlot && (
          <div style={{ padding:"0.5rem 1rem", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:"0.72rem", color:"#a78bfa" }}>
              {activeSlotCfg?.icon} {activeSlotCfg?.label} — mostra compatibili
            </span>
            <button onClick={()=>setActiveSlot(null)} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"0.75rem" }}>Mostra tutti ✕</button>
          </div>
        )}
      </div>

      {/* ══ RIGHT — inventory grid ══ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Item detail panel — fixed height, always visible */}
        <div style={{ height:120, flexShrink:0, display:"flex", gap:12, padding:"0.75rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(15,23,42,0.9)", alignItems:"flex-start", overflow:"hidden" }}>
          {hoveredItem ? (<>
            <ArtThumb src={getItemImage(hoveredItem.item)} alt={hoveredItem.item.name} size={80} radius={8} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.88rem", color: rarityColors[hoveredItem.item.rarity]||"#e2d9c5", fontWeight:700 }}>{hoveredItem.item.name}</div>
              <div style={{ fontSize:"0.68rem", color:"#64748b", marginBottom:4 }}>{itemRarityLabel(hoveredItem.item.rarity)} · {itemTypeLabel(hoveredItem.item.type)}</div>
              <div style={{ fontSize:"0.72rem", color:"#94a3b8", lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{hoveredItem.item.description}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:4 }}>
                {itemStatSummary(hoveredItem.item).map(s=>(
                  <span key={s} style={{ fontSize:"0.68rem", background:"rgba(255,255,255,0.05)", border:"1px solid #1f2937", borderRadius:999, padding:"1px 7px", color:"#d1d5db" }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
              {equippableTypes.has(hoveredItem.item.type) && (
                <BigBtn onClick={()=>onEquip(hoveredItem.entries[0])} gold
                  disabled={Object.values(equippedItems).some(i=>i?.id===hoveredItem.item.id)}>
                  {Object.values(equippedItems).some(i=>i?.id===hoveredItem.item.id) ? "Equipaggiato" : "Equipaggia"}
                </BigBtn>
              )}
              {hoveredItem.item.type==="potion" && canUseConsumables && (
                <BigBtn onClick={()=>onUse(hoveredItem.entries[0])} gold icon="🧪">Usa</BigBtn>
              )}
              <SmallBtn onClick={()=>onSell(hoveredItem)}>Vendi</SmallBtn>
            </div>
          </>) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:"0.75rem", color:"#1e293b" }}>Passa il mouse su un item per vedere i dettagli</span>
            </div>
          )}
        </div>

        {/* Sort bar */}
        <div style={{ display:"flex", gap:6, padding:"0.5rem 0.75rem", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
          <span style={{ fontSize:"0.68rem", color:"#475569", alignSelf:"center", marginRight:4 }}>Ordina:</span>
          {[["type","📦 Tipo"],["rarity","💎 Rarità"],["price","💰 Prezzo"],["name","🔤 Nome"]].map(([k,l])=>(
            <button key={k} onClick={()=>setSortBy(k)}
              style={{ padding:"2px 10px", fontSize:"0.68rem", borderRadius:6, cursor:"pointer", fontFamily:"'Cinzel',serif",
                background: sortBy===k ? "rgba(124,58,237,0.35)" : "rgba(15,23,42,0.6)",
                border: `1px solid ${sortBy===k?"#7c3aed":"#334155"}`,
                color: sortBy===k ? "#c4b5fd" : "#64748b" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex:1, overflowY:"auto", padding:"0.75rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(80px, 1fr))", gap:8 }}>
            {filteredGroups.map(g => {
              const item = g.item;
              if(!item) return null;
              const rc = rarityColors[item.rarity] || "#94a3b8";
              const isEquipped = Object.values(equippedItems).some(i=>i?.id===item.id);
              const isHovered = hoveredItem?.item.id === item.id;
              return (
                <div key={item.id}
                  onMouseEnter={()=>setHoveredItem(g)}
                  onMouseLeave={()=>setHoveredItem(null)}
                  onClick={()=>{ if(equippableTypes.has(item.type)) onEquip(g.entries[0]); else if(item.type==="potion"&&canUseConsumables) onUse(g.entries[0]); }}
                  style={{
                    background: isEquipped?"rgba(251,191,36,0.12)": isHovered?"rgba(99,102,241,0.18)":"rgba(30,20,60,0.85)",
                    border:`2px solid ${isEquipped?"#fbbf24": isHovered?rc:"rgba(255,255,255,0.08)"}`,
                    borderRadius:10, padding:"0.4rem 0.3rem", cursor:"pointer", textAlign:"center",
                    transition:"border-color 0.15s, background 0.15s", position:"relative",
                    display:"flex", flexDirection:"column", alignItems:"center",
                  }}>
                  {isEquipped && <div style={{ position:"absolute", top:3, right:4, fontSize:"0.5rem", color:"#fbbf24" }}>★</div>}
                  {g.quantity > 1 && <div style={{ position:"absolute", top:3, left:4, fontSize:"0.55rem", color:"#c4b5fd", fontWeight:700 }}>×{g.quantity}</div>}
                  <ArtThumb src={getItemImage(item)} alt={item.name} size={64} radius={6} />
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.56rem", color:rc, marginTop:3, lineHeight:1.2, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", width:"100%" }}>{item.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpellbookView({ spellsByLevel, preparedSpellIds, preparedCount, maxPrepared, onTogglePrepared }) {
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:"1rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0 }}>✨ Magie</h3>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Scegli quali incantesimi preparare per oggi. I trucchetti restano sempre disponibili.</span>
          <span style={{ fontSize:"0.78rem", color:"#ddd6fe", background:"rgba(124,58,237,0.2)", border:"1px solid #7c3aed", borderRadius:999, padding:"4px 10px" }}>
            Preparati: {preparedCount}/{maxPrepared}
          </span>
        </div>
      </div>
      <div style={{ display:"grid", gap:"1rem" }}>
        {Object.keys(spellsByLevel).map(levelKey => {
          const level = Number(levelKey);
          const spells = spellsByLevel[level] || [];
          if(!spells.length) return null;
          return (
            <Card key={level} title={level===0 ? "✨ Trucchetti" : `🔮 Livello ${level}`}>
              <div style={{ display:"grid", gap:10 }}>
                {spells.map(spell => {
                  const prepared = level === 0 || preparedSpellIds.includes(spell.id);
                  return (
                    <div key={spell.id} style={{ background:"rgba(15,23,42,0.72)", border:`1px solid ${prepared ? "#7c3aed" : "#334155"}`, borderRadius:10, padding:"0.95rem 1rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"flex-start", marginBottom:6, flexWrap:"wrap" }}>
                        <div>
                          <div style={{ color:"#f8fafc", fontWeight:700, fontSize:"0.96rem" }}>{spell.emoji || "✨"} {spell.name}</div>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:4 }}>
                            {spellEffectSummary(spell).map(detail => (
                              <span key={detail} style={{ fontSize:"0.72rem", color:"#cbd5e1", background:"rgba(255,255,255,0.04)", border:"1px solid #334155", borderRadius:999, padding:"3px 8px" }}>
                                {detail}
                              </span>
                            ))}
                          </div>
                        </div>
                        {level === 0 ? (
                          <span style={{ fontSize:"0.74rem", color:"#6ee7b7", fontWeight:700 }}>Sempre pronto</span>
                        ) : (
                          <button
                            onClick={()=>onTogglePrepared(spell.id)}
                            style={{ padding:"0.45rem 0.8rem", background:prepared?"rgba(124,58,237,0.24)":"rgba(255,255,255,0.04)", border:`1px solid ${prepared ? "#7c3aed" : "#334155"}`, borderRadius:8, color:prepared?"#ddd6fe":"#cbd5e1", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.74rem" }}
                          >
                            {prepared ? "Preparato" : "Prepara"}
                          </button>
                        )}
                      </div>
                      <div style={{ color:"#cbd5e1", fontSize:"0.84rem", lineHeight:1.6 }}>{spell.desc}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------
   BATTLE INCOMING BANNER
---------------------------------------------- */
function BattleBanner({ onEnter, onDecline, startedAt }) {
  const COUNTDOWN = 30;
  const elapsed = Math.floor((Date.now() - (startedAt || Date.now())) / 1000);
  const [secs, setSecs] = useState(Math.max(0, COUNTDOWN - elapsed));

  useEffect(() => {
    const t = setInterval(() => {
      setSecs(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pct = Math.max(0, (secs / COUNTDOWN) * 100);
  const urgent = secs <= 10;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9500,
      background: "linear-gradient(135deg, rgba(40,8,8,0.97), rgba(15,23,42,0.97))",
      border: `2px solid ${urgent ? "#ef4444" : "#7f1d1d"}`,
      borderRadius: 16,
      boxShadow: `0 8px 40px rgba(${urgent ? "239,68,68" : "127,29,29"},0.45), 0 2px 12px rgba(0,0,0,0.6)`,
      padding: "1rem 1.4rem",
      minWidth: 300,
      maxWidth: "min(420px, 92vw)",
      animation: "battleBannerIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <style>{`
        @keyframes battleBannerIn {
          from { opacity:0; transform:translateX(-50%) translateY(40px) scale(0.9); }
          to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes battlePulse {
          0%,100% { opacity:1; } 50% { opacity:0.6; }
        }
      `}</style>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        <span style={{ fontSize:"1.8rem", animation: urgent ? "battlePulse 0.7s ease infinite" : "none" }}>⚔️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Cinzel Decorative',serif", color: urgent ? "#fca5a5" : "#fecaca", fontSize:"0.95rem", fontWeight:700, letterSpacing:"0.04em" }}>
            Battaglia in corso!
          </div>
          <div style={{ color:"#94a3b8", fontSize:"0.73rem", marginTop:2 }}>
            {secs > 0 ? `Hai ${secs}s per decidere` : "Battaglia iniziata"}
          </div>
        </div>
      </div>
      {secs > 0 && (
        <div style={{ height:4, background:"rgba(127,29,29,0.35)", borderRadius:2, marginBottom:12, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background: urgent ? "#ef4444" : "#dc2626", borderRadius:2, transition:"width 1s linear" }} />
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <button
          onClick={onDecline}
          style={{
            padding:"0.7rem",
            background:"rgba(15,23,42,0.9)",
            border:"1px solid #334155",
            borderRadius:10,
            color:"#94a3b8",
            fontFamily:"'Cinzel',serif",
            fontSize:"0.88rem",
            cursor:"pointer",
            fontWeight:700,
          }}
        >
          ✕ Rifiuta
        </button>
        <button
          onClick={onEnter}
          style={{
            padding:"0.7rem",
            background: urgent ? "linear-gradient(135deg,#7f1d1d,#b91c1c)" : "linear-gradient(135deg,#450a0a,#7f1d1d)",
            border: `2px solid ${urgent ? "#ef4444" : "#dc2626"}`,
            borderRadius:10,
            color:"#fee2e2",
            fontFamily:"'Cinzel',serif",
            fontSize:"0.88rem",
            cursor:"pointer",
            fontWeight:700,
            boxShadow: urgent ? "0 0 14px rgba(239,68,68,0.4)" : "none",
          }}
        >
          ⚔️ Accetta
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   PLAYER WORLD EVENT VIEW
----------------------------------------------*/
function PlayerWorldEventView({ me, myId }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attacking, setAttacking] = useState(false);
  const [lastHit, setLastHit] = useState(null);

  useEffect(() => {
    dbGetWorldEvent().then(e => { setEvent(e); setLoading(false); });
  }, []);

  async function attackBoss() {
    if(!event?.active || !me) return;
    setAttacking(true);
    setLastHit(null);
    // Roll damage based on player stats
    const atkStat = me.atk || 10;
    const die = 12;
    const dmg = Math.max(1, Math.floor(Math.random() * die) + 1 + Math.floor(atkStat / 4));
    const fresh = await dbGetWorldEvent();
    if(!fresh?.active) { setEvent(fresh); setAttacking(false); return; }
    const prevContrib = fresh.contributors?.[myId] || { name: me.name, dmg: 0, hits: 0 };
    const newContribs = { ...fresh.contributors, [myId]: { name: me.name, dmg: prevContrib.dmg + dmg, hits: prevContrib.hits + 1 } };
    const newHp = Math.max(0, fresh.hp - dmg);
    const beaten = newHp <= 0;
    const updated = { ...fresh, hp: newHp, contributors: newContribs, active: !beaten, beatenAt: beaten ? new Date().toISOString() : undefined };
    await dbSaveWorldEvent(updated);
    setEvent(updated);
    setLastHit(dmg);
    setAttacking(false);
    if(beaten) {
      // Reward all contributors
      window.alert(`💥 Il Mega Boss è stato sconfitto! Riceverai ${fresh.rewards?.xp} XP e ${fresh.rewards?.gold}🪙 al prossimo login!`);
    }
  }

  if(loading) return <div style={{ padding:"2rem", textAlign:"center", color:"#6b7280" }}>⏳ Caricamento evento…</div>;

  const PANEL_BG2 = "rgba(15,23,42,0.85)";
  const hpPct = event ? Math.max(0, Math.round((event.hp / event.maxHp) * 100)) : 0;
  const contribs = event ? Object.values(event.contributors || {}).sort((a,b)=>b.dmg-a.dmg) : [];
  const myContrib = event?.contributors?.[myId];
  const timeLeft = event?.endsAt ? Math.max(0, Math.round((new Date(event.endsAt) - Date.now()) / 3600000)) : 0;
  const beaten = event && !event.active && event.beatenAt;

  if(!event || (!event.active && !beaten)) return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:"#4b5563" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🌙</div>
        <div style={{ fontFamily:"'Cinzel',serif", color:"#475569", fontSize:"0.9rem" }}>Nessun evento mondiale attivo.</div>
        <div style={{ color:"#374151", fontSize:"0.75rem", marginTop:6 }}>Il Master lancerà il prossimo evento a sorpresa.</div>
      </div>
    </div>
  );

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
      <h3 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#ef4444", marginBottom:"0.3rem", textAlign:"center", fontSize:"1.1rem" }}>🌋 EVENTO MONDIALE</h3>
      <p style={{ color:"#6b7280", fontSize:"0.7rem", textAlign:"center", marginBottom:"1rem" }}>
        {beaten ? "⚔️ Battaglia conclusa — il boss è stato sconfitto!" : `⏱ ${timeLeft}h rimanenti · ${contribs.length} eroi coinvolti`}
      </p>

      {/* Boss card */}
      <div style={{ background:"linear-gradient(135deg,rgba(60,10,10,0.9),rgba(20,10,40,0.9))", border:`2px solid ${beaten?"#4ade80":"#dc2626"}`, borderRadius:14, padding:"1.2rem", marginBottom:"1rem", textAlign:"center" }}>
        <div style={{ fontSize:"4rem", marginBottom:6, filter: beaten ? "grayscale(1) opacity(0.5)" : "drop-shadow(0 0 16px rgba(239,68,68,0.6))", transition:"all 0.5s" }}>{event.emoji}</div>
        <div style={{ fontFamily:"'Cinzel Decorative',serif", color: beaten ? "#4ade80" : "#fbbf24", fontSize:"1rem", marginBottom:4 }}>{beaten ? "💀 SCONFITTO" : event.name}</div>
        <div style={{ color:"#94a3b8", fontSize:"0.73rem", fontStyle:"italic", marginBottom:12 }}>{event.desc}</div>
        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.7rem", color:"#94a3b8", marginBottom:4 }}>
            <span>❤️ HP del Boss</span><span>{event.hp.toLocaleString("it-IT")} / {event.maxHp.toLocaleString("it-IT")}</span>
          </div>
          <div style={{ height:18, background:"rgba(30,41,59,0.8)", borderRadius:9, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${hpPct}%`, background:`linear-gradient(90deg,${hpPct>50?"#dc2626":"#7f1d1d"},${hpPct>25?"#ef4444":"#450a0a"})`, borderRadius:9, transition:"width .6s" }} />
          </div>
        </div>
        <div style={{ fontSize:"0.72rem", color:"#4ade80" }}>🏆 Ricompense: +{event.rewards?.xp} XP · +{event.rewards?.gold} 🪙 per tutti i partecipanti</div>
      </div>

      {/* Attack button */}
      {event.active && (
        <div style={{ textAlign:"center", marginBottom:"1rem" }}>
          {lastHit !== null && (
            <div style={{ fontSize:"1.4rem", fontWeight:900, color:"#ef4444", fontFamily:"'Cinzel Decorative',serif", marginBottom:8, animation:"none" }}>
              -{lastHit} DANNI!
            </div>
          )}
          <button onClick={attackBoss} disabled={attacking}
            style={{ padding:"0.9rem 2.5rem", background:attacking?"rgba(30,10,10,0.6)":"linear-gradient(135deg,#7f1d1d,#991b1b)", border:"2px solid #ef4444", borderRadius:12, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1rem", cursor:attacking?"not-allowed":"pointer", opacity:attacking?0.6:1, boxShadow:"0 0 20px rgba(239,68,68,0.3)", transition:"all 0.2s", letterSpacing:"0.05em" }}>
            {attacking ? "⚔️ Attacco…" : "⚔️ ATTACCA IL BOSS!"}
          </button>
          {myContrib && (
            <div style={{ marginTop:8, fontSize:"0.72rem", color:"#94a3b8" }}>
              I tuoi danni: <span style={{ color:"#f87171", fontWeight:700 }}>{myContrib.dmg.toLocaleString("it-IT")}</span> in {myContrib.hits} colpi
            </div>
          )}
        </div>
      )}

      {/* Leaderboard contributi */}
      <div style={{ background:PANEL_BG2, border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"1rem" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8", marginBottom:8 }}>🗡️ EROI IN BATTAGLIA</div>
        {contribs.length === 0 && <div style={{ color:"#4b5563", fontSize:"0.75rem" }}>Sii il primo ad attaccare!</div>}
        {contribs.map((c,i) => (
          <div key={c.name+i} style={{ display:"flex", gap:8, alignItems:"center", padding:"0.4rem 0.6rem", background: c.name===me?.name ? "rgba(109,40,217,0.15)" : "rgba(15,23,42,0.4)", border: c.name===me?.name ? "1px solid rgba(196,181,253,0.2)" : "1px solid transparent", borderRadius:6, marginBottom:4 }}>
            <span style={{ color:"#fbbf24", fontWeight:700, minWidth:24, fontSize:"0.8rem" }}>{["🥇","🥈","🥉"][i]||`#${i+1}`}</span>
            <div style={{ flex:1, fontSize:"0.8rem", color: c.name===me?.name ? "#c4b5fd" : "#e2e8f0" }}>{c.name}{c.name===me?.name&&" (tu)"}</div>
            <span style={{ color:"#f87171", fontWeight:700, fontSize:"0.78rem" }}>{c.dmg.toLocaleString("it-IT")} dmg</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------
   MASTER WORLD EVENT VIEW
----------------------------------------------*/
function MasterWorldEventView() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState(MEGA_BOSSES[0].id);
  const [durationDays, setDurationDays] = useState(7);

  useEffect(() => {
    dbGetWorldEvent().then(e => { setEvent(e); setLoading(false); });
  }, []);

  async function startEvent() {
    const boss = MEGA_BOSSES.find(b => b.id === selectedBoss);
    if(!boss) return;
    const endsAt = new Date(Date.now() + durationDays * 86400000).toISOString();
    const newEvent = { id:`we_${Date.now()}`, bossId:boss.id, name:boss.name, emoji:boss.emoji, desc:boss.desc, hp:boss.hp, maxHp:boss.hp, rewards:boss.rewards, endsAt, active:true, contributors:{}, createdAt:new Date().toISOString() };
    setSaving(true);
    await dbSaveWorldEvent(newEvent);
    setEvent(newEvent);
    setSaving(false);
  }

  async function endEvent() {
    if(!event) return;
    if(!window.confirm("Terminare l'evento mondiale anticipatamente?")) return;
    const updated = { ...event, active:false };
    setSaving(true);
    await dbSaveWorldEvent(updated);
    setEvent(updated);
    setSaving(false);
  }

  const PANEL = { background:"rgba(3,7,18,0.85)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"1rem", marginBottom:"1rem" };
  const IS = { padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.8)", border:"1px solid #334155", borderRadius:6, color:"#e2e8f0", fontSize:"0.82rem" };

  if(loading) return <div style={{ padding:"2rem", textAlign:"center", color:"#6b7280" }}>⏳ Caricamento…</div>;

  const boss = event ? MEGA_BOSSES.find(b => b.id === event.bossId) : null;
  const hpPct = event ? Math.max(0, Math.round((event.hp / event.maxHp) * 100)) : 0;
  const contribs = event ? Object.values(event.contributors || {}).sort((a,b)=>b.dmg-a.dmg) : [];
  const timeLeft = event?.endsAt ? Math.max(0, Math.round((new Date(event.endsAt) - Date.now()) / 3600000)) : 0;

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🌋 Evento Mondiale</h3>

      {event?.active ? (
        <>
          <div style={{ ...PANEL, border:"2px solid #dc2626", background:"linear-gradient(135deg,rgba(60,10,10,0.9),rgba(15,23,42,0.9))" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:"3.5rem" }}>{event.emoji}</span>
              <div>
                <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.05rem" }}>{event.name}</div>
                <div style={{ color:"#94a3b8", fontSize:"0.75rem", marginTop:3 }}>{event.desc}</div>
                <div style={{ color:"#ef4444", fontSize:"0.7rem", marginTop:4 }}>⏱ {timeLeft}h rimanenti · {contribs.length} avventurieri coinvolti</div>
              </div>
            </div>
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem", color:"#94a3b8", marginBottom:4 }}>
                <span>HP Mega Boss</span><span>{event.hp.toLocaleString("it-IT")} / {event.maxHp.toLocaleString("it-IT")}</span>
              </div>
              <div style={{ height:14, background:"rgba(30,41,59,0.8)", borderRadius:7, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${hpPct}%`, background:`linear-gradient(90deg,${hpPct>50?"#dc2626":"#7f1d1d"},#ef4444)`, borderRadius:7, transition:"width .5s" }} />
              </div>
            </div>
            <div style={{ fontSize:"0.72rem", color:"#4ade80" }}>🏆 Ricompensa: +{event.rewards?.xp} XP · +{event.rewards?.gold} 🪙</div>
          </div>

          <div style={PANEL}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8", marginBottom:8 }}>🗡️ CONTRIBUTI DANNI</div>
            {contribs.length === 0 && <div style={{ color:"#4b5563", fontSize:"0.75rem" }}>Nessun attacco ancora.</div>}
            {contribs.map((c,i) => (
              <div key={c.name} style={{ display:"flex", gap:8, alignItems:"center", padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.5)", borderRadius:6, marginBottom:4 }}>
                <span style={{ color:"#fbbf24", fontWeight:700, minWidth:24, fontSize:"0.8rem" }}>#{i+1}</span>
                <div style={{ flex:1, fontSize:"0.8rem", color:"#e2e8f0" }}>{c.name}</div>
                <span style={{ color:"#f87171", fontWeight:700, fontSize:"0.78rem" }}>{c.dmg.toLocaleString("it-IT")} dmg</span>
                <span style={{ color:"#64748b", fontSize:"0.7rem" }}>{c.hits} colpi</span>
              </div>
            ))}
          </div>

          <button onClick={endEvent} disabled={saving} style={{ padding:"0.5rem 1.2rem", background:"rgba(127,29,29,0.3)", border:"1px solid #dc2626", borderRadius:7, color:"#f87171", cursor:"pointer", fontSize:"0.8rem" }}>
            ✕ Termina evento anticipatamente
          </button>
        </>
      ) : (
        <div style={PANEL}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8", marginBottom:12 }}>
            {event && !event.active ? "⚔️ Evento precedente terminato. Crea un nuovo evento:" : "Nessun evento attivo. Crea un evento mondiale:"}
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:"0.65rem", color:"#64748b", marginBottom:5 }}>Scegli il Mega Boss:</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {MEGA_BOSSES.map(b => (
                <div key={b.id} onClick={() => setSelectedBoss(b.id)} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"0.6rem 0.8rem", background:selectedBoss===b.id?"rgba(109,40,217,0.2)":"rgba(15,23,42,0.5)", border:`1px solid ${selectedBoss===b.id?"#7c3aed":"#334155"}`, borderRadius:8, cursor:"pointer" }}>
                  <span style={{ fontSize:"1.8rem", flexShrink:0 }}>{b.emoji}</span>
                  <div>
                    <div style={{ color:selectedBoss===b.id?"#c4b5fd":"#e2e8f0", fontWeight:700, fontSize:"0.82rem" }}>{b.name}</div>
                    <div style={{ color:"#64748b", fontSize:"0.68rem", marginTop:2 }}>{b.hp.toLocaleString("it-IT")} HP · +{b.rewards.xp} XP · +{b.rewards.gold}🪙</div>
                    <div style={{ color:"#475569", fontSize:"0.65rem", marginTop:2, fontStyle:"italic" }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <label style={{ fontSize:"0.72rem", color:"#94a3b8" }}>Durata (giorni):</label>
            <input type="number" value={durationDays} min={1} max={30} onChange={e=>setDurationDays(Number(e.target.value))} style={{ ...IS, width:70 }} />
          </div>
          <button onClick={startEvent} disabled={saving} style={{ padding:"0.55rem 1.4rem", background:"linear-gradient(135deg,rgba(127,29,29,0.6),rgba(109,40,217,0.3))", border:"2px solid #dc2626", borderRadius:8, color:"#fca5a5", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.85rem", fontWeight:700 }}>
            🌋 Lancia Evento Mondiale
          </button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------
   GLOBAL LEADERBOARD VIEW
---------------------------------------------- */
function GlobalLeaderboardView({ myId, partyCode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("xp"); // xp | quests | monsters | gold | damage

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      const { data: players } = await supabase
        .from("players")
        .select("id,name,class,race,level,xp,gold,party_code,avatar_config")
        .order("xp", { ascending: false });
      if (!alive) return;

      // Aggregate by party
      const byParty = {};
      for (const p of players || []) {
        const pc = p.party_code || "?";
        if (!byParty[pc]) byParty[pc] = { party_code: pc, players: [], totalXp: 0, totalGold: 0, totalQuests: 0, totalMonsters: 0, totalDamage: 0, topLevel: 0 };
        const g = byParty[pc];
        g.players.push(p);
        g.totalXp += p.xp || 0;
        g.totalGold += p.gold || 0;
        const s = (p.avatar_config && typeof p.avatar_config === 'object') ? (p.avatar_config.stats || {}) : {};
        g.totalQuests += s.questsCompleted || 0;
        g.totalMonsters += s.monstersKilled || 0;
        g.totalDamage += s.totalDamage || 0;
        if ((p.level || 1) > g.topLevel) g.topLevel = p.level || 1;
      }

      setData({ players: players || [], parties: Object.values(byParty) });
      setLoading(false);
    }
    load();
    return () => { alive = false; };
  }, []);

  const CATS = [
    { k: "xp",       l: "⭐ XP",            pKey: "xp",           gKey: "totalXp",       fmt: v => `${v.toLocaleString("it-IT")} XP` },
    { k: "quests",   l: "📜 Missioni",       pKey: null,           gKey: "totalQuests",   fmt: v => `${v} completate`, pFn: p => ((p.avatar_config&&typeof p.avatar_config==='object')?p.avatar_config.stats||{}:{}).questsCompleted||0 },
    { k: "monsters", l: "💀 Mostri",         pKey: null,           gKey: "totalMonsters", fmt: v => `${v} uccisi`, pFn: p => ((p.avatar_config&&typeof p.avatar_config==='object')?p.avatar_config.stats||{}:{}).monstersKilled||0 },
    { k: "gold",     l: "💰 Oro",            pKey: "gold",         gKey: "totalGold",     fmt: v => `${v.toLocaleString("it-IT")} 💰` },
    { k: "damage",   l: "🔥 Danno",          pKey: null,           gKey: "totalDamage",   fmt: v => `${v.toLocaleString("it-IT")} dmg`, pFn: p => ((p.avatar_config&&typeof p.avatar_config==='object')?p.avatar_config.stats||{}:{}).totalDamage||0 },
  ];
  const catCfg = CATS.find(c => c.k === cat);

  const getPlayerVal = p => catCfg.pFn ? catCfg.pFn(p) : (p[catCfg.pKey] || 0);
  const getPartyVal  = g => g[catCfg.gKey] || 0;

  const sortedPlayers = data ? [...data.players].sort((a, b) => getPlayerVal(b) - getPlayerVal(a)).slice(0, 50) : [];
  const sortedParties = data ? [...data.parties].sort((a, b) => getPartyVal(b) - getPartyVal(a)).slice(0, 20) : [];

  const MEDAL = ["🥇","🥈","🥉"];
  const ROW_BASE = { display:"flex", alignItems:"center", gap:10, padding:"0.6rem 0.9rem", borderBottom:"1px solid rgba(255,255,255,0.05)", borderRadius:6, marginBottom:4 };
  const ME_STYLE = { background:"rgba(109,40,217,0.18)", border:"1px solid rgba(196,181,253,0.3)" };

  const panelStyle = { background:"rgba(3,7,18,0.85)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"1rem", flex:1 };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
      <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.1rem", textAlign:"center", marginBottom:"0.2rem", letterSpacing:"0.06em" }}>🏆 Classifiche Globali</h2>
      <p style={{ color:"#6b7280", fontSize:"0.72rem", textAlign:"center", marginBottom:"1.2rem" }}>Tutti gli avventurieri di Zodar — aggiornato in tempo reale</p>

      {/* Category tabs */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1.2rem", justifyContent:"center" }}>
        {CATS.map(c => (
          <button key={c.k} onClick={() => setCat(c.k)} style={{ padding:"0.35rem 0.9rem", background: cat===c.k ? "rgba(109,40,217,0.5)" : "rgba(15,23,42,0.8)", border:`1px solid ${cat===c.k?"#c4b5fd":"#374151"}`, borderRadius:20, color: cat===c.k ? "#fff" : "#9ca3af", cursor:"pointer", fontSize:"0.78rem", fontFamily:"'Cinzel',serif", fontWeight:700, transition:"all 0.15s" }}>
            {c.l}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:"center", color:"#6b7280", padding:"3rem", fontSize:"0.85rem" }}>⏳ Caricamento classifiche…</div>
      ) : (
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          {/* Party leaderboard */}
          <div style={{ ...panelStyle, minWidth:0, flex:"1 1 280px" }}>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#a78bfa", fontSize:"0.82rem", letterSpacing:"0.06em", marginBottom:"0.8rem", display:"flex", alignItems:"center", gap:6 }}>
              🏰 Classifiche per Party
            </div>
            {sortedParties.map((g, i) => {
              const isMyParty = g.party_code === partyCode;
              const val = getPartyVal(g);
              return (
                <div key={g.party_code} style={{ ...ROW_BASE, ...(isMyParty ? ME_STYLE : {}), background: isMyParty ? "rgba(109,40,217,0.18)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <span style={{ width:24, textAlign:"center", fontSize: i < 3 ? "1.1rem" : "0.8rem", color:"#6b7280", fontWeight:700, flexShrink:0 }}>{MEDAL[i] || `#${i+1}`}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color: isMyParty ? "#c4b5fd" : "#e2e8f0", fontFamily:"'Cinzel',serif", fontSize:"0.8rem", fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                      {g.party_code}
                      {isMyParty && <span style={{ fontSize:"0.62rem", color:"#a78bfa", background:"rgba(109,40,217,0.25)", padding:"1px 6px", borderRadius:8 }}>il tuo party</span>}
                    </div>
                    <div style={{ color:"#6b7280", fontSize:"0.68rem", marginTop:1 }}>{g.players.length} avventurieri · Lv.{g.topLevel} max</div>
                  </div>
                  <div style={{ color:"#fbbf24", fontSize:"0.78rem", fontWeight:700, flexShrink:0, textAlign:"right" }}>
                    {catCfg.fmt(val)}
                  </div>
                </div>
              );
            })}
            {sortedParties.length === 0 && <div style={{ color:"#4b5563", textAlign:"center", padding:"1.5rem", fontSize:"0.8rem" }}>Nessun dato</div>}
          </div>

          {/* Player leaderboard */}
          <div style={{ ...panelStyle, minWidth:0, flex:"1 1 280px" }}>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#f59e0b", fontSize:"0.82rem", letterSpacing:"0.06em", marginBottom:"0.8rem" }}>
              ⚔️ Classifiche Individuali
            </div>
            {sortedPlayers.map((p, i) => {
              const isMe = p.id === myId;
              const val = getPlayerVal(p);
              const cls = CLASSES[p.class || "warrior"];
              return (
                <div key={p.id} style={{ ...ROW_BASE, ...(isMe ? ME_STYLE : {}), background: isMe ? "rgba(109,40,217,0.18)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <span style={{ width:24, textAlign:"center", fontSize: i < 3 ? "1.1rem" : "0.8rem", color:"#6b7280", fontWeight:700, flexShrink:0 }}>{MEDAL[i] || `#${i+1}`}</span>
                  <span style={{ fontSize:"1rem", flexShrink:0 }}>{cls?.emoji || "⚔️"}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color: isMe ? "#c4b5fd" : "#e2e8f0", fontFamily:"'Cinzel',serif", fontSize:"0.79rem", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
                      {p.name}
                      {isMe && <span style={{ fontSize:"0.6rem", color:"#a78bfa", background:"rgba(109,40,217,0.25)", padding:"1px 5px", borderRadius:8, flexShrink:0 }}>tu</span>}
                    </div>
                    <div style={{ color:"#6b7280", fontSize:"0.67rem", marginTop:1 }}>
                      {RACES[p.race||"human"]?.name} {cls?.name} · Lv.{p.level||1} · {p.party_code||"—"}
                    </div>
                  </div>
                  <div style={{ color:"#fbbf24", fontSize:"0.78rem", fontWeight:700, flexShrink:0, textAlign:"right" }}>
                    {catCfg.fmt(val)}
                  </div>
                </div>
              );
            })}
            {sortedPlayers.length === 0 && <div style={{ color:"#4b5563", textAlign:"center", padding:"1.5rem", fontSize:"0.8rem" }}>Nessun dato</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------
   GAME SCREEN
---------------------------------------------- */
function GameScreen({ myId, setScreen, authUser }) {
  const [me, setMeRaw] = useState(null);
  const latestMeRef = useRef(null);
  const [isAfk, setIsAfkState] = useState(() => myId ? localStorage.getItem(`afk_${myId}`) === '1' : false);
  function toggleAfk() {
    setIsAfkState(prev => {
      const next = !prev;
      if(myId) localStorage.setItem(`afk_${myId}`, next ? '1' : '0');
      return next;
    });
  }
  const [messages, setMessages] = useState([]);
  const [worldMessages, setWorldMessages] = useState([]);
  const [masterMessages, setMasterMessages] = useState([]);
  const [chatChannel, setChatChannel] = useState("party");
  const [partyPlayers, setPartyPlayers] = useState([]);
  const [qs, setQs] = useState({ currentId:null, step:0, active:false, completed:[], combat:null });
  const [input, setInput] = useState("");
  const [diceAnim, setDiceAnim] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [spellMenu, setSpellMenu] = useState(false);
  const [showCombatLog, setShowCombatLog] = useState(false);
  const [guilds, setGuilds] = useState({});
  const [guildLoading, setGuildLoading] = useState(false);
  const [worldPlayers, setWorldPlayers] = useState([]);
  const [worldMeta, setWorldMeta] = useState({});
  const [guildForm, setGuildForm] = useState({ name:"", emoji:"⚔️", desc:"", emblem:{...DEFAULT_EMBLEM} });
  const [guildDonate, setGuildDonate] = useState(100);
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [guildChatMessages, setGuildChatMessages] = useState([]);
  const [guildChatInput, setGuildChatInput] = useState("");
  const [guildMissionForm, setGuildMissionForm] = useState({ title:"", desc:"", goal:1, rewardGold:0, rewardXp:50 });
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showGuildCreator, setShowGuildCreator] = useState(false);
  const [showGuildRoles, setShowGuildRoles] = useState(false);
  const [showGuildInvite, setShowGuildInvite] = useState(false);
  const [guildInviteCode, setGuildInviteCode] = useState("");
  const [bulletinInput, setBulletinInput] = useState("");
  const [showBulletinForm, setShowBulletinForm] = useState(false);
  const [turnTimeLeft, setTurnTimeLeft] = useState(null);
  const [legNotif, setLegNotif] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [restTimeLeft, setRestTimeLeft] = useState(null);
  const [pendingHealItem, setPendingHealItem] = useState(null);
  const [selectedAllyTarget, setSelectedAllyTarget] = useState(null);
  const [battleChatInput, setBattleChatInput] = useState("");
  const [tab, setTab] = useState("quest");
  const [dismissedVictoryTs, setDismissedVictoryTs] = useState(null);
  const [declinedCombatAt, setDeclinedCombatAt] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());
  const [combatView, setCombatView] = useState('visual');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");
  const [patchModal, setPatchModal] = useState(null); // { notes, ts }
  const [showDonation, setShowDonation] = useState(false);
  const [dailyRewardModal, setDailyRewardModal] = useState(null); // { reward, newStreak, today }
  const [achievementNotif, setAchievementNotif] = useState([]);
  const [showSubclassModal, setShowSubclassModal] = useState(false);
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lootedStepKey, setLootedStepKey] = useState(null);
  const [choiceFeedback, setChoiceFeedback] = useState(null); // { quality, label, xp, gold, _nextStep, _completeQuest }
  const [pendingStoryChoice, setPendingStoryChoice] = useState(null); // { idx, text }
  const [catalogItems, setCatalogItems] = useState(DEFAULT_ITEMS);
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({ weapon:null, armor:null, shield:null, accessory:null });
  const [preparedSpellIds, setPreparedSpellIds] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionBusy, setAuctionBusy] = useState(false);
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState(null);
  const [specialPasswordInput, setSpecialPasswordInput] = useState("");
  const [specialQuestError, setSpecialQuestError] = useState("");
  const [unlockedSpecialQuestIds, setUnlockedSpecialQuestIds] = useState([]);
  const [deathScene, setDeathScene] = useState(null);
  const msgEnd = useRef(null);
  const combatLogEndRef = useRef(null);
  const guildChatEndRef = useRef(null);
  const inputRef = useRef(null);
  const subRef = useRef(null);
  const guildChatSubRef = useRef(null);
  const turnTimerRef = useRef(null);
  const pendingLogRef = useRef(false);
  const prevLegItemRef = useRef(null);
  const itemMapRef = useRef(DEFAULT_ITEM_MAP);
  const startCombatStepRef = useRef(null);
  const monsterTickBusyRef = useRef(false);
  const playerAttackBusyRef = useRef(false);
  const doMonsterTurnRef = useRef(null);
  const forceNextTurnRef = useRef(null);
  const doAttackRef = useRef(null);
  const advanceTurnBusyRef = useRef(false);
  const combatRef = useRef(null); // always-current combat snapshot for use inside timers
  latestMeRef.current = me; // kept in sync every render so subscriptions never capture stale HP

    const diceRef = useRef(null);

  async function showDiceVisual({ sides, notation, label, themeColor="#ef4444" }) {
    const diceNotation = notation || `1d${sides}`;
    if (diceRef.current) {
      const fallbackTotal = parseDice(diceNotation);
      try {
        setDiceResult({ stage:"rolling", label, value:null });
        const total = await diceRef.current.roll(diceNotation, themeColor);
        const resolvedTotal = total !== null ? total : fallbackTotal;
        setDiceResult({ stage:"result", label, value: resolvedTotal });
        await new Promise(r => setTimeout(r, 1200));
        return resolvedTotal;
      } catch (err) {
        console.error("Dice visual failed:", err);
        setDiceResult({ stage:"result", label, value: fallbackTotal });
        await new Promise(r => setTimeout(r, 1200));
        return fallbackTotal;
      } finally {
        setDiceResult(null);
        diceRef.current?.clear?.();
      }
    } else {
      const val = parseDice(diceNotation);
      setDiceResult({ stage:"rolling", sides, value:null, label });
      setDiceAnim(true);
      await new Promise(resolve => setTimeout(resolve, 450));
      setDiceResult({ stage:"result", sides, value: val, label });
      setDiceAnim(false);
      await new Promise(resolve => setTimeout(resolve, 850));
      setDiceResult(null);
      return val;
    }
  }

  async function performAsyncAttack(attacker, target, weaponDie, weapon=null) {
    const themeColor = attacker.isPlayer ? "#3b82f6" : "#ef4444";
    const hitRoll = await showDiceVisual({ sides:20, notation:"1d20", label:"Tiro per colpire", themeColor });

    const attackBonus = getCombatAttackBonus(attacker, weapon);
    const attackTotal = hitRoll + attackBonus;
    const targetCa = Math.max(8, target?.def || 10);
    const isCrit = hitRoll === 20;
    const hit = hitRoll !== 1 && (isCrit || attackTotal >= targetCa);

    // Ability modifier for damage: players use weapon profile, monsters add ATK/4
    const profile = attacker.isPlayer ? weaponAttackProfile(weapon, attacker) : null;
    const damageMod = profile ? profile.mod : Math.floor((attacker.atk || 0) / 4);
    const damageAbility = profile ? profile.ability : null;

    let damageRoll = 0;
    if (hit) {
      damageRoll = await showDiceVisual({ sides:getPrimaryDieSides(weaponDie,6), notation:weaponDie||"1d6", label:`Danno ${weaponDie||"1d6"}`, themeColor });
    }

    // D&D 5e crit: double the dice only, not the modifier
    const damage = hit ? damageRoll + damageMod + (isCrit ? damageRoll : 0) : 0;
    return { hitRoll, isCrit, attackBonus, attackTotal, targetCa, hit, damageRoll, damageMod, damageAbility, damage, weaponDie: weaponDie || "1d6" };
  }
  async function triggerSoloDeath(finalName) {
    setDeathScene({ name: finalName || me?.name || "Eroe caduto" });
    try {
      const fallenPlayer = { ...me, hp:0, dead:true };
      await dbSavePlayer(fallenPlayer);
      setMeRaw(fallenPlayer);
      if(code) {
        const deathDiary = appendDiary(qs.partyDiary, { type:'death', icon:'💀', text:`${finalName || me?.name || 'Un eroe'} è caduto/a in battaglia. Il coraggio non è mancato, ma il destino ha deciso altrimenti.`, players:[finalName || me?.name || ''] });
        await dbSavePartyState(code, { ...qs, combat:null, partyDiary: deathDiary });
        setQs(prev => ({ ...prev, combat:null, partyDiary: deathDiary }));
      }
    } catch(e) {
      console.error("Errore durante la morte definitiva:", e);
    }
    localStorage.removeItem("eoz_myId");
    setTimeout(()=>setScreen("landing"), 3200);
  }

  const code = me?.partyCode;
  itemMapRef.current = new Map(catalogItems.map(item => [item.id, item]));
  const itemMap = itemMapRef.current;

  useEffect(() => {
    if(!code) {
      setUnlockedSpecialQuestIds([]);
      return;
    }
    setUnlockedSpecialQuestIds(lsGet(`eoz_special_unlocked_${code}`, []));
  }, [code]);

  function unlockSpecialQuest() {
    const password = specialPasswordInput.trim();
    if(!password) return;
    const match = getQuests().find(q => q.active && q.specialPassword && q.specialPassword.toLowerCase() === password.toLowerCase());
    if(!match) {
      setSpecialQuestError("Password non valida o missione non attiva.");
      return;
    }
    setUnlockedSpecialQuestIds(prev => {
      const next = prev.includes(match.id) ? prev : [...prev, match.id];
      if(code) lsSet(`eoz_special_unlocked_${code}`, next);
      return next;
    });
    setSpecialPasswordInput("");
    setSpecialQuestError(`Missione sbloccata: ${match.title}`);
  }

  const refreshAll = useCallback(async (partyCode) => {
    if(!partyCode) return;
    try {
      const [msgs, players, state] = await Promise.all([
        dbGetMessages(partyCode),
        dbGetPlayers(partyCode),
        dbGetPartyState(partyCode),
      ]);
      setMessages(msgs);
      setPartyPlayers(players);
      setQs({ currentId:null, step:0, active:false, completed:[], combat:null, masterBuffs:null, rest:null, persistentSpellSlots:null, longRestSeed:0, ...state });
      const freshMe = players.find(p=>p.id===myId);
      if(freshMe) {
        setMeRaw(freshMe);
        const pending = checkDailyReward(freshMe.id);
        if(pending) setDailyRewardModal(pending);
      }
    } catch(e) {
      console.error("Errore refreshAll:", e);
    }
  }, [myId]);

  useEffect(() => {
    if (qs?.combat?.active) {
      audioManager.playBGM("combat");
    } else if (tab === "shop") {
      audioManager.playBGM("town");
    } else if (tab === "chat") {
      audioManager.playBGM("tavern");
    } else if (spellMenu) {
      audioManager.playBGM("magic");
    } else {
      audioManager.playBGM("intro");
    }
  }, [qs?.combat?.active, tab, spellMenu]);

  const refreshInventory = useCallback(async (playerOverride=null) => {
    if(!myId) return;
    setInventoryLoading(true);
    try {
      const items = await dbGetItems();
      const { entries } = await dbGetPlayerInventory(myId, items);
      const nextEquipment = getStoredEquipment(myId);
      const ownedIds = new Set(entries.map(entry => entry.itemId));
      const sanitizedEquipment = Object.fromEntries(
        EQUIP_SLOTS.map(s => [s, ownedIds.has(nextEquipment[s]) ? nextEquipment[s] : null])
      );
      saveStoredEquipment(myId, sanitizedEquipment);
      setCatalogItems(items);
      setInventory(entries);
      setEquipment(sanitizedEquipment);

      const sourcePlayer = playerOverride;
      if(sourcePlayer) {
        const synced = applyEquipmentToPlayer(sourcePlayer, sanitizedEquipment, new Map(items.map(item => [item.id, item])));
        const statsChanged = ["atk","def","mag","init","maxHp"].some(key => (sourcePlayer[key] || 0) !== (synced[key] || 0));
        if(statsChanged) {
          // Re-fetch HP from DB to avoid overwriting combat-reduced HP
          const { data: freshRow } = await supabase.from("players").select("hp,dead").eq("id", sourcePlayer.id).maybeSingle();
          const dbHp = freshRow?.hp ?? sourcePlayer.hp ?? synced.maxHp;
          // NEVER increase HP here — only cap it if it exceeds new maxHp
          const freshHp = Math.min(synced.maxHp, Math.max(0, dbHp));
          const toSave = { ...synced, hp: freshHp, dead: freshRow?.dead ?? synced.dead };
          await dbSavePlayer(toSave);
          if(sourcePlayer.id === myId) setMeRaw(toSave);
        }
      }
    } catch(e) {
      console.error("Errore caricamento inventario:", e);
    } finally {
      setInventoryLoading(false);
    }
  }, [myId]);

  const refreshAuctions = useCallback(async () => {
    setAuctionsLoading(true);
    try {
      const state = await dbGetAuctionHouse();
      setAuctions(state.auctions || []);
    } catch(e) {
      console.error("Errore refresh aste:", e);
    } finally {
      setAuctionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if(tab === "trade") refreshAuctions();
  }, [tab, refreshAuctions]);

  useEffect(()=>{
    async function init() {
      debugCharacterFlow("game_load_start", { myId });
      if(!myId) {
        debugCharacterFlow("game_load_failure", { reason: "missing_myId" });
        setScreen("landing");
        return;
      }
      try {
        const { data, error } = await supabase.from("players").select("*").eq("id", myId).single();
        debugCharacterFlow("game_load_fetch_result", {
          requestedId: myId,
          found: !!data,
          error: error?.message || null,
          player: data ? { id:data.id, party_code:data.party_code, class:data.class, dead:data.dead } : null,
        });
        if(error) throw error;
        if(!data) {
          debugCharacterFlow("game_load_failure", { reason: "player_not_found_after_screen_enter", requestedId: myId });
          setScreen("landing");
          return;
        }
        const p = { id:data.id, name:data.name, partyCode:data.party_code, accountId:data.account_id||null, class:data.class, race:data.race, hp:data.hp, maxHp:data.max_hp, atk:data.atk, def:data.def, mag:data.mag, init:data.init, xp:data.xp, level:data.level, gold:data.gold };
        setMeRaw(p);
        await refreshAll(p.partyCode);
        await refreshInventory(p);
        refreshGuilds();
        // Load world chat and master chat (last 7 days)
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        dbGetMessages("__world__").then(wm => setWorldMessages(wm.filter(m => m.type === "chat")));
        dbGetMessages("__master__").then(mm => setMasterMessages(mm.filter(m => m.type === "chat" && new Date(m.created_at).getTime() >= sevenDaysAgo)));
        // Realtime subscription
        subRef.current = supabase.channel("party_"+p.partyCode)
          .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
          .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`party_code=eq.__world__` },
            () => dbGetMessages("__world__").then(wm => setWorldMessages(wm.filter(m => m.type === "chat"))))
          .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`party_code=eq.__master__` },
            () => { const ago = Date.now() - 7*24*60*60*1000; dbGetMessages("__master__").then(mm => setMasterMessages(mm.filter(m => m.type==="chat" && new Date(m.created_at).getTime()>=ago))); })
          .on("postgres_changes", { event:"*", schema:"public", table:"players", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
          .on("postgres_changes", { event:"*", schema:"public", table:"player_items" },
            () => refreshInventory(latestMeRef.current))
          .on("postgres_changes", { event:"*", schema:"public", table:"party_state", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
          .subscribe();
      } catch(e) {
        debugCharacterFlow("game_load_failure", { requestedId: myId, error: e?.message || String(e) });
        console.error("Errore inizializzazione game:", e);
        alert(`GameScreen load fallito.\n\nPlayer ID: ${myId}\nMotivo: ${e?.message || "errore sconosciuto"}`);
        setScreen("landing");
      }
    }
    init();
    return ()=>{ if(subRef.current) supabase.removeChannel(subRef.current); };
  },[myId, refreshAll, refreshInventory, setScreen]);

  useEffect(()=>{ msgEnd.current?.scrollIntoView({behavior:"smooth"}); },[messages]);
  useEffect(()=>{
    const el = combatLogEndRef.current;
    if(el) { const p = el.parentElement; if(p) p.scrollTop = p.scrollHeight; }
  },[messages]);

  // Guild chat subscription
  const myGuildId = useMemo(() => getPlayerGuild(guilds, myId)?.id || null, [guilds, myId]);
  useEffect(() => {
    if (!myGuildId) { setGuildChatMessages([]); return; }
    const fetchChat = async () => {
      const msgs = await dbGetMessages("guild_" + myGuildId);
      setGuildChatMessages(msgs);
    };
    fetchChat();
    guildChatSubRef.current = supabase.channel("guild_chat_" + myGuildId)
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`party_code=eq.guild_${myGuildId}` }, fetchChat)
      .subscribe();
    return () => { if(guildChatSubRef.current) supabase.removeChannel(guildChatSubRef.current); };
  }, [myGuildId]);
  useEffect(() => {
    const el = guildChatEndRef.current;
    if(el) { const p = el.parentElement; if(p) p.scrollTop = p.scrollHeight; }
  }, [guildChatMessages]);

  // Keep pendingLogRef current without triggering turn timer reset
  useEffect(() => {
    pendingLogRef.current = !!(qs?.combat?.pendingLog);
  }, [qs?.combat?.pendingLog]);

  // Auto-dismiss combat log after 3.5s — only the leader writes to DB to avoid concurrent overwrites
  useEffect(() => {
    if (!qs?.combat?.pendingLog) return;
    const combatants = qs?.combat?.combatants || [];
    const isLeader = combatants.find(c => c.isPlayer && !c.isSummon && !c.dead)?.id === myId
      || !combatants.some(c => c.isPlayer && !c.isSummon && !c.dead); // fallback if all dead
    if (!isLeader) return;
    const t = setTimeout(() => dismissCombatLog(), 3500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs?.combat?.pendingLog]);

  // Notify player when master grants a legendary item
  useEffect(() => {
    const leg = qs?.masterBuffs?.[myId]?.legendaryItem;
    const prev = prevLegItemRef.current;
    if(leg && leg.turnsLeft > 0 && leg.name !== prev?.name) {
      setLegNotif(leg);
      const t = setTimeout(() => setLegNotif(null), 7000);
      prevLegItemRef.current = leg;
      return () => clearTimeout(t);
    }
    if(!leg) prevLegItemRef.current = null;
  }, [qs?.masterBuffs?.[myId]?.legendaryItem?.name, myId]);

  // 30-second turn timer — shows countdown for any player's turn; auto-acts on expiry
  const TURN_TIMEOUT_S = 30;
  const currentActorIdRef = useRef(null);
  useEffect(() => {
    if(turnTimerRef.current) { clearInterval(turnTimerRef.current); turnTimerRef.current = null; }
    const c = qs?.combat;
    if(!c?.active) { setTurnTimeLeft(null); return; }
    const actor = (c.combatants||[])[c.turn % Math.max(1,(c.combatants||[]).length)];
    if(!actor?.isPlayer || actor?.isSummon || c.pendingLog) { setTurnTimeLeft(null); return; }
    currentActorIdRef.current = actor.id;
    let timeLeft = TURN_TIMEOUT_S;
    setTurnTimeLeft(timeLeft);
    turnTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      setTurnTimeLeft(timeLeft);
      if(timeLeft <= 0) {
        clearInterval(turnTimerRef.current);
        turnTimerRef.current = null;
        if(currentActorIdRef.current === myId) {
          // My turn timed out → auto-attack
          doAttackRef.current?.();
        } else {
          // Another player's turn timed out — only leader forces it forward
          const cbs = combatRef.current?.combatants || [];
          const amLeaderNow = cbs.find(c => c.isPlayer && !c.isSummon && !c.dead)?.id === myId;
          if(amLeaderNow) forceNextTurnRef.current?.();
        }
      }
    }, 1000);
    return () => { if(turnTimerRef.current) { clearInterval(turnTimerRef.current); turnTimerRef.current = null; } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs?.combat?.turn, qs?.combat?.round, qs?.combat?.active, !!qs?.combat?.pendingLog]);

  // Push notification when it becomes my turn
  // Auto-switch to quest tab when combat ends
  const prevCombatActiveRef = useRef(false);
  useEffect(() => {
    const isActive = !!qs?.combat?.active;
    if(!prevCombatActiveRef.current && isActive) {
      setDeclinedCombatAt(null); // new combat started — reset decline
    }
    if(prevCombatActiveRef.current && !isActive) {
      setTimeout(() => setTab("quest"), 800);
    }
    prevCombatActiveRef.current = isActive;
  }, [!!qs?.combat?.active]);

  // ── Daily reset at 12:00 and 00:00 ──
  // ── Maintenance mode polling ──
  const prevMaintenanceRef = useRef(null);
  useEffect(() => {
    async function checkMaintenance() {
      const { data } = await supabase.from("party_state").select("quest_active,quest_id,state").eq("party_code", MAINTENANCE_CODE).maybeSingle();
      const isActive = !!(data?.quest_active);
      setMaintenanceMode(isActive);
      setMaintenanceMsg(data?.quest_id || "");
      // Show patch modal when maintenance just ended
      if (prevMaintenanceRef.current === true && !isActive) {
        const notes = data?.state?.patch_notes;
        const ts = data?.state?.patch_ts || data?.updated_at || "";
        if (notes && ts) {
          const seenKey = `patchSeen_${ts}`;
          if (!localStorage.getItem(seenKey)) {
            setPatchModal({ notes, ts });
          }
        }
      }
      // Also show on first load if game is open and patch not yet seen
      if (prevMaintenanceRef.current === null && !isActive) {
        const notes = data?.state?.patch_notes;
        const ts = data?.state?.patch_ts || data?.updated_at || "";
        if (notes && ts) {
          const seenKey = `patchSeen_${ts}`;
          if (!localStorage.getItem(seenKey)) {
            setPatchModal({ notes, ts });
          }
        }
      }
      prevMaintenanceRef.current = isActive;
    }
    checkMaintenance();
    const t = setInterval(checkMaintenance, 15_000);
    return () => clearInterval(t);
  }, []);

  // Tick every second for boss revive countdown
  useEffect(() => {
    if (!qs?.combat?.isBossEvent || !qs?.combat?.bossKnockedOut?.[myId]) return;
    const iv = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [!!qs?.combat?.isBossEvent, !!qs?.combat?.bossKnockedOut?.[myId]]);

  const dailyResetRunningRef = useRef(false);
  const prevCombatHpRef = useRef({});
  const [shakingIds, setShakingIds] = useState(new Set());
  useEffect(() => {
    async function checkDailyReset() {
      if(dailyResetRunningRef.current) return;
      const latestQs = await dbGetPartyState(code);
      const slot = getDailyResetSlot();
      if(latestQs.lastDailyReset === slot) return; // already done for this slot
      if(latestQs.combat?.active) return; // never interrupt combat
      dailyResetRunningRef.current = true;
      try {
        // Heal all players in the party to full HP
        const players = await dbGetPlayers(code);
        await Promise.all(players.filter(p => !p.dead).map(p =>
          supabase.from("players").update({ hp: p.maxHp, updated_at: new Date().toISOString() }).eq("id", p.id)
        ));
        // Rotate shop and quests by bumping longRestSeed
        const newSeed = (latestQs.longRestSeed || 0) + 1;
        const resetSlotLabel = slot.endsWith('_noon') ? 'mezzogiorno' : 'mezzanotte';
        const diaryEntry = { type:'rest', icon:'🌅', text:`Reset giornaliero delle ${resetSlotLabel}: tutti i PG sono stati curati, negozio e missioni aggiornati.`, players:[] };
        const newDiary = [diaryEntry, ...(latestQs.partyDiary || [])].slice(0, 80);
        await saveQState({ ...latestQs, longRestSeed: newSeed, lastDailyReset: slot, partyDiary: newDiary });
      } finally {
        dailyResetRunningRef.current = false;
      }
    }
    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const prevMyTurnRef = useRef(false);
  // Request notification permission as soon as combat starts
  useEffect(() => {
    if(qs?.combat?.active && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [!!qs?.combat?.active]);

  // Detect HP drops to trigger shake animation on combatant cards
  useEffect(() => {
    const combatants = qs?.combat?.combatants;
    if(!combatants) return;
    const hit = new Set();
    combatants.forEach(c => {
      const prev = prevCombatHpRef.current[c.id];
      if(prev !== undefined && c.hp < prev) hit.add(c.id);
      prevCombatHpRef.current[c.id] = c.hp;
    });
    if(hit.size > 0) {
      setShakingIds(hit);
      const t = setTimeout(() => setShakingIds(new Set()), 600);
      return () => clearTimeout(t);
    }
  }, [qs?.combat?.combatants]);

  useEffect(() => {
    const c = qs?.combat;
    const isNowMyTurn = !!(c?.active && !c.pendingLog && c.combatants?.[c.turn % Math.max(1, c.combatants.length)]?.id === myId);
    if (isNowMyTurn && !prevMyTurnRef.current) {
      // Notify whenever the user is not watching the combat tab
      const awayFromCombat = document.hidden || tab !== "combat";
      if (awayFromCombat && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Echoes of Zodar ⚔️", { body: `⚔️ È il tuo turno, ${me?.name || "Eroe"}! Hai 30 secondi.`, icon: "/favicon.ico", tag: "my-turn", renotify: true });
        }
      }
    }
    prevMyTurnRef.current = isNowMyTurn;
  }, [qs?.combat?.turn, qs?.combat?.round, qs?.combat?.active, qs?.combat?.pendingLog, tab]);

  // Fallback poll — keeps the log alive if Supabase realtime silently drops
  useEffect(() => {
    const code = me?.partyCode;
    if (!code) return;
    const id = setInterval(() => refreshAll(code), 15000);
    return () => clearInterval(id);
  }, [me?.partyCode, refreshAll]);

  useEffect(() => {
    const stepData = qs?.active ? normalizeQuestStep(getQuests().find(q=>q.id===qs.currentId)?.steps?.[qs.step]) : null;
    if(!stepData || !isCombatStep(stepData)) return;
    if(qs?.combat?.active || qs?.combat?.won) return;
    startCombatStepRef.current?.(stepData);
  }, [qs?.active, qs?.currentId, qs?.step, qs?.combat?.active, qs?.combat?.won]);

  // Auto-attack when it's a monster's turn.
  // Extracted monster attack logic — called by button (leader) and by fallback timer.
  // Only the first alive player in initiative order executes to prevent race conditions.
  async function doMonsterTurn() {
    if (monsterTickBusyRef.current) return;
    monsterTickBusyRef.current = true;
    try {
      const latestQs = await dbGetPartyState(code);
      const latestCombat = latestQs?.combat;
      if (!latestCombat?.active) return;
      if (latestCombat.pendingLog) return;
      const latestCombatants = [...latestCombat.combatants];
      // Guard: all monsters already dead (race condition — endCombat ran concurrently)
      if (latestCombatants.filter(c => !c.isPlayer).every(c => c.hp <= 0)) return;
      const actor = latestCombatants[latestCombat.turn % latestCombatants.length];
      if (actor?.isPlayer) return; // turn already advanced to a player — do nothing
      if (!actor || actor.hp <= 0) {
        // Dead monster slot — advance turn without attacking
        const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
        const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound };
        await dbSavePartyState(code, { ...latestQs, combat: newCombat });
        setQs(prev => ({ ...prev, combat: newCombat }));
        return;
      }
      // Process status effects on monster at turn start
      let monsterStatusLog = null;
      if ((actor.statusEffects || []).length > 0) {
        const sfx = processStatusEffects(actor);
        const actorIdx = latestCombatants.findIndex(c => c.id === actor.id);
        if (actorIdx >= 0) latestCombatants[actorIdx] = sfx.combatant;
        if (sfx.skipTurn || sfx.died) {
          const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
          const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound, pendingLog: sfx.log };
          await dbSavePartyState(code, { ...latestQs, combat: newCombat });
          setQs(prev => ({ ...prev, combat: newCombat }));
          await dbSendMessage({ party_code: code, author: "Battaglia", content: sfx.log, type: "combat" });
          return;
        }
        monsterStatusLog = sfx.log;
      }
      const latestPlayers = await dbGetPlayers(code);
      const combatPlayerIds = new Set(latestCombatants.filter(c => c?.isPlayer).map(c => c.id));
      const alivePlayers = latestPlayers.filter(p => combatPlayerIds.has(p.id) && (p?.hp || 0) > 0);
      if (!alivePlayers.length) {
        if(!hasActionablePlayerCombatants(latestCombatants)) {
          await resolveCombatNoActionablePlayers(latestQs, latestCombatants);
          return;
        }
        const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
        const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound };
        await dbSavePartyState(code, { ...latestQs, combat: newCombat });
        setQs(prev => ({ ...prev, combat: newCombat }));
        return;
      }
      const isBossEvent = !!latestCombat.isBossEvent;
      // Enrage: boss ATK ×1.6 when HP < 50%
      const bossHpPct = actor.hp / Math.max(1, actor.maxHp);
      const enraged = isBossEvent && bossHpPct <= 0.5;
      const enrageAtk = enraged ? Math.ceil((actor.atk || 0) * 1.6) : (actor.atk || 0);
      const enragedActor = enraged ? { ...actor, atk: enrageAtk } : actor;
      // Boss special move every 3 rounds (area or massive single)
      const bossSpecialRound = isBossEvent && latestCombat.round > 1 && latestCombat.round % 3 === 0;
      let monsterNewMasterBuffs = latestQs.masterBuffs || {};
      if (bossSpecialRound) {
        const specialType = latestCombat.round % 6 === 0 ? 'area' : 'massive';
        if (specialType === 'area') {
          // Area attack: hit ALL alive players
          let areaLog = `💥 **${actor.name}** scatena **COLPO DEVASTANTE**!\n🌋 L'energia oscura travolge tutti i combattenti!\n`;
          const newKO = { ...(latestCombat.bossKnockedOut || {}) };
          let newEnraged = latestCombat.bossEnraged || enraged;
          for (const ap of alivePlayers) {
            const apBuffs = (latestQs.masterBuffs || {})[ap.id] || {};
            const areaDmg = Math.max(1, Math.floor((enragedActor.atk || 10) * 0.9) - Math.floor((ap.def || 0) / 3));
            let apHp = Math.max(0, ap.hp - areaDmg);
            if (apBuffs.immortal > 0 && apHp <= 0) { apHp = 1; monsterNewMasterBuffs = { ...monsterNewMasterBuffs, [ap.id]: { ...apBuffs, immortal: apBuffs.immortal - 1 } }; }
            areaLog += `  💔 **${ap.name}**: -${areaDmg} → ${apHp}/${ap.maxHp} HP\n`;
            if (isBossEvent && apHp <= 0 && !(apBuffs.immortal > 0)) {
              newKO[ap.id] = Date.now();
              const ci = latestCombatants.findIndex(c => c.id === ap.id);
              if (ci >= 0) latestCombatants.splice(ci, 1);
              await dbSavePlayer({ ...ap, hp: 1, dead: false });
              if (ap.id === myId) setMeRaw({ ...ap, hp: 1, dead: false });
              areaLog += `  💀 **${ap.name}** è stato eliminato dall'arena!\n`;
            } else {
              const ci = latestCombatants.findIndex(c => c.id === ap.id);
              if (ci >= 0) latestCombatants[ci] = { ...latestCombatants[ci], hp: apHp };
              await dbSavePlayer({ ...ap, hp: apHp, dead: false });
              if (ap.id === myId) setMeRaw({ ...ap, hp: apHp, dead: false });
            }
          }
          if (enraged && !latestCombat.bossEnraged) areaLog += `\n🔴 **${actor.name}** è in **FURIA**! ATK aumentato!`;
          const { nextTurn: nt, nextRound: nr } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
          if(!hasActionablePlayerCombatants(latestCombatants)) { await resolveCombatNoActionablePlayers({ ...latestQs, masterBuffs: monsterNewMasterBuffs }, latestCombatants); return; }
          const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nt, round: nr, bossKnockedOut: newKO, bossEnraged: newEnraged, pendingLog: areaLog };
          await dbSavePartyState(code, { ...latestQs, masterBuffs: monsterNewMasterBuffs, combat: newCombat });
          setQs(prev => ({ ...prev, combat: newCombat }));
          return;
        } else {
          // Massive single: 2.5× normal damage on one target
          const massPt = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          const massBuffs = (latestQs.masterBuffs || {})[massPt.id] || {};
          const massDmg = Math.max(1, Math.round((Math.floor(Math.random() * 8) + 1 + Math.floor((enragedActor.atk || 0) / 4)) * 2.5));
          let massHp = Math.max(0, massPt.hp - massDmg);
          const massKO = { ...(latestCombat.bossKnockedOut || {}) };
          if (massBuffs.immortal > 0 && massHp <= 0) { massHp = 1; monsterNewMasterBuffs = { ...monsterNewMasterBuffs, [massPt.id]: { ...massBuffs, immortal: massBuffs.immortal - 1 } }; }
          let massLog = `⚡ **${actor.name}** scatena **ATTACCO FATALE** su **${massPt.name}**!\n💥 Danno: **${massDmg}** (colpo devastante)\n❤️ ${massPt.name}: ${massHp}/${massPt.maxHp} HP`;
          if (isBossEvent && massHp <= 0 && !(massBuffs.immortal > 0)) {
            massKO[massPt.id] = Date.now();
            const ci = latestCombatants.findIndex(c => c.id === massPt.id);
            if (ci >= 0) latestCombatants.splice(ci, 1);
            await dbSavePlayer({ ...massPt, hp: 1, dead: false });
            if (massPt.id === myId) setMeRaw({ ...massPt, hp: 1, dead: false });
            massLog += `\n💀 **${massPt.name}** è stato eliminato dall'arena!`;
          } else {
            const ci = latestCombatants.findIndex(c => c.id === massPt.id);
            if (ci >= 0) latestCombatants[ci] = { ...latestCombatants[ci], hp: massHp };
            await dbSavePlayer({ ...massPt, hp: massHp, dead: false });
            if (massPt.id === myId) setMeRaw({ ...massPt, hp: massHp, dead: false });
          }
          if (enraged && !latestCombat.bossEnraged) massLog += `\n🔴 **${actor.name}** è in **FURIA**! ATK aumentato!`;
          const { nextTurn: nt, nextRound: nr } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
          if(!hasActionablePlayerCombatants(latestCombatants)) { await resolveCombatNoActionablePlayers({ ...latestQs, masterBuffs: monsterNewMasterBuffs }, latestCombatants); return; }
          const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nt, round: nr, bossKnockedOut: massKO, bossEnraged: enraged, pendingLog: massLog };
          await dbSavePartyState(code, { ...latestQs, masterBuffs: monsterNewMasterBuffs, combat: newCombat });
          setQs(prev => ({ ...prev, combat: newCombat }));
          return;
        }
      }
      // Normal attack
      const pt = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const ptBuffs = (latestQs.masterBuffs || {})[pt.id] || {};
      const weaponDie = getCombatDamageDie(enragedActor);
      const ptLegendary = ptBuffs.legendaryItem;
      const legDefBonus = (ptLegendary?.turnsLeft > 0 && ptLegendary?.bonus_def) ? ptLegendary.bonus_def : 0;
      const effectivePt = legDefBonus ? { ...pt, def: (pt.def || 0) + legDefBonus } : pt;
      const resolved = await performAsyncAttack(enragedActor, effectivePt, weaponDie);
      const playerResisted = resolved.hit && (effectivePt.resistances || []).includes('physical');
      const edmg = playerResisted ? Math.max(1, Math.floor(resolved.damage / 2)) : resolved.damage;
      let effectiveHp = Math.max(0, pt.hp - edmg);
      const playerCombatantIdx = latestCombatants.findIndex(c => c.id === pt.id);
      if(ptBuffs.immortal > 0 && effectiveHp <= 0) {
        effectiveHp = 1;
        monsterNewMasterBuffs = { ...monsterNewMasterBuffs, [pt.id]: { ...ptBuffs, immortal: ptBuffs.immortal - 1 } };
      }
      const immortalTriggered = ptBuffs.immortal > 0 && effectiveHp === 1 && edmg >= (pt.hp || 0);
      const monsterAttackStatusEffect = resolved.hit && actor.attackStatusEffect ? actor.attackStatusEffect : null;
      const bossKnockedOut = { ...(latestCombat.bossKnockedOut || {}) };
      // Boss event: instant expulsion on death instead of death saves
      if (isBossEvent && effectiveHp <= 0 && !immortalTriggered) {
        bossKnockedOut[pt.id] = Date.now();
        if (playerCombatantIdx >= 0) latestCombatants.splice(playerCombatantIdx, 1);
        await dbSavePlayer({ ...pt, hp: 1, dead: false });
        if (pt.id === myId) setMeRaw({ ...pt, hp: 1, dead: false });
        let koLog = formatWeaponAttackLog(enragedActor, pt, { ...resolved, damage: edmg }, enraged ? "Attacco (Furia)" : "Attacco naturale", 0, pt.maxHp, { resisted: playerResisted });
        koLog += `\n💀 **${pt.name}** è stato eliminato dall'arena! Tornerà a 1 HP e potrà rientrare tra 90 secondi.`;
        if (enraged && !latestCombat.bossEnraged) koLog += `\n🔴 **${actor.name}** è in **FURIA**!`;
        if (monsterStatusLog) koLog = monsterStatusLog + '\n---\n' + koLog;
        const { nextTurn: nt, nextRound: nr } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
        if(!hasActionablePlayerCombatants(latestCombatants)) { await resolveCombatNoActionablePlayers({ ...latestQs, masterBuffs: monsterNewMasterBuffs }, latestCombatants); return; }
        const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nt, round: nr, bossKnockedOut, bossEnraged: enraged, pendingLog: koLog };
        await dbSavePartyState(code, { ...latestQs, masterBuffs: monsterNewMasterBuffs, combat: newCombat });
        setQs(prev => ({ ...prev, combat: newCombat }));
        return;
      }
      const updPt = { ...pt, hp: effectiveHp, dead: false };
      if(playerCombatantIdx >= 0) {
        let updCombatant = immortalTriggered
          ? reviveCombatantState({ ...latestCombatants[playerCombatantIdx], maxHp: updPt.maxHp }, 1)
          : applyCombatDamageState({ ...latestCombatants[playerCombatantIdx], maxHp: updPt.maxHp }, edmg);
        if(effectiveHp > 0 && !immortalTriggered) updCombatant.hp = effectiveHp;
        if(monsterAttackStatusEffect) {
          const existing = updCombatant.statusEffects || [];
          if (!existing.some(e => e.type === monsterAttackStatusEffect.type)) {
            updCombatant = { ...updCombatant, statusEffects: [...existing, monsterAttackStatusEffect] };
          }
        }
        latestCombatants[playerCombatantIdx] = updCombatant;
      }
      await dbSavePlayer(updPt);
      if (updPt.id === myId) setMeRaw(updPt);
      const immortalNote = immortalTriggered ? `\n🛡️ **${pt.name}** è protetto dall'Immortalità! (${ptBuffs.immortal - 1} turni rimasti)` : "";
      let enrageNote = (enraged && !latestCombat.bossEnraged) ? `\n🔴 **${actor.name}** è in **FURIA**! I suoi attacchi sono ora devastanti!` : "";
      let log = formatWeaponAttackLog(enragedActor, pt, { ...resolved, damage: edmg }, enraged ? "Attacco (Furia)" : "Attacco naturale", updPt.hp, pt.maxHp, { resisted: playerResisted, statusApplied: monsterAttackStatusEffect?.type }) + immortalNote + enrageNote;
      if (monsterStatusLog) log = monsterStatusLog + '\n---\n' + log;
      const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
      const allDead = latestCombatants.filter(c => !c.isPlayer).every(c => c.hp <= 0);
      const newBossEnraged = enraged || latestCombat.bossEnraged;
      if (allDead) {
        const endQs = { ...latestQs, masterBuffs: monsterNewMasterBuffs, combat: { ...latestCombat, combatants: latestCombatants } };
        await dbSavePartyState(code, endQs);
        setQs(prev => ({ ...prev, combat: endQs.combat }));
        await dbSendMessage({ party_code: code, author: "Sistema", content: "🏆 **BATTAGLIA VINTA!** Tutti i nemici sconfitti!", type: "victory" });
      } else {
        const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound, bossKnockedOut, bossEnraged: newBossEnraged, pendingLog: log };
        await dbSavePartyState(code, { ...latestQs, masterBuffs: monsterNewMasterBuffs, combat: newCombat });
        setQs(prev => ({ ...prev, combat: newCombat }));
        await dbSendMessage({ party_code: code, author: "Battaglia", content: log, type: "combat" });
      }
    } finally {
      monsterTickBusyRef.current = false;
    }
  }
  doMonsterTurnRef.current = doMonsterTurn;

  async function leaveCombat() {
    const latestQs = await dbGetPartyState(code);
    const c = latestQs?.combat;
    if (!c?.active) return;
    const myIdx = c.combatants.findIndex(x => x.id === myId);
    if (myIdx === -1) return; // not in combat
    const newCombatants = c.combatants.filter(x => x.id !== myId);
    if (!newCombatants.length) return; // last player — don't leave
    // Fix turn index after removal
    let newTurn = c.turn;
    if (myIdx < c.turn) newTurn = c.turn - 1;
    else if (myIdx === c.turn) newTurn = c.turn % newCombatants.length; // advance to next
    newTurn = Math.max(0, Math.min(newTurn, newCombatants.length - 1));
    const log = `🚪 **${c.combatants[myIdx].name}** ha abbandonato la battaglia.`;
    await saveQState({ ...latestQs, combat: { ...c, combatants: newCombatants, turn: newTurn, pendingLog: log } });
    await addMsg(log, "combat", "Sistema");
  }

  const BOSS_REVIVE_MS = 90_000;
  async function enterBossArena() {
    const latestQs = await dbGetPartyState(code);
    const c = latestQs?.combat;
    if (!c?.active || !c?.isBossEvent) return;
    if (c.combatants?.some(x => x.id === myId)) return;
    const koTime = c.bossKnockedOut?.[myId];
    if (koTime && Date.now() - koTime < BOSS_REVIVE_MS) return;
    const newCombatant = {
      id: myId, name: me.name, class: me.class, race: me.race,
      emoji: CLASSES[me.class]?.emoji || "⚔️",
      hp: me.hp, maxHp: me.maxHp, atk: me.atk, def: me.def, mag: me.mag, init: me.init,
      weaponDie: getEquippedWeapon(equipment, itemMapRef.current).weapon_die,
      isPlayer: true, dying: false, stable: false, dead: false, deathSuccesses: 0, deathFailures: 0,
      rollInit: (me.init || 1) + Math.floor(Math.random() * 20) + 1,
    };
    const newKO = { ...(c.bossKnockedOut || {}) };
    delete newKO[myId];
    const newCombatants = [...c.combatants, newCombatant].sort((a, b) => b.rollInit - a.rollInit);
    await saveQState({ ...latestQs, combat: { ...c, combatants: newCombatants, bossKnockedOut: newKO } });
    await addMsg(`⚔️ **${me.name}** rientra nell'arena!`, "combat", "Sistema");
  }

  // Summon attack — owner chooses target manually
  async function doSummonAttack(targetId) {
    const latestQs = await dbGetPartyState(code);
    const latestCombat = latestQs?.combat;
    if(!latestCombat?.active || latestCombat.pendingLog) return;
    const combatants = [...latestCombat.combatants];
    const turn = latestCombat.turn % combatants.length;
    const summon = combatants[turn];
    if(!summon?.isSummon) return;
    const enemies = combatants.filter(c => !c.isPlayer && c.hp > 0);
    if(!enemies.length) { await endCombat(latestQs); return; }
    const target = (targetId && combatants.find(c => c.id === targetId && c.hp > 0)) || enemies[0];
    const atkRoll = parseDice("1d20") + Math.floor((summon.atk || 0) / 2);
    const rawDmg = parseDice(summon.dmgDie || "1d8");
    const dmg = Math.max(1, rawDmg + Math.floor((summon.atk || 0) / 2) - Math.floor((target.def || 0) / 2));
    const tidx = combatants.findIndex(c => c.id === target.id);
    combatants[tidx] = { ...target, hp: Math.max(0, target.hp - dmg) };
    const log = `${summon.emoji} **${summon.name}** attacca **${target.name}**!\n⚔️ Tiro: ${atkRoll}\n💥 Danno: **${dmg}**\n❤️ ${target.name}: ${combatants[tidx].hp}/${target.maxHp} HP`;
    const { nextTurn, nextRound } = getNextCombatTurn(combatants, latestCombat.turn, latestCombat.round);
    const allDead = combatants.filter(c => !c.isPlayer).every(c => c.hp <= 0);
    if(allDead) { await endCombat({ ...latestQs, combat: { ...latestCombat, combatants } }); return; }
    await saveQState({ ...latestQs, combat: { ...latestCombat, combatants, turn: nextTurn, round: nextRound, pendingLog: log } });
  }

  // Auto-fallback: if owner doesn't act within 15s, auto-attack first enemy
  useEffect(() => {
    const c = qs?.combat;
    if(!c?.active || c.pendingLog) return;
    const combatants = c.combatants || [];
    const actor = combatants[c.turn % Math.max(1, combatants.length)];
    if(!actor?.isSummon) return;
    const isOwner = actor.summonOwner === myId || (!actor.summonOwner && (partyPlayers.length === 0 || partyPlayers[0]?.id === myId));
    if(!isOwner) return;
    const t = setTimeout(() => { doSummonAttack(null); }, 15000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs?.combat?.turn, qs?.combat?.active, qs?.combat?.pendingLog]);

  // Fallback timer — fires if player doesn't press the button within 8s.
  // Also re-triggers when pendingLog clears (fixes the freeze-after-dismiss bug).
  // Paused while spellMenu is open so players can read spells without time pressure.
  useEffect(() => {
    if (!qs?.combat?.active) return;
    if (spellMenu) return;
    const combatants = qs?.combat?.combatants || [];
    const activeCombatantNow = combatants[qs?.combat?.turn % combatants.length];
    if (!activeCombatantNow || activeCombatantNow.isPlayer) return; // only arm for monster turns
    const isLeader = combatants.find(c => c.isPlayer && !c.isSummon && !c.dead)?.id === myId;
    // Leader fires immediately (800ms safety buffer); fallback clients fire at 8-12s
    const delay = isLeader ? 800 : 8000 + Math.floor(Math.random() * 4000);
    const timer = setTimeout(() => { doMonsterTurnRef.current?.(); }, delay);
    return () => clearTimeout(timer);
  }, [qs?.combat?.turn, qs?.combat?.active, !!qs?.combat?.pendingLog, myId, code, spellMenu]);

  async function addMsg(content, type="narration", author=null) {
    await dbSendMessage({ party_code:code, author:author||me?.name, content, type });
  }

  async function refreshGuilds() {
    setGuildLoading(true);
    try {
      const [g, players, meta] = await Promise.all([dbGetAllGuilds(), dbGetPlayers(), dbGetUserMasterMeta()]);
      setGuilds(g);
      setWorldPlayers(players.filter(p=>!p.dead));
      setWorldMeta(meta);
    } finally { setGuildLoading(false); }
  }

  async function refreshWarehouse(guildId) {
    const rows = await dbGetGuildWarehouse(guildId);
    const items = await dbGetItems();
    const itemMap2 = new Map(items.map(i=>[i.id,i]));
    setWarehouseItems(rows.map(r=>({ rowId:r.id, itemId:r.item_id, item:itemMap2.get(r.item_id)||null })).filter(e=>e.item));
  }

  async function createGuild() {
    if(!me||me.gold<10000){window.alert("Servono 10000 oro per fondare una gilda.");return;}
    if(!guildForm.name.trim()){window.alert("Scegli un nome.");return;}
    if(getPlayerGuild(guilds,myId)){window.alert("Sei già in una gilda.");return;}
    const gId=`g_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;
    const newGuild={ id:gId, name:guildForm.name.trim(), emoji:guildForm.emoji||"⚔️", description:guildForm.desc.trim(), emblem:guildForm.emblem||DEFAULT_EMBLEM, leaderId:myId, leaderName:me.name, level:1, xp:0, hallLevel:1, members:[{id:myId,name:me.name,role:"leader",joinedAt:new Date().toISOString()}], missions:[], createdAt:new Date().toISOString() };
    const newGuilds={...guilds,[gId]:newGuild};
    await dbSaveAllGuilds(newGuilds);
    const upd={...me,gold:me.gold-10000}; await dbSavePlayer(upd); setMeRaw(upd);
    setGuilds(newGuilds); setGuildForm({name:"",emoji:"⚔️",desc:"",emblem:{...DEFAULT_EMBLEM}});
    await addMsg(`🏛️ **${me.name}** ha fondato la gilda **${newGuild.emoji} ${newGuild.name}**!`,"info","Sistema");
  }

  async function joinGuild(gId) {
    if(getPlayerGuild(guilds,myId)){window.alert("Sei già in una gilda.");return;}
    const guild=guilds[gId]; if(!guild) return;
    const newG={...guild,members:[...(guild.members||[]),{id:myId,name:me.name,role:"member",joinedAt:new Date().toISOString()}]};
    const newGuilds={...guilds,[gId]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    await addMsg(`🏛️ **${me.name}** è entrato nella gilda **${guild.emoji} ${guild.name}**!`,"info","Sistema");
  }

  async function requestJoinGuild(gId) {
    if(getPlayerGuild(guilds,myId)){window.alert("Sei già in una gilda.");return;}
    const guild=guilds[gId]; if(!guild) return;
    const already=(guild.joinRequests||[]).find(r=>r.id===myId);
    if(already){window.alert("Hai già inviato una richiesta a questa gilda.");return;}
    const newG={...guild,joinRequests:[...(guild.joinRequests||[]),{id:myId,name:me.name,requestedAt:new Date().toISOString()}]};
    const newGuilds={...guilds,[gId]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    window.alert(`✅ Richiesta inviata a ${guild.name}! Attendi l'approvazione del capo gilda.`);
  }

  async function approveJoinRequest(gId, requesterId, requesterName) {
    const guild=guilds[gId]; if(!guild) return;
    const newG={...guild,
      members:[...(guild.members||[]),{id:requesterId,name:requesterName,role:"member",joinedAt:new Date().toISOString()}],
      joinRequests:(guild.joinRequests||[]).filter(r=>r.id!==requesterId)
    };
    const newGuilds={...guilds,[gId]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    await addMsg(`🏛️ **${requesterName}** è stato accettato nella gilda **${guild.emoji} ${guild.name}**!`,"info","Sistema");
  }

  async function rejectJoinRequest(gId, requesterId) {
    const guild=guilds[gId]; if(!guild) return;
    const newG={...guild,joinRequests:(guild.joinRequests||[]).filter(r=>r.id!==requesterId)};
    const newGuilds={...guilds,[gId]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
  }

  async function leaveGuild() {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    if(myGuild.leaderId===myId&&myGuild.members.length>1){window.alert("Sei il capo: trasferisci il ruolo prima di uscire.");return;}
    if(!window.confirm(`Uscire dalla gilda ${myGuild.name}?`)) return;
    const newMem=myGuild.members.filter(m=>m.id!==myId);
    const newGuilds={...guilds};
    if(newMem.length===0) delete newGuilds[myGuild.id];
    else newGuilds[myGuild.id]={...myGuild,members:newMem,leaderId:newMem[0].id};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
  }

  async function donateToGuild() {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild||!me) return;
    const amount=Math.max(10,Math.floor(Number(guildDonate)||100));
    if(me.gold<amount){window.alert("Oro insufficiente.");return;}
    const xpGain=Math.floor(amount/10);
    const newXp=(myGuild.xp||0)+xpGain;
    const newG={...myGuild,xp:newXp,level:getGuildLevel(newXp)};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds);
    const upd={...me,gold:me.gold-amount}; await dbSavePlayer(upd); setMeRaw(upd);
    setGuilds(newGuilds);
    await addMsg(`💰 **${me.name}** dona **${amount} oro** alla gilda → **+${xpGain} XP gilda**!`,"info","Sistema");
  }

  async function depositItem(entry) {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    await dbDepositToGuild(myGuild.id, entry.rowId);
    await Promise.all([refreshInventory(me), refreshWarehouse(myGuild.id)]);
  }

  async function withdrawItem(warehouseEntry) {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    await dbWithdrawFromGuild(myGuild.id, warehouseEntry.rowId, myId);
    await Promise.all([refreshInventory(me), refreshWarehouse(myGuild.id)]);
  }

  async function addGuildXP(amount) {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild||amount<=0) return;
    const newXp=(myGuild.xp||0)+amount;
    const newG={...myGuild,xp:newXp,level:getGuildLevel(newXp)};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
  }

  async function sendGuildChat() {
    const myGuild=getPlayerGuild(guilds,myId);
    if(!myGuild||!guildChatInput.trim()) return;
    await dbSendMessage({ party_code:"guild_"+myGuild.id, author:me.name, content:guildChatInput.trim(), type:"guild_chat" });
    setGuildChatInput("");
  }

  async function createGuildMission() {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    if(!guildMissionForm.title.trim()){window.alert("Inserisci un titolo.");return;}
    const mission = { id:`gm_${Date.now()}`, title:guildMissionForm.title.trim(), desc:guildMissionForm.desc.trim(), goal:Math.max(1,guildMissionForm.goal), progress:0, rewardGold:Math.max(0,guildMissionForm.rewardGold), rewardXp:Math.max(0,guildMissionForm.rewardXp), completed:false, assignedBy:me.name, createdAt:new Date().toISOString() };
    const newMissions=[...(myGuild.missions||[]),mission];
    const newG={...myGuild,missions:newMissions};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    setGuildMissionForm({title:"",desc:"",goal:1,rewardGold:0,rewardXp:50}); setShowMissionForm(false);
  }

  async function contributeGuildMission(missionId) {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    const wasCompleted=!!(myGuild.missions||[]).find(m=>m.id===missionId)?.completed;
    const missions=(myGuild.missions||[]).map(m=>{
      if(m.id!==missionId||m.completed) return m;
      const newProgress=m.progress+1;
      const completed=newProgress>=m.goal;
      return {...m,progress:newProgress,completed,completedAt:completed?new Date().toISOString():undefined};
    });
    const justCompleted=!wasCompleted ? missions.find(m=>m.id===missionId&&m.completed) : null;
    let newG={...myGuild,missions};
    if(justCompleted) { const newXp=(myGuild.xp||0)+(justCompleted.rewardXp||0); newG={...newG,xp:newXp,level:getGuildLevel(newXp)}; }
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    if(justCompleted) {
      if((justCompleted.rewardGold||0)>0) {
        const upd={...me,gold:(me.gold||0)+justCompleted.rewardGold}; await dbSavePlayer(upd); setMeRaw(upd);
      }
      await addMsg(`🎯 **Missione di gilda completata!** "${justCompleted.title}" — +${justCompleted.rewardXp} XP gilda${justCompleted.rewardGold>0?` +${justCompleted.rewardGold}🪙`:""}!`,"info","Gilda");
    }
  }

  async function deleteGuildMission(missionId) {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    const missions=(myGuild.missions||[]).filter(m=>m.id!==missionId);
    const newG={...myGuild,missions};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
  }

  async function kickMember(memberId) {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    if(memberId===myId){window.alert("Non puoi espellere te stesso.");return;}
    const target=myGuild.members.find(m=>m.id===memberId); if(!target) return;
    if(!window.confirm(`Espellere ${target.name} dalla gilda?`)) return;
    const newMem=myGuild.members.filter(m=>m.id!==memberId);
    const newG={...myGuild,members:newMem};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    await addMsg(`⚖️ **${target.name}** è stato espulso dalla gilda!`,"info","Sistema");
  }

  async function postBulletin() {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    if(!bulletinInput.trim()) return;
    const entry = { id:`bull_${Date.now()}`, text:bulletinInput.trim(), author:me.name, createdAt:new Date().toISOString() };
    const newBulletin=[entry,...(myGuild.bulletin||[])].slice(0,20);
    const newG={...myGuild,bulletin:newBulletin};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    setBulletinInput(""); setShowBulletinForm(false);
  }

  async function deleteBulletin(entryId) {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    const newBulletin=(myGuild.bulletin||[]).filter(b=>b.id!==entryId);
    const newG={...myGuild,bulletin:newBulletin};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
  }

  async function inviteByCode() {
    const myGuild=getPlayerGuild(guilds,myId); if(!myGuild) return;
    const raw=guildInviteCode.trim();
    if(!raw){window.alert("Inserisci un codice o seleziona dalla lista.");return;}
    const codeLower=raw.toLowerCase(); const codeUpper=raw.toUpperCase();
    const target=worldPlayers.find(p=>p.partyCode===codeUpper||p.id===codeLower||p.id===raw);
    if(!target){window.alert("Nessun giocatore trovato con questo codice.");return;}
    if(myGuild.members.find(m=>m.id===target.id)){window.alert(`${target.name} è già nella gilda.`);return;}
    if(getPlayerGuild(guilds,target.id)){window.alert(`${target.name} è già in un'altra gilda.`);return;}
    const newMem=[...(myGuild.members||[]),{id:target.id,name:target.name,role:"member",joinedAt:new Date().toISOString()}];
    const newG={...myGuild,members:newMem};
    const newGuilds={...guilds,[myGuild.id]:newG};
    await dbSaveAllGuilds(newGuilds); setGuilds(newGuilds);
    setGuildInviteCode(""); setShowGuildInvite(false);
    await addMsg(`🏛️ **${target.name}** è entrato nella gilda **${myGuild.emoji} ${myGuild.name}**!`,"info","Sistema");
  }

  async function saveQState(newQs) {
    await dbSavePartyState(code, newQs);
    setQs(newQs);
  }
  async function resolveCombatNoActionablePlayers(latestState, combatants) {
    const soloCombatant = (combatants || []).find(c => c?.isPlayer && c.id === myId);
    const activeCombatPlayerCount = (combatants || []).filter(c => c?.isPlayer).length;
    if(activeCombatPlayerCount <= 1 && soloCombatant?.stable && !soloCombatant?.dead) {
      const recoveredPlayer = { ...me, hp:1 };
      await dbSavePlayer(recoveredPlayer);
      setMeRaw(recoveredPlayer);
      await dbSavePartyState(code, { ...latestState, combat:null });
      setQs(prev => ({ ...prev, combat:null }));
      await dbSendMessage({
        party_code: code,
        author: "Sistema",
        type: "victory",
        content: `🕯️ **${soloCombatant.name}** si stabilizza e riesce a strisciare fuori dalla battaglia. Il combattimento termina, e l'eroe torna a **1 HP**.`,
      });
      return;
    }
    await dbSavePartyState(code, { ...latestState, combat:null });
    setQs(prev => ({ ...prev, combat:null }));
    // Save defeat to battle history
    if(me) {
      const oldStats = me.stats || {};
      const defeatEntry = {
        date: new Date().toISOString(),
        result: "defeat",
        questName: latestState?.active ? (getQuests().find(q => q.id === latestState.currentId)?.title || null) : null,
        enemies: (combatants||[]).filter(c=>!c.isPlayer&&c.hp>0).map(m=>`${m.emoji||''} ${m.name}`),
        myDmg: (latestState?.questDmgLog?.[myId]?.dmg) || 0,
        xpGained: 0,
        goldGained: 0,
        rounds: latestState?.combat?.round || 1,
      };
      const newStats = { ...oldStats, battleHistory: [defeatEntry, ...(oldStats.battleHistory||[])].slice(0,10) };
      const upd = { ...me, stats: newStats };
      await dbSavePlayer(upd); setMeRaw(upd);
    }
    await dbSendMessage({
      party_code: code,
      author: "Sistema",
      type: "combat",
      content: "⚔️ **Sconfitta.** Nessun eroe è più in grado di combattere.",
    });
  }

  async function persistPlayerWithEquipment(nextPlayer, nextEquipment) {
    const synced = applyEquipmentToPlayer(nextPlayer, nextEquipment, itemMap);
    await dbSavePlayer(synced);
    setMeRaw(synced);
    setEquipment(nextEquipment);
    saveStoredEquipment(myId, nextEquipment);
    return synced;
  }

  async function buyItem(item) {
    if(!me) return;
    if(me.gold < (item.price||0)) { window.alert("Non hai abbastanza oro."); return; }
    if(!window.confirm(`Acquistare ${item.name} per ${item.price} oro?`)) return;
    await dbAddPlayerItem(me.id, item.id);
    const updatedPlayer = { ...me, gold: me.gold - (item.price || 0) };
    const synced = applyEquipmentToPlayer(updatedPlayer, equipment, itemMap);
    await dbSavePlayer(synced);
    setMeRaw(synced);
    await refreshInventory(synced);
    await addMsg(`🎒 **${me.name}** acquista **${item.name}** per ${item.price} oro.`, "info", "Sistema");
  }

  async function handleForge(group) {
    if(!me?.id || inventoryLoading) return;
    const currentDieIdx = FORGE_DIE_PROGRESSION.indexOf(group.item.weapon_die);
    if(currentDieIdx < 0 || currentDieIdx >= 14) return;
    if(group.quantity < 2) return;
    const targetDieIdx = currentDieIdx + 1;
    const matId = FORGE_MATERIAL_REQ[targetDieIdx - 1];
    const matEntries = inventory.filter(e => e.itemId === matId);
    if(!matEntries.length) { window.alert(`Manca il materiale richiesto.`); return; }
    const matName = catalogItems.find(i => i.id === matId)?.name || matId;
    const nextItemId = getNextForgeItemId(group.itemId);
    const nextItem = catalogItems.find(i => i.id === nextItemId);
    const nextName = nextItem?.name || `${group.item.name} +${getForgeLevel(group.itemId)+1}`;
    if(!window.confirm(`⚒️ Forgiare:\n2× ${group.item.name}\n+ 1× ${matName}\n→ ${nextName} (${FORGE_DIE_PROGRESSION[currentDieIdx]} → ${FORGE_DIE_PROGRESSION[targetDieIdx]})?`)) return;
    const [rowId1, rowId2] = group.rowIds;
    const matRowId = matEntries[0].rowId;
    setInventoryLoading(true);
    try {
      await dbRemovePlayerItem(rowId1);
      await dbRemovePlayerItem(rowId2);
      await dbRemovePlayerItem(matRowId);
      await dbAddPlayerItem(me.id, nextItemId);
      await refreshInventory(me);
      await addMsg(`⚒️ **${me.name}** ha forgiato **${nextName}**! (${FORGE_DIE_PROGRESSION[currentDieIdx]} → ${FORGE_DIE_PROGRESSION[targetDieIdx]})`, "info", "Forgia");
    } finally {
      setInventoryLoading(false);
    }
  }

  /* ─── Dungeon handlers ─── */
  async function handleDungeonRoomAction(room, action, optionIdx) {
    if (!code || !qs?.dungeon?.active) return;
    const dungeon = qs.dungeon;
    if (room.idx !== dungeon.currentRoom) return;

    if (action === 'combat') {
      // Start combat with room monsters — pendingCombatRoom tracks which room to clear on win
      const updDungeon = { ...dungeon, pendingCombatRoom: room.idx };
      await dbSavePartyState(code, { ...qs, dungeon: updDungeon });
      setQs(prev => ({ ...prev, dungeon: updDungeon }));
      await startCombatStepRef.current({ monsters: room.monsters });
      return;
    }

    if (action === 'trap') {
      const stat = me?.[room.skillStat] || 0;
      const roll20 = Math.floor(Math.random() * 20) + 1;
      const total = roll20 + stat;
      const passed = total >= room.dc;
      let msg = `⚠️ **${me?.name}** affronta la trappola (${room.skillLabel}): tiro ${roll20} + ${stat} = **${total}** vs DC ${room.dc} → ${passed ? '✅ Superata!' : `❌ Fallita! (-${room.failDmg} HP)`}`;
      if (!passed) {
        const newHp = Math.max(1, (me?.hp||1) - room.failDmg);
        const upd = { ...me, hp: newHp };
        await dbSavePlayer(upd); setMeRaw(upd);
      }
      await addMsg(msg, 'combat', 'Dungeon');
      await _advanceDungeonRoom(dungeon, room.idx);
      return;
    }

    if (action === 'treasure') {
      const freshPlayers = await dbGetPlayers(code);
      const count = Math.max(1, freshPlayers.length);
      const each = Math.floor((room.gold||0) / count);
      const xpBonus = room.xpBonus || 0;
      for (const p of freshPlayers) {
        const upd = { ...p, gold: (p.gold||0) + each, xp: (p.xp||0) + xpBonus };
        await dbSavePlayer(upd);
        if (p.id === myId) setMeRaw(upd);
      }
      const xpMsg = xpBonus > 0 ? ` · +${xpBonus} ⭐ XP` : '';
      await addMsg(`💰 **Tesoro!** Ogni avventuriero riceve **${each} oro**${xpMsg}.`, 'info', 'Dungeon');
      await _advanceDungeonRoom(dungeon, room.idx);
      return;
    }

    if (action === 'rest') {
      const freshPlayers = await dbGetPlayers(code);
      for (const p of freshPlayers) {
        const heal = Math.floor((p.maxHp||1) * (room.healPct||25) / 100);
        const upd = { ...p, hp: Math.min(p.maxHp||1, (p.hp||0) + heal) };
        await dbSavePlayer(upd);
        if (p.id === myId) setMeRaw(upd);
      }
      await addMsg(`🔥 **Riposo!** Il gruppo recupera **${room.healPct}%** degli HP massimi.`, 'info', 'Dungeon');
      await _advanceDungeonRoom(dungeon, room.idx);
      return;
    }

    if (action === 'choice') {
      const opt = room.options?.[optionIdx];
      if (!opt) return;
      let effectMsg = '';
      if (opt.effect === 'gold' || opt.effect === 'gold_big') {
        const freshPlayers = await dbGetPlayers(code);
        const each = Math.floor((opt.effectValue||0) / Math.max(1, freshPlayers.length));
        for (const p of freshPlayers) { const upd={...p,gold:(p.gold||0)+each}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `+${each} oro a testa`;
      } else if (opt.effect === 'xp') {
        const freshPlayers = await dbGetPlayers(code);
        const each = Math.floor((opt.effectValue||0) / Math.max(1, freshPlayers.length));
        for (const p of freshPlayers) { const upd={...p,xp:(p.xp||0)+each}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `+${each} XP a testa`;
      } else if (opt.effect === 'heal_pct') {
        const freshPlayers = await dbGetPlayers(code);
        for (const p of freshPlayers) { const heal=Math.floor((p.maxHp||1)*(opt.effectValue||0)/100); const upd={...p,hp:Math.min(p.maxHp||1,(p.hp||0)+heal)}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `+${opt.effectValue}% HP`;
      } else if (opt.effect === 'dmg_pct') {
        const freshPlayers = await dbGetPlayers(code);
        for (const p of freshPlayers) { const dmg=Math.floor((p.maxHp||1)*(opt.effectValue||0)/100); const upd={...p,hp:Math.max(1,(p.hp||0)-dmg)}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `-${opt.effectValue}% HP`;
      }
      await addMsg(`🔀 **Bivio** — *${opt.label}*: ${opt.desc}${effectMsg?' · '+effectMsg:''}`, 'info', 'Dungeon');
      await _advanceDungeonRoom(dungeon, room.idx);
      return;
    }

    if (action === 'riddle') {
      const playerAnswer = (optionIdx || '').toString().trim().toLowerCase();
      const correct = (room.answer||'').trim().toLowerCase();
      const passed = playerAnswer === correct;
      if (passed) {
        const freshPlayers = await dbGetPlayers(code);
        for (const p of freshPlayers) { const upd={...p,xp:(p.xp||0)+(room.xpReward||0)}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        await addMsg(`🧩 **Enigma risolto!** +${room.xpReward} ⭐ XP al gruppo!`, 'info', 'Dungeon');
      } else {
        if ((room.failDmg||0) > 0) {
          const freshPlayers = await dbGetPlayers(code);
          for (const p of freshPlayers) { const upd={...p,hp:Math.max(1,(p.hp||0)-room.failDmg)}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
          await addMsg(`🧩 **Risposta sbagliata!** Il gruppo subisce **${room.failDmg} danni**.`, 'combat', 'Dungeon');
        } else {
          await addMsg(`🧩 **Risposta sbagliata.** Il gruppo passa oltre deluso.`, 'info', 'Dungeon');
        }
      }
      await _advanceDungeonRoom(dungeon, room.idx);
      return;
    }

    if (action === 'event') {
      const freshPlayers = await dbGetPlayers(code);
      let effectMsg = '';
      if (room.effect === 'xp') {
        const each = Math.floor((room.effectValue||0) / Math.max(1, freshPlayers.length));
        for (const p of freshPlayers) { const upd={...p,xp:(p.xp||0)+each}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `+${each} XP`;
      } else if (room.effect === 'gold') {
        const each = Math.floor((room.effectValue||0) / Math.max(1, freshPlayers.length));
        for (const p of freshPlayers) { const upd={...p,gold:(p.gold||0)+each}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `+${each} 💰`;
      } else if (room.effect === 'heal_pct') {
        for (const p of freshPlayers) { const heal=Math.floor((p.maxHp||1)*(room.effectValue||0)/100); const upd={...p,hp:Math.min(p.maxHp||1,(p.hp||0)+heal)}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `+${room.effectValue}% HP`;
      } else if (room.effect === 'dmg_pct') {
        for (const p of freshPlayers) { const dmg=Math.floor((p.maxHp||1)*(room.effectValue||0)/100); const upd={...p,hp:Math.max(1,(p.hp||0)-dmg)}; await dbSavePlayer(upd); if(p.id===myId) setMeRaw(upd); }
        effectMsg = `-${room.effectValue}% HP`;
      }
      await addMsg(`📖 **${room.title}** — ${room.desc}${effectMsg?' · '+effectMsg:''}`, 'info', 'Dungeon');
      await _advanceDungeonRoom(dungeon, room.idx);
      return;
    }

    if (action === 'shrine') {
      const cost = room.hpCost || 10;
      if ((me?.hp||0) <= cost) { await addMsg(`🕯️ **Altare** — non hai abbastanza HP per il sacrificio (richiede ${cost} HP).`, 'info', 'Dungeon'); return; }
      const upd = { ...me, hp: (me.hp||0) - cost };
      await dbSavePlayer(upd); setMeRaw(upd);
      // Store buff in qs so combat can apply it
      const buffKey = `shrine_${room.id}`;
      const shrineBuffs = { ...(qs.shrineBuffs||{}), [myId]: { stat: room.buffStat, amount: room.buffAmount, source: buffKey } };
      await dbSavePartyState(code, { ...qs, shrineBuffs });
      setQs(prev => ({ ...prev, shrineBuffs }));
      const statLabel = {atk:'ATK',def:'DEF',mag:'MAG'}[room.buffStat]||room.buffStat;
      await addMsg(`🕯️ **${me?.name}** sacrifica **${cost} HP** all'altare → **+${room.buffAmount} ${statLabel}** per il prossimo combattimento!`, 'info', 'Dungeon');
      await _advanceDungeonRoom(dungeon, room.idx);
      return;
    }
  }

  async function _advanceDungeonRoom(dungeon, clearedIdx) {
    const newRooms = dungeon.rooms.map((r, i) => i === clearedIdx ? { ...r, cleared:true } : r);
    const nextRoom = clearedIdx + 1;
    const allDone = newRooms.every(r => r.cleared);
    const updDungeon = { ...dungeon, rooms:newRooms, currentRoom: Math.min(nextRoom, dungeon.rooms.length - 1), pendingCombatRoom:null, ...(allDone ? { completedAt:new Date().toISOString() } : {}) };
    await dbSavePartyState(code, { ...qs, dungeon: updDungeon });
    setQs(prev => ({ ...prev, dungeon: updDungeon }));
    if (allDone) await addMsg(`🏆 **DUNGEON COMPLETATO!** ${dungeon.name} — tutti i nemici sconfitti, tutti i segreti svelati!`, 'victory', 'Sistema');
  }

  /* ─── Daily event claim ─── */
  async function handleClaimDailyEvent() {
    if (!me?.id || !code) return;
    const today = new Date().toLocaleDateString('en-CA');
    const event = generateDailyEvent(code, today);
    const prevClaimed = qs?.dailyEvent?.claimedBy || [];
    if (prevClaimed.includes(myId)) return;
    const newClaimed = [...prevClaimed, myId];
    let effectMsg = '';
    if (event.effect === 'gold') {
      const upd = { ...me, gold: (me.gold||0) + (event.value||0) };
      await dbSavePlayer(upd); setMeRaw(upd);
      effectMsg = `+${event.value} 💰 oro`;
    } else if (event.effect === 'xp') {
      const upd = { ...me, xp: (me.xp||0) + (event.value||0) };
      await dbSavePlayer(upd); setMeRaw(upd);
      effectMsg = `+${event.value} ⭐ XP`;
    } else if (event.effect === 'heal_pct') {
      const heal = Math.floor((me.maxHp||1) * Math.abs(event.value) / 100);
      const newHp = event.value < 0 ? Math.max(1, (me.hp||1) - heal) : Math.min(me.maxHp||1, (me.hp||0) + heal);
      const upd = { ...me, hp: newHp };
      await dbSavePlayer(upd); setMeRaw(upd);
      effectMsg = event.value < 0 ? `-${heal} HP` : `+${heal} HP`;
    }
    const updEvent = { eventId: event.id, date: today, claimedBy: newClaimed };
    await dbSavePartyState(code, { ...qs, dailyEvent: updEvent });
    setQs(prev => ({ ...prev, dailyEvent: updEvent }));
    if (effectMsg) await addMsg(`${event.emoji} **${me.name}** — ${event.title}: ${effectMsg}`, 'info', 'Evento Giornaliero');
  }

  async function equipItem(entry) {
    const slot = itemSlot(entry?.item);
    if(!slot || !me) return;
    const nextEquipment = { ...equipment, [slot]: entry.itemId };
    const synced = await persistPlayerWithEquipment(me, nextEquipment);
    await refreshInventory(synced);
    await addMsg(`🎽 **${me.name}** equipaggia **${entry.item.name}**.`, "info", "Sistema");
  }

  async function unequipItem(slot) {
    if(!me) return;
    const currentItem = itemMap.get(equipment?.[slot]);
    if(!currentItem) return;
    const nextEquipment = { ...equipment, [slot]: null };
    const synced = await persistPlayerWithEquipment(me, nextEquipment);
    await refreshInventory(synced);
    await addMsg(`🎽 **${me.name}** rimuove **${currentItem.name}**.`, "info", "Sistema");
  }

  function handleInventorySelect(group) {
    setSelectedInventoryItemId(group?.item?.id || null);
  }

  function handleInventoryClose() {
    setSelectedInventoryItemId(null);
  }

  async function handleInventorySell(group) {
    if(!group?.item || !group?.entries?.length || !me) return;
    const sellPrice = Math.max(1, Math.floor((group.item.price || 0) / 2));
    if(!window.confirm(`Vendere ${group.item.name} per ${sellPrice} oro?`)) return;

    const entryToSell = group.entries[0];
    const slot = itemSlot(group.item);
    const isEquipped = !!slot && equipment?.[slot] === group.item.id;
    const nextEquipment = isEquipped && group.quantity <= 1
      ? { ...equipment, [slot]: null }
      : equipment;
    const updatedPlayer = { ...me, gold: (me.gold || 0) + sellPrice };

    await dbRemovePlayerItem(entryToSell.rowId);

    let syncedPlayer = updatedPlayer;
    if(nextEquipment !== equipment) {
      syncedPlayer = await persistPlayerWithEquipment(updatedPlayer, nextEquipment);
    } else {
      await dbSavePlayer(updatedPlayer);
      setMeRaw(updatedPlayer);
    }

    await refreshInventory(syncedPlayer);
    await addMsg(`💰 **${me.name}** vende **${group.item.name}** per ${sellPrice} oro.`, "info", "Sistema");
  }

  // ── STORY FUNCTIONS ─────────────────────────────────────────
  const [customStories, setCustomStories] = useState([]);
  useEffect(() => {
    supabase.from("party_state").select("combat").eq("party_code","__story_library__").maybeSingle()
      .then(({ data }) => { if(data?.combat?.stories) setCustomStories(data.combat.stories); }).catch(()=>{});
  }, []);
  function getStory(id) {
    // Check preview story embedded in storyState first
    if(qs?.story?._previewStory?.id === id) return qs.story._previewStory;
    return STORIES.find(s => s.id === id) || customStories.find(s => s.id === id) || null;
  }
  const storyState = qs?.story || null;
  const activeStory = storyState?.active ? getStory(storyState.storyId) : null;
  const activeStoryScene = activeStory ? activeStory.scenes?.[storyState.currentSceneId] : null;
  const isStoryLeader = storyState?.mode === "solo"
    ? storyState?.soloPlayerId === myId
    : (partyPlayers.length === 0 || partyPlayers[0]?.id === myId);

  async function startStory(storyId, mode = "party") {
    const story = getStory(storyId);
    if(!story || !code) return;
    const firstChapter = story.chapters[0];
    const firstSceneId = firstChapter?.startScene;
    const newStory = {
      active:true, storyId,
      mode,
      soloPlayerId: mode === "solo" ? myId : null,
      currentChapterId: firstChapter?.id,
      currentSceneId: firstSceneId,
      storyFlags: {},
      choiceLog: [],
      visitedScenes: [firstSceneId].filter(Boolean),
      rewardCollected: [],
      votes: {},
      battlePending:false, battleNext:null, battleNextFail:null,
      startedAt:Date.now(),
    };
    const latestQs = await dbGetPartyState(code);
    await dbSavePartyState(code, { ...latestQs, story: newStory });
    const firstScene = story.scenes?.[firstSceneId];
    await addMsg(`📖 **La storia inizia**: ${story.emoji} *${story.title}*\n*${firstScene?.title||""}*`, "narration", "Master");
  }

  async function stopStory() {
    if(!code) return;
    const latestQs = await dbGetPartyState(code);
    await dbSavePartyState(code, { ...latestQs, story: { active:false } });
    await addMsg(`📖 Storia interrotta dal Master.`, "info", "Sistema");
  }

  // outcomeType: "success" | "partial" | "defeat"
  async function _applySceneRewards(scene, freshPlayers, outcomeType = "success") {
    if(!scene?.rewards) return;
    const mult = outcomeType === "success" ? 1 : outcomeType === "partial" ? 0.3 : 0;
    if(mult === 0) return;
    const count = Math.max(freshPlayers.length, 1);
    const xpEach = Math.floor((scene.rewards.xp || 0) * mult / count);
    const goldEach = mult === 1 ? Math.floor((scene.rewards.gold || 0) / count) : 0;
    if(xpEach > 0 || goldEach > 0) {
      for(const p of freshPlayers) {
        const up = { ...p, xp:(p.xp||0)+xpEach, gold:(p.gold||0)+goldEach };
        await dbSavePlayer(up);
        if(p.id === myId) setMeRaw(up);
      }
      await addMsg(`💰 ${xpEach>0?`+${xpEach} XP`:''} ${goldEach>0?`+${goldEach} oro`:''} a testa.`, "victory", "Sistema");
    }
  }

  async function advanceStoryScene(nextSceneId, mergeFlags = {}) {
    if(!code || !activeStory || !storyState) return;
    const latestQs = await dbGetPartyState(code);

    if(!nextSceneId) {
      // Terminal scene with no nextScene — close story
      const scene = activeStory.scenes?.[storyState.currentSceneId];
      const sceneType = scene?.type;
      const outcomeType = sceneType === "gameOver" ? "defeat"
        : (scene?.outcomeType || "success");

      if(sceneType === "gameOver") {
        await addMsg(`💀 **Missione fallita**: *${activeStory.title}*\nIl party è stato sconfitto. I personaggi sopravvivono ma tornano a mani vuote.`, "danger", "Sistema");
      } else if(outcomeType === "partial") {
        const freshPlayers = await dbGetPlayers(code);
        await _applySceneRewards(scene, freshPlayers, "partial");
        await addMsg(`📖 **Storia conclusa** (esito parziale): *${activeStory.title}*\nIl party porta a casa qualcosa, ma non tutto è andato come sperato.`, "info", "Sistema");
      } else {
        const freshPlayers = await dbGetPlayers(code);
        await _applySceneRewards(scene, freshPlayers, "success");
        await addMsg(`🏆 **Storia conclusa**: *${activeStory.title}*`, "victory", "Sistema");
      }

      await dbSavePartyState(code, { ...latestQs, story: { active:false, lastCompleted: storyState.storyId, lastOutcome: outcomeType } });
      setQs(prev => ({ ...prev, story: { active:false } }));
      return;
    }

    const nextScene = activeStory.scenes?.[nextSceneId];
    const newFlags = { ...(latestQs.story?.storyFlags||{}), ...mergeFlags, ...(nextScene?.setFlags||{}) };
    const visited = [...new Set([...(latestQs.story?.visitedScenes||[]), nextSceneId])];

    let updatedStory = {
      ...latestQs.story,
      currentSceneId: nextSceneId,
      currentChapterId: nextScene?.chapterId || latestQs.story?.currentChapterId,
      storyFlags: newFlags,
      visitedScenes: visited,
    };

    // Auto-apply rewards on reward nodes
    if(nextScene?.type === "reward" && !latestQs.story?.rewardCollected?.includes(nextSceneId)) {
      const freshPlayers = await dbGetPlayers(code);
      await _applySceneRewards(nextScene, freshPlayers, "success");
      updatedStory.rewardCollected = [...(updatedStory.rewardCollected||[]), nextSceneId];
      if(nextScene.nextScene) {
        await dbSavePartyState(code, { ...latestQs, story: updatedStory });
        await advanceStoryScene(nextScene.nextScene, nextScene.setFlags||{});
        return;
      }
    }

    // Auto-close on terminal nodes with no nextScene
    if((nextScene?.type === "ending" || nextScene?.type === "gameOver") && !nextScene?.nextScene) {
      await dbSavePartyState(code, { ...latestQs, story: updatedStory });
      setQs(prev => ({ ...prev, story: updatedStory }));
      // Let StoryView render the ending/gameOver, user clicks "Chiudi"
      return;
    }

    await dbSavePartyState(code, { ...latestQs, story: updatedStory });
    if(nextScene) await addMsg(`📖 *${nextScene.title}*`, "narration", "Master");
    setQs(prev => ({ ...prev, story: updatedStory }));
  }

  async function makeStoryChoice(choiceIdx) {
    if(!activeStory || !activeStoryScene || !storyState) return;
    const choice = activeStoryScene.choices?.[choiceIdx];
    if(!choice) return;
    const choiceText = choice.text || "";
    const latestQs = await dbGetPartyState(code);
    const newLog = [...(storyState.choiceLog||[]), {
      sceneId: storyState.currentSceneId, sceneTitle: activeStoryScene.title,
      choiceIdx, choiceText, at: Date.now()
    }];
    await dbSavePartyState(code, { ...latestQs, story: { ...latestQs.story, choiceLog: newLog } });
    await addMsg(`🔀 **${me?.name}** sceglie: *${choiceText}*`, "info", "Sistema");
    await advanceStoryScene(choice.nextScene, choice.setFlags||{});
  }

  async function castStoryVote(choiceIdx) {
    if(!code || !me || !activeStory || !activeStoryScene) return;
    const latestQs = await dbGetPartyState(code);
    const currentVotes = { ...(latestQs.story?.votes || {}), [myId]: choiceIdx };
    const updatedStory = { ...latestQs.story, votes: currentVotes };
    await dbSavePartyState(code, { ...latestQs, story: updatedStory });
    setQs(prev => ({ ...prev, story: updatedStory }));
    // Auto-resolve when all party members voted
    const total = partyPlayers.length || 1;
    if(Object.keys(currentVotes).length >= total) {
      const tally = {};
      Object.values(currentVotes).forEach(idx => { tally[idx] = (tally[idx]||0)+1; });
      const winnerIdx = parseInt(Object.entries(tally).sort((a,b)=>b[1]-a[1])[0][0]);
      const choice = activeStoryScene.choices?.[winnerIdx];
      if(!choice) return;
      const votes = Object.entries(tally).map(([i,n])=>`${activeStoryScene.choices[i]?.text}: ${n}🗳️`).join(" · ");
      const freshQs = await dbGetPartyState(code);
      const newLog = [...(freshQs.story?.choiceLog||[]), {
        sceneId: storyState.currentSceneId, sceneTitle: activeStoryScene.title,
        choiceIdx: winnerIdx, choiceText: choice.text, at: Date.now()
      }];
      await dbSavePartyState(code, { ...freshQs, story: { ...freshQs.story, choiceLog: newLog, votes: {} } });
      await addMsg(`🗳️ **Voto maggioranza**: *${choice.text}* (${votes})`, "info", "Sistema");
      await advanceStoryScene(choice.nextScene, choice.setFlags||{});
    }
  }

  async function makeStorySkillCheck(scene) {
    if(!code || !me || !activeStory || !scene?.skillCheck) return;
    const { stat, dc, successScene, failureScene, successText, failureText } = scene.skillCheck;
    const roll = Math.floor(Math.random()*20) + 1;
    const statVal = me[stat] || 0;
    const total = roll + statVal;
    const success = total >= dc;
    const resultText = success
      ? `🎲 Prova di ${stat.toUpperCase()} — tiro ${roll}+${statVal}=${total} vs DC${dc}: **SUCCESSO!** ${successText||""}`
      : `🎲 Prova di ${stat.toUpperCase()} — tiro ${roll}+${statVal}=${total} vs DC${dc}: *Fallimento.* ${failureText||""}`;
    await addMsg(resultText, "info", "Sistema");
    await advanceStoryScene(success ? successScene : failureScene);
  }

  async function startStoryCombat(scene) {
    if(!code || !me || !activeStory || !scene?.combat) return;
    const latestQs = await dbGetPartyState(code);
    if(latestQs.combat?.active) return;
    const partyForCombat = await getOnlinePartyPlayersForCombat(latestQs);
    const playerCombatants = partyForCombat.map(p => ({
      id:p.id, name:p.name, emoji:CLASSES[p.class||"warrior"]?.emoji||"⚔️",
      hp:p.hp, maxHp:p.maxHp||p.max_hp||p.hp||1,
      atk:p.atk+getEquipmentBonuses(getStoredEquipment(p.id),itemMap).bonus_atk,
      def:p.def+getEquipmentBonuses(getStoredEquipment(p.id),itemMap).bonus_def,
      mag:p.mag+getEquipmentBonuses(getStoredEquipment(p.id),itemMap).bonus_mag,
      init:p.init+getEquipmentBonuses(getStoredEquipment(p.id),itemMap).bonus_init,
      isPlayer:true, isSummon:false, dead:false, dying:false, stable:false, deathSuccesses:0, deathFailures:0,
      rollInit: (p.init||0) + Math.floor(Math.random()*20),
    }));
    const monsterCombatants = scene.combat.monsters.map(m => {
      const baseHp = m.maxHp || m.max_hp || m.hp || 10;
      return { ...m, hp:baseHp, maxHp:baseHp, rollInit:(m.init||0)+Math.floor(Math.random()*20) };
    });
    const allCombatants = [...playerCombatants, ...monsterCombatants].sort((a,b)=>b.rollInit-a.rollInit);
    const newCombat = { active:true, combatants:allCombatants, turn:0, round:1, spellSlots:{}, startedAt:Date.now(), questDmgLog:{} };
    const newStory = { ...latestQs.story, battlePending:true, battleNext:scene.combat.successScene, battleNextFail:scene.combat.failureScene||null };
    await dbSavePartyState(code, { ...latestQs, combat:newCombat, story:newStory });
    await addMsg(`⚔️ **${scene.title}** — Inizia il combattimento!`, "combat", "Sistema");
    setTab("combat");
  }

  async function handlePartyTrade(group, targetId, price=0) {
    if(!group?.item || !group?.entries?.length || !me || !code) return;
    const target = partyPlayers.find(p => p.id === targetId);
    if(!target || target.id === me.id) return;
    const tradePrice = Math.max(0, Number(price) || 0);
    if(tradePrice > (target.gold || 0)) {
      window.alert(`${target.name} non ha abbastanza oro.`);
      return;
    }
    const label = tradePrice > 0 ? `${tradePrice} oro` : "gratis";
    if(!window.confirm(`Passare ${group.item.name} a ${target.name} per ${label}?`)) return;

    const entryToTrade = group.entries[0];
    const slot = itemSlot(group.item);
    const isEquippedLastCopy = !!slot && equipment?.[slot] === group.item.id && group.quantity <= 1;
    const nextEquipment = isEquippedLastCopy ? { ...equipment, [slot]: null } : equipment;
    const updatedBuyer = { ...target, gold: (target.gold || 0) - tradePrice };
    let updatedSeller = { ...me, gold: (me.gold || 0) + tradePrice };
    if(isEquippedLastCopy) updatedSeller = applyEquipmentToPlayer(updatedSeller, nextEquipment, itemMap);

    try {
      await dbTransferPlayerItem(entryToTrade.rowId, target.id);
    await dbSavePlayer(updatedBuyer);
    if(isEquippedLastCopy) {
      saveStoredEquipment(myId, nextEquipment);
      setEquipment(nextEquipment);
    }
    await dbSavePlayer(updatedSeller);
    setMeRaw(updatedSeller);
    setSelectedInventoryItemId(null);
    await refreshInventory(updatedSeller);
    await refreshAll(code);
    await addMsg(
      tradePrice > 0
        ? `🤝 **${me.name}** passa **${group.item.name}** a **${target.name}** per **${tradePrice} oro**.`
        : `🤝 **${me.name}** regala **${group.item.name}** a **${target.name}**.`,
      "info",
      "Sistema"
      );
    } catch(e) {
      console.error("Scambio oggetto fallito:", e);
      window.alert(`Scambio fallito: ${e?.message || "errore sconosciuto"}`);
      await refreshInventory(me);
    }
  }

  async function createAuction(group, opts) {
    if(!group?.item || !group.entries?.length || !me) return;
    const startingBid = Math.max(1, Number(opts.startingBid) || 1);
    const buyout = Math.max(0, Number(opts.buyout) || 0);
    if(buyout > 0 && buyout <= startingBid) {
      window.alert("Il compra subito deve essere maggiore della base d'asta.");
      return;
    }
    if(!window.confirm(`Mettere all'asta ${group.item.name} con base ${startingBid} oro?`)) return;
    setAuctionBusy(true);
    try {
      const latest = await dbGetAuctionHouse();
      const entry = group.entries[0];
      const slot = itemSlot(group.item);
      const isEquippedLastCopy = !!slot && equipment?.[slot] === group.item.id && group.quantity <= 1;
      const nextEquipment = isEquippedLastCopy ? { ...equipment, [slot]: null } : equipment;
      let updatedSeller = me;
      await dbRemovePlayerItem(entry.rowId);
      if(isEquippedLastCopy) {
        saveStoredEquipment(myId, nextEquipment);
        setEquipment(nextEquipment);
        updatedSeller = applyEquipmentToPlayer(me, nextEquipment, itemMap);
        await dbSavePlayer(updatedSeller);
        setMeRaw(updatedSeller);
      }
      const auction = {
        id:`auc_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        item:{ ...group.item },
        sellerId:me.id,
        sellerName:me.name,
        sellerParty:code || "",
        startingBid,
        buyout,
        currentBid:0,
        bidderId:null,
        bidderName:"",
        bids:[],
        status:"open",
        createdAt:new Date().toISOString(),
        endsAt:new Date(Date.now() + Math.max(1, Number(opts.durationHours)||24) * 3600000).toISOString(),
      };
      const auctionsNext = [auction, ...(latest.auctions || []).filter(a => a.status !== "settled").slice(0, 80)];
      await dbSaveAuctionHouse({ auctions: auctionsNext });
      setAuctions(auctionsNext);
      await refreshInventory(updatedSeller);
      await addMsg(`🏦 **${me.name}** mette all'asta **${group.item.name}**. Base: **${startingBid} oro**${buyout?` · Compra subito: **${buyout} oro**`:""}.`, "info", "Mercato");
    } catch(e) {
      console.error("Creazione asta fallita:", e);
      window.alert(`Asta fallita: ${e?.message || "errore sconosciuto"}`);
      await refreshInventory(me);
    } finally {
      setAuctionBusy(false);
    }
  }

  async function bidAuction(auction, amount) {
    if(!auction || !me || auction.sellerId === me.id) return;
    const bid = Math.max(1, Math.floor(Number(amount) || 0));
    setAuctionBusy(true);
    try {
      const latest = await dbGetAuctionHouse();
      const current = (latest.auctions || []).find(a => a.id === auction.id);
      if(!current || current.status !== "open") throw new Error("Asta non piu disponibile.");
      if(new Date(current.endsAt).getTime() <= Date.now()) throw new Error("Asta scaduta. Chiudila dalla scheda aste.");
      const rawMinBid = Math.max(Number(current.startingBid || 1), Number(current.currentBid || 0) + Math.max(1, Math.ceil((current.currentBid || current.startingBid || 1) * 0.1)));
      const minBid = current.buyout > 0 ? Math.min(rawMinBid, current.buyout) : rawMinBid;
      if(bid < minBid) throw new Error(`Offerta minima: ${minBid} oro.`);
      const allPlayers = await dbGetPlayers();
      const bidder = allPlayers.find(p => p.id === me.id);
      if(!bidder || (bidder.gold || 0) < bid) throw new Error("Non hai abbastanza oro.");
      const prevBidder = current.bidderId ? allPlayers.find(p => p.id === current.bidderId) : null;
      if(prevBidder) await dbSavePlayer({ ...prevBidder, gold:(prevBidder.gold || 0) + (current.currentBid || 0) });
      const updatedBidder = { ...bidder, gold:(bidder.gold || 0) - bid };
      await dbSavePlayer(updatedBidder);
      if(updatedBidder.id === myId) setMeRaw(updatedBidder);
      const updatedAuction = {
        ...current,
        currentBid:bid,
        bidderId:me.id,
        bidderName:me.name,
        bids:[...(current.bids || []), { bidderId:me.id, bidderName:me.name, amount:bid, at:new Date().toISOString() }].slice(-20),
      };
      const auctionsNext = (latest.auctions || []).map(a => a.id === current.id ? updatedAuction : a);
      await dbSaveAuctionHouse({ auctions: auctionsNext });
      setAuctions(auctionsNext);
      await refreshAll(code);
      await addMsg(`🏦 **${me.name}** offre **${bid} oro** per **${current.item.name}**.`, "info", "Mercato");
    } catch(e) {
      window.alert(`Offerta fallita: ${e?.message || "errore sconosciuto"}`);
    } finally {
      setAuctionBusy(false);
    }
  }

  async function cancelAuction(auction) {
    if(!auction || auction.sellerId !== me?.id) return;
    if(auction.currentBid > 0) {
      window.alert("Non puoi ritirare un'asta che ha gia ricevuto offerte.");
      return;
    }
    setAuctionBusy(true);
    try {
      const latest = await dbGetAuctionHouse();
      const current = (latest.auctions || []).find(a => a.id === auction.id);
      if(!current || current.sellerId !== me.id || current.currentBid > 0) return;
      await dbAddPlayerItem(me.id, current.item.id);
      const auctionsNext = (latest.auctions || []).filter(a => a.id !== current.id);
      await dbSaveAuctionHouse({ auctions: auctionsNext });
      setAuctions(auctionsNext);
      await refreshInventory(me);
      await addMsg(`🏦 **${me.name}** ritira l'asta di **${current.item.name}**.`, "info", "Mercato");
    } catch(e) {
      window.alert(`Ritiro fallito: ${e?.message || "errore sconosciuto"}`);
    } finally {
      setAuctionBusy(false);
    }
  }

  async function settleAuction(auction) {
    if(!auction || !me) return;
    setAuctionBusy(true);
    try {
      const latest = await dbGetAuctionHouse();
      const current = (latest.auctions || []).find(a => a.id === auction.id);
      if(!current || current.status !== "open") return;
      const expired = new Date(current.endsAt).getTime() <= Date.now();
      const boughtOut = current.buyout > 0 && current.currentBid >= current.buyout;
      if(!expired && !boughtOut) throw new Error("L'asta non e ancora conclusa.");
      if(!current.currentBid || !current.bidderId) {
        if(current.sellerId !== me.id) throw new Error("Solo il venditore puo riprendere un'asta senza offerte.");
        await dbAddPlayerItem(current.sellerId, current.item.id);
      } else {
        if(current.sellerId !== me.id && current.bidderId !== me.id) throw new Error("Solo venditore o vincitore possono chiudere questa asta.");
        const allPlayers = await dbGetPlayers();
        const seller = allPlayers.find(p => p.id === current.sellerId);
        if(seller) await dbSavePlayer({ ...seller, gold:(seller.gold || 0) + current.currentBid });
        await dbAddPlayerItem(current.bidderId, current.item.id);
      }
      const auctionsNext = (latest.auctions || []).filter(a => a.id !== current.id);
      await dbSaveAuctionHouse({ auctions: auctionsNext });
      setAuctions(auctionsNext);
      await refreshAll(code);
      await refreshInventory(latestMeRef.current);
      await addMsg(current.currentBid
        ? `🏦 Asta conclusa: **${current.item.name}** a **${current.bidderName}** per **${current.currentBid} oro**.`
        : `🏦 Asta conclusa senza offerte: **${current.item.name}** torna a **${current.sellerName}**.`,
        "info", "Mercato");
    } catch(e) {
      window.alert(`Chiusura asta fallita: ${e?.message || "errore sconosciuto"}`);
    } finally {
      setAuctionBusy(false);
    }
  }

  async function usePotion(entry) {
    if(!entry?.rowId || !me) return;
    if(entry.item?.type !== "potion") return;
    if((me.hp || 0) <= 0 || myCombatant?.dying || myCombatant?.dead || myCombatant?.stable) {
      window.alert("Non puoi usare pozioni su te stesso mentre sei a terra o fuori combattimento.");
      return;
    }
    const amount = Math.max(1, entry.item.heal_amount || 0);
    if(amount <= 0) return;
    // Se ci sono compagni, mostra il modal di selezione; altrimenti usa su se stesso
    const validTargets = partyPlayers.filter(p => !p.dead && (p.hp || 0) < (p.max_hp || p.maxHp || 1));
    if(validTargets.length > 1 || (validTargets.length === 1 && validTargets[0].id !== myId)) {
      setPendingHealItem(entry);
      return;
    }
    await applyPotion(entry, me);
  }

  async function applyPotion(entry, targetPlayer) {
    setPendingHealItem(null);
    const amount = Math.max(1, entry.item?.heal_amount || 0);
    const maxHp = targetPlayer.max_hp || targetPlayer.maxHp || targetPlayer.hp;
    const healed = Math.min(maxHp, (targetPlayer.hp || 0) + amount);
    const delta = healed - (targetPlayer.hp || 0);
    await dbRemovePlayerItem(entry.rowId);
    const updatedTarget = { ...targetPlayer, hp: healed, dead: false };
    await dbSavePlayer(updatedTarget);
    if(targetPlayer.id === myId) setMeRaw(updatedTarget);
    if(qs?.combat?.active) {
      const combatants = [...qs.combat.combatants];
      const idx = combatants.findIndex(c => c.id === targetPlayer.id);
      if(idx >= 0) combatants[idx] = reviveCombatantState(combatants[idx], healed);
      await saveQState({ ...qs, combat: { ...qs.combat, combatants } });
    }
    await refreshInventory(me);
    const giver = targetPlayer.id === myId ? "" : ` (da **${me.name}**)`;
    await addMsg(`🧪 **${targetPlayer.name}** usa **${entry.item.name}**${giver} e recupera **${delta} HP**.`, "info", "Sistema");
  }

  async function handleLevelUp() {
    if(!me) return;
    const result = applyLevelUpToPlayer(me);
    if(!result.leveled) {
      window.alert(`Ti servono ${result.needed} XP per il prossimo livello.`);
      return;
    }
    const updated = result.player;
    const { error: saveErr } = await dbSavePlayer(updated);
    if(saveErr) {
      window.alert(`Errore nel salvataggio livello: ${saveErr.message}`);
      return;
    }
    setMeRaw(updated);
    // Clear stale spell slots so the new level's full slots are used immediately
    if(code) {
      const freshQs = await dbGetPartyState(code);
      const newPersist = { ...(freshQs?.persistentSpellSlots || {}) };
      delete newPersist[me.id];
      await saveQState({ ...freshQs, persistentSpellSlots: newPersist });
    }
    await addMsg(`⭐ **${me.name}** sale al **livello ${updated.level}**!\n${levelGainForClass(me.class).label}`, "info", "Sistema");
    if (updated.level === 6 && !updated.subclass) setShowSubclassModal(true);
    await refreshAll(code);
  }

  async function dismissCombatLog() {
    // Always re-fetch — closure qs may be stale and overwrite a newer turn state
    const latestQs = await dbGetPartyState(code);
    if(!latestQs?.combat?.pendingLog) return;
    await dbSavePartyState(code, { ...latestQs, combat: { ...latestQs.combat, pendingLog: null } });
    setQs(prev => ({ ...prev, combat: { ...prev.combat, pendingLog: null } }));
  }

  async function sendBattleChat(text) {
    const trimmed = text?.trim();
    if(!trimmed || !combat?.active) return;
    const entry = { id: Date.now(), author: me?.name || "Eroe", class: me?.class || "warrior", text: trimmed, ts: Date.now() };
    const newChat = [...(qs.battleChat || []), entry].slice(-40);
    await saveQState({ ...qs, battleChat: newChat });
    setBattleChatInput("");
  }

  async function selectSubclass(subclassId) {
    if (!me) return;
    const options = getSubclassOptions(me.class);
    const chosen = options.find(s => s.id === subclassId);
    if (!chosen) return;
    const b = chosen.bonus || {};
    const updated = {
      ...me,
      subclass: subclassId,
      atk: (me.atk || 0) + (b.atk || 0),
      def: (me.def || 0) + (b.def || 0),
      mag: (me.mag || 0) + (b.mag || 0),
      maxHp: (me.maxHp || 0) + (b.maxHp || 0),
      hp: Math.min((me.hp || 0) + (b.maxHp || 0), (me.maxHp || 0) + (b.maxHp || 0)),
    };
    await dbSavePlayer(updated);
    setMeRaw(updated);
    setShowSubclassModal(false);
    await addMsg(`🌟 **${me.name}** sceglie la sottoclasse **${chosen.emoji} ${chosen.name}**! ${chosen.desc}`, "info", "Sistema");
  }

  async function forceNextCombatTurn() {
    if(advanceTurnBusyRef.current) return;
    advanceTurnBusyRef.current = true;
    try {
      const latestQs = await dbGetPartyState(code);
      const latestCombat = latestQs?.combat;
      if(!latestCombat?.active) return;
      if(latestCombat.pendingLog) {
        const newCombat = { ...latestCombat, pendingLog:null };
        await dbSavePartyState(code, { ...latestQs, combat:newCombat });
        setQs(prev => ({ ...prev, combat:newCombat }));
        return;
      }
      const combatants = [...(latestCombat.combatants || [])];
      if(!combatants.length) return;
      const actor = combatants[latestCombat.turn % combatants.length];
      // Active player skips own turn; leader can force-advance any AFK player; leader handles monster turns.
      const firstAlive = combatants.find(c => c.isPlayer && !c.isSummon && !c.dead);
      const amLeader = firstAlive?.id === myId;
      if(actor?.isPlayer) {
        if(actor.id !== myId && !amLeader) return; // not my turn and not the leader
      } else {
        if(!amLeader) return; // only leader handles monster turns
      }
      if(actor && !actor.isPlayer && actor.hp > 0) {
        await doMonsterTurnRef.current?.();
        return;
      }
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, latestCombat.turn, latestCombat.round);
      const skippedName = actor?.name || "il turno";
      const newCombat = {
        ...latestCombat,
        combatants,
        turn:nextTurn,
        round:nextRound,
        pendingLog:`⏭️ **Turno saltato:** ${skippedName}.`,
      };
      await dbSavePartyState(code, { ...latestQs, combat:newCombat });
      setQs(prev => ({ ...prev, combat:newCombat }));
    } finally {
      advanceTurnBusyRef.current = false;
    }
  }
  forceNextTurnRef.current = forceNextCombatTurn;

  async function abandonQuest() {
    const escapeEntry = inventory.find(e => e.itemId === "potion_escape");
    if(!escapeEntry) {
      window.alert("Hai bisogno di una 💨 Pozione di Fuga per scappare dalla battaglia.\nComprala al Negozio per poche monete d'oro.");
      return;
    }
    if(!window.confirm("Vuoi davvero abbandonare la missione?\nQuesta azione consumerà la tua Pozione di Fuga e annullerà il combattimento.")) return;
    await dbRemovePlayerItem(escapeEntry.rowId);
    const playerToSave = (me.hp || 0) <= 0 ? { ...me, hp: 1 } : me;
    if(playerToSave.hp !== me.hp) {
      await dbSavePlayer(playerToSave);
      setMeRaw(playerToSave);
    }
    await saveQState({ ...qs, active: false, step: 0, combat: null });
    await refreshInventory(playerToSave);
    await addMsg(`🏃 **${me.name}** beve la **Pozione di Fuga** e svanisce nell'ombra. La missione è abbandonata.`, "info", "Sistema");
    setTab("quest");
  }

  // -- RIPOSO --
  async function startRest(type) {
    if(combat?.active) return;
    if(!code) return;
    if(qs?.rest?.endsAt && new Date(qs.rest.endsAt) > new Date()) return;
    const isLeader = partyPlayers.length === 0 || partyPlayers[0]?.id === myId;
    if(!isLeader) return;
    const durationMs = type === "short" ? 30 * 60 * 1000 : 60 * 60 * 1000;
    const endsAt = new Date(Date.now() + durationMs).toISOString();
    await saveQState({ ...qs, rest: { type, endsAt, startedBy: myId } });
    const label = type === "short" ? "Riposo Breve (30 minuti)" : "Riposo Lungo (1 ora)";
    await addMsg(`🛌 **${me?.name}** ha avviato un **${label}**. Il gruppo si accampa e recupera le forze...`, "system", "Sistema");
  }

  async function cancelRest() {
    if(!code) return;
    await saveQState({ ...qs, rest: null });
    await addMsg(`⚡ Il riposo è stato interrotto!`, "system", "Sistema");
  }

  // Countdown display + auto-apply when timer expires
  useEffect(() => {
    if(!qs?.rest?.endsAt || !code) { setRestTimeLeft(null); return; }
    let applied = false;
    const applyRest = async () => {
      if(applied) return;
      applied = true;
      const isLeader = partyPlayers.length === 0 || partyPlayers[0]?.id === myId;
      if(!isLeader) return;
      const latestQs = await dbGetPartyState(code);
      if(!latestQs?.rest?.endsAt) return; // already applied
      const type = latestQs.rest.type;
      const allPlayers = await dbGetPlayers(code);
      const newPersistentSlots = { ...(latestQs.persistentSpellSlots || {}) };
      for(const p of allPlayers) {
        const maxSlots = getSpellSlots(p.level || 1);
        if(type === "long") {
          const fullHp = p.maxHp || getBaseStats(p).maxHp || 1;
          const updated = { ...p, hp: fullHp, maxHp: fullHp, dead: false };
          await dbSavePlayer(updated);
          if(p.id === myId) setMeRaw(updated);
          newPersistentSlots[p.id] = { ...maxSlots };
        } else {
          const half = Math.floor((p.max_hp || p.maxHp || p.hp) / 2);
          const healed = Math.min(p.max_hp || p.maxHp || p.hp, (p.hp || 0) + half);
          const updated = { ...p, hp: healed };
          await dbSavePlayer(updated);
          if(p.id === myId) setMeRaw(updated);
          const cur = newPersistentSlots[p.id] || maxSlots;
          const halfRestored = {};
          for(const [lvl, max] of Object.entries(maxSlots)) {
            const used = max - (cur[lvl] || 0);
            halfRestored[lvl] = Math.min(max, (cur[lvl] || 0) + Math.ceil(used / 2));
          }
          newPersistentSlots[p.id] = halfRestored;
        }
      }
      const newLongRestSeed = type === "long" ? (latestQs.longRestSeed || 0) + 1 : (latestQs.longRestSeed || 0);
      const newCompleted = type === "long" ? [] : (latestQs.completed || []);
      const newQuestDmgLog = type === "long" ? {} : (latestQs.questDmgLog || {});
      const restDiaryText = type === "long"
        ? `Il party si accampa per la notte. Al sorgere del sole forze e incantesimi sono completamente ripristinati, e nuove avventure attendono.`
        : `Il party si concede un breve riposo. Metà dei punti vita e degli incantesimi vengono recuperati.`;
      const newDiaryRest = appendDiary(latestQs.partyDiary, { type:'rest', icon: type==='long'?'🌙':'☀️', text: restDiaryText, players: allPlayers.map(p=>p.name) });
      await saveQState({ ...latestQs, rest: null, persistentSpellSlots: newPersistentSlots, longRestSeed: newLongRestSeed, completed: newCompleted, questDmgLog: newQuestDmgLog, partyDiary: newDiaryRest });
      const msg = type === "long"
        ? `🌅 **Riposo Lungo completato!** Il gruppo si risveglia completamente guarito. Tutti gli incantesimi sono ripristinati. Shop e missioni aggiornati!`
        : `☀️ **Riposo Breve completato!** Il gruppo recupera metà dei punti vita e metà degli incantesimi.`;
      await addMsg(msg, "system", "Sistema");
    };
    const tick = () => {
      const ms = new Date(qs.rest.endsAt) - new Date();
      if(ms <= 0) { setRestTimeLeft(null); applyRest(); }
      else {
        const s = Math.ceil(ms / 1000);
        setRestTimeLeft({ mm: Math.floor(s / 60), ss: s % 60 });
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [qs?.rest?.endsAt, code]);  // eslint-disable-line

  // -- COMBATTIMENTO --
  async function doAttack() {
    if(playerAttackBusyRef.current) return;
    playerAttackBusyRef.current = true;
    try {
    // Always re-fetch from DB to avoid stale local state causing duplicate turns
    const freshQs = await dbGetPartyState(code);
    const combat = freshQs?.combat;
    if(!combat?.active || combat.pendingLog) return;
    const combatants = [...combat.combatants];
    const turn = combat.turn % combatants.length;
    const attacker = combatants[turn];
    if(!attacker?.isPlayer || attacker.id!==myId) return;
    if(attacker.dead || attacker.stable) {
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
      await saveQState({ ...freshQs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound, pendingLog: null } });
      return;
    }
    // Process status effects at turn start (stun/death → advance turn; damage only → prepend to attack log)
    let statusPrefixLog = null;
    if ((attacker.statusEffects || []).length > 0) {
      const sfx = processStatusEffects(attacker);
      combatants[turn] = sfx.combatant;
      if (sfx.skipTurn || sfx.died) {
        const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
        await saveQState({ ...freshQs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound, pendingLog: sfx.log } });
        return;
      }
      statusPrefixLog = sfx.log;
    }
    if(isDyingCombatant(combatants[turn])) {
      const latestBuffState = await dbGetPartyState(code);
      const deathSaveBuffs = latestBuffState.masterBuffs || {};
      const deathSaveMyBuffs = deathSaveBuffs[myId] || {};
      if(deathSaveMyBuffs.immortal > 0) {
        const idx = combatants.findIndex(c => c.id === attacker.id);
        combatants[idx] = reviveCombatantState(attacker, 1);
        const updatedPlayer = { ...me, hp:1, dead:false };
        const newMasterBuffs = {
          ...deathSaveBuffs,
          [myId]: { ...deathSaveMyBuffs, immortal: deathSaveMyBuffs.immortal - 1 },
        };
        await dbSavePlayer(updatedPlayer);
        setMeRaw(updatedPlayer);
        const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
        await saveQState({
          ...latestBuffState,
          masterBuffs:newMasterBuffs,
          combat: {
            ...combat,
            combatants,
            turn: nextTurn,
            round: nextRound,
            pendingLog:`🛡️ **${attacker.name}** viene salvato dall'**Immortalità** e torna a **1 HP**! (${deathSaveMyBuffs.immortal - 1} turni rimasti)`,
          },
        });
        return;
      }
      const deathSaveRoll = await showDiceVisual({ sides:20, notation:"1d20", label:"Salvezza contro la morte", themeColor:"#fbbf24" });
      const deathSave = resolveDeathSave(attacker, deathSaveRoll);
      const idx = combatants.findIndex(c => c.id === attacker.id);
      combatants[idx] = deathSave.nextCombatant;
      const survived = deathSave.result === "nat20" || deathSave.result === "revived";
      let updatedPlayer = { ...me, hp: deathSave.nextCombatant.hp, dead: !!deathSave.nextCombatant.dead };
      if(survived) {
        const oldStats = me.stats || {};
        const newStats = { ...oldStats, deathSavesSurvived: (oldStats.deathSavesSurvived || 0) + 1 };
        const { achievements: newAchievements, newlyUnlocked } = checkNewAchievements(newStats, updatedPlayer);
        newStats.achievements = newAchievements;
        updatedPlayer = { ...updatedPlayer, stats: newStats };
        if(newlyUnlocked.length > 0) setAchievementNotif(newlyUnlocked);
      }
      await dbSavePlayer(updatedPlayer);
      setMeRaw(updatedPlayer);
      const activeCombatPlayerCount = combatants.filter(c => c?.isPlayer).length;
      if(deathSave.result === "dead" && activeCombatPlayerCount <= 1) {
        await triggerSoloDeath(attacker.name);
        return;
      }
      if(!hasActionablePlayerCombatants(combatants)) {
        await resolveCombatNoActionablePlayers({ ...qs, combat }, combatants);
        return;
      }
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
      await saveQState({ ...qs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound, pendingLog: deathSave.log } });
      return;
    }
    const targets = combatants.filter(c=>!c.isPlayer&&c.hp>0);
    if(!targets.length) { await endCombat(); return; }
    const target = targets.find(c=>c.id===selectedTarget) || targets[0];
    setSelectedTarget(null);
    // Check legendary item from local state (synced via realtime before attack)
    const myPreBuff = (qs?.masterBuffs?.[myId]?.legendaryItem?.turnsLeft > 0) ? qs.masterBuffs[myId].legendaryItem : null;
    let weapon;
    if(attacker.id === myId) {
      const equipped = getEquippedWeapon(equipment, itemMap);
      if(myPreBuff?.type === "weapon") {
        weapon = { name:myPreBuff.name, emoji:myPreBuff.emoji, weapon_die:myPreBuff.weapon_die || equipped.weapon_die, bonus_atk:(myPreBuff.bonus_atk||0) };
      } else {
        weapon = equipped;
      }
    } else {
      weapon = { name:"Arma", weapon_die:getCombatDamageDie(attacker) };
    }
    const resolved = await performAsyncAttack(attacker, target, weapon.weapon_die || "1d6", weapon);
    const latestBuffState = await dbGetPartyState(code);
    const masterBuffs = latestBuffState.masterBuffs || {};
    const myBuffs = masterBuffs[myId] || {};
    let effectiveResolved = resolved;
    let newMasterBuffs = masterBuffs;
    if (myBuffs.crit > 0 && resolved.hit) {
      effectiveResolved = { ...resolved, isCrit: true, damage: resolved.damageRoll * 2 };
      newMasterBuffs = { ...masterBuffs, [myId]: { ...myBuffs, crit: myBuffs.crit - 1 } };
    }
    // Decrement legendary item turns after attack
    if(myBuffs.legendaryItem?.turnsLeft > 0) {
      const newTurns = myBuffs.legendaryItem.turnsLeft - 1;
      newMasterBuffs = { ...newMasterBuffs, [myId]: { ...(newMasterBuffs[myId] || myBuffs), legendaryItem: newTurns > 0 ? { ...myBuffs.legendaryItem, turnsLeft: newTurns } : null } };
    }
    // Resistenza fisica: se il bersaglio ha resistenza, dimezza il danno
    const resisted = effectiveResolved.hit && (target.resistances || []).includes('physical');
    const finalDmg = resisted ? Math.max(1, Math.floor(effectiveResolved.damage / 2)) : effectiveResolved.damage;
    const effectiveResolved2 = resisted ? { ...effectiveResolved, damage: finalDmg } : effectiveResolved;
    // Status effect applicato dall'attacco (es. mostro con statusEffect)
    const attackStatusEffect = effectiveResolved.hit && attacker.attackStatusEffect ? attacker.attackStatusEffect : null;
    const tidx = combatants.findIndex(c=>c.id===target.id);
    const targetAfterDmg = { ...target, hp: Math.max(0, target.hp - finalDmg) };
    if (attackStatusEffect) {
      const existing = targetAfterDmg.statusEffects || [];
      if (!existing.some(e => e.type === attackStatusEffect.type)) {
        targetAfterDmg.statusEffects = [...existing, attackStatusEffect];
      }
    }
    combatants[tidx] = targetAfterDmg;
    let log = formatWeaponAttackLog(attacker, target, effectiveResolved2, weapon.name, combatants[tidx].hp, target.maxHp, { resisted, statusApplied: attackStatusEffect?.type });
    if (statusPrefixLog) log = statusPrefixLog + '\n---\n' + log;
    if(myPreBuff) {
      const newTurnsAfter = (myBuffs.legendaryItem?.turnsLeft || 0) - 1;
      const legLine = myPreBuff.type==="weapon" ? `🏆 **${myPreBuff.name}** (${myPreBuff.weapon_die} +${myPreBuff.bonus_atk} ATK) — ${Math.max(0,newTurnsAfter)} turni rimasti`
        : myPreBuff.type==="armor" ? `🏆 **${myPreBuff.name}** (+${myPreBuff.bonus_def} DEF) attivo — ${Math.max(0,newTurnsAfter)} turni rimasti`
        : myPreBuff.type==="magic" ? `🏆 **${myPreBuff.name}** (+${myPreBuff.bonus_mag} MAG) attivo — ${Math.max(0,newTurnsAfter)} turni rimasti`
        : "";
      if(legLine) log += "\n" + legLine;
    }
    const newQuestDmgLog = { ...(latestBuffState.questDmgLog || {}) };
    const prevEntry = newQuestDmgLog[myId] || {};
    newQuestDmgLog[myId] = {
      name: me?.name || attacker.name,
      dmg: (prevEntry.dmg || 0) + finalDmg,
      crits: (prevEntry.crits || 0) + (effectiveResolved2.isCrit ? 1 : 0),
    };
    const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
    const allDead = combatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
    if(allDead) { await endCombat({...latestBuffState, masterBuffs: newMasterBuffs, questDmgLog: newQuestDmgLog, combat:{...combat, combatants}}); return; }
    await saveQState({ ...latestBuffState, masterBuffs: newMasterBuffs, questDmgLog: newQuestDmgLog, combat: { ...combat, combatants, turn: nextTurn, round: nextRound, pendingLog: log } });
    } finally {
      playerAttackBusyRef.current = false;
    }
  }
  doAttackRef.current = doAttack;

  async function castSpell(spell, allyTargetId = null) {
    if(!combat?.active || combat.pendingLog) return;
    try {
    const _computed = getSpellSlots(me.level || 1);
    const _stored = (combat.spellSlots||{})[myId];
    const _isStale = _stored && [2,3,4,5].every(k=>(_stored[k]??0)===0) && [2,3,4,5].some(k=>(_computed[k]??0)>0);
    const slots = !_stored ? _computed
      : _isStale ? { ..._computed }
      : Object.fromEntries([1,2,3,4,5].map(k => [k, _stored[k] !== undefined ? _stored[k] : (_computed[k] ?? 0)]));
    const cost = spell.slots || 0;
    if(cost > 0 && (slots[cost]||0) <= 0) {
      await addMsg("🔮 Non hai più slot incantesimo di quel livello per questa battaglia.", "system","Sistema");
      setSpellMenu(false);
      return;
    }

    const combatants = [...combat.combatants];
    const turn = combat.turn % combatants.length;
    const attacker = combatants[turn];
    if(!attacker || attacker.id!==myId) {
      await addMsg("⚠️ Non è il tuo turno per lanciare incantesimi.", "system","Sistema");
      setSpellMenu(false);
      return;
    }

    const enemies = combatants.filter(c=>!c.isPlayer && c.hp>0);
    if(!enemies.length) { await endCombat(); setSpellMenu(false); return; }
    const target = enemies.find(c=>c.id===selectedTarget) || enemies[0];
    setSelectedTarget(null);

    const latestSpellBuffState = await dbGetPartyState(code);
    const spellMasterBuffs = latestSpellBuffState.masterBuffs || {};
    const spellMyBuffs = spellMasterBuffs[myId] || {};
    let newSpellMasterBuffs = spellMasterBuffs;

    let log = `🔮 **${attacker.name}** lancia **${spell.name}**!\n`;
    let newCombatants = combatants;
    let spellDmgToLog = 0;

    if(spell.type === "damage") {
      const base = await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), notation:spell.dmg, label:`Danno ${spell.dmg}`, themeColor:"#a855f7" });
      const magLegBonus = (spellMyBuffs.legendaryItem?.turnsLeft > 0 && spellMyBuffs.legendaryItem?.bonus_mag) ? spellMyBuffs.legendaryItem.bonus_mag : 0;
      const bonus = Math.floor((attacker.mag||0)/2) + magLegBonus;
      let effectiveBase = base;
      if(spellMyBuffs.crit > 0) {
        effectiveBase = base * 2;
        newSpellMasterBuffs = { ...spellMasterBuffs, [myId]: { ...spellMyBuffs, crit: spellMyBuffs.crit - 1 } };
      }
      const dmg = Math.max(1, effectiveBase + bonus - Math.floor(target.def/2));
      spellDmgToLog = dmg;
      const tidx = newCombatants.findIndex(c=>c.id===target.id);
      newCombatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};
      const bonusLabel = magLegBonus > 0 ? `+${Math.floor((attacker.mag||0)/2)} +${magLegBonus}(leg)` : `+${bonus}`;
      log += `💥 Tiro danno: **${spell.dmg} = ${base}**\n✨ Bonus magia: **${bonusLabel}**\n🛡️ Riduzione bersaglio: **-${Math.floor(target.def/2)}**\n🔥 Danno finale: **${dmg}**\n❤️ ${target.name}: ${newCombatants[tidx].hp}/${target.maxHp} HP`;
    } else if(spell.type === "heal") {
      const magLegHealBonus = (spellMyBuffs.legendaryItem?.turnsLeft > 0 && spellMyBuffs.legendaryItem?.bonus_mag) ? spellMyBuffs.legendaryItem.bonus_mag : 0;
      const baseHeal = await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), notation:spell.dmg, label:`Cura ${spell.dmg}`, themeColor:"#10b981" });
      const heal = Math.max(1, baseHeal + Math.floor((attacker.mag||0)/2) + magLegHealBonus);
      if(spell.area) {
        // Area heal: restore HP to ALL alive player combatants
        const healTargets = newCombatants.filter(c => c.isPlayer && !c.isSummon && !c.dead);
        let areaLog = '';
        for(const ht of healTargets) {
          const healed = Math.min(ht.maxHp, ht.hp + heal);
          const idx = newCombatants.findIndex(c => c.id === ht.id);
          newCombatants[idx] = reviveCombatantState(ht, healed);
          areaLog += `\n❤️ ${ht.name}: ${healed}/${ht.maxHp} HP`;
          const htPlayerData = partyPlayers.find(p => p.id === ht.id) || (ht.id === myId ? me : null);
          if(htPlayerData) {
            const updated = {...htPlayerData, hp: healed, dead: false};
            await dbSavePlayer(updated);
            if(ht.id === myId) setMeRaw(updated);
          }
        }
        log += `💚 Tiro cura: **${spell.dmg} = ${baseHeal}**\n✨ Bonus magia: **+${Math.floor((attacker.mag||0)/2)}**\n🌿 Cura di massa: **${heal} HP** a tutti!${areaLog}`;
      } else {
        // Single-target heal: ally if selected, otherwise self
        const healCombatant = allyTargetId
          ? newCombatants.find(c => c.isPlayer && c.id === allyTargetId && !c.dead)
          : attacker;
        const healTarget = healCombatant || attacker;
        const healed = Math.min(healTarget.maxHp, healTarget.hp + heal);
        const pid = newCombatants.findIndex(c=>c.id===healTarget.id);
        newCombatants[pid] = reviveCombatantState(healTarget, healed);
        const targetLabel = healTarget.id === attacker.id ? healTarget.name : `${healTarget.name} (da ${attacker.name})`;
        log += `💚 Tiro cura: **${spell.dmg} = ${baseHeal}**\n✨ Bonus magia: **+${Math.floor((attacker.mag||0)/2)}**\n🌿 Cura finale: **${heal}**\n❤️ ${targetLabel}: ${healed}/${healTarget.maxHp} HP`;
        const healPlayerData = partyPlayers.find(p => p.id === healTarget.id) || (healTarget.id === myId ? me : null);
        if(healPlayerData) {
          const updated = {...healPlayerData, hp: healed, dead: false};
          await dbSavePlayer(updated);
          if(healTarget.id === myId) setMeRaw(updated);
        }
      }
      setSelectedAllyTarget(null);
    } else if(spell.type === "summon" && spell.summon) {
      const s = spell.summon;
      const levelScale = Math.max(1, Math.floor((me.level || 1) / 2));
      const summonHp = s.hp + levelScale * 4;
      const summonAtk = s.atk + levelScale * 2;
      const summonDef = s.def + levelScale;
      // Allow up to 2 summons per player — remove oldest if already at limit
      const myCurrentSummons = newCombatants.filter(c => c.isSummon && c.summonOwner === myId);
      const maxSummons = spell.maxSummons || 1;
      if(myCurrentSummons.length >= maxSummons) {
        const oldest = myCurrentSummons[0];
        newCombatants = newCombatants.filter(c => c.id !== oldest.id);
      }
      const summonCombatant = {
        id: `summon_${myId}_${Date.now()}`,
        name: s.name,
        emoji: s.emoji,
        hp: summonHp, maxHp: summonHp,
        atk: summonAtk, def: summonDef,
        dmgDie: s.dmgDie || "1d8",
        rollInit: (attacker.rollInit || 10) - 0.5,
        isPlayer: true,
        isSummon: true,
        summonOwner: myId,
        level: me.level || 1,
      };
      const attackerIdx = newCombatants.findIndex(c => c.id === attacker.id);
      newCombatants.splice(attackerIdx + 1, 0, summonCombatant);
      const countNow = myCurrentSummons.length < maxSummons ? myCurrentSummons.length + 1 : maxSummons;
      log += `💀 **${s.name}** (Lv.${me.level||1}) evocato al fianco di ${attacker.name}! (${countNow}/${maxSummons})\n❤️ ${summonHp} HP · ⚔️ ${summonAtk} ATK · 🛡️ ${summonDef} DEF\nAttaccherà automaticamente ogni turno.`;
    } else if(spell.type === "drain") {
      const drainPct = spell.drainPct || 0.5;
      const base = await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg,8), notation:spell.dmg, label:`Drenaggio ${spell.dmg}`, themeColor:"#f43f8e" });
      const bonus = Math.floor((attacker.mag||0)/2);
      // drain può colpire tutti i nemici (area) o uno solo
      if(spell.area) {
        const aliveEnemies = newCombatants.filter(c=>!c.isPlayer && c.hp>0);
        let totalHeal = 0;
        let areaLog = "";
        for(const en of aliveEnemies) {
          const dmg = Math.max(1, base + bonus - Math.floor(en.def/2));
          const idx = newCombatants.findIndex(c=>c.id===en.id);
          newCombatants[idx] = {...en, hp:Math.max(0,en.hp-dmg)};
          totalHeal += Math.floor(dmg * drainPct);
          spellDmgToLog += dmg;
          areaLog += `\n💥 ${en.name}: -${dmg} HP`;
        }
        const aidx = newCombatants.findIndex(c=>c.id===attacker.id);
        if(aidx !== -1) newCombatants[aidx] = {...newCombatants[aidx], hp:Math.min(newCombatants[aidx].maxHp, newCombatants[aidx].hp+totalHeal)};
        log += `💋 **${spell.name}** colpisce TUTTI i nemici!${areaLog}\n💗 Cura totale: **+${totalHeal} HP**`;
      } else {
        const dtidx = newCombatants.findIndex(c=>c.id===target.id);
        const dmg = Math.max(1, base + bonus - Math.floor(target.def/2));
        const heal = Math.floor(dmg * drainPct);
        newCombatants[dtidx] = {...target, hp:Math.max(0,target.hp-dmg)};
        const aidx = newCombatants.findIndex(c=>c.id===attacker.id);
        if(aidx !== -1) newCombatants[aidx] = {...newCombatants[aidx], hp:Math.min(newCombatants[aidx].maxHp, newCombatants[aidx].hp+heal)};
        spellDmgToLog = dmg;
        log += `💋 **${spell.name}**\n💥 Danno: **${dmg}** a ${target.name}\n💗 Cura: **+${heal} HP**\n❤️ ${target.name}: ${newCombatants[dtidx].hp}/${target.maxHp} HP`;
      }
    } else if(spell.type === "reanimate") {
      // Anima l'ultimo nemico caduto come alleato non-morto
      const deadEnemy = [...newCombatants].reverse().find(c => !c.isPlayer && c.hp <= 0);
      if(deadEnemy) {
        const reanimated = {
          ...deadEnemy,
          id: `summon_${myId}_${Date.now()}`,
          hp: Math.floor((deadEnemy.maxHp || deadEnemy.hp || 30) * 0.6),
          maxHp: Math.floor((deadEnemy.maxHp || deadEnemy.hp || 30) * 0.6),
          isPlayer: true, isSummon: true, summonOwner: myId,
          name: `${deadEnemy.name} (Non-Morto)`,
          rollInit: (attacker.rollInit || 10) - 0.5,
        };
        newCombatants = newCombatants.filter(c => c.id !== deadEnemy.id);
        const attackerIdx = newCombatants.findIndex(c => c.id === attacker.id);
        newCombatants.splice(Math.max(0, attackerIdx + 1), 0, reanimated);
        log += `☠️ **${deadEnemy.name}** viene animato dalla morte e combatte al tuo fianco!\n❤️ ${reanimated.hp} HP · ⚔️ ${reanimated.atk} ATK · 🛡️ ${reanimated.def} DEF`;
      } else {
        log += `☠️ Nessun nemico caduto da animare sul campo.`;
      }
    } else if(spell.type === "resurrect") {
      // Riporta in vita il primo alleato caduto
      const deadAlly = newCombatants.find(c => c.isPlayer && !c.isSummon && (c.dead || c.hp <= 0));
      if(deadAlly) {
        const reviveHp = Math.floor((deadAlly.maxHp || 50) * 0.6);
        newCombatants = newCombatants.map(c =>
          c.id === deadAlly.id
            ? { ...c, hp: reviveHp, dead: false, dying: false, stable: false, deathSuccesses: 0, deathFailures: 0 }
            : c
        );
        log += `✝️ **${deadAlly.name}** risorge dalla morte con ${reviveHp} HP!\nIl potere della Necromanza sfida le leggi del mondo.`;
      } else {
        log += `✝️ Nessun alleato caduto da riportare in vita.`;
      }
    } else if(spell.type === "resurrect_all") {
      // Riporta in vita TUTTI gli alleati caduti
      const deadAllies = newCombatants.filter(c => c.isPlayer && !c.isSummon && (c.dead || c.hp <= 0));
      if(deadAllies.length) {
        newCombatants = newCombatants.map(c => {
          if(c.isPlayer && !c.isSummon && (c.dead || c.hp <= 0)) {
            const reviveHp = Math.floor((c.maxHp || 50) * 0.5);
            return { ...c, hp: reviveHp, dead: false, dying: false, stable: false, deathSuccesses: 0, deathFailures: 0 };
          }
          return c;
        });
        log += `✝️ **Resurrezione di Massa!**\n${deadAllies.map(a => `• ${a.name} risorge`).join("\n")}\nLa morte stessa trema davanti al Negromante.`;
      } else {
        log += `✝️ Nessun alleato caduto da riportare in vita.`;
      }
    } else if(spell.type === "control") {
      if(spell.area) {
        const aliveEnemies = newCombatants.filter(c=>!c.isPlayer && c.hp>0);
        newCombatants = newCombatants.map(c => (!c.isPlayer && c.hp>0) ? {...c, statusEffects:[...(c.statusEffects||[]),{type:"stun",duration:1}]} : c);
        log += `💜 **${spell.name}**\nTutti i nemici sono ammaliati e saltano il prossimo turno!\n${aliveEnemies.map(e=>`• ${e.name}`).join("\n")}`;
      } else {
        const ctarget = [...newCombatants.filter(c=>!c.isPlayer&&c.hp>0)].sort((a,b)=>(b.atk||0)-(a.atk||0))[0] || target;
        const cidx = newCombatants.findIndex(c=>c.id===ctarget.id);
        if(cidx !== -1) newCombatants[cidx] = {...newCombatants[cidx], statusEffects:[...(newCombatants[cidx].statusEffects||[]),{type:"stun",duration:1}]};
        log += `💜 **${spell.name}**\n${ctarget.name} è ammaliato/stordito e salta il prossimo turno!`;
      }
    } else if(spell.type === "defense") {
      // Buff difensivo temporaneo sul caster
      const aidx = newCombatants.findIndex(c=>c.id===attacker.id);
      if(aidx !== -1) newCombatants[aidx] = {...newCombatants[aidx], statusEffects:[...(newCombatants[aidx].statusEffects||[]),{type:"shield",duration:1}]};
      log += `🌫️ **${spell.name}**\n${attacker.name} crea un'illusione protettiva — assorbirà il prossimo attacco nemico!`;
    } else if(spell.type === "buff") {
      // Potenzia il caster (es. Forma Demoniaca)
      const aidx = newCombatants.findIndex(c=>c.id===attacker.id);
      if(aidx !== -1) {
        const boosted = {...newCombatants[aidx],
          mag:  (newCombatants[aidx].mag||0)  + (spell.buffMag||15),
          atk:  (newCombatants[aidx].atk||0)  + (spell.buffAtk||10),
          init: (newCombatants[aidx].init||0)  + (spell.buffInit||8),
          statusEffects:[...(newCombatants[aidx].statusEffects||[]),{type:"buff",duration:spell.buffDuration||2}]
        };
        newCombatants[aidx] = boosted;
        newSpellMasterBuffs = {...spellMasterBuffs, [myId]: {...spellMyBuffs, crit: (spellMyBuffs.crit||0)+1}};
      }
      log += `😈 **${spell.name}**\n${attacker.name} si trasforma! +${spell.buffMag||15} MAG · +${spell.buffAtk||10} ATK · +${spell.buffInit||8} INIT per ${spell.buffDuration||2} round!`;
    } else {
      log += `${spell.desc || "Effetto speciale"}`;
    }

    // Decrement legendary item turns after spell
    if(spellMyBuffs.legendaryItem?.turnsLeft > 0) {
      const newTurns = spellMyBuffs.legendaryItem.turnsLeft - 1;
      newSpellMasterBuffs = { ...newSpellMasterBuffs, [myId]: { ...(newSpellMasterBuffs[myId] || spellMyBuffs), legendaryItem: newTurns > 0 ? { ...spellMyBuffs.legendaryItem, turnsLeft: newTurns } : null } };
      const spellLeg = spellMyBuffs.legendaryItem;
      const spellLegLine = spellLeg.type==="magic" ? `\n🏆 **${spellLeg.name}** (+${spellLeg.bonus_mag} MAG) attivo — ${Math.max(0,newTurns)} turni rimasti`
        : spellLeg.bonus_mag ? `\n🏆 **${spellLeg.name}** (+${spellLeg.bonus_mag} MAG) attivo — ${Math.max(0,newTurns)} turni rimasti`
        : `\n🏆 **${spellLeg.name}** attivo — ${Math.max(0,newTurns)} turni rimasti`;
      log += spellLegLine;
    }
    const nextSlots = { ...(combat.spellSlots||{}), [myId]: { ...(slots||{}) } };
    if(cost > 0) nextSlots[myId][cost] = Math.max(0, (nextSlots[myId][cost]||0) - 1);

    const { nextTurn, nextRound } = getNextCombatTurn(newCombatants, combat.turn, combat.round);

    if(!hasActionablePlayerCombatants(newCombatants)) {
      setSpellMenu(false);
      await resolveCombatNoActionablePlayers({ ...qs, combat }, newCombatants);
      return;
    }

    const newSpellQuestDmgLog = { ...(latestSpellBuffState.questDmgLog || {}) };
    if(spellDmgToLog > 0) {
      newSpellQuestDmgLog[myId] = { name: me?.name || attacker.name, dmg: (newSpellQuestDmgLog[myId]?.dmg || 0) + spellDmgToLog };
    }
    const allDead = newCombatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
    setSpellMenu(false);
    if(allDead) { await endCombat({...latestSpellBuffState, masterBuffs: newSpellMasterBuffs, questDmgLog: newSpellQuestDmgLog, combat:{...combat, combatants:newCombatants, spellSlots:nextSlots}}); return; }
    await saveQState({ ...latestSpellBuffState, masterBuffs: newSpellMasterBuffs, questDmgLog: newSpellQuestDmgLog, combat: { ...combat, combatants:newCombatants, turn:nextTurn, round:nextRound, spellSlots:nextSlots, pendingLog: log } });
    } catch(err) {
      console.error("castSpell error:", err);
      setSpellMenu(false);
      await addMsg(`⚠️ Errore nel lancio dell'incantesimo: ${err?.message || err}`, "system", "Sistema");
    }
  }

  async function endCombat(preloadedQs) {
    setSpellMenu(false);
    const latestQs = preloadedQs || await dbGetPartyState(code);
    const latestCombat = latestQs?.combat;

    // --- Distribute XP and gold from slain monsters ---
    const slain = (latestCombat?.combatants || [])
      .filter(c => !c.isPlayer && c.hp <= 0)
      .map(c => ({ name: c.name, emoji: c.emoji || "👾", xp: monsterXpValue(c), gold: monsterGoldValue(c) }));
    const totalXp = slain.reduce((s, m) => s + m.xp, 0);
    const totalGold = slain.reduce((s, m) => s + m.gold, 0);
    const combatPlayerIds = new Set((latestCombat?.combatants || []).filter(c => c?.isPlayer).map(c => c.id));
    // Fetch fresh player data so XP/gold always go to all combat participants
    const freshPlayers = await dbGetPlayers(code);
    const rewardPlayers = freshPlayers.filter(p => combatPlayerIds.has(p.id));
    const partyCount = Math.max(rewardPlayers.length, 1);
    const xpEach = Math.floor(totalXp / partyCount);
    const goldEach = Math.floor(totalGold / partyCount);

    const combatDmgLog = latestQs.questDmgLog || {};
    const currentQuestForDiary = latestQs?.active ? getQuests().find(q => q.id === latestQs.currentId) : null;
    const playerResults = [];
    for (const p of rewardPlayers) {
      const beforeXp = p.xp || 0;
      const beforeLevel = p.level || 1;
      const pDmgEntry = combatDmgLog[p.id] || {};
      const oldStats = p.stats || {};
      const battleEntry = {
        date: new Date().toISOString(),
        result: "victory",
        questName: currentQuestForDiary?.title || null,
        enemies: slain.map(m => `${m.emoji} ${m.name}`),
        myDmg: pDmgEntry.dmg || 0,
        xpGained: xpEach,
        goldGained: goldEach,
        rounds: latestCombat?.round || 1,
      };
      const newStats = {
        ...oldStats,
        monstersKilled: (oldStats.monstersKilled || 0) + slain.length,
        totalDamage: (oldStats.totalDamage || 0) + (pDmgEntry.dmg || 0),
        criticalHits: (oldStats.criticalHits || 0) + (pDmgEntry.crits || 0),
        questsCompleted: oldStats.questsCompleted || 0,
        deathSavesSurvived: oldStats.deathSavesSurvived || 0,
        battleHistory: [battleEntry, ...(oldStats.battleHistory || [])].slice(0, 10),
      };
      const { achievements: newAchievements, newlyUnlocked } = checkNewAchievements(newStats, p);
      newStats.achievements = newAchievements;
      let up = { ...p, xp: beforeXp + xpEach, gold: (p.gold || 0) + goldEach, stats: newStats };
      await dbSavePlayer(up);
      if (up.id === myId) {
        setMeRaw(up);
        if (newlyUnlocked.length > 0) setAchievementNotif(newlyUnlocked);
      }
      playerResults.push({
        id: p.id, name: p.name,
        beforeXp, beforeLevel, xpThreshold: xpForLevel(beforeLevel),
        afterXp: up.xp, afterLevel: up.level,
        xpGained: xpEach, goldGained: goldEach,
        canLevelUp: up.xp >= xpForLevel(up.level),
      });
    }
    const victoryData = { slain, xpEach, goldEach, totalXp, totalGold, playerResults, combatDmgLog, ts: Date.now() };
    const onQuestCombat = latestQs?.active && latestQs?.currentId && (() => {
      const q = getQuests().find(x => x.id === latestQs.currentId);
      return q && isCombatStep(q.steps[latestQs.step]);
    })();
    const newCombat = { active: false, won: !!onQuestCombat, victoryData };
    // Persist remaining spell slots so they carry over between combats
    // Merge with computed so all tiers are always present in the saved state
    const rawUsedSlots = latestCombat?.spellSlots || {};
    const newPersistentSlots = { ...(latestQs.persistentSpellSlots || {}) };
    for(const [pid, stored] of Object.entries(rawUsedSlots)) {
      const player = rewardPlayers.find(p => p.id === pid);
      const comp = getSpellSlots(player?.level || 1);
      newPersistentSlots[pid] = Object.fromEntries([1,2,3,4,5].map(k => [k, stored[k] !== undefined ? stored[k] : (comp[k] ?? 0)]));
    }
    const slainNames = slain.map(m => `${m.emoji} ${m.name}`).join(', ');
    const diaryText = currentQuestForDiary
      ? `Combattimento durante «${currentQuestForDiary.title}»: ${slainNames || 'nessun nemico'} sconfitti. +${xpEach} XP e +${goldEach} 💰 a testa.`
      : `${slainNames || 'Nemici'} sconfitti in battaglia! +${xpEach} XP e +${goldEach} 💰 a testa.`;
    const newDiaryCombat = appendDiary(latestQs.partyDiary, { type:'combat', icon:'⚔️', text: diaryText, players: rewardPlayers.map(p => p.name) });
    // Dungeon: clear combat room on victory
    let newDungeon = latestQs.dungeon;
    if (newDungeon?.active && newDungeon.pendingCombatRoom != null) {
      const ci = newDungeon.pendingCombatRoom;
      const newRooms = newDungeon.rooms.map((r, i) => i === ci ? { ...r, cleared:true } : r);
      const nextRoom = ci + 1;
      const allDone = newRooms.every(r => r.cleared);
      newDungeon = { ...newDungeon, rooms:newRooms, currentRoom:Math.min(nextRoom, newRooms.length-1), pendingCombatRoom:null, ...(allDone?{completedAt:new Date().toISOString()}:{}) };
    }
    // Story: advance scene after battle victory
    let newStoryState = latestQs.story;
    if(latestQs.story?.battlePending) {
      const nextSceneId = latestQs.story.battleNext;
      const storyObj = latestQs.story?._previewStory || STORIES.find(s => s.id === latestQs.story.storyId) || customStories.find(s => s.id === latestQs.story.storyId);
      const nextScene = storyObj?.scenes?.[nextSceneId];
      const newFlags = { ...(latestQs.story.storyFlags||{}), ...(nextScene?.setFlags||{}) };
      const visited = [...new Set([...(latestQs.story.visitedScenes||[]), nextSceneId].filter(Boolean))];
      newStoryState = { ...latestQs.story, battlePending:false, battleNext:null, battleNextFail:null, currentSceneId: nextSceneId, currentChapterId: nextScene?.chapterId||latestQs.story.currentChapterId, storyFlags: newFlags, visitedScenes: visited };
      if(nextScene) await addMsg(`📖 *${nextScene.title}*`, "narration", "Master");
    }
    const newQs = { ...latestQs, combat: newCombat, persistentSpellSlots: newPersistentSlots, partyDiary: newDiaryCombat, dungeon: newDungeon, story: newStoryState };
    await dbSavePartyState(code, newQs);
    setQs(prev => ({ ...prev, combat: newCombat, dungeon: newDungeon, story: newStoryState }));
    if (newDungeon?.active && newDungeon.completedAt && !latestQs.dungeon?.completedAt) {
      await addMsg(`🏆 **DUNGEON COMPLETATO!** ${newDungeon.name} — tutti i segreti svelati!`, 'victory', 'Sistema');
    }
    // Guild: bonus oro e XP gilda per vittoria
    const myGuild = getPlayerGuild(guilds, myId);
    const goldMult = myGuild ? (1 + getGuildGoldBonus(myGuild.level||1)/100) : 1;
    if(myGuild && goldMult > 1) {
      const bonusGold = Math.floor(goldEach * (goldMult - 1));
      if(bonusGold > 0) {
        const upd = { ...me, gold: (me.gold||0) + bonusGold };
        await dbSavePlayer(upd); setMeRaw(upd);
      }
      await addGuildXP(slain.length * 20);
    }
    await dbSendMessage({ party_code: code, author: "Sistema",
      content: `🏆 **BATTAGLIA VINTA!** ⭐ +${xpEach} XP — 💰 +${goldEach} oro a testa\n\nSe hai abbastanza XP, apri la scheda **Livello** per aumentare di livello.`, type: "victory" });
  }

  // -- QUEST --
  async function acceptQuest(q) {
    if(q.specialPassword && !unlockedSpecialQuestIds.includes(q.id)) {
      setSpecialQuestError("Questa missione richiede una password.");
      return;
    }
    const profile = questRiskProfile(q, partyPlayers);
    const perPlayerCount = Math.max(partyPlayers.length || 1, 1);
    const xpEachPreview = Math.floor((Number(q.xpReward) || 0) / perPlayerCount);
    const goldEachPreview = Math.floor((Number(q.goldReward) || 0) / perPlayerCount);
    const newQs = { currentId:q.id, step:0, active:true, combat:null, completed:qs?.completed||[], questDmgLog:{}, currentDifficulty: q.difficulty };
    await saveQState(newQs);
    await addMsg(`📜 **MISSIONE: ${q.title}**

${q.desc}

*${q.flavor}*

🎚️ Difficoltà: **${missionDifficultyLabel(q.difficulty)}** — rischio **${profile.risk.toLowerCase()}**
👥 Consigliato: **livello ${profile.recommendedLevel}+**
⚔️ Scontri: **${profile.combatCount || 0}** — nemici stimati **${profile.monsters.length || 0}**${profile.bosses ? ` — boss **${profile.bosses}**` : ""}
🎒 Preparazione: ${profile.advice.length ? profile.advice.join(" · ") : "nessun requisito particolare"}

⭐ Ricompensa: **${q.xpReward} XP** — **${q.goldReward} oro** totali
👤 Stima a testa: **${xpEachPreview} XP** — **${goldEachPreview} oro**`, "quest","Master");
    await postQuestStepMessage(q, 0);
  }

  function isChoiceStep(step) {
    return step?.type === "choice";
  }
  function isCombatStep(step) {
    return step?.type === "combat";
  }
  function isLootStep(step) {
    return step?.type === "loot";
  }
  function stepText(step) {
    if(!step) return "";
    return typeof step === "string" ? step : step.text || "";
  }

  async function getOnlinePartyPlayersForCombat() {
    const userMeta = await dbGetUserMasterMeta();
    const nowMs = Date.now();
    const onlinePlayers = partyPlayers.filter(player =>
      player.id === myId ||
      (player.accountId !== authUser?.id && isPartyPlayerOnline(player, userMeta, nowMs))
    );
    return onlinePlayers.length ? onlinePlayers : partyPlayers.filter(player => player.id === myId);
  }

  async function postQuestStepMessage(q, stepIndex) {
    const step = q.steps[stepIndex];
    const icon = isCombatStep(step)?"⚔️":isLootStep(step)?"💰":isChoiceStep(step)?"🎯":"📜";
    await addMsg(`${icon} **${q.title} — Scena ${stepIndex+1}/${q.steps.length}**

${stepText(step)}`, "quest","Master");
  }

  async function completeQuest(q) {
    const myGuild = getPlayerGuild(guilds, myId);
    const goldMult = myGuild ? (1 + getGuildGoldBonus(myGuild.level||1) / 100) : 1;
    // Fetch fresh player data — endCombat may have updated stats in DB since partyPlayers was last set
    const freshQuestPlayers = await dbGetPlayers(code);
    const xpE = Math.floor(q.xpReward/Math.max(freshQuestPlayers.length,1));
    const goldE = Math.floor((q.goldReward/Math.max(freshQuestPlayers.length,1)) * goldMult);
    for(const p of freshQuestPlayers) {
      const oldStats = p.stats || {};
      const newStats = {
        ...oldStats,
        questsCompleted: (oldStats.questsCompleted || 0) + 1,
        monstersKilled: oldStats.monstersKilled || 0,
        totalDamage: oldStats.totalDamage || 0,
        criticalHits: oldStats.criticalHits || 0,
        deathSavesSurvived: oldStats.deathSavesSurvived || 0,
      };
      const newGold = (p.gold || 0) + goldE;
      const { achievements: newAchievements, newlyUnlocked } = checkNewAchievements(newStats, { ...p, gold: newGold });
      newStats.achievements = newAchievements;
      let up = { ...p, xp: (p.xp || 0) + xpE, gold: newGold, stats: newStats };
      await dbSavePlayer(up);
      if(up.id === myId) {
        setMeRaw(up);
        if(newlyUnlocked.length > 0) setAchievementNotif(newlyUnlocked);
      }
    }
    const today = new Date().toLocaleDateString('en-CA');
    const dmgLog = qs.questDmgLog || {};
    const logEntry = {
      id: q.id, title: q.title,
      completedAt: new Date().toISOString(), date: today,
      xpEach: xpE, goldEach: goldE,
      players: Object.entries(dmgLog).map(([, d]) => ({ name: d.name, dmg: d.dmg })).sort((a,b) => b.dmg - a.dmg),
    };
    const newQuestLog = [...(qs.questLog || []).filter(e => e.date === today), logEntry];
    const normalizedQuestDiff = normalizeMissionDifficulty(q.difficulty);
    const diffLabel = missionDifficultyLabel(q.difficulty).toLowerCase();
    const newDiaryQuest = appendDiary(qs.partyDiary, { type:'quest', icon:'📜', text:`«${q.title}» completata! Missione di difficoltà ${diffLabel}. Ricompensa: +${xpE} XP e +${goldE} 💰 a testa.`, players: freshQuestPlayers.map(p=>p.name) });
    const historyEntry = { id: q.id, title: q.title, difficulty: q.difficulty, completedAt: new Date().toISOString(), xpEach: xpE, goldEach: goldE };
    const newQuestHistory = [...(qs.questHistory || []), historyEntry].slice(-100);
    const newQs={...qs,active:false,step:0,currentId:null,completed:[...(qs.completed||[]),q.id],questDmgLog:{},questLog:newQuestLog,partyDiary:newDiaryQuest,questHistory:newQuestHistory};
    await saveQState(newQs);
    const guildXp = normalizedQuestDiff==="epica"?160:normalizedQuestDiff==="difficile"?120:normalizedQuestDiff==="facile"?40:70;
    if(myGuild) await addGuildXP(guildXp);
    const bonusNote = myGuild ? ` (bonus gilda +${Math.round((goldMult-1)*100)}%)` : "";
    // Material loot drop based on quest difficulty
    const isSpecial = !!(q.specialPassword);
    const matRarity = isSpecial ? "legendary"
      : normalizedQuestDiff === "epica" ? "legendary"
      : normalizedQuestDiff === "difficile" ? "epic"
      : normalizedQuestDiff === "medio" ? "rare"
      : (Math.random() < 0.5 ? "common" : "uncommon");
    const matPool = CRAFT_MATERIALS.filter(m => m.rarity === matRarity && m.available !== false);
    if (matPool.length > 0) {
      const droppedMat = matPool[Math.floor(Math.random() * matPool.length)];
      for (const p of partyPlayers) {
        await dbAddPlayerItem(p.id, droppedMat.id);
      }
      const rarityLabel = matRarity === "legendary" ? "🟣 Leggendario" : matRarity === "epic" ? "🔴 Epico" : matRarity === "rare" ? "🔵 Raro" : matRarity === "uncommon" ? "🟢 Non comune" : "⚪ Comune";
      await addMsg(`⚔️ **MISSIONE COMPLETATA: ${q.title}!**\n\n⭐ +${xpE} XP a testa · 💰 +${goldE} oro a testa${bonusNote}\n\n🎁 **Bottino materiale trovato:** ${droppedMat.emoji} **${droppedMat.name}** [${rarityLabel}] — ricevuto da tutti!\n\nSe hai abbastanza XP, apri la scheda **Livello** per aumentare di livello.`, "victory","Master");
    } else {
      await addMsg(`⚔️ **MISSIONE COMPLETATA: ${q.title}!**\n\n⭐ +${xpE} XP a testa · 💰 +${goldE} oro a testa${bonusNote}\n\nSe hai abbastanza XP, apri la scheda **Livello** per aumentare di livello.`, "victory","Master");
    }
  }

  async function startCombatStep(stepData) {
    // Scale monsters to avg party level so combat stays challenging
    const avgLevel = partyPlayers.length
      ? Math.round(partyPlayers.reduce((s,p) => s + (p.level||1), 0) / partyPlayers.length)
      : (me?.level || 1);
    const diff = normalizeMissionDifficulty(qs?.currentDifficulty || stepData.difficulty || "medio");
    const diffMult = diff === "facile" ? 0.85 : diff === "difficile" ? 1.45 : 1.15;
    const hpMult   = (1 + (avgLevel - 1) * 0.18) * diffMult;
    const atkBonus = Math.floor(avgLevel * 0.6 * diffMult);
    const defBonus = Math.floor(avgLevel * 0.25 * diffMult);
    const monsters = (stepData.monsters||[]).map(e=>{
      const baseHp = e.maxHp || e.hp;
      const maxHp = Math.round(baseHp * hpMult);
      const atk = (e.atk || 5) + atkBonus;
      const def = (e.def || 0) + defBonus;
      return { ...e, atk, def, hp:maxHp, maxHp, xp:monsterXpValue({ ...e, maxHp }), weaponDie:e.weaponDie || getCombatDamageDie({...e, atk}) };
    });
    const combatPartyPlayers = await getOnlinePartyPlayersForCombat();
    const players = combatPartyPlayers.map(p=>({
      id:p?.id,
      name:p?.name,
      class:p?.class||"warrior",
      race:p?.race||"human",
      gender:p?.gender||getStoredCharacterGender(p?.id,"male"),
      emoji:CLASSES[p?.class||'warrior']?.emoji||"⚔️",
      hp:p?.hp||0,
      maxHp:p?.maxHp||0,
      atk:p?.atk||0,
      def:p?.def||0,
      mag:p?.mag||0,
      init:p?.init||1,
      weaponDie:p?.id===myId ? getEquippedWeapon(equipment, itemMapRef.current).weapon_die : getCombatDamageDie(p),
      isPlayer:true,
      dying:false,
      stable:false,
      dead:false,
      deathSuccesses:0,
      deathFailures:0,
    }));
    const allCombatants = [...players,...monsters].map(c=>({...c, rollInit:(c.init||1)+roll(20)}));
    allCombatants.sort((a,b)=>b.rollInit-a.rollInit);
    const spellSlots = Object.fromEntries(players.map(p=>{
      const computed = getSpellSlots(p.level || 1);
      const persisted = (qs.persistentSpellSlots || {})[p.id];
      // Always use at least the computed slots for the player's current level
      const merged = {};
      for(const k of [1,2,3,4,5]) merged[k] = Math.max((persisted?.[k] ?? computed[k]), computed[k]);
      return [p.id, merged];
    }));
    const isBossEvent = monsters.some(m => m.isBoss);
    const newCombat = { active:true, combatants:allCombatants, turn:0, round:1, spellSlots, startedAt: Date.now(), ...(isBossEvent ? { isBossEvent:true, bossKnockedOut:{}, bossEnraged:false } : {}) };
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    await addMsg(`⚔️ **BATTAGLIA INIZIATA!** Round 1\n\n**Ordine di Iniziativa:**\n${allCombatants.map((c,i)=>`${i+1}. ${c.emoji||"⭐"} ${c.name} (${c.rollInit})`).join("\n")}`, "combat", "Sistema");
    const absentPlayers = partyPlayers.filter(p => !combatPartyPlayers.some(active => active.id === p.id));
    if(absentPlayers.length) {
      await addMsg(`Non partecipano perche offline: ${absentPlayers.map(p => p.name).join(", ")}.`, "system", "Sistema");
    }
    // Don't auto-switch tab — show floating battle banner instead
  }
  startCombatStepRef.current = startCombatStep;

  // Victory data comes from shared DB state — all clients see it as soon as qs updates
  const currentVictoryData = qs?.combat?.victoryData;
  const showVictory = !!(currentVictoryData && currentVictoryData.ts !== dismissedVictoryTs);

  async function advanceQuest() {
    const quests = getQuests();
    const q = quests.find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active) return;
    const stepData = q.steps[qs.step];
    // Block if combat not yet won
    if(isCombatStep(stepData) && !qs?.combat?.won) return;
    // Block if choice (must pick an option)
    if(isChoiceStep(stepData)) return;
    const nextStep = qs.step + 1;
    if(nextStep >= q.steps.length) {
      await completeQuest(q);
    } else {
      const newQs = {...qs, combat:null, step:nextStep};
      await saveQState(newQs);
      await postQuestStepMessage(q, nextStep);
    }
  }

  async function chooseQuestOption(choiceIndex) {
    const quests = getQuests();
    const q = quests.find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active) return;
    const step = qs.step;
    const stepData = q.steps[step];
    if(!isChoiceStep(stepData)) return;
    const choice = stepData.choices[choiceIndex];
    if(!choice) return;

    const quality = choice.quality || (choice.correct === true ? "good" : "bad");
    const xpE = Math.max(0, Number(choice.xp)||0);
    const goldE = Math.max(0, Number(choice.gold)||0);
    await addMsg(`🎯 **Scelta:** ${choice.label}`, "quest", "Master");

    if(quality === "good" || choice.correct === true) {
      if(xpE||goldE) {
        for(const p of partyPlayers) {
          let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
          await dbSavePlayer(up);
          if(up.id===myId) setMeRaw(up);
        }
      }
      await addMsg(`✅ Risposta giusta!${xpE ? ` ⭐ +${xpE} XP a testa` : ""}${goldE ? ` 💰 +${goldE} oro a testa` : ""}`, "victory", "Master");
    } else if(quality === "neutral") {
      if(xpE||goldE) {
        for(const p of partyPlayers) {
          let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
          await dbSavePlayer(up);
          if(up.id===myId) setMeRaw(up);
        }
      }
      await addMsg(`🟡 Risposta quasi giusta!${xpE ? ` ⭐ +${xpE} XP a testa` : ""}${goldE ? ` 💰 +${goldE} oro a testa` : ""}`, "system", "Master");
    } else {
      await addMsg(`❌ Risposta sbagliata... il party non guadagna nulla e avanza comunque.`, "system", "Sistema");
    }

    const nextStep = choice.next != null ? Number(choice.next) : step+1;
    const isComplete = nextStep >= q.steps.length;
    setChoiceFeedback({ quality, label: choice.label, xp: xpE, gold: goldE, _nextStep: nextStep, _questId: q.id, _isComplete: isComplete });
  }

  async function confirmQuestAdvance() {
    if(!choiceFeedback) return;
    const { _nextStep, _questId, _isComplete } = choiceFeedback;
    setChoiceFeedback(null);
    const q = getQuests().find(x => x.id === _questId);
    if(!q) return;
    if(_isComplete) {
      await completeQuest(q);
    } else {
      const newQs = { ...qs, step: _nextStep };
      await saveQState(newQs);
      await postQuestStepMessage(q, _nextStep);
    }
  }

  async function handleLoot(stepData) {
    const q = getQuests().find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active) return;
    const loot = stepData?.loot || {};
    const goldMin = loot.gold?.[0]||0, goldMax = loot.gold?.[1]||0;
    const goldFound = randomIntInclusive(goldMin, goldMax);
    const items = (loot.items||[]).map(spec => resolveLootItem(spec, catalogItems)).filter(Boolean);
    const itemFound = pickRandom(items);
    let lootMsg = `💰 **Bottino trovato!**`;
    if(goldFound>0) lootMsg += `\n🪙 +${goldFound} oro a testa`;
    if(itemFound) lootMsg += `\n🎁 Hai trovato: **${itemFound.name}**! È finito nel tuo inventario.`;
    lootMsg += `\n\nCliccate **Avanti →** per proseguire.`;
    for(const p of partyPlayers) {
      let up={...p, gold:p.gold+goldFound};
      await dbSavePlayer(up);
      if(up.id===myId) setMeRaw(up);
    }
    if(itemFound && me?.id) {
      await dbAddPlayerItem(me.id, itemFound.id);
      await refreshInventory({ ...me, gold: (me.gold || 0) + goldFound });
    }
    await addMsg(lootMsg, "victory", "Master");
    setLootedStepKey(currentStepKey);
  }

  async function handleInput() {
    const raw=input.trim(); if(!raw) return;
    setInput("");
    const c=raw.toLowerCase();
    try {
      if(c==="avanza") await advanceQuest();
      else if(c==="aiuto") await addMsg(`⚔️ **Comandi:** avanza · stato · party · classifica`, "system","Sistema");
      else if(c==="stato") { if(me) await addMsg(`${CLASSES[me?.class||'warrior']?.emoji} **${me.name}** Lv.${me.level} ❤️${me.hp||0}/${me.maxHp||0} ⚔️${me.atk||0} 🛡️${me.def||0} ✨${me.mag||0} 💰${me.gold||0}`,`info`,me.name); }
      else if(c==="party") { const lines=partyPlayers.map(p=>`${CLASSES[p?.class||'warrior']?.emoji} **${p.name}** Lv.${p.level} ❤️${p?.hp||0}/${p?.maxHp||0}`); await addMsg(`⚔️ **Party [${code}]**\n${lines.join("\n")}`,"info","Master"); }
      else if(c==="classifica") { const sorted=[...partyPlayers].sort((a,b)=>b.level-a.level); await addMsg(`⚔️ **Classifica**\n${sorted.map((p,i)=>`${i===0?"🥇":i===1?"🥈":"🥉"} ${CLASSES[p?.class||'warrior']?.emoji} **${p.name}** Lv.${p.level} — ${p.xp||0}XP`).join("\n")}`,"info","Master"); }
      else if(chatChannel === "world") {
        await dbSendMessage({ party_code:"__world__", author:me?.name, content:raw, type:"chat" });
        const wm = await dbGetMessages("__world__");
        setWorldMessages(wm.filter(m => m.type === "chat"));
      } else if(chatChannel === "master") {
        await dbSendMessage({ party_code:"__master__", author:me?.name, content:raw, type:"chat" });
        const ago = Date.now() - 7*24*60*60*1000;
        const mm = await dbGetMessages("__master__");
        setMasterMessages(mm.filter(m => m.type === "chat" && new Date(m.created_at).getTime() >= ago));
      } else {
        await addMsg(raw, "chat", me?.name);
        const msgs = await dbGetMessages(code);
        setMessages(msgs);
      }
    } catch(e) {
      console.error("[handleInput] errore chat:", e);
    }
    inputRef.current?.focus();
  }

  const MSG_COLORS={
    narration:{bg:"rgba(15,23,42,0.82)",border:"#334155",color:"#e2d9c5"},
    system:   {bg:"rgba(76,29,149,0.3)",border:"#7c3aed",color:"#ddd6fe"},
    quest:    {bg:"rgba(120,53,15,0.32)",border:"#d97706",color:"#fde68a"},
    victory:  {bg:"rgba(6,95,70,0.32)",border:"#10b981",color:"#a7f3d0"},
    combat:   {bg:"rgba(127,29,29,0.34)", border:"#ef4444",color:"#fecaca"},
    info:     {bg:"rgba(55,48,163,0.3)",border:"#6366f1",color:"#c7d2fe"},
    chat:     {bg:"rgba(15,23,42,0.86)",border:"#334155",color:"#f8fafc"},
  };

  const spellbookCaster = MAGIC_CLASSES.includes(me?.class);
  const spellbookAvailableSpells = spellbookCaster ? availableSpellsFor(me?.class, me?.level) : [];

  useEffect(() => {
    if(!myId || !spellbookCaster) {
      setPreparedSpellIds([]);
      return;
    }
    const stored = getStoredPreparedSpells(myId, spellbookAvailableSpells);
    const validIds = new Set(spellbookAvailableSpells.map(spell => spell.id));
    const nextPrepared = stored.filter(id => validIds.has(id));
    const normalized = nextPrepared.length ? nextPrepared : spellbookAvailableSpells.map(spell => spell.id);
    setPreparedSpellIds(normalized);
    saveStoredPreparedSpells(myId, normalized);
  }, [myId, spellbookCaster, me?.class, me?.level]);

  if(!me || !me.class) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#f3f4f6", fontFamily:"'Cinzel',serif", fontSize:"1.2rem" }}>Caricamento personaggio...</div>;

  const combat = qs?.combat;
  combatRef.current = combat;
  const activeCombatant = combat?.active ? combat.combatants?.[combat.turn%combat.combatants.length] : null;
  const myCombatant = combat?.combatants?.find(c => c.id === myId) || null;
  const myTurn = combat?.active && activeCombatant?.id===myId;
  const myDeathTurn = myTurn && isDyingCombatant(activeCombatant);
  const isMySummonTurn = combat?.active && activeCombatant?.isSummon && activeCombatant?.summonOwner === myId;
  const isCaster = MAGIC_CLASSES.includes(me?.class);
  const spellSlots = (() => {
    const computed = getSpellSlots(me?.level || 1);
    // Detect stale level-1 data: all higher tiers are 0 but computed has slots there
    const isStale = (stored) => {
      const higherAllZero = [2,3,4,5].every(k => (stored[k] ?? 0) === 0);
      const computedHasHigher = [2,3,4,5].some(k => (computed[k] ?? 0) > 0);
      return higherAllZero && computedHasHigher;
    };
    const fillMissing = (stored) => {
      if(isStale(stored)) return { ...computed };
      return Object.fromEntries([1,2,3,4,5].map(k => [k, stored[k] !== undefined ? stored[k] : (computed[k] ?? 0)]));
    };
    const inCombat = combat?.spellSlots?.[myId];
    if(inCombat) return fillMissing(inCombat);
    const persisted = qs?.persistentSpellSlots?.[myId];
    if(!persisted) return computed;
    return Object.fromEntries([1,2,3,4,5].map(k => [k, Math.max(persisted[k] ?? 0, computed[k] ?? 0)]));
  })();
  const availableSpells = isCaster ? availableSpellsFor(me?.class, me?.level) : [];
  const maxPreparedSpells = maxPreparedSpellsForLevel(me?.level || 1);
  const preparedNormalSpellCount = availableSpells.filter(spell => spell.slots > 0 && preparedSpellIds.includes(spell.id)).length;
  const preparedSpells = availableSpells.filter(spell => spell.slots === 0 || preparedSpellIds.includes(spell.id));
  const spellLevels = Array.from(new Set([
    ...(preparedSpells.some(spell => Number(spell.slots) === 0) ? [0] : []),
    ...Object.keys(spellSlots).filter(l=>spellSlots[l]>0).map(Number),
  ])).sort((a,b)=>a-b);
  const spellsByLevel = spellLevels.reduce((acc, lvl) => {
    acc[lvl] = preparedSpells.filter(s => Number(s.slots) === lvl);
    return acc;
  }, {});
  const currentQ = qs?.active ? getQuests().find(x=>x.id===qs.currentId) : null;
  const allActiveQuests = getQuests().filter(q => q.active && (!q.minLevel || (me?.level || 1) >= q.minLevel));
  const dailyQuestIds = new Set(getDailyQuests(allActiveQuests.filter(q => !q.specialPassword), undefined, qs?.longRestSeed || 0).map(q => q.id));
  const publicDailyQuests = allActiveQuests.filter(q => dailyQuestIds.has(q.id));
  const unlockedSpecialQuests = allActiveQuests.filter(q => q.specialPassword && unlockedSpecialQuestIds.includes(q.id));
  const currentStepKey = `${qs?.currentId || ""}:${qs?.step ?? -1}`;
  const lootDone = lootedStepKey === currentStepKey;
  const inventoryCounts = countInventoryItems(inventory);
  const inventoryGroups = groupInventoryEntries(inventory);
  const selectedInventoryItem = inventoryGroups.find(group => group.item.id === selectedInventoryItemId) || null;
  const visibleChatMessages = messages.filter(msg => msg.type === "chat");
  const equippedWeapon = getEquippedWeapon(equipment, itemMap);
  const combatMode = tab==="combat" && combat?.active;
  const isMonsterTurn = combat?.active && activeCombatant && !activeCombatant.isPlayer;
  const isLeaderForMonsterTurn = isMonsterTurn && combat.combatants.find(c => c.isPlayer && !c.isSummon && !c.dead)?.id === myId;
  const isSummonTurn = !!(combat?.active && !combat.pendingLog && activeCombatant?.isSummon);
  const isLeaderForSummonTurn = isSummonTurn && (activeCombatant?.summonOwner === myId || (!activeCombatant?.summonOwner && (partyPlayers[0]?.id === myId || partyPlayers.length === 0)));
  const equippedItems = Object.fromEntries(
    EQUIP_SLOTS.map(s => [s, itemMap.get(equipment[s]) || null])
  );
  const currentLevelGain = levelGainForClass(me?.class);
  const nextLevelXp = xpForLevel(me?.level || 1);
  const canLevelUp = (me?.xp || 0) >= nextLevelXp;
  const nextLevelPreview = me ? applyLevelUpToPlayer(me).player : null;

  function togglePreparedSpell(spellId) {
    if(!myId) return;
    setPreparedSpellIds(prev => {
      const spell = availableSpells.find(entry => entry.id === spellId);
      if(!spell || spell.slots === 0) return prev;
      const isPrepared = prev.includes(spellId);
      const currentPreparedCount = availableSpells.filter(entry => entry.slots > 0 && prev.includes(entry.id)).length;
      if(!isPrepared && currentPreparedCount >= maxPreparedSpells) return prev;
      const next = isPrepared ? prev.filter(id => id !== spellId) : [...prev, spellId];
      saveStoredPreparedSpells(myId, next);
      return next;
    });
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", position:"relative", zIndex:1 }}>
      <ParticleBackground />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(2,6,23,0.38) 0%, rgba(2,6,23,0.32) 45%, rgba(2,6,23,0.42) 100%)", pointerEvents:"none" }} />

      {/* ── Maintenance overlay ── */}
      {maintenanceMode && (
        <div style={{ position:"fixed", inset:0, zIndex:99999, background:"linear-gradient(180deg,rgba(2,4,14,0.98),rgba(8,10,24,0.99))", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.5rem", padding:"2rem", textAlign:"center" }}>
          <div style={{ fontSize:"4rem" }}>🔧</div>
          <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.6rem", fontWeight:700, letterSpacing:"0.04em" }}>Gioco in Manutenzione</div>
          <div style={{ color:"#94a3b8", fontSize:"0.95rem", maxWidth:420, lineHeight:1.7 }}>
            {maintenanceMsg || "Il Dungeon Master sta aggiornando il mondo. Riprova tra qualche minuto."}
          </div>
          <div style={{ marginTop:"0.5rem", padding:"0.6rem 1.4rem", background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:8, color:"#fbbf24", fontSize:"0.78rem" }}>
            La pagina si aggiornerà automaticamente quando il gioco sarà di nuovo disponibile.
          </div>
        </div>
      )}
      {/* ── Daily Reward modal ── */}
      {!!dailyRewardModal && (
        <div style={{ position:"fixed", inset:0, zIndex:99997, background:"rgba(2,6,23,0.88)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div style={{ width:"min(420px,100%)", background:"linear-gradient(180deg,rgba(20,12,2,0.99),rgba(8,10,24,0.99))", border:"1px solid rgba(251,191,36,0.5)", borderRadius:16, boxShadow:"0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(251,191,36,0.12)", padding:"1.8rem", textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:"0.4rem" }}>🎁</div>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", fontWeight:700, letterSpacing:"0.04em", marginBottom:"0.3rem" }}>
              Premio Giornaliero
            </div>
            <div style={{ color:"#94a3b8", fontSize:"0.78rem", marginBottom:"1.2rem" }}>
              Giorno {dailyRewardModal.newStreak} di 7 — continua a tornare ogni giorno!
            </div>

            {/* 7-day strip */}
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:"1.4rem", flexWrap:"wrap" }}>
              {DAILY_REWARDS.map(r => {
                const done = r.day < dailyRewardModal.newStreak;
                const active = r.day === dailyRewardModal.newStreak;
                return (
                  <div key={r.day} style={{
                    width:44, padding:"6px 0",
                    borderRadius:10,
                    background: done ? "rgba(34,197,94,0.15)" : active ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.04)",
                    border: `2px solid ${done ? "#22c55e" : active ? "#fbbf24" : "rgba(255,255,255,0.08)"}`,
                    opacity: done ? 0.7 : 1,
                    transition:"all 0.2s",
                  }}>
                    <div style={{ fontSize:"1.3rem" }}>{done ? "✅" : r.icon}</div>
                    <div style={{ fontSize:"0.55rem", color: active ? "#fbbf24" : "#64748b", fontFamily:"'Cinzel',serif", marginTop:2 }}>
                      Gg {r.day}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Today's reward */}
            <div style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.3)", borderRadius:12, padding:"1rem", marginBottom:"1.4rem" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.3rem" }}>{dailyRewardModal.reward.icon}</div>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fde68a", fontSize:"1rem", fontWeight:700 }}>
                {dailyRewardModal.reward.label}
              </div>
            </div>

            <button
              onClick={async () => {
                const { reward, newStreak, today } = dailyRewardModal;
                setDailyRewardModal(null);
                setDailyStreak(me.id, { streak: newStreak, lastDate: today });
                // Applica ricompense
                let updated = { ...me, gold: (me.gold || 0) + reward.gold, xp: (me.xp || 0) + reward.xp };
                if(reward.item) {
                  const qty = reward.itemQty || 1;
                  const newItems = Array.from({ length: qty }, () => ({ id: reward.item + '_' + Date.now() + Math.random(), type: reward.item.startsWith('potion') ? 'potion' : 'material', itemId: reward.item, name: reward.item === 'potion_hp' ? 'Pozione di Cura' : reward.item === 'potion_atk' ? 'Pozione di Forza' : 'Gemma Rara', rarity:'uncommon' }));
                  updated = { ...updated, inventory: [...(me.inventory || []), ...newItems] };
                }
                await dbSavePlayer(updated);
                setMeRaw(updated);
              }}
              style={{ width:"100%", padding:"0.8rem", background:"linear-gradient(135deg,rgba(251,191,36,0.3),rgba(180,83,9,0.4))", border:"2px solid rgba(251,191,36,0.6)", borderRadius:10, color:"#fde68a", fontFamily:"'Cinzel',serif", fontSize:"0.95rem", fontWeight:700, cursor:"pointer", letterSpacing:"0.06em" }}
            >
              ✨ Ritira Premio!
            </button>

            {dailyRewardModal.newStreak < 7 && (
              <div style={{ marginTop:"0.8rem", color:"#475569", fontSize:"0.68rem" }}>
                Torna domani per il giorno {dailyRewardModal.newStreak + 1}!
                {dailyRewardModal.newStreak === 6 && " 👑 Domani il premio finale!"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Patch Notes modal ── */}
      {!!patchModal && (
        <div style={{ position:"fixed", inset:0, zIndex:99998, background:"rgba(2,6,23,0.82)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div style={{ width:"min(540px,100%)", background:"linear-gradient(180deg,rgba(17,24,39,0.99),rgba(8,10,24,0.99))", border:"1px solid rgba(251,191,36,0.35)", borderRadius:14, boxShadow:"0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(251,191,36,0.08)", padding:"1.6rem" }}>
            <div style={{ textAlign:"center", marginBottom:"1.2rem" }}>
              <div style={{ fontSize:"2.4rem", marginBottom:"0.5rem" }}>📋</div>
              <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.25rem", fontWeight:700, letterSpacing:"0.04em" }}>Novità dell'Aggiornamento</div>
              <div style={{ color:"#64748b", fontSize:"0.72rem", marginTop:4 }}>
                {new Date(patchModal.ts).toLocaleDateString("it-IT", { day:"numeric", month:"long", year:"numeric" })}
              </div>
            </div>
            <div style={{
              background:"rgba(0,0,0,0.35)", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:8, padding:"1rem", marginBottom:"1.2rem",
              color:"#cbd5e1", fontSize:"0.88rem", lineHeight:1.8,
              whiteSpace:"pre-wrap", maxHeight:320, overflowY:"auto",
            }}>
              {patchModal.notes}
            </div>
            <button
              onClick={() => {
                localStorage.setItem(`patchSeen_${patchModal.ts}`, "1");
                setPatchModal(null);
              }}
              style={{ width:"100%", padding:"0.75rem", background:"linear-gradient(135deg,rgba(120,80,10,0.5),rgba(180,100,10,0.4))", border:"1px solid rgba(251,191,36,0.5)", borderRadius:8, color:"#fbbf24", fontFamily:"'Cinzel',serif", fontSize:"0.9rem", fontWeight:700, cursor:"pointer", letterSpacing:"0.06em" }}>
              ✅ Capito, avventura!
            </button>
          </div>
        </div>
      )}

      {/* ── Donation modal ── */}
      {showDonation && (
        <div style={{ position:"fixed", inset:0, zIndex:9001, background:"rgba(2,6,23,0.82)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}
          onClick={() => setShowDonation(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width:"min(500px,100%)",
            background:"linear-gradient(180deg,rgba(17,24,39,0.99),rgba(8,10,24,0.99))",
            border:"1px solid rgba(251,191,36,0.3)",
            borderRadius:14, padding:"1.6rem",
            boxShadow:"0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(251,191,36,0.06)",
          }}>
            <div style={{ textAlign:"center", marginBottom:"1.2rem" }}>
              <div style={{ fontSize:"2.4rem", marginBottom:"0.4rem" }}>❤️</div>
              <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.15rem", fontWeight:700, letterSpacing:"0.04em" }}>
                Supporta Echoes of Zodar
              </div>
              <div style={{ color:"#64748b", fontSize:"0.75rem", marginTop:4 }}>
                Il gioco è gratuito — ogni contributo aiuta a mantenerlo vivo
              </div>
            </div>

            <div style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:8, padding:"1rem", marginBottom:"1.2rem", color:"#94a3b8", fontSize:"0.85rem", lineHeight:1.8 }}>
              <p style={{ margin:"0 0 0.6rem", color:"#cbd5e1", fontStyle:"italic" }}>
                "Echoes of Zodar è sviluppato da una sola persona, con passione e nel tempo libero.
                Ogni donazione aiuta a pagare i server, il dominio e a tenere vivo il sogno."
              </p>
              I tuoi aiuti coprono i costi di <strong style={{ color:"#cbd5e1" }}>server, database, dominio e strumenti</strong> che
              permettono al gioco di esistere. Anche un piccolo contributo fa la differenza — grazie di cuore! ❤️
            </div>

            <a
              href="https://paypal.me/echoesofzodar"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:"block", width:"100%", padding:"0.85rem",
                background:"linear-gradient(135deg,#003087,#009cde)",
                border:"none", borderRadius:8,
                color:"#fff", fontFamily:"'Cinzel',serif",
                fontSize:"0.95rem", fontWeight:700,
                textDecoration:"none", textAlign:"center",
                letterSpacing:"0.06em",
                boxShadow:"0 4px 16px rgba(0,150,220,0.3)",
                marginBottom:"0.7rem",
              }}
            >
              💙 Dona con PayPal
            </a>

            <div style={{ textAlign:"center", color:"#475569", fontSize:"0.7rem", marginBottom:"1rem" }}>
              echoesofzodargame@gmail.com · tutte le donazioni sono volontarie
            </div>

            <button
              onClick={() => setShowDonation(false)}
              style={{ width:"100%", padding:"0.6rem", background:"transparent", border:"1px solid #1f2937", borderRadius:8, color:"#64748b", cursor:"pointer", fontSize:"0.82rem" }}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:999, backdropFilter:"blur(2px)" }} />
      )}
      {deathScene && (
        <div style={{ position:"fixed", inset:0, zIndex:10000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(2,6,23,0.88)", padding:"1.5rem" }}>
          <div style={{ width:"min(560px,100%)", textAlign:"center", background:"linear-gradient(180deg, rgba(24,10,10,0.96), rgba(8,8,12,0.98))", border:"1px solid #7f1d1d", borderRadius:12, boxShadow:"0 24px 80px rgba(0,0,0,0.5)", padding:"2rem 1.5rem" }}>
            <div style={{ fontSize:"4rem", marginBottom:"0.8rem" }}>🩸</div>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fca5a5", fontSize:"1.8rem", marginBottom:"0.8rem" }}>Scheda Strappata</div>
            <div style={{ color:"#fecaca", fontSize:"1rem", lineHeight:1.7 }}>
              <strong>{deathScene.name}</strong> cade nell'oscurità. Le pagine della sua storia si lacerano, e il destino reclama il suo tributo.
            </div>
            <div style={{ color:"#9ca3af", fontSize:"0.85rem", marginTop:"1rem" }}>
              Il personaggio è perduto. Ritorno alla creazione di una nuova scheda...
            </div>
          </div>
        </div>
      )}
      {diceResult?.stage === "result" && (
        <div style={{ position:"fixed", bottom:"18%", left:"50%", transform:"translateX(-50%)", zIndex:10000, textAlign:"center", pointerEvents:"none" }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"2.8rem", fontWeight:700, color: diceResult.value===20?"#fbbf24": diceResult.value===1?"#f87171":"#e2d9c5", textShadow:"0 0 30px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.8)", letterSpacing:"0.08em", lineHeight:1 }}>
            {diceResult.value===20 ? "⚡ CRITICO!" : diceResult.value===1 ? "💀 FALLIMENTO!" : diceResult.label || ""}
          </div>
          <div style={{ fontSize:"4rem", fontWeight:900, color: diceResult.value===20?"#fbbf24": diceResult.value===1?"#f87171":"#fff", textShadow:"0 0 40px rgba(0,0,0,1)", marginTop:4, lineHeight:1 }}>
            {diceResult.value}
          </div>
          {diceResult.label && diceResult.value !== 20 && diceResult.value !== 1 && (
            <div style={{ fontSize:"1rem", color:"#94a3b8", marginTop:6, textShadow:"0 0 16px rgba(0,0,0,0.9)" }}>{diceResult.label}</div>
          )}
        </div>
      )}
      {/* SIDEBAR — drawer on mobile, fixed panel on desktop */}
      <aside style={{
        width: isMobile ? 270 : (combatMode ? 176 : 200),
        flexShrink: 0,
        background: combatMode ? "rgba(3,7,18,0.98)" : "rgba(4,8,18,0.97)",
        borderRight: "1px solid rgba(148,163,184,0.14)",
        display: "flex", flexDirection: "column", gap: 8,
        padding: combatMode ? "0.85rem 0.7rem" : "0.7rem",
        overflowY: "auto",
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (sidebarOpen ? 0 : -280) : "auto",
        top: 0, height: isMobile ? "100vh" : "auto",
        zIndex: isMobile ? 1000 : 1,
        transition: isMobile ? "left 0.27s ease" : "none",
        backdropFilter: "blur(8px)",
        boxShadow: combatMode ? "inset -1px 0 0 rgba(239,68,68,0.12)" : "none",
      }}>
        {/* Mobile close button */}
        {isMobile && (
          <button onClick={()=>setSidebarOpen(false)} style={{ alignSelf:"flex-end", background:"rgba(255,255,255,0.06)", border:"1px solid #1f2937", borderRadius:6, color:"#94a3b8", padding:"4px 10px", cursor:"pointer", fontSize:"1rem", marginBottom:4 }}>✕</button>
        )}
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.75rem", color:"#4c1d95", letterSpacing:"0.1em", paddingBottom:8, borderBottom:"1px solid #0f172a" }}>⚔️ {getMeta().worldName}</div>
        <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #3b0764", borderRadius:5, padding:"0.6rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
            <ArtThumb src={getPlayerPortrait(me)} alt={me?.name || "Eroe"} size={56} radius={14} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#f9fafb", fontSize:"0.82rem", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{me?.name}</div>
              <div style={{ color:"#94a3b8", fontSize:"0.62rem" }}>{RACES[me?.race]?.name} {CLASSES[me?.class]?.name}</div>
              {(() => { const t = getPlayerTitle(me?.stats); return t ? <div style={{ fontSize:"0.6rem", color: t.tier===4?"#fbbf24":t.tier===3?"#a855f7":t.tier===2?"#22c55e":"#94a3b8", fontStyle:"italic" }}>{t.icon} {t.title}</div> : null; })()}
            </div>
            <span style={{ padding:"1px 5px", background:"#3b0764", borderRadius:3, fontSize:"0.62rem", color:"#a78bfa", flexShrink:0 }}>Lv.{me.level}</span>
          </div>
          <HpBar cur={me.hp} max={me.maxHp} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", marginTop:4 }}>
            <span style={{ color:"#f87171" }}>❤️{me.hp}/{me.maxHp}</span>
            <span style={{ color:"#fb923c" }}>⚔️{me.atk}</span>
            <span style={{ color:"#60a5fa" }}>🛡️{me.def}</span>
          </div>
          {isCaster && (
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", marginTop:4 }}>
              <span style={{ color:"#a78bfa" }}>✨{me.mag}</span>
              <span style={{ color:"#c4b4ff" }}>📿 Slot: {totalSlots(spellSlots)} ({formatSpellSlots(spellSlots)})</span>
            </div>
          )}
          <div style={{ height:3, background:"#0f172a", borderRadius:2, overflow:"hidden", marginTop:5 }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg,#6d28d9,#a78bfa)", width:`${Math.min(100,me.xp/xpForLevel(me.level)*100)}%`, transition:"width .5s" }} />
          </div>
          <div style={{ fontSize:"0.58rem", color:"#64748b", textAlign:"right", marginTop:1 }}>{me.xp}/{xpForLevel(me.level)} XP</div>
          <div style={{ marginTop:6, padding:"0.35rem 0.45rem", background:"rgba(180,83,9,0.12)", border:"1px solid #78350f", borderRadius:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"0.58rem", color:"#92400e", textTransform:"uppercase", letterSpacing:"0.08em" }}>Tesoro</span>
            <span style={{ fontSize:"0.74rem", color:"#fbbf24", fontWeight:700 }}>💰 {me.gold || 0} oro</span>
          </div>
          <button onClick={toggleAfk} title={isAfk ? "Sei in modalità AFK — non partecipi alle battaglie. Clicca per tornare attivo." : "Sei attivo — clicca per passare in modalità AFK e non essere incluso nelle battaglie."} style={{ marginTop:6, width:"100%", padding:"0.3rem 0.4rem", background: isAfk ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.1)", border:`1px solid ${isAfk ? "#7f1d1d" : "#14532d"}`, borderRadius:4, color: isAfk ? "#f87171" : "#4ade80", fontSize:"0.62rem", cursor:"pointer", letterSpacing:"0.06em", textAlign:"center" }}>
            {isAfk ? "⏸ AFK — Non in battaglia" : "✅ Attivo — Pronto a combattere"}
          </button>
          <MusicToggleBtn />
          <VoiceChat
            myId={myId}
            myName={me?.name || "Avventuriero"}
            partyCode={code}
            supabase={supabase}
            hasCrystal={equippedItems?.amulet?.id === "crystal_sintonia"}
          />
        </div>

        <div style={{ background:PANEL_BG_SOFT, border:`1px solid ${PANEL_BORDER}`, borderRadius:4, padding:"0.5rem" }}>
          <div style={{ fontSize:"0.58rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>👥 Party — {code}</div>
          {partyPlayers.filter(p=>p.id!==myId).map(p=>(
            <div key={p?.id} style={{ display:"flex", gap:5, alignItems:"center", marginBottom:3 }}>
              <span style={{ fontSize:"0.9rem" }}>{CLASSES[p?.class||'warrior']?.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.72rem", color:"#d1d5db", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p?.name}</div>
                <div style={{ height:2, background:"#0f172a", borderRadius:1, overflow:"hidden", marginTop:1 }}>
                  <div style={{ height:"100%", background:(p?.hp||0)/(p?.maxHp||1)>0.5?"#22c55e":(p?.hp||0)/(p?.maxHp||1)>0.25?"#f59e0b":"#ef4444", width:`${Math.min(100,(p?.hp||0)/(p?.maxHp||1)*100)}%` }} />
                </div>
              </div>
              <span style={{ fontSize:"0.6rem", color:"#94a3b8", flexShrink:0 }}>Lv.{p?.level||1}</span>
            </div>
          ))}
          {partyPlayers.length<=1&&<div style={{ color:"#1f2937", fontSize:"0.68rem" }}>Solo per ora</div>}
          <JoinPartyWidget myId={myId} currentCode={code} />
        </div>

        {currentQ && (
          <div style={{ background:"rgba(180,83,9,0.08)", border:"1px solid #78350f", borderRadius:4, padding:"0.5rem" }}>
            <div style={{ fontSize:"0.58rem", color:"#78350f", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>📜 Missione</div>
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
            <div style={{ color:myTurn?"#fca5a5":"#6b7280", fontSize:"0.75rem", fontWeight:700 }}>{myDeathTurn?"🕯️ SALVEZZA CONTRO LA MORTE":myTurn?"⚔️ TUO TURNO!":"Attendi..."}</div>
            {myCombatant?.dying && (
              <div style={{ marginTop:4, fontSize:"0.65rem", color:"#fecaca" }}>
                Successi {myCombatant.deathSuccesses || 0}/3 • Fallimenti {myCombatant.deathFailures || 0}/3
              </div>
            )}
          </div>
        )}
        {(() => {
          const myLeg = qs?.masterBuffs?.[myId]?.legendaryItem;
          if(!myLeg || myLeg.turnsLeft <= 0) return null;
          return (
            <div style={{ background:"rgba(76,29,149,0.3)", border:"1px solid #7c3aed", borderRadius:4, padding:"0.4rem 0.5rem" }}>
              <div style={{ fontSize:"0.58rem", color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>🏆 Oggetto Leggendario</div>
              <div style={{ fontSize:"0.72rem", color:"#c4b5fd", fontWeight:700 }}>{myLeg.emoji} {myLeg.name}</div>
              <div style={{ fontSize:"0.6rem", color:"#a78bfa", marginTop:1 }}>✅ Si applica automaticamente</div>
              <div style={{ fontSize:"0.6rem", color:"#7c3aed", marginTop:1 }}>{myLeg.turnsLeft} turni rimasti</div>
            </div>
          );
        })()}

        <button
          onClick={()=>setScreen("landing")}
          style={{
            marginTop:"auto",
            padding:"0.8rem 0.95rem",
            background:"linear-gradient(135deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98))",
            border:"1px solid rgba(251,191,36,0.42)",
            borderRadius:8,
            color:"#f8e7b9",
            cursor:"pointer",
            fontSize:"0.84rem",
            fontFamily:"'Cinzel',serif",
            fontWeight:700,
            letterSpacing:"0.05em",
            textAlign:"center",
            boxShadow:"0 10px 24px rgba(0,0,0,0.24)",
          }}
        >
          ← Esci al Menu
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:combatMode?"rgba(2,6,23,0.52)":"rgba(2,6,23,0.28)", position:"relative", zIndex:1, backdropFilter:"blur(2px)" }}>
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${PANEL_BORDER}`, background:combatMode?"rgba(8,10,20,0.94)":"rgba(3,7,18,0.88)", flexShrink:0, overflowX:"auto", overflowY:"hidden" }}>
          {/* Hamburger — mobile only */}
          {isMobile && (
            <button onClick={()=>setSidebarOpen(true)} style={{ flexShrink:0, padding:"0 1rem", background:"transparent", border:"none", borderBottom:"2px solid transparent", color:"#94a3b8", cursor:"pointer", fontSize:"1.1rem" }}>☰</button>
          )}
          {[["quest","📜 Missioni"],["story","📖 Storia"],["storylibrary","📚 Storie"],["inventory","🎒 Inventario"],["equipment","🎽 Equip"],["level","⭐ Livello"],["diary","📖 Diario"],["shop","🛒 Negozio"],["forge","⚒️ Forgia"],["chat","💬 Chat"],["spells","✨ Magie"],["dungeon","🗺️ Dungeon"],["guild","🏛️ Gilda"],["worldevent","🌋 Evento"],["leaderboard","🏆 Classifiche"],["trade","🏦 Mercato"],["combat","⚔️ Battaglia"]].map(([k,l])=>{
            const isResting = !!(qs?.rest?.endsAt && new Date(qs.rest.endsAt) > new Date());
            const combatLocked = !!combat?.active && !["inventory","equipment","combat"].includes(k);
            const locked = combatLocked || isResting;
            return (
            <button key={k} onClick={()=>{ if(!locked){ setTab(k); if(isMobile) setSidebarOpen(false); if(k==="guild") refreshGuilds(); } }} title={isResting?"Riposo in corso…":combatLocked?"Non disponibile durante il combattimento":undefined}
              style={{ flexShrink:0, padding: isMobile?"0.6rem 0.8rem":"0.6rem 1.2rem", background:tab===k&&!isResting?"rgba(109,40,217,0.2)":"transparent", border:"none", borderBottom:tab===k&&!isResting?"2px solid #7c3aed":"2px solid transparent", color:locked?"#2d3748":tab===k?"#c4b5fd":"#94a3b8", cursor:locked?"not-allowed":"pointer", fontFamily:"'Cinzel',serif", fontSize: isMobile?"0.7rem":"0.78rem", letterSpacing:"0.05em", opacity:locked?0.35:1, whiteSpace:"nowrap", filter:isResting?"grayscale(1)":"none" }}>
              {l}{k==="combat"&&combat?.active&&<span style={{ marginLeft:5, padding:"1px 5px", background:"#7f1d1d", borderRadius:10, fontSize:"0.62rem", color:"#fca5a5" }}>LIVE</span>}{k==="combat"&&combat?.active&&!combat?.pendingLog&&combat?.combatants?.[combat.turn%Math.max(1,combat.combatants.length)]?.id===myId&&tab!=="combat"&&<span style={{ marginLeft:4, display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#ef4444", boxShadow:"0 0 6px #ef4444", animation:"pulse 1s infinite" }} />}{k==="dungeon"&&qs?.dungeon?.active&&!qs?.dungeon?.completedAt&&<span style={{ marginLeft:5, padding:"1px 5px", background:"#701a75", borderRadius:10, fontSize:"0.62rem", color:"#e879f9" }}>LIVE</span>}
            </button>);
          })}
          {/* Donation button in navbar */}
          <button
            onClick={() => setShowDonation(true)}
            title="Supporta il gioco"
            style={{
              flexShrink:0, marginLeft:"auto", padding:"0 1rem",
              background:"linear-gradient(135deg,rgba(251,191,36,0.12),rgba(180,83,9,0.18))",
              border:"none", borderBottom:"2px solid rgba(251,191,36,0.35)",
              color:"#fbbf24", cursor:"pointer", fontFamily:"'Cinzel',serif",
              fontSize: isMobile?"0.68rem":"0.75rem", letterSpacing:"0.06em",
              whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5,
              transition:"background 0.15s, color 0.15s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(251,191,36,0.22)"; e.currentTarget.style.color="#fde68a"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="linear-gradient(135deg,rgba(251,191,36,0.12),rgba(180,83,9,0.18))"; e.currentTarget.style.color="#fbbf24"; }}
          >
            ❤️{!isMobile && " Dona"}
          </button>
        </div>

        <div key={tab} style={{ flex:1, display:"contents", animation:"tabFadeIn 0.18s ease" }}>
        {tab==="chat" && (() => {
          const CHANNELS = [
            { key:"party",  label:"⚔️ Party",  accent:"#6366f1", bg:"rgba(99,102,241,0.2)",  icon:"⚔️",  hint:`Codice: ${code||"—"}` },
            { key:"world",  label:"🌍 Mondo",  accent:"#10b981", bg:"rgba(16,185,129,0.18)", icon:"🌍",  hint:"Visibile a tutti" },
            { key:"master", label:"📯 Master", accent:"#f59e0b", bg:"rgba(245,158,11,0.18)", icon:"📯",  hint:"Si azzera ogni settimana" },
          ];
          const ch = CHANNELS.find(c => c.key === chatChannel) || CHANNELS[0];
          const shownMsgs = chatChannel === "party" ? visibleChatMessages : chatChannel === "world" ? worldMessages : masterMessages;
          return (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              {/* Channel selector */}
              <div style={{ flexShrink:0, display:"flex", gap:6, padding:"0.6rem 0.8rem", background:"rgba(2,6,23,0.92)", borderBottom:"1px solid #1e293b", flexWrap:"wrap", alignItems:"center" }}>
                {CHANNELS.map(c => (
                  <button key={c.key} onClick={()=>setChatChannel(c.key)} style={{
                    padding:"0.4rem 1rem", borderRadius:6, cursor:"pointer",
                    fontFamily:"'Cinzel',serif", fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.04em",
                    background: chatChannel===c.key ? c.bg : "rgba(15,23,42,0.6)",
                    border: `1px solid ${chatChannel===c.key ? c.accent : "#334155"}`,
                    color: chatChannel===c.key ? c.accent : "#64748b",
                    transition:"all 0.15s",
                  }}>{c.label}</button>
                ))}
                <span style={{ marginLeft:"auto", color:"#475569", fontSize:"0.7rem", alignSelf:"center" }}>{ch.hint}</span>
              </div>
              {/* Master notice banner */}
              {chatChannel === "master" && (
                <div style={{ flexShrink:0, padding:"0.5rem 1rem", background:"rgba(120,80,0,0.18)", borderBottom:"1px solid rgba(245,158,11,0.2)", color:"#92400e", fontSize:"0.74rem" }}>
                  📯 Canale Master — fai domande al Master o leggi i suoi comunicati. I messaggi si azzerano ogni domenica.
                </div>
              )}
              {/* Messages */}
              <div style={{ flex:1, overflowY:"auto", padding:"0.8rem", display:"flex", flexDirection:"column", gap:6, background:"rgba(2,6,23,0.45)" }}>
                {shownMsgs.length === 0 && (
                  <div style={{ textAlign:"center", padding:"3rem 1rem" }}>
                    <div style={{ fontSize:"2.5rem", marginBottom:"0.6rem" }}>{ch.icon}</div>
                    <div style={{ color:"#475569", fontSize:"0.86rem" }}>Nessun messaggio ancora.</div>
                    <div style={{ color:"#334155", fontSize:"0.78rem", marginTop:"0.4rem" }}>Sii il primo a scrivere.</div>
                  </div>
                )}
                {shownMsgs.map(msg => (
                  <div key={msg.id} style={{ padding:"0.55rem 0.85rem", borderRadius:6, background:"rgba(15,23,42,0.82)", borderLeft:`3px solid ${ch.accent}`, display:"flex", flexDirection:"column", gap:2 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:8 }}>
                      <span style={{ fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", color:ch.accent, fontFamily:"'Cinzel',serif", fontWeight:700 }}>{msg.author || "Anonimo"}</span>
                      <span style={{ fontSize:"0.62rem", color:"#334155" }}>{new Date(msg.created_at).toLocaleString("it-IT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                    <div style={{ fontSize:"0.88rem", lineHeight:1.6, color:"#e2e8f0" }} dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>
              {/* Input */}
              <div style={{ display:"flex", gap:8, padding:"0.65rem 0.8rem", borderTop:`1px solid ${ch.accent}33`, background:"rgba(2,6,23,0.95)", flexShrink:0 }}>
                <input ref={inputRef}
                  style={{ flex:1, padding:"0.6rem 0.85rem", background:"rgba(15,23,42,0.7)", border:`1px solid ${ch.accent}55`, borderRadius:6, color:"#e2e8f0", fontSize:"0.9rem", outline:"none" }}
                  placeholder={chatChannel==="party" ? `${me?.name||"Tu"} al party…` : chatChannel==="world" ? `${me?.name||"Tu"} al mondo…` : `${me?.name||"Tu"} al Master…`}
                  value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleInput()} autoComplete="off" />
                <button onClick={handleInput} style={{ padding:"0.6rem 1rem", background:ch.bg, border:`1px solid ${ch.accent}`, borderRadius:6, color:ch.accent, cursor:"pointer", fontSize:"1rem", flexShrink:0 }}>
                  {ch.icon}
                </button>
              </div>
            </div>
          );
        })()}
        {tab==="story" && (() => {
          const abandonedKey = `eoz_story_abandoned_${myId}`;
          const abandonedId = localStorage.getItem(abandonedKey);
          const hasAbandoned = abandonedId && abandonedId === storyState?.storyId;
          // Clear flag if story changed or ended
          if(abandonedId && abandonedId !== storyState?.storyId) localStorage.removeItem(abandonedKey);
          if(hasAbandoned) return (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", textAlign:"center" }}>
              <div>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📖</div>
                <div style={{ color:"#475569", fontFamily:"'Cinzel',serif" }}>Hai abbandonato questa storia.</div>
                <div style={{ color:"#334155", fontSize:"0.82rem", marginTop:"0.5rem", marginBottom:"1.2rem" }}>La storia è ancora in corso.</div>
                <button
                  onClick={()=>{ localStorage.removeItem(abandonedKey); setTab("story"); }}
                  style={{ padding:"0.6rem 1.4rem", background:"linear-gradient(135deg,#6366f1,#4f46e5)", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.85rem", fontWeight:700 }}
                >📖 Rientra nella storia</button>
              </div>
            </div>
          );
          return (
            <>{pendingStoryChoice ? (
              <div style={{ padding:"1.2rem", background:"rgba(15,23,42,0.92)", border:"2px solid #6d28d9", borderRadius:12, display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#a78bfa", fontWeight:700, fontSize:"1rem" }}>🔀 Scelta effettuata</div>
                <div style={{ fontSize:"0.88rem", color:"#e2d9c5" }}>Hai scelto: <em>"{pendingStoryChoice.text}"</em></div>
                <button onClick={async () => { const idx = pendingStoryChoice.idx; setPendingStoryChoice(null); await makeStoryChoice(idx); }}
                  style={{ padding:"0.65rem 1.2rem", background:"#6d28d9", border:"none", borderRadius:8, color:"#fff", fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"0.9rem", cursor:"pointer", letterSpacing:"0.04em" }}>
                  Avanti →
                </button>
              </div>
            ) : (
            <StoryView
              story={activeStory}
              scene={activeStoryScene}
              storyState={storyState}
              isLeader={isStoryLeader}
              me={me}
              myId={myId}
              partyPlayers={partyPlayers}
              onAdvance={advanceStoryScene}
              onChoice={(idx) => { const c = activeStoryScene?.choices?.[idx]; setPendingStoryChoice({ idx, text: c?.text || "" }); }}
              onVote={castStoryVote}
              onFight={startStoryCombat}
              onSkillCheck={makeStorySkillCheck}
              onLeave={()=>{ localStorage.setItem(`eoz_story_abandoned_${myId}`, storyState?.storyId); setTab("quest"); }}
            />
            )}</>
          );
        })()}
        {tab==="storylibrary" && (
          <PlayerStoryLibrary
            stories={[...STORIES, ...customStories]}
            storyState={storyState}
            myId={myId}
            onStartSolo={storyId => startStory(storyId, "solo")}
            onStartParty={storyId => startStory(storyId, "party")}
            setTab={setTab}
          />
        )}
        {tab==="level" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(2,6,23,0.45)" }}>
            <div style={{ maxWidth:760, margin:"0 auto" }}>
              <Card title="⭐ Aumenta di Livello">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10, marginBottom:"1rem" }}>
                  <div style={{ background:"rgba(15,23,42,0.84)", border:"1px solid #334155", borderRadius:6, padding:"0.85rem" }}>
                    <div style={{ color:"#94a3b8", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Livello attuale</div>
                    <div style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontSize:"1.8rem", fontWeight:700 }}>{me.level}</div>
                  </div>
                  <div style={{ background:"rgba(15,23,42,0.84)", border:"1px solid #334155", borderRadius:6, padding:"0.85rem" }}>
                    <div style={{ color:"#94a3b8", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Esperienza</div>
                    <div style={{ color:"#e2e8f0", fontFamily:"'Cinzel',serif", fontSize:"1.2rem", fontWeight:700 }}>{me.xp || 0}/{nextLevelXp} XP</div>
                  </div>
                  <div style={{ background:"rgba(15,23,42,0.84)", border:"1px solid #334155", borderRadius:6, padding:"0.85rem" }}>
                    <div style={{ color:"#94a3b8", fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Classe</div>
                    <div style={{ color:"#e2e8f0", fontFamily:"'Cinzel',serif", fontSize:"1.1rem", fontWeight:700 }}>{CLASSES[me.class]?.name || me.class}</div>
                  </div>
                </div>
                <div style={{ height:9, background:"#0f172a", border:"1px solid #1e293b", borderRadius:999, overflow:"hidden", marginBottom:"0.9rem" }}>
                  <div style={{ height:"100%", background:canLevelUp?"linear-gradient(90deg,#f59e0b,#fbbf24)":"linear-gradient(90deg,#6d28d9,#a78bfa)", width:`${Math.min(100,((me.xp||0)/nextLevelXp)*100)}%`, transition:"width .4s" }} />
                </div>
                <div style={{ background:canLevelUp?"rgba(180,83,9,0.18)":"rgba(15,23,42,0.7)", border:`1px solid ${canLevelUp?"#f59e0b":"#334155"}`, borderRadius:6, padding:"0.9rem", marginBottom:"1rem" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:canLevelUp?"#fbbf24":"#cbd5e1", fontWeight:700, marginBottom:6 }}>
                    {canLevelUp ? `Pronto per il livello ${me.level + 1}` : `Mancano ${Math.max(0,nextLevelXp-(me.xp||0))} XP al livello ${me.level + 1}`}
                  </div>
                  <div style={{ color:"#cbd5e1", fontSize:"0.86rem", lineHeight:1.6 }}>
                    Bonus della tua classe: <strong>{currentLevelGain.label}</strong>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:8, marginBottom:"1rem" }}>
                  {[
                    ["HP", me.maxHp, nextLevelPreview?.maxHp],
                    ["ATK", me.atk, nextLevelPreview?.atk],
                    ["DEF", me.def, nextLevelPreview?.def],
                    ["MAG", me.mag, nextLevelPreview?.mag],
                    ...(isCaster ? [["MANA", totalSlots(getSpellSlots(me.level)), totalSlots(getSpellSlots((me.level||1)+1))]] : []),
                  ].map(([label, current, next])=>(
                    <div key={label} style={{ background: label==="MANA" ? "rgba(76,29,149,0.25)" : "rgba(2,6,23,0.58)", border: label==="MANA" ? "1px solid #7c3aed" : "1px solid #1e293b", borderRadius:6, padding:"0.75rem", textAlign:"center" }}>
                      <div style={{ color: label==="MANA" ? "#a78bfa" : "#94a3b8", fontSize:"0.68rem", letterSpacing:"0.08em" }}>{label==="MANA" ? "🔮 MANA" : label}</div>
                      <div style={{ color:"#f8fafc", fontSize:"1rem", fontWeight:700 }}>{current} {canLevelUp && <span style={{ color:"#fbbf24" }}>→ {next}</span>}</div>
                    </div>
                  ))}
                </div>
                {isCaster && (() => {
                  const slots = getSpellSlots(me.level || 1);
                  const nextSlots = getSpellSlots((me.level||1)+1);
                  return (
                    <div style={{ background:"rgba(76,29,149,0.18)", border:"1px solid #7c3aed44", borderRadius:6, padding:"0.65rem 0.85rem", marginBottom:"1rem" }}>
                      <div style={{ color:"#a78bfa", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Slot incantesimo per livello</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {[1,2,3,4,5].filter(t=>slots[t]>0||nextSlots[t]>0).map(t=>(
                          <div key={t} style={{ background:"rgba(2,6,23,0.6)", border:"1px solid #4c1d95", borderRadius:4, padding:"4px 10px", textAlign:"center" }}>
                            <div style={{ color:"#7c3aed", fontSize:"0.55rem", textTransform:"uppercase" }}>Tier {t}</div>
                            <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:"0.9rem" }}>
                              {slots[t]}{canLevelUp && nextSlots[t]!==slots[t] && <span style={{ color:"#fbbf24" }}>→{nextSlots[t]}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                {/* D&D Ability Scores */}
                {(() => {
                  const scores = getAbilityScores(me);
                  const profBonus = getProficiencyBonus(me.level || 1);
                  const spellAbility = spellcastingAbilityForClass(me.class);
                  return (
                    <div style={{ marginBottom:"1rem" }}>
                      <div style={{ color:"#94a3b8", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Caratteristiche — Bonus competenza: {signedModifier(profBonus)}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
                        {Object.entries(ABILITY_LABELS).map(([key, {short, name}]) => {
                          const score = scores[key] ?? 10;
                          const mod = abilityModifier(score);
                          const isSpell = key === spellAbility;
                          return (
                            <div key={key} style={{ background:"rgba(2,6,23,0.7)", border:`1px solid ${isSpell ? "#a78bfa" : "#1e293b"}`, borderRadius:6, padding:"0.6rem 0.4rem", textAlign:"center", position:"relative" }}>
                              {isSpell && <div style={{ position:"absolute", top:2, right:4, fontSize:"0.5rem", color:"#a78bfa" }}>*</div>}
                              <div style={{ color:"#94a3b8", fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>{short}</div>
                              <div style={{ color:"#f8fafc", fontSize:"1.35rem", fontWeight:700, lineHeight:1.1 }}>{score}</div>
                              <div style={{ color: mod >= 0 ? "#34d399" : "#f87171", fontSize:"0.85rem", fontWeight:700 }}>{signedModifier(mod)}</div>
                              <div style={{ color:"#475569", fontSize:"0.55rem" }}>{name}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ color:"#64748b", fontSize:"0.65rem", marginTop:4 }}>* = abilita da incantatore</div>
                    </div>
                  );
                })()}
                <BigBtn onClick={handleLevelUp} gold disabled={!canLevelUp}>Aumenta di livello</BigBtn>
              </Card>

              {/* ── Subclass ── */}
              {me.level >= 6 && (() => {
                const sc = me.subclass ? getSubclassOptions(me.class).find(s => s.id === me.subclass) : null;
                return (
                  <Card title="🌟 Sottoclasse">
                    {sc ? (
                      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                        <span style={{ fontSize:"2.5rem" }}>{sc.emoji}</span>
                        <div>
                          <div style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontWeight:700, fontSize:"1.05rem" }}>{sc.name}</div>
                          <div style={{ color:"#94a3b8", fontSize:"0.82rem", marginTop:2 }}>{sc.desc}</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                        <span style={{ color:"#fbbf24", fontSize:"0.9rem" }}>Hai raggiunto il livello 6 — scegli la tua sottoclasse!</span>
                        <button onClick={() => setShowSubclassModal(true)} style={{ padding:"0.5rem 1.2rem", background:"rgba(109,40,217,0.3)", border:"1px solid #7c3aed", borderRadius:8, color:"#c4b5fd", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.85rem" }}>Scegli ora</button>
                      </div>
                    )}
                  </Card>
                );
              })()}

              {/* ── Achievements ── */}
              <Card title="🏆 Achievement">
                {(() => {
                  const stats = me?.stats || {};
                  const unlocked = new Set(stats.achievements || []);
                  const TIER_COLORS = { 1:"#94a3b8", 2:"#22c55e", 3:"#a855f7", 4:"#fbbf24" };
                  const TIER_LABELS = { 1:"Comune", 2:"Non comune", 3:"Raro", 4:"Leggendario" };
                  const tiers = [4,3,2,1];
                  return (
                    <div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:6, marginBottom:"0.75rem" }}>
                        {[["Mostri abbattuti", stats.monstersKilled||0,"💀"],["Missioni completate",stats.questsCompleted||0,"📜"],["Danni totali",stats.totalDamage||0,"⚔️"],["Critici",stats.criticalHits||0,"🎯"],["Death save superati",stats.deathSavesSurvived||0,"👻"]].map(([label,val,icon])=>(
                          <div key={label} style={{ background:"rgba(15,23,42,0.7)", border:"1px solid #1e293b", borderRadius:6, padding:"0.6rem 0.75rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ color:"#94a3b8", fontSize:"0.7rem" }}>{icon} {label}</span>
                            <span style={{ color:"#f8fafc", fontWeight:700, fontSize:"0.88rem" }}>{val.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      {tiers.map(tier => {
                        const tierAchs = ACHIEVEMENTS.filter(a => a.tier === tier);
                        return (
                          <div key={tier} style={{ marginBottom:"0.75rem" }}>
                            <div style={{ fontSize:"0.65rem", color: TIER_COLORS[tier], textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:"'Cinzel',serif", marginBottom:5, borderBottom:`1px solid ${TIER_COLORS[tier]}33`, paddingBottom:3 }}>{TIER_LABELS[tier]}</div>
                            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:5 }}>
                              {tierAchs.map(a => {
                                const done = unlocked.has(a.id);
                                return (
                                  <div key={a.id} style={{ background: done ? `rgba(${tier===4?"251,191,36":tier===3?"168,85,247":tier===2?"34,197,94":"148,163,184"},0.08)` : "rgba(15,23,42,0.6)", border:`1px solid ${done ? TIER_COLORS[tier] : "#1e293b"}`, borderRadius:7, padding:"0.55rem 0.7rem", opacity: done ? 1 : 0.45, transition:"opacity 0.3s" }}>
                                    <div style={{ fontSize:"1.4rem", marginBottom:2 }}>{a.icon}</div>
                                    <div style={{ color: done ? TIER_COLORS[tier] : "#64748b", fontFamily:"'Cinzel',serif", fontSize:"0.72rem", fontWeight:700 }}>{a.title}</div>
                                    <div style={{ color:"#475569", fontSize:"0.63rem", marginTop:2, lineHeight:1.3 }}>{a.desc}</div>
                                    {done && <div style={{ fontSize:"0.6rem", color: TIER_COLORS[tier], marginTop:3, fontStyle:"italic" }}>✓ Sbloccato</div>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </Card>
            </div>
          </div>
        )}
        {tab==="inventory" && (() => {
          const myLegBuff = qs?.masterBuffs?.[myId]?.legendaryItem;
          return (
            <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
              {myLegBuff && myLegBuff.turnsLeft > 0 && (
                <div style={{ margin:"0.75rem 1rem 0", padding:"0.75rem 1rem", background:"linear-gradient(135deg,rgba(76,29,149,0.35),rgba(109,40,217,0.2))", border:"1.5px solid #7c3aed", borderRadius:10, display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:"1.6rem" }}>{myLegBuff.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, color:"#c4b5fd", fontSize:"0.9rem" }}>{myLegBuff.name}</div>
                    <div style={{ fontSize:"0.72rem", color:"#a78bfa", marginTop:2 }}>{myLegBuff.desc}</div>
                    <div style={{ fontSize:"0.7rem", color:"#6d28d9", marginTop:3 }}>
                      {myLegBuff.type === "weapon" && `⚔️ ${myLegBuff.weapon_die} +${myLegBuff.bonus_atk} ATK`}
                      {myLegBuff.type === "armor" && `🛡️ +${myLegBuff.bonus_def} DEF`}
                      {myLegBuff.type === "magic" && `✨ +${myLegBuff.bonus_mag} MAG`}
                      <span style={{ marginLeft:8, color:"#fbbf24" }}>⏱ {myLegBuff.turnsLeft} turni rimasti</span>
                    </div>
                  </div>
                  <div style={{ fontSize:"0.65rem", color:"#7c3aed", background:"rgba(109,40,217,0.2)", border:"1px solid #6d28d9", borderRadius:999, padding:"2px 8px", whiteSpace:"nowrap" }}>Dono del Master</div>
                </div>
              )}
              <InventoryView
                loading={inventoryLoading}
                groups={inventoryGroups}
                equipment={equipment}
                onEquip={equipItem}
                onSell={handleInventorySell}
                onUse={usePotion}
                canUseConsumables={(me?.hp || 0) > 0 && !myCombatant?.dying && !myCombatant?.dead && !myCombatant?.stable}
              />
            </div>
          );
        })()}
        {tab==="trade" && (
          <AuctionHouseView
            me={me}
            groups={inventoryGroups}
            auctions={auctions}
            loading={auctionsLoading || inventoryLoading}
            busy={auctionBusy}
            onRefresh={refreshAuctions}
            onCreateAuction={createAuction}
            onBid={bidAuction}
            onCancel={cancelAuction}
            onSettle={settleAuction}
          />
        )}
        {tab==="donate" && (
          <DonateView
            me={me}
            players={partyPlayers}
            groups={inventoryGroups}
            loading={inventoryLoading}
            onTrade={handlePartyTrade}
          />
        )}
        {tab==="equipment" && (
          <EquipmentView
            me={me}
            equippedItems={equippedItems}
            equippedWeapon={equippedWeapon}
            onUnequip={unequipItem}
            onEquip={equipItem}
            inventoryGroups={inventoryGroups}
            onSell={handleInventorySell}
            onUse={usePotion}
            canUseConsumables={!combat}
            isMobile={isMobile}
          />
        )}
        {tab==="spells" && isCaster && (
          <SpellbookView
            spellsByLevel={Object.entries(availableSpells.reduce((acc, spell) => {
              const lvl = Number(spell.slots || 0);
              if(!acc[lvl]) acc[lvl] = [];
              acc[lvl].push(spell);
              return acc;
            }, {})).sort((a,b)=>Number(a[0]) - Number(b[0])).reduce((acc, [lvl, spells]) => ({ ...acc, [lvl]: spells }), {})}
            preparedSpellIds={preparedSpellIds}
            preparedCount={preparedNormalSpellCount}
            maxPrepared={maxPreparedSpells}
            onTogglePrepared={togglePreparedSpell}
          />
        )}
        {tab==="spells" && !isCaster && (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b", fontFamily:"'Cinzel',serif" }}>
            Questo eroe non usa magia.
          </div>
        )}
        {tab==="shop" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
            <ShopView
              key={qs?.longRestSeed || 0}
              me={me}
              items={catalogItems.filter(i=>i.available || i.id==="potion_escape" || i.id==="crystal_sintonia")}
              loading={inventoryLoading}
              error={null}
              inventoryCounts={inventoryCounts}
              onBuy={buyItem}
              restSeed={qs?.longRestSeed || 0}
            />
          </div>
        )}

        {tab==="forge" && (
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", background:"rgba(3,7,18,0.5)" }}>
            <ForgeView
              me={me}
              inventory={inventory}
              inventoryCounts={inventoryCounts}
              catalogItems={catalogItems}
              onForge={handleForge}
              loading={inventoryLoading}
            />
          </div>
        )}

        {tab==="dungeon" && (
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", background:"rgba(3,7,18,0.5)" }}>
            {(() => {
              const today = new Date().toLocaleDateString('en-CA');
              const dailyEv = generateDailyEvent(code || '', today);
              const claimed = (qs?.dailyEvent?.date === today && qs?.dailyEvent?.claimedBy?.includes(myId));
              return <DailyEventBanner event={dailyEv} claimed={claimed} onClaim={handleClaimDailyEvent} loading={false} />;
            })()}
            <DungeonView dungeon={qs?.dungeon} me={me} onRoomAction={handleDungeonRoomAction} loading={false} />
          </div>
        )}

        {tab==="leaderboard" && (
          <GlobalLeaderboardView myId={myId} partyCode={code} />
        )}

        {tab==="worldevent" && (
          <PlayerWorldEventView me={me} myId={myId} />
        )}

        {tab==="quest" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>📜 Missioni</h3>
            {qs?.active && currentQ && (
              <div style={{ background:"rgba(120,53,15,0.34)", border:"1px solid #b45309", borderRadius:6, padding:"1rem", marginBottom:"1rem" }}>
                <div style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontWeight:700, marginBottom:4 }}>📜 IN CORSO: {currentQ.title}</div>
                <div style={{ height:5, background:"#0f172a", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ height:"100%", background:"linear-gradient(90deg,#b45309,#fbbf24)", width:`${(qs.step+1)/currentQ.steps.length*100}%`, transition:"width 0.5s" }} />
                </div>
                <p style={{ color:"#fde68a", fontSize:"0.85rem", marginBottom:10 }}>Scena {qs.step+1} di {currentQ.steps.length}</p>
                {(() => {
                  const profile = questRiskProfile(currentQ, partyPlayers);
                  return (
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12, fontSize:"0.72rem" }}>
                      <span style={{ color:"#fde68a", padding:"2px 7px", border:"1px solid rgba(251,191,36,0.32)", borderRadius:999, background:"rgba(120,53,15,0.18)" }}>Liv. consigliato {profile.recommendedLevel}+</span>
                      <span style={{ color:profile.riskColor, padding:"2px 7px", border:`1px solid ${profile.riskColor}`, borderRadius:999, background:"rgba(15,23,42,0.42)" }}>Rischio {profile.risk}</span>
                      <span style={{ color:"#cbd5e1", padding:"2px 7px", border:"1px solid rgba(148,163,184,0.18)", borderRadius:999, background:"rgba(15,23,42,0.42)" }}>{profile.combatCount} scontri · {profile.monsters.length} nemici</span>
                    </div>
                  );
                })()}
                {(() => {
                  const stepData = currentQ?.steps?.[qs.step];
                  if(!stepData) return null;
                  const combatVictory = !!qs?.combat?.won;
                  const lootOpened = lootDone;
                  const canAdvance =
                    isCombatStep(stepData) ? (!qs?.combat?.active && combatVictory) :
                    isLootStep(stepData) ? lootOpened :
                    isChoiceStep(stepData) ? false :
                    true; // narrative
                  if(isChoiceStep(stepData)) {
                    const fb = choiceFeedback;
                    const fbCfg = fb ? {
                      good:    { bg:"rgba(21,128,61,0.25)",  border:"#16a34a", color:"#4ade80", icon:"✅", title:"Risposta Giusta!" },
                      neutral: { bg:"rgba(180,83,9,0.25)",   border:"#d97706", color:"#fbbf24", icon:"🟡", title:"Risposta Quasi Giusta" },
                      bad:     { bg:"rgba(127,29,29,0.25)",  border:"#dc2626", color:"#f87171", icon:"❌", title:"Risposta Sbagliata" },
                    }[fb.quality] || null : null;
                    return (
                      <div>
                        <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:12, lineHeight:1.5 }}><TypewriterText text={stepData.text} speed={16} /></p>

                        {/* Feedback banner — stays until user clicks Avanti */}
                        {fb && fbCfg ? (
                          <div style={{ marginBottom:14, padding:"0.9rem 1.1rem", background:fbCfg.bg, border:`2px solid ${fbCfg.border}`, borderRadius:10, animation:"pulse 0.4s ease" }}>
                            <div style={{ fontFamily:"'Cinzel',serif", color:fbCfg.color, fontSize:"1rem", fontWeight:700, marginBottom:4 }}>
                              {fbCfg.icon} {fbCfg.title}
                            </div>
                            <div style={{ fontSize:"0.8rem", color:"#e2d9c5" }}>
                              Hai scelto: <em>"{fb.label}"</em>
                            </div>
                            {(fb.xp > 0 || fb.gold > 0) ? (
                              <div style={{ marginTop:6, fontSize:"0.82rem", color:fbCfg.color, fontWeight:600 }}>
                                {fb.xp > 0 && <span>⭐ +{fb.xp} XP a testa  </span>}
                                {fb.gold > 0 && <span>💰 +{fb.gold} oro a testa</span>}
                              </div>
                            ) : fb.quality === "bad" ? (
                              <div style={{ marginTop:4, fontSize:"0.78rem", color:"#94a3b8" }}>Nessuna ricompensa ottenuta.</div>
                            ) : null}
                            <button onClick={confirmQuestAdvance} style={{ marginTop:12, width:"100%", padding:"0.6rem 1rem", background:fbCfg.border, border:"none", borderRadius:7, color:"#fff", fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"0.88rem", cursor:"pointer", letterSpacing:"0.04em" }}>
                              Avanti →
                            </button>
                          </div>
                        ) : (
                          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                            {stepData.choices?.map((c,i)=>(
                              <button key={i} onClick={()=>chooseQuestOption(i)}
                                style={{ padding:"0.8rem 1.2rem", background:"rgba(109,40,217,0.2)", border:"1px solid #6d28d9", borderRadius:6, color:"#c4b5fd", cursor:"pointer", fontFamily:"inherit", fontSize:"0.88rem", textAlign:"left", transition:"background 0.15s" }}
                                onMouseEnter={e=>e.currentTarget.style.background="rgba(109,40,217,0.4)"}
                                onMouseLeave={e=>e.currentTarget.style.background="rgba(109,40,217,0.2)"}>
                                {c.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  if(isCombatStep(stepData)) {
                    return (
                      <div style={{ textAlign:"center", padding:"1rem" }}>
                        <p style={{ color:"#fca5a5", fontSize:"0.88rem", marginBottom:12 }}><TypewriterText text={stepData.text} speed={16} /></p>
                        {qs.combat?.won
                          ? <div>
                              <p style={{ color:"#22c55e", fontFamily:"'Cinzel',serif", marginBottom:12 }}>🏆 Vittoria! Il combattimento è finito.</p>
                              {canAdvance && <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>}
                            </div>
                          : qs.combat?.active
                            ? <div>
                                <p style={{ color:"#ef4444", fontFamily:"'Cinzel',serif", marginBottom:12 }}>⚔️ Battaglia avviata automaticamente — sei già nel flusso di combattimento.</p>
                                <BigBtn onClick={()=>setTab("combat")} gold>⚔️ Vai al Combattimento →</BigBtn>
                              </div>
                            : <p style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif" }}>Preparazione del combattimento...</p>
                        }
                      </div>
                    );
                  }
                  if(isLootStep(stepData)) {
                    return (
                      <div style={{ textAlign:"center", padding:"1rem" }}>
                        <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:12 }}><TypewriterText text={stepData.text} speed={16} /></p>
                        {canAdvance
                          ? <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>
                          : <BigBtn onClick={()=>handleLoot(stepData)} gold icon="🔍">Cerca tra le rovine</BigBtn>
                        }
                      </div>
                    );
                  }
                  // narrative
                  return (
                    <div>
                      <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:16, lineHeight:1.5 }}><TypewriterText text={stepText(stepData)} speed={16} /></p>
                      {canAdvance && <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>}
                    </div>
                  );
                })()}
                <div style={{ marginTop:12 }}>
                  <SmallBtn red onClick={async ()=>{
                    if(!window.confirm("Abbandonare la missione in corso? I progressi andranno persi.")) return;
                    await saveQState({...qs, active:false, step:0, combat:null});
                  }}>❌ Abbandona Missione</SmallBtn>
                </div>
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, padding:"0.45rem 0.75rem", background:"rgba(120,53,15,0.18)", border:"1px solid rgba(180,83,9,0.35)", borderRadius:6 }}>
              <span style={{ color:"#fbbf24", fontSize:"0.76rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.04em" }}>🗓️ Missioni del Giorno</span>
              <span style={{ color:"#6b7280", fontSize:"0.71rem" }}>si rinnova in {hoursUntilMidnight()}</span>
            </div>
            {(() => {
              const today = new Date().toLocaleDateString('en-CA');
              const completedToday = new Set((qs?.questLog || []).filter(e => e.date === today).map(e => e.id));
              const availableDaily = publicDailyQuests.filter(q => !completedToday.has(q.id));
              const doneCount = publicDailyQuests.length - availableDaily.length;
              return (
                <>
                  {doneCount > 0 && (
                    <div style={{ fontSize:"0.72rem", color:"#22c55e", marginBottom:8, paddingLeft:4 }}>
                      ✓ {doneCount} {doneCount===1?"missione completata":"missioni completate"} oggi
                    </div>
                  )}
                  {availableDaily.length === 0 && (
                    <div style={{ color:"#4b5563", textAlign:"center", padding:"1.5rem", border:"1px dashed #1f2937", borderRadius:6, fontSize:"0.82rem" }}>
                      Tutte le missioni del giorno sono state completate!
                    </div>
                  )}
                  {availableDaily.map(q => {
                    const profile = questRiskProfile(q, partyPlayers);
                    const diff = normalizeMissionDifficulty(q.difficulty);
                    const perPlayerCount = Math.max(partyPlayers.length || 1, 1);
                    const xpEachPreview = Math.floor((Number(q.xpReward) || 0) / perPlayerCount);
                    const goldEachPreview = Math.floor((Number(q.goldReward) || 0) / perPlayerCount);
                    const underleveled = profile.avgLevel + 0.5 < profile.recommendedLevel;
                    return (
                    <div key={q.id} style={{ background:PANEL_BG, border:`1px solid ${underleveled ? "rgba(239,68,68,0.58)" : "rgba(71,85,105,0.95)"}`, borderRadius:6, padding:"1rem", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                            <span style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700 }}>{q.title}</span>
                            <span style={{ padding:"1px 7px", border:`1px solid ${DIFF_COLOR[diff]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[diff]||"#6b7280" }}>{missionDifficultyLabel(q.difficulty)}</span>
                            {underleveled && <span style={{ padding:"1px 7px", border:"1px solid #ef4444", borderRadius:3, fontSize:"0.65rem", color:"#fca5a5" }}>Sottolivellati</span>}
                          </div>
                          <p style={{ color:"#94a3b8", fontSize:"0.82rem", margin:"0 0 6px" }}>{q.desc}</p>
                          {q.flavor&&<p style={{ color:"#94a3b8", fontSize:"0.78rem", fontStyle:"italic", margin:"0 0 8px" }}>{q.flavor}</p>}
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(128px,1fr))", gap:7, margin:"0.75rem 0" }}>
                            <div style={{ padding:"0.45rem 0.55rem", border:"1px solid rgba(148,163,184,0.18)", borderRadius:6, background:"rgba(15,23,42,0.52)" }}>
                              <div style={{ color:"#64748b", fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Consigliato</div>
                              <div style={{ color:underleveled ? "#fca5a5" : "#dbeafe", fontSize:"0.78rem", fontWeight:700 }}>Liv. {profile.recommendedLevel}+ <span style={{ color:"#64748b", fontWeight:400 }}>(party {profile.avgLevel.toFixed(1)})</span></div>
                            </div>
                            <div style={{ padding:"0.45rem 0.55rem", border:`1px solid ${profile.riskColor}`, borderRadius:6, background:"rgba(15,23,42,0.52)" }}>
                              <div style={{ color:"#64748b", fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Rischio</div>
                              <div style={{ color:profile.riskColor, fontSize:"0.78rem", fontWeight:700 }}>{profile.risk}</div>
                            </div>
                            <div style={{ padding:"0.45rem 0.55rem", border:"1px solid rgba(148,163,184,0.18)", borderRadius:6, background:"rgba(15,23,42,0.52)" }}>
                              <div style={{ color:"#64748b", fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>Minacce</div>
                              <div style={{ color:"#cbd5e1", fontSize:"0.78rem", fontWeight:700 }}>{profile.combatCount} scontri · {profile.monsters.length} nemici{profile.bosses ? ` · ${profile.bosses} boss` : ""}</div>
                            </div>
                            <div style={{ padding:"0.45rem 0.55rem", border:"1px solid rgba(251,191,36,0.28)", borderRadius:6, background:"rgba(120,53,15,0.16)" }}>
                              <div style={{ color:"#92400e", fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>A testa</div>
                              <div style={{ color:"#fde68a", fontSize:"0.78rem", fontWeight:700 }}>{xpEachPreview} XP · {goldEachPreview} oro</div>
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:8, fontSize:"0.72rem", color:"#94a3b8", flexWrap:"wrap", alignItems:"center" }}>
                            <span>🎭 {q.steps.length} scene</span>
                            {profile.advice.map((tip, i) => <span key={i} style={{ padding:"2px 7px", border:"1px solid rgba(148,163,184,0.16)", borderRadius:999, background:"rgba(15,23,42,0.5)" }}>{tip}</span>)}
                            {q.location && <span>📍 {q.location}</span>}
                          </div>
                        </div>
                        {!qs?.active&&<BigBtn onClick={()=>acceptQuest(q)} gold icon="⭐">Accetta</BigBtn>}
                      </div>
                    </div>
                  );})}
                </>
              );
            })()}
            <div style={{ marginTop:16, marginBottom:12, padding:"0.75rem", background:"rgba(88,28,135,0.16)", border:"1px solid rgba(124,58,237,0.42)", borderRadius:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                <span style={{ color:"#c4b5fd", fontSize:"0.76rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.04em" }}>Missioni speciali</span>
                <span style={{ color:"#6b7280", fontSize:"0.71rem" }}>{unlockedSpecialQuests.length} sbloccate</span>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <input
                  style={{...inputStyle, flex:"1 1 220px"}}
                  value={specialPasswordInput}
                  onChange={e=>{ setSpecialPasswordInput(e.target.value); setSpecialQuestError(""); }}
                  onKeyDown={e=>e.key==="Enter"&&unlockSpecialQuest()}
                  placeholder="Inserisci password data dal Master"
                />
                <BigBtn onClick={unlockSpecialQuest} gold icon="🔓" disabled={!specialPasswordInput.trim()}>Sblocca</BigBtn>
              </div>
              {specialQuestError && <div style={{ color:specialQuestError.startsWith("Missione")?"#86efac":"#fca5a5", fontSize:"0.78rem", marginTop:8 }}>{specialQuestError}</div>}
            </div>
            {unlockedSpecialQuests.filter(q => {
              const today = new Date().toLocaleDateString('en-CA');
              return !(qs?.questLog||[]).some(e => e.date === today && e.id === q.id);
            }).map(q => {
              const profile = questRiskProfile(q, partyPlayers);
              const perPlayerCount = Math.max(partyPlayers.length || 1, 1);
              const xpEachPreview = Math.floor((Number(q.xpReward) || 0) / perPlayerCount);
              const goldEachPreview = Math.floor((Number(q.goldReward) || 0) / perPlayerCount);
              return (
              <div key={q.id} style={{ background:"rgba(88,28,135,0.16)", border:"1px solid #7c3aed", borderRadius:6, padding:"1rem", marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                      <span style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontWeight:700 }}>{q.title}</span>
                      <span style={{ padding:"1px 7px", border:"1px solid #7c3aed", borderRadius:3, fontSize:"0.65rem", color:"#c4b5fd" }}>Speciale</span>
                    </div>
                    <p style={{ color:"#94a3b8", fontSize:"0.82rem", margin:"0 0 6px" }}>{q.desc}</p>
                    {q.flavor&&<p style={{ color:"#94a3b8", fontSize:"0.78rem", fontStyle:"italic", margin:"0 0 8px" }}>{q.flavor}</p>}
                    <div style={{ display:"flex", gap:8, fontSize:"0.72rem", color:"#94a3b8", flexWrap:"wrap", marginTop:8 }}>
                      <span style={{ color:"#fde68a" }}>👤 {xpEachPreview} XP · {goldEachPreview} oro a testa</span>
                      <span>👥 Liv. {profile.recommendedLevel}+</span>
                      <span style={{ color:profile.riskColor }}>⚠️ Rischio {profile.risk.toLowerCase()}</span>
                      <span>⚔️ {profile.combatCount} scontri · {profile.monsters.length} nemici</span>
                      <span>🎭 {q.steps.length} scene</span>
                    </div>
                  </div>
                  {!qs?.active&&<BigBtn onClick={()=>acceptQuest(q)} gold icon="⭐">Accetta</BigBtn>}
                </div>
              </div>
            );})}
            {(() => {
              const today = new Date().toLocaleDateString('en-CA');
              const todayLog = (qs?.questLog || []).filter(e => e.date === today);
              if(!todayLog.length) return null;
              return (
                <div style={{ marginTop:20 }}>
                  <div style={{ display:"flex", alignItems:"center", marginBottom:12, padding:"0.45rem 0.75rem", background:"rgba(15,118,110,0.12)", border:"1px solid rgba(20,184,166,0.3)", borderRadius:6 }}>
                    <span style={{ color:"#2dd4bf", fontSize:"0.76rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.04em" }}>📋 Cronaca del Giorno</span>
                    <span style={{ color:"#6b7280", fontSize:"0.71rem", marginLeft:"auto" }}>{todayLog.length} {todayLog.length===1?"missione":"missioni"} completate</span>
                  </div>
                  {[...todayLog].reverse().map((entry, i) => (
                    <div key={i} style={{ background:"rgba(15,118,110,0.08)", border:"1px solid rgba(20,184,166,0.22)", borderRadius:8, padding:"0.85rem", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontFamily:"'Cinzel',serif", color:"#2dd4bf", fontWeight:700, fontSize:"0.88rem" }}>✅ {entry.title}</span>
                        <span style={{ marginLeft:"auto", fontSize:"0.68rem", color:"#64748b" }}>{new Date(entry.completedAt).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}</span>
                      </div>
                      <div style={{ display:"flex", gap:14, fontSize:"0.72rem", color:"#94a3b8", marginBottom:entry.players?.length?10:0 }}>
                        <span>⭐ +{entry.xpEach} XP</span>
                        <span>💰 +{entry.goldEach} oro</span>
                        <span style={{ color:"#475569" }}>a testa</span>
                      </div>
                      {entry.players && entry.players.length > 0 && (
                        <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid rgba(20,184,166,0.15)" }}>
                          <div style={{ fontSize:"0.65rem", color:"#64748b", marginBottom:6, letterSpacing:"0.07em" }}>DANNI INFLITTI</div>
                          {entry.players.map((p, pi) => {
                            const maxDmg = entry.players[0]?.dmg || 1;
                            const pct = Math.round(p.dmg / maxDmg * 100);
                            return (
                              <div key={pi} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                                <span style={{ fontSize:"0.82rem", minWidth:18, textAlign:"center" }}>{pi===0?"🥇":pi===1?"🥈":pi===2?"🥉":"•"}</span>
                                <span style={{ fontSize:"0.78rem", color:"#e2e8f0", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
                                <span style={{ fontSize:"0.78rem", color:"#ef4444", fontWeight:700, minWidth:48, textAlign:"right" }}>{p.dmg} dmg</span>
                                <div style={{ width:52, height:5, background:"rgba(30,41,59,0.8)", borderRadius:3, overflow:"hidden", flexShrink:0 }}>
                                  <div style={{ height:"100%", background:"linear-gradient(90deg,#ef4444,#f97316)", width:`${pct}%`, transition:"width 0.4s" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ── Storico missioni ── */}
            {(qs?.questHistory || []).length > 0 && (() => {
              const history = [...(qs.questHistory || [])].reverse().slice(0, 30);
              const diffColor = d => d==="difficile"?"#ef4444":d==="facile"?"#22c55e":"#fbbf24";
              const diffLabel = d => d==="difficile"?"Difficile":d==="facile"?"Facile":"Media";
              return (
                <div style={{ marginTop:24 }}>
                  <div style={{ color:"#94a3b8", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>📖 Storico Missioni</div>
                  {history.map((entry, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"0.6rem 0.8rem", background:"rgba(15,23,42,0.5)", border:"1px solid #1e293b", borderRadius:6, marginBottom:5 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"'Cinzel',serif", color:"#e2e8f0", fontSize:"0.85rem", fontWeight:600 }}>✅ {entry.title}</div>
                        <div style={{ fontSize:"0.68rem", color:"#64748b", marginTop:2 }}>{new Date(entry.completedAt).toLocaleDateString('it-IT')}</div>
                      </div>
                      <span style={{ fontSize:"0.65rem", padding:"2px 8px", borderRadius:3, border:`1px solid ${diffColor(entry.difficulty)}`, color:diffColor(entry.difficulty) }}>{diffLabel(entry.difficulty)}</span>
                      <div style={{ textAlign:"right", fontSize:"0.72rem", color:"#94a3b8" }}>
                        <div>⭐ +{entry.xpEach} XP</div>
                        <div>💰 +{entry.goldEach} oro</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {tab==="guild" && (() => {
          const myGuild = getPlayerGuild(guilds, myId);
          const myMember = myGuild?.members?.find(m=>m.id===myId);
          const hallStage = myGuild ? getGuildHallStage(myGuild.level||1) : null;
          const guildLvl = myGuild?.level || 1;
          const nextLvlXp = GUILD_XP_TABLE[Math.min(guildLvl+1,20)] || GUILD_XP_TABLE[20];
          const curXp = myGuild?.xp || 0;
          const xpPct = myGuild ? Math.min(100, Math.round((curXp / nextLvlXp)*100)) : 0;
          const nowMs = Date.now();
          return (
            <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🏛️ Gilda</h3>

              {/* Online/Offline World Players */}
              <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:10, padding:"0.85rem", marginBottom:"1rem" }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.75rem", color:"#94a3b8", letterSpacing:"0.08em", marginBottom:8 }}>🌍 AVVENTURIERI NEL MONDO</div>
                {guildLoading && <div style={{ color:"#4b5563", fontSize:"0.78rem" }}>Caricamento...</div>}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:6 }}>
                  {worldPlayers.map(p=>{
                    const online = isPartyPlayerOnline(p, worldMeta, nowMs);
                    const pg = getPlayerGuild(guilds, p.id);
                    return (
                      <div key={p.id} style={{ display:"flex", alignItems:"center", gap:7, padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.6)", border:`1px solid ${online?"rgba(34,197,94,0.3)":"rgba(30,41,59,0.6)"}`, borderRadius:7 }}>
                        <span style={{ fontSize:"0.55rem", color:online?"#22c55e":"#374151" }}>●</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:"0.78rem", color:online?"#e2e8f0":"#64748b", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                          <div style={{ fontSize:"0.62rem", color:"#475569" }}>Lv.{p.level||1} {CLASSES[p.class]?.emoji||"⚔️"}{pg ? ` · ${pg.emoji}${pg.name}` : ""}</div>
                        </div>
                      </div>
                    );
                  })}
                  {!guildLoading && !worldPlayers.length && <div style={{ color:"#4b5563", fontSize:"0.78rem" }}>Nessun avventuriero trovato.</div>}
                </div>
              </div>

              {/* My Guild */}
              {myGuild ? (
                <div>
                  {/* Hall visual */}
                  <div style={{ background:`linear-gradient(135deg,rgba(30,10,60,0.85),rgba(10,22,40,0.9))`, border:"2px solid #7c3aed", borderRadius:14, padding:"1.2rem", marginBottom:"1rem", position:"relative", overflow:"hidden" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:8 }}>
                      <div style={{ fontSize:"3rem" }}>{hallStage.emoji}</div>
                      <GuildEmblemSVG emblem={myGuild.emblem} size={80}/>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.1rem" }}>{myGuild.emoji} {myGuild.name}</div>
                      <div style={{ color:"#a78bfa", fontSize:"0.8rem", marginTop:2 }}>{hallStage.name}</div>
                      <div style={{ color:"#94a3b8", fontSize:"0.72rem", marginTop:2, fontStyle:"italic" }}>{hallStage.desc}</div>
                    </div>
                    <div style={{ marginTop:"0.85rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem", color:"#94a3b8", marginBottom:4 }}>
                        <span>Lv.{myGuild.level||1} — {curXp} / {nextLvlXp} XP</span>
                        <span>+{getGuildGoldBonus(guildLvl)}% oro</span>
                      </div>
                      <div style={{ height:6, background:"rgba(30,41,59,0.6)", borderRadius:3 }}>
                        <div style={{ height:"100%", width:`${xpPct}%`, background:"linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius:3, transition:"width .4s" }} />
                      </div>
                    </div>
                    {getGuildFeature(guildLvl) && (
                      <div style={{ marginTop:8, textAlign:"center", fontSize:"0.72rem", color:"#4ade80" }}>
                        {getGuildFeature(guildLvl).icon} {getGuildFeature(guildLvl).label} sbloccato!
                      </div>
                    )}
                  </div>

                  {/* Donate XP */}
                  <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:10, padding:"0.85rem", marginBottom:"1rem" }}>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8", marginBottom:8 }}>💰 CONTRIBUISCI ALLA GILDA (10 oro = 1 XP)</div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {[100,500,1000].map(amt=>(
                        <button key={amt} onClick={()=>setGuildDonate(amt)} style={{ padding:"0.4rem 0.8rem", background:guildDonate===amt?"rgba(109,40,217,0.35)":"rgba(15,23,42,0.5)", border:`1px solid ${guildDonate===amt?"#7c3aed":"#334155"}`, borderRadius:6, color:guildDonate===amt?"#c4b5fd":"#94a3b8", cursor:"pointer", fontSize:"0.78rem" }}>{amt}🪙</button>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:8 }}>
                      <input type="number" value={guildDonate} min={10} onChange={e=>setGuildDonate(Number(e.target.value))}
                        style={{ flex:1, padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6, color:"#e2e8f0", fontSize:"0.8rem" }} />
                      <BigBtn onClick={donateToGuild} gold icon="💰">Dona ({Math.floor(guildDonate/10)} XP)</BigBtn>
                    </div>
                  </div>

                  {/* Warehouse (Lv5+) */}
                  {(myGuild.level||1)>=5 && (
                    <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:10, padding:"0.85rem", marginBottom:"1rem" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8" }}>📦 MAGAZZINO GILDA</div>
                        <SmallBtn onClick={()=>{ setWarehouseOpen(v=>!v); if(!warehouseOpen) refreshWarehouse(myGuild.id); }}>{warehouseOpen?"▲ chiudi":"▼ apri"}</SmallBtn>
                      </div>
                      {warehouseOpen && (
                        <div>
                          <div style={{ fontSize:"0.72rem", color:"#64748b", marginBottom:8 }}>Clicca un oggetto del tuo inventario per depositarlo, clicca un oggetto del magazzino per ritirarlo.</div>
                          {hasPerm(myMember,"bank") ? (
                            <>
                          <div style={{ marginBottom:8 }}>
                            <div style={{ fontSize:"0.7rem", color:"#a78bfa", marginBottom:4 }}>📤 Il tuo inventario (deposita)</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                              {inventory.filter(e=>e&&e.item).map(e=>(
                                <button key={e.rowId} onClick={()=>depositItem(e)} style={{ padding:"0.35rem 0.6rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6, color:"#e2e8f0", cursor:"pointer", fontSize:"0.75rem" }}>
                                  {e.item.emoji||"📦"} {e.item.name}
                                </button>
                              ))}
                              {!inventory.filter(e=>e&&e.item).length&&<span style={{color:"#4b5563",fontSize:"0.75rem"}}>Inventario vuoto.</span>}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize:"0.7rem", color:"#4ade80", marginBottom:4 }}>📥 Magazzino (ritira)</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                              {warehouseItems.map(e=>(
                                <button key={e.rowId} onClick={()=>withdrawItem(e)} style={{ padding:"0.35rem 0.6rem", background:"rgba(20,83,45,0.2)", border:"1px solid #166534", borderRadius:6, color:"#86efac", cursor:"pointer", fontSize:"0.75rem" }}>
                                  {e.item?.emoji||"📦"} {e.item?.name}
                                </button>
                              ))}
                              {!warehouseItems.length&&<span style={{color:"#4b5563",fontSize:"0.75rem"}}>Magazzino vuoto.</span>}
                            </div>
                          </div>
                            </>
                          ) : (
                            <div style={{ fontSize:"0.75rem", color:"#64748b", textAlign:"center", padding:"0.5rem" }}>🔒 Solo il Tesoriere e i ruoli con permesso <em>bank</em> possono accedere al magazzino.</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Members */}
                  <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:10, padding:"0.85rem", marginBottom:"1rem" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8" }}>👥 MEMBRI ({myGuild.members?.length||0})</div>
                      <div style={{ display:"flex", gap:6 }}>
                        {hasPerm(myMember,"invite") && <SmallBtn onClick={()=>setShowGuildInvite(v=>!v)}>📨 Invita</SmallBtn>}
                        <SmallBtn onClick={()=>setShowGuildRoles(v=>!v)}>📋 Ruoli</SmallBtn>
                      </div>
                    </div>

                    {/* Invite panel */}
                    {showGuildInvite && hasPerm(myMember,"invite") && (()=>{
                      const invitablePlayers = worldPlayers.filter(p => p.id !== myId && !myGuild.members?.find(m=>m.id===p.id) && !getPlayerGuild(guilds, p.id));
                      return (
                        <div style={{ background:"rgba(15,23,42,0.6)", border:"1px solid #334155", borderRadius:8, padding:"0.65rem", marginBottom:8 }}>
                          {invitablePlayers.length > 0 && (
                            <div style={{ marginBottom:8 }}>
                              <div style={{ fontSize:"0.65rem", color:"#64748b", marginBottom:5 }}>Seleziona dalla lista:</div>
                              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                                {invitablePlayers.map(p=>(
                                  <button key={p.id} onClick={()=>setGuildInviteCode(p.id)}
                                    style={{ padding:"0.3rem 0.7rem", background:guildInviteCode===p.id?"rgba(109,40,217,0.35)":"rgba(15,23,42,0.7)", border:`1px solid ${guildInviteCode===p.id?"#7c3aed":"#334155"}`, borderRadius:6, color:guildInviteCode===p.id?"#c4b5fd":"#e2e8f0", cursor:"pointer", fontSize:"0.75rem" }}>
                                    {CLASSES[p.class]?.emoji||"⚔️"} {p.name} <span style={{color:"#64748b"}}>Lv.{p.level||1}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          <div style={{ display:"flex", gap:6 }}>
                            <input value={guildInviteCode} onChange={e=>setGuildInviteCode(e.target.value)} placeholder="…oppure ID / party code manuale"
                              style={{ flex:1, padding:"0.35rem 0.6rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:5, color:"#e2e8f0", fontSize:"0.8rem" }}/>
                            <SmallBtn onClick={inviteByCode} disabled={!guildInviteCode.trim()}>✓ Invita</SmallBtn>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Join Requests panel — visible to leaders with invite perm */}
                    {hasPerm(myMember,"invite") && (myGuild.joinRequests||[]).length > 0 && (
                      <div style={{ background:"rgba(15,23,42,0.6)", border:"1px solid #7c3aed", borderRadius:8, padding:"0.65rem", marginBottom:8 }}>
                        <div style={{ fontSize:"0.68rem", color:"#c4b5fd", fontFamily:"'Cinzel',serif", marginBottom:6 }}>📨 RICHIESTE DI ACCESSO ({(myGuild.joinRequests||[]).length})</div>
                        {(myGuild.joinRequests||[]).map(req=>(
                          <div key={req.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"0.4rem 0.5rem", background:"rgba(109,40,217,0.1)", border:"1px solid rgba(109,40,217,0.3)", borderRadius:6, marginBottom:5 }}>
                            <span style={{ fontSize:"0.82rem", flex:1, color:"#e2e8f0" }}>⚔️ <strong>{req.name}</strong></span>
                            <button onClick={()=>approveJoinRequest(myGuild.id, req.id, req.name)}
                              style={{ padding:"2px 10px", background:"rgba(20,83,45,0.5)", border:"1px solid #166534", borderRadius:5, color:"#4ade80", cursor:"pointer", fontSize:"0.72rem", fontWeight:600 }}>✓ Accetta</button>
                            <button onClick={()=>rejectJoinRequest(myGuild.id, req.id)}
                              style={{ padding:"2px 8px", background:"rgba(127,29,29,0.4)", border:"1px solid #7f1d1d", borderRadius:5, color:"#f87171", cursor:"pointer", fontSize:"0.72rem" }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Roles reference */}
                    {showGuildRoles && (
                      <div style={{ background:"rgba(15,23,42,0.6)", border:"1px solid #334155", borderRadius:8, padding:"0.65rem", marginBottom:8 }}>
                        <div style={{ fontSize:"0.68rem", color:"#94a3b8", fontFamily:"'Cinzel',serif", marginBottom:6 }}>RUOLI E PERMESSI</div>
                        {Object.entries(GUILD_ROLES).map(([rName,rd])=>(
                          <div key={rName} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                            <span style={{ fontSize:"0.85rem" }}>{rd.icon}</span>
                            <span style={{ fontSize:"0.72rem", color:rd.color||"#94a3b8", fontWeight:600, minWidth:120 }}>{rName}</span>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                              {rd.perms.length===0
                                ? <span style={{ fontSize:"0.6rem", color:"#4b5563" }}>solo combattente</span>
                                : rd.perms.map(p=>(
                                    <span key={p} style={{ fontSize:"0.58rem", padding:"1px 5px", background:"rgba(109,40,217,0.2)", border:"1px solid #4c1d95", borderRadius:4, color:"#c4b5fd" }}>
                                      {{"invite":"Invita","kick":"Espelli","war":"Guerra","bank":"Magazzino","events":"Eventi","bulletin":"Bacheca","promote":"Promuovi","roles":"Ruoli"}[p]||p}
                                    </span>
                                  ))
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(myGuild.members||[]).map(m=>{
                      const role = m.role==="leader" ? "Maestro di Gilda" : (m.customRole||DEFAULT_ROLE);
                      const rd = GUILD_ROLES[role]||GUILD_ROLES[DEFAULT_ROLE];
                      const memberPlayer = worldPlayers.find(p=>p.id===m.id);
                      const online = memberPlayer ? isPartyPlayerOnline(memberPlayer, worldMeta, nowMs) : false;
                      return (
                        <div key={m.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"0.5rem 0.6rem", background:"rgba(15,23,42,0.5)", border:"1px solid rgba(30,41,59,0.7)", borderRadius:7, marginBottom:5 }}>
                          <span style={{ fontSize:"0.7rem", color:online?"#22c55e":"#374151" }}>●</span>
                          <span style={{ fontSize:"0.9rem" }}>{rd.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"0.82rem", color:"#e2e8f0", fontWeight:600 }}>{m.name}</div>
                            <div style={{ fontSize:"0.65rem", color:rd.color||"#94a3b8" }}>{role}</div>
                          </div>
                          {myMember?.role==="leader" && m.id!==myId && (
                            <select defaultValue={m.customRole||DEFAULT_ROLE}
                              onChange={async e=>{
                                const newMems=(myGuild.members||[]).map(x=>x.id===m.id?{...x,customRole:e.target.value}:x);
                                const ng={...myGuild,members:newMems};
                                const newG={...guilds,[myGuild.id]:ng};
                                await dbSaveAllGuilds(newG); setGuilds(newG);
                              }}
                              style={{ fontSize:"0.65rem", background:"rgba(15,23,42,0.8)", border:"1px solid #334155", borderRadius:4, color:"#94a3b8", padding:"2px 4px" }}>
                              {Object.keys(GUILD_ROLES).filter(r=>r!=="Maestro di Gilda").map(r=>(
                                <option key={r} value={r}>{GUILD_ROLES[r].icon} {r}</option>
                              ))}
                            </select>
                          )}
                          {hasPerm(myMember,"kick") && m.id!==myId && m.role!=="leader" && (
                            <button onClick={()=>kickMember(m.id)} title="Espelli" style={{ background:"none", border:"1px solid #7f1d1d", borderRadius:4, color:"#f87171", cursor:"pointer", fontSize:"0.65rem", padding:"2px 6px" }}>✕</button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <SmallBtn red onClick={leaveGuild}>🚪 Lascia la gilda</SmallBtn>

                  {/* Bulletin board */}
                  <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:10, padding:"0.85rem", marginBottom:"1rem", marginTop:"1rem" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8" }}>📌 BACHECA GILDA</div>
                      {hasPerm(myMember,"bulletin") && <SmallBtn onClick={()=>setShowBulletinForm(v=>!v)}>{showBulletinForm?"✕":"+ Annuncio"}</SmallBtn>}
                    </div>
                    {showBulletinForm && hasPerm(myMember,"bulletin") && (
                      <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                        <input value={bulletinInput} onChange={e=>setBulletinInput(e.target.value)} placeholder="Scrivi un annuncio..."
                          style={{ flex:1, padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:5, color:"#e2e8f0", fontSize:"0.8rem" }}
                          onKeyDown={e=>{ if(e.key==="Enter") postBulletin(); }}/>
                        <SmallBtn onClick={postBulletin}>Pubblica</SmallBtn>
                      </div>
                    )}
                    {!(myGuild.bulletin||[]).length && <div style={{ fontSize:"0.75rem", color:"#4b5563" }}>Nessun annuncio.</div>}
                    {(myGuild.bulletin||[]).map(b=>(
                      <div key={b.id} style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.18)", borderRadius:7, padding:"0.5rem 0.7rem", marginBottom:5, display:"flex", gap:8, alignItems:"flex-start" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"0.78rem", color:"#fde68a" }}>{b.text}</div>
                          <div style={{ fontSize:"0.62rem", color:"#64748b", marginTop:2 }}>— {b.author} · {new Date(b.createdAt).toLocaleDateString("it-IT")}</div>
                        </div>
                        {hasPerm(myMember,"bulletin") && (
                          <button onClick={()=>deleteBulletin(b.id)} style={{ background:"none", border:"none", color:"#374151", fontSize:"0.7rem", cursor:"pointer", padding:"0 4px" }}>✕</button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Guild Missions */}
                  <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:10, padding:"0.85rem", marginBottom:"1rem", marginTop:"1rem" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8" }}>🎯 MISSIONI DI GILDA</div>
                      {hasPerm(myMember,"events") && <SmallBtn onClick={()=>setShowMissionForm(v=>!v)}>{showMissionForm?"✕":"+ Nuova"}</SmallBtn>}
                    </div>
                    {showMissionForm && hasPerm(myMember,"events") && (
                      <div style={{ background:"rgba(15,23,42,0.6)", border:"1px solid #334155", borderRadius:8, padding:"0.75rem", marginBottom:8 }}>
                        <input value={guildMissionForm.title} onChange={e=>setGuildMissionForm(f=>({...f,title:e.target.value}))} placeholder="Titolo missione..."
                          style={{ width:"100%", marginBottom:6, padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:5, color:"#e2e8f0", fontSize:"0.82rem" }}/>
                        <textarea value={guildMissionForm.desc} onChange={e=>setGuildMissionForm(f=>({...f,desc:e.target.value}))} placeholder="Descrizione..." rows={2}
                          style={{ width:"100%", marginBottom:6, padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:5, color:"#e2e8f0", fontSize:"0.78rem", resize:"none" }}/>
                        <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"0.65rem", color:"#64748b", marginBottom:3 }}>Obiettivo (contributi)</div>
                            <input type="number" value={guildMissionForm.goal} min={1} onChange={e=>setGuildMissionForm(f=>({...f,goal:Number(e.target.value)}))}
                              style={{ width:"100%", padding:"0.35rem 0.5rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:5, color:"#e2e8f0", fontSize:"0.8rem" }}/>
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"0.65rem", color:"#64748b", marginBottom:3 }}>Ricompensa oro</div>
                            <input type="number" value={guildMissionForm.rewardGold} min={0} onChange={e=>setGuildMissionForm(f=>({...f,rewardGold:Number(e.target.value)}))}
                              style={{ width:"100%", padding:"0.35rem 0.5rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:5, color:"#e2e8f0", fontSize:"0.8rem" }}/>
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"0.65rem", color:"#64748b", marginBottom:3 }}>XP gilda</div>
                            <input type="number" value={guildMissionForm.rewardXp} min={0} onChange={e=>setGuildMissionForm(f=>({...f,rewardXp:Number(e.target.value)}))}
                              style={{ width:"100%", padding:"0.35rem 0.5rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:5, color:"#e2e8f0", fontSize:"0.8rem" }}/>
                          </div>
                        </div>
                        <SmallBtn onClick={createGuildMission}>✓ Crea missione</SmallBtn>
                      </div>
                    )}
                    {(myGuild.missions||[]).length===0 && <div style={{ fontSize:"0.75rem", color:"#4b5563" }}>Nessuna missione attiva.</div>}
                    {(myGuild.missions||[]).map(m=>(
                      <div key={m.id} style={{ background:"rgba(15,23,42,0.5)", border:`1px solid ${m.completed?"#166534":"#334155"}`, borderRadius:8, padding:"0.6rem 0.75rem", marginBottom:6 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"0.82rem", color:m.completed?"#4ade80":"#e2e8f0", fontWeight:600 }}>{m.completed?"✅ ":""}{m.title}</div>
                            {m.desc&&<div style={{ fontSize:"0.7rem", color:"#64748b", marginTop:2 }}>{m.desc}</div>}
                            <div style={{ fontSize:"0.68rem", color:"#94a3b8", marginTop:4 }}>da {m.assignedBy} · +{m.rewardXp} XP gilda{m.rewardGold>0?` +${m.rewardGold}🪙`:""}</div>
                          </div>
                          {hasPerm(myMember,"events") && <button onClick={()=>deleteGuildMission(m.id)} style={{ background:"none", border:"none", color:"#374151", fontSize:"0.7rem", cursor:"pointer", padding:"0 4px" }}>✕</button>}
                        </div>
                        {!m.completed && (
                          <div style={{ marginTop:6 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                              <div style={{ flex:1, height:5, background:"rgba(30,41,59,0.6)", borderRadius:3 }}>
                                <div style={{ height:"100%", width:`${Math.min(100,Math.round((m.progress/m.goal)*100))}%`, background:"linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius:3, transition:"width .4s" }}/>
                              </div>
                              <span style={{ fontSize:"0.68rem", color:"#94a3b8", whiteSpace:"nowrap" }}>{m.progress}/{m.goal}</span>
                            </div>
                            <SmallBtn onClick={()=>contributeGuildMission(m.id)}>🎯 Contribuisci</SmallBtn>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Guild Chat */}
                  <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:10, padding:"0.85rem", marginBottom:"1rem" }}>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8", marginBottom:8 }}>💬 CHAT DI GILDA</div>
                    <div style={{ height:200, overflowY:"auto", marginBottom:8, display:"flex", flexDirection:"column", gap:4 }}>
                      {guildChatMessages.length===0 && <div style={{ color:"#4b5563", fontSize:"0.75rem" }}>Nessun messaggio.</div>}
                      {guildChatMessages.map((msg,i)=>(
                        <div key={msg.id||i} style={{ fontSize:"0.78rem", color:"#cbd5e1", lineHeight:1.4 }}>
                          <span style={{ color:"#a78bfa", fontWeight:600 }}>{msg.author}: </span>{msg.content}
                        </div>
                      ))}
                      <div ref={guildChatEndRef}/>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <input value={guildChatInput} onChange={e=>setGuildChatInput(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendGuildChat();} }}
                        placeholder="Scrivi alla gilda..."
                        style={{ flex:1, padding:"0.4rem 0.6rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6, color:"#e2e8f0", fontSize:"0.8rem" }}/>
                      <SmallBtn onClick={sendGuildChat}>Invia</SmallBtn>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Guild Leaderboard */}
                  {Object.values(guilds).length > 0 && (() => {
                    const ranked = Object.values(guilds).sort((a,b) => (b.xp||0) - (a.xp||0));
                    const medals = ["🥇","🥈","🥉"];
                    const myPendingGuildId = Object.values(guilds).find(g=>(g.joinRequests||[]).find(r=>r.id===myId))?.id;
                    return (
                      <div style={{ marginBottom:"1.2rem" }}>
                        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.78rem", color:"#fbbf24", letterSpacing:"0.08em", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                          🏆 CLASSIFICA GILDE
                        </div>
                        {ranked.map((g, idx) => {
                          const hall = getGuildHallStage(g.level||1);
                          const isPending = myPendingGuildId === g.id;
                          const rank = idx + 1;
                          const isTop3 = rank <= 3;
                          const borderColor = rank===1?"#fbbf24": rank===2?"#94a3b8": rank===3?"#a16207":"#334155";
                          const bgColor = rank===1?"rgba(251,191,36,0.06)": rank===2?"rgba(148,163,184,0.06)": rank===3?"rgba(161,98,7,0.06)":"rgba(15,23,42,0.4)";
                          return (
                            <div key={g.id} style={{ background:bgColor, border:`1px solid ${borderColor}`, borderRadius:11, padding:"0.85rem", marginBottom:8, display:"flex", alignItems:"center", gap:12, position:"relative" }}>
                              <div style={{ fontSize: isTop3?"1.6rem":"1rem", minWidth:32, textAlign:"center" }}>
                                {isTop3 ? medals[idx] : `#${rank}`}
                              </div>
                              <GuildEmblemSVG emblem={g.emblem} size={isTop3?56:44}/>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontFamily:"'Cinzel',serif", color: rank===1?"#fbbf24": rank===2?"#cbd5e1": rank===3?"#d97706":"#e2e8f0", fontSize: isTop3?"0.92rem":"0.82rem", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                  {g.emoji} {g.name} <span style={{fontSize:"0.65rem",color:"#94a3b8"}}>{hall.emoji}</span>
                                </div>
                                <div style={{ fontSize:"0.68rem", color:"#94a3b8", marginTop:2 }}>
                                  Lv.{g.level||1} · {g.members?.length||0} membri · ⭐ {g.xp||0} XP
                                </div>
                                {g.description && <div style={{ fontSize:"0.66rem", color:"#4b5563", fontStyle:"italic", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.description}</div>}
                              </div>
                              <div style={{ flexShrink:0 }}>
                                {isPending
                                  ? <div style={{ padding:"0.4rem 0.75rem", background:"rgba(109,40,217,0.15)", border:"1px solid #7c3aed", borderRadius:7, color:"#a78bfa", fontSize:"0.72rem", fontWeight:600 }}>⏳ In attesa</div>
                                  : <button onClick={()=>requestJoinGuild(g.id)}
                                      style={{ padding:"0.4rem 0.75rem", background:"rgba(109,40,217,0.25)", border:"1px solid #7c3aed", borderRadius:7, color:"#c4b5fd", cursor:"pointer", fontSize:"0.75rem", fontWeight:600, transition:"background 0.2s" }}
                                      onMouseEnter={e=>e.currentTarget.style.background="rgba(109,40,217,0.45)"}
                                      onMouseLeave={e=>e.currentTarget.style.background="rgba(109,40,217,0.25)"}>
                                      📨 Richiesta
                                    </button>
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Fonda Gilda — collapsible button */}
                  <div>
                    <button onClick={()=>setShowGuildCreator(v=>!v)}
                      style={{ width:"100%", padding:"0.7rem 1rem", background: showGuildCreator?"rgba(109,40,217,0.25)":"rgba(15,23,42,0.6)", border:"1px solid #7c3aed", borderRadius:10, color:"#c4b5fd", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.84rem", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: showGuildCreator?8:0 }}>
                      <span>🏛️ Fonda una Nuova Gilda</span>
                      <span style={{ fontSize:"0.7rem", color:"#94a3b8" }}>{showGuildCreator?"▲":"▼"} 10.000 🪙</span>
                    </button>
                    {showGuildCreator && (
                      <div style={{ background:"rgba(15,23,42,0.7)", border:"1px solid #7c3aed", borderRadius:10, padding:"1rem", animation:"fadeIn 0.2s" }}>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                          {GUILD_EMOJIS.map(e=>(
                            <button key={e} onClick={()=>setGuildForm(f=>({...f,emoji:e}))} style={{ fontSize:"1.1rem", width:36, height:36, background:guildForm.emoji===e?"rgba(109,40,217,0.4)":"rgba(15,23,42,0.5)", border:`1px solid ${guildForm.emoji===e?"#7c3aed":"#334155"}`, borderRadius:6, cursor:"pointer" }}>{e}</button>
                          ))}
                        </div>
                        <input value={guildForm.name} onChange={e=>setGuildForm(f=>({...f,name:e.target.value}))} placeholder="Nome della gilda..."
                          style={{ width:"100%", marginBottom:8, padding:"0.5rem 0.7rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6, color:"#e2e8f0", fontSize:"0.85rem" }} />
                        <textarea value={guildForm.desc} onChange={e=>setGuildForm(f=>({...f,desc:e.target.value}))} placeholder="Descrizione (opzionale)..." rows={2}
                          style={{ width:"100%", marginBottom:10, padding:"0.5rem 0.7rem", background:"rgba(15,23,42,0.7)", border:"1px solid #334155", borderRadius:6, color:"#e2e8f0", fontSize:"0.82rem", resize:"none" }} />
                        <div style={{ marginBottom:10 }}>
                          <div style={{ fontSize:"0.72rem", color:"#94a3b8", marginBottom:6, fontFamily:"'Cinzel',serif", letterSpacing:"0.06em" }}>🛡️ Stemma araldico</div>
                          <GuildEmblemEditor emblem={guildForm.emblem} onChange={emb=>setGuildForm(f=>({...f,emblem:emb}))}/>
                        </div>
                        <BigBtn onClick={()=>{createGuild();setShowGuildCreator(false);}} gold icon="🏛️" disabled={(me?.gold||0)<10000}>Fonda ({me?.gold||0}/10.000 🪙)</BigBtn>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {tab==="diary" && (() => {
          const diary = [...(qs?.partyDiary || [])].reverse();
          // Group by date
          const grouped = [];
          for(const entry of diary) {
            const last = grouped[grouped.length - 1];
            if(last && last.date === entry.date) last.entries.push(entry);
            else grouped.push({ date: entry.date, entries: [entry] });
          }
          const typeColor = { quest:'rgba(251,191,36,0.12)', combat:'rgba(239,68,68,0.1)', death:'rgba(100,0,0,0.18)', rest:'rgba(30,64,120,0.15)', default:'rgba(30,41,59,0.3)' };
          const typeBorder = { quest:'rgba(251,191,36,0.35)', combat:'rgba(239,68,68,0.3)', death:'rgba(153,27,27,0.5)', rest:'rgba(59,130,246,0.3)', default:'rgba(51,65,85,0.4)' };
          return (
            <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
              <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>📖 Diario</h3>

              {/* Battle history */}
              {(me?.stats?.battleHistory||[]).length > 0 && (
                <div style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"0.9rem", marginBottom:"1.2rem" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8", marginBottom:10 }}>⚔️ ULTIME BATTAGLIE</div>
                  {(me.stats.battleHistory).map((b, i) => {
                    const won = b.result === "victory";
                    return (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"0.55rem 0.7rem", background: won?"rgba(20,83,45,0.15)":"rgba(127,29,29,0.15)", border:`1px solid ${won?"rgba(74,222,128,0.2)":"rgba(239,68,68,0.2)"}`, borderRadius:7, marginBottom:6 }}>
                        <span style={{ fontSize:"1.1rem", flexShrink:0 }}>{won?"🏆":"💀"}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                            <span style={{ fontSize:"0.78rem", fontWeight:700, color: won?"#4ade80":"#f87171" }}>{won?"VITTORIA":"SCONFITTA"}</span>
                            {b.questName && <span style={{ fontSize:"0.68rem", color:"#64748b" }}>— {b.questName}</span>}
                          </div>
                          <div style={{ fontSize:"0.68rem", color:"#94a3b8", display:"flex", gap:10, flexWrap:"wrap" }}>
                            {b.enemies?.length > 0 && <span>🗡️ {b.enemies.slice(0,3).join(', ')}{b.enemies.length>3?` +${b.enemies.length-3}`:""}</span>}
                            {b.myDmg > 0 && <span>🔥 {b.myDmg} dmg</span>}
                            {b.xpGained > 0 && <span>⭐ +{b.xpGained} XP</span>}
                            {b.goldGained > 0 && <span>💰 +{b.goldGained}</span>}
                            <span>🔄 {b.rounds} round{b.rounds!==1?"i":""}</span>
                          </div>
                        </div>
                        <span style={{ fontSize:"0.62rem", color:"#374151", flexShrink:0, whiteSpace:"nowrap" }}>
                          {new Date(b.date).toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit'})}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.74rem", color:"#94a3b8", marginBottom:8 }}>📜 DIARIO DEL PARTY</div>
              {diary.length === 0 && (
                <div style={{ color:"#4b5563", textAlign:"center", padding:"3rem 1rem", border:"1px dashed #1f2937", borderRadius:8, fontSize:"0.85rem" }}>
                  Il diario è vuoto. Completate missioni, combattimenti e riposi per riempirlo di storie.
                </div>
              )}
              {grouped.map((group, gi) => (
                <div key={gi} style={{ marginBottom:"1.5rem" }}>
                  <div style={{ fontSize:"0.68rem", color:"#64748b", fontFamily:"'Cinzel',serif", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8, paddingBottom:4, borderBottom:"1px solid rgba(51,65,85,0.4)" }}>
                    {group.date}
                  </div>
                  {group.entries.map((entry, ei) => (
                    <div key={ei} style={{ background: typeColor[entry.type] || typeColor.default, border:`1px solid ${typeBorder[entry.type] || typeBorder.default}`, borderRadius:8, padding:"0.75rem 0.9rem", marginBottom:8 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <span style={{ fontSize:"1.2rem", flexShrink:0, lineHeight:1.3 }}>{entry.icon}</span>
                        <div style={{ flex:1 }}>
                          <p style={{ margin:"0 0 5px", color:"#e2e8f0", fontSize:"0.84rem", lineHeight:1.5 }}>{entry.text}</p>
                          {entry.players?.length > 0 && (
                            <div style={{ fontSize:"0.68rem", color:"#64748b" }}>
                              {entry.players.filter(Boolean).join(' · ')}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize:"0.65rem", color:"#374151", flexShrink:0, whiteSpace:"nowrap" }}>
                          {new Date(entry.ts).toLocaleTimeString('it-IT', { hour:'2-digit', minute:'2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}

        {tab==="combat" && (
          <div style={{ flex:1, overflowY:"auto", padding:combatMode?"1.35rem":"1rem", background:"linear-gradient(180deg, rgba(20,10,10,0.18) 0%, rgba(3,7,18,0.24) 100%)" }}>
            {!combat?.active ? (
              <div style={{ textAlign:"center", padding:"3rem", color:"#64748b" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔒</div>
                <p>Nessuna battaglia in corso.</p>
                <p style={{ fontSize:"0.8rem" }}>Accetta una missione e usa il tab Missioni per iniziare il combattimento.</p>
              </div>
            ) : (
              <div style={{ maxWidth:1460, margin:"0 auto" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:"1rem", padding:"1rem 1.1rem", background:"linear-gradient(135deg, rgba(40,12,12,0.92), rgba(12,16,28,0.94))", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, boxShadow:"0 18px 40px rgba(0,0,0,0.24)" }}>
                  <div>
                    <h3 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fca5a5", margin:"0 0 0.35rem", fontSize:"1.5rem", letterSpacing:"0.04em" }}>⚔️ Battaglia</h3>
                    <div style={{ color:"#cbd5e1", fontSize:"0.9rem" }}>Round {combat.round} • {combat.combatants.length} partecipanti • il destino si decide ora</div>
                    <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                      {"Notification" in window && Notification.permission !== "granted" && (
                        <button onClick={()=>Notification.requestPermission()} style={{ padding:"0.25rem 0.7rem", background:"rgba(109,40,217,0.2)", border:"1px solid #7c3aed", borderRadius:6, color:"#c4b5fd", cursor:"pointer", fontSize:"0.68rem" }}>
                          🔔 Notifiche
                        </button>
                      )}
                    </div>
                  </div>
                  {myTurn&&(
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {turnTimeLeft!==null && (
                        <span style={{ fontSize:turnTimeLeft<=5?"1.5rem":"1.1rem", fontWeight:900, color:turnTimeLeft<=5?"#ef4444":turnTimeLeft<=10?"#f97316":"#94a3b8", minWidth:44, textAlign:"center", transition:"all 0.3s", fontVariantNumeric:"tabular-nums" }}>
                          {turnTimeLeft<=5&&"⚠️ "}{turnTimeLeft}s
                        </span>
                      )}
                      <span style={{ padding:"0.45rem 0.95rem", background:"rgba(239,68,68,0.24)", border:"1px solid #ef4444", borderRadius:999, color:"#fee2e2", fontSize:"0.84rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.06em" }}>{myDeathTurn?"🕯️ SALVEZZA":"⚔️ TUO TURNO"}</span>
                    </div>
                  )}
                </div>

                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.7fr) minmax(320px,0.95fr)", gap:"1rem", alignItems:"start" }}>
                  <div>
                    <div style={{ marginBottom:"1rem", padding:"1rem", background:"rgba(10,15,30,0.7)", border:"1px solid rgba(127,29,29,0.3)", borderRadius:14 }}>
                      {combat.pendingLog && (() => {
                        const cue = combatLogCue(combat.pendingLog);
                        if(!cue) return null;
                        return (
                          <div style={{ marginBottom:"0.8rem", padding:"0.75rem 0.9rem", background:cue.bg, border:`1px solid ${cue.color}`, borderRadius:10, display:"flex", alignItems:"center", gap:10, animation:"combatCueIn .28s ease both" }}>
                            <span style={{ fontSize:"1.5rem", filter:`drop-shadow(0 0 8px ${cue.color})` }}>{cue.icon}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ color:cue.color, fontFamily:"'Cinzel Decorative',serif", fontWeight:800, letterSpacing:"0.06em", fontSize:"0.9rem" }}>{cue.title}</div>
                              {cue.value && <div style={{ color:"#e2e8f0", fontSize:"0.78rem", marginTop:2 }}>{cue.value}</div>}
                            </div>
                          </div>
                        );
                      })()}
                      {/* Battle name + difficulty header */}
                      <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.75rem", paddingBottom:"0.6rem", borderBottom:"1px solid rgba(127,29,29,0.25)" }}>
                        <span style={{ fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:"0.95rem", color:"#fde68a", flex:1, letterSpacing:"0.04em" }}>
                          ⚔️ {currentQ?.title || combat?.name || "Battaglia"}
                        </span>
                        {(currentQ?.difficulty || combat?.difficulty) && (
                          <span style={{ fontSize:"0.78rem", fontWeight:700, padding:"0.2rem 0.65rem", borderRadius:999, background:"rgba(0,0,0,0.4)", border:`1px solid ${DIFF_COLOR[normalizeMissionDifficulty(currentQ?.difficulty||combat?.difficulty)]||"#94a3b8"}`, color:DIFF_COLOR[normalizeMissionDifficulty(currentQ?.difficulty||combat?.difficulty)]||"#94a3b8", letterSpacing:"0.06em", textTransform:"capitalize" }}>
                            {{ facile:"Facile", medio:"Medio", difficile:"Difficile", epica:"Epica" }[normalizeMissionDifficulty(currentQ?.difficulty||combat?.difficulty)] || (currentQ?.difficulty||combat?.difficulty)}
                          </span>
                        )}
                      </div>
                      <CombatVisualizer
                        combat={combat}
                        myId={myId}
                        isMobile={isMobile}
                        images={Object.fromEntries(combat.combatants.map(c => [
                          c.id,
                          c.isSummon ? getMonsterImage(c) : c.isPlayer ? getPlayerPortrait(c) : getMonsterImage(c)
                        ]))}
                        cue={combatLogCue(combat.pendingLog)}
                      />
                    </div>
                  </div>

                  <div style={{ display:"grid", gap:"1rem", position: isMobile ? "relative" : "sticky", top:0, order: isMobile ? -1 : 0 }}>
                    {combat.pendingLog && (
                      (() => {
                        const cue = combatLogCue(combat.pendingLog);
                        return (
                          <div style={{ padding:"1.1rem 1.2rem", background:"linear-gradient(180deg,rgba(10,20,10,0.97),rgba(15,23,42,0.97))", border:`1px solid ${cue?.color || "rgba(34,197,94,0.35)"}`, borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.4)", animation:"combatCueIn .24s ease both" }}>
                            {cue && (
                              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"0.75rem", paddingBottom:"0.65rem", borderBottom:"1px solid rgba(148,163,184,0.13)" }}>
                                <span style={{ fontSize:"1.55rem" }}>{cue.icon}</span>
                                <div style={{ flex:1 }}>
                                  <div style={{ color:cue.color, fontFamily:"'Cinzel Decorative',serif", fontSize:"0.92rem", fontWeight:800, letterSpacing:"0.06em" }}>{cue.title}</div>
                                  {cue.value && <div style={{ color:"#cbd5e1", fontSize:"0.76rem" }}>{cue.value}</div>}
                                </div>
                              </div>
                            )}
                            <div style={{ fontSize:"0.82rem", color:"#d1fae5", lineHeight:1.75, whiteSpace:"pre-line", marginBottom:"0.75rem", fontFamily:"'Crimson Pro',Georgia,serif" }} dangerouslySetInnerHTML={{ __html: fmt(combat.pendingLog) }} />
                            <div style={{ height:3, background:"rgba(34,197,94,0.15)", borderRadius:2, overflow:"hidden" }}>
                              <div style={{ height:"100%", width:"100%", background:cue?.color || "rgba(34,197,94,0.5)", borderRadius:2, animation:"logAutoDismiss 3.5s linear forwards" }}/>
                            </div>
                          </div>
                        );
                      })()
                    )}
                    <div style={{ textAlign:"center", padding:"1.35rem 1.1rem", background:"linear-gradient(180deg, rgba(24,10,10,0.92), rgba(15,23,42,0.94))", border:"1px solid rgba(239,68,68,0.26)", borderRadius:12, boxShadow:"0 18px 40px rgba(0,0,0,0.22)" }}>
                      {combat.pendingLog ? null : isMySummonTurn ? (
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:"1.5rem", marginBottom:"0.4rem" }}>{activeCombatant?.emoji} </div>
                          <p style={{ color:"#fca5a5", fontFamily:"'Cinzel Decorative',serif", marginBottom:"0.8rem", fontSize:"0.95rem" }}>
                            Turno di <strong>{activeCombatant?.name}</strong> — scegli il bersaglio!
                          </p>
                          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            {(combat.combatants||[]).filter(c => !c.isPlayer && c.hp > 0).map(enemy => (
                              <button key={enemy.id} onClick={() => doSummonAttack(enemy.id)}
                                style={{ padding:"0.6rem 1rem", background:"rgba(127,29,29,0.3)", border:"1px solid #ef4444", borderRadius:8, color:"#fca5a5", fontFamily:"'Cinzel',serif", fontSize:"0.85rem", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                <span>{enemy.emoji} {enemy.name}</span>
                                <span style={{ fontSize:"0.72rem", color:"#94a3b8" }}>❤️ {enemy.hp}/{enemy.maxHp}</span>
                              </button>
                            ))}
                          </div>
                          <div style={{ marginTop:8, fontSize:"0.65rem", color:"#475569" }}>Auto-attacco tra 15s se non scegli</div>
                        </div>
                      ) : myTurn ? (
                        <>
                          <p style={{ color:"#fecaca", fontFamily:"'Cinzel Decorative',serif", marginBottom:"1rem", fontSize:"1.08rem", letterSpacing:"0.04em" }}>{myDeathTurn ? "🕯️ Sei a terra: tira la tua salvezza contro la morte." : "⚔️ Il campo si apre davanti a te."}</p>
                          {myDeathTurn ? (
                            <div style={{ display:"grid", gap:10, justifyItems:"center" }}>
                              <div style={{ color:"#fecaca", fontSize:"0.95rem" }}>Successi: {activeCombatant?.deathSuccesses || 0}/3 • Fallimenti: {activeCombatant?.deathFailures || 0}/3</div>
                              <button onClick={doAttack} style={{ width:"100%", maxWidth:340, padding:"1rem 1.4rem", background:"linear-gradient(135deg,#7f1d1d,#b91c1c)", border:"2px solid #ef4444", borderRadius:10, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.06rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 14px 28px rgba(127,29,29,0.24)" }}>
                                <span className={diceAnim?"dice-spin":""} style={{ display:"inline-block", marginRight:8 }}>🎲</span>
                                TIRO SALVEZZA
                              </button>
                            </div>
                          ) : spellMenu ? (
                            <div style={{ display:"grid", gap:8, justifyItems:"center" }}>
                              <div style={{ fontSize:"0.92rem", color:"#fbbf24", fontWeight:700 }}>Scegli un incantesimo</div>
                              {/* Bersaglio nemico (per magie danno) */}
                              {(() => {
                                const liveEnemies = combat.combatants.filter(c=>!c.isPlayer&&c.hp>0);
                                if(liveEnemies.length <= 1) return null;
                                return (
                                  <div style={{ width:"100%", marginBottom:4 }}>
                                    <div style={{ fontSize:"0.7rem", color:"#fca5a5", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>🎯 Bersaglio nemico</div>
                                    <div style={{ display:"grid", gap:5 }}>
                                      {liveEnemies.map(e=>{
                                        const isSel = selectedTarget===e.id;
                                        return (
                                          <button key={e.id} onClick={()=>setSelectedTarget(isSel?null:e.id)}
                                            style={{ display:"flex", alignItems:"center", gap:7, padding:"0.45rem 0.6rem", background:isSel?"rgba(239,68,68,0.25)":"rgba(127,29,29,0.18)", border:`2px solid ${isSel?"#ef4444":"#7f1d1d"}`, borderRadius:7, cursor:"pointer", textAlign:"left" }}>
                                            <span style={{ fontSize:"1rem" }}>{e.emoji}</span>
                                            <div style={{ flex:1, minWidth:0 }}>
                                              <div style={{ fontSize:"0.78rem", color:isSel?"#fee2e2":"#fca5a5", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.name}</div>
                                              <div style={{ fontSize:"0.65rem", color:"#94a3b8" }}>{e.hp}/{e.maxHp} HP</div>
                                            </div>
                                            {isSel && <span style={{ fontSize:"0.68rem", color:"#ef4444" }}>✓</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}
                              {/* Bersaglio alleato (per magie curative) */}
                              {(() => {
                                const hasHealSpell = preparedSpells.some(s=>s.type==="heal");
                                const healTargets = combat.combatants.filter(c=>c.isPlayer&&!c.dead);
                                const hasOtherAlly = healTargets.some(c=>c.id!==myId);
                                if(!hasHealSpell || !hasOtherAlly) return null;
                                return (
                                  <div style={{ width:"100%", marginBottom:4 }}>
                                    <div style={{ fontSize:"0.7rem", color:"#4ade80", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>💚 Bersaglio cura</div>
                                    <div style={{ display:"grid", gap:5 }}>
                                      {healTargets.map(a=>{
                                        const isSel = selectedAllyTarget===a.id;
                                        const isSelf = a.id===myId;
                                        const isFullHp = a.hp>=a.maxHp;
                                        return (
                                          <button key={a.id} onClick={()=>setSelectedAllyTarget(isSel?null:a.id)}
                                            style={{ display:"flex", alignItems:"center", gap:7, padding:"0.45rem 0.6rem", background:isSel?"rgba(34,197,94,0.2)":"rgba(20,83,45,0.18)", border:`2px solid ${isSel?"#22c55e":"#166534"}`, borderRadius:7, cursor:"pointer", textAlign:"left", opacity: isFullHp?0.6:1 }}>
                                            <span style={{ fontSize:"0.9rem" }}>{CLASSES[a.class||"warrior"]?.emoji||"⚔️"}</span>
                                            <div style={{ flex:1, minWidth:0 }}>
                                              <div style={{ fontSize:"0.78rem", color:isSel?"#bbf7d0":"#86efac", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.name}{isSelf?" (tu)":""}</div>
                                              <div style={{ fontSize:"0.65rem", color: isFullHp?"#4ade80":"#94a3b8" }}>{a.hp}/{a.maxHp} HP{isFullHp?" ✓":""}</div>
                                            </div>
                                            {isSel && <span style={{ fontSize:"0.68rem", color:"#22c55e" }}>✓</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}
                              {spellLevels.map(lvl=>{
                                const spells = spellsByLevel[lvl] || [];
                                if(!spells.length) return null;
                                return (
                                  <div key={lvl} style={{ width:"100%" }}>
                                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"0.7rem 0 0.35rem", fontSize:"0.88rem", color:"#c4b5fd", fontWeight:600 }}>
                                      <span>{lvl===0 ? "Trucchetti" : `Livello ${lvl}`}</span>
                                      <span style={{ fontSize:"0.78rem", color:"#cbd5e1" }}>{lvl===0 ? "gratis" : `${spellSlots[lvl]} slot`}</span>
                                    </div>
                                    {spells.map(spell=> (
                                      <button key={spell.id} onClick={()=>{ castSpell(spell, spell.type==="heal"?selectedAllyTarget:null); }} style={{ width:"100%", padding:"0.95rem 1rem", background:"rgba(99,102,241,0.15)", border:`1px solid ${spell.type==="heal"?"#16a34a":"#4338ca"}`, borderRadius:10, color:"#e0d7ff", cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:8 }}>
                                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                                          <span style={{ fontWeight:700, fontSize:"0.9rem" }}>{spell.emoji||"✨"} {spell.name}</span>
                                          <span style={{ fontSize:"0.74rem", color:"#cbd5e1" }}>{spell.slots===0 ? "Gratis" : `Slot ${spell.slots||0}`}</span>
                                        </div>
                                        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:5 }}>
                                          {spellEffectSummary(spell).map(detail => (
                                            <span key={detail} style={{ fontSize:"0.7rem", color:"#cbd5e1", background:"rgba(255,255,255,0.05)", border:"1px solid #334155", borderRadius:999, padding:"2px 7px" }}>
                                              {detail}
                                            </span>
                                          ))}
                                          {spell.type==="heal" && selectedAllyTarget && selectedAllyTarget !== myId && (
                                            <span style={{ fontSize:"0.7rem", color:"#4ade80", background:"rgba(20,83,45,0.3)", border:"1px solid #16a34a", borderRadius:999, padding:"2px 7px" }}>
                                              → {combat.combatants.find(c=>c.id===selectedAllyTarget)?.name || "Alleato"}
                                            </span>
                                          )}
                                        </div>
                                        <div style={{ fontSize:"0.76rem", color:"#cbd5e1", marginTop:4, lineHeight:1.45 }}>{spell.desc}</div>
                                      </button>
                                    ))}
                                  </div>
                                );
                              })}
                              <SmallBtn onClick={()=>{ setSpellMenu(false); setSelectedAllyTarget(null); }}>← Indietro</SmallBtn>
                            </div>
                          ) : (
                            <>
                              {/* Countdown turno */}
                              {turnTimeLeft !== null && (
                                <div style={{ marginBottom:10 }}>
                                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                                    <span style={{ fontSize:"0.65rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em" }}>⏱ Tempo rimasto</span>
                                    <span style={{ fontSize:"0.95rem", fontWeight:900, color:turnTimeLeft<=5?"#ef4444":turnTimeLeft<=10?"#f97316":"#4ade80", fontVariantNumeric:"tabular-nums", transition:"color 0.3s" }}>
                                      {turnTimeLeft<=5&&"⚠️ "}{turnTimeLeft}s
                                    </span>
                                  </div>
                                  <div style={{ height:5, background:"rgba(30,41,59,0.7)", borderRadius:3, overflow:"hidden" }}>
                                    <div style={{ height:"100%", width:`${(turnTimeLeft/30)*100}%`, background:turnTimeLeft<=5?"#ef4444":turnTimeLeft<=10?"#f97316":"#22c55e", borderRadius:3, transition:"width 1s linear, background 0.3s" }}/>
                                  </div>
                                </div>
                              )}
                              {/* Selezione bersaglio */}
                              {(() => {
                                const liveEnemies = combat.combatants.filter(c=>!c.isPlayer&&c.hp>0);
                                if(liveEnemies.length <= 1) return null;
                                return (
                                  <div style={{ marginBottom:10 }}>
                                    <div style={{ fontSize:"0.72rem", color:"#fca5a5", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, fontFamily:"'Cinzel',serif" }}>🎯 Scegli bersaglio</div>
                                    <div style={{ display:"grid", gap:6 }}>
                                      {liveEnemies.map(e=>{
                                        const isSel = selectedTarget===e.id;
                                        return (
                                          <button key={e.id} onClick={()=>setSelectedTarget(isSel?null:e.id)}
                                            style={{ display:"flex", alignItems:"center", gap:8, padding:"0.55rem 0.75rem", background:isSel?"rgba(239,68,68,0.25)":"rgba(127,29,29,0.18)", border:`2px solid ${isSel?"#ef4444":"#7f1d1d"}`, borderRadius:8, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
                                            <ArtThumb src={getMonsterImage(e)} alt={e.name} size={36} radius={6} />
                                            <div style={{ flex:1, minWidth:0 }}>
                                              <div style={{ fontSize:"0.82rem", color:isSel?"#fee2e2":"#fca5a5", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.emoji} {e.name}</div>
                                              <div style={{ fontSize:"0.68rem", color:"#94a3b8" }}>{e.hp}/{e.maxHp} HP</div>
                                            </div>
                                            {isSel && <span style={{ fontSize:"0.72rem", color:"#ef4444", fontFamily:"'Cinzel',serif", flexShrink:0 }}>✓ SEL.</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    {!selectedTarget && <div style={{ fontSize:"0.68rem", color:"#64748b", marginTop:4 }}>Nessun bersaglio — attacchi il primo nemico.</div>}
                                  </div>
                                );
                              })()}
                              {(() => {
                                const activeLeg = qs?.masterBuffs?.[myId]?.legendaryItem;
                                if(!activeLeg || activeLeg.turnsLeft <= 0) return null;
                                const bonusLine = activeLeg.type==="weapon" ? `⚔️ ${activeLeg.weapon_die} +${activeLeg.bonus_atk} ATK`
                                  : activeLeg.type==="armor" ? `🛡️ +${activeLeg.bonus_def} DEF`
                                  : activeLeg.type==="magic" ? `✨ +${activeLeg.bonus_mag} MAG` : "";
                                return (
                                  <div style={{ background:"rgba(76,29,149,0.28)", border:"1px solid #7c3aed", borderRadius:8, padding:"0.45rem 0.7rem", marginBottom:6, display:"flex", alignItems:"center", gap:8 }}>
                                    <span style={{ fontSize:"1.2rem", lineHeight:1 }}>{activeLeg.emoji}</span>
                                    <div style={{ flex:1, minWidth:0 }}>
                                      <div style={{ fontSize:"0.7rem", color:"#c4b5fd", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{activeLeg.name}</div>
                                      <div style={{ fontSize:"0.6rem", color:"#a78bfa" }}>{bonusLine} · si applica automaticamente · {activeLeg.turnsLeft}t rimasti</div>
                                    </div>
                                    <span style={{ fontSize:"0.55rem", color:"#c4b5fd", background:"rgba(109,40,217,0.3)", border:"1px solid #6d28d9", borderRadius:999, padding:"1px 6px", whiteSpace:"nowrap", flexShrink:0 }}>Passivo</span>
                                  </div>
                                );
                              })()}
                              <div style={{ display:"grid", gap:10 }}>
                                <button onClick={doAttack} style={{ width:"100%", padding:"1rem 1.4rem", background:"linear-gradient(135deg,#7f1d1d,#dc2626)", border:"2px solid #ef4444", borderRadius:10, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 14px 28px rgba(127,29,29,0.24)" }}>
                                  <span className={diceAnim?"dice-spin":""} style={{ display:"inline-block", marginRight:8 }}>🎲</span>
                                  {selectedTarget ? `ATTACCA ${combat.combatants.find(c=>c.id===selectedTarget)?.name||""}` : "ATTACCA"}
                                </button>
                                {isCaster && (
                                  <button onClick={()=>setSpellMenu(true)} disabled={!availableSpells.length} style={{ width:"100%", padding:"1rem 1.4rem", background:availableSpells.length?"linear-gradient(135deg,#551a8b,#7c3aed)":"rgba(75,43,105,0.35)", border:"2px solid #7c3aed", borderRadius:10, color:"#e0d7ff", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.04rem", cursor:availableSpells.length?"pointer":"not-allowed", letterSpacing:"0.08em" }}>
                                    🔮 Magia {totalSlots(spellSlots)>0?`(${totalSlots(spellSlots)})`:"(solo trucchetti)"}
                                  </button>
                                )}
                              </div>
                              <p style={{ color:"#cbd5e1", fontSize:"0.8rem", marginTop:"0.85rem", lineHeight:1.55 }}>Prima tiri per colpire. Se l'attacco supera la CA del bersaglio, il sistema mostra e applica il dado danno dell'arma o dell'incantesimo.</p>
                            </>
                          )}
                        </>
                      ) : (
                        <div style={{ color:"#94a3b8", fontSize:"0.9rem", lineHeight:1.6, textAlign:"center" }}>
                          {isLeaderForMonsterTurn
                            ? <span style={{ color:"#fca5a5", fontFamily:"'Cinzel',serif" }}>⚔️ <strong>{activeCombatant?.name}</strong> sta attaccando…</span>
                            : <>Turno di <strong style={{ color:"#f8fafc" }}>{activeCombatant?.name}</strong>…</>
                          }
                        </div>
                      )}
                      {!combat.pendingLog && myTurn && (
                        <button onClick={forceNextCombatTurn} style={{ width:"100%", maxWidth:340, marginTop:"0.75rem", padding:"0.6rem 1rem", background:"rgba(30,41,59,0.6)", border:"1px solid rgba(148,163,184,0.25)", borderRadius:8, color:"#64748b", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", cursor:"pointer", letterSpacing:"0.05em" }}>
                          ⏭️ Salta il mio turno
                        </button>
                      )}
                    </div>

                    <div style={{ background:"rgba(8,14,28,0.9)", border:"1px solid rgba(148,163,184,0.16)", borderRadius:12, overflow:"hidden", boxShadow:"0 16px 34px rgba(0,0,0,0.18)" }}>
                      <button onClick={()=>setShowCombatLog(v=>!v)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.75rem 1rem", background:"transparent", border:"none", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", color:"#cbd5e1", letterSpacing:"0.08em" }}>
                        <span>📜 LOG DI BATTAGLIA ({messages.filter(m=>m.type==="combat" && (!combat?.startedAt || new Date(m.created_at).getTime() >= combat.startedAt - 5000)).slice(-50).length})</span>
                        <span style={{ fontSize:"0.9rem", color:"#94a3b8" }}>{showCombatLog ? "▲ chiudi" : "▼ apri"}</span>
                      </button>
                      {showCombatLog && (
                        <div style={{ maxHeight:320, overflowY:"auto", padding:"0 0.85rem 0.85rem", borderTop:"1px solid rgba(148,163,184,0.1)" }} onClick={()=>setShowCombatLog(false)}>
                          {messages.filter(m=>m.type==="combat" && (!combat?.startedAt || new Date(m.created_at).getTime() >= combat.startedAt - 5000)).slice(-50).map(m=>(
                            <div key={m.id} style={{ padding:"0.65rem 0.75rem", background:"rgba(127,29,29,0.16)", border:"1px solid #7f1d1d", borderRadius:8, marginBottom:6, marginTop:6, fontSize:"0.82rem", color:"#fecaca", lineHeight:1.6 }}
                              dangerouslySetInnerHTML={{ __html:fmt(m.content) }} />
                          ))}
                          <div ref={combatLogEndRef} />
                          <div style={{ textAlign:"center", fontSize:"0.7rem", color:"#4b5563", marginTop:4 }}>tocca per chiudere</div>
                        </div>
                      )}
                    </div>

                    <div style={{ padding:"0.75rem 1rem", background:"rgba(20,5,5,0.7)", border:"1px solid rgba(127,29,29,0.3)", borderRadius:10, display:"flex", flexDirection:"column", gap:6, alignItems:"center" }}>
                      <button onClick={abandonQuest} style={{ width:"100%", padding:"0.6rem 1rem", background:"rgba(127,29,29,0.18)", border:"1px solid rgba(127,29,29,0.5)", borderRadius:8, color:"#f87171", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", cursor:"pointer", letterSpacing:"0.05em" }}>
                        🏃 Abbandona Quest
                      </button>
                      <span style={{ fontSize:"0.68rem", color:"#94a3b8" }}>Richiede una 💨 Pozione di Fuga ({inventoryCounts["potion_escape"]||0} in inventario)</span>
                    </div>
                  </div>
                </div>

                {/* ── Battle Chat ── */}
                {(() => {
                  const chatMessages = qs?.battleChat || [];
                  const CLASS_COLORS = { warrior:"#f87171", mage:"#a78bfa", healer:"#34d399", ranger:"#fb923c", rogue:"#fbbf24", paladin:"#60a5fa", sorcerer:"#c084fc", druid:"#86efac", bard:"#f472b6" };
                  return (
                    <div style={{ marginTop:"1rem", background:"rgba(8,14,28,0.88)", border:"1px solid rgba(148,163,184,0.18)", borderRadius:12, overflow:"hidden" }}>
                      <div style={{ padding:"0.55rem 1rem", borderBottom:"1px solid rgba(148,163,184,0.1)", fontSize:"0.72rem", color:"#64748b", fontFamily:"'Cinzel',serif", letterSpacing:"0.1em" }}>
                        💬 CHAT DI BATTAGLIA
                      </div>
                      <div style={{ maxHeight:160, overflowY:"auto", padding:"0.5rem 0.85rem", display:"flex", flexDirection:"column", gap:4 }}>
                        {chatMessages.length === 0
                          ? <div style={{ color:"#334155", fontSize:"0.72rem", textAlign:"center", padding:"0.5rem" }}>Nessun messaggio ancora…</div>
                          : chatMessages.map(m => (
                              <div key={m.id} style={{ fontSize:"0.78rem", lineHeight:1.4 }}>
                                <span style={{ color: CLASS_COLORS[m.class] || "#94a3b8", fontWeight:700, marginRight:4 }}>{m.author}:</span>
                                <span style={{ color:"#e2e8f0" }}>{m.text}</span>
                              </div>
                            ))
                        }
                      </div>
                      <div style={{ display:"flex", gap:6, padding:"0.5rem 0.75rem", borderTop:"1px solid rgba(148,163,184,0.1)" }}>
                        <input
                          value={battleChatInput}
                          onChange={e => setBattleChatInput(e.target.value)}
                          onKeyDown={e => { if(e.key==="Enter" && battleChatInput.trim()) { sendBattleChat(battleChatInput); e.preventDefault(); } }}
                          placeholder="Scrivi agli alleati…"
                          maxLength={120}
                          style={{ flex:1, background:"rgba(15,23,42,0.7)", border:"1px solid #1e293b", borderRadius:7, padding:"0.4rem 0.65rem", color:"#e2e8f0", fontSize:"0.8rem", fontFamily:"inherit", outline:"none" }}
                        />
                        <button
                          onClick={() => { if(battleChatInput.trim()) sendBattleChat(battleChatInput); }}
                          style={{ padding:"0.4rem 0.75rem", background:"rgba(99,102,241,0.25)", border:"1px solid #4338ca", borderRadius:7, color:"#a5b4fc", fontSize:"0.8rem", cursor:"pointer", flexShrink:0 }}>
                          Invia
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
        </div>{/* end TabPane */}
      </main>
      <DiceRoller ref={diceRef} />

      {/* ── Battle Incoming Banner ── */}
      {combat?.active && tab !== "combat" && declinedCombatAt !== combat.startedAt && combat.combatants?.some(c => c.id === myId) && (
        <BattleBanner
          onEnter={() => setTab("combat")}
          onDecline={async () => { setDeclinedCombatAt(combat.startedAt); await leaveCombat(); }}
          startedAt={combat.startedAt}
        />
      )}
      {/* ── Boss Arena Re-entry Banner ── */}
      {combat?.active && combat?.isBossEvent && !combat?.combatants?.some(c => c.id === myId) && (() => {
        const koTime = combat.bossKnockedOut?.[myId];
        if (!koTime) return null;
        const secsLeft = Math.max(0, Math.ceil((koTime + 90000 - nowTick) / 1000));
        const canRejoin = secsLeft === 0;
        return (
          <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:9500, background:"rgba(2,6,23,0.97)", border:`2px solid ${canRejoin ? "#ef4444" : "#7f1d1d"}`, borderRadius:12, padding:"1rem 1.5rem", display:"flex", flexDirection:"column", alignItems:"center", gap:8, boxShadow:"0 8px 32px rgba(0,0,0,0.6)", minWidth:260, textAlign:"center" }}>
            <div style={{ fontSize:"1.8rem" }}>💀</div>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#fca5a5", fontSize:"0.9rem", fontWeight:700 }}>Eliminato dall'Arena</div>
            {canRejoin ? (
              <button onClick={enterBossArena} style={{ marginTop:4, padding:"0.5rem 1.2rem", background:"linear-gradient(135deg,#7f1d1d,#b91c1c)", border:"2px solid #ef4444", borderRadius:8, color:"#fee2e2", fontFamily:"'Cinzel',serif", fontSize:"0.85rem", cursor:"pointer", letterSpacing:"0.06em" }}>
                ⚔️ Rientra nell'Arena
              </button>
            ) : (
              <div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Rientro disponibile tra <strong style={{ color:"#fbbf24" }}>{secsLeft}s</strong></div>
            )}
          </div>
        );
      })()}

      {/* ── Rest Overlay ── */}
      {!!(qs?.rest?.endsAt && new Date(qs.rest.endsAt) > new Date() && qs.rest.startedBy === myId) && (
        <div style={{ position:"fixed", inset:0, zIndex:10500, background:"radial-gradient(circle at 50% 35%,rgba(34,211,238,0.16),transparent 28%),radial-gradient(circle at 18% 18%,rgba(251,191,36,0.13),transparent 24%),linear-gradient(180deg,rgba(3,7,18,0.98),rgba(8,13,29,0.99) 54%,rgba(2,6,23,1))", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.25rem", padding:"1.25rem", overflow:"hidden", animation:"restOverlayIn 0.8s ease" }}>
          {/* Floating stars */}
          {[...Array(12)].map((_,i)=>(
            <div key={i} style={{ position:"absolute", left:`${8+i*7}%`, top:`${15+((i*37)%65)}%`, width:2+((i*3)%4), height:2+((i*3)%4), borderRadius:"50%", background:"#c4b5fd", opacity:0.5, animation:`restStarFloat ${3+(i%4)}s ${i*0.4}s ease-in-out infinite` }}/>
          ))}

          <svg viewBox="0 0 320 220" width="min(370px,86vw)" height="auto" aria-hidden="true" style={{ overflow:"visible" }}>
            <defs>
              <clipPath id="restAstralEyeClip">
                <path d="M36,110 C84,56 236,56 284,110 C236,164 84,164 36,110 Z"/>
              </clipPath>
              <radialGradient id="restAstralSigilGr" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="rgba(34,211,238,0.26)"/>
                <stop offset="62%" stopColor="rgba(15,23,42,0.5)"/>
                <stop offset="100%" stopColor="rgba(2,6,23,0)"/>
              </radialGradient>
              <radialGradient id="restAstralScleraGr" cx="38%" cy="33%" r="70%">
                <stop offset="0%" stopColor="#f8fbff"/>
                <stop offset="58%" stopColor="#dbeafe"/>
                <stop offset="100%" stopColor="#93c5fd"/>
              </radialGradient>
              <radialGradient id="restAstralIrisGr" cx="38%" cy="34%" r="64%">
                <stop offset="0%" stopColor="#fef3c7"/>
                <stop offset="24%" stopColor="#67e8f9"/>
                <stop offset="64%" stopColor="#2563eb"/>
                <stop offset="100%" stopColor="#172554"/>
              </radialGradient>
              <linearGradient id="restAstralLidGr" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#020617"/>
                <stop offset="55%" stopColor="#08111f"/>
                <stop offset="100%" stopColor="#0f2438"/>
              </linearGradient>
              <linearGradient id="restAstralGoldGr" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#fef3c7"/>
                <stop offset="45%" stopColor="#f59e0b"/>
                <stop offset="100%" stopColor="#67e8f9"/>
              </linearGradient>
              <filter id="restAstralGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g style={{ transformOrigin:"160px 110px", animation:"restSigilPulse 5s ease-in-out infinite" }}>
              <circle cx="160" cy="110" r="102" fill="url(#restAstralSigilGr)" stroke="rgba(103,232,249,0.28)" strokeWidth="1.2"/>
              <circle cx="160" cy="110" r="82" fill="none" stroke="rgba(251,191,36,0.45)" strokeWidth="1"/>
              <g style={{ transformOrigin:"160px 110px", animation:"restRuneSpin 34s linear infinite" }}>
                <circle cx="160" cy="110" r="96" fill="none" stroke="rgba(103,232,249,0.36)" strokeWidth="1" strokeDasharray="12 18"/>
                <circle cx="160" cy="110" r="68" fill="none" stroke="rgba(253,230,138,0.38)" strokeWidth="1" strokeDasharray="4 11"/>
                {[0,45,90,135,180,225,270,315].map((angle)=>(
                  <g key={angle} transform={`rotate(${angle} 160 110)`}>
                    <path d="M160 8 L166 25 L160 34 L154 25 Z" fill="rgba(253,230,138,0.72)"/>
                  </g>
                ))}
              </g>
            </g>

            <g filter="url(#restAstralGlow)">
              <path d="M36,110 C84,56 236,56 284,110 C236,164 84,164 36,110 Z" fill="rgba(15,23,42,0.78)" stroke="url(#restAstralGoldGr)" strokeWidth="2.2"/>
              <path d="M46,110 C90,68 230,68 274,110 C230,152 90,152 46,110 Z" fill="url(#restAstralScleraGr)" clipPath="url(#restAstralEyeClip)"/>
              <g clipPath="url(#restAstralEyeClip)" style={{ animation:"restMistSweep 7s ease-in-out infinite" }}>
                <path d="M36,135 C92,102 198,142 284,92" stroke="rgba(14,165,233,0.42)" strokeWidth="11" strokeLinecap="round" fill="none"/>
              </g>
              <circle cx="160" cy="110" r="34" fill="url(#restAstralIrisGr)" clipPath="url(#restAstralEyeClip)"/>
              <circle cx="160" cy="110" r="43" fill="none" stroke="rgba(103,232,249,0.28)" strokeWidth="1.4" clipPath="url(#restAstralEyeClip)"/>
              <circle cx="160" cy="110" r="24" fill="#020617" clipPath="url(#restAstralEyeClip)"/>
              <circle cx="174" cy="94" r="7" fill="#f8fafc" opacity="0.76" clipPath="url(#restAstralEyeClip)"/>
              <circle cx="150" cy="101" r="3.5" fill="#f8fafc" opacity="0.38" clipPath="url(#restAstralEyeClip)"/>
              <g stroke="rgba(15,23,42,0.5)" strokeWidth="1" clipPath="url(#restAstralEyeClip)">
                {[0,24,48,72,96,120,144,168,192,216,240,264,288,312,336].map((angle)=>(
                  <line key={angle} x1="160" y1="110" x2={160 + Math.cos(angle * Math.PI / 180) * 34} y2={110 + Math.sin(angle * Math.PI / 180) * 34}/>
                ))}
              </g>
            </g>

            <path d="M36,110 C84,164 236,164 284,110 L284,238 L36,238 Z" fill="url(#restAstralLidGr)" opacity="0.76"/>
            <path d="M36,110 C84,164 236,164 284,110" fill="none" stroke="rgba(253,230,138,0.48)" strokeWidth="1.7"/>
            <g clipPath="url(#restAstralEyeClip)">
              <g style={{ animation:qs.rest.type === "short" ? "restUpperLidShort 7s ease-in-out infinite" : "restUpperLidLong 2.8s cubic-bezier(.2,.8,.2,1) forwards" }}>
                <path d="M20,110 C78,62 242,62 300,110 L300,18 L20,18 Z" fill="url(#restAstralLidGr)" opacity="0.98"/>
                <path d="M36,110 C84,56 236,56 284,110" fill="none" stroke="rgba(253,230,138,0.78)" strokeWidth="2.2"/>
                <path d="M64,90 C104,68 216,68 256,90" fill="none" stroke="rgba(103,232,249,0.28)" strokeWidth="1.1"/>
              </g>
              <g style={{ animation:qs.rest.type === "short" ? "restLowerLidShort 7s ease-in-out infinite" : "restLowerLidLong 2.8s cubic-bezier(.2,.8,.2,1) forwards" }}>
                <path d="M20,110 C78,158 242,158 300,110 L300,202 L20,202 Z" fill="url(#restAstralLidGr)" opacity="0.98"/>
                <path d="M36,110 C84,164 236,164 284,110" fill="none" stroke="rgba(253,230,138,0.62)" strokeWidth="1.9"/>
              </g>
            </g>
            <g clipPath="url(#restAstralEyeClip)" style={{ display:"none" }}>
              <path d="M36,110 C84,56 236,56 284,110 L284,-28 L36,-28 Z" fill="url(#restAstralLidGr)"/>
              <path d="M36,110 C84,56 236,56 284,110" fill="none" stroke="rgba(253,230,138,0.72)" strokeWidth="2.2"/>
              <path d="M63,88 C104,60 216,60 257,88" fill="none" stroke="rgba(103,232,249,0.3)" strokeWidth="1.1"/>
            </g>

            <g style={{ animation:"restGlowDrift 4.5s ease-in-out infinite" }}>
              <circle cx="96" cy="48" r="2.6" fill="#fde68a"/>
              <circle cx="231" cy="54" r="2.2" fill="#67e8f9"/>
              <circle cx="69" cy="156" r="1.8" fill="#a7f3d0"/>
              <circle cx="248" cy="148" r="1.9" fill="#fde68a"/>
            </g>
          </svg>

          {/* SVG Realistic Eye */}
          <svg viewBox="0 0 260 120" width="min(320px,80vw)" height="auto" style={{ display:"none" }}>
            <defs>
              <clipPath id="restEyeClip">
                <path d="M8,60 Q65,12 130,12 Q195,12 252,60 Q195,108 130,108 Q65,108 8,60 Z"/>
              </clipPath>
              <radialGradient id="restIrisGr" cx="38%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#8ab4f8"/>
                <stop offset="35%" stopColor="#3a78e0"/>
                <stop offset="70%" stopColor="#1a3fa0"/>
                <stop offset="100%" stopColor="#0a1e5c"/>
              </radialGradient>
              <radialGradient id="restScleraGr" cx="30%" cy="28%">
                <stop offset="0%" stopColor="#fffdf0"/>
                <stop offset="100%" stopColor="#ddd5c0"/>
              </radialGradient>
            </defs>

            {/* Skin around eye */}
            <ellipse cx="130" cy="60" rx="135" ry="70" fill="#c49070"/>

            {/* Sclera */}
            <path d="M8,60 Q65,12 130,12 Q195,12 252,60 Q195,108 130,108 Q65,108 8,60 Z" fill="url(#restScleraGr)"/>

            {/* Iris */}
            <circle cx="130" cy="60" r="36" fill="url(#restIrisGr)" clipPath="url(#restEyeClip)"/>
            {/* Iris texture rings */}
            <circle cx="130" cy="60" r="36" fill="none" stroke="#2a60c8" strokeWidth="1" opacity="0.25" clipPath="url(#restEyeClip)"/>
            <circle cx="130" cy="60" r="28" fill="none" stroke="#4a8ae8" strokeWidth="0.6" opacity="0.3" clipPath="url(#restEyeClip)"/>

            {/* Pupil */}
            <circle cx="130" cy="60" r="18" fill="#050516" clipPath="url(#restEyeClip)"/>

            {/* Highlights */}
            <circle cx="143" cy="49" r="7" fill="white" opacity="0.55" clipPath="url(#restEyeClip)"/>
            <circle cx="124" cy="55" r="3.5" fill="white" opacity="0.3" clipPath="url(#restEyeClip)"/>

            {/* Lower eyelid (static) */}
            <path d="M8,60 Q65,108 130,108 Q195,108 252,60 L252,130 L8,130 Z" fill="#c49070"/>
            <path d="M8,60 Q65,108 130,108 Q195,108 252,60" stroke="#9a6040" strokeWidth="1.5" fill="none"/>
            {/* Lower lashes */}
            <g stroke="#3a1808" strokeWidth="1" strokeLinecap="round" opacity="0.6">
              <line x1="48" y1="88" x2="44" y2="100"/>
              <line x1="78" y1="100" x2="76" y2="113"/>
              <line x1="110" y1="106" x2="110" y2="119"/>
              <line x1="130" y1="108" x2="130" y2="121"/>
              <line x1="152" y1="106" x2="152" y2="119"/>
              <line x1="183" y1="100" x2="185" y2="113"/>
              <line x1="212" y1="88" x2="216" y2="100"/>
            </g>

            {/* Upper eyelid — animates to close */}
            <g style={{ animation:"eyelidClose 4s ease-in-out infinite" }}>
              <path d="M8,60 Q65,12 130,12 Q195,12 252,60 L252,-48 L8,-48 Z" fill="#c49070"/>
              <path d="M8,60 Q65,12 130,12 Q195,12 252,60" stroke="#9a6040" strokeWidth="2" fill="none"/>
              {/* Upper lashes */}
              <g stroke="#2a1005" strokeWidth="1.8" strokeLinecap="round">
                <line x1="42" y1="36" x2="34" y2="18"/>
                <line x1="70" y1="22" x2="66" y2="4"/>
                <line x1="100" y1="14" x2="98" y2="-4"/>
                <line x1="130" y1="12" x2="130" y2="-7"/>
                <line x1="160" y1="14" x2="162" y2="-4"/>
                <line x1="190" y1="22" x2="194" y2="4"/>
                <line x1="218" y1="36" x2="226" y2="18"/>
              </g>
            </g>

            {/* Eye outline */}
            <path d="M8,60 Q65,12 130,12 Q195,12 252,60 Q195,108 130,108 Q65,108 8,60 Z" stroke="#7a3e18" strokeWidth="2" fill="none"/>
          </svg>

          {/* Info */}
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", color:qs.rest.type === "short" ? "#67e8f9" : "#fde68a", fontSize:"clamp(1rem,4vw,1.45rem)", letterSpacing:"0.1em", marginBottom:8, textShadow:"0 0 18px rgba(103,232,249,0.32)" }}>
              {qs.rest.type === "short" ? "Riposo Breve" : "Riposo Lungo"}
            </div>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#e0f2fe", fontSize:"2.35rem", fontWeight:900, letterSpacing:"0.04em", lineHeight:1, marginBottom:8, fontVariantNumeric:"tabular-nums", textShadow:"0 0 24px rgba(34,211,238,0.36)" }}>
              {restTimeLeft ? `${restTimeLeft.mm}:${String(restTimeLeft.ss).padStart(2,"0")}` : "..."}
            </div>
            <div style={{ color:"#94a3b8", fontSize:"0.86rem", fontFamily:"'Crimson Pro',Georgia,serif", fontStyle:"italic", maxWidth:360, lineHeight:1.35 }}>
              {qs.rest.type === "short" ? "Una veglia calma protegge il campo. Mezza cura al termine." : "Il sonno cala sul gruppo. Cura completa al termine."}
            </div>
          </div>

          <button onClick={cancelRest} style={{ marginTop:8, padding:"0.62rem 1.55rem", background:"rgba(127,29,29,0.28)", border:"1px solid rgba(248,113,113,0.45)", borderRadius:8, color:"#fecaca", cursor:"pointer", fontSize:"0.8rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.06em", boxShadow:"0 10px 28px rgba(0,0,0,0.28)" }}>
            Interrompi riposo
          </button>
        </div>
      )}

      {/* ── Legendary Item Notification ── */}
      {legNotif && (
        <div onClick={()=>setLegNotif(null)} style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", zIndex:10200, maxWidth:340, width:"90vw", animation:"legNotifIn 0.4s cubic-bezier(.22,1,.36,1)", cursor:"pointer" }}>
          <div style={{ background:"linear-gradient(135deg,rgba(49,10,101,0.97),rgba(17,5,40,0.98))", border:"2px solid #7c3aed", borderRadius:16, padding:"1.1rem 1.3rem", display:"flex", gap:14, alignItems:"center", animation:"legPulse 2s ease-in-out infinite" }}>
            <span style={{ fontSize:"2.6rem", lineHeight:1 }}>{legNotif.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"0.6rem", color:"#a78bfa", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:3 }}>🏆 Il Master ti ha donato</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, color:"#e9d5ff", fontSize:"1rem", lineHeight:1.2 }}>{legNotif.name}</div>
              <div style={{ fontSize:"0.72rem", color:"#7c3aed", marginTop:4 }}>
                {legNotif.type==="weapon"&&`⚔️ ${legNotif.weapon_die} +${legNotif.bonus_atk} ATK`}
                {legNotif.type==="armor"&&`🛡️ +${legNotif.bonus_def} DEF`}
                {legNotif.type==="magic"&&`✨ +${legNotif.bonus_mag} MAG`}
                <span style={{ marginLeft:8 }}>· {legNotif.turnsLeft} turni</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Potion Heal-Target Picker ── */}
      {pendingHealItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:10100, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div style={{ background:"linear-gradient(180deg,#0d1b0d,#0a1628)", border:"2px solid #22c55e", borderRadius:16, padding:"1.5rem 1.8rem", maxWidth:380, width:"100%", boxShadow:"0 0 40px rgba(34,197,94,0.2)" }}>
            <div style={{ fontSize:"1rem", fontWeight:700, color:"#4ade80", marginBottom:"0.5rem", fontFamily:"Cinzel" }}>
              🧪 {pendingHealItem.item?.name}
            </div>
            <div style={{ fontSize:"0.8rem", color:"#94a3b8", marginBottom:"1rem" }}>
              Cura <strong style={{ color:"#4ade80" }}>+{pendingHealItem.item?.heal_amount || 0} HP</strong> — scegli il bersaglio:
            </div>
            <div style={{ display:"grid", gap:8 }}>
              {partyPlayers.filter(p => !p.dead).map(p => {
                const maxHp = p.max_hp || p.maxHp || p.hp || 1;
                const curHp = p.hp || 0;
                const pct = Math.round((curHp / maxHp) * 100);
                const isFull = curHp >= maxHp;
                return (
                  <button key={p.id} onClick={() => !isFull && applyPotion(pendingHealItem, p)}
                    disabled={isFull}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"0.65rem 0.8rem", background:isFull?"rgba(30,30,30,0.4)":"rgba(20,83,45,0.25)", border:`1.5px solid ${isFull?"#374151":"#16a34a"}`, borderRadius:10, cursor:isFull?"not-allowed":"pointer", opacity:isFull?0.5:1, textAlign:"left" }}>
                    <span style={{ fontSize:"1.1rem" }}>{p.avatar || "🧑"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.85rem", fontWeight:700, color:isFull?"#64748b":"#e2e8f0" }}>{p.name}</div>
                      <div style={{ fontSize:"0.72rem", color:isFull?"#4b5563":"#86efac" }}>
                        {curHp}/{maxHp} HP ({pct}%){isFull ? " — già pieno" : ""}
                      </div>
                    </div>
                    {!isFull && <span style={{ fontSize:"0.75rem", color:"#4ade80", fontWeight:700 }}>+{pendingHealItem.item?.heal_amount || 0}</span>}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setPendingHealItem(null)}
              style={{ marginTop:"1rem", width:"100%", padding:"0.55rem", background:"rgba(239,68,68,0.15)", border:"1px solid #7f1d1d", borderRadius:8, color:"#f87171", cursor:"pointer", fontFamily:"inherit", fontSize:"0.82rem" }}>
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* ── Victory Screen Overlay ── shown to all combat participants via shared DB state */}
      {showVictory && (() => {
        const vd = currentVictoryData;
        const dismiss = () => setDismissedVictoryTs(vd.ts);
        const myResult = vd.playerResults?.find(r => r.id === myId);
        const xpBefore = myResult?.beforeXp ?? 0;
        const xpAfter  = myResult?.afterXp  ?? 0;
        const lvBefore = myResult?.beforeLevel ?? 1;
        const lvAfter  = myResult?.afterLevel  ?? lvBefore;
        const barPct      = Math.min(100, Math.round((xpBefore / xpForLevel(lvBefore)) * 100));
        const barPctAfter = Math.min(100, Math.round((xpAfter  / xpForLevel(lvAfter))  * 100));
        const leveledUp = xpAfter >= xpForLevel(lvBefore) && lvAfter > lvBefore;
        // Build per-player row: merge playerResults with combatDmgLog
        const dmgLog = vd.combatDmgLog || {};
        const playerRows = (vd.playerResults || []).map(r => ({
          ...r,
          dmg: dmgLog[r.id]?.dmg || 0,
          isMe: r.id === myId,
        })).sort((a,b) => b.dmg - a.dmg);
        const maxDmg = Math.max(...playerRows.map(r => r.dmg), 1);
        return (
          <div
            onClick={dismiss}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:10050, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", cursor:"pointer" }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background:"linear-gradient(180deg,#0d1b0d,#0a1628)", border:"2px solid #fbbf24", borderRadius:18, padding:"1.6rem 1.8rem", maxWidth:500, width:"100%", boxShadow:"0 0 60px rgba(251,191,36,0.25), 0 24px 48px rgba(0,0,0,0.6)", textAlign:"center", maxHeight:"90vh", overflowY:"auto", cursor:"default" }}
            >
              {/* Header */}
              <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.5rem,5vw,2.2rem)", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.08em", marginBottom:"0.2rem" }}>⚔ VITTORIA! ⚔</div>
              <div style={{ color:"#86efac", fontSize:"0.78rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.15em", marginBottom:"1.2rem" }}>BATTAGLIA VINTA — tocca fuori o clicca Continua</div>

              {/* Slain monsters */}
              {vd.slain?.length > 0 && (
                <div style={{ background:"rgba(0,0,0,0.35)", border:"1px solid rgba(127,29,29,0.4)", borderRadius:10, padding:"0.75rem 1rem", marginBottom:"1rem", textAlign:"left" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#f87171", fontSize:"0.68rem", letterSpacing:"0.12em", marginBottom:"0.5rem" }}>NEMICI SCONFITTI</div>
                  {vd.slain.map((m, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", color:"#fecaca", fontSize:"0.82rem", padding:"2px 0" }}>
                      <span>{m.emoji} {m.name}</span>
                      <span style={{ color:"#94a3b8", fontSize:"0.75rem" }}>+{m.xp} XP · +{m.gold} oro</span>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid rgba(127,29,29,0.3)", marginTop:8, paddingTop:8, display:"flex", justifyContent:"space-between", fontSize:"0.8rem" }}>
                    <span style={{ color:"#f87171", fontWeight:600 }}>Totale bottino</span>
                    <span style={{ color:"#fbbf24", fontWeight:700 }}>+{vd.totalXp} XP · +{vd.totalGold} oro</span>
                  </div>
                </div>
              )}

              {/* Reward per combatant — big and clear */}
              <div style={{ background:"rgba(20,83,45,0.2)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:10, padding:"0.85rem 1rem", marginBottom:"1rem", textAlign:"left" }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#86efac", fontSize:"0.68rem", letterSpacing:"0.12em", marginBottom:"0.7rem" }}>RICOMPENSE A TESTA</div>
                <div style={{ display:"flex", gap:16, justifyContent:"center", marginBottom:playerRows.length > 1 ? 12 : 0 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"1.8rem" }}>⭐</div>
                    <div style={{ color:"#c4b5fd", fontSize:"0.68rem", fontFamily:"'Cinzel',serif" }}>XP</div>
                    <div style={{ color:"#e9d5ff", fontSize:"1.5rem", fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>+{vd.xpEach}</div>
                  </div>
                  <div style={{ width:1, background:"rgba(255,255,255,0.08)" }} />
                  <div style={{ textAlign:"center" }}>m
                    <div style={{ fontSize:"1.8rem" }}>💰</div>
                    <div style={{ color:"#fcd34d", fontSize:"0.68rem", fontFamily:"'Cinzel',serif" }}>ORO</div>
                    <div style={{ color:"#fde68a", fontSize:"1.5rem", fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>+{vd.goldEach}</div>
                  </div>
                </div>
                {/* Per-player rows with damage */}
                {playerRows.length > 0 && (
                  <div style={{ borderTop:"1px solid rgba(34,197,94,0.2)", paddingTop:10 }}>
                    <div style={{ fontSize:"0.65rem", color:"#64748b", letterSpacing:"0.07em", marginBottom:6 }}>DANNI INFLITTI IN BATTAGLIA</div>
                    {playerRows.map((r, ri) => (
                      <div key={r.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, padding:"4px 6px", background: r.isMe ? "rgba(251,191,36,0.08)" : "transparent", borderRadius:6, border: r.isMe ? "1px solid rgba(251,191,36,0.2)" : "1px solid transparent" }}>
                        <span style={{ fontSize:"0.88rem", minWidth:20, textAlign:"center" }}>{ri===0?"🥇":ri===1?"🥈":ri===2?"🥉":"•"}</span>
                        <span style={{ flex:1, fontSize:"0.8rem", color: r.isMe ? "#fbbf24" : "#e2e8f0", fontWeight: r.isMe ? 700 : 400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {r.name}{r.isMe ? " (tu)" : ""}
                        </span>
                        <span style={{ fontSize:"0.78rem", color:"#ef4444", fontWeight:700, minWidth:52, textAlign:"right" }}>{r.dmg > 0 ? `${r.dmg} dmg` : "—"}</span>
                        <div style={{ width:48, height:5, background:"rgba(30,41,59,0.8)", borderRadius:3, overflow:"hidden", flexShrink:0 }}>
                          <div style={{ height:"100%", background:"linear-gradient(90deg,#ef4444,#f97316)", width: r.dmg > 0 ? `${Math.round(r.dmg/maxDmg*100)}%` : "0%", transition:"width 0.5s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Personal XP bar */}
              {myResult && (
                <div style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(148,163,184,0.15)", borderRadius:10, padding:"0.85rem 1rem", marginBottom:"1rem", textAlign:"left" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", color:"#cbd5e1", marginBottom:5 }}>
                    <span style={{ fontFamily:"'Cinzel',serif", color:"#94a3b8", fontSize:"0.68rem", letterSpacing:"0.1em" }}>IL TUO AVANZAMENTO</span>
                    <span style={{ color:"#fbbf24" }}>Lv.{lvBefore} → Lv.{lvAfter}</span>
                  </div>
                  <div style={{ fontSize:"0.72rem", color:"#94a3b8", marginBottom:6, textAlign:"right" }}>{xpBefore} → {xpAfter} / {xpForLevel(lvAfter)} XP</div>
                  <div style={{ position:"relative", height:12, background:"rgba(255,255,255,0.07)", borderRadius:999, overflow:"hidden" }}>
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${barPct}%`, background:"rgba(148,163,184,0.3)", borderRadius:999 }} />
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${barPctAfter}%`, background:"linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)", borderRadius:999, boxShadow:"0 0 8px rgba(168,85,247,0.5)", transition:"width 0.8s ease 0.2s" }} />
                  </div>
                  {leveledUp && (
                    <div style={{ marginTop:"0.6rem", padding:"0.45rem 0.75rem", background:"linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.1))", border:"1px solid #fbbf24", borderRadius:8, color:"#fde68a", fontFamily:"'Cinzel Decorative',serif", fontSize:"0.88rem", textAlign:"center" }}>
                      ⬆️ LIVELLO {lvAfter}! Sei più forte.
                    </div>
                  )}
                </div>
              )}

              <button onClick={dismiss} style={{ width:"100%", padding:"0.9rem 1.4rem", background:"linear-gradient(135deg,#14532d,#16a34a)", border:"2px solid #22c55e", borderRadius:12, color:"#dcfce7", fontFamily:"'Cinzel Decorative',serif", fontSize:"1rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 8px 20px rgba(34,197,94,0.2)" }}>
                Continua →
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Achievement Notification Overlay ── */}
      {achievementNotif.length > 0 && (() => {
        const TIER_COLORS = { 1:"#94a3b8", 2:"#22c55e", 3:"#a855f7", 4:"#fbbf24" };
        const TIER_LABELS = { 1:"Comune", 2:"Non comune", 3:"Raro", 4:"Leggendario" };
        return (
          <div
            onClick={() => setAchievementNotif([])}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:10100, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", cursor:"pointer" }}
          >
            <div onClick={e => e.stopPropagation()} style={{ background:"linear-gradient(180deg,#0d1b0d,#0a1628)", border:"2px solid #fbbf24", borderRadius:18, padding:"1.6rem 1.8rem", maxWidth:380, width:"100%", textAlign:"center", boxShadow:"0 0 60px rgba(251,191,36,0.3)" }}>
              <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"1.2rem", color:"#fbbf24", marginBottom:"0.4rem" }}>🏆 ACHIEVEMENT SBLOCCATO!</div>
              {achievementNotif.map(a => (
                <div key={a.id} style={{ margin:"0.8rem 0", padding:"0.9rem 1rem", background:"rgba(0,0,0,0.4)", border:`2px solid ${TIER_COLORS[a.tier] || "#94a3b8"}`, borderRadius:12 }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:"0.3rem" }}>{a.icon}</div>
                  <div style={{ fontFamily:"'Cinzel',serif", color: TIER_COLORS[a.tier] || "#e2e8f0", fontSize:"1rem", fontWeight:700 }}>{a.title}</div>
                  <div style={{ fontSize:"0.72rem", color:"#94a3b8", marginTop:"0.2rem" }}>{a.desc}</div>
                  <div style={{ fontSize:"0.63rem", color: TIER_COLORS[a.tier] || "#64748b", marginTop:"0.3rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.08em" }}>{TIER_LABELS[a.tier] || ""}</div>
                </div>
              ))}
              <button onClick={() => setAchievementNotif([])} style={{ marginTop:"0.6rem", width:"100%", padding:"0.7rem", background:"linear-gradient(135deg,#92400e,#d97706)", border:"2px solid #fbbf24", borderRadius:10, color:"#fff7ed", fontFamily:"'Cinzel Decorative',serif", fontSize:"0.9rem", cursor:"pointer" }}>
                Fantastico!
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Subclass selection modal ── */}
      {showSubclassModal && me && (
        <div style={{ position:"fixed", inset:0, zIndex:12000, background:"rgba(0,0,0,0.88)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div style={{ background:"linear-gradient(180deg,rgba(10,10,30,0.99),rgba(3,7,18,0.99))", border:"2px solid #7c3aed", borderRadius:16, padding:"1.8rem", maxWidth:480, width:"100%", boxShadow:"0 24px 60px rgba(109,40,217,0.35)" }}>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#c4b5fd", fontSize:"1.2rem", marginBottom:6, textAlign:"center" }}>🌟 Scegli la tua Sottoclasse</div>
            <div style={{ color:"#94a3b8", fontSize:"0.82rem", textAlign:"center", marginBottom:"1.4rem" }}>Hai raggiunto il livello 6. Questa scelta è permanente.</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {getSubclassOptions(me.class).map(s => (
                <button key={s.id} onClick={() => selectSubclass(s.id)} style={{ padding:"1rem 1.2rem", background:"rgba(109,40,217,0.15)", border:"1px solid #6d28d9", borderRadius:10, color:"#e2e8f0", cursor:"pointer", textAlign:"left", display:"flex", gap:12, alignItems:"center", fontFamily:"inherit" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(109,40,217,0.35)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(109,40,217,0.15)"}>
                  <span style={{ fontSize:"2rem" }}>{s.emoji}</span>
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, color:"#c4b5fd", marginBottom:2 }}>{s.name}</div>
                    <div style={{ fontSize:"0.78rem", color:"#94a3b8" }}>{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------
   COMPONENTS
---------------------------------------------- */
function HpBar({ cur, max, red }) {
  const pct = Math.min(100, Math.max(0, (cur||0)/(max||1)*100));
  const isLow = pct <= 30;
  const isMid = pct > 30 && pct <= 60;
  const color = red
    ? (isLow ? "#b91c1c" : isMid ? "#dc2626" : "#ef4444")
    : (isLow ? "#ef4444" : isMid ? "#f59e0b" : "#22c55e");
  const glow = red
    ? (isLow ? "rgba(185,28,28,0.55)" : "rgba(239,68,68,0.3)")
    : (isLow ? "rgba(239,68,68,0.55)" : isMid ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.35)");
  const grad = red
    ? `linear-gradient(90deg, ${color}cc, ${color})`
    : `linear-gradient(90deg, ${color}bb, ${color}, ${color}dd)`;
  return (
    <div style={{ height:7, background:"rgba(0,0,0,0.5)", borderRadius:4, overflow:"visible", position:"relative" }}>
      <div style={{
        height:"100%", borderRadius:4,
        background: grad,
        width:`${pct}%`,
        transition:"width 0.55s cubic-bezier(0.34,1.2,0.64,1), background 0.6s ease",
        boxShadow: pct > 0 ? `0 0 8px 1px ${glow}` : "none",
        position:"relative", overflow:"hidden",
      }}>
        {/* shine sweep */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.18) 50%,transparent 100%)", borderRadius:4 }} />
      </div>
      {isLow && pct > 0 && (
        <div style={{ position:"absolute", inset:0, borderRadius:4, boxShadow:`0 0 10px 2px ${glow}`, animation:"hpGlow 1.2s ease-in-out infinite", pointerEvents:"none" }} />
      )}
    </div>
  );
}
function MusicToggleBtn() {
  const [on, setOn] = useState(() => audioManager.musicEnabled);
  const toggle = () => {
    const next = !on;
    audioManager.toggleMusic(next);
    setOn(next);
  };
  return (
    <button onClick={toggle} title={on ? "Clicca per silenziare la musica" : "Clicca per riattivare la musica"}
      style={{ marginTop:4, width:"100%", padding:"0.3rem 0.4rem", background: on ? "rgba(109,40,217,0.12)" : "rgba(75,85,99,0.15)", border:`1px solid ${on ? "#4c1d95" : "#374151"}`, borderRadius:4, color: on ? "#c4b5fd" : "#6b7280", fontSize:"0.62rem", cursor:"pointer", letterSpacing:"0.06em", textAlign:"center" }}>
      {on ? "🎵 Musica ON" : "🔇 Musica OFF"}
    </button>
  );
}

function BigBtn({ children, onClick, gold, dark, icon, disabled }) {
  const base = { padding:"0.6rem 1.2rem", borderRadius:5, cursor:disabled?"not-allowed":"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", letterSpacing:"0.06em", border:"none", opacity:disabled?0.45:1, display:"inline-flex", alignItems:"center", gap:6, fontWeight:700, textShadow:"0 1px 2px rgba(0,0,0,0.75)", boxShadow:"0 8px 20px rgba(0,0,0,0.24)" };
  if(gold) return <button onClick={onClick} disabled={disabled} style={{...base,background:"linear-gradient(135deg,#92400e,#d97706)",color:"#fff7ed",border:"1px solid #fbbf24"}}>{icon&&<span>{icon}</span>}{children}</button>;
  if(dark) return <button onClick={onClick} disabled={disabled} style={{...base,background:"#111827",color:"#f8fafc",border:"1px solid #64748b"}}>{icon&&<span>{icon}</span>}{children}</button>;
  return <button onClick={onClick} disabled={disabled} style={{...base,background:"#4c1d95",color:"#ffffff",border:"1px solid #a78bfa"}}>{icon&&<span>{icon}</span>}{children}</button>;
}
function JoinPartyWidget({ myId, currentCode }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const join = async () => {
    const code = input.trim().toUpperCase();
    if(!code || code === currentCode) return;
    setBusy(true);
    try {
      await dbSavePartyState(code, { currentId:null, step:0, active:false, completed:[], combat:null });
      await supabase.from("players").update({ party_code: code, updated_at: new Date().toISOString() }).eq("id", myId);
      setDone(true);
    } catch(e) {
      alert("Errore: " + (e?.message || e));
    } finally { setBusy(false); }
  };

  if(done) return (
    <div style={{ marginTop:8, padding:"6px 8px", background:"rgba(34,197,94,0.08)", border:"1px solid #166534", borderRadius:6, fontSize:"0.7rem", color:"#4ade80" }}>
      Party cambiato! Ricarica la pagina per entrare.
      <button onClick={()=>window.location.reload()} style={{ marginLeft:8, background:"#166534", border:"none", color:"#bbf7d0", padding:"2px 8px", borderRadius:4, cursor:"pointer", fontSize:"0.7rem" }}>Ricarica</button>
    </div>
  );

  return (
    <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:5 }}>
      <input
        value={input}
        onChange={e=>setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8))}
        placeholder="Codice party..."
        style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.3)", border:"1px solid #1f2937", color:"#e2d9c5", padding:"5px 7px", borderRadius:4, fontSize:"0.7rem", fontFamily:"monospace", letterSpacing:"0.1em" }}
      />
      <button disabled={busy || !input.trim()} onClick={join}
        style={{ width:"100%", background:"rgba(99,102,241,0.2)", border:"1px solid #4338ca", color:"#a5b4fc", padding:"5px 0", borderRadius:4, cursor: busy || !input.trim() ? "not-allowed" : "pointer", fontSize:"0.72rem", opacity: !input.trim() ? 0.5 : 1 }}>
        {busy ? "Caricamento…" : "Entra nel Party →"}
      </button>
    </div>
  );
}

function SmallBtn({ children, onClick, red, disabled }) {
  return <button disabled={disabled} onClick={onClick} style={{ padding:"0.42rem 0.78rem", background:red?"#7f1d1d":"#1e293b", border:`1px solid ${red?"#fca5a5":"#94a3b8"}`, borderRadius:4, color:red?"#fff1f2":"#f8fafc", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, fontSize:"0.78rem", fontFamily:"inherit", fontWeight:700, boxShadow:"0 6px 14px rgba(0,0,0,0.22)", textShadow:"0 1px 2px rgba(0,0,0,0.75)" }}>{children}</button>;
}
function Card({ title, children }) {
  return (
    <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:6, padding:"1rem", marginBottom:"0.8rem", boxShadow:"0 12px 28px rgba(0,0,0,0.22)" }}>
      {title && <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontSize:"0.9rem", marginBottom:"0.8rem" }}>{title}</div>}
      {children}
    </div>
  );
}

const inputStyle = { width:"100%", padding:"0.55rem 0.75rem", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:4, color:"#e2d9c5", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.92rem", display:"block" };
const labelStyle = { display:"block", color:"#64748b", fontSize:"0.63rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontFamily:"'Cinzel',serif" };
const backBtnStyle = { padding:"0.35rem 0.8rem", background:"transparent", border:"1px solid #1f2937", borderRadius:4, color:"#94a3b8", cursor:"pointer", fontFamily:"inherit", fontSize:"0.8rem" };
const iconBtnStyle = { padding:"2px 6px", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:3, color:"#94a3b8", cursor:"pointer", fontSize:"0.8rem" };
