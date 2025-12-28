import React from "react";

export function ErrorCallout({ title = "Error", message, onRetry }) {
  return (
    <div className="rounded border border-rose-800 bg-rose-950 px-4 py-3">
      <div className="text-sm font-semibold text-rose-100">{title}</div>
      {message ? (
        <div className="mt-1 text-xs text-rose-200">{message}</div>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          className="mt-3 rounded bg-rose-700 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600"
          onClick={onRetry}
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}


