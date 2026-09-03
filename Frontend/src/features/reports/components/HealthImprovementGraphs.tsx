import React, { useState } from 'react';
import { HealthTrendsData } from '../../../services/reportApi';
import { NutritionAnalysisChart } from './NutritionAnalysisChart';
import { WeightProgressChart } from './WeightProgressChart';
import { BMIHistoryChart } from './BMIHistoryChart';
import { WaterIntakeHistoryChart } from './WaterIntakeHistoryChart';
import { Activity, Flame, Scale, Droplet, Layers } from 'lucide-react';

interface HealthImprovementGraphsProps {
  data: HealthTrendsData | null;
  loading: boolean;
}

export const HealthImprovementGraphs: React.FC<HealthImprovementGraphsProps> = ({ data, loading }) => {
  const [filterView, setFilterView] = useState<'all' | 'nutrition' | 'weight' | 'bmi' | 'water'>('all');

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">Generating analytics trends & progress graphs...</p>
      </div>
    );
  }

  if (!data || data.dates.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
        <p className="text-slate-500 text-sm font-medium">No trend data logged for the selected period.</p>
      </div>
    );
  }

  const views: Array<{ id: 'all' | 'nutrition' | 'weight' | 'bmi' | 'water'; label: string; icon: any }> = [
    { id: 'all', label: 'All Graphs', icon: Layers },
    { id: 'nutrition', label: 'Nutrition & Macros', icon: Flame },
    { id: 'weight', label: 'Weight Progress', icon: Scale },
    { id: 'bmi', label: 'BMI History', icon: Activity },
    { id: 'water', label: 'Water Records', icon: Droplet },
  ];

  return (
    <div className="space-y-6">
      {/* Graph Section Filter bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-200/60">
        {views.map((v) => {
          const Icon = v.icon;
          const isActive = filterView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setFilterView(v.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Selected Charts */}
      {(filterView === 'all' || filterView === 'nutrition') && (
        <NutritionAnalysisChart data={data} />
      )}

      {(filterView === 'all' || filterView === 'weight') && (
        <WeightProgressChart data={data} />
      )}

      {(filterView === 'all' || filterView === 'bmi') && (
        <BMIHistoryChart data={data} />
      )}

      {(filterView === 'all' || filterView === 'water') && (
        <WaterIntakeHistoryChart data={data} />
      )}
    </div>
  );
};
