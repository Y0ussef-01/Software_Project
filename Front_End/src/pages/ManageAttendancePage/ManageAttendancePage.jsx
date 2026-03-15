import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderComp/Header.jsx";
import Footer from "../../components/FooterComp/Footer.jsx";
import GenerateQRComp from "../../components/AttendanceComp/GenerateQRComp.jsx";
import ViewAttendanceComp from "../../components/AttendanceComp/ViewAttendanceComp.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageAttendancePage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/teacher")}
            sx={{
              color: "#64748b",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { color: "#152b48", backgroundColor: "transparent" },
            }}
          >
            Back to Home
          </Button>

          <Paper
            elevation={0}
            sx={{
              mt: "20px",
              p: { xs: 3, md: 5 },
              borderRadius: "24px",
              backgroundColor: "#fff",
              width: "100%",
              boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.04)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "900", color: "#152b48", mb: 4 }}
            >
              Manage Attendance
            </Typography>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                mb: 4,
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  color: "#64748b",
                },
                "& .Mui-selected": { color: "#152b48 !important" },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#152b48",
                  height: "3px",
                  borderRadius: "3px",
                },
              }}
            >
              <Tab label="Generate QR Token" />
              <Tab label="View Attendance Records" />
            </Tabs>

            {tabValue === 0 && <GenerateQRComp />}
            {tabValue === 1 && <ViewAttendanceComp />}
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
