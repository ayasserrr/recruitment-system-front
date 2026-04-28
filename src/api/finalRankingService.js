import apiClient from './apiClient';

export const getFinalRanking = (jobId) =>
  apiClient
    .get(`/jobs/${jobId}/final-ranking`)
    .then((r) => {
      const list = Array.isArray(r.data) ? r.data : (r.data.results || []);
      return list.map((c) => ({
        ...c,
        // Safe defaults for optional array / object fields
        skills:            c.skills            || [],
        projects:          c.projects          || [],
        strengths:         c.strengths         || [],
        concerns:          c.concerns          || [],
        interviewQuestions:c.interviewQuestions|| [],
        matchedSkills:     c.matchedSkills     || [],
        notes:             c.notes             || '',
        genaiEvidence:     c.genaiEvidence     || null,
        // Guarantee red-flag fields exist (never undefined)
        redFlag:           c.redFlag           ?? false,
        redFlagReason:     c.redFlagReason     ?? null,
        shapSummary:       c.shapSummary       ?? null,
        // Stage scores — all 0-100, straight from the DB (DO NOT re-weight here)
        semanticScore:     c.semanticScore     ?? null,
        assessmentScore:   c.assessmentScore   ?? null,
        technicalScore:    c.technicalScore    ?? null,
        hrScore:           c.hrScore           ?? null,
        overallScore:      c.overallScore      ?? 0,
      }));
    });

export const triggerRanking = (jobId) =>
  apiClient
    .post(`/jobs/${jobId}/trigger-ranking`)
    .then((r) => r.data);

export const getSHAPReport = (jobId, candidateId) =>
  apiClient
    .get(`/jobs/${jobId}/final-ranking/${candidateId}/shap-report`)
    .then((r) => r.data);

export const shortlistCandidate = (jobId, candidateId, note = '') =>
  apiClient
    .post(`/jobs/${jobId}/final-ranking/${candidateId}/shortlist`, { note })
    .then((r) => r.data);

export const sendOffer = (jobId, candidateId, offerData) =>
  apiClient
    .post(`/jobs/${jobId}/final-ranking/${candidateId}/offer`, offerData)
    .then((r) => r.data);
