import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function PipelineAnalyticsDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();

    const metrics = [
        {
            title: 'Total Applications',
            value: '1,247',
            subtitle: 'Total candidates in pipeline',
            change: '+23%',
            isPositive: true,
            icon: BarChart3
        },
        {
            title: 'Conversion Rate',
            value: '11.5%',
            subtitle: 'Application to hire ratio',
            change: '+2.3%',
            isPositive: true,
            icon: TrendingUp
        },
        {
            title: 'Time-to-Hire',
            value: '16 days',
            subtitle: 'Average hiring duration',
            change: '-8 days',
            isPositive: true,
            icon: TrendingDown
        },
        {
            title: 'Cost-per-Hire',
            value: '$2,750',
            subtitle: 'Average recruitment cost',
            change: '-$450',
            isPositive: true,
            icon: TrendingDown
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
                                <BarChart3 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            End-to-End Pipeline Analytics
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Complete recruitment funnel visibility with key metrics and performance indicators
                        </p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <div key={index} className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-semibold ${metric.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {metric.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        <span>{metric.change}</span>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        {metric.value}
                                    </div>
                                    <div className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        {metric.title}
                                    </div>
                                </div>
                                <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
                                    {metric.subtitle}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* How We Help You Section */}
                <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'} mb-8`}>
                    <h2 className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        How Our Analysis Helps You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-6 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                            <div className={`bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Performance Optimization
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Identify bottlenecks and optimize your recruitment process with data-driven insights that reduce time-to-hire and improve conversion rates.
                            </p>
                        </div>
                        <div className={`p-6 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                            <div className={`bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Cost Reduction
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Analyze spending patterns and source effectiveness to reduce cost-per-hire while maintaining quality standards and improving ROI.
                            </p>
                        </div>
                        <div className={`p-6 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                            <div className={`bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                <TrendingDown className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Predictive Insights
                            </h3>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Forecast hiring needs and identify potential issues before they impact your pipeline with AI-powered predictive analytics.
                            </p>
                        </div>
                    </div>
                </div>

                {/* What We Analyze Section */}
                <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                    <h2 className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        What We Analyze For You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                            <h3 className={`font-bold mb-4 text-lg transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Recruitment Funnel Analysis
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Application volume and source effectiveness',
                                    'Screening conversion rates',
                                    'Interview performance metrics',
                                    'Offer acceptance and hiring rates'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isDarkMode ? 'bg-accent-400' : 'bg-accent-600'}`}></div>
                                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={`p-6 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-base-50 border-base-200'}`}>
                            <h3 className={`font-bold mb-4 text-lg transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                Process Efficiency Metrics
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Time-to-fill for different roles',
                                    'Source quality and ROI analysis',
                                    'Interviewer performance tracking',
                                    'Candidate experience feedback'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isDarkMode ? 'bg-accent-400' : 'bg-accent-600'}`}></div>
                                        <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
