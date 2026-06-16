const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const ActivityLog = require('./models/ActivityLog');

dotenv.config();

const SPECIALIZATIONS = [
  "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics",
  "Psychiatry", "Oncology", "Ophthalmology", "Gynecology", "General Medicine",
];

const DOCTOR_NAMES = [
  "Dr. Sarah Mitchell", "Dr. James Rodriguez", "Dr. Priya Sharma",
  "Dr. Michael Chen", "Dr. Emily Watson", "Dr. David Kim",
  "Dr. Lisa Anderson", "Dr. Robert Taylor", "Dr. Aisha Patel",
  "Dr. Thomas Brown", "Dr. Maria Garcia", "Dr. Kevin Lee",
];

const LOCATIONS = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
  "Phoenix, AZ", "San Francisco, CA", "Boston, MA", "Seattle, WA",
];

const SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];

const initials = (name) => name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("");

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');


    // Clear existing data
    await User.deleteMany({ role: 'doctor' });
    await User.deleteMany({ email: 'admin@medibook.com' });
    await ActivityLog.deleteMany({});

    console.log('Cleared existing doctors, admin, and logs...');

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@medibook.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'AU',
    });

    // Create Doctors
    const doctors = DOCTOR_NAMES.map((name, i) => ({
      name,
      email: `${name.split(" ").slice(-1)[0].toLowerCase()}@medibook.com`,
      password: 'password123',
      role: 'doctor',
      avatar: initials(name),
      doctorProfile: {
        specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
        rating: +(4 + Math.random() * 0.9).toFixed(1),
        reviews: 50 + Math.floor(Math.random() * 200),
        experience: 5 + Math.floor(Math.random() * 20),
        fee: 100 + Math.floor(Math.random() * 200),
        location: LOCATIONS[i % LOCATIONS.length],
        bio: `${name} is a highly experienced ${SPECIALIZATIONS[i % SPECIALIZATIONS.length].toLowerCase()} specialist with a proven track record of excellent patient care and outcomes.`,
        education: "MD — Harvard Medical School",
        available: true,
        isApproved: true,
        slots: SLOTS.filter(() => Math.random() > 0.1), // Most slots available
      }
    }));

    await User.insertMany(doctors);
    console.log('Doctors seeded successfully!');

    // Create some activity logs
    await ActivityLog.create([
      { action: 'System initialized', user: 'Admin User', type: 'system' },
      { action: 'Doctors list updated', user: 'Admin User', type: 'doctor' }
    ]);

    console.log('Data seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
