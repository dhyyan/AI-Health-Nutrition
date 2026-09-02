import React from 'react';
import { Calendar, Trash2, Utensils, Flame } from 'lucide-react';
import { FoodLogItem } from '../../types/nutrition.types';

interface FoodLogHistoryListProps {
  logs: FoodLogItem[];
  onDeleteLog: (id: string) => void;
  loading?: boolean;
}

export const FoodLogHistoryList: React.FC<FoodLogHistoryListProps> = ({
  logs,
  onDeleteLog,
  loading = false,
}) => {
  // Calculate Totals
  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = logs.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = logs.reduce((sum, item) => sum + item.carbohydrates, 0);
  const totalFat = logs.reduce((sum, item) => sum + item.fat, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-outfit">Today&apos;s Food Log</h3>
            <p className="text-xs text-slate-400 font-medium">{logs.length} items logged</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-800 font-bold text-xs">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>{totalCalories} kcal Total</span>
        </div>
      </div>

      {/* Summary Macro Bar */}
      {logs.length > 0 && (
        <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl text-center text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-700">Protein</div>
            <div className="font-bold text-slate-900">{totalProtein.toFixed(1)}g</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-sky-700">Carbs</div>
            <div className="font-bold text-slate-900">{totalCarbs.toFixed(1)}g</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-700">Fat</div>
            <div className="font-bold text-slate-900">{totalFat.toFixed(1)}g</div>
          </div>
        </div>
      )}

      {/* Log Items List */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">Loading today&apos;s food history...</div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs space-y-1">
          <Utensils className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-medium text-slate-600">No meals logged for today yet.</p>
          <p className="text-[11px] text-slate-400">Search and analyze food above to add to your daily tracker!</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100 border border-slate-200/60 rounded-2xl transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs capitalize">
                  {log.mealType.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                    <span>{log.foodName}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                      {log.mealType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {log.servingSize} {log.servingUnit} • P: {log.protein}g | C: {log.carbohydrates}g | F: {log.fat}g
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-700">{log.calories} kcal</div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteLog(log.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove log entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
