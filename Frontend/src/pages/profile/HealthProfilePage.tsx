import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HealthProfile, User } from '../../types';
import { healthProfileService, UpdateHealthProfilePayload } from '../../services/healthProfile.service';
import { ProfilePictureUploader } from '../../components/profile/ProfilePictureUploader';
import { HealthProfileForm } from '../../components/profile/HealthProfileForm';
import { Loader2, ShieldCheck, HeartPulse, User as UserIcon } from 'lucide-react';

export const HealthProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const data = await healthProfileService.getProfile();
      if (data.user && updateUser) {
        updateUser(data.user);
      }
      setProfile(data.profile);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setErrorMsg(err.response?.data?.message || 'Could not load your health profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUploadPicture = async (file: File) => {
    const updatedUser = await healthProfileService.uploadProfilePicture(file);
    if (updateUser) {
      updateUser(updatedUser);
    }
  };

  const handleSaveProfile = async (payload: UpdateHealthProfilePayload) => {
    const res = await healthProfileService.updateProfile(payload);
    if (res.user && updateUser) {
      updateUser(res.user);
    }
    setProfile(res.profile);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header & Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture Uploader */}
          <ProfilePictureUploader
            currentPictureUrl={user.profilePicture}
            userName={user.name}
            onUpload={handleUploadPicture}
          />

          {/* User Details & Quick Badges */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wide uppercase">
                {user.role === 'admin' ? 'Administrator' : 'Standard Member'}
              </span>
              {profile && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700/60 text-slate-200 border border-slate-600">
                  BMI: {profile.bmi} ({profile.bmiCategory})
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-wide">
              {user.name}
            </h1>
            <p className="text-slate-300 text-sm">{user.email}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <span>Goal: {profile?.goal ? profile.goal.replace('_', ' ') : 'Not set'}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Allergies: {profile?.foodAllergies?.length || 0} Listed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold text-slate-600">Loading your health profile...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <p className="text-rose-800 font-semibold">{errorMsg}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <HealthProfileForm user={user} profile={profile} onSave={handleSaveProfile} />
      )}
    </div>
  );
};
