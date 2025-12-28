import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../../api/http.js";

export const fetchIncidents = createAsyncThunk(
  "incidents/fetch",
  async (query) => {
    return await apiFetch("/incidents", { query });
  },
);

export const fetchIncidentById = createAsyncThunk(
  "incidents/fetchById",
  async (id) => {
    return await apiFetch(`/incidents/${id}`);
  },
);

export const createIncident = createAsyncThunk(
  "incidents/create",
  async (payload) => {
    return await apiFetch("/incidents", { method: "POST", body: payload });
  },
);

export const updateIncident = createAsyncThunk(
  "incidents/update",
  async ({ id, patch }) => {
    return await apiFetch(`/incidents/${id}`, { method: "PATCH", body: patch });
  },
);

export const deleteIncident = createAsyncThunk(
  "incidents/delete",
  async (id) => {
    await apiFetch(`/incidents/${id}`, { method: "DELETE" });
    return id;
  },
);

export const reopenIncident = createAsyncThunk(
  "incidents/reopen",
  async (id) => {
    return await apiFetch(`/incidents/${id}/reopen`, { method: "POST" });
  },
);

const incidentsSlice = createSlice({
  name: "incidents",
  initialState: {
    items: [],
    byId: {},
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
  reducers: {
    setIncidentQuery(state, action) {
      state.query = { ...state.query, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.byId = Object.fromEntries(action.payload.map((i) => [i.id, i]));
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to load incidents";
      })
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.byId[action.payload.id] = action.payload;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.byId[action.payload.id] = action.payload;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        const updated = action.payload;
        state.byId[updated.id] = updated;
        const idx = state.items.findIndex((i) => i.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
      })
      .addCase(deleteIncident.fulfilled, (state, action) => {
        delete state.byId[action.payload];
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(reopenIncident.fulfilled, (state, action) => {
        const updated = action.payload;
        state.byId[updated.id] = updated;
        const idx = state.items.findIndex((i) => i.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
      });
  },
});

export const { setIncidentQuery } = incidentsSlice.actions;
export default incidentsSlice.reducer;


