import React from 'react';
import {
  X,
  Calendar,
  Clock,
  CreditCard,
  Edit2,
  Trash2,
  Repeat,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Share2,
} from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  currencySymbol: string;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  currencySymbol,
}) => {
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Ribbon */}
        <div
          className={`p-6 text-white text-center relative ${
            isIncome
              ? 'bg-gradient-to-br from-emerald-600 to-teal-500'
              : 'bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-3">
            {isIncome ? (
              <ArrowDownLeft className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>

          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">
            {transaction.type}
          </h3>
          <p className="text-3xl font-extrabold mt-1 tracking-tight font-mono tabular-nums">
            {isIncome ? '+' : '-'}
            {currencySymbol}
            {transaction.amount.toFixed(2)}
          </p>
          <p className="text-sm font-medium opacity-90 mt-1">{transaction.title}</p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Category</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {transaction.category}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Payment Method</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {transaction.paymentMethod}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {transaction.date}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Time</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {transaction.time}
              </span>
            </div>
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Description / Note
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {transaction.description}
              </p>
            </div>
          )}

          {/* Recurring Tag */}
          {transaction.isRecurring && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Repeat className="w-4 h-4" />
              <span>
                Recurring: Repeats <span className="font-bold">{transaction.recurringFrequency}</span>
              </span>
            </div>
          )}

          {/* Receipt Image if present */}
          {transaction.receiptImage && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Attached Receipt
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                <img
                  src={transaction.receiptImage}
                  alt="Receipt"
                  className="w-full max-h-48 object-contain bg-white"
                />
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              className="flex-1 h-11 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Delete this transaction?')) {
                  onDelete(transaction.id);
                  onClose();
                }
              }}
              className="h-11 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
