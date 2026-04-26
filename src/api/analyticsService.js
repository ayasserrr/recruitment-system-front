import apiClient from './apiClient';

export const getAnalyticsOverview = (period = '30days') =>
  apiClient.get('/analytics/overview', { params: { period } }).then((r) => r.data);
