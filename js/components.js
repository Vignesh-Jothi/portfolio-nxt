/* ============================================================
   COMPONENTS LOADER — fetches HTML fragments from the
   components/ folder and splices them into the page.

   Usage in index.html: <div data-include="components/hero.html"></div>

   Because this uses fetch(), the site must be served over HTTP(S)
   or localhost. Opening index.html directly with file:// will be
   blocked by browser CORS policy.
   ============================================================ */
(function () {
  async function includeComponents() {
    const placeholders = Array.from(document.querySelectorAll('[data-include]'));
    if (!placeholders.length) return;

    await Promise.all(placeholders.map(async function (node) {
      const src = node.getAttribute('data-include');
      try {
        const res = await fetch(src, { credentials: 'same-origin', cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + src);
        const html = await res.text();
        node.outerHTML = html;
      } catch (err) {
        console.error('[components] failed to load ' + src, err);
      }
    }));
  }

  async function run() {
    await includeComponents();
    window.__componentsLoaded = true;
    window.dispatchEvent(new Event('componentsLoaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
