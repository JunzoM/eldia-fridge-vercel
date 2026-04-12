'use client';

import { ArrowRight, Package } from 'lucide-react';
import type { AlertItem, RemData } from '@/lib/types';
import { formatDate, slotLabel } from '@/lib/utils';

interface AlertsViewProps {
  items: AlertItem[];
  rem: RemData;
  onOpen: (room: string | number) => void;
  onBulkRemove: (items: Array<{ rn: string | number; idx: number }>) => void;
}

function Section({
  title, color, list, rem, onOpen, onBulkRemove,
}: {
  title: string;
  color: 'red' | 'orange';
  list: AlertItem[];
  rem: RemData;
  onOpen: (room: string | number) => void;
  onBulkRemove: (items: Array<{ rn: string | number; idx: number }>) => void;
}) {
  const notYet = list.filter(it => !rem[`${it.rn}-${it.idx}`]);
  const isRed = color === 'red';
  const colorCls = isRed
    ? { border: 'border-red-500',   text: 'text-red-600',    bg: 'bg-red-600',    leftBar: 'border-l-red-600',    bgGone: 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 border-l-amber-400' }
    : { border: 'border-orange-400', text: 'text-orange-600', bg: 'bg-orange-500', leftBar: 'border-l-orange-500', bgGone: 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 border-l-amber-400' };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className={`text-sm font-bold ${colorCls.text}`}>
          {title} ({list.length})
        </div>
        {notYet.length > 0 && (
          <button
            onClick={() => onBulkRemove(notYet)}
            className={`${colorCls.bg} text-white text-[11px] font-bold rounded-full px-3 py-1.5 flex items-center gap-1.5 active:opacity-80`}
          >
            <Package size={11} />
            一括取り出し中 ({notYet.length})
          </button>
        )}
      </div>

      {list.map((it, i) => {
        const gone = !!rem[`${it.rn}-${it.idx}`];
        return (
          <div
            key={i}
            className={`bg-white dark:bg-[#1c1c1e] rounded-xl px-4 py-3 flex items-center justify-between border border-l-4 ${
              gone ? colorCls.bgGone : `${colorCls.border} ${colorCls.leftBar}`
            } ${gone ? 'opacity-70' : ''}`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-gray-100 dark:bg-[#2d2d2d] dark:text-gray-300 rounded px-1.5 py-0.5 font-bold">{slotLabel(it.idx)}</span>
                <span className="text-[10px] text-gray-400">{it.rn}号室</span>
                {gone && (
                  <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/50 rounded px-1.5 py-0.5">取り出し中</span>
                )}
              </div>
              <div className="font-bold text-[15px] leading-tight">{it.name}</div>
              <div className={`text-sm font-bold mt-1 ${gone ? 'text-amber-700 dark:text-amber-400' : colorCls.text}`}>
                {formatDate(it.exp)}
              </div>
            </div>
            <button
              onClick={() => onOpen(it.rn)}
              className="bg-gray-100 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#3a3a3a] rounded-lg px-3 py-2 text-xs font-bold flex items-center gap-1 active:bg-gray-200 dark:active:bg-[#383838]"
            >
              部屋へ <ArrowRight size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function AlertsView({ items, rem, onOpen, onBulkRemove }: AlertsViewProps) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-6xl">✅</span>
        <p className="text-green-600 font-bold text-lg">問題ありません</p>
      </div>
    );
  }

  const red = items.filter(i => i.st === 'red');
  const orange = items.filter(i => i.st === 'orange');

  const summary: Record<string, { red: number; orange: number }> = {};
  items.forEach(it => {
    const nm = it.name || '?';
    if (!summary[nm]) summary[nm] = { red: 0, orange: 0 };
    summary[nm][it.st]++;
  });

  return (
    <div className="p-4 space-y-5">
      {/* Summary */}
      <div className="bg-charcoal dark:bg-[#0a0a0a] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-bold text-gray-400 tracking-wider">SUMMARY</span>
          <span className="bg-red-600 text-white rounded-full px-3 py-0.5 text-sm font-bold">
            合計 {items.length}本
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(summary).sort().map(k => {
            const s = summary[k];
            return (
              <div key={k} className="bg-[#2c2c2c] dark:bg-[#1a1a1a] rounded-xl px-3 py-2 flex items-center justify-between border border-white/5">
                <span className="text-[12px] font-bold text-white flex-1 mr-2 leading-tight">{k}</span>
                <div className="flex gap-1 items-center flex-shrink-0">
                  {s.red > 0 && (
                    <span className="bg-red-600 text-white rounded-lg px-2 py-0.5 text-[12px] font-bold">{s.red}</span>
                  )}
                  {s.orange > 0 && (
                    <span className="bg-orange-500 text-white rounded-lg px-2 py-0.5 text-[12px] font-bold">{s.orange}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {red.length > 0 && (
        <Section title="⚠ 要即交換（今月末以前）" color="red" list={red} rem={rem} onOpen={onOpen} onBulkRemove={onBulkRemove} />
      )}
      {orange.length > 0 && (
        <Section title="📅 月末交換対象（来月末まで）" color="orange" list={orange} rem={rem} onOpen={onOpen} onBulkRemove={onBulkRemove} />
      )}
    </div>
  );
}
