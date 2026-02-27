import React from "react";
import { Box, Container } from "@mui/material";
import ProfileStudentComp from "../../components/ProfileStudentComp/ProfileStudentComp.jsx";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";
import FeaturesComp from "../../components/FeatureComp/FeatureComp.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <ToastContainer />
      <Header />

      <Box sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, lg: 6, xl: 10 } }}>
          <ProfileStudentComp />

          <FeaturesComp />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
