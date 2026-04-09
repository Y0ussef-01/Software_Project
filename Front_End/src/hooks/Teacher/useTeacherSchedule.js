import { useState, useEffect, useMemo } from "react";

// ترتيب الأيام لعرض الجدول بشكل منطقي
const daysOrder = {
  saturday: 1,
  sunday: 2,
  monday: 3,
  tuesday: 4,
  wednesday: 5,
  thursday: 6,
  friday: 7,
};

// دالة لتحويل الوقت لنظام 24 ساعة عشان نقدر نرتب المواعيد تصاعدياً
const parseTime = (timeStr) => {
  if (!timeStr || timeStr === "TBA") return 9999;
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  if (modifier?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + parseInt(minutes, 10);
};

export default function useTeacherSchedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const encodedData = sessionStorage.getItem("teacher_profile_data");

      if (encodedData) {
        // فك تشفير الـ Base64 بأمان (يدعم اللغة العربية والرموز)
        const decodedString = decodeURIComponent(escape(atob(encodedData)));
        const parsedData = JSON.parse(decodedString);

        if (parsedData && parsedData.courses) {
          setScheduleData(parsedData.courses);
        }
      }
    } catch (error) {
      console.error("Error decoding teacher schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ترتيب الجدول حسب اليوم والوقت
  const sortedSchedule = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) return [];

    return [...scheduleData].sort((a, b) => {
      const dayA = (a.group?.appointment?.day || "").toLowerCase();
      const dayB = (b.group?.appointment?.day || "").toLowerCase();

      const orderA = daysOrder[dayA] || 99;
      const orderB = daysOrder[dayB] || 99;

      // لو الأيام مختلفة، رتب حسب اليوم
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // لو نفس اليوم، رتب حسب وقت البداية
      const timeA = parseTime(a.group?.appointment?.startTime);
      const timeB = parseTime(b.group?.appointment?.startTime);

      return timeA - timeB;
    });
  }, [scheduleData]);

  return {
    scheduleData: sortedSchedule,
    isLoading,
  };
}
