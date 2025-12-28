import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAppActions, useAppState } from "../state/AppState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { Badge } from "../components/Badge.jsx";
import { computeSla } from "../utils/sla.js";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const actions = useAppActions();
  const services = useAppState().services.items;
  const incidents = useAppState().incidents.items;

  React.useEffect(() => {
    actions.loadServices();
    actions.loadIncidents({ serviceId: id, sort: "createdAt_desc" });
  }, [actions, id]);

  const service = services.find((s) => s.id === id);
  if (!service) return <LoadingState label="Loading service…" />;

  const breached = incidents.filter((i) => computeSla(i).breached).length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">
            <Link to="/services" className="hover:underline">
              Services
            </Link>{" "}
            / {service.name}
          </div>
          <div className="text-xl font-semibold text-slate-100">{service.name}</div>
          <div className="mt-1 text-sm text-slate-400">{service.ownerTeam}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={service.status === "active" ? "green" : "amber"}>{service.status}</Badge>
          <Badge tone={breached ? "rose" : "slate"}>Breaches: {breached}</Badge>
        </div>
      </div>

      <div className="rounded border border-slate-800 bg-slate-950 p-4">
        <div className="text-sm font-semibold text-slate-200">Incidents</div>
        <div className="mt-3 space-y-2">
          {incidents.map((i) => {
            const sla = computeSla(i);
            return (
              <Link
                key={i.id}
                to={`/incidents/${i.id}`}
                className="block rounded border border-slate-900 bg-slate-950 px-3 py-2 hover:bg-slate-900/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-100">{i.title}</div>
                  {sla.breached ? <Badge tone="rose">BREACHED</Badge> : <Badge tone="indigo">{sla.remainingLabel}</Badge>}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {i.severity} · {i.status}
                </div>
              </Link>
            );
          })}
          {incidents.length === 0 ? <div className="text-sm text-slate-400">No incidents for this service.</div> : null}
        </div>
      </div>
    </div>
  );
}


