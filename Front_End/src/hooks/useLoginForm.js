import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export const useLoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    setError("");
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

      // ✨ 1. إظهار الإشعار فوراً (قبل أن نخبر النظام بتسجيل الدخول)
      toast.success(`Login Successful! Welcome ${user.name || ""}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

      // ✨ 2. تأخير تحديث النظام والنقل لمدة ثانيتين عشان اليوزر يلحق يشوف الإشعار
      setTimeout(() => {
        // 🚨 هنا السر: وضعنا دالة الـ login داخل الـ setTimeout
        // بمجرد تنفيذ هذا السطر، الـ PublicRoute هيشتغل وينقلك فوراً بكل سلاسة
        login(user, token, role);

        // زيادة تأكيد للتوجيه
        if (role === "admin") {
          navigate("/adminPanel", { replace: true });
        } else if (role === "teacher") {
          navigate("/teacher", { replace: true });
        } else if (role === "student") {
          navigate("/home", { replace: true });
        } else {
          setError("Unauthorized role type.");
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError("Invalid User ID or Password.");
      } else {
        setError("Server Error. Please try again later.");
      }
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
