import React from "react";
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Chip, useTheme,
} from "@mui/material";

const STATUS_CONFIG = {
    created: { label: "Group Will Be Created", color: "info" },
    exists: { label: "Group Already Exists", color: "success" },
    not_found: { label: "Course Not Found", color: "error" },
    invalid: { label: "Invalid Data", color: "error" },
    duplicate: { label: "Duplicate", color: "warning" },
};

export default function SchedulePreviewTable({ rows }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const tableBorderColor = isDark ? "rgba(255,255,255,0.05)" : "#f4f7fe";

    const headers = ["Row", "Course", "Code", "Group", "Type", "Day", "Start", "End", "Room", "Capacity", "Status"];

    return (
        <TableContainer
            sx={{
                borderRadius: "12px",
                border: `1px solid ${tableBorderColor}`,
                maxHeight: 420,
                overflow: "auto",
            }}
        >
            <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                    <TableRow>
                        {headers.map((h) => (
                            <TableCell
                                key={h}
                                align={h === "Row" || h === "Capacity" || h === "Status" ? "center" : "left"}
                                sx={{
                                    fontWeight: "bold",
                                    color: theme.palette.text.secondary,
                                    borderBottom: `1px solid ${tableBorderColor}`,
                                    bgcolor: theme.palette.background.paper,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {h}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((r) => {
                        const cfg = STATUS_CONFIG[r.status] || { label: r.status, color: "default" };
                        return (
                            <TableRow
                                key={r.row}
                                sx={{ "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#fafbfc" } }}
                            >
                                <TableCell align="center" sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                    {r.row}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.primary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                    {r.courseName || "—"}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                    {r.courseId || r.courseCode || "—"}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.primary, fontWeight: "bold", borderBottom: `1px solid ${tableBorderColor}` }}>
                                    {r.groupName || "—"}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                    {r.type || "—"}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}`, textTransform: "capitalize" }}>
                                    {r.day || "—"}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}`, whiteSpace: "nowrap" }}>
                                    {r.startTime || "—"}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}`, whiteSpace: "nowrap" }}>
                                    {r.endTime || "—"}
                                </TableCell>
                                <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                    {r.Room || "—"}
                                </TableCell>
                                <TableCell align="center" sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                    {r.capacity ?? "—"}
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${tableBorderColor}` }}>
                                    <Chip
                                        label={cfg.label}
                                        color={cfg.color === "default" ? undefined : cfg.color}
                                        size="small"
                                        sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                                    />
                                    {r.reason && (
                                        <Typography variant="caption" sx={{ display: "block", color: theme.palette.text.disabled, mt: 0.3 }}>
                                            {r.reason}
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}