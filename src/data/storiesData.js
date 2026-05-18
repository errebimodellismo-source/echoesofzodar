/**
 * STORIE DI ZODAR — v2 Node System
 * ═══════════════════════════════════════════════════════════════
 *
 * Struttura Storia:
 *   id, title, emoji, description, version:"v2"
 *   chapters: [ { id, title, startScene, scenes:{} } ]
 *   scenes: { [sceneId]: Scene }
 *
 * Tipi di scena (type):
 *   story      → Testo narrativo puro. nextScene = prossima scena.
 *   choice     → Testo + bivi. choices:[{ text, nextScene, requirements?, setFlags? }]
 *   skillCheck → Prova di abilità. d20 + stat vs DC → successScene / failureScene
 *   combat     → Battaglia. successScene / failureScene
 *   reward     → Ricompense automatiche (xp, gold, items). nextScene.
 *   ending     → Fine capitolo/storia. endingType:"good"|"neutral"|"fail"|"secret"
 *   gameOver   → Morte / fallimento irreversibile. retryScene? / menuScene?
 *   returnPoint→ Punto di convergenza rami. nextScene.
 *
 * Campi scena:
 *   id, type, chapterId, title, text
 *   nextScene?         (story, reward, returnPoint, event)
 *   choices?           (choice)
 *   skillCheck?        { stat, dc, successScene, failureScene, successText?, failureText? }
 *   combat?            { monsters:[], successScene, failureScene }
 *   rewards?           { xp?, gold?, items?:[] }
 *   requirements?      { flags?:{}, minLevel? }
 *   setFlags?          { [flagName]: value }
 *   gameOver?          { retryScene?, text? }
 *   endingType?        (ending only)
 *   isReturnPoint?     bool (returnPoint type)
 *
 * storyFlags: { [flagName]: boolean|number|string }
 * requirements: { flags:{ flagName: expectedValue }, minLevel: N }
 *
 * Skill check stats: "atk"|"def"|"mag"|"init"|"hp"
 * ═══════════════════════════════════════════════════════════════
 */

