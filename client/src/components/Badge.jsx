import React from "react";

const toneToClasses = {
  slate: "bg-slate-900 text-slate-200 border-slate-800",
  green: "bg-emerald-950 text-emerald-200 border-emerald-900",
  amber: "bg-amber-950 text-amber-200 border-amber-900",
  rose: "bg-rose-950 text-rose-200 border-rose-900",
  indigo: "bg-indigo-950 text-indigo-200 border-indigo-900",
};

export function Badge({ children, tone = "slate" }) {
  const cls = toneToClasses[tone] || toneToClasses.slate;
  return (
    <span
      className={[
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold",
        cls,
      ].join(" ")}
    >
      {children}
    </span>
  );
}


