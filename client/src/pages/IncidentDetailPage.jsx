import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchIncidentById, reopenIncident, updateIncident } from "../store/slices/incidentsSlice.js";
import { fetchCommentsForIncident, createComment } from "../store/slices/commentsSlice.js";
import { fetchUsers } from "../store/slices/usersSlice.js";
import { fetchServices } from "../store/slices/servicesSlice.js";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Badge } from "../components/Badge.jsx";
import { computeSla } from "../utils/sla.js";
import { formatDateTime } from "../utils/dates.js";
import { allowedTransitions } from "../utils/statusTransitions.js";
import { useCurrentUser } from "../hooks/useCurrentUser.js";
import { canManageComments, canManageIncidents } from "../utils/roles.js";

export default function IncidentDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const currentUser = useCurrentUser();
  const canEditIncident = canManageIncidents(currentUser?.role);
  const canComment = canManageComments(currentUser?.role);

  const incident = useSelector((s) => s.incidents.byId[id]);
  const incidentsError = useSelector((s) => s.incidents.error);
  const comments = useSelector((s) => s.comments.byIncidentId[id] || []);
  const commentsError = useSelector((s) => s.comments.error);
  const users = useSelector((s) => s.users.items);
  const services = useSelector((s) => s.services.items);

  const [commentBody, setCommentBody] = React.useState("");
  const [actionError, setActionError] = React.useState(null);

  React.useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchServices());
    dispatch(fetchIncidentById(id));
    dispatch(fetchCommentsForIncident(id));
  }, [dispatch, id]);

  if (!incident) return <LoadingState label="Loading incident…" />;

  const svc = services.find((s) => s.id === incident.serviceId);
  const sla = computeSla(incident);
  const next = allowedTransitions[incident.status] || [];

  function doUpdateStatus(status) {
    setActionError(null);
    dispatch(updateIncident({ id: incident.id, patch: { status } }))
      .unwrap()
      .catch((e) => setActionError(e.message || "Failed to update status"));
  }

  function doReopen() {
    setActionError(null);
    dispatch(reopenIncident(incident.id))
      .unwrap()
      .catch((e) => setActionError(e.message || "Failed to reopen"));
  }

  function doAddComment() {
    if (!commentBody.trim()) return;
    setActionError(null);
    dispatch(createComment({ incidentId: incident.id, body: commentBody.trim() }))
      .unwrap()
      .then(() => setCommentBody(""))
      .catch((e) => setActionError(e.message || "Failed to add comment"));
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-400">
        <Link to="/incidents" className="hover:underline">
          Incidents
        </Link>{" "}
        / {incident.title}
      </div>

      <div className="rounded border border-slate-800 bg-slate-950 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-slate-100">{incident.title}</div>
            <div className="mt-1 text-sm text-slate-400">
              Service:{" "}
              {svc ? (
                <Link to={`/services/${svc.id}`} className="text-indigo-200 hover:underline">
                  {svc.name}
                </Link>
              ) : (
                incident.serviceId
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="slate">{incident.severity}</Badge>
            <Badge tone={incident.status === "resolved" ? "green" : "amber"}>{incident.status}</Badge>
            {sla.breached ? <Badge tone="rose">BREACHED</Badge> : <Badge tone="indigo">{sla.remainingLabel}</Badge>}
          </div>
        </div>

        <div className="mt-3 whitespace-pre-wrap text-sm text-slate-200">{incident.description}</div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(incident.tags || []).map((t) => (
            <Badge key={t} tone="slate">
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-400 md:grid-cols-3">
          <div>Created: {formatDateTime(incident.createdAt)}</div>
          <div>Updated: {formatDateTime(incident.updatedAt)}</div>
          <div>Commander: {incident.commanderId || "—"}</div>
        </div>

        {actionError ? <div className="mt-3 text-xs text-rose-200">{actionError}</div> : null}
        {incidentsError ? <div className="mt-3"><ErrorCallout title="Incident error" message={incidentsError} /></div> : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {canEditIncident && next.length ? (
            <>
              {next.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
                  onClick={() => doUpdateStatus(s)}
                >
                  {incident.status} → {s}
                </button>
              ))}
            </>
          ) : (
            <div className="text-xs text-slate-500">No valid next transitions.</div>
          )}

          {canEditIncident && incident.status === "resolved" ? (
            <button
              type="button"
              className="rounded bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600"
              onClick={doReopen}
            >
              Reopen (resolved → investigating)
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded border border-slate-800 bg-slate-950 p-4">
        <div className="text-sm font-semibold text-slate-200">Comments</div>
        {commentsError ? <div className="mt-3"><ErrorCallout title="Comments failed" message={commentsError} /></div> : null}

        {canComment ? (
          <div className="mt-3 space-y-2">
            <textarea
              rows={3}
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Write a comment…"
            />
            <button
              type="button"
              className="rounded bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              onClick={doAddComment}
            >
              Add comment
            </button>
          </div>
        ) : (
          <div className="mt-3 text-xs text-slate-500">Comments are read-only for viewers.</div>
        )}

        <div className="mt-4 space-y-2">
          {comments.map((c) => {
            const author = users.find((u) => u.id === c.authorId);
            return (
              <div key={c.id} className="rounded border border-slate-900 bg-slate-950 px-3 py-2">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <div>{author ? author.name : c.authorId}</div>
                  <div>{formatDateTime(c.createdAt)}</div>
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{c.body}</div>
              </div>
            );
          })}
          {comments.length === 0 ? <div className="text-sm text-slate-400">No comments.</div> : null}
        </div>
      </div>
    </div>
  );
}


