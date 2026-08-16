/* ============================================================
   MAIN — Interactive logic for the portfolio and blog.
   Depends on: js/data.js (TESTIMONIALS, ACHIEVEMENTS)
               js/blog-data.js (BLOG_POSTS)
   ============================================================ */

function initPortfolio() {

/* ---------- auto-calculated years of experience ---------- */
function calcYears(start){
  const now = new Date();
  const s = new Date(start);
  let years = now.getFullYear() - s.getFullYear();
  if(now.getMonth() < s.getMonth() || (now.getMonth() === s.getMonth() && now.getDate() < s.getDate())) years--;
  return Math.max(3, years);
}
const yoe = calcYears('2023-10-01');
const expYearsStat = document.getElementById('statExp');
if(expYearsStat) expYearsStat.textContent = yoe + '+';
const expYearsText = document.getElementById('expYearsText');
if(expYearsText) expYearsText.textContent = yoe + '+ years';

/* ---------- render testimonials & achievements ---------- */
const testGrid = document.getElementById('testGrid');
const testDots = document.getElementById('testDots');
if(testGrid && typeof TESTIMONIALS !== 'undefined'){
  testGrid.innerHTML = '';
  if(testDots) testDots.innerHTML = '';
  TESTIMONIALS.forEach((t, i)=>{
    const featured = t.quotes[0];
    const initials = featured.name.split(' ').map(n=>n[0]).slice(0,2).join('');
    const more = t.quotes.slice(1);
    const card = document.createElement('div');
    card.className = 'test-card';
    card.dataset.index = i;
    card.innerHTML = `
      <div class="test-card-header">
        <div class="avatar" aria-hidden="true">${initials}</div>
        <div class="test-card-meta">
          <b>${featured.name}</b>
          <span>${featured.role}</span>
        </div>
      </div>
      <div class="testimonial-story">
        <span class="testimonial-tag mono">${t.tag}</span>
        <h3>${t.title}</h3>
        <p>${t.summary}</p>
      </div>
      <div class="testimonial-quotes">
        <figure class="testimonial-quote testimonial-quote--featured">
          <blockquote>“${featured.quote}”</blockquote>
        </figure>
        ${more.map(q=>`
          <figure class="testimonial-quote testimonial-quote--more">
            <blockquote>“${q.quote}”</blockquote>
            <figcaption><b>${q.name}</b><span>- ${q.role}</span></figcaption>
          </figure>`).join('')}
      </div>`;
    testGrid.appendChild(card);
    if(testDots){
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      testDots.appendChild(dot);
    }
  });
}

function initTestimonialCarousel(grid){
  if(!grid) return;
  const cards = Array.from(grid.children);
  if(cards.length < 2) return;
  const dots = testDots ? Array.from(testDots.children) : [];

  function updateFocus(){
    const carousel = grid.parentElement;
    if(!carousel) return;
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    let closest = null, closestDist = Infinity, closestIndex = 0;
    cards.forEach((card, i)=>{
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(carouselCenter - cardCenter);
      if(dist < closestDist){ closestDist = dist; closest = card; closestIndex = i; }
    });
    cards.forEach(card=>card.classList.toggle('in-focus', card === closest));
    dots.forEach((dot, i)=>dot.classList.toggle('active', i === closestIndex));
  }
  if(grid.parentElement){
    grid.parentElement.addEventListener('scroll', updateFocus, { passive:true });
    window.addEventListener('resize', updateFocus);
  }

  dots.forEach((dot, i)=>{
    dot.addEventListener('click', ()=>{
      const card = cards[i];
      if(!card || !grid.parentElement) return;
      grid.parentElement.scrollTo({ left: card.offsetLeft - (grid.parentElement.clientWidth - card.offsetWidth) / 2, behavior:'smooth' });
    });
  });

  updateFocus();
}

initTestimonialCarousel(testGrid);

const achGrid = document.getElementById('achGrid');
if(achGrid && typeof ACHIEVEMENTS !== 'undefined'){
  achGrid.innerHTML = '';
  ACHIEVEMENTS.forEach((a,i)=>{
    const card = document.createElement('div');
    card.className = 'ach-card' + (i === 0 ? ' ach-card--featured' : '');
    card.innerHTML = `
      <span class="icon-badge" aria-hidden="true"><svg class="icon"><use href="icons/icons.svg#award"></use></svg></span>
      <div><span class="date">${a.date}</span><h3>${a.title}</h3><p>${a.description}</p></div>`;
    achGrid.appendChild(card);
  });
}

/* ---------- scroll progress bar ---------- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  if(scrollProgress) scrollProgress.style.width = max > 0 ? (scrolled / max * 100) + '%' : '0%';
}
window.addEventListener('scroll', updateScrollProgress, { passive:true });
updateScrollProgress();

/* ---------- reveal on scroll ---------- */
const revealGroups = [
  document.querySelectorAll('.ach-grid > *'),
  document.querySelectorAll('.stats > *'),
  document.querySelectorAll('.mini-grid > *'),
  document.querySelectorAll('.blog-grid > *')
];
revealGroups.forEach(group=>{
  group.forEach((el,i)=>{ el.setAttribute('data-reveal',''); el.style.transitionDelay = Math.min(i*70,280)+'ms'; });
});

const els = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold:0.08 });
els.forEach(el=>io.observe(el));

