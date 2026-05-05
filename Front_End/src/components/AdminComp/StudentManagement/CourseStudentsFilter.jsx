import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  Button,
  Avatar,
  CircularProgress,
  Collapse,
  Paper,
  useTheme,
  Chip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

/**
 * CourseStudentsFilter
 *
 * Props:
 *  - registeredCourses: Array of course objects from the student's profile
 *    Each item should have at least: { courseId (or _id), name }
 *    If not passed, the component fetches all courses from /admin/courses.
 *
 * Usage (inside StudentManagementPage):
 *   <CourseStudentsFilter token={token} />
 *
 * The component:
 *  1. Shows a filter icon button in the search bar area
 *  2. On click → expands a panel with course dropdown + "Show Students" button
 *  3. Fetches /admin/group-students?courseId=X&groupName=All
 *  4. Renders a table: avatar (circle, small) | name | student ID
 */
export default function CourseStudentsFilter({ token }) {
  const theme = useTheme();

  const [panelOpen, setPanelOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState("");

  // ── Open / close panel ────────────────────────────────────────────────────
  const handleTogglePanel = async () => {
    if (panelOpen) {
      setPanelOpen(false);
      setTableVisible(false);
      setStudents([]);
      setSelectedCourse("");
      return;
    }

    setPanelOpen(true);

    // Fetch courses list if not already loaded
    if (courses.length === 0) {
      setLoadingCourses(true);
      try {
        const res = await axios.get(`${BASE_URL}/admin/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoadingCourses(false);
      }
    }
  };

  // ── Fetch students for selected course ────────────────────────────────────
  const handleShowStudents = async () => {
    if (!selectedCourse) return;
    setLoadingStudents(true);
    setTableVisible(false);
    setStudents([]);

    const found = courses.find(
      (c) => (c._id || c.courseId) === selectedCourse,
    );
    setSelectedCourseName(found?.name || selectedCourse);

    try {
      const res = await axios.get(
        `${BASE_URL}/admin/group-students?courseId=${selectedCourse}&groupName=All`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStudents(res.data?.students || []);
      setTableVisible(true);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
      setTableVisible(true);
    } finally {
      setLoadingStudents(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isDark = theme.palette.mode === "dark";

  const avatarSrc = (img) => {
    if (!img || img === "default.jpg" || img === "default-student.jpg")
      return "";
    if (img.startsWith("data:") || img.startsWith("http")) return img;
    return `${BASE_URL}/uploads/${img}`;
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" } }}>
      {/* ── Filter toggle button ── */}
      <Tooltip title={panelOpen ? "Close Filter" : "Filter by Course"} arrow>
        <IconButton
          onClick={handleTogglePanel}
          sx={{
            mb: panelOpen ? 1.5 : 0,
            width: 44,
            height: 44,
            borderRadius: "12px",
            backgroundColor: panelOpen
              ? theme.palette.primary.main
              : isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(25,118,210,0.08)",
            color: panelOpen ? "#fff" : theme.palette.primary.main,
            border: `2px solid ${panelOpen ? theme.palette.primary.main : theme.palette.primary.light}`,
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              transform: "scale(1.06)",
            },
          }}
        >
          {panelOpen ? <CloseIcon fontSize="small" /> : <FilterListIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* ── Expandable panel ── */}
      <Collapse in={panelOpen} timeout={350} unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            borderRadius: "20px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: isDark
              ? "0px 8px 32px rgba(0,0,0,0.35)"
              : "0px 8px 32px rgba(21,43,72,0.07)",
            border: `1px solid ${theme.palette.divider}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* accent line */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              borderRadius: "20px 20px 0 0",
            }}
          />

          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
            <GroupsIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
              Filter Students by Course
            </Typography>
          </Box>

          {/* Controls row */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl
              sx={{ flex: "1 1 220px", minWidth: 180 }}
              size="small"
            >
              {loadingCourses ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={18} />
                  <Typography variant="caption" color="text.secondary">
                    Loading courses…
                  </Typography>
                </Box>
              ) : (
                <Select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setTableVisible(false);
                    setStudents([]);
                  }}
                  displayEmpty
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                    fontWeight: 600,
                  }}
                >
                  <MenuItem value="" disabled>
                    <Typography variant="body2" color="text.secondary">
                      Select a course…
                    </Typography>
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course._id || course.courseId} value={course._id || course.courseId}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {course.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course._id || course.courseId}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>

            <Button
              variant="contained"
              disabled={!selectedCourse || loadingStudents}
              onClick={handleShowStudents}
              startIcon={
                loadingStudents ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <GroupsIcon />
                )
              }
              sx={{
                px: 3,
                py: 1,
                borderRadius: "12px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.9rem",
                flexShrink: 0,
                boxShadow: isDark
                  ? "0 6px 16px rgba(0,0,0,0.4)"
                  : "0 6px 16px rgba(25,118,210,0.22)",
              }}
            >
              {loadingStudents ? "Loading…" : "Show Students"}
            </Button>
          </Box>

          {/* ── Students table ── */}
          <Collapse in={tableVisible} timeout={400} unmountOnExit>
            <Box sx={{ mt: 3 }}>
              {/* Table header row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                  {selectedCourseName}
                </Typography>
                <Chip
                  label={`${students.length} student${students.length !== 1 ? "s" : ""}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700, borderRadius: "8px" }}
                />
              </Box>

              {students.length === 0 ? (
                <Box
                  sx={{
                    py: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    color: theme.palette.text.disabled,
                  }}
                >
                  <GroupsIcon sx={{ fontSize: 42 }} />
                  <Typography variant="body2">No students enrolled in this course.</Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    borderRadius: "14px",
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "hidden",
                  }}
                >
                  {/* Column headers */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "48px 1fr 140px",
                      gap: 0,
                      px: 2,
                      py: 1.2,
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(25,118,210,0.05)",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.text.secondary, textTransform: "uppercase", fontSize: "0.7rem" }}>
                      Photo
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.text.secondary, textTransform: "uppercase", fontSize: "0.7rem" }}>
                      Full Name
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.text.secondary, textTransform: "uppercase", fontSize: "0.7rem", textAlign: "right" }}>
                      Student ID
                    </Typography>
                  </Box>

                  {/* Rows */}
                  <Box
                    sx={{
                      maxHeight: 340,
                      overflowY: "auto",
                      "&::-webkit-scrollbar": { width: "5px" },
                      "&::-webkit-scrollbar-thumb": {
                        borderRadius: "10px",
                        backgroundColor: theme.palette.divider,
                      },
                    }}
                  >
                    {students.map((student, idx) => (
                      <Box
                        key={student._id || idx}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "48px 1fr 140px",
                          alignItems: "center",
                          gap: 0,
                          px: 2,
                          py: 1.2,
                          borderBottom:
                            idx < students.length - 1
                              ? `1px solid ${theme.palette.divider}`
                              : "none",
                          transition: "background 0.18s ease",
                          "&:hover": {
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(25,118,210,0.03)",
                          },
                        }}
                      >
                        {/* Avatar */}
                        <Avatar
                          src={avatarSrc(student.profileImg)}
                          alt={student.name}
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            bgcolor: theme.palette.primary.main,
                            color: "#fff",
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                          }}
                        >
                          {student.name ? student.name.charAt(0).toUpperCase() : "?"}
                        </Avatar>

                        {/* Name */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            pl: 1.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {student.name || "—"}
                        </Typography>

                        {/* ID */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: theme.palette.text.secondary,
                            fontFamily: "monospace",
                            fontSize: "0.85rem",
                            textAlign: "right",
                          }}
                        >
                          {student._id || "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </Paper>
      </Collapse>
    </Box>
  );
}