import { useEffect, useState, useCallback } from 'react';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const listeners: ((toast: ToastItem) => void)[] = [];

export function pushToast(message: string, type: ToastItem['type'] = 'success') {
  const item: ToastItem = { id: ++toastId, message, type };
  listeners.forEach(l => l(item));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const listener = (toast: ToastItem) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => remove(toast.id), 3500);
    };
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, [remove]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded-xl backdrop-blur-xl border text-sm font-medium shadow-2xl animate-[slideIn_0.3s_ease-out] ${
            t.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100'
              : t.type === 'error'
              ? 'bg-rose-500/20 border-rose-400/40 text-rose-100'
              : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-100'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
