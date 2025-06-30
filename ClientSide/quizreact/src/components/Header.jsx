import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // Import logout action
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const handleLogOut = () =>{
    dispatch(logout())
    navigate('/')
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* App Name */}
        <span 
          className="navbar-brand fw-bold text-primary"
          style={{ cursor: "pointer", fontSize: "1.8rem" }}
          onClick={() => navigate("/")}
        >
          MyQuiz
        </span>

        {/* Right Side Buttons */}
        <div className="ms-auto d-flex align-items-center">
          {isAuthenticated ? (
            <>
              <span className="fw-bold text-dark me-3">
                Welcome, {user.first_name}
              </span>
              <button 
                className="btn btn-outline-danger"
                onClick={() => handleLogOut()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn btn-outline-primary me-2"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
