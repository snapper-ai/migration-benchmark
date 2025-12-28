import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../../api/http.js";
import { config } from "../../config.js";

export const fetchActivity = createAsyncThunk(
  "activity/fetch",
  async ({ forceError } = {}) => {
    const query =
      forceError === true || (forceError !== false && config.forceActivityError)
        ? { forceError: "true" }
        : undefined;
    return await apiFetch("/activity", { query });
  },
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivity.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchActivity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to load activity";
      });
  },
});

export default activitySlice.reducer;


