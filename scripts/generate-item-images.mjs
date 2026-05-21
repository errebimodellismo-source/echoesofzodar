// generate-item-images.mjs
// Genera immagini RPG per tutti gli item con DALL-E 3
// Usage: node scripts/generate-item-images.mjs --key=sk-...
// Opzioni:
//   --key=sk-xxx       API key OpenAI (obbligatoria)
//   --from=50          Salta i primi N item (riprendi da dove si era fermato)
//   --only=weapon      Genera solo item di un tipo (weapon/armor/potion/accessory/shield/head/legs/boots/gloves/cloak)
//   --dry              Mostra solo i prompt senza chiamare l'API

import fs from 'fs';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

// ── Parse args ────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const API_KEY = args.key;
const FROM    = parseInt(args.from ?? '0');
const ONLY    = args.only ?? null;
const DRY     = args.dry === true || args.dry === 'true';

if (!API_KEY && !DRY) {
  console.error('❌ Manca --key=sk-...\nUsage: node scripts/generate-item-images.mjs --key=sk-xxx');
  process.exit(1);
}

// ── Output dir ────────────────────────────────────────────────────────────────
const OUT_DIR = path.resolve('public/assets/items');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Load items ────────────────────────────────────────────────────────────────
// Leggiamo il file JS come testo e usiamo eval-like trick via data URL
const raw = fs.readFileSync('src/data/itemsData.js', 'utf8')
  .replace(/^export const DEFAULT_ITEMS/, 'const DEFAULT_ITEMS')
  .replace(/^export /gm, '');

// Eseguiamo il modulo in un contesto isolato
const { createRequire } = await import('module');
const tmpFile = path.resolve('scripts/_tmp_items.mjs');
fs.writeFileSync(tmpFile, raw + '\nexport { DEFAULT_ITEMS };');
const { DEFAULT_ITEMS } = await import('./_tmp_items.mjs?t=' + Date.now());
fs.unlinkSync(tmpFile);

// ── Prompt builder ─────────────────────────────────────────────────────────────
const RARITY_STYLE = {
  common:    'simple, worn, everyday materials',
  uncommon:  'well-crafted, slight magical glow',
  rare:      'ornate, magical aura, glowing runes',
  epic:      'epic, powerful radiance, dramatic lighting',
  legendary: 'legendary, divine light, mythical appearance',
};

const TYPE_STYLE = {
  weapon:    'fantasy RPG weapon icon',
  armor:     'fantasy RPG armor piece icon',
  shield:    'fantasy RPG shield icon',
  potion:    'fantasy RPG potion bottle icon',
  accessory: 'fantasy RPG accessory icon',
  head:      'fantasy RPG helmet icon',
  legs:      'fantasy RPG leg armor icon',
  boots:     'fantasy RPG boots icon',
  gloves:    'fantasy RPG gloves icon',
  cloak:     'fantasy RPG cloak icon',
  misc:      'fantasy RPG item icon',
};

function buildPrompt(item) {
  const typeStyle   = TYPE_STYLE[item.type] || TYPE_STYLE.misc;
  const rarityStyle = RARITY_STYLE[item.rarity] || RARITY_STYLE.common;
  return `${typeStyle}, ${item.name}, ${rarityStyle}, isolated on pure black background, centered composition, detailed illustration, no text, no watermark, square format, high quality digital art`;
}

// ── DALL-E 3 call ─────────────────────────────────────────────────────────────
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

// ── Main loop ─────────────────────────────────────────────────────────────────
const items = DEFAULT_ITEMS.filter(i => !ONLY || i.type === ONLY);
const total = items.length;
let done = 0, skipped = 0, failed = 0;

console.log(`\n🎨 Echoes of Zodar — Generatore immagini item`);
console.log(`📦 Item totali: ${total} | Da: ${FROM} | Tipo: ${ONLY || 'tutti'} | Dry: ${DRY}\n`);

for (let idx = 0; idx < items.length; idx++) {
  const item = items[idx];
  const destPath = path.join(OUT_DIR, `${item.id}.png`);

  // Salta se già esiste
  if (fs.existsSync(destPath)) {
    console.log(`⏭️  [${idx + 1}/${total}] ${item.id} — già esistente, salto`);
    skipped++;
    continue;
  }

  // Salta se prima di FROM
  if (idx < FROM) {
    console.log(`⏭️  [${idx + 1}/${total}] ${item.id} — salto (--from=${FROM})`);
    skipped++;
    continue;
  }

  const prompt = buildPrompt(item);

  if (DRY) {
    console.log(`🔍 [${idx + 1}/${total}] ${item.id}`);
    console.log(`   Prompt: ${prompt}\n`);
    continue;
  }

  process.stdout.write(`🖼️  [${idx + 1}/${total}] ${item.name} (${item.rarity})... `);

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
    // Pausa extra in caso di rate limit
    if (e.message.includes('rate') || e.message.includes('429')) {
      console.log('   ⏳ Rate limit — aspetto 60s...');
      await new Promise(r => setTimeout(r, 60000));
    }
  }

  // Pausa tra le richieste per non hammers l'API
  await new Promise(r => setTimeout(r, 1200));
}

console.log(`\n✅ Completato!`);
console.log(`   Generate: ${done} | Saltate: ${skipped} | Fallite: ${failed}`);
console.log(`   Immagini salvate in: ${OUT_DIR}`);
if (failed > 0) {
  console.log(`\n💡 Per riprovare solo i falliti, rilancia con --from=<ultimo_indice_ok>`);
}
