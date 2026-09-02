import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, HeartPulse, Droplets, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export const LandingPage: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* API Health Pill */}
        <div className="mb-8 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-500">Backend Status:</span>
          {backendStatus === 'checking' && (
            <span className="text-amber-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Connecting...
            </span>
          )}
          {backendStatus === 'online' && (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> API Connected (Port 5000)
            </span>
          )}
          {backendStatus === 'offline' && (
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Offline / Connecting...
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight font-outfit tracking-tight">
          AI-Powered Personalized <br />
          <span className="text-gradient">Health & Nutrition Engine</span>
        </h1>

        <p className="mt-6 text-slate-600 max-w-2xl text-base md:text-lg font-normal leading-relaxed">
          Intelligent food recognition, BMI calculation, hydration tracking, tailored meal planning, and detailed health analytics engineered for your unique wellness goals.
        </p>

        {/* Vibrant Colorful Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="btn-primary px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/scan"
            className="btn-accent px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-sky-100" />
            <span>Try AI Scanner</span>
          </Link>
          <Link
            to="/dashboard"
            className="btn-purple px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-100" />
            <span>Explore Dashboard</span>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Comprehensive System
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-3 font-outfit">
            Core Feature Specification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5 text-emerald-600">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Food Recognition</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload images or capture via live camera. Powered by intelligent recognition and nutrient lookup database.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mb-5 text-sky-600">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Health Profile & BMI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track height, weight, allergies, medical history, and automatically computed BMI categories.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-5 text-purple-600">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hydration Tracker</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Calculates daily water requirements, tracks intake progression, and visualizes historical hydration charts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="mt-auto bg-white border-t border-slate-200 px-6 py-6 text-center text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            BCA 2nd Year Project Specification. Provides general health and nutrition information for educational purposes only.
          </span>
        </div>
      </footer>
    </div>
  );
};
