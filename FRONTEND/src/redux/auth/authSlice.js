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
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
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
