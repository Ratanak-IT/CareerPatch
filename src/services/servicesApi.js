import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

// ─── Normalizers ──────────────────────────────────────────────────────────────
// API returns jobImages field — copy it to imageUrls so UI code is consistent
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
  if (Array.isArray(res?.content))          raw = res.content;
  else if (Array.isArray(res?.data?.content)) raw = res.data.content;
  else if (Array.isArray(res?.data))          raw = res.data;
  else if (!Array.isArray(res))               return [];
  return raw.map(normalizeService);
}

// ─── API ──────────────────────────────────────────────────────────────────────
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
  tagTypes: ["Service", "Bookmark"],
  endpoints: (builder) => ({

    // ── Services ──────────────────────────────────────────────────────────

    // GET /api/jobs-service/services  → { content: [...] }
    getAllServices: builder.query({
      query: () => "/api/jobs-service/services",
      providesTags: ["Service"],
      transformResponse: normalizeList,
    }),

    // GET /api/jobs-service/services/own-service
    getMyServices: builder.query({
      query: () => "/api/jobs-service/services/own-service",
      providesTags: ["Service"],
      transformResponse: normalizeList,
    }),

    // GET /api/jobs-service/services/:id
    getServiceById: builder.query({
      query: (id) => `/api/jobs-service/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
      transformResponse: normalizeService,
    }),

    // POST /api/jobs-service/services/create-new
    // body: { title, description, categoryId, status, imageUrls: [] }
    createService: builder.mutation({
      query: (body) => ({
        url: "/api/jobs-service/services/create-new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    // PUT /api/jobs-service/services/:id
    updateService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/jobs-service/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    // DELETE /api/jobs-service/services/:id
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/api/jobs-service/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // ── Categories ────────────────────────────────────────────────────────

    // GET /api/jobs-service/categories
    getCategories: builder.query({
      query: () => "/api/jobs-service/categories",
      transformResponse: (res) => {
        if (Array.isArray(res))               return res;
        if (Array.isArray(res?.data))         return res.data;
        if (Array.isArray(res?.content))      return res.content;
        return [];
      },
    }),

    // ── Bookmarks ─────────────────────────────────────────────────────────

    // GET /api/jobs-service/service-bookmark
    getBookmarks: builder.query({
      query: () => "/api/jobs-service/service-bookmark",
      providesTags: ["Bookmark"],
      transformResponse: normalizeList,
    }),

    // POST /api/jobs-service/service-bookmark/:serviceId
    addBookmark: builder.mutation({
      query: (serviceId) => ({
        url: `/api/jobs-service/service-bookmark/${serviceId}`,
        method: "POST",
      }),
      invalidatesTags: ["Bookmark"],
    }),

    

    // DELETE /api/jobs-service/service-bookmark/:serviceId
    removeBookmark: builder.mutation({
      query: (serviceId) => ({
        url: `/api/jobs-service/service-bookmark/${serviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmark"],
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
  useGetCategoriesQuery,
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = serviceApi;