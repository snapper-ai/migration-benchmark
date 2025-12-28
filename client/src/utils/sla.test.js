import { describe, expect, it } from "vitest";
import { computeSla } from "./sla.js";

describe("computeSla", () => {
  it("marks unresolved incident as breached after SLA window", () => {
    const createdAt = new Date("2025-01-01T00:00:00.000Z").toISOString();
    const incident = { severity: "S1", status: "triggered", createdAt };
    const nowMs = new Date("2025-01-01T02:00:00.000Z").getTime(); // 120m later
    const sla = computeSla(incident, nowMs);
    expect(sla.breached).toBe(true);
    expect(sla.remainingLabel).toBe("BREACHED");
  });

  it("does not breach resolved incidents", () => {
    const createdAt = new Date("2025-01-01T00:00:00.000Z").toISOString();
    const incident = { severity: "S1", status: "resolved", createdAt };
    const nowMs = new Date("2025-01-02T00:00:00.000Z").getTime();
    const sla = computeSla(incident, nowMs);
    expect(sla.breached).toBe(false);
  });
});


