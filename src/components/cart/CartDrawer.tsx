import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  MapPin,
  Clock,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CouponModal } from './CouponModal';

const DELIVERY_PRESETS = [
  'Leave at door',
  "Don't ring bell",
  'Avoid calling',
  'Leave with guard',
  'Directions: Gate 2',
];

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartRestaurant,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    platformFee,
    taxes,
    discount,
    cartTotal,
    appliedCoupon,
    removeCoupon,
    activeAddress,
    setIsLocationModalOpen,
    deliveryInstructions,
    setDeliveryInstructions,
    cookingInstructions,
    setCookingInstructions,
    setIsCheckoutOpen,
    user,
    setIsAuthModalOpen,
  } = useApp();

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                  {cartRestaurant ? cartRestaurant.name : 'Your Cart'}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-500 font-bold p-1.5"
                  title="Clear all items"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Body */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Your cart is empty
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Explore our mouthwatering dishes and treat yourself to something extraordinary!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all"
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              
              {/* Delivery ETA banner */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="font-bold">
                    Delivery in {cartRestaurant?.deliveryTimeMins || 25} mins
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Standard Delivery</span>
              </div>

              {/* Line Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {item.dish.isVeg ? (
                          <div className="w-3 h-3 rounded-sm border border-emerald-600 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          </div>
                        ) : (
                          <div className="w-3 h-3 rounded-sm border border-rose-600 flex items-center justify-center">
                            <div className="w-0 h-0 border-x-2 border-x-transparent border-b-4 border-b-rose-600" />
                          </div>
                        )}
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.dish.name}
                        </h4>
                      </div>

                      {/* Customizations summary */}
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.customizations.map((g) => (
                            <p key={g.groupId} className="text-[10px] text-slate-400">
                              {g.groupTitle}: {g.selectedOptions.map((o) => o.name).join(', ')}
                            </p>
                          ))}
                        </div>
                      )}

                      <span className="text-xs font-black text-slate-900 dark:text-white mt-1.5 block">
                        ₹{item.itemTotal * item.quantity}
                      </span>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                          className="w-4 h-4 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                          className="w-4 h-4 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooking Instructions field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cooking instructions for the chef
                </label>
                <input
                  type="text"
                  value={cookingInstructions}
                  onChange={(e) => setCookingInstructions(e.target.value)}
                  placeholder="e.g. Less spicy, keep chutney extra..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Coupons Section */}
              <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                          Code {appliedCoupon.code} Applied!
                        </p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          Saving ₹{discount} on this order
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-black text-rose-500 hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Have a promo code?
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCouponModalOpen(true)}
                      className="text-xs font-black text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      View Coupons
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Address Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Deliver to: {activeAddress?.name}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeAddress?.flat}, {activeAddress?.area}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline shrink-0"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Delivery Instructions Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Delivery instructions for rider
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DELIVERY_PRESETS.map((preset) => {
                    const isSelected = deliveryInstructions === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => setDeliveryInstructions(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Bill Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                  Bill Summary
                </h4>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{cartSubtotal}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <span>Delivery Partner Fee</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                        (Free)
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                {cartSubtotal < 299 && deliveryFee > 0 && (
                  <p className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                    💡 Add items worth ₹{299 - cartSubtotal} more for FREE Delivery!
                  </p>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{platformFee}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST & Restaurant Taxes (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{taxes}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                  <span>To Pay</span>
                  <span className="text-base text-orange-600 dark:text-orange-400">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Safe & Contactless Delivery</span>
              </div>
            </div>
          )}

          {/* Sticky Proceed Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <button
                onClick={handleProceedCheckout}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-sm shadow-xl shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between px-5"
              >
                <div className="text-left">
                  <span className="text-[10px] text-white/80 block uppercase font-bold">
                    Total Amount
                  </span>
                  <span className="text-base font-black">₹{cartTotal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />
    </>
  );
};
