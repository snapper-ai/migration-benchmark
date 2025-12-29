import React from "react";
import { useAppActions, useAppState } from "../state/AppState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Modal } from "../components/Modal.jsx";
import { Badge } from "../components/Badge.jsx";
import { computeSla } from "../utils/sla.js";
import { allowedTransitions } from "../utils/statusTransitions.js";
import { useCurrentUser } from "../hooks/useCurrentUser.js";
import { canManageIncidents } from "../utils/roles.js";
import { INCIDENT_SEVERITIES, INCIDENT_STATUSES, isIncidentSeverity } from "../domain/enums.js";

export default function IncidentsPage() {
  const actions = useAppActions();
  const { incidents } = useAppState();
  const currentUser = useCurrentUser();
  const canEdit = canManageIncidents(currentUser?.role);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    severity: "S2",
    tags: "",
  });
  const [formError, setFormError] = React.useState(null);

  React.useEffect(() => {
    actions.loadUsers();
  }, [actions]);

  React.useEffect(() => {
    actions.loadIncidents(incidents.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actions,
    incidents.query.status,
    incidents.query.severity,
    incidents.query.q,
    incidents.query.sort,
    incidents.query.breached,
  ]);

  function submitCreate() {
    const fields = {};
    if (!form.title || String(form.title).trim().length < 4) fields.title = "Title must be at least 4 characters";
    if (!form.description || String(form.description).trim().length < 1) fields.description = "Description is required";
    if (!isIncidentSeverity(form.severity)) fields.severity = "Severity must be S1..S4";
    if (Object.keys(fields).length) {
      const first = Object.values(fields)[0];
      setFormError(String(first));
      return;
    }
    setFormError(null);
    const tags = form.tags
      ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    actions
      .createIncident({
        title: String(form.title).trim(),
        description: String(form.description).trim(),
        severity: form.severity,
        tags,
      })
      .then(() => {
        setCreateOpen(false);
        setForm({ title: "", description: "", severity: "S2", tags: "" });
      })
      .catch((e) => setFormError(e.message || "Failed to create incident"));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-slate-100">Incidents</div>
          <div className="text-sm text-slate-400">Filters are debounced; status rules are enforced server-side.</div>
        </div>
        <button
          type="button"
          className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          disabled={!canEdit}
          onClick={() => setCreateOpen(true)}
        >
          Create incident
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded border border-slate-800 bg-slate-950 p-4 md:grid-cols-6">
        <label className="md:col-span-2">
          <div className="mb-1 text-xs text-slate-400">Search</div>
          <input
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={incidents.query.q}
            onChange={(e) => actions.setIncidentQuery({ q: e.target.value })}
            placeholder="title / description / tag"
          />
        </label>
        <label>
          <div className="mb-1 text-xs text-slate-400">Status</div>
          <select
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={incidents.query.status}
            onChange={(e) => actions.setIncidentQuery({ status: e.target.value })}
          >
            <option value="">All</option>
            {INCIDENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className="mb-1 text-xs text-slate-400">Severity</div>
          <select
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={incidents.query.severity}
            onChange={(e) => actions.setIncidentQuery({ severity: e.target.value })}
          >
            <option value="">All</option>
            {INCIDENT_SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className="mb-1 text-xs text-slate-400">Breached</div>
          <select
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={incidents.query.breached}
            onChange={(e) => actions.setIncidentQuery({ breached: e.target.value })}
          >
            <option value="">All</option>
            <option value="true">Breached</option>
            <option value="false">Not breached</option>
          </select>
        </label>
        <label>
          <div className="mb-1 text-xs text-slate-400">Sort</div>
          <select
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={incidents.query.sort}
            onChange={(e) => actions.setIncidentQuery({ sort: e.target.value })}
          >
            <option value="createdAt_desc">Newest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="severity_asc">Severity (S1..S4)</option>
            <option value="severity_desc">Severity (S4..S1)</option>
          </select>
        </label>
      </div>

      {incidents.status === "loading" ? <LoadingState /> : null}
      {incidents.error ? (
        <ErrorCallout
          title="Incidents failed"
          message={incidents.error}
          onRetry={() => actions.loadIncidents(incidents.query)}
        />
      ) : null}

      <div className="space-y-2">
        {incidents.items.map((i) => {
          const sla = computeSla(i);
          const next = allowedTransitions[i.status] || [];

          return (
            <div
              key={i.id}
              className="flex flex-col gap-2 rounded border border-slate-800 bg-slate-950 px-3 py-2 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-100">{i.title}</div>
                <div className="text-xs text-slate-400">
                  {i.severity} · {i.status}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {sla.breached ? (
                  <Badge tone="rose">BREACHED</Badge>
                ) : (
                  <Badge tone="indigo">{sla.remainingLabel}</Badge>
                )}
                {canEdit && next.length ? (
                  <select
                    className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                    defaultValue=""
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v) return;
                      actions.patchIncident(i.id, { status: v });
                      e.target.value = "";
                    }}
                  >
                    <option value="">Set status…</option>
                    {next.map((s) => (
                      <option key={s} value={s}>
                        {i.status} → {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-slate-500">{canEdit ? "—" : "read-only"}</span>
                )}
              </div>
            </div>
          );
        })}
        {incidents.items.length === 0 ? (
          <div className="rounded border border-slate-800 bg-slate-950 px-3 py-6 text-center text-sm text-slate-400">
            No incidents
          </div>
        ) : null}
      </div>

      <Modal
        title="Create incident"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button
              type="button"
              className="rounded bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              onClick={submitCreate}
            >
              Create
            </button>
          </>
        }
      >
        {formError ? <div className="mb-2 text-xs text-rose-200">{formError}</div> : null}
        <div className="grid grid-cols-1 gap-3">
          <label>
            <div className="mb-1 text-xs text-slate-400">Title</div>
            <input
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>
          <label>
            <div className="mb-1 text-xs text-slate-400">Description</div>
            <textarea
              rows={4}
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <div className="mb-1 text-xs text-slate-400">Severity</div>
              <select
                className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
              >
                {INCIDENT_SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div className="mb-1 text-xs text-slate-400">Tags (comma-separated)</div>
              <input
                className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              />
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}


