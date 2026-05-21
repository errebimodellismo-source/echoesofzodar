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
  },

  // ── FACILE (fq1–fq50) ─────────────────────────────────────────────────────
  {
    id:"fq1", title:"Ratti nelle Fogne di Stonehaven", active:true,
    desc:"Le fogne sotto la città pullulano di ratti giganti. Il Sindaco offre una taglia a chiunque ripulisca i tunnel prima della festa del raccolto.",
    flavor:"«Non sono topi normali. Occhi rossi e denti come pugnali.» — Soldwin, spazzino capo",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"I tunnel sotto Stonehaven puzzano di umidità e marciume. Funghi bioluminescenti illuminano le pareti mentre i cigolii si moltiplicano nell'oscurità."},
      {type:"choice",text:"A un incrocio notate zanne conficcate nel legno marcio e tracce di sangue che portano a nord.",choices:[
        {label:"🔦 Seguite le tracce con cautela",xp:12,gold:6,next:2,correct:true},
        {label:"🔥 Gettate una torcia verso il rumore",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Urlate per fare chiarezza",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Ratti Giganti** e la loro **Femmina Alfa** emergono dalla melma!",monsters:[
        {id:"fq1_r1",name:"Ratto Gigante",emoji:"🐀",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
        {id:"fq1_r2",name:"Ratto Gigante",emoji:"🐀",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
        {id:"fq1_r3",name:"Ratto Gigante",emoji:"🐀",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
        {id:"fq1_alfa",name:"Femmina Alfa",emoji:"🐁",hp:36,maxHp:36,atk:9,def:3,xp:26,isBoss:false}
      ]},
      {type:"loot",text:"Il nido è ripulito. Tra i rifiuti trovate monete dimenticate e un ciondolo perso da qualche sventurato.",loot:{gold:[12,22],items:["Pozione di Cura","Ciondolo del Minatore"]}}
    ],
    enemies:[
      {id:"fq1_r1",name:"Ratto Gigante",emoji:"🐀",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
      {id:"fq1_r2",name:"Ratto Gigante",emoji:"🐀",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
      {id:"fq1_r3",name:"Ratto Gigante",emoji:"🐀",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
      {id:"fq1_alfa",name:"Femmina Alfa",emoji:"🐁",hp:36,maxHp:36,atk:9,def:3,xp:26,isBoss:false}
    ],
  },{
    id:"fq2", title:"Il Mulino Infestato", active:true,
    desc:"Il vecchio mulino sul confine del villaggio è infestato da spiriti. I mugnai non osano più lavorare e la farina scarseggia.",
    flavor:"«Le ruote girano da sole di notte. E si sentono voci nel grano.» — Morten, mugnaio",
    difficulty:"facile", xpReward:125, goldReward:52,
    steps:[
      {type:"narrative",text:"Il mulino cigola nell'oscurità. Le pale ruotano senza vento e l'aria odora di grano bruciato e qualcosa di più antico."},
      {type:"choice",text:"Sul pavimento c'è un cerchio di farina con simboli tracciati al suo interno.",choices:[
        {label:"🕯️ Spezzate il cerchio con sale benedetto",xp:12,gold:6,next:2,correct:true},
        {label:"🚪 Sgomberate la zona e bruciate il mulino",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiamate lo spirito per nome",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Spiriti del Grano** si sollevano dalla polvere e uno **Spettro Antico** blocca l'uscita!",monsters:[
        {id:"fq2_s1",name:"Spirito del Grano",emoji:"👻",hp:20,maxHp:20,atk:6,def:1,xp:16,isBoss:false},
        {id:"fq2_s2",name:"Spirito del Grano",emoji:"👻",hp:20,maxHp:20,atk:6,def:1,xp:16,isBoss:false},
        {id:"fq2_antico",name:"Spettro Antico",emoji:"🌫️",hp:40,maxHp:40,atk:10,def:2,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"Il mulino tace. Tra le macine trovate una borsa dimenticata dal vecchio mugnaio con qualche moneta e una fiaschetta.",loot:{gold:[10,20],items:["Tonico di Fogliarossa","Benda Incerata"]}}
    ],
    enemies:[
      {id:"fq2_s1",name:"Spirito del Grano",emoji:"👻",hp:20,maxHp:20,atk:6,def:1,xp:16,isBoss:false},
      {id:"fq2_s2",name:"Spirito del Grano",emoji:"👻",hp:20,maxHp:20,atk:6,def:1,xp:16,isBoss:false},
      {id:"fq2_antico",name:"Spettro Antico",emoji:"🌫️",hp:40,maxHp:40,atk:10,def:2,xp:30,isBoss:false}
    ],
  },{
    id:"fq3", title:"Banditi sul Sentiero del Salice", active:true,
    desc:"Una banda di briganti ha teso un'imboscata sulla strada commerciale. I mercanti non riescono più a raggiungere il mercato settimanale.",
    flavor:"«Prendono tutto: merci, monete e la voglia di viaggiare.» — Lena, mercante di stoffe",
    difficulty:"facile", xpReward:135, goldReward:57,
    steps:[
      {type:"narrative",text:"Il Sentiero del Salice è silenziato. Carri rovesciati ai lati della strada e borse tagliate segnano il territorio dei briganti."},
      {type:"choice",text:"Vedete tre fuochi di bivacco oltre una siepe e sentite risate grossolane.",choices:[
        {label:"🌿 Avanzate di fianco nel bosco per coglierli di sorpresa",xp:14,gold:7,next:2,correct:true},
        {label:"⚔️ Caricate frontalmente al galoppo",xp:0,gold:0,next:2,correct:false},
        {label:"📯 Suonate il corno per spaventarli",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Briganti** balzano fuori e il loro **Capobranco Scarface** sfila la lama!",monsters:[
        {id:"fq3_b1",name:"Brigante",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:18,isBoss:false},
        {id:"fq3_b2",name:"Brigante",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:18,isBoss:false},
        {id:"fq3_scarface",name:"Capobranco Scarface",emoji:"💀",hp:44,maxHp:44,atk:11,def:4,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"I briganti fuggono o cadono. Nel covo trovate la merce rubata e la cassa delle taglie.",loot:{gold:[15,28],items:["Spada Corta Affilata","Mantello del Viandante"]}}
    ],
    enemies:[
      {id:"fq3_b1",name:"Brigante",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:18,isBoss:false},
      {id:"fq3_b2",name:"Brigante",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:18,isBoss:false},
      {id:"fq3_scarface",name:"Capobranco Scarface",emoji:"💀",hp:44,maxHp:44,atk:11,def:4,xp:32,isBoss:false}
    ],
  },{
    id:"fq4", title:"Le Rane del Lago Marrone", active:true,
    desc:"Rane giganti e velenose infestano il Lago Marrone. I pescatori non possono più avvicinarsi all'acqua senza rischiare la vita.",
    flavor:"«Una rana grande come un bue mi ha quasi ingoiato il braccio.» — Piero, pescatore",
    difficulty:"facile", xpReward:128, goldReward:52,
    steps:[
      {type:"narrative",text:"La riva del lago è coperta di uova gelatinose e impronte gigantesche. L'acqua gorgoglia in modo innaturale."},
      {type:"choice",text:"Notate un nido enorme tra le canne. Le rane sembrano coordinate, quasi intelligenti.",choices:[
        {label:"🎣 Attiratele con esche avvelenate",xp:12,gold:6,next:2,correct:true},
        {label:"🔥 Date fuoco alle canne",xp:0,gold:0,next:2,correct:false},
        {label:"💦 Nuotate verso il nido",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Rane Velenose** saltano fuori e la **Rana Madre** emerge dal fango con un gracidio terrificante!",monsters:[
        {id:"fq4_f1",name:"Rana Velenosa",emoji:"🐸",hp:19,maxHp:19,atk:6,def:2,xp:15,isBoss:false},
        {id:"fq4_f2",name:"Rana Velenosa",emoji:"🐸",hp:19,maxHp:19,atk:6,def:2,xp:15,isBoss:false},
        {id:"fq4_madre",name:"Rana Madre",emoji:"🐊",hp:42,maxHp:42,atk:10,def:3,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"Il lago torna calmo. I pescatori vi ricompensano con parte del pescato e un vecchio talismano trovato nel nido.",loot:{gold:[11,20],items:["Antidoto di Erbe","Ciondolo del Pescatore"]}}
    ],
    enemies:[
      {id:"fq4_f1",name:"Rana Velenosa",emoji:"🐸",hp:19,maxHp:19,atk:6,def:2,xp:15,isBoss:false},
      {id:"fq4_f2",name:"Rana Velenosa",emoji:"🐸",hp:19,maxHp:19,atk:6,def:2,xp:15,isBoss:false},
      {id:"fq4_madre",name:"Rana Madre",emoji:"🐊",hp:42,maxHp:42,atk:10,def:3,xp:30,isBoss:false}
    ],
  },{
    id:"fq5", title:"L'Ovile Assalito dai Lupi", active:true,
    desc:"Un branco di lupi ha attaccato gli ovili di una famiglia di pastori. Se non si interviene, perderanno l'intero gregge.",
    flavor:"«Vengono ogni notte. Mio figlio non dorme più.» — Agata, pastora",
    difficulty:"facile", xpReward:125, goldReward:50,
    steps:[
      {type:"narrative",text:"L'ovile puzza di paura. Le pecore belano freneticamente mentre orme profonde circondano il recinto."},
      {type:"choice",text:"Le tracce portano verso il bosco di quercia a ovest. Il branco sembra aver stabilito un accampamento fisso.",choices:[
        {label:"🪤 Tendete trappole all'ingresso del bosco",xp:11,gold:5,next:2,correct:true},
        {label:"🔔 Fate suonare le campane del villaggio",xp:0,gold:0,next:2,correct:false},
        {label:"🐑 Usate una pecora come esca",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Lupi Selvatici** ringhiano e il **Lupo Grigio Anziano** li guida all'attacco!",monsters:[
        {id:"fq5_l1",name:"Lupo Selvatico",emoji:"🐺",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq5_l2",name:"Lupo Selvatico",emoji:"🐺",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq5_anziano",name:"Lupo Grigio Anziano",emoji:"🦴",hp:38,maxHp:38,atk:10,def:3,xp:26,isBoss:false}
      ]},
      {type:"loot",text:"Il branco si disperde. I pastori vi offrono formaggio stagionato, lana e il contenuto della loro cassa delle emergenze.",loot:{gold:[10,18],items:["Pozione di Cura","Mantello di Lana"]}}
    ],
    enemies:[
      {id:"fq5_l1",name:"Lupo Selvatico",emoji:"🐺",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq5_l2",name:"Lupo Selvatico",emoji:"🐺",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq5_anziano",name:"Lupo Grigio Anziano",emoji:"🦴",hp:38,maxHp:38,atk:10,def:3,xp:26,isBoss:false}
    ],
  },{
    id:"fq6", title:"Il Nido dell'Aquila Maledetta", active:true,
    desc:"Un'aquila di dimensioni innaturali attacca i viandanti sul Passo di Cresta Alta. Si dice sia maledetta da un antico rituale.",
    flavor:"«Ha l'apertura alare di una barca. E gli occhi viola.» — Taryn, guardia di frontiera",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"Il passo è disseminato di piume nere e artigliate. In cima alla roccia più alta il nido oscilla nel vento come una fortezza in miniatura."},
      {type:"choice",text:"L'aquila non è sola: si intravvedono altri rapaci intorno al nido.",choices:[
        {label:"🏹 Salite di lato per avvicinarvi senza essere visti",xp:12,gold:6,next:2,correct:true},
        {label:"🔥 Accendete un fuoco per disturbare l'aquila",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Agitate le braccia per spaventarla",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Rapaci della Cresta** scendono in picchiata e l'**Aquila Maledetta** spalanca le ali!",monsters:[
        {id:"fq6_r1",name:"Rapace della Cresta",emoji:"🦅",hp:20,maxHp:20,atk:7,def:2,xp:16,isBoss:false},
        {id:"fq6_r2",name:"Rapace della Cresta",emoji:"🦅",hp:20,maxHp:20,atk:7,def:2,xp:16,isBoss:false},
        {id:"fq6_aquila",name:"Aquila Maledetta",emoji:"🦉",hp:42,maxHp:42,atk:11,def:3,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"Il nido è libero. Tra rami e prede accumulate trovate oggetti dei viandanti derubati nei mesi scorsi.",loot:{gold:[13,22],items:["Frecce Benedette","Anello di Bronzo"]}}
    ],
    enemies:[
      {id:"fq6_r1",name:"Rapace della Cresta",emoji:"🦅",hp:20,maxHp:20,atk:7,def:2,xp:16,isBoss:false},
      {id:"fq6_r2",name:"Rapace della Cresta",emoji:"🦅",hp:20,maxHp:20,atk:7,def:2,xp:16,isBoss:false},
      {id:"fq6_aquila",name:"Aquila Maledetta",emoji:"🦉",hp:42,maxHp:42,atk:11,def:3,xp:30,isBoss:false}
    ],
  },{
    id:"fq7", title:"La Bottega del Truffatore", active:true,
    desc:"Un falso alchimista vende pozioni pericolose al mercato. Dietro la sua bancarella si nascondono cultisti che lo proteggono.",
    flavor:"«Mi ha venduto una pozione di cura che mi ha fatto cadere i capelli.» — Brix, soldato",
    difficulty:"facile", xpReward:135, goldReward:58,
    steps:[
      {type:"narrative",text:"La bottega del misterioso 'Dottor Vrannix' puzza di zolfo sotto il profumo di lavanda. I flaconi colorati nascondono qualcosa di più oscuro."},
      {type:"choice",text:"Vrannix vi accoglie con un sorriso troppo largo. I suoi due assistenti vi fissano senza battere ciglio.",choices:[
        {label:"🔍 Esaminate le pozioni di nascosto",xp:13,gold:7,next:2,correct:true},
        {label:"💰 Comprate una pozione per testarla subito",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Accusatelo davanti a tutti",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Smascherato, Vrannix urla. I due **Cultisti Guardia** sfoggiano le lame e il **Truffatore Vrannix** lancia una fiala acida!",monsters:[
        {id:"fq7_c1",name:"Cultista Guardia",emoji:"🗡️",hp:23,maxHp:23,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq7_c2",name:"Cultista Guardia",emoji:"🗡️",hp:23,maxHp:23,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq7_vrannix",name:"Truffatore Vrannix",emoji:"⚗️",hp:30,maxHp:30,atk:9,def:2,xp:24,isBoss:false}
      ]},
      {type:"loot",text:"La bottega è sequestrata. Tra i scaffali trovate alcune pozioni genuine e il fondo cassa del truffatore.",loot:{gold:[15,25],items:["Pozione di Cura","Pozione di Forza"]}}
    ],
    enemies:[
      {id:"fq7_c1",name:"Cultista Guardia",emoji:"🗡️",hp:23,maxHp:23,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq7_c2",name:"Cultista Guardia",emoji:"🗡️",hp:23,maxHp:23,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq7_vrannix",name:"Truffatore Vrannix",emoji:"⚗️",hp:30,maxHp:30,atk:9,def:2,xp:24,isBoss:false}
    ],
  },{
    id:"fq8", title:"Serpenti nel Granaio", active:true,
    desc:"Serpenti giganti hanno infestato il granaio del villaggio di Campochiaro. Se non si sgombera il magazzino, l'inverno sarà famino.",
    flavor:"«Sono entrati dalla grondaia e non escono più. Ce ne sono almeno dodici.» — Fiora, fattoressa",
    difficulty:"facile", xpReward:130, goldReward:54,
    steps:[
      {type:"narrative",text:"Il granaio puzza di muschio e squame. Tra le balle di grano sentite il sussurro di qualcosa che striscia."},
      {type:"choice",text:"Le balle più alte sembrano crollate: qualcosa di pesante ci si è arrotolato sopra.",choices:[
        {label:"🪨 Sollevate una balla come scudo e avanzate",xp:12,gold:6,next:2,correct:true},
        {label:"🔥 Date fuoco alle balle di paglia",xp:0,gold:0,next:2,correct:false},
        {label:"🐀 Liberate un topo per distrarre i serpenti",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Serpenti del Grano** si avvolgono intorno alle travi e il **Boa del Granaio** blocca l'uscita!",monsters:[
        {id:"fq8_ser1",name:"Serpente del Grano",emoji:"🐍",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
        {id:"fq8_ser2",name:"Serpente del Grano",emoji:"🐍",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
        {id:"fq8_boa",name:"Boa del Granaio",emoji:"🐍",hp:44,maxHp:44,atk:10,def:3,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"Il granaio è libero. La fattoressa vi regala viveri per il viaggio e una vecchia moneta d'argento.",loot:{gold:[12,20],items:["Razioni da Viaggio","Scudo di Legno Rinforzato"]}}
    ],
    enemies:[
      {id:"fq8_ser1",name:"Serpente del Grano",emoji:"🐍",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
      {id:"fq8_ser2",name:"Serpente del Grano",emoji:"🐍",hp:18,maxHp:18,atk:5,def:1,xp:14,isBoss:false},
      {id:"fq8_boa",name:"Boa del Granaio",emoji:"🐍",hp:44,maxHp:44,atk:10,def:3,xp:30,isBoss:false}
    ],
  },{
    id:"fq9", title:"Il Fantasma della Locanda del Cigno", active:true,
    desc:"La locanda più famosa della regione è infestata da un fantasma che sveglia gli ospiti di notte e spaventa i clienti.",
    flavor:"«Ogni notte alle tre sposta i mobili e sibila ai dormenti.» — Margo, locandiera",
    difficulty:"facile", xpReward:125, goldReward:52,
    steps:[
      {type:"narrative",text:"La locanda è deserta a quest'ora. I candelabri oscillano senza vento e dall'alto arriva il suono di passi su legno cigolante."},
      {type:"choice",text:"In camera tre trovate un medaglione sul pavimento e un messaggio graffiato nella parete: *«Restituiscimi ciò che è mio»*.",choices:[
        {label:"🕯️ Cercate la storia del fantasma nella cantina",xp:11,gold:5,next:2,correct:true},
        {label:"🪟 Aprite tutte le finestre per far uscire lo spirito",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiamate il fantasma a gran voce",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Lo spirito non vuole andarsene! Il **Fantasma del Locandiere** si scaglia su di voi e i **Mobili Animati** obbediscono alla sua furia!",monsters:[
        {id:"fq9_fant",name:"Fantasma del Locandiere",emoji:"👻",hp:35,maxHp:35,atk:9,def:2,xp:26,isBoss:false},
        {id:"fq9_mob",name:"Mobili Animati",emoji:"🪑",hp:22,maxHp:22,atk:5,def:3,xp:15,isBoss:false}
      ]},
      {type:"loot",text:"Il fantasma si dissolve in un sospiro. Margo vi offre una notte gratuita e il contenuto della cassetta delle mance.",loot:{gold:[10,18],items:["Tonico di Fogliarossa","Chiave della Cantina"]}}
    ],
    enemies:[
      {id:"fq9_fant",name:"Fantasma del Locandiere",emoji:"👻",hp:35,maxHp:35,atk:9,def:2,xp:26,isBoss:false},
      {id:"fq9_mob",name:"Mobili Animati",emoji:"🪑",hp:22,maxHp:22,atk:5,def:3,xp:15,isBoss:false}
    ],
  },{
    id:"fq10", title:"Il Carretto Derubato", active:true,
    desc:"Un mercante è stato derubato da una banda di ladri che usa le foreste a est come covo. Recuperate le merci e portate la banda alla giustizia.",
    flavor:"«Erano in cinque. Uno aveva una cicatrice a forma di fulmine sulla guancia.» — Orvo, mercante",
    difficulty:"facile", xpReward:132, goldReward:56,
    steps:[
      {type:"narrative",text:"Seguendo le ruote del carretto attraverso il fango, entrate in un bosco fitto. Il profumo di fumo e carne arrostita vi guida verso il covo."},
      {type:"choice",text:"Il covo è in una radura: tre tende, un fuoco e sentinelle piuttosto distratte.",choices:[
        {label:"🌿 Aggirate il fuoco e neutralizzate le sentinelle",xp:13,gold:7,next:2,correct:true},
        {label:"⚔️ Caricate direttamente verso le tende",xp:0,gold:0,next:2,correct:false},
        {label:"🎵 Suonate uno strumento per confonderli",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Le sentinelle gridano! Due **Ladri del Bosco** e il **Capobanda Fulmine** sfoggiano le armi!",monsters:[
        {id:"fq10_l1",name:"Ladro del Bosco",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq10_l2",name:"Ladro del Bosco",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq10_fulmine",name:"Capobanda Fulmine",emoji:"⚡",hp:42,maxHp:42,atk:11,def:3,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"Le merci sono recuperate. Nel covo trovate anche il bottino di altre rapine: monete e oggetti di valore.",loot:{gold:[15,28],items:["Mantello del Viandante","Daga Affilata"]}}
    ],
    enemies:[
      {id:"fq10_l1",name:"Ladro del Bosco",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq10_l2",name:"Ladro del Bosco",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq10_fulmine",name:"Capobanda Fulmine",emoji:"⚡",hp:42,maxHp:42,atk:11,def:3,xp:30,isBoss:false}
    ],
  },{
    id:"fq11", title:"La Ragnatela della Foresta di Amble", active:true,
    desc:"Enormi ragni hanno tessuto una ragnatela che blocca completamente il sentiero principale della Foresta di Amble.",
    flavor:"«Ho visto ragni grandi come gatti. Non è normale.» — Dwen, taglialegna",
    difficulty:"facile", xpReward:135, goldReward:58,
    steps:[
      {type:"narrative",text:"La foresta è silenziosa in modo inquietante. Tra gli alberi luccicano fili bianchi più spessi di un pollice. Qualcosa si muove nell'ombra sopra di voi."},
      {type:"choice",text:"Il centro della ragnatela è a cinquanta passi. Un bozzolo enorme pende da un ramo.",choices:[
        {label:"🔥 Bruciate i fili con una torcia",xp:13,gold:7,next:2,correct:true},
        {label:"🗡️ Tagliate i fili uno ad uno",xp:0,gold:0,next:2,correct:false},
        {label:"🪨 Lanciate pietre verso il bozzolo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Ragni Selvatici** calano dall'alto e il **Ragno Tessitore** emerge dal bozzolo!",monsters:[
        {id:"fq11_rag1",name:"Ragno Selvatico",emoji:"🕷️",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq11_rag2",name:"Ragno Selvatico",emoji:"🕷️",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq11_tess",name:"Ragno Tessitore",emoji:"🕸️",hp:45,maxHp:45,atk:11,def:4,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"La ragnatela crolla. Nel bozzolo centrale trovate oggetti intrappolati nel corso dei mesi.",loot:{gold:[14,24],items:["Seta di Ragno Resistente","Antidoto di Erbe"]}}
    ],
    enemies:[
      {id:"fq11_rag1",name:"Ragno Selvatico",emoji:"🕷️",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq11_rag2",name:"Ragno Selvatico",emoji:"🕷️",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq11_tess",name:"Ragno Tessitore",emoji:"🕸️",hp:45,maxHp:45,atk:11,def:4,xp:32,isBoss:false}
    ],
  },{
    id:"fq12", title:"Il Cinghiale della Piana", active:true,
    desc:"Un cinghiale gigantesco e due suoi cuccioli distrugge i campi coltivati a ogni luna piena. I contadini hanno perso metà del raccolto.",
    flavor:"«È grande come un pony e ha le zanne di ferro. Letteralmente.» — Aldric, contadino",
    difficulty:"facile", xpReward:128, goldReward:52,
    steps:[
      {type:"narrative",text:"Solchi profondi attraversano i campi come fossati. Il terreno è rivoltato su metri e metri di distanza — la furia di una bestia enorme."},
      {type:"choice",text:"In lontananza sentite grugniti. I cinghiali si muovono verso il campo di orzo.",choices:[
        {label:"🌽 Create una trappola con il mais",xp:11,gold:5,next:2,correct:true},
        {label:"🔔 Fate rumore con pentole e padelle",xp:0,gold:0,next:2,correct:false},
        {label:"🚜 Usate un carro come barriera",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Cinghialetti Furiosi** e il **Cinghiale delle Zanne di Ferro** caricano a testa bassa!",monsters:[
        {id:"fq12_c1",name:"Cinghialetto Furioso",emoji:"🐗",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
        {id:"fq12_c2",name:"Cinghialetto Furioso",emoji:"🐗",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
        {id:"fq12_zanne",name:"Cinghiale delle Zanne di Ferro",emoji:"⚙️",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
      ]},
      {type:"loot",text:"La piana è sicura. I contadini vi donano prosciutto stagionato, monete risparmiate e un bastone da pastore rinforzato.",loot:{gold:[11,19],items:["Razioni da Viaggio","Bastone Rinforzato"]}}
    ],
    enemies:[
      {id:"fq12_c1",name:"Cinghialetto Furioso",emoji:"🐗",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
      {id:"fq12_c2",name:"Cinghialetto Furioso",emoji:"🐗",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
      {id:"fq12_zanne",name:"Cinghiale delle Zanne di Ferro",emoji:"⚙️",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
    ],
  },{
    id:"fq13", title:"Ossa Irrequiete nella Piazza", active:true,
    desc:"Dopo un tremore di terra, scheletri sono emersi dalle fondamenta della vecchia piazza. Gli abitanti sono terrorizzati.",
    flavor:"«Venivano dal basso, uno dopo l'altro. Almeno venti.» — Dara, fabbro",
    difficulty:"facile", xpReward:135, goldReward:58,
    steps:[
      {type:"narrative",text:"La piazza puzza di terra smossa e pietra antica. Alcune lastre sono sollevate dall'interno. Di notte si sentono ossa strisciare sul selciato."},
      {type:"choice",text:"Al centro della piazza c'è un vecchio sigillo arcano mezzo cancellato dalla crepa del tremore.",choices:[
        {label:"✨ Ritracciare il sigillo con il gesso",xp:13,gold:7,next:2,correct:true},
        {label:"🪨 Rimuovete le lastre sollevate",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiamate un prete del villaggio",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Scheletri Erranti** e uno **Scheletro Corazzato** si drizzano dal suolo!",monsters:[
        {id:"fq13_sk1",name:"Scheletro Errante",emoji:"💀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
        {id:"fq13_sk2",name:"Scheletro Errante",emoji:"💀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
        {id:"fq13_cor",name:"Scheletro Corazzato",emoji:"🛡️",hp:44,maxHp:44,atk:10,def:5,xp:31,isBoss:false}
      ]},
      {type:"loot",text:"Le ossa tornano nella terra. Nelle fessure trovate monete antiche e un amuleto di protezione dimenticato.",loot:{gold:[14,24],items:["Amuleto di Protezione","Monete Antiche"]}}
    ],
    enemies:[
      {id:"fq13_sk1",name:"Scheletro Errante",emoji:"💀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
      {id:"fq13_sk2",name:"Scheletro Errante",emoji:"💀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
      {id:"fq13_cor",name:"Scheletro Corazzato",emoji:"🛡️",hp:44,maxHp:44,atk:10,def:5,xp:31,isBoss:false}
    ],
  },{
    id:"fq14", title:"Il Coboldo Ladro di Mercanzie", active:true,
    desc:"Un coboldo furbone e i suoi scagnozzi rubano dalle bancarelle del mercato ogni mattina prima dell'alba.",
    flavor:"«È piccolo, veloce e parla in rima. Odio già questo lavoro.» — Keld, guardia del mercato",
    difficulty:"facile", xpReward:125, goldReward:50,
    steps:[
      {type:"narrative",text:"Le bancarelle del mercato sono svuotate ogni notte. Piccole impronte artigliate portano verso le fognature sotto la piazza."},
      {type:"choice",text:"Nelle fognature trovate una piccola tana decorata con merce rubata.",choices:[
        {label:"🪤 Tendete una trappola all'ingresso",xp:11,gold:5,next:2,correct:true},
        {label:"💰 Lasciate monete come esca",xp:0,gold:0,next:2,correct:false},
        {label:"🔦 Entrate a testa bassa",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Coboldi Guardia** saltano fuori armati di forcine e il **Coboldo Furbone Tipit** scaglia oggetti rubati!",monsters:[
        {id:"fq14_k1",name:"Coboldo Guardia",emoji:"🦎",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq14_k2",name:"Coboldo Guardia",emoji:"🦎",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq14_tipit",name:"Coboldo Furbone Tipit",emoji:"🎭",hp:32,maxHp:32,atk:9,def:2,xp:23,isBoss:false}
      ]},
      {type:"loot",text:"Tipit scappa ma lascia tutta la refurtiva. I mercanti vi ricompensano con parte della merce recuperata.",loot:{gold:[12,20],items:["Pozione di Cura","Pugnale Coboldo"]}}
    ],
    enemies:[
      {id:"fq14_k1",name:"Coboldo Guardia",emoji:"🦎",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq14_k2",name:"Coboldo Guardia",emoji:"🦎",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq14_tipit",name:"Coboldo Furbone Tipit",emoji:"🎭",hp:32,maxHp:32,atk:9,def:2,xp:23,isBoss:false}
    ],
  },{
    id:"fq15", title:"I Pesci Morditori del Fiume Storto", active:true,
    desc:"Il guado del Fiume Storto è diventato impossibile: pesci aggressivi di taglia enorme attaccano chiunque tenti di attraversare.",
    flavor:"«Ho perso lo stivale. Con il piede dentro.» — Garr, carrettiere",
    difficulty:"facile", xpReward:120, goldReward:50,
    steps:[
      {type:"narrative",text:"Il fiume scorre veleno verde-scuro. Pinne affilate tagliano la superficie ogni pochi secondi. I pesci sembrano aspettare."},
      {type:"choice",text:"Il guado è largo dieci metri. Sulla riva opposta c'è qualcosa che li attira.",choices:[
        {label:"🎣 Pescateli con trappole prima di attraversare",xp:11,gold:5,next:2,correct:true},
        {label:"🌉 Costruite un pontile di fortuna",xp:0,gold:0,next:2,correct:false},
        {label:"🏊 Attraversate di corsa sperando nel meglio",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Pesci Morditori** saltano fuori dall'acqua affamati e rabbiosi!",monsters:[
        {id:"fq15_p1",name:"Pesce Morditore",emoji:"🐟",hp:19,maxHp:19,atk:6,def:1,xp:14,isBoss:false},
        {id:"fq15_p2",name:"Pesce Morditore",emoji:"🐟",hp:19,maxHp:19,atk:6,def:1,xp:14,isBoss:false},
        {id:"fq15_p3",name:"Pesce Morditore",emoji:"🐟",hp:19,maxHp:19,atk:6,def:1,xp:14,isBoss:false}
      ]},
      {type:"loot",text:"Il guado è sicuro. I carrettieri vi pagano la taglia e trovate qualche oggetto caduto in acqua nei mesi precedenti.",loot:{gold:[11,18],items:["Scaglia Resistente","Razioni da Viaggio"]}}
    ],
    enemies:[
      {id:"fq15_p1",name:"Pesce Morditore",emoji:"🐟",hp:19,maxHp:19,atk:6,def:1,xp:14,isBoss:false},
      {id:"fq15_p2",name:"Pesce Morditore",emoji:"🐟",hp:19,maxHp:19,atk:6,def:1,xp:14,isBoss:false},
      {id:"fq15_p3",name:"Pesce Morditore",emoji:"🐟",hp:19,maxHp:19,atk:6,def:1,xp:14,isBoss:false}
    ],
  },{
    id:"fq16", title:"La Miniera dei Coboldi Selvaggi", active:true,
    desc:"Coboldi selvatici hanno occupato la miniera di rame abbandonata e attaccano i minatori che tentano di riaprirla.",
    flavor:"«Ne abbiamo trovati trenta solo nel primo tunnel. Armati di picconi.» — Beryn, capomastro",
    difficulty:"facile", xpReward:140, goldReward:60,
    steps:[
      {type:"narrative",text:"La miniera odora di rame e fumo. Piccole impronte artigliate e escrementi di coboldo coprono ogni superficie. Sentite canzoni gutturali in lontananza."},
      {type:"choice",text:"Il tunnel principale si divide in tre: da quello di sinistra arriva fumo, da quello centrale luci, da quello di destra silenzio.",choices:[
        {label:"🕯️ Prendete il tunnel più buio e silenzioso",xp:14,gold:7,next:2,correct:true},
        {label:"🔥 Seguite il fumo verso sinistra",xp:0,gold:0,next:2,correct:false},
        {label:"💡 Andate verso le luci al centro",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Coboldi Minatori** calano dal soffitto e lo **Sciamano Coboldo Grix** lancia maledizioni!",monsters:[
        {id:"fq16_km1",name:"Coboldo Minatore",emoji:"⛏️",hp:19,maxHp:19,atk:5,def:2,xp:14,isBoss:false},
        {id:"fq16_km2",name:"Coboldo Minatore",emoji:"⛏️",hp:19,maxHp:19,atk:5,def:2,xp:14,isBoss:false},
        {id:"fq16_grix",name:"Sciamano Coboldo Grix",emoji:"🦎",hp:40,maxHp:40,atk:10,def:3,xp:29,isBoss:false}
      ]},
      {type:"loot",text:"La miniera è sgomberata. Nelle profondità trovate pepite di rame e un piccone incantato abbandonato da un vecchio minatore.",loot:{gold:[15,26],items:["Pepite di Rame","Piccone Incantato"]}}
    ],
    enemies:[
      {id:"fq16_km1",name:"Coboldo Minatore",emoji:"⛏️",hp:19,maxHp:19,atk:5,def:2,xp:14,isBoss:false},
      {id:"fq16_km2",name:"Coboldo Minatore",emoji:"⛏️",hp:19,maxHp:19,atk:5,def:2,xp:14,isBoss:false},
      {id:"fq16_grix",name:"Sciamano Coboldo Grix",emoji:"🦎",hp:40,maxHp:40,atk:10,def:3,xp:29,isBoss:false}
    ],
  },{
    id:"fq17", title:"Il Poltergeist della Biblioteca di Graymere", active:true,
    desc:"I libri volano da soli, gli scaffali crollano e i candelabri si accendono di notte. La biblioteca è chiusa da settimane.",
    flavor:"«Ha lanciato un'enciclopedia in testa al bibliotecario. Il tomo, non il fantasma.» — Sela, apprendista",
    difficulty:"facile", xpReward:135, goldReward:57,
    steps:[
      {type:"narrative",text:"La biblioteca è un caos: pergamene sul soffitto, inchiostro sulle pareti e un odore di bruciato che non ha fonte visibile."},
      {type:"choice",text:"Al centro della sala principale un libro aperto levita a un metro da terra, scritto in una lingua che non riconoscete.",choices:[
        {label:"📖 Chiudete il libro con attenzione",xp:13,gold:6,next:2,correct:true},
        {label:"🔥 Bruciate il libro levitante",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Leggete ad alta voce dal libro",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Il **Poltergeist della Biblioteca** urla e due **Tomi Volanti** si scagliano verso di voi come proiettili!",monsters:[
        {id:"fq17_polt",name:"Poltergeist della Biblioteca",emoji:"📚",hp:33,maxHp:33,atk:9,def:2,xp:25,isBoss:false},
        {id:"fq17_tomi",name:"Tomi Volanti",emoji:"📖",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false}
      ]},
      {type:"loot",text:"Il poltergeist si dissolve. Il bibliotecario vi permette di prendere un libro a scelta e vi offre il compenso promesso.",loot:{gold:[13,22],items:["Libro delle Formule Minori","Sigillo di Carta"]}}
    ],
    enemies:[
      {id:"fq17_polt",name:"Poltergeist della Biblioteca",emoji:"📚",hp:33,maxHp:33,atk:9,def:2,xp:25,isBoss:false},
      {id:"fq17_tomi",name:"Tomi Volanti",emoji:"📖",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false}
    ],
  },{
    id:"fq18", title:"Le Api Furenti del Bosco Muto", active:true,
    desc:"Uno sciame di api giganti ha costruito un alveare nelle rovine al centro del Bosco Muto, rendendo il sentiero impercorribile.",
    flavor:"«Un'ape sola è grande come la mia mano. Uno sciame sono tremila mani.» — Hagen, guardiaboschi",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"Il Bosco Muto è diventato rumoroso. Un ronzio basso e costante sale dagli alberi e le foglie vibrano leggermente."},
      {type:"choice",text:"L'alveare è grande come una carrozza, agganciato tra tre querce. L'ingresso è sorvegliato da decine di api.",choices:[
        {label:"💨 Create fumo con erbe secche per calmarle",xp:12,gold:6,next:2,correct:true},
        {label:"🪨 Lanciate pietre per distrarle",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Date fuoco all'alveare",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Lo **Sciame di Api Furiose** vi circonda e l'**Ape Regina Velena** vola fuori dall'alveare!",monsters:[
        {id:"fq18_sciame",name:"Sciame di Api Furiose",emoji:"🐝",hp:28,maxHp:28,atk:8,def:1,xp:20,isBoss:false},
        {id:"fq18_regina",name:"Ape Regina Velena",emoji:"👑",hp:42,maxHp:42,atk:11,def:3,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"Le api si disperdono. Recuperate miele prezioso dall'alveare e trovate una fiala del veleno del guardiaboschi.",loot:{gold:[12,21],items:["Miele dell'Api Reale","Antidoto di Erbe"]}}
    ],
    enemies:[
      {id:"fq18_sciame",name:"Sciame di Api Furiose",emoji:"🐝",hp:28,maxHp:28,atk:8,def:1,xp:20,isBoss:false},
      {id:"fq18_regina",name:"Ape Regina Velena",emoji:"👑",hp:42,maxHp:42,atk:11,def:3,xp:30,isBoss:false}
    ],
  },{
    id:"fq19", title:"La Statua Camminante della Via del Re", active:true,
    desc:"Una statua di pietra si è animata e cammina lungo la Via del Re, bloccando il traffico e sfasciando i carri che non si spostano.",
    flavor:"«È alta tre metri, senza faccia e cammina come se sapesse dove va.» — Mira, guardia stradale",
    difficulty:"facile", xpReward:120, goldReward:52,
    steps:[
      {type:"narrative",text:"Sentite i passi prima di vederla: tonfi ritmici che fanno tremare il suolo. La statua avanza lenta e inesorabile, sgombrando la strada a modo suo."},
      {type:"choice",text:"Sul dorso della statua c'è un'incisione: un glifo antico che pulsa debolmente.",choices:[
        {label:"✨ Tracciate il glifo al contrario per disattivarla",xp:11,gold:5,next:2,correct:true},
        {label:"🪨 Cercate di scalare la statua",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Attaccate subito le gambe",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"La **Statua Animata** si gira verso di voi e alza il braccio di pietra!",monsters:[
        {id:"fq19_stat",name:"Statua Animata",emoji:"🗿",hp:48,maxHp:48,atk:10,def:5,xp:35,isBoss:false}
      ]},
      {type:"loot",text:"La statua si immobilizza. Nel piedistallo cavo trovate una gemma arcana che la alimentava.",loot:{gold:[12,20],items:["Gemma Arcana","Polvere di Pietra Magica"]}}
    ],
    enemies:[
      {id:"fq19_stat",name:"Statua Animata",emoji:"🗿",hp:48,maxHp:48,atk:10,def:5,xp:35,isBoss:false}
    ],
  },{
    id:"fq20", title:"Le Scimmie Selvatiche del Porto di Kelvara", active:true,
    desc:"Un branco di scimmie selvatiche sta razziando le stive delle navi nel porto. I marinai non riescono a caricare né scaricare merci.",
    flavor:"«Ne ho viste almeno trenta. E sono furbe. Troppo furbe.» — Cap. Ortwin, marinaio",
    difficulty:"facile", xpReward:125, goldReward:51,
    steps:[
      {type:"narrative",text:"Le banchine del porto sono invase di bucce di frutta, reti strappate e marinai imbufaliti. Sulle alberature le scimmie osservano con occhi brillanti."},
      {type:"choice",text:"Il loro capo — enorme, con una macchia rossa sul muso — coordina gli altri dalle alberature della nave ammiraglia.",choices:[
        {label:"🍌 Tendete una trappola con del cibo",xp:11,gold:5,next:2,correct:true},
        {label:"🔔 Fate suonare le campane del porto",xp:0,gold:0,next:2,correct:false},
        {label:"🌊 Portate le scimmie verso l'acqua",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Scimmie Selvatiche** balzano giù dalle corde e attaccano in gruppo!",monsters:[
        {id:"fq20_sc1",name:"Scimmia Selvatica",emoji:"🐒",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
        {id:"fq20_sc2",name:"Scimmia Selvatica",emoji:"🐒",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
        {id:"fq20_scapo",name:"Scimmia Capo Rosso",emoji:"🦧",hp:38,maxHp:38,atk:9,def:3,xp:26,isBoss:false}
      ]},
      {type:"loot",text:"Il branco si disperde verso la foresta vicina. Nelle stive trovate la merce recuperata dai marinai.",loot:{gold:[11,18],items:["Razioni da Viaggio","Corda da Marinaio"]}}
    ],
    enemies:[
      {id:"fq20_sc1",name:"Scimmia Selvatica",emoji:"🐒",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
      {id:"fq20_sc2",name:"Scimmia Selvatica",emoji:"🐒",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
      {id:"fq20_scapo",name:"Scimmia Capo Rosso",emoji:"🦧",hp:38,maxHp:38,atk:9,def:3,xp:26,isBoss:false}
    ],
  },{
    id:"fq21", title:"Le Lumache del Pantano di Mire", active:true,
    desc:"Lumache giganti si sono installate nel pantano di Mire, secernendo una bava tossica che avvelena l'acqua del pozzo del villaggio.",
    flavor:"«Lasciano scie verdi sulla terra. E la terra muore dove passano.» — Elsa, erborista",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"Il pantano puzza peggio del solito. La bava luminescente traccia percorsi sulle rocce e le piante intorno appassiscono al tocco."},
      {type:"choice",text:"Il pozzo del villaggio è direttamente sopra la tana principale delle lumache.",choices:[
        {label:"🧂 Sparse del sale lungo il perimetro del pozzo",xp:12,gold:6,next:2,correct:true},
        {label:"⛏️ Scavate una deviazione per il pantano",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Bruciate la bava sul terreno",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Lumache Giganti** emergono dalla melma e la **Lumaca Madre** si solleva su una colonna di bava!",monsters:[
        {id:"fq21_lum1",name:"Lumaca Gigante",emoji:"🐌",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
        {id:"fq21_lum2",name:"Lumaca Gigante",emoji:"🐌",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
        {id:"fq21_madre",name:"Lumaca Madre",emoji:"🟢",hp:48,maxHp:48,atk:9,def:4,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"Il pantano si stabilizza. L'erborista estrae dalla bava un componente raro per le sue pozioni e vi regala parte della scorta.",loot:{gold:[13,22],items:["Estratto di Bava Purificata","Pozione di Cura"]}}
    ],
    enemies:[
      {id:"fq21_lum1",name:"Lumaca Gigante",emoji:"🐌",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
      {id:"fq21_lum2",name:"Lumaca Gigante",emoji:"🐌",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
      {id:"fq21_madre",name:"Lumaca Madre",emoji:"🟢",hp:48,maxHp:48,atk:9,def:4,xp:32,isBoss:false}
    ],
  },{
    id:"fq22", title:"Il Nido di Serpi nelle Rovine di Aldren", active:true,
    desc:"Le rovine dell'antica fortezza di Aldren sono diventate un nido di serpenti velenosi che attaccano i ricercatori di cimeli.",
    flavor:"«Ho perso tre uomini in una settimana. Non alla guerra — ai serpenti.» — Prof. Varek, studioso",
    difficulty:"facile", xpReward:135, goldReward:57,
    steps:[
      {type:"narrative",text:"Le rovine di Aldren odorano di umido e veleno. Ovunque si muovono code squamate tra i massi caduti e le colonne spezzate."},
      {type:"choice",text:"Il nido principale è nell'ex sala del trono. Sentite il sibilo di decine di serpenti.",choices:[
        {label:"🌿 Usate erbe repellenti per aprirvi un varco",xp:13,gold:7,next:2,correct:true},
        {label:"🔥 Accendete fuochi all'ingresso",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Entrate a spada sguainata",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Serpi delle Rovine** scivolano dai muri e la **Serpe Velenosissima** si avvita attorno a una colonna!",monsters:[
        {id:"fq22_s1",name:"Serpe delle Rovine",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq22_s2",name:"Serpe delle Rovine",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq22_vel",name:"Serpe Velenosissima",emoji:"☠️",hp:44,maxHp:44,atk:11,def:3,xp:31,isBoss:false}
      ]},
      {type:"loot",text:"Il nido si svuota. Lo studioso recupera i cimeli cercati e vi divide il compenso promesso, con un bonus.",loot:{gold:[14,24],items:["Antidoto di Erbe","Ciondolo di Aldren"]}}
    ],
    enemies:[
      {id:"fq22_s1",name:"Serpe delle Rovine",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq22_s2",name:"Serpe delle Rovine",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq22_vel",name:"Serpe Velenosissima",emoji:"☠️",hp:44,maxHp:44,atk:11,def:3,xp:31,isBoss:false}
    ],
  },{
    id:"fq23", title:"Ossa e Zombi nella Discarica", active:true,
    desc:"Dalla grande discarica fuori città emergono non-morti ogni notte. Qualcuno ha sepolto resti maledetti tra i rifiuti.",
    flavor:"«Non sento più puzza di spazzatura. Sento solo puzza di morte.» — Wick, netturbino",
    difficulty:"facile", xpReward:130, goldReward:52,
    steps:[
      {type:"narrative",text:"La discarica puzza doppiamente. Tra cumuli di immondizia si vedono mani che emergono dal terreno e dita scheletriche che grattano la terra."},
      {type:"choice",text:"Al centro della discarica c'è un vecchio sacco marcio con un glifo dipinto — l'origine della maledizione.",choices:[
        {label:"🔥 Bruciate il sacco con del fuoco sacro",xp:12,gold:6,next:2,correct:true},
        {label:"⛏️ Disotterrate il sacco",xp:0,gold:0,next:2,correct:false},
        {label:"🪨 Coprite il sacco con altri rifiuti",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Zombi del Rifiuto** si alzano barcollando e uno **Scheletro Puzzolente** reclama il territorio!",monsters:[
        {id:"fq23_z1",name:"Zombi del Rifiuto",emoji:"🧟",hp:24,maxHp:24,atk:7,def:2,xp:18,isBoss:false},
        {id:"fq23_z2",name:"Zombi del Rifiuto",emoji:"🧟",hp:24,maxHp:24,atk:7,def:2,xp:18,isBoss:false},
        {id:"fq23_skp",name:"Scheletro Puzzolente",emoji:"💀",hp:35,maxHp:35,atk:9,def:2,xp:24,isBoss:false}
      ]},
      {type:"loot",text:"La discarica torna inerte. I netturbini trovano tra i rifiuti oggetti di valore e vi lasciano scegliere per primi.",loot:{gold:[12,20],items:["Pozione di Cura","Monete Trovate"]}}
    ],
    enemies:[
      {id:"fq23_z1",name:"Zombi del Rifiuto",emoji:"🧟",hp:24,maxHp:24,atk:7,def:2,xp:18,isBoss:false},
      {id:"fq23_z2",name:"Zombi del Rifiuto",emoji:"🧟",hp:24,maxHp:24,atk:7,def:2,xp:18,isBoss:false},
      {id:"fq23_skp",name:"Scheletro Puzzolente",emoji:"💀",hp:35,maxHp:35,atk:9,def:2,xp:24,isBoss:false}
    ],
  },{
    id:"fq24", title:"L'Ombra dell'Orfanotrofio Abbandonato", active:true,
    desc:"Un'ombra senza forma terrorizza l'orfanotrofio abbandonato sul colle. I bambini del villaggio non osano avvicinarsi.",
    flavor:"«Non ha forma. Non ha voce. Ma la vedi sempre nell'angolo dell'occhio.» — Suor Mala",
    difficulty:"facile", xpReward:125, goldReward:52,
    steps:[
      {type:"narrative",text:"L'orfanotrofio è buio nonostante il sole. L'aria è gelida anche d'estate e le porte si aprono da sole."},
      {type:"choice",text:"In una stanza trovate un vecchio specchio coperto e un nome graffiato sul muro: *Petra*.",choices:[
        {label:"🕯️ Accendete una candela e pronunciate il nome",xp:11,gold:5,next:2,correct:true},
        {label:"🔨 Rompete lo specchio",xp:0,gold:0,next:2,correct:false},
        {label:"🚪 Murate la stanza",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"L'**Ombra Strisciante** prende forma e si scaglia verso di voi con un grido silenzioso!",monsters:[
        {id:"fq24_omb",name:"Ombra Strisciante",emoji:"🌑",hp:38,maxHp:38,atk:10,def:2,xp:28,isBoss:false}
      ]},
      {type:"loot",text:"L'ombra si dissolve in lacrime. Sul pavimento appare il medaglione di Petra e un sacchetto di monete dimenticate.",loot:{gold:[11,18],items:["Medaglione d'Argento","Candela Benedetta"]}}
    ],
    enemies:[
      {id:"fq24_omb",name:"Ombra Strisciante",emoji:"🌑",hp:38,maxHp:38,atk:10,def:2,xp:28,isBoss:false}
    ],
  },{
    id:"fq25", title:"I Lupi della Piana Grigia", active:true,
    desc:"Un branco di lupi ha preso il controllo della Piana Grigia e i pastori nomadi non riescono a far pascolare le greggi.",
    flavor:"«Girano in cerchio. Aspettano. Sono troppo pazienti per essere semplici lupi.» — Tharan, pastore nomade",
    difficulty:"facile", xpReward:128, goldReward:52,
    steps:[
      {type:"narrative",text:"La Piana Grigia è silenziosa. Nessun uccello, nessun insetto. Solo il vento e, da ovest, l'ululato basso e prolungato di un branco."},
      {type:"choice",text:"Tre lupi vi osservano da una rupe. Il capo del branco è seduto tra loro, enorme, con un mantello grigio quasi argento.",choices:[
        {label:"🔥 Accendete un fuoco tra voi e il branco",xp:12,gold:6,next:2,correct:true},
        {label:"🐑 Cacciate via le greggi prima di agire",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Caricate il capo subito",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Lupi della Piana** caricano in formazione, guidati dall'istinto del branco!",monsters:[
        {id:"fq25_lp1",name:"Lupo della Piana",emoji:"🐺",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq25_lp2",name:"Lupo della Piana",emoji:"🐺",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq25_lp3",name:"Lupo della Piana",emoji:"🐺",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false}
      ]},
      {type:"loot",text:"Il branco si ritira verso nord. I pastori nomadi vi donano lana pregiata e una borsa di monete.",loot:{gold:[12,20],items:["Mantello di Lana","Dente di Lupo Portafortuna"]}}
    ],
    enemies:[
      {id:"fq25_lp1",name:"Lupo della Piana",emoji:"🐺",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq25_lp2",name:"Lupo della Piana",emoji:"🐺",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq25_lp3",name:"Lupo della Piana",emoji:"🐺",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false}
    ],
  },{
    id:"fq26", title:"I Pipistrelli del Campanile di Sant'Aldo", active:true,
    desc:"Pipistrelli giganti si sono annidati nel campanile della chiesa. Le campane non suonano da un mese e il prete è disperato.",
    flavor:"«Le campane non suonano, ma i pipistrelli sì. A modo loro.» — Padre Brenn",
    difficulty:"facile", xpReward:135, goldReward:58,
    steps:[
      {type:"narrative",text:"Il campanile puzza di guano e pelo bagnato. Salendo i gradini a spirale sentite il battito di centinaia di ali nel buio sopra di voi."},
      {type:"choice",text:"In cima al campanile i pipistrelli pendono dal soffitto in grappoli. Il capo — enorme — è avvolto intorno alla campana principale.",choices:[
        {label:"🔔 Fate suonare la campana piccola per distrarli",xp:13,gold:7,next:2,correct:true},
        {label:"🔥 Accendete torce per cacciarli",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Urlate il più forte possibile",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Pipistrelli Giganti** calano in picchiata e il **Pipistrello Capo Notturno** apre le ali enormi!",monsters:[
        {id:"fq26_pip1",name:"Pipistrello Gigante",emoji:"🦇",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
        {id:"fq26_pip2",name:"Pipistrello Gigante",emoji:"🦇",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
        {id:"fq26_pipcapo",name:"Pipistrello Capo Notturno",emoji:"🌙",hp:42,maxHp:42,atk:10,def:3,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"Il campanile è libero. Le campane suonano di nuovo e il prete vi regala una reliquia della chiesa e il compenso promesso.",loot:{gold:[14,24],items:["Croce d'Argento","Pozione di Cura"]}}
    ],
    enemies:[
      {id:"fq26_pip1",name:"Pipistrello Gigante",emoji:"🦇",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
      {id:"fq26_pip2",name:"Pipistrello Gigante",emoji:"🦇",hp:20,maxHp:20,atk:6,def:2,xp:15,isBoss:false},
      {id:"fq26_pipcapo",name:"Pipistrello Capo Notturno",emoji:"🌙",hp:42,maxHp:42,atk:10,def:3,xp:30,isBoss:false}
    ],
  },{
    id:"fq27", title:"Le Talpe Guerriere del Prato Bianco", active:true,
    desc:"Talpe giganti e aggressive hanno scavato gallerie sotto il Prato Bianco, facendo sprofondare il terreno e distruggendo i raccolti.",
    flavor:"«Sono grande come un cane e hanno artigli di ferro. E rosicchiano i pali dei recinti.» — Sven, agricoltore",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"Il Prato Bianco è pieno di buche e avvallamenti. Il terreno cede ad ogni passo e da sotto arriva un rumore di terra smossa."},
      {type:"choice",text:"Il cunicolo principale è largo abbastanza per una persona. Un ringhio sordo arriva dalle profondità.",choices:[
        {label:"💨 Spingete del fumo nel cunicolo",xp:12,gold:6,next:2,correct:true},
        {label:"⛏️ Bloccate l'ingresso con massi",xp:0,gold:0,next:2,correct:false},
        {label:"🐀 Entrate nel cunicolo subito",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Talpe Guerriere** emergono dal terreno e la **Talpa Capo** sfoggia artigli come pugnali!",monsters:[
        {id:"fq27_t1",name:"Talpa Guerriera",emoji:"🦔",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq27_t2",name:"Talpa Guerriera",emoji:"🦔",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq27_tcapo",name:"Talpa Capo",emoji:"⚫",hp:40,maxHp:40,atk:10,def:4,xp:28,isBoss:false}
      ]},
      {type:"loot",text:"Le talpe fuggono in profondità. Gli agricoltori trovano, tra le gallerie, qualche moneta caduta dai camminatori e vi donano parte della raccolta.",loot:{gold:[12,21],items:["Razioni da Viaggio","Guanti Rinforzati"]}}
    ],
    enemies:[
      {id:"fq27_t1",name:"Talpa Guerriera",emoji:"🦔",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq27_t2",name:"Talpa Guerriera",emoji:"🦔",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq27_tcapo",name:"Talpa Capo",emoji:"⚫",hp:40,maxHp:40,atk:10,def:4,xp:28,isBoss:false}
    ],
  },{
    id:"fq28", title:"Il Falco Maledetto di Castello Vantis", active:true,
    desc:"Un falco di dimensioni innaturali e occhi viola attacca i viandanti alle rovine di Castello Vantis. Si dice sia la sentinella maledetta del vecchio signore.",
    flavor:"«Il rapace conosce il mio nome. L'ha gridato mentre volava via.» — Idra, esploratrice",
    difficulty:"facile", xpReward:122, goldReward:50,
    steps:[
      {type:"narrative",text:"Le rovine di Castello Vantis dominano la collina. L'aria è pesante e un'ombra enorme passa di tanto in tanto sopra la luce del sole."},
      {type:"choice",text:"In cima alla torre più alta vedete il nido: ossa, metallo e qualcosa che luccica.",choices:[
        {label:"🪨 Scalate la torre di fianco alla torre principale",xp:11,gold:5,next:2,correct:true},
        {label:"🏹 Tirate frecce verso il cielo",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Urlate un incantesimo di richiamo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Il **Falco Maledetto di Vantis** si lancia dal cielo con uno strido soprannaturale!",monsters:[
        {id:"fq28_falco",name:"Falco Maledetto di Vantis",emoji:"🦅",hp:50,maxHp:50,atk:12,def:4,xp:36,isBoss:false}
      ]},
      {type:"loot",text:"Il falco cade e la maledizione si spezza. Nel nido trovate oggetti accumulati nei secoli: monete antiche e un anello del vecchio signore.",loot:{gold:[12,20],items:["Anello del Signore Vantis","Monete Antiche"]}}
    ],
    enemies:[
      {id:"fq28_falco",name:"Falco Maledetto di Vantis",emoji:"🦅",hp:50,maxHp:50,atk:12,def:4,xp:36,isBoss:false}
    ],
  },{
    id:"fq29", title:"I Cani Rabbiosi di Merveil", active:true,
    desc:"Un branco di cani rabbiosi terrorizza le strade di notte. Si dice che un'erba maledetta nel mercato li abbia fatti impazzire.",
    flavor:"«Non abbassare lo sguardo. Se abbassi lo sguardo, corrono.» — Vera, guardia notturna",
    difficulty:"facile", xpReward:125, goldReward:52,
    steps:[
      {type:"narrative",text:"Le strade di Merveil di notte sono deserte. Sentite ringhi nell'ombra e occhi brillanti che vi seguono dai vicoli."},
      {type:"choice",text:"Il branco si raduna in piazza del Mercato. Tra loro c'è un cane più grande, con la bava verde.",choices:[
        {label:"🌿 Usate erbe calmanti nell'acqua della fontana",xp:11,gold:5,next:2,correct:true},
        {label:"🔔 Suonate le campane del villaggio",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Accendete fuochi ai quattro angoli della piazza",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Cani Rabbiosi** caricano abbaiando freneticamente!",monsters:[
        {id:"fq29_can1",name:"Cane Rabbioso",emoji:"🐕",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
        {id:"fq29_can2",name:"Cane Rabbioso",emoji:"🐕",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
        {id:"fq29_cancapo",name:"Cane Capo Verdebava",emoji:"🟢",hp:36,maxHp:36,atk:10,def:2,xp:26,isBoss:false}
      ]},
      {type:"loot",text:"I cani si calmano o fuggono. La guardia notturna vi paga la taglia e un erborista dona un antidoto.",loot:{gold:[11,19],items:["Antidoto di Erbe","Bastone da Difesa"]}}
    ],
    enemies:[
      {id:"fq29_can1",name:"Cane Rabbioso",emoji:"🐕",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
      {id:"fq29_can2",name:"Cane Rabbioso",emoji:"🐕",hp:20,maxHp:20,atk:6,def:1,xp:15,isBoss:false},
      {id:"fq29_cancapo",name:"Cane Capo Verdebava",emoji:"🟢",hp:36,maxHp:36,atk:10,def:2,xp:26,isBoss:false}
    ],
  },{
    id:"fq30", title:"I Granchi del Porto di Sal", active:true,
    desc:"Granchi giganti emergono ogni alba dal mare e bloccano le operazioni portuali. I pescatori non riescono a portare il pescato a terra.",
    flavor:"«Uno di loro ha spezzato in due un'ancora da trenta chili. Con una chela.» — Tomas, pescatore",
    difficulty:"facile", xpReward:135, goldReward:58,
    steps:[
      {type:"narrative",text:"Il porto di Sal è bloccato. Chele enormi emergono dall'acqua ai moli e le barche più piccole vengono ribaltate."},
      {type:"choice",text:"I granchi provengono da una grotta sommersa sotto il molo principale.",choices:[
        {label:"🎣 Usate reti cariche di sassi per blocarli all'uscita",xp:13,gold:7,next:2,correct:true},
        {label:"🔥 Versate olio bollente in acqua",xp:0,gold:0,next:2,correct:false},
        {label:"🪨 Bloccate la grotta con massi",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Granchi Giganti** emergono agitando le chele e il **Granchio Antico** avanza con un fragore metallico!",monsters:[
        {id:"fq30_gr1",name:"Granchio Gigante",emoji:"🦀",hp:24,maxHp:24,atk:7,def:3,xp:18,isBoss:false},
        {id:"fq30_gr2",name:"Granchio Gigante",emoji:"🦀",hp:24,maxHp:24,atk:7,def:3,xp:18,isBoss:false},
        {id:"fq30_grantico",name:"Granchio Antico",emoji:"🪨",hp:44,maxHp:44,atk:11,def:5,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"Il porto è libero. I pescatori vi ricompensano con il pescato della giornata e trovano perle nelle chele del granchio antico.",loot:{gold:[14,24],items:["Perla del Mare","Rete da Pesca Rinforzata"]}}
    ],
    enemies:[
      {id:"fq30_gr1",name:"Granchio Gigante",emoji:"🦀",hp:24,maxHp:24,atk:7,def:3,xp:18,isBoss:false},
      {id:"fq30_gr2",name:"Granchio Gigante",emoji:"🦀",hp:24,maxHp:24,atk:7,def:3,xp:18,isBoss:false},
      {id:"fq30_grantico",name:"Granchio Antico",emoji:"🪨",hp:44,maxHp:44,atk:11,def:5,xp:32,isBoss:false}
    ],
  },{
    id:"fq31", title:"L'Arbusto Mangiatore della Foresta di Neve", active:true,
    desc:"Una pianta carnivora di dimensioni enormi blocca il sentiero principale della Foresta di Neve. Ha già inghiottito tre capre e un mulo.",
    flavor:"«Le sue radici camminano. Ho visto un ramo afferrare un corvo dal cielo.» — Elen, erborista",
    difficulty:"facile", xpReward:122, goldReward:50,
    steps:[
      {type:"narrative",text:"La foresta odora di dolciastro marcio. I rami degli alberi vicini sono avvolti da viticci e il suolo attorno all'arbusto è disseminato di ossa."},
      {type:"choice",text:"L'arbusto reagisce al calore. Si piega verso i fuochi e si ritrae dall'acqua gelida.",choices:[
        {label:"❄️ Bagnate il terreno con acqua del ruscello",xp:11,gold:5,next:2,correct:true},
        {label:"🔥 Usate il fuoco per bruciarlo",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Tagliate i rami uno ad uno",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"L'**Arbusto Carnivoro** si anima completamente e i **Viticci Striscianti** avvolgono i vostri piedi!",monsters:[
        {id:"fq31_arb",name:"Arbusto Carnivoro",emoji:"🌿",hp:44,maxHp:44,atk:10,def:4,xp:32,isBoss:false},
        {id:"fq31_vit",name:"Viticci Striscianti",emoji:"🌱",hp:18,maxHp:18,atk:4,def:1,xp:12,isBoss:false}
      ]},
      {type:"loot",text:"L'arbusto appassisce. All'interno trovate oggetti inghiottiti e una gemma verde intatta — forse il cuore della pianta.",loot:{gold:[11,19],items:["Gemma Verde","Antidoto di Erbe"]}}
    ],
    enemies:[
      {id:"fq31_arb",name:"Arbusto Carnivoro",emoji:"🌿",hp:44,maxHp:44,atk:10,def:4,xp:32,isBoss:false},
      {id:"fq31_vit",name:"Viticci Striscianti",emoji:"🌱",hp:18,maxHp:18,atk:4,def:1,xp:12,isBoss:false}
    ],
  },{
    id:"fq32", title:"I Diavoletti della Cucina dell'Osteria", active:true,
    desc:"Piccoli demoni si sono infiltrati nella cucina della più grande osteria della città, sabotando ogni pasto e terrorizzando i cuochi.",
    flavor:"«Hanno mangiato mezzo maiale e spostato tutti i coltelli sul soffitto. Il soffitto.» — Berta, cuoca",
    difficulty:"facile", xpReward:135, goldReward:58,
    steps:[
      {type:"narrative",text:"Dalla cucina arrivano strepiti, odore di bruciato e piatti che volano. I cuochi hanno abbandonato i fornelli da tre giorni."},
      {type:"choice",text:"Nell'ingresso della cucina vedete impronte di zoccoli sul pavimento e un pentolone capovolto che si muove da solo.",choices:[
        {label:"🧄 Spargete aglio e sale in circolo",xp:13,gold:7,next:2,correct:true},
        {label:"🔥 Accendete tutti i fornelli al massimo",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Urlate il nome del diavolo tre volte",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Diavoletti della Dispensa** volano fuori urlando e il **Diavoletto Capo Brux** lancia pentole bollenti!",monsters:[
        {id:"fq32_d1",name:"Diavoletto della Dispensa",emoji:"😈",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq32_d2",name:"Diavoletto della Dispensa",emoji:"😈",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq32_brux",name:"Diavoletto Capo Brux",emoji:"👿",hp:38,maxHp:38,atk:10,def:2,xp:27,isBoss:false}
      ]},
      {type:"loot",text:"La cucina è libera. Berta vi prepara il pasto migliore che abbiate mai mangiato e l'oste vi paga con monete d'argento.",loot:{gold:[14,24],items:["Pozione di Cura","Brodo Rinvigorente"]}}
    ],
    enemies:[
      {id:"fq32_d1",name:"Diavoletto della Dispensa",emoji:"😈",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq32_d2",name:"Diavoletto della Dispensa",emoji:"😈",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq32_brux",name:"Diavoletto Capo Brux",emoji:"👿",hp:38,maxHp:38,atk:10,def:2,xp:27,isBoss:false}
    ],
  },{
    id:"fq33", title:"Il Re Topo delle Fogne di Garren", active:true,
    desc:"Il leggendario Re Topo — un'enorme bestia con sette code — regna sulle fogne di Garren e il suo regno è cresciuto troppo.",
    flavor:"«L'ho visto. Portava una corona di ossa di gatto. E la indossava benissimo.» — Dorn, fognatore",
    difficulty:"facile", xpReward:140, goldReward:60,
    steps:[
      {type:"narrative",text:"Le fogne di Garren sono infestate come mai prima. Il Re Topo si dice abbia costruito un trono di rifiuti nel nodo centrale."},
      {type:"choice",text:"Il trono del Re Topo è al crocevia principale. Due guardie-topo presidiano l'accesso.",choices:[
        {label:"🧀 Usate del formaggio puzzolente come diversivo",xp:14,gold:7,next:2,correct:true},
        {label:"🔥 Gettate una torcia nel canale",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Sfidate il Re Topo a duello",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I due **Topi Guardia del Re** sfoggiano spade di coltelli arrugginiti e il **Re Topo Settecode** si drizza dal suo trono!",monsters:[
        {id:"fq33_tg1",name:"Topo Guardia del Re",emoji:"🐀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
        {id:"fq33_tg2",name:"Topo Guardia del Re",emoji:"🐀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
        {id:"fq33_retopo",name:"Re Topo Settecode",emoji:"👑",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
      ]},
      {type:"loot",text:"Il Re Topo cade dal trono. I fognatori riprendono il lavoro e trovate, nel tesoro del Re, monete accumulate per anni.",loot:{gold:[15,26],items:["Corona di Ossa (souvenir)","Borsa di Monete Fognatura"]}}
    ],
    enemies:[
      {id:"fq33_tg1",name:"Topo Guardia del Re",emoji:"🐀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
      {id:"fq33_tg2",name:"Topo Guardia del Re",emoji:"🐀",hp:22,maxHp:22,atk:6,def:2,xp:17,isBoss:false},
      {id:"fq33_retopo",name:"Re Topo Settecode",emoji:"👑",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
    ],
  },{
    id:"fq34", title:"Le Muffe Viventi delle Catacombe di Drennan", active:true,
    desc:"Una muffa oscura e senziente si è diffusa nelle catacombe di Drennan, chiudendo l'accesso ai sepolcri ancestrali.",
    flavor:"«Respira. Ho visto le pareti espandere e contrarre come un polmone.» — Ivo, becchino",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"Le catacombe puzzano di fungo e umidità. Le pareti sono ricoperte di strati verdi e grigi che sembrano pulsare."},
      {type:"choice",text:"Il nucleo della muffa è nella camera principale — una massa scura che occupa metà della stanza.",choices:[
        {label:"🌬️ Usate mantici per prosciugare l'aria",xp:12,gold:6,next:2,correct:true},
        {label:"💧 Versate acqua per diluirla",xp:0,gold:0,next:2,correct:false},
        {label:"🪨 Grattate via la muffa con spatole",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Muffe Viventi** si staccano dalla parete e la **Spora Mostruosa** esplode in un nube tossica!",monsters:[
        {id:"fq34_m1",name:"Muffa Vivente",emoji:"🟢",hp:24,maxHp:24,atk:5,def:3,xp:17,isBoss:false},
        {id:"fq34_m2",name:"Muffa Vivente",emoji:"🟢",hp:24,maxHp:24,atk:5,def:3,xp:17,isBoss:false},
        {id:"fq34_spora",name:"Spora Mostruosa",emoji:"💚",hp:38,maxHp:38,atk:9,def:2,xp:26,isBoss:false}
      ]},
      {type:"loot",text:"Le catacombe sono purificabili. Il becchino trova sepolcri intatti e condivide le offerte lasciate dai visitatori.",loot:{gold:[12,21],items:["Polvere di Muffa Rara","Antidoto di Erbe"]}}
    ],
    enemies:[
      {id:"fq34_m1",name:"Muffa Vivente",emoji:"🟢",hp:24,maxHp:24,atk:5,def:3,xp:17,isBoss:false},
      {id:"fq34_m2",name:"Muffa Vivente",emoji:"🟢",hp:24,maxHp:24,atk:5,def:3,xp:17,isBoss:false},
      {id:"fq34_spora",name:"Spora Mostruosa",emoji:"💚",hp:38,maxHp:38,atk:9,def:2,xp:26,isBoss:false}
    ],
  },{
    id:"fq35", title:"Gli Uccelli di Ghiaccio delle Vette di Keld", active:true,
    desc:"Rapaci di ghiaccio attaccano le carovane che tentano di attraversare le Vette di Keld. Le piume taglienti come lame rendono ogni incontro pericoloso.",
    flavor:"«Ogni piuma caduta lascia un taglio. Ne ho raccolte venti solo stamattina.» — Bren, montanaro",
    difficulty:"facile", xpReward:135, goldReward:57,
    steps:[
      {type:"narrative",text:"Le vette sono coperte di ghiaccio e silenzio spezzato solo dal vento. Poi un grido acuto echeggia tra le rocce — non è il vento."},
      {type:"choice",text:"Tre uccelli di ghiaccio planano in cerchio sopra il passo. Uno porta un bambino nella zampa.",choices:[
        {label:"🏹 Distraete il capo con un oggetto scintillante",xp:13,gold:7,next:2,correct:true},
        {label:"🔥 Accendete un fuoco per tenerli lontani",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Attaccate il capo direttamente",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Rapaci di Ghiaccio** scendono in picchiata e il **Falco Glaciale** piomba con una raffica di cristalli!",monsters:[
        {id:"fq35_rg1",name:"Rapace di Ghiaccio",emoji:"🧊",hp:21,maxHp:21,atk:7,def:2,xp:16,isBoss:false},
        {id:"fq35_rg2",name:"Rapace di Ghiaccio",emoji:"🧊",hp:21,maxHp:21,atk:7,def:2,xp:16,isBoss:false},
        {id:"fq35_falcog",name:"Falco Glaciale",emoji:"❄️",hp:44,maxHp:44,atk:11,def:4,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"Il passo è libero. Le carovane vi ringraziano e trovate nel nido abbandonato oggetti ghiacciati e gemme di ghiaccio puro.",loot:{gold:[13,22],items:["Gemma di Ghiaccio Puro","Mantello Termico"]}}
    ],
    enemies:[
      {id:"fq35_rg1",name:"Rapace di Ghiaccio",emoji:"🧊",hp:21,maxHp:21,atk:7,def:2,xp:16,isBoss:false},
      {id:"fq35_rg2",name:"Rapace di Ghiaccio",emoji:"🧊",hp:21,maxHp:21,atk:7,def:2,xp:16,isBoss:false},
      {id:"fq35_falcog",name:"Falco Glaciale",emoji:"❄️",hp:44,maxHp:44,atk:11,def:4,xp:32,isBoss:false}
    ],
  },{
    id:"fq36", title:"Il Gatto Selvatico di Amberveil", active:true,
    desc:"Un gatto selvatico di taglia straordinaria ha preso dimora nella foresta di Amberveil e attacca chiunque raccolga legna.",
    flavor:"«Ha gli occhi arancioni come il fuoco e zampe grandi quanto il mio petto.» — Gren, boscaiolo",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"La foresta di Amberveil odora di muschio e selvatico. Tra i rami si muove qualcosa di silenzioso e pesante — raramente si vede, sempre si sente."},
      {type:"choice",text:"Trovate una zona dove la corteccia degli alberi è graffiata ad altezza di tre metri. Il territorio del gatto.",choices:[
        {label:"🌿 Create una barricata profumata per sviarlo",xp:12,gold:6,next:2,correct:true},
        {label:"🔔 Fate rumore con campane e tegami",xp:0,gold:0,next:2,correct:false},
        {label:"🐀 Usate un piccolo animale come esca",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Il **Gatto Selvatico di Amberveil** scatta dai rami e due **Cuccioli Selvatici** attaccano dai fianchi!",monsters:[
        {id:"fq36_cuc1",name:"Cucciolo Selvatico",emoji:"🐱",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq36_cuc2",name:"Cucciolo Selvatico",emoji:"🐱",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq36_gattosel",name:"Gatto Selvatico di Amberveil",emoji:"🐆",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
      ]},
      {type:"loot",text:"Il gatto si ritira nella foresta profonda. I boscaioli riprendono il lavoro e vi donano legno lavorato e monete.",loot:{gold:[12,21],items:["Pelo di Gatto Selvatico","Pozione di Cura"]}}
    ],
    enemies:[
      {id:"fq36_cuc1",name:"Cucciolo Selvatico",emoji:"🐱",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq36_cuc2",name:"Cucciolo Selvatico",emoji:"🐱",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq36_gattosel",name:"Gatto Selvatico di Amberveil",emoji:"🐆",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
    ],
  },{
    id:"fq37", title:"Gli Scorpioni delle Dune Rosse", active:true,
    desc:"Una colonia di scorpioni giganti ha occupato l'unico pozzo delle Dune Rosse. Le carovane del deserto sono a corto d'acqua.",
    flavor:"«Uno scorpione solo è già pericoloso. Una colonia è la fine.» — Karim, guida del deserto",
    difficulty:"facile", xpReward:140, goldReward:60,
    steps:[
      {type:"narrative",text:"Le Dune Rosse bruciano sotto il sole. Attorno al pozzo il suolo è forato di gallerie e le tracce degli scorpioni sono ovunque."},
      {type:"choice",text:"Il pozzo è visibile, ma intorno ci sono almeno cinque scorpioni di guardia.",choices:[
        {label:"🌬️ Usate fumo per stordirli",xp:14,gold:7,next:2,correct:true},
        {label:"💧 Gettate acqua nei cunicoli",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Accendete fuochi attorno al pozzo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Scorpioni del Deserto** avanzano con le chele alzate e lo **Scorpione Gigante** emerge dal pozzo!",monsters:[
        {id:"fq37_sc1",name:"Scorpione del Deserto",emoji:"🦂",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq37_sc2",name:"Scorpione del Deserto",emoji:"🦂",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq37_scgig",name:"Scorpione Gigante",emoji:"🦂",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
      ]},
      {type:"loot",text:"Il pozzo è libero. Le carovane vi ringraziano con acqua fresca, spezie pregiate e monete.",loot:{gold:[15,26],items:["Veleno di Scorpione","Spezie del Deserto"]}}
    ],
    enemies:[
      {id:"fq37_sc1",name:"Scorpione del Deserto",emoji:"🦂",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq37_sc2",name:"Scorpione del Deserto",emoji:"🦂",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq37_scgig",name:"Scorpione Gigante",emoji:"🦂",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
    ],
  },{
    id:"fq38", title:"I Funghi Ambulanti della Grotta dei Vapori", active:true,
    desc:"Funghi senzienti si sono moltiplicati nella Grotta dei Vapori, bloccando l'accesso ai bagni termali curativi.",
    flavor:"«Camminano. E cantano una melodia stonata che non riesci a toglierti dalla testa.» — Tira, guaritrice",
    difficulty:"facile", xpReward:132, goldReward:56,
    steps:[
      {type:"narrative",text:"La Grotta dei Vapori è immersa in nuvole di vapore caldo. Tra le nuvole si intravedono forme tonde che si muovono lentamente."},
      {type:"choice",text:"I funghi reagiscono alla luce: si contraggono e si fermano quando la vedono.",choices:[
        {label:"🕯️ Portate lanterne potenti per bloccarli",xp:12,gold:6,next:2,correct:true},
        {label:"💧 Versate acqua fredda sui loro corpi",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Tagliate i gambi uno ad uno",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Funghi Camminanti** si avvicinano rilasciando spore e il **Fungo Antico** apre un occhio unico enorme!",monsters:[
        {id:"fq38_fc1",name:"Fungo Camminante",emoji:"🍄",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
        {id:"fq38_fc2",name:"Fungo Camminante",emoji:"🍄",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
        {id:"fq38_fantico",name:"Fungo Antico",emoji:"🟤",hp:42,maxHp:42,atk:9,def:4,xp:30,isBoss:false}
      ]},
      {type:"loot",text:"La grotta si ripulisce. La guaritrice estrae estratti medicinali dai funghi e vi dona pozioni curative come compenso.",loot:{gold:[12,21],items:["Estratto di Fungo Medicinale","Pozione di Cura"]}}
    ],
    enemies:[
      {id:"fq38_fc1",name:"Fungo Camminante",emoji:"🍄",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
      {id:"fq38_fc2",name:"Fungo Camminante",emoji:"🍄",hp:22,maxHp:22,atk:5,def:3,xp:16,isBoss:false},
      {id:"fq38_fantico",name:"Fungo Antico",emoji:"🟤",hp:42,maxHp:42,atk:9,def:4,xp:30,isBoss:false}
    ],
  },{
    id:"fq39", title:"Lo Scorticatore delle Rovine di Sal", active:true,
    desc:"Una creatura orribile — che indossa le pelli di ciò che cattura — infesta le rovine di Sal. I cacciatori scompaiono da settimane.",
    flavor:"«Non è un uomo, non è un animale. È entrambe le cose contemporaneamente.» — Rinn, sopravvissuto",
    difficulty:"facile", xpReward:145, goldReward:62,
    steps:[
      {type:"narrative",text:"Le rovine di Sal puzzano di carne vecchia. Tra le pietre trovate pelli scuoiate disposte come trofei su rami e spuntoni."},
      {type:"choice",text:"Lo scorticatore cammina sulle rovine imitando le voci dei cacciatori scomparsi.",choices:[
        {label:"🔕 Silenzio totale — non rispondete alle voci",xp:14,gold:7,next:2,correct:true},
        {label:"📢 Rispondete alla voce per localizzarlo",xp:0,gold:0,next:2,correct:false},
        {label:"🔦 Illuminate tutta l'area con torce",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Lo **Scorticatore** emerge da un mucchio di pelli e due **Larve Oscure** strisciando verso di voi!",monsters:[
        {id:"fq39_lar1",name:"Larva Oscura",emoji:"🐛",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq39_lar2",name:"Larva Oscura",emoji:"🐛",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
        {id:"fq39_scort",name:"Scorticatore",emoji:"👁️",hp:48,maxHp:48,atk:12,def:4,xp:34,isBoss:false}
      ]},
      {type:"loot",text:"La creatura cade. Tra le pelli trovate gli oggetti dei cacciatori scomparsi e una strana gemma nera.",loot:{gold:[15,26],items:["Gemma Nera Strana","Artigli dello Scorticatore"]}}
    ],
    enemies:[
      {id:"fq39_lar1",name:"Larva Oscura",emoji:"🐛",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq39_lar2",name:"Larva Oscura",emoji:"🐛",hp:18,maxHp:18,atk:5,def:1,xp:13,isBoss:false},
      {id:"fq39_scort",name:"Scorticatore",emoji:"👁️",hp:48,maxHp:48,atk:12,def:4,xp:34,isBoss:false}
    ],
  },{
    id:"fq40", title:"I Pipistrelli Vampiri della Cripta Minore", active:true,
    desc:"Pipistrelli vampiri si sono annidati nella cripta minore del cimitero e drenano il sangue dei visitatori e dei custodi.",
    flavor:"«Mi hanno lasciato sei segni sul collo in una sola notte. Sei.» — Erwin, custode del cimitero",
    difficulty:"facile", xpReward:140, goldReward:60,
    steps:[
      {type:"narrative",text:"La cripta minore è buia e odora di sangue vecchio. Piccoli cigolii riempiono l'aria e sentite qualcosa volare rasente le vostre teste."},
      {type:"choice",text:"I pipistrelli dormono nella volta. Il capo — enorme, con occhi rossi — è appeso al centro.",choices:[
        {label:"🌞 Portate specchi per riflettere la luce del sole",xp:13,gold:7,next:2,correct:true},
        {label:"🔥 Bruciate il legno dell'altare",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Battete le mani per svegliarli tutti insieme",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Pipistrelli Vampiri** calano in picchiata e il **Capo Vampiro Notturno** apre le ali scarlatte!",monsters:[
        {id:"fq40_pv1",name:"Pipistrello Vampiro",emoji:"🦇",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq40_pv2",name:"Pipistrello Vampiro",emoji:"🦇",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq40_capovamp",name:"Capo Vampiro Notturno",emoji:"🩸",hp:44,maxHp:44,atk:11,def:3,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"La cripta è purificata. Il custode vi dona il compenso e trovate nella cripta offerte rituali dimenticate.",loot:{gold:[14,24],items:["Croce d'Argento","Aglio Sacro"]}}
    ],
    enemies:[
      {id:"fq40_pv1",name:"Pipistrello Vampiro",emoji:"🦇",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq40_pv2",name:"Pipistrello Vampiro",emoji:"🦇",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq40_capovamp",name:"Capo Vampiro Notturno",emoji:"🩸",hp:44,maxHp:44,atk:11,def:3,xp:32,isBoss:false}
    ],
  },{
    id:"fq41", title:"La Volpe dell'Incantesimo Antico", active:true,
    desc:"Una volpe magica guida i viandanti fuori dal sentiero e li abbandona nel bosco. Tre persone sono scomparse nell'ultima settimana.",
    flavor:"«Seguivo la volpe. Poi mi sono ritrovato a trenta chilometri dalla strada, senza ricordare il percorso.» — Idris, mercante",
    difficulty:"facile", xpReward:135, goldReward:57,
    steps:[
      {type:"narrative",text:"La foresta è innaturalmente bella qui: fiori di stagioni diverse contemporaneamente, luci danzanti tra gli alberi. Qualcosa non va."},
      {type:"choice",text:"La volpe vi fissa da un ramo, con la coda che brilla. Vuole che la seguiate.",choices:[
        {label:"🧭 Segnate il percorso con pietre e procedete con cautela",xp:13,gold:7,next:2,correct:true},
        {label:"🦊 Seguitela immediatamente",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Accendete un fuoco per disorientarla",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"La **Volpe Incantata** mostra i denti affilati e uno **Spirito Volpe** emerge dalla sua ombra!",monsters:[
        {id:"fq41_spvol",name:"Spirito Volpe",emoji:"🦊",hp:24,maxHp:24,atk:7,def:2,xp:18,isBoss:false},
        {id:"fq41_volpe",name:"Volpe Incantata",emoji:"✨",hp:40,maxHp:40,atk:10,def:3,xp:29,isBoss:false}
      ]},
      {type:"loot",text:"L'incantesimo si spezza. Nelle radici dell'albero dove la volpe scomparve trovate un forzieretto con monete e oggetti perduti.",loot:{gold:[13,22],items:["Coda di Volpe Magica","Amuleto del Bosco"]}}
    ],
    enemies:[
      {id:"fq41_spvol",name:"Spirito Volpe",emoji:"🦊",hp:24,maxHp:24,atk:7,def:2,xp:18,isBoss:false},
      {id:"fq41_volpe",name:"Volpe Incantata",emoji:"✨",hp:40,maxHp:40,atk:10,def:3,xp:29,isBoss:false}
    ],
  },{
    id:"fq42", title:"I Ladri del Campanile di Brenn", active:true,
    desc:"Una banda di ladri usa il vecchio campanile di Brenn come nascondiglio per le loro rapine. La guardia cittadina non osa affrontarli da sola.",
    flavor:"«Sono almeno sei. Armati. E conoscono ogni vicolo della città.» — Capt. Sorel, guardia",
    difficulty:"facile", xpReward:140, goldReward:60,
    steps:[
      {type:"narrative",text:"Il campanile di Brenn non suona da anni. Ma di notte si accendono luci alle finestre e si sentono voci. I ladri si sentono al sicuro."},
      {type:"choice",text:"L'ingresso è sorvegliato da una sentinella che sembra dormire.",choices:[
        {label:"🌿 Aggirate il campanile e salite dalla scala esterna",xp:14,gold:7,next:2,correct:true},
        {label:"⚔️ Neutralizzate la sentinella di fronte",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Bussate forte al portone",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Ladri del Campanile** saltano fuori e il **Capobanda Brenn** sfila la spada corta!",monsters:[
        {id:"fq42_lc1",name:"Ladro del Campanile",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq42_lc2",name:"Ladro del Campanile",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq42_capob",name:"Capobanda Brenn",emoji:"💰",hp:44,maxHp:44,atk:11,def:4,xp:31,isBoss:false}
      ]},
      {type:"loot",text:"La banda è sconfitta. Nel campanile trovate la refurtiva di mesi di rapine — monete, gioielli e armi di qualità.",loot:{gold:[15,26],items:["Daga Affilata","Borsa di Gioielli Recuperati"]}}
    ],
    enemies:[
      {id:"fq42_lc1",name:"Ladro del Campanile",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq42_lc2",name:"Ladro del Campanile",emoji:"🗡️",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq42_capob",name:"Capobanda Brenn",emoji:"💰",hp:44,maxHp:44,atk:11,def:4,xp:31,isBoss:false}
    ],
  },{
    id:"fq43", title:"Le Ombre della Cantina del Castello", active:true,
    desc:"Ombre senza corpo si aggirano nella cantina del castello, consumando l'energia vitale delle guardie che scendono a prendere il vino.",
    flavor:"«Non le vedi. Le senti. Come dita fredde sul collo.» — Ser Aldric, cavaliere del castello",
    difficulty:"facile", xpReward:125, goldReward:52,
    steps:[
      {type:"narrative",text:"La cantina del castello è più fredda dell'inverno. Le torce si spengono dopo pochi secondi e l'aria sembra pesare."},
      {type:"choice",text:"Sul pavimento ci sono simboli tracciati con farina — qualcuno ha tentato un rituale qui e qualcosa è andato storto.",choices:[
        {label:"✨ Completate il rituale con un sigillo di luce",xp:11,gold:5,next:2,correct:true},
        {label:"🔥 Bruciate i simboli",xp:0,gold:0,next:2,correct:false},
        {label:"💧 Versate acqua santa su tutto",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Ombre Striscianti** emergono dalle pareti e avanzano silenziose!",monsters:[
        {id:"fq43_os1",name:"Ombra Strisciante",emoji:"🌑",hp:26,maxHp:26,atk:8,def:2,xp:19,isBoss:false},
        {id:"fq43_os2",name:"Ombra Strisciante",emoji:"🌑",hp:26,maxHp:26,atk:8,def:2,xp:19,isBoss:false}
      ]},
      {type:"loot",text:"La cantina si scalda. Tra i barili trovate una bottiglia di vino pregiato e la borsa dimenticata dalla guardia scomparsa.",loot:{gold:[10,18],items:["Vino Pregiato del Castello","Candela Benedetta"]}}
    ],
    enemies:[
      {id:"fq43_os1",name:"Ombra Strisciante",emoji:"🌑",hp:26,maxHp:26,atk:8,def:2,xp:19,isBoss:false},
      {id:"fq43_os2",name:"Ombra Strisciante",emoji:"🌑",hp:26,maxHp:26,atk:8,def:2,xp:19,isBoss:false}
    ],
  },{
    id:"fq44", title:"Il Polpo del Lago Cupo", active:true,
    desc:"Un polpo gigante vive nel Lago Cupo e affonda le barche dei pescatori. Nessuno muore, ma i danni sono enormi.",
    flavor:"«I tentacoli sono spessi come un tronco d'albero. E violacei. Luminosi.» — Hessa, pescatrice",
    difficulty:"facile", xpReward:145, goldReward:62,
    steps:[
      {type:"narrative",text:"Il Lago Cupo è stranamente calmo. Sotto la superficie viola dell'acqua si intravede un'ombra enorme che si muove lentamente."},
      {type:"choice",text:"Dalla riva vedete i tentacoli emergere vicino alle barche ormeggiate.",choices:[
        {label:"🎣 Calate reti cariche di pesci come distrazione",xp:14,gold:7,next:2,correct:true},
        {label:"🪨 Lanciate pietre in acqua per spaventarlo",xp:0,gold:0,next:2,correct:false},
        {label:"🚣 Remaste verso il centro del lago",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Il **Polpo del Lago Cupo** solleva due tentacoli enormi e li abbatte verso di voi!",monsters:[
        {id:"fq44_polpo",name:"Polpo del Lago Cupo",emoji:"🐙",hp:52,maxHp:52,atk:12,def:4,xp:38,isBoss:false}
      ]},
      {type:"loot",text:"Il polpo si ritira nelle profondità. I pescatori trovano nella rete qualche perla viola e monete cadute dalle barche affondate.",loot:{gold:[15,26],items:["Perla Viola del Lago","Inchiostro di Polpo Magico"]}}
    ],
    enemies:[
      {id:"fq44_polpo",name:"Polpo del Lago Cupo",emoji:"🐙",hp:52,maxHp:52,atk:12,def:4,xp:38,isBoss:false}
    ],
  },{
    id:"fq45", title:"I Serpenti di Fiamma del Pendio", active:true,
    desc:"Serpenti che emanano calore intenso hanno occupato il Pendio di Torcia, bloccando la via commerciale verso i villaggi del vulcano.",
    flavor:"«Lasciano il terreno bruciato dove passano. Come braci striscianti.» — Durin, commerciante",
    difficulty:"facile", xpReward:145, goldReward:62,
    steps:[
      {type:"narrative",text:"Il Pendio di Torcia fuma anche senza fuoco visibile. Il terreno è caldo sotto i piedi e l'aria odora di zolfo e cenere."},
      {type:"choice",text:"I serpenti di fiamma si muovono in gruppo verso i carri commerciali.",choices:[
        {label:"💧 Create barriere d'acqua per contenere le fiamme",xp:14,gold:7,next:2,correct:true},
        {label:"🪨 Costruite muri di roccia",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Portate altro fuoco per intimidirli",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Serpenti di Fiamma** sibilano lasciando scie di fuoco e il **Serpente di Fuoco Antico** si drizza altissimo!",monsters:[
        {id:"fq45_sf1",name:"Serpente di Fiamma",emoji:"🔥",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq45_sf2",name:"Serpente di Fiamma",emoji:"🔥",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
        {id:"fq45_sfantico",name:"Serpente di Fuoco Antico",emoji:"🐉",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
      ]},
      {type:"loot",text:"Il pendio si raffredda. I commercianti vi pagano e nelle squame cadute dei serpenti trovate cristalli di fuoco puro.",loot:{gold:[15,26],items:["Cristallo di Fuoco","Mantello Ignifugo"]}}
    ],
    enemies:[
      {id:"fq45_sf1",name:"Serpente di Fiamma",emoji:"🔥",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq45_sf2",name:"Serpente di Fiamma",emoji:"🔥",hp:22,maxHp:22,atk:7,def:2,xp:17,isBoss:false},
      {id:"fq45_sfantico",name:"Serpente di Fuoco Antico",emoji:"🐉",hp:46,maxHp:46,atk:12,def:4,xp:33,isBoss:false}
    ],
  },{
    id:"fq46", title:"Gli Zombi del Campo di Mais", active:true,
    desc:"Non-morti sono emersi da un vecchio cimitero dimenticato sotto i campi di mais. I contadini non possono più raccogliere il raccolto.",
    flavor:"«Tra le spighe si vedono mani che emergono dalla terra. Non è agosto, ma la raccolta è già fatta — dai morti.» — Fenn, agricoltore",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"Il campo di mais è silenzioso. Le spighe si muovono — troppo — anche senza vento. Poi vedete i primi non-morti tra le file."},
      {type:"choice",text:"Al centro del campo c'è una vecchia lapide spezzata — il sigillo del cimitero dimenticato.",choices:[
        {label:"✝️ Ricomponete la lapide con malta sacra",xp:12,gold:6,next:2,correct:true},
        {label:"🔥 Date fuoco al campo",xp:0,gold:0,next:2,correct:false},
        {label:"⛏️ Scavate intorno alla lapide",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Zombi del Campo** emergono dalle spighe barcollando verso di voi!",monsters:[
        {id:"fq46_z1",name:"Zombi del Campo",emoji:"🧟",hp:23,maxHp:23,atk:6,def:2,xp:17,isBoss:false},
        {id:"fq46_z2",name:"Zombi del Campo",emoji:"🧟",hp:23,maxHp:23,atk:6,def:2,xp:17,isBoss:false},
        {id:"fq46_z3",name:"Zombi del Campo",emoji:"🧟",hp:23,maxHp:23,atk:6,def:2,xp:17,isBoss:false}
      ]},
      {type:"loot",text:"Il campo si calma. I contadini recuperano il raccolto e vi donano mais essiccato, monete e una bottiglia di grappa casalinga.",loot:{gold:[12,20],items:["Razioni da Viaggio","Grappa del Contadino"]}}
    ],
    enemies:[
      {id:"fq46_z1",name:"Zombi del Campo",emoji:"🧟",hp:23,maxHp:23,atk:6,def:2,xp:17,isBoss:false},
      {id:"fq46_z2",name:"Zombi del Campo",emoji:"🧟",hp:23,maxHp:23,atk:6,def:2,xp:17,isBoss:false},
      {id:"fq46_z3",name:"Zombi del Campo",emoji:"🧟",hp:23,maxHp:23,atk:6,def:2,xp:17,isBoss:false}
    ],
  },{
    id:"fq47", title:"Il Corvo Spia del Necromante", active:true,
    desc:"Un corvo oscuro sorvola il villaggio spiando e riferendo al suo padrone — un necromante minore. Va fermato prima che il padrone arrivi.",
    flavor:"«Il corvo conosce i miei segreti. Tutti. L'ho visto guardare dalla finestra del mio studio.» — Mago Orvil",
    difficulty:"facile", xpReward:135, goldReward:58,
    steps:[
      {type:"narrative",text:"Il corvo nero è ovunque. Vi segue, vi scruta e scompare tra i rami. Il Mago Orvil teme che stia raccogliendo informazioni per un attacco."},
      {type:"choice",text:"Il corvo si posa su un ramo al limitare del bosco. Sembra aspettare qualcosa.",choices:[
        {label:"🪤 Tendete una trappola con cibo avvelenato",xp:13,gold:7,next:2,correct:true},
        {label:"🏹 Tirate una freccia subito",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Insultate il necromante ad alta voce",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Il **Corvo Oscuro del Necromante** chiama due **Pipistrelli Spia** che si scagliano verso di voi!",monsters:[
        {id:"fq47_pip1",name:"Pipistrello Spia",emoji:"🦇",hp:17,maxHp:17,atk:5,def:1,xp:12,isBoss:false},
        {id:"fq47_pip2",name:"Pipistrello Spia",emoji:"🦇",hp:17,maxHp:17,atk:5,def:1,xp:12,isBoss:false},
        {id:"fq47_corvo",name:"Corvo Oscuro del Necromante",emoji:"🐦‍⬛",hp:40,maxHp:40,atk:10,def:3,xp:29,isBoss:false}
      ]},
      {type:"loot",text:"Il legame con il necromante si spezza. Tra le piume del corvo trovate una pergamena — una mappa parziale dei piani del padrone.",loot:{gold:[13,22],items:["Pergamena del Necromante","Piuma Oscura"]}}
    ],
    enemies:[
      {id:"fq47_pip1",name:"Pipistrello Spia",emoji:"🦇",hp:17,maxHp:17,atk:5,def:1,xp:12,isBoss:false},
      {id:"fq47_pip2",name:"Pipistrello Spia",emoji:"🦇",hp:17,maxHp:17,atk:5,def:1,xp:12,isBoss:false},
      {id:"fq47_corvo",name:"Corvo Oscuro del Necromante",emoji:"🐦‍⬛",hp:40,maxHp:40,atk:10,def:3,xp:29,isBoss:false}
    ],
  },{
    id:"fq48", title:"Le Cavallette del Raccolto", active:true,
    desc:"Uno sciame di cavallette giganti distrugge i campi prima della stagione del raccolto. Guidate da una cavalletta sciamana, sembrano intelligenti.",
    flavor:"«Mangiano il grano, poi rimangono. Come se il campo fosse ora loro.» — Bori, mezzadro",
    difficulty:"facile", xpReward:130, goldReward:55,
    steps:[
      {type:"narrative",text:"I campi risuonano di un frastuono ossessionante. Ogni spiga viene divorata in secondi e lo sciame avanza in formazione, quasi militare."},
      {type:"choice",text:"La cavalletta sciamana coordina le altre con movimenti di antenne e zampe. Neutralizzarla potrebbe disperdere lo sciame.",choices:[
        {label:"🌬️ Create vento artificiale con mantici per disorganizzarle",xp:12,gold:6,next:2,correct:true},
        {label:"🔥 Date fuoco alle stoppie ai bordi del campo",xp:0,gold:0,next:2,correct:false},
        {label:"💧 Irrigate il campo per ostacolare il movimento",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Cavallette Giganti** vi caricano e la **Cavalletta Sciamana** balza altissima verso di voi!",monsters:[
        {id:"fq48_cav1",name:"Cavalletta Gigante",emoji:"🦗",hp:19,maxHp:19,atk:5,def:1,xp:14,isBoss:false},
        {id:"fq48_cav2",name:"Cavalletta Gigante",emoji:"🦗",hp:19,maxHp:19,atk:5,def:1,xp:14,isBoss:false},
        {id:"fq48_sciamana",name:"Cavalletta Sciamana",emoji:"👑",hp:38,maxHp:38,atk:9,def:3,xp:26,isBoss:false}
      ]},
      {type:"loot",text:"Lo sciame si disperde. I mezzadri raccolgono quel che resta e vi pagano la taglia con monete e riserve di cibo.",loot:{gold:[12,20],items:["Razioni da Viaggio","Olio di Cavalletta"]}}
    ],
    enemies:[
      {id:"fq48_cav1",name:"Cavalletta Gigante",emoji:"🦗",hp:19,maxHp:19,atk:5,def:1,xp:14,isBoss:false},
      {id:"fq48_cav2",name:"Cavalletta Gigante",emoji:"🦗",hp:19,maxHp:19,atk:5,def:1,xp:14,isBoss:false},
      {id:"fq48_sciamana",name:"Cavalletta Sciamana",emoji:"👑",hp:38,maxHp:38,atk:9,def:3,xp:26,isBoss:false}
    ],
  },{
    id:"fq49", title:"La Maschera del Vecchio Teatro", active:true,
    desc:"Il teatro abbandonato di Varenno è infestato dal fantasma di un vecchio attore che recita ancora la sua ultima parte — per sempre.",
    flavor:"«La recita inizia ogni notte a mezzanotte. E chi rimane ad ascoltarla... non ricorda di essere un uomo.» — Ganna, archivista",
    difficulty:"facile", xpReward:125, goldReward:52,
    steps:[
      {type:"narrative",text:"Il teatro è buio ma il sipario si apre da solo. Sul palco una figura in costume recita una tragedia antica in una lingua quasi incomprensibile."},
      {type:"choice",text:"Il copione originale è sul leggio. Se leggete l'ultima scena, potreste liberare il fantasma.",choices:[
        {label:"📜 Leggete l'ultima scena ad alta voce",xp:11,gold:5,next:2,correct:true},
        {label:"🔥 Bruciate il copione",xp:0,gold:0,next:2,correct:false},
        {label:"🎭 Recitate voi stessi sul palco",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Il **Fantasma del Palcoscenico** urla: *«L'ultimo atto non è ancora finito!»* e si scaglia verso il pubblico vuoto!",monsters:[
        {id:"fq49_fanpal",name:"Fantasma del Palcoscenico",emoji:"🎭",hp:44,maxHp:44,atk:11,def:2,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"Il fantasma cade in ginocchio sul palco e svanisce sorridendo. Sul palco trovate la borsa dell'attore e gioielli di scena.",loot:{gold:[11,19],items:["Maschera del Teatro","Borsa dell'Attore"]}}
    ],
    enemies:[
      {id:"fq49_fanpal",name:"Fantasma del Palcoscenico",emoji:"🎭",hp:44,maxHp:44,atk:11,def:2,xp:32,isBoss:false}
    ],
  },{
    id:"fq50", title:"Il Guardiano della Fonte Perduta", active:true,
    desc:"Una fonte d'acqua curativa è stata riscoperta nella foresta, ma uno spirito dell'acqua adirato e due serpenti la proteggono da ogni visitatore.",
    flavor:"«L'acqua guarisce tutto — ma prima devi convincere chi la custodisce.» — Aera, erborista",
    difficulty:"facile", xpReward:140, goldReward:60,
    steps:[
      {type:"narrative",text:"La fonte è nascosta tra radici e muschio. L'acqua scintilla di un turchese soprannaturale e l'aria intorno sa di menta e qualcosa di antico."},
      {type:"choice",text:"Lo spirito dell'acqua si manifesta come figura traslucente che vi sbarra la via con un gesto imperioso.",choices:[
        {label:"🌊 Offrite fiori selvatici alla fonte come dono",xp:13,gold:7,next:2,correct:true},
        {label:"💧 Bevete direttamente dall'acqua",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Avanzate comunque ignorando lo spirito",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Lo **Spirito dell'Acqua** giudica le vostre intenzioni e i due **Serpenti della Fonte** sibilano proteggendo la sorgente!",monsters:[
        {id:"fq50_sa1",name:"Serpente della Fonte",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq50_sa2",name:"Serpente della Fonte",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
        {id:"fq50_spirito",name:"Spirito dell'Acqua",emoji:"💧",hp:44,maxHp:44,atk:11,def:3,xp:32,isBoss:false}
      ]},
      {type:"loot",text:"Lo spirito si calma e la fonte è accessibile. L'acqua curativa riempie le vostre fiasche e trovate offerte lasciate da visitatori passati.",loot:{gold:[14,24],items:["Acqua della Fonte Curativa","Amuleto dell'Acqua"]}}
    ],
    enemies:[
      {id:"fq50_sa1",name:"Serpente della Fonte",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq50_sa2",name:"Serpente della Fonte",emoji:"🐍",hp:21,maxHp:21,atk:6,def:2,xp:16,isBoss:false},
      {id:"fq50_spirito",name:"Spirito dell'Acqua",emoji:"💧",hp:44,maxHp:44,atk:11,def:3,xp:32,isBoss:false}
    ],
  },

  // ── MEDIO (mq1–mq50) ──────────────────────────────────────────────────────
  {
    id:"mq1", title:"La Torre dell'Alchimista Pazzo", active:true,
    desc:"Il mago Vrex ha perso il senno dopo un esperimento fallito. I suoi golem pattugliano la torre e chiunque si avvicini viene attaccato.",
    flavor:"«Urla formule dal balcone a ogni alba. Ieri ha trasformato un pollo in pietra.» — Nera, vicina",
    difficulty:"medio", xpReward:200, goldReward:85,
    steps:[
      {type:"narrative",text:"La torre dell'alchimista si staglia storta sul colle come un dente scheggiato. Fumi multicolori escono dalle finestre e risuonano esplosioni sorde."},
      {type:"choice",text:"Al terzo piano trovate il laboratorio di Vrex: alambicchi bollenti, note sparse e due golem di acido che vi fissano.",choices:[
        {label:"⚗️ Usate i reagenti del laboratorio contro i golem",xp:18,gold:10,next:2,correct:true},
        {label:"⚔️ Attaccate direttamente senza pensarci",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiamate Vrex per nome",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Golem di Acido** avanzano gocciolando e l'**Alchimista Vrex** irrompe urlando formule incomprensibili!",monsters:[
        {id:"mq1_ga1",name:"Golem di Acido",emoji:"🧪",hp:55,maxHp:55,atk:12,def:5,xp:42,isBoss:false},
        {id:"mq1_ga2",name:"Golem di Acido",emoji:"🧪",hp:55,maxHp:55,atk:12,def:5,xp:42,isBoss:false},
        {id:"mq1_vrex",name:"Alchimista Vrex il Pazzo",emoji:"🔮",hp:85,maxHp:85,atk:16,def:4,xp:72,isBoss:true}
      ]},
      {type:"loot",text:"Vrex crolla insensato. Nel laboratorio trovate anni di esperimenti: pozioni rare, formule di valore e il forziere personale dell'alchimista.",loot:{gold:[28,55],items:["Pozione di Grande Cura","Elisir dell'Intelletto","Bastone dell'Alchimista"]}}
    ],
    enemies:[
      {id:"mq1_ga1",name:"Golem di Acido",emoji:"🧪",hp:55,maxHp:55,atk:12,def:5,xp:42,isBoss:false},
      {id:"mq1_ga2",name:"Golem di Acido",emoji:"🧪",hp:55,maxHp:55,atk:12,def:5,xp:42,isBoss:false},
      {id:"mq1_vrex",name:"Alchimista Vrex il Pazzo",emoji:"🔮",hp:85,maxHp:85,atk:16,def:4,xp:72,isBoss:true}
    ],
  },{
    id:"mq2", title:"Il Labirinto di Mirthedge", active:true,
    desc:"Un minotauro domina il labirinto di Mirthedge. Generazioni di eroi ci sono entrati — nessuno è tornato.",
    flavor:"«Il labirinto cambia di notte. Alcuni dicono che respiri.» — Archivista Koll",
    difficulty:"medio", xpReward:210, goldReward:90,
    steps:[
      {type:"narrative",text:"Il labirinto di Mirthedge si estende per ettari sotto una collina. Le pareti cambiano posizione ogni ora e l'aria sa di sangue antico."},
      {type:"choice",text:"Trovate un incrocio con tre frecce scavate nella pietra, ognuna segnata con sangue diverso.",choices:[
        {label:"🧵 Legate un filo all'ingresso per non perdervi",xp:19,gold:10,next:2,correct:true},
        {label:"🎲 Scegliete a caso",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Urlate per sentire l'eco del centro",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Satiri Guardiani** sbarrano il centro e il **Minotauro di Mirthedge** carica con un ruggito che scuote le pareti!",monsters:[
        {id:"mq2_sat1",name:"Satiro Guardiano",emoji:"🐐",hp:45,maxHp:45,atk:11,def:4,xp:36,isBoss:false},
        {id:"mq2_sat2",name:"Satiro Guardiano",emoji:"🐐",hp:45,maxHp:45,atk:11,def:4,xp:36,isBoss:false},
        {id:"mq2_mino",name:"Minotauro di Mirthedge",emoji:"🐂",hp:110,maxHp:110,atk:19,def:8,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"Il labirinto tace. Al centro c'è il tesoro di generazioni: monete e armi portate dagli eroi caduti.",loot:{gold:[32,60],items:["Ascia del Minotauro","Amuleto del Labirinto","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq2_sat1",name:"Satiro Guardiano",emoji:"🐐",hp:45,maxHp:45,atk:11,def:4,xp:36,isBoss:false},
      {id:"mq2_sat2",name:"Satiro Guardiano",emoji:"🐐",hp:45,maxHp:45,atk:11,def:4,xp:36,isBoss:false},
      {id:"mq2_mino",name:"Minotauro di Mirthedge",emoji:"🐂",hp:110,maxHp:110,atk:19,def:8,xp:90,isBoss:true}
    ],
  },{
    id:"mq3", title:"I Corsari del Mare Grigio", active:true,
    desc:"Una flotta di corsari semina il terrore nel Mare Grigio. Il loro capitano è un veterano senza scrupoli che non lascia superstiti.",
    flavor:"«Nessuna nave è tornata dal Mare Grigio negli ultimi quaranta giorni.» — Ammiraglio Reth",
    difficulty:"medio", xpReward:200, goldReward:88,
    steps:[
      {type:"narrative",text:"Il Mare Grigio merita il suo nome. Le navi corsare emergono dalla nebbia come spettri e colpiscono prima che possiate reagire."},
      {type:"choice",text:"Avvistate la nave ammiraglia dei corsari ancorata in una baia nascosta. L'equipaggio è a terra.",choices:[
        {label:"🌊 Avvicinatevi di notte a nuoto",xp:18,gold:10,next:2,correct:true},
        {label:"🚢 Attaccate frontalmente con la vostra nave",xp:0,gold:0,next:2,correct:false},
        {label:"📯 Segnalate la vostra presenza",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Corsari d'Assalto** sfoggiano le sciabole e il **Capitano Nero Halrek** salta sulla scena con un sorriso gelido!",monsters:[
        {id:"mq3_cor1",name:"Corsaro d'Assalto",emoji:"⚓",hp:50,maxHp:50,atk:12,def:4,xp:40,isBoss:false},
        {id:"mq3_cor2",name:"Corsaro d'Assalto",emoji:"⚓",hp:50,maxHp:50,atk:12,def:4,xp:40,isBoss:false},
        {id:"mq3_halrek",name:"Capitano Nero Halrek",emoji:"🏴‍☠️",hp:95,maxHp:95,atk:18,def:7,xp:80,isBoss:true}
      ]},
      {type:"loot",text:"La nave ammiraglia è vostra. Nella stiva trovate il bottino di mesi di pirateria: oro, merci pregiate e mappe nautiche.",loot:{gold:[32,58],items:["Sciabola del Capitano","Mappa dei Mari Grigi","Barile d'Oro Corsaro"]}}
    ],
    enemies:[
      {id:"mq3_cor1",name:"Corsaro d'Assalto",emoji:"⚓",hp:50,maxHp:50,atk:12,def:4,xp:40,isBoss:false},
      {id:"mq3_cor2",name:"Corsaro d'Assalto",emoji:"⚓",hp:50,maxHp:50,atk:12,def:4,xp:40,isBoss:false},
      {id:"mq3_halrek",name:"Capitano Nero Halrek",emoji:"🏴‍☠️",hp:95,maxHp:95,atk:18,def:7,xp:80,isBoss:true}
    ],
  },{
    id:"mq4", title:"La Forgia degli Spettri", active:true,
    desc:"La vecchia forgia reale è infestata dai fantasmi dei fabbri morti durante l'assedio di cent'anni fa. Le loro anime non hanno pace.",
    flavor:"«Di notte la forgia brilla come se qualcuno lavorasse ancora. Ma nessuno è vivo lì dentro.» — Wren, guardiano",
    difficulty:"medio", xpReward:210, goldReward:90,
    steps:[
      {type:"narrative",text:"La forgia reale odora di metallo e morte. I mantici si muovono da soli e le incudini suonano colpi ritmici nell'oscurità."},
      {type:"choice",text:"I fantasmi sembrano ripetere gli stessi gesti in loop — come se stessero ancora forgiando qualcosa.",choices:[
        {label:"🔨 Completate il loro ultimo lavoro alla forgia",xp:19,gold:10,next:2,correct:true},
        {label:"💧 Versate acqua santa nelle fornaci",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiedete loro cosa vogliono",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Draugr Fabbri** si alzano dalle ceneri e il **Fabbro Spettrale Maldren** afferra il suo martello!",monsters:[
        {id:"mq4_dr1",name:"Draugr Fabbro",emoji:"💀",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
        {id:"mq4_dr2",name:"Draugr Fabbro",emoji:"💀",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
        {id:"mq4_maldren",name:"Fabbro Spettrale Maldren",emoji:"👻",hp:105,maxHp:105,atk:18,def:7,xp:85,isBoss:true}
      ]},
      {type:"loot",text:"Gli spiriti trovano pace. Nella forgia trovate l'ultima opera mai completata: un'arma di qualità leggendaria e il tesoro dei fabbri.",loot:{gold:[33,60],items:["Martello del Fabbro Spettrale","Lingotto d'Acciaio Incantato","Pozione di Cura Superiore"]}}
    ],
    enemies:[
      {id:"mq4_dr1",name:"Draugr Fabbro",emoji:"💀",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
      {id:"mq4_dr2",name:"Draugr Fabbro",emoji:"💀",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
      {id:"mq4_maldren",name:"Fabbro Spettrale Maldren",emoji:"👻",hp:105,maxHp:105,atk:18,def:7,xp:85,isBoss:true}
    ],
  },{
    id:"mq5", title:"Il Palazzo delle Ombre", active:true,
    desc:"Il Palazzo Mirin è stato consumato dalle ombre. Il lord è scomparso e le ombre che indossano i volti dei nobili ora governano al suo posto.",
    flavor:"«Mio marito sorride con la mia voce e ha occhi che non riflettono la luce.» — Lady Mirin",
    difficulty:"medio", xpReward:205, goldReward:88,
    steps:[
      {type:"narrative",text:"Il Palazzo Mirin è buio anche di giorno. I nobili che ci vivono non battono ciglio, non ridono e parlano tutti con lo stesso tono piatto."},
      {type:"choice",text:"Il nucleo delle ombre è nella sala dei ritratti — dove tutti i dipinti hanno occhi neri.",choices:[
        {label:"🕯️ Portate candele di cera di luna per illuminare la sala",xp:19,gold:10,next:2,correct:true},
        {label:"🔥 Date fuoco ai ritratti",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Attaccate i nobili direttamente",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Ombre Nobili** si staccano dalle pareti e il **Lord dell'Ombra** si materializza nel centro della sala!",monsters:[
        {id:"mq5_on1",name:"Ombra Nobile",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq5_on2",name:"Ombra Nobile",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq5_lord",name:"Lord dell'Ombra",emoji:"👤",hp:100,maxHp:100,atk:17,def:8,xp:82,isBoss:true}
      ]},
      {type:"loot",text:"Le ombre si dissolvono e il lord torna in sé, confuso ma vivo. La famiglia ricompensa il party con i tesori del palazzo.",loot:{gold:[30,56],items:["Sigillo del Lord Mirin","Gemma dell'Ombra","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq5_on1",name:"Ombra Nobile",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq5_on2",name:"Ombra Nobile",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq5_lord",name:"Lord dell'Ombra",emoji:"👤",hp:100,maxHp:100,atk:17,def:8,xp:82,isBoss:true}
    ],
  },{
    id:"mq6", title:"L'Armata dei Golem di Pietra", active:true,
    desc:"Un antico mago ha lasciato un esercito di golem di pietra attivo nelle rovine di Eld. Si sono risvegliati e marciano verso la città.",
    flavor:"«Vengono dal nord, uno ogni ora. Se non li fermiamo alle rovine, arriveranno in città tra tre giorni.» — Generale Orvyn",
    difficulty:"medio", xpReward:215, goldReward:92,
    steps:[
      {type:"narrative",text:"Le rovine di Eld tremano al passo dei golem. Enormi figure di pietra grigia marciano in formazione perfetta verso il confine della città."},
      {type:"choice",text:"Il nucleo di controllo è un cristallo nel tempio centrale. Distruggerlo fermerebbe l'armata.",choices:[
        {label:"✨ Disattivate il cristallo con una controformula",xp:20,gold:11,next:2,correct:true},
        {label:"🪨 Lanciate esplosivi verso il cristallo",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Cercate di negoziare con i golem",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Golem di Pietra** sbarrano il tempio e il **Golem Antico** — grande tre volte degli altri — avanza inesorabile!",monsters:[
        {id:"mq6_gp1",name:"Golem di Pietra",emoji:"🗿",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
        {id:"mq6_gp2",name:"Golem di Pietra",emoji:"🗿",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
        {id:"mq6_gantico",name:"Golem Antico",emoji:"⚙️",hp:115,maxHp:115,atk:20,def:9,xp:92,isBoss:true}
      ]},
      {type:"loot",text:"I golem si immobilizzano. Tra le pietre trovate il tesoro del mago antico e frammenti di cristallo di controllo con valore arcano.",loot:{gold:[34,62],items:["Frammento di Cristallo Arcano","Bracciale del Golem","Pietra del Comando"]}}
    ],
    enemies:[
      {id:"mq6_gp1",name:"Golem di Pietra",emoji:"🗿",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
      {id:"mq6_gp2",name:"Golem di Pietra",emoji:"🗿",hp:58,maxHp:58,atk:12,def:6,xp:45,isBoss:false},
      {id:"mq6_gantico",name:"Golem Antico",emoji:"⚙️",hp:115,maxHp:115,atk:20,def:9,xp:92,isBoss:true}
    ],
  },{
    id:"mq7", title:"Il Pozzo del Demonio Minore", active:true,
    desc:"Un culto ha aperto un portale in fondo al pozzo del villaggio di Greywater. Da lì emergono ogni notte creature infernali.",
    flavor:"«Non è acqua che esce dal pozzo. È qualcos'altro. Di più caldo.» — Ulm, mugnaio",
    difficulty:"medio", xpReward:205, goldReward:88,
    steps:[
      {type:"narrative",text:"Il pozzo di Greywater odora di zolfo e bruciato. Di notte si vede luce rossa dalla profondità e si sentono risate gutturali."},
      {type:"choice",text:"Il sigillo del portale è inciso nell'anello del pozzo. Va spezzato dall'esterno.",choices:[
        {label:"🧂 Versate sale consacrato nel pozzo",xp:19,gold:10,next:2,correct:true},
        {label:"🪨 Buttate massi per ostruire il pozzo",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Gettate fuoco nel pozzo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Imp del Pozzo** saltano fuori e il **Diavolo del Pozzo Skarrex** emerge avvolto in fiamme!",monsters:[
        {id:"mq7_imp1",name:"Imp del Pozzo",emoji:"😈",hp:40,maxHp:40,atk:10,def:3,xp:32,isBoss:false},
        {id:"mq7_imp2",name:"Imp del Pozzo",emoji:"😈",hp:40,maxHp:40,atk:10,def:3,xp:32,isBoss:false},
        {id:"mq7_skarrex",name:"Diavolo del Pozzo Skarrex",emoji:"👹",hp:100,maxHp:100,atk:18,def:7,xp:82,isBoss:true}
      ]},
      {type:"loot",text:"Il portale si chiude. Nelle profondità del pozzo trovate monete portate dalle vittime e un sigillo infernale di grande valore.",loot:{gold:[30,56],items:["Sigillo Infernale","Pietra del Fuoco","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq7_imp1",name:"Imp del Pozzo",emoji:"😈",hp:40,maxHp:40,atk:10,def:3,xp:32,isBoss:false},
      {id:"mq7_imp2",name:"Imp del Pozzo",emoji:"😈",hp:40,maxHp:40,atk:10,def:3,xp:32,isBoss:false},
      {id:"mq7_skarrex",name:"Diavolo del Pozzo Skarrex",emoji:"👹",hp:100,maxHp:100,atk:18,def:7,xp:82,isBoss:true}
    ],
  },{
    id:"mq8", title:"L'Accademia dei Rinnegati", active:true,
    desc:"Un gruppo di magi espulsi dall'ordine ha fondato un'accademia oscura. Esperimenti illegali e reclutamento forzato stanno terrorizzando la regione.",
    flavor:"«Studiano magia proibita. E cercano soggetti — non studenti.» — Arcimaga Lyss",
    difficulty:"medio", xpReward:200, goldReward:85,
    steps:[
      {type:"narrative",text:"L'accademia dei rinnegati sembra una villa normale dall'esterno. Dall'interno arrivano lampi di magia e urla soffocate."},
      {type:"choice",text:"Il laboratorio principale è al piano terra. Sentite una voce che recita una formula di controllo mentale.",choices:[
        {label:"🔕 Interrompete il rituale di controllo prima",xp:18,gold:10,next:2,correct:true},
        {label:"⚔️ Irrompete con la forza",xp:0,gold:0,next:2,correct:false},
        {label:"🧠 Cercate di resistere alla formula",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Magi Rinnegati** lanciano incantesimi offensivi e l'**Arcimago Rinnegato Thax** apre un vortice d'energia!",monsters:[
        {id:"mq8_mr1",name:"Mago Rinnegato",emoji:"🪄",hp:45,maxHp:45,atk:13,def:3,xp:36,isBoss:false},
        {id:"mq8_mr2",name:"Mago Rinnegato",emoji:"🪄",hp:45,maxHp:45,atk:13,def:3,xp:36,isBoss:false},
        {id:"mq8_thax",name:"Arcimago Rinnegato Thax",emoji:"🔮",hp:90,maxHp:90,atk:19,def:6,xp:78,isBoss:true}
      ]},
      {type:"loot",text:"L'accademia è smantellata. I prigionieri liberati vi ringraziano e trovate la biblioteca proibita dei rinnegati.",loot:{gold:[28,55],items:["Libro delle Magie Proibite","Bacchetta Arcana","Elisir dell'Intelletto"]}}
    ],
    enemies:[
      {id:"mq8_mr1",name:"Mago Rinnegato",emoji:"🪄",hp:45,maxHp:45,atk:13,def:3,xp:36,isBoss:false},
      {id:"mq8_mr2",name:"Mago Rinnegato",emoji:"🪄",hp:45,maxHp:45,atk:13,def:3,xp:36,isBoss:false},
      {id:"mq8_thax",name:"Arcimago Rinnegato Thax",emoji:"🔮",hp:90,maxHp:90,atk:19,def:6,xp:78,isBoss:true}
    ],
  },{
    id:"mq9", title:"Il Mercato Nero di Valdris", active:true,
    desc:"La gang dei Cappelli Grigi gestisce un mercato nero di oggetti magici rubati. La gilda dei maghi vuole i pezzi recuperati.",
    flavor:"«Vendono ciò che rubano. Rubano ciò che non riescono a vendere. Un ciclo perfetto.» — Ispettore Vann",
    difficulty:"medio", xpReward:210, goldReward:90,
    steps:[
      {type:"narrative",text:"I vicoli di Valdris di notte sono labirinti di transazioni illegali. La gang dei Cappelli Grigi controlla tutto dal magazzino del porto."},
      {type:"choice",text:"Il magazzino è sorvegliato da tre guardiani. Dentro sentite le trattative per una vendita enorme.",choices:[
        {label:"🌿 Usate i tetti per entrare dal lucernario",xp:19,gold:10,next:2,correct:true},
        {label:"💰 Fingete di essere compratori",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Identificatevi come autorità",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Gangster dei Cappelli Grigi** sfoggiano i coltelli e il **Boss Della Gang Rexan** balza fuori da dietro un carro!",monsters:[
        {id:"mq9_g1",name:"Gangster Cappello Grigio",emoji:"🎩",hp:42,maxHp:42,atk:11,def:4,xp:34,isBoss:false},
        {id:"mq9_g2",name:"Gangster Cappello Grigio",emoji:"🎩",hp:42,maxHp:42,atk:11,def:4,xp:34,isBoss:false},
        {id:"mq9_rexan",name:"Boss Rexan il Grigio",emoji:"👑",hp:95,maxHp:95,atk:18,def:7,xp:80,isBoss:true}
      ]},
      {type:"loot",text:"La gang si scioglie. Nel magazzino trovate gli oggetti magici rubati e la cassa del mercato nero — enorme.",loot:{gold:[33,60],items:["Anello di Furto","Cassa del Mercato Nero","Amuleto dei Cappelli Grigi"]}}
    ],
    enemies:[
      {id:"mq9_g1",name:"Gangster Cappello Grigio",emoji:"🎩",hp:42,maxHp:42,atk:11,def:4,xp:34,isBoss:false},
      {id:"mq9_g2",name:"Gangster Cappello Grigio",emoji:"🎩",hp:42,maxHp:42,atk:11,def:4,xp:34,isBoss:false},
      {id:"mq9_rexan",name:"Boss Rexan il Grigio",emoji:"👑",hp:95,maxHp:95,atk:18,def:7,xp:80,isBoss:true}
    ],
  },{
    id:"mq10", title:"La Miniera dei Nani Corrotti", active:true,
    desc:"Un antico artefatto corrotto ha reso violenti i nani della miniera di Keldrun. I loro stessi clan chiedono aiuto dall'esterno.",
    flavor:"«Non sono più i miei fratelli. Gli occhi neri non mentono.» — Beryn, nano esiliato",
    difficulty:"medio", xpReward:215, goldReward:92,
    steps:[
      {type:"narrative",text:"La miniera di Keldrun echeggia di colpi forsennati. I nani corrotti lavorano senza sosta, scavando verso qualcosa che non vogliono che nessuno veda."},
      {type:"choice",text:"L'artefatto corrotto è al settimo livello. Sentite il suo richiamo — una voce bassa che promette potere.",choices:[
        {label:"🙉 Tappate le orecchie con cera e avanzate",xp:20,gold:11,next:2,correct:true},
        {label:"👂 Ascoltate la voce per capirne l'origine",xp:0,gold:0,next:2,correct:false},
        {label:"💎 Cercate i vostri oggetti magici per resistere",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Nani Corrotti** attaccano con picconi neri e il **Signore Nano Corrotto Dorgrim** urla la volontà dell'artefatto!",monsters:[
        {id:"mq10_nc1",name:"Nano Corrotto",emoji:"⛏️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq10_nc2",name:"Nano Corrotto",emoji:"⛏️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq10_dorgrim",name:"Signore Nano Dorgrim Corrotto",emoji:"💎",hp:110,maxHp:110,atk:19,def:9,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"L'artefatto distrutto libera i nani. Dorgrim piange rinsavito. Il clan vi dona l'accesso al tesoro della miniera.",loot:{gold:[34,62],items:["Piccone di Mithril","Gemma della Miniera","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq10_nc1",name:"Nano Corrotto",emoji:"⛏️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq10_nc2",name:"Nano Corrotto",emoji:"⛏️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq10_dorgrim",name:"Signore Nano Dorgrim Corrotto",emoji:"💎",hp:110,maxHp:110,atk:19,def:9,xp:90,isBoss:true}
    ],
  },{
    id:"mq11", title:"Il Tempio Sommerso di Aqualith", active:true,
    desc:"Un tempio antico è affiorato dalle profondità del lago dopo il terremoto. I guardiani marini che lo proteggono attaccano chiunque si avvicini.",
    flavor:"«Dicono che contenga la profezia del mare. Io dico che contiene cose che non dovrebbero respirare aria.» — Dren, esploratore",
    difficulty:"medio", xpReward:220, goldReward:95,
    steps:[
      {type:"narrative",text:"Il tempio emerge dall'acqua coperto di alghe e creature marine. Geroglifici antichi coprono ogni superficie e l'aria sa di abisso."},
      {type:"choice",text:"L'ingresso è sorvegliato da due figure acquatiche che recitano formule in lingua delle profondità.",choices:[
        {label:"🌊 Recitate le stesse formule al contrario",xp:20,gold:11,next:2,correct:true},
        {label:"⚔️ Attaccate prima che vi vedano",xp:0,gold:0,next:2,correct:false},
        {label:"💦 Immergete la testa e cercate un ingresso alternativo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guardiani dell'Abisso** sfoggiano tridenti di corallo e il **Sacerdote dell'Abisso** invoca le correnti profonde!",monsters:[
        {id:"mq11_ga1",name:"Guardiano dell'Abisso",emoji:"🦑",hp:52,maxHp:52,atk:12,def:5,xp:42,isBoss:false},
        {id:"mq11_ga2",name:"Guardiano dell'Abisso",emoji:"🦑",hp:52,maxHp:52,atk:12,def:5,xp:42,isBoss:false},
        {id:"mq11_sacer",name:"Sacerdote dell'Abisso",emoji:"🐚",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
      ]},
      {type:"loot",text:"Il tempio è vostro. La camera centrale contiene offerte di secoli: oro antico, perle nere e un tridente mistico.",loot:{gold:[35,64],items:["Tridente del Tempio Sommerso","Perla Nera Abissale","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq11_ga1",name:"Guardiano dell'Abisso",emoji:"🦑",hp:52,maxHp:52,atk:12,def:5,xp:42,isBoss:false},
      {id:"mq11_ga2",name:"Guardiano dell'Abisso",emoji:"🦑",hp:52,maxHp:52,atk:12,def:5,xp:42,isBoss:false},
      {id:"mq11_sacer",name:"Sacerdote dell'Abisso",emoji:"🐚",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
    ],
  },{
    id:"mq12", title:"La Fortezza degli Orchi", active:true,
    desc:"Gli orchi di Brakgorr hanno preso il controllo di una fortezza sul confine. Da lì lanciano razzie sui villaggi vicini ogni settimana.",
    flavor:"«Marchiano in formazione. Qualcuno li addestra. Qualcuno di intelligente.» — Sgt. Heln",
    difficulty:"medio", xpReward:225, goldReward:98,
    steps:[
      {type:"narrative",text:"La fortezza di pietra nera si staglia contro il cielo. Bandiere con il simbolo di Brakgorr — un pugno spezzato — sventolano su ogni torrione."},
      {type:"choice",text:"Il portone principale è sbarrato ma c'è un passaggio segreto attraverso le vecchie fognature.",choices:[
        {label:"🌿 Entrate dalle fognature in silenzio",xp:21,gold:12,next:2,correct:true},
        {label:"🏹 Bombardate le mura con frecce infuocate",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Sfidate il warlord a duello singolo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Orchi di Brakgorr** caricano e il **Warlord Orchesco Grommash** solleva la sua ascia enorme!",monsters:[
        {id:"mq12_or1",name:"Orco di Brakgorr",emoji:"👹",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
        {id:"mq12_or2",name:"Orco di Brakgorr",emoji:"👹",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
        {id:"mq12_grommash",name:"Warlord Grommash",emoji:"💪",hp:115,maxHp:115,atk:21,def:9,xp:92,isBoss:true}
      ]},
      {type:"loot",text:"La fortezza è libera. Nelle sale del tesoro trovate il bottino delle razzie: oro, armi e oggetti rubati ai villaggi.",loot:{gold:[36,65],items:["Ascia del Warlord","Scudo di Brakgorr","Sacchetto del Bottino Orchesco"]}}
    ],
    enemies:[
      {id:"mq12_or1",name:"Orco di Brakgorr",emoji:"👹",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
      {id:"mq12_or2",name:"Orco di Brakgorr",emoji:"👹",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
      {id:"mq12_grommash",name:"Warlord Grommash",emoji:"💪",hp:115,maxHp:115,atk:21,def:9,xp:92,isBoss:true}
    ],
  },{
    id:"mq13", title:"Sangue sulle Mura di Coldport", active:true,
    desc:"Cecchini oscuri stanno eliminando le guardie sulle mura di Coldport di notte. La città vive nel terrore e nessuno sa da dove sparano.",
    flavor:"«Le frecce vengono dall'oscurità. Non dal muro opposto. Dall'oscurità stessa.» — Generale Wyk",
    difficulty:"medio", xpReward:200, goldReward:85,
    steps:[
      {type:"narrative",text:"Le mura di Coldport sono bagnate di rugiada e sangue. Le guardie perlustrano con torce ma i cecchini sono sempre un passo avanti."},
      {type:"choice",text:"Le frecce arrivano da un angolo cieco creato da due torri adiacenti — un punto morto nel sistema difensivo.",choices:[
        {label:"🌑 Operate al buio senza torce per usare lo stesso vantaggio",xp:18,gold:10,next:2,correct:true},
        {label:"🔦 Illuminate il settore con trenta torce",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Annunciate la vostra posizione per attirare i cecchini",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Arcieri Oscuri** emergono dall'ombra e il **Cecchino Maestro Voss** punta la balestra direttamente a voi!",monsters:[
        {id:"mq13_ao1",name:"Arciere Oscuro",emoji:"🏹",hp:45,maxHp:45,atk:14,def:3,xp:36,isBoss:false},
        {id:"mq13_ao2",name:"Arciere Oscuro",emoji:"🏹",hp:45,maxHp:45,atk:14,def:3,xp:36,isBoss:false},
        {id:"mq13_voss",name:"Cecchino Maestro Voss",emoji:"🎯",hp:88,maxHp:88,atk:20,def:6,xp:76,isBoss:true}
      ]},
      {type:"loot",text:"I cecchini sono neutralizzati. Nella loro postazione trovate equipaggiamento di alta qualità e note sui contratti.",loot:{gold:[28,54],items:["Balestra Oscura","Frecce Avvelenate","Nota dei Mandanti"]}}
    ],
    enemies:[
      {id:"mq13_ao1",name:"Arciere Oscuro",emoji:"🏹",hp:45,maxHp:45,atk:14,def:3,xp:36,isBoss:false},
      {id:"mq13_ao2",name:"Arciere Oscuro",emoji:"🏹",hp:45,maxHp:45,atk:14,def:3,xp:36,isBoss:false},
      {id:"mq13_voss",name:"Cecchino Maestro Voss",emoji:"🎯",hp:88,maxHp:88,atk:20,def:6,xp:76,isBoss:true}
    ],
  },{
    id:"mq14", title:"Il Cimitero dei Guerrieri", active:true,
    desc:"I guerrieri sepolti nel Cimitero degli Eroi si sono risvegliati come non-morti, rifiutando di riposare in pace.",
    flavor:"«Camminano con armature arrugginite e portano ancora le loro insegne. Ma non sono più eroi.» — Ser Aldric",
    difficulty:"medio", xpReward:220, goldReward:95,
    steps:[
      {type:"narrative",text:"Il Cimitero degli Eroi è imponente e silenzioso di giorno. Ma di notte i sepolcri si aprono e figure corazzate camminano tra le lapidi."},
      {type:"choice",text:"Il comandante non-morto è identificabile dallo stendardo che porta — ancora il vecchio emblema reale.",choices:[
        {label:"🏳️ Onorate lo stendardo con un saluto militare",xp:20,gold:11,next:2,correct:true},
        {label:"⚔️ Attaccate il comandante per primo",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Ordinate ai non-morti di fermarsi",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Guerrieri Non-Morti** avanzano in formazione e il **Condottiero Spettrale Alderon** alza la spada!",monsters:[
        {id:"mq14_gnd1",name:"Guerriero Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq14_gnd2",name:"Guerriero Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq14_alderon",name:"Condottiero Spettrale Alderon",emoji:"👑",hp:108,maxHp:108,atk:20,def:8,xp:88,isBoss:true}
      ]},
      {type:"loot",text:"Alderon si inchina e torna alla terra. Il cimitero tace. Tra le armature trovate reliquie degli eroi — inestimabili e vendibili.",loot:{gold:[34,62],items:["Spada degli Eroi","Armatura dell'Antico Guerriero","Medaglia del Condottiero"]}}
    ],
    enemies:[
      {id:"mq14_gnd1",name:"Guerriero Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq14_gnd2",name:"Guerriero Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq14_alderon",name:"Condottiero Spettrale Alderon",emoji:"👑",hp:108,maxHp:108,atk:20,def:8,xp:88,isBoss:true}
    ],
  },{
    id:"mq15", title:"La Nave Fantasma di Gildenhaven", active:true,
    desc:"Una nave fantasma con l'equipaggio non-morto appare ogni luna piena nel porto di Gildenhaven, affondando le navi ormeggiate.",
    flavor:"«Non ha bandiera. Non ha luci. Solo uno scafo nero come carbone e urla di marinai morti.» — Capitan Dern",
    difficulty:"medio", xpReward:210, goldReward:90,
    steps:[
      {type:"narrative",text:"La luna piena illumina il porto quando la nave appare dal nulla: scafo nero, vele stracciate, nessuna luce. Ma si muove."},
      {type:"choice",text:"Il capitano della nave fantasma è visibile sul ponte — uno spettro in uniforme che impartisce ordini.",choices:[
        {label:"🌊 Raggiungetela a nuoto e salite dalla poppa",xp:19,gold:10,next:2,correct:true},
        {label:"⚓ Usate grappini per bloccare la nave",xp:0,gold:0,next:2,correct:false},
        {label:"🏹 Sparate frecce infuocate dalle banchine",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Marinai Fantasma** attaccano con sciabole di luce e il **Capitano Spettrale Korven** invoca una mareggiata!",monsters:[
        {id:"mq15_mf1",name:"Marinaio Fantasma",emoji:"👻",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq15_mf2",name:"Marinaio Fantasma",emoji:"👻",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq15_korven",name:"Capitano Spettrale Korven",emoji:"⚓",hp:100,maxHp:100,atk:19,def:7,xp:82,isBoss:true}
      ]},
      {type:"loot",text:"La nave si dissolve. In una bolla di magia trovate il bottino del capitano — tesori di mari lontani.",loot:{gold:[33,60],items:["Bussola dello Spettro","Monete di Mari Lontani","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq15_mf1",name:"Marinaio Fantasma",emoji:"👻",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq15_mf2",name:"Marinaio Fantasma",emoji:"👻",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq15_korven",name:"Capitano Spettrale Korven",emoji:"⚓",hp:100,maxHp:100,atk:19,def:7,xp:82,isBoss:true}
    ],
  },{
    id:"mq16", title:"La Maledizione del Villaggio Silente", active:true,
    desc:"Il villaggio di Moorsend non ha più suoni: nessun bambino ride, nessun cane abbaia. Una strega ha rubato le voci a tutti.",
    flavor:"«Le bocche si muovono ma non esce nulla. Solo silenzio e lacrime.» — Esploratore Yvan",
    difficulty:"medio", xpReward:215, goldReward:92,
    steps:[
      {type:"narrative",text:"Moorsend è un dipinto: persone che si muovono in silenzio assoluto, bambini che giocano senza risate. Solo il vento fa rumore."},
      {type:"choice",text:"La strega vive nella palude a nord del villaggio. Le voci sono conservate in barattoli di vetro nel suo covo.",choices:[
        {label:"🌿 Avvicinatevi dalla palude verso il covo",xp:20,gold:11,next:2,correct:true},
        {label:"🔥 Date fuoco all'ingresso della palude",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Urlate per attirare la strega fuori",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Tre **Contadini Maledetti** — inviati dalla strega — attaccano in silenzio inquietante e la **Strega del Silenzio Morra** urla la sua unica parola!",monsters:[
        {id:"mq16_cm1",name:"Contadino Maledetto",emoji:"🧑‍🌾",hp:42,maxHp:42,atk:10,def:3,xp:33,isBoss:false},
        {id:"mq16_cm2",name:"Contadino Maledetto",emoji:"🧑‍🌾",hp:42,maxHp:42,atk:10,def:3,xp:33,isBoss:false},
        {id:"mq16_morra",name:"Strega del Silenzio Morra",emoji:"🧙",hp:95,maxHp:95,atk:18,def:6,xp:80,isBoss:true}
      ]},
      {type:"loot",text:"I barattoli si frantumano e le voci tornano al villaggio. La festa che ne segue è indimenticabile — e molto rumorosa.",loot:{gold:[33,60],items:["Bastone della Strega","Barattolo delle Voci (vuoto)","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq16_cm1",name:"Contadino Maledetto",emoji:"🧑‍🌾",hp:42,maxHp:42,atk:10,def:3,xp:33,isBoss:false},
      {id:"mq16_cm2",name:"Contadino Maledetto",emoji:"🧑‍🌾",hp:42,maxHp:42,atk:10,def:3,xp:33,isBoss:false},
      {id:"mq16_morra",name:"Strega del Silenzio Morra",emoji:"🧙",hp:95,maxHp:95,atk:18,def:6,xp:80,isBoss:true}
    ],
  },{
    id:"mq17", title:"La Torre dei Venti", active:true,
    desc:"La Torre dei Venti sulle montagne emette burrasche devastanti che distruggono i raccolti. Un arconte del vento l'ha presa in ostaggio.",
    flavor:"«Il vento viene dalla torre. Sempre dalla torre. E porta qualcosa con sé.» — Myra, meteorologa",
    difficulty:"medio", xpReward:220, goldReward:95,
    steps:[
      {type:"narrative",text:"La Torre dei Venti è avvolta in un vortice permanente. Salire è già un'impresa e ad ogni piano il vento diventa più forte e più rabbioso."},
      {type:"choice",text:"Al penultimo piano l'arconte ha costruito un cristallo che amplifica e dirige le tempeste.",choices:[
        {label:"🌬️ Usate il vento stesso per salire più veloci",xp:20,gold:11,next:2,correct:true},
        {label:"🪨 Cercate riparo dietro i massi del muro",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Avanzate di forza contro il vento",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Elementali del Vento** si materializzano e l'**Arconte dei Venti Zephyrix** apre le ali di aria!",monsters:[
        {id:"mq17_ev1",name:"Elementale del Vento",emoji:"🌪️",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
        {id:"mq17_ev2",name:"Elementale del Vento",emoji:"🌪️",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
        {id:"mq17_zephy",name:"Arconte dei Venti Zephyrix",emoji:"💨",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
      ]},
      {type:"loot",text:"La torre tace. Il cristallo distrutto lascia cristalli più piccoli di grande valore e il forziere dell'arconte.",loot:{gold:[35,64],items:["Cristallo del Vento","Mantello dell'Arconte","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq17_ev1",name:"Elementale del Vento",emoji:"🌪️",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
      {id:"mq17_ev2",name:"Elementale del Vento",emoji:"🌪️",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
      {id:"mq17_zephy",name:"Arconte dei Venti Zephyrix",emoji:"💨",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
    ],
  },{
    id:"mq18", title:"Il Galeone Spettrale di Ironbay", active:true,
    desc:"Un galeone fantasma blocca l'uscita dal porto di Ironbay. L'ammiraglio non-morto rifiuta di lasciare passare qualsiasi nave.",
    flavor:"«L'ammiraglio morì in battaglia cent'anni fa. Non accetta che la guerra sia finita.» — Storico navale Pell",
    difficulty:"medio", xpReward:225, goldReward:98,
    steps:[
      {type:"narrative",text:"Il Galeone Spettrale è ancorato trasversalmente all'imbocco del porto, enorme e silenzioso. Sul ponte si vedono figure che pattugliano."},
      {type:"choice",text:"L'unico modo per passare è convincere l'ammiraglio spettrale — o sconfiggerlo.",choices:[
        {label:"📜 Mostrate il trattato di pace che ha concluso la sua guerra",xp:21,gold:12,next:2,correct:true},
        {label:"⚔️ Salite sul galeone e attaccate",xp:0,gold:0,next:2,correct:false},
        {label:"🌊 Tentate di aggirare il galeone nuotando",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Marinai Spettrali** attaccano il bordo e l'**Ammiraglio Spettrale Ironbay** discende dal castello di prua!",monsters:[
        {id:"mq18_ms1",name:"Marinaio Spettrale",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
        {id:"mq18_ms2",name:"Marinaio Spettrale",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
        {id:"mq18_ammir",name:"Ammiraglio Spettrale Ironbay",emoji:"⚓",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"L'ammiraglio si inchina e il galeone svanisce. Dove c'era il galeone rimane il tesoro affondato: monete e reliquie navali.",loot:{gold:[36,65],items:["Sciabola dell'Ammiraglio","Mappa Nautica Antica","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq18_ms1",name:"Marinaio Spettrale",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
      {id:"mq18_ms2",name:"Marinaio Spettrale",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
      {id:"mq18_ammir",name:"Ammiraglio Spettrale Ironbay",emoji:"⚓",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
    ],
  },{
    id:"mq19", title:"La Tomba del Generale Perduto", active:true,
    desc:"La tomba del Generale Valdric è stata trovata — ma qualcuno ha già aperto il sigillo e il generale non-morto ora vuole vendicarsi.",
    flavor:"«Non dormiva. Aspettava. E ora sa che l'abbiamo trovato.» — Archeologa Sinn",
    difficulty:"medio", xpReward:230, goldReward:100,
    steps:[
      {type:"narrative",text:"La tomba del Generale Valdric si estende sotto una collina. Corridoi affrescati con battaglie antiche portano verso un suono ritmico di passi."},
      {type:"choice",text:"Al centro della tomba un altare con lo stemma di Valdric. Sul pavimento ossa disposte in formazione militare.",choices:[
        {label:"🪖 Salutate militarmente l'altare come soldati",xp:21,gold:12,next:2,correct:true},
        {label:"💎 Prendete un oggetto dall'altare",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Pronunciate il nome di Valdric",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Soldati Scheletro** prendono posizione e il **Generale Non-Morto Valdric** esce dal sarcofago con la spada in pugno!",monsters:[
        {id:"mq19_ss1",name:"Soldato Scheletro",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
        {id:"mq19_ss2",name:"Soldato Scheletro",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
        {id:"mq19_valdric",name:"Generale Non-Morto Valdric",emoji:"⚔️",hp:118,maxHp:118,atk:21,def:9,xp:94,isBoss:true}
      ]},
      {type:"loot",text:"Valdric si inchina e torna alla terra con un'ultima parola: «Onoratemi». La tomba rivela i suoi tesori.",loot:{gold:[38,68],items:["Spada di Valdric il Generale","Scudo dell'Armata Antica","Sigillo del Generale"]}}
    ],
    enemies:[
      {id:"mq19_ss1",name:"Soldato Scheletro",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
      {id:"mq19_ss2",name:"Soldato Scheletro",emoji:"💀",hp:50,maxHp:50,atk:12,def:5,xp:40,isBoss:false},
      {id:"mq19_valdric",name:"Generale Non-Morto Valdric",emoji:"⚔️",hp:118,maxHp:118,atk:21,def:9,xp:94,isBoss:true}
    ],
  },{
    id:"mq20", title:"Il Dungeon del Mago Folle", active:true,
    desc:"Il mago Kaelix ha costruito un dungeon sotto la sua villa e ci ha rinchiuso i suoi esperimenti falliti — che ora vogliono uscire.",
    flavor:"«Esperimenti che camminano, parlano e non ricordano di essere stati umani.» — Drana, ex assistente",
    difficulty:"medio", xpReward:220, goldReward:95,
    steps:[
      {type:"narrative",text:"Il dungeon di Kaelix odora di magia bruciata e carne in formaldehyde. Dalla profondità arrivano versi incomprensibili e risate spezzate."},
      {type:"choice",text:"Kaelix è nel laboratorio al centro. I suoi esperimenti pattugliano i corridoi.",choices:[
        {label:"🧪 Usate i suoi reagenti per creare un narcotico gassoso",xp:20,gold:11,next:2,correct:true},
        {label:"⚔️ Combattete ogni esperimento che incontrate",xp:0,gold:0,next:2,correct:false},
        {label:"🔕 Tentate di non fare rumore",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Esperimenti Viventi** bloccano il laboratorio e il **Mago Folle Kaelix** non smette di ridere mentre vi attacca!",monsters:[
        {id:"mq20_es1",name:"Esperimento Vivente",emoji:"🧬",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
        {id:"mq20_es2",name:"Esperimento Vivente",emoji:"🧬",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
        {id:"mq20_kaelix",name:"Mago Folle Kaelix",emoji:"🔮",hp:98,maxHp:98,atk:18,def:6,xp:80,isBoss:true}
      ]},
      {type:"loot",text:"Kaelix cade esausto. Nel laboratorio trovate anni di esperimenti: formule di valore, pozioni uniche e un forziere personale.",loot:{gold:[34,62],items:["Grimorio di Kaelix","Pozione dell'Esperimento","Cristallo di Magia Stabile"]}}
    ],
    enemies:[
      {id:"mq20_es1",name:"Esperimento Vivente",emoji:"🧬",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
      {id:"mq20_es2",name:"Esperimento Vivente",emoji:"🧬",hp:50,maxHp:50,atk:13,def:5,xp:40,isBoss:false},
      {id:"mq20_kaelix",name:"Mago Folle Kaelix",emoji:"🔮",hp:98,maxHp:98,atk:18,def:6,xp:80,isBoss:true}
    ],
  },{
    id:"mq21", title:"Gli Occhi della Notte", active:true,
    desc:"Una rete di spie soprannaturali — creature che assumono la forma di ombre — raccoglie segreti per un potere sconosciuto.",
    flavor:"«Le loro ombre non corrispondono ai corpi. E sanno cose che non avrebbero modo di sapere.» — Spymistress Zael",
    difficulty:"medio", xpReward:205, goldReward:88,
    steps:[
      {type:"narrative",text:"La città di notte è sorvegliata da occhi invisibili. Le ombre si muovono contro il vento e sussurrano tra loro informazioni rubate."},
      {type:"choice",text:"Il maestro della rete — il Custode degli Occhi — si incontra con gli informatori in una locanda abbandonata.",choices:[
        {label:"🌑 Entrate nell'oscurità totale per rendervi invisibili",xp:19,gold:10,next:2,correct:true},
        {label:"🔦 Illuminate tutto per smascherarle",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Denunciate la riunione pubblicamente",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Vedette Oscure** attaccano dai lati e il **Maestro dello Sguardo Nyssar** apre i suoi mille occhi!",monsters:[
        {id:"mq21_vo1",name:"Vedetta Oscura",emoji:"👁️",hp:45,maxHp:45,atk:12,def:4,xp:36,isBoss:false},
        {id:"mq21_vo2",name:"Vedetta Oscura",emoji:"👁️",hp:45,maxHp:45,atk:12,def:4,xp:36,isBoss:false},
        {id:"mq21_nyssar",name:"Maestro dello Sguardo Nyssar",emoji:"🌑",hp:92,maxHp:92,atk:17,def:6,xp:76,isBoss:true}
      ]},
      {type:"loot",text:"La rete di spie collassa. Nel covo trovate tutti i segreti raccolti — informazioni di valore inestimabile — e il compenso in oro.",loot:{gold:[30,56],items:["Pergamena dei Segreti","Occhio di Vetro del Maestro","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq21_vo1",name:"Vedetta Oscura",emoji:"👁️",hp:45,maxHp:45,atk:12,def:4,xp:36,isBoss:false},
      {id:"mq21_vo2",name:"Vedetta Oscura",emoji:"👁️",hp:45,maxHp:45,atk:12,def:4,xp:36,isBoss:false},
      {id:"mq21_nyssar",name:"Maestro dello Sguardo Nyssar",emoji:"🌑",hp:92,maxHp:92,atk:17,def:6,xp:76,isBoss:true}
    ],
  },{
    id:"mq22", title:"La Caverna del Basilisco", active:true,
    desc:"Un basilisco ha trasformato in pietra tutti i minatori della cava di Greystone. Le statue dei malcapitati sono ancora lì dentro.",
    flavor:"«L'occhio del basilisco non perdona. E lui ha due occhi.» — Salv Ira, sopravvissuto bendato",
    difficulty:"medio", xpReward:220, goldReward:95,
    steps:[
      {type:"narrative",text:"La cava di Greystone è silenziosa. Figure di pietra in pose di terrore sono sparse ovunque — erano minatori. Sentite un respiro pesante nelle profondità."},
      {type:"choice",text:"Il basilisco non vede bene nella luce intensa. La sua vista è adattata all'oscurità delle caverne.",choices:[
        {label:"🔦 Portate specchi per riflettere la sua visione",xp:20,gold:11,next:2,correct:true},
        {label:"🙈 Avanzate a occhi chiusi",xp:0,gold:0,next:2,correct:false},
        {label:"🎭 Indossate bende sugli occhi",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Lucertole Giganti** di scorta attaccano e il **Basilisco di Greystone** apre gli occhi smeraldo!",monsters:[
        {id:"mq22_lug1",name:"Lucertola Gigante",emoji:"🦎",hp:48,maxHp:48,atk:11,def:4,xp:38,isBoss:false},
        {id:"mq22_lug2",name:"Lucertola Gigante",emoji:"🦎",hp:48,maxHp:48,atk:11,def:4,xp:38,isBoss:false},
        {id:"mq22_basil",name:"Basilisco di Greystone",emoji:"🐊",hp:110,maxHp:110,atk:20,def:8,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"Il basilisco è sconfitto. La sua bile scioglie la pietrificazione dei minatori. Come ringraziamento, il capoMastro vi apre il tesoro della cava.",loot:{gold:[35,64],items:["Occhio del Basilisco","Bile Scioglipietra","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq22_lug1",name:"Lucertola Gigante",emoji:"🦎",hp:48,maxHp:48,atk:11,def:4,xp:38,isBoss:false},
      {id:"mq22_lug2",name:"Lucertola Gigante",emoji:"🦎",hp:48,maxHp:48,atk:11,def:4,xp:38,isBoss:false},
      {id:"mq22_basil",name:"Basilisco di Greystone",emoji:"🐊",hp:110,maxHp:110,atk:20,def:8,xp:90,isBoss:true}
    ],
  },{
    id:"mq23", title:"Il Confine con l'Ombra", active:true,
    desc:"Il confine tra il mondo dei vivi e il Piano dell'Ombra si è assottigliato nella foresta di Veld. Creature delle tenebre attraversano liberamente.",
    flavor:"«C'è un posto dove gli alberi non fanno ombra. Perché l'ombra c'è già tutta, indipendentemente dal sole.» — Ranger Kess",
    difficulty:"medio", xpReward:225, goldReward:98,
    steps:[
      {type:"narrative",text:"La foresta di Veld è divisa in due da una linea invisibile: da un lato il verde, dall'altro tutto è grigio e piatto come un dipinto in bianco e nero."},
      {type:"choice",text:"Il punto di rottura del confine è un portale naturale — un arco di rovi antichi che vibra di energia oscura.",choices:[
        {label:"✨ Sigillate il portale con rune di luce",xp:21,gold:12,next:2,correct:true},
        {label:"⚔️ Distruggete l'arco di rovi",xp:0,gold:0,next:2,correct:false},
        {label:"🌑 Entrate nel piano dell'ombra per affrontarli dall'interno",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Cacciatori d'Ombra** scivolano attraverso il portale e il **Signore dell'Ombra** appare come un vuoto nella luce!",monsters:[
        {id:"mq23_cs1",name:"Cacciatore d'Ombra",emoji:"🌑",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq23_cs2",name:"Cacciatore d'Ombra",emoji:"🌑",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq23_signore",name:"Signore dell'Ombra",emoji:"👤",hp:108,maxHp:108,atk:19,def:8,xp:88,isBoss:true}
      ]},
      {type:"loot",text:"Il portale si chiude. La foresta torna verde. Un santuario nascosto lì vicino contiene offerte degli elfi che un tempo custodivano il confine.",loot:{gold:[35,64],items:["Essenza dell'Ombra","Amuleto del Confine","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq23_cs1",name:"Cacciatore d'Ombra",emoji:"🌑",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq23_cs2",name:"Cacciatore d'Ombra",emoji:"🌑",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq23_signore",name:"Signore dell'Ombra",emoji:"👤",hp:108,maxHp:108,atk:19,def:8,xp:88,isBoss:true}
    ],
  },{
    id:"mq24", title:"I Signori del Fango", active:true,
    desc:"Elementali di fango e terra si sono risvegliati nel Pantano di Mala. Controllano le vie d'acqua e affogano chi si avvicina.",
    flavor:"«L'antico del pantano non è mai morto. Solo dormiva. Trecento anni sono un pisolino per lui.» — Stregone Dravyr",
    difficulty:"medio", xpReward:230, goldReward:100,
    steps:[
      {type:"narrative",text:"Il Pantano di Mala odora di terra marcia e antico. La superficie dell'acqua si muove senza vento e braccia di fango emergono dai laghetti."},
      {type:"choice",text:"L'Antico del Pantano dorme nel cuore del Pantano — un'isola di terra ferma circondata da fango vivo.",choices:[
        {label:"🌿 Avanzate sulle pietre guado una ad una",xp:21,gold:12,next:2,correct:true},
        {label:"🔥 Cercate di prosciugare il fango con fuoco",xp:0,gold:0,next:2,correct:false},
        {label:"🏊 Attraversate il fango a nuoto",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Signori del Fango** emergono dai lati e l'**Antico del Pantano Malagor** si solleva come una montagna di terra!",monsters:[
        {id:"mq24_sf1",name:"Signore del Fango",emoji:"🟫",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq24_sf2",name:"Signore del Fango",emoji:"🟫",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq24_malg",name:"Antico del Pantano Malagor",emoji:"🌊",hp:118,maxHp:118,atk:21,def:9,xp:95,isBoss:true}
      ]},
      {type:"loot",text:"Malagor affonda. Il pantano si calma. Nel cuore dell'isola trovate oggetti caduti nel fango nel corso dei secoli.",loot:{gold:[38,68],items:["Cuore del Pantano","Stivali del Fango","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq24_sf1",name:"Signore del Fango",emoji:"🟫",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq24_sf2",name:"Signore del Fango",emoji:"🟫",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq24_malg",name:"Antico del Pantano Malagor",emoji:"🌊",hp:118,maxHp:118,atk:21,def:9,xp:95,isBoss:true}
    ],
  },{
    id:"mq25", title:"Il Culto della Fiamma Nera", active:true,
    desc:"Il Culto della Fiamma Nera pianifica un rituale che libererà un'entità distruttiva. La cerimonia è a tre giorni.",
    flavor:"«Bruciano le notti e pregano qualcosa che non ha nome. O forse ne ha troppi.» — Spia Merian",
    difficulty:"medio", xpReward:215, goldReward:92,
    steps:[
      {type:"narrative",text:"Il tempio sotterraneo del Culto puzza di incenso e bruciato. Decine di figure in veste nera recitano in coro una preghiera gutturale."},
      {type:"choice",text:"Il Gran Sacerdote conduce il rituale al centro. Il falò nero al centro della sala è già acceso.",choices:[
        {label:"💧 Spegnete il falò con acqua consacrata",xp:20,gold:11,next:2,correct:true},
        {label:"⚔️ Attaccate direttamente il Gran Sacerdote",xp:0,gold:0,next:2,correct:false},
        {label:"🔥 Aggiungete carburante per accelerare e rovinare il rituale",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Due **Cultisti della Fiamma** sfoggiano torce nere e il **Gran Sacerdote Pyrax** invoca le fiamme nere!",monsters:[
        {id:"mq25_cf1",name:"Cultista della Fiamma",emoji:"🔥",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq25_cf2",name:"Cultista della Fiamma",emoji:"🔥",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq25_pyrax",name:"Gran Sacerdote Pyrax",emoji:"🖤",hp:95,maxHp:95,atk:18,def:6,xp:80,isBoss:true}
      ]},
      {type:"loot",text:"Il rituale è distrutto. Il falò si spegne. Nelle celle del tempio trovate le offerte dei cultisti e oggetti rubati ai fedeli.",loot:{gold:[33,60],items:["Libro del Culto della Fiamma","Fiala della Fiamma Nera","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq25_cf1",name:"Cultista della Fiamma",emoji:"🔥",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq25_cf2",name:"Cultista della Fiamma",emoji:"🔥",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq25_pyrax",name:"Gran Sacerdote Pyrax",emoji:"🖤",hp:95,maxHp:95,atk:18,def:6,xp:80,isBoss:true}
    ],
  },{
    id:"mq26", title:"La Grotta dei Cristalli Maledetti", active:true,
    desc:"Una grotta di cristalli magici è stata corrotta da un antico incantesimo. I cristalli ora generano guardiani di gemma che attaccano i minatori.",
    flavor:"«I cristalli cantano. Una melodia bellissima. Chi la sente troppo a lungo smette di tornare.» — Nara, geologa",
    difficulty:"medio", xpReward:225, goldReward:98,
    steps:[
      {type:"narrative",text:"La grotta è abbagliante: cristalli di ogni colore riflettono la luce in mille direzioni. Ma tra i riflessi si muovono figure di gemma con occhi vuoti."},
      {type:"choice",text:"Il cristallo centrale — un monolit viola alto due metri — emette la melodia corruttrice.",choices:[
        {label:"🎵 Suonate la melodia al contrario con uno strumento",xp:21,gold:12,next:2,correct:true},
        {label:"🪨 Spaccate il cristallo centrale con un piccone",xp:0,gold:0,next:2,correct:false},
        {label:"👂 Ascoltate la melodia per capirla",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guardiani di Cristallo** si staccano dalla parete e il **Cristallo Antico Violaceo** prende forma umanoide!",monsters:[
        {id:"mq26_gc1",name:"Guardiano di Cristallo",emoji:"💎",hp:55,maxHp:55,atk:13,def:7,xp:43,isBoss:false},
        {id:"mq26_gc2",name:"Guardiano di Cristallo",emoji:"💎",hp:55,maxHp:55,atk:13,def:7,xp:43,isBoss:false},
        {id:"mq26_criantico",name:"Cristallo Antico Violaceo",emoji:"🔮",hp:112,maxHp:112,atk:19,def:9,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"La melodia si spezza. I cristalli tornano inattivi. I frammenti del cristallo antico sono materiali arcani di grandissimo valore.",loot:{gold:[36,65],items:["Frammento del Cristallo Antico","Polvere di Gemma Pura","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq26_gc1",name:"Guardiano di Cristallo",emoji:"💎",hp:55,maxHp:55,atk:13,def:7,xp:43,isBoss:false},
      {id:"mq26_gc2",name:"Guardiano di Cristallo",emoji:"💎",hp:55,maxHp:55,atk:13,def:7,xp:43,isBoss:false},
      {id:"mq26_criantico",name:"Cristallo Antico Violaceo",emoji:"🔮",hp:112,maxHp:112,atk:19,def:9,xp:90,isBoss:true}
    ],
  },{
    id:"mq27", title:"L'Armata degli Insetti Giganti", active:true,
    desc:"Una colonia di insetti giganti guidata da una regina oscura marcia verso la città. Se non si ferma il nucleo, la città verrà devastata.",
    flavor:"«Marciano in formazione. Come un esercito. Solo con tropte zampe e troppe antenne.» — Generale Holt",
    difficulty:"medio", xpReward:230, goldReward:100,
    steps:[
      {type:"narrative",text:"La pianura a est è in movimento. Migliaia di insetti giganti avanzano in colonne ordinate verso le mura della città. Il ronzio è assordante."},
      {type:"choice",text:"La regina è al centro della formazione — identificabile dall'enorme addome dorato.",choices:[
        {label:"💨 Create un vento di fumo per disorientare la colonia",xp:21,gold:12,next:2,correct:true},
        {label:"🔥 Appiccate fuochi perimetrali",xp:0,gold:0,next:2,correct:false},
        {label:"🏹 Tirate frecce verso la massa",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guerrieri Mantide** vi caricano con scudos di chitina e la **Regina degli Insetti Oscura** sfoggia il suo pungiglione d'oro!",monsters:[
        {id:"mq27_gm1",name:"Guerriero Mantide",emoji:"🦗",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq27_gm2",name:"Guerriero Mantide",emoji:"🦗",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq27_regina",name:"Regina degli Insetti Oscura",emoji:"👑",hp:115,maxHp:115,atk:20,def:8,xp:92,isBoss:true}
      ]},
      {type:"loot",text:"La regina cade e la colonia si disperde. Il pungiglione d'oro della regina è un materiale raro di grande valore.",loot:{gold:[38,68],items:["Pungiglione d'Oro della Regina","Chitina degli Insetti","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq27_gm1",name:"Guerriero Mantide",emoji:"🦗",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq27_gm2",name:"Guerriero Mantide",emoji:"🦗",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq27_regina",name:"Regina degli Insetti Oscura",emoji:"👑",hp:115,maxHp:115,atk:20,def:8,xp:92,isBoss:true}
    ],
  },{
    id:"mq28", title:"La Fortezza del Nord Gelato", active:true,
    desc:"La Fortezza di Frostmark è caduta in mano a guerrieri del ghiaccio — creature di gelo che vivono nel freddo estremo.",
    flavor:"«Il freddo non viene dal clima. Viene dalla fortezza. Ha la sua volontà.» — Kira, esploratrice artica",
    difficulty:"medio", xpReward:240, goldReward:105,
    steps:[
      {type:"narrative",text:"La fortezza di Frostmark brilla di ghiaccio eterno. Ogni superficie è ricoperta di cristalli e l'aria brucia i polmoni come lame."},
      {type:"choice",text:"Il Signore del Gelo trona nella sala principale — una figura di ghiaccio vivo su un trono di stalattiti.",choices:[
        {label:"🔥 Usate torce di olio di drago per combattere il freddo",xp:22,gold:13,next:2,correct:true},
        {label:"❄️ Cercate di adattarvi al freddo senza resistere",xp:0,gold:0,next:2,correct:false},
        {label:"🪨 Rompete le finestre per far entrare calore",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guerrieri del Ghiaccio** avanzano lasciando brina al loro passaggio e il **Signore del Gelo Frimor** alza la sua lancia di ghiaccio!",monsters:[
        {id:"mq28_gg1",name:"Guerriero del Ghiaccio",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq28_gg2",name:"Guerriero del Ghiaccio",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq28_frimor",name:"Signore del Gelo Frimor",emoji:"❄️",hp:120,maxHp:120,atk:21,def:10,xp:96,isBoss:true}
      ]},
      {type:"loot",text:"Frimor si scioglie. La fortezza perde il suo ghiaccio eterno. Nei magazzini trovate le provviste di chi ci abitava prima e tesori del nord.",loot:{gold:[40,70],items:["Lancia di Ghiaccio di Frimor","Cristallo del Gelo Eterno","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq28_gg1",name:"Guerriero del Ghiaccio",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq28_gg2",name:"Guerriero del Ghiaccio",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq28_frimor",name:"Signore del Gelo Frimor",emoji:"❄️",hp:120,maxHp:120,atk:21,def:10,xp:96,isBoss:true}
    ],
  },{
    id:"mq29", title:"Il Santuario del Fuoco Antico", active:true,
    desc:"Il Santuario del Fuoco Antico si è riattivato da solo. I guardiani di fiamma respingono ogni visitatore e l'energia si espande verso i villaggi.",
    flavor:"«Il fuoco lì dentro non ha colore. Bianco puro. Il fuoco bianco non brucia la carne — brucia l'anima.» — Sacerdote Elvar",
    difficulty:"medio", xpReward:230, goldReward:100,
    steps:[
      {type:"narrative",text:"Il Santuario del Fuoco Antico emana calore visibile nell'aria. Il suolo intorno è vetrificato e l'erba brucia appena vi si mette piede."},
      {type:"choice",text:"Al centro del santuario l'Avatar della Fiamma — un essere di fuoco bianco — recita una preghiera infinita.",choices:[
        {label:"💧 Avanzate con scudi d'acqua consacrata",xp:21,gold:12,next:2,correct:true},
        {label:"🔥 Rispondete alla preghiera con fuoco vostro",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Interrompete la preghiera gridando",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guardiani della Fiamma** erompono dal pavimento e l'**Avatar della Fiamma Antica** si rivolge verso di voi!",monsters:[
        {id:"mq29_gf1",name:"Guardiano della Fiamma",emoji:"🔥",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq29_gf2",name:"Guardiano della Fiamma",emoji:"🔥",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq29_avatar",name:"Avatar della Fiamma Antica",emoji:"🌟",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"L'avatar si quieta. Il santuario torna in quiescenza. Nelle ceneri trovate cristalli di fuoco e reliquie antiche.",loot:{gold:[38,68],items:["Cristallo del Fuoco Antico","Amuleto dell'Avatar","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq29_gf1",name:"Guardiano della Fiamma",emoji:"🔥",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq29_gf2",name:"Guardiano della Fiamma",emoji:"🔥",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq29_avatar",name:"Avatar della Fiamma Antica",emoji:"🌟",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
    ],
  },{
    id:"mq30", title:"Il Contrabbandiere delle Ombre", active:true,
    desc:"La rete di contrabbando del porto gestisce oggetti magici illegali. Il capobanda è protetto da guardie soprannaturali.",
    flavor:"«Vende cose che non dovreste comprare a persone che non dovreste conoscere.» — Ispettore Raine",
    difficulty:"medio", xpReward:215, goldReward:92,
    steps:[
      {type:"narrative",text:"Il magazzino 7 del porto è illuminato di notte quando dovrebbe essere buio. Le sentinelle oscure pattugliano il perimetro senza pause."},
      {type:"choice",text:"Il capobanda — noto come 'L'Ombra' — non incontra mai nessuno in persona. Comunica solo tramite messaggi.",choices:[
        {label:"📜 Intercettate un messaggio e seguite le indicazioni",xp:20,gold:11,next:2,correct:true},
        {label:"⚔️ Fate irruzione con la forza",xp:0,gold:0,next:2,correct:false},
        {label:"💰 Fingete di essere acquirenti",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Contrabbandieri dell'Ombra** sfoggiano lame magiche e il **Capobanda l'Ombra Revan** emerge dall'oscurità!",monsters:[
        {id:"mq30_co1",name:"Contrabbandiere dell'Ombra",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq30_co2",name:"Contrabbandiere dell'Ombra",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
        {id:"mq30_revan",name:"Capobanda l'Ombra Revan",emoji:"🕵️",hp:95,maxHp:95,atk:18,def:7,xp:80,isBoss:true}
      ]},
      {type:"loot",text:"La rete è distrutta. Nel magazzino trovate oggetti magici sequestrati e la cassa del contrabbandiere.",loot:{gold:[33,60],items:["Mantello dell'Ombra","Oggetti Magici Contrabbandati","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq30_co1",name:"Contrabbandiere dell'Ombra",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq30_co2",name:"Contrabbandiere dell'Ombra",emoji:"🌑",hp:48,maxHp:48,atk:12,def:4,xp:38,isBoss:false},
      {id:"mq30_revan",name:"Capobanda l'Ombra Revan",emoji:"🕵️",hp:95,maxHp:95,atk:18,def:7,xp:80,isBoss:true}
    ],
  },{
    id:"mq31", title:"La Gilda dei Veleni", active:true,
    desc:"La Gilda dei Veleni sta eliminando personalità chiave della città usando tossinee rare. Il Maestro dei Veleni deve essere fermato.",
    flavor:"«Non sono veleni qualsiasi. Sono veleni che uccidono in ritardo — così hai tutto il tempo di soffrire.» — Medico Aldris",
    difficulty:"medio", xpReward:220, goldReward:95,
    steps:[
      {type:"narrative",text:"La gilda opera da un laboratorio nascosto sotto una spezieria. L'odore di erbe e morte si mescola in modo quasi appetitoso."},
      {type:"choice",text:"Il Maestro dei Veleni lavora con maschere antigas e guanti di cuoio. I suoi assistenti sono armati di siringhe.",choices:[
        {label:"🌬️ Usate i loro stessi veleni gassosi contro di loro",xp:20,gold:11,next:2,correct:true},
        {label:"⚔️ Attaccate prima che si proteggano",xp:0,gold:0,next:2,correct:false},
        {label:"🧤 Indossate guanti per manipolare i veleni",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Assassini della Gilda** lanciano dardi avvelenati e il **Maestro dei Veleni Sorrax** avvelena l'aria stessa!",monsters:[
        {id:"mq31_as1",name:"Assassino della Gilda",emoji:"🗡️",hp:48,maxHp:48,atk:14,def:4,xp:38,isBoss:false},
        {id:"mq31_as2",name:"Assassino della Gilda",emoji:"🗡️",hp:48,maxHp:48,atk:14,def:4,xp:38,isBoss:false},
        {id:"mq31_sorrax",name:"Maestro dei Veleni Sorrax",emoji:"☠️",hp:98,maxHp:98,atk:18,def:6,xp:80,isBoss:true}
      ]},
      {type:"loot",text:"La gilda è smantellata. Nel laboratorio trovate antidoti rari e il registro dei contratti — informazioni preziose.",loot:{gold:[34,62],items:["Antidoto Universale","Registro dei Contratti","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq31_as1",name:"Assassino della Gilda",emoji:"🗡️",hp:48,maxHp:48,atk:14,def:4,xp:38,isBoss:false},
      {id:"mq31_as2",name:"Assassino della Gilda",emoji:"🗡️",hp:48,maxHp:48,atk:14,def:4,xp:38,isBoss:false},
      {id:"mq31_sorrax",name:"Maestro dei Veleni Sorrax",emoji:"☠️",hp:98,maxHp:98,atk:18,def:6,xp:80,isBoss:true}
    ],
  },{
    id:"mq32", title:"I Nomadi del Deserto Rosso", active:true,
    desc:"I nomadi guerrieri del Deserto Rosso hanno sbarrato le rotte commerciali. Il loro campione sfida chiunque a duello prima di permettere il passaggio.",
    flavor:"«Combattono per codice d'onore. Vincete il campione e il passo è vostro. Perdete e siete schiavi.» — Mercante Karo",
    difficulty:"medio", xpReward:225, goldReward:98,
    steps:[
      {type:"narrative",text:"Le dune rosse si estendono all'infinito. Al passo, un campo nomade di tende color sabbia con guerrieri armati di scimitarre e lance."},
      {type:"choice",text:"Il campione vi sfida. Si aspetta un duello secondo le tradizioni del deserto.",choices:[
        {label:"⚔️ Accettate il duello con onore",xp:21,gold:12,next:2,correct:true},
        {label:"💰 Tentate di comprare il passo",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Cercate di aggirare il campo di notte",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Il campione porta con sé due **Nomadi Guerrieri** come testimoni armati e il **Campione Nomade Rakash** entra nel cerchio di duello!",monsters:[
        {id:"mq32_ng1",name:"Nomade Guerriero",emoji:"🗡️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq32_ng2",name:"Nomade Guerriero",emoji:"🗡️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq32_rakash",name:"Campione Nomade Rakash",emoji:"🌵",hp:105,maxHp:105,atk:20,def:8,xp:85,isBoss:true}
      ]},
      {type:"loot",text:"Rakash si inchina con rispetto. I nomadi vi aprono il passo e vi donano tesori del deserto come segno di rispetto.",loot:{gold:[35,64],items:["Scimitarra del Deserto","Spezie Preziose Nomadi","Amuleto del Deserto Rosso"]}}
    ],
    enemies:[
      {id:"mq32_ng1",name:"Nomade Guerriero",emoji:"🗡️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq32_ng2",name:"Nomade Guerriero",emoji:"🗡️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq32_rakash",name:"Campione Nomade Rakash",emoji:"🌵",hp:105,maxHp:105,atk:20,def:8,xp:85,isBoss:true}
    ],
  },{
    id:"mq33", title:"La Cripta dei Principi", active:true,
    desc:"I principi sepolti nella cripta reale si sono risvegliati come non-morti. Il principe spettrale più antico reclama il trono dei vivi.",
    flavor:"«Non reclamano vendetta. Reclamano il potere. E hanno diritto di successione.» — Cancelliere Bram",
    difficulty:"medio", xpReward:235, goldReward:102,
    steps:[
      {type:"narrative",text:"La cripta reale è profonda e decorata con sfarzo. Ogni sarcofago è aperto e le figure di pietra che un tempo custodivano i principi ora sono in pezzi."},
      {type:"choice",text:"Il principe spettrale più antico porta ancora la corona reale — un simbolo di potere che va recuperato.",choices:[
        {label:"👑 Reclamate la corona per conto del re attuale",xp:22,gold:13,next:2,correct:true},
        {label:"⚔️ Attaccate subito per recuperare la corona",xp:0,gold:0,next:2,correct:false},
        {label:"📜 Leggete il testamento reale ad alta voce",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guardiani Reali Non-Morti** sbarrano la sala del trono e il **Principe Spettrale Aldrus** alza lo scettro!",monsters:[
        {id:"mq33_grnd1",name:"Guardiano Reale Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq33_grnd2",name:"Guardiano Reale Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq33_aldrus",name:"Principe Spettrale Aldrus",emoji:"👑",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"Aldrus torna alla terra. La corona è recuperata. Il re vi ricompensa con il tesoro della cripta.",loot:{gold:[38,68],items:["Corona del Principe (replica)","Scettro Spettrale","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq33_grnd1",name:"Guardiano Reale Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq33_grnd2",name:"Guardiano Reale Non-Morto",emoji:"⚔️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq33_aldrus",name:"Principe Spettrale Aldrus",emoji:"👑",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
    ],
  },{
    id:"mq34", title:"L'Abisso del Lago Nero", active:true,
    desc:"Qualcosa di antico si è svegliato nelle profondità del Lago Nero e manda creature dell'abisso a devastare le rive.",
    flavor:"«Il lago non ha fondo. Ha sempre detto così. Ora lo sappiamo.» — Pescatrice Mira",
    difficulty:"medio", xpReward:240, goldReward:105,
    steps:[
      {type:"narrative",text:"Il Lago Nero non ha mai riflesso il cielo — solo il buio. Ora le acque ribollono e forme tentacolari emergono la notte."},
      {type:"choice",text:"Il mostro dell'abisso comunica tramite vibrazioni — un linguaggio di pressione sull'acqua.",choices:[
        {label:"🌊 Battete un ritmo sull'acqua per comunicare",xp:22,gold:13,next:2,correct:true},
        {label:"🏹 Sparate frecce nelle acque scure",xp:0,gold:0,next:2,correct:false},
        {label:"💣 Gettate esplosivi nel lago",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Kraken Minori** sollevano tentacoli e il **Mostro del Lago Nero** emerge con ruggito abissale!",monsters:[
        {id:"mq34_km1",name:"Kraken Minore",emoji:"🦑",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
        {id:"mq34_km2",name:"Kraken Minore",emoji:"🦑",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
        {id:"mq34_mostro",name:"Mostro del Lago Nero",emoji:"🌊",hp:118,maxHp:118,atk:21,def:9,xp:95,isBoss:true}
      ]},
      {type:"loot",text:"Il mostro si ritira. Il lago si calma. Sul fondo, ora accessibile, ci sono tesori di naufragi accumulati in secoli.",loot:{gold:[40,70],items:["Corallo Abissale","Tesoro del Naufragio","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq34_km1",name:"Kraken Minore",emoji:"🦑",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
      {id:"mq34_km2",name:"Kraken Minore",emoji:"🦑",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
      {id:"mq34_mostro",name:"Mostro del Lago Nero",emoji:"🌊",hp:118,maxHp:118,atk:21,def:9,xp:95,isBoss:true}
    ],
  },{
    id:"mq35", title:"Il Monastero della Lama Oscura", active:true,
    desc:"Il monastero dei monaci guerrieri è caduto sotto l'influenza di un gran maestro corrotto. I monaci ora uccidono per contratto.",
    flavor:"«Li abbiamo addestrati per difendere. Ora uccidono per oro. La differenza è piccola ma importante.» — Ex-Gran Maestro Ryu",
    difficulty:"medio", xpReward:225, goldReward:98,
    steps:[
      {type:"narrative",text:"Il monastero della Lama Oscura è silenzioso e disciplinato. Ogni monaco si muove con precisione, ma negli occhi c'è vuoto — come soldati senza anima."},
      {type:"choice",text:"Il Gran Maestro corrotto medita al centro del cortile principale.",choices:[
        {label:"🥷 Sfidate il Gran Maestro secondo il codice del monastero",xp:21,gold:12,next:2,correct:true},
        {label:"⚔️ Attaccate a sorpresa durante la meditazione",xp:0,gold:0,next:2,correct:false},
        {label:"📜 Leggete il codice antico per richiamarli",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Monaci della Lama** si dispongono ai fianchi e il **Gran Maestro Corrotto Shin** si drizza con occhi neri!",monsters:[
        {id:"mq35_ml1",name:"Monaco della Lama",emoji:"🥋",hp:52,maxHp:52,atk:14,def:5,xp:41,isBoss:false},
        {id:"mq35_ml2",name:"Monaco della Lama",emoji:"🥋",hp:52,maxHp:52,atk:14,def:5,xp:41,isBoss:false},
        {id:"mq35_shin",name:"Gran Maestro Corrotto Shin",emoji:"⚔️",hp:108,maxHp:108,atk:21,def:8,xp:88,isBoss:true}
      ]},
      {type:"loot",text:"Shin cade e la corruzione si spezza. I monaci tornano in sé. Il tesoro del monastero è aperto al party.",loot:{gold:[35,64],items:["Lama del Gran Maestro","Cintura del Monaco Oscuro","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq35_ml1",name:"Monaco della Lama",emoji:"🥋",hp:52,maxHp:52,atk:14,def:5,xp:41,isBoss:false},
      {id:"mq35_ml2",name:"Monaco della Lama",emoji:"🥋",hp:52,maxHp:52,atk:14,def:5,xp:41,isBoss:false},
      {id:"mq35_shin",name:"Gran Maestro Corrotto Shin",emoji:"⚔️",hp:108,maxHp:108,atk:21,def:8,xp:88,isBoss:true}
    ],
  },{
    id:"mq36", title:"Il Portale Corrotto di Edenmoor", active:true,
    desc:"Un portale dimensionale si è corrotto ad Edenmoor e riversa aberrazioni nel mondo dei vivi. Va chiuso dall'interno.",
    flavor:"«Non è magia che conosco. È qualcosa di più vecchio della magia stessa.» — Arcimago Eryn",
    difficulty:"medio", xpReward:235, goldReward:102,
    steps:[
      {type:"narrative",text:"Il portale di Edenmoor pulsa come un cuore malato. L'aria intorno è distorta e le aberrazioni che escono non appartengono a nessun bestiario conosciuto."},
      {type:"choice",text:"Il nucleo del portale è accessibile solo dall'interno — qualcuno deve entrare per sigillarlo.",choices:[
        {label:"✨ Entrate nel portale con rune di ancoraggio",xp:22,gold:13,next:2,correct:true},
        {label:"💣 Distruggete la struttura del portale dall'esterno",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiamate un'entità più forte per combatterla",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"Le **Aberrazioni** attaccano da ogni angolo e il **Guardiano del Portale Corrotto** blocca il nucleo!",monsters:[
        {id:"mq36_ab1",name:"Aberrazione",emoji:"👾",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq36_ab2",name:"Aberrazione",emoji:"👾",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq36_guardp",name:"Guardiano del Portale Corrotto",emoji:"🌀",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"Il portale si chiude. Dall'altro lato avete intravisto qualcosa di enorme che ora è separato da voi per sempre — o quasi.",loot:{gold:[38,68],items:["Frammento del Portale","Cristallo Dimensionale","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq36_ab1",name:"Aberrazione",emoji:"👾",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq36_ab2",name:"Aberrazione",emoji:"👾",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq36_guardp",name:"Guardiano del Portale Corrotto",emoji:"🌀",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
    ],
  },{
    id:"mq37", title:"La Città Sotto il Ghiaccio", active:true,
    desc:"Una città antica è stata scoperta sotto i ghiacci del Nord. I ghoul glaciali che la abitano ora marciano verso i villaggi vicini.",
    flavor:"«Hanno costruito case, chiese, mercati. E li abitano ancora. Solo che sono morti da mille anni.» — Esploratore Kern",
    difficulty:"medio", xpReward:240, goldReward:105,
    steps:[
      {type:"narrative",text:"La città sotto il ghiaccio è perfettamente conservata — strade, edifici, piazze. Solo il colore è sbagliato: tutto è blu-bianco e i ghoul si muovono come cittadini."},
      {type:"choice",text:"Il Re Ghoul siede sul trono di ghiaccio nella sala centrale, con la corona ancora in testa.",choices:[
        {label:"🔥 Portate torce di fuoco sacro per sciogliere la sua influenza",xp:22,gold:13,next:2,correct:true},
        {label:"❄️ Tentate di congelare anche voi per comunicare",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiamate il re per nome",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Ghoul Glaciali** avanzano lasciando impronte ghiacciate e il **Re Ghoul del Nord Ikarus** urla un comando silenzioso!",monsters:[
        {id:"mq37_gg1",name:"Ghoul Glaciale",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq37_gg2",name:"Ghoul Glaciale",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq37_ikarus",name:"Re Ghoul Ikarus del Nord",emoji:"👑",hp:115,maxHp:115,atk:21,def:9,xp:92,isBoss:true}
      ]},
      {type:"loot",text:"Ikarus si frantuma. La città sotto il ghiaccio torna silenziosa. I suoi tesori di mille anni sono ora vostri.",loot:{gold:[40,70],items:["Corona di Ghiaccio di Ikarus","Monete della Città Perduta","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq37_gg1",name:"Ghoul Glaciale",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq37_gg2",name:"Ghoul Glaciale",emoji:"🧊",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq37_ikarus",name:"Re Ghoul Ikarus del Nord",emoji:"👑",hp:115,maxHp:115,atk:21,def:9,xp:92,isBoss:true}
    ],
  },{
    id:"mq38", title:"I Mangiatori di Stelle", active:true,
    desc:"Entità cosmiche sono cadute dal cielo con una meteorite e ora cercano di consumare la mente dei maghi della regione.",
    flavor:"«Non sono di questo mondo. Non pensano come noi. Mangiano ciò che non vediamo.» — Arcimago Nessa",
    difficulty:"medio", xpReward:230, goldReward:100,
    steps:[
      {type:"narrative",text:"La meteora è atterrata nel giardino dell'accademia. Ora un buco circolare nel suolo emana un campo di energia che distorce i pensieri."},
      {type:"choice",text:"Le entità si nutrono di magia attiva. Ogni incantesimo le rende più forti.",choices:[
        {label:"🚫 Bloccate ogni uso di magia durante l'approccio",xp:21,gold:12,next:2,correct:true},
        {label:"✨ Lanciate il vostro incantesimo più potente",xp:0,gold:0,next:2,correct:false},
        {label:"📖 Studiate il campo di energia prima di agire",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Mangiatori di Stella** fluttuano verso di voi e l'**Intelletto Divoratore** punta direttamente alle vostre menti!",monsters:[
        {id:"mq38_ms1",name:"Mangiatore di Stella",emoji:"⭐",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
        {id:"mq38_ms2",name:"Mangiatore di Stella",emoji:"⭐",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
        {id:"mq38_intell",name:"Intelletto Divoratore",emoji:"🧠",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
      ]},
      {type:"loot",text:"Le entità si dissolvono. La meteora è ora inerte — un minerale cosmico di valore incalcolabile.",loot:{gold:[38,68],items:["Frammento di Meteora Cosmica","Cristallo della Mente","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq38_ms1",name:"Mangiatore di Stella",emoji:"⭐",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
      {id:"mq38_ms2",name:"Mangiatore di Stella",emoji:"⭐",hp:52,maxHp:52,atk:13,def:4,xp:41,isBoss:false},
      {id:"mq38_intell",name:"Intelletto Divoratore",emoji:"🧠",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
    ],
  },{
    id:"mq39", title:"L'Arena degli Schiavi", active:true,
    desc:"Un'arena illegale sfrutta i prigionieri come gladiatori. Liberare i prigionieri richiede di sconfiggere il campione dell'arena.",
    flavor:"«Il campione non ha perso in tre anni. Non perché sia forte. Perché non ha nulla da perdere.» — Ex-gladiatore Renn",
    difficulty:"medio", xpReward:240, goldReward:105,
    steps:[
      {type:"narrative",text:"L'arena sotterranea puzula di sangue e folla. I gladiatori si scontrano sotto le urla dei scommettitori. Il campione aspetta in silenzio."},
      {type:"choice",text:"Il proprietario dell'arena ha un accordo: sconfiggete il campione e i prigionieri sono liberi.",choices:[
        {label:"⚔️ Accettate e entrate nell'arena",xp:22,gold:13,next:2,correct:true},
        {label:"🌿 Cercate vie di fuga alternative",xp:0,gold:0,next:2,correct:false},
        {label:"💰 Tentate di comprare i prigionieri",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Gladiatori** entrano per scaldarsi la folla e il **Campione dell'Arena Korvas** entra tra tuoni di applausi!",monsters:[
        {id:"mq39_gl1",name:"Gladiatore",emoji:"🛡️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq39_gl2",name:"Gladiatore",emoji:"🛡️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq39_korvas",name:"Campione Korvas",emoji:"⚔️",hp:115,maxHp:115,atk:21,def:9,xp:92,isBoss:true}
      ]},
      {type:"loot",text:"Korvas cade in ginocchio e saluta. I prigionieri sono liberi. La cassa delle scommesse appartiene ai vincitori.",loot:{gold:[40,70],items:["Arma del Campione","Borsa delle Scommesse","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq39_gl1",name:"Gladiatore",emoji:"🛡️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq39_gl2",name:"Gladiatore",emoji:"🛡️",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq39_korvas",name:"Campione Korvas",emoji:"⚔️",hp:115,maxHp:115,atk:21,def:9,xp:92,isBoss:true}
    ],
  },{
    id:"mq40", title:"La Sorgente Avvelenata", active:true,
    desc:"La Sorgente Sacra è stata avvelenata da una naga. L'acqua ha smesso di guarire e ora provoca allucinazioni.",
    flavor:"«L'acqua era santa. Ora chi la beve vede cose che non ci sono. O peggio — vede cose che ci sono davvero.» — Guaritore Triel",
    difficulty:"medio", xpReward:235, goldReward:102,
    steps:[
      {type:"narrative",text:"La Sorgente Sacra è viola ora. Attorno crescono fiori neri e l'aria odora di miele marcio. Sentite sibili dall'acqua."},
      {type:"choice",text:"La naga ha il controllo della sorgente. Parla le lingue degli antichi. Potrebbe negoziare.",choices:[
        {label:"🌿 Portate erbe purificanti come offerta di pace",xp:22,gold:13,next:2,correct:true},
        {label:"⚔️ Attaccate la naga nell'acqua",xp:0,gold:0,next:2,correct:false},
        {label:"💧 Tentate di purificare l'acqua senza affrontarla",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Serpenti del Veleno** scivolano fuori dall'acqua e la **Naga Velenos** si drizza altissima!",monsters:[
        {id:"mq40_sv1",name:"Serpente del Veleno",emoji:"☠️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq40_sv2",name:"Serpente del Veleno",emoji:"☠️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
        {id:"mq40_naga",name:"Naga Velenos",emoji:"🐍",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"La naga si ritira. La sorgente si purifica lentamente. Il veleno estratto è un componente alchemico preziosissimo.",loot:{gold:[38,68],items:["Veleno di Naga (purificato)","Squame della Naga","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq40_sv1",name:"Serpente del Veleno",emoji:"☠️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq40_sv2",name:"Serpente del Veleno",emoji:"☠️",hp:52,maxHp:52,atk:13,def:5,xp:41,isBoss:false},
      {id:"mq40_naga",name:"Naga Velenos",emoji:"🐍",hp:112,maxHp:112,atk:20,def:8,xp:90,isBoss:true}
    ],
  },{
    id:"mq41", title:"Il Covo dei Raksha", active:true,
    desc:"I Raksha — demoni a forma di tigre — hanno stabilito un covo nelle rovine a est. Rapiscono viaggiatori per usarli nei loro rituali.",
    flavor:"«Non urlano. Ronronano. Poi ti uccidono come se stessero accarezzando qualcosa.» — Unico sopravvissuto",
    difficulty:"medio", xpReward:245, goldReward:108,
    steps:[
      {type:"narrative",text:"Le rovine odorano di muschio e caccia. Impronte di grandi felini con artigli troppo lunghi marcano il suolo. Da dentro arriva un ronzio profondo."},
      {type:"choice",text:"Il Signore Raksha medita su un altare di ossa. I prigionieri sono dietro grate di ferro.",choices:[
        {label:"🌿 Liberate prima i prigionieri creando una diversione",xp:23,gold:13,next:2,correct:true},
        {label:"⚔️ Attaccate il Signore Raksha direttamente",xp:0,gold:0,next:2,correct:false},
        {label:"🐱 Cercate di comunicare con i Raksha",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Raksha Cacciatori** saltano dai muri e il **Signore Raksha Tigraath** mostra le zanne!",monsters:[
        {id:"mq41_rk1",name:"Raksha Cacciatore",emoji:"🐯",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
        {id:"mq41_rk2",name:"Raksha Cacciatore",emoji:"🐯",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
        {id:"mq41_tigr",name:"Signore Raksha Tigraath",emoji:"🦁",hp:118,maxHp:118,atk:22,def:9,xp:95,isBoss:true}
      ]},
      {type:"loot",text:"Tigraath cade e i Raksha fuggono. I prigionieri liberati descrivono le ricchezze nel covo — tutto vostro.",loot:{gold:[40,72],items:["Artiglio di Raksha","Amuleto della Tigre","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq41_rk1",name:"Raksha Cacciatore",emoji:"🐯",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
      {id:"mq41_rk2",name:"Raksha Cacciatore",emoji:"🐯",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
      {id:"mq41_tigr",name:"Signore Raksha Tigraath",emoji:"🦁",hp:118,maxHp:118,atk:22,def:9,xp:95,isBoss:true}
    ],
  },{
    id:"mq42", title:"La Miniera degli Spettri", active:true,
    desc:"I fantasmi dei minatori morti in un crollo occupano la vecchia miniera di Coalend. Non lasciano passare nessuno.",
    flavor:"«Non vogliono vendetta. Vogliono che qualcuno ricordi cosa è successo.» — Spiritista Yona",
    difficulty:"medio", xpReward:230, goldReward:100,
    steps:[
      {type:"narrative",text:"La miniera di Coalend è silenziosa. I carrelli si muovono da soli su binari arrugginiti e le torce si accendono e spengono senza motivo."},
      {type:"choice",text:"Il capo spettrale — il capoMastro che morì per primo nel crollo — vuole che la sua storia sia raccontata.",choices:[
        {label:"📖 Ascoltate la storia del capoMastro fino alla fine",xp:21,gold:12,next:2,correct:true},
        {label:"🔔 Suonate il campanello d'emergenza della miniera",xp:0,gold:0,next:2,correct:false},
        {label:"⛏️ Tentate di riaprire la sezione crollata",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Minatori Spettrali** non accettano la vostra presenza e il **Capo Spettrale Elden** blocca l'uscita!",monsters:[
        {id:"mq42_sp1",name:"Minatore Spettrale",emoji:"⛏️",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
        {id:"mq42_sp2",name:"Minatore Spettrale",emoji:"⛏️",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
        {id:"mq42_elden",name:"Capo Spettrale Elden",emoji:"👻",hp:108,maxHp:108,atk:19,def:7,xp:88,isBoss:true}
      ]},
      {type:"loot",text:"Elden sorride e si dissolve. La miniera riapre. Nei livelli profondi trovate vene di minerale raro mai estratto.",loot:{gold:[38,68],items:["Carbone Magico della Miniera","Piccone dello Spettrale","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq42_sp1",name:"Minatore Spettrale",emoji:"⛏️",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
      {id:"mq42_sp2",name:"Minatore Spettrale",emoji:"⛏️",hp:52,maxHp:52,atk:12,def:5,xp:41,isBoss:false},
      {id:"mq42_elden",name:"Capo Spettrale Elden",emoji:"👻",hp:108,maxHp:108,atk:19,def:7,xp:88,isBoss:true}
    ],
  },{
    id:"mq43", title:"Il Circo Maledetto", active:true,
    desc:"Il Circo Errante si è accampato fuori città — ma i visitatori che entrano non ricordano più di essere usciti.",
    flavor:"«Le risate si sentono fino al villaggio. E poi silenzio. Poi di nuovo risate. Sempre le stesse risate.» — Contadino Wick",
    difficulty:"medio", xpReward:225, goldReward:98,
    steps:[
      {type:"narrative",text:"Il circo è colorato e rumoroso. Le luci danzano, gli acrobati volano — ma ogni volta che guardi un volto, c'è qualcosa di sbagliato negli occhi."},
      {type:"choice",text:"Il domatore — un uomo troppo alto con un sorriso troppo largo — è chiaramente la fonte della maledizione.",choices:[
        {label:"🎪 Entrate come pubblico per avvicinarvi senza allarmare",xp:21,gold:12,next:2,correct:true},
        {label:"🔥 Bruciate la tenda principale",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Urlate avvertimenti alla folla",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Giullari Maledetti** lanciano coltelli veri e il **Domatore Corrotto Harlequin** scatta fuori dal cappello!",monsters:[
        {id:"mq43_gm1",name:"Giullare Maledetto",emoji:"🤡",hp:50,maxHp:50,atk:13,def:4,xp:40,isBoss:false},
        {id:"mq43_gm2",name:"Giullare Maledetto",emoji:"🤡",hp:50,maxHp:50,atk:13,def:4,xp:40,isBoss:false},
        {id:"mq43_harl",name:"Domatore Corrotto Harlequin",emoji:"🎭",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
      ]},
      {type:"loot",text:"La maledizione si spezza. Le vittime ricordano tutto. Il circo si sgonfia lasciando il tesoro raccolto dal domatore.",loot:{gold:[35,64],items:["Cappello del Domatore","Coltelli del Giullare","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq43_gm1",name:"Giullare Maledetto",emoji:"🤡",hp:50,maxHp:50,atk:13,def:4,xp:40,isBoss:false},
      {id:"mq43_gm2",name:"Giullare Maledetto",emoji:"🤡",hp:50,maxHp:50,atk:13,def:4,xp:40,isBoss:false},
      {id:"mq43_harl",name:"Domatore Corrotto Harlequin",emoji:"🎭",hp:105,maxHp:105,atk:19,def:7,xp:85,isBoss:true}
    ],
  },{
    id:"mq44", title:"L'Isola dei Serpenti", active:true,
    desc:"L'Isola Sseth è l'unico approdo sicuro nel mare tempestoso, ma serpenti giganti la controllano. Va ripulita per permettere la navigazione.",
    flavor:"«Trecento anni fa era un paradiso. Poi i serpenti arrivarono dall'acqua. Non se ne sono mai andati.» — Capitano Vael",
    difficulty:"medio", xpReward:240, goldReward:105,
    steps:[
      {type:"narrative",text:"L'Isola Sseth è bella in modo inquietante. Palme, sabbia bianca — e ovunque serpenti di ogni dimensione che si muovono liberamente."},
      {type:"choice",text:"Il serpente più grande — un'anaconda reale lunga venti metri — dorme attorno al faro dell'isola.",choices:[
        {label:"🎵 Suonate una melodia incantante per calmare i serpenti",xp:22,gold:13,next:2,correct:true},
        {label:"🔥 Date fuoco alla vegetazione per cacciarli",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Attaccate l'anaconda direttamente",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Serpenti Giganti** emergono dalla sabbia e l'**Anaconda Reale Sseth** apre la bocca enorme!",monsters:[
        {id:"mq44_sg1",name:"Serpente Gigante",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
        {id:"mq44_sg2",name:"Serpente Gigante",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
        {id:"mq44_sseth",name:"Anaconda Reale Sseth",emoji:"🐊",hp:115,maxHp:115,atk:21,def:8,xp:92,isBoss:true}
      ]},
      {type:"loot",text:"L'isola è libera. Il faro torna a funzionare. Nel nido dell'anaconda ci sono tesori di naufraghi accumulati nel tempo.",loot:{gold:[40,70],items:["Squame di Anaconda Reale","Tesoro del Naufragio Sseth","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq44_sg1",name:"Serpente Gigante",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
      {id:"mq44_sg2",name:"Serpente Gigante",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
      {id:"mq44_sseth",name:"Anaconda Reale Sseth",emoji:"🐊",hp:115,maxHp:115,atk:21,def:8,xp:92,isBoss:true}
    ],
  },{
    id:"mq45", title:"La Fortezza dei Traditori", active:true,
    desc:"Un gruppo di cavalieri rinnegati ha preso una fortezza di confine. Il loro comandante ha venduto informazioni al nemico.",
    flavor:"«Li abbiamo addestrati. Hanno giurato fedeltà. Poi hanno aperto i cancelli e guardato dall'altro lato.» — Maresciallo Kern",
    difficulty:"medio", xpReward:235, goldReward:102,
    steps:[
      {type:"narrative",text:"La fortezza di Borderveil vola ancora i vecchi stendardi del regno — ma i cavalieri dentro portano segni diversi sulle armature."},
      {type:"choice",text:"Il comandante traditore ha sprangato le porte. Ma c'è un passaggio segreto nelle fondamenta.",choices:[
        {label:"🌿 Entrate dal passaggio segreto nelle fondamenta",xp:22,gold:13,next:2,correct:true},
        {label:"⚔️ Assediate la fortezza",xp:0,gold:0,next:2,correct:false},
        {label:"📜 Tentate una negoziazione diplomatica",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Cavalieri Traditori** vi affrontano nell'ombra e il **Comandante Traditore Aldran** sfoggia l'armatura d'oro del nemico!",monsters:[
        {id:"mq45_kt1",name:"Cavaliere Traditore",emoji:"⚔️",hp:55,maxHp:55,atk:14,def:6,xp:43,isBoss:false},
        {id:"mq45_kt2",name:"Cavaliere Traditore",emoji:"⚔️",hp:55,maxHp:55,atk:14,def:6,xp:43,isBoss:false},
        {id:"mq45_aldran",name:"Comandante Traditore Aldran",emoji:"💛",hp:112,maxHp:112,atk:20,def:9,xp:90,isBoss:true}
      ]},
      {type:"loot",text:"Aldran è catturato. La fortezza torna al regno. Il maresciallo vi premia con il tesoro confiscato ai traditori.",loot:{gold:[38,68],items:["Armatura del Traditore","Contratto del Tradimento","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq45_kt1",name:"Cavaliere Traditore",emoji:"⚔️",hp:55,maxHp:55,atk:14,def:6,xp:43,isBoss:false},
      {id:"mq45_kt2",name:"Cavaliere Traditore",emoji:"⚔️",hp:55,maxHp:55,atk:14,def:6,xp:43,isBoss:false},
      {id:"mq45_aldran",name:"Comandante Traditore Aldran",emoji:"💛",hp:112,maxHp:112,atk:20,def:9,xp:90,isBoss:true}
    ],
  },{
    id:"mq46", title:"Il Labirinto Vivente di Veldwood", active:true,
    desc:"La foresta di Veldwood si è trasformata in un labirinto vivente. Gli alberi si muovono e i viticci intrappolano chiunque entri.",
    flavor:"«La foresta ha una mente. E non vuole più ospiti.» — Druido Celwyn",
    difficulty:"medio", xpReward:245, goldReward:108,
    steps:[
      {type:"narrative",text:"Veldwood è diversa dall'interno: i sentieri cambiano, i rami si abbassano e i viticci si allungano verso le caviglie."},
      {type:"choice",text:"Il cuore del labirinto — una quercia antica da cui dipende tutto il sistema — pulsa di energia verde.",choices:[
        {label:"🌿 Parlate con la quercia nel linguaggio delle piante",xp:23,gold:14,next:2,correct:true},
        {label:"🔥 Bruciate la quercia centrale",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Tagliate ogni viticcio che toccate",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guardiani di Edera** si staccano dal suolo e il **Cuore del Labirinto** prende forma!",monsters:[
        {id:"mq46_ge1",name:"Guardiano di Edera",emoji:"🌿",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq46_ge2",name:"Guardiano di Edera",emoji:"🌿",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
        {id:"mq46_cuore",name:"Cuore del Labirinto",emoji:"🌳",hp:118,maxHp:118,atk:20,def:9,xp:95,isBoss:true}
      ]},
      {type:"loot",text:"La foresta si quieta. Veldwood apre i suoi segreti: frutta magica, resine rare e gemme cresciute nelle radici.",loot:{gold:[40,72],items:["Resina del Labirinto Vivente","Gemma della Quercia Antica","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq46_ge1",name:"Guardiano di Edera",emoji:"🌿",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq46_ge2",name:"Guardiano di Edera",emoji:"🌿",hp:55,maxHp:55,atk:13,def:6,xp:43,isBoss:false},
      {id:"mq46_cuore",name:"Cuore del Labirinto",emoji:"🌳",hp:118,maxHp:118,atk:20,def:9,xp:95,isBoss:true}
    ],
  },{
    id:"mq47", title:"La Corte del Re Morto", active:true,
    desc:"Il re di una nazione dimenticata regna ancora — come non-morto. I suoi cortigiani scheletro governano un castello vuoto con cerimonie senza senso.",
    flavor:"«Non è pazzo. È solo bloccato nell'ultimo giorno prima della sua morte. Ripete tutto come se potesse cambiare il finale.» — Storico Pellm",
    difficulty:"medio", xpReward:255, goldReward:112,
    steps:[
      {type:"narrative",text:"Il castello è magnifico e desolato. Cortigiani di ossa eseguono banchetti invisibili, danze senza musica e cerimonie senza senso davanti a un re non-morto."},
      {type:"choice",text:"Il re non sa di essere morto. Va informato con rispetto o convincendolo che il suo regno è finito.",choices:[
        {label:"📜 Mostrate il decreto che dichiara la fine del suo regno",xp:24,gold:14,next:2,correct:true},
        {label:"⚔️ Attaccate il re durante la cerimonia",xp:0,gold:0,next:2,correct:false},
        {label:"👑 Fingersi un emissario del regno successore",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Nobili Scheletro** difendono il loro re e il **Re Non-Morto Aldras** alza lo scettro secolare!",monsters:[
        {id:"mq47_ns1",name:"Nobile Scheletro",emoji:"💀",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
        {id:"mq47_ns2",name:"Nobile Scheletro",emoji:"💀",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
        {id:"mq47_aldras",name:"Re Non-Morto Aldras",emoji:"👑",hp:120,maxHp:120,atk:21,def:9,xp:96,isBoss:true}
      ]},
      {type:"loot",text:"Aldras crolla e il castello tace. I tesori di un regno antico sono tutti vostri.",loot:{gold:[42,74],items:["Corona del Re Morto","Scettro Secolare","Tesoro del Regno Dimenticato"]}}
    ],
    enemies:[
      {id:"mq47_ns1",name:"Nobile Scheletro",emoji:"💀",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
      {id:"mq47_ns2",name:"Nobile Scheletro",emoji:"💀",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
      {id:"mq47_aldras",name:"Re Non-Morto Aldras",emoji:"👑",hp:120,maxHp:120,atk:21,def:9,xp:96,isBoss:true}
    ],
  },{
    id:"mq48", title:"Il Tempio del Serpente Antico", active:true,
    desc:"Un tempio dedicato a un serpente-dio si è riattivato. I sacerdoti del serpente portano sacrifici e il serpente antico si è svegliato.",
    flavor:"«Il serpente dorme da mille anni. Ma i suoi sacerdoti non hanno mai smesso di cantargli ninna nanne.» — Avventuriero Ryn",
    difficulty:"medio", xpReward:250, goldReward:110,
    steps:[
      {type:"narrative",text:"Il tempio è sommerso di simboli di serpente. L'aria vibra di canti e dalla camera interna arriva il respiro lento e pesante di qualcosa di antico."},
      {type:"choice",text:"I sacerdoti proteggono il serpente con scudi di osso e lame curve.",choices:[
        {label:"🌿 Usate erbe soporifere nell'incenso del tempio",xp:23,gold:14,next:2,correct:true},
        {label:"⚔️ Attaccate i sacerdoti uno ad uno",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Interrompete il canto per svegliare il serpente",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Sacerdoti del Serpente** attaccano con lame avvelenate e il **Serpente Antico Nessath** apre gli occhi dorati!",monsters:[
        {id:"mq48_ss1",name:"Sacerdote del Serpente",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
        {id:"mq48_ss2",name:"Sacerdote del Serpente",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
        {id:"mq48_nessath",name:"Serpente Antico Nessath",emoji:"🌟",hp:118,maxHp:118,atk:21,def:9,xp:95,isBoss:true}
      ]},
      {type:"loot",text:"Nessath torna nel sonno eterno. Il tempio è saccheggiabile: offerte di secoli, oro e reliquie del culto.",loot:{gold:[42,74],items:["Dente di Nessath","Offerte del Tempio","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq48_ss1",name:"Sacerdote del Serpente",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
      {id:"mq48_ss2",name:"Sacerdote del Serpente",emoji:"🐍",hp:55,maxHp:55,atk:13,def:5,xp:43,isBoss:false},
      {id:"mq48_nessath",name:"Serpente Antico Nessath",emoji:"🌟",hp:118,maxHp:118,atk:21,def:9,xp:95,isBoss:true}
    ],
  },{
    id:"mq49", title:"La Caccia Selvaggia", active:true,
    desc:"Il Lord della Caccia Fatata ha dichiarato una caccia nel mondo dei mortali. Le sue prede sono i membri del party stesso.",
    flavor:"«La caccia selvaggia non si interrompe. Se sei una preda, resta preda. A meno che tu non diventi cacciatore.» — Strofa Fatata",
    difficulty:"medio", xpReward:250, goldReward:110,
    steps:[
      {type:"narrative",text:"La foresta notturna esplode di suoni di caccia: corna, abbai di cani fatati, zoccoli spettrali. Avete un'ora prima che vi trovino."},
      {type:"choice",text:"L'unico modo per fermare la caccia è sfidare il Lord della Caccia secondo le leggi fatate.",choices:[
        {label:"🦊 Diventate voi i cacciatori: trovate il Lord prima che vi trovi",xp:23,gold:14,next:2,correct:true},
        {label:"🌲 Nascondete nel bosco e aspettate l'alba",xp:0,gold:0,next:2,correct:false},
        {label:"🔔 Suonate un campanello fatato per invocare tregua",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Cacciatori Fatati** arrivano coi cani e il **Lord della Caccia Selvaggia Keroon** discende dal cielo!",monsters:[
        {id:"mq49_cf1",name:"Cacciatore Fatato",emoji:"🌙",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
        {id:"mq49_cf2",name:"Cacciatore Fatato",emoji:"🌙",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
        {id:"mq49_keroon",name:"Lord della Caccia Keroon",emoji:"🦌",hp:115,maxHp:115,atk:21,def:8,xp:92,isBoss:true}
      ]},
      {type:"loot",text:"Keroon si inchina con rispetto fatato. Avete cacciato il cacciatore. La caccia selvaggia non vi toccherà più.",loot:{gold:[42,74],items:["Corno della Caccia Fatata","Mantello del Cacciatore","Pozione di Grande Cura"]}}
    ],
    enemies:[
      {id:"mq49_cf1",name:"Cacciatore Fatato",emoji:"🌙",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
      {id:"mq49_cf2",name:"Cacciatore Fatato",emoji:"🌙",hp:55,maxHp:55,atk:14,def:5,xp:43,isBoss:false},
      {id:"mq49_keroon",name:"Lord della Caccia Keroon",emoji:"🦌",hp:115,maxHp:115,atk:21,def:8,xp:92,isBoss:true}
    ],
  },{
    id:"mq50", title:"Il Trono di Cenere", active:true,
    desc:"Un ex-re ha scelto di diventare un non-morto di fuoco per governare per sempre. Il suo trono di cenere brilla come un sole nero.",
    flavor:"«Ha regnato da vivo per quarant'anni. Ora regna da morto. E pensa di non fare differenza.» — Ex-Consigliere Orm",
    difficulty:"medio", xpReward:260, goldReward:115,
    steps:[
      {type:"narrative",text:"Il palazzo è cenere e fumo. Le pareti bruciano senza consumarsi e sul trono siede una figura che brucia internamente, occhi come brace."},
      {type:"choice",text:"Il Re delle Ceneri non è malvagio — è solo rifiuta di mollare il potere. Potrebbe essere convinto.",choices:[
        {label:"📜 Mostrate l'atto di successione firmato dal re prima di morire",xp:24,gold:15,next:2,correct:true},
        {label:"💧 Versate acqua benedetta sul trono",xp:0,gold:0,next:2,correct:false},
        {label:"📢 Chiedete al re di lasciare il trono volontariamente",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"combat",text:"I **Guerrieri di Cenere** si alzano dal pavimento e il **Re delle Ceneri Malachar** si erge dal trono in fiamme!",monsters:[
        {id:"mq50_gc1",name:"Guerriero di Cenere",emoji:"🔥",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
        {id:"mq50_gc2",name:"Guerriero di Cenere",emoji:"🔥",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
        {id:"mq50_malach",name:"Re delle Ceneri Malachar",emoji:"♟️",hp:120,maxHp:120,atk:22,def:9,xp:96,isBoss:true}
      ]},
      {type:"loot",text:"Malachar si spegne lentamente, con un sorriso. Il palazzo si raffredda. I tesori di un regno di fuoco sono vostri.",loot:{gold:[44,78],items:["Corona delle Ceneri di Malachar","Brace Eterna","Tesoro del Trono di Cenere"]}}
    ],
    enemies:[
      {id:"mq50_gc1",name:"Guerriero di Cenere",emoji:"🔥",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
      {id:"mq50_gc2",name:"Guerriero di Cenere",emoji:"🔥",hp:58,maxHp:58,atk:13,def:6,xp:45,isBoss:false},
      {id:"mq50_malach",name:"Re delle Ceneri Malachar",emoji:"♟️",hp:120,maxHp:120,atk:22,def:9,xp:96,isBoss:true}
    ],
  },

  // ── DIFFICILE (dq8–dq27) ──────────────────────────────────────────────────
  {
    id:"dq8", title:"La Tana del Drago di Bronzo", active:true,
    desc:"Un drago di bronzo antico custodisce tesori leggendari nelle montagne di Keldrath. Nessuno che ci abbia provato è mai tornato.",
    flavor:"«Ha bruciato tre spedizioni reali. Credo stia collezionando eroi.» — Re Aldric V",
    difficulty:"difficile", xpReward:300, goldReward:140,
    steps:[
      {type:"narrative",text:"Le montagne di Keldrath puzzano di zolfo e metallo fuso. La tana del drago è segnata da ossa e armature fuse nella roccia come decorazioni."},
      {type:"choice",text:"Il drago vi osserva dall'alto della sua pila di tesori. Parla — e sembra aspettare qualcosa prima di attaccare.",choices:[
        {label:"🗡️ Offrite il vostro rispetto e spiegate il vostro scopo",xp:28,gold:18,next:2,correct:true},
        {label:"⚔️ Attaccate prima che respiri fuoco",xp:0,gold:0,next:2,correct:false},
        {label:"💰 Offrite una parte del suo stesso tesoro",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"*«Ho aspettato eroi degni per duecento anni»*, dice il drago. *«Vediamo se siete degni di morire per mano mia.»* Poi ruggisce e la tana si illumina di bronzo ardente."},
      {type:"combat",text:"I **Draghetti di Bronzo** calano dalle pareti e il **Drago di Bronzo Keldrath** apre le ali con un ruggito che scuote la montagna!",monsters:[
        {id:"dq8_db1",name:"Draghetto di Bronzo",emoji:"🐲",hp:85,maxHp:85,atk:18,def:7,xp:70,isBoss:false},
        {id:"dq8_db2",name:"Draghetto di Bronzo",emoji:"🐲",hp:85,maxHp:85,atk:18,def:7,xp:70,isBoss:false},
        {id:"dq8_drkeld",name:"Drago di Bronzo Keldrath",emoji:"🐉",hp:200,maxHp:200,atk:27,def:13,xp:160,isBoss:true}
      ]},
      {type:"loot",text:"Keldrath cade con un ultimo respiro di fuoco bronzeo. I tesori accumulati in duecento anni di caccia riempiono la tana.",loot:{gold:[65,110],items:["Scaglie del Drago di Bronzo","Artiglio di Keldrath","Forziere del Tesoro del Drago","Elisir del Sangue Draconico"]}}
    ],
    enemies:[
      {id:"dq8_db1",name:"Draghetto di Bronzo",emoji:"🐲",hp:85,maxHp:85,atk:18,def:7,xp:70,isBoss:false},
      {id:"dq8_db2",name:"Draghetto di Bronzo",emoji:"🐲",hp:85,maxHp:85,atk:18,def:7,xp:70,isBoss:false},
      {id:"dq8_drkeld",name:"Drago di Bronzo Keldrath",emoji:"🐉",hp:200,maxHp:200,atk:27,def:13,xp:160,isBoss:true}
    ],
  },{
    id:"dq9", title:"Il Lich della Valle Oscura", active:true,
    desc:"Il Lich Morvane regna sulla Valle Oscura da mille anni. Ha costruito un esercito di non-morti e ora punta alla conquista del reame.",
    flavor:"«Non vuole soldi. Non vuole potere. Vuole la vostra anima come trofeo.» — Arcimaga Syl",
    difficulty:"difficile", xpReward:290, goldReward:135,
    steps:[
      {type:"narrative",text:"La Valle Oscura è sempre notte. Il castello del lich si staglia contro un cielo senza stelle e l'aria è fredda come morte."},
      {type:"choice",text:"Il lich è immortale finché esiste il suo filtro dell'anima — un oggetto nascosto nel castello.",choices:[
        {label:"🔍 Cercate il filtro prima di affrontare il lich",xp:28,gold:18,next:2,correct:true},
        {label:"⚔️ Attaccate direttamente il lich",xp:0,gold:0,next:2,correct:false},
        {label:"📜 Cercate la formula per distruggerlo negli archivi",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il filtro è distrutto. Il lich urla dalla sua torre: *«IMPOSSIBILE!»*. Per la prima volta in mille anni, ha paura."},
      {type:"combat",text:"I **Morti Potenziati** sbarrano la sala del trono e il **Lich Morvane** lancia incantesimi di necromante di potenza devastante!",monsters:[
        {id:"dq9_mp1",name:"Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:18,def:8,xp:68,isBoss:false},
        {id:"dq9_mp2",name:"Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:18,def:8,xp:68,isBoss:false},
        {id:"dq9_morvane",name:"Lich Morvane",emoji:"☠️",hp:185,maxHp:185,atk:26,def:12,xp:155,isBoss:true}
      ]},
      {type:"loot",text:"Morvane si dissolve in polvere e silenzio. La Valle Oscura inizia a schiarirsi. Il castello contiene millenni di magia accumulata.",loot:{gold:[60,105],items:["Grimorio di Morvane","Filtro dell'Anima (vuoto)","Bastone del Lich","Elisir dell'Ultimo Respiro"]}}
    ],
    enemies:[
      {id:"dq9_mp1",name:"Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:18,def:8,xp:68,isBoss:false},
      {id:"dq9_mp2",name:"Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:18,def:8,xp:68,isBoss:false},
      {id:"dq9_morvane",name:"Lich Morvane",emoji:"☠️",hp:185,maxHp:185,atk:26,def:12,xp:155,isBoss:true}
    ],
  },{
    id:"dq10", title:"Il Portale del Grande Demonio", active:true,
    desc:"Un culto ha aperto un portale permanente verso l'Abisso. Da lì è già emerso un Grande Demonio che nessun esercito è riuscito a sconfiggere.",
    flavor:"«Non è un demonio qualsiasi. Porta con sé il caos come una malattia.» — Arcangelo Vyn",
    difficulty:"difficile", xpReward:305, goldReward:145,
    steps:[
      {type:"narrative",text:"Il portale brucia nel centro della pianura come una ferita nel cielo. Il Grande Demonio non è fermo — sta costruendo qualcosa di più grande."},
      {type:"choice",text:"Per chiudere il portale dall'interno, qualcuno deve raggiungere il nucleo centrale del portale stesso.",choices:[
        {label:"✨ Create una barriera di luce sacra per avanzare",xp:30,gold:20,next:2,correct:true},
        {label:"⚔️ Caricate il demonio frontalmente",xp:0,gold:0,next:2,correct:false},
        {label:"💣 Usate esplosivi per danneggiare il portale",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il Grande Demonio si accorge di voi. Per la prima volta dall'apertura del portale, smette di costruire e si gira verso di voi con un sorriso di fuoco."},
      {type:"combat",text:"I **Demoni del Portale** volano verso di voi e il **Grande Demonio Azkarath** rugge un benvenuto all'inferno!",monsters:[
        {id:"dq10_dp1",name:"Demone del Portale",emoji:"👹",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
        {id:"dq10_dp2",name:"Demone del Portale",emoji:"👹",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
        {id:"dq10_azk",name:"Grande Demonio Azkarath",emoji:"😈",hp:195,maxHp:195,atk:28,def:13,xp:162,isBoss:true}
      ]},
      {type:"loot",text:"Azkarath viene rispedito nell'Abisso. Il portale si chiude. Rimangono reliquie infernali di grande potenza arcana.",loot:{gold:[68,115],items:["Corno di Azkarath","Frammento del Portale Infernale","Armatura dell'Abisso","Elisir Demoniaco"]}}
    ],
    enemies:[
      {id:"dq10_dp1",name:"Demone del Portale",emoji:"👹",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
      {id:"dq10_dp2",name:"Demone del Portale",emoji:"👹",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
      {id:"dq10_azk",name:"Grande Demonio Azkarath",emoji:"😈",hp:195,maxHp:195,atk:28,def:13,xp:162,isBoss:true}
    ],
  },{
    id:"dq11", title:"La Fortezza della Morte", active:true,
    desc:"Il Signore della Morte governa dalla Fortezza di Ossiria. Ha il potere di resuscitare i caduti sul campo di battaglia come suoi soldati.",
    flavor:"«Ogni esercito che gli si oppone diventa il suo. È la guerra più crudele che esista.» — Stratega Reale Orlen",
    difficulty:"difficile", xpReward:295, goldReward:138,
    steps:[
      {type:"narrative",text:"La Fortezza di Ossiria è costruita con ossa fuse insieme. Le mura sono guardate da ex-eroi riesumati che riconoscete dai ritratti dei musei."},
      {type:"choice",text:"Il Signore della Morte conosce ogni tattica usata nei secoli — le ha viste tutte resuscitate.",choices:[
        {label:"🎲 Usate tattiche completamente improvvisate e imprevedibili",xp:29,gold:19,next:2,correct:true},
        {label:"📖 Usate la tattica classica dei sei eserciti storici",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Attaccate in formazione frontale",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il Signore della Morte fruga nella sua memoria di secoli e non trova il vostro schema. Per la prima volta, è sorpreso."},
      {type:"combat",text:"I **Campioni Non-Morti** avanzano con armature antiche e il **Signore della Morte Mordrex** alza la sua falce di ossa!",monsters:[
        {id:"dq11_cnd1",name:"Campione Non-Morto",emoji:"⚔️",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
        {id:"dq11_cnd2",name:"Campione Non-Morto",emoji:"⚔️",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
        {id:"dq11_mordrex",name:"Signore della Morte Mordrex",emoji:"💀",hp:190,maxHp:190,atk:27,def:13,xp:158,isBoss:true}
      ]},
      {type:"loot",text:"Mordrex cade per la prima volta in mille anni. La fortezza si sgretola. Il tesoro di secoli di conquiste è sepolto nelle fondamenta.",loot:{gold:[62,108],items:["Falce di Mordrex","Corona delle Ossa","Pietra della Morte","Pozione della Resurrezione"]}}
    ],
    enemies:[
      {id:"dq11_cnd1",name:"Campione Non-Morto",emoji:"⚔️",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
      {id:"dq11_cnd2",name:"Campione Non-Morto",emoji:"⚔️",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
      {id:"dq11_mordrex",name:"Signore della Morte Mordrex",emoji:"💀",hp:190,maxHp:190,atk:27,def:13,xp:158,isBoss:true}
    ],
  },{
    id:"dq12", title:"Il Titano della Tempesta", active:true,
    desc:"Un titano della tempesta si è svegliato e cammina verso la costa. Ogni suo passo crea tornado e ogni suo respiro un uragano.",
    flavor:"«È alto come una torre. E arrabbiato come solo una divinità dimenticata può essere.» — Ammiraglio della Flotta Gryn",
    difficulty:"difficile", xpReward:315, goldReward:150,
    steps:[
      {type:"narrative",text:"Il cielo sopra il titano è permanentemente in tempesta. Fulmini cadono ad ogni suo passo e le navi nel porto si spezzano per le onde generate."},
      {type:"choice",text:"Il titano è vulnerabile ai fulmini — ma non li teme. Li assorbe. Serve qualcosa di diverso.",choices:[
        {label:"🌍 Usate la terra contro di lui — ancorare i suoi piedi",xp:30,gold:20,next:2,correct:true},
        {label:"⚡ Attirate fulmini verso di lui",xp:0,gold:0,next:2,correct:false},
        {label:"🌊 Spingetelo verso il mare",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il titano inciampa mentre le radici di terra lo bloccano. Per un istante — solo un istante — è vulnerabile. È il momento."},
      {type:"combat",text:"Gli **Elementali della Tempesta** proteggono il titano e il **Titano della Tempesta Zepheron** porta i fulmini su di voi!",monsters:[
        {id:"dq12_et1",name:"Elementale della Tempesta",emoji:"⛈️",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
        {id:"dq12_et2",name:"Elementale della Tempesta",emoji:"⛈️",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
        {id:"dq12_zepher",name:"Titano della Tempesta Zepheron",emoji:"🌩️",hp:210,maxHp:210,atk:29,def:14,xp:168,isBoss:true}
      ]},
      {type:"loot",text:"Il titano cade e la tempesta si placa. Dal suo corpo smaterializzato rimangono cristalli di energia pura e l'armatura del suo nucleo.",loot:{gold:[72,120],items:["Cristallo della Tempesta","Nucleo del Titano","Armatura del Fulmine","Elisir dell'Uragano"]}}
    ],
    enemies:[
      {id:"dq12_et1",name:"Elementale della Tempesta",emoji:"⛈️",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
      {id:"dq12_et2",name:"Elementale della Tempesta",emoji:"⛈️",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
      {id:"dq12_zepher",name:"Titano della Tempesta Zepheron",emoji:"🌩️",hp:210,maxHp:210,atk:29,def:14,xp:168,isBoss:true}
    ],
  },{
    id:"dq13", title:"L'Hydra delle Profondità", active:true,
    desc:"Un'hydra a nove teste vive nelle caverne sotterranee. Ogni testa tagliata ne ricresce due. L'unico modo è distruggerle tutte contemporaneamente.",
    flavor:"«L'ultimo gruppo ha tagliato tre teste. Ora ne ha quindici.» — Esploratore sopravvissuto Drek",
    difficulty:"difficile", xpReward:320, goldReward:155,
    steps:[
      {type:"narrative",text:"Le caverne dell'Hydra sono allagate e buie. Il suono di otto, nove, venti respiri simultanei riempie il tunnel."},
      {type:"choice",text:"L'hydra rigenerera ogni testa tagliata a meno che non si cauterizzi la ferita immediatamente.",choices:[
        {label:"🔥 Portate torce ad alta temperatura per cauterizzare",xp:30,gold:20,next:2,correct:true},
        {label:"⚔️ Tagliate più teste possibile il più veloce possibile",xp:0,gold:0,next:2,correct:false},
        {label:"🌿 Usate veleno per fermare la rigenerazione",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Ogni testa tagliata viene cauterizzata immediatamente. L'hydra urla con tutte le bocche rimaste. Il piano funziona."},
      {type:"combat",text:"Le **Salamandre Abissali** difendono la loro signora e l'**Hydra delle Profondità** attacca con nove teste contemporaneamente!",monsters:[
        {id:"dq13_sal1",name:"Salamandra Abissale",emoji:"🦎",hp:85,maxHp:85,atk:18,def:8,xp:72,isBoss:false},
        {id:"dq13_sal2",name:"Salamandra Abissale",emoji:"🦎",hp:85,maxHp:85,atk:18,def:8,xp:72,isBoss:false},
        {id:"dq13_hydra",name:"Hydra delle Profondità",emoji:"🐉",hp:220,maxHp:220,atk:29,def:13,xp:172,isBoss:true}
      ]},
      {type:"loot",text:"Le ultime teste non si rigenerano. L'hydra si immobilizza. Il veleno e il sangue dell'hydra sono materiali alchemici rarissimi.",loot:{gold:[75,125],items:["Sangue di Hydra","Dente dell'Hydra","Veleno delle Profondità","Elisir dell'Idra"]}}
    ],
    enemies:[
      {id:"dq13_sal1",name:"Salamandra Abissale",emoji:"🦎",hp:85,maxHp:85,atk:18,def:8,xp:72,isBoss:false},
      {id:"dq13_sal2",name:"Salamandra Abissale",emoji:"🦎",hp:85,maxHp:85,atk:18,def:8,xp:72,isBoss:false},
      {id:"dq13_hydra",name:"Hydra delle Profondità",emoji:"🐉",hp:220,maxHp:220,atk:29,def:13,xp:172,isBoss:true}
    ],
  },{
    id:"dq14", title:"Il Signore dei Mannari", active:true,
    desc:"Il Signore dei Mannari coordina branchi in tutta la regione. Alla luna piena può trasformare intere città in non-morti mannari.",
    flavor:"«Non morde per mangiare. Morde per creare un esercito.» — Cacciatore di Mannari Sela",
    difficulty:"difficile", xpReward:310, goldReward:148,
    steps:[
      {type:"narrative",text:"Il bosco della luna piena è pericoloso. Gli ululati si moltiplicano e si organizzano — troppo coordinati per essere animali."},
      {type:"choice",text:"Il Signore dei Mannari può essere colpito solo con argento. Avete abbastanza argento?",choices:[
        {label:"🥈 Fundete monete d'argento in punte di freccia",xp:29,gold:19,next:2,correct:true},
        {label:"⚔️ Usate le armi normali sperando nel meglio",xp:0,gold:0,next:2,correct:false},
        {label:"🌿 Cercate aconito per avvelenare le armi",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Alla luna piena il Signore si trasforma completamente — tre metri di muscoli e zanne, con occhi dorati e intelligenza fredda."},
      {type:"combat",text:"I **Mannari** attaccano in branco e il **Signore dei Mannari Volkaan** ruggisce ordinando l'attacco totale!",monsters:[
        {id:"dq14_man1",name:"Mannaro",emoji:"🐺",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
        {id:"dq14_man2",name:"Mannaro",emoji:"🐺",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
        {id:"dq14_volkaan",name:"Signore dei Mannari Volkaan",emoji:"🌕",hp:195,maxHp:195,atk:28,def:12,xp:162,isBoss:true}
    ]},
      {type:"loot",text:"Volkaan cade sotto le frecce d'argento. La luna piena passa senza nuove trasformazioni. I villaggi sono salvi.",loot:{gold:[70,118],items:["Peluria di Volkaan","Dente del Signore dei Mannari","Amuleto Argenteo","Elisir del Lupo"]}}
    ],
    enemies:[
      {id:"dq14_man1",name:"Mannaro",emoji:"🐺",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
      {id:"dq14_man2",name:"Mannaro",emoji:"🐺",hp:88,maxHp:88,atk:20,def:9,xp:74,isBoss:false},
      {id:"dq14_volkaan",name:"Signore dei Mannari Volkaan",emoji:"🌕",hp:195,maxHp:195,atk:28,def:12,xp:162,isBoss:true}
    ],
  },{
    id:"dq15", title:"La Regina degli Insetti Oscuri", active:true,
    desc:"La Regina degli Insetti Oscuri si è insediata nelle caverne a sud. Il suo veleno può mutare qualsiasi creatura in un insetto in poche ore.",
    flavor:"«L'ha incontrata un esploratore. Poi ha smesso di essere un esploratore. Ora è una cosa con sei zampe.» — Dottoressa Lyss",
    difficulty:"difficile", xpReward:310, goldReward:148,
    steps:[
      {type:"narrative",text:"Le caverne meridionali puzzano di chitina e veleno dolciastro. Le pareti sono ricoperte di bozzoli enormi — alcune si muovono ancora."},
      {type:"choice",text:"La Regina non attacca subito. Osserva. Valuta. Sceglie quale trasformazione applicare a ciascuno.",choices:[
        {label:"🧤 Proteggetevi con bardature anti-veleno",xp:29,gold:19,next:2,correct:true},
        {label:"🔥 Bruciate i bozzoli per distruggerla",xp:0,gold:0,next:2,correct:false},
        {label:"☠️ Usate veleno vostro per contrastare il suo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"La Regina decide. I suoi campioni avanzano e lei stessa scende dal suo trono di chitina, pungiglione dorato pronto."},
      {type:"combat",text:"I **Campioni Insetto** caricano con mandibole affilate e la **Regina degli Insetti Oscuri** inietta veleno nell'aria!",monsters:[
        {id:"dq15_ci1",name:"Campione Insetto",emoji:"🦗",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
        {id:"dq15_ci2",name:"Campione Insetto",emoji:"🦗",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
        {id:"dq15_reginaoscura",name:"Regina degli Insetti Oscuri",emoji:"👑",hp:200,maxHp:200,atk:27,def:13,xp:165,isBoss:true}
      ]},
      {type:"loot",text:"La Regina cade. I bozzoli si aprono e le creature trasformate recuperano la forma originale lentamente. Il veleno è un materiale alchemico rarissimo.",loot:{gold:[70,118],items:["Veleno della Regina Oscura","Chitina della Regina","Pungiglione d'Oro","Antidoto dell'Ultimo Istante"]}}
    ],
    enemies:[
      {id:"dq15_ci1",name:"Campione Insetto",emoji:"🦗",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
      {id:"dq15_ci2",name:"Campione Insetto",emoji:"🦗",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
      {id:"dq15_reginaoscura",name:"Regina degli Insetti Oscuri",emoji:"👑",hp:200,maxHp:200,atk:27,def:13,xp:165,isBoss:true}
    ],
  },{
    id:"dq16", title:"Il Necromante Supremo", active:true,
    desc:"Il Necromante Supremo Nekrath ha conquistato la sua immortalità attraverso secoli di esperimenti. Ora ha abbastanza potere per risvegliare tutti i morti del continente.",
    flavor:"«Non è il primo necromante che incontro. Ma è l'unico che ho visto ridere guardando un cimitero.» — Paladino Aldric",
    difficulty:"difficile", xpReward:300, goldReward:142,
    steps:[
      {type:"narrative",text:"La torre di Nekrath è circondata da un cimitero che si estende per chilometri. Tutte le lapidi sono vuote — i loro occupanti camminano già."},
      {type:"choice",text:"Il potere di Nekrath dipende dai morti che controlla. Meno ne controlla, più è vulnerabile.",choices:[
        {label:"✝️ Usate rune di purificazione per liberare le anime",xp:29,gold:19,next:2,correct:true},
        {label:"⚔️ Combattete ogni non-morto sul campo",xp:0,gold:0,next:2,correct:false},
        {label:"📜 Cercate il suo tomo principale per interrompere il legame",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Nekrath sente le anime sfuggirgli. Urla maledizioni e scende dalla torre — avvolta in una nuvola di energia necrotica."},
      {type:"combat",text:"I **Non-Morti Potenziati** avanzano come scudi e il **Necromante Supremo Nekrath** lancia nubi di morte pura!",monsters:[
        {id:"dq16_ndp1",name:"Non-Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
        {id:"dq16_ndp2",name:"Non-Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
        {id:"dq16_nekrath",name:"Necromante Supremo Nekrath",emoji:"☠️",hp:185,maxHp:185,atk:26,def:11,xp:158,isBoss:true}
      ]},
      {type:"loot",text:"Nekrath cade e la nuvola di morte si dissolve. La torre contiene secoli di ricerche proibite e i tesori delle sue vittime.",loot:{gold:[65,112],items:["Tomo Supremo della Necromante","Pietra del Legame Morti","Bacchetta della Morte","Elisir della Non-Morte"]}}
    ],
    enemies:[
      {id:"dq16_ndp1",name:"Non-Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
      {id:"dq16_ndp2",name:"Non-Morto Potenziato",emoji:"💀",hp:82,maxHp:82,atk:19,def:8,xp:70,isBoss:false},
      {id:"dq16_nekrath",name:"Necromante Supremo Nekrath",emoji:"☠️",hp:185,maxHp:185,atk:26,def:11,xp:158,isBoss:true}
    ],
  },{
    id:"dq17", title:"Il Costrutto del Giudizio", active:true,
    desc:"Un antico costrutto meccanico si è riattivato e giudica ogni essere vivente che incontra. Chi giudica colpevole viene eliminato istantaneamente.",
    flavor:"«Non puoi negoziare con qualcosa che non conosce il perdono.» — Filosofo Rael",
    difficulty:"difficile", xpReward:315, goldReward:150,
    steps:[
      {type:"narrative",text:"Il Costrutto del Giudizio cammina tra le città come un dio meccanico. Ogni persona che tocca viene giudicata in un secondo — e non tutte sopravvivono al giudizio."},
      {type:"choice",text:"Il costrutto valuta secondo codici etici scritti mille anni fa. Se mostrate le vostre azioni, potrebbe valutarvi diversamente.",choices:[
        {label:"⚖️ Presentatevi al giudizio con trasparenza totale",xp:30,gold:20,next:2,correct:true},
        {label:"🔓 Cercate di hackerare il suo sistema di valori",xp:0,gold:0,next:2,correct:false},
        {label:"⚔️ Attaccate prima che possa giudicarvi",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il Costrutto analizza la vostra storia e decide: *«Pericolosi. Ma non colpevoli.»* Poi aggiunge: *«Tuttavia, il test finale è necessario.»*"},
      {type:"combat",text:"I **Guardiani Meccanici** del Costrutto si attivano e il **Costrutto del Giudizio** libera l'arma definitiva!",monsters:[
        {id:"dq17_gm1",name:"Guardiano Meccanico",emoji:"🤖",hp:88,maxHp:88,atk:18,def:9,xp:72,isBoss:false},
        {id:"dq17_gm2",name:"Guardiano Meccanico",emoji:"🤖",hp:88,maxHp:88,atk:18,def:9,xp:72,isBoss:false},
        {id:"dq17_costr",name:"Costrutto del Giudizio",emoji:"⚖️",hp:210,maxHp:210,atk:28,def:15,xp:168,isBoss:true}
      ]},
      {type:"loot",text:"Il Costrutto si disattiva con un ronzio finale. All'interno ci sono componenti meccanici di tecnologia senza eguali.",loot:{gold:[72,120],items:["Nucleo del Costrutto","Componente Meccanico Antico","Lente del Giudizio","Cristallo Logico"]}}
    ],
    enemies:[
      {id:"dq17_gm1",name:"Guardiano Meccanico",emoji:"🤖",hp:88,maxHp:88,atk:18,def:9,xp:72,isBoss:false},
      {id:"dq17_gm2",name:"Guardiano Meccanico",emoji:"🤖",hp:88,maxHp:88,atk:18,def:9,xp:72,isBoss:false},
      {id:"dq17_costr",name:"Costrutto del Giudizio",emoji:"⚖️",hp:210,maxHp:210,atk:28,def:15,xp:168,isBoss:true}
    ],
  },{
    id:"dq18", title:"La Bestia del Baratro", active:true,
    desc:"Dal baratro senza fondo a est è emersa una bestia primordiale. Non appartiene a nessun mondo — è qualcosa che esisteva prima del mondo stesso.",
    flavor:"«Non ha forma fissa. Non ha nome. Ha solo fame.» — Studioso dell'Occulto Xan",
    difficulty:"difficile", xpReward:325, goldReward:158,
    steps:[
      {type:"narrative",text:"Il baratro emana un odore di niente — letteralmente assenza. La bestia cambia forma mentre la osservate: ora tentacoli, ora artigli, ora qualcosa senza nome."},
      {type:"choice",text:"La bestia non ha punti deboli standard — ma potrebbe avere memoria di qualcosa che teme da prima del tempo.",choices:[
        {label:"🌟 Usate luce primordiale — torce di stelle cadute",xp:31,gold:21,next:2,correct:true},
        {label:"⚔️ Attaccate la sua forma attuale",xp:0,gold:0,next:2,correct:false},
        {label:"🌑 Tentate di inviare la bestia nel baratro di nuovo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"La luce primordiale ferisce la bestia — o almeno qualcosa in lei reagisce. Per la prima volta emette un suono: qualcosa tra il dolore e la sorpresa."},
      {type:"combat",text:"Le **Aberrazioni Abissali** si staccano dal corpo della bestia e la **Bestia Primordiale del Baratro** si scaglia con tutta la sua fame!",monsters:[
        {id:"dq18_ab1",name:"Aberrazione Abissale",emoji:"👾",hp:90,maxHp:90,atk:20,def:9,xp:75,isBoss:false},
        {id:"dq18_ab2",name:"Aberrazione Abissale",emoji:"👾",hp:90,maxHp:90,atk:20,def:9,xp:75,isBoss:false},
        {id:"dq18_bestia",name:"Bestia Primordiale del Baratro",emoji:"🕳️",hp:225,maxHp:225,atk:30,def:14,xp:175,isBoss:true}
      ]},
      {type:"loot",text:"La bestia svanisce nel niente da cui è venuta. Rimangono residui della sua forma — materiali che non esistono in nessun catalogo alchemico.",loot:{gold:[78,128],items:["Residuo Abissale","Frammento del Niente","Pietra del Baratro","Elisir del Vuoto"]}}
    ],
    enemies:[
      {id:"dq18_ab1",name:"Aberrazione Abissale",emoji:"👾",hp:90,maxHp:90,atk:20,def:9,xp:75,isBoss:false},
      {id:"dq18_ab2",name:"Aberrazione Abissale",emoji:"👾",hp:90,maxHp:90,atk:20,def:9,xp:75,isBoss:false},
      {id:"dq18_bestia",name:"Bestia Primordiale del Baratro",emoji:"🕳️",hp:225,maxHp:225,atk:30,def:14,xp:175,isBoss:true}
    ],
  },{
    id:"dq19", title:"Il Drago del Ghiaccio Eterno", active:true,
    desc:"Il Drago del Ghiaccio Eterno ha congelato metà del continente del nord. Le sue scaglie sono invulnerabili a qualsiasi arma non riscaldata al fuoco draconico.",
    flavor:"«Ha dormito diecimila anni. Vi auguro buona fortuna — io me ne sono già andato.» — Eroe Anonimo",
    difficulty:"difficile", xpReward:320, goldReward:155,
    steps:[
      {type:"narrative",text:"Il nord è un deserto di ghiaccio. Il drago non vola — cammina, lento e certo, congela ogni cosa che tocca con il suo respiro."},
      {type:"choice",text:"Le armi normali rimbalzano sulle sue scaglie di ghiaccio. Serve fuoco — ma non fuoco qualsiasi.",choices:[
        {label:"🔥 Usate le scaglie del Drago di Bronzo (se le avete) per forgiare armi",xp:30,gold:20,next:2,correct:true},
        {label:"🌋 Cercate lava vulcanica come alternativa",xp:0,gold:0,next:2,correct:false},
        {label:"❄️ Tentate di combatterlo con il suo stesso ghiaccio",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Le armi infuocate scalfiscono le scaglie. Il drago abbassa lo sguardo su di voi con qualcosa che assomiglia a rispetto — e rabbia."},
      {type:"combat",text:"I **Guardiani del Gelo** emergono dal ghiaccio e il **Drago del Ghiaccio Eterno Glacyon** soffia una tempesta di cristalli!",monsters:[
        {id:"dq19_gg1",name:"Guardiano del Gelo",emoji:"❄️",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
        {id:"dq19_gg2",name:"Guardiano del Gelo",emoji:"❄️",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
        {id:"dq19_glacyon",name:"Drago del Ghiaccio Eterno Glacyon",emoji:"🐉",hp:220,maxHp:220,atk:29,def:15,xp:172,isBoss:true}
      ]},
      {type:"loot",text:"Glacyon si frantuma in mille cristalli. Il ghiaccio eterno del nord inizia lentamente a sciogliersi. Le sue scaglie valgono una fortuna.",loot:{gold:[75,125],items:["Scaglie di Glacyon","Cristallo del Ghiaccio Eterno","Artiglio del Ghiaccio","Elisir del Gelo Primordiale"]}}
    ],
    enemies:[
      {id:"dq19_gg1",name:"Guardiano del Gelo",emoji:"❄️",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
      {id:"dq19_gg2",name:"Guardiano del Gelo",emoji:"❄️",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
      {id:"dq19_glacyon",name:"Drago del Ghiaccio Eterno Glacyon",emoji:"🐉",hp:220,maxHp:220,atk:29,def:15,xp:172,isBoss:true}
    ],
  },{
    id:"dq20", title:"Il Vampiro Lord di Mirkwood", active:true,
    desc:"Il Lord Vampiro Valthar governa la foresta di Mirkwood da cinquecento anni. Ha trasformato la metà degli abitanti in non-morti succhiasangue.",
    flavor:"«Beve dalla nostra paura prima ancora che dal nostro sangue.» — Superstite di Mirkwood",
    difficulty:"difficile", xpReward:315, goldReward:150,
    steps:[
      {type:"narrative",text:"Mirkwood è morta. Gli alberi sono secchi, il suolo è cenere e nebbia e le luci nel castello in cima alla collina bruciano tutta la notte."},
      {type:"choice",text:"I vampiri non possono entrare senza invito, ma il castello di Valthar è casa sua. Va attaccato all'alba — l'unico momento di vulnerabilità.",choices:[
        {label:"☀️ Aspettate l'alba e attaccate al primo raggio",xp:30,gold:20,next:2,correct:true},
        {label:"🌙 Attaccate di notte quando siete più difficili da vedere",xp:0,gold:0,next:2,correct:false},
        {label:"🧄 Usate aglio e argento per forare le difese",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"All'alba il castello geme. Valthar è nel suo punto più debole — ma non è indifeso."},
      {type:"combat",text:"I **Vampiri** sciamano dal castello e il **Lord Vampiro Valthar** appare avvolto in una nube di pipistrelli!",monsters:[
        {id:"dq20_vamp1",name:"Vampiro",emoji:"🧛",hp:85,maxHp:85,atk:20,def:9,xp:72,isBoss:false},
        {id:"dq20_vamp2",name:"Vampiro",emoji:"🧛",hp:85,maxHp:85,atk:20,def:9,xp:72,isBoss:false},
        {id:"dq20_valthar",name:"Lord Vampiro Valthar",emoji:"🩸",hp:200,maxHp:200,atk:27,def:13,xp:165,isBoss:true}
      ]},
      {type:"loot",text:"Valthar si dissolve in cenere all'alba. Mirkwood inizia a rivivere. Nel castello trovate cinque secoli di tesori accumulati.",loot:{gold:[72,120],items:["Mantello di Valthar","Zanna del Lord Vampiro","Sangue Raffinato","Elisir del Non-Morto"]}}
    ],
    enemies:[
      {id:"dq20_vamp1",name:"Vampiro",emoji:"🧛",hp:85,maxHp:85,atk:20,def:9,xp:72,isBoss:false},
      {id:"dq20_vamp2",name:"Vampiro",emoji:"🧛",hp:85,maxHp:85,atk:20,def:9,xp:72,isBoss:false},
      {id:"dq20_valthar",name:"Lord Vampiro Valthar",emoji:"🩸",hp:200,maxHp:200,atk:27,def:13,xp:165,isBoss:true}
    ],
  },{
    id:"dq21", title:"La Chimera del Deserto Cremisi", active:true,
    desc:"La Chimera del Deserto Cremisi — leone, capra e serpente in un solo corpo — devasta le carovane e i villaggi del deserto rosso.",
    flavor:"«Tre teste, tre modi di uccidere e un solo stomaco sempre affamato.» — Cacciatore del Deserto Kalem",
    difficulty:"difficile", xpReward:320, goldReward:155,
    steps:[
      {type:"narrative",text:"Le dune del Deserto Cremisi sono segnate dalle impronte enorme della chimera. Ogni traccia è accompagnata da ossa — di animali e non."},
      {type:"choice",text:"La chimera ha tre teste con comportamenti diversi. Il leone attacca frontalmente, la capra usa le corna di lato, il serpente attacca da dietro.",choices:[
        {label:"🔺 Dividete il gruppo per affrontare le tre teste contemporaneamente",xp:30,gold:20,next:2,correct:true},
        {label:"⚔️ Attaccate la testa principale — quella del leone",xp:0,gold:0,next:2,correct:false},
        {label:"🌿 Usate veleno per bloccare le teste",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il grifone guardiano della chimera attacca prima che possiate avvicinarvi. Dietro di lui, la chimera ruggisce con tre bocche."},
      {type:"combat",text:"Il **Grifone Guardiano** si lancia in picchiata e la **Chimera del Deserto Cremisi** attacca con tre teste in sequenza!",monsters:[
        {id:"dq21_grif",name:"Grifone Guardiano",emoji:"🦁",hp:95,maxHp:95,atk:21,def:10,xp:78,isBoss:false},
        {id:"dq21_chim",name:"Chimera del Deserto Cremisi",emoji:"🐉",hp:215,maxHp:215,atk:29,def:14,xp:170,isBoss:true}
      ]},
      {type:"loot",text:"La chimera cade e il deserto torna percorribile. Dai tre corpi separati della chimera si estraggono materiali unici.",loot:{gold:[75,125],items:["Testa Leone della Chimera","Veleno del Serpente Chimerico","Corno di Capra Incantato","Elisir della Chimera"]}}
    ],
    enemies:[
      {id:"dq21_grif",name:"Grifone Guardiano",emoji:"🦁",hp:95,maxHp:95,atk:21,def:10,xp:78,isBoss:false},
      {id:"dq21_chim",name:"Chimera del Deserto Cremisi",emoji:"🐉",hp:215,maxHp:215,atk:29,def:14,xp:170,isBoss:true}
    ],
  },{
    id:"dq22", title:"Il Guardiano dell'Abisso Infinito", active:true,
    desc:"L'Abisso Infinito si è aperto sotto la città. Il suo guardiano — un'entità che esiste da prima del tempo — filtra cosa può uscire dall'Abisso.",
    flavor:"«Il guardiano non è il nemico. È la serratura. Ma la serratura si è rotta.» — Arcimago Elys",
    difficulty:"difficile", xpReward:330, goldReward:160,
    steps:[
      {type:"narrative",text:"L'Abisso Infinito è un buco nel mondo. Dal basso non arriva luce, non arriva suono — solo sensazione di qualcosa di enorme che aspetta."},
      {type:"choice",text:"Il guardiano è rotto — ma non malvagio. Se lo riparate invece di distruggerlo, l'Abisso si chiuderà.",choices:[
        {label:"✨ Offrite la vostra energia vitale per ripararlo",xp:31,gold:21,next:2,correct:true},
        {label:"⚔️ Distruggete il guardiano e sperare che l'abisso si chiuda",xp:0,gold:0,next:2,correct:false},
        {label:"🌑 Entrate nell'abisso per affrontare ciò che viene",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il guardiano rotto non capisce i vostri gesti — la sua mente è troppo frammentata. Si difende attaccando."},
      {type:"combat",text:"Gli **Orrori Abissali** emergono dall'Abisso e il **Guardiano dell'Abisso Infinito** combatte per istinto rotto!",monsters:[
        {id:"dq22_oa1",name:"Orrore Abissale",emoji:"👾",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
        {id:"dq22_oa2",name:"Orrore Abissale",emoji:"👾",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
        {id:"dq22_guardab",name:"Guardiano dell'Abisso Infinito",emoji:"🕳️",hp:230,maxHp:230,atk:30,def:15,xp:178,isBoss:true}
      ]},
      {type:"loot",text:"Il guardiano si ferma. L'Abisso si chiude. Rimangono frammenti del guardiano stesso — materiale che non appartiene a questo mondo.",loot:{gold:[80,132],items:["Frammento del Guardiano","Occhio dell'Abisso","Cristallo dell'Infinito","Essenza del Guardiano"]}}
    ],
    enemies:[
      {id:"dq22_oa1",name:"Orrore Abissale",emoji:"👾",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
      {id:"dq22_oa2",name:"Orrore Abissale",emoji:"👾",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
      {id:"dq22_guardab",name:"Guardiano dell'Abisso Infinito",emoji:"🕳️",hp:230,maxHp:230,atk:30,def:15,xp:178,isBoss:true}
    ],
  },{
    id:"dq23", title:"Il Dio Dimenticato del Fango", active:true,
    desc:"Un culto ha risvegliato un dio dimenticato del fango e della terra. L'avatar che lo rappresenta minaccia di inondare l'intera valle.",
    flavor:"«Non è un dio che si prega. È un dio che seppellisce. Tutto.» — Vecchio dei Villaggi",
    difficulty:"difficile", xpReward:325, goldReward:158,
    steps:[
      {type:"narrative",text:"La valle è già mezza sepolta. Il fango sale di un metro ogni ora e il canto del culto si sente da trenta chilometri di distanza."},
      {type:"choice",text:"L'avatar del Dio del Fango può essere indebolito solo rompendo il cerchio di cultisti che lo alimenta con i loro canti.",choices:[
        {label:"🎵 Interrompete il canto con dissonanza musicale",xp:31,gold:21,next:2,correct:true},
        {label:"🔥 Bruciate il cerchio di cultisti",xp:0,gold:0,next:2,correct:false},
        {label:"💧 Cercate di prosciugare il fango",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il canto si interrompe. L'avatar del fango vacilla — più piccolo, più vulnerabile. Ma ancora enorme e furioso."},
      {type:"combat",text:"I **Cultisti Fanatici** contrattaccano e l'**Avatar del Dio del Fango Malagor** si solleva dalla terra!",monsters:[
        {id:"dq23_cf1",name:"Cultista Fanatico",emoji:"🧎",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
        {id:"dq23_cf2",name:"Cultista Fanatico",emoji:"🧎",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
        {id:"dq23_avatarmala",name:"Avatar del Dio del Fango",emoji:"🌊",hp:225,maxHp:225,atk:29,def:15,xp:175,isBoss:true}
      ]},
      {type:"loot",text:"Il fango si ritira. La valle si libera. Dal corpo dell'avatar rimangono minerali creati da pressione divina — straordinariamente rari.",loot:{gold:[78,128],items:["Minerale Divino del Fango","Pietra del Dio Dimenticato","Reliquia del Culto","Elisir della Terra"]}}
    ],
    enemies:[
      {id:"dq23_cf1",name:"Cultista Fanatico",emoji:"🧎",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
      {id:"dq23_cf2",name:"Cultista Fanatico",emoji:"🧎",hp:85,maxHp:85,atk:19,def:8,xp:72,isBoss:false},
      {id:"dq23_avatarmala",name:"Avatar del Dio del Fango",emoji:"🌊",hp:225,maxHp:225,atk:29,def:15,xp:175,isBoss:true}
    ],
  },{
    id:"dq24", title:"L'Avatar del Vuoto", active:true,
    desc:"L'Avatar del Vuoto consuma tutto ciò che tocca — cancella dalla realtà. Non lascia macerie. Non lascia niente.",
    flavor:"«Ho visto sparire un castello. Pietra per pietra, poi tutto insieme. Come se non fosse mai esistito.» — Unico testimone",
    difficulty:"difficile", xpReward:340, goldReward:165,
    steps:[
      {type:"narrative",text:"Il vuoto si avvicina come un'ombra che consuma la luce. Dove passa rimane solo spazio bianco — non nero, non grigio, bianco assoluto."},
      {type:"choice",text:"L'Avatar del Vuoto non può essere colpito con nulla di fisico — tutto ciò che lo tocca viene annullato.",choices:[
        {label:"🌟 Usate luce concentrata — l'opposto del vuoto",xp:32,gold:22,next:2,correct:true},
        {label:"⚔️ Attaccate con le vostre armi migliori",xp:0,gold:0,next:2,correct:false},
        {label:"🌑 Diventate il vuoto per combatterlo",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"La luce concentrata danneggia l'avatar — lo fa urlare in un suono che non dovrebbe esistere. Continua ad avanzare."},
      {type:"combat",text:"I **Servitori del Vuoto** cancellano ciò che toccano e l'**Avatar del Vuoto** apre la sua bocca senza fine!",monsters:[
        {id:"dq24_sv1",name:"Servitore del Vuoto",emoji:"⬜",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
        {id:"dq24_sv2",name:"Servitore del Vuoto",emoji:"⬜",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
        {id:"dq24_avatarv",name:"Avatar del Vuoto",emoji:"🕳️",hp:235,maxHp:235,atk:31,def:15,xp:182,isBoss:true}
      ]},
      {type:"loot",text:"L'Avatar collassa su se stesso e scompare. Rimane solo un cristallo — l'ultimo frammento di realtà che non è riuscito a consumare.",loot:{gold:[82,135],items:["Cristallo del Vuoto","Frammento della Realtà","Essenza del Niente","Pietra Anti-Vuoto"]}}
    ],
    enemies:[
      {id:"dq24_sv1",name:"Servitore del Vuoto",emoji:"⬜",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
      {id:"dq24_sv2",name:"Servitore del Vuoto",emoji:"⬜",hp:92,maxHp:92,atk:21,def:10,xp:76,isBoss:false},
      {id:"dq24_avatarv",name:"Avatar del Vuoto",emoji:"🕳️",hp:235,maxHp:235,atk:31,def:15,xp:182,isBoss:true}
    ],
  },{
    id:"dq25", title:"La Sposa del Chaos", active:true,
    desc:"La Sposa del Chaos — un'entità di pura entropia — ha scelto questo reame per il suo matrimonio con la distruzione. La cerimonia inizia a mezzanotte.",
    flavor:"«Non la si può fermare con la forza. La forza è il suo regalo di nozze preferito.» — Oracolo Nyn",
    difficulty:"difficile", xpReward:325, goldReward:158,
    steps:[
      {type:"narrative",text:"Il cielo sul reame si divide in colori che non esistono. La Sposa del Chaos danza tra i mortali, e dove danza la realtà si incrina."},
      {type:"choice",text:"La cerimonia richiede ordine per essere interrotta — paradossalmente, il chaos non può completarsi se qualcosa introduce ordine assoluto.",choices:[
        {label:"🔢 Create un pattern matematico perfetto nel luogo della cerimonia",xp:31,gold:21,next:2,correct:true},
        {label:"⚔️ Attaccate la sposa durante la danza",xp:0,gold:0,next:2,correct:false},
        {label:"🌪️ Abbracciate il chaos per combatterla",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il pattern interrompe la cerimonia. La Sposa del Chaos si ferma — e per la prima volta sembra arrabbiata. *«Avete rovinate le mie nozze.»*"},
      {type:"combat",text:"I **Demoni del Chaos** esplodono da ogni direzione e la **Sposa del Chaos** scatena l'entropia pura!",monsters:[
        {id:"dq25_dc1",name:"Demone del Chaos",emoji:"🌀",hp:90,maxHp:90,atk:20,def:9,xp:74,isBoss:false},
        {id:"dq25_dc2",name:"Demone del Chaos",emoji:"🌀",hp:90,maxHp:90,atk:20,def:9,xp:74,isBoss:false},
        {id:"dq25_sposa",name:"Sposa del Chaos",emoji:"💜",hp:210,maxHp:210,atk:29,def:13,xp:168,isBoss:true}
      ]},
      {type:"loot",text:"La cerimonia è interrotta. La Sposa del Chaos ride mentre svanisce — *«La prossima volta»* promette. Il reame respira di nuovo.",loot:{gold:[78,128],items:["Velo della Sposa del Chaos","Cristallo dell'Entropia","Frammento del Caos","Elisir del Caos Controllato"]}}
    ],
    enemies:[
      {id:"dq25_dc1",name:"Demone del Chaos",emoji:"🌀",hp:90,maxHp:90,atk:20,def:9,xp:74,isBoss:false},
      {id:"dq25_dc2",name:"Demone del Chaos",emoji:"🌀",hp:90,maxHp:90,atk:20,def:9,xp:74,isBoss:false},
      {id:"dq25_sposa",name:"Sposa del Chaos",emoji:"💜",hp:210,maxHp:210,atk:29,def:13,xp:168,isBoss:true}
    ],
  },{
    id:"dq26", title:"Il Generale Non-Morto di Valdris", active:true,
    desc:"Il Generale Non-Morto Valdrix guida un esercito di scheletri verso la capitale. Ha combattuto ogni guerra degli ultimi mille anni — da entrambe le parti.",
    flavor:"«Non si ferma perché non sa cos'è la sconfitta. Ha perso tante battaglie ma ha sempre vinto la guerra.» — Storico Militare Kell",
    difficulty:"difficile", xpReward:320, goldReward:155,
    steps:[
      {type:"narrative",text:"L'esercito di Valdrix marcia in silenzio perfetto. Diecimila scheletri con armature di epoche diverse — ogni guerra che il generale abbia vinto o perso."},
      {type:"choice",text:"Valdrix è immortale finché il suo stendardo di comando sventola. È al centro dell'esercito — raggiungibile solo con la velocità.",choices:[
        {label:"🏹 Create una distrazione e inviate un piccolo gruppo al centro",xp:30,gold:20,next:2,correct:true},
        {label:"⚔️ Attaccate l'esercito frontalmente",xp:0,gold:0,next:2,correct:false},
        {label:"📜 Cercate di negoziare con Valdrix",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Lo stendardo è abbassato. Valdrix si gira — non con ira, ma con rispetto militare. *«Ben fatto»*, dice. *«Ma la battaglia non è finita.»*"},
      {type:"combat",text:"I **Campioni Scheletro** di Valdrix sfoggiano le loro migliori armi e il **Generale Non-Morto Valdrix** comanda la battaglia!",monsters:[
        {id:"dq26_cs1",name:"Campione Scheletro",emoji:"💀",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
        {id:"dq26_cs2",name:"Campione Scheletro",emoji:"💀",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
        {id:"dq26_valdrix",name:"Generale Non-Morto Valdrix",emoji:"⚔️",hp:220,maxHp:220,atk:28,def:14,xp:172,isBoss:true}
      ]},
      {type:"loot",text:"Valdrix si inchina. *«Mille anni. È abbastanza.»* L'esercito crolla. Il campo è ricoperto di armature di ogni epoca — un tesoro incalcolabile.",loot:{gold:[75,125],items:["Spada di Valdrix il Generale Non-Morto","Stendardo di Comando","Armatura dei Mille Anni","Medaglia della Vittoria Finale"]}}
    ],
    enemies:[
      {id:"dq26_cs1",name:"Campione Scheletro",emoji:"💀",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
      {id:"dq26_cs2",name:"Campione Scheletro",emoji:"💀",hp:88,maxHp:88,atk:19,def:9,xp:73,isBoss:false},
      {id:"dq26_valdrix",name:"Generale Non-Morto Valdrix",emoji:"⚔️",hp:220,maxHp:220,atk:28,def:14,xp:172,isBoss:true}
    ],
  },{
    id:"dq27", title:"Il Custode dell'Apocalisse", active:true,
    desc:"Il Custode dell'Apocalisse si è svegliato. Non è cattivo — è uno strumento cosmico. Ma il suo risvegliarsi significa che qualcosa ha attivato la fine del mondo.",
    flavor:"«Non lo si combatte per vincere. Lo si combatte per guadagnare tempo.» — Profezia dell'Ultimo Tomo",
    difficulty:"difficile", xpReward:360, goldReward:175,
    steps:[
      {type:"narrative",text:"Il cielo è diventato rosso e il suolo trema in modo ritmico — il respiro del Custode. Non vedete ancora la sua forma ma sentite il suo peso sul mondo."},
      {type:"choice",text:"Il Custode segue una profezia scritta prima che il mondo esistesse. Se cambiate un elemento della profezia, il suo risveglio è invalido.",choices:[
        {label:"📖 Riscrivete l'elemento chiave della profezia",xp:32,gold:22,next:2,correct:true},
        {label:"⚔️ Attaccate il Custode direttamente",xp:0,gold:0,next:2,correct:false},
        {label:"🌟 Cercate di convincerlo che l'apocalisse non è necessaria",xp:0,gold:0,next:2,correct:false}
      ]},
      {type:"narrative",text:"Il Custode si ferma. Guarda la profezia alterata. Poi guarda voi. *«Interessante»*, dice con una voce che scuote il suolo. *«La prima volta in settemila anni. Ma le regole sono le regole.»*"},
      {type:"combat",text:"Gli **Araldi dell'Apocalisse** aprono la strada e il **Custode dell'Apocalisse** si manifesta in tutta la sua forma terrificante!",monsters:[
        {id:"dq27_ar1",name:"Araldo dell'Apocalisse",emoji:"🌋",hp:95,maxHp:95,atk:22,def:10,xp:78,isBoss:false},
        {id:"dq27_ar2",name:"Araldo dell'Apocalisse",emoji:"🌋",hp:95,maxHp:95,atk:22,def:10,xp:78,isBoss:false},
        {id:"dq27_custode",name:"Custode dell'Apocalisse",emoji:"⚠️",hp:250,maxHp:250,atk:31,def:16,xp:185,isBoss:true}
      ]},
      {type:"loot",text:"Il Custode si ritira — fino alla prossima profezia. *«Ci rivedremo»*, promette. Il mondo ha qualche altro anno. Il tesoro lasciato dagli Araldi è di potenza cosmica.",loot:{gold:[90,150],items:["Sigillo dell'Apocalisse","Arma degli Araldi","Frammento della Profezia","Elisir della Fine dei Tempi"]}}
    ],
    enemies:[
      {id:"dq27_ar1",name:"Araldo dell'Apocalisse",emoji:"🌋",hp:95,maxHp:95,atk:22,def:10,xp:78,isBoss:false},
      {id:"dq27_ar2",name:"Araldo dell'Apocalisse",emoji:"🌋",hp:95,maxHp:95,atk:22,def:10,xp:78,isBoss:false},
      {id:"dq27_custode",name:"Custode dell'Apocalisse",emoji:"⚠️",hp:250,maxHp:250,atk:31,def:16,xp:185,isBoss:true}
    ],
  }
];
