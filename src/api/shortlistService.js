import apiClient from './apiClient';

const normalizeEntry = (e) => ({
  ...e,
  id: e.id,
  candidateId: e.candidate_id ?? e.candidateId ?? e.id,
  name: e.name || '',
  email: e.email || '',
  phone: e.phone || '',
  score: e.score ?? 0,
  match: e.match || '',
  skills: e.skills || [],
  experience: e.experience || '',
  education: e.education || '',
  summary: e.summary || '',
  projects: e.projects || [],
  shortlistedFrom: e.shortlisted_from ?? e.shortlistedFrom ?? '',
  shortlistedDate: e.shortlisted_date ?? e.shortlistedDate ?? '',
  shortlistNote: e.shortlist_note ?? e.shortlistNote ?? '',
  jobTitle: e.job_title ?? e.jobTitle ?? '',
  jobId: e.job_id ?? e.jobId ?? null,
});

export const getShortlist = (page = 1, pageSize = 50, jobId = null) => {
  const params = { page, page_size: pageSize };
  if (jobId) params.job_id = jobId;
  return apiClient
    .get('/shortlist', { params })
    .then((r) => {
      const list = Array.isArray(r.data) ? r.data : (r.data.results || []);
      return list.map(normalizeEntry);
    });
};

export const addToShortlist = (data) => {
  // Transform camelCase to snake_case for backend
  const backendData = {
    job_id: data.jobId || data.job_id,
    candidate_id: data.candidateId || data.candidate_id,
    shortlisted_from: data.shortlistedFrom || data.shortlisted_from,
    note: data.note
  };
  return apiClient.post('/shortlist', backendData).then((r) => r.data);
};

export const removeFromShortlist = (candidateId, jobId = null) => {
  const params = jobId ? { job_id: jobId } : {};
  return apiClient.delete(`/shortlist/${candidateId}`, { params });
};
