import React, { useState } from 'react';
import { ArrowLeft, FileText, BarChart3, TrendingUp, Users, Clock, Target, CheckCircle, Download, Eye, Calendar, Filter, Award } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function PhaseReportingDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activePhase, setActivePhase] = useState('semantic');

    const phases = [
        {
            id: 'semantic',
            title: 'Semantic Analysis Reports',
            icon: Target,
            description: 'Deep AI analysis insights and candidate matching metrics',
            features: [
                { title: 'Intelligent Resume Processing', description: 'Advanced AI algorithms analyze candidate resumes beyond simple keyword matching' },
                { title: 'Contextual Skill Assessment', description: 'Evaluates skills in the context of actual project experience and career progression' },
                { title: 'Career Trajectory Analysis', description: 'Tracks candidate career patterns to predict future performance and growth potential' },
                { title: 'Cultural Fit Indicators', description: 'Identifies alignment with company values and team dynamics through semantic patterns' }
            ],
            benefits: [
                'Identify top-performing candidates through advanced pattern recognition',
                'Reduce screening time while maintaining high-quality candidate evaluation',
                'Discover hidden talent that traditional screening methods might miss',
                'Make data-driven decisions with comprehensive candidate insights'
            ]
        },
        {
            id: 'assessment',
            title: 'Technical Assessment Reports',
            icon: BarChart3,
            description: 'Comprehensive skill evaluation and performance analytics',
            features: [
                { title: 'Customizable Test Creation', description: 'Design tailored assessments that match your specific technical requirements' },
                { title: 'Automated Performance Analysis', description: 'Instant evaluation of technical skills with detailed scoring and feedback' },
                { title: 'Skill Gap Identification', description: 'Pinpoint specific areas where candidates need development or improvement' },
                { title: 'Real-time Performance Tracking', description: 'Monitor candidate progress during assessments with live analytics' }
            ],
            benefits: [
                'Evaluate technical capabilities with practical, job-relevant challenges',
                'Standardize assessment processes for fair and consistent evaluation',
                'Reduce interviewer bias through objective technical measurement',
                'Identify candidates with the right skills for your specific technical environment'
            ]
        },
        {
            id: 'interviews',
            title: 'Interview Evaluation Reports',
            icon: Users,
            description: 'Interview performance and evaluator consistency analytics',
            features: [
                { title: 'Structured Interview Frameworks', description: 'Standardized question sets and evaluation criteria for consistent interviews' },
                { title: 'Multi-format Interview Support', description: 'Accommodates technical, behavioral, and panel interview formats' },
                { title: 'Evaluator Calibration Tools', description: 'Ensure consistency across different interviewers and evaluation styles' },
                { title: 'Candidate Experience Tracking', description: 'Monitor and improve the interview experience for all candidates' }
            ],
            benefits: [
                'Improve hiring decisions through structured, consistent interview processes',
                'Reduce unconscious bias with standardized evaluation frameworks',
                'Enhance candidate experience through professional and fair interviews',
                'Speed up decision-making with clear evaluation criteria and scoring'
            ]
        },
        {
            id: 'final',
            title: 'Final Ranking Reports',
            icon: Award,
            description: 'Comprehensive candidate evaluation and recommendation analytics',
            features: [
                { title: 'Multi-factor Ranking Algorithm', description: 'Combines all evaluation data into comprehensive candidate scoring' },
                { title: 'Comparative Analysis Tools', description: 'Side-by-side candidate comparisons across all evaluation dimensions' },
                { title: 'Risk Assessment Dashboard', description: 'Identify potential hiring risks and mitigation strategies for each candidate' },
                { title: 'AI-Powered Recommendations', description: 'Intelligent suggestions based on historical hiring success patterns' }
            ],
            benefits: [
                'Make confident hiring decisions with comprehensive candidate evaluation',
                'Reduce hiring mistakes through data-driven risk assessment',
                'Improve team performance by selecting candidates with proven success indicators',
                'Streamline final decision process with clear ranking and recommendation systems'
            ]
        }
    ];

    const currentPhase = phases.find(phase => phase.id === activePhase);

    const reportTypes = [
        {
            name: 'Executive Summary',
            description: 'Strategic overview for leadership decision-making',
            icon: BarChart3,
            benefits: ['Make informed hiring decisions with high-level insights', 'Track recruitment ROI and budget effectiveness', 'Identify strategic opportunities for process improvement', 'Align recruitment goals with business objectives']
        },
        {
            name: 'Detailed Analytics',
            description: 'In-depth analysis for recruitment optimization',
            icon: TrendingUp,
            benefits: ['Deep dive into recruitment process performance', 'Identify bottlenecks and optimization opportunities', 'Compare effectiveness across different channels', 'Forecast future hiring needs and trends']
        },
        {
            name: 'Candidate Insights',
            description: 'Individual candidate evaluation reports',
            icon: Users,
            benefits: ['Personalized candidate assessment profiles', 'Track individual candidate progression', 'Identify high-potential talent early', 'Make fair and consistent evaluation decisions']
        },
        {
            name: 'Process Efficiency',
            description: 'Workflow optimization and performance reports',
            icon: Clock,
            benefits: ['Streamline recruitment processes for faster hiring', 'Reduce administrative overhead and manual work', 'Improve interviewer productivity and coordination', 'Enhance overall candidate experience']
        }
    ];

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
                            Phase-by-Phase Reporting
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Detailed analytics and insights for each recruitment phase, tracking candidate progression and pipeline efficiency with comprehensive data visualization
                        </p>
                    </div>
                </div>

                {/* Phase Navigation */}
                <div className="flex flex-wrap space-x-2 mb-8">
                    {phases.map((phase) => (
                        <button
                            key={phase.id}
                            onClick={() => setActivePhase(phase.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activePhase === phase.id
                                ? isDarkMode
                                    ? 'bg-accent-500 text-white'
                                    : 'bg-accent-600 text-white'
                                : isDarkMode
                                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    : 'bg-white text-base-700 hover:bg-base-100 border border-base-300'
                                }`}
                        >
                            {phase.title}
                        </button>
                    ))}
                </div>

                {/* Current Phase Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Phase Overview */}
                        <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                {currentPhase.title}
                            </h2>
                            <p className={`text-lg mb-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                {currentPhase.description}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {currentPhase.features.map((feature, index) => (
                                    <div key={index} className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                        <h4 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                                            {feature.title}
                                        </h4>
                                        <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Key Benefits */}
                            <div>
                                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Key Benefits
                                </h3>
                                <ul className="space-y-3">
                                    {currentPhase.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                                            <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                {benefit}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Report Types */}
                        <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Available Report Types
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reportTypes.map((type, index) => {
                                    const Icon = type.icon;
                                    return (
                                        <div key={index} className={`border rounded-lg p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg flex items-center justify-center`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                    {type.name}
                                                </h4>
                                            </div>
                                            <p className={`text-sm mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                {type.description}
                                            </p>
                                            <ul className="space-y-1">
                                                {type.benefits.map((benefit, benefitIndex) => (
                                                    <li key={benefitIndex} className="flex items-center space-x-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-teal-400' : 'bg-teal-600'}`}></div>
                                                        <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                            {benefit}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Report Generation */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Report Generation
                            </h3>
                            <div className="space-y-3">
                                <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-accent-500 text-white hover:bg-accent-600' : 'bg-accent-600 text-white hover:bg-accent-700'}`}>
                                    <Download className="w-4 h-4 inline mr-2" />
                                    Generate PDF Report
                                </button>
                                <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 border ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-700 hover:bg-base-100'}`}>
                                    <Eye className="w-4 h-4 inline mr-2" />
                                    View Live Dashboard
                                </button>
                                <button className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 border ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-700 hover:bg-base-100'}`}>
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Schedule Reports
                                </button>
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Key Features
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Real-time data updates',
                                    'Customizable dashboards',
                                    'Automated report scheduling',
                                    'Interactive data visualization',
                                    'Cross-phase correlation analysis',
                                    'Predictive analytics integration'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Data Sources */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Data Sources
                            </h3>
                            <ul className="space-y-2">
                                {[
                                    'Candidate application data',
                                    'Assessment results',
                                    'Interview feedback',
                                    'Historical performance',
                                    'Industry benchmarks',
                                    'AI model outputs'
                                ].map((source, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <Filter className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                                        <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {source}
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
