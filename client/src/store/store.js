import { configureStore } from "@reduxjs/toolkit";
import servicesReducer from "./slices/servicesSlice.js";
import incidentsReducer from "./slices/incidentsSlice.js";
import usersReducer from "./slices/usersSlice.js";
import activityReducer from "./slices/activitySlice.js";
import commentsReducer from "./slices/commentsSlice.js";

export function createAppStore() {
  return configureStore({
    reducer: {
      services: servicesReducer,
      incidents: incidentsReducer,
      users: usersReducer,
      activity: activityReducer,
      comments: commentsReducer,
    },
  });
}

export const store = createAppStore();


