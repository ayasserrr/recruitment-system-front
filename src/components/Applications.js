import React, { useMemo, useState } from 'react';
import { List, ChevronRight, Briefcase, Calendar, ArrowLeft, CheckCircle } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Applications({ applications, onBackToDashboard }) {
    const { isDarkMode } = useDarkMode();
    const [selectedId, setSelectedId] = useState(null);

    const selectedApplication = useMemo(() => {
        if (!selectedId) return null;
        return applications.find((a) => a.id === selectedId) || null;
    }, [applications, selectedId]);

    const totals = useMemo(() => {
        return applications.reduce(
            (acc, app) => {
                acc.cvs += app.cvs || 0;
                acc.finalCandidates += app.finalCandidates || 0;
                acc.positions += 1;
                return acc;
            },
            { cvs: 0, finalCandidates: 0, positions: 0 }
        );
    }, [applications]);

    const statusStyles = (status) => {
        if (status === 'Final Stage') return 'bg-green-100 text-green-700';
        if (status === 'CV Collection') return 'bg-indigo-100 text-indigo-700';
        if (status === 'Submitted') return 'bg-blue-100 text-blue-700';
        return 'bg-slate-100 text-slate-700';
    };

    const getDarkModeStatusStyles = (status) => {
        if (status === 'Final Stage') return 'bg-green-900 text-green-300';
        if (status === 'CV Collection') return 'bg-indigo-900 text-indigo-300';
        if (status === 'Submitted') return 'bg-blue-900 text-blue-300';
        return 'bg-slate-700 text-slate-300';
    };

    const safePercent = (numerator, denominator) => {
        const d = denominator > 0 ? denominator : 1;
        return Math.round((numerator / d) * 100);
    };

    if (selectedApplication) {
        const req = selectedApplication.requisition || {};

        const stages = [
            { label: 'CVs', value: selectedApplication.cvs || 0, color: 'bg-slate-50', textColor: 'text-slate-800' },
            { label: 'Semantic', value: selectedApplication.semantic || 0, color: 'bg-purple-50', textColor: 'text-purple-600' },
            { label: 'Assessment', value: selectedApplication.assessment || 0, color: 'bg-orange-50', textColor: 'text-orange-600' },
            { label: 'Tech Interview', value: selectedApplication.techInterview || 0, color: 'bg-red-50', textColor: 'text-red-600' },
            { label: 'HR Interview', value: selectedApplication.hrInterview || 0, color: 'bg-pink-50', textColor: 'text-pink-600' },
            { label: 'Final', value: selectedApplication.finalCandidates || 0, color: 'bg-yellow-50', textColor: 'text-yellow-600' },
        ];

        const process = [
            { title: 'CV Collection', description: 'Collect and review CVs', value: selectedApplication.cvs || 0 },
            { title: 'Semantic Analysis', description: 'AI matching & filtering', value: selectedApplication.semantic || 0 },
            { title: 'Technical Assessment', description: 'Online technical test', value: selectedApplication.assessment || 0, threshold: req.assessmentCandidatesToAdvance },
            { title: 'Technical Interview', description: 'Technical evaluation', value: selectedApplication.techInterview || 0, threshold: req.technicalInterviewCandidatesToAdvance },
            { title: 'HR Interview', description: 'Cultural fit assessment', value: selectedApplication.hrInterview || 0, threshold: req.hrInterviewCandidatesToAdvance },
            { title: 'Final Selection', description: 'Shortlist for decision', value: selectedApplication.finalCandidates || 0 },
        ];

        return (
            <div className={`min-h-screen transition-colors duration-300 p-6 md:p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
                <div className="max-w-7xl mx-auto">
                    <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className={`mb-6 font-semibold flex items-center transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-600 hover:text-base-800'}`}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Applications
                    </button>

                    <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <h1 className={`text-3xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{selectedApplication.jobTitle}</h1>
                                </div>
                                <div className={`mt-2 flex items-center transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Posted on {selectedApplication.posted}</span>
                                </div>
                            </div>

                            <div className={`px-4 py-2 rounded-full font-semibold ${statusStyles(selectedApplication.status)}`}>
                                {selectedApplication.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                            {stages.map((s) => (
                                <div key={s.label} className={`p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                    <div className={`text-sm mb-1 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>{s.label}</div>
                                    <div className="text-2xl font-bold text-accent-600">{s.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <h2 className={`text-xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Process</h2>

                                <div className="space-y-4">
                                    {process.map((p, idx) => (
                                        <div key={idx} className={`border rounded-xl p-5 transition-all ${isDarkMode ? 'border-slate-600 hover:shadow-lg hover:shadow-slate-900' : 'border-base-200 hover:shadow-lg hover:shadow-base-200'}`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-accent-600" />
                                                        <h3 className={`text-lg font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{p.title}</h3>
                                                    </div>
                                                    <p className={`text-sm mt-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{p.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Count</div>
                                                    <div className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{p.value}</div>
                                                </div>
                                            </div>

                                            {typeof p.threshold === 'number' && (
                                                <div className={`mt-3 text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                    Candidates to advance after this phase: <span className={`font-semibold transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-900'}`}>{p.threshold}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className={`text-xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Requisition Details</h2>
                                <div className={`border rounded-xl p-5 space-y-4 transition-colors ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                    <div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Platforms</div>
                                        <div className={`font-semibold transition-colors ${isDarkMode ? 'text-gray-200' : 'text-base-900'}`}>
                                            {(req.selectedPlatforms || []).length ? (req.selectedPlatforms || []).join(', ') : 'Not set'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>CV Collection Window</div>
                                        <div className={`font-semibold transition-colors ${isDarkMode ? 'text-gray-200' : 'text-base-900'}`}>
                                            {(req.postingStartDate || '—') + ' to ' + (req.postingEndDate || '—')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Assessment Type</div>
                                        <div className={`font-semibold transition-colors ${isDarkMode ? 'text-gray-200' : 'text-base-900'}`}>{req.assessmentType || 'Not set'}</div>
                                    </div>
                                    <div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Technical Interview Duration</div>
                                        <div className={`font-semibold transition-colors ${isDarkMode ? 'text-gray-200' : 'text-base-900'}`}>{(req.technicalInterviewDuration || '45') + ' minutes'}</div>
                                    </div>
                                    <div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>HR Interview Duration</div>
                                        <div className={`font-semibold transition-colors ${isDarkMode ? 'text-gray-200' : 'text-base-900'}`}>{(req.hrInterviewDuration || '45') + ' minutes'}</div>
                                    </div>
                                </div>

                                <div className={`mt-6 border rounded-xl p-5 transition-colors ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`text-sm font-semibold transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Overall Progress</span>
                                        <span className={`text-sm font-semibold transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            {safePercent(selectedApplication.finalCandidates || 0, selectedApplication.cvs || 0)}%
                                        </span>
                                    </div>
                                    <div className={`w-full rounded-full h-3 transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-base-200'}`}>
                                        <div
                                            className="bg-gradient-to-r from-base-500 to-accent-500 h-3 rounded-full transition-all"
                                            style={{ width: `${safePercent(selectedApplication.finalCandidates || 0, selectedApplication.cvs || 0)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 p-6 md:p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Application Management</h1>
                        <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Track and manage all job applications in one place</p>
                    </div>
                    <button
                        type="button"
                        onClick={onBackToDashboard}
                        className={`font-semibold flex items-center transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-600 hover:text-base-800'}`}
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                    <div className="flex items-center mb-6">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-lg mr-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-base-500 to-accent-500'}`}>
                            <List className="w-6 h-6 text-white" />
                        </div>
                        <h2 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Applications Overview</h2>
                    </div>

                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-6 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                            <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{totals.cvs}</div>
                            <div className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Total CVs Received</div>
                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Across all positions</div>
                        </div>

                        <div className={`p-6 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                            <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{totals.finalCandidates}</div>
                            <div className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Final Candidates</div>
                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Ready for hiring decision</div>
                        </div>

                        <div className={`p-6 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-gradient-to-br from-base-100 to-accent-100'}`}>
                            <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>{totals.positions}</div>
                            <div className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Active Positions</div>
                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Currently recruiting</div>
                        </div>
                    </div>

                    {applications.length === 0 ? (
                        <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                            <p className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>No applications yet</p>
                            <p className={`mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Submit a Job Requisition to create your first application record.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className={`border-2 rounded-xl p-6 transition-colors hover:shadow-lg ${isDarkMode ? 'border-slate-600 hover:border-accent-400 hover:shadow-slate-900' : 'border-base-200 hover:border-accent-500 hover:shadow-base-200'}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{app.jobTitle}</h3>
                                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Posted on {app.posted}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${isDarkMode ? getDarkModeStatusStyles(app.status) : statusStyles(app.status)}`}>{app.status}</div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                                        <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>CVs</div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{app.cvs}</div>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Semantic</div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{app.semantic}</div>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Assessment</div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{app.assessment}</div>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Tech Interview</div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{app.techInterview}</div>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>HR Interview</div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{app.hrInterview}</div>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-gradient-to-br from-base-100 to-accent-100'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Final</div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>{app.finalCandidates}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Overall Progress</span>
                                            <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{safePercent(app.finalCandidates, app.cvs)}%</span>
                                        </div>
                                        <div className={`w-full rounded-full h-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-200'}`}>
                                            <div
                                                className="bg-gradient-to-r from-base-500 to-accent-500 h-3 rounded-full transition-all"
                                                style={{ width: `${safePercent(app.finalCandidates, app.cvs)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedId(app.id)}
                                            className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
