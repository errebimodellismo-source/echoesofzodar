// Generate 220 quests and append to questsData.js
const fs = require('fs');
const path = 'c:/Users/roppo/echoesofzodar/src/data/questsData.js';

// Deterministic PRNG
let _s = 12345;
function rnd() { _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 0xFFFFFFFF; }
function ri(a, b) { return Math.floor(rnd() * (b - a + 1)) + a; }
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }

const themes = [
  { name: "Bosco", places: ["Bosco Sussurrante","Foresta di Velrand","Macchia Antica","Selva di Thalor","Bosco delle Ombre","Foresta Smeraldina"],
    monsters: [["Lupo Fameliço","🐺"],["Orso Bruno","🐻"],["Ragno Gigante","🕷️"],["Goblin Esploratore","👹"],["Driade Corrotta","🌳"],["Cinghiale Selvaggio","🐗"],["Falco Nero","🦅"]],
    bosses: [["Re dei Lupi","🐺"],["Antico Treant","🌲"],["Strega della Foresta","🧙‍♀️"]],
    npcs: ["il Vecchio Guardacaccia","la Druidessa Mira","il Ranger Aldric"] },
  { name: "Palude", places: ["Palude di Murthak","Acquitrini di Gorm","Palude Verminosa","Acque Stagnanti"],
    monsters: [["Rospo Velenoso","🐸"],["Serpente di Palude","🐍"],["Lucertolone","🦎"],["Sciame di Insetti","🦟"],["Hag della Palude","🧙‍♀️"]],
    bosses: [["Idra di Palude","🐉"],["Lich Paludoso","💀"],["Re Rospo","🐸"]],
    npcs: ["lo Sciamano Krodok","la Pescatrice Lila","l'Eremita Borak"] },
  { name: "Città", places: ["Veridia","Porto Stellato","Granduca","Quartiere Basso di Korvane","Piazza dei Mercanti"],
    monsters: [["Ladro","🗡️"],["Sicario","🥷"],["Guardia Corrotta","💂"],["Brigante","🏴‍☠️"],["Mago Rinnegato","🧙"]],
    bosses: [["Boss della Gilda","🎭"],["Spettro del Sindaco","👻"],["Re dei Ladri","👑"]],
    npcs: ["il Capitano Renart","la Spia Selene","il Mercante Doriano"] },
  { name: "Dungeon", places: ["Cripte di Maldur","Catacombe di Argos","Segrete di Pietranera","Sotterranei Dimenticati"],
    monsters: [["Scheletro Guerriero","💀"],["Zombi","🧟"],["Ghoul","👹"],["Spettro","👻"],["Wraith","👁️"]],
    bosses: [["Necromante Antico","🧙‍♂️"],["Cavaliere della Morte","⚔️"],["Lich Eterno","💀"]],
    npcs: ["l'Archeologo Vandros","la Sacerdotessa Elen","il Saccheggiatore Krad"] },
  { name: "Mare", places: ["Costa Frangente","Isole dei Naufraghi","Mare di Smeraldo","Scogliere di Tharn"],
    monsters: [["Pirata","🏴‍☠️"],["Sirena Maligna","🧜‍♀️"],["Squalo Spada","🦈"],["Kraken Giovane","🐙"],["Marinaio Spettrale","👻"]],
    bosses: [["Capitano Barbanera","🏴‍☠️"],["Kraken Antico","🐙"],["Leviatano","🐋"]],
    npcs: ["il Capitano Salgari","la Sirena Maris","il Vecchio Marinaio"] },
  { name: "Deserto", places: ["Dune di Saharath","Oasi Perduta","Sabbie Bruciate","Tempio di Ra-Khem"],
    monsters: [["Sciacallo","🐺"],["Scorpione Gigante","🦂"],["Predone del Deserto","🗡️"],["Mummia","🧟"],["Sfinge Minore","🦁"]],
    bosses: [["Faraone Non-Morto","⚱️"],["Verme delle Sabbie","🐛"],["Genio Maledetto","🧞"]],
    npcs: ["il Carovaniere Hassan","la Sacerdotessa di Ra","il Beduino Omar"] },
  { name: "Montagna", places: ["Picchi di Ghiaccio","Monte Drago","Catena di Vorndal","Vette Eterne"],
    monsters: [["Yeti","🦍"],["Aquila Gigante","🦅"],["Troll di Montagna","👹"],["Lupo di Ghiaccio","🐺"],["Gigante di Pietra","🗿"]],
    bosses: [["Drago Bianco","🐉"],["Re dei Giganti","🗿"],["Yeti Alpha","🦍"]],
    npcs: ["lo Scalatore Bjorn","la Strega della Montagna","l'Eremita Tarn"] },
  { name: "Regno Fatato", places: ["Corte Estiva","Bosco delle Fate","Radura Argentea","Regno di Titania"],
    monsters: [["Folletto Dispettoso","🧚"],["Satiro","🐐"],["Unicorno Oscuro","🦄"],["Pixie Maligna","🧚‍♀️"],["Centauro Ribelle","🏹"]],
    bosses: [["Regina Maligna","👸"],["Re Oberon","🤴"],["Lord dei Boschi","🌳"]],
    npcs: ["la Fata Lily","il Bardo Cyril","il Druido Faelan"] },
  { name: "Piano Infernale", places: ["Abisso di Khaal","Pozzo di Lava","Cittadella di Bael","Inferno Cremisi"],
    monsters: [["Imp","😈"],["Demone Minore","👹"],["Cane Infernale","🐕"],["Cultista","🔥"],["Diavolo Spinato","😈"]],
    bosses: [["Arcidemone","👹"],["Signore dell'Inferno","😈"],["Balrog","🔥"]],
    npcs: ["il Cacciatore di Demoni","la Paladina Iris","il Mago Vargo"] },
  { name: "Rovine", places: ["Rovine di Eldoria","Tempio Caduto","Città Sommersa","Antica Forgia Nanica"],
    monsters: [["Golem di Pietra","🗿"],["Costrutto Arcano","⚙️"],["Statua Animata","🗿"],["Guardiano Spettrale","👻"]],
    bosses: [["Sentinella Eterna","🗿"],["Spirito dell'Antichità","👻"],["Re Dimenticato","👑"]],
    npcs: ["l'Esploratore Tobias","la Storica Mirella","il Saggio Velnar"] },
  { name: "Nave Pirata", places: ["Vascello Insanguinato","Galeone Fantasma","Caravella dei Dannati"],
    monsters: [["Pirata Veterano","🏴‍☠️"],["Marinaio Brutto","🗡️"],["Mozzo Posseduto","👻"],["Bombardiere","💣"]],
    bosses: [["Capitano Mortenero","💀"],["Quartiermastro Demone","👹"]],
    npcs: ["il Mozzo Tim","la Cartografa Lina","il Vecchio Ammiraglio"] },
  { name: "Fortezza Orca", places: ["Roccaforte di Grumsh","Forte Sangue","Bastione Verde"],
    monsters: [["Orco Guerriero","👹"],["Orco Sciamano","🧙"],["Lupo da Guerra","🐺"],["Ogre","👹"]],
    bosses: [["Warchief Brog","💪"],["Re Orco Gruul","👑"]],
    npcs: ["il Disertore Orco Zog","la Mercenaria Kira","il Cacciatore Dorn"] },
  { name: "Tempio Maledetto", places: ["Tempio di Zogath","Santuario Profano","Altare di Sangue"],
    monsters: [["Cultista Folle","🔪"],["Aberrazione","🐙"],["Sacerdote Corrotto","🕯️"],["Servo Mutato","👁️"]],
    bosses: [["Sommo Cultista","🩸"],["Avatar di Zogath","👁️‍🗨️"]],
    npcs: ["il Sacerdote Pentito","la Paladina Mara","l'Inquisitore Vex"] },
  { name: "Laboratorio Alchemico", places: ["Torre di Zarathos","Laboratorio Segreto","Officina Arcana"],
    monsters: [["Omuncolo","🧪"],["Costrutto Carnoso","🥩"],["Apprendista Folle","🧙"],["Esperimento Fallito","🐀"]],
    bosses: [["Alchimista Pazzo","⚗️"],["Aberrazione Suprema","👁️"]],
    npcs: ["l'Apprendista Pia","il Mago Veridian","l'Investigatore Crane"] },
];

