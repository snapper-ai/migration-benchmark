# Ops Command Center — API Examples (contracts)

These examples are designed to match the **actual** Express server responses in this repository.

Notes:
- All `/api/*` requests (except `/api/health`) require `x-ops-user-id`.
- 400/403 responses use the `VALIDATION_ERROR` envelope.
- 404 responses are `{ "message": "Not found" }`.
- `GET /api/activity?forceError=true` returns a deterministic 500 error envelope.

---

## Health

### GET /api/health

Response (200):

```json
{ "ok": true }
```

---

## Users

### GET /api/users

Request headers:

```json
{ "x-ops-user-id": "usr_001" }
```

Response (200) — example items:

```json
[
  {
    "id": "usr_001",
    "name": "Alex Kim",
    "email": "alex.kim@opscc.local",
    "role": "admin",
    "team": "Platform",
    "onCall": true
  },
  {
    "id": "usr_004",
    "name": "Jordan Lee",
    "email": "jordan.lee@opscc.local",
    "role": "viewer",
    "team": "Support",
    "onCall": false
  }
]
```

### “Current user” (operational)

There is **no** dedicated `/api/current-user` endpoint. The “current user” is:
- selected in the UI and stored in localStorage, and
- passed to the server on each request via the `x-ops-user-id` header.

Example:

```json
{ "x-ops-user-id": "usr_002" }
```

---

## Services

### GET /api/services

Request headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200) — example items:

```json
[
  {
    "id": "svc_001",
    "name": "Auth Gateway",
    "tier": 0,
    "ownerTeam": "Platform",
    "status": "active",
    "createdAt": "2024-12-11T18:40:00.000Z"
  },
  {
    "id": "svc_002",
    "name": "Payments API",
    "tier": 1,
    "ownerTeam": "Payments",
    "status": "degraded",
    "createdAt": "2024-12-12T11:20:00.000Z"
  },
  {
    "id": "svc_003",
    "name": "Search Indexer",
    "tier": 2,
    "ownerTeam": "Core",
    "status": "active",
    "createdAt": "2024-12-13T04:00:00.000Z"
  }
]
```

### GET /api/services/:id

Request headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200):

```json
{
  "id": "svc_002",
  "name": "Payments API",
  "tier": 1,
  "ownerTeam": "Payments",
  "status": "degraded",
  "createdAt": "2024-12-12T11:20:00.000Z"
}
```

### POST /api/services (admin only)

Request headers:

```json
{ "x-ops-user-id": "usr_001" }
```

Request body:

```json
{
  "name": "Edge Router v2",
  "tier": 1,
  "ownerTeam": "Edge",
  "status": "active"
}
```

Response (201) — example (id/timestamps are runtime-generated):

```json
{
  "id": "svc_009_xxxxxx",
  "name": "Edge Router v2",
  "tier": 1,
  "ownerTeam": "Edge",
  "status": "active",
  "createdAt": "2025-01-28T10:15:30.000Z"
}
```

### PATCH /api/services/:id (admin only)

Request headers:

```json
{ "x-ops-user-id": "usr_001" }
```

Request body:

```json
{ "status": "degraded" }
```

Response (200):

```json
{
  "id": "svc_002",
  "name": "Payments API",
  "tier": 1,
  "ownerTeam": "Payments",
  "status": "degraded",
  "createdAt": "2024-12-12T11:20:00.000Z"
}
```

---

## Incidents

### GET /api/incidents

Example request:
- `/api/incidents?serviceId=svc_002&status=investigating&sort=createdAt_desc&breached=false`

Request headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200) — example items:

```json
[
  {
    "id": "inc_003",
    "serviceId": "svc_003",
    "title": "Incident inc_003 — S3 svc_003",
    "description": "Deterministic incident seed for svc_003. This text is intentionally mid-realistic.",
    "status": "investigating",
    "severity": "S3",
    "commanderId": null,
    "createdAt": "2025-01-08T16:49:00.000Z",
    "updatedAt": "2025-01-08T20:52:00.000Z",
    "acknowledgedAt": "2025-01-08T19:48:00.000Z",
    "resolvedAt": null,
    "tags": ["timeout", "auth"]
  }
]
```

### GET /api/incidents/:id

Request headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200):

```json
{
  "id": "inc_007",
  "serviceId": "svc_007",
  "title": "Incident inc_007 — S3 svc_007",
  "description": "Deterministic incident seed for svc_007. This text is intentionally mid-realistic.",
  "status": "acknowledged",
  "severity": "S3",
  "commanderId": "usr_003",
  "createdAt": "2025-01-08T15:41:00.000Z",
  "updatedAt": "2025-01-08T20:00:00.000Z",
  "acknowledgedAt": "2025-01-08T19:49:00.000Z",
  "resolvedAt": null,
  "tags": ["deploy", "payments"]
}
```

