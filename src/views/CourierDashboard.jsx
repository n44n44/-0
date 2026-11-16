import React, { useState, useEffect } from 'react';
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
  Plus,
  Save,
  RotateCcw,
  Sliders,
  Search,
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
    activeCourierId,
    logoutCourier,
    currentCourierUser,
    shippingRates,
    updateShippingRates,
    addShippingNeighborhood,
    createDemoOrderForCourier,
  } = usePlatform();

  // Active Tab
  // 'dashboard' | 'available' | 'current' | 'history' | 'shipping_rates' | 'earnings' | 'profile' | 'support'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Delivery status for the quick card on dashboard
  const [quickDeliveryStep, setQuickDeliveryStep] = useState('ready'); // 'ready' | 'in_transit' | 'delivered'
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  // Mukalla Shipping Rates local state
  const [ratesList, setRatesList] = useState(() => shippingRates || []);
  const [uniformFeeInput, setUniformFeeInput] = useState('1500');
  const [searchAreaTerm, setSearchAreaTerm] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDistance, setNewAreaDistance] = useState('');
  const [newAreaFee, setNewAreaFee] = useState('1500');
  const [ratesSuccessMsg, setRatesSuccessMsg] = useState('');
  const [isAddingArea, setIsAddingArea] = useState(false);

  useEffect(() => {
    if (shippingRates && shippingRates.length > 0) {
      setRatesList(shippingRates);
    }
  }, [shippingRates]);

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

  // Completed delivery history strictly for this courier (No fake data)
  const completedOrders = orders.filter(
    (o) => o.status === 'delivered' && (o.courierId === currentCourierUser?.id)
  );

  // Currently active delivery order for this courier (if any)
  const currentActiveOrder = inTransitOrders[0] || acceptedOrders[0];

  // Menu items matching Image 3 Bottom + Mukalla Shipping Rates
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
    {
      id: 'shipping_rates',
      label: 'رسوم مناطق المكلا',
      icon: MapPin,
      badge: `${(ratesList || []).length} أحياء`,
      badgeColor: 'bg-sky-500/20 text-sky-300',
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
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col md:flex-row w-full text-slate-800" dir="rtl">
      {/* 1. MOBILE APP HEADER & SLIDING NAVIGATION (Mobile Only < md) */}
      <div className="md:hidden bg-[#081226] text-white sticky top-0 z-40 border-b border-sky-950 shadow-lg">
        {/* Top Mobile Bar */}
        <div className="p-3 flex items-center justify-between border-b border-sky-950/60">
          <div className="flex items-center gap-2">
            <GhaymLogo size="sm" subtitle="لوحة المندوب" />
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Online Switcher */}
            <button
              onClick={() => setIsCourierOnline(!isCourierOnline)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold transition border border-white/15"
            >
              <span className={`w-2 h-2 rounded-full ${isCourierOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="text-[11px] text-white">{isCourierOnline ? 'متصل' : 'أوفلاين'}</span>
            </button>

            {onBackToMarket && (
              <button
                onClick={onBackToMarket}
                className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 text-xs hover:bg-sky-500/30 transition"
                title="السوق"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Sliding Tab Bar (Smooth Momentum Swipe) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-2 bg-[#060e20] snap-x-mandatory">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 snap-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md font-black'
                    : 'bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. DESKTOP SIDEBAR (Visible on md and up) */}
      <aside className="hidden md:flex w-64 bg-[#081226] text-white flex-col justify-between shrink-0 shadow-2xl border-l border-sky-950 min-h-screen">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-sky-950/80">
            <GhaymLogo size="md" subtitle="Grow Together" />
          </div>

          {/* Online status indicator */}
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

          {/* Authenticated Courier Badge */}
          <div className="px-4 py-3 bg-[#050c1a] border-b border-sky-950/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Bike className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-right">
                <div className="text-xs font-black text-white truncate">
                  {currentCourierUser?.name || 'كابتن التوصيل'}
                </div>
                <div className="text-[10px] text-sky-400 font-medium truncate">
                  {currentCourierUser?.vehicle || 'دراجة نارية معتمدة'}
                </div>
              </div>
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
            onClick={() => {
              if (logoutCourier) logoutCourier();
              if (onBackToMarket) onBackToMarket();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold transition text-right cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج والعودة للمنصة</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN COURIER DASHBOARD */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between shadow-sm sticky top-0 z-30">
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
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD (Matching Image 3 Bottom) */}
          {activeTab === 'dashboard' && (
            <>
              {/* STATS CARDS ROW (2 Columns on Mobile, 5 on Desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {/* 1. مهام قادمة */}
                <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold block">مهام قادمة</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 sm:mt-1 block font-mono">
                      {availableOrders.length}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-sky-600 font-bold mt-0.5 sm:mt-1 block">بانتظار الاستلام</span>
                  </div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* 2. تم التوصيل */}
                <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold block">تم التوصيل</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 sm:mt-1 block font-mono">
                      {completedOrders.length}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-0.5 sm:mt-1 block">لهذا المندوب</span>
                  </div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* 3. معدل الالتزام */}
                <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold block">معدل الالتزام</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 sm:mt-1 block font-mono">
                      {completedOrders.length > 0 ? `${currentCourierUser?.commitmentRate || 100}%` : '--'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-amber-500 font-bold mt-0.5 sm:mt-1 block truncate">
                      {completedOrders.length > 0 ? 'تقييم ممتاز' : 'حساب جديد'}
                    </span>
                  </div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* 4. إجمالي التوصيلات */}
                <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold block">إجمالي التوصيلات</span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 sm:mt-1 block font-mono">
                      {completedOrders.length}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-sky-600 font-bold mt-0.5 sm:mt-1 block">عملية ناجحة</span>
                  </div>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* 5. بوابة المندوب */}
                <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
                  <div>
                    <h4 className="text-xs font-black">بوابة المندوب</h4>
                    <p className="text-[10px] text-sky-100 mt-0.5">إدارة مهام التوصيل الخاصة بك</p>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Bike className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* MAIN TASKS & MAP SECTION (Matching Image 3 Bottom & Stitch Screen 1) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Live Interactive Map Preview (5 Cols) matching Stitch Screen 1 */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">موقعي الحالي</h3>
                      <span className="text-xs text-slate-400">
                        {currentActiveOrder ? 'تتبع المسار الحي للتوصيل' : 'نظام تحديد المواقع GPS'}
                      </span>
                    </div>
                    <button
                      onClick={() => alert('خريطة المكلا الحية تعمل بنظام تحديد المواقع GPS')}
                      className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>عرض الخريطة كاملة</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {currentActiveOrder ? (
                    /* Active Delivery Route Map */
                    <div className="relative h-60 rounded-2xl overflow-hidden bg-[#e8ecf2] border border-slate-200 shadow-inner p-3">
                      <div
                        className="absolute inset-0 opacity-40 pointer-events-none"
                        style={{
                          backgroundImage:
                            'radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                        }}
                      ></div>

                      <svg className="w-full h-full relative z-10" viewBox="0 0 300 200" fill="none">
                        <path
                          d="M 50 160 Q 120 160 140 100 T 240 50"
                          stroke="#0284c7"
                          strokeWidth="4"
                          strokeDasharray="6 4"
                          strokeLinecap="round"
                        />
                        <g transform="translate(40, 140)">
                          <circle cx="15" cy="15" r="16" fill="#0284c7" opacity="0.2" className="animate-ping" />
                          <circle cx="15" cy="15" r="12" fill="#0369a1" />
                          <circle cx="15" cy="15" r="9" fill="#ffffff" />
                        </g>
                        <g transform="translate(230, 30)">
                          <path
                            d="M12 2 C7.5 2 4 5.5 4 10 C4 15.5 12 22 12 22 C12 22 20 15.5 20 10 C20 5.5 16.5 2 12 2 Z"
                            fill="#0284c7"
                          />
                          <circle cx="12" cy="10" r="3" fill="#ffffff" />
                        </g>
                      </svg>

                      <div className="absolute bottom-6 right-8 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-sky-400/30 z-20">
                        <Bike className="w-3.5 h-3.5 text-sky-400" />
                        <span>أنت هنا (المكلا)</span>
                      </div>

                      <div className="absolute top-4 left-6 bg-white text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-slate-200 z-20">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" />
                        <span>{currentActiveOrder.address || 'المكلا'}</span>
                      </div>
                    </div>
                  ) : (
                    /* Clean Inactive Map Canvas matching Stitch Screen 1 */
                    <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-[#eaf4ec] border border-slate-200 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern height="30" id="grid-empty-dash" patternUnits="userSpaceOnUse" width="30">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect fill="#f1f5f9" height="100%" width="100%" />
                        <rect fill="url(#grid-empty-dash)" height="100%" width="100%" />
                        <path d="M -10 90 L 450 90" stroke="#ffffff" strokeWidth="12" />
                        <path d="M 200 -10 L 200 250" stroke="#ffffff" strokeWidth="12" />
                      </svg>
                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm max-w-[240px]">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">الخريطة غير نشطة</p>
                        <span className="text-[11px] text-slate-500 mt-1">
                          في انتظار تفعيل الاتصال واستلام أول طلب
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>
                      {currentActiveOrder ? 'المسافة المقدرة: ~2.5 كم' : 'الحالة: في انتظار استلام المهام'}
                    </span>
                    <span className="font-bold text-sky-700">
                      {isCourierOnline ? 'نظام GPS متصل ✅' : 'غير متصل (Off-line)'}
                    </span>
                  </div>
                </div>

                {/* Next Delivery Task Card (4 Cols) - 100% REAL & MATCHES STITCH */}
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

                  {currentActiveOrder ? (
                    /* REAL ACTIVE ORDER BOX */
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-black text-slate-900 font-mono">#{currentActiveOrder.id}</span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{currentActiveOrder.time || 'الآن'}</span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          currentActiveOrder.status === 'on_the_way'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {currentActiveOrder.status === 'on_the_way' ? 'قيد التوصيل 🛵' : 'جاهز للاستلام من المتجر 📦'}
                        </span>
                      </div>

                      {/* Product details */}
                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={currentActiveOrder.items?.[0]?.image || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80'}
                          alt="المنتج"
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {currentActiveOrder.items?.[0]?.name || 'طلب من متجر غيم سبيس'}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-sky-600" />
                            <span>{currentActiveOrder.address}</span>
                          </p>
                          <span className="text-xs font-black text-sky-700 block mt-1">
                            رسوم التوصيل: {(currentActiveOrder.shippingFee || 1200).toLocaleString()} ر.ي
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex justify-between">
                        <span>العميل: {currentActiveOrder.customerName || 'عميل غيم'}</span>
                        {currentActiveOrder.phone && (
                          <a
                            href={`tel:${currentActiveOrder.phone}`}
                            className="text-sky-600 font-bold flex items-center gap-1 hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            <span>اتصال ({currentActiveOrder.phone})</span>
                          </a>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (currentActiveOrder.status === 'accepted') {
                            courierConfirmPickup(currentActiveOrder.id);
                          } else {
                            setActiveTab('current');
                          }
                        }}
                        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-xs hover:from-sky-700 hover:to-blue-800 transition shadow-sm flex items-center justify-center gap-2"
                      >
                        {currentActiveOrder.status === 'accepted' ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>تأكيد استلام الطرد من المتجر 📦</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="w-4 h-4" />
                            <span>إدخال رمز OTP وتأكيد التسليم ➔</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* CLEAN ZEROED STATE MATCHING STITCH SCREEN 1 */
                    <div className="flex flex-col items-center justify-center text-center py-6 my-2 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-inner">
                        <Package className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">لا توجد طلبات حالية للتوصيل</h4>
                      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                        ابدأ بتصفح قائمة الطلبات المتاحة وقبول مهمتك الأولى
                      </p>
                      <button
                        onClick={() => setActiveTab('available')}
                        className="w-full mt-2 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>تصفح الطلبات المتاحة</span>
                        <span>←</span>
                      </button>
                    </div>
                  )}
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
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    طلبات جاهزة للاستلام من المتاجر بالمكلا ({availableOrders.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    هذه الطلبات قام التجار بتجهيزها وهي جاهزة الآن لتستلمها وتوصلها للعميل
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (createDemoOrderForCourier) {
                      const o = createDemoOrderForCourier('حي الورد - المكلا', 1200);
                      alert(`تم توليد طلب حقيقي جديد #${o.id} بنجاح في المكلا!`);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>توليد طلب جديد للاختبار بالمكلا</span>
                </button>
              </div>

              {availableOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <Package className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-600">لا توجد طلبات جديدة بانتظار الاستلام حالياً.</p>
                  <p className="text-[11px] text-slate-400">ستظهر هنا الطلبات فور قيام المتاجر بتجهيزها للشحن بالمكلا.</p>
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
                        <p><strong className="text-slate-900">عمولة التوصيل:</strong> <span className="font-mono font-black text-emerald-600">{(ord.shippingFee || 1200).toLocaleString()} ر.ي</span></p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => {
                            courierAcceptOrder(ord.id);
                            setActiveTab('current');
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-xs hover:from-sky-700 hover:to-blue-800 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                        className="px-4 py-2 rounded-xl bg-[#172A46] text-white font-bold text-xs hover:bg-[#233f66] transition shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                            href={`https://wa.me/967${ord.phone?.replace(/^0+/, '')}`}
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
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
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
                  <p className="font-bold text-slate-600">لا توجد توصيلات نشطة قيد التنفيذ حالياً.</p>
                  <p className="text-[11px] text-slate-400">ابدأ بقبول مهمتك الأولى من قائمة الطلبات المتاحة.</p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="text-xs font-bold text-sky-600 hover:underline pt-1 inline-block cursor-pointer"
                  >
                    تصفح الطلبات المتاحة لقبول مهمة جديدة ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: MUKALLA SHIPPING RATES CUSTOMIZATION (تحديد رسوم الشحن لمناطق المكلا) */}
          {activeTab === 'shipping_rates' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        تحديد وتخصيص رسوم الشحن لمناطق المكلا 🛵
                      </h3>
                      <p className="text-xs text-slate-500">
                        حدد تسعيرة التوصيل الخاصة بك لكل حي ومنطقة في المكلا وحضرموت لحساب الرسوم للعملاء تلقائياً
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setIsAddingArea(!isAddingArea)}
                    className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingArea ? 'إلغاء الإضافة' : 'إضافة حي جديد بالمكلا'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (updateShippingRates) updateShippingRates(ratesList);
                      setRatesSuccessMsg('تم حفظ وتثبيت تسعيرة التوصيل لجميع مناطق المكلا بنجاح! ✨');
                      if (window.confetti) window.confetti({ particleCount: 70, spread: 60 });
                      setTimeout(() => setRatesSuccessMsg(''), 4000);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التسعيرة</span>
                  </button>
                </div>
              </div>

              {/* Success Feedback Alert */}
              {ratesSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{ratesSuccessMsg}</span>
                </div>
              )}

              {/* Quick Bulk Uniform Rate Tool */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#07132B] to-[#0A162B] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    <span>أداة التسعير السريع الموحد:</span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    يمكنك تحديد سعر توصيل موحد لجميع أحياء المكلا بنقرة واحدة (مثلاً: 1,500 ر.ي لكافة المناطق)
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-36">
                    <input
                      type="number"
                      step="100"
                      value={uniformFeeInput}
                      onChange={(e) => setUniformFeeInput(e.target.value)}
                      placeholder="السعر بالريال"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-mono font-bold focus:outline-none focus:border-sky-400 text-left pr-8"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400">ر.ي</span>
                  </div>

                  <button
                    onClick={() => {
                      const val = parseInt(uniformFeeInput, 10);
                      if (!val || val <= 0) {
                        alert('يرجى كتابة مبلغ صحيح');
                        return;
                      }
                      const updated = ratesList.map((r) => ({ ...r, fee: val }));
                      setRatesList(updated);
                      if (updateShippingRates) updateShippingRates(updated);
                      setRatesSuccessMsg(`تم تطبيق رسم موحد بقيمة (${val.toLocaleString()} ر.ي) على جميع أحياء المكلا!`);
                      setTimeout(() => setRatesSuccessMsg(''), 4000);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#EAB839] hover:bg-[#D9A726] text-[#07132B] font-black text-xs transition cursor-pointer whitespace-nowrap shadow-md"
                  >
                    تطبيق على الكل
                  </button>
                </div>
              </div>

              {/* Add New Area Inline Form (If active) */}
              {isAddingArea && (
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                    <Plus className="w-4 h-4 text-sky-600" />
                    <span>إضافة حي أو منطقة جديدة بالمكلا</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">اسم الحي / المنطقة</label>
                      <input
                        type="text"
                        placeholder="مثال: المكلا - جول مسحة"
                        value={newAreaName}
                        onChange={(e) => setNewAreaName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">المسافة التقريبية (كم)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="مثال: 5.5"
                        value={newAreaDistance}
                        onChange={(e) => setNewAreaDistance(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-left"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">رسم التوصيل (ر.ي)</label>
                      <input
                        type="number"
                        step="100"
                        placeholder="مثال: 1800"
                        value={newAreaFee}
                        onChange={(e) => setNewAreaFee(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-left"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsAddingArea(false)}
                      className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        if (!newAreaName.trim()) {
                          alert('يرجى إدخال اسم الحي');
                          return;
                        }
                        const newItem = {
                          id: `mk-${Date.now()}`,
                          name: newAreaName.trim(),
                          distanceKm: parseFloat(newAreaDistance) || 3.0,
                          fee: parseInt(newAreaFee, 10) || 1500,
                          active: true,
                          duration: '20-30 دقيقة',
                        };
                        const updated = [...ratesList, newItem];
                        setRatesList(updated);
                        if (updateShippingRates) updateShippingRates(updated);
                        setNewAreaName('');
                        setNewAreaDistance('');
                        setNewAreaFee('1500');
                        setIsAddingArea(false);
                        setRatesSuccessMsg(`تمت إضافة "${newItem.name}" بنجاح إلى جدول تسعيرة المكلا!`);
                        setTimeout(() => setRatesSuccessMsg(''), 4000);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                    >
                      إضافة وتثبيت المنطقة
                    </button>
                  </div>
                </div>
              )}

              {/* Search & Filter Header */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={searchAreaTerm}
                    onChange={(e) => setSearchAreaTerm(e.target.value)}
                    placeholder="ابحث عن حي في المكلا (الشرج، فوة، الديس...)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pr-9 pl-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>

                <span className="text-xs text-slate-500 font-bold">
                  إجمالي المناطق المغطاة: <strong className="text-sky-700 font-mono">{ratesList.length}</strong>
                </span>
              </div>

              {/* Grid of Mukalla Neighborhoods (2 Columns on Mobile) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                {ratesList
                  .filter((item) => !searchAreaTerm || item.name.toLowerCase().includes(searchAreaTerm.toLowerCase()))
                  .map((area, idx) => (
                    <div
                      key={area.id || idx}
                      className={`p-2.5 sm:p-4 rounded-2xl border transition space-y-2 sm:space-y-3 ${
                        area.active !== false
                          ? 'border-slate-200 bg-white hover:border-sky-300 shadow-xs'
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600 shrink-0" />
                            <span className="line-clamp-1">{area.name}</span>
                          </h4>
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5">
                            ~{area.distanceKm} كم • {area.duration || '20 دقيقة'}
                          </span>
                        </div>

                        {/* Active toggle */}
                        <button
                          onClick={() => {
                            const updated = ratesList.map((r, i) =>
                              (r.id === area.id || i === idx) ? { ...r, active: !r.active } : r
                            );
                            setRatesList(updated);
                            if (updateShippingRates) updateShippingRates(updated);
                          }}
                          className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold cursor-pointer transition self-start sm:self-auto ${
                            area.active !== false
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {area.active !== false ? 'متاح للتوصيل ✓' : 'غير مغطى'}
                        </button>
                      </div>

                      {/* Fee input with quick (+/- 100) buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 pt-1 border-t border-slate-100">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-600">رسم التوصيل:</span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const newFee = Math.max(500, (area.fee || 1200) - 100);
                              const updated = ratesList.map((r, i) =>
                                (r.id === area.id || i === idx) ? { ...r, fee: newFee } : r
                              );
                              setRatesList(updated);
                              if (updateShippingRates) updateShippingRates(updated);
                            }}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
                            title="إنقاص 100 ريال"
                          >
                            -
                          </button>

                          <div className="relative">
                            <input
                              type="number"
                              step="50"
                              min="0"
                              value={area.fee}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                const updated = ratesList.map((r, i) =>
                                  (r.id === area.id || i === idx) ? { ...r, fee: val } : r
                                );
                                setRatesList(updated);
                              }}
                              className="w-20 bg-slate-50 border border-slate-200 rounded-lg py-1 px-1.5 text-xs font-mono font-black text-slate-900 text-center focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          <button
                            onClick={() => {
                              const newFee = (area.fee || 1200) + 100;
                              const updated = ratesList.map((r, i) =>
                                (r.id === area.id || i === idx) ? { ...r, fee: newFee } : r
                              );
                              setRatesList(updated);
                              if (updateShippingRates) updateShippingRates(updated);
                            }}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center cursor-pointer"
                            title="زيادة 100 ريال"
                          >
                            +
                          </button>

                          <span className="text-[10px] text-slate-500 font-bold">ر.ي</span>
                        </div>
                      </div>

                      {/* Quick test order trigger for this neighborhood */}
                      <button
                        onClick={() => {
                          if (createDemoOrderForCourier) {
                            const o = createDemoOrderForCourier(area.name, area.fee);
                            alert(`تم إنشاء طلب تجريبي جديد في "${area.name}" برسم ${area.fee} ر.ي! يمكنك الآن قبوله من تبويب "الطلبات المتاحة".`);
                            setActiveTab('available');
                          }
                        }}
                        className="w-full text-center py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200 hover:border-sky-200 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Bike className="w-3 h-3 text-sky-600" />
                        <span>إنشاء طلب تجريبي للاختبار في هذا الحي</span>
                      </button>
                    </div>
                  ))}
              </div>

              {/* Bottom Save & Confirmation Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  سيتم تطبيق هذه التسعيرة فوراً على فواتير العملاء عند اختيار أي من هذه الأحياء بالمكلا.
                </span>

                <button
                  onClick={() => {
                    if (updateShippingRates) updateShippingRates(ratesList);
                    setRatesSuccessMsg('تم حفظ وتثبيت تسعيرة التوصيل لجميع مناطق المكلا بنجاح! ✨');
                    if (window.confetti) window.confetti({ particleCount: 80, spread: 70 });
                    setTimeout(() => setRatesSuccessMsg(''), 4000);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ وتثبيت تسعيرة التوصيل لجميع المناطق ✅</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: COMPLETED DELIVERIES HISTORY (سجل التوصيلات - بدون طلبات وهمية) */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">سجل التوصيلات المكتملة</h3>
                  <p className="text-xs text-slate-500">أرشيف المهام الناجحة ومواعيد التسليم في المكلا</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {completedOrders.length} توصيلة ناجحة
                </span>
              </div>

              {completedOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <Clock className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-600">سجل التوصيلات فارغ حالياً</p>
                  <p className="text-[11px] text-slate-400">ستظهر هنا جميع المهام بعد إنجاز تسليمها بنجاح للعملاء بالمكلا.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {completedOrders.map((ord) => (
                    <div key={ord.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            تم التسليم بنجاح ✅
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          العميل: {ord.customerName} • {ord.address}
                        </span>
                      </div>

                      <div className="text-left font-mono font-bold text-emerald-600">
                        +{(ord.shippingFee || 1200).toLocaleString()} ر.ي
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

              {/* Mukalla Shipping Rates Shortcut Card */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>تسعيرة ورسوم التوصيل لمناطق المكلا</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    قم بتعديل وتخصيص رسوم الشحن لأحياء المكلا ({ratesList.length} حي معتمد)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('shipping_rates')}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <span>تعديل تسعيرة الأحياء ➔</span>
                </button>
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
