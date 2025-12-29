import React from "react";
import { Link } from "react-router-dom";
import { useAppActions, useAppState } from "../state/AppState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Modal } from "../components/Modal.jsx";
import { Badge } from "../components/Badge.jsx";
import { useCurrentUser } from "../hooks/useCurrentUser.js";
import { canManageServices } from "../utils/roles.js";

export default function ServicesPage() {
  const actions = useAppActions();
  const services = useAppState().services;
  const currentUser = useCurrentUser();
  const canEdit = canManageServices(currentUser?.role);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    tier: 1,
    ownerTeam: "",
    status: "active",
  });
  const [formError, setFormError] = React.useState(null);

  React.useEffect(() => {
    actions.loadServices();
    actions.loadUsers();
  }, [actions]);

  function submitCreate() {
    const tier = Number(form.tier);
    const fields = {};
    if (!form.name || String(form.name).trim().length < 2) fields.name = "Name must be at least 2 characters";
    if (![0, 1, 2, 3].includes(tier)) fields.tier = "Tier must be 0, 1, 2, or 3";
    if (!form.ownerTeam || String(form.ownerTeam).trim().length < 2)
      fields.ownerTeam = "Owner team must be at least 2 characters";
    if (!["active", "degraded"].includes(form.status)) fields.status = "Status must be active or degraded";

    if (Object.keys(fields).length) {
      const first = Object.values(fields)[0];
      setFormError(String(first));
      return;
    }
    setFormError(null);
    actions
      .createService({
        name: String(form.name).trim(),
        tier,
        ownerTeam: String(form.ownerTeam).trim(),
        status: form.status,
      })
      .then(() => {
        setCreateOpen(false);
        setForm({ name: "", tier: 1, ownerTeam: "", status: "active" });
      })
      .catch((e) => setFormError(e.message || "Failed to create service"));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-slate-100">Services</div>
          <div className="text-sm text-slate-400">CRUD is role-gated: admin only.</div>
        </div>
        <button
          type="button"
          className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          disabled={!canEdit}
          onClick={() => setCreateOpen(true)}
        >
          Create service
        </button>
      </div>

      {services.status === "loading" ? <LoadingState /> : null}
      {services.error ? (
        <ErrorCallout title="Services failed" message={services.error} onRetry={() => actions.loadServices()} />
      ) : null}

      <div className="space-y-2">
        {services.items.map((s) => (
          <div
            key={s.id}
            className="flex items-start justify-between gap-3 rounded border border-slate-800 bg-slate-950 px-3 py-2"
          >
            <div className="space-y-1">
              <Link className="font-semibold text-indigo-200 hover:underline" to={`/services/${s.id}`}>
                {s.name}
              </Link>
              <div className="text-xs text-slate-400">
                Tier {s.tier} · {s.ownerTeam}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={s.status === "active" ? "green" : "amber"}>{s.status}</Badge>
              {canEdit ? (
                <>
                  <button
                    type="button"
                    className="rounded bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
                    onClick={() =>
                      actions.patchService(s.id, {
                        status: s.status === "active" ? "degraded" : "active",
                      })
                    }
                  >
                    Toggle
                  </button>
                  <button
                    type="button"
                    className="rounded bg-rose-800 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                    onClick={() => actions.deleteService(s.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <div className="text-right text-xs text-slate-500">read-only</div>
              )}
            </div>
          </div>
        ))}
        {services.items.length === 0 ? (
          <div className="rounded border border-slate-800 bg-slate-950 px-3 py-6 text-center text-sm text-slate-400">
            No services
          </div>
        ) : null}
      </div>

      <Modal
        title="Create service"
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
          <label className="text-sm">
            <div className="mb-1 text-xs text-slate-400">Name</div>
            <input
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            <div className="mb-1 text-xs text-slate-400">Owner team</div>
            <input
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={form.ownerTeam}
              onChange={(e) => setForm((f) => ({ ...f, ownerTeam: e.target.value }))}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <div className="mb-1 text-xs text-slate-400">Tier</div>
              <select
                className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                value={form.tier}
                onChange={(e) => setForm((f) => ({ ...f, tier: Number(e.target.value) }))}
              >
                {[0, 1, 2, 3].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <div className="mb-1 text-xs text-slate-400">Status</div>
              <select
                className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="active">active</option>
                <option value="degraded">degraded</option>
              </select>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}


