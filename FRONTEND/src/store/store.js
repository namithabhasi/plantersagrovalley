import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../redux/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

export default store;