import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "src", "data", "monstersData.js");
const OUT_DIR = path.join(ROOT, "public", "assets", "monsters");
const OUT_FILE = path.join(OUT_DIR, "monster-image-prompts.json");

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tierFor(monster) {
  if (monster.isBoss || Number(monster.xp) >= 120) return "boss";
  if (Number(monster.xp) >= 75) return "hard";
  if (Number(monster.xp) >= 30) return "mid";
  return "base";
}

function backdropFor(monster, key) {
  if (/drago|dragon|viverna|wyvern/.test(key)) return "ancient volcanic ruins, storm clouds, glowing embers";
  if (/scheletro|zombie|ghoul|mummia|lich|spettro|fantasma|wraith|vampir|non morto|teschio/.test(key)) return "haunted crypt, cold mist, broken tombstones";
  if (/demone|diavolo|infernal|balor|pit fiend|succubo|cambion/.test(key)) return "infernal battlefield, red smoke, molten cracks";
  if (/golem|guardiano|titano|costrutto|runico|colosso/.test(key)) return "ancient dungeon hall, carved stone, runic light";
  if (/mare|sahuagin|kraken|acqua|merrow|aboleth/.test(key)) return "dark coastal ruins, crashing water, bioluminescent mist";
  if (/lupo|orso|ragno|serpente|bestia|cinghiale|rana|pipistrello|manticora|griffone|pegaso|roc/.test(key)) return "wild fantasy wilderness, dramatic moonlight, wind and dust";
  if (/goblin|orco|coboldo|gnoll|hobgoblin|bandito|mercenario|armigero|drow/.test(key)) return "ruined frontier camp, torn banners, torchlit dust";
  if (/mago|strega|cultista|sciamano|naga|mind flayer|beholder/.test(key)) return "arcane chamber, magical haze, ominous floating particles";
  return "dark fantasy dungeon environment, atmospheric fog, cinematic depth";
}

function promptFor(monster) {
  const key = `${monster.name} ${monster.desc}`.toLowerCase();
  const tier = tierFor(monster);
  const backdrop = backdropFor(monster, key);
  const intensity = tier === "boss"
    ? "legendary boss portrait, imposing scale, epic high contrast"
    : tier === "hard"
      ? "dangerous elite creature portrait, dramatic high contrast"
      : tier === "mid"
        ? "menacing fantasy creature portrait, polished dramatic lighting"
        : "clear fantasy creature portrait, readable silhouette";

  return [
    "Use case: stylized-concept",
    "Asset type: square monster portrait for a fantasy RPG bestiary and combat card",
    `Primary request: ${monster.name}, ${monster.desc}`,
    `Scene/backdrop: ${backdrop}`,
    `Subject: ${monster.name}, full creature visible from head to upper body, distinctive silhouette`,
    "Style/medium: premium dark fantasy digital painting, painterly realism, detailed textures, not cartoon",
    "Composition/framing: centered square card art, generous padding, readable at small UI thumbnail size",
    `Lighting/mood: ${intensity}, rim light, moody atmosphere`,
    "Color palette: rich fantasy colors, varied by creature, avoid flat monochrome",
    "Constraints: no text, no logo, no watermark, no UI frame, no border, no cropped face, no extra characters",
    "Avoid: blurry stock-photo look, cute mascot style, anime style, low detail, over-dark unreadable subject",
  ].join("\\n");
}

function parseMonsterObjects(source) {
  const objectPattern = /\{id:"([^"]+)",\s*name:"([^"]+)",([\s\S]*?)\},/g;
  const monsters = [];
  let match;
  while ((match = objectPattern.exec(source))) {
    const [, id, name, body] = match;
    const desc = body.match(/desc:"([^"]*)"/)?.[1] || "";
    const xp = Number(body.match(/xp:(\d+)/)?.[1] || 0);
    const hp = Number(body.match(/hp:(\d+)/)?.[1] || 0);
    const atk = Number(body.match(/atk:(\d+)/)?.[1] || 0);
    const def = Number(body.match(/def:(\d+)/)?.[1] || 0);
    const isBoss = /isBoss:true/.test(body);
    monsters.push({ id, name, desc, xp, hp, atk, def, isBoss });
  }
  return monsters;
}

const source = await readFile(SOURCE, "utf8");
const monsters = parseMonsterObjects(source);
const manifest = monsters.map(monster => {
  const filename = `${monster.id}-${slugify(monster.name)}.png`;
  return {
    ...monster,
    tier: tierFor(monster),
    filename,
    publicPath: `/assets/monsters/${filename}`,
    prompt: promptFor(monster),
  };
});

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${manifest.length} monster prompts to ${path.relative(ROOT, OUT_FILE)}`);
