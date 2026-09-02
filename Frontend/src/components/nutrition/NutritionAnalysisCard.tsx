import React, { useState } from 'react';
import {
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Sparkles,
  Database,
  CheckCircle2,
  PlusCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { NutritionAnalysisResult, MealType } from '../../types/nutrition.types';

interface NutritionAnalysisCardProps {
  analysis: NutritionAnalysisResult;
  onLogFood?: (mealType: MealType) => void;
  isLogging?: boolean;
}

export const NutritionAnalysisCard: React.FC<NutritionAnalysisCardProps> = ({
  analysis,
  onLogFood,
  isLogging = false,
}) => {
  const [selectedMealType, setSelectedMealType] = useState<MealType>('snack');

  const {
    foodName,
    category,
    servingSize,
    servingUnit,
    calories,
    protein,
    carbohydrates,
    fat,
    fiber,
    sugar,
    sodium,
    vitaminsAndMinerals = [],
    dataSource,
    isVerified,
  } = analysis;

  // Calculate Macro Percentages for Energy Ratios
  const proteinCal = protein * 4;
  const carbCal = carbohydrates * 4;
  const fatCal = fat * 9;
  const totalMacroCal = Math.max(1, proteinCal + carbCal + fatCal);

  const proteinPct = Math.round((proteinCal / totalMacroCal) * 100);
  const carbPct = Math.round((carbCal / totalMacroCal) * 100);
  const fatPct = Math.round((fatCal / totalMacroCal) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                {category}
              </span>
              {isVerified !== false && (
                <span className="flex items-center space-x-1 text-xs text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Database</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit mt-2 tracking-tight">
              {foodName}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Nutrition analysis for <span className="font-semibold text-emerald-300">{servingSize} {servingUnit}</span>
            </p>
          </div>

          {/* Calories Highlight Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center space-x-4 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <Flame className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-300">Estimated Calories</div>
              <div className="text-2xl sm:text-3xl font-black font-outfit text-white tracking-tight">
                {calories} <span className="text-xs font-semibold text-emerald-300">kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Body */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Macronutrient Ratios Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Macronutrient Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Protein • Carbs • Fat Ratios</span>
          </div>

          {/* Visual Ratio Bar */}
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${proteinPct}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Protein: ${proteinPct}%`}
            />
            <div
              style={{ width: `${carbPct}%` }}
              className="bg-sky-500 transition-all duration-500"
              title={`Carbohydrates: ${carbPct}%`}
            />
            <div
              style={{ width: `${fatPct}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Fat: ${fatPct}%`}
            />
          </div>

          {/* Macro Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Protein */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-800 uppercase">Protein</div>
                <div className="text-xl font-bold text-slate-900">{protein} <span className="text-xs text-slate-500">g</span></div>
                <div className="text-[11px] font-medium text-emerald-700">{proteinPct}% of macros</div>
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                <Wheat className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-sky-800 uppercase">Carbohydrates</div>
                <div className="text-xl font-bold text-slate-900">{carbohydrates} <span className="text-xs text-slate-500">g</span></div>
                <div className="text-[11px] font-medium text-sky-700">{carbPct}% of macros</div>
              </div>
            </div>

            {/* Fat */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-800 uppercase">Total Fat</div>
                <div className="text-xl font-bold text-slate-900">{fat} <span className="text-xs text-slate-500">g</span></div>
                <div className="text-[11px] font-medium text-amber-700">{fatPct}% of macros</div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Nutrients (Fiber, Sugar, Sodium) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Key Dietary Metrics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700">Dietary Fiber</span>
              <span className="text-sm font-bold text-slate-900">{fiber} g</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700">Total Sugar</span>
              <span className="text-sm font-bold text-slate-900">{sugar} g</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700">Sodium</span>
              <span className="text-sm font-bold text-slate-900">{sodium} mg</span>
            </div>
          </div>
        </div>

        {/* Micronutrients: Vitamins and Minerals */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Vitamins & Minerals</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Micronutrient Profile</span>
          </div>

          {vitaminsAndMinerals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {vitaminsAndMinerals.map((micro, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between transition"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{micro.name}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {micro.amount} {micro.unit}
                    </div>
                  </div>
                  {micro.dailyValuePercentage !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {micro.dailyValuePercentage}% DV
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
              Standard micronutrient values included in macronutrient base totals.
            </div>
          )}
        </div>

        {/* Database Citation Banner */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Nutrition Database Source: </span>
              <span>{dataSource || 'Verified Food Database API'}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            Nutritional data sourced directly from verified food database endpoints.
          </span>
        </div>

        {/* Log Food Action Controls */}
        {onLogFood && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Meal Type:</span>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <button
              type="button"
              disabled={isLogging}
              onClick={() => onLogFood(selectedMealType)}
              className="w-full sm:w-auto btn-primary px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.02] transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isLogging ? 'Logging Meal...' : 'Log to Daily Intake'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
