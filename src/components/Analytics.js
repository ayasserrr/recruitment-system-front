import React, { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Users, Briefcase, Clock, Target, Award, FileText, Brain, Calendar, Download, Filter, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Analytics({ applications, onBack }) {
    const { isDarkMode } = useDarkMode();
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [selectedMetric, setSelectedMetric] = useState('overview');

    // Mock data for analytics - in real app this would come from API
    const analyticsData = useMemo(() => ({
        overview: {
            totalApplications: 156,
            activeApplications: 3,
            completedProcesses: 153,
            averageTimeToHire: 24, // days
            totalHires: 12,
            offerAcceptanceRate: 83,
            costPerHire: 3200,
            hrEfficiencyScore: 78
        },
        applications: {
            submitted: 156,
            underReview: 23,
            shortlisted: 18,
            rejected: 115,
            conversionRate: 11.5,
            averageScore: 68,
            topPerformingSource: 'LinkedIn',
            sourceBreakdown: {
                'LinkedIn': 58,
                'Company Website': 42,
                'Referrals': 31,
                'Job Boards': 18,
                'Other': 7
            }
        },
        assessments: {
            sent: 89,
            completed: 76,
            pending: 13,
            averageScore: 62,
            passRate: 58,
            averageCompletionTime: 38, // minutes
            technicalScore: 65,
            theoryScore: 59,
            topPerformingRole: 'Software Engineer'
        },
        interviews: {
            technical: 28,
            hr: 15,
            completed: 43,
            scheduled: 3,
            averageScore: 7.2, // out of 10
            averageDuration: 45, // minutes
            noShowRate: 12,
            satisfactionScore: 4.1 // out of 5
        },
        hiring: {
            totalHires: 12,
            timeToHire: 24,
            offerAcceptanceRate: 83,
            averageSalary: 72000,
            retentionRate: 89,
            diversityScore: 72,
            qualityOfHire: 76,
            departmentBreakdown: {
                'Engineering': 7,
                'Product': 2,
                'Design': 1,
                'Marketing': 1,
                'Sales': 1
            }
        },
        efficiency: {
            timeSaved: 45, // hours per month
            automationRate: 65,
            manualTasksReduced: 28,
            processImprovement: 18,
            hrProductivity: 78,
            candidateExperience: 4.1,
            complianceScore: 92
        },
        trends: {
            monthlyApplications: [8, 12, 9, 14, 15, 18, 16, 22, 19, 24, 26, 28],
            monthlyHires: [0, 1, 1, 0, 2, 2, 1, 2, 1, 3, 2, 3],
            satisfactionScores: [3.8, 3.9, 4.0, 4.1, 4.0, 4.2, 4.1, 4.3, 4.2, 4.4, 4.1, 4.1],
            efficiencyGains: [45, 48, 52, 55, 58, 62, 65, 68, 71, 75, 78, 78]
        }
    }), []);

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    };

    const getChangeIndicator = (current, previous) => {
        const change = ((current - previous) / previous) * 100;
        const isPositive = change >= 0;
        return {
            value: Math.abs(change).toFixed(1),
            isPositive,
            icon: isPositive ? TrendingUp : ChevronRight
        };
    };

    const exportAnalytics = () => {
        const exportData = {
            reportType: 'Analytics Dashboard',
            period: selectedPeriod,
            generatedDate: new Date().toISOString(),
            metrics: analyticsData
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `analytics-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const renderOverviewCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-6 border-2 border-accent-200">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-accent-600 mb-2">{formatNumber(analyticsData.overview.totalApplications)}</div>
                        <div className="text-sm text-base-600">Total Applications</div>
                    </div>
                    <FileText className="w-10 h-10 text-accent-400" />
                </div>
                <div className="mt-3 text-xs text-base-500">
                    <span className="text-green-600">+12.5%</span> from last period
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-6 border-2 border-accent-200">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-accent-600 mb-2">{analyticsData.overview.totalHires}</div>
                        <div className="text-sm text-base-600">Total Hires</div>
                    </div>
                    <Users className="w-10 h-10 text-accent-400" />
                </div>
                <div className="mt-3 text-xs text-base-500">
                    <span className="text-green-600">+18.2%</span> from last period
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-6 border-2 border-accent-200">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-accent-600 mb-2">{analyticsData.overview.averageTimeToHire}d</div>
                        <div className="text-sm text-base-600">Avg Time to Hire</div>
                    </div>
                    <Clock className="w-10 h-10 text-accent-400" />
                </div>
                <div className="mt-3 text-xs text-base-500">
                    <span className="text-green-600">-15.3%</span> improvement
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-6 border-2 border-accent-200">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-accent-600 mb-2">{analyticsData.overview.hrEfficiencyScore}%</div>
                        <div className="text-sm text-base-600">HR Efficiency</div>
                    </div>
                    <Target className="w-10 h-10 text-accent-400" />
                </div>
                <div className="mt-3 text-xs text-base-500">
                    <span className="text-green-600">+8.7%</span> improvement
                </div>
            </div>
        </div>
    );

    const renderApplicationsMetrics = () => {
        const data = analyticsData.applications;
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-8">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-900">Application Metrics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Total Submitted</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.submitted)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Under Review</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.underReview)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Shortlisted</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.shortlisted)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Rejected</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.rejected)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Conversion Rate</div>
                        <div className="text-2xl font-bold text-base-600">{data.conversionRate}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Average Score</div>
                        <div className="text-2xl font-bold text-base-600">{data.averageScore}</div>
                    </div>
                </div>

                <div className="mt-6 bg-base-50 rounded-xl p-4">
                    <h4 className="font-semibold text-base-900 mb-3">Source Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(data.sourceBreakdown).map(([source, count]) => (
                            <div key={source} className="flex justify-between text-sm">
                                <span className="text-base-600 capitalize">{source}</span>
                                <span className="font-semibold text-base-900">{formatNumber(count)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderAssessmentsMetrics = () => {
        const data = analyticsData.assessments;
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-8">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-900">Assessment Performance</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Sent</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.sent)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Completed</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.completed)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Pending</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.pending)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Average Score</div>
                        <div className="text-2xl font-bold text-base-600">{data.averageScore}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Pass Rate</div>
                        <div className="text-2xl font-bold text-base-600">{data.passRate}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Avg Completion Time</div>
                        <div className="text-2xl font-bold text-base-600">{data.averageCompletionTime}m</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderInterviewsMetrics = () => {
        const data = analyticsData.interviews;
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-8">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-900">Interview Analytics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Technical Interviews</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.technical)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">HR Interviews</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.hr)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Completed</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.completed)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Average Score</div>
                        <div className="text-2xl font-bold text-base-600">{data.averageScore}/10</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Average Duration</div>
                        <div className="text-2xl font-bold text-base-600">{data.averageDuration}m</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Satisfaction Score</div>
                        <div className="text-2xl font-bold text-base-600">{data.satisfactionScore}/5</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderHiringMetrics = () => {
        const data = analyticsData.hiring;
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-8">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                        <Award className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-900">Hiring Insights</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Total Hires</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.totalHires)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Time to Hire</div>
                        <div className="text-2xl font-bold text-accent-600">{data.timeToHire}d</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Offer Acceptance Rate</div>
                        <div className="text-2xl font-bold text-accent-600">{data.offerAcceptanceRate}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Average Salary</div>
                        <div className="text-2xl font-bold text-base-600">{formatCurrency(data.averageSalary)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Retention Rate</div>
                        <div className="text-2xl font-bold text-base-600">{data.retentionRate}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Quality of Hire</div>
                        <div className="text-2xl font-bold text-base-600">{data.qualityOfHire}%</div>
                    </div>
                </div>

                <div className="mt-6 bg-base-50 rounded-xl p-4">
                    <h4 className="font-semibold text-base-900 mb-3">Department Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(data.departmentBreakdown).map(([dept, count]) => (
                            <div key={dept} className="flex justify-between text-sm">
                                <span className="text-base-600 capitalize">{dept}</span>
                                <span className="font-semibold text-base-900">{formatNumber(count)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderEfficiencyMetrics = () => {
        const data = analyticsData.efficiency;
        return (
            <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-8">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-900">HR Efficiency</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Time Saved Monthly</div>
                        <div className="text-2xl font-bold text-accent-600">{data.timeSaved}h</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Automation Rate</div>
                        <div className="text-2xl font-bold text-accent-600">{data.automationRate}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Manual Tasks Reduced</div>
                        <div className="text-2xl font-bold text-accent-600">{formatNumber(data.manualTasksReduced)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Process Improvement</div>
                        <div className="text-2xl font-bold text-base-600">{data.processImprovement}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">HR Productivity</div>
                        <div className="text-2xl font-bold text-base-600">{data.hrProductivity}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-6">
                        <div className="text-sm text-base-600 mb-1">Compliance Score</div>
                        <div className="text-2xl font-bold text-base-600">{data.complianceScore}%</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTrendsChart = () => (
        <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-base-900 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-accent-600" />
                    Performance Trends
                </h2>
                <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-base-600" />
                    <span className="text-sm text-base-600">Last 12 Months</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Applications vs Hires</h3>
                    <div className="space-y-4">
                        {analyticsData.trends.monthlyApplications.map((apps, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-16 text-sm text-slate-600">Month {index + 1}</div>
                                <div className="flex-1 mx-4">
                                    <div className="flex items-center">
                                        <div className="flex-1 bg-slate-200 rounded-full h-4 mr-2">
                                            <div
                                                className="bg-blue-500 h-4 rounded-full"
                                                style={{ width: `${(apps / 200) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex-1 bg-slate-200 rounded-full h-4">
                                            <div
                                                className="bg-green-500 h-4 rounded-full"
                                                style={{ width: `${(analyticsData.trends.monthlyHires[index] / 40) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-700 w-16 text-right">
                                    {apps} / {analyticsData.trends.monthlyHires[index]}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                        <span className="mr-4">Applications</span>
                        <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                        <span>Hires</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Satisfaction & Efficiency</h3>
                    <div className="space-y-4">
                        {analyticsData.trends.satisfactionScores.map((score, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-16 text-sm text-slate-600">Month {index + 1}</div>
                                <div className="flex-1 mx-4">
                                    <div className="flex items-center">
                                        <div className="flex-1 bg-slate-200 rounded-full h-4 mr-2">
                                            <div
                                                className="bg-purple-500 h-4 rounded-full"
                                                style={{ width: `${(score / 5) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex-1 bg-slate-200 rounded-full h-4">
                                            <div
                                                className="bg-orange-500 h-4 rounded-full"
                                                style={{ width: `${analyticsData.trends.efficiencyGains[index]}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-700 w-16 text-right">
                                    {score} / {analyticsData.trends.efficiencyGains[index]}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                        <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                        <span className="mr-4">Satisfaction</span>
                        <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                        <span>Efficiency</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {onBack && (
                                <button onClick={onBack} className={`mr-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-white'}`}>
                                    <ArrowLeft className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                </button>
                            )}
                            <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-16 h-16 rounded-lg">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-6">
                                <h1 className={`text-4xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Analytics Dashboard</h1>
                                <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Performance insights and recruitment metrics</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-base-600" />
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="border border-base-300 rounded-lg px-4 py-2 text-base-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                >
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                    <option value="90days">Last 90 Days</option>
                                    <option value="1year">Last Year</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-base-600" />
                                <select
                                    value={selectedMetric}
                                    onChange={(e) => setSelectedMetric(e.target.value)}
                                    className="border border-base-300 rounded-lg px-4 py-2 text-base-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                >
                                    <option value="overview">Overview</option>
                                    <option value="applications">Applications</option>
                                    <option value="assessments">Assessments</option>
                                    <option value="interviews">Interviews</option>
                                    <option value="hiring">Hiring</option>
                                    <option value="efficiency">Efficiency</option>
                                </select>
                            </div>

                            <button
                                onClick={exportAnalytics}
                                className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-2 mb-8">
                    <div className="flex space-x-2">
                        {['overview', 'applications', 'assessments', 'interviews', 'hiring', 'efficiency', 'trends'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedMetric(tab)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedMetric === tab
                                    ? 'bg-gradient-to-r from-base-600 to-accent-600 text-white'
                                    : 'text-base-600 hover:bg-base-100'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Based on Selected Metric */}
                {selectedMetric === 'overview' && (
                    <div>
                        {renderOverviewCards()}
                        {renderTrendsChart()}
                    </div>
                )}

                {selectedMetric === 'applications' && renderApplicationsMetrics()}

                {selectedMetric === 'assessments' && renderAssessmentsMetrics()}

                {selectedMetric === 'interviews' && renderInterviewsMetrics()}

                {selectedMetric === 'hiring' && renderHiringMetrics()}

                {selectedMetric === 'efficiency' && renderEfficiencyMetrics()}

                {selectedMetric === 'trends' && renderTrendsChart()}

                {/* HR Impact Summary */}
                <div className="mt-8 bg-gradient-to-r from-base-50 to-accent-50 rounded-2xl p-8 border border-base-200">
                    <h2 className="text-2xl font-bold text-base-900 mb-6">HR Impact Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent-600 mb-2">
                                {analyticsData.efficiency.timeSaved}h
                            </div>
                            <div className="text-sm text-base-600">Time Saved Monthly</div>
                            <div className="text-xs text-base-500 mt-1">
                                Through automation and streamlined processes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent-600 mb-2">
                                ${formatNumber(analyticsData.efficiency.manualTasksReduced * 50)}
                            </div>
                            <div className="text-sm text-base-600">Cost Savings</div>
                            <div className="text-xs text-base-500 mt-1">
                                Reduced manual work and improved efficiency
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-accent-600 mb-2">
                                {analyticsData.efficiency.hrProductivity}%
                            </div>
                            <div className="text-sm text-base-600">HR Productivity Score</div>
                            <div className="text-xs text-base-500 mt-1">
                                Measured against industry benchmarks
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
