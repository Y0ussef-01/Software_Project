import React from "react";
import {
  Box,
  Typography,
  Collapse,
  Avatar,
  Button,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";

import EnrollmentSearchSection from "../../../components/AdminComp/EnrollmentManagement/EnrollmentSearchSection";
import EnrollmentTable from "../../../components/AdminComp/EnrollmentManagement/EnrollmentTable";
import EditEnrollmentModal from "../../../components/AdminComp/EnrollmentManagement/EditEnrollmentModal";
import DeleteConfirmModal from "../../../components/AdminComp/EnrollmentManagement/DeleteConfirmModal";
import AddEnrollmentModal from "../../../components/AdminComp/EnrollmentManagement/AddEnrollmentModal";
import useEnrollmentManagement from "../../../hooks/Admin/EnrollmentManagement/useEnrollmentManagement";

export default function EnrollmentManagementPage() {
  const theme = useTheme();

  const {
    searchId, setSearchId,
    studentData, studentEnrollments,
    isLoading, showResults,
    handleSearchStudent,
    editModalOpen, deleteModalOpen, addModalOpen,
    handleOpenEditModal, handleCloseEditModal, handleEditSubmit,
    editFormData, setEditFormData,
    addFormData, setAddFormData,
    selectedEnrollment,
    handleOpenDeleteModal, handleCloseDeleteModal, handleDeleteSubmit,
    handleOpenAddModal, handleCloseAddModal, handleAddSubmit,
    allCourses,
    getCourseName, getGroupsForCourse,
    refreshStudentEnrollments,
  } = useEnrollmentManagement();

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", p: { xs: 2, md: 3, lg: 4 } }}>

    
      <Box sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" }, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          
          <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
            Enrollment Management
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: 500 }}>
          Search for a student and manage their course enrollments
        </Typography>
      </Box>

  
      <EnrollmentSearchSection
        searchId={searchId}
        setSearchId={setSearchId}
        onSearch={() => handleSearchStudent(searchId)}
        isLoading={isLoading}
      />

      
      {studentData && showResults && (
        <Box sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" }, mb: 3 }}>
          <Box
            sx={{
              position: "relative",
              p: { xs: 3, md: 4 },
              borderRadius: "20px",
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.palette.mode === "dark"
                ? "0px 10px 40px rgba(0,0,0,0.4)"
                : "0px 10px 40px rgba(21,43,72,0.08)",
              overflow: "hidden",
            }}
          >
          
            <Box sx={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: "8px",
              background: theme.palette.mode === "dark"
                ? "linear-gradient(180deg, #90caf9 0%, #42a5f5 100%)"
                : "linear-gradient(180deg, #152b48 0%, #3b6ba5 100%)",
            }} />

            
            <Box sx={{
              position: "absolute", top: "-15%", right: "-5%",
              width: { xs: "200px", md: "300px" }, height: { xs: "200px", md: "300px" },
              borderRadius: "50%",
              background: theme.palette.mode === "dark"
                ? "radial-gradient(circle, rgba(144,202,249,0.06) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(25,118,210,0.06) 0%, rgba(255,255,255,0) 70%)",
              zIndex: 0, pointerEvents: "none",
            }} />

            <Box sx={{
              position: "relative", zIndex: 1,
              display: "flex", flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between", gap: 3,
            }}>
             
              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Avatar
                  src={studentData.profileImg}
                  alt={studentData.name}
                  sx={{
                    width: { xs: 70, md: 90 }, height: { xs: 70, md: 90 },
                    fontSize: "2rem", bgcolor: theme.palette.primary.main, color: "#fff",
                    boxShadow: "0px 8px 20px rgba(21,43,72,0.15)",
                    border: `4px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {studentData.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.text.primary, mb: 0.5 }}>
                    {studentData.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                    ID: {studentData._id}
                  </Typography>
                  {studentData.department && (
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, mt: 0.3 }}>
                      {studentData.department}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <Box sx={{
                  textAlign: "center", p: { xs: 1.5, md: 2 },
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc",
                  borderRadius: "14px", border: `1px solid ${theme.palette.divider}`,
                  minWidth: "110px", transition: "all 0.3s ease",
                  "&:hover": { borderColor: theme.palette.primary.main, transform: "translateY(-3px)", boxShadow: "0px 8px 20px rgba(21,43,72,0.08)" },
                }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block" }}>
                    Total Courses
                  </Typography>
                  <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 900, mt: 0.5 }}>
                    {studentEnrollments.length}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddModal}
                  disabled={isLoading}
                  sx={{
                    borderRadius: "12px", textTransform: "none", fontWeight: 600,
                    px: 2.5, py: 1.2,
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.mode === "dark" ? "#42a5f5" : "#0f1e33",
                    },
                  }}
                >
                  Add Course
                </Button>

                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={refreshStudentEnrollments}
                  disabled={isLoading}
                  sx={{
                    borderRadius: "12px", textTransform: "none", fontWeight: 600,
                    px: 2.5, py: 1.2, borderWidth: "2px",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      borderWidth: "2px",
                      backgroundColor: theme.palette.mode === "dark" ? "rgba(144,202,249,0.08)" : "rgba(25,118,210,0.04)",
                    },
                  }}
                >
                  {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Collapse
          in={showResults}
          unmountOnExit
          timeout={500}
          sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" } }}
        >
          <Box sx={{ pt: 1, pb: 2, animation: "fadeInUp 0.5s ease-out" }}>
            <EnrollmentTable
              enrollments={studentEnrollments}
              onEditClick={handleOpenEditModal}
              onDeleteClick={handleOpenDeleteModal}
              isLoading={isLoading}
              allCourses={allCourses}
            />
          </Box>
        </Collapse>
      </Box>

      <EditEnrollmentModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        enrollment={selectedEnrollment}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        allCourses={allCourses}
        getCourseName={getCourseName}
        isLoading={isLoading}
        getGroupsForCourse={getGroupsForCourse}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteSubmit}
        enrollment={selectedEnrollment}
        isLoading={isLoading}
      />

      <AddEnrollmentModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddSubmit}
        addFormData={addFormData}
        setAddFormData={setAddFormData}
        allCourses={allCourses}
        isLoading={isLoading}
        getGroupsForCourse={getGroupsForCourse}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}