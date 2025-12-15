import React, { useState } from 'react';
import { ArrowLeft, Brain, ClipboardCheck, Video, Users, Award, FileText, BarChart3, Plus, Share2, List, Star, ChevronRight, CheckCircle, Clock, Target } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function LearnMore({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [expandedPhase, setExpandedPhase] = useState(null);

    const phases = [
        {
            id: 'job-requisition',
            icon: Plus,
            title: 'Job Requisition',
            description: 'Capture detailed requirements and specifications for open positions',
            color: 'from-blue-500 to-cyan-500',
            details: {
                overview: 'Define comprehensive job requirements including technical skills, experience levels, and team dynamics.',
                options: [
                    'Position details (title, level, department)',
                    'Technical requirements and stack specifications',
                    'Experience requirements and qualifications',
                    'Team structure and reporting lines',
                    'Budget and compensation parameters'
                ],
                workflow: 'HR managers input detailed job specifications → System validates requirements → Creates structured job profile → Ready for posting phase'
            }
        },
        {
            id: 'job-post',
            icon: Share2,
            title: 'Job Post',
            description: 'Multi-platform job posting with centralized management',
            color: 'from-green-500 to-emerald-500',
            details: {
                overview: 'Publish job openings across multiple platforms simultaneously with unified tracking and management.',
                options: [
                    'LinkedIn, Indeed, Glassdoor integration',
                    'Custom job description optimization',
                    'Platform-specific formatting',
                    'Application tracking setup',
                    'Posting schedule management'
                ],
                workflow: 'Select target platforms → Customize content per platform → Schedule postings → Monitor application inflow → Centralized response management'
            }
        },
        {
            id: 'semantic-analysis',
            icon: Brain,
            title: 'Semantic Analysis',
            description: 'Deep AI-powered resume analysis beyond keyword matching',
            color: 'from-purple-500 to-pink-500',
            details: {
                overview: 'Advanced contextual understanding of candidate profiles using deep semantic analysis, evaluating skills, experience patterns, and potential fit.',
                options: [
                    'Contextual skill assessment',
                    'Experience depth analysis',
                    'Career trajectory evaluation',
                    'Cultural fit indicators',
                    'Potential growth prediction'
                ],
                workflow: 'Resume ingestion → Deep semantic processing → Multi-dimensional scoring → Ranking generation → Detailed analysis reports'
            }
        },
        {
            id: 'technical-assessment',
            icon: ClipboardCheck,
            title: 'Technical Assessment',
            description: 'Comprehensive skill evaluation with automated testing',
            color: 'from-orange-500 to-red-500',
            details: {
                overview: 'Automated technical skill evaluation platform with customizable assessments and detailed performance analytics.',
                options: [
                    'Custom test creation',
                    'Automated scoring system',
                    'Performance analytics',
                    'Time-based assessments',
                    'Skill gap analysis'
                ],
                workflow: 'Design assessment parameters → Generate test questions → Deploy to candidates → Auto-score responses → Generate performance reports'
            }
        },
        {
            id: 'technical-interview',
            icon: Video,
            title: 'Technical Interview',
            description: 'Structured technical interviews with 3 evaluation approaches',
            color: 'from-indigo-500 to-blue-500',
            details: {
                overview: 'Comprehensive technical interview management with multiple evaluation formats and structured feedback collection.',
                options: [
                    'Live coding interviews',
                    'System design discussions',
                    'Problem-solving sessions',
                    'Technical portfolio review',
                    'Peer evaluation panels'
                ],
                workflow: 'Schedule interview format → Prepare evaluation criteria → Conduct interview session → Collect structured feedback → Generate interview scores'
            }
        },
        {
            id: 'hr-interview',
            icon: Users,
            title: 'HR Interview',
            description: 'Cultural fit and soft skills evaluation',
            color: 'from-teal-500 to-cyan-500',
            details: {
                overview: 'Structured HR interviews focusing on cultural alignment, communication skills, and organizational fit.',
                options: [
                    'Behavioral interviews',
                    'Cultural fit assessment',
                    'Communication evaluation',
                    'Team dynamics analysis',
                    'Career aspiration review'
                ],
                workflow: 'Define interview framework → Schedule HR sessions → Conduct structured interviews → Evaluate soft skills → Generate fit analysis'
            }
        },
        {
            id: 'final-ranking',
            icon: Award,
            title: 'Final Ranking',
            description: 'AI-driven candidate ranking and final evaluation',
            color: 'from-yellow-500 to-orange-500',
            details: {
                overview: 'Comprehensive candidate ranking combining all phase data into unified scoring and recommendation system.',
                options: [
                    'Multi-factor scoring algorithm',
                    'Comparative analysis',
                    'Risk assessment',
                    'Recommendation engine',
                    'Final report generation'
                ],
                workflow: 'Aggregate all phase data → Apply ranking algorithm → Generate comparative scores → Create final recommendations → Produce comprehensive reports'
            }
        },
        {
            id: 'shortlist',
            icon: Star,
            title: 'Shortlist',
            description: 'Dynamic candidate shortlisting and management',
            color: 'from-pink-500 to-rose-500',
            details: {
                overview: 'Intelligent shortlisting system with phase-specific candidate management and detailed performance tracking.',
                options: [
                    'Phase-specific shortlists',
                    'Performance tracking',
                    'Comparative analysis',
                    'Shortlist optimization',
                    'Export capabilities'
                ],
                workflow: 'Identify top candidates → Create phase-specific lists → Track performance metrics → Optimize selections → Generate shortlist reports'
            }
        },
        {
            id: 'applications',
            icon: List,
            title: 'Applications',
            description: 'Centralized application tracking and management',
            color: 'from-gray-500 to-slate-500',
            details: {
                overview: 'Complete application lifecycle management with real-time tracking and comprehensive analytics.',
                options: [
                    'Application status tracking',
                    'Document management',
                    'Communication logs',
                    'Timeline visualization',
                    'Bulk processing tools'
                ],
                workflow: 'Receive applications → Categorize and tag → Track progression → Manage communications → Generate application reports'
            }
        },
        {
            id: 'analytics',
            icon: BarChart3,
            title: 'Analytics',
            description: 'Comprehensive recruitment analytics and insights',
            color: 'from-emerald-500 to-green-500',
            details: {
                overview: 'Advanced analytics platform providing deep insights into recruitment efficiency, candidate quality, and process optimization.',
                options: [
                    'Pipeline analytics',
                    'Time-to-hire metrics',
                    'Source effectiveness',
                    'Cost analysis',
                    'Predictive insights'
                ],
                workflow: 'Collect process data → Generate analytics → Identify trends → Create insights → Recommend optimizations'
            }
        }
    ];

    const togglePhase = (phaseId) => {
        setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
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
                        <span>Back to Home</span>
                    </button>

                    <div className="text-center">
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            HireFlow AI Platform
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Complete recruitment automation with AI-powered insights and comprehensive phase-by-phase reporting
                        </p>
                    </div>
                </div>

                {/* Phases Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {phases.map((phase) => (
                        <PhaseDetailCard
                            key={phase.id}
                            phase={phase}
                            isExpanded={expandedPhase === phase.id}
                            onToggle={() => togglePhase(phase.id)}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PhaseDetailCard({ phase, isExpanded, onToggle, isDarkMode }) {
    const Icon = phase.icon;

    return (
        <div className={`border rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'} ${isExpanded ? 'shadow-xl' : 'shadow-sm hover:shadow-lg'}`}>
            {/* Phase Header */}
            <button
                onClick={onToggle}
                className={`w-full p-6 text-left transition-colors duration-300 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-base-50'} rounded-t-xl`}
            >
                <div className="flex items-start space-x-4">
                    <div className={`bg-gradient-to-r ${phase.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            {phase.title}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            {phase.description}
                        </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''} ${isDarkMode ? 'text-gray-400' : 'text-base-400'}`} />
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className={`p-6 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-700' : 'border-base-200'}`}>
                    <div className="space-y-6">
                        {/* Overview */}
                        <div>
                            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Overview
                            </h4>
                            <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                {phase.details.overview}
                            </p>
                        </div>

                        {/* Options */}
                        <div>
                            <h4 className={`font-semibold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Key Features & Options
                            </h4>
                            <ul className="space-y-2">
                                {phase.details.options.map((option, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`} />
                                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            {option}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Workflow */}
                        <div>
                            <h4 className={`font-semibold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Process Workflow
                            </h4>
                            <div className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                    {phase.details.workflow}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
