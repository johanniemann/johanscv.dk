# johanscv

Personal CV website built with Vite, Vanilla JS, and Tailwind CSS.

## Run Locally (VS Code terminal)

1. Install dependencies:
```bash
npm install
```

2. Create local env file:
```bash
cp .env.local.example .env.local
```

3. Fill in your values in `.env.local`:
- `VITE_SITE_ACCESS_CODE` (site gate + Ask Johan access code)
- `VITE_ASK_JOHAN_MODE` (`api` or `mock`)
- `VITE_API_BASE_URL` (Ask Johan API URL)

4. Start frontend:
```bash
npm run dev
```

5. Open the shown local URL in your browser.

## Build

```bash
npm run build
```

Optional local preview:
```bash
npm run preview
```

## Deploy (GitHub Pages)

```bash
npm run deploy
```

This deploys the built `dist/` folder to the `gh-pages` branch.
