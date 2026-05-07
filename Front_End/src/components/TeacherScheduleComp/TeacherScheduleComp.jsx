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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ClassIcon from "@mui/icons-material/Class";

import useTeacherSchedule from "../../hooks/Teacher/useTeacherSchedule";
import { useLanguage } from "../../context/LanguageContext";

const SCHEDULE_TRANS = {
  en: {
    mySchedule: "My Schedule",
    noSchedule: "You don't have any classes scheduled yet.",
    courseInfo: "Course Info",
    groupType: "Group & Type",
    schedule: "Schedule",
    location: "Location",
    grp: "Grp",
    tba: "TBA",
  },
  ar: {
    mySchedule: "الجدول الدراسي",
    noSchedule: "ليس لديك أي فصول مجدولة حتى الآن.",
    courseInfo: "معلومات المادة",
    groupType: "المجموعة والنوع",
    schedule: "المواعيد",
    location: "القاعة",
    grp: "مجموعة",
    tba: "يحدد لاحقاً",
  },
};

export default function TeacherScheduleComp() {
  const { scheduleData, isLoading } = useTeacherSchedule();
  const { language } = useLanguage();
  const t = SCHEDULE_TRANS[language] || SCHEDULE_TRANS["en"];
  const isAr = language === "ar";

  const filteredScheduleData = scheduleData.filter((row) => {
    const type = row.group?.type?.toLowerCase() || "";
    return type.includes("lect") || type === "";
  });

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: { xs: "24px", xl: "32px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
          boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        }}
      >
        <CircularProgress sx={{ color: "#152b48" }} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: { xs: "24px", xl: "32px" },
        backgroundColor: "#fff",
        width: "100%",
        boxShadow: "0px 10px 40px rgba(21, 43, 72, 0.08)",
        borderLeft: isAr ? "none" : "8px solid #152b48",
        borderRight: isAr ? "8px solid #152b48" : "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1.5 }}>
        <CalendarTodayIcon sx={{ color: "#152b48", fontSize: 30 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#152b48" }}>
          {t.mySchedule}
        </Typography>
      </Box>

      {filteredScheduleData.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            bgcolor: "#f8fafc",
            borderRadius: "16px",
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            {t.noSchedule}
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#152b48",
                    textAlign: isAr ? "right" : "left",
                  }}
                >
                  {t.courseInfo}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#152b48",
                    textAlign: isAr ? "right" : "left",
                  }}
                >
                  {t.groupType}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#152b48",
                    textAlign: isAr ? "right" : "left",
                  }}
                >
                  {t.schedule}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#152b48",
                    textAlign: isAr ? "left" : "right",
                    pr: isAr ? 0 : 3,
                    pl: isAr ? 3 : 0,
                  }}
                >
                  {t.location}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredScheduleData.map((row, index) => {
                const courseInfo = row.course || {};
                const groupInfo = row.group || {};
                const appointment = groupInfo.appointment || {};

                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#f1f5f9" },
                    }}
                  >
                    <TableCell sx={{ textAlign: isAr ? "right" : "left" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 800, color: "#152b48" }}
                      >
                        {courseInfo._id || t.tba}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {courseInfo.name || t.tba}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ textAlign: isAr ? "right" : "left" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          alignItems: isAr ? "flex-start" : "flex-start",
                        }}
                      >
                        <Chip
                          label={`${t.grp}: ${groupInfo.groupName || t.tba}`}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            bgcolor: "#e0f2fe",
                            color: "#0284c7",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "primary.main",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <ClassIcon sx={{ fontSize: 14 }} />
                          {"Lecture"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Schedule */}
                    <TableCell sx={{ textAlign: isAr ? "right" : "left" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarTodayIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {appointment.day || t.tba}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: isAr ? 0 : 3, mr: isAr ? 3 : 0 }}
                        >
                          {appointment.startTime || t.tba} -{" "}
                          {appointment.endTime || t.tba}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Location */}
                    <TableCell
                      sx={{
                        textAlign: isAr ? "left" : "right",
                        pr: isAr ? 0 : 3,
                        pl: isAr ? 3 : 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: isAr ? "flex-start" : "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 18, color: "error.light" }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="#152b48"
                        >
                          {groupInfo.Room || t.tba}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
