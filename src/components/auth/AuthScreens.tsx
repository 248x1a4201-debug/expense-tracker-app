import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  PieChart,
  ArrowRight,
  Mail,
  Lock,
  User as UserIcon,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface AuthScreensProps {
  onLoginSuccess: (email: string) => void;
  currencySymbol: string;
}

type AuthMode = 'splash' | 'welcome' | 'login' | 'register' | 'forgot_password';

export const AuthScreens: React.FC<AuthScreensProps> = ({
  onLoginSuccess,
  currencySymbol,
}) => {
  const [mode, setMode] = useState<AuthMode>('splash');
  const [welcomeSlide, setWelcomeSlide] = useState(0);

  // Form states
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Johnson');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Splash auto-transition
  React.useEffect(() => {
    if (mode === 'splash') {
      const timer = setTimeout(() => {
        setMode('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const welcomeSlides = [
    {
      title: 'Take Control of Your Money',
      desc: 'Track every dollar, euro, or rupee spent and watch your net worth grow effortlessly.',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Smart Category Budgets',
      desc: 'Set custom spending caps for groceries, dining, bills, and get notified before exceeding limits.',
      icon: PieChart,
      color: 'from-teal-500 to-emerald-700',
    },
    {
      title: 'Crush Savings Goals',
      desc: 'Automate progress towards emergency funds, vacations, gadgets, and celebrate milestones.',
      icon: ShieldCheck,
      color: 'from-emerald-600 to-emerald-800',
    },
  ];

  // 1. Splash Screen
  if (mode === 'splash') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white select-none">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
            <span className="text-4xl font-extrabold font-mono text-white">{currencySymbol}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Smart Expense</h1>
        <p className="text-xs text-emerald-400 tracking-wider uppercase font-semibold">
          Financial Intelligence
        </p>

        <div className="w-36 h-1 bg-slate-800 rounded-full mt-10 overflow-hidden">
          <div className="w-full h-full bg-emerald-500 rounded-full animate-[shimmer_1.5s_infinite]" />
        </div>

        <button
          onClick={() => setMode('welcome')}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Tap to skip
        </button>
      </div>
    );
  }

  // 2. Welcome Onboarding Screen
  if (mode === 'welcome') {
    const slide = welcomeSlides[welcomeSlide];
    const SlideIcon = slide.icon;

    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white select-none">
        {/* Skip button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setMode('login')}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Skip to Login
          </button>
        </div>

        {/* Slide Graphic */}
        <div className="flex flex-col items-center text-center my-auto px-4">
          <div
            className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${slide.color} flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 mb-8`}
          >
            <SlideIcon className="w-14 h-14 stroke-[1.8]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">
            {slide.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
            {slide.desc}
          </p>

          {/* Carousel dots */}
          <div className="flex items-center gap-2 mt-8">
            {welcomeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setWelcomeSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  welcomeSlide === idx
                    ? 'w-6 bg-emerald-600 dark:bg-emerald-400'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA Action Buttons */}
        <div className="space-y-3 pb-4">
          {welcomeSlide < welcomeSlides.length - 1 ? (
            <button
              onClick={() => setWelcomeSlide((prev) => prev + 1)}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setMode('register')}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMode('login')}
            className="w-full h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            I already have an account
          </button>
        </div>
      </div>
    );
  }

  // 3. Login Screen
  if (mode === 'login') {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-900 select-none overflow-y-auto">
        <div className="max-w-sm mx-auto w-full pt-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white mb-3 shadow-md shadow-emerald-600/30">
              <span className="font-extrabold text-2xl font-mono">{currencySymbol}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your credentials to manage your expenses
            </p>
          </div>

          {/* Quick Demo Login Pill */}
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Demo Account Ready
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                alex.johnson@example.com
              </p>
            </div>
            <button
              onClick={() => onLoginSuccess('alex.johnson@example.com')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              One-Click Sign In
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email || !password) {
                setErrorMessage('Please fill in both email and password');
                return;
              }
              onLoginSuccess(email);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer mt-2"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer Switch */}
        <div className="text-center pt-6 pb-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => setMode('register')}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    );
  }

  // 4. Registration Screen
  if (mode === 'register') {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-900 select-none overflow-y-auto">
        <div className="max-w-sm mx-auto w-full pt-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Start managing budgets and achieving savings
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name || !email || !password) {
                setErrorMessage('All fields are required');
                return;
              }
              if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match');
                return;
              }
              onLoginSuccess(email);
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer mt-4"
            >
              Complete Registration
            </button>
          </form>
        </div>

        <div className="text-center pt-4 pb-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    );
  }

  // 5. Forgot Password Screen
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-900 select-none">
      <div className="max-w-sm mx-auto w-full pt-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 border border-slate-200 dark:border-slate-700">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Enter your email and we'll simulate sending you a password recovery instruction.
          </p>
        </div>

        {resetSent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              We have sent an authentication reset token to <span className="font-semibold">{email}</span>.
            </p>
            <button
              onClick={() => setMode('login')}
              className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setResetSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Send Reset Instructions
            </button>
          </form>
        )}
      </div>

      <div className="text-center pt-4 pb-2">
        <button
          onClick={() => setMode('login')}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium cursor-pointer"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};
