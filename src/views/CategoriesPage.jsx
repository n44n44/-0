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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate('products')}
            className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#54B9F2] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#172A46] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {getCatIcon(cat.id)}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#172A46] group-hover:text-[#54B9F2] transition">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    {cat.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#54B9F2]">
              <span>تصفح المنتجات في هذا القسم</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

