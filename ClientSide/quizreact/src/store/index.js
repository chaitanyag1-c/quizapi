import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../redux/api/authApi";
import { quizApi } from "../redux/api/quizApi";
import { userApi } from "../redux/api/userApi";
import  authReducer  from "../redux/slices/authSlice";
import { questionSlice } from "../redux/slices/questionSlice";
import { quizcategorySlice,quizquestionsSlice } from "../redux/slices/quizcategorySlice";


export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer, 
    [quizApi.reducerPath]: quizApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authReducer,
    questions:questionSlice.reducer,
    quizcategory: quizcategorySlice.reducer,
    quizquestion: quizquestionsSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,quizApi.middleware,userApi.middleware),
});
