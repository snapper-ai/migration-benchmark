import React from "react";
import { useAppActions, useAppState } from "../state/AppState.jsx";
import { config } from "../config.js";
import { getCurrentUserId, setCurrentUserId } from "../utils/currentUser.js";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorCallout } from "../components/ErrorCallout.jsx";
import { Badge } from "../components/Badge.jsx";

export default function UtilityPage({ mode }) {
  const actions = useAppActions();
  const usersState = useAppState().users;
  const users = usersState.items;

  const [selected, setSelected] = React.useState(getCurrentUserId() || "");
  const current = users.find((u) => u.id === selected) || null;

  React.useEffect(() => {
    actions.loadUsers();
  }, [actions]);

  if (mode === "responders") {
    return (
      <div className="space-y-4">
        <div>
          <div className="text-xl font-semibold text-slate-100">Responders</div>
          <div className="text-sm text-slate-400">Role + on-call status.</div>
        </div>

        {usersState.status === "loading" ? <LoadingState /> : null}
        {usersState.error ? (
          <ErrorCallout
            title="Users failed"
            message={usersState.error}
            onRetry={() => actions.loadUsers()}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {users.map((u) => (
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

  // mode === "settings"
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-100">Settings</div>
        <div className="text-sm text-slate-400">
          Dev-only user selector is persisted to localStorage.
        </div>
      </div>

      <div className="rounded border border-slate-800 bg-slate-950 p-4">
        <div className="text-sm font-semibold text-slate-200">Current user</div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label>
            <div className="mb-1 text-xs text-slate-400">User</div>
            <select
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              value={selected}
              onChange={(e) => {
                const v = e.target.value;
                setSelected(v);
                setCurrentUserId(v);
              }}
            >
              <option value="">Select…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </label>
          <div className="rounded border border-slate-900 bg-slate-950 p-3">
            {current ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-100">{current.name}</div>
                <div className="text-xs text-slate-400">{current.email}</div>
                <div className="flex items-center gap-2">
                  <Badge tone="indigo">{current.role}</Badge>
                  <Badge tone="slate">{current.team}</Badge>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">Pick a user to begin.</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded border border-slate-800 bg-slate-950 p-4">
        <div className="text-sm font-semibold text-slate-200">Feature flags</div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <div>
            Analytics:{" "}
            <Badge tone={config.enableAnalytics ? "green" : "slate"}>
              {config.enableAnalytics ? "enabled" : "disabled"}
            </Badge>
          </div>
          <div>
            Force activity error (env):{" "}
            <Badge tone={config.forceActivityError ? "amber" : "slate"}>
              {config.forceActivityError ? "on" : "off"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}


