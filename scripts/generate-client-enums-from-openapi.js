import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const openapiPath = path.join(repoRoot, "contracts", "openapi.yaml");
const outPath = path.join(repoRoot, "client", "src", "domain", "enums.js");

function extractEnumList(doc, schemaName) {
  // Very small, purpose-built extractor. We expect:
  // SchemaName:
  //   type: string
  //   enum: ["a", "b", ...]
  const re = new RegExp(
    String.raw`${schemaName}:[\s\S]*?\n\s*enum:\s*\[([^\]]+)\]`,
    "m",
  );
  const m = doc.match(re);
  if (!m) throw new Error(`Could not find enum list for ${schemaName} in ${openapiPath}`);
  const raw = m[1];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^["']|["']$/g, ""));
}

const openapi = fs.readFileSync(openapiPath, "utf8");
const statuses = extractEnumList(openapi, "IncidentStatus");
const severities = extractEnumList(openapi, "IncidentSeverity");

const content = `// GENERATED FILE — DO NOT EDIT BY HAND
// Source of truth: contracts/openapi.yaml (components.schemas.IncidentStatus / IncidentSeverity)
// To regenerate:
//   node scripts/generate-client-enums-from-openapi.js

export const INCIDENT_STATUSES = ${JSON.stringify(statuses, null, 2)};

export const INCIDENT_SEVERITIES = ${JSON.stringify(severities, null, 2)};

export function isIncidentStatus(value) {
  return INCIDENT_STATUSES.includes(value);
}

export function isIncidentSeverity(value) {
  return INCIDENT_SEVERITIES.includes(value);
}
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, "utf8");
console.log(`Wrote ${path.relative(repoRoot, outPath)}`);


