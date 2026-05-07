import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function useAppointments() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/student/getAllCourses");
      setCourses(response.data?.courses || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load appointments data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    isLoading,
  };
}