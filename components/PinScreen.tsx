'use client';

import { useState } from 'react';
import { Delete } from 'lucide-react';
import { CORRECT_PIN, LS_PIN_OK } from '@/lib/constants';

interface PinScreenProps {
  onOk: () => void;
}

export default function PinScreen({ onOk }: PinScreenProps) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);

  function tap(n: string) {
    const np = pin + n;
    if (np.length === 4) {
      if (np === CORRECT_PIN) {
        try { localStorage.setItem(LS_PIN_OK, '1'); } catch {}
        onOk();
      } else {
        setErr(true);
        setTimeout(() => { setErr(false); setPin(''); }, 800);
      }
    } else {
      setPin(np);
    }
  }

  function del() { setPin(p => p.slice(0, -1)); }

  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'] as const;

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center z-[9999]">
      <div className="text-[13px] text-gold font-bold tracking-[0.2em] mb-2">HOTEL ELDIA 神戸</div>
      <div className="text-[11px] text-[#888] mb-8">PIN入力</div>

      {/* Dots */}
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-colors duration-150 ${
              pin.length > i
                ? err ? 'bg-red-600' : 'bg-gold'
                : 'bg-[#444]'
            }`}
          />
        ))}
      </div>

      {err && (
        <div className="text-xs text-red-500 font-bold mb-4">PINが違います</div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-60">
        {keys.map((n, i) => {
          if (n === null) {
            return <div key={i} />;
          }
          if (n === 'del') {
            return (
              <button
                key={i}
                onClick={del}
                className="bg-[#2c2c2c] text-white rounded-2xl py-[18px] text-lg font-bold flex items-center justify-center active:bg-[#3a3a3a]"
              >
                <Delete size={20} />
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => tap(String(n))}
              className="bg-[#2c2c2c] text-white rounded-2xl py-[18px] text-2xl font-bold active:bg-[#3a3a3a] transition-colors"
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
