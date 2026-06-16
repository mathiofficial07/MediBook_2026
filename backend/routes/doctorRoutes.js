const express = require('express');
const { getDoctors, getDoctorById, updateDoctorProfile } = require('../controllers/doctorController');
const { protect, doctor } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/profile', protect, doctor, updateDoctorProfile);

module.exports = router;
