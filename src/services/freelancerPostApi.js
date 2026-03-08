// src/services/freelancerPostApi.js
import { createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

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

  if (!response.ok) return { data: null };

  const data = await response.json();
  return { data };
}

export const freelancerPostApi = createApi({
  reducerPath: "freelancerPostApi",
  baseQuery: silentBaseQuery,
  endpoints: (builder) => ({

    getServices: builder.query({
      // Fetch page 0 with size=1 first to read totalElements,
      // then fetch the full list in one request — no hardcoded size.
      async queryFn(_, api) {
        const state   = api.getState();
        const token   = state?.auth?.accessToken;
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        try {
          // Step 1 — probe to get totalElements
          const probe = await fetch(
            `${BASE_URL}/api/jobs-service/services?page=0&size=1`,
            { headers }
          );
          if (!probe.ok) return { data: null };
          const probeData = await probe.json();

          const total =
            probeData?.totalElements ??
            probeData?.data?.totalElements ??
            probeData?.data?.total ??
            50; // safe fallback if backend doesn't expose total

          // Step 2 — fetch all records at once
          const full = await fetch(
            `${BASE_URL}/api/jobs-service/services?page=0&size=${total}`,
            { headers }
          );
          if (!full.ok) return { data: null };
          const data = await full.json();
          return { data };
        } catch (e) {
          return { error: e.message };
        }
      },
    }),

    getServiceById: builder.query({
      query: (serviceId) => `/api/jobs-service/services/${serviceId}`,
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery } = freelancerPostApi;