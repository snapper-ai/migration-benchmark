# SnapperAI Migration Benchmark — Lite Template v1
## Ops Command Center (SOURCE)

This is a **cost/turn-optimized** variant of the Ops Command Center SOURCE template intended to reduce migration time while preserving key benchmark signals.

### What stayed the same (signal preserved)
- **Same Express backend** (`/server`) and **same `/api/*` endpoints and behavior**
- Deterministic seed data + deterministic error path:
  - `GET /api/activity?forceError=true` returns HTTP 500
- Role enforcement remains server-side via `x-ops-user-id`
- Core UI flows remain present:
  - Create service (admin)
  - Create incident (responder/admin)
  - Status transition enforcement + validation error display
  - Comments
  - Activity feed polling
  - SLA badge logic (client utility)
- Routing remains (pinned routes still exist)
- Operator-controlled port overrides remain:
  - `PORT` (server), `VITE_PORT` (client), `VITE_API_BASE_URL` (client)

### What was simplified (to reduce turn/cost)
- **Removed Recharts** and the dashboard chart
  - Dashboard now uses simple KPI/text blocks instead of a chart.
- **Removed Headless UI** dependency
  - Modal is now a minimal in-repo component (no external UI lib).

### Why these changes help
- Fewer dependencies to migrate and fewer UI edge cases (layout/ResizeObserver)
- Smaller bundle and faster build
- Less boilerplate to translate during framework migration


