const Appointment = require('../models/Appointment');
const ActivityLog = require('../models/ActivityLog');
const { sendAppointmentEmail } = require('../utils/emailService');

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'Please provide doctorId, date, and time' });
    }

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: req.user._id,
      date,
      time,
      reason,
    });

    // Log activity
    await ActivityLog.create({
      action: 'Appointment booked',
      user: req.user.name,
      type: 'appointment',
    });

    // Populate before sending email
    await appointment.populate('doctor patient');

    // Send email (async)
    sendAppointmentEmail(appointment, 'booked').catch(console.error);

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create Appointment Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating appointment' });
  }
};


const getMyAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'doctor') {
      appointments = await Appointment.find({ doctor: req.user._id })
        .populate('patient', 'name email avatar')
        .sort({ createdAt: -1 });
    } else {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'name email doctorProfile avatar')
        .populate('patient', 'name email avatar')
        .sort({ createdAt: -1 });
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching appointments' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = req.body.status || appointment.status;
      const updatedAppointment = await appointment.save();

      // Log activity
      await ActivityLog.create({
        action: `Appointment ${appointment.status}`,
        user: req.user.name,
        type: 'appointment',
      });

      // Populate before sending email
      await updatedAppointment.populate('doctor patient');

      // Send email (async)
      sendAppointmentEmail(updatedAppointment, updatedAppointment.status).catch(console.error);

      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating appointment' });
  }
};

module.exports = { createAppointment, getMyAppointments, updateAppointmentStatus };
