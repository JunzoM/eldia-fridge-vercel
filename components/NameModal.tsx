'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { MenuState } from '@/lib/types';
import { NAMES } from '@/lib/constants';
import BottomSheet from './BottomSheet';

interface NameModalProps {
  menu: MenuState;
  current: string;
  label: string;
  onSave: (name: string, applyAll: boolean) => void;
  onClose: () => void;
}

export default function NameModal({ menu, current, label, onSave, onClose }: NameModalProps) {
  const [name, setName] = useState(current);
  const [scope, setScope] = useState<'this' | 'all'>('this');
  const isEmpty = !name.trim();

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-5 pb-12 pt-2">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-charcoal text-white rounded-lg px-2.5 py-1 font-bold text-base">{label}</span>
              <span className="text-[11px] text-gray-400">{menu.rn}号室</span>
            </div>
            <div className="text-sm text-gray-500">品目を変更・削除します</div>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 rounded-lg p-2 text-gray-500 active:bg-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick select from presets */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 mb-2">プリセットから選択</div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {NAMES.map(n => (
              <button
                key={n}
                onClick={() => setName(n)}
                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                  name === n
                    ? 'bg-charcoal text-white border-transparent'
                    : 'bg-gray-50 text-gray-600 border-gray-200 active:bg-gray-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Text input */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-gray-400 mb-2">品目名</div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="品目名を入力（空欄で削除）"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-[#1a1a1a] bg-gray-50 focus:border-charcoal"
          />
          {isEmpty && current && (
            <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-[11px] font-bold">
              <AlertTriangle size={12} />
              空欄にすると品目が削除されます
            </div>
          )}
        </div>

        {/* Scope */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-gray-400 mb-2">適用範囲</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setScope('this')}
              className={`py-3 rounded-xl text-sm font-bold border transition-colors ${
                scope === 'this'
                  ? 'bg-charcoal text-white border-transparent'
                  : 'bg-gray-50 text-gray-600 border-gray-200 active:bg-gray-100'
              }`}
            >
              この部屋のみ
            </button>
            <button
              onClick={() => setScope('all')}
              className={`py-3 rounded-xl text-sm font-bold border transition-colors ${
                scope === 'all'
                  ? 'bg-sky-600 text-white border-transparent'
                  : 'bg-gray-50 text-gray-600 border-gray-200 active:bg-gray-100'
              }`}
            >
              全室に適用
            </button>
          </div>
          {scope === 'all' && (
            <div className="mt-2 px-3 py-2 bg-sky-50 border border-sky-200 rounded-lg text-[11px] text-sky-700">
              全部屋の {label} スロットを変更します
            </div>
          )}
        </div>

        {/* Confirm */}
        <button
          onClick={() => onSave(name.trim(), scope === 'all')}
          className={`w-full rounded-2xl py-4 text-base font-bold border-2 transition-colors ${
            isEmpty
              ? 'bg-red-50 text-red-600 border-red-400 active:bg-red-100'
              : 'bg-charcoal text-white border-transparent active:bg-[#3a3a3a]'
          }`}
        >
          {isEmpty ? 'この品目を削除する' : scope === 'all' ? '全室に変更を適用する' : 'この部屋に変更を適用する'}
        </button>
      </div>
    </BottomSheet>
  );
}
