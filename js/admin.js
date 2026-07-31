/* ============================================================
   ADMIN — passcode-protected blog management.
   Depends on: ../js/data.js (ADMIN_PASSCODE)
   ============================================================ */

(function(){
  const postsList = document.getElementById('postsList');
  const storageWarning = document.getElementById('storageWarning');
  const adminBtn = document.getElementById('adminBtn');
  let isAdmin = false; // resets each session by design — no credentials persisted

  /* ---------- theme toggle ---------- */
  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeBtn.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeBtn.addEventListener('click', ()=>{
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  /* ---------- scroll progress ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if(scrollProgress) scrollProgress.style.width = max > 0 ? (h.scrollTop / max * 100) + '%' : '0%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive:true });
  updateScrollProgress();

  /* ---------- load / render posts ---------- */
  async function loadPosts(){
    if(postsList) postsList.innerHTML = '<p class="empty-state">Loading…</p>';
    if(!window.storage){
      if(storageWarning) storageWarning.hidden = false;
      renderPosts([]);
      return;
    }
    try{
      const res = await window.storage.get('blog:posts', true);
      const posts = res && res.value ? JSON.parse(res.value) : [];
      if(storageWarning) storageWarning.hidden = true;
      renderPosts(posts);
    } catch(e){
      if(storageWarning) storageWarning.hidden = false;
      renderPosts([]);
    }
  }

  function renderPosts(posts){
    if(!postsList) return;
    if(!posts.length){
      postsList.innerHTML = '<p class="empty-state">No posts yet.' + (isAdmin ? ' Use the composer to publish your first one.' : '') + '</p>';
      return;
    }
    postsList.innerHTML = posts.map((p,i)=>`
      <article class="post-card">
        <span class="p-date mono">${p.date}</span>
        <h3>${p.title}</h3>
        <div class="p-body">${p.body}</div>
        ${isAdmin ? `<div class="p-actions"><button class="btn small danger" data-idx="${i}" data-action="delete" type="button">Delete</button></div>` : ''}
      </article>`).join('');
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
    if(!window.storage) return;
    const res = await window.storage.get('blog:posts', true);
    const posts = res && res.value ? JSON.parse(res.value) : [];
    posts.splice(idx,1);
    await savePosts(posts);
    loadPosts();
  }

  async function publishPost(title, body){
    if(!window.storage) return;
    let posts = [];
    try{ const res = await window.storage.get('blog:posts', true); posts = res && res.value ? JSON.parse(res.value) : []; } catch(e){}
    posts.unshift({ title, body, date: new Date().toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' }) });
    await savePosts(posts);
    loadPosts();
  }

  /* ---------- admin controls ---------- */
  if(adminBtn){
    adminBtn.hidden = false;
    adminBtn.addEventListener('click', ()=>{
      if(isAdmin){ openComposer(); }
      else { openPasscodeModal(); }
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
      if(pwInput.value === ADMIN_PASSCODE){
        isAdmin = true;
        backdrop.remove();
        adminBtn.textContent = '🔓 New Post';
        loadPosts();
        openComposer();
      } else {
        backdrop.querySelector('#pwErr').style.display = 'block';
      }
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

  loadPosts();
})();
