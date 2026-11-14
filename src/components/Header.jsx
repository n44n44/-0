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
  Heart,
  Bell,
  Check,
} from 'lucide-react';
import { PRODUCTS, NEIGHBORHOODS_MUKALLA } from '../data/mockData';

const STITCH_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0kTwyrOgVt1UikZzjl_8adoPbACflThuS0OAMs1NBAxfhdj0d6U5zy__p3zH1LwwSEoGCf-TrnUeEI9e7ofTlwvzBEkjkRq7dWVa2VM8YYzl6qDAYySLO14czo6P79cFjMAhBjFyf9NEde5r2LsURP2LZTDBAFNk7WWjYNfTnw_OMambwfjlKjSD-giwosQLJIjXhF6XEZHmA2tjH6DDME6VgOoNX5agZVPKSTOwWd7WRKHY8-450';

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

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'stores', label: 'جميع المتاجر' },
    { id: 'categories', label: 'تصنيفات المنتجات' },
    { id: 'about', label: 'من نحن' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

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
    <header className="w-full bg-[#07132b] text-white sticky top-0 z-50 shadow-md relative overflow-hidden" dir="rtl">
      {/* Volumetric 3D Organic Clouds in Header around Search and Top Area */}
      <div className="absolute -top-10 right-1/4 w-48 h-20 bg-gradient-to-b from-sky-400/20 via-sky-300/10 to-transparent rounded-full blur-2xl pointer-events-none anim-cloud-float-1"></div>
      <div className="absolute -bottom-8 left-1/3 w-64 h-24 bg-gradient-to-t from-sky-500/15 via-blue-400/10 to-transparent rounded-full blur-2xl pointer-events-none anim-cloud-float-2"></div>
      <svg className="absolute top-0 right-10 w-44 h-16 opacity-15 pointer-events-none text-sky-200 fill-current blur-[1px]" viewBox="0 0 24 24">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"></path>
      </svg>
      <svg className="absolute bottom-1 left-20 w-36 h-14 opacity-20 pointer-events-none text-sky-300 fill-current blur-[0.5px]" viewBox="0 0 24 24">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"></path>
      </svg>

      {/* Top Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20 border-b border-[#142346] gap-4">
          
          {/* Right: Logo & Slogan */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-2 group text-right cursor-pointer"
            >
              <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
                <img
                  alt="غيم سبيس | Ghaym Space"
                  className="w-full h-full object-contain filter drop-shadow"
                  src={STITCH_LOGO_URL}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-tight">غيم سبيس</span>
                <span className="text-[11px] font-semibold text-sky-400 tracking-wider">Ghaym Space</span>
              </div>
            </button>
          </div>

          {/* Center: Search Input Bar surrounded by soft ambient glow */}
          <div className="flex-1 max-w-2xl mx-2 md:mx-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-sky-400/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    if (onNavigate) onNavigate('products');
                  }
                }}
                className="w-full py-2.5 pr-11 pl-4 rounded-full bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 border-none shadow-sm placeholder-gray-400 text-right"
                placeholder="ابحث عن منتجات، متاجر، أو حرفيين..."
                type="text"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 text-sm">
                <i className="fa-solid fa-magnifying-glass"></i>
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

          {/* Left: User Actions & Delivery Location */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <button
              aria-label="الإشعارات"
              className="text-gray-300 hover:text-white relative p-2 transition-colors cursor-pointer"
              type="button"
              onClick={() => {}}
            >
              <i className="fa-regular fa-bell text-lg"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Wishlist Heart */}
            <button
              aria-label="المفضلة"
              className="text-gray-300 hover:text-white p-2 transition-colors cursor-pointer"
              type="button"
              onClick={() => onNavigate && onNavigate('products')}
            >
              <i className="fa-regular fa-heart text-lg"></i>
            </button>

            {/* Shopping Cart Icon with Badge */}
            <button
              aria-label="سلة التسوق"
              className="text-gray-300 hover:text-white relative p-2 transition-colors cursor-pointer"
              type="button"
              onClick={onOpenCart}
            >
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Delivery Location Dropdown Container */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-2 bg-[#122245] hover:bg-[#1a2f5e] py-1.5 px-3 rounded-full text-xs transition border border-[#233b70] cursor-pointer"
              >
                <i className="fa-solid fa-location-dot text-sky-400 text-xs"></i>
                <div className="text-right leading-none hidden sm:block">
                  <span className="block text-[10px] text-gray-300">موقع التوصيل</span>
                  <span className="font-bold text-white">{selectedLocation}</span>
                </div>
                <i className="fa-solid fa-chevron-down text-[10px] text-gray-400 mr-1"></i>
              </button>

              {/* Location Dropdown Menu */}
              {showLocationMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 text-gray-800 z-50 text-right animate-in fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 border-b border-gray-100">
                    اختر موقع التوصيل
                  </div>
                  {NEIGHBORHOODS_MUKALLA.slice(0, 5).map((nh, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(nh.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition cursor-pointer ${
                        selectedLocation === nh.name
                          ? 'font-semibold text-sky-700 bg-sky-50'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{nh.name}</span>
                      {selectedLocation === nh.name && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                  ))}
                  <div className="pt-1 mt-1 border-t border-gray-100 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationMenu(false);
                        if (onOpenLocationModal) onOpenLocationModal(selectedLocation);
                      }}
                      className="w-full py-1 text-center text-[11px] font-bold text-sky-600 hover:bg-sky-50 rounded transition"
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
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 hover:from-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>انضم كتاجر</span>
            </button>

            {/* Login / User Account Button */}
            <button
              type="button"
              onClick={() => {
                if (customerUser) {
                  if (onOpenProfileModal) onOpenProfileModal();
                } else {
                  if (onNavigate) onNavigate('login');
                  else if (onOpenAuthModal) onOpenAuthModal();
                }
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 hover:border-sky-400 transition-all cursor-pointer shadow-sm active:scale-95 group"
              title={customerUser ? `حسابي (${customerUser.name})` : 'تسجيل الدخول'}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/30 transition-colors shrink-0">
                <i className="fa-regular fa-user text-xs"></i>
              </div>
              <span className="whitespace-nowrap font-bold text-xs sm:text-sm">
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

        {/* Navigation Links Row */}
        <nav className="flex items-center justify-start space-x-reverse space-x-8 py-3 text-sm font-semibold overflow-x-auto custom-scroll-hidden">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate && onNavigate(link.id)}
                className={`pb-1 px-1 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white border-b-2 border-amber-400 font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07132b] border-t border-[#142346] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => {
                if (customerUser) {
                  if (onOpenProfileModal) onOpenProfileModal();
                } else {
                  if (onNavigate) onNavigate('login');
                  else if (onOpenAuthModal) onOpenAuthModal();
                }
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between bg-white/10 text-white border border-white/15 mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-user text-sm text-sky-400"></i>
                <span>{customerUser ? customerUser.name : 'تسجيل الدخول'}</span>
              </div>
              <span className="text-[10px] text-sky-300 bg-sky-900/40 px-2 py-0.5 rounded">
                {customerUser ? 'حسابي' : 'دخول'}
              </span>
            </button>

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
                    ? 'bg-blue-600/20 text-sky-400 border border-blue-500/30'
                    : 'text-gray-300 hover:bg-white/5'
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
            className="w-full mt-2 py-2.5 rounded-xl bg-[#eab839] hover:bg-[#d9a72b] text-[#07132b] font-black text-xs text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>انضم كتاجر الآن مجاناً</span>
          </button>
        </div>
      )}
    </header>
  );
}
