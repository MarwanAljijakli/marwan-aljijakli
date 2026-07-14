# Marwan Aljijakli — Portfolio

The source for [marwan-aljijakli.com](https://marwan-aljijakli.com), a fast bilingual portfolio for Marwan Aljijakli, AI & Data Engineer.

## What is included

- English and Arabic content with complete LTR/RTL switching
- Light and dark themes with saved preferences and no theme flash
- A server-rendered editorial interface with a deliberately small client runtime
- Verified experience, education, awards, projects, and contact details
- Downloadable CV, social metadata, structured data, sitemap, robots file, and web manifest
- Responsive layouts for mobile, tablet, and desktop
- Reduced-motion support and keyboard-friendly navigation

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Plain CSS with no runtime styling dependency
- Vercel

## Local development

Node.js 22 is required.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

To verify the built site contracts, start the production server:

```bash
npm run start
```

Then use a second terminal:

```bash
npm run verify
```

Set `SITE_URL` to test another origin. Set `CHECK_EXTERNAL=1` to include the public project links.

```powershell
$env:SITE_URL = "https://marwan-aljijakli.com"
$env:CHECK_EXTERNAL = "1"
npm run verify
```

## Content updates

Portfolio copy and project data live in `src/content/portfolio.ts`. Design tokens and responsive rules live in `src/app/globals.css`.

The public CV is stored at `public/marwan-cv.pdf`. Keep claims in the site aligned with the current CV and live project sources.

## Deployment

The repository is linked to the `marwan-aljijakli` Vercel project. Production deploys target [marwan-aljijakli.com](https://marwan-aljijakli.com).
