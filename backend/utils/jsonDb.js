const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const USERS_FILE = path.join(dataDir, 'users.json');
const APPOINTMENTS_FILE = path.join(dataDir, 'appointments.json');
const PRESCRIPTIONS_FILE = path.join(dataDir, 'prescriptions.json');
const ACTIVITYLOGS_FILE = path.join(dataDir, 'activitylogs.json');

// Helper to read/write JSON files
function readJSON(file, defaultData = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Error reading JSON DB file:', file, e);
    return defaultData;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing JSON DB file:', file, e);
  }
}

// Generate default users (Admin + Doctors) for seeding
const SPECIALIZATIONS = [
  "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics",
  "Psychiatry", "Oncology", "Ophthalmology", "Gynecology", "General Medicine",
];

const DOCTOR_NAMES = [
  "Dr. Sarah Mitchell", "Dr. James Rodriguez", "Dr. Priya Sharma",
  "Dr. Michael Chen", "Dr. Emily Watson", "Dr. David Kim",
  "Dr. Lisa Anderson", "Dr. Robert Taylor", "Dr. Aisha Patel",
  "Dr. Thomas Brown", "Dr. Maria Garcia", "Dr. Kevin Lee",
];

const LOCATIONS = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
  "Phoenix, AZ", "San Francisco, CA", "Boston, MA", "Seattle, WA",
];

const SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"];

const initials = (name) => name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("");

// Default pre-seeded users
const defaultUsers = [];

