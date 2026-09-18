import React, { useRef, useState } from "react";
import {
    Box, Typography, Button, useTheme, CircularProgress, Chip, Tooltip,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import useScheduleImport from "../../../hooks/Admin/ClassManagement/useScheduleImport";
import SchedulePreviewTable from "./SchedulePreviewTable";

export default function ScheduleJsonImporter({ courses, onImported }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const {
        file, rows, summary, previewing, importing, result,
        confirmOpen, handleFileChange, handleReset, handlePreview,
        openConfirm, closeConfirm, handleImport,
    } = useScheduleImport(courses);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) handleFileChange({ target: { files: [dropped] } });
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        handleReset();
    };

    const runImport = async () => {
        await handleImport();
        onImported?.();
    };

    const tableBorderColor = isDark ? "rgba(255,255,255,0.05)" : "#f4f7fe";

    return (
        <Box
            sx={{
                borderRadius: "20px",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(21,43,72,0.07)",
                overflow: "hidden",
                mb: 4,
                width: "100%",
            }}
        >
            <Box sx={{ height: 4, background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})` }} />

            <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <CalendarMonthIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                        Import Course Schedules
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                    Upload a JSON file to automatically populate course groups with their schedules, rooms, types, and capacities.
                </Typography>

                {/* ── Upload box ── */}
                <Box
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    sx={{
                        display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: "14px",
                        border: `2px solid ${dragOver ? theme.palette.primary.main : file ? theme.palette.success.main : theme.palette.divider}`,
                        backgroundColor: dragOver
                            ? isDark ? "rgba(25,118,210,0.07)" : "rgba(25,118,210,0.03)"
                            : file
                                ? isDark ? "rgba(76,175,80,0.06)" : "rgba(76,175,80,0.03)"
                                : isDark ? "rgba(255,255,255,0.01)" : "#fafbfc",
                        transition: "all 0.2s ease",
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,application/json"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {file ? (
                            <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                {file.name}
                                <Typography component="span" variant="caption" sx={{ color: theme.palette.text.secondary, ml: 1 }}>
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </Typography>
                            </Typography>
                        ) : (
                            <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                                Upload a JSON file to bulk-create or update course groups…
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ width: "1px", height: 36, backgroundColor: theme.palette.divider, flexShrink: 0 }} />

                    {file ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                            <Box sx={{
                                display: "flex", alignItems: "center", gap: 0.8, px: 1.5, py: 0.6, borderRadius: "8px",
                                backgroundColor: isDark ? "rgba(76,175,80,0.15)" : "rgba(76,175,80,0.1)",
                                border: `1px solid ${theme.palette.success.light}`,
                            }}>
                                <InsertDriveFileIcon sx={{ color: theme.palette.success.main, fontSize: 16, flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.success.dark }}>
                                    Ready
                                </Typography>
                            </Box>
                            <Tooltip title="Remove file">
                                <IconButton
                                    size="small"
                                    onClick={handleRemoveFile}
                                    sx={{
                                        width: 28, height: 28, color: theme.palette.text.secondary,
                                        "&:hover": { color: theme.palette.error.main, backgroundColor: isDark ? "rgba(211,47,47,0.15)" : "rgba(211,47,47,0.08)" },
                                    }}
                                >
                                    <CloseRoundedIcon sx={{ fontSize: 15 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ) : (
                        <Tooltip title="Attach JSON file (.json)" arrow>
                            <IconButton
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    width: 42, height: 42, borderRadius: "10px", flexShrink: 0,
                                    backgroundColor: isDark ? "rgba(25,118,210,0.14)" : "rgba(25,118,210,0.08)",
                                    color: theme.palette.primary.main,
                                    border: `1px dashed ${theme.palette.primary.light}`,
                                    transition: "all 0.18s ease",
                                    "&:hover": { backgroundColor: theme.palette.primary.main, color: "#fff", border: `1px solid ${theme.palette.primary.main}`, transform: "scale(1.06)" },
                                }}
                            >
                                <UploadFileIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {!file && (
                    <Typography variant="caption" sx={{ display: "block", mt: 0.8, color: theme.palette.text.disabled, pl: 0.5 }}>
                        You can also drag & drop a JSON file anywhere in the box above
                    </Typography>
                )}

                {/* ── Preview / Import buttons ── */}
                <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
                    <Button
                        variant="outlined"
                        disabled={!file || previewing || importing}
                        onClick={handlePreview}
                        startIcon={previewing ? <CircularProgress size={16} /> : <VisibilityIcon />}
                        sx={{ borderRadius: "12px", fontWeight: 700, textTransform: "none", px: 3 }}
                    >
                        {previewing ? "Parsing…" : "Preview"}
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!file || rows.length === 0 || importing}
                        onClick={openConfirm}
                        startIcon={importing ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                        sx={{ borderRadius: "12px", fontWeight: 700, textTransform: "none", px: 3 }}
                    >
                        {importing ? "Importing schedules…" : "Import Schedules"}
                    </Button>
                </Box>

                {/* ── Preview table + counts ── */}
                {rows.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                            <Chip label={`${summary.total} total`} size="small" />
                            <Chip label={`${summary.willCreate} to create`} color="info" size="small" />
                            <Chip label={`${summary.willUpdate} to update`} color="success" size="small" />
                            {summary.duplicates > 0 && <Chip label={`${summary.duplicates} duplicates`} color="warning" size="small" />}
                            {summary.notFound > 0 && <Chip label={`${summary.notFound} course not found`} color="error" size="small" />}
                            {summary.invalid > 0 && <Chip label={`${summary.invalid} invalid`} color="error" size="small" />}
                        </Box>
                        <SchedulePreviewTable rows={rows} />
                    </Box>
                )}

                {/* ── Result summary after import ── */}
                {result?.summary && (
                    <Box sx={{
                        mt: 3, p: 2, borderRadius: "12px",
                        backgroundColor: isDark ? "rgba(76,175,80,0.1)" : "rgba(76,175,80,0.07)",
                        border: `1px solid ${theme.palette.success.light}`,
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 18 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.success.dark }}>
                                Schedule import completed
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Chip label={`Processed: ${result.summary.processed}`} size="small" />
                            <Chip label={`Courses matched: ${result.summary.coursesMatched}`} size="small" />
                            <Chip label={`Created: ${result.summary.groupsCreated}`} color="info" size="small" />
                            <Chip label={`Updated: ${result.summary.groupsUpdated}`} color="success" size="small" />
                            {result.summary.duplicates > 0 && <Chip label={`Duplicates: ${result.summary.duplicates}`} color="warning" size="small" />}
                            {result.summary.failed > 0 && (
                                <Chip icon={<ErrorIcon />} label={`Failed: ${result.summary.failed}`} color="error" size="small" />
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* ── Confirmation dialog ── */}
            <Dialog
                open={confirmOpen}
                onClose={closeConfirm}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: "16px", bgcolor: theme.palette.background.paper, backgroundImage: "none" } }}
            >
                <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    Confirm Schedule Import
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: tableBorderColor }}>
                    <Typography sx={{ color: theme.palette.text.primary, mb: 1.5 }}>
                        You're about to import <strong>{summary.total}</strong> schedule record{summary.total === 1 ? "" : "s"}.
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}>
                        • <strong>{summary.willUpdate}</strong> existing group{summary.willUpdate === 1 ? "" : "s"} will be updated
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}>
                        • <strong>{summary.willCreate}</strong> new group{summary.willCreate === 1 ? "" : "s"} will be created
                    </Typography>
                    {(summary.duplicates > 0 || summary.notFound > 0 || summary.invalid > 0) && (
                        <>
                            <Divider sx={{ my: 1.5, borderColor: tableBorderColor }} />
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}>
                                {summary.duplicates > 0 && <>• {summary.duplicates} duplicate row{summary.duplicates === 1 ? "" : "s"} will be skipped<br /></>}
                                {summary.notFound > 0 && <>• {summary.notFound} row{summary.notFound === 1 ? "" : "s"} with an unmatched course will be skipped<br /></>}
                                {summary.invalid > 0 && <>• {summary.invalid} invalid row{summary.invalid === 1 ? "" : "s"} will be skipped<br /></>}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeConfirm} sx={{ color: theme.palette.text.secondary, fontWeight: "bold", textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={runImport}
                        variant="contained"
                        sx={{ fontWeight: "bold", textTransform: "none", borderRadius: "8px", px: 3 }}
                    >
                        Import Schedules
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}