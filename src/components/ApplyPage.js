import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

// ── Date formatter ─────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ── Loading spinner ───────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <svg className="w-10 h-10 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm text-gray-500">Loading job details…</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const params = new URLSearchParams(window.location.search);
  const companyId = params.get('cid');
  const jobId = params.get('jid');

  // Job meta — sourced exclusively from the server
  const [isLoading, setIsLoading] = useState(true);
  const [paramsError, setParamsError] = useState(false);
  const [isOpen, setIsOpen] = useState(null);          // null = not yet fetched
  const [deadline, setDeadline] = useState(null);      // cv_collection_end_date
  const [postingStartDate, setPostingStartDate] = useState(null);
  const [jobTitle, setJobTitle] = useState('');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [cvFile, setCvFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ── Fetch job ──────────────────────────────────────────────────────────────
  const fetchJob = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/jobs/${jobId}`);
      const data = res.data ?? {};
      setIsOpen(data.is_open === true);
      setDeadline(data.cv_collection_end_date ?? null);
      setPostingStartDate(data.posting_start_date ?? null);
      setJobTitle(data.job_title ?? '');
    } catch (err) {
      console.error('[ApplyPage] Failed to fetch job:', err);
      setErrorMsg('Could not load job details. Please try again later.');
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!companyId || !jobId) {
      setParamsError(true);
      setIsLoading(false);
      return;
    }
    fetchJob();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derive button state from dates ────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const notOpenYet = postingStartDate && today < postingStartDate;
  const isClosed   = deadline && today >= deadline;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const ALLOWED_TYPES = ['application/pdf', 'text/plain'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.txt'];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const typeOk = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
    if (!typeOk) {
      setErrorMsg('Only PDF or TXT files are accepted.');
      setCvFile(null);
      e.target.value = '';
      return;
    }
    setErrorMsg('');
    setCvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cvFile) {
      setErrorMsg('Please upload your CV (PDF or TXT).');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Register candidate
      const candidateRes = await api.post('/candidates/register', {
        firstName,
        email,
        requisitionId: Number(jobId),
      });

      const responseData = candidateRes.data ?? {};
      const candidateId =
        responseData.candidate_id ??
        responseData.id ??
        responseData.candidateId ??
        null;

      if (!candidateId && candidateId !== 0) {
        throw new Error(
          `Server response did not include a candidate ID. ` +
          `Received keys: ${Object.keys(responseData).join(', ') || '(none)'}`
        );
      }

      // Step 2: Upload CV
      const formData = new FormData();
      formData.append('file', cvFile);

      await api.post(
        `/data/upload/${companyId}/${jobId}/${candidateId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSubmitted(true);
    } catch (err) {
      console.error('[ApplyPage] Submission error:', err);

      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      const signal = err.response?.data?.signal;

      if (status === 403 && detail === 'NOT_YET_OPEN') {
        // Re-fetch to sync server state, which will update button state
        fetchJob();
        setErrorMsg('This job is not accepting applications yet.');
        return;
      }

      if (status === 403 && detail === 'APPLICATION_CLOSED') {
        fetchJob();
        setErrorMsg('The application deadline for this position has passed.');
        return;
      }

      if (status === 409) {
        setErrorMsg('You have already applied for this position.');
        return;
      }

      if (status === 400 && (signal === 'FILE_TYPE_NOT_ALLOWED' || detail === 'FILE_TYPE_NOT_ALLOWED')) {
        setErrorMsg('Only PDF or TXT files are accepted.');
        return;
      }

      if (status === 400 && (signal === 'FILE_SIZE_EXCEEDS_LIMIT' || detail === 'FILE_SIZE_EXCEEDS_LIMIT')) {
        setErrorMsg('Your file is too large. Please upload a smaller file.');
        return;
      }

      if (Array.isArray(detail)) {
        setErrorMsg(detail.map((d) => d.msg || d).join(', '));
      } else if (typeof detail === 'string') {
        setErrorMsg(detail);
      } else if (err.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render guards ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingSpinner />;

  if (paramsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Application Link</h2>
          <p className="text-gray-500">
            This link is missing required parameters. Please use the link provided in the job posting.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Application Submitted Successfully!</h2>
          <p className="text-gray-500 text-base">
            Your CV has been submitted. You will hear from us soon.
          </p>
        </div>
      </div>
    );
  }

  // ── Derive submit button appearance ──────────────────────────────────────
  // notOpenYet / isClosed / open — driven by client-side date math + server is_open
  const buttonDisabled = isSubmitting || Boolean(notOpenYet) || Boolean(isClosed) || isOpen === false;

  let buttonStatusText = null;
  if (notOpenYet) {
    buttonStatusText = (
      <p className="mt-2 text-sm text-gray-500 text-center">
        Applications open on{' '}
        <span className="font-medium text-gray-700">{formatDate(postingStartDate)}</span>
      </p>
    );
  } else if (isClosed || isOpen === false) {
    buttonStatusText = (
      <p className="mt-2 text-sm text-gray-500 text-center">
        Applications closed on{' '}
        <span className="font-medium text-gray-700">{formatDate(deadline)}</span>
      </p>
    );
  } else if (deadline) {
    buttonStatusText = (
      <p className="mt-2 text-sm text-green-600 text-center">
        Apply before{' '}
        <span className="font-medium">{formatDate(deadline)}</span>
      </p>
    );
  }

  // ── Application form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {jobTitle ? jobTitle : 'Submit Your Application'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Fill in your details and upload your CV to apply</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* First Name */}
            <div className="mb-5">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. John"
                disabled={buttonDisabled && !isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                disabled={buttonDisabled && !isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* CV Upload */}
            <div className="mb-6">
              <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-1">
                CV / Resume <span className="text-red-500">*</span>
              </label>
              <input
                id="cvFile"
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileChange}
                disabled={buttonDisabled && !isSubmitting}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-400">PDF or TXT format. Max 10 MB.</p>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit button — three states */}
            {notOpenYet || (isOpen === false && isClosed !== true) ? (
              /* State 1: Not open yet */
              <button
                type="button"
                disabled
                className="w-full py-3 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg text-sm cursor-not-allowed flex items-center justify-center"
              >
                Submit Application
              </button>
            ) : isClosed || isOpen === false ? (
              /* State 3: Closed */
              <button
                type="button"
                disabled
                className="w-full py-3 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg text-sm cursor-not-allowed flex items-center justify-center"
              >
                Submit Application
              </button>
            ) : (
              /* State 2: Open */
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}

            {/* Date context text below the button */}
            {buttonStatusText}
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your information is handled securely and only used for this application.
        </p>
      </div>
    </div>
  );
}
