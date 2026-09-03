import { useState, useEffect, useCallback } from 'react';
import {
  reportApi,
  DailyReportData,
  PeriodReportData,
  HealthTrendsData,
  LogWeightBmiPayload,
} from '../services/reportApi';

export type ReportTab = 'daily' | 'weekly' | 'monthly' | 'analytics';
export type TrendsPeriod = '7d' | '30d' | '90d' | '1y';

export const useHealthReports = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('daily');
  const [trendsPeriod, setTrendsPeriod] = useState<TrendsPeriod>('30d');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [dailyData, setDailyData] = useState<DailyReportData | null>(null);
  const [weeklyData, setWeeklyData] = useState<PeriodReportData | null>(null);
  const [monthlyData, setMonthlyData] = useState<PeriodReportData | null>(null);
  const [trendsData, setTrendsData] = useState<HealthTrendsData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTabContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'daily') {
        const data = await reportApi.getDailyReport(selectedDate);
        setDailyData(data);
      } else if (activeTab === 'weekly') {
        const data = await reportApi.getWeeklyReport();
        setWeeklyData(data);
      } else if (activeTab === 'monthly') {
        const data = await reportApi.getMonthlyReport();
        setMonthlyData(data);
      } else if (activeTab === 'analytics') {
        const data = await reportApi.getTrends(trendsPeriod);
        setTrendsData(data);
      }
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      setError(err.response?.data?.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDate, trendsPeriod]);

  useEffect(() => {
    fetchTabContent();
  }, [fetchTabContent]);

  const refreshAll = () => {
    fetchTabContent();
  };

  const handleLogWeight = async (payload: LogWeightBmiPayload): Promise<void> => {
    try {
      await reportApi.logWeightBmi(payload);
      refreshAll();
    } catch (err: any) {
      console.error('Failed to log weight:', err);
      throw new Error(err.response?.data?.message || 'Failed to log weight');
    }
  };

  const handleDownloadPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const period = activeTab === 'analytics' ? 'monthly' : activeTab;
      await reportApi.downloadPdfReport(period as 'daily' | 'weekly' | 'monthly', selectedDate);
    } catch (err: any) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    trendsPeriod,
    setTrendsPeriod,
    selectedDate,
    setSelectedDate,
    dailyData,
    weeklyData,
    monthlyData,
    trendsData,
    loading,
    isExporting,
    error,
    refreshAll,
    handleLogWeight,
    handleDownloadPdf,
  };
};
