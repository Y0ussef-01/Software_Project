import React from "react";
import { Box, Typography } from "@mui/material";
import Finalgradescomp from "../../../components/AdminComp/FinalGrades/Finalgradescomp";

export default function FinalGradesPage() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: { xs: 2, md: 3, lg: 4 },
        animation: "fadeInUp 0.4s ease-out",
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Page Title */}
      <Box sx={{ width: "100%", maxWidth: 540, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
          Final Grades
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 500 }}>
          Upload and distribute final exam results
        </Typography>
      </Box>

      <Finalgradescomp />
    </Box>
  );
}