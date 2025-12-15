import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Video, Users, Calendar, Clock, CheckCircle, Star, MessageSquare, FileText, Settings, BarChart3, Award, Target, Brain, UserCheck, TrendingUp, Download, Send, Eye, ChevronRight, PlayCircle, PauseCircle } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function InterviewManagement({ applications, onBack }) {
    const { isDarkMode } = useDarkMode();
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [currentPhase, setCurrentPhase] = useState('technical'); // 'technical' or 'hr'
    const [selectedInterviewMode, setSelectedInterviewMode] = useState(null); // 'ai-fully' or 'technical-with-ai'
    const [interviewSessions, setInterviewSessions] = useState([]);
    const [candidateRankings, setCandidateRankings] = useState([]);
    const [showSessionModal, setShowSessionModal] = useState(null);
    const [showReportModal, setShowReportModal] = useState(null);

    const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);

    // Generate interview sessions for selected application
    const generateInterviewSessions = (app, phase) => {
        const names = ['Sarah Johnson', 'Michael Chen', 'Emma Williams', 'James Brown', 'Alex Rodriguez', 'Priya Sharma', 'David Kim', 'Lisa Wang'];
        const sessions = [];
        const count = Math.min(app.assessment || 0, 6);

        for (let i = 0; i < count; i++) {
            const baseScore = 75 + Math.floor(Math.random() * 20);
            const optimizationScore = Math.floor(Math.random() * 15); // How optimal the answer was

            sessions.push({
                id: `session-${i + 1}`,
                candidateName: names[i % names.length],
                phase: phase,
                mode: phase === 'technical' ? (i % 2 === 0 ? 'ai-fully' : 'technical-with-ai') : (i % 2 === 0 ? 'ai-fully' : 'hr-with-ai'),
                status: ['scheduled', 'in-progress', 'completed', 'evaluated'][Math.floor(Math.random() * 4)],
                scheduledTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                duration: `${45 + Math.floor(Math.random() * 30)} minutes`,
                technicalScore: baseScore,
                optimizationScore: optimizationScore,
                overallScore: baseScore + optimizationScore,
                interviewer: phase === 'technical' && i % 2 === 1 ? `Dr. ${['Smith', 'Johnson', 'Williams'][i % 3]}` : 'AI System',
                feedback: {
                    technical: ['Excellent problem-solving', 'Good code quality', 'Needs improvement in algorithms'][Math.floor(Math.random() * 3)],
                    communication: ['Clear explanations', 'Well-structured responses', 'Could be more concise'][Math.floor(Math.random() * 3)],
                    culturalFit: ['Strong team player', 'Good cultural alignment', 'Needs team development'][Math.floor(Math.random() * 3)]
                },
                questions: [
                    {
                        question: 'Describe your approach to solving complex technical problems',
                        answer: 'I break down complex problems into smaller, manageable components and tackle them systematically.',
                        score: baseScore + Math.floor(Math.random() * 10) - 5,
                        optimal: Math.random() > 0.5
                    },
                    {
                        question: 'How do you ensure code quality and maintainability?',
                        answer: 'I follow best practices, write comprehensive tests, and conduct regular code reviews.',
                        score: baseScore + Math.floor(Math.random() * 10) - 5,
                        optimal: Math.random() > 0.6
                    }
                ]
            });
        }

        return sessions.sort((a, b) => b.overallScore - a.overallScore);
    };

    // Update interview sessions when app or phase changes
    useEffect(() => {
        if (selectedApp) {
            const sessions = generateInterviewSessions(selectedApp, currentPhase);
            setInterviewSessions(sessions);

            // Generate rankings based on correctness + optimization
            const rankings = sessions
                .filter(s => s.status === 'evaluated')
                .map(session => ({
                    id: session.id,
                    candidateName: session.candidateName,
                    overallScore: session.overallScore,
                    technicalScore: session.technicalScore,
                    optimizationScore: session.optimizationScore,
                    rank: 0,
                    status: session.overallScore >= 80 ? 'passed' : 'needs-improvement',
                    phase: session.phase
                }))
                .sort((a, b) => b.overallScore - a.overallScore)
                .map((candidate, index) => ({ ...candidate, rank: index + 1 }));

            setCandidateRankings(rankings);
        } else {
            setInterviewSessions([]);
            setCandidateRankings([]);
        }
    }, [selectedApp, currentPhase]);

    const interviewModes = {
        technical: [
            {
                id: 'ai-fully',
                title: 'AI Fully Conducted',
                icon: Brain,
                description: 'Complete AI-driven technical interview with adaptive questioning',
                features: [
                    'Adaptive technical questions',
                    'Real-time code analysis',
                    'Automated problem-solving evaluation',
                    'Instant technical feedback',
                    'Bias-free assessment'
                ],
                benefits: [
                    'Consistent evaluation standards',
                    'Objective scoring system',
                    'Reduced interviewer bias',
                    'Scalable assessment',
                    'Detailed technical insights'
                ]
            },
            {
                id: 'technical-with-ai',
                title: 'Technical Person with AI Feedback',
                icon: UserCheck,
                description: 'Human technical interviewer enhanced with AI-powered insights',
                features: [
                    'Human-led technical discussion',
                    'AI-powered real-time feedback',
                    'Technical skill validation',
                    'Optimized answer suggestions',
                    'Comprehensive evaluation'
                ],
                benefits: [
                    'Human expertise + AI precision',
                    'Personalized interview experience',
                    'Deep technical assessment',
                    'Real-time guidance',
                    'Enhanced decision support'
                ]
            }
        ],
        hr: [
            {
                id: 'ai-fully',
                title: 'AI Fully Conducted',
                icon: Brain,
                description: 'Complete AI-driven HR interview with behavioral assessment',
                features: [
                    'Behavioral question analysis',
                    'Cultural fit evaluation',
                    'Communication skill assessment',
                    'Personality trait analysis',
                    'Automated recommendation'
                ],
                benefits: [
                    'Standardized HR evaluation',
                    'Unbiased cultural assessment',
                    'Consistent communication scoring',
                    'Objective personality analysis',
                    'Data-driven recommendations'
                ]
            },
            {
                id: 'hr-with-ai',
                title: 'HR Person with AI Feedback',
                icon: Users,
                description: 'Human HR interviewer supported by AI insights and analytics',
                features: [
                    'Human-led HR discussion',
                    'AI-powered behavioral analysis',
                    'Cultural alignment insights',
                    'Communication enhancement',
                    'Comprehensive evaluation'
                ],
                benefits: [
                    'Human empathy + AI analytics',
                    'Personalized HR experience',
                    'Deep cultural assessment',
                    'Enhanced communication insights',
                    'Balanced evaluation approach'
                ]
            }
        ]
    };

    const getScoreColor = (score) => {
        if (score >= 90) return isDarkMode ? 'text-green-400' : 'text-green-600';
        if (score >= 80) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
        if (score >= 70) return isDarkMode ? 'text-orange-400' : 'text-orange-600';
        return isDarkMode ? 'text-red-400' : 'text-red-600';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700';
            case 'in-progress': return isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700';
            case 'completed': return isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700';
            case 'evaluated': return isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700';
            default: return isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700';
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white';
            case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
            case 3: return 'bg-gradient-to-r from-orange-300 to-orange-400 text-white';
            default: return isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-200 text-slate-700';
        }
    };

    const proceedToNextPhase = () => {
        const topCandidates = candidateRankings
            .filter(c => c.overallScore >= 80)
            .slice(0, 4)
            .map(c => ({
                ...c,
                hrStatus: 'pending',
                hrScore: null
            }));

        setCurrentPhase('hr');
        // In a real app, this would update the application data
        console.log('Top candidates for HR interview:', topCandidates);
    };

    const downloadInterviewReport = () => {
        const reportData = {
            jobTitle: selectedApp?.jobTitle || 'Unknown',
            phase: currentPhase,
            interviewMode: selectedInterviewMode,
            candidates: candidateRankings.map(c => ({
                rank: c.rank,
                name: c.candidateName,
                overallScore: c.overallScore,
                technicalScore: c.technicalScore,
                optimizationScore: c.optimizationScore,
                status: c.status
            })),
            sessions: interviewSessions.map(s => ({
                candidate: s.candidateName,
                mode: s.mode,
                status: s.status,
                duration: s.duration,
                interviewer: s.interviewer,
                feedback: s.feedback
            })),
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${currentPhase}-interview-report-${selectedApp?.jobTitle || 'report'}-${new Date().toISOString().split('T')[0]}.json`;

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
                                <Video className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-4xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Interview Management</h1>
                                <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Two-phase interview process with AI-enhanced evaluation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                    <h2 className={`text-xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {applications.map(app => (
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
                                        <div>Assessment Completed: {app.assessment || 0}</div>
                                        <div>Technical Interview: {app.techInterview || 0}</div>
                                        <div>HR Interview: {app.hrInterview || 0}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedApp && (
                    <>
                        {/* Phase Selection */}
                        <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <h2 className={`text-xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Interview Phase</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        id: 'technical',
                                        title: 'Technical Interview',
                                        icon: Target,
                                        description: 'Evaluate technical skills and problem-solving abilities',
                                        candidates: selectedApp.assessment || 0
                                    },
                                    {
                                        id: 'hr',
                                        title: 'HR Interview',
                                        icon: Users,
                                        description: 'Assess cultural fit and communication skills',
                                        candidates: candidateRankings.filter(c => c.status === 'passed').length
                                    }
                                ].map((phase) => {
                                    const Icon = phase.icon;
                                    return (
                                        <button
                                            key={phase.id}
                                            onClick={() => setCurrentPhase(phase.id)}
                                            disabled={phase.id === 'hr' && candidateRankings.filter(c => c.status === 'passed').length === 0}
                                            className={`p-6 rounded-xl border-2 transition-all ${currentPhase === phase.id
                                                ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50'
                                                : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-base-200 hover:border-accent-300'
                                                } ${phase.id === 'hr' && candidateRankings.filter(c => c.status === 'passed').length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className={`font-bold text-lg transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{phase.title}</h3>
                                                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{phase.description}</p>
                                                </div>
                                            </div>
                                            <div className={`text-2xl font-bold ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>
                                                {phase.candidates} Candidates
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Interview Mode Selection */}
                        <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <h2 className={`text-xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                {currentPhase === 'technical' ? 'Technical' : 'HR'} Interview Mode
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {interviewModes[currentPhase].map((mode) => {
                                    const Icon = mode.icon;
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSelectedInterviewMode(mode.id)}
                                            className={`p-6 rounded-xl border-2 transition-all ${selectedInterviewMode === mode.id
                                                ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50'
                                                : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-base-200 hover:border-accent-300'
                                                }`}
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className={`font-bold text-lg transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                    {mode.title}
                                                </h3>
                                            </div>
                                            <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                {mode.description}
                                            </p>
                                            <div className="text-left">
                                                <h4 className={`font-semibold mb-2 text-sm transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>
                                                    Key Features
                                                </h4>
                                                <ul className="space-y-1">
                                                    {mode.features.slice(0, 3).map((feature, index) => (
                                                        <li key={index} className="flex items-start space-x-2">
                                                            <CheckCircle className={`w-3 h-3 mt-1 flex-shrink-0 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`} />
                                                            <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Interview Sessions */}
                        {interviewSessions.length > 0 && (
                            <div className={`rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Interview Sessions
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={downloadInterviewReport}
                                            className="px-4 py-2 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg font-semibold transition-colors flex items-center"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Report
                                        </button>
                                        {currentPhase === 'technical' && candidateRankings.filter(c => c.status === 'passed').length > 0 && (
                                            <button
                                                onClick={proceedToNextPhase}
                                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center"
                                            >
                                                <ChevronRight className="w-4 h-4 mr-2" />
                                                Proceed to HR Interview
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {interviewSessions.map((session) => (
                                        <div key={session.id} className={`p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-base-50 hover:bg-base-100'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getRankColor(session.overallScore >= 85 ? 1 : session.overallScore >= 75 ? 2 : 3)}`}>
                                                        <UserCheck className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                            {session.candidateName}
                                                        </h4>
                                                        <div className="flex items-center space-x-4 mt-1">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                                                                {session.status.replace('-', ' ')}
                                                            </span>
                                                            <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
                                                                {session.mode === 'ai-fully' ? 'AI Conducted' : 'Human + AI'}
                                                            </span>
                                                            <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
                                                                {session.duration}
                                                            </span>
                                                            <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
                                                                Interviewer: {session.interviewer}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${getScoreColor(session.overallScore)}`}>
                                                            {session.overallScore}
                                                        </div>
                                                        <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                            Technical: {session.technicalScore} | Optimal: +{session.optimizationScore}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setShowSessionModal(session)}
                                                            className="p-2 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setShowReportModal(session)}
                                                            className="p-2 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg transition-colors"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Candidate Rankings */}
                        {candidateRankings.length > 0 && (
                            <div className={`rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                                <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Candidate Rankings (Based on Correctness + Answer Optimization)
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Rank</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Candidate</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Overall Score</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Technical Score</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Optimization Bonus</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Status</th>
                                                <th className={`text-left py-4 px-4 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidateRankings.map((candidate) => (
                                                <tr key={candidate.id} className={`border-b transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-base-100 hover:bg-base-50'}`}>
                                                    <td className="py-4 px-4">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${getRankColor(candidate.rank)}`}>
                                                            {candidate.rank}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                            {candidate.candidateName}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-bold text-lg ${getScoreColor(candidate.overallScore)}`}>
                                                            {candidate.overallScore}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className={`font-semibold ${getScoreColor(candidate.technicalScore)}`}>
                                                            {candidate.technicalScore}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-green-600 font-semibold">
                                                            +{candidate.optimizationScore}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${candidate.status === 'passed'
                                                                ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                                                                : isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {candidate.status.replace('-', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button className="p-2 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg transition-colors">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg transition-colors">
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
