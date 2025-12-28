import React from "react";

export function Modal({ title, open, onClose, children, footer }) {
  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="relative z-20" role="dialog" aria-modal="true">
      <button
        type="button"
        className="fixed inset-0 cursor-default bg-black/60"
        aria-label="Close modal"
        onClick={() => onClose?.()}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded border border-slate-800 bg-slate-950 shadow-xl">
          <div className="border-b border-slate-800 px-4 py-3">
            <div className="text-sm font-semibold text-slate-100">{title}</div>
          </div>
          <div className="px-4 py-3">{children}</div>
          {footer ? (
            <div className="flex items-center justify-end gap-2 border-t border-slate-800 px-4 py-3">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}


