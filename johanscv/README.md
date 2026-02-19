# johanscv

Personal CV website built with Vite, Vanilla JS, and Tailwind CSS.

## Runtime Architecture

- Frontend app (this folder): `johanscv/`
- Backend API (separate folder): `../ask-johan-api/`
- Legacy prototype code exists in `../legacy/root-src/` and `../public/` (placeholder dirs only) but is not used by this app's scripts.
- Frontend feature modules:
  - Ask Johan client: `src/features/ask-johan/AskJohanWidget.js`
  - GeoJohan gameplay: `src/features/geojohan/GeoJohanPage.js`
  - GeoJohan env/config readers: `src/features/geojohan/geojohanEnv.js`, `src/features/geojohan/geojohanRounds.js`

## Run Locally (VS Code terminal)

### 1) Frontend setup

1. Install dependencies:
```bash
npm ci
```

2. Create local env file:
```bash
cp .env.local.example .env.local
```

3. Fill in your values in `.env.local`:
- `VITE_ASK_JOHAN_MODE` (`api` or `mock`)
- `VITE_API_BASE_URL` (Ask Johan API URL)
- Optional local-only convenience:
  - `VITE_DEV_AUTO_LOGIN=true`
  - `VITE_DEV_ACCESS_CODE=...`
- GeoJohan maps key is served by API (`GEOJOHAN_MAPS_API_KEY` in backend env)
- Optional GeoJohan round config (recommended for real gameplay):
  - `VITE_GEOJOHAN_ROUND1_PANO_LAT`, `VITE_GEOJOHAN_ROUND1_PANO_LNG`
  - `VITE_GEOJOHAN_ROUND1_ANSWER_LAT`, `VITE_GEOJOHAN_ROUND1_ANSWER_LNG`
  - same pattern for rounds 2 and 3
- Optional GeoJohan result-card text:
  - `VITE_GEOJOHAN_ROUND1_SUMMARY_ADDRESS`
  - `VITE_GEOJOHAN_ROUND1_SUMMARY_CONTEXT_DK`
  - `VITE_GEOJOHAN_ROUND1_SUMMARY_CONTEXT_EN`
  - same pattern for rounds 2 and 3
- In API mode, the site gate validates access code server-side via `POST /auth/login`
- Ask Johan then uses JWT Bearer auth for `POST /api/ask-johan`
- Restrict Google Maps key by HTTP referrer domains in Google Cloud Console.
- Note: `VITE_*` variables are not stored in git if kept in `.env.local`, but they are compiled into client JS and are visible in the browser.

Production safety:
- Production values are defined in `.env.production`.
- Current production API base is `https://ask-johan-api.onrender.com`.
- This ensures `npm run deploy` does not use your local `http://127.0.0.1:8787` value.

4. Start frontend:
```bash
npm run dev
```
- `npm run dev` uses `scripts/dev-fixed.sh` (`127.0.0.1:5173`, strict port, and automatic stale-port cleanup).

5. Open:
   - `http://localhost:5173/` (default)
   - or, if started with `CUSTOM_DOMAIN=false npm run dev`, open `http://localhost:5173/johanscv.dk/`
   - GeoJohan route: `/quiz/geojohan` (from Quiz landing on `/quiz` or `/playground`)

### 2) Backend setup (Ask Johan API)

In a second terminal:

```bash
cd ../ask-johan-api
npm ci
cp .env.example .env
```

Fill `.env`:
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default `gpt-4.1-mini`)
- `PORT` (default `8787`)
- `JOHANSCV_ACCESS_CODE` (primary)
- `ASK_JOHAN_ACCESS_CODE` (deprecated fallback)
- `JWT_SECRET`
- `ASK_JOHAN_JWT_TTL` (default `7d`)
- `ASK_JOHAN_AUTH_COMPAT_MODE` (set explicitly per environment; this repo's `.env.example`/`render.yaml` use `false`)
- `ASK_JOHAN_DAILY_CAP` (default `100`)
- `MAX_QUESTION_CHARS` (default `800`)
- `GEOJOHAN_MAPS_API_KEY` (required for GeoJohan Street View + map)
- Optional private context source:
  - `JOHAN_CONTEXT_B64` (recommended for hosted deploys)
  - `JOHAN_CONTEXT`
  - `JOHAN_CONTEXT_FILE`

Start API:

```bash
npm run dev
```

Health check:

```bash
curl -s http://127.0.0.1:8787/health
```

## Build

```bash
npm run build
npm run check:bundle
```

Node runtime alignment:
- expected major: `20` (`../.nvmrc`, CI, Render).
- if needed, run:

```bash
nvm use 20
```

Optional local preview:
```bash
npm run preview
```

## Deploy (GitHub Pages)

```bash
npm run deploy
```

This deploys `dist/` to `gh-pages` and enforces custom-domain asset paths (`/assets/...`).

For non-custom-domain base-path testing:

```bash
CUSTOM_DOMAIN=false npm run build
```
