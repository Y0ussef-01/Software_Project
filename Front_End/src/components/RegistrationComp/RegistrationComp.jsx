import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import useRegistration from "../../hooks/Student/useRegistration";

const daysOrder = {
  saturday: 1,
  sunday: 2,
  monday: 3,
  tuesday: 4,
  wednesday: 5,
  thursday: 6,
  friday: 7,
};

const parseTime = (timeStr) => {
  if (!timeStr || timeStr === "TBA") return 9999;
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  if (modifier?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + parseInt(minutes, 10);
};

export default function RegistrationComp() {
  const {
    isLoading,
    isActionLoading,
    availableCourses,
    selectedCourseId,
    setSelectedCourseId,
    selectedGroup,
    setSelectedGroup,
    selectedCourseDetails,
    maxHours,
    registeredHours,
    remainingHours,
    registeredCourses,
    handleRegister,
    handleDropCourse,
    handleSwitchGroup,
    pendingSwapRequests,
    handleSwapRequest,
    handleSwapRespond,
  } = useRegistration();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [courseToUpdate, setCourseToUpdate] = useState(null);
  const [newSelectedGroup, setNewSelectedGroup] = useState("");

  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [courseToSwap, setCourseToSwap] = useState(null);
  const [targetGroupSwap, setTargetGroupSwap] = useState("");

  const handleOpenSwapDialog = (courseInfo) => {
    setCourseToSwap(courseInfo);
    setTargetGroupSwap("");
    setSwapDialogOpen(true);
  };

  const handleCloseSwapDialog = () => {
    setSwapDialogOpen(false);
    setCourseToSwap(null);
    setTargetGroupSwap("");
  };

  const handleConfirmSwap = async () => {
    if (courseToSwap && targetGroupSwap) {
      await handleSwapRequest(courseToSwap.courseId, targetGroupSwap);
      handleCloseSwapDialog();
    }
  };

  const handleOpenDeleteDialog = (courseInfo) => {
    setCourseToDelete(courseInfo);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      const idToDrop = courseToDelete.dropId;
      handleCloseDeleteDialog();
      await handleDropCourse(idToDrop);
    }
  };

  const handleOpenUpdateDialog = (courseInfo) => {
    setCourseToUpdate(courseInfo);
    setNewSelectedGroup("");
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setCourseToUpdate(null);
    setNewSelectedGroup("");
  };

  const handleConfirmUpdate = async () => {
    if (courseToUpdate && newSelectedGroup) {
      await handleSwitchGroup(courseToUpdate.courseId, newSelectedGroup);
      handleCloseUpdateDialog();
    }
  };

  const sortedRegisteredCourses = useMemo(() => {
    if (!registeredCourses || registeredCourses.length === 0) return [];

    return [...registeredCourses].sort((a, b) => {
      const scheduleA =
        a.appointment || a.course?.appointment || a.group?.appointment || {};
      const scheduleB =
        b.appointment || b.course?.appointment || b.group?.appointment || {};

      const dayA = (scheduleA.day || "").toLowerCase();
      const dayB = (scheduleB.day || "").toLowerCase();

      const dayOrderA = daysOrder[dayA] || 99;
      const dayOrderB = daysOrder[dayB] || 99;

      if (dayOrderA !== dayOrderB) {
        return dayOrderA - dayOrderB;
      }

      const timeA = parseTime(scheduleA.startTime);
      const timeB = parseTime(scheduleB.startTime);

      return timeA - timeB;
    });
  }, [registeredCourses]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const progressPercentage = (registeredHours / maxHours) * 100;

  const rawGroups = selectedCourseDetails?.groups || [];
  const groupCapacityMap = {};

  rawGroups.forEach((g) => {
    const name = g.groupName || g.name || (typeof g === "string" ? g : "");
    if (name) {
      if (groupCapacityMap[name] === undefined) {
        const enrolledCount = Array.isArray(g.enrolledStudents)
          ? g.enrolledStudents.length
          : 0;
        const totalCap = g.capacity || 100;
        groupCapacityMap[name] = totalCap - enrolledCount;
      }
    }
  });

  const uniqueGroups = Object.entries(groupCapacityMap).map(
    ([name, capacity]) => ({ name, capacity }),
  );

  const getGroupScheduleTooltip = (groupName, sourceGroups = rawGroups) => {
    const groupSchedules = sourceGroups.filter(
      (g) => g.groupName === groupName || g.name === groupName,
    );

    if (groupSchedules.length === 0) return "No schedule available.";

    return (
      <Box sx={{ p: 1, minWidth: "150px" }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            pb: 0.5,
          }}
        >
          Group {groupName} Schedule
        </Typography>
        {groupSchedules.map((scheduleItem, idx) => (
          <Box
            key={idx}
            sx={{ mb: 1, display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={scheduleItem.type || "TBA"}
                size="small"
                sx={{
                  height: "18px",
                  fontSize: "0.65rem",
                  fontWeight: "bold",
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  color: "#e2e8f0",
                  textTransform: "capitalize",
                }}
              >
                {scheduleItem.appointment?.day || "TBA"}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, pl: 0.5 }}
            >
              <AccessTimeIcon sx={{ fontSize: 12, color: "#cbd5e1" }} />
              <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                {scheduleItem.appointment?.startTime || "TBA"} -{" "}
                {scheduleItem.appointment?.endTime || "TBA"}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, pl: 0.5 }}
            >
              <LocationOnIcon sx={{ fontSize: 12, color: "#cbd5e1" }} />
              <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                Room: {scheduleItem.Room || "TBA"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  let updateGroupOptions = [];
  if (courseToUpdate) {
    const uGroupMap = {};
    courseToUpdate.availableGroupsData.forEach((g) => {
      const name = g.groupName || g.name || (typeof g === "string" ? g : "");
      if (name) {
        if (uGroupMap[name] === undefined) {
          const enrolledCount = Array.isArray(g.enrolledStudents)
            ? g.enrolledStudents.length
            : 0;
          const totalCap = g.capacity || 100;
          uGroupMap[name] = totalCap - enrolledCount;
        }
      }
    });
    updateGroupOptions = Object.entries(uGroupMap).map(([name, capacity]) => ({
      name,
      capacity,
    }));
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        gap: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          borderLeft: "8px solid #152b48",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
          <AccessTimeIcon sx={{ color: "#152b48", fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#152b48" }}>
            Hours Tracker
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          You have registered <strong>{registeredHours}</strong> hours. You can
          register up to <strong>{remainingHours}</strong> more hours out of
          your <strong>{maxHours}</strong> total allowed hours.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage > 100 ? 100 : progressPercentage}
              sx={{
                height: 12,
                borderRadius: 5,
                backgroundColor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    progressPercentage > 90 ? "#e11d48" : "#152b48",
                  transition:
                    "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important",
                },
              }}
            />
          </Box>
          <Box sx={{ minWidth: 50 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              {registeredHours}/{maxHours}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, mb: 3, color: "#152b48" }}
        >
          Register New Course
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <FormControl
            variant="outlined"
            sx={{ width: { xs: "100%", md: "450px" } }}
          >
            <InputLabel shrink={true}>Select Course</InputLabel>
            <Select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedGroup("");
              }}
              label="Select Course"
              displayEmpty
              sx={{ borderRadius: "12px", height: "56px" }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 0.5,
                    borderRadius: "12px",
                    boxShadow: "0px 8px 24px rgba(21, 43, 72, 0.15)",
                    maxHeight: 250,
                    "& .MuiList-root": { padding: 0 },
                  },
                },
              }}
            >
              <MenuItem disabled value="" sx={{ display: "none" }}>
                <em>Choose a course</em>
              </MenuItem>
              {availableCourses.map((course) => {
                const cId = course._id || course.courseId;
                const displayCode =
                  course.courseCode || course.courseId || course._id || "Code";
                const displayName = course.courseName || course.name || "Name";
                return (
                  <MenuItem
                    key={cId}
                    value={cId}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #f1f5f9",
                      "&:last-child": { borderBottom: "none" },
                      "&:hover": { backgroundColor: "#f8fafc" },
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>
                      <strong>{displayCode}</strong> - {displayName}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            disabled={!selectedCourseId}
            sx={{ width: { xs: "100%", md: "250px" } }}
          >
            <InputLabel shrink={true} id="select-group-label">
              Select Group
            </InputLabel>
            <Select
              labelId="select-group-label"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              label="Select Group"
              displayEmpty
              sx={{ borderRadius: "12px", height: "56px" }}
              renderValue={(selected) =>
                selected ? selected : <em>Choose a group</em>
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 0.5,
                    borderRadius: "12px",
                    boxShadow: "0px 8px 24px rgba(21, 43, 72, 0.15)",
                    maxHeight: 250,
                    "& .MuiList-root": { padding: 0 },
                  },
                },
              }}
            >
              <MenuItem disabled value="" sx={{ display: "none" }}>
                <em>Choose a group</em>
              </MenuItem>
              {uniqueGroups.map((grp, index) => {
                const isFull = grp.capacity <= 0;

                return (
                  <MenuItem
                    key={index}
                    value={grp.name}
                    disabled={isFull}
                    sx={{
                      p: 0,
                      "& .group-row": {
                        borderBottom:
                          index === uniqueGroups.length - 1
                            ? "none"
                            : "1px solid #f1f5f9",
                      },
                    }}
                  >
                    <Tooltip
                      title={getGroupScheduleTooltip(grp.name)}
                      placement="right"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "rgba(21, 43, 72, 0.95)",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                            p: 1,
                          },
                        },
                        arrow: {
                          sx: { color: "rgba(21, 43, 72, 0.95)" },
                        },
                      }}
                    >
                      <Box
                        className="group-row"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          px: 2,
                          py: 1.5,
                          "&:hover": { backgroundColor: "#f8fafc" },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ flexGrow: 1, fontWeight: 600 }}
                        >
                          {grp.name}
                        </Typography>

                        <Box sx={{ minWidth: "65px", textAlign: "right" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isFull ? "error.main" : "text.secondary",
                              bgcolor: isFull ? "#ffe4e6" : "#f1f5f9",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "6px",
                              fontWeight: "bold",
                              display: "inline-block",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {isFull ? "Full" : `Cap: ${grp.capacity}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Tooltip>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            disabled={
              !selectedCourseId ||
              !selectedGroup ||
              remainingHours <= 0 ||
              isActionLoading
            }
            onClick={handleRegister}
            startIcon={
              isActionLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AddCircleOutlineIcon />
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
            {isActionLoading ? "Registering..." : "REGISTER"}
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
          <MenuBookIcon sx={{ color: "#152b48", fontSize: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#152b48" }}>
            My Schedule
          </Typography>
        </Box>

        {sortedRegisteredCourses.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              bgcolor: "#f8fafc",
              borderRadius: "16px",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              You haven't registered for any courses yet.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}
          >
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                    Course Info
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                    Schedule
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                    Location & Type
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#152b48" }}
                  >
                    Hours
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#152b48", pr: 4 }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRegisteredCourses.map((row, index) => {
                  const courseObj = row.course || row;
                  const groupObj = row.group || row;

                  const baseCourseCode =
                    typeof row.course === "string"
                      ? row.course
                      : row.courseId ||
                        courseObj.courseId ||
                        courseObj._id ||
                        "N/A";

                  const matchedCourse = availableCourses.find(
                    (c) =>
                      c._id === baseCourseCode || c.courseId === baseCourseCode,
                  );
                  const displayName = matchedCourse
                    ? matchedCourse.courseName || matchedCourse.name
                    : courseObj.courseName || courseObj.name || "N/A";

                  const dropId = baseCourseCode;

                  let displayGroup = "N/A";
                  if (typeof row.groupName === "string")
                    displayGroup = row.groupName;
                  else if (typeof groupObj === "string")
                    displayGroup = groupObj;
                  else if (groupObj.groupName)
                    displayGroup = groupObj.groupName;
                  else if (groupObj.name) displayGroup = groupObj.name;

                  const hours = courseObj.hours || row.hours || 3;

                  const schedule =
                    row.appointment ||
                    courseObj.appointment ||
                    groupObj.appointment;

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "#f1f5f9" },
                        animation: "fadeInRow 0.5s ease-in-out",
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 800, color: "#152b48" }}
                        >
                          {baseCourseCode}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {displayName}
                        </Typography>
                        <Chip
                          label={`Grp: ${displayGroup}`}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#e0f2fe",
                            color: "#0284c7",
                            fontSize: "0.75rem",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {schedule ? (
                          <Box
                            sx={{
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
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                sx={{ textTransform: "capitalize" }}
                              >
                                {schedule.day || "TBA"}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ ml: 3 }}
                            >
                              {schedule.startTime || "TBA"} -{" "}
                              {schedule.endTime || "TBA"}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            TBA
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
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
                            <LocationOnIcon
                              sx={{ fontSize: 16, color: "error.light" }}
                            />
                            <Typography variant="body2" fontWeight="bold">
                              {row.Room ||
                                courseObj.Room ||
                                groupObj.Room ||
                                "TBA"}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 3,
                              color: "primary.main",
                              fontWeight: "bold",
                            }}
                          >
                            {row.type ||
                              courseObj.type ||
                              groupObj.type ||
                              "Lecture"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            color: "#152b48",
                            bgcolor: "#f1f5f9",
                            py: 0.5,
                            borderRadius: "8px",
                          }}
                        >
                          {hours} Hrs
                        </Typography>
                      </TableCell>

                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            onClick={() =>
                              handleOpenUpdateDialog({
                                courseId: baseCourseCode,
                                courseName: displayName,
                                currentGroup: displayGroup,
                                availableGroupsData:
                                  matchedCourse?.groups ||
                                  courseObj?.groups ||
                                  [],
                              })
                            }
                            disabled={isActionLoading}
                            sx={{
                              bgcolor: "#ffffff",
                              color: "#0284c7",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              width: 40,
                              height: 40,
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                bgcolor: "#e0f2fe",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            onClick={() =>
                              handleOpenSwapDialog({
                                courseId: baseCourseCode,
                                courseName: displayName,
                                currentGroup: displayGroup,
                                availableGroupsData:
                                  matchedCourse?.groups ||
                                  courseObj?.groups ||
                                  [],
                              })
                            }
                            disabled={isActionLoading}
                            sx={{
                              bgcolor: "#ffffff",
                              color: "#1d4ed8",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              width: 40,
                              height: 40,
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                bgcolor: "#dbeafe",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <SwapHorizIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            onClick={() =>
                              handleOpenDeleteDialog({
                                dropId,
                                courseName: displayName,
                              })
                            }
                            disabled={isActionLoading}
                            sx={{
                              bgcolor: "#ffffff",
                              color: "#e11d48",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                              width: 40,
                              height: 40,
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                bgcolor: "#ffe4e6",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
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
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            minWidth: { xs: "300px", sm: "450px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
            fontWeight: "900",
            pb: 1,
          }}
        >
          <WarningRoundedIcon fontSize="large" /> Drop Course
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: "1.1rem", color: "text.primary", fontWeight: 500 }}
          >
            Are you sure you want to drop{" "}
            <strong>{courseToDelete?.courseName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isActionLoading}
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isActionLoading}
            variant="contained"
            color="error"
            disableElevation
            sx={{
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
              textTransform: "none",
              "&:hover": { backgroundColor: "#be123c" },
            }}
          >
            {isActionLoading ? "Dropping..." : "Yes, Drop Course"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            minWidth: { xs: "300px", sm: "450px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#152b48",
            fontWeight: "900",
            pb: 1,
          }}
        >
          <SyncIcon fontSize="large" /> Switch Group
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              color: "#152b48",
              fontWeight: 500,
              mb: 3,
            }}
          >
            Select a new group for <strong>{courseToUpdate?.courseName}</strong>
            .
            <br />
            <Typography variant="caption" color="text.secondary">
              Current group: {courseToUpdate?.currentGroup}
            </Typography>
          </DialogContentText>

          <FormControl fullWidth variant="outlined">
            <InputLabel shrink={true} id="switch-group-label">
              New Group
            </InputLabel>
            <Select
              labelId="switch-group-label"
              value={newSelectedGroup}
              onChange={(e) => setNewSelectedGroup(e.target.value)}
              displayEmpty
              label="New Group"
              sx={{ borderRadius: "12px" }}
              renderValue={(selected) =>
                selected ? selected : <em>Choose new group</em>
              }
            >
              <MenuItem disabled value="" sx={{ display: "none" }}>
                <em>Choose new group</em>
              </MenuItem>
              {updateGroupOptions.map((grp, index) => {
                const isFull = grp.capacity <= 0;
                const isCurrent = grp.name === courseToUpdate?.currentGroup;

                return (
                  <MenuItem
                    key={index}
                    value={grp.name}
                    disabled={isFull || isCurrent}
                    sx={{
                      p: 0,
                      "& .group-row": {
                        borderBottom:
                          index === updateGroupOptions.length - 1
                            ? "none"
                            : "1px solid #f1f5f9",
                      },
                    }}
                  >
                    <Tooltip
                      title={getGroupScheduleTooltip(
                        grp.name,
                        courseToUpdate?.availableGroupsData,
                      )}
                      placement="right"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "rgba(21, 43, 72, 0.95)",
                            borderRadius: "8px",
                            p: 1,
                          },
                        },
                        arrow: { sx: { color: "rgba(21, 43, 72, 0.95)" } },
                      }}
                    >
                      <Box
                        className="group-row"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          px: 2,
                          py: 1.5,
                          "&:hover": { backgroundColor: "#f8fafc" },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ flexGrow: 1, fontWeight: 600 }}
                        >
                          {grp.name} {isCurrent && "(Current)"}
                        </Typography>
                        <Box sx={{ minWidth: "65px", textAlign: "right" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isFull ? "error.main" : "text.secondary",
                              bgcolor: isFull ? "#ffe4e6" : "#f1f5f9",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "6px",
                              fontWeight: "bold",
                            }}
                          >
                            {isFull ? "Full" : `Cap: ${grp.capacity}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Tooltip>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleCloseUpdateDialog}
            disabled={isActionLoading}
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            disabled={isActionLoading || !newSelectedGroup}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
              backgroundColor: "#152b48",
              textTransform: "none",
              "&:hover": { backgroundColor: "#152b48" },
            }}
          >
            {isActionLoading ? "Updating..." : "Update Group"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* INCOMING PENDING SWAPS UI */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
          <SwapHorizIcon sx={{ color: "#152b48", fontSize: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#152b48" }}>
            Incoming Swap Requests ({pendingSwapRequests?.length || 0})
          </Typography>
        </Box>

        {pendingSwapRequests?.length === 0 || !pendingSwapRequests ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              bgcolor: "#f8fafc",
              borderRadius: "16px",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              No pending swap requests available.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>Requested By</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>From Group</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>Target Group</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", color: "#152b48", pr: 4 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingSwapRequests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <img 
                          src={req.sender?.profileImg || "/default.jpg"} 
                          alt="avatar" 
                          style={{ width: 32, height: 32, borderRadius: "50%" }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {req.sender?.name || "Unknown"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{req.courseId?.name || "Unknown"} ({req.courseId?._id})</TableCell>
                    <TableCell>
                      <Chip label={req.senderGroupName} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={req.receiverGroupName || req.targetGroupName} size="small" color="primary" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={isActionLoading}
                        onClick={() => handleSwapRespond(req._id, 'Accepted')}
                        startIcon={<CheckCircleOutlineIcon />}
                        sx={{ textTransform: "none", borderRadius: "8px", fontWeight: "bold" }}
                      >
                        Accept Swap
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* SWAP DIALOG */}
      <Dialog
        open={swapDialogOpen}
        onClose={handleCloseSwapDialog}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            minWidth: { xs: "300px", sm: "450px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#152b48",
            fontWeight: "900",
            pb: 1,
          }}
        >
          <SwapHorizIcon fontSize="large" /> Broadcast Swap
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              color: "#152b48",
              fontWeight: 500,
              mb: 3,
            }}
          >
            Broadcast a swap request for <strong>{courseToSwap?.courseName}</strong>.
            <br />
            <Typography variant="caption" color="text.secondary">
              Current group: {courseToSwap?.currentGroup}
            </Typography>
          </DialogContentText>

          <FormControl fullWidth variant="outlined">
            <InputLabel shrink={true} id="swap-group-label">
              Target Group
            </InputLabel>
            <Select
              labelId="swap-group-label"
              value={targetGroupSwap}
              onChange={(e) => setTargetGroupSwap(e.target.value)}
              displayEmpty
              label="Target Group"
              sx={{ borderRadius: "12px" }}
              renderValue={(selected) =>
                selected ? selected : <em>Choose target group</em>
              }
            >
              <MenuItem disabled value="" sx={{ display: "none" }}>
                <em>Choose target group</em>
              </MenuItem>
              {(() => {
                const sGroupMap = {};
                if (courseToSwap) {
                  courseToSwap.availableGroupsData.forEach((g) => {
                    const name = g.groupName || g.name || (typeof g === "string" ? g : "");
                    if (name) {
                      sGroupMap[name] = true;
                    }
                  });
                }
                const options = Object.keys(sGroupMap);

                return options.map((grpName, index) => {
                  const isCurrent = grpName === courseToSwap?.currentGroup;
                  return (
                    <MenuItem
                      key={index}
                      value={grpName}
                      disabled={isCurrent}
                      sx={{ p: 2, borderBottom: "1px solid #f1f5f9" }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>{grpName} {isCurrent && "(Current)"}</Typography>
                    </MenuItem>
                  );
                });
              })()}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleCloseSwapDialog}
            disabled={isActionLoading}
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSwap}
            disabled={isActionLoading || !targetGroupSwap}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "10px",
              fontWeight: "bold",
              px: 3,
              backgroundColor: "#152b48",
              textTransform: "none",
              "&:hover": { backgroundColor: "#152b48" },
            }}
          >
            {isActionLoading ? "Sending..." : "Request Swap"}
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes fadeInRow {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
}
