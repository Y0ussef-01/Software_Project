import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function useResetAdminPassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (!formData.oldPassword || !formData.newPassword) {
      toast.warning("Please fill all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/admin/updatePassword",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(
        response.data.message ||
          "Password updated successfully. Please login again.",
      );

      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        logout();
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Update Password Error:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    isLoading,
    handleChange,
    handleSubmit,
    navigate,
  };
}
