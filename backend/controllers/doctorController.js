const User = require('../models/User');

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ 
      role: 'doctor', 
      'doctorProfile.isApproved': true 
    }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching doctors' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');

    if (doctor && doctor.role === 'doctor') {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching doctor' });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && user.role === 'doctor') {
      const profileObj = user.doctorProfile ? user.doctorProfile.toObject() : {};
      const dataToUpdate = req.body.doctorProfile || req.body;
      const { isApproved, isApplied, ...profileData } = dataToUpdate;

      user.doctorProfile = {
        ...profileObj,
        ...profileData,
        isApproved: profileObj.isApproved,
        isApplied: isApplied !== undefined ? isApplied : profileObj.isApplied
      };

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Doctor profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

module.exports = { getDoctors, getDoctorById, updateDoctorProfile };
