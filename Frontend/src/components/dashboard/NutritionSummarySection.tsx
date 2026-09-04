import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Layers } from 'lucide-react';

interface MacroNutrients {
  calories: { consumed: number; target: number; remaining: number; percentage: number };
  protein: { consumed: number; target: number; percentage: number };
  carbohydrates: { consumed: number; target: number; percentage: number };
  fat: { consumed: number; target: number; percentage: number };
  fiber: { consumed: number; target: number; percentage: number };
  macroPercentages: { proteinRatio: number; carbsRatio: number; fatRatio: number };
}

interface NutritionSummarySectionProps {
  macros: MacroNutrients;
}

export const NutritionSummarySection: React.FC<NutritionSummarySectionProps> = ({ macros }) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 flex items-center space-x-3">
            <Utensils className="w-8 h-8 text-emerald-600" />
            <span>Daily Nutrition Summary</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 font-normal">
            Detailed breakdown of macronutrient consumption and daily target distribution.
          </p>
        </div>
        <Link
          to="/nutrition"
          className="px-6 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-sm sm:text-base transition border border-emerald-200 shrink-0 shadow-xs"
        >
          Log Food & Analysis →
        </Link>
      </div>

      {/* Macro Progress Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Protein */}
        <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
          <span className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-wider">Protein</span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-outfit">
            {macros.protein.consumed}{' '}
            <span className="text-sm sm:text-base font-semibold text-slate-500">/ {macros.protein.target}g</span>
          </div>
          <div className="w-full h-3.5 bg-emerald-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(macros.protein.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="p-6 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-4">
          <span className="text-xs sm:text-sm font-black text-sky-900 uppercase tracking-wider">Carbohydrates</span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-outfit">
            {macros.carbohydrates.consumed}{' '}
            <span className="text-sm sm:text-base font-semibold text-slate-500">/ {macros.carbohydrates.target}g</span>
          </div>
          <div className="w-full h-3.5 bg-sky-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(macros.carbohydrates.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Fats */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
          <span className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wider">Fats</span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-outfit">
            {macros.fat.consumed}{' '}
            <span className="text-sm sm:text-base font-semibold text-slate-500">/ {macros.fat.target}g</span>
          </div>
          <div className="w-full h-3.5 bg-amber-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(macros.fat.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Fiber */}
        <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-4">
          <span className="text-xs sm:text-sm font-black text-teal-900 uppercase tracking-wider">Fiber</span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-outfit">
            {macros.fiber.consumed}{' '}
            <span className="text-sm sm:text-base font-semibold text-slate-500">/ {macros.fiber.target}g</span>
          </div>
          <div className="w-full h-3.5 bg-teal-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(macros.fiber.percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Macro Energy Ratio Distribution Bar */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
        <div className="flex flex-wrap justify-between items-center text-sm font-bold text-slate-800 gap-2">
          <span className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>Macro Energy Distribution Ratio</span>
          </span>
          <span className="text-slate-600 font-semibold text-sm">
            Protein {macros.macroPercentages.proteinRatio}% • Carbs {macros.macroPercentages.carbsRatio}% • Fat{' '}
            {macros.macroPercentages.fatRatio}%
          </span>
        </div>

        <div className="w-full h-5 bg-slate-200 rounded-xl overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${macros.macroPercentages.proteinRatio}%` }}
            title={`Protein: ${macros.macroPercentages.proteinRatio}%`}
          />
          <div
            className="h-full bg-sky-500 transition-all duration-500"
            style={{ width: `${macros.macroPercentages.carbsRatio}%` }}
            title={`Carbohydrates: ${macros.macroPercentages.carbsRatio}%`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${macros.macroPercentages.fatRatio}%` }}
            title={`Fat: ${macros.macroPercentages.fatRatio}%`}
          />
        </div>
      </div>
    </div>
  );
};
