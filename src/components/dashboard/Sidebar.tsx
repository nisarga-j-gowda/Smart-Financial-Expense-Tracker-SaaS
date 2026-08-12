import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Repeat,
  BarChart3,
  Download,
  Settings,
  LogOut,
  Wallet,
  X,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type DashboardTab =
  | 'overview'
  | 'transactions'
  | 'budgets'
  | 'goals'
  | 'recurring'
  | 'analytics'
  | 'export'
  | 'settings';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as DashboardTab, label: 'Transactions', icon: ReceiptText },
    { id: 'budgets' as DashboardTab, label: 'Budgets', icon: PieChart },
    { id: 'goals' as DashboardTab, label: 'Goals', icon: Target },
    { id: 'recurring' as DashboardTab, label: 'Recurring', icon: Repeat },
    { id: 'analytics' as DashboardTab, label: 'Analytics', icon: BarChart3 },
    { id: 'export' as DashboardTab, label: 'Export Data', icon: Download },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: DashboardTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white text-slate-700 w-64 border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelect('overview')}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-950 tracking-tight leading-none">
              FinTrack
            </h1>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="px-4 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
          <div
            onClick={() => handleSelect('settings')}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0 mr-1"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
            <div className="truncate">
              <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                {user?.fullName || 'Abhishek Verma'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.plan || 'Pro Plan'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 z-30">{navContent}</aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpenMobile(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />
          {/* Drawer content */}
          <div className="relative z-10 w-64 max-w-full h-full shadow-2xl animate-slide-right">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
