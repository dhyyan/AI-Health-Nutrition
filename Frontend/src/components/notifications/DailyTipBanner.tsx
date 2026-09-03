import React, { useState } from 'react';
import { Lightbulb, Sparkles, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { DailyHealthTip } from '../../types/reminder';

interface DailyTipBannerProps {
  tip: DailyHealthTip | null;
  onRefresh?: () => void;
}

export const DailyTipBanner: React.FC<DailyTipBannerProps> = ({ tip, onRefresh }) => {
  const [completedToday, setCompletedToday] = useState(false);

  if (!tip) return null;

  const categoryColors: Record<string, string> = {
    nutrition: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-800 tag-emerald',
    hydration: 'from-cyan-500/10 to-blue-500/10 border-cyan-200 text-cyan-800 tag-cyan',
    fitness: 'from-indigo-500/10 to-purple-500/10 border-indigo-200 text-indigo-800 tag-indigo',
    sleep: 'from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-800 tag-violet',
    mindfulness: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-800 tag-amber',
    general: 'from-emerald-500/10 to-cyan-500/10 border-slate-200 text-slate-800',
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-7 shadow-xl border border-slate-700/50">
      {/* Background Decorative Accent Elements */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          {/* Tag & Category */}
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="capitalize">Daily Wellness Tip</span>
            </span>

            {tip.category && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-300 uppercase tracking-wider">
                {tip.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold font-outfit text-white tracking-wide">
            {tip.title}
          </h3>

          {/* Content */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {tip.content}
          </p>

          {/* Actionable Step Pill */}
          {tip.actionableStep && (
            <div className="mt-3 inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs text-emerald-300 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Today's Goal:</strong> {tip.actionableStep}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition"
              title="Load another health tip"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setCompletedToday(!completedToday)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 border ${
              completedToday
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white text-slate-900 hover:bg-slate-100 border-white'
            }`}
          >
            {completedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Goal Completed!</span>
              </>
            ) : (
              <>
                <span>Mark Completed</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
