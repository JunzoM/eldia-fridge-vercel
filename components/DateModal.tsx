'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { MenuState } from '@/lib/types';
import { calcStatus, daysLeft, formatDate, nextMonthEnd, toIso } from '@/lib/utils';
import BottomSheet from './BottomSheet';

interface DateModalProps {
  menu: MenuState;
  current: string;
  name: string;
  label: string;
  onSave: (date: string) => void;
  onClose: () => void;
}

export default function DateModal({ menu, current, name, label, onSave, onClose }: DateModalProps) {
  const [val, setVal] = useState(current || '');

  const nme = nextMonthEnd();
  function addMonths(n: number): Date {
    const d = new Date();
    d.setMonth(d.getMonth() + n);
    return d;
  }
  const quickDates = [
    { label: `来月末 ${nme.getMonth() + 1}/${nme.getDate()}`, date: toIso(nme) },
    { label: '3ヶ月後', date: toIso(addMonths(3)) },
    { label: '6ヶ月後', date: toIso(addMonths(6)) },
    { label: '9ヶ月後', date: toIso(addMonths(9)) },
  ];

  const dl = val ? daysLeft(val) : null;
  const st = calcStatus(val);
  const statusColor =
    st === 'red' ? 'text-red-600' :
    st === 'orange' ? 'text-orange-500' :
    'text-green-600';
  const borderColor =
    val
      ? st === 'red' ? 'border-red-500'
        : st === 'orange' ? 'border-orange-400'
        : 'border-charcoal'
      : 'border-gray-200';

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-5 pb-10 pt-2">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-charcoal text-white rounded-lg px-2.5 py-1 font-bold text-base">{label}</span>
              <span className="text-[11px] text-gray-400">{menu.rn}号室</span>
            </div>
            <div className="font-bold text-lg leading-tight">{name}</div>
            {val && (
              <div className={`text-sm font-bold mt-1 ${statusColor}`}>
                {dl !== null && (
                  dl < 0 ? `${Math.abs(dl)}日超過` : dl === 0 ? '本日期限' : `あと${dl}日`
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 rounded-lg p-2 text-gray-500 active:bg-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick select */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 mb-2">クイック選択</div>
          <div className="grid grid-cols-2 gap-2">
            {quickDates.map(q => (
              <button
                key={q.label}
                onClick={() => setVal(q.date)}
                className={`py-3 px-2 rounded-xl text-sm font-bold border transition-colors ${
                  val === q.date
                    ? 'bg-charcoal text-white border-transparent'
                    : 'bg-gray-50 text-gray-700 border-gray-200 active:bg-gray-100'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date input */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-gray-400 mb-2">日付を直接入力</div>
          <input
            type="date"
            value={val}
            onChange={e => setVal(e.target.value)}
            className={`w-full border-2 rounded-xl px-4 py-3.5 text-lg font-bold text-[#1a1a1a] bg-gray-50 ${borderColor}`}
          />
        </div>

        {/* Save button */}
        <button
          onClick={() => { if (val) onSave(val); }}
          disabled={!val}
          className={`w-full rounded-2xl py-4 text-base font-bold transition-colors ${
            val
              ? 'bg-charcoal text-white active:bg-[#3a3a3a]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {val ? `${label} → ${formatDate(val)}` : '日付を選択してください'}
        </button>
      </div>
    </BottomSheet>
  );
}
