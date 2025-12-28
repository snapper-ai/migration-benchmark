import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { config } from "./config.js";
import { AppShell } from "./components/AppShell.jsx";
import { GlobalErrorBoundary } from "./components/GlobalErrorBoundary.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ServiceDetailPage from "./pages/ServiceDetailPage.jsx";
import IncidentsPage from "./pages/IncidentsPage.jsx";
import IncidentDetailPage from "./pages/IncidentDetailPage.jsx";
import RespondersPage from "./pages/RespondersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

export default function App() {
  React.useEffect(() => {
    document.title = config.appName;
  }, []);

  return (
    <GlobalErrorBoundary>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/responders" element={<RespondersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </GlobalErrorBoundary>
  );
}


