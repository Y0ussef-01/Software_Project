// =========================================
// File: ./Front_End/src/hooks/Admin/ClassManagement/useScheduleImport.js
// NEW FILE
//
// Handles the whole "Import Course Schedules" flow:
//   select file -> parse JSON client-side -> build a preview matched
//   against the courses/groups already loaded by useClassManagement ->
//   confirm -> upload the ORIGINAL file to the backend (multipart,
//   matching the existing /admin/upload-students pattern) -> show the
//   backend's authoritative summary.
//
// The backend (POST /admin/import-course-schedules) is the source of
// truth for the actual create/update. The preview here is best-effort,
// client-side, so the Admin can catch obvious problems before sending.
// =========================================
import { useState, useMemo } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

// ---- accepted field-name variations (mirrors the backend service) ----
const FIELD_ALIASES = {
    courseId: ["courseid", "course_id"],
    courseCode: ["coursecode", "code", "course_code", "course code", "subjectcode"],
    courseName: ["coursename", "name", "course_name", "course name", "course", "subject"],
    groupName: ["group", "groupname", "group_name", "group name", "grp"],
    type: ["type", "grouptype", "group_type", "sessiontype", "session_type", "activity"],
    day: ["day", "weekday", "dayofweek", "day_of_week"],
    startTime: ["starttime", "start_time", "start", "from", "start time"],
    endTime: ["endtime", "end_time", "end", "to", "end time"],
    room: ["room", "hall", "location", "place", "roomname", "room_name"],
    capacity: ["capacity", "maxstudents", "max_students", "seats", "size", "maxcapacity"],
};

const GROUP_TYPES = ["Lecture", "Lab", "Tutorial"];
const TYPE_ALIASES = {
    lecture: "Lecture", lec: "Lecture", theory: "Lecture",
    lab: "Lab", labs: "Lab", practical: "Lab",
    tutorial: "Tutorial", tut: "Tutorial", section: "Tutorial", exercise: "Tutorial",
};

const DAY_NAMES = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// The database stores days lowercase (confirmed by useClassManagement's
// addGroup, which does `day: appointment.day.toLowerCase()`), so the
// preview matches against that same lowercase form.
const DAY_ALIASES = DAY_NAMES.reduce((acc, day) => {
    acc[day.toLowerCase()] = day.toLowerCase();
    acc[day.toLowerCase().slice(0, 3)] = day.toLowerCase();
    return acc;
}, {});

// The JSON is expected in 12-hour AM/PM form already — same as what the
// database stores (confirmed from the live `groups` collection). This is
// validation + light cleanup only, never a 12h<->24h conversion.
const TIME_AMPM_REGEX = /^(\d{1,2}):([0-5]\d)\s*([APap])\.?\s*[Mm]\.?$/;
const pad = (n) => String(n).padStart(2, "0");

const normalizeTime = (value) => {
    if (value === undefined || value === null) return { ok: false, reason: "Time is missing" };
    const raw = String(value).trim().replace(/\s+/g, " ");
    if (raw === "") return { ok: false, reason: "Time is empty" };

    const match = raw.match(TIME_AMPM_REGEX);
    if (!match) return { ok: false, reason: `Invalid time "${raw}" (expected 12-hour "hh:mm AM/PM")` };

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (hour < 1 || hour > 12) return { ok: false, reason: `Invalid hour in "${raw}"` };

    const hour24 = meridiem === "A" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
    return { ok: true, value: `${pad(hour)}:${pad(minute)} ${meridiem}M`, minutes: hour24 * 60 + minute };
};

const canonicalKey = (key) => String(key).toLowerCase().trim().replace(/[\s_-]+/g, "");

const pickField = (keyIndex, aliases) => {
    for (const alias of aliases) {
        const v = keyIndex[canonicalKey(alias)];
        if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
    }
    return null;
};

const normalizeRecord = (raw) => {
    const keyIndex = {};
    for (const key of Object.keys(raw)) keyIndex[canonicalKey(key)] = raw[key];

    const out = {};
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
        out[field] = pickField(keyIndex, aliases);
    }
    return out;
};

