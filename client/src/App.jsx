import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { config } from "./config.js";
import { AppShell } from "./components/AppShell.jsx";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import IncidentsPage from "./pages/IncidentsPage.jsx";
import IncidentDetailPage from "./pages/IncidentDetailPage.jsx";
import UtilityPage from "./pages/UtilityPage.jsx";

export default function App() {
  React.useEffect(() => {
    document.title = config.appName;
  }, []);

  return (
    <GlobalErrorBoundary>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/settings" element={<UtilityPage mode="settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </GlobalErrorBoundary>
  );
}


