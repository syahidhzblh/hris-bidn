import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (updates) => api.put('/auth/profile', updates),
};

// Employee API
export const employeeAPI = {
  getEmployees: () => api.get('/employees'),
  getEmployeeByUserId: (userId) => api.get(`/employees/user/${userId}`),
  createEmployee: (employeeData) => api.post('/employees', employeeData),
  updateEmployee: (id, updates) => api.put(`/employees/${id}`, updates),
  getDivisions: () => api.get('/employees/divisions'),
};

// Attendance API
export const attendanceAPI = {
  getTodayAttendance: (employeeId) => api.get(`/attendance/${employeeId}/today`),
  getAttendanceHistory: (employeeId, limit) => api.get(`/attendance/${employeeId}/history?limit=${limit || 30}`),
  getAttendanceStats: (employeeId, month, year) => api.get(`/attendance/${employeeId}/stats?month=${month}&year=${year}`),
  clockIn: (employeeId, data) => api.post(`/attendance/${employeeId}/clock-in`, data),
  clockOut: (employeeId, data) => api.post(`/attendance/${employeeId}/clock-out`, data),
};

// Leave API
export const leaveAPI = {
  getLeaveRequests: (employeeId) => api.get(`/leave${employeeId ? `?employeeId=${employeeId}` : ''}`),
  createLeaveRequest: (leaveData) => api.post('/leave', leaveData),
  updateLeaveRequest: (id, updates) => api.put(`/leave/${id}`, updates),
  getLeaveBalance: (employeeId, year) => api.get(`/leave/${employeeId}/balance?year=${year || new Date().getFullYear()}`),
};

// Announcement API
export const announcementAPI = {
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (announcementData) => api.post('/announcements', announcementData),
  updateAnnouncement: (id, updates) => api.put(`/announcements/${id}`, updates),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export default api;