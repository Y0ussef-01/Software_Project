import React from "react";
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Button, CircularProgress,
  Typography, Chip, useTheme,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function EnrollmentTable({
  enrollments,
  onEditClick,
  onDeleteClick,
  isLoading,
  allCourses, 
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  
  const getGroupData = (courseId, groupName) => {
    if (!courseId || !groupName) return null;
    const course = allCourses?.find((c) => c._id === courseId);
    if (!course || !Array.isArray(course.groups)) return null;
    return course.groups.find((g) =>
      g.groupName === groupName || groupName.includes(g.groupName)
    ) || null;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <Paper elevation={0} sx={{
        p: 4, textAlign: "center", borderRadius: "16px",
        backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
        border: `1px solid ${theme.palette.divider}`,
      }}>
        <Typography color="text.secondary" variant="body1">
          No enrollments found for this student
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{
      width: "100%", borderRadius: "16px", overflow: "hidden",
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: isDark ? "0px 10px 40px rgba(0,0,0,0.4)" : "0px 10px 40px rgba(21,43,72,0.08)",
    }}>
      <TableContainer sx={{ borderRadius: "16px" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc" }}>
              {["Course Info", "Schedule", "Location & Type", "Hours", "Actions"].map((h, i) => (
                <TableCell key={h}
                  align={i === 3 ? "center" : i === 4 ? "right" : "left"}
                  sx={{
                    fontWeight: 700, color: theme.palette.text.primary,
                    borderBottomColor: theme.palette.divider,
                    pr: i === 4 ? 4 : undefined,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {enrollments.map((row, index) => {
            
              const groupData = getGroupData(row.courseId, row.groupName);
              const schedule = groupData?.appointment || row.appointment || null;
              const room = groupData?.Room || row.Room || "";
              const type = groupData?.type || row.type || "";

              return (
                <TableRow key={row._id || index} sx={{
                  "&:last-child td": { border: 0 },
                  "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f1f5f9" },
                  animation: "fadeInRow 0.4s ease-in-out",
                }}>

                  
                  <TableCell>
                    <Typography variant="subtitle2"
                      sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                      Cs-{row.courseCode}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.8 }}>
                      {row.courseName}
                    </Typography>
                    <Chip
                      label={`Grp: ${row.groupOnly}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: isDark ? "rgba(2,132,199,0.15)" : "#e0f2fe",
                        color: isDark ? "#38bdf8" : "#0284c7",
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>

                  
                  <TableCell>
                    {schedule ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                          <Typography variant="body2" fontWeight="bold"
                            sx={{ textTransform: "capitalize" }}>
                            {schedule.day || "TBA"}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                          {schedule.startTime || "TBA"} - {schedule.endTime || "TBA"}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">TBA</Typography>
                    )}
                  </TableCell>

                  
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 15, color: "error.light" }} />
                        <Typography variant="body2" fontWeight="bold">
                          {room || "TBA"}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{
                        ml: 3, color: "primary.main", fontWeight: 700,
                      }}>
                        {type || "TBA"}
                      </Typography>
                    </Box>
                  </TableCell>

                  
                  <TableCell align="center">
                    <Typography variant="body2" sx={{
                      fontWeight: 700, color: theme.palette.text.primary,
                      bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                      py: 0.5, px: 1.5, borderRadius: "8px", display: "inline-block",
                    }}>
                      {row.hours || 3} Hrs
                    </Typography>
                  </TableCell>

                  
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      <Button variant="outlined" size="small"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => onEditClick(row)}
                        sx={{
                          borderRadius: "8px", textTransform: "none", fontWeight: 600,
                          borderWidth: "2px", "&:hover": { borderWidth: "2px" },
                        }}>
                        Edit
                      </Button>
                      <IconButton onClick={() => onDeleteClick(row)} sx={{
                        bgcolor: isDark ? "rgba(225,29,72,0.1)" : "#ffffff",
                        color: "#e11d48", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        width: 36, height: 36, transition: "all 0.2s ease-in-out",
                        "&:hover": { bgcolor: "#ffe4e6", transform: "scale(1.05)" },
                      }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <style>{`
        @keyframes fadeInRow {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Paper>
  );
}