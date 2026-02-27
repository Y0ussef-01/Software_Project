import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { token, role } = useAuth();

  if (token) {
    if (role === "admin") {
      return <Navigate to="/adminPanel" replace />;
    } else if (role === "teacher") {
      return <Navigate to="/teacher" replace />;
    } else if (role === "student") {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
}
