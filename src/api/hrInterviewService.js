import apiClient from './apiClient';

export const getHRInterview = (jobId) =>
  apiClient.get(`/jobs/${jobId}/hr-interview`).then((r) => r.data);

export const getHRInterviewCandidates = (jobId) =>
  apiClient.get(`/jobs/${jobId}/hr-interview/candidates`).then((r) => r.data);

export const scheduleHRInterview = (jobId, data) =>
  apiClient.post(`/jobs/${jobId}/hr-interview/schedule`, data).then((r) => r.data);

export const submitHRInterviewScores = (jobId, data) =>
  apiClient
    .post(`/jobs/${jobId}/hr-interview/submit-scores`, data)
    .then((r) => r.data);