### POST /api/incidents (responder/admin)

Request headers:

```json
{ "x-ops-user-id": "usr_002" }
```

Request body:

```json
{
  "serviceId": "svc_002",
  "title": "Elevated payment latency",
  "description": "p95 latency increased after deploy; investigating DB connection pool saturation.",
  "severity": "S2",
  "tags": ["latency", "deploy"]
}
```

Response (201) — example (id/timestamps are runtime-generated):

```json
{
  "id": "inc_051_xxxxxx",
  "serviceId": "svc_002",
  "title": "Elevated payment latency",
  "description": "p95 latency increased after deploy; investigating DB connection pool saturation.",
  "status": "triggered",
  "severity": "S2",
  "commanderId": null,
  "createdAt": "2025-01-28T10:20:00.000Z",
  "updatedAt": "2025-01-28T10:20:00.000Z",
  "acknowledgedAt": null,
  "resolvedAt": null,
  "tags": ["latency", "deploy"]
}
```

### PATCH /api/incidents/:id (responder/admin)

Request headers:

```json
{ "x-ops-user-id": "usr_002" }
```

Request body (valid transition):

```json
{ "status": "acknowledged" }
```

Response (200):

```json
{
  "id": "inc_001",
  "serviceId": "svc_001",
  "title": "Incident inc_001 — S1 svc_001",
  "description": "Deterministic incident seed for svc_001. This text is intentionally mid-realistic.",
  "status": "acknowledged",
  "severity": "S1",
  "commanderId": null,
  "createdAt": "2025-01-08T17:23:00.000Z",
  "updatedAt": "2025-01-28T10:21:00.000Z",
  "acknowledgedAt": "2025-01-28T10:21:00.000Z",
  "resolvedAt": null,
  "tags": ["db", "timeout"]
}
```

### PATCH /api/incidents/:id (invalid transition → 400)

Request headers:

```json
{ "x-ops-user-id": "usr_002" }
```

Request body:

```json
{ "status": "mitigated" }
```

Response (400):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid incident patch",
    "fields": {
      "status": "Invalid transition: triggered -> mitigated"
    }
  }
}
```

### POST /api/incidents/:id/reopen

Request headers:

```json
{ "x-ops-user-id": "usr_002" }
```

Response (200) — resolved → investigating:

```json
{
  "id": "inc_005",
  "serviceId": "svc_005",
  "title": "Incident inc_005 — S1 svc_005",
  "description": "Deterministic incident seed for svc_005. This text is intentionally mid-realistic.",
  "status": "investigating",
  "severity": "S1",
  "commanderId": null,
  "createdAt": "2025-01-08T16:15:00.000Z",
  "updatedAt": "2025-01-28T10:25:00.000Z",
  "acknowledgedAt": "2025-01-08T19:33:00.000Z",
  "resolvedAt": null,
  "tags": ["capacity", "edge"]
}
```

---

## Comments

### GET /api/incidents/:id/comments

Request headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200) — example items:

```json
[
  {
    "id": "cmt_001",
    "incidentId": "inc_001",
    "authorId": "usr_001",
    "body": "Comment 1 on inc_001.",
    "createdAt": "2025-01-09T22:51:00.000Z"
  }
]
```

### POST /api/incidents/:id/comments (responder/admin)

Request headers:

```json
{ "x-ops-user-id": "usr_002" }
```

Request body:

```json
{ "body": "We rolled back the last deploy and are monitoring." }
```

Response (201) — example (id/timestamps are runtime-generated):

```json
{
  "id": "cmt_031_xxxxxx",
  "incidentId": "inc_001",
  "authorId": "usr_002",
  "body": "We rolled back the last deploy and are monitoring.",
  "createdAt": "2025-01-28T10:30:00.000Z"
}
```

---

## Activity

### GET /api/activity

Request headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200) — example items:

```json
[
  {
    "id": "act_005",
    "type": "create",
    "entityType": "incident",
    "entityId": "inc_005",
    "message": "Seed activity 5 for incident inc_005.",
    "createdAt": "2025-01-10T22:20:00.000Z"
  },
  {
    "id": "act_004",
    "type": "update",
    "entityType": "service",
    "entityId": "svc_003",
    "message": "Seed activity 4 for service svc_003.",
    "createdAt": "2025-01-10T22:25:00.000Z"
  }
]
```

### GET /api/activity?forceError=true

Request headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (500):

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Deterministic forced activity failure"
  }
}
```


