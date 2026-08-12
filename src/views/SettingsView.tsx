import React, { useState } from 'react';
import { User, Bell, Lock, Sliders, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useToast } from '../components/common/Toast';

export const SettingsView: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [dateFormat, setDateFormat] = useState(user?.dateFormat || 'DD/MM/YYYY');
  const [defaultCategory, setDefaultCategory] = useState(user?.defaultCategory || 'Food');

  const [budgetAlerts, setBudgetAlerts] = useState(user?.budgetAlerts ?? true);
  const [recurringAlerts, setRecurringAlerts] = useState(user?.recurringAlerts ?? true);
  const [goalAlerts, setGoalAlerts] = useState(user?.goalAlerts ?? true);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const updated = await authService.updateProfile({
        fullName,
        avatarUrl,
        currency,
        dateFormat,
        defaultCategory: defaultCategory as any,
        budgetAlerts,
        recurringAlerts,
        goalAlerts,
      });

      updateUser(updated.user);
      addToast('Profile Updated', 'Your preferences have been saved.');
    } catch (err: any) {
      addToast('Error', err.response?.data?.message || 'Failed to update settings', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Error', 'Please enter current and new passwords', 'error');
      return;
    }

    setIsChangingPass(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      addToast('Password Changed', 'Your security password has been updated.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      addToast('Error', err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  const avatarSeeds = ['Rahul', 'Ananya', 'Vikram', 'Priya', 'Aarav'];

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account & App Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your profile, currency preferences, notification triggers, and security credentials.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile & Preferences Form */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">User Profile</h2>
              <p className="text-xs text-slate-500">Personal details and avatar selection</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            {/* Avatar Selector */}
            <div>
              <label className="block text-slate-600 mb-2 font-bold">Choose Profile Avatar</label>
              <div className="flex items-center gap-3">
                {avatarSeeds.map((seed) => {
                  const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                  return (
                    <img
                      key={seed}
                      src={url}
                      alt={seed}
                      onClick={() => setAvatarUrl(url)}
                      className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all ${
                        avatarUrl === url
                          ? 'border-indigo-600 ring-4 ring-indigo-100 scale-105'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 text-slate-500 text-xs font-semibold rounded-xl border border-slate-200 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Preferences Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">System Preferences</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Primary Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Default Category</label>
                  <select
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Notification Triggers</h3>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'b', label: 'Budget Limit Warnings & Exceeded Alerts', state: budgetAlerts, setter: setBudgetAlerts },
                  { id: 'r', label: 'Recurring Subscriptions & EMI Due Reminders', state: recurringAlerts, setter: setRecurringAlerts },
                  { id: 'g', label: 'Savings Goal Milestone Achievements', state: goalAlerts, setter: setGoalAlerts },
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                    <span className="text-xs text-slate-700 font-semibold">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {isSavingProfile ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>

        {/* Change Password Security Card */}
        <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Security Credentials</h2>
              <p className="text-xs text-slate-500">Update account password</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs rounded-xl transition-colors"
            >
              Sign Out All Devices
            </button>

            <button
              type="submit"
              disabled={isChangingPass}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              {isChangingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