const normalizeType = (value) => {
    if (!value) return null;
    const key = String(value).toLowerCase().trim();
    const direct = GROUP_TYPES.find((t) => t.toLowerCase() === key);
    if (direct) return direct;
    return TYPE_ALIASES[key] || null;
};

const normalizeDay = (value) => {
    if (!value) return null;
    return DAY_ALIASES[String(value).toLowerCase().trim()] || null;
};

const normalizeCapacity = (value) => {
    if (value === null || value === undefined || String(value).trim() === "") return null;
    const n = Number(String(value).trim());
    if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
    return n;
};

// ---- course matching against the already-loaded `courses` list ----
const findCourse = (courses, record) => {
    const byId = (val) => courses.find((c) => c._id?.toLowerCase() === String(val).toLowerCase());

    if (record.courseId) {
        const c = byId(record.courseId);
        if (c) return c;
    }
    if (record.courseCode) {
        const c = byId(record.courseCode);
        if (c) return c;
    }
    if (record.courseName) {
        const c = courses.find(
            (c) => c.name?.toLowerCase().trim() === record.courseName.toLowerCase().trim()
        );
        if (c) return c;
    }
    return null;
};

const findGroup = (course, groupName, type) =>
    (course.groups || []).find(
        (g) => g.groupName === groupName && g.type === type
    );

/**
 * @param {object} raw one record from the parsed JSON
 * @param {Array} courses the courses (with populated .groups) from useClassManagement
 */
const buildPreviewRow = (raw, index, courses) => {
    const base = { row: index + 1, raw };

    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        return { ...base, status: "invalid", reason: "Record is not a JSON object" };
    }

    const normalized = normalizeRecord(raw);

    const hasCourseIdentifier = normalized.courseId || normalized.courseCode || normalized.courseName;
    if (!hasCourseIdentifier) {
        return { ...base, ...normalized, status: "invalid", reason: "Missing course identifier" };
    }
    if (!normalized.groupName) {
        return { ...base, ...normalized, status: "invalid", reason: "Missing group name" };
    }
    if (!normalized.room) {
        return { ...base, ...normalized, status: "invalid", reason: "Missing room" };
    }

    const type = normalizeType(normalized.type);
    if (!type) {
        return { ...base, ...normalized, status: "invalid", reason: `Invalid type "${normalized.type ?? ""}"` };
    }

    const day = normalizeDay(normalized.day);
    if (!day) {
        return { ...base, ...normalized, status: "invalid", reason: `Invalid day "${normalized.day ?? ""}"` };
    }

    const start = normalizeTime(normalized.startTime);
    if (!start.ok) {
        return { ...base, ...normalized, status: "invalid", reason: start.reason };
    }
    const end = normalizeTime(normalized.endTime);
    if (!end.ok) {
        return { ...base, ...normalized, status: "invalid", reason: end.reason };
    }
    if (start.minutes >= end.minutes) {
        return { ...base, ...normalized, status: "invalid", reason: "Start time must be before end time" };
    }

    const capacity = normalizeCapacity(normalized.capacity);
    if (capacity === null) {
        return { ...base, ...normalized, status: "invalid", reason: `Invalid capacity "${normalized.capacity ?? ""}"` };
    }

    const course = findCourse(courses, normalized);
    if (!course) {
        return {
            ...base, ...normalized, type, day,
            startTime: start.value, endTime: end.value, capacity,
            status: "not_found", reason: "Course not found",
        };
    }

    const existingGroup = findGroup(course, normalized.groupName, type);

    return {
        ...base,
        courseId: course._id,
        courseName: course.name,
        groupName: normalized.groupName,
        type, day, startTime: start.value, endTime: end.value,
        Room: normalized.room,
        capacity,
        status: existingGroup ? "exists" : "created",
        reason: null,
    };
};

