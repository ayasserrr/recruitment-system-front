import React, { useState } from 'react';
import { ArrowLeft, ClipboardCheck, FileText, Code, Clock, Target, BarChart3, CheckCircle, Award, Users, Zap, TrendingUp, Settings } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function TechnicalAssessmentDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('overview');

    const assessmentTypes = [
        {
            id: 'coding',
            title: 'Coding Challenges',
            icon: Code,
            description: 'Real-time coding evaluation with automated testing',
            features: [
                'Multiple programming languages support',
                'Automated test case execution',
                'Performance and complexity analysis',
                'Code quality scoring',
                'Plagiarism detection'
            ]
        },
        {
            id: 'multiple-choice',
            title: 'Technical MCQs',
            icon: FileText,
            description: 'Comprehensive technical knowledge assessment',
            features: [
                'Domain-specific question banks',
                'Adaptive difficulty levels',
                'Time-bound assessments',
                'Instant scoring and feedback',
                'Detailed performance analytics'
            ]
        },
        {
            id: 'practical',
            title: 'Practical Projects',
            icon: Target,
            description: 'Hands-on evaluation of real-world skills',
            features: [
                'Project-based assessments',
                'Portfolio review capabilities',
                'Collaborative coding exercises',
                'System design challenges',
                'Problem-solving scenarios'
            ]
        }
    ];

    const workflowSteps = [
        {
            id: 1,
            title: "Assessment Design",
            description: "Create customized technical evaluations",
            icon: Settings,
            details: [
                "Define skill requirements",
                "Select assessment type",
                "Configure difficulty levels",
                "Set time constraints",
                "Customize scoring criteria"
            ]
        },
        {
            id: 2,
            title: "Candidate Testing",
            description: "Automated assessment delivery and monitoring",
            icon: Users,
            details: [
                "Secure test environment",
                "Real-time progress tracking",
                "Anti-cheating measures",
                "Performance monitoring",
                "Automated proctoring"
            ]
        },
        {
            id: 3,
            title: "Automated Scoring",
            description: "Intelligent evaluation and analysis",
            icon: BarChart3,
            details: [
                "Instant result generation",
                "Multi-factor scoring",
                "Skill gap identification",
                "Performance benchmarking",
                "Detailed analytics"
            ]
        },
        {
            id: 4,
            title: "Report Generation",
            description: "Comprehensive candidate evaluation reports",
            icon: Award,
            details: [
                "Skill proficiency reports",
                "Comparative analysis",
                "Strength/weakness identification",
                "Recommendation insights",
                "Trend analysis"
            ]
        }
    ];

    const metrics = [
        { label: 'Assessment Completion Rate', value: '87%', trend: '+12%' },
        { label: 'Average Score Accuracy', value: '92%', trend: '+8%' },
        { label: 'Time-to-Evaluate', value: '4.2 min', trend: '-35%' },
        { label: 'Skill Match Rate', value: '78%', trend: '+23%' }
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
                                <ClipboardCheck className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Technical Assessment Platform
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Comprehensive skill evaluation platform with automated testing, intelligent scoring, and detailed performance analytics
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8 border-b">
                    {['overview', 'assessment-types', 'workflow'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${activeTab === tab
                                ? isDarkMode
                                    ? 'text-orange-400 border-orange-400'
                                    : 'text-orange-600 border-orange-600'
                                : isDarkMode
                                    ? 'text-gray-400 border-transparent hover:text-gray-300'
                                    : 'text-base-600 border-transparent hover:text-base-800'
                                }`}
                        >
                            {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                    ))}
                </div>

                {/* Content based on active tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Overview */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Platform Capabilities
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { icon: Zap, title: 'Real-time Evaluation', description: 'Instant scoring and feedback as candidates complete assessments' },
                                        { icon: Target, title: 'Customizable Tests', description: 'Tailor assessments to specific job requirements and skill levels' },
                                        { icon: BarChart3, title: 'Advanced Analytics', description: 'Detailed performance insights and skill gap analysis' },
                                        { icon: Users, title: 'Scalable Platform', description: 'Handle hundreds of simultaneous assessments with ease' }
                                    ].map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                        {item.title}
                                                    </h3>
                                                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Performance Metrics
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {metrics.map((metric, index) => (
                                        <div key={index} className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                    {metric.label}
                                                </span>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.trend.startsWith('+')
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {metric.trend}
                                                </span>
                                            </div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                                {metric.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    Key Features
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        'Automated test generation',
                                        'Multi-language support',
                                        'Real-time monitoring',
                                        'Advanced anti-cheating',
                                        'Detailed analytics',
                                        'Custom scoring criteria'
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                                            <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'assessment-types' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {assessmentTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <div key={type.id} className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                            {type.title}
                                        </h3>
                                    </div>
                                    <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        {type.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {type.features.map((feature, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <CheckCircle className={`w-3 h-3 mt-1 flex-shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
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
                )}

                {activeTab === 'workflow' && (
                    <div className="space-y-6">
                        {workflowSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.id} className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                    <div className="flex items-start space-x-4">
                                        <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                    {step.title}
                                                </h3>
                                                <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDarkMode ? 'bg-accent-500/20 text-accent-400' : 'bg-accent-100 text-accent-700'}`}>
                                                    Step {index + 1}
                                                </span>
                                            </div>
                                            <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                {step.description}
                                            </p>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {step.details.map((detail, detailIndex) => (
                                                    <li key={detailIndex} className="flex items-start space-x-2">
                                                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                                                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                            {detail}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
