import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token Management
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const clearToken = () => {
  localStorage.removeItem('auth_token');
  delete apiClient.defaults.headers.common.Authorization;
};

// Initialize token on app start
const initialToken = getToken();
if (initialToken) {
  setToken(initialToken);
}

// Response interceptor for 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods organized by resource
export const api = {
  // Authentication
  auth: {
    register: (data) =>
      apiClient.post('/auth/register', data).then((res) => res.data),
    login: (email, password) =>
      apiClient.post('/auth/login', { email, password }).then((res) => res.data),
    getMe: () =>
      apiClient.get('/auth/me').then((res) => res.data.user),
    logout: () =>
      apiClient.post('/auth/logout').then((res) => res.data),
  },

  // Hospitals
  hospitals: {
    getAll: () =>
      apiClient.get('/hospitals').then((res) => res.data.data),
    getById: (id) =>
      apiClient.get(`/hospitals/${id}`).then((res) => res.data.data),
    getBeds: (id) =>
      apiClient.get(`/hospitals/${id}/beds`).then((res) => res.data.data),
    updateBeds: (id, data) =>
      apiClient.put(`/hospitals/${id}/beds`, data).then((res) => res.data.data),
  },

  // Ambulances
  ambulances: {
    getAll: () =>
      apiClient.get('/ambulances').then((res) => res.data.data),
    getAvailable: () =>
      apiClient.get('/ambulances/available').then((res) => res.data.data),
    getById: (id) =>
      apiClient.get(`/ambulances/${id}`).then((res) => res.data.data),
    updateLocation: (id, data) =>
      apiClient.put(`/ambulances/${id}/location`, data).then((res) => res.data.data),
    updateStatus: (id, status) =>
      apiClient.put(`/ambulances/${id}/status`, { status }).then((res) => res.data.data),
  },

  // Emergencies
  emergencies: {
    create: (data) =>
      apiClient.post('/emergencies', data).then((res) => res.data.data),
    getAll: () =>
      apiClient.get('/emergencies').then((res) => res.data.data),
    getById: (id) =>
      apiClient.get(`/emergencies/${id}`).then((res) => res.data.data),
    updateStatus: (id, status) =>
      apiClient.put(`/emergencies/${id}/status`, { status }).then((res) => res.data.data),
    accept: (id, ambulanceId) =>
      apiClient.put(`/emergencies/${id}/accept`, { ambulanceId }).then((res) => res.data.data),
  },

  // Routes
  routes: {
    calculate: (data) =>
      apiClient.post('/routes/calculate', data).then((res) => res.data.data),
    getById: (id) =>
      apiClient.get(`/routes/${id}`).then((res) => res.data.data),
    update: (id, data) =>
      apiClient.put(`/routes/${id}`, data).then((res) => res.data.data),
  },

  // Traffic Signals
  signals: {
    getAll: () =>
      apiClient.get('/signals').then((res) => res.data.data),
    getById: (id) =>
      apiClient.get(`/signals/${id}`).then((res) => res.data.data),
    override: (id, data) =>
      apiClient.post(`/signals/${id}/override`, data).then((res) => res.data.data),
    getHistory: (id) =>
      apiClient.get(`/signals/${id}/history`).then((res) => res.data.data),
  },
};

export default apiClient;
