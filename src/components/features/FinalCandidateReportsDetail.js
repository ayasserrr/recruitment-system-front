import React from 'react';
import { ArrowLeft, Award, FileText, CheckCircle, Target, Brain, BarChart3, Users, Video, ClipboardCheck } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function FinalCandidateReportsDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();

    // Documentation content explaining the feature
    const documentation = {
        howItWorks: {
            title: "How Final Candidate Reports Work",
            content: [
                "The Final Candidate Reports system aggregates data from all recruitment phases into comprehensive candidate profiles.",
                "Each report combines semantic analysis, technical assessments, interview feedback, and HR evaluations.",
                "AI-powered algorithms analyze patterns across multiple data points to generate actionable insights.",
                "Reports are automatically updated in real-time as new evaluation data becomes available.",
                "The system uses weighted scoring algorithms to balance different evaluation criteria."
            ]
        },
        dataAggregation: {
            title: "Data Aggregation Process",
            phases: [
                {
                    phase: "Semantic Analysis",
                    data: "Resume parsing, skill extraction, experience analysis, cultural fit indicators",
                    weight: "15%"
                },
                {
                    phase: "Technical Assessment",
                    data: "Coding challenges, problem-solving scores, technical knowledge evaluation",
                    weight: "30%"
                },
                {
                    phase: "Technical Interview",
                    data: "Live problem-solving, system design, communication skills, technical depth",
                    weight: "25%"
                },
                {
                    phase: "HR Interview",
                    data: "Cultural alignment, soft skills, career goals, team compatibility",
                    weight: "20%"
                },
                {
                    phase: "Final Evaluation",
                    data: "Holistic assessment, recommendation synthesis, growth potential analysis",
                    weight: "10%"
                }
            ]
        },
        customization: {
            title: "Customization and Modifications",
            options: [
                "Adjust phase weightings based on role requirements and company priorities",
                "Modify evaluation criteria and scoring rubrics for different positions",
                "Customize report templates and visualization formats",
                "Configure automated insights and recommendation thresholds",
                "Add company-specific evaluation dimensions and cultural metrics",
                "Integrate with existing HR systems and workflow processes"
            ]
        },
        technicalImplementation: {
            title: "Technical Implementation",
            architecture: [
                "React-based frontend with responsive design and dark mode support",
                "Component-based architecture for maintainability and scalability",
                "Context-based state management for theme and user preferences",
                "Modular data structures for easy extension and modification",
                "RESTful API integration for real-time data synchronization",
                "Component props and callbacks for parent-child communication"
            ]
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
                                <Award className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Final Candidate Reports
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Comprehensive evaluation summaries combining all phase data, assessments, and interviews into unified candidate profiles with actionable insights
                        </p>
                    </div>
                </div>

                {/* Documentation Section */}
                <div className="space-y-8">
                    {/* How It Works */}
                    <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                        <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            {documentation.howItWorks.title}
                        </h3>
                        <div className="space-y-4">
                            {documentation.howItWorks.content.map((point, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                                    <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        {point}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Aggregation Process */}
                    <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                        <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            {documentation.dataAggregation.title}
                        </h3>
                        <div className="space-y-4">
                            {documentation.dataAggregation.phases.map((phase, index) => {
                                const phaseIcons = {
                                    'Semantic Analysis': Brain,
                                    'Technical Assessment': ClipboardCheck,
                                    'Technical Interview': Video,
                                    'HR Interview': Users,
                                    'Final Evaluation': Award
                                };
                                const Icon = phaseIcons[phase.phase];
                                return (
                                    <div key={index} className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                        <div className="flex items-start space-x-4">
                                            <Icon className={`w-6 h-6 mt-1 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                        {phase.phase}
                                                    </h4>
                                                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-accent-500/20 text-accent-400' : 'bg-accent-100 text-accent-700'}`}>
                                                        {phase.weight}
                                                    </span>
                                                </div>
                                                <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                    {phase.data}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Customization Options */}
                    <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                        <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            {documentation.customization.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documentation.customization.options.map((option, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <Target className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        {option}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Implementation */}
                    <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                        <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            {documentation.technicalImplementation.title}
                        </h3>
                        <div className="space-y-3">
                            {documentation.technicalImplementation.architecture.map((item, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <BarChart3 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                    <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
