import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // ✅ do NOT force content-type for GET
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFreelancers: builder.query({
      // ✅ public list
      // If your backend is different, change URL only here.
      query: () => ({
        url: "/api/users?userType=FREELANCER",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFreelancersQuery } = freelancerApi;