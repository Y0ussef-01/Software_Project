import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useStudentManagement() {
  const [searchId, setSearchId] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchId === "") {
      setShowCard(false);
      const timer = setTimeout(() => {
        setStudentData(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSearch = async () => {
    const cleanSearchId = String(searchId).trim();
    if (!cleanSearchId) {
      toast.warning("Please enter a Student ID");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/student/${encodeURIComponent(cleanSearchId)}`,
        getAuthHeaders(),
      );
      setStudentData(response.data);
      setShowCard(true);
      toast.success("Student found successfully");
    } catch (error) {
      console.error("Search Error:", error);
      if (error.response?.status === 404) {
        toast.error("Student not found in database.");
      } else if (error.response?.status === 500) {
        toast.error(
          `Backend Error 500: ${error.response?.data?.message || "Unknown Server Crash"}`,
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch student");
      }
      setShowCard(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    setIsLoading(true);
    try {
      if (updatedData.password && String(updatedData.password).trim() !== "") {
        const strongPasswordRegex =
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
        if (!strongPasswordRegex.test(updatedData.password)) {
          toast.warning(
            "Password must be at least 8 characters long and include letters, numbers, and symbols.",
            { autoClose: 4000 },
          );
          setIsLoading(false);
          return false;
        }
      }

      const gpaValue = parseFloat(updatedData.GPA);
      if (!isNaN(gpaValue) && (gpaValue < 0 || gpaValue > 5)) {
        toast.error("GPA must be between 0 and 5.0", { position: "top-right" });
        setIsLoading(false);
        return false;
      }

      const allowedFields = [
        "password",
        "profileImg",
        "department",
        "grade",
        "GPA",
        "maxHours",
      ];
      const payload = {};

      Object.keys(updatedData).forEach((key) => {
        if (allowedFields.includes(key)) {
          if (key === "password") {
            if (String(updatedData.password).trim() !== "") {
              payload.password = String(updatedData.password).trim();
            }
          } else {
            payload[key] = updatedData[key];
          }
        }
      });

      const studentStringId = String(studentData._id).trim();
      const response = await axios.put(
        `http://localhost:5000/admin/update-student/${studentStringId}`,
        payload,
        getAuthHeaders(),
      );

      setStudentData(response.data.student || { ...studentData, ...payload });
      toast.success(response.data.message || "Student updated successfully", {
        position: "top-right",
      });
      return true;
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update student", {
        position: "top-right",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this student permanently?",
      )
    )
      return;
    setIsLoading(true);
    try {
      const studentStringId = String(studentData._id).trim();
      await axios.delete(
        `http://localhost:5000/admin/delete-student/${studentStringId}`,
        getAuthHeaders(),
      );
      toast.success("Student deleted successfully", { position: "top-right" });
      setShowCard(false);
      setSearchId("");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchId,
    setSearchId,
    showCard,
    studentData,
    isLoading,
    handleSearch,
    handleUpdateSubmit,
    handleDeleteClick,
  };
}
