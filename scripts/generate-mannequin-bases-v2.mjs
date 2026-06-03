import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RACES } from "../src/data/characterData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "assets", "equip");

const genders = ["male", "female"];

const raceLooks = {
  human:{ skin:"#d8aa7a", shade:"#8b5a35", build:"normal" },
  dwarf:{ skin:"#c9905e", shade:"#654020", build:"stocky", beard:true },
  elf:{ skin:"#ead8b9", shade:"#8a6f4c", build:"slender", ears:"long" },
  halfling:{ skin:"#e5b07b", shade:"#8a5a32", build:"small" },
  dragonborn:{ skin:"#a97743", shade:"#7c2d12", build:"strong", head:"dragon", tail:true },
  gnome:{ skin:"#dfa97f", shade:"#7c4a93", build:"small", ears:"short" },
  halfelf:{ skin:"#e6c9a4", shade:"#786044", build:"normal", ears:"short" },
  halforc:{ skin:"#88ad6d", shade:"#3f5f38", build:"strong", tusks:true },
  tiefling:{ skin:"#b86b8c", shade:"#7f1d1d", build:"slender", horns:true, tail:true },
  minotaur:{ skin:"#9a6846", shade:"#5a3823", build:"massive", head:"horned" },
  angel:{ skin:"#ead9bd", shade:"#b89755", build:"slender", halo:true, wings:true },
  succubus:{ skin:"#b86b92", shade:"#7f1d1d", build:"slender", horns:true, tail:true, wings:"small" },
  aasimar:{ skin:"#ead9bd", shade:"#c89b46", build:"normal", glow:true },
  drow:{ skin:"#78638d", shade:"#2e2340", build:"slender", ears:"long" },
  forged:{ skin:"#8d99a6", shade:"#475569", build:"strong", construct:true },
  renegade_vampire:{ skin:"#d7c3be", shade:"#5b2735", build:"slender", fangs:true },
  sirenide:{ skin:"#8cc7c8", shade:"#1d4e66", build:"slender", fins:true },
  echide:{ skin:"#d2b181", shade:"#7c5b2f", build:"normal", echo:true },
  genasi:{ skin:"#8db9d8", shade:"#2563eb", build:"normal", elemental:true },
  ancient_draconid:{ skin:"#b27a43", shade:"#7c2d12", build:"strong", head:"dragon", tail:true },
  shadow_awakened:{ skin:"#4b4560", shade:"#111827", build:"slender", shadow:true },
  fae:{ skin:"#dcb98e", shade:"#8b5cf6", build:"small", wings:"fae", ears:"long" },
  echo_born:{ skin:"#a9bfd9", shade:"#6366f1", build:"normal", echo:true },
  half_djinn:{ skin:"#98d2e6", shade:"#0e7490", build:"normal", elemental:true },
  golemide:{ skin:"#9ca3af", shade:"#52525b", build:"massive", construct:true },
  void_touched:{ skin:"#6d5a8d", shade:"#020617", build:"slender", void:true },
  fallen_seraphite:{ skin:"#d6c1b7", shade:"#6b2138", build:"slender", wings:"broken", halo:"broken" },
  primordial_draconian:{ skin:"#b45309", shade:"#7f1d1d", build:"massive", head:"dragon", tail:true, elemental:"fire" },
  night_child:{ skin:"#8b7aa6", shade:"#1e1b4b", build:"slender", shadow:true },
  ancient_silvan:{ skin:"#8fbc73", shade:"#3f6212", build:"strong", bark:true },
  atlantean:{ skin:"#7bc4c4", shade:"#0f766e", build:"normal", fins:true },
  living_mirror:{ skin:"#cbd5e1", shade:"#64748b", build:"normal", mirror:true },
  entita_primordiale:{ skin:"#c4b5fd", shade:"#0f172a", build:"normal", void:true, halo:true },
};

