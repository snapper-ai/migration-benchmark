# SnapperAI Migration Benchmark — Core Flows Checklist (v1)
## Ops Command Center

Note: This file is the draft source for the **canonical repo-root** benchmark file `CORE_FLOWS.md`.

Use this checklist to verify functional integrity after migration.

---

## 1) Create Service
- Create a service via UI modal
- Service appears in Services list
- Persisted via API and visible on refresh

---

## 2) Create Incident
- Navigate to a service
- Create an incident for that service
- Incident appears in service view and global incidents list

---

## 3) Update Incident Fields
From Incident Detail:
- Update status
- Update severity
- Assign commander
- Add / remove tags

Verify:
- Changes persist
- UI reflects updated values immediately

---

## 4) Status Transition Rules
Verify server-enforced rules:
- Valid transitions succeed
- Invalid transitions fail with error message
- “Reopen” action transitions resolved → investigating

UI must display validation error on invalid transition.

---

## 5) SLA Countdown & Breach Logic
- Active incidents show time remaining until breach
- Breached incidents show “BREACHED” badge
- Dashboard KPI for SLA breaches updates correctly

---

## 6) Dashboard KPIs
Verify dashboard metrics update after:
- Creating an incident
- Resolving an incident
- Breaching SLA threshold

KPIs to verify:
- Active incidents
- SLA breaches
- Resolved today
- On-call responders count

---

## 7) Filters & Sorting
Verify on Incidents view:
- Status filter
- Severity filter
- SLA breached filter
- Search by title/description
- Sorting (createdAt / severity / SLA remaining)

---

## 8) Activity Feed
Verify activity entries are created for:
- Service create/update/delete
- Incident create/update/delete
- Incident status change
- Comment creation

Activity feed updates in UI without refresh.

---

## 9) Comments
- Add comment on an incident
- Comment appears immediately
- Comment persists after refresh

---

## 10) Role-Based UI
Verify behavior by role:
- Viewer:
  - Cannot create or edit services
  - Read-only access
- Responder:
  - Can create/update incidents and comments
- Admin:
  - Can manage services and incidents

Role changes via the dev-only "Current User" selector (in the app header; persisted to localStorage) take effect immediately.

---

## Result Notes
- Failures observed:
- Edge cases:
- Regressions:


