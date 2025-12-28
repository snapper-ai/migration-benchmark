import React from "react";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
      {label}
    </div>
  );
}


