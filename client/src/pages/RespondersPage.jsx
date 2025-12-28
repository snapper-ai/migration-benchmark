import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/slices/usersSlice.js";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Badge } from "../components/Badge.jsx";

export default function RespondersPage() {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users);

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-100">Responders</div>
        <div className="text-sm text-slate-400">Role + on-call status.</div>
      </div>

      {users.status === "loading" ? <LoadingState /> : null}
      {users.error ? (
        <ErrorCallout title="Users failed" message={users.error} onRetry={() => dispatch(fetchUsers())} />
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {users.items.map((u) => (
          <div key={u.id} className="rounded border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-100">{u.name}</div>
              <Badge tone={u.onCall ? "green" : "slate"}>{u.onCall ? "On-call" : "Off-call"}</Badge>
            </div>
            <div className="mt-1 text-xs text-slate-400">{u.email}</div>
            <div className="mt-2 flex items-center gap-2">
              <Badge tone="indigo">{u.role}</Badge>
              <Badge tone="slate">{u.team}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


