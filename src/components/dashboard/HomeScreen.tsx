import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  Minus,
  ArrowRight,
  Receipt,
  Wallet,
  Sparkles,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { Transaction, Budget, UserProfile } from '../../types';
import { EXPENSE_CATEGORIES } from '../../data/initialData';

interface HomeScreenProps {
  user: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  currencySymbol: string;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onViewAllTransactions: () => void;
  onNavigateToBudget: () => void;
  onNavigateToSavings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  transactions,
  budgets,
  currencySymbol,
  onOpenAddExpense,
  onOpenAddIncome,
  onSelectTransaction,
  onViewAllTransactions,
  onNavigateToBudget,
  onNavigateToSavings,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  // Calculate current month financial totals
  const currentMonthPrefix = new Date().toISOString().substring(0, 7);
  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonthPrefix)
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // Total budget utilization
  const totalBudget = budgets.find((b) => b.category === 'Total')?.monthlyLimit || user.monthlyTotalBudget || 3000;
  const budgetUtilization = Math.min(100, Math.round((totalExpense / totalBudget) * 100));

  // Get category badge color helper
  const getCategoryMeta = (catName: string) => {
    return EXPENSE_CATEGORIES.find((c) => c.name === catName) || {
      color: '#10b981',
      bgColor: '#ecfdf5',
    };
  };

  return (
    <div className="flex-1 pb-20 select-none overflow-y-auto">
      {/* Top Welcome Bar */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Welcome back,
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {user.name.split(' ')[0]} 👋
          </h2>
        </div>
        <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500/30 overflow-hidden bg-slate-200">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Total Balance Card (Emerald Gradient Glass) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-xl shadow-emerald-700/25">
          {/* Subtle geometric background waves */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute right-6 top-6 w-20 h-20 rounded-full bg-emerald-400/20 blur-lg pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-emerald-100">
              <span className="text-xs font-semibold tracking-wider uppercase opacity-90">
                Total Net Balance
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
                title={showBalance ? 'Hide balance' : 'Show balance'}
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-2 mb-4">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                {showBalance ? `${currencySymbol}${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
              </span>
            </div>

            {/* Income & Expense Split Strips */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-emerald-200 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-emerald-100/80 block">Total Income</span>
                  <span className="text-xs sm:text-sm font-bold truncate block tabular-nums">
                    {showBalance ? `+${currencySymbol}${totalIncome.toFixed(0)}` : '••••'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-4 h-4 text-rose-200 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-emerald-100/80 block">Total Expense</span>
                  <span className="text-xs sm:text-sm font-bold truncate block tabular-nums">
                    {showBalance ? `-${currencySymbol}${totalExpense.toFixed(0)}` : '••••'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenAddExpense}
            className="h-13 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 shadow-xs flex items-center justify-center gap-2.5 text-slate-800 dark:text-slate-100 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Minus className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-bold">Add Expense</span>
          </button>

          <button
            onClick={onOpenAddIncome}
            className="h-13 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-xs flex items-center justify-center gap-2.5 text-slate-800 dark:text-slate-100 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-bold">Add Income</span>
          </button>
        </div>

        {/* Monthly Budget & Savings Progress Strip */}
        <div className="grid grid-cols-2 gap-3">
          {/* Monthly Budget Status */}
          <div
            onClick={onNavigateToBudget}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly Budget</span>
              <span className="font-bold text-slate-800 dark:text-white tabular-nums">
                {budgetUtilization}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetUtilization > 90
                    ? 'bg-rose-500'
                    : budgetUtilization > 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Limit: {currencySymbol}{totalBudget}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Manage</span>
            </div>
          </div>

          {/* Current Month Savings Rate */}
          <div
            onClick={onNavigateToSavings}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Savings Rate</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {savingsRate}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>Saved: {currencySymbol}{Math.max(0, netBalance).toFixed(0)}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Goals</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <button
              onClick={onViewAllTransactions}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See all ({transactions.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 5).map((tx) => {
              const isIncome = tx.type === 'income';
              const meta = getCategoryMeta(tx.category);

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70 hover:border-emerald-500/50 shadow-xs flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs"
                      style={{
                        backgroundColor: isIncome ? '#10b981' : meta.color,
                      }}
                    >
                      {tx.category.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {tx.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {tx.category} · {tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span
                      className={`text-xs font-extrabold font-mono tabular-nums ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {currencySymbol}
                      {tx.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {tx.paymentMethod}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
