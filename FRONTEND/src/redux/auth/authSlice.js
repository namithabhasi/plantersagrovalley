import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
  error: null,
  isAuthModalOpen: false,
  authModalTab: "login"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload && action.payload.user !== undefined) {
        state.user = action.payload.user;
        if (action.payload.user) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        } else {
          localStorage.removeItem("user");
        }
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        } else if (action.payload.token === null) {
          localStorage.removeItem("token");
        }
      } else {
        state.user = action.payload;
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalTab = action.payload || "login";
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    }
  },
});

export const { setUser, clearUser, openAuthModal, closeAuthModal } = authSlice.actions;
export default authSlice.reducer;
