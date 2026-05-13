import { useEffect, useRef } from 'react';

const BG_URL = '/assets/Zodarsfondo.png';

// ── Region coordinates (UV 0–1, origin top-left) ─────────────────────────────
// Adjust these to match where the elements appear in Zodarsfondo.png
const WF = { x: 0.04, y: 0.18, w: 0.22, h: 0.62 };  // waterfall (left side)
const PT = { cx: 0.52, cy: 0.44, r: 0.19 };           // portal (center)
const FL = { x: 0.00, y: 0.48, w: 0.13, h: 0.52 };   // fire left
const FR = { x: 0.87, y: 0.48, w: 0.13, h: 0.52 };   // fire right

const VS = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
}`;

const FS = `
precision mediump float;
uniform sampler2D u_tex;
uniform float     u_t;
uniform vec2      u_imgRatio; // vec2(canvasW/imgW, canvasH/imgH) for cover-fit
varying vec2      v_uv;

// ── Noise ──────────────────────────────────────────────────────────────────
float h21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float smooth2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(h21(i), h21(i+vec2(1,0)), f.x),
    mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p) {
  return smooth2(p)*0.5 + smooth2(p*2.1)*0.25 + smooth2(p*4.3)*0.125;
}

// ── Masks ──────────────────────────────────────────────────────────────────
float rectMask(vec2 uv, float x, float y, float w, float h) {
  return smoothstep(x, x+0.035, uv.x) * smoothstep(x+w, x+w-0.035, uv.x)
       * smoothstep(y, y+0.035, uv.y) * smoothstep(y+h, y+h-0.035, uv.y);
}
float circleMask(vec2 uv, float cx, float cy, float r) {
  return smoothstep(r, r-0.04, length(uv - vec2(cx, cy)));
}

// ── Cover-fit UV ───────────────────────────────────────────────────────────
vec2 coverUV(vec2 uv) {
  float s = max(u_imgRatio.x, u_imgRatio.y);
  vec2 scaled = vec2(u_imgRatio.x / s, u_imgRatio.y / s);
  return (uv - 0.5) * scaled + 0.5;
}

void main() {
  vec2 uv = v_uv;
  vec2 disp = vec2(0.0);

  // ── Waterfall ─────────────────────────────────────────────────────────────
  float wm = rectMask(uv, ${WF.x.toFixed(3)}, ${WF.y.toFixed(3)}, ${WF.w.toFixed(3)}, ${WF.h.toFixed(3)});
  if (wm > 0.002) {
    float flow = mod(uv.y + u_t * 0.22, 1.0);
    float wx = sin(flow * 38.0 + uv.x * 14.0 + u_t * 0.8) * 0.0025
             + sin(flow * 19.0 + uv.x *  7.0 - u_t * 0.5) * 0.0015;
    float wy = (fbm(vec2(uv.x * 5.0, flow * 4.5 + u_t * 0.4)) - 0.5) * 0.005;
    disp += vec2(wx, wy) * wm;
  }

  // ── Portal / water mirror ──────────────────────────────────────────────────
  float pm = circleMask(uv, ${PT.cx.toFixed(3)}, ${PT.cy.toFixed(3)}, ${PT.r.toFixed(3)});
  if (pm > 0.002) {
    vec2  dc   = uv - vec2(${PT.cx.toFixed(3)}, ${PT.cy.toFixed(3)});
    float dist = length(dc);
    vec2  dn   = normalize(dc + 0.0001);
    // concentric ripples emanating outward
    float ripple  = sin(dist * 32.0 - u_t * 3.8) * 0.006
                  + sin(dist * 18.0 - u_t * 2.2) * 0.003;
    ripple *= (1.0 - dist / ${PT.r.toFixed(3)});
    // slow swirl
    float angle   = atan(dc.y, dc.x);
    float swirl   = sin(angle * 4.0 + u_t * 1.1) * 0.003 * pm;
    disp += dn * ripple * pm + vec2(-dn.y, dn.x) * swirl;
  }

  // ── Fire (left + right torches) ───────────────────────────────────────────
  float flm = rectMask(uv, ${FL.x.toFixed(3)}, ${FL.y.toFixed(3)}, ${FL.w.toFixed(3)}, ${FL.h.toFixed(3)});
  float frm = rectMask(uv, ${FR.x.toFixed(3)}, ${FR.y.toFixed(3)}, ${FR.w.toFixed(3)}, ${FR.h.toFixed(3)});
  float fm  = max(flm, frm);
  if (fm > 0.002) {
    float ff   = fbm(vec2(uv.x * 9.0 + u_t * 0.6, uv.y * 7.0 - u_t * 2.2));
    float rise = (1.0 - uv.y);   // stronger distortion near top of fire
    disp += vec2(
      (ff - 0.5) * 0.014 * rise,
      -(ff * ff)  * 0.009 * rise
    ) * fm;
  }

  // ── Global ambient shimmer (whole image breathes slightly) ────────────────
  disp += vec2(
    sin(uv.y * 7.0 + u_t * 0.35) * 0.00055,
    sin(uv.x * 5.0 + u_t * 0.28) * 0.00040
  );

  // Sample with cover-fit UV
  vec2 finalUV = coverUV(clamp(uv + disp, 0.001, 0.999));
  gl_FragColor = texture2D(u_tex, clamp(finalUV, 0.001, 0.999));
}`;

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function buildProgram(gl, vs, fs) {
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return; // fallback: CSS background visible

    // ── Compile shaders ──────────────────────────────────────────────────────
    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = buildProgram(gl, vs, fs);
    if (!prog) return;

    // ── Full-screen quad ─────────────────────────────────────────────────────
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const aPosLoc     = gl.getAttribLocation(prog, 'a_pos');
    const uTexLoc     = gl.getUniformLocation(prog, 'u_tex');
    const uTimeLoc    = gl.getUniformLocation(prog, 'u_t');
    const uRatioLoc   = gl.getUniformLocation(prog, 'u_imgRatio');

    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // ── Texture ──────────────────────────────────────────────────────────────
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // placeholder 1×1 pixel while image loads
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([10, 6, 23, 255]));

    let imgW = 1, imgH = 1;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    img.src = BG_URL;

    // ── Resize ───────────────────────────────────────────────────────────────
    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Render loop ──────────────────────────────────────────────────────────
    let raf;
    const t0 = performance.now();

    function draw() {
      const t = (performance.now() - t0) / 1000;

      // Cover-fit: ratio of canvas dimensions to image dimensions
      const scaleX = canvas.width  / imgW;
      const scaleY = canvas.height / imgH;
      const s = Math.max(scaleX, scaleY);

      gl.useProgram(prog);
      gl.uniform1f(uTimeLoc, t);
      gl.uniform1i(uTexLoc, 0);
      gl.uniform2f(uRatioLoc, scaleX / s, scaleY / s);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.deleteTexture(tex);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
