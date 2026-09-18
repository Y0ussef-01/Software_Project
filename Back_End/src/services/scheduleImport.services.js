const Course = require('../models/Course');
const Group = require('../models/Group');
const { normalizeTime } = require('../utils/timeConverter');
const { isTimeConflict } = require('../utils/Test_Conflict');

const GROUP_TYPES = Group.schema.path('type').enumValues; // ['Lecture','Lab','Tutorial']

const TYPE_ALIASES = {
    lecture: 'Lecture',
    lec: 'Lecture',
    theory: 'Lecture',
    lab: 'Lab',
    labs: 'Lab',
    practical: 'Lab',
    tutorial: 'Tutorial',
    tut: 'Tutorial',
    section: 'Tutorial',
    exercise: 'Tutorial'
};

const DAY_CASE = 'lower';

const DAY_NAMES = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DAYS = DAY_NAMES.map((d) => (DAY_CASE === 'lower' ? d.toLowerCase() : d));

const DAY_ALIASES = DAY_NAMES.reduce((acc, day) => {
    const stored = DAY_CASE === 'lower' ? day.toLowerCase() : day;
    acc[day.toLowerCase()] = stored;
    acc[day.toLowerCase().slice(0, 3)] = stored; // sat, sun, mon...
    return acc;
}, {});

const REJECT_CAPACITY_BELOW_ENROLLED = true;

const CHECK_TIME_CONFLICTS = true;

const MAX_RECORDS = 10000;

const FIELD_ALIASES = {
    courseId: ['courseid', 'course_id'],
    courseCode: ['coursecode', 'code', 'course_code', 'course code', 'subjectcode'],
    courseName: ['coursename', 'name', 'course_name', 'course name', 'course', 'subject'],
    groupName: ['group', 'groupname', 'group_name', 'group name', 'grp'],
    type: ['type', 'grouptype', 'group_type', 'sessiontype', 'session_type', 'activity'],
    day: ['day', 'weekday', 'dayofweek', 'day_of_week'],
    startTime: ['starttime', 'start_time', 'start', 'from', 'start time'],
    endTime: ['endtime', 'end_time', 'end', 'to', 'end time'],
    room: ['room', 'hall', 'location', 'place', 'roomname', 'room_name'],
    capacity: ['capacity', 'maxstudents', 'max_students', 'seats', 'size', 'maxcapacity']
};

const canonicalKey = (key) => String(key).toLowerCase().trim().replace(/[\s_-]+/g, '');

const indexRecordKeys = (record) => {
    const index = {};
    for (const key of Object.keys(record)) {
        index[canonicalKey(key)] = record[key];
    }
    return index;
};

const pickField = (keyIndex, aliases) => {
    for (const alias of aliases) {
        const value = keyIndex[canonicalKey(alias)];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return String(value).trim();
        }
    }
    return null;
};

const normalizeRecord = (record) => {
    const keyIndex = indexRecordKeys(record);
    const normalized = {};
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
        normalized[field] = pickField(keyIndex, aliases);
    }
    return normalized;
};

const normalizeType = (value) => {
    if (!value) return null;
    const key = String(value).toLowerCase().trim();

    const direct = GROUP_TYPES.find((t) => t.toLowerCase() === key);
    if (direct) return direct;

    const aliased = TYPE_ALIASES[key];
    if (aliased && GROUP_TYPES.includes(aliased)) return aliased;

    return null;
};

const normalizeDay = (value) => {
    if (!value) return null;
    return DAY_ALIASES[String(value).toLowerCase().trim()] || null;
};

const normalizeCapacity = (value) => {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const number = Number(String(value).trim());
    if (!Number.isFinite(number) || !Number.isInteger(number) || number <= 0) return null;
    return number;
};

const WRAPPER_KEYS = ['records', 'data', 'schedules', 'rows', 'items', 'result'];

const extractRecords = (parsed) => {
    if (Array.isArray(parsed)) {
        return { ok: true, records: parsed };
    }

    if (parsed && typeof parsed === 'object') {
        for (const key of WRAPPER_KEYS) {
            if (Array.isArray(parsed[key])) {
                return { ok: true, records: parsed[key] };
            }
        }
    }

    return {
        ok: false,
        reason: 'JSON root must be an array of schedule records (or an object with a "records"/"data" array)'
    };
};

