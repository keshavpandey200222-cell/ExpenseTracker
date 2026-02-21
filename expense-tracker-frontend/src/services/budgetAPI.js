// Budget API
export const budgetAPI = {
    getAll: () => api.get('/budgets'),
    create: (data) => api.post('/budgets', data),
    update: (id, data) => api.put(`/budgets/${id}`, data),
    delete: (id) => api.delete(`/budgets/${id}`),
    getStatus: () => api.get('/budgets/status'),
};
