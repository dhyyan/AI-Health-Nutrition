import React from 'react';
import { Bell, BellOff, Clock, Volume2, ShieldAlert, X, HelpCircle, CheckCircle } from 'lucide-react';

interface WaterReminderSettingsProps {
  notificationPermission: NotificationPermission;
  isReminderEnabled: boolean;
  reminderInterval: number;
  showBlockedModal: boolean;
  setShowBlockedModal: (show: boolean) => void;
  onRequestPermission: () => void;
  onToggleReminder: (enabled: boolean) => void;
  onSetInterval: (minutes: number) => void;
  onTestNotification: () => void;
}

export const WaterReminderSettings: React.FC<WaterReminderSettingsProps> = ({
  notificationPermission,
  isReminderEnabled,
  reminderInterval,
  showBlockedModal,
  setShowBlockedModal,
  onRequestPermission,
  onToggleReminder,
  onSetInterval,
  onTestNotification,
}) => {
  const isDenied = notificationPermission === 'denied';

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 font-outfit text-lg">Smart Water Reminders</h3>
            <p className="text-xs text-slate-500">Stay consistent with browser popups & interval notifications</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isReminderEnabled}
            onChange={(e) => onToggleReminder(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
        </label>
      </div>

      {/* Permission Request / Denied Banner */}
      {notificationPermission !== 'granted' && (
        <div
          className={`rounded-2xl p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isDenied
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-start space-x-2.5">
            {isDenied ? (
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <BellOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">
                Status: <span className="uppercase font-extrabold">{notificationPermission}</span>
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">
                {isDenied
                  ? 'Notifications are blocked by your browser settings. Browsers prevent automatic popups once denied.'
                  : 'Grant browser permission to receive desktop popup alerts.'}
              </p>
            </div>
          </div>

          <button
            onClick={onRequestPermission}
            className={`px-4 py-2 text-white rounded-xl font-bold transition-all shrink-0 shadow-sm text-xs flex items-center space-x-1.5 ${
              isDenied
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isDenied ? (
              <>
                <HelpCircle className="w-3.5 h-3.5" />
                <span>How to Allow</span>
              </>
            ) : (
              <span>Enable Notifications</span>
            )}
          </button>
        </div>
      )}

      {notificationPermission === 'granted' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Browser Notification Permission is <strong>Active & Allowed</strong>.</span>
        </div>
      )}

      {/* Reminder Options */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Reminder Frequency</span>
          </span>
          <span className="text-cyan-700 font-bold">Every {reminderInterval} minutes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: '30 Mins', value: 30 },
            { label: '1 Hour', value: 60 },
            { label: '1.5 Hours', value: 90 },
            { label: '2 Hours', value: 120 },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onSetInterval(option.value)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                reminderInterval === option.value
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Test if your reminders work properly:</span>
          <button
            onClick={onTestNotification}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-200"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
            <span>Send Test Alert</span>
          </button>
        </div>
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
                <h3 className="font-bold text-slate-900 font-outfit text-lg">Notifications Are Blocked</h3>
                <p className="text-xs text-slate-500">How to manually allow notifications in your browser</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Modern web browsers (Chrome, Edge, Firefox, Brave) protect user security by disabling programmatic permission requests after you click <strong>Block</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 font-outfit text-sm">Follow these 3 quick steps:</h4>
              <ol className="space-y-2 text-slate-700 list-decimal list-inside font-medium">
                <li>
                  Click the <strong>Tune / Lock icon 🔒</strong> in your browser's address bar (left of the website URL).
                </li>
                <li>
                  Find <strong>Notifications</strong> in the permissions list.
                </li>
                <li>
                  Change the dropdown setting from <span className="text-rose-600 font-bold">Block</span> to <span className="text-emerald-600 font-bold">Allow</span>.
                </li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowBlockedModal(false);
                  window.location.reload();
                }}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
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
