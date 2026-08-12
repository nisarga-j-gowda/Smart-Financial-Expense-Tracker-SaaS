import React from 'react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { useFinancial } from '../context/FinancialContext';
import { PieChart, Repeat, Target, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { DashboardTab } from '../components/dashboard/Sidebar';

interface DashboardViewProps {
  onNavigateTab: (tab: DashboardTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { budgets, goals, recurring, formatINR, setIsAddBudgetOpen, setIsAddGoalOpen, setIsAddRecurringOpen } = useFinancial();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top: Summary Cards */}
      <SummaryCards />

      {/* Middle: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <SpendingChart />
        </div>
        <div className="lg:col-span-5">
          <CategoryPieChart />
        </div>
      </div>

      {/* Bottom Layout: Transactions + Widget Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-8">
          <RecentTransactions limit={6} />
        </div>

        {/* Right Widgets Column: Budgets, Recurring, Goals Quick Peek */}
        <div className="lg:col-span-4 space-y-6">
          {/* Budget Quick Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <PieChart className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Active Budgets</h3>
              </div>
              <button
                onClick={() => onNavigateTab('budgets')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {budgets.slice(0, 3).map((b) => {
                const pct = Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100));
                const isOver = pct >= 100;
                const isWarn = pct >= 80 && !isOver;

                return (
                  <div key={b.id} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{b.category}</span>
                      <span className="text-slate-500">
                        {formatINR(b.spentAmount)} / <span className="font-bold text-slate-900">{formatINR(b.limitAmount)}</span>
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isOver ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Recurring Payments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Repeat className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Upcoming Payments</h3>
              </div>
              <button
                onClick={() => onNavigateTab('recurring')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recurring.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{r.name}</h4>
                    <p className="text-[10px] text-slate-500">Due {r.nextPaymentDate} ({r.frequency})</p>
                  </div>
                  <span className="font-black text-slate-900">{formatINR(r.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Goals Quick Progress */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Savings Goals</h3>
              </div>
              <button
                onClick={() => onNavigateTab('goals')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {goals.slice(0, 2).map((g) => {
                const pct = Math.min(100, Math.round((g.currentSaved / g.targetAmount) * 100));
                return (
                  <div key={g.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{g.name}</span>
                      <span className="text-emerald-600">{pct}%</span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Saved: {formatINR(g.currentSaved)}</span>
                      <span>Target: {formatINR(g.targetAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
