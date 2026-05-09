import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "./supabase";
import { CLASSES, RACES } from "./data/characterData";
import { SPELL_SLOTS, SPELLS } from "./data/spellsData";
import { DEFAULT_QUESTS } from "./data/questsData";
import { DEFAULT_MONSTERS } from "./data/monstersData";
import { DEFAULT_ITEMS, DEFAULT_WEAPON } from "./data/itemsData";
import DiceRoller from "./components/DiceRoller";
import audioManager from "./utils/audioManager";

/* ----------------------------------------------
   FONTS & GLOBAL CSS
---------------------------------------------- */
(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400;1,600&display=swap";
  document.head.appendChild(link);
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes goldenGlow { 0%,100%{text-shadow:0 0 20px rgba(251,191,36,.5)} 50%{text-shadow:0 0 50px rgba(251,191,36,.9),0 0 100px rgba(245,158,11,.4)} }
.msg-in   { animation: fadeUp 0.25s ease; }
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#080810}
    ::-webkit-scrollbar-thumb{background:#2d1b69;border-radius:3px}
    button{transition:all .15s}
    button:hover{filter:brightness(1.2)}
    select,input,textarea{outline:none}
    * { box-sizing: border-box; }
    * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Crect x='15' y='2' width='3' height='20' fill='%23c0c0c0' rx='1'/%3E%3Crect x='14' y='20' width='5' height='3' fill='%23b8860b'/%3E%3Crect x='9' y='18' width='15' height='2' fill='%23b8860b' rx='1'/%3E%3Crect x='14' y='23' width='5' height='7' fill='%23b8860b' rx='1'/%3E%3Crect x='15' y='1' width='3' height='4' fill='%23ffd700' rx='1'/%3E%3C/g%3E%3C/svg%3E") 4 4, auto !important; }
    button { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Crect x='15' y='2' width='3' height='20' fill='%23ffd700' rx='1'/%3E%3Crect x='14' y='20' width='5' height='3' fill='%23ff8c00'/%3E%3Crect x='9' y='18' width='15' height='2' fill='%23ff8c00' rx='1'/%3E%3Crect x='14' y='23' width='5' height='7' fill='%23ff8c00' rx='1'/%3E%3Crect x='15' y='1' width='3' height='4' fill='%23fff' rx='1'/%3E%3C/g%3E%3C/svg%3E") 4 4, pointer !important; }
  `;
  document.head.appendChild(style);
})();

/* ----------------------------------------------
   CONSTANTS
---------------------------------------------- */
const DIFF_COLOR = { facile:"#22c55e", medio:"#f97316", difficile:"#ef4444" };
function normalizeMissionDifficulty(value) {
  const key = String(value || "").trim().toLowerCase();
  if(key === "facile") return "facile";
  if(key === "difficile") return "difficile";
  if(key === "speciale" || key === "molto difficile" || key === "leggendario") return "difficile";
  return "medio";
}
function missionDifficultyLabel(value) {
  return ({
    facile: "Facile",
    medio: "Medio",
    difficile: "Difficile",
  })[normalizeMissionDifficulty(value)];
}
const BACKGROUND_URL = "/assets/Zodarsfondo.png";
const MASTER_PASSWORD = "ByBy101112!";
const PORTRAIT_FALLBACK_URL = 'https://fv5-2.files.fm/thumb_show.php?i=p532qftvxy&view&v=1';
function debugCharacterFlow(step, payload) {
  console.log(`[CHAR_FLOW] ${step}`, payload ?? "");
}
const MASTER_EMAILS = (import.meta.env.VITE_MASTER_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);
const PANEL_BG = "rgba(7,10,20,0.82)";
const PANEL_BG_SOFT = "rgba(7,10,20,0.72)";
const PANEL_BORDER = "rgba(148,163,184,0.16)";

function xpForLevel(l){ return Math.floor(100*Math.pow(1.5,l-1)); }
function useMobile() {
  const [mob, setMob] = useState(() => typeof window !== "undefined" && window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMob(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}
function d(n){ return Math.floor(Math.random()*n)+1; }
function roll(sides,num=1){ let t=0; for(let i=0;i<num;i++) t+=d(sides); return t; }
function randomIntInclusive(min, max) {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  return low + Math.floor(Math.random() * (high - low + 1));
}
function pickRandom(items=[]) {
  return items.length ? items[randomIntInclusive(0, items.length - 1)] : null;
}
function escapeHtml(t="") {
  return String(t).replace(/[&<>"']/g, char => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]
  ));
}
function fmt(t=""){
  return escapeHtml(t)
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/\n/g,"<br/>");
}
function canAccessMasterPanel(user) {
  const email = user?.email?.trim().toLowerCase();
  return !!email && MASTER_EMAILS.includes(email);
}

const MAGIC_CLASSES = ['mage','sorcerer','cleric','druid','bard','warlock','paladin','ranger'];

function getPortraitPath(cls, race, gender) {
  return `/assets/portraits/${cls}_${race}_${gender}.png`;
}
function getClassPortraitPath(cls, gender) {
  return `/assets/portraits/${cls}_${gender}.png`;
}
function characterGenderKey(playerId) {
  return `eoz_character_gender_${playerId}`;
}
function getStoredCharacterGender(playerId, fallback = "male") {
  if(!playerId) return fallback;
  return localStorage.getItem(characterGenderKey(playerId)) || fallback;
}
function saveStoredCharacterGender(playerId, gender) {
  if(playerId) localStorage.setItem(characterGenderKey(playerId), gender || "male");
}
function getGeneratedPortrait(clsKey, raceKey, gender) {
  const cls = CLASSES[clsKey] || CLASSES.warrior;
  const race = RACES[raceKey] || RACES.human;
  const accent = cls.color || "#fbbf24";
  const genderLabel = gender === "female" ? "Femmina" : "Maschio";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <radialGradient id="bg" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.34"/>
          <stop offset="46%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="512" height="512" fill="url(#bg)"/>
      <circle cx="256" cy="214" r="116" fill="#0f172a" stroke="${accent}" stroke-width="10" filter="url(#glow)"/>
      <text x="256" y="245" text-anchor="middle" font-size="96" font-family="Arial, sans-serif">${race.emoji || ""}</text>
      <text x="256" y="342" text-anchor="middle" fill="#f8fafc" font-size="35" font-family="Georgia, serif" font-weight="700">${race.name}</text>
      <text x="256" y="388" text-anchor="middle" fill="${accent}" font-size="32" font-family="Georgia, serif" font-weight="700">${cls.name}</text>
      <text x="256" y="426" text-anchor="middle" fill="#cbd5e1" font-size="22" font-family="Arial, sans-serif">${genderLabel}</text>
    </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function parseDice(dice) {
  if(!dice) return 0;
  const m = String(dice).match(/^(-?\d+)d(\d+)([+-]\d+)?$/);
  if(!m) return Number(dice) || 0;
  const count = Number(m[1]);
  const sides = Number(m[2]);
  const mod = m[3] ? Number(m[3]) : 0;
  let total = 0;
  for(let i=0;i<count;i++) total += d(sides);
  return total + mod;
}

function rollDice(dice) {
  return parseDice(dice);
}
function getPrimaryDieSides(dice, fallback = 20) {
  const match = String(dice || "").match(/d(\d+)/i);
  return match ? Number(match[1]) : fallback;
}

function getSpellSlots(level) {
  const base = SPELL_SLOTS[level] || SPELL_SLOTS[1];
  return { ...base };
}

function availableSpellsFor(className, level) {
  const packs = SPELLS[className] || {};
  const slotsForLevel = SPELL_SLOTS[level] || SPELL_SLOTS[1];
  const maxSlot = Math.max(...Object.entries(slotsForLevel).filter(([,v])=>v>0).map(([k])=>Number(k)), 1);
  return Object.entries(packs)
    .filter(([slot]) => Number(slot) <= maxSlot)
    .flatMap(([slot, spells]) => spells.map(s => ({ ...s, slot: Number(slot) })));
}

function totalSlots(slots) {
  if(!slots) return 0;
  return Object.values(slots).reduce((sum,v)=>sum + (Number(v)||0), 0);
}

function formatSpellSlots(slots) {
  if(!slots) return "0";
  return Object.entries(slots).map(([lvl,count])=>`${lvl}:${count}`).join(" ");
}
function maxPreparedSpellsForLevel(level) {
  if(level <= 1) return 2;
  if(level === 2) return 3;
  if(level === 3) return 4;
  if(level === 4) return 5;
  return Math.min(10, level + 1);
}

/* ----------------------------------------------
   DAILY QUEST ROTATION
---------------------------------------------- */
function _dateToSeed(dateStr) {
  let h = 2166136261;
  for (const c of dateStr) { h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; }
  return h;
}
function _makeRng(seed) {
  let s = (seed || 1) >>> 0;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0x100000000; };
}
function getDailyQuests(allQuests, counts = { facile: 3, medio: 3, difficile: 2 }) {
  const today = new Date().toLocaleDateString('en-CA');
  const rng = _makeRng(_dateToSeed(today));
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const byDiff = { facile: [], medio: [], difficile: [] };
  for (const q of allQuests) {
    if (!q.active) continue;
    const d = normalizeMissionDifficulty(q.difficulty);
    if (byDiff[d]) byDiff[d].push(q);
  }
  return [
    ...shuffle(byDiff.facile).slice(0, counts.facile),
    ...shuffle(byDiff.medio).slice(0, counts.medio),
    ...shuffle(byDiff.difficile).slice(0, counts.difficile),
  ];
}
function hoursUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
  const ms = midnight - now;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/* ----------------------------------------------
   LOCAL STORAGE HELPERS (per quests/monsters/meta)
---------------------------------------------- */
function lsGet(key, def) { try { const r=localStorage.getItem(key); return r?JSON.parse(r):def; } catch { return def; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } }

function getQuests() {
  const defaults = DEFAULT_QUESTS.map(normalizeQuest);
  const stored = lsGet("eoz_quests", null);
  if(!Array.isArray(stored) || !stored.length) return defaults;

  const normalizedStored = stored.map(normalizeQuest);
  // Always merge: stored quests keep their customisations, new defaults are appended
  const storedIds = new Set(normalizedStored.map(q => q.id));
  const newDefaults = defaults.filter(q => !storedIds.has(q.id));
  if(newDefaults.length) {
    const merged = [...normalizedStored, ...newDefaults];
    saveQuests(merged);
    return merged;
  }
  return normalizedStored;
}
function getMonsters() {
  const stored = lsGet("eoz_monsters", null);
  if(!Array.isArray(stored) || !stored.length) return DEFAULT_MONSTERS;
  const storedIds = new Set(stored.map(m => m.id));
  const newDefaults = DEFAULT_MONSTERS.filter(m => !storedIds.has(m.id));
  if(newDefaults.length) {
    const merged = [...stored, ...newDefaults];
    lsSet("eoz_monsters", merged);
    return merged;
  }
  return stored;
}
function getMeta()     { return lsGet("eoz_meta",      { worldName:"Echoes of Zodar", worldSub:"Dove l'Equilibrio Regna Supremo", logo:null }); }
function saveQuests(q)   { lsSet("eoz_quests", q); }
function saveMonsters(m) { lsSet("eoz_monsters", m); }
function saveMeta(m)     { lsSet("eoz_meta", m); }

/* ----------------------------------------------
   DEFAULT DATA
---------------------------------------------- */

const DEFAULT_ITEM_MAP = new Map(DEFAULT_ITEMS.map(item => [item.id, item]));

function mergeCatalogItems(items=[]) {
  const merged = new Map(DEFAULT_ITEMS.map(item => [item.id, item]));
  for(const item of items) {
    const base = merged.get(item.id) || {};
    merged.set(item.id, { ...base, ...item, slot:item.slot || base.slot || null, weapon_die:item.weapon_die || base.weapon_die || null, heal_amount:item.heal_amount || base.heal_amount || 0, bonus_init:item.bonus_init ?? base.bonus_init ?? 0 });
  }
  return Array.from(merged.values()).sort((a,b)=>a.name.localeCompare(b.name, "it"));
}
function itemSlot(item) {
  return item?.slot || (item?.type==="weapon" ? "weapon" : item?.type==="armor" ? "armor" : item?.type==="shield" ? "shield" : null);
}
function isEquippableItem(item) {
  return !!itemSlot(item);
}
function equipmentKey(playerId) {
  return `eoz_equipment_${playerId}`;
}
function preparedSpellsKey(playerId) {
  return `eoz_prepared_spells_${playerId}`;
}
function getStoredEquipment(playerId) {
  return lsGet(equipmentKey(playerId), { weapon:null, armor:null, shield:null });
}
function saveStoredEquipment(playerId, equipment) {
  lsSet(equipmentKey(playerId), equipment);
}
function getStoredPreparedSpells(playerId, spells=[]) {
  return lsGet(preparedSpellsKey(playerId), spells.map(spell => spell.id));
}
function saveStoredPreparedSpells(playerId, spellIds) {
  lsSet(preparedSpellsKey(playerId), spellIds);
}
function spellEffectSummary(spell) {
  if(!spell) return [];
  const details = [];
  details.push(spell.slots === 0 ? "Gratis" : `Costo: slot ${spell.slots}`);
  if(spell.dmg && spell.dmg !== "0") details.push(spell.type === "heal" ? `Cura: ${spell.dmg}` : `Danno: ${spell.dmg}`);
  else details.push(`Tipo: ${spell.type || "speciale"}`);
  return details;
}
function getBaseStats(player) {
  const cls = CLASSES[player?.class || "warrior"] || CLASSES.warrior;
  const race = RACES[player?.race || "human"] || RACES.human;
  const level = Math.max(1, Number(player?.level) || 1);
  return {
    atk: cls.atk + race.atkB + (level - 1) * 2,
    def: cls.def + race.defB + (level - 1),
    mag: cls.mag + race.magB + (level - 1),
    init: cls.init + race.initB,
    maxHp: cls.hp + race.hpB + (level - 1) * 10,
  };
}
function getEquipmentBonuses(equipment, itemMap) {
  const ids = [equipment?.weapon, equipment?.armor, equipment?.shield].filter(Boolean);
  return ids.reduce((totals, itemId) => {
    const item = itemMap.get(itemId);
    if(!item) return totals;
    totals.atk += item.bonus_atk || 0;
    totals.def += item.bonus_def || 0;
    totals.mag += item.bonus_mag || 0;
    totals.hp += item.bonus_hp || 0;
    totals.init += item.bonus_init || 0;
    return totals;
  }, { atk:0, def:0, mag:0, hp:0, init:0 });
}
function applyEquipmentToPlayer(player, equipment, itemMap) {
  if(!player) return player;
  const base = getBaseStats(player);
  const bonus = getEquipmentBonuses(equipment, itemMap);
  const maxHp = Math.max(1, base.maxHp + bonus.hp);
  return {
    ...player,
    atk: base.atk + bonus.atk,
    def: base.def + bonus.def,
    mag: base.mag + bonus.mag,
    init: base.init + bonus.init,
    maxHp,
    hp: Math.min(maxHp, Math.max(0, Number(player.hp) || maxHp)),
  };
}
function normalizeQuestChoices(choices) {
  if(Array.isArray(choices)) return choices;
  if(!choices || typeof choices !== "object") return [];
  return Object.entries(choices).map(([key, value]) => ({
    label: value?.label || key,
    ...value,
    next: value?.next ?? (value?.nextStep ? Number(value.nextStep) - 1 : undefined),
  }));
}
function normalizeQuestStep(step) {
  if(typeof step === "string") return { type:"narrative", text:step };
  if(!step || typeof step !== "object") return { type:"narrative", text:"" };
  if(step.type === "combat" || step.monsters || step.enemies) return { ...step, type:"combat", monsters:step.monsters || step.enemies || [] };
  if(step.type === "loot" || step.loot) return { ...step, type:"loot", loot:step.loot || {} };
  if(step.type === "choice" || step.choices) return { ...step, type:"choice", choices:normalizeQuestChoices(step.choices) };
  return { ...step, type:"narrative", text:step.text || "" };
}
function normalizeQuest(quest) {
  return {
    ...quest,
    specialPassword: quest.specialPassword || quest.password || "",
    steps:(quest.steps || []).map(normalizeQuestStep),
  };
}
function buildInventoryEntries(rows, items = DEFAULT_ITEMS) {
  const itemMap = new Map((items || []).map(item => [item.id, item]));
  return (rows || []).map((row, index) => {
    const itemId = row?.item_id || row?.itemId;
    const item = itemMap.get(itemId);
    if(!item) return null;
    return {
      rowId: row.id || `${itemId}_${row.created_at || index}`,
      itemId,
      playerId: row.player_id || null,
      createdAt: row.created_at || null,
      item,
    };
  }).filter(Boolean);
}
function groupInventoryEntries(entries) {
  return Array.from((entries || []).reduce((map, entry) => {
    const current = map.get(entry.itemId);
    if(current) {
      current.quantity += 1;
      current.rowIds.push(entry.rowId);
      current.entries.push(entry);
      return map;
    }
    map.set(entry.itemId, {
      itemId: entry.itemId,
      item: entry.item,
      quantity: 1,
      rowIds: [entry.rowId],
      entries: [entry],
    });
    return map;
  }, new Map()).values());
}
function countInventoryItems(entries) {
  return (entries || []).reduce((counts, entry) => {
    counts[entry.itemId] = (counts[entry.itemId] || 0) + 1;
    return counts;
  }, {});
}
function getEquippedWeapon(equipment, itemMap) {
  return (equipment?.weapon && itemMap.get(equipment.weapon)) || DEFAULT_WEAPON;
}
function getCombatDamageDie(actor) {
  if(actor?.weaponDie) return actor.weaponDie;
  if(actor?.isPlayer) return DEFAULT_WEAPON.weapon_die;
  if((actor?.atk || 0) >= 18) return "2d8";
  if((actor?.atk || 0) >= 12) return "1d10";
  if((actor?.atk || 0) >= 8) return "1d8";
  return "1d6";
}
function getCombatAttackBonus(actor) {
  return Math.max(1, Math.floor((actor?.atk || 0) / 3));
}
function resolveWeaponAttack(attacker, target, weaponDie) {
  const hitRoll = roll(20);
  const isCrit = hitRoll === 20;
  const attackBonus = getCombatAttackBonus(attacker);
  const attackTotal = hitRoll + attackBonus;
  const targetCa = Math.max(8, target?.def || 10);
  const hit = isCrit || attackTotal >= targetCa;
  const damageRoll = hit ? rollDice(weaponDie || "1d6") : 0;
  const damage = hit ? damageRoll + (isCrit ? damageRoll : 0) : 0;
  return { hitRoll, isCrit, attackBonus, attackTotal, targetCa, hit, damageRoll, damage, weaponDie: weaponDie || "1d6" };
}
function formatWeaponAttackLog(attacker, target, resolved, weaponName, targetHpAfter, targetMaxHp) {
  const header = `${attacker?.emoji || "⭐"} **${attacker?.name}** attacca ${target?.emoji || "⭐"} **${target?.name}**`;
  const hitLine = `🎯 Tiro per colpire: **d20 ${resolved.hitRoll} + bonus ${resolved.attackBonus} = ${resolved.attackTotal}** contro CA **${resolved.targetCa}**`;
  if(!resolved.hit) return `${header}\n${hitLine}\n❌ **Mancato**`;
  const critNote = resolved.isCrit ? " — **CRITICO!**" : "";
  const dmgLine = `💥 Tiro danno: **${resolved.weaponDie} = ${resolved.damageRoll}**${resolved.isCrit ? `, critico => **${resolved.damage}**` : ` => **${resolved.damage}**`} con **${weaponName}**`;
  const hpLine = `❤️ ${target?.name}: ${targetHpAfter}/${targetMaxHp} HP`;
  return `${header}\n${hitLine}\n✅ **Colpisce**${critNote}\n${dmgLine}\n${hpLine}`;
}
function isDyingCombatant(combatant) {
  return !!combatant?.isPlayer && !!combatant?.dying && !combatant?.dead;
}
function canTakeCombatTurn(combatant) {
  if(!combatant) return false;
  if(combatant.isPlayer) return !combatant.dead && ((combatant.hp || 0) > 0 || combatant.dying);
  return (combatant.hp || 0) > 0;
}
function hasActionablePlayerCombatants(combatants) {
  return (combatants || []).some(c => c?.isPlayer && !c?.dead && (((c?.hp || 0) > 0) || c?.dying));
}
function getNextCombatTurn(combatants, currentTurn, currentRound) {
  let nextTurn = currentTurn + 1;
  let nextRound = currentRound;
  if(nextTurn >= combatants.length) { nextTurn = 0; nextRound++; }
  let safety = 0;
  while(safety++ < combatants.length && !canTakeCombatTurn(combatants[nextTurn])) {
    nextTurn++;
    if(nextTurn >= combatants.length) { nextTurn = 0; nextRound++; }
  }
  return { nextTurn, nextRound };
}
function applyCombatDamageState(combatant, damage) {
  const nextHp = Math.max(0, (combatant?.hp || 0) - damage);
  if(nextHp > 0) return { ...combatant, hp: nextHp };
  if(combatant?.dead) return { ...combatant, hp: 0 };
  return {
    ...combatant,
    hp: 0,
    dying: true,
    stable: false,
    dead: false,
    deathSuccesses: combatant?.dying ? (combatant.deathSuccesses || 0) : 0,
    deathFailures: combatant?.dying ? (combatant.deathFailures || 0) : 0,
  };
}
function reviveCombatantState(combatant, hp) {
  return {
    ...combatant,
    hp,
    dying: false,
    stable: false,
    dead: false,
    deathSuccesses: 0,
    deathFailures: 0,
  };
}
function resolveDeathSave(combatant, forcedRoll) {
  const rollValue = forcedRoll ?? roll(20);
  if(rollValue === 20) {
    return {
      rollValue,
      result: "nat20",
      nextCombatant: reviveCombatantState(combatant, 1),
      log: `🕯️ **${combatant.name}** tira un **20 naturale** sulla salvezza contro la morte e ritorna a **1 HP**!`,
    };
  }
  const successGain = rollValue >= 10 ? 1 : 0;
  const failureGain = rollValue === 1 ? 2 : rollValue <= 9 ? 1 : 0;
  const successes = (combatant.deathSuccesses || 0) + successGain;
  const failures = (combatant.deathFailures || 0) + failureGain;
  if(failures >= 3) {
    return {
      rollValue,
      result: "dead",
      nextCombatant: { ...combatant, hp: 0, dying: false, stable: false, dead: true, deathSuccesses: successes, deathFailures: failures },
      log: `☠️ **${combatant.name}** fallisce la salvezza contro la morte (${successes}/3 successi, ${failures}/3 fallimenti) e **muore**.`,
    };
  }
  if(successes >= 3) {
    return {
      rollValue,
      result: "stable",
      nextCombatant: { ...combatant, hp: 0, dying: false, stable: true, dead: false, deathSuccesses: successes, deathFailures: failures },
      log: `🛌 **${combatant.name}** ottiene la terza salvezza (${successes}/3) ed è **stabile**, ma resta a 0 HP.`,
    };
  }
  return {
    rollValue,
    result: successGain ? "success" : "failure",
    nextCombatant: { ...combatant, hp: 0, dying: true, stable: false, dead: false, deathSuccesses: successes, deathFailures: failures },
    log: `🕯️ **${combatant.name}** tira una salvezza contro la morte: **d20 ${rollValue}** — ${successGain ? "successo" : "fallimento"} (${successes}/3 successi, ${failures}/3 fallimenti).`,
  };
}
function itemStatSummary(item) {
  if(!item) return [];
  const stats = [];
  if(item.weapon_die) stats.push(`🎲 ${item.weapon_die}`);
  if(item.bonus_atk) stats.push(`⚔️ +${item.bonus_atk}`);
  if(item.bonus_def) stats.push(`🛡️ +${item.bonus_def}`);
  if(item.bonus_mag) stats.push(`✨ +${item.bonus_mag}`);
  if(item.bonus_hp) stats.push(`❤️ +${item.bonus_hp}`);
  if(item.bonus_init) stats.push(`🦶 ${item.bonus_init>=0?"+":""}${item.bonus_init}`);
  if(item.heal_amount) stats.push(`🧪 Cura ${item.heal_amount}`);
  return stats;
}
function itemTypeLabel(type) {
  return ({
    weapon: "Arma",
    armor: "Armatura",
    shield: "Scudo",
    accessory: "Accessorio",
    potion: "Pozione",
  })[type] || type || "Oggetto";
}
function svgDataUrl(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function makeArchetypeImage({ icon, title, accent="#fbbf24", accent2="#7c3aed", bg1="#172033", bg2="#0b1120", border="#334155", subtitle="" }) {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${accent2}" stop-opacity="0.12"/>
        </linearGradient>
      </defs>
      <rect width="320" height="320" rx="36" fill="url(#bg)"/>
      <rect x="12" y="12" width="296" height="296" rx="28" fill="none" stroke="${border}" stroke-width="4"/>
      <circle cx="160" cy="134" r="88" fill="url(#shine)"/>
      <text x="160" y="162" text-anchor="middle" font-size="104">${icon}</text>
      <text x="160" y="248" text-anchor="middle" fill="#f8fafc" font-size="24" font-family="Georgia,serif">${title}</text>
      <text x="160" y="275" text-anchor="middle" fill="#94a3b8" font-size="15" font-family="Georgia,serif">${subtitle}</text>
    </svg>
  `);
}
function itemImageTheme(item) {
  return {
    weapon:{ icon:"⚔️", title:"Arma", accent:"#ef4444", accent2:"#f59e0b", bg1:"#261019", bg2:"#09090b", border:"#7f1d1d" },
    armor:{ icon:"🛡️", title:"Armatura", accent:"#60a5fa", accent2:"#e2e8f0", bg1:"#102033", bg2:"#08111d", border:"#1d4ed8" },
    shield:{ icon:"🛡️", title:"Scudo", accent:"#22c55e", accent2:"#0ea5e9", bg1:"#0f221d", bg2:"#08110f", border:"#166534" },
    potion:{ icon:"🧪", title:"Pozione", accent:"#a855f7", accent2:"#f472b6", bg1:"#231236", bg2:"#120b1f", border:"#6d28d9" },
    accessory:{ icon:"💍", title:"Accessorio", accent:"#fbbf24", accent2:"#fb7185", bg1:"#2a1d0a", bg2:"#140f09", border:"#b45309" },
  }[item?.type] || { icon:item?.emoji || "⭐", title:"Oggetto", accent:"#fbbf24", accent2:"#7c3aed", bg1:"#172033", bg2:"#0b1120", border:"#334155" };
}
function getItemImage(item) {
  if(!item) return "";
  if(item.image) return item.image;
  if(item.image_url) return item.image_url;
  const theme = itemImageTheme(item);
  return makeArchetypeImage({ ...theme, icon:item.emoji || theme.icon, title:itemTypeLabel(item.type), subtitle:itemRarityLabel(item.rarity) });
}
function _darkenHex(hex, amt = 28) {
  const n = parseInt((hex||"#888888").replace("#",""), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}
function makeRaceClassPortrait(cls, race, gender) {
  const R = {
    human:      { skin:"#deb887", eye:"#5c3d2e", extra:"" },
    elf:        { skin:"#f0e0c0", eye:"#3a7a4a", extra:"elf_ears" },
    halfelf:    { skin:"#e8d5b0", eye:"#4a6a3a", extra:"halfelf_ears" },
    dwarf:      { skin:"#c8935a", eye:"#5c3d2e", extra:"beard" },
    halforc:    { skin:"#7aaa60", eye:"#884422", extra:"tusks" },
    dragonborn: { skin:"#9a7040", eye:"#cc4400", extra:"scales" },
    gnome:      { skin:"#f0c898", eye:"#4a2878", extra:"rosy_cheeks" },
    halfling:   { skin:"#f5c8a0", eye:"#5a3a28", extra:"rosy_cheeks" },
    tiefling:   { skin:"#c87898", eye:"#8a1a1a", extra:"horns" },
  }[race] || { skin:"#deb887", eye:"#5c3d2e", extra:"" };
  const C = {
    warrior:  { a:"#ef4444", a2:"#f59e0b", b1:"#2a1313", b2:"#10090a", bd:"#7f1d1d", bc:"#3a1a1a", icon:"⚔️" },
    barbarian:{ a:"#dc2626", a2:"#f97316", b1:"#2a1010", b2:"#100808", bd:"#991b1b", bc:"#4a1818", icon:"🪓" },
    mage:     { a:"#60a5fa", a2:"#a855f7", b1:"#111b35", b2:"#080b16", bd:"#3730a3", bc:"#1a2040", icon:"🔮" },
    sorcerer: { a:"#8b5cf6", a2:"#c084fc", b1:"#1a1135", b2:"#0c0820", bd:"#5b21b6", bc:"#251040", icon:"🪄" },
    warlock:  { a:"#7c3aed", a2:"#c4b5fd", b1:"#150c2a", b2:"#09060f", bd:"#4c1d95", bc:"#1f1030", icon:"🔮" },
    bard:     { a:"#f97316", a2:"#fbbf24", b1:"#2a1a08", b2:"#100a04", bd:"#c2410c", bc:"#3a2010", icon:"🎵" },
    cleric:   { a:"#fbbf24", a2:"#f8fafc", b1:"#2a2112", b2:"#110d08", bd:"#a16207", bc:"#3a3010", icon:"⛪" },
    druid:    { a:"#22c55e", a2:"#84cc16", b1:"#132418", b2:"#08100a", bd:"#166534", bc:"#1a3020", icon:"🌿" },
    monk:     { a:"#06b6d4", a2:"#0ea5e9", b1:"#0c2030", b2:"#060f18", bd:"#0e7490", bc:"#102028", icon:"🥋" },
    paladin:  { a:"#facc15", a2:"#fde68a", b1:"#252010", b2:"#100e08", bd:"#a16207", bc:"#302810", icon:"🛡️" },
    ranger:   { a:"#14b8a6", a2:"#22c55e", b1:"#0f2220", b2:"#060f0d", bd:"#0f766e", bc:"#102820", icon:"🏹" },
    rogue:    { a:"#22c55e", a2:"#4ade80", b1:"#0f2018", b2:"#060f0a", bd:"#166534", bc:"#102018", icon:"🗡️" },
  }[cls] || { a:"#c084fc", a2:"#60a5fa", b1:"#171c2a", b2:"#0b1020", bd:"#334155", bc:"#202030", icon:"⭐" };

  const { skin, eye, extra } = R;
  const { a, a2, b1, b2, bd, bc, icon } = C;
  const hairC = gender === "female" ? "#5a3020" : "#3a2010";
  const skinD = _darkenHex(skin, 22);

  const ears = extra === "elf_ears"
    ? `<ellipse cx="74" cy="148" rx="14" ry="26" fill="${skin}" stroke="${skinD}" stroke-width="1.5"/>
       <ellipse cx="246" cy="148" rx="14" ry="26" fill="${skin}" stroke="${skinD}" stroke-width="1.5"/>`
    : extra === "halfelf_ears"
    ? `<ellipse cx="77" cy="150" rx="11" ry="19" fill="${skin}"/>
       <ellipse cx="243" cy="150" rx="11" ry="19" fill="${skin}"/>`
    : "";

  const special = extra === "beard"
    ? `<ellipse cx="160" cy="204" rx="54" ry="32" fill="#7a5a38"/>`
    : extra === "tusks"
    ? `<rect x="140" y="198" width="13" height="24" rx="5" fill="#f0f0d8"/>
       <rect x="167" y="198" width="13" height="24" rx="5" fill="#f0f0d8"/>`
    : extra === "horns"
    ? `<path d="M128 82 Q105 38 118 16" stroke="#7a2828" stroke-width="11" stroke-linecap="round" fill="none"/>
       <path d="M192 82 Q215 38 202 16" stroke="#7a2828" stroke-width="11" stroke-linecap="round" fill="none"/>`
    : extra === "scales"
    ? `<circle cx="122" cy="130" r="9" fill="${a}" opacity="0.38"/>
       <circle cx="145" cy="112" r="9" fill="${a}" opacity="0.38"/>
       <circle cx="175" cy="112" r="9" fill="${a}" opacity="0.38"/>
       <circle cx="198" cy="130" r="9" fill="${a}" opacity="0.38"/>`
    : extra === "rosy_cheeks"
    ? `<circle cx="116" cy="165" r="18" fill="#ff8888" opacity="0.3"/>
       <circle cx="204" cy="165" r="18" fill="#ff8888" opacity="0.3"/>`
    : "";

  const hair = gender === "female"
    ? `<ellipse cx="160" cy="84" rx="84" ry="40" fill="${hairC}"/>
       <rect x="76" y="84" width="22" height="88" rx="11" fill="${hairC}"/>
       <rect x="222" y="84" width="22" height="88" rx="11" fill="${hairC}"/>`
    : `<ellipse cx="160" cy="84" rx="84" ry="34" fill="${hairC}"/>`;

  return svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${b1}"/><stop offset="100%" stop-color="${b2}"/></linearGradient>
      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${a}" stop-opacity="0.5"/><stop offset="100%" stop-color="${a2}" stop-opacity="0.05"/></linearGradient>
      <clipPath id="cl"><rect width="320" height="320" rx="36"/></clipPath>
    </defs>
    <rect width="320" height="320" rx="36" fill="url(#bg)"/>
    <ellipse cx="160" cy="310" rx="160" ry="72" fill="${bc}" opacity="0.9"/>
    <rect x="138" y="210" width="44" height="55" rx="10" fill="${skin}"/>
    <ellipse cx="160" cy="280" rx="96" ry="52" fill="${bc}"/>
    ${ears}
    <circle cx="160" cy="152" r="84" fill="${skin}"/>
    ${special}
    ${hair}
    <circle cx="130" cy="148" r="13" fill="${eye}"/>
    <circle cx="190" cy="148" r="13" fill="${eye}"/>
    <circle cx="126" cy="144" r="5" fill="white" opacity="0.55"/>
    <circle cx="186" cy="144" r="5" fill="white" opacity="0.55"/>
    <circle cx="160" cy="170" r="5" fill="${skinD}"/>
    <path d="M143 188 Q160 200 177 188" stroke="${skinD}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="268" cy="52" r="30" fill="${b1}" opacity="0.92"/>
    <circle cx="268" cy="52" r="30" fill="none" stroke="${a}" stroke-width="2.5"/>
    <text x="268" y="63" text-anchor="middle" font-size="28">${icon}</text>
    <rect x="10" y="10" width="300" height="300" rx="30" fill="none" stroke="${bd}" stroke-width="3" clip-path="url(#cl)"/>
    <rect x="10" y="10" width="300" height="300" rx="30" fill="url(#glow)" opacity="0.18" clip-path="url(#cl)"/>
  </svg>`);
}
function getPlayerPortrait(player) {
  if(!player) return "";
  if(player.portrait) return player.portrait;
  if(player.image) return player.image;
  const cls  = (player.class  || "warrior").toLowerCase();
  const race = (player.race   || "human").toLowerCase();
  const gender = player.gender || getStoredCharacterGender(player.id, "male");
  return getPortraitPath(cls, race, gender);
}
function getMonsterImage(monster) {
  if(!monster) return "";
  if(monster.image) return monster.image;
  if(monster.image_url) return monster.image_url;
  const key = `${monster.id || ""} ${monster.name || ""} ${monster.desc || ""}`.toLowerCase();
  const theme =
    /drago|dragon/.test(key) ? { icon:"🐉", title:"Drago", accent:"#ef4444", accent2:"#f59e0b", bg1:"#2b1010", bg2:"#120808", border:"#991b1b" } :
    /lich|scheletro|skeleton|spettro|vampir|undead|catacomb/.test(key) ? { icon:"💀", title:"Non-morto", accent:"#c4b5fd", accent2:"#60a5fa", bg1:"#19142c", bg2:"#090b16", border:"#5b21b6" } :
    /demone|demon/.test(key) ? { icon:"😈", title:"Demone", accent:"#fb7185", accent2:"#ef4444", bg1:"#2a0d18", bg2:"#13070c", border:"#9f1239" } :
    /golem|guardiano|guardian|titano|construct|runic/.test(key) ? { icon:"🗿", title:"Costrutto", accent:"#94a3b8", accent2:"#60a5fa", bg1:"#17202b", bg2:"#0a0f16", border:"#475569" } :
    /ragno|spider|serpente|hydra|lupo|wolf|ratto|boar|cervo|beast|slime|melma/.test(key) ? { icon:monster.emoji || "🐾", title:"Bestia", accent:"#22c55e", accent2:"#84cc16", bg1:"#142218", bg2:"#09110c", border:"#166534" } :
    /mago|strega|cultista|oracle|witch/.test(key) ? { icon:monster.emoji || "🪄", title:"Incantatore", accent:"#a855f7", accent2:"#60a5fa", bg1:"#1e1634", bg2:"#0b0b16", border:"#6d28d9" } :
    /goblin|orco|orc|gnoll|bandit|cobold|mercenario|knight|armigero/.test(key) ? { icon:monster.emoji || "🪓", title:"Predone", accent:"#f59e0b", accent2:"#ef4444", bg1:"#25160d", bg2:"#0f0908", border:"#92400e" } :
    monster.isBoss ? { icon:monster.emoji || "👑", title:"Boss", accent:"#fbbf24", accent2:"#fb7185", bg1:"#271915", bg2:"#110b09", border:"#b45309" } :
    { icon:monster.emoji || "👾", title:"Creatura", accent:"#60a5fa", accent2:"#22c55e", bg1:"#172033", bg2:"#0b1120", border:"#334155" };
  return makeArchetypeImage({ ...theme, subtitle:monster.isBoss ? "Boss" : `${monster.hp || 0} HP` });
}
function ArtThumb({ src, alt, size=56, radius=12 }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width:size, height:size, minWidth:size, borderRadius:radius, objectFit:"cover", display:"block", background:"rgba(15,23,42,0.72)", border:"1px solid rgba(148,163,184,0.16)", boxShadow:"0 10px 24px rgba(0,0,0,0.22)" }}
    />
  );
}
function itemRarityLabel(rarity) {
  return ({
    common: "Comune",
    uncommon: "Non comune",
    rare: "Raro",
    epic: "Epico",
    legendary: "Leggendario",
    base: "Base",
  })[String(rarity || "").toLowerCase()] || rarity || "Catalogo";
}
function resolveLootItem(spec, items) {
  if(!spec) return null;
  if(typeof spec === "object" && spec.id) return items.find(item => item.id === spec.id) || null;
  const search = String(spec).trim().toLowerCase();
  return items.find(item =>
    item.id.toLowerCase() === search ||
    item.name.toLowerCase() === search ||
    item.name.toLowerCase().includes(search) ||
    search.includes(item.name.toLowerCase())
  ) || null;
}

/* ----------------------------------------------
   SUPABASE HELPERS
---------------------------------------------- */
async function dbSendMessage(msg) {
  await supabase.from("messages").insert({
    party_code: msg.party_code,
    author: msg.author,
    content: msg.content,
    type: msg.type || "chat",
  });
}

function parsePlayerMasterMeta(msg) {
  try {
    const parsed = JSON.parse(msg?.content || "{}");
    if(!parsed?.playerId) return null;
    return {
      playerId: parsed.playerId,
      realPlayerName: String(parsed.realPlayerName || "").trim(),
      heroName: String(parsed.heroName || "").trim(),
      partyCode: parsed.partyCode || msg.party_code || "",
      updatedAt: parsed.updatedAt || msg.created_at || "",
    };
  } catch {
    return null;
  }
}

async function dbSavePlayerMasterMeta({ playerId, partyCode, heroName, realPlayerName }) {
  const cleanRealName = String(realPlayerName || "").trim();
  if(!playerId || !cleanRealName) return;
  const content = JSON.stringify({
    playerId,
    partyCode,
    heroName,
    realPlayerName: cleanRealName,
    updatedAt: new Date().toISOString(),
  });
  const { error } = await supabase.from("messages").insert({
    party_code: partyCode,
    author: `player_meta:${playerId}`,
    content,
    type: "player_meta",
  });
  if(error) throw error;
}

async function dbGetPlayerMasterMeta() {
  const { data, error } = await supabase
    .from("messages")
    .select("party_code,author,content,type,created_at")
    .eq("type", "player_meta")
    .order("created_at", { ascending: true })
    .limit(2000);
  if(error) throw error;
  const byPlayer = {};
  for(const msg of (data || [])) {
    const meta = parsePlayerMasterMeta(msg);
    if(meta) byPlayer[meta.playerId] = meta;
  }
  return byPlayer;
}

async function dbSavePlayer(p) {
  const { data, error } = await supabase.from("players").upsert({
    id: p.id, name: p.name, party_code: p.partyCode,
    account_id: p.accountId || null,
    class: p?.class || 'warrior', race: p?.race || 'human',
    hp: p?.hp || 0, max_hp: p?.maxHp || 0, atk: p?.atk || 0, def: p?.def || 0,
    mag: p?.mag || 0, init: p?.init || 1, xp: p?.xp || 0, level: p?.level || 1, gold: p?.gold || 0,
    dead: !!p?.dead,
    updated_at: new Date().toISOString(),
  }).select("id,account_id,dead").single();
  return { data, error };
}

async function dbGetPlayers(partyCode) {
  let query = supabase.from("players").select("*");
  if(partyCode) query = query.eq("party_code", partyCode);
  const { data } = await query;
  return (data || []).map(r => ({
    id: r?.id, name: r?.name, partyCode: r?.party_code,
    accountId: r?.account_id || null,
    gender: getStoredCharacterGender(r?.id, typeof r?.avatar_config === 'string' ? r.avatar_config : (r?.avatar_config?.gender || 'male')),
    class: r?.class || 'warrior', race: r?.race || 'human',
    hp: r?.hp || 0, maxHp: r?.max_hp || 0, atk: r?.atk || 0, def: r?.def || 0,
    mag: r?.mag || 0, init: r?.init || 1, xp: r?.xp || 0, level: r?.level || 1, gold: r?.gold || 0, dead: !!r?.dead,
  }));
}
async function dbGetAccountCharacters(accountId) {
  if(!accountId) return [];
  const { data } = await supabase.from("players").select("*").eq("account_id", accountId).order("updated_at", { ascending:false });
  return (data || []).map(r => ({
    id: r?.id, name: r?.name, partyCode: r?.party_code,
    accountId: r?.account_id || null,
    gender: getStoredCharacterGender(r?.id, typeof r?.avatar_config === 'string' ? r.avatar_config : (r?.avatar_config?.gender || 'male')),
    class: r?.class || 'warrior', race: r?.race || 'human',
    hp: r?.hp || 0, maxHp: r?.max_hp || 0, atk: r?.atk || 0, def: r?.def || 0,
    mag: r?.mag || 0, init: r?.init || 1, xp: r?.xp || 0, level: r?.level || 1, gold: r?.gold || 0, dead: !!r?.dead,
  }));
}

async function dbGetMessages(partyCode) {
  let query = supabase.from("messages").select("*");
  if(partyCode) query = query.eq("party_code", partyCode);
  const { data } = await query.order("created_at", { ascending: true }).limit(partyCode ? 300 : 400);
  return (data || []).filter(msg => msg.type !== "player_meta");
}

async function dbSavePartyState(partyCode, state) {
  const { error } = await supabase.from("party_state").upsert({
    party_code: partyCode,
    quest_id: state.currentId,
    quest_step: state.step,
    quest_active: state.active,
    quest_completed: state.completed,
    combat: state.combat || null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function dbGetPartyState(partyCode) {
  const { data, error } = await supabase.from("party_state").select("*").eq("party_code", partyCode).maybeSingle();
  if (error) throw error;
  if (!data) return { currentId: null, step: 0, active: false, completed: [], combat: null };
  return {
    currentId: data.quest_id,
    step: data.quest_step || 0,
    active: data.quest_active || false,
    completed: data.quest_completed || [],
    combat: data.combat || null,
  };
}

// Items / Shop
async function dbGetItems() {
  const { data } = await supabase.from("items").select("*").order("name", { ascending: true });
  return mergeCatalogItems(data || []);
}

async function dbSaveItem(item) {
  await supabase.from("items").upsert({
    id: item.id,
    name: item.name,
    emoji: item.emoji,
    type: item.type,
    description: item.description,
    bonus_atk: item.bonus_atk || 0,
    bonus_def: item.bonus_def || 0,
    bonus_mag: item.bonus_mag || 0,
    bonus_hp: item.bonus_hp || 0,
    price: item.price || 0,
    available: item.available !== false,
    updated_at: new Date().toISOString(),
  });
}

async function dbDeleteItem(itemId) {
  await supabase.from("items").delete().eq("id", itemId);
}

async function dbAddPlayerItem(playerId, itemId, quantity=1) {
  const amount = Math.max(1, Number(quantity) || 1);
  const payload = Array.from({ length: amount }, () => ({ player_id: playerId, item_id: itemId }));
  await supabase.from("player_items").insert(payload);
}
async function dbGetPlayerItems(playerId) {
  const { data } = await supabase.from("player_items").select("*").eq("player_id", playerId).order("created_at", { ascending: true });
  return data || [];
}
async function dbGetPlayerInventory(playerId, items = DEFAULT_ITEMS) {
  const rows = await dbGetPlayerItems(playerId);
  const entries = buildInventoryEntries(rows, items);
  return {
    rows,
    entries,
    counts: countInventoryItems(entries),
    groups: groupInventoryEntries(entries),
  };
}
async function dbRemovePlayerItem(rowId) {
  await supabase.from("player_items").delete().eq("id", rowId);
}
async function dbDeleteCharacter(characterId) {
  await supabase.from("player_items").delete().eq("player_id", characterId);
  await supabase.from("players").delete().eq("id", characterId);
}

async function dbDeleteMessages(partyCode) {
  await supabase.from("messages").delete().eq("party_code", partyCode);
}

async function dbDeletePlayers(partyCode) {
  await supabase.from("players").delete().eq("party_code", partyCode);
}

async function dbDeletePartyState(partyCode) {
  await supabase.from("party_state").delete().eq("party_code", partyCode);
}

async function resetPartyCombat(partyCode) {
  const state = await dbGetPartyState(partyCode);
  await dbSavePartyState(partyCode, { ...state, combat: null });
}

async function resetPartyCampaign(partyCode) {
  await dbDeleteMessages(partyCode);
  await resetPartyCombat(partyCode);
}

async function deleteParty(partyCode) {
  await dbDeleteMessages(partyCode);
  await dbDeletePlayers(partyCode);
  await dbDeletePartyState(partyCode);
}

/* ----------------------------------------------
   ERROR BOUNDARY
---------------------------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if(this.state.error) {
      return (
        <div style={{ padding:20, color:"#f8fafc", background:"#091b2d", minHeight:"100vh" }}>
          <h2 style={{ color:"#f87171" }}>Errore durante il caricamento della schermata di gioco</h2>
          <p>{this.state.error?.message || this.state.error?.toString()}</p>
          <pre style={{ whiteSpace:"pre-wrap", fontSize:"0.75rem", color:"#cbd5e1" }}>{this.state.info?.componentStack}</pre>
          <button onClick={this.props.onReset} style={{ marginTop:12, padding:"0.6rem 1rem", background:"#4f46e5", color:"#f8fafc", border:"none", borderRadius:4, cursor:"pointer" }}>Torna al menu</button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ----------------------------------------------
   ROOT
---------------------------------------------- */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [myId, setMyId] = useState(() => localStorage.getItem("eoz_myId") || null);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Try to autoplay BGM as soon as the app loads (falls back to first user gesture)
  useEffect(() => { audioManager.autoplayOnStartup('intro'); }, []);

  useEffect(() => {
    if (screen === "landing" || screen === "create" || screen === "master") {
      audioManager.playBGM("intro");
    }
  }, [screen]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setAuthUser(session?.user || null);
      setAuthLoading(false);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      setAuthUser(session?.user || null);
    });
    return ()=>subscription.unsubscribe();
  },[]);

  async function goGame(characterOrId) {
    const selectedCharacter = characterOrId && typeof characterOrId === "object" ? characterOrId : null;
    const validId = (selectedCharacter?.id ?? characterOrId ?? "").toString().trim();
    debugCharacterFlow("go_game_start", {
      inputType: selectedCharacter ? "character" : "id",
      selectedId: validId || null,
      selectedCharacter,
    });
    if(!validId) {
      alert("ID personaggio non valido. Effettua il login o crea un personaggio.");
      setScreen("landing");
      return;
    }
    try {
      let data = selectedCharacter
        ? {
            id: validId,
            dead: !!selectedCharacter.dead,
            account_id: selectedCharacter.accountId ?? selectedCharacter.account_id ?? null,
          }
        : null;
      if(!data) {
        const { data: fetchedCharacter, error } = await supabase.from("players").select("id,dead,account_id").eq("id", validId).maybeSingle();
        debugCharacterFlow("go_game_fetch_result", {
          requestedId: validId,
          found: !!fetchedCharacter,
          fetchedCharacter,
          error: error?.message || null,
        });
        if(error) throw error;
        if(!fetchedCharacter) throw new Error("Personaggio non trovato");
        data = fetchedCharacter;
      }
      debugCharacterFlow("go_game_validation_input", data);
      if(authUser?.id && !data.account_id) {
        debugCharacterFlow("go_game_missing_account_bind", { requestedId: validId, accountId: authUser.id });
        const { error: bindError } = await supabase
          .from("players")
          .update({ account_id: authUser.id, updated_at: new Date().toISOString() })
          .eq("id", validId);
        debugCharacterFlow("go_game_bind_result", { requestedId: validId, error: bindError?.message || null });
        if(bindError) throw bindError;
      } else if(authUser?.id && data.account_id !== authUser.id) {
        debugCharacterFlow("go_game_validation_failed", { reason: "account_mismatch", requestedId: validId, expected: authUser.id, actual: data.account_id });
        throw new Error("Personaggio non appartenente a questo account");
      }
      if(data.dead) {
        debugCharacterFlow("go_game_validation_failed", { reason: "dead_character", requestedId: validId });
        throw new Error("Questo personaggio è morto e non può essere giocato");
      }
      debugCharacterFlow("selected_player_id_set", { playerId: validId });
      setMyId(validId);
      localStorage.setItem("eoz_myId", validId);
      setScreen("game");
    } catch(e) {
      debugCharacterFlow("go_game_failure", { requestedId: validId, error: e?.message || String(e) });
      console.error("Errore caricamento personaggio:", e);
      if((localStorage.getItem("eoz_myId") || "").trim() === validId) localStorage.removeItem("eoz_myId");
      setMyId(null);
      alert(`Caricamento personaggio fallito.\n\nPlayer ID: ${validId}\nMotivo: ${e?.message || "errore sconosciuto"}`);
      setScreen("landing");
    }
  }

  if(authLoading) return (
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.32)" }} />
      <div style={{ position:"relative", zIndex:1, color:"#e2d9c5", fontFamily:"'Cinzel',serif" }}>Caricamento...</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", fontFamily:"'Crimson Pro',Georgia,serif", color:"#e2d9c5", position:"relative" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
        * { -webkit-tap-highlight-color: transparent; }
        input, select, textarea { font-size: 16px !important; }
        button { touch-action: manipulation; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(109,40,217,0.4); border-radius: 2px; }
        @media (max-width: 768px) {
          button { min-height: 40px; }
          input, select { min-height: 40px; padding: 0.5rem 0.75rem !important; }
        }
      `}</style>
      {screen==="master" && <MasterPanelAuth setScreen={setScreen} authUser={authUser} />}
      {screen!=="master" && !authUser && <AuthScreen setAuthUser={setAuthUser} setScreen={setScreen} setMyId={setMyId} />}
      {screen!=="master" && authUser && screen==="landing" && <Landing setScreen={setScreen} goGame={goGame} myId={myId} authUser={authUser} setAuthUser={setAuthUser} />}
      {screen!=="master" && authUser && screen==="create"  && <CreateChar setScreen={setScreen} goGame={goGame} authUser={authUser} />}
      {screen!=="master" && authUser && screen==="game" && (
        <ErrorBoundary onReset={()=>setScreen("landing")}> 
          <GameScreen myId={myId} setScreen={setScreen} />
        </ErrorBoundary>
      )}
    </div>
  );
}

