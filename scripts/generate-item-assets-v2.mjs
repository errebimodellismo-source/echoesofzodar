import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_ITEMS } from "../src/data/itemsData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "public", "assets", "items-v2");
const iconDir = path.join(outRoot, "icons");
const wearDir = path.join(outRoot, "wear");
const cosmeticIconDir = path.join(outRoot, "cosmetics", "icons");
const cosmeticWearDir = path.join(outRoot, "cosmetics", "wear");
const bodyProfiles = [
  "normal",
  "slender",
  "small",
  "stocky",
  "massive",
  "draconic",
  "horned",
  "winged",
  "aquatic",
  "ethereal",
  "construct",
];
const generateBodyProfileWearAssets = false;

const rarityPalette = {
  common: { a:"#cbd5e1", b:"#64748b", ink:"#f8fafc", bg:"#18202c" },
  uncommon: { a:"#34d399", b:"#0ea5e9", ink:"#f0fdf4", bg:"#10241f" },
  rare: { a:"#60a5fa", b:"#7c3aed", ink:"#eff6ff", bg:"#111c35" },
  epic: { a:"#c084fc", b:"#f472b6", ink:"#faf5ff", bg:"#221334" },
  legendary: { a:"#fbbf24", b:"#f97316", ink:"#fffbeb", bg:"#2a1c0c" },
  mythic: { a:"#f0abfc", b:"#fde68a", ink:"#fdf4ff", bg:"#281438" },
};

const typeMeta = [
  [/crossbow|balestra|ballista|balista/i, { label:"Balestra", glyph:"crossbow", slot:"weapon" }],
  [/bow|arco|longbow/i, { label:"Arco", glyph:"bow", slot:"weapon" }],
  [/spear|lancia|halberd|alabarda|glaive|asta/i, { label:"Lancia", glyph:"spear", slot:"weapon" }],
  [/axe|ascia|hatchet|accetta/i, { label:"Ascia", glyph:"axe", slot:"weapon" }],
  [/mace|mazza|hammer|martello|club|randello/i, { label:"Mazza", glyph:"mace", slot:"weapon" }],
  [/dagger|pugnale|knife|coltello/i, { label:"Pugnale", glyph:"dagger", slot:"weapon" }],
  [/sword|spada|blade|lama|rapier|falchion|cutlass|sciabola|claymore/i, { label:"Lama", glyph:"sword", slot:"weapon" }],
  [/staff|bastone|wand|bacchetta|rod|verga/i, { label:"Focus", glyph:"staff", slot:"weapon" }],
  [/grimoire|grimorio|tome|tomo|book|libro/i, { label:"Grimorio", glyph:"book", slot:"weapon" }],
  [/orb|sfera|crystal|cristallo|sintonia/i, { label:"Reliquia", glyph:"orb", slot:"amulet" }],
  [/whip|frusta/i, { label:"Frusta", glyph:"whip", slot:"weapon" }],
  [/scythe|falce/i, { label:"Falce", glyph:"scythe", slot:"weapon" }],
  [/shield|scudo/i, { label:"Scudo", glyph:"shield", slot:"offhand" }],
  [/head_|helm|elmo|helmet|crown|corona|circlet|diadema/i, { label:"Testa", glyph:"helm", slot:"head" }],
  [/hood|cappuccio|cap|berretto|cuffia|cowl|cappello/i, { label:"Cappuccio", glyph:"hood", slot:"head" }],
  [/legs_|pants|greaves|legplates|kilt|gambali/i, { label:"Gambe", glyph:"legs", slot:"legs" }],
  [/boots|stivali|shoes|sandals|sabatons|calzari/i, { label:"Stivali", glyph:"boots", slot:"boots" }],
  [/gloves|guanti|gauntlets|bracer|fist|hands/i, { label:"Guanti", glyph:"gloves", slot:"gloves" }],
  [/cloak|mantle|cape|robe|shroud|mantello|cappa/i, { label:"Mantello", glyph:"cloak", slot:"cloak" }],
  [/mail|maglia|chain|plate|piastre|armor|armatura|leather|cuoio|gambeson|coat|corazza/i, { label:"Armatura", glyph:"armor", slot:"chest" }],
  [/ring|anello/i, { label:"Anello", glyph:"ring", slot:"ring1" }],
  [/charm|ciondolo|talisman|talismano|amulet|amuleto/i, { label:"Amuleto", glyph:"amulet", slot:"amulet" }],
  [/potion|pozione|infuso|ampolla|fiala|tonic|tonico|elixir|elisir|balm|balsamo/i, { label:"Pozione", glyph:"potion", slot:null }],
];

const cosmeticThemes = [
  "Brumafonda","Vetro Lunare","Ruggine Sacra","Cenere Fenice","Ossidiana",
  "Alba Spenta","Ferrochiaro","Nerocanto","Sale Abissale","Radice Antica",
  "Tuono Viola","Corona Spezzata","Mithril Velato","Sangue Stellare","Gelo Eterno",
  "Smeraldo Vivo","Sabbia del Tempo","Fiamma Bianca","Spina Draconica","Eclissi",
  "Argento Muto","Corallo Nero","Vento Nomade","Runa Azzurra","Soglia Dorata",
  "Lama Rossa","Pietra Cava","Velo Astrale","Rosa Cremisi","Crepuscolo",
  "Tempesta Verde","Inchiostro Reale","Scaglia Celeste","Nebbia Dorata","Canto del Vuoto",
  "Oricalco","Rugiada Fatata","Teschio Bianco","Marea Nera","Cristallo Vivo",
  "Drappo Imperiale","Luce di Tharn","Occhio di Basilisco","Rombo di Hydra","Lacrima di Djinn",
  "Sigillo Primo","Miele Ambrato","Notte di Korvane","Reliquia Perduta","Zodar Cosmico",
];

const cosmeticFamilies = [
  { type:"hood", label:"Cappuccio", count:50, glyph:"hood", slot:"head" },
  { type:"helmet", label:"Elmo", count:30, glyph:"helm", slot:"head" },
  { type:"cloak", label:"Mantello", count:50, glyph:"cloak", slot:"cloak" },
  { type:"aura", label:"Aura", count:20, glyph:"aura", slot:"aura", minRarity:"rare" },
  { type:"mascot", label:"Mascotte", count:30, glyph:"mascot", slot:"mascot" },
  { type:"weapon_skin", label:"Skin Arma", count:50, glyph:"sword", slot:"weapon" },
  { type:"armor_skin", label:"Skin Armatura", count:50, glyph:"armor", slot:"chest" },
];

