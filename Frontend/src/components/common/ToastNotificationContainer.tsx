import React from 'react';
import { X, Droplet, Utensils, Zap, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationType } from '../../types/notification';

export const ToastNotificationContainer: React.FC = () => {
  const { activeToasts, dismissToast } = useNotifications();

  if (activeToasts.length === 0) return null;

  const renderTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'water_reminder':
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
            <Droplet className="w-4 h-4 fill-current" />
          </div>
        );
      case 'meal_reminder':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <Utensils className="w-4 h-4" />
          </div>
        );
      case 'health_alert':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Zap className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {activeToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900/95 text-white border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start space-x-3 transition-all duration-300 animate-in slide-in-from-top-4 fade-in relative overflow-hidden"
        >
          {/* Subtle decorative glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-400" />

          {renderTypeIcon(toast.type)}

          <div className="flex-1 pr-6">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white font-outfit">{toast.title}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                NEW
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          {/* Minimise / Close Button */}
          <button
            onClick={() => dismissToast(toast.id)}
            className="absolute top-3.5 right-3 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Minimize popup message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
