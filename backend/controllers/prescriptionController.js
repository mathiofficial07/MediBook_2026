const Prescription = require('../models/Prescription');
const Attachment = require('../models/Appointment'); // Assuming we might need to check appointment status

const createPrescription = async (req, res) => {
  const { appointmentId, patientId, diagnosis, medications, notes } = req.body;

  const prescription = await Prescription.create({
    appointment: appointmentId,
    doctor: req.user._id,
    patient: patientId,
    diagnosis,
    medications,
    notes,
  });

  if (prescription) {
    res.status(201).json(prescription);
  } else {
    res.status(400).json({ message: 'Invalid prescription data' });
  }
};

const getPrescriptionByAppointment = async (req, res) => {
  const prescription = await Prescription.findOne({ appointment: req.params.appointmentId });

  if (prescription) {
    res.json(prescription);
  } else {
    res.status(404).json({ message: 'Prescription not found' });
  }
};

const getMyPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.user._id })
    .populate('doctor', 'name')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
};

module.exports = { createPrescription, getPrescriptionByAppointment, getMyPrescriptions };

