import { useState, useEffect } from "react";
import axios from "axios";
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

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(" The token was not found. Please log in again.");
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSearch = async () => {
    const cleanSearchId = String(searchId).trim();

    if (!cleanSearchId) {
      toast.warning(" Please enter the teacher ID");
      setLastError("Teacher ID is empty");
      return;
    }

    setIsLoading(true);
    setLastError(null);
    setShowCard(false);
    setTeacherData(null);

    const headers = getAuthHeaders();

    if (!headers) {
      setIsLoading(false);
      setLastError("The token was not found. Please log in again.");
      return;
    }

    try {
      console.log("🔍 Searching for teacher with ID:", cleanSearchId);

      const response = await axios.get(
        `http://localhost:5000/admin/teacher/${encodeURIComponent(cleanSearchId)}`,
        headers
      );

      console.log("✅ Found teacher data:", response.data);

      if (response.data && response.data._id) {
        console.log("✅ Data is valid, updating...");


        setTeacherData(response.data);

        setTimeout(() => {
          setShowCard(true);
          console.log(" The card has been shown");
        }, 50);

        toast.success("✅ Found the teacher successfully");
      } else {
        console.warn(" The data is incorrect or empty");
        toast.error(" Failed to retrieve teacher data correctly");
        setShowCard(false);
        setTeacherData(null);
      }
    } catch (error) {
      console.error(" Error in search:", error);
      console.error("Status:", error.response?.status);

      let errorMsg = "Failed to fetch teacher data";

      if (error.response?.status === 404) {
        errorMsg = ` Teacher not found with ID: ${cleanSearchId}`;
        setLastError(`Teacher with ID "${cleanSearchId}" does not exist in the Database`);
      } else if (error.response?.status === 401) {
        errorMsg = " The login session has ended";
        setLastError("The token is invalid or expired.");
      } else if (error.response?.status === 403) {
        errorMsg = "You do not have permission";
        setLastError("The current user is not an admin");
      } else if (error.response?.status === 500) {
        errorMsg = " Error from the server";
        setLastError(`Error from the server: ${error.response?.data?.message}`);
      } else if (error.message === "Network Error") {
        errorMsg = " Server is offline";
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
    const headers = getAuthHeaders();

    if (!headers) {
      setIsLoading(false);
      return false;
    }

    try {
      if (updatedData.password && String(updatedData.password).trim() !== "") {
        const strongPasswordRegex =
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

        if (!strongPasswordRegex.test(updatedData.password)) {
          toast.warning(
            "🔐 Password must be 8+ characters with letters, numbers, and symbols",
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
          } else {
            payload[key] = updatedData[key];
          }
        }
      });

      const teacherStringId = String(teacherData._id).trim();

      console.log("Teacher update:", teacherStringId);

      const response = await axios.put(
        `http://localhost:5000/admin/update-teacher/${teacherStringId}`,
        payload,
        headers
      );

      console.log(" Teacher updated:", response.data);

      setTeacherData(response.data.teacher || { ...teacherData, ...payload });
      toast.success(" Teacher updated successfully");
      return true;
    } catch (error) {
      console.error(" Error updating teacher:", error);

      let errorMsg = "Failed to update teacher";
      if (error.response?.status === 400) {
        errorMsg = error.response?.data?.message || "Invalid data";
      } else if (error.response?.status === 404) {
        errorMsg = " Teacher not found";
      } else if (error.response?.status === 500) {
        errorMsg = " Error from the server";
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
        " Are you sure you want to permanently delete this feature?"
      )
    )
      return;

    setIsLoading(true);
    setLastError(null);
    const headers = getAuthHeaders();

    if (!headers) {
      setIsLoading(false);
      return;
    }

    try {
      const teacherStringId = String(teacherData._id).trim();

      console.log(" Delete the teacher:", teacherStringId);

      await axios.delete(
        `http://localhost:5000/admin/delete-teacher/${teacherStringId}`,
        headers
      );

      toast.success(" Teacher deleted successfully");
      setShowCard(false);
      setSearchId("");
      setTeacherData(null);
    } catch (error) {
      console.error(" Error deleting teacher:", error);

      let errorMsg = "Failed to delete teacher";
      if (error.response?.status === 404) {
        errorMsg = " Teacher not found";
      } else if (error.response?.status === 500) {
        errorMsg = " Error from the server";
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