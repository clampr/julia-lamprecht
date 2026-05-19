# Julia Lamprecht – Portfolio & CV Website

Portfolio website for Julia Lamprecht, M.Sc. Psychology · Autismustherapeutin.  
**Live:** https://julia-lamprecht.com

---

## Tech Stack

| Layer    | Technology                                |
|----------|-------------------------------------------|
| Frontend | Vue 3 + Vite (static build)               |
| Backend  | PHP 8 – contact form (`contact.php`)      |
| i18n     | vue-i18n – German & English               |
| Dev env  | Docker (Node + Apache/PHP containers)     |
| Hosting  | Shared PHP hosting – all-inkl.com         |

---

## Local Development (Docker)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose plugin)

### Start

```bash
docker compose up
```

- **Frontend (Vite dev server):** http://localhost:5173  
- **PHP backend only:** http://localhost:8080

Hot-module replacement is active; changes to `frontend/src/` are reflected instantly.

### Stop

```bash
docker compose down
```

---

## Project Structure

```
.
├── frontend/
│   ├── public/
│   │   └── contact.php          # PHP contact form (copied into build)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TheHeader.vue
│   │   │   ├── HeroSection.vue
│   │   │   ├── AboutSection.vue
│   │   │   ├── ExperienceSection.vue
│   │   │   ├── EducationSection.vue
│   │   │   ├── ContactSection.vue
│   │   │   └── TheFooter.vue
│   │   ├── locales/
│   │   │   ├── de.json          # German translations
│   │   │   └── en.json          # English translations
│   │   ├── App.vue
│   │   ├── i18n.js
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker/
│   └── php/
│       ├── Dockerfile
│       └── apache.conf
├── docker-compose.yml
└── README.md
```

---

## Adding a Hero Photo

1. Place a high-resolution portrait photo at `frontend/public/hero.jpg`  
   (landscape/full-width crops work best; min. 1920 px wide)
2. In `frontend/src/components/HeroSection.vue` replace the CSS background with:

   ```css
   .hero {
     background-image: url('/hero.jpg');
     background-size: cover;
     background-position: center top;
     filter: grayscale(1);
   }
   ```

3. Remove or comment out the `background-image: radial-gradient(…)` lines.

---

## Contact Form Configuration

Open `frontend/public/contact.php` and update the recipient address:

```php
$to = 'mail@julia-lamprecht.com'; // ← your real mailbox
```

On all-inkl.com the PHP `mail()` function is available by default.

---

## Build & Deploy (all-inkl.com)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Build

```bash
npm run build
```

The output is written to `frontend/dist/`.

### 3. Upload

Upload **all files inside** `frontend/dist/` to your hosting web root via FTP/SFTP.  
`contact.php` is automatically included in the build because it lives in `public/`.

#### Recommended FTP client: FileZilla or Cyberduck

```
dist/
├── index.html      → upload to /
├── contact.php     → upload to /
└── assets/         → upload to /assets/
```

---

## Updating Translations

Edit the JSON files in `frontend/src/locales/`:

- `de.json` – German
- `en.json` – English

CV entries (experience, education) follow the same structure in both files.

---

## Development Without Docker

If you prefer to run without Docker:

```bash
cd frontend
npm install
npm run dev        # starts Vite dev server at http://localhost:5173
```

> The contact form will not work locally without a PHP server.  
> For full-stack testing, use Docker as described above.
