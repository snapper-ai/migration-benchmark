const BASE = "2025-01-15T12:00:00.000Z";
const isoPlusMinutes = (minutes) =>
  new Date(new Date(BASE).getTime() + minutes * 60000).toISOString();

export const seedDb = {
  users: [
    {
      id: "usr_001",
      name: "Alex Kim",
      email: "alex.kim@opscc.local",
      role: "admin",
      team: "Platform",
      onCall: true,
    },
    {
      id: "usr_002",
      name: "Priya Nair",
      email: "priya.nair@opscc.local",
      role: "responder",
      team: "Payments",
      onCall: false,
    },
    {
      id: "usr_004",
      name: "Jordan Lee",
      email: "jordan.lee@opscc.local",
      role: "viewer",
      team: "Support",
      onCall: false,
    },
  ],
  incidents: [],
  activity: [],
};

// Deterministic incident generation (no randomness).
const severities = ["S1", "S2", "S3", "S4"];
const statuses = ["triggered", "acknowledged", "investigating", "mitigated", "resolved"];
const tagsPool = ["db", "latency", "timeout", "deploy", "capacity", "auth"];

for (let i = 1; i <= 10; i += 1) {
  const severity = severities[(i - 1) % severities.length];
  const status = statuses[(i - 1) % statuses.length];
  const createdAt = isoPlusMinutes(-10000 - i * 17);
  const updatedAt = isoPlusMinutes(-9990 - i * 13);
  const commanderId = i % 4 === 0 ? "usr_001" : null;
  const incidentId = `inc_${String(i).padStart(3, "0")}`;
  const acknowledgedAt = status === "triggered" ? null : isoPlusMinutes(-9998 - i * 13);
  const resolvedAt = status === "resolved" ? isoPlusMinutes(-9988 - i * 11) : null;

  seedDb.incidents.push({
    id: incidentId,
    title: `Incident ${incidentId} — ${severity}`,
    description: `Deterministic incident seed. This text is intentionally mid-realistic.`,
    status,
    severity,
    commanderId,
    createdAt,
    updatedAt,
    acknowledgedAt,
    resolvedAt,
    tags: [tagsPool[(i - 1) % tagsPool.length], tagsPool[(i + 2) % tagsPool.length]],
  });
}

for (let i = 1; i <= 5; i += 1) {
  const entityType = "incident";
  const entityId = `inc_${String(((i - 1) % 10) + 1).padStart(3, "0")}`;
  seedDb.activity.push({
    id: `act_${String(i).padStart(3, "0")}`,
    type: i % 2 === 0 ? "update" : "create",
    entityType,
    entityId,
    message: `Seed activity ${i} for ${entityType} ${entityId}.`,
    createdAt: isoPlusMinutes(-7000 - i * 5),
  });
}


