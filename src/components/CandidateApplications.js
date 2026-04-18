import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

// ── Status badge config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Applied: {
    badge: 'bg-blue-100 text-blue-700 border border-blue-200',
    label: 'Under Review',
    subText: 'Your application is being processed',
  },
  Shortlisted: {
    badge: 'bg-green-100 text-green-700 border border-green-200',
    label: 'Shortlisted ✓',
    subText: 'You passed the first screening. The next stage will be communicated soon.',
  },
  'Not Shortlisted': {
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    label: 'Not Progressed',
    subText: 'Thank you for applying. You were not selected to move forward at this time.',
  },
};

function ApplicationStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? {
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    label: status,
    subText: null,
  };

  return (
    <div>
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
        {config.label}
      </span>
      {config.subText && (
        <p className="mt-1 text-xs text-gray-500">{config.subText}</p>
      )}
    </div>
  );
}

// ── Loading spinner ────────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <svg className="w-10 h-10 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm text-gray-500">Loading your applications…</p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function CandidateApplications() {
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get('cid');
  const email = urlParams.get('email');

  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Endpoint: GET /api/v1/candidates/{candidate_id}/applications
      // or GET /api/v1/candidates/applications?email=...
      const endpoint = candidateId
        ? `/candidates/${candidateId}/applications`
        : `/candidates/applications?email=${encodeURIComponent(email ?? '')}`;

      const res = await api.get(endpoint);
      setApplications(Array.isArray(res.data) ? res.data : res.data?.applications ?? []);
    } catch (err) {
      console.error('[CandidateApplications] fetch error:', err);
      setErrorMsg('Could not load your applications. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [candidateId, email]);

  useEffect(() => {
    if (!candidateId && !email) {
      setErrorMsg('Missing candidate identifier. Please use the link sent to your email.');
      setIsLoading(false);
      return;
    }
    fetchApplications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1 text-sm">Track the status of your job applications</p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Empty state */}
        {!errorMsg && applications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700">No applications yet</p>
            <p className="mt-1 text-sm text-gray-500">Applications you submit will appear here.</p>
          </div>
        )}

        {/* Application cards */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.application_id ?? app.id}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {app.job_title ?? app.jobTitle ?? 'Position'}
                  </h2>
                  {app.company_name && (
                    <p className="text-sm text-gray-500 mt-0.5">{app.company_name}</p>
                  )}
                  {app.applied_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Applied on{' '}
                      {new Date(app.applied_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <ApplicationStatusBadge status={app.status} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Status updates are sent to your registered email address.
        </p>
      </div>
    </div>
  );
}
