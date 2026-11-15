/* ============================================================
   SPACE — interactive layer: theme panel, starfield, rocket,
   about chat, flip cards, projects + modal, skills radar,
   resume journey. Depends on js/data.js.
   ============================================================ */
(function () {
  const root = document.documentElement;
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOK = () => !reduceMQ.matches && root.getAttribute('data-motion') !== 'off';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };
  const icon = (id) => `<svg aria-hidden="true"><use href="icons/icons.svg#${id}"></use></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function init() {
    initStarfield();
    initOrbitRadius();
    initRotator();
    initRocket();
    initBackToTopRocket();
    initChat();
    initClock();
    initPrinciples();
    initProjects();
    initAgentLab();
    initSkills();
    initJourney();
    initExperience();
  }

  /* ---------------- starfield ---------------- */
  function initStarfield() {
    const canvas = $('#starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, stars = [], shooting = null, raf = null, visible = true, warp = 0;
    let mx = 0, my = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(220, (w * h) / 5200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1, r: Math.random() * 1.3 + 0.3,
        t: Math.random() * Math.PI * 2
      }));
    }
    function color(a) {
      const c = getComputedStyle(root).getPropertyValue('--star').trim() || '255,255,255';
      return `rgba(${c},${a})`;
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const light = root.getAttribute('data-theme') === 'light';
      const base = light ? 0.45 : 0.9;
      const starRGB = getComputedStyle(root).getPropertyValue('--star').trim() || '255,255,255';
      for (const s of stars) {
        s.t += 0.02;
        s.y += (0.05 + warp * 14) * s.z;
        if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
        const px = s.x + mx * s.z * 14, py = s.y + my * s.z * 10;
        const a = base * (0.45 + 0.55 * Math.abs(Math.sin(s.t))) * s.z;
        ctx.fillStyle = `rgba(${starRGB},${a})`;
        if (warp > 0.05) {
          ctx.fillRect(px, py - warp * 26 * s.z, s.r, warp * 26 * s.z);
        } else {
          ctx.beginPath(); ctx.arc(px, py, s.r * s.z + 0.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!shooting && Math.random() < 0.004) {
        shooting = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.3, life: 1 };
      }
      if (shooting) {
        const g = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x + 90, shooting.y - 40);
        g.addColorStop(0, color(0.9 * shooting.life)); g.addColorStop(1, color(0));
        ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(shooting.x, shooting.y); ctx.lineTo(shooting.x + 90, shooting.y - 40); ctx.stroke();
        shooting.x -= 9; shooting.y += 4; shooting.life -= 0.025;
        if (shooting.life <= 0) shooting = null;
      }
      warp *= 0.97;
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && visible && motionOK()) frame(); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
    function staticDraw() { stop(); resize(); ctx.clearRect(0, 0, w, h); }

    resize();
    window.addEventListener('resize', () => { resize(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(canvas);
    window.addEventListener('motionchange', () => motionOK() ? start() : staticDraw());
    reduceMQ.addEventListener('change', () => motionOK() ? start() : staticDraw());
    const hero = canvas.parentElement;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
    });
    window.__warp = (v) => { warp = v; };
    start();
  }

  function initOrbitRadius() {
    const orbits = $$('.orbit');
    if (!orbits.length) return;
    const set = () => orbits.forEach(o => o.style.setProperty('--r', o.offsetWidth / 2));
    set();
    window.addEventListener('resize', set);
  }

  /* ---------------- hero rotating word ---------------- */
  function initRotator() {
    const el = $('#heroRotator');
    if (!el) return;
    const words = ['fast APIs', 'AI agents', 'clean UIs', 'smart workflows', 'calm platforms'];
    let i = 0;
    if (!motionOK()) return;
    async function type(word) {
      for (let n = el.textContent.length; n >= 0; n--) { el.textContent = el.textContent.slice(0, n); await wait(35); }
      for (let n = 1; n <= word.length; n++) { el.textContent = word.slice(0, n); await wait(70); }
    }
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    (async function loop() {
      while (true) {
        await wait(2400);
        if (document.hidden || !motionOK()) continue;
        i = (i + 1) % words.length;
        await type(words[i]);
      }
    })();
  }

  /* ---------------- rocket launch ---------------- */
  function initRocket() {
    const scene = $('#orbitScene'), btn = $('#launchBtn'), count = $('#launchCount');
    const rocket = $('#heroRocket');
    if (!scene || !btn) return;
    const smoke = rocket.querySelector('.rk-smoke');
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    function puff(n) {
      for (let k = 0; k < n; k++) {
        const p = document.createElement('i');
        p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
        p.style.animationDelay = (k * 60) + 'ms';
        smoke.appendChild(p);
        setTimeout(() => p.remove(), 1400 + k * 60);
      }
    }
    async function launch(thenScroll) {
      if (btn.disabled) return;
      btn.disabled = true;
      const label = btn.querySelector('.lb-text');
      if (!motionOK()) {
        if (thenScroll) document.querySelector('#projects').scrollIntoView();
        btn.disabled = false; return;
      }
      for (const n of ['3', '2', '1']) {
        label.textContent = 'T-minus ' + n;
        count.innerHTML = `<span>${n}</span>`;
        scene.classList.add('shaking');
        puff(2);
        await wait(800);
      }
      count.innerHTML = '<span>🚀</span>';
      label.textContent = 'Liftoff!';
      puff(8);
      scene.classList.remove('shaking');
      scene.classList.add('launched');
      if (window.__warp) window.__warp(1);
      await wait(1100);
      if (thenScroll) document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
      await wait(900);
      scene.classList.remove('launched');
      scene.classList.add('returning');
      count.innerHTML = '';
      await wait(1000);
      scene.classList.remove('returning');
      label.textContent = 'Launch again';
      btn.disabled = false;
    }
    btn.addEventListener('click', () => launch(false));
    rocket.addEventListener('click', () => launch(false));
    const cta = $('#heroLaunchCta');
    if (cta) cta.addEventListener('click', (e) => {
      if (!motionOK()) return;
      e.preventDefault();
      launch(true);
    });
  }

  function initBackToTopRocket() {
    const b = $('#backToTop');
    if (!b) return;
    b.addEventListener('click', () => {
      if (!motionOK()) return;
      b.classList.add('blast');
      setTimeout(() => b.classList.remove('blast'), 900);
    });
  }

  /* ---------------- about: chat ---------------- */
  function initChat() {
    const log = $('#chatLog'), chips = $('#chatChips');
    if (!log || typeof ABOUT_QA === 'undefined') return;
    const add = (cls, html) => {
      const m = document.createElement('div');
      m.className = 'msg ' + cls; m.innerHTML = html;
      log.appendChild(m); log.scrollTop = log.scrollHeight;
      return m;
    };
    add('msg-me', "Hey! 👋 I'm Vignesh. Tap a question below and I'll answer it.");
    let busy = false;
    ABOUT_QA.forEach((qa, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chat-chip'; b.textContent = qa.q;
      b.addEventListener('click', async () => {
        if (busy) return;
        busy = true;
        b.classList.add('asked');
        add('msg-you', esc(qa.q));
        const t = add('msg-me', '<span class="typing" aria-label="typing"><i></i><i></i><i></i></span>');
        await new Promise(r => setTimeout(r, motionOK() ? 650 : 0));
        t.innerHTML = qa.a;
        log.scrollTop = log.scrollHeight;
        busy = false;
      });
      chips.appendChild(b);
    });
  }

  function initClock() {
    const t = $('#chennaiTime'), s = $('#chennaiStatus');
    if (!t) return;
    function tick() {
      const now = new Date();
      t.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
      const h = Number(now.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' })) % 24;
      const day = now.toLocaleString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });
      const weekend = day === 'Sat' || day === 'Sun';
      let msg;
      if (h >= 0 && h < 7) msg = '😴 Probably asleep';
      else if (h < 10) msg = '☕ Coffee and code review';
      else if (h < 19) msg = weekend ? '🧪 Side projects' : '💻 Shipping at work';
      else msg = '📚 Learning and writing';
      s.textContent = msg;
    }
    tick(); setInterval(tick, 30000);
  }

  function initPrinciples() {
    const grid = $('#principleGrid');
    if (!grid || typeof PRINCIPLES === 'undefined') return;
    grid.innerHTML = PRINCIPLES.map(p => `
      <button type="button" class="flip" aria-pressed="false">
        <span class="flip-in">
          <span class="flip-face flip-front">
            <span class="icon-badge">${icon(p.icon).replace('<svg', '<svg class="icon"')}</span>
            <span class="flip-title">${esc(p.title)}</span>
            <span class="more">tap to flip ↻</span>
          </span>
          <span class="flip-face flip-back">${esc(p.text)}</span>
        </span>
      </button>`).join('');
    $$('.flip', grid).forEach(f => f.addEventListener('click', () => {
      const on = f.classList.toggle('flipped');
      f.setAttribute('aria-pressed', String(on));
    }));
  }

  /* ---------------- projects ---------------- */
  let openProject = () => {};
  function initProjects() {
    const grid = $('#projectGrid'), modal = $('#projectModal'), body = $('#projectModalBody');
    if (!grid || typeof PROJECTS === 'undefined') return;
    grid.innerHTML = PROJECTS.map((p, idx) => `
      <button type="button" class="proj-card${p.featured ? ' featured' : ''}${p.wide ? ' wide' : ''}" data-id="${p.id}" data-hue="${p.hue}" style="--tone:var(--c${idx % 3 + 1})" data-cat="${p.category.join(' ')}" id="${p.id}" aria-label="${esc(p.title + ': ' + p.metric.value + ' ' + p.metric.label + '. Open case study')}">
        <span class="pc-cover">
          ${p.featured ? '<span class="pc-feat">★ FEATURED</span>' : ''}
          <span class="pc-metric"><b>${esc(p.metric.value)}</b><span>${esc(p.metric.label)}</span></span>
          <span class="pc-icon">${icon(p.icon)}</span>
        </span>
        <span class="pc-body">
          <span class="pc-title">${esc(p.title)}</span>
          <span class="pc-tag">${esc(p.tagline)}</span>
          <span class="pc-tech">${p.tech.slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}${p.tech.length > 3 ? `<span>+${p.tech.length - 3}</span>` : ''}</span>
        </span>
        <span class="pc-more">Read the story <svg aria-hidden="true"><use href="icons/icons.svg#arrow-right"></use></svg></span>
      </button>`).join('');

    // counts on filter pills
    $$('#projectFilters .fpill').forEach(b => {
      const f = b.dataset.filter;
      const n = f === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.category.includes(f)).length;
      b.insertAdjacentHTML('beforeend', `<span class="cnt">${n}</span>`);
      b.addEventListener('click', () => {
        $$('#projectFilters .fpill').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        $$('.proj-card', grid).forEach((c, i) => {
          const show = f === 'all' || c.dataset.cat.split(' ').includes(f);
          c.classList.toggle('hide', !show);
          if (show && motionOK()) c.animate([{ opacity: 0, transform: 'translateY(12px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: i * 40, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'backwards' });
        });
      });
    });

    // tilt on hover
    if (window.matchMedia('(hover: hover)').matches) {
      $$('.proj-card', grid).forEach(c => {
        c.addEventListener('pointermove', (e) => {
          if (!motionOK()) return;
          const r = c.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
        });
        c.addEventListener('pointerleave', () => { c.style.transform = ''; });
      });
    }

    openProject = (id) => {
      const p = PROJECTS.find(x => x.id === id);
      if (!p || !modal) return;
      const card = grid.querySelector(`[data-id="${id}"]`);
      modal.style.setProperty('--tone', card.style.getPropertyValue('--tone'));
      body.innerHTML = `
        <div class="pm-cover">
          <button type="button" class="pm-close" aria-label="Close">×</button>
          <span class="pc-feat" style="position:static">${p.category.map(c => c.toUpperCase()).join(' · ')}</span>
          <h3 id="pmTitle">${esc(p.title)}</h3>
          <p>${esc(p.tagline)}</p>
          <span class="pm-metric"><b>${esc(p.metric.value)}</b>${esc(p.metric.label)}</span>
        </div>
        <div class="pm-body">
          <div class="pm-steps">
            <div class="pm-step s1"><span class="k"><i>!</i>Problem</span><p>${esc(p.problem)}</p></div>
            <div class="pm-step s2"><span class="k"><i>⚙</i>What I built</span><p>${esc(p.solution)}</p></div>
            <div class="pm-step s3"><span class="k"><i>↑</i>Impact</span><ul>${p.impact.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
          </div>
          ${p.flow ? `<div><span class="pm-sub">How it flows</span><div class="pm-flow">${p.flow.map((s, i) => `${i ? '<em>→</em>' : ''}<span class="${/AI|LLM|MCP/.test(s) ? 'ai' : ''}" style="animation-delay:${i * 120}ms">${esc(s)}</span>`).join('')}</div></div>` : ''}
          ${p.hardest ? `<div class="pm-hard">⚠ <b>Hardest part:</b> ${esc(p.hardest)}</div>` : ''}
          <div><span class="pm-sub">Built with</span><div class="pc-tech">${p.tech.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
        </div>`;
      body.querySelector('.pm-close').addEventListener('click', () => modal.close());
      if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    };
    if (modal) {
      modal.addEventListener('close', () => { document.body.style.overflow = ''; });
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
    }
    grid.addEventListener('click', (e) => {
      const c = e.target.closest('.proj-card');
      if (c) openProject(c.dataset.id);
    });
  }

  /* ---------------- AI agent playground ---------------- */
  function initAgentLab() {
    const log = $('#agentLog'), prompts = $('#agentPrompts'), steps = $('#traceSteps'), total = $('#traceTotal');
    if (!log || typeof AGENT_SCENARIOS === 'undefined') return;
    const ICON = { intent: '🧠', tool: '🔧', result: '📦', guard: '🛡️', reply: '💬' };
    const wait = (ms) => new Promise(r => setTimeout(r, motionOK() ? ms : 0));
    let busy = false;
    const scroll = () => { log.scrollTop = log.scrollHeight; };
    const add = (cls, html) => { const m = document.createElement('div'); m.className = 'msg ' + cls; m.innerHTML = html; log.appendChild(m); scroll(); return m; };

    AGENT_SCENARIOS.forEach((sc) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chat-chip'; b.textContent = sc.prompt;
      b.addEventListener('click', () => run(sc, b));
      prompts.appendChild(b);
    });

    async function run(sc, btn) {
      if (busy) return;
      busy = true;
      $$('.chat-chip', prompts).forEach(c => c.disabled = true);
      btn.classList.add('asked');
      add('msg-you', esc(sc.prompt));
      const typing = add('msg-me', '<span class="typing" aria-label="thinking"><i></i><i></i><i></i></span>');
      steps.innerHTML = '';
      total.textContent = '';
      let ms = 0;
      for (const st of sc.steps) {
        await wait(520);
        ms += st.ms;
        const li = document.createElement('li');
        li.className = 'trace-step t-' + st.type;
        li.innerHTML = `<span class="ts-ico" aria-hidden="true">${ICON[st.type]}</span>
          <span class="ts-body"><span class="ts-label">${esc(st.label)}<em>${st.ms}ms</em></span><code>${esc(st.detail)}</code></span>`;
        steps.appendChild(li);
        total.textContent = ms + 'ms';
      }
      await wait(520);
      const li = document.createElement('li');
      li.className = 'trace-step t-reply';
      const tools = sc.steps.filter(s => s.type === 'tool').length;
      li.innerHTML = `<span class="ts-ico" aria-hidden="true">${ICON.reply}</span><span class="ts-body"><span class="ts-label">Reply sent<em>${tools} tool call${tools === 1 ? '' : 's'}</em></span></span>`;
      steps.appendChild(li);
      typing.innerHTML = sc.reply;
      scroll();
      $$('.chat-chip', prompts).forEach(c => c.disabled = false);
      busy = false;
    }

    const reset = $('#agentReset');
    if (reset) reset.addEventListener('click', () => {
      if (busy) return;
      log.innerHTML = '<div class="msg msg-me">Fresh start. Pick a traveller message below.</div>';
      steps.innerHTML = '<li class="trace-empty">Each step the agent takes shows up here.</li>';
      total.textContent = '';
      $$('.chat-chip', prompts).forEach(c => c.classList.remove('asked'));
    });

    // "Story →" buttons open the project case study
    $$('[data-open-project]').forEach(b => b.addEventListener('click', () => openProject(b.dataset.openProject)));
  }

  /* ---------------- skills ---------------- */
  function initSkills() {
    const tabs = $('#skillTabs'), tiles = $('#skillTiles'), detail = $('#skillDetail'), radar = $('#skillsRadar');
    if (!tabs || typeof SKILL_GROUPS === 'undefined') return;
    const LV = { 3: 'Daily driver', 2: 'Shipped in prod', 1: 'Familiar' };
    const all = { id: 'all', label: 'All', skills: SKILL_GROUPS.flatMap(g => g.skills) };
    const groups = [all, ...SKILL_GROUPS];
    let current = 'all';

    tabs.innerHTML = groups.map(g => `<button type="button" role="tab" class="fpill${g.id === 'all' ? ' active' : ''}" data-g="${g.id}" aria-selected="${g.id === 'all'}">${esc(g.label)}</button>`).join('');

    function render(id) {
      current = id;
      const g = groups.find(x => x.id === id);
      $$('.fpill', tabs).forEach(b => { b.classList.toggle('active', b.dataset.g === id); b.setAttribute('aria-selected', String(b.dataset.g === id)); });
      const list = id === 'all' ? [...g.skills].sort((a, b) => b.level - a.level) : g.skills;
      tiles.innerHTML = list.map((s, i) => `
        <button type="button" class="skill-tile" data-name="${esc(s.name)}" style="--i:${i}">
          <b>${esc(s.name)}${s.used ? `<small>${s.used.length} proj</small>` : ''}</b>
          <span class="skill-bar"><i style="--w:${Math.round(s.level / 3 * 100)}%; --i:${i}; --lvc:var(--c${4 - s.level})"></i></span>
          <span class="lvl">${LV[s.level]}</span>
        </button>`).join('');
      detail.innerHTML = '<span class="sd-hint">👇 Tap a skill to see the projects behind it.</span>';
      drawRadar(id);
    }
    tabs.addEventListener('click', (e) => { const b = e.target.closest('.fpill'); if (b) render(b.dataset.g); });
    tiles.addEventListener('click', (e) => {
      const t = e.target.closest('.skill-tile'); if (!t) return;
      $$('.skill-tile', tiles).forEach(x => x.classList.toggle('on', x === t));
      const s = all.skills.find(x => x.name === t.dataset.name);
      const projs = (s.used || []).map(id => PROJECTS.find(p => p.id === id)).filter(Boolean);
      detail.innerHTML = projs.length
        ? `<b>${esc(s.name)}</b> · ${LV[s.level]} · used in ${projs.map(p => `<button type="button" class="sd-proj" data-id="${p.id}">${esc(p.title)}</button>`).join('')}`
        : `<b>${esc(s.name)}</b> · ${LV[s.level]} · part of my everyday toolkit.`;
    });
    detail.addEventListener('click', (e) => { const b = e.target.closest('.sd-proj'); if (b) openProject(b.dataset.id); });

    // radar
    const cx = 160, cy = 150, R = 100;
    const axes = SKILL_GROUPS.map(g => ({ id: g.id, label: g.label, v: g.skills.reduce((a, s) => a + s.level, 0) / (g.skills.length * 3) }));
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / axes.length; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    function drawRadar(active) {
      if (!radar) return;
      let svg = '';
      [0.25, 0.5, 0.75, 1].forEach(f => { svg += `<polygon class="grid-ring" points="${axes.map((_, i) => pt(i, R * f).join(',')).join(' ')}"/>`; });
      axes.forEach((_, i) => { const [x, y] = pt(i, R); svg += `<line class="axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; });
      svg += `<g class="area-anim"><polygon class="area" points="${axes.map((a, i) => pt(i, R * a.v).join(',')).join(' ')}"/>`;
      axes.forEach((a, i) => { const [x, y] = pt(i, R * a.v); svg += `<circle class="pt" cx="${x}" cy="${y}" r="${a.id === active ? 7 : 4.5}"/>`; });
      svg += '</g>';
      axes.forEach((a, i) => {
        const [x, y] = pt(i, R + 26);
        const anchor = Math.abs(x - cx) < 5 ? 'middle' : x > cx ? 'start' : 'end';
        svg += `<text class="lab${a.id === active ? ' on' : ''}" data-g="${a.id}" x="${x}" y="${y + 4}" text-anchor="${anchor}">${esc(a.label)}</text>`;
      });
      radar.innerHTML = svg;
    }
    if (radar) radar.addEventListener('click', (e) => { const t = e.target.closest('.lab'); if (t) render(t.dataset.g); });

    // draw when visible so the animation is seen
    render(current);
    const board = tiles.closest('.skills-v2') || tiles;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { render(current); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(board);
  }

  /* ---------------- resume journey ---------------- */
  function initJourney() {
    const wrap = $('#journey'), list = $('#journeyStops'), rocket = $('#journeyRocket'), fill = $('#journeyFill'), detail = $('#journeyDetail');
    if (!wrap || typeof JOURNEY === 'undefined') return;
    list.style.setProperty('--n', JOURNEY.length);
    list.innerHTML = JOURNEY.map((j, i) => `
      <li><button type="button" class="jstop" data-i="${i}" aria-label="${esc(j.when + ': ' + j.title)}">
        <span class="dot">${icon(j.icon)}</span>
        <span class="txt"><span class="when">${esc(j.when)}</span><span class="ttl">${esc(j.title)}</span></span>
      </button></li>`).join('');
    const stops = $$('.jstop', list);
    const vertical = () => window.matchMedia('(max-width:640px)').matches;

    function go(i) {
      const dot = stops[i].querySelector('.dot');
      const wr = wrap.getBoundingClientRect(), dr = dot.getBoundingClientRect();
      const x = dr.left + dr.width / 2 - wr.left, y = dr.top + dr.height / 2 - wr.top;
      if (vertical()) {
        rocket.style.left = x + 'px'; rocket.style.top = y + 'px';
        const first = stops[0].querySelector('.dot').getBoundingClientRect();
        const last = stops[stops.length - 1].querySelector('.dot').getBoundingClientRect();
        fill.style.setProperty('--fh', ((dr.top - first.top) / Math.max(1, last.top - first.top) * 100) + '%');
      } else {
        rocket.style.left = x + 'px'; rocket.style.top = '';
        const track = fill.parentElement.getBoundingClientRect();
        fill.style.width = Math.max(0, (dr.left + dr.width / 2 - track.left) / track.width * 100) + '%';
      }
      stops.forEach((s, k) => { s.classList.toggle('active', k === i); s.classList.toggle('passed', k <= i); });
      const j = JOURNEY[i];
      detail.innerHTML = `<h3>${esc(j.title)}</h3><span class="place">${esc(j.place)} · ${esc(j.when)}</span><p>${esc(j.text)}</p>`;
      go.cur = i;
    }
    stops.forEach((s, i) => s.addEventListener('click', () => go(i)));
    window.addEventListener('resize', () => go(go.cur || 0));
    go(0);

    // auto-fly to the present the first time the section is seen
    const nowIdx = JOURNEY.length - 3; // last real role before award/next
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (!motionOK()) { go(nowIdx); return; }
      for (let i = 1; i <= nowIdx; i++) { await new Promise(r => setTimeout(r, 700)); go(i); }
    }, { threshold: 0.5 });
    io.observe(wrap);
  }

  /* ---------------- experience: collapse long bullets ---------------- */
  function initExperience() {
    $$('#experience .tl-item').forEach(item => {
      const lis = $$('li', item);
      if (!lis.length) return;
      lis.forEach(li => {
        const strong = li.querySelector('strong');
        if (!strong) return;
        const rest = document.createElement('span');
        rest.className = 'exp-detail';
        while (strong.nextSibling) rest.appendChild(strong.nextSibling);
        li.appendChild(rest);
        strong.textContent = strong.textContent.replace(/:\s*$/, '');
        rest.insertBefore(document.createTextNode(': '), rest.firstChild);
      });
      item.classList.add('exp-collapsible');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'exp-toggle';
      b.setAttribute('aria-expanded', 'false');
      b.textContent = `Show details (${lis.length})`;
      b.addEventListener('click', () => {
        const open = item.classList.toggle('open');
        b.setAttribute('aria-expanded', String(open));
        b.textContent = open ? 'Hide details' : `Show details (${lis.length})`;
      });
      item.appendChild(b);
    });
  }

  if (window.__componentsLoaded) init();
  else window.addEventListener('componentsLoaded', init, { once: true });
})();
