import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from "@mui/material";
import GradeIcon from "@mui/icons-material/Grade";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import useGrades from "../../hooks/Student/useGrades";
import { useLanguage } from "../../context/LanguageContext";

const GRADES_TRANS = {
  en: {
    finalResults: "Current Semester Results",
    courseInfo: "Course Info",
    hours: "Hours",
    score: "Score",
    grade: "Grade",
    status: "Status",
    expiresAt: "Expires At",
    noFinalResults: "No current semester results available at the moment.",
    passed: "Passed",
    failed: "Failed",
  },
  ar: {
    finalResults: "نتائج الفصل الدراسي الحالي",
    courseInfo: "معلومات المادة",
    hours: "الساعات",
    score: "الدرجة",
    grade: "التقدير",
    status: "الحالة",
    expiresAt: "تختفي في",
    noFinalResults: "لا توجد نتائج معلنة للفصل الدراسي الحالي.",
    passed: "ناجح",
    failed: "راسب",
  },
};

export default function GradesComp() {
  const { finalResults, isLoading } = useGrades();
  const { language } = useLanguage();
  const t = GRADES_TRANS[language] || GRADES_TRANS["en"];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress sx={{ color: "#f59e0b" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          borderLeft: "8px solid #f59e0b",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
          <GradeIcon sx={{ color: "#f59e0b", fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#152b48" }}>
            {t.finalResults}
          </Typography>
        </Box>

        {finalResults.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              bgcolor: "#f8fafc",
              borderRadius: "16px",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              {t.noFinalResults}
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}
          >
            <Table sx={{ minWidth: 600 }}>
              <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#152b48" }}>
                    {t.courseInfo}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#152b48" }}
                  >
                    {t.hours}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#152b48" }}
                  >
                    {t.score}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#152b48" }}
                  >
                    {t.grade}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#152b48" }}
                  >
                    {t.status}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#152b48" }}
                  >
                    {t.expiresAt}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finalResults.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#f1f5f9" },
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 800, color: "#152b48" }}
                      >
                        {row.courseId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.courseName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.hours}
                        size="small"
                        sx={{ fontWeight: "bold", bgcolor: "#f1f5f9" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold" color="#152b48">
                        {row.score}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold" color="primary.main">
                        {row.grade}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.status === "Passed" ? t.passed : t.failed}
                        size="small"
                        color={row.status === "Passed" ? "success" : "error"}
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 0.5,
                          color: "text.secondary",
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption">
                          {formatDate(row.expiresAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
