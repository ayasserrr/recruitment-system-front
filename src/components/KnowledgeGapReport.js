import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, AlertTriangle, CheckCircle2, Database,
  Clock, ChevronDown, ChevronUp, Loader2, ShieldAlert,
  BookOpen, TrendingUp,
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { logout } from '../api/authService';
import { getMissingKnowledge } from '../api/knowledgeService';

// ─── helpers ─────────────────────────────────────────────────────────────────

function relativeTime(iso) {
  if (!iso) return 'Unknown';
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs === 1 ? '1 hour' : `${hrs} hours`} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

const MAX_VISIBLE_JRS = 5;

// ─── sub-components ───────────────────────────────────────────────────────────

function JrChips({ jrIds, onNavigateToJr, isDarkMode }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? jrIds : jrIds.slice(0, MAX_VISIBLE_JRS);
  const hidden = jrIds.length - MAX_VISIBLE_JRS;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
        Affected JRs:
      </span>
      {visible.map(id => (
        <button
          key={id}
          onClick={() => onNavigateToJr(id)}
          className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
            isDarkMode
              ? 'bg-slate-600 text-accent-300 hover:bg-accent-600 hover:text-white'
              : 'bg-accent-100 text-accent-700 hover:bg-accent-500 hover:text-white'
          }`}
        >
          JR #{id}
        </button>
      ))}
      {!expanded && hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors flex items-center gap-0.5 ${
            isDarkMode ? 'bg-slate-700 text-gray-400 hover:text-gray-200' : 'bg-base-100 text-base-500 hover:text-base-800'
          }`}
        >
          +{hidden} more
          <ChevronDown className="w-3 h-3" />
        </button>
      )}
      {expanded && hidden > 0 && (
        <button
          onClick={() => setExpanded(false)}
          className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors flex items-center gap-0.5 ${
            isDarkMode ? 'bg-slate-700 text-gray-400 hover:text-gray-200' : 'bg-base-100 text-base-500 hover:text-base-800'
          }`}
        >
          show less
          <ChevronUp className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function ProgressBar({ value, max, highPriority }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            highPriority
              ? 'bg-gradient-to-r from-red-500 to-orange-400'
              : 'bg-gradient-to-r from-accent-500 to-accent-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-mono w-14 text-right tabular-nums ${
        highPriority ? 'text-red-500' : 'text-accent-600 dark:text-accent-400'
      }`}>
        {value} {value === 1 ? 'hit' : 'hits'}
      </span>
    </div>
  );
}

