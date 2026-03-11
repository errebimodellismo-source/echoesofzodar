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
const DIFF_COLOR = { "Facile":"#22c55e","Medio":"#fbbf24","Difficile":"#f97316","Molto Difficile":"#ef4444","Leggendario":"#a855f7" };
const BACKGROUND_URL = "https://oaqjsuaqbzkvoljbmmjx.supabase.co/storage/v1/object/public/assets/ChatGPT_Image_10_mar_2026__02_57_11.png";

function xpForLevel(l){ return Math.floor(100*Math.pow(1.5,l-1)); }
function d(n){ return Math.floor(Math.random()*n)+1; }
function roll(sides,num=1){ let t=0; for(let i=0;i<num;i++) t+=d(sides); return t; }
function fmt(t=""){ return t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\n/g,"<br/>"); }

const MAGIC_CLASSES = ['mage','sorcerer','cleric','druid','bard','warlock','paladin','ranger'];

const SPELL_SLOTS = {
  1:{1:2,2:0,3:0,4:0,5:0}, 2:{1:3,2:0,3:0,4:0,5:0}, 3:{1:4,2:2,3:0,4:0,5:0},
  4:{1:4,2:3,3:0,4:0,5:0}, 5:{1:4,2:3,3:2,4:0,5:0}, 6:{1:4,2:3,3:3,4:0,5:0},
  7:{1:4,2:3,3:3,4:1,5:0}, 8:{1:4,2:3,3:3,4:2,5:0}, 9:{1:4,2:3,3:3,4:3,5:1},
  10:{1:4,2:3,3:3,4:3,5:2}
};

const SPELLS = {
  mage:{
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
  const m = String(dice).match(/^(\-?\d+)d(\d+)([+-]\d+)?$/);
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

/* ----------------------------------------------
   LOCAL STORAGE HELPERS (per quests/monsters/meta)
---------------------------------------------- */
function lsGet(key, def) { try { const r=localStorage.getItem(key); return r?JSON.parse(r):def; } catch { return def; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } }

function getQuests()   { return lsGet("eoz_quests",   DEFAULT_QUESTS()); }
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
    desc:"Creature delle tenebre hanno infestato la vecchia miniera di Stonehaven. I minatori non tornano pi�.",
    flavor:"�L'oscurit� ha preso vita nei tunnel...� � Sindaco Aldric",
    difficulty:"Facile", xpReward:150, goldReward:60,
    steps:[
      "Il party parte all'alba verso la miniera abbandonata a nord della citt�. L'aria odora di zolfo.",
      {
        text: "All'ingresso trovate ossa frantumate e artigli sul legno marcio. Qualcosa di grosso vive qui dentro.",
        choices: {
          good: { text: "Accendete torce e procedete furtivi.", xp: 15, gold: 8 },
          neutral: { text: "Avanzate con cautela, senza fretta.", xp: 10, gold: 5 },
          bad: { text: "Urlate per intimidire (e attirare attenzioni)...", xp: 5, gold: 2 },
        }
      },
      "Nelle gallerie buie � i **Goblin delle Rocce** attaccano! Digita **combatti** per iniziare la battaglia.",
      "Una voce profonda echeggia nelle profondit�: *�Chi osa disturbare il mio sonno eterno...�*",
      "Al terzo livello: il **Troll delle Caverne** vi sbarra la strada. Boss battle!",
      "Vittoria! Il troll cade tra un ruggito e il silenzio. I minatori sono liberi!",
    ],
    enemies:[
      {id:"e1",name:"Goblin delle Rocce",emoji:"🗿",hp:22,maxHp:22,atk:6,def:2,xp:18,isBoss:false},
      {id:"e3",name:"Troll delle Caverne",emoji:"🧌",hp:95,maxHp:95,atk:16,def:7,xp:80,isBoss:true},
    ],
  }];
}
const DEFAULT_MONSTERS = [
  {id:"m1",name:"Goblin",       emoji:"🧌",hp:20,atk:5,def:2,xp:15,desc:"Piccolo e subdolo"},
  {id:"m2",name:"Orco Guerriero",emoji:"🪓",hp:60,atk:12,def:5,xp:40,desc:"Brutale e resistente"},
  {id:"m3",name:"Drago Rosso",  emoji:"🐉",hp:200,atk:30,def:15,xp:200,desc:"Terrore del continente",isBoss:true},
  {id:"m4",name:"Vampiro",      emoji:"🧛",hp:90,atk:18,def:8,xp:80,desc:"Signore della notte",isBoss:true},
  {id:"m5",name:"Scheletro",    emoji:"💀",hp:25,atk:7,def:3,xp:18,desc:"Non-morto eterno"},
];

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
  await supabase.from("players").upsert({
    id: p.id, name: p.name, party_code: p.partyCode,
    class: p?.class || 'warrior', race: p?.race || 'human',
    hp: p?.hp || 0, max_hp: p?.maxHp || 0, atk: p?.atk || 0, def: p?.def || 0,
    mag: p?.mag || 0, init: p?.init || 1, xp: p?.xp || 0, level: p?.level || 1, gold: p?.gold || 0,
    updated_at: new Date().toISOString(),
  });
}

