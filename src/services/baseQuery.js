import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});