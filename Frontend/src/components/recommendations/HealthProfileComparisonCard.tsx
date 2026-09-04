import React from 'react';
import { Activity, Gauge, CheckCircle, AlertTriangle, ArrowUpRight, BarChart2 } from 'lucide-react';
import { HealthProfileComparison } from '../../types/recommendation.types';

interface HealthProfileComparisonCardProps {
  comparison: HealthProfileComparison;
}

export const HealthProfileComparisonCard: React.FC<HealthProfileComparisonCardProps> = ({
  comparison,
}) => {
  const getStatusBadge = (status: 'under' | 'optimal' | 'over') => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Optimal</span>
          </span>
        );
      case 'under':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Under Target</span>
          </span>
        );
      case 'over':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <ArrowUpRight className="w-3 h-3 text-rose-600" />
            <span>Over Target</span>
          </span>
        );
    }
  };

  const getProgressBarColor = (status: 'under' | 'optimal' | 'over') => {
    if (status === 'optimal') return 'bg-emerald-500';
    if (status === 'under') return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 space-y-8">
      {/* Header with Overall Score Gauge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-3">
            <Activity className="w-7 h-7 text-emerald-600" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">Health Profile vs Actual Intake</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 font-medium">
            Real-time tracking of your daily logged food intake compared against target recommendations.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center space-x-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-6 py-3.5 rounded-2xl shrink-0 shadow-xs">
          <Gauge className="w-8 h-8 text-emerald-600" />
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wide">Alignment Score</div>
            <div className="text-2xl font-black text-emerald-700">
              {comparison.overallScore} <span className="text-xs sm:text-sm font-bold text-slate-500">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparison.metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base sm:text-lg text-slate-900">{metric.name}</span>
              {getStatusBadge(metric.status)}
            </div>

            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{metric.actual}</span>
              <span className="text-sm font-semibold text-slate-500">
                / {metric.target} {metric.unit}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 ml-auto">
                {metric.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-3.5 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                  metric.status
                )}`}
                style={{ width: `${Math.min(100, metric.percentage)}%` }}
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">{metric.message}</p>
          </div>
        ))}
      </div>

      {/* Summary Notes */}
      {comparison.summaryNotes && comparison.summaryNotes.length > 0 && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 space-y-3">
          <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-900 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <span>Key Nutritional Insights</span>
          </h4>
          <ul className="space-y-2">
            {comparison.summaryNotes.map((note, idx) => (
              <li key={idx} className="text-sm sm:text-base text-slate-800 flex items-start space-x-2.5 font-medium">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
