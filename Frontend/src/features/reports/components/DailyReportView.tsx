import React from 'react';
import { DailyReportData } from '../../../services/reportApi';
import { Flame, Droplet, Scale, Utensils, PieChart, Activity } from 'lucide-react';

interface DailyReportViewProps {
  data: DailyReportData | null;
  loading: boolean;
}

export const DailyReportView: React.FC<DailyReportViewProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading daily health report...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
        <p className="text-slate-500 text-sm font-medium">No daily records available for this date.</p>
      </div>
    );
  }

  const caloriePercentage = Math.min(100, Math.round((data.totalCalories / (data.targetCalories || 2000)) * 100));
  const waterPercentage = Math.min(100, Math.round((data.totalWaterMl / (data.waterGoalMl || 2500)) * 100));

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calories</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit">
            {data.totalCalories} <span className="text-xs font-semibold text-slate-400 font-sans">/ {data.targetCalories} kcal</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
              <span>Goal Progress</span>
              <span>{caloriePercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
                style={{ width: `${caloriePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Water Intake Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hydration</span>
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit">
            {data.totalWaterMl} <span className="text-xs font-semibold text-slate-400 font-sans">/ {data.waterGoalMl} ml</span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
              <span>Hydration Goal</span>
              <span>{waterPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${waterPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weight & BMI Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Body Weight & BMI</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit">
            {data.currentWeightKg} <span className="text-xs font-semibold text-slate-400 font-sans">kg</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-600">
              BMI: <span className="text-emerald-700 font-black text-sm">{data.currentBmi}</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              {data.bmiCategory}
            </span>
          </div>
        </div>

        {/* Macros Breakdown Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Macronutrients</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center mt-2">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div className="text-xs font-semibold text-sky-600">Protein</div>
              <div className="text-sm font-black text-slate-900">{data.totalProtein}g</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div className="text-xs font-semibold text-amber-600">Carbs</div>
              <div className="text-sm font-black text-slate-900">{data.totalCarbohydrates}g</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div className="text-xs font-semibold text-rose-600">Fat</div>
              <div className="text-sm font-black text-slate-900">{data.totalFat}g</div>
            </div>
          </div>
        </div>
      </div>

      {/* Logged Meals Detail Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-lg font-outfit text-slate-900">Food & Meals Logged Today</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {data.foodLogs.length} items logged
          </span>
        </div>

        {data.foodLogs.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm font-medium">
            No food logs recorded for this day.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Meal Type</th>
                  <th className="py-3 px-4">Serving</th>
                  <th className="py-3 px-4">Calories</th>
                  <th className="py-3 px-4">Protein</th>
                  <th className="py-3 px-4">Carbs</th>
                  <th className="py-3 px-4">Fat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {data.foodLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.foodName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                        {log.mealType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {log.servingSize} {log.servingUnit}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">{log.calories} kcal</td>
                    <td className="py-3.5 px-4 text-sky-600 font-semibold">{log.protein}g</td>
                    <td className="py-3.5 px-4 text-amber-600 font-semibold">{log.carbohydrates}g</td>
                    <td className="py-3.5 px-4 text-rose-600 font-semibold">{log.fat}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
