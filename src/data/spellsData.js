// src/data/spellsData.js

// Total slots = level + 1 (exactly +1 per level). Tiers unlock progressively.
export const SPELL_SLOTS = {
  1:  {1:2, 2:0, 3:0, 4:0, 5:0},  // 2 total
  2:  {1:3, 2:0, 3:0, 4:0, 5:0},  // 3 total
  3:  {1:3, 2:1, 3:0, 4:0, 5:0},  // 4 total — tier 2 sblocca
  4:  {1:3, 2:2, 3:0, 4:0, 5:0},  // 5 total
  5:  {1:3, 2:3, 3:0, 4:0, 5:0},  // 6 total
  6:  {1:4, 2:3, 3:0, 4:0, 5:0},  // 7 total
  7:  {1:4, 2:3, 3:1, 4:0, 5:0},  // 8 total — tier 3 sblocca
  8:  {1:4, 2:3, 3:2, 4:0, 5:0},  // 9 total
  9:  {1:4, 2:3, 3:3, 4:0, 5:0},  // 10 total
  10: {1:4, 2:3, 3:3, 4:1, 5:0},  // 11 total — tier 4 sblocca
  11: {1:4, 2:3, 3:3, 4:2, 5:0},  // 12 total
  12: {1:4, 2:3, 3:3, 4:3, 5:0},  // 13 total
  13: {1:4, 2:3, 3:3, 4:3, 5:1},  // 14 total — tier 5 sblocca
  14: {1:4, 2:3, 3:3, 4:3, 5:2},  // 15 total
  15: {1:4, 2:3, 3:3, 4:3, 5:3},  // 16 total
  16: {1:4, 2:3, 3:3, 4:3, 5:4},  // 17 total
  17: {1:4, 2:3, 3:3, 4:3, 5:5},  // 18 total
  18: {1:4, 2:4, 3:3, 4:3, 5:5},  // 19 total
  19: {1:4, 2:4, 3:4, 4:3, 5:5},  // 20 total
  20: {1:4, 2:4, 3:4, 4:4, 5:5},  // 21 total
};

