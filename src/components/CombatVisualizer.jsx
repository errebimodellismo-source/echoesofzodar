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

function BattlefieldSprite({ c, isActive, floats, isMobile, imgSrc, cueTarget, actionSource, side, index, total }) {
  const isDead = c.dead || c.hp <= 0;
  const isDying = c.dying && !c.dead;
  const [imgErr, setImgErr] = useState(false);
  const cardFloats = floats.filter(f => f.id === c.id);
  const tookDamage = cardFloats.some(f => f.kind === 'damage');
  const gotHeal = cardFloats.some(f => f.kind === 'heal');
  const statusEffects = c.statusEffects || [];
  const hasBuff = statusEffects.some(fx => fx.type === 'buff');
  const hasControl = statusEffects.some(fx => /stun|charm|sleep|slow|control/i.test(fx.type));
  const hasDot = statusEffects.some(fx => /poison|burn|acid|thorn|bleed|death|shadow/i.test(fx.type));
  const auraColor = hasBuff ? '#fbbf24' : hasDot ? '#4ade80' : hasControl ? '#a78bfa' : isDying ? '#f97316' : null;
  const hpPct = c.maxHp > 0 ? Math.round((Math.max(0, c.hp) / c.maxHp) * 100) : 0;
  const aliveColor = c.isPlayer ? '#a78bfa' : '#f87171';
  const activeColor = c.isPlayer ? '#fbbf24' : '#ef4444';
  const baseColor = isDead ? '#475569' : isActive ? activeColor : aliveColor;
  const spriteW = isMobile ? 82 : 106;
  const spriteH = isMobile ? 108 : 142;
  const stagger = total > 1 ? (index - (total - 1) / 2) : 0;
  const yOffset = Math.max(-28, Math.min(28, stagger * (isMobile ? 12 : 16)));
  const activeAnimation = isActive && !isDead
    ? side === 'left'
      ? 'battleSpriteReadyLeft 1.9s ease-in-out infinite'
      : 'battleSpriteReadyRight 1.9s ease-in-out infinite'
    : 'none';
  const idleAnimation = side === 'left'
    ? 'battleSpriteIdleLeft 3.2s ease-in-out infinite'
    : 'battleSpriteIdleRight 3.2s ease-in-out infinite';
  const attackAnimation = isDead
    ? 'battleSpriteFall .9s ease-out both'
    : tookDamage
      ? side === 'left'
        ? 'battleSpriteRecoilLeft .48s ease'
        : 'battleSpriteRecoilRight .48s ease'
      : actionSource
    ? side === 'left'
      ? 'battleSpriteStrikeLeft .72s ease-out'
      : 'battleSpriteStrikeRight .72s ease-out'
      : activeAnimation === 'none'
        ? idleAnimation
        : activeAnimation;

  return (
    <div style={{
      position:'relative',
      width:isMobile ? 116 : 148,
      minWidth:isMobile ? 104 : 130,
      transform:`translateY(${yOffset}px)`,
      opacity:isDead ? 0.45 : 1,
      transition:'opacity .35s ease, transform .35s ease',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      zIndex:isActive ? 4 : Math.max(1, 3 - Math.abs(stagger)),
    }}>
      {cardFloats.map(f => (
        <FloatNumber key={f.key} value={f.amount} kind={f.kind} onDone={f.onDone} />
      ))}
      {auraColor && !isDead && (
        <div style={{
          position:'absolute',
          top:isMobile ? -8 : -12,
          width:isMobile ? 110 : 142,
          height:isMobile ? 138 : 178,
          borderRadius:'50%',
          background:`radial-gradient(ellipse,${auraColor}2e,transparent 62%)`,
          boxShadow:`0 0 28px ${auraColor}44`,
          animation:'battleStatusAura 1.7s ease-in-out infinite',
          pointerEvents:'none',
          zIndex:0,
        }} />
      )}

      {isActive && !isDead && (
        <div style={{
          position:'absolute',
          top:isMobile ? -10 : -14,
          left:'50%',
          transform:'translateX(-50%)',
          width:isMobile ? 28 : 34,
          height:isMobile ? 28 : 34,
          borderRadius:'50%',
          background:`radial-gradient(circle,${activeColor}cc,transparent 68%)`,
          boxShadow:`0 0 18px ${activeColor}`,
          animation:'battleTurnMarker 1.2s ease-in-out infinite',
        }} />
      )}

      <div style={{
        position:'relative',
        width:spriteW,
        height:spriteH,
        borderRadius: isMobile ? '18px 18px 28px 28px' : '22px 22px 34px 34px',
        border:`2px solid ${baseColor}`,
        background:isDead
          ? 'linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.95))'
          : c.isPlayer
            ? 'linear-gradient(180deg,rgba(49,46,129,0.42),rgba(15,23,42,0.94))'
            : 'linear-gradient(180deg,rgba(127,29,29,0.42),rgba(15,23,42,0.94))',
        boxShadow:isActive
          ? `0 0 26px ${activeColor}66, 0 18px 28px rgba(0,0,0,.42)`
          : cueTarget
            ? `0 0 22px ${baseColor}77`
            : '0 14px 24px rgba(0,0,0,.38)',
        overflow:'hidden',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        filter:isDead ? 'grayscale(1)' : 'none',
        animation: attackAnimation,
      }}>
        <div style={{
          position:'absolute',
          inset:0,
          background:`radial-gradient(circle at 50% 20%,${baseColor}24,transparent 52%)`,
          pointerEvents:'none',
        }} />
        {imgSrc && !imgErr ? (
          <img
            src={imgSrc}
            alt={c.name}
            onError={() => setImgErr(true)}
            style={{
              width:'100%',
              height:'100%',
              objectFit:'cover',
              objectPosition:c.isPlayer ? '50% 22%' : '50% 34%',
              display:'block',
              transform:c.isPlayer ? 'scale(1.1)' : 'scale(1.05)',
            }}
          />
        ) : (
          <span style={{
            fontSize:isMobile ? '3.1rem' : '4.1rem',
            lineHeight:1,
            textShadow:`0 0 18px ${baseColor}`,
            filter:isActive ? 'drop-shadow(0 0 10px currentColor)' : 'none',
          }}>
            {isDead ? '💀' : c.emoji || (c.isPlayer ? '🧙' : '👾')}
          </span>
        )}
        {isDying && <div style={{ position:'absolute', inset:0, background:'rgba(249,115,22,0.18)', animation:'battleSpriteWound 1s ease-in-out infinite' }} />}
        {gotHeal && !isDead && <div style={{ position:'absolute', inset:-6, borderRadius:'inherit', background:'radial-gradient(circle,rgba(74,222,128,.42),transparent 66%)', animation:'battleSpriteHealPulse .62s ease-out forwards' }} />}
        {auraColor && !isDead && <div style={{ position:'absolute', inset:0, borderRadius:'inherit', border:`1px solid ${auraColor}77`, boxShadow:`inset 0 0 18px ${auraColor}33`, pointerEvents:'none' }} />}
        {isDead && <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent,rgba(2,6,23,0.75))' }} />}
      </div>

      <div style={{
        width:isMobile ? 108 : 136,
        marginTop:-3,
        height:20,
        borderRadius:'50%',
        background:'radial-gradient(ellipse,rgba(0,0,0,.58),rgba(0,0,0,.18) 58%,transparent 72%)',
        filter:'blur(.2px)',
      }} />

      <div style={{
        width:'100%',
        marginTop:-6,
        padding:'0.45rem 0.5rem 0.52rem',
        borderRadius:10,
        background:'rgba(2,6,23,0.68)',
        border:`1px solid ${baseColor}55`,
        boxShadow:'0 10px 18px rgba(0,0,0,.26)',
      }}>
        <div style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          gap:5,
          minWidth:0,
          color:isDead ? '#64748b' : c.isPlayer ? '#ddd6fe' : '#fecaca',
          fontFamily:"'Cinzel',serif",
          fontWeight:800,
          fontSize:isMobile ? '0.68rem' : '0.76rem',
          whiteSpace:'nowrap',
          overflow:'hidden',
          textOverflow:'ellipsis',
        }}>
          <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
          {c.isBoss && <span style={{ color:'#fbbf24', flexShrink:0 }}>★</span>}
        </div>
        <HpBar cur={c.hp} max={c.maxHp} dead={isDead} dying={isDying} />
        <div style={{ display:'flex', justifyContent:'space-between', gap:4, fontSize:'0.62rem', color:'#94a3b8', marginTop:3 }}>
          <span>{Math.max(0, c.hp)}/{c.maxHp} HP</span>
          <span>{hpPct}%</span>
        </div>
        {statusEffects.length > 0 && (
          <div style={{ display:'flex', justifyContent:'center', gap:4, marginTop:5, flexWrap:'wrap' }}>
            {statusEffects.slice(0, 3).map(fx => (
              <span key={fx.type} title={`${fx.type} ${fx.duration || 1}t`} style={{ width:7, height:7, borderRadius:'50%', background:fx.type === 'buff' ? '#fbbf24' : /burn/i.test(fx.type) ? '#fb923c' : /acid|poison|thorn/i.test(fx.type) ? '#4ade80' : /death|shadow/i.test(fx.type) ? '#a78bfa' : '#a78bfa', boxShadow:'0 0 8px currentColor' }} />
            ))}
          </div>
        )}
      </div>
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

