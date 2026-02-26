import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload || {};

      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;

      if (accessToken) localStorage.setItem("accessToken", accessToken);
      else localStorage.removeItem("accessToken");

      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      else localStorage.removeItem("refreshToken");
    },

    setUser: (state, action) => {
      state.user = action.payload || null;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setTokens, setUser, logout } = authSlice.actions;

// ✅ selectors
export const selectIsAuthed = (state) => Boolean(state.auth.accessToken);
export const selectAuthUser = (state) => state.auth.user;

export default authSlice.reducer;