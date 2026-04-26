import apiClient from './apiClient';

export const getAssessment = (jobId) =>
  apiClient.get(`/jobs/${jobId}/assessment`).then((r) => r.data);

export const getAssessmentCandidates = (jobId) =>
  apiClient.get(`/jobs/${jobId}/assessment/candidates`).then((r) => r.data);

export const sendAssessmentInvitations = (jobId, candidateIds) =>
  apiClient
    .post(`/jobs/${jobId}/assessment/send-invitations`, { candidateIds })
    .then((r) => r.data);
