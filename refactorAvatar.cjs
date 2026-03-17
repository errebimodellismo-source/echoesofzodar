const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add Imports
if (!code.includes('import AvatarDisplay')) {
  code = code.replace(
    /import audioManager from "\.\/utils\/audioManager";/,
    `import audioManager from "./utils/audioManager";\nimport AvatarDisplay from "./components/AvatarDisplay";\nimport { AVATAR_OPTIONS } from "./data/avatarData";`
  );
}

// 2. Update CreateChar State & Logic
if (!code.includes('const [avatarConfig, setAvatarConfig]')) {
  code = code.replace(
    /const \[loading, setLoading\] = useState\(false\);/,
    `const [loading, setLoading] = useState(false);\n  const [avatarConfig, setAvatarConfig] = useState({ body: 'male_base.svg', face: 'none', hair: 'short_brown.svg', outfit: 'none' });`
  );
}

// 3. Inject avatarConfig into create() payload
if (!code.includes('avatarConfig: avatarConfig')) {
  code = code.replace(
    /partyCode,/,
    `partyCode, avatar_config: avatarConfig,`
  );
}

// 4. Update Steps Array
code = code.replace(
  /const steps = \["Nome","Classe","Razza","Party"\];/,
  `const steps = ["Nome","Classe","Razza","Aspetto","Party"];`
);

// 5. Shift Step 3 (Party) to Step 4, and insert Step 3 (Aspetto)
if (!code.includes('step===4 && (')) {
  code = code.replace(
    /\{step===3 && \(/,
    `{step===3 && (
        <Card title="👁️ Personalizza Aspetto">
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Anteprima */}
            <div style={{ flex: '0 0 auto' }}>
              <AvatarDisplay config={avatarConfig} size={220} />
            </div>
            
            {/* Controlli */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                <label style={{...labelStyle, margin: '0 0 4px', fontSize: '0.75rem'}}>Corpo</label>
                <select style={{...inputStyle, padding: '4px', fontSize: '0.8rem'}} value={avatarConfig.body} onChange={e => setAvatarConfig(prev => ({...prev, body: e.target.value}))}>
                  {AVATAR_OPTIONS.body.map(opt => <option key={opt.id} style={{color:'black'}} value={opt.id}>{opt.name}</option>)}
                </select>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                <label style={{...labelStyle, margin: '0 0 4px', fontSize: '0.75rem'}}>Viso</label>
                <select style={{...inputStyle, padding: '4px', fontSize: '0.8rem'}} value={avatarConfig.face} onChange={e => setAvatarConfig(prev => ({...prev, face: e.target.value}))}>
                  {AVATAR_OPTIONS.face.map(opt => <option key={opt.id} style={{color:'black'}} value={opt.id}>{opt.name}</option>)}
                </select>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                <label style={{...labelStyle, margin: '0 0 4px', fontSize: '0.75rem'}}>Capelli</label>
                <select style={{...inputStyle, padding: '4px', fontSize: '0.8rem'}} value={avatarConfig.hair} onChange={e => setAvatarConfig(prev => ({...prev, hair: e.target.value}))}>
                  {AVATAR_OPTIONS.hair.map(opt => <option key={opt.id} style={{color:'black'}} value={opt.id}>{opt.name}</option>)}
                </select>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                <label style={{...labelStyle, margin: '0 0 4px', fontSize: '0.75rem'}}>Vestiario Base</label>
                <select style={{...inputStyle, padding: '4px', fontSize: '0.8rem'}} value={avatarConfig.outfit} onChange={e => setAvatarConfig(prev => ({...prev, outfit: e.target.value}))}>
                  {AVATAR_OPTIONS.outfit.map(opt => <option key={opt.id} style={{color:'black'}} value={opt.id}>{opt.name}</option>)}
                </select>
              </div>

            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:"1rem", justifyContent: 'center' }}>
            <SmallBtn onClick={()=>setStep(2)}>🔙 Indietro</SmallBtn>
            <BigBtn onClick={()=>setStep(4)} gold>Avanti ⏩</BigBtn>
          </div>
        </Card>
      )}
      {step===4 && (`
  );

  // Note: we need to replace the "Indietro" button in step 4 to go to step 3, not step 2.
  code = code.replace(
    /<SmallBtn onClick=\{\(\)=>setStep\(2\)\}>\? Indietro<\/SmallBtn>\n\s+<BigBtn onClick=\{create\}/g,
    `<SmallBtn onClick={()=>setStep(3)}>🔙 Indietro</SmallBtn>\n            <BigBtn onClick={create}`
  );
  
  // Also fix Step 2 "Avanti" to go to Step 3 instead of 3 (wait, it was setStep(3) before, changing to setStep(3) is correct, but the party code is now step 4, so changing setStep(3) to setStep(3) in step 2 is fine since we inserted step 3. The party code button was setStep(3), wait, step 2 button:
  // Before: <BigBtn onClick={()=>setStep(3)} gold>Avanti ?</BigBtn> -> this now goes to Aspetto (Step 3). That is correct!
}

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx modified with Avatar Configurator!');
