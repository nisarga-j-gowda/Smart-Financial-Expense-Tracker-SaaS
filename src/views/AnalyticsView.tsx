import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinancial } from '../context/FinancialContext';
import { Sparkles, TrendingUp, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { ChartSkeleton } from '../components/common/Skeleton';

export const AnalyticsView: React.FC = () => {
  const { monthlyTrends, categories, insights, formatINR, isLoading } = useFinancial();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  // Top spending categories ranked
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
          <p className="font-bold text-slate-300">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4 font-semibold">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span>{formatINR(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Analytics & Insights</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Deep data analysis, spending trends, and smart financial health indicators.
        </p>
      </div>

      {/* AI / Smart Financial Insights Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black">FinTrack Smart Financial Insights</h2>
            <p className="text-xs text-indigo-200">Automatically generated from your actual transaction activity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300 flex items-center gap-1">
                  {ins.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {ins.type === 'positive' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                  {ins.type === 'info' && <Info className="w-3.5 h-3.5 text-indigo-400" />}
                  {ins.title}
                </span>
                {ins.stat && (
                  <span className="text-[10px] font-bold bg-indigo-500/40 text-indigo-100 px-2 py-0.5 rounded-full">
                    {ins.stat}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{ins.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trends Line Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spending Trends Over Time</h3>
            <p className="text-xs text-slate-500">Historical monthly expense trajectory</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spending Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Category Spending Comparison</h3>
            <p className="text-xs text-slate-500">Total amount allocated across categories</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" name="Amount" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Income vs Expenses Comparison</h3>
            <p className="text-xs text-slate-500">Monthly gross inflows vs total outflows</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Spending Categories List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Expense Categories Ranked</h3>
            <p className="text-xs text-slate-500">Ranked by highest total monetary outflow</p>
          </div>

          <div className="space-y-3">
            {sortedCategories.map((c, idx) => (
              <div key={c.category} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">{c.category}</h4>
                    <span className="text-[10px] text-slate-400">{c.count} transactions</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 block">{formatINR(c.amount)}</span>
                  <span className="text-[10px] font-bold text-indigo-600">{c.percentage}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
