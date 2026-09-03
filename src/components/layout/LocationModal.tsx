import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Search,
  Check,
  X,
  Home,
  Briefcase,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { DeliveryAddress } from '../../types';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: Record<string, string | undefined>;
}

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    addresses,
    activeAddress,
    setActiveAddress,
    addAddress,
  } = useApp();

  const [detectingGps, setDetectingGps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Selected Pin State (defaults to active address or Hyderabad / Bengaluru)
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: activeAddress?.lat || 17.5389,
    lng: activeAddress?.lng || 78.3852,
  });

  const [addressDetails, setAddressDetails] = useState({
    title: activeAddress?.name || 'Selected Location',
    flat: activeAddress?.flat || '',
    area: activeAddress?.area || '',
    city: activeAddress?.city || '',
    pincode: activeAddress?.pincode || '',
  });

  // New address form state
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newFlat, setNewFlat] = useState('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Reverse Geocoding helper
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'User-Agent': 'CraveWave-App/1.0' } }
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const mainTitle = data.name || addr.amenity || addr.building || addr.road || 'Pinned Location';
        const areaName = addr.suburb || addr.neighbourhood || addr.road || addr.village || addr.town || 'Selected Area';
        const cityName = addr.city || addr.town || addr.county || addr.state_district || 'City';
        const stateName = addr.state || '';
        const pincode = addr.postcode || '';

        setAddressDetails({
          title: mainTitle,
          flat: mainTitle,
          area: areaName,
          city: `${cityName}${stateName ? ', ' + stateName : ''}`,
          pincode,
        });
      }
    } catch {
      // Keep existing details if network request fails
    }
  };

  // Initialize or re-center map when modal opens
  useEffect(() => {
    if (!isLocationModalOpen) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [selectedCoords.lat, selectedCoords.lng],
          zoom: 15,
          zoomControl: true,
          attributionControl: false,
        });
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        const pinIcon = L.divIcon({
          html: `
            <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: #f97316; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #f97316, #e11d48); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.6); border: 2.5px solid white; z-index: 10;">
                <span style="font-size: 18px;">📍</span>
              </div>
            </div>
          `,
          className: 'custom-location-pin',
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        });

        const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
          draggable: true,
          icon: pinIcon,
        }).addTo(map);
        markerRef.current = marker;

        marker.on('dragend', async () => {
          const pos = marker.getLatLng();
          setSelectedCoords({ lat: pos.lat, lng: pos.lng });
          await reverseGeocode(pos.lat, pos.lng);
        });

        map.on('click', async (e) => {
          marker.setLatLng(e.latlng);
          setSelectedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
          await reverseGeocode(e.latlng.lat, e.latlng.lng);
        });
      } else {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.setView([selectedCoords.lat, selectedCoords.lng], 15);
        if (markerRef.current) {
          markerRef.current.setLatLng([selectedCoords.lat, selectedCoords.lng]);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isLocationModalOpen, selectedCoords.lat, selectedCoords.lng]);

  // Debounced search with token fallback
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // 1. Try exact search
        let res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&addressdetails=1&limit=6`,
          { headers: { 'User-Agent': 'CraveWave-App/1.0' } }
        );
        let data: SearchResult[] = await res.json();

        // 2. If 0 results, strip common suffixes (e.g. "HOSTEL", "CAMPUS", "MESS", "FLAT")
        if (!data || data.length === 0) {
          const cleaned = searchQuery.replace(/\b(hostel|mess|campus|block|gate|room|flat|apartment)\b/gi, '').trim();
          if (cleaned && cleaned !== searchQuery) {
            res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                cleaned
              )}&addressdetails=1&limit=6`,
              { headers: { 'User-Agent': 'CraveWave-App/1.0' } }
            );
            data = await res.json();
          }
        }

        setSearchResults(data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isLocationModalOpen) return null;

  // Handle selecting a search suggestion
  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSelectedCoords({ lat, lng });

    const addr = result.address || {};
    const mainTitle = result.name || addr.road || searchQuery;
    const areaName = addr.suburb || addr.neighbourhood || addr.road || addr.village || addr.town || 'Area';
    const cityName = addr.city || addr.town || addr.county || addr.state_district || 'City';
    const stateName = addr.state || '';
    const pincode = addr.postcode || '';

    setAddressDetails({
      title: mainTitle,
      flat: searchQuery.toUpperCase().includes('HOSTEL') ? `${searchQuery} (Main Wing)` : mainTitle,
      area: areaName,
      city: `${cityName}${stateName ? ', ' + stateName : ''}`,
      pincode,
    });

    setSearchQuery('');
    setSearchResults([]);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });
      markerRef.current.setLatLng([lat, lng]);
    }
  };

  // Live GPS detection with reverse geocoding
  const handleGpsDetect = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setSelectedCoords({ lat, lng });

          await reverseGeocode(lat, lng);
          setDetectingGps(false);

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
            markerRef.current.setLatLng([lat, lng]);
          }
        },
        () => {
          // Default fallback (Hyderabad / VNR area)
          setDetectingGps(false);
          const fallbackLat = 17.5389;
          const fallbackLng = 78.3852;
          setSelectedCoords({ lat: fallbackLat, lng: fallbackLng });
          reverseGeocode(fallbackLat, fallbackLng);
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo([fallbackLat, fallbackLng], 16, { duration: 1.2 });
            markerRef.current.setLatLng([fallbackLat, fallbackLng]);
          }
        },
        { timeout: 8000 }
      );
    } else {
      setDetectingGps(false);
    }
  };

  // Confirm and set active delivery address
  const handleConfirmLocation = () => {
    const newAddr: DeliveryAddress = {
      id: 'addr-' + Date.now(),
      type: newType,
      name: addressDetails.title || 'Selected Location',
      flat: newFlat || addressDetails.flat || 'Doorstep / Main Gate',
      area: addressDetails.area || 'Locality',
      city: addressDetails.city || 'City',
      pincode: addressDetails.pincode || '500090',
      phone: activeAddress?.phone || '+91 92814 32397',
      isDefault: true,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
    };

    addAddress(newAddr);
    setActiveAddress(newAddr);
    setIsLocationModalOpen(false);
  };

  const POPULAR_CITIES = [
    { name: 'VNRVJIET / Bachupally, Hyderabad', lat: 17.5389, lng: 78.3852 },
    { name: 'HSR Layout, Bengaluru', lat: 12.9121, lng: 77.6446 },
    { name: 'Koramangala, Bengaluru', lat: 12.9352, lng: 77.6245 },
    { name: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295 },
    { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Choose Delivery Location</span>
              <span className="px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">
                Worldwide Map
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag pin on the map or search any hostel, street or city worldwide
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Search bar & Live Suggestions */}
          <div className="relative z-20">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hostel, college, street, area anywhere in the world..."
                className="w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all shadow-sm"
              />
              {isSearching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 animate-spin" />
              )}
            </div>

            {/* Dropdown Suggestions */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 z-30">
                {searchResults.map((item) => (
                  <button
                    key={item.place_id}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full p-3 text-left hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-start gap-2.5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {item.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive World Leaflet Map Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-800">
            <div
              ref={mapContainerRef}
              className="w-full h-56 sm:h-64 z-10"
              style={{ minHeight: '220px' }}
            />

            {/* Float GPS Auto-Detect Button */}
            <button
              onClick={handleGpsDetect}
              disabled={detectingGps}
              className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-black text-orange-600 dark:text-orange-400 hover:scale-105 active:scale-95 transition-all"
            >
              <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
              <span>{detectingGps ? 'Locating...' : 'Locate Me (GPS)'}</span>
            </button>

            {/* Map Instruction Pill */}
            <div className="absolute bottom-2 left-2 right-2 z-20 text-center pointer-events-none">
              <span className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold shadow">
                💡 Tap anywhere or drag marker to pinpoint exact location
              </span>
            </div>
          </div>

          {/* Location Details Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-black tracking-wider text-orange-600 dark:text-orange-400 block">
                  Delivering to
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {addressDetails.title || 'Selected Location'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {addressDetails.area}, {addressDetails.city} {addressDetails.pincode && `- ${addressDetails.pincode}`}
                </p>
              </div>
            </div>

            {/* Address Type and Flat inputs */}
            <div className="pt-2 border-t border-orange-200/60 dark:border-orange-900/40 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newFlat}
                onChange={(e) => setNewFlat(e.target.value)}
                placeholder="Flat / Room / Hostel Wing (e.g. Room 304, Block B)"
                className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:border-orange-500 focus:outline-none"
              />
              <div className="flex gap-1.5">
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewType(t)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      newType === t
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick City Presets */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Popular Locations
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    setSelectedCoords({ lat: city.lat, lng: city.lng });
                    reverseGeocode(city.lat, city.lng);
                    if (mapInstanceRef.current && markerRef.current) {
                      mapInstanceRef.current.flyTo([city.lat, city.lng], 16, { duration: 1.2 });
                      markerRef.current.setLatLng([city.lat, city.lng]);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Addresses Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Saved Address Book ({addresses.length})
              </span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {addresses.map((addr) => {
                const isSelected = activeAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setActiveAddress(addr);
                      setIsLocationModalOpen(false);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                        {addr.type === 'Home' ? (
                          <Home className="w-3.5 h-3.5" />
                        ) : addr.type === 'Work' ? (
                          <Briefcase className="w-3.5 h-3.5" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {addr.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {addr.flat}, {addr.area}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmLocation}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirm & Deliver to This Location</span>
          </button>

        </div>

      </div>
    </div>
  );
};
