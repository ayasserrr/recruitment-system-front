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
