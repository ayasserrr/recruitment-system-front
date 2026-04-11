import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

export default function ApplyPage() {
  const [paramsError, setParamsError] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cvFile, setCvFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('cid');
    const jobId = params.get('jid');

    if (!companyId || !jobId) {
      setParamsError(true);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are accepted.');
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
      setErrorMsg('Please upload your CV as a PDF.');
      return;
    }

    // Re-read params directly at submit time — no reliance on state timing
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get('cid');
    const jobId = params.get('jid');

    if (!companyId || !jobId) {
      setErrorMsg('Application link is invalid. Missing company or job information.');
      return;
    }

    setIsSubmitting(true);
    try {
      // ── Step 1: Register candidate ────────────────────────────────────────
      const candidateRes = await api.post('/candidates', {
        full_name: fullName,
        email: email,
      });

      // Log full response so the exact shape is visible during debugging
      console.log('[ApplyPage] Step 1 response data:', candidateRes.data);

      // Support common key names the backend might use
      const responseData = candidateRes.data ?? {};
      const candidateId =
        responseData.candidate_id ??
        responseData.id ??
        responseData.candidateId ??
        null;

      if (!candidateId && candidateId !== 0) {
        console.error('[ApplyPage] Could not extract candidate_id from response:', responseData);
        throw new Error(
          `Server response did not include a candidate ID. ` +
          `Received keys: ${Object.keys(responseData).join(', ') || '(none)'}`
        );
      }

      console.log(
        `[ApplyPage] Step 2 – uploading CV to: /data/upload/${companyId}/${jobId}/${candidateId}`
      );

      // ── Step 2: Upload CV ─────────────────────────────────────────────────
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
      const detail = err.response?.data?.detail;
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

  // ── Invalid / missing params ──────────────────────────────────────────────
  if (paramsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Invalid Application Link</h2>
          <p className="text-gray-500">This link is missing required parameters. Please use the link provided in the job posting.</p>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
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
          <p className="text-gray-500 text-base">Thank you for applying. We have received your CV and will be in touch if your profile matches our requirements.</p>
        </div>
      </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Submit Your Application</h1>
          <p className="text-gray-500 mt-1 text-sm">Fill in your details and upload your CV to apply</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-5">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* CV Upload */}
            <div className="mb-6">
              <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-1">
                CV / Resume <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="cvFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">PDF format only. Max 10 MB.</p>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Your information is handled securely and only used for this application.
        </p>
      </div>
    </div>
  );
}
