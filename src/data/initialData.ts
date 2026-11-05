import {
  Transaction,
  Budget,
  SavingsGoal,
  RecurringTransaction,
  UserProfile,
  AppNotification,
  AppSettings,
  ExpenseCategory,
  IncomeSource,
} from '../types';

export const EXPENSE_CATEGORIES: {
  name: ExpenseCategory;
  icon: string;
  color: string;
  bgColor: string;
}[] = [
  { name: 'Food', icon: 'Utensils', color: '#10b981', bgColor: '#ecfdf5' },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#3b82f6', bgColor: '#eff6ff' },
  { name: 'Transportation', icon: 'Car', color: '#f59e0b', bgColor: '#fffbeb' },
  { name: 'Education', icon: 'GraduationCap', color: '#8b5cf6', bgColor: '#f5f3ff' },
  { name: 'Entertainment', icon: 'Film', color: '#ec4899', bgColor: '#fdf2f8' },
  { name: 'Healthcare', icon: 'HeartPulse', color: '#ef4444', bgColor: '#fef2f2' },
  { name: 'Bills', icon: 'Receipt', color: '#06b6d4', bgColor: '#ecfeff' },
  { name: 'Travel', icon: 'Plane', color: '#14b8a6', bgColor: '#f0fdfa' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#64748b', bgColor: '#f8fafc' },
];

export const INCOME_SOURCES: {
  name: IncomeSource;
  icon: string;
  color: string;
  bgColor: string;
}[] = [
  { name: 'Salary', icon: 'Briefcase', color: '#10b981', bgColor: '#ecfdf5' },
  { name: 'Freelancing', icon: 'Laptop', color: '#3b82f6', bgColor: '#eff6ff' },
  { name: 'Business', icon: 'TrendingUp', color: '#8b5cf6', bgColor: '#f5f3ff' },
  { name: 'Pocket Money', icon: 'Coins', color: '#f59e0b', bgColor: '#fffbeb' },
  { name: 'Investments', icon: 'PieChart', color: '#06b6d4', bgColor: '#ecfeff' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#64748b', bgColor: '#f8fafc' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  currency: 'USD',
  currencySymbol: '$',
  monthlyTotalBudget: 3500,
  createdAt: '2026-01-15',
};

export const INITIAL_SETTINGS: AppSettings = {
  currency: 'USD',
  currencySymbol: '$',
  isDarkMode: false,
  dailyReminderEnabled: true,
  reminderTime: '20:00',
  budgetAlertThreshold: 85,
};

// Generate realistic date strings for current month and recent days
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
const pad = (n: number) => String(n).padStart(2, '0');

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_01',
    title: 'Monthly Tech Salary',
    amount: 4500,
    type: 'income',
    category: 'Salary',
    date: `${currentYear}-${currentMonth}-01`,
    time: '09:00',
    paymentMethod: 'UPI / Bank',
    description: 'Direct corporate salary deposit for senior software engineer role.',
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: 'tx_02',
    title: 'Whole Foods Grocery',
    amount: 142.5,
    type: 'expense',
    category: 'Food',
    date: `${currentYear}-${currentMonth}-${pad(Math.max(1, now.getDate() - 1))}`,
    time: '18:30',
    paymentMethod: 'Credit Card',
    description: 'Fresh vegetables, organic milk, oats, berries, and pantry staples.',
    createdAt: Date.now() - 1 * 86400000,
  },
  {
    id: 'tx_03',
    title: 'Apartment Fiber Internet',
    amount: 65.0,
    type: 'expense',
    category: 'Bills',
    date: `${currentYear}-${currentMonth}-02`,
    time: '11:15',
    paymentMethod: 'Credit Card',
    description: 'High-speed gigabit fiber internet connection for home office.',
    isRecurring: true,
    recurringFrequency: 'monthly',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'tx_04',
    title: 'Flutter UI Client Project',
    amount: 850.0,
    type: 'income',
    category: 'Freelancing',
    date: `${currentYear}-${currentMonth}-03`,
    time: '16:45',
    paymentMethod: 'PayPal',
    description: 'Milestone 2 payment for responsive mobile app design and integration.',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'tx_05',
    title: 'Downtown Fuel & Parking',
    amount: 48.0,
    type: 'expense',
    category: 'Transportation',
    date: `${currentYear}-${currentMonth}-${pad(now.getDate())}`,
    time: '14:20',
    paymentMethod: 'Debit Card',
    description: 'Gas station fuel refill plus 2 hours municipal parking pass.',
    createdAt: Date.now() - 10000000,
  },
  {
    id: 'tx_06',
    title: 'Online Computer Science Course',
    amount: 79.99,
    type: 'expense',
    category: 'Education',
    date: `${currentYear}-${currentMonth}-02`,
    time: '19:00',
    paymentMethod: 'Credit Card',
    description: 'Advanced mobile architecture and distributed systems certification.',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'tx_07',
    title: 'Weekend Cinema & Dinner',
    amount: 86.4,
    type: 'expense',
    category: 'Entertainment',
    date: `${currentYear}-${currentMonth}-${pad(Math.max(1, now.getDate() - 2))}`,
    time: '20:15',
    paymentMethod: 'Credit Card',
    description: 'IMAX movie tickets and artisanal ramen dinner with colleagues.',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'tx_08',
    title: 'Annual Dental Checkup',
    amount: 120.0,
    type: 'expense',
    category: 'Healthcare',
    date: `${currentYear}-${currentMonth}-01`,
    time: '10:00',
    paymentMethod: 'Credit Card',
    description: 'Routine oral prophylaxis and preventative dental cleaning.',
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: 'tx_09',
    title: 'Quarterly Stock Dividend',
    amount: 215.3,
    type: 'income',
    category: 'Investments',
    date: `${currentYear}-${currentMonth}-04`,
    time: '08:00',
    paymentMethod: 'UPI / Bank',
    description: 'Dividend yield distribution from index funds portfolio.',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'tx_10',
    title: 'New Running Shoes',
    amount: 110.0,
    type: 'expense',
    category: 'Shopping',
    date: `${currentYear}-${currentMonth}-${pad(Math.max(1, now.getDate() - 3))}`,
    time: '15:10',
    paymentMethod: 'Credit Card',
    description: 'Lightweight marathon running sneakers with arch support.',
    createdAt: Date.now() - 3 * 86400000,
  },
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bd_total',
    category: 'Total',
    monthlyLimit: 3000,
    month: `${currentYear}-${currentMonth}`,
  },
  {
    id: 'bd_food',
    category: 'Food',
    monthlyLimit: 600,
    month: `${currentYear}-${currentMonth}`,
  },
  {
    id: 'bd_shopping',
    category: 'Shopping',
    monthlyLimit: 400,
    month: `${currentYear}-${currentMonth}`,
  },
  {
    id: 'bd_transport',
    category: 'Transportation',
    monthlyLimit: 250,
    month: `${currentYear}-${currentMonth}`,
  },
  {
    id: 'bd_bills',
    category: 'Bills',
    monthlyLimit: 450,
    month: `${currentYear}-${currentMonth}`,
  },
  {
    id: 'bd_entertainment',
    category: 'Entertainment',
    monthlyLimit: 200,
    month: `${currentYear}-${currentMonth}`,
  },
  {
    id: 'bd_healthcare',
    category: 'Healthcare',
    monthlyLimit: 250,
    month: `${currentYear}-${currentMonth}`,
  },
  {
    id: 'bd_education',
    category: 'Education',
    monthlyLimit: 200,
    month: `${currentYear}-${currentMonth}`,
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal_01',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentSavings: 7250,
    targetDate: `${currentYear}-12-31`,
    categoryIcon: 'ShieldCheck',
    color: '#10b981',
    notes: '6 months of living expenses safely preserved in high-yield account.',
  },
  {
    id: 'goal_02',
    name: 'MacBook Pro M4',
    targetAmount: 2400,
    currentSavings: 1850,
    targetDate: `${currentYear}-${pad(Math.min(12, Number(currentMonth) + 2))}-15`,
    categoryIcon: 'Laptop',
    color: '#3b82f6',
    notes: 'Upgraded workstation machine for mobile development and simulations.',
  },
  {
    id: 'goal_03',
    name: 'Kyoto Autumn Vacation',
    targetAmount: 3500,
    currentSavings: 1400,
    targetDate: `${currentYear}-11-20`,
    categoryIcon: 'Plane',
    color: '#f59e0b',
    notes: 'Flights, traditional ryokan stay, and bullet train passes in Japan.',
  },
];

