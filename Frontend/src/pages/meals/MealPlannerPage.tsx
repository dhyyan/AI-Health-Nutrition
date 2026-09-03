import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, RefreshCw, Sparkles, User, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useMealPlanner } from '../../hooks/useMealPlanner';
import { WeeklyPlanSchedule } from '../../components/meals/WeeklyPlanSchedule';
import { DailyMealCard } from '../../components/meals/DailyMealCard';

export const MealPlannerPage: React.FC = () => {
  const {
    mealPlan,
    selectedDay,
    setSelectedDay,
    loading,
    error,
    swappingSlot,
    handleGenerateFreshPlan,
    handleSwapSlot,
  } = useMealPlanner();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-medium">Generating your personalized 7-Day meal schedule...</p>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 max-w-md mx-auto">
          {error || 'Unable to load meal plan. Please check your connection.'}
        </div>
        <button
          onClick={handleGenerateFreshPlan}
          className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate Plan</span>
        </button>
      </div>
    );
  }

  const currentDaySchedule =
    mealPlan.weeklySchedule.find((d) => d.day === selectedDay) || mealPlan.weeklySchedule[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1 rounded-full text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personalized 7-Day Diet Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
              Weekly Meal Planner
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-2xl">
              Goal: <strong className="text-white capitalize">{mealPlan.goal.replace('_', ' ')}</strong> • Diet:{' '}
              <strong className="text-white">{mealPlan.dietaryPreference}</strong>
              {mealPlan.excludedAllergies.length > 0 && (
                <span>
                  {' '}
                  • Excluded Allergies:{' '}
                  <span className="text-amber-300 font-semibold">
                    {mealPlan.excludedAllergies.join(', ')}
                  </span>
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/profile"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Edit Goal / Allergies</span>
            </Link>

            <button
              onClick={handleGenerateFreshPlan}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Fresh Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Navigation Schedule Header */}
      <WeeklyPlanSchedule
        schedule={mealPlan.weeklySchedule}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {/* Daily 4 Meal Slots Component */}
      {currentDaySchedule && (
        <DailyMealCard
          dayName={currentDaySchedule.day}
          mealsSlot={currentDaySchedule.meals}
          onSwapSlot={handleSwapSlot}
          isSwappingSlot={swappingSlot}
        />
      )}
    </div>
  );
};

export default MealPlannerPage;
