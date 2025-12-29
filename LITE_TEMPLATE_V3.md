# SnapperAI Migration Benchmark — Lite Template v3
## Ops Command Center (SOURCE)

Lite Template v3 is tuned specifically to reduce two common migration failure modes:
1) **Missing page components** referenced by the router
2) **Enum/type drift** (e.g. IncidentStatus / IncidentSeverity / ServiceTier mismatches)

### What changed vs Lite Template v2
- **Router simplification**: `/responders` and `/settings` are both implemented by a **single shared page component** (`client/src/pages/UtilityPage.jsx`).
  - Routes remain pinned, but migrations can map both paths to one Vue component, reducing “missing page” errors.
- **Client schema simplification**: removed Zod-based client schemas (`client/src/validation/*`) and `zod` dependency.
  - The UI now does minimal inline validation and relies on server-enforced validation + the `VALIDATION_ERROR` schema.

### Authoritative shapes
Use `contracts/openapi.yaml` as the canonical reference for:
- route list
- request/response shapes
- enums
- error envelopes


