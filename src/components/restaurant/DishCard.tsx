import React from 'react';
import { Star, Plus, Minus, Flame, Sparkles } from 'lucide-react';
import type { Dish } from '../../types';
import { useApp } from '../../context/AppContext';

export const DishCard: React.FC<{ dish: Dish }> = ({ dish }) => {
  const { cart, addToCart, updateCartItemQuantity, setCustomizingDish } = useApp();

  // Find if this dish is already in cart
  const cartItemsForDish = cart.filter((item) => item.dish.id === dish.id);
  const totalQtyInCart = cartItemsForDish.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddClick = () => {
    if (dish.customizationGroups && dish.customizationGroups.length > 0) {
      setCustomizingDish(dish);
    } else {
      addToCart(dish, 1);
    }
  };

  const handleIncrement = () => {
    if (dish.customizationGroups && dish.customizationGroups.length > 0) {
      setCustomizingDish(dish);
    } else if (cartItemsForDish.length > 0) {
      updateCartItemQuantity(cartItemsForDish[0].id, 1);
    } else {
      addToCart(dish, 1);
    }
  };

  const handleDecrement = () => {
    if (cartItemsForDish.length > 0) {
      updateCartItemQuantity(cartItemsForDish[cartItemsForDish.length - 1].id, -1);
    }
  };

  return (
    <div className="py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-start justify-between gap-4 group">
      {/* Dish details on left */}
      <div className="flex-1 min-w-0">
        
        {/* Veg / Non-Veg Indicator & Badges */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {dish.isVeg ? (
            <div
              className="w-4 h-4 rounded-sm border-2 border-emerald-600 flex items-center justify-center p-0.5"
              title="Vegetarian"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
          ) : (
            <div
              className="w-4 h-4 rounded-sm border-2 border-rose-600 flex items-center justify-center p-0.5"
              title="Non-Vegetarian"
            >
              <div className="w-0 h-0 border-x-4 border-x-transparent border-b-[8px] border-b-rose-600" />
            </div>
          )}

          {dish.isBestseller && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Bestseller
            </span>
          )}

          {dish.isMustTry && (
            <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" />
              Must Try
            </span>
          )}

          {dish.isSpicy && (
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
              🌶️ Spicy
            </span>
          )}
        </div>

        {/* Dish Title */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {dish.name}
        </h4>

        {/* Price & Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹{dish.price}
          </span>
          {dish.originalPrice && dish.originalPrice > dish.price && (
            <span className="text-xs text-slate-400 line-through">
              ₹{dish.originalPrice}
            </span>
          )}
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{dish.rating}</span>
            <span className="text-slate-400 font-normal text-[11px]">
              ({dish.ratingCount})
            </span>
          </div>
        </div>

        {/* Dish Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 pr-2">
          {dish.description}
        </p>

        {dish.customizationGroups && dish.customizationGroups.length > 0 && (
          <span className="inline-block mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Customisable
          </span>
        )}
      </div>

      {/* Dish Photo & ADD Button on right */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Action button */}
        <div className="absolute -bottom-2.5">
          {totalQtyInCart > 0 ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border-2 border-orange-500 shadow-lg text-orange-600 dark:text-orange-400 text-xs font-black">
              <button
                onClick={handleDecrement}
                className="w-5 h-5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 flex items-center justify-center transition-colors"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-4 text-center text-sm font-black text-slate-900 dark:text-white">
                {totalQtyInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="w-5 h-5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 flex items-center justify-center transition-colors"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="px-6 py-1.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-1"
            >
              <span>ADD</span>
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
