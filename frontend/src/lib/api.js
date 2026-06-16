import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor for JWT
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  toggleFavorite: (doctorId) => api.post(`/auth/favorites/${doctorId}`),
};

export const doctorAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  updateProfile: (profileData) => api.put('/doctors/profile', profileData),
};

export const appointmentAPI = {
  book: (appointmentData) => api.post('/appointments', appointmentData),

  getMyAppointments: () => api.get('/appointments'),
  updateStatus: (id, status) => api.put(`/appointments/${id}`, { status }),
};

export const prescriptionAPI = {
  create: (prescriptionData) => api.post('/prescriptions', prescriptionData),
  getMyPrescriptions: () => api.get('/prescriptions/my'),
  getByAppointment: (appointmentId) => api.get(`/prescriptions/appointment/${appointmentId}`),

};

export const adminAPI = {
  getLogs: () => api.get('/admin/logs'),
  getUsers: () => api.get('/admin/users'),
  addDoctor: (data) => api.post('/admin/add-doctor', data),
  approveDoctor: (id) => api.put(`/admin/approve-doctor/${id}`),
  getDoctorRequests: () => api.get('/admin/doctor-requests'),
  getAppointments: () => api.get('/admin/appointments'),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
};

export default api;
