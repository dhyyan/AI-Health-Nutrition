import React from 'react';
import { PieChart, Hand, Scale, Lightbulb } from 'lucide-react';
import { PortionGuidance } from '../../types/recommendation.types';

interface PortionGuidanceCardProps {
  portionGuidance: PortionGuidance;
}

export const PortionGuidanceCard: React.FC<PortionGuidanceCardProps> = ({
  portionGuidance,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-10 space-y-8">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
        <PieChart className="w-7 h-7 text-emerald-600" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">
          Portion Size Recommendations & Guidance
        </h2>
      </div>

      {/* Hand-Based Portion Visual Guide */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2.5">
          <Hand className="w-5 h-5 text-emerald-600" />
          <span>Hand-Based Serving Estimator Rule</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {portionGuidance.handGuide.map((rule, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white space-y-3 hover:border-emerald-300 transition-colors shadow-xs"
            >
              <div className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1.5 rounded-xl inline-block">
                ✋ {rule.handVisual}
              </div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900">{rule.category}</div>
              <div className="text-sm sm:text-base font-black text-slate-800">{rule.portionSize}</div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">Eg: {rule.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Serving Advice */}
      <div className="space-y-4 pt-2">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2.5">
          <Scale className="w-5 h-5 text-indigo-600" />
          <span>Category Predefined Gram Serving Reference</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {portionGuidance.exactCategoryPortions.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start space-x-4 shadow-2xs"
            >
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">{item.category}</span>
                  <span className="text-xs sm:text-sm font-black bg-white px-3 py-1 rounded-lg border border-slate-200 text-indigo-700 shadow-2xs">
                    {item.recommendedGram} g/ml
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700">{item.servingAdvice}</div>
                <div className="text-xs text-slate-500 font-medium">💡 {item.tip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
