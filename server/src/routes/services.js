import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { badRequest } from "../validation/common.js";

export const servicesRouter = Router();

servicesRouter.get("/", (req, res) => {
  const db = req.app.locals.db;
  res.json(db.state.services);
});

servicesRouter.post("/", requireRole(["admin"]), (req, res) => {
  const db = req.app.locals.db;
  const { name, tier, ownerTeam, status } = req.body || {};

  const fields = {};
  if (typeof name !== "string" || name.trim().length < 2) fields.name = "Name must be at least 2 characters";
  if (![0, 1, 2, 3].includes(tier)) fields.tier = "Tier must be 0, 1, 2, or 3";
  if (typeof ownerTeam !== "string" || ownerTeam.trim().length < 2)
    fields.ownerTeam = "Owner team must be at least 2 characters";
  if (!["active", "degraded"].includes(status)) fields.status = "Status must be active or degraded";

  if (Object.keys(fields).length) return badRequest(res, "Invalid service", fields);

  const svc = {
    id: db.ids.create("service"),
    name: name.trim(),
    tier,
    ownerTeam: ownerTeam.trim(),
    status,
    createdAt: new Date().toISOString(),
  };
  db.state.services.unshift(svc);
  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "create",
    entityType: "service",
    entityId: svc.id,
    message: `Service created: ${svc.name}`,
    createdAt: new Date().toISOString(),
  });
  return res.status(201).json(svc);
});

servicesRouter.get("/:id", (req, res) => {
  const db = req.app.locals.db;
  const svc = db.state.services.find((s) => s.id === req.params.id);
  if (!svc) return res.status(404).json({ message: "Not found" });
  return res.json(svc);
});

servicesRouter.patch("/:id", requireRole(["admin"]), (req, res) => {
  const db = req.app.locals.db;
  const svc = db.state.services.find((s) => s.id === req.params.id);
  if (!svc) return res.status(404).json({ message: "Not found" });

  const patch = req.body || {};
  const fields = {};
  if (patch.name !== undefined && (typeof patch.name !== "string" || patch.name.trim().length < 2))
    fields.name = "Name must be at least 2 characters";
  if (patch.tier !== undefined && ![0, 1, 2, 3].includes(patch.tier))
    fields.tier = "Tier must be 0, 1, 2, or 3";
  if (
    patch.ownerTeam !== undefined &&
    (typeof patch.ownerTeam !== "string" || patch.ownerTeam.trim().length < 2)
  )
    fields.ownerTeam = "Owner team must be at least 2 characters";
  if (patch.status !== undefined && !["active", "degraded"].includes(patch.status))
    fields.status = "Status must be active or degraded";
  if (Object.keys(fields).length) return badRequest(res, "Invalid service patch", fields);

  if (patch.name !== undefined) svc.name = patch.name.trim();
  if (patch.tier !== undefined) svc.tier = patch.tier;
  if (patch.ownerTeam !== undefined) svc.ownerTeam = patch.ownerTeam.trim();
  if (patch.status !== undefined) svc.status = patch.status;

  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "update",
    entityType: "service",
    entityId: svc.id,
    message: `Service updated: ${svc.name}`,
    createdAt: new Date().toISOString(),
  });

  return res.json(svc);
});

servicesRouter.delete("/:id", requireRole(["admin"]), (req, res) => {
  const db = req.app.locals.db;
  const idx = db.state.services.findIndex((s) => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: "Not found" });
  const [svc] = db.state.services.splice(idx, 1);
  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "delete",
    entityType: "service",
    entityId: svc.id,
    message: `Service deleted: ${svc.name}`,
    createdAt: new Date().toISOString(),
  });
  return res.status(204).send();
});


