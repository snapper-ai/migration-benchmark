import React from "react";

export function DataTable({ columns, rows, rowKey, emptyLabel = "No data" }) {
  return (
    <div className="overflow-hidden rounded border border-slate-800">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-900/60 text-slate-200">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="border-b border-slate-800 px-3 py-2">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-950">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-8 text-center text-slate-400"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={rowKey(r)} className="hover:bg-slate-900/30">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="border-t border-slate-900 px-3 py-2 align-top"
                  >
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


