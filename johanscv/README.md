# johanscv

Personal CV website built with Vite, Vanilla JS, and Tailwind CSS.

## Runtime Architecture

- Frontend app (this folder): `johanscv/`
- Backend API (separate folder): `../ask-johan-api/`
- Legacy prototype code exists in repo root `src/` and `public/` but is not used by this app's scripts.

## Run Locally (VS Code terminal)

### 1) Frontend setup

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
- `VITE_SITE_ACCESS_CODE` should match `ASK_JOHAN_ACCESS_CODE` on backend when API mode is used

4. Start frontend:
```bash
npm run dev
```

5. Open the shown local URL in your browser.

### 2) Backend setup (Ask Johan API)

In a second terminal:

```bash
cd ../ask-johan-api
npm install
cp .env.example .env
```

Fill `.env`:
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default `gpt-4.1-mini`)
- `PORT` (default `8787`)
- `ASK_JOHAN_ACCESS_CODE`
- `MAX_QUESTION_CHARS` (default `800`)

Start API:

```bash
npm run start
```

Health check:

```bash
curl -s http://127.0.0.1:8787/health
```

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