/* ---------- animated hero stat counters ---------- */
const heroStatTargets = [
  { el: document.getElementById('statDAU'), value: 400, suffix:'+' },
  { el: document.getElementById('statSpeed'), value: 40, suffix:'%+' },
  { el: document.getElementById('statRefund'), value: 24, suffix:'h' },
  { el: document.getElementById('statConv'), value: 100, suffix:'' },
  { el: document.getElementById('statTeams'), value: 7, suffix:'' },
  { el: document.getElementById('statExp'), value: yoe, suffix:'+' }
];
let heroStatsDone = false;
const heroStatsIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !heroStatsDone){
      heroStatsDone = true;
      heroStatTargets.forEach(({el,value,suffix})=>{
        if(!el) return;
        let cur = 0; const step = Math.max(1, Math.round(value/26));
        const iv = setInterval(()=>{
          cur += step;
          if(cur >= value){ cur = value; clearInterval(iv); }
          el.textContent = cur + suffix;
        }, 25);
      });
      heroStatsIO.disconnect();
    }
  });
}, { threshold:0.3 });
const statsBlock = document.querySelector('.stats');
if(statsBlock) heroStatsIO.observe(statsBlock);

/* ---------- hero console & terminal interactions ---------- */
function runTerminalAnimation() {
  const termLines = document.querySelectorAll('#tab-ship .tech-line');
  if (!termLines.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    termLines.forEach(l => l.classList.add('show'));
    return;
  }
  termLines.forEach(l => l.classList.remove('show'));
  let i = 0;
  function next() {
    if (i >= termLines.length) return;
    termLines[i].classList.add('show');
    i++;
    setTimeout(next, termLines[i - 1].classList.contains('t-gap') ? 120 : 220);
  }
  next();
}

// Initial terminal reveal
runTerminalAnimation();

// Console Tab Switcher
const techTabs = document.querySelectorAll('.tech-tab');
const techPanels = document.querySelectorAll('.tech-tab-panel');
techTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.target;
    techTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    techPanels.forEach(p => {
      p.classList.remove('show');
      p.hidden = true;
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.classList.add('show');
      if (targetId === 'tab-ship') {
        runTerminalAnimation();
      }
    }
  });
});

// Console Rerun Button
const rerunBtn = document.getElementById('heroConsoleRerun');
if (rerunBtn) {
  rerunBtn.addEventListener('click', () => {
    const shipTabBtn = document.getElementById('btn-tab-ship');
    if (shipTabBtn && !shipTabBtn.classList.contains('active')) {
      shipTabBtn.click();
    } else {
      runTerminalAnimation();
    }
  });
}

// Live Telemetry DAU Counter Simulation
const telemetryDAUEl = document.getElementById('telemetryDAU');
if (telemetryDAUEl) {
  let baseDAU = 412;
  setInterval(() => {
    const jitter = Math.floor(Math.random() * 9) - 4; // -4 to +4
    const current = baseDAU + jitter;
    telemetryDAUEl.textContent = current + ' Active';
  }, 4000);
}

// Hero Copy Email Button
const heroCopyEmailBtn = document.getElementById('heroCopyEmailBtn');
if (heroCopyEmailBtn) {
  heroCopyEmailBtn.addEventListener('click', async () => {
    const email = heroCopyEmailBtn.dataset.email || 'vigneshjothishwaran@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      heroCopyEmailBtn.classList.add('copied');
      setTimeout(() => {
        heroCopyEmailBtn.classList.remove('copied');
      }, 2200);
    } catch (err) {
      console.warn('Could not copy email:', err);
    }
  });
}

