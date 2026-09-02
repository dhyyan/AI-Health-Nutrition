import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Camera, PieChart, Droplet, User, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/scan', label: 'AI Scanner', icon: Camera },
    { path: '/nutrition', label: 'Nutrition', icon: PieChart },
    { path: '/water', label: 'Hydration', icon: Droplet },
    { path: '/profile', label: 'Health Profile', icon: User },
    { path: '/admin', label: 'Admin Panel', icon: ShieldAlert },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <Activity className="w-6 h-6 text-white font-bold" />
        </div>
        <span className="text-xl font-bold font-outfit text-slate-900 tracking-wide">
          Nutri<span className="text-gradient">AI</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center space-x-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center space-x-3">
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Log In
        </Link>
        <Link
          to="/register"
          className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold hover:scale-[1.02]"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};
