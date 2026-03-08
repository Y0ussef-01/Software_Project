import React from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ScienceIcon from "@mui/icons-material/Science";

import useAppointments from "../../hooks/Student/useAppointments";

export default function AppointmentsComp() {
  const theme = useTheme();
  const { courses, isLoading } = useAppointments();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={50} sx={{ color: "#152b48" }} />
      </Box>
    );
  }

  const groupSessionsByName = (groupsArray) => {
    if (!groupsArray || !Array.isArray(groupsArray)) return [];

    const groupedData = {};

    groupsArray.forEach((session) => {
      const gName = session.groupName || "Unknown";

      if (!groupedData[gName]) {
        const enrolledCount = Array.isArray(session.enrolledStudents)
          ? session.enrolledStudents.length
          : 0;
        const totalCap = session.capacity || 100;

        groupedData[gName] = {
          groupName: gName,
          capacity: totalCap,
          availableSeats: totalCap - enrolledCount,
          sessions: [],
        };
      }

      groupedData[gName].sessions.push(session);
    });

    return Object.values(groupedData).sort((a, b) =>
      a.groupName.localeCompare(b.groupName),
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        gap: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: "#152b48",
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          Courses Schedule
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all available courses, their specific groups, and detailed
          lecture/lab schedules.
        </Typography>
      </Box>

      {courses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "24px",
            bgcolor: "#f8fafc",
            border: "1px dashed #e2e8f0",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No courses available at the moment.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {courses.map((course) => {
            const groupedGroups = groupSessionsByName(course.groups);

            return (
              <Paper
                key={course._id}
                elevation={0}
                sx={{
                  width: "100%",
                  borderRadius: "24px",
                  boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
                  borderLeft: "8px solid #152b48",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#fff",
                }}
              >
                <Box
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    bgcolor: "#fdfdfd",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#f1f5f9",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ClassIcon sx={{ color: "#152b48", fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: "#152b48",
                          lineHeight: 1.2,
                          mb: 0.5,
                        }}
                      >
                        {course.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 700 }}
                      >
                        Code: {course._id}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`${course.hours} Credit Hours`}
                    sx={{
                      fontWeight: "900",
                      bgcolor: "#e0f2fe",
                      color: "#0284c7",
                      borderRadius: "8px",
                      px: 1,
                    }}
                  />
                </Box>

                <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#fff" }}>
                  {groupedGroups.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      No groups assigned yet.
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",        
                        gap: 3,    
                        alignItems: "stretch",   
                      }}
                    >
                      {groupedGroups.map((group, idx) => {
                        const isFull = group.availableSeats <= 0;

                        return (
                          <Box
                            key={idx}
                            sx={{
                              flex: "1 1 0",
                              minWidth: { xs: "100%", sm: "280px" },
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%", 
                                border: "1px solid #e2e8f0",
                                borderRadius: "16px",
                                overflow: "hidden",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderColor: "#cbd5e1",
                                  boxShadow: "0px 4px 15px rgba(0,0,0,0.03)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  p: 2,
                                  bgcolor: "#f8fafc",
                                  borderBottom: "1px solid #e2e8f0",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <GroupsIcon
                                    sx={{ color: "#64748b", fontSize: 20 }}
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 800, color: "#1e293b" }}
                                  >
                                    Group {group.groupName}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={
                                    isFull
                                      ? "Full"
                                      : `${group.availableSeats} Left`
                                  }
                                  size="small"
                                  sx={{
                                    fontWeight: "bold",
                                    bgcolor: isFull ? "#ffe4e6" : "#dcfce7",
                                    color: isFull ? "#e11d48" : "#16a34a",
                                    borderRadius: "6px",
                                  }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  p: 1.5,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1.5,
                                  flexGrow: 1,          
                                  bgcolor: "#fff",
                                }}
                              >
                                {group.sessions.map((session, sIdx) => {
                                  const isLecture = session.type === "Lecture";
                                  return (
                                    <Box
                                      key={sIdx}
                                      sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 1.5,
                                        p: 1.5,
                                        bgcolor: "#fdfdfd",
                                        border: "1px solid #f1f5f9",
                                        borderRadius: "12px",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          minWidth: "45px",
                                          p: 1,
                                          bgcolor: isLecture
                                            ? "#f1f5f9"
                                            : "#fff1f2",
                                          borderRadius: "10px",
                                          color: isLecture
                                            ? "#475569"
                                            : "#e11d48",
                                        }}
                                      >
                                        {isLecture ? (
                                          <AutoStoriesIcon fontSize="small" />
                                        ) : (
                                          <ScienceIcon fontSize="small" />
                                        )}
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: "bold",
                                            mt: 0.5,
                                            fontSize: "0.6rem",
                                          }}
                                        >
                                          {isLecture ? "LEC" : "LAB"}
                                        </Typography>
                                      </Box>

                                      <Box
                                        sx={{
                                          flexGrow: 1,
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 0.5,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <CalendarTodayIcon
                                            sx={{
                                              fontSize: 14,
                                              color: "#94a3b8",
                                            }}
                                          />
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              fontWeight: 700,
                                              color: "#334155",
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {session.appointment?.day || "TBA"}
                                          </Typography>
                                        </Box>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <AccessTimeIcon
                                            sx={{
                                              fontSize: 14,
                                              color: "#94a3b8",
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: "#64748b",
                                              fontWeight: 600,
                                            }}
                                          >
                                            {session.appointment?.startTime ||
                                              "TBA"}{" "}
                                            -{" "}
                                            {session.appointment?.endTime ||
                                              "TBA"}
                                          </Typography>
                                        </Box>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <LocationOnIcon
                                            sx={{
                                              fontSize: 14,
                                              color: "#94a3b8",
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: "#64748b",
                                              fontWeight: 600,
                                            }}
                                          >
                                            Room: {session.Room || "TBA"}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
