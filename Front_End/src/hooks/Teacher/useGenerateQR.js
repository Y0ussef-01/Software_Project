import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export const useGenerateQR = () => {
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [groups, setGroups] = useState([]);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [qrToken, setQrToken] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      setIsLoadingGroups(true);
      try {
        const response = await axiosInstance.get("/teacher/profile");

        const coursesData =
          response.data?.courses || response.data?.Teacher?.courses || [];

        if (!Array.isArray(coursesData) || coursesData.length === 0) {
          setTeacherGroups([]);
          setIsLoadingGroups(false);
          return;
        }

        const formattedGroups = coursesData
          .filter((item) => {
            return item?.group?.type?.toLowerCase() === "lecture";
          })
          .map((item) => {
            if (item?.group?._id && item?.course?.name) {
              return {
                id: String(item.group._id),
                name: `${item.course.name} - ${item.group.groupName} (Lecture)`,
                courseId: String(item.course._id),
              };
            }
            return null;
          })
          .filter(Boolean);

        const uniqueGroups = Array.from(
          new Map(formattedGroups.map((item) => [item.id, item])).values(),
        );

        setTeacherGroups(uniqueGroups);
      } catch (error) {
        console.error("Profile Fetch Error:", error.response || error);
        toast.error("Failed to load your assigned courses.");
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchTeacherProfile();
  }, []);

  const fetchQRToken = async (isInitialCall = false) => {
    try {
      const response = await axiosInstance.post("/teacher/generate-qr", {
        groups,
        sessionNumber: Number(sessionNumber),
      });

      setQrToken(response.data.qrToken);
      setTimeLeft(10);

      if (isInitialCall) {
        toast.success("QR Code generated successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate QR Token",
      );
      stopGenerating();
    }
  };

  const startGenerating = () => {
    if (groups.length === 0) {
      toast.warning("Please select at least one lecture");
      return;
    }

    const selectedCourseIds = new Set();

    groups.forEach((selectedGroupId) => {
      const groupData = teacherGroups.find((g) => g.id === selectedGroupId);
      if (groupData) {
        selectedCourseIds.add(groupData.courseId);
      }
    });

    if (selectedCourseIds.size > 1) {
      toast.error("You must select groups from ONLY ONE course at a time.");
      return;
    }

    if (!sessionNumber || sessionNumber < 1) {
      toast.warning("Please enter a valid session number");
      return;
    }

    setIsGenerating(true);
    fetchQRToken(true);

    intervalRef.current = setInterval(() => {
      fetchQRToken(false);
    }, 10000);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);
  };

  const stopGenerating = (e) => {
    setIsGenerating(false);
    setQrToken(null);
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);

    if (e && e.type) {
      toast.info("QR Code generation stopped.");
    }
  };

  useEffect(() => {
    return () => stopGenerating();
  }, []);

  return {
    teacherGroups,
    isLoadingGroups,
    groups,
    setGroups,
    sessionNumber,
    setSessionNumber,
    qrToken,
    isGenerating,
    timeLeft,
    startGenerating,
    stopGenerating,
  };
};
