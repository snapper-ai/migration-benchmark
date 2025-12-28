import { validationError } from "../responses/errors.js";

export function requireUser(req, res, next) {
  const db = req.app.locals.db;
  const userId = req.header("x-ops-user-id");
  if (!userId) {
    return res.status(403).json(
      validationError("Missing user context", {
        userId: "x-ops-user-id header is required",
      }),
    );
  }
  const user = db.state.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(403).json(
      validationError("Unknown user", {
        userId: "No such user id",
      }),
    );
  }
  req.user = user;
  return next();
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json(
        validationError("Forbidden", {
          role: `Requires one of: ${allowedRoles.join(", ")}`,
        }),
      );
    }
    return next();
  };
}


