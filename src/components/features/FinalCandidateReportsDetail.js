import React, { useState } from 'react';
import { ArrowLeft, Award, FileText, Users, Star, TrendingUp, CheckCircle, Download, Eye, BarChart3, Target, Brain, Video, ClipboardCheck } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function FinalCandidateReportsDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activeSection, setActiveSection] = useState('overview');

    const reportSections = [
        {
            id: 'overview',
            title: 'Executive Summary',
            icon: FileText,
            description: 'High-level candidate overview and recommendation'
        },
        {
            id: 'skills',
            title: 'Skills Assessment',
            icon: Brain,
            description: 'Comprehensive technical and soft skills evaluation'
        },
        {
            id: 'performance',
            title: 'Performance Metrics',
            icon: BarChart3,
            description: 'Quantitative assessment across all evaluation stages'
        },
        {
            id: 'interviews',
            title: 'Interview Feedback',
            icon: Video,
            description: 'Detailed interview evaluation and insights'
        },
        {
            id: 'potential',
            title: 'Growth Potential',
            icon: TrendingUp,
            description: 'Future development and career trajectory analysis'
        }
    ];

    const candidateProfile = {
        name: 'Sarah Chen',
        position: 'Senior Software Engineer',
        overallScore: 92,
        recommendation: 'Strong Hire',
        strengths: [
            'Advanced problem-solving skills',
            'Excellent system design capabilities',
            'Strong leadership potential',
            'Cultural alignment score: 94%'
        ],
        areas: [
            'Cloud architecture experience',
            'Team mentoring skills',
            'Cross-functional collaboration'
        ]
    };

    const phaseScores = [
        { phase: 'Semantic Analysis', score: 94, weight: '15%', icon: Brain },
        { phase: 'Technical Assessment', score: 88, weight: '25%', icon: ClipboardCheck },
        { phase: 'Technical Interview', score: 91, weight: '30%', icon: Video },
        { phase: 'HR Interview', score: 95, weight: '20%', icon: Users },
        { phase: 'Final Evaluation', score: 92, weight: '10%', icon: Award }
    ];

    const skillsMatrix = [
        {
            category: 'Technical Skills', items: [
                { skill: 'Python/JavaScript', level: 'Expert', score: 95 },
                { skill: 'System Design', level: 'Advanced', score: 88 },
                { skill: 'Cloud Architecture', level: 'Intermediate', score: 76 },
                { skill: 'Database Design', level: 'Advanced', score: 85 }
            ]
        },
        {
            category: 'Soft Skills', items: [
                { skill: 'Communication', level: 'Expert', score: 92 },
                { skill: 'Leadership', level: 'Advanced', score: 87 },
                { skill: 'Problem Solving', level: 'Expert', score: 96 },
                { skill: 'Team Collaboration', level: 'Advanced', score: 90 }
            ]
        },
        {
            category: 'Cultural Fit', items: [
                { skill: 'Values Alignment', level: 'Strong', score: 94 },
                { skill: 'Work Style', level: 'Excellent Fit', score: 91 },
                { skill: 'Growth Mindset', level: 'Strong', score: 93 },
                { skill: 'Adaptability', level: 'High', score: 89 }
            ]
        }
    ];

    const interviewInsights = [
        {
            type: 'Technical Interview',
            date: '2025-12-10',
            interviewer: 'Alex Kumar',
            score: 91,
            feedback: 'Exceptional problem-solving approach. Demonstrated deep understanding of distributed systems and scalability considerations. Code quality was outstanding with clean, maintainable solutions.',
            strengths: ['Algorithm design', 'Code optimization', 'System architecture'],
            improvements: ['Cloud deployment patterns']
        },
        {
            type: 'HR Interview',
            date: '2025-12-11',
            interviewer: 'Maria Rodriguez',
            score: 95,
            feedback: 'Excellent cultural fit with strong alignment to company values. Demonstrated leadership potential and clear career growth trajectory. Communication skills are exceptional.',
            strengths: ['Cultural alignment', 'Leadership potential', 'Communication'],
            improvements: ['Cross-functional exposure']
        }
    ];

    const getScoreColor = (score) => {
        if (score >= 90) return isDarkMode ? 'text-green-400' : 'text-green-600';
        if (score >= 80) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
        if (score >= 70) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
        return isDarkMode ? 'text-red-400' : 'text-red-600';
    };

    const getScoreBackground = (score) => {
        if (score >= 90) return isDarkMode ? 'bg-green-500/20' : 'bg-green-100';
        if (score >= 80) return isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100';
        if (score >= 70) return isDarkMode ? 'bg-accent-500/20' : 'bg-accent-100';
        return isDarkMode ? 'bg-red-500/20' : 'bg-red-100';
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={onBack}
                        className={`flex items-center space-x-2 mb-6 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-base-600 hover:text-base-900'}`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Features</span>
                    </button>

                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-gradient-to-r from-base-500 to-accent-500 w-20 h-20 rounded-2xl flex items-center justify-center">
                                <Award className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Final Candidate Reports
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Comprehensive evaluation summaries combining all phase data, assessments, and interviews into unified candidate profiles with actionable insights
                        </p>
                    </div>
                </div>

                {/* Section Navigation */}
                <div className="flex flex-wrap space-x-2 mb-8">
                    {reportSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeSection === section.id
                                    ? isDarkMode
                                        ? 'bg-accent-500 text-white'
                                        : 'bg-accent-600 text-white'
                                    : isDarkMode
                                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                        : 'bg-white text-base-700 hover:bg-base-100 border border-base-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{section.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Candidate Profile Header */}
                <div className={`border rounded-xl p-8 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                {candidateProfile.name}
                            </h2>
                            <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                {candidateProfile.position}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <div className={`text-center p-4 rounded-lg ${getScoreBackground(candidateProfile.overallScore)}`}>
                                <div className={`text-3xl font-bold ${getScoreColor(candidateProfile.overallScore)}`}>
                                    {candidateProfile.overallScore}
                                </div>
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                    Overall Score
                                </div>
                            </div>
                            <div className={`px-6 py-3 rounded-lg font-bold ${candidateProfile.recommendation === 'Strong Hire'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                                }`}>
                                {candidateProfile.recommendation}
                            </div>
                        </div>
                    </div>

                    {/* Phase Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {phaseScores.map((phase, index) => {
                            const Icon = phase.icon;
                            return (
                                <div key={index} className={`p-4 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                    <div className={`text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        {phase.phase}
                                    </div>
                                    <div className={`text-xl font-bold ${getScoreColor(phase.score)}`}>
                                        {phase.score}
                                    </div>
                                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>
                                        {phase.weight}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content based on active section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeSection === 'overview' && (
                            <div className="space-y-6">
                                <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                    <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Key Strengths
                                    </h3>
                                    <ul className="space-y-3">
                                        {candidateProfile.strengths.map((strength, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <Star className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                                <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                    {strength}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                    <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Development Areas
                                    </h3>
                                    <ul className="space-y-3">
                                        {candidateProfile.areas.map((area, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <Target className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                    {area}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeSection === 'skills' && (
                            <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Skills Assessment Matrix
                                </h3>
                                <div className="space-y-6">
                                    {skillsMatrix.map((category, index) => (
                                        <div key={index}>
                                            <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                {category.category}
                                            </h4>
                                            <div className="space-y-3">
                                                {category.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {item.skill}
                                                            </div>
                                                            <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>
                                                                {item.level}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="h-2 rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${item.score}%`,
                                                                        backgroundColor: item.score >= 90 ? '#10b981' : item.score >= 80 ? '#3b82f6' : item.score >= 70 ? '#eab308' : '#ef4444'
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className={`text-sm font-bold w-12 text-right ${getScoreColor(item.score)}`}>
                                                                {item.score}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'interviews' && (
                            <div className="space-y-6">
                                {interviewInsights.map((interview, index) => (
                                    <div key={index} className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                {interview.type}
                                            </h4>
                                            <div className="flex items-center space-x-4">
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                    {interview.date}
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg font-bold ${getScoreBackground(interview.score)} ${getScoreColor(interview.score)}`}>
                                                    {interview.score}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            Interviewer: {interview.interviewer}
                                        </p>
                                        <p className={`mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {interview.feedback}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                    Strengths
                                                </h5>
                                                <ul className="space-y-1">
                                                    {interview.strengths.map((strength, strengthIndex) => (
                                                        <li key={strengthIndex} className="flex items-center space-x-2">
                                                            <CheckCircle className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                                                            <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {strength}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                    Development Areas
                                                </h5>
                                                <ul className="space-y-1">
                                                    {interview.improvements.map((improvement, improvementIndex) => (
                                                        <li key={improvementIndex} className="flex items-center space-x-2">
                                                            <Target className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                            <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {improvement}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === 'performance' && (
                            <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Performance Metrics Analysis
                                </h3>
                                <div className="space-y-6">
                                    {phaseScores.map((phase, index) => {
                                        const Icon = phase.icon;
                                        return (
                                            <div key={index} className="flex items-center justify-between p-4 rounded-lg transition-colors duration-300">
                                                <div className="flex items-center space-x-4">
                                                    <Icon className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                                    <div>
                                                        <div className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                            {phase.phase}
                                                        </div>
                                                        <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>
                                                            Weight: {phase.weight}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-48 bg-gray-200 rounded-full h-3">
                                                        <div
                                                            className="h-3 rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${phase.score}%`,
                                                                backgroundColor: phase.score >= 90 ? '#10b981' : phase.score >= 80 ? '#3b82f6' : phase.score >= 70 ? '#eab308' : '#ef4444'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-lg font-bold w-12 text-right ${getScoreColor(phase.score)}`}>
                                                        {phase.score}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeSection === 'potential' && (
                            <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Growth Potential Analysis
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                            Career Trajectory Predictions
                                        </h4>
                                        <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                            <p className={`mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                Based on current performance metrics and learning agility, Sarah shows strong potential for advancement to Senior Technical Lead within 18-24 months.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                        18-24
                                                    </div>
                                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                        Months to Lead Role
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                        87%
                                                    </div>
                                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                        Leadership Potential
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                                        92%
                                                    </div>
                                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                        Learning Agility
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                            Recommended Development Path
                                        </h4>
                                        <ul className="space-y-2">
                                            {[
                                                'Advanced cloud architecture certification',
                                                'Team leadership training program',
                                                'Cross-functional project exposure',
                                                'Mentoring junior developers',
                                                'Technical conference presentations'
                                            ].map((item, index) => (
                                                <li key={index} className="flex items-center space-x-2">
                                                    <TrendingUp className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                                    <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Report Actions */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Report Actions
                            </h3>
                            <div className="space-y-3">
                                <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-accent-500 text-white hover:bg-accent-600' : 'bg-accent-600 text-white hover:bg-accent-700'}`}>
                                    <Download className="w-4 h-4 inline mr-2" />
                                    Download Full Report
                                </button>
                                <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 border ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-700 hover:bg-base-100'}`}>
                                    <Eye className="w-4 h-4 inline mr-2" />
                                    View Summary
                                </button>
                                <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 border ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-700 hover:bg-base-100'}`}>
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    Export to PDF
                                </button>
                            </div>
                        </div>

                        {/* Comparative Analysis */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Comparative Analysis
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Rank among candidates
                                    </span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                        #1 of 47
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Above average score
                                    </span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        +18%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Hire confidence
                                    </span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        94%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Report Features
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Multi-phase data aggregation',
                                    'AI-powered insights',
                                    'Comparative benchmarking',
                                    'Predictive analytics',
                                    'Customizable scoring',
                                    'Real-time updates'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
