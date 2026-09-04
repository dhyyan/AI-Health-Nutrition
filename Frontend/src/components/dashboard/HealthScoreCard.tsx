import React, { useState } from 'react';
import { Heart, Info } from 'lucide-react';

interface HealthScoreData {
  totalScore: number;
  statusLabel: string;
  nutritionScore: number;
  waterScore: number;
  bmiScore: number;
  consistencyScore: number;
}

interface HealthScoreCardProps {
  healthScore?: HealthScoreData;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ healthScore }) => {
  const [showScoreBreakdown, setShowScoreBreakdown] = useState<boolean>(false);

  const totalScore = healthScore?.totalScore || 85;
  const statusLabel = healthScore?.statusLabel || 'Good';

  const getScoreBadgeColor = (score?: number) => {
    if (!score) return 'text-slate-600 bg-slate-100 border-slate-300';
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-teal-700 bg-teal-50 border-teal-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5 relative">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <Heart className="w-7 h-7" />
        </div>
        <button
          onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
          className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          title="Score Breakdown Info"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Health Score</span>
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit">
            {totalScore}
          </span>
          <span className="text-sm text-slate-400 font-normal">/ 100</span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreBadgeColor(
              totalScore
            )}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Nutrition & Habit Rating</span>
        <button
          onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
          className="text-emerald-600 font-bold hover:underline cursor-pointer"
        >
          {showScoreBreakdown ? 'Hide Breakdown' : 'View Factors'}
        </button>
      </div>

      {/* Health Score Breakdown Accordion Overlay */}
      {showScoreBreakdown && healthScore && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 z-20 space-y-3 text-xs">
          <div className="font-bold text-slate-900 border-b pb-2 flex justify-between text-sm">
            <span>Score Breakdown</span>
            <span className="text-emerald-600">{healthScore.totalScore}/100</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Nutrition Target (Max 35)</span>
            <span className="font-bold text-slate-900">{healthScore.nutritionScore} pts</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Water Goal (Max 25)</span>
            <span className="font-bold text-slate-900">{healthScore.waterScore} pts</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>BMI Status (Max 25)</span>
            <span className="font-bold text-slate-900">{healthScore.bmiScore} pts</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Meal Consistency (Max 15)</span>
            <span className="font-bold text-slate-900">{healthScore.consistencyScore} pts</span>
          </div>
        </div>
      )}
    </div>
  );
};
