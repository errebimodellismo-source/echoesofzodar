/**
 * STORIE DI ZODAR
 * ═══════════════════════════════════════════════════════════════
 *
 * Come aggiungere una storia:
 *   1. Copia il template di una storia esistente
 *   2. Cambia id, title, emoji, description, startChapter
 *   3. Aggiungi i tuoi capitoli nell'oggetto chapters: { id: Chapter }
 *
 * Tipi di capitolo (type):
 *   narration  → Testo narrativo. Solo il capo-party può premere "Continua".
 *   choice     → Testo + fino a 4 scelte. Ogni scelta punta a un capitolo.
 *   battle     → Testo + mostri. Avvia il combattimento. next=vittoria, nextFail=sconfitta.
 *   loot       → Testo + rewards: {xp, gold}. Distribuiti automaticamente.
 *   event      → Testo + effetti: [{type, amount, text}]. Applicati automaticamente.
 *               type può essere: "xp" | "gold" | "heal" | "hp" (danno)
 *   rest       → Riposo breve automatico (recupera metà HP).
 *   ending     → Capitolo finale. rewards: {xp, gold}. endingType: "good"|"neutral"|"fail".
 *
 * Mostri (per capitoli battle):
 *   { id, name, emoji, hp, max_hp, atk, def, mag, init, xp, gold, isPlayer:false }
 *
 * Note:
 *   - Ogni story.id deve essere univoco
 *   - Ogni chapter.id deve essere univoco all'interno della storia
 *   - Il primo capitolo è indicato da story.startChapter
 *   - I capitoli tipo "ending" terminano la storia
 * ═══════════════════════════════════════════════════════════════
 */

