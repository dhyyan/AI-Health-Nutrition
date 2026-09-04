import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  Camera,
  PieChart,
  Droplet,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Sparkles,
  Utensils,
  FileBarChart,
  Bell,
  BookOpen,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Nav Groups Breakdown
  const aiGroup = [
    { path: '/scan', label: 'AI Food Scanner', desc: 'Scan meals via live camera or photos', icon: Camera },
    { path: '/recommendations', label: 'AI Recommendations', desc: 'Personalized daily wellness suggestions', icon: Sparkles },
    { path: '/meals', label: 'Meal Planner', desc: 'Goal-based weekly meal plans', icon: Utensils },
  ];

  const healthGroup = [
    { path: '/nutrition', label: 'Nutrition Analysis', desc: 'Track food logs & macros', icon: PieChart },
    { path: '/water', label: 'Hydration Tracker', desc: 'Water intake goals & records', icon: Droplet },
    { path: '/reports', label: 'Health Reports', desc: 'Trends & PDF export summary', icon: FileBarChart },
  ];

  const moreGroup = [
    { path: '/education', label: 'Health Education', desc: 'Articles & disease prevention guides', icon: BookOpen },
    { path: '/reminders', label: 'Smart Reminders', desc: 'Custom alerts & daily health tips', icon: Bell },
    { path: '/profile', label: 'Health Profile', desc: 'BMI, height, weight & body stats', icon: UserIcon },
  ];

  const isGroupActive = (group: { path: string }[]) => group.some((item) => location.pathname === item.path);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-10 lg:px-16 py-3.5 shadow-sm">
      <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between">
        {/* Top Left: Back Button & Brand Logo */}
        <div className="flex items-center space-x-2.5">
          {/* Back Button Icon */}
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-center shadow-xs group"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white font-bold" />
            </div>
            <span className="text-xl sm:text-2xl font-black font-outfit text-slate-900 tracking-wide">
              Nutri<span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Dropdown Navigation Links */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* Direct Dashboard Link */}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-base font-extrabold transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Activity className={`w-5 h-5 ${location.pathname === '/dashboard' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Dropdown 1: AI & Meals */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('ai')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-base font-extrabold transition-all ${
                  isGroupActive(aiGroup) || openDropdown === 'ai'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>AI Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'ai' ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>

              {openDropdown === 'ai' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2.5 z-50 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  {aiGroup.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-start space-x-3.5 p-3 rounded-xl transition ${
                          isActive ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-700 shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm font-outfit">{item.label}</div>
                          <div className="text-xs text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Dropdown 2: Health Metrics */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('health')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-base font-extrabold transition-all ${
                  isGroupActive(healthGroup) || openDropdown === 'health'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <PieChart className="w-5 h-5 text-sky-600" />
                <span>Health Metrics</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'health' ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>

              {openDropdown === 'health' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2.5 z-50 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  {healthGroup.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-start space-x-3.5 p-3 rounded-xl transition ${
                          isActive ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="p-2.5 rounded-xl bg-sky-100/70 text-sky-700 shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm font-outfit">{item.label}</div>
                          <div className="text-xs text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Dropdown 3: More & Wellness */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => toggleDropdown('more')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-base font-extrabold transition-all ${
                  isGroupActive(moreGroup) || openDropdown === 'more'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span>More Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'more' ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
              </button>

              {openDropdown === 'more' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2.5 z-50 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  {moreGroup.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-start space-x-3.5 p-3 rounded-xl transition ${
                          isActive ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="p-2.5 rounded-xl bg-purple-100/70 text-purple-700 shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm font-outfit">{item.label}</div>
                          <div className="text-xs text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Right Auth Controls & Top Right Notification Center */}
        <div className="hidden lg:flex items-center space-x-3.5">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3.5">
              {/* Notification Center Dropdown */}
              <NotificationCenter />

              <div className="flex items-center space-x-2.5 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-extrabold text-slate-800">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:scale-[1.02] transition-transform"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Right Controls: Notification Bell & Hamburger */}
        <div className="flex lg:hidden items-center space-x-2">
          {isAuthenticated && <NotificationCenter />}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl px-4 py-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {isAuthenticated && (
            <div className="space-y-4">
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  location.pathname === '/dashboard' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Dashboard</span>
              </Link>

              {/* Group 1: AI Features */}
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold uppercase text-slate-400 px-4 pt-2">AI Features</div>
                {aiGroup.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                        isActive ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Group 2: Health Metrics */}
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold uppercase text-slate-400 px-4 pt-2">Health Metrics</div>
                {healthGroup.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                        isActive ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Group 3: More Tools */}
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold uppercase text-slate-400 px-4 pt-2">Wellness & Account</div>
                {moreGroup.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                        isActive ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-2 py-1">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 text-sm font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-emerald-600 rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
