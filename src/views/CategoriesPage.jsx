import React from 'react';
import { Layers, Store, ArrowLeft, Sparkles, Gift, Palette, Shirt, UtensilsCrossed, Cookie, Flame } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/mockData';

export default function CategoriesPage({ onNavigate, onSelectCategory }) {
  const getCatIcon = (id) => {
    switch (id) {
      case 'decor':
        return <Gift className="w-8 h-8 text-[#54B9F2]" />;
      case 'pottery':
        return <Palette className="w-8 h-8 text-[#54B9F2]" />;
      case 'fashion':
        return <Shirt className="w-8 h-8 text-[#54B9F2]" />;
      case 'kitchen':
        return <UtensilsCrossed className="w-8 h-8 text-[#54B9F2]" />;
      case 'incense':
        return <Flame className="w-8 h-8 text-[#54B9F2]" />;
      case 'sweets':
        return <Cookie className="w-8 h-8 text-[#54B9F2]" />;
      default:
        return <Store className="w-8 h-8 text-[#54B9F2]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-[#172A46] flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#54B9F2]" />
          <span>تصنيفات سوق غيم سبيس</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          تصفح الأقسام المتخصصة للمنتجات والمتاجر في حضرموت واليمن
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate('products')}
            className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-slate-200 hover:border-[#54B9F2] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#172A46] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                {getCatIcon(cat.id)}
              </div>

              <div>
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-extrabold text-xs sm:text-base text-[#172A46] group-hover:text-[#54B9F2] transition line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 bg-slate-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-slate-100 shrink-0">
                    {cat.count}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="pt-2 sm:pt-4 mt-2 sm:mt-0 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#54B9F2]">
              <span>تصفح القسم</span>
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

