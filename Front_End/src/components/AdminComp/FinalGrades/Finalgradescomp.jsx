import React, { useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import useFinalGrades from "../../../hooks/Admin/FinalGrades/Usefinalgrades";

export default function Finalgradescomp() {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

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
    if (dropped) handleFileChange({ target: { files: [dropped] } });
  };

  const handleReset = () => {
    fileInputRef.current.value = "";
    setCourseId("");
    clearMessages();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: "850px", lg: "900px" },
        p: { xs: 3, sm: 4, md: 5, lg: 6 },
        borderRadius: { xs: "24px", xl: "32px" },
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
            : "0px 10px 40px rgba(21, 43, 72, 0.08)",
        overflow: "visible",
        mx: "auto", 
        display: "block",
        minHeight: "auto",
      }}
      
    >
      {/* Left accent bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: { xs: "8px", lg: "10px" },
          backgroundColor: theme.palette.primary.main,
        }}
      />

      {/* Background circle */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          right: "-5%",
          width: { xs: "200px", md: "350px", lg: "450px" },
          height: { xs: "200px", md: "350px", lg: "450px" },
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(144,202,249,0.05) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(25,118,210,0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <UploadFileIcon
            sx={{
              fontSize: { xs: 35, md: 45 },
              color: theme.palette.primary.main,
              mr: 2,
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: theme.palette.text.primary,
                fontSize: { xs: "1.8rem", md: "2.2rem" },
              }}
            >
              Upload Final Grades
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              Upload an Excel file to update final grades for a course
            </Typography>
          </Box>
        </Box>

        {/* Course Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              color: theme.palette.text.secondary,
              display: "block",
              mb: 1,
            }}
          >
            Course
          </Typography>
          <FormControl fullWidth size="small">
        <Select
  value={courseId}
  displayEmpty
  renderValue={(selected) => {
    if (!selected) {
      return "📖 Select a course to upload grades";
    }

    const selectedCourse = courses?.find(
      (c) => c._id === selected
    );

    return selectedCourse
      ? `${selectedCourse._id} - ${selectedCourse.name}`
      : selected;
  }}
  onChange={(e) => {
    setCourseId(e.target.value);
    clearMessages();
  }}
>

              <MenuItem value="">-- Select a Course --</MenuItem>
              {courses && courses.length > 0
                ? courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course._id} - {course.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
            
          </FormControl>
        </Box>

        {/* Drop Zone */}
        <Box
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !file && fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${
              dragOver
                ? theme.palette.primary.main
                : file
                  ? theme.palette.success.main
                  : theme.palette.divider
            }`,
            borderRadius: "20px",
            p: { xs: 4, md: 6 },
            textAlign: "center",
            cursor: file ? "default" : "pointer",
            backgroundColor: dragOver
              ? theme.palette.mode === "dark"
                ? "rgba(144,202,249,0.08)"
                : "rgba(25,118,210,0.04)"
              : file
                ? theme.palette.mode === "dark"
                  ? "rgba(102,187,106,0.06)"
                  : "rgba(76,175,80,0.04)"
                : theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.02)"
                  : "#f8fafc",
            transition: "all 0.25s ease",
            "&:hover": !file
              ? {
                  borderColor: theme.palette.primary.main,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(144,202,249,0.06)"
                      : "rgba(25,118,210,0.03)",
                }
              : {},
          }}
        >
          <input
            id="finalGradesFileInput"
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={(e) => {
              handleFileChange(e);
              clearMessages();
            }}
          />

          {file ? (
            <Box>
              <InsertDriveFileOutlinedIcon
                sx={{
                  fontSize: 56,
                  color: theme.palette.success.main,
                  mb: 1.5,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                {file.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                {(file.size / 1024).toFixed(1)} KB — Ready to upload
              </Typography>
              <Button
                startIcon={<DeleteOutlineIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                color="error"
                size="small"
                sx={{ mt: 2, textTransform: "none", fontWeight: 600 }}
              >
                Remove File
              </Button>
            </Box>
          ) : (
            <Box>
              <UploadFileIcon
                sx={{
                  fontSize: 56,
                  color: theme.palette.text.disabled,
                  mb: 1.5,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                Drag & drop your Excel file here
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                or click to browse — .xlsx / .xls only
              </Typography>
            </Box>
          )}
        </Box>

        {/* Excel Sheet Guidelines - Display column names */}
        <Box
          sx={{
            mt: 4,
            p: 0,
            borderRadius: "14px",
            backgroundColor: "transparent",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2.5,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ fontSize: "1.3rem" }}>📋</Box>
            Excel Sheet Guidelines
          </Typography>

          {/* Student ID Column Names */}
          <Box
            sx={{
              mb: 2.5,
              p: 2.5,
              borderRadius: "12px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(25,118,210,0.12)"
                  : "rgba(25,118,210,0.08)",
              border: `1px solid ${theme.palette.primary.light}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 1.5,
                fontSize: "0.9rem",
              }}
            >
              Student ID Column Header
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1.5,
                display: "block",
              }}
            >
              Use one of the following options as the student ID column heading.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {['id', 'student_id', 'code', 'student id', 'كود الطالب'].map((val) => (
                <Box
                  key={val}
                  sx={{
                    px: 1.5,
                    py: 0.7,
                    borderRadius: "8px",
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    fontFamily: "monospace",
                    border: `2px solid ${theme.palette.primary.dark}`,
                    boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
                  }}
                >
                  {val}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Final Grade Column Names */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: "12px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(76,175,80,0.12)"
                  : "rgba(76,175,80,0.08)",
              border: `1px solid ${theme.palette.success.light}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: theme.palette.success.main,
                mb: 1.5,
                fontSize: "0.9rem",
              }}
            >
              Final Grade Column Header
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1.5,
                display: "block",
              }}
            >
              Use one of the following options as the column title for the final grade.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {['final', 'final_grade', 'total', 'score', 'final score', 'final grade'].map((val) => (
                <Box
                  key={val}
                  sx={{
                    px: 1.5,
                    py: 0.7,
                    borderRadius: "8px",
                    backgroundColor: theme.palette.success.main,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    fontFamily: "monospace",
                    border: `2px solid ${theme.palette.success.dark}`,
                    boxShadow: `0 2px 8px ${theme.palette.success.main}40`,
                  }}
                >
                  {val}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Error Message */}
        {errorMessage && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: "12px",
              backgroundColor: theme.palette.error.light,
              border: `1px solid ${theme.palette.error.main}`,
              color: theme.palette.error.dark,
            }}
          >
            <Typography variant="body2">{errorMessage}</Typography>
          </Box>
        )}

        {/* Success Message */}
        {successMessage && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: "12px",
              backgroundColor: theme.palette.success.light,
              border: `1px solid ${theme.palette.success.main}`,
              color: theme.palette.success.dark,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CheckCircleOutlineIcon />
            <Typography variant="body2">{successMessage}</Typography>
          </Box>
        )}

        {/* Upload Result Summary */}
        {uploadResult && (
          <Box
            sx={{
              mt: 2,
              p: 3,
              borderRadius: "16px",
              backgroundColor: theme.palette.primary.light,
              border: `1px solid ${theme.palette.primary.main}`,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 40, color: theme.palette.primary.main }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: theme.palette.primary.dark }}
              >
                Upload Summary
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Processed: <strong>{uploadResult.processed ?? "—"}</strong> |
                Updated:{" "}
                <strong>{uploadResult.results?.length ?? "—"}</strong>
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Upload Button */}
        <Button
          variant="contained"
          fullWidth
          disabled={loading || !file || !courseId}
          onClick={handleUpload}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />
          }
          sx={{
            py: 1.8,
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            textTransform: "none",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 20px rgba(0,0,0,0.5)"
                : "0 8px 20px rgba(25, 118, 210, 0.25)",
          }}
        >
          {loading ? "Uploading..." : "Upload Final Grades"}
        </Button>

        {/* Note */}
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Grades will be distributed to students automatically. Academic records and GPA
          will be recalculated, and students will receive push notifications.
        </Typography>
      </Box>
      
    </Paper>
  );
}


const IconInfo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      width: "15px",
      height: "15px",
      flexShrink: 0,
      marginTop: "1px",
      color: "#c4b5fd",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);