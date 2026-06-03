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
  const weaponHead = ({
    bow:`<path d="M78 126 C28 260 38 438 96 558" ${trim} stroke-width="11"/><path d="M78 126 C70 260 74 432 96 558" stroke="#e5e7eb" stroke-width="2" opacity=".5" fill="none"/><path d="M92 334 L178 334" stroke="url(#mat)" stroke-width="8" stroke-linecap="round"/><path d="M178 334 L150 322 M178 334 L150 346" stroke="#e5e7eb" stroke-width="5" stroke-linecap="round"/><circle cx="91" cy="334" r="7" fill="url(#jewel)" opacity=".75"/>`,
    crossbow:`<path d="M50 304 C92 270 154 270 196 304" ${trim} stroke-width="9"/><path d="M122 260 L122 420" stroke="url(#mat)" stroke-width="13" stroke-linecap="round"/><path d="M62 344 L182 344" stroke="url(#mat)" stroke-width="13" stroke-linecap="round"/><path d="M122 262 L88 226 M122 262 L156 226" stroke="#e5e7eb" stroke-width="4" opacity=".55"/><circle cx="122" cy="344" r="9" fill="url(#jewel)" opacity=".7"/>`,
    spear:`<path d="M84 78 L112 150 L80 132 Z" fill="url(#mat)"/><path d="M82 132 L96 574" stroke="url(#trim)" stroke-width="10" stroke-linecap="round"/><path d="M74 172 L104 178" stroke="#e5e7eb" stroke-width="4" opacity=".55"/><path d="M90 110 L98 138" stroke="#fff" stroke-width="3" opacity=".45"/>`,
    axe:`<path d="M82 120 C142 104 164 164 110 210 C104 170 94 142 82 120 Z" fill="url(#mat)"/><path d="M92 150 L86 574" stroke="url(#trim)" stroke-width="11" stroke-linecap="round"/><path d="M80 208 L130 228" stroke="#111827" stroke-width="4" opacity=".35"/><path d="M98 132 C126 132 142 148 138 168" stroke="#fff" stroke-width="4" opacity=".35" fill="none"/>`,
    mace:`<path d="M90 96 L120 126 L90 156 L60 126 Z" fill="url(#mat)"/><circle cx="90" cy="126" r="34" fill="url(#mat)"/><path d="M90 160 L94 574" stroke="url(#trim)" stroke-width="12" stroke-linecap="round"/><path d="M62 110 L118 142 M118 110 L62 142" stroke="#111827" stroke-width="4" opacity=".3"/><circle cx="78" cy="112" r="7" fill="#fff" opacity=".28"/>`,
    staff:`<path d="M88 72 C70 186 112 290 82 574" stroke="url(#trim)" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="88" cy="78" r="25" fill="url(#jewel)"/><path d="M68 96 C82 122 104 122 118 96" ${trim}/><circle cx="78" cy="68" r="8" fill="#fff" opacity=".34"/>`,
    book:`<g transform="translate(34 232) scale(.78)"><path d="M84 96 C122 74 152 88 152 120 L152 318 C120 300 100 302 84 320 Z" fill="url(#mat)"/><path d="M152 120 C178 88 220 74 252 96 L252 320 C220 302 184 300 152 318 Z" fill="url(#mat)" opacity=".86"/><path d="M152 120 L152 318" ${seam}/><path d="M104 128 L132 118 M180 128 L226 112" ${seam}/></g>`,
    orb:`<circle cx="86" cy="178" r="40" fill="url(#mat)"/><circle cx="72" cy="164" r="11" fill="#fff" opacity=".35"/><path d="M86 222 L88 574" stroke="url(#trim)" stroke-width="10" stroke-linecap="round"/>`,
  })[glyph] || `<path d="M92 146 L120 166 L108 530 L84 548 L82 510 Z" fill="url(#mat)"/><path d="M92 168 C88 286 92 402 86 506" stroke="url(#edge)" stroke-width="7" opacity=".48" fill="none"/><path d="M62 560 L128 498" stroke="url(#trim)" stroke-width="14" stroke-linecap="round"/><path d="M72 502 L136 500" stroke="${pal.a}" stroke-width="9" stroke-linecap="round"/><circle cx="101" cy="504" r="9" fill="url(#jewel)" opacity=".76"/><path d="M101 170 C94 280 98 404 88 510" stroke="#fff" stroke-width="4" opacity=".32" fill="none"/>`;
  const shapes = {
    head: glyph === "hood"
      ? `<path d="M100 116 C104 50 216 50 220 116 L208 188 C184 204 136 204 112 188 Z" fill="url(#mat)"/><path d="M112 126 C132 144 188 144 208 126 L202 182 C178 197 142 197 118 182 Z" fill="url(#edge)" opacity=".45"/><path d="M122 170 C132 116 188 116 198 170 C176 158 144 158 122 170 Z" fill="#020617" opacity=".62"/><path d="M110 128 C132 146 188 146 210 128" ${trim}/><path d="M128 88 C146 76 174 76 192 88" ${seam}/>`
      : `<path d="M104 126 C110 48 210 48 216 126 L208 178 C184 198 136 198 112 178 Z" fill="url(#mat)"/><path d="M114 112 C132 82 188 82 206 112 L202 178 C178 194 142 194 118 178 Z" fill="url(#edge)" opacity=".42"/><path d="M124 128 L196 128" stroke="#020617" stroke-width="13" opacity=".55"/><path d="M160 56 L160 194" ${seam}/><path d="M116 98 C96 74 98 54 126 72 M204 98 C224 74 222 54 194 72" ${trim}/>` ,
    chest:`<path d="M90 158 C112 124 208 124 230 158 L212 338 C184 362 136 362 108 338 Z" fill="url(#mat)"/><path d="M70 172 C100 140 124 136 148 154 L132 218 C110 208 90 202 66 204 Z M172 154 C196 136 220 140 250 172 L254 204 C230 202 210 208 188 218 Z" fill="url(#mat)" opacity=".9"/><path d="M110 166 C130 146 190 146 210 166 L198 304 C176 322 144 322 122 304 Z" fill="url(#edge)" opacity=".33"/><path d="M124 152 L160 222 L196 152" ${seam}/><circle cx="160" cy="214" r="14" fill="url(#jewel)" opacity=".7"/><path d="M110 270 C136 292 184 292 210 270" ${trim}/><path d="M104 194 L216 194 M106 238 L214 238 M118 302 L202 302" ${seam}/>`,
    legs:`<path d="M112 330 L154 330 L148 522 L98 522 Z M166 330 L208 330 L222 522 L172 522 Z" fill="url(#mat)"/><path d="M122 350 L146 350 L140 504 L106 504 Z M174 350 L198 350 L214 504 L180 504 Z" fill="url(#edge)" opacity=".32"/><path d="M128 348 L120 506 M188 348 L198 506" ${seam}/><path d="M112 330 C136 342 184 342 208 330" ${trim}/><path d="M102 420 L150 420 M170 420 L218 420" ${seam}/>`,
    boots:`<path d="M100 500 L152 500 L148 572 L76 572 C82 540 94 522 100 500 Z M168 500 L220 500 C226 522 238 540 244 572 L172 572 Z" fill="url(#mat)"/><path d="M108 510 L144 510 L140 558 L86 558 C92 536 100 520 108 510 Z M176 510 L212 510 C220 520 228 536 234 558 L180 558 Z" fill="url(#edge)" opacity=".34"/><path d="M92 536 L148 536 M172 536 L228 536" ${seam}/><path d="M78 572 L150 572 M172 572 L244 572" ${trim}/><path d="M122 502 L118 560 M194 502 L200 560" ${seam}/>`,
    gloves:`<path d="M48 234 L100 252 L92 330 L36 312 Z M220 252 L272 234 L284 312 L228 330 Z" fill="url(#mat)"/><path d="M58 250 L92 262 L86 310 L46 300 Z M228 262 L262 250 L274 300 L234 310 Z" fill="url(#edge)" opacity=".34"/><path d="M58 264 L96 278 M224 278 L262 264" ${seam}/><path d="M42 312 L92 330 M228 330 L278 312" ${trim}/>`,
    cloak:`<path d="M86 118 C124 150 196 150 234 118 L276 558 C226 594 94 594 44 558 Z" fill="url(#mat)" opacity=".72"/><path d="M106 150 C136 172 184 172 214 150 L238 540 C198 564 122 564 82 540 Z" fill="url(#edge)" opacity=".2"/><path d="M98 140 C130 166 190 166 222 140" ${trim}/><path d="M74 210 C100 310 96 430 58 548 M246 210 C220 310 224 430 262 548" ${seam}/><path d="M132 156 L112 548 M188 156 L208 548" stroke="#111827" stroke-width="2" opacity=".22" fill="none"/>`,
    weapon:weaponHead,
    offhand:`<path d="M236 204 C292 226 302 342 240 420 C178 342 188 226 236 204 Z" fill="url(#mat)" opacity=".94"/><path d="M210 246 C232 232 258 232 280 246 C280 308 264 362 240 394 C216 362 200 308 210 246 Z" fill="url(#edge)" opacity=".34"/><path d="M236 228 L236 386" ${seam}/><path d="M196 292 C220 314 252 314 276 292" ${trim}/><circle cx="236" cy="306" r="18" fill="url(#jewel)" opacity=".68"/><path d="M206 248 L266 364 M266 248 L206 364" stroke="#020617" stroke-width="4" opacity=".24"/>`,
    amulet:`<path d="M112 122 C130 176 190 176 208 122" ${trim}/><path d="M160 184 L194 230 L160 286 L126 230 Z" fill="url(#mat)"/><circle cx="160" cy="226" r="12" fill="#fff" opacity=".26"/>`,
    ring1:`<circle cx="74" cy="294" r="18" fill="none" stroke="url(#trim)" stroke-width="8"/><circle cx="74" cy="294" r="8" fill="#020617" opacity=".38"/>`,
    ring2:`<circle cx="246" cy="294" r="18" fill="none" stroke="url(#trim)" stroke-width="8"/><circle cx="246" cy="294" r="8" fill="#020617" opacity=".38"/>`,
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
