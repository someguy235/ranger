# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Ranger is a full-stack national park trip tracker. Users log trips with dates, photos, and KML route files, which are visualized on an interactive Leaflet map. The backend is Node.js/Express (ES modules, `.mjs`), the frontend is Vue 3 + Vuetify + Vuex, and data is persisted in MongoDB with Redis caching for the parks list.

## Commands

```bash
# Start local services (required before running the app)
brew services start mongodb-community
brew services start redis

# Backend (port 3002)
npm start

# Frontend dev server (port 8080, proxies /ranger/api → :3002)
npm run serve

# Production build
npm run build

# Lint / format
npm run lint
npm run format
```

Visit `http://localhost:8080/ranger/?user=<username>` in development.

No test suite is currently in use (Cypress is installed but has no specs).

## Architecture

### Backend (`server/`)

- **`ranger-server.mjs`** — Express app setup: MongoDB connection, Redis client, Passport init, middleware, static file serving, and route mounting under `/ranger/api/`.
- **`auth/auth.mjs`** — Two Passport strategies: `local` (bcrypt password check on login) and `jwt` (Bearer token validation). Issues a 5-minute auth token and a 1-day refresh token stored in an httpOnly cookie. Auto-refreshes on each authenticated request.
- **`routes/routes.mjs`** — Public routes: `POST /login`, `GET /parks` (Redis-cached), `GET /trips?user=`.
- **`routes/secure-routes.mjs`** — JWT-protected routes: `POST /upload` (multer + sharp for images, xml2js for KML), `DELETE /delete/:id`.
- **`model/model.mjs`** — Mongoose schemas: `User` (email, bcrypt password, refresh token), `Trip` (user, title, dates, parks array, KML string, distance, bounds, base64 image), `Park` (name, lat/lon).

### Frontend (`src/`)

- **State**: Vuex store in `store/store.js` — holds user/token, parks, trips, and active filter state.
- **Routing**: Vue Router in `src/router/router.js` — single `Home` view; `Upload` and `Edit` are separate views.
- **Maps**: `src/components/Maps.vue` uses Leaflet with a custom KML parser at `src/assets/js/L.KML` to render trip routes.
- **Auth flow**: JWT Bearer token stored in localStorage; `Header.vue` handles login/logout UI; token is sent in `Authorization` header on fetch calls.

### Key conventions

- Backend is ES modules throughout (`.mjs`, `import`/`export`).
- Images are stored as base64 strings inside MongoDB Trip documents.
- KML is stored as raw XML and parsed client-side.
- The `/parks` endpoint is cached in Redis under the key `ranger-parks`.
- The signup endpoint exists in `auth.mjs` but is commented out in routes.

## Environment

Requires a `.env` file at the project root:

```
JWT_AUTH_SECRET=<hex-string>
JWT_REFRESH_SECRET=<hex-string>
```

MongoDB connects to `mongodb://127.0.0.1:27017/ranger` (hardcoded in `ranger-server.mjs`).

## Deployment

GitHub Actions (`.github/workflows/main.yml`) SSH into the server on push to `main` and run `deploy-scripts/deploy-ranger.sh`, which does a `git pull`, `npm ci`, `npm run build`, and PM2 restart.
