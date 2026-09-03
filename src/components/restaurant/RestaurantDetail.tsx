import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Heart,
  Tag,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DishCard } from './DishCard';

export const RestaurantDetail: React.FC = () => {
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    favorites,
    toggleFavoriteRestaurant,
    applyCoupon,
    setIsCartOpen,
  } = useApp();

  const [dishSearch, setDishSearch] = useState('');
  const [vegOnlyMenu, setVegOnlyMenu] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');

  // Extract unique categories from this restaurant's menu
  const menuCategories = useMemo(() => {
    if (!selectedRestaurant) return ['all'];
    const cats = Array.from(new Set(selectedRestaurant.menu.map((d) => d.category)));
    return ['all', ...cats];
  }, [selectedRestaurant]);

  // Filter menu items
  const filteredDishes = useMemo(() => {
    if (!selectedRestaurant) return [];
    return selectedRestaurant.menu.filter((dish) => {
      if (vegOnlyMenu && !dish.isVeg) return false;
      if (activeCategoryTab !== 'all' && dish.category !== activeCategoryTab) return false;
      if (dishSearch.trim()) {
        const q = dishSearch.toLowerCase();
        return (
          dish.name.toLowerCase().includes(q) ||
          dish.description.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedRestaurant, vegOnlyMenu, activeCategoryTab, dishSearch]);

  // Group dishes by category for structured display
  const groupedDishes = useMemo(() => {
    const groups: Record<string, typeof filteredDishes> = {};
    for (const dish of filteredDishes) {
      if (!groups[dish.category]) groups[dish.category] = [];
      groups[dish.category].push(dish);
    }
    return groups;
  }, [filteredDishes]);

  if (!selectedRestaurant) return null;

  const isFav = favorites.restaurantIds.includes(selectedRestaurant.id);

  return (
    <div className="pb-24 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top back button bar */}
      <div className="py-3 flex items-center justify-between">
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 font-bold text-xs shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavoriteRestaurant(selectedRestaurant.id)}
            className={`w-9 h-9 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors ${
              isFav ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border-rose-200' : 'bg-white dark:bg-slate-900 text-slate-500'
            }`}
            title="Save restaurant"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Restaurant link copied to clipboard!');
              }
            }}
            className="w-9 h-9 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Restaurant Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md mb-6">
        <div className="relative h-56 sm:h-72">
          <img
            src={selectedRestaurant.bannerImage || selectedRestaurant.image}
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Details on banner */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {selectedRestaurant.isVegOnly && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 font-extrabold text-[10px] uppercase tracking-wider">
                  Pure Veg
                </span>
              )}
              {selectedRestaurant.discountBadge && (
                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 font-extrabold text-[10px] uppercase tracking-wider">
                  {selectedRestaurant.discountBadge}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black drop-shadow-sm">
              {selectedRestaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-medium mt-1">
              {selectedRestaurant.tagline}
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              {selectedRestaurant.cuisines.join(', ')}
            </p>
          </div>
        </div>

        {/* Stat badges strip */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                <Star className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  {selectedRestaurant.rating} / 5
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {selectedRestaurant.totalRatings} ratings
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  {selectedRestaurant.deliveryTimeMins} mins
                </span>
                <span className="text-[10px] text-slate-400 block">Delivery Time</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  {selectedRestaurant.distanceKm} km
                </span>
                <span className="text-[10px] text-slate-400 block">Distance</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">FSSAI Certified Safe & Hygienic Kitchen</span>
          </div>
        </div>

        {/* Promo Code Strip inside restaurant */}
        <div className="px-5 py-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Special Offer: Get 50% OFF up to ₹100 using code <strong>CRAVE50</strong>
            </span>
          </div>
          <button
            onClick={() => {
              applyCoupon('CRAVE50');
              setIsCartOpen(true);
            }}
            className="px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] shadow-sm transition-colors shrink-0"
          >
            Apply Code
          </button>
        </div>
      </div>

      {/* Menu Filters and Search Toolbar */}
      <div className="sticky top-20 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* Search inside menu */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              placeholder="Search in this menu..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Veg Only Menu switch */}
          <button
            onClick={() => setVegOnlyMenu(!vegOnlyMenu)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              vegOnlyMenu
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ring-2 ring-emerald-500 ${
                vegOnlyMenu ? 'bg-emerald-500' : 'bg-transparent'
              }`}
            />
            Veg Only
          </button>
        </div>

        {/* Categories Tab Jump Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryTab(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategoryTab === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'Full Menu' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Categorized Dishes Section */}
      {Object.keys(groupedDishes).length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            No dishes match your search or filter.
          </p>
          <button
            onClick={() => {
              setDishSearch('');
              setVegOnlyMenu(false);
              setActiveCategoryTab('all');
            }}
            className="mt-3 px-4 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedDishes).map(([categoryName, dishes]) => (
            <div
              key={categoryName}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {categoryName} ({dishes.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {dishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
