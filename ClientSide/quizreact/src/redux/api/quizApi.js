import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "./baseQuery";

export const quizApi = createApi({
  reducerPath: "quizApi", // Unique name for this API slice
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    // Submit Quiz
    submitQuiz: builder.mutation({
      query: (payload) => ({
        url: "/submit_quiz", // Use the correct endpoint for React
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    fetchAttemptDetails: builder.query({
        query: (attemptId) => `/quiz_results/${attemptId}`, // Adjust endpoint as per your Rails route
      }),
      fetchQuizAttemptList: builder.query({
        query: (userId) => `/view_all_attempts/${userId}`, // Adjust endpoint as per your Rails route
      }),
      fetchQuizCategoryList: builder.query({
        query: () => `/list_all_quiz_names`, // Adjust endpoint as per your Rails route
      }),
      createQuestion: builder.mutation({
        query: (payload) => ({
          url: '/create_question',
          method: 'POST',
          body: payload,
        }),
      }),
      fetchQuizQuestionList: builder.query({
        
        query: (categoryId) => `/list_questions/${categoryId}`, // Adjust endpoint as per your Rails route
      }),
      
      editQuestion: builder.query({
        
        query: (questionId) => `/question/${questionId}`, // Adjust endpoint as per your Rails route
      }),
      saveEditedQuestion: builder.mutation({
        query: ({ questionId, data }) => ({
          url: `/update_question/${questionId}`,
          method: 'PUT',
          body: data,
        }),
      }),
      
    
  }),
});

// Export hooks to use in your components
export const { useSubmitQuizMutation,
  useLazyFetchAttemptDetailsQuery,
  useFetchQuizAttemptListQuery
  ,useFetchAttemptDetailsQuery,
  useLazyFetchQuizCategoryListQuery,
  useCreateQuestionMutation ,
  useFetchQuizQuestionListQuery,
  useEditQuestionQuery,
  useSaveEditedQuestionMutation


} = quizApi;
