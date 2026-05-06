import React from "react";
import { Box, Typography } from "@mui/material";
import BulkUploadStudentsComp from "../../../components/AdminComp/StudentManagement/Bulkuploadstudentscomp";

export default function BulkUploadStudentsPage() {
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
      <Box sx={{ width: "100%", maxWidth: 780, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
          Upload Students
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 500 }}>
          Add multiple students at once via Excel sheet
        </Typography>
      </Box>

      <BulkUploadStudentsComp />
    </Box>
  );
}