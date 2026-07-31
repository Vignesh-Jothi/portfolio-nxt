/* ============================================================
   MAIN — all interactive logic for the portfolio.
   Depends on: js/data.js (TESTIMONIALS, ACHIEVEMENTS, ADMIN_PASSCODE)
   ============================================================ */

function initPortfolio() {

/* ---------- auto-calculated years of experience ---------- */
function calcYears(start){
  const now = new Date();
  const s = new Date(start);
  let years = now.getFullYear() - s.getFullYear();
  if(now.getMonth() < s.getMonth() || (now.getMonth() === s.getMonth() && now.getDate() < s.getDate())) years--;
  return Math.max(0, years);
}
const yoe = calcYears('2023-10-01');
const expYearsStat = document.getElementById('expYearsStat');
if(expYearsStat) expYearsStat.textContent = yoe + '+';
const expYearsText = document.getElementById('expYearsText');
if(expYearsText) expYearsText.textContent = yoe + '+ years';

/* ---------- render testimonials & achievements ---------- */
const testGrid = document.getElementById('testGrid');
const testDots = document.getElementById('testDots');
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
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    testDots.appendChild(dot);
  }
});

function initTestimonialCarousel(grid){
  const cards = Array.from(grid.children);
  if(cards.length < 2) return;
  const dots = testDots ? Array.from(testDots.children) : [];

  function updateFocus(){
    const carousel = grid.parentElement;
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
  grid.parentElement.addEventListener('scroll', updateFocus, { passive:true });
  window.addEventListener('resize', updateFocus);

  dots.forEach((dot, i)=>{
    dot.addEventListener('click', ()=>{
      const card = cards[i];
      if(!card) return;
      grid.parentElement.scrollTo({ left: card.offsetLeft - (grid.parentElement.clientWidth - card.offsetWidth) / 2, behavior:'smooth' });
    });
  });

  updateFocus();

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
}

initTestimonialCarousel(testGrid);

const achGrid = document.getElementById('achGrid');
ACHIEVEMENTS.forEach(a=>{
  const card = document.createElement('div');
  card.className = 'ach-card';
  card.innerHTML = `
    <span class="icon-badge" aria-hidden="true"><svg class="icon"><use href="icons/icons.svg#award"></use></svg></span>
    <div><span class="date">${a.date}</span><h3>${a.title}</h3><p>${a.description}</p></div>`;
  achGrid.appendChild(card);
});

/* ---------- scroll progress bar ---------- */
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  scrollProgress.style.width = max > 0 ? (scrolled / max * 100) + '%' : '0%';
}
window.addEventListener('scroll', updateScrollProgress, { passive:true });
updateScrollProgress();

/* ---------- reveal on scroll, staggered within each group ---------- */
const revealGroups = [document.querySelectorAll('.ach-grid > *')];
revealGroups.forEach(group=>{
  group.forEach((el,i)=>{ el.setAttribute('data-reveal',''); el.style.transitionDelay = Math.min(i*70,280)+'ms'; });
});
document.querySelectorAll('.story').forEach((el,i)=>{ el.style.transitionDelay = Math.min(i*90,270)+'ms'; });

const els = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold:0.1 });
els.forEach(el=>io.observe(el));

/* ---------- animated hero stat counters on scroll into view ---------- */
const heroStatTargets = [
  { el: document.querySelectorAll('.stat-card .num')[0], value: yoe, suffix:'+' },
  { el: document.querySelectorAll('.stat-card .num')[1], value: 400, suffix:'+' },
  { el: document.querySelectorAll('.stat-card .num')[2], value: 40, suffix:'%+' },
  { el: document.querySelectorAll('.stat-card .num')[3], value: 7, suffix:'' }
];
let heroStatsDone = false;
const heroStatsIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !heroStatsDone){
      heroStatsDone = true;
      heroStatTargets.forEach(({el,value,suffix})=>{
        if(!el) return;
        let cur = 0; const step = Math.max(1, Math.round(value/26));
        const iv = setInterval(()=>{ cur += step; if(cur>=value){ cur=value; clearInterval(iv); } el.textContent = cur + suffix; }, 25);
      });
      heroStatsIO.disconnect();
    }
  });
}, { threshold:0.4 });
const statsBlock = document.querySelector('.stats');
if(statsBlock) heroStatsIO.observe(statsBlock);

/* ---------- typewriter ---------- */
const phrases = ["software engineer @ PickYourTrail","spreadsheets → systems","40%+ faster APIs, on purpose","Laravel · PHP · MySQL · Redis"];
const twEl = document.getElementById('typewriter');
let pi=0, ci=0, deleting=false;
function tick(){
  const phrase = phrases[pi];
  if(!deleting){ ci++; twEl.textContent = phrase.slice(0,ci); if(ci===phrase.length){ deleting=true; setTimeout(tick,1400); return; } }
  else { ci--; twEl.textContent = phrase.slice(0,ci); if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; } }
  setTimeout(tick, deleting?35:55);
}
tick();

