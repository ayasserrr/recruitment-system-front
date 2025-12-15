import React, { useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Users, Clock, Target, DollarSign, Filter, CheckCircle, AlertCircle, Calendar, Download, Eye, Zap } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function PipelineAnalyticsDetail({ onBack }) {
    const { isDarkMode } = useDarkMode();
    const [activeTab, setActiveTab] = useState('overview');

    const analyticsTabs = [
        { id: 'overview', title: 'Overview', icon: BarChart3 },
        { id: 'funnel', title: 'Pipeline Funnel', icon: Filter },
        { id: 'metrics', title: 'Key Metrics', icon: Target },
        { id: 'insights', title: 'Predictive Insights', icon: TrendingUp }
    ];

    const overviewMetrics = [
        {
            title: 'Total Applications',
            value: '1,247',
            change: '+23%',
            trend: 'up',
            icon: Users,
            description: 'Total candidates in pipeline'
        },
        {
            title: 'Conversion Rate',
            value: '11.5%',
            change: '+2.3%',
            trend: 'up',
            icon: Target,
            description: 'Application to hire ratio'
        },
        {
            title: 'Time-to-Hire',
            value: '24 days',
            change: '-8 days',
            trend: 'down',
            icon: Clock,
            description: 'Average hiring duration'
        },
        {
            title: 'Cost-per-Hire',
            value: '$3,200',
            change: '-$450',
            trend: 'down',
            icon: DollarSign,
            description: 'Average recruitment cost'
        }
    ];

    const funnelData = [
        {
            stage: 'Applications',
            count: 1247,
            percentage: 100,
            conversionRate: '100%',
            avgTime: '0 days',
            description: 'Initial candidate pool'
        },
        {
            stage: 'Screened',
            count: 892,
            percentage: 71.5,
            conversionRate: '71.5%',
            avgTime: '2 days',
            description: 'After initial screening'
        },
        {
            stage: 'Assessed',
            count: 456,
            percentage: 36.6,
            conversionRate: '51.1%',
            avgTime: '5 days',
            description: 'Completed technical assessments'
        },
        {
            stage: 'Interviewed',
            count: 234,
            percentage: 18.8,
            conversionRate: '51.3%',
            avgTime: '12 days',
            description: 'Completed interviews'
        },
        {
            stage: 'Finalists',
            count: 67,
            percentage: 5.4,
            conversionRate: '28.6%',
            avgTime: '18 days',
            description: 'Final round candidates'
        },
        {
            stage: 'Hired',
            count: 12,
            percentage: 1.0,
            conversionRate: '17.9%',
            avgTime: '24 days',
            description: 'Successful placements'
        }
    ];

    const detailedMetrics = [
        {
            category: 'Efficiency Metrics',
            metrics: [
                { name: 'Screening Efficiency', value: '94%', target: '90%', status: 'excellent' },
                { name: 'Interview Scheduling', value: '87%', target: '85%', status: 'good' },
                { name: 'Assessment Completion', value: '91%', target: '80%', status: 'excellent' },
                { name: 'Feedback Collection', value: '89%', target: '90%', status: 'good' }
            ]
        },
        {
            category: 'Quality Metrics',
            metrics: [
                { name: 'Hire Quality Score', value: '4.6/5', target: '4.0/5', status: 'excellent' },
                { name: 'Retention Rate (6mo)', value: '94%', target: '85%', status: 'excellent' },
                { name: 'Performance Rating', value: '4.3/5', target: '4.0/5', status: 'good' },
                { name: 'Manager Satisfaction', value: '88%', target: '80%', status: 'excellent' }
            ]
        },
        {
            category: 'Cost Metrics',
            metrics: [
                { name: 'Cost-per-Hire', value: '$3,200', target: '$3,500', status: 'excellent' },
                { name: 'Recruitment ROI', value: '3.4x', target: '3.0x', status: 'excellent' },
                { name: 'Time-to-Fill Cost', value: '$12,800', target: '$15,000', status: 'good' },
                { name: 'Source Efficiency', value: '78%', target: '70%', status: 'good' }
            ]
        }
    ];

    const predictiveInsights = [
        {
            type: 'opportunity',
            title: 'High-Potential Source Identified',
            description: 'GitHub sourcing shows 45% higher conversion rate compared to traditional job boards',
            impact: 'Potential 23% reduction in time-to-hire',
            confidence: '87%',
            action: 'Increase GitHub sourcing budget by 30%'
        },
        {
            type: 'warning',
            title: 'Seasonal Slowdown Detected',
            description: 'Historical data indicates 35% drop in qualified applications during Q4',
            impact: 'Potential 12-day increase in time-to-hire',
            confidence: '92%',
            action: 'Build candidate pipeline in Q3'
        },
        {
            type: 'trend',
            title: 'AI Assessment Adoption Rising',
            description: 'Candidates completing AI assessments show 28% higher interview success rates',
            impact: 'Improved overall hire quality',
            confidence: '78%',
            action: 'Expand AI assessment coverage to all roles'
        },
        {
            type: 'optimization',
            title: 'Interview Process Bottleneck',
            description: 'Technical interview scheduling shows 34-day average delay',
            impact: 'Current bottleneck affecting overall time-to-hire',
            confidence: '95%',
            action: 'Implement automated scheduling system'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent': return isDarkMode ? 'text-green-400' : 'text-green-600';
            case 'good': return isDarkMode ? 'text-blue-400' : 'text-blue-600';
            case 'warning': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
            default: return isDarkMode ? 'text-gray-400' : 'text-gray-600';
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'opportunity': return isDarkMode ? 'text-green-400' : 'text-green-600';
            case 'warning': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
            case 'trend': return isDarkMode ? 'text-blue-400' : 'text-blue-600';
            case 'optimization': return isDarkMode ? 'text-purple-400' : 'text-purple-600';
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
                                <BarChart3 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            End-to-End Pipeline Analytics
                        </h1>
                        <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                            Complete recruitment funnel visibility with conversion metrics, time-to-hire analysis, cost tracking, and predictive insights for optimization
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8 border-b">
                    {analyticsTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${activeTab === tab.id
                                    ? isDarkMode
                                        ? 'text-emerald-400 border-emerald-400'
                                        : 'text-emerald-600 border-emerald-600'
                                    : isDarkMode
                                        ? 'text-gray-400 border-transparent hover:text-gray-300'
                                        : 'text-base-600 border-transparent hover:text-base-800'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content based on active tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                        {overviewMetrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <div key={index} className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${metric.trend === 'up'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {metric.change}
                                        </span>
                                    </div>
                                    <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        {metric.value}
                                    </div>
                                    <div className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        {metric.title}
                                    </div>
                                    <div className={`text-xs mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        {metric.description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'funnel' && (
                    <div className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                        <h2 className={`text-2xl font-bold mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                            Recruitment Pipeline Funnel
                        </h2>

                        <div className="space-y-4">
                            {funnelData.map((stage, index) => (
                                <div key={index} className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}`}></div>
                                            <span className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                {stage.stage}
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                {stage.description}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                {stage.count} candidates
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                {stage.percentage}%
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                {stage.conversionRate}
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                {stage.avgTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-6">
                                        <div
                                            className="h-6 rounded-full transition-all duration-500 bg-gradient-to-r from-base-500 to-accent-500 flex items-center justify-center"
                                            style={{ width: `${stage.percentage}%` }}
                                        >
                                            <span className="text-xs text-white font-medium">
                                                {stage.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'metrics' && (
                    <div className="space-y-8">
                        {detailedMetrics.map((category, index) => (
                            <div key={index} className={`border rounded-xl p-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                    {category.category}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {category.metrics.map((metric, metricIndex) => (
                                        <div key={metricIndex} className="flex items-center justify-between p-4 rounded-lg transition-colors duration-300">
                                            <div>
                                                <div className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                    {metric.name}
                                                </div>
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>
                                                    Target: {metric.target}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                                                    {metric.value}
                                                </div>
                                                <div className={`text-xs ${getStatusColor(metric.status)}`}>
                                                    {metric.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'insights' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {predictiveInsights.map((insight, index) => (
                            <div key={index} className={`border rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
                                <div className="flex items-start space-x-3 mb-4">
                                    {insight.type === 'opportunity' && <Zap className={`w-5 h-5 mt-1 flex-shrink-0 ${getInsightColor(insight.type)}`} />}
                                    {insight.type === 'warning' && <AlertCircle className={`w-5 h-5 mt-1 flex-shrink-0 ${getInsightColor(insight.type)}`} />}
                                    {insight.type === 'trend' && <TrendingUp className={`w-5 h-5 mt-1 flex-shrink-0 ${getInsightColor(insight.type)}`} />}
                                    {insight.type === 'optimization' && <Target className={`w-5 h-5 mt-1 flex-shrink-0 ${getInsightColor(insight.type)}`} />}
                                    <div className="flex-1">
                                        <h3 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                            {insight.title}
                                        </h3>
                                        <p className={`text-sm mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            {insight.description}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>Impact:</span>
                                                <span className={`text-xs font-medium ${getInsightColor(insight.type)}`}>
                                                    {insight.impact}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>Confidence:</span>
                                                <span className={`text-xs font-medium ${getInsightColor(insight.type)}`}>
                                                    {insight.confidence}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                            <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                Recommended Action:
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                {insight.action}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Analytics Actions Sidebar */}
                <div className="fixed bottom-8 right-8 space-y-3">
                    <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg ${isDarkMode ? 'bg-accent-500 text-white hover:bg-accent-600' : 'bg-accent-600 text-white hover:bg-accent-700'}`}>
                        <Download className="w-4 h-4 inline mr-2" />
                        Export Report
                    </button>
                    <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg border ${isDarkMode ? 'border-slate-600 text-gray-300 bg-slate-800 hover:bg-slate-700' : 'border-base-300 text-base-700 bg-white hover:bg-base-100'}`}>
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Schedule Report
                    </button>
                </div>
            </div>
        </div>
    );
}
