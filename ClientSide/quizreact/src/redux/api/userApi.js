import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({

    fetchUserDetails: builder.query({
        query: (id) => `/show_user/${id}`, 
      }),

  }),
});


export const { useFetchUserDetailsQuery} = userApi;