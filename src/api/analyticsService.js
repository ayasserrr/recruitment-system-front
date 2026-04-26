import apiClient from './apiClient';

const normalizeAnalytics = (d) => {
  // applicationSources array → sourceBreakdown object + topPerformingSource
  const sourceBreakdown = {};
  let topSource = '';
  let topCount = 0;
  (d.applicationSources || []).forEach(({ source, count }) => {
    sourceBreakdown[source] = count;
    if (count > topCount) { topCount = count; topSource = source; }
  });

  // hiringBreakdown.byDepartment array → departmentBreakdown object
  const departmentBreakdown = {};
  (d.hiringBreakdown?.byDepartment || []).forEach(({ department, count }) => {
    departmentBreakdown[department] = count;
  });

  const totalApps = d.overview?.totalApplications ?? 0;
  const totalHires = d.overview?.totalHires ?? d.hiringBreakdown?.total ?? 0;

  return {
    overview: {
      totalApplications: totalApps,
      activeApplications: 0,
      completedProcesses: 0,
      averageTimeToHire: d.overview?.avgTimeToHire ?? 0,
      totalHires,
      offerAcceptanceRate: d.overview?.offerAcceptanceRate ?? d.hiringBreakdown?.acceptanceRate ?? 0,
      costPerHire: 0,
      hrEfficiencyScore: d.overview?.pipelineEfficiency ?? 0,
    },
    applications: {
      submitted: totalApps,
      underReview: 0,
      shortlisted: 0,
      rejected: 0,
      conversionRate: totalApps > 0 ? parseFloat(((totalHires / totalApps) * 100).toFixed(1)) : 0,
      averageScore: 0,
      topPerformingSource: topSource,
      sourceBreakdown,
    },
    assessments: {
      sent: d.assessmentMetrics?.sent ?? 0,
      completed: d.assessmentMetrics?.completed ?? 0,
      pending: Math.max(0, (d.assessmentMetrics?.sent ?? 0) - (d.assessmentMetrics?.completed ?? 0)),
      averageScore: d.assessmentMetrics?.avgScore ?? 0,
      passRate: d.assessmentMetrics?.passRate ?? 0,
      averageCompletionTime: 0,
      technicalScore: 0,
      theoryScore: 0,
    },
    interviews: {
      technical: d.interviewMetrics?.technical ?? 0,
      hr: d.interviewMetrics?.hr ?? 0,
      completed: (d.interviewMetrics?.technical ?? 0) + (d.interviewMetrics?.hr ?? 0),
      scheduled: 0,
      averageScore: d.interviewMetrics?.avgScore ?? 0,
      averageDuration: 0,
      noShowRate: 0,
      satisfactionScore: d.interviewMetrics?.satisfaction ?? 0,
    },
    hiring: {
      totalHires: d.hiringBreakdown?.total ?? totalHires,
      timeToHire: d.hiringBreakdown?.avgDaysToHire ?? 0,
      offerAcceptanceRate: d.hiringBreakdown?.acceptanceRate ?? 0,
      averageSalary: 0,
      retentionRate: 0,
      diversityScore: 0,
      qualityOfHire: 0,
      departmentBreakdown,
    },
    efficiency: {
      timeSaved: d.efficiency?.hoursSaved ?? 0,
      automationRate: d.efficiency?.automationRate ?? 0,
      manualTasksReduced: d.efficiency?.manualTasksReduced ?? 0,
      processImprovement: d.efficiency?.productivityGain ?? 0,
      hrProductivity: d.efficiency?.productivityGain ?? 0,
      candidateExperience: 0,
      complianceScore: 0,
    },
    trends: {
      monthlyApplications: d.trends?.monthlyApplications || [],
      monthlyHires: d.trends?.monthlyHires || [],
      satisfactionScores: d.trends?.satisfactionScores || [],
      efficiencyGains: d.trends?.efficiencyGains || [],
    },
  };
};

export const getAnalyticsOverview = (period = '30days') =>
  apiClient
    .get('/analytics/overview', { params: { period } })
    .then((r) => normalizeAnalytics(r.data));
