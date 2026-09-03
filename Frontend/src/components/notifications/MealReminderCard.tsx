import React from 'react';
import { Utensils, Clock } from 'lucide-react';
import { MealReminderSchedule } from '../../types/reminder';

interface MealReminderCardProps {
  schedule: MealReminderSchedule;
  onChange: (updated: Partial<MealReminderSchedule>) => void;
}

export const MealReminderCard: React.FC<MealReminderCardProps> = ({ schedule, onChange }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 font-outfit text-lg">Meal Schedule Reminders</h3>
            <p className="text-xs text-slate-500">Timely alerts to maintain consistent nutrition & fueling</p>
          </div>
        </div>

        {/* Enable Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
        </label>
      </div>

      {/* Time Pickers Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${!schedule.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Breakfast */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <span>🍳 Breakfast</span>
            </span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="time"
            value={schedule.breakfastTime || '08:00'}
            onChange={(e) => onChange({ breakfastTime: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Lunch */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <span>🥗 Lunch</span>
            </span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="time"
            value={schedule.lunchTime || '13:00'}
            onChange={(e) => onChange({ lunchTime: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Dinner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <span>🍲 Dinner</span>
            </span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="time"
            value={schedule.dinnerTime || '19:30'}
            onChange={(e) => onChange({ dinnerTime: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* Snack */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <span>🍎 Afternoon Snack</span>
            </span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="time"
            value={schedule.snackTime || '16:30'}
            onChange={(e) => onChange({ snackTime: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>
    </div>
  );
};