async function dbGetPlayers(partyCode) {
  const { data } = await supabase.from("players").select("*").eq("party_code", partyCode);
  return (data || []).map(r => ({
    id: r?.id, name: r?.name, partyCode: r?.party_code,
    class: r?.class || 'warrior', race: r?.race || 'human',
    hp: r?.hp || 0, maxHp: r?.max_hp || 0, atk: r?.atk || 0, def: r?.def || 0,
    mag: r?.mag || 0, init: r?.init || 1, xp: r?.xp || 0, level: r?.level || 1, gold: r?.gold || 0,
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

// Items / Shop
async function dbGetItems() {
  const { data } = await supabase.from("items").select("*").order("name", { ascending: true });
  return data || [];
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

async function dbAddPlayerItem(playerId, itemId) {
  await supabase.from("player_items").insert({ player_id: playerId, item_id: itemId });
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
   MASTER PASSWORD
---------------------------------------------- */
const MASTER_PASSWORD = "ByBy101112!";

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

  async function goGame(id) {
    const validId = (id||"").toString().trim();
    if(!validId) {
      alert("ID personaggio non valido. Effettua il login o crea un personaggio.");
      setScreen("landing");
      return;
    }
    setMyId(validId);
    localStorage.setItem("eoz_myId", validId);

    // Assicuriamoci che i dati del personaggio siano stati caricati da Firebase prima di passare alla schermata di gioco.
    try {
      const { data, error } = await supabase.from("players").select("id").eq("id", validId).single();
      if(error || !data) throw error || new Error("Personaggio non trovato");
      setScreen("game");
    } catch(e) {
      console.error("Errore caricamento personaggio:", e);
      alert("Impossibile caricare il personaggio. Torna al menu e riprova.");
      setScreen("landing");
    }
  }

  if(authLoading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#06060e", color:"#4b5563", fontFamily:"'Cinzel',serif" }}>? Caricamento...</div>;

  return (
    <div style={{ minHeight:"100vh", background:"#06060e", fontFamily:"'Crimson Pro',Georgia,serif", color:"#e2d9c5", position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 15% 50%,rgba(109,40,217,.1) 0%,transparent 55%),radial-gradient(ellipse at 85% 10%,rgba(180,83,9,.08) 0%,transparent 50%)", pointerEvents:"none", zIndex:0 }} />
      {screen==="master" && <MasterPanelAuth setScreen={setScreen} />}
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
      const {data:players} = await supabase.from("players").select("id").eq("id", data.user.id);
      if(players&&players.length>0) { setMyId(data.user.id); localStorage.setItem("eoz_myId",data.user.id); setScreen("game"); }
      else setScreen("landing");
    } else {
      const {error:e} = await supabase.auth.signUp({email,password});
      if(e) { setError(e.message); setLoading(false); return; }
      setSuccess("? Registrazione completata! Ora puoi accedere.");
      setMode("login");
    }
    setLoading(false);
  }

  return (
    <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem 1rem" }}>
      <p style={{ fontFamily:"'Cinzel',serif", color:"#4c1d95", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>? ZODAR ?</p>
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2rem,7vw,4rem)", margin:"0.2rem 0 2rem", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em" }}>
        {meta.worldName}
      </h1>
      <div style={{ width:"100%", maxWidth:400, background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:8, padding:"2rem" }}>
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
        <input style={{...inputStyle,marginBottom:16}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="��������" onKeyDown={e=>e.key==="Enter"&&handleAuth()} />
        {error && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(239,68,68,0.1)", border:"1px solid #7f1d1d", borderRadius:4 }}>{error}</div>}
        {success && <div style={{ color:"#6ee7b7", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(52,211,153,0.1)", border:"1px solid #065f46", borderRadius:4 }}>{success}</div>}
        <BigBtn onClick={handleAuth} gold disabled={loading} icon={mode==="login"?"🔑":"📝"}>
          {loading?"Attendere..." : mode==="login"?"Entra nel Mondo":"Crea Account"}
        </BigBtn>
        <div style={{ marginTop:"1.5rem", textAlign:"center" }}>
          <button onClick={()=>setScreen("master")} style={{ background:"none", border:"none", color:"#1f2937", cursor:"pointer", fontSize:"0.7rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.08em" }}>🛡️ Accesso Master</button>
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
    <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem", background:"#06060e" }}>
      <div style={{ width:"100%", maxWidth:360, background:"rgba(255,255,255,0.02)", border:"1px solid #374151", borderRadius:8, padding:"2rem", textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔒</div>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", marginBottom:"0.5rem" }}>Pannello Master</h2>
        <p style={{ color:"#4b5563", fontSize:"0.78rem", marginBottom:"1.5rem" }}>Accesso riservato al Master</p>
        <label style={labelStyle}>Password</label>
        <input style={{...inputStyle,marginBottom:12,textAlign:"center",letterSpacing:"0.2em"}} type="password" value={pwd}
          onChange={e=>{ setPwd(e.target.value); setErr(false); }}
          placeholder="��������"
          onKeyDown={e=>e.key==="Enter"&&(pwd===MASTER_PASSWORD?setOk(true):setErr(true))} />
        {err && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12 }}>? Password errata!</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <BigBtn onClick={()=>pwd===MASTER_PASSWORD?setOk(true):setErr(true)} gold icon="🗝️">Entra</BigBtn>
          <SmallBtn onClick={()=>setScreen("landing")}>? Indietro</SmallBtn>
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
  async function logout() {
    await supabase.auth.signOut();
    setAuthUser(null);
    localStorage.removeItem("eoz_myId");
  }

  async function handleTornaAvventura() {
    try {
      const saved = localStorage.getItem("eoz_myId");
      if(!saved) {
        alert("Nessun personaggio salvato trovato!");
        return;
      }
      const id = saved.trim();
      if(!id) {
        alert("Dati personaggio non validi!");
        return;
      }
      await goGame(id);
    } catch(e) {
      console.error("Errore caricamento:", e);
      alert("Errore nel caricare il personaggio: " + (e?.message || e));
    }
  }

  return (
    <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem 1rem", textAlign:"center", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed" }}>
      {meta.logo
        ? <img src={meta.logo} alt="logo" style={{ maxWidth:260, maxHeight:160, objectFit:"contain", marginBottom:"1rem", filter:"drop-shadow(0 0 24px rgba(251,191,36,.5))" }} />
        : <p style={{ fontFamily:"'Cinzel',serif", color:"#4c1d95", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>? ZODAR ?</p>
      }
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2.2rem,8vw,5rem)", margin:"0.2rem 0", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em", animation:"goldenGlow 4s ease-in-out infinite" }}>
        {meta.worldName}
      </h1>
      <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(0.65rem,2vw,0.85rem)", color:"#7c3aed", letterSpacing:"0.3em", textTransform:"uppercase", margin:"0.2rem 0 2.5rem" }}>{meta.worldSub}</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:320 }}>
        <BigBtn onClick={()=>setScreen("create")} gold icon="🛠️">Crea il tuo Eroe</BigBtn>
        {myId && <BigBtn onClick={handleTornaAvventura} icon="🏹">Torna all'Avventura</BigBtn>}
        <BigBtn onClick={logout} dark icon="🚪">Esci</BigBtn>
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
      content:`⚔️ **${player.name} il ${c.name}** � entrato nel mondo di **${meta.worldName}**! ${c.emoji}` });
    setLoading(false);
    goGame(id);
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

  const TABS = [{k:"world",l:"🌍 Mondo"},{k:"quests",l:"📜 Missioni"},{k:"monsters",l:"👾 Bestiari"},{k:"players",l:"👥 Giocatori"},{k:"party",l:"🏰 Party"},{k:"market",l:"🏪 Market"},{k:"users",l:"👤 Iscritti"}];
  const EMOJIS=["🗡️","🛡️","🏹","🪄","🔮","💀","🧌","🐉","🧛","💪","⚔️","⭐","🐺","🦅","🌿","🔥","🧙","👹","🗿","😈"];

  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:860, margin:"0 auto", padding:"1rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.2rem", paddingBottom:"1rem", borderBottom:"1px solid #1f2937", flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.4rem", margin:0 }}>🎲 Pannello Master</h1>
          <p style={{ color:"#4b5563", fontSize:"0.78rem", margin:0 }}>Il tuo strumento di controllo</p>
        </div>
        <BigBtn onClick={saveAll} gold icon={saved?"?":"⭐"}>{saved?"Salvato!":"Salva tutto"}</BigBtn>
        <SmallBtn onClick={()=>setScreen("landing")}>? Esci</SmallBtn>
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
            <BigBtn onClick={addQuest} gold icon="?">+ Nuova Missione</BigBtn>
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
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                  <span style={{ fontSize:"2rem" }}>{m.emoji}</span>
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
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:"1.5rem" }}>{cls.emoji}</span>
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
  const [working, setWorking] = useState({});
  const [error, setError] = useState(null);

  useEffect(()=>{
    let active = true;
    const load = async () => {
      const { data, error } = await supabase.from("players").select("party_code");
      if(error) {
        setError(error.message || "Impossibile caricare i party");
        return;
      }
      if(!active) return;
      const codes = Array.from(new Set((data||[]).map(r=>r.party_code).filter(Boolean)));
      setParties(codes);
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
      if(action === "delete") {
        await deleteParty(partyCode);
        setParties(prev=>prev.filter(c=>c!==partyCode));
      }
    } finally {
      setWorking(w=>({ ...w, [partyCode]: null }));
    }
  };

  return (
    <div>
      <p style={{ color:"#6b7280", fontSize:"0.85rem", marginBottom:"1rem" }}>{parties.length} party trovati � aggiornamento automatico</p>
      {error && <div style={{ color:"#fca5a5", marginBottom:"1rem" }}>{error}</div>}
      {!parties.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun party ancora.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {parties.map(code=>(
          <div key={code} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, marginBottom:6 }}>Party: {code}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <SmallBtn disabled={!!working[code]} onClick={()=>handleAction(code, "combat")}>💀 Reset Combattimento</SmallBtn>
              <SmallBtn disabled={!!working[code]} onClick={()=>{
                if(window.confirm("Resetta tutte le chat del party e lo stato di combattimento?")) handleAction(code, "campaign");
              }}>🔄 Reset Campagna</SmallBtn>
              <SmallBtn red disabled={!!working[code]} onClick={()=>{
                if(window.confirm("Eliminare completamente questo party (messaggi, giocatori, stato)?")) handleAction(code, "delete");
              }}>🗑️ Elimina Party</SmallBtn>
            </div>
            {working[code] && <div style={{ marginTop:8, color:"#a78bfa", fontSize:"0.78rem" }}>In corso: {working[code]}</div>}
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(()=>{
    const load = async () => {
      try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if(error) throw error;
        setUsers(data?.users || []);
      } catch(e) {
        // Fallback: show registered players if we can't list auth users
        const { data, error: playersErr } = await supabase.from("players").select("id,name,party_code");
        if(playersErr) {
          setError(e.message || "Impossibile caricare gli iscritti");
        } else {
          setUsers((data||[]).map(p=>({ id:p.id, email:p.name, party_code:p.party_code })));
          setError("Nessun accesso all'admin auth; elenco giocatori registrati.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  },[]);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, color:"#e2d9c5" }}>Master password</div>
          <div style={{ fontFamily:"monospace", color:"#c4b5fd" }}>{showPassword?MASTER_PASSWORD:"����������"}</div>
        </div>
        <SmallBtn onClick={()=>setShowPassword(v=>!v)}>{showPassword?"👁️ Nascondi":"👁️ Mostra"}</SmallBtn>
      </div>
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
          <div key={it.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
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

function ShopView({ me, setMeRaw, addMsg }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const all = await dbGetItems();
        setItems(all.filter(i=>i.available));
      } catch(e) {
        setError(e.message||"Errore durante il caricamento del negozio");
      } finally {
        setLoading(false);
      }
    };
    load();
  },[]);

  const buyItem = async (item) => {
    if(!me) return;
    if(me.gold < (item.price||0)) { window.alert("Non hai abbastanza oro."); return; }
    if(!window.confirm(`Acquistare ${item.name} per ${item.price} oro?`)) return;
    const updated = {
      ...me,
      gold: me.gold - (item.price||0),
      atk: me.atk + (item.bonus_atk||0),
      def: me.def + (item.bonus_def||0),
      mag: me.mag + (item.bonus_mag||0),
      maxHp: me.maxHp + (item.bonus_hp||0),
      hp: me.hp + (item.bonus_hp||0),
    };
    await dbSavePlayer(updated);
    await dbAddPlayerItem(me.id, item.id);
    setMeRaw(updated);
    await addMsg(`⚔️ **${me.name}** ha comprato **${item.name}** per ${item.price} oro!`, "info", "Sistema");
  };

  return (
    <div>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🛒 Negozio</h3>
      {loading && <div style={{ color:"#6b7280" }}>Caricamento...</div>}
      {error && <div style={{ color:"#fca5a5" }}>{error}</div>}
      {!loading && !items.length && <div style={{ color:"#374151", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun oggetto disponibile.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {items.map(it=>(
          <div key={it.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:"1.5rem" }}>{it.emoji||"⭐"}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{it.name}</div>
                <div style={{ fontSize:"0.72rem", color:"#6b7280" }}>{it.type}</div>
              </div>
              <span style={{ fontSize:"0.85rem", color:"#c4b5fd" }}>💰 {it.price}</span>
            </div>
            <div style={{ fontSize:"0.75rem", color:"#4b5563", marginBottom:6 }}>{it.description}</div>
            <div style={{ display:"flex", gap:8, fontSize:"0.72rem", color:"#6b7280" }}>
              <span>⚔️+{it.bonus_atk||0}</span><span>🛡️+{it.bonus_def||0}</span><span>✨+{it.bonus_mag||0}</span><span>❤️+{it.bonus_hp||0}</span>
            </div>
            <BigBtn onClick={()=>buyItem(it)} gold icon="⭐">Compra</BigBtn>
          </div>
        ))}
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
  const msgEnd = useRef(null);
  const inputRef = useRef(null);
  const subRef = useRef(null);

  const code = me?.partyCode;

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

  useEffect(()=>{
    async function init() {
      if(!myId) {
        setScreen("landing");
        return;
      }
      try {
        const { data } = await supabase.from("players").select("*").eq("id", myId).single();
        if(!data) {
          setScreen("landing");
          return;
        }
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
      } catch(e) {
        console.error("Errore inizializzazione game:", e);
        setScreen("landing");
      }
    }
    init();
    return ()=>{ if(subRef.current) supabase.removeChannel(subRef.current); };
  },[myId, refreshAll]);

  useEffect(()=>{ msgEnd.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  // Auto-attack when it's a monster's turn
  useEffect(()=>{
    const combat = qs?.combat;
    if(!combat?.active) return;
    const combatants = combat.combatants || [];
    const actor = combatants[combat.turn % combatants.length];
    if(!actor || actor.isPlayer || actor.hp <= 0) return;

    const timer = setTimeout(async () => {
      // Re-read latest state from db to avoid stale closure
      const latestQs = await dbGetPartyState(code);
      const latestCombat = latestQs?.combat;
      if(!latestCombat?.active) return;
      const latestCombatants = [...latestCombat.combatants];
      const latestActor = latestCombatants[latestCombat.turn % latestCombatants.length];
      if(!latestActor || latestActor.isPlayer || latestActor.hp <= 0) return;

      const latestPlayers = await dbGetPlayers(code);
      const alivePlayers = latestPlayers.filter(p => (p?.hp||0) > 0);
      if(!alivePlayers.length) return;

      const pt = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const edmg = Math.max(1, latestActor.atk + roll(4) - Math.floor(pt.def/3));
      const updPt = {...pt, hp: Math.max(0, pt.hp - edmg)};
      await dbSavePlayer(updPt);
      if(updPt.id === myId) setMeRaw(updPt);

      let log = `${latestActor.emoji||"👾"} **${latestActor.name}** attacca **${pt.name}** per **${edmg} danni**!`;

      let nextTurn = latestCombat.turn + 1;
      let nextRound = latestCombat.round;
      if(nextTurn >= latestCombatants.length){ nextTurn = 0; nextRound++; }

      // Skip dead monsters in sequence
      while(true) {
        const nextActor = latestCombatants[nextTurn % latestCombatants.length];
        if(!nextActor) break;
        if(nextActor.isPlayer) break;
        if(nextActor.hp <= 0) {
          nextTurn++;
          if(nextTurn >= latestCombatants.length){ nextTurn = 0; nextRound++; }
          continue;
        }
        // Another live monster: attack too
        const pt2 = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        const edmg2 = Math.max(1, nextActor.atk + roll(4) - Math.floor(pt2.def/3));
        const updPt2 = {...pt2, hp: Math.max(0, pt2.hp - edmg2)};
        await dbSavePlayer(updPt2);
        if(updPt2.id === myId) setMeRaw(updPt2);
        log += `\n${nextActor.emoji||"👾"} **${nextActor.name}** attacca **${pt2.name}** per **${edmg2} danni**!`;
        nextTurn++;
        if(nextTurn >= latestCombatants.length){ nextTurn = 0; nextRound++; }
      }

      const allDead = latestCombatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
      const newCombat = {...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound};
      await dbSavePartyState(code, {...latestQs, combat: allDead ? null : newCombat});
      await dbSendMessage({ party_code: code, author: "Battaglia", content: log, type: "combat" });
      if(allDead) await dbSendMessage({ party_code: code, author: "Sistema", content: "🏆 **BATTAGLIA VINTA!** Tutti i nemici sconfitti!", type: "victory" });
    }, 1500);

    return () => clearTimeout(timer);
  }, [qs?.combat?.turn, qs?.combat?.active, myId, code]);

  if(!me || !me.class) return <div style={{color:'white', fontSize:'1.5rem', padding:'2rem', textAlign:'center'}}>⏳ Caricamento personaggio...</div>;

  async function addMsg(content, type="narration", author=null) {
    await dbSendMessage({ party_code:code, author:author||me?.name, content, type });
  }

  async function saveQState(newQs) {
    await dbSavePartyState(code, newQs);
    setQs(newQs);
  }

  // -- COMBATTIMENTO --
  async function startCombat(quest) {
    const enemies = quest.enemies.map(e=>({...e, hp:e.maxHp||e.hp, maxHp:e.maxHp||e.hp}));
    const players = partyPlayers.map(p=>({ id:p?.id, name:p?.name, emoji:CLASSES[p?.class||'warrior']?.emoji||"⚔️", hp:p?.hp||0, maxHp:p?.maxHp||0, atk:p?.atk||0, def:p?.def||0, mag:p?.mag||0, init:p?.init||1, isPlayer:true }));
    const allCombatants = [...players,...enemies].map(c=>({...c, rollInit:(c.init||1)+roll(20)}));
    allCombatants.sort((a,b)=>b.rollInit-a.rollInit);
    const spellSlots = Object.fromEntries(players.map(p=>[p.id, getSpellSlots(p.level||1)]));
    const newCombat = { active:true, combatants:allCombatants, turn:0, round:1, spellSlots };
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    await addMsg(`⚔️ **BATTAGLIA INIZIATA!** Round 1\n\n**Ordine di Iniziativa:**\n${allCombatants.map((c,i)=>`${i+1}. ${c.emoji||"⭐"} ${c.name} (${c.rollInit})`).join("\n")}`, "combat", "Sistema");
    setTab("combat");
  }

  async function doAttack() {
    const combat = qs.combat;
    if(!combat?.active) return;
    const combatants = [...combat.combatants];
    const turn = combat.turn % combatants.length;
    const attacker = combatants[turn];
    if(!attacker?.isPlayer || attacker.id!==myId) {
      await addMsg(`⚔️ Non � il tuo turno! Tocca a **${combatants[turn]?.name}**`, "system","Sistema"); return;
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

    // Show a dice roll overlay
    setDiceResult({ stage:"rolling" });
    setDiceAnim(true);
    setTimeout(()=>{ setDiceResult({ stage:"result", value: hitRoll }); }, 800);
    setTimeout(()=>{ setDiceResult(null); }, 1500);
    setTimeout(()=>setDiceAnim(false),500);

    let log = `${attacker.emoji||"⭐"} **${attacker.name}** attacca ${target.emoji} **${target.name}**\n`;
    log += `🎲 Tiro: ${hitRoll}${isCrit?" � **CRITICO!**":""}\n`;
    if(hit) log += `⚔️ Danno: **${dmg}**${isCrit?" (×2 critico!)":""}\n❤️ ${target.name}: ${combatants[tidx].hp}/${target.maxHp} HP`;
    else log += `⚔️? Mancato!`;

    let nextTurn = combat.turn + 1;
    let nextRound = combat.round;
    if(nextTurn>=combatants.length){ nextTurn=0; nextRound++; }

    // Nemici continuano ad attaccare finch� � il loro turno (saltano i morti)
    while(true) {
      const nextActor = combatants[nextTurn%combatants.length];
      if(!nextActor) break;
      if(nextActor.isPlayer) break;
      if(nextActor.hp<=0) {
        nextTurn++;
        if(nextTurn>=combatants.length){nextTurn=0;nextRound++;}
        continue;
      }

      const alivePlayers = partyPlayers.filter(p=> (p?.hp||0) > 0 );
      if(!alivePlayers.length) break;
      const pt = alivePlayers[roll(alivePlayers.length)-1];
      if(pt) {
        const edmg = Math.max(1, nextActor.atk + roll(4) - Math.floor(pt.def/3));
        const updPt = {...pt, hp:Math.max(0,pt.hp-edmg)};
        await dbSavePlayer(updPt);
        if(pt.id===myId) setMeRaw(updPt);
        log += `\n\n${nextActor.emoji} **${nextActor.name}** contrattacca **${pt.name}** per **${edmg} danni**!`;
      }
      nextTurn++;
      if(nextTurn>=combatants.length){nextTurn=0;nextRound++;}
    }

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
      const bonus = Math.floor((attacker.mag||0)/2);
      const dmg = Math.max(1, base + bonus - Math.floor(target.def/2));
      const tidx = newCombatants.findIndex(c=>c.id===target.id);
      newCombatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};
      log += `💥 Danno: **${dmg}**\n❤️ ${target.name}: ${newCombatants[tidx].hp}/${target.maxHp} HP`;
    } else if(spell.type === "heal") {
      const heal = Math.max(1, rollDice(spell.dmg) + Math.floor((attacker.mag||0)/2));
      const healed = Math.min(attacker.maxHp, attacker.hp + heal);
      const delta = healed - attacker.hp;
      const pid = newCombatants.findIndex(c=>c.id===attacker.id);
      newCombatants[pid] = {...attacker, hp:healed};
      log += `✨ ${attacker.name} recupera **${delta}** HP (${healed}/${attacker.maxHp}).`;
      const updated = {...me, hp:healed};
      await dbSavePlayer(updated);
      setMeRaw(updated);
    } else {
      log += `${spell.desc || "Effetto speciale"}`;
    }

    const nextSlots = { ...(combat.spellSlots||{}), [myId]: { ...(slots||{}) } };
    if(cost > 0) nextSlots[myId][cost] = Math.max(0, (nextSlots[myId][cost]||0) - 1);

    let nextTurn = combat.turn + 1;
    let nextRound = combat.round;
    if(nextTurn>=newCombatants.length){ nextTurn=0; nextRound++; }

    while(true) {
      const nextActor = newCombatants[nextTurn%newCombatants.length];
      if(!nextActor) break;
      if(nextActor.isPlayer) break;
      if(nextActor.hp<=0) { nextTurn++; if(nextTurn>=newCombatants.length){nextTurn=0; nextRound++;} continue; }

      const alivePlayers = partyPlayers.filter(p=> (p?.hp||0) > 0 );
      if(!alivePlayers.length) break;
      const pt = alivePlayers[roll(alivePlayers.length)-1];
      if(pt) {
        const edmg = Math.max(1, nextActor.atk + roll(4) - Math.floor(pt.def/3));
        const updPt = {...pt, hp:Math.max(0,pt.hp-edmg)};
        await dbSavePlayer(updPt);
        if(pt.id===myId) setMeRaw(updPt);
        log += `\n\n${nextActor.emoji} **${nextActor.name}** contrattacca **${pt.name}** per **${edmg} danni**!`;
      }
      nextTurn++;
      if(nextTurn>=newCombatants.length){nextTurn=0; nextRound++;}
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
    const newQs = {...qs, combat:null};
    await saveQState(newQs);
    await addMsg("🏆 **BATTAGLIA VINTA!** Tutti i nemici sconfitti!", "victory","Sistema");
  }

  // -- QUEST --
  async function acceptQuest(q) {
    const newQs = {...qs, currentId:q.id, step:0, active:true};
    await saveQState(newQs);
    await addMsg(`⚔️ **MISSIONE: ${q.title}**\n\n${q.desc}\n\n*${q.flavor}*\n\n⭐ Ricompensa: **${q.xpReward} XP** � **${q.goldReward} oro**\n\nDigita **avanza** per iniziare!`, "quest","Master");
  }

  function isChoiceStep(step) {
    return step && typeof step === "object" && step.choices && typeof step.choices === "object";
  }

  function stepText(step) {
    if(!step) return "";
    return typeof step === "string" ? step : step.text || "";
  }

  function getStepChoices(step) {
    if(!isChoiceStep(step)) return null;
    return step.choices;
  }

  async function postQuestStepMessage(q, stepIndex) {
    const step = q.steps[stepIndex];
    await addMsg(`⚔️ **${q.title} � Scena ${stepIndex+1}/${q.steps.length}**\n\n${stepText(step)}`, "quest","Master");
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

  async function advanceQuest() {
    const quests = getQuests();
    const q = quests.find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active){ await addMsg("ℹ️ Nessuna missione attiva.","system","Sistema"); return; }
    const step = qs.step;
    await postQuestStepMessage(q, step);

    const stepData = q.steps[step];
    if(isChoiceStep(stepData)) {
      await addMsg("Scegli un'opzione per proseguire.", "system", "Sistema");
      return;
    }

    if(step+1>=q.steps.length) {
      await completeQuest(q);
    } else {
      const newQs={...qs,step:step+1};
      await saveQState(newQs);
    }
  }

  async function chooseQuestOption(choiceKey) {
    const quests = getQuests();
    const q = quests.find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active) return;
    const step = qs.step;
    const stepData = q.steps[step];
    const choices = getStepChoices(stepData);
    if(!choices) return;
    const choice = choices[choiceKey];
    if(!choice) return;

    await addMsg(`⚔️ **Scelta:** ${choice.text || choiceKey}`, "quest", "Master");

    const xpE = Math.max(0, Number(choice.xp)||0);
    const goldE = Math.max(0, Number(choice.gold)||0);
    if(xpE||goldE) {
      for(const p of partyPlayers) {
        let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
        while(up.xp>=xpForLevel(up.level)){up.xp-=xpForLevel(up.level);up.level++;up.maxHp+=10;up.hp=up.maxHp;up.atk+=2;up.def+=1;up.mag+=1;}
        await dbSavePlayer(up);
        if(up.id===myId) setMeRaw(up);
      }
      await addMsg(`⭐ +${xpE} XP a testa � 💰 +${goldE} oro a testa`, "victory", "Master");
    }

    const nextStep = choice.nextStep != null ? Number(choice.nextStep) : step+1;
    if(nextStep >= (q.steps?.length||0)) {
      await completeQuest(q);
    } else {
      const newQs={...qs,step:nextStep};
      await saveQState(newQs);
      await postQuestStepMessage(q, nextStep);
    }
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
    narration:{bg:"rgba(255,255,255,0.02)",border:"#1f2937",color:"#e2d9c5"},
    system:   {bg:"rgba(109,40,217,0.12)",border:"#5b21b6",color:"#c4b5fd"},
    quest:    {bg:"rgba(245,158,11,0.08)",border:"#b45309",color:"#fde68a"},
    victory:  {bg:"rgba(52,211,153,0.09)",border:"#065f46",color:"#6ee7b7"},
    combat:   {bg:"rgba(239,68,68,0.07)", border:"#7f1d1d",color:"#fca5a5"},
    info:     {bg:"rgba(99,102,241,0.08)",border:"#3730a3",color:"#a5b4fc"},
    chat:     {bg:"rgba(255,255,255,0.025)",border:"#1f2937",color:"#f3f4f6"},
  };

  if(!me) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#f3f4f6", fontFamily:"'Cinzel',serif", fontSize:"1.2rem" }}>Caricamento...</div>;

  const combat = qs?.combat;
  const myTurn = combat?.active && combat.combatants?.[combat.turn%combat.combatants.length]?.id===myId;
  const isCaster = MAGIC_CLASSES.includes(me?.class);
  const spellSlots = combat?.spellSlots?.[myId] || getSpellSlots(me?.level);
  const availableSpells = isCaster ? availableSpellsFor(me?.class, me?.level) : [];
  const spellLevels = Object.keys(spellSlots).filter(l=>spellSlots[l]>0).map(Number).sort((a,b)=>a-b);
  const spellsByLevel = spellLevels.reduce((acc, lvl) => {
    acc[lvl] = availableSpells.filter(s => Number(s.slot) === lvl);
    return acc;
  }, {});
  const currentQ = qs?.active ? getQuests().find(x=>x.id===qs.currentId) : null;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", position:"relative", zIndex:1 }}>
      {diceResult && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", color:"#fff" }}>
            {diceResult.stage==="rolling" ? (
              <span className={diceAnim?"dice-spin":""} style={{ fontSize:"4rem", display:"inline-block" }}>🎲</span>
            ) : (
              <div style={{ position:"relative" }}>
                {diceResult.value===20 && (
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
                <div style={{ fontSize:"4rem", color: diceResult.value===20?"#fbbf24": diceResult.value===1?"#f87171":"#fff", fontFamily:"'Cinzel',serif" }}>
                  {diceResult.value}
                  <div style={{ fontSize:"1.2rem", marginTop:"0.3rem" }}>
                    {diceResult.value===20 ? "CRITICO!" : diceResult.value===1 ? "FALLIMENTO CRITICO!" : ""}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* SIDEBAR */}
      <aside style={{ width:200, flexShrink:0, background:"rgba(4,4,12,0.98)", borderRight:"1px solid #0f172a", display:"flex", flexDirection:"column", gap:8, padding:"0.7rem", overflowY:"auto" }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.75rem", color:"#4c1d95", letterSpacing:"0.1em", paddingBottom:8, borderBottom:"1px solid #0f172a" }}>⚔️ {getMeta().worldName}</div>
        <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #3b0764", borderRadius:5, padding:"0.6rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
            <span style={{ fontSize:"1.3rem" }}>{CLASSES[me?.class]?.emoji}</span>
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
        </div>

        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #0f172a", borderRadius:4, padding:"0.5rem" }}>
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
            <div style={{ color:myTurn?"#fca5a5":"#6b7280", fontSize:"0.75rem", fontWeight:700 }}>{myTurn?"⚔️ TUO TURNO!":"Attendi..."}</div>
          </div>
        )}

        <button onClick={()=>setScreen("landing")} style={{ marginTop:"auto", padding:"0.35rem", background:"transparent", border:"1px solid #0f172a", borderRadius:3, color:"#1f2937", cursor:"pointer", fontSize:"0.62rem", fontFamily:"inherit" }}>? Menu</button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", gap:0, borderBottom:"1px solid #0f172a", background:"rgba(4,4,12,0.98)", flexShrink:0 }}>
          {[["chat","💬 Chat"],["quest","📜 Missioni"],["shop","🛒 Negozio"],["combat","⚔️ Battaglia"]].map(([k,l])=>(
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
            <button onClick={handleInput} style={{ padding:"0.65rem 1.2rem", background:"#3b0764", border:"none", borderRadius:4, color:"#a78bfa", cursor:"pointer", fontSize:"1rem" }}>?</button>
          </div>
        </>}
        {tab==="shop" && <ShopView me={me} setMeRaw={setMeRaw} addMsg={addMsg} />} 

        {tab==="quest" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>📜 Missioni</h3>
            {qs?.active && currentQ && (
              <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid #b45309", borderRadius:6, padding:"1rem", marginBottom:"1rem" }}>
                <div style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontWeight:700, marginBottom:4 }}>📜 IN CORSO: {currentQ.title}</div>
                <div style={{ height:5, background:"#0f172a", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ height:"100%", background:"linear-gradient(90deg,#b45309,#fbbf24)", width:`${qs.step/currentQ.steps.length*100}%` }} />
                </div>
                <p style={{ color:"#fde68a", fontSize:"0.85rem", marginBottom:10 }}>Scena {qs.step} di {currentQ.steps.length}</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                  {(() => {
                    const stepData = currentQ?.steps?.[qs.step];
                    const choices = stepData && typeof stepData === "object" && stepData.choices ? stepData.choices : null;
                    if(choices) {
                      return (
                        <>
                          <SmallBtn onClick={()=>chooseQuestOption("good")}>? {choices.good?.text||"Buona"}</SmallBtn>
                          <SmallBtn onClick={()=>chooseQuestOption("neutral")}>? {choices.neutral?.text||"Media"}</SmallBtn>
                          <SmallBtn red onClick={()=>chooseQuestOption("bad")}>? {choices.bad?.text||"Sbagliata"}</SmallBtn>
                        </>
                      );
                    }
                    return (
                      <>
                        <BigBtn onClick={advanceQuest} gold icon="⭐">Avanza</BigBtn>
                        {currentQ.enemies?.length>0&&!combat?.active&&(
                          <BigBtn onClick={()=>startCombat(currentQ)} icon="⭐">Inizia Combattimento</BigBtn>
                        )}
                      </>
                    );
                  })()}
                  <SmallBtn red onClick={async ()=>{
                    if(!window.confirm("Abbandonare la missione in corso? I progressi andranno persi.")) return;
                    await saveQState({...qs, active:false, step:0, combat:null});
                  }}>? Abbandona Missione</SmallBtn>
                </div>
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
          <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
            {!combat?.active ? (
              <div style={{ textAlign:"center", padding:"3rem", color:"#374151" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔒</div>
                <p>Nessuna battaglia in corso.</p>
                <p style={{ fontSize:"0.8rem" }}>Accetta una missione e usa il tab Missioni per iniziare il combattimento.</p>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
                  <h3 style={{ fontFamily:"'Cinzel',serif", color:"#ef4444", margin:0 }}>⚔️ Battaglia — Round {combat.round}</h3>
                  {myTurn&&<span style={{ padding:"3px 10px", background:"rgba(239,68,68,0.3)", border:"1px solid #ef4444", borderRadius:4, color:"#fca5a5", fontSize:"0.78rem" }}>⚔️ TUO TURNO</span>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:8, marginBottom:"1rem" }}>
                  {combat.combatants.map((c,i)=>{
                    const isActive = i===combat.turn%combat.combatants.length;
                    return (
                      <div key={c.id||i} style={{ background:isActive?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.02)", border:`2px solid ${isActive?"#ef4444":c.isPlayer?"#3b0764":"#7f1d1d"}`, borderRadius:6, padding:"0.7rem", opacity:c.hp<=0?0.4:1 }}>
                        <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5 }}>
                          <span style={{ fontSize:"1.4rem" }}>{c.emoji||"⭐"}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Cinzel',serif", color:c.isPlayer?"#c4b5fd":"#fca5a5", fontSize:"0.8rem", fontWeight:700 }}>{c.name}{c.isBoss?" ⭐":""}</div>
                            <div style={{ fontSize:"0.62rem", color:"#4b5563" }}>Init: {c.rollInit}</div>
                          </div>
                          {isActive&&<span style={{ fontSize:"0.6rem", padding:"1px 4px", background:"#7f1d1d", borderRadius:3, color:"#fca5a5" }}>?</span>}
                        </div>
                        <HpBar cur={c.hp} max={c.maxHp} red={!c.isPlayer} />
                        <div style={{ fontSize:"0.65rem", color:"#4b5563", marginTop:2, textAlign:"right" }}>{c.hp}/{c.maxHp} HP</div>
                      </div>
                    );
                  })}
                </div>
                {myTurn && (
                  <div style={{ textAlign:"center", padding:"1.5rem", background:"rgba(239,68,68,0.08)", border:"1px solid #7f1d1d", borderRadius:6 }}>
                    <p style={{ color:"#fca5a5", fontFamily:"'Cinzel',serif", marginBottom:"1rem" }}>� il tuo turno!</p>
                    {spellMenu ? (
                      <div style={{ display:"grid", gap:8, justifyItems:"center" }}>
                        <div style={{ fontSize:"0.85rem", color:"#fbbf24", fontWeight:700 }}>Scegli un incantesimo</div>
                        {spellLevels.map(lvl=>{
                          const spells = spellsByLevel[lvl] || [];
                          if(!spells.length) return null;
                          return (
                            <div key={lvl} style={{ width:"100%" }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"0.7rem 0 0.3rem", fontSize:"0.85rem", color:"#a5b4fc", fontWeight:600 }}>
                                <span>Livello {lvl}</span>
                                <span style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{spellSlots[lvl]} slot</span>
                              </div>
                              {spells.map(spell=> (
                                <button key={spell.id} onClick={()=>castSpell(spell)} style={{ width:"100%", maxWidth:320, padding:"0.9rem 1rem", background:"rgba(99,102,241,0.15)", border:"1px solid #3b0764", borderRadius:6, color:"#c4b5fd", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                    <span style={{ fontWeight:700 }}>{spell.emoji||"✨"} {spell.name}</span>
                                    <span style={{ fontSize:"0.75rem", color:"#9ca3af" }}>Slot {spell.slots||0}</span>
                                  </div>
                                  <div style={{ fontSize:"0.7rem", color:"#9ca3af", marginTop:2 }}>{spell.desc}</div>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                        <SmallBtn onClick={()=>setSpellMenu(false)}>← Indietro</SmallBtn>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
                          <button onClick={doAttack} style={{ padding:"1rem 2.2rem", background:"linear-gradient(135deg,#7f1d1d,#dc2626)", border:"2px solid #ef4444", borderRadius:6, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem", cursor:"pointer", letterSpacing:"0.08em" }}>
                            <span className={diceAnim?"dice-spin":""} style={{ display:"inline-block", marginRight:8 }}>🎲</span>
                            ATTACCA!
                          </button>
                          {isCaster && (
                            <button onClick={()=>setSpellMenu(true)} disabled={totalSlots(spellSlots)<=0} style={{ padding:"1rem 2.2rem", background:totalSlots(spellSlots)>0?"linear-gradient(135deg,#551a8b,#7c3aed)":"rgba(75,43,105,0.35)", border:"2px solid #7c3aed", borderRadius:6, color:"#e0d7ff", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem", cursor:totalSlots(spellSlots)>0?"pointer":"not-allowed", letterSpacing:"0.08em" }}>
                              🔮 Magia {totalSlots(spellSlots)>0?`(${totalSlots(spellSlots)})`:"(esauriti)"}
                            </button>
                          )}
                        </div>
                        <p style={{ color:"#4b5563", fontSize:"0.72rem", marginTop:"0.5rem" }}>d20 + ATK vs DEF nemico</p>
                      </>
                    )}
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
function SmallBtn({ children, onClick, red }) {
  return <button onClick={onClick} style={{ padding:"0.3rem 0.7rem", background:red?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.04)", border:`1px solid ${red?"#ef4444":"#1f2937"}`, borderRadius:4, color:red?"#fca5a5":"#6b7280", cursor:"pointer", fontSize:"0.78rem", fontFamily:"inherit" }}>{children}</button>;
}
function Card({ title, children }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #0f172a", borderRadius:6, padding:"1rem", marginBottom:"0.8rem" }}>
      {children}
    </div>
  );
}

const inputStyle = { width:"100%", padding:"0.55rem 0.75rem", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:4, color:"#e2d9c5", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.92rem", display:"block" };
const labelStyle = { display:"block", color:"#374151", fontSize:"0.63rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontFamily:"'Cinzel',serif" };
const backBtnStyle = { padding:"0.35rem 0.8rem", background:"transparent", border:"1px solid #1f2937", borderRadius:4, color:"#4b5563", cursor:"pointer", fontFamily:"inherit", fontSize:"0.8rem" };
const iconBtnStyle = { padding:"2px 6px", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:3, color:"#6b7280", cursor:"pointer", fontSize:"0.8rem" };
