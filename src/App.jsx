import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";

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
    @keyframes goldenGlow { 0%,100%{text-shadow:0 0 20px rgba(251,191,36,.5)} 50%{text-shadow:0 0 50px rgba(251,191,36,.9),0 0 100px rgba(245,158,11,.4)} }
    @keyframes diceRoll { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.3)} 100%{transform:rotate(360deg) scale(1)} }
    @keyframes sparkle { 0%{opacity:1;transform:translateY(0) scale(0.8)} 100%{opacity:0;transform:translateY(-120px) scale(1.4)} }
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
    * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Crect x='15' y='2' width='3' height='20' fill='%23c0c0c0' rx='1'/%3E%3Crect x='14' y='20' width='5' height='3' fill='%23b8860b'/%3E%3Crect x='9' y='18' width='15' height='2' fill='%23b8860b' rx='1'/%3E%3Crect x='14' y='23' width='5' height='7' fill='%23b8860b' rx='1'/%3E%3Crect x='15' y='1' width='3' height='4' fill='%23ffd700' rx='1'/%3E%3C/g%3E%3C/svg%3E") 4 4, auto !important; }
    button { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Crect x='15' y='2' width='3' height='20' fill='%23ffd700' rx='1'/%3E%3Crect x='14' y='20' width='5' height='3' fill='%23ff8c00'/%3E%3Crect x='9' y='18' width='15' height='2' fill='%23ff8c00' rx='1'/%3E%3Crect x='14' y='23' width='5' height='7' fill='%23ff8c00' rx='1'/%3E%3Crect x='15' y='1' width='3' height='4' fill='%23fff' rx='1'/%3E%3C/g%3E%3C/svg%3E") 4 4, pointer !important; }
  `;
  document.head.appendChild(style);
})();

/* ----------------------------------------------
   CONSTANTS
---------------------------------------------- */
// emoji: usa testo se gli unicode non funzionano
const CLASSES = {
  barbarian:{ name:"Barbaro",   emoji:"🪓", color:"#dc2626", hp:140, atk:17, def:8,  mag:0,  init:2, desc:"Furia incontrollabile, resistenza brutale" },
  bard:     { name:"Bardo",     emoji:"🎵", color:"#f97316", hp:78,  atk:9,  def:5,  mag:13, init:3, desc:"Magia attraverso musica e parole" },
  cleric:   { name:"Chierico",  emoji:"⛪", color:"#f59e0b", hp:95,  atk:7,  def:9,  mag:15, init:1, desc:"Potere divino e guarigione sacra" },
  druid:    { name:"Druido",    emoji:"🌿", color:"#84cc16", hp:80,  atk:8,  def:7,  mag:14, init:2, desc:"Magia naturale e trasformazione" },
  warrior:  { name:"Guerriero", emoji:"⚔️", color:"#ef4444", hp:120, atk:15, def:11, mag:1,  init:2, desc:"Maestro delle armi e del combattimento" },
  monk:     { name:"Monaco",    emoji:"🥋", color:"#06b6d4", hp:88,  atk:13, def:10, mag:4,  init:5, desc:"Arti marziali e disciplina del ki" },
  paladin:  { name:"Paladino",  emoji:"🛡️", color:"#facc15", hp:110, atk:12, def:13, mag:8,  init:1, desc:"Guerriero sacro, paladino della giustizia" },
  ranger:   { name:"Ranger",    emoji:"🏹", color:"#14b8a6", hp:90,  atk:13, def:7,  mag:6,  init:3, desc:"Esploratore e cacciatore di mostri" },
  rogue:    { name:"Ladro",     emoji:"🗡️", color:"#22c55e", hp:82,  atk:14, def:6,  mag:4,  init:5, desc:"Furtività, trappole e attacchi subdoli" },
  sorcerer: { name:"Stregone",  emoji:"🪄", color:"#8b5cf6", hp:68,  atk:6,  def:3,  mag:22, init:2, desc:"Magia innata nel sangue" },
  warlock:  { name:"Warlock",   emoji:"🔮", color:"#7c3aed", hp:72,  atk:8,  def:4,  mag:20, init:2, desc:"Patti con entità oscure e potere proibito" },
  mage:     { name:"Mago",      emoji:"🧙‍♂️", color:"#a855f7", hp:65,  atk:5,  def:3,  mag:24, init:2, desc:"Studio arcano e incantesimi devastanti" },
};
// emoji: usa testo se gli unicode non funzionano
const RACES = {
  human:     { name:"Umano",     emoji:"👤", hpB:5,  atkB:1, defB:1, magB:1, initB:1, desc:"Versatili e ambiziosi, eccellono in tutto" },
  dwarf:     { name:"Nano",      emoji:"🧔", hpB:25, atkB:1, defB:5, magB:0, initB:-1,desc:"Resistenti come la roccia, esperti artigiani" },
  elf:       { name:"Elfo",      emoji:"🧝", hpB:0,  atkB:1, defB:1, magB:3, initB:2, desc:"Agili e magici, percezione soprannaturale" },
  halfling:  { name:"Halfling",  emoji:"🧒", hpB:0,  atkB:0, defB:2, magB:0, initB:4, desc:"Fortunati e furtivi, sempre positivi" },
  dragonborn:{ name:"Dragonide", emoji:"🐉", hpB:10, atkB:3, defB:2, magB:2, initB:0, desc:"Discendenti dei draghi, soffio draconico" },
  gnome:     { name:"Gnomo",     emoji:"🧙‍♂️", hpB:0,  atkB:0, defB:1, magB:6, initB:2, desc:"Ingegnosi e curiosi, magia illusoria naturale" },
  halfelf:   { name:"Mezzelfo",  emoji:"🧝‍♂️", hpB:0,  atkB:2, defB:1, magB:2, initB:2, desc:"Il meglio di due mondi, carismatici" },
  halforc:   { name:"Mezzorco",  emoji:"👹", hpB:15, atkB:5, defB:1, magB:0, initB:1, desc:"Forza bruta e resistenza feroce" },
  tiefling:  { name:"Tiefling",  emoji:"👿", hpB:0,  atkB:0, defB:1, magB:5, initB:1, desc:"Sangue infernale, resistenza al fuoco" },
};
const DIFF_COLOR = { facile:"#22c55e", difficile:"#f97316", speciale:"#a855f7" };
function normalizeMissionDifficulty(value) {
  const key = String(value || "").trim().toLowerCase();
  if(key === "facile") return "facile";
  if(key === "speciale" || key === "molto difficile" || key === "leggendario") return "speciale";
  return "difficile";
}
function missionDifficultyLabel(value) {
  return ({
    facile: "Facile",
    difficile: "Difficile",
    speciale: "Speciale",
  })[normalizeMissionDifficulty(value)];
}
const BACKGROUND_URL = "https://fv5-4.files.fm/thumb_show.php?i=qdtav95gc2&view&v=1&PHPSESSID=964a794e4d1fe9b3c7e7e8a4950eb15086c6dfc9";
const MASTER_PASSWORD = "ByBy101112!";
function debugCharacterFlow(step, payload) {
  console.log(`[CHAR_FLOW] ${step}`, payload ?? "");
}
const MASTER_EMAILS = (import.meta.env.VITE_MASTER_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);
const PANEL_BG = "rgba(7,10,20,0.82)";
const PANEL_BG_SOFT = "rgba(7,10,20,0.72)";
const PANEL_BORDER = "rgba(148,163,184,0.16)";

function xpForLevel(l){ return Math.floor(100*Math.pow(1.5,l-1)); }
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
function canAccessMasterPanel(user) {
  const email = user?.email?.trim().toLowerCase();
  return !!email && MASTER_EMAILS.includes(email);
}

const MAGIC_CLASSES = ['mage','sorcerer','cleric','druid','bard','warlock','paladin','ranger'];

const SPELL_SLOTS = {
  1:{1:2,2:0,3:0,4:0,5:0}, 2:{1:3,2:0,3:0,4:0,5:0}, 3:{1:4,2:2,3:0,4:0,5:0},
  4:{1:4,2:3,3:0,4:0,5:0}, 5:{1:4,2:3,3:2,4:0,5:0}, 6:{1:4,2:3,3:3,4:0,5:0},
  7:{1:4,2:3,3:3,4:1,5:0}, 8:{1:4,2:3,3:3,4:2,5:0}, 9:{1:4,2:3,3:3,4:3,5:1},
  10:{1:4,2:3,3:3,4:3,5:2}
};

const SPELLS = {
  mage:{
    0:[
      {id:"mg01",name:"Scintilla Arcana",emoji:"✨",dmg:"1d6",type:"damage",slots:0,desc:"Dardo minore di energia pura, gratuito ogni turno"},
      {id:"mg02",name:"Raggio di Brina",emoji:"❄️",dmg:"1d8",type:"damage",slots:0,desc:"Un gelo rapido che ferisce senza consumare slot"},
      {id:"mg03",name:"Mano Folgorante",emoji:"⚡",dmg:"1d6",type:"damage",slots:0,desc:"Scarica breve e precisa, perfetta come trucchetto base"},
    ],
    1:[
      {id:"mg11",name:"Dardo Incantato",emoji:"✨",dmg:"3d4+3",type:"damage",slots:1,desc:"3 dardi magici infallibili che non mancano mai"},
      {id:"mg12",name:"Mano Bruciante",emoji:"🔥",dmg:"3d6",type:"damage",slots:1,desc:"Cono di fiamme che brucia i nemici vicini"},
      {id:"mg13",name:"Raggio di Gelo",emoji:"❄️",dmg:"1d8",type:"damage",slots:1,desc:"Raggio gelato che rallenta il nemico (-2 DEF)"},
      {id:"mg14",name:"Sonno",emoji:"💤",dmg:"0",type:"control",slots:1,desc:"Addormenta nemici con meno di 30 HP"},
      {id:"mg15",name:"Scudo Arcano",emoji:"🔵",dmg:"0",type:"defense",slots:1,desc:"+5 DEF fino al prossimo turno"},
      {id:"mg16",name:"Dardo Acido",emoji:"💚",dmg:"2d4",type:"damage",slots:1,desc:"Acido che corrode l'armatura (-1 DEF permanente)"},
    ],
    2:[
      {id:"mg21",name:"Freccia Acida",emoji:"🟢",dmg:"4d4",type:"damage",slots:2,desc:"Acido che continua a bruciare per 2 round"},
      {id:"mg22",name:"Invisibilità",emoji:"👻",dmg:"0",type:"utility",slots:2,desc:"Diventi invisibile per 1 round, prossimo attacco automatico"},
      {id:"mg23",name:"Nebbia Velenosa",emoji:"☠️",dmg:"2d6",type:"damage",slots:2,desc:"Nuvola tossica che avvelena i nemici nell'area"},
      {id:"mg24",name:"Ragnatela",emoji:"🕸️",dmg:"0",type:"control",slots:2,desc:"Intrappola il nemico, salta il suo prossimo turno"},
      {id:"mg25",name:"Suggestione",emoji:"💜",dmg:"0",type:"control",slots:2,desc:"Il nemico più debole salta il turno per confusione"},
    ],
    3:[
      {id:"mg31",name:"Palla di Fuoco",emoji:"💥",dmg:"8d6",type:"damage",slots:3,desc:"Esplosione devastante che colpisce tutti i nemici"},
      {id:"mg32",name:"Fulmine",emoji:"⚡",dmg:"8d6",type:"damage",slots:3,desc:"Raggio di fulmine che attraversa tutti i nemici in fila"},
      {id:"mg33",name:"Volo",emoji:"🦅",dmg:"0",type:"utility",slots:3,desc:"+4 ATK e schivi il prossimo attacco nemico"},
      {id:"mg34",name:"Controincantesimo",emoji:"🚫",dmg:"0",type:"defense",slots:3,desc:"Annulla l'attacco nemico più forte di questo round"},
      {id:"mg35",name:"Rallentamento",emoji:"🐢",dmg:"0",type:"control",slots:3,desc:"Tutti i nemici attaccano con -4 ATK per 2 round"},
    ],
    4:[
      {id:"mg41",name:"Muro di Fuoco",emoji:"🌋",dmg:"5d8",type:"damage",slots:4,desc:"Barriera infuocata che brucia chiunque la attraversi"},
      {id:"mg42",name:"Porta Dimensionale",emoji:"🌀",dmg:"0",type:"utility",slots:4,desc:"Teletrasporto istantaneo, schivi tutti gli attacchi questo round"},
      {id:"mg43",name:"Polimorfismo",emoji:"🐸",dmg:"0",type:"control",slots:4,desc:"Trasforma il nemico più forte in una bestia innocua per 1 round"},
      {id:"mg44",name:"Nebbia Arcana",emoji:"🌫️",dmg:"4d6",type:"damage",slots:4,desc:"Energia arcana che brucia e disorienta i nemici"},
    ],
    5:[
      {id:"mg51",name:"Cono di Freddo",emoji:"🌨️",dmg:"8d8",type:"damage",slots:5,desc:"Blast glaciale che congela tutti i nemici"},
      {id:"mg52",name:"Disintegrazione",emoji:"💀",dmg:"10d6+40",type:"damage",slots:5,desc:"Raggio che dissolve il nemico nell'etere"},
      {id:"mg53",name:"Telecinesi",emoji:"🔮",dmg:"5d10",type:"damage",slots:5,desc:"Scaglia oggetti enormi contro i nemici"},
      {id:"mg54",name:"Nube Mortale",emoji:"☁️",dmg:"7d8",type:"damage",slots:5,desc:"Nube di gas letale che riempie il campo di battaglia"},
    ],
  },
  sorcerer:{
    1:[
      {id:"so11",name:"Fuoco delle Fate",emoji:"🔥",dmg:"1d10",type:"damage",slots:1,desc:"Fiamma colorata che rivela creature invisibili"},
      {id:"so12",name:"Onda Tonante",emoji:"💨",dmg:"2d8",type:"damage",slots:1,desc:"Onda di forza che spinge indietro i nemici"},
      {id:"so13",name:"Cromosfera",emoji:"🌈",dmg:"3d6",type:"damage",slots:1,desc:"Sfere di energia cromatica multicolore"},
      {id:"so14",name:"Scudo",emoji:"🛡️",dmg:"0",type:"defense",slots:1,desc:"+5 DEF fino al tuo prossimo turno"},
      {id:"so15",name:"Raggio di Gelo",emoji:"❄️",dmg:"1d8",type:"damage",slots:1,desc:"Raggio gelido che riduce l'iniziativa del nemico"},
      {id:"so16",name:"Taumaturgia",emoji:"✨",dmg:"1d6",type:"damage",slots:0,desc:"Magia innata gratuita, danno minimo garantito"},
    ],
    2:[
      {id:"so21",name:"Freccia di Acido",emoji:"💚",dmg:"4d4",type:"damage",slots:2,desc:"Proiettile acido che corrode l'armatura nemica"},
      {id:"so22",name:"Disfatta",emoji:"💜",dmg:"3d6",type:"damage",slots:2,desc:"Energia viola che indebolisce il nemico (-3 ATK)"},
      {id:"so23",name:"Metamagia",emoji:"⚡",dmg:"0",type:"utility",slots:2,desc:"Potenzia la prossima spell: danno doppio"},
      {id:"so24",name:"Oscurità",emoji:"🌑",dmg:"0",type:"control",slots:2,desc:"Sfera di buio totale, i nemici attaccano con -4"},
    ],
    3:[
      {id:"so31",name:"Palla di Fuoco",emoji:"💥",dmg:"8d6",type:"damage",slots:3,desc:"Esplosione classica che colpisce tutti i nemici"},
      {id:"so32",name:"Volo",emoji:"🦅",dmg:"0",type:"utility",slots:3,desc:"+5 ATK per questo round, schivi un attacco"},
      {id:"so33",name:"Impulso del Caos",emoji:"🎲",dmg:"6d10",type:"damage",slots:3,desc:"Energia caotica imprevedibile — danno random ma potente"},
      {id:"so34",name:"Passaparola",emoji:"🌀",dmg:"0",type:"control",slots:3,desc:"Confonde i nemici, li fa attaccare tra loro"},
    ],
    4:[
      {id:"so41",name:"Forma Elementale",emoji:"🌊",dmg:"5d8",type:"damage",slots:4,desc:"Ti trasformi in elementale, attacchi multipli"},
      {id:"so42",name:"Onda di Fuoco",emoji:"🌊🔥",dmg:"7d8",type:"damage",slots:4,desc:"Onda di fuoco che travolge tutti i nemici"},
      {id:"so43",name:"Maggior Invisib.",emoji:"👻",dmg:"0",type:"utility",slots:4,desc:"Invisibilità totale, attacchi garantiti per 2 round"},
    ],
    5:[
      {id:"so51",name:"Cono di Freddo",emoji:"🌨️",dmg:"8d8",type:"damage",slots:5,desc:"Blast di gelo devastante su tutti i nemici"},
      {id:"so52",name:"Tempesta di Fuoco",emoji:"☄️",dmg:"7d10",type:"damage",slots:5,desc:"Pioggia di palle di fuoco sull'intero campo"},
      {id:"so53",name:"Forma Divina",emoji:"👑",dmg:"0",type:"utility",slots:5,desc:"Poteri sovrumani: +10 ATK e immunità ai danni questo round"},
    ],
  },
  cleric:{
    1:[
      {id:"cl11",name:"Cura Ferite",emoji:"💚",dmg:"-2d8",type:"heal",slots:1,desc:"Cura 2d8+3 HP a te o a un alleato"},
      {id:"cl12",name:"Parola Sacra",emoji:"✨",dmg:"2d6",type:"damage",slots:1,desc:"Parola divina che brucia i non-morti (+50% danni)"},
      {id:"cl13",name:"Luce Sacra",emoji:"☀️",dmg:"1d8",type:"damage",slots:1,desc:"Raggio di luce divina che acceca temporaneamente"},
      {id:"cl14",name:"Benedizione",emoji:"🙏",dmg:"0",type:"buff",slots:1,desc:"+3 ATK e +3 DEF a tutto il party per 1 round"},
      {id:"cl15",name:"Punizione Divina",emoji:"⚡",dmg:"2d10",type:"damage",slots:1,desc:"Fulmine sacro che brucia creature malvagie"},
      {id:"cl16",name:"Scaccia Non-Morti",emoji:"💀",dmg:"3d6",type:"damage",slots:1,desc:"Terrore divino, devastante contro non-morti"},
    ],
    2:[
      {id:"cl21",name:"Cura Moderata",emoji:"💚",dmg:"-3d8",type:"heal",slots:2,desc:"Cura 3d8+5 HP a te o un alleato"},
      {id:"cl22",name:"Silenzio",emoji:"🔇",dmg:"0",type:"control",slots:2,desc:"Zona di silenzio, i magici nemici non possono lanciare spell"},
      {id:"cl23",name:"Arma Spirituale",emoji:"⚔️",dmg:"1d8+4",type:"damage",slots:2,desc:"Spada di energia divina che attacca autonomamente"},
      {id:"cl24",name:"Protezione dal Male",emoji:"🛡️",dmg:"0",type:"defense",slots:2,desc:"+4 DEF contro nemici malvagi per 2 round"},
      {id:"cl25",name:"Augura",emoji:"🔮",dmg:"0",type:"utility",slots:2,desc:"Prevedi il prossimo attacco nemico, +4 DEF questo round"},
    ],
    3:[
      {id:"cl31",name:"Cura di Massa",emoji:"💚",dmg:"-3d8",type:"heal",slots:3,desc:"Cura 3d8 HP a TUTTI gli alleati contemporaneamente"},
      {id:"cl32",name:"Colpo Radioso",emoji:"✨",dmg:"6d8",type:"damage",slots:3,desc:"Esplosione di luce sacra devastante"},
      {id:"cl33",name:"Animare Morti",emoji:"💀",dmg:"0",type:"utility",slots:3,desc:"Evoca uno scheletro alleato per combattere"},
      {id:"cl34",name:"Rimuovi Malediz.",emoji:"🌟",dmg:"0",type:"utility",slots:3,desc:"Rimuovi tutti gli effetti negativi dal party"},
    ],
    4:[
      {id:"cl41",name:"Custode della Fede",emoji:"👼",dmg:"5d8",type:"damage",slots:4,desc:"Guardiano divino che attacca i nemici automaticamente"},
      {id:"cl42",name:"Libertà di Movimento",emoji:"💨",dmg:"0",type:"utility",slots:4,desc:"Immunità a rallentamenti e paralisi per 2 round"},
      {id:"cl43",name:"Tempesta Divina",emoji:"⛈️",dmg:"7d6",type:"damage",slots:4,desc:"Tempesta sacra che colpisce tutti i nemici"},
    ],
    5:[
      {id:"cl51",name:"Resurrezione",emoji:"💫",dmg:"-9999",type:"heal",slots:5,desc:"Riporta un alleato caduto con 1 HP"},
      {id:"cl52",name:"Fiamma Sacra",emoji:"🔥",dmg:"8d8",type:"damage",slots:5,desc:"Colonna di fuoco sacro che distrugge i malvagi"},
      {id:"cl53",name:"Parola del Potere",emoji:"👑",dmg:"0",type:"control",slots:5,desc:"Il nemico con meno HP muore istantaneamente"},
    ],
  },
  druid:{
    1:[
      {id:"dr11",name:"Avviluppo",emoji:"🌿",dmg:"0",type:"control",slots:1,desc:"Radici magiche intrappolano il nemico (salta turno)"},
      {id:"dr12",name:"Guarire Ferite",emoji:"💚",dmg:"-2d8",type:"heal",slots:1,desc:"Cura 2d8+3 HP con energia naturale"},
      {id:"dr13",name:"Tuono delle Fiere",emoji:"🐺",dmg:"2d8",type:"damage",slots:1,desc:"Ruglio magico che terrorizza i nemici (-2 ATK)"},
      {id:"dr14",name:"Forma Selvatica",emoji:"🐻",dmg:"3d6",type:"damage",slots:1,desc:"Ti trasformi brevemente in bestia feroce"},
      {id:"dr15",name:"Nebbia",emoji:"🌫️",dmg:"0",type:"utility",slots:1,desc:"Nebbia fitta, tutti gli attacchi hanno -3 precisione"},
      {id:"dr16",name:"Veleno",emoji:"☠️",dmg:"1d12",type:"damage",slots:1,desc:"Veleno naturale che danneggia per 2 round"},
    ],
    2:[
      {id:"dr21",name:"Pelle Corticosa",emoji:"🌳",dmg:"0",type:"defense",slots:2,desc:"+5 DEF — la tua pelle diventa dura come corteccia"},
      {id:"dr22",name:"Lama di Vento",emoji:"🌪️",dmg:"3d10",type:"damage",slots:2,desc:"Fendente di vento tagliente che colpisce tutti"},
      {id:"dr23",name:"Sciame d'Insetti",emoji:"🐝",dmg:"2d6",type:"damage",slots:2,desc:"Nuvola di vespe che attacca per 2 round di fila"},
      {id:"dr24",name:"Chiamata Animale",emoji:"🦁",dmg:"2d8",type:"utility",slots:2,desc:"Evoca un animale alleato per aiutarti in battaglia"},
    ],
    3:[
      {id:"dr31",name:"Colpo del Vento",emoji:"💨",dmg:"6d8",type:"damage",slots:3,desc:"Vento devastante che travolge tutti i nemici"},
      {id:"dr32",name:"Cura di Gruppo",emoji:"💚",dmg:"-3d8",type:"heal",slots:3,desc:"Cura 3d8 HP a tutti gli alleati"},
      {id:"dr33",name:"Tempesta di Spine",emoji:"🌵",dmg:"5d6",type:"damage",slots:3,desc:"Pioggia di spine magiche su tutti i nemici"},
      {id:"dr34",name:"Terreno Difficile",emoji:"🌊",dmg:"0",type:"control",slots:3,desc:"Il terreno si trasforma, i nemici perdono il turno"},
    ],
    4:[
      {id:"dr41",name:"Forma Elementale",emoji:"🌊",dmg:"5d10",type:"damage",slots:4,desc:"Diventi un elementale d'acqua o terra, attacchi potenti"},
      {id:"dr42",name:"Controllo Piante",emoji:"🌱",dmg:"4d8",type:"control",slots:4,desc:"Le piante attaccano i nemici e li intrappolano"},
      {id:"dr43",name:"Grandine",emoji:"🌨️",dmg:"6d6",type:"damage",slots:4,desc:"Tempesta di grandine magica su tutti i nemici"},
    ],
    5:[
      {id:"dr51",name:"Richiamare Fulmine",emoji:"⚡",dmg:"9d8",type:"damage",slots:5,desc:"Controlli i fulmini, colpisci più nemici a turno"},
      {id:"dr52",name:"Forma di Bestia",emoji:"🐉",dmg:"8d10",type:"damage",slots:5,desc:"Ti trasformi in un dinosauro gigante per 1 round"},
      {id:"dr53",name:"Muro di Spine",emoji:"🌵",dmg:"7d8",type:"damage",slots:5,desc:"Muro invalicabile di spine magiche"},
    ],
  },
  bard:{
    1:[
      {id:"ba11",name:"Ispirazione Bardica",emoji:"🎵",dmg:"0",type:"buff",slots:0,desc:"+3 ATK al prossimo attacco di un alleato (gratuito)"},
      {id:"ba12",name:"Cura Parole",emoji:"💚",dmg:"-2d6",type:"heal",slots:1,desc:"Parole curative che guariscono 2d6+3 HP"},
      {id:"ba13",name:"Insulto Tagliente",emoji:"😈",dmg:"2d6",type:"damage",slots:1,desc:"Insulto magico che umilia e danneggia il nemico"},
      {id:"ba14",name:"Fascino",emoji:"💫",dmg:"0",type:"control",slots:1,desc:"Il nemico più debole salta il turno affascinato"},
      {id:"ba15",name:"Sonno",emoji:"💤",dmg:"0",type:"control",slots:1,desc:"Melodia ipnotica, addormenta nemici con meno di 30 HP"},
      {id:"ba16",name:"Suono Tonante",emoji:"🔊",dmg:"2d8",type:"damage",slots:1,desc:"Onde soniche devastanti che stordiscono il nemico"},
    ],
    2:[
      {id:"ba21",name:"Vedere l'Invisibile",emoji:"👁️",dmg:"0",type:"utility",slots:2,desc:"Riveli creature nascoste, prossimo attacco automatico"},
      {id:"ba22",name:"Silenzio",emoji:"🔇",dmg:"0",type:"control",slots:2,desc:"Zona silenziosa, i maghi nemici non lanciano spell"},
      {id:"ba23",name:"Imitazione",emoji:"🎭",dmg:"3d6",type:"damage",slots:2,desc:"Copi l'ultima spell nemica e la rilanci contro di loro"},
      {id:"ba24",name:"Invisibilità",emoji:"👻",dmg:"0",type:"utility",slots:2,desc:"Sparisci per 1 round, prossimo attacco garantito"},
    ],
    3:[
      {id:"ba31",name:"Ipnosi",emoji:"🌀",dmg:"0",type:"control",slots:3,desc:"Ipnotizzi il nemico più forte, salta 1 turno"},
      {id:"ba32",name:"Cura di Gruppo",emoji:"💚",dmg:"-3d6",type:"heal",slots:3,desc:"Canzone di guarigione, 3d6 HP a tutti gli alleati"},
      {id:"ba33",name:"Onda Tonica",emoji:"🎶",dmg:"5d6",type:"damage",slots:3,desc:"Onda di energia sonora esplosiva"},
      {id:"ba34",name:"Vergogna",emoji:"😳",dmg:"4d6",type:"damage",slots:3,desc:"Maledizione di vergogna, -4 ATK al nemico per 2 round"},
    ],
    4:[
      {id:"ba41",name:"Confusione",emoji:"🎪",dmg:"0",type:"control",slots:4,desc:"Tutti i nemici si confondono e attaccano a caso"},
      {id:"ba42",name:"Grande Ispirazione",emoji:"🎺",dmg:"0",type:"buff",slots:4,desc:"+5 ATK e +5 DEF a tutto il party per 2 round"},
      {id:"ba43",name:"Tentacoli Neri",emoji:"🖤",dmg:"6d6",type:"damage",slots:4,desc:"Tentacoli di oscurità paralizzano i nemici"},
    ],
    5:[
      {id:"ba51",name:"Mass Cura",emoji:"💚",dmg:"-5d8",type:"heal",slots:5,desc:"Cura massiccia: 5d8+5 HP a tutti gli alleati"},
      {id:"ba52",name:"Mente Vuota",emoji:"💭",dmg:"0",type:"control",slots:5,desc:"Tutti i nemici perdono il turno per 1 round"},
      {id:"ba53",name:"Leggenda Vivente",emoji:"🌟",dmg:"0",type:"buff",slots:5,desc:"+8 a tutti i tuoi tiri per il resto del combattimento"},
    ],
  },
  warlock:{
    1:[
      {id:"wl11",name:"Colpo degli Eletti",emoji:"🔱",dmg:"1d10",type:"damage",slots:0,desc:"Magia del patto, disponibile ogni turno (gratuita)"},
      {id:"wl12",name:"Maledizione Malefica",emoji:"💜",dmg:"2d6",type:"damage",slots:1,desc:"Maledizione che amplifica tutti i danni successivi +1d6"},
      {id:"wl13",name:"Armatura di Agathys",emoji:"❄️",dmg:"0",type:"defense",slots:1,desc:"+15 HP temporanei, chi ti colpisce prende 5 danni freddo"},
      {id:"wl14",name:"Mani Brucianti",emoji:"🔥",dmg:"3d6",type:"damage",slots:1,desc:"Fiamme infernali dal patto demonico"},
      {id:"wl15",name:"Terrore",emoji:"😱",dmg:"0",type:"control",slots:1,desc:"Il nemico più debole fugge terrorizzato per 1 round"},
      {id:"wl16",name:"Frammenti del Vuoto",emoji:"🌑",dmg:"1d10",type:"damage",slots:1,desc:"Frammenti di oscurità pura dal piano astrale"},
    ],
    2:[
      {id:"wl21",name:"Suggestione",emoji:"💜",dmg:"0",type:"control",slots:2,desc:"Controlli mentalmente un nemico per 1 round"},
      {id:"wl22",name:"Oscurità Infernale",emoji:"🌑",dmg:"3d8",type:"damage",slots:2,desc:"Sfera di buio infernale, devastante contro creature di luce"},
      {id:"wl23",name:"Passo del Velo",emoji:"🌀",dmg:"0",type:"utility",slots:2,desc:"Teletrasporto di 30 piedi, schivi il prossimo attacco"},
      {id:"wl24",name:"Spirale del Caos",emoji:"⚫",dmg:"2d8",type:"damage",slots:2,desc:"Energia del vuoto che drena forza vitale"},
    ],
    3:[
      {id:"wl31",name:"Ipnosi Infernale",emoji:"👁️",dmg:"0",type:"control",slots:3,desc:"Controllo mentale totale del nemico più forte per 1 round"},
      {id:"wl32",name:"Volo del Diavolo",emoji:"😈",dmg:"5d8",type:"damage",slots:3,desc:"Diventi demoniaco per 1 round, attacchi brutali"},
      {id:"wl33",name:"Terrore di Massa",emoji:"😱",dmg:"0",type:"control",slots:3,desc:"Tutti i nemici meno forti saltano il turno per il terrore"},
      {id:"wl34",name:"Fame del Vuoto",emoji:"🕳️",dmg:"4d8",type:"damage",slots:3,desc:"Buco nero minuscolo che divora l'energia nemica"},
    ],
    4:[
      {id:"wl41",name:"Banishment",emoji:"🌀",dmg:"0",type:"control",slots:4,desc:"Bandisci il nemico più forte nel piano astrale per 1 round"},
      {id:"wl42",name:"Aura Infernale",emoji:"🔱",dmg:"4d10",type:"damage",slots:4,desc:"Aura di fuoco infernale che brucia tutti i nemici vicini"},
      {id:"wl43",name:"Presenza del Padrone",emoji:"👑",dmg:"0",type:"buff",slots:4,desc:"Il tuo patrono ti potenzia: +6 ATK e +6 MAG per 1 round"},
    ],
    5:[
      {id:"wl51",name:"Raggio Infernale",emoji:"☄️",dmg:"10d10",type:"damage",slots:5,desc:"Raggio devastante direttamente dall'inferno"},
      {id:"wl52",name:"Contratto di Sangue",emoji:"💉",dmg:"0",type:"utility",slots:5,desc:"Sacrifichi 20 HP per fare doppio danno per 2 round"},
      {id:"wl53",name:"Possessione",emoji:"😈",dmg:"0",type:"control",slots:5,desc:"Possiedi il nemico più forte, lo controlli per 1 round"},
    ],
  },
  paladin:{
    1:[
      {id:"pa11",name:"Smiting Divino",emoji:"⚡",dmg:"2d8",type:"damage",slots:1,desc:"Carica il colpo di energia sacra (+2d8 al prossimo attacco)"},
      {id:"pa12",name:"Favore Divino",emoji:"✨",dmg:"1d4",type:"buff",slots:1,desc:"+1d4 a tutti gli attacchi per 1 round"},
      {id:"pa13",name:"Cura Ferite",emoji:"💚",dmg:"-2d8",type:"heal",slots:1,desc:"Imposizione delle mani, cura 2d8+5 HP"},
      {id:"pa14",name:"Protezione dal Male",emoji:"🛡️",dmg:"0",type:"defense",slots:1,desc:"+4 DEF contro creature malvagie per 2 round"},
      {id:"pa15",name:"Trovare Trappole",emoji:"🔍",dmg:"0",type:"utility",slots:1,desc:"Sveli trappole nascoste, prossimo attacco a sorpresa +4"},
      {id:"pa16",name:"Ira Sacra",emoji:"🔥",dmg:"3d6",type:"damage",slots:1,desc:"Ira del dio patrono, devastante contro non-morti e demoni"},
    ],
    2:[
      {id:"pa21",name:"Zona della Verità",emoji:"☀️",dmg:"0",type:"control",slots:2,desc:"I nemici non possono ingannarti (-3 ATK nemici)"},
      {id:"pa22",name:"Forza del Paladino",emoji:"💪",dmg:"3d8",type:"damage",slots:2,desc:"Forza sovrumana per 1 attacco devastante"},
      {id:"pa23",name:"Arma Magica",emoji:"⚔️",dmg:"1d6",type:"buff",slots:2,desc:"La tua arma diventa magica (+3 ATK per 2 round)"},
      {id:"pa24",name:"Cura Maggiore",emoji:"💚",dmg:"-3d8",type:"heal",slots:2,desc:"Cura maggiore 3d8+5 HP, rimuovi un effetto negativo"},
    ],
    3:[
      {id:"pa31",name:"Aura del Coraggio",emoji:"🌟",dmg:"0",type:"buff",slots:3,desc:"Tutto il party immune alla paura, +3 ATK per 2 round"},
      {id:"pa32",name:"Colpo Purificante",emoji:"✨",dmg:"6d8",type:"damage",slots:3,desc:"Colpo di luce purificante che brucia il male"},
      {id:"pa33",name:"Revoca Maledizione",emoji:"💫",dmg:"0",type:"utility",slots:3,desc:"Rimuovi tutti gli effetti negativi dal party"},
      {id:"pa34",name:"Crea Cibo",emoji:"🍞",dmg:"-3d6",type:"heal",slots:3,desc:"Cibo magico divino, cura 3d6 HP a tutti gli alleati"},
    ],
    4:[
      {id:"pa41",name:"Aura di Vita",emoji:"💚",dmg:"-5d8",type:"heal",slots:4,desc:"Aura curativa: 5d8 HP agli alleati a 0 HP"},
      {id:"pa42",name:"Giustizia Divina",emoji:"⚖️",dmg:"8d8",type:"damage",slots:4,desc:"Il nemico più malvagio subisce danno massiccio"},
      {id:"pa43",name:"Muro Sacro",emoji:"🏰",dmg:"0",type:"defense",slots:4,desc:"+8 DEF a tutto il party per 1 round"},
    ],
    5:[
      {id:"pa51",name:"Smiting Divino Pot.",emoji:"💥",dmg:"6d8",type:"damage",slots:5,desc:"Smiting massimo, istantaneamente devastante"},
      {id:"pa52",name:"Resurrezione",emoji:"💫",dmg:"-9999",type:"heal",slots:5,desc:"Riporta in vita un alleato caduto"},
      {id:"pa53",name:"Giudizio Finale",emoji:"👑",dmg:"0",type:"control",slots:5,desc:"Tutti i nemici malvagi sono paralizzati per 1 round"},
    ],
  },
  ranger:{
    1:[
      {id:"ra11",name:"Freccia Avvelenata",emoji:"☠️",dmg:"1d6",type:"damage",slots:1,desc:"Veleno naturale che danneggia per 2 round"},
      {id:"ra12",name:"Segna il Nemico",emoji:"🎯",dmg:"1d6",type:"buff",slots:1,desc:"+4 ATK contro il nemico segnato per 2 round"},
      {id:"ra13",name:"Cura Ferite",emoji:"💚",dmg:"-2d6",type:"heal",slots:1,desc:"Erbe naturali, cura 2d6+2 HP"},
      {id:"ra14",name:"Passo del Vento",emoji:"💨",dmg:"0",type:"utility",slots:1,desc:"Schivi il prossimo attacco, sposta posizione"},
      {id:"ra15",name:"Piaga degli Animali",emoji:"🐺",dmg:"2d8",type:"damage",slots:1,desc:"Evochi bestie feroci che attaccano il nemico"},
      {id:"ra16",name:"Rete",emoji:"🕸️",dmg:"0",type:"control",slots:1,desc:"Intrappola il nemico, salta il prossimo turno"},
    ],
    2:[
      {id:"ra21",name:"Freccia Esplosiva",emoji:"💥",dmg:"3d10",type:"damage",slots:2,desc:"Freccia magica che esplode all'impatto"},
      {id:"ra22",name:"Passaggio Naturale",emoji:"🌿",dmg:"0",type:"utility",slots:2,desc:"Diventi uno con la natura, schivi 2 attacchi nemici"},
      {id:"ra23",name:"Piaga del Fuoco",emoji:"🔥",dmg:"4d6",type:"damage",slots:2,desc:"Freccia infuocata che brucia per 2 round"},
      {id:"ra24",name:"Allerta",emoji:"👁️",dmg:"0",type:"buff",slots:2,desc:"+5 iniziativa e non puoi essere sorpreso per 2 round"},
    ],
    3:[
      {id:"ra31",name:"Pioggia di Frecce",emoji:"🏹",dmg:"5d8",type:"damage",slots:3,desc:"Pioggia di frecce su tutti i nemici"},
      {id:"ra32",name:"Forma Animale",emoji:"🐆",dmg:"4d8",type:"damage",slots:3,desc:"Diventi un felino velocissimo, attacchi multipli"},
      {id:"ra33",name:"Freccia del Vento",emoji:"💨",dmg:"6d6",type:"damage",slots:3,desc:"Freccia potenziata dal vento, velocissima e devastante"},
      {id:"ra34",name:"Compagno Animale",emoji:"🦅",dmg:"3d8",type:"utility",slots:3,desc:"Il tuo compagno animale attacca con te questo round"},
    ],
    4:[
      {id:"ra41",name:"Colpo del Cacciatore",emoji:"🎯",dmg:"7d8",type:"damage",slots:4,desc:"Il colpo perfetto del cacciatore esperto"},
      {id:"ra42",name:"Trappola Arcana",emoji:"⚙️",dmg:"5d10",type:"damage",slots:4,desc:"Trappola magica che esplode sotto i nemici"},
      {id:"ra43",name:"Sensi Soprannaturali",emoji:"🌟",dmg:"0",type:"buff",slots:4,desc:"+6 ATK per 2 round, vedi attraverso l'invisibilità"},
    ],
    5:[
      {id:"ra51",name:"Freccia Devastante",emoji:"☄️",dmg:"10d8",type:"damage",slots:5,desc:"La freccia più potente mai scoccata"},
      {id:"ra52",name:"Tempesta di Frecce",emoji:"🌪️",dmg:"7d10",type:"damage",slots:5,desc:"Raffica di frecce magiche su tutti i nemici"},
      {id:"ra53",name:"Istinto del Predatore",emoji:"🐺",dmg:"0",type:"buff",slots:5,desc:"Sensi animali al massimo: attacchi automatici per 2 round"},
    ],
  },
};

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
   LOCAL STORAGE HELPERS (per quests/monsters/meta)
---------------------------------------------- */
function lsGet(key, def) { try { const r=localStorage.getItem(key); return r?JSON.parse(r):def; } catch { return def; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } }

function getQuests()   { return lsGet("eoz_quests", DEFAULT_QUESTS()).map(normalizeQuest); }
function getMonsters() { return lsGet("eoz_monsters",  DEFAULT_MONSTERS); }
function getMeta()     { return lsGet("eoz_meta",      { worldName:"Echoes of Zodar", worldSub:"Dove l'Equilibrio Regna Supremo", logo:null }); }
function saveQuests(q)   { lsSet("eoz_quests", q); }
function saveMonsters(m) { lsSet("eoz_monsters", m); }
function saveMeta(m)     { lsSet("eoz_meta", m); }

/* ----------------------------------------------
   DEFAULT DATA
---------------------------------------------- */
function DEFAULT_QUESTS() {
  return [{
    id:"dq1", title:"La Miniera Maledetta", active:true,
    desc:"Creature delle tenebre hanno infestato la vecchia miniera di Stonehaven. I minatori non tornano più.",
    flavor:"«L'oscurità ha preso vita nei tunnel...» — Sindaco Aldric",
    difficulty:"Facile", xpReward:150, goldReward:60,
    steps:[
      {
        type:"narrative",
        text:"Il party parte all'alba verso la miniera abbandonata a nord della città. L'aria odora di zolfo e il suolo è cosparso di ossa. L'ingresso si apre davanti a voi come una bocca spalancata nel buio."
      },
      {
        type:"choice",
        text:"All'ingresso trovate ossa frantumate e artigli sul legno marcio. Qualcosa di grosso vive qui dentro.",
        choices:[
          { label:"🕯️ Accendete torce e procedete furtivi", xp:15, gold:8, next:2, correct:true },
          { label:"⚡ Avanzate con cautela, senza fretta", xp:0, gold:0, next:2, correct:false },
          { label:"📢 Urlate per intimidire (attirando attenzioni)", xp:0, gold:0, next:2, correct:false }
        ]
      },
      {
        type:"combat",
        text:"Nelle gallerie buie i **Goblin delle Rocce** attaccano! La battaglia inizia!",
        monsters:[{id:"e1",name:"Goblin delle Rocce",emoji:"🗿",hp:22,maxHp:22,atk:6,def:2,xp:18,isBoss:false}]
      },
      {
        type:"narrative",
        text:"I goblin cadono uno dopo l'altro. Una voce profonda echeggia nelle profondità: *«Chi osa disturbare il mio sonno eterno...»* Il suolo trema sotto i vostri piedi."
      },
      {
        type:"combat",
        text:"Al terzo livello il **Troll delle Caverne** vi sbarra la strada. Boss battle!",
        monsters:[{id:"e3",name:"Troll delle Caverne",emoji:"🧌",hp:95,maxHp:95,atk:16,def:7,xp:80,isBoss:true}]
      },
      {
        type:"loot",
        text:"Vittoria! Il troll cade tra un ruggito e il silenzio. I minatori sono liberi! Nelle profondità della caverna scintilla qualcosa...",
        loot:{ gold:[10,30], items:["Pozione di Cura","Spada Arrugginita","Amuleto di Pietra"] }
      }
    ],
    enemies:[
      {id:"e1",name:"Goblin delle Rocce",emoji:"🗿",hp:22,maxHp:22,atk:6,def:2,xp:18,isBoss:false},
      {id:"e3",name:"Troll delle Caverne",emoji:"🧌",hp:95,maxHp:95,atk:16,def:7,xp:80,isBoss:true},
    ],
  },{
    id:"dq2", title:"I Lupi della Brughiera", active:true,
    desc:"I pastori di Brughiera Grigia chiedono aiuto: un branco innaturale sta assaltando greggi e viandanti al calare della nebbia.",
    flavor:"«Non ululano alla luna. Ululano a qualcosa sotto la terra.» — Elva, pastora della brughiera",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {
        type:"narrative",
        text:"La brughiera si apre davanti a voi in onde d'erica e pietra. Tracce profonde segnano il fango, troppo grandi per lupi comuni."
      },
      {
        type:"choice",
        text:"Vicino a un ovile distrutto trovate orme, sangue e ciuffi di pelo nero come pece.",
        choices:[
          { label:"🔎 Seguite le tracce con calma", xp:12, gold:6, next:2, correct:true },
          { label:"🔥 Appiccate fuochi per spaventare il branco", xp:0, gold:0, next:2, correct:false },
          { label:"📯 Restate in campo aperto e attendete l'assalto", xp:0, gold:0, next:2, correct:false }
        ]
      },
      {
        type:"combat",
        text:"Dal banco di nebbia balzano fuori due **Lupi Selvatici** e un **Lupo Ombra**!",
        monsters:[
          {id:"e_wolf_1",name:"Lupo Selvatico",emoji:"🐺",hp:24,maxHp:24,atk:6,def:2,xp:16,isBoss:false},
          {id:"e_wolf_2",name:"Lupo Selvatico",emoji:"🐺",hp:24,maxHp:24,atk:6,def:2,xp:16,isBoss:false},
          {id:"e_shadowwolf",name:"Lupo Ombra",emoji:"🌑",hp:48,maxHp:48,atk:14,def:4,xp:43,isBoss:false}
        ]
      },
      {
        type:"loot",
        text:"Il branco si disperde tra la nebbia. Sotto un menhir spezzato trovate monete, una vecchia faretra e un talismano da caccia.",
        loot:{ gold:[14,26], items:["Arco di Rovi Tesi","Ciondolo della Lanterna"] }
      }
    ],
    enemies:[
      {id:"e_wolf_1",name:"Lupo Selvatico",emoji:"🐺",hp:24,maxHp:24,atk:6,def:2,xp:16,isBoss:false},
      {id:"e_wolf_2",name:"Lupo Selvatico",emoji:"🐺",hp:24,maxHp:24,atk:6,def:2,xp:16,isBoss:false},
      {id:"e_shadowwolf",name:"Lupo Ombra",emoji:"🌑",hp:48,maxHp:48,atk:14,def:4,xp:43,isBoss:false}
    ],
  },{
    id:"dq3", title:"La Cripta del Sagrestano", active:true,
    desc:"Sotto la vecchia cappella del quartiere nord, qualcosa continua a muoversi dopo il tramonto. I fedeli non osano più entrarvi.",
    flavor:"«Le campane tacciono, ma laggiù sotto qualcuno continua a pregare.» — Fratello Iram",
    difficulty:"facile", xpReward:145, goldReward:65,
    steps:[
      {
        type:"narrative",
        text:"Scendete nella cripta attraverso gradini umidi e consumati. L'aria è densa di cera spenta e terra smossa."
      },
      {
        type:"choice",
        text:"Davanti al sepolcro centrale scorgete un sigillo spezzato e simboli graffiati nella pietra.",
        choices:[
          { label:"🙏 Ricomponete il sigillo con rispetto", xp:15, gold:8, next:2, correct:true },
          { label:"🗡️ Aprite subito il sarcofago", xp:0, gold:0, next:2, correct:false },
          { label:"💨 Fate crollare l'ingresso e correte via", xp:0, gold:0, next:2, correct:false }
        ]
      },
      {
        type:"combat",
        text:"Le nicchie si spalancano: uno **Scheletro Errante** e uno **Spettro Debole** emergono dalla penombra!",
        monsters:[
          {id:"e_skel_crypt",name:"Scheletro Errante",emoji:"💀",hp:25,maxHp:25,atk:7,def:3,xp:18,isBoss:false},
          {id:"e_wisp_crypt",name:"Spettro Debole",emoji:"👻",hp:21,maxHp:21,atk:9,def:2,xp:23,isBoss:false}
        ]
      },
      {
        type:"loot",
        text:"La cripta torna silenziosa. Tra reliquiari e ossa sante recuperate una piccola offerta dimenticata.",
        loot:{ gold:[18,32], items:["Tonico di Fogliarossa","Anello di Guardia in Rame"] }
      }
    ],
    enemies:[
      {id:"e_skel_crypt",name:"Scheletro Errante",emoji:"💀",hp:25,maxHp:25,atk:7,def:3,xp:18,isBoss:false},
      {id:"e_wisp_crypt",name:"Spettro Debole",emoji:"👻",hp:21,maxHp:21,atk:9,def:2,xp:23,isBoss:false}
    ],
  },{
    id:"dq4", title:"Il Ponte di Ponteferro", active:true,
    desc:"I mercanti diretti a nord sono bloccati: un troll esige tributi impossibili e divora chi si rifiuta di pagare.",
    flavor:"«Quel mostro conosce il prezzo del ferro, dell'oro e della paura.» — Maresciallo Teren",
    difficulty:"difficile", xpReward:260, goldReward:120,
    steps:[
      {
        type:"narrative",
        text:"Il ponte di pietra domina il fiume in piena. Carri rovesciati e casse spaccate raccontano di molti tentativi falliti."
      },
      {
        type:"choice",
        text:"Vedete il troll in lontananza, seduto tra catene e relitti, mentre annusa l'aria del fiume.",
        choices:[
          { label:"🪤 Preparate un'esca e cercate di isolarlo", xp:18, gold:12, next:2, correct:true },
          { label:"📢 Sfidatelo subito al centro del ponte", xp:0, gold:0, next:2, correct:false },
          { label:"🌊 Tentate di passare a nuoto sotto il ponte", xp:0, gold:0, next:2, correct:false }
        ]
      },
      {
        type:"combat",
        text:"Il **Troll di Ponteferro** si alza con un ruggito, affiancato da due **Banditi di Strada** al suo soldo!",
        monsters:[
          {id:"e_trollbridge",name:"Troll di Ponteferro",emoji:"👺",hp:110,maxHp:110,atk:18,def:8,xp:82,isBoss:true},
          {id:"e_bandit_bridge_1",name:"Bandito di Strada",emoji:"🗡️",hp:28,maxHp:28,atk:8,def:3,xp:20,isBoss:false},
          {id:"e_bandit_bridge_2",name:"Bandito di Strada",emoji:"🗡️",hp:28,maxHp:28,atk:8,def:3,xp:20,isBoss:false}
        ]
      },
      {
        type:"loot",
        text:"Il ponte è vostro. Nei forzieri confiscati ritrovate merci recuperabili, denaro e un'arma ben custodita.",
        loot:{ gold:[30,55], items:["Ascia del Guardiano","Disco Scudopietra"] }
      }
    ],
    enemies:[
      {id:"e_trollbridge",name:"Troll di Ponteferro",emoji:"👺",hp:110,maxHp:110,atk:18,def:8,xp:82,isBoss:true},
      {id:"e_bandit_bridge_1",name:"Bandito di Strada",emoji:"🗡️",hp:28,maxHp:28,atk:8,def:3,xp:20,isBoss:false},
      {id:"e_bandit_bridge_2",name:"Bandito di Strada",emoji:"🗡️",hp:28,maxHp:28,atk:8,def:3,xp:20,isBoss:false}
    ],
  },{
    id:"dq5", title:"Le Fiamme di Hollowpeak", active:true,
    desc:"Dal monastero in rovina di Hollowpeak si levano bagliori rossi ogni notte. Gli abitanti temono un rito ormai sfuggito di mano.",
    flavor:"«La montagna non brucia da sola. Qualcuno le ha insegnato a pregare nel fuoco.» — Sorella Maelin",
    difficulty:"difficile", xpReward:310, goldReward:145,
    steps:[
      {
        type:"narrative",
        text:"Salite tra rocce nere e ceneri calde. Sui muri del monastero antichi motti di fede sono stati riscritti con fuliggine e sangue."
      },
      {
        type:"choice",
        text:"Nel chiostro centrale il calore è quasi insopportabile. Il rito non è ancora completo.",
        choices:[
          { label:"🧂 Spezzate prima i glifi esterni", xp:20, gold:10, next:2, correct:true },
          { label:"⚔️ Correte direttamente verso il santuario", xp:0, gold:0, next:2, correct:false },
          { label:"📚 Cercate pergamene mentre il rito continua", xp:0, gold:0, next:2, correct:false }
        ]
      },
      {
        type:"combat",
        text:"Tra i bracieri si scagliano su di voi un **Mago Ribelle** e un **Elementale del Fuoco**!",
        monsters:[
          {id:"e_rebelmage_peak",name:"Mago Ribelle",emoji:"🪄",hp:38,maxHp:38,atk:14,def:3,xp:44,isBoss:false},
          {id:"e_fireelem_peak",name:"Elementale del Fuoco",emoji:"🔥",hp:88,maxHp:88,atk:19,def:7,xp:84,isBoss:true}
        ]
      },
      {
        type:"loot",
        text:"Il santuario si raffredda. Tra ceneri vive e pietra fusa recuperate un focus arcano e una scorta di monete votive.",
        loot:{ gold:[40,70], items:["Bastone di Hollowpeak","Elisir Scintillaluce"] }
      }
    ],
    enemies:[
      {id:"e_rebelmage_peak",name:"Mago Ribelle",emoji:"🪄",hp:38,maxHp:38,atk:14,def:3,xp:44,isBoss:false},
      {id:"e_fireelem_peak",name:"Elementale del Fuoco",emoji:"🔥",hp:88,maxHp:88,atk:19,def:7,xp:84,isBoss:true}
    ],
  },{
    id:"dq6", title:"Il Giardino delle Pietre Vive", active:true,
    desc:"Nel cortile sepolto di un osservatorio perduto, statue e rune si stanno risvegliando a ogni nuova luna.",
    flavor:"«Le stelle non sono cadute. Sono state chiamate qui, e qualcosa ha risposto.» — Astrologa Sereth",
    difficulty:"speciale", xpReward:360, goldReward:170,
    steps:[
      {
        type:"narrative",
        text:"L'osservatorio emerge dal bosco come un tempio dimenticato. Colonne spezzate, specchi di bronzo e pietre incise vibrano di energia sottile."
      },
      {
        type:"choice",
        text:"Al centro del giardino un cerchio runico pulsa sotto un cielo senza nuvole.",
        choices:[
          { label:"✨ Riallineate le rune secondo le costellazioni", xp:24, gold:14, next:2, correct:true },
          { label:"🛠️ Spezzate i pilastri portanti", xp:0, gold:0, next:2, correct:false },
          { label:"🕯️ Attendete il completarsi del fenomeno", xp:0, gold:0, next:2, correct:false }
        ]
      },
      {
        type:"combat",
        text:"Le pietre si aprono: un **Guardiano Runico** e un **Golem d'Argilla** prendono forma davanti a voi!",
        monsters:[
          {id:"e_runic_guard",name:"Guardiano Runico",emoji:"🔷",hp:96,maxHp:96,atk:17,def:10,xp:86,isBoss:true},
          {id:"e_clay_garden",name:"Golem d'Argilla",emoji:"🗿",hp:72,maxHp:72,atk:11,def:8,xp:48,isBoss:false}
        ]
      },
      {
        type:"loot",
        text:"Il cerchio si spegne e il giardino tace. Sotto il piedistallo maggiore trovate un oggetto celeste e antiche monete d'argento nero.",
        loot:{ gold:[55,90], items:["Grimorio Sussurrastelle","Sigillo dello Scriba del Fulmine"] }
      }
    ],
    enemies:[
      {id:"e_runic_guard",name:"Guardiano Runico",emoji:"🔷",hp:96,maxHp:96,atk:17,def:10,xp:86,isBoss:true},
      {id:"e_clay_garden",name:"Golem d'Argilla",emoji:"🗿",hp:72,maxHp:72,atk:11,def:8,xp:48,isBoss:false}
    ],
  },{
    id:"dq7", title:"La Notte della Cometa Spezzata", active:true, category:"event",
    desc:"Una cometa infranta ha risvegliato il Santuario del Cielo Caduto. Mostri antichi marciano verso la città e l'intero reame trattiene il respiro.",
    flavor:"«Se il santuario si apre del tutto, il cielo cadrà una seconda volta.» — Gran Maestro Vaelor",
    difficulty:"speciale", xpReward:620, goldReward:320,
    steps:[
      {
        type:"narrative",
        text:"La notte è rossa e il vento porta cenere brillante. Attraversate campi deserti, statue decapitate e rovine illuminate da frammenti di cometa."
      },
      {
        type:"choice",
        text:"Ai piedi del santuario trovate tre obelischi crepati che alimentano il portale celeste.",
        choices:[
          { label:"🌠 Disattivate gli obelischi uno dopo l'altro", xp:30, gold:18, next:2, correct:true },
          { label:"⚔️ Sfondate il portale prima che si stabilizzi", xp:0, gold:0, next:2, correct:false },
          { label:"📖 Studiate troppo a lungo i segni della cometa", xp:0, gold:0, next:2, correct:false }
        ]
      },
      {
        type:"combat",
        text:"Dal santuario discendono il **Titano di Ferro**, il **Lich delle Catacombe** e il **Drago Rosso**. La battaglia finale ha inizio!",
        monsters:[
          {id:"e_titan_comet",name:"Titano di Ferro",emoji:"🤖",hp:190,maxHp:190,atk:26,def:14,xp:155,isBoss:true},
          {id:"e_lich_comet",name:"Lich delle Catacombe",emoji:"☠️",hp:160,maxHp:160,atk:24,def:11,xp:138,isBoss:true},
          {id:"e_dragon_comet",name:"Drago Rosso",emoji:"🐉",hp:220,maxHp:220,atk:30,def:15,xp:200,isBoss:true}
        ]
      },
      {
        type:"loot",
        text:"La cometa si spegne sopra il santuario e l'alba trova ancora il party in piedi. Tra reliquie spezzate e metallo stellare giace un tesoro degno di leggenda.",
        loot:{ gold:[120,200], items:["Lama del Cervo Dorato","Elisir dell'Ultima Alba","Cuore del Pozzo Stellare"] }
      }
    ],
    enemies:[
      {id:"e_titan_comet",name:"Titano di Ferro",emoji:"🤖",hp:190,maxHp:190,atk:26,def:14,xp:155,isBoss:true},
      {id:"e_lich_comet",name:"Lich delle Catacombe",emoji:"☠️",hp:160,maxHp:160,atk:24,def:11,xp:138,isBoss:true},
      {id:"e_dragon_comet",name:"Drago Rosso",emoji:"🐉",hp:220,maxHp:220,atk:30,def:15,xp:200,isBoss:true}
    ],
  }];
}
const DEFAULT_MONSTERS = [
  {id:"m1",name:"Goblin delle Rovine",emoji:"🧌",hp:20,atk:5,def:2,xp:15,desc:"Piccolo razziatore delle strade spezzate."},
  {id:"m2",name:"Lupo Selvatico",emoji:"🐺",hp:24,atk:6,def:2,xp:16,desc:"Predatore affamato che caccia ai margini del villaggio."},
  {id:"m3",name:"Scheletro Errante",emoji:"💀",hp:25,atk:7,def:3,xp:18,desc:"Un non-morto instabile richiamato da antiche tombe."},
  {id:"m4",name:"Ratto di Fogne",emoji:"🐀",hp:18,atk:5,def:1,xp:12,desc:"Grande, sporco e pronto a mordere in branco."},
  {id:"m5",name:"Bandito di Strada",emoji:"🗡️",hp:28,atk:8,def:3,xp:20,desc:"Predone armato di lama corta e cattive intenzioni."},
  {id:"m6",name:"Ragno dei Sottoboschi",emoji:"🕷️",hp:22,atk:7,def:2,xp:17,desc:"Creatura rapida che tesse trappole tra radici e rocce."},
  {id:"m7",name:"Melma di Cantina",emoji:"🟢",hp:30,atk:6,def:4,xp:19,desc:"Ammasso acido nato dall'umidita e dalla negligenza."},
  {id:"m8",name:"Cultista Novizio",emoji:"🕯️",hp:26,atk:8,def:2,xp:21,desc:"Adepto inesperto di un culto sotterraneo."},
  {id:"m9",name:"Coboldo Minatore",emoji:"⛏️",hp:24,atk:7,def:3,xp:18,desc:"Scavatore furtivo che difende tunnel rubati."},
  {id:"m10",name:"Cinghiale Furioso",emoji:"🐗",hp:34,atk:9,def:3,xp:22,desc:"Bestia testarda che travolge chi invade il suo territorio."},
  {id:"m11",name:"Spettro Debole",emoji:"👻",hp:21,atk:9,def:2,xp:23,desc:"Un'ombra fredda che prosciuga il coraggio dei vivi."},
  {id:"m12",name:"Mercenario Rinnegato",emoji:"🪓",hp:36,atk:10,def:4,xp:24,desc:"Veterano caduto in disgrazia e venduto al miglior offerente."},

  {id:"m13",name:"Orco Guerriero",emoji:"🪓",hp:60,atk:12,def:5,xp:40,desc:"Brutale combattente di frontiera che vive per la guerra."},
  {id:"m14",name:"Gnoll Predatore",emoji:"🐾",hp:54,atk:13,def:4,xp:42,desc:"Iena umanoide che fiuta debolezza e sangue."},
  {id:"m15",name:"Arciere Goblin Nero",emoji:"🏹",hp:40,atk:12,def:4,xp:36,desc:"Tiratore crudele nascosto tra rovine e impalcature."},
  {id:"m16",name:"Mago Ribelle",emoji:"🪄",hp:38,atk:14,def:3,xp:44,desc:"Incantatore fuggiasco che piega il fuoco alla vendetta."},
  {id:"m17",name:"Golem d'Argilla",emoji:"🗿",hp:72,atk:11,def:8,xp:48,desc:"Guardiano plasmato per restare saldo fino alla distruzione."},
  {id:"m18",name:"Cavaliere Scheletrico",emoji:"⚔️",hp:58,atk:13,def:6,xp:46,desc:"Antico guerriero morto ancora fedele al suo giuramento."},
  {id:"m19",name:"Strega di Palude",emoji:"🧙",hp:42,atk:15,def:4,xp:47,desc:"Mistica corrotta che intreccia malie e fanghiglia."},
  {id:"m20",name:"Ogre delle Colline",emoji:"👹",hp:80,atk:15,def:5,xp:52,desc:"Gigante rozzo che abbatte porte e uomini con la stessa facilita."},
  {id:"m21",name:"Lupo Ombra",emoji:"🌑",hp:48,atk:14,def:4,xp:43,desc:"Predatore innaturale che emerge da nebbie scure."},
  {id:"m22",name:"Serpente delle Rovine",emoji:"🐍",hp:46,atk:13,def:4,xp:39,desc:"Rettile antico che difende cripte e tesori sepolti."},
  {id:"m23",name:"Accolito del Sangue",emoji:"🩸",hp:44,atk:14,def:5,xp:45,desc:"Fanatico temprato da riti violenti e promesse oscure."},
  {id:"m24",name:"Armigero Corrotto",emoji:"🛡️",hp:68,atk:12,def:7,xp:50,desc:"Soldato caduto che serve una causa ormai marcia."},

  {id:"m25",name:"Troll di Ponteferro",emoji:"👺",hp:110,atk:18,def:8,xp:82,desc:"Mostro rigenerante che pretende tributi in carne e oro."},
  {id:"m26",name:"Vampiro",emoji:"🧛",hp:90,atk:18,def:8,xp:80,desc:"Nobile predatore della notte che sorride prima di colpire."},
  {id:"m27",name:"Elementale del Fuoco",emoji:"🔥",hp:88,atk:19,def:7,xp:84,desc:"Spirito ardente evocato da altari e forge blasfeme."},
  {id:"m28",name:"Guardiano Runico",emoji:"🔷",hp:96,atk:17,def:10,xp:86,desc:"Sentinella antica alimentata da rune ancora vive."},
  {id:"m29",name:"Cacciatrice Drow",emoji:"🕸️",hp:70,atk:20,def:6,xp:79,desc:"Assassina del sottosuolo rapida e spietata."},
  {id:"m30",name:"Cavaliere del Vespro",emoji:"🌒",hp:104,atk:18,def:9,xp:88,desc:"Campione maledetto avvolto nella luce morente del tramonto."},
  {id:"m31",name:"Idra Giovane",emoji:"🐍",hp:118,atk:20,def:8,xp:92,desc:"Mostro a piu teste che attacca da ogni angolo."},
  {id:"m32",name:"Demone Incatenato",emoji:"⛓️",hp:112,atk:21,def:9,xp:95,desc:"Creatura infernale trattenuta da sigilli ormai indeboliti."},

  {id:"m33",name:"Signore dei Lupi Bianchi",emoji:"🐺",hp:140,atk:22,def:10,xp:120,desc:"Alfa leggendario che guida il branco nelle nevi eterne.",isBoss:true},
  {id:"m34",name:"Regina Ragno",emoji:"🕷️",hp:150,atk:23,def:9,xp:128,desc:"Matriarca velenosa che domina cripte e ragnatele.",isBoss:true},
  {id:"m35",name:"Lich delle Catacombe",emoji:"☠️",hp:160,atk:24,def:11,xp:138,desc:"Necromante immortale custodito da ossa e segreti.",isBoss:true},
  {id:"m36",name:"Titano di Ferro",emoji:"🤖",hp:190,atk:26,def:14,xp:155,desc:"Macchina da guerra antica che schiaccia intere linee.",isBoss:true},
  {id:"m37",name:"Re dei Demoni Minori",emoji:"😈",hp:175,atk:27,def:12,xp:148,desc:"Sovrano crudele di una corte infernale minore.",isBoss:true},
  {id:"m38",name:"Drago Rosso",emoji:"🐉",hp:220,atk:30,def:15,xp:200,desc:"Terrore del continente e flagello dei cieli.",isBoss:true},
];

function buildDefaultItems() {
  return [
    { id:"weapon_rustbit_shortsword", name:"Spada Corta Sbeccata", emoji:"🗡️", type:"weapon", slot:"weapon", rarity:"common", price:24, description:"Una lama da strada scheggiata, ancora fidata dalle guardie delle carovane.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_ashwood_club", name:"Randello di Frassino", emoji:"🪵", type:"weapon", slot:"weapon", rarity:"common", price:16, description:"Un robusto ramo temprato, caro a rissaioli e miliziani.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_stonevale_spear", name:"Lancia di Pietravalle", emoji:"🔱", type:"weapon", slot:"weapon", rarity:"common", price:22, description:"Una semplice lancia ferrata delle milizie della valle.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_briar_string_bow", name:"Arco di Rovi Tesi", emoji:"🏹", type:"weapon", slot:"weapon", rarity:"common", price:28, description:"Arco da caccia incordato con fibre di rovo trattate.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },
    { id:"weapon_moonfork_dagger", name:"Pugnale Lunaforca", emoji:"🗡️", type:"weapon", slot:"weapon", rarity:"common", price:18, description:"Una lama sottile fatta per imboscate e vicoli stretti.", damageDice:"1d4", weapon_die:"1d4", bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },
    { id:"weapon_glowember_wand", name:"Bacchetta Brillabrace", emoji:"🪄", type:"weapon", slot:"weapon", rarity:"common", price:32, description:"Un focus iniziale d'ebano ardente per giovani incantatori.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:0, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_watchmans_axe", name:"Ascia del Guardiano", emoji:"🪓", type:"weapon", slot:"weapon", rarity:"uncommon", price:52, description:"Un'ascia affidabile forgiata per le pattuglie di confine.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:-1, heal_amount:0, available:true },
    { id:"weapon_frosttrail_mace", name:"Mazza del Sentiero Gelido", emoji:"🔨", type:"weapon", slot:"weapon", rarity:"uncommon", price:56, description:"Una mazza temprata al freddo, letale contro ossa e scudi.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:-1, heal_amount:0, available:true },
    { id:"weapon_silverfen_rapier", name:"Rapier di Silverfen", emoji:"⚔️", type:"weapon", slot:"weapon", rarity:"uncommon", price:60, description:"La lama dei duellanti delle corti specchiate di Silverfen.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },
    { id:"weapon_hollowpeak_staff", name:"Bastone di Hollowpeak", emoji:"🪄", type:"weapon", slot:"weapon", rarity:"uncommon", price:58, description:"Un bastone runico levigato sui pendii di Hollowpeak.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:0, bonus_def:0, bonus_mag:2, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_riverwake_crossbow", name:"Balestra di Riverwake", emoji:"🏹", type:"weapon", slot:"weapon", rarity:"uncommon", price:64, description:"Una balestra compatta amata da esploratori e guardie dei traghetti.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_dawnfire_longsword", name:"Spada Lunga Ardalba", emoji:"⚔️", type:"weapon", slot:"weapon", rarity:"rare", price:110, description:"L'acciaio lucido cattura la luce del mattino come una fiamma sacra.", damageDice:"1d10", weapon_die:"1d10", bonus_atk:3, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_blackroot_halberd", name:"Alabarda di Blackroot", emoji:"🪓", type:"weapon", slot:"weapon", rarity:"rare", price:118, description:"Una feroce arma in asta usata nelle cacce ai mostri di Blackroot.", damageDice:"1d10", weapon_die:"1d10", bonus_atk:3, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:-1, heal_amount:0, available:true },
    { id:"weapon_starhush_grimoire", name:"Grimorio Sussurrastelle", emoji:"📘", type:"weapon", slot:"weapon", rarity:"rare", price:126, description:"Un libro di magia sussurrante avvolto in cuoio di mezzanotte.", damageDice:"1d10", weapon_die:"1d10", bonus_atk:0, bonus_def:0, bonus_mag:3, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_golden_stag_blade", name:"Lama del Cervo Dorato", emoji:"🗡️", type:"weapon", slot:"weapon", rarity:"epic", price:220, description:"Una lama reale da caccia, ancora degna di sangue e leggenda.", damageDice:"1d10", weapon_die:"1d10", bonus_atk:4, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },

    { id:"armor_patchwork_gambeson", name:"Gambeson di Toppe", emoji:"🧥", type:"armor", slot:"armor", rarity:"common", price:20, description:"Strati di stoffa e lana cuciti da vecchi indumenti da viaggio.", armorBonus:1, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:6, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_mosshide_leather", name:"Cuoio Muschiato", emoji:"🥋", type:"armor", slot:"armor", rarity:"common", price:26, description:"Armatura di cuoio oliato, perfetta per foreste umide e passi silenziosi.", armorBonus:1, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:8, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_ironring_vest", name:"Giaco ad Anelli di Ferro", emoji:"⛓️", type:"armor", slot:"armor", rarity:"common", price:34, description:"Una cotta smanicata apprezzata dalle guardie delle strade.", armorBonus:2, bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:10, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_stormpatch_coat", name:"Cappotto Tempestoppa", emoji:"🧥", type:"armor", slot:"armor", rarity:"uncommon", price:48, description:"Un cappotto rinforzato con placche nascoste sotto la fodera.", armorBonus:2, bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:12, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_bastion_chainmail", name:"Maglia di Bastion", emoji:"⛓️", type:"armor", slot:"armor", rarity:"uncommon", price:60, description:"Una solida cotta di maglia nata nelle forge del vecchio Bastion.", armorBonus:3, bonus_atk:0, bonus_def:3, bonus_mag:0, bonus_hp:14, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_sunkeep_scale", name:"Corazza a Scaglie di Sunkeep", emoji:"🐲", type:"armor", slot:"armor", rarity:"rare", price:104, description:"Scaglie bronzee che riflettono il caldo bagliore delle mura di Sunkeep.", armorBonus:4, bonus_atk:0, bonus_def:4, bonus_mag:0, bonus_hp:18, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_granite_guard_plate", name:"Piastre della Guardia di Granito", emoji:"🛡️", type:"armor", slot:"armor", rarity:"epic", price:210, description:"Pesante armatura a piastre un tempo data ai custodi delle porte montane.", armorBonus:5, bonus_atk:0, bonus_def:5, bonus_mag:0, bonus_hp:24, bonus_init:-2, weapon_die:null, heal_amount:0, available:true },

    { id:"potion_redleaf_tonic", name:"Tonico di Fogliarossa", emoji:"🧪", type:"potion", slot:null, rarity:"common", price:14, description:"Un semplice infuso di Fogliarossa per chiudere tagli e calmare il respiro.", effect:"heal", value:10, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:10, available:true },
    { id:"potion_lesser_mending", name:"Ampolla di Ristoro Minore", emoji:"🧪", type:"potion", slot:null, rarity:"common", price:18, description:"Una piccola ampolla che lenisce lividi e ferite superficiali.", effect:"heal", value:14, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:14, available:true },
    { id:"potion_hunters_focus", name:"Infuso del Cacciatore", emoji:"🍃", type:"potion", slot:null, rarity:"common", price:20, description:"Affina vista e respiro prima di un tiro difficile.", effect:"init", value:2, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, weapon_die:null, heal_amount:0, available:true },
    { id:"potion_guardians_balm", name:"Balsamo del Guardiano", emoji:"🧴", type:"potion", slot:null, rarity:"uncommon", price:30, description:"Un unguento azzurrastro che indurisce il corpo contro gli impatti.", effect:"def", value:2, bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"potion_sparkshine_elixir", name:"Elisir Scintillaluce", emoji:"✨", type:"potion", slot:null, rarity:"uncommon", price:34, description:"Un tonico alchemico brillante che risveglia i canali arcani.", effect:"mag", value:2, bonus_atk:0, bonus_def:0, bonus_mag:2, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"potion_major_healing", name:"Fiala di Grande Cura", emoji:"🧪", type:"potion", slot:null, rarity:"rare", price:52, description:"Riservata alle emergenze sul campo e alle ferite quasi mortali.", effect:"heal", value:26, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:26, available:true },

    { id:"accessory_copperward_ring", name:"Anello di Guardia in Rame", emoji:"💍", type:"accessory", slot:"accessory", rarity:"common", price:24, description:"Un semplice anello inciso con un'antica spirale protettiva.", statBonus:{ def:1 }, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_lantern_charm", name:"Ciondolo della Lanterna", emoji:"🕯️", type:"accessory", slot:"accessory", rarity:"common", price:22, description:"Un talismano d'ottone che aiuta i viandanti a restare vigili nel buio.", statBonus:{ init:1 }, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_ember_thread_sash", name:"Fascia di Filo di Brace", emoji:"🎗️", type:"accessory", slot:"accessory", rarity:"uncommon", price:42, description:"Una fascia intrecciata con filamenti tiepidi delle tessiture del fuoco.", statBonus:{ atk:1, mag:1 }, bonus_atk:1, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_sagebone_talisman", name:"Talismano d'Osso Saggio", emoji:"📿", type:"accessory", slot:"accessory", rarity:"rare", price:78, description:"Un pallido amuleto d'osso inciso da un eremita dimenticato.", statBonus:{ mag:2 }, bonus_atk:0, bonus_def:0, bonus_mag:2, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"weapon_bronzefang_falchion", name:"Falcione Zannabronzo", emoji:"⚔️", type:"weapon", slot:"weapon", rarity:"common", price:26, description:"Una lama ricurva amata dai mercenari di frontiera.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_wayfarer_hatchet", name:"Accetta del Viandante", emoji:"🪓", type:"weapon", slot:"weapon", rarity:"common", price:20, description:"Compatta, robusta e sempre pronta per il sentiero.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_thornwind_sling", name:"Fionda Vento di Spine", emoji:"🏹", type:"weapon", slot:"weapon", rarity:"common", price:18, description:"Piccola arma da distanza per mani rapide e mira paziente.", damageDice:"1d4", weapon_die:"1d4", bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },
    { id:"weapon_millstone_hammer", name:"Martello da Macina", emoji:"🔨", type:"weapon", slot:"weapon", rarity:"common", price:24, description:"Un attrezzo convertito in arma da chi lavora e combatte.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:-1, heal_amount:0, available:true },
    { id:"weapon_nightreed_rod", name:"Verga di Canneoscura", emoji:"🪄", type:"weapon", slot:"weapon", rarity:"common", price:30, description:"Un focus palustre per apprendisti della magia d'ombra.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:0, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_redharbor_cutlass", name:"Sciabola di Porto Rosso", emoji:"⚔️", type:"weapon", slot:"weapon", rarity:"uncommon", price:54, description:"Una lama da abbordaggio veloce e crudele.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_stagrun_glaive", name:"Glaive Corsa del Cervo", emoji:"🔱", type:"weapon", slot:"weapon", rarity:"uncommon", price:58, description:"Arma in asta elegante per guerrieri mobili.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_quicksilver_knife", name:"Coltello Argento Vivo", emoji:"🗡️", type:"weapon", slot:"weapon", rarity:"uncommon", price:50, description:"Leggero e rapidissimo, nato per colpire prima.", damageDice:"1d6", weapon_die:"1d6", bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:3, heal_amount:0, available:true },
    { id:"weapon_cinderhymn_luteblade", name:"Lutoblama di Cinerea", emoji:"🎸", type:"weapon", slot:"weapon", rarity:"uncommon", price:62, description:"Uno strumento-armato che vibra di magia e acciaio.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:1, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_graveshade_orb", name:"Sfera di Tombaombra", emoji:"🔮", type:"weapon", slot:"weapon", rarity:"uncommon", price:64, description:"Un globo opaco che concentra malie fredde e precise.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:0, bonus_def:0, bonus_mag:2, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_oathforge_blade", name:"Lama della Forgia del Giuramento", emoji:"⚔️", type:"weapon", slot:"weapon", rarity:"rare", price:112, description:"Forgiata per cavalieri che giurano di non arretrare.", damageDice:"1d10", weapon_die:"1d10", bonus_atk:3, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_skylash_whip", name:"Frusta Sferzacielo", emoji:"🪢", type:"weapon", slot:"weapon", rarity:"rare", price:106, description:"Una frusta runica che colpisce dove l'aria è più sottile.", damageDice:"1d8", weapon_die:"1d8", bonus_atk:2, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },
    { id:"weapon_wolfsmoke_greataxe", name:"Grande Ascia Fumolupo", emoji:"🪓", type:"weapon", slot:"weapon", rarity:"rare", price:118, description:"Pesante, rabbiosa e perfetta per spezzare linee.", damageDice:"1d10", weapon_die:"1d10", bonus_atk:3, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:-1, heal_amount:0, available:true },
    { id:"weapon_glassriver_staff", name:"Bastone del Fiume di Vetro", emoji:"🪄", type:"weapon", slot:"weapon", rarity:"rare", price:122, description:"Bastone cristallino che rende limpida la volontà arcana.", damageDice:"1d10", weapon_die:"1d10", bonus_atk:0, bonus_def:0, bonus_mag:3, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_bloodsun_claymore", name:"Claymore Sole di Sangue", emoji:"⚔️", type:"weapon", slot:"weapon", rarity:"epic", price:214, description:"Una lama a due mani che arde di luce cremisi.", damageDice:"1d12", weapon_die:"1d12", bonus_atk:4, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_verdant_moon_scythe", name:"Falce di Luna Verde", emoji:"🌙", type:"weapon", slot:"weapon", rarity:"epic", price:226, description:"Falce druidica che danza tra morte e rinascita.", damageDice:"1d12", weapon_die:"1d12", bonus_atk:3, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"weapon_thunderwell_bow", name:"Arco del Pozzo del Tuono", emoji:"🏹", type:"weapon", slot:"weapon", rarity:"epic", price:232, description:"Le sue corde cantano come un temporale lontano.", damageDice:"1d12", weapon_die:"1d12", bonus_atk:4, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },
    { id:"weapon_hallowed_comet_tome", name:"Tomo della Cometa Sacra", emoji:"📘", type:"weapon", slot:"weapon", rarity:"epic", price:238, description:"Un grimorio luminoso per maghi che guidano e proteggono.", damageDice:"1d12", weapon_die:"1d12", bonus_atk:0, bonus_def:1, bonus_mag:4, bonus_hp:0, bonus_init:0, heal_amount:0, available:true },
    { id:"weapon_kingbreaker_relicblade", name:"Reliquia Spezzare", emoji:"🗡️", type:"weapon", slot:"weapon", rarity:"legendary", price:390, description:"Una reliquia regale nata per abbattere tiranni e demoni.", damageDice:"2d8", weapon_die:"2d8", bonus_atk:5, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:2, heal_amount:0, available:true },
    { id:"weapon_eclipsed_seraph_spear", name:"Lancia del Serafino Eclissato", emoji:"🔱", type:"weapon", slot:"weapon", rarity:"legendary", price:410, description:"Una lancia sacra d'ombra e luce per paladini e veggenti.", damageDice:"2d8", weapon_die:"2d8", bonus_atk:4, bonus_def:1, bonus_mag:2, bonus_hp:0, bonus_init:1, heal_amount:0, available:true },
    { id:"armor_hedgerow_jerkin", name:"Giaco di Siepe", emoji:"🧥", type:"armor", slot:"armor", rarity:"common", price:22, description:"Pelle e stoffa cucite per chi vive ai margini dei campi.", armorBonus:1, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:7, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_charcoat_vest", name:"Panciotto Carbonero", emoji:"🧥", type:"armor", slot:"armor", rarity:"common", price:24, description:"Un giubbetto annerito dal fumo ma duro come la corteccia.", armorBonus:1, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:8, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_foxstep_leathers", name:"Cuoio Passovolpe", emoji:"🥋", type:"armor", slot:"armor", rarity:"common", price:28, description:"Leggero e silenzioso, perfetto per esploratori agili.", armorBonus:1, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:8, bonus_init:2, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_masons_mail", name:"Maglia del Muratore", emoji:"⛓️", type:"armor", slot:"armor", rarity:"common", price:32, description:"Cotta grezza ma fedele, nata nelle cave fortificate.", armorBonus:2, bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:10, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_briarguard_coat", name:"Cappotto dei Guardarovi", emoji:"🧥", type:"armor", slot:"armor", rarity:"common", price:30, description:"Tessuto cerato per pattuglie boschive e notti umide.", armorBonus:1, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:9, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_falconer_harness", name:"Imbrago del Falconiere", emoji:"🥋", type:"armor", slot:"armor", rarity:"uncommon", price:46, description:"Corazza leggera fatta per tiratori e cacciatori mobili.", armorBonus:2, bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:11, bonus_init:2, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_emberplate_cuirass", name:"Corazza Braciapiastra", emoji:"🛡️", type:"armor", slot:"armor", rarity:"uncommon", price:58, description:"Piastre annerite da forge che non si spengono mai.", armorBonus:3, bonus_atk:0, bonus_def:3, bonus_mag:0, bonus_hp:14, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_mistveil_robes", name:"Vesti di Velo di Nebbia", emoji:"🪶", type:"armor", slot:"armor", rarity:"uncommon", price:54, description:"Robe sottili che favoriscono magia e schivata.", armorBonus:2, bonus_atk:0, bonus_def:1, bonus_mag:2, bonus_hp:10, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_ironbloom_brigandine", name:"Brigantina Fiordiferro", emoji:"⛓️", type:"armor", slot:"armor", rarity:"uncommon", price:62, description:"Lamine celate sotto il cuoio per tank di frontiera.", armorBonus:3, bonus_atk:0, bonus_def:3, bonus_mag:0, bonus_hp:15, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_wardenhide_shell", name:"Scorza di Guardiacuoio", emoji:"🥋", type:"armor", slot:"armor", rarity:"uncommon", price:60, description:"Pelli trattate con resine che deviano colpi e graffi.", armorBonus:3, bonus_atk:0, bonus_def:3, bonus_mag:0, bonus_hp:13, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_skywatch_halfplate", name:"Mezza Piastra dei Guardacieli", emoji:"🛡️", type:"armor", slot:"armor", rarity:"rare", price:102, description:"Armatura d'osservazione per sentinelle delle torri alte.", armorBonus:4, bonus_atk:0, bonus_def:4, bonus_mag:0, bonus_hp:18, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_spellthorn_raiment", name:"Paramento di Rovisferza", emoji:"🪄", type:"armor", slot:"armor", rarity:"rare", price:108, description:"Abito rituale che protegge senza soffocare il mana.", armorBonus:3, bonus_atk:0, bonus_def:2, bonus_mag:3, bonus_hp:12, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_grimhall_plate", name:"Piastra di Grimhall", emoji:"🛡️", type:"armor", slot:"armor", rarity:"rare", price:118, description:"Piastre profonde come un portone di fortezza.", armorBonus:4, bonus_atk:0, bonus_def:4, bonus_mag:0, bonus_hp:20, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_whisperleaf_shroud", name:"Sudario di Fogliasussurro", emoji:"🌿", type:"armor", slot:"armor", rarity:"rare", price:110, description:"Tessuti silvestri per supporti rapidi e arcieri scaltri.", armorBonus:3, bonus_atk:0, bonus_def:2, bonus_mag:1, bonus_hp:14, bonus_init:2, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_solar_bastion_harness", name:"Bardatura del Bastione Solare", emoji:"☀️", type:"armor", slot:"armor", rarity:"epic", price:206, description:"Armatura cerimoniale che riflette la luce come metallo vivo.", armorBonus:5, bonus_atk:0, bonus_def:5, bonus_mag:1, bonus_hp:24, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_deepvault_bulwark", name:"Corazza del Forziere Profondo", emoji:"🛡️", type:"armor", slot:"armor", rarity:"epic", price:218, description:"Corazza pesante per guardiani che non cedono mai terreno.", armorBonus:5, bonus_atk:0, bonus_def:5, bonus_mag:0, bonus_hp:28, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_moonquartz_mantle", name:"Manto di Quarzo Lunare", emoji:"🌙", type:"armor", slot:"armor", rarity:"epic", price:224, description:"Una veste gemmata che protegge i grandi incantatori.", armorBonus:4, bonus_atk:0, bonus_def:3, bonus_mag:4, bonus_hp:16, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_ravenmarch_warcoat", name:"Cappamaglia di Marciacorvo", emoji:"🧥", type:"armor", slot:"armor", rarity:"epic", price:212, description:"Fatta per comandanti che vogliono restare mobili in battaglia.", armorBonus:4, bonus_atk:1, bonus_def:4, bonus_mag:0, bonus_hp:22, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_auric_dragonplate", name:"Piastra del Drago Aureo", emoji:"🐉", type:"armor", slot:"armor", rarity:"legendary", price:398, description:"Scaglie dorate e rune di reame per veri campioni.", armorBonus:6, bonus_atk:0, bonus_def:6, bonus_mag:2, bonus_hp:32, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"armor_crownwarden_aegisplate", name:"Piastra degli Scudieri della Corona", emoji:"👑", type:"armor", slot:"armor", rarity:"legendary", price:420, description:"La corazza di chi porta il peso di un intero regno.", armorBonus:6, bonus_atk:1, bonus_def:6, bonus_mag:1, bonus_hp:34, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_oakbound_buckler", name:"Brocchiero di Quercianodo", emoji:"🛡️", type:"shield", slot:"shield", rarity:"common", price:18, description:"Piccolo scudo per schermagliatori attenti.", bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:4, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_riverguard_round", name:"Rotella della Guardia Fluviale", emoji:"🛡️", type:"shield", slot:"shield", rarity:"common", price:20, description:"Un tondo di legno ferrato per pattuglie di ponte.", bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:5, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_ashgrove_targe", name:"Targa di Frassineto", emoji:"🛡️", type:"shield", slot:"shield", rarity:"common", price:22, description:"Leggero, saldo e semplice da usare.", bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:5, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_forgepan_guard", name:"Guardiapadella di Forgia", emoji:"🛡️", type:"shield", slot:"shield", rarity:"common", price:24, description:"Rozzo ma sorprendentemente affidabile tra i colpi stretti.", bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:4, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_crowfeather_kite", name:"Scudo Aquilone Piumacorvo", emoji:"🛡️", type:"shield", slot:"shield", rarity:"common", price:26, description:"Sagoma allungata per difendere senza perdere mobilità.", bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:6, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_stoneshield_disk", name:"Disco Scudopietra", emoji:"🛡️", type:"shield", slot:"shield", rarity:"uncommon", price:42, description:"Un disco spesso che assorbe l'impatto meglio del ferro.", bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:8, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_embercrest_guard", name:"Paria del Cembro Ardente", emoji:"🛡️", type:"shield", slot:"shield", rarity:"uncommon", price:46, description:"Scudo brunito con crestature che spezzano i fendenti.", bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:9, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_huntermoon_bulwark", name:"Riparo della Luna Cacciatrice", emoji:"🛡️", type:"shield", slot:"shield", rarity:"uncommon", price:48, description:"Preferito da ranger che vogliono restare rapidi.", bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:7, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_bastion_spikewall", name:"Muraspina del Bastione", emoji:"🛡️", type:"shield", slot:"shield", rarity:"uncommon", price:52, description:"Massiccio e ruvido, fatto per inchiodare il fronte.", bonus_atk:1, bonus_def:3, bonus_mag:0, bonus_hp:10, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_mirrorwake_ward", name:"Schermo di Ondaspecchio", emoji:"🛡️", type:"shield", slot:"shield", rarity:"uncommon", price:56, description:"La superficie chiara confonde occhi e magie deboli.", bonus_atk:0, bonus_def:2, bonus_mag:1, bonus_hp:8, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_gloamwatch_pavis", name:"Pavese di Guardia del Vespro", emoji:"🛡️", type:"shield", slot:"shield", rarity:"rare", price:92, description:"Largo riparo per difensori di mura e convogli.", bonus_atk:0, bonus_def:3, bonus_mag:0, bonus_hp:14, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_saintglass_ward", name:"Schermo di Vetro Santo", emoji:"🛡️", type:"shield", slot:"shield", rarity:"rare", price:98, description:"Benedetto per proteggere maghi e guaritori in prima linea.", bonus_atk:0, bonus_def:3, bonus_mag:1, bonus_hp:12, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_blackthistle_guard", name:"Guardaspine Nera", emoji:"🛡️", type:"shield", slot:"shield", rarity:"rare", price:104, description:"Un bastione severo, ideale per tank ostinati.", bonus_atk:0, bonus_def:4, bonus_mag:0, bonus_hp:14, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_skybastion_rondel", name:"Rondella del Bastione Celeste", emoji:"🛡️", type:"shield", slot:"shield", rarity:"rare", price:108, description:"Resistente ma insolitamente agile nel polso.", bonus_atk:0, bonus_def:3, bonus_mag:0, bonus_hp:11, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_oracle_shell", name:"Conchiglia dell'Oracolo", emoji:"🔮", type:"shield", slot:"shield", rarity:"epic", price:188, description:"Uno schermo rituale che devia colpi e presagi neri.", bonus_atk:0, bonus_def:4, bonus_mag:2, bonus_hp:16, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_dawnbell_wall", name:"Muro della Campana dell'Alba", emoji:"🛡️", type:"shield", slot:"shield", rarity:"epic", price:194, description:"Scudo sacro che regge urti come un portale chiuso.", bonus_atk:0, bonus_def:4, bonus_mag:1, bonus_hp:18, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_granite_heart_barrier", name:"Barriera Cuore di Granito", emoji:"🛡️", type:"shield", slot:"shield", rarity:"epic", price:202, description:"Una lastra viva per chi avanza senza paura.", bonus_atk:0, bonus_def:5, bonus_mag:0, bonus_hp:20, bonus_init:-1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_crescent_vigil", name:"Vigilia Crescente", emoji:"🌙", type:"shield", slot:"shield", rarity:"epic", price:198, description:"Equilibrato tra protezione, magia e prontezza.", bonus_atk:0, bonus_def:4, bonus_mag:1, bonus_hp:16, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_worldroot_aegis", name:"Egida della Radice del Mondo", emoji:"🌳", type:"shield", slot:"shield", rarity:"legendary", price:356, description:"Legno primordiale che non conosce frattura.", bonus_atk:0, bonus_def:5, bonus_mag:1, bonus_hp:24, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"shield_lionthrone_guard", name:"Scudo del Trono del Leone", emoji:"👑", type:"shield", slot:"shield", rarity:"legendary", price:372, description:"Il grande scudo dei protettori del sangue reale.", bonus_atk:1, bonus_def:6, bonus_mag:0, bonus_hp:24, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"potion_morningdew_vial", name:"Fiala di Rugiada Mattutina", emoji:"🧪", type:"potion", slot:null, rarity:"common", price:16, description:"Una cura semplice e fresca per ripartire in fretta.", effect:"heal", value:12, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:12, available:true },
    { id:"potion_ironroot_brew", name:"Decotto di Radiceferro", emoji:"🧴", type:"potion", slot:null, rarity:"common", price:18, description:"Una mistura densa che rimette in sesto i più duri.", effect:"heal", value:16, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:16, available:true },
    { id:"potion_sunpetal_tonic", name:"Tonico di Petalosole", emoji:"🌼", type:"potion", slot:null, rarity:"common", price:20, description:"Lenisce corpo e spirito con un calore delicato.", effect:"heal", value:18, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:18, available:true },
    { id:"potion_scouts_breath", name:"Respiro dell'Esploratore", emoji:"🍃", type:"potion", slot:null, rarity:"common", price:22, description:"Un infuso rapido per chi vive di slancio e riflessi.", effect:"heal", value:14, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:14, available:true },
    { id:"potion_hearthblood_phial", name:"Ampolla Sangue del Focolare", emoji:"🔥", type:"potion", slot:null, rarity:"common", price:24, description:"Riscalda il petto e rimargina i colpi più recenti.", effect:"heal", value:20, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:20, available:true },
    { id:"potion_battlechant_draft", name:"Infuso del Canto di Guerra", emoji:"🎵", type:"potion", slot:null, rarity:"uncommon", price:30, description:"Una bevanda tonica usata prima delle cariche più dure.", effect:"heal", value:22, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:22, available:true },
    { id:"potion_bluefen_restore", name:"Ristoro di Palude Blu", emoji:"🧪", type:"potion", slot:null, rarity:"uncommon", price:32, description:"Un rimedio palustre che recupera sorprendentemente bene.", effect:"heal", value:24, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:24, available:true },
    { id:"potion_wardens_honey", name:"Miele del Custode", emoji:"🍯", type:"potion", slot:null, rarity:"uncommon", price:34, description:"Denso e prezioso, protegge anche mentre cura.", effect:"heal", value:24, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:24, available:true },
    { id:"potion_arcane_respite", name:"Sollievo Arcano", emoji:"✨", type:"potion", slot:null, rarity:"uncommon", price:36, description:"Un sorso brillante che rasserena mente e carne.", effect:"heal", value:22, bonus_atk:0, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:22, available:true },
    { id:"potion_hillborn_stout", name:"Stout dei Nati in Collina", emoji:"🍺", type:"potion", slot:null, rarity:"uncommon", price:38, description:"Ruvido ma efficace per chi deve restare in piedi.", effect:"heal", value:26, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:-1, weapon_die:null, heal_amount:26, available:true },
    { id:"potion_silverleaf_serum", name:"Siero di Foglia Argentea", emoji:"🧪", type:"potion", slot:null, rarity:"rare", price:52, description:"Un distillato fine per ferite che non concedono tregua.", effect:"heal", value:30, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:30, available:true },
    { id:"potion_guardcaptains_dose", name:"Dose del Capitano di Guardia", emoji:"🧴", type:"potion", slot:null, rarity:"rare", price:56, description:"Concepita per reggere il fronte un attimo più a lungo.", effect:"heal", value:32, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:32, available:true },
    { id:"potion_starlit_mercy", name:"Misericordia Stellata", emoji:"⭐", type:"potion", slot:null, rarity:"rare", price:60, description:"Un elisir chiaro che richiama forza e pace insieme.", effect:"heal", value:34, bonus_atk:0, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:34, available:true },
    { id:"potion_huntsmans_return", name:"Ritorno del Cacciatore", emoji:"🏹", type:"potion", slot:null, rarity:"rare", price:58, description:"Rimette in sesto arti e fiato dopo una fuga letale.", effect:"heal", value:30, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:30, available:true },
    { id:"potion_moonprayer_elixir", name:"Elisir della Preghiera Lunare", emoji:"🌙", type:"potion", slot:null, rarity:"epic", price:112, description:"Un rimedio sacro per chi non può cadere questa notte.", effect:"heal", value:42, bonus_atk:0, bonus_def:1, bonus_mag:1, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:42, available:true },
    { id:"potion_dragonsalve", name:"Balsamo del Drago", emoji:"🐉", type:"potion", slot:null, rarity:"epic", price:118, description:"Dà nuova forza anche ai guerrieri quasi spezzati.", effect:"heal", value:46, bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:46, available:true },
    { id:"potion_highclerics_blessing", name:"Benedizione dell'Alto Chierico", emoji:"⛪", type:"potion", slot:null, rarity:"epic", price:124, description:"Una fiala rituale che cura e rinsalda l'animo.", effect:"heal", value:48, bonus_atk:0, bonus_def:1, bonus_mag:1, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:48, available:true },
    { id:"potion_cometheart_cordial", name:"Cordial Cuore di Cometa", emoji:"☄️", type:"potion", slot:null, rarity:"epic", price:128, description:"Energia pura in bottiglia per gli ultimi istanti decisivi.", effect:"heal", value:50, bonus_atk:0, bonus_def:0, bonus_mag:1, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:50, available:true },
    { id:"potion_elixir_of_last_dawn", name:"Elisir dell'Ultima Alba", emoji:"☀️", type:"potion", slot:null, rarity:"legendary", price:220, description:"Dono rarissimo che strappa l'eroe al bordo della sconfitta.", effect:"heal", value:64, bonus_atk:0, bonus_def:1, bonus_mag:1, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:64, available:true },
    { id:"potion_royal_ambrosia", name:"Ambrosia Reale", emoji:"👑", type:"potion", slot:null, rarity:"legendary", price:240, description:"Una medicina sovrana conservata per i campioni del reame.", effect:"heal", value:72, bonus_atk:1, bonus_def:1, bonus_mag:1, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:72, available:true },
    { id:"accessory_brasswolf_clasp", name:"Fermaglio del Lupo d'Ottone", emoji:"🪙", type:"accessory", slot:"accessory", rarity:"common", price:20, description:"Un piccolo emblema per chi combatte in prima linea.", statBonus:{ atk:1 }, bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_mossknot_beads", name:"Grani di Nodo Muschiato", emoji:"📿", type:"accessory", slot:"accessory", rarity:"common", price:22, description:"Perline boschive che sostengono il corpo nel lungo viaggio.", statBonus:{ hp:4 }, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:4, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_swiftsparrow_pin", name:"Spilla del Passero Lesto", emoji:"🪶", type:"accessory", slot:"accessory", rarity:"common", price:24, description:"Una piuma lavorata per mani svelte e passi rapidi.", statBonus:{ init:1 }, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_chapel_thread", name:"Filo della Cappella", emoji:"🎗️", type:"accessory", slot:"accessory", rarity:"common", price:26, description:"Un nastro benedetto per sostenere chi protegge gli altri.", statBonus:{ def:1 }, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_cindercoin_medal", name:"Medaglia della Moneta di Brace", emoji:"🏅", type:"accessory", slot:"accessory", rarity:"common", price:28, description:"Un piccolo talismano per veterani di taverna e battaglia.", statBonus:{ atk:1, hp:2 }, bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:2, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_duelists_ribbon", name:"Nastro del Duellante", emoji:"🎗️", type:"accessory", slot:"accessory", rarity:"uncommon", price:40, description:"Leggero e fiero, premia riflessi e precisione.", statBonus:{ atk:1, init:1 }, bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_watchfire_locket", name:"Medaglione del Fuoco di Guardia", emoji:"🔥", type:"accessory", slot:"accessory", rarity:"uncommon", price:42, description:"Conserva una scintilla sempre desta nelle notti di ronda.", statBonus:{ hp:6 }, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:6, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_harvestmoon_charm", name:"Ciondolo della Luna del Raccolto", emoji:"🌙", type:"accessory", slot:"accessory", rarity:"uncommon", price:44, description:"Un portafortuna per guaritori, bardi e viandanti gentili.", statBonus:{ mag:1, hp:4 }, bonus_atk:0, bonus_def:0, bonus_mag:1, bonus_hp:4, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_ironprayer_band", name:"Fascia della Preghiera di Ferro", emoji:"💍", type:"accessory", slot:"accessory", rarity:"uncommon", price:46, description:"Offre fermezza a chi deve reggere la linea.", statBonus:{ def:1, hp:4 }, bonus_atk:0, bonus_def:1, bonus_mag:0, bonus_hp:4, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_gleamstep_anklet", name:"Cavigliera Passoluce", emoji:"✨", type:"accessory", slot:"accessory", rarity:"uncommon", price:48, description:"Brilla appena quando il corpo anticipa il pericolo.", statBonus:{ init:2 }, bonus_atk:0, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_stormscribe_seal", name:"Sigillo dello Scriba del Fulmine", emoji:"⚡", type:"accessory", slot:"accessory", rarity:"rare", price:74, description:"Un marchio carico di energia per studiosi battaglieri.", statBonus:{ mag:2, init:1 }, bonus_atk:0, bonus_def:0, bonus_mag:2, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_griffonspur_brooch", name:"Spilla Sprone del Grifone", emoji:"🦅", type:"accessory", slot:"accessory", rarity:"rare", price:78, description:"Simbolo di slancio e disciplina per guerrieri mobili.", statBonus:{ atk:2 }, bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_wintersaint_rosary", name:"Rosario del Santo d'Inverno", emoji:"📿", type:"accessory", slot:"accessory", rarity:"rare", price:82, description:"Preghiere fredde che rinforzano mente e corazza.", statBonus:{ def:1, mag:2 }, bonus_atk:0, bonus_def:1, bonus_mag:2, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_stonechorus_idol", name:"Idolo del Coro di Pietra", emoji:"🗿", type:"accessory", slot:"accessory", rarity:"rare", price:86, description:"Un piccolo idolo che dona presenza e tenacia al gruppo.", statBonus:{ def:2, hp:6 }, bonus_atk:0, bonus_def:2, bonus_mag:0, bonus_hp:6, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_sunwoven_circlet", name:"Cerchietto del Sole Intessuto", emoji:"👑", type:"accessory", slot:"accessory", rarity:"epic", price:164, description:"Corona leggera per guide luminose e maghi da supporto.", statBonus:{ mag:3, init:1 }, bonus_atk:0, bonus_def:0, bonus_mag:3, bonus_hp:0, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_battleheart_torque", name:"Torque Cuore di Battaglia", emoji:"🔗", type:"accessory", slot:"accessory", rarity:"epic", price:172, description:"Collare di guerra che rafforza coraggio e impatto.", statBonus:{ atk:2, hp:8 }, bonus_atk:2, bonus_def:0, bonus_mag:0, bonus_hp:8, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_veilwarden_orbit", name:"Orbita del Custode del Velo", emoji:"🔮", type:"accessory", slot:"accessory", rarity:"epic", price:178, description:"Un piccolo orbe flottante per maestri del controllo arcano.", statBonus:{ def:1, mag:3 }, bonus_atk:0, bonus_def:1, bonus_mag:3, bonus_hp:0, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_stagcrown_token", name:"Sigillo della Corona del Cervo", emoji:"🦌", type:"accessory", slot:"accessory", rarity:"epic", price:184, description:"Un simbolo nobile che unisce agilità, fierezza e precisione.", statBonus:{ atk:1, init:2 }, bonus_atk:1, bonus_def:0, bonus_mag:0, bonus_hp:0, bonus_init:2, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_starwell_heart", name:"Cuore del Pozzo Stellare", emoji:"⭐", type:"accessory", slot:"accessory", rarity:"legendary", price:312, description:"Una gemma viva che amplifica la volontà dei grandi eroi.", statBonus:{ atk:1, def:1, mag:3, hp:8 }, bonus_atk:1, bonus_def:1, bonus_mag:3, bonus_hp:8, bonus_init:1, weapon_die:null, heal_amount:0, available:true },
    { id:"accessory_oathkeepers_sigil", name:"Sigillo del Custode del Giuramento", emoji:"🛡️", type:"accessory", slot:"accessory", rarity:"legendary", price:328, description:"Emblema supremo per campioni che guidano e proteggono.", statBonus:{ atk:1, def:2, hp:10 }, bonus_atk:1, bonus_def:2, bonus_mag:1, bonus_hp:10, bonus_init:0, weapon_die:null, heal_amount:0, available:true },
  ];
}
const DEFAULT_ITEMS = buildDefaultItems();
const DEFAULT_ITEM_MAP = new Map(DEFAULT_ITEMS.map(item => [item.id, item]));
const DEFAULT_WEAPON = {
  id: "weapon_unarmed",
  name: "Pugni del Viandante",
  emoji: "👊",
  type: "weapon",
  slot: "weapon",
  rarity: "Base",
  description: "Quando sei disarmato, conti solo su tecnica e coraggio.",
  bonus_atk: 0,
  bonus_def: 0,
  bonus_mag: 0,
  bonus_hp: 0,
  bonus_init: 0,
  weapon_die: "1d4",
  heal_amount: 0,
  price: 0,
  available: false,
};

function mergeCatalogItems(items=[]) {
  const merged = new Map(DEFAULT_ITEMS.map(item => [item.id, item]));
  for(const item of items) {
    const base = merged.get(item.id) || {};
    merged.set(item.id, { ...base, ...item, slot:item.slot || base.slot || null, weapon_die:item.weapon_die || base.weapon_die || null, heal_amount:item.heal_amount || base.heal_amount || 0, bonus_init:item.bonus_init ?? base.bonus_init ?? 0 });
  }
  return Array.from(merged.values()).sort((a,b)=>a.name.localeCompare(b.name, "it"));
}
function itemSlot(item) {
  return item?.slot || (item?.type==="weapon" ? "weapon" : item?.type==="armor" ? "armor" : item?.type==="shield" ? "shield" : null);
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
function getStoredEquipment(playerId) {
  return lsGet(equipmentKey(playerId), { weapon:null, armor:null, shield:null });
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
  return {
    atk: cls.atk + race.atkB + (level - 1) * 2,
    def: cls.def + race.defB + (level - 1),
    mag: cls.mag + race.magB + (level - 1),
    init: cls.init + race.initB,
    maxHp: cls.hp + race.hpB + (level - 1) * 10,
  };
}
function getEquipmentBonuses(equipment, itemMap) {
  const ids = [equipment?.weapon, equipment?.armor, equipment?.shield].filter(Boolean);
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
    hp: Math.min(maxHp, Math.max(0, Number(player.hp) || maxHp)),
  };
}
function normalizeQuestChoices(choices) {
  if(Array.isArray(choices)) return choices;
  if(!choices || typeof choices !== "object") return [];
  return Object.entries(choices).map(([key, value]) => ({
    label: value?.label || key,
    ...value,
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
  return { ...quest, steps:(quest.steps || []).map(normalizeQuestStep) };
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
function getCombatDamageDie(actor) {
  if(actor?.weaponDie) return actor.weaponDie;
  if(actor?.isPlayer) return DEFAULT_WEAPON.weapon_die;
  if((actor?.atk || 0) >= 18) return "2d8";
  if((actor?.atk || 0) >= 12) return "1d10";
  if((actor?.atk || 0) >= 8) return "1d8";
  return "1d6";
}
function getCombatAttackBonus(actor) {
  return Math.max(1, Math.floor((actor?.atk || 0) / 3));
}
function resolveWeaponAttack(attacker, target, weaponDie) {
  const hitRoll = roll(20);
  const isCrit = hitRoll === 20;
  const attackBonus = getCombatAttackBonus(attacker);
  const attackTotal = hitRoll + attackBonus;
  const targetCa = Math.max(8, target?.def || 10);
  const hit = isCrit || attackTotal >= targetCa;
  const damageRoll = hit ? rollDice(weaponDie || "1d6") : 0;
  const damage = hit ? damageRoll + (isCrit ? damageRoll : 0) : 0;
  return { hitRoll, isCrit, attackBonus, attackTotal, targetCa, damageRoll, damage, weaponDie: weaponDie || "1d6" };
}
function formatWeaponAttackLog(attacker, target, resolved, weaponName, targetHpAfter, targetMaxHp) {
  const header = `${attacker?.emoji || "⭐"} **${attacker?.name}** attacca ${target?.emoji || "⭐"} **${target?.name}**`;
  const hitLine = `🎯 Tiro per colpire: **d20 ${resolved.hitRoll} + bonus ${resolved.attackBonus} = ${resolved.attackTotal}** contro CA **${resolved.targetCa}**`;
  if(!resolved.hit) return `${header}\n${hitLine}\n❌ **Mancato**`;
  const critNote = resolved.isCrit ? " — **CRITICO!**" : "";
  const dmgLine = `💥 Tiro danno: **${resolved.weaponDie} = ${resolved.damageRoll}**${resolved.isCrit ? `, critico => **${resolved.damage}**` : ` => **${resolved.damage}**`} con **${weaponName}**`;
  const hpLine = `❤️ ${target?.name}: ${targetHpAfter}/${targetMaxHp} HP`;
  return `${header}\n${hitLine}\n✅ **Colpisce**${critNote}\n${dmgLine}\n${hpLine}`;
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
function resolveDeathSave(combatant) {
  const rollValue = roll(20);
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
    return {
      rollValue,
      result: "stable",
      nextCombatant: { ...combatant, hp: 0, dying: false, stable: true, dead: false, deathSuccesses: successes, deathFailures: failures },
      log: `🛌 **${combatant.name}** ottiene la terza salvezza (${successes}/3) ed è **stabile**, ma resta a 0 HP.`,
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
  return {
    weapon:{ icon:"⚔️", title:"Arma", accent:"#ef4444", accent2:"#f59e0b", bg1:"#261019", bg2:"#09090b", border:"#7f1d1d" },
    armor:{ icon:"🛡️", title:"Armatura", accent:"#60a5fa", accent2:"#e2e8f0", bg1:"#102033", bg2:"#08111d", border:"#1d4ed8" },
    shield:{ icon:"🛡️", title:"Scudo", accent:"#22c55e", accent2:"#0ea5e9", bg1:"#0f221d", bg2:"#08110f", border:"#166534" },
    potion:{ icon:"🧪", title:"Pozione", accent:"#a855f7", accent2:"#f472b6", bg1:"#231236", bg2:"#120b1f", border:"#6d28d9" },
    accessory:{ icon:"💍", title:"Accessorio", accent:"#fbbf24", accent2:"#fb7185", bg1:"#2a1d0a", bg2:"#140f09", border:"#b45309" },
  }[item?.type] || { icon:item?.emoji || "⭐", title:"Oggetto", accent:"#fbbf24", accent2:"#7c3aed", bg1:"#172033", bg2:"#0b1120", border:"#334155" };
}
function getItemImage(item) {
  if(!item) return "";
  if(item.image) return item.image;
  if(item.image_url) return item.image_url;
  const theme = itemImageTheme(item);
  return makeArchetypeImage({ ...theme, icon:item.emoji || theme.icon, title:itemTypeLabel(item.type), subtitle:itemRarityLabel(item.rarity) });
}
function getPlayerPortrait(player) {
  if(!player) return "";
  if(player.portrait) return player.portrait;
  if(player.image) return player.image;
  const cls = CLASSES[player.class || "warrior"] || {};
  const race = RACES[player.race || "human"] || {};
  const classTheme = {
    warrior:{ accent:"#ef4444", accent2:"#f59e0b", bg1:"#2a1313", bg2:"#10090a", border:"#7f1d1d" },
    mage:{ accent:"#60a5fa", accent2:"#a855f7", bg1:"#111b35", bg2:"#080b16", border:"#3730a3" },
    priest:{ accent:"#fbbf24", accent2:"#f8fafc", bg1:"#2a2112", bg2:"#110d08", border:"#a16207" },
    ranger:{ accent:"#22c55e", accent2:"#34d399", bg1:"#13241a", bg2:"#09110c", border:"#166534" },
  }[player.class || "warrior"] || { accent:"#c084fc", accent2:"#60a5fa", bg1:"#171c2a", bg2:"#0b1020", border:"#334155" };
  return makeArchetypeImage({
    icon: cls.emoji || "🧙",
    title: cls.name || "Eroe",
    subtitle: race.name || "Avventuriero",
    ...classTheme,
  });
}
function getMonsterImage(monster) {
  if(!monster) return "";
  if(monster.image) return monster.image;
  if(monster.image_url) return monster.image_url;
  const key = `${monster.id || ""} ${monster.name || ""} ${monster.desc || ""}`.toLowerCase();
  const theme =
    /drago|dragon/.test(key) ? { icon:"🐉", title:"Drago", accent:"#ef4444", accent2:"#f59e0b", bg1:"#2b1010", bg2:"#120808", border:"#991b1b" } :
    /lich|scheletro|skeleton|spettro|vampir|undead|catacomb/.test(key) ? { icon:"💀", title:"Non-morto", accent:"#c4b5fd", accent2:"#60a5fa", bg1:"#19142c", bg2:"#090b16", border:"#5b21b6" } :
    /demone|demon/.test(key) ? { icon:"😈", title:"Demone", accent:"#fb7185", accent2:"#ef4444", bg1:"#2a0d18", bg2:"#13070c", border:"#9f1239" } :
    /golem|guardiano|guardian|titano|construct|runic/.test(key) ? { icon:"🗿", title:"Costrutto", accent:"#94a3b8", accent2:"#60a5fa", bg1:"#17202b", bg2:"#0a0f16", border:"#475569" } :
    /ragno|spider|serpente|hydra|lupo|wolf|ratto|boar|cervo|beast|slime|melma/.test(key) ? { icon:monster.emoji || "🐾", title:"Bestia", accent:"#22c55e", accent2:"#84cc16", bg1:"#142218", bg2:"#09110c", border:"#166534" } :
    /mago|strega|cultista|oracle|witch/.test(key) ? { icon:monster.emoji || "🪄", title:"Incantatore", accent:"#a855f7", accent2:"#60a5fa", bg1:"#1e1634", bg2:"#0b0b16", border:"#6d28d9" } :
    /goblin|orco|orc|gnoll|bandit|cobold|mercenario|knight|armigero/.test(key) ? { icon:monster.emoji || "🪓", title:"Predone", accent:"#f59e0b", accent2:"#ef4444", bg1:"#25160d", bg2:"#0f0908", border:"#92400e" } :
    monster.isBoss ? { icon:monster.emoji || "👑", title:"Boss", accent:"#fbbf24", accent2:"#fb7185", bg1:"#271915", bg2:"#110b09", border:"#b45309" } :
    { icon:monster.emoji || "👾", title:"Creatura", accent:"#60a5fa", accent2:"#22c55e", bg1:"#172033", bg2:"#0b1120", border:"#334155" };
  return makeArchetypeImage({ ...theme, subtitle:monster.isBoss ? "Boss" : `${monster.hp || 0} HP` });
}
function ArtThumb({ src, alt, size=56, radius=12 }) {
  return (
    <img
      src={src}
      alt={alt}
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
  await supabase.from("messages").insert({
    party_code: msg.party_code,
    author: msg.author,
    content: msg.content,
    type: msg.type || "chat",
  });
}

async function dbSavePlayer(p) {
  const { data, error } = await supabase.from("players").upsert({
    id: p.id, name: p.name, party_code: p.partyCode,
    account_id: p.accountId || null,
    class: p?.class || 'warrior', race: p?.race || 'human',
    hp: p?.hp || 0, max_hp: p?.maxHp || 0, atk: p?.atk || 0, def: p?.def || 0,
    mag: p?.mag || 0, init: p?.init || 1, xp: p?.xp || 0, level: p?.level || 1, gold: p?.gold || 0,
    dead: !!p?.dead,
    updated_at: new Date().toISOString(),
  }).select("id,account_id,dead").single();
  return { data, error };
}

async function dbGetPlayers(partyCode) {
  let query = supabase.from("players").select("*");
  if(partyCode) query = query.eq("party_code", partyCode);
  const { data } = await query;
  return (data || []).map(r => ({
    id: r?.id, name: r?.name, partyCode: r?.party_code,
    accountId: r?.account_id || null,
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
    class: r?.class || 'warrior', race: r?.race || 'human',
    hp: r?.hp || 0, maxHp: r?.max_hp || 0, atk: r?.atk || 0, def: r?.def || 0,
    mag: r?.mag || 0, init: r?.init || 1, xp: r?.xp || 0, level: r?.level || 1, gold: r?.gold || 0, dead: !!r?.dead,
  }));
}

async function dbGetMessages(partyCode) {
  let query = supabase.from("messages").select("*");
  if(partyCode) query = query.eq("party_code", partyCode);
  const { data } = await query.order("created_at", { ascending: true }).limit(partyCode ? 100 : 200);
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
  const { data, error } = await supabase.from("party_state").select("*").eq("party_code", partyCode).maybeSingle();
  if (error) throw error;
  if (!data) return { currentId: null, step: 0, active: false, completed: [], combat: null };
  return {
    currentId: data.quest_id,
    step: data.quest_step || 0,
    active: data.quest_active || false,
    completed: data.quest_completed || [],
    combat: data.combat || null,
  };
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
  await supabase.from("player_items").insert(payload);
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
async function dbDeleteCharacter(characterId) {
  await supabase.from("player_items").delete().eq("player_id", characterId);
  await supabase.from("players").delete().eq("id", characterId);
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
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.32)" }} />
      <div style={{ position:"relative", zIndex:1, color:"#e2d9c5", fontFamily:"'Cinzel',serif" }}>Caricamento...</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", fontFamily:"'Crimson Pro',Georgia,serif", color:"#e2d9c5", position:"relative" }}>
      {screen==="master" && <MasterPanelAuth setScreen={setScreen} authUser={authUser} />}
      {screen!=="master" && !authUser && <AuthScreen setAuthUser={setAuthUser} setScreen={setScreen} setMyId={setMyId} />}
      {screen!=="master" && authUser && screen==="landing" && <Landing setScreen={setScreen} goGame={goGame} myId={myId} authUser={authUser} setAuthUser={setAuthUser} />}
      {screen!=="master" && authUser && screen==="create"  && <CreateChar setScreen={setScreen} goGame={goGame} authUser={authUser} />}
      {screen!=="master" && authUser && screen==="game" && (
        <ErrorBoundary onReset={()=>setScreen("landing")}> 
          <GameScreen myId={myId} setScreen={setScreen} />
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
  const [success, setSuccess] = useState("");
  const meta = getMeta();

  async function handleAuth() {
    if(!email.trim()||!password.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    if(mode==="login") {
      const {data,error:e} = await supabase.auth.signInWithPassword({email,password});
      if(e) { setError("Email o password errati."); setLoading(false); return; }
      setAuthUser(data.user);
      const savedId = (localStorage.getItem("eoz_myId") || "").trim();
      if(savedId) setMyId(savedId);
      setScreen("landing");
    } else {
      const {error:e} = await supabase.auth.signUp({email,password});
      if(e) { setError(e.message); setLoading(false); return; }
      setSuccess("? Registrazione completata! Ora puoi accedere.");
      setMode("login");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
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
      </div>
    </div>
  );
}

/* ----------------------------------------------
   MASTER PANEL AUTH WRAPPER
---------------------------------------------- */
function MasterPanelAuth({ setScreen }) {
  const [pwd, setPwd] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(false);

  if(ok) return <MasterPanel setScreen={setScreen} />;

  return (
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
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
          onKeyDown={e=>e.key==="Enter"&&(pwd===MASTER_PASSWORD?setOk(true):setErr(true))}
        />
        {err && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12 }}>Password errata.</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <BigBtn onClick={()=>pwd===MASTER_PASSWORD?setOk(true):setErr(true)} gold icon="🗝️">Entra</BigBtn>
          <SmallBtn onClick={()=>setScreen("landing")}>← Torna alla home</SmallBtn>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   LANDING
---------------------------------------------- */
function Landing({ setScreen, goGame, myId, authUser, setAuthUser }) {
  const meta = getMeta();
  const [characters, setCharacters] = useState([]);
  const [loadingChars, setLoadingChars] = useState(true);

  async function loadCharacters() {
    if(!authUser?.id) { setCharacters([]); setLoadingChars(false); return; }
    setLoadingChars(true);
    try {
      const nextCharacters = await dbGetAccountCharacters(authUser.id);
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
    if(!window.confirm(`Eliminare definitivamente ${character.name}?`)) return;
    await dbDeleteCharacter(character.id);
    localStorage.removeItem(equipmentKey(character.id));
    if((localStorage.getItem("eoz_myId") || "").trim() === character.id) localStorage.removeItem("eoz_myId");
    await loadCharacters();
  }

  return (
    <div style={{ minHeight:"100vh", width:"100vw", background:"radial-gradient(at 15% 50%, rgba(109,40,217,0.3) 0%, rgba(0,0,0,0) 55%), radial-gradient(at 85% 30%, rgba(109,40,217,0.2) 0%, rgba(0,0,0,0) 50%), #06060e", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem 1rem" }}>
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
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {!dead && <BigBtn onClick={()=>goGame(ch)} gold icon="⚔️">Gioca</BigBtn>}
                    {dead && <SmallBtn red onClick={()=>handleDeleteCharacter(ch)}>Elimina</SmallBtn>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {authUser && <p style={{ marginTop:"1rem", color:"#374151", fontSize:"0.72rem" }}>Connesso come {authUser.email}</p>}
      <p style={{ marginTop:"1.5rem", color:"#1f2937", fontSize:"0.7rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.12em" }}>GDR TESTUALE • FANTASY • MULTIPLAYER ONLINE</p>
    </div>
  );
}

/* ----------------------------------------------
   CREATE CHARACTER
---------------------------------------------- */
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
    try {
      debugCharacterFlow("create_start", { accountId: authUser?.id || null, name: name.trim(), class: cls, race });
      const id = `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
      const partyCode = code.trim().toUpperCase() || Math.random().toString(36).slice(2,6).toUpperCase();
      const maxHp = c.hp + r.hpB;
      const player = {
        id, name:name.trim(), class:cls, race:race, partyCode,
        accountId: authUser?.id || null,
        hp:maxHp, maxHp, atk:c.atk+r.atkB, def:c.def+r.defB,
        mag:c.mag+r.magB, init:c.init+r.initB,
        xp:0, level:1, gold:0, dead:false,
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
      const charactersAfterSave = authUser?.id ? await dbGetAccountCharacters(authUser.id) : [];
      debugCharacterFlow("character_list_after_save", {
        accountId: authUser?.id || null,
        count: charactersAfterSave.length,
        ids: charactersAfterSave.map(ch => ch.id),
      });
      const meta = getMeta();
      await dbSendMessage({ party_code:partyCode, author:"Sistema", type:"system",
        content:`⚔️ **${player.name} il ${c.name}** � entrato nel mondo di **${meta.worldName}**! ${c.emoji}` });
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

  const steps = ["Nome","Classe","Razza","Party"];
  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:620, margin:"0 auto", padding:"1.5rem 1rem", minHeight:"100vh" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.5rem" }}>
        <button onClick={()=>setScreen("landing")} style={backBtnStyle}>? Indietro</button>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", margin:0 }}>Forgia il tuo Destino</h2>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:"1.5rem" }}>
        {steps.map((s,i)=>(
          <div key={s} onClick={()=>i<step&&setStep(i)} style={{ flex:1, padding:"0.4rem", textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:"0.68rem", letterSpacing:"0.06em", cursor:i<step?"pointer":"default", borderRadius:4, background:i===step?"rgba(109,40,217,0.35)":i<step?"rgba(109,40,217,0.15)":"rgba(255,255,255,0.02)", border:`1px solid ${i<=step?"#7c3aed":"#1f2937"}`, color:i<=step?"#c4b5fd":"#4b5563" }}>
            {i<step?"? ":""}{s}
          </div>
        ))}
      </div>

      {step===0 && (
        <Card title="✏️ Come ti chiamerai?">
          <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Il nome del tuo eroe..." maxLength={24} autoFocus onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(1)} />
          <div style={{ marginTop:"1rem" }}><BigBtn onClick={()=>name.trim()&&setStep(1)} gold disabled={!name.trim()}>Avanti ?</BigBtn></div>
        </Card>
      )}
      {step===1 && (
        <Card title="⚔️ Scegli la tua Classe">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
            {Object.entries(CLASSES).map(([k,v])=>(
              <button key={k} onClick={()=>setCls(k)} style={{ padding:"0.8rem 0.5rem", background:cls===k?"rgba(109,40,217,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${cls===k?v.color:"#1f2937"}`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:"1.8rem" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:cls===k?v.color:"#d1d5db", fontSize:"0.82rem" }}>{v.name}</strong>
                {cls===k && <div style={{ fontSize:"0.62rem", color:"#9ca3af", textAlign:"center" }}>❤️{v.hp} ⚔️{v.atk} 🛡️{v.def} ✨{v.mag}</div>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(0)}>? Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(2)} gold>Avanti ?</BigBtn>
          </div>
        </Card>
      )}
      {step===2 && (
        <Card title="🌍 Scegli la tua Razza">
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
            <SmallBtn onClick={()=>setStep(1)}>? Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(3)} gold>Avanti ?</BigBtn>
          </div>
        </Card>
      )}
      {step===3 && (
        <Card title="👥 Codice Party">
          <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #4c1d95", borderRadius:6, padding:"0.8rem", marginBottom:"1rem", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:"2rem" }}>{c.emoji}</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700 }}>{name||"Il tuo eroe"}</div>
              <div style={{ color:"#9ca3af", fontSize:"0.78rem" }}>{RACES[race].emoji} {RACES[race].name} � {c.name} � Lv.1</div>
              <div style={{ color:"#6b7280", fontSize:"0.7rem", marginTop:2 }}>❤️{c.hp+r.hpB} ⚔️{c.atk+r.atkB} 🛡️{c.def+r.defB} ✨{c.mag+r.magB}</div>
            </div>
          </div>
          <label style={labelStyle}>Codice Party</label>
          <input style={inputStyle} value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Inserisci il codice di un amico � o lascia vuoto" maxLength={8} />
          <p style={{ color:"#4b5563", fontSize:"0.75rem", margin:"6px 0 0", lineHeight:1.5 }}>Il codice party � la tua stanza online. Condividilo con i tuoi giocatori!</p>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(2)}>? Indietro</SmallBtn>
            <BigBtn onClick={create} gold icon="⭐" disabled={loading}>{loading?"Creando...":"Inizia l'Avventura!"}</BigBtn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ----------------------------------------------
   MASTER PANEL
---------------------------------------------- */
function MasterPanel({ setScreen }) {
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

  function saveAll() {
    saveMeta(meta); saveQuests(quests); saveMonsters(monsters);
    setSaved(true); setTimeout(()=>setSaved(false), 2200);
  }
  function handleLogo(e) {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>setMeta(m=>({...m,logo:ev.target.result})); r.readAsDataURL(f);
  }
  function addQuest() {
    const q={id:"q_"+Date.now(),title:"Nuova Missione",desc:"",flavor:"",difficulty:"facile",xpReward:200,goldReward:100,steps:[],enemies:[],active:true};
    setQuests(prev=>[...prev,q]); setEditQ({...q});
  }
  function saveEditQ() {
    const normalizedQuest = { ...editQ, difficulty: normalizeMissionDifficulty(editQ?.difficulty) };
    setQuests(prev=>prev.map(x=>x.id===normalizedQuest.id ? normalizedQuest : x));
    setEditQ(null);
  }
  function addStepToQ() {
    if(!newStep.trim()) return;
    setEditQ(q=>({...q,steps:[...q.steps,{ text:newStep.trim(), choices:{ good:{}, neutral:{}, bad:{} } }]}));
    setNewStep("");
  }
  function addEnemyToQ(monster) { setEditQ(q=>({...q,enemies:[...q.enemies,{...monster,maxHp:monster.hp,id:"e_"+Date.now()}]})); }
  function addMonster() {
    const m={id:"m_"+Date.now(),name:"Nuova Creatura",emoji:"🧩",hp:30,atk:8,def:3,xp:20,desc:"",isBoss:false};
    setMonsters(prev=>[...prev,m]); setEditM({...m});
  }
  function saveEditM() { setMonsters(prev=>prev.map(x=>x.id===editM.id?editM:x)); setEditM(null); }
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

  const TABS = [{k:"world",l:"🌍 Mondo"},{k:"quests",l:"📜 Missioni"},{k:"monsters",l:"👾 Bestiari"},{k:"players",l:"👥 Giocatori"},{k:"party",l:"🏰 Party"},{k:"chat",l:"📣 Broadcast"},{k:"market",l:"🏪 Market"},{k:"users",l:"👤 Iscritti"}];
  const EMOJIS=["🗡️","🛡️","🏹","🪄","🔮","💀","🧌","🐉","🧛","💪","⚔️","⭐","🐺","🦅","🌿","🔥","🧙","👹","🗿","😈"];

  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto", padding:"1rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.2rem", paddingBottom:"1rem", borderBottom:"1px solid #1f2937", flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.4rem", margin:0 }}>🛡️ Pannello Master</h1>
          <p style={{ color:"#4b5563", fontSize:"0.78rem", margin:0 }}>Gestisci missioni, creature e contenuti del mondo</p>
        </div>
        <BigBtn onClick={saveAll} gold icon={saved?"?":"⭐"}>{saved?"Salvato!":"Salva tutto"}</BigBtn>
        <SmallBtn onClick={()=>setScreen("landing")}>← Torna al menu</SmallBtn>
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
              {!masterLogs.length && <div style={{ color:"#6b7280", fontSize:"0.8rem" }}>Nessun log tecnico recente.</div>}
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
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <span style={{ color:"#6b7280", fontSize:"0.85rem" }}>{quests.length} missioni</span>
            <BigBtn onClick={addQuest} gold icon="?">+ Nuova Missione</BigBtn>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {quests.map(q=>(
              <div key={q.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${q.active?"#4c1d95":"#1f2937"}`, borderRadius:6, padding:"0.9rem 1rem" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700, fontSize:"1rem" }}>{q.title}</span>
                      <span style={{ padding:"1px 8px", border:`1px solid ${DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#6b7280" }}>{missionDifficultyLabel(q.difficulty)}</span>
                      {!q.active && <span style={{ fontSize:"0.65rem", color:"#4b5563", border:"1px solid #1f2937", borderRadius:3, padding:"1px 5px" }}>PAUSA</span>}
                    </div>
                    <p style={{ color:"#6b7280", fontSize:"0.8rem", margin:"0 0 6px" }}>{q.desc||"Nessuna descrizione."}</p>
                    <div style={{ display:"flex", gap:14, fontSize:"0.72rem", color:"#4b5563" }}>
                      <span>⭐ {q.xpReward} XP</span><span>💰 {q.goldReward} oro</span>
                      <span>🎭 {q.steps.length} scene</span><span>👾 {q.enemies.length} nemici</span>
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
              <div><label style={labelStyle}>Titolo</label><input style={inputStyle} value={editQ.title} onChange={e=>setEditQ(q=>({...q,title:e.target.value}))} /></div>
              <div><label style={labelStyle}>Difficolt�</label>
                <select style={{...inputStyle,cursor:"pointer"}} value={normalizeMissionDifficulty(editQ.difficulty)} onChange={e=>setEditQ(q=>({...q,difficulty:e.target.value}))}>
                  <option value="facile">Facile</option>
                  <option value="difficile">Difficile</option>
                  <option value="speciale">Speciale</option>
                </select>
              </div>
              <div><label style={labelStyle}>XP</label><input style={inputStyle} type="number" value={editQ.xpReward} onChange={e=>setEditQ(q=>({...q,xpReward:+e.target.value}))} /></div>
              <div><label style={labelStyle}>Oro</label><input style={inputStyle} type="number" value={editQ.goldReward} onChange={e=>setEditQ(q=>({...q,goldReward:+e.target.value}))} /></div>
            </div>
            <label style={{...labelStyle,marginTop:10}}>Descrizione</label>
            <textarea style={{...inputStyle,height:75,resize:"vertical"}} value={editQ.desc} onChange={e=>setEditQ(q=>({...q,desc:e.target.value}))} placeholder="Descrivi la missione..." />
            <label style={{...labelStyle,marginTop:10}}>Citazione narrativa</label>
            <textarea style={{...inputStyle,height:52,resize:"vertical"}} value={editQ.flavor} onChange={e=>setEditQ(q=>({...q,flavor:e.target.value}))} placeholder="�Una frase epica...�" />
          </Card>
          <Card title="🎭 Scene della Missione">
            <p style={{ color:"#4b5563", fontSize:"0.75rem", marginBottom:10 }}>Ogni scena viene narrata quando i giocatori digitano <strong style={{color:"#a78bfa"}}>avanza</strong>. Puoi usare **grassetto** e *corsivo*.</p>
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
                    <span style={{ color:"#4b5563", fontSize:"0.8rem", minWidth:22, paddingTop:10 }}>{i+1}.</span>
                    <textarea style={{...inputStyle,flex:1,height:60,resize:"vertical",fontSize:"0.85rem"}} value={step.text}
                      onChange={e=>updateStep({ text: e.target.value })} />
                    <div style={{ display:"flex", flexDirection:"column", gap:3, paddingTop:2 }}>
                      <button onClick={()=>{ const st=[...editQ.steps]; if(i>0){[st[i],st[i-1]]=[st[i-1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} style={iconBtnStyle}>?</button>
                      <button onClick={()=>{ const st=[...editQ.steps]; if(i<st.length-1){[st[i],st[i+1]]=[st[i+1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} style={iconBtnStyle}>?</button>
                      <button onClick={()=>setEditQ(q=>({...q,steps:q.steps.filter((_,j)=>j!==i)}))} style={{...iconBtnStyle,color:"#f87171"}}>?</button>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:6 }}>
                    {[
                      ["good","? Buona"],
                      ["neutral","? Media"],
                      ["bad","? Sbagliata"],
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
                  <span style={{ color:"#4b5563", fontSize:"0.72rem" }}>❤️{en.hp} ⚔️{en.atk} 🛡️{en.def} ⭐{en.xp}xp</span>
                  <button onClick={()=>setEditQ(q=>({...q,enemies:q.enemies.filter((_,j)=>j!==i)}))} style={{ marginLeft:"auto", ...iconBtnStyle, color:"#f87171" }}>?</button>
                </div>
              ))}
            </div>
            <p style={{ color:"#4b5563", fontSize:"0.75rem", marginBottom:8 }}>Aggiungi dal bestiario:</p>
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

      {tab==="monsters" && !editM && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <span style={{ color:"#6b7280", fontSize:"0.85rem" }}>{monsters.length} creature</span>
            <BigBtn onClick={addMonster} gold icon="?">+ Nuova Creatura</BigBtn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:8 }}>
            {monsters.map(m=>(
              <div key={m.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${m.isBoss?"#92400e":"#1f2937"}`, borderRadius:6, padding:"0.8rem" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                  <ArtThumb src={getMonsterImage(m)} alt={m.name} size={68} radius={16} />
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", color:m.isBoss?"#fbbf24":"#e2d9c5", fontWeight:700 }}>{m.name}{m.isBoss?" ⭐":""}</div>
                    <div style={{ color:"#4b5563", fontSize:"0.68rem" }}>{m.desc}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, fontSize:"0.73rem", color:"#6b7280", marginBottom:8 }}>
                  <span>❤️{m.hp}</span><span>⚔️{m.atk}</span><span>🛡️{m.def}</span><span>⭐{m.xp}xp</span>
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
              <div><label style={labelStyle}>XP</label><input style={inputStyle} type="number" value={editM.xp} onChange={e=>setEditM(m=>({...m,xp:+e.target.value}))} /></div>
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

      {tab==="players" && <PlayersView />}
      {tab==="party" && <PartiesView />}
      {tab==="market" && <MarketView />}
      {tab==="users" && <UsersView />}
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
      <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1rem" }}>{players.length} avventurieri � aggiornamento automatico</p>
      {!players.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun giocatore ancora.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {players.map(p=>{ const cls=CLASSES[p?.class||'warrior']||{}; const race=RACES[p?.race||'human']||{};
          const baseHp = (cls.hp||0) + (race.hpB||0);
          const baseAtk = (cls.atk||0) + (race.atkB||0);
          const baseDef = (cls.def||0) + (race.defB||0);
          const baseMag = (cls.mag||0) + (race.magB||0);
          return (
            <div key={p?.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                <ArtThumb src={getPlayerPortrait({ class:p?.class, race:p?.race, portrait:p?.portrait, image:p?.image })} alt={p?.name || "Giocatore"} size={64} radius={16} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{p?.name}</div>
                  <div style={{ color:"#4b5563", fontSize:"0.68rem" }}>{race.emoji} {race.name} � {cls.name} � Lv.{p?.level||1}</div>
                </div>
                <span style={{ padding:"2px 7px", background:"#3b0764", borderRadius:3, fontSize:"0.68rem", color:"#c4b5fd" }}>Lv.{p?.level||1}</span>
              </div>
              <HpBar cur={p?.hp||0} max={p?.max_hp||0} />
              <div style={{ display:"flex", gap:10, fontSize:"0.72rem", color:"#6b7280", marginTop:5 }}>
                <span>⭐{p?.xp||0}/{xpForLevel(p?.level||1)}XP</span><span>💰{p?.gold||0}oro</span><span>🆔{p?.party_code||""}</span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
                <SmallBtn onClick={async()=>{
                  const upd={...p, level:1, xp:0, gold:0, hp:baseHp, max_hp:baseHp, atk:baseAtk, def:baseDef, mag:baseMag};
                  await dbSavePlayer(upd);
                  setPlayers(prev=>prev.map(x=>x.id===p.id?upd:x));
                }}>🔄 Reset PG</SmallBtn>
                <SmallBtn onClick={async()=>{
                  const upd={...p, hp:p.max_hp};
                  await dbSavePlayer(upd);
                  setPlayers(prev=>prev.map(x=>x.id===p.id?upd:x));
                }}>❤️ Cura Tutto</SmallBtn>
                <SmallBtn onClick={async()=>{
                  const add = parseInt(window.prompt("Quanto oro aggiungere?", "0"),10);
                  if(!add||isNaN(add)) return;
                  const upd={...p, gold:(p.gold||0)+add};
                  await dbSavePlayer(upd);
                  setPlayers(prev=>prev.map(x=>x.id===p.id?upd:x));
                }}>💰 Dai Oro</SmallBtn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Party management for each party */}
    </div>
  );
}

function PartiesView() {
  const [parties, setParties] = useState([]);
  const [partyPlayers, setPartyPlayers] = useState({});
  const [working, setWorking] = useState({});
  const [banTarget, setBanTarget] = useState({});
  const [error, setError] = useState(null);

  useEffect(()=>{
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from("players").select("id,name,party_code,class");
      if(error) { setError(error.message || "Impossibile caricare i party"); return; }
      if(!active) return;
      const codes = Array.from(new Set((data||[]).map(r=>r.party_code).filter(Boolean)));
      setParties(codes);
      const grouped = {};
      for(const p of (data||[])) {
        if(!p.party_code) continue;
        if(!grouped[p.party_code]) grouped[p.party_code] = [];
        grouped[p.party_code].push(p);
      }
      setPartyPlayers(grouped);
    };
    load();
    const interval = setInterval(load, 5000);
    return ()=>{ active=false; clearInterval(interval); };
  },[]);

  const handleAction = async (partyCode, action) => {
    setWorking(w=>({ ...w, [partyCode]: action }));
    try {
      if(action === "combat") await resetPartyCombat(partyCode);
      if(action === "campaign") await resetPartyCampaign(partyCode);
      if(action === "delete") { await deleteParty(partyCode); setParties(prev=>prev.filter(c=>c!==partyCode)); }
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
      setPartyPlayers(prev=>({...prev,[partyCode]:(prev[partyCode]||[]).filter(p=>p.id!==pid)}));
      setBanTarget(prev=>({...prev,[partyCode]:""}));
    } finally { setWorking(w=>({...w,[partyCode]:null})); }
  };

  const dangerBtn = { background:"#dc2626", color:"white", fontWeight:"bold", padding:"8px 16px", borderRadius:"6px", margin:"4px", border:"none", cursor:"pointer", fontSize:"0.82rem" };

  return (
    <div>
      <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1rem" }}>{parties.length} party trovati � aggiornamento automatico</p>
      {error && <div style={{ color:"#fca5a5", marginBottom:"1rem" }}>{error}</div>}
      {!parties.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun party ancora.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:10 }}>
        {parties.map(code=>(
          <div key={code} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, marginBottom:6 }}>Party: {code}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <SmallBtn disabled={!!working[code]} onClick={()=>handleAction(code, "combat")}>💀 Reset Combattimento</SmallBtn>
              <SmallBtn disabled={!!working[code]} onClick={()=>{ if(window.confirm("Resetta chat e stato combattimento?")) handleAction(code, "campaign"); }}>🔄 Reset Campagna</SmallBtn>
              <SmallBtn red disabled={!!working[code]} onClick={()=>{ if(window.confirm("Eliminare completamente questo party?")) handleAction(code, "delete"); }}>🗑️ Elimina Party</SmallBtn>
            </div>
            {working[code] && <div style={{ marginTop:8, color:"#a78bfa", fontSize:"0.78rem" }}>In corso: {working[code]}...</div>}
            <div style={{ marginTop:12, background:"#1a0000", border:"1px solid #dc2626", borderRadius:6, padding:"0.8rem" }}>
              <div style={{ color:"#dc2626", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", fontWeight:700, marginBottom:8, letterSpacing:"0.05em" }}>⚠️ Azioni Pericolose</div>
              <div style={{ display:"flex", flexWrap:"wrap" }}>
                <button disabled={!!working[code]} onClick={()=>handleResetStoria(code)} style={dangerBtn}>🔥 Reset Storia Completo</button>
                <button disabled={!!working[code]} onClick={()=>handleTerminaCombattimento(code)} style={dangerBtn}>💀 Termina Combattimento</button>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:4 }}>
                <select value={banTarget[code]||""} onChange={e=>setBanTarget(prev=>({...prev,[code]:e.target.value}))}
                  style={{ flex:1, background:"#0a0000", border:"1px solid #7f1d1d", color:"#e2d9c5", padding:"6px 8px", borderRadius:4, fontSize:"0.82rem" }}>
                  <option value="">Seleziona giocatore...</option>
                  {(partyPlayers[code]||[]).map(p=>(
                    <option key={p.id} value={p.id}>{p.name} ({CLASSES[p.class]?.name||p.class})</option>
                  ))}
                </select>
                <button disabled={!!working[code]} onClick={()=>handleBanna(code)} style={dangerBtn}>🚫 Banna</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let active = true;
    const load = async () => {
      setLoading(true);
      const { data, error: playersErr } = await supabase.from("players").select("id,name,party_code");
      if(!active) return;
      if(playersErr) {
        setError(playersErr.message || "Impossibile caricare gli iscritti");
        setUsers([]);
      } else {
        setError(null);
        setUsers((data||[]).map(p=>({ id:p.id, email:p.name, party_code:p.party_code })));
      }
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 5000);
    return ()=>{ active = false; clearInterval(interval); };
  },[]);

  return (
    <div>
      <div style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1rem" }}>Elenco dei profili giocatore registrati nel database pubblico.</div>
      {error && <div style={{ color:"#fca5a5", marginBottom:"1rem" }}>{error}</div>}
      {loading && <div style={{ color:"#6b7280" }}>Caricamento...</div>}
      {!loading && !users.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun iscritto trovato.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {users.map(u=>(
          <div key={u.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{u.email||u.id}</div>
            {u.party_code && <div style={{ fontSize:"0.75rem", color:"#6b7280" }}>Party: {u.party_code}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketView() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    const load = async () => { setLoading(true); setItems(await dbGetItems()); setLoading(false); };
    load();
  },[]);

  const save = async (item) => {
    await dbSaveItem(item);
    setSaved(true);
    setTimeout(()=>setSaved(false),2200);
    setEditItem(null);
    setItems(await dbGetItems());
  };

  const remove = async (itemId) => {
    if(!window.confirm("Eliminare questo oggetto dal catalogo?")) return;
    await dbDeleteItem(itemId);
    setItems(prev=>prev.filter(i=>i.id!==itemId));
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, color:"#e2d9c5" }}>🏪 Market</div>
          <div style={{ fontSize:"0.85rem", color:"#6b7280" }}>{items.length} oggetti</div>
        </div>
        <BigBtn onClick={()=>setEditItem({id:`i_${Date.now()}`,name:"",emoji:"",type:"weapon",description:"",bonus_atk:0,bonus_def:0,bonus_mag:0,bonus_hp:0,price:100,available:true})} gold icon="?">+ Nuovo</BigBtn>
      </div>

      {loading && <div style={{ color:"#6b7280" }}>Caricamento...</div>}

      {editItem && (
        <Card title={editItem.id?"Modifica Oggetto":"Nuovo Oggetto"}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div><label style={labelStyle}>Nome</label><input style={inputStyle} value={editItem.name} onChange={e=>setEditItem(i=>({...i,name:e.target.value}))} /></div>
            <div><label style={labelStyle}>Emoji</label><input style={inputStyle} value={editItem.emoji} onChange={e=>setEditItem(i=>({...i,emoji:e.target.value}))} /></div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select style={{...inputStyle,cursor:"pointer"}} value={editItem.type} onChange={e=>setEditItem(i=>({...i,type:e.target.value}))}>
                <option value="weapon">Arma</option>
                <option value="armor">Armatura</option>
                <option value="accessory">Accessorio</option>
              </select>
            </div>
            <div><label style={labelStyle}>Prezzo</label><input style={inputStyle} type="number" value={editItem.price} onChange={e=>setEditItem(i=>({...i,price:+e.target.value}))} /></div>
          </div>
          <label style={{...labelStyle,marginTop:10}}>Descrizione</label>
          <textarea style={{...inputStyle,height:70,resize:"vertical"}} value={editItem.description} onChange={e=>setEditItem(i=>({...i,description:e.target.value}))} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginTop:10 }}>
            <div><label style={labelStyle}>Bonus ATK</label><input style={inputStyle} type="number" value={editItem.bonus_atk} onChange={e=>setEditItem(i=>({...i,bonus_atk:+e.target.value}))} /></div>
            <div><label style={labelStyle}>Bonus DEF</label><input style={inputStyle} type="number" value={editItem.bonus_def} onChange={e=>setEditItem(i=>({...i,bonus_def:+e.target.value}))} /></div>
            <div><label style={labelStyle}>Bonus MAG</label><input style={inputStyle} type="number" value={editItem.bonus_mag} onChange={e=>setEditItem(i=>({...i,bonus_mag:+e.target.value}))} /></div>
            <div><label style={labelStyle}>Bonus HP</label><input style={inputStyle} type="number" value={editItem.bonus_hp} onChange={e=>setEditItem(i=>({...i,bonus_hp:+e.target.value}))} /></div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:12 }}>
            <BigBtn onClick={()=>save(editItem)} gold icon="⭐">Salva</BigBtn>
            <SmallBtn onClick={()=>setEditItem(null)}>Annulla</SmallBtn>
          </div>
        </Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10 }}>
        {items.map(it=>(
          <div key={it.id} style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:6, padding:"0.8rem" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:"1.5rem" }}>{it.emoji||"⭐"}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{it.name}</div>
                <div style={{ fontSize:"0.72rem", color:"#6b7280" }}>{it.type}</div>
              </div>
              <SmallBtn onClick={()=>setEditItem(it)}>✏️</SmallBtn>
              <SmallBtn red onClick={()=>remove(it.id)}>🗑️</SmallBtn>
            </div>
            <div style={{ fontSize:"0.75rem", color:"#4b5563", marginBottom:6 }}>{it.description}</div>
            <div style={{ display:"flex", gap:8, fontSize:"0.72rem", color:"#6b7280" }}>
              <span>⚔️+{it.bonus_atk||0}</span><span>🛡️+{it.bonus_def||0}</span><span>✨+{it.bonus_mag||0}</span><span>❤️+{it.bonus_hp||0}</span>
            </div>
            <div style={{ marginTop:8, fontSize:"0.75rem", color:"#c4b5fd" }}>💰 {it.price} oro</div>
          </div>
        ))}
      </div>
      {saved && <div style={{ position:"fixed", bottom:16, right:16, padding:"0.8rem 1rem", background:"rgba(52,211,153,0.15)", border:"1px solid #065f46", borderRadius:6, color:"#065f46" }}>Salvataggio completato!</div>}
    </div>
  );
}

function ShopView({ me, items, loading, error, inventoryCounts, onBuy }) {
  const [category, setCategory] = useState("all");
  const categoryOptions = [
    { id:"all", label:"Tutto" },
    { id:"weapon", label:"Armi" },
    { id:"armor", label:"Armature" },
    { id:"shield", label:"Scudi" },
    { id:"potion", label:"Pozioni" },
    { id:"accessory", label:"Accessori" },
  ];
  const visibleItems = category === "all"
    ? items
    : items.filter(item => item.type === category);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0 }}>🛒 Negozio</h3>
        <div style={{ padding:"0.4rem 0.65rem", background:"rgba(180,83,9,0.12)", border:"1px solid #78350f", borderRadius:999, color:"#fbbf24", fontSize:"0.8rem", fontWeight:700, whiteSpace:"nowrap" }}>
          💰 Oro: {me?.gold || 0}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"1rem" }}>
        {categoryOptions.map(option => (
          <button
            key={option.id}
            onClick={()=>setCategory(option.id)}
            style={{
              padding:"0.45rem 0.85rem",
              background:category===option.id ? "rgba(109,40,217,0.28)" : "rgba(255,255,255,0.03)",
              border:`1px solid ${category===option.id ? "#7c3aed" : "#1f2937"}`,
              borderRadius:999,
              color:category===option.id ? "#ddd6fe" : "#6b7280",
              cursor:"pointer",
              fontFamily:"'Cinzel',serif",
              fontSize:"0.75rem",
              letterSpacing:"0.04em",
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      {loading && <div style={{ color:"#6b7280" }}>Caricamento...</div>}
      {error && <div style={{ color:"#fca5a5" }}>{error}</div>}
      {!loading && !visibleItems.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun oggetto disponibile in questa categoria.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {visibleItems.map(it=>(
          <div key={it.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
              <ArtThumb src={getItemImage(it)} alt={it.name} size={60} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{it.name}</div>
                <div style={{ fontSize:"0.72rem", color:"#6b7280" }}>{itemTypeLabel(it.type)} • {itemRarityLabel(it.rarity)}</div>
              </div>
              <span style={{ fontSize:"0.85rem", color:"#c4b5fd" }}>💰 {it.price}</span>
            </div>
            <div style={{ fontSize:"0.75rem", color:"#4b5563", marginBottom:6 }}>{it.description}</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#6b7280", marginBottom:8 }}>
              {itemStatSummary(it).map(stat => <span key={stat}>{stat}</span>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
              <BigBtn onClick={()=>onBuy(it)} gold icon="⭐" disabled={!me || me.gold < (it.price||0)}>Compra</BigBtn>
              {!!inventoryCounts?.[it.id] && <span style={{ fontSize:"0.72rem", color:"#6ee7b7" }}>Ne possiedi {inventoryCounts[it.id]}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryView({ loading, groups, equipment, selectedItem, onSelectItem, onCloseItem, onEquip, onSell, onUse, canUseConsumables }) {
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🎒 Inventario</h3>
      {loading && <div style={{ color:"#6b7280" }}>Caricamento...</div>}
      {!loading && !groups.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Inventario vuoto. Saccheggia o compra qualcosa.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:10 }}>
        {groups.map(group=>{
          const slot = itemSlot(group.item);
          const equipped = !!slot && equipment?.[slot] === group.item.id;
          const selected = selectedItem?.item?.id === group.item.id;
          return (
            <button
              key={group.item.id}
              onClick={()=>onSelectItem(group)}
              style={{
                textAlign:"left",
                background:PANEL_BG,
                border:`1px solid ${selected ? "#7c3aed" : equipped ? "#b45309" : PANEL_BORDER}`,
                borderRadius:6,
                padding:"0.8rem",
                cursor:"pointer",
                color:"inherit",
                font:"inherit",
                boxShadow:selected ? "0 0 0 1px rgba(124,58,237,0.35) inset" : "none",
              }}
            >
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                <ArtThumb src={getItemImage(group.item)} alt={group.item.name} size={62} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{group.item.name}</div>
                  <div style={{ fontSize:"0.72rem", color:"#6b7280" }}>{itemTypeLabel(group.item.type)} • {itemRarityLabel(group.item.rarity)}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span style={{ fontSize:"0.78rem", color:"#c4b5fd", fontWeight:700 }}>x{group.quantity}</span>
                  {equipped && <span style={{ fontSize:"0.66rem", color:"#fbbf24" }}>Equip.</span>}
                </div>
              </div>
              <div style={{ fontSize:"0.75rem", color:"#4b5563", marginBottom:6 }}>{group.item.description}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#6b7280", marginBottom:10 }}>
                {itemStatSummary(group.item).map(stat => <span key={stat}>{stat}</span>)}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#9ca3af" }}>
                <span>Quantità: {group.quantity}</span>
                <span>Valore: {group.item.price || 0} oro</span>
                <span style={{ color:"#6b7280" }}>Clicca per ispezionare</span>
              </div>
            </button>
          );
        })}
      </div>
      {!!selectedItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(2,6,23,0.78)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", zIndex:50 }} onClick={onCloseItem}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"min(560px,100%)", background:"linear-gradient(180deg, rgba(17,24,39,0.98), rgba(10,10,18,0.98))", border:"1px solid #312e81", borderRadius:10, boxShadow:"0 24px 80px rgba(0,0,0,0.45)", padding:"1rem" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
              <ArtThumb src={getItemImage(selectedItem.item)} alt={selectedItem.item.name} size={92} radius={16} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#f8e7b9", fontSize:"1.15rem", fontWeight:700 }}>{selectedItem.item.name}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6, fontSize:"0.75rem" }}>
                  <span style={{ color:"#9ca3af" }}>{itemTypeLabel(selectedItem.item.type)}</span>
                  <span style={{ color:"#c4b5fd" }}>{itemRarityLabel(selectedItem.item.rarity)}</span>
                  <span style={{ color:"#6ee7b7" }}>Quantità: {selectedItem.quantity}</span>
                  {!!itemSlot(selectedItem.item) && equipment?.[itemSlot(selectedItem.item)] === selectedItem.item.id && <span style={{ color:"#fbbf24" }}>Equipaggiato</span>}
                </div>
              </div>
            </div>
            <div style={{ color:"#cbd5e1", fontSize:"0.92rem", lineHeight:1.6, marginBottom:12 }}>
              {selectedItem.item.description}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
              {itemStatSummary(selectedItem.item).map(stat => (
                <span key={stat} style={{ fontSize:"0.76rem", color:"#d1d5db", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:999, padding:"4px 8px" }}>
                  {stat}
                </span>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, color:"#9ca3af", fontSize:"0.82rem" }}>
              <span>💰 Valore: {selectedItem.item.price || 0} oro</span>
              <span>Copie possedute: {selectedItem.quantity}</span>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
              {isEquippableItem(selectedItem.item) && (
                <BigBtn
                  onClick={()=>onEquip(selectedItem.entries[0])}
                  gold
                  disabled={equipment?.[itemSlot(selectedItem.item)] === selectedItem.item.id}
                >
                  Equipaggia
                </BigBtn>
              )}
              {selectedItem.item.type === "potion" && canUseConsumables && (
                <BigBtn onClick={()=>onUse(selectedItem.entries[0])} gold icon="🧪">
                  Usa
                </BigBtn>
              )}
              <SmallBtn onClick={()=>onSell(selectedItem)}>Vendi</SmallBtn>
              <SmallBtn onClick={onCloseItem}>Chiudi</SmallBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EquipmentView({ me, equippedItems, equippedWeapon, onUnequip }) {
  const slots = [
    { key:"weapon", label:"Arma", fallback:"Nessuna arma equipaggiata" },
    { key:"armor", label:"Armatura", fallback:"Nessuna armatura equipaggiata" },
    { key:"shield", label:"Scudo", fallback:"Nessuno scudo equipaggiato" },
  ];
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🎽 Equipaggiamento</h3>
      <Card title="Statistiche Attive">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:8, color:"#e2d9c5" }}>
          <div>⚔️ ATK: {me.atk}</div>
          <div>🛡️ CA: {me.def}</div>
          <div>✨ MAG: {me.mag}</div>
          <div>🦶 DEX: {me.init}</div>
          <div>❤️ HP Max: {me.maxHp}</div>
          <div>🎲 Arma: {equippedWeapon.weapon_die}</div>
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:10 }}>
        {slots.map(slot=>{
          const item = equippedItems[slot.key];
          return (
            <div key={slot.key} style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:6, padding:"0.8rem" }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:8 }}>{slot.label}</div>
              {item ? (
                <>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontSize:"1.6rem" }}>{item.emoji}</span>
                    <div>
                      <div style={{ color:"#e2d9c5", fontWeight:700 }}>{item.name}</div>
                      <div style={{ fontSize:"0.72rem", color:"#6b7280" }}>{itemRarityLabel(item.rarity)} • {itemTypeLabel(item.type)}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#6b7280", marginBottom:10 }}>
                    {itemStatSummary(item).map(stat => <span key={stat}>{stat}</span>)}
                  </div>
                  <SmallBtn red onClick={()=>onUnequip(slot.key)}>Rimuovi</SmallBtn>
                </>
              ) : (
                <div style={{ color:"#4b5563", fontSize:"0.82rem" }}>{slot.fallback}</div>
              )}
            </div>
          );
        })}
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
   GAME SCREEN
---------------------------------------------- */

/* ----------------------------------------------
   GAME SCREEN
---------------------------------------------- */
function GameScreen({ myId, setScreen }) {
  const [me, setMeRaw] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partyPlayers, setPartyPlayers] = useState([]);
  const [qs, setQs] = useState({ currentId:null, step:0, active:false, completed:[], combat:null });
  const [input, setInput] = useState("");
  const [diceAnim, setDiceAnim] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [spellMenu, setSpellMenu] = useState(false);
  const [tab, setTab] = useState("chat");
  const [lootedStepKey, setLootedStepKey] = useState(null);
  const [catalogItems, setCatalogItems] = useState(DEFAULT_ITEMS);
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({ weapon:null, armor:null, shield:null, accessory:null });
  const [preparedSpellIds, setPreparedSpellIds] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState(null);
  const [deathScene, setDeathScene] = useState(null);
  const msgEnd = useRef(null);
  const inputRef = useRef(null);
  const subRef = useRef(null);
  const itemMapRef = useRef(DEFAULT_ITEM_MAP);
  const startCombatStepRef = useRef(null);

  async function showDiceVisual({ sides, value, label, rollingMs = 450, resultMs = 850 }) {
    setDiceResult({ stage:"rolling", sides, value:null, label });
    setDiceAnim(true);
    await new Promise(resolve => setTimeout(resolve, rollingMs));
    setDiceResult({ stage:"result", sides, value, label });
    setDiceAnim(false);
    await new Promise(resolve => setTimeout(resolve, resultMs));
    setDiceResult(null);
  }
  async function triggerSoloDeath(finalName) {
    setDeathScene({ name: finalName || me?.name || "Eroe caduto" });
    try {
      const fallenPlayer = { ...me, hp:0, dead:true };
      await dbSavePlayer(fallenPlayer);
      setMeRaw(fallenPlayer);
      if(code) {
        await dbSavePartyState(code, { ...qs, combat:null });
        setQs(prev => ({ ...prev, combat:null }));
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
      setQs({ currentId:null, step:0, active:false, completed:[], combat:null, ...state });
      const freshMe = players.find(p=>p.id===myId);
      if(freshMe) setMeRaw(freshMe);
    } catch(e) {
      console.error("Errore refreshAll:", e);
    }
  }, [myId]);

  const refreshInventory = useCallback(async (playerOverride=null) => {
    if(!myId) return;
    setInventoryLoading(true);
    try {
      const items = await dbGetItems();
      const { entries } = await dbGetPlayerInventory(myId, items);
      const nextEquipment = getStoredEquipment(myId);
      const ownedIds = new Set(entries.map(entry => entry.itemId));
      const sanitizedEquipment = {
        weapon: ownedIds.has(nextEquipment.weapon) ? nextEquipment.weapon : null,
        armor: ownedIds.has(nextEquipment.armor) ? nextEquipment.armor : null,
        shield: ownedIds.has(nextEquipment.shield) ? nextEquipment.shield : null,
      };
      saveStoredEquipment(myId, sanitizedEquipment);
      setCatalogItems(items);
      setInventory(entries);
      setEquipment(sanitizedEquipment);

      const sourcePlayer = playerOverride;
      if(sourcePlayer) {
        const synced = applyEquipmentToPlayer(sourcePlayer, sanitizedEquipment, new Map(items.map(item => [item.id, item])));
        const hpChanged = (sourcePlayer.hp || 0) > synced.maxHp;
        const statsChanged = ["atk","def","mag","init","maxHp"].some(key => (sourcePlayer[key] || 0) !== (synced[key] || 0));
        if(hpChanged || statsChanged) {
          await dbSavePlayer(synced);
          if(sourcePlayer.id === myId) setMeRaw(synced);
        }
      }
    } catch(e) {
      console.error("Errore caricamento inventario:", e);
    } finally {
      setInventoryLoading(false);
    }
  }, [myId]);

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
        const p = { id:data.id, name:data.name, partyCode:data.party_code, class:data.class, race:data.race, hp:data.hp, maxHp:data.max_hp, atk:data.atk, def:data.def, mag:data.mag, init:data.init, xp:data.xp, level:data.level, gold:data.gold };
        setMeRaw(p);
        await refreshAll(p.partyCode);
        await refreshInventory(p);
        // Realtime subscription
        subRef.current = supabase.channel("party_"+p.partyCode)
          .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
          .on("postgres_changes", { event:"*", schema:"public", table:"players", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
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

  useEffect(() => {
    const stepData = qs?.active ? normalizeQuestStep(getQuests().find(q=>q.id===qs.currentId)?.steps?.[qs.step]) : null;
    if(!stepData || !isCombatStep(stepData)) return;
    if(qs?.combat?.active || qs?.combat?.won) return;
    startCombatStepRef.current?.(stepData);
  }, [qs?.active, qs?.currentId, qs?.step, qs?.combat?.active, qs?.combat?.won]);

  // Auto-attack when it's a monster's turn
  useEffect(() => {
    if (!qs?.combat?.active) return;
    const timer = setTimeout(async () => {
      const latestQs = await dbGetPartyState(code);
      const latestCombat = latestQs?.combat;
      if (!latestCombat?.active) return;
      const latestCombatants = [...latestCombat.combatants];
      const actor = latestCombatants[latestCombat.turn % latestCombatants.length];
      if (!actor || actor.isPlayer || actor.hp <= 0) return;
      const latestPlayers = await dbGetPlayers(code);
      const alivePlayers = latestPlayers.filter(p => (p?.hp || 0) > 0);
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
      const pt = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const weaponDie = getCombatDamageDie(actor);
      const resolved = resolveWeaponAttack(actor, pt, weaponDie);
      const edmg = resolved.damage;
      const updPt = { ...pt, hp: Math.max(0, pt.hp - edmg) };
      const playerCombatantIdx = latestCombatants.findIndex(c => c.id === pt.id);
      if(playerCombatantIdx >= 0) {
        latestCombatants[playerCombatantIdx] = applyCombatDamageState({
          ...latestCombatants[playerCombatantIdx],
          maxHp: updPt.maxHp,
        }, edmg);
      }
      await dbSavePlayer(updPt);
      if (updPt.id === myId) setMeRaw(updPt);
      await showDiceVisual({ sides:20, value:resolved.hitRoll, label:"Tiro per colpire" });
      if(resolved.hit) {
        await showDiceVisual({ sides:getPrimaryDieSides(resolved.weaponDie, 6), value:resolved.damageRoll, label:`Danno ${resolved.weaponDie}` });
      }
      const log = formatWeaponAttackLog(actor, pt, resolved, "Attacco naturale", updPt.hp, pt.maxHp);
      const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
      const allDead = latestCombatants.filter(c => !c.isPlayer).every(c => c.hp <= 0);
      const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound };
      const newQs = { ...latestQs, combat: allDead ? null : newCombat };
      await dbSavePartyState(code, newQs);
      setQs(prev => ({ ...prev, combat: allDead ? null : newCombat }));
      await dbSendMessage({ party_code: code, author: "Battaglia", content: log, type: "combat" });
      if (allDead) await dbSendMessage({ party_code: code, author: "Sistema", content: "🏆 **BATTAGLIA VINTA!** Tutti i nemici sconfitti!", type: "victory" });
    }, 1500);
    return () => clearTimeout(timer);
  }, [qs?.combat?.turn, qs?.combat?.active, myId, code]);

  async function addMsg(content, type="narration", author=null) {
    await dbSendMessage({ party_code:code, author:author||me?.name, content, type });
  }

  async function saveQState(newQs) {
    await dbSavePartyState(code, newQs);
    setQs(newQs);
  }
  async function resolveCombatNoActionablePlayers(latestState, combatants) {
    const soloCombatant = (combatants || []).find(c => c?.isPlayer && c.id === myId);
    if(partyPlayers.length <= 1 && soloCombatant?.stable && !soloCombatant?.dead) {
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

  async function usePotion(entry) {
    if(!entry?.rowId || !me) return;
    if(entry.item?.type !== "potion") return;
    if((me.hp || 0) <= 0 || myCombatant?.dying || myCombatant?.dead || myCombatant?.stable) {
      window.alert("Non puoi usare pozioni su te stesso mentre sei a terra o fuori combattimento.");
      return;
    }
    const amount = Math.max(1, entry.item.heal_amount || 0);
    if(amount <= 0) return;
    if(me.hp >= me.maxHp) {
      window.alert("Sei già al massimo della vita.");
      return;
    }
    const healed = Math.min(me.maxHp, me.hp + amount);
    const delta = healed - me.hp;
    await dbRemovePlayerItem(entry.rowId);
    const updatedPlayer = { ...me, hp: healed };
    await dbSavePlayer(updatedPlayer);
    setMeRaw(updatedPlayer);
    if(qs?.combat?.active) {
      const combatants = [...qs.combat.combatants];
      const idx = combatants.findIndex(c => c.id === me.id);
      if(idx >= 0) combatants[idx] = reviveCombatantState(combatants[idx], healed);
      await saveQState({ ...qs, combat: { ...qs.combat, combatants } });
    }
    await refreshInventory(updatedPlayer);
    await addMsg(`🧪 **${me.name}** usa **${entry.item.name}** e recupera **${delta} HP**.`, "info", "Sistema");
  }

  // -- COMBATTIMENTO --
  async function doAttack() {
    const combat = qs.combat;
    if(!combat?.active) return;
    const combatants = [...combat.combatants];
    const turn = combat.turn % combatants.length;
    const attacker = combatants[turn];
    if(!attacker?.isPlayer || attacker.id!==myId) {
      await addMsg(`⚔️ Non � il tuo turno! Tocca a **${combatants[turn]?.name}**`, "system","Sistema"); return;
    }
    if(attacker.dead || attacker.stable) {
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
      await saveQState({ ...qs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound } });
      return;
    }
    if(isDyingCombatant(attacker)) {
      const deathSave = resolveDeathSave(attacker);
      const idx = combatants.findIndex(c => c.id === attacker.id);
      combatants[idx] = deathSave.nextCombatant;
      await showDiceVisual({ sides:20, value:deathSave.rollValue, label:"Salvezza contro la morte" });
      const updatedPlayer = { ...me, hp: deathSave.nextCombatant.hp };
      await dbSavePlayer(updatedPlayer);
      setMeRaw(updatedPlayer);
      await addMsg(deathSave.log, "combat", "Battaglia");
      if(deathSave.result === "dead" && partyPlayers.length <= 1) {
        await addMsg(`📜 **La scheda di ${attacker.name} viene strappata dal destino.**`, "victory", "Master");
        await triggerSoloDeath(attacker.name);
        return;
      }
      if(!hasActionablePlayerCombatants(combatants)) {
        await resolveCombatNoActionablePlayers({ ...qs, combat }, combatants);
        return;
      }
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
      await saveQState({ ...qs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound } });
      return;
    }
    const targets = combatants.filter(c=>!c.isPlayer&&c.hp>0);
    if(!targets.length) { await endCombat(); return; }
    const target = targets[0];
    const weapon = attacker.id===myId ? getEquippedWeapon(equipment, itemMap) : { name:"Arma", weapon_die:getCombatDamageDie(attacker) };
    const resolved = resolveWeaponAttack(attacker, target, weapon.weapon_die || "1d6");
    const dmg = resolved.damage;
    const tidx = combatants.findIndex(c=>c.id===target.id);
    combatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};

    await showDiceVisual({ sides:20, value:resolved.hitRoll, label:"Tiro per colpire" });
    if(resolved.hit) {
      await showDiceVisual({ sides:getPrimaryDieSides(resolved.weaponDie, 6), value:resolved.damageRoll, label:`Danno ${resolved.weaponDie}` });
    }

    const log = formatWeaponAttackLog(attacker, target, resolved, weapon.name, combatants[tidx].hp, target.maxHp);

    const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);

    const allDead = combatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
    const newCombat = {...combat, combatants, turn:nextTurn, round:nextRound};
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    await addMsg(log, "combat", "Battaglia");
    if(allDead) await endCombat();
  }

  async function castSpell(spell) {
    if(!combat?.active) return;
    const slots = (combat.spellSlots||{})[myId] || getSpellSlots(me.level);
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
    const target = enemies[0];

    let log = `🔮 **${attacker.name}** lancia **${spell.name}**!\n`;
    let newCombatants = combatants;

    if(spell.type === "damage") {
      const base = rollDice(spell.dmg);
      await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), value:base, label:`Danno ${spell.dmg}` });
      const bonus = Math.floor((attacker.mag||0)/2);
      const dmg = Math.max(1, base + bonus - Math.floor(target.def/2));
      const tidx = newCombatants.findIndex(c=>c.id===target.id);
      newCombatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};
      log += `💥 Tiro danno: **${spell.dmg} = ${base}**\n✨ Bonus magia: **+${bonus}**\n🛡️ Riduzione bersaglio: **-${Math.floor(target.def/2)}**\n🔥 Danno finale: **${dmg}**\n❤️ ${target.name}: ${newCombatants[tidx].hp}/${target.maxHp} HP`;
    } else if(spell.type === "heal") {
      const baseHeal = rollDice(spell.dmg);
      await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), value:baseHeal, label:`Cura ${spell.dmg}` });
      const heal = Math.max(1, baseHeal + Math.floor((attacker.mag||0)/2));
      const healed = Math.min(attacker.maxHp, attacker.hp + heal);
      const delta = healed - attacker.hp;
      const pid = newCombatants.findIndex(c=>c.id===attacker.id);
      newCombatants[pid] = reviveCombatantState(attacker, healed);
      log += `💚 Tiro cura: **${spell.dmg} = ${baseHeal}**\n✨ Bonus magia: **+${Math.floor((attacker.mag||0)/2)}**\n🌿 Cura finale: **${heal}**\n❤️ ${attacker.name}: ${healed}/${attacker.maxHp} HP`;
      const updated = {...me, hp:healed};
      await dbSavePlayer(updated);
      setMeRaw(updated);
    } else {
      log += `${spell.desc || "Effetto speciale"}`;
    }

    const nextSlots = { ...(combat.spellSlots||{}), [myId]: { ...(slots||{}) } };
    if(cost > 0) nextSlots[myId][cost] = Math.max(0, (nextSlots[myId][cost]||0) - 1);

    let { nextTurn, nextRound } = getNextCombatTurn(newCombatants, combat.turn, combat.round);

    while(true) {
      const nextActor = newCombatants[nextTurn%newCombatants.length];
      if(!nextActor) break;
      if(nextActor.isPlayer) break;
      if(nextActor.hp<=0) { nextTurn++; if(nextTurn>=newCombatants.length){nextTurn=0; nextRound++;} continue; }

      const alivePlayers = newCombatants
        .filter(c => c?.isPlayer && (c?.hp || 0) > 0 && !c?.dead)
        .map(c => {
          const base = partyPlayers.find(p => p.id === c.id) || {};
          return { ...base, id:c.id, name:c.name, hp:c.hp, maxHp:c.maxHp };
        });
      if(!alivePlayers.length) break;
      const pt = alivePlayers[roll(alivePlayers.length)-1];
      if(pt) {
        const weaponDie = getCombatDamageDie(nextActor);
        const resolved = resolveWeaponAttack(nextActor, pt, weaponDie);
        const edmg = resolved.damage;
        const updPt = {...pt, hp:Math.max(0,pt.hp-edmg)};
        const playerCombatantIdx = newCombatants.findIndex(c => c.id === pt.id);
        if(playerCombatantIdx >= 0) {
          newCombatants[playerCombatantIdx] = applyCombatDamageState({
            ...newCombatants[playerCombatantIdx],
            maxHp: updPt.maxHp,
          }, edmg);
        }
        await dbSavePlayer(updPt);
        if(pt.id===myId) setMeRaw(updPt);
        await showDiceVisual({ sides:20, value:resolved.hitRoll, label:"Tiro per colpire" });
        if(resolved.hit) {
          await showDiceVisual({ sides:getPrimaryDieSides(resolved.weaponDie, 6), value:resolved.damageRoll, label:`Danno ${resolved.weaponDie}` });
        }
        log += `\n\n${formatWeaponAttackLog(nextActor, pt, resolved, "Attacco naturale", updPt.hp, pt.maxHp)}`;
      }
      ({ nextTurn, nextRound } = getNextCombatTurn(newCombatants, nextTurn, nextRound));
    }

    if(!hasActionablePlayerCombatants(newCombatants)) {
      setSpellMenu(false);
      await addMsg(log, "combat", "Battaglia");
      await resolveCombatNoActionablePlayers({ ...qs, combat }, newCombatants);
      return;
    }

    const allDead = newCombatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
    const newCombat = {...combat, combatants:newCombatants, turn:nextTurn, round:nextRound, spellSlots: nextSlots};
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    setSpellMenu(false);
    await addMsg(log, "combat", "Battaglia");
    if(allDead) await endCombat();
  }

  async function endCombat() {
    setSpellMenu(false);
    const latestQs = await dbGetPartyState(code);
    // If on a quest combat step, keep combat object with won:true so UI shows "Avanti →"
    const onQuestCombat = latestQs?.active && latestQs?.currentId && (() => {
      const q = getQuests().find(x=>x.id===latestQs.currentId);
      return q && isCombatStep(q.steps[latestQs.step]);
    })();
    const newCombat = onQuestCombat ? { active:false, won:true } : null;
    const newQs = {...latestQs, combat:newCombat};
    await dbSavePartyState(code, newQs);
    setQs(prev => ({...prev, combat:newCombat}));
    await dbSendMessage({party_code:code, author:"Sistema", content:"🏆 **BATTAGLIA VINTA!** Tutti i nemici sconfitti! Clicca **Avanti →** per continuare.", type:"victory"});
  }

  // -- QUEST --
  async function acceptQuest(q) {
    const newQs = {...qs, currentId:q.id, step:0, active:true};
    await saveQState(newQs);
    await addMsg(`📜 **MISSIONE: ${q.title}**

${q.desc}

*${q.flavor}*

⭐ Ricompensa: **${q.xpReward} XP** — **${q.goldReward} oro**`, "quest","Master");
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

  async function postQuestStepMessage(q, stepIndex) {
    const step = q.steps[stepIndex];
    const icon = isCombatStep(step)?"⚔️":isLootStep(step)?"💰":isChoiceStep(step)?"🎯":"📜";
    await addMsg(`${icon} **${q.title} — Scena ${stepIndex+1}/${q.steps.length}**

${stepText(step)}`, "quest","Master");
  }

  async function completeQuest(q) {
    const xpE = Math.floor(q.xpReward/Math.max(partyPlayers.length,1));
    const goldE = Math.floor(q.goldReward/Math.max(partyPlayers.length,1));
    for(const p of partyPlayers) {
      let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
      while(up.xp>=xpForLevel(up.level)){up.xp-=xpForLevel(up.level);up.level++;up.maxHp+=10;up.hp=up.maxHp;up.atk+=2;up.def+=1;up.mag+=1;}
      await dbSavePlayer(up);
      if(up.id===myId) setMeRaw(up);
    }
    const newQs={...qs,active:false,step:0,currentId:null,completed:[...(qs.completed||[]),q.id]};
    await saveQState(newQs);
    await addMsg(`⚔️ **MISSIONE COMPLETATA: ${q.title}!**\n\n⭐ +${xpE} XP a testa � 💰 +${goldE} oro a testa`, "victory","Master");
  }

  async function startCombatStep(stepData) {
    const monsters = (stepData.monsters||[]).map(e=>({ ...e, hp:e.maxHp||e.hp, maxHp:e.maxHp||e.hp, weaponDie:e.weaponDie || getCombatDamageDie(e) }));
    const players = partyPlayers.map(p=>({
      id:p?.id,
      name:p?.name,
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
    const spellSlots = Object.fromEntries(players.map(p=>[p.id, getSpellSlots(p.level||1)]));
    const newCombat = { active:true, combatants:allCombatants, turn:0, round:1, spellSlots };
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    await addMsg(`⚔️ **BATTAGLIA INIZIATA!** Round 1\n\n**Ordine di Iniziativa:**\n${allCombatants.map((c,i)=>`${i+1}. ${c.emoji||"⭐"} ${c.name} (${c.rollInit})`).join("\n")}`, "combat", "Sistema");
    setTab("combat");
  }
  startCombatStepRef.current = startCombatStep;

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

    const isCorrect = choice.correct === true;
    await addMsg(`🎯 **Scelta:** ${choice.label}`, "quest", "Master");

    if(isCorrect) {
      const xpE = Math.max(0, Number(choice.xp)||0);
      const goldE = Math.max(0, Number(choice.gold)||0);
      if(xpE||goldE) {
        for(const p of partyPlayers) {
          let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
          while(up.xp>=xpForLevel(up.level)){up.xp-=xpForLevel(up.level);up.level++;up.maxHp+=10;up.hp=up.maxHp;up.atk+=2;up.def+=1;up.mag+=1;}
          await dbSavePlayer(up);
          if(up.id===myId) setMeRaw(up);
        }
        await addMsg(`✅ Scelta giusta! ⭐ +${xpE} XP a testa — 💰 +${goldE} oro a testa`, "victory", "Master");
      }
    } else {
      await addMsg(`❌ Hai scelto male... il party non guadagna nulla e avanza comunque.`, "system", "Sistema");
    }

    const nextStep = choice.next != null ? Number(choice.next) : step+1;
    if(nextStep >= q.steps.length) {
      await completeQuest(q);
    } else {
      const newQs={...qs, step:nextStep};
      await saveQState(newQs);
      await postQuestStepMessage(q, nextStep);
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
    if(c==="avanza") await advanceQuest();
    else if(c==="aiuto") await addMsg(`⚔️ **Comandi:**\n� **avanza** � prosegui nella missione\n� **stato** � il tuo personaggio\n� **party** � chi c'� nel party\n� **classifica** � punti e livelli\n� Qualsiasi testo ? chat`, "system","Sistema");
    else if(c==="stato") { if(me) await addMsg(`${CLASSES[me?.class||'warrior']?.emoji} **${me.name}** � ${RACES[me?.race||'human']?.name} ${CLASSES[me?.class||'warrior']?.name} � Lv.${me.level}\n❤️${me.hp||0}/${me.maxHp||0} ⚔️${me.atk||0} 🛡️${me.def||0} ✨${me.mag||0}\n⭐XP ${me.xp||0}/${xpForLevel(me.level||1)} | 💰${me.gold||0} oro`,`info`,me.name); }
    else if(c==="party") { const lines=partyPlayers.map(p=>`${CLASSES[p?.class||'warrior']?.emoji} **${p.name}** Lv.${p.level} ❤️${p?.hp||0}/${p?.maxHp||0}`); await addMsg(`⚔️ **Party [${code}]**\n${lines.join("\n")}`,"info","Master"); }
    else if(c==="classifica") { const sorted=[...partyPlayers].sort((a,b)=>b.level-a.level); await addMsg(`⚔️ **Classifica**\n${sorted.map((p,i)=>`${["⭐","⭐","⭐"][i]||"  "} ${CLASSES[p?.class||'warrior']?.emoji} **${p.name}** Lv.${p.level} � ${p.xp||0}XP`).join("\n")}`,"info","Master"); }
    else await addMsg(raw, "chat", me?.name);
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
  const activeCombatant = combat?.active ? combat.combatants?.[combat.turn%combat.combatants.length] : null;
  const myCombatant = combat?.combatants?.find(c => c.id === myId) || null;
  const myTurn = combat?.active && activeCombatant?.id===myId;
  const myDeathTurn = myTurn && isDyingCombatant(activeCombatant);
  const isCaster = MAGIC_CLASSES.includes(me?.class);
  const spellSlots = combat?.spellSlots?.[myId] || getSpellSlots(me?.level);
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
  const currentStepKey = `${qs?.currentId || ""}:${qs?.step ?? -1}`;
  const lootDone = lootedStepKey === currentStepKey;
  const inventoryCounts = countInventoryItems(inventory);
  const inventoryGroups = groupInventoryEntries(inventory);
  const selectedInventoryItem = inventoryGroups.find(group => group.item.id === selectedInventoryItemId) || null;
  const visibleChatMessages = messages.filter(msg => ["chat","narration","quest","victory","combat"].includes(msg.type));
  const equippedWeapon = getEquippedWeapon(equipment, itemMap);
  const combatMode = tab==="combat" && combat?.active;
  const equippedItems = {
    weapon: itemMap.get(equipment.weapon) || null,
    armor: itemMap.get(equipment.armor) || null,
    shield: itemMap.get(equipment.shield) || null,
  };

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
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(2,6,23,0.76) 0%, rgba(2,6,23,0.7) 45%, rgba(2,6,23,0.8) 100%)", pointerEvents:"none" }} />
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
      {diceResult && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", color:"#fff" }}>
            <div style={{ position:"relative" }}>
              {diceResult.stage!=="rolling" && diceResult.sides===20 && diceResult.value===20 && (
                <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                  {Array.from({length:8}).map((_,i)=>(
                    <span key={i} style={{
                      position:"absolute",
                      left:`${10 + i*10}%`,
                      top:"60%",
                      width:10,
                      height:10,
                      borderRadius:"50%",
                      background:"radial-gradient(circle, rgba(255,223,93,1) 0%, rgba(255,223,93,0) 70%)",
                      animation:"sparkle 1s ease-out",
                      animationDelay:`${i*80}ms`
                    }} />
                  ))}
                </div>
              )}
              <span className={diceResult.stage==="rolling" && diceAnim?"dice-spin":""} style={{ width:"10rem", height:"10rem", display:"inline-block" }}>
                {(()=>{
                  const result = diceResult.stage==="rolling" ? "?" : diceResult.value;
                  const rv = Number(diceResult.value || 0);
                  const sides = Number(diceResult.sides || 20);
                  const critLike = sides === 20 && rv >= 20;
                  const failLike = sides === 20 && rv <= 1;
                  const maxLike = sides !== 20 && rv >= sides;
                  const color = critLike || maxLike ? "#fef08a" : failLike ? "#ef4444" : "#fbbf24";
                  const glow = critLike || maxLike
                    ? "drop-shadow(0 0 22px rgba(255,255,120,0.95))"
                    : failLike
                      ? "drop-shadow(0 0 18px rgba(239,68,68,0.95))"
                      : "drop-shadow(0 0 16px rgba(251,191,36,0.9))";
                  const stroke = diceResult.stage==="rolling" ? "#fbbf24" : color;
                  const commonText = <text x="50" y="54" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="900" fill={stroke} fontFamily="Georgia,serif">{result}</text>;

                  if(sides === 4) {
                    return (
                      <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",filter:diceResult.stage==="rolling"?"drop-shadow(0 0 16px rgba(251,191,36,0.9))":glow}}>
                        <polygon points="50,10 84,78 16,78" fill="rgba(15,23,42,0.94)" stroke={stroke} strokeWidth="2.8" strokeLinejoin="round"/>
                        <line x1="50" y1="10" x2="50" y2="78" stroke={stroke} strokeWidth="1.8" opacity="0.9"/>
                        <line x1="16" y1="78" x2="50" y2="46" stroke={stroke} strokeWidth="1.6" opacity="0.82"/>
                        <line x1="84" y1="78" x2="50" y2="46" stroke={stroke} strokeWidth="1.6" opacity="0.82"/>
                        {commonText}
                      </svg>
                    );
                  }
                  if(sides === 6) {
                    return (
                      <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",filter:diceResult.stage==="rolling"?"drop-shadow(0 0 16px rgba(251,191,36,0.9))":glow}}>
                        <polygon points="28,18 72,18 72,82 28,82" fill="rgba(15,23,42,0.94)" stroke={stroke} strokeWidth="2.8" strokeLinejoin="round"/>
                        <line x1="28" y1="18" x2="72" y2="18" stroke={stroke} strokeWidth="1.8" opacity="0.85"/>
                        <line x1="28" y1="82" x2="72" y2="82" stroke={stroke} strokeWidth="1.8" opacity="0.85"/>
                        {commonText}
                      </svg>
                    );
                  }
                  if(sides === 8) {
                    return (
                      <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",filter:diceResult.stage==="rolling"?"drop-shadow(0 0 16px rgba(251,191,36,0.9))":glow}}>
                        <polygon points="50,8 78,30 78,70 50,92 22,70 22,30" fill="rgba(15,23,42,0.94)" stroke={stroke} strokeWidth="2.8" strokeLinejoin="round"/>
                        <line x1="50" y1="8" x2="50" y2="92" stroke={stroke} strokeWidth="1.7" opacity="0.88"/>
                        <line x1="22" y1="30" x2="78" y2="30" stroke={stroke} strokeWidth="1.6" opacity="0.82"/>
                        <line x1="22" y1="70" x2="78" y2="70" stroke={stroke} strokeWidth="1.6" opacity="0.82"/>
                        {commonText}
                      </svg>
                    );
                  }
                  if(sides === 10) {
                    return (
                      <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",filter:diceResult.stage==="rolling"?"drop-shadow(0 0 16px rgba(251,191,36,0.9))":glow}}>
                        <polygon points="50,8 74,22 82,46 66,88 34,88 18,46 26,22" fill="rgba(15,23,42,0.94)" stroke={stroke} strokeWidth="2.8" strokeLinejoin="round"/>
                        <line x1="26" y1="22" x2="74" y2="22" stroke={stroke} strokeWidth="1.6" opacity="0.82"/>
                        <line x1="18" y1="46" x2="82" y2="46" stroke={stroke} strokeWidth="1.6" opacity="0.82"/>
                        <line x1="50" y1="8" x2="50" y2="88" stroke={stroke} strokeWidth="1.7" opacity="0.9"/>
                        {commonText}
                      </svg>
                    );
                  }
                  if(sides === 12) {
                    return (
                      <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",filter:diceResult.stage==="rolling"?"drop-shadow(0 0 16px rgba(251,191,36,0.9))":glow}}>
                        <polygon points="50,8 72,16 86,34 82,60 64,84 36,84 18,60 14,34 28,16" fill="rgba(15,23,42,0.94)" stroke={stroke} strokeWidth="2.6" strokeLinejoin="round"/>
                        <line x1="28" y1="16" x2="72" y2="16" stroke={stroke} strokeWidth="1.5" opacity="0.8"/>
                        <line x1="14" y1="34" x2="86" y2="34" stroke={stroke} strokeWidth="1.5" opacity="0.8"/>
                        <line x1="18" y1="60" x2="82" y2="60" stroke={stroke} strokeWidth="1.5" opacity="0.8"/>
                        {commonText}
                      </svg>
                    );
                  }
                  return (
                    <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",filter:diceResult.stage==="rolling"?"drop-shadow(0 0 16px rgba(251,191,36,0.9))":glow}}>
                      <polygon points="50,6 70,16 84,34 80,61 64,84 36,84 20,61 16,34 30,16" fill="rgba(15,23,42,0.96)" stroke={stroke} strokeWidth="2.8" strokeLinejoin="round"/>
                      <polygon points="50,6 63,23 50,34 37,23" fill="rgba(255,255,255,0.08)" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round"/>
                      <polygon points="30,16 37,23 50,34 31,40 16,34" fill="rgba(255,255,255,0.03)" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round"/>
                      <polygon points="70,16 84,34 69,40 50,34 63,23" fill="rgba(255,255,255,0.03)" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round"/>
                      <polygon points="31,40 50,34 69,40 50,54" fill="rgba(255,255,255,0.06)" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round"/>
                      <polygon points="20,61 31,40 50,54 36,84" fill="rgba(255,255,255,0.026)" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round"/>
                      <polygon points="80,61 69,40 50,54 64,84" fill="rgba(255,255,255,0.026)" stroke={stroke} strokeWidth="1.35" strokeLinejoin="round"/>
                      <line x1="30" y1="16" x2="70" y2="16" stroke={stroke} strokeWidth="1.55" opacity="0.86"/>
                      <line x1="37" y1="23" x2="63" y2="23" stroke={stroke} strokeWidth="1.35" opacity="0.8"/>
                      <line x1="16" y1="34" x2="84" y2="34" stroke={stroke} strokeWidth="1.25" opacity="0.78"/>
                      <line x1="31" y1="40" x2="69" y2="40" stroke={stroke} strokeWidth="1.25" opacity="0.82"/>
                      <line x1="50" y1="6" x2="50" y2="54" stroke={stroke} strokeWidth="1.6" opacity="0.9"/>
                      <line x1="50" y1="54" x2="50" y2="84" stroke={stroke} strokeWidth="1.35" opacity="0.8"/>
                      {commonText}
                    </svg>
                  );
                })()}
              </span>
              {diceResult.stage!=="rolling" && (
                <div style={{ marginTop:"0.55rem", textAlign:"center" }}>
                  <div style={{ fontSize:"1.15rem", color: diceResult.sides===20 && diceResult.value===20?"#fbbf24": diceResult.sides===20 && diceResult.value===1?"#f87171":"#fff", fontFamily:"'Cinzel',serif" }}>
                    {diceResult.sides===20 && diceResult.value===20 ? "CRITICO!" : diceResult.sides===20 && diceResult.value===1 ? "FALLIMENTO CRITICO!" : diceResult.label || ""}
                  </div>
                  <div style={{ fontSize:"0.9rem", color:"#cbd5e1", marginTop:4 }}>
                    {diceResult.label ? `${diceResult.label}: ` : ""}<strong>{diceResult.value}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* SIDEBAR */}
      <aside style={{ width:combatMode?176:200, flexShrink:0, background:combatMode?"rgba(3,7,18,0.97)":"rgba(4,8,18,0.94)", borderRight:"1px solid rgba(148,163,184,0.14)", display:"flex", flexDirection:"column", gap:8, padding:combatMode?"0.85rem 0.7rem":"0.7rem", overflowY:"auto", position:"relative", zIndex:1, backdropFilter:"blur(6px)", boxShadow:combatMode?"inset -1px 0 0 rgba(239,68,68,0.12)":"none" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.75rem", color:"#4c1d95", letterSpacing:"0.1em", paddingBottom:8, borderBottom:"1px solid #0f172a" }}>⚔️ {getMeta().worldName}</div>
        <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #3b0764", borderRadius:5, padding:"0.6rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
            <ArtThumb src={getPlayerPortrait(me)} alt={me?.name || "Eroe"} size={56} radius={14} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#f9fafb", fontSize:"0.82rem", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{me?.name}</div>
              <div style={{ color:"#4b5563", fontSize:"0.62rem" }}>{RACES[me?.race]?.name} {CLASSES[me?.class]?.name}</div>
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
          <div style={{ fontSize:"0.58rem", color:"#374151", textAlign:"right", marginTop:1 }}>{me.xp}/{xpForLevel(me.level)} XP</div>
          <div style={{ marginTop:6, padding:"0.35rem 0.45rem", background:"rgba(180,83,9,0.12)", border:"1px solid #78350f", borderRadius:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"0.58rem", color:"#92400e", textTransform:"uppercase", letterSpacing:"0.08em" }}>Tesoro</span>
            <span style={{ fontSize:"0.74rem", color:"#fbbf24", fontWeight:700 }}>💰 {me.gold || 0} oro</span>
          </div>
        </div>

        <div style={{ background:PANEL_BG_SOFT, border:`1px solid ${PANEL_BORDER}`, borderRadius:4, padding:"0.5rem" }}>
          <div style={{ fontSize:"0.58rem", color:"#374151", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>👥 Party — {code}</div>
          {partyPlayers.filter(p=>p.id!==myId).map(p=>(
            <div key={p?.id} style={{ display:"flex", gap:5, alignItems:"center", marginBottom:3 }}>
              <span style={{ fontSize:"0.9rem" }}>{CLASSES[p?.class||'warrior']?.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.72rem", color:"#d1d5db", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p?.name}</div>
                <div style={{ height:2, background:"#0f172a", borderRadius:1, overflow:"hidden", marginTop:1 }}>
                  <div style={{ height:"100%", background:(p?.hp||0)/(p?.maxHp||1)>0.5?"#22c55e":(p?.hp||0)/(p?.maxHp||1)>0.25?"#f59e0b":"#ef4444", width:`${Math.min(100,(p?.hp||0)/(p?.maxHp||1)*100)}%` }} />
                </div>
              </div>
              <span style={{ fontSize:"0.6rem", color:"#4b5563", flexShrink:0 }}>Lv.{p?.level||1}</span>
            </div>
          ))}
          {partyPlayers.length<=1&&<div style={{ color:"#1f2937", fontSize:"0.68rem" }}>Solo per ora</div>}
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
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:combatMode?"rgba(2,6,23,0.76)":"rgba(2,6,23,0.58)", position:"relative", zIndex:1, backdropFilter:"blur(4px)" }}>
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${PANEL_BORDER}`, background:combatMode?"rgba(8,10,20,0.94)":"rgba(3,7,18,0.88)", flexShrink:0 }}>
          {[["chat","💬 Chat"],["quest","📜 Missioni"],["inventory","🎒 Inventario"],["equipment","🎽 Equip"],["spells","✨ Magie"],["shop","🛒 Negozio"],["combat","⚔️ Battaglia"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ padding:"0.6rem 1.2rem", background:tab===k?"rgba(109,40,217,0.2)":"transparent", border:"none", borderBottom:tab===k?"2px solid #7c3aed":"2px solid transparent", color:tab===k?"#c4b5fd":"#4b5563", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", letterSpacing:"0.05em" }}>
              {l}{k==="combat"&&combat?.active&&<span style={{ marginLeft:5, padding:"1px 5px", background:"#7f1d1d", borderRadius:10, fontSize:"0.62rem", color:"#fca5a5" }}>LIVE</span>}
            </button>
          ))}
        </div>

        {tab==="chat" && <>
          <div style={{ flex:1, overflowY:"auto", padding:"0.8rem", display:"flex", flexDirection:"column", gap:6, background:"rgba(3,7,18,0.48)" }}>
            {visibleChatMessages.map(msg=>{
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
          <div style={{ display:"flex", gap:8, padding:"0.7rem", borderTop:`1px solid ${PANEL_BORDER}`, background:"rgba(3,7,18,0.88)", flexShrink:0 }}>
            <input ref={inputRef} style={{ flex:1, padding:"0.65rem 0.9rem", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:4, color:"#e2d9c5", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.92rem" }}
              placeholder='Scrivi o digita "avanza", "stato", "aiuto"...' value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleInput()} autoComplete="off" />
            <button onClick={handleInput} style={{ padding:"0.65rem 1.2rem", background:"#3b0764", border:"none", borderRadius:4, color:"#a78bfa", cursor:"pointer", fontSize:"1rem" }}>?</button>
          </div>
        </>}
        {tab==="inventory" && (
          <InventoryView
            loading={inventoryLoading}
            groups={inventoryGroups}
            equipment={equipment}
            selectedItem={selectedInventoryItem}
            onSelectItem={handleInventorySelect}
            onCloseItem={handleInventoryClose}
            onEquip={equipItem}
            onSell={handleInventorySell}
            onUse={usePotion}
            canUseConsumables={(me?.hp || 0) > 0 && !myCombatant?.dying && !myCombatant?.dead && !myCombatant?.stable}
          />
        )}
        {tab==="equipment" && (
          <EquipmentView
            me={me}
            equippedItems={equippedItems}
            equippedWeapon={equippedWeapon}
            onUnequip={unequipItem}
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
          <ShopView
            me={me}
            items={catalogItems.filter(i=>i.available)}
            loading={inventoryLoading}
            error={null}
            inventoryCounts={inventoryCounts}
            onBuy={buyItem}
          />
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
                  const stepData = currentQ?.steps?.[qs.step];
                  if(!stepData) return null;
                  if(isChoiceStep(stepData)) {
                    return (
                      <div>
                        <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:12, lineHeight:1.5 }}>{stepData.text}</p>
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
                      </div>
                    );
                  }
                  if(isCombatStep(stepData)) {
                    return (
                      <div style={{ textAlign:"center", padding:"1rem" }}>
                        <p style={{ color:"#fca5a5", fontSize:"0.88rem", marginBottom:12 }}>{stepData.text}</p>
                        {qs.combat?.won
                          ? <div>
                              <p style={{ color:"#22c55e", fontFamily:"'Cinzel',serif", marginBottom:12 }}>🏆 Vittoria! Il combattimento è finito.</p>
                              <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>
                            </div>
                          : qs.combat?.active
                            ? <p style={{ color:"#ef4444", fontFamily:"'Cinzel',serif" }}>⚔️ Battaglia avviata automaticamente — sei già nel flusso di combattimento.</p>
                            : <p style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif" }}>Preparazione del combattimento...</p>
                        }
                      </div>
                    );
                  }
                  if(isLootStep(stepData)) {
                    return (
                      <div style={{ textAlign:"center", padding:"1rem" }}>
                        <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:12 }}>{stepData.text}</p>
                        {lootDone
                          ? <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>
                          : <BigBtn onClick={()=>handleLoot(stepData)} gold icon="🔍">Cerca tra le rovine</BigBtn>
                        }
                      </div>
                    );
                  }
                  // narrative
                  return (
                    <div>
                      <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:16, lineHeight:1.5 }}>{stepText(stepData)}</p>
                      <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>
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
            {getQuests().filter(q=>q.active).map(q=>{
              const done=(qs?.completed||[]).includes(q.id);
              return (
                <div key={q.id} style={{ background:PANEL_BG, border:`1px solid ${done?PANEL_BORDER:"#475569"}`, borderRadius:6, padding:"1rem", marginBottom:8, opacity:done?0.6:1 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                        <span style={{ fontFamily:"'Cinzel',serif", color:done?"#4b5563":"#fbbf24", fontWeight:700 }}>{q.title}</span>
                        <span style={{ padding:"1px 7px", border:`1px solid ${DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#6b7280" }}>{missionDifficultyLabel(q.difficulty)}</span>
                        {done&&<span style={{ fontSize:"0.7rem", color:"#22c55e" }}>? Completata</span>}
                      </div>
                      <p style={{ color:"#6b7280", fontSize:"0.82rem", margin:"0 0 6px" }}>{q.desc}</p>
                      {q.flavor&&<p style={{ color:"#4b5563", fontSize:"0.78rem", fontStyle:"italic", margin:"0 0 8px" }}>{q.flavor}</p>}
                      <div style={{ display:"flex", gap:14, fontSize:"0.73rem", color:"#4b5563" }}>
                        <span>⭐ {q.xpReward} XP</span><span>💰 {q.goldReward} oro</span><span>🎭 {q.steps.length} scene</span>
                      </div>
                    </div>
                    {!done&&!qs?.active&&<BigBtn onClick={()=>acceptQuest(q)} gold icon="⭐">Accetta</BigBtn>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="combat" && (
          <div style={{ flex:1, overflowY:"auto", padding:combatMode?"1.35rem":"1rem", background:"linear-gradient(180deg, rgba(20,10,10,0.18) 0%, rgba(3,7,18,0.24) 100%)" }}>
            {!combat?.active ? (
              <div style={{ textAlign:"center", padding:"3rem", color:"#374151" }}>
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
                  </div>
                  {myTurn&&<span style={{ padding:"0.45rem 0.95rem", background:"rgba(239,68,68,0.24)", border:"1px solid #ef4444", borderRadius:999, color:"#fee2e2", fontSize:"0.84rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.06em" }}>{myDeathTurn?"🕯️ SALVEZZA":"⚔️ TUO TURNO"}</span>}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.7fr) minmax(320px,0.95fr)", gap:"1rem", alignItems:"start" }}>
                  <div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:12, marginBottom:"1rem" }}>
                  {combat.combatants.map((c,i)=>{
                    const isActive = i===combat.turn%combat.combatants.length;
                    return (
                      <div key={c.id||i} style={{ background:isActive?"linear-gradient(135deg, rgba(127,29,29,0.34), rgba(15,23,42,0.9))":"rgba(15,23,42,0.82)", border:`2px solid ${isActive?"#ef4444":c.isPlayer?"#6d28d9":"#7f1d1d"}`, borderRadius:12, padding:"0.95rem", opacity:c.hp<=0?0.45:1, boxShadow:isActive?"0 16px 36px rgba(127,29,29,0.24)":"0 12px 30px rgba(0,0,0,0.16)" }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                          <ArtThumb src={c.isPlayer ? getPlayerPortrait(c) : getMonsterImage(c)} alt={c.name} size={70} radius={16} />
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Cinzel',serif", color:c.isPlayer?"#ddd6fe":"#fecaca", fontSize:"0.98rem", fontWeight:700, marginBottom:2 }}>{c.name}{c.isBoss?" ⭐":""}</div>
                            <div style={{ fontSize:"0.75rem", color:"#94a3b8" }}>Iniziativa: {c.rollInit}</div>
                          </div>
                          {isActive&&<span style={{ fontSize:"0.7rem", padding:"0.22rem 0.45rem", background:"#7f1d1d", borderRadius:999, color:"#fca5a5", fontFamily:"'Cinzel',serif" }}>ATTIVO</span>}
                        </div>
                        {(c.dying || c.stable || c.dead) && (
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8, fontSize:"0.68rem" }}>
                            {c.dying && <span style={{ padding:"2px 6px", borderRadius:999, background:"rgba(127,29,29,0.35)", border:"1px solid #ef4444", color:"#fecaca" }}>🕯️ Morente</span>}
                            {c.stable && <span style={{ padding:"2px 6px", borderRadius:999, background:"rgba(30,41,59,0.5)", border:"1px solid #64748b", color:"#cbd5e1" }}>😵 Stabile</span>}
                            {c.dead && <span style={{ padding:"2px 6px", borderRadius:999, background:"rgba(24,24,27,0.7)", border:"1px solid #71717a", color:"#e4e4e7" }}>☠️ Morto</span>}
                            {(c.dying || c.stable) && <span style={{ color:"#fecaca" }}>{c.deathSuccesses || 0}/3 ✓ • {c.deathFailures || 0}/3 ✗</span>}
                          </div>
                        )}
                        <HpBar cur={c.hp} max={c.maxHp} red={!c.isPlayer} />
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:"0.74rem" }}>
                          <span style={{ color:c.isPlayer?"#c4b5fd":"#fca5a5" }}>{c.isPlayer?"Alleato":"Nemico"}</span>
                          <span style={{ color:"#e2e8f0", fontWeight:700 }}>{c.hp}/{c.maxHp} HP</span>
                        </div>
                      </div>
                    );
                  })}
                    </div>
                  </div>

                  <div style={{ display:"grid", gap:"1rem", position:"sticky", top:0 }}>
                    <div style={{ textAlign:"center", padding:"1.35rem 1.1rem", background:"linear-gradient(180deg, rgba(24,10,10,0.92), rgba(15,23,42,0.94))", border:"1px solid rgba(239,68,68,0.26)", borderRadius:12, boxShadow:"0 18px 40px rgba(0,0,0,0.22)" }}>
                      {myTurn ? (
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
                                      <button key={spell.id} onClick={()=>castSpell(spell)} style={{ width:"100%", padding:"0.95rem 1rem", background:"rgba(99,102,241,0.15)", border:"1px solid #4338ca", borderRadius:10, color:"#e0d7ff", cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:8 }}>
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
                                        </div>
                                        <div style={{ fontSize:"0.76rem", color:"#cbd5e1", marginTop:4, lineHeight:1.45 }}>{spell.desc}</div>
                                      </button>
                                    ))}
                                  </div>
                                );
                              })}
                              <SmallBtn onClick={()=>setSpellMenu(false)}>← Indietro</SmallBtn>
                            </div>
                          ) : (
                            <>
                              <div style={{ display:"grid", gap:10 }}>
                                <button onClick={doAttack} style={{ width:"100%", padding:"1rem 1.4rem", background:"linear-gradient(135deg,#7f1d1d,#dc2626)", border:"2px solid #ef4444", borderRadius:10, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 14px 28px rgba(127,29,29,0.24)" }}>
                                  <span className={diceAnim?"dice-spin":""} style={{ display:"inline-block", marginRight:8 }}>🎲</span>
                                  ATTACCA
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
                        <div style={{ color:"#cbd5e1", fontSize:"0.96rem", lineHeight:1.6 }}>
                          In attesa di <strong style={{ color:"#f8fafc" }}>{combat.combatants[combat.turn%combat.combatants.length]?.name}</strong>...
                        </div>
                      )}
                    </div>

                    <div style={{ background:"rgba(8,14,28,0.9)", border:"1px solid rgba(148,163,184,0.16)", borderRadius:12, padding:"1rem", boxShadow:"0 16px 34px rgba(0,0,0,0.18)" }}>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.78rem", color:"#cbd5e1", marginBottom:8, letterSpacing:"0.08em" }}>LOG DI BATTAGLIA</div>
                      <div style={{ maxHeight:360, overflowY:"auto" }}>
                    {messages.filter(m=>m.type==="combat").slice(-10).map(m=>(
                      <div key={m.id} style={{ padding:"0.75rem 0.85rem", background:"rgba(127,29,29,0.16)", border:"1px solid #7f1d1d", borderRadius:8, marginBottom:8, fontSize:"0.84rem", color:"#fecaca", lineHeight:1.6 }}
                        dangerouslySetInnerHTML={{ __html:fmt(m.content) }} />
                    ))}
                      </div>
                    </div>
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

/* ----------------------------------------------
   COMPONENTS
---------------------------------------------- */
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
function SmallBtn({ children, onClick, red, disabled }) {
  return <button disabled={disabled} onClick={onClick} style={{ padding:"0.3rem 0.7rem", background:red?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.04)", border:`1px solid ${red?"#ef4444":"#1f2937"}`, borderRadius:4, color:red?"#fca5a5":"#6b7280", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, fontSize:"0.78rem", fontFamily:"inherit" }}>{children}</button>;
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
const labelStyle = { display:"block", color:"#374151", fontSize:"0.63rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontFamily:"'Cinzel',serif" };
const backBtnStyle = { padding:"0.35rem 0.8rem", background:"transparent", border:"1px solid #1f2937", borderRadius:4, color:"#4b5563", cursor:"pointer", fontFamily:"inherit", fontSize:"0.8rem" };
const iconBtnStyle = { padding:"2px 6px", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:3, color:"#6b7280", cursor:"pointer", fontSize:"0.8rem" };
