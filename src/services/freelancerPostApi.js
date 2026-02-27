import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const freelancerPostApi = createApi({
  reducerPath: "freelancerPostApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    // GET ALL SERVICES
    getServices: builder.query({
      // your endpoint
      query: () => "/api/jobs-service/services",
    }),
     getServiceById: builder.query({
      query: (serviceId) => `/api/jobs-service/services/${serviceId}`,
    }),
  }),
});

export const { useGetServicesQuery , useGetServiceByIdQuery } = freelancerPostApi;