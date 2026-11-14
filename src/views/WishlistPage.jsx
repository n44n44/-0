import React from 'react';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Store,
  Star,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export default function WishlistPage({ onNavigate, onAddToCart, onSelectProduct }) {
  const { wishlistProducts, toggleFavorite, isFavorite } = usePlatform();

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-fadeIn" dir="rtl">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs flex items-center justify-center transition-all cursor-pointer"
            title="العودة للمنتجات"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-xs">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">قائمة المفضلة</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  {wishlistProducts.length} منتجات
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                منتجاتك المفضلة المحفوظة للشراء لاحقاً في منصة غيم سبيس
              </p>
            </div>
          </div>
        </div>

        {wishlistProducts.length > 0 && (
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0066FF] border border-sky-100 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0066FF]" />
            <span>متابعة التسوق وتصفح المزيد</span>
          </button>
        )}
      </div>

      {/* Main Content: Grid or Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center space-y-4 border border-slate-100 shadow-sm max-w-xl mx-auto my-12">
          <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 text-rose-400 mx-auto flex items-center justify-center shadow-inner">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-800">قائمة المفضلة فارغة حالياً</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              لم تقم بإضافة أي منتج إلى المفضلة بعد. استكشف إبداعات الأسر المنتجة والمتاجر المحلية في حضرموت وأضف منتجاتك المفضلة بنقرة واحدة!
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('products')}
              className="py-3 px-8 rounded-2xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تصفح أحدث المنتجات الآن</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                if (onSelectProduct) onSelectProduct(prod);
                else if (onNavigate) onNavigate('product-details');
              }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-3.5 flex flex-col group cursor-pointer relative"
            >
              {/* Product Image Area with Soft Background */}
              <div className="w-full aspect-square bg-[#F8FAFC] rounded-2xl overflow-hidden relative mb-3 flex items-center justify-center border border-slate-100/80">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Remove from Wishlist Button */}
                <button
                  type="button"
                  aria-label="إزالة من المفضلة"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(prod);
                  }}
                  className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-rose-500 hover:text-rose-600 shadow-sm flex items-center justify-center transition-transform active:scale-90 z-10"
                  title="إزالة من المفضلة"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>

                {/* Category or Store Badge */}
                {prod.category && (
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-bold text-slate-700 shadow-xs border border-slate-100">
                    {prod.category}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between text-right">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#0066FF] transition-colors">
                    {prod.name}
                  </h3>
                  
                  {prod.storeName && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Store className="w-3 h-3 text-sky-500" />
                      <span>{prod.storeName}</span>
                    </div>
                  )}
                </div>

                {/* Price and Rating Row */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-[#0066FF]">
                      {Number(prod.price).toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">ر.ي</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{prod.rating || 4.9}</span>
                  </div>
                </div>

                {/* Actions: Add to Cart */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(prod);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>أضف للسلة</span>
                  </button>

                  <button
                    type="button"
                    aria-label="حذف من المفضلة"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prod);
                    }}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
