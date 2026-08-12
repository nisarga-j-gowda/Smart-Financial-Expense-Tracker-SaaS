import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'dashboard') => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(fullName.trim(), email.trim(), password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Get Started Free</h2>
          <p className="text-xs text-slate-500">Create your account to start tracking expenses.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="rahul@example.com"
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
                  placeholder="Minimum 6 characters"
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

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Sign in instead
          </button>
        </p>
      </div>
    </div>
  );
};
