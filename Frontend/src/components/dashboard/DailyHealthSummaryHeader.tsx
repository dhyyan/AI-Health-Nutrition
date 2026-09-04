import React from 'react';
import { ShieldCheck, TrendingUp, ChevronLeft, ChevronRight, Calendar, RefreshCw } from 'lucide-react';

interface DailyHealthSummaryHeaderProps {
  userName?: string;
  role?: string;
  goal?: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onRefresh: () => void;
  isToday: boolean;
  isLoading: boolean;
}

export const DailyHealthSummaryHeader: React.FC<DailyHealthSummaryHeaderProps> = ({
  userName = 'Health Enthusiast',
  role = 'USER',
  goal,
  selectedDate,
  onDateChange,
  onPrevDay,
  onNextDay,
  onToday,
  onRefresh,
  isToday,
  isLoading,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -top-12 w-56 h-56 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              <span>Role: {role}</span>
            </span>

            {goal && (
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-teal-400/30 backdrop-blur-md text-xs font-semibold text-white capitalize">
                <TrendingUp className="w-4 h-4" />
                <span>Goal: {goal.replace('_', ' ')}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Here is your daily health & nutrition command center. Track your total calories, water intake, BMI status, and AI suggestions.
          </p>
        </div>

        {/* Date Selector Controls */}
        <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevDay}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-white/20 border border-white/20 text-white">
              <Calendar className="w-4 h-4 text-emerald-200" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={onNextDay}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={onToday}
              className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition shadow-sm w-full sm:w-auto cursor-pointer"
            >
              Today
            </button>
          )}

          <button
            onClick={onRefresh}
            className={`p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer ${
              isLoading ? 'animate-spin' : ''
            }`}
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
