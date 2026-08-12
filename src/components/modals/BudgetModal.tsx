import React, { useState } from 'react';
import { X, PieChart } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { ExpenseCategory } from '../../types';

export const BudgetModal: React.FC = () => {
  const { isAddBudgetOpen, setIsAddBudgetOpen, addBudget } = useFinancial();

  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [limitAmount, setLimitAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAddBudgetOpen) return null;

  const categories: ExpenseCategory[] = [
    'Food',
    'Shopping',
    'Transportation',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Education',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(limitAmount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid monthly budget limit');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addBudget({ category, limitAmount: num });
      setIsAddBudgetOpen(false);
      setLimitAmount('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Set Monthly Budget</h3>
              <p className="text-xs text-slate-500">
                Define category spending boundaries to stay on budget.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddBudgetOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-600 mb-1.5 font-bold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1.5 font-bold">Monthly Budget Limit (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                placeholder="e.g. 8000"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-base font-black rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddBudgetOpen(false)}
              className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Setting...' : 'Set Budget Limit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
