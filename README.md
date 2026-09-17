# Wonda Command Center

Private operations dashboard for **Jerry "Wonda" Duplessis** (Prince Wonda / Jerry Wonda) — the Grammy-winning producer's daily command surface for his music, business, philanthropy, and mentorship empire.

## Stack

- **Frontend:** Vite + React 18 + TypeScript, Tailwind, shadcn-style components
- **PWA:** `vite-plugin-pwa` (installable, offline shell, runtime cache)
- **Backend:** Express + TypeScript, served from same process
- **DB:** PostgreSQL via Drizzle ORM
- **Auth:** httpOnly session cookie, bcrypt, three-role permission matrix (`owner`, `assistant`, `finance_manager`)
- **Hosting:** Render free tier (web service + Postgres)

## Local development

```bash
cp .env.example .env
# fill in DATABASE_URL, SESSION_SECRET, TOKEN_ENCRYPTION_KEY (any 32+ char strings for dev)
npm install
npm run dev          # vite on :5173, api on :3001
```

Visit `http://localhost:5173`. Vite proxies `/api` to the API.

## Build for production

```bash
npm run build         # vite build + esbuild server bundle
npm run build:ci      # typecheck + build
npm start             # runs built API + serves React from dist/web
```

## Database

```bash
npm run db:migrate    # apply schema
npm run db:seed       # seed users, projects, mentees, catalog
```

Seeded logins (mock-mode, no Postgres):
- Owner — `jerry@wolfpaqmarketing.com` / `wonda2026!`
- Assistant — `sarah@wolfpaqmarketing.com` / `wonda2026!`
- Finance Manager — `david@wolfpaqmarketing.com` / `wonda2026!`

> **Mock-mode auth** — when `DATABASE_URL` is not set, the server accepts these passwords in plaintext so the UI is testable without a database. When Postgres is wired, the same endpoint switches to `bcrypt.compare()` against the `password_hash` column, and these plaintext mock passwords no longer work.

## Deploy to Render

1. Create a new **Web Service** from this repo, **Runtime: Node**, **Plan: Free**.
2. Render will read `render.yaml` and provision a free Postgres database alongside.
3. Add the following env vars on the web service:
   - `SESSION_SECRET` (32+ char random)
   - `TOKEN_ENCRYPTION_KEY` (32+ char random, base64)
   - `APP_BASE_URL` (your render URL, e.g. `https://wonda-command-center.onrender.com`)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (when wiring Calendar OAuth in Phase 5)
4. Set build command: `npm ci && npm run build`
5. Set start command: `npm start`
6. Once deployed, run migrations + seed against the production DB using Render's shell:
   ```
   npm run db:migrate && npm run db:seed
   ```

## Phases

1. ~~Scaffold + auth + roles + DB + seed~~ ✅
2. ~~Design system + shell + PWA manifest~~ ✅
3. Tasks engine
4. Calendar + Google OAuth
5. Projects + Mentorship
6. Finance module (six tabs)
7. Empire Overview
8. Social Command
9. Team + Settings + role-aware navigation
10. Offline queue + push notifications + Lighthouse

## Architecture

- **Three roles only:** owner, assistant, finance_manager. No other roles exist.
- **One owner** is enforced at the DB level via partial unique index on `users.role`.
- **Finance is sealed off** from the assistant role at the middleware layer — `/api/finance/*` returns 403 before any handler runs.
- **Financial records are void-only** — never hard-deleted. `activity_log` captures before/after.
- **Social channels ship behind provider adapters** with working mock adapters — real keys are opt-in.
- **PWA** installable on iOS/Android. Bottom-tab navigation on mobile, sidebar on desktop.

## Layout

```
wonda-command-center/
├── server/                 # Express API
│   ├── routes/             # auth, projects, tasks, calendar, mentorship, social, finance, team, overview, settings
│   ├── middleware/         # auth, role checks
│   ├── db/                 # schema, client, migrate, seed
│   ├── index.ts            # dev entry (tsx watch)
│   └── index.prod.ts       # prod entry (serves static + API)
├── src/                    # React frontend
│   ├── components/         # Shell, Section
│   ├── pages/              # Login, Overview, Projects, Mentorship, Tasks, Calendar, Social, Finance, Team, Settings
│   ├── lib/                # api client
│   └── App.tsx             # lazy routes
├── public/                 # static assets (wordmark, icons)
├── render.yaml             # Render deployment config
└── .env.example
```