export const INITIAL_RECURRING: RecurringTransaction[] = [
  {
    id: 'rec_01',
    title: 'Fiber Broadband Internet',
    amount: 65,
    type: 'expense',
    category: 'Bills',
    paymentMethod: 'Credit Card',
    frequency: 'monthly',
    nextDueDate: `${currentYear}-${pad(Math.min(12, Number(currentMonth) + 1))}-02`,
    isActive: true,
  },
  {
    id: 'rec_02',
    title: 'Cloud Storage & Gym Membership',
    amount: 45,
    type: 'expense',
    category: 'Bills',
    paymentMethod: 'Credit Card',
    frequency: 'monthly',
    nextDueDate: `${currentYear}-${pad(Math.min(12, Number(currentMonth) + 1))}-10`,
    isActive: true,
  },
  {
    id: 'rec_03',
    title: 'Company Monthly Payroll',
    amount: 4500,
    type: 'income',
    category: 'Salary',
    paymentMethod: 'UPI / Bank',
    frequency: 'monthly',
    nextDueDate: `${currentYear}-${pad(Math.min(12, Number(currentMonth) + 1))}-01`,
    isActive: true,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'Daily Expense Log Reminder',
    message: "Don't forget to record your daily spending before calling it a day!",
    date: 'Today at 08:00 PM',
    type: 'daily_reminder',
    isRead: false,
  },
  {
    id: 'notif_02',
    title: 'Shopping Budget Warning',
    message: 'You have utilized 85% of your Shopping budget for this month.',
    date: 'Yesterday at 03:45 PM',
    type: 'budget_alert',
    isRead: false,
  },
  {
    id: 'notif_03',
    title: 'Savings Milestone Achieved',
    message: 'Your Emergency Fund has crossed 70% of its target! Keep it up.',
    date: '3 days ago',
    type: 'savings_goal',
    isRead: true,
  },
];
