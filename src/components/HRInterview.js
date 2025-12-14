import React, { useState, useMemo } from 'react';
import { Users, ChevronRight, Calendar, Clock, MessageSquare, TrendingUp, CheckCircle, FileText, ArrowLeft, Award, Star, Briefcase } from 'lucide-react';

export default function HRInterview({ applications, onBack }) {
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(null);
    const [showCVModal, setShowCVModal] = useState(null);

    const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);

    // Generate interview data per application
    const generateInterviewData = (app) => {
        const totalCandidates = app.techInterview || 0;
        const scheduled = Math.min(totalCandidates, Math.floor(totalCandidates * 0.9));
        const completed = Math.floor(scheduled * 0.8);
        const pending = scheduled - completed;
        const status = totalCandidates > 0 && completed < scheduled ? 'active' : totalCandidates > 0 ? 'completed' : 'pending';
        const avgScore = completed > 0 ? 8.0 + Math.random() * 1.2 : 0;

        return {
            id: app.id,
            jobTitle: app.jobTitle,
            scheduled,
            completed,
            pending,
            avgScore: parseFloat(avgScore.toFixed(1)),
            nextInterview: completed < scheduled ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' ' + (10 + Math.floor(Math.random() * 8)) + ':00' : 'Completed',
            interviewer: ['Emma Wilson', 'David Kim', 'Rachel Green'][Math.floor(Math.random() * 3)],
            duration: '30 minutes',
            passingScore: 7.5,
            status
        };
    };

    const [interviewData, setInterviewData] = useState(() => {
        return applications.map(app => generateInterviewData(app));
    });

    // Generate candidate results per selected application
    const generateCandidateResults = (app) => {
        const candidates = [];
        const names = ['Sarah Johnson', 'Michael Chen', 'Emma Williams', 'James Brown', 'Alex Rodriguez', 'Priya Sharma', 'David Kim', 'Lisa Wang'];
        const count = Math.min(app.techInterview || 0, 8);

        for (let i = 0; i < count; i++) {
            const cultureFit = 6.5 + Math.random() * 3.5;
            const communication = 6.5 + Math.random() * 3.5;
            const leadership = 6 + Math.random() * 4;
            const motivation = 6.5 + Math.random() * 3.5;
            const teamwork = 6.5 + Math.random() * 3.5;
            const overall = (cultureFit + communication + leadership + motivation + teamwork) / 5;

            candidates.push({
                id: i + 1,
                name: names[i % names.length],
                cultureFit: parseFloat(cultureFit.toFixed(1)),
                communication: parseFloat(communication.toFixed(1)),
                leadership: parseFloat(leadership.toFixed(1)),
                motivation: parseFloat(motivation.toFixed(1)),
                teamwork: parseFloat(teamwork.toFixed(1)),
                overall: parseFloat(overall.toFixed(1)),
                status: Math.random() > 0.25 ? 'Completed' : 'Scheduled',
                interviewer: ['Emma Wilson', 'David Kim', 'Rachel Green'][Math.floor(Math.random() * 3)],
                date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                feedback: Math.random() > 0.25
                    ? 'Excellent cultural fit and communication skills'
                    : 'Scheduled for HR interview'
            });
        }

        return candidates.sort((a, b) => b.overall - a.overall);
    };

    const [candidateResults, setCandidateResults] = useState([]);

    // Update candidate results when app changes
    React.useEffect(() => {
        if (selectedApp) {
            setCandidateResults(generateCandidateResults(selectedApp));
        } else {
            setCandidateResults([]);
        }
    }, [selectedApp]);

    const interviewStats = useMemo(() => {
        const total = interviewData.length;
        const active = interviewData.filter(i => i.status === 'active').length;
        const completed = interviewData.filter(i => i.status === 'completed').length;
        const totalScheduled = interviewData.reduce((sum, i) => sum + i.scheduled, 0);
        const totalCompleted = interviewData.reduce((sum, i) => sum + i.completed, 0);
        const totalPending = interviewData.reduce((sum, i) => sum + i.pending, 0);
        const avgScoreOverall = totalCompleted > 0
            ? parseFloat((interviewData.reduce((sum, i) => sum + (i.avgScore * i.completed), 0) / totalCompleted).toFixed(1))
            : 0;

        return {
            totalInterviews: total,
            activeInterviews: active,
            completedInterviews: completed,
            totalScheduled,
            totalCompleted,
            totalPending,
            avgScoreOverall
        };
    }, [interviewData]);

    const getScoreColor = (score) => {
        if (score >= 9) return 'text-green-600';
        if (score >= 8) return 'text-blue-600';
        if (score >= 7) return 'text-orange-600';
        return 'text-red-600';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'scheduled': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const selectedInterview = interviewData.find(i => i.id === selectedAppId);

    const mockCV = {
        name: showCVModal?.name || '',
        email: `${showCVModal?.name?.toLowerCase().replace(' ', '.')}@email.com`,
        phone: '+1 (555) 123-4567',
        experience: '5+ years',
        education: 'Bachelor\'s in Computer Science',
        summary: 'Experienced professional with strong communication skills and cultural fit for the team.',
        projects: [
            'Led cross-functional team of 8 members',
            'Implemented company-wide training program',
            'Improved team productivity by 30%'
        ]
    };

    // Download CV functionality
    const downloadCV = () => {
        const cvData = {
            name: mockCV.name,
            email: mockCV.email,
            phone: mockCV.phone,
            experience: mockCV.experience,
            education: mockCV.education,
            summary: mockCV.summary,
            projects: mockCV.projects,
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(cvData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `cv-${mockCV.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Schedule interview functionality
    const scheduleInterview = () => {
        const candidateName = 'John Doe'; // Replace with actual candidate data
        const interviewDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const interviewTime = '2:00 PM';

        const calendarData = {
            title: `HR Interview - ${candidateName}`,
            date: interviewDate,
            time: interviewTime,
            duration: '45 minutes',
            type: 'HR Interview',
            candidate: candidateName,
            interviewer: 'HR Team',
            location: 'Virtual - Zoom',
            notes: 'Discuss cultural fit and team collaboration'
        };

        const dataStr = JSON.stringify(calendarData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `hr-interview-schedule-${candidateName.replace(' ', '-')}-${interviewDate}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Export report functionality
    const exportReport = () => {
        const reportData = {
            reportType: 'HR Interview Summary',
            candidates: [
                {
                    name: 'John Doe',
                    culturalFit: 88,
                    communication: 85,
                    teamwork: 90,
                    overall: 87,
                    recommendation: 'Strongly Recommend'
                }
            ],
            totalInterviews: 1,
            averageScore: 87,
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `hr-interview-report-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Proceed to Final Ranking
    const proceedToFinalRanking = () => {
        const selectedCandidates = [
            {
                name: 'John Doe',
                hrScore: 87,
                status: 'Passed HR Interview'
            }
        ];

        const dataStr = JSON.stringify(selectedCandidates, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `candidates-for-final-ranking-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {onBack && (
                                <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
                                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                                </button>
                            )}
                            <Users className="w-12 h-12 text-pink-600 mr-4" />
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800">HR Interviews</h1>
                                <p className="text-slate-600">Assess cultural fit, communication skills, and team compatibility</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => {
                            const interview = interviewData.find(i => i.id === app.id);
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedAppId === app.id
                                        ? 'border-pink-500 bg-pink-50'
                                        : 'border-slate-200 hover:border-pink-300'
                                        }`}
                                >
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-800">{app.jobTitle}</h3>
                                        <div className="text-sm text-slate-600 mt-1">
                                            <div>Candidates Ready: {app.techInterview || 0}</div>
                                            <div>Interview Status: {interview?.status || 'pending'}</div>
                                            <div>Completed: {interview?.completed || 0}</div>
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
                                        <div className="text-3xl font-bold text-pink-600 mb-2">{interviewStats.totalScheduled}</div>
                                        <div className="text-sm text-slate-600">Total Scheduled</div>
                                    </div>
                                    <Calendar className="w-10 h-10 text-pink-400" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-green-600 mb-2">{interviewStats.totalCompleted}</div>
                                        <div className="text-sm text-slate-600">Completed</div>
                                    </div>
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-orange-600 mb-2">{interviewStats.totalPending}</div>
                                        <div className="text-sm text-slate-600">Pending</div>
                                    </div>
                                    <Clock className="w-10 h-10 text-orange-400" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-slate-600 mb-2">{interviewStats.avgScoreOverall}</div>
                                        <div className="text-sm text-slate-600">Avg Score</div>
                                    </div>
                                    <MessageSquare className="w-10 h-10 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* Interview Progress */}
                        {selectedInterview && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Users className="w-8 h-8 text-pink-600 mr-3" />
                                            <h3 className="text-xl font-bold text-slate-800">{selectedInterview.jobTitle}</h3>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                                            <span>{selectedInterview.duration}</span>
                                            <span>•</span>
                                            <span>Interviewer: {selectedInterview.interviewer}</span>
                                            <span>•</span>
                                            <span>Passing: {selectedInterview.passingScore}/10</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold">
                                        Avg Score: {selectedInterview.avgScore}/10
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Scheduled</p>
                                            <p className="text-2xl font-bold text-blue-600">{selectedInterview.scheduled}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Completed</p>
                                            <p className="text-2xl font-bold text-green-600">{selectedInterview.completed}</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-600 mb-1">Pending</p>
                                            <p className="text-2xl font-bold text-orange-600">{selectedInterview.pending}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-600 mb-2">
                                            Next Interview: <span className="font-semibold text-slate-800">{selectedInterview.nextInterview}</span>
                                        </p>
                                        <div className="w-full bg-slate-200 rounded-full h-3">
                                            <div
                                                className="bg-pink-600 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${selectedInterview.scheduled > 0 ? (selectedInterview.completed / selectedInterview.scheduled) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={scheduleInterview}
                                            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center"
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Schedule Interview
                                        </button>
                                        <button className="flex-1 border border-pink-600 text-pink-600 hover:bg-pink-50 py-2 rounded-lg font-semibold transition-colors text-sm">
                                            View Candidates
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Candidate Results */}
                        {candidateResults.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">HR Interview Results</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Candidate</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Culture Fit</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Communication</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Leadership</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Teamwork</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Overall</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Status</th>
                                                <th className="text-left py-4 px-4 text-slate-600 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidateResults.map((candidate) => (
                                                <tr key={candidate.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="font-semibold text-slate-800">{candidate.name}</div>
                                                        <div className="text-sm text-slate-600">{candidate.interviewer} • {candidate.date}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-bold ${getScoreColor(candidate.cultureFit)}`}>
                                                            {candidate.cultureFit}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-bold ${getScoreColor(candidate.communication)}`}>
                                                            {candidate.communication}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-bold ${getScoreColor(candidate.leadership)}`}>
                                                            {candidate.leadership}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-bold ${getScoreColor(candidate.teamwork)}`}>
                                                            {candidate.teamwork}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`text-lg font-bold ${getScoreColor(candidate.overall)}`}>
                                                            {candidate.overall}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(candidate.status)}`}>
                                                            {candidate.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setShowFeedbackModal(candidate)}
                                                                className="text-pink-600 hover:text-pink-800 font-semibold text-sm flex items-center"
                                                            >
                                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                                Feedback
                                                            </button>
                                                            <button
                                                                onClick={() => setShowCVModal(candidate)}
                                                                className="text-slate-600 hover:text-slate-800"
                                                            >
                                                                <FileText className="w-4 h-4" />
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
                                        onClick={exportReport}
                                        className="px-6 py-3 border-2 border-pink-600 text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition-colors flex items-center"
                                    >
                                        <FileText className="w-5 h-5 mr-2" />
                                        Export Report
                                    </button>
                                    <button
                                        onClick={proceedToFinalRanking}
                                        className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                                    >
                                        Proceed to Final Ranking
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Select an Application</h3>
                        <p className="text-slate-500">Choose an application from the list above to view HR interview results</p>
                    </div>
                )}

                {/* Feedback Modal */}
                {showFeedbackModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">HR Interview Feedback</h2>
                                    <button
                                        onClick={() => setShowFeedbackModal(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Candidate Header */}
                                    <div className="text-center pb-6 border-b border-slate-200">
                                        <h3 className="text-2xl font-bold text-slate-800">{showFeedbackModal.name}</h3>
                                        <div className="flex items-center justify-center mt-3">
                                            <span className={`text-3xl font-bold ${getScoreColor(showFeedbackModal.overall)} mr-4`}>
                                                {showFeedbackModal.overall}
                                            </span>
                                            <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(showFeedbackModal.status)}`}>
                                                {showFeedbackModal.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score Breakdown */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-pink-50 rounded-xl p-6">
                                            <h4 className="font-bold text-pink-800 mb-4">Culture Fit</h4>
                                            <div className="text-2xl font-bold text-pink-600 mb-2">{showFeedbackModal.cultureFit}</div>
                                            <div className="text-sm text-pink-700">Alignment with company values</div>
                                        </div>

                                        <div className="bg-blue-50 rounded-xl p-6">
                                            <h4 className="font-bold text-blue-800 mb-4">Communication</h4>
                                            <div className="text-2xl font-bold text-blue-600 mb-2">{showFeedbackModal.communication}</div>
                                            <div className="text-sm text-blue-700">Verbal and written skills</div>
                                        </div>

                                        <div className="bg-green-50 rounded-xl p-6">
                                            <h4 className="font-bold text-green-800 mb-4">Leadership</h4>
                                            <div className="text-2xl font-bold text-green-600 mb-2">{showFeedbackModal.leadership}</div>
                                            <div className="text-sm text-green-700">Leadership potential and initiative</div>
                                        </div>

                                        <div className="bg-purple-50 rounded-xl p-6">
                                            <h4 className="font-bold text-purple-800 mb-4">Teamwork</h4>
                                            <div className="text-2xl font-bold text-purple-600 mb-2">{showFeedbackModal.teamwork}</div>
                                            <div className="text-sm text-purple-700">Collaboration and team dynamics</div>
                                        </div>
                                    </div>

                                    {/* Feedback Summary */}
                                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
                                        <h4 className="font-bold text-slate-800 mb-3">Interview Summary</h4>
                                        <div className="space-y-2 text-slate-700">
                                            <p>• Interview conducted by {showFeedbackModal.interviewer} on {showFeedbackModal.date}</p>
                                            <p>• Overall performance: {showFeedbackModal.overall >= 8.5 ? 'Excellent' : showFeedbackModal.overall >= 7.5 ? 'Good' : 'Needs Improvement'}</p>
                                            <p>• {showFeedbackModal.feedback}</p>
                                            <p>• Recommendation: {showFeedbackModal.overall >= 7.5 ? 'Proceed to Final Ranking' : 'Additional review needed'}</p>
                                        </div>
                                    </div>

                                    {/* Detailed Assessment */}
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <h4 className="font-bold text-slate-800 mb-3">Detailed Assessment</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Cultural Alignment</span>
                                                <div className="flex items-center">
                                                    <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                                                        <div
                                                            className="bg-pink-600 h-2 rounded-full"
                                                            style={{ width: `${showFeedbackModal.cultureFit * 10}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-pink-600">{showFeedbackModal.cultureFit}/10</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Communication Skills</span>
                                                <div className="flex items-center">
                                                    <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${showFeedbackModal.communication * 10}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-blue-600">{showFeedbackModal.communication}/10</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Motivation Level</span>
                                                <div className="flex items-center">
                                                    <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                                                        <div
                                                            className="bg-green-600 h-2 rounded-full"
                                                            style={{ width: `${showFeedbackModal.motivation * 10}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-green-600">{showFeedbackModal.motivation}/10</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowFeedbackModal(null)}
                                        className="px-6 py-3 border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                                        Add to Final Ranking
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                                    <ChevronRight className="w-4 h-4 text-pink-600 mr-2 mt-0.5 flex-shrink-0" />
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
                                    <button
                                        onClick={() => {
                                            const shortlistData = {
                                                ...mockCV,
                                                jobTitle: selectedApp?.jobTitle || 'Unknown Application',
                                                shortlistedFrom: 'HR Interview',
                                                shortlistedDate: new Date().toISOString().slice(0, 10)
                                            };
                                            const existingShortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
                                            const existingCV = existingShortlist.find(cv => cv.name === mockCV.name && cv.email === shortlistData.email);
                                            if (!existingCV) {
                                                localStorage.setItem('shortlist', JSON.stringify([...existingShortlist, shortlistData]));
                                                alert(`${mockCV.name} has been added to your shortlist!`);
                                            } else {
                                                alert(`${mockCV.name} is already in your shortlist.`);
                                            }
                                        }}
                                        className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                                    >
                                        <Star className="w-5 h-5 mr-2" />
                                        Add to Shortlist
                                    </button>
                                    <button
                                        onClick={downloadCV}
                                        className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                                    >
                                        Download CV
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
