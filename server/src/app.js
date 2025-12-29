import express from "express";
import cors from "cors";
import { seedDb } from "./seed.js";
import { createDb } from "./db.js";
import { requireUser } from "./middleware/auth.js";
import { incidentsRouter } from "./routes/incidents.js";
import { usersRouter } from "./routes/users.js";
import { activityRouter } from "./routes/activity.js";

export function createApp({ seed = seedDb } = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const db = createDb(seed);
  app.locals.db = db;

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api", requireUser);
  app.use("/api/incidents", incidentsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/activity", activityRouter);

  return app;
}


