import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // If you store token in redux, set it here:
      const token = getState()?.auth?.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/api/uploads/images", // <-- your backend upload endpoint
          method: "POST",
          body: formData,
          // DO NOT set Content-Type manually for FormData (browser will set boundary)
        };
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;