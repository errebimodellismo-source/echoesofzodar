// generate-portraits.mjs
// Genera ritratti layer-based per ogni razza/genere
// Usage: node scripts/generate-portraits.mjs --key=sk-...
// Opzioni:
//   --key=sk-xxx    API key OpenAI (obbligatoria)
//   --race=elf      Genera solo una razza
//   --gender=male   Genera solo un genere
//   --layer=face    Genera solo un layer (face/hair/eyes/scar/beard)
//   --dry           Solo preview prompt, no API

import fs from 'fs';
import path from 'path';
import https from 'https';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const API_KEY   = args.key;
const ONLY_RACE = args.race ?? null;
const ONLY_GEN  = args.gender ?? null;
const ONLY_LAY  = args.layer ?? null;
const DRY       = args.dry === true || args.dry === 'true';

if (!API_KEY && !DRY) {
  console.error('❌ Manca --key=sk-...');
  process.exit(1);
}

const OUT_DIR = path.resolve('public/assets/portraits');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Definizione razze ─────────────────────────────────────────────────────────
const RACES = {
  human: {
    label: 'Human',
    desc: 'ordinary human, realistic features, medieval fantasy setting',
    hairDesc: 'natural human hair styles',
    hornDesc: null,
    hasBeard: true,
  },
  elf: {
    label: 'Elf',
    desc: 'high elf, pointed ears, elegant and slender facial features, ageless beauty',
    hairDesc: 'long flowing elven hair',
    hornDesc: null,
    hasBeard: false,
  },
  dwarf: {
    label: 'Dwarf',
    desc: 'stocky dwarf, broad face, thick eyebrows, rugged features',
    hairDesc: 'braided dwarven hair',
    hornDesc: null,
    hasBeard: true,
  },
  halfling: {
    label: 'Halfling',
    desc: 'halfling, small and cheerful face, curly hair, round cheeks, warm eyes',
    hairDesc: 'curly halfling hair',
    hornDesc: null,
    hasBeard: false,
  },
  dragonborn: {
    label: 'Dragonborn',
    desc: 'dragonborn, reptilian humanoid, scales on face and neck, dragon-like features, slitted pupils',
    hairDesc: null,
    hornDesc: 'dragon horns and head spikes',
    hasBeard: false,
  },
  gnome: {
    label: 'Gnome',
    desc: 'gnome, small pointy ears, large curious eyes, expressive face, tinkerer look',
    hairDesc: 'wild gnome hair',
    hornDesc: null,
    hasBeard: true,
  },
  halfelf: {
    label: 'Half-Elf',
    desc: 'half-elf, slightly pointed ears, mix of human and elven features, versatile appearance',
    hairDesc: 'semi-elven hair styles',
    hornDesc: null,
    hasBeard: true,
  },
  halforc: {
    label: 'Half-Orc',
    desc: 'half-orc, prominent lower tusks, green-grey skin, strong jaw, fierce eyes',
    hairDesc: 'coarse orcish hair',
    hornDesc: null,
    hasBeard: true,
  },
  tiefling: {
    label: 'Tiefling',
    desc: 'tiefling, small curved horns on forehead, slightly colored skin (purple/red tint), solid colored eyes, infernal heritage',
    hairDesc: 'dark or vividly colored tiefling hair',
    hornDesc: 'tiefling horns (small curved)',
    hasBeard: false,
  },
};

const GENDERS = ['male', 'female'];

