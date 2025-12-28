import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../../api/http.js";

export const fetchCommentsForIncident = createAsyncThunk(
  "comments/fetchForIncident",
  async (incidentId) => {
    return await apiFetch(`/incidents/${incidentId}/comments`);
  },
);

export const createComment = createAsyncThunk(
  "comments/create",
  async ({ incidentId, body }) => {
    return await apiFetch(`/incidents/${incidentId}/comments`, {
      method: "POST",
      body: { body },
    });
  },
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    byIncidentId: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsForIncident.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCommentsForIncident.fulfilled, (state, action) => {
        state.status = "succeeded";
        const incidentId = action.meta.arg;
        state.byIncidentId[incidentId] = action.payload;
      })
      .addCase(fetchCommentsForIncident.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to load comments";
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const c = action.payload;
        const list = state.byIncidentId[c.incidentId] || [];
        state.byIncidentId[c.incidentId] = [c, ...list];
      });
  },
});

export default commentsSlice.reducer;


