import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinancial } from '../../context/FinancialContext';
import { ExpenseCategory } from '../../types';
import { Tag, Receipt } from 'lucide-react';

export const CategoryPieChart: React.FC = () => {
  const { categories, formatINR, isLoading } = useFinancial();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(
    categories[0]?.category || 'Bills'
  );

  if (isLoading || !categories.length) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse h-80 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border-8 border-slate-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  const activeCategoryData = categories.find((c) => c.category === selectedCategory) || categories[0];

  const totalExpense = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Expense Breakdown</h2>
        <p className="text-xs text-slate-500 mt-0.5">Categorized monthly expense distributions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
        {/* Donut Chart */}
        <div className="h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="amount"
                onClick={(entry: any) => setSelectedCategory(entry.category as ExpenseCategory)}
                cursor="pointer"
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={selectedCategory === entry.category ? '#1E1B4B' : 'transparent'}
                    strokeWidth={selectedCategory === entry.category ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [formatINR(Number(value)), 'Spent']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Total overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Spent</span>
            <span className="text-sm font-black text-slate-900">{formatINR(totalExpense)}</span>
          </div>
        </div>

        {/* Selected Category Details Card */}
        {activeCategoryData && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeCategoryData.color }}
                />
                <h3 className="font-bold text-slate-900 text-sm">{activeCategoryData.category}</h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {activeCategoryData.percentage}% of total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Amount Spent</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">
                  {formatINR(activeCategoryData.amount)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Transactions</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-slate-400" />
                  {activeCategoryData.count} record{activeCategoryData.count > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Click any color wedge in the chart to inspect category details.
            </p>
          </div>
        )}
      </div>

      {/* Category Pills list */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        {categories.map((c) => (
          <button
            key={c.category}
            onClick={() => setSelectedCategory(c.category as ExpenseCategory)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === c.category
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
            <span>{c.category}</span>
            <span className="text-[10px] opacity-70">({c.percentage}%)</span>
          </button>
        ))}
      </div>
    </div>
  );
};
