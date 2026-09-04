import React from 'react';
import { Flame } from 'lucide-react';

interface DailyCalorieCardProps {
  caloriesConsumed: number;
  caloriesTarget: number;
  caloriesRemaining: number;
  percentage: number;
}

export const DailyCalorieCard: React.FC<DailyCalorieCardProps> = ({
  caloriesConsumed = 0,
  caloriesTarget = 2000,
  caloriesRemaining = 2000,
  percentage = 0,
}) => {
  return (
    <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Flame className="w-7 h-7" />
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          Target: {caloriesTarget} kcal
        </span>
      </div>

      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Daily Calories</span>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mt-1">
          {caloriesConsumed}{' '}
          <span className="text-sm text-slate-500 font-normal">/ {caloriesTarget} kcal</span>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-500">Progress</span>
          <span className="text-amber-700 font-bold text-sm">{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 text-right font-medium">
          {caloriesRemaining} kcal remaining
        </p>
      </div>
    </div>
  );
};
