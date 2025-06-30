import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show toast message when user tries to access protected route without authentication
  useEffect(() => {
    if (!loading && !currentUser && location.pathname === "/create-post") {
      toast.info("Please sign in to access the Create Post page", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  }, [currentUser, loading, location.pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to home page
  if (!currentUser) {
    // Store the attempted location so we can redirect back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
