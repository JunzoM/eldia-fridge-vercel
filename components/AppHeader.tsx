'use client';

import { ChevronLeft, AlertTriangle, Wifi, WifiOff, Loader2, Sun, Moon } from 'lucide-react';
import type { AlertItem, StoreType, ViewType } from '@/lib/types';

interface AppHeaderProps {
  store: StoreType;
  onSwitchStore: (s: StoreType) => void;
  view: ViewType;
  room: string | number | null;
  loading: boolean;
  totalRemoved: number;
  alerts: AlertItem[];
  hasRed: boolean;
  sbReady: boolean;
  onBack: () => void;
  onAlerts: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function AppHeader({
  store, onSwitchStore, view, room, loading,
  totalRemoved, alerts, hasRed, sbReady, onBack, onAlerts,
  isDark, onToggleTheme,
}: AppHeaderProps) {
  return (
    <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#1a1a1a] px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm dark:shadow-none">
      {/* Left: title + store switcher */}
      <div className="flex items-center gap-2">
        {view === 'room' && (
          <button
            onClick={onBack}
            className="text-charcoal dark:text-gold p-1 -ml-1 rounded-lg active:bg-black/5 dark:active:bg-white/10"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div>
          <div className="text-sm font-bold text-charcoal dark:text-white leading-tight">
            {view === 'room' && room !== null ? `${room}号室` : 'HOTEL ELDIA 神戸'}
          </div>
          <div className="flex gap-1.5 mt-1">
            {(['M', 'L'] as StoreType[]).map(s => (
              <button
                key={s}
                onClick={() => { if (store !== s) onSwitchStore(s); }}
                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                  store === s
                    ? 'bg-gold text-[#1a1a1a]'
                    : 'bg-gray-200 dark:bg-[#444] text-gray-500 dark:text-[#888] active:bg-gray-300 dark:active:bg-[#555]'
                }`}
              >
                {s === 'M' ? 'モダン' : 'ラグジュアリー'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: badges + theme toggle */}
      <div className="flex items-center gap-2">
        {loading && <Loader2 size={14} className="text-gold animate-spin" />}

        {totalRemoved > 0 && (
          <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-yellow-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
            {totalRemoved}本取出中
          </div>
        )}

        {alerts.length > 0 && (
          <button
            onClick={onAlerts}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white transition-colors ${
              hasRed ? 'bg-red-600 active:bg-red-700' : 'bg-orange-600 active:bg-orange-700'
            }`}
          >
            <AlertTriangle size={11} />
            {alerts.length}
          </button>
        )}

        <div
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
            sbReady
              ? 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-[#3a3a3a] text-gray-600 dark:text-gold'
          }`}
        >
          {sbReady ? (
            <span className="flex items-center gap-1"><Wifi size={10} />SB</span>
          ) : (
            <span className="flex items-center gap-1"><WifiOff size={10} />LOCAL</span>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-[#222] text-charcoal dark:text-gold active:bg-gray-300 dark:active:bg-[#333] transition-colors"
          aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
