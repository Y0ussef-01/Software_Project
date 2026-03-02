import React from "react";
import { Box } from "@mui/material";
import RestAdminPasswordComp from "../../../components/AdminComp/RestAdminPassword/RestAdminPasswordComp";

export default function RestAdminPasswordPage() {
  return (
    <Box
      sx={{
        width: "100%",
        flexGrow: 1,       
        display: "flex",
        justifyContent: "center",   
        alignItems: "center",   
      }}
    >
      <RestAdminPasswordComp />
    </Box>
  );
}
