import React from "react";
import {
  Box,
  Typography,
  Collapse,
  Avatar,
  Button,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import TeacherSearchSection from "../../../components/AdminComp/EnrollmentManagement/TeacherSearchSection";
import TeacherCoursesTable from "../../../components/AdminComp/EnrollmentManagement/TeacherCoursesTable";
import EditTeacherCourseModal from "../../../components/AdminComp/EnrollmentManagement/EditTeacherCourseModal";
import DeleteTeacherCourseModal from "../../../components/AdminComp/EnrollmentManagement/DeleteTeacherCourseModal";
import AddTeacherCourseModal from "../../../components/AdminComp/EnrollmentManagement/AddTeacherCourseModal";
import useTeacherAssignment from "../../../hooks/Admin/EnrollmentManagement/useTeacherAssignment";

export default function TeacherAssignmentPage() {
  const theme = useTheme();

  const {
    searchId, setSearchId,
    teacherData, teacherCourses,
    isLoading, showResults,
    handleSearchTeacher,
    editModalOpen, deleteModalOpen, addModalOpen,
    handleOpenEditModal, handleCloseEditModal, handleEditSubmit,
    editFormData, setEditFormData,
    selectedCourse,
    handleOpenDeleteModal, handleCloseDeleteModal, handleDeleteSubmit,
    handleOpenAddModal, handleCloseAddModal, handleAddSubmit,
    addFormData, setAddFormData,
    allCourses, getCourseName, getGroupsForCourse,
  } = useTeacherAssignment();

  const uniqueCoursesCount = new Set(teacherCourses.map((c) => c.courseId)).size;

  return (
    <Box sx={{
      width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", p: { xs: 2, md: 3, lg: 4 },
    }}>

      <Box sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" }, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
          Teacher Course Assignments
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: 500 }}>
          Search for a teacher and manage their course assignments
        </Typography>
      </Box>

      <TeacherSearchSection
        searchId={searchId}
        setSearchId={setSearchId}
        onSearch={() => handleSearchTeacher(searchId)}
        isLoading={isLoading}
      />

      {teacherData && showResults && (
        <Box sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" }, mb: 3 }}>
          <Box sx={{
            position: "relative", p: { xs: 3, md: 4 },
            borderRadius: "20px", backgroundColor: theme.palette.background.paper,
            boxShadow: theme.palette.mode === "dark"
              ? "0px 10px 40px rgba(0,0,0,0.4)"
              : "0px 10px 40px rgba(21,43,72,0.08)",
            overflow: "hidden",
          }}>
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
                <Avatar src={teacherData.profileImg} alt={teacherData.name} sx={{
                  width: { xs: 70, md: 90 }, height: { xs: 70, md: 90 },
                  fontSize: "2rem", bgcolor: theme.palette.primary.main, color: "#fff",
                  boxShadow: "0px 8px 20px rgba(21,43,72,0.15)",
                  border: `4px solid ${theme.palette.background.paper}`,
                }}>
                  {teacherData.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.text.primary, mb: 0.5 }}>
                    Dr. {teacherData.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                    ID: {teacherData._id}
                  </Typography>
                  {teacherData.department && (
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500, mt: 0.3 }}>
                      {teacherData.department}
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
                  <Typography variant="caption" sx={{
                    color: theme.palette.text.secondary, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.5px", display: "block",
                  }}>
                    Total Courses
                  </Typography>
                  <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 900, mt: 0.5 }}>
                    {uniqueCoursesCount}
                  </Typography>
                </Box>

                <Button variant="contained" startIcon={<AddIcon />}
                  onClick={handleOpenAddModal}
                  sx={{
                    borderRadius: "12px", textTransform: "none", fontWeight: 600,
                    px: 2.5, py: 1.2,
                    boxShadow: theme.palette.mode === "dark"
                      ? "0 8px 20px rgba(0,0,0,0.5)"
                      : "0 8px 20px rgba(25,118,210,0.25)",
                  }}>
                  Add Course
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Collapse in={showResults} unmountOnExit timeout={500}
          sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" } }}>
          <Box sx={{ pt: 1, pb: 2, animation: "fadeInUp 0.5s ease-out" }}>
            <TeacherCoursesTable
              courses={teacherCourses}
              onEditClick={handleOpenEditModal}
              onDeleteClick={handleOpenDeleteModal}
              isLoading={isLoading}
              allCourses={allCourses}
            />
          </Box>
        </Collapse>
      </Box>

      <EditTeacherCourseModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        course={selectedCourse}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        allCourses={allCourses}
        getCourseName={getCourseName}
        isLoading={isLoading}
        getGroupsForCourse={getGroupsForCourse}
      />

      <DeleteTeacherCourseModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteSubmit}
        course={selectedCourse}
        isLoading={isLoading}
      />

      <AddTeacherCourseModal
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