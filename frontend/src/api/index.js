import axios from 'axios';

// In production with split deployment, set VITE_API_URL to the backend URL.
// In local dev or monorepo production, Vite proxy / Express handles /api directly.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gp_token');
      localStorage.removeItem('gp_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  me: () => api.get('/auth/me'),
};

export const mealsAPI = {
  getToday: (classroom) => api.get('/meal-records/today', { params: { classroom } }),
  getStudent: (id, limit = 90) => api.get(`/meal-records/student/${id}`, { params: { limit } }),
};

export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  getTimeline: (id) => api.get(`/students/${id}/timeline`),
};

export const teachersAPI = {
  me: () => api.get('/teachers/me'),
  classroomSummary: () => api.get('/teachers/classroom-summary'),
};

export const gameAPI = {
  getProgress: () => api.get('/game/progress'),
  attack: (skill) => api.post('/game/attack', { skill }),
  getLeaderboard: (type, params) => api.get('/game/leaderboard', { params: { type, ...params } }),
};

export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getMy: () => api.get('/feedback/my'),
  getStudent: (id) => api.get(`/feedback/student/${id}`),
  getClassroom: () => api.get('/feedback/classroom'),
};

export const demoAPI = {
  getStudents: () => api.get('/demo/students'),
  reset: (secret) => api.post('/demo/reset', { secret }),
};

export default api;
