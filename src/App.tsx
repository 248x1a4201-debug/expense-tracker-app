import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import {
  Transaction,
  Budget,
  SavingsGoal,
  RecurringTransaction,
  UserProfile,
  AppSettings,
  AppNotification,
  TransactionType,
  ExpenseCategory,
} from './types';

// Common Components
import { Header } from './components/common/Header';
import { DeviceFrame } from './components/common/DeviceFrame';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Auth Components
import { AuthScreens } from './components/auth/AuthScreens';

// Main App Screens
import { HomeScreen } from './components/dashboard/HomeScreen';
import { TransactionHistoryScreen } from './components/transactions/TransactionHistoryScreen';
import { BudgetScreen } from './components/budget/BudgetScreen';
import { AnalyticsScreen } from './components/analytics/AnalyticsScreen';
import { SavingsGoalScreen } from './components/savings/SavingsGoalScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';

// Modals
import { AddTransactionModal } from './components/transactions/AddTransactionModal';
import { TransactionDetailModal } from './components/transactions/TransactionDetailModal';

// Flutter Code & Academic Hub
import { FlutterProjectViewer } from './components/codehub/FlutterProjectViewer';

export default function App() {
  // Primary view state: 'app' (mobile simulator) or 'flutter_code' (Flutter & Dart Project Explorer)
  const [currentView, setCurrentView] = useState<'app' | 'flutter_code'>('app');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Storage states
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [transactions, setTransactions] = useState<Transaction[]>(
    StorageService.getTransactions()
  );
  const [budgets, setBudgets] = useState<Budget[]>(StorageService.getBudgets());
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(
    StorageService.getSavingsGoals()
  );
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(
    StorageService.getRecurringTransactions()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    StorageService.getNotifications()
  );

  // Auth session
  const [authSession, setAuthSession] = useState<{
    isAuthenticated: boolean;
    email: string;
  }>(StorageService.getAuthSession());

  // Modals state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [addModal, setAddModal] = useState<{
    isOpen: boolean;
    initialType: TransactionType;
    editingTx: Transaction | null;
  }>({
    isOpen: false,
    initialType: 'expense',
    editingTx: null,
  });

  const [detailModalTx, setDetailModalTx] = useState<Transaction | null>(null);

  // Sync dark mode class on HTML root
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // Auth handlers
  const handleLogin = (email: string) => {
    const session = { isAuthenticated: true, email };
    StorageService.setAuthSession(session);
    setAuthSession(session);
  };

  const handleLogout = () => {
    StorageService.logout();
    setAuthSession({ isAuthenticated: false, email: '' });
  };

  // Transaction handlers
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      StorageService.updateTransaction(existingId, txData);
    } else {
      StorageService.addTransaction(txData);
    }
    // Refresh states
    setTransactions(StorageService.getTransactions());
    setNotifications(StorageService.getNotifications());
  };

  const handleDeleteTransaction = (id: string) => {
    StorageService.deleteTransaction(id);
    setTransactions(StorageService.getTransactions());
  };

  // Budget handlers
  const handleSetBudget = (category: ExpenseCategory | 'Total', monthlyLimit: number) => {
    StorageService.setBudget(category, monthlyLimit);
    setBudgets(StorageService.getBudgets());
  };

  // Savings goals handlers
  const handleAddSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    StorageService.addSavingsGoal(goal);
    setSavingsGoals(StorageService.getSavingsGoals());
  };

  const handleUpdateSavingsGoal = (id: string, fields: Partial<SavingsGoal>) => {
    StorageService.updateSavingsGoal(id, fields);
    setSavingsGoals(StorageService.getSavingsGoals());
  };

  const handleDepositSavingsGoal = (id: string, amount: number) => {
    StorageService.depositToSavingsGoal(id, amount);
    setSavingsGoals(StorageService.getSavingsGoals());
    setNotifications(StorageService.getNotifications());
  };

  const handleDeleteSavingsGoal = (id: string) => {
    StorageService.deleteSavingsGoal(id);
    setSavingsGoals(StorageService.getSavingsGoals());
  };

  // Recurring handlers
  const handleToggleRecurring = (id: string) => {
    StorageService.toggleRecurring(id);
    setRecurring(StorageService.getRecurringTransactions());
  };

  const handleDeleteRecurring = (id: string) => {
    StorageService.deleteRecurring(id);
    setRecurring(StorageService.getRecurringTransactions());
  };

  // User & Settings handlers
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    const res = StorageService.updateUserProfile(updated);
    setUser(res);
  };

  const handleUpdateSettings = (updated: Partial<AppSettings>) => {
    const res = StorageService.updateSettings(updated);
    setSettings(res);
  };

  // Notification handlers
  const handleMarkNotificationRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(StorageService.getNotifications());
  };

  const handleMarkAllNotificationsRead = () => {
    StorageService.markAllNotificationsRead();
    setNotifications(StorageService.getNotifications());
  };

  const handleClearAllNotifications = () => {
    StorageService.clearAllNotifications();
    setNotifications([]);
  };

  const handleResetData = () => {
    StorageService.resetAllData();
    setUser(StorageService.getUserProfile());
    setSettings(StorageService.getSettings());
    setTransactions(StorageService.getTransactions());
    setBudgets(StorageService.getBudgets());
    setSavingsGoals(StorageService.getSavingsGoals());
    setRecurring(StorageService.getRecurringTransactions());
    setNotifications(StorageService.getNotifications());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        isDarkMode={settings.isDarkMode}
        onToggleDarkMode={() =>
          handleUpdateSettings({ isDarkMode: !settings.isDarkMode })
        }
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        currencySymbol={user.currencySymbol}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-6 px-3 sm:px-4">
        {currentView === 'flutter_code' ? (
          <div className="w-full max-w-6xl mx-auto h-[820px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
            <FlutterProjectViewer />
          </div>
        ) : !authSession.isAuthenticated ? (
          <DeviceFrame isMobileFrame={isMobileFrame}>
            <AuthScreens
              onLoginSuccess={handleLogin}
              currencySymbol={user.currencySymbol}
            />
          </DeviceFrame>
        ) : (
          <DeviceFrame isMobileFrame={isMobileFrame}>
            <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Screen Body Router */}
              {activeTab === 'home' && (
                <HomeScreen
                  user={user}
                  transactions={transactions}
                  budgets={budgets}
                  currencySymbol={user.currencySymbol}
                  onOpenAddExpense={() =>
                    setAddModal({ isOpen: true, initialType: 'expense', editingTx: null })
                  }
                  onOpenAddIncome={() =>
                    setAddModal({ isOpen: true, initialType: 'income', editingTx: null })
                  }
                  onSelectTransaction={(tx) => setDetailModalTx(tx)}
                  onViewAllTransactions={() => setActiveTab('transactions')}
                  onNavigateToBudget={() => setActiveTab('budget')}
                  onNavigateToSavings={() => setActiveTab('budget')}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionHistoryScreen
                  transactions={transactions}
                  currencySymbol={user.currencySymbol}
                  onSelectTransaction={(tx) => setDetailModalTx(tx)}
                  onOpenAddExpense={() =>
                    setAddModal({ isOpen: true, initialType: 'expense', editingTx: null })
                  }
                  onOpenAddIncome={() =>
                    setAddModal({ isOpen: true, initialType: 'income', editingTx: null })
                  }
                />
              )}

              {activeTab === 'budget' && (
                <div className="flex-1 flex flex-col overflow-y-auto">
                  {/* Budget & Goals sub-tabs */}
                  <BudgetScreen
                    budgets={budgets}
                    transactions={transactions}
                    currencySymbol={user.currencySymbol}
                    onSetBudget={handleSetBudget}
                  />

                  {/* Savings Goal Section attached seamlessly */}
                  <div className="px-5 pt-2 pb-6 border-t border-slate-200/80 dark:border-slate-800">
                    <SavingsGoalScreen
                      goals={savingsGoals}
                      currencySymbol={user.currencySymbol}
                      onAddGoal={handleAddSavingsGoal}
                      onUpdateGoal={handleUpdateSavingsGoal}
                      onDeposit={handleDepositSavingsGoal}
                      onDeleteGoal={handleDeleteSavingsGoal}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <AnalyticsScreen
                  transactions={transactions}
                  currencySymbol={user.currencySymbol}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  user={user}
                  settings={settings}
                  recurring={recurring}
                  onUpdateUser={handleUpdateUser}
                  onUpdateSettings={handleUpdateSettings}
                  onToggleRecurring={handleToggleRecurring}
                  onDeleteRecurring={handleDeleteRecurring}
                  onLogout={handleLogout}
                  onResetData={handleResetData}
                />
              )}

              {/* Bottom Mobile Navigation Bar */}
              <BottomNav
                activeTab={activeTab}
                onChangeTab={setActiveTab}
                onOpenQuickAdd={() =>
                  setAddModal({ isOpen: true, initialType: 'expense', editingTx: null })
                }
              />
            </div>
          </DeviceFrame>
        )}
      </main>

      {/* Slide-over Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearAllNotifications}
      />

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={addModal.isOpen}
        onClose={() => setAddModal({ isOpen: false, initialType: 'expense', editingTx: null })}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        initialType={addModal.initialType}
        editingTransaction={addModal.editingTx}
        currencySymbol={user.currencySymbol}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailModal
        transaction={detailModalTx}
        isOpen={!!detailModalTx}
        onClose={() => setDetailModalTx(null)}
        onEdit={(tx) => {
          setDetailModalTx(null);
          setAddModal({
            isOpen: true,
            initialType: tx.type,
            editingTx: tx,
          });
        }}
        onDelete={(id) => {
          handleDeleteTransaction(id);
          setDetailModalTx(null);
        }}
        currencySymbol={user.currencySymbol}
      />
    </div>
  );
}
