const Course = require('../models/Course');
const Group = require('../models/Group');

const addCourse = async (req, res) => {
    try {
        const { _id, name, hours, prerequisites } = req.body;
        const newCourse = new Course({ _id, name, hours, prerequisites });
        await newCourse.save();

        res.status(201).json({ message: 'The Course has been Successfully Added', course: newCourse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndDelete(id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        await Group.deleteMany({ _id: { $in: course.groups } });

        res.json({ message: 'The Course and its Group has been deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addGroup = async (req, res) => {
    try {
        const { courseId, groupName, Room, type, capacity, appointment } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const groupId = `${courseId}-${groupName}-${type}`;

        const existingGroup = await Group.findById(groupId);
        if (existingGroup) return res.status(400).json({ message: 'The Group has already been added' });

        const newGroup = new Group({
            _id: groupId,
            course: courseId,
            groupName,
            Room,
            type,
            capacity,
            appointment
        });
        await newGroup.save();

        course.groups.push(groupId);
        await course.save();

        res.status(201).json({ message: 'The Group was added and successfully linked to the Course', group: newGroup });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const group = await Group.findByIdAndDelete(id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        await Course.findByIdAndUpdate(group.course, {
            $pull: { groups: id }
        });

        res.json({ message: 'The Group has been deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('groups');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id).populate('groups');

        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addCourse,
    deleteCourse,
    addGroup,
    deleteGroup,
    getAllCourses,
    getCourseById
};

