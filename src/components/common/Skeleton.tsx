import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
    </div>
    <div className="h-8 bg-slate-200 rounded w-36 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-28"></div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse h-80 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="h-5 bg-slate-200 rounded w-36"></div>
      <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
    </div>
    <div className="h-48 bg-slate-100 rounded-xl w-full flex items-end justify-between p-4 gap-2">
      <div className="bg-slate-200 h-1/2 w-full rounded-t"></div>
      <div className="bg-slate-200 h-3/4 w-full rounded-t"></div>
      <div className="bg-slate-200 h-1/3 w-full rounded-t"></div>
      <div className="bg-slate-200 h-2/3 w-full rounded-t"></div>
      <div className="bg-slate-200 h-4/5 w-full rounded-t"></div>
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 rounded w-40 mb-6"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-1"></div>
            <div className="h-3 bg-slate-200 rounded w-20"></div>
          </div>
        </div>
        <div className="h-5 bg-slate-200 rounded w-20"></div>
      </div>
    ))}
  </div>
);
