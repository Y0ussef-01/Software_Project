import React from "react";
import { Box } from "@mui/material";
import DashboardStatCards from "./DashboardStatCards";
import DashboardCourseChart from "./DashboardCourseChart";

export default function DashboardComp() {
  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* Stat Cards Section */}
      <DashboardStatCards />

      {/* Course Chart Section */}
      <DashboardCourseChart />
    </Box>
  );
}