export const SPELLS = {
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
    0:[
      {id:"cl01",name:"Fiamma Sacra",emoji:"🕯️",dmg:"1d8",type:"damage",slots:0,desc:"Getto di fuoco divino gratuito ogni turno"},
      {id:"cl02",name:"Raggio Sacro",emoji:"⚡",dmg:"1d6",type:"damage",slots:0,desc:"Raggio di energia divina gratuito ogni turno"},
      {id:"cl03",name:"Cura Minima",emoji:"💊",dmg:"-1d4",type:"heal",slots:0,desc:"Piccola cura divina gratuita ogni turno, ripristina 1d4 HP"},
    ],
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
      {id:"cl31",name:"Cura di Massa",emoji:"💚",dmg:"-3d8",type:"heal",area:true,slots:3,desc:"Cura 3d8 HP a TUTTI gli alleati contemporaneamente"},
      {id:"cl32",name:"Colpo Radioso",emoji:"✨",dmg:"6d8",type:"damage",slots:3,desc:"Esplosione di luce sacra devastante"},
      {id:"cl33",name:"Animare Morti",emoji:"💀",dmg:"0",type:"summon",slots:3,desc:"Evoca fino a 2 scheletri alleati per combattere",maxSummons:2,summon:{name:"Scheletro",emoji:"💀",hp:28,atk:14,def:10,dmgDie:"1d8"}},
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
    0:[
      {id:"dr01",name:"Produzione di Fiamme",emoji:"🔥",dmg:"1d8",type:"damage",slots:0,desc:"Fiamma naturale gratuita ogni turno"},
      {id:"dr02",name:"Veleno Minore",emoji:"☠️",dmg:"1d6",type:"damage",slots:0,desc:"Veleno naturale debole, gratuito ogni turno"},
    ],
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
      {id:"dr24",name:"Chiamata Animale",emoji:"🦁",dmg:"2d8",type:"summon",slots:2,desc:"Evoca un animale alleato per aiutarti in battaglia",summon:{name:"Lupo della Natura",emoji:"🐺",hp:22,atk:12,def:8,dmgDie:"2d6"}},
    ],
    3:[
      {id:"dr31",name:"Colpo del Vento",emoji:"💨",dmg:"6d8",type:"damage",slots:3,desc:"Vento devastante che travolge tutti i nemici"},
      {id:"dr32",name:"Cura di Gruppo",emoji:"💚",dmg:"-3d8",type:"heal",area:true,slots:3,desc:"Cura 3d8 HP a tutti gli alleati"},
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
      {id:"ba32",name:"Cura di Gruppo",emoji:"💚",dmg:"-3d6",type:"heal",area:true,slots:3,desc:"Canzone di guarigione, 3d6 HP a tutti gli alleati"},
      {id:"ba33",name:"Onda Tonica",emoji:"🎶",dmg:"5d6",type:"damage",slots:3,desc:"Onda di energia sonora esplosiva"},
      {id:"ba34",name:"Vergogna",emoji:"😳",dmg:"4d6",type:"damage",slots:3,desc:"Maledizione di vergogna, -4 ATK al nemico per 2 round"},
    ],
    4:[
      {id:"ba41",name:"Confusione",emoji:"🎪",dmg:"0",type:"control",slots:4,desc:"Tutti i nemici si confondono e attaccano a caso"},
      {id:"ba42",name:"Grande Ispirazione",emoji:"🎺",dmg:"0",type:"buff",slots:4,desc:"+5 ATK e +5 DEF a tutto il party per 2 round"},
      {id:"ba43",name:"Tentacoli Neri",emoji:"🖤",dmg:"6d6",type:"damage",slots:4,desc:"Tentacoli di oscurità paralizzano i nemici"},
    ],
    5:[
      {id:"ba51",name:"Mass Cura",emoji:"💚",dmg:"-5d8",type:"heal",area:true,slots:5,desc:"Cura massiccia: 5d8+5 HP a tutti gli alleati"},
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

  // ══════════════════════════════════════════
  //  CLASSI SEGRETE — abilità rotte
  // ══════════════════════════════════════════

  necromancer:{
    0:[
      {id:"nc00",name:"Tocco Necrotico",emoji:"💀",dmg:"2d8",type:"damage",slots:0,desc:"Energia della morte che drena la vitalità nemica — gratuito ogni turno"},
      {id:"nc01",name:"Dito della Morte",emoji:"🖤",dmg:"1d10",type:"damage",slots:0,desc:"Un dito puntato che emette energia letale, senza costo"},
    ],
    1:[
      {id:"nc11",name:"Raggio Vitale",emoji:"🩸",dmg:"3d8",type:"damage",slots:1,desc:"Raggio che prosciuga la vita nemica e la trasferisce al Negromante (+MAG/4 HP)"},
      {id:"nc12",name:"Paura",emoji:"😱",dmg:"0",type:"control",slots:1,desc:"Il nemico più potente è paralizzato dal terrore e salta il prossimo turno"},
      {id:"nc13",name:"Ossa Frantumate",emoji:"🦴",dmg:"4d6",type:"damage",slots:1,desc:"Frantuma le ossa del bersaglio riducendo DEF di 3 permanentemente"},
      {id:"nc14",name:"Evoca Scheletro",emoji:"💀",dmg:"0",type:"summon",slots:1,desc:"Evoca uno Scheletro Guerriero obbediente",summon:{name:"Scheletro Guerriero",emoji:"💀",hp:50,atk:14,def:8,dmgDie:"2d8"},maxSummons:3},
    ],
    2:[
      {id:"nc21",name:"Anima il Morto",emoji:"☠️",dmg:"0",type:"reanimate",slots:2,desc:"Anima l'ultimo nemico caduto — combatterà al tuo fianco come non-morto"},
      {id:"nc22",name:"Drenaggio Vitale",emoji:"💉",dmg:"5d8",type:"damage",slots:2,desc:"Assorbe massicci HP nemici — cura il Negromante per metà del danno inflitto"},
      {id:"nc23",name:"Maledizione Putrescente",emoji:"🤢",dmg:"3d10",type:"damage",slots:2,desc:"Maledizione progressiva: il nemico subisce il doppio del danno per 2 round"},
    ],
    3:[
      {id:"nc31",name:"Risurrezione",emoji:"✝️",dmg:"0",type:"resurrect",slots:3,desc:"Riporta in vita il primo alleato caduto con il 60% degli HP massimi"},
      {id:"nc32",name:"Ondata di Non-Morti",emoji:"💀",dmg:"0",type:"summon",slots:3,desc:"Evoca tre Scheletri d'Elite contemporaneamente",summon:{name:"Scheletro d'Elite",emoji:"💀",hp:70,atk:20,def:12,dmgDie:"3d8"},maxSummons:4},
      {id:"nc33",name:"Esplosione di Anime",emoji:"👻",dmg:"8d10",type:"damage",slots:3,desc:"Libera le anime dei caduti in un'esplosione devastante contro tutti i nemici"},
    ],
    4:[
      {id:"nc41",name:"Legione degli Scheletri",emoji:"💀",dmg:"0",type:"summon",slots:4,desc:"Evoca un Signore Non-Morto potenziato dal livello del Negromante",summon:{name:"Signore Non-Morto",emoji:"👑",hp:120,atk:28,def:16,dmgDie:"4d10"},maxSummons:5},
      {id:"nc42",name:"Morte Istantanea",emoji:"💀",dmg:"0",type:"control",slots:4,desc:"Il nemico con meno HP muore istantaneamente (se sotto il 40% HP massimi)"},
      {id:"nc43",name:"Aura della Morte",emoji:"🌑",dmg:"6d12",type:"damage",slots:4,desc:"Aura necrotica che avvolge il campo e danneggia tutti i nemici per 2 round"},
    ],
    5:[
      {id:"nc51",name:"Apocalisse dei Morti",emoji:"☠️",dmg:"12d12",type:"damage",slots:5,desc:"Il potere assoluto della morte: danno devastante su TUTTI i nemici"},
      {id:"nc52",name:"Lich Form",emoji:"💀",dmg:"0",type:"summon",slots:5,desc:"Evoca il Lich Campione, avatar della morte",summon:{name:"Lich Campione",emoji:"💀",hp:200,atk:40,def:22,dmgDie:"5d12"},maxSummons:6},
      {id:"nc53",name:"Resurrezione di Massa",emoji:"✝️",dmg:"0",type:"resurrect_all",slots:5,desc:"Riporta in vita TUTTI gli alleati caduti con il 50% degli HP massimi"},
    ],
  },

  summoner:{
    0:[
      {id:"sm00",name:"Frammento Planare",emoji:"🌀",dmg:"2d6",type:"damage",slots:0,desc:"Scaglia un frammento di energia planare — gratuito ogni turno"},
      {id:"sm01",name:"Manifestazione",emoji:"✨",dmg:"1d8",type:"damage",slots:0,desc:"Una breve manifestazione di potere evocativo, senza costo"},
    ],
    1:[
      {id:"sm11",name:"Evoca Lupo Spettrale",emoji:"🐺",dmg:"0",type:"summon",slots:1,desc:"Evoca un Lupo Spettrale che attacca con ferocia",summon:{name:"Lupo Spettrale",emoji:"🐺",hp:55,atk:16,def:8,dmgDie:"2d8"},maxSummons:5},
      {id:"sm12",name:"Evoca Elementale Minore",emoji:"🔥",dmg:"0",type:"summon",slots:1,desc:"Porta un elementale del fuoco dal piano elementale",summon:{name:"Elementale del Fuoco",emoji:"🔥",hp:60,atk:18,def:6,dmgDie:"2d10"},maxSummons:5},
      {id:"sm13",name:"Legame Planare",emoji:"🌀",dmg:"3d8",type:"damage",slots:1,desc:"Apri un varco instabile che squarcia il nemico con energia planare"},
    ],
    2:[
      {id:"sm21",name:"Evoca Demone delle Ombre",emoji:"😈",dmg:"0",type:"summon",slots:2,desc:"Richiami un demone dal piano delle ombre",summon:{name:"Demone delle Ombre",emoji:"😈",hp:80,atk:22,def:12,dmgDie:"3d10"},maxSummons:5},
      {id:"sm22",name:"Portale Esplosivo",emoji:"🌀",dmg:"6d8",type:"damage",slots:2,desc:"Apri un portale instabile che esplode in faccia ai nemici"},
      {id:"sm23",name:"Evoca Grifone da Guerra",emoji:"🦅",dmg:"0",type:"summon",slots:2,desc:"Un grifone alato obbedisce ai tuoi comandi",summon:{name:"Grifone da Guerra",emoji:"🦅",hp:75,atk:24,def:14,dmgDie:"2d12"},maxSummons:5},
    ],
    3:[
      {id:"sm31",name:"Evoca Drago Minore",emoji:"🐉",dmg:"0",type:"summon",slots:3,desc:"Apri un varco e un giovane drago emerge — devastante",summon:{name:"Drago Minore",emoji:"🐉",hp:110,atk:30,def:18,dmgDie:"3d12"},maxSummons:6},
      {id:"sm32",name:"Tempesta Planare",emoji:"⚡",dmg:"9d10",type:"damage",slots:3,desc:"Convochi l'energia pura di altri piani in una tempesta devastante"},
      {id:"sm33",name:"Evoca Idra",emoji:"🐍",dmg:"0",type:"summon",slots:3,desc:"L'Idra a più teste non smette mai di attaccare",summon:{name:"Idra Evocata",emoji:"🐍",hp:100,atk:26,def:16,dmgDie:"4d10"},maxSummons:6},
    ],
    4:[
      {id:"sm41",name:"Evoca Golem di Cristallo",emoji:"💎",dmg:"0",type:"summon",slots:4,desc:"Un costrutto indistruttibile risponde alla tua chiamata",summon:{name:"Golem di Cristallo",emoji:"💎",hp:150,atk:35,def:24,dmgDie:"4d12"},maxSummons:7},
      {id:"sm42",name:"Convocazione di Massa",emoji:"🌀",dmg:"0",type:"summon",slots:4,desc:"Evoca simultaneamente due potenti creature alleate",summon:{name:"Guardiano Planare",emoji:"👁️",hp:90,atk:28,def:18,dmgDie:"3d12"},maxSummons:7},
      {id:"sm43",name:"Implosione Dimensionale",emoji:"🌌",dmg:"10d10",type:"damage",slots:4,desc:"Il vuoto tra i piani collassa su tutti i nemici con forza distruttiva"},
    ],
    5:[
      {id:"sm51",name:"Evoca Titano",emoji:"🗿",dmg:"0",type:"summon",slots:5,desc:"Il Titano — la creatura più potente dei piani — obbedisce ai tuoi ordini",summon:{name:"Titano Evocato",emoji:"🗿",hp:220,atk:45,def:28,dmgDie:"5d12"},maxSummons:8},
      {id:"sm52",name:"Apocalisse Planare",emoji:"🌌",dmg:"14d10",type:"damage",slots:5,desc:"Apri tutti i portali contemporaneamente: energia pura di ogni piano distrugge ogni nemico"},
      {id:"sm53",name:"Legione Infinita",emoji:"⚔️",dmg:"0",type:"summon",slots:5,desc:"Evoca il Campione dei Piani, l'alleato definitivo",summon:{name:"Campione dei Piani",emoji:"⚔️",hp:180,atk:40,def:25,dmgDie:"4d12"},maxSummons:8},
    ],
  },

  artificer:{
    0:[
      {id:"af00",name:"Granata Mini",emoji:"💣",dmg:"2d8",type:"damage",slots:0,desc:"Piccola granata artigianale — sempre disponibile"},
      {id:"af01",name:"Scossa Elettrica",emoji:"⚡",dmg:"1d10",type:"damage",slots:0,desc:"Guanto elettrico di costruzione propria, senza consumo"},
    ],
    1:[
      {id:"af11",name:"Bomba a Frammentazione",emoji:"💥",dmg:"4d8",type:"damage",slots:1,desc:"Esplode colpendo tutti i nemici nell'area"},
      {id:"af12",name:"Torretta Automatica",emoji:"🤖",dmg:"0",type:"summon",slots:1,desc:"Deploya una torretta da combattimento automatica",summon:{name:"Torretta da Combattimento",emoji:"🤖",hp:60,atk:16,def:10,dmgDie:"2d8"},maxSummons:2},
      {id:"af13",name:"Granata Fumogena",emoji:"💨",dmg:"0",type:"control",slots:1,desc:"Fumo che disorienta i nemici: -4 ATK per 2 round a tutti"},
      {id:"af14",name:"Scudo Energetico",emoji:"🔵",dmg:"0",type:"defense",slots:1,desc:"+8 DEF fino al prossimo turno grazie all'armatura potenziata"},
    ],
    2:[
      {id:"af21",name:"Bomba Termica",emoji:"🌡️",dmg:"6d10",type:"damage",slots:2,desc:"Temperatura estrema che fonde armature e brucia la carne"},
      {id:"af22",name:"Granata Magnetica",emoji:"🧲",dmg:"0",type:"control",slots:2,desc:"Attira i nemici metallici e li immobilizza per 1 round"},
      {id:"af23",name:"Drone d'Attacco",emoji:"🚁",dmg:"0",type:"summon",slots:2,desc:"Drone volante armato che colpisce dall'alto",summon:{name:"Drone d'Attacco",emoji:"🚁",hp:50,atk:20,def:8,dmgDie:"3d8"},maxSummons:2},
      {id:"af24",name:"Esoscheletro Potenziato",emoji:"⚙️",dmg:"0",type:"buff",slots:2,desc:"+5 ATK e +5 DEF per 3 round grazie all'esoscheletro servomotorizzato"},
    ],
    3:[
      {id:"af31",name:"Missile Devastante",emoji:"🚀",dmg:"8d12",type:"damage",slots:3,desc:"Missile telecomandato ad alta carica esplosiva su un singolo bersaglio"},
      {id:"af32",name:"Bomba EMP",emoji:"💡",dmg:"5d10",type:"damage",slots:3,desc:"Impulso elettromagnetico devastante — bypassa completamente la DEF nemica"},
      {id:"af33",name:"Drago Meccanico",emoji:"🤖",dmg:"0",type:"summon",slots:3,desc:"Il pezzo forte: un drago meccanico costruito in segreto",summon:{name:"Drago Meccanico",emoji:"🤖",hp:130,atk:34,def:20,dmgDie:"4d10"},maxSummons:3},
    ],
    4:[
      {id:"af41",name:"Cannone di Plasma",emoji:"🔫",dmg:"10d10",type:"damage",slots:4,desc:"Raggio di plasma che vaporizza tutto ciò che colpisce"},
      {id:"af42",name:"Protocollo Nemesi",emoji:"🎯",dmg:"8d10",type:"damage",slots:4,desc:"Analizza i punti deboli e colpisce con precisione chirurgica — danno raddoppiato"},
      {id:"af43",name:"Mech da Battaglia",emoji:"🦾",dmg:"0",type:"summon",slots:4,desc:"Deploya un mech da battaglia completamente armato",summon:{name:"Mech da Battaglia",emoji:"🦾",hp:170,atk:38,def:22,dmgDie:"4d12"},maxSummons:4},
    ],
    5:[
      {id:"af51",name:"Protocollo Overkill",emoji:"💥",dmg:"14d12",type:"damage",slots:5,desc:"Attiva TUTTI i sistemi d'arma contemporaneamente su ogni nemico presente"},
      {id:"af52",name:"Bomba Nucleare Arcana",emoji:"☢️",dmg:"12d12",type:"damage",slots:5,desc:"La bomba definitiva — distrugge l'intero campo di battaglia"},
      {id:"af53",name:"Titano Meccanico",emoji:"🤖",dmg:"0",type:"summon",slots:5,desc:"Il capolavoro dell'Artefice: un titano meccanico invincibile",summon:{name:"Titano Meccanico",emoji:"🤖",hp:250,atk:48,def:30,dmgDie:"6d12"},maxSummons:5},
    ],
  },

  seductress:{
    0:[
      {id:"sd00",name:"Tocco Infuocato",   emoji:"🔥",dmg:"2d8", type:"damage",slots:0,desc:"Carezza demoniaca che brucia l'anima — gratuita ogni turno"},
      {id:"sd01",name:"Sguardo Ipnotico",  emoji:"👁️",dmg:"1d10",type:"damage",slots:0,desc:"Uno sguardo che paralizza brevemente il nemico, senza costo"},
    ],
    1:[
      {id:"sd11",name:"Bacio della Morte",      emoji:"💋",dmg:"3d8", type:"drain",  drainPct:0.5, slots:1,desc:"Drena la vita del nemico trasferendola alla Seduttrice — cura il 50% del danno inflitto"},
      {id:"sd12",name:"Aura di Seduzione",      emoji:"💗",dmg:"0",   type:"control",area:true, slots:1,desc:"Aura demoniaca: tutti i nemici soffrono -5 ATK per 2 round, ammaliati dalla sua presenza"},
      {id:"sd13",name:"Illusione Perfetta",     emoji:"🌫️",dmg:"0",   type:"defense",slots:1,desc:"Crea un'illusione che assorbe il prossimo attacco nemico — danno azzerato una volta"},
      {id:"sd14",name:"Freccia del Desiderio",  emoji:"💘",dmg:"4d6", type:"damage", slots:1,desc:"Dardo di energia infernale che brucia dall'interno"},
    ],
    2:[
      {id:"sd21",name:"Charme Irresistibile",   emoji:"💜",dmg:"0",    type:"control",slots:2,desc:"Il nemico più forte è ammaliato: salta il turno e attacca i propri alleati"},
      {id:"sd22",name:"Drenaggio dell'Anima",   emoji:"🩸",dmg:"5d8",  type:"drain",  drainPct:0.5, slots:2,desc:"Succhia l'essenza vitale — infligge danno massiccio e cura la Seduttrice per metà"},
      {id:"sd23",name:"Patto Infernale",        emoji:"🔱",dmg:"0",    type:"buff",   slots:2,desc:"Sacrifica 20 HP propri per triplicare il danno del prossimo attacco"},
      {id:"sd24",name:"Velo di Tenebra",        emoji:"🌑",dmg:"4d8",  type:"damage", area:true, slots:2,desc:"Avvolge il campo in un velo oscuro che soffoca i nemici"},
    ],
    3:[
      {id:"sd31",name:"Dominazione Mentale",    emoji:"🧠",dmg:"0",    type:"control",slots:3,desc:"Prende il controllo del nemico più potente: salta il turno ed è costretto ad attaccare i suoi"},
      {id:"sd32",name:"Esplosione di Charme",   emoji:"💥",dmg:"7d8",  type:"damage", area:true, slots:3,desc:"Rilascia tutta la sua energia demoniaca in un'esplosione di potere puro che colpisce TUTTI i nemici"},
      {id:"sd33",name:"Suzione Vitale",         emoji:"💉",dmg:"6d8",  type:"drain",  drainPct:0.6, slots:3,desc:"Drenaggio totale: infligge danno devastante e recupera il 60% come HP"},
    ],
    4:[
      {id:"sd41",name:"Estasi Infernale",       emoji:"🌋",dmg:"9d10", type:"damage", area:true, slots:4,desc:"Energia demoniaca pura che travolge TUTTI i nemici con forza devastante"},
      {id:"sd42",name:"Prigione di Charme",     emoji:"💞",dmg:"0",    type:"control",area:true, slots:4,desc:"Imprigiona tutti i nemici in uno stato di trance — saltano tutti il prossimo turno"},
      {id:"sd43",name:"Vampirismo Assoluto",    emoji:"🦇",dmg:"8d10", type:"drain",  drainPct:0.5, area:true, slots:4,desc:"Drena la vita di tutti i nemici contemporaneamente — cura per il 50% del danno totale"},
    ],
    5:[
      {id:"sd51",name:"Forma Demoniaca",        emoji:"😈",dmg:"0",    type:"buff",   slots:5,desc:"Si trasforma nella sua vera forma: +15 MAG, +8 INIT, +10 ATK per 2 round"},
      {id:"sd52",name:"Apocalisse del Desiderio",emoji:"💀",dmg:"14d10",type:"drain", drainPct:1.0, area:true, slots:5,desc:"Il potere assoluto della seduzione: danno cosmico su tutti i nemici, cura totale della Seduttrice"},
      {id:"sd53",name:"Dominio Totale",         emoji:"👑",dmg:"0",    type:"control",area:true, slots:5,desc:"Nessuno resiste: TUTTI i nemici saltano il turno e si attaccano a vicenda per 1 round"},
    ],
  },

  // ── ZODAR — Custode dell'Equilibrio ∞ ────────────────────────────────────
  custode_equilibrio: {
    0: [
      // ── Magie originali ──
      {
        id:"zd01", name:"Equilibrio Universale", emoji:"⚖️", slots:0, type:"zodar_heal_all",
        desc:"Porta tutti gli alleati al massimo HP istantaneamente. L'equilibrio ripristina ciò che è stato spezzato."
      },
      {
        id:"zd02", name:"Benedizione del Caos", emoji:"🌪️", slots:0, type:"zodar_heal_monsters",
        desc:"Porta tutti i mostri al massimo HP. Zodar ristabilisce il caos quando l'ordine è troppo forte."
      },
      {
        id:"zd03", name:"Flagello dell'Equilibrio", emoji:"☄️", slots:0, type:"zodar_smite_all",
        desc:"Elimina istantaneamente tutti i mostri. Quando il caos diventa troppo, Zodar interviene."
      },
      {
        id:"zd04", name:"Punizione Divina", emoji:"⚡", slots:0, type:"zodar_divine_punishment",
        desc:"9999 danni + stun a tutti i nemici. La bilancia cade sul lato della distruzione."
      },
      {
        id:"zd05", name:"Richiamo dall'Oblio", emoji:"✝️", slots:0, type:"zodar_revive_all",
        desc:"Riporta in vita TUTTI gli alleati caduti — sia chi sta morendo che chi è già morto — a HP pieno."
      },
      {
        id:"zd06", name:"Bilancia della Vita", emoji:"🔮", slots:0, type:"zodar_balance_hp",
        desc:"Ridistribuisce equamente tutti gli HP tra tutti i combattenti. L'equilibrio non conosce preferenze."
      },
      {
        id:"zd07", name:"Velo dell'Eternità", emoji:"🌫️", slots:0, type:"zodar_immortal",
        desc:"Tutti gli alleati diventano immortali per 2 round. Nessun danno può ucciderli."
      },
      {
        id:"zd08", name:"Volere del Caos", emoji:"🎲", slots:0, type:"zodar_chaos",
        desc:"Effetto casuale cosmico: può guarire tutti, distruggere tutti, o ribaltare HP tra alleati e nemici. Imprevedibile."
      },
      {
        id:"zd09", name:"Frattura del Destino", emoji:"💠", slots:0, type:"zodar_end_combat",
        desc:"Termina il combattimento istantaneamente. Zodar decide che è finita — e nessuno può contraddirlo."
      },
      {
        id:"zd10", name:"ZODAR VI OSSERVA", emoji:"👁️", slots:0, type:"zodar_observe",
        desc:"Nessun effetto. Ma tutti sapranno che Zodar è presente. Un messaggio cosmico attraversa il mondo."
      },

      // ── Nuove magie divine — Livello ∞ ──

      // EVOCAZIONE
      {
        id:"zd11", name:"Evoca l'Angelo della Bilancia", emoji:"😇", slots:0, type:"summon",
        summon:{name:"Angelo della Bilancia",emoji:"⚖️",hp:999999,atk:99999,def:99999,dmgDie:"99d999"}, maxSummons:99,
        desc:"Evoca un Angelo della Bilancia direttamente dall'Empireo. Obbedisce solo a Zodar. Inscalfibile."
      },
      {
        id:"zd12", name:"Evoca il Drago Cosmico", emoji:"🐉", slots:0, type:"summon",
        summon:{name:"Drago Cosmico di Zodar",emoji:"🌌",hp:9999999,atk:999999,def:999999,dmgDie:"999d999"}, maxSummons:99,
        desc:"Il Drago Primordiale che dormiva prima della creazione si risvegia al richiamo di Zodar."
      },
      {
        id:"zd13", name:"Evoca i Guardiani Eterni", emoji:"🛡️", slots:0, type:"summon",
        summon:{name:"Guardiano Eterno",emoji:"🌟",hp:5000000,atk:500000,def:999999,dmgDie:"500d999"}, maxSummons:99,
        desc:"Tre Guardiani Eterni si materializzano attorno al party. Nulla può attraversarli."
      },
      {
        id:"zd14", name:"Evoca il Titano dell'Alba", emoji:"🌅", slots:0, type:"summon",
        summon:{name:"Titano dell'Alba",emoji:"☀️",hp:99999999,atk:9999999,def:9999999,dmgDie:"9999d999"}, maxSummons:99,
        desc:"Il Titano nato all'alba del primo giorno scende dal piano superiore. La sua sola presenza fa fuggire i nemici."
      },
      {
        id:"zd15", name:"Evoca la Fenice Immortale", emoji:"🦅", slots:0, type:"summon",
        summon:{name:"Fenice Immortale",emoji:"🔥",hp:7777777,atk:777777,def:777777,dmgDie:"777d777"}, maxSummons:99,
        desc:"La Fenice che non muore mai sorge dal fuoco dell'eternità. Se cade, risorge con HP pieno."
      },

      // ── DANNO % HP ────────────────────────────────────────────────────────
      {
        id:"zd16", name:"Sentenza del Mezzo", emoji:"⚖️", slots:0, type:"zodar_half_hp",
        desc:"Zodar dimezza gli HP attuali di TUTTI i nemici. Inevitabile. Non uccide — li lascia a metà strada."
      },
      {
        id:"zd17", name:"Tocco della Fine", emoji:"🖐️", slots:0, type:"zodar_percent_kill",
        desc:"Porta TUTTI i nemici a 1 HP. L'equilibrio li lascia in vita — per un attimo. Il colpo finale spetta al party."
      },
      {
        id:"zd18", name:"Drenaggio Cosmico", emoji:"🌌", slots:0, type:"zodar_drain_allies",
        desc:"Drena il 40% degli HP attuali da TUTTI i nemici e li trasferisce agli alleati come cura. La bilancia toglie ai forti e dà ai deboli."
      },

      // ── CURA E RIGENERAZIONE ──────────────────────────────────────────────
      {
        id:"zd19", name:"Onda di Guarigione", emoji:"💚", slots:0, type:"zodar_heal_half",
        desc:"Cura tutti gli alleati per metà dei loro HP massimi. Rapida, affidabile, sempre utile."
      },
      {
        id:"zd20", name:"Rigenerazione Cosmica", emoji:"🌿", slots:0, type:"zodar_regen_all",
        desc:"Il party rigenera HP per 5 round: ogni turno recupera il 15% degli HP massimi. Zodar sostiene chi lotta."
      },
      {
        id:"zd21", name:"Resurrezione di Massa", emoji:"✝️", slots:0, type:"zodar_revive_half",
        desc:"Riporta in vita tutti gli alleati caduti con il 50% degli HP. La morte non è permanente sotto gli occhi di Zodar."
      },

      // ── BUFF AGLI ALLEATI ─────────────────────────────────────────────────
      {
        id:"zd22", name:"Benedizione dell'Equilibrio", emoji:"🌟", slots:0, type:"zodar_buff_party",
        desc:"+40 ATK, +40 DEF, +40 MAG a tutti gli alleati per 3 round. Zodar potenzia chi merita di vincere."
      },
      {
        id:"zd23", name:"Scudo Cosmico", emoji:"🛡️", slots:0, type:"zodar_shield_party",
        desc:"Tutti gli alleati guadagnano uno scudo divino per 3 round: il prossimo attacco che ricevono viene assorbito."
      },
      {
        id:"zd24", name:"Occhio di Zodar", emoji:"👁️‍🗨️", slots:0, type:"zodar_godmode",
        desc:"Per 3 round: il party è invincibile (riduzione danni 90%), ogni attacco è automaticamente critico, ogni cura è triplicata."
      },

      // ── DEBUFF AI NEMICI ──────────────────────────────────────────────────
      {
        id:"zd25", name:"Il Peso dell'Eternità", emoji:"⏳", slots:0, type:"zodar_stun_all",
        desc:"Tutti i nemici sono storditi per 3 round. Sono coscienti ma incapaci di muoversi o attaccare."
      },
      {
        id:"zd26", name:"Maledizione della Bilancia", emoji:"⚖️", slots:0, type:"zodar_curse_enemies",
        desc:"Tutti i nemici subiscono -50 ATK, -50 DEF, -50 MAG per 4 round. L'equilibrio li priva di tutto ciò che li rende pericolosi."
      },
      {
        id:"zd27", name:"Inversione della Realtà", emoji:"🔄", slots:0, type:"zodar_reality_flip",
        desc:"Scambia gli HP attuali tra party e nemici. I forti diventano deboli. I deboli si rialzano. Zodar ridisegna il campo."
      },

      // ── ATTACCHI DIVINI (non instant-kill) ───────────────────────────────
      {
        id:"zd28", name:"Fiat Lux", emoji:"✨", slots:0, type:"damage", dmg:"999d999", area:true,
        desc:"Luce primordiale che brucia tutti i nemici. Potente, ma non li cancella — li costringe a combattere."
      },
      {
        id:"zd29", name:"Tempesta Primordiale", emoji:"⛈️", slots:0, type:"damage", dmg:"777d777", area:true,
        desc:"La tempesta cosmica si abbatte su tutti i nemici. Danni enormi, nessun riparo, nessuna difesa conta."
      },

      // ── FINALE ────────────────────────────────────────────────────────────
      {
        id:"zd30", name:"IL GIUDIZIO FINALE DI ZODAR", emoji:"⚖️", slots:0, type:"zodar_final_judgement",
        desc:"La sentenza cosmica definitiva. Una sola. Tutti i nemici vengono cancellati dall'esistenza. Usarla è raro — ma quando la bilancia ha deciso, è finita."
      },
      {
        id:"zd31", name:"Resurrezione Assoluta", emoji:"✝️", slots:0, type:"zodar_resurrection",
        desc:"Zodar sfida la morte stessa. Tutti gli alleati caduti — morti in combattimento, morenti, o ufficialmente morti nel mondo — risorgono a HP pieno e rigenerano HP massimi per 5 round. Anche Zodar stesso, se caduto, risorge. La morte non è permanente quando Zodar decide il contrario."
      },
    ],
  },
};

