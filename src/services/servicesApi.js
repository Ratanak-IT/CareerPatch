import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    // ✅ public list (if backend allows)
    getAllServices: builder.query({
      query: () => "/api/jobs-service/services",
      providesTags: ["Service"],
    }),

    // ✅ my services (requires login)
    getMyServices: builder.query({
      query: () => "/api/jobs-service/services/own-service",
      providesTags: ["Service"],
    }),

    // ✅ service detail
    getServiceById: builder.query({
      query: (id) => `/api/jobs-service/services/${id}`,
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetMyServicesQuery,
  useGetServiceByIdQuery,
} = serviceApi;