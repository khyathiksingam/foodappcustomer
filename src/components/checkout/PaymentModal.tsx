import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  Building2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartTotal,
    walletBalance,
    placeOrder,
    activeAddress,
    cartRestaurant,
  } = useApp();

  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD'>('UPI');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = async () => {
    setError('');
    if (method === 'Wallet' && walletBalance < cartTotal) {
      setError('Insufficient wallet balance. Please choose UPI or Card.');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200)); // simulated payment gateway handshake
      await placeOrder(method);
    } catch (err: any) {
      setError(err?.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Choose Payment Method
            </h3>
            <p className="text-xs text-slate-400">
              {cartRestaurant ? `${cartRestaurant.name} • ` : ''}Deliver to {activeAddress?.name} • Total ₹{cartTotal}
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200">
              {error}
            </div>
          )}

          {/* Payment Method Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'UPI', label: 'UPI', icon: Smartphone },
              { id: 'Card', label: 'Cards', icon: CreditCard },
              { id: 'NetBanking', label: 'NetBank', icon: Building2 },
              { id: 'Wallet', label: 'Wallet', icon: Wallet },
              { id: 'COD', label: 'Cash / COD', icon: Banknote },
            ].map((pm) => {
              const Icon = pm.icon;
              const isSelected = method === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span>{pm.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Payment Body */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            {/* 1. UPI */}
            {method === 'UPI' && (
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Instant UPI App
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gpay', name: 'Google Pay', badge: 'GPay' },
                    { id: 'phonepe', name: 'PhonePe', badge: 'PhonePe' },
                    { id: 'paytm', name: 'Paytm UPI', badge: 'Paytm' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setUpiOption(u.id as any)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        upiOption === u.id
                          ? 'border-orange-500 bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {u.badge}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                    Or Enter Any UPI VPA
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi / username@okaxis"
                    value={customUpiId}
                    onChange={(e) => {
                      setCustomUpiId(e.target.value);
                      setUpiOption('custom');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>
            )}

            {/* 2. CARD */}
            {method === 'Card' && (
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Credit / Debit Card Details
                </p>
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 8920)"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-center font-mono"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 text-center font-mono"
                  />
                </div>
              </div>
            )}

            {/* 3. NET BANKING */}
            {method === 'NetBanking' && (
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Popular Banks
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBank(b)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                        selectedBank === b
                          ? 'border-orange-500 bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. WALLET */}
            {method === 'Wallet' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    CraveWave Wallet Balance
                  </span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ₹{walletBalance}
                  </span>
                </div>
                {walletBalance >= cartTotal ? (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Sufficient balance available. Instant 1-tap checkout.
                  </p>
                ) : (
                  <p className="text-[11px] text-rose-500 font-bold">
                    ⚠️ Short by ₹{cartTotal - walletBalance}. Please choose UPI or Card.
                  </p>
                )}
              </div>
            )}

            {/* 5. COD */}
            {method === 'COD' && (
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  Pay with Cash or QR at Doorstep
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please keep exact change of ₹{cartTotal} ready, or ask the rider to present their UPI QR code on delivery.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted Secure Payment Gateway</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-sm shadow-xl shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between px-6"
          >
            {isProcessing ? (
              <div className="w-full flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Securing Order...</span>
              </div>
            ) : (
              <>
                <div className="text-left">
                  <span className="text-[10px] text-white/80 uppercase font-bold block">
                    Total to Pay
                  </span>
                  <span className="text-base font-black">₹{cartTotal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
