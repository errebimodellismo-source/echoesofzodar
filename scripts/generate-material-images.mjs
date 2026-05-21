// generate-material-images.mjs
// Genera immagini per i CRAFT_MATERIALS con gpt-image-1
// Usage: node scripts/generate-material-images.mjs --key=sk-...
// Opzioni:
//   --key=sk-xxx   API key OpenAI (obbligatoria)
//   --from=N       Salta i primi N materiali
//   --dry          Solo preview prompt, no API

import fs from 'fs';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const API_KEY = args.key;
const FROM    = parseInt(args.from ?? '0');
const DRY     = args.dry === true || args.dry === 'true';

if (!API_KEY && !DRY) {
  console.error('❌ Manca --key=sk-...');
  process.exit(1);
}

const OUT_DIR = path.resolve('public/assets/items');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Estrai CRAFT_MATERIALS da App.jsx
const appSrc = fs.readFileSync('src/App.jsx', 'utf8');
const match = appSrc.match(/const CRAFT_MATERIALS\s*=\s*(\[[\s\S]*?\]);/);
if (!match) { console.error('❌ CRAFT_MATERIALS non trovato in App.jsx'); process.exit(1); }
const CRAFT_MATERIALS = eval(match[1]);

const RARITY_STYLE = {
  common:    'simple, raw, everyday material',
  uncommon:  'well-crafted, slight magical glow',
  rare:      'magical, glowing runes, arcane aura',
  epic:      'powerful radiance, dramatic lighting',
  legendary: 'legendary, divine light, mythical appearance',
};

function buildPrompt(mat) {
  const rarityStyle = RARITY_STYLE[mat.rarity] || RARITY_STYLE.common;
  return `fantasy RPG crafting material icon, ${mat.name}, ${mat.description}, ${rarityStyle}, isolated on pure black background, centered composition, detailed illustration, no text, no watermark, square format, high quality digital art`;
}

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
          else if (json.data[0].url) resolve({ type: 'url', value: json.data[0].url });
          else resolve({ type: 'b64', value: json.data[0].b64_json });
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const ws = createWriteStream(destPath);
      pipeline(res, ws).then(resolve).catch(reject);
    }).on('error', reject);
  });
}

const total = CRAFT_MATERIALS.length;
let done = 0, skipped = 0, failed = 0;

console.log(`\n🎨 Echoes of Zodar — Generatore immagini materiali`);
console.log(`📦 Materiali totali: ${total} | Da: ${FROM} | Dry: ${DRY}\n`);

for (let idx = 0; idx < CRAFT_MATERIALS.length; idx++) {
  const mat = CRAFT_MATERIALS[idx];
  const destPath = path.join(OUT_DIR, `${mat.id}.png`);

  if (fs.existsSync(destPath)) {
    console.log(`⏭️  [${idx + 1}/${total}] ${mat.id} — già esistente, salto`);
    skipped++;
    continue;
  }

  if (idx < FROM) {
    console.log(`⏭️  [${idx + 1}/${total}] ${mat.id} — salto (--from=${FROM})`);
    skipped++;
    continue;
  }

  const prompt = buildPrompt(mat);

  if (DRY) {
    console.log(`🔍 [${idx + 1}/${total}] ${mat.id}`);
    console.log(`   Prompt: ${prompt}\n`);
    continue;
  }

  process.stdout.write(`🖼️  [${idx + 1}/${total}] ${mat.name} (${mat.rarity})... `);

  try {
    const result = await generateImage(prompt);
    if (result.type === 'url') {
      await downloadImage(result.value, destPath);
    } else {
      fs.writeFileSync(destPath, Buffer.from(result.value, 'base64'));
    }
    console.log(`✅ salvata`);
    done++;
  } catch (e) {
    console.log(`❌ errore: ${e.message}`);
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
console.log(`   Immagini salvate in: ${OUT_DIR}`);
