import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, ShieldCheck, UtensilsCrossed, Flame, Zap } from 'lucide-react';
import { useAdminMeals } from '../../hooks/useAdminMeals';
import { AdminMealModal } from '../../components/meals/AdminMealModal';
import { MealType, DietaryPreference } from '../../types/meal.types';

export const AdminMealsPage: React.FC = () => {
  const {
    meals,
    loading,
    error,
    filters,
    setFilters,
    isModalOpen,
    setIsModalOpen,
    editingMeal,
    openCreateModal,
    openEditModal,
    handleCreateMeal,
    handleUpdateMeal,
    handleDeleteMeal,
  } = useAdminMeals();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-outfit text-white">Master Meal Database</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage verified meal options, macros, dietary preferences, and allergen tags.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-90 transition flex items-center space-x-2 shrink-0 shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Master Meal</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search meal name or ingredient..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2">
          <select
            value={filters.mealType || ''}
            onChange={(e) => setFilters({ ...filters, mealType: (e.target.value as MealType) || undefined })}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Meal Slots</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>

          <select
            value={filters.dietaryPreference || ''}
            onChange={(e) =>
              setFilters({ ...filters, dietaryPreference: (e.target.value as DietaryPreference) || undefined })
            }
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Diet Types</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Keto">Keto</option>
          </select>
        </div>
      </div>

      {/* Table of Meals */}
      {loading ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading master meals from database...</p>
        </div>
      ) : meals.length > 0 ? (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Meal Name</th>
                  <th className="p-4">Slot</th>
                  <th className="p-4">Diet</th>
                  <th className="p-4">Macros</th>
                  <th className="p-4">Goals</th>
                  <th className="p-4">Allergens</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{meal.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{meal.category}</div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {meal.mealType}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-xs font-semibold text-slate-300">{meal.dietaryPreference}</span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <div className="text-orange-400 font-bold">{meal.calories} kcal</div>
                        <div className="text-purple-400">{meal.protein}g P • {meal.carbohydrates}g C • {meal.fat}g F</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(meal.suitableGoals || []).map((g) => (
                          <span key={g} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {g.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      {meal.allergens && meal.allergens.length > 0 ? (
                        <span className="text-rose-400 text-[11px] font-medium">{meal.allergens.join(', ')}</span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">None</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(meal)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Edit Meal"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(meal.id!)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          title="Delete Meal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
          No meals found matching your filters. Click "Add New Master Meal" above to create one!
        </div>
      )}

      {/* Admin Meal Modal Form */}
      <AdminMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (editingMeal && editingMeal.id) {
            handleUpdateMeal(editingMeal.id, data);
          } else {
            handleCreateMeal(data);
          }
        }}
        editingMeal={editingMeal}
      />
    </div>
  );
};

export default AdminMealsPage;
