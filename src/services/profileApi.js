import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "../features/auth/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL;

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Me"],
  endpoints: (builder) => ({
    me: builder.query({
      query: () => "/api/users/me",
      providesTags: ["Me"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) dispatch(setUser(data.data));
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      },
    }),

    updateFreelancerProfile: builder.mutation({
      // body: JSON fields (fullName, phone, address, bio, skills, experienceYears, etc.)
      query: (body) => ({
        url: "/api/users/update-freelancer-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Me"],
    }),

    uploadProfileImage: builder.mutation({
      // upload real file -> server returns URL in response (common pattern)
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/api/users/upload-profile-image", // ✅ change to your real upload endpoint
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useMeQuery,
  useUpdateFreelancerProfileMutation,
  useUploadProfileImageMutation,
} = profileApi;