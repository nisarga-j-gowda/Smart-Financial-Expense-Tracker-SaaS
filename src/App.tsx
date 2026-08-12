import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { ToastProvider } from './components/common/Toast';
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { RegisterPage } from './views/RegisterPage';
import { Sidebar, DashboardTab } from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { BudgetsView } from './views/BudgetsView';
import { GoalsView } from './views/GoalsView';
import { RecurringView } from './views/RecurringView';
import { AnalyticsView } from './views/AnalyticsView';
import { ExportView } from './views/ExportView';
import { SettingsView } from './views/SettingsView';
import { TransactionModal } from './components/modals/TransactionModal';
import { BudgetModal } from './components/modals/BudgetModal';
import { GoalModal } from './components/modals/GoalModal';
import { RecurringModal } from './components/modals/RecurringModal';

// App Views
type AppView = 'landing' | 'login' | 'register' | 'app';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [appView, setAppView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');

  // If user is authenticated and on auth pages, switch to app view
  React.useEffect(() => {
    if (isAuthenticated && (appView === 'login' || appView === 'register' || appView === 'landing')) {
      setAppView('app');
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-bounce shadow-xl shadow-indigo-200">
          <span className="font-black text-xl">FT</span>
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500 tracking-wider uppercase">Loading FinTrack SaaS...</p>
      </div>
    );
  }

  // Unauthenticated Public Navigation
  if (!isAuthenticated && appView !== 'app') {
    if (appView === 'login') {
      return <LoginPage onNavigate={(view) => setAppView(view as AppView)} />;
    }
    if (appView === 'register') {
      return <RegisterPage onNavigate={(view) => setAppView(view as AppView)} />;
    }
    return <LandingPage onNavigate={(view) => setAppView(view as AppView)} />;
  }

  // Main Authenticated Dashboard Shell
  return (
    <FinancialProvider>
      <div className="min-h-screen bg-slate-50/80 text-slate-800 flex font-sans selection:bg-indigo-500 selection:text-white">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={() => setAppView('landing')}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          {/* Top Header */}
          <Header onNavigateTab={setActiveTab} />

          {/* Tab Content View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && <DashboardView onNavigateTab={setActiveTab} />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'budgets' && <BudgetsView />}
            {activeTab === 'goals' && <GoalsView />}
            {activeTab === 'recurring' && <RecurringView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'export' && <ExportView />}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>

        {/* Global Action Modals */}
        <TransactionModal />
        <BudgetModal />
        <GoalModal />
        <RecurringModal />
      </div>
    </FinancialProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainAppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
