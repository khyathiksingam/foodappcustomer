import React, { useState } from 'react';
import { X, Tag, Check } from 'lucide-react';
import { AVAILABLE_COUPONS } from '../../data/coupons';
import { useApp } from '../../context/AppContext';

export const CouponModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { applyCoupon, appliedCoupon, cartSubtotal } = useApp();
  const [customCode, setCustomCode] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    setFeedbackMsg({ text: res.message, success: res.success });
    if (res.success) {
      setTimeout(() => {
        onClose();
        setFeedbackMsg(null);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Available Coupons
              </h3>
              <p className="text-xs text-slate-400">Save extra on your feast</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Custom coupon input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code (e.g. CRAVE50)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              className="flex-1 px-3.5 py-2.5 text-xs font-bold rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-orange-500 focus:outline-none uppercase"
            />
            <button
              onClick={() => handleApply(customCode)}
              disabled={!customCode.trim()}
              className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black shadow transition-colors"
            >
              Apply
            </button>
          </div>

          {feedbackMsg && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold ${
                feedbackMsg.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200'
              }`}
            >
              {feedbackMsg.text}
            </div>
          )}

          {/* Coupon cards list */}
          <div className="space-y-3 pt-2">
            {AVAILABLE_COUPONS.map((coupon) => {
              const isCurrent = appliedCoupon?.code === coupon.code;
              const isEligible = cartSubtotal >= coupon.minOrderValue;

              return (
                <div
                  key={coupon.code}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-xs font-black tracking-wider uppercase border border-dashed border-orange-300 dark:border-orange-800">
                          {coupon.code}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <Check className="w-3 h-3" /> Applied
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                        {coupon.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {coupon.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApply(coupon.code)}
                      disabled={isCurrent}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-slate-900 hover:bg-orange-500 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-orange-500 dark:hover:text-white shadow-sm'
                      }`}
                    >
                      {isCurrent ? 'APPLIED' : 'APPLY'}
                    </button>
                  </div>

                  {!isEligible && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 font-medium">
                      Add items worth ₹{coupon.minOrderValue - cartSubtotal} more to unlock
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