const diffPool = [
  ...Array(70).fill("facile"),
  ...Array(80).fill("medio"),
  ...Array(50).fill("difficile"),
  ...Array(20).fill("epica"),
];
// Shuffle
for (let i = diffPool.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [diffPool[i], diffPool[j]] = [diffPool[j], diffPool[i]];
}

const lootItems = ["Pozione di Cura","Pozione di Mana","Antidoto","Pergamena Arcana","Anello d'Argento","Amuleto del Sole","Gemma Lucente","Cristallo di Energia","Spada Affilata","Ascia Pesante","Arco Lungo","Pugnale Avvelenato","Bastone Runico","Scudo di Ferro","Elmo Rinforzato","Stivali Veloci","Mantello dell'Ombra","Guanti di Forza","Cintura di Resistenza","Reliquia Sacra","Tomo Antico","Mappa del Tesoro"];

function mkMonster(id, name, emoji, tier, isBoss) {
  let hp, atk, def, xp;
  if (isBoss) {
    if (tier === "epica") { hp = ri(300, 600); atk = ri(30, 50); def = ri(12, 20); xp = ri(180, 400); }
    else if (tier === "difficile") { hp = ri(180, 280); atk = ri(22, 32); def = ri(10, 16); xp = ri(120, 200); }
    else if (tier === "medio") { hp = ri(100, 160); atk = ri(15, 22); def = ri(6, 10); xp = ri(70, 120); }
    else { hp = ri(50, 80); atk = ri(9, 13); def = ri(3, 6); xp = ri(35, 60); }
  } else {
    if (tier === "epica") { hp = ri(80, 150); atk = ri(18, 28); def = ri(8, 14); xp = ri(60, 100); }
    else if (tier === "difficile") { hp = ri(100, 200); atk = ri(18, 28); def = ri(8, 14); xp = ri(55, 95); }
    else if (tier === "medio") { hp = ri(50, 120); atk = ri(10, 18); def = ri(4, 8); xp = ri(30, 55); }
    else { hp = ri(20, 50); atk = ri(5, 10); def = ri(1, 4); xp = ri(12, 28); }
  }
  return { id, name, emoji, hp, maxHp: hp, atk, def, xp, isBoss };
}

