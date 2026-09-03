import { Star, Zap, Percent, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface FilterState {
  rating4Plus: boolean;
  fastDelivery: boolean;
  hasOffers: boolean;
  sortBy: 'default' | 'rating' | 'time' | 'costAsc' | 'costDesc';
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, totalMatches }) => {
  const { vegOnlyFilter, setVegOnlyFilter } = useApp();

  return (
    <div className="py-2.5 flex flex-wrap items-center justify-between gap-2 border-y border-slate-100 dark:border-slate-800/80 my-2">
      {/* Left chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        
        {/* Veg Toggle */}
        <button
          onClick={() => setVegOnlyFilter((v: boolean) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            vegOnlyFilter
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ring-2 ring-emerald-500 ${
              vegOnlyFilter ? 'bg-emerald-500' : 'bg-transparent'
            }`}
          />
          Pure Veg
        </button>

        {/* Rating 4.0+ */}
        <button
          onClick={() => setFilters((f) => ({ ...f, rating4Plus: !f.rating4Plus }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            filters.rating4Plus
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Ratings 4.0+
        </button>

        {/* Fast Delivery (<25 mins) */}
        <button
          onClick={() => setFilters((f) => ({ ...f, fastDelivery: !f.fastDelivery }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            filters.fastDelivery
              ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          Fast (&lt; 25 mins)
        </button>

        {/* Great Offers */}
        <button
          onClick={() => setFilters((f) => ({ ...f, hasOffers: !f.hasOffers }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            filters.hasOffers
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Percent className="w-3.5 h-3.5 text-rose-500" />
          Offers & Deals
        </button>
      </div>

      {/* Right Sort dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 hidden sm:inline">
          {totalMatches} {totalMatches === 1 ? 'place' : 'places'} found
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <ArrowUpDown className="w-3 h-3 text-slate-400" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="default" className="bg-white dark:bg-slate-900">Recommended</option>
            <option value="rating" className="bg-white dark:bg-slate-900">Highest Rating</option>
            <option value="time" className="bg-white dark:bg-slate-900">Fastest Delivery</option>
            <option value="costAsc" className="bg-white dark:bg-slate-900">Cost: Low to High</option>
            <option value="costDesc" className="bg-white dark:bg-slate-900">Cost: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};
