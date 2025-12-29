import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function extractEnumList(doc, schemaName) {
  const re = new RegExp(
    String.raw`${schemaName}:[\s\S]*?\n\s*enum:\s*\[([^\]]+)\]`,
    "m",
  );
  const m = doc.match(re);
  assert.ok(m, `Missing enum list for ${schemaName}`);
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^["']|["']$/g, ""));
}

test("client enum exports match contracts/openapi.yaml enums", async () => {
  const repoRoot = path.join(import.meta.dirname, "..", "..");
  const openapiPath = path.join(repoRoot, "contracts", "openapi.yaml");
  const openapi = fs.readFileSync(openapiPath, "utf8");

  const statuses = extractEnumList(openapi, "IncidentStatus");
  const severities = extractEnumList(openapi, "IncidentSeverity");

  const enumsModulePath = path.join(repoRoot, "client", "src", "domain", "enums.js");
  const enums = await import(enumsModulePath);

  assert.deepEqual(enums.INCIDENT_STATUSES, statuses);
  assert.deepEqual(enums.INCIDENT_SEVERITIES, severities);
});


