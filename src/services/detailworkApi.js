
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const detailworkApi = createApi({
  reducerPath: "detailworkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({

    // ── Get all jobs (used in FindWork page) ─────────────────────────
    getAllJobs: builder.query({
      query: () => "/api/jobs-service/jobs",
    }),

    // ── Get single job by ID (used in DetailWork page) ───────────────
    getJobById: builder.query({
      query: (jobId) => `/api/jobs-service/jobs?jobId=${jobId}`,
    }),

    // ── Get all categories ───────────────────────────────────────────
    getCategories: builder.query({
      query: () => "/api/jobs-service/categories",
    }),

  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetCategoriesQuery,
} = detailworkApi;