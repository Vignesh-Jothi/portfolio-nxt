/* Fetch resume JSON and render the page. */
(async function () {
  const container = document.getElementById('resumePage');

  function icon(name) {
    return `<svg class="contact-icon" aria-hidden="true"><use href="../icons/icons.svg#${name}"></use></svg>`;
  }

  function svgExternalLink() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  }

  function link(url, text) {
    return `<a href="${url}" target="_blank" rel="noopener">${icon('link')}${text}</a>`;
  }

  function parseMonthYear(str) {
    const months = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
    const parts = str.trim().split(/\s+/);
    const m = parts[0] || '';
    const y = parseInt(parts[1] || '0', 10);
    return new Date(y, months[m.toLowerCase()] || 0, 1);
  }

  function calcYears(start) {
    const now = new Date();
    const s = new Date(start);
    let years = now.getFullYear() - s.getFullYear();
    if (now.getMonth() < s.getMonth() || (now.getMonth() === s.getMonth() && now.getDate() < s.getDate())) years--;
    return Math.max(0, years);
  }

  function yearsFromExperience(jobs) {
    if (!jobs || !jobs.length) return 0;
    const starts = jobs.map(j => parseMonthYear(j.start));
    const earliest = new Date(Math.min(...starts));
    return calcYears(earliest);
  }

  function render(data) {
    document.title = `${data.name} — Resume`;
    const yoe = yearsFromExperience(data.experience);

    const contactItems = [
      `<a href="mailto:${data.contact.email}">${icon('mail')}${data.contact.email}</a>`,
      `<a href="tel:+91${data.contact.phone}">${icon('phone')}+91 ${data.contact.phone}</a>`,
      link(data.contact.linktree, 'LinkTree'),
      link(data.contact.linkedin, 'LinkedIn'),
      link(data.contact.github, 'GitHub'),
    ];

    const contactItems2 = [
      
      `${icon('map-pin')}${data.contact.location}`
    ];

    const experienceHtml = data.experience.map(job => `
      <div class="entry">
        <div class="entry-head">
          <div>
            <div class="entry-title"><a href="${job.companyUrl || '#'}" target="_blank" rel="noopener">${job.role}, ${job.company}</a>${svgExternalLink()} </div>
          </div>
          <div class="entry-meta">${job.start} – ${job.end}<br>${job.location}</div>
        </div>
        <ul class="bullets">
          ${job.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const skillsHtml = Object.entries(data.skills).map(([category, items]) => `
      <div class="skill-row">
        <span class="skill-key">${category}:</span>
        <span class="skill-values">${items.join(', ')}</span>
      </div>
    `).join('');

    const projectsHtml = data.projects.map(proj => `
      <div class="entry">
        <div class="entry-head">
          <div class="entry-title">${proj.name}, <span class="entry-sub">${proj.type}</span></div>
          <div class="entry-meta">${proj.start} – ${proj.end}</div>
        </div>
        <ul class="bullets">
          ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const achievementsHtml = (data.achievements || []).map(a => `
      <div class="entry entry--compact">
        <div class="entry-head">
          <div class="entry-title">${a.title}</div>
          <div class="entry-meta">${a.date}</div>
        </div>
        <p class="entry-note">${a.description}</p>
      </div>
    `).join('');

    const educationHtml = data.education.map(edu => `
      <div class="entry">
        <div class="entry-head">
          <div class="entry-title">${edu.degree}, <span class="entry-sub">${edu.school}</span></div>
          <div class="entry-meta">${edu.start} – ${edu.end}<br>${edu.location}</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="resume-body">
        <header class="resume-header">
          <h1>${data.name}</h1>
          <p class="resume-title">${data.title}</p>
          <div class="contact-row">
            ${contactItems.join('<span class="sep">·</span>')}
          </div>
          <div class="contact-row" style="margin-top:6px;">
            ${contactItems2.join('<span class="sep">·</span>')}
          </div>
        </header>

        <section class="section section--summary" id="summary">
          <div class="section-title">Summary</div>
          <p class="summary">${data.summary.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\{years\}/g, yoe)}</p>
        </section>

        <section class="section" id="experience">
          <div class="section-title">Professional Experience</div>
          ${experienceHtml}
        </section>

        <section class="section" id="projects">
          <div class="section-title">Projects</div>
          ${projectsHtml}
        </section>

        <section class="section" id="achievements">
          <div class="section-title">Key Achievements</div>
          ${achievementsHtml || '<p class="empty-section">No achievements listed.</p>'}
        </section>

        <section class="section" id="skills">
          <div class="section-title">Technical Skills</div>
          <div class="skills-grid">${skillsHtml}</div>
        </section>

        <section class="section" id="education">
          <div class="section-title">Education</div>
          <div class="edu-fade">${educationHtml}</div>
        </section>
      </div>
    `;
  }

  try {
    const res = await fetch('resume.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    render(data);

    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn && !shareBtn.dataset.shareBound) {
      shareBtn.addEventListener('click', async () => {
        const url = new URL(location.href);
        url.search = '';
        url.hash = '';
        const shareUrl = url.toString();
        const originalHtml = shareBtn.innerHTML;
        try {
          if (navigator.share) {
            await navigator.share({ title: document.title, url: shareUrl });
            return;
          }
          await navigator.clipboard.writeText(shareUrl);
          shareBtn.innerHTML = `<svg class="btn-icon" aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5 5 11-11"/></svg><span class="btn-label">Copied</span>`;
          setTimeout(() => { shareBtn.innerHTML = originalHtml; }, 1800);
        } catch (e) {
          if (e && e.name === 'AbortError') return;
          shareBtn.innerHTML = `<span class="btn-label">Copy failed</span>`;
          setTimeout(() => { shareBtn.innerHTML = originalHtml; }, 1800);
        }
      });
      shareBtn.dataset.shareBound = '1';
    }

    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn && !downloadBtn.dataset.printBound) {
      downloadBtn.addEventListener('click', triggerPrint);
      downloadBtn.dataset.printBound = '1';
    }

    if (new URLSearchParams(location.search).has('download')) {
      triggerPrint();
    }
  } catch (err) {
    container.innerHTML = `<div class="loading">Could not load resume. Please try again later.</div>`;
    console.error('[resume] failed to load', err);
  }

  function triggerPrint() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => window.print());
    } else {
      window.print();
    }
  }
})();
