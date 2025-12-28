# SnapperAI Migration Benchmark — Lite Template v2
## Ops Command Center (SOURCE)

Lite Template v2 is an even smaller, turn/cost-optimized SOURCE variant designed to preserve the **migration signal** while reducing:
- file count / boilerplate
- dependency surface area
- test/runtime friction

### Key signal preserved
- Same backend endpoints (`/server`) and behavior
- Deterministic error path: `GET /api/activity?forceError=true` → HTTP 500
- Role enforcement on server via `x-ops-user-id`
- Status transition enforcement (server-side) with `VALIDATION_ERROR` schema on 400/403
- Pinned routes still exist
- Central API wrapper (`client/src/api/http.js`)
- SLA utility (`client/src/utils/sla.js`) used in UI

### Simplifications vs Lite v1
- **Client state**: Redux Toolkit replaced with a single React Context store (`client/src/state/AppState.jsx`)
- **Client tests**: removed DOM-heavy integration tests and jsdom/Testing Library tooling; kept minimal unit tests
- **Seed data counts reduced** (still deterministic, stable IDs)

### Seed counts (Lite v2)
- Services: 3
- Incidents: 10
- Users: 3
- Activity: 5
- Comments: 5


