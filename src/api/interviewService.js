import axios from 'axios';

const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BACKEND}/api/interview`,
  headers: { 'Content-Type': 'application/json' },
});

export const startInterview = (data) => api.post('/start', data).then(r => r.data);
export const getInterviewStatus = (roomName) => api.get(`/status/${roomName}`).then(r => r.data);
export const getInterviewResults = (sessionId) => api.get(`/results/${sessionId}`).then(r => r.data);
export const resetInterview = (sessionId) => api.post(`/reset/${sessionId}`).then(r => r.data);
