import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Activity,
  Heart,
  Flame,
  Save,
  Loader2,
  CheckCircle,
  ShieldAlert,
  HeartPulse,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HealthProfile } from '../../types';
import { healthProfileService, UpdateHealthProfilePayload } from '../../services/healthProfile.service';
import { ProfilePictureUploader } from '../../components/profile/ProfilePictureUploader';

export const HealthProfilePageLayout: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState<boolean>(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateHealthProfilePayload>({
    name: '',
    age: 25,
    gender: 'male',
    heightCm: 170,
    weightKg: 65,
    bloodGroup: 'O+',
    goal: 'maintenance',
    foodAllergies: [],
    medicalHistory: [],
    activityLevel: 'moderate',
    sleepHours: 7,
    dietaryPreference: 'Non-Vegetarian',
    hasDiabetes: false,
    diabetesStatus: 'none',
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const data = await healthProfileService.getProfile();
      if (data.user && updateUser) {
        updateUser(data.user);
      }
      setProfile(data.profile);

      if (data.user || data.profile) {
        setFormData({
          name: data.user?.name || '',
          age: data.profile?.age || 25,
          gender: data.profile?.gender || 'male',
          heightCm: data.profile?.heightCm || 170,
          weightKg: data.profile?.weightKg || 65,
          bloodGroup: data.profile?.bloodGroup || 'O+',
          goal: data.profile?.goal || 'maintenance',
          foodAllergies: data.profile?.foodAllergies || [],
          medicalHistory: data.profile?.medicalHistory || [],
          activityLevel: data.profile?.activityLevel || 'moderate',
          sleepHours: data.profile?.sleepHours || 7,
          dietaryPreference: data.profile?.dietaryPreference || 'Non-Vegetarian',
          hasDiabetes: data.profile?.hasDiabetes ?? false,
          diabetesStatus: data.profile?.diabetesStatus || 'none',
        });
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAllergy = (allergy: string) => {
    const trimmed = allergy.trim();
    if (trimmed && !formData.foodAllergies?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        foodAllergies: [...(prev.foodAllergies || []), trimmed],
      }));
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      foodAllergies: prev.foodAllergies?.filter((a) => a !== allergy),
    }));
  };

  const handleAddMedical = (condition: string) => {
    const trimmed = condition.trim();
    if (trimmed && !formData.medicalHistory?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        medicalHistory: [...(prev.medicalHistory || []), trimmed],
      }));
    }
  };

  const handleRemoveMedical = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory?.filter((c) => c !== condition),
    }));
  };

  const handleUploadPicture = async (file: File) => {
    try {
      setIsUploadingPicture(true);
      const updatedUser = await healthProfileService.uploadProfilePicture(file);
      if (updateUser) {
        updateUser(updatedUser);
      }
      setSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload profile picture.');
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleSaveAll = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (formData.heightCm <= 0 || formData.weightKg <= 0) {
      setErrorMsg('Please enter valid height and weight values.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await healthProfileService.updateProfile(formData);
      if (res.user && updateUser) {
        updateUser(res.user);
      }
      setProfile(res.profile);
      setSuccessMsg('Health profile saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to save health profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const sidebarNavItems = [
    { to: '/profile/personal', label: 'Personal Info', icon: UserIcon },
    { to: '/profile/bmi', label: 'BMI & Metrics', icon: Activity },
    { to: '/profile/medical', label: 'Medical & Allergies', icon: Heart },
    { to: '/profile/lifestyle', label: 'Lifestyle & Goals', icon: Flame },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <ProfilePictureUploader
            currentPictureUrl={user.profilePicture}
            userName={user.name}
            onUpload={handleUploadPicture}
          />

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
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

      {/* Main Page 2-Column Split View (Sidebar + Outlet) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar Menu Card */}
        <div className="md:col-span-1 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 shadow-sm">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1.5 overflow-x-auto md:overflow-x-visible">
            {sidebarNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right Main Outlet Panel Card */}
        <div className="md:col-span-3 space-y-4">
          {isLoading ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Loading your profile details...</p>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              {/* Feedback Alerts */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs font-semibold animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-3 text-xs font-semibold animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Outlet rendering child tab */}
              <Outlet
                context={{
                  user,
                  profile,
                  formData,
                  handleChange,
                  setFormData,
                  handleAddAllergy,
                  handleRemoveAllergy,
                  handleAddMedical,
                  handleRemoveMedical,
                  handleUploadPicture,
                  isUploadingPicture,
                }}
              />

              {/* Bottom Action Save Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {profile?.updatedAt ? `Last updated: ${new Date(profile.updatedAt).toLocaleDateString()}` : ''}
                </span>

                <button
                  onClick={handleSaveAll}
                  disabled={isSubmitting || isLoading}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-white" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
