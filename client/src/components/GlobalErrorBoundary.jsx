import React from "react";

export class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Intentionally minimal: deterministic, no external reporting.
    console.error("GlobalErrorBoundary caught error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="rounded border border-rose-800 bg-rose-950 p-4">
        <div className="text-sm font-semibold text-rose-100">
          Something went wrong
        </div>
        <div className="mt-2 whitespace-pre-wrap text-xs text-rose-200">
          {String(this.state.error?.message || this.state.error || "Unknown error")}
        </div>
        <button
          className="mt-3 rounded bg-rose-700 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600"
          onClick={() => window.location.reload()}
          type="button"
        >
          Reload
        </button>
      </div>
    );
  }
}


