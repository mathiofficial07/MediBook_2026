const express = require('express');
const { createAppointment, getMyAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getMyAppointments);

router.route('/:id')
  .put(protect, updateAppointmentStatus);

module.exports = router;
