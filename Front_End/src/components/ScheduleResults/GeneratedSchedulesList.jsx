import React, { useState, useEffect, memo } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Chip,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const GeneratedSchedulesList = memo(function GeneratedSchedulesList({
                                                                        generatedSchedules,
                                                                        availableCourses,
                                                                        isActionLoading,
                                                                        handleConfirmSchedule,
                                                                        t,
                                                                    }) {
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        setVisibleCount(6);
    }, [generatedSchedules]);

    if (!Array.isArray(generatedSchedules) || generatedSchedules.length === 0) {
        return null;
    }

    const visibleSchedules = generatedSchedules.slice(0, visibleCount);

    return (
        <Box sx={{ mt: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: "800", color: "#152b48", mb: 3 }}>
                {t.validSchedulesFound || "Generated Schedules"}: {generatedSchedules.length}
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
                    gap: 3,
                }}
            >
                {visibleSchedules.map((schedule, sIdx) => (
                    <Card
                        key={sIdx}
                        elevation={0}
                        sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, p: 1, mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1d4ed8", mb: 2 }}>
                                {t.schedule || "Schedule"} #{sIdx + 1}
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {(Array.isArray(schedule) ? schedule : []).map((item, iIdx) => {
                                    const courseObj = (Array.isArray(availableCourses) ? availableCourses : []).find(
                                        (c) => c._id === item.courseId || c.courseId === item.courseId
                                    );
                                    const displayName = courseObj?.courseName || courseObj?.name || "";
                                    const courseAppointments = Array.isArray(item?.appointments)
                                        ? item.appointments
                                        : Array.isArray(item?.schedule)
                                            ? item.schedule
                                            : courseObj
                                                ? (Array.isArray(courseObj.groups) ? courseObj.groups : []).filter(
                                                    (g) => g.groupName === item.groupName || g.name === item.groupName
                                                )
                                                : [];

                                    return (
                                        <Paper
                                            key={iIdx}
                                            elevation={0}
                                            sx={{ p: 2, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}
                                        >
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#152b48" }}>
                                                    {item.courseId} {displayName && `- ${displayName}`}
                                                </Typography>
                                                <Chip
                                                    label={`${t.grp || "Group"}: ${item.groupName}`}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ fontWeight: "bold", height: "24px", fontSize: "0.75rem" }}
                                                />
                                            </Box>

                                            {courseAppointments.length === 0 ? (
                                                <Typography variant="caption" color="text.secondary">
                                                    {t.tba || "TBA"}
                                                </Typography>
                                            ) : (
                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                    {(Array.isArray(courseAppointments) ? courseAppointments : []).map((appt, aIdx) => (
                                                        <Box
                                                            key={aIdx}
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                flexWrap: "wrap",
                                                                gap: 2,
                                                                p: 1,
                                                                bgcolor: "#ffffff",
                                                                borderRadius: "8px",
                                                                border: "1px solid #f1f5f9",
                                                            }}
                                                        >
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: "80px" }}>
                                                                <Chip
                                                                    label={appt.type || "TBA"}
                                                                    size="small"
                                                                    sx={{ height: "20px", fontSize: "0.65rem", fontWeight: "bold", bgcolor: "#e0f2fe", color: "#0284c7" }}
                                                                />
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: "100px" }}>
                                                                <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                                <Typography variant="caption" sx={{ fontWeight: "bold", textTransform: "capitalize", color: "#475569" }}>
                                                                    {appt.day || appt.appointment?.day || "TBA"}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: "110px" }}>
                                                                <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                                <Typography variant="caption" sx={{ color: "#475569" }}>
                                                                    {appt.startTime || appt.appointment?.startTime || "TBA"} - {appt.endTime || appt.appointment?.endTime || "TBA"}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                                <Typography variant="caption" sx={{ color: "#475569" }}>
                                                                    Room: {appt.Room || "TBA"}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Paper>
                                    );
                                })}
                            </Box>
                        </CardContent>
                        <CardActions sx={{ p: 0 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                disabled={isActionLoading}
                                onClick={() => handleConfirmSchedule(Array.isArray(schedule) ? schedule : [])}
                                sx={{ borderRadius: "8px", fontWeight: "bold", textTransform: "none", mt: 1 }}
                            >
                                {t.confirmThisSchedule || "Confirm Schedule"}
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {generatedSchedules.length > visibleCount && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        sx={{ borderRadius: "12px", fontWeight: "bold", textTransform: "none", px: 4 }}
                    >
                        Show more ({generatedSchedules.length - visibleCount} remaining)
                    </Button>
                </Box>
            )}
        </Box>
    );
});

export default GeneratedSchedulesList;