const ActivityLog = require('../models/ActivityLog');
const { sendApprovalEmail } = require('../utils/emailService');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all activity logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching activity logs' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching users' });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('doctor', 'name email doctorProfile.specialization')
      .populate('patient', 'name email')
      .sort({ date: -1, time: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching appointments' });
  }
};

module.exports = { 
  getActivityLogs,
  getUsers,
  getAppointments,
  addDoctor: async (req, res) => {
    try {
      const { name, email, password, doctorProfile } = req.body;
      const user = await User.create({
        name,
        email,
        password,
        role: 'doctor',
        doctorProfile: { ...doctorProfile, isApproved: true }
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Server error adding doctor' });
    }
  },
  approveDoctor: async (req, res) => {
    try {
      const doctor = await User.findById(req.params.id);
      if (doctor && doctor.role === 'doctor') {
        doctor.doctorProfile.isApproved = true;
        await doctor.save();

        // Send email (async)
        sendApprovalEmail(doctor).catch(console.error);

        res.json({ message: 'Doctor approved' });
      } else {
        res.status(404).json({ message: 'Doctor not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message || 'Server error approving doctor' });
    }
  },
  getDoctorRequests: async (req, res) => {
    try {
      const requests = await User.find({ 
        role: 'doctor', 
        'doctorProfile.isApproved': false,
        'doctorProfile.isApplied': true
      }).select('-password');
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Server error fetching doctor requests' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User removed' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message || 'Server error deleting user' });
    }
  }
};
