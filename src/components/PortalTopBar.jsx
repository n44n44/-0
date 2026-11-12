import React from 'react';
import {
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  User,
  ExternalLink,
  Lock,
  Database,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export default function PortalTopBar({ cartCount = 0, onOpenSupabaseModal }) {
  const {
    currentPortal,
    switchPortal,
    orders = [],
    merchantOrders = [],
    payments = [],
    customerUser,
    currentMerchantUser,
    merchantStore,
    currentCourierUser,
    isCourierOnline,
    isSupabaseConnected,
  } = usePlatform();

  // Compute live badges
  const merchantOrdersCount = (merchantOrders || []).filter((o) => o.status === 'pending' || o.status === 'ready_for_pickup').length;
  const availableCourierOrdersCount = (orders || []).filter((o) => o.status === 'ready_for_pickup').length;
  const pendingReceiptsCount = (payments || []).filter((p) => p.status === 'pending_verification').length;

  const portals = [
    {
      id: 'marketplace',
      hash: '#/',
      label: 'المنصة الرئيسية (العملاء)',
      sub: 'تصفح المتاجر والشراء',
      icon: ShoppingBag,
      color: 'bg-[#54B9F2] text-[#172A46]',
      badge: cartCount > 0 ? `${cartCount} في السلة` : null,
      badgeColor: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'merchant',
      hash: '#/merchant',
      label: 'لوحة تحكم التاجر',
      sub: 'إدارة المنتجات والطلبات',
      icon: Store,
      color: 'bg-amber-400 text-slate-950',
      badge: merchantOrdersCount > 0 ? `${merchantOrdersCount} طلبات` : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'courier',
      hash: '#/courier',
      label: 'لوحة تحكم المندوب',
      sub: 'مهام التوصيل بالمكلا',
      icon: Bike,
      color: 'bg-sky-400 text-slate-950',
      badge: isCourierOnline ? (availableCourierOrdersCount > 0 ? `${availableCourierOrdersCount} متاح` : 'متصل') : 'غير متصل',
      badgeColor: isCourierOnline ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white',
    },
    {
      id: 'admin',
      hash: '#/admin',
      label: 'لوحة الإدارة العامة',
      sub: 'إشراف المنصة والتقارير',
      icon: ShieldCheck,
      color: 'bg-emerald-400 text-slate-950',
      badge: pendingReceiptsCount > 0 ? `${pendingReceiptsCount} إيصالات 💳` : 'Super Admin',
      badgeColor: pendingReceiptsCount > 0 ? 'bg-amber-400 text-slate-950 font-black animate-pulse' : 'bg-indigo-600 text-white',
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#0a1527] text-white border-b border-[#1c3354] shadow-2xl backdrop-blur-md px-3 py-1.5" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Portals Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-slate-400 pl-2 border-l border-slate-700/60 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#54B9F2] animate-pulse"></span>
            <span>بوابات المنصة الأربعة:</span>
          </div>

          {portals.map((portal) => {
            const Icon = portal.icon;
            const isActive = currentPortal === portal.id;
            return (
              <button
                key={portal.id}
                onClick={() => switchPortal(portal.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? `${portal.color} shadow-md shadow-sky-950/40 scale-102`
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? '' : 'text-[#54B9F2]'}`} />
                <span>{portal.label}</span>

                {portal.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-black/20 text-current' : portal.badgeColor
                    }`}
                  >
                    {portal.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Active URL indicator, Supabase Connection Pill & User Pill */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0 text-xs">
          {/* Supabase Status Button */}
          <button
            onClick={() => onOpenSupabaseModal && onOpenSupabaseModal()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-xs cursor-pointer border ${
              isSupabaseConnected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/15 hover:text-white'
            }`}
            title="إعداد والربط بقاعدة بيانات Supabase"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSupabaseConnected ? 'سوبابيز: متصل 🟢' : 'ربط سوبابيز ⚡'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-[#12233b] px-3 py-1 rounded-lg border border-[#233f66] font-mono text-[11px] text-slate-300">
            <Lock className="w-3 h-3 text-[#54B9F2]" />
            <span>ghaymspace.com/{currentPortal === 'marketplace' ? '' : `#/${currentPortal}`}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 text-xs bg-[#102035] px-2.5 py-1 rounded-lg border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-bold hidden md:inline text-white">
              {currentPortal === 'merchant'
                ? `${currentMerchantUser?.name} (${merchantStore?.name})`
                : currentPortal === 'courier'
                ? `${currentCourierUser?.name} (مندوب المكلا)`
                : currentPortal === 'admin'
                ? 'المشرف العام (Super Admin)'
                : customerUser?.name || 'فاطمة باوزير (عميل)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

