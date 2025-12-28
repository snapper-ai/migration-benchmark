export const config = {
  appName: import.meta.env.VITE_APP_NAME || "Ops Command Center",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  enableAnalytics: String(import.meta.env.VITE_ENABLE_ANALYTICS || "false") === "true",
  forceActivityError:
    String(import.meta.env.VITE_FORCE_ACTIVITY_ERROR || "false") === "true",
};


