import { useEffect, useRef } from 'react';

const STARS = 55;
const EMBERS = 18;
const WISPS = 4;

function rand(min, max) { return min + Math.random() * (max - min); }

function initStars(W, H) {
  return Array.from({ length: STARS }, () => ({
    x: rand(0, W), y: rand(0, H),
    r: rand(0.6, 1.8),
    speed: rand(0.04, 0.14),
    angle: rand(0, Math.PI * 2),
    twinkleSpeed: rand(0.008, 0.022),
    twinkleOffset: rand(0, Math.PI * 2),
    baseAlpha: rand(0.35, 0.85),
  }));
}

function initEmbers(W, H) {
  return Array.from({ length: EMBERS }, () => resetEmber({}, W, H));
}

function resetEmber(e, W, H) {
  e.x = rand(0, W);
  e.y = H + rand(10, 60);
  e.r = rand(1, 2.8);
  e.speedY = rand(0.3, 0.9);
  e.drift = rand(-0.25, 0.25);
  e.life = 0;
  e.maxLife = rand(180, 380);
  e.hue = rand(12, 38); // orange-red
  return e;
}

function initWisps(W, H) {
  return Array.from({ length: WISPS }, (_, i) => ({
    x: rand(0, W),
    y: rand(0, H),
    r: rand(W * 0.2, W * 0.38),
    speedX: rand(-0.06, 0.06) * (i % 2 === 0 ? 1 : -1),
    speedY: rand(-0.04, 0.04),
    hue: [220, 260, 200, 280][i],
    alpha: rand(0.025, 0.055),
  }));
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let stars, embers, wisps;
    let W, H;
    let frame = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars = initStars(W, H);
      embers = initEmbers(W, H);
      wisps = initWisps(W, H);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // ── Nebula wisps ──
      wisps.forEach(w => {
        w.x += w.speedX;
        w.y += w.speedY;
        if (w.x < -w.r) w.x = W + w.r;
        if (w.x > W + w.r) w.x = -w.r;
        if (w.y < -w.r) w.y = H + w.r;
        if (w.y > H + w.r) w.y = -w.r;
        const g = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
        g.addColorStop(0, `hsla(${w.hue},60%,38%,${w.alpha})`);
        g.addColorStop(1, `hsla(${w.hue},60%,20%,0)`);
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // ── Stars ──
      stars.forEach(s => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H;
        if (s.y > H) s.y = 0;
        const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
      });

      // ── Embers ──
      embers.forEach(e => {
        e.life++;
        e.y -= e.speedY;
        e.x += e.drift;
        const progress = e.life / e.maxLife;
        const alpha = progress < 0.15
          ? progress / 0.15 * 0.85
          : (1 - progress) * 0.85;
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 2);
        g.addColorStop(0, `hsla(${e.hue},95%,75%,${alpha})`);
        g.addColorStop(0.5, `hsla(${e.hue},90%,55%,${alpha * 0.6})`);
        g.addColorStop(1, `hsla(${e.hue},80%,40%,0)`);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        if (e.life >= e.maxLife) resetEmber(e, W, H);
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.72,
      }}
    />
  );
}
