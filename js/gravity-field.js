/* ============================================================
   GRAVITY FIELD — glossy Three.js spheres behind the whole
   portfolio, driven by scroll (ported from gravity/index.html):
     hero        → spheres float on the right, clear of the headline
     hero leaves → they fall and bounce off the floor
     achievements→ they reassemble into a heart
     the end     → they lift off and rush into the lens
   Colours walk the palette c1 → c2 → c3 along the way and follow
   the theme. The cursor pushes them away. Static when animations
   are off; hidden in the blog view.
   ============================================================ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const root = document.documentElement;
const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches && root.getAttribute('data-motion') !== 'off';
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

function start() {
  const hero = document.getElementById('top'), heartAt = document.getElementById('achievements');
  const view = document.getElementById('view-portfolio');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'gravity-field';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch (e) { canvas.remove(); return; }   // no WebGL: the page keeps its own glows
  root.classList.add('gravity-on');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 11);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8899bb, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(4, 7, 9); scene.add(key);

  const small = innerWidth < 768;
  const wide = () => innerWidth >= 1200;
  const COUNT = small ? 44 : 60;
  const geo = new THREE.SphereGeometry(1, 48, 48);
  const balls = [];
  for (let i = 0; i < COUNT; i++) {
    const f = i / COUNT, rnd = Math.random();
    const r = (f < 0.3 ? 0.27 + rnd * 0.12 : f < 0.8 ? 0.42 + rnd * 0.18 : 0.66 + rnd * 0.21) * (small ? 0.55 : 0.8);
    const glass = Math.random() < 0.22;
    const mat = glass
      ? new THREE.MeshPhysicalMaterial({ roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03, transmission: 0.95, ior: 1.485, thickness: 2.2, emissiveIntensity: 0.12 })
      : new THREE.MeshPhysicalMaterial({ roughness: 0.44, clearcoat: 0.24, clearcoatRoughness: 0.35, emissiveIntensity: 0.08 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(r);
    scene.add(mesh);
    balls.push({ mesh, mat, glass, r, m: r * r * r, tone: Math.random() < 0.6 ? 0 : Math.random() < 0.6 ? 1 : 2,
      tint: Math.random(), stages: [], p: new THREE.Vector3(), v: new THREE.Vector3(),
      home: new THREE.Vector3(), heart: new THREE.Vector3(), phase: Math.random() * 6.28 });
  }

  // three colour stages per sphere: its palette tone, then the next one, then the one after (c1 → c2 → c3 for most)
  const mix = new THREE.Color();
  function recolor() {
    const cs = getComputedStyle(root), dark = root.getAttribute('data-theme') === 'dark';
    const tones = ['--c1', '--c2', '--c3'].map(v => new THREE.Color(cs.getPropertyValue(v).trim() || '#3B82F6'));
    const white = new THREE.Color('#ffffff');
    renderer.toneMappingExposure = dark ? 1.1 : 1.15;
    for (const b of balls) {
      const w = b.glass ? 0.4 : (dark ? 0 : 0.2) + b.tint * (dark ? 0.2 : 0.3);
      b.stages = [0, 1, 2].map(k => tones[(b.tone + k) % 3].clone().lerp(white, w));
    }
    paint(state.progress);
    if (!running) draw();
  }
  function paint(pr) {
    const t2 = smoothstep(0.55, 1.05, pr), t3 = smoothstep(1.40, 1.95, pr);
    for (const b of balls) {
      mix.copy(b.stages[0]).lerp(b.stages[1], t2).lerp(b.stages[2], t3);
      b.mat.color.copy(mix); b.mat.emissive.copy(mix);
      if (b.glass) b.mat.attenuationColor.copy(mix);
    }
  }

  // frustum at z = 0, hero cluster (right column on wide screens), heart targets
  const bounds = { w: 1, h: 1, left: -1 };
  function layout() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    bounds.h = Math.tan(THREE.MathUtils.degToRad(19)) * 11; bounds.w = bounds.h * camera.aspect;
    bounds.left = wide() ? bounds.w * 0.1 : -bounds.w;   // keeps the hero headline clear
    const cx = wide() ? bounds.w * 0.52 : bounds.w * 0.5, cy = wide() ? bounds.h * 0.05 : bounds.h * 0.5;
    const rx = wide() ? bounds.w * 0.3 : bounds.w * 0.45, ry = wide() ? bounds.h * 0.55 : bounds.h * 0.3;
    const hs = Math.min(bounds.w * (small ? 0.68 : 0.5), bounds.h * 0.6);
    balls.forEach((b, i) => {
      const a = Math.random() * 6.28, d = Math.sqrt(Math.random());
      b.home.set(cx + Math.cos(a) * d * rx, cy + Math.sin(a) * d * ry, (Math.random() - 0.5) * 2.4);
      let x, y;   // rejection-sample the filled heart (x²+y²−1)³ − x²y³ ≤ 0
      // every other sphere goes to the rim, so the outline reads even with few spheres
      const rim = i % 5 < 3;   // 60% on the rim
      let f;
      do { x = (Math.random() * 2 - 1) * 1.15; y = Math.random() * 2.35 - 1.05; f = Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y; }
      while (f > 0 || (rim && f < -0.06));
      b.heart.set(x * hs, (y - 0.15) * hs, (Math.random() - 0.5) * 0.8);
    });
  }

  // scroll → progress on the Gravity scale, pinned to the page's own sections:
  // 0 top, 1 hero gone, 2.05 heart formed at Achievements, 3.45 the bottom of the page
  const state = { progress: 0, shapeF: 0 };
  function measure() {
    const y = scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const a1 = hero.offsetTop + hero.offsetHeight;
    const a2 = heartAt ? Math.min(heartAt.getBoundingClientRect().top + y - innerHeight * 0.2, max * 0.75) : max * 0.55;
    const pts = [[0, 0], [a1, 1], [Math.max(a2, a1 + 1), 2.05], [Math.max(max, a2 + 1), 3.45]];
    for (let i = 1; i < pts.length; i++) {
      if (y <= pts[i][0] || i === pts.length - 1) {
        const [x0, p0] = pts[i - 1], [x1, p1] = pts[i];
        state.progress = lerp(p0, p1, clamp((y - x0) / (x1 - x0), 0, 1));
        break;
      }
    }
    // full strength behind the hero, faint behind reading text, gone as the field leaves through the lens
    const pr = state.progress, heroOp = wide() ? 0.9 : 0.4;
    const shapeBoost = 0.15 * smoothstep(1.6, 2.05, pr) * (1 - smoothstep(2.55, 3.0, pr));   // a touch stronger while the heart holds
    canvas.style.opacity = ((lerp(heroOp, small ? 0.3 : 0.4, smoothstep(0.6, 1.1, pr)) + shapeBoost) * (1 - smoothstep(3.2, 3.45, pr))).toFixed(3);
  }

  const mouse = { x: 99, y: 99, speed: 0, lx: 99, ly: 99, down: false };
  addEventListener('pointermove', e => { mouse.x = (e.clientX / innerWidth * 2 - 1) * bounds.w; mouse.y = -(e.clientY / innerHeight * 2 - 1) * bounds.h; }, { passive: true });
  addEventListener('pointerdown', () => { mouse.down = true; });
  addEventListener('pointerup', e => { mouse.down = false; if (e.pointerType !== 'mouse') mouse.x = mouse.y = 99; });
  root.addEventListener('mouseleave', () => { mouse.x = mouse.y = 99; });

  const clock = new THREE.Clock(), tmp = new THREE.Vector3();
  let running = false, raf = 0, entrance = 0;

  function step() {
    const dt = Math.min(clock.getDelta(), 0.05), s = dt * 60, t = clock.elapsedTime, pr = state.progress;
    const heroF = 1 - smoothstep(0.30, 0.80, pr);
    const dropF = smoothstep(0.40, 0.95, pr) * (1 - smoothstep(1.25, 1.75, pr));
    const shapeF = smoothstep(1.40, 2.05, pr) * (1 - smoothstep(2.55, 3.0, pr));
    const flyF = smoothstep(2.7, 3.45, pr);
    state.shapeF = shapeF;
    const boost = lerp(7.5, 1, 1 - Math.pow(1 - clamp((t - entrance) / 2.2, 0, 1), 3));
    paint(pr);

    const active = Math.abs(mouse.x) < 90;
    if (active && Math.abs(mouse.lx) < 90) mouse.speed += (Math.min(Math.hypot(mouse.x - mouse.lx, mouse.y - mouse.ly) / Math.max(s, 0.01), 3) - mouse.speed) * 0.3;
    else mouse.speed *= 0.9;
    mouse.lx = mouse.x; mouse.ly = mouse.y;
    const repR = 3.4 * (mouse.down ? 1.4 : 1), repF = 0.05 * (mouse.down ? 1.7 : 1) * (1 + mouse.speed * 3.2);
    const damp = Math.pow(lerp(0.91, 0.975, dropF * (1 - shapeF)), s);
    const left = heroF > 0.5 ? bounds.left : -bounds.w;

    for (const b of balls) {
      const { p, v } = b;
      if (heroF > 0) {
        tmp.copy(b.home); tmp.x += Math.sin(t * 0.5 + b.phase) * 0.25; tmp.y += Math.cos(t * 0.4 + b.phase) * 0.25;
        v.addScaledVector(tmp.sub(p), 0.0035 * boost * heroF * s);
      }
      v.y -= 0.02 * dropF * s;
      if (shapeF > 0) v.addScaledVector(tmp.copy(b.heart).sub(p), 0.03 * shapeF * s);
      if (flyF > 0) { v.z += 0.03 * flyF * s; v.x += p.x * 0.004 * flyF * s; v.y += p.y * 0.004 * flyF * s; }
      if (active && p.z < 6) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy) || 1e-4;
        if (d < repR) { const k = repF * Math.pow(1 - d / repR, 3) * s; v.x += dx / d * k; v.y += dy / d * k; }
      }
      v.multiplyScalar(damp);
      p.addScaledVector(v, s);
      if (flyF < 0.5) {
        const xl = bounds.w - b.r - 0.2, xmin = Math.max(-xl, left + b.r), floor = -bounds.h + b.r;
        if (p.x > xl) { p.x = xl; v.x *= -0.3; } else if (p.x < xmin) { p.x = xmin; v.x *= -0.3; }
        if (p.y < floor) { p.y = floor; v.y = Math.abs(v.y) * (0.3 + 0.35 * dropF); }
      }
      if (flyF < 0.02 && Math.abs(p.z) > 2) { p.z = Math.sign(p.z) * 2; v.z *= -0.3; }
    }

    const cs = 0.28 * (1 - 0.93 * shapeF) * (1 - flyF);   // spheres may overlap inside the heart and on the way out
    if (cs > 0.001) for (let k = 0; k < 4; k++) for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i], c = balls[j], dx = c.p.x - a.p.x, dy = c.p.y - a.p.y, dz = c.p.z - a.p.z, min = a.r + c.r;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 >= min * min || d2 === 0) continue;
      const d = Math.sqrt(d2), o = (min - d) * cs / d, tm = a.m + c.m;
      a.p.x -= dx * o * c.m / tm; a.p.y -= dy * o * c.m / tm; a.p.z -= dz * o * c.m / tm;
      c.p.x += dx * o * a.m / tm; c.p.y += dy * o * a.m / tm; c.p.z += dz * o * a.m / tm;
    }
  }

  function draw() {
    const shrink = 1 - (small ? 0 : 0.15) * state.shapeF;   // wide screens: slightly smaller spheres keep the heart's edge crisp
    for (const b of balls) { b.mesh.position.copy(b.p); b.mesh.scale.setScalar(b.r * shrink); b.mesh.visible = b.p.z < camera.position.z - 0.6; }
    renderer.render(scene, camera);
  }
  function loop() { raf = requestAnimationFrame(loop); step(); draw(); }
  function sync() {
    const shown = !(view && view.hidden);
    canvas.hidden = !shown;
    const want = shown && motionOK() && !document.hidden;
    if (want === running) return;
    running = want;
    if (running) { clock.getDelta(); loop(); } else { cancelAnimationFrame(raf); draw(); }
  }

  layout(); measure();
  if (motionOK()) {
    // fly in from off screen
    const R = Math.max(bounds.w, bounds.h) * 2.4;
    for (const b of balls) { const a = Math.random() * 6.28; b.p.set(Math.cos(a) * R, Math.sin(a) * R, 0); b.v.copy(b.home).sub(b.p).multiplyScalar(0.04); }
  } else for (const b of balls) b.p.copy(b.home);
  recolor();

  let queued = false;
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; measure(); }); } }, { passive: true });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layout(); measure(); if (!running) { balls.forEach(b => b.p.copy(b.home)); draw(); } }, 150); });
  new MutationObserver(() => { recolor(); sync(); }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-palette', 'data-motion'] });
  if (view) new MutationObserver(() => { measure(); sync(); }).observe(view, { attributes: true, attributeFilter: ['hidden'] });
  addEventListener('motionchange', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
}

window.__componentsLoaded ? start() : addEventListener('componentsLoaded', start, { once: true });
