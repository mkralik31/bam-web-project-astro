# Atelier BÄM – Web & Admin

Static website built with **Astro 5**, integrated with **Keystatic CMS** (Cloud mode), and automatically deployed to **HostCreators** via GitHub Actions.

---

## 🛠️ Tech Stack

- **Framework:** [Astro 5](https://astro.build/) (Static mode)
- **CMS:** [Keystatic Cloud](https://keystatic.com/)
- **UI & Styling:** React & Tailwind CSS
- **Hosting:** HostCreators (Shared Webhosting via FTP)
- **CI/CD:** GitHub Actions

---

## 🚀 Project Structure

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Action for FTP deployment to HostCreators
├── public/                     # Static assets and public files
├── src/
│   ├── content/                # Content managed by Keystatic (Markdown/Markdoc)
│   ├── pages/
│   │   ├── index.astro         # Main homepage
│   │   └── keystatic/
│   │       └── [...file].astro # Admin UI for Keystatic CMS (/keystatic)
│   └── components/             # Astro and React components
├── keystatic.config.ts         # Keystatic CMS configuration (collections, schema)
├── astro.config.mjs            # Main Astro configuration
└── package.json
```
