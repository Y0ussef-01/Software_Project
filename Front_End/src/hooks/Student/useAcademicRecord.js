import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function useAcademicRecord() {
  const [academicRecord, setAcademicRecord] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAcademicRecord = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/student/academic-record");
      setAcademicRecord(response.data?.records || []);
    } catch (error) {
      console.error("Error fetching academic record:", error);
      toast.error("Failed to fetch academic record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicRecord();
  }, []);

  return {
    academicRecord,
    isLoading,
    refetch: fetchAcademicRecord,
  };
}
