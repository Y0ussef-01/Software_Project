import React from "react";
import { Box, Container } from "@mui/material";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";
import ProfileStudentComp from "../../components/ProfileStudentComp/ProfileStudentComp.jsx";
import { useLanguage } from "../../context/LanguageContext";

export default function ProfilePage() {
  const { language } = useLanguage();

  return (
    <Box
      dir={language === "ar" ? "rtl" : "ltr"}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Header />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <ProfileStudentComp />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
