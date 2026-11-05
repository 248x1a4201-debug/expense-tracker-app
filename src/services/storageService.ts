import {
  Transaction,
  Budget,
  SavingsGoal,
  RecurringTransaction,
  UserProfile,
  AppNotification,
  AppSettings,
  ExpenseCategory,
} from '../types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_RECURRING,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
  INITIAL_SETTINGS,
} from '../data/initialData';

const KEYS = {
  TRANSACTIONS: 'et_transactions_v1',
  BUDGETS: 'et_budgets_v1',
  SAVINGS_GOALS: 'et_savings_goals_v1',
  RECURRING: 'et_recurring_v1',
  USER: 'et_user_v1',
  SETTINGS: 'et_settings_v1',
  NOTIFICATIONS: 'et_notifications_v1',
  AUTH: 'et_auth_session_v1',
};

// Safe JSON loader
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Failed to load storage for ${key}:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save storage for ${key}:`, err);
  }
}

export const StorageService = {
  // Authentication session
  getAuthSession(): { isAuthenticated: boolean; email: string } {
    return loadFromStorage(KEYS.AUTH, { isAuthenticated: true, email: INITIAL_USER.email });
  },

  setAuthSession(session: { isAuthenticated: boolean; email: string }) {
    saveToStorage(KEYS.AUTH, session);
  },

  logout() {
    saveToStorage(KEYS.AUTH, { isAuthenticated: false, email: '' });
  },

  // User Profile
  getUserProfile(): UserProfile {
    return loadFromStorage(KEYS.USER, INITIAL_USER);
  },

  updateUserProfile(updated: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const newUser = { ...current, ...updated };
    saveToStorage(KEYS.USER, newUser);
    return newUser;
  },

  // App Settings
  getSettings(): AppSettings {
    return loadFromStorage(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings(updated: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const newSettings = { ...current, ...updated };
    saveToStorage(KEYS.SETTINGS, newSettings);
    return newSettings;
  },

  // Transactions
  getTransactions(): Transaction[] {
    return loadFromStorage<Transaction[]>(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },

  addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
    };
    const updated = [newTx, ...transactions];
    saveToStorage(KEYS.TRANSACTIONS, updated);

    // If expense, check budget alert
    if (newTx.type === 'expense') {
      this.checkBudgetThresholds(newTx.category as ExpenseCategory);
    }

    return newTx;
  },

  updateTransaction(id: string, updatedFields: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const updatedTx = { ...transactions[idx], ...updatedFields };
    transactions[idx] = updatedTx;
    saveToStorage(KEYS.TRANSACTIONS, transactions);
    return updatedTx;
  },

  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    saveToStorage(KEYS.TRANSACTIONS, filtered);
    return true;
  },

  // Budgets
  getBudgets(): Budget[] {
    return loadFromStorage<Budget[]>(KEYS.BUDGETS, INITIAL_BUDGETS);
  },

  setBudget(category: ExpenseCategory | 'Total', monthlyLimit: number): Budget {
    const budgets = this.getBudgets();
    const currentMonth = new Date().toISOString().substring(0, 7);
    const existingIndex = budgets.findIndex((b) => b.category === category);

    if (existingIndex >= 0) {
      budgets[existingIndex].monthlyLimit = monthlyLimit;
      budgets[existingIndex].month = currentMonth;
      saveToStorage(KEYS.BUDGETS, budgets);
      return budgets[existingIndex];
    } else {
      const newBudget: Budget = {
        id: `bd_${Date.now()}`,
        category,
        monthlyLimit,
        month: currentMonth,
      };
      budgets.push(newBudget);
      saveToStorage(KEYS.BUDGETS, budgets);
      return newBudget;
    }
  },

  // Savings Goals
  getSavingsGoals(): SavingsGoal[] {
    return loadFromStorage<SavingsGoal[]>(KEYS.SAVINGS_GOALS, INITIAL_SAVINGS_GOALS);
  },

  addSavingsGoal(goal: Omit<SavingsGoal, 'id'>): SavingsGoal {
    const goals = this.getSavingsGoals();
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
    };
    const updated = [...goals, newGoal];
    saveToStorage(KEYS.SAVINGS_GOALS, updated);
    return newGoal;
  },

  updateSavingsGoal(id: string, fields: Partial<SavingsGoal>): SavingsGoal | null {
    const goals = this.getSavingsGoals();
    const idx = goals.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    goals[idx] = { ...goals[idx], ...fields };
    saveToStorage(KEYS.SAVINGS_GOALS, goals);
    return goals[idx];
  },

  depositToSavingsGoal(id: string, amount: number): SavingsGoal | null {
    const goals = this.getSavingsGoals();
    const idx = goals.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    goals[idx].currentSavings = Math.min(
      goals[idx].targetAmount * 1.5,
      goals[idx].currentSavings + amount
    );
    saveToStorage(KEYS.SAVINGS_GOALS, goals);

    if (goals[idx].currentSavings >= goals[idx].targetAmount) {
      this.addNotification({
        title: 'Goal Achieved!',
        message: `Congratulations! You reached your savings goal for "${goals[idx].name}".`,
        type: 'savings_goal',
      });
    }

    return goals[idx];
  },

  deleteSavingsGoal(id: string): boolean {
    const goals = this.getSavingsGoals();
    const filtered = goals.filter((g) => g.id !== id);
    saveToStorage(KEYS.SAVINGS_GOALS, filtered);
    return true;
  },

  // Recurring Transactions
  getRecurringTransactions(): RecurringTransaction[] {
    return loadFromStorage<RecurringTransaction[]>(KEYS.RECURRING, INITIAL_RECURRING);
  },

  toggleRecurring(id: string): boolean {
    const recurring = this.getRecurringTransactions();
    const item = recurring.find((r) => r.id === id);
    if (item) {
      item.isActive = !item.isActive;
      saveToStorage(KEYS.RECURRING, recurring);
      return true;
    }
    return false;
  },

  addRecurring(item: Omit<RecurringTransaction, 'id'>): RecurringTransaction {
    const recurring = this.getRecurringTransactions();
    const newItem: RecurringTransaction = {
      ...item,
      id: `rec_${Date.now()}`,
    };
    recurring.push(newItem);
    saveToStorage(KEYS.RECURRING, recurring);
    return newItem;
  },

  deleteRecurring(id: string): boolean {
    const recurring = this.getRecurringTransactions();
    const filtered = recurring.filter((r) => r.id !== id);
    saveToStorage(KEYS.RECURRING, filtered);
    return true;
  },

  // Notifications
  getNotifications(): AppNotification[] {
    return loadFromStorage<AppNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  addNotification(notif: Omit<AppNotification, 'id' | 'date' | 'isRead'>): AppNotification {
    const notifications = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      date: 'Just now',
      isRead: false,
    };
    const updated = [newNotif, ...notifications];
    saveToStorage(KEYS.NOTIFICATIONS, updated);
    return newNotif;
  },

  markNotificationAsRead(id: string) {
    const notifs = this.getNotifications();
    const item = notifs.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      saveToStorage(KEYS.NOTIFICATIONS, notifs);
    }
  },

  markAllNotificationsRead() {
    const notifs = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    saveToStorage(KEYS.NOTIFICATIONS, notifs);
  },

  clearAllNotifications() {
    saveToStorage(KEYS.NOTIFICATIONS, []);
  },

  // Budget threshold verification
  checkBudgetThresholds(category: ExpenseCategory) {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const transactions = this.getTransactions().filter(
      (t) => t.type === 'expense' && t.date.startsWith(currentMonth)
    );
    const budgets = this.getBudgets();
    const settings = this.getSettings();

    // Check category budget
    const categoryBudget = budgets.find((b) => b.category === category);
    if (categoryBudget && categoryBudget.monthlyLimit > 0) {
      const categorySpent = transactions
        .filter((t) => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

      const utilization = (categorySpent / categoryBudget.monthlyLimit) * 100;

      if (utilization >= 100) {
        this.addNotification({
          title: `Budget Exceeded: ${category}`,
          message: `You spent ${settings.currencySymbol}${categorySpent.toFixed(
            2
          )} exceeding your ${settings.currencySymbol}${categoryBudget.monthlyLimit} budget!`,
          type: 'budget_alert',
        });
      } else if (utilization >= settings.budgetAlertThreshold) {
        this.addNotification({
          title: `Budget Warning: ${category}`,
          message: `You have utilized ${Math.round(utilization)}% of your ${category} budget.`,
          type: 'budget_alert',
        });
      }
    }

    // Check Total Budget
    const totalBudget = budgets.find((b) => b.category === 'Total');
    if (totalBudget && totalBudget.monthlyLimit > 0) {
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const totalUtil = (totalSpent / totalBudget.monthlyLimit) * 100;
      if (totalUtil >= 100) {
        this.addNotification({
          title: 'Total Monthly Budget Exceeded!',
          message: `Total expenses have surpassed your monthly budget limit of ${settings.currencySymbol}${totalBudget.monthlyLimit}.`,
          type: 'budget_alert',
        });
      }
    }
  },

  // Export & Backup
  exportToCSV(transactions: Transaction[], currencySymbol: string) {
    const headers = ['ID', 'Date', 'Time', 'Type', 'Category', 'Amount', 'Payment Method', 'Description'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.time,
      t.type.toUpperCase(),
      t.category,
      `${currencySymbol}${t.amount.toFixed(2)}`,
      t.paymentMethod,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ExpenseTracker_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUserProfile(),
      settings: this.getSettings(),
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      savingsGoals: this.getSavingsGoals(),
      recurring: this.getRecurringTransactions(),
      notifications: this.getNotifications(),
    };
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ExpenseTracker_FullBackup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return jsonString;
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.transactions) saveToStorage(KEYS.TRANSACTIONS, data.transactions);
      if (data.budgets) saveToStorage(KEYS.BUDGETS, data.budgets);
      if (data.savingsGoals) saveToStorage(KEYS.SAVINGS_GOALS, data.savingsGoals);
      if (data.recurring) saveToStorage(KEYS.RECURRING, data.recurring);
      if (data.user) saveToStorage(KEYS.USER, data.user);
      if (data.settings) saveToStorage(KEYS.SETTINGS, data.settings);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },

  resetAllData() {
    saveToStorage(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    saveToStorage(KEYS.BUDGETS, INITIAL_BUDGETS);
    saveToStorage(KEYS.SAVINGS_GOALS, INITIAL_SAVINGS_GOALS);
    saveToStorage(KEYS.RECURRING, INITIAL_RECURRING);
    saveToStorage(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    saveToStorage(KEYS.USER, INITIAL_USER);
    saveToStorage(KEYS.SETTINGS, INITIAL_SETTINGS);
  },
};