Object.assign(SPELLS, {
  echo_knight:{
    0:[{id:"ek00",name:"Colpo d'Eco",emoji:"⚔️",dmg:"1d8",type:"damage",slots:0,desc:"La tua eco colpisce insieme a te, tecnica gratuita."}],
    1:[{id:"ek11",name:"Passo Riflesso",emoji:"🌀",dmg:"2d8",type:"damage",slots:1,desc:"Scatti attraverso la tua eco e ferisci il bersaglio."},{id:"ek12",name:"Parata dell'Eco",emoji:"🛡️",dmg:"0",type:"control",slots:1,desc:"L'eco disorienta il nemico: salta il prossimo turno."}],
    2:[{id:"ek21",name:"Doppio Fendente",emoji:"⚔️",dmg:"4d8",type:"damage",slots:2,desc:"Due fendenti sovrapposti da corpo ed eco."}],
    3:[{id:"ek31",name:"Assalto Bifasico",emoji:"💠",dmg:"6d8",type:"damage",slots:3,desc:"Attacco sincronizzato che colpisce tutti i nemici.",area:true}],
  },
  moon_reaver:{
    0:[{id:"mr00",name:"Lama di Luna",emoji:"🌙",dmg:"1d8",type:"damage",slots:0,desc:"Taglio lunare rapido, gratuito."}],
    1:[{id:"mr11",name:"Balzo Notturno",emoji:"🌑",dmg:"3d6",type:"damage",slots:1,desc:"Ti muovi tra le ombre e colpisci un punto scoperto."},{id:"mr12",name:"Eclissi Breve",emoji:"🌘",dmg:"0",type:"control",slots:1,desc:"Oscuri i sensi del bersaglio: salta il prossimo turno."}],
    2:[{id:"mr21",name:"Falce Crescente",emoji:"🌙",dmg:"5d6",type:"damage",slots:2,desc:"Un arco di luce lunare taglia piu nemici.",area:true}],
    3:[{id:"mr31",name:"Caccia di Mezzanotte",emoji:"🗡️",dmg:"7d8",type:"damage",slots:3,desc:"Un'esecuzione rapida favorita dalle fasi lunari."}],
  },
  oathblade:{
    0:[{id:"ob00",name:"Taglio Giurato",emoji:"🗡️",dmg:"1d10",type:"damage",slots:0,desc:"Colpo alimentato da una promessa mantenuta."}],
    1:[{id:"ob11",name:"Vincolo Sacro",emoji:"⛓️",dmg:"3d8",type:"damage",slots:1,desc:"Marchi il nemico con un giuramento doloroso."},{id:"ob12",name:"Parola del Patto",emoji:"⚖️",dmg:"-2d6",type:"heal",slots:1,desc:"Il giuramento sostiene te o un alleato."}],
    2:[{id:"ob21",name:"Sentenza della Lama",emoji:"⚔️",dmg:"5d8",type:"damage",slots:2,desc:"La lama punisce chi rompe l'ordine del patto."}],
    3:[{id:"ob31",name:"Giuramento Impossibile",emoji:"🔥",dmg:"6d8",type:"damage",slots:3,desc:"Promessa estrema che travolge tutti i nemici.",area:true}],
  },
  blade_dancer:{
    0:[{id:"bd00",name:"Passo di Ritmo",emoji:"🗡️",dmg:"1d8",type:"damage",slots:0,desc:"Colpo leggero che mantiene il ritmo."}],
    1:[{id:"bd11",name:"Danza Incrociata",emoji:"⚔️",dmg:"3d6",type:"damage",slots:1,desc:"Sequenza di fendenti rapidi."},{id:"bd12",name:"Finta Rotante",emoji:"💫",dmg:"0",type:"control",slots:1,desc:"Il nemico perde il tempo e salta il turno."}],
    2:[{id:"bd21",name:"Tempesta di Lame",emoji:"🌪️",dmg:"5d6",type:"damage",slots:2,desc:"Danza offensiva che colpisce tutti i nemici.",area:true}],
    3:[{id:"bd31",name:"Finale Perfetto",emoji:"💥",dmg:"7d8",type:"damage",slots:3,desc:"Chiusura brutale di una combo impeccabile."}],
  },
  sigilwarden:{
    0:[{id:"sw00",name:"Sigillo Minore",emoji:"⛨️",dmg:"1d6",type:"damage",slots:0,desc:"Un marchio arcano ferisce il bersaglio."}],
    1:[{id:"sw11",name:"Sigillo di Guardia",emoji:"🛡️",dmg:"-2d6",type:"heal",slots:1,desc:"Ripara ferite e stabilizza l'alleato scelto."},{id:"sw12",name:"Marchio Vincolante",emoji:"🔒",dmg:"0",type:"control",slots:1,desc:"Il bersaglio viene bloccato da rune di contenimento."}],
    2:[{id:"sw21",name:"Muro Runico",emoji:"🔷",dmg:"4d6",type:"damage",slots:2,desc:"Le rune esplodono e travolgono tutti i nemici.",area:true}],
    3:[{id:"sw31",name:"Cerchio Inviolato",emoji:"⭕",dmg:"-3d8",type:"heal",area:true,slots:3,desc:"Cura tutto il party entro il cerchio."}],
  },
  ashen_oracle:{
    0:[{id:"ao00",name:"Favilla Profetica",emoji:"🔥",dmg:"1d8",type:"damage",slots:0,desc:"Una brace del futuro ferisce il bersaglio."}],
    1:[{id:"ao11",name:"Cenere Rivelatrice",emoji:"🌫️",dmg:"3d6",type:"damage",slots:1,desc:"Cenere sacra brucia e rivela il destino del nemico per 2 round."},{id:"ao12",name:"Presagio Spezzato",emoji:"💫",dmg:"0",type:"control",slots:1,desc:"Il nemico vede la propria fine e perde il turno."}],
    2:[{id:"ao21",name:"Pioggia di Braci",emoji:"🔥",dmg:"5d6",type:"damage",slots:2,desc:"Braci divine cadono su tutti i nemici.",area:true}],
    3:[{id:"ao31",name:"Futuro in Fiamme",emoji:"☄️",dmg:"7d8",type:"damage",slots:3,desc:"Un disastro annunciato esplode sul bersaglio."}],
  },
  blood_cartographer:{
    0:[{id:"bc00",name:"Linea di Sangue",emoji:"🗺️",dmg:"1d8",type:"damage",slots:0,desc:"Tracci una linea viva che taglia il bersaglio."}],
    1:[{id:"bc11",name:"Marchio della Mappa",emoji:"📍",dmg:"3d6",type:"damage",slots:1,desc:"Il bersaglio viene segnato e lacerato per 2 round."},{id:"bc12",name:"Sentiero Vietato",emoji:"🚫",dmg:"0",type:"control",slots:1,desc:"Riscrivi il terreno e blocchi il movimento del nemico."}],
    2:[{id:"bc21",name:"Carta Ematica",emoji:"🩸",dmg:"5d6",type:"damage",slots:2,desc:"La mappa si apre sotto tutti i nemici.",area:true}],
    3:[{id:"bc31",name:"Coordinate del Destino",emoji:"🎯",dmg:"7d8",type:"damage",slots:3,desc:"Colpo preciso sul punto debole segnato."}],
  },
  void_sage:{
    0:[{id:"vs00",name:"Scheggia del Vuoto",emoji:"🌌",dmg:"1d10",type:"damage",slots:0,desc:"Frammento cosmico gratuito."}],
    1:[{id:"vs11",name:"Assenza",emoji:"⚫",dmg:"3d8",type:"damage",slots:1,desc:"Il vuoto morde il bersaglio per 2 round."},{id:"vs12",name:"Silenzio Cosmico",emoji:"🔇",dmg:"0",type:"control",slots:1,desc:"Il bersaglio perde contatto con il mondo e salta il turno."}],
    2:[{id:"vs21",name:"Fame Stellare",emoji:"🌑",dmg:"5d8",type:"damage",slots:2,desc:"Ombra cosmica soffoca tutti i nemici per 2 round.",area:true}],
    3:[{id:"vs31",name:"Collasso del Vuoto",emoji:"🕳️",dmg:"8d8",type:"damage",slots:3,desc:"Il nulla collassa sul bersaglio."}],
  },
  herald_zodar:{
    0:[{id:"hz00",name:"Scaglia dell'Equilibrio",emoji:"⚖️",dmg:"1d8",type:"damage",slots:0,desc:"Un verdetto minore di Zodar."}],
    1:[{id:"hz11",name:"Mano della Bilancia",emoji:"⚖️",dmg:"-2d8",type:"heal",slots:1,desc:"Riporta equilibrio guarendo un alleato."},{id:"hz12",name:"Richiamo dell'Ordine",emoji:"🔔",dmg:"0",type:"control",slots:1,desc:"La voce di Zodar ferma il bersaglio."}],
    2:[{id:"hz21",name:"Peso del Giudizio",emoji:"☄️",dmg:"5d8",type:"damage",slots:2,desc:"Il giudizio cade su tutti i nemici.",area:true}],
    3:[{id:"hz31",name:"Intervento Minore",emoji:"✨",dmg:"-3d8",type:"heal",area:true,slots:3,desc:"La bilancia sostiene tutto il party."}],
  },
  relic_tamer:{
    0:[{id:"rt00",name:"Scatto di Reliquia",emoji:"🔱",dmg:"1d8",type:"damage",slots:0,desc:"Una reliquia minore scarica potere."}],
    1:[{id:"rt11",name:"Reliquia Mordente",emoji:"🗡️",dmg:"0",type:"summon",slots:1,desc:"Una reliquia animata combatte per te.",summon:{name:"Reliquia Animata",emoji:"🔱",hp:45,atk:14,def:10,dmgDie:"2d8"},maxSummons:2},{id:"rt12",name:"Sigillo dell'Oggetto",emoji:"📦",dmg:"3d6",type:"damage",slots:1,desc:"Un oggetto caricato esplode sul bersaglio."}],
    2:[{id:"rt21",name:"Teatro di Reliquie",emoji:"🏺",dmg:"5d6",type:"damage",slots:2,desc:"Le reliquie colpiscono tutti i nemici.",area:true}],
    3:[{id:"rt31",name:"Custode Antico",emoji:"🛡️",dmg:"0",type:"summon",slots:3,desc:"Evoca un guardiano reliquiario.",summon:{name:"Guardiano Reliquiario",emoji:"🛡️",hp:90,atk:24,def:18,dmgDie:"3d10"},maxSummons:2}],
  },
  echo_singer:{
    0:[{id:"es00",name:"Nota d'Eco",emoji:"🎵",dmg:"1d8",type:"damage",slots:0,desc:"Una nota risonante colpisce il bersaglio."}],
    1:[{id:"es11",name:"Canto Curativo",emoji:"🎶",dmg:"-2d6",type:"heal",slots:1,desc:"Una melodia ricuce ferite."},{id:"es12",name:"Accordo Spezzato",emoji:"🔊",dmg:"0",type:"control",slots:1,desc:"Il bersaglio perde ritmo e salta il turno."}],
    2:[{id:"es21",name:"Coro degli Echi",emoji:"🎼",dmg:"-3d6",type:"heal",area:true,slots:2,desc:"Cura l'intero party con risonanza."}],
    3:[{id:"es31",name:"Urlo di Risonanza",emoji:"🔔",dmg:"6d8",type:"damage",slots:3,desc:"Onda sonora contro tutti i nemici.",area:true}],
  },
  echo_reaper:{
    0:[{id:"er00",name:"Falce d'Eco",emoji:"☠️",dmg:"1d10",type:"damage",slots:0,desc:"Taglio che raccoglie frammenti di eco."}],
    1:[{id:"er11",name:"Mietitura Minore",emoji:"💀",dmg:"3d8",type:"drain",drainPct:0.35,slots:1,desc:"Danneggia e recupera una parte dell'energia rubata."},{id:"er12",name:"Eco del Caduto",emoji:"👻",dmg:"3d6",type:"damage",slots:1,desc:"Le memorie dei morti graffiano il bersaglio."}],
    2:[{id:"er21",name:"Raccolto Oscuro",emoji:"🌑",dmg:"5d8",type:"drain",drainPct:0.25,area:true,slots:2,desc:"Dreni energia da tutti i nemici."}],
    3:[{id:"er31",name:"Legione di Echi",emoji:"👻",dmg:"7d8",type:"damage",slots:3,desc:"Gli echi raccolti travolgono tutti i nemici.",area:true}],
  },
  seal_inquisitor:{
    0:[{id:"si00",name:"Sigillo Punitivo",emoji:"🔍",dmg:"1d8",type:"damage",slots:0,desc:"Punizione rapida contro magia e corruzione."}],
    1:[{id:"si11",name:"Interdizione",emoji:"🚫",dmg:"0",type:"control",slots:1,desc:"Sigilli il bersaglio: salta il prossimo turno."},{id:"si12",name:"Rottura Scudo",emoji:"🛡️",dmg:"3d8",type:"damage",slots:1,desc:"Colpo che spezza protezioni e difese."}],
    2:[{id:"si21",name:"Cerchio Anti-Magia",emoji:"⭕",dmg:"5d6",type:"damage",area:true,slots:2,desc:"Il cerchio punisce tutti i nemici."}],
    3:[{id:"si31",name:"Verdetto del Sigillo",emoji:"⚖️",dmg:"7d8",type:"damage",slots:3,desc:"Sentenza concentrata sul bersaglio dominante."}],
  },
  blood_alchemist:{
    0:[{id:"baq00",name:"Fiala Ematica",emoji:"🧪",dmg:"1d8",type:"damage",slots:0,desc:"Una fiala viva esplode sul bersaglio."}],
    1:[{id:"baq11",name:"Pozione Vivente",emoji:"🩸",dmg:"-2d8",type:"heal",slots:1,hpCost:3,desc:"Alchimia del sangue che cura rapidamente consumando una piccola quota di HP."},{id:"baq12",name:"Detonazione Organica",emoji:"💥",dmg:"3d8",type:"damage",slots:1,hpCost:4,desc:"Esplosione biologica dolorosa alimentata dal sangue."}],
    2:[{id:"baq21",name:"Nebbia Ematica",emoji:"🌫️",dmg:"5d6",type:"drain",drainPct:0.3,area:true,slots:2,hpCost:7,desc:"Drenaggio diffuso su tutti i nemici, alimentato da HP propri."}],
    3:[{id:"baq31",name:"Mutazione Rossa",emoji:"🧬",dmg:"7d8",type:"damage",slots:3,hpCost:10,desc:"Reazione estrema che lacera il bersaglio e consuma il corpo dell'alchimista."}],
  },
  rune_elder:{
    0:[{id:"re00",name:"Runa Minore",emoji:"ᚱ",dmg:"1d8",type:"damage",slots:0,desc:"Una runa lenta ma precisa."}],
    1:[{id:"re11",name:"Runa di Vincolo",emoji:"ᚱ",dmg:"0",type:"control",slots:1,desc:"La runa blocca il bersaglio."},{id:"re12",name:"Runa di Frattura",emoji:"💠",dmg:"3d10",type:"damage",slots:1,desc:"Incisione arcana ad alto impatto."}],
    2:[{id:"re21",name:"Cerchio Runico",emoji:"⭕",dmg:"5d10",type:"damage",area:true,slots:2,desc:"Rune preparate esplodono su tutti i nemici."}],
    3:[{id:"re31",name:"Nome Antico",emoji:"📜",dmg:"8d10",type:"damage",slots:3,desc:"Pronunci una parola incisa prima del mondo."}],
  },
  cursebreaker:{
    0:[{id:"cb00",name:"Scintilla Purga",emoji:"🔥",dmg:"1d8",type:"damage",slots:0,desc:"Fiamma anti-maledizione."}],
    1:[{id:"cb11",name:"Spezzavelo",emoji:"✨",dmg:"3d8",type:"damage",slots:1,desc:"Rompe ombre, maledizioni e non morti."},{id:"cb12",name:"Rito di Sollievo",emoji:"💚",dmg:"-2d6",type:"heal",slots:1,desc:"Rimuove dolore e ricuce ferite."}],
    2:[{id:"cb21",name:"Cerchio Purificante",emoji:"☀️",dmg:"5d6",type:"damage",area:true,slots:2,desc:"Luce purificatrice su tutti i nemici."}],
    3:[{id:"cb31",name:"Fine della Maledizione",emoji:"🔥",dmg:"7d8",type:"damage",slots:3,desc:"Colpo definitivo contro una fonte corrotta."}],
  },
  star_pilgrim:{
    0:[{id:"sp00",name:"Raggio Stellare",emoji:"⭐",dmg:"1d8",type:"damage",slots:0,desc:"Luce di coordinate lontane."}],
    1:[{id:"sp11",name:"Passo tra Stelle",emoji:"🌌",dmg:"3d8",type:"damage",slots:1,desc:"Appari dietro il bersaglio con luce cosmica."},{id:"sp12",name:"Varchi Minori",emoji:"🌀",dmg:"0",type:"control",slots:1,desc:"Sposta il nemico fuori fase: salta il turno."}],
    2:[{id:"sp21",name:"Costellazione Cadente",emoji:"☄️",dmg:"5d8",type:"damage",area:true,slots:2,desc:"Piccole stelle cadono su tutti i nemici."}],
    3:[{id:"sp31",name:"Porta Astrale",emoji:"🌠",dmg:"7d10",type:"damage",slots:3,desc:"Un varco astrale si chiude sul bersaglio."}],
  },
  soul_forger:{
    0:[{id:"sf00",name:"Martello d'Anima",emoji:"⚒️",dmg:"1d8",type:"damage",slots:0,desc:"Colpo spirituale da forgia interiore."}],
    1:[{id:"sf11",name:"Lama Spirituale",emoji:"⚔️",dmg:"3d8",type:"damage",slots:1,desc:"Forgi un'arma temporanea e colpisci."},{id:"sf12",name:"Scudo d'Anima",emoji:"💠",dmg:"-2d6",type:"heal",slots:1,desc:"Rinforzi l'anima di un alleato."}],
    2:[{id:"sf21",name:"Armeria Spettrale",emoji:"⚔️",dmg:"5d8",type:"damage",area:true,slots:2,desc:"Armi spirituali colpiscono tutti i nemici."}],
    3:[{id:"sf31",name:"Campione Forgiato",emoji:"🛡️",dmg:"0",type:"summon",slots:3,desc:"Forgi un guardiano d'anima.",summon:{name:"Guardiano d'Anima",emoji:"🛡️",hp:95,atk:26,def:16,dmgDie:"3d10"},maxSummons:2}],
  },
  doom_prophet:{
    0:[{id:"dp00",name:"Presagio Minore",emoji:"⏳",dmg:"1d8",type:"damage",slots:0,desc:"Un piccolo segno della fine."}],
    1:[{id:"dp11",name:"Campana della Fine",emoji:"🔔",dmg:"3d8",type:"damage",slots:1,desc:"Il suono della fine ferisce e spaventa."},{id:"dp12",name:"Panico Profetico",emoji:"💫",dmg:"0",type:"control",slots:1,desc:"Il bersaglio vede la rovina e perde il turno."}],
    2:[{id:"dp21",name:"Pioggia di Presagi",emoji:"☄️",dmg:"5d8",type:"damage",area:true,slots:2,desc:"Segni funesti cadono su tutti i nemici."}],
    3:[{id:"dp31",name:"Ultima Ora",emoji:"⏳",dmg:"8d8",type:"damage",slots:3,desc:"La clessidra si svuota sul bersaglio."}],
  },
  maze_keeper:{
    0:[{id:"mk00",name:"Filo del Labirinto",emoji:"🧭",dmg:"1d8",type:"damage",slots:0,desc:"Un filo arcano taglia il percorso del nemico."}],
    1:[{id:"mk11",name:"Muro Improvviso",emoji:"🧱",dmg:"0",type:"control",slots:1,desc:"Il labirinto cambia e blocca il bersaglio."},{id:"mk12",name:"Stanza Tagliente",emoji:"🗡️",dmg:"3d6",type:"damage",slots:1,desc:"Il pavimento diventa una trappola."}],
    2:[{id:"mk21",name:"Corridoio Mobile",emoji:"🌀",dmg:"5d6",type:"damage",area:true,slots:2,desc:"Il labirinto schiaccia tutti i nemici."}],
    3:[{id:"mk31",name:"Centro del Labirinto",emoji:"🧭",dmg:"0",type:"control",area:true,slots:3,desc:"Tutti i nemici perdono orientamento e turno."}],
  },
});

