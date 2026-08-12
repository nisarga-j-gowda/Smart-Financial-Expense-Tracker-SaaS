import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { CardSkeleton } from '../common/Skeleton';

export const SummaryCards: React.FC = () => {
  const { summary, formatINR, isLoading } = useFinancial();

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Balance',
      amount: formatINR(summary.totalBalance),
      change: `+${summary.balanceChangePct}%`,
      isPositive: summary.balanceChangePct >= 0,
      icon: Wallet,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-emerald-50 text-emerald-600',
      subtitle: 'Net available funds',
    },
    {
      title: 'Income',
      amount: formatINR(summary.totalIncome),
      change: `+${summary.incomeChangePct}%`,
      isPositive: true,
      icon: TrendingUp,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-600',
      subtitle: 'Salary & freelance credits',
    },
    {
      title: 'Expenses',
      amount: formatINR(summary.totalExpenses),
      change: `${summary.expensesChangePct}%`,
      isPositive: summary.expensesChangePct < 0,
      icon: TrendingDown,
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-600',
      subtitle: 'Living & bill payments',
    },
    {
      title: 'Net Savings',
      amount: formatINR(summary.totalSavings),
      change: `${summary.savingsRatePct}% rate`,
      isPositive: summary.savingsRatePct >= 20,
      icon: PiggyBank,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-emerald-50 text-emerald-600',
      subtitle: 'Amount saved this month',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`w-10 h-10 ${card.bgColor} ${card.iconColor} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${card.badgeBg} px-2 py-1 rounded-full flex items-center gap-0.5`}>
                {card.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {card.change}
              </span>
            </div>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{card.title}</p>
            <p className="text-2xl font-bold mt-1 text-slate-900">{card.amount}</p>
          </div>
        );
      })}
    </div>
  );
};