export default function useScheduleImport(courses) {
    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]); // preview rows, empty until "Preview" is clicked
    const [previewing, setPreviewing] = useState(false);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null); // backend summary after import
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        const looksLikeJson =
            selected.name.toLowerCase().endsWith(".json") ||
            ["application/json", "text/json"].includes(selected.type);

        if (!looksLikeJson) {
            toast.error("Please upload a valid JSON file (.json)");
            return;
        }

        setFile(selected);
        setRows([]);
        setResult(null);
    };

    const handleReset = () => {
        setFile(null);
        setRows([]);
        setResult(null);
    };

    const readFileAsJson = (targetFile) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const text = String(reader.result || "").replace(/^\uFEFF/, "").trim();
                    if (!text) return reject(new Error("The file is empty"));
                    const parsed = JSON.parse(text);
                    resolve(parsed);
                } catch (err) {
                    reject(new Error(`Invalid JSON file: ${err.message}`));
                }
            };
            reader.onerror = () => reject(new Error("Could not read the file"));
            reader.readAsText(targetFile);
        });

    const handlePreview = async () => {
        if (!file) {
            toast.warning("Please select a JSON file first.");
            return;
        }
        setPreviewing(true);
        setResult(null);
        try {
            const parsed = await readFileAsJson(file);

            let records = parsed;
            if (!Array.isArray(records)) {
                const wrapperKey = ["records", "data", "schedules", "rows", "items"].find(
                    (k) => Array.isArray(parsed?.[k])
                );
                records = wrapperKey ? parsed[wrapperKey] : null;
            }

            if (!Array.isArray(records)) {
                toast.error("The JSON file must contain an array of schedule records");
                setRows([]);
                return;
            }
            if (records.length === 0) {
                toast.error("The JSON file contains no records");
                setRows([]);
                return;
            }

            const seen = new Map();
            const built = records.map((raw, i) => {
                const previewRow = buildPreviewRow(raw, i, courses);

                if (previewRow.status === "created" || previewRow.status === "exists") {
                    const key = `${previewRow.courseId}||${previewRow.groupName}||${previewRow.type}`.toLowerCase();
                    if (seen.has(key)) {
                        return { ...previewRow, status: "duplicate", reason: `Duplicate of row ${seen.get(key)}` };
                    }
                    seen.set(key, previewRow.row);
                }
                return previewRow;
            });

            setRows(built);
        } catch (err) {
            toast.error(err.message || "Failed to parse the JSON file");
            setRows([]);
        } finally {
            setPreviewing(false);
        }
    };

    const summary = useMemo(() => {
        const s = { total: rows.length, willCreate: 0, willUpdate: 0, duplicates: 0, invalid: 0, notFound: 0 };
        for (const r of rows) {
            if (r.status === "created") s.willCreate++;
            else if (r.status === "exists") s.willUpdate++;
            else if (r.status === "duplicate") s.duplicates++;
            else if (r.status === "not_found") s.notFound++;
            else if (r.status === "invalid") s.invalid++;
        }
        return s;
    }, [rows]);

    const openConfirm = () => {
        if (!file) {
            toast.warning("Please select a JSON file first.");
            return;
        }
        if (rows.length === 0) {
            toast.warning("Please preview the file before importing.");
            return;
        }
        setConfirmOpen(true);
    };
    const closeConfirm = () => setConfirmOpen(false);

    const handleImport = async () => {
        if (!file) return;
        setConfirmOpen(false);
        setImporting(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post(
                "/admin/import-course-schedules",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setResult(response.data);
            toast.success(response.data?.message || "Course schedules imported successfully");
            setFile(null);
            setRows([]);
        } catch (error) {
            toast.error(error.response?.data?.message || "Import failed. Please try again.");
        } finally {
            setImporting(false);
        }
    };

    return {
        file,
        rows,
        summary,
        previewing,
        importing,
        result,
        confirmOpen,
        handleFileChange,
        handleReset,
        handlePreview,
        openConfirm,
        closeConfirm,
        handleImport,
    };
}