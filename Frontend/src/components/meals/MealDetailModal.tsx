import React from 'react';
import { X, Flame, Zap, ShieldAlert, Utensils, Clock, CheckCircle2 } from 'lucide-react';
import { Meal } from '../../types/meal.types';

interface MealDetailModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, isOpen, onClose }) => {
  if (!isOpen || !meal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {meal.mealType}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200">
                {meal.dietaryPreference}
              </span>
            </div>
            <h2 className="text-xl font-bold font-outfit mt-1">{meal.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Macro Badges Grid */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <div>
              <div className="text-xs text-slate-500 font-medium flex items-center justify-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Calories</span>
              </div>
              <div className="text-lg font-black text-slate-900 mt-1">{meal.calories} kcal</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium flex items-center justify-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span>Protein</span>
              </div>
              <div className="text-lg font-black text-purple-700 mt-1">{meal.protein}g</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Carbs</div>
              <div className="text-lg font-black text-amber-600 mt-1">{meal.carbohydrates}g</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Fat</div>
              <div className="text-lg font-black text-emerald-600 mt-1">{meal.fat}g</div>
            </div>
          </div>

          {/* Allergens Warning Banner */}
          {meal.allergens && meal.allergens.length > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center space-x-2 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Allergen Notice:</strong> Contains {meal.allergens.join(', ')}
              </span>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Allergen Safe:</strong> Free of major common allergens.
              </span>
            </div>
          )}

          {/* Ingredients List */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Ingredients List</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {meal.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparation Instructions */}
          {meal.instructions && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Preparation Instructions</span>
              </h3>
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs text-slate-700 leading-relaxed font-sans">
                {meal.instructions}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
