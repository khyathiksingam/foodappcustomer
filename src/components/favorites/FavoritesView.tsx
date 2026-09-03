import React, { useState } from 'react';
import { X, Heart, UtensilsCrossed, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RestaurantCard } from '../home/RestaurantCard';

export const FavoritesView: React.FC = () => {
  const {
    isFavoritesOpen,
    setIsFavoritesOpen,
    favorites,
    restaurants,
    addToCart,
    setIsCartOpen,
  } = useApp();

  const [favTab, setFavTab] = useState<'restaurants' | 'dishes'>('restaurants');

  if (!isFavoritesOpen) return null;

  const favoriteRestaurants = restaurants.filter((r) =>
    favorites.restaurantIds.includes(r.id)
  );

  const favoriteDishes = restaurants.flatMap((r) => r.menu).filter((d) =>
    favorites.dishIds.includes(d.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Saved Favorites
              </h3>
              <p className="text-xs text-slate-400">
                Quick access to beloved dining spots & cravings
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFavoritesOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-2">
          <button
            onClick={() => setFavTab('restaurants')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              favTab === 'restaurants'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Favorite Restaurants ({favoriteRestaurants.length})
          </button>
          <button
            onClick={() => setFavTab('dishes')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              favTab === 'dishes'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Favorite Dishes ({favoriteDishes.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {favTab === 'restaurants' ? (
            favoriteRestaurants.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No saved restaurants yet
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Tap the heart icon on any restaurant card to save it for later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteRestaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )
          ) : favoriteDishes.length === 0 ? (
            <div className="text-center py-16">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No bookmarked dishes yet
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Explore menus and bookmark your favorite dishes!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {dish.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">₹{dish.price} • {dish.cuisine}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(dish, 1);
                      setIsFavoritesOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow transition-colors"
                  >
                    <span>Order</span>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
