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

**Python 3**
```bash
python3 -m http.server 8000
```

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
├── css/
│   └── style.css       # Design system and component styles
├── js/
│   ├── components.js   # Loads HTML fragments into [data-include] placeholders
│   ├── data.js         # Content data (testimonials, achievements, passcode)
│   └── main.js         # Navigation, theme toggle, mobile menu, view switching
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
- Update data-driven sections (testimonials, achievements) in `js/data.js`.
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
