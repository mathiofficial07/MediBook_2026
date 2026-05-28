// Mock data for the entire application (frontend only)

const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Oncology",
  "Ophthalmology",
  "Gynecology",
  "General Medicine",
];

const DOCTOR_NAMES = [
  "Dr. Sarah Mitchell",
  "Dr. James Rodriguez",
  "Dr. Priya Sharma",
  "Dr. Michael Chen",
  "Dr. Emily Watson",
  "Dr. David Kim",
  "Dr. Lisa Anderson",
  "Dr. Robert Taylor",
  "Dr. Aisha Patel",
  "Dr. Thomas Brown",
  "Dr. Maria Garcia",
  "Dr. Kevin Lee",
];

const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "San Francisco, CA",
  "Boston, MA",
  "Seattle, WA",
];

const SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

const initials = (name) =>
  name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("");

export const mockDoctors = DOCTOR_NAMES.map((name, i) => ({
  id: `doc-${i + 1}`,
  name,
  specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
  avatar: initials(name),
  rating: +(4 + Math.random() * 0.9).toFixed(1),
  reviews: 50 + Math.floor(Math.random() * 200),
  experience: 5 + Math.floor(Math.random() * 20),
  fee: 100 + Math.floor(Math.random() * 200),
  location: LOCATIONS[i % LOCATIONS.length],
  bio: `${name} is a highly experienced ${SPECIALIZATIONS[i % SPECIALIZATIONS.length].toLowerCase()} specialist with a proven track record of excellent patient care and outcomes.`,
  education: "MD — Harvard Medical School",
  available: Math.random() > 0.2,
  slots: SLOTS.filter(() => Math.random() > 0.3),
}));

export const mockPrescriptions = [
  {
    id: "rx-1",
    appointmentId: "apt-3",
    doctorName: "Dr. Emily Watson",
    patientName: "Jane Smith",
    date: "2026-03-15",
    diagnosis: "Seasonal Allergies",
    medications: [
      { name: "Cetirizine", dosage: "10mg", duration: "14 days" },
      {
        name: "Fluticasone Spray",
        dosage: "2 sprays/nostril",
        duration: "30 days",
      },
    ],
    notes:
      "Avoid exposure to pollen. Follow up in 2 weeks if symptoms persist.",
  },
  {
    id: "rx-2",
    appointmentId: "apt-2",
    doctorName: "Dr. Priya Sharma",
    patientName: "John Doe",
    date: "2026-03-18",
    diagnosis: "Tension Headache",
    medications: [
      { name: "Ibuprofen", dosage: "400mg", duration: "7 days" },
      { name: "Amitriptyline", dosage: "25mg at night", duration: "30 days" },
    ],
    notes:
      "Reduce screen time. Practice relaxation techniques. Follow up in 1 month.",
  },
];

export const mockAppointments = [
  {
    id: "apt-1",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Mitchell",
    specialization: "Cardiology",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    date: "2026-03-20",
    time: "10:00 AM",
    status: "pending",
  },
  {
    id: "apt-2",
    doctorId: "doc-3",
    doctorName: "Dr. Priya Sharma",
    specialization: "Neurology",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    date: "2026-03-18",
    time: "02:30 PM",
    status: "accepted",
    prescription: mockPrescriptions[1],
  },
  {
    id: "apt-3",
    doctorId: "doc-5",
    doctorName: "Dr. Emily Watson",
    specialization: "Pediatrics",
    patientName: "Jane Smith",
    patientEmail: "jane@example.com",
    date: "2026-03-15",
    time: "11:00 AM",
    status: "completed",
    prescription: mockPrescriptions[0],
  },
  {
    id: "apt-4",
    doctorId: "doc-2",
    doctorName: "Dr. James Rodriguez",
    specialization: "Dermatology",
    patientName: "Alice Brown",
    patientEmail: "alice@example.com",
    date: "2026-03-22",
    time: "09:00 AM",
    status: "pending",
  },
  {
    id: "apt-5",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Mitchell",
    specialization: "Cardiology",
    patientName: "Bob Wilson",
    patientEmail: "bob@example.com",
    date: "2026-03-12",
    time: "03:00 PM",
    status: "rejected",
  },
  {
    id: "apt-6",
    doctorId: "doc-4",
    doctorName: "Dr. Michael Chen",
    specialization: "Orthopedics",
    patientName: "Carol Davis",
    patientEmail: "carol@example.com",
    date: "2026-03-25",
    time: "10:30 AM",
    status: "pending",
  },
  {
    id: "apt-7",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Mitchell",
    specialization: "Cardiology",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    date: "2026-03-10",
    time: "09:30 AM",
    status: "completed",
  },
  {
    id: "apt-8",
    doctorId: "doc-6",
    doctorName: "Dr. David Kim",
    specialization: "Psychiatry",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    date: "2026-03-28",
    time: "04:00 PM",
    status: "pending",
  },
];

