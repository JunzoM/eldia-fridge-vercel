'use client';

import type { SlotData } from '@/lib/types';
import { calcStatus, nextMonthEnd, daysLeft, formatDate, slotLabel } from '@/lib/utils';
import { DAYS, ROWS } from '@/lib/constants';

interface RoomViewProps {
  rn: string | number;
  slots: SlotData[];
  isRemoved: (rn: string | number, i: number) => boolean;
  onTap: (rn: string | number, idx: number) => void;
}

export default function RoomView({ rn, slots, isRemoved, onTap }: RoomViewProps) {
  const nme = nextMonthEnd();
  const nmeStr = `${nme.getMonth() + 1}/${nme.getDate()}(${DAYS[nme.getDay()]})`;

  const rows: SlotData[][] = [];
  for (let i = 0; i < slots.length; i += 4) rows.push(slots.slice(i, i + 4));

  const removedSlots = slots.map((s, i) => ({ s, i })).filter(x => isRemoved(rn, x.i));

  return (
    <div className="p-3 space-y-3">
      {/* Next exchange banner */}
      <div className="bg-charcoal rounded-xl px-4 py-2.5 flex justify-between items-center">
        <span className="text-[11px] text-gray-400">次回月末交換</span>
        <span className="text-sm font-bold text-gold">{nmeStr}</span>
      </div>

      {/* Removed items */}
      {removedSlots.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3">
          <div className="text-[11px] font-bold text-amber-800 mb-2">
            取り出し中 — タップして「元の場所に戻した」を選択
          </div>
          <div className="flex flex-wrap gap-1.5">
            {removedSlots.map(({ s, i }) => (
              <div
                key={i}
                className="bg-amber-100 border border-amber-400 rounded-lg px-2.5 py-1 flex items-center gap-1.5"
              >
                <span className="text-[11px] font-bold text-amber-800">{slotLabel(i)}</span>
                <span className="text-[11px] text-amber-700">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400">マスをタップしてメニューを開く</p>

      {/* Fridge grid */}
      <div className="bg-[#9e9e9e] rounded-2xl p-3 shadow-inner">
        {/* Column labels */}
        <div className="grid grid-cols-4 gap-1.5 mb-1 ml-5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="text-center text-[9px] font-bold text-white/40">{n}</div>
          ))}
        </div>

        <div className="flex gap-1.5">
          {/* Row labels */}
          <div className="flex flex-col justify-around">
            {ROWS.map(l => (
              <div
                key={l}
                className="text-[9px] font-bold text-white/40 w-4 h-[96px] flex items-center justify-center"
              >
                {l}
              </div>
            ))}
          </div>

          {/* Slots */}
          <div className="flex-1 flex flex-col gap-1.5">
            {rows.map((row, ri) => (
              <div key={ri} className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 4 }).map((_, ci) => {
                  const slot = row[ci];
                  if (!slot) return <div key={ci} />;
                  const idx = ri * 4 + ci;
                  const gone = isRemoved(rn, idx);
                  const st = gone ? 'removed' : calcStatus(slot.exp);
                  const isRed = st === 'red';
                  const isOr = st === 'orange';
                  const dl = slot.exp ? daysLeft(slot.exp) : null;

                  const headerBg = gone ? 'bg-amber-100' : 'bg-[#b0aea8]';
                  const headerBorder = gone ? 'border-amber-400' : 'border-[#999]';
                  const bottomBg =
                    gone ? 'bg-amber-800' :
                    isRed ? 'bg-red-600' :
                    isOr ? 'bg-orange-600' :
                    st === 'ok' ? 'bg-[#1a1a1a]' : 'bg-[#555]';
                  const lamp =
                    gone ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' :
                    isRed ? 'bg-red-500 shadow-[0_0_6px_#dc2626]' :
                    isOr ? 'bg-orange-400 shadow-[0_0_6px_#f97316]' :
                    st === 'ok' ? 'bg-green-400 shadow-[0_0_6px_#22c55e]' :
                    'bg-[#555]';

                  return (
                    <button
                      key={ci}
                      onClick={() => onTap(rn, idx)}
                      className={`rounded-lg border overflow-hidden flex flex-col min-h-[90px] transition-transform active:scale-95 ${
                        gone
                          ? 'bg-hatch border-dashed border-amber-400'
                          : `bg-[#d0cdc6] border-[#aaa] shadow-[inset_0_1px_3px_rgba(255,255,255,.4),0_2px_4px_rgba(0,0,0,.25)] ${isRed ? 'animate-blink-fast' : ''}`
                      }`}
                    >
                      {/* Header */}
                      <div className={`${headerBg} px-1 py-0.5 flex items-center justify-between border-b ${headerBorder}`}>
                        <span className={`text-[7px] font-bold ${gone ? 'text-amber-800' : isRed ? 'text-red-600' : isOr ? 'text-orange-500' : st === 'ok' ? 'text-green-700' : 'text-gray-500'}`}>
                          {gone ? '取出中' : isRed ? '要交換' : isOr ? '月末' : st === 'ok' ? '販売中' : '未入力'}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[8px] font-bold rounded px-0.5 ${gone ? 'bg-amber-200 text-amber-800' : 'bg-black/10 text-black/40'}`}>
                            {slotLabel(idx)}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${lamp}`} />
                        </div>
                      </div>

                      {/* Body */}
                      <div className={`flex-1 flex items-center justify-center p-1 ${gone ? '' : 'bg-[rgba(200,210,220,.4)]'}`}>
                        {gone ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-2xl opacity-30">📫</span>
                            <span className="text-[8px] font-bold text-amber-800 text-center leading-tight">{slot.name}</span>
                          </div>
                        ) : (
                          <div className="bg-white rounded px-1 py-1 w-full min-h-[44px] flex items-center justify-center shadow-sm">
                            <span className={`font-bold text-center leading-tight break-keep ${slot.name ? 'text-[9px] text-[#1a1a1a]' : 'text-[8px] text-gray-300'}`}>
                              {slot.name || '—'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className={`${bottomBg} py-1 text-center`}>
                        {gone ? (
                          <span className="text-[8px] text-white/90 font-bold">ここに戻す</span>
                        ) : slot.exp ? (
                          <>
                            <div className="text-sm font-bold text-white leading-none">{formatDate(slot.exp)}</div>
                            {dl !== null && (
                              <div className="text-[7px] text-white/70 mt-0.5">
                                {dl < 0 ? `${Math.abs(dl)}日超過` : dl === 0 ? '本日期限' : `あと${dl}日`}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-[10px] text-white/40">——</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
