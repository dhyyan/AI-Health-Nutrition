import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { UpdateHealthProfilePayload } from '../../../services/healthProfile.service';

interface ContextType {
  formData: UpdateHealthProfilePayload;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const LifestyleTab: React.FC = () => {
  const { formData, handleChange } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 font-outfit border-b border-slate-100 pb-3">
          4. Lifestyle Habits & Wellness Goals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Primary Health Goal
            </label>
            <select
              name="goal"
              value={formData.goal || 'maintenance'}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintain Weight</option>
              <option value="muscle_gain">Muscle Building</option>
              <option value="weight_gain">Weight Gain</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Daily Activity Level
            </label>
            <select
              name="activityLevel"
              value={formData.activityLevel || 'moderate'}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
            >
              <option value="sedentary">Sedentary (Little/No Exercise)</option>
              <option value="moderate">Moderate (Exercise 3-4 days/wk)</option>
              <option value="active">Active (Intense Exercise 5-7 days/wk)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Average Sleep (Hours/day)
            </label>
            <input
              type="number"
              name="sleepHours"
              min="1"
              max="24"
              value={formData.sleepHours || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dietary Preference
            </label>
            <select
              name="dietaryPreference"
              value={formData.dietaryPreference || 'Non-Vegetarian'}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
            >
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="Pescetarian">Pescetarian</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
