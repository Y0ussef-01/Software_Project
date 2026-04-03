import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
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

export default function DashboardComp() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { stats, isLoading, error } = useDashboardStats();

  const COLORS = [
    "#1976d2",
    "#0288d1",
    "#0097a7",
    "#00897b",
    "#43a047",
    "#7cb342",
    "#fdd835",
    "#fb8c00",
    "#e53935",
    "#8e24aa",
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
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

  const chartData = (stats?.studentsPerCourse || []).map((item) => {
    return {
      courseId: item.courseId,
      fullName: item.courseName,
      count: item.enrolledStudentsCount,
    };
  });

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}
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

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <StatCard {...card} isDark={isDark} />
          </Grid>
        ))}
      </Grid>

      {/* Students per Course Chart */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "20px",
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#fff",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "#eef2f6"}`,
          boxShadow: isDark
            ? "0px 8px 30px rgba(0,0,0,0.3)"
            : "0px 8px 30px rgba(21,43,72,0.07)",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            pb: 2.5,
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: isDark ? "#fff" : "#0f172a",
                mb: 0.8,
                fontSize: "1.25rem",
              }}
            >
              📊 Course Enrollment Overview
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? "rgba(255,255,255,0.5)" : "#64748b",
                fontWeight: 500,
              }}
            >
              Students distribution across active courses
            </Typography>
          </Box>
        </Box>

        {chartData.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary">
              No course data available.
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="25%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 60, right: 10, left: 0, bottom: 20 }}
              barCategoryGap="4%"
            >
              <CartesianGrid
                strokeDasharray="5 5"
                stroke={isDark ? "rgba(255,255,255,0.03)" : "#f5f7fa"}
                vertical={false}
                horizontalPoints={[0, 25, 50, 75, 100]}
              />
              <XAxis
                dataKey="courseId"
                tick={(props) => {
                  const { x, y, payload } = props;
                  const data = chartData.find(
                    (d) => d.courseId === payload.value,
                  );
                  return (
                    <g>
                      <text
                        x={x}
                        y={y - 50}
                        textAnchor="middle"
                        fill={isDark ? "rgba(255,255,255,0.7)" : "#1e293b"}
                        fontSize={14}
                        fontWeight={700}
                      >
                        {payload.value}
                      </text>
                      <rect
                        x={x - 28}
                        y={y + 8}
                        width={56}
                        height={24}
                        rx={6}
                        fill={
                          isDark
                            ? "rgba(59,130,246,0.2)"
                            : "rgba(59,130,246,0.1)"
                        }
                        stroke={
                          isDark
                            ? "rgba(59,130,246,0.5)"
                            : "rgba(59,130,246,0.3)"
                        }
                        strokeWidth={1}
                      />
                      <text
                        x={x}
                        y={y + 26}
                        textAnchor="middle"
                        fill={isDark ? "#60a5fa" : "#2563eb"}
                        fontSize={13}
                        fontWeight={800}
                      >
                        {data?.count}
                      </text>
                    </g>
                  );
                }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{
                  fill: isDark ? "rgba(255,255,255,0.45)" : "#64748b",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, 20]}
              />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                animationDuration={1200}
                maxBarSize={30}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}
