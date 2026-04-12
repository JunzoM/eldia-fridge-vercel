'use client';

import type { FridgeData, FloorData, RemData } from '@/lib/types';
import { roomStatus, nextMonthEnd } from '@/lib/utils';

interface FloorsViewProps {
  floors: FloorData[];
  data: FridgeData;
  rem: RemData;
  onOpen: (room: string | number) => void;
}

const STATUS_COLORS = {
  red: { border: 'border-red-600', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-600' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-500' },
  ok: { border: 'border-green-600', bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-600' },
  none: { border: 'border-gray-300', bg: 'bg-gray-50', text: 'text-gray-400', dot: 'bg-gray-300' },
};

export default function FloorsView({ floors, data, rem, onOpen }: FloorsViewProps) {
  const nme = nextMonthEnd();
  const nmeStr = `${nme.getMonth() + 1}/${nme.getDate()}`;

  const legend = [
    { color: 'bg-red-600', label: '要即交換' },
    { color: 'bg-orange-500', label: `月末交換〜${nmeStr}` },
    { color: 'bg-green-600', label: '正常' },
    { color: 'bg-gray-300', label: '未入力' },
  ];

  return (
    <div className="p-3 space-y-4">
      {/* Legend */}
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex flex-wrap gap-3">
        {legend.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Floors */}
      {floors.map(fl => (
        <div key={fl.f}>
          <div className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 px-1">
            {fl.f}
          </div>
          <div className="flex flex-wrap gap-2">
            {fl.rooms.map(r => {
              const st = roomStatus(r, data);
              const c = STATUS_COLORS[st];
              const rc = Object.keys(rem).filter(k => k.startsWith(`${r}-`)).length;

              return (
                <button
                  key={r}
                  onClick={() => onOpen(r)}
                  className={`relative flex flex-col items-center gap-1 border-2 rounded-xl px-3.5 py-2.5 transition-transform active:scale-95 ${c.border} ${c.bg} ${
                    st === 'red' ? 'animate-blink' : ''
                  }`}
                >
                  <span className="font-bold text-base text-[#1a1a1a] leading-none">{r}</span>
                  <span className={`text-[9px] font-bold ${c.text}`}>
                    {st === 'red' ? '要交換' : st === 'orange' ? '月末' : st === 'ok' ? '正常' : '未入力'}
                  </span>
                  {rc > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-800 text-yellow-200 rounded-full text-[9px] font-bold flex items-center justify-center">
                      {rc}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
