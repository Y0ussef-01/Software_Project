import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useBulkUploadStudents() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(selected.type)) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
      return;
    }

    setFile(selected);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select an Excel file first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/admin/upload-students",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      toast.success(response.data.message || "Students uploaded successfully!");
      setFile(null);
      const fileInput = document.getElementById("bulkStudentsFileInput");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    const fileInput = document.getElementById("bulkStudentsFileInput");
    if (fileInput) fileInput.value = "";
  };

  return {
    file,
    loading,
    result,
    handleFileChange,
    handleUpload,
    handleReset,
  };
}