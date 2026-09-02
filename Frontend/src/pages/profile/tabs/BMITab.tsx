import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BMICard } from '../../../components/profile/BMICard';
import { UpdateHealthProfilePayload } from '../../../services/healthProfile.service';

interface ContextType {
  formData: UpdateHealthProfilePayload;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const BMITab: React.FC = () => {
  const { formData, handleChange } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 font-outfit border-b border-slate-100 pb-3">
          2. Physical Measurements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Height (cm)
            </label>
            <input
              type="number"
              name="heightCm"
              min="50"
              max="250"
              step="0.5"
              value={formData.heightCm || ''}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weightKg"
              min="20"
              max="300"
              step="0.1"
              value={formData.weightKg || ''}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Live BMI Meter */}
      <BMICard heightCm={Number(formData.heightCm)} weightKg={Number(formData.weightKg)} />
    </div>
  );
};
