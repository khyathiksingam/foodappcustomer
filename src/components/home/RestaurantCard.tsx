import React from 'react';
import { Star, Clock, MapPin, Heart, Flame } from 'lucide-react';
import type { Restaurant } from '../../types';
import { useApp } from '../../context/AppContext';

export const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
  const { setSelectedRestaurant, favorites, toggleFavoriteRestaurant } = useApp();

  const isFav = favorites.restaurantIds.includes(restaurant.id);

  return (
    <div
      onClick={() => setSelectedRestaurant(restaurant)}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 hover:border-orange-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Card Image Banner */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Veg Only Tag */}
        {restaurant.isVegOnly && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            100% Pure Veg
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md ${
            isFav
              ? 'bg-rose-500 text-white'
              : 'bg-black/30 text-white hover:bg-black/50'
          }`}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Discount Badge on Image */}
        {restaurant.discountBadge && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-black uppercase tracking-wide flex items-center gap-1 shadow-md">
            <Flame className="w-3.5 h-3.5" />
            <span>{restaurant.discountBadge}</span>
          </div>
        )}

        {/* Delivery Time Pill */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>{restaurant.deliveryTimeMins} mins</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-extrabold shrink-0 shadow-sm">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium">
            {restaurant.cuisines.join(' • ')}
          </p>
        </div>

        {/* Card Footer Details */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            <span className="truncate">{restaurant.distanceKm} km away</span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            ₹{restaurant.costForTwo} for two
          </span>
        </div>
      </div>
    </div>
  );
};
