import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

function normalizeJob(j) {
  return {
    ...j,
    imageUrls: Array.isArray(j?.jobImages)
      ? j.jobImages
      : Array.isArray(j?.imageUrls)
      ? j.imageUrls
      : [],
    categoryId: j?.category?.id || j?.categoryId || null,
    categoryName: j?.category?.name || j?.categoryName || null,
  };
}

function normalizeList(res) {
  const raw = res?.data ?? res;
  const list = Array.isArray(raw) ? raw : raw?.content ?? [];
  return list.map(normalizeJob);
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Job", "JobBookmark"],
  endpoints: (builder) => ({
    // jobs
    getAllJobs: builder.query({
      query: () => "/api/jobs-service/jobs",
      providesTags: ["Job"],
      transformResponse: normalizeList,
    }),
    getJobById: builder.query({
      query: (id) => `/api/jobs-service/jobs/${id}`,
      providesTags: (r, e, id) => [{ type: "Job", id }],
      transformResponse: normalizeJob,
    }),
    getMyJobs: builder.query({
      query: () => "/api/jobs-service/jobs/get-own-jobs",
      providesTags: ["Job"],
      transformResponse: normalizeList,
    }),

    // job bookmarks
    getJobBookmarks: builder.query({
      query: () => "/api/jobs-service/job-bookmark",
      providesTags: ["JobBookmark"],
      transformResponse: normalizeList,
    }),
    addJobBookmark: builder.mutation({
      query: (jobId) => ({
        url: `/api/jobs-service/job-bookmark/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: ["JobBookmark"],
    }),
    removeJobBookmark: builder.mutation({
      query: (jobId) => ({
        url: `/api/jobs-service/job-bookmark/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobBookmark"],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetMyJobsQuery,

  useGetJobBookmarksQuery,
  useAddJobBookmarkMutation,
  useRemoveJobBookmarkMutation,
} = jobsApi;