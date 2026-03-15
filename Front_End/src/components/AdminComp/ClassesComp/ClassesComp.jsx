import React, { useState } from "react";
import {
    Box, Typography, TextField, Button, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider,
    FormControl, InputLabel, Select, Checkbox, ListItemText, OutlinedInput,
    useTheme 
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import useClassManagement from "../../../hooks/Admin/ClassManagement/useClassManagement";

export default function ClassesComp() {
    const { courses, isLoading, addCourse, deleteCourse, addGroup, deleteGroup } = useClassManagement();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        hours: 3,
        prerequisites: [],
    });

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [groupFormData, setGroupFormData] = useState({
        groupName: "",
        Room: "",
        type: "Lecture",
        capacity: 100,
        day: "Sunday",
        startTime: "08:00",
        endTime: "10:00"
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePrerequisitesChange = (event) => {
        const { target: { value } } = event;
        setFormData({
            ...formData,
            prerequisites: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const handleGroupChange = (e) => setGroupFormData({ ...groupFormData, [e.target.name]: e.target.value });

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        if (!formData._id || !formData.name) return;
        const success = await addCourse(formData);
        if (success) setFormData({ _id: "", name: "", hours: 3, prerequisites: [] });
    };

    const openGroupModal = (course) => {
        setSelectedCourse(course);
        setIsGroupModalOpen(true);
    };
    const closeGroupModal = () => {
        setIsGroupModalOpen(false);
        setSelectedCourse(null);
        setGroupFormData({ groupName: "", Room: "", type: "Lecture", capacity: 100, day: "Sunday", startTime: "08:00", endTime: "10:00" });
    };

    const handleSubmitGroup = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;

        const payload = {
            courseId: selectedCourse._id,
            groupName: groupFormData.groupName,
            Room: groupFormData.Room,
            type: groupFormData.type,
            capacity: Number(groupFormData.capacity),
            appointment: {
                day: groupFormData.day,
                startTime: groupFormData.startTime,
                endTime: groupFormData.endTime
            }
        };

        const success = await addGroup(payload);
        if (success) {
            setGroupFormData({ ...groupFormData, groupName: "", Room: "" });
            const updatedCourse = courses.find(c => c._id === selectedCourse._id);
            if (updatedCourse) setSelectedCourse(updatedCourse);
        }
    };
    const cardStyle = {
        bgcolor: theme.palette.background.paper,
        borderRadius: "16px",
        boxShadow: isDark 
            ? "0px 10px 40px rgba(0, 0, 0, 0.4)" 
            : "0px 10px 40px rgba(21, 43, 72, 0.08)",
        p: 4, 
        mb: 4, 
        width: "100%",
    };
    const textFieldStyle = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
            "&.Mui-focused": {
                backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
            },
            "& fieldset": { 
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
                borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0, 0, 0, 0.4)",
            },
        },
        "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
            WebkitBoxShadow: isDark 
                ? "0 0 0 1000px rgba(0, 0, 0, 0.25) inset !important" 
                : "0 0 0 1000px #f8fafc inset !important",
            WebkitTextFillColor: isDark ? "#f8fafc !important" : "#1b2559 !important",
            transition: "background-color 5000s ease-in-out 0s",
        },
        
        "& input::-webkit-calendar-picker-indicator": { 
            filter: isDark ? "invert(1)" : "none",
        }
    };
    const tableBorderColor = isDark ? "rgba(255,255,255,0.05)" : "#f4f7fe";

    const currentCourseData = courses?.find(c => c._id === selectedCourse?._id) || selectedCourse;

    return (
        <Box sx={{ width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column" }}>
   
            <Box sx={cardStyle}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <AddCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                        Add New Course
                    </Typography>
                </Box>

                <form onSubmit={handleSubmitCourse} style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <TextField 
                        label="Course ID *" 
                        name="_id" 
                        value={formData._id} 
                        onChange={handleChange} 
                        required 
                        variant="outlined" 
                        size="small" 
                        sx={{ ...textFieldStyle, flex: 1, minWidth: "120px" }} 
                    />
                    <TextField 
                        label="Course Name *" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        variant="outlined" 
                        size="small" 
                        sx={{ ...textFieldStyle, flex: 2, minWidth: "200px" }} 
                    />
                    <TextField 
                        label="Hours" 
                        name="hours" 
                        type="number" 
                        value={formData.hours} 
                        onChange={handleChange} 
                        required 
                        inputProps={{ min: 1, max: 6 }} 
                        variant="outlined" 
                        size="small" 
                        sx={{ ...textFieldStyle, width: "90px" }} 
                    />

                    <FormControl size="small" sx={{ ...textFieldStyle, flex: 2, minWidth: "220px" }}>
                        <InputLabel id="prerequisites-label">Prerequisites</InputLabel>
                        <Select
                            labelId="prerequisites-label"
                            id="prerequisites"
                            multiple
                            name="prerequisites"
                            value={formData.prerequisites}
                            onChange={handlePrerequisitesChange}
                            input={<OutlinedInput label="Prerequisites" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={{ 
                                PaperProps: { 
                                    sx: { 
                                        bgcolor: theme.palette.background.paper, 
                                        color: theme.palette.text.primary 
                                    } 
                                } 
                            }}
                        >
                            {courses?.filter(course => course._id !== formData._id.trim()).map((course) => (
                                <MenuItem key={course._id} value={course._id}>
                                    <Checkbox 
                                        checked={formData.prerequisites.indexOf(course._id) > -1} 
                                        sx={{ 
                                            color: theme.palette.text.secondary, 
                                            "&.Mui-checked": { color: theme.palette.primary.main } 
                                        }} 
                                    />
                                    <ListItemText primary={`${course.name} (${course._id})`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button 
                        type="submit" 
                        disabled={isLoading} 
                        variant="contained" 
                        sx={{ 
                            bgcolor: theme.palette.primary.main, 
                            color: theme.palette.primary.contrastText, 
                            fontWeight: "bold", 
                            borderRadius: "12px", 
                            textTransform: "none", 
                            boxShadow: isDark ? "0 4px 10px rgba(0,0,0,0.3)" : "none", 
                            height: "40px", 
                            px: 4, 
                            "&:hover": { bgcolor: theme.palette.primary.dark },
                            "&:disabled": { 
                                bgcolor: isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0", 
                                color: isDark ? "rgba(255,255,255,0.3)" : "#94a3b8" 
                            } 
                        }}
                    >
                        {isLoading ? "Adding..." : "ADD COURSE"}
                    </Button>
                </form>
            </Box>
            <Box sx={cardStyle}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <MenuBookIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                        All Courses List
                    </Typography>
                </Box>

                {isLoading && courses?.length === 0 ? (
                    <Typography sx={{ color: theme.palette.text.secondary, mt: 2 }}>Loading courses...</Typography>
                ) : (
                    <TableContainer sx={{ 
                        borderRadius: "12px", 
                        border: `1px solid ${tableBorderColor}` 
                    }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ 
                                    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "transparent" 
                                }}>
                                    {['Course Info', 'Course ID', 'Groups', 'Prerequisites', 'Actions'].map((header) => (
                                        <TableCell 
                                            key={header} 
                                            align={header === 'Course Info' ? "left" : "center"} 
                                            sx={{ 
                                                fontWeight: "bold", 
                                                color: theme.palette.text.secondary, 
                                                borderBottom: `1px solid ${tableBorderColor}` 
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courses?.map((course) => (
                                    <TableRow 
                                        key={course._id} 
                                        sx={{ 
                                            "&:last-child td, &:last-child th": { border: 0 }, 
                                            "&:hover": { 
                                                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#fafbfc" 
                                            } 
                                        }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ borderBottom: `1px solid ${tableBorderColor}` }}>
                                            <Typography sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                                                {course.name}
                                            </Typography>
                                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
                                                {course.hours || 3} Hours
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center" sx={{ borderBottom: `1px solid ${tableBorderColor}`, color: theme.palette.text.primary, fontWeight: "500" }}>
                                            {course._id}
                                        </TableCell>

                                        <TableCell align="center" sx={{ borderBottom: `1px solid ${tableBorderColor}` }}>
                                            <Typography sx={{ 
                                                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0", 
                                                color: theme.palette.text.secondary, 
                                                display: "inline-block", 
                                                px: 1.5, py: 0.5, 
                                                borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" 
                                            }}>
                                                {course.groups?.length || 0} Groups
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center" sx={{ borderBottom: `1px solid ${tableBorderColor}` }}>
                                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem", fontWeight: "500" }}>
                                                {course.prerequisites && course.prerequisites.length > 0 ? course.prerequisites.join(" , ") : "None"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center" sx={{ borderBottom: `1px solid ${tableBorderColor}` }}>
                                            <IconButton 
                                                onClick={() => openGroupModal(course)} 
                                                title="Manage Groups" 
                                                sx={{ 
                                                    color: theme.palette.primary.main, 
                                                    bgcolor: isDark ? "rgba(25,118,210,0.1)" : "#f4f7fe", 
                                                    mr: 1, 
                                                    "&:hover": { bgcolor: isDark ? "rgba(25,118,210,0.2)" : "#e2e8f0" } 
                                                }}
                                            >
                                                <GroupsIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                onClick={() => deleteCourse(course._id)} 
                                                title="Delete Course" 
                                                sx={{ 
                                                    color: theme.palette.error.main, 
                                                    bgcolor: isDark ? "rgba(211,47,47,0.1)" : "#fff0f0", 
                                                    "&:hover": { bgcolor: isDark ? "rgba(211,47,47,0.2)" : "#ffe4e4" } 
                                                }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <Dialog 
                open={isGroupModalOpen} 
                onClose={closeGroupModal} 
                maxWidth="md" 
                fullWidth 
                PaperProps={{ 
                    sx: { 
                        borderRadius: "16px", 
                        p: 1, 
                        bgcolor: theme.palette.background.paper, 
                        backgroundImage: "none" 
                    } 
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.text.primary, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Manage Groups for: {currentCourseData?.name} 
                    <Typography component="span" sx={{ color: theme.palette.text.secondary, ml: 1 }}>
                        ({currentCourseData?._id})
                    </Typography>
                </DialogTitle>
                
                <DialogContent dividers sx={{ borderColor: tableBorderColor }}>

                    <Box component="form" onSubmit={handleSubmitGroup} sx={{ 
                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "white", 
                        p: 3, 
                        borderRadius: "12px", 
                        border: `1px solid ${tableBorderColor}`, 
                        mb: 4 
                    }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: theme.palette.primary.main, mb: 2 }}>
                            + Create New Group
                        </Typography>
                        
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                            <TextField label="Group Name (e.g. G1)" name="groupName" value={groupFormData.groupName} onChange={handleGroupChange} required size="small" sx={{ ...textFieldStyle, flex: 1, minWidth: "120px" }} />
                            <TextField select label="Type" name="type" value={groupFormData.type} onChange={handleGroupChange} size="small" sx={{ ...textFieldStyle, flex: 1, minWidth: "120px" }} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: theme.palette.background.paper } } } }}>
                                <MenuItem value="Lecture">Lecture</MenuItem>
                                <MenuItem value="Lab">Lab</MenuItem>
                                <MenuItem value="Tutorial">Tutorial</MenuItem>
                            </TextField>
                            <TextField label="Room" name="Room" value={groupFormData.Room} onChange={handleGroupChange} required size="small" sx={{ ...textFieldStyle, flex: 1, minWidth: "120px" }} />
                            <TextField label="Capacity" name="capacity" type="number" value={groupFormData.capacity} onChange={handleGroupChange} required size="small" inputProps={{ min: 1 }} sx={{ ...textFieldStyle, width: "100px" }} />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                            <TextField select label="Day" name="day" value={groupFormData.day} onChange={handleGroupChange} size="small" sx={{ ...textFieldStyle, flex: 1, minWidth: "120px" }} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: theme.palette.background.paper } } } }}>
                                {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map(day => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </TextField>
                            <TextField label="Start Time" name="startTime" type="time" value={groupFormData.startTime} onChange={handleGroupChange} required size="small" InputLabelProps={{ shrink: true }} sx={{ ...textFieldStyle, flex: 1 }} />
                            <TextField label="End Time" name="endTime" type="time" value={groupFormData.endTime} onChange={handleGroupChange} required size="small" InputLabelProps={{ shrink: true }} sx={{ ...textFieldStyle, flex: 1 }} />

                            <Button type="submit" disabled={isLoading} variant="contained" sx={{ 
                                bgcolor: theme.palette.primary.main, 
                                color: theme.palette.primary.contrastText, 
                                fontWeight: "bold", 
                                height: "40px", 
                                px: 3, 
                                borderRadius: "8px",
                                textTransform: "none"
                            }}>
                                Add Group
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3, borderColor: tableBorderColor }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 2 }}>
                        Existing Groups
                    </Typography>
                    
                    {currentCourseData?.groups && currentCourseData.groups.length > 0 ? (
                        <TableContainer sx={{ 
                            bgcolor: isDark ? "transparent" : "white", 
                            borderRadius: "12px", 
                            border: `1px solid ${tableBorderColor}` 
                        }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f4f7fe" }}>
                                    <TableRow>
                                        {['Group', 'Type', 'Room', 'Schedule', 'Capacity', 'Action'].map((header) => (
                                            <TableCell 
                                                key={header} 
                                                align={header === 'Capacity' || header === 'Action' ? "center" : "left"}
                                                sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}
                                            >
                                                <strong>{header}</strong>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentCourseData.groups.map((grp, idx) => {
                                        
                                        const isLecture = grp.type === "Lecture";
                                        const isLab = grp.type === "Lab" || grp.type === "Lap";
                                        const badgeBg = isLecture 
                                            ? (isDark ? "rgba(25,118,210,0.15)" : "#e3f2fd") 
                                            : isLab 
                                                ? (isDark ? "rgba(46,125,50,0.15)" : "#e8f5e9") 
                                                : (isDark ? "rgba(237,108,2,0.15)" : "#fff3e0");
                                        
                                        const badgeColor = isLecture 
                                            ? (isDark ? "#90caf9" : "#1976d2") 
                                            : isLab 
                                                ? (isDark ? "#81c784" : "#2e7d32") 
                                                : (isDark ? "#ffb74d" : "#ed6c02");

                                        return (
                                        <TableRow key={idx} sx={{ "&:hover": { bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafbfc" } }}>
                                            <TableCell sx={{ fontWeight: "bold", color: theme.palette.text.primary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                                {grp.groupName}
                                            </TableCell>
                                            
                                            <TableCell sx={{ borderBottom: `1px solid ${tableBorderColor}` }}>
                                                <Typography sx={{
                                                    fontSize: "0.75rem",
                                                    bgcolor: badgeBg,
                                                    color: badgeColor,
                                                    display: "inline-block", px: 1, py: 0.5, borderRadius: "4px", fontWeight: "bold"
                                                }}>
                                                    {grp.type}
                                                </Typography>
                                            </TableCell>
                                            
                                            <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                                <LocationOnIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />{grp.Room}
                                            </TableCell>
                                            
                                            <TableCell sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                                <AccessTimeIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />
                                                {grp.appointment?.day} ({grp.appointment?.startTime} - {grp.appointment?.endTime})
                                            </TableCell>
                                            
                                            <TableCell align="center" sx={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${tableBorderColor}` }}>
                                                {grp.capacity} Students
                                            </TableCell>
                                            
                                            <TableCell align="center" sx={{ borderBottom: `1px solid ${tableBorderColor}` }}>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => deleteGroup(currentCourseData._id, grp.groupName, grp.type)} 
                                                    sx={{ 
                                                        color: theme.palette.error.main, 
                                                        bgcolor: isDark ? "rgba(211,47,47,0.1)" : "transparent", 
                                                        "&:hover": { bgcolor: isDark ? "rgba(211,47,47,0.2)" : "rgba(211,47,47,0.1)" } 
                                                    }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )})}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{ color: theme.palette.text.secondary, textAlign: "center", py: 2 }}>
                            No groups added for this course yet.
                        </Typography>
                    )}

                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${tableBorderColor}` }}>
                    <Button onClick={closeGroupModal} sx={{ color: theme.palette.text.secondary, fontWeight: "bold", textTransform: "none" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}