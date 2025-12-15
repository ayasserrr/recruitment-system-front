import React, { useState } from 'react';
import { ArrowLeft, ClipboardCheck, FileText, Code, Clock, Target, BarChart3, CheckCircle, Award, Users, Zap, TrendingUp, Settings } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function TechnicalAssessmentDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('assessment-options');

    const assessmentOptions = [
        {
            id: 'i-got-it',
            title: 'I Got It',
            icon: CheckCircle,
            description: 'Use existing pre-built assessments and templates ready for immediate deployment',
            features: [
                'Ready-to-use assessment library',
                'Industry-standard templates',
                'Instant deployment capability',
                'Proven question banks',
                'Immediate candidate testing'
            ],
            benefits: [
                'Zero setup time required',
                'Tested and validated questions',
                'Consistent evaluation standards',
                'Quick implementation',
                'Reliable results'
            ]
        },
        {
            id: 'give-me-template',
            title: 'Give Me Template',
            icon: FileText,
            description: 'Customizable assessment templates that can be tailored to your specific requirements',
            features: [
                'Modular template system',
                'Custom question insertion',
                'Adjustable difficulty levels',
                'Role-specific customization',
                'Flexible scoring criteria'
            ],
            benefits: [
                'Semi-customized assessments',
                'Faster than building from scratch',
                'Professional structure maintained',
                'Partial customization options',
                'Balanced effort and personalization'
            ]
        },
        {
            id: 'i-fully-create',
            title: 'I Fully Create',
            icon: Settings,
            description: 'Build completely custom assessments from scratch with full control over every aspect',
            features: [
                'From-ground-up creation',
                'Complete creative control',
                'Advanced question types',
                'Custom evaluation logic',
                'Personalized branding'
            ],
            benefits: [
                'Fully tailored experience',
                'Unique assessment design',
                'Complete brand alignment',
                'Specialized requirements',
                'Maximum flexibility'
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
                    {['assessment-options', 'overview', 'workflow'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${activeTab === tab
                                ? isDarkMode
                                    ? 'text-accent-400 border-accent-400'
                                    : 'text-accent-600 border-accent-600'
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
                {activeTab === 'assessment-options' && (
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Choose Your Assessment Approach
                            </h2>
                            <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Select the assessment creation method that best fits your timeline and customization needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {assessmentOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <div key={option.id} className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-accent-400' : 'bg-white border-base-200 hover:border-accent-300'}`}>
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                {option.title}
                                            </h3>
                                        </div>
                                        <p className={`text-sm mb-6 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            {option.description}
                                        </p>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className={`font-semibold mb-2 text-sm transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>
                                                    Key Features
                                                </h4>
                                                <ul className="space-y-1">
                                                    {option.features.map((feature, index) => (
                                                        <li key={index} className="flex items-start space-x-2">
                                                            <CheckCircle className={`w-3 h-3 mt-1 flex-shrink-0 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`} />
                                                            <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className={`font-semibold mb-2 text-sm transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>
                                                    Benefits
                                                </h4>
                                                <ul className="space-y-1">
                                                    {option.benefits.map((benefit, index) => (
                                                        <li key={index} className="flex items-start space-x-2">
                                                            <Award className={`w-3 h-3 mt-1 flex-shrink-0 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`} />
                                                            <span className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <button className={`w-full mt-6 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isDarkMode ? 'bg-accent-500/20 text-accent-400 hover:bg-accent-500/30' : 'bg-accent-100 text-accent-700 hover:bg-accent-200'}`}>
                                            Choose This Option
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
