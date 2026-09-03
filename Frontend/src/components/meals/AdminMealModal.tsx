import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Meal, CreateMealDTO, MealType, DietaryPreference } from '../../types/meal.types';
import { HealthGoal } from '../../types/recommendation.types';

interface AdminMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateMealDTO) => void;
  editingMeal: Meal | null;
}

export const AdminMealModal: React.FC<AdminMealModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMeal,
}) => {
  const [formData, setFormData] = useState<CreateMealDTO>({
    name: '',
    mealType: 'breakfast',
    category: 'Balanced Healthy',
    dietaryPreference: 'Non-Vegetarian',
    suitableGoals: ['weight_loss', 'maintenance'],
    allergens: [],
    calories: 400,
    protein: 25,
    carbohydrates: 45,
    fat: 12,
    fiber: 5,
    servingSize: 250,
    servingUnit: 'g',
    ingredients: ['Fresh Ingredients'],
    instructions: '',
  });

  const availableGoals: Array<{ id: HealthGoal; label: string }> = [
    { id: 'weight_loss', label: 'Weight Loss' },
    { id: 'weight_gain', label: 'Weight Gain' },
    { id: 'muscle_gain', label: 'Muscle Gain' },
    { id: 'maintenance', label: 'Maintenance' },
  ];

  const availableAllergens = ['Dairy', 'Nuts', 'Gluten', 'Seafood', 'Eggs', 'Soy', 'Peanuts', 'Sesame'];

  useEffect(() => {
    if (editingMeal) {
      setFormData({
        name: editingMeal.name,
        mealType: editingMeal.mealType,
        category: editingMeal.category,
        dietaryPreference: editingMeal.dietaryPreference,
        suitableGoals: editingMeal.suitableGoals || [],
        allergens: editingMeal.allergens || [],
        calories: editingMeal.calories,
        protein: editingMeal.protein,
        carbohydrates: editingMeal.carbohydrates,
        fat: editingMeal.fat,
        fiber: editingMeal.fiber || 0,
        servingSize: editingMeal.servingSize || 100,
        servingUnit: editingMeal.servingUnit || 'g',
        ingredients: editingMeal.ingredients || [],
        instructions: editingMeal.instructions || '',
      });
    } else {
      setFormData({
        name: '',
        mealType: 'breakfast',
        category: 'Balanced Healthy',
        dietaryPreference: 'Non-Vegetarian',
        suitableGoals: ['weight_loss', 'maintenance'],
        allergens: [],
        calories: 400,
        protein: 25,
        carbohydrates: 45,
        fat: 12,
        fiber: 5,
        servingSize: 250,
        servingUnit: 'g',
        ingredients: ['Fresh Ingredients'],
        instructions: '',
      });
    }
  }, [editingMeal, isOpen]);

  if (!isOpen) return null;

  const toggleGoal = (goal: HealthGoal) => {
    setFormData((prev) => {
      const exists = prev.suitableGoals.includes(goal);
      const updated = exists
        ? prev.suitableGoals.filter((g) => g !== goal)
        : [...prev.suitableGoals, goal];
      return { ...prev, suitableGoals: updated };
    });
  };

  const toggleAllergen = (allergen: string) => {
    setFormData((prev) => {
      const current = prev.allergens || [];
      const exists = current.includes(allergen);
      const updated = exists ? current.filter((a) => a !== allergen) : [...current, allergen];
      return { ...prev, allergens: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a meal name.');
      return;
    }
    if (formData.suitableGoals.length === 0) {
      alert('Please select at least one suitable health goal.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold font-outfit text-white">
            {editingMeal ? 'Edit Master Meal Entry' : 'Create New Master Meal Entry'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Meal Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Herb Roasted Chicken & Quinoa"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Category Tag</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. High Protein, Low Calorie"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Slot Type & Dietary Preference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Meal Slot Type *</label>
              <select
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value as MealType })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Dietary Preference *</label>
              <select
                value={formData.dietaryPreference}
                onChange={(e) =>
                  setFormData({ ...formData, dietaryPreference: e.target.value as DietaryPreference })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Keto">Keto</option>
              </select>
            </div>
          </div>

          {/* Macros Grid */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Nutritional Breakdown (per serving)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Protein (g)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-purple-400 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Carbs (g)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.carbohydrates}
                  onChange={(e) => setFormData({ ...formData, carbohydrates: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Fat (g)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Suitable Health Goals Selection */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">
              Suitable Target Health Goals *
            </label>
            <div className="flex flex-wrap gap-2">
              {availableGoals.map((g) => {
                const active = formData.suitableGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGoal(g.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergen Tags */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">
              Contains Allergens (Check all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAllergens.map((a) => {
                const active = (formData.allergens || []).includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergen(a)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      active
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {active ? '⚠️ ' : ''}
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Ingredients (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.ingredients.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="e.g. Chicken Breast, Quinoa, Olive Oil, Asparagus"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Preparation Instructions</label>
            <textarea
              rows={2}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g. Grill chicken breast for 6 mins per side..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-90 transition flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingMeal ? 'Update Meal' : 'Create Meal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
