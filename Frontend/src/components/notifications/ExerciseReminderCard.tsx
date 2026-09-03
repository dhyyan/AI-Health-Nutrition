import React from 'react';
import { Activity, Calendar, Clock } from 'lucide-react';
import { ExerciseReminderSchedule } from '../../types/reminder';

interface ExerciseReminderCardProps {
  schedule: ExerciseReminderSchedule;
  onChange: (updated: Partial<ExerciseReminderSchedule>) => void;
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ExerciseReminderCard: React.FC<ExerciseReminderCardProps> = ({ schedule, onChange }) => {
  const toggleDay = (day: string) => {
    const currentDays = schedule.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    onChange({ days: newDays });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 font-outfit text-lg">Exercise & Activity Reminders</h3>
            <p className="text-xs text-slate-500">Stay consistent with planned workouts & active movement</p>
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
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <div className={`space-y-5 ${!schedule.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Activity Name & Workout Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Workout / Activity Name</label>
            <input
              type="text"
              value={schedule.activityName || ''}
              onChange={(e) => onChange({ activityName: e.target.value })}
              placeholder="e.g. Evening Cardio & Gym"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Reminder Time</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <input
              type="time"
              value={schedule.time || '17:30'}
              onChange={(e) => onChange({ time: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Days Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Target Days of Week</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {ALL_DAYS.map((day) => {
              const isSelected = (schedule.days || []).includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
