import React from 'react';
import { Home, Search, Clock, Heart, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    setSelectedRestaurant,
    setSelectedCategory,
    setIsOrderHistoryOpen,
    setIsFavoritesOpen,
    setIsProfileOpen,
    setIsAuthModalOpen,
    user,
    activeOrder,
  } = useApp();

  const handleHome = () => {
    setSelectedRestaurant(null);
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1.5 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={handleHome}
          className="flex flex-col items-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => {
            handleHome();
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) input.focus();
          }}
          className="flex flex-col items-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Search</span>
        </button>

        <button
          onClick={() => setIsOrderHistoryOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors relative"
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Orders</span>
          {activeOrder && activeOrder.status !== 'delivered' && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setIsFavoritesOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Saved</span>
        </button>

        <button
          onClick={() => (user ? setIsProfileOpen(true) : setIsAuthModalOpen(true))}
          className="flex flex-col items-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>
    </div>
  );
};
