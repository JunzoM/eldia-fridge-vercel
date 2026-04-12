'use client';

import { ChevronLeft, AlertTriangle, Wifi, WifiOff, Loader2 } from 'lucide-react';
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
}

export default function AppHeader({
  store, onSwitchStore, view, room, loading,
  totalRemoved, alerts, hasRed, sbReady, onBack, onAlerts,
}: AppHeaderProps) {
  return (
    <header className="bg-charcoal px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-lg">
      {/* Left: title + store switcher */}
      <div className="flex items-center gap-2">
        {view === 'room' && (
          <button
            onClick={onBack}
            className="text-gold p-1 -ml-1 rounded-lg active:bg-white/10"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div>
          <div className="text-sm font-bold text-white leading-tight">
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
                    : 'bg-[#444] text-[#888] active:bg-[#555]'
                }`}
              >
                {s === 'M' ? 'モダン' : 'ラグジュアリー'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: badges */}
      <div className="flex items-center gap-2">
        {loading && <Loader2 size={14} className="text-gold animate-spin" />}

        {totalRemoved > 0 && (
          <div className="bg-amber-900 text-yellow-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
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
              ? 'bg-green-900/60 text-green-400'
              : 'bg-[#3a3a3a] text-gold'
          }`}
        >
          {sbReady ? (
            <span className="flex items-center gap-1"><Wifi size={10} />SB</span>
          ) : (
            <span className="flex items-center gap-1"><WifiOff size={10} />LOCAL</span>
          )}
        </div>
      </div>
    </header>
  );
}
