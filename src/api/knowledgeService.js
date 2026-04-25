import axios from 'axios';

const knowledge = axios.create({
  baseURL: 'http://localhost:8000/api/v1/knowledge',
  headers: { 'Content-Type': 'application/json' },
});

knowledge.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const tokenType = localStorage.getItem('token_type') || 'Bearer';
  if (token) config.headers.Authorization = `${tokenType} ${token}`;
  return config;
});

export const getCategories = () => knowledge.get('/categories/').then(r => r.data);
export const createCategory = (data) => knowledge.post('/categories/', data).then(r => r.data);

export const getTools = (categoryId) =>
  knowledge.get('/tools/', { params: categoryId ? { category_id: categoryId } : {} }).then(r => r.data);
export const getTool = (id) => knowledge.get(`/tools/${id}/`).then(r => r.data);
export const createTool = (data) => knowledge.post('/tools/', data).then(r => r.data);
export const updateTool = (id, data) => knowledge.put(`/tools/${id}/`, data).then(r => r.data);
export const deleteTool = (id) => knowledge.delete(`/tools/${id}/`);

export const createConcept = (data) => knowledge.post('/concepts/', data).then(r => r.data);
export const updateConcept = (id, data) => knowledge.put(`/concepts/${id}/`, data).then(r => r.data);
export const deleteConcept = (id) => knowledge.delete(`/concepts/${id}/`);
