import React from 'react';
import { PeriodReportData } from '../../../services/reportApi';
import { Calendar, Flame, Droplet, TrendingUp, TrendingDown, Scale, CheckCircle2 } from 'lucide-react';

interface MonthlyReportViewProps {
  data: PeriodReportData | null;
  loading: boolean;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">Compiling 30-day monthly report data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
        <p className="text-slate-500 text-sm font-medium">No monthly records available.</p>
      </div>
    );
  }

  const activePercentage = Math.round((data.activeDaysCount / (data.dailySummaries.length || 30)) * 100);

  return (
    <div className="space-y-6">
      {/* 30-Day Monthly Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Calories */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">30-Day Calories</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit">
            {(data.totalCalories / 1000).toFixed(1)}k <span className="text-xs font-semibold text-slate-400 font-sans">total kcal</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Daily Average: <span className="font-bold text-slate-800">{data.avgCalories} kcal</span>
          </div>
        </div>

        {/* Total Monthly Water */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Water Consumed</span>
            <Droplet className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit">
            {(data.totalWaterMl / 1000).toFixed(1)} <span className="text-xs font-semibold text-slate-400 font-sans">Liters</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Daily Average: <span className="font-bold text-slate-800">{data.avgWaterMl} ml</span>
          </div>
        </div>

        {/* Monthly Weight Trajectory */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weight Trajectory</span>
            <Scale className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-black text-slate-900 font-outfit">
              {data.endWeightKg} <span className="text-xs font-semibold text-slate-400 font-sans">kg</span>
            </div>
            {data.weightChangeKg !== 0 && (
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-bold flex items-center space-x-0.5 ${
                  data.weightChangeKg < 0
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {data.weightChangeKg < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>{Math.abs(data.weightChangeKg)} kg</span>
              </span>
            )}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            30 Days Ago: <span className="font-bold text-slate-800">{data.startWeightKg} kg</span>
          </div>
        </div>

        {/* Monthly Consistency */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logging Consistency</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-outfit">
            {activePercentage}%
          </div>
          <div className="text-xs font-medium text-slate-500 mt-2">
            Active Days: <span className="font-bold text-slate-800">{data.activeDaysCount} / {data.dailySummaries.length}</span>
          </div>
        </div>
      </div>

      {/* Monthly Timeline List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-lg font-outfit text-slate-900">30-Day Records Log</h3>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Calories</th>
                <th className="py-3 px-4">Protein</th>
                <th className="py-3 px-4">Carbs</th>
                <th className="py-3 px-4">Fat</th>
                <th className="py-3 px-4">Water</th>
                <th className="py-3 px-4">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {data.dailySummaries.map((day) => (
                <tr key={day.date} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{day.date}</td>
                  <td className="py-3 px-4 font-bold text-amber-600">{day.calories} kcal</td>
                  <td className="py-3 px-4 text-sky-600 font-semibold">{day.protein}g</td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">{day.carbohydrates}g</td>
                  <td className="py-3 px-4 text-rose-600 font-semibold">{day.fat}g</td>
                  <td className="py-3 px-4 text-cyan-600 font-semibold">{day.waterMl} ml</td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {day.weightKg ? `${day.weightKg} kg` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
