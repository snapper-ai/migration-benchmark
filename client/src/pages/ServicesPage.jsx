import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createService, deleteService, fetchServices, updateService } from "../store/slices/servicesSlice.js";
import { fetchUsers } from "../store/slices/usersSlice.js";
import { DataTable } from "../components/DataTable.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Modal } from "../components/Modal.jsx";
import { Badge } from "../components/Badge.jsx";
import { createServiceSchema } from "../validation/schemas.js";
import { useCurrentUser } from "../hooks/useCurrentUser.js";
import { canManageServices } from "../utils/roles.js";

export default function ServicesPage() {
  const dispatch = useDispatch();
  const services = useSelector((s) => s.services);
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
    dispatch(fetchServices());
    dispatch(fetchUsers());
  }, [dispatch]);

  function submitCreate() {
    const parsed = createServiceSchema.safeParse({
      ...form,
      tier: Number(form.tier),
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    setFormError(null);
    dispatch(createService(parsed.data))
      .unwrap()
      .then(() => {
        setCreateOpen(false);
        setForm({ name: "", tier: 1, ownerTeam: "", status: "active" });
      })
      .catch((e) => setFormError(e.message || "Failed to create service"));
  }

  const columns = [
    {
      key: "name",
      header: "Service",
      render: (s) => (
        <div className="space-y-1">
          <Link className="font-semibold text-indigo-200 hover:underline" to={`/services/${s.id}`}>
            {s.name}
          </Link>
          <div className="text-xs text-slate-400">{s.ownerTeam}</div>
        </div>
      ),
    },
    { key: "tier", header: "Tier" },
    {
      key: "status",
      header: "Status",
      render: (s) => <Badge tone={s.status === "active" ? "green" : "amber"}>{s.status}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (s) =>
        canEdit ? (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
              onClick={() => dispatch(updateService({ id: s.id, patch: { status: s.status === "active" ? "degraded" : "active" } }))}
            >
              Toggle
            </button>
            <button
              type="button"
              className="rounded bg-rose-800 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              onClick={() => dispatch(deleteService(s.id))}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="text-right text-xs text-slate-500">read-only</div>
        ),
    },
  ];

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
        <ErrorCallout title="Services failed" message={services.error} onRetry={() => dispatch(fetchServices())} />
      ) : null}

      <DataTable columns={columns} rows={services.items} rowKey={(s) => s.id} emptyLabel="No services" />

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


