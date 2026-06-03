// Genera PNG AI per ogni item wearable — stile dark fantasy, già posizionato sul corpo.
// Output: public/assets/items-v2/wear/{id}.png (sostituisce SVG)
// Uso: node scripts/generate-item-wear-ai.mjs [--slot=weapon] [--id=xxx] [--apply] [--dry]

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { DEFAULT_ITEMS } from "../src/data/itemsData.js";

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.length ? v.join("=") : true];
  })
);

function readDotEnvValue(name) {
  const envPath = path.resolve(".env");
  if (!fs.existsSync(envPath)) return "";
  const line = fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find(r => r.trim().startsWith(`${name}=`));
  return line ? line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") : "";
}

const API_KEY   = process.env.OPENAI_API_KEY || readDotEnvValue("OPENAI_API_KEY");
const MODEL     = String(args.model   || "gpt-image-1");
const QUALITY   = String(args.quality || "medium");
const SIZE      = "1024x1536";  // 2:3 ratio = stessa proporzione del mannequin
const ONLY_SLOT = args.slot ? String(args.slot) : null;
const ONLY_ID   = args.id   ? String(args.id)   : null;
const APPLY     = args.apply === true || args.apply === "true";
const OVERWRITE = args.overwrite === true || args.overwrite === "true";
const DRY       = args.dry   === true || args.dry   === "true";
const DELAY_MS  = Number(args.delay || 1200);

const REVIEW_DIR = path.resolve("tmp/generated-item-wear");
const LIVE_DIR   = path.resolve("public/assets/items-v2/wear");
const OUT_DIR    = APPLY ? LIVE_DIR : REVIEW_DIR;
fs.mkdirSync(OUT_DIR, { recursive: true });

if (!API_KEY && !DRY) {
  console.error("OPENAI_API_KEY mancante — impostalo in .env");
  process.exit(1);
}

// ── Slot risoluzione ─────────────────────────────────────────────────────────
function resolveSlot(item) {
  const s = item.slot || "";
  if (s === "armor" || item.type === "armor") return "chest";
  if (s === "shield" || item.type === "shield") return "offhand";
  if (s === "accessory" || item.type === "accessory") return "amulet";
  if (item.type === "weapon" || item.weapon_die) return "weapon";
  if (["weapon","offhand","head","chest","legs","boots","gloves","ring1","ring2","amulet","cloak"].includes(s)) return s;
  if (item.type === "potion") return null;
  return null;
}

function resolveGlyph(item) {
  const key = `${item.id || ""} ${item.name || ""}`.toLowerCase();
  if (/crossbow|balestra|ballista/i.test(key)) return "crossbow";
  if (/bow|arco/i.test(key)) return "bow";
  if (/spear|lancia|halberd|alabarda|glaive/i.test(key)) return "spear";
  if (/axe|ascia|hatchet/i.test(key)) return "axe";
  if (/mace|mazza|hammer|martello|club|randello/i.test(key)) return "mace";
  if (/dagger|pugnale|knife/i.test(key)) return "dagger";
  if (/staff|bastone|wand|bacchetta/i.test(key)) return "staff";
  if (/grimoire|grimorio|tome|tomo|book|libro/i.test(key)) return "book";
  if (/orb|sfera|crystal|sintonia/i.test(key)) return "orb";
  if (/shield|scudo/i.test(key)) return "shield";
  if (/sword|spada|blade|lama|rapier|falchion|cutlass|claymore/i.test(key)) return "sword";
  return "sword";
}

function isMaterial(item, type) {
  const k = `${item.id || ""} ${item.name || ""}`.toLowerCase();
  if (type === "leather") return /leather|cuoio|hide|briar|mosshide|scout|hunter|fur/i.test(k);
  if (type === "cloth")   return /robe|cloth|silk|linen|mantle|tunica|lana|tela/i.test(k);
  if (type === "gold")    return item.rarity === "legendary" || item.rarity === "mythic" || /gold|oro|auric|solar|titano|zodar/i.test(k);
  if (type === "dark")    return /shadow|dark|void|night|black|death|obsidian|cursed|infernal/i.test(k);
  return false;
}

