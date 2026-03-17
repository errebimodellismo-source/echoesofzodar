// src/data/spellsData.js

export const SPELL_SLOTS = {
  1:{1:2,2:0,3:0,4:0,5:0}, 2:{1:3,2:0,3:0,4:0,5:0}, 3:{1:4,2:2,3:0,4:0,5:0},
  4:{1:4,2:3,3:0,4:0,5:0}, 5:{1:4,2:3,3:2,4:0,5:0}, 6:{1:4,2:3,3:3,4:0,5:0},
  7:{1:4,2:3,3:3,4:1,5:0}, 8:{1:4,2:3,3:3,4:2,5:0}, 9:{1:4,2:3,3:3,4:3,5:1},
  10:{1:4,2:3,3:3,4:3,5:2}
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
