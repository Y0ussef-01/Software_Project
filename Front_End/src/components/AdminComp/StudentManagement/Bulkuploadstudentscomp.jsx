import React, { useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import useBulkUploadStudents from "../../../hooks/Admin/StudentManagement/Usebulkuploadstudents";

export default function BulkUploadStudentsComp() {
  const theme = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const { file, loading, result, handleFileChange, handleUpload, handleReset } =
    useBulkUploadStudents();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange({ target: { files: [dropped] } });
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
        overflow: "hidden",
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

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/adminPanel/students")}
          sx={{
            mb: { xs: 3, md: 4 },
            color: theme.palette.text.secondary,
            fontWeight: 700,
            textTransform: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem", lg: "1rem" },
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.primary.main,
            },
          }}
        >
          Back to Students
        </Button>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
          <GroupAddIcon
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
              Bulk Upload Students
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              Upload an Excel sheet to add multiple students at once
            </Typography>
          </Box>
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
            id="bulkStudentsFileInput"
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleFileChange}
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

        {/* Excel format hint */}
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: "14px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "#f8fafc",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              mb: 1,
            }}
          >
            Expected Excel Columns
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {["_id", "name", "password (optional)"].map((col) => (
              <Box
                key={col}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                {col}
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.disabled, display: "block", mt: 1 }}
          >
            * If password is missing, Student ID will be used as default
            password. Welcome emails are sent automatically.
          </Typography>
        </Box>

        {/* Result summary */}
        {result && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              borderRadius: "16px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(102,187,106,0.08)"
                  : "rgba(76,175,80,0.06)",
              border: `1px solid ${theme.palette.success.light}`,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 40, color: theme.palette.success.main }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: theme.palette.success.dark }}
              >
                Upload Successful!
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                Total Processed: <strong>{result.totalProcessed ?? "—"}</strong>{" "}
                &nbsp;|&nbsp; New Students Added:{" "}
                <strong>{result.newStudentsAdded ?? "—"}</strong>
              </Typography>
              {result.message && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.disabled,
                    display: "block",
                    mt: 0.5,
                  }}
                >
                  {result.message}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Upload Button */}
        <Button
          variant="contained"
          fullWidth
          disabled={loading || !file}
          onClick={handleUpload}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <UploadFileIcon />
            )
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
          {loading ? "Uploading..." : "Upload Students"}
        </Button>
      </Box>
    </Paper>
  );
}
