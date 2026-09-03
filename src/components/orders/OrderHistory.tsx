import React from 'react';
import {
  X,
  Repeat,
  FileText,
  Star,
  Clock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from './InvoiceModal';
import { RatingModal } from './RatingModal';
import type { Order } from '../../types';

export const OrderHistory: React.FC = () => {
  const {
    isOrderHistoryOpen,
    setIsOrderHistoryOpen,
    orders,
    reorder,
    setActiveInvoiceOrder,
    setIsInvoiceModalOpen,
    setOrderToRate,
    setIsRatingModalOpen,
    setIsLiveTrackingOpen,
  } = useApp();

  if (!isOrderHistoryOpen) return null;

  const handleOpenInvoice = (order: Order) => {
    setActiveInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenRating = (order: Order) => {
    setOrderToRate(order);
    setIsRatingModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Past Orders & Reorder
                </h3>
                <p className="text-xs text-slate-400">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOrderHistoryOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orders List */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No previous orders
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Once you order, your order history and invoices will appear here.
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const isDelivered = order.status === 'delivered';
                const isCancelled = order.status === 'cancelled';

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 transition-all hover:border-orange-300"
                  >
                    {/* Top Row: Restaurant info & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={order.restaurantImage}
                          alt={order.restaurantName}
                          className="w-12 h-12 rounded-2xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {order.restaurantName}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Order #{order.id} • {order.date}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Delivered to: {order.deliveryAddress.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                            isDelivered
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : isCancelled
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 animate-pulse'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <span className="block text-sm font-black text-slate-900 dark:text-white mt-1">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Items snippet */}
                    <div className="py-2 border-y border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                      {order.items.map((i) => (
                        <span key={i.id} className="mr-3 inline-block">
                          {i.quantity}x {i.dish.name}
                        </span>
                      ))}
                    </div>

                    {/* Review Snippet if already rated */}
                    {order.restaurantRating && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>You rated {order.restaurantRating}★</span>
                        {order.reviewComment && (
                          <span className="truncate italic">- "{order.reviewComment}"</span>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenInvoice(order)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>

                        {isDelivered && (
                          <button
                            onClick={() => handleOpenRating(order)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span>{order.restaurantRating ? 'Edit Rating' : 'Rate Food'}</span>
                          </button>
                        )}

                        {!isDelivered && !isCancelled && (
                          <button
                            onClick={() => {
                              setIsOrderHistoryOpen(false);
                              setIsLiveTrackingOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-black shadow transition-colors"
                          >
                            <span>Live Tracking</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Reorder Button */}
                      <button
                        onClick={() => reorder(order)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>

      <InvoiceModal />
      <RatingModal />
    </>
  );
};
