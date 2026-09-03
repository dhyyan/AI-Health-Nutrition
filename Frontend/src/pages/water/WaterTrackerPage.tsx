import React, { useState } from 'react';
import { Droplet, Plus, Target, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import { useWaterTracker } from '../../hooks/useWaterTracker';
import { WaterProgressWidget } from '../../components/water/WaterProgressWidget';
import { WaterReminderSettings } from '../../components/water/WaterReminderSettings';
import { WaterHistoryTable } from '../../components/water/WaterHistoryTable';
import { WaterTrendsChart } from '../../components/water/WaterTrendsChart';

export const WaterTrackerPage: React.FC = () => {
  const {
    summary,
    history,
    loading,
    historyLoading,
    error,
    addIntake,
    removeIntake,
    changeGoal,
    fetchSummary,
    notificationPermission,
    isReminderEnabled,
    reminderInterval,
    showBlockedModal,
    setShowBlockedModal,
    requestNotificationPermission,
    triggerTestNotification,
    toggleReminder,
    setReminderTimeInterval,
  } = useWaterTracker();

  // Custom Amount Form State
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [newGoalInput, setNewGoalInput] = useState<string>('');

  const handleQuickAdd = async (amount: number) => {
    try {
      setIsSubmitting(true);
      await addIntake(amount);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(customAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) return;

    try {
      setIsSubmitting(true);
      await addIntake(amountNum, customNotes.trim() || undefined);
      setCustomAmount('');
      setCustomNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const goalNum = parseInt(newGoalInput, 10);
    if (isNaN(goalNum) || goalNum < 500 || goalNum > 10000) return;

    try {
      setIsSubmitting(true);
      await changeGoal(goalNum);
      setIsGoalModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Loading Hydration Tracker...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-6 py-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-2">
            <Droplet className="w-3.5 h-3.5 fill-current" />
            <span>Water Intake Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
            Daily Hydration & Reminders
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Maintain optimal bodily function, energy levels, and mental clarity by tracking your daily water goal.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setNewGoalInput(summary?.dailyGoalMl.toString() || '2500');
              setIsGoalModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition"
          >
            <Target className="w-4 h-4 text-cyan-600" />
            <span>Adjust Target Goal</span>
          </button>
          <button
            onClick={() => fetchSummary()}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center space-x-3 text-rose-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Hero Widget */}
      <WaterProgressWidget
        summary={summary}
        onQuickAdd={handleQuickAdd}
        isSubmitting={isSubmitting}
      />

      {/* Grid Section: Custom Add Form & Reminders Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Custom Water Intake Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 font-outfit text-base">Add Custom Water Intake</h3>
              <p className="text-xs text-slate-500">Record custom milliliter amounts or specific drinks</p>
            </div>
          </div>

          <form onSubmit={handleCustomAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount (ml)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="3000"
                  placeholder="e.g. 350"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-outfit text-base font-semibold"
                  required
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">ml</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Optional Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Herbal tea, post-workout, coconut water"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !customAmount}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl text-sm font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Record Water Intake</span>
            </button>
          </form>
        </div>

        {/* Reminders & Notification Panel */}
        <WaterReminderSettings
          notificationPermission={notificationPermission}
          isReminderEnabled={isReminderEnabled}
          reminderInterval={reminderInterval}
          showBlockedModal={showBlockedModal}
          setShowBlockedModal={setShowBlockedModal}
          onRequestPermission={requestNotificationPermission}
          onToggleReminder={toggleReminder}
          onSetInterval={setReminderTimeInterval}
          onTestNotification={triggerTestNotification}
        />
      </div>

      {/* Grid Section: Log History Table & 7-Day Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WaterHistoryTable
          records={summary?.records || []}
          onDeleteRecord={removeIntake}
          isDeleting={isSubmitting}
        />

        <WaterTrendsChart history={history} isLoading={historyLoading} />
      </div>

      {/* Goal Adjustment Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-outfit text-lg">Update Daily Water Goal</h3>
                <p className="text-xs text-slate-500">Set your preferred target in milliliters per day</p>
              </div>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Daily Target (ml)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    step="50"
                    value={newGoalInput}
                    onChange={(e) => setNewGoalInput(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-outfit text-lg font-bold"
                    required
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-slate-400">ml</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Recommended target: 2000 - 3500 ml per day based on activity.</p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