const validateRecord = (normalized) => {
    const hasCourseIdentifier =
        normalized.courseId || normalized.courseCode || normalized.courseName;

    if (!hasCourseIdentifier) {
        return { ok: false, reason: 'Missing course identifier (courseId / courseCode / courseName)' };
    }
    if (!normalized.groupName) {
        return { ok: false, reason: 'Missing group name' };
    }
    if (!normalized.room) {
        return { ok: false, reason: 'Missing room' };
    }

    const type = normalizeType(normalized.type);
    if (!type) {
        return {
            ok: false,
            reason: `Invalid type "${normalized.type ?? ''}" (allowed: ${GROUP_TYPES.join(', ')})`
        };
    }

    const day = normalizeDay(normalized.day);
    if (!day) {
        return { ok: false, reason: `Invalid day "${normalized.day ?? ''}" (allowed: ${DAYS.join(', ')})` };
    }

    const start = normalizeTime(normalized.startTime);
    if (!start.ok) {
        return { ok: false, reason: `Invalid start time: ${start.reason}` };
    }

    const end = normalizeTime(normalized.endTime);
    if (!end.ok) {
        return { ok: false, reason: `Invalid end time: ${end.reason}` };
    }

    if (start.minutes >= end.minutes) {
        return {
            ok: false,
            reason: `Start time (${start.value}) must be before end time (${end.value})`
        };
    }

    const capacity = normalizeCapacity(normalized.capacity);
    if (capacity === null) {
        return {
            ok: false,
            reason: `Invalid capacity "${normalized.capacity ?? ''}" (must be a positive whole number)`
        };
    }

    return {
        ok: true,
        value: {
            courseId: normalized.courseId,
            courseCode: normalized.courseCode,
            courseName: normalized.courseName,
            groupName: normalized.groupName,
            Room: normalized.room,
            type,
            capacity,
            appointment: { day, startTime: start.value, endTime: end.value }
        }
    };
};


const findCourse = async (record, cache) => {
    const candidates = [];
    if (record.courseId) candidates.push({ by: 'id', value: record.courseId });
    if (record.courseCode) candidates.push({ by: 'code', value: record.courseCode });
    if (record.courseName) candidates.push({ by: 'name', value: record.courseName });

    for (const candidate of candidates) {
        const cacheKey = `${candidate.by}:${candidate.value.toLowerCase()}`;

        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            if (cached) return cached;
            continue;
        }

        let course = null;
        if (candidate.by === 'id' || candidate.by === 'code') {
            course = await Course.findById(candidate.value);
            if (!course) {
                // stored ids are not consistently cased (e.g. "Cs401" vs "CS401")
                course = await Course.findOne({
                    _id: { $regex: `^${escapeRegex(candidate.value)}$`, $options: 'i' }
                });
            }
        } else {
            // exact name, case-insensitive
            course = await Course.findOne({
                name: { $regex: `^${escapeRegex(candidate.value)}$`, $options: 'i' }
            });
        }

        cache.set(cacheKey, course);
        if (course) return course;
    }

    return null;
};

const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildGroupId = (courseId, groupName, type) => `${courseId}-${groupName}-${type}`;

const buildDedupeKey = (courseId, groupName, type) =>
    `${courseId}||${groupName.toLowerCase()}||${type}`;

const findExistingGroup = async (courseId, groupName, type) => {
    const groupId = buildGroupId(courseId, groupName, type);
    return Group.findOne({
        $or: [{ _id: groupId }, { course: courseId, groupName, type }]
    });
};

