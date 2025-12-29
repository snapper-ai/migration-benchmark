# Migration Bench — Min v0 API Examples

All `/api/*` requests (except `/api/health`) require `x-ops-user-id`.

---

## GET /api/health

Response (200):

```json
{ "ok": true }
```

---

## GET /api/users

Headers:

```json
{ "x-ops-user-id": "usr_001" }
```

Response (200):

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
    "id": "usr_002",
    "name": "Priya Nair",
    "email": "priya.nair@opscc.local",
    "role": "responder",
    "team": "Payments",
    "onCall": false
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

---

## GET /api/incidents

Headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200) (example item):

```json
[
  {
    "id": "inc_001",
    "title": "Incident inc_001 — S1",
    "description": "Deterministic incident seed. This text is intentionally mid-realistic.",
    "status": "triggered",
    "severity": "S1",
    "commanderId": null,
    "createdAt": "2025-01-08T17:23:00.000Z",
    "updatedAt": "2025-01-08T20:52:00.000Z",
    "acknowledgedAt": null,
    "resolvedAt": null,
    "tags": ["db", "timeout"]
  }
]
```

---

## POST /api/incidents (responder/admin)

Headers:

```json
{ "x-ops-user-id": "usr_002" }
```

Body:

```json
{
  "title": "Login errors spiking",
  "description": "Seeing elevated 500s; investigating upstream dependency.",
  "severity": "S2",
  "tags": ["auth", "deploy"]
}
```

Response (201) (example):

```json
{
  "id": "inc_011_xxxxxx",
  "title": "Login errors spiking",
  "description": "Seeing elevated 500s; investigating upstream dependency.",
  "status": "triggered",
  "severity": "S2",
  "commanderId": null,
  "createdAt": "2025-01-28T10:20:00.000Z",
  "updatedAt": "2025-01-28T10:20:00.000Z",
  "acknowledgedAt": null,
  "resolvedAt": null,
  "tags": ["auth", "deploy"]
}
```

---

## PATCH /api/incidents/:id (invalid transition → 400)

Headers:

```json
{ "x-ops-user-id": "usr_002" }
```

Body:

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

---

## GET /api/activity

Headers:

```json
{ "x-ops-user-id": "usr_004" }
```

Response (200) (example items):

```json
[
  {
    "id": "act_005",
    "type": "create",
    "entityType": "incident",
    "entityId": "inc_005",
    "message": "Seed activity 5 for incident inc_005.",
    "createdAt": "2025-01-10T22:20:00.000Z"
  }
]
```

---

## GET /api/activity?forceError=true

Headers:

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
