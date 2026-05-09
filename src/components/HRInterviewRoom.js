import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
} from '@livekit/components-react';
import '@livekit/components-styles';
import {
  Mic, MicOff, Clock, AlertTriangle, CheckCircle2,
  Users, Loader2, RefreshCw, Volume2,
} from 'lucide-react';
import * as interviewApi from '../api/interviewService';

function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ── Mic volume meter ──────────────────────────────────────────────────────────

function MicMeter() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState('pending');

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

// ── Interview UI — must be a child of <LiveKitRoom> ───────────────────────────

function HRInterviewUI({ roomName, statusData, elapsed }) {
  const participants = useParticipants();
  const agentPresent = statusData
    ? statusData.is_agent_present
    : participants.filter(p => !p.isLocal).length > 0;
  const agentSpeaking = participants.filter(p => !p.isLocal).some(p => p.isSpeaking);

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <RoomAudioRenderer />

      {!agentPresent && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          Waiting for HR AI Interviewer to join the room…
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className={`relative flex items-center justify-center w-36 h-36 rounded-full transition-all duration-700 ${
          agentPresent
            ? 'bg-purple-500/15 ring-2 ring-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.25)]'
            : 'bg-slate-800 ring-2 ring-slate-700'
        }`}>
          {agentPresent && (
            <>
              <div className="absolute inset-0 rounded-full ring-2 ring-purple-500/20 animate-ping" />
              <div className="absolute inset-3 rounded-full ring-1 ring-purple-500/15 animate-pulse" />
            </>
          )}
          <Users className={`w-16 h-16 transition-colors duration-500 ${
            agentPresent ? 'text-purple-400' : 'text-slate-600'
          }`} />
        </div>

        <div className="text-center space-y-1.5">
          <p className={`text-lg font-semibold transition-colors ${agentPresent ? 'text-white' : 'text-slate-500'}`}>
            {agentPresent ? 'HR AI Interviewer Active' : 'Connecting…'}
          </p>
          <p className="text-xs text-slate-500 font-mono">Behavioral Interview</p>
          <p className="text-xs text-slate-600 font-mono">{roomName}</p>
        </div>

        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-full">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="font-mono text-2xl text-white tracking-widest tabular-nums">
            {formatTime(elapsed)}
          </span>
        </div>
      </div>

      {statusData && (
        <div className="text-center text-xs text-slate-600">
          {statusData.participant_count} participant{statusData.participant_count !== 1 ? 's' : ''} in room
        </div>
      )}

      <div className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800/60 border border-slate-700 text-slate-400 text-sm rounded-xl">
        <Volume2 className={`w-4 h-4 ${agentSpeaking ? 'text-purple-400 animate-pulse' : 'text-slate-600'}`} />
        The interview will end automatically when the AI interviewer concludes
      </div>
    </div>
  );
}

// ── Pre-interview screen ──────────────────────────────────────────────────────

