import React, { useState } from 'react';
import { ArrowLeft, Share2, Calendar, Clock, Shield, Zap, Target, CheckCircle, AlertCircle, Globe, FileText, Sparkles, Eye, Settings, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function SmartJobPostingDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();

    const overviewMetrics = [
        {
            title: 'Posts Created',
            value: '847',
            change: '+156',
            trend: 'up',
            icon: FileText,
            description: 'AI-generated job posts'
        },
        {
            title: 'Bias Issues Caught',
            value: '234',
            change: '+89',
            trend: 'up',
            icon: Shield,
            description: 'Potential biases detected and fixed'
        },
        {
            title: 'Platforms Connected',
            value: '12',
            change: '+3',
            trend: 'up',
            icon: Globe,
            description: 'Active job platforms'
        },
        {
            title: 'Scheduled Posts',
            value: '92%',
            change: '+15%',
            trend: 'up',
            icon: Calendar,
            description: 'Automated scheduling rate'
        }
    ];

    const aiCreationFeatures = [
        {
            title: 'Intelligent Content Generation',
            description: 'Our AI analyzes your job requirements and creates compelling, professional job descriptions that attract qualified candidates',
            icon: Sparkles,
            benefits: ['ATS-optimized formatting', 'Keyword optimization', 'Engaging language', 'Role-specific customization']
        },
        {
            title: 'Multi-Platform Adaptation',
            description: 'Automatically adapts content for different job platforms, ensuring optimal presentation on LinkedIn, Indeed, Glassdoor, and more',
            icon: Globe,
            benefits: ['Platform-specific formatting', 'Character limit optimization', 'Hashtag generation', 'Visual enhancement']
        },
        {
            title: 'Content Personalization',
            description: 'Tailors job posts to match your company culture, voice, and specific role requirements',
            icon: Users,
            benefits: ['Brand voice matching', 'Culture alignment', 'Role customization', 'Target audience focus']
        }
    ];

    const biasDetectionFeatures = [
        {
            type: 'gender',
            title: 'Gender Bias Detection',
            description: 'Identifies and suggests alternatives for gender-coded language that may discourage certain candidates',
            examples: ['Aggressive vs. collaborative language', 'Gender-coded adjectives', 'Pronoun usage', 'Role stereotypes'],
            severity: 'high'
        },
        {
            type: 'age',
            title: 'Age Discrimination',
            description: 'Detects language that may imply age preferences or discourage experienced professionals',
            examples: ['"Recent graduate" language', 'Age-related descriptors', 'Experience level assumptions', 'Technology bias'],
            severity: 'medium'
        },
        {
            type: 'cultural',
            title: 'Cultural Bias Analysis',
            description: 'Identifies culturally specific references or language that may exclude diverse candidates',
            examples: ['Cultural references', 'Language requirements', 'Educational bias', 'Geographic preferences'],
            severity: 'medium'
        },
        {
            type: 'accessibility',
            title: 'Accessibility Compliance',
            description: 'Ensures job posts meet accessibility standards and are inclusive to candidates with disabilities',
            examples: ['Inclusive language', 'Accessibility statements', 'Remote work options', 'Accommodation mentions'],
            severity: 'low'
        }
    ];

    const schedulingFeatures = [
        {
            title: 'Optimal Timing Analysis',
            description: 'AI analyzes platform engagement patterns to determine the best times to post for maximum visibility',
            icon: Clock,
            details: ['Peak engagement times', 'Platform-specific optimization', 'Time zone considerations', 'Industry-specific patterns']
        },
        {
            title: 'Multi-Platform Coordination',
            description: 'Coordinates posting across multiple platforms with staggered timing for continuous candidate flow',
            icon: Share2,
            details: ['Cross-platform scheduling', 'Staggered release', 'Content variation', 'Performance tracking']
        },
        {
            title: 'Automated Renewal',
            description: 'Automatically refreshes and reposts positions to maintain visibility without manual intervention',
            icon: TrendingUp,
            details: ['Automatic reposting', 'Content variation', 'Performance-based renewal', 'Budget optimization']
        }
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return isDarkMode ? 'text-red-400' : 'text-red-600';
            case 'medium': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
            case 'low': return isDarkMode ? 'text-green-400' : 'text-green-600';
            default: return isDarkMode ? 'text-gray-400' : 'text-gray-600';
        }
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
                                <Share2 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Smart Job Posting
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            AI-powered job post creation with intelligent bias detection, automated scheduling, and multi-platform distribution for maximum reach and inclusivity
                        </p>
                    </div>
                </div>

                {/* How We Do This Section */}
                <div className={`mb-12 border rounded-2xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-base-200'}`}>
                    <div className="flex items-center mb-6">
                        <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-xl flex items-center justify-center mr-4`}>
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            How We Do This
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-6 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/50' : 'bg-base-50/50'}`}>
                            <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                AI Content Generation
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Advanced natural language processing creates compelling, professional job descriptions tailored to your specific requirements and company culture.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/50' : 'bg-base-50/50'}`}>
                            <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h3 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Bias Detection Engine
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Sophisticated algorithms analyze content for gender, age, cultural, and accessibility biases, providing real-time suggestions for more inclusive language.
                            </p>
                        </div>
                        <div className={`p-6 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/50' : 'bg-base-50/50'}`}>
                            <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Smart Scheduling
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Intelligent timing optimization ensures your job posts reach the right candidates at the right moments across all platforms for maximum visibility.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How We're Different Section */}
                <div className={`mb-12 border rounded-2xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-base-200'}`}>
                    <div className="flex items-center mb-6">
                        <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-xl flex items-center justify-center mr-4`}>
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            How We're Different From Others
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className={`p-6 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-base-50/30 border-base-200'}`}>
                            <div className="flex items-start space-x-4">
                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                                    <Target className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Proactive Bias Prevention
                                    </h3>
                                    <p className={`text-sm mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Unlike basic spell checkers, we actively identify and suggest alternatives for subtle biases that could discourage qualified candidates from applying.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`p-6 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-base-50/30 border-base-200'}`}>
                            <div className="flex items-start space-x-4">
                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                                    <BarChart3 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Data-Driven Timing
                                    </h3>
                                    <p className={`text-sm mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        We schedule the post for optimal timing to reach the right candidates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className={`p-6 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-base-50/30 border-base-200'}`}>
                            <div className="flex items-start space-x-4">
                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                                    <Globe className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Platform-Specific Adaptation
                                    </h3>
                                    <p className={`text-sm mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Standard posting tools use one-size-fits-all content. We automatically adapt formatting, length, and style for each platform's unique requirements and audience.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`p-6 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-base-50/30 border-base-200'}`}>
                            <div className="flex items-start space-x-4">
                                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                                    <Settings className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Automated Workflow
                                    </h3>
                                    <p className={`text-sm mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        We handle everything from creation to scheduling to renewal, to remove the load on you.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
