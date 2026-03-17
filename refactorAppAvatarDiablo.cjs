const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove Avatar imports
code = code.replace(/import AvatarDisplay from ".\/components\/AvatarDisplay";\n/, '');
code = code.replace(/import { AVATAR_OPTIONS } from ".\/data\/avatarData";\n/, '');

// 2. Add gender to CreateChar state
code = code.replace(
  /const \[race, setRace\] = useState\("human"\);/,
  `const [race, setRace] = useState("human");\n  const [gender, setGender] = useState("male");`
);

// 3. Update dbSavePlayer logic in CreateChar
code = code.replace(
  /class:cls, race:race, partyCode,/,
  `class:cls, race:race, gender:gender, partyCode,`
);
code = code.replace(
  /const \[avatarConfig, setAvatarConfig\] = useState\(\{ body: 'male_base.svg', face: 'none', hair: 'short_brown.svg', outfit: 'none' \}\);\n\n  const c = CLASSES\[cls\]; const r = RACES\[race\];/,
  `const c = CLASSES[cls]; const r = RACES[race];`
);

// 4. Update the steps format
code = code.replace(
  /const steps = \["Nome","Classe","Razza","Aspetto","Party"\];/,
  `const steps = ["Nome","Classe","Razza/Genere","Party"];`
);

// 5. Update step 2 (Razza) to include Gender
const razaVecchia = `{step===2 && (
        <Card title="🌍 Scegli la tua Razza">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8 }}>
            {Object.entries(RACES).map(([k,v])=>(
              <button key={k} onClick={()=>setRace(k)} style={{ padding:"0.7rem 0.4rem", background:race===k?"rgba(109,40,217,0.3)":"rgba(255,255,255,0.03)", border:\`2px solid \${race===k?"#a78bfa":"#1f2937"}\`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:"1.5rem" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:"#d1d5db", fontSize:"0.78rem" }}>{v.name}</strong>
                {race===k && <small style={{ fontSize:"0.6rem", color:"#a78bfa", textAlign:"center", lineHeight:1.3 }}>
                  {[v.hpB&&\`+\${v.hpB}HP\`,v.atkB&&\`+\${v.atkB}ATK\`,v.defB&&\`+\${v.defB}DEF\`,v.magB&&\`+\${v.magB}MAG\`].filter(Boolean).join(" ")||"Versatile"}
                </small>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(1)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(3)} gold>Avanti ⏩</BigBtn>
          </div>
        </Card>
      )}`;

const razaNuova = `{step===2 && (
        <Card title="🌍 Scegli Razza e Genere">
          <div style={{ display:"flex", gap:"1rem", marginBottom:"1rem" }}>
            <button onClick={()=>setGender("male")} style={{ flex:1, padding:"0.8rem", background:gender==="male"?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.03)", border:\`2px solid \${gender==="male"?"#60a5fa":"#1f2937"}\`, borderRadius:6, cursor:"pointer", color:gender==="male"?"#bfdbfe":"#9ca3af", fontFamily:"'Cinzel',serif" }}>♂️ Maschile</button>
            <button onClick={()=>setGender("female")} style={{ flex:1, padding:"0.8rem", background:gender==="female"?"rgba(236,72,153,0.3)":"rgba(255,255,255,0.03)", border:\`2px solid \${gender==="female"?"#f472b6":"#1f2937"}\`, borderRadius:6, cursor:"pointer", color:gender==="female"?"#fbcfe8":"#9ca3af", fontFamily:"'Cinzel',serif" }}>♀️ Femminile</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8 }}>
            {Object.entries(RACES).map(([k,v])=>(
              <button key={k} onClick={()=>setRace(k)} style={{ padding:"0.7rem 0.4rem", background:race===k?"rgba(109,40,217,0.3)":"rgba(255,255,255,0.03)", border:\`2px solid \${race===k?"#a78bfa":"#1f2937"}\`, borderRadius:6, cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <span style={{ fontSize:"1.5rem" }}>{v.emoji}</span>
                <strong style={{ fontFamily:"'Cinzel',serif", color:"#d1d5db", fontSize:"0.78rem" }}>{v.name}</strong>
                {race===k && <small style={{ fontSize:"0.6rem", color:"#a78bfa", textAlign:"center", lineHeight:1.3 }}>
                  {[v.hpB&&\`+\${v.hpB}HP\`,v.atkB&&\`+\${v.atkB}ATK\`,v.defB&&\`+\${v.defB}DEF\`,v.magB&&\`+\${v.magB}MAG\`].filter(Boolean).join(" ")||"Versatile"}
                </small>}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(1)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(3)} gold>Avanti ⏩</BigBtn>
          </div>
        </Card>
      )}`;
      