function mkChoice(diff) {
  const goodXp = diff === "epica" ? ri(40, 70) : diff === "difficile" ? ri(25, 45) : diff === "medio" ? ri(15, 25) : ri(8, 18);
  const goodG = Math.floor(goodXp * 0.5);
  const choiceTexts = [
    ["✅ Affronta la verità con onore", "🟡 Procedi con cautela", "❌ Volta le spalle e fuggi"],
    ["✅ Aiuta i deboli senza esitare", "🟡 Chiedi una ricompensa prima", "❌ Ignora le loro suppliche"],
    ["✅ Studia attentamente la situazione", "🟡 Agisci d'istinto", "❌ Distruggi tutto in preda alla rabbia"],
    ["✅ Negozia con saggezza", "🟡 Offri un piccolo dono", "❌ Minaccia con la forza"],
    ["✅ Cerca un'altra via", "🟡 Sfonda la porta", "❌ Urla per farti aprire"],
    ["✅ Risolvi l'enigma con logica", "🟡 Tira a indovinare", "❌ Rompi il meccanismo"],
    ["✅ Lascia in pace l'antico spirito", "🟡 Parla con rispetto", "❌ Profanare il sepolcro"],
    ["✅ Aiuta i feriti prima di proseguire", "🟡 Lascia loro una pozione", "❌ Passa oltre senza guardare"],
  ];
  const c = pick(choiceTexts);
  return {
    type: "choice",
    text: pick([
      "Davanti a te si presenta una scelta cruciale.",
      "Un bivio morale ti mette alla prova.",
      "Devi decidere rapidamente come agire.",
      "Una decisione difficile pesa sulle tue spalle.",
      "Il destino di molti dipende da questa scelta.",
    ]),
    choices: [
      { label: c[0], xp: goodXp, gold: goodG, quality: "good" },
      { label: c[1], xp: Math.floor(goodXp/2), gold: Math.floor(goodG/2), quality: "neutral" },
      { label: c[2], xp: 0, gold: 0, quality: "bad" },
    ],
  };
}

