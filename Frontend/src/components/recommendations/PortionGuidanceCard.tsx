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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
        <PieChart className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-900 font-outfit">
          Portion Size Recommendations & Guidance
        </h2>
      </div>

      {/* Hand-Based Portion Visual Guide */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Hand className="w-4 h-4 text-emerald-600" />
          <span>Hand-Based Serving Estimator Rule</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {portionGuidance.handGuide.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white space-y-2 hover:border-emerald-300 transition-colors"
            >
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block">
                ✋ {rule.handVisual}
              </div>
              <div className="font-bold text-sm text-slate-900">{rule.category}</div>
              <div className="text-xs font-extrabold text-slate-800">{rule.portionSize}</div>
              <p className="text-[11px] text-slate-500 font-medium">Eg: {rule.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Serving Advice */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Scale className="w-4 h-4 text-indigo-600" />
          <span>Category Predefined Gram Serving Reference</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {portionGuidance.exactCategoryPortions.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start space-x-3"
            >
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-slate-900">{item.category}</span>
                  <span className="text-xs font-black bg-white px-2 py-0.5 rounded border border-slate-200 text-indigo-700">
                    {item.recommendedGram} g/ml
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600">{item.servingAdvice}</div>
                <div className="text-[11px] text-slate-500">💡 {item.tip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
