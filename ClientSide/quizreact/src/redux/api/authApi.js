import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "./baseQuery";
export const authApi = createApi({
  reducerPath: "authApi", // Unique name for this API slice
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth_login",
        method: "POST",
        body: { email, password }, // Send data in the request body
        headers: { "Content-Type": "application/json" },
      }),
    }),
    userUpdate: builder.mutation({
      query: ({userId,data}) => ({
        url: `/user/update/${userId}`,
        method: "PATCH",
        body: data, 
        headers: { "Content-Type": "application/json" },
      }),
    }),
    signUp: builder.mutation({
      query: (userData) => ({
        url: "/registration",
        method: "POST",
        body: userData, 
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
  
});

// ✅ Export both mutations
export const { useSignInMutation, useSignUpMutation,useUserUpdateMutation } = authApi;
