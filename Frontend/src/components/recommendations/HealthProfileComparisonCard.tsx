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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header with Overall Score Gauge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Health Profile vs Actual Intake</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Real-time tracking of your daily logged food intake compared against target recommendations.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-4 py-2.5 rounded-2xl shrink-0">
          <Gauge className="w-6 h-6 text-emerald-600" />
          <div>
            <div className="text-xs font-medium text-slate-500">Alignment Score</div>
            <div className="text-lg font-black text-emerald-700">
              {comparison.overallScore} <span className="text-xs font-bold">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparison.metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{metric.name}</span>
              {getStatusBadge(metric.status)}
            </div>

            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-xl font-black text-slate-900">{metric.actual}</span>
              <span className="text-xs text-slate-500">
                / {metric.target} {metric.unit}
              </span>
              <span className="text-xs font-bold text-slate-700 ml-auto">
                {metric.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                  metric.status
                )}`}
                style={{ width: `${Math.min(100, metric.percentage)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 mt-2 font-medium">{metric.message}</p>
          </div>
        ))}
      </div>

      {/* Summary Notes */}
      {comparison.summaryNotes && comparison.summaryNotes.length > 0 && (
        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>Key Nutritional Insights</span>
          </h4>
          <ul className="space-y-1.5">
            {comparison.summaryNotes.map((note, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
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
