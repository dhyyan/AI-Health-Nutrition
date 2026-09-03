import React from 'react';
import { Droplets, Clock } from 'lucide-react';
import { WaterReminderSchedule } from '../../types/reminder';

interface WaterReminderCardProps {
  schedule: WaterReminderSchedule;
  onChange: (updated: Partial<WaterReminderSchedule>) => void;
}

export const WaterReminderCard: React.FC<WaterReminderCardProps> = ({ schedule, onChange }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 font-outfit text-lg">Periodic Hydration Reminders</h3>
            <p className="text-xs text-slate-500">Automated drinking alerts during your active hours</p>
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
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
        </label>
      </div>

      {/* Settings Controls */}
      <div className={`space-y-5 ${!schedule.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Frequency interval buttons */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Reminder Frequency</span>
            </span>
            <span className="text-cyan-700 font-bold">Every {schedule.intervalMinutes || 60} minutes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: '30 Mins', value: 30 },
              { label: '1 Hour', value: 60 },
              { label: '1.5 Hours', value: 90 },
              { label: '2 Hours', value: 120 },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ intervalMinutes: option.value })}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  schedule.intervalMinutes === option.value
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Start Time (Morning)</label>
            <input
              type="time"
              value={schedule.startTime || '08:00'}
              onChange={(e) => onChange({ startTime: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">End Time (Evening)</label>
            <input
              type="time"
              value={schedule.endTime || '22:00'}
              onChange={(e) => onChange({ endTime: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