/* ----------------------------------------------
   AUTH SCREEN
---------------------------------------------- */
function AuthScreen({ setAuthUser, setScreen, setMyId }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState({ body: 'male_base.svg', face: 'none', hair: 'short_brown.svg', outfit: 'none' });
  const [success, setSuccess] = useState("");
  const meta = getMeta();

  async function handleAuth() {
    if(!email.trim()||!password.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    if(mode==="login") {
      const {data,error:e} = await supabase.auth.signInWithPassword({email,password});
      if(e) { setError("Email o password errati."); setLoading(false); return; }
      setAuthUser(data.user);
      const savedId = (localStorage.getItem("eoz_myId") || "").trim();
      if(savedId) setMyId(savedId);
      setScreen("landing");
    } else {
      const {error:e} = await supabase.auth.signUp({email,password});
      if(e) { setError(e.message); setLoading(false); return; }
      setSuccess("? Registrazione completata! Ora puoi accedere.");
      setMode("login");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.32)" }} />
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", width:"100%", padding:"2rem 1rem" }}>
      <p style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>⚔ ZODAR ⚔</p>
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2rem,7vw,4rem)", margin:"0.2rem 0 2rem", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em" }}>
        {meta.worldName}
      </h1>
      <div style={{ width:"100%", maxWidth:400, background:"rgba(0,0,0,0.55)", border:"1px solid #374151", borderRadius:8, padding:"2rem" }}>
        <div style={{ display:"flex", gap:0, marginBottom:"1.5rem", border:"1px solid #1f2937", borderRadius:6, overflow:"hidden" }}>
          {[["login","🔐 Accedi"],["register","📝 Registrati"]].map(([k,l])=>(
            <button key={k} onClick={()=>{ setMode(k); setError(""); setSuccess(""); }}
              style={{ flex:1, padding:"0.6rem", background:mode===k?"rgba(109,40,217,0.3)":"transparent", border:"none", color:mode===k?"#c4b5fd":"#6b7280", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.8rem", letterSpacing:"0.05em" }}>
              {l}
            </button>
          ))}
        </div>
        <label style={labelStyle}>Email</label>
        <input style={{...inputStyle,marginBottom:12}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="la-tua@email.com" autoComplete="email" />
        <label style={labelStyle}>Password</label>
        <input style={{...inputStyle,marginBottom:16}} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&handleAuth()} />
        {error && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(239,68,68,0.1)", border:"1px solid #7f1d1d", borderRadius:4 }}>{error}</div>}
        {success && <div style={{ color:"#6ee7b7", fontSize:"0.82rem", marginBottom:12, padding:"0.5rem 0.7rem", background:"rgba(52,211,153,0.1)", border:"1px solid #065f46", borderRadius:4 }}>{success}</div>}
        <BigBtn onClick={handleAuth} gold disabled={loading} icon={mode==="login"?"🔑":"📝"}>
          {loading?"Attendere..." : mode==="login"?"Entra nel Mondo":"Crea Account"}
        </BigBtn>
        <button
          onClick={()=>setScreen("master")}
          style={{
            width:"100%",
            marginTop:"0.9rem",
            padding:"0.75rem 1rem",
            background:"rgba(15,23,42,0.92)",
            border:"1px solid #fbbf24",
            borderRadius:6,
            color:"#f8e7b9",
            cursor:"pointer",
            fontFamily:"'Cinzel',serif",
            fontSize:"0.84rem",
            letterSpacing:"0.06em",
            fontWeight:700,
          }}
        >
          🛡️ Accesso Master
        </button>
      </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   MASTER PANEL AUTH WRAPPER
---------------------------------------------- */
function MasterPanelAuth({ setScreen, authUser }) {
  const [pwd, setPwd] = useState("");
  const [ok, setOk] = useState(() => canAccessMasterPanel(authUser));
  const [err, setErr] = useState(false);

  useEffect(() => {
    if(canAccessMasterPanel(authUser)) setOk(true);
  }, [authUser]);

  if(ok) return <MasterPanel setScreen={setScreen} authUser={authUser} />;

  return (
    <div style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.36)" }} />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:360, background:"rgba(0,0,0,0.55)", border:"1px solid #374151", borderRadius:8, padding:"2rem", textAlign:"center" }}>
        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🛡️</div>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", marginBottom:"0.5rem" }}>🛡️ Pannello Master</h2>
        <p style={{ color:"#9ca3af", fontSize:"0.78rem", marginBottom:"1.5rem" }}>Accesso riservato al Master</p>
        <label style={labelStyle}>Password Master</label>
        <input
          style={{...inputStyle,marginBottom:12,textAlign:"center",letterSpacing:"0.2em"}}
          type="password"
          value={pwd}
          onChange={e=>{ setPwd(e.target.value); setErr(false); }}
          placeholder="Password"
          onKeyDown={e=>e.key==="Enter"&&(pwd===MASTER_PASSWORD?setOk(true):setErr(true))}
        />
        {err && <div style={{ color:"#fca5a5", fontSize:"0.82rem", marginBottom:12 }}>Password errata.</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <BigBtn onClick={()=>pwd===MASTER_PASSWORD?setOk(true):setErr(true)} gold icon="🗝️">Entra</BigBtn>
          <SmallBtn onClick={()=>setScreen("landing")}>← Torna alla home</SmallBtn>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   LANDING
---------------------------------------------- */
function FireEmbers() {
  const particles = useMemo(() => {
    const embers = Array.from({ length: 60 }, (_, i) => ({
      id: `e${i}`,
      left: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 6 + 4,
      delay: -(Math.random() * 14),
      drift: (Math.random() - 0.5) * 120,
      color: ["#ff6b00","#ef4444","#fbbf24","#f97316","#dc2626","#fb923c","#fde68a"][Math.floor(Math.random()*7)],
      opacity: Math.random() * 0.65 + 0.3,
    }));
    const ash = Array.from({ length: 18 }, (_, i) => ({
      id: `a${i}`,
      left: Math.random() * 100,
      size: Math.random() * 4 + 3,
      duration: Math.random() * 9 + 9,
      delay: -(Math.random() * 18),
      drift: (Math.random() - 0.5) * 180,
      color: `rgba(255,${140 + Math.floor(Math.random()*80)},${Math.floor(Math.random()*50)},${(Math.random()*0.25+0.1).toFixed(2)})`,
      opacity: Math.random() * 0.22 + 0.08,
    }));
    return [...embers, ...ash];
  }, []);

  return (
    <>
      <style>{`
        @keyframes riseEmber {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--op); }
          70%  { opacity: calc(var(--op) * 0.5); }
          100% { transform: translateY(-108vh) translateX(var(--dx)) scale(0.08); opacity: 0; }
        }
        @keyframes fireGlow {
          0%, 100% { opacity: 0.22; }
          50%       { opacity: 0.40; }
        }
        @keyframes fireGlowSide {
          0%, 100% { opacity: 0.14; }
          50%       { opacity: 0.28; }
        }
        @keyframes vignettePulse {
          0%, 100% { opacity: 0.72; }
          50%       { opacity: 0.82; }
        }
      `}</style>

      {/* Vignette angoli */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)",
        animation:"vignettePulse 6s ease-in-out infinite" }} />

      {/* Bagliore fuoco basso-centro */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, height:"35vh", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 50% 100%, rgba(180,45,0,0.42) 0%, rgba(120,20,0,0.18) 45%, transparent 72%)",
        animation:"fireGlow 2.8s ease-in-out infinite" }} />

      {/* Bagliore laterale sinistro */}
      <div style={{ position:"fixed", bottom:0, left:0, height:"50vh", width:"28vw", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 0% 100%, rgba(200,55,0,0.26) 0%, transparent 68%)",
        animation:"fireGlowSide 3.5s 0.8s ease-in-out infinite" }} />

      {/* Bagliore laterale destro */}
      <div style={{ position:"fixed", bottom:0, right:0, height:"50vh", width:"28vw", pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 100% 100%, rgba(200,55,0,0.26) 0%, transparent 68%)",
        animation:"fireGlowSide 3.5s 1.9s ease-in-out infinite" }} />

      {/* Particelle */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position:"absolute",
            bottom:"-6px",
            left:`${p.left}%`,
            width:`${p.size}px`,
            height:`${p.size}px`,
            borderRadius:"50%",
            background: p.color,
            boxShadow:`0 0 ${p.size*2}px ${p.color}, 0 0 ${p.size*5}px ${p.color}`,
            "--op": p.opacity,
            "--dx": `${p.drift}px`,
            animation:`riseEmber ${p.duration}s ${p.delay}s linear infinite`,
          }} />
        ))}
      </div>
    </>
  );
}

function FallingLeaves() {
  const leafEmojis = ['🍃','🍂','🍁','🌿'];
  const leaves = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: Math.random() * 98,
    size: 10 + Math.random() * 12,
    emoji: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
    duration: 10 + Math.random() * 12,
    swayDuration: 2.2 + Math.random() * 2.8,
    delay: Math.random() * 20,
    sw: Math.round(18 + Math.random() * 44),   // sway amplitude px (dimensionless for calc)
    rot: Math.round(150 + Math.random() * 390), // total rotation deg (dimensionless for calc)
  })), []);

  return (
    <>
      <style>{`
        @keyframes leafFall {
          0%   { transform: translateY(-40px); opacity: 0; }
          5%   { opacity: 0.85; }
          93%  { opacity: 0.7; }
          100% { transform: translateY(115vh); opacity: 0; }
        }
        @keyframes leafSway {
          0%   { transform: translateX(0px) rotate(0deg); }
          20%  { transform: translateX(calc(var(--sw) * 1px)) rotate(calc(var(--rot) * 0.18deg)); }
          45%  { transform: translateX(calc(var(--sw) * -0.65px)) rotate(calc(var(--rot) * 0.42deg)); }
          65%  { transform: translateX(calc(var(--sw) * 0.85px)) rotate(calc(var(--rot) * 0.68deg)); }
          85%  { transform: translateX(calc(var(--sw) * -0.4px)) rotate(calc(var(--rot) * 0.88deg)); }
          100% { transform: translateX(calc(var(--sw) * 0.3px)) rotate(calc(var(--rot) * 1deg)); }
        }
      `}</style>
      {leaves.map(l => (
        <div key={l.id} style={{
          position:'fixed', left:`${l.left}%`, top:'-30px',
          pointerEvents:'none', zIndex:9990,
          animation:`leafFall ${l.duration}s ${l.delay}s linear infinite`,
        }}>
          <div style={{
            fontSize:`${l.size}px`, lineHeight:1,
            '--sw': l.sw, '--rot': l.rot,
            animation:`leafSway ${l.swayDuration}s ${l.delay}s ease-in-out infinite`,
            userSelect:'none',
          }}>{l.emoji}</div>
        </div>
      ))}
    </>
  );
}

