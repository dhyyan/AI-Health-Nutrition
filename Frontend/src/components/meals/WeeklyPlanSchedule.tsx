import React from 'react';
import { Calendar, Flame, Zap, CheckCircle2 } from 'lucide-react';
import { DailyScheduleItem } from '../../types/meal.types';

interface WeeklyPlanScheduleProps {
  schedule: DailyScheduleItem[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
}

export const WeeklyPlanSchedule: React.FC<WeeklyPlanScheduleProps> = ({
  schedule,
  selectedDay,
  onSelectDay,
}) => {
  const currentDayItem = schedule.find((d) => d.day === selectedDay) || schedule[0];

  return (
    <div className="space-y-6">
      {/* 7-Day Navigation Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {schedule.map((item) => {
          const isSelected = item.day === selectedDay;

          return (
            <button
              key={item.day}
              onClick={() => onSelectDay(item.day)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md scale-102'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {item.day.slice(0, 3)}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>

              <div className="mt-2">
                <div
                  className={`text-sm font-extrabold font-outfit ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {item.meals.totalCalories}{' '}
                  <span
                    className={`text-[10px] font-normal ${
                      isSelected ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    kcal
                  </span>
                </div>
                <div
                  className={`text-[11px] font-semibold mt-0.5 ${
                    isSelected ? 'text-emerald-200' : 'text-purple-600'
                  }`}
                >
                  {item.meals.totalProtein}g protein
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Total Macro Header Banner */}
      {currentDayItem && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-outfit">
                {currentDayItem.day} Meal Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Daily balanced target breakdown calculated for your health profile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center shrink-0">
            <div className="px-2 py-1">
              <div className="text-[10px] font-semibold text-slate-400 uppercase flex items-center justify-center space-x-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>Calories</span>
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {currentDayItem.meals.totalCalories} kcal
              </div>
            </div>
            <div className="px-2 py-1">
              <div className="text-[10px] font-semibold text-slate-400 uppercase flex items-center justify-center space-x-1">
                <Zap className="w-3 h-3 text-purple-600" />
                <span>Protein</span>
              </div>
              <div className="text-sm font-black text-purple-700 mt-0.5">
                {currentDayItem.meals.totalProtein}g
              </div>
            </div>
            <div className="px-2 py-1">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Carbs</div>
              <div className="text-sm font-black text-amber-600 mt-0.5">
                {currentDayItem.meals.totalCarbs}g
              </div>
            </div>
            <div className="px-2 py-1">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Fats</div>
              <div className="text-sm font-black text-emerald-600 mt-0.5">
                {currentDayItem.meals.totalFat}g
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
