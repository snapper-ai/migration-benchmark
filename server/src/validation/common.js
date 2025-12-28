import { validationError } from "../responses/errors.js";

export function badRequest(res, message, fields = {}) {
  return res.status(400).json(validationError(message, fields));
}

export function forbidden(res, message, fields = {}) {
  return res.status(403).json(validationError(message, fields));
}

export function requireFields(body, spec) {
  const fields = {};
  for (const [k, rule] of Object.entries(spec)) {
    const v = body?.[k];
    const ok = rule(v);
    if (!ok) fields[k] = "Invalid value";
  }
  return Object.keys(fields).length ? fields : null;
}

export const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
export const isOneOf = (values) => (v) => values.includes(v);
export const isBoolean = (v) => typeof v === "boolean";
export const isNumber = (v) => typeof v === "number" && Number.isFinite(v);