function Landing({ setScreen, goGame, myId, authUser, setAuthUser }) {
  const meta = getMeta();
  const [characters, setCharacters] = useState([]);
  const [loadingChars, setLoadingChars] = useState(true);

  useEffect(() => { audioManager.playBGM("intro"); }, []);

  async function loadCharacters() {
    if(!authUser?.id) { setCharacters([]); setLoadingChars(false); return; }
    setLoadingChars(true);
    try {
      const nextCharacters = await dbGetAccountCharacters(authUser.id);
      debugCharacterFlow("character_list_refresh_result", {
        accountId: authUser.id,
        count: nextCharacters.length,
        ids: nextCharacters.map(ch => ch.id),
      });
      setCharacters(nextCharacters);
    } finally {
      setLoadingChars(false);
    }
  }

  useEffect(()=>{ loadCharacters(); }, [authUser?.id]);

  async function logout() {
    await supabase.auth.signOut();
    setAuthUser(null);
    localStorage.removeItem("eoz_myId");
  }

  async function handleDeleteCharacter(character) {
    if(!character?.id) return;
    if(!window.confirm(`Eliminare definitivamente ${character.name}?`)) return;
    await dbDeleteCharacter(character.id);
    localStorage.removeItem(equipmentKey(character.id));
    if((localStorage.getItem("eoz_myId") || "").trim() === character.id) localStorage.removeItem("eoz_myId");
    await loadCharacters();
  }

  return (
    <div onClick={() => audioManager.playBGM("intro")} style={{ minHeight:"100vh", width:"100vw", backgroundImage:`url(${BACKGROUND_URL})`, backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"2rem 1rem", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(at 15% 50%, rgba(109,40,217,0.3) 0%, rgba(0,0,0,0) 55%), radial-gradient(at 85% 30%, rgba(109,40,217,0.2) 0%, rgba(0,0,0,0) 50%), rgba(0,0,0,0.42)" }} />
      <FireEmbers />
      <FallingLeaves />
      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
      {meta.logo
        ? <img src={meta.logo} alt="logo" style={{ maxWidth:260, maxHeight:160, objectFit:"contain", marginBottom:"1rem", filter:"drop-shadow(0 0 24px rgba(251,191,36,.5))" }} />
        : <p style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontSize:"1rem", letterSpacing:"0.6em", margin:"0 0 0.5rem" }}>⚔ ZODAR ⚔</p>
      }
      <h1 style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(2.2rem,8vw,5rem)", margin:"0.2rem 0", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.12em", animation:"goldenGlow 4s ease-in-out infinite" }}>
        {meta.worldName}
      </h1>
      <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(0.65rem,2vw,0.85rem)", color:"#7c3aed", letterSpacing:"0.3em", textTransform:"uppercase", margin:"0.2rem 0 1.6rem" }}>{meta.worldSub}</p>

      <div style={{ width:"100%", maxWidth:940, background:"rgba(0,0,0,0.42)", border:"1px solid #374151", borderRadius:14, padding:"1.4rem", backdropFilter:"blur(8px)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:"1rem", flexWrap:"wrap" }}>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#f8e7b9", fontSize:"1.25rem" }}>Selezione Eroe</div>
            <div style={{ color:"#9ca3af", fontSize:"0.82rem" }}>Scegli quale eroe far varcare il portale.</div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <BigBtn onClick={()=>setScreen("create")} gold icon="🛠️">Nuovo Eroe</BigBtn>
            <BigBtn onClick={logout} dark icon="🚪">Esci</BigBtn>
            {canAccessMasterPanel(authUser) && <BigBtn onClick={()=>setScreen("master")} dark icon="🛡️">Pannello Master</BigBtn>}
          </div>
        </div>

        {loadingChars && <div style={{ color:"#9ca3af", padding:"2rem 0" }}>Caricamento personaggi...</div>}
        {!loadingChars && !characters.length && (
          <div style={{ color:"#9ca3af", padding:"2.5rem 1rem", border:"1px dashed #374151", borderRadius:10 }}>
            Nessun eroe su questo account. Crea la tua prima scheda.
          </div>
        )}
        {!loadingChars && !!characters.length && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12, textAlign:"left" }}>
            {characters.map(ch=>{
              const cls = CLASSES[ch.class || "warrior"] || CLASSES.warrior;
              const race = RACES[ch.race || "human"] || RACES.human;
              const dead = !!ch.dead;
              const status = dead ? "Morto" : (ch.hp || 0) > 0 ? "Pronto" : "Ferito";
              return (
                <div key={ch.id} style={{ background:dead?"rgba(38,10,10,0.66)":"rgba(15,23,42,0.72)", border:`1px solid ${dead?"#7f1d1d":"#334155"}`, borderRadius:12, padding:"1rem", boxShadow:"0 14px 34px rgba(0,0,0,0.22)" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                    <ArtThumb src={getPlayerPortrait(ch)} alt={ch.name} size={72} radius={18} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:"'Cinzel',serif", color:dead?"#fca5a5":"#f8fafc", fontWeight:700, fontSize:"1rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ch.name}</div>
                      <div style={{ color:"#9ca3af", fontSize:"0.74rem" }}>{race.emoji} {race.name} • {cls.emoji} {cls.name}</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
                        <span style={{ padding:"2px 8px", borderRadius:999, background:dead?"rgba(127,29,29,0.45)":"rgba(51,65,85,0.62)", color:dead?"#fecaca":"#cbd5e1", fontSize:"0.68rem" }}>{status}</span>
                        <span style={{ padding:"2px 8px", borderRadius:999, background:"rgba(91,33,182,0.35)", color:"#ddd6fe", fontSize:"0.68rem" }}>Lv.{ch.level || 1}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:10, fontSize:"0.74rem", color:"#94a3b8", marginBottom:10 }}>
                    <span>❤️ {ch.hp}/{ch.maxHp}</span>
                    <span>💰 {ch.gold || 0} oro</span>
                    <span>👥 {ch.partyCode || "-"}</span>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {!dead && <BigBtn onClick={()=>goGame(ch)} gold icon="⚔️">Gioca</BigBtn>}
                    {dead && <SmallBtn red onClick={()=>handleDeleteCharacter(ch)}>Elimina</SmallBtn>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {authUser && <p style={{ marginTop:"1rem", color:"#64748b", fontSize:"0.72rem" }}>Connesso come {authUser.email}</p>}
      <p style={{ marginTop:"1.5rem", color:"#1f2937", fontSize:"0.7rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.12em" }}>GDR TESTUALE • FANTASY • MULTIPLAYER ONLINE</p>
      </div>{/* /zIndex wrapper */}
    </div>
  );
}

/* ----------------------------------------------
   CREATE CHARACTER
---------------------------------------------- */
function CreateChar({ setScreen, goGame, authUser }) {
  const [name, setName] = useState("");
  const [realPlayerName, setRealPlayerName] = useState("");
  const [cls,  setCls]  = useState("warrior");
  const [race, setRace] = useState("human");
  const [gender, setGender] = useState("male");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const c = CLASSES[cls]; const r = RACES[race];

  async function create() {
    if(!name.trim() || !realPlayerName.trim() || loading) return;
    setLoading(true);
    try {
      debugCharacterFlow("create_start", { accountId: authUser?.id || null, name: name.trim(), realPlayerName: realPlayerName.trim(), class: cls, race });
      const id = `pc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
      const partyCode = code.trim().toUpperCase() || Math.random().toString(36).slice(2,6).toUpperCase();
      const maxHp = c.hp + r.hpB;
      const player = {
        id, name:name.trim(), class:cls, race:race, gender:gender, partyCode,
        accountId: authUser?.id || null,
        hp:maxHp, maxHp, atk:c.atk+r.atkB, def:c.def+r.defB,
        mag:c.mag+r.magB, init:c.init+r.initB,
        xp:0, level:1, gold:0, dead:false,
      };
      debugCharacterFlow("create_player_generated", player);
      debugCharacterFlow("save_attempt", { id: player.id, accountId: player.accountId, partyCode: player.partyCode });
      const { error: saveError, data: savedPlayer } = await dbSavePlayer(player);
      debugCharacterFlow("save_result", {
        requestedId: player.id,
        savedId: savedPlayer?.id || null,
        accountId: savedPlayer?.account_id || null,
        dead: savedPlayer?.dead ?? null,
        error: saveError?.message || null,
      });
      if(saveError || !savedPlayer?.id) throw saveError || new Error("Salvataggio personaggio fallito");
      saveStoredCharacterGender(savedPlayer.id, gender);
      await dbSavePlayerMasterMeta({
        playerId: savedPlayer.id,
        partyCode,
        heroName: player.name,
        realPlayerName: realPlayerName.trim(),
      });
      const charactersAfterSave = authUser?.id ? await dbGetAccountCharacters(authUser.id) : [];
      debugCharacterFlow("character_list_after_save", {
        accountId: authUser?.id || null,
        count: charactersAfterSave.length,
        ids: charactersAfterSave.map(ch => ch.id),
      });
      const meta = getMeta();
      await dbSendMessage({ party_code:partyCode, author:"Sistema", type:"system",
        content:`⚔️ **${player.name} il ${c.name}** è entrato nel mondo di **${meta.worldName}**! ${c.emoji}` });
      await goGame({
        id: savedPlayer.id,
        dead: !!savedPlayer.dead,
        accountId: savedPlayer.account_id || authUser?.id || null,
      });
    } catch(e) {
      debugCharacterFlow("create_failure", { error: e?.message || String(e) });
      console.error("Errore creazione personaggio:", e);
      alert(`Creazione personaggio fallita.\n\nMotivo: ${e?.message || "errore sconosciuto"}`);
    } finally {
      setLoading(false);
    }
  }

  const canContinueFromName = name.trim() && realPlayerName.trim();
  const steps = ["Nomi","Classe","Razza e Genere","Party"];
  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:620, margin:"0 auto", padding:"1.5rem 1rem", minHeight:"100vh" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1.5rem" }}>
        <button onClick={()=>setScreen("landing")} style={backBtnStyle}>← Indietro</button>
        <h2 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.2rem", margin:0 }}>Forgia il tuo Destino</h2>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:"1.5rem" }}>
        {steps.map((s,i)=>(
          <div key={s} onClick={()=>i<step&&setStep(i)} style={{ flex:1, padding:"0.4rem", textAlign:"center", fontFamily:"'Cinzel',serif", fontSize:"0.68rem", letterSpacing:"0.06em", cursor:i<step?"pointer":"default", borderRadius:4, background:i===step?"rgba(109,40,217,0.35)":i<step?"rgba(109,40,217,0.15)":"rgba(255,255,255,0.02)", border:`1px solid ${i<=step?"#7c3aed":"#1f2937"}`, color:i<=step?"#c4b5fd":"#4b5563" }}>
            {i<step?"✓ ":""}{s}
          </div>
        ))}
      </div>

      {step===0 && (
        <Card title="✏️ Nomi dell'eroe e del giocatore">
          <label style={labelStyle}>Nome dell'eroe</label>
          <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Il nome del tuo eroe..." maxLength={24} autoFocus onKeyDown={e=>e.key==="Enter"&&canContinueFromName&&setStep(1)} />
          <label style={{...labelStyle, marginTop:"0.9rem"}}>Nome e cognome del giocatore</label>
          <input style={inputStyle} value={realPlayerName} onChange={e=>setRealPlayerName(e.target.value)} placeholder="Es: Mario Rossi" maxLength={60} onKeyDown={e=>e.key==="Enter"&&canContinueFromName&&setStep(1)} />
          <p style={{ color:"#94a3b8", fontSize:"0.76rem", margin:"8px 0 0", lineHeight:1.5 }}>
            Serve solo al Master per riconoscere e organizzare tavoli, party e ricompense. Gli altri giocatori vedranno solo il nome dell'eroe.
          </p>
          <div style={{ marginTop:"1rem" }}><BigBtn onClick={()=>canContinueFromName&&setStep(1)} gold disabled={!canContinueFromName}>Avanti →</BigBtn></div>
        </Card>
      )}
      {step===1 && (
        <Card title="⚔️ Scegli la tua Classe">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8 }}>
            {Object.entries(CLASSES).map(([k,v])=>(
              <button key={k} onClick={()=>setCls(k)} style={{ padding:"0.8rem 0.5rem", background:cls===k?"rgba(109,40,217,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${cls===k?v.color:"#1f2937"}`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:"1.8rem" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:cls===k?v.color:"#d1d5db", fontSize:"0.82rem" }}>{v.name}</strong>
                {cls===k && <div style={{ fontSize:"0.62rem", color:"#9ca3af", textAlign:"center" }}>❤️{v.hp} ⚔️{v.atk} 🛡️{v.def} ✨{v.mag}</div>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(0)}>← Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(2)} gold>Avanti →</BigBtn>
          </div>
        </Card>
      )}
      {step===2 && (
        <Card title="🌍 Scegli Razza e Genere">
          <div style={{ display:"flex", gap:"1rem", marginBottom:"1rem" }}>
            <button onClick={()=>setGender("male")} style={{ flex:1, padding:"0.8rem", background:gender==="male"?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${gender==="male"?"#60a5fa":"#1f2937"}`, borderRadius:6, cursor:"pointer", color:gender==="male"?"#bfdbfe":"#9ca3af", fontFamily:"'Cinzel',serif" }}>♂️ Maschile</button>
            <button onClick={()=>setGender("female")} style={{ flex:1, padding:"0.8rem", background:gender==="female"?"rgba(236,72,153,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${gender==="female"?"#f472b6":"#1f2937"}`, borderRadius:6, cursor:"pointer", color:gender==="female"?"#fbcfe8":"#9ca3af", fontFamily:"'Cinzel',serif" }}>♀️ Femminile</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8 }}>
            {Object.entries(RACES).map(([k,v])=>(
              <button key={k} onClick={()=>setRace(k)} style={{ padding:"0.7rem 0.4rem", background:race===k?"rgba(109,40,217,0.3)":"rgba(255,255,255,0.03)", border:`2px solid ${race===k?"#a78bfa":"#1f2937"}`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:"1.5rem" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:"#d1d5db", fontSize:"0.78rem" }}>{v.name}</strong>
                {race===k && <small style={{ fontSize:"0.6rem", color:"#a78bfa", textAlign:"center", lineHeight:1.3 }}>
                  {[v.hpB&&`+${v.hpB}HP`,v.atkB&&`+${v.atkB}ATK`,v.defB&&`+${v.defB}DEF`,v.magB&&`+${v.magB}MAG`].filter(Boolean).join(" ")||"Versatile"}
                </small>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(1)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(3)} gold>Avanti ⏩</BigBtn>
          </div>
        </Card>
      )}
      {step===3 && (
        <Card title="👥 Conferma Eroe & Party">
          <div style={{ background:"rgba(10,14,23,0.8)", border:"1px solid #374151", borderRadius:6, padding:"1.2rem", marginBottom:"1rem", display:"flex", flexDirection:"column", alignItems:"center", gap:15 }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fbbf24', boxShadow: '0 0 20px rgba(251,191,36,0.3)', backgroundColor: '#000', position:'relative' }}>
              <img key={`${cls}-${race}-${gender}`} src={getPortraitPath(cls, race, gender)} alt={`${RACES[race].name} ${c.name} ${gender === "female" ? "femmina" : "maschio"}`} onError={(e)=>{
                e.currentTarget.src = getClassPortraitPath(cls, gender);
              }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontSize: "1.4rem", fontWeight:700 }}>{name||"Senza Nome"}</div>
              <div style={{ color:"#cbd5e1", fontSize:"0.9rem", margin: '4px 0' }}>{RACES[race].emoji} {RACES[race].name} • {c.emoji} {c.name}</div>
              <div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>❤️{c.hp+r.hpB} ⚔️{c.atk+r.atkB} 🛡️{c.def+r.defB} ✨{c.mag+r.magB}</div>
            </div>
          </div>
          <label style={labelStyle}>Codice Stanza Multiplayer</label>
          <input style={inputStyle} value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Es: DRAGON8" maxLength={8} />
          <p style={{ color:"#64748b", fontSize:"0.75rem", margin:"6px 0 0", lineHeight:1.5 }}>Se giochi da solo, lascia vuoto. Se giochi con amici, inserite tutti lo stesso codice.</p>
          <div style={{ display:"flex", gap:8, marginTop:"1.5rem" }}>
            <SmallBtn onClick={()=>setStep(2)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={create} gold icon="⭐" disabled={loading}>{loading?"Creazione in corso...":"Conferma ed Entra"}</BigBtn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ----------------------------------------------
   MASTER PANEL
---------------------------------------------- */
function MasterPanel({ setScreen, authUser }) {
  const [tab, setTab]       = useState("world");
  const [meta, setMeta]     = useState(getMeta());
  const [quests, setQuests] = useState(getQuests());
  const [monsters, setMonsters] = useState(getMonsters());
  const [editQ, setEditQ]   = useState(null);
  const [editM, setEditM]   = useState(null);
  const [saved, setSaved]   = useState(false);
  const [newStep, setNewStep] = useState("");
  const [dmBroadcast, setDmBroadcast] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [masterLogs, setMasterLogs] = useState([]);
  const [questSearch, setQuestSearch] = useState("");
  const [questDifficultyFilter, setQuestDifficultyFilter] = useState("all");
  const [monsterSearch, setMonsterSearch] = useState("");
  const [monsterTierFilter, setMonsterTierFilter] = useState("all");

  function saveAll() {
    saveMeta(meta); saveQuests(quests); saveMonsters(monsters);
    setSaved(true); setTimeout(()=>setSaved(false), 2200);
  }
  function handleLogo(e) {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>setMeta(m=>({...m,logo:ev.target.result})); r.readAsDataURL(f);
  }
  function addQuest() {
    const q={id:"q_"+Date.now(),title:"Nuova Missione",desc:"",flavor:"",difficulty:"medio",specialPassword:"",xpReward:200,goldReward:100,steps:[],enemies:[],active:true};
    setQuests(prev=>[...prev,q]); setEditQ({...q});
  }
  function addSpecialQuest() {
    const q={id:"sq_"+Date.now(),title:"Missione Speciale",desc:"",flavor:"",difficulty:"speciale",specialPassword:"",xpReward:500,goldReward:250,steps:[],enemies:[],active:true};
    setQuests(prev=>[...prev,q]); setEditQ({...q});
  }
  function saveEditQ() {
    const normalizedQuest = normalizeQuest({ ...editQ, difficulty: normalizeMissionDifficulty(editQ?.difficulty) });
    setQuests(prev=>prev.map(x=>x.id===normalizedQuest.id ? normalizedQuest : x));
    setEditQ(null);
  }
  function addStepToQ() {
    if(!newStep.trim()) return;
    setEditQ(q=>({...q,steps:[...q.steps,{ text:newStep.trim(), choices:{ good:{}, neutral:{}, bad:{} } }]}));
    setNewStep("");
  }
  function addEnemyToQ(monster) { setEditQ(q=>({...q,enemies:[...q.enemies,{...monster,maxHp:monster.hp,id:"e_"+Date.now()}]})); }
  function addMonster() {
    const m={id:"m_"+Date.now(),name:"Nuova Creatura",emoji:"🧩",hp:30,atk:8,def:3,xp:20,desc:"",isBoss:false};
    setMonsters(prev=>[...prev,m]); setEditM({...m});
  }
  function saveEditM() { setMonsters(prev=>prev.map(x=>x.id===editM.id?editM:x)); setEditM(null); }
  function syncDefaultQuests() {
    const current = quests.map(normalizeQuest);
    const currentIds = new Set(current.map(q => q.id));
    const missing = DEFAULT_QUESTS.map(normalizeQuest).filter(q => !currentIds.has(q.id));
    if(missing.length) setQuests([...current, ...missing]);
  }
  function syncDefaultMonsters() {
    const currentIds = new Set(monsters.map(m => m.id));
    const missing = DEFAULT_MONSTERS.filter(m => !currentIds.has(m.id));
    if(missing.length) setMonsters([...monsters, ...missing]);
  }
  async function sendDungeonMasterBroadcast() {
    const content = dmBroadcast.trim();
    if(!content || broadcasting) return;
    setBroadcasting(true);
    try {
      const players = await dbGetPlayers();
      const partyCodes = Array.from(new Set(players.map(player => player.partyCode).filter(Boolean)));
      for(const partyCode of partyCodes) {
        await dbSendMessage({ party_code:partyCode, author:"Dungeon Master", content, type:"narration" });
      }
      setDmBroadcast("");
    } finally {
      setBroadcasting(false);
    }
  }

  useEffect(()=>{
    if(tab !== "chat") return;
    let alive = true;
    const loadLogs = async () => {
      const msgs = await dbGetMessages();
      if(!alive) return;
      setMasterLogs(
        msgs
          .filter(msg => ["info","system"].includes(msg.type))
          .slice(-80)
          .reverse()
      );
    };
    loadLogs();
    const timer = setInterval(loadLogs, 5000);
    return ()=>{ alive = false; clearInterval(timer); };
  }, [tab]);

  const TABS = [{k:"world",l:"🌍 Mondo"},{k:"quests",l:"📜 Missioni"},{k:"monsters",l:"👾 Bestiari"},{k:"players",l:"👥 Giocatori"},{k:"party",l:"🏰 Party"},{k:"chat",l:"📣 Broadcast"},{k:"market",l:"🏪 Market"},{k:"users",l:"👤 Iscritti"}];
  const EMOJIS=["🗡️","🛡️","🏹","🪄","🔮","💀","🧌","🐉","🧛","💪","⚔️","⭐","🐺","🦅","🌿","🔥","🧙","👹","🗿","😈"];
  const visibleQuests = quests.filter(q => {
    const term = questSearch.trim().toLowerCase();
    const diff = normalizeMissionDifficulty(q.difficulty);
    const matchesTerm = !term || [q.title, q.desc, q.flavor, q.id].some(value => String(value || "").toLowerCase().includes(term));
    const matchesDiff = questDifficultyFilter === "all" || diff === questDifficultyFilter || (questDifficultyFilter === "locked" && !!q.specialPassword);
    return matchesTerm && matchesDiff;
  });
  const visibleMonsters = monsters.filter(m => {
    const term = monsterSearch.trim().toLowerCase();
    const hp = Number(m.hp) || 0;
    const tier = m.isBoss || hp >= 130 ? "boss" : hp >= 85 ? "hard" : hp >= 27 ? "mid" : "base";
    const matchesTerm = !term || [m.name, m.desc, m.id].some(value => String(value || "").toLowerCase().includes(term));
    const matchesTier = monsterTierFilter === "all" || tier === monsterTierFilter;
    return matchesTerm && matchesTier;
  });

  return (
    <div style={{ position:"relative", zIndex:1, maxWidth:1180, margin:"0 auto", padding:"1rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.2rem", paddingBottom:"1rem", borderBottom:"1px solid #1f2937", flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1.4rem", margin:0 }}>🛡️ Pannello Master</h1>
          <p style={{ color:"#94a3b8", fontSize:"0.78rem", margin:0 }}>Gestisci missioni, creature e contenuti del mondo</p>
        </div>
        <BigBtn onClick={saveAll} gold icon={saved?"?":"⭐"}>{saved?"Salvato!":"Salva tutto"}</BigBtn>
        <SmallBtn onClick={()=>setScreen("landing")}>← Torna al menu</SmallBtn>
      </div>
      {!canAccessMasterPanel(authUser) && (
        <div style={{ background:"rgba(127,29,29,0.88)", border:"1px solid #fca5a5", color:"#fff1f2", borderRadius:6, padding:"0.85rem 1rem", marginBottom:"1rem", fontSize:"0.86rem", lineHeight:1.45 }}>
          <strong>Accesso Master parziale.</strong> La password apre il pannello, ma per vedere e spostare i personaggi devi accedere al sito con l'account email Master autorizzato. Senza quella sessione Supabase la lista giocatori puo' risultare vuota.
        </div>
      )}
      <div style={{ display:"flex", gap:6, marginBottom:"1.2rem", flexWrap:"wrap" }}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>{ setEditQ(null); setEditM(null); setTab(t.k); }}
            style={{ padding:"0.5rem 1.1rem", background:tab===t.k?"#4c1d95":"rgba(15,23,42,0.92)", border:`1px solid ${tab===t.k?"#c4b5fd":"#64748b"}`, borderRadius:4, color:tab===t.k?"#ffffff":"#e2e8f0", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", letterSpacing:"0.05em", fontWeight:700, boxShadow:tab===t.k?"0 0 0 1px rgba(196,181,253,0.2), 0 8px 20px rgba(76,29,149,0.32)":"0 6px 16px rgba(0,0,0,0.2)", textShadow:"0 1px 2px rgba(0,0,0,0.75)" }}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==="world" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          <Card title="🌍 Nome del Mondo">
            <label style={labelStyle}>Nome principale</label>
            <input style={inputStyle} value={meta.worldName} onChange={e=>setMeta(m=>({...m,worldName:e.target.value}))} />
            <label style={{...labelStyle,marginTop:10}}>Sottotitolo</label>
            <input style={inputStyle} value={meta.worldSub} onChange={e=>setMeta(m=>({...m,worldSub:e.target.value}))} />
          </Card>
          <Card title="🖼️ Logo del Gioco">
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
              {meta.logo && <img src={meta.logo} alt="logo" style={{ maxWidth:180, maxHeight:110, objectFit:"contain", borderRadius:4, border:"1px solid #374151" }} />}
              <div>
                <label style={{ display:"inline-block", padding:"0.7rem 1.4rem", background:"rgba(109,40,217,0.25)", border:"1px solid #7c3aed", borderRadius:5, cursor:"pointer", color:"#c4b5fd", fontFamily:"'Cinzel',serif", fontSize:"0.85rem" }}>
                  📁 Carica Logo
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display:"none" }} />
                </label>
                {meta.logo && <button onClick={()=>setMeta(m=>({...m,logo:null}))} style={{ marginLeft:8, padding:"0.5rem 0.8rem", background:"rgba(239,68,68,0.15)", border:"1px solid #ef4444", borderRadius:4, color:"#fca5a5", cursor:"pointer", fontSize:"0.8rem" }}>🗑️ Rimuovi</button>}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab==="chat" && (
        <div style={{ display:"grid", gap:"1rem" }}>
          <Card title="📣 Messaggio ai Giocatori">
            <p style={{ color:"#9ca3af", fontSize:"0.8rem", margin:"0 0 0.9rem" }}>Invia un messaggio narrativo a tutti i party attivi. Ai giocatori apparirà come autore <strong style={{ color:"#e2d9c5" }}>Dungeon Master</strong>.</p>
            <textarea
              style={{...inputStyle,height:120,resize:"vertical"}}
              value={dmBroadcast}
              onChange={e=>setDmBroadcast(e.target.value)}
              placeholder="Scrivi il messaggio del Dungeon Master..."
            />
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"0.9rem" }}>
              <BigBtn onClick={sendDungeonMasterBroadcast} gold icon="📨" disabled={!dmBroadcast.trim() || broadcasting}>
                {broadcasting ? "Invio..." : "Invia a tutti"}
              </BigBtn>
            </div>
          </Card>
          <Card title="🧾 Log Tecnici">
            <p style={{ color:"#9ca3af", fontSize:"0.8rem", margin:"0 0 0.9rem" }}>Qui finiscono i messaggi filtrati dal player chat: economia, equipaggiamento e log di sistema.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:360, overflowY:"auto" }}>
              {!masterLogs.length && <div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Nessun log tecnico recente.</div>}
              {masterLogs.map(msg=>(
                <div key={msg.id} style={{ background:"rgba(15,23,42,0.76)", border:"1px solid #1e293b", borderRadius:6, padding:"0.75rem 0.85rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ color:"#a5b4fc", fontFamily:"'Cinzel',serif", fontSize:"0.72rem", letterSpacing:"0.05em" }}>{msg.author || "Sistema"}</span>
                    <span style={{ color:"#64748b", fontSize:"0.68rem" }}>{msg.party_code || "PARTY"}</span>
                  </div>
                  <div style={{ color:"#cbd5e1", fontSize:"0.82rem", lineHeight:1.55 }} dangerouslySetInnerHTML={{ __html:fmt(msg.content) }} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab==="quests" && !editQ && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
            <span style={{ color:"#94a3b8", fontSize:"0.85rem" }}>{visibleQuests.length}/{quests.length} missioni</span>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <SmallBtn onClick={syncDefaultQuests}>Mostra tutte le missioni base</SmallBtn>
              <BigBtn onClick={addSpecialQuest} gold icon="🔐">+ Speciale</BigBtn>
              <BigBtn onClick={addQuest} gold icon="?">+ Nuova Missione</BigBtn>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(220px,1fr) 180px", gap:8, marginBottom:"1rem" }}>
            <input style={inputStyle} value={questSearch} onChange={e=>setQuestSearch(e.target.value)} placeholder="Cerca per titolo, testo o ID..." />
            <select style={{...inputStyle,cursor:"pointer"}} value={questDifficultyFilter} onChange={e=>setQuestDifficultyFilter(e.target.value)}>
              <option value="all">Tutte</option>
              <option value="facile">Facili</option>
              <option value="medio">Medie</option>
              <option value="difficile">Difficili</option>
              <option value="speciale">Speciali</option>
              <option value="locked">Con password</option>
            </select>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {visibleQuests.map(q=>(
              <div key={q.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${q.active?"#4c1d95":"#1f2937"}`, borderRadius:6, padding:"0.9rem 1rem" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700, fontSize:"1rem" }}>{q.title}</span>
                      <span style={{ padding:"1px 8px", border:`1px solid ${DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#6b7280" }}>{missionDifficultyLabel(q.difficulty)}</span>
                      {!!q.specialPassword && <span style={{ fontSize:"0.65rem", color:"#c4b5fd", border:"1px solid #6d28d9", borderRadius:3, padding:"1px 5px" }}>PASSWORD</span>}
                      {!q.active && <span style={{ fontSize:"0.65rem", color:"#94a3b8", border:"1px solid #1f2937", borderRadius:3, padding:"1px 5px" }}>PAUSA</span>}
                    </div>
                    <p style={{ color:"#94a3b8", fontSize:"0.8rem", margin:"0 0 6px" }}>{q.desc||"Nessuna descrizione."}</p>
                    <div style={{ display:"flex", gap:14, fontSize:"0.72rem", color:"#94a3b8" }}>
                      <span>⭐ {q.xpReward} XP</span><span>💰 {q.goldReward} oro</span>
                      <span>🎭 {q.steps.length} scene</span><span>👾 {q.enemies.length} nemici</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <SmallBtn onClick={()=>setQuests(prev=>prev.map(x=>x.id===q.id?{...x,active:!x.active}:x))}>{q.active?"⭐":"⭐"}</SmallBtn>
                    <SmallBtn onClick={()=>setEditQ({...q})}>✏️</SmallBtn>
                    <SmallBtn red onClick={()=>{ if(window.confirm("Elimina?")) setQuests(prev=>prev.filter(x=>x.id!==q.id)); }}>🗑️</SmallBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="quests" && editQ && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, flex:1 }}>📜 {editQ.title}</h3>
            <BigBtn onClick={saveEditQ} gold icon="⭐">Salva Missione</BigBtn>
            <SmallBtn onClick={()=>setEditQ(null)}>? Annulla</SmallBtn>
          </div>
          <Card title="📋 Informazioni Base">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={labelStyle}>Titolo</label><input style={inputStyle} value={editQ.title} onChange={e=>setEditQ(q=>({...q,title:e.target.value}))} /></div>
              <div><label style={labelStyle}>Difficolt�</label>
                <select style={{...inputStyle,cursor:"pointer"}} value={normalizeMissionDifficulty(editQ.difficulty)} onChange={e=>setEditQ(q=>({...q,difficulty:e.target.value}))}>
                  <option value="facile">Facile</option>
                  <option value="medio">Medio</option>
                  <option value="difficile">Difficile</option>
                  <option value="speciale">Speciale</option>
                </select>
              </div>
              <div><label style={labelStyle}>XP</label><input style={inputStyle} type="number" value={editQ.xpReward} onChange={e=>setEditQ(q=>({...q,xpReward:+e.target.value}))} /></div>
              <div><label style={labelStyle}>Oro</label><input style={inputStyle} type="number" value={editQ.goldReward} onChange={e=>setEditQ(q=>({...q,goldReward:+e.target.value}))} /></div>
            </div>
            <label style={{...labelStyle,marginTop:10}}>Password speciale</label>
            <input
              style={inputStyle}
              value={editQ.specialPassword || ""}
              onChange={e=>setEditQ(q=>({...q,specialPassword:e.target.value.trim()}))}
              placeholder="Lascia vuoto per missione pubblica. Compila per renderla sbloccabile."
            />
            <label style={{...labelStyle,marginTop:10}}>Descrizione</label>
            <textarea style={{...inputStyle,height:75,resize:"vertical"}} value={editQ.desc} onChange={e=>setEditQ(q=>({...q,desc:e.target.value}))} placeholder="Descrivi la missione..." />
            <label style={{...labelStyle,marginTop:10}}>Citazione narrativa</label>
            <textarea style={{...inputStyle,height:52,resize:"vertical"}} value={editQ.flavor} onChange={e=>setEditQ(q=>({...q,flavor:e.target.value}))} placeholder="�Una frase epica...�" />
          </Card>
          <Card title="🎭 Scene della Missione">
            <p style={{ color:"#94a3b8", fontSize:"0.75rem", marginBottom:10 }}>Ogni scena viene narrata quando i giocatori digitano <strong style={{color:"#a78bfa"}}>avanza</strong>. Puoi usare **grassetto** e *corsivo*.</p>
            {editQ.steps.map((s,i)=>{
              const step = typeof s === "string" ? { text: s } : (s || { text: "" });
              const choices = step.choices || {};
              const setStepAt = (newStep) => { const st=[...editQ.steps]; st[i]=newStep; setEditQ(q=>({...q,steps:st})); };
              const updateStep = (updates) => setStepAt({ ...step, ...updates });
              const updateChoice = (key, field, value) => {
                const existing = choices[key] || {};
                setStepAt({ ...step, choices: { ...choices, [key]: { ...existing, [field]: value } } });
              };
              return (
                <div key={i} style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:8, marginBottom:8 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:6, alignItems:"flex-start" }}>
                    <span style={{ color:"#94a3b8", fontSize:"0.8rem", minWidth:22, paddingTop:10 }}>{i+1}.</span>
                    <textarea style={{...inputStyle,flex:1,height:60,resize:"vertical",fontSize:"0.85rem"}} value={step.text}
                      onChange={e=>updateStep({ text: e.target.value })} />
                    <div style={{ display:"flex", flexDirection:"column", gap:3, paddingTop:2 }}>
                      <button onClick={()=>{ const st=[...editQ.steps]; if(i>0){[st[i],st[i-1]]=[st[i-1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} style={iconBtnStyle}>?</button>
                      <button onClick={()=>{ const st=[...editQ.steps]; if(i<st.length-1){[st[i],st[i+1]]=[st[i+1],st[i]]; setEditQ(q=>({...q,steps:st}));} }} style={iconBtnStyle}>?</button>
                      <button onClick={()=>setEditQ(q=>({...q,steps:q.steps.filter((_,j)=>j!==i)}))} style={{...iconBtnStyle,color:"#f87171"}}>?</button>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:6 }}>
                    {[
                      ["good","? Buona"],
                      ["neutral","? Media"],
                      ["bad","? Sbagliata"],
                    ].map(([key,label])=>{
                      const choice = choices[key] || {};
                      return (
                        <div key={key} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:8 }}>
                          <div style={{ fontSize:"0.72rem", fontWeight:700, marginBottom:4 }}>{label}</div>
                          <input style={{...inputStyle,marginBottom:6}} value={choice.text||""} placeholder="Testo scelta" onChange={e=>updateChoice(key,"text",e.target.value)} />
                          <div style={{ display:"flex", gap:6 }}>
                            <input style={{...inputStyle,flex:1}} type="number" value={choice.xp||0} placeholder="XP" onChange={e=>updateChoice(key,"xp",e.target.value)} />
                            <input style={{...inputStyle,flex:1}} type="number" value={choice.gold||0} placeholder="Oro" onChange={e=>updateChoice(key,"gold",e.target.value)} />
                          </div>
                          <input style={{...inputStyle,marginTop:6}} type="number" value={choice.nextStep||""} placeholder="Prossima scena (#)" onChange={e=>updateChoice(key,"nextStep",e.target.value)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <textarea style={{...inputStyle,flex:1,height:55,resize:"vertical",fontSize:"0.85rem"}} value={newStep} onChange={e=>setNewStep(e.target.value)} placeholder="Scrivi la prossima scena..." />
              <BigBtn onClick={addStepToQ} gold>+ Aggiungi</BigBtn>
            </div>
          </Card>
          <Card title="👾 Nemici della Missione">
            <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
              {editQ.enemies.map((en,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"0.4rem 0.7rem", background:"rgba(239,68,68,0.06)", border:`1px solid ${en.isBoss?"#f59e0b":"rgba(239,68,68,0.2)"}`, borderRadius:4 }}>
                  <span style={{ fontSize:"1.2rem" }}>{en.emoji}</span>
                  <span style={{ color:en.isBoss?"#fbbf24":"#e2d9c5", fontWeight:en.isBoss?700:400 }}>{en.name}{en.isBoss?" ⭐":""}</span>
                  <span style={{ color:"#94a3b8", fontSize:"0.72rem" }}>❤️{en.hp} ⚔️{en.atk} 🛡️{en.def} ⭐{en.xp}xp</span>
                  <button onClick={()=>setEditQ(q=>({...q,enemies:q.enemies.filter((_,j)=>j!==i)}))} style={{ marginLeft:"auto", ...iconBtnStyle, color:"#f87171" }}>?</button>
                </div>
              ))}
            </div>
            <p style={{ color:"#94a3b8", fontSize:"0.75rem", marginBottom:8 }}>Aggiungi dal bestiario:</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {monsters.map(m=>(
                <button key={m.id} onClick={()=>addEnemyToQ(m)}
                  style={{ padding:"0.4rem 0.7rem", background:"rgba(255,255,255,0.04)", border:`1px solid ${m.isBoss?"#f59e0b":"#374151"}`, borderRadius:4, color:"#d1d5db", cursor:"pointer", fontSize:"0.8rem", fontFamily:"inherit" }}>
                  {m.emoji} {m.name}{m.isBoss?" ⭐":""}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab==="monsters" && !editM && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1rem", flexWrap:"wrap" }}>
            <span style={{ color:"#94a3b8", fontSize:"0.85rem" }}>{visibleMonsters.length}/{monsters.length} creature</span>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <SmallBtn onClick={syncDefaultMonsters}>Mostra tutto il bestiario base</SmallBtn>
              <BigBtn onClick={addMonster} gold icon="?">+ Nuova Creatura</BigBtn>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(220px,1fr) 180px", gap:8, marginBottom:"1rem" }}>
            <input style={inputStyle} value={monsterSearch} onChange={e=>setMonsterSearch(e.target.value)} placeholder="Cerca creatura..." />
            <select style={{...inputStyle,cursor:"pointer"}} value={monsterTierFilter} onChange={e=>setMonsterTierFilter(e.target.value)}>
              <option value="all">Tutti</option>
              <option value="base">Base</option>
              <option value="mid">Intermedi</option>
              <option value="hard">Duri</option>
              <option value="boss">Boss</option>
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:8 }}>
            {visibleMonsters.map(m=>(
              <div key={m.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${m.isBoss?"#92400e":"#1f2937"}`, borderRadius:6, padding:"0.8rem" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                  <ArtThumb src={getMonsterImage(m)} alt={m.name} size={68} radius={16} />
                  <div>
                    <div style={{ fontFamily:"'Cinzel',serif", color:m.isBoss?"#fbbf24":"#e2d9c5", fontWeight:700 }}>{m.name}{m.isBoss?" ⭐":""}</div>
                    <div style={{ color:"#94a3b8", fontSize:"0.68rem" }}>{m.desc}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, fontSize:"0.73rem", color:"#94a3b8", marginBottom:8 }}>
                  <span>❤️{m.hp}</span><span>⚔️{m.atk}</span><span>🛡️{m.def}</span><span>⭐{m.xp}xp</span>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <SmallBtn onClick={()=>setEditM({...m})}>✏️</SmallBtn>
                  <SmallBtn red onClick={()=>{ if(window.confirm("Elimina?")) setMonsters(prev=>prev.filter(x=>x.id!==m.id)); }}>🗑️</SmallBtn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="monsters" && editM && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, flex:1 }}>👾 Modifica Creatura</h3>
            <BigBtn onClick={saveEditM} gold icon="⭐">Salva</BigBtn>
            <SmallBtn onClick={()=>setEditM(null)}>? Annulla</SmallBtn>
          </div>
          <Card title="Scheda Creatura">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={labelStyle}>Nome</label><input style={inputStyle} value={editM.name} onChange={e=>setEditM(m=>({...m,name:e.target.value}))} /></div>
              <div>
                <label style={labelStyle}>Emoji</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginBottom:4 }}>
                  {EMOJIS.map(e=><button key={e} onClick={()=>setEditM(m=>({...m,emoji:e}))} style={{ fontSize:"1.2rem", padding:"2px 5px", background:editM.emoji===e?"rgba(109,40,217,0.4)":"rgba(255,255,255,0.04)", border:`1px solid ${editM.emoji===e?"#7c3aed":"#1f2937"}`, borderRadius:3, cursor:"pointer" }}>{e}</button>)}
                </div>
              </div>
              <div><label style={labelStyle}>HP</label><input style={inputStyle} type="number" value={editM.hp} onChange={e=>setEditM(m=>({...m,hp:+e.target.value}))} /></div>
              <div><label style={labelStyle}>ATK</label><input style={inputStyle} type="number" value={editM.atk} onChange={e=>setEditM(m=>({...m,atk:+e.target.value}))} /></div>
              <div><label style={labelStyle}>DEF</label><input style={inputStyle} type="number" value={editM.def} onChange={e=>setEditM(m=>({...m,def:+e.target.value}))} /></div>
              <div><label style={labelStyle}>XP</label><input style={inputStyle} type="number" value={editM.xp} onChange={e=>setEditM(m=>({...m,xp:+e.target.value}))} /></div>
            </div>
            <label style={{...labelStyle,marginTop:10}}>Lore</label>
            <textarea style={{...inputStyle,height:70,resize:"vertical"}} value={editM.desc} onChange={e=>setEditM(m=>({...m,desc:e.target.value}))} />
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10 }}>
              <input type="checkbox" id="bossChk" checked={!!editM.isBoss} onChange={e=>setEditM(m=>({...m,isBoss:e.target.checked}))} style={{ width:18, height:18 }} />
              <label htmlFor="bossChk" style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontSize:"0.85rem", cursor:"pointer" }}>⭐ un Boss ⭐</label>
            </div>
          </Card>
        </div>
      )}

      {tab==="players" && <PlayersView authUser={authUser} />}
      {tab==="party" && <PartiesView authUser={authUser} />}
      {tab==="market" && <MarketView />}
      {tab==="users" && <UsersView />}
    </div>
  );
}

function PlayersView({ authUser }) {
  const [players, setPlayers] = useState([]);
  const [partyStates, setPartyStates] = useState({});
  const [playerMeta, setPlayerMeta] = useState({});
  const [busy, setBusy] = useState({});

  useEffect(()=>{
    const load = async () => {
      const [{ data }, meta] = await Promise.all([
        supabase.from("players").select("*").order("level", { ascending:false }),
        dbGetPlayerMasterMeta().catch(() => ({})),
      ]);
      setPlayers(data||[]);
      setPlayerMeta(meta || {});
      // load party states for buff display
      const codes = [...new Set((data||[]).map(p=>p.party_code).filter(Boolean))];
      const states = {};
      await Promise.all(codes.map(async code=>{
        const { data: ps } = await supabase.from("party_state").select("state").eq("party_code", code).single();
        if(ps?.state) states[code] = ps.state;
      }));
      setPartyStates(states);
    };
    load();
    const interval = setInterval(load, 4000);
    return ()=>clearInterval(interval);
  },[]);

  // Direct partial update — avoids the camelCase/snake_case bug in dbSavePlayer
  async function masterUpdate(playerId, fields, optimistic) {
    setBusy(b=>({...b,[playerId]:true}));
    await supabase.from("players").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", playerId);
    setPlayers(prev=>prev.map(x=>x.id===playerId?{...x,...optimistic}:x));
    setBusy(b=>({...b,[playerId]:false}));
  }

  async function masterSetBuff(p, buffKey, turns) {
    const code = p.party_code;
    if(!code) { window.alert("Questo giocatore non è in un party attivo."); return; }
    const currentState = partyStates[code] || {};
    const currentBuffs = currentState.masterBuffs || {};
    const playerBuffs = currentBuffs[p.id] || {};
    const newState = { ...currentState, masterBuffs: { ...currentBuffs, [p.id]: { ...playerBuffs, [buffKey]: turns } } };
    await supabase.from("party_state").update({ state: newState, updated_at: new Date().toISOString() }).eq("party_code", code);
    setPartyStates(prev=>({...prev,[code]:newState}));
    window.alert(`✅ ${buffKey === "immortal" ? "Immortalità" : "Tiri Critici"} attivata per ${p.name} (${turns} turni)`);
  }

  return (
    <div>
      {!canAccessMasterPanel(authUser) && (
        <div style={{ background:"rgba(127,29,29,0.78)", border:"1px solid #fca5a5", color:"#fff1f2", borderRadius:6, padding:"0.8rem 1rem", marginBottom:"1rem", fontSize:"0.82rem", lineHeight:1.45 }}>
          Per vedere tutti gli avventurieri devi accedere con l'account Master autorizzato. La sola password non ha i permessi database sui personaggi.
        </div>
      )}
      <p style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>{players.length} avventurieri — aggiornamento automatico</p>
      {!players.length && <div style={{ color:"#94a3b8", textAlign:"center", padding:"3rem", border:"1px dashed #374151", borderRadius:6 }}>Nessun giocatore ancora.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12 }}>
        {players.map(p=>{
          const cls=CLASSES[p?.class||'warrior']||{};
          const race=RACES[p?.race||'human']||{};
          const baseHp=(cls.hp||0)+(race.hpB||0);
          const baseAtk=(cls.atk||0)+(race.atkB||0);
          const baseDef=(cls.def||0)+(race.defB||0);
          const baseMag=(cls.mag||0)+(race.magB||0);
          const isBusy = !!busy[p.id];
          const pState = partyStates[p.party_code] || {};
          const pBuffs = (pState.masterBuffs || {})[p.id] || {};
          const masterMeta = playerMeta[p.id] || {};
          return (
            <div key={p?.id} style={{ background:"rgba(15,23,42,0.85)", border:"1px solid rgba(148,163,184,0.2)", borderRadius:10, padding:"1rem" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                <ArtThumb src={getPlayerPortrait({ id:p?.id, class:p?.class, race:p?.race, gender:p?.gender, portrait:p?.portrait, image:p?.image })} alt={p?.name||"PG"} size={56} radius={12} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, fontSize:"0.95rem" }}>{p?.name}</div>
                  {masterMeta.realPlayerName && <div style={{ color:"#fbbf24", fontSize:"0.72rem", marginTop:2 }}>Giocatore: {masterMeta.realPlayerName}</div>}
                  <div style={{ color:"#94a3b8", fontSize:"0.7rem" }}>{race.emoji} {race.name} · {cls.name} · Lv.{p?.level||1}</div>
                  <div style={{ color:"#94a3b8", fontSize:"0.68rem", marginTop:2 }}>❤️ {p?.hp||0}/{p?.max_hp||0} · 💰 {p?.gold||0} · ⭐ {p?.xp||0} XP</div>
                </div>
                {p?.dead && <span style={{ padding:"2px 8px", background:"rgba(127,29,29,0.5)", border:"1px solid #ef4444", borderRadius:4, fontSize:"0.65rem", color:"#fca5a5" }}>💀 MORTO</span>}
              </div>
              <HpBar cur={p?.hp||0} max={p?.max_hp||0} />
              {(pBuffs.immortal > 0 || pBuffs.crit > 0) && (
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                  {pBuffs.immortal > 0 && <span style={{ fontSize:"0.68rem", color:"#fbbf24", background:"rgba(180,83,9,0.25)", border:"1px solid #fbbf24", borderRadius:999, padding:"1px 8px" }}>🛡️ Immortale {pBuffs.immortal}t</span>}
                  {pBuffs.crit > 0 && <span style={{ fontSize:"0.68rem", color:"#f87171", background:"rgba(127,29,29,0.25)", border:"1px solid #ef4444", borderRadius:999, padding:"1px 8px" }}>⚔️ Critico {pBuffs.crit}t</span>}
                </div>
              )}

              {/* Azioni base */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10, paddingTop:10, borderTop:"1px solid rgba(148,163,184,0.1)" }}>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  await masterUpdate(p.id, { hp: p.max_hp }, { hp: p.max_hp });
                }}>❤️ Cura tutto</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  const amt = parseInt(window.prompt(`Quanti HP curare a ${p.name}?`, "10"),10);
                  if(!amt||isNaN(amt)) return;
                  const newHp = Math.min(p.max_hp, (p.hp||0)+amt);
                  await masterUpdate(p.id, { hp: newHp }, { hp: newHp });
                }}>💊 Cura parziale</SmallBtn>
                {p?.dead && <SmallBtn disabled={isBusy} onClick={async()=>{
                  await masterUpdate(p.id, { hp:1, dead:false }, { hp:1, dead:false });
                }}>✨ Resurrezione</SmallBtn>}
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  const add = parseInt(window.prompt(`Quanto oro a ${p.name}?`, "50"),10);
                  if(!add||isNaN(add)) return;
                  await masterUpdate(p.id, { gold:(p.gold||0)+add }, { gold:(p.gold||0)+add });
                }}>💰 Dai oro</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  const add = parseInt(window.prompt(`Quanta XP a ${p.name}?`, "50"),10);
                  if(!add||isNaN(add)) return;
                  await masterUpdate(p.id, { xp:(p.xp||0)+add }, { xp:(p.xp||0)+add });
                }}>⭐ Dai XP</SmallBtn>
              </div>

              {/* Poteri divini */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8, paddingTop:8, borderTop:"1px solid rgba(251,191,36,0.15)" }}>
                <SmallBtn disabled={isBusy} onClick={async()=>{
                  await masterUpdate(p.id, { hp: p.max_hp }, { hp: p.max_hp });
                  // Also send a divine message if in party
                  if(p.party_code) await supabase.from("messages").insert({ party_code:p.party_code, author:"Dungeon Master", content:`✨ **Aiuto Divino!** Una luce celestiale avvolge **${p.name}** e lo riporta in piena salute!`, type:"narration" });
                }}>✨ Aiuto Divino</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={()=>masterSetBuff(p,"immortal",10)}>🛡️ Immortale (10t)</SmallBtn>
                <SmallBtn disabled={isBusy} onClick={()=>masterSetBuff(p,"crit",10)}>⚔️ Critici (10t)</SmallBtn>
                <SmallBtn disabled={isBusy} red onClick={async()=>{
                  if(!window.confirm(`Reset completo di ${p.name}?`)) return;
                  await masterUpdate(p.id, { level:1,xp:0,gold:0,hp:baseHp,max_hp:baseHp,atk:baseAtk,def:baseDef,mag:baseMag,dead:false },
                    { level:1,xp:0,gold:0,hp:baseHp,max_hp:baseHp,atk:baseAtk,def:baseDef,mag:baseMag,dead:false });
                }}>🔄 Reset PG</SmallBtn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PartiesView({ authUser }) {
  const [parties, setParties] = useState([]);
  const [partyPlayers, setPartyPlayers] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);
  const [playerMeta, setPlayerMeta] = useState({});
  const [working, setWorking] = useState({});
  const [banTarget, setBanTarget] = useState({});
  const [assignTarget, setAssignTarget] = useState({});
  const [newCode, setNewCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState({});
  const [error, setError] = useState(null);

  const reload = async () => {
    const [{ data, error }, { data: stateRows, error: stateError }, meta] = await Promise.all([
      supabase.from("players").select("id,name,party_code,class,level,hp,max_hp"),
      supabase.from("party_state").select("party_code"),
      dbGetPlayerMasterMeta().catch(() => ({})),
    ]);
    if(error || stateError) {
      setError((error || stateError)?.message || "Impossibile caricare i party");
      return;
    }
    setError(null);
    setAllPlayers(data || []);
    setPlayerMeta(meta || {});
    const codes = Array.from(new Set([
      ...(stateRows || []).map(r=>r.party_code).filter(Boolean),
      ...(data || []).map(r=>r.party_code).filter(Boolean),
    ])).sort();
    setParties(codes);
    const grouped = {};
    for(const p of (data||[])) {
      if(!p.party_code) continue;
      if(!grouped[p.party_code]) grouped[p.party_code] = [];
      grouped[p.party_code].push(p);
    }
    setPartyPlayers(grouped);
  };

  useEffect(()=>{
    let active = true;
    const load = async () => { if(active) await reload(); };
    load();
    const interval = setInterval(load, 5000);
    return ()=>{ active=false; clearInterval(interval); };
  },[]);

  const handleCreateParty = async () => {
    const code = newCode.trim().toUpperCase() || Math.random().toString(36).slice(2,6).toUpperCase();
    if(parties.includes(code)) { alert(`Il party "${code}" esiste gia'!`); return; }
    setCreating(true);
    try {
      await dbSavePartyState(code, { currentId:null, step:0, active:false, completed:[], combat:null });
      setParties(prev=>prev.includes(code) ? prev : [...prev, code].sort());
      setPartyPlayers(prev=>({...prev, [code]: prev[code] || []}));
      setNewCode("");
      await reload();
      alert(`Party "${code}" creato!\nCondividi questo codice con i tuoi giocatori.`);
    } catch(e) {
      alert("Errore creazione party: " + (e?.message || e));
    } finally { setCreating(false); }
  };

  const handleAssignPlayer = async (partyCode) => {
    const pid = assignTarget[partyCode];
    if(!pid) { alert("Seleziona un giocatore."); return; }
    const player = allPlayers.find(p=>p.id===pid);
    if(!player) return;
    setWorking(w=>({...w,[partyCode+"_assign"]:true}));
    try {
      await supabase.from("players").update({ party_code: partyCode, updated_at: new Date().toISOString() }).eq("id", pid);
      if(playerMeta[pid]?.realPlayerName) {
        await dbSavePlayerMasterMeta({
          playerId: pid,
          partyCode,
          heroName: player.name,
          realPlayerName: playerMeta[pid].realPlayerName,
        });
      }
      await reload();
      setAssignTarget(prev=>({...prev,[partyCode]:""}));
      alert(`${player.name} assegnato al party ${partyCode}!\nIl giocatore deve ricaricare la pagina.`);
    } catch(e) {
      alert("Errore assegnazione: " + (e?.message || e));
    } finally { setWorking(w=>({...w,[partyCode+"_assign"]:false})); }
  };

  const handleAction = async (partyCode, action) => {
    setWorking(w=>({ ...w, [partyCode]: action }));
    try {
      if(action === "combat") await resetPartyCombat(partyCode);
      if(action === "campaign") await resetPartyCampaign(partyCode);
      if(action === "delete") { await deleteParty(partyCode); await reload(); }
    } finally { setWorking(w=>({ ...w, [partyCode]: null })); }
  };

  const handleResetStoria = async (partyCode) => {
    if(!window.confirm(`Reset storia completo per party ${partyCode}?\nVerranno cancellati messaggi e stato missione.`)) return;
    setWorking(w=>({...w,[partyCode]:"storia"}));
    try {
      const state = await dbGetPartyState(partyCode);
      await dbSavePartyState(partyCode, {...state, combat:null, currentId:null, step:0, active:false, completed:[]});
      await dbDeleteMessages(partyCode);
    } finally { setWorking(w=>({...w,[partyCode]:null})); }
  };

  const handleTerminaCombattimento = async (partyCode) => {
    if(!window.confirm(`Terminare il combattimento in corso per party ${partyCode}?`)) return;
    setWorking(w=>({...w,[partyCode]:"combat"}));
    try { await resetPartyCombat(partyCode); }
    finally { setWorking(w=>({...w,[partyCode]:null})); }
  };

  const handleBanna = async (partyCode) => {
    const pid = banTarget[partyCode];
    if(!pid) { alert("Seleziona un giocatore da bannare."); return; }
    const player = (partyPlayers[partyCode]||[]).find(p=>p.id===pid);
    if(!window.confirm(`Bannare ${player?.name}? Il giocatore verrà rimosso dal party. Azione irreversibile.`)) return;
    setWorking(w=>({...w,[partyCode]:"ban"}));
    try {
      await supabase.from("players").delete().eq("id", pid);
      await reload();
      setBanTarget(prev=>({...prev,[partyCode]:""}));
    } finally { setWorking(w=>({...w,[partyCode]:null})); }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(()=>{
      setCopied(c=>({...c,[code]:true}));
      setTimeout(()=>setCopied(c=>({...c,[code]:false})), 2000);
    });
  };

  const dangerBtn = { background:"#dc2626", color:"white", fontWeight:"bold", padding:"8px 16px", borderRadius:"6px", margin:"4px", border:"none", cursor:"pointer", fontSize:"0.82rem" };

  return (
    <div>
      {!canAccessMasterPanel(authUser) && (
        <div style={{ background:"rgba(127,29,29,0.78)", border:"1px solid #fca5a5", color:"#fff1f2", borderRadius:6, padding:"0.8rem 1rem", marginBottom:"1rem", fontSize:"0.82rem", lineHeight:1.45 }}>
          Per assegnare player ai party devi accedere con l'account Master autorizzato. Se entri solo con la password, Supabase non mostra i personaggi e il menu resta a 0 disponibili.
        </div>
      )}
      {/* Crea nuovo party */}
      <div style={{ marginBottom:"1.5rem", background:"rgba(99,102,241,0.08)", border:"1px solid #4338ca", borderRadius:8, padding:"1rem" }}>
        <div style={{ fontFamily:"'Cinzel',serif", color:"#a5b4fc", fontSize:"0.9rem", fontWeight:700, marginBottom:"0.75rem" }}>✨ Crea Nuovo Party</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <input
            value={newCode}
            onChange={e=>setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8))}
            placeholder="Codice (es: ALFA) — vuoto = auto"
            style={{ flex:1, minWidth:180, background:"#0f172a", border:"1px solid #4338ca", color:"#e2d9c5", padding:"8px 10px", borderRadius:6, fontSize:"0.85rem", fontFamily:"monospace", letterSpacing:"0.15em" }}
          />
          <SmallBtn disabled={creating} onClick={handleCreateParty}>{creating ? "Creazione..." : "Crea Party"}</SmallBtn>
        </div>
        {allPlayers.filter(p=>!p.party_code).length > 0 && (
          <div style={{ marginTop:8, fontSize:"0.73rem", color:"#94a3b8" }}>
            Giocatori senza party: {allPlayers.filter(p=>!p.party_code).map(p=>p.name).join(", ")}
          </div>
        )}
      </div>

      <p style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>{parties.length} party trovati � aggiornamento automatico</p>
      {error && <div style={{ color:"#fca5a5", marginBottom:"1rem" }}>{error}</div>}
      {!parties.length && <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun party ancora. Creane uno sopra.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:12 }}>
        {parties.map(code=>{
          const members = partyPlayers[code] || [];
          const availablePlayers = allPlayers.filter(p => p.id && p.party_code !== code);
          const playersWithoutParty = availablePlayers.filter(p => !p.party_code);
          const playersFromOtherParties = availablePlayers.filter(p => p.party_code);
          return (
            <div key={code} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:8, padding:"1rem" }}>
              {/* Intestazione */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, fontSize:"1rem" }}>
                  Party: <span style={{ color:"#fbbf24", letterSpacing:"0.18em", fontFamily:"monospace" }}>{code}</span>
                </div>
                <button onClick={()=>copyCode(code)}
                  style={{ background:"rgba(251,191,36,0.1)", border:"1px solid #78350f", color:"#fbbf24", padding:"4px 12px", borderRadius:6, cursor:"pointer", fontSize:"0.72rem", whiteSpace:"nowrap" }}>
                  {copied[code] ? "Copiato!" : "Copia codice"}
                </button>
              </div>

              {/* Lista membri */}
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:"0.68rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Giocatori ({members.length})</div>
                {!members.length && <div style={{ color:"#374151", fontSize:"0.75rem", fontStyle:"italic" }}>Nessun membro ancora</div>}
                {members.map(p=>(
                  <div key={p.id} style={{ display:"flex", gap:6, alignItems:"center", padding:"4px 0", borderBottom:"1px solid #1a2030" }}>
                    <span style={{ fontSize:"0.85rem" }}>{CLASSES[p.class]?.emoji || "⚔️"}</span>
                    <span style={{ flex:1, fontSize:"0.8rem", color:"#d1d5db" }}>
                      {p.name}
                      {playerMeta[p.id]?.realPlayerName && <span style={{ display:"block", color:"#fbbf24", fontSize:"0.68rem", marginTop:2 }}>Giocatore: {playerMeta[p.id].realPlayerName}</span>}
                    </span>
                    <span style={{ fontSize:"0.68rem", color:"#64748b" }}>Lv.{p.level||1}</span>
                    <span style={{ fontSize:"0.68rem", color:(p.hp||0)/(p.max_hp||1)>0.5?"#4ade80":"#fca5a5" }}>{p.hp||0}/{p.max_hp||0} HP</span>
                  </div>
                ))}
              </div>

              {/* Aggiungi/sposta giocatore */}
              <div style={{ marginBottom:12, background:"rgba(30,41,59,0.92)", border:"1px solid #f59e0b", borderRadius:6, padding:"0.8rem", boxShadow:"0 10px 22px rgba(0,0,0,0.22)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.78rem", color:"#fef3c7", fontWeight:700, letterSpacing:"0.05em" }}>Aggiungi giocatore a questo party</div>
                  <span style={{ color:"#cbd5e1", fontSize:"0.68rem" }}>{availablePlayers.length} disponibili</span>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <select value={assignTarget[code]||""} onChange={e=>setAssignTarget(prev=>({...prev,[code]:e.target.value}))}
                    disabled={!availablePlayers.length}
                    style={{ flex:"1 1 220px", background:"#020617", border:"1px solid #94a3b8", color:"#f8fafc", padding:"8px 10px", borderRadius:4, fontSize:"0.82rem" }}>
                    <option value="">Seleziona giocatore...</option>
                    {playersWithoutParty.length > 0 && (
                      <optgroup label="Senza party">
                        {playersWithoutParty.map(p=>(
                          <option key={p.id} value={p.id}>{p.name}{playerMeta[p.id]?.realPlayerName ? ` - ${playerMeta[p.id].realPlayerName}` : ""} ({CLASSES[p.class]?.name||p.class})</option>
                        ))}
                      </optgroup>
                    )}
                    {playersFromOtherParties.length > 0 && (
                      <optgroup label="Da altri party">
                        {playersFromOtherParties.map(p=>(
                          <option key={p.id} value={p.id}>{p.name}{playerMeta[p.id]?.realPlayerName ? ` - ${playerMeta[p.id].realPlayerName}` : ""} [{p.party_code}]</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <SmallBtn disabled={!!working[code+"_assign"]} onClick={()=>handleAssignPlayer(code)}>
                    {working[code+"_assign"] ? "Sposto..." : "Aggiungi al party"}
                  </SmallBtn>
                </div>
                {!availablePlayers.length && <div style={{ color:"#94a3b8", fontSize:"0.72rem", marginTop:8 }}>Nessun altro giocatore disponibile da assegnare a questo party.</div>}
              </div>

              {/* Azioni */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                <SmallBtn disabled={!!working[code]} onClick={()=>handleAction(code, "combat")}>Reset Combattimento</SmallBtn>
                <SmallBtn disabled={!!working[code]} onClick={()=>{ if(window.confirm("Resetta chat e stato combattimento?")) handleAction(code, "campaign"); }}>Reset Campagna</SmallBtn>
                <SmallBtn red disabled={!!working[code]} onClick={()=>{ if(window.confirm("Eliminare completamente questo party?")) handleAction(code, "delete"); }}>Elimina</SmallBtn>
              </div>
              {working[code] && <div style={{ marginTop:4, color:"#a78bfa", fontSize:"0.78rem" }}>In corso: {working[code]}...</div>}

              {/* Zona pericolosa */}
              <div style={{ marginTop:8, background:"#1a0000", border:"1px solid #dc2626", borderRadius:6, padding:"0.8rem" }}>
                <div style={{ color:"#dc2626", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", fontWeight:700, marginBottom:8, letterSpacing:"0.05em" }}>Azioni Pericolose</div>
                <div style={{ display:"flex", flexWrap:"wrap" }}>
                  <button disabled={!!working[code]} onClick={()=>handleResetStoria(code)} style={dangerBtn}>Reset Storia</button>
                  <button disabled={!!working[code]} onClick={()=>handleTerminaCombattimento(code)} style={dangerBtn}>Termina Combattimento</button>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:6 }}>
                  <select value={banTarget[code]||""} onChange={e=>setBanTarget(prev=>({...prev,[code]:e.target.value}))}
                    style={{ flex:1, background:"#0a0000", border:"1px solid #7f1d1d", color:"#e2d9c5", padding:"6px 8px", borderRadius:4, fontSize:"0.78rem" }}>
                    <option value="">Banna giocatore...</option>
                    {members.map(p=>(
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button disabled={!!working[code]} onClick={()=>handleBanna(code)} style={dangerBtn}>Banna</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let active = true;
    const load = async () => {
      setLoading(true);
      const { data, error: playersErr } = await supabase.from("players").select("id,name,party_code");
      if(!active) return;
      if(playersErr) {
        setError(playersErr.message || "Impossibile caricare gli iscritti");
        setUsers([]);
      } else {
        setError(null);
        setUsers((data||[]).map(p=>({ id:p.id, email:p.name, party_code:p.party_code })));
      }
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 5000);
    return ()=>{ active = false; clearInterval(interval); };
  },[]);

  return (
    <div>
      <div style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>Elenco dei profili giocatore registrati nel database pubblico.</div>
      {error && <div style={{ color:"#fca5a5", marginBottom:"1rem" }}>{error}</div>}
      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}
      {!loading && !users.length && <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun iscritto trovato.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {users.map(u=>(
          <div key={u.id} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #1f2937", borderRadius:6, padding:"0.8rem" }}>
            <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{u.email||u.id}</div>
            {u.party_code && <div style={{ fontSize:"0.75rem", color:"#94a3b8" }}>Party: {u.party_code}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketView() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    const load = async () => { setLoading(true); setItems(await dbGetItems()); setLoading(false); };
    load();
  },[]);

  const save = async (item) => {
    await dbSaveItem(item);
    setSaved(true);
    setTimeout(()=>setSaved(false),2200);
    setEditItem(null);
    setItems(await dbGetItems());
  };

  const remove = async (itemId) => {
    if(!window.confirm("Eliminare questo oggetto dal catalogo?")) return;
    await dbDeleteItem(itemId);
    setItems(prev=>prev.filter(i=>i.id!==itemId));
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <div>
          <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, color:"#e2d9c5" }}>🏪 Market</div>
          <div style={{ fontSize:"0.85rem", color:"#94a3b8" }}>{items.length} oggetti</div>
        </div>
        <BigBtn onClick={()=>setEditItem({id:`i_${Date.now()}`,name:"",emoji:"",type:"weapon",description:"",bonus_atk:0,bonus_def:0,bonus_mag:0,bonus_hp:0,price:100,available:true})} gold icon="?">+ Nuovo</BigBtn>
      </div>

      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}

      {editItem && (
        <Card title={editItem.id?"Modifica Oggetto":"Nuovo Oggetto"}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div><label style={labelStyle}>Nome</label><input style={inputStyle} value={editItem.name} onChange={e=>setEditItem(i=>({...i,name:e.target.value}))} /></div>
            <div><label style={labelStyle}>Emoji</label><input style={inputStyle} value={editItem.emoji} onChange={e=>setEditItem(i=>({...i,emoji:e.target.value}))} /></div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select style={{...inputStyle,cursor:"pointer"}} value={editItem.type} onChange={e=>setEditItem(i=>({...i,type:e.target.value}))}>
                <option value="weapon">Arma</option>
                <option value="armor">Armatura</option>
                <option value="accessory">Accessorio</option>
              </select>
            </div>
            <div><label style={labelStyle}>Prezzo</label><input style={inputStyle} type="number" value={editItem.price} onChange={e=>setEditItem(i=>({...i,price:+e.target.value}))} /></div>
          </div>
          <label style={{...labelStyle,marginTop:10}}>Descrizione</label>
          <textarea style={{...inputStyle,height:70,resize:"vertical"}} value={editItem.description} onChange={e=>setEditItem(i=>({...i,description:e.target.value}))} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginTop:10 }}>
            <div><label style={labelStyle}>Bonus ATK</label><input style={inputStyle} type="number" value={editItem.bonus_atk} onChange={e=>setEditItem(i=>({...i,bonus_atk:+e.target.value}))} /></div>
            <div><label style={labelStyle}>Bonus DEF</label><input style={inputStyle} type="number" value={editItem.bonus_def} onChange={e=>setEditItem(i=>({...i,bonus_def:+e.target.value}))} /></div>
            <div><label style={labelStyle}>Bonus MAG</label><input style={inputStyle} type="number" value={editItem.bonus_mag} onChange={e=>setEditItem(i=>({...i,bonus_mag:+e.target.value}))} /></div>
            <div><label style={labelStyle}>Bonus HP</label><input style={inputStyle} type="number" value={editItem.bonus_hp} onChange={e=>setEditItem(i=>({...i,bonus_hp:+e.target.value}))} /></div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:12 }}>
            <BigBtn onClick={()=>save(editItem)} gold icon="⭐">Salva</BigBtn>
            <SmallBtn onClick={()=>setEditItem(null)}>Annulla</SmallBtn>
          </div>
        </Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:10 }}>
        {items.map(it=>(
          <div key={it.id} style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:6, padding:"0.8rem" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:"1.5rem" }}>{it.emoji||"⭐"}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{it.name}</div>
                <div style={{ fontSize:"0.72rem", color:"#94a3b8" }}>{it.type}</div>
              </div>
              <SmallBtn onClick={()=>setEditItem(it)}>✏️</SmallBtn>
              <SmallBtn red onClick={()=>remove(it.id)}>🗑️</SmallBtn>
            </div>
            <div style={{ fontSize:"0.75rem", color:"#94a3b8", marginBottom:6 }}>{it.description}</div>
            <div style={{ display:"flex", gap:8, fontSize:"0.72rem", color:"#94a3b8" }}>
              <span>⚔️+{it.bonus_atk||0}</span><span>🛡️+{it.bonus_def||0}</span><span>✨+{it.bonus_mag||0}</span><span>❤️+{it.bonus_hp||0}</span>
            </div>
            <div style={{ marginTop:8, fontSize:"0.75rem", color:"#c4b5fd" }}>💰 {it.price} oro</div>
          </div>
        ))}
      </div>
      {saved && <div style={{ position:"fixed", bottom:16, right:16, padding:"0.8rem 1rem", background:"rgba(52,211,153,0.15)", border:"1px solid #065f46", borderRadius:6, color:"#065f46" }}>Salvataggio completato!</div>}
    </div>
  );
}

function generateShopInventory(items) {
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const pick = (pool, n) => shuffle(pool).slice(0, Math.min(n, pool.length));
  return [
    ...pick(items.filter(i => i.rarity === "common"), 5),
    ...pick(items.filter(i => i.rarity === "uncommon"), 3),
    ...pick(items.filter(i => i.rarity === "rare" || i.rarity === "epic"), 1),
    ...pick(items.filter(i => i.rarity === "legendary"), 1),
  ];
}

function ShopView({ me, items, loading, error, inventoryCounts, onBuy }) {
  const [shopItems] = useState(() => items.length ? generateShopInventory(items) : []);

  const RARITY_COLOR = { common:"#9ca3af", uncommon:"#34d399", rare:"#60a5fa", epic:"#a78bfa", legendary:"#fbbf24" };

  return (
    <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginBottom:"1.2rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0, fontSize:"1.1rem" }}>🛒 Negozio — offerta del giorno</h3>
        <div style={{ padding:"0.6rem 1.4rem", background:"linear-gradient(135deg,rgba(180,83,9,0.3),rgba(180,83,9,0.1))", border:"3px solid #fbbf24", borderRadius:12, color:"#fbbf24", fontSize:"2.5rem", fontWeight:900, whiteSpace:"nowrap", textShadow:"0 2px 10px rgba(251,191,36,0.4)", lineHeight:1, display:"flex", alignItems:"center", gap:"0.8rem", boxShadow:"0 0 25px rgba(180,83,9,0.2)" }}>
          <span style={{ fontSize:"3rem" }}>💰</span> {me?.gold || 0}
        </div>
      </div>
      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}
      {error && <div style={{ color:"#fca5a5" }}>{error}</div>}
      {!loading && !shopItems.length && <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Nessun oggetto disponibile.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {shopItems.map(it => {
          const canAfford = me && me.gold >= (it.price || 0);
          const owned = inventoryCounts?.[it.id] || 0;
          const rarityColor = RARITY_COLOR[it.rarity] || "#9ca3af";
          return (
            <div key={it.id} style={{ background:"rgba(15,23,42,0.7)", border:`1px solid ${rarityColor}44`, borderRadius:12, padding:"1.2rem", display:"flex", flexDirection:"column", gap:"0.8rem", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <ArtThumb src={getItemImage(it)} alt={it.name} size={72} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700, fontSize:"1rem", lineHeight:1.3 }}>{it.name}</div>
                  <div style={{ fontSize:"0.78rem", color:"#94a3b8", marginTop:2 }}>{itemTypeLabel(it.type)}</div>
                  <div style={{ fontSize:"0.74rem", color:rarityColor, fontWeight:600, marginTop:2, textTransform:"capitalize" }}>{itemRarityLabel(it.rarity)}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:"1.3rem", color:"#fbbf24", fontWeight:900, lineHeight:1 }}>💰 {it.price}</div>
                  {owned > 0 && <div style={{ fontSize:"0.7rem", color:"#6ee7b7", marginTop:4 }}>Hai: {owned}</div>}
                </div>
              </div>
              <div style={{ fontSize:"0.85rem", color:"#94a3b8", lineHeight:1.55 }}>{it.description}</div>
              {itemStatSummary(it).length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {itemStatSummary(it).map(stat => (
                    <span key={stat} style={{ fontSize:"0.75rem", color:"#c4b5fd", background:"rgba(109,40,217,0.15)", border:"1px solid rgba(109,40,217,0.3)", borderRadius:999, padding:"2px 8px" }}>{stat}</span>
                  ))}
                </div>
              )}
              <button
                onClick={() => onBuy(it)}
                disabled={!canAfford}
                style={{ width:"100%", padding:"0.75rem", background:canAfford?"linear-gradient(135deg,#92400e,#d97706)":"rgba(255,255,255,0.04)", border:`1px solid ${canAfford?"#f59e0b":"#1f2937"}`, borderRadius:8, color:canAfford?"#fef3c7":"#4b5563", fontFamily:"'Cinzel',serif", fontSize:"0.9rem", cursor:canAfford?"pointer":"not-allowed", letterSpacing:"0.06em", fontWeight:700 }}>
                {canAfford ? `⭐ Compra` : `💰 ${it.price} (non abbastanza oro)`}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function InventoryView({ loading, groups, equipment, selectedItem, onSelectItem, onCloseItem, onEquip, onSell, onUse, canUseConsumables }) {
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🎒 Inventario</h3>
      {loading && <div style={{ color:"#94a3b8" }}>Caricamento...</div>}
      {!loading && !groups.length && <div style={{ color:"#64748b", textAlign:"center", padding:"3rem", border:"1px dashed #1f2937", borderRadius:6 }}>Inventario vuoto. Saccheggia o compra qualcosa.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:10 }}>
        {groups.map(group=>{
          const slot = itemSlot(group.item);
          const equipped = !!slot && equipment?.[slot] === group.item.id;
          const selected = selectedItem?.item?.id === group.item.id;
          return (
            <button
              key={group.item.id}
              onClick={()=>onSelectItem(group)}
              style={{
                textAlign:"left",
                background:PANEL_BG,
                border:`1px solid ${selected ? "#7c3aed" : equipped ? "#b45309" : PANEL_BORDER}`,
                borderRadius:6,
                padding:"0.8rem",
                cursor:"pointer",
                color:"inherit",
                font:"inherit",
                boxShadow:selected ? "0 0 0 1px rgba(124,58,237,0.35) inset" : "none",
              }}
            >
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                <ArtThumb src={getItemImage(group.item)} alt={group.item.name} size={62} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#e2d9c5", fontWeight:700 }}>{group.item.name}</div>
                  <div style={{ fontSize:"0.72rem", color:"#94a3b8" }}>{itemTypeLabel(group.item.type)} • {itemRarityLabel(group.item.rarity)}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span style={{ fontSize:"0.78rem", color:"#c4b5fd", fontWeight:700 }}>x{group.quantity}</span>
                  {equipped && <span style={{ fontSize:"0.66rem", color:"#fbbf24" }}>Equip.</span>}
                </div>
              </div>
              <div style={{ fontSize:"0.75rem", color:"#94a3b8", marginBottom:6 }}>{group.item.description}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#94a3b8", marginBottom:10 }}>
                {itemStatSummary(group.item).map(stat => <span key={stat}>{stat}</span>)}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#9ca3af" }}>
                <span>Quantità: {group.quantity}</span>
                <span>Valore: {group.item.price || 0} oro</span>
                <span style={{ color:"#94a3b8" }}>Clicca per ispezionare</span>
              </div>
            </button>
          );
        })}
      </div>
      {!!selectedItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(2,6,23,0.78)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", zIndex:50 }} onClick={onCloseItem}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"min(560px,100%)", background:"linear-gradient(180deg, rgba(17,24,39,0.98), rgba(10,10,18,0.98))", border:"1px solid #312e81", borderRadius:10, boxShadow:"0 24px 80px rgba(0,0,0,0.45)", padding:"1rem" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
              <ArtThumb src={getItemImage(selectedItem.item)} alt={selectedItem.item.name} size={92} radius={16} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Cinzel',serif", color:"#f8e7b9", fontSize:"1.15rem", fontWeight:700 }}>{selectedItem.item.name}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6, fontSize:"0.75rem" }}>
                  <span style={{ color:"#9ca3af" }}>{itemTypeLabel(selectedItem.item.type)}</span>
                  <span style={{ color:"#c4b5fd" }}>{itemRarityLabel(selectedItem.item.rarity)}</span>
                  <span style={{ color:"#6ee7b7" }}>Quantità: {selectedItem.quantity}</span>
                  {!!itemSlot(selectedItem.item) && equipment?.[itemSlot(selectedItem.item)] === selectedItem.item.id && <span style={{ color:"#fbbf24" }}>Equipaggiato</span>}
                </div>
              </div>
            </div>
            <div style={{ color:"#cbd5e1", fontSize:"0.92rem", lineHeight:1.6, marginBottom:12 }}>
              {selectedItem.item.description}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
              {itemStatSummary(selectedItem.item).map(stat => (
                <span key={stat} style={{ fontSize:"0.76rem", color:"#d1d5db", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:999, padding:"4px 8px" }}>
                  {stat}
                </span>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, color:"#9ca3af", fontSize:"0.82rem" }}>
              <span>💰 Valore: {selectedItem.item.price || 0} oro</span>
              <span>Copie possedute: {selectedItem.quantity}</span>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
              {isEquippableItem(selectedItem.item) && (
                <BigBtn
                  onClick={()=>onEquip(selectedItem.entries[0])}
                  gold
                  disabled={equipment?.[itemSlot(selectedItem.item)] === selectedItem.item.id}
                >
                  Equipaggia
                </BigBtn>
              )}
              {selectedItem.item.type === "potion" && canUseConsumables && (
                <BigBtn onClick={()=>onUse(selectedItem.entries[0])} gold icon="🧪">
                  Usa
                </BigBtn>
              )}
              <SmallBtn onClick={()=>onSell(selectedItem)}>Vendi</SmallBtn>
              <SmallBtn onClick={onCloseItem}>Chiudi</SmallBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EquipmentView({ me, equippedItems, equippedWeapon, onUnequip }) {
  const slots = [
    { key:"weapon", label:"Arma", fallback:"Nessuna arma equipaggiata" },
    { key:"armor", label:"Armatura", fallback:"Nessuna armatura equipaggiata" },
    { key:"shield", label:"Scudo", fallback:"Nessuno scudo equipaggiato" },
  ];
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>🎽 Equipaggiamento</h3>
      <Card title="Statistiche Attive">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:8, color:"#e2d9c5" }}>
          <div>⚔️ ATK: {me.atk}</div>
          <div>🛡️ CA: {me.def}</div>
          <div>✨ MAG: {me.mag}</div>
          <div>🦶 DEX: {me.init}</div>
          <div>❤️ HP Max: {me.maxHp}</div>
          <div>🎲 Arma: {equippedWeapon.weapon_die}</div>
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:10 }}>
        {slots.map(slot=>{
          const item = equippedItems[slot.key];
          return (
            <div key={slot.key} style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:6, padding:"0.8rem" }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:8 }}>{slot.label}</div>
              {item ? (
                <>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontSize:"1.6rem" }}>{item.emoji}</span>
                    <div>
                      <div style={{ color:"#e2d9c5", fontWeight:700 }}>{item.name}</div>
                      <div style={{ fontSize:"0.72rem", color:"#94a3b8" }}>{itemRarityLabel(item.rarity)} • {itemTypeLabel(item.type)}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", fontSize:"0.72rem", color:"#94a3b8", marginBottom:10 }}>
                    {itemStatSummary(item).map(stat => <span key={stat}>{stat}</span>)}
                  </div>
                  <SmallBtn red onClick={()=>onUnequip(slot.key)}>Rimuovi</SmallBtn>
                </>
              ) : (
                <div style={{ color:"#94a3b8", fontSize:"0.82rem" }}>{slot.fallback}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpellbookView({ spellsByLevel, preparedSpellIds, preparedCount, maxPrepared, onTogglePrepared }) {
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginBottom:"1rem", flexWrap:"wrap" }}>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", margin:0 }}>✨ Magie</h3>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Scegli quali incantesimi preparare per oggi. I trucchetti restano sempre disponibili.</span>
          <span style={{ fontSize:"0.78rem", color:"#ddd6fe", background:"rgba(124,58,237,0.2)", border:"1px solid #7c3aed", borderRadius:999, padding:"4px 10px" }}>
            Preparati: {preparedCount}/{maxPrepared}
          </span>
        </div>
      </div>
      <div style={{ display:"grid", gap:"1rem" }}>
        {Object.keys(spellsByLevel).map(levelKey => {
          const level = Number(levelKey);
          const spells = spellsByLevel[level] || [];
          if(!spells.length) return null;
          return (
            <Card key={level} title={level===0 ? "✨ Trucchetti" : `🔮 Livello ${level}`}>
              <div style={{ display:"grid", gap:10 }}>
                {spells.map(spell => {
                  const prepared = level === 0 || preparedSpellIds.includes(spell.id);
                  return (
                    <div key={spell.id} style={{ background:"rgba(15,23,42,0.72)", border:`1px solid ${prepared ? "#7c3aed" : "#334155"}`, borderRadius:10, padding:"0.95rem 1rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"flex-start", marginBottom:6, flexWrap:"wrap" }}>
                        <div>
                          <div style={{ color:"#f8fafc", fontWeight:700, fontSize:"0.96rem" }}>{spell.emoji || "✨"} {spell.name}</div>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:4 }}>
                            {spellEffectSummary(spell).map(detail => (
                              <span key={detail} style={{ fontSize:"0.72rem", color:"#cbd5e1", background:"rgba(255,255,255,0.04)", border:"1px solid #334155", borderRadius:999, padding:"3px 8px" }}>
                                {detail}
                              </span>
                            ))}
                          </div>
                        </div>
                        {level === 0 ? (
                          <span style={{ fontSize:"0.74rem", color:"#6ee7b7", fontWeight:700 }}>Sempre pronto</span>
                        ) : (
                          <button
                            onClick={()=>onTogglePrepared(spell.id)}
                            style={{ padding:"0.45rem 0.8rem", background:prepared?"rgba(124,58,237,0.24)":"rgba(255,255,255,0.04)", border:`1px solid ${prepared ? "#7c3aed" : "#334155"}`, borderRadius:8, color:prepared?"#ddd6fe":"#cbd5e1", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.74rem" }}
                          >
                            {prepared ? "Preparato" : "Prepara"}
                          </button>
                        )}
                      </div>
                      <div style={{ color:"#cbd5e1", fontSize:"0.84rem", lineHeight:1.6 }}>{spell.desc}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------
   GAME SCREEN
---------------------------------------------- */

/* ----------------------------------------------
   GAME SCREEN
---------------------------------------------- */
function GameScreen({ myId, setScreen }) {
  const [me, setMeRaw] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partyPlayers, setPartyPlayers] = useState([]);
  const [qs, setQs] = useState({ currentId:null, step:0, active:false, completed:[], combat:null });
  const [input, setInput] = useState("");
  const [diceAnim, setDiceAnim] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [spellMenu, setSpellMenu] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [tab, setTab] = useState("quest");
  const [victoryScreen, setVictoryScreen] = useState(null);
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lootedStepKey, setLootedStepKey] = useState(null);
  const [catalogItems, setCatalogItems] = useState(DEFAULT_ITEMS);
  const [inventory, setInventory] = useState([]);
  const [equipment, setEquipment] = useState({ weapon:null, armor:null, shield:null, accessory:null });
  const [preparedSpellIds, setPreparedSpellIds] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState(null);
  const [specialPasswordInput, setSpecialPasswordInput] = useState("");
  const [specialQuestError, setSpecialQuestError] = useState("");
  const [unlockedSpecialQuestIds, setUnlockedSpecialQuestIds] = useState([]);
  const [deathScene, setDeathScene] = useState(null);
  const msgEnd = useRef(null);
  const combatLogEndRef = useRef(null);
  const inputRef = useRef(null);
  const subRef = useRef(null);
  const itemMapRef = useRef(DEFAULT_ITEM_MAP);
  const startCombatStepRef = useRef(null);
  const monsterTickBusyRef = useRef(false);
  const doMonsterTurnRef = useRef(null);
  const advanceTurnBusyRef = useRef(false);

    const diceRef = useRef(null);

  async function showDiceVisual({ sides, notation, label, themeColor="#ef4444" }) {
    if (diceRef.current) {
      setDiceResult({ stage:"rolling", label, value:null });
      const total = await diceRef.current.roll(notation || `1d${sides}`, themeColor);
      setDiceResult({ stage:"result", label, value: total });
      await new Promise(r => setTimeout(r, 1200));
      setDiceResult(null);
      return total !== null ? total : parseDice(notation || `1d${sides}`);
    } else {
      const val = parseDice(notation || `1d${sides}`);
      setDiceResult({ stage:"rolling", sides, value:null, label });
      setDiceAnim(true);
      await new Promise(resolve => setTimeout(resolve, 450));
      setDiceResult({ stage:"result", sides, value: val, label });
      setDiceAnim(false);
      await new Promise(resolve => setTimeout(resolve, 850));
      setDiceResult(null);
      return val;
    }
  }

  async function performAsyncAttack(attacker, target, weaponDie) {
    const themeColor = attacker.isPlayer ? "#3b82f6" : "#ef4444";
    const hitRoll = await showDiceVisual({ sides:20, notation:"1d20", label:"Tiro per colpire", themeColor });
    
    const attackBonus = getCombatAttackBonus(attacker);
    const attackTotal = hitRoll + attackBonus;
    const targetCa = Math.max(8, target?.def || 10);
    const isCrit = hitRoll === 20;
    const hit = isCrit || attackTotal >= targetCa;
    
    let damageRoll = 0;
    if (hit) {
      damageRoll = await showDiceVisual({ sides:getPrimaryDieSides(weaponDie,6), notation:weaponDie||"1d6", label:`Danno ${weaponDie||"1d6"}`, themeColor });
    }
    
    const damage = hit ? damageRoll + (isCrit ? damageRoll : 0) : 0;
    return { hitRoll, isCrit, attackBonus, attackTotal, targetCa, hit, damageRoll, damage, weaponDie: weaponDie || "1d6" };
  }
  async function triggerSoloDeath(finalName) {
    setDeathScene({ name: finalName || me?.name || "Eroe caduto" });
    try {
      const fallenPlayer = { ...me, hp:0, dead:true };
      await dbSavePlayer(fallenPlayer);
      setMeRaw(fallenPlayer);
      if(code) {
        await dbSavePartyState(code, { ...qs, combat:null });
        setQs(prev => ({ ...prev, combat:null }));
      }
    } catch(e) {
      console.error("Errore durante la morte definitiva:", e);
    }
    localStorage.removeItem("eoz_myId");
    setTimeout(()=>setScreen("landing"), 3200);
  }

  const code = me?.partyCode;
  itemMapRef.current = new Map(catalogItems.map(item => [item.id, item]));
  const itemMap = itemMapRef.current;

  useEffect(() => {
    if(!code) {
      setUnlockedSpecialQuestIds([]);
      return;
    }
    setUnlockedSpecialQuestIds(lsGet(`eoz_special_unlocked_${code}`, []));
  }, [code]);

  function unlockSpecialQuest() {
    const password = specialPasswordInput.trim();
    if(!password) return;
    const match = getQuests().find(q => q.active && q.specialPassword && q.specialPassword.toLowerCase() === password.toLowerCase());
    if(!match) {
      setSpecialQuestError("Password non valida o missione non attiva.");
      return;
    }
    setUnlockedSpecialQuestIds(prev => {
      const next = prev.includes(match.id) ? prev : [...prev, match.id];
      if(code) lsSet(`eoz_special_unlocked_${code}`, next);
      return next;
    });
    setSpecialPasswordInput("");
    setSpecialQuestError(`Missione sbloccata: ${match.title}`);
  }

  const refreshAll = useCallback(async (partyCode) => {
    if(!partyCode) return;
    try {
      const [msgs, players, state] = await Promise.all([
        dbGetMessages(partyCode),
        dbGetPlayers(partyCode),
        dbGetPartyState(partyCode),
      ]);
      setMessages(msgs);
      setPartyPlayers(players);
      setQs({ currentId:null, step:0, active:false, completed:[], combat:null, ...state });
      const freshMe = players.find(p=>p.id===myId);
      if(freshMe) setMeRaw(freshMe);
    } catch(e) {
      console.error("Errore refreshAll:", e);
    }
  }, [myId]);

  useEffect(() => {
    if (qs?.combat?.active) {
      audioManager.playBGM("combat");
    } else if (tab === "shop") {
      audioManager.playBGM("town");
    } else if (tab === "chat") {
      audioManager.playBGM("tavern");
    } else if (spellMenu) {
      audioManager.playBGM("magic");
    } else {
      audioManager.playBGM("intro");
    }
  }, [qs?.combat?.active, tab, spellMenu]);

  const refreshInventory = useCallback(async (playerOverride=null) => {
    if(!myId) return;
    setInventoryLoading(true);
    try {
      const items = await dbGetItems();
      const { entries } = await dbGetPlayerInventory(myId, items);
      const nextEquipment = getStoredEquipment(myId);
      const ownedIds = new Set(entries.map(entry => entry.itemId));
      const sanitizedEquipment = {
        weapon: ownedIds.has(nextEquipment.weapon) ? nextEquipment.weapon : null,
        armor: ownedIds.has(nextEquipment.armor) ? nextEquipment.armor : null,
        shield: ownedIds.has(nextEquipment.shield) ? nextEquipment.shield : null,
      };
      saveStoredEquipment(myId, sanitizedEquipment);
      setCatalogItems(items);
      setInventory(entries);
      setEquipment(sanitizedEquipment);

      const sourcePlayer = playerOverride;
      if(sourcePlayer) {
        const synced = applyEquipmentToPlayer(sourcePlayer, sanitizedEquipment, new Map(items.map(item => [item.id, item])));
        const hpChanged = (sourcePlayer.hp || 0) > synced.maxHp;
        const statsChanged = ["atk","def","mag","init","maxHp"].some(key => (sourcePlayer[key] || 0) !== (synced[key] || 0));
        if(hpChanged || statsChanged) {
          await dbSavePlayer(synced);
          if(sourcePlayer.id === myId) setMeRaw(synced);
        }
      }
    } catch(e) {
      console.error("Errore caricamento inventario:", e);
    } finally {
      setInventoryLoading(false);
    }
  }, [myId]);

  useEffect(()=>{
    async function init() {
      debugCharacterFlow("game_load_start", { myId });
      if(!myId) {
        debugCharacterFlow("game_load_failure", { reason: "missing_myId" });
        setScreen("landing");
        return;
      }
      try {
        const { data, error } = await supabase.from("players").select("*").eq("id", myId).single();
        debugCharacterFlow("game_load_fetch_result", {
          requestedId: myId,
          found: !!data,
          error: error?.message || null,
          player: data ? { id:data.id, party_code:data.party_code, class:data.class, dead:data.dead } : null,
        });
        if(error) throw error;
        if(!data) {
          debugCharacterFlow("game_load_failure", { reason: "player_not_found_after_screen_enter", requestedId: myId });
          setScreen("landing");
          return;
        }
        const p = { id:data.id, name:data.name, partyCode:data.party_code, class:data.class, race:data.race, hp:data.hp, maxHp:data.max_hp, atk:data.atk, def:data.def, mag:data.mag, init:data.init, xp:data.xp, level:data.level, gold:data.gold };
        setMeRaw(p);
        await refreshAll(p.partyCode);
        await refreshInventory(p);
        // Realtime subscription
        subRef.current = supabase.channel("party_"+p.partyCode)
          .on("postgres_changes", { event:"INSERT", schema:"public", table:"messages", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
          .on("postgres_changes", { event:"*", schema:"public", table:"players", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
          .on("postgres_changes", { event:"*", schema:"public", table:"party_state", filter:`party_code=eq.${p.partyCode}` },
            () => refreshAll(p.partyCode))
          .subscribe();
      } catch(e) {
        debugCharacterFlow("game_load_failure", { requestedId: myId, error: e?.message || String(e) });
        console.error("Errore inizializzazione game:", e);
        alert(`GameScreen load fallito.\n\nPlayer ID: ${myId}\nMotivo: ${e?.message || "errore sconosciuto"}`);
        setScreen("landing");
      }
    }
    init();
    return ()=>{ if(subRef.current) supabase.removeChannel(subRef.current); };
  },[myId, refreshAll, refreshInventory, setScreen]);

  useEffect(()=>{ msgEnd.current?.scrollIntoView({behavior:"smooth"}); },[messages]);
  useEffect(()=>{ combatLogEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  // Fallback poll — keeps the log alive if Supabase realtime silently drops
  useEffect(() => {
    const code = me?.partyCode;
    if (!code) return;
    const id = setInterval(() => refreshAll(code), 15000);
    return () => clearInterval(id);
  }, [me?.partyCode, refreshAll]);

  useEffect(() => {
    const stepData = qs?.active ? normalizeQuestStep(getQuests().find(q=>q.id===qs.currentId)?.steps?.[qs.step]) : null;
    if(!stepData || !isCombatStep(stepData)) return;
    if(qs?.combat?.active || qs?.combat?.won) return;
    startCombatStepRef.current?.(stepData);
  }, [qs?.active, qs?.currentId, qs?.step, qs?.combat?.active, qs?.combat?.won]);

  // Auto-attack when it's a monster's turn.
  // Extracted monster attack logic — called by button (leader) and by fallback timer.
  // Only the first alive player in initiative order executes to prevent race conditions.
  async function doMonsterTurn() {
    if (monsterTickBusyRef.current) return;
    const latestQs = await dbGetPartyState(code);
    const latestCombat = latestQs?.combat;
    if (!latestCombat?.active) return;
    if (latestCombat.pendingLog) return;
    const latestCombatants = [...latestCombat.combatants];
    const actor = latestCombatants[latestCombat.turn % latestCombatants.length];
    if (!actor || actor.isPlayer || actor.hp <= 0) {
      // Dead or skipped slot — advance turn without attacking
      const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
      const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound };
      await dbSavePartyState(code, { ...latestQs, combat: newCombat });
      setQs(prev => ({ ...prev, combat: newCombat }));
      return;
    }
    monsterTickBusyRef.current = true;
    try {
      const latestPlayers = await dbGetPlayers(code);
      const alivePlayers = latestPlayers.filter(p => (p?.hp || 0) > 0);
      if (!alivePlayers.length) {
        if(!hasActionablePlayerCombatants(latestCombatants)) {
          await resolveCombatNoActionablePlayers(latestQs, latestCombatants);
          return;
        }
        const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
        const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound };
        await dbSavePartyState(code, { ...latestQs, combat: newCombat });
        setQs(prev => ({ ...prev, combat: newCombat }));
        return;
      }
      const pt = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const weaponDie = getCombatDamageDie(actor);
      const resolved = await performAsyncAttack(actor, pt, weaponDie);
      const edmg = resolved.damage;
      const ptBuffs = (latestQs.masterBuffs || {})[pt.id] || {};
      let monsterNewMasterBuffs = latestQs.masterBuffs || {};
      let effectiveHp = Math.max(0, pt.hp - edmg);
      if(ptBuffs.immortal > 0 && effectiveHp <= 0) {
        effectiveHp = 1;
        monsterNewMasterBuffs = { ...monsterNewMasterBuffs, [pt.id]: { ...ptBuffs, immortal: ptBuffs.immortal - 1 } };
      }
      const updPt = { ...pt, hp: effectiveHp };
      const playerCombatantIdx = latestCombatants.findIndex(c => c.id === pt.id);
      if(playerCombatantIdx >= 0) {
        latestCombatants[playerCombatantIdx] = applyCombatDamageState({
          ...latestCombatants[playerCombatantIdx],
          maxHp: updPt.maxHp,
        }, edmg);
        if(effectiveHp > 0) latestCombatants[playerCombatantIdx].hp = effectiveHp;
      }
      await dbSavePlayer(updPt);
      if (updPt.id === myId) setMeRaw(updPt);
      const immortalNote = ptBuffs.immortal > 0 && effectiveHp === 1 ? `\n🛡️ **${pt.name}** è protetto dall'Immortalità! (${ptBuffs.immortal - 1} turni rimasti)` : "";
      const log = formatWeaponAttackLog(actor, pt, resolved, "Attacco naturale", updPt.hp, pt.maxHp) + immortalNote;
      const { nextTurn, nextRound } = getNextCombatTurn(latestCombatants, latestCombat.turn, latestCombat.round);
      const allDead = latestCombatants.filter(c => !c.isPlayer).every(c => c.hp <= 0);
      if (allDead) {
        const endQs = { ...latestQs, masterBuffs: monsterNewMasterBuffs, combat: { ...latestCombat, combatants: latestCombatants } };
        await dbSavePartyState(code, endQs);
        setQs(prev => ({ ...prev, combat: endQs.combat }));
        await dbSendMessage({ party_code: code, author: "Sistema", content: "🏆 **BATTAGLIA VINTA!** Tutti i nemici sconfitti!", type: "victory" });
      } else {
        const newCombat = { ...latestCombat, combatants: latestCombatants, turn: nextTurn, round: nextRound, pendingLog: log };
        await dbSavePartyState(code, { ...latestQs, masterBuffs: monsterNewMasterBuffs, combat: newCombat });
        setQs(prev => ({ ...prev, combat: newCombat }));
        await dbSendMessage({ party_code: code, author: "Battaglia", content: log, type: "combat" });
      }
    } finally {
      monsterTickBusyRef.current = false;
    }
  }
  doMonsterTurnRef.current = doMonsterTurn;

  // Fallback timer — fires if player doesn't press the button within 8s.
  // Also re-triggers when pendingLog clears (fixes the freeze-after-dismiss bug).
  // Paused while spellMenu is open so players can read spells without time pressure.
  useEffect(() => {
    if (!qs?.combat?.active) return;
    if (spellMenu) return;
    const combatants = qs?.combat?.combatants || [];
    const activeCombatantNow = combatants[qs?.combat?.turn % combatants.length];
    if (!activeCombatantNow || activeCombatantNow.isPlayer) return; // only arm for monster turns
    const isLeader = combatants.find(c => c.isPlayer && !c.dead)?.id === myId;
    // Leader fires at 8s; fallback clients fire at 18-28s to avoid double-attack race
    const delay = isLeader ? 8000 : 18000 + Math.floor(Math.random() * 10000);
    const timer = setTimeout(() => { doMonsterTurnRef.current?.(); }, delay);
    return () => clearTimeout(timer);
  }, [qs?.combat?.turn, qs?.combat?.active, !!qs?.combat?.pendingLog, myId, code, spellMenu]);

  async function addMsg(content, type="narration", author=null) {
    await dbSendMessage({ party_code:code, author:author||me?.name, content, type });
  }

  async function saveQState(newQs) {
    await dbSavePartyState(code, newQs);
    setQs(newQs);
  }
  async function resolveCombatNoActionablePlayers(latestState, combatants) {
    const soloCombatant = (combatants || []).find(c => c?.isPlayer && c.id === myId);
    if(partyPlayers.length <= 1 && soloCombatant?.stable && !soloCombatant?.dead) {
      const recoveredPlayer = { ...me, hp:1 };
      await dbSavePlayer(recoveredPlayer);
      setMeRaw(recoveredPlayer);
      await dbSavePartyState(code, { ...latestState, combat:null });
      setQs(prev => ({ ...prev, combat:null }));
      await dbSendMessage({
        party_code: code,
        author: "Sistema",
        type: "victory",
        content: `🕯️ **${soloCombatant.name}** si stabilizza e riesce a strisciare fuori dalla battaglia. Il combattimento termina, e l'eroe torna a **1 HP**.`,
      });
      return;
    }
    await dbSavePartyState(code, { ...latestState, combat:null });
    setQs(prev => ({ ...prev, combat:null }));
    await dbSendMessage({
      party_code: code,
      author: "Sistema",
      type: "combat",
      content: "⚔️ **Sconfitta.** Nessun eroe è più in grado di combattere.",
    });
  }

  async function persistPlayerWithEquipment(nextPlayer, nextEquipment) {
    const synced = applyEquipmentToPlayer(nextPlayer, nextEquipment, itemMap);
    await dbSavePlayer(synced);
    setMeRaw(synced);
    setEquipment(nextEquipment);
    saveStoredEquipment(myId, nextEquipment);
    return synced;
  }

  async function buyItem(item) {
    if(!me) return;
    if(me.gold < (item.price||0)) { window.alert("Non hai abbastanza oro."); return; }
    if(!window.confirm(`Acquistare ${item.name} per ${item.price} oro?`)) return;
    await dbAddPlayerItem(me.id, item.id);
    const updatedPlayer = { ...me, gold: me.gold - (item.price || 0) };
    const synced = applyEquipmentToPlayer(updatedPlayer, equipment, itemMap);
    await dbSavePlayer(synced);
    setMeRaw(synced);
    await refreshInventory(synced);
    await addMsg(`🎒 **${me.name}** acquista **${item.name}** per ${item.price} oro.`, "info", "Sistema");
  }

  async function equipItem(entry) {
    const slot = itemSlot(entry?.item);
    if(!slot || !me) return;
    const nextEquipment = { ...equipment, [slot]: entry.itemId };
    const synced = await persistPlayerWithEquipment(me, nextEquipment);
    await refreshInventory(synced);
    await addMsg(`🎽 **${me.name}** equipaggia **${entry.item.name}**.`, "info", "Sistema");
  }

  async function unequipItem(slot) {
    if(!me) return;
    const currentItem = itemMap.get(equipment?.[slot]);
    if(!currentItem) return;
    const nextEquipment = { ...equipment, [slot]: null };
    const synced = await persistPlayerWithEquipment(me, nextEquipment);
    await refreshInventory(synced);
    await addMsg(`🎽 **${me.name}** rimuove **${currentItem.name}**.`, "info", "Sistema");
  }

  function handleInventorySelect(group) {
    setSelectedInventoryItemId(group?.item?.id || null);
  }

  function handleInventoryClose() {
    setSelectedInventoryItemId(null);
  }

  async function handleInventorySell(group) {
    if(!group?.item || !group?.entries?.length || !me) return;
    const sellPrice = Math.max(1, Math.floor((group.item.price || 0) / 2));
    if(!window.confirm(`Vendere ${group.item.name} per ${sellPrice} oro?`)) return;

    const entryToSell = group.entries[0];
    const slot = itemSlot(group.item);
    const isEquipped = !!slot && equipment?.[slot] === group.item.id;
    const nextEquipment = isEquipped && group.quantity <= 1
      ? { ...equipment, [slot]: null }
      : equipment;
    const updatedPlayer = { ...me, gold: (me.gold || 0) + sellPrice };

    await dbRemovePlayerItem(entryToSell.rowId);

    let syncedPlayer = updatedPlayer;
    if(nextEquipment !== equipment) {
      syncedPlayer = await persistPlayerWithEquipment(updatedPlayer, nextEquipment);
    } else {
      await dbSavePlayer(updatedPlayer);
      setMeRaw(updatedPlayer);
    }

    await refreshInventory(syncedPlayer);
    await addMsg(`💰 **${me.name}** vende **${group.item.name}** per ${sellPrice} oro.`, "info", "Sistema");
  }

  async function usePotion(entry) {
    if(!entry?.rowId || !me) return;
    if(entry.item?.type !== "potion") return;
    if((me.hp || 0) <= 0 || myCombatant?.dying || myCombatant?.dead || myCombatant?.stable) {
      window.alert("Non puoi usare pozioni su te stesso mentre sei a terra o fuori combattimento.");
      return;
    }
    const amount = Math.max(1, entry.item.heal_amount || 0);
    if(amount <= 0) return;
    if(me.hp >= me.maxHp) {
      window.alert("Sei già al massimo della vita.");
      return;
    }
    const healed = Math.min(me.maxHp, me.hp + amount);
    const delta = healed - me.hp;
    await dbRemovePlayerItem(entry.rowId);
    const updatedPlayer = { ...me, hp: healed };
    await dbSavePlayer(updatedPlayer);
    setMeRaw(updatedPlayer);
    if(qs?.combat?.active) {
      const combatants = [...qs.combat.combatants];
      const idx = combatants.findIndex(c => c.id === me.id);
      if(idx >= 0) combatants[idx] = reviveCombatantState(combatants[idx], healed);
      await saveQState({ ...qs, combat: { ...qs.combat, combatants } });
    }
    await refreshInventory(updatedPlayer);
    await addMsg(`🧪 **${me.name}** usa **${entry.item.name}** e recupera **${delta} HP**.`, "info", "Sistema");
  }

  async function dismissCombatLog() {
    if(!qs?.combat?.pendingLog) return;
    await saveQState({ ...qs, combat: { ...qs.combat, pendingLog: null } });
  }

  async function forceNextCombatTurn() {
    if(advanceTurnBusyRef.current) return;
    advanceTurnBusyRef.current = true;
    try {
      const latestQs = await dbGetPartyState(code);
      const latestCombat = latestQs?.combat;
      if(!latestCombat?.active) return;
      if(latestCombat.pendingLog) {
        const newCombat = { ...latestCombat, pendingLog:null };
        await dbSavePartyState(code, { ...latestQs, combat:newCombat });
        setQs(prev => ({ ...prev, combat:newCombat }));
        return;
      }
      const combatants = [...(latestCombat.combatants || [])];
      if(!combatants.length) return;
      const actor = combatants[latestCombat.turn % combatants.length];
      if(actor && !actor.isPlayer && actor.hp > 0) {
        await doMonsterTurnRef.current?.();
        return;
      }
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, latestCombat.turn, latestCombat.round);
      const skippedName = actor?.name || "il turno";
      const newCombat = {
        ...latestCombat,
        combatants,
        turn:nextTurn,
        round:nextRound,
        pendingLog:`⏭️ **Turno saltato:** ${skippedName}.`,
      };
      await dbSavePartyState(code, { ...latestQs, combat:newCombat });
      setQs(prev => ({ ...prev, combat:newCombat }));
    } finally {
      advanceTurnBusyRef.current = false;
    }
  }

  async function abandonQuest() {
    const escapeEntry = inventory.find(e => e.itemId === "potion_escape");
    if(!escapeEntry) {
      window.alert("Hai bisogno di una 💨 Pozione di Fuga per scappare dalla battaglia.\nComprala al Negozio per poche monete d'oro.");
      return;
    }
    if(!window.confirm("Vuoi davvero abbandonare la missione?\nQuesta azione consumerà la tua Pozione di Fuga e annullerà il combattimento.")) return;
    await dbRemovePlayerItem(escapeEntry.rowId);
    const playerToSave = (me.hp || 0) <= 0 ? { ...me, hp: 1 } : me;
    if(playerToSave.hp !== me.hp) {
      await dbSavePlayer(playerToSave);
      setMeRaw(playerToSave);
    }
    await saveQState({ ...qs, active: false, step: 0, combat: null });
    await refreshInventory(playerToSave);
    await addMsg(`🏃 **${me.name}** beve la **Pozione di Fuga** e svanisce nell'ombra. La missione è abbandonata.`, "info", "Sistema");
    setTab("quest");
  }

  // -- COMBATTIMENTO --
  async function doAttack() {
    const combat = qs.combat;
    if(!combat?.active || combat.pendingLog) return;
    const combatants = [...combat.combatants];
    const turn = combat.turn % combatants.length;
    const attacker = combatants[turn];
    if(!attacker?.isPlayer || attacker.id!==myId) return;
    if(attacker.dead || attacker.stable) {
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
      await saveQState({ ...qs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound, pendingLog: null } });
      return;
    }
    if(isDyingCombatant(attacker)) {
      const deathSaveRoll = await showDiceVisual({ sides:20, notation:"1d20", label:"Salvezza contro la morte", themeColor:"#fbbf24" });
      const deathSave = resolveDeathSave(attacker, deathSaveRoll);
      const idx = combatants.findIndex(c => c.id === attacker.id);
      combatants[idx] = deathSave.nextCombatant;
      const updatedPlayer = { ...me, hp: deathSave.nextCombatant.hp };
      await dbSavePlayer(updatedPlayer);
      setMeRaw(updatedPlayer);
      if(deathSave.result === "dead" && partyPlayers.length <= 1) {
        await triggerSoloDeath(attacker.name);
        return;
      }
      if(!hasActionablePlayerCombatants(combatants)) {
        await resolveCombatNoActionablePlayers({ ...qs, combat }, combatants);
        return;
      }
      const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
      await saveQState({ ...qs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound, pendingLog: deathSave.log } });
      return;
    }
    const targets = combatants.filter(c=>!c.isPlayer&&c.hp>0);
    if(!targets.length) { await endCombat(); return; }
    const target = targets.find(c=>c.id===selectedTarget) || targets[0];
    setSelectedTarget(null);
    const weapon = attacker.id===myId ? getEquippedWeapon(equipment, itemMap) : { name:"Arma", weapon_die:getCombatDamageDie(attacker) };
    const resolved = await performAsyncAttack(attacker, target, weapon.weapon_die || "1d6");
    const masterBuffs = qs.masterBuffs || {};
    const myBuffs = masterBuffs[myId] || {};
    let effectiveResolved = resolved;
    let newMasterBuffs = masterBuffs;
    if (myBuffs.crit > 0 && resolved.hit) {
      effectiveResolved = { ...resolved, isCrit: true, damage: resolved.damageRoll * 2 };
      newMasterBuffs = { ...masterBuffs, [myId]: { ...myBuffs, crit: myBuffs.crit - 1 } };
    }
    const dmg = effectiveResolved.damage;
    const tidx = combatants.findIndex(c=>c.id===target.id);
    combatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};
    const log = formatWeaponAttackLog(attacker, target, effectiveResolved, weapon.name, combatants[tidx].hp, target.maxHp);
    const { nextTurn, nextRound } = getNextCombatTurn(combatants, combat.turn, combat.round);
    const allDead = combatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
    if(allDead) { await endCombat({...qs, masterBuffs: newMasterBuffs, combat:{...combat, combatants}}); return; }
    await saveQState({ ...qs, masterBuffs: newMasterBuffs, combat: { ...combat, combatants, turn: nextTurn, round: nextRound, pendingLog: log } });
  }

  async function castSpell(spell) {
    if(!combat?.active || combat.pendingLog) return;
    const slots = (combat.spellSlots||{})[myId] || getSpellSlots(me.level);
    const cost = spell.slots || 0;
    if(cost > 0 && (slots[cost]||0) <= 0) {
      await addMsg("🔮 Non hai più slot incantesimo di quel livello per questa battaglia.", "system","Sistema");
      setSpellMenu(false);
      return;
    }

    const combatants = [...combat.combatants];
    const turn = combat.turn % combatants.length;
    const attacker = combatants[turn];
    if(!attacker || attacker.id!==myId) {
      await addMsg("⚠️ Non è il tuo turno per lanciare incantesimi.", "system","Sistema");
      setSpellMenu(false);
      return;
    }

    const enemies = combatants.filter(c=>!c.isPlayer && c.hp>0);
    if(!enemies.length) { await endCombat(); setSpellMenu(false); return; }
    const target = enemies.find(c=>c.id===selectedTarget) || enemies[0];
    setSelectedTarget(null);

    const spellMasterBuffs = qs.masterBuffs || {};
    const spellMyBuffs = spellMasterBuffs[myId] || {};
    let newSpellMasterBuffs = spellMasterBuffs;

    let log = `🔮 **${attacker.name}** lancia **${spell.name}**!\n`;
    let newCombatants = combatants;

    if(spell.type === "damage") {
      const base = await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), notation:spell.dmg, label:`Danno ${spell.dmg}`, themeColor:"#a855f7" });
      const bonus = Math.floor((attacker.mag||0)/2);
      let effectiveBase = base;
      if(spellMyBuffs.crit > 0) {
        effectiveBase = base * 2;
        newSpellMasterBuffs = { ...spellMasterBuffs, [myId]: { ...spellMyBuffs, crit: spellMyBuffs.crit - 1 } };
      }
      const dmg = Math.max(1, effectiveBase + bonus - Math.floor(target.def/2));
      const tidx = newCombatants.findIndex(c=>c.id===target.id);
      newCombatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};
      log += `💥 Tiro danno: **${spell.dmg} = ${base}**\n✨ Bonus magia: **+${bonus}**\n🛡️ Riduzione bersaglio: **-${Math.floor(target.def/2)}**\n🔥 Danno finale: **${dmg}**\n❤️ ${target.name}: ${newCombatants[tidx].hp}/${target.maxHp} HP`;
    } else if(spell.type === "heal") {
      const baseHeal = await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), notation:spell.dmg, label:`Cura ${spell.dmg}`, themeColor:"#10b981" });
      const heal = Math.max(1, baseHeal + Math.floor((attacker.mag||0)/2));
      const healed = Math.min(attacker.maxHp, attacker.hp + heal);
      const delta = healed - attacker.hp;
      const pid = newCombatants.findIndex(c=>c.id===attacker.id);
      newCombatants[pid] = reviveCombatantState(attacker, healed);
      log += `💚 Tiro cura: **${spell.dmg} = ${baseHeal}**\n✨ Bonus magia: **+${Math.floor((attacker.mag||0)/2)}**\n🌿 Cura finale: **${heal}**\n❤️ ${attacker.name}: ${healed}/${attacker.maxHp} HP`;
      const updated = {...me, hp:healed};
      await dbSavePlayer(updated);
      setMeRaw(updated);
    } else {
      log += `${spell.desc || "Effetto speciale"}`;
    }

    const nextSlots = { ...(combat.spellSlots||{}), [myId]: { ...(slots||{}) } };
    if(cost > 0) nextSlots[myId][cost] = Math.max(0, (nextSlots[myId][cost]||0) - 1);

    const { nextTurn, nextRound } = getNextCombatTurn(newCombatants, combat.turn, combat.round);

    if(!hasActionablePlayerCombatants(newCombatants)) {
      setSpellMenu(false);
      await resolveCombatNoActionablePlayers({ ...qs, combat }, newCombatants);
      return;
    }

    const allDead = newCombatants.filter(c=>!c.isPlayer).every(c=>c.hp<=0);
    setSpellMenu(false);
    if(allDead) { await endCombat({...qs, masterBuffs: newSpellMasterBuffs, combat:{...combat, combatants:newCombatants, spellSlots:nextSlots}}); return; }
    await saveQState({ ...qs, masterBuffs: newSpellMasterBuffs, combat: { ...combat, combatants:newCombatants, turn:nextTurn, round:nextRound, spellSlots:nextSlots, pendingLog: log } });
  }

  async function endCombat(preloadedQs) {
    setSpellMenu(false);
    const latestQs = preloadedQs || await dbGetPartyState(code);
    const latestCombat = latestQs?.combat;

    // --- Distribute XP and gold from slain monsters ---
    const slain = (latestCombat?.combatants || [])
      .filter(c => !c.isPlayer && c.hp <= 0)
      .map(c => ({ name: c.name, emoji: c.emoji || "👾", xp: c.xp || 0 }));
    const totalXp = slain.reduce((s, m) => s + m.xp, 0);
    const totalGold = slain.reduce((s, m) => s + Math.floor(m.xp * 0.35), 0);
    const partyCount = Math.max(partyPlayers.length, 1);
    const xpEach = Math.floor(totalXp / partyCount);
    const goldEach = Math.floor(totalGold / partyCount);

    const playerResults = [];
    for (const p of partyPlayers) {
      const beforeXp = p.xp || 0;
      const beforeLevel = p.level || 1;
      let up = { ...p, xp: beforeXp + xpEach, gold: (p.gold || 0) + goldEach };
      const leveledUpTo = [];
      while (up.xp >= xpForLevel(up.level)) {
        up.xp -= xpForLevel(up.level);
        up.level++;
        up.maxHp += 10; up.hp = up.maxHp; up.atk += 2; up.def += 1; up.mag += 1;
        leveledUpTo.push(up.level);
      }
      await dbSavePlayer(up);
      if (up.id === myId) setMeRaw(up);
      playerResults.push({
        id: p.id, name: p.name,
        beforeXp, beforeLevel, xpThreshold: xpForLevel(beforeLevel),
        afterXp: up.xp, afterLevel: up.level,
        xpGained: xpEach, goldGained: goldEach,
        leveledUpTo,
      });
    }

    const victoryData = { slain, xpEach, goldEach, totalXp, totalGold, playerResults, ts: Date.now() };
    const onQuestCombat = latestQs?.active && latestQs?.currentId && (() => {
      const q = getQuests().find(x => x.id === latestQs.currentId);
      return q && isCombatStep(q.steps[latestQs.step]);
    })();
    const newCombat = { active: false, won: !!onQuestCombat, victoryData };
    const newQs = { ...latestQs, combat: newCombat };
    await dbSavePartyState(code, newQs);
    setQs(prev => ({ ...prev, combat: newCombat }));
    await dbSendMessage({ party_code: code, author: "Sistema",
      content: `🏆 **BATTAGLIA VINTA!** ⭐ +${xpEach} XP — 💰 +${goldEach} oro a testa`, type: "victory" });
  }

  // -- QUEST --
  async function acceptQuest(q) {
    if(q.specialPassword && !unlockedSpecialQuestIds.includes(q.id)) {
      setSpecialQuestError("Questa missione richiede una password.");
      return;
    }
    const newQs = { currentId:q.id, step:0, active:true, combat:null, completed:qs?.completed||[] };
    await saveQState(newQs);
    await addMsg(`📜 **MISSIONE: ${q.title}**

${q.desc}

*${q.flavor}*

⭐ Ricompensa: **${q.xpReward} XP** — **${q.goldReward} oro**`, "quest","Master");
    await postQuestStepMessage(q, 0);
  }

  function isChoiceStep(step) {
    return step?.type === "choice";
  }
  function isCombatStep(step) {
    return step?.type === "combat";
  }
  function isLootStep(step) {
    return step?.type === "loot";
  }
  function stepText(step) {
    if(!step) return "";
    return typeof step === "string" ? step : step.text || "";
  }

  async function postQuestStepMessage(q, stepIndex) {
    const step = q.steps[stepIndex];
    const icon = isCombatStep(step)?"⚔️":isLootStep(step)?"💰":isChoiceStep(step)?"🎯":"📜";
    await addMsg(`${icon} **${q.title} — Scena ${stepIndex+1}/${q.steps.length}**

${stepText(step)}`, "quest","Master");
  }

  async function completeQuest(q) {
    const xpE = Math.floor(q.xpReward/Math.max(partyPlayers.length,1));
    const goldE = Math.floor(q.goldReward/Math.max(partyPlayers.length,1));
    for(const p of partyPlayers) {
      let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
      while(up.xp>=xpForLevel(up.level)){up.xp-=xpForLevel(up.level);up.level++;up.maxHp+=10;up.hp=up.maxHp;up.atk+=2;up.def+=1;up.mag+=1;}
      await dbSavePlayer(up);
      if(up.id===myId) setMeRaw(up);
    }
    const newQs={...qs,active:false,step:0,currentId:null,completed:[...(qs.completed||[]),q.id]};
    await saveQState(newQs);
    await addMsg(`⚔️ **MISSIONE COMPLETATA: ${q.title}!**\n\n⭐ +${xpE} XP a testa � 💰 +${goldE} oro a testa`, "victory","Master");
  }

  async function startCombatStep(stepData) {
    const monsters = (stepData.monsters||[]).map(e=>({ ...e, hp:e.maxHp||e.hp, maxHp:e.maxHp||e.hp, weaponDie:e.weaponDie || getCombatDamageDie(e) }));
    const players = partyPlayers.map(p=>({
      id:p?.id,
      name:p?.name,
      emoji:CLASSES[p?.class||'warrior']?.emoji||"⚔️",
      hp:p?.hp||0,
      maxHp:p?.maxHp||0,
      atk:p?.atk||0,
      def:p?.def||0,
      mag:p?.mag||0,
      init:p?.init||1,
      weaponDie:p?.id===myId ? getEquippedWeapon(equipment, itemMapRef.current).weapon_die : getCombatDamageDie(p),
      isPlayer:true,
      dying:false,
      stable:false,
      dead:false,
      deathSuccesses:0,
      deathFailures:0,
    }));
    const allCombatants = [...players,...monsters].map(c=>({...c, rollInit:(c.init||1)+roll(20)}));
    allCombatants.sort((a,b)=>b.rollInit-a.rollInit);
    const spellSlots = Object.fromEntries(players.map(p=>[p.id, getSpellSlots(p.level||1)]));
    const newCombat = { active:true, combatants:allCombatants, turn:0, round:1, spellSlots };
    const newQs = {...qs, combat:newCombat};
    await saveQState(newQs);
    await addMsg(`⚔️ **BATTAGLIA INIZIATA!** Round 1\n\n**Ordine di Iniziativa:**\n${allCombatants.map((c,i)=>`${i+1}. ${c.emoji||"⭐"} ${c.name} (${c.rollInit})`).join("\n")}`, "combat", "Sistema");
    setTab("combat");
  }
  startCombatStepRef.current = startCombatStep;

  // Show victory overlay when combat ends (all clients see it via shared combat.victoryData.ts)
  const shownVictoryRef = useRef(null);
  useEffect(() => {
    const vd = qs?.combat?.victoryData;
    if (!vd || shownVictoryRef.current === vd.ts) return;
    shownVictoryRef.current = vd.ts;
    setVictoryScreen(vd);
    setTab("quest");
  }, [qs?.combat?.victoryData?.ts]);

  async function advanceQuest() {
    const quests = getQuests();
    const q = quests.find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active) return;
    const stepData = q.steps[qs.step];
    // Block if combat not yet won
    if(isCombatStep(stepData) && !qs?.combat?.won) return;
    // Block if choice (must pick an option)
    if(isChoiceStep(stepData)) return;
    const nextStep = qs.step + 1;
    if(nextStep >= q.steps.length) {
      await completeQuest(q);
    } else {
      const newQs = {...qs, combat:null, step:nextStep};
      await saveQState(newQs);
      await postQuestStepMessage(q, nextStep);
    }
  }

  async function chooseQuestOption(choiceIndex) {
    const quests = getQuests();
    const q = quests.find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active) return;
    const step = qs.step;
    const stepData = q.steps[step];
    if(!isChoiceStep(stepData)) return;
    const choice = stepData.choices[choiceIndex];
    if(!choice) return;

    const isCorrect = choice.correct === true;
    await addMsg(`🎯 **Scelta:** ${choice.label}`, "quest", "Master");

    if(isCorrect) {
      const xpE = Math.max(0, Number(choice.xp)||0);
      const goldE = Math.max(0, Number(choice.gold)||0);
      if(xpE||goldE) {
        for(const p of partyPlayers) {
          let up={...p,xp:p.xp+xpE,gold:p.gold+goldE};
          while(up.xp>=xpForLevel(up.level)){up.xp-=xpForLevel(up.level);up.level++;up.maxHp+=10;up.hp=up.maxHp;up.atk+=2;up.def+=1;up.mag+=1;}
          await dbSavePlayer(up);
          if(up.id===myId) setMeRaw(up);
        }
        await addMsg(`✅ Scelta giusta! ⭐ +${xpE} XP a testa — 💰 +${goldE} oro a testa`, "victory", "Master");
      }
    } else {
      await addMsg(`❌ Hai scelto male... il party non guadagna nulla e avanza comunque.`, "system", "Sistema");
    }

    const nextStep = choice.next != null ? Number(choice.next) : step+1;
    if(nextStep >= q.steps.length) {
      await completeQuest(q);
    } else {
      const newQs={...qs, step:nextStep};
      await saveQState(newQs);
      await postQuestStepMessage(q, nextStep);
    }
  }

  async function handleLoot(stepData) {
    const q = getQuests().find(x=>x.id===qs?.currentId);
    if(!q||!qs?.active) return;
    const loot = stepData?.loot || {};
    const goldMin = loot.gold?.[0]||0, goldMax = loot.gold?.[1]||0;
    const goldFound = randomIntInclusive(goldMin, goldMax);
    const items = (loot.items||[]).map(spec => resolveLootItem(spec, catalogItems)).filter(Boolean);
    const itemFound = pickRandom(items);
    let lootMsg = `💰 **Bottino trovato!**`;
    if(goldFound>0) lootMsg += `\n🪙 +${goldFound} oro a testa`;
    if(itemFound) lootMsg += `\n🎁 Hai trovato: **${itemFound.name}**! È finito nel tuo inventario.`;
    lootMsg += `\n\nCliccate **Avanti →** per proseguire.`;
    for(const p of partyPlayers) {
      let up={...p, gold:p.gold+goldFound};
      await dbSavePlayer(up);
      if(up.id===myId) setMeRaw(up);
    }
    if(itemFound && me?.id) {
      await dbAddPlayerItem(me.id, itemFound.id);
      await refreshInventory({ ...me, gold: (me.gold || 0) + goldFound });
    }
    await addMsg(lootMsg, "victory", "Master");
    setLootedStepKey(currentStepKey);
  }

  async function handleInput() {
    const raw=input.trim(); if(!raw) return;
    setInput("");
    const c=raw.toLowerCase();
    if(c==="avanza") await advanceQuest();
    else if(c==="aiuto") await addMsg(`⚔️ **Comandi:**\n� **avanza** � prosegui nella missione\n� **stato** � il tuo personaggio\n� **party** � chi c'� nel party\n� **classifica** � punti e livelli\n� Qualsiasi testo ? chat`, "system","Sistema");
    else if(c==="stato") { if(me) await addMsg(`${CLASSES[me?.class||'warrior']?.emoji} **${me.name}** � ${RACES[me?.race||'human']?.name} ${CLASSES[me?.class||'warrior']?.name} � Lv.${me.level}\n❤️${me.hp||0}/${me.maxHp||0} ⚔️${me.atk||0} 🛡️${me.def||0} ✨${me.mag||0}\n⭐XP ${me.xp||0}/${xpForLevel(me.level||1)} | 💰${me.gold||0} oro`,`info`,me.name); }
    else if(c==="party") { const lines=partyPlayers.map(p=>`${CLASSES[p?.class||'warrior']?.emoji} **${p.name}** Lv.${p.level} ❤️${p?.hp||0}/${p?.maxHp||0}`); await addMsg(`⚔️ **Party [${code}]**\n${lines.join("\n")}`,"info","Master"); }
    else if(c==="classifica") { const sorted=[...partyPlayers].sort((a,b)=>b.level-a.level); await addMsg(`⚔️ **Classifica**\n${sorted.map((p,i)=>`${["⭐","⭐","⭐"][i]||"  "} ${CLASSES[p?.class||'warrior']?.emoji} **${p.name}** Lv.${p.level} � ${p.xp||0}XP`).join("\n")}`,"info","Master"); }
    else await addMsg(raw, "chat", me?.name);
    inputRef.current?.focus();
  }

  const MSG_COLORS={
    narration:{bg:"rgba(15,23,42,0.82)",border:"#334155",color:"#e2d9c5"},
    system:   {bg:"rgba(76,29,149,0.3)",border:"#7c3aed",color:"#ddd6fe"},
    quest:    {bg:"rgba(120,53,15,0.32)",border:"#d97706",color:"#fde68a"},
    victory:  {bg:"rgba(6,95,70,0.32)",border:"#10b981",color:"#a7f3d0"},
    combat:   {bg:"rgba(127,29,29,0.34)", border:"#ef4444",color:"#fecaca"},
    info:     {bg:"rgba(55,48,163,0.3)",border:"#6366f1",color:"#c7d2fe"},
    chat:     {bg:"rgba(15,23,42,0.86)",border:"#334155",color:"#f8fafc"},
  };

  const spellbookCaster = MAGIC_CLASSES.includes(me?.class);
  const spellbookAvailableSpells = spellbookCaster ? availableSpellsFor(me?.class, me?.level) : [];

  useEffect(() => {
    if(!myId || !spellbookCaster) {
      setPreparedSpellIds([]);
      return;
    }
    const stored = getStoredPreparedSpells(myId, spellbookAvailableSpells);
    const validIds = new Set(spellbookAvailableSpells.map(spell => spell.id));
    const nextPrepared = stored.filter(id => validIds.has(id));
    const normalized = nextPrepared.length ? nextPrepared : spellbookAvailableSpells.map(spell => spell.id);
    setPreparedSpellIds(normalized);
    saveStoredPreparedSpells(myId, normalized);
  }, [myId, spellbookCaster, me?.class, me?.level]);

  if(!me || !me.class) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#f3f4f6", fontFamily:"'Cinzel',serif", fontSize:"1.2rem" }}>Caricamento personaggio...</div>;

  const combat = qs?.combat;
  const activeCombatant = combat?.active ? combat.combatants?.[combat.turn%combat.combatants.length] : null;
  const myCombatant = combat?.combatants?.find(c => c.id === myId) || null;
  const myTurn = combat?.active && activeCombatant?.id===myId;
  const myDeathTurn = myTurn && isDyingCombatant(activeCombatant);
  const isCaster = MAGIC_CLASSES.includes(me?.class);
  const spellSlots = combat?.spellSlots?.[myId] || getSpellSlots(me?.level);
  const availableSpells = isCaster ? availableSpellsFor(me?.class, me?.level) : [];
  const maxPreparedSpells = maxPreparedSpellsForLevel(me?.level || 1);
  const preparedNormalSpellCount = availableSpells.filter(spell => spell.slots > 0 && preparedSpellIds.includes(spell.id)).length;
  const preparedSpells = availableSpells.filter(spell => spell.slots === 0 || preparedSpellIds.includes(spell.id));
  const spellLevels = Array.from(new Set([
    ...(preparedSpells.some(spell => Number(spell.slots) === 0) ? [0] : []),
    ...Object.keys(spellSlots).filter(l=>spellSlots[l]>0).map(Number),
  ])).sort((a,b)=>a-b);
  const spellsByLevel = spellLevels.reduce((acc, lvl) => {
    acc[lvl] = preparedSpells.filter(s => Number(s.slots) === lvl);
    return acc;
  }, {});
  const currentQ = qs?.active ? getQuests().find(x=>x.id===qs.currentId) : null;
  const allActiveQuests = getQuests().filter(q => q.active);
  const dailyQuestIds = new Set(getDailyQuests(allActiveQuests.filter(q => !q.specialPassword)).map(q => q.id));
  const publicDailyQuests = allActiveQuests.filter(q => dailyQuestIds.has(q.id));
  const unlockedSpecialQuests = allActiveQuests.filter(q => q.specialPassword && unlockedSpecialQuestIds.includes(q.id));
  const currentStepKey = `${qs?.currentId || ""}:${qs?.step ?? -1}`;
  const lootDone = lootedStepKey === currentStepKey;
  const inventoryCounts = countInventoryItems(inventory);
  const inventoryGroups = groupInventoryEntries(inventory);
  const selectedInventoryItem = inventoryGroups.find(group => group.item.id === selectedInventoryItemId) || null;
  const visibleChatMessages = messages.filter(msg => msg.type === "chat");
  const equippedWeapon = getEquippedWeapon(equipment, itemMap);
  const combatMode = tab==="combat" && combat?.active;
  const isMonsterTurn = combat?.active && activeCombatant && !activeCombatant.isPlayer;
  const isLeaderForMonsterTurn = isMonsterTurn && combat.combatants.find(c => c.isPlayer && !c.dead)?.id === myId;
  const equippedItems = {
    weapon: itemMap.get(equipment.weapon) || null,
    armor: itemMap.get(equipment.armor) || null,
    shield: itemMap.get(equipment.shield) || null,
  };

  function togglePreparedSpell(spellId) {
    if(!myId) return;
    setPreparedSpellIds(prev => {
      const spell = availableSpells.find(entry => entry.id === spellId);
      if(!spell || spell.slots === 0) return prev;
      const isPrepared = prev.includes(spellId);
      const currentPreparedCount = availableSpells.filter(entry => entry.slots > 0 && prev.includes(entry.id)).length;
      if(!isPrepared && currentPreparedCount >= maxPreparedSpells) return prev;
      const next = isPrepared ? prev.filter(id => id !== spellId) : [...prev, spellId];
      saveStoredPreparedSpells(myId, next);
      return next;
    });
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", position:"relative", zIndex:1 }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(2,6,23,0.38) 0%, rgba(2,6,23,0.32) 45%, rgba(2,6,23,0.42) 100%)", pointerEvents:"none" }} />
      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:999, backdropFilter:"blur(2px)" }} />
      )}
      {deathScene && (
        <div style={{ position:"fixed", inset:0, zIndex:10000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(2,6,23,0.88)", padding:"1.5rem" }}>
          <div style={{ width:"min(560px,100%)", textAlign:"center", background:"linear-gradient(180deg, rgba(24,10,10,0.96), rgba(8,8,12,0.98))", border:"1px solid #7f1d1d", borderRadius:12, boxShadow:"0 24px 80px rgba(0,0,0,0.5)", padding:"2rem 1.5rem" }}>
            <div style={{ fontSize:"4rem", marginBottom:"0.8rem" }}>🩸</div>
            <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fca5a5", fontSize:"1.8rem", marginBottom:"0.8rem" }}>Scheda Strappata</div>
            <div style={{ color:"#fecaca", fontSize:"1rem", lineHeight:1.7 }}>
              <strong>{deathScene.name}</strong> cade nell'oscurità. Le pagine della sua storia si lacerano, e il destino reclama il suo tributo.
            </div>
            <div style={{ color:"#9ca3af", fontSize:"0.85rem", marginTop:"1rem" }}>
              Il personaggio è perduto. Ritorno alla creazione di una nuova scheda...
            </div>
          </div>
        </div>
      )}
      {diceResult?.stage === "result" && (
        <div style={{ position:"fixed", bottom:"12%", left:"50%", transform:"translateX(-50%)", zIndex:10000, textAlign:"center", pointerEvents:"none" }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1.4rem", color: diceResult.value===20?"#fbbf24": diceResult.value===1?"#f87171":"#fff", textShadow:"0 0 20px rgba(0,0,0,0.9)", letterSpacing:"0.1em" }}>
            {diceResult.value===20 ? "CRITICO!" : diceResult.value===1 ? "FALLIMENTO!" : diceResult.label || ""}
          </div>
          <div style={{ fontSize:"1rem", color:"#cbd5e1", marginTop:4, textShadow:"0 0 16px rgba(0,0,0,0.9)" }}>
            {diceResult.label && diceResult.value !== 20 && diceResult.value !== 1 ? `${diceResult.label}: ` : ""}<strong style={{ fontSize:"1.3rem" }}>{diceResult.value}</strong>
          </div>
        </div>
      )}
      {/* SIDEBAR — drawer on mobile, fixed panel on desktop */}
      <aside style={{
        width: isMobile ? 270 : (combatMode ? 176 : 200),
        flexShrink: 0,
        background: combatMode ? "rgba(3,7,18,0.98)" : "rgba(4,8,18,0.97)",
        borderRight: "1px solid rgba(148,163,184,0.14)",
        display: "flex", flexDirection: "column", gap: 8,
        padding: combatMode ? "0.85rem 0.7rem" : "0.7rem",
        overflowY: "auto",
        position: isMobile ? "fixed" : "relative",
        left: isMobile ? (sidebarOpen ? 0 : -280) : "auto",
        top: 0, height: isMobile ? "100vh" : "auto",
        zIndex: isMobile ? 1000 : 1,
        transition: isMobile ? "left 0.27s ease" : "none",
        backdropFilter: "blur(8px)",
        boxShadow: combatMode ? "inset -1px 0 0 rgba(239,68,68,0.12)" : "none",
      }}>
        {/* Mobile close button */}
        {isMobile && (
          <button onClick={()=>setSidebarOpen(false)} style={{ alignSelf:"flex-end", background:"rgba(255,255,255,0.06)", border:"1px solid #1f2937", borderRadius:6, color:"#94a3b8", padding:"4px 10px", cursor:"pointer", fontSize:"1rem", marginBottom:4 }}>✕</button>
        )}
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.75rem", color:"#4c1d95", letterSpacing:"0.1em", paddingBottom:8, borderBottom:"1px solid #0f172a" }}>⚔️ {getMeta().worldName}</div>
        <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #3b0764", borderRadius:5, padding:"0.6rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
            <ArtThumb src={getPlayerPortrait(me)} alt={me?.name || "Eroe"} size={56} radius={14} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#f9fafb", fontSize:"0.82rem", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{me?.name}</div>
              <div style={{ color:"#94a3b8", fontSize:"0.62rem" }}>{RACES[me?.race]?.name} {CLASSES[me?.class]?.name}</div>
            </div>
            <span style={{ padding:"1px 5px", background:"#3b0764", borderRadius:3, fontSize:"0.62rem", color:"#a78bfa", flexShrink:0 }}>Lv.{me.level}</span>
          </div>
          <HpBar cur={me.hp} max={me.maxHp} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", marginTop:4 }}>
            <span style={{ color:"#f87171" }}>❤️{me.hp}/{me.maxHp}</span>
            <span style={{ color:"#fb923c" }}>⚔️{me.atk}</span>
            <span style={{ color:"#60a5fa" }}>🛡️{me.def}</span>
          </div>
          {isCaster && (
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", marginTop:4 }}>
              <span style={{ color:"#a78bfa" }}>✨{me.mag}</span>
              <span style={{ color:"#c4b4ff" }}>📿 Slot: {totalSlots(spellSlots)} ({formatSpellSlots(spellSlots)})</span>
            </div>
          )}
          <div style={{ height:3, background:"#0f172a", borderRadius:2, overflow:"hidden", marginTop:5 }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg,#6d28d9,#a78bfa)", width:`${Math.min(100,me.xp/xpForLevel(me.level)*100)}%`, transition:"width .5s" }} />
          </div>
          <div style={{ fontSize:"0.58rem", color:"#64748b", textAlign:"right", marginTop:1 }}>{me.xp}/{xpForLevel(me.level)} XP</div>
          <div style={{ marginTop:6, padding:"0.35rem 0.45rem", background:"rgba(180,83,9,0.12)", border:"1px solid #78350f", borderRadius:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"0.58rem", color:"#92400e", textTransform:"uppercase", letterSpacing:"0.08em" }}>Tesoro</span>
            <span style={{ fontSize:"0.74rem", color:"#fbbf24", fontWeight:700 }}>💰 {me.gold || 0} oro</span>
          </div>
        </div>

        <div style={{ background:PANEL_BG_SOFT, border:`1px solid ${PANEL_BORDER}`, borderRadius:4, padding:"0.5rem" }}>
          <div style={{ fontSize:"0.58rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>👥 Party — {code}</div>
          {partyPlayers.filter(p=>p.id!==myId).map(p=>(
            <div key={p?.id} style={{ display:"flex", gap:5, alignItems:"center", marginBottom:3 }}>
              <span style={{ fontSize:"0.9rem" }}>{CLASSES[p?.class||'warrior']?.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.72rem", color:"#d1d5db", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p?.name}</div>
                <div style={{ height:2, background:"#0f172a", borderRadius:1, overflow:"hidden", marginTop:1 }}>
                  <div style={{ height:"100%", background:(p?.hp||0)/(p?.maxHp||1)>0.5?"#22c55e":(p?.hp||0)/(p?.maxHp||1)>0.25?"#f59e0b":"#ef4444", width:`${Math.min(100,(p?.hp||0)/(p?.maxHp||1)*100)}%` }} />
                </div>
              </div>
              <span style={{ fontSize:"0.6rem", color:"#94a3b8", flexShrink:0 }}>Lv.{p?.level||1}</span>
            </div>
          ))}
          {partyPlayers.length<=1&&<div style={{ color:"#1f2937", fontSize:"0.68rem" }}>Solo per ora</div>}
          <JoinPartyWidget myId={myId} currentCode={code} />
        </div>

        {currentQ && (
          <div style={{ background:"rgba(180,83,9,0.08)", border:"1px solid #78350f", borderRadius:4, padding:"0.5rem" }}>
            <div style={{ fontSize:"0.58rem", color:"#78350f", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>📜 Missione</div>
            <div style={{ color:"#fbbf24", fontSize:"0.75rem", fontWeight:700, marginBottom:3 }}>{currentQ.title}</div>
            <div style={{ height:3, background:"#0f172a", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg,#b45309,#fbbf24)", width:`${qs.step/currentQ.steps.length*100}%` }} />
            </div>
            <div style={{ fontSize:"0.6rem", color:"#78350f", marginTop:2 }}>Scena {qs.step}/{currentQ.steps.length}</div>
          </div>
        )}

        {combat?.active && (
          <div style={{ background:myTurn?"rgba(239,68,68,0.15)":"rgba(239,68,68,0.06)", border:`1px solid ${myTurn?"#ef4444":"#7f1d1d"}`, borderRadius:4, padding:"0.5rem" }}>
            <div style={{ fontSize:"0.62rem", color:myTurn?"#ef4444":"#7f1d1d", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>⚔️ Round {combat.round}</div>
            <div style={{ color:myTurn?"#fca5a5":"#6b7280", fontSize:"0.75rem", fontWeight:700 }}>{myDeathTurn?"🕯️ SALVEZZA CONTRO LA MORTE":myTurn?"⚔️ TUO TURNO!":"Attendi..."}</div>
            {myCombatant?.dying && (
              <div style={{ marginTop:4, fontSize:"0.65rem", color:"#fecaca" }}>
                Successi {myCombatant.deathSuccesses || 0}/3 • Fallimenti {myCombatant.deathFailures || 0}/3
              </div>
            )}
          </div>
        )}

        <button
          onClick={()=>setScreen("landing")}
          style={{
            marginTop:"auto",
            padding:"0.8rem 0.95rem",
            background:"linear-gradient(135deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98))",
            border:"1px solid rgba(251,191,36,0.42)",
            borderRadius:8,
            color:"#f8e7b9",
            cursor:"pointer",
            fontSize:"0.84rem",
            fontFamily:"'Cinzel',serif",
            fontWeight:700,
            letterSpacing:"0.05em",
            textAlign:"center",
            boxShadow:"0 10px 24px rgba(0,0,0,0.24)",
          }}
        >
          ← Esci al Menu
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:combatMode?"rgba(2,6,23,0.52)":"rgba(2,6,23,0.28)", position:"relative", zIndex:1, backdropFilter:"blur(2px)" }}>
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${PANEL_BORDER}`, background:combatMode?"rgba(8,10,20,0.94)":"rgba(3,7,18,0.88)", flexShrink:0, overflowX:"auto", overflowY:"hidden" }}>
          {/* Hamburger — mobile only */}
          {isMobile && (
            <button onClick={()=>setSidebarOpen(true)} style={{ flexShrink:0, padding:"0 1rem", background:"transparent", border:"none", borderBottom:"2px solid transparent", color:"#94a3b8", cursor:"pointer", fontSize:"1.1rem" }}>☰</button>
          )}
          {[["chat","🍺 Taverna"],["quest","📜 Missioni"],["inventory","🎒 Inventario"],["equipment","🎽 Equip"],["spells","✨ Magie"],["shop","🛒 Negozio"],["combat","⚔️ Battaglia"]].map(([k,l])=>{
            const combatLocked = !!combat?.active && !["inventory","equipment","combat"].includes(k);
            return (
            <button key={k} onClick={()=>{ if(!combatLocked){ setTab(k); if(isMobile) setSidebarOpen(false); } }} title={combatLocked?"Non disponibile durante il combattimento":undefined}
              style={{ flexShrink:0, padding: isMobile?"0.6rem 0.8rem":"0.6rem 1.2rem", background:tab===k?"rgba(109,40,217,0.2)":"transparent", border:"none", borderBottom:tab===k?"2px solid #7c3aed":"2px solid transparent", color:combatLocked?"#334155":tab===k?"#c4b5fd":"#94a3b8", cursor:combatLocked?"not-allowed":"pointer", fontFamily:"'Cinzel',serif", fontSize: isMobile?"0.7rem":"0.78rem", letterSpacing:"0.05em", opacity:combatLocked?0.4:1, whiteSpace:"nowrap" }}>
              {l}{k==="combat"&&combat?.active&&<span style={{ marginLeft:5, padding:"1px 5px", background:"#7f1d1d", borderRadius:10, fontSize:"0.62rem", color:"#fca5a5" }}>LIVE</span>}
            </button>);
          })}
        </div>

        {tab==="chat" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

            {/* ── Pinned tavern intro ── */}
            <div style={{ flexShrink:0, maxHeight:210, overflowY:"auto", background:"linear-gradient(180deg,rgba(20,10,2,0.98),rgba(15,8,2,0.97))", borderBottom:"1px solid rgba(180,100,20,0.4)", padding:"0.9rem 1.1rem" }}>
              <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fbbf24", fontSize:"1rem", textAlign:"center", marginBottom:"0.55rem", letterSpacing:"0.06em" }}>🍺 Benvenuti alla Taverna Storta</div>
              <div style={{ fontFamily:"'Crimson Pro',Georgia,serif", color:"#c49a5a", fontSize:"0.82rem", lineHeight:1.8 }}>
                <p style={{ margin:"0 0 0.5rem" }}>L'odore di legno umido, arrosto speziato e birra forte riempie l'aria. Le travi del soffitto sembrano piegate dal tempo, il pavimento scricchiola a ogni passo e il grande lampadario ondeggia lentamente… anche se nessuno lo ha toccato.</p>
                <p style={{ margin:"0 0 0.5rem" }}>Dietro al bancone, un oste dall'occhio storto pulisce lo stesso boccale da almeno mezz'ora. Con voce roca, vi squadra uno a uno.</p>
                <blockquote style={{ margin:"0.4rem 0", padding:"0.4rem 0.8rem", borderLeft:"3px solid #b45309", color:"#fde68a", fontStyle:"italic" }}>
                  "Ascoltate bene, viandanti… Qui dentro non si parla come fuori dal mondo. Niente voci divine, niente pensieri sospesi nel vuoto, niente parole senza volto."
                </blockquote>
                <p style={{ margin:"0.4rem 0 0.4rem" }}>L'oste punta il dito verso il centro della sala.</p>
                <blockquote style={{ margin:"0.4rem 0", padding:"0.4rem 0.8rem", borderLeft:"3px solid #b45309", color:"#fde68a", fontStyle:"italic" }}>
                  "Alla Taverna Storta esiste una sola legge: qui si parla <strong>SOLO ruolando.</strong>"
                </blockquote>
                <p style={{ margin:"0.4rem 0" }}>Un silenzio attraversa la sala. Poi un nano ubriaco cade dalla sedia. Nessuno sembra farci caso.</p>
                <blockquote style={{ margin:"0.4rem 0", padding:"0.4rem 0.8rem", borderLeft:"3px solid #b45309", color:"#fde68a", fontStyle:"italic" }}>
                  "Se volete parlare… dovete farlo come i vostri personaggi. Sedetevi, bevete, litigate, raccontate storie, fate accordi… ma restate nel mondo."
                </blockquote>
                <p style={{ margin:"0.4rem 0" }}>Con un colpo secco appoggia il boccale sul bancone.</p>
                <blockquote style={{ margin:"0.4rem 0", padding:"0.4rem 0.8rem", borderLeft:"3px solid #92400e", color:"#fcd34d", fontStyle:"italic", fontWeight:600 }}>
                  "La Taverna Storta apre le sue porte solo ai gruppi completi. Un avventuriero solitario qui non può entrare. Serve un Party."
                </blockquote>
                <p style={{ margin:"0.5rem 0 0", color:"#9a6630", fontSize:"0.78rem", textAlign:"center", fontStyle:"italic" }}>"Perché nessuno sopravvive a questo mondo da solo."</p>
              </div>
            </div>

            {/* ── Party gate OR messages + input ── */}
            {!code ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem", textAlign:"center", background:"rgba(10,5,1,0.7)" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem", filter:"grayscale(0.4)" }}>🚪</div>
                <div style={{ fontFamily:"'Cinzel Decorative',serif", color:"#92400e", fontSize:"1rem", marginBottom:"0.7rem" }}>La porta è sbarrata</div>
                <div style={{ color:"#78350f", fontSize:"0.85rem", maxWidth:300, lineHeight:1.7, fontFamily:"'Crimson Pro',Georgia,serif" }}>
                  L'oste ti fissa senza muoversi.<br/>
                  <em>"Torna con il tuo gruppo."</em><br/><br/>
                  Unisciti a un Party per varcare la soglia della Taverna Storta.
                </div>
              </div>
            ) : (<>
              <div style={{ flex:1, overflowY:"auto", padding:"0.8rem", display:"flex", flexDirection:"column", gap:7, background:"rgba(10,5,1,0.62)" }}>
                {visibleChatMessages.length === 0 && (
                  <div style={{ textAlign:"center", padding:"3rem 1rem" }}>
                    <div style={{ fontSize:"2.5rem", marginBottom:"0.6rem" }}>🍺</div>
                    <div style={{ color:"#78350f", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.88rem", fontStyle:"italic" }}>Il camino crepita. Nessuno ha ancora aperto bocca.</div>
                    <div style={{ color:"#6b5030", fontSize:"0.78rem", marginTop:"0.4rem" }}>Sii il primo a parlare — come il tuo personaggio.</div>
                  </div>
                )}
                {visibleChatMessages.map(msg => (
                  <div key={msg.id} className="msg-in" style={{ padding:"0.6rem 0.9rem", borderRadius:6, background:"rgba(40,18,4,0.7)", borderLeft:"3px solid #92400e", boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
                    {msg.author && (
                      <div style={{ fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#b45309", marginBottom:3, fontFamily:"'Cinzel',serif" }}>{msg.author}</div>
                    )}
                    <div style={{ fontSize:"0.9rem", lineHeight:1.7, color:"#e8d5b0", fontFamily:"'Crimson Pro',Georgia,serif", fontStyle:"italic" }} dangerouslySetInnerHTML={{ __html: fmt(msg.content) }} />
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>
              <div style={{ display:"flex", gap:8, padding:"0.7rem", borderTop:"1px solid rgba(180,100,20,0.3)", background:"rgba(15,7,1,0.95)", flexShrink:0 }}>
                <input ref={inputRef}
                  style={{ flex:1, padding:"0.65rem 0.9rem", background:"rgba(40,18,4,0.5)", border:"1px solid rgba(146,64,14,0.5)", borderRadius:4, color:"#e8d5b0", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.92rem", fontStyle:"italic" }}
                  placeholder={`${me?.name || "Il tuo personaggio"} dice…`}
                  value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleInput()} autoComplete="off" />
                <button onClick={handleInput} style={{ padding:"0.65rem 1.1rem", background:"#78350f", border:"1px solid #92400e", borderRadius:4, color:"#fde68a", cursor:"pointer", fontSize:"1rem" }}>🍺</button>
              </div>
            </>)}
          </div>
        )}
        {tab==="inventory" && (
          <InventoryView
            loading={inventoryLoading}
            groups={inventoryGroups}
            equipment={equipment}
            selectedItem={selectedInventoryItem}
            onSelectItem={handleInventorySelect}
            onCloseItem={handleInventoryClose}
            onEquip={equipItem}
            onSell={handleInventorySell}
            onUse={usePotion}
            canUseConsumables={(me?.hp || 0) > 0 && !myCombatant?.dying && !myCombatant?.dead && !myCombatant?.stable}
          />
        )}
        {tab==="equipment" && (
          <EquipmentView
            me={me}
            equippedItems={equippedItems}
            equippedWeapon={equippedWeapon}
            onUnequip={unequipItem}
          />
        )}
        {tab==="spells" && isCaster && (
          <SpellbookView
            spellsByLevel={Object.entries(availableSpells.reduce((acc, spell) => {
              const lvl = Number(spell.slots || 0);
              if(!acc[lvl]) acc[lvl] = [];
              acc[lvl].push(spell);
              return acc;
            }, {})).sort((a,b)=>Number(a[0]) - Number(b[0])).reduce((acc, [lvl, spells]) => ({ ...acc, [lvl]: spells }), {})}
            preparedSpellIds={preparedSpellIds}
            preparedCount={preparedNormalSpellCount}
            maxPrepared={maxPreparedSpells}
            onTogglePrepared={togglePreparedSpell}
          />
        )}
        {tab==="spells" && !isCaster && (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b", fontFamily:"'Cinzel',serif" }}>
            Questo eroe non usa magia.
          </div>
        )}
        {tab==="shop" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
            <ShopView
              me={me}
              items={catalogItems.filter(i=>i.available)}
              loading={inventoryLoading}
              error={null}
              inventoryCounts={inventoryCounts}
              onBuy={buyItem}
            />
          </div>
        )}

        {tab==="quest" && (
          <div style={{ flex:1, overflowY:"auto", padding:"1rem", background:"rgba(3,7,18,0.5)" }}>
            <h3 style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", marginBottom:"1rem" }}>📜 Missioni</h3>
            {qs?.active && currentQ && (
              <div style={{ background:"rgba(120,53,15,0.34)", border:"1px solid #b45309", borderRadius:6, padding:"1rem", marginBottom:"1rem" }}>
                <div style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif", fontWeight:700, marginBottom:4 }}>📜 IN CORSO: {currentQ.title}</div>
                <div style={{ height:5, background:"#0f172a", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
                  <div style={{ height:"100%", background:"linear-gradient(90deg,#b45309,#fbbf24)", width:`${(qs.step+1)/currentQ.steps.length*100}%`, transition:"width 0.5s" }} />
                </div>
                <p style={{ color:"#fde68a", fontSize:"0.85rem", marginBottom:10 }}>Scena {qs.step+1} di {currentQ.steps.length}</p>
                {(() => {
                  const stepData = currentQ?.steps?.[qs.step];
                  if(!stepData) return null;
                  const combatVictory = !!qs?.combat?.won;
                  const lootOpened = lootDone;
                  const canAdvance =
                    isCombatStep(stepData) ? (!qs?.combat?.active && combatVictory) :
                    isLootStep(stepData) ? lootOpened :
                    isChoiceStep(stepData) ? false :
                    true; // narrative
                  if(isChoiceStep(stepData)) {
                    return (
                      <div>
                        <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:12, lineHeight:1.5 }}>{stepData.text}</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                          {stepData.choices?.map((c,i)=>(
                            <button key={i} onClick={()=>chooseQuestOption(i)}
                              style={{ padding:"0.8rem 1.2rem", background:"rgba(109,40,217,0.2)", border:"1px solid #6d28d9", borderRadius:6, color:"#c4b5fd", cursor:"pointer", fontFamily:"inherit", fontSize:"0.88rem", textAlign:"left", transition:"background 0.15s" }}
                              onMouseEnter={e=>e.currentTarget.style.background="rgba(109,40,217,0.4)"}
                              onMouseLeave={e=>e.currentTarget.style.background="rgba(109,40,217,0.2)"}>
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if(isCombatStep(stepData)) {
                    return (
                      <div style={{ textAlign:"center", padding:"1rem" }}>
                        <p style={{ color:"#fca5a5", fontSize:"0.88rem", marginBottom:12 }}>{stepData.text}</p>
                        {qs.combat?.won
                          ? <div>
                              <p style={{ color:"#22c55e", fontFamily:"'Cinzel',serif", marginBottom:12 }}>🏆 Vittoria! Il combattimento è finito.</p>
                              {canAdvance && <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>}
                            </div>
                          : qs.combat?.active
                            ? <p style={{ color:"#ef4444", fontFamily:"'Cinzel',serif" }}>⚔️ Battaglia avviata automaticamente — sei già nel flusso di combattimento.</p>
                            : <p style={{ color:"#fbbf24", fontFamily:"'Cinzel',serif" }}>Preparazione del combattimento...</p>
                        }
                      </div>
                    );
                  }
                  if(isLootStep(stepData)) {
                    return (
                      <div style={{ textAlign:"center", padding:"1rem" }}>
                        <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:12 }}>{stepData.text}</p>
                        {canAdvance
                          ? <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>
                          : <BigBtn onClick={()=>handleLoot(stepData)} gold icon="🔍">Cerca tra le rovine</BigBtn>
                        }
                      </div>
                    );
                  }
                  // narrative
                  return (
                    <div>
                      <p style={{ color:"#fde68a", fontSize:"0.88rem", marginBottom:16, lineHeight:1.5 }}>{stepText(stepData)}</p>
                      {canAdvance && <BigBtn onClick={advanceQuest} gold>Avanti →</BigBtn>}
                    </div>
                  );
                })()}
                <div style={{ marginTop:12 }}>
                  <SmallBtn red onClick={async ()=>{
                    if(!window.confirm("Abbandonare la missione in corso? I progressi andranno persi.")) return;
                    await saveQState({...qs, active:false, step:0, combat:null});
                  }}>❌ Abbandona Missione</SmallBtn>
                </div>
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, padding:"0.45rem 0.75rem", background:"rgba(120,53,15,0.18)", border:"1px solid rgba(180,83,9,0.35)", borderRadius:6 }}>
              <span style={{ color:"#fbbf24", fontSize:"0.76rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.04em" }}>🗓️ Missioni del Giorno</span>
              <span style={{ color:"#6b7280", fontSize:"0.71rem" }}>si rinnova in {hoursUntilMidnight()}</span>
            </div>
            {publicDailyQuests.map(q=>{
              const done=(qs?.completed||[]).includes(q.id);
              return (
                <div key={q.id} style={{ background:PANEL_BG, border:`1px solid ${done?PANEL_BORDER:"#475569"}`, borderRadius:6, padding:"1rem", marginBottom:8, opacity:done?0.6:1 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                        <span style={{ fontFamily:"'Cinzel',serif", color:done?"#4b5563":"#fbbf24", fontWeight:700 }}>{q.title}</span>
                        <span style={{ padding:"1px 7px", border:`1px solid ${DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#374151"}`, borderRadius:3, fontSize:"0.65rem", color:DIFF_COLOR[normalizeMissionDifficulty(q.difficulty)]||"#6b7280" }}>{missionDifficultyLabel(q.difficulty)}</span>
                        {done&&<span style={{ fontSize:"0.7rem", color:"#22c55e" }}>✓ Completata</span>}
                      </div>
                      <p style={{ color:"#94a3b8", fontSize:"0.82rem", margin:"0 0 6px" }}>{q.desc}</p>
                      {q.flavor&&<p style={{ color:"#94a3b8", fontSize:"0.78rem", fontStyle:"italic", margin:"0 0 8px" }}>{q.flavor}</p>}
                      <div style={{ display:"flex", gap:14, fontSize:"0.73rem", color:"#94a3b8" }}>
                        <span>⭐ {q.xpReward} XP</span><span>💰 {q.goldReward} oro</span><span>🎭 {q.steps.length} scene</span>
                      </div>
                    </div>
                    {!done&&!qs?.active&&<BigBtn onClick={()=>acceptQuest(q)} gold icon="⭐">Accetta</BigBtn>}
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop:16, marginBottom:12, padding:"0.75rem", background:"rgba(88,28,135,0.16)", border:"1px solid rgba(124,58,237,0.42)", borderRadius:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                <span style={{ color:"#c4b5fd", fontSize:"0.76rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.04em" }}>Missioni speciali</span>
                <span style={{ color:"#6b7280", fontSize:"0.71rem" }}>{unlockedSpecialQuests.length} sbloccate</span>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <input
                  style={{...inputStyle, flex:"1 1 220px"}}
                  value={specialPasswordInput}
                  onChange={e=>{ setSpecialPasswordInput(e.target.value); setSpecialQuestError(""); }}
                  onKeyDown={e=>e.key==="Enter"&&unlockSpecialQuest()}
                  placeholder="Inserisci password data dal Master"
                />
                <BigBtn onClick={unlockSpecialQuest} gold icon="🔓" disabled={!specialPasswordInput.trim()}>Sblocca</BigBtn>
              </div>
              {specialQuestError && <div style={{ color:specialQuestError.startsWith("Missione")?"#86efac":"#fca5a5", fontSize:"0.78rem", marginTop:8 }}>{specialQuestError}</div>}
            </div>
            {unlockedSpecialQuests.map(q=>{
              const done=(qs?.completed||[]).includes(q.id);
              return (
                <div key={q.id} style={{ background:"rgba(88,28,135,0.16)", border:`1px solid ${done?PANEL_BORDER:"#7c3aed"}`, borderRadius:6, padding:"1rem", marginBottom:8, opacity:done?0.6:1 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                        <span style={{ fontFamily:"'Cinzel',serif", color:done?"#4b5563":"#c4b5fd", fontWeight:700 }}>{q.title}</span>
                        <span style={{ padding:"1px 7px", border:"1px solid #7c3aed", borderRadius:3, fontSize:"0.65rem", color:"#c4b5fd" }}>Speciale</span>
                        {done&&<span style={{ fontSize:"0.7rem", color:"#22c55e" }}>Completata</span>}
                      </div>
                      <p style={{ color:"#94a3b8", fontSize:"0.82rem", margin:"0 0 6px" }}>{q.desc}</p>
                      {q.flavor&&<p style={{ color:"#94a3b8", fontSize:"0.78rem", fontStyle:"italic", margin:"0 0 8px" }}>{q.flavor}</p>}
                      <div style={{ display:"flex", gap:14, fontSize:"0.73rem", color:"#94a3b8" }}>
                        <span>{q.xpReward} XP</span><span>{q.goldReward} oro</span><span>{q.steps.length} scene</span>
                      </div>
                    </div>
                    {!done&&!qs?.active&&<BigBtn onClick={()=>acceptQuest(q)} gold icon="⭐">Accetta</BigBtn>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="combat" && (
          <div style={{ flex:1, overflowY:"auto", padding:combatMode?"1.35rem":"1rem", background:"linear-gradient(180deg, rgba(20,10,10,0.18) 0%, rgba(3,7,18,0.24) 100%)" }}>
            {!combat?.active ? (
              <div style={{ textAlign:"center", padding:"3rem", color:"#64748b" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔒</div>
                <p>Nessuna battaglia in corso.</p>
                <p style={{ fontSize:"0.8rem" }}>Accetta una missione e usa il tab Missioni per iniziare il combattimento.</p>
              </div>
            ) : (
              <div style={{ maxWidth:1460, margin:"0 auto" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:"1rem", padding:"1rem 1.1rem", background:"linear-gradient(135deg, rgba(40,12,12,0.92), rgba(12,16,28,0.94))", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, boxShadow:"0 18px 40px rgba(0,0,0,0.24)" }}>
                  <div>
                    <h3 style={{ fontFamily:"'Cinzel Decorative',serif", color:"#fca5a5", margin:"0 0 0.35rem", fontSize:"1.5rem", letterSpacing:"0.04em" }}>⚔️ Battaglia</h3>
                    <div style={{ color:"#cbd5e1", fontSize:"0.9rem" }}>Round {combat.round} • {combat.combatants.length} partecipanti • il destino si decide ora</div>
                  </div>
                  {myTurn&&<span style={{ padding:"0.45rem 0.95rem", background:"rgba(239,68,68,0.24)", border:"1px solid #ef4444", borderRadius:999, color:"#fee2e2", fontSize:"0.84rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.06em" }}>{myDeathTurn?"🕯️ SALVEZZA":"⚔️ TUO TURNO"}</span>}
                </div>

                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1.7fr) minmax(320px,0.95fr)", gap:"1rem", alignItems:"start" }}>
                  <div>
                    <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(250px,1fr))", gap:12, marginBottom:"1rem" }}>
                  {combat.combatants.map((c,i)=>{
                    const isActive = i===combat.turn%combat.combatants.length;
                    return (
                      <div key={c.id||i} style={{ background:isActive?"linear-gradient(135deg, rgba(127,29,29,0.34), rgba(15,23,42,0.9))":"rgba(15,23,42,0.82)", border:`2px solid ${isActive?"#ef4444":c.isPlayer?"#6d28d9":"#7f1d1d"}`, borderRadius:12, padding:"0.95rem", opacity:c.hp<=0?0.45:1, boxShadow:isActive?"0 16px 36px rgba(127,29,29,0.24)":"0 12px 30px rgba(0,0,0,0.16)" }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                          <ArtThumb src={c.isPlayer ? getPlayerPortrait(c) : getMonsterImage(c)} alt={c.name} size={70} radius={16} />
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Cinzel',serif", color:c.isPlayer?"#ddd6fe":"#fecaca", fontSize:"0.98rem", fontWeight:700, marginBottom:2 }}>{c.name}{c.isBoss?" ⭐":""}</div>
                            <div style={{ fontSize:"0.75rem", color:"#94a3b8" }}>Iniziativa: {c.rollInit}</div>
                          </div>
                          {isActive&&<span style={{ fontSize:"0.7rem", padding:"0.22rem 0.45rem", background:"#7f1d1d", borderRadius:999, color:"#fca5a5", fontFamily:"'Cinzel',serif" }}>ATTIVO</span>}
                        </div>
                        {(c.dying || c.stable || c.dead) && (
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8, fontSize:"0.68rem" }}>
                            {c.dying && <span style={{ padding:"2px 6px", borderRadius:999, background:"rgba(127,29,29,0.35)", border:"1px solid #ef4444", color:"#fecaca" }}>🕯️ Morente</span>}
                            {c.stable && <span style={{ padding:"2px 6px", borderRadius:999, background:"rgba(30,41,59,0.5)", border:"1px solid #64748b", color:"#cbd5e1" }}>😵 Stabile</span>}
                            {c.dead && <span style={{ padding:"2px 6px", borderRadius:999, background:"rgba(24,24,27,0.7)", border:"1px solid #71717a", color:"#e4e4e7" }}>☠️ Morto</span>}
                            {(c.dying || c.stable) && <span style={{ color:"#fecaca" }}>{c.deathSuccesses || 0}/3 ✓ • {c.deathFailures || 0}/3 ✗</span>}
                          </div>
                        )}
                        <HpBar cur={c.hp} max={c.maxHp} red={!c.isPlayer} />
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:"0.74rem" }}>
                          <span style={{ color:c.isPlayer?"#c4b5fd":"#fca5a5" }}>{c.isPlayer?"Alleato":"Nemico"}</span>
                          <span style={{ color:"#e2e8f0", fontWeight:700 }}>{c.hp}/{c.maxHp} HP</span>
                        </div>
                      </div>
                    );
                  })}
                    </div>
                  </div>

                  <div style={{ display:"grid", gap:"1rem", position: isMobile ? "relative" : "sticky", top:0, order: isMobile ? -1 : 0 }}>
                    {combat.pendingLog && (
                      <div style={{ padding:"1.1rem 1.2rem", background:"linear-gradient(180deg,rgba(10,20,10,0.97),rgba(15,23,42,0.97))", border:"1px solid rgba(34,197,94,0.35)", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
                        <div style={{ fontSize:"0.82rem", color:"#a3e8b0", lineHeight:1.75, whiteSpace:"pre-line", marginBottom:"1rem", fontFamily:"'Crimson Pro',Georgia,serif" }} dangerouslySetInnerHTML={{ __html: fmt(combat.pendingLog) }} />
                        <button onClick={dismissCombatLog} style={{ width:"100%", padding:"0.85rem 1.2rem", background:"linear-gradient(135deg,#14532d,#16a34a)", border:"2px solid #22c55e", borderRadius:10, color:"#dcfce7", fontFamily:"'Cinzel Decorative',serif", fontSize:"1rem", cursor:"pointer", letterSpacing:"0.08em" }}>
                          Prossimo turno
                        </button>
                      </div>
                    )}
                    <div style={{ textAlign:"center", padding:"1.35rem 1.1rem", background:"linear-gradient(180deg, rgba(24,10,10,0.92), rgba(15,23,42,0.94))", border:"1px solid rgba(239,68,68,0.26)", borderRadius:12, boxShadow:"0 18px 40px rgba(0,0,0,0.22)" }}>
                      {combat.pendingLog ? null : myTurn ? (
                        <>
                          <p style={{ color:"#fecaca", fontFamily:"'Cinzel Decorative',serif", marginBottom:"1rem", fontSize:"1.08rem", letterSpacing:"0.04em" }}>{myDeathTurn ? "🕯️ Sei a terra: tira la tua salvezza contro la morte." : "⚔️ Il campo si apre davanti a te."}</p>
                          {myDeathTurn ? (
                            <div style={{ display:"grid", gap:10, justifyItems:"center" }}>
                              <div style={{ color:"#fecaca", fontSize:"0.95rem" }}>Successi: {activeCombatant?.deathSuccesses || 0}/3 • Fallimenti: {activeCombatant?.deathFailures || 0}/3</div>
                              <button onClick={doAttack} style={{ width:"100%", maxWidth:340, padding:"1rem 1.4rem", background:"linear-gradient(135deg,#7f1d1d,#b91c1c)", border:"2px solid #ef4444", borderRadius:10, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.06rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 14px 28px rgba(127,29,29,0.24)" }}>
                                <span className={diceAnim?"dice-spin":""} style={{ display:"inline-block", marginRight:8 }}>🎲</span>
                                TIRO SALVEZZA
                              </button>
                            </div>
                          ) : spellMenu ? (
                            <div style={{ display:"grid", gap:8, justifyItems:"center" }}>
                              <div style={{ fontSize:"0.92rem", color:"#fbbf24", fontWeight:700 }}>Scegli un incantesimo</div>
                              {(() => {
                                const liveEnemies = combat.combatants.filter(c=>!c.isPlayer&&c.hp>0);
                                if(liveEnemies.length <= 1) return null;
                                return (
                                  <div style={{ width:"100%", marginBottom:4 }}>
                                    <div style={{ fontSize:"0.7rem", color:"#fca5a5", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>🎯 Bersaglio</div>
                                    <div style={{ display:"grid", gap:5 }}>
                                      {liveEnemies.map(e=>{
                                        const isSel = selectedTarget===e.id;
                                        return (
                                          <button key={e.id} onClick={()=>setSelectedTarget(isSel?null:e.id)}
                                            style={{ display:"flex", alignItems:"center", gap:7, padding:"0.45rem 0.6rem", background:isSel?"rgba(239,68,68,0.25)":"rgba(127,29,29,0.18)", border:`2px solid ${isSel?"#ef4444":"#7f1d1d"}`, borderRadius:7, cursor:"pointer", textAlign:"left" }}>
                                            <span style={{ fontSize:"1rem" }}>{e.emoji}</span>
                                            <div style={{ flex:1, minWidth:0 }}>
                                              <div style={{ fontSize:"0.78rem", color:isSel?"#fee2e2":"#fca5a5", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.name}</div>
                                              <div style={{ fontSize:"0.65rem", color:"#94a3b8" }}>{e.hp}/{e.maxHp} HP</div>
                                            </div>
                                            {isSel && <span style={{ fontSize:"0.68rem", color:"#ef4444" }}>✓</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}
                              {spellLevels.map(lvl=>{
                                const spells = spellsByLevel[lvl] || [];
                                if(!spells.length) return null;
                                return (
                                  <div key={lvl} style={{ width:"100%" }}>
                                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"0.7rem 0 0.35rem", fontSize:"0.88rem", color:"#c4b5fd", fontWeight:600 }}>
                                      <span>{lvl===0 ? "Trucchetti" : `Livello ${lvl}`}</span>
                                      <span style={{ fontSize:"0.78rem", color:"#cbd5e1" }}>{lvl===0 ? "gratis" : `${spellSlots[lvl]} slot`}</span>
                                    </div>
                                    {spells.map(spell=> (
                                      <button key={spell.id} onClick={()=>castSpell(spell)} style={{ width:"100%", padding:"0.95rem 1rem", background:"rgba(99,102,241,0.15)", border:"1px solid #4338ca", borderRadius:10, color:"#e0d7ff", cursor:"pointer", fontFamily:"inherit", textAlign:"left", marginBottom:8 }}>
                                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                                          <span style={{ fontWeight:700, fontSize:"0.9rem" }}>{spell.emoji||"✨"} {spell.name}</span>
                                          <span style={{ fontSize:"0.74rem", color:"#cbd5e1" }}>{spell.slots===0 ? "Gratis" : `Slot ${spell.slots||0}`}</span>
                                        </div>
                                        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:5 }}>
                                          {spellEffectSummary(spell).map(detail => (
                                            <span key={detail} style={{ fontSize:"0.7rem", color:"#cbd5e1", background:"rgba(255,255,255,0.05)", border:"1px solid #334155", borderRadius:999, padding:"2px 7px" }}>
                                              {detail}
                                            </span>
                                          ))}
                                        </div>
                                        <div style={{ fontSize:"0.76rem", color:"#cbd5e1", marginTop:4, lineHeight:1.45 }}>{spell.desc}</div>
                                      </button>
                                    ))}
                                  </div>
                                );
                              })}
                              <SmallBtn onClick={()=>setSpellMenu(false)}>← Indietro</SmallBtn>
                            </div>
                          ) : (
                            <>
                              {/* Selezione bersaglio */}
                              {(() => {
                                const liveEnemies = combat.combatants.filter(c=>!c.isPlayer&&c.hp>0);
                                if(liveEnemies.length <= 1) return null;
                                return (
                                  <div style={{ marginBottom:10 }}>
                                    <div style={{ fontSize:"0.72rem", color:"#fca5a5", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, fontFamily:"'Cinzel',serif" }}>🎯 Scegli bersaglio</div>
                                    <div style={{ display:"grid", gap:6 }}>
                                      {liveEnemies.map(e=>{
                                        const isSel = selectedTarget===e.id;
                                        return (
                                          <button key={e.id} onClick={()=>setSelectedTarget(isSel?null:e.id)}
                                            style={{ display:"flex", alignItems:"center", gap:8, padding:"0.55rem 0.75rem", background:isSel?"rgba(239,68,68,0.25)":"rgba(127,29,29,0.18)", border:`2px solid ${isSel?"#ef4444":"#7f1d1d"}`, borderRadius:8, cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
                                            <ArtThumb src={getMonsterImage(e)} alt={e.name} size={36} radius={6} />
                                            <div style={{ flex:1, minWidth:0 }}>
                                              <div style={{ fontSize:"0.82rem", color:isSel?"#fee2e2":"#fca5a5", fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.emoji} {e.name}</div>
                                              <div style={{ fontSize:"0.68rem", color:"#94a3b8" }}>{e.hp}/{e.maxHp} HP</div>
                                            </div>
                                            {isSel && <span style={{ fontSize:"0.72rem", color:"#ef4444", fontFamily:"'Cinzel',serif", flexShrink:0 }}>✓ SEL.</span>}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    {!selectedTarget && <div style={{ fontSize:"0.68rem", color:"#64748b", marginTop:4 }}>Nessun bersaglio — attacchi il primo nemico.</div>}
                                  </div>
                                );
                              })()}
                              <div style={{ display:"grid", gap:10 }}>
                                <button onClick={doAttack} style={{ width:"100%", padding:"1rem 1.4rem", background:"linear-gradient(135deg,#7f1d1d,#dc2626)", border:"2px solid #ef4444", borderRadius:10, color:"#fee2e2", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.1rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 14px 28px rgba(127,29,29,0.24)" }}>
                                  <span className={diceAnim?"dice-spin":""} style={{ display:"inline-block", marginRight:8 }}>🎲</span>
                                  {selectedTarget ? `ATTACCA ${combat.combatants.find(c=>c.id===selectedTarget)?.name||""}` : "ATTACCA"}
                                </button>
                                {isCaster && (
                                  <button onClick={()=>setSpellMenu(true)} disabled={!availableSpells.length} style={{ width:"100%", padding:"1rem 1.4rem", background:availableSpells.length?"linear-gradient(135deg,#551a8b,#7c3aed)":"rgba(75,43,105,0.35)", border:"2px solid #7c3aed", borderRadius:10, color:"#e0d7ff", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.04rem", cursor:availableSpells.length?"pointer":"not-allowed", letterSpacing:"0.08em" }}>
                                    🔮 Magia {totalSlots(spellSlots)>0?`(${totalSlots(spellSlots)})`:"(solo trucchetti)"}
                                  </button>
                                )}
                              </div>
                              <p style={{ color:"#cbd5e1", fontSize:"0.8rem", marginTop:"0.85rem", lineHeight:1.55 }}>Prima tiri per colpire. Se l'attacco supera la CA del bersaglio, il sistema mostra e applica il dado danno dell'arma o dell'incantesimo.</p>
                            </>
                          )}
                        </>
                      ) : isLeaderForMonsterTurn ? (
                        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", alignItems:"center" }}>
                          <p style={{ color:"#fca5a5", fontFamily:"'Cinzel Decorative',serif", fontSize:"1rem", letterSpacing:"0.04em", margin:0 }}>
                            ⚔️ Turno di <strong>{activeCombatant?.name}</strong>
                          </p>
                          <button onClick={() => doMonsterTurnRef.current?.()} style={{ width:"100%", maxWidth:340, padding:"1rem 1.4rem", background:"linear-gradient(135deg,#431407,#9a3412)", border:"2px solid #ea580c", borderRadius:10, color:"#ffedd5", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.06rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 14px 28px rgba(127,29,29,0.24)" }}>
                            Avanti → (il nemico attacca)
                          </button>
                        </div>
                      ) : (
                        <div style={{ color:"#94a3b8", fontSize:"0.9rem", lineHeight:1.6, textAlign:"center" }}>
                          Turno di <strong style={{ color:"#f8fafc" }}>{activeCombatant?.name}</strong>...
                        </div>
                      )}
                      {!combat.pendingLog && (
                        <button onClick={forceNextCombatTurn} style={{ width:"100%", maxWidth:340, marginTop:"1rem", padding:"0.82rem 1rem", background:"rgba(30,41,59,0.78)", border:"1px solid rgba(148,163,184,0.36)", borderRadius:9, color:"#e2e8f0", fontFamily:"'Cinzel',serif", fontSize:"0.9rem", cursor:"pointer", letterSpacing:"0.06em" }}>
                          Prossimo turno
                        </button>
                      )}
                    </div>

                    <div style={{ background:"rgba(8,14,28,0.9)", border:"1px solid rgba(148,163,184,0.16)", borderRadius:12, padding:"1rem", boxShadow:"0 16px 34px rgba(0,0,0,0.18)" }}>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"0.78rem", color:"#cbd5e1", marginBottom:8, letterSpacing:"0.08em" }}>LOG DI BATTAGLIA</div>
                      <div style={{ maxHeight:360, overflowY:"auto" }}>
                    {messages.filter(m=>m.type==="combat").map(m=>(
                      <div key={m.id} style={{ padding:"0.75rem 0.85rem", background:"rgba(127,29,29,0.16)", border:"1px solid #7f1d1d", borderRadius:8, marginBottom:8, fontSize:"0.84rem", color:"#fecaca", lineHeight:1.6 }}
                        dangerouslySetInnerHTML={{ __html:fmt(m.content) }} />
                    ))}
                        <div ref={combatLogEndRef} />
                      </div>
                    </div>

                    <div style={{ padding:"0.75rem 1rem", background:"rgba(20,5,5,0.7)", border:"1px solid rgba(127,29,29,0.3)", borderRadius:10, display:"flex", flexDirection:"column", gap:6, alignItems:"center" }}>
                      <button onClick={abandonQuest} style={{ width:"100%", padding:"0.6rem 1rem", background:"rgba(127,29,29,0.18)", border:"1px solid rgba(127,29,29,0.5)", borderRadius:8, color:"#f87171", fontFamily:"'Cinzel',serif", fontSize:"0.78rem", cursor:"pointer", letterSpacing:"0.05em" }}>
                        🏃 Abbandona Quest
                      </button>
                      <span style={{ fontSize:"0.68rem", color:"#94a3b8" }}>Richiede una 💨 Pozione di Fuga ({inventoryCounts["potion_escape"]||0} in inventario)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <DiceRoller ref={diceRef} />

      {/* ── Victory Screen Overlay ── */}
      {victoryScreen && (() => {
        const vd = victoryScreen;
        const myResult = vd.playerResults?.find(r => r.id === myId);
        const xpBefore = myResult?.beforeXp ?? 0;
        const xpAfter  = myResult?.afterXp  ?? 0;
        const lvBefore = myResult?.beforeLevel ?? 1;
        const lvAfter  = myResult?.afterLevel  ?? lvBefore;
        const threshold = myResult?.xpThreshold ?? xpForLevel(lvBefore);
        const leveledUp = myResult?.leveledUpTo?.length > 0;
        const barPct = Math.min(100, Math.round((xpBefore / threshold) * 100));
        const barPctAfter = Math.min(100, Math.round((xpAfter / xpForLevel(lvAfter)) * 100));
        return (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:10050, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
            <div style={{ background:"linear-gradient(180deg,#0d1b0d,#0a1628)", border:"2px solid #fbbf24", borderRadius:18, padding:"2rem 2.2rem", maxWidth:520, width:"100%", boxShadow:"0 0 60px rgba(251,191,36,0.25), 0 24px 48px rgba(0,0,0,0.6)", textAlign:"center", maxHeight:"90vh", overflowY:"auto" }}>

              {/* Header */}
              <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:"clamp(1.6rem,5vw,2.4rem)", background:"linear-gradient(135deg,#fbbf24,#f59e0b,#b45309)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.08em", marginBottom:"0.3rem" }}>⚔ VITTORIA! ⚔</div>
              <div style={{ color:"#86efac", fontSize:"0.82rem", fontFamily:"'Cinzel',serif", letterSpacing:"0.15em", marginBottom:"1.5rem" }}>BATTAGLIA VINTA</div>

              {/* Slain monsters */}
              {vd.slain?.length > 0 && (
                <div style={{ background:"rgba(0,0,0,0.35)", border:"1px solid rgba(127,29,29,0.4)", borderRadius:10, padding:"0.9rem 1rem", marginBottom:"1.2rem", textAlign:"left" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#f87171", fontSize:"0.72rem", letterSpacing:"0.12em", marginBottom:"0.6rem" }}>NEMICI SCONFITTI</div>
                  {vd.slain.map((m, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", color:"#fecaca", fontSize:"0.85rem", padding:"2px 0" }}>
                      <span>{m.emoji} {m.name}</span>
                      <span style={{ color:"#fbbf24" }}>+{m.xp} XP</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Loot summary */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"1.4rem" }}>
                <div style={{ background:"rgba(91,33,182,0.25)", border:"1px solid rgba(139,92,246,0.35)", borderRadius:10, padding:"0.8rem" }}>
                  <div style={{ fontSize:"1.4rem", marginBottom:4 }}>⭐</div>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#c4b5fd", fontSize:"0.7rem", letterSpacing:"0.1em" }}>XP GUADAGNATA</div>
                  <div style={{ color:"#e9d5ff", fontSize:"1.4rem", fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>+{vd.xpEach}</div>
                </div>
                <div style={{ background:"rgba(161,120,0,0.2)", border:"1px solid rgba(251,191,36,0.35)", borderRadius:10, padding:"0.8rem" }}>
                  <div style={{ fontSize:"1.4rem", marginBottom:4 }}>💰</div>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#fcd34d", fontSize:"0.7rem", letterSpacing:"0.1em" }}>ORO GUADAGNATO</div>
                  <div style={{ color:"#fde68a", fontSize:"1.4rem", fontWeight:700, fontFamily:"'Cinzel Decorative',serif" }}>+{vd.goldEach}</div>
                </div>
              </div>

              {/* XP Progress bar for this player */}
              {myResult && (
                <div style={{ background:"rgba(0,0,0,0.35)", border:"1px solid rgba(148,163,184,0.18)", borderRadius:10, padding:"1rem", marginBottom:"1.2rem", textAlign:"left" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#94a3b8", fontSize:"0.72rem", letterSpacing:"0.12em", marginBottom:"0.7rem" }}>AVANZAMENTO ESPERIENZA</div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.78rem", color:"#cbd5e1", marginBottom:6 }}>
                    <span>Lv. {lvBefore}</span>
                    <span style={{ color:"#fbbf24" }}>{xpBefore} → {xpAfter} / {xpForLevel(lvAfter)} XP</span>
                    <span>Lv. {lvAfter}</span>
                  </div>
                  {/* Before bar (grey) */}
                  <div style={{ position:"relative", height:14, background:"rgba(255,255,255,0.08)", borderRadius:999, overflow:"hidden", marginBottom:4 }}>
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${barPct}%`, background:"rgba(148,163,184,0.4)", borderRadius:999, transition:"width 0.6s ease" }} />
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${barPctAfter}%`, background:"linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)", borderRadius:999, transition:"width 0.8s ease 0.3s", boxShadow:"0 0 8px rgba(168,85,247,0.6)" }} />
                  </div>
                  <div style={{ fontSize:"0.7rem", color:"#6b7280", textAlign:"right" }}>{xpAfter} / {xpForLevel(lvAfter)} XP per Lv. {lvAfter + 1}</div>
                  {leveledUp && (
                    <div style={{ marginTop:"0.7rem", padding:"0.5rem 0.8rem", background:"linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.15))", border:"1px solid #fbbf24", borderRadius:8, color:"#fde68a", fontFamily:"'Cinzel Decorative',serif", fontSize:"0.92rem", textAlign:"center", letterSpacing:"0.06em" }}>
                      ⬆️ LIVELLO {lvAfter}! Sei più forte ora.
                    </div>
                  )}
                </div>
              )}

              {/* Party members summary (if multiplayer) */}
              {vd.playerResults?.length > 1 && (
                <div style={{ marginBottom:"1.2rem", textAlign:"left" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", color:"#94a3b8", fontSize:"0.72rem", letterSpacing:"0.12em", marginBottom:"0.5rem" }}>PARTY</div>
                  {vd.playerResults.map(r => (
                    <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", color:"#cbd5e1", fontSize:"0.82rem", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span>{r.id === myId ? "⭐ " : ""}{r.name}</span>
                      <span style={{ color:"#a78bfa", fontSize:"0.76rem" }}>Lv.{r.afterLevel}{r.leveledUpTo?.length > 0 ? " ⬆️" : ""}</span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setVictoryScreen(null)} style={{ width:"100%", padding:"1rem 1.4rem", background:"linear-gradient(135deg,#14532d,#16a34a)", border:"2px solid #22c55e", borderRadius:12, color:"#dcfce7", fontFamily:"'Cinzel Decorative',serif", fontSize:"1.05rem", cursor:"pointer", letterSpacing:"0.08em", boxShadow:"0 8px 20px rgba(34,197,94,0.2)" }}>
                Continua →
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ----------------------------------------------
   COMPONENTS
---------------------------------------------- */
function HpBar({ cur, max, red }) {
  const pct = Math.min(100, Math.max(0, (cur||0)/(max||1)*100));
  const color = red ? "#ef4444" : pct>60?"#22c55e":pct>30?"#f59e0b":"#ef4444";
  return (
    <div style={{ height:5, background:"#0f172a", borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:"100%", background:color, width:`${pct}%`, transition:"width .4s" }} />
    </div>
  );
}
function BigBtn({ children, onClick, gold, dark, icon, disabled }) {
  const base = { padding:"0.6rem 1.2rem", borderRadius:5, cursor:disabled?"not-allowed":"pointer", fontFamily:"'Cinzel',serif", fontSize:"0.82rem", letterSpacing:"0.06em", border:"none", opacity:disabled?0.45:1, display:"inline-flex", alignItems:"center", gap:6, fontWeight:700, textShadow:"0 1px 2px rgba(0,0,0,0.75)", boxShadow:"0 8px 20px rgba(0,0,0,0.24)" };
  if(gold) return <button onClick={onClick} disabled={disabled} style={{...base,background:"linear-gradient(135deg,#92400e,#d97706)",color:"#fff7ed",border:"1px solid #fbbf24"}}>{icon&&<span>{icon}</span>}{children}</button>;
  if(dark) return <button onClick={onClick} disabled={disabled} style={{...base,background:"#111827",color:"#f8fafc",border:"1px solid #64748b"}}>{icon&&<span>{icon}</span>}{children}</button>;
  return <button onClick={onClick} disabled={disabled} style={{...base,background:"#4c1d95",color:"#ffffff",border:"1px solid #a78bfa"}}>{icon&&<span>{icon}</span>}{children}</button>;
}
function JoinPartyWidget({ myId, currentCode }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const join = async () => {
    const code = input.trim().toUpperCase();
    if(!code || code === currentCode) return;
    setBusy(true);
    try {
      await dbSavePartyState(code, { currentId:null, step:0, active:false, completed:[], combat:null });
      await supabase.from("players").update({ party_code: code, updated_at: new Date().toISOString() }).eq("id", myId);
      setDone(true);
    } catch(e) {
      alert("Errore: " + (e?.message || e));
    } finally { setBusy(false); }
  };

  if(done) return (
    <div style={{ marginTop:8, padding:"6px 8px", background:"rgba(34,197,94,0.08)", border:"1px solid #166534", borderRadius:6, fontSize:"0.7rem", color:"#4ade80" }}>
      Party cambiato! Ricarica la pagina per entrare.
      <button onClick={()=>window.location.reload()} style={{ marginLeft:8, background:"#166534", border:"none", color:"#bbf7d0", padding:"2px 8px", borderRadius:4, cursor:"pointer", fontSize:"0.7rem" }}>Ricarica</button>
    </div>
  );

  return (
    <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:5 }}>
      <input
        value={input}
        onChange={e=>setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8))}
        placeholder="Codice party..."
        style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.3)", border:"1px solid #1f2937", color:"#e2d9c5", padding:"5px 7px", borderRadius:4, fontSize:"0.7rem", fontFamily:"monospace", letterSpacing:"0.1em" }}
      />
      <button disabled={busy || !input.trim()} onClick={join}
        style={{ width:"100%", background:"rgba(99,102,241,0.2)", border:"1px solid #4338ca", color:"#a5b4fc", padding:"5px 0", borderRadius:4, cursor: busy || !input.trim() ? "not-allowed" : "pointer", fontSize:"0.72rem", opacity: !input.trim() ? 0.5 : 1 }}>
        {busy ? "Caricamento…" : "Entra nel Party →"}
      </button>
    </div>
  );
}

function SmallBtn({ children, onClick, red, disabled }) {
  return <button disabled={disabled} onClick={onClick} style={{ padding:"0.42rem 0.78rem", background:red?"#7f1d1d":"#1e293b", border:`1px solid ${red?"#fca5a5":"#94a3b8"}`, borderRadius:4, color:red?"#fff1f2":"#f8fafc", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, fontSize:"0.78rem", fontFamily:"inherit", fontWeight:700, boxShadow:"0 6px 14px rgba(0,0,0,0.22)", textShadow:"0 1px 2px rgba(0,0,0,0.75)" }}>{children}</button>;
}
function Card({ title, children }) {
  return (
    <div style={{ background:PANEL_BG, border:`1px solid ${PANEL_BORDER}`, borderRadius:6, padding:"1rem", marginBottom:"0.8rem", boxShadow:"0 12px 28px rgba(0,0,0,0.22)" }}>
      {title && <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontSize:"0.9rem", marginBottom:"0.8rem" }}>{title}</div>}
      {children}
    </div>
  );
}

const inputStyle = { width:"100%", padding:"0.55rem 0.75rem", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:4, color:"#e2d9c5", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:"0.92rem", display:"block" };
const labelStyle = { display:"block", color:"#64748b", fontSize:"0.63rem", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontFamily:"'Cinzel',serif" };
const backBtnStyle = { padding:"0.35rem 0.8rem", background:"transparent", border:"1px solid #1f2937", borderRadius:4, color:"#94a3b8", cursor:"pointer", fontFamily:"inherit", fontSize:"0.8rem" };
const iconBtnStyle = { padding:"2px 6px", background:"rgba(255,255,255,0.04)", border:"1px solid #1f2937", borderRadius:3, color:"#94a3b8", cursor:"pointer", fontSize:"0.8rem" };
