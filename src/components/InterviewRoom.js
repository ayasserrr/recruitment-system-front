import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import {
  Mic, MicOff, PhoneOff, Clock, AlertTriangle, CheckCircle2,
  Brain, Loader2, RefreshCw, Settings, ChevronRight, Volume2,
  TrendingUp, Award, ShieldAlert,
} from 'lucide-react';
import * as interviewApi from '../api/interviewService';

// ── Constants ─────────────────────────────────────────────────────────────────

const PERSONAS = ['elite', 'focused', 'bilingual'];
const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function getRecommendationStyle(rec) {
  const l = (rec || '').toLowerCase();
  if (l.includes('final') || l.includes('hire') || l.includes('proceed'))
    return { ring: 'ring-green-500/50', bg: 'bg-green-500/15', text: 'text-green-400' };
  if (l.includes('consider') || l.includes('review') || l.includes('hold'))
    return { ring: 'ring-amber-500/50', bg: 'bg-amber-500/15', text: 'text-amber-400' };
  return { ring: 'ring-red-500/50', bg: 'bg-red-500/15', text: 'text-red-400' };
}

// ── Radar Chart (pure SVG, 4-axis) ────────────────────────────────────────────

function RadarChart({ scores }) {
  const {
    cv_semantic_score = 0,
    interview_overall_score = 0,
    depth_boost = 0,
    centroid_math_score = 0,
  } = scores;

  // Normalise all values to 0–1
  const axes = [
    { label: 'CV Score', sub: `${cv_semantic_score.toFixed(0)}`, value: cv_semantic_score / 100 },
    { label: 'Interview', sub: `${interview_overall_score.toFixed(0)}`, value: interview_overall_score / 100 },
    { label: 'Depth', sub: `${(depth_boost * 100).toFixed(0)}%`, value: depth_boost },
    { label: 'Centroid', sub: `${(centroid_math_score * 100).toFixed(0)}%`, value: centroid_math_score },
  ];

  const N = axes.length;
  const cx = 140, cy = 140, r = 85;

  const angle = (i) => (2 * Math.PI * i / N) - Math.PI / 2;
  const toXY = (val, i) => ({
    x: cx + val * r * Math.cos(angle(i)),
    y: cy + val * r * Math.sin(angle(i)),
  });
  const toPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  const dataPoints = axes.map((a, i) => toXY(a.value, i));

  // Dynamic text-anchor for axis labels
  const textAnchorFor = (i) => {
    const cos = Math.cos(angle(i));
    if (cos > 0.3) return 'start';
    if (cos < -0.3) return 'end';
    return 'middle';
  };

  return (
    <svg viewBox="0 0 280 280" className="w-full max-w-xs">
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map(l => (
        <path
          key={l}
          d={toPath(axes.map((_, i) => toXY(l, i)))}
          fill="none"
          stroke={l === 1 ? 'rgba(146,187,232,0.35)' : 'rgba(146,187,232,0.12)'}
          strokeWidth="1"
        />
      ))}
      {/* Spokes */}
      {axes.map((_, i) => {
        const end = toXY(1, i);
        return (
          <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="rgba(146,187,232,0.2)" strokeWidth="1" />
        );
      })}
      {/* Data polygon */}
      <path
        d={toPath(dataPoints)}
        fill="rgba(146,187,232,0.22)"
        stroke="#92BBE8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5"
          fill="#92BBE8" stroke="#0f172a" strokeWidth="2" />
      ))}
      {/* Labels */}
      {axes.map((a, i) => {
        const pos = toXY(1.38, i);
        return (
          <g key={i}>
            <text x={pos.x} y={pos.y - 7} textAnchor={textAnchorFor(i)}
              fontSize="11" fill="#94a3b8" fontFamily="Inter,system-ui,sans-serif">
              {a.label}
            </text>
            <text x={pos.x} y={pos.y + 7} textAnchor={textAnchorFor(i)}
              fontSize="11" fill="#92BBE8" fontWeight="700" fontFamily="Inter,system-ui,sans-serif">
              {a.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Mic volume meter ──────────────────────────────────────────────────────────

function MicMeter() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState('pending'); // pending | ok | denied

  useEffect(() => {
    let stream, audioCtx, frame;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(s => {
        stream = s;
        setStatus('ok');
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = audioCtx.createMediaStreamSource(s);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        src.connect(analyser);
        const buf = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(buf);
          const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
          setLevel(Math.min(100, avg * 2.8));
          frame = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => setStatus('denied'));

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (audioCtx?.state !== 'closed') audioCtx?.close().catch(() => {});
    };
  }, []);

  if (status === 'pending') return (
    <div className="flex items-center gap-2 text-slate-400 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" />
      Requesting mic access…
    </div>
  );

  if (status === 'denied') return (
    <div className="flex items-center gap-2 text-red-400 text-sm">
      <MicOff className="w-4 h-4" />
      Mic access denied — allow it in your browser and refresh
    </div>
  );

  const BARS = 14;
  return (
    <div className="flex items-center gap-3">
      <Mic className="w-4 h-4 text-green-400 flex-shrink-0" />
      <div className="flex items-end gap-0.5 h-7">
        {Array.from({ length: BARS }, (_, i) => {
          const threshold = (i / BARS) * 100;
          const active = level > threshold;
          const color = active
            ? level > 70 ? 'bg-red-400' : level > 35 ? 'bg-yellow-400' : 'bg-green-400'
            : 'bg-slate-700';
          return (
            <div
              key={i}
              className={`w-2 rounded-sm transition-all duration-75 ${color}`}
              style={{ height: `${25 + (i / BARS) * 75}%` }}
            />
          );
        })}
      </div>
      <span className="text-xs text-slate-500">Mic active</span>
    </div>
  );
}

// ── InterviewUI — must be a child of <LiveKitRoom> ────────────────────────────

function InterviewUI({ roomName, statusData, elapsed, onLeave }) {
  const { room } = useRoomContext();
  const participants = useParticipants();
  const agentPresent = statusData
    ? statusData.is_agent_present
    : participants.filter(p => !p.isLocal).length > 0;

  function handleLeave() {
    room.disconnect();
    onLeave();
  }

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      {/* Audio from the room (plays AI agent voice) */}
      <RoomAudioRenderer />

      {/* Agent-waiting banner */}
      {!agentPresent && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          Waiting for AI Interviewer to join the room…
        </div>
      )}

      {/* Centre: agent avatar + timer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Animated agent circle */}
        <div className={`relative flex items-center justify-center w-36 h-36 rounded-full transition-all duration-700 ${
          agentPresent
            ? 'bg-accent-500/15 ring-2 ring-accent-500/60 shadow-[0_0_40px_rgba(146,187,232,0.25)]'
            : 'bg-slate-800 ring-2 ring-slate-700'
        }`}>
          {agentPresent && (
            <>
              <div className="absolute inset-0 rounded-full ring-2 ring-accent-500/20 animate-ping" />
              <div className="absolute inset-3 rounded-full ring-1 ring-accent-500/15 animate-pulse" />
            </>
          )}
          <Brain className={`w-16 h-16 transition-colors duration-500 ${
            agentPresent ? 'text-accent-400' : 'text-slate-600'
          }`} />
        </div>

        <div className="text-center space-y-1.5">
          <p className={`text-lg font-semibold transition-colors ${agentPresent ? 'text-white' : 'text-slate-500'}`}>
            {agentPresent ? 'AI Interviewer Active' : 'Connecting…'}
          </p>
          <p className="text-xs text-slate-600 font-mono">{roomName}</p>
        </div>

        {/* Live timer */}
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-full">
          <Clock className="w-4 h-4 text-accent-400" />
          <span className="font-mono text-2xl text-white tracking-widest tabular-nums">
            {formatTime(elapsed)}
          </span>
        </div>
      </div>

      {/* Participant count */}
      {statusData && (
        <div className="text-center text-xs text-slate-600">
          {statusData.participant_count} participant{statusData.participant_count !== 1 ? 's' : ''} in room
        </div>
      )}

      {/* Leave button */}
      <button
        onClick={handleLeave}
        className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 text-red-400 font-medium rounded-xl transition-all"
      >
        <PhoneOff className="w-5 h-5" />
        Leave Interview
      </button>
    </div>
  );
}

// ── Results View ──────────────────────────────────────────────────────────────

function ResultsView({ results }) {
  const { candidate_name, job_title, hr_card, scores, red_flag, red_flag_reason } = results;
  const recStyle = getRecommendationStyle(hr_card?.recommendation);

  const scoreRows = [
    { label: 'CV Semantic Score', value: scores.cv_semantic_score, max: 100 },
    { label: 'Interview Score', value: scores.interview_overall_score, max: 100 },
    { label: 'Centroid Match', value: scores.centroid_math_score * 100, max: 100 },
    { label: 'Depth Boost', value: scores.depth_boost * 100, max: 100 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-green-500/15 text-green-400 border border-green-500/25 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Interview Completed
          </div>
          <h1 className="text-3xl font-bold">{candidate_name}</h1>
          <p className="text-slate-400">{job_title}</p>
        </div>

        {/* Red-flag banner */}
        {red_flag && (
          <div className="flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/35 rounded-2xl">
            <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-1">Red Flag Detected</p>
              <p className="text-sm text-red-300/80 leading-relaxed">{red_flag_reason}</p>
            </div>
          </div>
        )}

        {/* Scores row: radar + breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col items-center gap-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Performance Profile</h3>
            <RadarChart scores={scores} />
          </div>

          {/* Score breakdown */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Score Breakdown</h3>
            {scoreRows.map(({ label, value, max }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-accent-400 font-semibold tabular-nums">
                    {value.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-700 to-accent-400 transition-all duration-700"
                    style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Combined Score</span>
              <span className="text-3xl font-bold text-accent-300 tabular-nums">
                {scores.combined_score.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* HR card */}
        {hr_card && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-400" />
                <h3 className="font-semibold text-white">HR Assessment</h3>
              </div>
              {/* Recommendation badge */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ring-1 ${recStyle.ring} ${recStyle.bg}`}>
                <CheckCircle2 className={`w-4 h-4 ${recStyle.text}`} />
                <span className={`text-sm font-semibold ${recStyle.text}`}>
                  {hr_card.recommendation}
                </span>
              </div>
            </div>

            {/* Pool rank */}
            {hr_card.rank_in_pool != null && (
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">Pool rank:</span>
                <span className="text-white font-bold text-lg">#{hr_card.rank_in_pool}</span>
              </div>
            )}

            {/* Strengths */}
            {hr_card.strengths?.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2.5">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {hr_card.strengths.map(s => (
                    <span key={s} className="text-sm px-3 py-1 bg-green-500/12 text-green-400 border border-green-500/25 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gaps */}
            {hr_card.gaps?.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2.5">Knowledge Gaps</p>
                <div className="flex flex-wrap gap-2">
                  {hr_card.gaps.map(g => (
                    <span key={g} className="text-sm px-3 py-1 bg-amber-500/12 text-amber-400 border border-amber-500/25 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {hr_card.explanation_text && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2.5">Evaluator Notes</p>
                <p className="text-slate-300 text-sm leading-relaxed">{hr_card.explanation_text}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Pre-interview screen ──────────────────────────────────────────────────────

function PreInterviewScreen({ language, persona, countdown, onLanguageChange, onPersonaChange, onStart }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">

        {/* Logo + heading */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700">
              <img src="/light.png" alt="HireTechAI" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Interview Preparation</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your AI interviewer is ready. Check your microphone, choose your language, then start.
          </p>
        </div>

        {/* Settings card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl divide-y divide-slate-700">
          {/* Language */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Interview Language
            </p>
            <div className="flex rounded-xl overflow-hidden border border-slate-600">
              {[{ v: 'en', l: 'English' }, { v: 'ar', l: 'العربية' }].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => onLanguageChange(opt.v)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    language === opt.v
                      ? 'bg-accent-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Mic check */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Microphone Check
            </p>
            <MicMeter />
          </div>

          {/* Persona (internal) */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Interviewer Persona
            </p>
            <div className="flex gap-2">
              {PERSONAS.map(p => (
                <button
                  key={p}
                  onClick={() => onPersonaChange(p)}
                  className={`flex-1 py-1.5 text-xs font-medium capitalize rounded-lg border transition-colors ${
                    persona === p
                      ? 'bg-accent-500/20 border-accent-500/50 text-accent-400'
                      : 'border-slate-700 text-slate-600 hover:text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Countdown + start button */}
        <div className="space-y-3">
          {countdown > 0 ? (
            <p className="text-center text-sm text-slate-500">
              Auto-starting in{' '}
              <span className="text-accent-400 font-bold">{countdown}s</span>
            </p>
          ) : (
            <p className="text-center text-sm text-slate-500">Ready when you are</p>
          )}
          <button
            onClick={onStart}
            className="w-full py-4 flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white font-semibold text-lg rounded-2xl transition-colors shadow-[0_0_24px_rgba(146,187,232,0.2)]"
          >
            Start Interview
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function InterviewRoom() {
  const params = new URLSearchParams(window.location.search);
  const requisitionId = Number(params.get('requisition_id'));
  const candidateId = Number(params.get('candidate_id'));

  // ── State ────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('pre-interview');
  // pre-interview | starting | in-room | processing | results | error

  const [language, setLanguage] = useState('en');
  const [persona, setPersona] = useState('elite');
  const [countdown, setCountdown] = useState(10);

  const [session, setSession] = useState(null);
  // { session_id, room_name, access_token, livekit_url }

  const [statusData, setStatusData] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null); // { message, canRetry }

  // Refs for stable access inside callbacks
  const sessionRef = useRef(null);
  const phaseRef = useRef('pre-interview');
  const pollingRef = useRef(null);
  const elapsedRef = useRef(0);

  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // ── Pre-interview countdown ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'pre-interview' || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Countdown hits 0 → auto-start
  useEffect(() => {
    if (phase === 'pre-interview' && countdown === 0) {
      handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // ── Local elapsed timer (1-sec tick, synced from poll) ───────────────────
  useEffect(() => {
    if (phase !== 'in-room') return;
    const t = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // ── Status polling ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'in-room' || !session?.room_name) return;

    const doPoll = async () => {
      try {
        const status = await interviewApi.getInterviewStatus(session.room_name);
        setStatusData(status);
        // Sync elapsed from server (authoritative)
        if (status.elapsed_seconds != null) {
          elapsedRef.current = status.elapsed_seconds;
          setElapsed(status.elapsed_seconds);
        }
        if (status.status === 'Completed') {
          stopPolling();
          triggerCompletion();
        } else if (status.status === 'Failed') {
          stopPolling();
          recoverFromCrash();
        }
      } catch {
        // silent — don't interrupt the interview on a failed poll
      }
    };

    doPoll();
    pollingRef.current = setInterval(doPoll, 5000);
    return stopPolling;
  }, [phase, session]);

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  // ── Start interview ───────────────────────────────────────────────────────
  async function handleStart() {
    setPhase('starting');
    try {
      const resp = await interviewApi.startInterview({
        requisition_id: requisitionId,
        candidate_id: candidateId,
        language,
        mode: 'technical',
        persona,
      });
      elapsedRef.current = 0;
      setElapsed(0);
      setSession({
        session_id: resp.session_id,
        room_name: resp.room_name,
        access_token: resp.access_token,
        livekit_url: resp.livekit_url,
      });
      setPhase('in-room');
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;

      if (status === 409) {
        // Already completed — jump straight to results
        const sid = body?.session_id;
        if (sid) {
          await loadResults(sid);
        } else {
          setError({ message: 'This interview has already been completed.', canRetry: false });
          setPhase('error');
        }
      } else if (status === 400) {
        setError({
          message: 'Your application is still being processed. CV screening has not been completed yet.',
          canRetry: false,
        });
        setPhase('error');
      } else if (status === 404) {
        setError({ message: 'Application not found. Please check your interview link.', canRetry: false });
        setPhase('error');
      } else {
        setError({ message: body?.detail || 'Server error. Please try again.', canRetry: true });
        setPhase('error');
      }
    }
  }

  // ── Completion flow ───────────────────────────────────────────────────────
  function triggerCompletion() {
    setPhase('processing');
    const s = sessionRef.current;
    setTimeout(async () => {
      if (s?.session_id) await loadResults(s.session_id);
    }, 3000);
  }

  // Called by LiveKitRoom when connection drops
  const handleRoomDisconnected = useCallback(() => {
    stopPolling();
    if (phaseRef.current === 'in-room') triggerCompletion();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Called by user clicking "Leave"
  function handleLeave() {
    stopPolling();
    triggerCompletion();
  }

  // ── Agent crash recovery ──────────────────────────────────────────────────
  async function recoverFromCrash() {
    const s = sessionRef.current;
    if (!s?.session_id) return;
    try {
      setPhase('starting');
      await interviewApi.resetInterview(s.session_id);
      await handleStart();
    } catch {
      setError({ message: 'AI Agent encountered an error. Please try again.', canRetry: true });
      setPhase('error');
    }
  }

  // ── Load results ──────────────────────────────────────────────────────────
  async function loadResults(sessionId) {
    try {
      const data = await interviewApi.getInterviewResults(sessionId);
      setResults(data);
      setPhase('results');
    } catch (err) {
      setError({ message: 'Could not load your results. Please contact support.', canRetry: false });
      setPhase('error');
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === 'results' && results) {
    return <ResultsView results={results} />;
  }

  if (phase === 'processing') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
          <div className="absolute inset-0 rounded-full border-4 border-t-accent-500 animate-spin" />
          <Brain className="absolute inset-0 m-auto w-10 h-10 text-accent-400" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">Processing your results…</h2>
          <p className="text-slate-400 text-sm">The AI is finalising scores. This takes a moment.</p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="text-center max-w-sm space-y-2">
          <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{error?.message}</p>
        </div>
        {error?.canRetry && (
          <button
            onClick={() => { setPhase('pre-interview'); setCountdown(10); setError(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (phase === 'starting') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-5">
        <Loader2 className="w-10 h-10 text-accent-400 animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-white text-lg font-semibold">Starting your interview…</p>
          <p className="text-slate-400 text-sm">Connecting to AI Interviewer</p>
        </div>
      </div>
    );
  }

  if (phase === 'in-room' && session) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white">Live Interview</span>
          </div>
          <span className="text-xs text-slate-600 font-mono">
            Session #{session.session_id}
          </span>
        </div>

        {/* LiveKit room */}
        <div className="flex-1">
          <LiveKitRoom
            token={session.access_token}
            serverUrl={session.livekit_url}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={handleRoomDisconnected}
            className="h-full"
          >
            <InterviewUI
              roomName={session.room_name}
              statusData={statusData}
              elapsed={elapsed}
              onLeave={handleLeave}
            />
          </LiveKitRoom>
        </div>
      </div>
    );
  }

  // Pre-interview screen
  return (
    <PreInterviewScreen
      language={language}
      persona={persona}
      countdown={countdown}
      onLanguageChange={setLanguage}
      onPersonaChange={setPersona}
      onStart={() => { setCountdown(0); handleStart(); }}
    />
  );
}
