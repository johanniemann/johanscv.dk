# AGENTS.md (Frontend: johanscv)

## Mission
- Maintain the active frontend SPA (Vite + Vanilla JS + Tailwind) without breaking routes, UX, or GitHub Pages deploy behavior.

## Discovery Rule (Mandatory)
- Do not rely on stale file assumptions.
- Before major edits, dynamically verify:
  - scripts/tooling,
  - router paths,
  - page/component boundaries,
  - env usage,
  - deployment base path behavior.

## Active Frontend Facts
- Entry/bootstrap is in `src/main.js`.
- SPA routing is handled client-side (`src/router.js`), including `/playground`, `/quiz`, and `/quiz/geojohan`.
- Feature modules:
  - Ask Johan: `src/features/ask-johan/AskJohanWidget.js`
  - GeoJohan: `src/features/geojohan/GeoJohanPage.js`
  - GeoJohan config/env readers: `src/features/geojohan/geojohanEnv.js`, `src/features/geojohan/geojohanRounds.js`
- Resume page module: `src/pages/Resume.js`.
- Styling is custom CSS with Tailwind/PostCSS tooling; avoid introducing new UI frameworks.
- Theme/language are state-driven via localStorage and UI toggles.

## Security & Privacy Guardrails
- Never commit `.env.local` or secrets.
- Never print secret values/private context in logs or summaries.
- Treat all `VITE_*` vars as public in browser bundles.
- Do not claim client-side env data is secret.
- Keep Ask Johan client auth flow compatible with API expectations:
  - login via `/auth/login`,
  - bearer token on `/api/ask-johan`,
  - bearer token on `/api/geojohan/maps-key`.

## Environment Variables (Frontend)
- Source of truth: `.env.local.example` + runtime code.
- Core vars:
  - `VITE_ASK_JOHAN_MODE`
  - `VITE_API_BASE_URL`
- Optional GeoJohan vars:
  - `VITE_GEOJOHAN_ROUND{N}_TITLE`
  - `VITE_GEOJOHAN_ROUND{N}_PANO_LAT`, `_PANO_LNG`, `_PANO_ID`
  - `VITE_GEOJOHAN_ROUND{N}_POV_HEADING`, `_POV_PITCH`
  - `VITE_GEOJOHAN_ROUND{N}_ANSWER_LAT`, `_ANSWER_LNG`
  - `VITE_GEOJOHAN_ROUND{N}_SUMMARY_ADDRESS`
  - `VITE_GEOJOHAN_ROUND{N}_SUMMARY_CONTEXT_DK`, `_SUMMARY_CONTEXT_EN`
- Build-time shell var:
  - `CUSTOM_DOMAIN` (controls Vite base path).

## Definition Of Done (Frontend)
- Run from `johanscv/`:
  - `npm run lint`
  - `npm run smoke`
  - `npm run build`
- If runtime behavior changed, also run `npm run dev` smoke and report local URL.
- Never commit/push without explicit Johan approval.
- Final summary must list:
  - changed files,
  - commands + pass/fail,
  - residual risks.
