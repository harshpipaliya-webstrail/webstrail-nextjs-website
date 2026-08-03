# Webstrail website — deploy package

Static marketing site (built with Next.js as a static export). No server runtime,
no database — it is plain HTML/CSS/JS and can be hosted on any static web server or CDN.

## Contents
- `site/`      Ready-to-host build. **This is what you deploy.** ~9 MB, self-contained.
- `source/`    Next.js source project, in case you need to rebuild/maintain (no node_modules).
- `nginx.conf` Example server config (clean URLs, gzip, caching, redirect notes).
- `README.md`  This file.

## Deploy (fastest path — just host `site/`)
1. Copy the **contents of `site/`** to your web root (e.g. `/var/www/webstrail`).
2. Point your server at it. For nginx, use `nginx.conf` (set `root` to that folder), then
   `nginx -t && systemctl reload nginx`. For Apache/Caddy/S3+CloudFront/Netlify/Vercel,
   just serve the folder as static files with a directory index of `index.html`.
3. Add TLS (Let's Encrypt) and enable the www->apex + http->https redirects in `nginx.conf`.

That's it — every page is prebuilt HTML.

### Notes
- URLs are clean (no `.html`): `/`, `/services/`, `/services/revenue-cycle-management/rcm-automation/`,
  `/who-we-work-with/dsos-multi-location-groups/`, `/resources/<slug>/`, `/case-studies/<slug>/`,
  `/about/`, `/contact/`, `/privacy-policy/`, etc.
- Old `.html` URLs (e.g. `/case-studies.html`) are preserved as redirect stub pages that forward to the
  clean URL, so existing inbound links keep working. For best SEO, convert them to real 301s using the
  commented block in `nginx.conf` (then you may delete the `*.html` stub files).
- SEO files included: `robots.txt`, `sitemap.xml`, `llms.txt`, and the IndexNow key file.
- The contact form POSTs JSON `{name,company,email,description}` to
  `https://api-webstrail.webstrail.com/api/v1/contact-us/send-sales-mail` — make sure that endpoint/CORS is live.

## Rebuild from source (only if you need to change something)
Requires Node 18+.
```
cd source
npm install
npm run build      # outputs a fresh static site into source/out/
```
Then deploy the contents of `source/out/` the same way as `site/`.

> **Deploying? You do NOT need to run Node at all.** Just host the prebuilt `site/`
> folder (see the fastest-path section above). `source/` is only for editing content.

### Local dev server (`npm run dev`) — read this
- `npm run dev` starts Next.js on http://localhost:8124 for editing the
  Next-rendered pages (home, services, who-we-work-with, resources, about, and all
  their sub-pages).
- The **static leaf pages** — `contact`, `privacy-policy`, `terms-of-service`,
  `trust-service-center`, and everything under `case-studies/` — live as plain HTML
  in `source/public/`. The dev server does **not** serve those at their clean
  `/contact/` style URLs (you'll see a 404 in dev); they are included correctly in
  the production build (`npm run build` → `out/`) and in the shipped `site/` folder.
- To preview the **complete** site exactly as it deploys, run `npm run build` and
  serve `out/` with any static server, e.g. `npx serve out`.
- Note: `next.config.mjs` applies `output: 'export'` for `next build` only. This is
  deliberate — with it on during `next dev`, Next 14 wrongly reports
  "missing generateStaticParams()" and returns HTTP 500 on every dynamic route.
  Do not hard-code `output: 'export'` back on unconditionally.
- Page content lives as HTML fragments in `source/content/` (+ `manifest.json`); the shared shell
  (nav/footer/head) is in `source/app/layout.tsx`; static leaf pages (case studies, legal, contact) and
  all assets are in `source/public/`.
- Design-system CSS: `source/public/Webstrail Design System/` — `styles.css` is a flattened build of the
  files in `tokens/`; if you edit a token file, re-flatten into `styles.css` (see MIGRATION_STATUS.md).
