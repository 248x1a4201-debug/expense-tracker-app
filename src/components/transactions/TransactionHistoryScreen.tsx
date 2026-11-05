import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Calendar,
  X,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Transaction, TransactionType, ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '../../data/initialData';
import { StorageService } from '../../services/storageService';

interface TransactionHistoryScreenProps {
  transactions: Transaction[];
  currencySymbol: string;
  onSelectTransaction: (tx: Transaction) => void;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
}

type DateFilterOption = 'all' | 'today' | 'week' | 'month';
type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  transactions,
  currencySymbol,
  onSelectTransaction,
  onOpenAddExpense,
  onOpenAddIncome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().substring(0, 10);
    const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString().substring(0, 10);
    const currentMonthPrefix = now.toISOString().substring(0, 7);

    return transactions
      .filter((t) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = t.title.toLowerCase().includes(q);
          const matchesCategory = t.category.toLowerCase().includes(q);
          const matchesDesc = (t.description || '').toLowerCase().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesDesc) return false;
        }

        // Type
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;

        // Category
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

        // Date
        if (dateFilter === 'today' && t.date !== todayStr) return false;
        if (dateFilter === 'week' && t.date < oneWeekAgo) return false;
        if (dateFilter === 'month' && !t.date.startsWith(currentMonthPrefix)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
        if (sortBy === 'date_asc') return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
        if (sortBy === 'amount_desc') return b.amount - a.amount;
        if (sortBy === 'amount_asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, dateFilter, sortBy]);

  // Totals for current filtered set
  const filteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    StorageService.exportToCSV(filteredTransactions, currencySymbol);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex-1 pb-24 select-none overflow-y-auto">
      {/* Top App Bar */}
      <div className="sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Transaction History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredTransactions.length} records found
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              title="Export filtered records to CSV"
              className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-500 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={handlePrintPDF}
              title="Print / PDF Statement"
              className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-500 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, note, or category..."
            className="w-full h-10 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Segmented Type Toggle */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex-1 p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-xl flex">
            {(['all', 'expense', 'income'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showFilters || categoryFilter !== 'all' || dateFilter !== 'all'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expandable Advanced Filters (Date range & Sort & Category) */}
        {showFilters && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
            {/* Date filter pills */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Date Range
              </span>
              <div className="flex flex-wrap gap-1">
                {(['all', 'today', 'week', 'month'] as DateFilterOption[]).map((df) => (
                  <button
                    key={df}
                    onClick={() => setDateFilter(df)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize cursor-pointer ${
                      dateFilter === df
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {df === 'all' ? 'All Time' : df === 'week' ? 'Past 7 Days' : df === 'month' ? 'This Month' : 'Today'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Sort By
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
              >
                <option value="date_desc">Date: Newest First</option>
                <option value="date_asc">Date: Oldest First</option>
                <option value="amount_desc">Amount: Highest First</option>
                <option value="amount_asc">Amount: Lowest First</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Category Filter
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {[...EXPENSE_CATEGORIES, ...INCOME_SOURCES].map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setDateFilter('all');
                  setSortBy('date_desc');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Mini Bar of Filtered Results */}
      <div className="px-5 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
        <div>
          <span>Filtered Income: </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            +{currencySymbol}{filteredIncome.toFixed(2)}
          </span>
        </div>
        <div>
          <span>Filtered Expense: </span>
          <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            -{currencySymbol}{filteredExpense.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-5 pt-3 space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Search className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No transactions match your search
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try adjusting your query, date range, or category filter to discover records.
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 shadow-xs flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <TrendingUp className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <TrendingDown className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{tx.category}</span>
                      <span>·</span>
                      <span className="tabular-nums">{tx.date}</span>
                    </div>
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
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[10px] text-slate-400">{tx.paymentMethod}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
