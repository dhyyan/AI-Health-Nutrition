import React from 'react';
import { Activity } from 'lucide-react';

interface BmiStatusCardProps {
  bmi?: number;
  bmiCategory?: string;
  idealWeightRange?: string;
}

export const BmiStatusCard: React.FC<BmiStatusCardProps> = ({
  bmi = 22.5,
  bmiCategory = 'Normal',
  idealWeightRange = '53 - 72 kg',
}) => {
  const getBmiBadgeColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'normal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'overweight':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'underweight':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'obese':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
          <Activity className="w-7 h-7" />
        </div>
        <span
          className={`px-3 py-1 rounded-full border text-xs font-bold ${getBmiBadgeColor(
            bmiCategory
          )}`}
        >
          {bmiCategory}
        </span>
      </div>

      <div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">BMI Status</span>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mt-1">
          {typeof bmi === 'number' ? bmi.toFixed(1) : bmi}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Ideal Range:</span>
        <span className="font-bold text-slate-800">{idealWeightRange}</span>
      </div>
    </div>
  );
};
