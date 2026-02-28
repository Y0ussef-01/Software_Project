import React from "react";
import { Box, Container } from "@mui/material";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";
import TeacherResetPasswordComp from "../../components/RestTeacherPassword/RestTeacherPassword.jsx";

export default function TeacherResetPasswordPage() {
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

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          <TeacherResetPasswordComp />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
