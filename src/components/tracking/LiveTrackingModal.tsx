import React from 'react';
import {
  X,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  FastForward,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from './LeafletMap';
import { PartnerCallModal } from './PartnerCallModal';
import { PartnerChatModal } from './PartnerChatModal';
import type { OrderStatus } from '../../types';

export const LiveTrackingModal: React.FC = () => {
  const {
    isLiveTrackingOpen,
    setIsLiveTrackingOpen,
    activeOrder,
    advanceOrderStatus,
    setIsPartnerCallOpen,
    setIsPartnerChatOpen,
    setIsSupportOpen,
    setIsRatingModalOpen,
    setOrderToRate,
  } = useApp();

  const [showOrderItems, setShowOrderItems] = React.useState(false);

  if (!isLiveTrackingOpen || !activeOrder) return null;

  const STATUS_STEPS: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      desc: 'Restaurant is reviewing your order',
      icon: Clock,
    },
    {
      key: 'accepted',
      label: 'Order Confirmed',
      desc: 'Restaurant accepted your order',
      icon: CheckCircle2,
    },
    {
      key: 'preparing',
      label: 'Kitchen Preparing',
      desc: 'Chef is cooking your fresh meal',
      icon: ChefHat,
    },
    {
      key: 'partner_assigned',
      label: 'Rider Assigned',
      desc: 'Delivery partner arriving at restaurant',
      icon: Bike,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      desc: 'Food is on the way to your door',
      icon: Bike,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      desc: 'Enjoy your hot & fresh meal!',
      icon: PackageCheck,
    },
  ];

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === activeOrder.status);

  const handleRateDelivery = () => {
    setOrderToRate(activeOrder);
    setIsRatingModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-transparent">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Live Order #{activeOrder.id}
                </span>
                {activeOrder.status === 'delivered' ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                    Delivered
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Live Updates
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {activeOrder.restaurantName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Fast forward debug simulator control */}
              {activeOrder.status !== 'delivered' && (
                <button
                  onClick={() => advanceOrderStatus(activeOrder.id)}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/60 dark:hover:bg-orange-900 text-orange-600 dark:text-orange-400 text-xs font-black transition-colors"
                  title="Fast-forward order status simulation"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Next Status</span>
                </button>
              )}

              <button
                onClick={() => setIsLiveTrackingOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Tracker Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
            
            {/* ETA Countdown Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-between shadow-lg shadow-orange-500/25">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/80 block">
                  Estimated Delivery
                </span>
                <h4 className="text-xl sm:text-2xl font-black">
                  {activeOrder.status === 'delivered'
                    ? 'Delivered to Doorstep 🎉'
                    : `Arriving in ~${activeOrder.etaMinutes} mins`}
                </h4>
                <p className="text-xs text-white/90 mt-0.5">
                  Deliver to: {activeOrder.deliveryAddress.name} ({activeOrder.deliveryAddress.area})
                </p>
              </div>
              <Clock className="w-10 h-10 text-white/40 shrink-0" />
            </div>

            {/* Interactive Leaflet Route Map */}
            {(() => {
              const uLat = activeOrder.deliveryAddress.lat || 17.5389;
              const uLng = activeOrder.deliveryAddress.lng || 78.3852;
              const rLat = uLat + 0.0085;
              const rLng = uLng + 0.0065;
              return (
                <LeafletMap
                  restaurantLat={rLat}
                  restaurantLng={rLng}
                  restaurantName={activeOrder.restaurantName}
                  userLat={uLat}
                  userLng={uLng}
                  userName={activeOrder.deliveryAddress.name}
                  partnerLat={activeOrder.deliveryPartner ? uLat + 0.004 : undefined}
                  partnerLng={activeOrder.deliveryPartner ? uLng + 0.003 : undefined}
                  isOutForDelivery={activeOrder.status === 'out_for_delivery'}
                />
              );
            })()}

            {/* Delivery Partner Card */}
            {activeOrder.deliveryPartner && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeOrder.deliveryPartner.photo}
                    alt={activeOrder.deliveryPartner.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {activeOrder.deliveryPartner.name}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black">
                        ★ {activeOrder.deliveryPartner.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeOrder.deliveryPartner.vehicleModel} • {activeOrder.deliveryPartner.vehiclePlate}
                    </p>
                  </div>
                </div>

                {/* Call & Chat Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPartnerChatOpen(true)}
                    className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-orange-500 flex items-center justify-center shadow-sm transition-colors"
                    title="Chat with partner"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPartnerCallOpen(true)}
                    className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 transition-colors"
                    title="Call partner"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Order Timeline
              </h4>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  const time = (activeOrder.statusTimestamps as any)[step.key];

                  return (
                    <div key={step.key} className="flex items-start gap-3 relative">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors ${
                          isCurrent
                            ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-950/60'
                            : isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold ${
                              isDone
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                          {time && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {time}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* If delivered, show rate button */}
            {activeOrder.status === 'delivered' && !activeOrder.restaurantRating && (
              <button
                onClick={handleRateDelivery}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-600/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Rate Your Meal & Delivery Experience</span>
              </button>
            )}

            {/* Order Items Accordion */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowOrderItems(!showOrderItems)}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <span>Items in this order ({activeOrder.items.length})</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showOrderItems ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showOrderItems && (
                <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800 space-y-2 text-xs">
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.quantity}x {item.dish.name}
                        </span>
                        {item.customizations && (
                          <p className="text-[10px] text-slate-400">
                            {item.customizations
                              .map((c) => c.selectedOptions.map((o) => o.name).join(', '))
                              .join(' • ')}
                          </p>
                        )}
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">
                        ₹{item.itemTotal * item.quantity}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 flex justify-between font-black text-slate-900 dark:text-white">
                    <span>Total Paid ({activeOrder.paymentMethod})</span>
                    <span className="text-orange-600">₹{activeOrder.total}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Support Link */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsLiveTrackingOpen(false);
                  setIsSupportOpen(true);
                }}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need help with this order? Contact CraveWave Support</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      <PartnerCallModal />
      <PartnerChatModal />
    </>
  );
};
