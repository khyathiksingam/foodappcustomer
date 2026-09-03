import React, { useState, useMemo } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { SelectedCustomization, CustomizationOption } from '../../types';

export const CustomizationModal: React.FC = () => {
  const { customizingDish, setCustomizingDish, addToCart, setIsCartOpen } = useApp();

  // Selections state: map group id to array of options
  const [selectedGroups, setSelectedGroups] = useState<Record<string, CustomizationOption[]>>(() => {
    if (!customizingDish?.customizationGroups) return {};
    const init: Record<string, CustomizationOption[]> = {};
    for (const group of customizingDish.customizationGroups) {
      const def = group.options.filter((o) => o.isDefault);
      if (def.length > 0) {
        init[group.id] = def;
      } else if (group.minSelect > 0 && group.options.length > 0) {
        init[group.id] = [group.options[0]];
      } else {
        init[group.id] = [];
      }
    }
    return init;
  });

  const [specialNote, setSpecialNote] = useState('');

  // Calculate live total price
  const totalPrice = useMemo(() => {
    if (!customizingDish) return 0;
    let extra = 0;
    Object.values(selectedGroups).forEach((options) => {
      options.forEach((opt) => {
        extra += opt.price;
      });
    });
    return customizingDish.price + extra;
  }, [customizingDish, selectedGroups]);

  if (!customizingDish) return null;

  const handleSelectRadio = (groupId: string, option: CustomizationOption) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [groupId]: [option],
    }));
  };

  const handleToggleCheckbox = (
    groupId: string,
    option: CustomizationOption,
    maxSelect: number
  ) => {
    setSelectedGroups((prev) => {
      const current = prev[groupId] || [];
      const exists = current.some((o) => o.id === option.id);
      if (exists) {
        return {
          ...prev,
          [groupId]: current.filter((o) => o.id !== option.id),
        };
      } else {
        if (current.length >= maxSelect) {
          return prev; // capped
        }
        return {
          ...prev,
          [groupId]: [...current, option],
        };
      }
    });
  };

  const handleAddToCart = () => {
    if (!customizingDish.customizationGroups) return;

    const formattedCustomizations: SelectedCustomization[] = customizingDish.customizationGroups
      .map((g) => ({
        groupId: g.id,
        groupTitle: g.title,
        selectedOptions: selectedGroups[g.id] || [],
      }))
      .filter((g) => g.selectedOptions.length > 0);

    addToCart(customizingDish, 1, formattedCustomizations, specialNote);
    setCustomizingDish(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Dish Image preview */}
        <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
          <img
            src={customizingDish.image}
            alt={customizingDish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
          <button
            onClick={() => setCustomizingDish(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-lg font-black leading-tight line-clamp-1">
              Customize {customizingDish.name}
            </h3>
            <p className="text-xs text-white/80 font-medium">
              Base Price: ₹{customizingDish.price}
            </p>
          </div>
        </div>

        {/* Customization Options List */}
        <div className="p-5 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-5">
          {customizingDish.customizationGroups?.map((group) => {
            const isSingleSelect = group.maxSelect === 1;
            const currentSelected = selectedGroups[group.id] || [];

            return (
              <div key={group.id} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {group.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isSingleSelect
                      ? 'Select 1'
                      : `Select up to ${group.maxSelect}`}
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  {group.options.map((opt) => {
                    const isChecked = currentSelected.some((o) => o.id === opt.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          if (isSingleSelect) {
                            handleSelectRadio(group.id, opt);
                          } else {
                            handleToggleCheckbox(group.id, opt, group.maxSelect);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isChecked
                            ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-${
                              isSingleSelect ? 'full' : 'lg'
                            } border-2 flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'border-orange-500 bg-orange-500 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {opt.name}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {opt.price === 0 ? 'Free' : `+₹${opt.price}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Cooking Instructions note */}
          <div className="pt-4">
            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2">
              Any special cooking instructions?
            </h4>
            <input
              type="text"
              placeholder="e.g. Less spicy, pack gravy separately..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer with Total Price & Add button */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Total Item Price
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              ₹{totalPrice}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Add to Cart</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
