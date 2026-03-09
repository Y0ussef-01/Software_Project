import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useAppointments() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/student/getAllCourses",
        getAuthHeaders(),
      );

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