const baseCosmetics = [
  { id:"title_adepto_zodar", name:"Adepto di Zodar", type:"title", rarity:"epic", glyph:"title" },
  { id:"title_araldo_eclissi", name:"Araldo dell'Eclissi", type:"title", rarity:"legendary", glyph:"title" },
  { id:"title_primo_adepto", name:"Primo Adepto di Zodar", type:"title", rarity:"mythic", glyph:"title" },
  { id:"frame_sigil_antico", name:"Cornice Sigillo Antico", type:"frame", rarity:"epic", glyph:"frame" },
  { id:"aura_eco_nero", name:"Aura Eco Nero", type:"aura", rarity:"legendary", glyph:"aura", slot:"aura" },
  { id:"back_reliquary", name:"Retro Reliquiario", type:"cardback", rarity:"rare", glyph:"cardback" },
];

const legendaryItems = [
  { id:"leg_excalibur", name:"Excalibur", type:"weapon", rarity:"legendary", weapon_die:"2d8", bonus_atk:5 },
  { id:"leg_vorpal", name:"Lama Vorpal", type:"weapon", rarity:"legendary", weapon_die:"2d6", bonus_atk:4 },
  { id:"leg_frostbrand", name:"Frostbrand", type:"weapon", rarity:"legendary", weapon_die:"2d6", bonus_atk:4 },
  { id:"leg_flamebrand", name:"Spada di Fuoco", type:"weapon", rarity:"legendary", weapon_die:"1d10", bonus_atk:4 },
  { id:"leg_moonbow", name:"Arco della Luna", type:"weapon", rarity:"legendary", weapon_die:"2d6", bonus_atk:4 },
  { id:"leg_thunderhammer", name:"Martello del Tuono", type:"weapon", rarity:"legendary", weapon_die:"2d10", bonus_atk:3 },
  { id:"leg_dragonscale", name:"Armatura del Drago", type:"armor", rarity:"legendary", bonus_def:6 },
  { id:"leg_aegis", name:"Egida degli Dei", type:"armor", rarity:"legendary", bonus_def:5 },
  { id:"leg_shadowcloak", name:"Mantello d'Ombra", type:"armor", rarity:"legendary", bonus_def:4 },
  { id:"leg_titanplate", name:"Armatura Titanica", type:"armor", rarity:"legendary", bonus_def:7 },
  { id:"leg_phylactery", name:"Filatteri del Lich", type:"magic", rarity:"legendary", bonus_mag:6 },
  { id:"leg_eye_gods", name:"Occhio degli Dei", type:"magic", rarity:"legendary", bonus_mag:5 },
  { id:"leg_starstaff", name:"Baculo delle Stelle", type:"magic", rarity:"legendary", bonus_mag:6 },
  { id:"leg_zodar_sword", name:"Spada di Zodar", type:"weapon", rarity:"mythic", weapon_die:"5d20", bonus_atk:10 },
  { id:"leg_zodar_armor", name:"Armatura di Zodar", type:"armor", rarity:"mythic", bonus_def:20 },
  { id:"leg_dito_strabo", name:"Dito di Strabo", type:"weapon", rarity:"mythic", weapon_die:"100d20", bonus_atk:20 },
];

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function short(value, max=24) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

function itemSlot(item) {
  const raw = item?.slot;
  if(raw && raw !== "armor" && raw !== "shield" && raw !== "accessory") return raw;
  if(item?.type === "weapon" || item?.weapon_die) return "weapon";
  if(item?.type === "armor" || raw === "armor") return "chest";
  if(item?.type === "shield" || raw === "shield") return "offhand";
  if(item?.type === "accessory" || raw === "accessory") return "amulet";
  if(item?.type === "magic") return "weapon";
  return null;
}

function rarityLabel(rarity) {
  return ({
    common:"COMUNE",
    uncommon:"NON COMUNE",
    rare:"RARO",
    epic:"EPICO",
    legendary:"LEGGENDARIO",
    mythic:"MITICO",
  })[rarity] || "OGGETTO";
}

function slotLabel(slot) {
  return ({
    weapon:"ARMA",
    offhand:"MANO SX",
    head:"TESTA",
    chest:"PETTO",
    legs:"GAMBE",
    boots:"STIVALI",
    gloves:"GUANTI",
    ring1:"ANELLO",
    ring2:"ANELLO",
    amulet:"AMULETO",
    cloak:"MANTELLO",
    aura:"AURA",
    mascot:"MASCOTTE",
  })[slot] || "INVENTARIO";
}

function cosmeticRarity(index, count, minRarity="common") {
  const pct = (index + 1) / count;
  let rarity = pct <= 0.4 ? "common" : pct <= 0.68 ? "uncommon" : pct <= 0.86 ? "rare" : pct <= 0.96 ? "epic" : "legendary";
  if(minRarity === "rare" && (rarity === "common" || rarity === "uncommon")) rarity = index % 3 === 0 ? "rare" : "epic";
  return rarity;
}

function metaFor(item) {
  const key = `${item.id || ""} ${item.name || ""}`.toLowerCase();
  const found = typeMeta.find(([rx]) => rx.test(key));
  if(found) return found[1];
  if(item.type === "weapon") return { label:"Arma", glyph:"sword", slot:"weapon" };
  if(item.type === "armor") return { label:"Armatura", glyph:"armor", slot:"chest" };
  if(item.type === "shield") return { label:"Scudo", glyph:"shield", slot:"offhand" };
  if(item.type === "potion") return { label:"Pozione", glyph:"potion", slot:null };
  if(item.type === "accessory") return { label:"Accessorio", glyph:"amulet", slot:"amulet" };
  return { label:"Oggetto", glyph:"gem", slot:itemSlot(item) };
}

