import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  ShieldAlert,
  HelpCircle,
  CheckCircle,
  Save,
  Volume2,
  VolumeX,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useReminders } from '../../hooks/useReminders';
import { useNotifications } from '../../context/NotificationContext';
import { DailyTipBanner } from '../../components/notifications/DailyTipBanner';
import { MealReminderCard } from '../../components/notifications/MealReminderCard';
import { WaterReminderCard } from '../../components/notifications/WaterReminderCard';
import { ExerciseReminderCard } from '../../components/notifications/ExerciseReminderCard';
import { SleepReminderCard } from '../../components/notifications/SleepReminderCard';

export const SmartNotificationsPage: React.FC = () => {
  const { settings, dailyTip, loading, saving, saveSettings, fetchTip, testTrigger } = useReminders();
  const { browserPermission, requestBrowserPermission, addNotification } = useNotifications();
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  const [localSettings, setLocalSettings] = useState<any>(null);

  // Sync initial backend settings when loaded
  React.useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  if (loading || !localSettings) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Loading Smart Notification Preferences...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    await saveSettings(localSettings);
  };

  const handleTestAlert = async () => {
    await addNotification(
      '🔔 Test Notification',
      'Smart Notifications are working! Browser desktop popups and audio alerts are operational.',
      'system'
    );
    await testTrigger();
  };

  const isDenied = browserPermission === 'denied';

  return (
    <div className="max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-outfit tracking-tight">
                Smart Notifications
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                Personalized reminders for meals, hydration, workouts, sleep & daily health tips
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3.5 shrink-0">
          <button
            onClick={handleTestAlert}
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-extrabold transition border border-slate-200/80 flex items-center space-x-2 shadow-xs"
          >
            <Volume2 className="w-4.5 h-4.5 text-cyan-600" />
            <span>Test Alert</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-6 py-3 rounded-2xl text-sm font-extrabold shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
            <span>{saving ? 'Saving...' : 'Save All Preferences'}</span>
          </button>
        </div>
      </div>

      {/* Daily Health Tip Banner */}
      <DailyTipBanner tip={dailyTip} onRefresh={() => fetchTip()} />

      {/* Browser Permission Banner */}
      {browserPermission !== 'granted' ? (
        <div
          className={`rounded-3xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
            isDenied ? 'bg-rose-50/90 border-rose-200 text-rose-900' : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-start space-x-3">
            {isDenied ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <BellOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">
                Desktop Notifications Status: <span className="uppercase font-extrabold">{browserPermission}</span>
              </div>
              <p className="text-xs opacity-90 mt-1">
                {isDenied
                  ? 'Notifications are currently blocked by browser permissions. Popups require manual browser unlock.'
                  : 'Grant browser permission to receive instant desktop popups even when working in another window.'}
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              if (isDenied) {
                setShowBlockedModal(true);
              } else {
                await requestBrowserPermission();
              }
            }}
            className={`px-4 py-2.5 text-white rounded-2xl font-bold transition-all shrink-0 shadow-sm text-xs flex items-center space-x-1.5 ${
              isDenied ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isDenied ? (
              <>
                <HelpCircle className="w-4 h-4" />
                <span>How to Allow Popups</span>
              </>
            ) : (
              <span>Enable Browser Popups</span>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between text-xs font-semibold text-emerald-800">
          <div className="flex items-center space-x-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Browser Desktop Popups are <strong>Active & Permitted</strong>.</span>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center space-x-1 text-xs">
                {localSettings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                <span>Audio Alert Sound</span>
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Grid of Reminder Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meal Reminders */}
        <MealReminderCard
          schedule={localSettings.meals}
          onChange={(updated) =>
            setLocalSettings({ ...localSettings, meals: { ...localSettings.meals, ...updated } })
          }
        />

        {/* Water Reminders */}
        <WaterReminderCard
          schedule={localSettings.water}
          onChange={(updated) =>
            setLocalSettings({ ...localSettings, water: { ...localSettings.water, ...updated } })
          }
        />

        {/* Exercise Reminders */}
        <ExerciseReminderCard
          schedule={localSettings.exercise}
          onChange={(updated) =>
            setLocalSettings({ ...localSettings, exercise: { ...localSettings.exercise, ...updated } })
          }
        />

        {/* Sleep Reminders */}
        <SleepReminderCard
          schedule={localSettings.sleep}
          onChange={(updated) =>
            setLocalSettings({ ...localSettings, sleep: { ...localSettings.sleep, ...updated } })
          }
        />
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-8 py-3 rounded-2xl text-sm font-bold shadow-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Preferences...' : 'Save Smart Notification Preferences'}</span>
        </button>
      </div>

      {/* Browser Blocked Instructions Modal */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowBlockedModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-lg">Browser Desktop Notifications Blocked</h3>
                <p className="text-xs text-slate-500">How to unblock popups in your browser</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your web browser blocks programmatic permissions once set to <strong>Block</strong>. Follow these simple steps:
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 font-outfit text-sm">3 Quick Steps to Allow:</h4>
              <ol className="space-y-2 text-slate-700 list-decimal list-inside font-medium">
                <li>
                  Click the <strong>Lock / Tune icon 🔒</strong> next to the web URL in your browser address bar.
                </li>
                <li>
                  Find <strong>Notifications</strong> in the permissions menu.
                </li>
                <li>
                  Change the setting from <span className="text-rose-600 font-bold">Block</span> to <span className="text-emerald-600 font-bold">Allow</span> and reload the page.
                </li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowBlockedModal(false);
                  window.location.reload();
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Got It & Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
