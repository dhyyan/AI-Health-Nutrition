import React from 'react';
import { Compass, Droplet, Moon, HeartPulse, ShieldAlert, Utensils } from 'lucide-react';
import { LifestyleSuggestion } from '../../types/recommendation.types';

interface LifestyleSuggestionsCardProps {
  suggestions: LifestyleSuggestion;
}

export const LifestyleSuggestionsCard: React.FC<LifestyleSuggestionsCardProps> = ({
  suggestions,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
        <Compass className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900 font-outfit">
          Healthy Lifestyle Suggestions
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hydration Card */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
          <div className="flex items-center space-x-2 text-blue-800 font-bold text-sm">
            <Droplet className="w-4 h-4 text-blue-600" />
            <span>Daily Hydration Goal</span>
          </div>
          <div className="text-2xl font-black text-blue-900">
            {(suggestions.hydration.targetMl / 1000).toFixed(1)} <span className="text-xs font-semibold text-blue-700">Liters / day</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {suggestions.hydration.advice}
          </p>
        </div>

        {/* Sleep Guidance Card */}
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
          <div className="flex items-center space-x-2 text-purple-800 font-bold text-sm">
            <Moon className="w-4 h-4 text-purple-600" />
            <span>Sleep & Recovery</span>
          </div>
          <div className="text-2xl font-black text-purple-900">
            {suggestions.sleep.targetHours} <span className="text-xs font-semibold text-purple-700">Hours target</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {suggestions.sleep.advice}
          </p>
        </div>

        {/* Activity Guidance */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>Physical Activity</span>
          </div>
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Level: {suggestions.activity.level}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {suggestions.activity.advice}
          </p>
        </div>

        {/* Mindful Eating Habits */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Balanced Eating Habits</span>
          </div>
          <ul className="space-y-1 mt-1">
            {suggestions.eatingHabits.slice(0, 3).map((habit, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start space-x-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{habit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Non-Medical Disclaimer */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 flex items-start space-x-3">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-slate-700 font-semibold">Medical Disclaimer:</strong>{' '}
          {suggestions.disclaimer}
        </p>
      </div>
    </div>
  );
};
