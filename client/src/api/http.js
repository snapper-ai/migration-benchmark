import { config } from "../config.js";
import { getCurrentUserId } from "../utils/currentUser.js";

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path, query) {
  const url = new URL(`${config.apiBaseUrl}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiFetch(path, { method = "GET", query, body } = {}) {
  const userId = getCurrentUserId();
  const url = buildUrl(path, query);
  const res = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      "x-ops-user-id": userId || "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, { status: res.status, payload });
  }

  return payload;
}


