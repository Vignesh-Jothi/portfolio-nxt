/* ============================================================
   THEME — mode (light/dark/auto), accent palette and motion
   picker. Shared by the portfolio and the resume page.
   Settings live in localStorage: portfolio_theme,
   portfolio_palette, portfolio_motion.
   ============================================================ */
(function () {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };

  function initThemePanel() {
    if (initThemePanel.done) return;
    initThemePanel.done = true;
    const btn = $('#paletteBtn'), panel = $('#themePanel');
    if (!btn || !panel) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    function swap(fn) {
      root.classList.add('palette-swap');
      fn();
      clearTimeout(swap.t);
      swap.t = setTimeout(() => root.classList.remove('palette-swap'), 400);
    }
    function sync() {
      const mode = store.get('portfolio_theme') || 'auto';
      $$('#modeSeg button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
      const pal = root.getAttribute('data-palette') || 'ocean';
      $$('#paletteSwatches button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.palette === pal)));
      $('#motionToggle').checked = root.getAttribute('data-motion') !== 'off';
    }
    function setMode(mode) {
      swap(() => {
        const theme = mode === 'auto' ? (mql.matches ? 'dark' : 'light') : mode;
        root.setAttribute('data-theme', theme);
        store.set('portfolio_theme', mode === 'auto' ? null : mode);
        $$('#themeToggle').forEach(b => b.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
      });
      sync();
    }
    mql.addEventListener('change', () => { if (!store.get('portfolio_theme')) setMode('auto'); });

    const open = (v) => {
      panel.hidden = !v;
      btn.setAttribute('aria-expanded', String(v));
      if (v) { sync(); const first = panel.querySelector('[aria-checked="true"]'); first && first.focus(); }
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); open(panel.hidden); });
    document.addEventListener('click', (e) => { if (!panel.hidden && !panel.contains(e.target)) open(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); } });

    $$('#modeSeg button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    $$('#paletteSwatches button').forEach(b => b.addEventListener('click', () => {
      swap(() => root.setAttribute('data-palette', b.dataset.palette));
      store.set('portfolio_palette', b.dataset.palette);
      sync();
    }));
    $('#motionToggle').addEventListener('change', (e) => {
      if (e.target.checked) { root.removeAttribute('data-motion'); store.set('portfolio_motion', null); }
      else { root.setAttribute('data-motion', 'off'); store.set('portfolio_motion', 'off'); }
      window.dispatchEvent(new Event('motionchange'));
    });
    // keep the panel in sync when the sun/moon button is used
    document.addEventListener('click', (e) => { if (e.target.closest('#themeToggle')) { swap(() => {}); setTimeout(sync, 0); } });
    sync();
  }


  function boot() {
    if ($('#paletteBtn') || window.__componentsLoaded) initThemePanel();
    else window.addEventListener('componentsLoaded', initThemePanel, { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // keep other open tabs (portfolio <-> resume) in sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio_palette') root.setAttribute('data-palette', e.newValue || 'ocean');
    if (e.key === 'portfolio_theme') root.setAttribute('data-theme', e.newValue || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    if (e.key === 'portfolio_motion') e.newValue === 'off' ? root.setAttribute('data-motion', 'off') : root.removeAttribute('data-motion');
  });
})();
