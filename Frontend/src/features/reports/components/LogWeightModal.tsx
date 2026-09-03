import React, { useState } from 'react';
import { X, Scale, AlertCircle, Check } from 'lucide-react';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { weightKg: number; heightCm?: number; date?: string }) => Promise<void>;
  currentWeight?: number;
  currentHeight?: number;
}

export const LogWeightModal: React.FC<LogWeightModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentWeight = 70,
  currentHeight = 170,
}) => {
  const [weightKg, setWeightKg] = useState<string>(currentWeight ? String(currentWeight) : '');
  const [heightCm, setHeightCm] = useState<string>(currentHeight ? String(currentHeight) : '');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate live BMI preview
  const weightNum = parseFloat(weightKg);
  const heightNum = parseFloat(heightCm);
  let liveBmi = 0;
  let bmiCategory = 'Normal';

  if (weightNum > 0 && heightNum > 0) {
    const hMeter = heightNum / 100;
    liveBmi = parseFloat((weightNum / (hMeter * hMeter)).toFixed(1));
    if (liveBmi < 18.5) bmiCategory = 'Underweight';
    else if (liveBmi < 25) bmiCategory = 'Normal';
    else if (liveBmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!weightNum || weightNum <= 0 || weightNum > 500) {
      setErrorMsg('Please enter a valid weight in kg (1-500 kg)');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        weightKg: weightNum,
        heightCm: heightNum > 0 ? heightNum : undefined,
        date: logDate,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to log weight');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-outfit">Log Weight & BMI</h3>
              <p className="text-xs text-emerald-100">Track changes to update your health profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Weight (kg) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 72.5"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 175"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          {/* Live BMI Preview Card */}
          {liveBmi > 0 && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500">Calculated BMI</span>
                <div className="text-xl font-bold text-emerald-800">{liveBmi}</div>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full">
                {bmiCategory}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
