export const roles = ["viewer", "responder", "admin"];

export function canManageIncidents(role) {
  return role === "responder" || role === "admin";
}

export function canManageComments(role) {
  return role === "responder" || role === "admin";
}

export function canManageServices(role) {
  return role === "admin";
}


