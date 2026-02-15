# AGENTS.md (Frontend: johanscv)

## Purpose
- This folder is the active portfolio frontend (Vite + Vanilla JS + Tailwind).
- Prioritize preserving route behavior, language/theme UX, and deploy compatibility with GitHub Pages.

## Ground Rules
- Do not modify backend behavior from this folder.
- Keep changes minimal and verify with `npm run build`.
- If behavior is unclear, inspect source files before concluding.
- Cite exact file paths in summaries.

## Truth Sources / Boundaries
- Scripts and package tooling: `johanscv/package.json`
- Base path behavior: `johanscv/vite.config.js`
- App bootstrap: `johanscv/src/main.js`
- Routing: `johanscv/src/router.js`
- Data and translations: `johanscv/src/data/*`
- Deployment docs: `johanscv/DEPLOYMENT.md`
- Legacy prototype source lives in `legacy/root-src/` and is not this app's source tree.

## Standard Workflow
- Install:
  - `npm install`
- Dev:
  - `npm run dev`
- Build:
  - `npm run build`
- Preview:
  - `npm run preview`
- Deploy (GitHub Pages):
  - `npm run deploy`
  - Custom-domain base `/`: `CUSTOM_DOMAIN=true npm run deploy`

Run all commands from:
- `cd /Users/johanniemannhusbjerg/Desktop/WEBSITE/johanscv`

## Environment Variables
- Local file: `johanscv/.env.local` (template: `johanscv/.env.local.example`)
- Used vars:
  - `VITE_ASK_JOHAN_MODE`
  - `VITE_API_BASE_URL`
  - `VITE_SITE_ACCESS_CODE`
- Build-time shell var:
  - `CUSTOM_DOMAIN` (switches Vite `base` between `/johanscv.dk/` and `/`)

## Known Gotchas
- Default local URL usually includes base path:
  - `http://localhost:5173/johanscv.dk/`
- App uses SPA deep-link fallback in `johanscv/public/404.html`.
- Ask Johan feature can run in `mock` or `api` mode; confirm env mode before debugging API calls.
- Access gate is enforced client-side via `VITE_SITE_ACCESS_CODE` in `johanscv/src/main.js`.

## Output Conventions for Frontend Tasks
- Report changed files with short rationale.
- Report commands run and pass/fail:
  - at minimum `npm run build`
  - include `npm run dev` smoke status when relevant.
- Include the dev URL shown by Vite if server was started.
- Do not claim deploy success unless deploy command was actually run.
