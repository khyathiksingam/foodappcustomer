import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const CategoryList: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setSelectedRestaurant } = useApp();

  const handleSelect = (id: string) => {
    setSelectedCategory(id);
    setSelectedRestaurant(null);
  };

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            What are you craving today?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore freshly prepared dishes by culinary mood
          </p>
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-transparent shadow-orange-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
