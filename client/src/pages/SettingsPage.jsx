import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/slices/usersSlice.js";
import { config } from "../config.js";
import { getCurrentUserId, setCurrentUserId } from "../utils/currentUser.js";
import { Badge } from "../components/Badge.jsx";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users.items);
  const [selected, setSelected] = React.useState(getCurrentUserId() || "");

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const current = users.find((u) => u.id === selected) || null;

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

        {config.enableAnalytics ? (
          <div className="mt-3 rounded border border-slate-900 bg-slate-950 p-3 text-xs text-slate-300">
            Analytics is enabled via <code className="text-slate-100">VITE_ENABLE_ANALYTICS</code>. (Stub panel)
          </div>
        ) : null}
      </div>
    </div>
  );
}


