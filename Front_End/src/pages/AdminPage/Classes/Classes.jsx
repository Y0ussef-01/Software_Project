import React from "react";
import { Box } from "@mui/material";
import ClassesComp from "../../../components/AdminComp/ClassesComp/ClassesComp";

export default function Classes() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          p: { xs: 2, md: 4, lg: 5 },
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        <ClassesComp />
      </Box>

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