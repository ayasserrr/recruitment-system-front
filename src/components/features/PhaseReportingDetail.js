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
            metrics: [
                { label: 'Candidates Processed', value: '1,247', trend: '+23%' },
                { label: 'Match Accuracy', value: '94%', trend: '+8%' },
                { label: 'Processing Time', value: '2.3s', trend: '-15%' },
                { label: 'Skill Coverage', value: '87%', trend: '+12%' }
            ],
            insights: [
                'Top performing candidates show 3x higher skill relevance',
                'Machine learning models improve accuracy by 15% weekly',
                'Industry-specific terminology recognition increased by 45%',
                'Candidate experience patterns predict success with 78% accuracy'
            ]
        },
        {
            id: 'assessment',
            title: 'Technical Assessment Reports',
            icon: BarChart3,
            description: 'Comprehensive skill evaluation and performance analytics',
            metrics: [
                { label: 'Assessments Completed', value: '892', trend: '+31%' },
                { label: 'Average Score', value: '76%', trend: '+5%' },
                { label: 'Completion Rate', value: '87%', trend: '+9%' },
                { label: 'Skill Gap ID', value: '94%', trend: '+18%' }
            ],
            insights: [
                'Python developers show highest problem-solving scores',
                'System design assessments predict senior-level performance',
                'Time-based tests correlate better with real-world performance',
                'Multi-language candidates demonstrate 25% better adaptability'
            ]
        },
        {
            id: 'interviews',
            title: 'Interview Evaluation Reports',
            icon: Users,
            description: 'Interview performance and evaluator consistency analytics',
            metrics: [
                { label: 'Interviews Conducted', value: '456', trend: '+18%' },
                { label: 'Evaluator Consistency', value: '89%', trend: '+6%' },
                { label: 'Candidate Satisfaction', value: '4.7/5', trend: '+0.2' },
                { label: 'Decision Time', value: '1.8 days', trend: '-32%' }
            ],
            insights: [
                'Technical interviews predict on-job performance with 82% accuracy',
                'Behavioral assessments improve cultural fit matching by 34%',
                'Panel interviews reduce individual bias by 67%',
                'Structured questions increase evaluation reliability by 45%'
            ]
        },
        {
            id: 'final',
            title: 'Final Ranking Reports',
            icon: Award,
            description: 'Comprehensive candidate evaluation and recommendation analytics',
            metrics: [
                { label: 'Candidates Ranked', value: '234', trend: '+12%' },
                { label: 'Hiring Accuracy', value: '91%', trend: '+11%' },
                { label: 'Time-to-Rank', value: '0.8 days', trend: '-28%' },
                { label: 'Satisfaction Score', value: '4.8/5', trend: '+0.3' }
            ],
            insights: [
                'Multi-factor ranking improves hiring quality by 41%',
                'AI recommendations match human decisions 89% of the time',
                'Diverse candidates show 23% higher retention rates',
                'Comprehensive evaluations reduce turnover by 34%'
            ]
        }
    ];

    const currentPhase = phases.find(phase => phase.id === activePhase);

    const reportTypes = [
        {
            name: 'Executive Summary',
            description: 'High-level overview for leadership',
            icon: BarChart3,
            features: ['KPI dashboards', 'Trend analysis', 'ROI metrics', 'Strategic insights']
        },
        {
            name: 'Detailed Analytics',
            description: 'Comprehensive data analysis',
            icon: TrendingUp,
            features: ['Statistical breakdowns', 'Comparative analysis', 'Performance trends', 'Predictive models']
        },
        {
            name: 'Candidate Insights',
            description: 'Individual candidate reports',
            icon: Users,
            features: ['Skill assessments', 'Performance history', 'Potential analysis', 'Fit scoring']
        },
        {
            name: 'Process Efficiency',
            description: 'Workflow optimization reports',
            icon: Clock,
            features: ['Bottleneck identification', 'Time analysis', 'Resource utilization', 'Process recommendations']
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

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {currentPhase.metrics.map((metric, index) => (
                                    <div key={index} className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-medium uppercase tracking-wide transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                {metric.label}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.trend.startsWith('+')
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {metric.trend}
                                            </span>
                                        </div>
                                        <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                                            {metric.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Key Insights */}
                            <div>
                                <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Key Insights
                                </h3>
                                <ul className="space-y-3">
                                    {currentPhase.insights.map((insight, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                                            <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                {insight}
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
                                                {type.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-center space-x-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-teal-400' : 'bg-teal-600'}`}></div>
                                                        <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                            {feature}
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
