import React from "react";
import { Box, Typography, Collapse } from "@mui/material";

import StudentSearchSection from "../../../components/AdminComp/StudentManagement/StudentSearchSection";
import StudentDetailsCard from "../../../components/AdminComp/StudentManagement/StudentDetailsCard";
import CourseStudentsFilter from "../../../components/AdminComp/StudentManagement/CourseStudentsFilter";

import useStudentManagement from "../../../hooks/Admin/StudentManagement/useStudentManagement";

export default function StudentManagementPage() {
  const {
    searchId,
    setSearchId,
    showCard,
    studentData,
    handleSearch,
    handleUpdateSubmit,
    handleDeleteClick,
  } = useStudentManagement();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: { xs: 2, md: 3, lg: 4 },
        animation: "fadeInUp 0.45s ease-out",
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(18px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* ── Page title ── */}
      <Box sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" }, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary", mb: 0.5 }}>
          Student Management
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: 500 }}>
          Search, Edit, and Manage Students
        </Typography>
      </Box>

      {/* ── Search bar ── */}
      <StudentSearchSection
        searchId={searchId}
        setSearchId={setSearchId}
        onSearch={handleSearch}
      />

      {/* ── Filter - بدون token prop لأن axiosInstance بيتعامل معاه ── */}
      <Box sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" }, mb: 1 }}>
        <CourseStudentsFilter />
      </Box>

      {/* ── Student details card ── */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Collapse
          in={showCard}
          unmountOnExit
          timeout={500}
          sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" } }}
        >
          <Box sx={{ pt: 1, pb: 2 }}>
            {studentData && (
              <StudentDetailsCard
                student={studentData}
                onDeleteClick={handleDeleteClick}
                onUpdateSubmit={handleUpdateSubmit}
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}