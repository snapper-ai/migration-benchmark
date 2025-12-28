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
      id: "usr_003",
      name: "Marta Silva",
      email: "marta.silva@opscc.local",
      role: "responder",
      team: "Core",
      onCall: true,
    },
    {
      id: "usr_004",
      name: "Jordan Lee",
      email: "jordan.lee@opscc.local",
      role: "viewer",
      team: "Support",
      onCall: false,
    },
    {
      id: "usr_005",
      name: "Sam Patel",
      email: "sam.patel@opscc.local",
      role: "viewer",
      team: "Data",
      onCall: false,
    },
    {
      id: "usr_006",
      name: "Chen Wei",
      email: "chen.wei@opscc.local",
      role: "responder",
      team: "Edge",
      onCall: false,
    },
  ],
  services: [
    {
      id: "svc_001",
      name: "Auth Gateway",
      tier: 0,
      ownerTeam: "Platform",
      status: "active",
      createdAt: isoPlusMinutes(-50000),
    },
    {
      id: "svc_002",
      name: "Payments API",
      tier: 1,
      ownerTeam: "Payments",
      status: "degraded",
      createdAt: isoPlusMinutes(-49000),
    },
    {
      id: "svc_003",
      name: "Search Indexer",
      tier: 2,
      ownerTeam: "Core",
      status: "active",
      createdAt: isoPlusMinutes(-48000),
    },
    {
      id: "svc_004",
      name: "Notification Fanout",
      tier: 2,
      ownerTeam: "Core",
      status: "active",
      createdAt: isoPlusMinutes(-47000),
    },
    {
      id: "svc_005",
      name: "Mobile Sync",
      tier: 3,
      ownerTeam: "Core",
      status: "active",
      createdAt: isoPlusMinutes(-46000),
    },
    {
      id: "svc_006",
      name: "Data Lake Writer",
      tier: 1,
      ownerTeam: "Data",
      status: "active",
      createdAt: isoPlusMinutes(-45000),
    },
    {
      id: "svc_007",
      name: "Edge Router",
      tier: 0,
      ownerTeam: "Edge",
      status: "active",
      createdAt: isoPlusMinutes(-44000),
    },
    {
      id: "svc_008",
      name: "Config Service",
      tier: 1,
      ownerTeam: "Platform",
      status: "degraded",
      createdAt: isoPlusMinutes(-43000),
    },
  ],
  incidents: [],
  comments: [],
  activity: [],
};

// Deterministic incident generation (no randomness).
const severities = ["S1", "S2", "S3", "S4"];
const statuses = ["triggered", "acknowledged", "investigating", "mitigated", "resolved"];
const tagsPool = ["db", "latency", "timeout", "deploy", "capacity", "edge", "auth", "payments"];

for (let i = 1; i <= 50; i += 1) {
  const serviceId = `svc_${String(((i - 1) % 8) + 1).padStart(3, "0")}`;
  const severity = severities[(i - 1) % severities.length];
  const status = statuses[(i - 1) % statuses.length];
  const createdAt = isoPlusMinutes(-10000 - i * 17);
  const updatedAt = isoPlusMinutes(-9990 - i * 13);
  const commanderId = i % 4 === 0 ? "usr_001" : i % 7 === 0 ? "usr_003" : null;
  const incidentId = `inc_${String(i).padStart(3, "0")}`;
  const acknowledgedAt = status === "triggered" ? null : isoPlusMinutes(-9998 - i * 13);
  const resolvedAt = status === "resolved" ? isoPlusMinutes(-9988 - i * 11) : null;

  seedDb.incidents.push({
    id: incidentId,
    serviceId,
    title: `Incident ${incidentId} — ${severity} ${serviceId}`,
    description: `Deterministic incident seed for ${serviceId}. This text is intentionally mid-realistic.`,
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

for (let i = 1; i <= 30; i += 1) {
  const incidentId = `inc_${String(((i - 1) % 50) + 1).padStart(3, "0")}`;
  const authorId = `usr_${String(((i - 1) % 6) + 1).padStart(3, "0")}`;
  seedDb.comments.push({
    id: `cmt_${String(i).padStart(3, "0")}`,
    incidentId,
    authorId,
    body: `Comment ${i} on ${incidentId}.`,
    createdAt: isoPlusMinutes(-8000 - i * 9),
  });
}

for (let i = 1; i <= 20; i += 1) {
  const entityType = i % 3 === 0 ? "service" : "incident";
  const entityId =
    entityType === "service"
      ? `svc_${String(((i - 1) % 8) + 1).padStart(3, "0")}`
      : `inc_${String(((i - 1) % 50) + 1).padStart(3, "0")}`;
  seedDb.activity.push({
    id: `act_${String(i).padStart(3, "0")}`,
    type: i % 2 === 0 ? "update" : "create",
    entityType,
    entityId,
    message: `Seed activity ${i} for ${entityType} ${entityId}.`,
    createdAt: isoPlusMinutes(-7000 - i * 5),
  });
}


