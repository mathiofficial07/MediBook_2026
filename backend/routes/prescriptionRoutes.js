const express = require('express');
const { createPrescription, getPrescriptionByAppointment, getMyPrescriptions } = require('../controllers/prescriptionController');

const { protect, doctor } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, doctor, createPrescription);
router.get('/my', protect, getMyPrescriptions);
router.get('/appointment/:appointmentId', protect, getPrescriptionByAppointment);


module.exports = router;
