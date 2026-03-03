import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // ✅ do NOT force content-type for GET
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFreelancers: builder.query({
      // ✅ public list
      query: () => ({
        url: "/api/users?userType=FREELANCER",
        method: "GET",
      }),
    }),
    getJobs: builder.query({
      // ✅ public list of business owner job posts
      query: () => ({
        url: "/api/jobs-service/jobs",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFreelancersQuery, useGetJobsQuery } = freelancerApi;