function PreInterviewScreen({ language, countdown, onLanguageChange, onStart }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700">
              <img src="/light.png" alt="HireTechAI" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">HR Behavioral Interview</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your AI HR interviewer is ready. You'll be asked situational and behavioral
            questions using the STAR method. Check your microphone, then start.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl divide-y divide-slate-700">
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
                      ? 'bg-purple-500 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Microphone Check
            </p>
            <MicMeter />
          </div>

          <div className="p-5">
            <p className="text-xs text-slate-500 leading-relaxed">
              This is a behavioral interview focused on soft skills: communication,
              teamwork, leadership, and adaptability. Answer naturally using specific
              examples from your experience.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-center text-sm text-slate-500">
            {countdown > 0
              ? <>Take your time — interview ready in <span className="text-purple-400 font-bold">{countdown}s</span></>
              : 'Ready when you are'}
          </p>
          <button
            onClick={onStart}
            className="w-full py-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-lg rounded-2xl transition-colors shadow-[0_0_24px_rgba(168,85,247,0.2)]"
          >
            Start HR Interview
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── URL param parser ──────────────────────────────────────────────────────────

function parseUrlParams() {
  const p = new URLSearchParams(window.location.search);
  const rawReq  = p.get('requisition_id') ?? p.get('jr_id') ?? p.get('job_id');
  const rawCand = p.get('candidate_id') ?? p.get('applicant_id');
  const requisitionId = rawReq  ? Number(rawReq)  : NaN;
  const candidateId   = rawCand ? Number(rawCand) : NaN;
  const isValid = Number.isFinite(requisitionId) && requisitionId > 0
               && Number.isFinite(candidateId)   && candidateId   > 0;
  return { requisitionId, candidateId, isValid, raw: Object.fromEntries(p) };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HRInterviewRoom() {
  const { requisitionId, candidateId, isValid, raw } = parseUrlParams();

  const [phase, setPhase] = useState('pre-interview');
  const [language, setLanguage] = useState('en');
  const [countdown, setCountdown] = useState(10);
  const [session, setSession] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);

  const sessionRef = useRef(null);
  const phaseRef   = useRef('pre-interview');
  const pollingRef = useRef(null);
  const elapsedRef = useRef(0);

  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    if (!isValid) {
      const received = Object.keys(raw).length ? JSON.stringify(raw) : '(no query parameters)';
      setError({
        message: 'Invalid interview link — required parameters are missing.',
        detail: `Expected ?requisition_id=N&candidate_id=N. Received: ${received}`,
        canRetry: false,
      });
      setPhase('error');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'pre-interview' || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== 'in-room') return;
    const t = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'in-room' || !session?.room_name) return;

    const doPoll = async () => {
      try {
        const status = await interviewApi.getInterviewStatus(session.room_name);
        setStatusData(status);
        if (status.elapsed_seconds != null) {
          elapsedRef.current = status.elapsed_seconds;
          setElapsed(status.elapsed_seconds);
        }
        if (status.status === 'Completed') {
          stopPolling();
          setPhase('submitted');
        } else if (status.status === 'Failed') {
          stopPolling();
          recoverFromCrash();
        } else if (status.status === 'No-show') {
          stopPolling();
          setError({
            message: 'This session was marked as no-show. Please contact HR to reschedule.',
            canRetry: false,
          });
          setPhase('error');
        }
      } catch {
        // silent — don't interrupt the interview on a failed poll
      }
    };

    doPoll();
    pollingRef.current = setInterval(doPoll, 5000);
    return stopPolling;
  }, [phase, session]); // eslint-disable-line react-hooks/exhaustive-deps

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  async function handleStart() {
    if (!isValid) {
      setError({
        message: 'Invalid interview link — required parameters are missing.',
        detail: `Received params: ${JSON.stringify(raw)}`,
        canRetry: false,
      });
      setPhase('error');
      return;
    }

    setPhase('starting');

    const payload = {
      requisition_id: requisitionId,
      candidate_id:   candidateId,
      language,
      mode: 'hr',
      persona: 'elite',
    };

    try {
      const resp = await interviewApi.startInterview(payload);
      elapsedRef.current = 0;
      setElapsed(0);
      setSession({
        session_id:   resp.session_id,
        room_name:    resp.room_name,
        access_token: resp.access_token,
        livekit_url:  resp.livekit_url,
      });
      setPhase('in-room');
    } catch (err) {
      const status = err.response?.status;
      const body   = err.response?.data;

      if (status === 409) {
        setPhase('submitted');
      } else if (status === 400) {
        setError({
          message: 'Your technical interview has not been completed yet. The HR interview can only start after the technical round.',
          detail: body?.detail,
          canRetry: false,
        });
        setPhase('error');
      } else if (status === 404) {
        setError({
          message: 'Application not found. Please check your interview link.',
          detail: `Backend responded: ${JSON.stringify(body)}`,
          canRetry: false,
        });
        setPhase('error');
      } else if (status === 500) {
        setError({
          message: 'Server error. Please try again.',
          detail: body?.detail,
          canRetry: true,
        });
        setPhase('error');
      } else {
        setError({
          message: body?.detail || 'Could not start interview. Please try again.',
          detail: `HTTP ${status ?? 'network error'}`,
          canRetry: true,
        });
        setPhase('error');
      }
    }
  }

  const handleRoomDisconnected = useCallback(() => {
    stopPolling();
    if (phaseRef.current === 'in-room') setPhase('submitted');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === 'submitted') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-8 px-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <div className="text-center space-y-3 max-w-md">
          <h2 className="text-2xl font-bold text-white">HR Interview Completed</h2>
          <p className="text-slate-400 leading-relaxed">
            Thank you for completing the behavioral interview. Your responses have been
            recorded and will be evaluated as part of the final candidate ranking.
          </p>
          <p className="text-slate-500 text-sm">
            You will be notified of the outcome via email. You may close this window.
          </p>
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
        <div className="text-center max-w-lg space-y-2">
          <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{error?.message}</p>
          {error?.detail && (
            <p className="mt-3 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-500 font-mono text-left break-all">
              {error.detail}
            </p>
          )}
        </div>
        {error?.canRetry && (
          <button
            onClick={() => { setPhase('pre-interview'); setCountdown(10); setError(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
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
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-white text-lg font-semibold">Starting your HR interview…</p>
          <p className="text-slate-400 text-sm">Connecting to HR AI Interviewer</p>
        </div>
      </div>
    );
  }

  if (phase === 'in-room' && session) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-white">Live HR Interview</span>
          </div>
          <span className="text-xs text-slate-600 font-mono">
            Session #{session.session_id}
          </span>
        </div>

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
            <HRInterviewUI
              roomName={session.room_name}
              statusData={statusData}
              elapsed={elapsed}
            />
          </LiveKitRoom>
        </div>
      </div>
    );
  }

  return (
    <PreInterviewScreen
      language={language}
      countdown={countdown}
      onLanguageChange={setLanguage}
      onStart={() => { setCountdown(0); handleStart(); }}
    />
  );
}
