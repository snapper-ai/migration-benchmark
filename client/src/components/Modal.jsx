import React from "react";
import { Dialog } from "@headlessui/react";

export function Modal({ title, open, onClose, children, footer }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-20">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded border border-slate-800 bg-slate-950 shadow-xl">
          <div className="border-b border-slate-800 px-4 py-3">
            <Dialog.Title className="text-sm font-semibold text-slate-100">
              {title}
            </Dialog.Title>
          </div>
          <div className="px-4 py-3">{children}</div>
          {footer ? (
            <div className="flex items-center justify-end gap-2 border-t border-slate-800 px-4 py-3">
              {footer}
            </div>
          ) : null}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}


