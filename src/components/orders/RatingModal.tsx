import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RESTAURANT_TAGS = [
  'Delicious Food',
  'Hot & Fresh',
  'Neat Packaging',
  'Generous Portions',
  'Authentic Taste',
];

const PARTNER_TAGS = [
  'Super Fast Delivery',
  'Polite & Friendly',
  'Handled with Care',
  'Followed Instructions',
];

export const RatingModal: React.FC = () => {
  const { isRatingModalOpen, setIsRatingModalOpen, orderToRate, rateOrder } = useApp();

  const [restaurantRating, setRestaurantRating] = useState(5);
  const [partnerRating, setPartnerRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Delicious Food', 'Super Fast Delivery']);
  const [feedbackText, setFeedbackText] = useState('');

  if (!isRatingModalOpen || !orderToRate) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commentCombined = `${selectedTags.join(', ')} - ${feedbackText}`.trim();
    rateOrder(orderToRate.id, restaurantRating, partnerRating, commentCombined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Rate Your Experience
            </h3>
            <p className="text-xs text-slate-400">Order #{orderToRate.id}</p>
          </div>
          <button
            onClick={() => setIsRatingModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 text-xs">
          
          {/* Restaurant Rating */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Food & Packaging Quality
            </span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {orderToRate.restaurantName}
            </h4>

            <div className="flex justify-center gap-2 my-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRestaurantRating(star)}
                  className="p-1 text-2xl hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= restaurantRating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {RESTAURANT_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner Rating */}
          {orderToRate.deliveryPartner && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Delivery Partner
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {orderToRate.deliveryPartner.name}
              </h4>

              <div className="flex justify-center gap-2 my-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPartnerRating(star)}
                    className="p-1 text-2xl hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= partnerRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                {PARTNER_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Additional Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell others what you loved about this food..."
              className="w-full p-3 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-orange-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Review</span>
          </button>
        </form>

      </div>
    </div>
  );
};
