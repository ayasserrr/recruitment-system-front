import apiClient from './apiClient';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Assessment endpoints require token as query parameter, not Bearer header
export const getAssessment = (jobId) =>
  apiClient.get(`/jobs/${jobId}/assessment`).then((r) => r.data);

export const getAssessmentCandidates = (jobId) =>
  apiClient.get(`/jobs/${jobId}/assessment/candidates`).then((r) => r.data);

export const sendAssessmentInvitations = (jobId, candidateIds) =>
  apiClient
    .post(`/jobs/${jobId}/assessment/send-invitations`, { candidateIds })
    .then((r) => r.data);

// Assessment endpoints for candidates (use token query param)
export const getCandidateAssessment = (assessmentId, token) => {
  const api = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
  });
  return api.get(`/assessment/${assessmentId}?token=${token}`).then(r => r.data);
};

export const submitAssessment = (assessmentId, token, answers) => {
  const api = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
  });
  return api.post(`/assessment/${assessmentId}/submit`, {
    token,
    answers
  }).then(r => r.data);
};