Object.entries({
  echo_knight:{
    4:[{id:"ek41",name:"Frattura Gemella",emoji:"⚔️",dmg:"8d8",type:"damage",area:true,slots:4,desc:"Tu e l'eco aprite due linee temporali nello stesso colpo: tutti i nemici vengono attraversati dalla fenditura."}],
    5:[{id:"ek51",name:"Avatar dell'Eco",emoji:"🛡️",dmg:"0",type:"summon",slots:5,desc:"Rendi solida la tua eco come un secondo cavaliere per il resto dello scontro.",summon:{name:"Avatar dell'Eco",emoji:"🛡️",hp:130,atk:32,def:22,dmgDie:"4d10"},maxSummons:2}],
  },
  moon_reaver:{
    4:[{id:"mr41",name:"Eclissi Totale",emoji:"🌑",dmg:"8d8",type:"damage",area:true,slots:4,desc:"La luna scompare e il campo diventa caccia: ombra tagliente su tutti i nemici."}],
    5:[{id:"mr51",name:"Luna Sanguigna",emoji:"🌕",dmg:"10d8",type:"drain",drainPct:0.35,slots:5,desc:"Un'esecuzione lunare che ruba vita al bersaglio e la riversa nel cacciatore."}],
  },
  oathblade:{
    4:[{id:"ob41",name:"Patto Infranto",emoji:"⚖️",dmg:"8d8",type:"damage",slots:4,desc:"La lama punisce il nemico che ha violato il giuramento e lo lascia tremante per 2 round."}],
    5:[{id:"ob51",name:"Voto Eterno",emoji:"🔥",dmg:"9d8",type:"damage",area:true,slots:5,desc:"Il giuramento diventa incendio sacro: danno ad area e pressione morale sui nemici."}],
  },
  blade_dancer:{
    4:[{id:"bd41",name:"Cento Tagli",emoji:"🗡️",dmg:"9d6",type:"damage",area:true,slots:4,desc:"Una danza rapidissima distribuisce fendenti su tutto il fronte nemico."}],
    5:[{id:"bd51",name:"Apoteosi del Ritmo",emoji:"💥",dmg:"11d8",type:"damage",slots:5,desc:"La combo perfetta scarica tutto il ritmo accumulato in un singolo finale devastante."}],
  },
  sigilwarden:{
    4:[{id:"sw41",name:"Fortezza dei Sigilli",emoji:"🛡️",dmg:"-5d8",type:"heal",area:true,slots:4,desc:"Un anello di rune ripara tutto il party e rinforza la linea."}],
    5:[{id:"sw51",name:"Sigillo Primo",emoji:"🔒",dmg:"9d8",type:"damage",area:true,slots:5,desc:"Il sigillo originale si chiude sui nemici: danno e blocco arcano di massa."}],
  },
  ashen_oracle:{
    4:[{id:"ao41",name:"Apocalisse in Cenere",emoji:"🔥",dmg:"9d8",type:"damage",area:true,slots:4,desc:"Il futuro peggiore cade in forma di cenere ardente su tutti i nemici."}],
    5:[{id:"ao51",name:"Fenice Profetica",emoji:"✨",dmg:"-6d8",type:"heal",area:true,slots:5,desc:"Una fenice di cenere rialza il party e brucia il destino avverso."}],
  },
  blood_cartographer:{
    4:[{id:"bc41",name:"Atlante delle Vene",emoji:"🗺️",dmg:"8d8",type:"drain",drainPct:0.3,area:true,slots:4,desc:"Disegni la circolazione del campo e dreni forza da ogni nemico segnato."}],
    5:[{id:"bc51",name:"Mappa del Destino",emoji:"📍",dmg:"11d8",type:"damage",slots:5,desc:"La mappa trova un punto impossibile: il colpo arriva dove il bersaglio non puo difendersi."}],
  },
  void_sage:{
    4:[{id:"vs41",name:"Singolarita",emoji:"🕳️",dmg:"9d10",type:"damage",area:true,slots:4,desc:"Il vuoto comprime il campo e lacera tutti i nemici."}],
    5:[{id:"vs51",name:"Cancellazione",emoji:"⚫",dmg:"12d10",type:"damage",slots:5,desc:"Una porzione del bersaglio viene rimossa dal mondo per un istante."}],
  },
  herald_zodar:{
    4:[{id:"hz41",name:"Decreto della Bilancia",emoji:"⚖️",dmg:"8d8",type:"damage",area:true,slots:4,desc:"Zodar pesa il campo: chi eccede viene ferito, chi resiste sente la sentenza."}],
    5:[{id:"hz51",name:"Armonia Suprema",emoji:"✨",dmg:"-7d8",type:"heal",area:true,slots:5,desc:"La bilancia si riallinea e il party recupera sotto un verdetto cosmico."}],
  },
  relic_tamer:{
    4:[{id:"rt41",name:"Reliquiario Vivente",emoji:"🏺",dmg:"0",type:"summon",slots:4,desc:"Un reliquiario animato entra in battaglia e protegge il gruppo.",summon:{name:"Reliquiario Vivente",emoji:"🏺",hp:120,atk:28,def:22,dmgDie:"4d8"},maxSummons:2}],
    5:[{id:"rt51",name:"Processione delle Reliquie",emoji:"🔱",dmg:"10d8",type:"damage",area:true,slots:5,desc:"Tutte le reliquie rispondono insieme, travolgendo i nemici con scariche antiche."}],
  },
  echo_singer:{
    4:[{id:"es41",name:"Sinfonia degli Echi",emoji:"🎼",dmg:"-5d10",type:"heal",area:true,slots:4,desc:"Un coro risonante cura tutto il party e stabilizza gli alleati vicini al crollo."}],
    5:[{id:"es51",name:"Nota Impossibile",emoji:"🔊",dmg:"10d8",type:"damage",area:true,slots:5,desc:"Una nota che non dovrebbe esistere spezza il ritmo dei nemici e li investe."}],
  },
  echo_reaper:{
    4:[{id:"er41",name:"Tributo dei Caduti",emoji:"☠️",dmg:"9d8",type:"drain",drainPct:0.3,area:true,slots:4,desc:"Gli echi raccolti pretendono pagamento da tutti i nemici."}],
    5:[{id:"er51",name:"Mietitura Finale",emoji:"💀",dmg:"12d8",type:"damage",area:true,slots:5,desc:"Una falce corale cala sul campo, piu feroce se la classe ha accumulato Echi."}],
  },
  seal_inquisitor:{
    4:[{id:"si41",name:"Tribunale del Sigillo",emoji:"⚖️",dmg:"8d8",type:"damage",area:true,slots:4,desc:"Il tribunale arcano giudica tutti i nemici e ne interrompe le magie."}],
    5:[{id:"si51",name:"Abiura Suprema",emoji:"🚫",dmg:"11d8",type:"damage",slots:5,desc:"Il sigillo cancella protezioni, evocazioni e menzogne intorno al bersaglio."}],
  },
  blood_alchemist:{
    4:[{id:"baq41",name:"Cuore Reattivo",emoji:"🧪",dmg:"9d8",type:"drain",drainPct:0.4,area:true,slots:4,hpCost:14,desc:"Il sangue diventa catalizzatore instabile: drena tutti i nemici ma costa HP."}],
    5:[{id:"baq51",name:"Grande Trasfusione Rossa",emoji:"🩸",dmg:"12d8",type:"damage",area:true,slots:5,hpCost:18,desc:"Una reazione proibita esplode dal corpo dell'alchimista e travolge il campo."}],
  },
  rune_elder:{
    4:[{id:"re41",name:"Tavola delle Prime Rune",emoji:"ᚱ",dmg:"10d10",type:"damage",area:true,slots:4,desc:"Le prime incisioni del mondo si accendono sotto tutti i nemici."}],
    5:[{id:"re51",name:"Nome Vero della Rovina",emoji:"📜",dmg:"13d10",type:"damage",slots:5,desc:"Pronunci un nome antico che la materia ricorda ancora con terrore."}],
  },
  cursebreaker:{
    4:[{id:"cb41",name:"Rogo delle Catene",emoji:"🔥",dmg:"8d8",type:"damage",area:true,slots:4,desc:"Ogni maledizione diventa combustibile e brucia contro chi l'ha portata."}],
    5:[{id:"cb51",name:"Assoluzione Radiante",emoji:"☀️",dmg:"-6d10",type:"heal",area:true,slots:5,desc:"Una purga luminosa cura il party e spezza le pressioni oscure residue."}],
  },
  star_pilgrim:{
    4:[{id:"sp41",name:"Cometa Guidata",emoji:"☄️",dmg:"9d10",type:"damage",area:true,slots:4,desc:"Le Coordinate Stellari richiamano una traiettoria precisa sul campo."}],
    5:[{id:"sp51",name:"Porta tra Mondi",emoji:"🌌",dmg:"11d10",type:"damage",area:true,slots:5,desc:"Apri un varco cosmico che inghiotte spazio, posizione e difese nemiche."}],
  },
  soul_forger:{
    4:[{id:"sf41",name:"Forgia delle Anime",emoji:"⚒️",dmg:"9d8",type:"damage",area:true,slots:4,desc:"Le anime forgiate diventano armi incandescenti contro tutto il fronte."}],
    5:[{id:"sf51",name:"Colosso Spirituale",emoji:"🛡️",dmg:"0",type:"summon",slots:5,desc:"Forgi un colosso d'anima che cresce meglio con le cariche spirituali accumulate.",summon:{name:"Colosso Spirituale",emoji:"🛡️",hp:145,atk:34,def:24,dmgDie:"4d10"},maxSummons:2}],
  },
  doom_prophet:{
    4:[{id:"dp41",name:"Settimo Presagio",emoji:"⏳",dmg:"9d10",type:"damage",area:true,slots:4,desc:"La rovina annunciata arriva prima del previsto e colpisce tutti."}],
    5:[{id:"dp51",name:"Fine Scritta",emoji:"☄️",dmg:"13d8",type:"damage",area:true,slots:5,desc:"Il Profeta legge l'ultima riga dello scontro: devastante quando i Presagi sono alti."}],
  },
  maze_keeper:{
    4:[{id:"mk41",name:"Stanze Sovrapposte",emoji:"🧭",dmg:"8d8",type:"damage",area:true,slots:4,desc:"Più stanze occupano lo stesso punto e schiacciano tutti i nemici."}],
    5:[{id:"mk51",name:"Cuore del Labirinto",emoji:"🌀",dmg:"9d8",type:"damage",area:true,slots:5,desc:"Il centro del labirinto si apre: danno ad area e disorientamento profondo."}],
  },
}).forEach(([classKey, tiers]) => {
  SPELLS[classKey] = { ...(SPELLS[classKey] || {}), ...tiers };
});
