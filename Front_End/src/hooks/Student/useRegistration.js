import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
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
  const [pendingSwapRequests, setPendingSwapRequests] = useState([]);
  const [sentSwapRequests, setSentSwapRequests] = useState([]);

  const [selectedCoursesForGen, setSelectedCoursesForGen] = useState([]);
  const [generatedSchedules, setGeneratedSchedules] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchPendingSwaps = async () => {
    try {
      const response = await axiosInstance.get("/student/get_pending_requests");
      const rawData = response.data?.requests || response.data?.data || response.data || [];
      setPendingSwapRequests(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      console.error("Failed to fetch pending swap requests", error);
    }
  };

  const fetchSentSwaps = async () => {
    try {
      const response = await axiosInstance.get("/student/sent-swap-requests");
      const rawData = response.data?.requests || response.data?.data || response.data || [];
      const validData = Array.isArray(rawData) ? rawData : [];

      const grouped = validData.reduce((acc, curr) => {
        const courseId = curr.courseId?._id || curr.courseId;
        const targetGroupName = curr.receiverGroupName || curr.targetGroupName;
        const groupKey = `${courseId}_${targetGroupName}`;

        if (!acc[groupKey]) {
          acc[groupKey] = { ...curr, relatedIds: [curr._id] };
        } else {
          acc[groupKey].relatedIds.push(curr._id);
        }
        return acc;
      }, {});

      setSentSwapRequests(Object.values(grouped));
    } catch (error) {
      console.error("Failed to fetch sent swap requests", error);
    }
  };

  const fetchData = async (showPageLoader = true) => {
    if (showPageLoader && !studentProfile) setIsLoading(true);
    try {
      const [profileRes, coursesRes] = await Promise.all([
        axiosInstance.get("/student/Profile"),
        axiosInstance.get("/student/getAllCourses"),
      ]);

      const profileData = profileRes.data?.student || profileRes.data || {};
      const rawCoursesData = coursesRes.data?.courses || coursesRes.data || [];
      const coursesData = Array.isArray(rawCoursesData) ? rawCoursesData : [];

      setStudentProfile(profileData);
      setAvailableCourses(coursesData);

      sessionStorage.setItem("user_data", encodeData(profileData));
      sessionStorage.setItem("reg_courses", encodeData(coursesData));

      await Promise.all([fetchPendingSwaps(), fetchSentSwaps()]);
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
      const response = await axiosInstance.post("/student/register-course", payload);

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
      await axiosInstance.delete("/student/drop-course", {
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
      const response = await axiosInstance.put("/student/switch-group", payload);

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

  const handleSwapRequest = async (courseId, targetGroupName) => {
    if (!courseId || !targetGroupName) return;
    setIsActionLoading(true);
    try {
      const payload = { courseId, targetGroupName };
      const response = await axiosInstance.post("/student/swap-request", payload);
      toast.success(response.data.message || "Swap request sent successfully!", { autoClose: 2000 });
      fetchSentSwaps();
      fetchData(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send swap request.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSwapRespond = async (requestId, action) => {
    if (!requestId || !action) return;
    setIsActionLoading(true);
    try {
      const payload = { requestId, action };
      const response = await axiosInstance.post("/student/swap-respond", payload);

      toast.success(response.data.message || `Swap request ${action.toLowerCase()}!`, { autoClose: 2000 });
      fetchData(false);
    } catch (error) {
      const msg = error.response?.data?.message || "";
      if (
          (error.response?.status === 400 && msg.toLowerCase().includes("too late")) ||
          error.response?.status === 404
      ) {
        toast.error("Too late! This request was already accepted by someone else.");
      } else {
        toast.error(msg || `Failed to ${action.toLowerCase()} swap request.`);
      }
      fetchPendingSwaps();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelSwapRequest = async (relatedIds) => {
    if (!relatedIds || relatedIds.length === 0) return;
    setIsActionLoading(true);
    try {
      await Promise.all(
          relatedIds.map((id) =>
              axiosInstance.delete(`/student/cancel-swap-request/${id}`)
          )
      );

      toast.success("Swap request cancelled successfully!", { autoClose: 2000 });
      fetchSentSwaps();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel swap request.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleGenerateSchedules = async () => {
    if (!Array.isArray(selectedCoursesForGen) || selectedCoursesForGen.length === 0) return;
    setIsGenerating(true);
    try {
      const payload = { courseIds: selectedCoursesForGen };
      const response = await axiosInstance.post("/student/generate-schedules", payload);
      const rawData = response.data?.schedules || response.data || [];
      const validData = Array.isArray(rawData) ? rawData : [];
      setGeneratedSchedules(validData);
      if (validData.length === 0) {
        toast.info("No valid schedules found for selected courses.");
      } else {
        toast.success(`${validData.length} schedules generated!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate schedules.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmSchedule = async (schedule) => {
    if (!Array.isArray(schedule) || schedule.length === 0) return;

    let scheduleTotalHours = 0;
    for (const item of schedule) {
      const courseObj = availableCourses.find(c => c._id === item.courseId || c.courseId === item.courseId);
      const hours = courseObj?.hours || 3;
      scheduleTotalHours += hours;
    }

    if (registeredHours + scheduleTotalHours > maxHours) {
      toast.error(`Cannot confirm schedule. It exceeds your maximum allowed hours (${maxHours} Hrs).`);
      return;
    }

    setIsActionLoading(true);
    try {
      for (const item of schedule) {
        const payload = { courseId: item.courseId, groupName: item.groupName };
        await axiosInstance.post("/student/register-course", payload);
      }
      toast.success("Schedule confirmed and registered successfully!", { autoClose: 2000 });
      setGeneratedSchedules([]);
      setSelectedCoursesForGen([]);
      fetchData(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm schedule completely.");
      fetchData(false);
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
    pendingSwapRequests,
    sentSwapRequests,
    handleRegister,
    handleDropCourse,
    handleSwitchGroup,
    handleSwapRequest,
    handleSwapRespond,
    handleCancelSwapRequest,
    fetchPendingSwaps,
    fetchSentSwaps,
    selectedCoursesForGen,
    setSelectedCoursesForGen,
    generatedSchedules,
    setGeneratedSchedules,
    isGenerating,
    handleGenerateSchedules,
    handleConfirmSchedule,
  };
}