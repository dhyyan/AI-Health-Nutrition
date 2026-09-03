import React, { useState } from 'react';
import { RefreshCw, Eye, Flame, Zap, Coffee, Sun, Moon, Cookie, ShieldAlert } from 'lucide-react';
import { DailyMealSlot, Meal, MealType } from '../../types/meal.types';
import { MealDetailModal } from './MealDetailModal';

interface DailyMealCardProps {
  dayName: string;
  mealsSlot: DailyMealSlot;
  onSwapSlot: (day: string, slotType: MealType) => void;
  isSwappingSlot?: string | null;
}

export const DailyMealCard: React.FC<DailyMealCardProps> = ({
  dayName,
  mealsSlot,
  onSwapSlot,
  isSwappingSlot,
}) => {
  const [activeDetailMeal, setActiveDetailMeal] = useState<Meal | null>(null);

  const slotItems: Array<{
    type: MealType;
    label: string;
    icon: any;
    color: string;
    meal: Meal;
  }> = [
    {
      type: 'breakfast',
      label: 'Breakfast Plan',
      icon: Coffee,
      color: 'bg-amber-500 text-white',
      meal: mealsSlot.breakfast,
    },
    {
      type: 'lunch',
      label: 'Lunch Plan',
      icon: Sun,
      color: 'bg-orange-500 text-white',
      meal: mealsSlot.lunch,
    },
    {
      type: 'dinner',
      label: 'Dinner Plan',
      icon: Moon,
      color: 'bg-indigo-600 text-white',
      meal: mealsSlot.dinner,
    },
    {
      type: 'snack',
      label: 'Snack Suggestion',
      icon: Cookie,
      color: 'bg-purple-600 text-white',
      meal: mealsSlot.snack,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Meal Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slotItems.map((slot) => {
          const SlotIcon = slot.icon;
          const isThisSwapping = isSwappingSlot === `${dayName}-${slot.type}`;

          return (
            <div
              key={slot.type}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Header Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl ${slot.color} shadow-xs`}>
                    <SlotIcon className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 font-outfit uppercase tracking-wider">
                    {slot.label}
                  </span>
                </div>
                <span className="text-xs font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
                  {slot.meal.category}
                </span>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {slot.meal.name}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900 flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{slot.meal.calories} kcal</span>
                    </span>
                  </div>
                </div>

                {/* Macro Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>{slot.meal.protein}g Protein</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                    {slot.meal.carbohydrates}g Carbs
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {slot.meal.fat}g Fat
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {slot.meal.dietaryPreference}
                  </span>
                </div>

                {/* Allergens warning badge */}
                {slot.meal.allergens && slot.meal.allergens.length > 0 && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg inline-flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    <span>Contains: {slot.meal.allergens.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveDetailMeal(slot.meal)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Recipe Details</span>
                </button>

                <button
                  onClick={() => onSwapSlot(dayName, slot.type)}
                  disabled={!!isThisSwapping}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isThisSwapping ? 'animate-spin' : ''}`} />
                  <span>{isThisSwapping ? 'Swapping...' : 'Swap Option'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Detail Modal */}
      <MealDetailModal
        meal={activeDetailMeal}
        isOpen={!!activeDetailMeal}
        onClose={() => setActiveDetailMeal(null)}
      />
    </div>
  );
};
