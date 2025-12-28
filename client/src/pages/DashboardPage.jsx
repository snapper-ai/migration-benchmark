import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { fetchServices } from "../store/slices/servicesSlice.js";
import { fetchIncidents } from "../store/slices/incidentsSlice.js";
import { fetchActivity } from "../store/slices/activitySlice.js";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Badge } from "../components/Badge.jsx";
import { computeSla } from "../utils/sla.js";
import { formatDateTime } from "../utils/dates.js";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const services = useSelector((s) => s.services);
  const incidents = useSelector((s) => s.incidents);
  const activity = useSelector((s) => s.activity);

  React.useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchIncidents({ sort: "createdAt_desc" }));
    dispatch(fetchActivity());
  }, [dispatch]);

  React.useEffect(() => {
    const t = setInterval(() => dispatch(fetchActivity()), 5000);
    return () => clearInterval(t);
  }, [dispatch]);

  const breachedCount = incidents.items.filter((i) => computeSla(i).breached).length;
  const openCount = incidents.items.filter((i) => i.status !== "resolved").length;

  const sevCounts = ["S1", "S2", "S3", "S4"].map((sev) => ({
    severity: sev,
    count: incidents.items.filter((i) => i.severity === sev).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-semibold text-slate-100">Dashboard</div>
          <div className="text-sm text-slate-400">KPIs update as data changes.</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={breachedCount ? "rose" : "green"}>
            SLA Breaches: {breachedCount}
          </Badge>
          <Badge tone="indigo">Open Incidents: {openCount}</Badge>
        </div>
      </div>

      {services.status === "loading" || incidents.status === "loading" ? (
        <LoadingState />
      ) : null}

      {services.error ? (
        <ErrorCallout title="Services failed" message={services.error} onRetry={() => dispatch(fetchServices())} />
      ) : null}
      {incidents.error ? (
        <ErrorCallout title="Incidents failed" message={incidents.error} onRetry={() => dispatch(fetchIncidents(incidents.query))} />
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border border-slate-800 bg-slate-950 p-4 md:col-span-2">
          <div className="text-sm font-semibold text-slate-200">Incidents by severity</div>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sevCounts}>
                <XAxis dataKey="severity" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded border border-slate-800 bg-slate-950 p-4">
          <div className="text-sm font-semibold text-slate-200">Seed sanity</div>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div>Services: {services.items.length}</div>
            <div>Incidents: {incidents.items.length}</div>
            <div>Activity: {activity.items.length}</div>
          </div>
        </div>
      </div>

      <div className="rounded border border-slate-800 bg-slate-950 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">Activity feed</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded bg-rose-800 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              onClick={() => dispatch(fetchActivity({ forceError: true }))}
            >
              Force error
            </button>
            <button
              type="button"
              className="rounded bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
              onClick={() => dispatch(fetchActivity())}
            >
              Refresh
            </button>
          </div>
        </div>

        {activity.status === "loading" ? (
          <div className="mt-3 text-sm text-slate-400">Loading activity…</div>
        ) : null}

        {activity.error ? (
          <div className="mt-3">
            <ErrorCallout title="Activity failed" message={activity.error} onRetry={() => dispatch(fetchActivity())} />
          </div>
        ) : null}

        <div className="mt-3 space-y-2">
          {activity.items.map((a) => (
            <div key={a.id} className="rounded border border-slate-900 bg-slate-950 px-3 py-2">
              <div className="text-xs text-slate-400">{formatDateTime(a.createdAt)}</div>
              <div className="text-sm text-slate-200">{a.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