// Seed admin
const adminSalt = bcrypt.genSaltSync(10);
defaultUsers.push({
  _id: "660c6d2d4889d1d6438b0000",
  name: 'Admin User',
  email: 'admin@medibook.com',
  password: bcrypt.hashSync('admin123', adminSalt),
  role: 'admin',
  avatar: 'AU',
  status: 'active',
  favorites: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Seed doctors
DOCTOR_NAMES.forEach((name, i) => {
  const doctorSalt = bcrypt.genSaltSync(10);
  const email = `${name.split(" ").slice(-1)[0].toLowerCase()}@medibook.com`;
  defaultUsers.push({
    _id: `660c6d2d4889d1d6438b00${(i + 1).toString().padStart(2, '0')}`,
    name,
    email,
    password: bcrypt.hashSync('password123', doctorSalt),
    role: 'doctor',
    avatar: initials(name),
    status: 'active',
    favorites: [],
    doctorProfile: {
      specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
      rating: +(4 + Math.random() * 0.9).toFixed(1),
      reviews: 50 + Math.floor(Math.random() * 200),
      experience: 5 + Math.floor(Math.random() * 20),
      fee: 100 + Math.floor(Math.random() * 200),
      location: LOCATIONS[i % LOCATIONS.length],
      bio: `${name} is a highly experienced ${SPECIALIZATIONS[i % SPECIALIZATIONS.length].toLowerCase()} specialist with a proven track record of excellent patient care and outcomes.`,
      education: "MD — Harvard Medical School",
      available: true,
      isApproved: true,
      slots: SLOTS.filter(() => Math.random() > 0.1),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

const defaultActivityLogs = [
  {
    _id: "660c6d2d4889d1d6438b0100",
    action: 'System initialized',
    user: 'Admin User',
    type: 'system',
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "660c6d2d4889d1d6438b0101",
    action: 'Doctors list updated',
    user: 'Admin User',
    type: 'doctor',
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function populateField(doc, pathStr, selectFields = null) {
  if (!doc) return doc;
  
  const paths = pathStr.split(/\s+/);
  for (const pathKey of paths) {
    if (!pathKey) continue;
    
    const refId = doc[pathKey];
    if (!refId) continue;
    
    let refCollection = [];
    if (pathKey === 'doctor' || pathKey === 'patient' || pathKey === 'user') {
      refCollection = readJSON(USERS_FILE, defaultUsers);
    } else if (pathKey === 'appointment') {
      refCollection = readJSON(APPOINTMENTS_FILE, []);
    }
    
    const refDoc = refCollection.find(item => item._id.toString() === refId.toString());
    if (refDoc) {
      if (selectFields) {
        const fields = selectFields.split(/\s+/);
        const filtered = { _id: refDoc._id };
        for (const f of fields) {
          if (f.startsWith('doctorProfile.')) {
            const sub = f.split('.')[1];
            if (refDoc.doctorProfile) {
              filtered.doctorProfile = filtered.doctorProfile || {};
              filtered.doctorProfile[sub] = refDoc.doctorProfile[sub];
            }
          } else {
            filtered[f] = refDoc[f];
          }
        }
        doc[pathKey] = filtered;
      } else {
        doc[pathKey] = { ...refDoc };
      }
    }
  }
  return doc;
}

class MockQuery {
  constructor(promise) {
    this.promise = promise;
  }
  
  sort(sortObj) {
    return new MockQuery(this.promise.then(data => {
      if (!Array.isArray(data)) return data;
      const key = Object.keys(sortObj)[0];
      const dir = sortObj[key];
      return [...data].sort((a, b) => {
        const valA = a[key] || '';
        const valB = b[key] || '';
        if (valA < valB) return dir === -1 ? 1 : -1;
        if (valA > valB) return dir === -1 ? -1 : 1;
        return 0;
      });
    }));
  }
  
  populate(pathStr, selectFields = null) {
    return new MockQuery(this.promise.then(data => {
      if (Array.isArray(data)) {
        return data.map(doc => populateField({ ...doc }, pathStr, selectFields));
      } else if (data) {
        return populateField({ ...data }, pathStr, selectFields);
      }
      return data;
    }));
  }
  
  select(fieldsStr) {
    return this;
  }
  
  then(resolve, reject) {
    return this.promise.then(resolve, reject);
  }
}

function decorateUser(user) {
  if (!user) return user;
  
  user.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  return user;
}

function createMockModel(filename, defaultData = []) {
  const getCollection = () => readJSON(filename, defaultData);
  const saveCollection = (data) => writeJSON(filename, data);

  class MockModel {
    constructor(data) {
      Object.assign(this, data);
      if (!this._id) {
        this._id = new mongoose.Types.ObjectId().toString();
      }
      if (filename === USERS_FILE) {
        decorateUser(this);
      }
    }

    async save() {
      const collection = getCollection();
      const idx = collection.findIndex(item => item._id.toString() === this._id.toString());
      
      const now = new Date().toISOString();
      if (!this.createdAt) this.createdAt = now;
      this.updatedAt = now;

      // Extract raw properties
      const rawData = {};
      for (const [key, value] of Object.entries(this)) {
        if (typeof value !== 'function') {
          rawData[key] = value;
        }
      }

      // Hash password if modified / new
      if (filename === USERS_FILE && rawData.password && !rawData.password.startsWith('$2a$')) {
        const salt = await bcrypt.genSalt(10);
        rawData.password = await bcrypt.hash(rawData.password, salt);
        this.password = rawData.password;
      }

      if (idx !== -1) {
        collection[idx] = rawData;
      } else {
        collection.push(rawData);
      }
      
      saveCollection(collection);
      return this;
    }

    async populate(pathStr, selectFields = null) {
      populateField(this, pathStr, selectFields);
      return this;
    }

    static find(filter = {}) {
      let data = getCollection();
      
      // Simple filter evaluation
      if (filter && Object.keys(filter).length > 0) {
        data = data.filter(item => {
          for (const [key, val] of Object.entries(filter)) {
            if (val && typeof val === 'object' && val.$ne !== undefined) {
              if (item[key] === val.$ne) return false;
            } else if (item[key] !== val) {
              return false;
            }
          }
          return true;
        });
      }

      return new MockQuery(Promise.resolve(data.map(item => {
        if (filename === USERS_FILE) return decorateUser(item);
        return item;
      })));
    }

    static async findOne(filter = {}) {
      const collection = getCollection();
      const item = collection.find(item => {
        for (const [key, val] of Object.entries(filter)) {
          if (item[key] !== val) return false;
        }
        return true;
      });
      if (!item) return null;
      
      const instance = new MockModel(item);
      if (filename === USERS_FILE) decorateUser(instance);
      return instance;
    }

    static async findById(id) {
      if (!id) return null;
      const collection = getCollection();
      const item = collection.find(item => item._id.toString() === id.toString());
      if (!item) return null;
      
      const instance = new MockModel(item);
      if (filename === USERS_FILE) decorateUser(instance);
      return instance;
    }

    static async findByIdAndUpdate(id, updateData, options = {}) {
      const collection = getCollection();
      const idx = collection.findIndex(item => item._id.toString() === id.toString());
      if (idx === -1) return null;

      const now = new Date().toISOString();
      const existing = collection[idx];
      const updated = {
        ...existing,
        ...updateData,
        updatedAt: now
      };
      
      if (filename === USERS_FILE && updateData.password && !updateData.password.startsWith('$2a$')) {
        const salt = await bcrypt.genSalt(10);
        updated.password = await bcrypt.hash(updateData.password, salt);
      }

      collection[idx] = updated;
      saveCollection(collection);

      const instance = new MockModel(updated);
      if (filename === USERS_FILE) decorateUser(instance);
      return instance;
    }

    static async findByIdAndDelete(id) {
      const collection = getCollection();
      const idx = collection.findIndex(item => item._id.toString() === id.toString());
      if (idx === -1) return null;

      const deleted = collection.splice(idx, 1)[0];
      saveCollection(collection);
      
      const instance = new MockModel(deleted);
      if (filename === USERS_FILE) decorateUser(instance);
      return instance;
    }

    static async deleteMany(filter = {}) {
      const collection = getCollection();
      let deletedCount = 0;
      if (Object.keys(filter).length === 0) {
        deletedCount = collection.length;
        saveCollection([]);
      } else {
        const remaining = collection.filter(item => {
          let matches = true;
          for (const [key, val] of Object.entries(filter)) {
            if (item[key] !== val) matches = false;
          }
          if (matches) deletedCount++;
          return !matches;
        });
        saveCollection(remaining);
      }
      return { deletedCount };
    }

    static async create(dataOrArray) {
      if (Array.isArray(dataOrArray)) {
        return this.insertMany(dataOrArray);
      }
      const instance = new MockModel(dataOrArray);
      await instance.save();
      return instance;
    }

    static async insertMany(items) {
      const collection = getCollection();
      const now = new Date().toISOString();
      const processed = [];
      
      for (const item of items) {
        const doc = { ...item };
        if (!doc._id) doc._id = new mongoose.Types.ObjectId().toString();
        if (!doc.createdAt) doc.createdAt = now;
        doc.updatedAt = now;
        
        if (filename === USERS_FILE && doc.password && !doc.password.startsWith('$2a$')) {
          const salt = await bcrypt.genSalt(10);
          doc.password = await bcrypt.hash(doc.password, salt);
        }
        
        collection.push(doc);
        processed.push(new MockModel(doc));
      }
      
      saveCollection(collection);
      return processed;
    }
  }

  return MockModel;
}

let MockUser = null;
let MockAppointment = null;
let MockPrescription = null;
let MockActivityLog = null;

module.exports = {
  getMockUserModel: () => {
    if (!MockUser) MockUser = createMockModel(USERS_FILE, defaultUsers);
    return MockUser;
  },
  getMockAppointmentModel: () => {
    if (!MockAppointment) MockAppointment = createMockModel(APPOINTMENTS_FILE, []);
    return MockAppointment;
  },
  getMockPrescriptionModel: () => {
    if (!MockPrescription) MockPrescription = createMockModel(PRESCRIPTIONS_FILE, []);
    return MockPrescription;
  },
  getMockActivityLogModel: () => {
    if (!MockActivityLog) MockActivityLog = createMockModel(ACTIVITYLOGS_FILE, defaultActivityLogs);
    return MockActivityLog;
  }
};
