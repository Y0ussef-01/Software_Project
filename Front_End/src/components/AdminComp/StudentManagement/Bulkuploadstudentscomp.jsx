import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Collapse,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import useBulkUploadStudents from "../../../hooks/Admin/StudentManagement/Usebulkuploadstudents";

export default function BulkUploadStudentsComp() {
  const theme = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const isDark = theme.palette.mode === "dark";

  const { file, loading, result, handleFileChange, handleUpload, handleReset } =
    useBulkUploadStudents();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange({ target: { files: [dropped] } });
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    handleReset();
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

          {/* ── Back Button ── */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/adminPanel/students")}
            sx={{
              mb: 3,
              color: theme.palette.text.secondary,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "transparent", color: theme.palette.primary.main },
            }}
          >
            Back to Students
          </Button>

          {/* ══════════════════════════════════════
              ROW: placeholder text + File icon
              (نفس بالظبط الـ Final Grades row)
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
              onChange={handleFileChange}
            />

            {/* Text placeholder - takes all space (زي الـ course selector في Final Grades) */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {file ? (
                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  {file.name}
                  <Typography component="span" variant="caption" sx={{ color: theme.palette.text.secondary, ml: 1 }}>
                    ({(file.size / 1024).toFixed(1)} KB)
                  </Typography>
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                  Upload an Excel sheet to add multiple students at once…
                </Typography>
              )}
            </Box>

            {/* Divider line */}
            <Box sx={{ width: "1px", height: 36, backgroundColor: theme.palette.divider, flexShrink: 0 }} />

            {/* File Upload Icon Button */}
            {file ? (
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
                  }}
                >
                  <InsertDriveFileIcon sx={{ color: theme.palette.success.main, fontSize: 16, flexShrink: 0 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: theme.palette.success.dark }}
                  >
                    Ready
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
                      "&:hover": {
                        color: theme.palette.error.main,
                        backgroundColor: isDark ? "rgba(211,47,47,0.15)" : "rgba(211,47,47,0.08)",
                      },
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
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
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: theme.palette.primary.main, display: "block", mb: 1 }}>
                  Student ID column
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {["id", "student_id", "code", "student id", "كود الطالب"].map((v) => (
                    <Chip key={v} label={v} size="small" sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.75rem", backgroundColor: isDark ? "rgba(25,118,210,0.18)" : "rgba(25,118,210,0.09)", color: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.light}`, borderRadius: "6px", height: 24 }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ height: "1px", backgroundColor: theme.palette.divider }} />

              {/* Student Name */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: theme.palette.primary.main, display: "block", mb: 1 }}>
                  Student Name column
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {["name", "student_name", "الاسم", "اسم الطالب"].map((v) => (
                    <Chip key={v} label={v} size="small" sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.75rem", backgroundColor: isDark ? "rgba(25,118,210,0.18)" : "rgba(25,118,210,0.09)", color: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.light}`, borderRadius: "6px", height: 24 }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ height: "1px", backgroundColor: theme.palette.divider }} />

              {/* Password */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: theme.palette.success.main, display: "block", mb: 1 }}>
                  Password column
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {["password", "pass", "كلمة السر", "الباسورد"].map((v) => (
                    <Chip key={v} label={v} size="small" sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.75rem", backgroundColor: isDark ? "rgba(76,175,80,0.16)" : "rgba(76,175,80,0.09)", color: theme.palette.success.main, border: `1px solid ${theme.palette.success.light}`, borderRadius: "6px", height: 24 }} />
                  ))}
                </Box>
                <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: theme.palette.text.disabled }}>
                  💡 If no password column exists, the student ID will be used as the default password.
                </Typography>
              </Box>
            </Box>
          </Collapse>

          {/* ── Success / Result ── */}
          {result && (
            <Box
              sx={{
                mt: 2,
                p: 1.8,
                borderRadius: "10px",
                backgroundColor: isDark ? "rgba(76,175,80,0.1)" : "rgba(76,175,80,0.07)",
                border: `1px solid ${theme.palette.success.light}`,
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
              }}
            >
              <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 16, mt: "2px", flexShrink: 0 }} />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.success.dark, display: "block" }}>
                  Upload Successful!
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Processed: <strong>{result.totalProcessed ?? "—"}</strong> &nbsp;·&nbsp; Added: <strong>{result.newStudentsAdded ?? "—"}</strong>
                </Typography>
                {result.message && (
                  <Typography variant="caption" sx={{ color: theme.palette.text.disabled, display: "block", mt: 0.3 }}>
                    {result.message}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* ── Upload Button ── */}
          <Button
            variant="contained"
            fullWidth
            disabled={loading || !file}
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
            {loading ? "Uploading…" : "Upload Students"}
          </Button>

          <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: theme.palette.text.disabled, textAlign: "center" }}>
            Welcome emails will be sent automatically to all new students.
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}