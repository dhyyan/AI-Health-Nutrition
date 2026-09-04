import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Camera, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface FoodHistoryItem {
  id: string;
  foodName: string;
  mealType: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  isAiScanned?: boolean;
}

interface RecentFoodHistorySectionProps {
  foodHistory: FoodHistoryItem[];
}

export const RecentFoodHistorySection: React.FC<RecentFoodHistorySectionProps> = ({
  foodHistory = [],
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 flex items-center space-x-3">
            <Utensils className="w-8 h-8 text-emerald-600" />
            <span>Recent Food History & Scan Results</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
            Your latest recorded food logs and AI scanner detections.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/scanner"
            className="px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-sm sm:text-base transition border border-purple-200 flex items-center space-x-2.5 shadow-xs"
          >
            <Camera className="w-5 h-5" />
            <span>AI Scanner</span>
          </Link>
          <Link
            to="/nutrition"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base transition shadow-md flex items-center space-x-2.5"
          >
            <Plus className="w-5 h-5" />
            <span>Log Food</span>
          </Link>
        </div>
      </div>

      {foodHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-xs sm:text-sm">
                <th className="py-4 px-4">Food & Meal</th>
                <th className="py-4 px-4">Serving</th>
                <th className="py-4 px-4">Calories</th>
                <th className="py-4 px-4">Macros (P / C / F)</th>
                <th className="py-4 px-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {foodHistory.map((item: FoodHistoryItem) => (
                <tr key={item.id} className="hover:bg-slate-50/90 transition">
                  <td className="py-5 px-4">
                    <div className="font-extrabold text-slate-900 text-lg sm:text-xl">{item.foodName}</div>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm uppercase font-bold mt-1.5 capitalize border border-slate-200">
                      {item.mealType}
                    </span>
                  </td>
                  <td className="py-5 px-4 font-bold text-slate-800 text-base sm:text-lg">
                    {item.servingSize} {item.servingUnit}
                  </td>
                  <td className="py-5 px-4 font-black text-slate-900 text-lg sm:text-xl">{item.calories} kcal</td>
                  <td className="py-5 px-4 font-extrabold text-base sm:text-lg">
                    <span className="text-emerald-700">{item.protein}g P</span> •{' '}
                    <span className="text-sky-700">{item.carbohydrates}g C</span> •{' '}
                    <span className="text-amber-700">{item.fat}g F</span>
                  </td>
                  <td className="py-5 px-4">
                    {item.isAiScanned ? (
                      <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs sm:text-sm font-extrabold border border-purple-200">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>AI Scanned</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        <span>Manual Log</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-14 text-slate-400 space-y-4">
          <Utensils className="w-14 h-14 mx-auto text-slate-300" />
          <p className="text-lg font-bold text-slate-600">No food logs recorded yet for this period.</p>
          <Link
            to="/scanner"
            className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm sm:text-base hover:bg-emerald-700 transition shadow-md"
          >
            <Camera className="w-5 h-5" />
            <span>Scan Food with AI</span>
          </Link>
        </div>
      )}
    </div>
  );
};
