import React from 'react';
import { Zap, Brain, Target, BarChart3, Video, FileText } from 'lucide-react';

export default function Home({ onLoginClick, onGetStartedClick, onLearnMoreClick }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Navigation */}
            <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <Zap className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-800">HireFlowAI</span>
                </div>
                <button
                    onClick={onLoginClick}
                    className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                    Login
                </button>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-6">
                        <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Intelligent Recruitment Made Simple
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Streamline your hiring process with AI-powered candidate screening, smart ranking, and automated interviews
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onGetStartedClick}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={onLearnMoreClick}
                            className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Choose HireFlow AI?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Screening</h3>
                            <p className="text-gray-600">Advanced algorithms analyze resumes and match candidates to job requirements automatically</p>
                        </div>

                        <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                            <p className="text-gray-600">Process hundreds of applications in minutes instead of days with our optimized workflow</p>
                        </div>

                        <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bias-Free Hiring</h3>
                            <p className="text-gray-600">Eliminate unconscious bias with standardized evaluation criteria and AI assistance</p>
                        </div>

                        <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Analytics</h3>
                            <p className="text-gray-600">Get detailed insights into your recruitment process with comprehensive analytics dashboards</p>
                        </div>

                        <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <Video className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrated Interviews</h3>
                            <p className="text-gray-600">Schedule and conduct video interviews seamlessly within the platform</p>
                        </div>

                        <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-cyan-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Reports</h3>
                            <p className="text-gray-600">Generate detailed reports on candidate performance and recruitment metrics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
