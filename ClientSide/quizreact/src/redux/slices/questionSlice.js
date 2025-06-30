import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

// 🟢 Simple Async Thunk to Fetch Questions
export const fetchQuestions = createAsyncThunk("questions/fetch", async (categoryId) => {
  const response = await axiosInstance.get(`http://localhost:7001/list_questions/${categoryId}`)
  console.log(categoryId)
  return response.data.quiz_list; 
});

// 🟢 Create a Redux Slice
const questionSlice = createSlice({
  name: "questions",
  initialState: {
    questions: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload; // Save fetched questions to Redux state
      })
      .addCase(fetchQuestions.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch questions";
      });
  },
});

export  {questionSlice}
