import React from 'react';
import { Zap, Brain, Target, BarChart3, Video, FileText } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Home({ onLoginClick, onGetStartedClick, onLearnMoreClick }) {
    const { isDarkMode } = useDarkMode();
    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            {/* Navigation */}
            <nav className={`flex items-center justify-between p-6 max-w-7xl mx-auto transition-colors duration-300`}>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-8 h-8 rounded-lg">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>HireFlowAI</span>
                </div>
                <button
                    onClick={onLoginClick}
                    className={`px-6 py-2 border rounded-lg transition-colors font-medium ${isDarkMode ? 'text-accent-400 border-accent-400 hover:bg-accent-400/10' : 'text-accent-600 border-accent-600 hover:bg-accent-50'}`}
                >
                    Login
                </button>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-base-500 to-accent-500 rounded-2xl mx-auto mb-6">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Intelligent Recruitment Made Simple
                    </h1>
                    <p className={`text-xl max-w-3xl mx-auto mb-10 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                        Streamline your hiring process with AI-powered candidate screening, smart ranking, and automated interviews
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onGetStartedClick}
                            className="px-8 py-3 bg-gradient-to-r from-base-600 to-accent-600 text-white rounded-lg hover:from-base-700 hover:to-accent-700 transition-colors font-medium"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={onLearnMoreClick}
                            className={`px-8 py-3 border rounded-lg transition-colors font-medium ${isDarkMode ? 'bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600' : 'bg-white text-base-700 border-base-300 hover:bg-base-50'}`}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className={`py-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto">
                    <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Why Choose HireFlow AI?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className={`p-6 border rounded-xl hover:shadow-lg transition-shadow ${isDarkMode ? 'border-slate-700 bg-slate-700 hover:shadow-slate-900' : 'border-base-200 hover:shadow-base-200'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>AI-Powered Screening</h3>
                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Advanced algorithms analyze resumes and match candidates to job requirements automatically</p>
                        </div>

                        <div className={`p-6 border rounded-xl hover:shadow-lg transition-shadow ${isDarkMode ? 'border-slate-700 bg-slate-700 hover:shadow-slate-900' : 'border-base-200 hover:shadow-base-200'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Lightning Fast</h3>
                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Process hundreds of applications in minutes instead of days with our optimized workflow</p>
                        </div>

                        <div className={`p-6 border rounded-xl hover:shadow-lg transition-shadow ${isDarkMode ? 'border-slate-700 bg-slate-700 hover:shadow-slate-900' : 'border-base-200 hover:shadow-base-200'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Bias-Free Hiring</h3>
                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Eliminate unconscious bias with standardized evaluation criteria and AI assistance</p>
                        </div>

                        <div className={`p-6 border rounded-xl hover:shadow-lg transition-shadow ${isDarkMode ? 'border-slate-700 bg-slate-700 hover:shadow-slate-900' : 'border-base-200 hover:shadow-base-200'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Smart Analytics</h3>
                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Get detailed insights into your recruitment process with comprehensive analytics dashboards</p>
                        </div>

                        <div className={`p-6 border rounded-xl hover:shadow-lg transition-shadow ${isDarkMode ? 'border-slate-700 bg-slate-700 hover:shadow-slate-900' : 'border-base-200 hover:shadow-base-200'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Video className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Integrated Interviews</h3>
                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Schedule and conduct video interviews seamlessly within the platform</p>
                        </div>

                        <div className={`p-6 border rounded-xl hover:shadow-lg transition-shadow ${isDarkMode ? 'border-slate-700 bg-slate-700 hover:shadow-slate-900' : 'border-base-200 hover:shadow-base-200'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Comprehensive Reports</h3>
                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Generate detailed reports on candidate performance and recruitment metrics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
