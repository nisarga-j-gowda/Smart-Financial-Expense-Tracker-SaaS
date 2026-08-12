import React, { useState } from 'react';
import { Repeat, Plus, Calendar, AlertCircle, CheckCircle2, Trash2, BellRing, CreditCard } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const RecurringView: React.FC = () => {
  const { recurring, formatINR, setIsAddRecurringOpen, deleteRecurring } = useFinancial();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate total monthly recurring commitments
  const totalMonthlyRecurring = recurring.reduce((acc, item) => {
    if (item.type === 'expense') {
      let monthlyVal = item.amount;
      if (item.frequency === 'Weekly') monthlyVal *= 4;
      if (item.frequency === 'Quarterly') monthlyVal /= 3;
      if (item.frequency === 'Yearly') monthlyVal /= 12;
      return acc + monthlyVal;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recurring Payments & Subscriptions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track automated subscriptions, rent, EMIs, and monthly utilities.
          </p>
        </div>

        <button
          onClick={() => setIsAddRecurringOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Recurring Payment
        </button>
      </div>

      {/* Overview Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <BellRing className="w-4 h-4" /> Monthly Fixed Commitments
          </span>
          <h2 className="text-3xl font-black">{formatINR(totalMonthlyRecurring)} <span className="text-sm font-medium text-slate-400">/ month</span></h2>
          <p className="text-xs text-slate-400">{recurring.length} active recurring subscriptions and bills</p>
        </div>

        <div className="p-4 bg-indigo-950/80 border border-indigo-800/60 rounded-2xl text-xs space-y-1 max-w-sm">
          <p className="font-bold text-indigo-200 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Approaching Due Date Alert
          </p>
          <p className="text-slate-300 leading-relaxed">
            Netflix payment of ₹649 is due in 2 days. Rent transfer of ₹12,000 scheduled on 15th.
          </p>
        </div>
      </div>

      {/* Recurring Timeline / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recurring.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400 text-xs">
            No recurring payments configured. Click "Add Recurring Payment" above!
          </div>
        ) : (
          recurring.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {item.frequency}
                  </span>
                </div>

                <div className="text-2xl font-black text-slate-900">
                  {formatINR(item.amount)}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3.5 h-3.5" /> Next Due Date</span>
                    <span className="font-bold text-indigo-600">{item.nextPaymentDate}</span>
                  </div>
                  {item.note && (
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 italic">
                      "{item.note}"
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Autopay Active
                </span>

                <button
                  onClick={() => setDeletingId(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteRecurring(deletingId);
        }}
        title="Remove Recurring Payment"
        message="Are you sure you want to stop tracking this recurring transaction?"
      />
    </div>
  );
};
