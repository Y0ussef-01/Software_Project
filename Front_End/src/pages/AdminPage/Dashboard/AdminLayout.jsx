import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../../components/AdminComp/AdminLayout/AdminSidebar";
import AdminTopbar from "../../../components/AdminComp/AdminLayout/AdminTopbar";

export default function AdminLayout() {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminTopbar />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
