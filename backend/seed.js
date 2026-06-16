const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

console.log('Attempting to seed admin...');
console.log('URI:', process.env.MONGODB_URI ? 'Exists' : 'MISSING');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing from .env');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@medibook.com';
    const adminPassword = 'admin123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin already exists. Updating...');
      admin.password = adminPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Admin updated successfully');
    } else {
      console.log('Creating new admin...');
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin created successfully');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('SEED ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
