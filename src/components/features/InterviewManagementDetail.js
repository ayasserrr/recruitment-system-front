import React, { useState } from 'react';
import { ArrowLeft, Video, Users, Calendar, Clock, CheckCircle, Star, MessageSquare, FileText, Settings, BarChart3, Award, Target } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function InterviewManagementDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('technical');

    const interviewTypes = [
        {
            id: 'technical',
            title: 'Technical Interviews',
            icon: Video,
            description: 'Comprehensive technical evaluation with multiple assessment approaches',
            approaches: [
                {
                    name: 'Live Coding Sessions',
                    description: 'Real-time problem solving and code evaluation',
                    features: ['Shared coding environment', 'Real-time syntax checking', 'Multiple language support', 'Screen sharing capabilities']
                },
                {
                    name: 'System Design Discussions',
                    description: 'Architecture and scalability evaluation',
                    features: ['Whiteboard collaboration', 'Diagram tools', 'Database design', 'Infrastructure planning']
                },
                {
                    name: 'Problem-Solving Sessions',
                    description: 'Algorithmic thinking and analytical skills',
                    features: ['Complex challenges', 'Time-bound exercises', 'Step-by-step evaluation', 'Performance metrics']
                }
            ]
        },
        {
            id: 'hr',
            title: 'HR Interviews',
            icon: Users,
            description: 'Cultural fit assessment and soft skills evaluation',
            approaches: [
                {
                    name: 'Behavioral Interviews',
                    description: 'Past behavior and situational judgment',
                    features: ['STAR method evaluation', 'Cultural alignment assessment', 'Communication skills', 'Team compatibility']
                },
                {
                    name: 'Cultural Fit Assessment',
                    description: 'Organizational values and work style alignment',
                    features: ['Values matching', 'Work style analysis', 'Team dynamics', 'Growth mindset evaluation']
                },
                {
                    name: 'Career Aspiration Review',
                    description: 'Long-term goals and development potential',
                    features: ['Career path analysis', 'Growth potential', 'Learning orientation', 'Leadership qualities']
                }
            ]
        }
    ];

    const workflowSteps = [
        {
            id: 1,
            title: "Interview Scheduling",
            description: "Automated scheduling and coordination",
            icon: Calendar,
            details: [
                "Calendar integration",
                "Automated reminders",
                "Time zone management",
                "Rescheduling flexibility",
                "Buffer time allocation"
            ]
        },
        {
            id: 2,
            title: "Interview Preparation",
            description: "Structured framework and evaluation criteria",
            icon: Settings,
            details: [
                "Question bank management",
                "Evaluation rubrics",
                "Interviewer guidelines",
                "Candidate brief preparation",
                "Technical setup verification"
            ]
        },
        {
            id: 3,
            title: "Session Management",
            description: "Real-time interview execution and monitoring",
            icon: Video,
            details: [
                "Video conferencing integration",
                "Recording capabilities",
                "Note-taking tools",
                "Real-time evaluation",
                "Technical support"
            ]
        },
        {
            id: 4,
            title: "Feedback Collection",
            description: "Structured evaluation and scoring",
            icon: MessageSquare,
            details: [
                "Standardized feedback forms",
                "Multi-rater evaluation",
                "Bias detection tools",
                "Comment aggregation",
                "Score normalization"
            ]
        },
        {
            id: 5,
            title: "Report Generation",
            description: "Comprehensive interview analysis and insights",
            icon: FileText,
            details: [
                "Interview summary reports",
                "Comparative analysis",
                "Strength/weakness identification",
                "Recommendation insights",
                "Trend analysis"
            ]
        }
    ];

    const metrics = [
        { label: 'Interview Completion Rate', value: '91%', trend: '+15%' },
        { label: 'Evaluator Consistency', value: '87%', trend: '+9%' },
        { label: 'Candidate Satisfaction', value: '4.6/5', trend: '+0.3' },
        { label: 'Time-to-Decision', value: '2.8 days', trend: '-42%' }
    ];

    const currentInterviewData = interviewTypes.find(type => type.id === activeTab);

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
                                <Video className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Technical & HR Interview Management
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Structured interview management with comprehensive evaluation frameworks, automated scheduling, and detailed feedback collection systems
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8 border-b">
                    {interviewTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveTab(type.id)}
                            className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${activeTab === type.id
                                ? isDarkMode
                                    ? 'text-indigo-400 border-indigo-400'
                                    : 'text-indigo-600 border-indigo-600'
                                : isDarkMode
                                    ? 'text-gray-400 border-transparent hover:text-gray-300'
                                    : 'text-base-600 border-transparent hover:text-base-800'
                                }`}
                        >
                            {type.title}
                        </button>
                    ))}
                </div>

                {/* Content based on active tab */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                {currentInterviewData.title}
                            </h2>
                            <p className={`text-lg mb-8 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                {currentInterviewData.description}
                            </p>

                            <div className="space-y-6">
                                {currentInterviewData.approaches.map((approach, index) => (
                                    <div key={index} className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                                        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                            {approach.name}
                                        </h3>
                                        <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            {approach.description}
                                        </p>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {approach.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start space-x-2">
                                                    <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                                    <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Performance Metrics */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Performance Metrics
                            </h3>
                            <div className="space-y-3">
                                {metrics.map((metric, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            {metric.label}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-sm font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                {metric.value}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.trend.startsWith('+')
                                                ? 'bg-green-100 text-green-700'
                                                : metric.trend.startsWith('-')
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {metric.trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Key Features
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Automated scheduling system',
                                    'Real-time collaboration tools',
                                    'Structured evaluation frameworks',
                                    'Bias detection mechanisms',
                                    'Comprehensive reporting',
                                    'Multi-interviewer coordination'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <Star className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Workflow Steps */}
                <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                    <h2 className={`text-2xl font-bold mb-8 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Interview Management Workflow
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {workflowSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.id} className="text-center">
                                    <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
