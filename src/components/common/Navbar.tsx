import React from 'react';
import { Wallet, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'login' | 'register' | 'dashboard') => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { isAuthenticated, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Fin<span className="text-indigo-600">Track</span>
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 transition-colors">
            Features
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-600 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 transition-colors">
            Pricing
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2.5 text-slate-700 hover:text-indigo-600 font-semibold text-sm transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={loginAsDemo}
                className="px-4 py-2.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold text-sm rounded-xl transition-colors"
              >
                Quick Demo
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 animate-fade-in">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left font-medium text-slate-700 hover:text-indigo-600 py-1"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left font-medium text-slate-700 hover:text-indigo-600 py-1"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left font-medium text-slate-700 hover:text-indigo-600 py-1"
          >
            Pricing
          </button>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-center shadow-sm"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="w-full py-2.5 text-slate-700 font-semibold border border-slate-200 rounded-xl text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await loginAsDemo();
                    onNavigate('dashboard');
                  }}
                  className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-center"
                >
                  Try Quick Demo
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('register');
                  }}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl text-center shadow-sm"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
