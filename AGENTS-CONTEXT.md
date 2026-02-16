# AGENTS-CONTEXT.md

## Formål Med Denne Fil
Denne fil giver AI-agenter et samlet overblik over hele projektet: hvad det er, hvorfor det er bygget sådan, hvordan det virker, hvem det er til, og hvordan man ændrer det sikkert uden at bryde produktion.

Denne kontekst er skrevet ud fra den aktuelle repo-struktur og skal opdateres, når arkitektur eller deploy-flow ændres.

## Kort Projektbeskrivelse
`johanscv.dk` er et personligt portfolio-site for Johan med to aktive dele:

1. Frontend (`johanscv/`):
- Statisk SPA (Vite + Vanilla JS + Tailwind CSS styles).
- Viser CV/projekter/kontakt/filer.
- Indeholder:
  - `Ask Johan` UI (chat-lignende interface).
  - `GeoJohan` mini-game (Street View + map guessing).

2. Backend (`ask-johan-api/`):
- Node/Express API, deployet separat.
- Håndterer autentificering, rate limits, daily cap, context-baserede svar via OpenAI.

## Hvad Projektet Skal Bruges Til
- Præsentere Johan professionelt (portfolio + CV + projekter).
- Give besøgende en hurtig interaktiv måde at lære Johan at kende:
  - via `Ask Johan` (AI-assistent med beskyttet kontekst),
  - via `GeoJohan` (engagerende, personlig mini-oplevelse).
- Understøtte både dansk og engelsk brugeroplevelse.

## Hvem Er Målgruppen
- Recruiters/arbejdsgivere.
- Samarbejdspartnere/netværk.
- Venner/familie, som får adgang via site access code.
- Johan selv (drift, opdateringer, indholdsvedligehold).

## Hvorfor Arkitekturen Er Delt
Projektet er bevidst delt i statisk frontend + separat API:

- Frontend på GitHub Pages er billigt, simpelt og stabilt for statisk indhold.
- API på Render holder hemmeligheder server-side (OpenAI key, JWT signing, privat kontekst).
- Sikkerhedslogik (auth, limits, CORS, prompt-guardrails) ligger i backend, ikke i browserkode.
- Hurtig iteration: frontend kan deployes uafhængigt af API.

## Aktiv Arkitektur (As-Is)

### Frontend
Placering: `johanscv/`

Teknologi:
- Vite (`johanscv/vite.config.js`)
- Vanilla JS moduler
- CSS + Tailwind tooling (ingen React/Vue runtime)

Entrypoints:
- `johanscv/src/main.js`
- `johanscv/src/router.js`

Ruter:
- `/` home
- `/projects`
- `/resume`
- `/contact`
- `/playground`
- `/quiz` (alias til playground)
- `/quiz/geojohan`

Vigtige frontend-komponenter:
- `src/components/AskJohan.js`
- `src/pages/GeoJohan.js`
- `src/components/WelcomeGate.js`
- `src/components/Navbar.js`, `Footer.js`
- `src/data/translations.json` (DK/EN tekst)

State og UI-mønster:
- Global state i `src/state.js` (tema, sprog, route).
- Routing via History API i `src/router.js`.
- Page transitions og section reveal-animationer i CSS/komponenter.

### Backend
Placering: `ask-johan-api/`

Teknologi:
- Node 20
- Express
- OpenAI SDK (Responses API)
- JWT (`jsonwebtoken`)
- Helmet, CORS, express-rate-limit
- In-memory eller Redis usage store

Entrypoints:
- `ask-johan-api/index.js` (bootstrap + env wiring)
- `ask-johan-api/app.js` (app factory + middleware + routes)

Endpoints:
- `GET /health`
- `GET /`
- `POST /auth/login`
- `POST /api/ask-johan`

Usage store:
- `ask-johan-api/usage-store.js`
- Mode: `memory` eller `redis`

## Request/Data Flow
Normal Ask-flow (API mode):

1. Bruger åbner frontend og unlocker site (WelcomeGate).
2. Frontend sender access code til `POST /auth/login`.
3. API returnerer JWT.
4. Frontend kalder `POST /api/ask-johan` med `Authorization: Bearer <token>`.
5. API validerer auth, content-type, input-længde, rate-limit og daily cap.
6. API sender prompt + kontekst til OpenAI.
7. API returnerer `{ answer }`.

