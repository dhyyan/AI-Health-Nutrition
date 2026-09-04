import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useReminders } from '../hooks/useReminders';
import { DailyTipBanner } from '../components/notifications/DailyTipBanner';
import { DailyHealthSummaryHeader } from '../components/dashboard/DailyHealthSummaryHeader';
import { DailyCalorieCard } from '../components/dashboard/DailyCalorieCard';
import { WaterIntakeCard } from '../components/dashboard/WaterIntakeCard';
import { BmiStatusCard } from '../components/dashboard/BmiStatusCard';
import { HealthScoreCard } from '../components/dashboard/HealthScoreCard';
import { NutritionSummarySection } from '../components/dashboard/NutritionSummarySection';
import { AiRecommendationsSection } from '../components/dashboard/AiRecommendationsSection';
import { RecentFoodHistorySection } from '../components/dashboard/RecentFoodHistorySection';
import { MedicalDisclaimerBanner } from '../components/dashboard/MedicalDisclaimerBanner';
import { AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    dashboardData,
    loading,
    error,
    isWaterUpdating,
    refreshDashboard,
    addQuickWater,
  } = useDashboard();
  const { dailyTip, fetchTip } = useReminders();

  // Date Navigation Handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const profile = dashboardData?.userProfile;
  const summary = dashboardData?.dailySummary;
  const healthScore = dashboardData?.healthScore;
  const macros = dashboardData?.macros;
  const recommendations = dashboardData?.aiRecommendations || [];
  const foodHistory = dashboardData?.recentFoodHistory || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 sm:px-10 lg:px-16 py-8 w-full max-w-[1680px] mx-auto space-y-8">
      {/* Daily Smart Health Tip Banner */}
      <DailyTipBanner tip={dailyTip} onRefresh={() => fetchTip()} />

      {/* 1. Daily Health Summary Header */}
      <DailyHealthSummaryHeader
        userName={user?.name}
        role={user?.role}
        goal={profile?.goal}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
        onRefresh={refreshDashboard}
        isToday={isToday}
        isLoading={loading}
      />

      {/* Error Alert */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-40 bg-white rounded-3xl border border-slate-200 p-7" />
          ))}
        </div>
      )}

      {/* Core Health Metric Cards Grid */}
      {dashboardData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* 2. Daily Calories Card */}
          <DailyCalorieCard
            caloriesConsumed={summary?.caloriesConsumed || 0}
            caloriesTarget={summary?.caloriesTarget || 2000}
            caloriesRemaining={summary?.caloriesRemaining || 0}
            percentage={macros?.calories?.percentage || 0}
          />

          {/* 3. Water Intake Card */}
          <WaterIntakeCard
            waterConsumedMl={summary?.waterConsumedMl || 0}
            waterGoalMl={summary?.waterGoalMl || 2500}
            progressPercentage={summary?.waterProgressPercentage || 0}
            onAddQuickWater={addQuickWater}
            isUpdating={isWaterUpdating}
          />

          {/* 4. BMI Status Card */}
          <BmiStatusCard
            bmi={profile?.bmi}
            bmiCategory={profile?.bmiCategory}
            idealWeightRange={profile?.idealWeightRange}
          />

          {/* 5. Health Score Card */}
          <HealthScoreCard healthScore={healthScore} />
        </div>
      )}

      {/* 6. Nutrition Summary Section */}
      {macros && <NutritionSummarySection macros={macros} />}

      {/* 7. AI Personalized Recommendations Section */}
      <AiRecommendationsSection recommendations={recommendations} />

      {/* 8. Recent Food History Section */}
      <RecentFoodHistorySection foodHistory={foodHistory} />

      {/* Medical Safety Disclaimer Footer */}
      <MedicalDisclaimerBanner disclaimer={dashboardData?.disclaimer} />
    </div>
  );
};
