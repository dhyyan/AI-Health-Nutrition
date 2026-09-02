import React from 'react';
import { X, Activity, Heart, Shield, AlertTriangle, Calendar, Mail, FileText } from 'lucide-react';
import { User, HealthProfile } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  healthProfile: HealthProfile | null;
  isLoading: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  healthProfile,
  isLoading,
}) => {
  if (!isOpen) return null;

  const getBMIBadgeColor = (category?: string) => {
    switch (category) {
      case 'Underweight':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Normal':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'Overweight':
        return 'bg-orange-950/80 text-orange-300 border-orange-800';
      case 'Obese':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-lg flex items-center justify-center border border-emerald-500/30">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-500" />
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Fetching profile details...</p>
            </div>
          ) : user ? (
            <>
              {/* Account Information Card */}
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" /> Account & Status
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Account Role</span>
                    <StatusBadge status={user.role} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Access Status</span>
                    <StatusBadge status={user.status} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Email Verification</span>
                    <StatusBadge status={user.isVerified ? 'verified' : 'unverified'} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Member Since</span>
                    <span className="font-semibold text-slate-300 flex items-center gap-1 text-xs mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Profile Information */}
              {healthProfile ? (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Stored Personal & Health Data
                  </h4>

                  {/* BMI Card */}
                  <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 rounded-xl p-4 border border-emerald-800/60 flex items-center justify-between shadow-lg">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        Body Mass Index (BMI)
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-white">{healthProfile.bmi}</span>
                        <span className="text-xs text-slate-400 font-medium">kg/m²</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getBMIBadgeColor(
                          healthProfile.bmiCategory
                        )}`}
                      >
                        {healthProfile.bmiCategory}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 capitalize">Goal: {healthProfile.goal.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {/* Vitals Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-500 block">Age</span>
                      <span className="text-lg font-bold text-white">{healthProfile.age} yrs</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-500 block">Gender</span>
                      <span className="text-lg font-bold text-white capitalize">{healthProfile.gender}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-500 block">Height</span>
                      <span className="text-lg font-bold text-white">{healthProfile.heightCm} cm</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-500 block">Weight</span>
                      <span className="text-lg font-bold text-white">{healthProfile.weightKg} kg</span>
                    </div>
                  </div>

                  {/* Medical History & Allergies */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Food Allergies
                      </h5>
                      {healthProfile.foodAllergies && healthProfile.foodAllergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {healthProfile.foodAllergies.map((allergy, i) => (
                            <span key={i} className="px-2 py-0.5 bg-rose-950/80 text-rose-300 text-xs font-medium rounded-md border border-rose-800">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No known food allergies</p>
                      )}
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                      <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                        <Heart className="w-3.5 h-3.5 text-rose-400" /> Medical History
                      </h5>
                      {healthProfile.medicalHistory && healthProfile.medicalHistory.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {healthProfile.medicalHistory.map((condition, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs font-medium rounded-md border border-slate-700">
                              {condition}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No medical history reported</p>
                      )}
                    </div>
                  </div>

                  {/* Lifestyle & Dietary Preferences */}
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Blood Group</span>
                      <span className="font-semibold text-slate-200">{healthProfile.bloodGroup || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Activity Level</span>
                      <span className="font-semibold text-slate-200 capitalize">{healthProfile.lifestyleHabits?.activityLevel || 'Moderate'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sleep Target</span>
                      <span className="font-semibold text-slate-200">{healthProfile.lifestyleHabits?.sleepHours || 8} hrs/night</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <h5 className="text-sm font-semibold text-slate-300">No Health Profile Recorded</h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    This user has registered an account but has not yet completed their personalized health & nutrition assessment.
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition border border-slate-700"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
