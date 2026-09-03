import React, { useState } from 'react';
import { ScanResultData } from '../../../services/scannerApi';
import { createFoodLog } from '../../../services/nutritionApi';
import { useNotifications } from '../../../context/NotificationContext';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  PieChart,
  Plus,
  Sparkles,
  Info,
  Check,
  Scale,
} from 'lucide-react';

interface ScannerResultCardProps {
  result: ScanResultData;
  onReset: () => void;
}

export const ScannerResultCard: React.FC<ScannerResultCardProps> = ({ result, onReset }) => {
  const { addNotification } = useNotifications();

  const [servingCount, setServingCount] = useState<number>(result.servingSize || 1);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  // Scaled nutritional metrics based on serving quantity
  const scaledCalories = Math.round(result.calories * servingCount);
  const scaledProtein = Math.round(result.protein * servingCount * 10) / 10;
  const scaledCarbs = Math.round(result.carbohydrates * servingCount * 10) / 10;
  const scaledFat = Math.round(result.fat * servingCount * 10) / 10;
  const scaledFiber = Math.round(result.fiber * servingCount * 10) / 10;

  const handleAddToLog = async () => {
    if (isLogged) return;

    setIsLogging(true);
    try {
      await createFoodLog({
        foodName: result.foodName,
        servingSize: servingCount,
        servingUnit: result.servingUnit || 'serving',
        mealType,
        calories: scaledCalories,
        protein: scaledProtein,
        carbohydrates: scaledCarbs,
        fat: scaledFat,
        fiber: scaledFiber,
      });

      setIsLogged(true);
      await addNotification(
        'Logged to Daily Nutrition',
        `${result.foodName} (${scaledCalories} kcal) added to your ${mealType} log.`,
        'system'
      );
    } catch (err: any) {
      console.error('Failed to log scanned food:', err);
      await addNotification(
        'Log Error',
        err.response?.data?.message || 'Failed to save food log',
        'system'
      );
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Top Banner with Image & Classification Badge */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        {result.imageUrl ? (
          <img
            src={result.imageUrl}
            alt={result.foodName}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-emerald-800 to-teal-900 flex items-center justify-center text-white/50">
            <Sparkles className="w-16 h-16 animate-pulse" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Healthy vs Unhealthy Pill */}
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg backdrop-blur-md ${
              result.isHealthy
                ? 'bg-emerald-500/90 text-white shadow-emerald-500/30'
                : result.healthRating === 'unhealthy'
                ? 'bg-rose-500/90 text-white shadow-rose-500/30'
                : 'bg-amber-500/90 text-slate-950 shadow-amber-500/30'
            }`}
          >
            {result.isHealthy ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>
              {result.isHealthy
                ? 'Healthy Choice'
                : result.healthRating === 'unhealthy'
                ? 'Less Healthy / Processed'
                : 'Moderate Intake'}
            </span>
          </div>

          {/* AI Confidence Badge */}
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-emerald-300 text-xs font-extrabold rounded-full border border-emerald-500/30">
            {Math.round(result.confidence * 100)}% Match
          </span>
        </div>

        {/* Bottom Food Title Header */}
        <div className="absolute bottom-4 left-6 right-6 text-white">
          <h2 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight">
            {result.foodName}
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Portion: {result.portionEstimate}
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 space-y-6">
        {/* Healthy Reasoning & AI Nutritionist Guidance */}
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm ${
            result.isHealthy
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-start space-x-2.5">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold font-outfit uppercase tracking-wider text-[11px] mb-1">
                AI Health Analysis
              </h4>
              <p className="font-medium leading-relaxed">{result.healthReasoning}</p>
            </div>
          </div>
        </div>

        {/* Dietary Tags */}
        {result.dietaryTags && result.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.dietaryTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Serving Size Scaler & Meal Type Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          {/* Serving Quantity Multiplier */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Serving Multiplier</span>
            </label>
            <div className="flex items-center space-x-2">
              {[0.5, 1, 1.5, 2].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setServingCount(val)}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                    servingCount === val
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {val}x
                </button>
              ))}
            </div>
          </div>

          {/* Meal Category */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Log Meal Category
            </label>
            <select
              value={mealType}
              onChange={(e: any) => setMealType(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        {/* Dynamic Macros Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-600 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Calories</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-outfit">{scaledCalories}</div>
            <div className="text-[10px] text-slate-400 font-semibold">kcal</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200 text-center">
            <div className="flex items-center justify-center space-x-1 text-sky-600 mb-1">
              <PieChart className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Protein</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-outfit">{scaledProtein}g</div>
            <div className="text-[10px] text-slate-400 font-semibold">grams</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-600 mb-1">
              <PieChart className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Carbs</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-outfit">{scaledCarbs}g</div>
            <div className="text-[10px] text-slate-400 font-semibold">grams</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-center">
            <div className="flex items-center justify-center space-x-1 text-rose-600 mb-1">
              <PieChart className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Fat</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-outfit">{scaledFat}g</div>
            <div className="text-[10px] text-slate-400 font-semibold">grams</div>
          </div>
        </div>

        {/* Nutritionist Recommendations */}
        {result.healthTips && result.healthTips.length > 0 && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nutrition Tips for this Meal</span>
            </h5>
            <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc font-medium">
              {result.healthTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
          >
            Scan Another Meal
          </button>

          <button
            onClick={handleAddToLog}
            disabled={isLogging || isLogged}
            className={`w-full sm:flex-1 py-3.5 font-bold rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 ${
              isLogged
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            {isLogging ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isLogged ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Logged into Nutrition Journal</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Daily Food Log ({scaledCalories} kcal)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