function glyphSvg(glyph, pal) {
  const stroke = pal.ink;
  const fill = "url(#metal)";
  const faint = `fill="${pal.a}" opacity=".16"`;
  const map = {
    sword:`<path d="M222 74 L248 100 L124 284 L94 302 L112 272 Z" fill="${stroke}" opacity=".92"/><path d="M96 294 L128 326" stroke="${stroke}" stroke-width="16" stroke-linecap="round"/><path d="M80 340 L140 280" stroke="url(#metal)" stroke-width="18" stroke-linecap="round"/>`,
    dagger:`<path d="M160 72 L188 168 L160 294 L132 168 Z" fill="${stroke}" opacity=".9"/><path d="M114 306 L206 306" stroke="url(#metal)" stroke-width="16" stroke-linecap="round"/><path d="M160 314 L160 360" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/>`,
    axe:`<path d="M176 78 L198 88 L138 356 L116 346 Z" fill="${stroke}" opacity=".9"/><path d="M154 98 C238 88 250 154 194 194 C188 154 172 128 154 98 Z" fill="url(#metal)"/>`,
    mace:`<path d="M160 82 L184 112 L160 142 L136 112 Z" fill="url(#metal)"/><path d="M160 138 L160 346" stroke="${stroke}" stroke-width="24" stroke-linecap="round"/><circle cx="160" cy="100" r="46" fill="url(#metal)" opacity=".82"/>`,
    spear:`<path d="M160 56 L204 146 L160 122 L116 146 Z" fill="url(#metal)"/><path d="M160 122 L160 356" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/>`,
    staff:`<path d="M178 60 C124 134 204 190 150 360" fill="none" stroke="${stroke}" stroke-width="20" stroke-linecap="round"/><circle cx="178" cy="76" r="30" fill="url(#metal)"/>`,
    bow:`<path d="M190 62 C92 148 92 270 190 356" fill="none" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/><path d="M190 62 C150 164 150 254 190 356" fill="none" stroke="url(#metal)" stroke-width="6"/>`,
    crossbow:`<path d="M82 160 C132 120 188 120 238 160" fill="none" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/><path d="M160 122 L160 318" stroke="url(#metal)" stroke-width="20" stroke-linecap="round"/><path d="M110 214 L210 214" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/>`,
    shield:`<path d="M160 66 C218 86 244 114 238 174 C232 250 194 314 160 352 C126 314 88 250 82 174 C76 114 102 86 160 66 Z" fill="url(#metal)"/><path d="M160 98 L160 316" stroke="${stroke}" stroke-width="7" opacity=".35"/>`,
    armor:`<path d="M98 112 C118 82 202 82 222 112 L204 316 C178 344 142 344 116 316 Z" fill="url(#metal)"/><path d="M128 106 L160 178 L192 106" fill="none" stroke="${stroke}" stroke-width="8" opacity=".36"/>`,
    helm:`<path d="M102 170 C106 74 214 74 218 170 L214 230 L106 230 Z" fill="url(#metal)"/><path d="M124 164 L196 164" stroke="${stroke}" stroke-width="10" opacity=".42"/>`,
    hood:`<path d="M100 220 C94 106 226 106 220 220 C190 194 130 194 100 220 Z" fill="url(#metal)"/><path d="M124 218 C134 170 186 170 196 218" fill="#020617" opacity=".5"/>`,
    legs:`<path d="M112 92 L154 92 L148 338 L104 338 Z M166 92 L208 92 L216 338 L172 338 Z" fill="url(#metal)"/>`,
    boots:`<path d="M104 168 L152 168 L146 280 L82 280 C88 232 98 210 104 168 Z M168 168 L216 168 C222 210 232 232 238 280 L174 280 Z" fill="url(#metal)"/>`,
    gloves:`<path d="M96 118 L144 142 L130 252 L76 236 Z M176 142 L224 118 L244 236 L190 252 Z" fill="url(#metal)"/>`,
    cloak:`<path d="M94 84 C130 118 190 118 226 84 L264 352 C216 386 104 386 56 352 Z" fill="url(#metal)" opacity=".82"/>`,
    ring:`<circle cx="160" cy="198" r="86" fill="none" stroke="url(#metal)" stroke-width="28"/><circle cx="160" cy="198" r="42" fill="${pal.bg}"/>`,
    amulet:`<path d="M104 96 C124 162 196 162 216 96" fill="none" stroke="${stroke}" stroke-width="14" stroke-linecap="round"/><path d="M160 184 L204 240 L160 304 L116 240 Z" fill="url(#metal)"/>`,
    potion:`<path d="M132 82 L188 82 L178 138 L212 266 C224 314 96 314 108 266 L142 138 Z" fill="url(#metal)"/><path d="M118 236 C142 214 178 254 202 226 L206 278 C190 316 130 316 114 278 Z" fill="${pal.b}" opacity=".52"/>`,
    book:`<path d="M84 96 C126 72 162 88 160 122 L160 342 C124 318 102 318 84 336 Z" fill="url(#metal)"/><path d="M160 122 C188 88 228 72 268 96 L268 336 C230 318 194 318 160 342 Z" fill="url(#metal)" opacity=".82"/>`,
    orb:`<circle cx="160" cy="206" r="94" fill="url(#metal)" opacity=".8"/><circle cx="128" cy="170" r="26" fill="#fff" opacity=".24"/>`,
    whip:`<path d="M98 286 C232 252 96 112 218 76" fill="none" stroke="url(#metal)" stroke-width="18" stroke-linecap="round"/><path d="M80 300 L122 342" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/>`,
    scythe:`<path d="M184 76 C90 92 78 170 152 196 C122 130 178 116 238 108 Z" fill="url(#metal)"/><path d="M170 126 L116 356" stroke="${stroke}" stroke-width="18" stroke-linecap="round"/>`,
    aura:`<circle cx="160" cy="206" r="102" fill="none" stroke="url(#metal)" stroke-width="14" opacity=".78"/><circle cx="160" cy="206" r="58" fill="none" stroke="${stroke}" stroke-width="8" opacity=".5"/>`,
    mascot:`<circle cx="128" cy="172" r="38" fill="url(#metal)"/><circle cx="192" cy="172" r="38" fill="url(#metal)"/><ellipse cx="160" cy="230" rx="82" ry="72" fill="url(#metal)"/>`,
    title:`<path d="M82 156 L238 156 L218 258 L102 258 Z" fill="url(#metal)"/><path d="M112 124 L160 76 L208 124" fill="none" stroke="${stroke}" stroke-width="16" stroke-linecap="round"/>`,
    frame:`<rect x="78" y="80" width="164" height="252" rx="18" fill="none" stroke="url(#metal)" stroke-width="24"/><rect x="116" y="126" width="88" height="160" rx="8" ${faint}/>`,
    cardback:`<rect x="92" y="72" width="136" height="272" rx="18" fill="url(#metal)"/><path d="M124 124 L196 292 M196 124 L124 292" stroke="${stroke}" stroke-width="10" opacity=".35"/>`,
    gem:`<path d="M160 64 L238 152 L160 352 L82 152 Z" fill="url(#metal)"/>`,
  };
  return map[glyph] || map.gem;
}

