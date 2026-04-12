'use client';

import type { FridgeData, RemData } from '@/lib/types';
import { slotLabel } from '@/lib/utils';

interface RestockViewProps {
  data: FridgeData;
  rem: RemData;
  allRooms: (string | number)[];
}

export default function RestockView({ data, rem, allRooms }: RestockViewProps) {
  const groups: Record<string, Array<{ rn: string | number; idx: number; lbl: string }>> = {};

  allRooms.forEach(r => {
    (data[r] || []).forEach((s, i) => {
      if (rem[`${r}-${i}`]) {
        const nm = s.name || '?';
        if (!groups[nm]) groups[nm] = [];
        groups[nm].push({ rn: r, idx: i, lbl: slotLabel(i) });
      }
    });
  });

  const keys = Object.keys(groups);
  const total = keys.reduce((a, k) => a + groups[k].length, 0);

  if (!total) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-6xl">✅</span>
        <p className="text-green-600 font-bold text-lg">取り出し中の商品はありません</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-charcoal dark:bg-[#0a0a0a] rounded-2xl px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-white">補充リスト</span>
        <span className="bg-red-600 text-white rounded-full px-3 py-1 text-base font-bold">
          合計 {total}本
        </span>
      </div>

      {keys.sort().map(k => {
        const items = groups[k];
        return (
          <div key={k} className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm dark:border dark:border-[#2d2d2d]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[15px] font-bold">{k}</span>
              <span className="bg-charcoal dark:bg-[#0a0a0a] text-white rounded-full px-3 py-1 text-[15px] font-bold">
                {items.length}本
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((it, j) => (
                <div
                  key={j}
                  className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#262626] rounded-lg px-2.5 py-1.5"
                >
                  <span className="text-[11px] font-bold text-white bg-[#555] dark:bg-[#444] rounded px-1.5 py-0.5">{it.lbl}</span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{it.rn}号室</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
