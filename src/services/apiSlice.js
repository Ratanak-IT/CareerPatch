// 1) src/services/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://192.168.0.105:8080"; // change to your backend

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token =
        getState()?.auth?.accessToken ||
        getState()?.auth?.token ||
        localStorage.getItem("ACCESS_TOKEN");

      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["ServiceBookmarks", "JobBookmarks", "MyServices", "AllServices"],
  endpoints: () => ({}),
});