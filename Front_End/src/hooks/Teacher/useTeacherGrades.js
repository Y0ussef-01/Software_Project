import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export const useTeacherGrades = (courseId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedSheets, setUploadedSheets] = useState([]);

  useEffect(() => {
    if (courseId) {
      try {
        const history = localStorage.getItem(`sheets_history_${courseId}`);
        setUploadedSheets(history ? JSON.parse(history) : []);
      } catch (e) {
        setUploadedSheets([]);
      }
    }
  }, [courseId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadGrades = async (courseName) => {
    if (!selectedFile || !courseId) {
      toast.warning("Please select an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);
    formData.append("courseId", courseId);

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/teacher/upload-grades-excel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success(response.data?.message || "Grades uploaded successfully!");

      const newSheet = {
        id: Date.now(),
        fileName: selectedFile.name,
        courseName: courseName || "Unknown Course",
        date: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const updatedHistory = [...uploadedSheets, newSheet];
      setUploadedSheets(updatedHistory);
      localStorage.setItem(
        `sheets_history_${courseId}`,
        JSON.stringify(updatedHistory),
      );

      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload grades. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSheetRecord = (sheetId) => {
    const updatedHistory = uploadedSheets.filter(
      (sheet) => sheet.id !== sheetId,
    );
    setUploadedSheets(updatedHistory);
    localStorage.setItem(
      `sheets_history_${courseId}`,
      JSON.stringify(updatedHistory),
    );
    toast.info("Sheet record removed from history.");
  };

  return {
    isLoading,
    uploadedSheets,
    selectedFile,
    handleFileChange,
    uploadGrades,
    deleteSheetRecord,
  };
};
