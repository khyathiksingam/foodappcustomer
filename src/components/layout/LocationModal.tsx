import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, Plus, X, Home, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { DeliveryAddress } from '../../types';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    addresses,
    activeAddress,
    setActiveAddress,
    detectGpsLocation,
    addAddress,
  } = useApp();

  const [detectingGps, setDetectingGps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);

  // New address form state
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newName, setNewName] = useState('');
  const [newFlat, setNewFlat] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isLocationModalOpen) return null;

  const handleGpsDetect = async () => {
    setDetectingGps(true);
    await detectGpsLocation();
    setDetectingGps(false);
    setIsLocationModalOpen(false);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlat || !newArea) return;
    addAddress({
      type: newType,
      name: newName || `${newType} (${newArea})`,
      flat: newFlat,
      area: newArea,
      city: 'Bengaluru',
      pincode: '560038',
      phone: newPhone || '+91 98765 43210',
      lat: 12.9719,
      lng: 77.6412,
    });
    setShowAddNew(false);
    setIsLocationModalOpen(false);
  };

  const POPULAR_LOCALITIES = [
    'Indiranagar 100 Feet Rd',
    'Koramangala 4th Block',
    'HSR Layout Sector 3',
    'Whitefield ITPL Main Rd',
    'MG Road / Brigade Rd',
    'Jayanagar 4th Block',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Choose Delivery Location
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your delivery address or detect live location
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* GPS Detection Button */}
          <button
            onClick={handleGpsDetect}
            disabled={detectingGps}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/60 transition-all font-semibold text-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Navigation className={`w-5 h-5 ${detectingGps ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-left flex-1">
              <span className="block font-bold">
                {detectingGps ? 'Detecting your coordinates...' : 'Use Current GPS Location'}
              </span>
              <span className="block text-xs text-orange-500/80 font-normal">
                Using browser GPS for pinpoint delivery accuracy
              </span>
            </div>
          </button>

          {/* Search Location Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, street name or locality..."
              className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Popular Localities Chips */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Popular Localities
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_LOCALITIES.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    const matched: DeliveryAddress = {
                      id: 'pop-' + Date.now(),
                      type: 'Other',
                      name: loc,
                      flat: 'Standard Delivery Hub',
                      area: loc,
                      city: 'Bengaluru',
                      pincode: '560038',
                      phone: '+91 98765 43210',
                      lat: 12.9719,
                      lng: 77.6412,
                    };
                    setActiveAddress(matched);
                    setIsLocationModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Addresses List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Saved Addresses ({addresses.length})
              </span>
              <button
                onClick={() => setShowAddNew(!showAddNew)}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {showAddNew ? 'Cancel' : 'Add New'}
              </button>
            </div>

            {/* Add New Address Form */}
            {showAddNew && (
              <form onSubmit={handleSaveNewAddress} className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <p className="text-xs font-bold text-slate-900 dark:text-white">New Delivery Address</p>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        newType === t
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Address Nickname / Label (e.g. My Flat, Friend's Place)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Flat, House or Floor no. (e.g. Flat 302, Palm Crest)"
                  value={newFlat}
                  onChange={(e) => setNewFlat(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Street or Area (e.g. 100ft Road, Indiranagar)"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Contact Phone Number for Delivery"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Save Address & Deliver Here
                </button>
              </form>
            )}

            <div className="space-y-2">
              {addresses.map((addr) => {
                const isSelected = activeAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setActiveAddress(addr);
                      setIsLocationModalOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                        {addr.type === 'Home' ? (
                          <Home className="w-4 h-4" />
                        ) : addr.type === 'Work' ? (
                          <Briefcase className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {addr.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {addr.flat}, {addr.area}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
