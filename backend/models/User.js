const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  avatar: String,
  phone: String,
  address: String,
  joined: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  // Doctor specific fields (optional, only if role is 'doctor')
  doctorProfile: {
    specialization: String,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    experience: Number,
    fee: Number,
    location: String,
    bio: String,
    education: String,
    available: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    isApplied: { type: Boolean, default: false },
    slots: [String],
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.model('User', userSchema);

// Dynamic proxy that routes calls to MongoDB or JSON DB depending on connection state
const UserProxy = new Proxy(MongooseUser, {
  construct(target, args) {
    if (mongoose.connection.readyState === 1) {
      return new target(...args);
    } else {
      const { getMockUserModel } = require('../utils/jsonDb');
      const MockModel = getMockUserModel();
      return new MockModel(...args);
    }
  },
  get(target, prop, receiver) {
    if (mongoose.connection.readyState === 1) {
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === 'function') return val.bind(target);
      return val;
    } else {
      const { getMockUserModel } = require('../utils/jsonDb');
      const MockModel = getMockUserModel();
      const val = Reflect.get(MockModel, prop);
      if (typeof val === 'function') return val.bind(MockModel);
      return val;
    }
  }
});

module.exports = UserProxy;
