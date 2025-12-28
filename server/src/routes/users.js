import { Router } from "express";

export const usersRouter = Router();

usersRouter.get("/", (req, res) => {
  const db = req.app.locals.db;
  res.json(db.state.users);
});


