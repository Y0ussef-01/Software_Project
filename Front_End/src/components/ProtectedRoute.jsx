import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, role, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "20vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/adminPanel" replace />;
    if (role === "teacher") return <Navigate to="/teacher" replace />;
    return <Navigate to="/home" replace />;
  }

  // 4. كل شيء سليم -> تفضل بالدخول
  return <Outlet />;
}
