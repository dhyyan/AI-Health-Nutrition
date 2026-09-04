import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Plus, ArrowRight } from 'lucide-react';

interface WaterIntakeCardProps {
  waterConsumedMl: number;
  waterGoalMl: number;
  progressPercentage: number;
  onAddQuickWater: (amountMl: number) => void;
  isUpdating: boolean;
}

export const WaterIntakeCard: React.FC<WaterIntakeCardProps> = ({
  waterConsumedMl = 0,
  waterGoalMl = 2500,
  progressPercentage = 0,
  onAddQuickWater,
  isUpdating,
}) => {
  const waterConsumedLiters = (waterConsumedMl / 1000).toFixed(1);
  const waterGoalLiters = (waterGoalMl / 1000).toFixed(1);

  return (
    <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
          <Droplet className="w-7 h-7 fill-current" />
        </div>
        <button
          onClick={() => onAddQuickWater(250)}
          disabled={isUpdating}
          className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition text-xs font-bold flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
          title="Quick Log +250ml"
        >
          <Plus className="w-4 h-4" />
          <span>+250ml</span>
        </button>
      </div>

      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Water Intake</span>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mt-1">
          {waterConsumedLiters}{' '}
          <span className="text-sm text-slate-500 font-normal">/ {waterGoalLiters} L</span>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-500">{progressPercentage}% Completed</span>
          <Link to="/water" className="text-sky-600 hover:text-sky-700 font-bold flex items-center space-x-1">
            <span>Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
