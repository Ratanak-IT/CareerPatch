// src/services/serviceApi.js (or your current file path)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Wraps fetchBaseQuery to silently swallow 403 responses (freelancers
// hitting bookmark endpoints that require BUSINESS_OWNER role).
// Returns empty array data so the UI shows "No bookmarks" instead of erroring.
function make403SilentQuery(baseQueryFn) {
  return async (args, api, extraOptions) => {
    const result = await baseQueryFn(args, api, extraOptions);
    if (result?.error?.status === 403) {
      return { data: [] };
    }
    return result;
  };
}

const BASE_URL = import.meta.env.VITE_API_URL;

// ─────────────────────────────────────────────────────────────
// Normalizers (ONLY for services/jobs lists)
// ─────────────────────────────────────────────────────────────
export function normalizeService(s) {
  return {
    ...s,
    createdAt: s?.createdAt ?? s?.createAt ?? s?.created_at,
    imageUrls: Array.isArray(s?.jobImages)
      ? s.jobImages
      : Array.isArray(s?.imageUrls)
      ? s.imageUrls
      : [],
  };
}

function normalizeList(res) {
  let raw = res;

  if (Array.isArray(res?.content)) raw = res.content;
  else if (Array.isArray(res?.data?.content)) raw = res.data.content;
  else if (Array.isArray(res?.data)) raw = res.data;
  else if (Array.isArray(res)) raw = res;
  else return [];

  return raw.map(normalizeService);
}

function normalizeBookmarkList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.content)) return res.content;
  if (Array.isArray(res?.data?.content)) return res.data.content;
  return [];
}

// ─────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────
export const serviceApi = createApi({
  reducerPath: "serviceApi",

  baseQuery: make403SilentQuery(fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();

      const token =
        state?.auth?.accessToken ||
        state?.auth?.token ||
        localStorage.getItem("ACCESS_TOKEN") ||
        localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  })),

  tagTypes: ["Service", "ServiceBookmark", "JobBookmark"],

  endpoints: (builder) => ({
    // ───────────── SERVICES ─────────────
    getAllServices: builder.query({
      query: () => "/api/jobs-service/services",
      providesTags: ["Service"],
      transformResponse: normalizeList,
    }),

    getMyServices: builder.query({
      query: () => "/api/jobs-service/services/own-service",
      providesTags: ["Service"],
      transformResponse: normalizeList,
    }),

    getServiceById: builder.query({
      query: (id) => `/api/jobs-service/services/${id}`,
      transformResponse: normalizeService,
    }),

    createService: builder.mutation({
      query: (body) => ({
        url: "/api/jobs-service/services/create-new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    updateService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/jobs-service/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/api/jobs-service/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // ───────────── JOBS ─────────────
    getAllJobs: builder.query({
      query: () => "/api/jobs-service/jobs",
      providesTags: ["Service"],
      transformResponse: normalizeList,
    }),

    getMyJobs: builder.query({
      query: () => "/api/jobs-service/jobs/get-own-jobs",
      providesTags: ["Service"],
      transformResponse: normalizeList,
    }),

    getJobById: builder.query({
      query: (id) => `/api/jobs-service/jobs/${id}`,
      transformResponse: normalizeService,
    }),

    createJob: builder.mutation({
      query: (body) => ({
        url: "/api/jobs-service/jobs/create-job",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    updateJob: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/jobs-service/jobs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/api/jobs-service/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // ───────────── CATEGORIES ─────────────
    getCategories: builder.query({
      query: () => "/api/jobs-service/categories",
      transformResponse: (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.content)) return res.content;
        return [];
      },
    }),

    // ───────────── SERVICE BOOKMARKS (✅ FIXED) ─────────────
    // Postman: /api/jobs-service/service-bookmark :contentReference[oaicite:1]{index=1}
    getServiceBookmarks: builder.query({
      query: () => "/api/jobs-service/service-bookmark",
      providesTags: ["ServiceBookmark"],
      transformResponse: normalizeBookmarkList,
    }),

    addServiceBookmark: builder.mutation({
      query: (serviceId) => ({
        url: `/api/jobs-service/service-bookmark/${serviceId}`,
        method: "POST",
      }),
      invalidatesTags: ["ServiceBookmark"],
    }),

    removeServiceBookmark: builder.mutation({
      query: (bookmarkId) => ({
        url: `/api/jobs-service/service-bookmark/${bookmarkId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceBookmark"],
    }),

    // ───────────── JOB BOOKMARKS (✅ FIXED) ─────────────
    // Postman: /api/jobs-service/job-bookmark :contentReference[oaicite:2]{index=2}
    getJobBookmarks: builder.query({
      query: () => "/api/jobs-service/job-bookmark",
      providesTags: ["JobBookmark"],
      transformResponse: normalizeBookmarkList,
    }),

    addJobBookmark: builder.mutation({
      query: (jobId) => ({
        url: `/api/jobs-service/job-bookmark/${jobId}`,
        method: "POST",
      }),
      invalidatesTags: ["JobBookmark"],
    }),

    removeJobBookmark: builder.mutation({
      query: (bookmarkId) => ({
        url: `/api/jobs-service/job-bookmark/${bookmarkId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobBookmark"],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetMyServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,

  useGetAllJobsQuery,
  useGetMyJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,

  useGetCategoriesQuery,

  useGetServiceBookmarksQuery,
  useAddServiceBookmarkMutation,
  useRemoveServiceBookmarkMutation,

  useGetJobBookmarksQuery,
  useAddJobBookmarkMutation,
  useRemoveJobBookmarkMutation,
} = serviceApi;