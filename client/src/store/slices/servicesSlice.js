import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../../api/http.js";

export const fetchServices = createAsyncThunk("services/fetch", async () => {
  return await apiFetch("/services");
});

export const createService = createAsyncThunk(
  "services/create",
  async (payload) => {
    return await apiFetch("/services", { method: "POST", body: payload });
  },
);

export const updateService = createAsyncThunk(
  "services/update",
  async ({ id, patch }) => {
    return await apiFetch(`/services/${id}`, { method: "PATCH", body: patch });
  },
);

export const deleteService = createAsyncThunk("services/delete", async (id) => {
  await apiFetch(`/services/${id}`, { method: "DELETE" });
  return id;
});

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to load services";
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export default servicesSlice.reducer;


