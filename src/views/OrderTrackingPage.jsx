import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  ChevronLeft,
  Navigation,
  Bike,
  Sparkles,
  ArrowRight,
  User,
} from 'lucide-react';
import { SAMPLE_ORDERS } from '../data/mockData';
import { usePlatform } from '../context/PlatformContext';

export default function OrderTrackingPage({ order = SAMPLE_ORDERS[0], onNavigate }) {
  const { orders } = usePlatform();
  // Find live order from unified database to reflect real-time courier updates!
  const liveOrder = orders.find((o) => o.id === order.id) || order;

  // Derive tracking step dynamically from liveOrder.status
  const getStepFromStatus = (status) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'ready_for_pickup':
      case 'accepted':
        return 2;
      case 'on_the_way':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 3;
    }
  };

  const [currentStep, setCurrentStep] = useState(() => getStepFromStatus(liveOrder.status));
  const [distanceKm, setDistanceKm] = useState(() => (liveOrder.status === 'delivered' ? 0 : 2.1));
  const [estimatedMins, setEstimatedMins] = useState(() => (liveOrder.status === 'delivered' ? 0 : 8));

  // Update step if order status changes in unified database
  React.useEffect(() => {
    const newStep = getStepFromStatus(liveOrder.status);
    setCurrentStep(newStep);
    if (newStep === 4) {
      setDistanceKm(0);
      setEstimatedMins(0);
    }
  }, [liveOrder.status]);

  const steps = [
    { title: 'تم استلام وتأكيد الطلب', time: '04:45 م', desc: 'تم إرسال الإشعار للتاجر وبوابات الدفع' },
    { title: 'قيد التجهيز والتغليف', time: '05:05 م', desc: 'تم تجهيز البخور والمشغولات اليدوية بحب' },
    { title: 'تم التسليم لمندوب التوصيل', time: '05:18 م', desc: 'استلم المندوب الشحنة من المتجر' },
    { title: 'الشحنة في الطريق إليك', time: 'الآن', desc: 'المندوب يقترب من موقعك في المكلا' },
    { title: 'تم التسليم بنجاح', time: 'متوقع 05:35 م', desc: 'تأكيد الاستلام عبر كود الأمان' },
  ];

  const handleSimulateDelivery = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setDistanceKm(0);
      setEstimatedMins(0);
      if (window.confetti) {
        window.confetti({ particleCount: 90, spread: 70 });
      }
    } else {
      setCurrentStep(3);
      setDistanceKm(2.1);
      setEstimatedMins(8);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#54B9F2]/20 text-[#172A46] text-xs font-black">
              طلب مباشر
            </span>
            <span className="text-xs text-slate-500 font-mono">رقم الطلب: #{liveOrder.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#172A46] mt-1 flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#54B9F2]" />
            <span>تتبع حالة الشحن والتوصيل الجغرافي</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDelivery}
            className="px-4 py-2 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentStep === 4 ? 'إعادة محاكاة المسار' : 'محاكاة وصول المندوب'}</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-slate-500 hover:text-[#54B9F2] transition flex items-center gap-1 px-3 py-2"
          >
            <span>الرئيسية</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Tracking Stepper & Live Map (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEPPER STATUS BAR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-[#172A46]">حالة الشحنة الفورية</h3>
                <span className="text-xs text-slate-400">نظام التتبع الجغرافي بالكيلومترات</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-50 text-[#54B9F2] text-xs font-black border border-sky-200">
                {steps[currentStep].title}
              </span>
            </div>

            {/* Stepper Graphic */}
            <div className="relative">
              <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 -z-0">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-[#54B9F2] transition-all duration-500"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={st.title} className="flex sm:flex-col items-center gap-3 sm:text-center">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300 shadow-sm ${
                          isDone
                            ? 'bg-[#172A46] text-[#54B9F2] border-2 border-[#54B9F2]'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-sky-300/40 scale-110' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5 text-[#54B9F2]" /> : idx + 1}
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isDone ? 'text-[#172A46]' : 'text-slate-400'
                          }`}
                        >
                          {st.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{st.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LIVE GEOGRAPHIC DELIVERY MAP (المكلا) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#54B9F2]" />
                  <span>المسار الجغرافي المباشر لمندوب التوصيل</span>
                </h3>
                <span className="text-xs text-slate-400">حضرموت • المكلا</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-[#172A46]">
                <span className="flex items-center gap-1 text-[#54B9F2]">
                  <Bike className="w-4 h-4 animate-bounce" />
                  <span>المسافة: {distanceKm} كم</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>الوقت المقدر: {estimatedMins} دقائق</span>
                </span>
              </div>
            </div>

            {/* Map Canvas Graphic */}
            <div className="relative h-72 rounded-2xl overflow-hidden bg-[#e6ebf2] border border-slate-200 shadow-inner p-4">
              {/* Grid Background representing streets */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#94a3b8 1.5px, transparent 1.5px), linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '28px 28px, 56px 56px, 56px 56px',
                }}
              ></div>

              {/* Water Coastline Graphic for Mukalla Port */}
              <div className="absolute bottom-0 right-0 left-0 h-16 bg-gradient-to-t from-sky-200/50 to-transparent pointer-events-none flex items-end p-2 text-[10px] font-bold text-sky-800/60">
                <span>ساحل بحر العرب • خليج المكلا</span>
              </div>

              {/* Interactive SVG Path */}
              <svg className="w-full h-full relative z-10" viewBox="0 0 500 240" fill="none">
                {/* Delivery Road Line */}
                <path
                  d="M 60 190 Q 180 180 230 110 T 420 50"
                  stroke="#54B9F2"
                  strokeWidth="5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />

                {/* Starting Store Pin */}
                <g transform="translate(50, 175)">
                  <circle cx="15" cy="15" r="14" fill="#172A46" />
                  <circle cx="15" cy="15" r="7" fill="#54B9F2" />
                </g>

                {/* Live Courier Marker (Bike on Road) */}
                <g
                  transform={`translate(${currentStep === 4 ? 410 : 220}, ${
                    currentStep === 4 ? 40 : 100
                  })`}
                >
                  <circle cx="15" cy="15" r="20" fill="#54B9F2" opacity="0.25" className="animate-ping" />
                  <circle cx="15" cy="15" r="14" fill="#172A46" />
                  <circle cx="15" cy="15" r="10" fill="#54B9F2" />
                </g>

                {/* Destination Customer Pin */}
                <g transform="translate(410, 35)">
                  <path
                    d="M15 2 C9.5 2 5 6.5 5 12 C5 19 15 28 15 28 C15 28 25 19 25 12 C25 6.5 20.5 2 15 2 Z"
                    fill="#10b981"
                  />
                  <circle cx="15" cy="12" r="4" fill="#ffffff" />
                </g>
              </svg>

              {/* Pin Tooltips on Map */}
              <div className="absolute bottom-6 left-8 bg-[#172A46]/95 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-sky-400/40 z-20 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-[#54B9F2]" />
                <span>المندوب: أحمد محمد (شارع الكورنيش)</span>
              </div>

              <div className="absolute top-6 right-8 bg-white text-[#172A46] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 z-20 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>وجهة الاستلام: حي الورد - المكلا</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Details & Security OTP Code (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* COURIER INFO CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#172A46] border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#54B9F2]" />
              <span>مندوب التوصيل المعتمد</span>
            </h3>

            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#172A46] to-[#25426d] text-white flex items-center justify-center font-black text-lg border-2 border-sky-200 shadow-md">
                أ.م
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-[#172A46]">{liveOrder.courierName || 'أحمد محمد'}</h4>
                <span className="text-[11px] text-emerald-600 font-bold block">
                  مندوب موثق • تقييم 4.9 ⭐
                </span>
                <span className="text-[11px] text-slate-500 block">
                  المركبة: {liveOrder.vehicle || 'سكوتر توصيل سريع'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${liveOrder.courierPhone || '777000000'}`}
                className="py-2.5 px-3 rounded-xl bg-sky-50 text-[#172A46] hover:bg-sky-100 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-sky-200"
              >
                <Phone className="w-3.5 h-3.5 text-[#54B9F2]" />
                <span>اتصال بالمندوب</span>
              </a>

              <a
                href={`https://wa.me/967${liveOrder.courierPhone || '777000000'}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>محادثة واتساب</span>
              </a>
            </div>

            {/* Security OTP Code for Handover */}
            <div className="p-4 rounded-2xl bg-[#F3F6FB] border border-slate-200 text-center space-y-1">
              <span className="text-[11px] text-slate-500 font-bold block">
                كود الأمان لتسليم الشحنة (OTP):
              </span>
              <span className="text-2xl font-black text-[#172A46] tracking-widest font-mono">
                {liveOrder.otpCode || '4829'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                أعطِ هذا الكود للمندوب عند وصوله لتأكيد استلامك للشحنة
              </span>
            </div>
          </div>

          {/* ORDER ITEMS SUMMARY */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-[#172A46] border-b border-slate-100 pb-3">
              محتويات الشحنة الحالية
            </h3>

            <div className="space-y-3">
              {(liveOrder.items || []).map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={it.image} alt={it.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-[#172A46] line-clamp-1">{it.name}</h5>
                      <span className="text-[10px] text-slate-400">{it.storeName}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#54B9F2]">
                    {((it.price) * (it.quantity || 1)).toLocaleString()} ر.ي
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>طريقة الدفع:</span>
                <span className="font-bold text-[#172A46]">{liveOrder.paymentMethod || 'الدفع عند الاستلام'}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#172A46] pt-1">
                <span>الإجمالي المدفوع:</span>
                <span className="text-[#54B9F2]">{(liveOrder.total || 0).toLocaleString()} ر.ي</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