/* ---------- before/after toggles ---------- */
document.querySelectorAll('.toggle').forEach(toggle=>{
  const proj = toggle.dataset.project;
  toggle.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const state = btn.dataset.state;
      toggle.dataset.active = state;
      toggle.querySelectorAll('button').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      document.querySelectorAll(`.panel[data-project="${proj}"]`).forEach(p=>p.classList.toggle('show', p.dataset.state===state));
      if(state==='after'){
        document.querySelectorAll(`.panel[data-project="${proj}"][data-state="after"] .n[data-count]`).forEach(n=>{
          if(n.dataset.done) return;
          n.dataset.done = "1";
          const target = parseInt(n.dataset.count,10);
          let cur = 0;
          const step = Math.max(1, Math.round(target/24));
          const iv = setInterval(()=>{
            cur += step;
            if(cur>=target){ cur=target; clearInterval(iv); }
            n.textContent = cur;
          }, 20);
        });
      }
    });
  });
});

/* ---------- AI stage-rule engine demo ---------- */
(function(){
  const flow = document.getElementById('stageFlow');
  if(!flow) return;
  const transcriptEl = document.getElementById('callTranscript');
  const summaryEl = document.getElementById('callSummary');
  const stageTag = document.getElementById('stageTag');
  const ruleTag = document.getElementById('ruleTag');
  const logList = document.getElementById('ruleLogList');
  const resetBtn = document.getElementById('ruleReset');
  const steps = flow.querySelectorAll('.stage-step');
  const entries = [];
  let running = false;

  const SCENARIOS = {
    refund: {
      transcript: '…I want my money back for the cancelled hotel segment…',
      summary: 'intent: refund · component: hotel · customer requested cancellation refund',
      rule: 'refund_request',
      stage: 'Refund Pending'
    },
    confirm: {
      transcript: '…yes, the 14th works for both of us, please go ahead…',
      summary: 'intent: confirm · dates: accepted · customer approved itinerary',
      rule: 'trip_confirmed',
      stage: 'Confirmed'
    },
    change: {
      transcript: '…can we switch to a beachfront room instead…',
      summary: 'intent: change · component: hotel · wants an alternative room',
      rule: 'plan_change',
      stage: 'Change Request'
    },
    escalate: {
      transcript: '…this delay is unacceptable, I need a supervisor immediately…',
      summary: 'sentiment: escalated · issue: delay · requested escalation',
      rule: 'priority_escalation',
      stage: 'Escalated · Priority'
    },
    noop: {
      transcript: '…thanks, everything looks wonderful on my end, bye…',
      summary: 'intent: none · sentiment: positive',
      rule: null,
      stage: null,
      note: 'No rule matched — stage unchanged, zero-touch idempotent execution.'
    }
  };

  function setBadges(stage, rule){
    stageTag.textContent = stage ? 'STAGE: ' + stage : 'STAGE: AWAITING';
    ruleTag.textContent = rule ? 'RULE: ' + rule : 'RULE: —';
    stageTag.classList.toggle('moved', !!stage);
    ruleTag.classList.toggle('moved', !!rule);
  }

  function renderLog(){
    if(!entries.length){ logList.innerHTML = '<p class="log-empty">No stage moves recorded yet. Run a call above.</p>'; return; }
    logList.innerHTML = entries.map(e => `
      <div class="log-entry">
        <div class="log-left">
          <span class="log-reason">${e.rule}</span>
          ${e.stage ? `<span class="log-stage">moved → ${e.stage}</span>` : `<span class="log-stage muted">${e.note}</span>`}
        </div>
        <span class="log-time mono">${e.time}</span>
      </div>`).join('');
  }

  function run(key){
    if(running) return;
    const s = SCENARIOS[key];
    if(!s) return;
    running = true;
    steps.forEach(st => st.classList.remove('on'));
    transcriptEl.textContent = '';
    summaryEl.textContent = '';
    let i = 0;
    (function next(){
      if(i < steps.length){
        steps[i].classList.add('on');
        i++;
        setTimeout(next, 240);
      } else {
        transcriptEl.textContent = '“' + s.transcript + '”';
        summaryEl.textContent = '→ ' + s.summary;
        setTimeout(()=>{
          const now = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
          if(s.rule){
            setBadges(s.stage, s.rule);
            entries.unshift({ rule: s.rule, stage: s.stage, time: now });
          } else {
            entries.unshift({ rule: s.rule || 'no_match', stage: null, note: s.note, time: now });
          }
          renderLog();
          running = false;
        }, 220);
      }
    })();
  }

  document.querySelectorAll('.sim-btn[data-scenario]').forEach(btn=>{
    btn.addEventListener('click', ()=>run(btn.dataset.scenario));
  });

  if(resetBtn){
    resetBtn.addEventListener('click', ()=>{
      entries.length = 0;
      steps.forEach(st => st.classList.remove('on'));
      transcriptEl.textContent = 'Transcript appears here when you run a call…';
      summaryEl.textContent = '';
      setBadges(null, null);
      renderLog();
    });
  }
})();

