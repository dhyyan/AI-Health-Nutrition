import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  HeartPulse,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  Compass,
  TrendingUp,
  FileText,
  Bell,
  Utensils,
  Zap,
  Check,
} from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export const LandingPage: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [activeStep, setActiveStep] = useState<number>(1);

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Create Account & Health Profile',
      subtitle: 'Set Up Your Physical Baseline',
      icon: UserPlus,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50',
      description:
        'Sign up for free and fill out your basic metrics (height, weight, age, activity level, dietary preferences, and target goal like weight loss or muscle gain). The system calculates your basal metabolic rate (BMR) and recommended daily calories.',
      actionText: 'Register Free',
      actionUrl: '/register',
    },
    {
      number: 2,
      title: 'Scan & Log Meals with AI',
      subtitle: 'Instant Food Recognition',
      icon: Camera,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-600',
      borderColor: 'border-sky-200',
      bgColor: 'bg-sky-50',
      description:
        'Take a photo of your meal or upload an image. AI recognizes the food items, calculates portion sizes, calories, and detailed macros (Protein, Carbs, Fats, Fiber). You can also search the master food database manually.',
      actionText: 'Try AI Scanner',
      actionUrl: '/scanner',
    },
    {
      number: 3,
      title: 'Track Hydration & Health Score',
      subtitle: 'Monitor Real-Time Wellness',
      icon: Droplets,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      description:
        'Log your daily water intake with quick-add buttons (+250ml) and view your overall Health Score (0-100). The score evaluates your calorie balance, hydration progress, BMI status, and meal logging consistency.',
      actionText: 'Explore Dashboard',
      actionUrl: '/dashboard',
    },
    {
      number: 4,
      title: 'Receive AI Advice & Export PDF',
      subtitle: 'Insights & Progress Analytics',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50',
      description:
        'Receive smart real-time suggestions from our AI Recommendation engine based on your daily intake deficit or surplus. Generate and download downloadable PDF Health Reports to share with your doctor or trainer.',
      actionText: 'View Reports',
      actionUrl: '/reports',
    },
  ];

  const features = [
    {
      icon: Camera,
      title: 'AI Food Recognition',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      desc: 'Snap a picture of your dish to instantly detect food items, calories, and complete macronutrient profiles.',
    },
    {
      icon: HeartPulse,
      title: 'Unified Health Dashboard',
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      desc: 'Centralized command center featuring daily calorie budgets, water progress, BMI status, and Health Score breakdown.',
    },
    {
      icon: Droplets,
      title: 'Smart Hydration Tracker',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      desc: 'Automated hydration goal calculator based on body weight, quick-add logging, and historical water trends.',
    },
    {
      icon: Sparkles,
      title: 'AI Recommendation Engine',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      desc: 'Dynamic, personalized recommendations for protein intake, hydration alerts, calorie adjustments, and exercise tips.',
    },
    {
      icon: Utensils,
      title: 'AI Meal Planner & Recipes',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      desc: 'Generate tailored weekly meal plans and healthy step-by-step recipes matching your exact dietary preferences.',
    },
    {
      icon: TrendingUp,
      title: 'Health Trends & PDF Export',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      desc: 'Visualize weekly/monthly calorie & weight trends with one-click exportable PDF health summary reports.',
    },
    {
      icon: Bell,
      title: 'Reminders & Daily Tips',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      desc: 'Receive automated daily health tips and custom reminders for water, meal logging, and weight checks.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private Profile',
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      desc: 'JWT authentication, password hashing, and role-based access control protecting your sensitive health data.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section (Reference layout with original UI light color palette) */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-16 pb-24 w-full max-w-[1680px] mx-auto flex flex-col items-center">
        {/* API Health Pill */}
        <div className="mb-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm text-slate-700">
          <span className="text-slate-500">System Status:</span>
          {backendStatus === 'checking' && (
            <span className="text-amber-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Checking connection...
            </span>
          )}
          {backendStatus === 'online' && (
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Backend Online (Port 5000)
            </span>
          )}
          {backendStatus === 'offline' && (
            <span className="text-rose-600 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Connecting to server...
            </span>
          )}
        </div>

        {/* Large Bold Headline (Reference typography structure) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 leading-tight font-outfit tracking-tight text-center max-w-4xl">
          AI-Powered Health. <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Get Fit & Healthy.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl text-center leading-relaxed font-normal">
          Connect with Google Gemini Vision AI to scan meals, track calories, monitor hydration, and receive personalized health recommendations.
        </p>

        {/* Centered Pill Button (Matching "Post a Job ->" in reference image) */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all flex items-center gap-2.5"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* 3 Floating Cards (Matching bottom 3 cards layout in reference image with original light UI colors) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit">AI Food Scanner</h3>
              <p className="text-slate-600 text-sm leading-relaxed mt-2">
                Snap food images for instant automated detection of calories, portion size, and complete macro profiles.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col justify-between space-y-4 hover:border-teal-300 hover:shadow-md transition-all shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit">Unified Health Metrics</h3>
              <p className="text-slate-600 text-sm leading-relaxed mt-2">
                Track your daily calorie budgets, BMI status, water intake goals, and unified 0-100 Health Score.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col justify-between space-y-4 hover:border-purple-300 hover:shadow-md transition-all shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit">AI Recommendations</h3>
              <p className="text-slate-600 text-sm leading-relaxed mt-2">
                Personalized real-time daily advice for macro balance, hydration alerts, exercise, and PDF reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP-BY-STEP WORKING FLOW FOR NEW CUSTOMERS */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 bg-white border-y border-slate-200">
        <div className="w-full max-w-[1680px] mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-300">
              New Customer Guide
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-outfit">
              How the Application Works (Step-by-Step)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Follow these simple 4 steps to set up your profile, log meals, track health scores, and get AI guidance.
            </p>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold ${
                        isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {step.number}
                    </span>
                    <StepIcon className={`w-6 h-6 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-snug">{step.title}</h4>
                    <p className={`text-xs mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Highlight Showcase Card */}
          {steps.map((step) => {
            if (step.number !== activeStep) return null;
            const StepIcon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative overflow-hidden"
              >
                <div className="space-y-5 max-w-3xl relative z-10">
                  <div className="flex items-center space-x-3">
                    <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl font-outfit">
                      0{step.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                      Step {step.number} Working Process
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
                    {step.title}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-3 flex items-center space-x-4">
                    <Link
                      to={step.actionUrl}
                      className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition shadow-md flex items-center space-x-2"
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Instant Access</span>
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 flex flex-col items-center text-center space-y-4 shrink-0">
                  <div className={`w-20 h-20 rounded-2xl ${step.bgColor} ${step.borderColor} border flex items-center justify-center ${step.textColor}`}>
                    <StepIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Key Deliverable</span>
                    <p className="text-sm text-slate-300 mt-1">{step.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ALL APPLICATION FEATURES OVERVIEW */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 w-full max-w-[1680px] mx-auto space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-4 py-1.5 rounded-full border border-teal-300">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-outfit">
            Complete Feature Capabilities
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything engineered to give you complete visibility and control over your personal nutrition and health.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const FeatIcon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${item.color}`}>
                  <FeatIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5 font-outfit">{item.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="px-6 sm:px-10 lg:px-16 py-14 w-full max-w-[1680px] mx-auto">
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-8 sm:p-14 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <h3 className="text-3xl sm:text-4xl font-extrabold font-outfit">
              Ready to start your health journey?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Create your account in under 60 seconds and experience AI-driven food tracking and health metrics today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-white text-emerald-800 font-extrabold text-base hover:bg-emerald-50 transition shadow-md"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-base border border-white/20 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="mt-auto bg-white border-t border-slate-200 px-6 py-8 text-center text-slate-500 text-xs sm:text-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            AI Health & Nutrition Engine. Provides general health and nutrition information for educational purposes only. Not a substitute for medical advice.
          </span>
        </div>
      </footer>
    </div>
  );
};
