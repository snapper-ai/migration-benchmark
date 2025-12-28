import { Router } from "express";

export const activityRouter = Router();

activityRouter.get("/", (req, res) => {
  const db = req.app.locals.db;
  if (String(req.query.forceError || "false") === "true") {
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Deterministic forced activity failure",
      },
    });
  }

  // Return newest-first (stable ordering based on timestamp + id)
  const items = [...db.state.activity].sort((a, b) => {
    const t = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (t !== 0) return t;
    return String(b.id).localeCompare(String(a.id));
  });
  return res.json(items);
});


