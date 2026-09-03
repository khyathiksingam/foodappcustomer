import React, { useState } from 'react';
import { Sparkles, ArrowRight, Tag, Check } from 'lucide-react';
import { HERO_BANNERS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const HeroBanners: React.FC = () => {
  const { applyCoupon, setIsCartOpen } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApplyBannerCoupon = (code: string) => {
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
    setIsCartOpen(true);
  };

  return (
    <div className="py-4">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
        {HERO_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="snap-center shrink-0 w-[300px] sm:w-[420px] md:w-[480px] h-48 sm:h-56 rounded-3xl relative overflow-hidden shadow-lg group select-none"
          >
            {/* Background image with overlay */}
            <img
              src={banner.bgImage}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-90 mix-blend-multiply`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Banner text content */}
            <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between text-white z-10">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {banner.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm">
                  {banner.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-medium mt-1">
                  {banner.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleApplyBannerCoupon(banner.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/25 hover:bg-white/35 backdrop-blur-md text-white text-xs font-bold border border-white/30 transition-all hover:scale-105"
                  title="Click to copy & apply"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Code: {banner.code}</span>
                  {copiedCode === banner.code ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300 ml-1" />
                  ) : null}
                </button>

                <button
                  onClick={() => handleApplyBannerCoupon(banner.code)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-orange-50 active:scale-95 transition-all"
                >
                  <span>Claim Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
