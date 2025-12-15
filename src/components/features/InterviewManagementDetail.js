import React, { useState } from 'react';
import { ArrowLeft, Video, Users, Calendar, Clock, CheckCircle, Star, MessageSquare, FileText, Settings, BarChart3, Award, Target, Brain, UserCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function InterviewManagementDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('technical-phase');

    const interviewPhases = [
        {
            id: 'technical-phase',
            title: 'Technical Interview Phase',
            icon: Target,
            description: 'First phase: Evaluate technical skills with AI-enhanced assessment',
            subtitle: 'Candidates are ranked based on correctness + answer optimization',
            modes: [
                {
                    name: 'AI Fully Conducted',
                    description: 'Complete AI-driven technical interview with adaptive questioning',
                    features: [
                        'Adaptive technical questions based on candidate responses',
                        'Real-time code analysis and evaluation',
                        'Automated problem-solving assessment',
                        'Instant technical feedback generation',
                        'Bias-free technical evaluation'
                    ],
                    benefits: [
                        'Consistent evaluation standards across all candidates',
                        'Objective scoring based purely on technical merit',
                        'Reduced interviewer bias in technical assessment',
                        'Scalable assessment for large candidate pools',
                        'Detailed technical insights and analytics'
                    ]
                },
                {
                    name: 'Technical Person with AI Feedback',
                    description: 'Human technical interviewer enhanced with AI-powered insights',
                    features: [
                        'Human-led technical discussion and problem-solving',
                        'AI-powered real-time feedback and suggestions',
                        'Technical skill validation and verification',
                        'Optimized answer recommendations',
                        'Comprehensive evaluation combining human + AI'
                    ],
                    benefits: [
                        'Human technical expertise + AI precision',
                        'Personalized interview experience',
                        'Deep technical assessment with contextual understanding',
                        'Real-time guidance for interviewers',
                        'Enhanced decision support with data insights'
                    ]
                }
            ]
        },
        {
            id: 'hr-phase',
            title: 'HR Interview Phase',
            icon: Users,
            description: 'Second phase: Top candidates from technical phase advance to HR assessment',
            subtitle: 'Only candidates with 80+ score (including optimization bonus) qualify',
            modes: [
                {
                    name: 'AI Fully Conducted',
                    description: 'Complete AI-driven HR interview with behavioral and cultural assessment',
                    features: [
                        'Behavioral question analysis and evaluation',
                        'Cultural fit assessment using AI algorithms',
                        'Communication skill evaluation',
                        'Personality trait and soft skills analysis',
                        'Automated recommendation generation'
                    ],
                    benefits: [
                        'Standardized HR evaluation for all candidates',
                        'Unbiased cultural and personality assessment',
                        'Consistent communication scoring',
                        'Objective behavioral analysis',
                        'Data-driven hiring recommendations'
                    ]
                },
                {
                    name: 'HR Person with AI Feedback',
                    description: 'Human HR interviewer supported by AI insights and behavioral analytics',
                    features: [
                        'Human-led HR discussion and cultural assessment',
                        'AI-powered behavioral analysis and insights',
                        'Cultural alignment evaluation and recommendations',
                        'Communication enhancement suggestions',
                        'Comprehensive soft skills evaluation'
                    ],
                    benefits: [
                        'Human empathy and understanding + AI analytics',
                        'Personalized HR interview experience',
                        'Deep cultural assessment with human intuition',
                        'Enhanced communication insights',
                        'Balanced evaluation approach'
                    ]
                }
            ]
        }
    ];

    const workflowSteps = [
        {
            id: 1,
            title: "Technical Interview Phase",
            description: "First phase with AI-enhanced technical evaluation",
            icon: Target,
            details: [
                "Select interview mode (AI or AI+Technical)",
                "Schedule technical interviews",
                "Conduct technical assessments",
                "Score based on correctness + optimization",
                "Rank candidates by overall performance"
            ]
        },
        {
            id: 2,
            title: "Candidate Ranking",
            description: "Advanced ranking system with optimization bonus",
            icon: Award,
            details: [
                "Technical score calculation",
                "Answer optimization evaluation",
                "Overall score compilation",
                "Top performer identification",
                "HR phase qualification (80+ score)"
            ]
        },
        {
            id: 3,
            title: "HR Interview Phase",
            description: "Second phase for top technical performers",
            icon: Users,
            details: [
                "Select HR interview mode (AI or AI+HR)",
                "Schedule HR interviews",
                "Cultural fit assessment",
                "Communication evaluation",
                "Soft skills analysis"
            ]
        },
        {
            id: 4,
            title: "Final Evaluation",
            description: "Comprehensive candidate assessment and selection",
            icon: TrendingUp,
            details: [
                "Combined technical + HR scoring",
                "Final candidate ranking",
                "Hiring recommendation generation",
                "Detailed interview reports",
                "Decision support analytics"
            ]
        }
    ];

    const currentPhaseData = interviewPhases.find(phase => phase.id === activeTab);

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
                    {interviewPhases.map((phase) => (
                        <button
                            key={phase.id}
                            onClick={() => setActiveTab(phase.id)}
                            className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${activeTab === phase.id
                                ? isDarkMode
                                    ? 'text-indigo-400 border-indigo-400'
                                    : 'text-indigo-600 border-indigo-600'
                                : isDarkMode
                                    ? 'text-gray-400 border-transparent hover:text-gray-300'
                                    : 'text-base-600 border-transparent hover:text-base-800'
                                }`}
                        >
                            {phase.title}
                        </button>
                    ))}
                </div>

                {/* Content based on active tab */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                {currentPhaseData.title}
                            </h2>
                            <p className={`text-lg mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                {currentPhaseData.description}
                            </p>
                            <p className={`text-sm mb-8 font-semibold transition-colors duration-300 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {currentPhaseData.subtitle}
                            </p>

                            <div className="space-y-6">
                                {currentPhaseData.modes.map((mode, index) => (
                                    <div key={index} className={`border rounded-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                                        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                            {mode.name}
                                        </h3>
                                        <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            {mode.description}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className={`font-semibold mb-3 text-sm transition-colors duration-300 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                    Key Features
                                                </h4>
                                                <ul className="space-y-2">
                                                    {mode.features.map((feature, featureIndex) => (
                                                        <li key={featureIndex} className="flex items-start space-x-2">
                                                            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                                            <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className={`font-semibold mb-3 text-sm transition-colors duration-300 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                    Benefits
                                                </h4>
                                                <ul className="space-y-2">
                                                    {mode.benefits.map((benefit, benefitIndex) => (
                                                        <li key={benefitIndex} className="flex items-start space-x-2">
                                                            <Award className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                                                            <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Two-Phase Process Overview */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Two-Phase Process
                            </h3>
                            <div className="space-y-4">
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h4 className={`font-semibold text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                        Phase 1: Technical
                                    </h4>
                                    <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        Evaluate technical skills with AI-enhanced assessment
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h4 className={`font-semibold text-sm mb-2 transition-colors duration-300 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        Phase 2: HR
                                    </h4>
                                    <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        Top performers advance to cultural fit assessment
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ranking System */}
                        <div className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Advanced Ranking
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Technical correctness scoring',
                                    'Answer optimization bonus',
                                    'Performance-based ranking',
                                    '80+ score for HR qualification',
                                    'Data-driven selection'
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
                        Two-Phase Interview Workflow
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