const narrTexts = [
  "Il vento porta echi di un passato dimenticato mentre avanzi tra le ombre.",
  "Il sentiero si snoda incerto, costellato di segni inquietanti.",
  "Una sensazione opprimente ti accompagna ad ogni passo.",
  "Le ombre si allungano e i sussurri si fanno più nitidi.",
  "Il silenzio è rotto solo dal battito del tuo cuore.",
  "Antichi simboli incisi nella pietra raccontano storie perdute.",
  "L'aria si fa pesante, carica di magia residua.",
  "Tracce recenti suggeriscono che non sei il primo a passare di qui.",
  "Una luce fioca brilla in lontananza, invitante e minacciosa al tempo stesso.",
  "Il terreno trema sotto i tuoi piedi, qualcosa di grosso si avvicina.",
];

function genQuest(idx) {
  const id = "dq" + (idx + 28);
  const diff = diffPool[idx];
  const theme = pick(themes);
  const place = pick(theme.places);
  const npc = pick(theme.npcs);

  let xpReward, goldReward, numSteps;
  if (diff === "epica") { xpReward = ri(1000, 2500); goldReward = ri(500, 1200); numSteps = ri(4, 6); }
  else if (diff === "difficile") { xpReward = ri(500, 900); goldReward = ri(200, 400); numSteps = ri(5, 6); }
  else if (diff === "medio") { xpReward = ri(250, 450); goldReward = ri(100, 180); numSteps = ri(4, 5); }
  else { xpReward = ri(100, 200); goldReward = ri(40, 80); numSteps = ri(3, 4); }

  const titlePrefixes = ["Il Mistero","La Caccia","L'Ombra","Il Segreto","La Maledizione","L'Eco","Il Patto","La Vendetta","Il Risveglio","La Profezia","L'Ultimo","La Tomba","Il Tradimento","La Discesa","L'Assedio"];
  const title = `${pick(titlePrefixes)} di ${place}`;

  const flavors = [
    `«Pochi tornano da ${place}.» — ${npc}`,
    `«Ho visto cose che non oso descrivere.» — ${npc}`,
    `«Il male si annida dove meno te lo aspetti.» — ${npc}`,
    `«Solo i coraggiosi sopravvivono a ${place}.» — ${npc}`,
    `«Non fidarti di nulla, in quei luoghi.» — ${npc}`,
  ];

  const desc = `Indaga su strani eventi a ${place}. ${npc} ti ha chiesto aiuto urgente.`;

  const steps = [];
  const enemies = [];
  let monsterCounter = 0;
  let hasCombat = false, hasChoice = false;

  // First step always narrative
  steps.push({ type: "narrative", text: `${pick(narrTexts)} ${npc} ti ha avvisato dei pericoli di ${place}.` });

  // Middle steps
  const stepTypes = [];
  for (let i = 0; i < numSteps - 2; i++) {
    if (i === 0) stepTypes.push("choice");
    else if (i === 1) stepTypes.push("combat");
    else stepTypes.push(pick(["combat", "narrative", "choice"]));
  }
  if (!stepTypes.includes("combat")) stepTypes[stepTypes.length - 1] = "combat";
  if (!stepTypes.includes("choice")) stepTypes[0] = "choice";

  for (const st of stepTypes) {
    if (st === "choice") { steps.push(mkChoice(diff)); hasChoice = true; }
    else if (st === "combat") {
      const numMon = diff === "epica" ? ri(2, 3) : diff === "difficile" ? ri(2, 3) : diff === "medio" ? ri(1, 2) : ri(1, 2);
      const mons = [];
      for (let m = 0; m < numMon; m++) {
        monsterCounter++;
        const [mn, me] = pick(theme.monsters);
        const mon = mkMonster(`${id}_m${monsterCounter}`, mn, me, diff, false);
        mons.push(mon); enemies.push(mon);
      }
      steps.push({ type: "combat", text: `Nemici emergono dalle ombre di ${place}!`, monsters: mons });
      hasCombat = true;
    } else {
      steps.push({ type: "narrative", text: pick(narrTexts) });
    }
  }

  // Final combat with boss for difficile/epica
  if (diff === "epica" || diff === "difficile") {
    monsterCounter++;
    const [bn, be] = pick(theme.bosses);
    const boss = mkMonster(`${id}_boss`, bn, be, diff, true);
    enemies.push(boss);
    steps.push({ type: "combat", text: `${bn} appare in tutto il suo terrore!`, monsters: [boss] });
  }

  // Last step: loot
  const numItems = diff === "epica" ? 4 : diff === "difficile" ? 3 : 2;
  const items = [];
  for (let i = 0; i < numItems; i++) items.push(pick(lootItems));
  const goldMin = Math.floor(goldReward * 0.2), goldMax = Math.floor(goldReward * 0.5);
  steps.push({ type: "loot", text: `Hai trionfato a ${place}! Il bottino è tuo.`, loot: { gold: [goldMin, goldMax], items } });

  return { id, title, desc, flavor: pick(flavors), difficulty: diff, xpReward, goldReward, steps, enemies };
}

