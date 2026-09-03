import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { LocationModal } from './components/layout/LocationModal';
import { AuthModal } from './components/auth/AuthModal';
import { HomeView } from './components/home/HomeView';
import { RestaurantDetail } from './components/restaurant/RestaurantDetail';
import { CustomizationModal } from './components/restaurant/CustomizationModal';
import { ConflictModal } from './components/restaurant/ConflictModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { PaymentModal } from './components/checkout/PaymentModal';
import { LiveTrackingModal } from './components/tracking/LiveTrackingModal';
import { OrderHistory } from './components/orders/OrderHistory';
import { FavoritesView } from './components/favorites/FavoritesView';
import { SupportModal } from './components/support/SupportModal';
import { ProfileModal } from './components/profile/ProfileModal';
import {
  ShoppingBag,
  ArrowRight,
  Compass,
  Heart,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    selectedRestaurant,
    cart,
    cartTotal,
    cartRestaurant,
    setIsCartOpen,
    activeOrder,
    setIsLiveTrackingOpen,
    setIsSupportOpen,
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-orange-500 selection:text-white">
      {/* App Navbar */}
      <Navbar />

      {/* Floating Active Order Tracker Strip */}
      {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
        <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 text-white py-2.5 px-4 sticky top-16 sm:top-20 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
              <div className="truncate">
                <span className="font-extrabold uppercase tracking-wider">
                  Order #{activeOrder.id} •{' '}
                </span>
                <span className="font-semibold text-white/90">
                  {activeOrder.status === 'out_for_delivery'
                    ? 'Rider is arriving at your door!'
                    : activeOrder.status.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span className="opacity-75 hidden sm:inline ml-1">
                  (~{activeOrder.etaMinutes} mins)
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLiveTrackingOpen(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white text-slate-900 hover:bg-orange-50 font-black text-xs shrink-0 shadow-sm transition-all"
            >
              <span>Track Live Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {selectedRestaurant ? <RestaurantDetail /> : <HomeView />}
      </main>

      {/* Floating Cart Indicator Pill on bottom right (desktop & tablet) */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-30 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-orange-500/35 hover:brightness-110 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-white/80 uppercase font-bold leading-none">
                  {cartRestaurant?.name || 'Your Cart'}
                </span>
                <span className="block font-black">
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} • ₹{cartTotal}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 pl-2 border-l border-white/20">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Floating Support Button */}
      <button
        onClick={() => setIsSupportOpen(true)}
        className="fixed bottom-16 sm:bottom-6 left-4 sm:left-6 z-30 w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-500 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        title="24x7 Customer Support"
      >
        <Headphones className="w-5 h-5" />
      </button>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-10 pb-24 sm:pb-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  CraveWave
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your premier modern food delivery destination. Delivering hand-crafted culinary
                experiences, authentic flavors, and lightning-fast joy to your doorstep.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Verified Quality Kitchens</span>
              </div>
            </div>

            {/* Popular Cuisines */}
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Popular Cuisines
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <li className="hover:text-orange-500 cursor-pointer">Hyderabadi Dum Biryani</li>
                <li className="hover:text-orange-500 cursor-pointer">Artisanal Neapolitan Pizza</li>
                <li className="hover:text-orange-500 cursor-pointer">Pure Veg North & South Indian</li>
                <li className="hover:text-orange-500 cursor-pointer">Double Smash Burgers & Shakes</li>
                <li className="hover:text-orange-500 cursor-pointer">Tokyo Dimsums & Spicy Ramen</li>
              </ul>
            </div>

            {/* Company & Support */}
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Help & Company
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <li
                  onClick={() => setIsSupportOpen(true)}
                  className="hover:text-orange-500 cursor-pointer"
                >
                  Customer Support Bot
                </li>
                <li className="hover:text-orange-500 cursor-pointer">Partner With CraveWave</li>
                <li className="hover:text-orange-500 cursor-pointer">Ride With Us (Delivery)</li>
                <li className="hover:text-orange-500 cursor-pointer">Safety & Hygiene Standards</li>
                <li className="hover:text-orange-500 cursor-pointer">Terms & Privacy Policy</li>
              </ul>
            </div>

            {/* Contact & Hours */}
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Service Hub
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operational 24 Hours • 7 Days a Week
              </p>
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-1">
                Helpline: 1800-CRAVE-WAVE
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Bengaluru • Mumbai • Delhi NCR</p>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} CraveWave Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for passionate foodies</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* All Modal Overlays */}
      <LocationModal />
      <AuthModal />
      <CartDrawer />
      <PaymentModal />
      <LiveTrackingModal />
      <OrderHistory />
      <FavoritesView />
      <SupportModal />
      <ProfileModal />
      <CustomizationModal />
      <ConflictModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
