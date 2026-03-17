import fs from 'fs';

let content = fs.readFileSync('c:\\Users\\roppo\\echoesofzodar\\echoesofzodar\\src\\App.jsx', 'utf8').replace(/\r\n/g, '\n');

// 1. ResolveDeathSave
content = content.replace(
  /function resolveDeathSave\(combatant\) \{\n\s+const rollValue = roll\(20\);/m,
  "function resolveDeathSave(combatant, forcedRoll) {\n  const rollValue = forcedRoll ?? roll(20);"
);

// 2. update DiceVisual logic
const newVisualLogic = `  const diceRef = useRef(null);

  async function showDiceVisual({ sides, notation, label, themeColor="#ef4444" }) {
    if (diceRef.current) {
      setDiceResult({ stage:"rolling", label, value:null });
      const total = await diceRef.current.roll(notation || \`1d\${sides}\`, themeColor);
      setDiceResult({ stage:"result", label, value: total });
      await new Promise(r => setTimeout(r, 1200));
      setDiceResult(null);
      return total !== null ? total : parseDice(notation || \`1d\${sides}\`);
    } else {
      const val = parseDice(notation || \`1d\${sides}\`);
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
      damageRoll = await showDiceVisual({ sides:getPrimaryDieSides(weaponDie,6), notation:weaponDie||"1d6", label:\`Danno \${weaponDie||"1d6"}\`, themeColor });
    }
    
    const damage = hit ? damageRoll + (isCrit ? damageRoll : 0) : 0;
    return { hitRoll, isCrit, attackBonus, attackTotal, targetCa, hit, damageRoll, damage, weaponDie: weaponDie || "1d6" };
  }`;

content = content.replace(
  /async function showDiceVisual[\s\S]*?async function triggerSoloDeath/,
  newVisualLogic + '\n  async function triggerSoloDeath'
);

// 3. useEffect auto-attack
content = content.replace(
  /const weaponDie = getCombatDamageDie\(actor\);\n\s+const resolved = resolveWeaponAttack\(actor, pt, weaponDie\);\n\s+const edmg = resolved\.damage;\n\s+const updPt = \{ \.\.\.pt, hp: Math\.max\(0, pt\.hp - edmg\) \};\n\s+const playerCombatantIdx = latestCombatants\.findIndex\(c => c\.id === pt\.id\);\n\s+if\(playerCombatantIdx >= 0\) \{\n\s+latestCombatants\[playerCombatantIdx\] = applyCombatDamageState\(\{\n\s+\.\.\.latestCombatants\[playerCombatantIdx\],\n\s+maxHp: updPt\.maxHp,\n\s+\}, edmg\);\n\s+\}\n\s+await dbSavePlayer\(updPt\);\n\s+if \(updPt\.id === myId\) setMeRaw\(updPt\);\n\s+await showDiceVisual\(\{ sides:20, value:resolved\.hitRoll, label:"Tiro per colpire" \}\);\n\s+if\(resolved\.hit\) \{\n\s+await showDiceVisual\(\{ sides:getPrimaryDieSides\(resolved\.weaponDie, 6\), value:resolved\.damageRoll, label:\`Danno \$\{resolved\.weaponDie\}\` \}\);\n\s+\}/,
  `const weaponDie = getCombatDamageDie(actor);
      const resolved = await performAsyncAttack(actor, pt, weaponDie);
      const edmg = resolved.damage;
      const updPt = { ...pt, hp: Math.max(0, pt.hp - edmg) };
      const playerCombatantIdx = latestCombatants.findIndex(c => c.id === pt.id);
      if(playerCombatantIdx >= 0) {
        latestCombatants[playerCombatantIdx] = applyCombatDamageState({
          ...latestCombatants[playerCombatantIdx],
          maxHp: updPt.maxHp,
        }, edmg);
      }
      await dbSavePlayer(updPt);
      if (updPt.id === myId) setMeRaw(updPt);`
);

// 4. doAttack dying branch
content = content.replace(
  /const deathSave = resolveDeathSave\(attacker\);\n\s+const idx = combatants\.findIndex\(c => c\.id === attacker\.id\);\n\s+combatants\[idx\] = deathSave\.nextCombatant;\n\s+await showDiceVisual\(\{ sides:20, value:deathSave\.rollValue, label:"Salvezza contro la morte" \}\);/,
  `const deathSaveRoll = await showDiceVisual({ sides:20, notation:"1d20", label:"Salvezza contro la morte", themeColor:"#fbbf24" });
      const deathSave = resolveDeathSave(attacker, deathSaveRoll);
      const idx = combatants.findIndex(c => c.id === attacker.id);
      combatants[idx] = deathSave.nextCombatant;`
);

// 5. doAttack main
content = content.replace(
  /const resolved = resolveWeaponAttack\(attacker, target, weapon\.weapon_die \|\| "1d6"\);\n\s+const dmg = resolved\.damage;\n\s+const tidx = combatants\.findIndex\(c=>c\.id===target\.id\);\n\s+combatants\[tidx\] = \{\.\.\.target, hp:Math\.max\(0,target\.hp-dmg\)\};\n\n\s+await showDiceVisual\(\{ sides:20, value:resolved\.hitRoll, label:"Tiro per colpire" \}\);\n\s+if\(resolved\.hit\) \{\n\s+await showDiceVisual\(\{ sides:getPrimaryDieSides\(resolved\.weaponDie, 6\), value:resolved\.damageRoll, label:\`Danno \$\{resolved\.weaponDie\}\` \}\);\n\s+\}/,
  `const resolved = await performAsyncAttack(attacker, target, weapon.weapon_die || "1d6");
    const dmg = resolved.damage;
    const tidx = combatants.findIndex(c=>c.id===target.id);
    combatants[tidx] = {...target, hp:Math.max(0,target.hp-dmg)};`
);

// 6. castSpell magic damage
content = content.replace(
  /const base = rollDice\(spell\.dmg\);\n\s+await showDiceVisual\(\{ sides:getPrimaryDieSides\(spell\.dmg, 6\), value:base, label:\`Danno \$\{spell\.dmg\}\` \}\);/,
  `const base = await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), notation:spell.dmg, label:\`Danno \${spell.dmg}\`, themeColor:"#a855f7" });`
);

// 7. castSpell magic heal
content = content.replace(
  /const baseHeal = rollDice\(spell\.dmg\);\n\s+await showDiceVisual\(\{ sides:getPrimaryDieSides\(spell\.dmg, 6\), value:baseHeal, label:\`Cura \$\{spell\.dmg\}\` \}\);/,
  `const baseHeal = await showDiceVisual({ sides:getPrimaryDieSides(spell.dmg, 6), notation:spell.dmg, label:\`Cura \${spell.dmg}\`, themeColor:"#10b981" });`
);

// 8. castSpell monster loop
content = content.replace(
  /const resolved = resolveWeaponAttack\(nextActor, pt, weaponDie\);\n\s+const edmg = resolved\.damage;\n\s+const updPt = \{\.\.\.pt, hp:Math\.max\(0,pt\.hp-edmg\)\};\n\s+const playerCombatantIdx = newCombatants\.findIndex\(c => c\.id === pt\.id\);\n\s+if\(playerCombatantIdx >= 0\) \{\n\s+newCombatants\[playerCombatantIdx\] = applyCombatDamageState\(\{\n\s+\.\.\.newCombatants\[playerCombatantIdx\],\n\s+maxHp: updPt\.maxHp,\n\s+\}, edmg\);\n\s+\}\n\s+await dbSavePlayer\(updPt\);\n\s+if\(pt\.id===myId\) setMeRaw\(updPt\);\n\s+await showDiceVisual\(\{ sides:20, value:resolved\.hitRoll, label:"Tiro per colpire" \}\);\n\s+if\(resolved\.hit\) \{\n\s+await showDiceVisual\(\{ sides:getPrimaryDieSides\(resolved\.weaponDie, 6\), value:resolved\.damageRoll, label:\`Danno \$\{resolved\.weaponDie\}\` \}\);\n\s+\}/,
  `const resolved = await performAsyncAttack(nextActor, pt, weaponDie);
        const edmg = resolved.damage;
        const updPt = {...pt, hp:Math.max(0,pt.hp-edmg)};
        const playerCombatantIdx = newCombatants.findIndex(c => c.id === pt.id);
        if(playerCombatantIdx >= 0) {
          newCombatants[playerCombatantIdx] = applyCombatDamageState({
            ...newCombatants[playerCombatantIdx],
            maxHp: updPt.maxHp,
          }, edmg);
        }
        await dbSavePlayer(updPt);
        if(pt.id===myId) setMeRaw(updPt);`
);

// Last step: Add <DiceRoller /> and audioManager into rendering part of App.jsx, specifically GameScreen.
// And we need to make sure we import DiceRoller. Oh we already did via multi_replace!

content = content.replace(
  /<\!-- 3D Dice --><DiceRoller ref=\{diceRef\} \/>/,
  '' // clean if present
).replace(
  /<div style=\{\{\s*position:"fixed", top:0, left:0, width:"100vw", height:"100vh", overflow:"hidden"/,
  '<DiceRoller ref={diceRef} />\n    <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", overflow:"hidden"'
);

fs.writeFileSync('c:\\Users\\roppo\\echoesofzodar\\echoesofzodar\\src\\App.jsx', content);
console.log("Updated App.jsx successfully.");
