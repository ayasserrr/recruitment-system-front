import React, { useState } from 'react';
import { ArrowLeft, Brain, FileText, Search, TrendingUp, Users, CheckCircle, Clock, Target, Zap, BarChart3, Eye, Award } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function SemanticAnalysisDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activeStep, setActiveStep] = useState(0);

    const workflowSteps = [
        {
            id: 1,
            title: "Resume Ingestion",
            description: "AI-powered document parsing and data extraction",
            icon: FileText,
            details: [
                "Multi-format support (PDF, DOC, DOCX)",
                "Automatic text extraction and cleaning",
                "Structured data identification",
                "Metadata extraction and categorization"
            ]
        },
        {
            id: 2,
            title: "Deep Context Analysis",
            description: "Beyond keyword matching - true semantic understanding",
            icon: Brain,
            details: [
                "Contextual skill assessment",
                "Experience depth evaluation",
                "Career trajectory analysis",
                "Industry-specific terminology recognition"
            ]
        },
        {
            id: 3,
            title: "Multi-Dimensional Scoring",
            description: "Comprehensive candidate evaluation across multiple factors",
            icon: BarChart3,
            details: [
                "Technical proficiency scoring",
                "Experience relevance weighting",
                "Growth potential assessment",
                "Cultural fit indicators"
            ]
        },
        {
            id: 4,
            title: "Intelligent Ranking",
            description: "AI-driven candidate prioritization and matching",
            icon: Award,
            details: [
                "Job requirement correlation",
                "Candidate comparison analysis",
                "Fit percentage calculation",
                "Recommendation generation"
            ]
        }
    ];

    const capabilities = [
        {
            icon: Search,
            title: "Contextual Understanding",
            description: "AI comprehends the meaning behind skills and experience, not just keywords"
        },
        {
            icon: Target,
            title: "Precision Matching",
            description: "Advanced algorithms match candidates to specific job requirements with high accuracy"
        },
        {
            icon: TrendingUp,
            title: "Career Trajectory Analysis",
            description: "Evaluates career progression and growth potential beyond current skills"
        },
        {
            icon: Users,
            title: "Cultural Fit Assessment",
            description: "Analyzes background and experience patterns for organizational alignment"
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
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Deep Semantic Analysis
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Advanced AI-powered candidate evaluation that goes beyond surface-level matching to truly understand candidate potential and fit
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Workflow Steps */}
                    <div className="lg:col-span-2">
                        <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            How It Works
                        </h2>

                        <div className="space-y-6">
                            {workflowSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.id}
                                        className={`border rounded-xl p-6 transition-all duration-300 cursor-pointer ${activeStep === index
                                            ? isDarkMode ? 'bg-slate-700 border-purple-500' : 'bg-white border-purple-300 shadow-lg'
                                            : isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-base-200 hover:border-base-300'
                                            }`}
                                        onClick={() => setActiveStep(index)}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
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
                                                {activeStep === index && (
                                                    <ul className="space-y-2 mt-4">
                                                        {step.details.map((detail, detailIndex) => (
                                                            <li key={detailIndex} className="flex items-start space-x-2">
                                                                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                                                <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                                    {detail}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Capabilities Sidebar */}
                    <div>
                        <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Key Capabilities
                        </h2>

                        <div className="space-y-4">
                            {capabilities.map((capability, index) => {
                                const Icon = capability.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`border rounded-xl p-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className={`font-bold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                    {capability.title}
                                                </h3>
                                                <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                    {capability.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Performance Metrics */}
                        <div className={`mt-8 border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                            <h3 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Performance Metrics
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Accuracy Rate</span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>94%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Processing Speed</span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>2.3s/resume</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Match Improvement</span>
                                    <span className={`text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>+67%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Workflow Diagram */}
                <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                    <h2 className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Semantic Analysis Pipeline
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        {workflowSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center">
                                        <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-16 h-16 rounded-xl flex items-center justify-center mb-3`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <span className={`text-sm font-medium text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < workflowSteps.length - 1 && (
                                        <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-base-500 to-accent-500 mx-4"></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