GeoJohan-flow:

1. Frontend loader Google Maps JS API med browser-key (`VITE_GOOGLE_MAPS_API_KEY`).
2. Runder + koordinater hentes fra `src/data/geojohanRounds.js` + `VITE_GEOJOHAN_*` env værdier.
3. Bruger gætter på kort, distance/points beregnes client-side.

## Sikkerhedsmodel (Kritisk)

### Backend-sikkerhed
- JWT-baseret auth for protected endpoint.
- Legacy `x-access-code` kan toggles via `ASK_JOHAN_AUTH_COMPAT_MODE`.
- Strikt CORS allowlist via `ALLOWED_ORIGINS` + localhost-dev undtagelse.
- Rate-limit per IP.
- Daily cap per IP.
- Strammere throttling på fejlede auth-forsøg.
- Input sanitization + max længde.
- Prompt-injection/context-exfiltration guardrails i `app.js`.

### Kontekstbeskyttelse
- Privat kontekst må aldrig deles verbatim.
- API-instruktioner siger eksplicit: opsummer, ikke afslør rå intern tekst.
- Direkte forsøg på prompt/context dump afvises.

### Frontend- og nøglehåndtering
- Alt `VITE_*` er offentligt i browser-bundle.
- Google Maps browser-key er ikke hemmelig; den skal beskyttes med referrer/API restrictions i Google Cloud.
- OpenAI keys/JWT secret/access code til backend må aldrig i frontend.

## Miljøvariabler (Koncepter)

Frontend (`johanscv/.env.local`):
- Mode/base URL/access code.
- Google Maps key.
- GeoJohan round data + summary tekster.

Backend (`ask-johan-api/.env` / Render env vars):
- OpenAI, auth, JWT, limits, CORS.
- Context source (`JOHAN_CONTEXT_B64` anbefalet i hosted miljø).
- Optional Redis config.

Se de konkrete lister i:
- `README.md`
- `johanscv/README.md`
- `ask-johan-api/.env.example`
- `johanscv/.env.local.example`

## Deploy-Model

Frontend:
- Deploy via `cd johanscv && npm run deploy`
- Publicering til `gh-pages` branch (GitHub Pages).

Backend:
- Deploy via Render blueprint (`render.yaml`, `rootDir: ask-johan-api`).
- Runtime env vars sættes i Render dashboard.

CI:
- `.github/workflows/ci.yml`
- Frontend: `lint + smoke + build`
- API: `npm test`

## Aktiv vs Legacy
Aktive områder:
- `johanscv/`
- `ask-johan-api/`
- `.github/workflows/ci.yml`
- `render.yaml`

Legacy/ikke-produktionskritisk:
- `legacy/root-src/`
- root `public/`

Bemærk:
- Root build artifacts (`/assets`, `/index.html`) skal ikke committes.

## Designintention (UI/UX)
- Clean, moderne, rolig portfolio-stil.
- Subtile animationer fremfor tunge effekter.
- Høj læsbarhed og professionel tone.
- Konsistent look mellem Ask Johan og GeoJohan.
- Mobil + desktop skal begge fungere.

## Drift Og Verifikation
Standard verifikation før større ændringer:

Frontend:
- `cd johanscv && npm run lint`
- `cd johanscv && npm run smoke`
- `cd johanscv && npm run build`

Backend:
- `cd ask-johan-api && npm test`

Repo samlet:
- `./scripts/verify.sh`

## Agent-Arbejdsregler (Projekt-Specifik)
- Antag ikke struktur fra hukommelse; læs filer først.
- Lav små, reversible ændringer.
- Bevar API-kontrakter medmindre der er eksplicit krav om ændring.
- Dokumentér env/deploy-effekt når adfærd ændres.
- Kør relevante checks før du erklærer noget “færdigt”.
- Push/deploy kun med eksplicit brugeraccept.
- Aldrig committe hemmeligheder, tokens, `.env` eller private kontekstfiler.

## Hvornår Denne Fil Skal Opdateres
Opdater filen når mindst ét af disse ændres:
- Route-struktur eller app entrypoints.
- Auth/CORS/rate-limit/security-model.
- Env vars (nye, fjernede eller ændret betydning).
- Deploy-flow (GitHub Pages/Render/CI).
- Aktiv/legacy mappegrænse.

