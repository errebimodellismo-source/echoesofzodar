import fs from 'fs';

let content = fs.readFileSync('c:\\Users\\roppo\\echoesofzodar\\echoesofzodar\\src\\App.jsx', 'utf8').replace(/\r\n/g, '\n');

// 1. App component useEffect
content = content.replace(
  /export default function App\(\) \{\n\s+const \[screen, setScreen\] = useState\("landing"\);\n\s+const \[myId, setMyId\] = useState\(\(\) => localStorage\.getItem\("eoz_myId"\) \|\| null\);\n\s+const \[authUser, setAuthUser\] = useState\(null\);\n\s+const \[authLoading, setAuthLoading\] = useState\(true\);\n\n\s+useEffect\(\(\)=>\{/,
  `export default function App() {
  const [screen, setScreen] = useState("landing");
  const [myId, setMyId] = useState(() => localStorage.getItem("eoz_myId") || null);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (screen === "landing" || screen === "create" || screen === "master") {
      audioManager.playBGM("intro");
    }
  }, [screen]);

  useEffect(()=>{`
);

// 2. GameScreen component useEffect
content = content.replace(
  /const refreshInventory = useCallback\(async \(playerOverride=null\) => \{/,
  `useEffect(() => {
    if (qs?.combat?.active) {
      audioManager.playBGM("combat");
    } else if (tab === "shop" || tab === "market") {
      audioManager.playBGM("town");
    } else {
      audioManager.playBGM("dungeon");
    }
  }, [qs?.combat?.active, tab]);

  const refreshInventory = useCallback(async (playerOverride=null) => {`
);

fs.writeFileSync('c:\\Users\\roppo\\echoesofzodar\\echoesofzodar\\src\\App.jsx', content);
console.log("Updated App.jsx with audio hooks!");
