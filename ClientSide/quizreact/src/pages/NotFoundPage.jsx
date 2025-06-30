import React from "react";

const NotFoundPage = () => {
  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100 text-center" 
      style={{ 
        background: "linear-gradient(to bottom right, #f0f8ff, #ffffff)", 
        width: "100vw", 
        height: "100vh" 
      }}
    >
      <div className="p-4 bg-white shadow rounded" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-danger">404</h1>
        <h3>Page Not Found</h3>
        <p>The page you are looking for doesn't exist.</p>
        <a href="/" className="btn btn-primary">Go to Home</a>
      </div>
    </div>
  );
};

export default NotFoundPage;
