import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Flame, Droplet, Heart, Sparkles, User, ShieldCheck } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-6 py-10 max-w-7xl mx-auto space-y-8">
      {/* User Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3 text-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated User • Role: {user?.role}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-outfit">
            Welcome back, {user?.name || 'Health Enthusiast'}! 👋
          </h1>
          <p className="mt-2 text-emerald-100 text-sm md:text-base max-w-xl">
            Here is your daily personalized health overview. Track your calorie intake, hydration goals, and AI nutrition recommendations.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="w-12 h-12 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-xl font-outfit">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-bold text-sm text-white">{user?.name}</div>
            <div className="text-xs text-emerald-200">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Calories</span>
            <div className="text-2xl font-bold text-slate-900 font-outfit">1,450 / 2,000 <span className="text-xs text-slate-500 font-normal">kcal</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Water Intake</span>
            <div className="text-2xl font-bold text-slate-900 font-outfit">1.8 / 2.5 <span className="text-xs text-slate-500 font-normal">Liters</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">BMI Score</span>
            <div className="text-2xl font-bold text-slate-900 font-outfit">22.4 <span className="text-xs text-emerald-600 font-bold font-sans">Normal</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Score</span>
            <div className="text-2xl font-bold text-slate-900 font-outfit">92 / 100</div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card flex items-start space-x-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 font-outfit text-base">AI Personalized Tip of the Day</h3>
          <p className="text-slate-600 text-sm mt-1">
            Based on your hydration tracking, drink 500ml of water before your afternoon meal to optimize metabolic efficiency and energy levels.
          </p>
        </div>
      </div>
    </div>
  );
};
