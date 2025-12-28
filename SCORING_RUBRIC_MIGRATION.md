# SnapperAI Benchmark — Migration Scoring Rubric (v1)
## Ops Command Center

Note: This file is the draft source for the **canonical repo-root** benchmark file `SCORING_RUBRIC_MIGRATION.md`.

---

## Hard Gate: Build & Run

To qualify for full scoring, the migrated app must:
- Build successfully (e.g., `npm run build` succeeds)
- Run in dev mode without fatal errors (e.g., `npm run dev` starts and the Dashboard loads without fatal runtime errors)
- Allow core flows to be verified

If Build & Run fails:
- Result is still published
- Final score is capped at **40**
- Failure reason is documented

---

## Scoring Breakdown (100 points)

### 1) Core Task Completion — 50 points
Evaluates correctness and completeness of the migration.

Key checks:
- Vue 3 frontend fully replaces React app
- Vue Router 4 used correctly
- Pinia used for global state
- All pages and core flows preserved
- No major feature loss or regressions

---

### 2) Vue + TypeScript Conversion Quality — 25 points
Evaluates idiomatic and technically sound migration.

Key checks:
- Composition API used consistently
- Meaningful TypeScript usage (minimal `any`)
- Well-structured Pinia stores
- No leftover React patterns

---

### 3) Code Correctness & Structure — 15 points
Evaluates maintainability and clarity.

Key checks:
- Reasonable file structure
- Clean separation of concerns
- Utilities/hooks migrated cleanly
- No excessive duplication or chaos

---

### 4) Cost Efficiency (Relative) — 10 points
Evaluates token efficiency relative to other models tested.

Key checks:
- Avoids unnecessary verbosity
- Efficient migration path
- No repeated large rewrites

Cost is a secondary metric — correctness wins.

---

## Notes on Speed
Build time is tracked and reported but does not directly affect score.

---

## Versioning
Rubric version: **v1**  
Any changes require a new version. Historical results remain tied to the rubric used.


