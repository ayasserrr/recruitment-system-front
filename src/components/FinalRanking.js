import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    getFinalRanking, shortlistCandidate, sendOffer,
    triggerRanking, getSHAPReport,
} from '../api/finalRankingService';
import { getJob } from '../api/jobService';
import { getShortlist, removeFromShortlist as apiRemoveFromShortlist } from '../api/shortlistService';
import {
    ArrowLeft, Trophy, Download, TrendingUp, Star, Heart,
    Sparkles, Award, Users, FileText, CheckCircle, Code,
    MessageSquare, ChevronDown, ChevronUp, Zap, AlertTriangle,
    Loader, Brain, X,
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

// ---------------------------------------------------------------------------
// SHAP Waterfall Chart
// Renders a horizontal waterfall chart where each bar shows a stage's signed
// phi (φ) contribution relative to the 50-point average-candidate baseline.
// Positive φ → green bar extending right; negative φ → red bar extending left.
// ---------------------------------------------------------------------------
function SHAPWaterfallChart({ report, isDarkMode }) {
    if (!report) return null;

    const rawBars = [
        { label: 'CV Screening',        weight: report.weightScreening    ?? 0.20, phi: report.shapScreening },
        { label: 'Assessment',          weight: report.weightAssessment   ?? 0.25, phi: report.shapAssessment },
        { label: 'Technical Interview', weight: report.weightTechInterview ?? 0.30, phi: report.shapTechInterview },
        { label: 'HR Interview',        weight: report.weightHrInterview  ?? 0.25, phi: report.shapHrInterview },
    ].filter(b => b.phi !== null && b.phi !== undefined);

    // Build cumulative waterfall positions
    let running = 50; // baseline
    const bars = rawBars.map((b) => {
        const from = running;
        running = running + b.phi;
        const lo = Math.max(0, Math.min(100, Math.min(from, running)));
        const hi = Math.max(0, Math.min(100, Math.max(from, running)));
        return {
            ...b,
            from,
            to: running,
            leftPct:  lo,
            widthPct: hi - lo,
            isPositive: b.phi >= 0,
        };
    });

    const trackCls  = isDarkMode ? 'bg-slate-600' : 'bg-gray-200';
    const labelCls  = isDarkMode ? 'text-gray-300' : 'text-gray-700';
    const mutedCls  = isDarkMode ? 'text-gray-500' : 'text-gray-400';
    const dividerCls = isDarkMode ? 'border-slate-600' : 'border-gray-200';

    return (
        <div className="space-y-4">
            {/* Baseline row */}
            <div>
                <div className={`flex justify-between text-xs mb-1 ${mutedCls}`}>
                    <span>Baseline — average candidate</span>
                    <span className="font-semibold">50.0</span>
                </div>
                <div className={`relative h-4 rounded ${trackCls}`}>
                    <div
                        className={`absolute top-0 h-full rounded-l ${isDarkMode ? 'bg-slate-500' : 'bg-gray-400'}`}
                        style={{ width: '50%' }}
                    />
                    {/* Centre hairline */}
                    <div className="absolute top-0 h-full w-px bg-gray-500" style={{ left: '50%' }} />
                </div>
            </div>

            {/* Stage bars */}
            {bars.map((bar, i) => (
                <div key={i}>
                    <div className={`flex justify-between text-xs mb-1 ${labelCls}`}>
                        <span>
                            {bar.label}
                            <span className={`ml-1 ${mutedCls}`}>
                                ({Math.round(bar.weight * 100)}%)
                            </span>
                        </span>
                        <span className={`font-bold ${bar.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {bar.isPositive ? '+' : ''}{bar.phi.toFixed(1)}
                            <span className={`ml-2 font-normal ${mutedCls}`}>→ {bar.to.toFixed(1)}</span>
                        </span>
                    </div>
                    <div className={`relative h-5 rounded ${trackCls}`}>
                        {/* Contribution bar */}
                        <div
                            className={`absolute top-0 h-full rounded ${bar.isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ left: `${bar.leftPct}%`, width: `${bar.widthPct}%` }}
                        />
                        {/* Centre hairline */}
                        <div className="absolute top-0 h-full w-px bg-gray-400 opacity-60" style={{ left: '50%' }} />
                    </div>
                </div>
            ))}

            {/* Final score row */}
            <div className={`pt-3 border-t ${dividerCls}`}>
                <div className={`flex justify-between text-xs mb-1`}>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Final Pipeline Score
                    </span>
                    <span className="font-bold text-accent-600">{report.overallScore} / 100</span>
                </div>
                <div className={`relative h-6 rounded overflow-hidden ${trackCls}`}>
                    <div
                        className="absolute top-0 h-full rounded bg-gradient-to-r from-base-500 to-accent-500"
                        style={{ width: `${Math.min(100, report.overallScore)}%` }}
                    />
                    <div className="absolute top-0 h-full w-px bg-gray-400 opacity-50" style={{ left: '50%' }} />
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {report.overallScore}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function FinalRanking({ applications, onBack }) {
    const { isDarkMode } = useDarkMode();

    // --- Core state ---
    const [selectedAppId,       setSelectedAppId]       = useState(null);
    const [jobStatus,           setJobStatus]           = useState(null); // polled status
    const [selectedFilter,      setSelectedFilter]      = useState('all');
    const [sortBy,              setSortBy]              = useState('overallScore');
    const [finalRanking,        setFinalRanking]        = useState([]);
    const [shortlistedKeys,     setShortlistedKeys]     = useState(new Set());
    const [expandedRows,        setExpandedRows]        = useState(new Set());
    const [loading,             setLoading]             = useState(false);
    const [fetchError,          setFetchError]          = useState(null);

    // --- Offer modal state ---
    const [showCVModal,         setShowCVModal]         = useState(null);
    const [showFullReportModal, setShowFullReportModal] = useState(null);
    const [showOfferModal,      setShowOfferModal]      = useState(null);
    const [offerFormData,       setOfferFormData]       = useState({
        position: '', salary: '', startDate: '', department: '',
        reportingTo: '', benefits: '', contractType: 'full-time',
        location: '', notes: '',
    });

    // --- Trigger-ranking pipeline state ---
    const [isPipelineRunning,   setIsPipelineRunning]   = useState(false);
    const pollingRef = useRef(null);

    // --- SHAP drawer state ---
    const [shapDrawer,  setShapDrawer]  = useState(null); // { candidate, report | null, error | null }
    const [shapLoading, setShapLoading] = useState(false);

    // ---------------------------------------------------------------------------
    // Derived
    // ---------------------------------------------------------------------------
    const selectedApp  = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);
    const isFinalStage = useMemo(() => jobStatus === 'Final Stage', [jobStatus]);

    // ---------------------------------------------------------------------------
    // Ranking load
    // ---------------------------------------------------------------------------
    const loadRanking = useCallback(async (jobId) => {
        setLoading(true);
        setFetchError(null);
        try {
            const [data, shortlistEntries] = await Promise.all([
                getFinalRanking(jobId),
                getShortlist(1, 200, jobId).catch(() => []),
            ]);
            setFinalRanking(data);
            setShortlistedKeys(new Set(shortlistEntries.map(e => e.candidateId)));
        } catch (err) {
            setFetchError(err.response?.data?.detail || err.message || 'Failed to load final ranking');
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------------------------------------------------------------------------
    // Polling — runs every 5 s until job reaches "Final Stage"
    // ---------------------------------------------------------------------------
    const startPolling = useCallback((jobId) => {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setIsPipelineRunning(true);

        pollingRef.current = setInterval(async () => {
            try {
                const job = await getJob(jobId);
                setJobStatus(job.status);
                if (job.status === 'Final Stage') {
                    clearInterval(pollingRef.current);
                    pollingRef.current = null;
                    setIsPipelineRunning(false);
                    loadRanking(jobId);
                }
            } catch {
                // transient error — keep polling
            }
        }, 5000);
    }, [loadRanking]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }, []);

    // ---------------------------------------------------------------------------
    // When the selected job changes, decide whether to load data or wait
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!selectedAppId) {
            setFinalRanking([]);
            setShortlistedKeys(new Set());
            setJobStatus(null);
            setIsPipelineRunning(false);
            if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
            return;
        }

        // Stop any previous polling
        if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
        setIsPipelineRunning(false);
        setFetchError(null);

        const app = applications.find(a => a.id === selectedAppId);
        const status = app?.status ?? null;
        setJobStatus(status);

        if (status === 'Final Stage') {
            loadRanking(selectedAppId);
        } else {
            setFinalRanking([]);
        }
    }, [selectedAppId, applications, loadRanking]);

    // ---------------------------------------------------------------------------
    // Trigger ranking
    // ---------------------------------------------------------------------------
    const handleTriggerRanking = async () => {
        if (!selectedAppId || isPipelineRunning) return;
        try {
            const res = await triggerRanking(selectedAppId);
            if (res.status === 'already_running') {
                toast('Pipeline is already running — waiting for completion.', { icon: '⏳' });
            } else {
                toast.success('Ranking pipeline started. This may take 1–3 minutes.');
            }
            startPolling(selectedAppId);
        } catch (err) {
            toast.error(err.response?.data?.detail || err.message || 'Failed to start ranking pipeline.');
        }
    };

    // ---------------------------------------------------------------------------
    // SHAP drawer
    // ---------------------------------------------------------------------------
    const openShapDrawer = async (candidate) => {
        setShapDrawer({ candidate, report: null, error: null });
        setShapLoading(true);
        try {
            const report = await getSHAPReport(selectedAppId, candidate.id);
            setShapDrawer({ candidate, report, error: null });
        } catch (err) {
            setShapDrawer({ candidate, report: null, error: err.response?.data?.detail || err.message || 'Failed to load SHAP report.' });
        } finally {
            setShapLoading(false);
        }
    };

    // ---------------------------------------------------------------------------
    // Shortlist helpers
    // ---------------------------------------------------------------------------
    const loadShortlistedIds = useCallback((jobId) => {
        if (!jobId) { setShortlistedKeys(new Set()); return; }
        getShortlist(1, 200, jobId)
            .then(entries => setShortlistedKeys(new Set(entries.map(e => e.candidateId))))
            .catch(() => setShortlistedKeys(new Set()));
    }, []);

    const toggleCandidateShortlist = (candidate) => {
        if (!candidate?.id || !selectedAppId) return;
        if (shortlistedKeys.has(candidate.id)) {
            apiRemoveFromShortlist(candidate.id, selectedAppId)
                .then(() => loadShortlistedIds(selectedAppId))
                .catch(() => loadShortlistedIds(selectedAppId));
        } else {
            const note = prompt(`Add a note for ${candidate.name || 'this candidate'} (optional):`, '') || '';
            shortlistCandidate(selectedAppId, candidate.id, note)
                .then(() => loadShortlistedIds(selectedAppId))
                .catch(() => loadShortlistedIds(selectedAppId));
        }
    };

    // ---------------------------------------------------------------------------
    // Colour helpers
    // ---------------------------------------------------------------------------
    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 65) return 'text-orange-600';
        return 'text-yellow-600';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Top Candidate':   return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800';
            case 'Strong Candidate':return 'bg-gradient-to-r from-green-100  to-green-200  text-green-800';
            case 'Good Candidate':  return 'bg-gradient-to-r from-blue-100   to-blue-200   text-blue-800';
            default:                return 'bg-gradient-to-r from-slate-100  to-slate-200  text-slate-800';
        }
    };

    const getRecommendationColor = (rec) => {
        switch (rec) {
            case 'Top Candidate':  return 'bg-gradient-to-r from-yellow-400 to-amber-500   text-white';
            case 'Strong Hire':    return 'bg-gradient-to-r from-green-500  to-emerald-600 text-white';
            case 'Hire':           return 'bg-gradient-to-r from-teal-500   to-teal-600    text-white';
            case 'Maybe':          return 'bg-gradient-to-r from-orange-400 to-orange-500  text-white';
            case 'No Hire':        return 'bg-gradient-to-r from-red-500    to-red-600     text-white';
            // Legacy labels kept for safety
            case 'Strongly Recommend': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
            case 'Recommend':          return 'bg-gradient-to-r from-blue-500  to-blue-600    text-white';
            case 'Consider':           return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
            default:                   return 'bg-gradient-to-r from-slate-500  to-slate-600  text-white';
        }
    };

    // *** Critical: red-flag ALWAYS overrides recommendation ***
    const renderRecommendationBadge = (candidate) => {
        if (candidate.redFlag) {
            return (
                <div className="flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white">
                        No Hire
                    </span>
                    <div className="relative group">
                        <AlertTriangle className="w-4 h-4 text-red-500 cursor-help flex-shrink-0" />
                        {candidate.redFlagReason && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-lg bg-red-950 text-red-100 text-xs leading-snug opacity-0 group-hover:opacity-100 pointer-events-none z-20 shadow-xl border border-red-800">
                                <span className="font-bold block mb-1">⚠ Red Flag Detected</span>
                                {candidate.redFlagReason}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRecommendationColor(candidate.recommendation)}`}>
                {candidate.recommendation}
            </span>
        );
    };

    const getApplicationStatusBadge = (s) => {
        switch (s) {
            case 'Shortlisted':     return 'bg-green-100 text-green-700 border border-green-200';
            case 'Offer Extended':  return 'bg-purple-100 text-purple-700 border border-purple-200';
            case 'Applied':         return 'bg-blue-100 text-blue-700 border border-blue-200';
            default:                return 'bg-slate-100 text-slate-600 border border-slate-200';
        }
    };

    const getHireProbabilityColor = (p) => {
        if (p >= 90) return 'bg-gradient-to-r from-green-500 to-green-600';
        if (p >= 80) return 'bg-gradient-to-r from-blue-500 to-blue-600';
        if (p >= 70) return 'bg-gradient-to-r from-orange-500 to-orange-600';
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    };

    // ---------------------------------------------------------------------------
    // Derived stats — all using correct API field names
    // ---------------------------------------------------------------------------
    const hiringStats = useMemo(() => {
        if (!finalRanking.length) return { totalCandidates: 0, shortlisted: 0, finalists: 0, avgOverallScore: 0, topScore: 0 };
        const total      = finalRanking.length;
        const shortlisted= finalRanking.filter(c => c.overallScore >= 85).length;
        const finalists  = finalRanking.filter(c => c.overallScore >= 80).length;
        const avg        = Math.round(finalRanking.reduce((s, c) => s + c.overallScore, 0) / total);
        const top        = Math.max(...finalRanking.map(c => c.overallScore));
        return { totalCandidates: total, shortlisted, finalists, avgOverallScore: avg, topScore: top };
    }, [finalRanking]);

    const stageScores = useMemo(() => {
        const safe = (arr) => ({ avg: Math.round(arr.reduce((s,v)=>s+v,0)/arr.length)||0, max: Math.max(...arr)||0, min: Math.min(...arr)||0 });
        if (!finalRanking.length) return { semantic:{avg:0,max:0,min:0}, assessment:{avg:0,max:0,min:0}, techInterview:{avg:0,max:0,min:0}, hrInterview:{avg:0,max:0,min:0} };
        return {
            semantic:     safe(finalRanking.map(c => c.semanticScore    ?? 0)),
            assessment:   safe(finalRanking.map(c => c.assessmentScore  ?? 0)),
            techInterview:safe(finalRanking.map(c => c.technicalScore   ?? 0)),
            hrInterview:  safe(finalRanking.map(c => c.hrScore          ?? 0)),
        };
    }, [finalRanking]);

    const filteredCandidates = useMemo(() => {
        let list = finalRanking;
        if (selectedFilter === 'shortlisted')     list = list.filter(c => c.applicationStatus === 'Shortlisted');
        if (selectedFilter === 'not_shortlisted') list = list.filter(c => c.applicationStatus !== 'Shortlisted');
        if (selectedFilter === 'top')             list = list.filter(c => c.recommendation === 'Top Candidate' || c.recommendation === 'Strongly Recommend');
        if (selectedFilter === 'hire')            list = list.filter(c => ['Strong Hire','Hire','Strongly Recommend','Recommend'].includes(c.recommendation));
        if (selectedFilter === 'flagged')         list = list.filter(c => c.redFlag);

        return [...list].sort((a, b) => {
            if (sortBy === 'overallScore')  return (b.overallScore   ?? 0) - (a.overallScore   ?? 0);
            if (sortBy === 'assessmentScore')return (b.assessmentScore?? 0) - (a.assessmentScore?? 0);
            if (sortBy === 'hrScore')       return (b.hrScore        ?? 0) - (a.hrScore        ?? 0);
            if (sortBy === 'finalRank')     return (a.finalRank      ?? 999)-(b.finalRank      ?? 999);
            if (sortBy === 'name')          return a.name.localeCompare(b.name);
            return 0;
        });
    }, [finalRanking, selectedFilter, sortBy]);

    // ---------------------------------------------------------------------------
    // Download helpers
    // ---------------------------------------------------------------------------
    const downloadReport = () => {
        const data = filteredCandidates.map((c, i) => ({
            rank:           i + 1,
            finalRank:      c.finalRank,
            name:           c.name,
            email:          c.email,
            overallScore:   c.overallScore,
            semanticScore:  c.semanticScore,
            assessmentScore:c.assessmentScore,
            technicalScore: c.technicalScore,
            hrScore:        c.hrScore,
            recommendation: c.recommendation,
            hireProbability:c.hireProbability,
            redFlag:        c.redFlag,
            redFlagReason:  c.redFlagReason,
        }));
        const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ candidates: data, generatedDate: new Date().toISOString() }, null, 2));
        Object.assign(document.createElement('a'), { href: uri, download: `final-ranking-${new Date().toISOString().split('T')[0]}.json` }).click();
    };

    const downloadCV = (c) => {
        const obj = { name: c.name, email: c.email, phone: c.phone, experience: c.experience, education: c.education, summary: c.summary, overallScore: c.overallScore, semanticScore: c.semanticScore, assessmentScore: c.assessmentScore, technicalScore: c.technicalScore, hrScore: c.hrScore, skills: c.skills, generatedDate: new Date().toISOString() };
        const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj, null, 2));
        Object.assign(document.createElement('a'), { href: uri, download: `cv-${c.name.replace(/ /g,'-')}.json` }).click();
    };

    const extendOffer = (candidate) => {
        setShowOfferModal(candidate);
        setOfferFormData({
            position:     selectedApp?.jobTitle || '',
            salary:       '',
            startDate:    '',
            department:   selectedApp?.department || '',
            reportingTo:  '',
            benefits:     'Health insurance, annual bonus, remote work options',
            contractType: 'full-time',
            location:     '',
            notes:        `We look forward to having you on the team, ${candidate.name}!`,
        });
    };

    const makeFinalSelection = () => {
        const top = filteredCandidates.slice(0, 3).map((c, i) => ({ rank: i + 1, name: c.name, overallScore: c.overallScore, recommendation: c.recommendation }));
        const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(top, null, 2));
        Object.assign(document.createElement('a'), { href: uri, download: `final-selection-${new Date().toISOString().split('T')[0]}.json` }).click();
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (
        <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto">

                {/* Page header */}
                <div className="mb-8 flex items-center">
                    {onBack && (
                        <button onClick={onBack} className={`mr-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-white'}`}>
                            <ArrowLeft className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                        </button>
                    )}
                    <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-16 h-16 rounded-lg mr-4">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div className="ml-2">
                        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Final Ranking</h1>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Comprehensive AI-powered candidate evaluation</p>
                    </div>
                </div>

                {/* Application selector */}
                <div className={`rounded-2xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Select Job Requisition</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => (
                            <button
                                key={app.id}
                                onClick={() => setSelectedAppId(app.id)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                    selectedAppId === app.id
                                        ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50'
                                        : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-base-200 hover:border-accent-300'
                                }`}
                            >
                                <h3 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{app.jobTitle}</h3>
                                <div className={`text-sm mt-1 space-y-0.5 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                    <div>Final Candidates: {app.finalCandidates ?? 0}</div>
                                    <div>Status: <span className="font-medium">{app.status}</span></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* State: no app selected                                           */}
                {/* ---------------------------------------------------------------- */}
                {!selectedApp && (
                    <div className={`text-center py-16 rounded-2xl shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>No Requisition Selected</h3>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Select a job above to view or trigger the final ranking pipeline.</p>
                    </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* State: app selected, loading ranking data                        */}
                {/* ---------------------------------------------------------------- */}
                {selectedApp && loading && (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4" />
                        <p className={isDarkMode ? 'text-gray-400' : 'text-base-600'}>Loading final ranking…</p>
                    </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* State: fetch error                                               */}
                {/* ---------------------------------------------------------------- */}
                {selectedApp && fetchError && !loading && (
                    <div className={`rounded-xl p-6 mb-6 text-center ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-600'}`}>
                        {fetchError}
                    </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* State: job not yet in "Final Stage" → trigger CTA                */}
                {/* ---------------------------------------------------------------- */}
                {selectedApp && !loading && !isFinalStage && !fetchError && (
                    <div className={`rounded-2xl p-10 mb-8 text-center border-2 border-dashed ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-base-200'}`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${isPipelineRunning ? 'bg-gradient-to-r from-orange-400 to-accent-500' : 'bg-gradient-to-r from-base-500 to-accent-500'}`}>
                            {isPipelineRunning
                                ? <Loader className="w-10 h-10 text-white animate-spin" />
                                : <Zap className="w-10 h-10 text-white" />
                            }
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            {isPipelineRunning ? 'Ranking Pipeline Running…' : 'Pipeline Not Yet Started'}
                        </h3>
                        <p className={`mb-6 max-w-lg mx-auto ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            {isPipelineRunning
                                ? 'The AI ranking engine is computing weighted scores and SHAP explanations. This takes 1–3 minutes.'
                                : 'Run the AI pipeline to compute the weighted final scores (20 / 25 / 30 / 25) and SHAP contribution charts for every candidate.'
                            }
                        </p>

                        {!isPipelineRunning ? (
                            <button
                                onClick={handleTriggerRanking}
                                className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all flex items-center mx-auto shadow-lg"
                            >
                                <Zap className="w-6 h-6 mr-3" />
                                Trigger Ranking Pipeline
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-500" />
                                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                    Polling every 5 s for completion…
                                </span>
                            </div>
                        )}

                        <p className={`mt-5 text-sm ${isDarkMode ? 'text-gray-500' : 'text-base-400'}`}>
                            Current status: <span className="font-semibold">{jobStatus || 'Unknown'}</span>
                        </p>
                    </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* State: Final Stage — show ranking                               */}
                {/* ---------------------------------------------------------------- */}
                {selectedApp && !loading && isFinalStage && (
                    <div>
                        {/* Stats cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'Final Candidates', value: hiringStats.finalists,        sub: `of ${hiringStats.totalCandidates} applicants`,  icon: <Trophy className="w-10 h-10 text-accent-400" /> },
                                { label: 'Top Score',        value: hiringStats.topScore,          sub: 'Highest overall score',                          icon: <Star    className="w-10 h-10 text-accent-400" /> },
                                { label: 'Average Score',    value: hiringStats.avgOverallScore,   sub: 'Across all final candidates',                    icon: <TrendingUp className="w-10 h-10 text-accent-400" /> },
                                { label: 'Red Flags',        value: finalRanking.filter(c=>c.redFlag).length, sub: 'Candidates with anomalies', icon: <AlertTriangle className="w-10 h-10 text-red-400" /> },
                            ].map(card => (
                                <div key={card.label} className={`rounded-2xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold text-accent-600 mb-1">{card.value}</div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>{card.label}</div>
                                        </div>
                                        {card.icon}
                                    </div>
                                    <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-base-400'}`}>{card.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Stage performance */}
                        <div className={`rounded-2xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Stage Performance Analysis</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { key: 'semantic',      label: 'Semantic Analysis', weight: '20%', icon: <Sparkles   className="w-6 h-6 text-white" />, scores: stageScores.semantic },
                                    { key: 'assessment',    label: 'Technical Test',    weight: '25%', icon: <Code       className="w-6 h-6 text-white" />, scores: stageScores.assessment },
                                    { key: 'techInterview', label: 'Tech Interview',    weight: '30%', icon: <Users      className="w-6 h-6 text-white" />, scores: stageScores.techInterview },
                                    { key: 'hrInterview',   label: 'HR Interview',      weight: '25%', icon: <MessageSquare className="w-6 h-6 text-white" />, scores: stageScores.hrInterview },
                                ].map(s => (
                                    <div key={s.key} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                                                {s.icon}
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-accent-600">{s.scores.avg}</div>
                                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>{s.label} · {s.weight}</div>
                                            </div>
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-base-400'}`}>
                                            Range: {s.scores.min} – {s.scores.max}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Candidates Ranking</h2>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Ranked by DB-computed weighted pipeline score — not recalculated on the frontend</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-base-300 text-base-700'}`}
                                >
                                    <option value="overallScore">Overall Score</option>
                                    <option value="finalRank">Final Rank</option>
                                    <option value="assessmentScore">Assessment Score</option>
                                    <option value="hrScore">HR Score</option>
                                    <option value="name">Name</option>
                                </select>
                                <button
                                    onClick={downloadReport}
                                    className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center text-sm"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Filter tabs */}
                        <div className={`flex flex-wrap gap-2 mb-6 p-1 rounded-xl w-fit ${isDarkMode ? 'bg-slate-700' : 'bg-base-100'}`}>
                            {[
                                { key: 'all',             label: 'All',          count: finalRanking.length },
                                { key: 'top',             label: 'Top',          count: finalRanking.filter(c => c.recommendation === 'Top Candidate' || c.recommendation === 'Strong Hire').length },
                                { key: 'hire',            label: 'Hire',         count: finalRanking.filter(c => ['Strong Hire','Hire','Strongly Recommend','Recommend'].includes(c.recommendation)).length },
                                { key: 'shortlisted',     label: 'Shortlisted',  count: finalRanking.filter(c => c.applicationStatus === 'Shortlisted').length },
                                { key: 'flagged',         label: '⚠ Flagged',    count: finalRanking.filter(c => c.redFlag).length },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setSelectedFilter(tab.key)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        selectedFilter === tab.key
                                            ? isDarkMode ? 'bg-accent-600 text-white shadow' : 'bg-white text-accent-700 shadow-sm'
                                            : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-base-600 hover:text-base-900'
                                    }`}
                                >
                                    {tab.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${selectedFilter === tab.key ? isDarkMode ? 'bg-accent-500 text-white' : 'bg-accent-100 text-accent-700' : isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-base-200 text-base-600'}`}>{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        {/* Candidate cards */}
                        <div className="space-y-6">
                            {filteredCandidates.map((candidate, index) => (
                                <div
                                    key={candidate.id}
                                    className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${
                                        candidate.redFlag
                                            ? isDarkMode ? 'border-red-700 bg-red-950/20' : 'border-red-300 bg-red-50'
                                            : index === 0 ? isDarkMode ? 'border-yellow-500 bg-slate-800' : 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50'
                                            : index === 1 ? isDarkMode ? 'border-blue-500  bg-slate-800' : 'border-blue-300  bg-gradient-to-r from-blue-50  to-sky-50'
                                            : index === 2 ? isDarkMode ? 'border-green-500 bg-slate-800' : 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50'
                                            : isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'
                                    }`}
                                >
                                    {/* Candidate header row */}
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                                        <div className="flex items-start mb-4 lg:mb-0">
                                            {/* Rank badge */}
                                            <div className={`relative flex-shrink-0 w-14 h-14`}>
                                                <div className={`w-full h-full rounded-xl flex items-center justify-center font-bold text-white ${
                                                    index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-2xl'
                                                    : index === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-xl'
                                                    : index === 2 ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-xl'
                                                    : 'bg-gradient-to-br from-slate-500 to-slate-600'
                                                }`}>
                                                    {candidate.finalRank ?? index + 1}
                                                    {index < 3 && (
                                                        <div className="absolute -top-2 -right-2">
                                                            <Trophy className={`w-5 h-5 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-blue-400' : 'text-green-400'}`} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ml-4">
                                                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{candidate.name}</h3>
                                                {candidate.email && <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>{candidate.email}</p>}
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {/* *** Red-flag override recommendation *** */}
                                                    {renderRecommendationBadge(candidate)}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApplicationStatusBadge(candidate.applicationStatus)}`}>
                                                        {candidate.applicationStatus ?? 'Applied'}
                                                    </span>
                                                    {candidate.hireProbability != null && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getHireProbabilityColor(candidate.hireProbability)} text-white`}>
                                                            {candidate.hireProbability}% Hire Probability
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`text-center px-5 py-3 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Overall Score</div>
                                            <div className={`text-4xl font-bold ${getScoreColor(candidate.overallScore)}`}>{candidate.overallScore}</div>
                                        </div>
                                    </div>

                                    {/* Stage score cards — API field names, all 0-100 */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        {[
                                            { label: 'Semantic Analysis', value: candidate.semanticScore,    sub: 'CV match · 20%' },
                                            { label: 'Technical Test',    value: candidate.assessmentScore,  sub: 'Assessment · 25%' },
                                            { label: 'Tech Interview',    value: candidate.technicalScore,   sub: 'Technical · 30%' },
                                            { label: 'HR Interview',      value: candidate.hrScore,          sub: 'Culture · 25%' },
                                        ].map(s => (
                                            <div key={s.label} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                                <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>{s.label}</div>
                                                <div className={`text-2xl font-bold ${s.value != null ? 'text-accent-600' : isDarkMode ? 'text-gray-500' : 'text-base-400'}`}>
                                                    {s.value ?? '—'}
                                                </div>
                                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-base-400'}`}>{s.sub}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Skills */}
                                    {candidate.skills.length > 0 && (
                                        <div className="mb-5">
                                            <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Key Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {candidate.skills.map((skill, si) => (
                                                    <span key={si} className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-slate-600 text-gray-200' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700'}`}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action row */}
                                    <div className={`flex flex-wrap justify-between items-center pt-5 border-t ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <button onClick={() => toggleCandidateShortlist(candidate)} className={`font-semibold flex items-center text-sm ${isDarkMode ? 'text-accent-400 hover:text-accent-300' : 'text-accent-600 hover:text-accent-800'}`}>
                                                <Star className="w-4 h-4 mr-1.5" fill={shortlistedKeys.has(candidate.id) ? 'currentColor' : 'none'} />
                                                {shortlistedKeys.has(candidate.id) ? 'Shortlisted' : 'Shortlist'}
                                            </button>
                                            <button onClick={() => setShowCVModal(candidate)} className={`font-semibold flex items-center text-sm ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-base-600 hover:text-base-900'}`}>
                                                <FileText className="w-4 h-4 mr-1.5" />
                                                View CV
                                            </button>
                                            {/* SHAP AI Insight button */}
                                            <button onClick={() => openShapDrawer(candidate)} className={`font-semibold flex items-center text-sm ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}>
                                                <Brain className="w-4 h-4 mr-1.5" />
                                                AI Insight
                                            </button>
                                            <button
                                                onClick={() => setExpandedRows(prev => { const n = new Set(prev); n.has(candidate.id) ? n.delete(candidate.id) : n.add(candidate.id); return n; })}
                                                className={`font-semibold flex items-center text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-base-500 hover:text-base-800'}`}
                                            >
                                                {expandedRows.has(candidate.id) ? <><ChevronUp className="w-4 h-4 mr-1" />Hide</> : <><ChevronDown className="w-4 h-4 mr-1" />Details</>}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3 md:mt-0">
                                            <button
                                                onClick={() => extendOffer(candidate)}
                                                className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center text-sm"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Extend Offer
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expandable detail drawer */}
                                    {expandedRows.has(candidate.id) && (
                                        <div className={`mt-5 pt-5 border-t ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Score breakdown bars — all 0-100 */}
                                                <div>
                                                    <h4 className={`font-bold mb-3 text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Score Breakdown</h4>
                                                    <div className="space-y-2">
                                                        {[
                                                            { label: 'Semantic Analysis (20%)',   value: candidate.semanticScore   },
                                                            { label: 'Technical Assessment (25%)', value: candidate.assessmentScore },
                                                            { label: 'Technical Interview (30%)',  value: candidate.technicalScore  },
                                                            { label: 'HR Interview (25%)',         value: candidate.hrScore         },
                                                        ].map(row => (
                                                            <div key={row.label}>
                                                                <div className="flex justify-between text-xs mb-0.5">
                                                                    <span className={isDarkMode ? 'text-gray-400' : 'text-base-600'}>{row.label}</span>
                                                                    <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-base-800'}`}>{row.value ?? '—'}</span>
                                                                </div>
                                                                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-base-200'}`}>
                                                                    <div
                                                                        className="h-2 rounded-full bg-gradient-to-r from-base-500 to-accent-500"
                                                                        style={{ width: `${Math.min(100, row.value ?? 0)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Strengths + Concerns */}
                                                <div className="space-y-4">
                                                    {candidate.strengths?.length > 0 && (
                                                        <div>
                                                            <h4 className={`font-bold mb-2 text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Strengths</h4>
                                                            <ul className="space-y-1">
                                                                {candidate.strengths.map((s, si) => (
                                                                    <li key={si} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                        <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>{s}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {candidate.concerns?.length > 0 && (
                                                        <div>
                                                            <h4 className={`font-bold mb-2 text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Concerns</h4>
                                                            <ul className="space-y-1">
                                                                {candidate.concerns.map((c, ci) => (
                                                                    <li key={ci} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                        <span className="text-orange-400 mt-0.5 flex-shrink-0">!</span>{c}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Matched skills */}
                                            {candidate.matchedSkills?.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className={`font-bold mb-2 text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Matched Skills</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {candidate.matchedSkills.map((s, si) => (
                                                            <span key={si} className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>✓ {s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* GenAI Evidence */}
                                            {candidate.genaiEvidence && Object.keys(candidate.genaiEvidence).length > 0 && (
                                                <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-slate-700 border border-slate-600' : 'bg-amber-50 border border-amber-200'}`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Zap className="w-4 h-4 text-amber-500" />
                                                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>AI/ML Evidence Detected</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(candidate.genaiEvidence).flatMap(([cat, terms]) =>
                                                            terms.map(t => (
                                                                <span key={`${cat}-${t}`} className={`px-2 py-0.5 rounded text-xs font-medium ${isDarkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700'}`}>{t}</span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Final actions */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={makeFinalSelection}
                                className="px-8 py-4 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-xl font-semibold transition-all flex items-center"
                            >
                                <CheckCircle className="w-6 h-6 mr-3" />
                                Export Final Selection
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ================================================================ */}
            {/* SHAP Drawer — slides in from the right                           */}
            {/* ================================================================ */}
            {shapDrawer && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div className="flex-1 bg-black bg-opacity-60" onClick={() => setShapDrawer(null)} />

                    {/* Panel */}
                    <div className={`w-full max-w-2xl h-full overflow-y-auto shadow-2xl flex flex-col ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        {/* Drawer header */}
                        <div className={`sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-base-200'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-accent-500 rounded-lg flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className={`font-bold text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        AI Explanation
                                    </h2>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
                                        SHAP waterfall — {shapDrawer.candidate.name}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShapDrawer(null)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-base-100 text-base-600'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-8 py-6 space-y-6">
                            {/* Red-flag banner */}
                            {shapDrawer.candidate.redFlag && (
                                <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDarkMode ? 'bg-red-950/40 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                                    <div>
                                        <p className="font-bold text-sm">Red Flag Detected</p>
                                        <p className="text-sm mt-0.5">{shapDrawer.candidate.redFlagReason}</p>
                                    </div>
                                </div>
                            )}

                            {/* Loading spinner */}
                            {shapLoading && (
                                <div className="flex flex-col items-center py-16 gap-4">
                                    <Loader className="w-10 h-10 text-accent-500 animate-spin" />
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Loading SHAP report…</p>
                                </div>
                            )}

                            {/* Error */}
                            {!shapLoading && shapDrawer.error && (
                                <div className={`p-4 rounded-xl text-sm ${isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-600'}`}>
                                    {shapDrawer.error}
                                </div>
                            )}

                            {/* SHAP report content */}
                            {!shapLoading && shapDrawer.report && (() => {
                                const r = shapDrawer.report;
                                return (
                                    <>
                                        {/* Score summary */}
                                        <div className={`grid grid-cols-3 gap-4 p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-base-50'}`}>
                                            <div className="text-center">
                                                <div className={`text-3xl font-bold ${getScoreColor(r.overallScore)}`}>{r.overallScore}</div>
                                                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Overall Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-base-900'}`}>#{r.finalRank ?? '—'}</div>
                                                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Final Rank</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-sm font-bold mt-1 ${r.redFlag ? 'text-red-500' : 'text-green-500'}`}>
                                                    {r.redFlag ? '⚠ Flagged' : '✓ Clean'}
                                                </div>
                                                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Red Flag Status</div>
                                            </div>
                                        </div>

                                        {/* Waterfall chart */}
                                        <div>
                                            <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Score Contribution Waterfall</h3>
                                            <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-500' : 'text-base-400'}`}>
                                                Each bar shows how much a stage pushed the score above or below the 50-point baseline.
                                                Green = positive contribution · Red = negative contribution.
                                            </p>
                                            <SHAPWaterfallChart report={r} isDarkMode={isDarkMode} />
                                        </div>

                                        {/* Stage weights reference */}
                                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-base-50'}`}>
                                            <h4 className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Pipeline Weights</h4>
                                            <div className="grid grid-cols-4 gap-3">
                                                {[
                                                    { label: 'CV Screening',   w: r.weightScreening    ?? 0.20 },
                                                    { label: 'Assessment',     w: r.weightAssessment   ?? 0.25 },
                                                    { label: 'Tech Interview', w: r.weightTechInterview ?? 0.30 },
                                                    { label: 'HR Interview',   w: r.weightHrInterview  ?? 0.25 },
                                                ].map(s => (
                                                    <div key={s.label} className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white border border-base-200'}`}>
                                                        <div className="text-xl font-bold text-accent-600">{Math.round(s.w * 100)}%</div>
                                                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>{s.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* AI narrative */}
                                        {r.shapSummary && (
                                            <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-purple-950/30 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>AI Narrative</h4>
                                                </div>
                                                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-purple-200' : 'text-purple-900'}`}>{r.shapSummary}</p>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* CV Modal                                                          */}
            {/* ================================================================ */}
            {showCVModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{showCVModal.name}</h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Candidate Profile</p>
                                </div>
                                <button onClick={() => setShowCVModal(null)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-base-100 text-base-600'}`}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Email</div>
                                            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{showCVModal.email || '—'}</div>
                                        </div>
                                        <div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Phone</div>
                                            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{showCVModal.phone || '—'}</div>
                                        </div>
                                        <div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Experience</div>
                                            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{showCVModal.experience || '—'}</div>
                                        </div>
                                        <div>
                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Education</div>
                                            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{showCVModal.education || '—'}</div>
                                        </div>
                                    </div>
                                </div>

                                {showCVModal.summary && (
                                    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                        <h3 className={`font-bold mb-2 text-sm ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Summary</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{showCVModal.summary}</p>
                                    </div>
                                )}

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`font-bold mb-3 text-sm ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Pipeline Scores</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        {[
                                            { label: 'Semantic',     value: showCVModal.semanticScore   },
                                            { label: 'Assessment',   value: showCVModal.assessmentScore },
                                            { label: 'Tech Intv.',   value: showCVModal.technicalScore  },
                                            { label: 'HR Intv.',     value: showCVModal.hrScore         },
                                        ].map(s => (
                                            <div key={s.label}>
                                                <div className="text-2xl font-bold text-accent-600">{s.value ?? '—'}</div>
                                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {showCVModal.skills?.length > 0 && (
                                    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                        <h3 className={`font-bold mb-3 text-sm ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {showCVModal.skills.map((s, i) => (
                                                <span key={i} className={`px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-slate-600 text-gray-200' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700'}`}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => downloadCV(showCVModal)} className="bg-gradient-to-r from-base-600 to-accent-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center text-sm">
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </button>
                                <button onClick={() => setShowCVModal(null)} className={`px-5 py-2.5 border-2 rounded-lg font-semibold text-sm ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* Offer Modal                                                       */}
            {/* ================================================================ */}
            {showOfferModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Extend Offer — {showOfferModal.name}</h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Fill in the details to send via email</p>
                                </div>
                                <button onClick={() => setShowOfferModal(null)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-base-100 text-base-600'}`}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (showOfferModal?.id && selectedAppId) {
                                        sendOffer(selectedAppId, showOfferModal.id, offerFormData)
                                            .then(() => toast.success(`Offer sent to ${showOfferModal.name}!`))
                                            .catch(err => toast.error(err.message || 'Failed to send offer'));
                                    }
                                    setShowOfferModal(null);
                                }}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {[
                                        { label: 'Position Title',       key: 'position',    placeholder: 'e.g. Senior Backend Engineer', type: 'text',  required: true },
                                        { label: 'Salary / Compensation',key: 'salary',      placeholder: 'e.g. 25,000 EGP / month',      type: 'text',  required: true },
                                        { label: 'Start Date',           key: 'startDate',   placeholder: '',                             type: 'date',  required: true },
                                        { label: 'Department',           key: 'department',  placeholder: 'e.g. Engineering',             type: 'text',  required: true },
                                        { label: 'Reporting To',         key: 'reportingTo', placeholder: 'e.g. CTO',                     type: 'text',  required: false },
                                        { label: 'Location',             key: 'location',    placeholder: 'e.g. Cairo, Egypt',            type: 'text',  required: true },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{f.label}</label>
                                            <input
                                                type={f.type}
                                                required={f.required}
                                                value={offerFormData[f.key]}
                                                onChange={e => setOfferFormData({ ...offerFormData, [f.key]: e.target.value })}
                                                placeholder={f.placeholder}
                                                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Contract Type</label>
                                        <select
                                            value={offerFormData.contractType}
                                            onChange={e => setOfferFormData({ ...offerFormData, contractType: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                        >
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Benefits &amp; Perks</label>
                                        <textarea
                                            rows={2}
                                            value={offerFormData.benefits}
                                            onChange={e => setOfferFormData({ ...offerFormData, benefits: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Additional Notes</label>
                                        <textarea
                                            rows={2}
                                            value={offerFormData.notes}
                                            onChange={e => setOfferFormData({ ...offerFormData, notes: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-600">
                                    <button type="button" onClick={() => setShowOfferModal(null)} className={`px-6 py-2.5 border-2 rounded-lg font-semibold text-sm ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-8 py-2.5 rounded-lg font-semibold flex items-center text-sm">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Send Offer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