export const mockUsers = [
  {
    id: "u-1",
    name: "John Doe",
    email: "john@example.com",
    role: "patient",
    avatar: "JD",
    joined: "2026-01-15",
    status: "active",
    phone: "+1 555-0101",
  },
  {
    id: "u-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "patient",
    avatar: "JS",
    joined: "2026-02-01",
    status: "active",
    phone: "+1 555-0102",
  },
  {
    id: "u-3",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "patient",
    avatar: "AB",
    joined: "2026-02-10",
    status: "active",
    phone: "+1 555-0103",
  },
  {
    id: "u-4",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "patient",
    avatar: "BW",
    joined: "2026-01-20",
    status: "inactive",
    phone: "+1 555-0104",
  },
  {
    id: "u-5",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "patient",
    avatar: "CD",
    joined: "2026-03-01",
    status: "active",
    phone: "+1 555-0105",
  },
  ...mockDoctors.slice(0, 6).map((d, i) => ({
    id: `u-d${i + 1}`,
    name: d.name,
    email: `${d.name.split(" ")[1].toLowerCase()}@medibook.com`,
    role: "doctor",
    avatar: d.avatar,
    joined: "2025-06-01",
    status: "active",
  })),
  {
    id: "u-admin",
    name: "Admin User",
    email: "admin@medibook.com",
    role: "admin",
    avatar: "AU",
    joined: "2025-01-01",
    status: "active",
  },
];

export const mockActivityLogs = [
  {
    id: "log-1",
    action: "New patient registered",
    user: "John Doe",
    timestamp: "2026-03-21 09:15",
    type: "user",
  },
  {
    id: "log-2",
    action: "Appointment booked",
    user: "John Doe",
    timestamp: "2026-03-21 09:20",
    type: "appointment",
  },
  {
    id: "log-3",
    action: "Doctor profile updated",
    user: "Dr. Sarah Mitchell",
    timestamp: "2026-03-21 10:00",
    type: "doctor",
  },
  {
    id: "log-4",
    action: "Appointment accepted",
    user: "Dr. Priya Sharma",
    timestamp: "2026-03-21 10:30",
    type: "appointment",
  },
  {
    id: "log-5",
    action: "New doctor added",
    user: "Admin User",
    timestamp: "2026-03-20 14:00",
    type: "doctor",
  },
  {
    id: "log-6",
    action: "Appointment completed",
    user: "Dr. Emily Watson",
    timestamp: "2026-03-20 16:00",
    type: "appointment",
  },
  {
    id: "log-7",
    action: "User account deactivated",
    user: "Admin User",
    timestamp: "2026-03-19 11:30",
    type: "system",
  },
  {
    id: "log-8",
    action: "Prescription added",
    user: "Dr. Priya Sharma",
    timestamp: "2026-03-18 15:00",
    type: "appointment",
  },
];

export const SPECIALIZATION_LIST = SPECIALIZATIONS;