function materialDesc(item) {
  if (isMaterial(item, "gold"))    return "gleaming gold and jewelled";
  if (isMaterial(item, "dark"))    return "dark obsidian and shadow-forged";
  if (isMaterial(item, "leather")) return "hardened leather and riveted";
  if (isMaterial(item, "cloth"))   return "enchanted cloth and embroidered";
  if (item.rarity === "epic")      return "deep purple arcane-infused";
  if (item.rarity === "rare")      return "fine steel and blue-glowing";
  return "iron and aged steel";
}

function rarityAdj(rarity) {
  return { common:"simple worn", uncommon:"well-crafted", rare:"masterwork glowing", epic:"legendary dark arcane", legendary:"divine radiant mythic", mythic:"cosmic reality-bending" }[rarity] || "fantasy";
}

// ── Prompts per slot ─────────────────────────────────────────────────────────
// Layout 1024×1536 (2:3). Corpo: testa top 9%, piedi bottom 4%.
// Mano dx personaggio (= SX canvas) a ~60% altezza.
function buildPrompt(item, slot, glyph) {
  const rAdj = rarityAdj(item.rarity);
  const mat  = materialDesc(item);
  const name = item.name || item.id;
  const BG   = "solid chroma-green #00ff00 background everywhere outside the item";

  const prompts = {
    weapon: {
      sword:     `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} straight sword, "${name}", held by a leather-gloved hand on the LEFT side of the canvas (the character's right hand). Grip centered at 62% height, blade pointing straight upward, blade tip at 26% height. Detailed fantasy craftsmanship, rune engravings on blade, ornate crossguard. ${BG}. No body. No background scenery. Only the sword and gloved hand. Style: Diablo 4 / Path of Exile equipment render, dramatic top-down rim lighting, ultra-detailed.`,
      dagger:    `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} dagger, "${name}", held by a leather-gloved hand on the LEFT side of the canvas. Grip at 65% height, blade pointing up to 50% height. Compact deadly design. ${BG}. No body. Ultra-detailed game art.`,
      axe:       `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} axe, "${name}", held by a gloved hand on the LEFT side of the canvas. Grip at 62% height, axe head at top (28% height). Brutal dark fantasy design, sharp curved blade. ${BG}. No body. Diablo 4 art style.`,
      mace:      `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} mace or warhammer, "${name}", held by a gloved hand on the LEFT side of the canvas. Grip at 62% height, heavy flanged head at 22% height. ${BG}. No body. Ultra-detailed game render.`,
      spear:     `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} spear or halberd, "${name}", held upright by a gloved hand on the LEFT side of the canvas. Grip at 60% height, spear tip at top 10% height, butt at 66% height. ${BG}. No body. Detailed game art.`,
      bow:       `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} longbow, "${name}", held by a gloved hand on the LEFT side of the canvas. Bow center grip at 60% height, bow limbs spanning from 24% to 84% height, elegant curve to the left. Strung taut. ${BG}. No body. Diablo 4 style render.`,
      crossbow:  `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} crossbow, "${name}", held horizontally by a gloved hand at 60% height on the LEFT side of the canvas. Stock pointing right, bolt nocked. ${BG}. No body. Ultra-detailed.`,
      staff:     `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} magical staff, "${name}", held upright by a gloved hand on the LEFT side of the canvas. Grip at 62% height, glowing crystal or orb at top (12% height). Arcane runes along shaft. ${BG}. No body. Diablo 4 / PoE style.`,
      book:      `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} grimoire or spellbook, "${name}", held open by a gloved hand on the LEFT side of the canvas at 58% height. Ancient leather cover, glowing magical pages. ${BG}. No body.`,
      orb:       `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} magical orb or crystal, "${name}", cradled in a gloved hand on the LEFT side of the canvas at 60% height. Swirling arcane energy inside the sphere. ${BG}. No body.`,
    },
    offhand: `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} shield or offhand item, "${name}", held by a gauntleted hand on the RIGHT side of the canvas (character's left arm). Shield face centered at x=75%, y=45% height. Occupies right half of canvas from 18% to 66% height. Detailed heraldry, battle-worn surface. ${BG}. No body. Diablo 4 render style.`,
    head:    `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} helmet or headgear, "${name}", worn on an unseen head at the TOP of the canvas. Helm centered horizontally, occupying top 22% of canvas, y=5% to y=22%. No face visible, just the helm. Detailed ornate design, visor slit, side plumes or horns if fitting. ${BG} below the helm. Ultra-detailed RPG game render.`,
    chest:   `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} chest armor, "${name}", worn on an unseen torso. Centered horizontally, occupying y=19% to y=53% height. Shows both pauldrons at y=19%-28%, full breastplate, belt at bottom. No head, no legs visible. Detailed rivets, engravings, glowing runes. ${BG} everywhere else. Diablo 4 style ultra-detailed render.`,
    legs:    `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} leg armor or greaves, "${name}", worn on unseen legs. Centered horizontally, occupying y=51% to y=87% height. Shows both cuisses and greaves, knee guards, no boots, no torso. ${BG} everywhere else. Ultra-detailed dark fantasy RPG render.`,
    boots:   `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} boots or sabatons, "${name}", worn on unseen feet. Centered horizontally at BOTTOM of canvas, occupying y=85% to y=97% height. Both boots visible side by side. Detailed soles, buckles, clasps. ${BG} above. Diablo 4 render.`,
    gloves:  `Dark fantasy RPG equipment overlay. A pair of ${rAdj} ${mat} gauntlets or gloves, "${name}". LEFT glove on LEFT side of canvas (x=8%-32%, y=57%-67%). RIGHT glove on RIGHT side (x=68%-92%, y=57%-67%). Both hands open/relaxed. No arms. ${BG} everywhere else. Ultra-detailed RPG game render.`,
    cloak:   `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} flowing cloak or cape, "${name}", draped on an unseen body. Collar at y=18%, fabric flowing down to y=96%, spreading wide (x=10% to x=90%). Rich folds, inner lining visible at edges. ${BG} behind the cloak. Diablo 4 render style.`,
    amulet:  `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} amulet or necklace, "${name}", hanging on an unseen neck. Chain visible from y=19% to y=27%, pendant centered at x=50%, y=28%-35%. Ornate jeweled pendant design. ${BG} everywhere else. Ultra-detailed game render.`,
    ring1:   `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} ring, "${name}", on a gloved finger. Ring centered at LEFT side: x=11%, y=62%. Jewel and engravings clearly visible. ${BG} everywhere else. Diablo 4 render.`,
    ring2:   `Dark fantasy RPG equipment overlay. A ${rAdj} ${mat} ring, "${name}", on a gloved finger. Ring centered at RIGHT side: x=89%, y=62%. Jewel and engravings clearly visible. ${BG} everywhere else. Diablo 4 render.`,
  };

  if (slot === "weapon") return (prompts.weapon[glyph] || prompts.weapon.sword);
  return prompts[slot] || prompts.amulet;
}

