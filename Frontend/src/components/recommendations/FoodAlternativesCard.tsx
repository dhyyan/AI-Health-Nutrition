import React, { useState } from 'react';
import { ArrowRight, Search, Sparkles, ShieldCheck, Flame, Zap, Check } from 'lucide-react';
import { FoodAlternativeComparison } from '../../types/recommendation.types';

interface FoodAlternativesCardProps {
  alternatives: FoodAlternativeComparison[];
  onSearchAlternative: (query: string) => void;
  loading?: boolean;
}

export const FoodAlternativesCard: React.FC<FoodAlternativesCardProps> = ({
  alternatives,
  onSearchAlternative,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const quickPresets = [
    'Potato Chips',
    'Sugary Soda',
    'Deep Fried Chicken',
    'French Fries',
    'Refined White Bread',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchAlternative(searchQuery.trim());
    }
  };

  const handlePresetClick = (preset: string) => {
    setSearchQuery(preset);
    onSearchAlternative(preset);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-3">
            <Sparkles className="w-7 h-7 text-emerald-600" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
              Healthier Food Alternatives Engine
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 font-medium">
            Discover wholesome, goal-aligned food swaps that reduce calories, sugars, and trans fats.
          </p>
        </div>
      </div>

      {/* Interactive Search Bar & Presets */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or type any logged/scanned food (e.g. Potato Chips, Cola, White Bread)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-extrabold transition-colors disabled:opacity-50 shadow-md"
          >
            {loading ? 'Analyzing...' : 'Find Alternative'}
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pt-1 pb-1 text-xs sm:text-sm">
          <span className="text-slate-500 font-bold shrink-0">Try Presets:</span>
          {quickPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold transition-colors border border-slate-200/80 shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Alternatives Display */}
      {alternatives.length > 0 ? (
        <div className="space-y-6">
          {alternatives.map((item, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50/90 to-white shadow-xs space-y-6"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">Recommendation Swap</span>
                </div>
                <div className="flex items-center space-x-3">
                  {item.calorieSavings > 0 && (
                    <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1.5">
                      <Flame className="w-4 h-4 text-emerald-600" />
                      <span>Saves {item.calorieSavings} kcal</span>
                    </span>
                  )}
                  {item.proteinDifference > 0 && (
                    <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-purple-100 text-purple-900 border border-purple-300 flex items-center space-x-1.5">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span>+{item.proteinDifference}g Protein</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Original vs Alternative Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative">
                {/* Original Food (Unhealthy) */}
                <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-700">
                      Original Selection
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-rose-600">
                      {item.originalFood.servingSize} {item.originalFood.servingUnit}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900">
                    {item.originalFood.name}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center pt-2">
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Calories</div>
                      <div className="text-sm sm:text-base font-black text-slate-800">
                        {item.originalFood.calories}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Protein</div>
                      <div className="text-sm sm:text-base font-black text-purple-700">
                        {item.originalFood.protein}g
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Carbs</div>
                      <div className="text-sm sm:text-base font-black text-amber-700">
                        {item.originalFood.carbohydrates}g
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Fat</div>
                      <div className="text-sm sm:text-base font-black text-rose-700">
                        {item.originalFood.fat}g
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Alternative (Healthy) */}
                <div className="p-6 rounded-2xl border border-emerald-300 bg-emerald-50/70 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Better Alternative</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-700">
                      {item.alternativeFood.servingSize} {item.alternativeFood.servingUnit}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-emerald-950">
                    {item.alternativeFood.name}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center pt-2">
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Calories</div>
                      <div className="text-sm sm:text-base font-black text-emerald-700">
                        {item.alternativeFood.calories}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Protein</div>
                      <div className="text-sm sm:text-base font-black text-purple-700">
                        {item.alternativeFood.protein}g
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Carbs</div>
                      <div className="text-sm sm:text-base font-black text-amber-700">
                        {item.alternativeFood.carbohydrates}g
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                      <div className="text-xs text-slate-500 font-semibold">Fat</div>
                      <div className="text-sm sm:text-base font-black text-emerald-700">
                        {item.alternativeFood.fat}g
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rationale & Health Benefit */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-sm sm:text-base space-y-2">
                <div className="text-slate-800 font-bold">
                  💡 <span className="text-slate-900 font-extrabold">Why swap?</span> {item.reason}
                </div>
                <div className="text-emerald-800 font-bold">
                  🌱 <span className="text-emerald-950 font-extrabold">Health Benefit:</span> {item.healthBenefit}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-base font-medium">
          No alternatives found. Try searching for a food item above!
        </div>
      )}
    </div>
  );
};
