import React from 'react';
import { X, Star, MapPin, CheckCircle, Package, Phone, Share2, Heart } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';

export default function StoreModal({ store, onClose, onAddToCart }) {
  if (!store) return null;

  const storeProducts = PRODUCTS.filter((p) => p.storeName === store.name || store.id === 'store-1');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div onClick={onClose} className="fixed inset-0 transition-opacity bg-slate-950/70 backdrop-blur-sm"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-100">
          {/* Cover & Header */}
          <div className="relative h-44 bg-slate-900 overflow-hidden">
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 right-6 flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-xl border-2 border-white overflow-hidden shrink-0">
                <img
                  src={store.avatar || store.image}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="text-white pb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black">{store.name}</h3>
                  {store.verified && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-sky-400" />
                      <span>موثق</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">{store.tagline}</p>
              </div>
            </div>
          </div>

          {/* Quick Info bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{store.rating}</span>
                <span className="text-slate-400">({store.reviewsCount || 89} تقييم)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{store.city}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Package className="w-3.5 h-3.5 text-purple-600" />
                <span>{store.productsCount} منتج</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-sky-600 font-bold flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>

          {/* Products List */}
          <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            <h4 className="text-sm font-extrabold text-slate-900">منتجات المتجر المميزة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(storeProducts.length > 0 ? storeProducts : PRODUCTS.slice(0, 4)).map((prod) => (
                <div
                  key={prod.id}
                  className="flex gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 transition bg-white"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h5>
                      <span className="text-[11px] font-black text-sky-600">
                        {prod.price.toLocaleString()} ر.ي
                      </span>
                    </div>
                    <button
                      onClick={() => onAddToCart && onAddToCart(prod)}
                      className="text-[11px] font-bold py-1 px-2.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition w-fit"
                    >
                      أضف للسلة +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer action */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition"
            >
              إغلاق
            </button>
            <button
              onClick={() => {
                alert(`تم إرسال رسالة تواصل إلى ${store.name}`);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold hover:from-sky-600 hover:to-blue-700 transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>تواصل مع المتجر عبر واتساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

