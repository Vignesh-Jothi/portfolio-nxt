# Portfolio

Welcome to Vignesh's Portfolio GitHub repository! This project is a showcase of my talent, skills, and notable achievements in web development.

## About

This portfolio website highlights my skills and projects in web development. It is built using modern web technologies and frameworks to ensure a responsive and engaging user experience.

## Features

- Responsive design
- Showcase of projects with descriptions and technologies used
- Contact form for easy communication
- Detailed sections on skills and achievements

## Preview

Open the site through a local server. Because components are loaded via `fetch()`, opening `index.html` directly from the filesystem (`file://`) will be blocked by browser CORS policy.

### Run locally

**Python 3 (recommended: never caches, so edits show on a normal refresh)**
```bash
python3 serve.py
```

Plain `python3 -m http.server 8000` also works, but browsers may keep showing old files until you hard-refresh (Cmd+Shift+R).

**Node.js**
```bash
npx serve .
# or
npx http-server .
```

**VS Code Live Server**
Right-click `index.html` and select **Open with Live Server**.

Then visit `http://localhost:8000` (or the port shown by your server).

## Project structure

```
portfolio/
├── index.html          # Entry point; wires components together
├── admin/
│   └── index.html      # Passcode-protected blog admin (/admin)
├── css/
│   ├── style.css       # Design system and component styles
│   ├── theme.css       # Accent palettes + theme picker (shared with resume/)
│   └── space.css       # Accent palettes, rocket hero, bento, projects, skills, journey
├── js/
│   ├── components.js   # Loads HTML fragments into [data-include] placeholders
│   ├── data.js         # Content data (testimonials, achievements, projects, skills, about Q&A, journey)
│   ├── theme.js        # Theme picker logic (shared with resume/)
│   ├── main.js         # Navigation, theme toggle, mobile menu, view switching
│   ├── space.js        # Theme panel, starfield, rocket launch, chat, project modal, skills radar
│   └── admin.js        # Admin-only blog composer and delete controls
└── components/
    ├── topbar.html
    ├── hero.html
    ├── about.html
    ├── projects.html
    ├── testimonials.html
    ├── achievements.html
    ├── experience.html
    ├── skills.html
    ├── education.html
    ├── how-i-think.html
    ├── growth.html
    ├── contact.html
    ├── blog-view.html
    └── back-to-top.html
```

## How components work

Components are plain HTML fragments in `components/`. They are included in `index.html` via placeholder tags:

```html
<div data-include="components/hero.html"></div>
```

`js/components.js` finds every `[data-include]` element, fetches the referenced file, and replaces the placeholder with the fetched HTML at runtime.

## Customize content

- Edit plain text and markup inside `components/*.html`.
- Update data-driven sections in `js/data.js`: `PROJECTS`, `SKILL_GROUPS` (level 3/2/1), `ABOUT_QA` (the "Ask me anything" chat), `PRINCIPLES`, `JOURNEY`, testimonials and achievements.
- Accent palettes (Ocean, Aurora, Sunset, Nebula, Forest) are solid three-colour sets (`--c1`, `--c2`, `--c3`) in `css/theme.css` and apply to both the portfolio and the resume page.
- The AI agent playground scenarios are `AGENT_SCENARIOS` in `js/data.js` (`components/ai-lab.html`).
- Resume interactions (search, skill chips, impact highlighting, quick scan) are in `resume/resume-fx.js`; printing always uses the plain black-on-white layout.
- Tweak colors and spacing in `css/style.css`.
- Set your own admin passcode in `js/data.js` (`ADMIN_PASSCODE`) before deploying.

## License

MIT — see [LICENSE](./LICENSE).

## Contact

Feel free to reach out for any inquiries or collaboration opportunities:

- **Email**: [vigneshjothishwaran@gmail.com](mailto:vigneshjothishwaran@gmail.com)

Thank you for visiting my portfolio repository!

---

© 2026 Vignesh. All rights reserved.
