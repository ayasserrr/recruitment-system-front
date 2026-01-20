import React, { useState } from 'react';
import { ArrowLeft, FileText, BarChart3, TrendingUp, Users, Clock, Target, CheckCircle, Download, Eye, Calendar, Filter, Award, Brain, Video, ClipboardCheck, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function CandidateReportingDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();

    const reportingPhases = [
        {
            id: 'semantic',
            title: 'Semantic Analysis Reports',
            icon: Brain,
            description: 'AI-powered resume analysis and candidate matching insights',
            dataPoints: [
                'Resume parsing and skill extraction',
                'Experience level assessment',
                'Cultural fit indicators',
                'Career trajectory analysis'
            ],
            scoring: 'Weighted algorithm with 15% impact on final score'
        },
        {
            id: 'technical',
            title: 'Technical Assessment Reports',
            icon: ClipboardCheck,
            description: 'Comprehensive skill evaluation and performance analytics',
            dataPoints: [
                'Coding challenge results',
                'Problem-solving capabilities',
                'Technical knowledge assessment',
                'Skill gap identification'
            ],
            scoring: 'Automated scoring with 30% impact on final evaluation'
        },
        {
            id: 'interview',
            title: 'Interview Evaluation Reports',
            icon: Video,
            description: 'Interview performance and evaluator consistency analytics',
            dataPoints: [
                'Technical interview responses',
                'Communication skills assessment',
                'Problem-solving approach analysis',
                'Cultural compatibility evaluation'
            ],
            scoring: 'Combined human + AI scoring with 25% impact'
        },
        {
            id: 'hr',
            title: 'HR Assessment Reports',
            icon: Users,
            description: 'Soft skills and cultural fit comprehensive analysis',
            dataPoints: [
                'Behavioral assessment results',
                'Team compatibility metrics',
                'Leadership potential analysis',
                'Career goals alignment'
            ],
            scoring: 'HR evaluation with 20% impact on final score'
        }
    ];

    const finalReportFeatures = [
        {
            title: 'Comprehensive Candidate Profile',
            description: 'Complete evaluation summary combining all phase data',
            icon: FileText,
            benefits: [
                'Holistic view of candidate capabilities',
                'Data-driven decision making',
                'Consistent evaluation framework',
                'Reduced hiring bias'
            ]
        },
        {
            title: 'Comparative Analysis',
            description: 'Side-by-side candidate comparisons across all metrics',
            icon: BarChart3,
            benefits: [
                'Objective candidate ranking',
                'Identify top performers',
                'Role-specific matching',
                'Team fit assessment'
            ]
        },
        {
            title: 'Predictive Insights',
            description: 'AI-powered predictions for future performance and success',
            icon: TrendingUp,
            benefits: [
                'Success probability scoring',
                'Performance predictions',
                'Retention likelihood',
                'Growth potential analysis'
            ]
        },
        {
            title: 'Risk Assessment',
            description: 'Identify potential hiring risks and mitigation strategies',
            icon: Target,
            benefits: [
                'Risk factor identification',
                'Mitigation recommendations',
                'Compliance checking',
                'Background verification insights'
            ]
        }
    ];

    const reportTypes = [
        {
            name: 'Phase Reports',
            description: 'Detailed reports after each recruitment phase',
            icon: Clock,
            features: [
                'Real-time phase completion updates',
                'Individual candidate scoring',
                'Phase-specific insights',
                'Progress tracking'
            ]
        },
        {
            name: 'Final Report',
            description: 'Comprehensive final evaluation summary',
            icon: Award,
            features: [
                'All-phase data aggregation',
                'Final ranking system',
                'Hiring recommendations',
                'Executive summary'
            ]
        }
    ];

    const renderOverview = () => (
        <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                Comprehensive Candidate Reporting
            </h2>
            <p className={`text-lg mb-8 text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                Generate detailed reports after each recruitment phase and comprehensive final candidate evaluations
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-6 rounded-lg border-2 border-blue-200 bg-blue-50`}>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`font-bold mb-3 text-lg text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Phase-by-Phase Reports
                    </h3>
                    <p className={`text-sm text-center mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-600' : 'text-base-600'}`}>
                        Detailed insights and candidate responses after each recruitment phase
                    </p>
                    <ul className="space-y-2">
                        {['Real-time scoring', 'Candidate rankings', 'Performance analytics', 'Progress tracking'].map((item, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`p-6 rounded-lg border-2 border-green-200 bg-green-50`}>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`font-bold mb-3 text-lg text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Final Candidate Reports
                    </h3>
                    <p className={`text-sm text-center mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-600' : 'text-base-600'}`}>
                        Comprehensive evaluation combining all phase data and assessments
                    </p>
                    <ul className="space-y-2">
                        {['Complete candidate profile', 'Comparative analysis', 'Hiring recommendations', 'Risk assessment'].map((item, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderPhaseReports = () => (
        <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
            <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                Detailed Reports After Each Phase
            </h3>
            <p className={`text-lg mb-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                Comprehensive reports generated after every recruitment phase with detailed candidate insights
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportingPhases.map((phase, index) => {
                    const Icon = phase.icon;
                    return (
                        <div key={index} className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        {phase.title}
                                    </h4>
                                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                        {phase.scoring}
                                    </p>
                                </div>
                            </div>
                            <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                {phase.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderFinalReports = () => (
        <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
            <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                Final Report for Each Candidate
            </h3>
            <p className={`text-lg mb-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                Comprehensive final reports that aggregate all phase data into actionable hiring recommendations for each candidate
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {finalReportFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    {feature.title}
                                </h4>
                            </div>
                            <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );


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
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Candidate Reporting System
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Generate comprehensive reports after each recruitment phase and detailed final candidate evaluations with actionable insights
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto space-y-8">
                    {renderOverview()}
                    {renderPhaseReports()}
                    {renderFinalReports()}
                </div>
            </div>
        </div>
    );
}
