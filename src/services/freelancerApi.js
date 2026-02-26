import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getFreelancers: builder.query({
  query: () => "/api/users?userType=FREELANCER",
}),
  }),
});

export const { useGetFreelancersQuery } = freelancerApi;