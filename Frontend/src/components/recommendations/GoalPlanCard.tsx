import React from 'react';
import { Flame, Dumbbell, ShieldAlert, CheckCircle2, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { GoalPlan } from '../../types/recommendation.types';

interface GoalPlanCardProps {
  plan: GoalPlan;
}

export const GoalPlanCard: React.FC<GoalPlanCardProps> = ({ plan }) => {
  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss':
        return {
          bg: 'from-amber-500/10 to-orange-500/10',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: TrendingDown,
          iconBg: 'bg-amber-500 text-white',
        };
      case 'weight_gain':
        return {
          bg: 'from-emerald-500/10 to-teal-500/10',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: TrendingUp,
          iconBg: 'bg-emerald-500 text-white',
        };
      case 'muscle_gain':
        return {
          bg: 'from-purple-500/10 to-indigo-500/10',
          border: 'border-purple-200',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Dumbbell,
          iconBg: 'bg-purple-600 text-white',
        };
      default:
        return {
          bg: 'from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Target,
          iconBg: 'bg-blue-600 text-white',
        };
    }
  };

  const style = getGoalColor(plan.goal);
  const GoalIcon = style.icon;

  return (
    <div className={`bg-white rounded-3xl border ${style.border} shadow-sm overflow-hidden space-y-2`}>
      {/* Header Banner */}
      <div className={`bg-gradient-to-r ${style.bg} p-8 border-b ${style.border} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className="flex items-start space-x-4">
          <div className={`p-4 rounded-2xl ${style.iconBg} shadow-md`}>
            <GoalIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">{plan.title}</h2>
              <span className={`text-xs sm:text-sm px-3.5 py-1 rounded-full font-extrabold border uppercase tracking-wider ${style.badge}`}>
                {plan.goal.replace('_', ' ')}
              </span>
            </div>
            <p className="text-base sm:text-lg text-slate-600 mt-1.5 max-w-3xl leading-relaxed">{plan.description}</p>
          </div>
        </div>
      </div>

      {/* Target Macro Targets Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 p-6 sm:p-8 bg-slate-50/80 border-b border-slate-100">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
            <Flame className="w-5 h-5 text-orange-500" />
            <span>Target Energy</span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-outfit">
            {plan.targetCalories} <span className="text-sm font-semibold text-slate-500">kcal/day</span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
            <Zap className="w-5 h-5 text-purple-500" />
            <span>Target Protein</span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-700 font-outfit">
            {plan.targetProtein} <span className="text-sm font-semibold text-slate-500">g/day</span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
            <span>Target Carbs</span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-600 font-outfit">
            {plan.targetCarbs} <span className="text-sm font-semibold text-slate-500">g/day</span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
            <span>Target Fats</span>
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 font-outfit">
            {plan.targetFat} <span className="text-sm font-semibold text-slate-500">g/day</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Foods */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Recommended Priority Foods</span>
          </h3>
          <div className="space-y-4">
            {plan.recommendedFoods.map((food, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/50 transition-colors flex items-start justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="font-extrabold text-base sm:text-lg text-slate-900">{food.name}</div>
                  <div className="text-sm text-slate-600">{food.description}</div>
                  <div className="text-xs sm:text-sm text-emerald-700 font-bold mt-2">
                    💡 Reason: {food.reason}
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <span className="text-xs sm:text-sm font-extrabold bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 shadow-xs inline-block">
                    {food.calories} kcal
                  </span>
                  <div className="text-xs sm:text-sm font-extrabold text-purple-700">
                    {food.protein}g protein
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid Foods & Activity Guidance */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <span>Foods to Limit or Avoid</span>
            </h3>
            <ul className="space-y-3">
              {plan.avoidFoods.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-3 text-sm sm:text-base font-semibold text-slate-800 bg-rose-50/60 border border-rose-200/90 p-4 rounded-2xl"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-3 mb-4">
              <Dumbbell className="w-6 h-6 text-indigo-600" />
              <span>Goal-Aligned Physical Activity</span>
            </h3>
            <ul className="space-y-3">
              {plan.activityAdvice.map((advice, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-3 text-sm sm:text-base font-semibold text-slate-800 bg-indigo-50/50 border border-indigo-200/90 p-4 rounded-2xl"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
