import React, { useState } from 'react';
import { X, Target, PlusCircle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

interface GoalModalProps {
  addingMoneyGoalId?: string | null;
  onCloseAddMoney?: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ addingMoneyGoalId, onCloseAddMoney }) => {
  const { isAddGoalOpen, setIsAddGoalOpen, addGoal, addMoneyToGoal, goals } = useFinancial();

  // Create Goal State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSaved, setCurrentSaved] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [category, setCategory] = useState('General');

  // Add Money State
  const [addAmount, setAddAmount] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAddMoneyMode = !!addingMoneyGoalId;
  const activeGoal = goals.find((g) => g.id === addingMoneyGoalId);

  if (!isAddGoalOpen && !isAddMoneyMode) return null;

  const handleClose = () => {
    setIsAddGoalOpen(false);
    if (onCloseAddMoney) onCloseAddMoney();
    setName('');
    setTargetAmount('');
    setCurrentSaved('');
    setAddAmount('');
    setError('');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter goal name');
      return;
    }
    const tNum = Number(targetAmount);
    if (isNaN(tNum) || tNum <= 0) {
      setError('Please enter a valid target amount');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addGoal({
        name: name.trim(),
        targetAmount: tNum,
        currentSaved: Number(currentSaved) || 0,
        targetDate,
        category,
      });
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMoneySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(addAmount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (addingMoneyGoalId) {
        await addMoneyToGoal(addingMoneyGoalId, num);
      }
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add money');
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
              {isAddMoneyMode ? <PlusCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isAddMoneyMode ? `Add Funds to ${activeGoal?.name}` : 'Create Savings Goal'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAddMoneyMode ? 'Deposit savings towards target' : 'Track milestones for key purchases & funds'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
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

        {isAddMoneyMode ? (
          <form onSubmit={handleAddMoneySubmit} className="space-y-5 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-slate-600 mb-1.5 font-bold">Amount to Deposit (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-base font-black rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
              >
                {isSubmitting ? 'Adding...' : 'Deposit Funds'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Goal Name</label>
              <input
                type="text"
                placeholder="e.g. Emergency Fund, New Laptop, Vacation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Target Amount (₹)</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-bold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Already Saved (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={currentSaved}
                  onChange={(e) => setCurrentSaved(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-bold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Savings">Savings</option>
                  <option value="Gadgets">Gadgets</option>
                  <option value="Travel">Travel</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Education">Education</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
              >
                {isSubmitting ? 'Creating...' : 'Save Goal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
