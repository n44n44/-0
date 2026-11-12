import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Bike,
  Navigation,
  Phone,
  User,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  MessageCircle,
  CreditCard,
  DollarSign,
  AlertCircle,
  Send,
  ChevronDown,
} from 'lucide-react';
import GhaymLogo from '../components/GhaymLogo';
import { usePlatform } from '../context/PlatformContext';

export default function CourierDashboard({ onBackToMarket }) {
  const {
    orders,
    courierAcceptOrder,
    courierConfirmPickup,
    courierCompleteDelivery,
    isCourierOnline,
    setIsCourierOnline,
    courierProfile,
    setCourierProfile,
    notifications,
    couriersList = [],
    activeCourierId,
    switchCourierAccount,
    currentCourierUser,
  } = usePlatform();

  // Active Tab
  // 'dashboard' | 'available' | 'current' | 'history' | 'earnings' | 'profile' | 'support'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Delivery status for the quick card on dashboard
  const [quickDeliveryStep, setQuickDeliveryStep] = useState('ready'); // 'ready' | 'in_transit' | 'delivered'
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  // Available orders ready for pickup from stores
  const availableOrders = orders.filter((o) => o.status === 'ready_for_pickup');

  // Orders accepted by this specific courier
  const acceptedOrders = orders.filter(
    (o) => o.status === 'accepted' && (o.courierId === currentCourierUser?.id)
  );

  // Orders currently in transit by this specific courier
  const inTransitOrders = orders.filter(
    (o) => o.status === 'on_the_way' && (o.courierId === currentCourierUser?.id)
  );

  // Completed delivery history strictly for this courier
  const completedOrders = orders.filter(
    (o) => o.status === 'delivered' && (o.courierId === currentCourierUser?.id)
  );

  // Menu items matching Image 3 Bottom
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    {
      id: 'available',
      label: 'الطلبات المتاحة',
      icon: Package,
      badge: availableOrders.length > 0 ? `${availableOrders.length}` : null,
      badgeColor: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'current',
      label: 'التوصيلات الحالية',
      icon: Navigation,
      badge: inTransitOrders.length + acceptedOrders.length > 0 ? `${inTransitOrders.length + acceptedOrders.length}` : null,
      badgeColor: 'bg-emerald-400 text-slate-950',
    },
    { id: 'history', label: 'سجل التوصيلات', icon: Clock },
    { id: 'earnings', label: 'الأرباح والمحفظة', icon: DollarSign },
    { id: 'profile', label: 'ملفي الشخصي', icon: User },
    { id: 'support', label: 'الدعم والمساعدة', icon: HelpCircle },
  ];

  // Quick Action on Dashboard Card
  const handleQuickCardAction = () => {
    if (quickDeliveryStep === 'ready') {
      setQuickDeliveryStep('in_transit');
    } else if (quickDeliveryStep === 'in_transit') {
      setQuickDeliveryStep('delivered');
      if (window.confetti) {
        window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
      setCourierProfile((prev) => ({
        ...prev,
        totalDeliveries: prev.totalDeliveries + 1,
        todayEarnings: prev.todayEarnings + 1200,
        totalEarnings: prev.totalEarnings + 1200,
      }));
    } else {
      setQuickDeliveryStep('ready');
    }
  };

  // Courier confirms delivery with OTP
  const handleConfirmCustomerDelivery = (orderId, targetOtp) => {
    if (enteredOtp && targetOtp && enteredOtp.trim() !== targetOtp.trim()) {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    courierCompleteDelivery(orderId, enteredOtp);
    setEnteredOtp('');
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
    alert('تم تأكيد تسليم الشحنة للعميل بنجاح وإضافة رسوم التوصيل إلى محفظتك! ✅');
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col md:flex-row text-slate-800" dir="rtl">
      {/* 1. SIDEBAR (Matching Image 3 Bottom) */}
      <aside className="w-full md:w-64 bg-[#081226] text-white flex flex-col justify-between shrink-0 shadow-2xl border-l border-sky-950">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-sky-950/80">
            <GhaymLogo size="md" subtitle="Grow Together" />
          </div>

          {/* Online status indicator matching image 3 bottom */}
          <div className="px-6 py-3 border-b border-sky-950/60 bg-[#060e20]">
            <button
              onClick={() => setIsCourierOnline(!isCourierOnline)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white transition"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isCourierOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                ></span>
                <span>{isCourierOnline ? 'متصل الآن' : 'غير متصل'}</span>
              </div>
              <span className="text-[10px] text-sky-400 font-normal">
                {isCourierOnline ? '(تبديل للأوفلاين)' : '(تبديل للأونلاين)'}
              </span>
            </button>
          </div>

          {/* Multi-Tenant Courier Account Switcher */}
          <div className="px-4 py-2.5 bg-[#050c1a] border-b border-sky-950/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Bike className="w-3.5 h-3.5" />
                <span>المندوب النشط:</span>
              </span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-mono">
                {currentCourierUser?.id}
              </span>
            </div>
            <div className="relative">
              <select
                value={currentCourierUser?.id}
                onChange={(e) => switchCourierAccount(e.target.value)}
                className="w-full bg-[#081226] text-white text-xs font-bold py-1.5 pr-2 pl-6 rounded-xl border border-sky-800 focus:outline-none focus:ring-1 focus:ring-sky-400 appearance-none cursor-pointer"
              >
                {couriersList.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#081226] text-white">
                    {c.name} ({c.vehicle})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-sky-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 font-black'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        item.badgeColor || 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back and Logout */}
        <div className="p-4 border-t border-sky-950/80 space-y-2">
          {onBackToMarket && (
            <button
              onClick={onBackToMarket}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-bold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>العودة إلى واجهة السوق</span>
            </button>
          )}

          <button
            onClick={() => alert('تم تسجيل خروج المندوب')}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold transition text-right"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN COURIER DASHBOARD */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isCourierOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            <span className="text-xs font-bold text-slate-700">
              نطاق التوصيل النشط: المكلا وضواحيها (الشرج، فوه، روكب، الديس)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('support')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative"
              title="التنبيهات"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500"></span>
            </button>

            {/* Courier Profile matching image 3 bottom */}
            <div className="flex items-center gap-2.5 pr-2 border-r border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-200">
                {currentCourierUser?.name?.[0] || 'م'}
              </div>
              <div className="text-right">
                <span className="block text-xs font-black text-slate-900 leading-tight">
                  {currentCourierUser?.name || 'أحمد محمد'}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">مندوب معتمد 🛵</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD (Matching Image 3 Bottom) */}
          {activeTab === 'dashboard' && (
            <>
              {/* STATS CARDS ROW (Matching Image 3 Bottom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. مهام قادمة */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">مهام قادمة</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block font-mono">
                      {availableOrders.length}
                    </span>
                    <span className="text-[11px] text-sky-600 font-bold mt-1 block">بانتظار الاستلام</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                {/* 2. تم التوصيل */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">تم التوصيل</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block font-mono">
                      {completedOrders.length}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold mt-1 block">لهذا المندوب</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                {/* 3. معدل الالتزام */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">معدل الالتزام</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block font-mono">
                      {currentCourierUser?.commitmentRate || 98}%
                    </span>
                    <span className="text-[11px] text-amber-500 font-bold mt-1 block">ممتاز جداً</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* 4. إجمالي التوصيلات */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">إجمالي التوصيلات</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block font-mono">
                      +{currentCourierUser?.totalDeliveries || 50}
                    </span>
                    <span className="text-[11px] text-sky-600 font-bold mt-1 block">عملية ناجحة</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Bike className="w-6 h-6" />
                  </div>
                </div>

                {/* 5. بوابة المندوب */}
                <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
                  <div>
                    <h4 className="text-xs font-black">بوابة المندوب</h4>
                    <p className="text-[10px] text-sky-100 mt-1">إدارة مهام التوصيل الخاصة بك</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Bike className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* MAIN TASKS & MAP SECTION (Matching Image 3 Bottom) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Live Interactive Map Preview (5 Cols) matching Image 3 Bottom */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">موقعي الحالي</h3>
                      <span className="text-xs text-slate-400">تتبع المسار الحي للتوصيل</span>
                    </div>
                    <button
                      onClick={() => alert('خريطة المكلا الحية تعمل بنظام تحديد المواقع GPS')}
                      className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>عرض الخريطة كاملة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Stylized Street Grid Background with Road Path (Image 3 Bottom) */}
                  <div className="relative h-60 rounded-2xl overflow-hidden bg-[#e8ecf2] border border-slate-200 shadow-inner p-3">
                    <div
                      className="absolute inset-0 opacity-40 pointer-events-none"
                      style={{
                        backgroundImage:
                          'radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                        backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                      }}
                    ></div>

                    {/* SVG Route Path */}
                    <svg className="w-full h-full relative z-10" viewBox="0 0 300 200" fill="none">
                      <path
                        d="M 50 160 Q 120 160 140 100 T 240 50"
                        stroke="#0284c7"
                        strokeWidth="4"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                      />
                      {/* Courier Pin */}
                      <g transform="translate(40, 140)">
                        <circle cx="15" cy="15" r="16" fill="#0284c7" opacity="0.2" className="animate-ping" />
                        <circle cx="15" cy="15" r="12" fill="#0369a1" />
                        <circle cx="15" cy="15" r="9" fill="#ffffff" />
                      </g>
                      {/* Destination Pin */}
                      <g transform="translate(230, 30)">
                        <path
                          d="M12 2 C7.5 2 4 5.5 4 10 C4 15.5 12 22 12 22 C12 22 20 15.5 20 10 C20 5.5 16.5 2 12 2 Z"
                          fill="#0284c7"
                        />
                        <circle cx="12" cy="10" r="3" fill="#ffffff" />
                      </g>
                    </svg>

                    {/* Pin Tooltips */}
                    <div className="absolute bottom-6 right-8 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-sky-400/30 z-20">
                      <Bike className="w-3.5 h-3.5 text-sky-400" />
                      <span>أنت هنا (شارع الميناء)</span>
                    </div>

                    <div className="absolute top-4 left-6 bg-white text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-slate-200 z-20">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      <span>حي الورد - المكلا</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>المسافة المتبقية: 2.4 كم</span>
                    <span className="font-bold text-sky-700">الوقت المتوقع: 8 دقائق</span>
                  </div>
                </div>

                {/* Next Delivery Task Card (4 Cols) matching Image 3 Bottom */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900">الطلبية القادمة للتوصيل</h3>
                      <button
                        onClick={() => setActiveTab('available')}
                        className="text-xs text-sky-600 font-bold hover:underline"
                      >
                        عرض الكل ➔
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">تفاصيل الطلب الفوري</span>
                  </div>

                  {/* Task Details Box (#1047 matching Image 3 Bottom) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-900 font-mono">#1047</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>منذ 15 دقيقة</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        quickDeliveryStep === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : quickDeliveryStep === 'in_transit'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {quickDeliveryStep === 'ready'
                          ? 'جاهز للاستلام 📦'
                          : quickDeliveryStep === 'in_transit'
                          ? 'قيد التوصيل 🛵'
                          : 'تم التسليم بنجاح ✅'}
                      </span>
                    </div>

                    {/* Product Image & Details */}
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80"
                        alt="حقيبة"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          حقيبة خوص يمنية مطرزة يدوياً
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-sky-600" />
                          <span>حي الورد - المكلا</span>
                        </p>
                        <span className="text-xs font-black text-sky-700 block mt-1">
                          رسوم التوصيل: 1,200 ر.ي
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex justify-between">
                      <span>العميل: فاطمة باوزير</span>
                      <a
                        href="tel:771234567"
                        className="text-sky-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>اتصال (771234567)</span>
                      </a>
                    </div>
                  </div>

                  {/* Button: "بدء التوصيل ➔" matching Image 3 Bottom */}
                  <button
                    onClick={handleQuickCardAction}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-extrabold text-xs shadow-md shadow-sky-600/25 transition duration-200 flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <span>
                      {quickDeliveryStep === 'ready'
                        ? 'بدء التوصيل ➔'
                        : quickDeliveryStep === 'in_transit'
                        ? 'تأكيد إتمام التوصيل ✅'
                        : 'إعادة تعيين الحالة'}
                    </span>
                  </button>
                </div>

                {/* Encouragement Card (3 Cols) matching Image 3 Bottom */}
                <div className="lg:col-span-3 bg-gradient-to-b from-[#081838] to-[#040916] text-white rounded-3xl p-6 shadow-xl border border-sky-900/60 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/15 rounded-full blur-2xl pointer-events-none"></div>

                  {/* Big Checkmark Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center shadow-lg mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2 relative z-10">
                    <h3 className="text-base font-black text-white leading-snug">
                      أنت في الطريق الصحيح!
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      استمر في تسليم الطلبات لخدمة عملائنا ودعم الأسر والحرفيين في المكلا.
                    </p>
                  </div>

                  {/* City Skyline Silhouette */}
                  <div className="pt-6 relative z-10">
                    <div className="h-16 flex items-end justify-between gap-1 opacity-40">
                      <div className="w-3 h-8 bg-sky-400 rounded-t"></div>
                      <div className="w-4 h-12 bg-sky-300 rounded-t"></div>
                      <div className="w-3 h-6 bg-sky-500 rounded-t"></div>
                      <div className="w-5 h-14 bg-sky-200 rounded-t"></div>
                      <div className="w-3 h-9 bg-sky-400 rounded-t"></div>
                      <div className="w-4 h-11 bg-sky-300 rounded-t"></div>
                      <div className="w-5 h-16 bg-sky-100 rounded-t"></div>
                      <div className="w-3 h-7 bg-sky-500 rounded-t"></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: AVAILABLE ORDERS (الطلبات الجديدة المتاحة للاستلام) */}
          {activeTab === 'available' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    طلبات جاهزة للاستلام من المتاجر بالمكلا ({availableOrders.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    هذه الطلبات قام التجار بتجهيزها وهي جاهزة الآن لتستلمها وتوصلها للعميل
                  </p>
                </div>
              </div>

              {availableOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <Package className="w-12 h-12 mx-auto text-slate-300" />
                  <p>لا توجد طلبات جديدة بانتظار الاستلام حالياً.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-sky-300 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-slate-900">{ord.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                          جاهز للاستلام 📦
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600">
                        <p><strong className="text-slate-900">المتجر:</strong> {ord.storeName || 'متجر غيم سبيس'}</p>
                        <p><strong className="text-slate-900">حي العميل:</strong> {ord.address}</p>
                        <p><strong className="text-slate-900">عمولة التوصيل:</strong> <span className="font-mono font-black text-emerald-600">1,200 ر.ي</span></p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => {
                            courierAcceptOrder(ord.id);
                            setActiveTab('current');
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-xs hover:from-sky-700 hover:to-blue-800 transition shadow-sm flex items-center gap-1.5"
                        >
                          <Bike className="w-4 h-4" />
                          <span>قبول الطلب والتوجه للمتجر</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRENT DELIVERIES (التوصيلات الحالية - مقبولة أو قيد التوصيل) */}
          {activeTab === 'current' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">
                  التوصيلات النشطة الجارية ({acceptedOrders.length + inTransitOrders.length})
                </h3>
                <p className="text-xs text-slate-500">
                  قم بتأكيد استلام الطلب من المتجر، ثم اتصل بالعميل وأدخل رمز التسليم عند إيصاله
                </p>
              </div>

              {/* 1. Accepted from store waiting pickup */}
              {acceptedOrders.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>طلبات تم قبولها وبانتظار استلامها من المتجر:</span>
                  </span>

                  {acceptedOrders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="font-mono font-black text-sm text-slate-900">{ord.id}</span>
                        <div className="text-xs text-slate-700 mt-1">
                          <p><strong>المتجر للاستلام منه:</strong> {ord.storeName}</p>
                          <p><strong>وجهة العميل:</strong> {ord.address}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => courierConfirmPickup(ord.id)}
                        className="px-4 py-2 rounded-xl bg-[#172A46] text-white font-bold text-xs hover:bg-[#233f66] transition shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>تأكيد استلام الطرد من المتجر 📦</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. In-Transit Orders on the way to customer */}
              {inTransitOrders.length > 0 && (
                <div className="space-y-3 pt-3">
                  <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                    <Navigation className="w-4 h-4" />
                    <span>طلبات قيد التوصيل في الطريق إلى العملاء:</span>
                  </span>

                  {inTransitOrders.map((ord) => (
                    <div key={ord.id} className="p-5 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-sky-100 pb-3">
                        <div>
                          <span className="font-mono font-black text-base text-slate-900">{ord.id}</span>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            المطلوب تحصيله من العميل: {ord.paymentMethod === 'الدفع عند الاستلام' ? `${ord.total?.toLocaleString()} ر.ي (نقداً)` : 'مدفوع إلكترونياً مسبقاً ✅'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${ord.phone}`}
                            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-sky-600" />
                            <span>اتصال ({ord.phone})</span>
                          </a>

                          <a
                            href={`https://wa.me/967${ord.phone.replace(/^0+/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>واتساب</span>
                          </a>
                        </div>
                      </div>

                      {/* Customer Address Details */}
                      <div className="text-xs text-slate-700 space-y-1">
                        <p><strong className="text-slate-900">اسم المستلم:</strong> {ord.customerName}</p>
                        <p><strong className="text-slate-900">عنوان التوصيل:</strong> {ord.address}</p>
                        {ord.otpCode && (
                          <p className="text-[11px] text-slate-500">
                            رمز التحقق المطلوب من العميل: <span className="font-mono font-bold text-sky-700">{ord.otpCode}</span>
                          </p>
                        )}
                      </div>

                      {/* OTP Confirmation & Complete delivery button */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs">
                          <label className="font-bold text-slate-700 whitespace-nowrap">رمز OTP للتسليم:</label>
                          <input
                            type="text"
                            placeholder="أدخل رمز العميل"
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            className="w-32 bg-[#F3F6FB] border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:border-sky-500"
                          />
                          {otpError && (
                            <span className="text-[11px] text-red-500 font-bold">الرمز غير صحيح!</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleConfirmCustomerDelivery(ord.id, ord.otpCode)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تأكيد التسليم بنجاح للعميل ✅</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {acceptedOrders.length === 0 && inTransitOrders.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <Navigation className="w-12 h-12 mx-auto text-slate-300" />
                  <p>لا توجد توصيلات نشطة قيد التنفيذ حالياً.</p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    تصفح الطلبات المتاحة لقبول مهمة جديدة ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLETED DELIVERIES HISTORY (سجل التوصيلات) */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">سجل التوصيلات المكتملة</h3>
                  <p className="text-xs text-slate-500">أرشيف المهام الناجحة ومواعيد التسليم في المكلا</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {completedOrders.length + 50} توصيلة ناجحة
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {completedOrders.map((ord) => (
                  <div key={ord.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          تم التسليم
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        العميل: {ord.customerName} • {ord.address}
                      </span>
                    </div>

                    <div className="text-left font-mono font-bold text-emerald-600">
                      +1,200 ر.ي
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EARNINGS & WALLET (الأرباح وسجل العمولات) */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-bold">أرباح توصيلات اليوم</span>
                  <span className="text-2xl font-black text-slate-900 block font-mono">
                    {courierProfile.todayEarnings?.toLocaleString()} ر.ي
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold block">12 رحلة منجزة ✅</span>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-bold">إجمالي أرباح التوصيل المتراكمة</span>
                  <span className="text-2xl font-black text-sky-700 block font-mono">
                    {courierProfile.totalEarnings?.toLocaleString()} ر.ي
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold block">متاحة للسحب المباشر</span>
                </div>

                <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-3xl p-6 shadow-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-sky-100 font-bold">السحب الفوري للأرباح</span>
                    <span className="text-xs block text-sky-200 mt-1">
                      تحويل عبر خدمة (كريمي مميز / العمقي)
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`تم إرسال طلب سحب أرباح بقيمة ${courierProfile.totalEarnings?.toLocaleString()} ر.ي إلى حساب الكريمي المميز الخاص بك!`)}
                    className="w-full py-2.5 rounded-xl bg-white text-sky-900 font-black text-xs hover:bg-sky-50 transition shadow-sm"
                  >
                    سحب الرصيد الآن 💸
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE & SETTINGS (ملفي الشخصي والإعدادات) */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">بيانات المندوب والمركبة</h3>
                <p className="text-xs text-slate-500">معلومات الهوية ورخصة القيادة ووسيلة النقل المعتمدة</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المندوب الرباعي</label>
                  <input
                    type="text"
                    defaultValue={courierProfile.name}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم هاتف الاتصال والواتساب</label>
                  <input
                    type="tel"
                    defaultValue={courierProfile.phone}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">وسيلة التوصيل</label>
                  <input
                    type="text"
                    defaultValue={courierProfile.vehicle}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم لوحة المركبة</label>
                  <input
                    type="text"
                    defaultValue={courierProfile.plateNumber}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => alert('تم حفظ بيانات المندوب بنجاح!')}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition"
                >
                  حفظ البيانات
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SUPPORT (الدعم والمساعدة) */}
          {activeTab === 'support' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">غرفة عمليات التوصيل والدعم الفني بالمكلا</h3>
                <p className="text-xs text-slate-500">تواصل مباشر مع مشرفي التوصيل لحل أي صعوبة في الموقع أو مع العميل</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                  <h4 className="font-bold text-slate-900">الخط الساخن لعمليات المكلا</h4>
                  <p className="text-slate-600">للحالات الطارئة ومشاكل عناوين التوصيل أثناء الرحلة:</p>
                  <a href="tel:770000000" className="text-sky-700 font-bold block font-mono text-sm">
                    📞 770000000
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <h4 className="font-bold text-slate-900">مجموعة واتساب المندوبين</h4>
                  <p className="text-slate-600">لتحديثات الازدحام المروري وتنبيهات الطقس والطلبات العاجلة:</p>
                  <span className="text-emerald-700 font-bold block">💬 متصل مع 35 مندوباً بالمكلا</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
