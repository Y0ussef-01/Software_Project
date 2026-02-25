import React from "react";
import { Box, Container } from "@mui/material";
import ProfileComp from "../../components/ProfileComp/ProfileComp.jsx";
import Header from "../../components/HeaderComp/Header";
import Footer from "../../components/FooterComp/Footer.jsx";
import FeaturesComp from "../../components/FeatureComp/FeatureComp.jsx";

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
      <Header />

      <Box sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, lg: 6, xl: 10 } }}>
          <ProfileComp />

          <FeaturesComp />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
