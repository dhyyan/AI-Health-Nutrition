import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Sparkles, Database, Loader2, AlertCircle } from 'lucide-react';
import { FoodItem, NutritionAnalysisResult, FoodLogItem, MealType } from '../../types/nutrition.types';
import { analyzeNutrition, createFoodLog, getUserFoodLogs, deleteFoodLog } from '../../services/nutritionApi';
import { FoodSearchInput } from '../../components/nutrition/FoodSearchInput';
import { ServingSizeSelector } from '../../components/nutrition/ServingSizeSelector';
import { NutritionAnalysisCard } from '../../components/nutrition/NutritionAnalysisCard';
import { FoodLogHistoryList } from '../../components/nutrition/FoodLogHistoryList';

export const NutritionPage: React.FC = () => {
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [servingAmount, setServingAmount] = useState<number>(100);
  const [servingUnit, setServingUnit] = useState<string>('g');

  const [analysisResult, setAnalysisResult] = useState<NutritionAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [logs, setLogs] = useState<FoodLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [loggingInProcess, setLoggingInProcess] = useState<boolean>(false);

  // Fetch daily food log on load
  const fetchTodayLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const data = await getUserFoodLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching today food logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayLogs();
  }, [fetchTodayLogs]);

  // Handle Food Selection from Autocomplete Search
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFoodItem(food);
    setServingAmount(food.servingSize || 100);
    setServingUnit(food.servingUnit || 'g');
  };

  // Trigger Nutrition Analysis calculation when food item or serving changes
  useEffect(() => {
    if (!selectedFoodItem) return;

    let isMounted = true;
    const runAnalysis = async () => {
      setAnalyzing(true);
      setAnalysisError(null);
      try {
        const result = await analyzeNutrition(
          selectedFoodItem.id || selectedFoodItem._id,
          selectedFoodItem.name,
          servingAmount,
          servingUnit
        );
        if (isMounted) {
          setAnalysisResult(result);
        }
      } catch (err: any) {
        console.error('Analysis error:', err);
        if (isMounted) {
          setAnalysisError(err.response?.data?.message || 'Failed to analyze food item nutrition.');
        }
      } finally {
        if (isMounted) setAnalyzing(false);
      }
    };

    const timer = setTimeout(() => {
      runAnalysis();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedFoodItem, servingAmount, servingUnit]);

  // Handle Log Food Action
  const handleLogFood = async (mealType: MealType) => {
    if (!analysisResult) return;
    setLoggingInProcess(true);
    try {
      await createFoodLog({
        foodItemId: analysisResult.foodId,
        foodName: analysisResult.foodName,
        mealType,
        servingSize: analysisResult.servingSize,
        servingUnit: analysisResult.servingUnit,
      });
      await fetchTodayLogs();
    } catch (err) {
      console.error('Failed to log food:', err);
    } finally {
      setLoggingInProcess(false);
    }
  };

  // Handle Delete Food Log
  const handleDeleteLog = async (id: string) => {
    try {
      await deleteFoodLog(id);
      setLogs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete log entry:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <PieChart className="w-4 h-4" />
            <span>Nutrition Analysis System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 tracking-tight">
            Food & Micronutrient Breakdown
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Query the verified nutrition database to inspect estimated calories, protein, carbohydrates, total fat, dietary fiber, sugar, sodium, and micronutrients scaled for your serving size.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200/80 px-4 py-2.5 rounded-2xl text-emerald-900 shrink-0">
          <Database className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-xs font-bold">Nutrition Database API</div>
            <div className="text-[11px] text-emerald-700">Verified Database</div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Controls & Search on Left, Analysis & History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Search & Portion Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md space-y-6">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2>Search & Select Food</h2>
            </div>

            {/* Food Search Autocomplete Input */}
            <FoodSearchInput
              onSelectFood={handleSelectFood}
              selectedFood={selectedFoodItem}
            />

            {/* Portion & Serving Size Controls */}
            {selectedFoodItem && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <ServingSizeSelector
                  amount={servingAmount}
                  unit={servingUnit}
                  options={selectedFoodItem.servingOptions}
                  onChangeAmount={setServingAmount}
                  onChangeUnit={setServingUnit}
                />
              </div>
            )}
          </div>

          {/* Today's Food Logs History Component */}
          <FoodLogHistoryList
            logs={logs}
            onDeleteLog={handleDeleteLog}
            loading={loadingLogs}
          />
        </div>

        {/* Right Column: Nutrition Breakdown Results */}
        <div className="lg:col-span-7 space-y-6">
          {analyzing ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Calculating Portion Breakdown...</h3>
              <p className="text-xs text-slate-400">Fetching verified nutrition database records and scaling micronutrients.</p>
            </div>
          ) : analysisError ? (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-800 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Analysis Failed</span>
              </div>
              <p className="text-xs">{analysisError}</p>
            </div>
          ) : analysisResult ? (
            <NutritionAnalysisCard
              analysis={analysisResult}
              onLogFood={handleLogFood}
              isLogging={loggingInProcess}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <PieChart className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Select a Food Item to Analyze</h3>
                <p className="text-xs text-slate-500">
                  Search for any food item or ingredient on the left (e.g. &ldquo;Grilled Chicken Breast&rdquo;, &ldquo;Raw Spinach&rdquo;, &ldquo;Apple&rdquo;) to view complete nutrition metrics, calories, macronutrients, and vitamins & minerals.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
