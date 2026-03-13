import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Typography, Paper } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SchoolIcon from "@mui/icons-material/School";

export default function FeaturesComp() {
  const features = [
    {
      id: 1,
      title: "Registration",
      icon: <AppRegistrationIcon fontSize="inherit" />,
      active: true,
      path: "/register-course",
    },
    {
      id: 2,
      title: "Appointments",
      icon: <CalendarMonthIcon fontSize="inherit" />,
      path: "/appointments",
    },
    {
      id: 3,
      title: "Grades",
      icon: <WorkspacePremiumIcon fontSize="inherit" />,
      path: "/grades",
    },
    {
      id: 5,
      title: "Profile",
      icon: <SchoolIcon fontSize="inherit" />,
      path: "/profile",
    },
  ];

  return (
    <Box sx={{ mt: { xs: 4, md: 5 }, width: "100%" }}>
      <Grid container spacing={2} justifyContent="center">
        {features.map((feature) => (
          <Grid item xs={12} sm={4} md={4} lg={2.5} key={feature.id}>
            <Paper
              component={Link}
              to={feature.path}
              elevation={0}
              sx={{
                width: {
                  xs: "100%",
                  sm: "160px",
                  md: "180px",
                  lg: "200px",
                  xl: "240px",
                },
                height: {
                  xs: "80px",
                  sm: "150px",
                  md: "160px",
                  lg: "170px",
                  xl: "180px",
                },
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                alignItems: "center",
                justifyContent: { xs: "flex-start", sm: "center" },
                px: { xs: 3, sm: 2 },
                borderRadius: "16px",
                border: "1px solid",
                borderColor: feature.active ? "#152b48" : "#eef2f6",
                backgroundColor: feature.active ? "#152b48" : "#fff",
                color: feature.active ? "#fff" : "#152b48",
                textDecoration: "none",
                transition: "all 0.3s ease",
                boxShadow: feature.active
                  ? "0px 8px 20px rgba(21, 43, 72, 0.2)"
                  : "0px 4px 15px rgba(21, 43, 72, 0.04)",
                "&:hover": {
                  backgroundColor: "#152b48",
                  color: "#fff",
                  transform: "translateY(-5px)",
                  boxShadow: "0px 10px 25px rgba(21, 43, 72, 0.2)",
                  borderColor: "#152b48",
                },
              }}
            >
              <Box
                sx={{
                  mr: { xs: 2, sm: 0 },
                  mb: { xs: 0, sm: 1.5 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: { xs: "2rem", sm: "2.5rem", lg: "2.8rem" },
                }}
              >
                {feature.icon}
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "900",
                  textAlign: { xs: "left", sm: "center" },
                  fontSize: {
                    xs: "1.05rem",
                    sm: "0.9rem",
                    md: "0.95rem",
                    lg: "1rem",
                  },
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: { xs: "auto", sm: "100%" },
                }}
              >
                {feature.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
