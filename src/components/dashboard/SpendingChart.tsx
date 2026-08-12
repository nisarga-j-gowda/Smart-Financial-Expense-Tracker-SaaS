import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinancial } from '../../context/FinancialContext';
import { ChartSkeleton } from '../common/Skeleton';

type TimeRange = '7d' | '1m' | '6m' | '1y';

export const SpendingChart: React.FC = () => {
  const { monthlyTrends, formatINR, isLoading } = useFinancial();
  const [range, setRange] = useState<TimeRange>('6m');

  if (isLoading || !monthlyTrends.length) {
    return <ChartSkeleton />;
  }

  // Generate data based on selected filter range
  let chartData = monthlyTrends;
  if (range === '7d') {
    chartData = [
      { month: 'Mon', income: 0, expenses: 1200, savings: 0 },
      { month: 'Tue', income: 8500, expenses: 2100, savings: 6400 },
      { month: 'Wed', income: 0, expenses: 5200, savings: 0 },
      { month: 'Thu', income: 0, expenses: 1500, savings: 0 },
      { month: 'Fri', income: 0, expenses: 3800, savings: 0 },
      { month: 'Sat', income: 0, expenses: 2800, savings: 0 },
      { month: 'Sun', income: 55000, expenses: 12000, savings: 43000 },
    ];
  } else if (range === '1m') {
    chartData = [
      { month: 'Week 1', income: 55000, expenses: 14200, savings: 40800 },
      { month: 'Week 2', income: 0, expenses: 6800, savings: 0 },
      { month: 'Week 3', income: 8500, expenses: 5100, savings: 3400 },
      { month: 'Week 4', income: 0, expenses: 5449, savings: 0 },
    ];
  } else if (range === '1y') {
    chartData = [
      { month: 'Sep', income: 45000, expenses: 26000, savings: 19000 },
      { month: 'Oct', income: 47000, expenses: 28000, savings: 19000 },
      { month: 'Nov', income: 46000, expenses: 27000, savings: 19000 },
      { month: 'Dec', income: 52000, expenses: 32000, savings: 20000 },
      { month: 'Jan', income: 48000, expenses: 29000, savings: 19000 },
      { month: 'Feb', income: 50000, expenses: 30000, savings: 20000 },
      ...monthlyTrends,
    ];
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="capitalize text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">{formatINR(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Spending & Income Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare monthly inflows against total living expenses and net savings.
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex bg-slate-50 p-1 rounded-lg text-xs font-semibold text-slate-500">
          {(['7d', '1m', '6m', '1y'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 transition-all rounded-md cursor-pointer ${
                range === r
                  ? 'bg-white shadow-sm text-indigo-600 font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '1m' ? '30 Days' : r === '6m' ? '6 Months' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Indicators */}
      <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600" />
          <span>Expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Savings</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#4F46E5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
            <Area
              type="monotone"
              dataKey="savings"
              name="Savings"
              stroke="#A855F7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSavings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
