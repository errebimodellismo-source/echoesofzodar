import { useEffect, useRef, useState } from 'react';

function HpBar({ cur, max, dead, dying }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((cur / max) * 100))) : 0;
  const color = dead ? '#374151'
    : dying ? '#f97316'
    : pct > 60 ? '#22c55e'
    : pct > 30 ? '#f59e0b'
    : '#ef4444';
  return (
    <div style={{ height: 8, background: 'rgba(30,41,59,0.78)', borderRadius: 4, overflow: 'hidden', marginTop: 5 }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: color,
        borderRadius: 4,
        transition: 'width 0.5s ease, background 0.4s',
        boxShadow: dead ? 'none' : `0 0 8px ${color}88`,
      }} />
    </div>
  );
}

function FloatNumber({ value, kind = 'damage', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);
  const heal = kind === 'heal';
  const color = heal ? '#4ade80' : '#ef4444';
  return (
    <div style={{
      position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
      color, fontWeight: 900, fontSize: '1.35rem',
      pointerEvents: 'none', zIndex: 20,
      animation: 'floatUp 1.4s ease forwards',
      textShadow: `0 2px 8px #000, 0 0 13px ${color}`,
      whiteSpace: 'nowrap',
    }}>
      {heal ? '+' : '-'}{value}
    </div>
  );
}

