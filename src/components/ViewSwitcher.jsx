import React from 'react';
import {
  Home,
  Layers,
  Tag,
  Store,
  ShoppingCart,
  CreditCard,
  Truck,
  LayoutDashboard,
  Bike,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function ViewSwitcher({ currentView, setView, cartCount = 3 }) {
  const views = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'categories', label: 'التصنيفات', icon: Layers },
    { id: 'products', label: 'المنتجات', icon: Tag },
    { id: 'stores', label: 'المتاجر', icon: Store },
    { id: 'cart', label: 'سلة التسوق', icon: ShoppingCart, count: cartCount },
    { id: 'checkout', label: 'إتمام الطلب والدفع', icon: CreditCard },
    { id: 'tracking', label: 'تتبع الطلب والخريطة', icon: Truck },
    { id: 'merchant', label: 'لوحة التاجر (AI)', icon: LayoutDashboard },
    { id: 'courier', label: 'بوابة المندوب (المكلا)', icon: Bike },
    { id: 'admin', label: 'لوحة المشرف (Super Admin)', icon: ShieldAlert },
    { id: 'about', label: 'من نحن', icon: Info },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#0e1b2f]/95 backdrop-blur-md border-b border-[#233f66] text-white shadow-xl px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0 text-slate-300 text-xs font-bold pl-2 border-l border-slate-700/60 hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-[#54B9F2] animate-pulse"></span>
          <span>معاينة الواجهات:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {views.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#54B9F2] text-[#172A46] shadow-sm scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#172A46]' : 'text-[#54B9F2]'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 rounded-full font-black ${
                      isActive ? 'bg-[#172A46] text-white' : 'bg-[#54B9F2] text-[#172A46]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
