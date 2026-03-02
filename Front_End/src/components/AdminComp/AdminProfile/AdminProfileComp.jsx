import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import AdminAvatarSection from "../../AdminComp/AdminLayout/AdminAvatarSection";
import { useAdminProfile } from "../../../context/Admin/AdminProfileContext";

export default function AdminProfileComp() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { adminData, isLoading } = useAdminProfile();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const details = [
    { label: "Admin ID", value: adminData?._id || "N/A" },
    { label: "Email Address", value: adminData?.email || "N/A" },
    { label: "Role", value: adminData?.role || "Super Admin" },
    { label: "Account Status", value: adminData?.status || "Active" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "850px",
        p: { xs: 3, sm: 4, md: 5 },
        borderRadius: "24px",
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
            : "0px 10px 40px rgba(21, 43, 72, 0.08)",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "8px",
          backgroundColor: theme.palette.primary.main,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          right: "-5%",
          width: { xs: "200px", sm: "280px", md: "350px" },
          height: { xs: "200px", sm: "280px", md: "350px" },
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(144,202,249,0.06) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(25,118,210,0.06) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/adminPanel")}
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            color: theme.palette.text.secondary,
            fontWeight: 700,
            textTransform: "none",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.primary.main,
            },
          }}
        >
          Back to Dashboard
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            mb: 5,
            gap: { xs: 3, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              alignSelf: { xs: "center", md: "flex-start" },
            }}
          >
            <AdminPanelSettingsIcon
              sx={{
                fontSize: { xs: 28, sm: 34, md: 40 },
                color: theme.palette.primary.main,
                mr: { xs: 1, sm: 2 },
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "900",
                color: theme.palette.text.primary,
                fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.125rem" },
              }}
            >
              Admin Profile
            </Typography>
          </Box>

          <AdminAvatarSection variant="profile" />
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {details.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  height: "100%",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                  borderRadius: "16px",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-3px)",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "#fff",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0px 8px 20px rgba(0,0,0,0.4)"
                        : "0px 8px 20px rgba(21,43,72,0.06)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    display: "block",
                    mb: 0.5,
                    textTransform: "uppercase",
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 900,
                    color: theme.palette.text.primary,
                    wordBreak: "break-word",
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
