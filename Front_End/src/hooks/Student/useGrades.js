import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function useGrades() {
  const [finalResults, setFinalResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGradesData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/student/final-results");
      setFinalResults(response.data?.results || []);
    } catch (error) {
      console.error("Error fetching final results:", error);
      toast.error(
        "Failed to fetch current semester results. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGradesData();
  }, []);

  return {
    finalResults,
    isLoading,
    refetch: fetchGradesData,
  };
}
