import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function useAddStudent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "_id") {
      if (!/^\d*$/.test(value) || value.length > 7) {
        return;
      }

      setFormData({
        ...formData,
        _id: value,
        email: value ? `20${value}@std.sci.cu.edu.eg` : "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData._id ||
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      toast.warning("Please fill all required fields!", {
        position: "top-right",
      });
      return;
    }

    if (formData._id.length !== 7) {
      toast.warning("Student ID must be exactly 7 digits!", {
        position: "top-right",
      });
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      toast.warning("Password must be stronger (Letters, Numbers & Symbols).", {
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        _id: formData._id,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profileImg: "default.jpg",
      };

      const response = await axios.post(
        "http://localhost:5000/admin/add-student",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(response.data.message || "Student added successfully!", {
        position: "top-right",
      });

      setFormData({ _id: "", name: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/adminPanel/students");
      }, 2000);
    } catch (error) {
      console.error("Add Student Error:", error);
      const errorData = error.response?.data;
      const errorMessage = errorData?.message?.toLowerCase() || "";

      if (
        errorMessage.includes("exists") ||
        errorMessage.includes("duplicate") ||
        error.response?.status === 409
      ) {
        toast.error(
          `Error: Student with ID ${formData._id} is already exist!`,
          {
            position: "top-right",
            autoClose: 5000,
          },
        );
      } else {
        toast.error(errorData?.message || "Failed to add student.", {
          position: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    isLoading,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    navigate,
  };
}
