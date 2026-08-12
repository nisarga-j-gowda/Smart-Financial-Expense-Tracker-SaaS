import React from 'react';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  Repeat,
  Target,
  Download,
  ShieldCheck,
  Check,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'dashboard') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { loginAsDemo } = useAuth();

  const handleDemoClick = async () => {
    await loginAsDemo();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs animate-fade-in">
                <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                <span>Next-Gen Smart Expense Manager</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Take Control of Your Money.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
                  Build Better Financial Habits.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                FinTrack gives you clarity on every Rupee spent. Monitor monthly budgets, track recurring subscriptions, set savings targets, and extract deep financial insights effortlessly.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('register')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  Start Tracking Free
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleDemoClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all"
                >
                  View Demo
                </button>
              </div>

              {/* Social proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Bank-grade 256-bit security</span>
                <span>•</span>
                <span>No credit card required</span>
              </div>
            </div>

            {/* Right Column Preview Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-xl lg:max-w-none rounded-3xl p-3 bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-indigo-100/50">
                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-inner p-4 sm:p-6 space-y-4 text-white">
                  {/* Mock Top bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="ml-2 text-xs font-mono text-slate-400">fintrack.app/dashboard</span>
                    </div>
                    <span className="text-xs bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-full">Live Demo</span>
                  </div>

                  {/* Mock Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Balance</span>
                      <h4 className="text-xl font-black text-white mt-1">₹1,85,500</h4>
                      <span className="text-[10px] text-emerald-400 font-bold">+12.4% this month</span>
                    </div>
                    <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Expenses</span>
                      <h4 className="text-xl font-black text-white mt-1">₹31,549</h4>
                      <span className="text-[10px] text-rose-400 font-bold">Food & Rent primary</span>
                    </div>
                  </div>

                  {/* Mock mini chart bars */}
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Monthly Trends</span>
                      <span className="text-indigo-400">Aug 2026</span>
                    </div>
                    <div className="h-20 flex items-end justify-between gap-2 pt-2">
                      <div className="bg-emerald-500/80 h-3/5 w-full rounded-t-sm" />
                      <div className="bg-indigo-500/80 h-4/5 w-full rounded-t-sm" />
                      <div className="bg-emerald-500/80 h-2/3 w-full rounded-t-sm" />
                      <div className="bg-indigo-500/80 h-full w-full rounded-t-sm" />
                      <div className="bg-purple-500/80 h-1/2 w-full rounded-t-sm" />
                    </div>
                  </div>

                  {/* Mock Recent Transaction */}
                  <div className="flex items-center justify-between text-xs bg-slate-800/90 p-3 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                        ₹
                      </div>
                      <div>
                        <p className="font-bold text-white">Monthly Tech Salary</p>
                        <p className="text-[10px] text-slate-400">Apex Solutions • Direct Deposit</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-400 text-sm">+₹55,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600">Powerful Core Features</h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything you need for total financial clarity
            </p>
            <p className="text-sm text-slate-600">
              Stop guessing where your money went. FinTrack aggregates, categorizes, and analyzes your finances in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Smart Expense Tracking',
                desc: 'Categorize food, bills, shopping, and entertainment with dynamic payment tags (UPI, Card, NetBanking).',
              },
              {
                icon: PieChart,
                title: 'Budget Management',
                desc: 'Set monthly category spending caps with automated safe, warning, and over-budget visual indicators.',
              },
              {
                icon: BarChart3,
                title: 'Spending Analytics',
                desc: 'Interactive Recharts visualizations with 7D, 1M, 6M, and 1Y comparisons and top spending categories.',
              },
              {
                icon: Repeat,
                title: 'Recurring Payment Alerts',
                desc: 'Never miss Netflix, rent, or EMI due dates with upcoming payment timelines and notification badges.',
              },
              {
                icon: Target,
                title: 'Financial Goals',
                desc: 'Set target milestones for Emergency Funds, new gadgets, or vacations with interactive progress tracking.',
              },
              {
                icon: Download,
                title: 'CSV Data Export',
                desc: 'Download clean CSV files filtered by custom date ranges or categories for taxes and accounting.',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 shadow-md shadow-indigo-200 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600">3 Simple Steps</h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">How FinTrack Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                desc: 'Register in seconds or use our instant one-click demo to test drive all pro features.',
              },
              {
                step: '02',
                title: 'Add & Categorize',
                desc: 'Record income, groceries, subscriptions, or rent. Watch budgets update automatically.',
              },
              {
                step: '03',
                title: 'Achieve Financial Goals',
                desc: 'Leverage smart AI insights, stay under budget, and grow your net worth month after month.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative space-y-4"
              >
                <span className="text-4xl font-black text-indigo-200 block">{s.step}</span>
                <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600">Simple Transparent Pricing</h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Start free, upgrade whenever</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {/* Free Tier */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ forever</span>
                </div>
                <p className="text-xs text-slate-600">Essential tracking for personal budgeting.</p>

                <ul className="space-y-3 text-xs font-medium text-slate-700 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited transactions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 5 category budgets</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard analytics & pie charts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> CSV exports</li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('register')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-8 border border-indigo-800 shadow-2xl shadow-indigo-900/30 space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pro SaaS</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹299</span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-300">Complete automation, goals & AI financial insights.</p>

                <ul className="space-y-3 text-xs font-medium text-slate-200 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Unlimited category budgets & goals</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Smart AI spending insights</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Recurring autopay notifications</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Priority 24/7 support</li>
                </ul>
              </div>

              <button
                onClick={handleDemoClick}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/50 transition-all"
              >
                Try Pro Demo Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to take control of your finances?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of smart users building wealth and managing expenses effortlessly with FinTrack.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-black text-base rounded-2xl shadow-2xl hover:bg-indigo-50 transition-all hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
