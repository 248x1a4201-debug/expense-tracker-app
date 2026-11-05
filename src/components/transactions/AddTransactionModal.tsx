import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Tag,
  CreditCard,
  FileText,
  Camera,
  Repeat,
  DollarSign,
  Check,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Transaction,
  TransactionType,
  ExpenseCategory,
  IncomeSource,
  PaymentMethod,
  RecurringFrequency,
} from '../../types';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '../../data/initialData';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (txData: Omit<Transaction, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
  currencySymbol: string;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialType = 'expense',
  editingTransaction,
  currencySymbol,
}) => {
  if (!isOpen) return null;

  const isEditing = !!editingTransaction;
  const now = new Date();
  const todayStr = now.toISOString().substring(0, 10);
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const [type, setType] = useState<TransactionType>(
    editingTransaction?.type || initialType
  );
  const [title, setTitle] = useState(editingTransaction?.title || '');
  const [amount, setAmount] = useState<string>(
    editingTransaction ? String(editingTransaction.amount) : ''
  );
  const [category, setCategory] = useState<string>(
    editingTransaction?.category || (initialType === 'expense' ? 'Food' : 'Salary')
  );
  const [date, setDate] = useState<string>(editingTransaction?.date || todayStr);
  const [time, setTime] = useState<string>(editingTransaction?.time || currentTimeStr);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    editingTransaction?.paymentMethod || 'Credit Card'
  );
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [receiptImage, setReceiptImage] = useState<string | undefined>(
    editingTransaction?.receiptImage
  );
  const [isRecurring, setIsRecurring] = useState<boolean>(
    editingTransaction?.isRecurring || false
  );
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>(
    editingTransaction?.recurringFrequency || 'monthly'
  );
  const [error, setError] = useState('');

  const paymentOptions: PaymentMethod[] = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'UPI / Bank',
    'PayPal',
    'Other',
  ];

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory('Food');
    } else {
      setCategory('Salary');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSampleReceipt = () => {
    // Generate simple receipt mock visual as data URL
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 500);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('STORE RECEIPT', 120, 50);

      ctx.font = '14px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(`Date: ${date} ${time}`, 40, 90);
      ctx.fillText(`Method: ${paymentMethod}`, 40, 115);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 135);
      ctx.lineTo(360, 135);
      ctx.stroke();

      ctx.font = '16px monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(title || 'Item Purchased', 40, 175);
      ctx.fillText(`${currencySymbol}${amount || '0.00'}`, 280, 175);

      ctx.beginPath();
      ctx.moveTo(40, 220);
      ctx.lineTo(360, 220);
      ctx.stroke();

      ctx.font = 'bold 18px monospace';
      ctx.fillText('TOTAL PAID', 40, 260);
      ctx.fillText(`${currencySymbol}${amount || '0.00'}`, 280, 260);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('Thank you for your business!', 90, 360);
      ctx.fillText('Verified Digital Tax Invoice', 100, 385);

      setReceiptImage(canvas.toDataURL('image/png'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        amount: numAmount,
        type,
        category: category as any,
        date,
        time,
        paymentMethod,
        description: description.trim(),
        receiptImage,
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
      },
      editingTransaction?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {isEditing
              ? `Edit ${type === 'expense' ? 'Expense' : 'Income'}`
              : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Expense vs Income Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Amount Large Input */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Amount ({currencySymbol})
            </span>
            <div className="flex items-center justify-center mt-1">
              <span className="text-3xl font-extrabold text-slate-400 mr-1">{currencySymbol}</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                className="w-48 text-center text-3xl font-black text-slate-900 dark:text-white bg-transparent focus:outline-none tabular-nums"
                autoFocus={!isEditing}
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Payee
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'expense' ? 'e.g. Whole Foods Groceries' : 'e.g. Monthly Salary'}
              className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_SOURCES).map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-1.5">
              {paymentOptions.map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    paymentMethod === pm
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, store name, or receipt note..."
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Optional Receipt Attachment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Receipt / Invoice Image
              </label>
              {!receiptImage && (
                <button
                  type="button"
                  onClick={generateSampleReceipt}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Generate Digital Receipt
                </button>
              )}
            </div>

            {receiptImage ? (
              <div className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={receiptImage}
                    alt="Receipt thumbnail"
                    className="w-12 h-14 object-cover rounded-lg border border-slate-200"
                  />
                  <div>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
                      Receipt Attached
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Ready to save</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReceiptImage(undefined)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <Camera className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Upload photo or scan receipt
                </span>
                <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Recurring Transaction Toggle */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Recurring Transaction
                </span>
                <span className="text-[10px] text-slate-500">Auto-repeat at selected interval</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {isRecurring && (
            <div className="flex items-center gap-2 pl-2">
              <span className="text-xs text-slate-500">Frequency:</span>
              {(['daily', 'weekly', 'monthly'] as RecurringFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setRecurringFrequency(freq)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize cursor-pointer ${
                    recurringFrequency === freq
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this transaction?')) {
                    onDelete(editingTransaction.id);
                    onClose();
                  }
                }}
                className="h-12 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}

            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {isEditing ? 'Save Changes' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
