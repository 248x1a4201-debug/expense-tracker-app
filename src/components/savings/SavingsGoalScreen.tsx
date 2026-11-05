import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Target,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  DollarSign,
  X,
  TrendingUp,
  Laptop,
  Plane,
  Home,
  Car,
  Gift,
} from 'lucide-react';
import { SavingsGoal } from '../../types';

interface SavingsGoalScreenProps {
  goals: SavingsGoal[];
  currencySymbol: string;
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoal: (id: string, fields: Partial<SavingsGoal>) => void;
  onDeposit: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoalScreen: React.FC<SavingsGoalScreenProps> = ({
  goals,
  currencySymbol,
  onAddGoal,
  onUpdateGoal,
  onDeposit,
  onDeleteGoal,
}) => {
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  // Quick Deposit modal state
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Form states for create/edit goal
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#10b981');
  const [notes, setNotes] = useState('');

  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

  const totalSaved = goals.reduce((sum, g) => sum + g.currentSavings, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setName('');
    setTargetAmount('');
    setCurrentSavings('0');
    setTargetDate(new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10));
    setColor('#10b981');
    setNotes('');
    setIsNewGoalModalOpen(true);
  };

  const handleOpenEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setName(goal.name);
    setTargetAmount(String(goal.targetAmount));
    setCurrentSavings(String(goal.currentSavings));
    setTargetDate(goal.targetDate);
    setColor(goal.color);
    setNotes(goal.notes || '');
    setIsNewGoalModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentSavings) || 0;
    if (!name || isNaN(target) || target <= 0) return;

    if (editingGoal) {
      onUpdateGoal(editingGoal.id, {
        name,
        targetAmount: target,
        currentSavings: current,
        targetDate,
        color,
        notes,
      });
    } else {
      onAddGoal({
        name,
        targetAmount: target,
        currentSavings: current,
        targetDate,
        categoryIcon: 'Target',
        color,
        notes,
      });
    }

    setIsNewGoalModalOpen(false);
  };

  const handleExecuteDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (depositGoalId && !isNaN(amt) && amt > 0) {
      onDeposit(depositGoalId, amt);
      setDepositGoalId(null);
      setDepositAmount('');
    }
  };

  return (
    <div className="flex-1 pb-24 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Savings Goals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Target Funds & Milestones
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Goal</span>
        </button>
      </div>

      <div className="px-5 space-y-4">
        {/* Total Vault Milestone Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-700/20">
          <div className="flex items-center justify-between text-emerald-100 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Overall Goal Progress</span>
            <span className="font-bold text-white tabular-nums">{overallProgress}%</span>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums">
              {currencySymbol}{totalSaved.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-emerald-100">
              Target: {currencySymbol}{totalTarget.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
          </div>

          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((goal) => {
            const progress = Math.min(
              100,
              Math.round((goal.currentSavings / goal.targetAmount) * 100)
            );
            const remaining = Math.max(0, goal.targetAmount - goal.currentSavings);

            return (
              <div
                key={goal.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: goal.color }}
                    >
                      <Target className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {goal.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Target: {goal.targetDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete goal "${goal.name}"?`)) onDeleteGoal(goal.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amount figures */}
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    {currencySymbol}{goal.currentSavings.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    / {currencySymbol}{goal.targetAmount.toLocaleString()} ({progress}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Remaining: <strong className="text-slate-700 dark:text-slate-200 font-mono tabular-nums">{currencySymbol}{remaining.toLocaleString()}</strong>
                  </span>

                  <button
                    onClick={() => {
                      setDepositGoalId(goal.id);
                      setDepositAmount('');
                    }}
                    className="h-8 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add Money</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Deposit to Savings Goal
              </h3>
              <button
                onClick={() => setDepositGoalId(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deposit Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums text-center"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                {[50, 100, 250, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(String(preset))}
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    +{currencySymbol}{preset}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingGoal ? 'Edit Savings Goal' : 'Create New Goal'}
              </h3>
              <button
                onClick={() => setIsNewGoalModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dream Vacation, New Laptop"
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  step="1"
                  min="1"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Initial Saved Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="0"
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Theme Color
                </label>
                <div className="flex items-center gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                        color === c ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewGoalModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingGoal ? 'Update Goal' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
