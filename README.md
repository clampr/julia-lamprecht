# Julia Lamprecht – Portfolio & CV Website

Portfolio website for Julia Lamprecht, M.Sc. Psychology · Autismustherapeutin.  
**Live:** https://julia-lamprecht.com

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Vue 3 + Vite (static build)         |
| i18n     | vue-i18n – German & English         |
| Hosting  | GitHub Pages (custom domain)        |

---

## Local Development

### Prerequisites

- Node.js 18+

### Start

```bash
npm install
npm run dev
```

Vite dev server runs at http://localhost:5173.

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions – build & deploy to Pages
├── public/
│   └── CNAME                 # Custom domain for GitHub Pages
├── src/
│   ├── components/
│   │   ├── TheHeader.vue
│   │   ├── HeroSection.vue
│   │   ├── AboutSection.vue
│   │   ├── ExperienceSection.vue
│   │   ├── EducationSection.vue
│   │   ├── ContactSection.vue
│   │   └── TheFooter.vue
│   ├── locales/
│   │   ├── de.json           # German translations
│   │   └── en.json           # English translations
│   ├── App.vue
│   ├── i18n.js
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
└── vite.config.js
```

---

## Deployment

Pushing to `main` triggers the GitHub Actions workflow which builds the site and deploys `frontend/dist/` to GitHub Pages automatically.

To enable GitHub Pages in the repository settings, go to **Settings → Pages** and set the source to **GitHub Actions**.

---

## Adding a Hero Photo

1. Place a portrait photo at `public/hero.jpg`.
2. In `src/components/HeroSection.vue` replace the CSS background:

   ```css
   .hero {
     background-image: url('/hero.jpg');
     background-size: cover;
     background-position: center top;
   }
   ```

---

## Updating Translations

Edit the JSON files in `frontend/src/locales/`:

- `de.json` – German
- `en.json` – English
