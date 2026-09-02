import React, { useState } from 'react';
import {
  User as UserIcon,
  Heart,
  ShieldAlert,
  Flame,
  Plus,
  X,
  Save,
  Loader2,
  Info,
  CheckCircle,
} from 'lucide-react';
import { HealthProfile, User } from '../../types';
import { UpdateHealthProfilePayload } from '../../services/healthProfile.service';
import { BMICard } from './BMICard';

interface HealthProfileFormProps {
  user: User;
  profile?: HealthProfile | null;
  onSave: (payload: UpdateHealthProfilePayload) => Promise<void>;
}

const COMMON_ALLERGIES = ['Peanuts', 'Tree Nuts', 'Dairy / Lactose', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'Fish', 'Sesame'];
const COMMON_MEDICAL_CONDITIONS = ['Hypertension / High BP', 'Hypothyroidism', 'Hyperthyroidism', 'Asthma', 'PCOS / PCOD', 'High Cholesterol'];

export const HealthProfileForm: React.FC<HealthProfileFormProps> = ({ user, profile, onSave }) => {
  const [formData, setFormData] = useState<UpdateHealthProfilePayload>({
    name: user.name || '',
    age: profile?.age || 25,
    gender: profile?.gender || 'male',
    heightCm: profile?.heightCm || 170,
    weightKg: profile?.weightKg || 65,
    bloodGroup: profile?.bloodGroup || 'O+',
    goal: profile?.goal || 'maintenance',
    foodAllergies: profile?.foodAllergies || [],
    medicalHistory: profile?.medicalHistory || [],
    activityLevel: profile?.activityLevel || 'moderate',
    sleepHours: profile?.sleepHours || 7,
    dietaryPreference: profile?.dietaryPreference || 'Non-Vegetarian',
    hasDiabetes: profile?.hasDiabetes ?? false,
    diabetesStatus: profile?.diabetesStatus || 'none',
  });

  const [customAllergy, setCustomAllergy] = useState('');
  const [customMedical, setCustomMedical] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAllergy = (allergy: string) => {
    const trimmed = allergy.trim();
    if (trimmed && !formData.foodAllergies?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        foodAllergies: [...(prev.foodAllergies || []), trimmed],
      }));
    }
    setCustomAllergy('');
  };

  const handleRemoveAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      foodAllergies: prev.foodAllergies?.filter((a) => a !== allergy),
    }));
  };

  const handleAddMedical = (condition: string) => {
    const trimmed = condition.trim();
    if (trimmed && !formData.medicalHistory?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        medicalHistory: [...(prev.medicalHistory || []), trimmed],
      }));
    }
    setCustomMedical('');
  };

  const handleRemoveMedical = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory?.filter((c) => c !== condition),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (formData.heightCm <= 0 || formData.weightKg <= 0) {
      setErrorMsg('Please enter valid height and weight values.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
      setSuccessMsg('Health profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save health profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toast Alert Feedback */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-sm font-semibold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-3 text-sm font-semibold animate-in fade-in">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Basic Personal Info */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <UserIcon className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-outfit">1. Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Age (Years)</label>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium bg-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium bg-white"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Height & Weight with Real-time BMI Display */}
      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-outfit">2. Height & Weight Metrics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Height (cm)</label>
              <input
                type="number"
                name="heightCm"
                min="50"
                max="250"
                step="0.5"
                value={formData.heightCm}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Weight (kg)</label>
              <input
                type="number"
                name="weightKg"
                min="20"
                max="300"
                step="0.1"
                value={formData.weightKg}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* BMI Meter Card */}
        <BMICard heightCm={Number(formData.heightCm)} weightKg={Number(formData.weightKg)} />
      </div>

      {/* Section 3: Medical History & Diabetes Status */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Heart className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-outfit">3. Medical Information & Conditions</h3>
        </div>

        {/* Diabetes Toggle & Disclaimer Card */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasDiabetes"
                name="hasDiabetes"
                checked={formData.hasDiabetes}
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
                value={formData.diabetesStatus}
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
              <strong>Medical Disclaimer:</strong> Recording your diabetes status helps customize general dietary and meal suggestions. This detail is purely for general wellness recommendations and is not treated as a medical diagnosis or clinical prescription.
            </span>
          </div>
        </div>

        {/* Medical History Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Medical History / Conditions</label>
          <div className="flex flex-wrap gap-2 mb-2">
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
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customMedical}
              onChange={(e) => setCustomMedical(e.target.value)}
              placeholder="Add condition (e.g., Hypertension, Asthma)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMedical(customMedical);
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleAddMedical(customMedical)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-xs text-slate-400 font-semibold self-center mr-1">Quick Select:</span>
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

      {/* Section 4: Food Allergies */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-outfit">4. Food Allergies & Intolerances</h3>
        </div>

        <p className="text-xs text-slate-500">
          The recommendation engine will automatically avoid suggesting meals or foods containing these ingredients.
        </p>

        {/* Selected Allergies */}
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.foodAllergies?.map((allergy) => (
            <span
              key={allergy}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs"
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
          {formData.foodAllergies?.length === 0 && (
            <span className="text-xs text-slate-400 italic">No food allergies listed yet.</span>
          )}
        </div>

        {/* Custom Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="Type custom food allergy (e.g. Mushroom)"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAllergy(customAllergy);
              }
            }}
          />
          <button
            type="button"
            onClick={() => handleAddAllergy(customAllergy)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Common Allergies Quick Selector */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <span className="text-xs text-slate-400 font-semibold self-center mr-1">Common Allergies:</span>
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

      {/* Section 5: Lifestyle Habits & Health Goals */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-outfit">5. Lifestyle Habits & Goals</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Primary Health Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintain Weight</option>
              <option value="muscle_gain">Muscle Building</option>
              <option value="weight_gain">Weight Gain</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Activity Level</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="sedentary">Sedentary (Little/No Exercise)</option>
              <option value="moderate">Moderate (Exercise 3-4 days/wk)</option>
              <option value="active">Active (Intense Exercise 5-7 days/wk)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Average Sleep (Hours/day)</label>
            <input
              type="number"
              name="sleepHours"
              min="1"
              max="24"
              value={formData.sleepHours}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Dietary Preference</label>
            <select
              name="dietaryPreference"
              value={formData.dietaryPreference}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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

      {/* Save Button Bar */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-8 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 text-white" />
              <span>Save Health Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
