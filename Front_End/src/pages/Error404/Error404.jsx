import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: { xs: "300px", md: "500px" },
          height: { xs: "300px", md: "500px" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(21,43,72,0.04) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: { xs: "400px", md: "600px" },
          height: { xs: "400px", md: "600px" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(21,43,72,0.03) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "7rem", sm: "10rem", md: "14rem" },
            fontWeight: 900,
            color: "#152b48",
            lineHeight: 1,
            letterSpacing: "-5px",
            textShadow: "6px 6px 0px rgba(21, 43, 72, 0.1)",
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mb: 2,
            fontSize: { xs: "1.5rem", md: "2.125rem" },
          }}
        >
          Oops! Page Not Found.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
            maxWidth: "500px",
            mx: "auto",
            mb: 5,
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.6,
          }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable. Let's get you back on track.
        </Typography>

        <Button
          variant="contained"
          startIcon={<HomeRoundedIcon sx={{ fontSize: "1.5rem !important" }} />}
          onClick={() => navigate("/home")}
          sx={{
            backgroundColor: "#152b48",
            color: "#fff",
            px: { xs: 4, md: 5 },
            py: { xs: 1.5, md: 2 },
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "0px 8px 20px rgba(21, 43, 72, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#2a4b7c",
              transform: "translateY(-4px)",
              boxShadow: "0px 12px 25px rgba(21, 43, 72, 0.3)",
            },
          }}
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
}
