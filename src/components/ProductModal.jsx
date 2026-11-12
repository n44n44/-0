import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, Sparkles, Heart, Share2, Plus, Minus, Store } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart, onOpenStoreModal }) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart({
      ...product,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div onClick={onClose} className="fixed inset-0 transition-opacity bg-slate-950/70 backdrop-blur-sm"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-100">
          {/* Header */}
          <div className="relative p-4 bg-slate-900 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                {product.category || 'صناعات يدوية'}
              </span>
              <span className="text-xs text-slate-300">منصة غيم سبيس</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Image Column */}
            <div className="relative bg-slate-100 h-72 sm:h-auto overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setLiked(!liked)}
                className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg backdrop-blur-md transition ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-slate-700 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>

              {product.badge && (
                <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-sky-300 text-xs font-bold border border-sky-400/30">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details Column */}
            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Store link */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Store className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-bold text-slate-700">{product.storeName}</span>
                  <span className="text-sky-600 font-bold">• موثق</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-800 mr-1">{product.rating || 4.9}</span>
                  </div>
                  <span className="text-xs text-slate-400">({product.reviews || 35} تقييم مشتري)</span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-sky-700">
                    {product.price.toLocaleString()} ر.ي
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {product.originalPrice.toLocaleString()} ر.ي
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {product.description ||
                    'منتج مصنوع بكل حب وإتقان من أيدي حرفيات وأسر منتجة في المكلا، باستخدام أجود المواد الطبيعية التقليدية.'}
                </p>

                {/* Features Pill */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-600">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>توصيل سريع بالمكلا</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ضمان أصالة وجودة 100%</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart button */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">الكمية المطلوبة:</span>
                  <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-2.5 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 hover:text-slate-900 text-slate-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 hover:text-slate-900 text-slate-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>إضافة إلى سلة المشتريات ({(product.price * quantity).toLocaleString()} ر.ي)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

