import React from "react";
import { Box, Container, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";
import ProfileTeacherComp from "../../components/ProfileTeacherComp/ProfileTeacherComp";

export default function TeacherProfilePage() {
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
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
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

          <ProfileTeacherComp />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
