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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              Healthier Food Alternatives Engine
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Discover wholesome, goal-aligned food swaps that reduce calories, sugars, and trans fats.
          </p>
        </div>
      </div>

      {/* Interactive Search Bar & Presets */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or type any logged/scanned food (e.g. Potato Chips, Cola, White Bread)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Find Alternative'}
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-1 pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Try Presets:</span>
          {quickPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors border border-slate-200 shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Alternatives Display */}
      {alternatives.length > 0 ? (
        <div className="space-y-4">
          {alternatives.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-white shadow-2xs space-y-4"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">Recommendation Swap</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.calorieSavings > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saves {item.calorieSavings} kcal</span>
                    </span>
                  )}
                  {item.proteinDifference > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-purple-600" />
                      <span>+{item.proteinDifference}g Protein</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Original vs Alternative Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative">
                {/* Original Food (Unhealthy) */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      Original Selection
                    </span>
                    <span className="text-xs font-semibold text-rose-600">
                      {item.originalFood.servingSize} {item.originalFood.servingUnit}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {item.originalFood.name}
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center pt-2">
                    <div className="bg-white p-2 rounded-lg border border-rose-100">
                      <div className="text-[10px] text-slate-400 font-medium">Calories</div>
                      <div className="text-xs font-extrabold text-slate-800">
                        {item.originalFood.calories}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-rose-100">
                      <div className="text-[10px] text-slate-400 font-medium">Protein</div>
                      <div className="text-xs font-extrabold text-purple-700">
                        {item.originalFood.protein}g
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-rose-100">
                      <div className="text-[10px] text-slate-400 font-medium">Carbs</div>
                      <div className="text-xs font-extrabold text-amber-700">
                        {item.originalFood.carbohydrates}g
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-rose-100">
                      <div className="text-[10px] text-slate-400 font-medium">Fat</div>
                      <div className="text-xs font-extrabold text-rose-700">
                        {item.originalFood.fat}g
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Alternative (Healthy) */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Better Alternative</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {item.alternativeFood.servingSize} {item.alternativeFood.servingUnit}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-emerald-950">
                    {item.alternativeFood.name}
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center pt-2">
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <div className="text-[10px] text-slate-400 font-medium">Calories</div>
                      <div className="text-xs font-extrabold text-emerald-700">
                        {item.alternativeFood.calories}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <div className="text-[10px] text-slate-400 font-medium">Protein</div>
                      <div className="text-xs font-extrabold text-purple-700">
                        {item.alternativeFood.protein}g
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <div className="text-[10px] text-slate-400 font-medium">Carbs</div>
                      <div className="text-xs font-extrabold text-amber-700">
                        {item.alternativeFood.carbohydrates}g
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <div className="text-[10px] text-slate-400 font-medium">Fat</div>
                      <div className="text-xs font-extrabold text-emerald-700">
                        {item.alternativeFood.fat}g
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rationale & Health Benefit */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="text-slate-800 font-semibold">
                  💡 <span className="text-slate-900">Why swap?</span> {item.reason}
                </div>
                <div className="text-emerald-700 font-semibold">
                  🌱 <span className="text-emerald-900">Health Benefit:</span> {item.healthBenefit}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm">
          No alternatives found. Try searching for a food item above!
        </div>
      )}
    </div>
  );
};
