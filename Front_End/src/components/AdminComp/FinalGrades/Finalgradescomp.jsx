import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Collapse,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import useFinalGrades from "../../../hooks/Admin/FinalGrades/Usefinalgrades";

export default function Finalgradescomp() {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const isDark = theme.palette.mode === "dark";

  const {
    file,
    courseId,
    setCourseId,
    courses,
    loading,
    successMessage,
    errorMessage,
    uploadResult,
    handleFileChange,
    handleUpload,
    clearMessages,
  } = useFinalGrades();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { handleFileChange({ target: { files: [dropped] } }); clearMessages(); }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    clearMessages();
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 780 }}>

      {/* ══════════════════════════════════════
          MAIN CARD
      ══════════════════════════════════════ */}
      <Box
        sx={{
          borderRadius: "20px",
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.3)"
            : "0 4px 24px rgba(21,43,72,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Top strip */}
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          }}
        />

        <Box sx={{ p: { xs: 3, md: 4 } }}>

          {/* ══════════════════════════════════════
              ROW: Course selector + File icon
          ══════════════════════════════════════ */}
          <Box
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: "14px",
              border: `2px solid ${
                dragOver
                  ? theme.palette.primary.main
                  : file
                  ? theme.palette.success.main
                  : theme.palette.divider
              }`,
              backgroundColor: dragOver
                ? isDark ? "rgba(25,118,210,0.07)" : "rgba(25,118,210,0.03)"
                : file
                ? isDark ? "rgba(76,175,80,0.06)" : "rgba(76,175,80,0.03)"
                : isDark ? "rgba(255,255,255,0.01)" : "#fafbfc",
              transition: "all 0.2s ease",
            }}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={(e) => { handleFileChange(e); clearMessages(); }}
            />

            {/* Course Selector - takes all available space */}
            <FormControl size="small" sx={{ flex: 1, minWidth: 0 }}>
              <Select
                value={courseId}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected)
                    return (
                      <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                        Select a course to upload grades…
                      </Typography>
                    );
                  const found = courses?.find((c) => c._id === selected);
                  return (
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {found ? `${found._id} — ${found.name}` : selected}
                    </Typography>
                  );
                }}
                onChange={(e) => { setCourseId(e.target.value); clearMessages(); }}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography variant="body2" color="text.secondary">— Select a Course —</Typography>
                </MenuItem>
                {courses?.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{course.name}</Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>{course._id}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Divider line */}
            <Box sx={{ width: "1px", height: 36, backgroundColor: theme.palette.divider, flexShrink: 0 }} />

            {/* File Upload Icon Button */}
            {file ? (
              /* File selected — show name + remove */
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 1.5,
                    py: 0.6,
                    borderRadius: "8px",
                    backgroundColor: isDark ? "rgba(76,175,80,0.15)" : "rgba(76,175,80,0.1)",
                    border: `1px solid ${theme.palette.success.light}`,
                    maxWidth: 180,
                  }}
                >
                  <InsertDriveFileIcon sx={{ color: theme.palette.success.main, fontSize: 16, flexShrink: 0 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.success.dark,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </Typography>
                </Box>
                <Tooltip title="Remove file">
                  <IconButton
                    size="small"
                    onClick={handleRemoveFile}
                    sx={{
                      width: 28,
                      height: 28,
                      color: theme.palette.text.secondary,
                      "&:hover": { color: theme.palette.error.main, backgroundColor: isDark ? "rgba(211,47,47,0.15)" : "rgba(211,47,47,0.08)" },
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              /* No file — show upload icon */
              <Tooltip title="Attach Excel file (.xlsx / .xls)" arrow>
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "10px",
                    flexShrink: 0,
                    backgroundColor: isDark ? "rgba(25,118,210,0.14)" : "rgba(25,118,210,0.08)",
                    color: theme.palette.primary.main,
                    border: `1px dashed ${theme.palette.primary.light}`,
                    transition: "all 0.18s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      border: `1px solid ${theme.palette.primary.main}`,
                      transform: "scale(1.06)",
                    },
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Drag hint */}
          {!file && (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 0.8, color: theme.palette.text.disabled, pl: 0.5 }}
            >
              You can also drag & drop an Excel file anywhere in the box above
            </Typography>
          )}

          {/* ── Guidelines Toggle ── */}
          <Box
            onClick={() => setGuidelinesOpen((v) => !v)}
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              py: 1,
              px: 1.5,
              borderRadius: "10px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
              transition: "all 0.18s ease",
              userSelect: "none",
              "&:hover": {
                backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#eef2ff",
                borderColor: theme.palette.primary.light,
              },
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>
              📋 Excel column guidelines
            </Typography>
            {guidelinesOpen
              ? <KeyboardArrowUpIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
              : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            }
          </Box>

          {/* ── Guidelines Content ── */}
          <Collapse in={guidelinesOpen} timeout={280} unmountOnExit>
            <Box
              sx={{
                mt: 1,
                p: 2.5,
                borderRadius: "12px",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#fafbfc",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Student ID */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: theme.palette.primary.main, display: "block", mb: 1 }}
                >
                  Student ID column
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {["id", "student_id", "code", "student id", "كود الطالب"].map((v) => (
                    <Chip key={v} label={v} size="small" sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.75rem", backgroundColor: isDark ? "rgba(25,118,210,0.18)" : "rgba(25,118,210,0.09)", color: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.light}`, borderRadius: "6px", height: 24 }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ height: "1px", backgroundColor: theme.palette.divider }} />

              {/* Final Grade */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: theme.palette.success.main, display: "block", mb: 1 }}
                >
                  Final grade column
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {["final", "final_grade", "total", "score", "final score", "final grade"].map((v) => (
                    <Chip key={v} label={v} size="small" sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.75rem", backgroundColor: isDark ? "rgba(76,175,80,0.16)" : "rgba(76,175,80,0.09)", color: theme.palette.success.main, border: `1px solid ${theme.palette.success.light}`, borderRadius: "6px", height: 24 }} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Collapse>

          {/* ── Error ── */}
          {errorMessage && (
            <Box sx={{ mt: 2, p: 1.8, borderRadius: "10px", backgroundColor: isDark ? "rgba(211,47,47,0.1)" : "rgba(211,47,47,0.06)", border: `1px solid ${theme.palette.error.light}`, display: "flex", gap: 1, alignItems: "flex-start" }}>
              <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: 16, mt: "2px", flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: theme.palette.error.main, fontWeight: 600 }}>{errorMessage}</Typography>
            </Box>
          )}

          {/* ── Success ── */}
          {(successMessage || uploadResult) && (
            <Box sx={{ mt: 2, p: 1.8, borderRadius: "10px", backgroundColor: isDark ? "rgba(76,175,80,0.1)" : "rgba(76,175,80,0.07)", border: `1px solid ${theme.palette.success.light}`, display: "flex", gap: 1, alignItems: "flex-start" }}>
              <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 16, mt: "2px", flexShrink: 0 }} />
              <Box>
                {successMessage && (
                  <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.success.dark, display: "block" }}>{successMessage}</Typography>
                )}
                {uploadResult && (
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    Processed: <strong>{uploadResult.processed ?? "—"}</strong> &nbsp;·&nbsp; Updated: <strong>{uploadResult.results?.length ?? "—"}</strong>
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* ── Upload Button ── */}
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !file || !courseId}
            onClick={handleUpload}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "none",
              boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.35)" : "0 4px 16px rgba(25,118,210,0.2)",
            }}
          >
            {loading ? "Uploading…" : "Upload Final Grades"}
          </Button>

          <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: theme.palette.text.disabled, textAlign: "center" }}>
            GPA and academic records update automatically. Students get notified.
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}