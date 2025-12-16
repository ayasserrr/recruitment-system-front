import React, { useEffect, useRef } from 'react';
import { X, Clock, Users, Target, Brain, FileText, Award, BarChart3, Video, List, Star, Share2, ClipboardCheck, Plus } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const phaseDetails = {
    'job-requisition': {
        title: 'Create Job Requisition',
        icon: Plus,
        description: 'Define your hiring needs and requirements',
        whatItDoes: [
            'Capture detailed job requirements and qualifications',
            'Define salary range and benefits package',
            'Set team structure and reporting relationships',
            'Specify required experience and skill levels',
            'Create approval workflow for requisition validation'
        ],
        benefits: [
            'Clear requirements definition reduces miscommunication',
            'Standardized process ensures consistency',
            'Approval workflow maintains compliance',
            'Data-driven salary recommendations'
        ],
        avgTime: '15-30 minutes',
        keyFeatures: ['Template library', 'Approval workflows', 'Salary insights', 'Requirements capture']
    },
    'job-post': {
        title: 'Job Post',
        icon: Share2,
        description: 'Create and distribute compelling job postings',
        whatItDoes: [
            'Generate optimized job descriptions using AI',
            'Post to multiple job boards simultaneously',
            'Schedule posting for optimal timing',
            'Track posting performance and engagement',
            'Manage employer branding content'
        ],
        benefits: [
            'Wider reach across multiple platforms',
            'AI-optimized content for better visibility',
            'Consistent employer brand messaging',
            'Performance analytics for optimization'
        ],
        avgTime: '10-20 minutes',
        keyFeatures: ['Multi-platform posting', 'AI content optimization', 'Scheduling', 'Performance tracking']
    },
    'semantic-analysis': {
        title: 'Semantic Analysis',
        icon: Brain,
        description: 'AI-powered candidate matching and evaluation',
        whatItDoes: [
            'Analyze resumes using natural language processing',
            'Match candidates beyond keyword matching',
            'Score candidates based on contextual understanding',
            'Identify transferable skills and potential',
            'Generate detailed compatibility reports'
        ],
        benefits: [
            'More accurate candidate matching',
            'Reduces unconscious bias in screening',
            'Saves hours of manual resume review',
            'Identifies hidden talent and potential'
        ],
        avgTime: '2-5 minutes per batch',
        keyFeatures: ['Contextual analysis', 'Bias detection', 'Skill mapping', 'Compatibility scoring']
    },
    'technical-assessment': {
        title: 'Technical Assessment',
        icon: ClipboardCheck,
        description: 'Evaluate candidates technical capabilities',
        whatItDoes: [
            'Create customized technical tests and challenges',
            'Automated code evaluation and scoring',
            'Time-bound assessment sessions',
            'Plagiarism detection and integrity checks',
            'Detailed performance analytics'
        ],
        benefits: [
            'Objective evaluation of technical skills',
            'Standardized assessment for all candidates',
            'Reduces interviewer time commitment',
            'Identifies genuine skill levels'
        ],
        avgTime: '45-90 minutes per candidate',
        keyFeatures: ['Custom tests', 'Auto-evaluation', 'Code analysis', 'Time tracking']
    },
    'technical-interview': {
        title: 'Technical Interview',
        icon: Video,
        description: 'Conduct comprehensive technical interviews',
        whatItDoes: [
            'Schedule and coordinate interview sessions',
            'Provide interview questions and guidelines',
            'Record and transcribe interview sessions',
            'AI-assisted evaluation of responses',
            'Generate interview feedback reports'
        ],
        benefits: [
            'Structured interview process',
            'Consistent evaluation criteria',
            'Detailed documentation for review',
            'Collaborative evaluation capabilities'
        ],
        avgTime: '45-60 minutes per interview',
        keyFeatures: ['Scheduling', 'Question bank', 'Recording', 'AI evaluation']
    },
    'hr-interview': {
        title: 'HR Interview',
        icon: Users,
        description: 'Assess cultural fit and soft skills',
        whatItDoes: [
            'Evaluate cultural alignment with company values',
            'Assess communication and interpersonal skills',
            'Review career goals and expectations',
            'Discuss compensation and benefits',
            'Gather behavioral examples'
        ],
        benefits: [
            'Ensures cultural fit assessment',
            'Standardized soft skills evaluation',
            'Better candidate experience',
            'Reduced turnover risk'
        ],
        avgTime: '30-45 minutes per interview',
        keyFeatures: ['Cultural fit scoring', 'Behavioral questions', 'Salary negotiation', 'Experience review']
    },
    'final-ranking': {
        title: 'Final Ranking',
        icon: Award,
        description: 'Comprehensive candidate evaluation and ranking',
        whatItDoes: [
            'Aggregate scores from all assessment phases',
            'Weight different criteria based on role requirements',
            'Generate ranked candidate lists',
            'Provide detailed comparison reports',
            'Facilitate final decision making'
        ],
        benefits: [
            'Data-driven final decisions',
            'Transparent ranking methodology',
            'Comprehensive candidate profiles',
            'Reduced decision bias'
        ],
        avgTime: '15-30 minutes',
        keyFeatures: ['Score aggregation', 'Custom weighting', 'Comparison tools', 'Decision support']
    },
    'shortlist': {
        title: 'Shortlist',
        icon: Star,
        description: 'Manage and organize qualified candidates',
        whatItDoes: [
            'Create and manage multiple shortlists',
            'Tag candidates with custom labels',
            'Collaborative shortlist management',
            'Bulk communication with shortlisted candidates',
            'Track shortlist status changes'
        ],
        benefits: [
            'Organized candidate management',
            'Team collaboration on selections',
            'Efficient communication workflows',
            'Clear pipeline visibility'
        ],
        avgTime: '5-10 minutes per update',
        keyFeatures: ['Multiple lists', 'Custom tags', 'Team sharing', 'Bulk actions']
    },
    'applications': {
        title: 'Applications',
        icon: List,
        description: 'Track and manage all candidate applications',
        whatItDoes: [
            'Centralized application tracking',
            'Automated status updates and notifications',
            'Application progress monitoring',
            'Document management and storage',
            'Communication history tracking'
        ],
        benefits: [
            'Single source of truth for applications',
            'Automated workflow management',
            'Improved candidate experience',
            'Compliance and audit trail'
        ],
        avgTime: 'Real-time updates',
        keyFeatures: ['Status tracking', 'Automated notifications', 'Document storage', 'Communication log']
    },
    'analytics': {
        title: 'Analytics',
        icon: BarChart3,
        description: 'Comprehensive recruitment insights and metrics',
        whatItDoes: [
            'Track recruitment funnel performance',
            'Measure time-to-hire metrics',
            'Analyze source effectiveness',
            'Monitor diversity and inclusion metrics',
            'Generate custom reports and dashboards'
        ],
        benefits: [
            'Data-driven recruitment strategy',
            'Identify bottlenecks and optimization opportunities',
            'Demonstrate ROI on recruitment efforts',
            'Continuous process improvement'
        ],
        avgTime: 'Real-time insights',
        keyFeatures: ['Funnel analytics', 'Performance metrics', 'Custom reports', 'Trend analysis']
    }
};

