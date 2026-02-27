import React from "react";
import { Box, Container } from "@mui/material";
import ProfileTeacherComp from "../../components/ProfileTeacherComp/ProfileTeacherComp";
import Header from "../../components/HeaderComp/Header";
import Footer from "../../components/FooterComp/Footer.jsx";

// ✨ تم إزالة استدعاءات ToastContainer من هنا لأنها موجودة مسبقاً في App.jsx

export default function TeacherPage() {
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
          <ProfileTeacherComp />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
