import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  CreditCard,
  Truck,
  User,
  Phone,
  MapPin,
  DollarSign,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import OtpVerificationModal from '../components/OtpVerificationModal';

export default function CheckoutPage({
  cartItems = [],
  onConfirmOrder,
  onNavigate,
}) {
  const [fullName, setFullName] = useState('سارة عبد العزيز');
  const [phone, setPhone] = useState('770123456');
  const [city, setCity] = useState('المكلا');
  const [district, setDistrict] = useState('حي السلام');
  const [address, setAddress] = useState('بجوار حديقة المكلا - عمارة الأمل، شقة 4');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'jawali' | 'card'
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  // Pricing calculations
  const subtotal = cartItems.length > 0
    ? cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
    : 38000;
  const shippingFee = 2000;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    // Open OTP Verification Modal for authentic security check
    setIsOtpOpen(true);
  };

  const handleOtpVerified = () => {
    setIsOtpOpen(false);
    setIsSubmitting(true);

    const orderData = {
      customerName: fullName,
      phone,
      city,
      district,
      address,
      paymentMethod:
        paymentMethod === 'cash'
          ? 'الدفع عند الاستلام'
          : paymentMethod === 'jawali'
          ? 'محفظة جوالي / إم فلوس'
          : 'حساب بنك الكريمي',
      items: cartItems.length > 0 ? cartItems : [
        {
          id: 'prod-cake',
          name: 'كيكة الفراولة والشوكولاتة الملكية',
          price: 18000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        },
        {
          id: 'prod-oud',
          name: 'بخور عود مكلاوي أصلي',
          price: 12000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
        },
        {
          id: 'prod-khous',
          name: 'حقيبة خوص يمنية مطرزة',
          price: 8000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
        },
      ],
      subtotal,
      shippingFee,
      total: grandTotal,
      status: 'pending',
      date: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 80 });
      }
      if (onConfirmOrder) onConfirmOrder(orderData);
      else if (onNavigate) onNavigate('tracking');
    }, 600);
  };

  return (
    <main className="cloud-canvas flex-1 py-8 px-4 md:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Bar & Back Pill Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('cart')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-outline-variant/60 shadow-sm text-primary hover:bg-surface-container-low transition-all duration-200 font-label-lg active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span>رجوع للسلة</span>
          </button>
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>معاملة مشفرة وآمنة تماماً</span>
          </div>
        </div>

        {/* Checkout Title Header with Step Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-surface-variant">
          <div>
            <h1 className="text-headline-xl font-headline-xl text-on-background flex items-center gap-3 font-extrabold">
              <span>إتمام الطلب والدفع</span>
              <CreditCard className="w-6 h-6 text-blue-600" />
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">
              أكمل تفاصيل التوصيل واختر وسيلة الدفع المفضلة لتأكيد طلبك
            </p>
          </div>

          {/* Checkout Steps Ribbon */}
          <div className="flex items-center gap-2 sm:gap-3 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/40 shadow-sm text-body-sm">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <span className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-label-sm font-label-sm text-primary font-bold">
                ✓
              </span>
              <span className="hidden sm:inline">السلة</span>
            </div>
            <span className="text-outline-variant text-xs">◀</span>
            <div className="flex items-center gap-1.5 text-primary-container font-bold">
              <span className="w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center text-label-sm font-label-sm font-bold">
                2
              </span>
              <span>الشحن والدفع</span>
            </div>
            <span className="text-outline-variant text-xs">◀</span>
            <div className="flex items-center gap-1.5 text-outline">
              <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-label-sm font-label-sm">
                3
              </span>
              <span className="hidden sm:inline">التأكيد والتتبع</span>
            </div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* RIGHT COLUMN: SHIPPING INFORMATION & PAYMENT (Col 7) */}
          <section className="lg:col-span-7 space-y-6">
            {/* Shipping Form Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 space-y-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-surface-container pb-4">
                <h2 className="text-headline-md font-headline-md text-on-surface flex items-center gap-2 font-bold">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>معلومات التوصيل والاستلام</span>
                </h2>
                <span className="text-label-sm font-label-sm text-primary bg-primary-fixed px-3 py-1 rounded-full font-bold">
                  توصيل منزلي سريع
                </span>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-label-lg font-label-lg text-on-surface mb-1.5 font-semibold">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/80 rounded-xl py-3 px-4 text-body-md text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/15 transition-all text-right pr-11"
                      placeholder="أدخل اسم المستلم الثلاثي"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-label-lg font-label-lg text-on-surface mb-1.5 font-semibold">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2" dir="ltr">
                    <div className="px-4 py-3 bg-surface-container border border-outline-variant/80 rounded-xl text-body-md font-bold text-on-surface flex items-center gap-1.5">
                      <span>🇾🇪</span>
                      <span className="font-mono">+967</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant/80 rounded-xl py-3 px-4 text-body-md text-on-surface focus:border-primary-container focus:ring-2 focus:ring-primary-container/15 transition-all text-left"
                        placeholder="7X XXX XXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* City and District */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-lg font-label-lg text-on-surface mb-1.5 font-semibold">
                      المدينة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/80 rounded-xl py-3 px-4 text-body-md text-on-surface"
                      placeholder="المكلا، الشحر، سيئون..."
                    />
                  </div>
                  <div>
                    <label className="block text-label-lg font-label-lg text-on-surface mb-1.5 font-semibold">
                      الحي / المنطقة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/80 rounded-xl py-3 px-4 text-body-md text-on-surface"
                      placeholder="حي السلام، الديس، فوة..."
                    />
                  </div>
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block text-label-lg font-label-lg text-on-surface mb-1.5 font-semibold">
                    العنوان بالتفصيل <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/80 rounded-xl py-2.5 px-4 text-body-md text-on-surface text-right"
                    placeholder="الشارع، اسم العمارة، رقم الشقة أو أقرب معلم مشهور"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 space-y-4 border border-slate-100 shadow-sm">
              <h2 className="text-headline-md font-headline-md text-on-surface flex items-center gap-2 font-bold border-b border-surface-container pb-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span>وسيلة الدفع</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                    paymentMethod === 'cash'
                      ? 'border-primary-container bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">💵</span>
                  <span className="text-xs font-bold text-[#07132B]">الدفع عند الاستلام</span>
                  <span className="text-[10px] text-gray-500">نقدًا لمندوب التوصيل</span>
                </div>

                {/* Jawali / Digital Wallet */}
                <div
                  onClick={() => setPaymentMethod('jawali')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                    paymentMethod === 'jawali'
                      ? 'border-primary-container bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">📱</span>
                  <span className="text-xs font-bold text-[#07132B]">محفظة جوالي / كاش</span>
                  <span className="text-[10px] text-gray-500">تحويل إلكتروني فوري</span>
                </div>

                {/* Card / Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'border-primary-container bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">💳</span>
                  <span className="text-xs font-bold text-[#07132B]">حساب بنكي / بطاقة</span>
                  <span className="text-[10px] text-gray-500">العمقي / بنك الكريمي</span>
                </div>
              </div>
            </div>
          </section>

          {/* LEFT COLUMN: ORDER SUMMARY & CONFIRMATION (Col 5) */}
          <section className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-lg shadow-primary/5 space-y-5">
              <h2 className="text-headline-md font-headline-md text-on-surface font-bold pb-3 border-b border-outline-variant/30 flex items-center justify-between">
                <span>عناصر الطلب</span>
                <span className="text-label-sm text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full font-bold">
                  {cartItems.length > 0 ? cartItems.length : 3} منتجات
                </span>
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {(cartItems.length > 0
                  ? cartItems
                  : [
                      {
                        id: 'c1',
                        name: 'كيكة الفراولة والشوكولاتة الملكية',
                        price: 18000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
                      },
                      {
                        id: 'c2',
                        name: 'بخور عود مكلاوي أصلي',
                        price: 12000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
                      },
                      {
                        id: 'c3',
                        name: 'حقيبة خوص يمنية مطرزة',
                        price: 8000,
                        quantity: 1,
                        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
                      },
                    ]
                ).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 bg-surface-container-low p-2.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-lg object-cover border border-outline-variant/60 shadow-xs"
                        src={item.image}
                        alt={item.name}
                      />
                      <div>
                        <h3 className="font-headline-md text-on-surface text-xs font-bold line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-on-surface-variant">
                          الكمية: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="font-headline-md text-[#07132B] font-extrabold text-sm">
                        {Number(item.price).toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-sky-600 mr-1">ر.ي</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-body-md pt-2 border-t border-slate-100">
                <div className="flex justify-between text-on-surface-variant text-xs">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-[#07132B]">{subtotal.toLocaleString()} ر.ي</span>
                </div>
                <div className="flex justify-between text-on-surface-variant text-xs">
                  <span>الشحن والتوصيل (المكلا)</span>
                  <span className="font-bold text-[#07132B]">{shippingFee.toLocaleString()} ر.ي</span>
                </div>
                <div className="flex justify-between text-on-surface-variant text-[11px] text-gray-400">
                  <span>الرسوم الإدارية</span>
                  <span>مجانية 🤍</span>
                </div>
                <div className="w-full h-px bg-surface-container my-1"></div>
                <div className="flex justify-between items-baseline text-on-surface pt-1">
                  <span className="text-headline-md font-headline-md font-bold text-base">
                    الإجمالي النهائي
                  </span>
                  <div className="text-left">
                    <span className="font-headline-xl text-[#07132B] font-black text-2xl">
                      {grandTotal.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-sky-600 mr-1">
                      ر.ي
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#07132B] hover:bg-[#122245] text-white rounded-xl font-headline-md font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#07132B]/20 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-sky-400" />
                <span>
                  {isSubmitting ? 'جاري تأكيد طلبك...' : `تأكيد وإتمام الطلب (${grandTotal.toLocaleString()} ر.ي)`}
                </span>
              </button>

              <p className="text-center text-label-sm font-label-sm text-on-surface-variant text-[11px]">
                بالضغط على تأكيد، أنت توافق على شروط الخدمة وسياسة الاسترجاع في منصة غيم سبيس 🤍
              </p>
            </div>
          </section>
        </form>
      </div>

      {/* OTP Security Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onVerified={handleOtpVerified}
        phoneNumber={phone}
        title="تأكيد الطلب برمز الأمان"
        subtitle="يرجى إدخال رمز التحقق (OTP) لتأكيد حجز طلبك ومتابعة المندوب مباشرة"
      />
    </main>
  );
}
