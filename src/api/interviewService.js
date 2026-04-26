import axios from 'axios';

const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Create two API instances - one for /api/interview endpoints and one for /interviews
const apiInterview = axios.create({
  baseURL: `${BACKEND}/api/interview`,
  headers: { 'Content-Type': 'application/json' },
});

const interviewsApi = axios.create({
  baseURL: `${BACKEND}/interviews`,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to both instances
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    return config;
  });
};

addAuthInterceptor(apiInterview);
addAuthInterceptor(interviewsApi);

// /api/interview endpoints (LiveKit integration)
export const startInterview = (data) => apiInterview.post('/start', data).then(r => r.data);
export const getInterviewStatus = (roomName) => apiInterview.get(`/status/${roomName}`).then(r => r.data);
export const getInterviewResults = (sessionId) => apiInterview.get(`/results/${sessionId}`).then(r => r.data);
export const resetInterview = (sessionId) => apiInterview.post(`/reset/${sessionId}`).then(r => r.data);
export const completeInterview = (sessionId, data) => apiInterview.post(`/complete/${sessionId}`, data).then(r => r.data);

// /interviews endpoints (AI-powered interviews)
export const startAIInterview = (data) => interviewsApi.post('/start', data).then(r => r.data);
export const getAIInterviewStatus = (sessionId) => interviewsApi.get(`/status/${sessionId}`).then(r => r.data);
export const getAIInterviewScorecard = (applicationId) => interviewsApi.get(`/scorecard/${applicationId}`).then(r => r.data);
export const getEligibleCandidates = (requisitionId) => interviewsApi.get(`/eligible/${requisitionId}`).then(r => r.data);
export const completeAIInterview = (sessionId) => interviewsApi.post(`/complete/${sessionId}`).then(r => r.data);
