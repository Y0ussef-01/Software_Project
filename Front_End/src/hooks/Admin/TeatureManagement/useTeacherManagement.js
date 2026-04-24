import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

export default function useTeacherManagement() {
  const [searchId, setSearchId] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState(null);

  useEffect(() => {
    if (searchId === "") {
      setShowCard(false);
      setLastError(null);
      const timer = setTimeout(() => {
        setTeacherData(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchId]);

  const handleSearch = async () => {
    const cleanSearchId = String(searchId).trim();

    if (!cleanSearchId) {
      toast.warning("Please enter the teacher ID");
      setLastError("Teacher ID is empty");
      return;
    }

    setIsLoading(true);
    setLastError(null);
    setShowCard(false);
    setTeacherData(null);

    try {
      const response = await axiosInstance.get(`/admin/teacher/${encodeURIComponent(cleanSearchId)}`);

      if (response.data && response.data._id) {
        setTeacherData(response.data);
        setTimeout(() => {
          setShowCard(true);
        }, 50);
        toast.success("✅ Found the teacher successfully");
      } else {
        toast.error("Failed to retrieve teacher data correctly");
        setShowCard(false);
        setTeacherData(null);
      }
    } catch (error) {
      let errorMsg = "Failed to fetch teacher data";

      if (error.response?.status === 404) {
        errorMsg = `Teacher not found with ID: ${cleanSearchId}`;
        setLastError(`Teacher with ID "${cleanSearchId}" does not exist in the Database`);
      } else if (error.response?.status === 401) {
        errorMsg = "The login session has ended";
        setLastError("The token is invalid or expired.");
      } else if (error.response?.status === 403) {
        errorMsg = "You do not have permission";
        setLastError("The current user is not an admin");
      } else if (error.response?.status === 500) {
        errorMsg = "Error from the server";
        setLastError(`Error from the server: ${error.response?.data?.message}`);
      } else if (error.message === "Network Error") {
        errorMsg = "Server is offline";
        setLastError("Make sure Backend is enabled on localhost:5000");
      }

      toast.error(errorMsg);
      setShowCard(false);
      setTeacherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    setIsLoading(true);
    setLastError(null);

    try {
      if (updatedData.password && String(updatedData.password).trim() !== "") {
        const strongPasswordRegex =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

        if (!strongPasswordRegex.test(updatedData.password)) {
          toast.warning(
              "🔑 Password must be 8+ characters with letters, numbers, and symbols",
              { autoClose: 4000 }
          );
          setIsLoading(false);
          return false;
        }
      }

      const allowedFields = ["password", "profileImg"];
      const payload = {};

      Object.keys(updatedData).forEach((key) => {
        if (allowedFields.includes(key)) {
          if (key === "password") {
            if (String(updatedData.password).trim() !== "") {
              payload.password = String(updatedData.password).trim();
            }
          } else if (key === "profileImg") {
            payload.profileImg = updatedData[key];
          }
        }
      });

      const teacherStringId = String(teacherData._id).trim();

      const response = await axiosInstance.put(`/admin/update-teacher/${teacherStringId}`, payload);

      setTeacherData(response.data.teacher || { ...teacherData, ...payload });
      toast.success("✅ Teacher updated successfully");
      return true;
    } catch (error) {
      let errorMsg = "Failed to update teacher";
      if (error.response?.status === 400) {
        errorMsg = error.response?.data?.message || "Invalid data";
      } else if (error.response?.status === 404) {
        errorMsg = "Teacher not found";
      } else if (error.response?.status === 500) {
        errorMsg = "Error from the server";
      }

      setLastError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
        !window.confirm(
            "Are you sure you want to permanently delete this teacher?"
        )
    )
      return;

    setIsLoading(true);
    setLastError(null);

    try {
      const teacherStringId = String(teacherData._id).trim();
      await axiosInstance.delete(`/admin/delete-teacher/${teacherStringId}`);

      toast.success("✅ Teacher deleted successfully");
      setShowCard(false);
      setSearchId("");
      setTeacherData(null);
    } catch (error) {
      let errorMsg = "Failed to delete teacher";
      if (error.response?.status === 404) {
        errorMsg = "Teacher not found";
      } else if (error.response?.status === 500) {
        errorMsg = "Error from the server";
      }

      setLastError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchId,
    setSearchId,
    showCard,
    teacherData,
    isLoading,
    lastError,
    handleSearch,
    handleUpdateSubmit,
    handleDeleteClick,
  };
}