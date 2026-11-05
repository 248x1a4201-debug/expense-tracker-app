import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Transaction, ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES } from '../../data/initialData';

interface AnalyticsScreenProps {
  transactions: Transaction[];
  currencySymbol: string;
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  transactions,
  currencySymbol,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Group by category for Category-wise Pie / Donut Chart
  const categoryData = useMemo(() => {
    const expenseOnly = transactions.filter((t) => t.type === 'expense');
    const totalExp = expenseOnly.reduce((sum, t) => sum + t.amount, 0);

    const map = new Map<string, { amount: number; count: number }>();
    expenseOnly.forEach((t) => {
      const cur = map.get(t.category) || { amount: 0, count: 0 };
      map.set(t.category, { amount: cur.amount + t.amount, count: cur.count + 1 });
    });

    const list = Array.from(map.entries())
      .map(([cat, val]) => {
        const meta = EXPENSE_CATEGORIES.find((c) => c.name === cat) || {
          color: '#64748b',
        };
        const percentage = totalExp > 0 ? (val.amount / totalExp) * 100 : 0;
        return {
          category: cat,
          amount: val.amount,
          count: val.count,
          percentage,
          color: meta.color,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { list, totalExp };
  }, [transactions]);

  // Highest spending category
  const highestCategory = categoryData.list[0] || null;

  // Total Income, Expense, and Savings
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Chart series data generator based on timeframe
  const chartSeries = useMemo(() => {
    if (timeframe === 'daily') {
      // Last 7 days
      const days: { label: string; income: number; expense: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const dateStr = d.toISOString().substring(0, 10);
        const label = d.toLocaleDateString(undefined, { weekday: 'short' });
        const inc = transactions
          .filter((t) => t.type === 'income' && t.date === dateStr)
          .reduce((sum, t) => sum + t.amount, 0);
        const exp = transactions
          .filter((t) => t.type === 'expense' && t.date === dateStr)
          .reduce((sum, t) => sum + t.amount, 0);
        days.push({ label, income: inc, expense: exp });
      }
      return days;
    }

    if (timeframe === 'weekly') {
      // 4 weeks of current month
      return [
        { label: 'Wk 1', income: 1200, expense: 450 },
        { label: 'Wk 2', income: 1500, expense: 620 },
        { label: 'Wk 3', income: 850, expense: 380 },
        { label: 'Wk 4', income: 1950, expense: 510 },
      ];
    }

    if (timeframe === 'yearly') {
      // Past 5 years
      return [
        { label: '2022', income: 38000, expense: 24000 },
        { label: '2023', income: 45000, expense: 28000 },
        { label: '2024', income: 52000, expense: 32000 },
        { label: '2025', income: 59000, expense: 36000 },
        { label: '2026', income: 64000, expense: 39500 },
      ];
    }

    // Default: Monthly (Past 6 months)
    return [
      { label: 'Jun', income: 4200, expense: 2400 },
      { label: 'Jul', income: 4500, expense: 2600 },
      { label: 'Aug', income: 4300, expense: 2100 },
      { label: 'Sep', income: 4800, expense: 2900 },
      { label: 'Oct', income: 5100, expense: 2700 },
      { label: 'Nov', income: totalIncome || 5350, expense: totalExpense || 2850 },
    ];
  }, [timeframe, transactions, totalIncome, totalExpense]);

  // Max value for bar heights
  const maxBarValue = Math.max(
    ...chartSeries.map((d) => Math.max(d.income, d.expense)),
    100
  );

  // SVG Donut calculation
  const donutRadius = 70;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedAngle = 0;

  return (
    <div className="flex-1 pb-24 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive Financial Insights & Charts
          </p>
        </div>

        {/* Timeframe selector pill */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
          {(['daily', 'weekly', 'monthly', 'yearly'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tf === 'daily' ? 'Day' : tf === 'weekly' ? 'Wk' : tf === 'monthly' ? 'Mo' : 'Yr'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* KPI Strip: Savings & Income vs Expense */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-slate-400 text-xs block mb-1">Total Net Savings</span>
            <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {currencySymbol}{netSavings.toFixed(0)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Savings Ratio: <strong className="text-slate-700 dark:text-slate-300">{savingsRate}%</strong>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <span className="text-slate-400 text-xs block mb-1">Top Expense Driver</span>
            <span className="text-sm font-black text-slate-900 dark:text-white truncate block">
              {highestCategory?.category || 'N/A'}
            </span>
            <span className="text-[11px] text-rose-500 font-semibold block mt-1 tabular-nums">
              {highestCategory ? `${highestCategory.percentage.toFixed(0)}% of expenses` : '0%'}
            </span>
          </div>
        </div>

        {/* Bar Chart: Income vs Expense Comparison */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Income vs Expense Flow ({timeframe.toUpperCase()})
              </h3>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-500">Expense</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Bars */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100 dark:border-slate-700">
            {chartSeries.map((item, idx) => {
              const incHeight = Math.max(10, Math.round((item.income / maxBarValue) * 140));
              const expHeight = Math.max(10, Math.round((item.expense / maxBarValue) * 140));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Income Bar */}
                    <div
                      style={{ height: `${incHeight}px` }}
                      className="w-3 sm:w-4 bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-all cursor-pointer relative group/bar"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/bar:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-md whitespace-nowrap z-20 font-mono">
                        +{currencySymbol}{item.income}
                      </div>
                    </div>

                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}px` }}
                      className="w-3 sm:w-4 bg-rose-500 rounded-t-md hover:bg-rose-400 transition-all cursor-pointer relative group/bar"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/bar:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-md whitespace-nowrap z-20 font-mono">
                        -{currencySymbol}{item.expense}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category-wise Expense SVG Donut / Pie Chart */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Category-wise Expense Breakdown
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              Total: {currencySymbol}{categoryData.totalExp.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={donutRadius}
                  className="stroke-slate-100 dark:stroke-slate-700"
                  strokeWidth="24"
                  fill="none"
                />
                {categoryData.list.map((item) => {
                  const strokeDasharray = `${(item.percentage / 100) * donutCircumference} ${donutCircumference}`;
                  const strokeDashoffset = -accumulatedAngle;
                  accumulatedAngle += (item.percentage / 100) * donutCircumference;

                  return (
                    <circle
                      key={item.category}
                      cx="100"
                      cy="100"
                      r={donutRadius}
                      stroke={item.color}
                      strokeWidth="24"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      fill="none"
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice(item.category)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[11px] text-slate-400 font-medium">
                  {hoveredSlice || 'Expenses'}
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {hoveredSlice
                    ? `${categoryData.list
                        .find((c) => c.category === hoveredSlice)
                        ?.percentage.toFixed(0)}%`
                    : `${categoryData.list.length} Cats`}
                </span>
              </div>
            </div>

            {/* Category Legend & List */}
            <div className="flex-1 w-full space-y-2">
              {categoryData.list.slice(0, 5).map((item) => (
                <div
                  key={item.category}
                  onMouseEnter={() => setHoveredSlice(item.category)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    hoveredSlice === item.category
                      ? 'bg-emerald-50 dark:bg-emerald-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {currencySymbol}{item.amount.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Financial Summary Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Monthly Financial Summary
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <h4 className="text-sm font-bold leading-relaxed text-slate-200">
            You maintained a healthy <span className="text-emerald-400 font-extrabold">{savingsRate}%</span> savings rate this cycle.
          </h4>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Total In</span>
              <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">
                +{currencySymbol}{totalIncome.toFixed(0)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Out</span>
              <span className="text-xs font-bold text-rose-400 font-mono tabular-nums">
                -{currencySymbol}{totalExpense.toFixed(0)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Net Stored</span>
              <span className="text-xs font-bold text-white font-mono tabular-nums">
                {currencySymbol}{netSavings.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
