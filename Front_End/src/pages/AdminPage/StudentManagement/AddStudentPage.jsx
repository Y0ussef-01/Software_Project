import React from "react";
import { Box } from "@mui/material";
import AddStudentComp from "../../../components/AdminComp/StudentManagement/AddStudentComp";

export default function AddStudentPage() {
  return (
    <Box
      sx={{
        width: "100%",
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, md: 3, lg: 4 },
        animation: "fadeInUp 0.5s ease-out",
      }}
    >
      <AddStudentComp />

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}
