import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("incidents status transitions", () => {
  it("rejects an invalid transition with VALIDATION_ERROR schema", async () => {
    const app = createApp();
    const server = app.listen(0);
    const { port } = server.address();

    try {
      const res = await fetch(`http://localhost:${port}/api/incidents/inc_001`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-ops-user-id": "usr_002", // responder
        },
        body: JSON.stringify({ status: "mitigated" }), // invalid from triggered
      });

      expect(res.status).toBe(400);
      const payload = await res.json();
      expect(payload).toMatchObject({
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(payload.error.fields.status).toContain("Invalid transition");
    } finally {
      server.close();
    }
  });
});


