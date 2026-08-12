import React, { useState } from 'react';
import { Plus, Edit2, Trash2, PieChart, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { Budget } from '../types';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const BudgetsView: React.FC = () => {
  const { budgets, formatINR, setIsAddBudgetOpen, deleteBudget } = useFinancial();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const overallPct = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Budget Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Define and monitor category monthly limits to control spending.
          </p>
        </div>

        <button
          onClick={() => setIsAddBudgetOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Budget
        </button>
      </div>

      {/* Overall Budget Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Monthly Budget Cap</span>
            <h2 className="text-3xl font-black mt-1">
              {formatINR(totalBudgetSpent)} <span className="text-sm font-semibold text-slate-400">/ {formatINR(totalBudgetLimit)}</span>
            </h2>
          </div>

          <div className="px-4 py-2 bg-indigo-900/60 border border-indigo-700/50 rounded-2xl text-xs font-bold text-indigo-200 self-start sm:self-auto">
            {overallPct}% Total Utilized
          </div>
        </div>

        {/* Big Overall Progress Bar */}
        <div className="w-full bg-slate-800/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overallPct >= 100 ? 'bg-rose-500' : overallPct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, overallPct)}%` }}
          />
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400 text-xs">
            No active category budgets set. Click "Create Budget" above to start!
          </div>
        ) : (
          budgets.map((b) => {
            const pct = Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100));
            const remaining = Math.max(0, b.limitAmount - b.spentAmount);
            const isOver = pct >= 100;
            const isWarn = pct >= 75 && !isOver;

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{b.category}</h3>
                      <p className="text-[11px] text-slate-400">Monthly Cap</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isOver
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isWarn
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isOver ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>{isOver ? 'Over Budget' : isWarn ? 'Warning' : 'Safe'}</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{pct}% Used</span>
                    <span>Remaining: <span className="font-bold text-slate-900">{formatINR(remaining)}</span></span>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Stat Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Spent</span>
                    <span className="text-sm font-black text-slate-900">{formatINR(b.spentAmount)}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Limit</span>
                    <span className="text-sm font-black text-slate-900">{formatINR(b.limitAmount)}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setDeletingId(b.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteBudget(deletingId);
        }}
        title="Delete Budget"
        message="Are you sure you want to remove this category budget?"
      />
    </div>
  );
};
