import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

// Dashboard API
export const dashboardAPI = {
    getSummary: () => api.get('/dashboard/summary'),
};

// Transaction API
export const transactionAPI = {
    create: (data) => api.post('/transactions', data),
    getAll: (params) => api.get('/transactions', { params }),
    getRecent: (limit = 10) => api.get(`/transactions/recent?limit=${limit}`),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
};

// Category API
export const categoryAPI = {
    getAll: () => api.get('/categories'),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Wallet API
export const walletAPI = {
    getAll: () => api.get('/wallets'),
    create: (data) => api.post('/wallets', data),
    update: (id, data) => api.put(`/wallets/${id}`, data),
    delete: (id) => api.delete(`/wallets/${id}`),
};

// Budget API
export const budgetAPI = {
    getAll: () => api.get('/budgets'),
    create: (data) => api.post('/budgets', data),
    update: (id, data) => api.put(`/budgets/${id}`, data),
    delete: (id) => api.delete(`/budgets/${id}`),
    getStatus: () => api.get('/budgets/status'),
};

export default api;
