import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

const convertTo12Hour = (time24) => {
  if (!time24) return "";
  if (
      time24.toLowerCase().includes("am") ||
      time24.toLowerCase().includes("pm")
  ) {
    return time24;
  }

  const [hours24, minutes] = time24.split(":");
  let hours = parseInt(hours24, 10);
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes} ${ampm}`;
};

export default function useClassManagement() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/admin/courses");
      setCourses(response.data?.courses || response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  const addCourse = async (courseData) => {
    setIsLoading(true);
    try {
      const preReqArray = Array.isArray(courseData.prerequisites)
          ? courseData.prerequisites
          : [];

      const payload = {
        _id: courseData._id.trim(),
        name: courseData.name.trim(),
        hours: Number(courseData.hours) || 3,
        prerequisites: preReqArray,
      };

      const response = await axiosInstance.post("/admin/add-course", payload);

      toast.success(response.data?.message || "Course added successfully", {
        position: "top-right",
      });
      fetchCourses();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add course");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (
        !window.confirm(
            "Are you sure you want to delete this course permanently?",
        )
    )
      return;
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/admin/delete-course/${courseId}`);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setIsLoading(false);
    }
  };

  const addGroup = async (groupData) => {
    setIsLoading(true);
    try {
      const formattedGroupData = {
        ...groupData,
        appointment: {
          ...groupData.appointment,
          day: groupData.appointment.day.toLowerCase(),
          startTime: convertTo12Hour(groupData.appointment.startTime),
          endTime: convertTo12Hour(groupData.appointment.endTime),
        },
      };

      const response = await axiosInstance.post("/admin/add-group", formattedGroupData);
      toast.success(response.data?.message || "Group added successfully");
      fetchCourses();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add group");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGroup = async (courseId, groupName, type) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    setIsLoading(true);
    try {
      const groupId = `${courseId}-${groupName}-${type}`;
      const response = await axiosInstance.delete(`/admin/delete-group/${groupId}`);
      toast.success(response.data?.message || "Group deleted successfully");
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete group");
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
    addCourse,
    deleteCourse,
    addGroup,
    deleteGroup,
  };
}