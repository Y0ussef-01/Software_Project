import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";
import ProfileTeacherComp from "../../components/ProfileTeacherComp/ProfileTeacherComp.jsx";

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
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 4, md: 6, lg: 8 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "850px", lg: "1050px", xl: "1250px" },
          }}
        >
          <ProfileTeacherComp />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
