import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../redux/dashboard/dashboardSlice";
import authReducer from "../redux/auth/authSlice";
import searchReducer from "../redux/search/searchSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    auth: authReducer,
    search: searchReducer,
  },
});

export default store;