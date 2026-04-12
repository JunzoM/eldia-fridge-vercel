'use client';

import { Pencil, Tag, PackageOpen, PackageCheck, X } from 'lucide-react';
import type { MenuState } from '@/lib/types';
import BottomSheet from './BottomSheet';

interface MenuModalProps {
  menu: MenuState;
  name: string;
  label: string;
  onEditDate: () => void;
  onEditName: () => void;
  onRemove: () => void;
  onReturn: () => void;
  onClose: () => void;
}

export default function MenuModal({
  menu, name, label,
  onEditDate, onEditName, onRemove, onReturn, onClose,
}: MenuModalProps) {
  const isReturn = menu.mode === 'ret';

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-4 pb-10 pt-2">
        {/* Slot info */}
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-charcoal dark:bg-[#0a0a0a] text-white rounded-xl px-3 py-1.5 font-bold text-lg flex-shrink-0">
            {label}
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">{name || '（未設定）'}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{menu.rn}号室</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {isReturn ? (
            <>
              <button
                onClick={onReturn}
                className="w-full bg-green-50 dark:bg-green-950/40 border-2 border-green-500 rounded-2xl p-4 text-green-700 dark:text-green-400 font-bold text-base flex items-center justify-center gap-3 active:opacity-80"
              >
                <PackageCheck size={20} />
                元の場所に戻した
              </button>
              <button
                onClick={onEditDate}
                className="w-full bg-gray-50 dark:bg-[#262626] border-2 border-gray-200 dark:border-[#333] rounded-2xl p-4 text-gray-600 dark:text-gray-300 font-semibold text-[15px] flex items-center justify-center gap-3 active:opacity-80"
              >
                <Pencil size={18} />
                期限を更新する
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEditDate}
                className="w-full bg-charcoal dark:bg-[#0a0a0a] rounded-2xl p-4 text-white font-bold text-base flex items-center justify-center gap-3 active:opacity-80"
              >
                <Pencil size={20} />
                期限を更新する
              </button>
              <button
                onClick={onEditName}
                className="w-full bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-400 rounded-2xl p-4 text-sky-700 dark:text-sky-400 font-bold text-[15px] flex items-center justify-center gap-3 active:opacity-80"
              >
                <Tag size={18} />
                品目を変更・削除する
              </button>
              <button
                onClick={onRemove}
                className="w-full bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 rounded-2xl p-4 text-amber-800 dark:text-amber-400 font-bold text-[15px] flex items-center justify-center gap-3 active:opacity-80"
              >
                <PackageOpen size={18} />
                取り出し中にする
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gray-100 dark:bg-[#2d2d2d] rounded-2xl p-3.5 text-gray-400 font-semibold text-sm flex items-center justify-center gap-2 active:opacity-80"
          >
            <X size={16} />
            キャンセル
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
