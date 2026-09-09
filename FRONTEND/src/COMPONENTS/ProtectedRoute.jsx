import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles, requireAdmin }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated user to home if accessing dashboard, or signin page
    const redirectPath = location.pathname.startsWith("/dashboard") ? "/" : "/signin";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role === "customer") {
    toast.error("Access denied. Admin privileges required.");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error("Access denied.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
