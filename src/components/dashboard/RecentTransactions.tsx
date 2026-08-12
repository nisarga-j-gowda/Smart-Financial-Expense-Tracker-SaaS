import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { Transaction, TransactionCategory, TransactionType } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { TableSkeleton } from '../common/Skeleton';

interface RecentTransactionsProps {
  limit?: number;
  showPagination?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  limit,
  showPagination = true,
}) => {
  const {
    transactions,
    deleteTransaction,
    setEditingTransaction,
    setIsAddTransactionOpen,
    formatINR,
    isLoading,
  } = useFinancial();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 8;

  // View Details Modal
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);

  // Delete Confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) {
    return <TableSkeleton />;
  }

  // Filter logic
  let filtered = transactions.filter((t) => {
    if (selectedType !== 'all' && t.type !== selectedType) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categoriesList = Array.from(new Set(transactions.map((t) => t.category)));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor and manage all logged income and expense statements.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search description, category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 outline-none text-slate-700 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 outline-none text-slate-700 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-3">Transaction</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  No transactions match your search criteria.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {tx.description.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {tx.description}
                        </span>
                        {tx.notes && <p className="text-[11px] text-slate-400 truncate max-w-xs">{tx.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500 text-xs whitespace-nowrap">{tx.date}</td>
                  <td
                    className={`px-6 py-3 text-right font-bold ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatINR(tx.amount)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                    <span className="text-[11px] capitalize text-slate-500">{tx.status}</span>
                  </td>
                  <td className="px-6 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewingTx(tx)}
                        title="View details"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTransaction(tx);
                          setIsAddTransactionOpen(true);
                        }}
                        title="Edit transaction"
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(tx.id)}
                        title="Delete"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">No transactions found.</div>
        ) : (
          paginated.map((tx) => (
            <div key={tx.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{tx.description}</h4>
                  <span className="text-[11px] text-slate-500">{tx.date} • {tx.paymentMethod}</span>
                </div>
                <span
                  className={`text-base font-black ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                <span className="px-2.5 py-0.5 bg-white border border-slate-200 rounded-md font-semibold text-slate-700">
                  {tx.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingTx(tx)}
                    className="p-1 text-slate-500 hover:text-indigo-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTransaction(tx);
                      setIsAddTransactionOpen(true);
                    }}
                    className="p-1 text-slate-500 hover:text-amber-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(tx.id)}
                    className="p-1 text-slate-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing page {currentPage} of {totalPages} ({filtered.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteTransaction(deletingId);
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this financial statement record? This will recalculate your dashboard totals."
      />

      {/* View Details Modal */}
      {viewingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Transaction Details</h3>
              <button
                onClick={() => setViewingTx(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                {viewingTx.category} ({viewingTx.type})
              </span>
              <h2
                className={`text-3xl font-black mt-1 ${
                  viewingTx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {viewingTx.type === 'income' ? '+' : '-'}{formatINR(viewingTx.amount)}
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Description</span>
                <span className="font-bold text-slate-900">{viewingTx.description}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Date</span>
                <span className="font-semibold text-slate-800">{viewingTx.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                  {viewingTx.paymentMethod}
                </span>
              </div>
              {viewingTx.notes && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Notes</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700 italic">
                    "{viewingTx.notes}"
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewingTx(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
