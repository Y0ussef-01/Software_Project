import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, useTheme, CircularProgress,
} from "@mui/material";

export default function DeleteConfirmModal({
  open, onClose, onConfirm, enrollment, isLoading,
}) {
  const theme = useTheme();
  if (!enrollment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle sx={{ fontWeight: 700, color: theme.palette.error.main }}>
        Remove Enrollment
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to remove{" "}
          <strong>{enrollment.courseName}</strong> — {enrollment.groupOnly}?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This will drop the course from the student's schedule.
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