import React from 'react';
import { Scale, Plus, Minus } from 'lucide-react';
import { ServingSizeOption } from '../../types/nutrition.types';

interface ServingSizeSelectorProps {
  amount: number;
  unit: string;
  options?: ServingSizeOption[];
  onChangeAmount: (newAmount: number) => void;
  onChangeUnit: (newUnit: string) => void;
}

export const ServingSizeSelector: React.FC<ServingSizeSelectorProps> = ({
  amount,
  unit,
  options = [],
  onChangeAmount,
  onChangeUnit,
}) => {
  const handlePresetSelect = (opt: ServingSizeOption) => {
    onChangeAmount(opt.amount);
    onChangeUnit(opt.unit);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
          <Scale className="w-4 h-4 text-emerald-600" />
          <span>Serving Portion & Weight</span>
        </label>
        <span className="text-xs text-slate-400 font-medium">Select or enter portion size</span>
      </div>

      {/* Preset Buttons if Available */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map((opt, idx) => {
            const isActive = amount === opt.amount && unit === opt.unit;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.label || `${opt.amount} ${opt.unit}`}
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Quantity Controls */}
      <div className="flex items-center space-x-3 pt-1">
        {/* Quantity Controls */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => onChangeAmount(Math.max(5, amount - 10))}
            className="p-2.5 text-slate-600 hover:bg-slate-100 transition border-r border-slate-200"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            min="1"
            max="2000"
            value={amount}
            onChange={(e) => onChangeAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-20 text-center font-bold text-slate-900 focus:outline-none text-sm py-2"
          />

          <button
            type="button"
            onClick={() => onChangeAmount(amount + 10)}
            className="p-2.5 text-slate-600 hover:bg-slate-100 transition border-l border-slate-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Unit Selector */}
        <select
          value={unit}
          onChange={(e) => onChangeUnit(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        >
          <option value="g">grams (g)</option>
          <option value="ml">milliliters (ml)</option>
          <option value="cup">cup</option>
          <option value="serving">serving</option>
          <option value="medium">medium item</option>
          <option value="large">large item</option>
          <option value="oz">ounce (oz)</option>
        </select>

        {/* Quick Range Slider */}
        <div className="flex-1 min-w-[120px]">
          <input
            type="range"
            min="10"
            max="500"
            step="5"
            value={amount}
            onChange={(e) => onChangeAmount(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
