import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Collapse,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ScienceIcon from "@mui/icons-material/Science";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import useAppointments from "../../hooks/Student/useAppointments";

export default function AppointmentsComp() {
  const theme = useTheme();
  const { courses, isLoading } = useAppointments();

  const [expandedCourses, setExpandedCourses] = useState({});

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

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
        gap: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: { xs: 1, md: 2 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: "#152b48",
            mb: { xs: 0.5, md: 1 },
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Courses Schedule
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          View all available courses, their specific groups, and detailed
          lecture/lab schedules.
        </Typography>
      </Box>

      {courses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            textAlign: "center",
            borderRadius: "24px",
            bgcolor: "#f8fafc",
            border: "1px dashed #e2e8f0",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            No courses available at the moment.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, md: 3 },
          }}
        >
          {courses.map((course) => {
            const groupedGroups = groupSessionsByName(course.groups);
            const isExpanded = expandedCourses[course._id];

            return (
              <Paper
                key={course._id}
                elevation={0}
                sx={{
                  width: "100%",
                  borderRadius: { xs: "16px", md: "24px" },
                  boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
                  borderLeft: "8px solid #152b48",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#fff",
                  transition: "all 0.3s ease",
                  ...(isExpanded && {
                    boxShadow: "0px 15px 50px rgba(21, 43, 72, 0.12)",
                    transform: "translateY(-2px)",
                  }),
                }}
              >
                <Box
                  onClick={() => toggleCourse(course._id)}
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    bgcolor: isExpanded ? "#f8fafc" : "#fdfdfd",
                    borderBottom: isExpanded ? "1px solid #f1f5f9" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      bgcolor: "#f1f5f9",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.5, md: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        p: { xs: 1, md: 1.5 },
                        bgcolor: "#fff",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.03)",
                      }}
                    >
                      <ClassIcon
                        sx={{
                          color: "#152b48",
                          fontSize: { xs: 22, sm: 24, md: 28 },
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: "#152b48",
                          lineHeight: 1.2,
                          mb: { xs: 0.25, md: 0.5 },
                          fontSize: {
                            xs: "1.1rem",
                            sm: "1.25rem",
                            md: "1.5rem",
                          },
                        }}
                      >
                        {course.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 700,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Code: {course._id}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, md: 2 },
                    }}
                  >
                    <Chip
                      label={`${course.hours} Credit Hours`}
                      sx={{
                        fontWeight: "900",
                        bgcolor: "#e0f2fe",
                        color: "#0284c7",
                        borderRadius: "8px",
                        px: { xs: 0.5, md: 1 },
                        height: { xs: "24px", md: "32px" },
                        fontSize: { xs: "0.7rem", sm: "0.8125rem" },
                      }}
                    />
                    <KeyboardArrowDownIcon
                      sx={{
                        color: "#152b48",
                        fontSize: { xs: 26, sm: 28, md: 32 },
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: "#fff" }}>
                    {groupedGroups.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{
                          py: 2,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                      >
                        No groups assigned yet.
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(auto-fill, minmax(280px, 1fr))",
                            md: "repeat(auto-fill, minmax(300px, 1fr))",
                          },
                          gap: { xs: 2, md: 3 },
                        }}
                      >
                        {groupedGroups.map((group, idx) => {
                          const isFull = group.availableSeats <= 0;

                          return (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                border: "1px solid #e2e8f0",
                                borderRadius: { xs: "12px", md: "16px" },
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
                                  p: { xs: 1.5, md: 2 },
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
                                    sx={{
                                      color: "#64748b",
                                      fontSize: { xs: 18, md: 20 },
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 800,
                                      color: "#1e293b",
                                      fontSize: { xs: "0.9rem", sm: "1rem" },
                                    }}
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
                                    height: { xs: "20px", md: "24px" },
                                    fontSize: { xs: "0.65rem", md: "0.75rem" },
                                  }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  p: { xs: 1, md: 1.5 },
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: { xs: 1, md: 1.5 },
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
                                        gap: { xs: 1, md: 1.5 },
                                        p: { xs: 1, md: 1.5 },
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
                                          minWidth: { xs: "40px", md: "45px" },
                                          p: { xs: 0.75, md: 1 },
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
                                          <AutoStoriesIcon
                                            sx={{
                                              fontSize: { xs: 18, md: 20 },
                                            }}
                                          />
                                        ) : (
                                          <ScienceIcon
                                            sx={{
                                              fontSize: { xs: 18, md: 20 },
                                            }}
                                          />
                                        )}
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: "bold",
                                            mt: 0.5,
                                            fontSize: {
                                              xs: "0.55rem",
                                              md: "0.6rem",
                                            },
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
                                          gap: { xs: 0.25, md: 0.5 },
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: { xs: 0.5, md: 1 },
                                          }}
                                        >
                                          <CalendarTodayIcon
                                            sx={{
                                              fontSize: { xs: 12, md: 14 },
                                              color: "#94a3b8",
                                            }}
                                          />
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              fontWeight: 700,
                                              color: "#334155",
                                              textTransform: "capitalize",
                                              fontSize: {
                                                xs: "0.8rem",
                                                md: "0.875rem",
                                              },
                                            }}
                                          >
                                            {session.appointment?.day || "TBA"}
                                          </Typography>
                                        </Box>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: { xs: 0.5, md: 1 },
                                          }}
                                        >
                                          <AccessTimeIcon
                                            sx={{
                                              fontSize: { xs: 12, md: 14 },
                                              color: "#94a3b8",
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: "#64748b",
                                              fontWeight: 600,
                                              fontSize: {
                                                xs: "0.7rem",
                                                md: "0.75rem",
                                              },
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
                                            gap: { xs: 0.5, md: 1 },
                                          }}
                                        >
                                          <LocationOnIcon
                                            sx={{
                                              fontSize: { xs: 12, md: 14 },
                                              color: "#94a3b8",
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: "#64748b",
                                              fontWeight: 600,
                                              fontSize: {
                                                xs: "0.7rem",
                                                md: "0.75rem",
                                              },
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
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
