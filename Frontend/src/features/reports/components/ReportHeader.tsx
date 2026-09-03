import React from 'react';
import { ReportTab, TrendsPeriod } from '../../../hooks/useHealthReports';
import { FileText, Calendar, BarChart3, Scale, Download, RefreshCw } from 'lucide-react';

interface ReportHeaderProps {
  activeTab: ReportTab;
  setActiveTab: (tab: ReportTab) => void;
  trendsPeriod: TrendsPeriod;
  setTrendsPeriod: (period: TrendsPeriod) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenWeightModal: () => void;
  onDownloadPdf: () => void;
  isExporting: boolean;
  onRefresh: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  activeTab,
  setActiveTab,
  trendsPeriod,
  setTrendsPeriod,
  selectedDate,
  setSelectedDate,
  onOpenWeightModal,
  onDownloadPdf,
  isExporting,
  onRefresh,
}) => {
  const tabs: Array<{ id: ReportTab; label: string; icon: any }> = [
    { id: 'daily', label: 'Daily Report', icon: Calendar },
    { id: 'weekly', label: 'Weekly Summary', icon: FileText },
    { id: 'monthly', label: 'Monthly Summary', icon: FileText },
    { id: 'analytics', label: 'Graphs & Analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-6 space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">
                Health & Nutrition Reports
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Comprehensive analytics, progress trends, and exportable PDF summaries
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Action Controls */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenWeightModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all border border-slate-200"
          >
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Log Weight</span>
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Tabs & Period Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contextual Filters */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {activeTab === 'daily' && (
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['7d', '30d', '90d', '1y'] as TrendsPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTrendsPeriod(period)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    trendsPeriod === period
                      ? 'bg-white text-emerald-700 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
