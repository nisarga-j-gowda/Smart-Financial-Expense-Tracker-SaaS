import React, { useState } from 'react';
import { Target, Plus, PlusCircle, Trash2, Calendar, Award, Sparkles } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { GoalModal } from '../components/modals/GoalModal';

export const GoalsView: React.FC = () => {
  const { goals, formatINR, setIsAddGoalOpen, deleteGoal } = useFinancial();

  const [addingMoneyGoalId, setAddingMoneyGoalId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totalTarget = goals.reduce((a, g) => a + g.targetAmount, 0);
  const totalSaved = goals.reduce((a, g) => a + g.currentSaved, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Savings Goals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Set and achieve milestones for emergency funds, gadgets, and life events.
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Goal
        </button>
      </div>

      {/* Goal Summary Banner */}
      <div className="bg-gradient-to-tr from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Total Savings Pool
            </span>
            <h2 className="text-3xl font-black">
              {formatINR(totalSaved)} <span className="text-sm font-semibold text-slate-400">/ {formatINR(totalTarget)}</span>
            </h2>
          </div>

          <div className="px-4 py-2 bg-emerald-900/60 border border-emerald-700/50 rounded-2xl text-xs font-bold text-emerald-200 self-start sm:self-auto">
            {overallPct}% Overall Achieved
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, overallPct)}%` }}
          />
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400 text-xs">
            No active savings goals. Click "Create New Goal" above!
          </div>
        ) : (
          goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentSaved / g.targetAmount) * 100));
            const remaining = Math.max(0, g.targetAmount - g.currentSaved);

            return (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{g.name}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">{g.category}</span>
                      </div>
                    </div>

                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      {pct}% Achieved
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Saved: <span className="font-bold text-slate-900">{formatINR(g.currentSaved)}</span></span>
                      <span>Target: <span className="font-bold text-slate-900">{formatINR(g.targetAmount)}</span></span>
                    </div>
                  </div>

                  {/* Target Date & Remaining */}
                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3.5 h-3.5" /> Target Date</span>
                      <span className="font-bold text-slate-800">{g.targetDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Remaining to Save</span>
                      <span className="font-bold text-emerald-600">{formatINR(remaining)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setAddingMoneyGoalId(g.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Funds
                  </button>

                  <button
                    onClick={() => setDeletingId(g.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
          if (deletingId) deleteGoal(deletingId);
        }}
        title="Delete Goal"
        message="Are you sure you want to delete this savings goal?"
      />

      <GoalModal
        addingMoneyGoalId={addingMoneyGoalId}
        onCloseAddMoney={() => setAddingMoneyGoalId(null)}
      />
    </div>
  );
};
