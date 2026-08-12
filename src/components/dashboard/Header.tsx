import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Plus,
  Menu,
  CheckCheck,
  Download,
  Info,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onNavigateTab }) => {
  const { user } = useAuth();
  const {
    selectedMonth,
    setSelectedMonth,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsAddTransactionOpen,
    exportCSV,
  } = useFinancial();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Generate month options (current + 5 previous)
  const monthOptions = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date();
    d.setMonth(d.getMonth() - idx);
    const value = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return { value, label };
  });

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Greeting & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {user?.fullName?.split(' ')[0] || 'Abhishek'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Here is your financial overview for this month
          </p>
        </div>
      </div>

      {/* Controls & Quick Actions */}
      <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
        {/* Month Selector */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-colors">
          <Calendar className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-800 font-medium cursor-pointer pr-1"
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 space-y-3 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto space-y-2.5 divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`pt-2.5 flex items-start gap-3 cursor-pointer p-2 rounded-xl transition-colors ${
                        !n.read ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'budget' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {n.type === 'recurring' && <Info className="w-4 h-4 text-indigo-500" />}
                        {n.type === 'goal' && <Award className="w-4 h-4 text-emerald-500" />}
                        {n.type === 'large_expense' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        {n.type === 'system' && <Info className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">{n.title}</h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Export CSV Quick Action */}
        <button
          onClick={() => {
            if (onNavigateTab) {
              onNavigateTab('export');
            } else {
              exportCSV();
            }
          }}
          className="bg-white border border-slate-200 text-slate-600 px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Add Transaction Button */}
        <button
          onClick={() => setIsAddTransactionOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};