// ── API ──────────────────────────────────────────────────────────────────────
function callImageAPI(prompt) {
  const body = JSON.stringify({ model:MODEL, prompt, n:1, size:SIZE, quality:QUALITY });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname:"api.openai.com", path:"/v1/images/generations", method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${API_KEY}`, "Content-Length":Buffer.byteLength(body) },
    }, res => {
      let data = "";
      res.on("data", c => { data += c; });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.error) { reject(new Error(json.error.message)); return; }
          const b64 = json.data?.[0]?.b64_json;
          if (!b64) { reject(new Error("Nessuna immagine restituita")); return; }
          resolve(b64);
        } catch(e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Task list ────────────────────────────────────────────────────────────────
const allItems = [
  ...DEFAULT_ITEMS,
  // Leggendari extra (non in DEFAULT_ITEMS)
  {id:"leg_excalibur",    name:"Excalibur",           type:"weapon", slot:"weapon", rarity:"legendary"},
  {id:"leg_vorpal",       name:"Lama Vorpal",          type:"weapon", slot:"weapon", rarity:"legendary"},
  {id:"leg_frostbrand",   name:"Frostbrand",           type:"weapon", slot:"weapon", rarity:"legendary"},
  {id:"leg_flamebrand",   name:"Spada di Fuoco",       type:"weapon", slot:"weapon", rarity:"legendary"},
  {id:"leg_moonbow",      name:"Arco della Luna",      type:"weapon", slot:"weapon", rarity:"legendary"},
  {id:"leg_thunderhammer",name:"Martello del Tuono",   type:"weapon", slot:"weapon", rarity:"legendary"},
  {id:"leg_dragonscale",  name:"Armatura del Drago",   type:"armor",  slot:"chest",  rarity:"legendary"},
  {id:"leg_aegis",        name:"Egida degli Dei",      type:"armor",  slot:"chest",  rarity:"legendary"},
  {id:"leg_shadowcloak",  name:"Mantello d'Ombra",     type:"armor",  slot:"cloak",  rarity:"legendary"},
  {id:"leg_titanplate",   name:"Armatura Titanica",    type:"armor",  slot:"chest",  rarity:"legendary"},
  {id:"leg_zodar_sword",  name:"Spada di Zodar",       type:"weapon", slot:"weapon", rarity:"mythic"},
  {id:"leg_zodar_armor",  name:"Armatura di Zodar",    type:"armor",  slot:"chest",  rarity:"mythic"},
];

const tasks = allItems
  .filter(item => {
    const slot = resolveSlot(item);
    if (!slot) return false;
    if (ONLY_SLOT && slot !== ONLY_SLOT) return false;
    if (ONLY_ID   && item.id !== ONLY_ID) return false;
    return true;
  })
  .map(item => ({
    item,
    slot:  resolveSlot(item),
    glyph: resolveGlyph(item),
    outFile: path.join(OUT_DIR, `${item.id}.png`),
  }));

console.log(`\n📦 Item wear AI generator`);
console.log(`Modello: ${MODEL} | Qualità: ${QUALITY} | Output: ${APPLY ? "LIVE" : "REVIEW"}`);
console.log(`Task totali: ${tasks.length}${ONLY_SLOT ? ` (slot: ${ONLY_SLOT})` : ""}${ONLY_ID ? ` (id: ${ONLY_ID})` : ""}\n`);

if (DRY) {
  tasks.forEach(t => console.log(`  [DRY] ${t.item.id} (${t.slot}/${t.glyph})`));
  process.exit(0);
}

let done = 0, skipped = 0, errors = 0;

for (const { item, slot, glyph, outFile } of tasks) {
  if (!OVERWRITE && fs.existsSync(outFile)) {
    console.log(`  ⏭  ${item.id} (già presente)`);
    skipped++;
    continue;
  }
  const prompt = buildPrompt(item, slot, glyph);
  process.stdout.write(`  🎨 ${item.id} (${slot}/${glyph})... `);
  try {
    const b64 = await callImageAPI(prompt);
    fs.writeFileSync(outFile, Buffer.from(b64, "base64"));
    done++;
    console.log(`✅`);
  } catch(e) {
    errors++;
    console.log(`❌ ${e.message}`);
  }
  if (done + errors < tasks.length) await new Promise(r => setTimeout(r, DELAY_MS));
}

console.log(`\n✅ Completati: ${done} | ⏭  Saltati: ${skipped} | ❌ Errori: ${errors}`);
console.log(APPLY
  ? `\nFile salvati in: public/assets/items-v2/wear/`
  : `\nFile in review: tmp/generated-item-wear/\nReview e poi ri-esegui con --apply per applicare.`);
