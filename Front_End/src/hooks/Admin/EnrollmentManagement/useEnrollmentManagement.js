import { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

export default function useEnrollmentManagement() {
  const [searchId, setSearchId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allCourses, setAllCourses] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false); // ✅
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [editFormData, setEditFormData] = useState({ courseId: "", groupId: "" });
  const [addFormData, setAddFormData] = useState({ courseId: "", groupName: "" }); // ✅

  useEffect(() => { fetchAllCourses(); }, []);

  const fetchAllCourses = async () => {
    try {
      const response = await axiosInstance.get("/admin/courses");
      if (response.data && response.data.courses) {
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

  const processEnrollments = (student) => {
    if (!student) return [];
    const courses =
      student.courses || student.registeredCourses ||
      student.enrollments || student.enrolled_courses || [];

    if (!Array.isArray(courses) || courses.length === 0) return [];

    return courses
      .map((course, index) => {
        const courseId = String(
          course.courseId || course.course?._id || course.course?.id || course._id || ""
        );
        const courseName = extractValue(
          course.name || course.courseName || course.course?.name || "Unknown"
        );
        const groupName = extractValue(
          course.groupName || course.group?.name || course.group || ""
        );

        if (!courseId) return null;

        return {
          _id: `${student._id}-${courseId}-${index}`,
          courseId,
          courseName,
          courseCode: extractCodeFromGroup(groupName),
          groupName,
          groupOnly: extractGroupOnly(groupName),
          groupCode: extractGroupCode(groupName),
          studentId: student._id,
          appointment: course.appointment || null,
          Room: course.Room || course.room || "",
          type: course.type || "",
          hours: course.hours || 3,
        };
      })
      .filter(Boolean);
  };

  const handleSearchStudent = async (id) => {
    const cleanSearchId = String(id).trim();
    if (!cleanSearchId) {
      setStudentData(null);
      setStudentEnrollments([]);
      setShowResults(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/admin/student/${cleanSearchId}?t=${Date.now()}`);

      if (response.data) {
        setStudentData(response.data);
        const enrollments = processEnrollments(response.data);
        setStudentEnrollments(enrollments);
        setShowResults(true);
        enrollments.length > 0
          ? toast.success(`Found ${enrollments.length} enrollments`)
          : toast.info("Student found but no enrollments yet");
      }
    } catch (error) {
      console.error("Error searching student:", error);
      error.response?.status === 404
        ? toast.error("Student not found")
        : toast.error(error.response?.data?.message || "Failed to search student");
      setStudentData(null);
      setStudentEnrollments([]);
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
        capacity: Number(group.capacity) || 50,
        appointment: group.appointment || null, // ✅
        Room: group.Room || group.room || "",   // ✅
      }))
      .filter((g) => g.groupName !== "");
  };

  // ── Edit ──────────────────────────────────────────
  const handleOpenEditModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setEditFormData({
      courseId: enrollment.courseId,
      groupId: enrollment.groupCode || "",
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedEnrollment(null);
    setEditFormData({ courseId: "", groupId: "" });
  };

  const handleEditSubmit = async () => {
    if (!selectedEnrollment || !editFormData.courseId || !editFormData.groupId) {
      toast.warning("Please select both course and group");
      return;
    }
    try {
      setIsLoading(true);
      await axiosInstance.delete("/admin/drop-student-course", {
        data: {
          studentId: studentData._id,
          courseId: selectedEnrollment.courseId,
        },
      });
      await axiosInstance.post("/admin/assign-student-course", {
        studentId: studentData._id,
        courseId: editFormData.courseId,
        groupName: editFormData.groupId,
      });
      await handleSearchStudent(studentData._id);
      handleCloseEditModal();
      toast.success("Enrollment updated successfully!");
    } catch (error) {
      console.error("Error updating enrollment:", error);
      toast.error(error.response?.data?.message || "Failed to update enrollment.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────
  const handleOpenDeleteModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedEnrollment) return;
    try {
      setIsLoading(true);
      await axiosInstance.delete("/admin/drop-student-course", {
        data: {
          studentId: studentData._id,
          courseId: selectedEnrollment.courseId,
        },
      });
      await handleSearchStudent(studentData._id);
      handleCloseDeleteModal();
      toast.success("Course removed successfully!");
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast.error(error.response?.data?.message || "Failed to remove course.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Add ✅ ────────────────────────────────────────
  const handleOpenAddModal = () => {
    setAddFormData({ courseId: "", groupName: "" });
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setAddFormData({ courseId: "", groupName: "" });
  };

  const handleAddSubmit = async () => {
    if (!addFormData.courseId || !addFormData.groupName) {
      toast.warning("Please select both course and group");
      return;
    }
    try {
      setIsLoading(true);
      await axiosInstance.post("/admin/assign-student-course", {
        studentId: studentData._id,
        courseId: addFormData.courseId,
        groupName: addFormData.groupName,
      });
      await handleSearchStudent(studentData._id);
      handleCloseAddModal();
      toast.success("Course enrolled successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll course.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStudentEnrollments = async () => {
    if (studentData?._id) await handleSearchStudent(studentData._id);
  };

  const handleClearSearch = () => {
    setSearchId("");
    setStudentData(null);
    setStudentEnrollments([]);
    setShowResults(false);
  };

  return {
    searchId, setSearchId,
    studentData, studentEnrollments,
    showResults, isLoading, allCourses,
    editModalOpen, deleteModalOpen, addModalOpen, // ✅
    selectedEnrollment,
    editFormData, setEditFormData,
    addFormData, setAddFormData,                  // ✅
    handleSearchStudent,
    getCourseName, getGroupsForCourse,
    handleOpenEditModal, handleCloseEditModal, handleEditSubmit,
    handleOpenDeleteModal, handleCloseDeleteModal, handleDeleteSubmit,
    handleOpenAddModal, handleCloseAddModal, handleAddSubmit, // ✅
    handleClearSearch, refreshStudentEnrollments,
  };
}