export const STORIES = [
  {
    id: "storia_risveglio_nebbia",
    version: "v2",
    title: "Il Risveglio nella Nebbia",
    emoji: "🌫️",
    description: "Vi svegliate in un bosco avvolto dalla nebbia, senza ricordi di come ci siete arrivati. Qualcosa di oscuro si muove tra gli alberi.",
    tags: ["mistery", "horror", "forest"],
    difficulty: "normale",
    minPlayers: 1,
    maxPlayers: 4,
    chapters: [
      {
        id: "cap1",
        title: "Il Risveglio",
        startScene: "cap1_intro",
      },
      {
        id: "cap2",
        title: "Il Villaggio Nascosto",
        startScene: "cap2_intro",
      }
    ],
    scenes: {

      /* ─── CAPITOLO 1 ─── */

      cap1_intro: {
        id: "cap1_intro",
        chapterId: "cap1",
        type: "story",
        title: "Occhi nella nebbia",
        text: `La prima cosa che sentite è il freddo.

Un freddo umido che si insinua sotto le vesti, che sa di muschio e di terra bagnata. Poi la nebbia — bianca, densa, immobile come un muro di lana — vi avvolge da ogni parte.

Vi alzate lentamente. Il bosco intorno è silenzioso in modo innaturale. Nessun uccello. Nessun vento. Solo il vostro respiro e il crepitio delle foglie sotto i piedi.

*Dove siamo?* pensiete. E soprattutto — *come ci siamo arrivati?*`,
        nextScene: "cap1_road",
      },

      cap1_road: {
        id: "cap1_road",
        chapterId: "cap1",
        type: "choice",
        title: "Il bivio nel bosco",
        text: `Davanti a voi si aprono tre sentieri tra gli alberi. Uno scende verso valle, uno sale verso una collina dove intravvedete qualcosa di scuro stagliarsi nella nebbia, uno porta dritto nel fitto del bosco.

Un suono lontano — quasi un gemito — arriva dalla direzione del bosco fitto.`,
        choices: [
          {
            text: "📉 Seguire il sentiero in discesa verso la valle",
            nextScene: "cap1_valley",
            setFlags: { sceltaValle: true },
          },
          {
            text: "🏔️ Salire verso la sagoma sulla collina",
            nextScene: "cap1_hill_approach",
            setFlags: { sceltaCollina: true },
          },
          {
            text: "🌲 Addentrarsi nel bosco verso il gemito",
            nextScene: "cap1_forest_sound",
            setFlags: { sceltaBosco: true },
          },
          {
            text: "🔍 Fermarsi e studiare i segni intorno",
            nextScene: "cap1_investigate",
          },
        ],
      },

      /* --- Ramo: Investigate --- */
      cap1_investigate: {
        id: "cap1_investigate",
        chapterId: "cap1",
        type: "skillCheck",
        title: "Tracce nel fango",
        text: `Vi inginocchiate e studiate il terreno. Impronte, rami spezzati, segni di trascinamento...`,
        skillCheck: {
          stat: "mag",
          dc: 12,
          successScene: "cap1_investigate_success",
          failureScene: "cap1_investigate_fail",
          successText: "La vostra mente acuta legge le tracce come un libro aperto.",
          failureText: "Le tracce sono confuse e illeggibili. Il bosco non vi svela i suoi segreti.",
        },
      },

      cap1_investigate_success: {
        id: "cap1_investigate_success",
        chapterId: "cap1",
        type: "story",
        title: "La verità nelle impronte",
        text: `Le impronte raccontano una storia: qualcuno — o qualcosa — vi ha trascinato fino a qui mentre dormivate. Le tracce arrivano da nord, dalla direzione della collina. Sono impronte umane, ma troppo grandi, con una strana regolarità meccanica.

Sapete dove andare.`,
        nextScene: "cap1_hill_approach",
        setFlags: { conosceOrigine: true },
      },

      cap1_investigate_fail: {
        id: "cap1_investigate_fail",
        chapterId: "cap1",
        type: "story",
        title: "Nebbia nella mente",
        text: `Non riuscite a capire nulla. Il terreno è un caos di fango e foglie. Forse la nebbia offusca anche i vostri pensieri.

Dovete scegliere alla cieca.`,
        nextScene: "cap1_road",
      },

      /* --- Ramo: Valle --- */
      cap1_valley: {
        id: "cap1_valley",
        chapterId: "cap1",
        type: "story",
        title: "La discesa",
        text: `Il sentiero scende ripido tra radici e rocce bagnate. La nebbia si fa più sottile mano a mano che scendete, e dopo qualche minuto intravvedete una luce tremolante in basso.

Un fuoco da campo. Qualcuno è accampato nella valle.`,
        nextScene: "cap1_wanderer",
      },

      /* --- Ramo: Bosco --- */
      cap1_forest_sound: {
        id: "cap1_forest_sound",
        chapterId: "cap1",
        type: "story",
        title: "Il gemito nel bosco",
        text: `Vi addentrate tra gli alberi seguendo il suono. La nebbia qui è più densa, quasi solida. I rami si chiudono sopra di voi come mani intrecciate.

Il gemito si fa più forte... poi si interrompe di colpo.

E davanti a voi appaiono tre paia di occhi gialli che brillano nell'oscurità.`,
        nextScene: "cap1_wolf_ambush",
      },

      cap1_wolf_ambush: {
        id: "cap1_wolf_ambush",
        chapterId: "cap1",
        type: "combat",
        title: "Lupi della nebbia",
        text: `I lupi scattano verso di voi emettendo ringhi sordi. Non sono normali — i loro occhi brillano di una luce innaturale e il pelo è parzialmente traslucido come se fossero fatti di nebbia stessa.`,
        combat: {
          monsters: [
            { id:"lupo_nebbia_1", name:"Lupo della Nebbia", emoji:"🐺", hp:18, max_hp:18, atk:7, def:3, mag:0, init:8, xp:30, gold:0 },
            { id:"lupo_nebbia_2", name:"Lupo della Nebbia", emoji:"🐺", hp:18, max_hp:18, atk:7, def:3, mag:0, init:8, xp:30, gold:0 },
            { id:"lupo_nebbia_3", name:"Lupo della Nebbia", emoji:"🐺", hp:14, max_hp:14, atk:5, def:2, mag:0, init:9, xp:20, gold:0 },
          ],
          successScene: "cap1_wolf_victory",
          failureScene: "cap1_wolf_defeat",
        },
      },

      cap1_wolf_victory: {
        id: "cap1_wolf_victory",
        chapterId: "cap1",
        type: "reward",
        title: "La nebbia si ritira",
        text: `I lupi cadono e si dissolvono nella nebbia da cui erano venuti. Dove giacevano restano solo ciuffi di pelo e un debole bagliore argenteo.

Tra le radici di un albero trovate quello che i lupi sorvegliavano: un piccolo zaino abbandonato.`,
        rewards: { xp: 80, gold: 15, items: [] },
        nextScene: "cap1_return_point",
        setFlags: { battutoLupiNebbia: true },
      },

      cap1_wolf_defeat: {
        id: "cap1_wolf_defeat",
        chapterId: "cap1",
        type: "gameOver",
        title: "Divorati dalla nebbia",
        text: `I lupi vi travolgono. L'ultimo pensiero prima del buio è la nebbia — bianca, fredda, infinita.

Quando riaprite gli occhi siete di nuovo all'inizio, come se nulla fosse accaduto. O forse è sempre stato così.`,
        gameOver: {
          retryScene: "cap1_intro",
          text: "I lupi della nebbia vi hanno sopraffatto. Volete riprovare dall'inizio?",
        },
      },

      /* --- Ramo: Collina --- */
      cap1_hill_approach: {
        id: "cap1_hill_approach",
        chapterId: "cap1",
        type: "story",
        title: "La sagoma sulla collina",
        text: `Salite verso la collina. La nebbia qui è più sottile, quasi trasparente, e la sagoma si rivela essere una torre di pietra antica, parzialmente crollata.

Le pietre sono coperte di muschio e di strani simboli incisi. La porta è socchiusa.`,
        nextScene: "cap1_tower_choice",
      },

      cap1_tower_choice: {
        id: "cap1_tower_choice",
        chapterId: "cap1",
        type: "choice",
        title: "La torre abbandonata",
        text: `La torre emana un senso di abbandono secolare, ma anche qualcosa d'altro — una presenza, un calore artificiale che non appartiene a questo bosco.`,
        choices: [
          {
            text: "🚪 Entrare nella torre",
            nextScene: "cap1_tower_inside",
          },
          {
            text: "🔮 Esaminare i simboli sulle pietre",
            nextScene: "cap1_tower_symbols",
          },
          {
            text: "🔙 Tornare al bivio",
            nextScene: "cap1_road",
          },
        ],
      },

      cap1_tower_symbols: {
        id: "cap1_tower_symbols",
        chapterId: "cap1",
        type: "skillCheck",
        title: "Simboli antichi",
        text: `Vi avvicinate alle pietre e studiate i simboli. Sono una lingua antica, forse precede il regno...`,
        skillCheck: {
          stat: "mag",
          dc: 14,
          successScene: "cap1_tower_symbols_read",
          failureScene: "cap1_tower_inside",
          successText: "Riconoscete la scrittura Zodariana antica. Sapere questo vi sarà utile.",
          failureText: "I simboli sono incomprensibili. Entrate nella torre.",
        },
      },

      cap1_tower_symbols_read: {
        id: "cap1_tower_symbols_read",
        chapterId: "cap1",
        type: "story",
        title: "Il messaggio dei costruttori",
        text: `I simboli dicono: *"Chi dorme nel bosco non dorme per sua scelta. La nebbia ha fame. L'ancora è dentro."*

Non sapete cosa significhi "l'ancora", ma lo terrete a mente.`,
        nextScene: "cap1_tower_inside",
        setFlags: { leggeSimboliTorre: true },
      },

      cap1_tower_inside: {
        id: "cap1_tower_inside",
        chapterId: "cap1",
        type: "story",
        title: "Dentro la torre",
        text: `L'interno della torre è sorprendentemente intatto. Un tavolo, una sedia, resti di un fuoco recente. E su un piedistallo di pietra — una lanterna che emette una luce blu-argentea.

Appena la toccate, la nebbia fuori dalla finestra si ritrae leggermente, come se avesse paura della luce.`,
        nextScene: "cap1_lantern_choice",
        setFlags: { trovataLanterna: true },
      },

      cap1_lantern_choice: {
        id: "cap1_lantern_choice",
        chapterId: "cap1",
        type: "choice",
        title: "La lanterna della nebbia",
        text: `La lanterna pulsa nella vostra mano con una luce calda e rassicurante. Sembra fatta per combattere questa nebbia.`,
        choices: [
          {
            text: "🏮 Prendere la lanterna e scendere verso la valle",
            nextScene: "cap1_wanderer",
            setFlags: { haLanterna: true },
          },
          {
            text: "📚 Cercare altri indizi nella torre prima di andare",
            nextScene: "cap1_tower_search",
          },
        ],
      },

      cap1_tower_search: {
        id: "cap1_tower_search",
        chapterId: "cap1",
        type: "reward",
        title: "Tesori nascosti",
        text: `Frugando tra le assi del pavimento trovate una botola. Sotto: una piccola cassetta con alcune monete e una nota sgualcita.

La nota dice: *"Se stai leggendo questo, il piano ha funzionato. Trova Mira al villaggio. Distruggi l'ancora."*`,
        rewards: { xp: 20, gold: 25, items: [] },
        nextScene: "cap1_wanderer",
        setFlags: { haLanterna: true, trovataNota: true, nomeMira: true },
      },

      /* --- Convergenza: Viandante --- */
      cap1_wanderer: {
        id: "cap1_wanderer",
        chapterId: "cap1",
        type: "returnPoint",
        isReturnPoint: true,
        title: "L'uomo al fuoco",
        text: `Attorno al fuoco da campo trovate un vecchio avvolto in un mantello grigio. Vi guarda arrivare senza sorpresa, come se vi aspettasse.

"Finalmente," dice. "Ho fatto fuoco per voi. Sedetevi."

Si chiama Aldric. Era il guardiano della torre, dice, prima che *lei* arrivasse.

"La nebbia non è nebbia," vi spiega. "È un'entità. Si nutre di memorie, di nomi, di identità. Vi ha rubato i vostri ricordi per tenervi qui. Ma c'è un modo per fermarla."`,
        nextScene: "cap1_aldric_quest",
      },

      cap1_aldric_quest: {
        id: "cap1_aldric_quest",
        chapterId: "cap1",
        type: "choice",
        title: "La missione di Aldric",
        text: `"Nel centro del bosco c'è un'ancora — un cristallo che la nebbia usa come cuore. Distruggetelo e la nebbia si dissolverà. Ma il bosco la difenderà con tutto ciò che ha."

${`Vi guarda con occhi stanchi ma lucidi.`}

"Avete quello che serve?" chiede.`,
        choices: [
          {
            text: "⚔️ Siamo pronti. Portaci all'ancora.",
            nextScene: "cap1_ending_brave",
          },
          {
            text: "🏮 Abbiamo trovato la tua lanterna! (richiede haLanterna)",
            nextScene: "cap1_aldric_lantern",
            requirements: { flags: { haLanterna: true } },
          },
          {
            text: "📜 Abbiamo trovato la tua nota! (richiede trovataNota)",
            nextScene: "cap1_aldric_note",
            requirements: { flags: { trovataNota: true } },
          },
          {
            text: "❓ Raccontaci di più prima di decidere.",
            nextScene: "cap1_aldric_lore",
          },
        ],
      },

      cap1_aldric_lore: {
        id: "cap1_aldric_lore",
        chapterId: "cap1",
        type: "story",
        title: "La storia di Aldric",
        text: `Aldric vi racconta di come sia arrivata la nebbia tre anni fa — all'improvviso, in una sola notte. Il villaggio di Brumeval è scomparso nella nebbia. Lui è riuscito a fuggire con la lanterna.

"La lanterna è fatta con cristalli anti-nebbia. L'ancora è il contrario — cristallo pro-nebbia. Rompetela."`,
        nextScene: "cap1_aldric_quest",
      },

      cap1_aldric_lantern: {
        id: "cap1_aldric_lantern",
        chapterId: "cap1",
        type: "story",
        title: "La lanterna ritrovata",
        text: `Gli occhi di Aldric si illuminano quando vedete la lanterna.

"L'avevo lasciata nella torre sperando che qualcuno la trovasse. Con quella avrete vantaggio contro i guardiani dell'ancora. La nebbia vi temerà."

Vi spiega che con la lanterna i mostri della nebbia subiranno danno extra.`,
        nextScene: "cap1_ending_prepared",
        setFlags: { vantgioLanterna: true },
      },

      cap1_aldric_note: {
        id: "cap1_aldric_note",
        chapterId: "cap1",
        type: "story",
        title: "La nota di Aldric",
        text: `"Quella nota l'ho scritta io," dice Aldric con un sorriso triste. "Mira è mia figlia. È rimasta nel villaggio quando è arrivata la nebbia. Se è ancora viva..."

Si interrompe. "Dopo l'ancora, trovate Brumeval. Trovate Mira."

La missione ora ha un significato in più.`,
        nextScene: "cap1_ending_prepared",
        setFlags: { missioneMira: true },
      },

      /* --- Finali Capitolo 1 --- */
      cap1_ending_brave: {
        id: "cap1_ending_brave",
        chapterId: "cap1",
        type: "ending",
        endingType: "neutral",
        title: "Verso il cuore della nebbia",
        text: `Aldric vi indica la direzione. Camminate nel bosco con la nebbia che si ritrae davanti a voi a ogni passo, quasi timorosa.

Presto troverete l'ancora. E dopo — forse — i vostri ricordi.

*Fine del Capitolo 1 — Il Risveglio*`,
        rewards: { xp: 100, gold: 0 },
        nextScene: "cap2_intro",
      },

      cap1_ending_prepared: {
        id: "cap1_ending_prepared",
        chapterId: "cap1",
        type: "ending",
        endingType: "good",
        title: "Armati di luce e sapere",
        text: `Partite con qualcosa in più degli altri: la lanterna di Aldric, le sue parole, forse un nome — Mira — che vi darà forza quando il bosco si farà più oscuro.

La nebbia si ritrae davanti alla vostra luce. Siete pronti.

*Fine del Capitolo 1 — Il Risveglio (Percorso Preparato)*`,
        rewards: { xp: 150, gold: 10 },
        nextScene: "cap2_intro",
        setFlags: { cap1_buonFine: true },
      },

      cap1_return_point: {
        id: "cap1_return_point",
        chapterId: "cap1",
        type: "returnPoint",
        isReturnPoint: true,
        title: "Il bosco alle spalle",
        text: `Con i lupi sconfitti, il bosco sembra respirare diversamente. La nebbia si è ritirata leggermente in questa zona, come se la vostra vittoria avesse indebolito qualcosa.

Scorgete in basso la luce di un fuoco da campo.`,
        nextScene: "cap1_wanderer",
      },

      /* ─── CAPITOLO 2 ─── */

      cap2_intro: {
        id: "cap2_intro",
        chapterId: "cap2",
        type: "story",
        title: "Brumeval",
        text: `Il villaggio emerge dalla nebbia come un sogno dimenticato.

Le case ci sono ancora — porte aperte, finestre illuminate, fuochi accesi — ma silenziose. Come se gli abitanti siano usciti un momento fa e stessero per tornare.

Ma non tornano. Il villaggio è fermo nel tempo, in un eterno attimo sospeso.

Aldric, rimasto indietro, aveva detto: *"Cercate Mira alla locanda. Se è ancora lei."*`,
        nextScene: "cap2_village_explore",
      },

      cap2_village_explore: {
        id: "cap2_village_explore",
        chapterId: "cap2",
        type: "choice",
        title: "Nel villaggio silenzioso",
        text: `Le strade di Brumeval sono deserte ma non abbandonate. Sentite rumori oltre le porte: voci ovattate, passi, il tintinnio di posate. Ma quando bussate — silenzio.

Dove andate per prima cosa?`,
        choices: [
          {
            text: "🏨 Alla locanda (cercare Mira)",
            nextScene: "cap2_inn",
          },
          {
            text: "⛪ Alla chiesa (al centro del villaggio)",
            nextScene: "cap2_church",
          },
          {
            text: "🔮 Al pozzo (sembra brillare di luce blu)",
            nextScene: "cap2_well",
          },
        ],
      },

      cap2_inn: {
        id: "cap2_inn",
        chapterId: "cap2",
        type: "story",
        title: "La locanda del Cervo Grigio",
        text: `La locanda è l'unico posto nel villaggio con segni di vita reale: una donna in piedi dietro il bancone, occhi vuoti che vi fissano senza vedervi.

Poi — un battito di ciglia. E vi riconosce.

"Siete... reali?" sussurra. "Non siete nebbia?"

Si chiama Mira. E ha aspettato tre anni.`,
        nextScene: "cap2_mira_dialog",
        setFlags: { trovataMira: true },
      },

      cap2_mira_dialog: {
        id: "cap2_mira_dialog",
        chapterId: "cap2",
        type: "choice",
        title: "Mira",
        text: `Mira vi racconta in modo concitato: tutti gli abitanti del villaggio sono intrappolati in un loop temporale imposto dalla nebbia. Vivono lo stesso giorno all'infinito senza saperlo. Solo lei ne è consapevole.

"L'ancora è nella cripta sotto la chiesa. È protetta da un guardiano. Io so come arrivarci, ma non posso entrarci — la nebbia mi tiene ancorata al villaggio."

Vi prega di farlo voi.`,
        choices: [
          {
            text: "✅ Andremo alla cripta.",
            nextScene: "cap2_crypt_approach",
            setFlags: { accettatoMissione: true },
          },
          {
            text: "📖 Tuo padre Aldric ti manda saluti. (richiede nomeMira)",
            nextScene: "cap2_mira_father",
            requirements: { flags: { nomeMira: true } },
          },
        ],
      },

      cap2_mira_father: {
        id: "cap2_mira_father",
        chapterId: "cap2",
        type: "story",
        title: "Il messaggio di Aldric",
        text: `Mira trattiene il respiro. Le lacrime cadono silenziose.

"È vivo," sussurra. "È ancora vivo."

Si raddrizza, determinata. "Allora dobbiamo riuscire. Distruggete l'ancora. Liberate il villaggio. E riportatemi da mio padre."

Vi dà una chiave di ferro antico. "Per la cripta."`,
        nextScene: "cap2_crypt_approach",
        setFlags: { accettatoMissione: true, chiaveCripta: true, bonusMira: true },
      },

      cap2_church: {
        id: "cap2_church",
        chapterId: "cap2",
        type: "story",
        title: "La chiesa silenziosa",
        text: `La chiesa è fredda e silenziosa. I banchi sono pieni di figure immobili — abitanti del villaggio congelati in atteggiamento di preghiera, occhi aperti e vuoti.

Sul pavimento, davanti all'altare, c'è una botola di pietra. È sigillata con simboli identici a quelli della torre.

"Serve una chiave," dice qualcuno del gruppo.`,
        nextScene: "cap2_village_explore",
      },

      cap2_well: {
        id: "cap2_well",
        chapterId: "cap2",
        type: "skillCheck",
        title: "Il pozzo luminoso",
        text: `Il pozzo emette una luce blu-argentea — identica a quella della lanterna di Aldric. Vi sporgete a guardare: l'acqua brilla dall'interno.`,
        skillCheck: {
          stat: "mag",
          dc: 13,
          successScene: "cap2_well_success",
          failureScene: "cap2_well_fail",
          successText: "Riconoscete la magia anti-nebbia. Quest'acqua è un'arma.",
          failureText: "Non capite la natura della luce, ma qualcosa vi dice che è preziosa.",
        },
      },

      cap2_well_success: {
        id: "cap2_well_success",
        chapterId: "cap2",
        type: "reward",
        title: "L'acqua della memoria",
        text: `Raccogliete l'acqua luminosa in un'ampolla trovata vicino al pozzo. Potrete usarla nel combattimento contro il guardiano dell'ancora — infliggerà danno extra agli esseri di nebbia.`,
        rewards: { xp: 30, gold: 0, items: [] },
        nextScene: "cap2_village_explore",
        setFlags: { haAcquaMemoria: true },
      },

      cap2_well_fail: {
        id: "cap2_well_fail",
        chapterId: "cap2",
        type: "story",
        title: "Acqua misteriosa",
        text: `L'acqua è bella e luminosa, ma non sapete come usarla. Proseguite verso la locanda.`,
        nextScene: "cap2_village_explore",
      },

      cap2_crypt_approach: {
        id: "cap2_crypt_approach",
        chapterId: "cap2",
        type: "story",
        title: "La discesa nella cripta",
        text: `La botola sotto l'altare cede — con la chiave di Mira o con la forza bruta. Le scale di pietra scendono nel buio.

L'aria è gelida, satura di nebbia solida che si muove come vapore. E in fondo alle scale, una luce azzurra pulsante — l'ancora.

Ma tra voi e l'ancora, qualcosa si muove.`,
        nextScene: "cap2_guardian_combat",
      },

      cap2_guardian_combat: {
        id: "cap2_guardian_combat",
        chapterId: "cap2",
        type: "combat",
        title: "Il Guardiano dell'Ancora",
        text: `Una forma umanoide fatta interamente di nebbia condensata si erge davanti a voi. I suoi occhi sono vuoti buchi neri. Emette un grido silenzioso che vi ghiaccia il sangue.

*Il Guardiano dell'Ancora vi fronteggia.*`,
        combat: {
          monsters: [
            { id:"guardiano_ancora", name:"Guardiano dell'Ancora", emoji:"👻", hp:60, max_hp:60, atk:12, def:6, mag:8, init:5, xp:200, gold:50 },
          ],
          successScene: "cap2_anchor_destroy",
          failureScene: "cap2_guardian_defeat",
        },
      },

      cap2_guardian_defeat: {
        id: "cap2_guardian_defeat",
        chapterId: "cap2",
        type: "gameOver",
        title: "Assorbiti dalla nebbia",
        text: `Il Guardiano vi sopraffà. La nebbia vi inghiotte e i vostri volti si uniscono alle figure silenziose nelle panche della chiesa.

Avete perso. Ma la nebbia non dimentica mai. Forse un giorno potrete spezzare il ciclo.`,
        gameOver: {
          retryScene: "cap2_crypt_approach",
          text: "Il Guardiano dell'Ancora vi ha sconfitti. Volete riprovare dall'ingresso della cripta?",
        },
      },

      cap2_anchor_destroy: {
        id: "cap2_anchor_destroy",
        chapterId: "cap2",
        type: "story",
        title: "L'ancora si spezza",
        text: `Con il Guardiano dissolto, vi avvicinate al cristallo. Pulsa di una luce azzurra intensa, quasi dolorosa da guardare.

Lo colpite con tutta la vostra forza.

Il cristallo si incrina. Si spezza. Esplode in una cascata di luce bianca che risale le scale, sfonda le porte della chiesa, si propaga per tutto il villaggio.

La nebbia urla — un suono che sentite più nelle ossa che nelle orecchie — e poi si dissolve.

Il sole emerge per la prima volta in tre anni.`,
        nextScene: "cap2_ending",
      },

      cap2_ending: {
        id: "cap2_ending",
        chapterId: "cap2",
        type: "ending",
        endingType: "good",
        title: "Il sole su Brumeval",
        text: `Gli abitanti del villaggio si risvegliano come da un lungo sogno. Confusi, disorientati, ma vivi. Reali.

Mira corre fuori dalla locanda, coprendosi gli occhi con il sole che non vedeva da tre anni.

E all'orizzonte, attraverso il bosco liberato dalla nebbia, vedete la figura di un vecchio in mantello grigio che cammina verso il villaggio.

Aldric e Mira si riuniranno.

Voi, eroi senza nome e senza memoria, avete salvato Brumeval. I vostri ricordi potrebbero non tornare mai — ma ne avete creati di nuovi.

*Fine — Il Risveglio nella Nebbia*`,
        rewards: { xp: 400, gold: 120 },
        setFlags: { storiaCompletata: true },
      },
    },
  },
];

