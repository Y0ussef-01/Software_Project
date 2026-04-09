import React from "react";
import { Box, Container, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";
import TeacherScheduleComp from "../../components/TeacherScheduleComp/TeacherScheduleComp.jsx";
import { useLanguage } from "../../context/LanguageContext";

const PAGE_TRANS = {
  en: {
    backToHome: "Back to Home",
  },
  ar: {
    backToHome: "العودة للرئيسية",
  },
};

export default function TeacherSchedulePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = PAGE_TRANS[language] || PAGE_TRANS["en"];
  const isAr = language === "ar";

  return (
    <Box
      dir={isAr ? "rtl" : "ltr"}
      sx={{
        backgroundColor: "#152b48",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        component="main"
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
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          {/* زر الرجوع بعد تعديل المسافات */}
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              onClick={() => navigate("/teacher")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5, // <-- هنا ضفنا المسافة المطلوبة بين الأيقونة والنص
                color: "#64748b",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { color: "#152b48", backgroundColor: "transparent" },
              }}
            >
              {isAr ? <ArrowForwardIcon /> : <ArrowBackIcon />}
              <span>{t.backToHome}</span>
            </Button>
          </Box>

          <TeacherScheduleComp />
        </Container>
      </Box>

      <Footer />

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}
