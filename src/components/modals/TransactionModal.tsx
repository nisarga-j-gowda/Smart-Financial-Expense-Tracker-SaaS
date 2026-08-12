import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { TransactionType, ExpenseCategory, IncomeCategory, PaymentMethod } from '../../types';

export const TransactionModal: React.FC = () => {
  const {
    isAddTransactionOpen,
    setIsAddTransactionOpen,
    editingTransaction,
    setEditingTransaction,
    addTransaction,
    updateTransaction,
  } = useFinancial();

  const isEditing = !!editingTransaction;

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNotes(editingTransaction.notes || '');
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setNotes('');
    }
    setError('');
  }, [editingTransaction, isAddTransactionOpen]);

  // Adjust category when type switches
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('Food');
    } else {
      setCategory('Salary');
    }
  };

  if (!isAddTransactionOpen) return null;

  const handleClose = () => {
    setIsAddTransactionOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid positive amount in ₹');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        type,
        amount: num,
        description: description.trim(),
        category: category as any,
        date,
        paymentMethod,
        notes: notes.trim(),
      };

      if (isEditing && editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
      } else {
        await addTransaction(payload);
      }
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const expenseCategories: ExpenseCategory[] = [
    'Food',
    'Shopping',
    'Transportation',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Education',
    'Other',
  ];

  const incomeCategories: IncomeCategory[] = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? 'Edit Transaction' : 'Record New Transaction'}
              </h3>
              <p className="text-xs text-slate-500">
                Enter details to update your income & expense ledgers.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
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
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                type === 'expense'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                type === 'income'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Income
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-slate-600 mb-1.5 font-bold">Amount (in ₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-base font-black rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-600 mb-1.5 font-bold">Description</label>
            <input
              type="text"
              placeholder="e.g. Swiggy gourmet dinner, Client payout, Blinkit groceries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              required
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1.5 font-bold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
              >
                {type === 'expense'
                  ? expenseCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  : incomeCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1.5 font-bold">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-slate-600 mb-1.5 font-bold">Payment Method</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'] as PaymentMethod[]).map((pm) => (
                <button
                  type="button"
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all truncate ${
                    paymentMethod === pm
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-600 mb-1.5 font-bold">Notes (Optional)</label>
            <textarea
              placeholder="Add extra context or receipt tag..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-medium rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
