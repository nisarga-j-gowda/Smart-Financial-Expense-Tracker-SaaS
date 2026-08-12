import React from 'react';
import { Wallet, Heart, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Fin<span className="text-indigo-400">Track</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Smart financial management platform empowering individuals to track expenses, automate budgets, and achieve financial freedom.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL Encrypted</span>
              <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-indigo-400" /> Private & Secure</span>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Expense Tracker</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Budget Planner</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Savings Goals</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Recurring Alerts</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">CSV Export</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Features</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Analytics Engine</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Monthly Trends</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Category Breakdown</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Smart Insights</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Overview</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FinTrack Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern smart personal finance.
          </p>
        </div>
      </div>
    </footer>
  );
};
