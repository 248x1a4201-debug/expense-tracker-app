import React, { useState } from 'react';
import {
  User,
  Settings,
  Moon,
  Sun,
  Bell,
  Lock,
  LogOut,
  Download,
  Upload,
  RefreshCw,
  Globe,
  ChevronRight,
  ShieldCheck,
  Repeat,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { UserProfile, AppSettings, RecurringTransaction } from '../../types';
import { CURRENCIES } from '../../data/initialData';
import { StorageService } from '../../services/storageService';

interface ProfileScreenProps {
  user: UserProfile;
  settings: AppSettings;
  recurring: RecurringTransaction[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onUpdateSettings: (updated: Partial<AppSettings>) => void;
  onToggleRecurring: (id: string) => void;
  onDeleteRecurring: (id: string) => void;
  onLogout: () => void;
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  settings,
  recurring,
  onUpdateUser,
  onUpdateSettings,
  onToggleRecurring,
  onDeleteRecurring,
  onLogout,
  onResetData,
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editBudget, setEditBudget] = useState(String(user.monthlyTotalBudget));

  // Password modal state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState(false);

  const handleCurrencyChange = (code: string) => {
    const cur = CURRENCIES.find((c) => c.code === code);
    if (cur) {
      onUpdateUser({ currency: cur.code, currencySymbol: cur.symbol });
      onUpdateSettings({ currency: cur.code, currencySymbol: cur.symbol });
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editName,
      email: editEmail,
      monthlyTotalBudget: parseFloat(editBudget) || 3000,
    });
    setIsEditProfileOpen(false);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordToast(true);
    setTimeout(() => {
      setPasswordToast(false);
      setIsChangePasswordOpen(false);
      setOldPassword('');
      setNewPassword('');
    }, 1500);
  };

  const handleExportBackup = () => {
    StorageService.exportFullBackup();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = StorageService.importBackup(text);
          if (success) {
            alert('Backup successfully restored! Refreshing data.');
            window.location.reload();
          } else {
            alert('Invalid backup file JSON structure.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex-1 pb-24 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Profile & Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Account Preferences, Currency & Data Management
        </p>
      </div>

      <div className="px-5 space-y-4">
        {/* User Profile Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 ring-2 ring-emerald-500/30">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
                Member since {user.createdAt}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setEditName(user.name);
              setEditEmail(user.email);
              setEditBudget(String(user.monthlyTotalBudget));
              setIsEditProfileOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Currency & Appearance Group */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            General Preferences
          </span>

          {/* Currency Selection */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Active Currency
                </span>
                <span className="text-[11px] text-slate-400">Used across all reports & cards</span>
              </div>
            </div>

            <select
              value={user.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="h-9 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/60" />

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                {settings.isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Dark Mode
                </span>
                <span className="text-[11px] text-slate-400">Eye-friendly high contrast theme</span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ isDarkMode: !settings.isDarkMode })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.isDarkMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  settings.isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reminders & Automation */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Notifications & Automation
          </span>

          {/* Daily Expense Reminder */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Daily Expense Reminder
                </span>
                <span className="text-[11px] text-slate-400">Scheduled evening prompt</span>
              </div>
            </div>

            <button
              onClick={() =>
                onUpdateSettings({ dailyReminderEnabled: !settings.dailyReminderEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.dailyReminderEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  settings.dailyReminderEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/60" />

          {/* Recurring Transactions Manager */}
          <div
            onClick={() => setIsRecurringOpen(true)}
            className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Recurring Transactions
                </span>
                <span className="text-[11px] text-slate-400">
                  {recurring.length} automated subscriptions & payroll
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Security & Data Backup */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Data & Security
          </span>

          {/* Change Password */}
          <div
            onClick={() => setIsChangePasswordOpen(true)}
            className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Change Password
                </span>
                <span className="text-[11px] text-slate-400">Update account credentials</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/60" />

          {/* Export JSON Backup */}
          <div
            onClick={handleExportBackup}
            className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Export Complete Backup
                </span>
                <span className="text-[11px] text-slate-400">Download full JSON data state</span>
              </div>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">JSON</span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/60" />

          {/* Restore JSON Backup */}
          <label className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Restore Backup File
                </span>
                <span className="text-[11px] text-slate-400">Load previous JSON snapshot</span>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-bold">Select File</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>

        {/* Danger Zone: Reset & Logout */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              if (confirm('Reset all demo data back to default initial values?')) {
                onResetData();
              }
            }}
            className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Log out of this session?')) onLogout();
            }}
            className="w-full h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Default Monthly Budget Cap ({user.currencySymbol})
                </label>
                <input
                  type="number"
                  step="50"
                  required
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Change Password</h3>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordToast ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Password updated successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Recurring Transactions Manager Modal */}
      {isRecurringOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Recurring Transactions
                </h3>
              </div>
              <button
                onClick={() => setIsRecurringOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {recurring.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No recurring transactions currently configured.
                </p>
              ) : (
                recurring.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.type === 'income'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.frequency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {user.currencySymbol}{item.amount.toFixed(2)} · Next: {item.nextDueDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleRecurring(item.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => onDeleteRecurring(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
