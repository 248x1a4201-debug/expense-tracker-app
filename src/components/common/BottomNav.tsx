import React from 'react';
import { Home, ArrowLeftRight, PieChart, BarChart3, User, Plus } from 'lucide-react';

export type NavTab = 'home' | 'transactions' | 'budget' | 'analytics' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenQuickAdd,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transactions', label: 'History', icon: ArrowLeftRight },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-3 py-2 shadow-lg">
      <div className="relative flex items-center justify-between max-w-lg mx-auto">
        {/* First 2 tabs */}
        <div className="flex items-center justify-around flex-1">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors rounded-xl ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label={tab.label}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Center Quick-Add Button */}
        <div className="relative -top-5 px-2">
          <button
            onClick={onOpenQuickAdd}
            className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-4 ring-white dark:ring-slate-900 transition-all cursor-pointer"
            aria-label="Quick Add Transaction"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Remaining 3 tabs */}
        <div className="flex items-center justify-around flex-1">
          {tabs.slice(2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors rounded-xl ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label={tab.label}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
