import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, useTheme, CircularProgress,
} from "@mui/material";

export default function DeleteTeacherCourseModal({
  open, onClose, onConfirm, course, isLoading,
}) {
  const theme = useTheme();
  if (!course) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle sx={{ fontWeight: 700, color: theme.palette.error.main }}>
        Remove Assignment
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to remove{" "}
          <strong>{course.courseName}</strong> — {course.groupOnly}?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This will remove the course assignment from the teacher's schedule.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={isLoading}
          sx={{ borderRadius: "8px", textTransform: "none" }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error"
          disabled={isLoading}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Remove"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}