export default function PhaseExplanationModal({ phase, isOpen, onClose, onNavigateToPhase }) {
    const { isDarkMode } = useDarkMode();
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !phase) return null;

    const phaseInfo = phaseDetails[phase];
    if (!phaseInfo) return null;

    const IconComponent = phaseInfo.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div ref={modalRef} className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'} border`}>
                {/* Header */}
                <div className={`sticky top-0 z-10 p-6 border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-base-200'}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                                <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    {phaseInfo.title}
                                </h2>
                                <p className={`text-lg mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                    {phaseInfo.description}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-500 hover:text-base-900 hover:bg-base-100'}`}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* What It Does */}
                    <section>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            <Target className="w-5 h-5 mr-2 text-accent-500" />
                            What This Phase Does
                        </h3>
                        <ul className="space-y-3">
                            {phaseInfo.whatItDoes.map((item, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className={`w-2 h-2 rounded-full bg-accent-500 mt-2 flex-shrink-0`}></div>
                                    <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Benefits */}
                    <section>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            <Award className="w-5 h-5 mr-2 text-accent-500" />
                            Key Benefits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {phaseInfo.benefits.map((benefit, index) => (
                                <div key={index} className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                                    <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        {benefit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Key Features */}
                    <section>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            <Star className="w-5 h-5 mr-2 text-accent-500" />
                            Key Features
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {phaseInfo.keyFeatures.map((feature, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' : 'bg-accent-100 text-accent-700 border border-accent-200'}`}
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Average Time - Only show for job-requisition */}
                    {phase === 'job-requisition' && (
                        <section>
                            <h3 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                <Clock className="w-5 h-5 mr-2 text-accent-500" />
                                Average Time Required
                            </h3>
                            <div className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                                <p className={`text-lg font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    {phaseInfo.avgTime}
                                </p>
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer */}
                <div className={`sticky bottom-0 p-6 border-t transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-base-200'}`}>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                if (onNavigateToPhase) {
                                    onNavigateToPhase(phase);
                                }
                            }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-base-600 to-accent-600 text-white rounded-lg hover:from-base-700 hover:to-accent-700 transition-colors font-medium"
                        >
                            Open Phase
                        </button>
                        <button
                            onClick={onClose}
                            className={`px-6 py-3 rounded-lg transition-colors font-medium ${isDarkMode ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-base-100 text-base-700 hover:bg-base-200'}`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