function iconSvg(entity, meta) {
  const pal = rarityPalette[entity.rarity] || rarityPalette.common;
  const name = esc(short(entity.name, 24));
  const label = esc(meta.label || entity.type || "Oggetto");
  const rarity = esc(rarityLabel(entity.rarity));
  const slot = esc(slotLabel(meta.slot || itemSlot(entity)));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420">
  <defs>
    <radialGradient id="bg" cx="50%" cy="34%" r="78%"><stop offset="0%" stop-color="#5f6f86"/><stop offset="42%" stop-color="${pal.bg}"/><stop offset="100%" stop-color="#0a1020"/></radialGradient>
    <radialGradient id="halo" cx="50%" cy="42%" r="54%"><stop offset="0%" stop-color="${pal.ink}" stop-opacity=".32"/><stop offset="55%" stop-color="${pal.a}" stop-opacity=".16"/><stop offset="100%" stop-color="${pal.b}" stop-opacity="0"/></radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="19%" stop-color="${pal.ink}"/><stop offset="56%" stop-color="${pal.a}"/><stop offset="100%" stop-color="${pal.b}"/></linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${pal.ink}"/><stop offset="46%" stop-color="${pal.a}"/><stop offset="100%" stop-color="${pal.b}"/></linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="lift" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#020617" flood-opacity=".55"/></filter>
  </defs>
  <rect x="10" y="10" width="400" height="400" rx="36" fill="url(#bg)"/>
  <rect x="18" y="18" width="384" height="384" rx="28" fill="none" stroke="url(#frame)" stroke-width="6"/>
  <path d="M40 96 C98 38 322 38 380 96 L360 118 C300 82 120 82 60 118 Z" fill="#fff" opacity=".05"/>
  <circle cx="210" cy="190" r="142" fill="url(#halo)" filter="url(#glow)"/>
  <circle cx="210" cy="190" r="108" fill="#020617" opacity=".18"/>
  <g transform="translate(48 4) scale(1.02)" filter="url(#lift)">${glyphSvg(meta.glyph, pal)}</g>
  <path d="M70 290 C130 314 290 314 350 290" fill="none" stroke="${pal.a}" stroke-width="2" opacity=".3"/>
  <text x="210" y="325" text-anchor="middle" fill="#f8fafc" font-size="25" font-family="Georgia,serif" font-weight="700">${name}</text>
  <text x="210" y="356" text-anchor="middle" fill="${pal.a}" font-size="15" font-family="Arial,sans-serif" letter-spacing="2">${rarity}</text>
  <text x="210" y="382" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="Arial,sans-serif">${label} - ${slot}</text>
</svg>`;
}

function profileWearTransform(profile, slot) {
  const table = {
    slender: {
      chest:[0.92, 1.02, 0, 0], legs:[0.9, 1.04, 0, 8], boots:[0.9, 1, 0, 14], gloves:[0.88, 1, 0, 0],
      head:[0.9, 0.96, 0, -4], weapon:[0.92, 1, 8, 0], offhand:[0.9, 1, -10, 0],
    },
    small: {
      chest:[0.72, 0.78, 0, 68], legs:[0.7, 0.76, 0, 92], boots:[0.68, 0.7, 0, 122], gloves:[0.66, 0.72, 0, 56],
      cloak:[0.76, 0.8, 0, 70], head:[0.7, 0.72, 0, 28], weapon:[0.72, 0.78, 20, 72], offhand:[0.7, 0.76, -18, 72],
      amulet:[0.68, 0.72, 0, 54], ring1:[0.62, 0.66, 18, 58], ring2:[0.62, 0.66, -18, 58],
    },
    stocky: {
      chest:[1.1, 0.96, 0, 18], legs:[1.02, 0.9, 0, 54], boots:[1.02, 0.86, 0, 78], gloves:[1.12, 0.94, 0, 22],
      cloak:[1.06, 0.94, 0, 34], head:[1.04, 0.94, 0, 10], weapon:[1, 0.92, 16, 36], offhand:[1.08, 0.94, -18, 34],
    },
    massive: {
      chest:[1.22, 1.08, 0, -10], legs:[1.16, 1.08, 0, -6], boots:[1.14, 1.02, 0, 2], gloves:[1.22, 1.06, 0, -2],
      cloak:[1.2, 1.08, 0, -12], head:[1.12, 1.06, 0, -28], weapon:[1.18, 1.08, 18, -4], offhand:[1.18, 1.08, -22, -4],
    },
    draconic: {
      chest:[1.12, 1.02, 0, 0], legs:[1.08, 1.02, 0, 8], boots:[1.04, 0.98, 0, 14], gloves:[1.12, 1, 0, 4],
      cloak:[1.08, 1.04, 0, 0], head:[1.08, 1, 0, -24], weapon:[1.1, 1.02, 16, 0], offhand:[1.08, 1.02, -18, 0],
    },
    horned: {
      head:[0.92, 0.9, 0, 24], cloak:[1.04, 1, 0, 8], weapon:[1, 1, 12, 0], offhand:[1, 1, -12, 0],
    },
    winged: {
      cloak:[0.98, 0.92, 0, 34], chest:[0.98, 1, 0, 0], weapon:[1, 1, 12, 0], offhand:[0.98, 1, -12, 0],
      head:[0.96, 0.96, 0, -8],
    },
    aquatic: {
      chest:[0.96, 1.02, 0, 0], legs:[0.98, 1.02, 0, 8], boots:[0.94, 0.98, 0, 18], gloves:[0.94, 1, 0, 4],
      head:[0.94, 0.96, 0, -6], weapon:[0.98, 1, 12, 0], offhand:[0.96, 1, -12, 0],
    },
    ethereal: {
      chest:[0.94, 1.04, 0, 0], legs:[0.94, 1.04, 0, 8], boots:[0.92, 1, 0, 18], gloves:[0.9, 1, 0, 4],
      cloak:[0.96, 1.05, 0, 0], head:[0.92, 0.98, 0, -6], weapon:[0.96, 1.02, 12, 0], offhand:[0.94, 1.02, -12, 0],
    },
    construct: {
      chest:[1.12, 1.02, 0, 0], legs:[1.08, 1.02, 0, 8], boots:[1.06, 1, 0, 16], gloves:[1.12, 1, 0, 4],
      cloak:[1.08, 1.02, 0, 0], head:[1, 0.96, 0, -12], weapon:[1.08, 1, 16, 0], offhand:[1.08, 1, -18, 0],
    },
  };
  const [sx=1, sy=1, dx=0, dy=0] = table[profile]?.[slot] || [1, 1, 0, 0];
  if(sx === 1 && sy === 1 && dx === 0 && dy === 0) return "";
  return `transform="translate(${dx} ${dy}) translate(160 320) scale(${sx} ${sy}) translate(-160 -320)"`;
}

function wearSvg(entity, meta, profile = "normal") {
  const pal = rarityPalette[entity.rarity] || rarityPalette.common;
  const slot = meta.slot || itemSlot(entity);
  const glyph = meta.glyph;
  const key = `${entity.id || ""} ${entity.name || ""}`.toLowerCase();
  const isCloth = /robe|mantle|cloak|cappa|mantello|tunica|lana|tela|strappato|kilt|pants|pantaloni/.test(key);
  const isLeather = /leather|cuoio|hide|briar|ranger|scout|hunter|fur|pelliccia/.test(key);
  const isGold = entity.rarity === "legendary" || entity.rarity === "mythic" || /gold|oro|auric|solar|sun|titano|zodar/.test(key);
  const base = isGold ? "#b7791f" : isLeather ? "#6b3f24" : isCloth ? "#d8d4c8" : "#64748b";
  const dark = isGold ? "#3b2508" : isLeather ? "#26170d" : isCloth ? "#5b554a" : "#1f2937";
  const hi = isGold ? "#fde68a" : isLeather ? "#d6a15d" : isCloth ? "#f8fafc" : "#e2e8f0";
  const common = `<defs>
    <linearGradient id="mat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${hi}"/><stop offset="42%" stop-color="${base}"/><stop offset="100%" stop-color="${dark}"/></linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity=".75"/><stop offset="45%" stop-color="${pal.ink}" stop-opacity=".28"/><stop offset="100%" stop-color="#020617" stop-opacity=".45"/></linearGradient>
    <linearGradient id="trim" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${pal.a}"/><stop offset="100%" stop-color="${pal.b}"/></linearGradient>
    <radialGradient id="jewel" cx="38%" cy="28%" r="70%"><stop offset="0%" stop-color="#fff"/><stop offset="28%" stop-color="${pal.ink}"/><stop offset="70%" stop-color="${pal.a}"/><stop offset="100%" stop-color="${pal.b}"/></radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#020617" flood-opacity=".52"/></filter>
  </defs>`;
  const seam = `stroke="#111827" stroke-width="3" opacity=".42" fill="none"`;
  const trim = `stroke="url(#trim)" stroke-width="5" opacity=".76" fill="none"`;
  // ── Corpo 320×640: testa y=35-125, spalle y=140, mani y=390, piedi y=600 ──
  // Arma impugnata in mano dx del personaggio = lato SINISTRO del canvas (x≈80)
  // Grip della spada a y≈368-408, lama punta in ALTO verso y≈165
  const weaponHead = ({
    bow:`<path d="M80 192 C30 306 40 470 98 538" ${trim} stroke-width="11"/><path d="M80 192 C72 308 76 462 98 538" stroke="#e5e7eb" stroke-width="2" opacity=".5" fill="none"/><path d="M94 366 L175 366" stroke="url(#mat)" stroke-width="8" stroke-linecap="round"/><path d="M175 366 L150 354 M175 366 L150 378" stroke="#e5e7eb" stroke-width="5" stroke-linecap="round"/><circle cx="93" cy="366" r="7" fill="url(#jewel)" opacity=".75"/>`,
    crossbow:`<path d="M52 350 C90 318 154 318 194 350" ${trim} stroke-width="9"/><path d="M122 308 L122 430" stroke="url(#mat)" stroke-width="13" stroke-linecap="round"/><path d="M64 372 L182 372" stroke="url(#mat)" stroke-width="13" stroke-linecap="round"/><path d="M122 310 L90 276 M122 310 L154 276" stroke="#e5e7eb" stroke-width="4" opacity=".55"/><circle cx="122" cy="372" r="9" fill="url(#jewel)" opacity=".7"/>`,
    spear:`<path d="M84 78 L112 148 L80 130 Z" fill="url(#mat)"/><path d="M82 130 L94 408" stroke="url(#trim)" stroke-width="10" stroke-linecap="round"/><path d="M74 170 L104 176" stroke="#e5e7eb" stroke-width="4" opacity=".55"/><path d="M90 108 L98 136" stroke="#fff" stroke-width="3" opacity=".45"/><circle cx="90" cy="412" r="8" fill="url(#mat)" opacity=".7"/>`,
    axe:`<path d="M82 120 C142 104 164 162 110 208 C104 168 94 140 82 120 Z" fill="url(#mat)"/><path d="M92 150 L86 408" stroke="url(#trim)" stroke-width="11" stroke-linecap="round"/><path d="M80 206 L130 226" stroke="#111827" stroke-width="4" opacity=".35"/><path d="M98 132 C126 132 142 148 138 168" stroke="#fff" stroke-width="4" opacity=".35" fill="none"/><circle cx="89" cy="413" r="9" fill="url(#mat)" opacity=".7"/>`,
    mace:`<circle cx="88" cy="114" r="34" fill="url(#mat)"/><path d="M60 98 L116 130 M116 98 L60 130 M88 80 L88 150 M62 114 L114 114" stroke="#111827" stroke-width="4" opacity=".3"/><path d="M88 150 L90 408" stroke="url(#trim)" stroke-width="12" stroke-linecap="round"/><circle cx="76" cy="100" r="7" fill="#fff" opacity=".28"/><circle cx="90" cy="412" r="10" fill="url(#mat)" opacity=".7"/>`,
    staff:`<circle cx="86" cy="72" r="26" fill="url(#jewel)"/><path d="M66 92 C80 118 102 118 116 92" ${trim}/><path d="M86 98 C68 195 108 295 80 408" stroke="url(#trim)" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="76" cy="66" r="8" fill="#fff" opacity=".34"/><circle cx="82" cy="412" r="9" fill="url(#mat)" opacity=".7"/>`,
    book:`<g transform="translate(18 158) scale(.84)"><path d="M84 96 C122 74 152 88 152 120 L152 308 C120 290 100 292 84 310 Z" fill="url(#mat)"/><path d="M152 120 C178 88 220 74 252 96 L252 310 C220 292 184 290 152 308 Z" fill="url(#mat)" opacity=".86"/><path d="M152 120 L152 308" ${seam}/><path d="M104 128 L132 118 M180 128 L226 112" ${seam}/></g>`,
    orb:`<circle cx="86" cy="168" r="40" fill="url(#mat)"/><circle cx="72" cy="155" r="11" fill="#fff" opacity=".35"/><path d="M86 210 L88 408" stroke="url(#trim)" stroke-width="10" stroke-linecap="round"/><circle cx="88" cy="412" r="9" fill="url(#mat)" opacity=".7"/>`,
  })[glyph] ||
  // SPADA DEFAULT: lama da y=168 a y=363, guardia a y=363-376, impugnatura y=376-410
  `<path d="M84 168 L108 182 L100 363 L76 376 L74 357 Z" fill="url(#mat)"/>
   <path d="M100 184 C96 268 98 330 92 357" stroke="url(#edge)" stroke-width="7" opacity=".48" fill="none"/>
   <path d="M46 360 L127 360 L124 376 L48 376 Z" fill="url(#mat)"/>
   <path d="M46 362 L127 362" stroke="url(#trim)" stroke-width="3" opacity=".7"/>
   <path d="M76 376 L100 376 L98 410 L74 410 Z" fill="url(#mat)"/>
   <circle cx="86" cy="416" r="10" fill="url(#jewel)" opacity=".82"/>
   <path d="M86 170 C80 200 84 280 88 356" stroke="#fff" stroke-width="3" opacity=".28" fill="none"/>`;

  const shapes = {
    // TESTA: copre y=38-136, x=106-214 (testa reale nel body PNG)
    head: glyph === "hood"
      ? `<path d="M102 130 C106 44 214 44 218 130 L210 160 C184 178 136 178 110 160 Z" fill="url(#mat)"/>
         <path d="M114 128 C134 148 186 148 206 128 L200 158 C178 172 142 172 120 158 Z" fill="url(#edge)" opacity=".45"/>
         <path d="M124 148 C134 108 186 108 196 148 C174 136 146 136 124 148 Z" fill="#020617" opacity=".62"/>
         <path d="M112 132 C134 150 186 150 208 132" ${trim}/>
         <path d="M130 84 C148 72 172 72 190 84" ${seam}/>`
      : `<path d="M106 130 C112 42 208 42 214 130 L208 150 C184 168 136 168 112 150 Z" fill="url(#mat)"/>
         <path d="M116 112 C134 78 186 78 204 112 L200 148 C178 162 142 162 120 148 Z" fill="url(#edge)" opacity=".42"/>
         <path d="M124 124 L196 124" stroke="#020617" stroke-width="13" opacity=".55"/>
         <path d="M160 50 L160 166" ${seam}/>
         <path d="M118 94 C98 70 100 50 128 68 M202 94 C222 70 220 50 192 68" ${trim}/>`,
    // PETTO: spalle y=130-155, vita y=320, pauldron x=62-258
    chest:`<path d="M90 158 C112 124 208 124 230 158 L212 325 C184 348 136 348 108 325 Z" fill="url(#mat)"/>
      <path d="M70 170 C100 138 124 134 148 152 L132 216 C110 206 90 200 66 202 Z M172 152 C196 134 220 138 250 170 L254 202 C230 200 210 206 188 216 Z" fill="url(#mat)" opacity=".9"/>
      <path d="M110 164 C130 144 190 144 210 164 L198 298 C176 314 144 314 122 298 Z" fill="url(#edge)" opacity=".33"/>
      <path d="M124 150 L160 218 L196 150" ${seam}/>
      <circle cx="160" cy="210" r="14" fill="url(#jewel)" opacity=".7"/>
      <path d="M110 266 C136 288 184 288 210 266" ${trim}/>
      <path d="M104 192 L216 192 M106 234 L214 234 M118 298 L202 298" ${seam}/>`,
    // GAMBE: anche y=325-340, ginocchio y=452, caviglia y=548
    legs:`<path d="M110 332 L152 332 L146 546 L96 546 Z M168 332 L210 332 L224 546 L174 546 Z" fill="url(#mat)"/>
      <path d="M120 352 L144 352 L138 528 L104 528 Z M176 352 L200 352 L216 528 L182 528 Z" fill="url(#edge)" opacity=".32"/>
      <path d="M128 350 L120 530 M188 350 L198 530" ${seam}/>
      <path d="M112 332 C136 344 184 344 208 332" ${trim}/>
      <path d="M102 428 L148 428 M172 428 L220 428 M100 480 L146 480 M174 480 L220 480" ${seam}/>`,
    // STIVALI: caviglia y=548, piede y=610
    boots:`<path d="M100 544 L152 544 L148 600 L72 615 C80 584 92 566 100 544 Z M168 544 L220 544 C228 566 240 584 248 615 L172 600 Z" fill="url(#mat)"/>
      <path d="M108 554 L144 554 L140 592 L82 606 C88 578 98 562 108 554 Z M176 554 L212 554 C222 562 232 578 238 606 L180 592 Z" fill="url(#edge)" opacity=".34"/>
      <path d="M90 578 L148 578 M172 578 L230 578" ${seam}/>
      <path d="M74 615 L150 608 M170 608 L246 615" ${trim}/>
      <path d="M124 546 L120 594 M196 546 L202 594" ${seam}/>`,
    // GUANTI: mani a y=370-420, braccia a x=48-100 e x=220-272
    gloves:`<path d="M46 368 L98 386 L90 428 L34 410 Z M222 386 L274 368 L286 410 L230 428 Z" fill="url(#mat)"/>
      <path d="M56 382 L90 394 L84 418 L44 408 Z M230 394 L264 382 L276 408 L236 418 Z" fill="url(#edge)" opacity=".34"/>
      <path d="M56 392 L94 406 M226 406 L264 392" ${seam}/>
      <path d="M40 410 L90 428 M230 428 L280 410" ${trim}/>`,
    // MANTELLO: parte dalle spalle, scende fino ai piedi
    cloak:`<path d="M86 118 C124 150 196 150 234 118 L274 598 C224 622 96 622 46 598 Z" fill="url(#mat)" opacity=".72"/>
      <path d="M106 150 C136 172 184 172 214 150 L236 574 C196 596 124 596 84 574 Z" fill="url(#edge)" opacity=".2"/>
      <path d="M98 140 C130 166 190 166 222 140" ${trim}/>
      <path d="M74 210 C100 310 96 430 58 586 M246 210 C220 310 224 430 262 586" ${seam}/>`,
    weapon:weaponHead,
    // OFFHAND: mano sinistra del personaggio = lato DESTRO del canvas (x≈240)
    offhand:`<path d="M238 170 C298 194 312 330 244 415 C176 330 190 194 238 170 Z" fill="url(#mat)" opacity=".94"/>
      <path d="M212 210 C234 196 260 196 282 210 C282 278 266 336 242 370 C218 336 202 278 212 210 Z" fill="url(#edge)" opacity=".34"/>
      <path d="M238 196 L238 374" ${seam}/>
      <path d="M198 292 C222 314 256 314 280 292" ${trim}/>
      <circle cx="238" cy="295" r="18" fill="url(#jewel)" opacity=".68"/>`,
    // AMULETO: collana a y=128-150, pendente a y=168-200
    amulet:`<path d="M118 128 C136 172 184 172 202 128" ${trim}/>
      <path d="M160 178 L196 224 L160 276 L124 224 Z" fill="url(#mat)"/>
      <circle cx="160" cy="220" r="14" fill="url(#jewel)" opacity=".75"/>`,
    // ANELLI: dita a y=396-408
    ring1:`<circle cx="72" cy="400" r="16" fill="none" stroke="url(#trim)" stroke-width="8"/><circle cx="72" cy="400" r="7" fill="#020617" opacity=".38"/>`,
    ring2:`<circle cx="248" cy="400" r="16" fill="none" stroke="url(#trim)" stroke-width="8"/><circle cx="248" cy="400" r="7" fill="#020617" opacity=".38"/>`,
  };
  const body = shapes[slot] || shapes.amulet;
  const bodyTransform = profileWearTransform(profile, slot);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 640">
  ${common}
  <g filter="url(#shadow)" ${bodyTransform}>${body}</g>
</svg>`;
}