/* ---------- code sample: line numbers + copy ---------- */
const codeEl = document.getElementById('codeSampleText');
const lineNumbersEl = document.getElementById('codeLineNumbers');
if(codeEl && lineNumbersEl){
  const lineCount = codeEl.textContent.split('\n').length;
  lineNumbersEl.innerHTML = Array.from({length:lineCount}, (_,i)=>`<div>${i+1}</div>`).join('');
}
const copyBtn = document.getElementById('copyCodeBtn');
const copyLabel = document.getElementById('copyCodeLabel');
if(copyBtn && codeEl){
  copyBtn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(codeEl.textContent);
      copyBtn.classList.add('copied');
      if(copyLabel) copyLabel.textContent = 'Copied!';
      setTimeout(()=>{ copyBtn.classList.remove('copied'); if(copyLabel) copyLabel.textContent = 'Copy'; }, 1800);
    } catch(e){
      if(copyLabel) copyLabel.textContent = 'Select & copy';
      setTimeout(()=>{ if(copyLabel) copyLabel.textContent = 'Copy'; }, 1800);
    }
  });
}

/* ---------- mobile menu ---------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
function closeMobileNav(){
  if(!mobileNav) return;
  mobileNav.classList.remove('open');
  mobileNav.hidden = true;
  if(hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded','false');
}
if(hamburgerBtn && mobileNav){
  hamburgerBtn.addEventListener('click', ()=>{
    const isOpen = mobileNav.classList.contains('open');
    if(isOpen){ closeMobileNav(); }
    else{
      mobileNav.hidden = false;
      requestAnimationFrame(()=>mobileNav.classList.add('open'));
      hamburgerBtn.setAttribute('aria-expanded','true');
    }
  });
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMobileNav));
}

/* ---------- active section highlight in nav ---------- */
const navLinks = document.querySelectorAll('#mainNav a[href^="#"], #mobileNav a[href^="#"]');
const navSections = Array.from(document.querySelectorAll('#mainNav a[href^="#"]')).map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if(navSections.length && 'IntersectionObserver' in window){
  const navIO = new IntersectionObserver((entries)=>{
    if(viewBlog && !viewBlog.hidden) return; // Don't highlight portfolio sections when on blog
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        navLinks.forEach(a=>a.classList.toggle('current', a.getAttribute('href')===id));
        const navBlogEl = document.getElementById('navBlog');
        const navBlogMobEl = document.getElementById('navBlogMobile');
        if(navBlogEl) navBlogEl.classList.remove('current');
        if(navBlogMobEl) navBlogMobEl.classList.remove('current');
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  navSections.forEach(s=>navIO.observe(s));
}

/* ---------- back to top ---------- */
const backToTop = document.getElementById('backToTop');
if(backToTop){
  window.addEventListener('scroll', ()=>{ backToTop.classList.toggle('show', window.scrollY > 600); }, { passive:true });
  backToTop.addEventListener('click', ()=>window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ---------- theme toggle ---------- */
const themeBtn = document.getElementById('themeToggle');
if(themeBtn){
  themeBtn.addEventListener('click', ()=>{
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });
}

/* ---------- contact form -> mailto ---------- */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('cf-name').value;
    const email = document.getElementById('cf-email').value;
    const msg = document.getElementById('cf-msg').value;
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
    window.location.href = `mailto:vigneshjothishwaran@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* ============================================================
   BLOG ENGINE
   Routes:  / (portfolio)  |  ?blog=1 (index)  |  ?post=slug (article)
   ============================================================ */
const viewPortfolio  = document.getElementById('view-portfolio');
const viewBlog       = document.getElementById('view-blog');
const blogListingView = document.getElementById('blogListingView');
const blogPostView   = document.getElementById('blogPostView');
const homeBlogGrid   = document.getElementById('homeBlogGrid');
const blogIndexGrid  = document.getElementById('blogIndexGrid');
const blogCategoryFilters = document.getElementById('blogCategoryFilters');
const blogArticleCount = document.getElementById('blogArticleCount');
let activeCategory = 'all';
let tocObserver = null;
let readProgressListener = null;

/* ── Helpers ──────────────────────────────────────────────────── */
function getAllPosts() {
  return (typeof BLOG_POSTS !== 'undefined') ? [...BLOG_POSTS] : [];
}

function buildUrl(params) {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

/* ── Share toast ──────────────────────────────────────────────── */
function ensureToast() {
  let t = document.getElementById('shareToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'shareToast'; t.className = 'share-toast';
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  return t;
}
function showToast(msg = 'Copied!') {
  const t = ensureToast();
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── Clipboard ────────────────────────────────────────────────── */
async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const el = Object.assign(document.createElement('textarea'), { value: text });
    Object.assign(el.style, { position:'fixed', opacity:'0' });
    document.body.appendChild(el); el.select(); document.execCommand('copy');
    document.body.removeChild(el); return true;
  }
}

/* ── Transition helpers ───────────────────────────────────────── */
function transitionTo(showEl, hideEl, cb) {
  if (hideEl) hideEl.classList.add('view-hidden');
  setTimeout(() => {
    if (hideEl) { hideEl.hidden = true; hideEl.classList.remove('view-hidden'); }
    if (showEl) { showEl.hidden = false; }
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (cb) cb();
    if (showEl) requestAnimationFrame(() => showEl.classList.remove('view-hidden'));
  }, 180);
}

/* ──────────────────────────────────────────────────────────────
   HOMEPAGE CARDS (portfolio page preview)
────────────────────────────────────────────────────────────── */
function renderHomeBlogCards() {
  if (!homeBlogGrid) return;
  const posts = getAllPosts();
  if (!posts.length) return;

  homeBlogGrid.innerHTML = posts.slice(0, 3).map((p, i) => `
    <article class="home-blog-card reveal-item" data-slug="${p.slug}"
      style="animation-delay:${i * 80}ms"
      tabindex="0" role="button" aria-label="Read: ${p.title}">
      <div>
        <div class="card-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="card-meta">
          <span class="category-badge">${p.category}</span>
          <span class="read-time mono">${p.readTime}</span>
        </div>
        <h3>${p.title}</h3>
        <p class="card-summary">${p.summary}</p>
        <div class="card-tags">
          ${(p.tags || []).slice(0, 3).map(t => `<span class="card-tag-pill">#${t}</span>`).join('')}
        </div>
      </div>
      <div class="card-footer">
        <span class="card-date mono">${p.date}</span>
        <span class="read-action">Read Article →</span>
      </div>
    </article>
  `).join('');

  // Trigger reveal animations
  requestAnimationFrame(() => {
    homeBlogGrid.querySelectorAll('.reveal-item').forEach(el => el.classList.add('revealed'));
  });

  homeBlogGrid.querySelectorAll('.home-blog-card').forEach(card => {
    const go = () => { const slug = card.dataset.slug; history.pushState({}, '', buildUrl({ post: slug })); showPost(slug); };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
}

/* ──────────────────────────────────────────────────────────────
   BLOG INDEX — listing view (?blog=1)
────────────────────────────────────────────────────────────── */
function renderBlogIndex(filterCat = 'all') {
  if (!blogIndexGrid) return;
  const all = getAllPosts();
  const posts = filterCat === 'all' ? all : all.filter(p => p.category.toLowerCase() === filterCat.toLowerCase());

  if (blogArticleCount) blogArticleCount.textContent = posts.length + (posts.length === 1 ? ' Article' : ' Articles');

  if (!posts.length) {
    blogIndexGrid.innerHTML = '<p class="empty-state">No articles in this category.</p>';
    return;
  }

  blogIndexGrid.innerHTML = posts.map((p, i) => `
    <a class="blog-index-card reveal-item" href="${buildUrl({ post: p.slug })}" data-slug="${p.slug}"
      style="animation-delay:${i * 70}ms"
      role="article" aria-label="Read: ${p.title}">
      <div class="blog-index-card-inner">
        <div class="blog-index-card-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="blog-index-card-meta">
          <span class="category-badge">${p.category}</span>
          <span class="read-time mono">${p.readTime}</span>
          <span class="card-date mono">${p.date}</span>
        </div>
        <h2>${p.title}</h2>
        <p class="blog-index-card-summary">${p.summary}</p>
        <div class="blog-index-card-tags">
          ${(p.tags || []).slice(0, 4).map(t => `<span class="article-tag">#${t}</span>`).join('')}
        </div>
      </div>
      <div class="blog-index-card-arrow" aria-hidden="true">→</div>
    </a>
  `).join('');

  // Trigger cascade reveal
  requestAnimationFrame(() => {
    blogIndexGrid.querySelectorAll('.reveal-item').forEach(el => el.classList.add('revealed'));
  });

  // Intercept clicks for SPA navigation
  blogIndexGrid.querySelectorAll('.blog-index-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const slug = card.dataset.slug;
      history.pushState({}, '', buildUrl({ post: slug }));
      showPost(slug);
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   SINGLE POST VIEW (?post=slug)
────────────────────────────────────────────────────────────── */
function buildToc(article, postId) {
  const tocNav = document.getElementById('blogTocNav');
  if (!tocNav) return;
  tocNav.innerHTML = '';
  const heads = [];

  article.querySelectorAll('.article-content h3').forEach((h3, idx) => {
    if (!h3.id) h3.id = `h-${postId}-${idx}`;
    const a = document.createElement('a');
    a.href = '#' + h3.id;
    a.className = 'toc-link';
    a.textContent = (h3.textContent || '').trim();
    a.addEventListener('click', e => {
      e.preventDefault();
      const topOffset = 80;
      const elementPosition = h3.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
    tocNav.appendChild(a);
    heads.push({ el: h3, link: a });
  });

  if (tocObserver) tocObserver.disconnect();
  if (!heads.length) return;

  tocObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const h = heads.find(h => h.el === entry.target);
      if (!h) return;
      heads.forEach(x => x.link.classList.remove('toc-active'));
      h.link.classList.add('toc-active');
    });
  }, { rootMargin: '-10% 0px -70% 0px' });

  heads.forEach(h => tocObserver.observe(h.el));
}

function wireCodeCopy(container) {
  container.querySelectorAll('.code-block').forEach(block => {
    const header = block.querySelector('.code-block-header');
    if (!header || header.querySelector('.code-copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn'; btn.type = 'button';
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span>`;
    header.appendChild(btn);
    btn.addEventListener('click', async () => {
      const code = block.querySelector('code');
      if (!code) return;
      await copyToClipboard(code.innerText);
      btn.classList.add('copied'); btn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => { btn.classList.remove('copied'); btn.querySelector('span').textContent = 'Copy'; }, 1800);
    });
  });
}

