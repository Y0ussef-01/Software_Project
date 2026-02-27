import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

export const useLoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    setError("");
    // ✨ هنا نتأكد فقط أن الحقل ليس فارغاً، مما يسمح بإدخال حروف وأرقام معاً (مثل A-1)
    if (!userId.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        id: userId,
        password: password,
      });

      const { user, token, role } = response.data;

      // 1. تسجيل الدخول وحفظ التوكن
      login(user, token, role);

      // 2. التوجيه الذكي الآمن بناءً على الدور
      if (role === "admin") {
        navigate("/adminPanel", { replace: true });
      } else if (role === "teacher") {
        navigate("/teacher", { replace: true });
      } else if (role === "student") {
        navigate("/home", { replace: true });
      } else {
        setError("Unauthorized role type.");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid User ID or Password.");
      } else {
        setError("Server Error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    userId,
    setUserId,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
};
