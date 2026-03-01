import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, setUser, logout } from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL;

// Base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;

    if (token) headers.set("Authorization", `Bearer ${token}`);

    // Only set content-type for JSON requests
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    // ---------- LOGIN ----------
    login: builder.mutation({
      query: (body) => ({
        url: "/api/users/login",
        method: "POST",
        body,
      }),

      // Save tokens, then fetch /me and store user
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // 1) save tokens
          dispatch(
            setTokens({
              accessToken: data?.accessToken || null,
              refreshToken: data?.refreshToken || null,
            })
          );

          // 2) fetch /me (use accessToken directly to avoid timing issues)
          const res = await fetch(`${BASE_URL}/api/users/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data?.accessToken}`,
            },
          });

          const meJson = await res.json();
          // API format: { success, message, data: {...user} }
          if (meJson?.data) {
            dispatch(setUser(meJson.data));
          }
        } catch (err) {
          console.log("LOGIN ERROR (authApi):", err);
        }
      },
    }),

    // ---------- REGISTER FREELANCER ----------
    registerFreelancer: builder.mutation({
      query: (body) => ({
        url: "/api/users/register-freelancer",
        method: "POST",
        body,
      }),
    }),

    // ---------- REGISTER BUSINESS OWNER ----------
    registerBusinessOwner: builder.mutation({
      query: (body) => ({
        url: "/api/users/register-business-owner",
        method: "POST",
        body,
      }),
    }),

    // ---------- ME ----------
    me: builder.query({
      query: () => ({
        url: "/api/users/me",
        method: "GET",
      }),
      // If /me returns 401 -> logout
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) dispatch(setUser(data.data));
        } catch (err) {
          // if token invalid / expired
          if (err?.error?.status === 401 || err?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterFreelancerMutation,
  useRegisterBusinessOwnerMutation,
  useMeQuery,
  useLazyMeQuery,
} = authApi;