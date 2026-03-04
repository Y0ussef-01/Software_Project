import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function DashboardPage() {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Welcome to your admin panel. Here is a summary of your system.
      </Typography>
    </Box>
  );
}