function esc(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function dims(build, gender) {
  const female = gender === "female";
  return ({
    small:{ head:34, shoulder:44, torsoW:female ? 74 : 82, torsoH:148, arm:23, leg:25, scale:0.86 },
    slender:{ head:39, shoulder:54, torsoW:female ? 78 : 86, torsoH:176, arm:22, leg:26, scale:1 },
    strong:{ head:44, shoulder:76, torsoW:female ? 104 : 122, torsoH:184, arm:31, leg:34, scale:1.03 },
    stocky:{ head:42, shoulder:78, torsoW:female ? 104 : 118, torsoH:154, arm:32, leg:35, scale:0.92 },
    massive:{ head:50, shoulder:88, torsoW:female ? 120 : 140, torsoH:198, arm:36, leg:39, scale:1.04 },
    normal:{ head:41, shoulder:63, torsoW:female ? 88 : 100, torsoH:174, arm:26, leg:30, scale:1 },
  })[build || "normal"];
}

function extras(look, skin, shade) {
  const parts = [];
  if(look.ears === "long") parts.push(`<path d="M116 86 L78 58 L104 108 Z M204 86 L242 58 L216 108 Z" fill="${skin}" stroke="${shade}" stroke-width="3"/>`);
  if(look.ears === "short") parts.push(`<path d="M120 92 L94 78 L110 108 Z M200 92 L226 78 L210 108 Z" fill="${skin}" stroke="${shade}" stroke-width="3"/>`);
  if(look.horns || look.head === "horned") parts.push(`<path d="M128 50 C108 26 94 28 84 44 C104 44 116 54 126 70 Z M192 50 C212 26 226 28 236 44 C216 44 204 54 194 70 Z" fill="#e5d0a0" stroke="${shade}" stroke-width="3"/>`);
  if(look.head === "dragon") parts.push(`<path d="M118 78 L96 54 L120 58 Z M202 78 L224 54 L200 58 Z" fill="${shade}" opacity=".85"/><path d="M132 42 L148 22 L158 50 Z M188 42 L172 22 L162 50 Z" fill="${shade}" opacity=".78"/>`);
  if(look.halo) parts.push(`<ellipse cx="160" cy="30" rx="${look.halo === "broken" ? 38 : 34}" ry="10" fill="none" stroke="#fde68a" stroke-width="5" stroke-dasharray="${look.halo === "broken" ? "24 12" : "0"}" opacity=".86"/>`);
  if(look.wings) {
    const broken = look.wings === "broken";
    const small = look.wings === "small" || look.wings === "fae";
    parts.push(`<path d="M100 150 C36 ${small ? 170 : 130} 34 ${small ? 250 : 310} 108 ${small ? 244 : 300} C78 218 76 182 100 150 Z" fill="${broken ? "#5b2136" : look.wings === "fae" ? "#a7f3d0" : "#e5e7eb"}" opacity=".36"/>
<path d="M220 150 C284 ${small ? 170 : 130} 286 ${small ? 250 : 310} 212 ${small ? 244 : 300} C242 218 244 182 220 150 Z" fill="${broken ? "#5b2136" : look.wings === "fae" ? "#a7f3d0" : "#e5e7eb"}" opacity=".36"/>`);
  }
  if(look.tail) parts.push(`<path d="M202 318 C278 352 248 438 300 472" fill="none" stroke="${shade}" stroke-width="18" stroke-linecap="round" opacity=".76"/>`);
  if(look.fins) parts.push(`<path d="M76 248 L42 292 L88 292 Z M244 248 L278 292 L232 292 Z" fill="#67e8f9" opacity=".42"/>`);
  if(look.construct) parts.push(`<path d="M116 150 L204 150 M106 218 L214 218 M126 298 L194 298" stroke="#e5e7eb" stroke-width="5" opacity=".28"/><circle cx="160" cy="198" r="10" fill="#38bdf8" opacity=".65"/>`);
  if(look.bark) parts.push(`<path d="M126 136 C116 210 142 270 126 344 M186 136 C202 212 170 280 196 348" fill="none" stroke="#365314" stroke-width="5" opacity=".48"/>`);
  if(look.echo) parts.push(`<path d="M92 108 C58 202 74 350 128 448" fill="none" stroke="#93c5fd" stroke-width="5" opacity=".42"/><path d="M228 108 C262 202 246 350 192 448" fill="none" stroke="#c4b5fd" stroke-width="5" opacity=".42"/>`);
  if(look.shadow || look.void) parts.push(`<ellipse cx="160" cy="326" rx="104" ry="228" fill="${look.void ? "#020617" : "#111827"}" opacity=".18"/>`);
  if(look.mirror) parts.push(`<path d="M118 132 L202 132 L214 330 L160 372 L106 330 Z" fill="#e0f2fe" opacity=".18" stroke="#f8fafc" stroke-width="3"/>`);
  if(look.elemental) parts.push(`<path d="M88 186 C116 164 92 128 130 106 C122 150 168 158 144 208 Z" fill="#38bdf8" opacity=".34"/><path d="M214 218 C246 186 220 148 248 128 C244 176 282 190 246 250 Z" fill="#f97316" opacity=".28"/>`);
  if(look.fangs) parts.push(`<path d="M148 102 L154 120 L160 102 L166 120 L172 102" fill="#f8fafc" opacity=".8"/>`);
  if(look.tusks) parts.push(`<path d="M136 106 L122 128 M184 106 L198 128" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/>`);
  return parts.join("\n");
}

function mannequinSvg(raceKey, gender) {
  const look = raceLooks[raceKey] || raceLooks.human;
  const d = dims(look.build, gender);
  const skin = look.skin;
  const shade = look.shade;
  const female = gender === "female";
  const shoulderY = 162;
  const torsoTop = 150;
  const torsoBottom = torsoTop + d.torsoH;
  const cx = 160;
  const headY = 86;
  const label = esc(`${RACES[raceKey]?.name || raceKey} ${gender}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 640">
  <defs>
    <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${skin}"/>
      <stop offset="100%" stop-color="${shade}"/>
    </linearGradient>
    <radialGradient id="light" cx="45%" cy="32%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".16"/>
      <stop offset="100%" stop-color="#020617" stop-opacity=".12"/>
    </radialGradient>
  </defs>
  <title>${label}</title>
  <ellipse cx="160" cy="606" rx="78" ry="15" fill="#020617" opacity=".28"/>
  ${extras(look, skin, shade)}
  <path d="M${cx - d.shoulder} ${shoulderY} C${cx - d.torsoW / 2} ${torsoTop - 28} ${cx + d.torsoW / 2} ${torsoTop - 28} ${cx + d.shoulder} ${shoulderY}
           L${cx + d.torsoW / 2.25} ${torsoBottom} C${cx + 24} ${torsoBottom + 22} ${cx - 24} ${torsoBottom + 22} ${cx - d.torsoW / 2.25} ${torsoBottom} Z" fill="url(#skin)"/>
  <path d="M${cx - d.shoulder + 6} ${shoulderY + 18} L${cx - d.shoulder - 30} 306" stroke="url(#skin)" stroke-width="${d.arm}" stroke-linecap="round"/>
  <path d="M${cx + d.shoulder - 6} ${shoulderY + 18} L${cx + d.shoulder + 30} 306" stroke="url(#skin)" stroke-width="${d.arm}" stroke-linecap="round"/>
  <path d="M${cx - 22} ${torsoBottom - 2} L${cx - 34} 518" stroke="url(#skin)" stroke-width="${d.leg}" stroke-linecap="round"/>
  <path d="M${cx + 22} ${torsoBottom - 2} L${cx + 34} 518" stroke="url(#skin)" stroke-width="${d.leg}" stroke-linecap="round"/>
  <ellipse cx="${cx - 38}" cy="548" rx="${d.leg * 0.9}" ry="14" fill="url(#skin)"/>
  <ellipse cx="${cx + 38}" cy="548" rx="${d.leg * 0.9}" ry="14" fill="url(#skin)"/>
  <circle cx="${cx}" cy="${headY}" r="${d.head}" fill="url(#skin)"/>
  <path d="M${cx - 18} ${headY - 4} L${cx - 5} ${headY - 2} M${cx + 5} ${headY - 2} L${cx + 18} ${headY - 4}" stroke="#111827" stroke-width="4" stroke-linecap="round" opacity=".45"/>
  <path d="M${cx - 14} ${headY + 20} C${cx - 2} ${headY + 28} ${cx + 2} ${headY + 28} ${cx + 14} ${headY + 20}" fill="none" stroke="#111827" stroke-width="3" opacity=".28"/>
  ${female ? `<path d="M${cx - 30} ${torsoTop + 34} C${cx - 10} ${torsoTop + 20} ${cx + 10} ${torsoTop + 20} ${cx + 30} ${torsoTop + 34}" fill="none" stroke="#f8fafc" stroke-width="5" opacity=".14"/>` : ""}
  <path d="M${cx - d.torsoW / 2.6} ${torsoTop + 8} L${cx} ${torsoTop + 72} L${cx + d.torsoW / 2.6} ${torsoTop + 8}" fill="none" stroke="#f8fafc" stroke-width="5" opacity=".15"/>
  <rect width="320" height="640" fill="url(#light)"/>
</svg>`;
}

async function main() {
  await mkdir(outDir, { recursive:true });
  let count = 0;
  for(const raceKey of Object.keys(RACES)) {
    if(RACES[raceKey]?._zodar) continue;
    for(const gender of genders) {
      if(gender === "male" && RACES[raceKey]?._femaleOnly) continue;
      await writeFile(path.join(outDir, `base_${raceKey}_${gender}.svg`), mannequinSvg(raceKey, gender), "utf8");
      count++;
    }
  }
  console.log(`Generated ${count} mannequin SVG bases in ${path.relative(root, outDir)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
