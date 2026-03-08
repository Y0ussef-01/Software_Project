import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useClassManagement() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/courses",
        getAuthHeaders(),
      );
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

      const response = await axios.post(
        "http://localhost:5000/admin/add-course",
        payload,
        getAuthHeaders(),
      );

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
      await axios.delete(
        `http://localhost:5000/admin/delete-course/${courseId}`,
        getAuthHeaders(),
      );
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
      const response = await axios.post(
        "http://localhost:5000/admin/add-group",
        groupData,
        getAuthHeaders(),
      );
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
      const response = await axios.delete(
        `http://localhost:5000/admin/delete-group/${groupId}`,
        getAuthHeaders(),
      );
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
