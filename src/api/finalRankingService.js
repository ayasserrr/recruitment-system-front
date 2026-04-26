import apiClient from './apiClient';

const normalizeCandidate = (c) => ({
  ...c,
  // Map API field names to what the component expects
  semantic: c.semanticScore ?? c.semantic ?? 0,
  technical: c.assessmentScore ?? c.technical ?? 0,
  techInterview: c.technicalScore ?? c.techInterview ?? 0,
  hrInterview: c.cultureFitScore ?? c.hrInterview ?? 0,
  final_score: c.overallScore ?? c.final_score ?? 0,
  // Derive status label from recommendation when not provided
  status: c.status || (
    c.recommendation === 'Top Candidate' ? 'Top Candidate' :
    c.recommendation === 'Strong Hire' ? 'Strong Candidate' :
    c.recommendation === 'Strong Runner-Up' ? 'Strong Candidate' :
    c.recommendation === 'Hire' ? 'Good Candidate' : 'Needs Review'
  ),
  strengths: c.strengths || [],
  concerns: c.concerns || [],
  interviewQuestions: c.interviewQuestions || [],
  notes: c.notes || '',
  genaiEvidence: c.genaiEvidence || null,
  experience: c.experience || '',
  education: c.education || '',
  skills: c.skills || [],
  matchedSkills: c.matchedSkills || [],
});

export const getFinalRanking = (jobId) =>
  apiClient
    .get(`/jobs/${jobId}/final-ranking`)
    .then((r) => {
      const list = Array.isArray(r.data) ? r.data : (r.data.results || []);
      return list.map(normalizeCandidate);
    });

export const shortlistCandidate = (jobId, candidateId, note = '') =>
  apiClient
    .post(`/jobs/${jobId}/final-ranking/${candidateId}/shortlist`, { note })
    .then((r) => r.data);

export const sendOffer = (jobId, candidateId, offerData) =>
  apiClient
    .post(`/jobs/${jobId}/final-ranking/${candidateId}/offer`, offerData)
    .then((r) => r.data);
