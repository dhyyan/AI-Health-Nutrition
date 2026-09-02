import React from 'react';
import { Activity, ShieldCheck, Heart, Zap, Award, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> AI System Operational
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin System Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Welcome to the AI Health & Nutrition Management administrative control panel. Access real-time metric snapshots, server statuses, and user access directory.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Manage User Accounts
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Backend Clean Architecture</h3>
            <p className="text-xs text-slate-400 mt-1">
              Domain Entities, Repositories, Use Cases & Express HTTP Controllers mounted.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 100% Operational
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Health Profiles Repository</h3>
            <p className="text-xs text-slate-400 mt-1">
              Stores BMI ratings, dietary restrictions, allergies, and lifestyle habit data.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-teal-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400" /> Active Mongoose Connection
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Security & RBAC Controls</h3>
            <p className="text-xs text-slate-400 mt-1">
              JWT Bearer Authentication + strictly enforced `requireRole('admin')` middleware.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-purple-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Protected Sessions
          </div>
        </div>
      </div>
    </div>
  );
};
