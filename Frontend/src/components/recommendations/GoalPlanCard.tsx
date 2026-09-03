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
    <div className={`bg-white rounded-2xl border ${style.border} shadow-sm overflow-hidden`}>
      {/* Header Banner */}
      <div className={`bg-gradient-to-r ${style.bg} p-6 border-b ${style.border} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-start space-x-3.5">
          <div className={`p-3 rounded-2xl ${style.iconBg} shadow-md`}>
            <GoalIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900 font-outfit">{plan.title}</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${style.badge}`}>
                {plan.goal.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{plan.description}</p>
          </div>
        </div>
      </div>

      {/* Target Macro Targets Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-50/80 border-b border-slate-100">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Target Energy</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            {plan.targetCalories} <span className="text-xs font-normal text-slate-500">kcal/day</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Zap className="w-4 h-4 text-purple-500" />
            <span>Target Protein</span>
          </div>
          <div className="text-xl font-extrabold text-purple-700 mt-1">
            {plan.targetProtein} <span className="text-xs font-normal text-slate-500">g/day</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Target Carbs</span>
          </div>
          <div className="text-xl font-extrabold text-amber-600 mt-1">
            {plan.targetCarbs} <span className="text-xs font-normal text-slate-500">g/day</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Target Fats</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">
            {plan.targetFat} <span className="text-xs font-normal text-slate-500">g/day</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Foods */}
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Recommended Priority Foods</span>
          </h3>
          <div className="space-y-3">
            {plan.recommendedFoods.map((food, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/40 transition-colors flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-900">{food.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{food.description}</div>
                  <div className="text-xs text-emerald-700 font-medium mt-1">
                    💡 Reason: {food.reason}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                    {food.calories} kcal
                  </span>
                  <div className="text-[11px] font-semibold text-purple-600 mt-1">
                    {food.protein}g protein
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid Foods & Activity Guidance */}
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Foods to Limit or Avoid</span>
            </h3>
            <ul className="space-y-2">
              {plan.avoidFoods.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-2.5 text-xs text-slate-700 bg-rose-50/50 border border-rose-100 p-2.5 rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 mb-3">
              <Dumbbell className="w-5 h-5 text-indigo-600" />
              <span>Goal-Aligned Physical Activity</span>
            </h3>
            <ul className="space-y-2">
              {plan.activityAdvice.map((advice, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-2.5 text-xs text-slate-700 bg-indigo-50/40 border border-indigo-100 p-2.5 rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
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
