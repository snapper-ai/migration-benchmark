# SnapperAI Migration Benchmark — MIGRATION TASK (v1)
## Ops Command Center

Note: This file is the draft source for the **canonical repo-root** benchmark file `MIGRATION_TASK.md`.

---

## Objective

Migrate the **frontend only** of this repository from:

**React 18 + JavaScript (Vite, React Router v6, Redux Toolkit)**  
→  
**Vue 3 + TypeScript (Composition API, Pinia, Vue Router 4)**

✅ The backend must remain **Express** and must continue to serve the same API endpoints.

This benchmark evaluates long-horizon reasoning, multi-file migration quality, and functional integrity.

---

## Scope

### In Scope
- Complete frontend migration to **Vue 3 + TypeScript**
- Replace routing with **Vue Router 4**
- Replace state management with **Pinia**
- Preserve all features, pages, and core behaviors
- Preserve environment variable usage
- Preserve error handling and validation logic
- Preserve role-based UI behavior

### Out of Scope
- Backend migration (Express stays as-is)
- Feature removal or significant simplification
- Visual redesigns unrelated to migration
- External services or hosted APIs

---

## Hard Requirements

- Vue 3 **Composition API only**
- TypeScript enabled (strict preferred)
- Pinia for state management (no Vuex)
- Vue Router 4
- Application must build and run locally
- No React code or patterns should remain in the migrated frontend (`/client`)

## Repository Structure (Pinned)

- Frontend source lives in `/client`
- Backend source lives in `/server` (Express)
- “Frontend-only migration” means replacing `/client` with the Vue 3 + TypeScript app while leaving `/server` intact

---

## Functional Integrity Requirements

The following **core flows must continue to work** after migration:

1) Create service  
2) Create incident for a service  
3) Update incident fields:
   - status
   - severity
   - commander
   - tags  
4) Enforce incident status transition rules
5) SLA countdown and breach logic works correctly
6) Dashboard KPIs update based on data changes
7) Filters and sorting work correctly
8) Activity feed updates on changes
9) Comments can be posted and persist on refresh
10) Role-based UI restrictions are respected

Refer to `CORE_FLOWS.md` for the full verification checklist.

---

## Constraints (Benchmark Fairness Rules)

- Do not remove major features
- Do not replace the app with a simplified demo
- Do not change backend routes or response shapes
- Do not introduce heavy frameworks beyond Vue migration requirements
- Do not bypass validation or authorization logic

If a requirement cannot be met, document it clearly.

---

## Deliverables

- A Vue 3 + TypeScript frontend replacing the React app
- Updated scripts so `npm run dev` still runs frontend + backend
- Updated README **only if setup changes**
- Any new dependencies must be justified

---

## Notes

This benchmark compares models under **identical starting conditions** and **identical instructions**.

Prioritize:
1. Correctness
2. Functional integrity
3. Maintainable structure

Speed is secondary.


