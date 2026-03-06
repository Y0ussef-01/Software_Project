import React from "react";
import { Box, Typography, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";


import TeacherSearchSection from "../../../components/AdminComp/TeatureManagement/TeacherSearchSection";
import TeacherDetailsCard from "../../../components/AdminComp/TeatureManagement/TeacherDetailsCard";
import useTeacherManagement from "../../../hooks/Admin/TeatureManagement/useTeacherManagement";



export default function TeacherManagementPage() {
  const navigate = useNavigate();


  const {
    searchId,
    setSearchId,
    showCard,
    teacherData,
    isLoading,
    handleSearch,
    handleUpdateSubmit,
    handleDeleteClick,
  } = useTeacherManagement();

  console.log("📊 Page State:", { showCard, teacherData: teacherData?._id });

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
          🎓 Teacher Management
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Search, Edit, and Manage Teachers
        </Typography>
      </Box>

    
      <TeacherSearchSection
        searchId={searchId}
        setSearchId={setSearchId}
        onSearch={handleSearch}
      />

   
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Collapse
          in={showCard && !!teacherData}
          unmountOnExit
          timeout={500}
          sx={{
            width: "100%",
            maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" },
          }}
        >
          <Box sx={{ pt: 1, pb: 2 }}>
            {teacherData && (
              <TeacherDetailsCard
                teacher={teacherData}
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