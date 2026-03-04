import React, { useState, useEffect } from "react";
// ✨ التعديل 1: استدعاء Collapse لعمل حركة الظهور والاختفاء السلسة
import { Box, Typography, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";

import StudentSearchSection from "../../../components/AdminComp/StudentManagement/StudentSearchSection";
import StudentDetailsCard from "../../../components/AdminComp/StudentManagement/StudentDetailsCard";

export default function StudentManagementPage() {
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [studentData, setStudentData] = useState(null);

  // مراقبة حقل البحث
  useEffect(() => {
    if (searchId === "") {
      setShowCard(false); // 1. إعطاء أمر الاختفاء أولاً لتبدأ الحركة

      // 2. تأخير مسح البيانات حتى يكتمل الأنيميشن (نصف ثانية)
      // لو مسحنا البيانات فوراً، الكارت هيفضى وهو بيختفي وهيبقى شكله سيء
      const timer = setTimeout(() => {
        setStudentData(null);
      }, 500);

      return () => clearTimeout(timer); // تنظيف التايمر
    }
  }, [searchId]);

  const handleSimulateSearch = () => {
    if (!searchId) return;

    const mockApiResponse = {
      _id: searchId,
      name: "Ahmed",
      email: "ahmed@sci.cu.edu.eg",
      profileImg: "default.jpg",
    };

    setStudentData(mockApiResponse);
    setShowCard(true); // إظهار الكارت
  };

  const handleSimulateDelete = () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setShowCard(false);
      setSearchId("");
    }
  };

  const handleSimulateUpdate = (updatedData) => {
    setStudentData(updatedData);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: { xs: 2, md: 3, lg: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" },
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: "text.primary" }}
        >
          Student Management
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        ></Typography>
      </Box>

      <StudentSearchSection
        searchId={searchId}
        setSearchId={setSearchId}
        onSearch={handleSimulateSearch}
        onAddClick={() => navigate("/adminPanel/add-student")}
      />

      {/* ✨ التعديل 2: تغليف الكارت بمكون Collapse بدلاً من الـ CSS التقليدي */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Collapse
          in={showCard}
          unmountOnExit
          timeout={500} // مدة الحركة (نصف ثانية)
          sx={{
            width: "100%",
            maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" },
          }}
        >
          {/* محتوى الكارت */}
          <Box sx={{ pt: 1, pb: 2 }}>
            {studentData && (
              <StudentDetailsCard
                student={studentData}
                onDeleteClick={handleSimulateDelete}
                onUpdateSubmit={handleSimulateUpdate}
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
