/* ============================================================
   RESUME FX — interactive layer for the resume page.
   Search with highlighting, clickable skills, impact (metric)
   highlighting, quick-scan mode, reading progress, reveal.
   Nothing here affects the printed resume.
   ============================================================ */
(function () {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches && root.getAttribute('data-motion') !== 'off';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // numbers that show impact: 40%+, 400+, 3–5 days, under 24 hours, 30%, ~50%, 100 conversions…
  const METRIC_RE = /(~?\d[\d,.]*\s?%\+?|\b\d[\d,]*\+(?=\s|$|[^\w])|\b\d+\s?[–-]\s?\d+\s?(?:days?|hours?)|\b(?:under|<)\s?\d+\s?(?:hours?|h|days?)\b|\b\d+\s(?:daily active users|active users|users|departments|teams|conversions|modules|features|days|hours)\b)/gi;

  let searchables = [];   // elements we search inside, with their original HTML
  let hits = [], hitIdx = -1;

  function init() {
    if (init.done) return;
    init.done = true;
    const page = $('#resumePage');
    if (!page || !$('.resume-body', page)) return;

    markMetrics(page);
    searchables = $$('.summary, .bullets li, .entry-note, .entry-title', page).map(el => ({ el, html: el.innerHTML }));

    initSearch();
    initSkillChips();
    initModes();
    initProgress();
    initReveal(page);
    initEntryHover(page);
    initCopyEmail(page);
  }

  /* ---------- impact metrics ---------- */
  function wrapText(el, re, cls) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('mark, a, button') && cls !== 'hit' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let count = 0;
    nodes.forEach(node => {
      const text = node.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) return;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0, m;
      while ((m = re.exec(text))) {
        if (!m[0]) { re.lastIndex++; continue; }
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const mark = document.createElement('mark');
        mark.className = cls;
        mark.textContent = m[0];
        frag.appendChild(mark);
        last = m.index + m[0].length;
        count++;
      }
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
    return count;
  }

  function markMetrics(page) {
    $$('.summary, .bullets li .b-rest, .entry-note', page).forEach(el => wrapText(el, METRIC_RE, 'metric'));
    // quick-scan pills: repeat each bullet's metrics next to its title
    $$('.bullets li', page).forEach(li => {
      const ms = $$('mark.metric', li).map(m => m.textContent.trim());
      if (!ms.length || !li.querySelector('.b-head')) return;
      const pills = document.createElement('span');
      pills.className = 'b-pills';
      pills.innerHTML = [...new Set(ms)].slice(0, 3).map(t => `<span>${t}</span>`).join('');
      li.querySelector('.b-head').after(pills);
    });
  }

  /* ---------- search ---------- */
  function initSearch() {
    const input = $('#rzSearch'), status = $('#rzStatus');
    if (!input) return;
    let t;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => runSearch(input.value), 120); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); jump(e.shiftKey ? -1 : 1); }
      if (e.key === 'Escape') { input.value = ''; runSearch(''); input.blur(); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus(); input.select();
      }
    });
    $$('.rz-chip').forEach(c => c.addEventListener('click', () => {
      const same = input.value === c.dataset.q;
      input.value = same ? '' : c.dataset.q;
      runSearch(input.value);
    }));
    status.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'next') jump(1);
      if (b.dataset.act === 'prev') jump(-1);
      if (b.dataset.act === 'clear') { input.value = ''; runSearch(''); }
    });
  }

  function runSearch(q) {
    q = q.trim();
    const page = $('#resumePage'), status = $('#rzStatus');
    searchables.forEach(s => { s.el.innerHTML = s.html; });
    $$('.entry, .section', page).forEach(e => e.classList.remove('rz-dim', 'rz-match'));
    $$('.skill-chip').forEach(c => c.classList.toggle('on', q && c.dataset.skill.toLowerCase().includes(q.toLowerCase())));
    $$('.rz-chip').forEach(c => c.classList.toggle('on', c.dataset.q === q));
    hits = []; hitIdx = -1;
    page.classList.toggle('rz-searching', !!q);
    if (!q) { status.innerHTML = ''; return; }

    const short = q.length <= 3;
    const re = new RegExp(short ? `\\b${escRe(q)}\\b` : escRe(q), 'gi');
    let total = 0;
    searchables.forEach(s => { total += wrapText(s.el, re, 'hit'); });
    hits = $$('mark.hit', page);

    $$('.entry', page).forEach(e => e.classList.toggle(e.querySelector('mark.hit') ? 'rz-match' : 'rz-dim', true));
    const entries = $$('.entry.rz-match', page).length;
    const skillHits = $$('.skill-chip.on').length;

    if (!total) {
      status.innerHTML = skillHits
        ? `<span>“${escapeHtml(q)}” is in my skills list but not mentioned in a bullet.</span> <button type="button" data-act="clear">Clear</button>`
        : `<span>No matches for “${escapeHtml(q)}”.</span> <button type="button" data-act="clear">Clear</button>`;
      return;
    }
    status.innerHTML = `<b>${total}</b> mention${total === 1 ? '' : 's'} in <b>${entries}</b> section${entries === 1 ? '' : 's'}
      <span class="rz-nav"><button type="button" data-act="prev" aria-label="Previous match">↑</button><button type="button" data-act="next" aria-label="Next match">↓</button><button type="button" data-act="clear">Clear</button></span>`;
    jump(1);
  }

  function jump(dir) {
    if (!hits.length) return;
    hits.forEach(h => h.classList.remove('current'));
    hitIdx = (hitIdx + dir + hits.length) % hits.length;
    const h = hits[hitIdx];
    h.classList.add('current');
    h.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'center' });
  }

  function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /* ---------- skill chips → search ---------- */
  function initSkillChips() {
    const input = $('#rzSearch');
    $$('.skill-chip').forEach(c => c.addEventListener('click', () => {
      // "AWS (EC2, S3)" → "AWS", "React 18 / 19" → "React", "PHP 8.x" → "PHP"
      let term = c.dataset.skill.split(' (')[0].split(' / ')[0].replace(/\s+[\d.x]+$/i, '').trim();
      if (input.value === term) term = '';
      input.value = term;
      runSearch(term);
      if (term) toast(`Showing where I used ${term}`);
    }));
  }

  /* ---------- modes ---------- */
  function initModes() {
    const metrics = $('#rzMetrics'), scan = $('#rzScan'), page = $('#resumePage');
    const apply = () => {
      page.classList.toggle('rz-metrics', metrics.checked);
      page.classList.toggle('rz-scan', scan.checked);
      store.set('resume_metrics', metrics.checked ? '1' : '0');
    };
    metrics.checked = store.get('resume_metrics') !== '0';
    metrics.addEventListener('change', apply);
    scan.addEventListener('change', () => { apply(); toast(scan.checked ? 'Quick scan: titles and numbers only' : 'Full details'); });
    apply();
  }

  /* ---------- reading progress ---------- */
  function initProgress() {
    const bar = $('#readProgress');
    if (!bar) return;
    // shrink the sticky toolbar to just search + results once it sticks
    const tb = $('#rzToolbar');
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    if (tb) tb.before(sentinel);
    const update = () => {
      const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
      if (tb) tb.classList.toggle('compact', sentinel.getBoundingClientRect().top < 60);
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- reveal sections ---------- */
  function initReveal(page) {
    if (!motionOK() || !('IntersectionObserver' in window)) return;
    const els = $$('.section', page);
    els.forEach(e => e.classList.add('rz-hidden'));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.remove('rz-hidden'); io.unobserve(e.target); }
    }), { threshold: 0.05 });
    els.forEach(e => io.observe(e));
    addEventListener('beforeprint', () => els.forEach(e => e.classList.remove('rz-hidden')));
  }

  /* ---------- small touches ---------- */
  function initEntryHover(page) {
    $$('.entry', page).forEach(e => e.setAttribute('data-rz', ''));
  }

  function initCopyEmail(page) {
    const a = $('.contact-row a[href^="mailto:"]', page);
    if (!a) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rz-copy no-print';
    btn.setAttribute('aria-label', 'Copy email address');
    btn.textContent = 'copy';
    a.after(btn);
    btn.addEventListener('click', async () => {
      const email = a.getAttribute('href').replace('mailto:', '');
      try { await navigator.clipboard.writeText(email); toast('Email copied'); }
      catch (e) { toast(email); }
    });
  }

  let toastT;
  function toast(msg) {
    const t = $('#rzToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 1800);
  }

  window.ResumeFX = { init };
  window.addEventListener('resume:rendered', () => setTimeout(init, 0));
})();
