import React, { useEffect } from "react";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import { fetchCurrentUser } from "./redux/slices/authSlice";
import { useDispatch } from "react-redux";


const App = () => {
const dispatch = useDispatch();  
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(fetchCurrentUser());
  }
}, [dispatch]);
  return (
    <div className="app-container">
      <AppRoutes />
      <Toaster />
    </div>
  );
};


export default App;
