// src/data/characterData.js

export const CLASSES = {
  barbarian:{ name:"Barbaro",   emoji:"🪓", color:"#dc2626", hp:140, atk:17, def:8,  mag:0,  init:2, desc:"Furia incontrollabile, resistenza brutale" },
  bard:     { name:"Bardo",     emoji:"🎵", color:"#f97316", hp:78,  atk:9,  def:5,  mag:13, init:3, desc:"Magia attraverso musica e parole" },
  cleric:   { name:"Chierico",  emoji:"⛪", color:"#f59e0b", hp:95,  atk:7,  def:9,  mag:15, init:1, desc:"Potere divino e guarigione sacra" },
  druid:    { name:"Druido",    emoji:"🌿", color:"#84cc16", hp:80,  atk:8,  def:7,  mag:14, init:2, desc:"Magia naturale e trasformazione" },
  warrior:  { name:"Guerriero", emoji:"⚔️", color:"#ef4444", hp:20,  atk:5,  def:5,  mag:1,  init:2, desc:"Un combattente corpo a corpo corazzato e letale." },
  monk:     { name:"Monaco",    emoji:"🥋", color:"#06b6d4", hp:88,  atk:13, def:10, mag:4,  init:5, desc:"Arti marziali e disciplina del ki" },
  paladin:  { name:"Paladino",  emoji:"🛡️", color:"#facc15", hp:110, atk:12, def:13, mag:8,  init:1, desc:"Guerriero sacro, paladino della giustizia" },
  ranger:   { name:"Ranger",    emoji:"🏹", color:"#14b8a6", hp:90,  atk:13, def:7,  mag:6,  init:3, desc:"Esploratore e cacciatore di mostri" },
  rogue:    { name:"Ladro",     emoji:"🗡️", color:"#22c55e", hp:82,  atk:14, def:6,  mag:4,  init:5, desc:"Furtività, trappole e attacchi subdoli" },
  sorcerer: { name:"Stregone",  emoji:"🪄", color:"#8b5cf6", hp:68,  atk:6,  def:3,  mag:22, init:2, desc:"Magia innata nel sangue" },
  warlock:  { name:"Warlock",   emoji:"🔮", color:"#7c3aed", hp:72,  atk:8,  def:4,  mag:20, init:2, desc:"Patti con entità oscure e potere proibito" },
  mage:     { name:"Mago",      emoji:"🔮", color:"#3b82f6", hp:12,  atk:1,  def:2,  mag:6,  init:3, desc:"Governa le forze arcane per distruggere a distanza." },

  // ── Classe Unica — Zodar ──
  custode_equilibrio: { name:"Custode dell'Equilibrio", emoji:"⚖️", color:"#a855f7", hp:9999, atk:99, def:99, mag:99, init:99, _zodar:true, desc:"L'Equilibrio fatto persona. Né luce né tenebra — entrambe." },

  // ── Classi Segrete ── sbloccabili solo con password
  necromancer: { name:"Negromante", emoji:"💀", color:"#6d28d9", hp:95,  atk:10, def:6,  mag:32, init:2, _secret:true, desc:"Signore della morte. Anima i cadaveri e comanda orde di non-morti." },
  artificer:   { name:"Artefice",   emoji:"⚙️", color:"#f59e0b", hp:115, atk:18, def:16, mag:10, init:4, _secret:true, desc:"Costruttore di gadget letali e armature potenziate. Scienza e magia fuse insieme." },
  summoner:    { name:"Evocatore",  emoji:"🌀", color:"#22d3ee", hp:80,  atk:4,  def:4,  mag:35, init:3, _secret:true, desc:"Apre varchi tra i piani e richiama creature potenti al suo fianco." },
  seductress:  { name:"Seduttrice", emoji:"😈", color:"#f43f8e", hp:85,  atk:8,  def:6,  mag:38, init:7, _secret:true, _femaleOnly:true, desc:"Manipolazione, charme demoniaco e drenaggio vitale. Nessuno le resiste." },
};

export const RACES = {
  human:     { name:"Umano",     emoji:"👤", hpB:5,  atkB:1, defB:1, magB:1,  initB:1,  desc:"Versatili e ambiziosi, eccellono in tutto" },
  dwarf:     { name:"Nano",      emoji:"🧔", hpB:25, atkB:1, defB:5, magB:0,  initB:-1, desc:"Resistenti come la roccia, esperti artigiani" },
  elf:       { name:"Elfo",      emoji:"🧝", hpB:0,  atkB:1, defB:1, magB:3,  initB:2,  desc:"Agili e magici, percezione soprannaturale" },
  halfling:  { name:"Halfling",  emoji:"🧒", hpB:0,  atkB:0, defB:2, magB:0,  initB:4,  desc:"Fortunati e furtivi, sempre positivi" },
  dragonborn:{ name:"Dragonide", emoji:"🐉", hpB:10, atkB:3, defB:2, magB:2,  initB:0,  desc:"Discendenti dei draghi, soffio draconico" },
  gnome:     { name:"Gnomo",     emoji:"🧙‍♂️", hpB:0,  atkB:0, defB:1, magB:6,  initB:2,  desc:"Ingegnosi e curiosi, magia illusoria naturale" },
  halfelf:   { name:"Mezzelfo",  emoji:"🧝‍♂️", hpB:0,  atkB:2, defB:1, magB:2,  initB:2,  desc:"Il meglio di due mondi, carismatici" },
  halforc:   { name:"Mezzorco",  emoji:"👹", hpB:15, atkB:5, defB:1, magB:0,  initB:1,  desc:"Forza bruta e resistenza feroce" },
  tiefling:  { name:"Tiefling",  emoji:"👿", hpB:0,  atkB:0, defB:1, magB:5,  initB:1,  desc:"Sangue infernale, resistenza al fuoco" },

  // ── Razza Unica — Zodar ──
  entita_primordiale: { name:"Entità Primordiale", emoji:"🌌", hpB:0, atkB:0, defB:0, magB:0, initB:0, _zodar:true, desc:"Esistente prima del tempo stesso. Oltre ogni catalogazione." },

  // ── Razze Segrete ── sbloccabili solo con password
  minotaur:  { name:"Minotauro", emoji:"🐂", hpB:50, atkB:10, defB:4, magB:0,  initB:-1, _secret:true, desc:"Colosso delle pianure. Forza devastante e resistenza leggendaria." },
  angel:     { name:"Angelo",    emoji:"😇", hpB:15, atkB:3,  defB:10, magB:12, initB:3,  _secret:true, desc:"Essere celeste. Equilibrio perfetto tra luce divina e combattimento." },
  succubus:  { name:"Succube",   emoji:"😈", hpB:5,  atkB:4,  defB:2,  magB:15, initB:6,  _secret:true, _femaleOnly:true, desc:"Creatura infernale. Velocità e potere magico fuori dal comune." },
};

export const MAGIC_CLASSES = ['mage','sorcerer','cleric','druid','bard','warlock','paladin','ranger','necromancer','summoner','artificer','seductress'];

export const SECRET_UNLOCK_KEY = 'eoz_secret_unlocked';
export const SECRET_PASSWORD   = 'the chosen one';
