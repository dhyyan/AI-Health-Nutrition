import React from 'react';
import { Activity, Info, Scale, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface BMICardProps {
  heightCm: number;
  weightKg: number;
}

export const BMICard: React.FC<BMICardProps> = ({ heightCm, weightKg }) => {
  const calculateLiveBMI = (): { bmi: number; category: string; color: string; badgeBg: string; textClass: string; icon: any } => {
    if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
      return {
        bmi: 0,
        category: 'Pending Data',
        color: '#94a3b8',
        badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
        textClass: 'text-slate-600',
        icon: Info,
      };
    }

    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    if (bmi < 18.5) {
      return {
        bmi,
        category: 'Underweight',
        color: '#3b82f6', // blue
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        textClass: 'text-blue-600',
        icon: Info,
      };
    } else if (bmi < 25) {
      return {
        bmi,
        category: 'Normal Weight',
        color: '#10b981', // emerald
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        textClass: 'text-emerald-600',
        icon: CheckCircle2,
      };
    } else if (bmi < 30) {
      return {
        bmi,
        category: 'Overweight',
        color: '#f59e0b', // amber
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        textClass: 'text-amber-600',
        icon: AlertTriangle,
      };
    } else {
      return {
        bmi,
        category: 'Obese',
        color: '#f43f5e', // rose
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        textClass: 'text-rose-600',
        icon: AlertOctagon,
      };
    }
  };

  const { bmi, category, badgeBg, textClass, icon: CategoryIcon } = calculateLiveBMI();

  // Percentage on gauge scale (Range 12 to 40)
  const getScalePercentage = (bmiValue: number) => {
    if (bmiValue <= 0) return 0;
    const min = 14;
    const max = 35;
    const clamped = Math.min(Math.max(bmiValue, min), max);
    return ((clamped - min) / (max - min)) * 100;
  };

  const pointerPos = getScalePercentage(bmi);

  // Healthy Weight Range Calculation
  const healthyWeightMin = heightCm > 0 ? (18.5 * Math.pow(heightCm / 100, 2)).toFixed(1) : '0';
  const healthyWeightMax = heightCm > 0 ? (24.9 * Math.pow(heightCm / 100, 2)).toFixed(1) : '0';

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-outfit">BMI Calculator & Category</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${badgeBg}`}>
          <CategoryIcon className="w-3.5 h-3.5" />
          <span>{category}</span>
        </div>
      </div>

      {/* Main Score & Dynamic Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-50/80 rounded-xl p-4 border border-slate-100">
        <div className="sm:col-span-1 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Body Mass Index</span>
          <div className={`text-3xl font-extrabold font-outfit mt-0.5 ${textClass}`}>
            {bmi > 0 ? bmi : '--'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Calculated from {heightCm || 0} cm & {weightKg || 0} kg
          </p>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-1">
            <span>Underweight (&lt;18.5)</span>
            <span>Normal (18.5-24.9)</span>
            <span>Overweight (25-29.9)</span>
            <span>Obese (&ge;30)</span>
          </div>

          {/* Visual Color Scale Bar */}
          <div className="relative h-3 rounded-full overflow-hidden flex bg-slate-200">
            <div className="w-[20%] bg-blue-400" title="Underweight (<18.5)" />
            <div className="w-[30%] bg-emerald-500" title="Normal (18.5-24.9)" />
            <div className="w-[25%] bg-amber-400" title="Overweight (25-29.9)" />
            <div className="w-[25%] bg-rose-500" title="Obese (>=30)" />

            {/* Scale Marker Pointer */}
            {bmi > 0 && (
              <div
                className="absolute top-0 bottom-0 w-2 bg-slate-900 border border-white shadow-md rounded-full transition-all duration-500 transform -translate-x-1/2"
                style={{ left: `${pointerPos}%` }}
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
            <div className="flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target Healthy Weight:</span>
            </div>
            <span className="font-bold text-slate-900">
              {healthyWeightMin} - {healthyWeightMax} kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
