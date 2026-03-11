// src/services/detailworkApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const detailworkApi = createApi({
  reducerPath: "detailworkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Job"],
  endpoints: (builder) => ({

    getAllJobs: builder.query({
      query: () => "/api/jobs-service/jobs",
      providesTags: ["Job"],
    }),

    getJobById: builder.query({
      query: (jobId) => `/api/jobs-service/jobs?jobId=${jobId}`,
      providesTags: (r, e, id) => [{ type: "Job", id }],
    }),

    getCategories: builder.query({
      query: () => "/api/jobs-service/categories",
    }),

    // ── Apply to a job ────────────────────────────────────────────────
    applyJob: builder.mutation({
      query: (jobId) => ({
        url: `/api/jobs-service/jobs/${jobId}/apply`,
        method: "POST",
      }),
    }),

  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetCategoriesQuery,
  useApplyJobMutation,
} = detailworkApi;