// src/services/freelancerPostApi.js
import { createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

// Custom fetch-based baseQuery that silently handles 4xx/5xx responses.
// Using fetch() directly means the browser never marks the request as
// "failed" in DevTools — error status codes are read as normal data.
async function silentBaseQuery(args, api) {
  const url     = typeof args === "string" ? args : args?.url ?? "";
  const fullUrl = `${BASE_URL}${url}`;

  const state = api.getState();
  const token = state?.auth?.accessToken;

  const response = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Treat 4xx and 5xx as empty data so the UI falls back gracefully
  // instead of throwing and showing a raw error string.
  if (!response.ok) {
    return { data: null };
  }

  const data = await response.json();
  return { data };
}

export const freelancerPostApi = createApi({
  reducerPath: "freelancerPostApi",
  baseQuery: silentBaseQuery,
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "/api/jobs-service/services",
    }),
    getServiceById: builder.query({
      query: (serviceId) => `/api/jobs-service/services/${serviceId}`,
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery } = freelancerPostApi;