import React from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import { WaterHistoryDay } from '../../types/water';

interface WaterTrendsChartProps {
  history: WaterHistoryDay[];
  isLoading?: boolean;
}

export const WaterTrendsChart: React.FC<WaterTrendsChartProps> = ({ history, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const maxVal = Math.max(...history.map((h) => Math.max(h.totalConsumedMl, h.dailyGoalMl)), 3000);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyan-600" />
          <h3 className="font-bold text-slate-900 font-outfit text-base">7-Day Hydration Trends</h3>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" />
            <span className="text-slate-600 font-medium">Consumed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />
            <span className="text-slate-600 font-medium">Goal</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-slate-100 px-2">
        {history.map((item, idx) => {
          const dateObj = new Date(item.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const barHeightPct = Math.min((item.totalConsumedMl / maxVal) * 100, 100);
          const goalHeightPct = Math.min((item.dailyGoalMl / maxVal) * 100, 100);

          return (
            <div key={item.date || idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip Hover Overlay */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                {item.totalConsumedMl} / {item.dailyGoalMl} ml
              </div>

              {/* Bars Comparison Wrapper */}
              <div className="w-full max-w-[28px] h-full flex items-end justify-center relative rounded-t-lg overflow-hidden bg-slate-100">
                {/* Goal indicator line */}
                <div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-slate-400 z-10"
                  style={{ bottom: `${goalHeightPct}%` }}
                />
                {/* Filled Consumed Bar */}
                <div
                  className={`w-full transition-all duration-500 rounded-t-md ${
                    item.isGoalMet
                      ? 'bg-gradient-to-t from-cyan-600 to-teal-400'
                      : 'bg-gradient-to-t from-sky-400 to-cyan-300'
                  }`}
                  style={{ height: `${barHeightPct}%` }}
                />
              </div>

              {/* Day Label & Badge */}
              <div className="mt-2 text-center">
                <span className="text-xs font-semibold text-slate-600 block font-outfit">{dayName}</span>
                {item.isGoalMet && (
                  <span title="Goal Met">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mx-auto mt-0.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
