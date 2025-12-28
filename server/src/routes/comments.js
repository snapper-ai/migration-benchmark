import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { badRequest } from "../validation/common.js";

export const commentsRouter = Router();

commentsRouter.get("/:id/comments", (req, res) => {
  const db = req.app.locals.db;
  const incidentId = req.params.id;
  const incident = db.state.incidents.find((i) => i.id === incidentId);
  if (!incident) return res.status(404).json({ message: "Not found" });
  const list = db.state.comments
    .filter((c) => c.incidentId === incidentId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json(list);
});

commentsRouter.post("/:id/comments", requireRole(["responder", "admin"]), (req, res) => {
  const db = req.app.locals.db;
  const incidentId = req.params.id;
  const incident = db.state.incidents.find((i) => i.id === incidentId);
  if (!incident) return res.status(404).json({ message: "Not found" });

  const { body } = req.body || {};
  if (typeof body !== "string" || body.trim().length < 1) {
    return badRequest(res, "Invalid comment", { body: "Comment body is required" });
  }

  const now = new Date().toISOString();
  const c = {
    id: db.ids.create("comment"),
    incidentId,
    authorId: req.user.id,
    body: body.trim(),
    createdAt: now,
  };
  db.state.comments.unshift(c);
  db.state.activity.unshift({
    id: db.ids.create("activity"),
    type: "comment",
    entityType: "incident",
    entityId: incidentId,
    message: `Comment added to ${incidentId} by ${req.user.name}`,
    createdAt: now,
  });
  return res.status(201).json(c);
});


