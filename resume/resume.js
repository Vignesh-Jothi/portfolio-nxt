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

  function render(data) {
    document.title = `${data.name} — Resume`;

    const contactItems = [
      `<a href="mailto:${data.contact.email}">${icon('mail')}${data.contact.email}</a>`,
      `<a href="tel:+91${data.contact.phone}">${icon('phone')}+91 ${data.contact.phone}</a>`,
      link(data.contact.linktree, 'LinkTree'),
      link(data.contact.linkedin, 'LinkedIn')
    ];

    const contactItems2 = [
      link(data.contact.github, 'GitHub'),
      `${icon('map-pin')}${data.contact.location}`
    ];

    const experienceHtml = data.experience.map(job => `
      <div class="entry">
        <div class="entry-head">
          <div>
            <div class="entry-title"><a href="${job.companyUrl || '#'}" target="_blank" rel="noopener">${job.role}, ${job.company}</a> ${svgExternalLink()}</div>
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
          <div class="contact-row">
            ${contactItems.join('<span class="sep">·</span>')}
          </div>
          <div class="contact-row" style="margin-top:6px;">
            ${contactItems2.join('<span class="sep">·</span>')}
          </div>
        </header>

        <p class="summary" id="summary">${data.summary.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>

        <section class="section" id="experience">
          <div class="section-title">Professional Experience</div>
          ${experienceHtml}
        </section>

        <section class="section" id="skills">
          <div class="section-title">Technical Skills</div>
          <div class="skills-grid">${skillsHtml}</div>
        </section>

        <section class="section" id="projects">
          <div class="section-title">Projects</div>
          ${projectsHtml}
        </section>

        <section class="section" id="education">
          <div class="section-title">Education</div>
          ${educationHtml}
        </section>
      </div>
    `;
  }

  try {
    const res = await fetch('resume.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    render(data);
  } catch (err) {
    container.innerHTML = `<div class="loading">Could not load resume. Please try again later.</div>`;
    console.error('[resume] failed to load', err);
  }

  document.getElementById('downloadBtn').addEventListener('click', () => {
    window.print();
  });
})();
