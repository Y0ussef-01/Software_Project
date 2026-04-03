import React from "react";
import { Box } from "@mui/material";
import DashboardComp from "../../../components/AdminComp/HomeDashBoard/DashboardComp";

export default function DashboardPage() {
  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3, lg: 4 } }}>
      <DashboardComp />
    </Box>
  );
}