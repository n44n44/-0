import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Check,
  Globe,
  Layers,
} from 'lucide-react';
import GhaymLogo from './GhaymLogo';
import { NEIGHBORHOODS_MUKALLA, PRODUCTS } from '../data/mockData';

export default function Header({
  activeNav = 'home',
  onNavigate,
  cartCount = 0,
  onOpenCart,
  onOpenLocationModal,
  selectedLocation = 'المكلا',
  onOpenSellerModal,
  customerUser,
  onOpenAuthModal,
  onOpenProfileModal,
}) {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Core navigation links
  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'stores', label: 'جميع المتاجر' },
    { id: 'products', label: 'جميع المنتجات' },
    { id: 'categories', label: 'التصنيفات' },
    { id: 'about', label: 'من نحن' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  // Live search suggestions
  const searchSuggestions = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.includes(searchQuery) ||
          p.storeName.includes(searchQuery) ||
          p.category.includes(searchQuery)
      ).slice(0, 5)
    : [];

  const handleSelectLocation = (locName) => {
    if (onOpenLocationModal) {
      onOpenLocationModal(locName);
    }
    setShowLocationMenu(false);
  };

  return (
    <header className="w-full bg-[#07132B]/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10 shadow-lg select-none" dir="rtl">
      {/* Soft celestial sky gradient highlight line on top edge */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8]/70 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Right: Official Ghaym Space Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <GhaymLogo
              onClick={() => onNavigate && onNavigate('home')}
              subtitle="GHAYM SPACE"
              size="md"
            />
          </div>

          {/* Center: Search Bar with Live Suggestions Dropdown */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="ابحث عن منتج، متجر، أو صانع حرفي في حضرموت..."
                className="w-full py-2.5 pr-11 pl-4 rounded-full bg-white/10 hover:bg-white/15 focus:bg-white text-slate-100 focus:text-slate-900 placeholder:text-slate-400 focus:placeholder:text-slate-500 text-xs sm:text-sm font-medium border border-white/15 focus:border-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/30 transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-[#38BDF8]" />
              </div>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>اقتراحات البحث السريع</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                </div>
                {searchSuggestions.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      if (onNavigate) onNavigate('products');
                      setSearchQuery('');
                    }}
                    className="w-full text-right px-4 py-2 hover:bg-sky-50 flex items-center justify-between transition-colors text-xs cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">{prod.name}</span>
                    <span className="text-[11px] text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded-full font-medium">{prod.storeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Left: Actions, Location & Cart */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            
            {/* Delivery Location Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 py-1.5 px-3.5 rounded-full text-xs transition border border-white/10 cursor-pointer"
                title="تحديد موقع التوصيل"
              >
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <div className="text-right leading-none hidden sm:block">
                  <span className="block text-[9px] text-slate-400 font-medium">التوصيل إلى</span>
                  <span className="font-bold text-white text-[11px]">{selectedLocation}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Location Selector Menu */}
              {showLocationMenu && (
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-slate-100 text-slate-800 text-right animate-in fade-in">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>اختر منطقة التوصيل</span>
                    <MapPin className="w-3 h-3 text-[#38BDF8]" />
                  </div>
                  {NEIGHBORHOODS_MUKALLA.slice(0, 6).map((nh, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(nh.name)}
                      className={`w-full text-right px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        selectedLocation === nh.name ? 'bg-sky-50 text-sky-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{nh.name}</span>
                      <span className="text-[10px] text-slate-400">{nh.fee} ر.ي</span>
                    </button>
                  ))}
                  <div className="pt-1.5 mt-1 border-t border-slate-100 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationMenu(false);
                        if (onOpenLocationModal) onOpenLocationModal(selectedLocation);
                      }}
                      className="w-full py-1.5 text-center text-[11px] font-bold text-[#38BDF8] hover:bg-sky-50 rounded-lg transition"
                    >
                      تحديد حي آخر في المكلا 📍
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Join as Merchant Button */}
            <button
              type="button"
              onClick={onOpenSellerModal}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EAB839]/20 to-[#EAB839]/10 hover:from-[#EAB839]/30 hover:to-[#EAB839]/20 border border-[#EAB839]/40 text-[#EAB839] text-xs font-bold transition cursor-pointer active:scale-95 shadow-sm"
              title="انضم كتاجر وافتح متجرك مجاناً"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>انضم كتاجر</span>
            </button>

            {/* Shopping Cart Icon with Badge */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="سلة التسوق"
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all border border-white/10 cursor-pointer group"
              title="سلة المشتريات"
            >
              <ShoppingCart className="w-4 h-4 text-slate-200 group-hover:text-[#38BDF8] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EAB839] text-[#07132B] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Button */}
            <button
              type="button"
              onClick={customerUser ? onOpenProfileModal : onOpenAuthModal}
              className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all border border-white/10 cursor-pointer active:scale-95"
              title={customerUser ? 'الملف الشخصي والطلبات' : 'تسجيل الدخول'}
            >
              <User className="w-4 h-4 text-[#38BDF8]" />
              <span className="hidden sm:inline text-xs font-bold">
                {customerUser ? customerUser.name.split(' ')[0] : 'تسجيل الدخول'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Elegant Navigation Bar */}
        <nav className="hidden md:flex items-center space-x-reverse space-x-8 py-2.5 border-t border-white/5 text-xs sm:text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate && onNavigate(link.id)}
                className={`transition-all py-1 px-1 relative cursor-pointer ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#38BDF8] to-[#EAB839] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07132B] border-t border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتجات، متاجر..."
              className="w-full py-2.5 pr-10 pl-4 rounded-xl bg-white/10 text-white placeholder:text-slate-400 text-xs border border-white/15 focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#38BDF8] absolute top-3 right-3 pointer-events-none" />
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-right px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeNav === link.id
                    ? 'bg-blue-600/20 text-[#38BDF8] border border-blue-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenSellerModal) onOpenSellerModal();
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#EAB839] to-amber-500 text-[#07132B] font-black text-xs text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>انضم كتاجر الآن مجاناً</span>
          </button>
        </div>
      )}
    </header>
  );
}
