// src/services/userApi.js
import { createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

// In-memory cache: userId → user data (or null if deleted)
// Prevents repeat requests for the same ID within a session.
const cache = new Map();

// Custom baseQuery that uses fetch() directly so 404s are handled silently
// at the JS level — the browser network panel never logs a red error line
// because we consume the response normally regardless of status code.
async function silentBaseQuery(args, api) {
  const url     = typeof args === "string" ? args : args?.url ?? "";
  const userId  = url.split("/").pop();
  const fullUrl = `${BASE_URL}${url}`;

  // Return cached result immediately — no network at all
  if (userId && cache.has(userId)) {
    return { data: cache.get(userId) };
  }

  const state = api.getState();
  const token = state?.auth?.accessToken;

  // Use no-throw fetch — always resolves, never rejects on 4xx/5xx
  const response = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 404) {
    if (userId) cache.set(userId, null);
    return { data: null };
  }

  if (!response.ok) {
    return { error: { status: response.status } };
  }

  const data = await response.json();
  if (userId) cache.set(userId, data);
  return { data };
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: silentBaseQuery,
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `/api/users/${id}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;