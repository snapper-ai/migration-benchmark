import { formatDurationMinutes } from "./dates.js";

export const slaMinutesBySeverity = {
  S1: 60,
  S2: 240,
  S3: 1440,
  S4: 4320,
};

export function computeSla(incident, nowMs = Date.now()) {
  const targetMinutes = slaMinutesBySeverity[incident.severity] ?? 240;
  const createdAtMs = new Date(incident.createdAt).getTime();
  const ageMinutes = (nowMs - createdAtMs) / 60000;
  const remainingMinutes = targetMinutes - ageMinutes;
  const breached = incident.status !== "resolved" && remainingMinutes < 0;
  return {
    targetMinutes,
    remainingMinutes,
    breached,
    remainingLabel: breached ? "BREACHED" : formatDurationMinutes(remainingMinutes),
  };
}


