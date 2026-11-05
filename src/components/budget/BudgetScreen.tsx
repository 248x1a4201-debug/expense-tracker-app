import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  DollarSign,
  TrendingDown,
  Calendar,
  X,
  ShieldAlert,
} from 'lucide-react';
import { Budget, Transaction, ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES } from '../../data/initialData';

interface BudgetScreenProps {
  budgets: Budget[];
  transactions: Transaction[];
  currencySymbol: string;
  onSetBudget: (category: ExpenseCategory | 'Total', monthlyLimit: number) => void;
}

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  budgets,
  transactions,
  currencySymbol,
  onSetBudget,
}) => {
  const currentMonthPrefix = new Date().toISOString().substring(0, 7);
  const currentMonthTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonthPrefix)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'Total'>('Food');
  const [limitInput, setLimitInput] = useState('');

  // Total spent and total budget
  const totalExpense = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBudgetObj = budgets.find((b) => b.category === 'Total');
  const totalLimit = totalBudgetObj ? totalBudgetObj.monthlyLimit : 3000;
  const totalRemaining = Math.max(0, totalLimit - totalExpense);
  const totalUtilization = Math.round((totalExpense / totalLimit) * 100);

  // Category breakdown calculation
  const categoryBudgets = EXPENSE_CATEGORIES.map((cat) => {
    const budgetObj = budgets.find((b) => b.category === cat.name);
    const limit = budgetObj ? budgetObj.monthlyLimit : 0;
    const spent = currentMonthTransactions
      .filter((t) => t.category === cat.name)
      .reduce((sum, t) => sum + t.amount, 0);
    const utilization = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const remaining = Math.max(0, limit - spent);

    return {
      category: cat.name,
      color: cat.color,
      limit,
      spent,
      utilization,
      remaining,
    };
  });

  const handleOpenEdit = (category: ExpenseCategory | 'Total', currentLimit: number) => {
    setSelectedCategory(category);
    setLimitInput(currentLimit > 0 ? String(currentLimit) : '');
    setIsModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(limitInput);
    if (!isNaN(num) && num >= 0) {
      onSetBudget(selectedCategory, num);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex-1 pb-24 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Budget Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monthly Spending Limits & Utilization
          </p>
        </div>

        <button
          onClick={() => handleOpenEdit('Food', 0)}
          className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Set Budget</span>
        </button>
      </div>

      <div className="px-5 space-y-4">
        {/* Total Monthly Budget Overview Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Total Monthly Budget
            </span>
            <button
              onClick={() => handleOpenEdit('Total', totalLimit)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Cap</span>
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums font-mono">
                {currencySymbol}{totalExpense.toFixed(0)}
              </span>
              <span className="text-xs text-slate-400 ml-1">
                / {currencySymbol}{totalLimit.toFixed(0)}
              </span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                totalUtilization >= 100
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : totalUtilization >= 80
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {totalUtilization}% Utilized
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalUtilization >= 100
                  ? 'bg-rose-500'
                  : totalUtilization >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, totalUtilization)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60">
            <span>Remaining Allowance:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
              {currencySymbol}{totalRemaining.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Warning Banner if over threshold */}
        {totalUtilization >= 85 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p>
              <span className="font-bold">Budget Warning: </span>
              You have spent {totalUtilization}% of your monthly cap. Consider pacing remaining
              expenses.
            </p>
          </div>
        )}

        {/* Category-wise Budgets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Category Spending Caps
            </h3>
            <span className="text-[11px] text-slate-400">Current Month</span>
          </div>

          <div className="space-y-3">
            {categoryBudgets.map((item) => {
              const hasBudget = item.limit > 0;

              return (
                <div
                  key={item.category}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.category}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handleOpenEdit(item.category as ExpenseCategory, item.limit)
                      }
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                      <span>{hasBudget ? 'Edit' : 'Set Cap'}</span>
                    </button>
                  </div>

                  {hasBudget ? (
                    <>
                      <div className="flex items-baseline justify-between text-xs mb-1.5">
                        <span className="font-mono text-slate-800 dark:text-slate-200 font-bold tabular-nums">
                          {currencySymbol}{item.spent.toFixed(0)}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">
                            / {currencySymbol}{item.limit.toFixed(0)}
                          </span>
                        </span>
                        <span
                          className={`font-semibold tabular-nums text-[11px] ${
                            item.utilization >= 100
                              ? 'text-rose-600 font-bold'
                              : item.utilization >= 80
                              ? 'text-amber-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {item.utilization}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.utilization >= 100
                              ? 'bg-rose-500'
                              : item.utilization >= 80
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, item.utilization)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Remaining: {currencySymbol}{item.remaining.toFixed(0)}</span>
                        {item.utilization >= 100 && (
                          <span className="text-rose-600 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Exceeded!
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                      <span>Spent this month: {currencySymbol}{item.spent.toFixed(2)}</span>
                      <button
                        onClick={() =>
                          handleOpenEdit(item.category as ExpenseCategory, 0)
                        }
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                      >
                        + Add Limit
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Set / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Set Monthly Budget
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as ExpenseCategory | 'Total')
                  }
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Total">Total Monthly Budget</option>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Limit ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="10"
                  min="0"
                  required
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
