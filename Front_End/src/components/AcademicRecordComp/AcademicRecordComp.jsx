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
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

import useAcademicRecord from "../../hooks/Student/useAcademicRecord";
import { useLanguage } from "../../context/LanguageContext";

const ACADEMIC_TRANS = {
  en: {
    academicRecord: "Academic Record",
    courseInfo: "Course Info",
    hours: "Hours",
    score: "Score",
    grade: "Grade",
    status: "Status",
    noAcademicRecord: "Your academic record is empty.",
    passed: "Passed",
    failed: "Failed",
  },
  ar: {
    academicRecord: "السجل الأكاديمي",
    courseInfo: "معلومات المادة",
    hours: "الساعات",
    score: "الدرجة",
    grade: "التقدير",
    status: "الحالة",
    noAcademicRecord: "السجل الأكاديمي الخاص بك فارغ.",
    passed: "ناجح",
    failed: "راسب",
  },
};

export default function AcademicRecordComp() {
  const { academicRecord, isLoading } = useAcademicRecord();
  const { language } = useLanguage();
  const t = ACADEMIC_TRANS[language] || ACADEMIC_TRANS["en"];

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
        <CircularProgress sx={{ color: "#152b48" }} />
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
          borderLeft: "8px solid #152b48",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
          <HistoryEduIcon sx={{ color: "#152b48", fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#152b48" }}>
            {t.academicRecord}
          </Typography>
        </Box>

        {academicRecord.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              bgcolor: "#f8fafc",
              borderRadius: "16px",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              {t.noAcademicRecord}
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
                    align="right"
                    sx={{ fontWeight: "bold", color: "#152b48", pr: 3 }}
                  >
                    {t.status}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {academicRecord.map((row, index) => (
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
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Chip
                        label={row.status === "Passed" ? t.passed : t.failed}
                        size="small"
                        color={row.status === "Passed" ? "success" : "error"}
                        variant="outlined"
                        sx={{ fontWeight: "bold", borderWidth: "2px" }}
                      />
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
