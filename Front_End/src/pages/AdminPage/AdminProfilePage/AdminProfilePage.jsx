import React from "react";
import { Box } from "@mui/material";
import AdminProfileComp from "../../../components/AdminComp/AdminProfile/AdminProfileComp";

export default function AdminProfilePage() {
  return (
    <Box
      sx={{
        width: "100%",
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        m: 0,
      }}
    >
      <AdminProfileComp />
    </Box>
  );
}
