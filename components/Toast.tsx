interface ToastProps {
  msg: string;
  type: 'ok' | 'err';
}

export default function Toast({ msg, type }: ToastProps) {
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-xl whitespace-nowrap animate-fadeDown ${
        type === 'err' ? 'bg-red-600' : 'bg-[#1a1a1a]'
      }`}
    >
      {msg}
    </div>
  );
}
