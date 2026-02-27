import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, role, isAuthLoading } = useAuth();

  // 1. التحقق من حالة جلب البيانات من المتصفح
  if (isAuthLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "20vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. لو غير مسجل -> الطرد إلى صفحة اللوجين
  if (!token) return <Navigate to="/" replace />;

  // 3. لو مسجل لكن يحاول دخول صفحة ليست من صلاحياته -> نعيده لصفحته الرئيسية المخصصة لدوره
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/adminPanel" replace />;
    if (role === "teacher") return <Navigate to="/teacher" replace />;
    return <Navigate to="/home" replace />;
  }

  // 4. كل شيء سليم -> تفضل بالدخول
  return <Outlet />;
}
