'use client';

import { ArrowRight } from 'lucide-react';
import type { HistoryEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface HistoryViewProps {
  hist: HistoryEntry[];
}

export default function HistoryView({ hist }: HistoryViewProps) {
  if (!hist.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
        <span className="text-4xl">📋</span>
        <p className="text-sm">履歴がありません</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {hist.map((e, i) => (
        <div
          key={i}
          className="bg-white border border-[#ede8df] rounded-xl px-4 py-3"
        >
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-gray-400">{e.rn}号室</span>
            <span className="text-[10px] text-gray-300">
              {new Date(e.dt).toLocaleString('ja-JP', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="font-bold text-[14px] mb-2 leading-tight">{e.name}</div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-red-500">{formatDate(e.from) || '未設定'}</span>
            <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
            <span className="text-green-600 font-bold">{formatDate(e.to) || '—'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
