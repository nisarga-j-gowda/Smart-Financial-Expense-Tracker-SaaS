import React from 'react';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { Plus } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const TransactionsView: React.FC = () => {
  const { setIsAddTransactionOpen, setEditingTransaction } = useFinancial();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transactions Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, edit, or record all income and expense statements.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsAddTransactionOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      <RecentTransactions limit={12} showPagination={true} />
    </div>
  );
};
