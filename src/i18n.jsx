import React, { createContext, useContext, useMemo, useState } from "react";
import { ITEM_TRANSLATIONS } from "./data/itemTranslations";

const LANG_KEY = "eoz_language";

const DICT = {
  it: {
    "loading": "Caricamento...",
    "maintenance.title": "Gioco in Manutenzione",
    "maintenance.body": "Il Dungeon Master sta aggiornando il mondo. Riprova tra qualche minuto.",
    "maintenance.auto": "La pagina si aggiornerà automaticamente quando il gioco sarà di nuovo disponibile.",
    "auth.login": "Accedi",
    "auth.register": "Registrati",
    "auth.badCredentials": "Email o password errati.",
    "auth.registered": "Registrazione completata! Ora puoi accedere.",
    "auth.wait": "Attendere...",
    "auth.enterWorld": "Entra nel Mondo",
    "auth.createAccount": "Crea Account",
    "auth.masterAccess": "Accesso Master",
    "master.panel": "Pannello Master",
    "master.restricted": "Accesso riservato al Master",
    "master.password": "Password Master",
    "master.wrongPassword": "Password errata.",
    "common.enter": "Entra",
    "common.backHome": "Torna alla home",
    "common.back": "Indietro",
    "common.next": "Avanti",
    "common.delete": "Elimina",
    "common.play": "Gioca",
    "common.gold": "Oro",
    "common.party": "Party",
    "common.loadingCharacters": "Caricamento personaggi...",
    "landing.portalTitle": "Il Portale degli Eroi",
    "landing.portalSubtitle": "Scegli chi guiderà il prossimo eco nel mondo.",
    "landing.newHero": "Nuovo Eroe",
    "landing.logout": "Esci",
    "landing.incarnateZodar": "Incarnati come Zodar",
    "landing.noHeroTitle": "Nessun eroe attende al portale",
    "landing.noHeroBody": "Crea la tua prima scheda e apri il viaggio.",
    "landing.recoverTitle": "Recupera personaggio per ID",
    "landing.recoverPlaceholder": "Incolla qui l'ID del personaggio (chiedi al Master)",
    "landing.recover": "Recupera",
    "landing.insertId": "Inserisci un ID.",
    "landing.invalidId": "ID non trovato o non valido.",
    "landing.connectedAs": "Connesso come",
    "landing.tagline": "GDR TESTUALE • FANTASY • MULTIPLAYER ONLINE",
    "landing.support": "Supporta il progetto",
    "stats.vigor": "Vigore",
    "create.title": "Forgia il tuo Destino",
    "create.steps.names": "Nomi",
    "create.steps.class": "Classe",
    "create.steps.raceGender": "Razza e Genere",
    "create.steps.appearance": "Aspetto",
    "create.steps.party": "Party",
    "create.namesTitle": "Nomi dell'eroe e del giocatore",
    "create.heroName": "Nome dell'eroe",
    "create.heroNamePlaceholder": "Il nome del tuo eroe...",
    "create.playerName": "Nome e cognome del giocatore",
    "create.playerNamePlaceholder": "Es: Mario Rossi",
    "create.playerNameHelp": "Serve solo al Master per riconoscere e organizzare tavoli, party e ricompense. Gli altri giocatori vedranno solo il nome dell'eroe.",
    "create.classTitle": "Scegli la tua Classe",
    "create.secretClasses": "Classi e Razze Segrete",
    "create.secretPlaceholder": "Inserisci la parola d'ordine...",
    "create.unlock": "Sblocca",
    "create.secretWrong": "Parola d'ordine errata.",
    "create.secretUnlocked": "Classi e razze segrete sbloccate",
    "create.secret": "SEGRETO",
    "create.raceTitle": "Scegli Razza e Genere",
    "create.femaleOnly": "La razza {race} è esclusivamente femminile.",
    "create.male": "Maschile",
    "create.female": "Femminile",
    "create.versatile": "Versatile",
    "create.appearanceTitle": "Personalizza il tuo Aspetto",
    "create.face": "Viso",
    "create.eyes": "Occhi",
    "create.scar": "Cicatrice",
    "create.none": "Nessuna",
    "create.confirmTitle": "Conferma Eroe & Party",
    "create.unnamed": "Senza Nome",
    "create.partyCode": "Codice Stanza Multiplayer",
    "create.partyCodePlaceholder": "Es: DRAGON8",
    "create.partyHelp": "Se giochi da solo, lascia vuoto. Se giochi con amici, inserite tutti lo stesso codice.",
    "create.creating": "Creazione in corso...",
    "create.confirmEnter": "Conferma ed Entra",
    "nav.quests": "Missioni",
    "nav.story": "Storia",
    "nav.stories": "Storie",
    "nav.inventory": "Inventario",
    "nav.equipment": "Equip",
    "nav.level": "Livello",
    "nav.diary": "Diario",
    "nav.shop": "Negozio",
    "nav.forge": "Forgia",
    "nav.chat": "Chat",
    "nav.spells": "Magie",
    "nav.dungeon": "Dungeon",
    "nav.map": "Mappa",
    "nav.zodar": "Zodar",
    "nav.observatory": "Osservatorio",
    "nav.guild": "Gilda",
    "nav.event": "Evento",
    "nav.leaderboard": "Classifiche",
    "nav.market": "Mercato",
    "nav.battle": "Battaglia",
    "nav.donate": "Dona",
    "nav.exitMenu": "Esci al Menu",
  },
  en: {
    "loading": "Loading...",
    "maintenance.title": "Game Under Maintenance",
    "maintenance.body": "The Dungeon Master is updating the world. Try again in a few minutes.",
    "maintenance.auto": "The page will update automatically when the game is available again.",
    "auth.login": "Sign In",
    "auth.register": "Register",
    "auth.badCredentials": "Wrong email or password.",
    "auth.registered": "Registration complete! You can now sign in.",
    "auth.wait": "Please wait...",
    "auth.enterWorld": "Enter the World",
    "auth.createAccount": "Create Account",
    "auth.masterAccess": "Master Access",
    "master.panel": "Master Panel",
    "master.restricted": "Master-only access",
    "master.password": "Master Password",
    "master.wrongPassword": "Wrong password.",
    "common.enter": "Enter",
    "common.backHome": "Back to home",
    "common.back": "Back",
    "common.next": "Next",
    "common.delete": "Delete",
    "common.play": "Play",
    "common.gold": "Gold",
    "common.party": "Party",
    "common.loadingCharacters": "Loading characters...",
    "landing.portalTitle": "The Heroes' Portal",
    "landing.portalSubtitle": "Choose who will lead the next echo into the world.",
    "landing.newHero": "New Hero",
    "landing.logout": "Log Out",
    "landing.incarnateZodar": "Incarnate as Zodar",
    "landing.noHeroTitle": "No hero waits at the portal",
    "landing.noHeroBody": "Create your first sheet and begin the journey.",
    "landing.recoverTitle": "Recover character by ID",
    "landing.recoverPlaceholder": "Paste the character ID here (ask the Master)",
    "landing.recover": "Recover",
    "landing.insertId": "Enter an ID.",
    "landing.invalidId": "ID not found or invalid.",
    "landing.connectedAs": "Signed in as",
    "landing.tagline": "TEXT RPG • FANTASY • ONLINE MULTIPLAYER",
    "landing.support": "Support the project",
    "stats.vigor": "Vigor",
    "create.title": "Forge Your Destiny",
    "create.steps.names": "Names",
    "create.steps.class": "Class",
    "create.steps.raceGender": "Race and Gender",
    "create.steps.appearance": "Appearance",
    "create.steps.party": "Party",
    "create.namesTitle": "Hero and player names",
    "create.heroName": "Hero name",
    "create.heroNamePlaceholder": "Your hero's name...",
    "create.playerName": "Player full name",
    "create.playerNamePlaceholder": "Ex: Mario Rossi",
    "create.playerNameHelp": "Only the Master uses this to organize tables, parties and rewards. Other players will only see the hero name.",
    "create.classTitle": "Choose Your Class",
    "create.secretClasses": "Secret Classes and Races",
    "create.secretPlaceholder": "Enter the password...",
    "create.unlock": "Unlock",
    "create.secretWrong": "Wrong password.",
    "create.secretUnlocked": "Secret classes and races unlocked",
    "create.secret": "SECRET",
    "create.raceTitle": "Choose Race and Gender",
    "create.femaleOnly": "The race {race} is female-only.",
    "create.male": "Male",
    "create.female": "Female",
    "create.versatile": "Versatile",
    "create.appearanceTitle": "Customize Your Appearance",
    "create.face": "Face",
    "create.eyes": "Eyes",
    "create.scar": "Scar",
    "create.none": "None",
    "create.confirmTitle": "Confirm Hero & Party",
    "create.unnamed": "Unnamed",
    "create.partyCode": "Multiplayer Room Code",
    "create.partyCodePlaceholder": "Ex: DRAGON8",
    "create.partyHelp": "If you play solo, leave it empty. If you play with friends, all of you should enter the same code.",
    "create.creating": "Creating...",
    "create.confirmEnter": "Confirm and Enter",
    "nav.quests": "Quests",
    "nav.story": "Story",
    "nav.stories": "Stories",
    "nav.inventory": "Inventory",
    "nav.equipment": "Equip",
    "nav.level": "Level",
    "nav.diary": "Journal",
    "nav.shop": "Shop",
    "nav.forge": "Forge",
    "nav.chat": "Chat",
    "nav.spells": "Spells",
    "nav.dungeon": "Dungeon",
    "nav.map": "Map",
    "nav.zodar": "Zodar",
    "nav.observatory": "Observatory",
    "nav.guild": "Guild",
    "nav.event": "Event",
    "nav.leaderboard": "Rankings",
    "nav.market": "Market",
    "nav.battle": "Battle",
    "nav.donate": "Donate",
    "nav.exitMenu": "Exit to Menu",
  },
};