function cosmeticWearSvg(entity, meta) {
  const pal = rarityPalette[entity.rarity] || rarityPalette.common;
  const type = entity.type;
  const serial = Number(String(entity.id || "").match(/_(\d+)$/)?.[1] || 1);
  const variant = Number.isFinite(serial) ? serial % 5 : 0;
  const common = `<defs>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${pal.a}"/><stop offset="52%" stop-color="${pal.ink}"/><stop offset="100%" stop-color="${pal.b}"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="68%"><stop offset="0%" stop-color="${pal.ink}" stop-opacity=".48"/><stop offset="52%" stop-color="${pal.a}" stop-opacity=".18"/><stop offset="100%" stop-color="${pal.b}" stop-opacity="0"/></radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="wide"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;
  const runes = `
    <circle cx="${132 + variant * 7}" cy="${214 + variant * 11}" r="3" fill="${pal.ink}" opacity=".5"/>
    <circle cx="${205 - variant * 6}" cy="${286 + variant * 8}" r="2.5" fill="${pal.a}" opacity=".5"/>
    <path d="M${148 + variant * 3} ${245 + variant * 8} L${172 + variant * 3} ${245 + variant * 8}" stroke="${pal.ink}" stroke-width="3" opacity=".42"/>
  `;
  const particles = Array.from({ length:10 }, (_, i) => {
    const x = 54 + ((i * 47 + variant * 19) % 214);
    const y = 112 + ((i * 61 + variant * 23) % 410);
    const r = 2 + ((i + variant) % 3);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? pal.a : pal.ink}" opacity=".55"/>`;
  }).join("");
  const shapes = {
    hood:`
      <g filter="url(#soft)">
        <path d="M98 196 C94 104 226 104 222 196 C194 176 126 176 98 196 Z" fill="url(#metal)" opacity=".94"/>
        <path d="M119 190 C130 136 190 136 201 190 C181 174 139 174 119 190 Z" fill="#020617" opacity=".58"/>
        <path d="M104 198 C126 226 194 226 216 198" fill="none" stroke="${pal.ink}" stroke-width="7" opacity=".28"/>
        ${runes}
      </g>`,
    helmet:`
      <g filter="url(#soft)">
        <path d="M104 150 C110 80 210 80 216 150 L210 200 C184 216 136 216 110 200 Z" fill="url(#metal)" opacity=".95"/>
        <path d="M124 154 L196 154" stroke="#020617" stroke-width="15" stroke-linecap="round" opacity=".48"/>
        <path d="M160 88 L160 208" stroke="${pal.ink}" stroke-width="5" opacity=".32"/>
        ${variant % 2 === 0 ? `<path d="M112 124 C80 96 78 76 120 94 M208 124 C240 96 242 76 200 94" fill="none" stroke="${pal.a}" stroke-width="9" stroke-linecap="round" opacity=".7"/>` : `<path d="M128 84 L160 52 L192 84" fill="none" stroke="${pal.a}" stroke-width="9" stroke-linecap="round" opacity=".78"/>`}
      </g>`,
    cloak:`
      <g filter="url(#wide)">
        <path d="M78 120 C116 150 204 150 242 120 L286 556 C238 594 82 594 34 556 Z" fill="url(#metal)" opacity=".72"/>
        <path d="M92 138 C124 166 196 166 228 138 L218 202 C188 222 132 222 102 202 Z" fill="#020617" opacity=".22"/>
        <path d="M64 190 C92 306 92 438 56 546 M256 190 C228 306 228 438 264 546" fill="none" stroke="${pal.ink}" stroke-width="8" opacity=".24"/>
        <path d="M98 132 C130 158 190 158 222 132" fill="none" stroke="${pal.a}" stroke-width="7" opacity=".72"/>
        ${runes}
      </g>`,
    armor_skin:`
      <g filter="url(#soft)">
        <path d="M96 174 C118 140 202 140 224 174 L210 336 C184 362 136 362 110 336 Z" fill="url(#metal)" opacity=".78"/>
        <path d="M78 184 C104 154 128 150 148 166 L132 218 C112 210 92 202 72 206 Z M172 166 C192 150 216 154 242 184 L248 206 C228 202 208 210 188 218 Z" fill="url(#metal)" opacity=".68"/>
        <path d="M128 166 L160 226 L192 166" fill="none" stroke="${pal.ink}" stroke-width="7" opacity=".38"/>
        <path d="M116 276 C140 294 180 294 204 276" fill="none" stroke="#020617" stroke-width="5" opacity=".28"/>
        ${runes}
      </g>`,
    weapon_skin:`
      <g filter="url(#soft)">
        <path d="M236 86 L260 112 L138 438 L114 452 L130 418 Z" fill="url(#metal)" opacity=".95"/>
        <path d="M100 468 L164 404" stroke="${pal.ink}" stroke-width="16" stroke-linecap="round" opacity=".9"/>
        <path d="M132 426 L162 456" stroke="${pal.a}" stroke-width="12" stroke-linecap="round" opacity=".82"/>
        <path d="M232 100 C208 196 174 296 132 424" fill="none" stroke="#fff" stroke-width="4" opacity=".34"/>
        <circle cx="${222 - variant * 7}" cy="${154 + variant * 28}" r="5" fill="${pal.ink}" opacity=".6"/>
      </g>`,
    aura:`
      <g filter="url(#wide)">
        <ellipse cx="160" cy="320" rx="122" ry="254" fill="url(#glow)" opacity=".46"/>
        <ellipse cx="160" cy="320" rx="114" ry="240" fill="none" stroke="url(#metal)" stroke-width="11" opacity=".6"/>
        <ellipse cx="160" cy="320" rx="82" ry="190" fill="none" stroke="${pal.ink}" stroke-width="4" opacity=".32"/>
        <path d="M58 238 C104 168 216 168 262 238 M58 404 C104 488 216 488 262 404" fill="none" stroke="${pal.a}" stroke-width="6" opacity=".3"/>
        ${particles}
      </g>`,
    mascot:`
      <g transform="translate(${198 + variant * 3} ${420 - variant * 4})" filter="url(#soft)">
        <ellipse cx="42" cy="136" rx="42" ry="12" fill="#020617" opacity=".38"/>
        <path d="M18 58 C-10 42 -8 12 18 22" fill="none" stroke="${pal.a}" stroke-width="9" stroke-linecap="round" opacity=".72"/>
        <path d="M64 58 C92 42 90 12 64 22" fill="none" stroke="${pal.b}" stroke-width="9" stroke-linecap="round" opacity=".72"/>
        <circle cx="42" cy="58" r="34" fill="url(#metal)" opacity=".92"/>
        <path d="M20 42 L8 18 L36 30 Z M64 42 L76 18 L48 30 Z" fill="url(#metal)" opacity=".82"/>
        <circle cx="30" cy="52" r="4" fill="#020617" opacity=".78"/>
        <circle cx="54" cy="52" r="4" fill="#020617" opacity=".78"/>
        <path d="M29 70 C36 78 48 78 55 70" fill="none" stroke="#020617" stroke-width="4" stroke-linecap="round" opacity=".62"/>
        <circle cx="${24 + variant * 5}" cy="${22 + variant * 3}" r="3" fill="${pal.ink}" opacity=".72"/>
      </g>`,
  };
  const body = shapes[type] || shapes[meta.glyph] || shapes.armor_skin;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 640">
  ${common}
  ${body}
