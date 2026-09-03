import React from 'react';
import { Droplet, Award, Flame, CheckCircle2 } from 'lucide-react';
import { DailyWaterSummary } from '../../types/water';

interface WaterProgressWidgetProps {
  summary: DailyWaterSummary | null;
  onQuickAdd: (amountMl: number) => void;
  isSubmitting?: boolean;
}

export const WaterProgressWidget: React.FC<WaterProgressWidgetProps> = ({
  summary,
  onQuickAdd,
  isSubmitting = false,
}) => {
  const totalConsumed = summary?.totalConsumedMl || 0;
  const goal = summary?.dailyGoalMl || 2500;
  const percentage = summary?.progressPercentage || 0;
  const remaining = summary?.remainingMl || Math.max(goal - totalConsumed, 0);

  // SVG Circular progress calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-cyan-900/90 via-sky-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-sky-500/20 backdrop-blur-xl">
      {/* Decorative background glass glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left Side: Circular Progress Meter */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="text-slate-800/80 stroke-current"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Animated Glowing Progress Track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="text-cyan-400 stroke-current transition-all duration-700 ease-out"
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-1 animate-pulse">
                <Droplet className="w-6 h-6 fill-current" />
              </div>
              <span className="text-3xl font-extrabold font-outfit tracking-tight text-white">
                {percentage}%
              </span>
              <span className="text-xs font-semibold text-cyan-200 uppercase tracking-widest mt-0.5">
                Target Met
              </span>
            </div>
          </div>

          {percentage >= 100 && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-bounce">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Goal Achieved Today! 🎉</span>
            </div>
          )}
        </div>

        {/* Right Side: Hydration Details & Quick Add */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Daily Hydration Goal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-outfit tracking-wide text-white">
              {(totalConsumed / 1000).toFixed(2)}{' '}
              <span className="text-lg font-normal text-cyan-200">/ {(goal / 1000).toFixed(2)} Liters</span>
            </h2>
            <p className="text-sm text-sky-200/80 mt-1">
              {remaining > 0 ? (
                <>You still need <strong className="text-white font-bold">{remaining} ml</strong> to reach your daily hydration target.</>
              ) : (
                <span className="text-emerald-400 font-semibold">Fantastic work! You have met your hydration target for today.</span>
              )}
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/5 border border-white/10 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md">
              <span className="text-xs text-sky-300/80 font-medium uppercase tracking-wider block">Consumed Today</span>
              <div className="text-xl sm:text-2xl font-bold text-cyan-300 font-outfit mt-0.5">
                {totalConsumed} <span className="text-xs text-cyan-200 font-normal">ml</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md">
              <span className="text-xs text-sky-300/80 font-medium uppercase tracking-wider block">Remaining Goal</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-outfit mt-0.5">
                {remaining} <span className="text-xs text-emerald-300 font-normal">ml</span>
              </div>
            </div>
          </div>

          {/* Quick-Add Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-cyan-200 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Add Intake</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {[
                { label: '+250 ml', amount: 250, desc: 'Small Glass' },
                { label: '+330 ml', amount: 330, desc: 'Can / Cup' },
                { label: '+500 ml', amount: 500, desc: 'Water Bottle' },
                { label: '+750 ml', amount: 750, desc: 'Large Flask' },
              ].map((item) => (
                <button
                  key={item.amount}
                  onClick={() => onQuickAdd(item.amount)}
                  disabled={isSubmitting}
                  className="group relative overflow-hidden bg-cyan-500/20 hover:bg-cyan-500/30 active:scale-95 text-cyan-100 border border-cyan-400/40 p-3 rounded-2xl transition-all duration-150 flex flex-col items-center justify-center text-center disabled:opacity-50 shadow-md"
                >
                  <span className="font-bold text-sm font-outfit text-white group-hover:scale-105 transition-transform">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-cyan-300/80 font-normal mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
