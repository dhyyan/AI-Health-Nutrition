import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

export const VerifyOtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>(location.state?.email || '');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) return;
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const authData = await authService.verifyOtp({ email, otp });
      login(authData);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || timer > 0) return;
    setError(null);
    setInfo(null);
    setResending(true);

    try {
      const res = await authService.resendOtp(email);
      setInfo(res.message || 'New OTP sent to your email.');
      setTimer(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto mb-3 text-sky-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-outfit">Verify Email OTP</h2>
          <p className="text-slate-500 text-sm mt-1">Enter the 6-digit code sent to your email</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{info}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full tracking-widest text-center text-xl font-bold py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full mt-2 btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:text-slate-400 inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP Code'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Back to{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
