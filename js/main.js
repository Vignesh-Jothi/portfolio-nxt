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
            <figcaption><b>${q.name}</b><span>${q.role}</span></figcaption>
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

/* ---------- hero ship.log terminal reveal ---------- */
const termLines = document.querySelectorAll('.tech-body .tech-line');
if(termLines.length){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion){
    termLines.forEach(l=>l.classList.add('show'));
  } else {
    let i = 0;
    (function next(){
      if(i >= termLines.length) return;
      termLines[i].classList.add('show');
      i++;
      setTimeout(next, termLines[i-1].classList.contains('t-gap') ? 140 : 260);
    })();
  }
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
const navLinks = document.querySelectorAll('#mainNav a[href^="#"]');
const navSections = Array.from(navLinks).map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if(navSections.length && 'IntersectionObserver' in window){
  const navIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        navLinks.forEach(a=>a.classList.toggle('current', a.getAttribute('href')===id));
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
   BLOG ENGINE — Homepage Showcase & Full Article Reader
   ============================================================ */
const viewPortfolio = document.getElementById('view-portfolio');
const viewBlog = document.getElementById('view-blog');
const homeBlogGrid = document.getElementById('homeBlogGrid');
const postsList = document.getElementById('postsList');
const blogCategoryFilters = document.getElementById('blogCategoryFilters');
let activeCategory = 'all';

function getAllPosts(){
  let posts = (typeof BLOG_POSTS !== 'undefined') ? [...BLOG_POSTS] : [];
  return posts;
}

/* ---------- render home blog showcase cards ---------- */
function renderHomeBlogCards(){
  if(!homeBlogGrid) return;
  const posts = getAllPosts();
  if(!posts.length) return;

  homeBlogGrid.innerHTML = posts.slice(0, 3).map(p => `
    <article class="home-blog-card" data-post-id="${p.id}" tabindex="0" role="button" aria-label="Read article: ${p.title}">
      <div>
        <div class="card-meta">
          <span class="category-badge">${p.category}</span>
          <span class="read-time">${p.readTime}</span>
        </div>
        <h3>${p.title}</h3>
        <p class="card-summary">${p.summary}</p>
      </div>
      <div class="card-footer">
        <span class="card-date">${p.date}</span>
        <span class="read-action">Read Article →</span>
      </div>
    </article>
  `).join('');

  homeBlogGrid.querySelectorAll('.home-blog-card').forEach(card => {
    const handleOpen = () => {
      const postId = card.dataset.postId;
      showBlog(postId);
    };
    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } });
  });
}

/* ---------- render full blog reader articles ---------- */
function renderBlogReader(filterCat = 'all', targetPostId = null){
  if(!postsList) return;
  const allPosts = getAllPosts();
  let filtered = allPosts;
  if(filterCat && filterCat !== 'all'){
    filtered = allPosts.filter(p => p.category.toLowerCase() === filterCat.toLowerCase());
  }

  if(targetPostId){
    const specific = allPosts.find(p => p.id === targetPostId);
    if(specific) filtered = [specific];
  }

  if(!filtered.length){
    postsList.innerHTML = '<p class="empty-state">No articles found in this category.</p>';
    return;
  }

  postsList.innerHTML = filtered.map(p => `
    <article class="blog-article-full" id="article-${p.id}">
      <header class="blog-article-header">
        <div class="article-meta">
          <span class="category-badge">${p.category}</span>
          <span class="read-time mono">${p.readTime}</span>
          <span class="card-date">${p.date}</span>
        </div>
        <h2>${p.title}</h2>
        <div class="article-tags">
          ${(p.tags || []).map(t => `<span class="article-tag">#${t}</span>`).join('')}
        </div>
      </header>
      <div class="article-content">
        ${p.content}
      </div>
    </article>
  `).join('');
}

/* ---------- view switching (portfolio <-> blog) ---------- */
function showBlog(postId = null){
  if(!viewPortfolio || !viewBlog) return;
  viewPortfolio.classList.add('view-hidden');
  setTimeout(()=>{
    viewPortfolio.hidden = true;
    viewBlog.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderBlogReader(activeCategory, postId);
    requestAnimationFrame(()=>viewBlog.classList.remove('view-hidden'));
  }, 180);
}

function showPortfolio(){
  if(!viewPortfolio || !viewBlog) return;
  viewBlog.classList.add('view-hidden');
  setTimeout(()=>{
    viewBlog.hidden = true;
    viewPortfolio.hidden = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(()=>viewPortfolio.classList.remove('view-hidden'));
  }, 180);
}

/* ---------- wire blog navigation events ---------- */
const navBlog = document.getElementById('navBlog');
if(navBlog) navBlog.addEventListener('click', ()=>showBlog());

const navBlogMobile = document.getElementById('navBlogMobile');
if(navBlogMobile) navBlogMobile.addEventListener('click', ()=>{ closeMobileNav(); showBlog(); });

const viewAllBlogBtn = document.getElementById('viewAllBlogBtn');
if(viewAllBlogBtn) viewAllBlogBtn.addEventListener('click', ()=>showBlog());

const backHome = document.getElementById('backHome');
if(backHome) backHome.addEventListener('click', (e)=>{ e.preventDefault(); showPortfolio(); });

const brandHome = document.getElementById('brandHome');
if(brandHome) brandHome.addEventListener('click', showPortfolio);

/* ---------- category filtering ---------- */
if(blogCategoryFilters){
  blogCategoryFilters.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', ()=>{
      blogCategoryFilters.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderBlogReader(activeCategory, null);
    });
  });
}

// Initial render of home cards and blog
renderHomeBlogCards();

} // end initPortfolio

if (window.__componentsLoaded) {
  initPortfolio();
} else if (document.querySelector('[data-include]')) {
  window.addEventListener('componentsLoaded', initPortfolio, { once: true });
} else {
  document.addEventListener('DOMContentLoaded', initPortfolio);
}
