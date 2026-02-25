import React from "react";
import { Box, Container, Grid } from "@mui/material";
import Header from "../../components/HeaderComp/Header.jsx";
import Advertisments from "../../components/AdvertisementsComp/Advertisments.jsx";
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";

export default function LoginPage() {
  return (
    <Box
      sx={{
        backgroundColor: "#152b48",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header />

      <Box
        sx={{
          backgroundColor: "#f4f6f8",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 10 },
          borderTopLeftRadius: { xs: "50px", md: "120px" },
          borderBottomRightRadius: { xs: "50px", md: "120px" },
          overflowY: "auto",
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
            alignItems={{ xs: "center", xl: "stretch" }}
            justifyContent="center"
            sx={{
              minHeight: "65vh",
              // ✨ السر الأول هنا: منع الـ Wrap في شاشات xl فقط عشان ما ينزلوش تحت بعض أبداً
              flexWrap: { xs: "wrap", xl: "nowrap" },
            }}
          >
            {/* مقاسات الفورم زي ما هي، ضفنا بس display flex في الـ xl عشان تطول صح */}
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              lg={5}
              xl={4}
              sx={{ display: { xl: "flex" } }}
            >
              <LoginForm />
            </Grid>

            {/* الصورة هتاخد باقي المساحة (8 أعمدة) وهتتمدد براحتها */}
            <Grid
              item
              xs={12}
              xl={8}
              sx={{
                // ✨ السر التاني: استخدمنا flex بدل block في الـ xl عشان البوكس ياخد المساحة الكافية ويفرد
                display: { xs: "none", xl: "flex" },
                flexGrow: 1, // بيجبر البوكس إنه ياخد أي مساحة فاضية جنبه
                maxWidth: { xl: "100%" },
              }}
            >
              <Advertisments />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
