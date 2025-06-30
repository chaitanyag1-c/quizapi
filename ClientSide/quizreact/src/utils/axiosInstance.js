// src/utils/axiosInstance.js
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
// Create instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:7001", // ✅ adjust as needed
  withCredentials: true, // optional, depending on cookies
});
// Attach token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
      sessionStorage.setItem("toastMessage", "Token expired or invalid. Please login again.");
     
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