function cleanBattleLogText(log) {
  return String(log || "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function inferBattleTargets({ log, combatants, activeCombatant, fx }) {
  const raw = String(log || "");
  const text = raw.replace(/\*\*/g, "").replace(/\*/g, "");
  if(!text || !combatants?.length) return [];
  const alive = combatants.filter(c => !c.dead && c.hp > 0);
  const activeId = activeCombatant?.id;
  if(/tutti i nemici|all enemies|TUTTI i nemici|TUTTI i mostri/i.test(text)) return alive.filter(c => c.id !== activeId && !c.isPlayer);
  if(/tutti gli alleati|all allies|tutto il party|whole party/i.test(text)) return alive.filter(c => c.isPlayer);

  const candidates = [...combatants]
    .filter(c => c?.id !== activeId && c?.name)
    .sort((a,b) => String(b.name).length - String(a.name).length);
  const matches = [];
  for(const c of candidates) {
    const name = String(c.name);
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const hpLine = new RegExp(`(?:❤️|HP|Damage|Danno|Cura|Healing|💥|💗|•)?\\s*${escaped}\\s*(?::|\\b)`, "i");
    const directHit = new RegExp(`(?:to|a|su|contro)\\s+${escaped}\\b`, "i");
    if(hpLine.test(text) || directHit.test(text)) matches.push(c);
  }
  if(matches.length) return matches;

  const targetPool = fx?.type === "healMagic"
    ? alive.filter(c => c.isPlayer)
    : alive.filter(c => c.id !== activeId && c.isPlayer !== !!activeCombatant?.isPlayer);
  return targetPool.slice(0, 1);
}

function stagePointForCombatant(c, sideList, isMobile) {
  if(!c) return { x:50, y:48 };
  const side = c.isPlayer ? "left" : "right";
  const index = Math.max(0, sideList.findIndex(x => x.id === c.id));
  const total = Math.max(1, sideList.length);
  const stagger = total > 1 ? (index - (total - 1) / 2) : 0;
  if(isMobile) {
    return { x:50 + Math.max(-24, Math.min(24, stagger * 13)), y:side === "left" ? 32 : 72 };
  }
  return {
    x: side === "left" ? 22 + Math.max(-8, Math.min(10, index * 7)) : 78 - Math.max(-8, Math.min(10, index * 7)),
    y: 49 + Math.max(-16, Math.min(16, stagger * 10)),
  };
}

function actionCaptionFromLog({ log, fx, activeCombatant, targetCombatants, lang = "it" }) {
  if(!fx) return null;
  const isEn = lang === "en";
  const cleanLines = String(log || "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);
  const targetNames = targetCombatants?.length > 1
    ? (isEn ? `${targetCombatants.length} targets` : `${targetCombatants.length} bersagli`)
    : targetCombatants?.[0]?.name;
  const damageValues = [...String(log || "").matchAll(/(?:=>|Danno finale:|Final damage:|Danno inflitto:|Damage dealt:|Danno:|Damage:)[^\d]*(\d+)/gi)]
    .map(m => Number(m[1]))
    .filter(Boolean);
  const healValues = [...String(log || "").matchAll(/(?:Cura finale:|Healing|Heal|Cura:|recupera|restores|heals)[^\d]*(\d+)/gi)]
    .map(m => Number(m[1]))
    .filter(Boolean);
  const totalDamage = damageValues.reduce((sum, n) => sum + n, 0);
  const totalHeal = healValues.reduce((sum, n) => sum + n, 0);
  return {
    title: fx.label || cleanLines[0] || (isEn ? "Action" : "Azione"),
    meta: [activeCombatant?.name, targetNames].filter(Boolean).join(" → "),
    value: totalDamage > 0 ? `-${totalDamage} HP` : totalHeal > 0 ? `+${totalHeal} HP` : "",
    color: fx.color || "#f87171",
  };
}

function BattleStageAction({ fx, activeCombatant, isMobile, effectKey, originPoint, targetPoint, areaTargetPoints = [] }) {
  if(!fx || !activeCombatant) return null;
  const fromLeft = !!activeCombatant.isPlayer;
  const color = fx.color || '#f87171';
  const targetX = `${targetPoint?.x ?? (fromLeft ? 73 : 27)}%`;
  const targetY = `${targetPoint?.y ?? 47}%`;
  const originX = `${originPoint?.x ?? (fromLeft ? 25 : 75)}%`;
  const originY = `${originPoint?.y ?? 47}%`;
  const dx = `${(targetPoint?.x ?? (fromLeft ? 73 : 27)) - (originPoint?.x ?? (fromLeft ? 25 : 75))}%`;
  const dy = `${(targetPoint?.y ?? 47) - (originPoint?.y ?? 47)}%`;
  const label = fx.label || '';
  const magicTypes = new Set(['magic','healMagic','fire','ice','lightning','poison','shadow','holy','nature','sonic','control','divine']);
  const base = { position:'absolute', inset:0, pointerEvents:'none', zIndex:5, overflow:'hidden' };
  const projectileFlip = fromLeft ? 'scaleX(1)' : 'scaleX(-1)';
  const magicIcon = ({
    fire:'🔥', ice:'❄️', lightning:'⚡', poison:'☠️', shadow:'🌑', holy:'✦',
    nature:'🌿', sonic:'♪', control:'✧', divine:'⚖️', healMagic:'✚', magic:'✦',
  })[fx.type] || '✦';
  const chargeSize = isMobile ? 92 : 126;
  const chargeFx = (
    <>
      <div style={{ position:'absolute', left:originX, top:originY, width:chargeSize, height:chargeSize, transform:'translate(-50%,-50%)', borderRadius:'50%', border:`2px solid ${color}`, boxShadow:`0 0 22px ${color}88, inset 0 0 24px ${color}44`, opacity:0, animation:'battleActionCharge .36s ease-out both' }} />
      <div style={{ position:'absolute', left:originX, top:originY, width:chargeSize * 0.55, height:chargeSize * 0.55, transform:'translate(-50%,-50%)', borderRadius:'50%', background:`radial-gradient(circle,#fff8,${color}66 38%,transparent 70%)`, filter:'blur(1px)', opacity:0, animation:'battleActionChargeCore .36s ease-out both' }} />
    </>
  );

  if(fx.type === 'arrow') return (
    <div key={effectKey} style={base}>
      {chargeFx}
      <div style={{ position:'absolute', left:originX, top:originY, width:isMobile ? 150 : 250, height:8, borderRadius:999, background:'linear-gradient(90deg,transparent,rgba(253,230,138,.18),#fde68a,#f59e0b)', boxShadow:'0 0 18px rgba(251,191,36,.95)', "--dx":dx, "--dy":dy, opacity:0, animation:'battleProjectileTravel .78s ease-out .32s both' }} />
      <div style={{ position:'absolute', left:originX, top:originY, "--dx":dx, "--dy":dy, opacity:0, animation:'battleProjectileTravel .78s ease-out .32s both' }}>
        <div style={{ transform:projectileFlip, color:'#fde68a', fontSize:isMobile ? '2rem' : '2.65rem', lineHeight:1, textShadow:'0 0 14px #f59e0b, 0 0 28px #f97316' }}>➤</div>
      </div>
      <div style={{ position:'absolute', left:targetX, top:targetY, width:isMobile ? 88 : 118, height:isMobile ? 88 : 118, transform:'translate(-50%,-50%)', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,247,237,.72),rgba(253,230,138,.44) 26%,transparent 68%)', boxShadow:'0 0 34px rgba(251,191,36,.7)', opacity:0, animation:'battleArrowImpact .82s ease-out .9s both' }} />
      <div style={{ position:'absolute', left:targetX, top:targetY, width:isMobile ? 86 : 118, height:2, background:'linear-gradient(90deg,transparent,#fff7ed,transparent)', transform:'translate(-50%,-50%) rotate(-18deg)', opacity:0, animation:'battleShardBurst .82s ease-out .9s both' }} />
    </div>
  );

  if(fx.type === 'slash' || fx.type === 'hit' || fx.type === 'miss') return (
    <div key={effectKey} style={base}>
      {chargeFx}
      <div style={{ position:'absolute', left:originX, top:originY, "--dx":dx, "--dy":dy, opacity:0, animation:'battleBladeTravel .62s cubic-bezier(.15,.88,.32,1) .28s both' }}>
        <div style={{ transform:`${projectileFlip} rotate(-32deg)`, transformOrigin:'50% 70%', color:'#f8fafc', fontSize:isMobile ? '2.25rem' : '3.25rem', lineHeight:1, textShadow:'0 0 12px #f8fafc, 0 0 28px #ef4444' }}>🗡️</div>
      </div>
      <div style={{ position:'absolute', left:targetX, top:targetY, width:isMobile ? 112 : 168, height:isMobile ? 112 : 168, transform:'translate(-50%,-50%) rotate(-18deg)', borderRadius:18, background:'linear-gradient(135deg,transparent 25%,#fff7ed 42%,#ef4444 49%,#7f1d1d 56%,transparent 72%)', filter:'drop-shadow(0 0 18px rgba(248,113,113,.98))', opacity:0, animation:'battleSlashImpact .82s ease-out .78s both' }} />
      <div style={{ position:'absolute', left:targetX, top:targetY, width:isMobile ? 92 : 132, height:isMobile ? 92 : 132, transform:'translate(-50%,-50%) rotate(28deg)', borderRadius:18, background:'linear-gradient(135deg,transparent 34%,rgba(255,255,255,.82) 48%,transparent 60%)', filter:'drop-shadow(0 0 16px rgba(255,247,237,.85))', opacity:0, animation:'battleSlashImpact .72s ease-out .88s both' }} />
      <div style={{ position:'absolute', left:targetX, top:targetY, width:isMobile ? 90 : 142, height:isMobile ? 90 : 142, transform:'translate(-50%,-50%) rotate(-18deg)', borderRadius:18, background:'linear-gradient(135deg,transparent 28%,#fff7ed 45%,#ef4444 52%,transparent 68%)', filter:'drop-shadow(0 0 16px rgba(248,113,113,.95))', opacity:0, animation:'battleSlashImpact .78s ease-out .84s both' }} />
      <div style={{ position:'absolute', left:targetX, top:targetY, transform:'translate(-50%,-50%)', color:'#fecaca', fontFamily:"'Cinzel Decorative',serif", fontSize:isMobile ? '.9rem' : '1.1rem', textShadow:'0 0 14px #ef4444', opacity:0, animation:'battleImpactText .8s ease-out .82s both' }}>{fx.type === 'miss' ? 'MISS' : 'SLASH'}</div>
    </div>
  );

  if(magicTypes.has(fx.type)) {
    const heal = fx.type === 'healMagic';
    const auraColor = heal ? '#34d399' : color;
    const impactPoints = areaTargetPoints.length > 1 ? areaTargetPoints : [targetPoint];
    const renderElementalImpact = (pt, idx) => {
      const left = `${pt?.x ?? 50}%`;
      const top = `${pt?.y ?? 47}%`;
      const delay = `${0.86 + idx * 0.08}s`;
      if(fx.type === 'fire') return (
        <div key={`fire_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 170 : 250, height:isMobile ? 170 : 250, transform:'translate(-50%,-50%)', borderRadius:'44% 56% 48% 52%', background:'radial-gradient(circle at 50% 60%,#fff7ed 0%,#fbbf24 17%,#f97316 38%,#7f1d1d 62%,transparent 72%)', filter:'blur(1px)', boxShadow:'0 0 54px rgba(249,115,22,.9)', opacity:0, animation:`battleFireBurst 1.05s ease-out ${delay} both` }} />
      );
      if(fx.type === 'ice') return (
        <div key={`ice_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 150 : 220, height:isMobile ? 150 : 220, transform:'translate(-50%,-50%)', background:'conic-gradient(from 0deg,transparent,#e0f2fe,transparent,#60a5fa,transparent,#bfdbfe,transparent)', clipPath:'polygon(50% 0,61% 35%,98% 35%,68% 56%,79% 91%,50% 70%,21% 91%,32% 56%,2% 35%,39% 35%)', filter:'drop-shadow(0 0 22px #93c5fd)', opacity:0, animation:`battleIceCrystal 1.05s ease-out ${delay} both` }} />
      );
      if(fx.type === 'lightning') return (
        <div key={`lightning_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 72 : 96, height:isMobile ? 230 : 320, transform:'translate(-50%,-72%)', background:'linear-gradient(180deg,#fff7ad,#facc15,#38bdf8)', clipPath:'polygon(44% 0,64% 0,52% 38%,72% 38%,33% 100%,43% 56%,24% 56%)', filter:'drop-shadow(0 0 28px #facc15)', opacity:0, animation:`battleLightningStrike .78s ease-out ${delay} both` }} />
      );
      if(fx.type === 'poison') return (
        <div key={`poison_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 180 : 260, height:isMobile ? 118 : 160, transform:'translate(-50%,-50%)', borderRadius:'50%', background:'radial-gradient(circle,#bbf7d0 0%,rgba(34,197,94,.5) 34%,rgba(20,83,45,.3) 55%,transparent 72%)', filter:'blur(8px)', opacity:0, animation:`battlePoisonCloud 1.15s ease-out ${delay} both` }} />
      );
      if(fx.type === 'shadow') return (
        <div key={`shadow_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 170 : 250, height:isMobile ? 170 : 250, transform:'translate(-50%,-50%)', borderRadius:'50%', background:'conic-gradient(from 90deg,#020617,#581c87,#0f172a,#7e22ce,#020617)', boxShadow:'0 0 54px rgba(88,28,135,.75)', opacity:0, animation:`battleShadowVortex 1.08s ease-out ${delay} both` }} />
      );
      if(fx.type === 'holy' || fx.type === 'divine') return (
        <div key={`holy_${idx}`} style={{ position:'absolute', left, top:'0%', width:isMobile ? 96 : 132, height:'100%', transform:'translateX(-50%)', background:'linear-gradient(180deg,transparent,rgba(254,243,199,.82),rgba(251,191,36,.22),transparent)', filter:'blur(8px)', opacity:0, animation:`battleHolyRay 1.02s ease-out ${delay} both` }} />
      );
      if(fx.type === 'nature') return (
        <div key={`nature_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 155 : 230, height:isMobile ? 155 : 230, transform:'translate(-50%,-48%)', background:'repeating-conic-gradient(from 0deg,transparent 0deg,transparent 24deg,#86efac 28deg,#14532d 34deg,transparent 40deg)', clipPath:'circle(48% at 50% 50%)', filter:'drop-shadow(0 0 18px #22c55e)', opacity:0, animation:`battleNatureBloom 1.05s ease-out ${delay} both` }} />
      );
      if(fx.type === 'sonic') return (
        <div key={`sonic_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 80 : 110, height:isMobile ? 80 : 110, transform:'translate(-50%,-50%)', borderRadius:'50%', border:'2px solid rgba(249,168,212,.85)', boxShadow:'0 0 22px rgba(249,168,212,.7)', opacity:0, animation:`battleSonicWave 1s ease-out ${delay} both` }} />
      );
      if(fx.type === 'control') return (
        <div key={`control_${idx}`} style={{ position:'absolute', left, top, width:isMobile ? 132 : 190, height:isMobile ? 132 : 190, transform:'translate(-50%,-50%)', borderRadius:'50%', border:'3px dashed rgba(196,181,253,.9)', boxShadow:'0 0 32px rgba(124,58,237,.7), inset 0 0 26px rgba(124,58,237,.28)', opacity:0, animation:`battleControlSigil 1.08s ease-out ${delay} both` }} />
      );
      return null;
    };
    return (
      <div key={effectKey} style={base}>
        {chargeFx}
        {fx.type === 'divine' && <div style={{ position:'absolute', left:'50%', top:0, width:isMobile ? 120 : 180, height:'100%', transform:'translateX(-50%)', background:'linear-gradient(180deg,transparent,rgba(254,243,199,.7),rgba(168,85,247,.22),transparent)', filter:'blur(10px)', opacity:0, animation:'battleDivineColumn .95s ease-out .34s both' }} />}
        {!heal && [0,1,2].map(i => (
          <div key={`spark_${i}`} style={{ position:'absolute', left:originX, top:originY, width:isMobile ? 14 : 18, height:isMobile ? 14 : 18, borderRadius:'50%', background:auraColor, boxShadow:`0 0 16px ${auraColor}`, "--dx":dx, "--dy":dy, opacity:0, animation:`battleSparkTrail .82s ease-out ${0.3 + i * .07}s both` }} />
        ))}
        <div style={{ position:'absolute', left:originX, top:originY, width:isMobile ? 58 : 84, height:isMobile ? 58 : 84, borderRadius:'50%', display:'grid', placeItems:'center', color:'#fff', fontSize:isMobile ? '1.3rem' : '1.85rem', background:`radial-gradient(circle,#fff 0%,${auraColor} 22%,${auraColor}88 48%,transparent 72%)`, boxShadow:`0 0 32px ${auraColor}, 0 0 70px ${auraColor}66`, textShadow:`0 0 14px ${auraColor}`, "--dx":dx, "--dy":dy, opacity:0, animation:heal ? 'battleHealBloom .95s ease-out .32s both' : 'battleProjectileTravel .88s cubic-bezier(.16,.85,.3,1) .32s both' }}>
          {magicIcon}
        </div>
        {impactPoints.map((pt, idx) => (
          <div key={`${idx}_${pt?.x}_${pt?.y}`}>
            <div style={{ position:'absolute', left:`${pt?.x ?? 50}%`, top:`${pt?.y ?? 47}%`, width:isMobile ? 146 : 224, height:isMobile ? 146 : 224, transform:'translate(-50%,-50%)', borderRadius:'50%', background:`radial-gradient(circle,#ffffff88 0%,${auraColor}66 18%,${auraColor}24 42%,transparent 70%)`, boxShadow:`inset 0 0 34px ${auraColor}66, 0 0 52px ${auraColor}88`, opacity:0, animation:`battleMagicImpact .95s ease-out ${0.86 + idx * 0.08}s both` }} />
            {renderElementalImpact(pt, idx)}
          </div>
        ))}
        {label && <div style={{ position:'absolute', left:targetX, top:isMobile ? '28%' : '25%', transform:'translateX(-50%)', color:fx.type === 'divine' ? '#fef3c7' : auraColor, fontFamily:"'Cinzel Decorative',serif", fontWeight:900, fontSize:isMobile ? '.82rem' : '1rem', letterSpacing:'.1em', textTransform:'uppercase', textShadow:`0 0 18px ${auraColor}`, whiteSpace:'nowrap', opacity:0, animation:'battleImpactText .95s ease-out .9s both' }}>{label}</div>}
      </div>
    );
  }

  return (
    <div key={effectKey} style={base}>
      <div style={{ position:'absolute', left:targetX, top:targetY, width:isMobile ? 120 : 180, height:isMobile ? 120 : 180, transform:'translate(-50%,-50%)', borderRadius:'50%', background:`radial-gradient(circle,${color}55,transparent 68%)`, boxShadow:`0 0 36px ${color}88`, animation:'battleMagicImpact .8s ease-out forwards' }} />
    </div>
  );
}

function BattlefieldStage({ players, monsters, combatants, activeIdx, floats, isMobile, images, cue, cueTargetId, actionFx, effectKey, actionLog, lang = "it" }) {
  const alivePlayers = players.filter(c => !c.dead && c.hp > 0).length;
  const aliveMonsters = monsters.filter(c => !c.dead && c.hp > 0).length;
  const activeCombatant = combatants[activeIdx];
  const logText = String(actionLog || "");
  const isCritAction = /CRITICO|CRITICAL|critical|critico/i.test(logText);
  const isMissAction = /Mancato|Miss|miss|manca/i.test(logText) || actionFx?.type === "miss";
  const isDivineAction = actionFx?.type === "divine";
  const damageNumbers = [...logText.matchAll(/(?:=>|Danno finale:|Final damage:|Danno ridotto a|Damage reduced to|Danno:|Damage:)[^\d]*(\d+)/gi)].map(m => Number(m[1])).filter(Boolean);
  const bigDamage = damageNumbers.some(n => n >= 60);
  const cameraAnim = actionFx
    ? isDivineAction
      ? "battleCameraDivine 1.45s ease-out both"
      : isCritAction || bigDamage
        ? "battleCameraHeavy 1.08s ease-out both"
        : isMissAction
          ? "battleCameraMiss .78s ease-out both"
          : "battleCameraFocus 1.05s ease-out both"
    : "none";
  const flashColor = isDivineAction ? "rgba(254,243,199,.26)" : isCritAction ? "rgba(251,191,36,.2)" : bigDamage ? "rgba(248,113,113,.18)" : "rgba(255,255,255,.08)";
  const targetCombatants = inferBattleTargets({ log: actionLog, combatants, activeCombatant, fx: actionFx });
  const targetIds = new Set(targetCombatants.map(c => c.id));
  const primaryTarget = targetCombatants[0] || null;
  const originList = activeCombatant?.isPlayer ? players : monsters;
  const targetList = primaryTarget?.isPlayer ? players : monsters;
  const originPoint = stagePointForCombatant(activeCombatant, originList, isMobile);
  const targetPoint = stagePointForCombatant(primaryTarget, targetList, isMobile);
  const areaTargetPoints = targetCombatants.map(t => stagePointForCombatant(t, t.isPlayer ? players : monsters, isMobile));
  const caption = actionCaptionFromLog({ log: actionLog, fx: actionFx, activeCombatant, targetCombatants, lang });

  const renderSide = (list, side) => (
    <div style={{
      display:'flex',
      justifyContent:isMobile ? 'center' : side === 'left' ? 'flex-start' : 'flex-end',
      alignItems:'center',
      gap:isMobile ? 8 : 12,
      flexWrap:'wrap',
      minHeight:isMobile ? 160 : 260,
      paddingRight:!isMobile && side === 'left' ? 10 : 0,
      paddingLeft:!isMobile && side === 'right' ? 10 : 0,
    }}>
      {list.length ? list.map((c, i) => (
        <BattlefieldSprite
          key={c.id || i}
          c={c}
          side={side}
          index={i}
          total={list.length}
          isActive={combatants[activeIdx]?.id === c.id}
          floats={floats}
          isMobile={isMobile}
          imgSrc={images[c.id] || ''}
          cueTarget={cueTargetId === c.id || targetIds.has(c.id)}
          actionSource={combatants[activeIdx]?.id === c.id && !!actionFx}
        />
      )) : (
        <div style={{ textAlign:'center', color:'#4b5563', fontSize:'0.8rem', padding:'1rem' }}>
          {side === 'left' ? 'Nessun alleato' : 'Nessun nemico'}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      position:'relative',
      minHeight:isMobile ? 430 : 390,
      borderRadius:16,
      overflow:'hidden',
      border:'1px solid rgba(148,163,184,0.16)',
      background:'radial-gradient(circle at 18% 34%,rgba(124,58,237,.22),transparent 34%),radial-gradient(circle at 82% 30%,rgba(127,29,29,.28),transparent 36%),linear-gradient(180deg,rgba(15,23,42,.82) 0%,rgba(2,6,23,.94) 58%,rgba(10,6,20,.98) 100%)',
      boxShadow:'inset 0 0 50px rgba(2,6,23,.82), 0 18px 42px rgba(0,0,0,.26)',
      padding:isMobile ? '2.4rem .75rem 1rem' : '2.6rem 1.15rem 1.05rem',
      animation:cameraAnim,
      transformOrigin: activeCombatant?.isPlayer ? "35% 52%" : "65% 52%",
    }}>
      {actionFx && primaryTarget && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', opacity:0.9 }}>
          <defs>
            <linearGradient id="battleTrajectoryGlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="42%" stopColor={actionFx.color || '#f87171'} stopOpacity="0.85" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <line
            x1={originPoint.x}
            y1={originPoint.y}
            x2={targetPoint.x}
            y2={targetPoint.y}
            stroke="url(#battleTrajectoryGlow)"
            strokeWidth={isMobile ? 0.75 : 0.48}
            strokeDasharray="5 4"
            style={{ filter:`drop-shadow(0 0 5px ${actionFx.color || '#f87171'})`, animation:'battleTrajectoryDraw 1.15s ease-out both' }}
          />
        </svg>
      )}
      {actionFx && activeCombatant && (
        <div style={{ position:'absolute', left:`${originPoint.x}%`, top:`${originPoint.y}%`, width:isMobile ? 118 : 160, height:isMobile ? 118 : 160, transform:'translate(-50%,-50%)', borderRadius:'50%', background:`radial-gradient(circle,${actionFx.color || '#f87171'}24,transparent 68%)`, boxShadow:`0 0 34px ${(actionFx.color || '#f87171')}44`, opacity:0, animation:'battleSpotlightPulse 1.15s ease-out both', pointerEvents:'none', zIndex:2 }} />
      )}
      {actionFx && areaTargetPoints.map((pt, idx) => (
        <div key={`target_lock_${idx}_${pt.x}_${pt.y}`} style={{ position:'absolute', left:`${pt.x}%`, top:`${pt.y}%`, width:isMobile ? 92 : 124, height:isMobile ? 92 : 124, transform:'translate(-50%,-50%)', borderRadius:'50%', border:`1px solid ${actionFx.color || '#f87171'}`, boxShadow:`0 0 22px ${(actionFx.color || '#f87171')}66, inset 0 0 16px ${(actionFx.color || '#f87171')}22`, opacity:0, animation:`battleTargetLock 1.05s ease-out ${0.12 + idx * 0.05}s both`, pointerEvents:'none', zIndex:2 }} />
      ))}
      {caption && (
        <div style={{ position:'absolute', left:'50%', top:isMobile ? 42 : 34, transform:'translateX(-50%)', zIndex:8, minWidth:isMobile ? 210 : 280, maxWidth:'78%', padding:isMobile ? '0.44rem 0.72rem' : '0.52rem 0.9rem', borderRadius:999, border:`1px solid ${caption.color}`, background:'linear-gradient(90deg,rgba(2,6,23,.08),rgba(2,6,23,.9) 18%,rgba(15,23,42,.94) 82%,rgba(2,6,23,.08))', boxShadow:`0 0 24px ${caption.color}44`, textAlign:'center', pointerEvents:'none', opacity:0, animation:'battleActionPlate 1.35s ease-out both' }}>
          <div style={{ color:caption.color, fontFamily:"'Cinzel Decorative',serif", fontSize:isMobile ? '.7rem' : '.8rem', fontWeight:900, letterSpacing:'.12em', textTransform:'uppercase', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', textShadow:`0 0 14px ${caption.color}` }}>{caption.title}</div>
          {(caption.meta || caption.value) && (
            <div style={{ marginTop:2, color:'#cbd5e1', fontSize:isMobile ? '.62rem' : '.68rem', display:'flex', justifyContent:'center', gap:8, minWidth:0 }}>
              {caption.meta && <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{caption.meta}</span>}
              {caption.value && <span style={{ color:caption.value.startsWith('+') ? '#4ade80' : '#fca5a5', fontWeight:800, flexShrink:0 }}>{caption.value}</span>}
            </div>
          )}
        </div>
      )}
      {actionFx && !isMissAction && (
        <div style={{
          position:'absolute',
          inset:0,
          background:flashColor,
          mixBlendMode:'screen',
          pointerEvents:'none',
          zIndex:7,
          opacity:0,
          animation:`battleImpactFlash ${isCritAction || isDivineAction || bigDamage ? ".92s" : ".58s"} ease-out .78s both`,
        }} />
      )}
      {actionFx && (isCritAction || bigDamage) && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:6, background:'radial-gradient(circle at 50% 48%,rgba(255,255,255,.18),rgba(248,113,113,.12) 22%,transparent 52%)', opacity:0, animation:'battleShockwave .88s ease-out .72s both' }} />
      )}
      <div style={{ position:'absolute', inset:'0 0 auto', height:'52%', background:'linear-gradient(180deg,rgba(148,163,184,.08),transparent)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', left:'-12%', right:'-12%', bottom:'-17%', height:'42%', borderRadius:'50%', background:'radial-gradient(ellipse,rgba(71,85,105,.52),rgba(15,23,42,.7) 46%,rgba(2,6,23,.95) 72%)', borderTop:'1px solid rgba(148,163,184,.18)' }} />
      <div style={{ position:'absolute', left:'-10%', top:'18%', width:'120%', height:'22%', background:'linear-gradient(90deg,transparent,rgba(148,163,184,.09),transparent)', filter:'blur(10px)', animation:'battleStageMist 6s ease-in-out infinite', pointerEvents:'none' }} />

      <div style={{ position:'absolute', left:12, top:10, display:'flex', alignItems:'center', gap:8, color:'#c4b5fd', fontFamily:"'Cinzel',serif", fontSize:'0.68rem', letterSpacing:'.12em', textTransform:'uppercase' }}>
        <span>🛡️ Party</span>
        <span style={{ color:'#94a3b8', letterSpacing:0 }}>({alivePlayers}/{players.length})</span>
      </div>
      <div style={{ position:'absolute', right:12, top:10, display:'flex', alignItems:'center', gap:8, color:'#fca5a5', fontFamily:"'Cinzel',serif", fontSize:'0.68rem', letterSpacing:'.12em', textTransform:'uppercase' }}>
        <span>💀 Nemici</span>
        <span style={{ color:'#94a3b8', letterSpacing:0 }}>({aliveMonsters}/{monsters.length})</span>
      </div>

      <div style={{
        position:'absolute',
        left:'50%',
        top:'52%',
        transform:'translate(-50%,-50%)',
        width:isMobile ? 52 : 68,
        height:isMobile ? 52 : 68,
        borderRadius:'50%',
        display:'grid',
        placeItems:'center',
        background:'radial-gradient(circle,rgba(239,68,68,.22),rgba(124,58,237,.16),transparent 72%)',
        border:'1px solid rgba(251,191,36,.2)',
        boxShadow:'0 0 24px rgba(239,68,68,.32)',
        animation: cue ? 'battleCenterPulse .9s ease-in-out infinite' : 'none',
        zIndex:2,
      }}>
        <span style={{ fontSize:isMobile ? '1.4rem' : '1.8rem', filter:'drop-shadow(0 0 8px #ef4444)' }}>⚔️</span>
      </div>

      <BattleStageAction
        fx={actionFx}
        activeCombatant={activeCombatant}
        isMobile={isMobile}
        effectKey={effectKey}
        originPoint={originPoint}
        targetPoint={targetPoint}
        areaTargetPoints={areaTargetPoints}
      />

      <div style={{
        position:'relative',
        zIndex:3,
        minHeight:isMobile ? 360 : 318,
        display:'grid',
        gridTemplateColumns:isMobile ? '1fr' : 'minmax(0,1fr) 92px minmax(0,1fr)',
        gap:isMobile ? 18 : 8,
        alignItems:'center',
      }}>
        {renderSide(players, 'left')}
        {!isMobile && <div />}
        {renderSide(monsters, 'right')}
      </div>
    </div>
  );
}

