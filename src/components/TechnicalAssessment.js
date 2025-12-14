import React, { useState, useMemo } from 'react';
import { ClipboardCheck, ChevronRight, Clock, CheckCircle, Send, Eye, TrendingUp, Users, Target, Award, FileText, Download, ArrowLeft } from 'lucide-react';

export default function TechnicalAssessment({ applications, onBack }) {
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showCVModal, setShowCVModal] = useState(null);
    const [showReportModal, setShowReportModal] = useState(null);

    const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);

    // Generate assessment data per application
    const generateAssessmentData = (app) => {
        const totalCandidates = app.semantic || 0;
        const sent = Math.min(totalCandidates, Math.floor(totalCandidates * 0.95));
        const completed = Math.floor(sent * 0.85);
        const pending = sent - completed;
        const status = totalCandidates > 0 && completed < sent ? 'active' : totalCandidates > 0 ? 'completed' : 'pending';
        const avgScore = completed > 0 ? 75 + Math.random() * 15 : 0;

        return {
            id: app.id,
            jobTitle: app.jobTitle,
            totalCandidates,
            sent,
            completed,
            pending,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status,
            avgScore: parseFloat(avgScore.toFixed(1)),
            duration: '60 minutes',
            questions: 15,
            passingScore: 70
        };
    };

    const [assessmentData, setAssessmentData] = useState(() => {
        return applications.map(app => generateAssessmentData(app));
    });

    // Generate candidate ranking per selected application
    const generateCandidateRanking = (app) => {
        const candidates = [];
        const names = ['Sarah Johnson', 'Michael Chen', 'Emma Williams', 'James Brown', 'Alex Rodriguez', 'Priya Sharma', 'David Kim', 'Lisa Wang', 'Robert Garcia', 'Maria Silva'];
        const count = Math.min(app.semantic || 0, 8);

        for (let i = 0; i < count; i++) {
            const score = 95 - Math.floor(Math.random() * 25);
            candidates.push({
                id: i + 1,
                name: names[i % names.length],
                score,
                technical: score >= 90 ? 'Excellent' : score >= 80 ? 'Very Good' : score >= 70 ? 'Good' : 'Average',
                problemSolving: score >= 85 ? 'Outstanding' : score >= 75 ? 'Very Good' : score >= 65 ? 'Good' : 'Fair',
                timeSpent: `${45 + Math.floor(Math.random() * 20)} min`,
                status: score >= 70 ? 'passed' : 'failed',
                codingScore: score + Math.floor(Math.random() * 10) - 5,
                theoryScore: score + Math.floor(Math.random() * 10) - 5,
                completed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            });
        }

        return candidates.sort((a, b) => b.score - a.score);
    };

    const [candidateRanking, setCandidateRanking] = useState([]);

    // Update candidate ranking when app changes
    React.useEffect(() => {
        if (selectedApp) {
            setCandidateRanking(generateCandidateRanking(selectedApp));
        } else {
            setCandidateRanking([]);
        }
    }, [selectedApp]);

    const assessmentStats = useMemo(() => {
        const total = assessmentData.length;
        const active = assessmentData.filter(a => a.status === 'active').length;
        const completed = assessmentData.filter(a => a.status === 'completed').length;
        const totalCandidates = assessmentData.reduce((sum, a) => sum + a.totalCandidates, 0);
        const completedCandidates = assessmentData.reduce((sum, a) => sum + a.completed, 0);
        const avgCompletionRate = totalCandidates > 0 ? Math.round((completedCandidates / totalCandidates) * 100) : 0;
        const avgScoreOverall = completedCandidates > 0
            ? parseFloat((assessmentData.reduce((sum, a) => sum + (a.avgScore * a.completed), 0) / completedCandidates).toFixed(1))
            : 0;

        return {
            totalAssessments: total,
            activeAssessments: active,
            completedAssessments: completed,
            totalCandidates,
            completedCandidates,
            avgCompletionRate,
            avgScoreOverall
        };
    }, [assessmentData]);

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-orange-600';
        return 'text-red-600';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getTechnicalLevelColor = (level) => {
        switch (level) {
            case 'Excellent': return 'bg-green-100 text-green-700';
            case 'Very Good': return 'bg-blue-100 text-blue-700';
            case 'Good': return 'bg-orange-100 text-orange-700';
            case 'Average': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const mockCV = {
        name: showCVModal?.name || '',
        email: `${showCVModal?.name?.toLowerCase().replace(' ', '.')}@email.com`,
        phone: '+1 (555) 123-4567',
        experience: '5+ years',
        education: 'Bachelor\'s in Computer Science',
        summary: 'Experienced software engineer with strong technical skills and proven track record in technical assessments.',
        projects: [
            'Built scalable microservices architecture',
            'Developed machine learning pipeline',
            'Led technical team of 5 engineers'
        ]
    };

    const selectedAssessment = assessmentData.find(a => a.id === selectedAppId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {onBack && (
                                <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
                                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                                </button>
                            )}
                            <ClipboardCheck className="w-12 h-12 text-orange-600 mr-4" />
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800">Technical Assessments</h1>
                                <p className="text-slate-600">Evaluate candidates' technical skills and problem-solving abilities</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => {
                            const assessment = assessmentData.find(a => a.id === app.id);
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedAppId === app.id
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-slate-200 hover:border-orange-300'
                                        }`}
                                >
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-800">{app.jobTitle}</h3>
                                        <div className="text-sm text-slate-600 mt-1">
                                            <div>Candidates Ready: {app.semantic || 0}</div>
                                            <div>Assessment Status: {assessment?.status || 'pending'}</div>
                                            <div>Completed: {assessment?.completed || 0}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedApp ? (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-orange-600 mb-2">{assessmentStats.totalAssessments}</div>
                                        <div className="text-sm text-slate-600">Total Assessments</div>
                                    </div>
                                    <ClipboardCheck className="w-10 h-10 text-orange-400" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">{assessmentStats.activeAssessments}</div>
                                        <div className="text-sm text-slate-600">Active Assessments</div>
                                    </div>
                                    <Target className="w-10 h-10 text-blue-400" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-green-600 mb-2">{assessmentStats.completedCandidates}</div>
                                        <div className="text-sm text-slate-600">Candidates Completed</div>
                                    </div>
                                    <Users className="w-10 h-10 text-green-400" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-slate-600 mb-2">{assessmentStats.avgScoreOverall}</div>
                                        <div className="text-sm text-slate-600">Average Score</div>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* Active/Completed Assessment Details */}
                        {selectedAssessment && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <ClipboardCheck className="w-8 h-8 text-orange-600 mr-3" />
                                            <h3 className="text-xl font-bold text-slate-800">{selectedAssessment.jobTitle}</h3>
                                        </div>
                                        <p className="text-slate-600">{selectedAssessment.duration} • {selectedAssessment.questions} questions</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(selectedAssessment.status)}`}>
                                        {selectedAssessment.status === 'active' ? 'In Progress' : selectedAssessment.status === 'completed' ? 'Completed' : 'Pending'}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Total</p>
                                            <p className="text-2xl font-bold text-slate-800">{selectedAssessment.totalCandidates}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Sent</p>
                                            <p className="text-2xl font-bold text-blue-600">{selectedAssessment.sent}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Completed</p>
                                            <p className="text-2xl font-bold text-green-600">{selectedAssessment.completed}</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Pending</p>
                                            <p className="text-2xl font-bold text-orange-600">{selectedAssessment.pending}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                                            <span>Completion Progress</span>
                                            <span className="font-semibold">
                                                {selectedAssessment.sent > 0 ? Math.round((selectedAssessment.completed / selectedAssessment.sent) * 100) : 0}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-3">
                                            <div
                                                className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${selectedAssessment.sent > 0 ? (selectedAssessment.completed / selectedAssessment.sent) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                        <div>
                                            <p className="text-sm text-slate-600">Deadline</p>
                                            <p className="font-semibold text-slate-800">{selectedAssessment.deadline}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Passing Score</p>
                                            <p className="font-semibold text-slate-800">{selectedAssessment.passingScore}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Avg Score</p>
                                            <p className="font-semibold text-green-600">{selectedAssessment.avgScore}</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => alert('Send reminders functionality would be implemented here')}
                                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Reminders
                                        </button>
                                        <button className="flex-1 border-2 border-orange-600 text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-semibold transition-colors">
                                            View Results
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Candidate Ranking */}
                        {candidateRanking.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Top Performers</h2>
                                <div className="space-y-4">
                                    {candidateRanking.map((candidate, index) => (
                                        <div key={candidate.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-4 ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                        index === 1 ? 'bg-slate-100 text-slate-600' :
                                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                                                'bg-slate-50 text-slate-500'
                                                    }`}>
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{candidate.name}</h4>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTechnicalLevelColor(candidate.technical)}`}>
                                                            {candidate.technical}
                                                        </span>
                                                        <span className="text-xs text-slate-500">{candidate.timeSpent}</span>
                                                        <span className="text-xs text-slate-500">Completed: {candidate.completed}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                                                        {candidate.score}
                                                    </div>
                                                    <div className="text-sm text-slate-600">Score</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setShowCVModal(candidate)}
                                                        className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowReportModal(candidate)}
                                                        className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Performance Comparison Table */}
                        {candidateRanking.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Candidate Performance Comparison</h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Candidate</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Overall Score</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Coding Score</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Theory Score</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Time Spent</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Technical Level</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Status</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidateRanking.map((candidate) => (
                                                <tr key={candidate.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="font-semibold text-slate-800">{candidate.name}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`text-xl font-bold ${getScoreColor(candidate.score)}`}>
                                                            {candidate.score}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-semibold text-blue-600">{candidate.codingScore}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-semibold text-purple-600">{candidate.theoryScore}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-slate-700">{candidate.timeSpent}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTechnicalLevelColor(candidate.technical)}`}>
                                                            {candidate.technical}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${candidate.status === 'passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {candidate.status === 'passed' ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setShowCVModal(candidate)}
                                                                className="text-slate-600 hover:text-slate-800"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowReportModal(candidate)}
                                                                className="text-orange-600 hover:text-orange-800"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => alert('Download report functionality would be implemented here')}
                                        className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Report
                                    </button>
                                    <button
                                        onClick={() => alert('Proceeding to Technical Interview for selected candidates')}
                                        className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                                    >
                                        Proceed to Technical Interview
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <ClipboardCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Select an Application</h3>
                        <p className="text-slate-500">Choose an application from the list above to view technical assessment results</p>
                    </div>
                )}

                {/* CV Modal */}
                {showCVModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Candidate CV</h2>
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="text-center pb-6 border-b border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-800">{mockCV.name}</h3>
                                        <div className="text-slate-600 mt-2">
                                            <div>{mockCV.email}</div>
                                            <div>{mockCV.phone}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-2">Professional Summary</h4>
                                        <p className="text-slate-600">{mockCV.summary}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-slate-700 mb-2">Experience</h4>
                                            <p className="text-slate-600">{mockCV.experience}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-700 mb-2">Education</h4>
                                            <p className="text-slate-600">{mockCV.education}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-2">Key Projects</h4>
                                        <ul className="space-y-2">
                                            {mockCV.projects.map((project, index) => (
                                                <li key={index} className="flex items-start">
                                                    <ChevronRight className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-slate-600">{project}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className="px-6 py-3 border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                                        Download CV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Technical Assessment Report</h2>
                                    <button
                                        onClick={() => setShowReportModal(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Candidate Header */}
                                    <div className="text-center pb-6 border-b border-slate-200">
                                        <h3 className="text-2xl font-bold text-slate-800">{showReportModal.name}</h3>
                                        <div className="flex items-center justify-center mt-3">
                                            <span className={`text-3xl font-bold ${getScoreColor(showReportModal.score)} mr-4`}>
                                                {showReportModal.score}
                                            </span>
                                            <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getTechnicalLevelColor(showReportModal.technical)}`}>
                                                {showReportModal.technical}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score Breakdown */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-blue-50 rounded-xl p-6">
                                            <h4 className="font-bold text-blue-800 mb-4">Overall Score</h4>
                                            <div className="text-3xl font-bold text-blue-600 mb-2">{showReportModal.score}</div>
                                            <div className="text-sm text-blue-700">Technical Assessment</div>
                                        </div>

                                        <div className="bg-green-50 rounded-xl p-6">
                                            <h4 className="font-bold text-green-800 mb-4">Coding Score</h4>
                                            <div className="text-3xl font-bold text-green-600 mb-2">{showReportModal.codingScore}</div>
                                            <div className="text-sm text-green-700">Practical Implementation</div>
                                        </div>

                                        <div className="bg-purple-50 rounded-xl p-6">
                                            <h4 className="font-bold text-purple-800 mb-4">Theory Score</h4>
                                            <div className="text-3xl font-bold text-purple-600 mb-2">{showReportModal.theoryScore}</div>
                                            <div className="text-sm text-purple-700">Conceptual Understanding</div>
                                        </div>
                                    </div>

                                    {/* Performance Analysis */}
                                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                                        <h4 className="font-bold text-slate-800 mb-3">Performance Analysis</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className="font-semibold text-slate-700 mb-2">Technical Skills</h5>
                                                <div className="flex items-center">
                                                    <div className="flex-1 bg-slate-200 rounded-full h-3 mr-3">
                                                        <div
                                                            className="bg-orange-600 h-3 rounded-full"
                                                            style={{ width: `${showReportModal.score}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-orange-600">{showReportModal.technical}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-slate-700 mb-2">Problem Solving</h5>
                                                <div className="flex items-center">
                                                    <div className="flex-1 bg-slate-200 rounded-full h-3 mr-3">
                                                        <div
                                                            className="bg-blue-600 h-3 rounded-full"
                                                            style={{ width: `${showReportModal.score - 5}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-blue-600">{showReportModal.problemSolving}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Analysis */}
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <h4 className="font-bold text-slate-800 mb-3">Assessment Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="text-sm text-slate-600">Time Spent</div>
                                                <div className="text-lg font-bold text-slate-700">{showReportModal.timeSpent}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm text-slate-600">Completed</div>
                                                <div className="text-lg font-bold text-slate-700">{showReportModal.completed}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm text-slate-600">Status</div>
                                                <div className={`text-lg font-bold ${showReportModal.status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {showReportModal.status === 'passed' ? 'PASSED' : 'FAILED'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                        <div className="flex items-start">
                                            <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-2">Recommendation</h4>
                                                <p className="text-slate-700 mb-3">
                                                    {showReportModal.name} has {showReportModal.status === 'passed' ? 'successfully passed' : 'not passed'} the technical assessment with a score of {showReportModal.score}.
                                                    {showReportModal.status === 'passed'
                                                        ? ' The candidate demonstrates strong technical skills and problem-solving abilities suitable for the next interview stage.'
                                                        : ' Additional technical development may be required before proceeding to the next stage.'
                                                    }
                                                </p>
                                                <div className="flex gap-3">
                                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${showReportModal.status === 'passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {showReportModal.status === 'passed' ? '✓ Ready for Interview' : '✗ Review Required'}
                                                    </span>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                                                        {showReportModal.technical} Technical Level
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowReportModal(null)}
                                        className="px-6 py-3 border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                                        Schedule Interview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
