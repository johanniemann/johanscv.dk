# Deployment Notes

## GitHub Pages (active)

Site URL:
- `https://johanscv.dk/`
- `https://johanniemann.github.io/johanscv.dk/`

Deploy command:
- `npm run deploy`

Build behavior:
- Vite base defaults to `/johanscv.dk/`.
- If `CUSTOM_DOMAIN=true`, Vite base becomes `/`.
- `public/404.html` handles SPA refresh/deep-link fallback for GitHub Pages.

## Publish Steps

1. Push your latest code to GitHub.
2. Run deploy from `johanscv/`:
   - `cd /Users/johanniemannhusbjerg/Desktop/WEBSITE/johanscv`
   - `CUSTOM_DOMAIN=true npm run deploy`
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

Default mode:
- Mock deterministic answers from `src/data/mockAnswers.json`.

Optional API mode later:
- Set env: `VITE_ASK_JOHAN_MODE=api`
- Expected endpoint: `POST /api/ask-johan`
- Expected response JSON: `{ "answer": "..." }`

## Environment Safety (production vs local)

- Local dev should use `.env.local` (example in `.env.local.example`), usually:
  - `VITE_API_BASE_URL=http://127.0.0.1:8787`
- Production build now uses `.env.production`:
  - `VITE_API_BASE_URL=https://ask-johan-api.onrender.com`
- This prevents accidental deploys that point production to `127.0.0.1`.
