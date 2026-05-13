# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

FILE = 'c:/Users/roppo/echoesofzodar/src/App.jsx'
with open(FILE, 'r', encoding='utf-8') as f:
    c = f.read()

before = c.count('??')

# ORDINE IMPORTANTE: pattern più specifici prima
subs = [
    # Divs con solo ?? dentro
    ('>??</div>', '>\U0001F512</div>'),
    # Span dado animato
    ('>??</span>', '>\U0001F3B2</span>'),
    # Boss star - occorrenze varie
    ('" \u2B50"', '" \u2B50"'),  # no-op se già ok
    (' ??":""', ' \u2B50":""'),
    ('"??"', '"\u2B50"'),  # generico "??" tra virgolette -> stella (solo se rimane)
    # DEF shield (??? prima di ??)
    ('???{me.def}', '\U0001F6E1\uFE0F{me.def}'),
    ('???{v.def}', '\U0001F6E1\uFE0F{v.def}'),
    ('???{c.def', '\U0001F6E1\uFE0F{c.def'),
    ('???{p?.def', '\U0001F6E1\uFE0F{p?.def'),
    ('???{m.def', '\U0001F6E1\uFE0F{m.def'),
    ('???{en.def', '\U0001F6E1\uFE0F{en.def'),
    ('???+{it.bonus_def', '\U0001F6E1\uFE0F+{it.bonus_def'),
    ("???{p?.party_code", '\U0001F194{p?.party_code'),
    # Stats HP/ATK/MAG
    ('??{me.hp}', '\u2764\uFE0F{me.hp}'),
    ('??{me.atk}', '\u2694\uFE0F{me.atk}'),
    ('??{me.mag}', '\u2728{me.mag}'),
    ('??{me.gold}', '\U0001F4B0{me.gold}'),
    ('??{p?.hp', '\u2764\uFE0F{p?.hp'),
    ('??{p?.gold', '\U0001F4B0{p?.gold'),
    ('??{p?.atk', '\u2694\uFE0F{p?.atk'),
    ('??{v.hp}', '\u2764\uFE0F{v.hp}'),
    ('??{v.atk}', '\u2694\uFE0F{v.atk}'),
    ('??{v.mag}', '\u2728{v.mag}'),
    ('??{c.hp', '\u2764\uFE0F{c.hp'),
    ('??{c.atk', '\u2694\uFE0F{c.atk'),
    ('??{c.mag', '\u2728{c.mag'),
    ('??{en.hp}', '\u2764\uFE0F{en.hp}'),
    ('??{en.atk}', '\u2694\uFE0F{en.atk}'),
    ('??{m.hp}', '\u2764\uFE0F{m.hp}'),
    ('??{m.atk}', '\u2694\uFE0F{m.atk}'),
    ('??+{it.bonus_atk', '\u2694\uFE0F+{it.bonus_atk'),
    ('??+{it.bonus_mag', '\u2728+{it.bonus_mag'),
    ('??+{it.bonus_hp', '\u2764\uFE0F+{it.bonus_hp'),
    # Gold/price
    ('?? {it.price}', '\U0001F4B0 {it.price}'),
    # XP star (singolo ?)
    ('?XP ', '\u2B50XP '),
    ('?{p?.xp', '\u2B50{p?.xp'),
    ('?{en.xp}xp', '\u2B50{en.xp}xp'),
    ('?{m.xp}xp', '\u2B50{m.xp}xp'),
    ('? {q.xpReward} XP', '\u2B50 {q.xpReward} XP'),
    ('? +${xpE} XP', '\u2B50 +${xpE} XP'),
    # Gold rewards
    ('?? +${goldE} oro', '\U0001F4B0 +${goldE} oro'),
    ('?? {q.goldReward} oro', '\U0001F4B0 {q.goldReward} oro'),
    ('?? Ricompensa:', '\u2B50 Ricompensa:'),
    # Rankings medals
    ('["??","??","??"]', '["🥇","🥈","🥉"]'),
    # Fallback emoji in JSX expressions
    ('emoji||"??"', 'emoji||"\u2694\uFE0F"'),
    # Button icons
    ('icon={saved?"?":"??"', 'icon={saved?"\u2705":"\U0001F4BE"'),
    ('icon="??"', 'icon="\u2694\uFE0F"'),
    # SmallBtn content
    ('>??</SmallBtn>', '>\u270F\uFE0F</SmallBtn>'),
    ('>???</SmallBtn>', '>\U0001F5D1\uFE0F</SmallBtn>'),
    # Toggle active/pause buttons
    ('{q.active?"??":"??"}', '{q.active?"\u25B6\uFE0F":"\u23F8\uFE0F"}'),
    # Password show/hide
    ('?"??? Nascondi"', '?"\U0001F441\uFE0F Nascondi"'),
    ('":"??? Mostra"', '":"\U0001F441\uFE0F Mostra"'),
    # Card titles
    ('"?? Come ti chiamerai?"', '"✏️ Come ti chiamerai?"'),
    ('"?? Scegli la tua Classe"', '"⚔️ Scegli la tua Classe"'),
    ('"?? Scegli la tua Razza"', '"🌍 Scegli la tua Razza"'),
    ('"?? Codice Party"', '"👥 Codice Party"'),
    ('"?? Nome del Mondo"', '"🌍 Nome del Mondo"'),
    ('"?? Informazioni Base"', '"📋 Informazioni Base"'),
    ('"?? Scene della Missione"', '"🎭 Scene della Missione"'),
    ('"?? Nemici della Missione"', '"👾 Nemici della Missione"'),
    ('"?? Modifica Creatura"', '"👾 Modifica Creatura"'),
    ('"?? Market"', '"🏪 Market"'),
    ('"?? IN CORSO:', '"📜 IN CORSO:'),
    ('"?? Missione"', '"📜 Missione"'),
    # Sidebar
    ('"?? Party', '"👥 Party'),
    ('"?? Round', '"⚔️ Round'),
    ('"?? TUO TURNO!"', '"⚔️ TUO TURNO!"'),
    ('"?? TUO TURNO"', '"⚔️ TUO TURNO"'),
    ('?? {getMeta().worldName}', '⚔️ {getMeta().worldName}'),
    ('>?? Pannello Master<', '>🎲 Pannello Master<'),
    ('"??? Logo del Gioco"', '"🖼️ Logo del Gioco"'),
    ('?? Carica Logo', '📁 Carica Logo'),
    # Template literal messages
    ('`?? **BATTAGLIA INIZIATA!', '`⚔️ **BATTAGLIA INIZIATA!'),
    ('`?? Non ', '`⚠️ Non '),
    ('`??? Mancato!`', '`❌ Mancato!`'),
    ('`?? **BATTAGLIA VINTA!', '`🏆 **BATTAGLIA VINTA!'),
    ('`?? **MISSIONE COMPLETATA:', '`🏆 **MISSIONE COMPLETATA:'),
    ('`?? **MISSIONE:', '`📜 **MISSIONE:'),
    ('`?? **${q.title}', '`📜 **${q.title}'),
    ('`?? Nessuna missione', '`ℹ️ Nessuna missione'),
    ('`?? **Scelta:', '`🎯 **Scelta:'),
    ('`?? **Comandi:', '`ℹ️ **Comandi:'),
    ('`?? **Party', '`👥 **Party'),
    ('`?? **Classifica', '`🏆 **Classifica'),
    ('`?? **${player.name}', '`⚔️ **${player.name}'),
    # Chat tab
    ('"?? Chat"', '"💬 Chat"'),
    # No-combat placeholder icon
    ('>??</div>\n        <p>Nessuna battaglia', '>🛡️</div>\n        <p>Nessuna battaglia'),
    # Battle header
    ('"?? Battaglia \u2014 Round', '"⚔️ Battaglia \u2014 Round'),
    # Tabs rimasti
    ('"?? Mondo"', '"🌍 Mondo"'),
    # EMOJIS array for monster editor (20 emoji per il picker)
    ('["??","??","??","??","??","??","???","??","??","??","??","?","??","??","??","??","???","??","??","??"]',
     '["🗡️","🛡️","🏹","🪄","🔮","💀","🧌","🐉","🧛","💪","⚔️","⭐","🐺","🦅","🌿","🔥","🧙","👹","🗿","😈"]'),
    # Numero scene/nemici nella quest list
    ('?? {q.steps.length} scene', '🎭 {q.steps.length} scene'),
    ('?? {q.enemies.length} nemici', '👾 {q.enemies.length} nemici'),
    ('?? {q.goldReward} oro', '💰 {q.goldReward} oro'),
    # Negozio
    ('"?? Negozio"', '"🛒 Negozio"'),
    # Market buy button
    ('icon="??"', 'icon="💰"'),
    # ha comprato
    ('?? **${me.name}** ha comprato', '🛒 **${me.name}** ha comprato'),
    # ?? rimasto generico nei tag JSX (fallback)
    ('>??</', '>⚔️</'),
]

count_ops = 0
for old, new in subs:
    if old == new:
        continue
    n = c.count(old)
    if n:
        c = c.replace(old, new)
        count_ops += n

after = c.count('??')
print(f'Prima: {before} ?? | Rimasti: {after} | Sostituzioni: {count_ops}')

with open(FILE, 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
print('Salvato OK.')