/* ─── Helper: genera diagramma Mermaid da una storia v2 ─── */
export function generateMermaidDiagram(story) {
  if (!story || story.version !== "v2") return "";

  const lines = ["flowchart TD"];
  const colorMap = {
    story:       "fill:#4a7c59,color:#fff",
    choice:      "fill:#7c5a4a,color:#fff",
    skillCheck:  "fill:#5a4a7c,color:#fff",
    combat:      "fill:#7c1a1a,color:#fff",
    reward:      "fill:#4a6a7c,color:#fff",
    ending:      "fill:#2d6a4f,color:#fff,stroke:#1b4332,stroke-width:3px",
    gameOver:    "fill:#333,color:#ff4444,stroke:#ff4444,stroke-width:2px",
    returnPoint: "fill:#7c6a1a,color:#fff",
  };

  const nodeLabel = (id, scene) => {
    const icon = {
      story:       "📖",
      choice:      "🔀",
      skillCheck:  "🎲",
      combat:      "⚔️",
      reward:      "💰",
      ending:      "🏁",
      gameOver:    "💀",
      returnPoint: "🔁",
    }[scene.type] || "•";
    const safeTitle = (scene.title || id).replace(/"/g, "'").slice(0, 30);
    return `"${icon} ${safeTitle}"`;
  };

  const edges = [];
  const styleLines = [];

  const safeId = (id) => id.replace(/-/g, "_");

  Object.entries(story.scenes).forEach(([id, scene]) => {
    const sid = safeId(id);
    const shape = scene.type === "returnPoint" || scene.isReturnPoint
      ? `(((${nodeLabel(id, scene)})))`
      : scene.type === "gameOver"
      ? `[/${nodeLabel(id, scene)}/]`
      : scene.type === "ending"
      ? `([${nodeLabel(id, scene)}])`
      : scene.type === "choice"
      ? `{${nodeLabel(id, scene)}}`
      : `[${nodeLabel(id, scene)}]`;

    lines.push(`  ${sid}${shape}`);
    styleLines.push(`  style ${sid} ${colorMap[scene.type] || ""}`);

    if (scene.nextScene) {
      edges.push(`  ${sid} --> ${safeId(scene.nextScene)}`);
    }
    if (scene.choices) {
      scene.choices.forEach((c, i) => {
        const label = c.text.slice(0, 20).replace(/"/g, "'");
        edges.push(`  ${sid} -->|"${label}..."| ${safeId(c.nextScene)}`);
      });
    }
    if (scene.skillCheck) {
      edges.push(`  ${sid} -->|"✅ Successo"| ${safeId(scene.skillCheck.successScene)}`);
      edges.push(`  ${sid} -->|"❌ Fallimento"| ${safeId(scene.skillCheck.failureScene)}`);
    }
    if (scene.combat) {
      edges.push(`  ${sid} -->|"⚔️ Vittoria"| ${safeId(scene.combat.successScene)}`);
      edges.push(`  ${sid} -->|"💀 Sconfitta"| ${safeId(scene.combat.failureScene)}`);
    }
    if (scene.gameOver?.retryScene) {
      edges.push(`  ${sid} -.->|"🔄 Riprova"| ${safeId(scene.gameOver.retryScene)}`);
    }
  });

  return [...lines, ...edges, ...styleLines].join("\n");
}
