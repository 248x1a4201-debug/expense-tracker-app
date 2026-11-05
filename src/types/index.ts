export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Food'
  | 'Shopping'
  | 'Transportation'
  | 'Education'
  | 'Entertainment'
  | 'Healthcare'
  | 'Bills'
  | 'Travel'
  | 'Other';

export type IncomeSource =
  | 'Salary'
  | 'Freelancing'
  | 'Business'
  | 'Pocket Money'
  | 'Investments'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'UPI / Bank'
  | 'PayPal'
  | 'Other';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | IncomeSource;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  paymentMethod: PaymentMethod;
  description: string;
  receiptImage?: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  createdAt: number;
}

export interface Budget {
  id: string;
  category: ExpenseCategory | 'Total';
  monthlyLimit: number;
  month: string; // YYYY-MM
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  targetDate: string; // YYYY-MM-DD
  categoryIcon: string;
  color: string;
  notes?: string;
}

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | IncomeSource;
  paymentMethod: PaymentMethod;
  frequency: RecurringFrequency;
  nextDueDate: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: string;
  currencySymbol: string;
  monthlyTotalBudget: number;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'budget_alert' | 'daily_reminder' | 'savings_goal' | 'summary';
  isRead: boolean;
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  isDarkMode: boolean;
  dailyReminderEnabled: boolean;
  reminderTime: string;
  budgetAlertThreshold: number; // e.g. 80 means 80%
}