const importCourseSchedules = async (rawRecords) => {
    const results = [];
    const plan = [];
    const courseCache = new Map();
    const seenGroups = new Map();

    let duplicates = 0;
    let failed = 0;

    // ---- PHASE 1: normalize, validate and resolve everything (no writes) ----
    for (let i = 0; i < rawRecords.length; i++) {
        const raw = rawRecords[i];
        const rowNumber = i + 1;

        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
            failed++;
            results.push({ row: rowNumber, status: 'failed', reason: 'Record is not a JSON object' });
            continue;
        }

        const normalized = normalizeRecord(raw);
        const validation = validateRecord(normalized);

        if (!validation.ok) {
            failed++;
            results.push({
                row: rowNumber,
                courseCode: normalized.courseCode || normalized.courseId || null,
                courseName: normalized.courseName || null,
                groupName: normalized.groupName || null,
                status: 'failed',
                reason: validation.reason
            });
            continue;
        }

        const record = validation.value;

        let course;
        try {
            course = await findCourse(record, courseCache);
        } catch (err) {
            failed++;
            results.push({
                row: rowNumber,
                courseCode: record.courseCode,
                courseName: record.courseName,
                groupName: record.groupName,
                status: 'failed',
                reason: `Database error while matching course: ${err.message}`
            });
            continue;
        }

        if (!course) {
            failed++;
            results.push({
                row: rowNumber,
                courseCode: record.courseCode || record.courseId || null,
                courseName: record.courseName || null,
                groupName: record.groupName,
                status: 'failed',
                reason: 'Course not found'
            });
            continue;
        }

        const dedupeKey = buildDedupeKey(course._id, record.groupName, record.type);

        if (seenGroups.has(dedupeKey)) {
            const first = seenGroups.get(dedupeKey);
            const identical =
                first.Room === record.Room &&
                first.capacity === record.capacity &&
                first.appointment.day === record.appointment.day &&
                first.appointment.startTime === record.appointment.startTime &&
                first.appointment.endTime === record.appointment.endTime;

            duplicates++;
            results.push({
                row: rowNumber,
                courseCode: course._id,
                courseName: course.name,
                groupName: record.groupName,
                type: record.type,
                status: 'duplicate',
                reason: identical
                    ? `Duplicate of row ${first.row} — skipped`
                    : `Conflicting duplicate of row ${first.row} (different room/time/capacity) — first occurrence kept`
            });
            continue;
        }

        const planned = { ...record, row: rowNumber, course };
        seenGroups.set(dedupeKey, planned);
        plan.push(planned);
    }

    let groupsCreated = 0;
    let groupsUpdated = 0;
    const matchedCourseIds = new Set();

    for (const item of plan) {
        const { course, row } = item;
        const base = {
            row,
            courseCode: course._id,
            courseName: course.name,
            groupName: item.groupName,
            type: item.type
        };

        try {
            const existing = await findExistingGroup(course._id, item.groupName, item.type);

            if (CHECK_TIME_CONFLICTS) {
                const siblingFilter = {
                    course: course._id,
                    groupName: item.groupName,
                    _id: { $ne: existing ? existing._id : buildGroupId(course._id, item.groupName, item.type) }
                };
                const siblings = await Group.find(siblingFilter);
                const clash = siblings.find((g) => isTimeConflict(item.appointment, g.appointment));

                if (clash) {
                    failed++;
                    results.push({
                        ...base,
                        status: 'failed',
                        reason: `Time conflict: overlaps the existing ${clash.type} of group ${clash.groupName} on ${item.appointment.day}`
                    });
                    continue;
                }
            }

            if (existing) {
                if (
                    REJECT_CAPACITY_BELOW_ENROLLED &&
                    item.capacity < (existing.enrolledStudents ? existing.enrolledStudents.length : 0)
                ) {
                    failed++;
                    results.push({
                        ...base,
                        status: 'failed',
                        reason: `Capacity ${item.capacity} is lower than the ${existing.enrolledStudents.length} students already enrolled`
                    });
                    continue;
                }

                // Only schedule-related fields. _id, course and enrolledStudents are untouched.
                existing.Room = item.Room;
                existing.type = item.type;
                existing.capacity = item.capacity;
                existing.appointment.day = item.appointment.day;
                existing.appointment.startTime = item.appointment.startTime;
                existing.appointment.endTime = item.appointment.endTime;

                await existing.save();

                groupsUpdated++;
                matchedCourseIds.add(course._id);
                results.push({ ...base, groupId: existing._id, status: 'updated' });
                continue;
            }

            const groupId = buildGroupId(course._id, item.groupName, item.type);
            const newGroup = new Group({
                _id: groupId,
                course: course._id,
                groupName: item.groupName,
                Room: item.Room,
                type: item.type,
                capacity: item.capacity,
                appointment: item.appointment,
                enrolledStudents: []
            });

            await newGroup.save();

            // keep Course.groups in sync, the same way addGroup does
            await Course.updateOne({ _id: course._id }, { $addToSet: { groups: groupId } });

            groupsCreated++;
            matchedCourseIds.add(course._id);
            results.push({ ...base, groupId, status: 'created' });
        } catch (err) {
            failed++;
            results.push({ ...base, status: 'failed', reason: `Database error: ${err.message}` });
        }
    }

    const summary = {
        totalRecords: rawRecords.length,
        processed: groupsCreated + groupsUpdated,
        coursesMatched: matchedCourseIds.size,
        groupsCreated,
        groupsUpdated,
        duplicates,
        failed
    };

    return { summary, results };
};

module.exports = {
    importCourseSchedules,
    extractRecords,
    normalizeRecord,
    validateRecord,
    MAX_RECORDS,
    GROUP_TYPES,
    DAYS
};