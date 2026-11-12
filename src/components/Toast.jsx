import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#081226]/95 text-white border border-sky-500/40 shadow-2xl backdrop-blur-md animate-slideUp text-xs font-bold"
      dir="rtl"
    >
      <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
        {type === 'cart' ? (
          <ShoppingBag className="w-4 h-4 text-amber-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
      </div>

      <div className="flex-1">
        <span className="text-white block leading-snug">{message}</span>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

