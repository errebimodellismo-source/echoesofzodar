// src/data/questsData.js

export const DEFAULT_QUESTS = [
  {
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
  }
];
