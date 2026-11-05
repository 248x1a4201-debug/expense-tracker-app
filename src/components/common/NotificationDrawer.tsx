import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Trash2 } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'budget_alert':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'savings_goal':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'daily_reminder':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Reminders & Alerts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={onMarkAllRead}
              className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear history</span>
            </button>
          </div>
        )}

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">
                You have no pending budget alerts or financial reminders.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-white dark:bg-slate-800 border-emerald-500/30 dark:border-emerald-500/20 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                        {notif.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
