import apiClient from './apiClient';

const normalizeJob = (j) => ({
  ...j,
  newToday: j.newToday ?? 0,
  requiredSkills: j.requiredSkills || j.required_skills || [],
  preferredSkills: j.preferredSkills || j.preferred_skills || [],
  requisition: {
    selectedPlatforms: j.selectedPlatforms || [],
    postingStartDate: j.postingStartDate || '',
    postingEndDate: j.postingEndDate || '',
    assessmentCandidatesToAdvance: j.assessmentCandidatesToAdvance,
    technicalInterviewCandidatesToAdvance: j.technicalInterviewCandidatesToAdvance,
    hrInterviewCandidatesToAdvance: j.hrInterviewCandidatesToAdvance,
    technicalInterviewDuration: j.technicalInterviewDuration,
    hrInterviewDuration: j.hrInterviewDuration,
    requiredSkills: j.requiredSkills || j.required_skills || [],
  },
});

export const getJobs = (page = 1, pageSize = 50) =>
  apiClient
    .get('/jobs', { params: { page, page_size: pageSize } })
    .then((r) => {
      const raw = r.data;
      const list = Array.isArray(raw) ? raw : (raw.results || []);
      return list.map(normalizeJob);
    });

export const getJob = (id) =>
  apiClient.get(`/jobs/${id}`).then((r) => normalizeJob(r.data));

export const updateJob = (id, patch) =>
  apiClient.patch(`/jobs/${id}`, patch).then((r) => r.data);

export const deleteJob = (id) => apiClient.delete(`/jobs/${id}`);

export const getPipelineStages = (jobId) =>
  apiClient.get(`/jobs/${jobId}/pipeline`).then((r) => r.data);

// Public job endpoints
export const getPublicJob = (jobId) => {
  const api = require('./apiClient').default;
  // Create instance without auth for public endpoint
  const publicApi = api.create({
    baseURL: api.defaults.baseURL,
    headers: { 'Content-Type': 'application/json' },
  });
  return publicApi.get(`/public/jobs/${jobId}`).then((r) => r.data);
};

// Candidate application endpoints
export const submitApplication = (jobId, formData) => {
  const api = require('axios');
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Create instance without auth and with multipart/form-data
  const applicationApi = api.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return applicationApi.post(`/apply/${jobId}`, formData).then((r) => r.data);
};

export const getCandidateApplications = (email) => {
  const api = require('axios');
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const publicApi = api.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
  });

  return publicApi.get('/candidates/my-applications', { params: { email } }).then((r) => r.data);
};

// Candidate registration
export const registerCandidate = (candidateData) => {
  const api = require('axios');
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const publicApi = api.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
  });

  return publicApi.post('/candidates/register', candidateData).then((r) => r.data);
};
