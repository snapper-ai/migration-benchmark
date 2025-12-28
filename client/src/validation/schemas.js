import { z } from "zod";

export const ServiceTier = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);
export const ServiceStatus = z.union([z.literal("active"), z.literal("degraded")]);

export const IncidentStatus = z.union([
  z.literal("triggered"),
  z.literal("acknowledged"),
  z.literal("investigating"),
  z.literal("mitigated"),
  z.literal("resolved"),
]);

export const IncidentSeverity = z.union([
  z.literal("S1"),
  z.literal("S2"),
  z.literal("S3"),
  z.literal("S4"),
]);

export const createServiceSchema = z.object({
  name: z.string().min(2),
  tier: ServiceTier,
  ownerTeam: z.string().min(2),
  status: ServiceStatus,
});

export const createIncidentSchema = z.object({
  serviceId: z.string().min(1),
  title: z.string().min(4),
  description: z.string().min(1),
  severity: IncidentSeverity,
  tags: z.array(z.string()).default([]),
});


