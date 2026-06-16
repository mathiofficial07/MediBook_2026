const express = require('express');
const { registerUser, authUser, getUserProfile, toggleFavorite, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/favorites/:doctorId', protect, toggleFavorite);

module.exports = router;
