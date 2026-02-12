# Deployment Notes

## GitHub Pages (active)

Site URL:
- `https://johanniemann.github.io/WEBSITE/`

Deploy command:
- `npm run deploy`

Build behavior:
- Vite base is fixed to `/WEBSITE/` in `vite.config.js`.
- `public/404.html` handles SPA refresh/deep-link fallback for GitHub Pages.

## Publish Steps

1. Push your latest code to GitHub.
2. Run deploy from project root:
   - `npm run deploy`
3. In GitHub repo settings:
   - `Settings -> Pages`
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Open:
   - `https://johanniemann.github.io/WEBSITE/`

## Ask Johan Mode

Default mode:
- Mock deterministic answers from `src/data/mockAnswers.json`.

Optional API mode later:
- Set env: `VITE_ASK_JOHAN_MODE=api`
- Expected endpoint: `POST /api/ask-johan`
- Expected response JSON: `{ "answer": "..." }`
