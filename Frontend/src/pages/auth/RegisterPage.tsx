import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/auth.service';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Field validation rules
  const nameError = touched.name && formData.name.trim().length < 2 ? 'Name must be at least 2 characters' : null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailError = touched.email && !emailRegex.test(formData.email) ? 'Please enter a valid email address' : null;
  const passwordError = touched.password && formData.password.length < 6 ? 'Password must be at least 6 characters' : null;

  const isFormValid =
    formData.name.trim().length >= 2 &&
    emailRegex.test(formData.email) &&
    formData.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (!isFormValid) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await authService.register(formData);
      setSuccess(res.message || 'Registration successful!');
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: formData.email, otp: res.data?.otp } });
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-emerald-600">
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit">Create Account</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Start tracking your health & nutrition with AI</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
            <span>{success} Redirecting to OTP verification...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  nameError
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500'
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                }`}
              />
            </div>
            {nameError && <p className="mt-1 text-xs text-rose-600 font-medium">{nameError}</p>}
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  emailError
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500'
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                }`}
              />
            </div>
            {emailError && <p className="mt-1 text-xs text-rose-600 font-medium">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                  passwordError
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500'
                    : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                }`}
              />
            </div>
            {passwordError ? (
              <p className="mt-1 text-xs text-rose-600 font-medium">{passwordError}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">Must be at least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