function CombatantCard({ c, isActive, floats, isMobile, imgSrc, cueTarget }) {
  const isDead = c.dead || c.hp <= 0;
  const isDying = c.dying && !c.dead;
  const [imgErr, setImgErr] = useState(false);

  const borderColor = isDead ? '#374151'
    : isActive ? (c.isPlayer ? '#fbbf24' : '#ef4444')
    : c.isSummon ? '#22c55e'
    : c.isPlayer ? '#6d28d9'
    : '#7f1d1d';

  const bgColor = isDead ? 'rgba(17,24,39,0.62)'
    : isActive ? (c.isPlayer
        ? 'linear-gradient(135deg,rgba(120,80,10,0.45),rgba(15,23,42,0.96))'
        : 'linear-gradient(135deg,rgba(120,20,20,0.55),rgba(15,23,42,0.96))')
    : 'rgba(15,23,42,0.88)';

  const cardFloats = floats.filter(f => f.id === c.id);
  const imgSize = isMobile ? 70 : 94;
  const hpPct = c.maxHp > 0 ? Math.round((Math.max(0, c.hp) / c.maxHp) * 100) : 0;

  return (
    <div style={{
      position: 'relative',
      background: bgColor,
      border: `2px solid ${borderColor}`,
      borderRadius: 12,
      padding: isMobile ? '0.58rem' : '0.82rem',
      opacity: isDead ? 0.46 : 1,
      transition: 'border-color 0.3s, opacity 0.4s, transform 0.2s',
      transform: isActive ? 'translateY(-1px)' : 'none',
      boxShadow: isActive
        ? `0 0 22px ${c.isPlayer ? 'rgba(251,191,36,0.35)' : 'rgba(239,68,68,0.4)'}, 0 8px 24px rgba(0,0,0,0.4)`
        : cueTarget ? `0 0 18px ${borderColor}66`
        : '0 4px 16px rgba(0,0,0,0.3)',
      animation: cardFloats.length ? 'hitShake 0.45s ease' : cueTarget ? 'combatPulseRing 1.15s ease infinite' : 'none',
      overflow: 'hidden',
    }}>
      {cueTarget && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:`radial-gradient(circle at 50% 18%, ${borderColor}26, transparent 54%)` }} />
      )}
      {cardFloats.map(f => (
        <FloatNumber key={f.key} value={f.amount} kind={f.kind} onDone={f.onDone} />
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, position:'relative' }}>
        <div style={{
          width: imgSize, height: imgSize, minWidth: imgSize, flexShrink: 0,
          borderRadius: 10, overflow: 'hidden',
          border: `2px solid ${borderColor}`,
          background: 'rgba(15,23,42,0.8)',
          boxShadow: isActive ? `0 0 14px ${c.isPlayer ? '#fbbf2466' : '#ef444466'}` : '0 4px 12px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: isDead ? 'grayscale(1)' : 'none',
          transition: 'filter 0.4s',
        }}>
          {imgSrc && !imgErr ? (
            <img
              src={imgSrc}
              alt={c.name}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <span style={{
              fontSize: isMobile ? '2.15rem' : '2.75rem',
              filter: isDead ? 'grayscale(1)' : isActive ? 'drop-shadow(0 0 6px gold)' : 'none',
              lineHeight: 1,
            }}>
              {isDead ? '💀' : c.emoji || (c.isPlayer ? '🧙' : '👾')}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Cinzel',serif",
            color: isDead ? '#6b7280' : c.isPlayer ? '#ddd6fe' : '#fecaca',
            fontSize: isMobile ? '0.8rem' : '0.92rem',
            fontWeight: 700,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {c.name}{c.isBoss ? ' ★' : ''}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 1 }}>
            {isDead ? 'Eliminato' : isDying ? '🕯️ Morente' : c.isSummon ? '🔮 Evocato' : c.isPlayer ? 'Alleato' : 'Nemico'}
          </div>
          {isActive && !isDead && (
            <span style={{
              display: 'inline-block', marginTop: 4,
              fontSize: '0.6rem', padding: '2px 6px',
              background: c.isPlayer ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)',
              border: `1px solid ${c.isPlayer ? '#fbbf24' : '#ef4444'}`,
              borderRadius: 999, color: c.isPlayer ? '#fbbf24' : '#ef4444',
              fontFamily: "'Cinzel',serif", letterSpacing: '0.06em',
              animation: 'pulse 1s ease infinite',
            }}>
              ▶ ATTIVO
            </span>
          )}
        </div>
      </div>

      <HpBar cur={c.hp} max={c.maxHp} dead={isDead} dying={isDying} />
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.68rem', color: '#94a3b8', marginTop: 3,
      }}>
        <span>❤️ {Math.max(0, c.hp)}/{c.maxHp}</span>
        <span>{hpPct}%</span>
      </div>

      <div style={{
        display: 'flex', gap: 8, marginTop: 6,
        fontSize: '0.62rem', color: '#64748b',
      }}>
        <span>⚔️ {c.atk}</span>
        <span>🛡️ {c.def}</span>
        {c.mag > 0 && <span>✨ {c.mag}</span>}
      </div>

      {(c.statusEffects || []).length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
          {c.statusEffects.map(fx => (
            <span key={fx.type} style={{
              fontSize: '0.58rem', padding: '1px 5px',
              background: 'rgba(0,0,0,0.5)', border: '1px solid #475569',
              borderRadius: 999, color: '#94a3b8',
            }}>
              {fx.type} {fx.duration}t
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InitiativeStrip({ combatants, activeIdx }) {
  return (
    <div style={{ display:'flex', gap:6, overflowX:'auto', padding:'0.35rem 0.2rem 0.65rem', marginBottom:10 }}>
      {combatants.map((c, i) => {
        const active = i === activeIdx;
        const down = c.dead || c.hp <= 0;
        return (
          <div key={`${c.id || i}_turn`} style={{
            minWidth: 92,
            padding:'0.35rem 0.45rem',
            borderRadius:8,
            border:`1px solid ${active ? '#fbbf24' : down ? '#374151' : c.isPlayer ? '#4c1d95' : '#7f1d1d'}`,
            background: active ? 'rgba(251,191,36,0.13)' : 'rgba(15,23,42,0.62)',
            color: down ? '#475569' : active ? '#fde68a' : '#94a3b8',
            fontSize:'0.65rem',
            flexShrink:0,
          }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {active ? '▶ ' : ''}{c.emoji || (c.isPlayer ? '🧙' : '👾')} {c.name}
            </div>
            <div style={{ color: down ? '#374151' : '#64748b', marginTop:2 }}>{down ? 'fuori' : `${Math.max(0, c.hp)} HP`}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function CombatVisualizer({ combat, myId, isMobile, images = {}, cue = null }) {
  const { combatants = [], turn = 0, round = 1 } = combat || {};
  const activeIdx = turn % Math.max(1, combatants.length);

  const prevHpRef = useRef({});
  const [floats, setFloats] = useState([]);

  useEffect(() => {
    const newFloats = [];
    combatants.forEach(c => {
      const prev = prevHpRef.current[c.id];
      if (prev !== undefined && c.hp !== prev) {
        const key = `${c.id}_${Date.now()}_${Math.random()}`;
        const delta = Math.abs(c.hp - prev);
        newFloats.push({
          id: c.id,
          amount: delta,
          kind: c.hp > prev ? 'heal' : 'damage',
          key,
          onDone: () => setFloats(f => f.filter(x => x.key !== key)),
        });
      }
      prevHpRef.current[c.id] = c.hp;
    });
    if (newFloats.length) setFloats(f => [...f, ...newFloats]);
  }, [combatants]);

  const players = combatants.filter(c => c.isPlayer);
  const monsters = combatants.filter(c => !c.isPlayer);
  const activeCombatant = combatants[activeIdx];
  const cueTargetId = cue?.type && activeCombatant?.id;

  const colStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? 8 : 10,
    flex: 1,
    minWidth: 0,
  };

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <div style={{
        textAlign: 'center', marginBottom: isMobile ? 10 : 14,
        padding: '0.5rem 1rem',
        background: 'linear-gradient(90deg,rgba(127,29,29,0.0),rgba(127,29,29,0.25),rgba(127,29,29,0.0))',
        borderTop: '1px solid rgba(239,68,68,0.2)',
        borderBottom: '1px solid rgba(239,68,68,0.2)',
      }}>
        <span style={{ fontFamily: "'Cinzel',serif", color: '#fca5a5', fontSize: '0.8rem', letterSpacing: '0.12em' }}>
          ⚔️ ROUND {round}
        </span>
        {activeCombatant && (
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: 12 }}>
            Turno di <strong style={{ color: activeCombatant.isPlayer ? '#ddd6fe' : '#fca5a5' }}>{activeCombatant.name}</strong>
            {activeCombatant.id === myId && <span style={{ color:'#fbbf24' }}> · sei tu</span>}
          </span>
        )}
      </div>

      <InitiativeStrip combatants={combatants} activeIdx={activeIdx} />

      {cue && (
        <div style={{
          margin:'0 0 12px',
          padding:'0.65rem 0.8rem',
          borderRadius:10,
          border:`1px solid ${cue.color}`,
          background: cue.bg,
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          gap:10,
          animation:'combatCueIn .24s ease both',
        }}>
          <span style={{ fontSize:'1.3rem' }}>{cue.icon}</span>
          <span style={{ color:cue.color, fontFamily:"'Cinzel Decorative',serif", fontWeight:800, letterSpacing:'0.06em' }}>{cue.title}</span>
          {cue.value && <span style={{ color:'#e2e8f0', fontSize:'0.78rem' }}>{cue.value}</span>}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: isMobile ? 8 : 16,
        alignItems: 'flex-start',
      }}>
        <div style={colStyle}>
          <div style={{
            fontSize: '0.65rem', color: '#a78bfa', fontFamily: "'Cinzel',serif",
            letterSpacing: '0.1em', textAlign: 'center', marginBottom: 4,
            textTransform: 'uppercase',
          }}>
            🛡️ Party ({players.filter(c => !c.dead && c.hp > 0).length}/{players.length})
          </div>
          {players.map((c, i) => (
            <CombatantCard
              key={c.id || i}
              c={c}
              isActive={combatants[activeIdx]?.id === c.id}
              floats={floats}
              isMobile={isMobile}
              imgSrc={images[c.id] || ''}
              cueTarget={cueTargetId === c.id}
            />
          ))}
          {players.length === 0 && (
            <div style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', padding: '1rem' }}>
              Nessun alleato
            </div>
          )}
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 6, paddingTop: 28, flexShrink: 0,
        }}>
          <div style={{ width: 2, flex: 1, minHeight: 40, background: 'linear-gradient(180deg,transparent,rgba(239,68,68,0.4),transparent)' }} />
          <span style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', filter: 'drop-shadow(0 0 6px #ef4444)' }}>⚔️</span>
          <div style={{ width: 2, flex: 1, minHeight: 40, background: 'linear-gradient(180deg,transparent,rgba(239,68,68,0.4),transparent)' }} />
        </div>

        <div style={colStyle}>
          <div style={{
            fontSize: '0.65rem', color: '#f87171', fontFamily: "'Cinzel',serif",
            letterSpacing: '0.1em', textAlign: 'center', marginBottom: 4,
            textTransform: 'uppercase',
          }}>
            💀 Nemici ({monsters.filter(c => !c.dead && c.hp > 0).length}/{monsters.length})
          </div>
          {monsters.map((c, i) => (
            <CombatantCard
              key={c.id || i}
              c={c}
              isActive={combatants[activeIdx]?.id === c.id}
              floats={floats}
              isMobile={isMobile}
              imgSrc={images[c.id] || ''}
              cueTarget={cueTargetId === c.id}
            />
          ))}
          {monsters.length === 0 && (
            <div style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', padding: '1rem' }}>
              Nessun nemico
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
