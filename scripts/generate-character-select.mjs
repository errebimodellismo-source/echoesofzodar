// generate-character-select.mjs
// Genera 10 ritratti completi per razza/genere — per la selezione personaggio
// Usage: node scripts/generate-character-select.mjs --key=sk-...
// Opzioni:
//   --key=sk-xxx    API key OpenAI
//   --race=elf      Solo una razza
//   --gender=male   Solo un genere
//   --dry           Preview prompt senza API

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
const DRY       = args.dry === true || args.dry === 'true';

if (!API_KEY && !DRY) { console.error('❌ Manca --key=sk-...'); process.exit(1); }

const OUT_DIR = path.resolve('public/assets/portraits/select');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Descrizioni razze ─────────────────────────────────────────────────────────
const RACES = {
  human:     { label:'Human',     desc:'ordinary human with realistic medieval fantasy features, natural skin tone' },
  elf:       { label:'Elf',       desc:'high elf with long pointed ears, elegant ageless face, pale or fair skin' },
  dwarf:     { label:'Dwarf',     desc:'stocky dwarf with broad face, thick eyebrows, rugged weathered features' },
  halfling:  { label:'Halfling',  desc:'halfling with round cheerful face, curly hair, rosy cheeks, warm eyes' },
  dragonborn:{ label:'Dragonborn',desc:'dragonborn with reptilian scales on face and neck, slitted pupils, dragon-like snout and features, NO human hair' },
  gnome:     { label:'Gnome',     desc:'gnome with large curious eyes, small pointy ears, expressive quirky face' },
  halfelf:   { label:'Half-Elf',  desc:'half-elf with slightly pointed ears, mix of human and elven features' },
  halforc:   { label:'Half-Orc',  desc:'half-orc with prominent lower tusks, green-grey skin, strong jaw, fierce eyes' },
  tiefling:  { label:'Tiefling',  desc:'tiefling with small curved horns on forehead, purple or red tinted skin, solid colored glowing eyes' },
};

const VARIANTS = [
  'young with light hair',
  'middle-aged with dark hair',
  'scarred veteran with grey streaks',
  'noble refined appearance',
  'wild rugged warrior look',
  'mysterious dark features',
  'warm friendly expression',
  'stern serious demeanor',
  'tan skin with distinctive features',
  'weathered traveler appearance',
];

const GENDERS = ['male','female'];

function buildPrompt(race, gender, variant, idx) {
  const r = RACES[race];
  const isMale = gender === 'male';
  return `photorealistic 3D CGI character portrait, ${r.label} ${gender} fantasy RPG hero, ${r.desc}, ${variant}, ${isMale ? 'masculine jawline and features' : 'feminine face and features'}, character number ${idx} — unique individual look. STRICT FRAMING: bust portrait, head and shoulders only, head centered and filling 60% of frame, same camera distance as all others, front-facing slight 3/4 angle, neutral confident expression. Transparent PNG background. Fantasy RPG game character art style. NO 2D illustration, NO gold frame, NO border, NO text, NO watermark. High quality cinematic lighting.`;
}

async function generateImage(prompt) {
  const body = JSON.stringify({ model:'gpt-image-1', prompt, n:1, size:'1024x1024', quality:'medium' });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname:'api.openai.com', path:'/v1/images/generations', method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${API_KEY}`, 'Content-Length':Buffer.byteLength(body) },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if(json.error) reject(new Error(json.error.message));
          else resolve(json.data[0].b64_json);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Build task list ───────────────────────────────────────────────────────────
const tasks = [];
for(const race of Object.keys(RACES)) {
  if(ONLY_RACE && race !== ONLY_RACE) continue;
  for(const gender of GENDERS) {
    if(ONLY_GEN && gender !== ONLY_GEN) continue;
    for(let i = 0; i < 10; i++) {
      tasks.push({
        race, gender, idx: i+1,
        filename: `${race}_${gender}_${i+1}.png`,
        prompt: buildPrompt(race, gender, VARIANTS[i], i+1),
      });
    }
  }
}

const total = tasks.length;
let done = 0, skipped = 0, failed = 0;

console.log(`\n🎨 Echoes of Zodar — Ritratti selezione personaggio`);
console.log(`👥 Razze: ${ONLY_RACE||'tutte (9)'} | Genere: ${ONLY_GEN||'entrambi'} | Tot: ${total} | Dry: ${DRY}\n`);

for(let idx = 0; idx < tasks.length; idx++) {
  const task = tasks[idx];
  const destPath = path.join(OUT_DIR, task.filename);

  if(fs.existsSync(destPath)) {
    console.log(`⏭️  [${idx+1}/${total}] ${task.filename} — già esistente`);
    skipped++; continue;
  }

  if(DRY) {
    console.log(`🔍 [${idx+1}/${total}] ${task.filename}`);
    console.log(`   Prompt: ${task.prompt}\n`);
    continue;
  }

  process.stdout.write(`🖼️  [${idx+1}/${total}] ${task.filename}... `);
  try {
    const b64 = await generateImage(task.prompt);
    fs.writeFileSync(destPath, Buffer.from(b64, 'base64'));
    console.log(`✅`);
    done++;
  } catch(e) {
    console.log(`❌ ${e.message}`);
    failed++;
    if(e.message.includes('rate')||e.message.includes('429')) {
      console.log('   ⏳ Rate limit — aspetto 60s...');
      await new Promise(r => setTimeout(r, 60000));
    }
  }
  await new Promise(r => setTimeout(r, 1200));
}

console.log(`\n✅ Completato! Generate: ${done} | Saltate: ${skipped} | Fallite: ${failed}`);
console.log(`   Salvate in: ${OUT_DIR}`);
