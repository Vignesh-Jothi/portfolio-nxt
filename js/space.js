/* ============================================================
   SECTIONS — renders About, Projects (+ case-study dialog),
   Skills, the tagline reveal and the experience toggle,
   from js/data.js.
   ============================================================ */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  // honours the OS setting and the theme panel's "Animations" switch
  const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.getAttribute('data-motion') !== 'off';
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function init() {
    initProjects();
    countUp($$('.impact-stats dd'));
    initTagline();
    initSkills();
    initExperience();
    initPipeline();
    initFloatCta();
    initSystemMap();
    initScrollStory();
  }

  /* ---------------- scroll story: each section's glow peaks when it is centred; the career line draws as you read ---------------- */
  function initScrollStory() {
    const secs = $$('#main section[id]').filter(s => !s.classList.contains('tagline'));  // the tagline runs its own story
    const tl = $('#experience .tl'), hero = $('#top');
    // the light swaps sides section by section, and the closing call to action gets a centred one
    secs.forEach((s, i) => { s.classList.add('story-sec'); s.dataset.glow = s.id === 'resume' ? 'center' : (i % 2 ? 'right' : 'left'); s.dataset.tone = String(i % 3 + 1); });  // tone cycles the palette's three colours
    let queued = false;
    const update = () => {
      queued = false;
      const vh = innerHeight, on = motionOK();
      secs.forEach(s => {
        const r = s.getBoundingClientRect();
        // 1 with the section centred in the viewport, 0 once it is fully off screen
        const d = Math.abs(r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        s.style.setProperty('--sv', on ? Math.max(0, 1 - d).toFixed(3) : '0');
      });
      if (hero) {
        // the hero starts on screen, so its glow simply fades as you scroll past it
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--sv', on ? Math.max(0, Math.min(1, r.bottom / r.height)).toFixed(3) : '1');
      }
      if (tl) {
        const r = tl.getBoundingClientRect();
        tl.style.setProperty('--tp', on ? Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height)).toFixed(3) : '1');
      }
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ---------------- projects ---------------- */
  function initProjects() {
    const list = $('#projectGrid'), modal = $('#projectModal'), body = $('#projectModalBody');
    if (!list || typeof PROJECTS === 'undefined') return;

    const FEATURED = 3;  // what a skimming recruiter sees first
    list.innerHTML = PROJECTS.map((p, k) => `
      <li${k >= FEATURED ? ' class="pr-extra" hidden' : ''}>
        <button type="button" class="proj-row" data-id="${p.id}" id="${p.id}">
          <span class="pr-main">
            <span class="pr-title">${esc(p.title)}</span>
            <span class="pr-line">${esc(p.tagline)}</span>
            <span class="pr-result">${esc(p.impact[0])}</span>
            <span class="pr-stack">${p.tech.map(esc).join(', ')}</span>
          </span>
          ${p.metric ? `<span class="pr-metric"><b>${esc(p.metric.value)}</b><span>${esc(p.metric.label)}</span></span>` : ''}
          <svg class="pr-arrow" aria-hidden="true"><use href="icons/icons.svg#arrow-right"></use></svg>
        </button>
      </li>`).join('');

    countUp($$('.pr-metric b', list));

    const more = $('#projMore'), extra = $$('.pr-extra', list);
    if (more) {
      const label = () => { more.textContent = more.getAttribute('aria-expanded') === 'true' ? 'Show fewer projects' : `Show ${extra.length} more projects`; };
      label();
      more.addEventListener('click', () => {
        const open = more.getAttribute('aria-expanded') !== 'true';
        more.setAttribute('aria-expanded', String(open));
        extra.forEach(li => { li.hidden = !open; });
        label();
      });
    }

    function open(id) {
      const p = PROJECTS.find(x => x.id === id);
      if (!p || !modal) return;
      body.innerHTML = `
        <div class="pm-head">
          <h3 id="pmTitle">${esc(p.title)}</h3>
          <p>${esc(p.tagline)}</p>
          ${p.metric ? `<p class="pm-metric"><b>${esc(p.metric.value)}</b> ${esc(p.metric.label)}</p>` : ''}
          <button type="button" class="pm-close" aria-label="Close">×</button>
        </div>
        <div class="pm-body">
          <h4>Problem</h4><p>${esc(p.problem)}</p>
          <h4>What I built</h4><p>${esc(p.solution)}</p>
          ${p.flow ? `<h4>How it works</h4><ol class="pm-flow">${p.flow.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
          <h4>Impact</h4><ul>${p.impact.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          ${p.hardest ? `<h4>Hardest part</h4><p>${esc(p.hardest)}</p>` : ''}
          <p class="pm-stack">Built with ${p.tech.map(esc).join(', ')}</p>
        </div>`;
      body.querySelector('.pm-close').addEventListener('click', close);
      modal.showModal();
    }
    function close() {
      if (!motionOK()) return modal.close();
      modal.classList.add('closing');
      modal.addEventListener('animationend', () => { modal.classList.remove('closing'); modal.close(); }, { once: true });
    }
    if (modal) {
      modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
      modal.addEventListener('cancel', (e) => { e.preventDefault(); close(); });  // Escape key
    }
    list.addEventListener('click', (e) => { const r = e.target.closest('.proj-row'); if (r) open(r.dataset.id); });
    $$('[data-open-project]').forEach(b => b.addEventListener('click', () => open(b.dataset.openProject)));
  }

  /* ---------------- tagline: words light up as they cross the middle of the screen ---------------- */
  function initTagline() {
    const el = $('#taglineText');
    if (!el) return;
    // wrap each word, keep the <br> line breaks
    el.innerHTML = el.innerHTML.split(/(<br>)/).map(part =>
      part === '<br>' ? part : part.split(/(\s+)/).map(w => w.trim() ? `<span class="tw">${w}</span>` : w).join('')
    ).join('');
    const words = $$('.tw', el);
    const section = el.closest('.tagline'), pin = $('#taglinePin');
    // story beats: "by hand" is the problem (struck through), "agent" the answer (accent)
    const by = words.find(w => w.textContent === 'by'), hand = words.find(w => w.textContent === 'hand');
    if (by && hand) {
      const strike = document.createElement('span');
      strike.className = 'tw-strike';
      by.before(strike);
      strike.append(by, by.nextSibling, hand);  // keeps the space between the two words inside the strike
    }
    const agent = words.find(w => w.textContent === 'agent');
    if (agent) agent.classList.add('tw-agent');

    if (!motionOK() || !pin) {
      section.classList.add('tagline--static', 'resolved');
      words.forEach(w => w.classList.add('on'));
      return;
    }
    // scrubbed by scroll, so it plays backwards too: words light over the first 70%, the payoff lands at 80%
    let queued = false;
    const update = () => {
      queued = false;
      const r = pin.getBoundingClientRect(), lead = innerHeight * 0.4;
      const p = Math.min(1, Math.max(0, (lead - r.top) / (r.height - innerHeight + lead)));
      const lit = Math.ceil(p / 0.7 * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
      section.classList.toggle('resolved', p >= 0.8);
      section.style.setProperty('--p', p.toFixed(3));  // drives the background glow
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ---------------- numbers count up once when they scroll into view ---------------- */
  function countUp(els) {
    if (!motionOK() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const m = e.target.textContent.match(/^(\D*)(\d+)(.*)$/);
      if (!m || +m[2] < 10) return;  // "<1 wk" and similar stay as written
      const [, pre, num, post] = m, end = +num, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 900), eased = 1 - Math.pow(1 - k, 4);  // decelerates like the base curve
        e.target.textContent = pre + Math.round(end * eased) + post;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    els.forEach(el => io.observe(el));
  }

  /* ---------------- cycling selector: steps light up in turn while visible,
     until someone hovers, focuses or clicks one ---------------- */
  function cycle(wrap, nodes, show, ms = 1800) {
    let i = 0, timer = null, touched = false;
    const go = (n) => { i = n; show(n); };
    const stop = () => { clearInterval(timer); timer = null; };
    nodes.forEach((b, k) => ['click', 'mouseenter', 'focus'].forEach(ev =>
      b.addEventListener(ev, () => { touched = true; stop(); go(k); })));
    go(0);
    if (!motionOK() || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !touched && !timer) timer = setInterval(() => go((i + 1) % nodes.length), ms);
      if (!e.isIntersecting) stop();
    }, { threshold: 0.4 }).observe(wrap);
  }

  /* ---------------- AI pipeline ---------------- */
  function initPipeline() {
    const wrap = $('#pipeline'), desc = $('#pipeDesc');
    if (!wrap) return;
    const nodes = $$('.pipe-node', wrap);
    cycle(wrap, nodes, (n) => {
      nodes.forEach((b, k) => {
        b.closest('li').classList.toggle('done', k < n);
        b.classList.toggle('active', k === n);
        b.setAttribute('aria-pressed', String(k === n));
      });
      desc.textContent = nodes[n].dataset.desc;
    });
  }

  /* ---------------- hero system map ---------------- */
  function initSystemMap() {
    const wrap = $('#sysmap'), desc = $('#smDesc');
    if (!wrap) return;
    const nodes = $$('.sm-node', wrap), spokes = $$('.sm-spoke', wrap);
    cycle(wrap, nodes, (n) => {
      nodes.forEach((b, k) => { b.classList.toggle('active', k === n); b.setAttribute('aria-pressed', String(k === n)); });
      spokes.forEach((g, k) => g.classList.toggle('active', k === n));
      desc.innerHTML = `<b>${esc(nodes[n].textContent)}</b> ${esc(nodes[n].dataset.desc)}`;
    }, 2600);
  }

  /* ---------------- floating resume button: shows once the hero button scrolls away,
     hides again when the final call to action is on screen ---------------- */
  function initFloatCta() {
    const btn = $('#floatCta'), heroCta = $('.hero .hv-actions'), finalCta = $('#resume');
    if (!btn || !heroCta || !('IntersectionObserver' in window)) return;
    let pastHero = false, atEnd = false;
    const update = () => btn.classList.toggle('show', pastHero && !atEnd);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(heroCta);
    if (finalCta) new IntersectionObserver(([e]) => { atEnd = e.isIntersecting; update(); }).observe(finalCta);
  }

  /* ---------------- skills ---------------- */
  function initSkills() {
    const el = $('#skillGroups');
    if (!el || typeof SKILL_GROUPS === 'undefined') return;
    let i = 0;  // running index so chips pop in one after another across groups
    el.innerHTML = SKILL_GROUPS.map(g => `
      <div class="skill-group-v3"><h3>${esc(g.label)}</h3><p class="chips">${g.skills.map(s => `<span class="skill-chip" style="--i:${Math.min(i++, 30)}">${esc(s.name)}</span>`).join('')}</p></div>`).join('');
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
      });
      item.classList.add('exp-collapsible');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'exp-toggle';
      b.setAttribute('aria-expanded', 'false');
      b.textContent = `Show what I did (${lis.length})`;
      b.addEventListener('click', () => {
        const open = item.classList.toggle('open');
        b.setAttribute('aria-expanded', String(open));
        b.textContent = open ? 'Hide details' : `Show what I did (${lis.length})`;
      });
      item.appendChild(b);
    });
  }

  if (window.__componentsLoaded) init();
  else window.addEventListener('componentsLoaded', init, { once: true });
})();
