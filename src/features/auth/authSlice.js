import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  })(),
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
      if (state.user) localStorage.setItem("authUser", JSON.stringify(state.user));
      else localStorage.removeItem("authUser");
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
    },
  },
});

export const { setTokens, setUser, logout } = authSlice.actions;

export const selectIsAuthed = (state) => Boolean(state.auth.accessToken);
export const selectAuthUser = (state) => state.auth.user;

export default authSlice.reducer;