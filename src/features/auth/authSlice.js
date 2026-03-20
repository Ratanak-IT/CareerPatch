

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  secureSet, secureGet, secureRemove,
  secureCacheSet, secureCacheGet, secureCacheRemove,
} from "../../utils/secureStorage";

const KEY_AT  = "cp_at";
const KEY_RT  = "cp_rt";
const KEY_USR = "cp_meta";

function sanitizeUser(user) {
  if (!user) return null;
  const {  ...safe } = user;
  return safe;
}


const initialState = {
  accessToken:  secureCacheGet(KEY_AT)  || null,
  refreshToken: secureCacheGet(KEY_RT)  || null,
  user:         secureCacheGet(KEY_USR) || null,
  hydrated:     false, 
};

export const hydrateAuth = createAsyncThunk("auth/hydrate", async () => {
  const [at, rt, user] = await Promise.all([
    secureGet(KEY_AT),
    secureGet(KEY_RT),
    secureGet(KEY_USR),
  ]);
 
  if (at)   secureCacheSet(KEY_AT,  at);
  if (rt)   secureCacheSet(KEY_RT,  rt);
  if (user) secureCacheSet(KEY_USR, user);
  return { accessToken: at, refreshToken: rt, user };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload || {};
      state.accessToken  = accessToken  || null;
      state.refreshToken = refreshToken || null;

      if (accessToken) {
        secureSet(KEY_AT, accessToken);
        secureCacheSet(KEY_AT, accessToken);
      } else {
        secureRemove(KEY_AT);
        secureCacheRemove(KEY_AT);
      }

      if (refreshToken) {
        secureSet(KEY_RT, refreshToken);
        secureCacheSet(KEY_RT, refreshToken);
      } else {
        secureRemove(KEY_RT);
        secureCacheRemove(KEY_RT);
      }
    },


    setUser: (state, action) => {
      const safe = sanitizeUser(action.payload);
      state.user = safe;

      if (safe) {
        secureSet(KEY_USR, safe);
        secureCacheSet(KEY_USR, safe);
      } else {
        secureRemove(KEY_USR);
        secureCacheRemove(KEY_USR);
      }
    },


    logout: (state) => {
      state.accessToken  = null;
      state.refreshToken = null;
      state.user         = null;
      state.hydrated     = false;

  
      secureRemove(KEY_AT);
      secureRemove(KEY_RT);
      secureRemove(KEY_USR);

      secureCacheRemove(KEY_AT);
      secureCacheRemove(KEY_RT);
      secureCacheRemove(KEY_USR);

 
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
    },
  },

 
  extraReducers: (builder) => {
    builder.addCase(hydrateAuth.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      if (accessToken)  state.accessToken  = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
      if (user)         state.user         = user;
      state.hydrated = true;
    });
    builder.addCase(hydrateAuth.rejected, (state) => {
      state.hydrated = true;
    });
  },
});

export const { setTokens, setUser, logout } = authSlice.actions;

export const selectIsAuthed  = (state) => Boolean(state.auth.accessToken);
export const selectAuthUser  = (state) => state.auth.user;
export const selectHydrated  = (state) => state.auth.hydrated;

export default authSlice.reducer;