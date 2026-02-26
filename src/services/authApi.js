import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens } from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/api/users/login",
        method: "POST",
        body,
      }),

      // IMPORTANT: catch error here so 401 doesn't crash console
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
  try {
    const { data } = await queryFulfilled;
    dispatch(setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
  } catch (err) {
    console.log("LOGIN ERROR (authApi):", err);
  }
},
    }),

    registerFreelancer: builder.mutation({
      query: (body) => ({
        url: "/api/users/register-freelancer",
        method: "POST",
        body,
      }),
    }),

    registerBusinessOwner: builder.mutation({
      query: (body) => ({
        url: "/api/users/register-business-owner",
        method: "POST",
        body,
      }),
    }),

    me: builder.query({
      query: () => ({
        url: "/api/users/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterFreelancerMutation,
  useRegisterBusinessOwnerMutation,
  useMeQuery,
  useLazyMeQuery, 
} = authApi;