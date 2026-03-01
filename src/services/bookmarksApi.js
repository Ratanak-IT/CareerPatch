import { apiSlice } from "./apiSlice";

function buildIdMap(list, kind) {
  const map = {};
  for (const it of Array.isArray(list) ? list : []) {
    const targetId =
      it?.serviceId || it?.jobId || it?.targetId || it?.postId || it?.refId || it?.id;

    // bookmarkId might be separate field OR the entry id itself
    const bookmarkId = it?.bookmarkId ?? it?.bookmark?.id ?? it?.id;

    // If the backend returns the actual service/job object, targetId should be it.id
    const normalizedTargetId =
      it?.serviceId || it?.jobId || it?.targetId || it?.postId || it?.refId || it?.id;

    if (normalizedTargetId) {
      map[String(normalizedTargetId)] = bookmarkId ? String(bookmarkId) : null;
    }
  }
  return map;
}

export const bookmarksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // -------- Service bookmarks ----------
    getServiceBookmarks: builder.query({
      query: () => "/api/jobs-service/service-bookmark",
      providesTags: (result) =>
        result ? [{ type: "ServiceBookmarks", id: "LIST" }] : [{ type: "ServiceBookmarks", id: "LIST" }],
    }),

    addServiceBookmark: builder.mutation({
      query: (serviceId) => ({
        url: `/api/jobs-service/service-bookmark/${serviceId}`,
        method: "POST",
      }),
      async onQueryStarted(serviceId, { dispatch, queryFulfilled }) {
        // optimistic: insert a placeholder entry so the heart turns blue immediately
        const patch = dispatch(
          bookmarksApi.util.updateQueryData("getServiceBookmarks", undefined, (draft) => {
            const arr = Array.isArray(draft) ? draft : [];
            const exists = arr.some((x) => String(x?.serviceId ?? x?.id) === String(serviceId));
            if (!exists) {
              arr.unshift({ serviceId, bookmarkId: `optimistic-${serviceId}` });
            }
            return arr;
          })
        );

        try {
          const { data } = await queryFulfilled;

          // if backend returns a bookmark entry, replace optimistic item
          dispatch(
            bookmarksApi.util.updateQueryData("getServiceBookmarks", undefined, (draft) => {
              const arr = Array.isArray(draft) ? draft : [];
              const idx = arr.findIndex((x) => String(x?.serviceId ?? x?.id) === String(serviceId));
              if (idx >= 0) {
                // best-effort normalize
                const bookmarkId = data?.bookmarkId ?? data?.id ?? arr[idx]?.bookmarkId;
                arr[idx] = {
                  ...(data || {}),
                  serviceId: data?.serviceId ?? serviceId,
                  bookmarkId: bookmarkId ?? arr[idx]?.bookmarkId,
                };
              }
              return arr;
            })
          );
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "ServiceBookmarks", id: "LIST" }],
    }),

    removeServiceBookmark: builder.mutation({
      query: (bookmarkId) => ({
        url: `/api/jobs-service/service-bookmark/${bookmarkId}`,
        method: "DELETE",
      }),
      async onQueryStarted(bookmarkId, { dispatch, getState, queryFulfilled }) {
        // optimistic remove by bookmarkId
        const patch = dispatch(
          bookmarksApi.util.updateQueryData("getServiceBookmarks", undefined, (draft) => {
            const arr = Array.isArray(draft) ? draft : [];
            const next = arr.filter((x) => String(x?.bookmarkId ?? x?.id) !== String(bookmarkId));
            return next;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "ServiceBookmarks", id: "LIST" }],
    }),

    // -------- Job bookmarks ----------
    getJobBookmarks: builder.query({
      query: () => "/api/jobs-service/job-bookmark",
      providesTags: (result) =>
        result ? [{ type: "JobBookmarks", id: "LIST" }] : [{ type: "JobBookmarks", id: "LIST" }],
    }),

    addJobBookmark: builder.mutation({
      query: (jobId) => ({
        url: `/api/jobs-service/job-bookmark/${jobId}`,
        method: "POST",
      }),
      async onQueryStarted(jobId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          bookmarksApi.util.updateQueryData("getJobBookmarks", undefined, (draft) => {
            const arr = Array.isArray(draft) ? draft : [];
            const exists = arr.some((x) => String(x?.jobId ?? x?.id) === String(jobId));
            if (!exists) {
              arr.unshift({ jobId, bookmarkId: `optimistic-${jobId}` });
            }
            return arr;
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            bookmarksApi.util.updateQueryData("getJobBookmarks", undefined, (draft) => {
              const arr = Array.isArray(draft) ? draft : [];
              const idx = arr.findIndex((x) => String(x?.jobId ?? x?.id) === String(jobId));
              if (idx >= 0) {
                const bookmarkId = data?.bookmarkId ?? data?.id ?? arr[idx]?.bookmarkId;
                arr[idx] = {
                  ...(data || {}),
                  jobId: data?.jobId ?? jobId,
                  bookmarkId: bookmarkId ?? arr[idx]?.bookmarkId,
                };
              }
              return arr;
            })
          );
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "JobBookmarks", id: "LIST" }],
    }),

    removeJobBookmark: builder.mutation({
      query: (bookmarkId) => ({
        url: `/api/jobs-service/job-bookmark/${bookmarkId}`,
        method: "DELETE",
      }),
      async onQueryStarted(bookmarkId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          bookmarksApi.util.updateQueryData("getJobBookmarks", undefined, (draft) => {
            const arr = Array.isArray(draft) ? draft : [];
            const next = arr.filter((x) => String(x?.bookmarkId ?? x?.id) !== String(bookmarkId));
            return next;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: "JobBookmarks", id: "LIST" }],
    }),
  }),
});

export const {
  useGetServiceBookmarksQuery,
  useAddServiceBookmarkMutation,
  useRemoveServiceBookmarkMutation,
  useGetJobBookmarksQuery,
  useAddJobBookmarkMutation,
  useRemoveJobBookmarkMutation,
} = bookmarksApi;

// helper selector (optional)
export const selectServiceBookmarkMap = (state) => {
  const res = bookmarksApi.endpoints.getServiceBookmarks.select()(state);
  return buildIdMap(res?.data, "service");
};

export const selectJobBookmarkMap = (state) => {
  const res = bookmarksApi.endpoints.getJobBookmarks.select()(state);
  return buildIdMap(res?.data, "job");
};