</svg>`;
}

function buildCosmetics() {
  const generated = cosmeticFamilies.flatMap(family =>
    Array.from({ length:family.count }, (_, index) => {
      const serial = String(index + 1).padStart(2, "0");
      const theme = cosmeticThemes[index % cosmeticThemes.length];
      return {
        id:`cos_${family.type}_${serial}`,
        name:`${family.label} ${theme}`,
        type:family.type,
        rarity:cosmeticRarity(index, family.count, family.minRarity),
        glyph:family.glyph,
        slot:family.slot,
      };
    })
  );
  return [...baseCosmetics, ...generated];
}

async function main() {
  await Promise.all([
    iconDir,
    wearDir,
    cosmeticIconDir,
    cosmeticWearDir,
    ...(generateBodyProfileWearAssets ? bodyProfiles.filter(profile => profile !== "normal").map(profile => path.join(wearDir, profile)) : []),
  ].map(dir => mkdir(dir, { recursive:true })));

  const items = [...DEFAULT_ITEMS, ...legendaryItems];
  for(const item of items) {
    const meta = metaFor(item);
    await writeFile(path.join(iconDir, `${item.id}.svg`), iconSvg(item, meta), "utf8");
    if(meta.slot || itemSlot(item)) {
      await writeFile(path.join(wearDir, `${item.id}.svg`), wearSvg(item, meta), "utf8");
      if(generateBodyProfileWearAssets) {
        for(const profile of bodyProfiles.filter(value => value !== "normal")) {
          await writeFile(path.join(wearDir, profile, `${item.id}.svg`), wearSvg(item, meta, profile), "utf8");
        }
      }
    }
  }

  const cosmetics = buildCosmetics();
  for(const cosmetic of cosmetics) {
    const meta = { label:cosmetic.type, glyph:cosmetic.glyph, slot:cosmetic.slot };
    await writeFile(path.join(cosmeticIconDir, `${cosmetic.id}.svg`), iconSvg(cosmetic, meta), "utf8");
    if(cosmetic.slot) {
      await writeFile(path.join(cosmeticWearDir, `${cosmetic.id}.svg`), cosmeticWearSvg(cosmetic, meta), "utf8");
    }
  }

  console.log(`Generated ${items.length} item icons, ${items.filter(item => itemSlot(item)).length} item wear assets, ${cosmetics.length} cosmetic icons.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
