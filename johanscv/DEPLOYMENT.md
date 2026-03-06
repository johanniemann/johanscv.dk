# Deployment Notes

## GitHub Pages (active frontend)

Site URL:
- `https://johanscv.dk/`
- `https://johanniemann.github.io/johanscv.dk/`

Deploy command:
- `npm run deploy`

Build behavior:
- Deploy flow enforces `CUSTOM_DOMAIN=true` and verifies `dist/index.html` uses `/assets/...`.
- Vite base defaults to `/johanscv.dk/` for non-custom-domain builds.
- `public/404.html` handles SPA refresh/deep-link fallback for GitHub Pages.

## Publish Steps

1. Push your latest code to GitHub.
2. Run deploy from `johanscv/`:
   - `cd johanscv`
   - `npm run deploy`
3. For GitHub Pages base-path testing build (non-custom-domain):
   - `CUSTOM_DOMAIN=false npm run build`
4. In GitHub repo settings:
   - `Settings -> Pages`
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Open:
   - `https://johanscv.dk/`
   - `https://johanniemann.github.io/johanscv.dk/`

## Ask Johan Mode

Mode notes:
- `johanscv/.env.example` defaults to `VITE_ASK_JOHAN_MODE=mock` (deterministic fallback answers from `src/data/mockAnswers.json`).
- `johanscv/.env.local.example` and `johanscv/.env.production` are configured for `VITE_ASK_JOHAN_MODE=api`.
- API mode expected endpoints:
  - `POST /auth/login`
  - `POST /api/ask-johan`
  - `GET /api/geojohan/maps-key`
  - `GET /api/music-dashboard/snapshot`

## Environment Safety (production vs local)

- Local dev should use `.env.local` (example in `.env.local.example`), usually:
  - `VITE_API_BASE_URL=http://127.0.0.1:8787`
- Production build uses `.env.production`:
  - `VITE_API_BASE_URL=https://johanscv-api-johu0002-no.azurewebsites.net`
- This prevents accidental deploys that point production to `127.0.0.1`.

## Backend Deployment

- The active backend deploy path is Azure App Service.
- Use `../johanscv.dk-api/DEPLOY_AZURE.md` for the API deployment workflow, required app settings, and post-deploy checks.
