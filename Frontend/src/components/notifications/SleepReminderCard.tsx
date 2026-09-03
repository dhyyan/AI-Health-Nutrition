import React from 'react';
import { Moon, Sun, BellRing } from 'lucide-react';
import { SleepReminderSchedule } from '../../types/reminder';

interface SleepReminderCardProps {
  schedule: SleepReminderSchedule;
  onChange: (updated: Partial<SleepReminderSchedule>) => void;
}

export const SleepReminderCard: React.FC<SleepReminderCardProps> = ({ schedule, onChange }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 font-outfit text-lg">Sleep Schedule & Wind-Down</h3>
            <p className="text-xs text-slate-500">Sleep reminders based on user-defined bedtime schedule</p>
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
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
        </label>
      </div>

      <div className={`space-y-5 ${!schedule.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Bedtime & Wake-Up Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Moon className="w-4 h-4 text-violet-600" />
              <span>Target Bedtime</span>
            </label>
            <input
              type="time"
              value={schedule.bedtime || '22:30'}
              onChange={(e) => onChange({ bedtime: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Target Wake-Up Time</span>
            </label>
            <input
              type="time"
              value={schedule.wakeTime || '06:30'}
              onChange={(e) => onChange({ wakeTime: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Advance Wind-Down Notice */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center space-x-1.5">
              <BellRing className="w-4 h-4 text-slate-400" />
              <span>Wind-Down Reminder Notice</span>
            </span>
            <span className="text-violet-700 font-bold">{schedule.reminderMinutesBefore || 30} mins before bedtime</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[15, 30, 45].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => onChange({ reminderMinutesBefore: mins })}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  schedule.reminderMinutesBefore === mins
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {mins} Mins Prior
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
