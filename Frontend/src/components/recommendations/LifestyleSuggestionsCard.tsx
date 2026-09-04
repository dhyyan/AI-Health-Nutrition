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
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 space-y-8">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
        <Compass className="w-7 h-7 text-indigo-600" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
          Healthy Lifestyle Suggestions
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hydration Card */}
        <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5 text-blue-900 font-extrabold text-base sm:text-lg">
            <Droplet className="w-5 h-5 text-blue-600" />
            <span>Daily Hydration Goal</span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-950">
            {(suggestions.hydration.targetMl / 1000).toFixed(1)} <span className="text-sm font-bold text-blue-700">Liters / day</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {suggestions.hydration.advice}
          </p>
        </div>

        {/* Sleep Guidance Card */}
        <div className="p-6 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5 text-purple-900 font-extrabold text-base sm:text-lg">
            <Moon className="w-5 h-5 text-purple-600" />
            <span>Sleep & Recovery</span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-950">
            {suggestions.sleep.targetHours} <span className="text-sm font-bold text-purple-700">Hours target</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {suggestions.sleep.advice}
          </p>
        </div>

        {/* Activity Guidance */}
        <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5 text-emerald-900 font-extrabold text-base sm:text-lg">
            <HeartPulse className="w-5 h-5 text-emerald-600" />
            <span>Physical Activity</span>
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-lg inline-block">
            Level: {suggestions.activity.level}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {suggestions.activity.advice}
          </p>
        </div>

        {/* Mindful Eating Habits */}
        <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3 shadow-2xs">
          <div className="flex items-center space-x-2.5 text-amber-900 font-extrabold text-base sm:text-lg">
            <Utensils className="w-5 h-5 text-amber-600" />
            <span>Balanced Eating Habits</span>
          </div>
          <ul className="space-y-2 mt-1">
            {suggestions.eatingHabits.slice(0, 3).map((habit, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-800 font-medium flex items-start space-x-2">
                <span className="text-amber-600 font-extrabold">•</span>
                <span>{habit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Non-Medical Disclaimer */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-5 flex items-start space-x-4">
        <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong className="text-slate-800 font-bold">Medical Disclaimer:</strong>{' '}
          {suggestions.disclaimer}
        </p>
      </div>
    </div>
  );
};
