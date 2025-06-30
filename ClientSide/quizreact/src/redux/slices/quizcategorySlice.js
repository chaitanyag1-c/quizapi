import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
// 🟢 Simple Async Thunk to Fetch QuizCategory
export const fetchQuizCategory = createAsyncThunk("quizcategorys/fetch", async () => {
  const response = await axiosInstance.get("http://localhost:7001/list_all_quiz_names", {
      withCredentials: true, // ← ✅ Include cookies
    });
  const base64String = response.data.encrypted_data; 
  const jsonString = atob(base64String);
  const decodedData = JSON.parse(jsonString);
  return decodedData; 
});

export const fetchQuizQuestions = createAsyncThunk("quizquestions/fetch", async (quizId) => {
  const response = await axiosInstance.get(
      `http://localhost:7001/fetch_quiz_questions/${quizId}`,
      {
        withCredentials: true, // ← ✅ Include cookies
      }
    );
  
  return response.data; 
});

// Example decode function
const decodeBase64Json = (base64String) => {
  const decoded = atob(base64String); // base64 → string
  return JSON.parse(decoded);         // string → object
};



// 🟢 Create a Redux Slice
const quizcategorySlice = createSlice({
  name: "quizcategorys",
  initialState: {
    quizcategorys: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.quizcategorys = action.payload; // Save fetched quizcategorys to Redux state
      })
      .addCase(fetchQuizCategory.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch quizcategorys";
      });
  },
});


// 🟢 Create a Redux Slice
const quizquestionsSlice = createSlice({
  name: "quizquestions",
  initialState: {
    quizquestions: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.quizquestions = action.payload; 
      })
      .addCase(fetchQuizQuestions.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch QUIZ QUESTIONS";
      });
  },
});

export  {quizcategorySlice,quizquestionsSlice}
