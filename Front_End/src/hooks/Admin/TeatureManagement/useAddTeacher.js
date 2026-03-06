import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


export default function useAddTeacher() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    department: "",
    profileImg: "default-teacher.jpg",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "_id") {
      
      if (!/^[A-Za-z0-9-]*$/.test(value)) {
        return;
      }
      setFormData({
        ...formData,
        _id: value,
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData._id.trim() ||
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.warning(" Please fill in all required fields!");
      return;
    }

    
    if (formData._id.trim().length < 2) {
      toast.warning(" Teacher ID must be longer than one character!");
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warning(" Email address is invalid!");
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      toast.warning(
        "🔐 Password must contain at least 8 characters + letters + numbers + symbols",
        { autoClose: 4000 }
      );
      return;
    }

    setIsLoading(true);

    try {
      
      const payload = {
        _id: formData._id.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        department: formData.department.trim() || "Computer Science",
        profileImg: formData.profileImg,
      };

      
      const response = await axios.post(
        "http://localhost:5000/admin/add-teacher",
        payload,
        getAuthHeaders()
      );

      toast.success("✅ Teacher added successfully!");
      
      
      setFormData({
        _id: "",
        name: "",
        email: "",
        password: "",
        department: "",
        profileImg: "default-teacher.jpg",
      });

      
      setTimeout(() => {
        navigate("/adminPanel/teachers");
      }, 2000);
    } catch (error) {
      console.error(" Error adding teacher:", error);
      
      let errorMsg = "Failed to add teacher";
      
      if (error.response?.status === 400) {
        errorMsg = error.response?.data?.message || "Invalid data";
      } else if (error.response?.status === 409) {
        errorMsg = "This ID already exists!";
      } else if (error.response?.status === 500) {
        errorMsg = "Server error, please try again";
      } else if (error.message === "Network Error") {
        errorMsg = "Please check your internet connection and the server";
      }
      
      toast.error(errorMsg);
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