require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./src/models/Student');
const Teacher = require('./src/models/Teacher');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('⏳ متصل بقاعدة البيانات.. جاري مسح بيانات الطلاب والمدرسين القديمة...');

        // 2. مسح الداتا القديمة عشان ميحصلش تعارض في الـ IDs أو الـ Emails
        await Student.deleteMany();
        await Teacher.deleteMany();

        console.log('⏳ جاري إضافة المدرسين والطلاب الجداد...');

        const hashedPassword = await bcrypt.hash('123456', 10);

        const teachersData = [
            {
                _id: 'T-1',
                name: 'Hassan Ayad',
                email: 'Hassan@cu.edu.eg',
                password: hashedPassword,
                department: 'Computer Science',
                profileImg: 'default-teacher.jpg'
            },
            {
                _id: 'T-2',
                name: 'Hattem Moharram',
                email: 'Hatem@cu.edu.eg',
                password: hashedPassword,
                department: 'Computer Science',
                profileImg: 'default-teacher.jpg'
            },
            {
                _id: 'T-3',
                name: 'Reem Ahmed',
                email: 'Reem@cu.edu.eg',
                password: hashedPassword,
                department: 'Computer Science',
                profileImg: 'default-teacher.jpg'
            },
            {
                _id: 'T-4',
                name: 'Nasser Sweilam',
                email: 'Nasser@cu.edu.eg',
                password: hashedPassword,
                department: 'Computer Science',
                profileImg: 'default-teacher.jpg'
            }
        ];

        const studentsData = [
            {
                _id: '2327443',
                name: 'Youssef Ashraf Mahmoud',
                email: '202327443@std.sci.cu.edu.eg',
                password: hashedPassword,
                profileImg: 'default-student.jpg',
                department: 'Computer Science',
                grade: 'المستوي الثالث'
            },
            {
                _id: '2327315',
                name: 'Abdelrahman Mohamed Ebrahim',
                email: '202327315@std.sci.cu.edu.eg',
                password: hashedPassword,
                profileImg: 'default-student.jpg',
                department: 'Computer Science',
                grade: 'المستوي الثالث'
            },
            {
                _id: '2327271',
                name: 'Abdelrahman Mohamed Eliwa',
                email: '202327271@std.sci.cu.edu.eg',
                password: hashedPassword,
                profileImg: 'default-student.jpg',
                department: 'Computer Science',
                grade: 'المستوي الثالث'
            },
            {
                _id: '2327473',
                name: 'Mahmoud Mosad Kamel',
                email: '202327473@std.sci.cu.edu.eg',
                password: hashedPassword,
                profileImg: 'default-student.jpg',
                department: 'Computer Science',
                grade: 'المستوي الثالث'
            },
            {
                _id: '2327058',
                name: 'Youssef Ahmed Hassan',
                email: '202327058@std.sci.cu.edu.eg',
                password: hashedPassword,
                profileImg: 'default-student.jpg',
                department: 'Computer Science',
                grade: 'المستوي الثالث'
            },
            {
                _id: '2227375',
                name: 'Ahmed Hesham Mohamed',
                email: '202227375@std.sci.cu.edu.eg',
                password: hashedPassword,
                profileImg: 'default-student.jpg',
                department: 'Computer Science',
                grade: 'المستوي الثالث'
            }
        ];

        await Teacher.insertMany(teachersData);
        await Student.insertMany(studentsData);

        console.log('✅ تم تسجيل الطلاب والمدرسين بنجاح!');
        process.exit();

    } catch (error) {
        console.error('❌ حصلت مشكلة وإحنا بنسجل البيانات:', error);
        process.exit(1);
    }
};

seedDatabase();