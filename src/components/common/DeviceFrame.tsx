import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isMobileFrame }) => {
  const [currentTime, setCurrentTime] = React.useState('9:41');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentTime(`${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobileFrame) {
    return (
      <div className="w-full max-w-5xl mx-auto min-h-[850px] bg-slate-50 dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        {children}
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[410px] h-[870px] bg-slate-950 rounded-[52px] p-3 shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 transition-all flex flex-col">
      {/* Outer Phone Bezel Buttons */}
      <div className="absolute -left-[3px] top-[125px] w-[3px] h-[32px] bg-slate-700 rounded-l-md" />
      <div className="absolute -left-[3px] top-[175px] w-[3px] h-[50px] bg-slate-700 rounded-l-md" />
      <div className="absolute -left-[3px] top-[235px] w-[3px] h-[50px] bg-slate-700 rounded-l-md" />
      <div className="absolute -right-[3px] top-[160px] w-[3px] h-[64px] bg-slate-700 rounded-r-md" />

      {/* Screen Inner Frame */}
      <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900 rounded-[44px] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800/80">
        {/* iOS Dynamic Island & Status Bar */}
        <div className="relative z-50 shrink-0 h-11 px-7 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 select-none bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
          <span className="tabular-nums tracking-tight font-medium text-[13px]">{currentTime}</span>

          {/* Dynamic Island Pill */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-[24px] bg-black rounded-full flex items-center justify-between px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-emerald-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            <Battery className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>

        {/* Screen Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="shrink-0 h-5 flex items-center justify-center bg-slate-50 dark:bg-slate-900 pointer-events-none">
          <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
