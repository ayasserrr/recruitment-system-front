import React, { useMemo, useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Upload, Send, Eye, Users, Briefcase, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function JobPost({ applications, onUpdateApplication, onBackToDashboard, onViewCVs, onOpenSemanticAnalysis }) {
    const { isDarkMode } = useDarkMode();
    const [selectedId, setSelectedId] = useState(null);

    const platformLabel = (id) => {
        if (id === 'linkedin') return 'LinkedIn';
        if (id === 'indeed') return 'Indeed';
        if (id === 'glassdoor') return 'Glassdoor';
        return id;
    };

    const buildDefaultProgress = (app) => {
        const req = app.requisition || {};
        const platforms = Array.isArray(req.selectedPlatforms) ? req.selectedPlatforms.map(platformLabel) : [];
        const endDate = String(req.postingEndDate || '').trim();

        const receivingStatus = app.status === 'CV Collection' || app.status === 'In Progress' ? 'active' : 'pending';

        return [
            {
                id: 1,
                step: 'Job Post Created',
                status: 'completed',
                icon: CheckCircle,
                date: app.posted || '',
                time: 'Submitted',
            },
            {
                id: 2,
                step: 'Bias Detection',
                status: 'completed',
                icon: CheckCircle,
                note: 'No bias detected',
                date: app.posted || '',
                time: 'Auto-check',
            },
            {
                id: 3,
                step: 'Posted to Platforms',
                status: platforms.length ? 'completed' : 'pending',
                icon: Send,
                platforms,
                date: app.posted || '',
                time: platforms.length ? 'Auto' : '',
            },
            {
                id: 4,
                step: 'Receiving CVs',
                status: receivingStatus,
                icon: Upload,
                ...(app.cvs > 0 ? { count: app.cvs } : {}),
                ...(app.newToday > 0 ? { newToday: app.newToday } : {}),
                date: app.posted || '',
                time: receivingStatus === 'active' ? 'Ongoing' : '',
            },
            {
                id: 5,
                step: 'Closed',
                status: app.status === 'Closed' ? 'completed' : 'pending',
                icon: Clock,
                scheduledDate: endDate || '',
                date: app.status === 'Closed' ? endDate : '',
                time: app.status === 'Closed' ? 'Closed' : '',
            },
        ];
    };

    const selectedApplication = useMemo(() => {
        if (!selectedId) return null;
        return applications.find((a) => a.id === selectedId) || null;
    }, [applications, selectedId]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'active':
                return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
            case 'pending':
                return <Clock className="w-6 h-6 text-slate-400" />;
            default:
                return <AlertCircle className="w-6 h-6 text-slate-400" />;
        }
    };

    const statusPill = (status) => {
        if (status === 'completed') return 'bg-green-100 text-green-700';
        if (status === 'active') return 'bg-blue-100 text-blue-700';
        return 'bg-slate-200 text-slate-600';
    };

    const safePercent = (numerator, denominator) => {
        const d = denominator > 0 ? denominator : 1;
        return Math.round((numerator / d) * 100);
    };

    const ensureProgress = (app) => {
        if (Array.isArray(app.postingProgress) && app.postingProgress.length) return app.postingProgress;
        const next = buildDefaultProgress(app);
        if (typeof onUpdateApplication === 'function') {
            onUpdateApplication(app.id, { postingProgress: next });
        }
        return next;
    };

    const deriveApplicationStatusFromProgress = (progress) => {
        const closed = progress.find((p) => p.id === 5);
        if (closed?.status === 'completed') return 'Closed';

        const receiving = progress.find((p) => p.id === 4);
        if (receiving?.status === 'active') return 'CV Collection';

        const posted = progress.find((p) => p.id === 3);
        if (posted?.status === 'completed') return 'Posted';

        return 'Submitted';
    };

    const handleStepClick = (app, stepId) => {
        const progress = ensureProgress(app);
        const idx = progress.findIndex((p) => p.id === stepId);
        if (idx === -1) return;

        const current = progress[idx];
        const nextProgress = progress.map((p) => ({ ...p }));

        if (current.status === 'completed') return;

        if (current.status === 'active') {
            nextProgress[idx].status = 'completed';
            if (nextProgress[idx].step === 'Receiving CVs') {
                nextProgress[idx].time = 'Completed';
            }
            if (idx + 1 < nextProgress.length) {
                nextProgress[idx + 1].status = 'active';
                if (nextProgress[idx + 1].step === 'Closed') {
                    nextProgress[idx + 1].time = 'Ongoing';
                }
            }
        } else {
            nextProgress.forEach((p, i) => {
                if (i < idx) p.status = 'completed';
            });
            nextProgress[idx].status = 'active';
        }

        if (typeof onUpdateApplication === 'function') {
            onUpdateApplication(app.id, {
                postingProgress: nextProgress,
                status: deriveApplicationStatusFromProgress(nextProgress),
            });
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 p-6 md:p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Job Posting</h1>
                        <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Select an application to track posting progress and CV collection</p>
                    </div>
                    <button
                        type="button"
                        onClick={onBackToDashboard}
                        className={`font-semibold flex items-center transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-600 hover:text-base-800'}`}
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className={`rounded-2xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg mr-3">
                                    <Briefcase className="w-5 h-5 text-white" />
                                </div>
                                <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Applications</h2>
                            </div>

                            {applications.length === 0 ? (
                                <div className={`border border-dashed rounded-xl p-6 text-center transition-colors ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                    <p className={`font-semibold transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>No applications yet</p>
                                    <p className={`mt-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Submit a Job Requisition to create an application.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {applications.map((app) => (
                                        <button
                                            type="button"
                                            key={app.id}
                                            onClick={() => setSelectedId(app.id)}
                                            className={`w-full text-left border-2 rounded-xl p-4 transition-colors ${selectedId === app.id
                                                ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50'
                                                : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-base-200 hover:border-accent-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className={`font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{app.jobTitle}</div>
                                                    <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Posted: {app.posted}</div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${isDarkMode ? 'bg-slate-600 text-gray-200' : 'bg-gradient-to-r from-base-100 to-accent-100 text-base-700'}`}>
                                                    {app.status || 'Submitted'}
                                                </div>
                                            </div>

                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                                    <div className={`text-xs transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>CVs</div>
                                                    <div className={`text-lg font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{app.cvs || 0}</div>
                                                </div>
                                                <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                                    <div className={`text-xs transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Semantic Ready</div>
                                                    <div className="text-lg font-bold text-accent-600">{app.semantic || 0}</div>
                                                </div>
                                                <div className={`p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                                    <div className={`text-xs transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Platforms</div>
                                                    <div className={`text-lg font-bold transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{app.requisition?.selectedPlatforms?.length || 0}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {!selectedApplication ? (
                            <div className={`rounded-2xl shadow-lg p-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                                <h3 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Posting Progress</h3>
                                <p className={`mt-2 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Choose an application from the left to view its posting progress.</p>
                            </div>
                        ) : (
                            <PostingProgress
                                application={selectedApplication}
                                ensureProgress={ensureProgress}
                                onStepClick={(stepId) => handleStepClick(selectedApplication, stepId)}
                                getStatusIcon={getStatusIcon}
                                statusPill={statusPill}
                                safePercent={safePercent}
                                onViewCVs={onViewCVs}
                                onOpenSemanticAnalysis={onOpenSemanticAnalysis}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostingProgress({ application, ensureProgress, onStepClick, getStatusIcon, statusPill, safePercent, onViewCVs, onOpenSemanticAnalysis }) {
    const { isDarkMode } = useDarkMode();
    const progress = ensureProgress(application);
    const req = application.requisition || {};

    const totalCandidates = application.cvs || 0;
    const viewedCandidates = application.semantic || 0;
    const newToday = application.newToday || 0;

    const platforms = Array.isArray(req.selectedPlatforms) ? req.selectedPlatforms : [];
    const platformText = platforms.length ? platforms.map((p) => (typeof p === 'string' ? p : String(p))).join(', ') : 'Not set';
    const windowText = `${req.postingStartDate || '—'} to ${req.postingEndDate || '—'}`;

    const started = application.posted || (req.postingStartDate || '—');

    const completion = safePercent(
        progress.filter((p) => p.status === 'completed').length,
        progress.length
    );

    const activeStep = progress.find((p) => p.status === 'active');
    const nextStepTitle = activeStep?.step || 'Select a step';

    const nextPhaseTitle = nextStepTitle;
    const semanticReady = viewedCandidates > 0 ? viewedCandidates : totalCandidates;

    return (
        <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Posting Progress</h3>
                <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Started: {started} • Job: {application.jobTitle}</div>
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`border rounded-xl p-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-base-200 bg-base-50'}`}>
                    <div className={`text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Posting Platforms</div>
                    <div className={`mt-1 font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{platformText}</div>
                </div>
                <div className={`border rounded-xl p-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-base-200 bg-base-50'}`}>
                    <div className={`text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>CV Collection Window</div>
                    <div className={`mt-1 font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{windowText}</div>
                </div>
                <div className={`border rounded-xl p-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-base-200 bg-base-50'}`}>
                    <div className={`text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Posting Status</div>
                    <div className={`mt-1 font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{application.status || 'Submitted'}</div>
                </div>
            </div>

            <div className="relative mb-8">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-base-500 to-accent-500"></div>
                <div className="space-y-6">
                    {progress.map((item) => (
                        <div key={item.id} className="relative flex items-start">
                            <div
                                className={`z-10 flex items-center justify-center w-12 h-12 rounded-full mr-6 ${item.status === 'completed'
                                    ? 'bg-gradient-to-r from-base-100 to-accent-100 border-2 border-accent-500'
                                    : item.status === 'active'
                                        ? 'bg-gradient-to-r from-base-100 to-accent-100 border-2 border-base-500 animate-pulse'
                                        : 'bg-base-100 border-2 border-base-300'
                                    }`}
                            >
                                {getStatusIcon(item.status)}
                            </div>
                            <div
                                className={`flex-1 p-4 rounded-lg cursor-pointer transition-all ${item.status === 'completed'
                                    ? isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'
                                    : item.status === 'active'
                                        ? isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'
                                        : isDarkMode ? 'bg-slate-700' : 'bg-base-50'
                                    }`}
                                onClick={() => onStepClick(item.id)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-bold text-lg transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{item.step}</h4>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${isDarkMode ? (item.status === 'completed' ? 'bg-green-900 text-green-300' : item.status === 'active' ? 'bg-blue-900 text-blue-300' : 'bg-slate-600 text-slate-300') : statusPill(item.status)}`}>
                                        {item.status === 'completed' ? 'Completed' : item.status === 'active' ? 'Active' : 'Pending'}
                                    </div>
                                </div>

                                <div className={`text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                    {item.date && item.time ? `${item.date} • ${item.time}` : 'Scheduled'}
                                </div>

                                {item.note && (
                                    <div className={`flex items-center text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        <CheckCircle className="w-4 h-4 text-accent-500 mr-2" />
                                        {item.note}
                                    </div>
                                )}

                                {item.platforms && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {item.platforms.map((platform, i) => (
                                            <span key={i} className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-gradient-to-r from-base-200 to-accent-200 text-base-700'}`}>
                                                {platform}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {typeof item.count === 'number' && (
                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>
                                            <Users className="w-4 h-4 mr-2" />
                                            {item.count} CVs received
                                            {item.newToday ? (
                                                <span className={`ml-3 px-2 py-1 rounded text-xs transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-accent-400' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700'}`}>+{item.newToday} today</span>
                                            ) : null}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onViewCVs?.(item)}
                                            className={`text-sm font-medium flex items-center transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-600 hover:text-base-800'}`}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </button>
                                    </div>
                                )}

                                {item.scheduledDate && (
                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Scheduled for: <span className="font-semibold">{item.scheduledDate}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`border-t pt-6 transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                <h4 className={`text-lg font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Posting Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {totalCandidates > 0 && (
                        <div className={`p-4 rounded-lg shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 shadow-slate-800' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-600'}`}>{totalCandidates}</div>
                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>CVs Received</div>
                                </div>
                                <Users className="w-8 h-8 text-accent-400" />
                            </div>
                        </div>
                    )}

                    {newToday > 0 && (
                        <div className={`p-4 rounded-lg shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 shadow-slate-800' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-accent-600">{newToday}</div>
                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>New Today</div>
                                </div>
                                <Upload className="w-8 h-8 text-accent-400" />
                            </div>
                        </div>
                    )}

                    {viewedCandidates > 0 && (
                        <div className={`p-4 rounded-lg shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 shadow-slate-800' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-accent-600">{viewedCandidates}</div>
                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Ready for Semantic</div>
                                </div>
                                <Eye className="w-8 h-8 text-accent-400" />
                            </div>
                        </div>
                    )}

                    <div className={`p-4 rounded-lg shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 shadow-slate-800' : 'bg-gradient-to-br from-base-100 to-accent-100 shadow-base-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-600'}`}>{completion}%</div>
                                <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Completion</div>
                            </div>
                            <Clock className="w-8 h-8 text-accent-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border border-slate-600 shadow-slate-800' : 'bg-gradient-to-r from-base-50 to-accent-50 border border-base-200 shadow-base-200'}`}>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h5 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Next Step: {nextPhaseTitle}</h5>
                        <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{semanticReady} candidates ready for semantic analysis & ranking</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onOpenSemanticAnalysis?.()}
                        className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Open Semantic Analysis
                    </button>
                </div>
            </div>
        </div>
    );
}
