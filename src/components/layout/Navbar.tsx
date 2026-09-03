import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingBag,
  Bell,
  Heart,
  User as UserIcon,
  Flame,
  Moon,
  Sun,
  X,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    user,
    activeAddress,
    setIsLocationModalOpen,
    setIsAuthModalOpen,
    setIsProfileOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    unreadNotifCount,
    notifications,
    markAllNotificationsAsRead,
    isFavoritesOpen,
    setIsFavoritesOpen,
    searchQuery,
    setSearchQuery,
    vegOnlyFilter,
    setVegOnlyFilter,
    theme,
    toggleTheme,
    setSelectedCategory,
    setSelectedRestaurant,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleHomeClick = () => {
    setSelectedRestaurant(null);
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  CraveWave
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Food Express
                </span>
              </div>
            </button>

            {/* Location selector trigger */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors max-w-[160px] sm:max-w-[260px] border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Click to change delivery address"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {activeAddress?.name || 'Deliver To'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {activeAddress?.area || 'Select address...'}
                </p>
              </div>
            </button>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, restaurants, cuisines..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnlyFilter((v) => !v)}
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                vegOnlyFilter
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ring-2 ring-emerald-500 ${
                  vegOnlyFilter ? 'bg-emerald-500' : 'bg-transparent'
                }`}
              />
              Pure Veg
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Saved Favorites"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Notifications Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute 1.5 top-1.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown panel */}
              {showNotifMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Notifications
                        </span>
                      </div>
                      {unreadNotifCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 my-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`py-3 px-1 transition-colors ${
                              !n.isRead ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                {n.title}
                              </p>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Pill Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{totalCartItems}</span>
              {totalCartItems > 0 && (
                <>
                  <span className="opacity-60">•</span>
                  <span>₹{cartTotal}</span>
                </>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-xl object-cover"
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search input below header */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, restaurants, cuisines..."
              className="w-full pl-10 pr-9 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