// ── Layer definitions ─────────────────────────────────────────────────────────
function getLayers(race, gender) {
  const r = RACES[race];
  const isMale = gender === 'male';
  const layers = [];

  // Face variants (5 per razza/genere)
  for (let i = 1; i <= 5; i++) {
    layers.push({
      layer: 'face',
      variant: i,
      filename: `${race}_${gender}_face_${i}.png`,
      prompt: `photorealistic 3D CGI render, ${r.label} ${gender} fantasy RPG character portrait bust, ${r.desc}, variant ${i} showing different individual facial features and skin tone, ${isMale ? 'masculine jawline' : 'feminine features'}, neutral calm expression, perfectly centered front-facing view, transparent background (PNG alpha), no clothing or armor, neck and head only, studio lighting, game-ready character art style, NO 2D illustration, NO gold frame, NO border, NO text`,
    });
  }

  // Hair variants — solo razze con capelli (no dragonborn, no tiefling)
  if (r.hairDesc) {
    for (let i = 1; i <= 3; i++) {
      layers.push({
        layer: 'hair',
        variant: i,
        filename: `${race}_${gender}_hair_${i}.png`,
        prompt: `photorealistic 3D CGI render, isolated hair only on transparent background (PNG alpha), ${r.label} ${gender} character, ${r.hairDesc}, variant ${i} of 3 — different hairstyle, no face visible, only hair strand details, matching portrait bust scale, game character art`,
      });
    }
  }

  // Eyes variants (3)
  for (let i = 1; i <= 3; i++) {
    layers.push({
      layer: 'eyes',
      variant: i,
      filename: `${race}_${gender}_eyes_${i}.png`,
      prompt: `3D rendered close-up of ${r.label} eyes only, ${gender} character, fantasy RPG, variant ${i} with different eye color (${i===1?'blue/grey':i===2?'green/amber':'red/purple/gold'}), highly detailed iris and pupil, pure transparent background (PNG), isolated eye area layer, cinematic 3D render`,
    });
  }

  // Scars (2 variants)
  for (let i = 1; i <= 2; i++) {
    layers.push({
      layer: 'scar',
      variant: i,
      filename: `${race}_${gender}_scar_${i}.png`,
      prompt: `3D rendered facial scar overlay layer, ${i===1?'single diagonal scar across cheek':'multiple battle scars on face'}, realistic healed skin texture, pure transparent background (PNG), no face visible — only scar markings as overlay layer, photorealistic 3D render`,
    });
  }

  // Beard (male only, where applicable)
  if (isMale && r.hasBeard) {
    for (let i = 1; i <= 2; i++) {
      layers.push({
        layer: 'beard',
        variant: i,
        filename: `${race}_${gender}_beard_${i}.png`,
        prompt: `3D rendered isolated beard layer only, ${r.label} male character, ${i===1?'short trimmed beard':'long full beard'}, pure transparent background (PNG), only beard visible — no face, detailed hair strands, 3D render matching portrait bust proportions`,
      });
    }
  }

  return layers;
}

// ── API call ──────────────────────────────────────────────────────────────────
async function generateImage(prompt) {
  const body = JSON.stringify({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'medium',
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) reject(new Error(json.error.message));
          else resolve(json.data[0].b64_json);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Build full task list ──────────────────────────────────────────────────────
const tasks = [];
for (const race of Object.keys(RACES)) {
  if (ONLY_RACE && race !== ONLY_RACE) continue;
  for (const gender of GENDERS) {
    if (ONLY_GEN && gender !== ONLY_GEN) continue;
    const layers = getLayers(race, gender);
    for (const task of layers) {
      if (ONLY_LAY && task.layer !== ONLY_LAY) continue;
      tasks.push({ race, gender, ...task });
    }
  }
}

const total = tasks.length;
let done = 0, skipped = 0, failed = 0;

console.log(`\n🎨 Echoes of Zodar — Generatore ritratti personaggi`);
console.log(`👥 Razze: ${ONLY_RACE || 'tutte (9)'} | Genere: ${ONLY_GEN || 'entrambi'} | Layer: ${ONLY_LAY || 'tutti'}`);
console.log(`📦 Task totali: ${total} | Dry: ${DRY}\n`);

for (let idx = 0; idx < tasks.length; idx++) {
  const task = tasks[idx];
  const destPath = path.join(OUT_DIR, task.filename);

  if (fs.existsSync(destPath)) {
    console.log(`⏭️  [${idx+1}/${total}] ${task.filename} — già esistente`);
    skipped++;
    continue;
  }

  if (DRY) {
    console.log(`🔍 [${idx+1}/${total}] ${task.filename}`);
    console.log(`   Layer: ${task.layer} | Variant: ${task.variant}`);
    console.log(`   Prompt: ${task.prompt}\n`);
    continue;
  }

  process.stdout.write(`🖼️  [${idx+1}/${total}] ${task.filename}... `);

  try {
    const b64 = await generateImage(task.prompt);
    fs.writeFileSync(destPath, Buffer.from(b64, 'base64'));
    console.log(`✅`);
    done++;
  } catch (e) {
    console.log(`❌ ${e.message}`);
    failed++;
    if (e.message.includes('rate') || e.message.includes('429')) {
      console.log('   ⏳ Rate limit — aspetto 60s...');
      await new Promise(r => setTimeout(r, 60000));
    }
  }

  await new Promise(r => setTimeout(r, 1200));
}

console.log(`\n✅ Completato!`);
console.log(`   Generate: ${done} | Saltate: ${skipped} | Fallite: ${failed}`);
console.log(`   Salvate in: ${OUT_DIR}`);
