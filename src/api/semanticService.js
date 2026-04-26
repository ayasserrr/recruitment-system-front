import apiClient from './apiClient';

export const getSemanticData = (jobId) =>
  apiClient.get(`/jobs/${jobId}/semantic`).then((r) => r.data);

export const runSemanticAnalysis = (jobId) =>
  apiClient.post(`/jobs/${jobId}/semantic/run`).then((r) => r.data);

export const getSemanticStatus = (jobId) =>
  apiClient.get(`/jobs/${jobId}/semantic/status`).then((r) => r.data);
