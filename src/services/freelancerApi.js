import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;


async function fetchWithAuth(url, api) {
  const token = api.getState()?.auth?.accessToken;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) return null;
  return res.json();
}


function extractTotal(data) {
  return (
    data?.totalElements      ??
    data?.data?.totalElements ??
    data?.total              ??
    data?.data?.total        ??
    data?.count              ??
    null
  );
}

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({


    getFreelancers: builder.query({
      async queryFn(_, api) {
        try {

          const probe = await fetchWithAuth(
            `${BASE_URL}/api/users?userType=FREELANCER&page=0&size=1`, api
          );
          const total = extractTotal(probe);


          const avatarRes = await fetchWithAuth(
            `${BASE_URL}/api/users?userType=FREELANCER&page=0&size=8`, api
          );
          const list =
            Array.isArray(avatarRes)               ? avatarRes :
            Array.isArray(avatarRes?.data)         ? avatarRes.data :
            Array.isArray(avatarRes?.content)      ? avatarRes.content :
            Array.isArray(avatarRes?.data?.content) ? avatarRes.data.content : [];

          return {
            data: {
              total: total ?? list.length,
              list,
            },
          };
        } catch (e) {
          return { error: e.message };
        }
      },
    }),

    getBusinesses: builder.query({
      async queryFn(_, api) {
        try {
          const probe = await fetchWithAuth(
            `${BASE_URL}/api/users?userType=BUSINESS_OWNER&page=0&size=1`, api
          );
          const total = extractTotal(probe);

          const avatarRes = await fetchWithAuth(
            `${BASE_URL}/api/users?userType=BUSINESS_OWNER&page=0&size=5`, api
          );
          const list =
            Array.isArray(avatarRes)                ? avatarRes :
            Array.isArray(avatarRes?.data)          ? avatarRes.data :
            Array.isArray(avatarRes?.content)       ? avatarRes.content :
            Array.isArray(avatarRes?.data?.content) ? avatarRes.data.content : [];

          return { data: { total: total ?? list.length, list } };
        } catch (e) {
          return { error: e.message };
        }
      },
    }),

    getJobs: builder.query({
      async queryFn(_, api) {
        try {
          const probe = await fetchWithAuth(
            `${BASE_URL}/api/jobs-service/jobs?page=0&size=1`, api
          );
          const total = extractTotal(probe);

          if (total !== null) return { data: { total, list: [] } };

          const all = await fetchWithAuth(
            `${BASE_URL}/api/jobs-service/jobs?page=0&size=500`, api
          );
          const list =
            Array.isArray(all)            ? all :
            Array.isArray(all?.data)      ? all.data :
            Array.isArray(all?.content)   ? all.content :
            Array.isArray(all?.data?.content) ? all.data.content : [];
          return { data: { total: list.length, list } };
        } catch (e) {
          return { error: e.message };
        }
      },
    }),

  }),
});

export const {
  useGetFreelancersQuery,
  useGetBusinessesQuery,
  useGetJobsQuery,
} = freelancerApi;