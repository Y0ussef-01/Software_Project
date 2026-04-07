import React from "react";
import { Box } from "@mui/material";

import Header from "../../components/HeaderComp/Header";
import Footer from "../../components/FooterComp/Footer.jsx";

import RegistrationComp from "../../components/RegistrationComp/RegistrationComp";
import { useLanguage } from "../../context/LanguageContext";

export default function RegistrationPage() {
  const { language } = useLanguage();

  return (
    <Box
      dir={language === "ar" ? "rtl" : "ltr"}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f4f7fe",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          p: { xs: 2, md: 4, lg: 5 },
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        <RegistrationComp />
      </Box>

      <Footer />

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}
