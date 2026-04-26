import apiClient from './apiClient';

export const getTechnicalInterview = (jobId) =>
  apiClient.get(`/jobs/${jobId}/technical-interview`).then((r) => r.data);

export const getTechnicalInterviewCandidates = (jobId) =>
  apiClient.get(`/jobs/${jobId}/technical-interview/candidates`).then((r) => r.data);

export const scheduleTechnicalInterview = (jobId, data) =>
  apiClient.post(`/jobs/${jobId}/technical-interview/schedule`, data).then((r) => r.data);

export const submitTechnicalInterviewScores = (jobId, data) =>
  apiClient
    .post(`/jobs/${jobId}/technical-interview/submit-scores`, data)
    .then((r) => r.data);