export default function CombatVisualizer({ combat, myId, isMobile, images = {}, cue = null, actionFx = null, effectKey = "", actionLog = "", lang = "it" }) {
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
      <style>{`
        @keyframes battleStageMist { 0%{transform:translateX(-3%);opacity:.42} 50%{transform:translateX(3%);opacity:.68} 100%{transform:translateX(-3%);opacity:.42} }
        @keyframes battleTurnMarker { 0%,100%{transform:translateX(-50%) scale(.82);opacity:.6} 50%{transform:translateX(-50%) scale(1.12);opacity:1} }
        @keyframes battleSpriteIdleLeft { 0%,100%{transform:translateY(0) rotate(-.4deg)} 50%{transform:translateY(-4px) rotate(.5deg)} }
        @keyframes battleSpriteIdleRight { 0%,100%{transform:translateY(0) rotate(.4deg)} 50%{transform:translateY(-4px) rotate(-.5deg)} }
        @keyframes battleSpriteReadyLeft { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-3px) translateX(2px)} }
        @keyframes battleSpriteReadyRight { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-3px) translateX(-2px)} }
        @keyframes battleSpriteStrikeLeft { 0%{transform:translateX(0) scale(1)} 28%{transform:translateX(28px) scale(1.04)} 52%{transform:translateX(-4px) scale(.99)} 100%{transform:translateX(0) scale(1)} }
        @keyframes battleSpriteStrikeRight { 0%{transform:translateX(0) scale(1)} 28%{transform:translateX(-28px) scale(1.04)} 52%{transform:translateX(4px) scale(.99)} 100%{transform:translateX(0) scale(1)} }
        @keyframes battleSpriteRecoilLeft { 0%{transform:translateX(0) scale(1);filter:brightness(1)} 25%{transform:translateX(-18px) rotate(-2deg) scale(.98);filter:brightness(1.65)} 62%{transform:translateX(6px) rotate(.8deg) scale(1.01);filter:brightness(1.05)} 100%{transform:translateX(0) scale(1);filter:brightness(1)} }
        @keyframes battleSpriteRecoilRight { 0%{transform:translateX(0) scale(1);filter:brightness(1)} 25%{transform:translateX(18px) rotate(2deg) scale(.98);filter:brightness(1.65)} 62%{transform:translateX(-6px) rotate(-.8deg) scale(1.01);filter:brightness(1.05)} 100%{transform:translateX(0) scale(1);filter:brightness(1)} }
        @keyframes battleSpriteFall { 0%{transform:translateY(0) rotate(0deg);opacity:1;filter:grayscale(.2)} 58%{transform:translateY(18px) rotate(-5deg);opacity:.7;filter:grayscale(.8)} 100%{transform:translateY(34px) rotate(-8deg);opacity:.46;filter:grayscale(1)} }
        @keyframes battleSpriteWound { 0%,100%{opacity:.1} 50%{opacity:.36} }
        @keyframes battleSpriteHealPulse { 0%{opacity:0;transform:scale(.72)} 34%{opacity:1;transform:scale(1.02)} 100%{opacity:0;transform:scale(1.28)} }
        @keyframes battleStatusAura { 0%,100%{opacity:.45;transform:translateY(0) scale(.95)} 50%{opacity:.9;transform:translateY(-3px) scale(1.04)} }
        @keyframes battleCenterPulse { 0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(.92)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)} }
        @keyframes battleCameraFocus { 0%{transform:scale(1)} 28%{transform:scale(1.018)} 100%{transform:scale(1)} }
        @keyframes battleCameraHeavy { 0%{transform:scale(1) translate(0,0)} 22%{transform:scale(1.025) translate(-4px,2px)} 31%{transform:scale(1.032) translate(5px,-3px)} 42%{transform:scale(1.024) translate(-3px,3px)} 62%{transform:scale(1.012) translate(2px,0)} 100%{transform:scale(1) translate(0,0)} }
        @keyframes battleCameraDivine { 0%{transform:scale(1);filter:brightness(1)} 18%{transform:scale(1.018);filter:brightness(1.25)} 34%{transform:scale(1.035);filter:brightness(1.42)} 72%{transform:scale(1.018);filter:brightness(1.12)} 100%{transform:scale(1);filter:brightness(1)} }
        @keyframes battleCameraMiss { 0%{transform:translateX(0)} 22%{transform:translateX(3px)} 44%{transform:translateX(-3px)} 66%{transform:translateX(2px)} 100%{transform:translateX(0)} }
        @keyframes battleImpactFlash { 0%{opacity:0} 18%{opacity:1} 100%{opacity:0} }
        @keyframes battleShockwave { 0%{opacity:0;transform:scale(.35)} 24%{opacity:.95;transform:scale(.82)} 100%{opacity:0;transform:scale(1.45)} }
        @keyframes battleActionCharge { 0%{opacity:0;transform:translate(-50%,-50%) scale(.38)} 42%{opacity:1;transform:translate(-50%,-50%) scale(.78)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.18)} }
        @keyframes battleActionChargeCore { 0%{opacity:0;transform:translate(-50%,-50%) scale(.25);filter:blur(7px)} 46%{opacity:1;transform:translate(-50%,-50%) scale(.9);filter:blur(1px)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.28);filter:blur(5px)} }
        @keyframes battleTravelLeftToRight { 0%{transform:translate(-10%,-50%) scale(.75);opacity:0} 18%{opacity:1} 78%{opacity:1} 100%{transform:translate(210%,-50%) scale(1.08);opacity:0} }
        @keyframes battleTravelRightToLeft { 0%{transform:translate(10%,-50%) scale(.75) rotate(180deg);opacity:0} 18%{opacity:1} 78%{opacity:1} 100%{transform:translate(-210%,-50%) scale(1.08) rotate(180deg);opacity:0} }
        @keyframes battleProjectileTravel { 0%{transform:translate(-50%,-50%) scale(.72);opacity:0} 18%{opacity:1} 78%{opacity:1} 100%{transform:translate(calc(var(--dx) - 50%),calc(var(--dy) - 50%)) scale(1.08);opacity:0} }
        @keyframes battleBladeTravel { 0%{transform:translate(-50%,-50%) scale(.58);opacity:0} 18%{opacity:1} 68%{opacity:1} 100%{transform:translate(calc(var(--dx) - 50%),calc(var(--dy) - 50%)) scale(1.18);opacity:0} }
        @keyframes battleSparkTrail { 0%{transform:translate(-50%,-50%) scale(.45);opacity:0} 18%{opacity:.9} 100%{transform:translate(calc(var(--dx) - 50%),calc(var(--dy) - 50%)) scale(.1);opacity:0} }
        @keyframes battleSlashImpact { 0%{opacity:0;clip-path:inset(50% 50% 50% 50%);filter:blur(6px)} 28%{opacity:1;clip-path:inset(0 0 0 0);filter:blur(0)} 100%{opacity:0;clip-path:inset(0 0 0 0);filter:blur(5px);transform:translate(-50%,-50%) rotate(18deg) scale(1.2)} }
        @keyframes battleArrowImpact { 0%{opacity:0;transform:translate(-50%,-50%) scale(.35)} 28%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.55)} }
        @keyframes battleShardBurst { 0%{opacity:0;transform:translate(-50%,-50%) rotate(-18deg) scaleX(.2)} 24%{opacity:1} 100%{opacity:0;transform:translate(-50%,-50%) rotate(-18deg) scaleX(1.55)} }
        @keyframes battleMagicImpact { 0%{opacity:0;transform:translate(-50%,-50%) scale(.25)} 28%{opacity:1;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.45)} }
        @keyframes battleFireBurst { 0%{opacity:0;transform:translate(-50%,-40%) scale(.36);filter:blur(10px)} 26%{opacity:1;transform:translate(-50%,-50%) scale(1);filter:blur(1px)} 100%{opacity:0;transform:translate(-50%,-64%) scale(1.42);filter:blur(4px)} }
        @keyframes battleIceCrystal { 0%{opacity:0;transform:translate(-50%,-50%) rotate(0deg) scale(.22)} 34%{opacity:1;transform:translate(-50%,-50%) rotate(28deg) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) rotate(105deg) scale(1.28)} }
        @keyframes battleLightningStrike { 0%,100%{opacity:0;transform:translate(-50%,-78%) scaleY(.32) skewX(0deg)} 12%,46%{opacity:1} 24%{transform:translate(-50%,-72%) scaleY(1.08) skewX(-8deg)} 58%{opacity:.45} }
        @keyframes battlePoisonCloud { 0%{opacity:0;transform:translate(-50%,-28%) scale(.55)} 28%{opacity:.95;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-72%) scale(1.28)} }
        @keyframes battleShadowVortex { 0%{opacity:0;transform:translate(-50%,-50%) rotate(0deg) scale(.35);filter:blur(5px)} 34%{opacity:.92;filter:blur(0)} 100%{opacity:0;transform:translate(-50%,-50%) rotate(240deg) scale(1.35);filter:blur(8px)} }
        @keyframes battleHolyRay { 0%{opacity:0;transform:translateX(-50%) scaleY(.25)} 26%{opacity:.95;transform:translateX(-50%) scaleY(1)} 100%{opacity:0;transform:translateX(-50%) scaleY(1.18)} }
        @keyframes battleNatureBloom { 0%{opacity:0;transform:translate(-50%,-30%) rotate(0deg) scale(.25)} 34%{opacity:.95;transform:translate(-50%,-48%) rotate(24deg) scale(1)} 100%{opacity:0;transform:translate(-50%,-62%) rotate(72deg) scale(1.22)} }
        @keyframes battleSonicWave { 0%{opacity:0;transform:translate(-50%,-50%) scale(.2)} 24%{opacity:.9} 100%{opacity:0;transform:translate(-50%,-50%) scale(2.25)} }
        @keyframes battleControlSigil { 0%{opacity:0;transform:translate(-50%,-50%) rotate(0deg) scale(.4)} 32%{opacity:.95} 100%{opacity:0;transform:translate(-50%,-50%) rotate(300deg) scale(1.28)} }
        @keyframes battleHealBloom { 0%{opacity:0;transform:translate(-50%,-50%) scale(.5)} 35%{opacity:1;transform:translate(-50%,-50%) scale(1.2)} 100%{opacity:0;transform:translate(-50%,-82%) scale(1.55)} }
        @keyframes battleDivineColumn { 0%{opacity:0;transform:translateX(-50%) scaleY(.35)} 30%{opacity:1;transform:translateX(-50%) scaleY(1)} 100%{opacity:0;transform:translateX(-50%) scaleY(1.18)} }
        @keyframes battleImpactText { 0%{opacity:0;transform:translate(-50%,12px) scale(.8)} 25%{opacity:1;transform:translate(-50%,0) scale(1)} 100%{opacity:0;transform:translate(-50%,-26px) scale(1.08)} }
        @keyframes battleTrajectoryDraw { 0%{opacity:0;stroke-dashoffset:34} 22%{opacity:.95} 100%{opacity:0;stroke-dashoffset:0} }
        @keyframes battleSpotlightPulse { 0%{opacity:0;transform:translate(-50%,-50%) scale(.55)} 28%{opacity:.85;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.35)} }
        @keyframes battleTargetLock { 0%{opacity:0;transform:translate(-50%,-50%) scale(1.35) rotate(0deg)} 28%{opacity:1;transform:translate(-50%,-50%) scale(.92) rotate(18deg)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.15) rotate(62deg)} }
        @keyframes battleActionPlate { 0%{opacity:0;transform:translate(-50%,-10px) scale(.92);filter:blur(4px)} 18%{opacity:1;transform:translate(-50%,0) scale(1);filter:blur(0)} 76%{opacity:1} 100%{opacity:0;transform:translate(-50%,-8px) scale(1.02);filter:blur(2px)} }
      `}</style>
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

      <BattlefieldStage
        players={players}
        monsters={monsters}
        combatants={combatants}
        activeIdx={activeIdx}
        floats={floats}
        isMobile={isMobile}
        images={images}
        cue={cue}
        cueTargetId={cueTargetId}
        actionFx={actionFx}
        effectKey={effectKey}
        actionLog={actionLog}
        lang={lang}
      />

      {false && <div style={{
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
      </div>}
    </div>
  );
}
