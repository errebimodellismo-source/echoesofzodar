// src/data/characterData.js

export const CLASSES = {
  barbarian:{ name:"Barbaro",   emoji:"🪓", color:"#dc2626", hp:140, atk:17, def:8,  mag:0,  init:2, desc:"Furia incontrollabile, resistenza brutale" },
  bard:     { name:"Bardo",     emoji:"🎵", color:"#f97316", hp:78,  atk:9,  def:5,  mag:13, init:3, desc:"Magia attraverso musica e parole" },
  cleric:   { name:"Chierico",  emoji:"⛪", color:"#f59e0b", hp:95,  atk:7,  def:9,  mag:15, init:1, desc:"Potere divino e guarigione sacra" },
  druid:    { name:"Druido",    emoji:"🌿", color:"#84cc16", hp:80,  atk:8,  def:7,  mag:14, init:2, desc:"Magia naturale e trasformazione" },
  warrior:  { name:"Guerriero", emoji:"⚔️", color:"#ef4444", hp:120, atk:5,  def:5,  mag:1,  init:2, desc:"Un combattente corpo a corpo corazzato e letale." },
  monk:     { name:"Monaco",    emoji:"🥋", color:"#06b6d4", hp:88,  atk:13, def:10, mag:4,  init:5, desc:"Arti marziali e disciplina del ki" },
  paladin:  { name:"Paladino",  emoji:"🛡️", color:"#facc15", hp:110, atk:12, def:13, mag:8,  init:1, desc:"Guerriero sacro, paladino della giustizia" },
  ranger:   { name:"Ranger",    emoji:"🏹", color:"#14b8a6", hp:90,  atk:13, def:7,  mag:6,  init:3, desc:"Esploratore e cacciatore di mostri" },
  rogue:    { name:"Ladro",     emoji:"🗡️", color:"#22c55e", hp:82,  atk:14, def:6,  mag:4,  init:5, desc:"Furtività, trappole e attacchi subdoli" },
  sorcerer: { name:"Stregone",  emoji:"🪄", color:"#8b5cf6", hp:68,  atk:6,  def:3,  mag:22, init:2, desc:"Magia innata nel sangue" },
  warlock:  { name:"Warlock",   emoji:"🔮", color:"#7c3aed", hp:72,  atk:8,  def:4,  mag:20, init:2, desc:"Patti con entità oscure e potere proibito" },
  mage:     { name:"Mago",      emoji:"🔮", color:"#3b82f6", hp:12,  atk:1,  def:2,  mag:6,  init:3, desc:"Governa le forze arcane per distruggere a distanza." },

  // ── Classe Unica — Zodar ──
  custode_equilibrio: { name:"Custode dell'Equilibrio ∞", emoji:"⚖️", color:"#a855f7", hp:999999999, atk:999999, def:999999, mag:999999, init:99999, _zodar:true, _level:Infinity, desc:"L'Equilibrio fatto persona. Né luce né tenebra — entrambe. Livello ∞. Oltre ogni limite." },

  // ── Classi Segrete ── sbloccabili solo con password
  necromancer: { name:"Negromante", emoji:"💀", color:"#6d28d9", hp:95,  atk:10, def:6,  mag:32, init:2, _secret:true, desc:"Signore della morte. Anima i cadaveri e comanda orde di non-morti." },
  artificer:   { name:"Artefice",   emoji:"⚙️", color:"#f59e0b", hp:115, atk:18, def:16, mag:10, init:4, _secret:true, desc:"Costruttore di gadget letali e armature potenziate. Scienza e magia fuse insieme." },
  summoner:    { name:"Evocatore",  emoji:"🌀", color:"#22d3ee", hp:80,  atk:4,  def:4,  mag:35, init:3, _secret:true, desc:"Apre varchi tra i piani e richiama creature potenti al suo fianco." },
  seductress:  { name:"Seduttrice", emoji:"😈", color:"#f43f8e", hp:85,  atk:8,  def:6,  mag:38, init:7, _secret:true, _femaleOnly:true, desc:"Manipolazione, charme demoniaco e drenaggio vitale. Nessuno le resiste." },
  echo_knight: { name:"Cavaliere dell'Eco", emoji:"\u2694\uFE0F", color:"#38bdf8", hp:118, atk:15, def:11, mag:7, init:3, _secret:true, _cardUnlock:true, desc:"Guerriero che combatte accanto alla propria eco spirituale." },
  sigilwarden: { name:"Custode dei Sigilli", emoji:"\u26E8\uFE0F", color:"#a78bfa", hp:112, atk:9, def:17, mag:13, init:1, _secret:true, _cardUnlock:true, desc:"Difensore arcano che protegge il party con marchi e barriere." },
  ashen_oracle: { name:"Oracolo della Cenere", emoji:"\u2728", color:"#fb7185", hp:78, atk:6, def:6, mag:25, init:3, _secret:true, _cardUnlock:true, desc:"Incantatore che legge futuri catastrofici nelle braci divine." },
  moon_reaver: { name:"Predone Lunare", emoji:"\uD83C\uDF19", color:"#818cf8", hp:86, atk:16, def:7, mag:8, init:7, _secret:true, _cardUnlock:true, desc:"Assassino mobile legato a ombre, fasi lunari e colpi rapidi." },
  blood_cartographer: { name:"Cartografo del Sangue", emoji:"\uD83D\uDDFA\uFE0F", color:"#ef4444", hp:92, atk:11, def:8, mag:16, init:4, _secret:true, _cardUnlock:true, desc:"Traccia mappe vive dentro dungeon e battaglie, marchiando il destino." },
  void_sage: { name:"Sapiente del Vuoto", emoji:"\uD83C\uDF0C", color:"#0f172a", hp:70, atk:5, def:5, mag:34, init:4, _secret:true, _cardUnlock:true, desc:"Mago cosmico che legge cio che manca nel mondo." },
  herald_zodar: { name:"Araldo di Zodar", emoji:"\u2696\uFE0F", color:"#fbbf24", hp:105, atk:12, def:12, mag:20, init:4, _secret:true, _cardUnlock:true, desc:"Messaggero dell'Equilibrio, legato a interventi, sacrifici e Risonanza." },
  relic_tamer: { name:"Domatore di Reliquie", emoji:"\uD83D\uDD31", color:"#d97706", hp:98, atk:13, def:10, mag:14, init:3, _secret:true, _cardUnlock:true, desc:"Canalizza oggetti, carte e reliquie come fonti di potere." },
  oathblade: { name:"Lama del Giuramento", emoji:"\uD83D\uDDE1\uFE0F", color:"#f97316", hp:108, atk:17, def:9, mag:6, init:4, _secret:true, _cardUnlock:true, desc:"Combattente sacro oscuro che cresce mantenendo promesse difficili." },
  echo_singer: { name:"Cantore degli Echi", emoji:"\uD83C\uDFB5", color:"#ec4899", hp:82, atk:8, def:6, mag:23, init:4, _secret:true, _cardUnlock:true, desc:"Bardo superiore che manipola suono, memoria e Risonanza." },
  echo_reaper: { name:"Mietitore d'Echi", emoji:"\u2620\uFE0F", color:"#64748b", hp:96, atk:15, def:8, mag:15, init:4, _secret:true, _cardUnlock:true, desc:"Raccoglie frammenti di potere dai nemici caduti e scala nei dungeon lunghi." },
  seal_inquisitor: { name:"Inquisitore del Sigillo", emoji:"\uD83D\uDD0D", color:"#facc15", hp:104, atk:14, def:12, mag:10, init:3, _secret:true, _cardUnlock:true, desc:"Cacciatore anti-magia che punisce evocazioni, scudi e corruzione." },
  blood_alchemist: { name:"Alchimista del Sangue", emoji:"\uD83E\uDDEA", color:"#dc2626", hp:90, atk:10, def:7, mag:22, init:3, _secret:true, _cardUnlock:true, desc:"Trasforma punti vita in pozioni, mutazioni ed esplosioni controllate." },
  rune_elder: { name:"Vegliardo delle Rune", emoji:"\u16B1", color:"#60a5fa", hp:88, atk:7, def:12, mag:26, init:0, _secret:true, _cardUnlock:true, desc:"Classe lenta ma potente, prepara rune prima dello scontro." },
  blade_dancer: { name:"Danzatore di Lame", emoji:"\uD83D\uDDE1\uFE0F", color:"#22c55e", hp:80, atk:18, def:6, mag:6, init:8, _secret:true, _cardUnlock:true, desc:"Combattente fragile e spettacolare basato su combo e multi-colpo." },
  cursebreaker: { name:"Spezzamaledizioni", emoji:"\uD83D\uDD25", color:"#f59e0b", hp:100, atk:12, def:10, mag:16, init:3, _secret:true, _cardUnlock:true, desc:"Supporto offensivo contro maledizioni, non morti, demoni e dungeon oscuri." },
  star_pilgrim: { name:"Pellegrino Stellare", emoji:"\u2B50", color:"#38bdf8", hp:84, atk:8, def:7, mag:27, init:5, _secret:true, _cardUnlock:true, desc:"Viandante cosmico, teletrasporti brevi e bonus negli eventi mondiali." },
  soul_forger: { name:"Forgiatore d'Anime", emoji:"\u2692\uFE0F", color:"#c084fc", hp:102, atk:13, def:11, mag:18, init:2, _secret:true, _cardUnlock:true, desc:"Trasforma frammenti, duplicati e memoria in armi spirituali." },
  doom_prophet: { name:"Profeta della Fine", emoji:"\u23F3", color:"#7f1d1d", hp:76, atk:6, def:5, mag:31, init:2, _secret:true, _cardUnlock:true, desc:"Accumula presagi e diventa devastante quando il party e vicino alla rovina." },
  maze_keeper: { name:"Custode del Labirinto", emoji:"\uD83E\uDDED", color:"#14b8a6", hp:94, atk:10, def:13, mag:15, init:3, _secret:true, _cardUnlock:true, desc:"Manipola dungeon, rivela stanze, evita trappole e altera incontri." },
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
  aasimar: { name:"Aasimar", emoji:"\u2728", hpB:8, atkB:2, defB:4, magB:7, initB:2, _secret:true, _cardUnlock:true, desc:"Mortale dal sangue celestiale, benedetto da luce e protezione." },
  drow: { name:"Drow", emoji:"\uD83C\uDF11", hpB:0, atkB:3, defB:1, magB:6, initB:4, _secret:true, _cardUnlock:true, desc:"Elfo oscuro agile, furtivo e affine alla magia d'ombra." },
  forged: { name:"Forgiato", emoji:"\u2699\uFE0F", hpB:28, atkB:3, defB:7, magB:0, initB:-1, _secret:true, _cardUnlock:true, desc:"Costrutto vivente, resistente a veleni e fatica, lento ma affidabile." },
  renegade_vampire: { name:"Vampiro Rinnegato", emoji:"\uD83E\uDD87", hpB:12, atkB:5, defB:2, magB:6, initB:4, _secret:true, _cardUnlock:true, desc:"Creatura notturna che cerca liberta dal proprio sangue maledetto." },
  sirenide: { name:"Sirenide", emoji:"\uD83C\uDF0A", hpB:2, atkB:1, defB:2, magB:8, initB:3, _secret:true, _cardUnlock:true, desc:"Discendente marina dalla voce incantatrice e legami con gli abissi." },
  echide: { name:"Echide", emoji:"\uD83D\uDD14", hpB:10, atkB:2, defB:2, magB:10, initB:3, _secret:true, _cardUnlock:true, desc:"Razza nata con frammenti degli Echi nel sangue, percepita da Zodar." },
  genasi: { name:"Genasi", emoji:"\uD83C\uDF2A\uFE0F", hpB:6, atkB:2, defB:3, magB:6, initB:3, _secret:true, _cardUnlock:true, desc:"Anima elementale in corpo mortale: fuoco, acqua, aria o terra." },
  ancient_draconid: { name:"Draconide Antico", emoji:"\uD83D\uDC09", hpB:20, atkB:6, defB:4, magB:5, initB:1, _secret:true, _cardUnlock:true, desc:"Linea rara di sangue draconico piu vicina ai Draghi Antichi." },
  shadow_awakened: { name:"Ombra Risvegliata", emoji:"\uD83D\uDD76\uFE0F", hpB:4, atkB:3, defB:2, magB:8, initB:5, _secret:true, _cardUnlock:true, desc:"Ex creatura d'ombra diventata persona, fragile ma imprendibile." },
  fae: { name:"Fatato", emoji:"\uD83E\uDD8B", hpB:-2, atkB:0, defB:2, magB:7, initB:6, _secret:true, _cardUnlock:true, desc:"Creatura piccola e imprevedibile, maestra di fortuna e illusioni." },
  echo_born: { name:"Nato dall'Eco", emoji:"\uD83D\uDD0A", hpB:8, atkB:2, defB:2, magB:9, initB:3, _secret:true, _cardUnlock:true, desc:"Essere generato da una carta, una memoria o un picco di Risonanza." },
  half_djinn: { name:"Mezzo-Djinn", emoji:"\uD83C\uDF2C\uFE0F", hpB:5, atkB:2, defB:1, magB:9, initB:4, _secret:true, _cardUnlock:true, desc:"Sangue dei desideri perduti, fortunato ma magicamente instabile." },
  golemide: { name:"Golemide", emoji:"\uD83E\uDEA8", hpB:40, atkB:4, defB:9, magB:-1, initB:-2, _secret:true, _cardUnlock:true, desc:"Anima viva dentro un corpo artificiale inciso di rune." },
  void_touched: { name:"Toccato dal Vuoto", emoji:"\uD83C\uDF0C", hpB:0, atkB:1, defB:1, magB:12, initB:2, _secret:true, _cardUnlock:true, desc:"Mortale segnato dal vuoto cosmico, potente ma inquietante." },
  fallen_seraphite: { name:"Serafita Caduto", emoji:"\uD83E\uDEB6", hpB:10, atkB:4, defB:4, magB:8, initB:3, _secret:true, _cardUnlock:true, desc:"Discendente spezzato tra luce celeste e caduta infernale." },
  primordial_draconian: { name:"Draconiano Primordiale", emoji:"\uD83D\uDD25", hpB:24, atkB:7, defB:5, magB:4, initB:0, _secret:true, _cardUnlock:true, desc:"Sangue draconico selvaggio, precedente ai regni e ai giuramenti." },
  night_child: { name:"Figlio della Notte", emoji:"\uD83C\uDF19", hpB:6, atkB:4, defB:2, magB:5, initB:6, _secret:true, _cardUnlock:true, desc:"Razza furtiva e notturna, meno maledetta di un vampiro ma ugualmente temuta." },
  ancient_silvan: { name:"Silvano Antico", emoji:"\uD83C\uDF33", hpB:18, atkB:1, defB:6, magB:7, initB:0, _secret:true, _cardUnlock:true, desc:"Spirito arboreo incarnato, legato alla cura naturale e vulnerabile al fuoco." },
  atlantean: { name:"Atlanteo", emoji:"\uD83D\uDD31", hpB:12, atkB:2, defB:3, magB:7, initB:2, _secret:true, _cardUnlock:true, desc:"Erede di un popolo sommerso, custode di reliquie marine." },
  living_mirror: { name:"Specchio Vivente", emoji:"\uD83E\uDE9E", hpB:4, atkB:1, defB:4, magB:8, initB:4, _secret:true, _cardUnlock:true, desc:"Essere riflettente che imita frammenti di potere altrui." },
};

export const MAGIC_CLASSES = ['mage','sorcerer','cleric','druid','bard','warlock','paladin','ranger','necromancer','summoner','artificer','seductress','echo_knight','sigilwarden','ashen_oracle','blood_cartographer','moon_reaver','void_sage','herald_zodar','relic_tamer','oathblade','echo_singer','echo_reaper','seal_inquisitor','blood_alchemist','rune_elder','blade_dancer','cursebreaker','star_pilgrim','soul_forger','doom_prophet','maze_keeper'];

export const SECRET_UNLOCK_KEY = 'eoz_secret_unlocked';
export const SECRET_PASSWORD   = 'the chosen one';
