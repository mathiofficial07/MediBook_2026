const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
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
    default: () => new Date().toISOString().split('T')[0],
  },
  diagnosis: String,
  medications: [{
    name: String,
    dosage: String,
    duration: String,
  }],
  notes: String,
}, { timestamps: true });

const MongoosePrescription = mongoose.model('Prescription', prescriptionSchema);

// Dynamic proxy that routes calls to MongoDB or JSON DB depending on connection state
const PrescriptionProxy = new Proxy(MongoosePrescription, {
  construct(target, args) {
    if (mongoose.connection.readyState === 1) {
      return new target(...args);
    } else {
      const { getMockPrescriptionModel } = require('../utils/jsonDb');
      const MockModel = getMockPrescriptionModel();
      return new MockModel(...args);
    }
  },
  get(target, prop, receiver) {
    if (mongoose.connection.readyState === 1) {
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === 'function') return val.bind(target);
      return val;
    } else {
      const { getMockPrescriptionModel } = require('../utils/jsonDb');
      const MockModel = getMockPrescriptionModel();
      const val = Reflect.get(MockModel, prop);
      if (typeof val === 'function') return val.bind(MockModel);
      return val;
    }
  }
});

module.exports = PrescriptionProxy;
