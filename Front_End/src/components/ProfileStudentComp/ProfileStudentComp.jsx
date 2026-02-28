import React from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SchoolIcon from "@mui/icons-material/School";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/Student/useStudentProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileComp() {
  const {
    studentData,
    loading,
    isImageUpdating,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    handleRemoveImage,
  } = useProfile();

  const navigate = useNavigate();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#152b48" }} />
      </Box>
    );
  }

  if (!studentData) {
    return (
      <Typography color="error" align="center" variant="h6" sx={{ mt: 5 }}>
        No Profile Data Found.
      </Typography>
    );
  }

  const details = [
    { label: "Student ID", value: studentData._id },
    { label: "Email", value: studentData.email },
    { label: "Department", value: studentData.department },
    { label: "Level", value: studentData.grade },
    { label: "Cumulative GPA", value: studentData.GPA },
    { label: "Completed Hours", value: studentData.hours },
    { label: "Max Hours", value: studentData.maxHours },
  ];

  const hasCustomImage =
    studentData.profileImg && !studentData.profileImg.includes("default");

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          p: { xs: 4, md: 5 },
          borderRadius: "20px",
          backgroundColor: "#fff",
          width: "100%",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "8px",
            background: "linear-gradient(180deg, #152b48 0%, #3b6ba5 100%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "-15%",
            left: "-5%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(21,43,72,0.04) 0%, rgba(255,255,255,0) 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", lg: "flex-start" },
              mb: { xs: 5, lg: 6 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                alignSelf: { xs: "center", lg: "flex-start" },
                gap: 3,
                mb: { xs: 4, lg: 0 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SchoolIcon sx={{ fontSize: 32, color: "#152b48", mr: 1.5 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "900",
                    color: "#152b48",
                    letterSpacing: "0.5px",
                  }}
                >
                  Student Profile
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<VpnKeyOutlinedIcon />}
                onClick={() => navigate("/reset-password")}
                sx={{
                  color: "#152b48",
                  borderColor: "#152b48",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(21, 43, 72, 0.04)",
                    borderColor: "#152b48",
                  },
                }}
              >
                Reset Password
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    cursor: isImageUpdating ? "default" : "pointer",
                    borderRadius: "50%",
                    overflow: "hidden",
                    "&:hover .overlay": { opacity: isImageUpdating ? 0 : 1 },
                  }}
                  onClick={handleImageClick}
                >
                  <Avatar
                    src={studentData.profileImg}
                    alt={studentData.name}
                    sx={{
                      width: { xs: 130, lg: 150, xl: 170 },
                      height: { xs: 130, lg: 150, xl: 170 },
                      boxShadow: "0px 8px 24px rgba(21,43,72,0.15)",
                      border: "5px solid #fff",
                      opacity: isImageUpdating ? 0.5 : 1,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                  {isImageUpdating && (
                    <CircularProgress
                      size={40}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-20px",
                        marginLeft: "-20px",
                        color: "#152b48",
                      }}
                    />
                  )}
                  {!isImageUpdating && (
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(21, 43, 72, 0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <PhotoCameraIcon sx={{ color: "#fff", fontSize: 45 }} />
                    </Box>
                  )}
                </Box>
                {hasCustomImage && !isImageUpdating && (
                  <Tooltip title="Remove photo" placement="left">
                    <IconButton
                      onClick={handleRemoveImage}
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 5,
                        right: 5,
                        backgroundColor: "#fff",
                        color: "#e11d48",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                        "&:hover": { backgroundColor: "#ffe4e6" },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: "900",
                  mt: 3,
                  color: "#1e293b",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {studentData.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", textAlign: "center", mt: 0.5 }}
              >
                {studentData.department}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Grid container spacing={3}>
              {details.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }} key={index}>
                  <Box
                    sx={{
                      p: 2.5,
                      height: "100%",
                      backgroundColor: "#fcfcfd",
                      borderRadius: "12px",
                      border: "1px solid #eef2f6",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#152b48",
                        backgroundColor: "#fff",
                        boxShadow: "0px 4px 15px rgba(21,43,72,0.06)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, color: "#0f172a", mt: 0.5 }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
