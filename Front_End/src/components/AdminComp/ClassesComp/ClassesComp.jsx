import React, { useState } from "react";
import {
    Box, Typography, TextField, Button, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider,
    FormControl, InputLabel, Select, Checkbox, ListItemText, OutlinedInput
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
        capacity: 50,
        day: "Sunday",
        startTime: "08:00",
        endTime: "10:00"
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePrerequisitesChange = (event) => {
        const {
            target: { value },
        } = event;
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
        setGroupFormData({ groupName: "", Room: "", type: "Lecture", capacity: 50, day: "Sunday", startTime: "08:00", endTime: "10:00" });
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
        bgcolor: "white", borderRadius: "16px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)", p: 4, mb: 4, width: "100%",
    };

    const currentCourseData = courses?.find(c => c._id === selectedCourse?._id) || selectedCourse;

    return (
        <Box sx={{ width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column" }}>
            <Box sx={cardStyle}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <AddCircleOutlineIcon sx={{ color: "#1b2559", mr: 1, fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1b2559" }}>Add New Course</Typography>
                </Box>

                <form onSubmit={handleSubmitCourse} style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <TextField label="Course ID *" name="_id" value={formData._id} onChange={handleChange} required variant="outlined" size="small" sx={{ flex: 1, minWidth: "120px" }} />
                    <TextField label="Course Name *" name="name" value={formData.name} onChange={handleChange} required variant="outlined" size="small" sx={{ flex: 2, minWidth: "200px" }} />
                    <TextField label="Hours" name="hours" type="number" value={formData.hours} onChange={handleChange} required inputProps={{ min: 1, max: 6 }} variant="outlined" size="small" sx={{ width: "90px" }} />

                    <FormControl size="small" sx={{ flex: 2, minWidth: "220px" }}>
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
                        >
                            {courses?.filter(course => course._id !== formData._id.trim()).map((course) => (
                                <MenuItem key={course._id} value={course._id}>
                                    <Checkbox checked={formData.prerequisites.indexOf(course._id) > -1} />
                                    <ListItemText primary={`${course.name} (${course._id})`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" disabled={isLoading} variant="contained" sx={{ bgcolor: "#e2e8f0", color: "#4a5568", fontWeight: "bold", borderRadius: "8px", textTransform: "none", boxShadow: "none", height: "40px", px: 4, "&:hover": { bgcolor: "#cbd5e1", boxShadow: "none" } }}>
                        {isLoading ? "Adding..." : "ADD COURSE"}
                    </Button>
                </form>
            </Box>
            <Box sx={cardStyle}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <MenuBookIcon sx={{ color: "#1b2559", mr: 1, fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1b2559" }}>All Courses List</Typography>
                </Box>

                {isLoading && courses?.length === 0 ? (
                    <Typography sx={{ color: "text.secondary", mt: 2 }}>Loading courses...</Typography>
                ) : (
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "#a3aed0", borderBottom: "1px solid #e2e8f0" }}>Course Info</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#a3aed0", borderBottom: "1px solid #e2e8f0" }}>Course ID</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#a3aed0", borderBottom: "1px solid #e2e8f0" }}>Groups</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#a3aed0", borderBottom: "1px solid #e2e8f0" }}>Prerequisites</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#a3aed0", borderBottom: "1px solid #e2e8f0" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courses?.map((course) => (
                                    <TableRow key={course._id} sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { bgcolor: "#fafbfc" } }}>
                                        <TableCell component="th" scope="row" sx={{ borderBottom: "1px solid #f4f7fe" }}>
                                            <Typography sx={{ fontWeight: "bold", color: "#1b2559" }}>{course.name}</Typography>
                                            <Typography sx={{ color: "#a3aed0", fontSize: "0.8rem" }}>{course.hours || 3} Hours</Typography>
                                        </TableCell>

                                        <TableCell align="center" sx={{ borderBottom: "1px solid #f4f7fe", color: "#2b3674", fontWeight: "500" }}>{course._id}</TableCell>

                                        <TableCell align="center" sx={{ borderBottom: "1px solid #f4f7fe" }}>
                                            <Typography sx={{ bgcolor: "#e2e8f0", color: "#4a5568", display: "inline-block", px: 1.5, py: 0.5, borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>
                                                {course.groups?.length || 0} Groups
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center" sx={{ borderBottom: "1px solid #f4f7fe" }}>
                                            <Typography sx={{ color: "#707EAE", fontSize: "0.85rem", fontWeight: "500" }}>
                                                {course.prerequisites && course.prerequisites.length > 0 ? course.prerequisites.join(" , ") : "None"}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center" sx={{ borderBottom: "1px solid #f4f7fe" }}>
                                            <IconButton onClick={() => openGroupModal(course)} title="Manage Groups" sx={{ color: "#4318FF", bgcolor: "#f4f7fe", mr: 1, "&:hover": { bgcolor: "#e2e8f0" } }}>
                                                <GroupsIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => deleteCourse(course._id)} title="Delete Course" sx={{ color: "#ee5d50", bgcolor: "#fff0f0", "&:hover": { bgcolor: "#ffe4e4" } }}>
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

            <Dialog open={isGroupModalOpen} onClose={closeGroupModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
                <DialogTitle sx={{ fontWeight: "bold", color: "#1b2559", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Manage Groups for: {currentCourseData?.name} ({currentCourseData?._id})
                </DialogTitle>
                <DialogContent dividers sx={{ bgcolor: "#fafbfc" }}>

                    <Box component="form" onSubmit={handleSubmitGroup} sx={{ bgcolor: "white", p: 3, borderRadius: "12px", boxShadow: "0px 2px 10px rgba(0,0,0,0.02)", mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#4318FF", mb: 2 }}>+ Create New Group</Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                            <TextField label="Group Name (e.g. G1)" name="groupName" value={groupFormData.groupName} onChange={handleGroupChange} required size="small" sx={{ flex: 1, minWidth: "120px" }} />
                            <TextField select label="Type" name="type" value={groupFormData.type} onChange={handleGroupChange} size="small" sx={{ flex: 1, minWidth: "120px" }}>
                                <MenuItem value="Lecture">Lecture</MenuItem>
                                <MenuItem value="Lab">Lab</MenuItem>
                                <MenuItem value="Tutorial">Tutorial</MenuItem>
                            </TextField>
                            <TextField label="Room / Hall" name="Room" value={groupFormData.Room} onChange={handleGroupChange} required size="small" sx={{ flex: 1, minWidth: "120px" }} />
                            <TextField label="Capacity" name="capacity" type="number" value={groupFormData.capacity} onChange={handleGroupChange} required size="small" inputProps={{ min: 1 }} sx={{ width: "100px" }} />
                        </Box>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                            <TextField select label="Day" name="day" value={groupFormData.day} onChange={handleGroupChange} size="small" sx={{ flex: 1, minWidth: "120px" }}>
                                <MenuItem value="Saturday">Saturday</MenuItem>
                                <MenuItem value="Sunday">Sunday</MenuItem>
                                <MenuItem value="Monday">Monday</MenuItem>
                                <MenuItem value="Tuesday">Tuesday</MenuItem>
                                <MenuItem value="Wednesday">Wednesday</MenuItem>
                                <MenuItem value="Thursday">Thursday</MenuItem>
                            </TextField>
                            <TextField label="Start Time" name="startTime" type="time" value={groupFormData.startTime} onChange={handleGroupChange} required size="small" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
                            <TextField label="End Time" name="endTime" type="time" value={groupFormData.endTime} onChange={handleGroupChange} required size="small" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />

                            <Button type="submit" disabled={isLoading} variant="contained" sx={{ bgcolor: "#4318FF", color: "white", fontWeight: "bold", height: "40px", px: 3, borderRadius: "8px" }}>
                                Add Group
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#1b2559", mb: 2 }}>Existing Groups</Typography>
                    {currentCourseData?.groups && currentCourseData.groups.length > 0 ? (
                        <TableContainer sx={{ bgcolor: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: "#f4f7fe" }}>
                                    <TableRow>
                                        <TableCell><strong>Group</strong></TableCell>
                                        <TableCell><strong>Type</strong></TableCell>
                                        <TableCell><strong>Room</strong></TableCell>
                                        <TableCell><strong>Schedule</strong></TableCell>
                                        <TableCell align="center"><strong>Capacity</strong></TableCell>
                                        <TableCell align="center"><strong>Action</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentCourseData.groups.map((grp, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell sx={{ fontWeight: "bold", color: "#2b3674" }}>{grp.groupName}</TableCell>
                                            <TableCell>
                                                <Typography sx={{
                                                    fontSize: "0.75rem",
                                                    bgcolor: grp.type === "Lecture" ? "#e3f2fd" : grp.type === "Lap" ? "#e8f5e9" : "#fff3e0",
                                                    color: grp.type === "Lecture" ? "#1976d2" : grp.type === "Lap" ? "#2e7d32" : "#ed6c02",
                                                    display: "inline-block", px: 1, py: 0.5, borderRadius: "4px", fontWeight: "bold"
                                                }}>
                                                    {grp.type}
                                                </Typography>
                                            </TableCell>
                                            <TableCell><LocationOnIcon sx={{ fontSize: 14, color: "#a3aed0", verticalAlign: "middle", mr: 0.5 }} />{grp.Room}</TableCell>
                                            <TableCell><AccessTimeIcon sx={{ fontSize: 14, color: "#a3aed0", verticalAlign: "middle", mr: 0.5 }} />{grp.appointment?.day} ({grp.appointment?.startTime} - {grp.appointment?.endTime})</TableCell>
                                            <TableCell align="center">{grp.capacity} Students</TableCell>
                                            <TableCell align="center">
                                                <IconButton size="small" onClick={() => deleteGroup(currentCourseData._id, grp.groupName, grp.type)} sx={{ color: "#ee5d50" }}>
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>No groups added for this course yet.</Typography>
                    )}

                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeGroupModal} sx={{ color: "#707EAE", fontWeight: "bold" }}>Close</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}