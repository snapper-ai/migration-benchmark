export const slaMinutesBySeverity = {
  S1: 60,
  S2: 240,
  S3: 1440,
  S4: 4320,
};

export function isBreached(incident, nowMs = Date.now()) {
  const target = slaMinutesBySeverity[incident.severity] ?? 240;
  const createdAtMs = new Date(incident.createdAt).getTime();
  const ageMinutes = (nowMs - createdAtMs) / 60000;
  return incident.status !== "resolved" && ageMinutes > target;
}


