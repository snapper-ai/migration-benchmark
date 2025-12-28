import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createIncident, fetchIncidents, setIncidentQuery, updateIncident } from "../store/slices/incidentsSlice.js";
import { fetchServices } from "../store/slices/servicesSlice.js";
import { fetchUsers } from "../store/slices/usersSlice.js";
import { DataTable } from "../components/DataTable.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Modal } from "../components/Modal.jsx";
import { Badge } from "../components/Badge.jsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { computeSla } from "../utils/sla.js";
import { allowedTransitions } from "../utils/statusTransitions.js";
import { createIncidentSchema } from "../validation/schemas.js";
import { useCurrentUser } from "../hooks/useCurrentUser.js";
import { canManageIncidents } from "../utils/roles.js";

export default function IncidentsPage() {
  const dispatch = useDispatch();
  const incidents = useSelector((s) => s.incidents);
  const services = useSelector((s) => s.services.items);
  const currentUser = useCurrentUser();
  const canEdit = canManageIncidents(currentUser?.role);

  const debouncedQ = useDebouncedValue(incidents.query.q, 250);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    serviceId: "",
    title: "",
    description: "",
    severity: "S2",
    tags: "",
  });
  const [formError, setFormError] = React.useState(null);

  React.useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchUsers());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchIncidents({ ...incidents.query, q: debouncedQ }));
    // We intentionally depend on individual query fields (not the whole object)
    // to avoid refetch loops when reducers replace `incidents.query` by reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, incidents.query.serviceId, incidents.query.status, incidents.query.severity, incidents.query.sort, incidents.query.breached, debouncedQ]);

  function submitCreate() {
    const parsed = createIncidentSchema.safeParse({
      serviceId: form.serviceId,
      title: form.title,
      description: form.description,
      severity: form.severity,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    setFormError(null);
    dispatch(createIncident(parsed.data))
      .unwrap()
      .then(() => {
        setCreateOpen(false);
        setForm({ serviceId: "", title: "", description: "", severity: "S2", tags: "" });
      })
      .catch((e) => setFormError(e.message || "Failed to create incident"));
  }

  const columns = [
    {
      key: "title",
      header: "Incident",
      render: (i) => {
        const svc = services.find((s) => s.id === i.serviceId);
        const sla = computeSla(i);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link className="font-semibold text-indigo-200 hover:underline" to={`/incidents/${i.id}`}>
                {i.title}
              </Link>
              {sla.breached ? <Badge tone="rose">BREACHED</Badge> : <Badge tone="indigo">{sla.remainingLabel}</Badge>}
            </div>
            <div className="text-xs text-slate-400">
              {i.severity} · {i.status} · {svc ? svc.name : i.serviceId}
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Update",
      render: (i) => {
        if (!canEdit) return <div className="text-xs text-slate-500">read-only</div>;
        const next = allowedTransitions[i.status] || [];
        if (next.length === 0) return <div className="text-xs text-slate-500">—</div>;
        return (
          <select
            className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              dispatch(updateIncident({ id: i.id, patch: { status: v } }));
              e.target.value = "";
            }}
          >
            <option value="">Set…</option>
            {next.map((s) => (
              <option key={s} value={s}>
                {i.status} → {s}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

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
            onChange={(e) => dispatch(setIncidentQuery({ q: e.target.value }))}
            placeholder="title / description / tag"
          />
        </label>
        <label>
          <div className="mb-1 text-xs text-slate-400">Service</div>
          <select
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={incidents.query.serviceId}
            onChange={(e) => dispatch(setIncidentQuery({ serviceId: e.target.value }))}
          >
            <option value="">All</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className="mb-1 text-xs text-slate-400">Status</div>
          <select
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            value={incidents.query.status}
            onChange={(e) => dispatch(setIncidentQuery({ status: e.target.value }))}
          >
            <option value="">All</option>
            {["triggered", "acknowledged", "investigating", "mitigated", "resolved"].map((s) => (
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
            onChange={(e) => dispatch(setIncidentQuery({ severity: e.target.value }))}
          >
            <option value="">All</option>
            {["S1", "S2", "S3", "S4"].map((s) => (
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
            onChange={(e) => dispatch(setIncidentQuery({ breached: e.target.value }))}
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
            onChange={(e) => dispatch(setIncidentQuery({ sort: e.target.value }))}
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
        <ErrorCallout title="Incidents failed" message={incidents.error} onRetry={() => dispatch(fetchIncidents(incidents.query))} />
      ) : null}

      <DataTable columns={columns} rows={incidents.items} rowKey={(i) => i.id} emptyLabel="No incidents" />

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
            <div className="mb-1 text-xs text-slate-400">Service</div>
            <select
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={form.serviceId}
              onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
            >
              <option value="">Select…</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
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
                {["S1", "S2", "S3", "S4"].map((s) => (
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


