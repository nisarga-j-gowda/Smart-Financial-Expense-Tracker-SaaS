import React, { useState } from 'react';
import { X, Repeat } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { RecurringFrequency, TransactionCategory } from '../../types';

export const RecurringModal: React.FC = () => {
  const { isAddRecurringOpen, setIsAddRecurringOpen, addRecurring } = useFinancial();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Bills');
  const [frequency, setFrequency] = useState<RecurringFrequency>('Monthly');
  const [nextPaymentDate, setNextPaymentDate] = useState(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [note, setNote] = useState('');
  const [autoDeduct, setAutoDeduct] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAddRecurringOpen) return null;

  const handleClose = () => {
    setIsAddRecurringOpen(false);
    setName('');
    setAmount('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter item name');
      return;
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addRecurring({
        name: name.trim(),
        amount: num,
        category,
        type: 'expense',
        frequency,
        nextPaymentDate,
        note: note.trim(),
        autoDeduct,
      });
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save recurring item');
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
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Add Recurring Payment</h3>
              <p className="text-xs text-slate-500">
                Automate reminders for subscriptions, rent & EMIs.
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-600 mb-1 font-bold">Item Name</label>
            <input
              type="text"
              placeholder="e.g. Netflix, Apartment Rent, Gym, Cult.fit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 649"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-bold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="Bills">Bills & Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Food">Food & Dining</option>
                <option value="Shopping">Shopping</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Next Due Date</label>
              <input
                type="date"
                value={nextPaymentDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-bold">Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. HDFC Auto-debit, Indiranagar flat"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-medium rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="autoDeduct"
              checked={autoDeduct}
              onChange={(e) => setAutoDeduct(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="autoDeduct" className="text-xs text-slate-600 font-medium cursor-pointer">
              Autopay enabled (Alert me 2 days before charge)
            </label>
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
              {isSubmitting ? 'Saving...' : 'Save Recurring Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
