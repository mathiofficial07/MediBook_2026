const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'rejected', 'cancelled'],
    default: 'pending',
  },
  reason: String,
}, { timestamps: true });

const MongooseAppointment = mongoose.model('Appointment', appointmentSchema);

// Dynamic proxy that routes calls to MongoDB or JSON DB depending on connection state
const AppointmentProxy = new Proxy(MongooseAppointment, {
  construct(target, args) {
    if (mongoose.connection.readyState === 1) {
      return new target(...args);
    } else {
      const { getMockAppointmentModel } = require('../utils/jsonDb');
      const MockModel = getMockAppointmentModel();
      return new MockModel(...args);
    }
  },
  get(target, prop, receiver) {
    if (mongoose.connection.readyState === 1) {
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === 'function') return val.bind(target);
      return val;
    } else {
      const { getMockAppointmentModel } = require('../utils/jsonDb');
      const MockModel = getMockAppointmentModel();
      const val = Reflect.get(MockModel, prop);
      if (typeof val === 'function') return val.bind(MockModel);
      return val;
    }
  }
});

module.exports = AppointmentProxy;
