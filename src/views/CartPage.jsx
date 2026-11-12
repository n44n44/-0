import React, { useState } from 'react';
import {
  ArrowRight,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Truck,
  Headphones,
  Lock,
} from 'lucide-react';

export default function CartPage({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Subtotal calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal > 0 ? 2000 : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'GHAYM20') {
      setCouponApplied(true);
      setDiscountPercent(20);
    } else if (couponCode.trim()) {
      setCouponApplied(true);
      setDiscountPercent(10);
    }
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 flex-1" dir="rtl">
      {/* Breadcrumb & Header Action */}
      <div className="flex items-center justify-between mb-6 pb-2">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('products')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/60 shadow-sm text-on-surface hover:bg-surface-container-high transition-all text-body-md font-body-md cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 text-[#07132B]" />
          <span className="font-semibold text-label-md">رجوع</span>
        </button>

        <div className="flex items-center gap-2.5">
          <h1 className="text-headline-xl font-headline-xl text-on-background tracking-tight font-extrabold">
            سلة التسوق
          </h1>
          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center text-3xl">
            🛒
          </div>
          <h2 className="text-xl font-bold text-[#07132B]">سلة التسوق فارغة حالياً</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            استكشفي أشهى المخبوزات والحلويات والهدايا المصنوعة يدويًا في غيم سبيس
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="px-6 py-3 bg-gradient-to-r from-[#07132B] to-[#122245] hover:brightness-110 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
          >
            تصفح جميع المنتجات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Cart Items Column (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => {
              const qty = item.quantity || 1;
              return (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/50 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3 sm:gap-6"
                >
                  {/* Delete Action */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                    className="p-2 text-outline hover:text-red-500 hover:bg-red-50 rounded-full transition-colors self-center cursor-pointer"
                    title="حذف العنصر"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </button>

                  {/* Counter Pill Controls */}
                  <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 gap-2.5 border border-outline-variant/40">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, qty + 1)}
                      className="w-7 h-7 rounded-full bg-white text-on-surface flex items-center justify-center text-lg font-bold shadow-xs hover:bg-primary-container hover:text-white transition-colors leading-none cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-body-md font-body-md font-bold min-w-[14px] text-center text-on-surface">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, qty - 1)}
                      className="w-7 h-7 rounded-full bg-white text-on-surface flex items-center justify-center text-lg font-bold shadow-xs hover:bg-primary-container hover:text-white transition-colors leading-none cursor-pointer"
                    >
                      -
                    </button>
                  </div>

                  {/* Product Details & Pricing */}
                  <div className="flex-1 text-right">
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
                      {item.name}
                    </h3>
                    {item.storeName && (
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.storeName}</p>
                    )}
                    <p className="text-[#07132B] font-headline-md mt-1 font-extrabold text-sm sm:text-base">
                      {Number(item.price).toLocaleString()}{' '}
                      <span className="text-xs font-bold text-sky-600">ر.ي</span>
                    </p>
                  </div>

                  {/* Product Image Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30 shadow-inner">
                    <img
                      className="w-full h-full object-cover"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                </div>
              );
            })}

            {/* Trust Badges Under Cart List */}
            <div className="mt-4 p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 flex flex-wrap items-center justify-around gap-4 text-outline text-body-sm font-body-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>دفع آمن ومحمي 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>توصيل سريع لكافة المناطق</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-blue-600" />
                <span>دعم فني متواصل 24/7</span>
              </div>
            </div>
          </div>

          {/* Order Summary Card (4 cols on lg) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/60 shadow-lg shadow-primary/5">
              <h2 className="text-headline-md font-headline-md text-on-surface font-bold mb-4 pb-3 border-b border-outline-variant/30 flex items-center justify-between">
                <span>ملخص الطلب</span>
                <span className="text-label-sm font-label-sm text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full font-bold">
                  {cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)} عناصر
                </span>
              </h2>

              {/* Price Calculations */}
              <div className="space-y-3.5 mb-6 text-body-md font-body-md">
                <div className="flex justify-between items-center text-on-surface">
                  <span className="text-outline">المجموع الفرعي</span>
                  <span className="font-bold text-headline-md text-[#07132B]">
                    {subtotal.toLocaleString()}{' '}
                    <span className="text-body-sm font-body-sm font-bold text-sky-600">ر.ي</span>
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>خصم الكوبون ({discountPercent}%)</span>
                    <span className="font-bold">
                      -{discountAmount.toLocaleString()} <span className="text-xs">ر.ي</span>
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-on-surface">
                  <span className="text-outline">الشحن والتوصيل (المكلا)</span>
                  <span className="font-bold text-headline-md text-[#07132B]">
                    {shippingFee.toLocaleString()}{' '}
                    <span className="text-body-sm font-body-sm font-bold text-sky-600">ر.ي</span>
                  </span>
                </div>

                <div className="pt-3 border-t border-dashed border-outline-variant/50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-headline-md font-headline-md text-on-background font-bold">
                      الإجمالي الكلي
                    </span>
                    <span className="text-label-sm font-label-sm text-outline">
                      شامل التوصيل ورسوم الخدمة
                    </span>
                  </div>
                  <span className="text-headline-xl font-headline-xl text-[#07132B] font-black text-xl sm:text-2xl">
                    {grandTotal.toLocaleString()}{' '}
                    <span className="text-sm font-bold text-sky-600">
                      ر.ي
                    </span>
                  </span>
                </div>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('checkout')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#07132B] hover:bg-[#122245] text-white font-headline-md text-headline-md font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>متابعة الشراء وإتمام الطلب</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('products')}
                  className="w-full py-3 px-4 rounded-xl bg-transparent hover:bg-surface-container-low text-primary border border-primary-container/40 font-label-lg text-label-lg transition-colors text-center block cursor-pointer"
                >
                  متابعة التسوق
                </button>
              </div>

              {/* Coupon Code Prompt */}
              <form onSubmit={handleApplyCoupon} className="mt-6 pt-4 border-t border-outline-variant/30">
                <label className="block text-label-md font-label-md text-outline mb-2">
                  هل لديك كود خصم؟
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-surface-container-low rounded-xl px-3 py-2 text-body-sm font-body-sm border border-outline-variant/50 focus:outline-none focus:ring-1 focus:ring-primary uppercase text-center"
                    placeholder="كود الخصم (GHAYM20)"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-surface-container-high hover:bg-primary-container hover:text-white rounded-xl text-label-md font-label-md transition-colors font-bold text-on-surface cursor-pointer"
                  >
                    تطبيق
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1.5 text-center">
                    تم تطبيق كود الخصم بنجاح! 🎉
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
