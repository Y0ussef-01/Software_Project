import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ComputerIcon from "@mui/icons-material/Computer";

export default function FeaturesComp() {
  const features = [
    {
      id: 1,
      title: "Registration",
      icon: <AppRegistrationIcon fontSize="inherit" />,
      active: true,
    },
    {
      id: 2,
      title: "Schedule",
      icon: <CalendarMonthIcon fontSize="inherit" />,
    },
    {
      id: 3,
      title: "Grades",
      icon: <WorkspacePremiumIcon fontSize="inherit" />,
    },
    {
      id: 5,
      title: "Profile",
      icon: <ComputerIcon fontSize="inherit" />,
    },
  ];

  return (
    <Box sx={{ mt: { xs: 4, md: 5 } }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        {features.map((feature) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={4}
            lg={2}
            key={feature.id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: "180px", lg: "200px", xl: "240px" },
                height: { xs: "135px", lg: "160px", xl: "180px" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2, md: 3 },
                borderRadius: "16px",
                border: "1px solid",
                borderColor: feature.active ? "#152b48" : "#eef2f6",
                backgroundColor: feature.active ? "#152b48" : "#fff",
                color: feature.active ? "#fff" : "#152b48",
                cursor: "pointer",
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
                  mb: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: {
                    xs: "2.2rem",
                    md: "2.5rem",
                    lg: "2.8rem",
                    xl: "3.2rem",
                  },
                }}
              >
                {feature.icon}
              </Box>

              <Typography
                variant="subtitle1"
                title={feature.title}
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: { xs: "0.85rem", lg: "0.95rem", xl: "1.05rem" },
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  px: 1,
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
