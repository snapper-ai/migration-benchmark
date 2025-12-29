import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { badRequest } from "../validation/common.js";
import { canTransition } from "../domain/transitions.js";
import { isBreached } from "../domain/sla.js";

export const incidentsRouter = Router();

function normalizeSort(sort) {
  const allowed = [
    "createdAt_desc",
    "createdAt_asc",
    "severity_asc",
    "severity_desc",
  ];
  return allowed.includes(sort) ? sort : "createdAt_desc";
}

const severityOrder = ["S1", "S2", "S3", "S4"];
function cmpSeverity(a, b) {
  return severityOrder.indexOf(a) - severityOrder.indexOf(b);
}

incidentsRouter.get("/", (req, res) => {
  const db = req.app.locals.db;
  const {
    status = "",
    severity = "",
    q = "",
    sort = "createdAt_desc",
    breached = "",
  } = req.query;

  const query = {
    status: String(status),
    severity: String(severity),
    q: String(q),
    sort: normalizeSort(String(sort)),
    breached: String(breached),
  };

  const qLower = query.q.trim().toLowerCase();
  let items = db.state.incidents;

  if (query.status) items = items.filter((i) => i.status === query.status);
  if (query.severity) items = items.filter((i) => i.severity === query.severity);
  if (query.breached === "true") items = items.filter((i) => isBreached(i));
  if (query.breached === "false") items = items.filter((i) => !isBreached(i));
  if (qLower) {
    items = items.filter((i) => {
      const hay = `${i.title}\n${i.description}\n${(i.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(qLower);
    });
  }

  items = [...items].sort((a, b) => {
    if (query.sort === "createdAt_desc") return new Date(b.createdAt) - new Date(a.createdAt);
    if (query.sort === "createdAt_asc") return new Date(a.createdAt) - new Date(b.createdAt);
    if (query.sort === "severity_asc") return cmpSeverity(a.severity, b.severity);
    if (query.sort === "severity_desc") return cmpSeverity(b.severity, a.severity);
    return 0;
  });

  return res.json(items);
});

incidentsRouter.post("/", requireRole(["responder", "admin"]), (req, res) => {
  const db = req.app.locals.db;
  const { title, description, severity, tags } = req.body || {};

  const fields = {};
  if (typeof title !== "string" || title.trim().length < 4) fields.title = "Title must be at least 4 characters";
  if (typeof description !== "string" || description.trim().length < 1) fields.description = "Description is required";
  if (!["S1", "S2", "S3", "S4"].includes(severity)) fields.severity = "Severity must be S1..S4";
  if (tags !== undefined && !Array.isArray(tags)) fields.tags = "Tags must be an array of strings";
  if (Array.isArray(tags) && tags.some((t) => typeof t !== "string")) fields.tags = "Tags must be strings";

  if (Object.keys(fields).length) return badRequest(res, "Invalid incident", fields);

  const now = new Date().toISOString();
  const incident = {
    id: db.ids.create("incident"),
    title: title.trim(),
    description: description.trim(),
    status: "triggered",
    severity,
    commanderId: null,
    createdAt: now,
    updatedAt: now,
    acknowledgedAt: null,
    resolvedAt: null,
    tags: Array.isArray(tags) ? tags : [],
  };
  db.state.incidents.unshift(incident);
  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "create",
    entityType: "incident",
    entityId: incident.id,
    message: `Incident created: ${incident.title}`,
    createdAt: now,
  });
  return res.status(201).json(incident);
});

incidentsRouter.get("/:id", (req, res) => {
  const db = req.app.locals.db;
  const incident = db.state.incidents.find((i) => i.id === req.params.id);
  if (!incident) return res.status(404).json({ message: "Not found" });
  return res.json(incident);
});

incidentsRouter.patch("/:id", requireRole(["responder", "admin"]), (req, res) => {
  const db = req.app.locals.db;
  const incident = db.state.incidents.find((i) => i.id === req.params.id);
  if (!incident) return res.status(404).json({ message: "Not found" });

  const patch = req.body || {};
  const fields = {};

  if (patch.title !== undefined && (typeof patch.title !== "string" || patch.title.trim().length < 4))
    fields.title = "Title must be at least 4 characters";
  if (patch.description !== undefined && (typeof patch.description !== "string" || patch.description.trim().length < 1))
    fields.description = "Description is required";
  if (patch.severity !== undefined && !["S1", "S2", "S3", "S4"].includes(patch.severity))
    fields.severity = "Severity must be S1..S4";
  if (patch.tags !== undefined && (!Array.isArray(patch.tags) || patch.tags.some((t) => typeof t !== "string")))
    fields.tags = "Tags must be an array of strings";
  if (patch.commanderId !== undefined && patch.commanderId !== null && typeof patch.commanderId !== "string")
    fields.commanderId = "commanderId must be a string or null";
  if (patch.commanderId !== undefined && typeof patch.commanderId === "string") {
    if (!db.state.users.some((u) => u.id === patch.commanderId)) fields.commanderId = "Unknown commanderId";
  }

  if (patch.status !== undefined) {
    if (!["triggered", "acknowledged", "investigating", "mitigated", "resolved"].includes(patch.status)) {
      fields.status = "Status must be one of triggered, acknowledged, investigating, mitigated, resolved";
    } else if (patch.status !== incident.status) {
      if (!canTransition(incident.status, patch.status)) {
        fields.status = `Invalid transition: ${incident.status} -> ${patch.status}`;
      }
    }
  }

  if (Object.keys(fields).length) return badRequest(res, "Invalid incident patch", fields);

  const now = new Date().toISOString();
  if (patch.title !== undefined) incident.title = patch.title.trim();
  if (patch.description !== undefined) incident.description = patch.description.trim();
  if (patch.severity !== undefined) incident.severity = patch.severity;
  if (patch.tags !== undefined) incident.tags = patch.tags;
  if (patch.commanderId !== undefined) incident.commanderId = patch.commanderId;
  if (patch.status !== undefined && patch.status !== incident.status) {
    const prev = incident.status;
    incident.status = patch.status;
    if (patch.status === "acknowledged") incident.acknowledgedAt = now;
    if (patch.status === "resolved") incident.resolvedAt = now;
    if (prev === "resolved" && patch.status !== "resolved") incident.resolvedAt = null;
  }
  incident.updatedAt = now;

  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "update",
    entityType: "incident",
    entityId: incident.id,
    message: `Incident updated: ${incident.title}`,
    createdAt: now,
  });

  return res.json(incident);
});

incidentsRouter.delete("/:id", requireRole(["responder", "admin"]), (req, res) => {
  const db = req.app.locals.db;
  const idx = db.state.incidents.findIndex((i) => i.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: "Not found" });
  const [incident] = db.state.incidents.splice(idx, 1);
  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "delete",
    entityType: "incident",
    entityId: incident.id,
    message: `Incident deleted: ${incident.title}`,
    createdAt: new Date().toISOString(),
  });
  return res.status(204).send();
});

incidentsRouter.post("/:id/reopen", requireRole(["responder", "admin"]), (req, res) => {
  const db = req.app.locals.db;
  const incident = db.state.incidents.find((i) => i.id === req.params.id);
  if (!incident) return res.status(404).json({ message: "Not found" });
  if (incident.status !== "resolved") {
    return badRequest(res, "Cannot reopen unless resolved", {
      status: "Incident must be resolved to reopen",
    });
  }
  const now = new Date().toISOString();
  incident.status = "investigating";
  incident.updatedAt = now;
  incident.resolvedAt = null;

  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "reopen",
    entityType: "incident",
    entityId: incident.id,
    message: `Incident reopened: ${incident.title}`,
    createdAt: now,
  });
  return res.json(incident);
});


