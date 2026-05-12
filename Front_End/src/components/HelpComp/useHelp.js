export const useHelp = () => {
  const helpData = [
    {
      id: 1,
      en: "Login to the system",
      ar: "تسجيل الدخول للنظام",
      videoUrl: "https://www.youtube.com/watch?v=u4zgK7FO_yA&list=RDu4zgK7FO_yA&start_radio=1",
    },
    { id: 3, en: "Course registration", ar: "تسجيل المقررات", videoUrl: "" },
    { id: 4, en: "Academic schedule", ar: "الجدول الدراسي", videoUrl: "" },
    { id: 5, en: "Grades", ar: "الدرجات", videoUrl: "" },
  ];

  return { helpData };
};