'use client';

import { useEffect } from 'react';

interface BottomSheetProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ onClose, children }: BottomSheetProps) {
  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/50 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
