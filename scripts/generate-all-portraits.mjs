// generate-all-portraits.mjs
// Genera ritratti per ogni combinazione classe × razza × genere
// Usage: node scripts/generate-all-portraits.mjs [--dry] [--class=warrior] [--race=elf] [--gender=male]
// Riprende automaticamente dove si era interrotto (salta i file già esistenti)

import fs from 'fs';
import path from 'path';
import https from 'https';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const API_KEY    = process.env.OPENAI_API_KEY || args.key;
const DRY        = args.dry === true || args.dry === 'true';
const ONLY_CLASS = args.class ?? null;
const ONLY_RACE  = args.race  ?? null;
const ONLY_GENDER= args.gender ?? null;
const DELAY_MS   = Number(args.delay ?? 1200); // ms tra una chiamata e l'altra

if (!API_KEY && !DRY) { console.error('❌ OPENAI_API_KEY non trovata'); process.exit(1); }

const OUT_DIR = path.resolve('public/assets/portraits');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── CLASSI ────────────────────────────────────────────────────────────────────
const CLASSES = {
  warrior:          { label:'Warrior',            desc:'heavily armored fighter, plate armor, sword and shield, battle-scarred', color:'#fbbf24' },
  barbarian:        { label:'Barbarian',           desc:'savage warrior, fur-trimmed leather, tribal markings, fierce expression, axe', color:'#ef4444' },
  bard:             { label:'Bard',                desc:'charismatic performer, colorful lute, elegant clothes, charming smile', color:'#ec4899' },
  cleric:           { label:'Cleric',              desc:'holy warrior, ornate religious armor, radiant divine symbols, sacred mace', color:'#fde68a' },
  druid:            { label:'Druid',               desc:'nature guardian, leaf and bark armor, wooden staff, wild earthy look', color:'#22c55e' },
  monk:             { label:'Monk',                desc:'martial artist, simple flowing robes, calm focused eyes, hand wraps', color:'#f97316' },
  paladin:          { label:'Paladin',             desc:'holy knight, shining plate armor, sacred sword, divine aura, noble bearing', color:'#fbbf24' },
  ranger:           { label:'Ranger',              desc:'woodland scout, leather armor with leaf motifs, bow and quiver, keen eyes', color:'#86efac' },
  rogue:            { label:'Rogue',               desc:'stealthy assassin, dark leather armor, daggers, hood partially covering face', color:'#94a3b8' },
  sorcerer:         { label:'Sorcerer',            desc:'innate spellcaster, arcane energy crackling around hands, elegant mystic robes', color:'#8b5cf6' },
  mage:             { label:'Mage',                desc:'arcane scholar, blue star-covered robes, staff with glowing orb, wise eyes', color:'#60a5fa' },
  warlock:          { label:'Warlock',             desc:'dark pact wielder, shadowy robes, eldritch runes, mysterious dark power', color:'#7c3aed' },
  necromancer:      { label:'Necromancer',         desc:'death mage, tattered dark robes with bone motifs, skull staff, glowing purple eyes', color:'#6d28d9' },
  artificer:        { label:'Artificer',           desc:'arcane tinkerer, goggles, mechanical gauntlets, clockwork devices, inventor look', color:'#f59e0b' },
  summoner:         { label:'Summoner',            desc:'dimensional mage, portal-patterned robes, arcane summon circles, ethereal companion', color:'#06b6d4' },
  seductress:       { label:'Seductress',          desc:'enchantress, alluring dark robes, magical charm, elegant dangerous beauty', color:'#f43f5e' },
  echo_knight:      { label:'Echo Knight',         desc:'spectral warrior, ghostly echo duplicate beside them, temporal armor shards', color:'#38bdf8' },
  void_sage:        { label:'Void Sage',           desc:'cosmic wizard, starfield robes, void energy, empty space in their eyes', color:'#1e1b4b' },
  sigilwarden:      { label:'Sigil Warden',        desc:'defensive caster, glowing ward sigils on armor, magical barrier shield', color:'#a78bfa' },
  ashen_oracle:     { label:'Ashen Oracle',        desc:'ash-reading prophet, ember-stained robes, prophetic glow, divine cinder crown', color:'#fb7185' },
  blood_cartographer:{ label:'Blood Cartographer', desc:'map-tattooed mage, blood-ink runes on skin, living map scrolls', color:'#ef4444' },
  moon_reaver:      { label:'Moon Reaver',         desc:'shadow assassin, crescent blade, moonlight-absorbing dark armor', color:'#818cf8' },
  herald_zodar:     { label:'Herald of Zodar',     desc:'balance champion, scales symbol armor, gold and void aesthetic, equilibrium glow', color:'#fbbf24' },
  relic_tamer:      { label:'Relic Tamer',         desc:'artifact wielder, ancient relics floating around, mystical bound items', color:'#d97706' },
  oathblade:        { label:'Oathblade',           desc:'sworn warrior, dark sacred sword, oath runes on blade, solemn expression', color:'#f97316' },
  echo_singer:      { label:'Echo Singer',         desc:'sound mage bard, resonance waves visible, musical rune instruments', color:'#ec4899' },
  echo_reaper:      { label:'Echo Reaper',         desc:'echo harvester, scythe of captured souls, echo fragments orbiting', color:'#64748b' },
  seal_inquisitor:  { label:'Seal Inquisitor',     desc:'anti-magic hunter, sealing rune armor, binding chains, investigator look', color:'#facc15' },
  blood_alchemist:  { label:'Blood Alchemist',     desc:'blood magic user, alchemical vials, transmutation glyphs on skin', color:'#dc2626' },
  rune_elder:       { label:'Rune Elder',          desc:'ancient rune master, stone-carved symbols on robes, glowing elder runes', color:'#60a5fa' },
  blade_dancer:     { label:'Blade Dancer',        desc:'acrobatic duelist, twin blades mid-spin, flowing combat silk, precise eyes', color:'#22c55e' },
  cursebreaker:     { label:'Cursebreaker',        desc:'curse hunter, flame-purified armor, sacred torch, anti-evil symbols', color:'#f59e0b' },
  star_pilgrim:     { label:'Star Pilgrim',        desc:'cosmic wanderer, star map cloak, celestial staff, starlight glow', color:'#38bdf8' },
  soul_forger:      { label:'Soul Forger',         desc:'spirit smith, soul-flame hammer, forged memory armor, glowing spirit sparks', color:'#c084fc' },
  doom_prophet:     { label:'Doom Prophet',        desc:'omen seer, dark robes covered in warnings, hourglass staff, prophetic eyes', color:'#7f1d1d' },
  maze_keeper:      { label:'Maze Keeper',         desc:'dungeon master, labyrinth map armor, puzzle key staff, knowing smile', color:'#14b8a6' },
};

