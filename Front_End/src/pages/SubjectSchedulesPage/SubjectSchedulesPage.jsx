import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  CircularProgress,
  Autocomplete,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import useRegistration from "../../hooks/Student/useRegistration";
import { useLanguage } from "../../context/LanguageContext";
import { REGISTRATION_TRANS } from "../../utils/studentTranslations";

export default function SubjectSchedulesPage() {
  const {
    availableCourses,
    selectedCoursesForGen,
    setSelectedCoursesForGen,
    generatedSchedules,
    isGenerating,
    isActionLoading,
    handleGenerateSchedules,
    handleConfirmSchedule,
  } = useRegistration();

  const { language } = useLanguage();
  const t = REGISTRATION_TRANS[language] || REGISTRATION_TRANS["en"];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        p: { xs: 2, md: 4, lg: 5 },
        animation: "fadeInUp 0.6s ease-out",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
          <CalendarTodayIcon sx={{ color: "#152b48", fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#152b48" }}>
            {t.generateReadySchedules || "Manage Subjects & Schedules"}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Select the subjects you want to manage. The system will automatically compute combinations and find the best schedule for you.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <FormControl variant="outlined" sx={{ width: "100%", flexGrow: 1 }}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={Array.isArray(availableCourses) ? availableCourses : []}
              getOptionLabel={(option) => {
                const displayCode = option.courseCode || option.courseId || option._id || "Code";
                const displayName = option.courseName || option.name || "Name";
                return `${displayCode} - ${displayName}`;
              }}
              value={(Array.isArray(availableCourses) ? availableCourses : []).filter(c => 
                  (Array.isArray(selectedCoursesForGen) ? selectedCoursesForGen : []).includes(c._id || c.courseId)
              )}
              onChange={(event, newValue) => {
                setSelectedCoursesForGen(
                    (Array.isArray(newValue) ? newValue : []).map((c) => c._id || c.courseId)
                );
              }}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="outlined"
                      label={t.selectCoursesForGen || "Select courses"}
                      placeholder={t.chooseCourse || "Choose a course"}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                      }}
                  />
              )}
              renderTags={(value, getTagProps) =>
                (Array.isArray(value) ? value : []).map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      variant="outlined"
                      label={option.courseCode || option.courseId || option._id}
                      {...tagProps}
                    />
                  );
                })
              }
            />
          </FormControl>

          <Button
              variant="contained"
              disabled={
                  !Array.isArray(selectedCoursesForGen) ||
                  selectedCoursesForGen.length === 0 ||
                  isGenerating ||
                  isActionLoading
              }
              onClick={handleGenerateSchedules}
              startIcon={
                isGenerating ? (
                    <CircularProgress size={20} color="inherit" />
                ) : (
                    <SyncIcon />
                )
              }
              sx={{
                height: "56px",
                px: 4,
                borderRadius: "12px",
                backgroundColor: "#152b48",
                fontWeight: "bold",
                fontSize: "0.95rem",
                width: { xs: "100%", md: "auto" },
                "&:hover": { backgroundColor: "#0f1e33" },
              }}
          >
            {isGenerating ? (t.generatingSchedules || "Generating...") : (t.generateSchedulesBtn || "Generate")}
          </Button>
        </Box>

        {Array.isArray(generatedSchedules) && generatedSchedules.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: "800", color: "#152b48", mb: 3 }}>
              {t.validSchedulesFound || "Generated Schedules"}: {generatedSchedules.length}
            </Typography>
            <Grid container spacing={3}>
              {(Array.isArray(generatedSchedules) ? generatedSchedules : []).map((schedule, sIdx) => (
                <Grid item xs={12} md={6} lg={4} key={sIdx}>
                  <Card
                      elevation={0}
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1d4ed8", mb: 2 }}>
                        {t.schedule || "Schedule"} #{sIdx + 1}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {(Array.isArray(schedule) ? schedule : []).map((item, iIdx) => {
                          const courseObj = (Array.isArray(availableCourses) ? availableCourses : []).find(c => c._id === item.courseId || c.courseId === item.courseId);
                          const displayName = courseObj?.courseName || courseObj?.name || "";
                          const courseAppointments = Array.isArray(item?.appointments) 
                            ? item.appointments 
                            : Array.isArray(item?.schedule) 
                              ? item.schedule 
                              : courseObj 
                                ? (Array.isArray(courseObj.groups) ? courseObj.groups : []).filter(g => g.groupName === item.groupName || g.name === item.groupName)
                                : [];

                          return (
                            <Paper
                              key={iIdx}
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: "12px",
                                bgcolor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#152b48" }}>
                                  {item.courseId} {displayName && `- ${displayName}`}
                                </Typography>
                                <Chip
                                  label={`${t.grp || "Group"}: ${item.groupName}`}
                                  size="small"
                                  color="primary"
                                  sx={{ fontWeight: "bold", height: "24px", fontSize: "0.75rem" }}
                                />
                              </Box>
                              
                              {courseAppointments.length === 0 ? (
                                <Typography variant="caption" color="text.secondary">
                                  {t.tba || "TBA"}
                                </Typography>
                              ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                  {(Array.isArray(courseAppointments) ? courseAppointments : []).map((appt, aIdx) => (
                                    <Box key={aIdx} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, p: 1, bgcolor: "#ffffff", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: "80px" }}>
                                        <Chip 
                                          label={appt.type || "TBA"} 
                                          size="small" 
                                          sx={{ height: "20px", fontSize: "0.65rem", fontWeight: "bold", bgcolor: "#e0f2fe", color: "#0284c7" }} 
                                        />
                                      </Box>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: "100px" }}>
                                        <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                        <Typography variant="caption" sx={{ fontWeight: "bold", textTransform: "capitalize", color: "#475569" }}>
                                          {appt.day || appt.appointment?.day || "TBA"}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: "110px" }}>
                                        <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                        <Typography variant="caption" sx={{ color: "#475569" }}>
                                          {appt.startTime || appt.appointment?.startTime || "TBA"} - {appt.endTime || appt.appointment?.endTime || "TBA"}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                        <Typography variant="caption" sx={{ color: "#475569" }}>
                                          Room: {appt.Room || "TBA"}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                            </Paper>
                          );
                        })}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        disabled={isActionLoading}
                        onClick={() => handleConfirmSchedule(Array.isArray(schedule) ? schedule : [])}
                        sx={{ borderRadius: "8px", fontWeight: "bold", textTransform: "none", mt: 1 }}
                      >
                        {t.confirmThisSchedule || "Confirm Schedule"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}
