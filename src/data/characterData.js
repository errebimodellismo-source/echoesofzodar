// src/data/characterData.js

export const CLASSES = {
  barbarian:{ name:"Barbaro",   emoji:"🪓", color:"#dc2626", hp:140, atk:17, def:8,  mag:0,  init:2, desc:"Furia incontrollabile, resistenza brutale" },
  bard:     { name:"Bardo",     emoji:"🎵", color:"#f97316", hp:78,  atk:9,  def:5,  mag:13, init:3, desc:"Magia attraverso musica e parole" },
  cleric:   { name:"Chierico",  emoji:"⛪", color:"#f59e0b", hp:95,  atk:7,  def:9,  mag:15, init:1, desc:"Potere divino e guarigione sacra" },
  druid:    { name:"Druido",    emoji:"🌿", color:"#84cc16", hp:80,  atk:8,  def:7,  mag:14, init:2, desc:"Magia naturale e trasformazione" },
  warrior: {
    name: "Guerriero",
    emoji: "⚔️",
    color: "#ef4444",
    hp: 20, atk: 5, def: 5, mag: 1, init: 2,
    desc: "Un combattente corpo a corpo corazzato e letale.",
  },
  monk:     { name:"Monaco",    emoji:"🥋", color:"#06b6d4", hp:88,  atk:13, def:10, mag:4,  init:5, desc:"Arti marziali e disciplina del ki" },
  paladin:  { name:"Paladino",  emoji:"🛡️", color:"#facc15", hp:110, atk:12, def:13, mag:8,  init:1, desc:"Guerriero sacro, paladino della giustizia" },
  ranger:   { name:"Ranger",    emoji:"🏹", color:"#14b8a6", hp:90,  atk:13, def:7,  mag:6,  init:3, desc:"Esploratore e cacciatore di mostri" },
  rogue:    { name:"Ladro",     emoji:"🗡️", color:"#22c55e", hp:82,  atk:14, def:6,  mag:4,  init:5, desc:"Furtività, trappole e attacchi subdoli" },
  sorcerer: { name:"Stregone",  emoji:"🪄", color:"#8b5cf6", hp:68,  atk:6,  def:3,  mag:22, init:2, desc:"Magia innata nel sangue" },
  warlock:  { name:"Warlock",   emoji:"🔮", color:"#7c3aed", hp:72,  atk:8,  def:4,  mag:20, init:2, desc:"Patti con entità oscure e potere proibito" },
  mage: {
    name: "Mago",
    emoji: "🔮",
    color: "#3b82f6",
    hp: 12, atk: 1, def: 2, mag: 6, init: 3,
    desc: "Governa le forze arcane per distruggere a distanza.",
  },
};

export const RACES = {
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

export const MAGIC_CLASSES = ['mage','sorcerer','cleric','druid','bard','warlock','paladin','ranger'];
