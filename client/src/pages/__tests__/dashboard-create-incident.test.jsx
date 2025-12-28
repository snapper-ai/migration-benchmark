import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "../DashboardPage.jsx";

// Mock API layer for deterministic integration-like behavior.
vi.mock("../../api/http.js", () => {
  let services = Array.from({ length: 8 }).map((_, idx) => ({
    id: `svc_${String(idx + 1).padStart(3, "0")}`,
    name: `Service ${idx + 1}`,
    tier: 1,
    ownerTeam: "Platform",
    status: "active",
    createdAt: "2025-01-01T00:00:00.000Z",
  }));

  let incidents = [];
  let activity = [];

  return {
    ApiError: class ApiError extends Error {},
    apiFetch: async (path, opts = {}) => {
      if (path === "/services") return services;
      if (path === "/incidents") return incidents;
      if (path === "/activity") return activity;
      if (path === "/incidents" && opts.method === "POST") {
        const inc = {
          id: "inc_999",
          serviceId: opts.body.serviceId,
          title: opts.body.title,
          description: opts.body.description,
          status: "triggered",
          severity: opts.body.severity,
          commanderId: null,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          acknowledgedAt: null,
          resolvedAt: null,
          tags: opts.body.tags || [],
        };
        incidents = [inc, ...incidents];
        return inc;
      }
      throw new Error(`Unhandled mock path: ${path}`);
    },
  };
});

describe("Dashboard integration", () => {
  it("creating an incident updates the dashboard KPI (open incidents)", async () => {
    const { createAppStore } = await import("../../store/store.js");
    const store = createAppStore();

    render(
      <React.Fragment>
        <Provider store={store}>
          <BrowserRouter>
            <DashboardPage />
          </BrowserRouter>
        </Provider>
      </React.Fragment>,
    );

    expect(await screen.findByText(/Open Incidents:/)).toHaveTextContent(
      "Open Incidents: 0",
    );

    // Dispatch the create incident thunk directly (keeps the UI test simple but still end-to-end through slice reducers)
    const { createIncident } = await import("../../store/slices/incidentsSlice.js");
    await store.dispatch(
      createIncident({
        serviceId: "svc_001",
        title: "New incident",
        description: "desc",
        severity: "S2",
        tags: [],
      }),
    );

    expect(screen.getByText(/Open Incidents:/)).toHaveTextContent(
      "Open Incidents: 1",
    );

    // sanity: force error button exists (deterministic error path wiring)
    expect(screen.getByRole("button", { name: "Force error" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Force error" }));
  });
});


