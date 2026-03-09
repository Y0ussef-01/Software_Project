import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useRegistration() {
  const encodeData = (data) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const decodeData = (encoded) => {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(encoded))));
    } catch (e) {
      return null;
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const [studentProfile, setStudentProfile] = useState(() =>
    decodeData(sessionStorage.getItem("user_data")),
  );

  const [availableCourses, setAvailableCourses] = useState(
    () => decodeData(sessionStorage.getItem("reg_courses")) || [],
  );

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isLoading, setIsLoading] = useState(
    !studentProfile || availableCourses.length === 0,
  );
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchData = async (showPageLoader = true) => {
    if (showPageLoader && !studentProfile) setIsLoading(true);
    try {
      const [profileRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:5000/student/Profile", getAuthHeaders()),
        axios.get(
          "http://localhost:5000/student/getAllCourses",
          getAuthHeaders(),
        ),
      ]);

      const profileData = profileRes.data?.student || profileRes.data || {};
      const coursesData = coursesRes.data?.courses || coursesRes.data || [];

      setStudentProfile(profileData);
      setAvailableCourses(coursesData);

      sessionStorage.setItem("user_data", encodeData(profileData));
      sessionStorage.setItem("reg_courses", encodeData(coursesData));
    } catch (error) {
      if (!studentProfile) toast.error("Failed to load registration data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(!studentProfile);
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
    if (baseCourseCode && !uniqueCoursesMap[baseCourseCode])
      uniqueCoursesMap[baseCourseCode] = courseObj.hours || row.hours || 3;
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
      toast.error("Exceeded maximum allowed hours!");
      return;
    }

    setIsActionLoading(true);
    try {
      const payload = { courseId: selectedCourseId, groupName: selectedGroup };
      const response = await axios.post(
        "http://localhost:5000/student/register-course",
        payload,
        getAuthHeaders(),
      );

      const newEntry = {
        course: selectedCourseDetails,
        groupName: selectedGroup,
      };
      const updatedProfile = {
        ...studentProfile,
        registeredCourses: [...registeredCourses, newEntry],
      };

      setStudentProfile(updatedProfile);
      sessionStorage.setItem("user_data", encodeData(updatedProfile));

      setSelectedCourseId("");
      setSelectedGroup("");
      toast.success(response.data.message || "Registered successfully!", {
        autoClose: 2000,
      });
      fetchData(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
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

      const updatedCourses = registeredCourses.filter((row) => {
        const cObj = row.course || row;
        const code =
          typeof row.course === "string"
            ? row.course
            : cObj.courseId || cObj._id || row.courseId;
        return code !== courseId;
      });

      const updatedProfile = {
        ...studentProfile,
        registeredCourses: updatedCourses,
      };
      setStudentProfile(updatedProfile);
      sessionStorage.setItem("user_data", encodeData(updatedProfile));

      toast.success("Course dropped!", { autoClose: 2000 });
      fetchData(false);
    } catch (error) {
      toast.error("Failed to drop course.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSwitchGroup = async (courseId, newGroupName) => {
    if (!courseId || !newGroupName) return;
    setIsActionLoading(true);
    try {
      const payload = { courseId, newGroupName };
      const response = await axios.put(
        "http://localhost:5000/student/switch-group",
        payload,
        getAuthHeaders(),
      );

      const updatedCourses =
        response.data.registeredCourses ||
        registeredCourses.map((row) => {
          const baseCourseCode =
            typeof row.course === "string"
              ? row.course
              : row.course?.courseId || row.courseId;
          if (baseCourseCode === courseId) {
            return { ...row, groupName: newGroupName };
          }
          return row;
        });

      const updatedProfile = {
        ...studentProfile,
        registeredCourses: updatedCourses,
      };

      setStudentProfile(updatedProfile);
      sessionStorage.setItem("user_data", encodeData(updatedProfile));

      toast.success(
        response.data.message || `Switched successfully to ${newGroupName}`,
        { autoClose: 2000 },
      );
      fetchData(false);       
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to switch group.");
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
    handleSwitchGroup,    
  };
}
