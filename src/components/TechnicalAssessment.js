import React, { useMemo, useState } from 'react';
import { ArrowLeft, ClipboardCheck, Download, TrendingUp, Users, Target, Send, FileText, Eye, ChevronRight, Star, CheckCircle } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function TechnicalAssessment({ applications, onBack }) {
    const { isDarkMode } = useDarkMode();
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
        if (score >= 90) return isDarkMode ? 'text-green-400' : 'text-green-600';
        if (score >= 80) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
        if (score >= 70) return isDarkMode ? 'text-orange-400' : 'text-orange-600';
        return isDarkMode ? 'text-red-400' : 'text-red-600';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700';
            case 'completed': return isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700';
            case 'pending': return isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700';
            default: return isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700';
        }
    };

    const getTechnicalLevelColor = (level) => {
        switch (level) {
            case 'Excellent': return isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700';
            case 'Very Good': return isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700';
            case 'Good': return isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700';
            case 'Average': return isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
            default: return isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700';
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

    // Download report functionality
    const downloadReport = () => {
        const reportData = {
            jobTitle: selectedApp?.jobTitle || 'Unknown',
            candidates: candidateRanking.map(c => ({
                name: c.name,
                score: c.score,
                technical: c.technical,
                problemSolving: c.problemSolving,
                timeSpent: c.timeSpent,
                status: c.status,
                codingScore: c.codingScore,
                theoryScore: c.theoryScore,
                completed: c.completed
            })),
            assessmentStats: {
                totalAssessments: assessmentStats.totalAssessments,
                activeAssessments: assessmentStats.activeAssessments,
                completedCandidates: assessmentStats.completedCandidates,
                avgScoreOverall: assessmentStats.avgScoreOverall
            },
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `technical-assessment-report-${selectedApp?.jobTitle || 'report'}-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Download CV functionality
    const downloadCV = (candidate) => {
        const cvData = {
            name: candidate.name,
            email: `${candidate.name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: '+1 (555) 123-4567',
            experience: '5+ years',
            education: 'Bachelor\'s in Computer Science',
            summary: 'Experienced software engineer with strong technical skills and proven track record in technical assessments.',
            projects: [
                'Built scalable microservices architecture',
                'Developed machine learning pipeline',
                'Led technical team of 5 engineers'
            ],
            score: candidate.score,
            technical: candidate.technical,
            problemSolving: candidate.problemSolving,
            timeSpent: candidate.timeSpent,
            status: candidate.status,
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(cvData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `cv-${candidate.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Send reminders functionality
    const sendReminders = () => {
        const reminderData = {
            type: 'Assessment Reminders',
            recipients: ['candidate1@email.com', 'candidate2@email.com'],
            message: 'Reminder: Complete your technical assessment by the deadline',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            assessmentType: 'Technical Assessment',
            sentDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(reminderData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `assessment-reminders-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Proceed to Technical Interview
    const proceedToTechnicalInterview = () => {
        const selectedCandidates = candidateRanking.filter(c => c.score >= 70).map(c => ({
            name: c.name,
            score: c.score,
            technical: c.technical,
            status: 'Passed Assessment'
        }));

        const dataStr = JSON.stringify(selectedCandidates, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `candidates-for-technical-interview-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {onBack && (
                                <button onClick={onBack} className={`mr-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-white'}`}>
                                    <ArrowLeft className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                </button>
                            )}
                            <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-14 h-14 rounded-lg mr-4">
                                <ClipboardCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-4xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Technical Assessments</h1>
                                <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Evaluate candidates' technical skills and problem-solving abilities</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                    <h2 className={`text-xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => {
                            const assessment = assessmentData.find(a => a.id === app.id);
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedAppId === app.id
                                        ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50'
                                        : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-base-200 hover:border-accent-300'
                                        }`}
                                >
                                    <div className="text-left">
                                        <h3 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{app.jobTitle}</h3>
                                        <div className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
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
                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-3xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-base-600'}`}>{assessmentStats.totalAssessments}</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Total Assessments</div>
                                    </div>
                                    <ClipboardCheck className="w-10 h-10 text-accent-400" />
                                </div>
                            </div>

                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-accent-600 mb-2">{assessmentStats.activeAssessments}</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Active Assessments</div>
                                    </div>
                                    <Target className="w-10 h-10 text-accent-400" />
                                </div>
                            </div>

                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-accent-600 mb-2">{assessmentStats.completedCandidates}</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Candidates Completed</div>
                                    </div>
                                    <Users className="w-10 h-10 text-accent-400" />
                                </div>
                            </div>

                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-100 to-accent-100 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-3xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-base-600'}`}>{assessmentStats.avgScoreOverall}</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Average Score</div>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-accent-400" />
                                </div>
                            </div>
                        </div>

                        {/* Active/Completed Assessment Details */}
                        {selectedAssessment && (
                            <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg mr-3">
                                                <ClipboardCheck className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{selectedAssessment.jobTitle}</h3>
                                        </div>
                                        <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{selectedAssessment.duration} • {selectedAssessment.questions} questions</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(selectedAssessment.status)}`}>
                                        {selectedAssessment.status === 'active' ? 'In Progress' : selectedAssessment.status === 'completed' ? 'Completed' : 'Pending'}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className={`p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                            <p className={`text-sm mb-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Total</p>
                                            <p className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{selectedAssessment.totalCandidates}</p>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <p className={`text-sm mb-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Sent</p>
                                            <p className="text-2xl font-bold text-accent-600">{selectedAssessment.sent}</p>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <p className={`text-sm mb-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Completed</p>
                                            <p className="text-2xl font-bold text-accent-600">{selectedAssessment.completed}</p>
                                        </div>
                                        <div className={`p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <p className={`text-sm mb-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Pending</p>
                                            <p className="text-2xl font-bold text-accent-600">{selectedAssessment.pending}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className={`flex justify-between text-sm mb-2 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            <span>Completion Progress</span>
                                            <span className="font-semibold">
                                                {selectedAssessment.sent > 0 ? Math.round((selectedAssessment.completed / selectedAssessment.sent) * 100) : 0}%
                                            </span>
                                        </div>
                                        <div className={`w-full rounded-full h-3 transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-base-200'}`}>
                                            <div
                                                className="bg-gradient-to-r from-base-600 to-accent-600 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${selectedAssessment.sent > 0 ? (selectedAssessment.completed / selectedAssessment.sent) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-between pt-4 border-t transition-colors ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                        <div>
                                            <p className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Deadline</p>
                                            <p className={`font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{selectedAssessment.deadline}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Passing Score</p>
                                            <p className={`font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{selectedAssessment.passingScore}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Avg Score</p>
                                            <p className="font-semibold text-accent-600">{selectedAssessment.avgScore}</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={sendReminders}
                                            className="flex-1 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Reminders
                                        </button>
                                        <button className="flex-1 border-2 border-base-600 text-base-600 hover:bg-base-50 py-3 rounded-lg font-semibold transition-colors">
                                            View Results
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Candidate Ranking */}
                        {candidateRanking.length > 0 && (
                            <div className={`rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                                <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Top Performers</h2>
                                <div className="space-y-4">
                                    {candidateRanking.map((candidate, index) => (
                                        <div key={candidate.id} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-base-50 hover:bg-base-100'}`}>
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-4 ${index === 0 ? 'bg-gradient-to-r from-base-200 to-accent-200 text-accent-600' :
                                                    index === 1 ? 'bg-gradient-to-r from-base-100 to-accent-100 text-base-600' :
                                                        index === 2 ? 'bg-gradient-to-r from-base-200 to-accent-200 text-base-600' :
                                                            'bg-base-50 text-base-500'
                                                    }`}>
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{candidate.name}</h4>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTechnicalLevelColor(candidate.technical)}`}>
                                                            {candidate.technical}
                                                        </span>
                                                        <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>{candidate.timeSpent}</span>
                                                        <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Completed: {candidate.completed}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                                                        {candidate.score}
                                                    </div>
                                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Score</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setShowCVModal(candidate)}
                                                        className="p-2 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setShowReportModal(candidate)}
                                                        className="p-2 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg transition-colors"
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
                            <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                                <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Candidate Performance Comparison</h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Candidate</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Overall Score</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Coding Score</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Theory Score</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Time Spent</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Technical Level</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Status</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidateRanking.map((candidate) => (
                                                <tr key={candidate.id} className={`border-b transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-base-100 hover:bg-base-50'}`}>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{candidate.name}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`text-xl font-bold ${getScoreColor(candidate.score)}`}>
                                                            {candidate.score}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-semibold text-accent-600">{candidate.codingScore}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-semibold text-accent-600">{candidate.theoryScore}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{candidate.timeSpent}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTechnicalLevelColor(candidate.technical)}`}>
                                                            {candidate.technical}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${candidate.status === 'passed' ? 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700' : 'bg-base-100 text-base-700'}`}>
                                                            {candidate.status === 'passed' ? 'Passed' : 'Failed'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setShowCVModal(candidate)}
                                                                className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-base-600 hover:text-base-800'}`}
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowReportModal(candidate)}
                                                                className="text-accent-600 hover:text-accent-800 transition-colors duration-300"
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
                                        onClick={downloadReport}
                                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors duration-300 flex items-center ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-600 text-base-600 hover:bg-base-50'}`}
                                    >
                                        <FileText className="w-5 h-5 mr-2" />
                                        Export Report
                                    </button>
                                    <button
                                        onClick={proceedToTechnicalInterview}
                                        className="px-6 py-3 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        Proceed to Technical Interview
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={`rounded-2xl shadow-lg p-12 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                        <div className={`flex items-center justify-center w-20 h-20 rounded-lg mx-auto mb-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-base-100 to-accent-100'}`}>
                            <ClipboardCheck className={`w-10 h-10 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-400'}`} />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-700'}`}>Select an Application</h3>
                        <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Choose an application from the list above to view technical assessment results</p>
                    </div>
                )}

                {/* CV Modal */}
                {showCVModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                        <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Candidate CV</h2>
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-base-100'}`}
                                    >
                                        <ChevronRight className={`w-5 h-5 rotate-180 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className={`text-center pb-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                        <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{mockCV.name}</h3>
                                        <div className={`mt-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            <div>{mockCV.email}</div>
                                            <div>{mockCV.phone}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Professional Summary</h4>
                                        <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{mockCV.summary}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Experience</h4>
                                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{mockCV.experience}</p>
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Education</h4>
                                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{mockCV.education}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Key Projects</h4>
                                        <ul className="space-y-2">
                                            {mockCV.projects.map((project, index) => (
                                                <li key={index} className="flex items-start">
                                                    <ChevronRight className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{project}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors duration-300 ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            const shortlistData = {
                                                ...showCVModal,
                                                jobTitle: selectedApp?.jobTitle || 'Unknown Application',
                                                email: `${showCVModal.name.toLowerCase().replace(' ', '.')}@email.com`,
                                                phone: '+1 (555) 123-4567',
                                                experience: '5+ years',
                                                education: "Bachelor's in Computer Science",
                                                summary: 'Experienced software engineer with strong technical skills and a proven track record of delivering high-quality solutions.',
                                                projects: [
                                                    'Led development of microservices architecture serving 1M+ users',
                                                    'Implemented machine learning pipeline reducing processing time by 40%',
                                                    'Built real-time analytics dashboard with React and Node.js'
                                                ],
                                                shortlistedFrom: 'Technical Assessment',
                                                shortlistedDate: new Date().toISOString().slice(0, 10)
                                            };
                                            const existingShortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
                                            const existingCV = existingShortlist.find(cv => cv.name === showCVModal.name && cv.email === shortlistData.email);
                                            if (!existingCV) {
                                                localStorage.setItem('shortlist', JSON.stringify([...existingShortlist, shortlistData]));
                                                alert(`${showCVModal.name} has been added to your shortlist!`);
                                            } else {
                                                alert(`${showCVModal.name} is already in your shortlist.`);
                                            }
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-base-500 to-accent-500 hover:from-base-600 hover:to-accent-600 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        <Star className="w-5 h-5 mr-2" />
                                        Add to Shortlist
                                    </button>
                                    <button
                                        onClick={() => downloadCV(showCVModal)}
                                        className="px-6 py-3 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg font-semibold transition-colors"
                                    >
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
                        <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Technical Assessment Report</h2>
                                    <button
                                        onClick={() => setShowReportModal(null)}
                                        className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-base-100'}`}
                                    >
                                        <ChevronRight className={`w-5 h-5 rotate-180 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Candidate Header */}
                                    <div className={`text-center pb-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                        <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{showReportModal.name}</h3>
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
                                        <div className={`rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Overall Score</h4>
                                            <div className="text-3xl font-bold text-accent-600 mb-2">{showReportModal.score}</div>
                                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Technical Assessment</div>
                                        </div>

                                        <div className={`rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Coding Score</h4>
                                            <div className="text-3xl font-bold text-accent-600 mb-2">{showReportModal.codingScore}</div>
                                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Practical Implementation</div>
                                        </div>

                                        <div className={`rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Theory Score</h4>
                                            <div className="text-3xl font-bold text-accent-600 mb-2">{showReportModal.theoryScore}</div>
                                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Conceptual Understanding</div>
                                        </div>
                                    </div>

                                    {/* Performance Analysis */}
                                    <div className={`rounded-xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-base-50 to-accent-50 border-base-200'}`}>
                                        <h4 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Performance Analysis</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Technical Skills</h5>
                                                <div className="flex items-center">
                                                    <div className={`flex-1 rounded-full h-3 mr-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-base-200'}`}>
                                                        <div
                                                            className="bg-gradient-to-r from-base-600 to-accent-600 h-3 rounded-full"
                                                            style={{ width: `${showReportModal.score}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-accent-600">{showReportModal.technical}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Problem Solving</h5>
                                                <div className="flex items-center">
                                                    <div className={`flex-1 rounded-full h-3 mr-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-base-200'}`}>
                                                        <div
                                                            className="bg-gradient-to-r from-base-600 to-accent-600 h-3 rounded-full"
                                                            style={{ width: `${showReportModal.score}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-accent-600">{showReportModal.problemSolving}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Analysis */}
                                    <div className={`rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                        <h4 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Assessment Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Time Spent</div>
                                                <div className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{showReportModal.timeSpent}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Completed</div>
                                                <div className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{showReportModal.completed}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Status</div>
                                                <div className={`text-lg font-bold ${showReportModal.status === 'passed' ? 'text-accent-600' : isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                    {showReportModal.status === 'passed' ? 'PASSED' : 'FAILED'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className={`rounded-xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-base-50 to-accent-50 border-base-200'}`}>
                                        <div className="flex items-start">
                                            <CheckCircle className="w-6 h-6 text-accent-600 mr-3 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Recommendation</h4>
                                                <p className={`mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                    {showReportModal.name} has {showReportModal.status === 'passed' ? 'successfully passed' : 'not passed'} the technical assessment with a score of {showReportModal.score}.
                                                    {showReportModal.status === 'passed'
                                                        ? ' The candidate demonstrates strong technical skills and problem-solving abilities suitable for the next interview stage.'
                                                        : ' Additional technical development may be required before proceeding to the next stage.'
                                                    }
                                                </p>
                                                <div className="flex gap-3">
                                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${showReportModal.status === 'passed' ? 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700' : 'bg-base-100 text-base-700'
                                                        }`}>
                                                        {showReportModal.status === 'passed' ? '✓ Ready for Interview' : '✗ Review Required'}
                                                    </span>
                                                    <span className="px-3 py-1 bg-gradient-to-r from-base-100 to-accent-100 text-accent-700 rounded-lg text-sm font-semibold">
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
                                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors duration-300 ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={sendReminders}
                                        className="px-6 py-3 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        Send Reminders
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
