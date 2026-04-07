import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function TeacherCoursesTable({
  courses,
  onEditClick,
  onDeleteClick,
  isLoading,
  allCourses,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: "16px",
          backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography color="text.secondary" variant="body1">
          No courses assigned to this teacher
        </Typography>
      </Paper>
    );
  }

  const groupedCourses = courses.reduce((acc, course) => {
    const key = `${course.courseId}-${course.courseName}`;
    if (!acc[key]) {
      acc[key] = {
        courseId: course.courseId,
        courseName: course.courseName,
        courseCode: course.courseCode,
        groups: [],
      };
    }
    acc[key].groups.push(course);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedCourses);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? "0px 10px 40px rgba(0,0,0,0.4)"
          : "0px 10px 40px rgba(21,43,72,0.08)",
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(21,43,72,0.05)",
              }}
            >
              {[
                "Course Code",
                "Course Name",
                "Group",
                "Schedule",
                "Location",
                "Actions",
              ].map((h, i) => (
                <TableCell
                  key={h}
                  align={i === 5 ? "right" : "left"}
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    borderBottomColor: theme.palette.divider,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {groupedArray.map((courseGroup, groupIndex) =>
              courseGroup.groups.map((group, rowIndex) => {
                // ✅ بياخد البيانات من الـ row مباشرة
                const appointment = group.appointment || null;
                const room = group.Room || "";
                const type = group.type || "";
              
                const shortGroup = group.groupOnly || group.groupName;

                return (
                  <TableRow
                    key={group._id || `${courseGroup.courseId}-${rowIndex}`}
                    sx={{
                      backgroundColor:
                        groupIndex % 2 === 0
                          ? "transparent"
                          : isDark
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(21,43,72,0.02)",
                      "&:hover": {
                       
                      },
                    }}
                  >
                    {rowIndex === 0 && (
                      <TableCell
                        rowSpan={courseGroup.groups.length}
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: theme.palette.primary.main,
                          verticalAlign: "middle",
                          borderRight: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        {courseGroup.courseId}
                      </TableCell>
                    )}

                    {rowIndex === 0 && (
                      <TableCell
                        rowSpan={courseGroup.groups.length}
                        sx={{
                          fontSize: "0.95rem",
                          verticalAlign: "middle",
                          borderRight: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        {courseGroup.courseName}
                      </TableCell>
                    )}

                    
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {shortGroup}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {appointment ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.4,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                            }}
                          >
                            <CalendarTodayIcon
                              sx={{ fontSize: 13, color: "text.secondary" }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {appointment.day || "TBA"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              ml: 0.3,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{ fontSize: 13, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {appointment.startTime || "TBA"} -{" "}
                              {appointment.endTime || "TBA"}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          TBA
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {room ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <LocationOnIcon
                            sx={{ fontSize: 14, color: "error.light" }}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {room}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          TBA
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => onEditClick(group)}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            borderWidth: "2px",
                            "&:hover": { borderWidth: "2px" },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => onDeleteClick(group)}
                          sx={{
                            minWidth: "auto",
                            padding: "8px",
                          }}
                        >
                          <DeleteOutlineIcon /> 
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              }),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
