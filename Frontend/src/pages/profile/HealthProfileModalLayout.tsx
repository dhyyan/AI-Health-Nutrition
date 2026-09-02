import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Activity,
  Heart,
  Flame,
  X,
  Save,
  Loader2,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HealthProfile } from '../../types';
import { healthProfileService, UpdateHealthProfilePayload } from '../../services/healthProfile.service';

export const HealthProfileModalLayout: React.FC = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Centered Large Modal Card Container */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] max-h-[850px] flex flex-col border border-slate-800/80 overflow-hidden">
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30 font-outfit text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-outfit leading-tight">Health Profile</h2>
              <p className="text-xs text-slate-400">Manage your physical metrics, medical history & lifestyle preferences</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (Split: Internal Sidebar + Main Outlet) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Internal Left Sidebar */}
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/40 p-4 shrink-0 flex flex-row md:flex-col justify-between overflow-x-auto md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-2">
            <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1.5 w-full">
              {sidebarNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area (Outlet rendering active sub-tab) */}
          <main className="flex-1 p-5 sm:p-6 overflow-y-auto bg-slate-900/50">
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">Loading profile data...</p>
              </div>
            ) : (
              <>
                {/* Feedback Alerts */}
                {successMsg && (
                  <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-center space-x-2 text-xs font-semibold animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 flex items-center space-x-2 text-xs font-semibold animate-in fade-in">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

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
              </>
            )}
          </main>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {profile?.updatedAt ? (
              <span>Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</span>
            ) : (
              <span>Complete your health profile to customize recommendations</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition border border-transparent"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSubmitting || isLoading}
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
