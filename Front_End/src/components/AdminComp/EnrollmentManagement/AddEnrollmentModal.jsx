import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, FormControl, InputLabel, Select,
  MenuItem, CircularProgress, useTheme, Typography,
  Tooltip, Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function AddEnrollmentModal({
  open, onClose, onSubmit,
  addFormData, setAddFormData,
  allCourses, isLoading, getGroupsForCourse,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const allGroupsForCourse =
    getGroupsForCourse && typeof getGroupsForCourse === "function"
      ? getGroupsForCourse(addFormData.courseId)
      : [];

  const groupMap = {};
  allGroupsForCourse.forEach((g) => {
    const name = g.groupName || g.name || "";
    const shortName = name.replace(/[A-Za-z]+-\d+-/, "").split("-")[0];
    if (shortName && !groupMap[shortName]) {
      groupMap[shortName] = name;
    }
  });
  const uniqueGroups = Object.entries(groupMap).map(([short, full]) => ({ short, full }));

  const getGroupTooltip = (shortName) => {
    const schedules = allGroupsForCourse.filter((g) => {
      const s = (g.groupName || g.name || "").replace(/[A-Za-z]+-\d+-/, "").split("-")[0];
      return s === shortName;
    });
    if (schedules.length === 0) return "No schedule available.";
    return (
      <Box sx={{ p: 1, minWidth: "160px" }}>
        <Typography variant="subtitle2" sx={{
          fontWeight: "bold", mb: 1, color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 0.5,
        }}>
          Group {shortName} Schedule
        </Typography>
        {schedules.map((item, idx) => (
          <Box key={idx} sx={{ mb: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip label={item.type || "TBA"} size="small" sx={{
                height: "18px", fontSize: "0.65rem", fontWeight: "bold",
                bgcolor: "rgba(255,255,255,0.2)", color: "#fff",
              }} />
              <Typography variant="caption" sx={{
                fontWeight: "bold", color: "#e2e8f0", textTransform: "capitalize",
              }}>
                {item.appointment?.day || "TBA"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 12, color: "#cbd5e1" }} />
              <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                {item.appointment?.startTime || "TBA"} - {item.appointment?.endTime || "TBA"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 12, color: "#cbd5e1" }} />
              <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                Room: {item.Room || "TBA"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const handleCourseChange = (e) => {
    setAddFormData({ courseId: e.target.value, groupName: "" });
  };

  const handleGroupChange = (fullName) => {
    setAddFormData({ ...addFormData, groupName: fullName });
  };

  const handleClose = () => {
    setAddFormData({ courseId: "", groupName: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
        Add Enrollment
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Select a course and group to enroll the student in.
          </Typography>

       
          <FormControl fullWidth>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={addFormData.courseId}
              onChange={handleCourseChange}
              label="Select Course"
              disabled={isLoading}
              sx={{ borderRadius: "12px" }}
              MenuProps={{ PaperProps: { sx: { borderRadius: "12px", mt: 0.5 } } }}
            >
              {allCourses && allCourses.length > 0 ? (
                allCourses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course._id} - {course.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No courses available</MenuItem>
              )}
            </Select>
          </FormControl>

         
          <FormControl fullWidth disabled={!addFormData.courseId || isLoading}>
            <InputLabel shrink={true}>Select Group</InputLabel>
            <Select
              value={addFormData.groupName || ""}
              label="Select Group"
              displayEmpty
              sx={{ borderRadius: "12px" }}
              renderValue={(val) => {
                if (!val) return <em style={{ color: "#aaa" }}>Choose a group</em>;
                return val.replace(/[A-Za-z]+-\d+-/, "").split("-")[0];
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "12px", mt: 0.5,
                    boxShadow: "0px 8px 24px rgba(21,43,72,0.15)",
                    maxHeight: 300,
                    "& .MuiList-root": { padding: 0 },
                  },
                },
              }}
            >
              <MenuItem disabled value="" sx={{ display: "none" }} />
              {uniqueGroups.length > 0 ? (
                uniqueGroups.map(({ short, full }, index) => (
                  <MenuItem
                    key={short}
                    value={full}
                    onClick={() => handleGroupChange(full)}
                    sx={{
                      p: 0,
                      "& .grp-row": {
                        borderBottom: index === uniqueGroups.length - 1
                          ? "none" : `1px solid ${theme.palette.divider}`,
                      },
                    }}
                  >
                    <Tooltip
                      title={getGroupTooltip(short)}
                      placement="right"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "rgba(21,43,72,0.95)",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                            borderRadius: "8px", p: 1,
                          },
                        },
                        arrow: { sx: { color: "rgba(21,43,72,0.95)" } },
                      }}
                    >
                      <Box className="grp-row" sx={{
                        display: "flex", alignItems: "center",
                        width: "100%", px: 2, py: 1.5,
                        "&:hover": {
                          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                        },
                      }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {short}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No groups available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={isLoading}
          sx={{ borderRadius: "8px", textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!addFormData.courseId || !addFormData.groupName || isLoading}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Add Enrollment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}