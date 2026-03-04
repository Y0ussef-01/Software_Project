import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const resetPassword = async (oldPassword, newPassword) => {
    const strongPasswordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      toast.warning(
        "Password must be at least 8 characters long and include letters, numbers, and symbols.",
        { autoClose: 4000 },       
      );
      return false;     
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.put("/student/updatePassword", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      toast.success(response.data.message || "Password updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        logout();
      }, 2000);

      return true;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update password. Please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
  };
};
