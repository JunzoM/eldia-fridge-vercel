'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsViewProps {
  sbReady: boolean;
}

export default function SettingsView({ sbReady }: SettingsViewProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Supabase status */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm dark:border dark:border-[#2d2d2d]">
        <div className="text-[12px] text-gray-400 font-bold mb-3">SUPABASE 接続状態</div>
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-bold text-sm ${
            sbReady
              ? 'bg-green-50 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-700 dark:text-green-400'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400'
          }`}
        >
          {sbReady ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {sbReady ? '✅ Supabase 接続済' : '⚠ Supabase 未設定'}
        </div>
      </div>

      {/* Slot label guide */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4">
        <div className="text-[12px] font-bold text-amber-800 dark:text-amber-400 mb-3">スロット番号ラベルの貼り方</div>
        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed mb-3">
          冷蔵庫の各スロット枠に A1〜D4 のシールを貼ると、取り出した商品の返却場所が一目でわかります。
        </p>
        <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
          <div>横列：1・2・3・4（左から）</div>
          <div>縦行：A（上段）→ B → C → D（下段）</div>
        </div>
      </div>

      <div className="text-center text-[10px] text-gray-300 dark:text-gray-600 pt-2">
        ELDIA Fridge Manager v2.0
      </div>
    </div>
  );
}
