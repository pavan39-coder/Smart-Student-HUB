import api from './api';

/**
 * Authentication Service
 */
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: () => api.get('/auth/me'),
};

/**
 * User Service
 */
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/update', data),
  getStats: () => api.get('/user/stats'),
  togglePortfolioVisibility: () => api.put('/user/portfolio/toggle'),
};

/**
 * Activity Service
 */
export const activityService = {
  addActivity: (data) => api.post('/activity/add', data),
  getMyActivities: (filters = {}) => api.get('/activity/my', { params: filters }),
  getActivity: (id) => api.get(`/activity/${id}`),
  updateActivity: (id, data) => api.put(`/activity/${id}`, data),
  deleteActivity: (id) => api.delete(`/activity/${id}`),
};

/**
 * Admin Service
 */
export const adminService = {
  approveActivity: (id, data) => api.put(`/admin/activity/${id}/approve`, data),
  rejectActivity: (id, data) => api.put(`/admin/activity/${id}/reject`, data),
  getPendingActivities: () => api.get('/admin/activities/pending'),
  getAllStudents: (search = '') => api.get('/admin/students', { params: { search } }),
  getFaculty: () => api.get('/admin/faculty'),
  assignFaculty: (studentId, facultyId) => api.put(`/admin/students/${studentId}/assign-faculty`, { facultyId }),
  getStats: () => api.get('/admin/stats'),
  getNAACReport: () => api.get('/admin/reports/naac'),
};

/**
 * Leaderboard Service
 */
export const leaderboardService = {
  getLeaderboard: (limit = 100, skip = 0) =>
    api.get('/leaderboard', { params: { limit, skip } }),
  getUserRank: (userId) => api.get(`/leaderboard/rank/${userId}`),
};

/**
 * Project Service
 */
export const projectService = {
  addProject: (data) => api.post('/project/add', data),
  getAllProjects: (search = '', limit = 20, skip = 0) =>
    api.get('/project', { params: { search, limit, skip } }),
  getMyProjects: () => api.get('/project/my'),
  getProject: (id) => api.get(`/project/${id}`),
  updateProject: (id, data) => api.put(`/project/${id}`, data),
  deleteProject: (id) => api.delete(`/project/${id}`),
  getProjectsByUser: (userId) => api.get(`/project/user/${userId}`),
};

/**
 * Portfolio Service
 */
export const portfolioService = {
  getPortfolio: (portfolioId) => api.get(`/portfolio/${portfolioId}`),
  downloadPortfolioPDF: (portfolioId) => api.get(`/portfolio/pdf/${portfolioId}`, { responseType: 'blob' }),
};

export const integrationService = {
  getProviders: () => api.get('/integration/providers'),
  exportStudentData: (studentId, includeAllActivities = false) =>
    api.get(`/integration/export/student/${studentId}`, { params: { includeAllActivities } }),
  pushIntegrationData: (payload) => api.post('/integration/push', payload),
};
