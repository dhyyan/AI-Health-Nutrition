import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Info, Plus, X, ShieldAlert, Heart } from 'lucide-react';
import { UpdateHealthProfilePayload } from '../../../services/healthProfile.service';

interface ContextType {
  formData: UpdateHealthProfilePayload;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleAddAllergy: (allergy: string) => void;
  handleRemoveAllergy: (allergy: string) => void;
  handleAddMedical: (condition: string) => void;
  handleRemoveMedical: (condition: string) => void;
}

const COMMON_ALLERGIES = ['Peanuts', 'Tree Nuts', 'Dairy / Lactose', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'Fish', 'Sesame'];
const COMMON_MEDICAL_CONDITIONS = ['Hypertension / High BP', 'Hypothyroidism', 'Hyperthyroidism', 'Asthma', 'PCOS / PCOD', 'High Cholesterol'];

export const MedicalTab: React.FC = () => {
  const {
    formData,
    handleChange,
    handleAddAllergy,
    handleRemoveAllergy,
    handleAddMedical,
    handleRemoveMedical,
  } = useOutletContext<ContextType>();

  const [customAllergy, setCustomAllergy] = useState('');
  const [customMedical, setCustomMedical] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Diabetes Status Card */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 font-outfit border-b border-slate-100 pb-3">
          3. Diabetes Status & Medical History
        </h3>

        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasDiabetes"
                name="hasDiabetes"
                checked={formData.hasDiabetes || false}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="hasDiabetes" className="text-sm font-bold text-slate-900 cursor-pointer">
                I have self-reported Diabetes / Blood Sugar condition
              </label>
            </div>
            {formData.hasDiabetes && (
              <select
                name="diabetesStatus"
                value={formData.diabetesStatus || 'none'}
                onChange={handleChange}
                className="px-3 py-1.5 rounded-lg border border-amber-300 text-xs font-semibold bg-white text-slate-800"
              >
                <option value="none">Select Type</option>
                <option value="type_1">Type 1 Diabetes</option>
                <option value="type_2">Type 2 Diabetes</option>
                <option value="prediabetes">Prediabetes</option>
              </select>
            )}
          </div>

          <div className="flex items-start space-x-2 text-xs text-amber-900/80 bg-amber-100/60 p-2.5 rounded-lg">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Medical Disclaimer:</strong> Recording your diabetes status helps customize general dietary suggestions. This detail is purely for general wellness recommendations and is not treated as a medical diagnosis.
            </span>
          </div>
        </div>
      </div>

      {/* Food Allergies */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-500" /> Food Allergies & Intolerances
        </h4>
        <p className="text-xs text-slate-500">
          The recommendation engine will avoid suggesting meals containing listed ingredients.
        </p>

        <div className="flex flex-wrap gap-2">
          {formData.foodAllergies?.map((allergy) => (
            <span
              key={allergy}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
            >
              <span>{allergy}</span>
              <button
                type="button"
                onClick={() => handleRemoveAllergy(allergy)}
                className="p-0.5 hover:text-rose-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {(!formData.foodAllergies || formData.foodAllergies.length === 0) && (
            <span className="text-xs text-slate-400 italic">No food allergies listed.</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="Add custom food allergy"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAllergy(customAllergy);
                setCustomAllergy('');
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              handleAddAllergy(customAllergy);
              setCustomAllergy('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-semibold self-center mr-1">Quick Add:</span>
          {COMMON_ALLERGIES.map((alg) => (
            <button
              key={alg}
              type="button"
              onClick={() => handleAddAllergy(alg)}
              disabled={formData.foodAllergies?.includes(alg)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                formData.foodAllergies?.includes(alg)
                  ? 'bg-rose-50 text-rose-400 border-rose-200 cursor-not-allowed'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
              }`}
            >
              + {alg}
            </button>
          ))}
        </div>
      </div>

      {/* Medical History Conditions */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-emerald-600" /> Relevant Medical Conditions
        </h4>

        <div className="flex flex-wrap gap-2">
          {formData.medicalHistory?.map((condition) => (
            <span
              key={condition}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
            >
              <span>{condition}</span>
              <button
                type="button"
                onClick={() => handleRemoveMedical(condition)}
                className="p-0.5 hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {(!formData.medicalHistory || formData.medicalHistory.length === 0) && (
            <span className="text-xs text-slate-400 italic">No medical conditions reported.</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={customMedical}
            onChange={(e) => setCustomMedical(e.target.value)}
            placeholder="Add medical condition"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMedical(customMedical);
                setCustomMedical('');
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              handleAddMedical(customMedical);
              setCustomMedical('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-semibold self-center mr-1">Quick Add:</span>
          {COMMON_MEDICAL_CONDITIONS.map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => handleAddMedical(cond)}
              disabled={formData.medicalHistory?.includes(cond)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                formData.medicalHistory?.includes(cond)
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
              }`}
            >
              + {cond}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
