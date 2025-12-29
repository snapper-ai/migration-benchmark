import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

test("invalid incident status transition returns VALIDATION_ERROR", async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://localhost:${port}/api/incidents/inc_001`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-ops-user-id": "usr_002",
      },
      body: JSON.stringify({ status: "mitigated" }),
    });

    assert.equal(res.status, 400);
    const payload = await res.json();
    assert.equal(payload?.error?.code, "VALIDATION_ERROR");
    assert.ok(String(payload?.error?.fields?.status || "").includes("Invalid transition"));
  } finally {
    server.close();
  }
});