function wireReadProgress() {
  const bar = document.getElementById('postReadProgress');
  const article = document.getElementById('singlePostArticle');
  if (!bar || !article) return;
  if (readProgressListener) window.removeEventListener('scroll', readProgressListener, { passive: true });
  readProgressListener = () => {
    const rect = article.getBoundingClientRect();
    const total = article.offsetHeight - window.innerHeight;
    if (total <= 0) { bar.style.width = '100%'; return; }
    const scrolled = Math.max(0, -rect.top);
    bar.style.width = Math.min(100, (scrolled / total) * 100) + '%';
  };
  window.addEventListener('scroll', readProgressListener, { passive: true });
}

function wirePostTopbarTitle() {
  const titleEl = document.getElementById('postTopbarTitle');
  const article = document.getElementById('singlePostArticle');
  if (!titleEl || !article) return;
  const h2 = article.querySelector('h2');
  if (!h2) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => titleEl.classList.toggle('visible', !e.isIntersecting));
  }, { rootMargin: '-80px 0px 0px 0px' });
  io.observe(h2);
}

function renderPostFooterNav(slug) {
  const navEl = document.getElementById('postFooterNav');
  if (!navEl) return;
  const posts = getAllPosts();
  const idx = posts.findIndex(p => p.slug === slug);
  if (idx < 0) { navEl.innerHTML = ''; return; }
  const prev = posts[idx - 1];
  const next = posts[idx + 1];
  navEl.innerHTML = `
    ${prev ? `<a class="post-nav-btn prev" href="${buildUrl({ post: prev.slug })}" data-slug="${prev.slug}">
      <span class="post-nav-dir">← Previous Article</span>
      <span class="post-nav-title">${prev.title}</span>
    </a>` : '<div></div>'}
    ${next ? `<a class="post-nav-btn next" href="${buildUrl({ post: next.slug })}" data-slug="${next.slug}">
      <span class="post-nav-dir">Next Article →</span>
      <span class="post-nav-title">${next.title}</span>
    </a>` : '<div></div>'}
  `;
  navEl.querySelectorAll('.post-nav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const s = btn.dataset.slug;
      history.pushState({}, '', buildUrl({ post: s }));
      showPost(s);
    });
  });
}

