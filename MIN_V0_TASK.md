# Migration Bench — Minimal Template (min-v0) Task

Objective: migrate the **frontend only** from **React + JavaScript (Vite)** to **Vue 3 + TypeScript**.

This template is intentionally small to avoid install/toolchain conflicts and reduce turn/cost.

## What must remain working after migration

- App starts in dev (`npm run dev`)
- Routes:
  - `/` (dashboard)
  - `/incidents` (list + create)
  - `/incidents/:id` (detail + status update)
  - `/settings` (dev-only current user selector)
- API integration via `VITE_API_BASE_URL` and a central API wrapper
- Deterministic error path: `GET /api/activity?forceError=true` returns HTTP 500 and UI shows an error
- Status transitions are server-enforced; invalid transitions show a validation error
- Role gating enforced by server via `x-ops-user-id` header

## Anti-drift rules (important)

### Enums: do not invent values

Use only the enums from `contracts/openapi.yaml` (or copy from `client/src/domain/enums.js`):
- `IncidentStatus`: `triggered | acknowledged | investigating | mitigated | resolved`
- `IncidentSeverity`: `S1 | S2 | S3 | S4`

Do **not** invent values like `closed`, `done`, `major`, etc.

### Store/public shape: keep names stable

If you introduce a frontend store in the migrated app, keep these public fields stable:
- incidents list: `incidents.items`
- activity list: `activity.items`

## Notes

- The backend is Express and must not be migrated.
- Authoritative API shapes/enums are in `contracts/openapi.yaml`.


