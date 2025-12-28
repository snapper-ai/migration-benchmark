/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { apiFetch } from "../api/http.js";

const AppStateContext = React.createContext(null);
const AppActionsContext = React.createContext(null);

const initialState = {
  services: { items: [], status: "idle", error: null },
  incidents: {
    items: [],
    status: "idle",
    error: null,
    query: {
      serviceId: "",
      status: "",
      severity: "",
      q: "",
      sort: "createdAt_desc",
      breached: "",
    },
  },
  users: { items: [], status: "idle", error: null },
  activity: { items: [], status: "idle", error: null },
  comments: { byIncidentId: {}, status: "idle", error: null },
};

function reducer(state, action) {
  switch (action.type) {
    case "services/loading":
      return { ...state, services: { ...state.services, status: "loading", error: null } };
    case "services/loaded":
      return { ...state, services: { items: action.payload, status: "succeeded", error: null } };
    case "services/error":
      return { ...state, services: { ...state.services, status: "failed", error: action.error } };

    case "incidents/setQuery":
      return { ...state, incidents: { ...state.incidents, query: { ...state.incidents.query, ...action.payload } } };
    case "incidents/loading":
      return { ...state, incidents: { ...state.incidents, status: "loading", error: null } };
    case "incidents/loaded":
      return { ...state, incidents: { ...state.incidents, items: action.payload, status: "succeeded", error: null } };
    case "incidents/error":
      return { ...state, incidents: { ...state.incidents, status: "failed", error: action.error } };

    case "users/loading":
      return { ...state, users: { ...state.users, status: "loading", error: null } };
    case "users/loaded":
      return { ...state, users: { items: action.payload, status: "succeeded", error: null } };
    case "users/error":
      return { ...state, users: { ...state.users, status: "failed", error: action.error } };

    case "activity/loading":
      return { ...state, activity: { ...state.activity, status: "loading", error: null } };
    case "activity/loaded":
      return { ...state, activity: { items: action.payload, status: "succeeded", error: null } };
    case "activity/error":
      return { ...state, activity: { ...state.activity, status: "failed", error: action.error } };

    case "comments/loading":
      return { ...state, comments: { ...state.comments, status: "loading", error: null } };
    case "comments/loadedForIncident":
      return {
        ...state,
        comments: {
          ...state.comments,
          status: "succeeded",
          error: null,
          byIncidentId: { ...state.comments.byIncidentId, [action.incidentId]: action.payload },
        },
      };
    case "comments/error":
      return { ...state, comments: { ...state.comments, status: "failed", error: action.error } };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const actions = React.useMemo(() => {
    async function loadServices() {
      dispatch({ type: "services/loading" });
      try {
        const data = await apiFetch("/services");
        dispatch({ type: "services/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "services/error", error: e.message || "Failed to load services" });
      }
    }

    async function createService(payload) {
      const created = await apiFetch("/services", { method: "POST", body: payload });
      await loadServices();
      return created;
    }

    async function patchService(id, patch) {
      const updated = await apiFetch(`/services/${id}`, { method: "PATCH", body: patch });
      await loadServices();
      return updated;
    }

    async function deleteService(id) {
      await apiFetch(`/services/${id}`, { method: "DELETE" });
      await loadServices();
    }

    function setIncidentQuery(patch) {
      dispatch({ type: "incidents/setQuery", payload: patch });
    }

    async function loadIncidents(query) {
      dispatch({ type: "incidents/loading" });
      try {
        const data = await apiFetch("/incidents", { query });
        dispatch({ type: "incidents/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "incidents/error", error: e.message || "Failed to load incidents" });
      }
    }

    async function createIncident(payload) {
      const created = await apiFetch("/incidents", { method: "POST", body: payload });
      await loadIncidents(state.incidents.query);
      return created;
    }

    async function patchIncident(id, patch) {
      const updated = await apiFetch(`/incidents/${id}`, { method: "PATCH", body: patch });
      await loadIncidents(state.incidents.query);
      return updated;
    }

    async function reopenIncident(id) {
      const updated = await apiFetch(`/incidents/${id}/reopen`, { method: "POST" });
      await loadIncidents(state.incidents.query);
      return updated;
    }

    async function loadUsers() {
      dispatch({ type: "users/loading" });
      try {
        const data = await apiFetch("/users");
        dispatch({ type: "users/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "users/error", error: e.message || "Failed to load users" });
      }
    }

    async function loadActivity({ forceError } = {}) {
      dispatch({ type: "activity/loading" });
      try {
        const query = forceError ? { forceError: "true" } : undefined;
        const data = await apiFetch("/activity", { query });
        dispatch({ type: "activity/loaded", payload: data });
      } catch (e) {
        dispatch({ type: "activity/error", error: e.message || "Failed to load activity" });
      }
    }

    async function loadComments(incidentId) {
      dispatch({ type: "comments/loading" });
      try {
        const data = await apiFetch(`/incidents/${incidentId}/comments`);
        dispatch({ type: "comments/loadedForIncident", incidentId, payload: data });
      } catch (e) {
        dispatch({ type: "comments/error", error: e.message || "Failed to load comments" });
      }
    }

    async function addComment(incidentId, body) {
      const created = await apiFetch(`/incidents/${incidentId}/comments`, {
        method: "POST",
        body: { body },
      });
      await loadComments(incidentId);
      return created;
    }

    return {
      loadServices,
      createService,
      patchService,
      deleteService,
      setIncidentQuery,
      loadIncidents,
      createIncident,
      patchIncident,
      reopenIncident,
      loadUsers,
      loadActivity,
      loadComments,
      addComment,
    };
    // We intentionally exclude `state` to keep actions stable; actions call loadIncidents with current state where needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const v = React.useContext(AppStateContext);
  if (!v) throw new Error("useAppState must be used within AppProvider");
  return v;
}

export function useAppActions() {
  const v = React.useContext(AppActionsContext);
  if (!v) throw new Error("useAppActions must be used within AppProvider");
  return v;
}