function showPost(slug) {
  if (!viewBlog) return;
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) { showBlogListing(); return; }

  const articleEl = document.getElementById('singlePostArticle');
  if (!articleEl) return;

  // Render article HTML with enhanced breadcrumb and author meta
  articleEl.innerHTML = `
    <article class="blog-article-full" id="article-${post.id}">
      <header class="blog-article-header">
        <nav class="article-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="breadcrumb-link" id="breadcrumbBlogLink">Engineering Notes</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${post.category}</span>
        </nav>
        <h2>${post.title}</h2>
        <div class="article-meta">
          <span class="category-badge">${post.category}</span>
          <span class="read-time mono">⏱ ${post.readTime}</span>
          <span class="card-date mono">📅 ${post.date}</span>
          <span class="blog-hero-sep">·</span>
          <span class="article-author mono">✍️ Vignesh Jothi</span>
        </div>
        <div class="article-tags">
          ${(post.tags || []).map(t => `<span class="article-tag">#${t}</span>`).join('')}
        </div>
      </header>
      <div class="article-content">${post.content}</div>
    </article>
  `;

  // Breadcrumb link click to return to blog index
  const breadcrumbBlogLink = articleEl.querySelector('#breadcrumbBlogLink');
  if (breadcrumbBlogLink) {
    breadcrumbBlogLink.addEventListener('click', e => {
      e.preventDefault();
      history.pushState({}, '', buildUrl({ blog: '1' }));
      showBlogListing();
    });
  }

  // Wire post share button
  const shareBtn = document.getElementById('postShareBtn');
  const shareLabel = document.getElementById('postShareLabel');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      await copyToClipboard(window.location.href);
      if (shareLabel) shareLabel.textContent = 'Copied!';
      shareBtn.classList.add('copied');
      showToast(`Share link copied for "${post.title}"!`);
      setTimeout(() => { shareBtn.classList.remove('copied'); if (shareLabel) shareLabel.textContent = 'Share'; }, 2000);
    };
  }

  const navBlogEl = document.getElementById('navBlog');
  const navBlogMobEl = document.getElementById('navBlogMobile');
  if (navBlogEl) navBlogEl.classList.add('current');
  if (navBlogMobEl) navBlogMobEl.classList.add('current');
  document.querySelectorAll('#mainNav a, #mobileNav a').forEach(a => a.classList.remove('current'));

  // Show/hide views
  if (viewPortfolio && !viewPortfolio.hidden) {
    transitionTo(viewBlog, viewPortfolio, () => {
      blogListingView.hidden = true;
      blogPostView.hidden = false;
      setupPostView(post, slug);
    });
  } else {
    viewBlog.hidden = false;
    blogListingView.hidden = true;
    blogPostView.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setupPostView(post, slug);
  }

  // Update topbar title text
  const topbarTitle = document.getElementById('postTopbarTitle');
  if (topbarTitle) topbarTitle.textContent = post.title;
}

function setupPostView(post, slug) {
  buildToc(document.getElementById('singlePostArticle'), post.id);
  wireCodeCopy(document.getElementById('singlePostArticle'));
  wireReadProgress();
  wirePostTopbarTitle();
  renderPostFooterNav(slug);
}

/* ──────────────────────────────────────────────────────────────
   BLOG LISTING VIEW (?blog=1)
────────────────────────────────────────────────────────────── */
function showBlogListing() {
  if (!viewBlog) return;

  const navBlogEl = document.getElementById('navBlog');
  const navBlogMobEl = document.getElementById('navBlogMobile');
  if (navBlogEl) navBlogEl.classList.add('current');
  if (navBlogMobEl) navBlogMobEl.classList.add('current');
  document.querySelectorAll('#mainNav a, #mobileNav a').forEach(a => a.classList.remove('current'));
  document.title = 'Engineering Notes — Vignesh J';

  if (viewPortfolio && !viewPortfolio.hidden) {
    transitionTo(viewBlog, viewPortfolio, () => {
      blogListingView.hidden = false;
      blogPostView.hidden = true;
      renderBlogIndex(activeCategory);
    });
  } else {
    viewBlog.hidden = false;
    blogListingView.hidden = false;
    blogPostView.hidden = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderBlogIndex(activeCategory);
    requestAnimationFrame(() => viewBlog.classList.remove('view-hidden'));
  }

  // Cleanup read progress listener if navigating back
  if (readProgressListener) { window.removeEventListener('scroll', readProgressListener, { passive: true }); readProgressListener = null; }
  if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
}

/* ──────────────────────────────────────────────────────────────
   PORTFOLIO VIEW (homepage)
────────────────────────────────────────────────────────────── */
function showPortfolio(targetHash) {
  if (!viewPortfolio || !viewBlog) return;

  const navBlogEl = document.getElementById('navBlog');
  const navBlogMobEl = document.getElementById('navBlogMobile');
  if (navBlogEl) navBlogEl.classList.remove('current');
  if (navBlogMobEl) navBlogMobEl.classList.remove('current');

  const isBlogCurrentlyVisible = !viewBlog.hidden;

  const performScroll = () => {
    if (targetHash) {
      const el = document.querySelector(targetHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('#mainNav a[href^="#"], #mobileNav a[href^="#"]').forEach(a => {
          a.classList.toggle('current', a.getAttribute('href') === targetHash);
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isBlogCurrentlyVisible) {
    transitionTo(viewPortfolio, viewBlog, () => {
      document.title = 'Vignesh J — Full-Stack & Software Systems Engineer';
      setTimeout(performScroll, 60);
    });
  } else {
    performScroll();
  }

  const url = new URL(window.location.href);
  url.search = '';
  if (targetHash) {
    url.hash = targetHash;
  } else {
    url.hash = '';
  }
  history.pushState({}, '', url.pathname + (url.hash || ''));

  if (readProgressListener) { window.removeEventListener('scroll', readProgressListener, { passive: true }); readProgressListener = null; }
  if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
}

/* ── Universal hash navigation across portfolio & blog ──────── */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const hash = anchor.getAttribute('href');
  if (!hash || hash === '#' || hash === '#main') return;

  const targetEl = document.querySelector(hash);
  if (targetEl) {
    e.preventDefault();
    if (typeof closeMobileNav === 'function') closeMobileNav();
    showPortfolio(hash);
  }
});

/* ── Wire back-to-blog from single post ───────────────────────── */
const backToBlogEl = document.getElementById('backToBlog');
if (backToBlogEl) {
  backToBlogEl.addEventListener('click', e => {
    e.preventDefault();
    history.pushState({}, '', buildUrl({ blog: '1' }));
    showBlogListing();
  });
}

/* ── Wire back-to-portfolio from listing ──────────────────────── */
const backHomeFromListing = document.getElementById('backHomeFromListing');
if (backHomeFromListing) {
  backHomeFromListing.addEventListener('click', e => {
    e.preventDefault();
    showPortfolio();
  });
}

const brandHome = document.getElementById('brandHome');
if (brandHome) {
  brandHome.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof closeMobileNav === 'function') closeMobileNav();
    showPortfolio();
  });
}

/* ── Nav links → blog listing ─────────────────────────────────── */
const navBlog = document.getElementById('navBlog');
if (navBlog) navBlog.addEventListener('click', () => { history.pushState({}, '', buildUrl({ blog: '1' })); showBlogListing(); });

const navBlogMobile = document.getElementById('navBlogMobile');
if (navBlogMobile) navBlogMobile.addEventListener('click', () => { closeMobileNav(); history.pushState({}, '', buildUrl({ blog: '1' })); showBlogListing(); });

const viewAllBlogBtn = document.getElementById('viewAllBlogBtn');
if (viewAllBlogBtn) viewAllBlogBtn.addEventListener('click', () => { history.pushState({}, '', buildUrl({ blog: '1' })); showBlogListing(); });

/* ── Category filters (listing view) ─────────────────────────── */
if (blogCategoryFilters) {
  blogCategoryFilters.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      blogCategoryFilters.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderBlogIndex(activeCategory);
    });
  });
}

/* ── Browser back / forward ───────────────────────────────────── */
window.addEventListener('popstate', () => {
  const p = new URLSearchParams(window.location.search);
  const slug = p.get('post');
  const isBlog = p.get('blog');
  const hash = window.location.hash;
  if (slug) {
    showPost(slug);
  } else if (isBlog) {
    showBlogListing();
  } else {
    showPortfolio(hash);
  }
});

/* ── Initial render ───────────────────────────────────────────── */
renderHomeBlogCards();

(function handleInitialUrl() {
  const p = new URLSearchParams(window.location.search);
  const slug = p.get('post');
  const isBlog = p.get('blog');
  const hash = window.location.hash;
  if (slug) { showPost(slug); return; }
  if (isBlog) { showBlogListing(); return; }
  if (hash) { showPortfolio(hash); }
})();

} // end initPortfolio

if (window.__componentsLoaded) {
  initPortfolio();
} else if (document.querySelector('[data-include]')) {
  window.addEventListener('componentsLoaded', initPortfolio, { once: true });
} else {
  document.addEventListener('DOMContentLoaded', initPortfolio);
}



