import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CheckCircle2, Utensils, Database, Loader2 } from 'lucide-react';
import { FoodItem } from '../../types/nutrition.types';
import { searchFoods } from '../../services/nutritionApi';

interface FoodSearchInputProps {
  onSelectFood: (food: FoodItem) => void;
  selectedFood?: FoodItem | null;
}

const CATEGORIES = [
  'All',
  'Proteins',
  'Poultry & Meat',
  'Fruits',
  'Vegetables & Greens',
  'Grains & Cereals',
  'Dairy',
  'Indian Staples',
  'Nuts & Seeds',
];

export const FoodSearchInput: React.FC<FoodSearchInputProps> = ({ onSelectFood, selectedFood }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Execute Search
  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchFoods(query, 15);
        if (isMounted) {
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Error searching foods:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  const filteredResults = results.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const handleSelect = (food: FoodItem) => {
    onSelectFood(food);
    setQuery(food.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full space-y-3">
      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setActiveCategory(cat);
              setIsOpen(true);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search food database (e.g. Chicken, Apple, Brown Rice, Spinach, Dal Tadka)..."
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm text-sm font-medium transition"
        />
        {loading ? (
          <Loader2 className="absolute right-4 w-5 h-5 text-emerald-600 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-80 overflow-y-auto z-50 divide-y divide-slate-100">
          {filteredResults.length > 0 ? (
            filteredResults.map((food) => {
              const isSelected = selectedFood?.name === food.name;
              return (
                <button
                  key={food.id || food._id || food.name}
                  type="button"
                  onClick={() => handleSelect(food)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition hover:bg-emerald-50/60 ${
                    isSelected ? 'bg-emerald-50/80 font-semibold' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                        <span>{food.name}</span>
                        {food.isVerified !== false && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium text-slate-600">
                          {food.category}
                        </span>
                        <span>•</span>
                        <span>{food.servingSize}{food.servingUnit} base</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-emerald-700">{food.calories} kcal</div>
                    <div className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                      <Database className="w-3 h-3 text-slate-400" />
                      <span>{food.dataSource || 'Database'}</span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">
              No matching foods found for &ldquo;<span className="font-semibold">{query}</span>&rdquo;.
              <div className="text-xs text-slate-400 mt-1">Try searching another ingredient or query Open Food Facts API!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
