export const INCIDENT_STATUSES = [
  "triggered",
  "acknowledged",
  "investigating",
  "mitigated",
  "resolved",
];

export const INCIDENT_SEVERITIES = ["S1", "S2", "S3", "S4"];

export function isIncidentStatus(value) {
  return INCIDENT_STATUSES.includes(value);
}

export function isIncidentSeverity(value) {
  return INCIDENT_SEVERITIES.includes(value);
}


