import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import useDashboardStats from "../../../hooks/Admin/Dashboard/useDashboardStats";

const StatCard = ({ title, value, icon, color, isDark }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: "20px",
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#eef2f6"}`,
      boxShadow: isDark
        ? "0px 8px 30px rgba(0,0,0,0.3)"
        : "0px 8px 30px rgba(21,43,72,0.07)",
      display: "flex",
      alignItems: "center",
      gap: 2.5,
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: isDark
          ? "0px 14px 40px rgba(0,0,0,0.4)"
          : "0px 14px 40px rgba(21,43,72,0.12)",
      },
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "14px",
        backgroundColor: `${color}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 28, color: color } })}
    </Box>
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: isDark ? "rgba(255,255,255,0.5)" : "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          fontSize: "0.7rem",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          color: isDark ? "#fff" : "#0f172a",
          lineHeight: 1.2,
          mt: 0.3,
        }}
      >
        {value ?? "—"}
      </Typography>
    </Box>
  </Paper>
);

export default function DashboardStatCards() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "30vh",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents?.toLocaleString(),
      icon: <SchoolOutlinedIcon />,
      color: "#1976d2",
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers?.toLocaleString(),
      icon: <PeopleOutlinedIcon />,
      color: "#0097a7",
    },
    {
      title: "Total Courses",
      value: stats?.totalCourses?.toLocaleString(),
      icon: <ClassOutlinedIcon />,
      color: "#43a047",
    },
    {
      title: "Average GPA",
      value:
        stats?.averageGPA != null ? Number(stats.averageGPA).toFixed(2) : "—",
      icon: <GradeOutlinedIcon />,
      color: "#fb8c00",
    },
  ];

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Header */}
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 900, color: isDark ? "#fff" : "#0f172a" }}
        >
          Academic Dashboard
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: isDark ? "rgba(255,255,255,0.45)" : "#94a3b8", mt: 0.5 }}
        >
          A quick look at your university's key statistics
        </Typography>
      </Box>

      {/* Stats Cards - Dynamic Flex Layout */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          width: "100%",
        }}
      >
        {statCards.map((card) => (
          <Box
            key={card.title}
            sx={{
              flex: "1 1 calc(25% - 24px)",
              minWidth: "250px",
              "@media (max-width: 1200px)": {
                flex: "1 1 calc(50% - 12px)",
                minWidth: "280px",
              },
              "@media (max-width: 600px)": {
                flex: "1 1 100%",
                minWidth: "auto",
              },
            }}
          >
            <StatCard {...card} isDark={isDark} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
