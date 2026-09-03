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
  ShieldAlert,
  Database,
  Target,
  Repeat,
  HeartPulse,
  BookOpen,
} from 'lucide-react';

interface ScannerResultCardProps {
  result: ScanResultData;
  onReset: () => void;
}

export const ScannerResultCard: React.FC<ScannerResultCardProps> = ({ result, onReset }) => {
  const { addNotification } = useNotifications();

  const [servingCount, setServingCount] = useState<number>(
    result.portionAdvice?.recommendedServingMultiplier || result.servingSize || 1
  );
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

  const suitability = result.suitability;
  const profileMatching = result.profileMatching;
  const nutritionLookup = result.nutritionLookup;
  const portionAdvice = result.portionAdvice;
  const healthierAlternatives = result.healthierAlternatives;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-300 space-y-0">
      {/* ---------------------------------------------------- */}
      {/* STEP 1: Food Recognition (Banner Header) */}
      {/* ---------------------------------------------------- */}
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
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
          {/* STEP 4: Food Suitability Pill */}
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg backdrop-blur-md ${
              suitability?.rating === 'highly_suitable' || result.isHealthy
                ? 'bg-emerald-500/90 text-white shadow-emerald-500/30'
                : suitability?.rating === 'unsuitable'
                ? 'bg-rose-600/90 text-white shadow-rose-600/30'
                : 'bg-amber-500/90 text-slate-950 shadow-amber-500/30'
            }`}
          >
            {suitability?.rating === 'unsuitable' || result.healthRating === 'unhealthy' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>
              {suitability?.rating === 'highly_suitable'
                ? 'Highly Suitable'
                : suitability?.rating === 'unsuitable'
                ? 'Unsuitable / Caution'
                : 'Moderate Suitability'}
            </span>
          </div>

          {/* STEP 2: Nutrition Lookup Badge */}
          <div className="flex items-center space-x-2">
            {nutritionLookup?.verifiedMatch ? (
              <span className="px-3 py-1 bg-emerald-900/80 backdrop-blur-md text-emerald-300 text-[11px] font-extrabold rounded-full border border-emerald-500/40 flex items-center space-x-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Verified DB Lookup</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-800/80 backdrop-blur-md text-slate-300 text-[11px] font-semibold rounded-full border border-slate-700">
                AI Vision Estimation
              </span>
            )}

            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-emerald-300 text-xs font-extrabold rounded-full border border-emerald-500/30">
              {Math.round(result.confidence * 100)}% Match
            </span>
          </div>
        </div>

        {/* Bottom Food Title Header */}
        <div className="absolute bottom-4 left-6 right-6 text-white">
          <h2 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight">
            {result.foodName}
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Portion Estimate: {result.portionEstimate}
          </p>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 space-y-6">
        {/* ---------------------------------------------------- */}
        {/* STEP 4: ALLERGEN & MEDICAL ALERTS (If applicable) */}
        {/* ---------------------------------------------------- */}
        {suitability?.hasAllergenAlert && (
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-900 flex items-start space-x-3 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-700">
                Allergen Warning Detected
              </h4>
              <ul className="text-xs font-bold space-y-1">
                {suitability.allergenAlerts.map((alert, idx) => (
                  <li key={idx}>• {alert}</li>
                ))}
              </ul>
              <p className="text-[11px] text-rose-600 font-medium">
                Matched against your saved profile allergies ({profileMatching?.userAllergies.join(', ')}).
              </p>
            </div>
          </div>
        )}

        {suitability?.medicalAlerts && suitability.medicalAlerts.length > 0 && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex items-start space-x-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-700">
                Health Condition Alert
              </span>
              <ul className="list-disc pl-4 font-medium space-y-0.5 mt-0.5">
                {suitability.medicalAlerts.map((med, idx) => (
                  <li key={idx}>{med}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 3: USER PROFILE MATCHING & SUITABILITY SCORE */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Profile Match Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target Goal Match</span>
            </div>
            <div className="text-sm font-extrabold text-slate-800 capitalize">
              {profileMatching?.goal.replace('_', ' ') || 'Maintenance'}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Target: ~{profileMatching?.dailyCalorieTarget || 2000} kcal/day
            </div>
          </div>

          {/* Suitability Score */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span>Suitability Score</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-slate-900 font-outfit">
                {suitability?.score || 85}
              </span>
              <span className="text-xs text-slate-400 font-bold">/ 100</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate">
              {suitability?.reasoning}
            </div>
          </div>

          {/* Allergen Check Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-sky-600" />
              <span>Allergy Filter</span>
            </div>
            <div
              className={`text-xs font-bold ${
                suitability?.hasAllergenAlert ? 'text-rose-600 font-extrabold' : 'text-emerald-700'
              }`}
            >
              {suitability?.hasAllergenAlert ? 'Trigger Detected' : 'Safe — No Allergens Flagged'}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Profile: {profileMatching?.userAllergies?.length ? profileMatching.userAllergies.join(', ') : 'None listed'}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* STEP 7: RECOMMENDATION GENERATION (AI Summary) */}
        {/* ---------------------------------------------------- */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold font-outfit uppercase tracking-wider text-xs">
              AI Nutrition Engine Recommendation
            </h4>
          </div>
          <p className="text-xs font-medium leading-relaxed">
            {result.recommendationSummary || result.healthReasoning}
          </p>
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

        {/* ---------------------------------------------------- */}
        {/* STEP 6: PORTION ADVICE & SERVING ADJUSTER */}
        {/* ---------------------------------------------------- */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Portion Advice & Serving Multiplier</span>
            </h4>

            {portionAdvice?.recommendedServingMultiplier && portionAdvice.recommendedServingMultiplier !== 1 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-300">
                Recommended: {portionAdvice.recommendedServingMultiplier}x
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 font-medium">
            {portionAdvice?.servingAdviceText || 'Adjust serving count below to calculate accurate daily intake.'}
          </p>

          {/* Multiplier buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Serving Quantity
              </label>
              <div className="flex items-center space-x-2">
                {[0.5, 0.7, 1, 1.5, 2].map((val) => (
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

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
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

          {/* Visual Hand Portion Guide Breakdown */}
          {portionAdvice?.handVisualGuide && (
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Standard Hand-Portion Reference Guide
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white border border-slate-200 font-medium">
                  <span className="font-bold text-slate-800 block">✋ Protein</span>
                  <span className="text-slate-500 text-[10px]">
                    {portionAdvice.handVisualGuide.protein}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 font-medium">
                  <span className="font-bold text-slate-800 block">✊ Veggies</span>
                  <span className="text-slate-500 text-[10px]">
                    {portionAdvice.handVisualGuide.veggies}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 font-medium">
                  <span className="font-bold text-slate-800 block">🤲 Carbs</span>
                  <span className="text-slate-500 text-[10px]">
                    {portionAdvice.handVisualGuide.carbs}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 font-medium">
                  <span className="font-bold text-slate-800 block">👍 Healthy Fats</span>
                  <span className="text-slate-500 text-[10px]">
                    {portionAdvice.handVisualGuide.fats}
                  </span>
                </div>
              </div>
            </div>
          )}
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

        {/* ---------------------------------------------------- */}
        {/* STEP 5: HEALTHIER ALTERNATIVES (Interactive Suggestion Cards) */}
        {/* ---------------------------------------------------- */}
        {healthierAlternatives && healthierAlternatives.length > 0 && (
          <div className="p-5 bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 rounded-3xl text-white shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Repeat className="w-4 h-4" />
              <h4 className="font-extrabold font-outfit uppercase tracking-wider text-xs">
                Suggested Healthier Food Alternative
              </h4>
            </div>

            {healthierAlternatives.map((alt, idx) => (
              <div key={idx} className="p-4 bg-white/10 rounded-2xl border border-white/15 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300 block">
                      Recommended Swap
                    </span>
                    <h5 className="text-base font-black font-outfit">{alt.alternativeFood.name}</h5>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                      Save {alt.calorieSavings} kcal
                    </span>
                    {alt.proteinDifference > 0 && (
                      <span className="px-3 py-1 rounded-full bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-400/30">
                        +{alt.proteinDifference}g Protein
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
                  {alt.reason}
                </p>

                <div className="text-[11px] text-emerald-300/80 font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{alt.healthBenefit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nutrition Tips */}
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

        {/* Medical Safety Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center space-x-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {result.disclaimer ||
                'This application provides general health and nutrition information for educational purposes and is not a substitute for professional medical advice.'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

