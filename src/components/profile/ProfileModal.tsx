import React, { useState } from 'react';
import {
  X,
  Wallet,
  Moon,
  Sun,
  LogOut,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    user,
    logout,
    updateProfile,
    walletBalance,
    addWalletMoney,
    addresses,
    deleteAddress,
    setIsLocationModalOpen,
    theme,
    toggleTheme,
    vegOnlyFilter,
    setVegOnlyFilter,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!isProfileOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}
              alt={user?.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow"
            />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {user?.name || 'Gourmet Member'}
              </h3>
              <p className="text-xs text-slate-400">{user?.phone}</p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          
          {/* Wallet Balance Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white shadow-xl shadow-orange-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-200" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-white/90">
                  CraveWave Wallet
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-black uppercase">
                Active
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">₹{walletBalance}</span>
              <span className="text-xs text-white/80 font-medium">available</span>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-2">
              <span className="text-[11px] text-white/90 font-medium">Add instant balance:</span>
              <div className="flex gap-2">
                {[100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => addWalletMoney(amt)}
                    className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 backdrop-blur-md text-white font-bold text-xs transition-colors"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile Form */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                Profile Information
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                {isEditing ? 'Cancel' : 'Edit Info'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-bold shadow transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user?.name}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Phone</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {user?.phone}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Email</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user?.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* App Preferences */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
              Preferences
            </span>

            {/* Veg Only Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Pure Veg Mode (Strictly Veg)
                </span>
              </div>
              <button
                onClick={() => setVegOnlyFilter((v: boolean) => !v)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  vegOnlyFilter ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    vegOnlyFilter ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Dark Theme Mode
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  theme === 'dark' ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    theme === 'dark' ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Saved Addresses Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                Saved Addresses ({addresses.length})
              </span>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsLocationModalOpen(true);
                }}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manage</span>
              </button>
            </div>

            <div className="space-y-2">
              {addresses.slice(0, 3).map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <div className="truncate">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{addr.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{addr.flat}, {addr.area}</p>
                  </div>
                  {addresses.length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              logout();
              setIsProfileOpen(false);
            }}
            className="w-full py-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from CraveWave</span>
          </button>

        </div>

      </div>
    </div>
  );
};
