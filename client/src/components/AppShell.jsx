import React from "react";
import { NavLink } from "react-router-dom";
import { config } from "../config.js";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded px-3 py-2 text-sm",
          isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export function AppShell({ children }) {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-indigo-600" />
            <div className="font-semibold">{config.appName}</div>
          </div>
          <nav className="flex items-center gap-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/incidents">Incidents</NavItem>
            <NavItem to="/settings">Settings</NavItem>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}


