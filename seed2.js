require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./src/models/Student');
const Teacher = require('./src/models/Teacher');
const Admin = require('./src/models/Admin');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('⏳ جاري تهيئة قاعدة البيانات...');

        await Admin.deleteMany();

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminData = [
            {
                _id: 'admin01',
                name: 'Youssef Admin',
                email: 'admin@sci.cu.edu.eg',
                password: hashedPassword
            }
        ];


        await Admin.insertMany(adminData);
        console.log('✅ تم إضافة أول أدمن (ID: admin01) والطلاب والمدرسين بنجاح!');
        process.exit();

    } catch (error) {
        console.error('❌ إيرور في الـ Seed:', error);
        process.exit(1);
    }
};

seedDatabase();