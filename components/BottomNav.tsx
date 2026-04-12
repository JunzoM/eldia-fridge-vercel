'use client';

import { Building2, AlertTriangle, Package, History, Settings } from 'lucide-react';
import type { ViewType } from '@/lib/types';

interface BottomNavProps {
  view: ViewType;
  onNav: (v: ViewType) => void;
  alertCount: number;
  hasRed: boolean;
  totalRemoved: number;
}

const NAV_ITEMS = [
  { id: 'floors' as ViewType, icon: Building2, label: 'フロア' },
  { id: 'alerts' as ViewType, icon: AlertTriangle, label: 'アラート' },
  { id: 'restock' as ViewType, icon: Package, label: '補充リスト' },
  { id: 'history' as ViewType, icon: History, label: '履歴' },
  { id: 'settings' as ViewType, icon: Settings, label: '設定' },
] as const;

export default function BottomNav({ view, onNav, alertCount, hasRed, totalRemoved }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-[#222] grid grid-cols-5 pb-safe z-40">
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
        const active = view === id || (view === 'room' && id === 'floors');
        const badge =
          id === 'alerts' && alertCount > 0 ? alertCount :
          id === 'restock' && totalRemoved > 0 ? totalRemoved :
          0;

        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="flex flex-col items-center gap-1 py-2 relative active:bg-black/5 dark:active:bg-white/5"
          >
            {badge > 0 && (
              <span
                className={`absolute top-1 right-[calc(50%-18px)] min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center px-1 ${
                  id === 'alerts' && hasRed
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-800 text-yellow-200'
                }`}
              >
                {badge}
              </span>
            )}
            <Icon size={18} className={active ? 'text-charcoal dark:text-gold' : 'text-gray-400 dark:text-[#555]'} />
            <span className={`text-[9px] font-medium ${active ? 'text-charcoal dark:text-gold' : 'text-gray-400 dark:text-[#555]'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
