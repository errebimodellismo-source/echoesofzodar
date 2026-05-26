// Generate coherent full face portraits for the character creator.
// The game uses these as complete base portraits: race_gender_face_N.png.
//
// Safe usage:
//   $env:OPENAI_API_KEY="sk-..."
//   node scripts/generate-character-faces.mjs --race=elf --gender=male --dry
//   node scripts/generate-character-faces.mjs --race=elf --gender=male
//
// By default, output goes to tmp/generated-character-faces for review.
// Add --apply=true to overwrite public/assets/portraits/*.png.

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
const SIZE = String(args.size || "1024x1024");
const ONLY_RACE = args.race ? String(args.race).toLowerCase() : null;
const ONLY_GENDER = args.gender ? String(args.gender).toLowerCase() : null;
const VARIANTS = Number(args.variants || 5);
const DRY = args.dry === true || args.dry === "true";
const APPLY = args.apply === true || args.apply === "true";
const OVERWRITE = args.overwrite === true || args.overwrite === "true";
const DELAY_MS = Number(args.delay || 1400);

const REVIEW_DIR = path.resolve("tmp/generated-character-faces");
const LIVE_DIR = path.resolve("public/assets/portraits");
const OUT_DIR = APPLY ? LIVE_DIR : REVIEW_DIR;
fs.mkdirSync(OUT_DIR, { recursive: true });

if (!API_KEY && !DRY) {
  console.error("Missing OPENAI_API_KEY. Set it in your shell or .env. Do not paste it into chat.");
  process.exit(1);
}

const RACES = {
  human: {
    label: "human",
    traits: "natural human facial anatomy, realistic medieval fantasy hero",
    skin: "varied natural human skin tone",
    ears: "normal human ears",
    hair: "natural hair integrated into the portrait",
  },
  elf: {
    label: "elf",
    traits: "elegant high elf facial anatomy, graceful cheekbones, ageless refined features",
    skin: "fair to warm fantasy skin tone",
    ears: "long pointed elven ears visible and symmetrical",
    hair: "long elegant elven hair integrated into the portrait",
  },
  dwarf: {
    label: "dwarf",
    traits: "broad sturdy dwarf face, thick eyebrows, rugged weathered features",
    skin: "natural rugged skin texture",
    ears: "subtle rounded ears",
    hair: "dwarven hair integrated into the portrait, beard allowed for male only",
  },
  halfling: {
    label: "halfling",
    traits: "warm halfling face, round cheeks, smaller friendly proportions",
    skin: "warm natural skin tone",
    ears: "slightly pointed small ears",
    hair: "soft curly hair integrated into the portrait",
  },
  dragonborn: {
    label: "dragonborn",
    traits: "dragonborn humanoid face, reptilian scales, short snout, strong draconic brow",
    skin: "colored scales, not human skin",
    ears: "no human ears",
    hair: "no hair, no beard, only horns or crest if appropriate",
  },
  gnome: {
    label: "gnome",
    traits: "expressive gnome face, curious eyes, compact whimsical fantasy proportions",
    skin: "natural skin tone",
    ears: "small pointed ears",
    hair: "slightly wild gnome hair integrated into the portrait",
  },
  halfelf: {
    label: "half-elf",
    traits: "balanced human and elven features, refined but grounded facial anatomy",
    skin: "natural fantasy skin tone",
    ears: "slightly pointed half-elven ears",
    hair: "natural or elegant hair integrated into the portrait",
  },
  halforc: {
    label: "half-orc",
    traits: "strong half-orc face, prominent jaw, subtle tusks, fierce but believable features",
    skin: "green-grey or olive fantasy skin tone",
    ears: "slightly pointed or orcish ears",
    hair: "coarse hair integrated into the portrait",
  },
  tiefling: {
    label: "tiefling",
    traits: "tiefling face, infernal elegance, small curved horns on forehead",
    skin: "red, purple, ash, or warm infernal skin tone",
    ears: "pointed infernal ears",
    hair: "dark or vivid hair integrated into the portrait, horns must remain visible",
  },
};

const GENDERS = ["male", "female"];

const VARIANT_NOTES = [
  "calm young adventurer, clear readable features",
  "stern seasoned traveler, slightly sharper features",
  "weathered veteran, subtle asymmetry, serious gaze",
  "noble refined hero, confident quiet expression",
  "rugged wanderer, distinctive face, intense eyes",
];

function buildPrompt(raceKey, gender, variantIndex) {
  const race = RACES[raceKey];
  const genderText = gender === "female"
    ? "female, feminine facial structure"
    : "male, masculine facial structure";
  return [
    "Create one complete fantasy RPG character creator portrait.",
    `Subject: ${race.label} ${genderText}.`,
    `Race traits: ${race.traits}; ${race.skin}; ${race.ears}; ${race.hair}.`,
    `Variant: ${VARIANT_NOTES[variantIndex - 1] || `unique face variant ${variantIndex}`}.`,
    "Style: premium realistic 3D CGI character art, cohesive with modern dark fantasy RPG portraits.",
    "Composition: front-facing bust portrait, head and shoulders, symmetrical camera angle, face centered, both eyes visible, ears visible when race has special ears.",
    "Framing: square 1024x1024, head fills about 68 percent of image height, top of head not cropped, chin and shoulders visible, same camera distance for every portrait.",
    "Lighting: soft cinematic studio lighting, neutral dark transparent-friendly background, clean rim light, high detail skin and eyes.",
    "Important: hair, horns, ears, face, and shoulders must be part of one coherent portrait, not separated layers.",
    "Avoid: side profile, tilted head, diagonal hair layer, floating hair, mask, eyeless face, missing face, patch of skin, extra body, armor helmet, UI frame, text, logo, watermark, cropped face, collage, multiple characters.",
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
    for (let i = 1; i <= VARIANTS; i++) {
      tasks.push({
        race,
        gender,
        variant: i,
        filename: `${race}_${gender}_face_${i}.png`,
        prompt: buildPrompt(race, gender, i),
      });
    }
  }
}

if (!tasks.length) {
  console.error("No tasks matched. Check --race and --gender.");
  process.exit(1);
}

console.log("");
console.log("Echoes of Zodar - coherent character face generator");
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
  ? "Live portraits were overwritten in public/assets/portraits."
  : "Review the images in tmp/generated-character-faces. Re-run with --apply=true to write live assets.");
