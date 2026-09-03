import React, { useState } from 'react';
import { useHealthReports } from '../../hooks/useHealthReports';
import { ReportHeader } from '../../features/reports/components/ReportHeader';
import { DailyReportView } from '../../features/reports/components/DailyReportView';
import { WeeklyReportView } from '../../features/reports/components/WeeklyReportView';
import { MonthlyReportView } from '../../features/reports/components/MonthlyReportView';
import { HealthImprovementGraphs } from '../../features/reports/components/HealthImprovementGraphs';
import { LogWeightModal } from '../../features/reports/components/LogWeightModal';
import { AlertCircle } from 'lucide-react';

export const HealthReportsPage: React.FC = () => {
  const {
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
  } = useHealthReports();

  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Controls */}
      <ReportHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trendsPeriod={trendsPeriod}
        setTrendsPeriod={setTrendsPeriod}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onOpenWeightModal={() => setIsWeightModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        isExporting={isExporting}
        onRefresh={refreshAll}
      />

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Views */}
      {activeTab === 'daily' && <DailyReportView data={dailyData} loading={loading} />}
      {activeTab === 'weekly' && <WeeklyReportView data={weeklyData} loading={loading} />}
      {activeTab === 'monthly' && <MonthlyReportView data={monthlyData} loading={loading} />}
      {activeTab === 'analytics' && <HealthImprovementGraphs data={trendsData} loading={loading} />}

      {/* Log Weight Modal */}
      <LogWeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSave={handleLogWeight}
        currentWeight={dailyData?.currentWeightKg || 70}
      />
    </div>
  );
};

export default HealthReportsPage;
