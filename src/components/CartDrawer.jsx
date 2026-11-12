import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const deliveryFee = cartItems.length > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Trigger confetti if available
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 1200);
  };

  const handleFinish = () => {
    setOrderComplete(false);
    onClearCart && onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white text-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#081226] text-white flex items-center justify-between border-b border-sky-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-extrabold">سلة المشتريات</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                {cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} عناصر
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orderComplete ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">تم تأكيد طلبك بنجاح!</h3>
                <p className="text-sm text-slate-600">
                  تم إرسال طلبك إلى المتاجر، وسيصلك إشعار عند بدء التوصيل من خلال مندوب غيم سبيس.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 text-right space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">رقم الطلب:</span>
                    <span className="font-bold font-mono">#GS-1049</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">طريقة الدفع:</span>
                    <span className="font-bold">الدفع عند الاستلام</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">الموقع:</span>
                    <span className="font-bold">المكلا - حي الورد</span>
                  </div>
                </div>
                <button
                  onClick={handleFinish}
                  className="w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition"
                >
                  متابعة التسوق
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">سلتك فارغة حالياً</h3>
                <p className="text-xs text-slate-500">تصفح المنتجات وأضف ما يعجبك لدعم الحرفيين والأسر المنتجة.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition"
                >
                  استكشف المنتجات
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl border border-slate-200 hover:border-sky-300 transition bg-slate-50/50"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                          <span className="text-[11px] text-slate-500">{item.storeName}</span>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-black text-sky-700">
                          {(item.price * (item.quantity || 1)).toLocaleString()} ر.ي
                        </span>

                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer calculation */}
          {!orderComplete && cartItems.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-800">{subtotal.toLocaleString()} ر.ي</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل (المكلا):</span>
                  <span className="font-bold text-slate-800">{deliveryFee.toLocaleString()} ر.ي</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-sky-600 text-base">{total.toLocaleString()} ر.ي</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>جارٍ تأكيد الطلب...</span>
                ) : (
                  <>
                    <span>إتمام الطلب الآن</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>دفع آمن عند الاستلام وضمان استرجاع</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

