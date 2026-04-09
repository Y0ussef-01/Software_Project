import { useState } from "react";
import axiosInstance from "../../../api/axiosInstance";

const useFinalGrades = () => {
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(selected.type)) {
      setErrorMessage("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
      return;
    }

    setFile(selected);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select an Excel file first.");
      return;
    }
    if (!courseId.trim()) {
      setErrorMessage("Please enter a Course ID.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setUploadResult(null);

    const formData = new FormData();
    formData.append("courseId", courseId.trim());
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
        "/admin/upload-final-grades",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMessage(
        response.data.message || "Final grades uploaded successfully!"
      );
      setUploadResult(response.data);
      setFile(null);
      setCourseId("");

      const fileInput = document.getElementById("finalGradesFileInput");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setUploadResult(null);
  };

  return {
    file,
    courseId,
    setCourseId,
    loading,
    successMessage,
    errorMessage,
    uploadResult,
    handleFileChange,
    handleUpload,
    clearMessages,
  };
};

export default useFinalGrades;