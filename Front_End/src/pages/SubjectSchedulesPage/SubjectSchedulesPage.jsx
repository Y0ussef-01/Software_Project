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
  Chip
} from "@mui/material";
import GeneratedSchedulesList from "../../components/ScheduleResults/GeneratedSchedulesList";
import SyncIcon from "@mui/icons-material/Sync";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import useRegistration from "../../hooks/Student/useRegistration";
import { useLanguage } from "../../context/LanguageContext";
import { REGISTRATION_TRANS } from "../../utils/studentTranslations";
const DAY_OPTIONS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
        numberOfDays,
        setNumberOfDays,
        offDays,
        setOffDays,
    } = useRegistration();

    const DAY_OPTIONS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
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
            <FormControl variant="outlined" sx={{ width: { xs: "100%", md: "400px" } }}>                <TextField
                    type="number"
                    label={t.numberOfDaysLabel || "Number of days"}
                    placeholder={t.numberOfDaysHint || ""}
                    value={numberOfDays}
                    onChange={(e) => {
                        const val = e.target.value;
                        setNumberOfDays(val === "" ? "" : Math.max(1, Number(val)));
                    }}
                    inputProps={{ min: 1, max: 7 }}
                    sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                />
            </FormControl>

            <FormControl variant="outlined" sx={{ width: "100%", flexGrow: 1 }}>
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={DAY_OPTIONS}
                    getOptionLabel={(option) => (t.dayNames && t.dayNames[option]) || option}
                    value={offDays}
                    onChange={(event, newValue) => setOffDays(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label={t.offDaysLabel || "Days off"}
                            placeholder={t.chooseOffDays || "Select days"}
                            sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                            }}
                        />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            return (
                                <Chip
                                    key={key}
                                    variant="outlined"
                                    label={(t.dayNames && t.dayNames[option]) || option}
                                    {...tagProps}
                                    sx={{
                                        borderColor: "#152b48",
                                        color: "#152b48",
                                        fontWeight: 600,
                                        "& .MuiChip-deleteIcon": {
                                            color: "#152b48",
                                            "&:hover": { color: "#0f1e33" },
                                        },
                                    }}
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

          <GeneratedSchedulesList
              generatedSchedules={generatedSchedules}
              availableCourses={availableCourses}
              isActionLoading={isActionLoading}
              handleConfirmSchedule={handleConfirmSchedule}
              t={t}
          />
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