function fmt(q) {
  const stepsStr = q.steps.map(s => {
    if (s.type === "narrative") return `      { type:"narrative", text:${JSON.stringify(s.text)} }`;
    if (s.type === "choice") {
      const ch = s.choices.map(c => `        { label:${JSON.stringify(c.label)}, xp:${c.xp}, gold:${c.gold}, quality:${JSON.stringify(c.quality)} }`).join(",\n");
      return `      {\n        type:"choice",\n        text:${JSON.stringify(s.text)},\n        choices:[\n${ch}\n        ]\n      }`;
    }
    if (s.type === "combat") {
      const ms = s.monsters.map(m => `          {id:${JSON.stringify(m.id)},name:${JSON.stringify(m.name)},emoji:${JSON.stringify(m.emoji)},hp:${m.hp},maxHp:${m.maxHp},atk:${m.atk},def:${m.def},xp:${m.xp},isBoss:${m.isBoss}}`).join(",\n");
      return `      {\n        type:"combat",\n        text:${JSON.stringify(s.text)},\n        monsters:[\n${ms}\n        ]\n      }`;
    }
    if (s.type === "loot") {
      const items = s.loot.items.map(i => JSON.stringify(i)).join(",");
      return `      {\n        type:"loot",\n        text:${JSON.stringify(s.text)},\n        loot:{ gold:[${s.loot.gold[0]},${s.loot.gold[1]}], items:[${items}] }\n      }`;
    }
    return "";
  }).join(",\n");

  const enStr = q.enemies.map(m => `      {id:${JSON.stringify(m.id)},name:${JSON.stringify(m.name)},emoji:${JSON.stringify(m.emoji)},hp:${m.hp},maxHp:${m.maxHp},atk:${m.atk},def:${m.def},xp:${m.xp},isBoss:${m.isBoss}}`).join(",\n");

  return `  {
    id:${JSON.stringify(q.id)}, title:${JSON.stringify(q.title)}, active:true,
    desc:${JSON.stringify(q.desc)},
    flavor:${JSON.stringify(q.flavor)},
    difficulty:${JSON.stringify(q.difficulty)},
    xpReward:${q.xpReward}, goldReward:${q.goldReward},
    steps:[
${stepsStr}
    ],
    enemies:[
${enStr}
    ],
  }`;
}

const quests = [];
for (let i = 0; i < 220; i++) quests.push(genQuest(i));
const out = quests.map(fmt).join(",\n");

let content = fs.readFileSync(path, 'utf8');
// Replace the final "  }\n];" — find last occurrence
const nl = content.includes("\r\n") ? "\r\n" : "\n";
const needle = "  }" + nl + "];";
const lastIdx = content.lastIndexOf(needle);
if (lastIdx === -1) { console.error("END NOT FOUND"); process.exit(1); }
const newContent = content.substring(0, lastIdx) + "  }," + nl + out.replace(/\n/g, nl) + nl + "];" + nl;
fs.writeFileSync(path, newContent, 'utf8');
console.log("OK, wrote " + quests.length + " quests");
