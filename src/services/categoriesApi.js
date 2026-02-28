import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/api/jobs-service/categories",
      transformResponse: (res) => {
        // handle {data:[...]} or [...] or {content:[...]} safely
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.content)) return res.content;
        if (Array.isArray(res?.data?.content)) return res.data.content;
        return [];
      },
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApi;