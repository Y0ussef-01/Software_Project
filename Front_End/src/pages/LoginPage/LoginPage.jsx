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
          alignItems: "center", // خليناها center عشان تتوسطن في المساحة المتاحة بشكل مريح
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 10 },
          borderTopLeftRadius: { xs: "50px", md: "120px" },
          borderBottomRightRadius: { xs: "50px", md: "120px" },
          overflowY: "auto",
        }}
      >
        {/* غيرنا الـ maxWidth لـ xl عشان ياخد مساحة عرض أكبر ومريحة */}
        <Container maxWidth="xl">
          {/* ضفنا minHeight للجريد عشان يطول ويدي مساحة للصورة والفورم */}
          <Grid
            container
            spacing={4}
            alignItems="stretch"
            sx={{ minHeight: "65vh" }}
          >
            <Grid item xs={12} md={5} lg={4}>
              <LoginForm />
            </Grid>

            <Grid
              item
              xs={12}
              md={7}
              lg={8}
              sx={{ display: { xs: "none", md: "block" } }}
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
