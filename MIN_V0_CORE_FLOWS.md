# Migration Bench — Minimal Template (min-v0) Core Flows

## 1) Select current user
- Go to `/settings`
- Select a user (admin/responder/viewer)
- Refresh and confirm it persists (localStorage) and requests include `x-ops-user-id`

## 2) List incidents
- Go to `/incidents`
- Confirm incidents render

## 3) Create incident (responder/admin)
- Select `usr_002` (responder)
- Create an incident
- Confirm it appears in the list

## 4) Update status + transition validation
- Update an incident status along the allowed chain
- Attempt an invalid transition and confirm the UI displays the `VALIDATION_ERROR`

## 5) Deterministic failure path
- From dashboard, trigger `GET /api/activity?forceError=true`
- Confirm UI shows an error state


