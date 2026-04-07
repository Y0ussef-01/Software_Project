import React from "react";
import HelpComp from "../../components/HelpComp/HelpComp";
import Header from "../../components/HeaderComp/Header";
import Footer from "../../components/FooterComp/Footer.jsx";
import { useLanguage } from "../../context/LanguageContext";
import { Box } from "@mui/material";

const HelpPage = () => {
  const { language } = useLanguage();

  return (
    <Box dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />
      <HelpComp />
      <Footer />
    </Box>
  );
};

export default HelpPage;
