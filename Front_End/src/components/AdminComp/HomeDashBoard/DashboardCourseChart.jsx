import React from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useDashboardStats from "../../../hooks/Admin/Dashboard/useDashboardStats";

export default function DashboardCourseChart() {
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

  const chartData = (stats?.studentsPerCourse || []).map((item) => {
    return {
      courseId: item.courseId,
      fullName: item.courseName,
      count: item.enrolledStudentsCount,
    };
  });

  return (
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
        width: "100%",
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

      {/* Chart */}
      {chartData.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="text.secondary">
            No course data available.
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="40%" height={350}>
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
                      y={y - 90}
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
                        isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)"
                      }
                      stroke={
                        isDark ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.3)"
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
  );
}
