import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api/v1' });

// ── Helpers ────────────────────────────────────────────────────────────────────

function getUrlParams() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const assessmentId = pathParts[1]; // /assessment/{id}
  const token = new URLSearchParams(window.location.search).get('token') || '';
  return { assessmentId, token };
}

function formatExpiry(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Build the submit answers array from the answers map
function buildAnswersPayload(questions, answers) {
  return questions.map(q => ({
    question_id: q.question_id,
    candidate_answer: String(answers[q.question_id] || '(skipped)'),
  }));
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Spinner({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <svg className="w-10 h-10 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-400 font-semibold text-lg mb-1">Unable to Load Assessment</p>
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
}

function GradingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <svg className="w-28 h-28 text-indigo-500/20 absolute inset-0" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" />
          </svg>
          <svg
            className="w-28 h-28 text-indigo-400 absolute inset-0 animate-spin"
            style={{ animationDuration: '2s' }}
            viewBox="0 0 100 100" fill="none"
          >
            <path d="M50 6 A44 44 0 0 1 94 50" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.097.038a2.25 2.25 0 001.59-.082l.05-.02a2.25 2.25 0 001.307-1.597l.068-.352a2.25 2.25 0 00-.95-2.382L17.5 6.5m-13 8l2.25-2.25m0 0L9 10m-2.25 2.25L9 14.5M17.5 6.5l-2.25 2.25M15.25 8.75L13 11m2.25-2.25L13 6.5" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">AI is grading your responses…</h2>
        <p className="text-gray-400 text-sm">Please keep this tab open. This only takes a moment.</p>
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/15 flex items-center justify-center ring-1 ring-green-500/30">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Assessment Complete</h1>
        <p className="text-gray-300 text-base leading-relaxed">
          Your technical performance has been recorded. Our team will review the AI insights and contact you.
        </p>
        <div className="mt-8 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-300 text-sm font-medium">AI Analysis in Progress</span>
        </div>
      </div>
    </div>
  );
}

function LinkExpiredScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/10 flex items-center justify-center ring-1 ring-orange-500/20">
          <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Assessment Link Expired</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Sorry, the deadline for this technical assessment has passed. It was available for 72 hours following your invitation.
        </p>
        <div className="mt-8 px-5 py-4 rounded-xl bg-gray-900 border border-gray-800 text-left">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">What happens next?</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            If you believe this is an error, please contact the recruiting team directly. They can review your situation and issue a new link if appropriate.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AssessmentPage() {
  const { assessmentId, token } = getUrlParams();

  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [expired, setExpired]               = useState(false);
  const [expiresAt, setExpiresAt]           = useState(null); // ISO string from API
  const [assessment, setAssessment]         = useState(null); // full response
  const [answers, setAnswers]               = useState({});   // { question_id: candidate_answer }
  const [currentIdx, setCurrentIdx]         = useState(0);
  const [timeLeft, setTimeLeft]             = useState(null); // seconds
  const [tabWarnings, setTabWarnings]       = useState(0);
  const [tabWarningVisible, setTabWarningVisible] = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [submitted, setSubmitted]           = useState(false);

  const timerRef        = useRef(null);
  const autoSaveRef     = useRef(null);
  const tabWarningsRef  = useRef(0);
  const answersRef      = useRef({});
  const submitCalledRef = useRef(false);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  // ── Fetch assessment ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!assessmentId || !token) {
      setError(!assessmentId ? 'No assessment ID in URL.' : 'No token found in URL. Please use the link from your invitation email.');
      setLoading(false);
      return;
    }
    api.get(`/assessment/${assessmentId}`, { params: { token } })
      .then(res => {
        const data = res.data;
        // Backend may signal expiry either as a status field or an explicit flag
        if (data.status === 'expired' || data.expired === true) {
          setExpired(true);
          setLoading(false);
          return;
        }
        setAssessment(data);
        setExpiresAt(data.expires_at ?? data.expiry_date ?? null);
        setTimeLeft((data.time_limit_minutes || 60) * 60);
        setLoading(false);
      })
      .catch(err => {
        const detail = err.response?.data?.detail;
        const code   = err.response?.data?.code;
        // Treat explicit ASSESSMENT_EXPIRED codes as the expired screen, not a generic error
        if (
          detail === 'ASSESSMENT_EXPIRED' ||
          code   === 'ASSESSMENT_EXPIRED' ||
          err.response?.status === 410
        ) {
          setExpired(true);
          setLoading(false);
          return;
        }
        setError(detail || 'Failed to load assessment. The link may be invalid or expired.');
        setLoading(false);
      });
  }, [assessmentId, token]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (auto = false) => {
    if (submitCalledRef.current) return;
    submitCalledRef.current = true;
    setSubmitting(true);
    clearInterval(timerRef.current);
    clearInterval(autoSaveRef.current);

    const questions = assessment?.questions || [];
    try {
      await api.post(`/assessment/${assessmentId}/submit`, {
        token,
        answers: buildAnswersPayload(questions, answersRef.current),
      });
    } catch (e) {
      // Always proceed to success — don't strand the candidate on a network blip
      console.error('[AssessmentPage] submit error', e);
    }
    setTimeout(() => setSubmitted(true), 2000);
  }, [assessmentId, token, assessment]);

  // ── Countdown timer (starts once timeLeft is initialised) ────────────────────
  useEffect(() => {
    if (timeLeft === null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft !== null]);

  // ── Auto-save every 60 s ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!assessmentId || loading || !token) return;
    autoSaveRef.current = setInterval(() => {
      const questions = assessment?.questions || [];
      api.patch(`/assessment/${assessmentId}/answers`, {
        token,
        answers: buildAnswersPayload(questions, answersRef.current),
      }).catch(() => {});
    }, 60000);
    return () => clearInterval(autoSaveRef.current);
  }, [assessmentId, token, loading, assessment]);

  // ── Tab-switch guard ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        tabWarningsRef.current += 1;
        setTabWarnings(tabWarningsRef.current);
        setTabWarningVisible(true);
        if (tabWarningsRef.current >= 3) handleSubmit(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [handleSubmit]);

  // ── Input protection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const block = e => e.preventDefault();
    const blockKeys = e => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'a'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    document.addEventListener('copy', block);
    document.addEventListener('paste', block);
    document.addEventListener('contextmenu', block);
    document.addEventListener('keydown', blockKeys);
    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('paste', block);
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);

  // ── Render guards ────────────────────────────────────────────────────────────
  if (loading)               return <Spinner message="Loading assessment…" />;
  if (expired)               return <LinkExpiredScreen />;
  if (error)                 return <ErrorScreen message={error} />;
  if (submitting && !submitted) return <GradingScreen />;
  if (submitted)             return <SuccessScreen />;

  // ── Exam UI ──────────────────────────────────────────────────────────────────
  const questions   = assessment?.questions || [];
  const currentQ    = questions[currentIdx];
  const isAnswered  = q => { const a = answers[q.question_id]; return a !== undefined && String(a).trim() !== ''; };
  const answeredCnt = questions.filter(isAnswered).length;
  const critical    = timeLeft !== null && timeLeft < 300;

  const confirmSubmit = () => {
    if (window.confirm('Submit exam now? You cannot change answers after submitting.')) handleSubmit(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col" style={{ userSelect: 'none' }}>

      {/* ── Tab-switch warning overlay ─────────────────────────────────────────── */}
      {tabWarningVisible && tabWarnings < 3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="bg-gray-900 border border-yellow-500/40 rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center ring-1 ring-yellow-500/20">
              <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-yellow-400 mb-1">
              Tab-Switch Warning {tabWarnings} / 3
            </h3>
            <p className="text-gray-300 text-sm mb-2">Leaving the exam tab is not allowed.</p>
            {tabWarnings === 2 && (
              <p className="text-red-400 text-xs font-semibold mb-1">
                One more violation will auto-submit your exam.
              </p>
            )}
            <button
              onClick={() => setTabWarningVisible(false)}
              className="mt-4 px-6 py-2 rounded-lg bg-yellow-500 text-gray-900 font-semibold text-sm hover:bg-yellow-400 transition-colors"
            >
              Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur border-b border-gray-800">
        {expiresAt && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-1.5">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-300 text-xs font-medium">
                This assessment will expire on <span className="font-semibold text-amber-200">{formatExpiry(expiresAt)}</span>
              </p>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-white font-bold text-base leading-tight truncate">
              {assessment?.title || 'Technical Assessment'}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              {answeredCnt} / {questions.length} answered
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-base shrink-0 border transition-colors ${
            critical
              ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
              : 'bg-gray-800 text-gray-100 border-gray-700'
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </div>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-5">

        {/* Sidebar navigator */}
        <aside className="w-52 shrink-0 hidden md:block">
          <div className="sticky top-24 bg-gray-900 rounded-2xl border border-gray-800 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigator</p>
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {questions.map((q, i) => (
                <button
                  key={q.question_id}
                  onClick={() => setCurrentIdx(i)}
                  title={`Question ${i + 1}${isAnswered(q) ? ' (answered)' : ''}`}
                  className={`h-9 w-full rounded-lg text-xs font-bold transition-all focus:outline-none ${
                    i === currentIdx
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/50'
                      : isAnswered(q)
                      ? 'bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-800 pt-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-500 shrink-0" /> Current
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30 shrink-0" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gray-800 shrink-0" /> Pending
              </div>
            </div>

            <button
              onClick={confirmSubmit}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/15"
            >
              Submit Exam
            </button>
          </div>
        </aside>

        {/* Question panel */}
        <main className="flex-1 min-w-0">
          {currentQ ? (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 md:p-8">

              {/* Question meta */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 text-sm font-bold flex items-center justify-center border border-indigo-500/25 shrink-0">
                  {currentIdx + 1}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  currentQ.question_type === 'mcq'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }`}>
                  {currentQ.question_type === 'mcq' ? 'Multiple Choice' : 'Open Ended'}
                </span>
                {currentQ.points != null && (
                  <span className="text-xs text-gray-600 ml-auto shrink-0">
                    {currentQ.points} {currentQ.points === 1 ? 'pt' : 'pts'}
                  </span>
                )}
              </div>

              {/* Question text */}
              <p
                className="text-white text-base md:text-lg font-medium leading-relaxed mb-8"
                style={{ userSelect: 'text' }}
              >
                {currentQ.question_text}
              </p>

              {/* MCQ options */}
              {currentQ.question_type === 'mcq' && (
                <div className="space-y-3">
                  {(currentQ.options || []).map((opt, oi) => {
                    // Options arrive as strings like "A) Some text" — use first char as value
                    const val = opt.charAt(0);
                    const sel = answers[currentQ.question_id] === val;
                    return (
                      <label
                        key={oi}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          sel
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-gray-700 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q_${currentQ.question_id}`}
                          value={val}
                          checked={sel}
                          onChange={() => setAnswers(prev => ({ ...prev, [currentQ.question_id]: val }))}
                          className="accent-indigo-500 w-4 h-4 shrink-0"
                        />
                        <span className={`text-sm font-medium leading-snug ${sel ? 'text-indigo-200' : 'text-gray-300'}`}>
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Open-ended textarea */}
              {currentQ.question_type !== 'mcq' && (
                <textarea
                  lang={assessment?.assessment_language || 'en'}
                  className="w-full min-h-52 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-y transition-colors leading-relaxed"
                  placeholder="Write your answer here…"
                  value={answers[currentQ.question_id] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [currentQ.question_id]: e.target.value }))}
                  style={{ userSelect: 'text' }}
                />
              )}

              {/* Prev / Next navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
                <button
                  onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <span className="text-xs text-gray-600 tabular-nums">
                  {currentIdx + 1} / {questions.length}
                </span>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={confirmSubmit}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Submit
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-10 text-center text-gray-500">
              No questions found for this assessment.
            </div>
          )}

          {/* Mobile submit */}
          <div className="md:hidden mt-4">
            <button
              onClick={confirmSubmit}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/15"
            >
              Submit Exam
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
