const express = require('express');
const { 
  getActivityLogs, 
  getUsers, 
  addDoctor, 
  approveDoctor, 
  getDoctorRequests, 
  deleteUser,
  getAppointments
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/logs', protect, admin, getActivityLogs);
router.get('/users', protect, admin, getUsers);
router.post('/add-doctor', protect, admin, addDoctor);
router.put('/approve-doctor/:id', protect, admin, approveDoctor);
router.get('/doctor-requests', protect, admin, getDoctorRequests);
router.get('/appointments', protect, admin, getAppointments);
router.delete('/user/:id', protect, admin, deleteUser);


module.exports = router;
