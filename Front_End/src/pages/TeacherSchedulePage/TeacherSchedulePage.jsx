import React from "react";
import { Box, Container, Paper, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";

export default function TeacherSchedulePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: "#152b48",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        sx={{
          backgroundColor: "#f4f6f8",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 10 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/teacher")}
              sx={{
                color: "#64748b",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { color: "#152b48", backgroundColor: "transparent" },
              }}
            >
              Back to Home
            </Button>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 5, lg: 6 },
              borderRadius: { xs: "24px", xl: "32px" },
              backgroundColor: "#fff",
              width: "100%",
              textAlign: "center",
              boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "900", color: "#152b48" }}
            >
              Teacher Schedule
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", mt: 2 }}>
              The schedule component will be added here soon.
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