export const STORIES = [

  // ─────────────────────────────────────────────────────────────
  // STORIA 1: La Torre dello Stregone Grigio
  // ─────────────────────────────────────────────────────────────
  {
    id: "storia_torre_grigia",
    title: "La Torre dello Stregone Grigio",
    emoji: "🗼",
    description: "Una torre abbandonata domina la pianura nebbiosa. Il vecchio del villaggio giura che lo stregone che vi abitava non è mai davvero morto.",
    minLevel: 1,
    maxLevel: null,
    estDuration: "60–90 min",
    tags: ["magia", "esplorazione", "boss", "scelte"],
    startChapter: "prologo",
    chapters: {

      "prologo": {
        id: "prologo",
        type: "narration",
        title: "L'Alba della Partenza",
        text: "Il villaggio di Pietrabianca vi ha accolti per tre giorni. Poco prima dell'alba, il vecchio Aldric vi chiama nella sua bottega.\n\n\"Ascoltate bene,\" sussurra con voce roca. \"Quella torre non è mai stata abbandonata. Chi ci è entrato... non è tornato. Ma voi non siete gente comune.\"\n\nFuori, la nebbia avvolge i campi. La torre si staglia all'orizzonte, nera contro il cielo pallido.\n\nÈ tempo di partire.",
        next: "viaggio",
      },

      "viaggio": {
        id: "viaggio",
        type: "event",
        title: "Il Sentiero Silenzioso",
        text: "Il sentiero verso la torre è stranamente silenzioso. Nessun uccello canta, nessun vento soffia tra le erbe alte.\n\nA metà strada trovate i resti di un accampamento. Fuoco spento, coperta strappata, un sacchetto di monete abbandonato nella fretta.\n\nSembra che qualcuno sia fuggito di corsa.",
        effects: [
          { type: "gold", amount: 12, text: "+12 oro a testa dalle monete abbandonate" },
        ],
        next: "portone",
      },

      "portone": {
        id: "portone",
        type: "choice",
        title: "Il Portone della Torre",
        text: "La torre è più alta di quanto sembrava da lontano. Le pietre sono annerite da bruciature antiche. Il portone di legno massiccio è chiuso ma non sbarrato.\n\nIntorno notate tre possibili ingressi. Come entrate?",
        choices: [
          { text: "🚪 Sfondare il portone principale", next: "ingresso_portone" },
          { text: "🪟 Infilarsi dalla finestra rotta", next: "ingresso_finestra" },
          { text: "🕳️ Aprire la botola sotterranea", next: "ingresso_botola" },
        ],
      },

      "ingresso_portone": {
        id: "ingresso_portone",
        type: "battle",
        title: "Guardie Scheletrite",
        text: "Il portone cede con uno schianto. Prima che possiate fare un passo, due scheletri armati emergono dall'ombra — le ossa che cigolano, le spade che luccicano nella luce fioca.\n\nLa torre non era incustodita.",
        monsters: [
          { id: "es_g1", name: "Scheletro Guardiano", emoji: "💀", hp: 22, max_hp: 22, atk: 5, def: 2, mag: 0, init: 4, xp: 35, gold: 8, isPlayer: false },
          { id: "es_g2", name: "Scheletro Guardiano", emoji: "💀", hp: 22, max_hp: 22, atk: 5, def: 2, mag: 0, init: 3, xp: 35, gold: 8, isPlayer: false },
        ],
        next: "hall",
        nextFail: "sconfitta",
      },

      "ingresso_finestra": {
        id: "ingresso_finestra",
        type: "event",
        title: "L'Ingresso Silenzioso",
        text: "Vi infilate uno a uno dalla finestra scheggiata. Il pavimento è coperto di polvere — e di ossa.\n\nLe guardie scheletrite sono vicino al portone, di spalle. Le aggirate senza fare rumore.\n\nUna piccola vittoria.",
        effects: [
          { type: "xp", amount: 20, text: "+20 XP — avete aggirato le guardie con astuzia" },
        ],
        next: "hall",
      },

      "ingresso_botola": {
        id: "ingresso_botola",
        type: "loot",
        title: "La Dispensa Dimenticata",
        text: "La botola conduce a un cunicolo stretto e poi a una piccola stanza. Scaffali marciti ma su alcuni resistono ancora barattoli sigillati.\n\nNascosto sotto un'asse: uno scrigno di ferro con monete e provviste.",
        rewards: { xp: 30, gold: 45 },
        next: "hall",
      },

      "hall": {
        id: "hall",
        type: "narration",
        title: "L'Atrio della Torre",
        text: "L'atrio è una grande sala circolare. Il soffitto si perde nel buio sopra di voi. Al centro, una scala a chiocciola in ferro sale verso i piani superiori.\n\nSulle pareti, affreschi sbiaditi mostrano uno stregone e un'entità oscura che stringono un patto. I volti nell'affresco sembrano seguirvi con gli occhi.\n\nSalite.",
        next: "biblioteca",
      },

      "biblioteca": {
        id: "biblioteca",
        type: "choice",
        title: "La Biblioteca",
        text: "Il secondo piano è una biblioteca. Scaffali altissimi, libri polverosi, carte sparse. Una candela ancora accesa al centro del tavolo — come se qualcuno fosse uscito un momento fa.\n\nSulla scrivania trovate tre oggetti. Avete tempo per prenderne solo uno: sentite dei passi pesanti sopra di voi.",
        choices: [
          { text: "📖 Il grimorio aperto", next: "prendi_grimorio" },
          { text: "🗝️ La chiave di rame", next: "prendi_chiave" },
          { text: "🧪 La boccetta viola", next: "prendi_boccetta" },
        ],
      },

      "prendi_grimorio": {
        id: "prendi_grimorio",
        type: "loot",
        title: "Il Grimorio dello Stregone",
        text: "Afferrate il grimorio. Contiene incantesimi dimenticati e annotazioni sui poteri dell'entità legata alla torre. Un tomo di grande valore — anche solo per rivenderlo.",
        rewards: { xp: 40, gold: 0 },
        next: "terzo_piano",
      },

      "prendi_chiave": {
        id: "prendi_chiave",
        type: "narration",
        title: "La Chiave di Rame",
        text: "La chiave è pesante e fredda, con simboli incisi sul manico. Nessuna serratura visibile qui, ma è chiaramente importante.\n\nForse c'è qualcosa al piano superiore che la richiede.",
        next: "terzo_piano",
      },

      "prendi_boccetta": {
        id: "prendi_boccetta",
        type: "event",
        title: "L'Elixir Viola",
        text: "La boccetta è calda al tatto. Prima che possiate fermarli, uno di voi la beve d'impulso. Per un momento i suoi occhi si illuminano di viola.\n\nPoi passano.",
        effects: [
          { type: "heal", amount: 25, text: "+25 HP a chi ha bevuto l'elixir" },
        ],
        next: "terzo_piano",
      },

      "terzo_piano": {
        id: "terzo_piano",
        type: "battle",
        title: "Il Famiglio dell'Ombra",
        text: "Il terzo piano è una stanza ottagonale. Al centro, un cerchio magico ancora attivo pulsa di luce violacea.\n\nDal cerchio emerge il famiglio dello stregone: una creatura di ombra e fumo, con occhi come braci rosse. Non è vivo nel senso tradizionale — ma vi attacca con ferocia.",
        monsters: [
          { id: "es_fam", name: "Famiglio dell'Ombra", emoji: "👁️", hp: 45, max_hp: 45, atk: 8, def: 3, mag: 5, init: 8, xp: 100, gold: 0, isPlayer: false },
        ],
        next: "cima",
        nextFail: "sconfitta",
      },

      "cima": {
        id: "cima",
        type: "choice",
        title: "La Stanza della Cima",
        text: "La stanza finale della torre. Come se il tempo si fosse fermato: vesti piegate, un libro aperto, una finestra verso l'alba.\n\nNel mezzo: un cristallo nero su un piedistallo. Pulsa lentamente, come un cuore.\n\nCosa fate?",
        choices: [
          { text: "💎 Distruggere il cristallo", next: "fine_buona" },
          { text: "🖐️ Toccare il cristallo prima", next: "tocca_cristallo" },
          { text: "🎒 Portarlo via intatto", next: "fine_neutrale" },
        ],
      },

      "tocca_cristallo": {
        id: "tocca_cristallo",
        type: "event",
        title: "La Voce dello Stregone",
        text: "Chi tocca il cristallo viene investito da una visione: lo stregone, non malevolo ma intrappolato, chiede di essere liberato.\n\n\"Non sono un nemico. Sono prigioniero dell'entità che ho evocato. Distruggi il cristallo — ma porta le mie note al villaggio. Che sappiano la verità.\"",
        effects: [
          { type: "xp", amount: 50, text: "+50 XP — la visione vi illumina" },
        ],
        next: "fine_buona",
      },

      "fine_buona": {
        id: "fine_buona",
        type: "ending",
        title: "Fine: La Torre Liberata",
        text: "Infrangete il cristallo. Un'onda di energia oscura esplode verso l'alto — poi tutto tace.\n\nAl villaggio di Pietrabianca le finestre si illuminano una ad una. Aldric vi aspetta sulla soglia con del vino e lacrime agli occhi.\n\n\"L'avete fatto. La torre è libera.\"\n\nNella nebbia che si dirada, la pietra della torre sembra già più chiara.",
        rewards: { xp: 200, gold: 100 },
        endingType: "good",
      },

      "fine_neutrale": {
        id: "fine_neutrale",
        type: "ending",
        title: "Fine: Il Cristallo Oscuro",
        text: "Il cristallo trema nella borsa durante la discesa. Al villaggio, Aldric lo guarda con un'espressione strana.\n\n\"Questo... non doveva lasciare la torre.\"\n\nChi lo ha preso sente un sussurro ogni notte. La torre è ancora in piedi — e il cristallo pulsa ancora.",
        rewards: { xp: 120, gold: 200 },
        endingType: "neutral",
      },

      "sconfitta": {
        id: "sconfitta",
        type: "ending",
        title: "Fine: La Ritirata",
        text: "Le ferite sono troppo gravi. Vi trascinate fuori dalla torre, sostenendovi a vicenda.\n\nAldric vi trova sul sentiero prima dell'alba. Non dice niente — vi porta dentro, scalda del brodo, aspetta.\n\nLa torre è ancora lì. Aspetta.",
        rewards: { xp: 30, gold: 0 },
        endingType: "fail",
      },
    },
  },

  // ─────────────────────────────────────────────────────────────
  // STORIA 2: Il Mercante di Menzogne
  // ─────────────────────────────────────────────────────────────
  {
    id: "storia_mercante",
    title: "Il Mercante di Menzogne",
    emoji: "🎭",
    description: "Un mercante carismatico vende oggetti straordinari lungo la via del commercio. Ma qualcosa nei suoi occhi non torna.",
    minLevel: 2,
    maxLevel: null,
    estDuration: "45–60 min",
    tags: ["mistero", "trappola", "scelte morali"],
    startChapter: "incontro",
    chapters: {

      "incontro": {
        id: "incontro",
        type: "narration",
        title: "Il Carro del Mercante",
        text: "Lungo la strada del commercio incontrate un carro dipinto di rosso e oro. Sul bordo, un uomo dai capelli bianchi e dagli occhi vivaci vi saluta con un inchino teatrale.\n\n\"Viaggiatori! Siete fortunati — ho esattamente ciò di cui avete bisogno. Tutto in vendita, tutto autentico... o quasi.\"\n\nRide da solo della sua battuta.",
        next: "offerta",
      },

      "offerta": {
        id: "offerta",
        type: "choice",
        title: "L'Offerta",
        text: "Il mercante apre il carro. Dentro: oggetti esotici, pozioni, pergamene. Una mappa disegnata su pelle indica un tesoro vicino. Un amuleto luccica di una luce strana.\n\n\"Tutto a prezzi onesti,\" dice. \"O posso offrirvi una storia invece. Gratis.\"\n\nCosa fate?",
        choices: [
          { text: "🗺️ Comprate la mappa del tesoro", next: "mappa" },
          { text: "📿 Esaminate l'amuleto strano", next: "amuleto" },
          { text: "👂 Ascoltate la sua storia gratuita", next: "storia_gratis" },
          { text: "🏃 Passate oltre senza fermarvi", next: "passate_oltre" },
        ],
      },

      "mappa": {
        id: "mappa",
        type: "event",
        title: "La Mappa Autentica?",
        text: "Pagate 30 oro per la mappa. Seguendola, trovate effettivamente qualcosa — ma non un tesoro. Una tomba, con dentro uno scheletro e un vecchio zaino.\n\nNello zaino: qualche moneta e una nota scritta in fretta: \"Non fidatevi del mercante.\"",
        effects: [
          { type: "gold", amount: -30, text: "–30 oro (costo della mappa)" },
          { type: "gold", amount: 18, text: "+18 oro dallo zaino nella tomba" },
          { type: "xp", amount: 15, text: "+15 XP" },
        ],
        next: "rivelazione",
      },

      "amuleto": {
        id: "amuleto",
        type: "event",
        title: "L'Amuleto Maledetto",
        text: "Toccate l'amuleto. Per un secondo vedete il vero volto del mercante — non umano, con occhi come fessure verticali.\n\nLui sorride come se nulla fosse. \"Interessante reazione. Non tutti lo vedono.\"\n\nL'amuleto vi scotta le dita ma non vi fa danno vero.",
        effects: [
          { type: "xp", amount: 30, text: "+30 XP — avete visto oltre l'illusione" },
        ],
        next: "rivelazione",
      },

      "storia_gratis": {
        id: "storia_gratis",
        type: "narration",
        title: "La Storia del Mercante",
        text: "Il mercante si siede sul predellino del carro e vi racconta di un re che aveva tutto tranne la verità. Di come la cercò per tutta la vita e come, quando la trovò, preferì non crederci.\n\n\"La morale?\" dice alla fine. \"La verità vale meno di una buona storia. Almeno la storia la puoi vendere.\"\n\nRide ancora. Questa volta anche voi sorridete — un po' a malincuore.",
        next: "rivelazione",
      },

      "passate_oltre": {
        id: "passate_oltre",
        type: "event",
        title: "La Saggezza del Dubbio",
        text: "Passate oltre senza fermarvi. Dopo un centinaio di metri sentite il mercante ridere alle vostre spalle.\n\nQuando vi girate, il carro non c'è più. Come se non fosse mai esistito.",
        effects: [
          { type: "xp", amount: 25, text: "+25 XP — a volte la prudenza è la scelta migliore" },
        ],
        next: "fine_prudente",
      },

      "rivelazione": {
        id: "rivelazione",
        type: "choice",
        title: "La Vera Natura",
        text: "Il mercante smette di sorridere. Per un momento il suo volto cambia — poi ritorna normale.\n\n\"Vedo che siete più svegli della media,\" dice in un tono diverso, più basso. \"Avete due opzioni: lasciatemi andare e vi darò qualcosa di valore. Oppure...\"\n\nLascia la frase sospesa.",
        choices: [
          { text: "🤝 Accettare l'accordo", next: "accordo" },
          { text: "⚔️ Attaccare il mercante", next: "battaglia_mercante" },
        ],
      },

      "accordo": {
        id: "accordo",
        type: "loot",
        title: "L'Accordo Strano",
        text: "Il mercante annuisce e apre un cassetto nascosto nel fondo del carro. Tira fuori una borsa di monete e una pergamena sigillata.\n\n\"La pergamena ha un valore che non capite ancora. Un giorno sì.\"\n\nDisappare in una folata di vento prima che possiate fare altre domande.",
        rewards: { xp: 60, gold: 80 },
        next: "fine_accordo",
      },

      "battaglia_mercante": {
        id: "battaglia_mercante",
        type: "battle",
        title: "Il Vero Volto",
        text: "Il mercante ride — e si trasforma. Non è umano. Mai lo è stato. La sua forma si distorce in qualcosa di oscuro e allungato, con dita come artigli.\n\n\"Ho incontrato pochi che hanno scelto questo,\" dice con una voce che sembra venire da sotto terra. \"Forse vale la pena di giocare.\"",
        monsters: [
          { id: "es_merc1", name: "Il Mercante", emoji: "🎭", hp: 55, max_hp: 55, atk: 9, def: 4, mag: 6, init: 9, xp: 130, gold: 120, isPlayer: false },
        ],
        next: "fine_battaglia_mercante",
        nextFail: "sconfitta_mercante",
      },

      "fine_battaglia_mercante": {
        id: "fine_battaglia_mercante",
        type: "ending",
        title: "Fine: La Creatura Sconfitta",
        text: "La creatura si dissolve in fumo scuro. Dal carro cadono tutte le sue merci — alcune autentiche, alcune illusorie che svaniscono al tocco.\n\nRestano però monete vere, e un libro con nomi e date: un registro di contratti con creature simili a lui.\n\nLo conservate. Potrebbe tornare utile.",
        rewards: { xp: 180, gold: 130 },
        endingType: "good",
      },

      "fine_accordo": {
        id: "fine_accordo",
        type: "ending",
        title: "Fine: L'Affare Fatto",
        text: "Guardate la pergamena per settimane senza capirne il contenuto. Poi, in una notte di luna piena, le parole si rivelano: una promessa di aiuto in un momento di grande pericolo.\n\nNon sapete quando arriverà quel momento. Ma sapete che arriverà.",
        rewards: { xp: 100, gold: 80 },
        endingType: "neutral",
      },

      "fine_prudente": {
        id: "fine_prudente",
        type: "ending",
        title: "Fine: La Via Sicura",
        text: "Non avete mai saputo chi fosse davvero il mercante. Forse era una trappola. Forse un test. Forse solo un vecchio eccentrico con un carro magico.\n\nContinuate il vostro viaggio, un po' più diffidenti di prima — e un po' più saggi.",
        rewards: { xp: 60, gold: 0 },
        endingType: "neutral",
      },

      "sconfitta_mercante": {
        id: "sconfitta_mercante",
        type: "ending",
        title: "Fine: Il Prezzo dell'Arroganza",
        text: "La creatura vi lascia andare — quasi delusa. \"Non eravate abbastanza divertenti,\" dice sopra di voi mentre vi rialzate a fatica.\n\nIl carro sparisce. Restate sul bordo della strada, ammaccati e silenziosi.\n\nAlcune battaglie non si combattono con la spada.",
        rewards: { xp: 25, gold: 0 },
        endingType: "fail",
      },
    },
  },

];
