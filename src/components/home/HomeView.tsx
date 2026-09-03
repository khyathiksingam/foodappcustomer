import React, { useState, useMemo } from 'react';
import { HeroBanners } from './HeroBanners';
import { CategoryList } from './CategoryList';
import { FilterBar } from './FilterBar';
import type { FilterState } from './FilterBar';
import { RestaurantCard } from './RestaurantCard';
import { useApp } from '../../context/AppContext';
import { Sparkles, UtensilsCrossed, Award, Navigation } from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    restaurants,
    selectedCategory,
    vegOnlyFilter,
    searchQuery,
  } = useApp();

  const [filters, setFilters] = useState<FilterState>({
    rating4Plus: false,
    fastDelivery: false,
    hasOffers: false,
    sortBy: 'default',
  });

  // Filter & Sort logic
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // Veg filter
      if (vegOnlyFilter && !r.isVegOnly) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          r.cuisines.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase())) ||
          r.menu.some((d) =>
            d.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            d.cuisine.toLowerCase().includes(selectedCategory.toLowerCase())
          );
        if (!matchesCategory) return false;
      }

      // Quick filters
      if (filters.rating4Plus && r.rating < 4.0) return false;
      if (filters.fastDelivery && r.deliveryTimeMins > 25) return false;
      if (filters.hasOffers && !r.hasOffers) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCuisine = r.cuisines.some((c) => c.toLowerCase().includes(q));
        const matchesDish = r.menu.some((d) => d.name.toLowerCase().includes(q));
        if (!matchesName && !matchesCuisine && !matchesDish) return false;
      }

      return true;
    });
  }, [restaurants, vegOnlyFilter, selectedCategory, filters, searchQuery]);

  const sortedRestaurants = useMemo(() => {
    const list = [...filteredRestaurants];
    if (filters.sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (filters.sortBy === 'time') {
      return list.sort((a, b) => a.deliveryTimeMins - b.deliveryTimeMins);
    }
    if (filters.sortBy === 'costAsc') {
      return list.sort((a, b) => a.costForTwo - b.costForTwo);
    }
    if (filters.sortBy === 'costDesc') {
      return list.sort((a, b) => b.costForTwo - a.costForTwo);
    }
    return list;
  }, [filteredRestaurants, filters.sortBy]);

  // Sections
  const nearbyRestaurants = useMemo(() => {
    return [...sortedRestaurants].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [sortedRestaurants]);

  const topRated = useMemo(() => {
    return [...sortedRestaurants].filter((r) => r.rating >= 4.6);
  }, [sortedRestaurants]);

  return (
    <div className="space-y-6 pb-16 sm:pb-8">
      {/* Promotional Banners */}
      <HeroBanners />

      {/* Food Categories Horizontal Scroll */}
      <CategoryList />

      {/* Filter and sorting toolbar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalMatches={sortedRestaurants.length}
      />

      {/* If Search Query is active, show flat list */}
      {searchQuery.trim() || selectedCategory !== 'all' ? (
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-orange-500" />
              <span>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : `Restaurants serving ${selectedCategory.toUpperCase()}`}
              </span>
            </h2>
          </div>

          {sortedRestaurants.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-500 mx-auto mb-3">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching restaurants found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try clearing your filters, switching off Pure Veg, or searching for another dish.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Section 1: Nearby Restaurants */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-cyan-500" />
                  <span>Nearby Restaurants</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Speedy delivery from kitchen to your doorstep
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {nearbyRestaurants.slice(0, 4).map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>

          {/* Section 2: Top Rated Restaurants */}
          {topRated.length > 0 && (
            <section className="pt-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Top Rated Delights (4.6★+)</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Highest rated culinary craft loved by verified foodies
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {topRated.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: All Discoveries */}
          <section className="pt-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <span>Popular & Trending Today</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Best restaurants offering curated feasts & signature dishes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
