import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'dashboard') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('demo@fintrack.app');
  const [password, setPassword] = useState('demouser123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginAsDemo();
      onNavigate('dashboard');
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              Fin<span className="text-indigo-600">Track</span>
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to access your financial dashboard.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {forgotSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Password reset link sent to {email}.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-slate-600 text-xs">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] uppercase font-bold">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>One-Click Instant Demo Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500">
          Don’t have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};