export const CLASS_NAMES = {
  en: {
    barbarian: "Barbarian",
    bard: "Bard",
    cleric: "Cleric",
    druid: "Druid",
    warrior: "Warrior",
    monk: "Monk",
    paladin: "Paladin",
    ranger: "Ranger",
    rogue: "Rogue",
    sorcerer: "Sorcerer",
    warlock: "Warlock",
    mage: "Mage",
    custode_equilibrio: "Keeper of Balance",
    necromancer: "Necromancer",
    artificer: "Artificer",
    summoner: "Summoner",
    seductress: "Seductress",
  },
};

export const RACE_NAMES = {
  en: {
    human: "Human",
    dwarf: "Dwarf",
    elf: "Elf",
    halfling: "Halfling",
    dragonborn: "Dragonborn",
    gnome: "Gnome",
    halfelf: "Half-Elf",
    halforc: "Half-Orc",
    tiefling: "Tiefling",
    entita_primordiale: "Primordial Entity",
    minotaur: "Minotaur",
    angel: "Angel",
    succubus: "Succubus",
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "it";
    return localStorage.getItem(LANG_KEY) || "it";
  });

  const setLang = (next) => {
    const safe = next === "en" ? "en" : "it";
    setLangState(safe);
    localStorage.setItem(LANG_KEY, safe);
    document.documentElement.lang = safe;
  };

  const value = useMemo(() => ({
    lang,
    setLang,
    t: (key, vars = {}) => {
      const raw = DICT[lang]?.[key] || DICT.it[key] || key;
      return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), raw);
    },
    className: (key, fallback) => CLASS_NAMES[lang]?.[key] || fallback,
    raceName: (key, fallback) => RACE_NAMES[lang]?.[key] || fallback,
    itemName: (itemOrId, fallback = "") => {
      const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
      const source = typeof itemOrId === "string" ? fallback : itemOrId?.name;
      return ITEM_TRANSLATIONS[lang]?.[id]?.name || source || fallback || "";
    },
    itemDescription: (itemOrId, fallback = "") => {
      const id = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
      const source = typeof itemOrId === "string" ? fallback : itemOrId?.description;
      return ITEM_TRANSLATIONS[lang]?.[id]?.description || source || fallback || "";
    },
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div style={{ position:"fixed", top:12, right:12, zIndex:9999, display:"flex", gap:4, padding:4, background:"rgba(2,6,23,0.78)", border:"1px solid rgba(251,191,36,0.28)", borderRadius:8, backdropFilter:"blur(10px)", boxShadow:"0 10px 30px rgba(0,0,0,0.25)" }}>
      {[["it","IT"],["en","EN"]].map(([key,label]) => (
        <button
          key={key}
          onClick={() => setLang(key)}
          title={key === "it" ? "Italiano" : "English"}
          style={{
            minWidth:34,
            height:28,
            borderRadius:6,
            border:`1px solid ${lang === key ? "#fbbf24" : "rgba(148,163,184,0.22)"}`,
            background:lang === key ? "rgba(251,191,36,0.18)" : "rgba(15,23,42,0.5)",
            color:lang === key ? "#fde68a" : "#94a3b8",
            fontFamily:"'Cinzel',serif",
            fontSize:"0.72rem",
            fontWeight:700,
            cursor:"pointer",
            letterSpacing:"0.04em",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
