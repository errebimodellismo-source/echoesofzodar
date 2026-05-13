#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# fix_emoji.py - Esegui nella cartella C:\Users\roppo\echoesofzodar
# Comando: python fix_emoji.py

import re

FILE = "src/App.jsx"

# Leggi il file
with open(FILE, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

print(f"File letto: {len(content)} caratteri, {content.count('??')} ?? trovati")

# --- CLASSI ---
replacements = [
    # Classi - cerca il pattern name:"NomeClasse" seguito da emoji:
    ('name:"Barbaro",   emoji:"???"', 'name:"Barbaro",   emoji:"🪓"'),
    ('name:"Barbaro",  emoji:"???"',  'name:"Barbaro",  emoji:"🪓"'),
    ('name:"Barbaro", emoji:"???"',   'name:"Barbaro", emoji:"🪓"'),
    ('name:"Barbaro",   emoji:"??"',  'name:"Barbaro",   emoji:"🪓"'),
    ('name:"Barbaro",  emoji:"??"',   'name:"Barbaro",  emoji:"🪓"'),
    ('name:"Barbaro", emoji:"??"',    'name:"Barbaro", emoji:"🪓"'),

    ('name:"Bardo",     emoji:"??"',  'name:"Bardo",     emoji:"🎵"'),
    ('name:"Bardo",   emoji:"??"',    'name:"Bardo",   emoji:"🎵"'),
    ('name:"Bardo", emoji:"??"',      'name:"Bardo", emoji:"🎵"'),

    ('name:"Chierico",  emoji:"??"',  'name:"Chierico",  emoji:"✨"'),
    ('name:"Chierico", emoji:"??"',   'name:"Chierico", emoji:"✨"'),

    ('name:"Druido",    emoji:"??"',  'name:"Druido",    emoji:"🌿"'),
    ('name:"Druido",  emoji:"??"',    'name:"Druido",  emoji:"🌿"'),
    ('name:"Druido", emoji:"??"',     'name:"Druido", emoji:"🌿"'),

    ('name:"Guerriero", emoji:"???"', 'name:"Guerriero", emoji:"⚔️"'),
    ('name:"Guerriero", emoji:"??"',  'name:"Guerriero", emoji:"⚔️"'),

    ('name:"Monaco",    emoji:"??"',  'name:"Monaco",    emoji:"👊"'),
    ('name:"Monaco",  emoji:"??"',    'name:"Monaco",  emoji:"👊"'),
    ('name:"Monaco", emoji:"??"',     'name:"Monaco", emoji:"👊"'),

    ('name:"Paladino",  emoji:"???"', 'name:"Paladino",  emoji:"🛡️"'),
    ('name:"Paladino",  emoji:"??"',  'name:"Paladino",  emoji:"🛡️"'),
    ('name:"Paladino", emoji:"??"',   'name:"Paladino", emoji:"🛡️"'),

    ('name:"Ranger",    emoji:"???"', 'name:"Ranger",    emoji:"🏹"'),
    ('name:"Ranger",    emoji:"??"',  'name:"Ranger",    emoji:"🏹"'),
    ('name:"Ranger",  emoji:"??"',    'name:"Ranger",  emoji:"🏹"'),
    ('name:"Ranger", emoji:"??"',     'name:"Ranger", emoji:"🏹"'),

    ('name:"Ladro",     emoji:"???"', 'name:"Ladro",     emoji:"🗡️"'),
    ('name:"Ladro",     emoji:"??"',  'name:"Ladro",     emoji:"🗡️"'),
    ('name:"Ladro",   emoji:"??"',    'name:"Ladro",   emoji:"🗡️"'),
    ('name:"Ladro", emoji:"??"',      'name:"Ladro", emoji:"🗡️"'),

    ('name:"Stregone",  emoji:"??"',  'name:"Stregone",  emoji:"🌀"'),
    ('name:"Stregone", emoji:"??"',   'name:"Stregone", emoji:"🌀"'),

    ('name:"Warlock",   emoji:"???"', 'name:"Warlock",   emoji:"🔱"'),
    ('name:"Warlock",   emoji:"??"',  'name:"Warlock",   emoji:"🔱"'),
    ('name:"Warlock",  emoji:"??"',   'name:"Warlock",  emoji:"🔱"'),
    ('name:"Warlock", emoji:"??"',    'name:"Warlock", emoji:"🔱"'),

    ('name:"Mago",      emoji:"??"',  'name:"Mago",      emoji:"🔮"'),
    ('name:"Mago",    emoji:"??"',    'name:"Mago",    emoji:"🔮"'),
    ('name:"Mago", emoji:"??"',       'name:"Mago", emoji:"🔮"'),

    # --- RAZZE ---
    ('name:"Umano",     emoji:"??"',  'name:"Umano",     emoji:"👤"'),
    ('name:"Umano",   emoji:"??"',    'name:"Umano",   emoji:"👤"'),
    ('name:"Umano", emoji:"??"',      'name:"Umano", emoji:"👤"'),

    ('name:"Nano",      emoji:"???"', 'name:"Nano",      emoji:"⛏️"'),
    ('name:"Nano",      emoji:"??"',  'name:"Nano",      emoji:"⛏️"'),
    ('name:"Nano",    emoji:"??"',    'name:"Nano",    emoji:"⛏️"'),
    ('name:"Nano", emoji:"??"',       'name:"Nano", emoji:"⛏️"'),

    ('name:"Elfo",      emoji:"??"',  'name:"Elfo",      emoji:"🧝"'),
    ('name:"Elfo",    emoji:"??"',    'name:"Elfo",    emoji:"🧝"'),
    ('name:"Elfo", emoji:"??"',       'name:"Elfo", emoji:"🧝"'),

    ('name:"Halfling",  emoji:"??"',  'name:"Halfling",  emoji:"🍀"'),
    ('name:"Halfling", emoji:"??"',   'name:"Halfling", emoji:"🍀"'),

    ('name:"Dragonide", emoji:"??"',  'name:"Dragonide", emoji:"🐲"'),

    ('name:"Gnomo",     emoji:"???"', 'name:"Gnomo",     emoji:"🔧"'),
    ('name:"Gnomo",     emoji:"??"',  'name:"Gnomo",     emoji:"🔧"'),
    ('name:"Gnomo",   emoji:"??"',    'name:"Gnomo",   emoji:"🔧"'),
    ('name:"Gnomo", emoji:"??"',      'name:"Gnomo", emoji:"🔧"'),

    ('name:"Mezzelfo",  emoji:"??"',  'name:"Mezzelfo",  emoji:"🌙"'),
    ('name:"Mezzelfo", emoji:"??"',   'name:"Mezzelfo", emoji:"🌙"'),

    ('name:"Mezzorco",  emoji:"??"',  'name:"Mezzorco",  emoji:"💪"'),
    ('name:"Mezzorco", emoji:"??"',   'name:"Mezzorco", emoji:"💪"'),

    ('name:"Tiefling",  emoji:"???"', 'name:"Tiefling",  emoji:"😈"'),
    ('name:"Tiefling",  emoji:"??"',  'name:"Tiefling",  emoji:"😈"'),
    ('name:"Tiefling", emoji:"??"',   'name:"Tiefling", emoji:"😈"'),

    # --- UI GENERALE ---
    ('"?? Echoes of Zodar"',     '"⚔️ Echoes of Zodar"'),
    ('"?? PANNELLO MASTER"',     '"🎲 PANNELLO MASTER"'),
    ('"?? Accesso Master"',      '"🎲 Accesso Master"'),
    ('"?? Mondo"',               '"🌍 Mondo"'),
    ('"?? Missioni"',            '"📜 Missioni"'),
    ('"?? Bestiari"',            '"👾 Bestiari"'),
    ('"?? Party"',               '"🏰 Party"'),
    ('"?? Giocatori"',           '"👥 Giocatori"'),
    ('"?? Market"',              '"🏪 Market"'),
    ('"?? Iscritti"',            '"👤 Iscritti"'),
    ('"?? Chat"',                '"💬 Chat"'),
    ('"?? Negozio"',             '"🛒 Negozio"'),
    ('"?? Battaglia"',           '"⚔️ Battaglia"'),
    ('"?? Magia"',               '"🔮 Magia"'),
    ('"?? Attacca"',             '"⚔️ Attacca"'),
    ('"?? Fuggi"',               '"🏃 Fuggi"'),
    ('"?? Cura"',                '"❤️ Cura"'),
    ('"?? Abbandona Missione"',  '"❌ Abbandona Missione"'),
    ('"?? Reset PG"',            '"🔄 Reset PG"'),
    ('"?? Cura Tutto"',          '"❤️ Cura Tutto"'),
    ('"?? Dai Oro"',             '"💰 Dai Oro"'),
    ('"?? Reset Combattimento"', '"💀 Reset Combattimento"'),
    ('"?? Reset Campagna"',      '"🔄 Reset Campagna"'),
    ('"?? Elimina Party"',       '"🗑️ Elimina Party"'),
    ('"?? Entra"',               '"🎲 Entra"'),
    ('"?? Indietro"',            '"← Indietro"'),
    ('"?? Crea Party"',          '"⚔️ Crea Party"'),
    ('"?? Unisciti"',            '"🤝 Unisciti"'),

    # Backtick template strings con ??
    ('`?? Echoes of Zodar`',     '`⚔️ Echoes of Zodar`'),
    ('`?? BATTAGLIA`',           '`⚔️ BATTAGLIA`'),
    ('`?? ROUND',                '`⚔️ ROUND'),
    ('`?? BATTAGLIA INIZIATA',   '`⚔️ BATTAGLIA INIZIATA'),
    ('`?? Critico',              '`🎲 Critico'),
    ('`?? VITTORIA',             '`🏆 VITTORIA'),
    ('`?? SCONFITTA',            '`💀 SCONFITTA'),
    ('`?? Tiro:',                '`🎲 Tiro:'),
    ('`?? Danno:',               '`⚔️ Danno:'),
    ('`?? Difesa:',              '`🛡️ Difesa:'),
    ('`??',                      '`⚔️'),  # fallback generico nelle backtick
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        count += 1
        print(f"  Sostituito: {old[:50]}")

print(f"\nSostituzioni effettuate: {count}")
print(f"?? rimasti: {content.count('??')}")

# Scrivi il file con UTF-8 senza BOM
with open(FILE, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print(f"\n✅ File salvato in UTF-8!")
print("Ora esegui: git add src/App.jsx && git commit -m 'Fix emoji' && git push")