// ── RAZZE ─────────────────────────────────────────────────────────────────────
const RACES = {
  human:                { label:'Human',                desc:'ordinary human, realistic medieval fantasy features' },
  dwarf:                { label:'Dwarf',                desc:'stocky dwarf, broad face, thick eyebrows, rugged' },
  elf:                  { label:'Elf',                  desc:'high elf, pointed ears, elegant ageless features' },
  halfling:             { label:'Halfling',             desc:'small halfling, round cheeks, curly hair, warm eyes' },
  dragonborn:           { label:'Dragonborn',           desc:'reptilian dragonborn, scales, slitted pupils, dragon features' },
  gnome:                { label:'Gnome',                desc:'tiny gnome, large eyes, pointed ears, expressive face' },
  halfelf:              { label:'Half-Elf',             desc:'half-elf, slightly pointed ears, mix of human and elven' },
  halforc:              { label:'Half-Orc',             desc:'half-orc, tusks, grey-green skin, strong jaw' },
  tiefling:             { label:'Tiefling',             desc:'tiefling, small curved horns, colored skin, solid eyes' },
  minotaur:             { label:'Minotaur',             desc:'minotaur, bull horns, bovine head on humanoid body, massive' },
  angel:                { label:'Angel',                desc:'celestial angel, white feathered wings, glowing halo, divine face' },
  succubus:             { label:'Succubus',             desc:'dark succubus, small bat wings, seductive infernal beauty, horns' },
  aasimar:              { label:'Aasimar',              desc:'aasimar, celestial glow on skin, golden eyes, divine heritage' },
  drow:                 { label:'Drow',                 desc:'dark elf drow, midnight skin, white hair, glowing eyes' },
  forged:               { label:'Forged',               desc:'living construct, metal and rune body, artificial but alive, golem-like' },
  renegade_vampire:     { label:'Vampire',              desc:'renegade vampire, pale skin, subtle fangs, dark rings under eyes' },
  sirenide:             { label:'Sirenide',             desc:'sea-born sirenide, aquatic features, luminescent skin, ocean patterns' },
  echide:               { label:'Echide',               desc:'echo-touched being, resonance patterns on skin, translucent features' },
  genasi:               { label:'Genasi',               desc:'elemental genasi, elemental energy (fire/water/air/earth) infused in skin' },
  ancient_draconid:     { label:'Ancient Draconid',     desc:'ancient dragon bloodline, elaborate draconic scales, ancient power' },
  shadow_awakened:      { label:'Shadow Awakened',      desc:'shadow being, darkness swirling around form, semi-translucent edges' },
  fae:                  { label:'Fae',                  desc:'tiny fae creature, insect wings, whimsical colorful features' },
  echo_born:            { label:'Echo Born',            desc:'born from echoes, ethereal ghostly tint, memory fragments visible' },
  half_djinn:           { label:'Half-Djinn',           desc:'djinn heritage, wispy lower form, cosmic energy, wish magic eyes' },
  golemide:             { label:'Golemide',             desc:'living golem, carved stone or metal body, rune-inscribed, mechanical joints' },
  void_touched:         { label:'Void Touched',         desc:'void-marked mortal, cosmic void patterns on skin, dark starfield eyes' },
  fallen_seraphite:     { label:'Fallen Seraphite',     desc:'fallen angel, torn wings, mix of holy light and dark infernal marks' },
  primordial_draconian: { label:'Primordial Draconian', desc:'primordial dragon, ancient wild scales, raw draconic power, fearsome' },
  night_child:          { label:'Night Child',          desc:'child of night, nocturnal features, dark skin with star-like markings' },
  ancient_silvan:       { label:'Ancient Silvan',       desc:'tree spirit incarnate, bark-like skin, leaves and vines in hair' },
  atlantean:            { label:'Atlantean',            desc:'atlantean, aquatic noble features, bioluminescent marks, regal bearing' },
  living_mirror:        { label:'Living Mirror',        desc:'mirror being, reflective shifting face, copies surrounding light patterns' },
};

