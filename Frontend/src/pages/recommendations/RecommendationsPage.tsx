import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  Target,
  BarChart2,
  Compass,
  PieChart,
  Repeat,
  ChevronRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useRecommendations } from '../../hooks/useRecommendations';
import { GoalPlanCard } from '../../components/recommendations/GoalPlanCard';
import { HealthProfileComparisonCard } from '../../components/recommendations/HealthProfileComparisonCard';
import { LifestyleSuggestionsCard } from '../../components/recommendations/LifestyleSuggestionsCard';
import { FoodAlternativesCard } from '../../components/recommendations/FoodAlternativesCard';
import { PortionGuidanceCard } from '../../components/recommendations/PortionGuidanceCard';

export const RecommendationsPage: React.FC = () => {
  const {
    recommendations,
    loading,
    error,
    refreshRecommendations,
    alternatives,
    alternativesLoading,
    fetchAlternatives,
  } = useRecommendations();

  const [activeTab, setActiveTab] = useState<'all' | 'goal' | 'comparison' | 'alternatives' | 'portion' | 'lifestyle'>('all');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-medium">Generating your personalized health recommendations...</p>
      </div>
    );
  }

  if (error || !recommendations) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 max-w-md mx-auto">
          {error || 'Unable to load recommendations. Please verify your connection.'}
        </div>
        <button
          onClick={refreshRecommendations}
          className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const { goalPlan, healthComparison, lifestyleSuggestions, portionGuidance } = recommendations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md px-3.5 py-1 rounded-full text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Personalized Health Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">
              Your Personalized Recommendations
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-2xl">
              Customized nutrition, activity, and dietary guidance tailored specifically to your{' '}
              <strong className="text-white capitalize">{goalPlan.goal.replace('_', ' ')}</strong> goal and daily health profile.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/profile"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Update Goal / Profile</span>
            </Link>
            <button
              onClick={refreshRecommendations}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all"
              title="Refresh Recommendations"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Overview
        </button>
        <button
          onClick={() => setActiveTab('goal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'goal'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Goal Plan</span>
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'comparison'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Health Profile Comparison</span>
        </button>
        <button
          onClick={() => setActiveTab('alternatives')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'alternatives'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Food Alternatives</span>
        </button>
        <button
          onClick={() => setActiveTab('portion')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'portion'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Portion Guidance</span>
        </button>
        <button
          onClick={() => setActiveTab('lifestyle')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            activeTab === 'lifestyle'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Lifestyle Suggestions</span>
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {(activeTab === 'all' || activeTab === 'goal') && <GoalPlanCard plan={goalPlan} />}

        {(activeTab === 'all' || activeTab === 'comparison') && (
          <HealthProfileComparisonCard comparison={healthComparison} />
        )}

        {(activeTab === 'all' || activeTab === 'alternatives') && (
          <FoodAlternativesCard
            alternatives={alternatives}
            onSearchAlternative={fetchAlternatives}
            loading={alternativesLoading}
          />
        )}

        {(activeTab === 'all' || activeTab === 'portion') && (
          <PortionGuidanceCard portionGuidance={portionGuidance} />
        )}

        {(activeTab === 'all' || activeTab === 'lifestyle') && (
          <LifestyleSuggestionsCard suggestions={lifestyleSuggestions} />
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
