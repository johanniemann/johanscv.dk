# Deployment Notes

## GitHub Pages (active)

Site URL:
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
   - `npm run deploy`
3. For custom domain builds:
   - `CUSTOM_DOMAIN=true npm run deploy`
4. In GitHub repo settings:
   - `Settings -> Pages`
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Open:
   - `https://johanniemann.github.io/johanscv.dk/`

## Ask Johan Mode

Default mode:
- Mock deterministic answers from `src/data/mockAnswers.json`.

Optional API mode later:
- Set env: `VITE_ASK_JOHAN_MODE=api`
- Expected endpoint: `POST /api/ask-johan`
- Expected response JSON: `{ "answer": "..." }`
