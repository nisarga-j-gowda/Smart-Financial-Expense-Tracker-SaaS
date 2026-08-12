import React, { useState } from 'react';
import { Download, FileSpreadsheet, Filter, CheckCircle2 } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../components/common/Toast';

export const ExportView: React.FC = () => {
  const { transactions, formatINR } = useFinancial();
  const { addToast } = useToast();

  const [exportRange, setExportRange] = useState<'all' | 'month' | 'custom'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const categoriesList = Array.from(new Set(transactions.map((t) => t.category)));

  const handleDownloadCSV = () => {
    let filtered = [...transactions];

    if (exportRange === 'month') {
      const currentMonth = new Date().toISOString().slice(0, 7);
      filtered = filtered.filter((t) => t.date.startsWith(currentMonth));
    } else if (exportRange === 'custom') {
      filtered = filtered.filter((t) => t.date >= startDate && t.date <= endDate);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (filtered.length === 0) {
      addToast('No Data to Export', 'There are no transactions matching your export filters.', 'warning');
      return;
    }

    // Build CSV Content
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)', 'Payment Method', 'Notes', 'Status'];
    const rows = filtered.map((t) => [
      `"${t.date}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.type}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      `"${t.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    // Trigger Browser Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FinTrack_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV Downloaded', `Successfully exported ${filtered.length} transaction records.`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Export Data (CSV)</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate structured CSV spreadsheets for tax filing, accounting, or backups.
        </p>
      </div>

      <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">CSV Export Configuration</h2>
            <p className="text-xs text-slate-500">Configure parameters for your exported file</p>
          </div>
        </div>

        <div className="space-y-5 text-xs font-semibold text-slate-700">
          {/* Time Range Selector */}
          <div>
            <label className="block text-slate-600 mb-2 font-bold">Date Range Scope</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Transactions' },
                { id: 'month', label: 'Current Month' },
                { id: 'custom', label: 'Custom Range' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setExportRange(r.id as any)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                    exportRange === r.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Pickers */}
          {exportRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-white text-xs font-semibold rounded-xl border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-bold">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-white text-xs font-semibold rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div>
            <label className="block text-slate-600 mb-1.5 font-bold">Filter Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-xs font-semibold rounded-xl border border-slate-200 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Included Fields preview */}
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Columns Included in CSV Output
            </span>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
              {['Date', 'Description', 'Category', 'Type', 'Amount (₹)', 'Payment Method', 'Notes', 'Status'].map(
                (f) => (
                  <span key={f} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {f}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Download CTA */}
          <button
            onClick={handleDownloadCSV}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download CSV Spreadsheet
          </button>
        </div>
      </div>
    </div>
  );
};
