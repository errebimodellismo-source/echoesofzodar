// Generate full-body equipment mannequin base sprites for the Equip view.
// Review output goes to tmp/generated-equipment-bases by default.
// Add --apply=true only after review to overwrite public/assets/equip/base_*.png.

import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const args = Object.fromEntries(
  process.argv.slice(2).map(arg => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.length ? rest.join("=") : true];
  })
);

function readDotEnvValue(name) {
  const envPath = path.resolve(".env");
  if (!fs.existsSync(envPath)) return "";
  const line = fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find(row => row.trim().startsWith(`${name}=`));
  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

const API_KEY = process.env.OPENAI_API_KEY || readDotEnvValue("OPENAI_API_KEY");
const MODEL = String(args.model || "gpt-image-1.5");
const QUALITY = String(args.quality || "medium");
const SIZE = String(args.size || "1024x1536");
const ONLY_RACE = args.race ? String(args.race).toLowerCase() : null;
const ONLY_GENDER = args.gender ? String(args.gender).toLowerCase() : null;
const APPLY = args.apply === true || args.apply === "true";
const OVERWRITE = args.overwrite === true || args.overwrite === "true";
const DRY = args.dry === true || args.dry === "true";
const DELAY_MS = Number(args.delay || 1400);

const REVIEW_DIR = path.resolve("tmp/generated-equipment-bases");
const LIVE_DIR = path.resolve("public/assets/equip");
const OUT_DIR = APPLY ? LIVE_DIR : REVIEW_DIR;
fs.mkdirSync(OUT_DIR, { recursive: true });

if (!API_KEY && !DRY) {
  console.error("Missing OPENAI_API_KEY. Set it in your shell or .env. Do not paste it into chat.");
  process.exit(1);
}

const RACES = {
  dwarf: {
    label: "dwarf",
    body: "short, broad, sturdy fantasy dwarf proportions; powerful torso, thick arms, strong legs",
    details: "rugged but clean anatomy, stocky silhouette, dwarven face and subtle rounded ears",
  },
  halfling: {
    label: "halfling",
    body: "short, compact, friendly halfling proportions; rounded face, smaller frame, large bare feet",
    details: "warm adventurer anatomy, not childlike, believable adult fantasy halfling",
  },
  gnome: {
    label: "gnome",
    body: "short, slim, whimsical adult gnome proportions; compact frame, lively posture, small pointed ears",
    details: "adult fantasy gnome anatomy, charming but not cartoonish, balanced head size",
  },
  human: {
    label: "human",
    body: "natural adult human fantasy adventurer proportions",
    details: "grounded athletic anatomy, neutral readable silhouette",
  },
  elf: {
    label: "elf",
    body: "slender elegant adult elf proportions, graceful posture, long pointed ears",
    details: "refined fantasy anatomy, agile silhouette",
  },
  halfelf: {
    label: "half-elf",
    body: "balanced human and elven adult proportions, slightly pointed ears",
    details: "grounded fantasy anatomy with refined silhouette",
  },
  halforc: {
    label: "half-orc",
    body: "tall powerful half-orc adult proportions, muscular build, broad jaw",
    details: "green-grey skin, strong but wearable equipment silhouette",
  },
  tiefling: {
    label: "tiefling",
    body: "adult tiefling proportions with horns, tail, and infernal skin",
    details: "horns and tail integrated, elegant fantasy anatomy",
  },
  dragonborn: {
    label: "dragonborn",
    body: "adult dragonborn humanoid proportions, reptilian scales, clawed hands and feet, draconic head",
    details: "upright dragon humanoid anatomy, clean scale texture, no human hair",
  },
};

const GENDERS = ["male", "female"];

function buildPrompt(raceKey, gender) {
  const race = RACES[raceKey];
  const genderText = gender === "female" ? "female adult" : "male adult";
  return [
    "Create one full-body fantasy RPG equipment mannequin base sprite.",
    `Subject: ${genderText} ${race.label}.`,
    `Body: ${race.body}.`,
    `Race details: ${race.details}.`,
    "Outfit: simple off-white linen tunic and shorts/trousers, plain beginner clothing, no armor, no helmet, no cloak, no weapon, no jewelry.",
    "Pose: front-facing symmetrical neutral T-pose relaxed into a natural stance, arms slightly away from torso, hands visible, feet visible.",
    "Composition: full body from head to feet, centered, generous padding, no crop, 2:3 vertical sprite layout.",
    "Style: realistic premium dark fantasy game asset, coherent with modern RPG paper-doll equipment screen.",
    "Lighting: soft neutral studio light, readable edges, no cast shadow.",
    "Background: perfectly flat solid #00ff00 chroma-key background only.",
    "Avoid: diagonal pose, side view, cropped feet, cropped horns, oversized head, childlike body, armor, weapon, shield, UI frame, text, logo, watermark, checkerboard background, white background, shadow, floor plane.",
  ].join(" ");
}

function imageRequest(prompt) {
  const body = JSON.stringify({
    model: MODEL,
    prompt,
    n: 1,
    size: SIZE,
    quality: QUALITY,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "api.openai.com",
      path: "/v1/images/generations",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Length": Buffer.byteLength(body),
      },
    }, res => {
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch (error) {
          reject(new Error(`Invalid API response: ${error.message}`));
          return;
        }
        if (json.error) {
          reject(new Error(json.error.message || "OpenAI image generation failed"));
          return;
        }
        const b64 = json.data?.[0]?.b64_json;
        if (!b64) {
          reject(new Error("No image returned by API"));
          return;
        }
        resolve(b64);
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

const tasks = [];
for (const race of Object.keys(RACES)) {
  if (ONLY_RACE && race !== ONLY_RACE) continue;
  for (const gender of GENDERS) {
    if (ONLY_GENDER && gender !== ONLY_GENDER) continue;
    tasks.push({
      race,
      gender,
      filename: `base_${race}_${gender}.png`,
      prompt: buildPrompt(race, gender),
    });
  }
}

if (!tasks.length) {
  console.error("No tasks matched. Check --race and --gender.");
  process.exit(1);
}

console.log("");
console.log("Echoes of Zodar - equipment base generator");
console.log(`Model: ${MODEL} | quality: ${QUALITY} | size: ${SIZE}`);
console.log(`Output: ${OUT_DIR}`);
console.log(`Apply to game assets: ${APPLY ? "yes" : "no, review folder"}`);
console.log(`Tasks: ${tasks.length} | dry: ${DRY}`);
console.log("");

let generated = 0;
let skipped = 0;
let failed = 0;

for (let index = 0; index < tasks.length; index++) {
  const task = tasks[index];
  const outPath = path.join(OUT_DIR, task.filename);
  const label = `[${index + 1}/${tasks.length}] ${task.filename}`;

  if (fs.existsSync(outPath) && !OVERWRITE) {
    console.log(`${label} skipped, exists`);
    skipped++;
    continue;
  }

  if (DRY) {
    console.log(`${label}`);
    console.log(task.prompt);
    console.log("");
    continue;
  }

  process.stdout.write(`${label} generating... `);
  try {
    const b64 = await imageRequest(task.prompt);
    fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
    console.log("ok");
    generated++;
  } catch (error) {
    console.log(`failed: ${error.message}`);
    failed++;
    if (/rate|429/i.test(error.message)) {
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }

  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
}

console.log("");
console.log(`Done. Generated: ${generated} | skipped: ${skipped} | failed: ${failed}`);
console.log(APPLY
  ? "Live equipment bases were overwritten in public/assets/equip."
  : "Review the images in tmp/generated-equipment-bases before applying.");
