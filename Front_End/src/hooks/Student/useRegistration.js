import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useRegistration() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async (showPageLoader = true) => {
    if (showPageLoader) setIsLoading(true);

    try {
      const [profileRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:5000/student/Profile", getAuthHeaders()),
        axios.get(
          "http://localhost:5000/student/getAllCourses",
          getAuthHeaders(),
        ),
      ]);

      setStudentProfile(profileRes.data?.student || profileRes.data || {});
      setAvailableCourses(coursesRes.data?.courses || coursesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load registration data.");
    } finally {
      if (showPageLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const maxHours = studentProfile?.maxHours || 19;
  const registeredCourses = studentProfile?.registeredCourses || [];

  const uniqueCoursesMap = {};
  registeredCourses.forEach((row) => {
    const courseObj = row.course || row;
    const baseCourseCode =
      typeof row.course === "string"
        ? row.course
        : courseObj.courseId || courseObj._id || row.courseId;

    const hours = courseObj.hours || row.hours || 3;

    if (baseCourseCode && !uniqueCoursesMap[baseCourseCode]) {
      uniqueCoursesMap[baseCourseCode] = hours;
    }
  });

  const registeredHours = Object.values(uniqueCoursesMap).reduce(
    (total, hours) => total + hours,
    0,
  );

  const remainingHours = maxHours - registeredHours;

  const selectedCourseDetails = availableCourses.find(
    (c) => c._id === selectedCourseId || c.courseId === selectedCourseId,
  );

  const handleRegister = async () => {
    if (!selectedCourseId || !selectedGroup) return;

    if (
      selectedCourseDetails &&
      registeredHours + (selectedCourseDetails.hours || 3) > maxHours
    ) {
      toast.error("Exceeded maximum allowed hours!", { position: "top-right" });
      return;
    }

    setIsActionLoading(true);
    try {
      const payload = {
        courseId: selectedCourseId,
        groupName: selectedGroup,
      };

      const response = await axios.post(
        "http://localhost:5000/student/register-course",
        payload,
        getAuthHeaders(),
      );

      setSelectedCourseId("");
      setSelectedGroup("");

      toast.success(
        response.data.message || "Course registered successfully!",
        { position: "top-right", autoClose: 2500 },
      );

      await fetchData(false);
    } catch (error) {
      console.error("Register Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to register course.",
        { position: "top-right" },
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDropCourse = async (courseId) => {
    if (!courseId) return;

    setIsActionLoading(true);
    try {
      await axios.delete("http://localhost:5000/student/drop-course", {
        headers: getAuthHeaders().headers,
        data: { courseId },
      });

      toast.success("Course dropped successfully!", {
        position: "top-right",
        autoClose: 2500,
      });

      await fetchData(false);
    } catch (error) {
      console.error("Drop Error:", error);
      toast.error(error.response?.data?.message || "Failed to drop course.", {
        position: "top-right",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    isLoading,
    isActionLoading,
    availableCourses,
    selectedCourseId,
    setSelectedCourseId,
    selectedGroup,
    setSelectedGroup,
    selectedCourseDetails,
    maxHours,
    registeredHours,
    remainingHours,
    registeredCourses,
    handleRegister,
    handleDropCourse,
  };
}
