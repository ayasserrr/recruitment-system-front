import React, { useMemo, useState } from 'react';
import { List, ChevronRight, Briefcase, Calendar, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Applications({ applications, onBackToDashboard }) {
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
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="mb-6 text-indigo-700 hover:text-indigo-900 font-semibold flex items-center"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Applications
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-7 h-7 text-indigo-600" />
                                    <h1 className="text-3xl font-bold text-slate-800">{selectedApplication.jobTitle}</h1>
                                </div>
                                <div className="mt-2 flex items-center text-slate-600">
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
                                <div key={s.label} className={`${s.color} p-4 rounded-lg`}>
                                    <div className="text-sm text-slate-600 mb-1">{s.label}</div>
                                    <div className={`text-2xl font-bold ${s.textColor}`}>{s.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Process</h2>

                                <div className="space-y-4">
                                    {process.map((p, idx) => (
                                        <div key={idx} className="border border-slate-200 rounded-xl p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                                                        <h3 className="text-lg font-semibold text-slate-800">{p.title}</h3>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-1">{p.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-slate-600">Count</div>
                                                    <div className="text-2xl font-bold text-slate-800">{p.value}</div>
                                                </div>
                                            </div>

                                            {typeof p.threshold === 'number' && (
                                                <div className="mt-3 text-sm text-slate-600">
                                                    Candidates to advance after this phase: <span className="font-semibold text-slate-800">{p.threshold}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Requisition Details</h2>
                                <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                                    <div>
                                        <div className="text-sm text-slate-600">Platforms</div>
                                        <div className="font-semibold text-slate-800">
                                            {(req.selectedPlatforms || []).length ? (req.selectedPlatforms || []).join(', ') : 'Not set'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-600">CV Collection Window</div>
                                        <div className="font-semibold text-slate-800">
                                            {(req.postingStartDate || '—') + ' to ' + (req.postingEndDate || '—')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-600">Assessment Type</div>
                                        <div className="font-semibold text-slate-800">{req.assessmentType || 'Not set'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-600">Technical Interview Duration</div>
                                        <div className="font-semibold text-slate-800">{(req.technicalInterviewDuration || '45') + ' minutes'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-600">HR Interview Duration</div>
                                        <div className="font-semibold text-slate-800">{(req.hrInterviewDuration || '45') + ' minutes'}</div>
                                    </div>
                                </div>

                                <div className="mt-6 border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-slate-600">Overall Progress</span>
                                        <span className="text-sm font-semibold text-slate-600">
                                            {safePercent(selectedApplication.finalCandidates || 0, selectedApplication.cvs || 0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3">
                                        <div
                                            className="bg-indigo-600 h-3 rounded-full transition-all"
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Application Management</h1>
                        <p className="text-slate-600">Track and manage all job applications in one place</p>
                    </div>
                    <button
                        type="button"
                        onClick={onBackToDashboard}
                        className="text-indigo-700 hover:text-indigo-900 font-semibold flex items-center"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <List className="w-10 h-10 text-indigo-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">Applications Overview</h2>
                    </div>

                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-indigo-50 p-6 rounded-xl">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{totals.cvs}</div>
                            <div className="text-sm font-semibold text-slate-700">Total CVs Received</div>
                            <div className="text-sm text-slate-500">Across all positions</div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-xl">
                            <div className="text-4xl font-bold text-green-600 mb-2">{totals.finalCandidates}</div>
                            <div className="text-sm font-semibold text-slate-700">Final Candidates</div>
                            <div className="text-sm text-slate-500">Ready for hiring decision</div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl">
                            <div className="text-4xl font-bold text-blue-600 mb-2">{totals.positions}</div>
                            <div className="text-sm font-semibold text-slate-700">Active Positions</div>
                            <div className="text-sm text-slate-500">Currently recruiting</div>
                        </div>
                    </div>

                    {applications.length === 0 ? (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
                            <p className="text-slate-700 font-semibold">No applications yet</p>
                            <p className="text-slate-500 mt-1">Submit a Job Requisition to create your first application record.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="border-2 border-slate-200 rounded-xl p-6 hover:border-indigo-500 transition-colors hover:shadow-lg"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className="text-2xl font-bold text-slate-800">{app.jobTitle}</h3>
                                            <p className="text-slate-600">Posted on {app.posted}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full font-semibold ${statusStyles(app.status)}`}>{app.status}</div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <div className="text-sm text-slate-600 mb-1">CVs</div>
                                            <div className="text-2xl font-bold text-slate-800">{app.cvs}</div>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-sm text-slate-600 mb-1">Semantic</div>
                                            <div className="text-2xl font-bold text-purple-600">{app.semantic}</div>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <div className="text-sm text-slate-600 mb-1">Assessment</div>
                                            <div className="text-2xl font-bold text-orange-600">{app.assessment}</div>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <div className="text-sm text-slate-600 mb-1">Tech Interview</div>
                                            <div className="text-2xl font-bold text-red-600">{app.techInterview}</div>
                                        </div>
                                        <div className="bg-pink-50 p-4 rounded-lg">
                                            <div className="text-sm text-slate-600 mb-1">HR Interview</div>
                                            <div className="text-2xl font-bold text-pink-600">{app.hrInterview}</div>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <div className="text-sm text-slate-600 mb-1">Final</div>
                                            <div className="text-2xl font-bold text-yellow-600">{app.finalCandidates}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-600">Overall Progress</span>
                                            <span className="text-sm font-semibold text-slate-600">{safePercent(app.finalCandidates, app.cvs)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-3">
                                            <div
                                                className="bg-indigo-600 h-3 rounded-full transition-all"
                                                style={{ width: `${safePercent(app.finalCandidates, app.cvs)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedId(app.id)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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