const GENDERS = ['male', 'female'];

// ── Generazione prompt ────────────────────────────────────────────────────────
function buildPrompt(clsKey, raceKey, gender) {
  const cls  = CLASSES[clsKey];
  const race = RACES[raceKey];
  const g    = gender === 'male' ? 'male' : 'female';
  const gDesc = gender === 'male' ? 'masculine features' : 'feminine features';
  return [
    `fantasy RPG character portrait bust, ${race.label} ${cls.label}, ${gender},`,
    `Race: ${race.desc}.`,
    `Class: ${cls.desc}.`,
    `${gDesc}, confident expression, centered front-facing view,`,
    `circular portrait framing, dark vignette border, detailed fantasy illustration,`,
    `painterly digital art style, dramatic lighting, high quality game character art,`,
    `1024x1024, no text, no watermark, no background scenery outside the circle`,
  ].join(' ');
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function callDalle(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });
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
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────
const allClasses = ONLY_CLASS ? [ONLY_CLASS] : Object.keys(CLASSES);
const allRaces   = ONLY_RACE  ? [ONLY_RACE]  : Object.keys(RACES);
const allGenders = ONLY_GENDER ? [ONLY_GENDER] : GENDERS;

// Costruisci lista da generare
const todo = [];
for (const cls of allClasses) {
  for (const race of allRaces) {
    for (const gender of allGenders) {
      const filename = `${cls}_${race}_${gender}.png`;
      const dest = path.join(OUT_DIR, filename);
      if (!fs.existsSync(dest)) todo.push({ cls, race, gender, filename, dest });
    }
  }
}

console.log(`\n🎨 Echoes of Zodar — Generatore ritratti`);
console.log(`📊 Da generare: ${todo.length} immagini`);
console.log(`✅ Già esistenti: skippate`);
if (DRY) console.log(`🔍 DRY RUN — nessuna chiamata API\n`);

let done = 0, errors = 0;
for (const { cls, race, gender, filename, dest } of todo) {
  const prompt = buildPrompt(cls, race, gender);
  if (DRY) {
    console.log(`[DRY] ${filename}\n  → ${prompt.slice(0, 120)}...\n`);
    continue;
  }
  process.stdout.write(`[${done+1}/${todo.length}] ${filename} ... `);
  try {
    const result = await callDalle(prompt);
    if (result.error) throw new Error(result.error.message);
    const url = result.data?.[0]?.url;
    if (!url) throw new Error('Nessun URL nella risposta');
    await downloadImage(url, dest);
    console.log('✅');
    done++;
    if (done % 20 === 0) console.log(`\n--- ${done}/${todo.length} completate, ${errors} errori ---\n`);
    await sleep(DELAY_MS);
  } catch (err) {
    console.log(`❌ ${err.message}`);
    errors++;
    await sleep(2000);
  }
}

console.log(`\n🏁 Completato: ${done} generate, ${errors} errori`);
