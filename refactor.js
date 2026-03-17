import fs from 'fs';

const file = 'c:\\Users\\roppo\\echoesofzodar\\echoesofzodar\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const initialLength = content.length;

const newImports = `import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";
import { CLASSES, RACES } from "./data/characterData";
import { SPELL_SLOTS, SPELLS } from "./data/spellsData";
import { DEFAULT_QUESTS } from "./data/questsData";
import { DEFAULT_MONSTERS } from "./data/monstersData";
import { DEFAULT_ITEMS, DEFAULT_WEAPON } from "./data/itemsData";`;

content = content.replace(/import React[\s\S]*?from "react";\nimport \{ supabase \} from "\.\/supabase";/, newImports);

// Remove CLASSES
content = content.replace(/\/\/ emoji:[^\n]*\nconst CLASSES = \{[\s\S]*?^\};\n/m, '');
content = content.replace(/const CLASSES = \{[\s\S]*?^\};\n/m, '');

// Remove RACES
content = content.replace(/\/\/ emoji:[^\n]*\nconst RACES = \{[\s\S]*?^\};\n/m, '');
content = content.replace(/const RACES = \{[\s\S]*?^\};\n/m, '');

// Remove SPELL_SLOTS
content = content.replace(/const SPELL_SLOTS = \{[\s\S]*?^\};\n/m, '');

// Remove SPELLS
const spellsStart = content.indexOf('const SPELLS = {');
if (spellsStart !== -1) {
    let braceCount = 0;
    let i = spellsStart + 15;
    while(i < content.length) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                // found end of SPELLS
                content = content.substring(0, spellsStart) + content.substring(i + 2); // +2 for };
                break;
            }
        }
        i++;
    }
}

// Remove DEFAULT_QUESTS
content = content.replace(/function DEFAULT_QUESTS\(\) \{[\s\S]*?^\}\n/m, '');
content = content.replace(/const qs = DEFAULT_QUESTS\(\);/g, 'const qs = DEFAULT_QUESTS;');
content = content.replace(/DEFAULT_QUESTS\(\)/g, 'DEFAULT_QUESTS');


// Remove DEFAULT_MONSTERS
content = content.replace(/const DEFAULT_MONSTERS = \[[\s\S]*?^\];\n/m, '');

// Remove buildDefaultItems, DEFAULT_ITEMS, DEFAULT_WEAPON
content = content.replace(/function buildDefaultItems\(\) \{[\s\S]*?^\}\n/m, '');
content = content.replace(/const DEFAULT_ITEMS = buildDefaultItems\(\);\n/m, '');
content = content.replace(/const DEFAULT_WEAPON = \{[\s\S]*?^\};\n/m, '');

// Write to file
fs.writeFileSync(file, content);
console.log(`Refactoring complete. Initial length: ${initialLength}, New length: ${content.length}`);
