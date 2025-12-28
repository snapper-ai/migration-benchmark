const STORAGE_KEY = "opscc.currentUserId";
const DEFAULT_USER_ID = "usr_001";

export function getCurrentUserId() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v) return v;
    window.localStorage.setItem(STORAGE_KEY, DEFAULT_USER_ID);
    return DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
}

export function setCurrentUserId(userId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, userId);
  } catch {
    // ignore
  }
}


