import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConflictModal: React.FC = () => {
  const { conflictModalData, setConflictModalData, clearCart, addToCart, setIsCartOpen } =
    useApp();

  if (!conflictModalData) return null;

  const handleDiscardAndAdd = () => {
    clearCart();
    addToCart(
      conflictModalData.pendingDish,
      1,
      conflictModalData.pendingCustomizations
    );
    setConflictModalData(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Replace cart items?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Your cart currently contains dishes from <strong className="text-slate-800 dark:text-slate-200">{conflictModalData.currentRestName}</strong>.
          Would you like to discard the existing cart and add items from this restaurant instead?
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleDiscardAndAdd}
            className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Discard & Add Fresh</span>
          </button>
          <button
            onClick={() => setConflictModalData(null)}
            className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Keep Current Cart
          </button>
        </div>
      </div>
    </div>
  );
};