/* ---------- before/after toggles ---------- */
document.querySelectorAll('.toggle').forEach(toggle=>{
  const proj = toggle.dataset.project;
  toggle.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const state = btn.dataset.state;
      toggle.dataset.active = state;
      toggle.querySelectorAll('button').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      document.querySelectorAll(`.panel[data-project="${proj}"]`).forEach(p=>p.classList.toggle('show', p.dataset.state===state));
      if(state==='after'){
        document.querySelectorAll(`.panel[data-project="${proj}"][data-state="after"] .n[data-count]`).forEach(n=>{
          if(n.dataset.done) return; n.dataset.done = "1";
          const target = parseInt(n.dataset.count,10); let cur = 0; const step = Math.max(1, Math.round(target/24));
          const iv = setInterval(()=>{ cur += step; if(cur>=target){ cur=target; clearInterval(iv); } n.textContent = cur; }, 20);
        });
      }
    });
  });
});

/* ---------- recalculation simulator ---------- */
(function(){
  const amountEl = document.getElementById('simAmount');
  const deltaEl = document.getElementById('simDelta');
  const noteEl = document.getElementById('idempotentNote');
  const logList = document.getElementById('simLogList');
  const resetBtn = document.getElementById('simReset');
  if(!amountEl) return;

  const BASE = 42000;
  let value = BASE;
  let entries = [];

  const EVENTS = {
    refund: { delta: -3200, reason: 'refund_applied', label: 'Refund applied' },
    gst:    { delta:  840,  reason: 'gst_updated',     label: 'GST adjustment' },
    cancel: { delta: -5400, reason: 'line_item_cancelled', label: 'Line item cancelled' }
  };

  function fmt(n){ return '₹' + n.toLocaleString('en-IN'); }

  function flashAmount(){
    amountEl.classList.remove('flash');
    void amountEl.offsetWidth;
    amountEl.classList.add('flash');
    setTimeout(()=>amountEl.classList.remove('flash'), 180);
  }

  function showDelta(delta){
    deltaEl.textContent = (delta > 0 ? '+' : '−') + fmt(Math.abs(delta));
    deltaEl.classList.remove('show');
    void deltaEl.offsetWidth;
    deltaEl.classList.add('show');
  }

  function showIdempotentNote(){
    noteEl.classList.remove('show');
    void noteEl.offsetWidth;
    noteEl.classList.add('show');
  }

  function renderLog(){
    if(!entries.length){ logList.innerHTML = '<p class="log-empty">No changes recorded yet.</p>'; return; }
    logList.innerHTML = entries.map(e => `
      <div class="log-entry ${e.authorizer ? 'log-entry--negative' : ''}">
        <div class="log-left">
          <span class="log-reason">${e.reason}</span>
          ${e.authorizer ? `<span class="log-authorizer">authorized by ${e.authorizer}</span>` : ''}
          <span class="log-values">${fmt(e.previous)} → ${fmt(e.updated)}</span>
        </div>
        <span class="log-time mono">${e.time}</span>
      </div>`).join('');
  }

  function confirmNegativeMargin(delta, updated){
    return new Promise((resolve)=>{
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-label="Negative margin warning">
          <h3>Negative margin warning</h3>
          <p style="color:var(--muted);font-size:14px;margin-bottom:16px;">This reduction will make the deal size <strong>${fmt(updated)}</strong> (negative margin). Confirm to continue.</p>
          <div class="field">
            <label for="nmAuthorizer">Your name <span aria-hidden="true">*</span></label>
            <input id="nmAuthorizer" type="text" required placeholder="Who authorized this?">
          </div>
          <div class="modal-actions">
            <button class="btn primary small" id="nmConfirm" type="button" disabled>Reduce anyway</button>
            <button class="btn small" id="nmCancel" type="button">Cancel</button>
          </div>
        </div>`;
      document.body.appendChild(backdrop);
      const input = backdrop.querySelector('#nmAuthorizer');
      const confirmBtn = backdrop.querySelector('#nmConfirm');
      input.focus();

      function isValid(){ return !!input.value.trim(); }
      function updateButton(){ confirmBtn.disabled = !isValid(); }
      input.addEventListener('input', updateButton);

      function close(result){
        backdrop.remove();
        resolve(result);
      }

      function tryConfirm(){
        if(!isValid()){ input.reportValidity(); return; }
        close({ confirmed: true, name: input.value.trim() });
      }

      backdrop.querySelector('#nmConfirm').addEventListener('click', tryConfirm);
      backdrop.querySelector('#nmCancel').addEventListener('click', ()=>close({ confirmed: false }));
      input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') tryConfirm(); });
      backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) close({ confirmed: false }); });
    });
  }

  let isConfirming = false;

  async function applyEvent(key){
    if(isConfirming) return;
    if(key === 'noop'){ showIdempotentNote(); return; }
    const ev = EVENTS[key];
    if(!ev) return;
    const previous = value;
    const updated = value + ev.delta;
    if(previous === updated){ showIdempotentNote(); return; }

    let authorizer = '';
    if(updated < 0){
      isConfirming = true;
      const result = await confirmNegativeMargin(ev.delta, updated);
      isConfirming = false;
      if(!result.confirmed) return;
      authorizer = result.name;
    }

    value = updated;
    amountEl.textContent = fmt(value);
    flashAmount();
    showDelta(ev.delta);
    entries.unshift({
      previous, updated, reason: ev.reason, authorizer,
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
    });
    renderLog();
  }

  document.querySelectorAll('.sim-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>applyEvent(btn.dataset.action));
  });

  resetBtn.addEventListener('click', ()=>{
    value = BASE; entries = [];
    amountEl.textContent = fmt(value);
    renderLog();
  });
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
      copyBtn.classList.add('copied'); copyLabel.textContent = 'Copied!';
      setTimeout(()=>{ copyBtn.classList.remove('copied'); copyLabel.textContent = 'Copy'; }, 1800);
    } catch(e){
      copyLabel.textContent = 'Select & copy';
      setTimeout(()=>{ copyLabel.textContent = 'Copy'; }, 1800);
    }
  });
}

/* ---------- mobile menu ---------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
function closeMobileNav(){
  mobileNav.classList.remove('open'); mobileNav.hidden = true;
  hamburgerBtn.setAttribute('aria-expanded','false');
}
hamburgerBtn.addEventListener('click', ()=>{
  const isOpen = mobileNav.classList.contains('open');
  if(isOpen){ closeMobileNav(); }
  else{ mobileNav.hidden = false; requestAnimationFrame(()=>mobileNav.classList.add('open')); hamburgerBtn.setAttribute('aria-expanded','true'); }
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMobileNav));

/* ---------- active section highlight in nav ---------- */
const navLinks = document.querySelectorAll('#mainNav a[href^="#"]');
const navSections = Array.from(navLinks).map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = '#' + entry.target.id;
      navLinks.forEach(a=>a.classList.toggle('current', a.getAttribute('href')===id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
navSections.forEach(s=>navIO.observe(s));

/* ---------- back to top ---------- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{ backToTop.classList.toggle('show', window.scrollY > 700); }, { passive:true });
backToTop.addEventListener('click', ()=>window.scrollTo({ top:0, behavior:'smooth' }));

/* ---------- theme toggle ---------- */
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', ()=>{
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
});

/* ---------- contact form -> mailto ---------- */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('cf-name').value;
    const email = document.getElementById('cf-email').value;
    const msg = document.getElementById('cf-msg').value;
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
    window.location.href = `mailto:vigneshjothishwaran@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* ---------- view switching (portfolio <-> blog) ---------- */
const viewPortfolio = document.getElementById('view-portfolio');
const viewBlog = document.getElementById('view-blog');
function showBlog(){
  viewPortfolio.classList.add('view-hidden');
  setTimeout(()=>{
    viewPortfolio.hidden = true; viewBlog.hidden = false;
    window.scrollTo(0,0); loadPosts();
    requestAnimationFrame(()=>viewBlog.classList.remove('view-hidden'));
  }, 180);
  viewBlog.classList.add('view-hidden');
}
function showPortfolio(){
  viewBlog.classList.add('view-hidden');
  setTimeout(()=>{
    viewBlog.hidden = true; viewPortfolio.hidden = false;
    window.scrollTo(0,0);
    requestAnimationFrame(()=>viewPortfolio.classList.remove('view-hidden'));
  }, 180);
}
const navBlog = document.getElementById('navBlog');
if (navBlog) navBlog.addEventListener('click', showBlog);
const navBlogMobile = document.getElementById('navBlogMobile');
if (navBlogMobile) navBlogMobile.addEventListener('click', ()=>{ closeMobileNav(); showBlog(); });
const backHome = document.getElementById('backHome');
if (backHome) backHome.addEventListener('click', (e)=>{ e.preventDefault(); showPortfolio(); });
const brandHome = document.getElementById('brandHome');
if (brandHome) brandHome.addEventListener('click', showPortfolio);

/* ---------- blog: storage-backed posts with passcode-gated admin ---------- */
let isAdmin = false; // resets each session by design — no credentials persisted
const postsList = document.getElementById('postsList');
const storageWarning = document.getElementById('storageWarning');

async function loadPosts(){
  postsList.innerHTML = '<p class="empty-state">Loading…</p>';
  if(!(window.storage)){ storageWarning.hidden = false; renderPosts([]); return; }
  try{
    const res = await window.storage.get('blog:posts', true);
    const posts = res && res.value ? JSON.parse(res.value) : [];
    storageWarning.hidden = true;
    renderPosts(posts);
  } catch(e){
    storageWarning.hidden = false;
    renderPosts([]);
  }
}

function renderPosts(posts){
  if(!posts.length){ postsList.innerHTML = '<p class="empty-state">No posts yet.' + (isAdmin ? ' Use the composer above to publish your first one.' : '') + '</p>'; }
  else {
    postsList.innerHTML = posts.map((p,i)=>`
      <article class="post-card">
        <span class="p-date mono">${p.date}</span>
        <h3>${p.title}</h3>
        <div class="p-body">${p.body}</div>
        ${isAdmin ? `<div class="p-actions"><button class="btn small danger" data-idx="${i}" data-action="delete">Delete</button></div>` : ''}
      </article>`).join('');
  }
  if(isAdmin){
    postsList.querySelectorAll('[data-action="delete"]').forEach(b=>{
      b.addEventListener('click', ()=>deletePost(parseInt(b.dataset.idx,10)));
    });
  }
}

async function savePosts(posts){
  await window.storage.set('blog:posts', JSON.stringify(posts), true);
}

async function deletePost(idx){
  const res = await window.storage.get('blog:posts', true);
  const posts = res && res.value ? JSON.parse(res.value) : [];
  posts.splice(idx,1);
  await savePosts(posts);
  loadPosts();
}

async function publishPost(title, body){
  let posts = [];
  try{ const res = await window.storage.get('blog:posts', true); posts = res && res.value ? JSON.parse(res.value) : []; } catch(e){}
  posts.unshift({ title, body, date: new Date().toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }) });
  await savePosts(posts);
  loadPosts();
}

/* ---------- admin modal ---------- */
const adminBtn = document.getElementById('adminBtn');
if(adminBtn){
  adminBtn.addEventListener('click', ()=>{
    if(isAdmin){ openComposer(); return; }
    openPasscodeModal();
  });
}

function openPasscodeModal(){
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Admin login">
      <h3>Admin access</h3>
      <div class="field"><label for="pw">Passcode</label><input id="pw" type="password" autocomplete="off"></div>
      <p class="err" id="pwErr">Incorrect passcode.</p>
      <div class="modal-actions">
        <button class="btn primary small" id="pwSubmit" type="button">Unlock</button>
        <button class="btn small" id="pwCancel" type="button">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const pwInput = backdrop.querySelector('#pw');
  pwInput.focus();
  backdrop.querySelector('#pwCancel').addEventListener('click', ()=>backdrop.remove());
  backdrop.querySelector('#pwSubmit').addEventListener('click', tryUnlock);
  pwInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') tryUnlock(); });
  function tryUnlock(){
    if(pwInput.value === ADMIN_PASSCODE){ isAdmin = true; backdrop.remove(); adminBtn.textContent = '🔓 New Post'; loadPosts(); openComposer(); }
    else { backdrop.querySelector('#pwErr').style.display = 'block'; }
  }
}

function openComposer(){
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="New blog post">
      <h3>New post</h3>
      <div class="field"><label for="pt">Title</label><input id="pt" type="text"></div>
      <div class="field"><label for="pb">Body</label><textarea id="pb" style="min-height:160px;"></textarea></div>
      <div class="modal-actions">
        <button class="btn primary small" id="pubBtn" type="button">Publish</button>
        <button class="btn small" id="pcCancel" type="button">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  backdrop.querySelector('#pcCancel').addEventListener('click', ()=>backdrop.remove());
  backdrop.querySelector('#pubBtn').addEventListener('click', async ()=>{
    const title = backdrop.querySelector('#pt').value.trim();
    const body = backdrop.querySelector('#pb').value.trim();
    if(!title || !body) return;
    await publishPost(title, body);
    backdrop.remove();
  });
}

} // end initPortfolio

if (window.__componentsLoaded) {
  initPortfolio();
} else if (document.querySelector('[data-include]')) {
  window.addEventListener('componentsLoaded', initPortfolio, { once: true });
} else {
  document.addEventListener('DOMContentLoaded', initPortfolio);
}
