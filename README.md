# Ops Command Center — SOURCE (React + JavaScript)

This repository is the canonical **SOURCE** codebase for the **SnapperAI Migration Benchmark**.

It is intentionally structured to be **migration-stressful** while remaining realistic:

- React 18 + JavaScript (no TypeScript in `/client`)
- Redux Toolkit state + async thunks
- React Router routes (pinned)
- Express REST API backend with role enforcement + deterministic seed data
- Shared “stress patterns”: central API wrapper, reusable components, shared utilities, global error boundary, feature flags

## Benchmark invariants

- **Ports**
  - Defaults:
    - Server: `http://localhost:3001` (API base: `http://localhost:3001/api`)
    - Client: `http://localhost:5173`
  - Overrides (operator-controlled; defaults unchanged):
    - Server listens on `process.env.PORT` (fallback `3001`)
    - Client dev server listens on `process.env.VITE_PORT` (fallback `5173`)

- **Seed data counts (deterministic, stable IDs)**
  - Services: **8**
  - Incidents: **50**
  - Users: **6**
  - Activity entries: **20**
  - Comments: **30**

- **Root scripts (run from repo root)**
  - **`npm run dev`**: starts server (3001) + client (5173) concurrently and prints both URLs
  - **`npm run build`**: frontend-only production build via Vite (hard-fails on build errors)
  - **`npm run test`**: runs server tests + client tests in one command (Vitest)
  - **`npm run lint`**: runs ESLint for server + client in one command
  - **`npm run verify`**: `lint -> test -> build` (non-interactive, fails fast)

- **Canonical benchmark files (must match benchmark drafts exactly)**
  - `MIGRATION_TASK.md`
  - `CORE_FLOWS.md`
  - `SCORING_RUBRIC_MIGRATION.md`

  SHA256:
  - `MIGRATION_TASK.md`: `e9221e4aa9e4fd5539b5a68f4f9dcc8f79c98b25304523eb97b681e417317243`
  - `CORE_FLOWS.md`: `637a70be1f3d6cfbee18c7b378c08d3f1b2ed9b61d6a3872475371ead45b98c4`
  - `SCORING_RUBRIC_MIGRATION.md`: `2fdb4ebb8b8c4b862c6168cb4248527e3ef706e60e6f17ff2ff56fe599809ab6`

## Quickstart

```bash
npm install
npm run dev
```

Client env example: `client/.env.example` (Vite reads via `import.meta.env`).

## API schema reference (authoritative)

See `contracts/`:
- `contracts/openapi.yaml`: OpenAPI 3 spec for `/api/*` routes (request/response shapes and enums)
- `contracts/examples.md`: JSON examples for key endpoints

### Running multiple instances (example)

```bash
PORT=3002 VITE_PORT=5174 VITE_API_BASE_URL=http://localhost:3002/api npm run dev
```

## Deterministic failure path

- **Authoritative trigger**: `GET /api/activity?forceError=true` returns HTTP **500**
- UI: Dashboard → **Force error** (calls the same endpoint with `forceError=true`)

## Notes on versions

All dependencies are pinned to **exact versions** (no `^` / `~`). If any substitutions are ever required due to npm availability, they must be documented here under **Benchmark invariants**.


