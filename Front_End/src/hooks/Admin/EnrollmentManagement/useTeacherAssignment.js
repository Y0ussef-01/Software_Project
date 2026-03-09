import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

export default function useTeacherAssignment() {
  const [searchId, setSearchId] = useState("");
  const [teacherData, setTeacherData] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allCourses, setAllCourses] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({ courseId: "", groupName: "" });
  
  const [addFormData, setAddFormData] = useState({ courseId: "", type: "", groupName: "" });

  useEffect(() => { fetchAllCourses(); }, []);

  const fetchAllCourses = async () => {
    try {
      const response = await axiosInstance.get("/admin/courses");
      if (response.data.courses) {
        setAllCourses(response.data.courses);
      } else if (Array.isArray(response.data)) {
        setAllCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
    }
  };

  const extractCodeFromGroup = (groupName) => {
    if (!groupName) return "N/A";
    const codeMatch = String(groupName).match(/\b(\d{3})\b/);
    return codeMatch ? codeMatch[1] : "N/A";
  };

  const extractGroupOnly = (groupName) => {
    if (!groupName) return "N/A";
    return String(groupName).replace(/[A-Za-z]+-\d+-/, "") || "N/A";
  };

  const extractGroupCode = (groupName) => {
    if (!groupName) return "";
    const match = String(groupName).match(/-(G\d+)-/);
    return match ? match[1] : extractGroupOnly(groupName).split("-")[0];
  };

  const extractValue = (value) => {
    if (!value) return "Unknown";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      return value.name || value.courseName || value.title || value._id || value.id || "Unknown";
    }
    return String(value);
  };

 const processTeacherCourses = (teacher) => {
  if (!teacher) return [];
  const courses =
    teacher.courses || teacher.assigned_courses ||
    teacher.assignedCourses || teacher.enrollments || [];

  if (!Array.isArray(courses) || courses.length === 0) return [];

  const seen = new Set(); 

  return courses
    .map((course, index) => {
      const courseId = String(course.courseId || course.course?._id || course._id || "");
      const courseName = extractValue(course.name || course.courseName || course.course?.name || "Unknown");
      const groupName = extractValue(course.groupName || course.group?.name || course.group || "");

      if (!courseId) return null;

      
      const groupCode = extractGroupCode(groupName); 
      const dedupeKey = `${courseId}-${groupCode}`;
      if (seen.has(dedupeKey)) return null; 
      seen.add(dedupeKey);

      return {
        _id: `${teacher._id}-${courseId}-${index}`,
        courseId,
        courseName,
        courseCode: extractCodeFromGroup(groupName),
        groupName,
        groupOnly: extractGroupOnly(groupName),
        groupCode,
        teacherId: teacher._id,
      };
    })
    .filter(Boolean);
};

  const handleSearchTeacher = async (id) => {
    const cleanSearchId = String(id).trim();
    if (!cleanSearchId) {
      setTeacherData(null);
      setTeacherCourses([]);
      setShowResults(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/admin/teacher/${cleanSearchId}?t=${Date.now()}`);
      let teacherInfo = response.data.teacher || response.data;

      if (teacherInfo) {
        setTeacherData(teacherInfo);
        const courses = processTeacherCourses(teacherInfo);
        setTeacherCourses(courses);
        setShowResults(true);
        courses.length > 0
          ? toast.success(`Found ${courses.length} courses`)
          : toast.info("Teacher found but no courses yet");
      }
    } catch (error) {
      console.error("Error searching teacher:", error);
      error.response?.status === 404
        ? toast.error("Teacher not found")
        : toast.error(error.response?.data?.message || "Failed to search teacher");
      setTeacherData(null);
      setTeacherCourses([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseName = (courseId) => {
    if (!courseId) return "Unknown";
    const course = allCourses.find((c) => c._id === courseId);
    return course ? String(course.name || courseId) : courseId;
  };

 const getGroupsForCourse = (courseId) => {
  if (!courseId) return [];
  const course = allCourses.find((c) => c._id === courseId);
  if (!course || !Array.isArray(course.groups)) return [];
  return course.groups
    .map((group) => ({
      _id: String(group._id || group.groupName || group.name || ""),
      name: String(group.groupName || group.name || ""),
      groupName: String(group.groupName || group.name || ""),
      type: String(group.type || ""),
      
      appointment: group.appointment || null,
      Room: group.Room || group.room || "",
    }))
    .filter((g) => g.groupName !== "");
};

  
  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setEditFormData({
      courseId: course.courseId,
      groupName: course.groupCode || "",
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedCourse(null);
    setEditFormData({ courseId: "", groupName: "" });
  };

  const handleEditSubmit = async () => {
    if (!selectedCourse || !editFormData.courseId || !editFormData.groupName) {
      toast.warning("Please select both course and group");
      return;
    }
    try {
      setIsLoading(true);
      await axiosInstance.delete("/admin/remove-teacher-course", {
        data: {
          teacherId: teacherData._id,
          courseId: selectedCourse.courseId,
          groupName: selectedCourse.groupCode,
        },
      });
      await axiosInstance.post("/admin/assign-teacher-course", {
        teacherId: teacherData._id,
        courseId: editFormData.courseId,
        groupName: editFormData.groupName,
      });
      await handleSearchTeacher(teacherData._id);
      handleCloseEditModal();
      toast.success("Course assignment updated successfully!");
    } catch (error) {
      console.error("Error updating:", error);
      toast.error(error.response?.data?.message || "Failed to update course assignment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDeleteModal = (course) => {
    setSelectedCourse(course);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedCourse(null);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCourse) return;
    try {
      setIsLoading(true);
      await axiosInstance.delete("/admin/remove-teacher-course", {
        data: {
          teacherId: teacherData._id,
          courseId: selectedCourse.courseId,
          groupName: selectedCourse.groupCode,
        },
      });
      await handleSearchTeacher(teacherData._id);
      handleCloseDeleteModal();
      toast.success("Course removed successfully!");
    } catch (error) {
      console.error("Error removing:", error);
      toast.error(error.response?.data?.message || "Failed to remove course.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setAddFormData({ courseId: "", type: "", groupName: "" });
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setAddFormData({ courseId: "", type: "", groupName: "" });
  };

  const handleAddSubmit = async () => {
  if (!addFormData.courseId || !addFormData.groupName) {
    toast.warning("Please select both course and group");
    return;
  }
  try {
    setIsLoading(true);
    await axiosInstance.post("/admin/assign-teacher-course", {
      teacherId: teacherData._id,
      courseId: addFormData.courseId,
      groupName: addFormData.fullGroupName || addFormData.groupName, 
    });
    await handleSearchTeacher(teacherData._id);
    handleCloseAddModal();
    toast.success("Course assigned successfully!");
  } catch (error) {
    console.error("Error adding:", error);
    toast.error(error.response?.data?.message || "Failed to assign course.");
  } finally {
    setIsLoading(false);
  }
};

  const handleClearSearch = () => {
    setSearchId("");
    setTeacherData(null);
    setTeacherCourses([]);
    setShowResults(false);
  };

  return {
    searchId, setSearchId,
    teacherData, teacherCourses,
    showResults, isLoading, allCourses,
    editModalOpen, deleteModalOpen, addModalOpen,
    selectedCourse,
    editFormData, setEditFormData,
    addFormData, setAddFormData,
    handleSearchTeacher,
    getCourseName, getGroupsForCourse,
    handleOpenEditModal, handleCloseEditModal, handleEditSubmit,
    handleOpenDeleteModal, handleCloseDeleteModal, handleDeleteSubmit,
    handleOpenAddModal, handleCloseAddModal, handleAddSubmit,
    handleClearSearch,
  };
}