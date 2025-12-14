import React from 'react';
import { Zap, Brain, Target, BarChart3, Video, FileText } from 'lucide-react';

export default function Home({ onLoginClick, onGetStartedClick, onLearnMoreClick }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-50 via-base-100 to-accent-50">
            {/* Navigation */}
            <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-8 h-8 rounded-lg">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-base-900">HireFlowAI</span>
                </div>
                <button
                    onClick={onLoginClick}
                    className="px-6 py-2 text-accent-600 border border-accent-600 rounded-lg hover:bg-accent-50 transition-colors font-medium"
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
                    <h1 className="text-5xl md:text-6xl font-bold text-base-900 mb-6">
                        Intelligent Recruitment Made Simple
                    </h1>
                    <p className="text-xl text-base-600 max-w-3xl mx-auto mb-10">
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
                            className="px-8 py-3 bg-white text-base-700 border border-base-300 rounded-lg hover:bg-base-50 transition-colors font-medium"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-base-900 mb-12">
                        Why Choose HireFlow AI?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 border border-base-200 rounded-xl hover:shadow-lg hover:shadow-base-200 transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-900 mb-2">AI-Powered Screening</h3>
                            <p className="text-base-600">Advanced algorithms analyze resumes and match candidates to job requirements automatically</p>
                        </div>

                        <div className="p-6 border border-base-200 rounded-xl hover:shadow-lg hover:shadow-base-200 transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-900 mb-2">Lightning Fast</h3>
                            <p className="text-base-600">Process hundreds of applications in minutes instead of days with our optimized workflow</p>
                        </div>

                        <div className="p-6 border border-base-200 rounded-xl hover:shadow-lg hover:shadow-base-200 transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-900 mb-2">Bias-Free Hiring</h3>
                            <p className="text-base-600">Eliminate unconscious bias with standardized evaluation criteria and AI assistance</p>
                        </div>

                        <div className="p-6 border border-base-200 rounded-xl hover:shadow-lg hover:shadow-base-200 transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-900 mb-2">Smart Analytics</h3>
                            <p className="text-base-600">Get detailed insights into your recruitment process with comprehensive analytics dashboards</p>
                        </div>

                        <div className="p-6 border border-base-200 rounded-xl hover:shadow-lg hover:shadow-base-200 transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <Video className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-900 mb-2">Integrated Interviews</h3>
                            <p className="text-base-600">Schedule and conduct video interviews seamlessly within the platform</p>
                        </div>

                        <div className="p-6 border border-base-200 rounded-xl hover:shadow-lg hover:shadow-base-200 transition-shadow">
                            <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-base-900 mb-2">Comprehensive Reports</h3>
                            <p className="text-base-600">Generate detailed reports on candidate performance and recruitment metrics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
