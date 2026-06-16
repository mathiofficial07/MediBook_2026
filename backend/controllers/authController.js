const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'patient' : (role || 'patient'),
    doctorProfile: role === 'doctor' ? { isApproved: false } : undefined
  });

  if (user) {
    // Log activity
    await ActivityLog.create({
      action: `New ${user.role} registered`,
      user: user.name,
      type: 'user',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      doctorProfile: user.doctorProfile,
      favorites: user.favorites,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { doctorId } = req.params;

  if (user) {
    const isFavorite = user.favorites.includes(doctorId);
    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== doctorId);
    } else {
      user.favorites.push(doctorId);
    }
    await user.save();
    res.json(user.favorites);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      favorites: updatedUser.favorites,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, authUser, getUserProfile, toggleFavorite, updateUserProfile };