code = code.replace(razaVecchia, razaNuova);

// 6. Delete old Step 3 (Aspetto)
const aspettoStr = /{step===3 && \([\s\S]*?<\/Card>\s*\)\}\s*/;
code = code.replace(aspettoStr, "");

// 7. Change old Step 4 (Party) to Step 3, and add the portrait
const partyVecchio = `{step===4 && (
        <Card title="👥 Codice Party">
          <div style={{ background:"rgba(109,40,217,0.1)", border:"1px solid #4c1d95", borderRadius:6, padding:"0.8rem", marginBottom:"1rem", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:"2rem" }}>{c.emoji}</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif", color:"#fbbf24", fontWeight:700 }}>{name||"Il tuo eroe"}</div>
              <div style={{ color:"#9ca3af", fontSize:"0.78rem" }}>{RACES[race].emoji} {RACES[race].name}  {c.name}  Lv.1</div>
              <div style={{ color:"#6b7280", fontSize:"0.7rem", marginTop:2 }}>❤️{c.hp+r.hpB} ⚔️{c.atk+r.atkB} 🛡️{c.def+r.defB} ✨{c.mag+r.magB}</div>
            </div>
          </div>
          <label style={labelStyle}>Codice Party</label>
          <input style={inputStyle} value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Inserisci il codice di un amico  o lascia vuoto" maxLength={8} />
          <p style={{ color:"#4b5563", fontSize:"0.75rem", margin:"6px 0 0", lineHeight:1.5 }}>Il codice party  la tua stanza online. Condividilo con i tuoi giocatori!</p>
          <div style={{ display:"flex", gap:8, marginTop:"1rem" }}>
            <SmallBtn onClick={()=>setStep(3)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={create} gold icon="⭐" disabled={loading}>{loading?"Creando...":"Inizia l'Avventura!"}</BigBtn>
          </div>
        </Card>
      )}`;

const getPortraitStr = `const portraitUrl = '/assets/portraits/' + cls + '_' + gender + '.png';`;

const partyNuovo = `{step===3 && (
        <Card title="👥 Conferma Eroe & Party">
          <div style={{ background:"rgba(10,14,23,0.8)", border:"1px solid #374151", borderRadius:6, padding:"1.2rem", marginBottom:"1rem", display:"flex", flexDirection:"column", alignItems:"center", gap:15 }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fbbf24', boxShadow: '0 0 20px rgba(251,191,36,0.3)', backgroundColor: '#000' }}>
              <img src={\`/assets/portraits/\${cls}_\${gender}.png\`} alt="Portrait" onError={(e)=>{e.target.src='https://fv5-2.files.fm/thumb_show.php?i=p532qftvxy&view&v=1';}} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
      )}`;

code = code.replace(partyVecchio, partyNuovo);

// Fix dbSavePlayer in App to accept gender
code = code.replace(
  /party_code: p.partyCode, avatar_config: p.avatar_config \|\| null,/,
  `party_code: p.partyCode, gender: p.gender || 'male',`
);

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx converted to Diablo style character creator!');