function PriorityBadge({ high, isDarkMode }) {
  if (high) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
        <AlertTriangle className="w-3 h-3" />
        HIGH PRIORITY
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
      isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-base-100 text-base-500'
    }`}>
      NORMAL
    </span>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function KnowledgeGapReport({ onBack, onNavigateToPhase }) {
  const { isDarkMode } = useDarkMode();

  const [pageState, setPageState] = useState('loading'); // loading | ready | empty | forbidden | error
  const [data, setData] = useState(null);

  const surface = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200';
  const divider = isDarkMode ? 'border-slate-700' : 'border-base-200';
  const textPri = isDarkMode ? 'text-white' : 'text-base-900';
  const textMut = isDarkMode ? 'text-gray-400' : 'text-base-500';

  const load = useCallback(async () => {
    setPageState('loading');
    try {
      const result = await getMissingKnowledge();
      setData(result);
      setPageState(result.items?.length === 0 ? 'empty' : 'ready');
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        logout();
      } else if (status === 403) {
        setPageState('forbidden');
      } else {
        setPageState('error');
      }
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleNavigateToJr(jrId) {
    // Navigate to applications page — closest equivalent to per-JR detail in this app
    onNavigateToPhase('applications');
  }

  const maxOccurrence = data?.items?.length
    ? Math.max(...data.items.map(i => i.occurrence_count))
    : 1;

  // ─── states ────────────────────────────────────────────────────────────────

  if (pageState === 'loading') {
    return (
      <div className={`flex flex-col h-[calc(100vh-65px)] items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-base-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin mb-3 ${isDarkMode ? 'text-accent-400' : 'text-accent-500'}`} />
        <p className={`text-sm ${textMut}`}>Loading gap report…</p>
      </div>
    );
  }

  if (pageState === 'forbidden') {
    return (
      <div className={`flex flex-col h-[calc(100vh-65px)] items-center justify-center gap-4 ${isDarkMode ? 'bg-slate-900' : 'bg-base-50'}`}>
        <div className="flex flex-col items-center gap-3 max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className={`text-xl font-semibold ${textPri}`}>Admin access required</h2>
          <p className={`text-sm ${textMut}`}>
            This report is restricted to company accounts. Recruiter tokens do not have permission to view system health data.
          </p>
          <button
            onClick={onBack}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className={`flex flex-col h-[calc(100vh-65px)] items-center justify-center gap-4 ${isDarkMode ? 'bg-slate-900' : 'bg-base-50'}`}>
        <div className="flex flex-col items-center gap-3 max-w-sm text-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <h2 className={`text-lg font-semibold ${textPri}`}>Failed to load report</h2>
          <p className={`text-sm ${textMut}`}>Network error or server unavailable.</p>
          <button
            onClick={load}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (pageState === 'empty') {
    return (
      <div className={`flex flex-col h-[calc(100vh-65px)] ${isDarkMode ? 'bg-slate-900' : 'bg-base-50'}`}>
        <PageHeader onBack={onBack} data={data} isEmpty isDarkMode={isDarkMode} surface={surface} textPri={textPri} textMut={textMut} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div className="text-center">
            <h2 className={`text-xl font-semibold mb-1 ${textPri}`}>Knowledge DB is fully covered</h2>
            <p className={`text-sm ${textMut}`}>
              All tools referenced in job requisitions exist in the knowledge base.
            </p>
          </div>
          {data?.generated_at && (
            <p className={`text-xs ${textMut}`}>
              Checked {relativeTime(data.generated_at)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── ready state ────────────────────────────────────────────────────────────

  return (
    <div className={`flex flex-col h-[calc(100vh-65px)] ${isDarkMode ? 'bg-slate-900' : 'bg-base-50'}`}>
      <PageHeader onBack={onBack} data={data} isDarkMode={isDarkMode} surface={surface} textPri={textPri} textMut={textMut} />

      {/* High-priority alert banner */}
      {data.high_priority_count > 0 && (
        <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="font-medium text-red-700 dark:text-red-400">
            {data.high_priority_count === 1
              ? '1 tool needs immediate attention'
              : `${data.high_priority_count} tools need immediate attention`}
          </span>
          <span className={`ml-auto text-xs ${textMut}`}>
            High-priority items appear at the top
          </span>
        </div>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {data.items.map((item, idx) => (
            <GapItem
              key={item.tool_name}
              item={item}
              rank={idx + 1}
              maxOccurrence={maxOccurrence}
              isDarkMode={isDarkMode}
              surface={surface}
              divider={divider}
              textPri={textPri}
              textMut={textMut}
              onNavigateToJr={handleNavigateToJr}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

function PageHeader({ onBack, data, isEmpty, isDarkMode, surface, textPri, textMut }) {
  return (
    <div className={`border-b flex-shrink-0 ${surface}`}>
      {/* Breadcrumb */}
      <div className={`flex items-center gap-3 px-6 pt-3 pb-2`}>
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-base-500 hover:text-base-900'}`}
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </button>
        <span className={`text-sm ${isDarkMode ? 'text-slate-600' : 'text-base-300'}`}>/</span>
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`} />
          <span className={`text-sm font-semibold ${textPri}`}>Knowledge Gap Report</span>
        </div>
      </div>

      {/* Title row + meta */}
      <div className="flex items-end justify-between gap-4 px-6 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Database className={`w-5 h-5 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`} />
            <h1 className={`text-xl font-bold ${textPri}`}>Missing Knowledge</h1>
          </div>
          {!isEmpty && data && (
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
              data.total_missing_tools > 0
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              <BookOpen className="w-3.5 h-3.5" />
              {data.total_missing_tools} {data.total_missing_tools === 1 ? 'tool' : 'tools'} missing from Knowledge DB
            </span>
          )}
        </div>

        {data?.generated_at && (
          <div className={`flex items-center gap-1.5 text-xs flex-shrink-0 ${textMut}`} title={data.generated_at}>
            <Clock className="w-3.5 h-3.5" />
            Generated {relativeTime(data.generated_at)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GapItem ─────────────────────────────────────────────────────────────────

function GapItem({ item, rank, maxOccurrence, isDarkMode, surface, divider, textPri, textMut, onNavigateToJr }) {
  return (
    <div className={`rounded-xl border p-5 space-y-3 transition-shadow hover:shadow-card ${surface}`}>
      {/* Row 1: tool name + priority badge + timestamp */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <span className={`text-xs font-mono w-5 text-center flex-shrink-0 ${textMut}`}>
            {rank}
          </span>
          <h3 className={`text-base font-bold ${textPri}`}>{item.tool_name}</h3>
          <PriorityBadge high={item.high_priority} isDarkMode={isDarkMode} />
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs flex-shrink-0 cursor-default ${textMut}`}
          title={item.last_requested_at}
        >
          <Clock className="w-3.5 h-3.5" />
          {relativeTime(item.last_requested_at)}
        </div>
      </div>

      {/* Row 2: occurrence progress bar */}
      <div className="space-y-1">
        <div className={`text-xs font-medium ${textMut}`}>Occurrence frequency</div>
        <ProgressBar
          value={item.occurrence_count}
          max={maxOccurrence}
          highPriority={item.high_priority}
        />
      </div>

      {/* Row 3: affected JRs */}
      {item.affected_jrs?.length > 0 && (
        <div className={`pt-2 border-t ${divider}`}>
          <JrChips jrIds={item.affected_jrs} onNavigateToJr={onNavigateToJr} isDarkMode={isDarkMode} />
        </div>
      )}
    </div>
  );
}
