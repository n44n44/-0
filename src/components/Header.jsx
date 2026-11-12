import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ShoppingCart,
  Heart,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Check,
  Globe,
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
  const [lang, setLang] = useState('ar');

  // Exact Navigation order matching Stitch & Reference:
  const navLinks = [
    { id: 'home', label: lang === 'ar' ? 'الرئيسية' : 'Home' },
    { id: 'stores', label: lang === 'ar' ? 'جميع المتاجر' : 'Stores' },
    { id: 'products', label: lang === 'ar' ? 'جميع المنتجات' : 'Products' },
    { id: 'about', label: lang === 'ar' ? 'من نحن' : 'About Us' },
    { id: 'contact', label: lang === 'ar' ? 'تواصل معنا' : 'Contact' },
  ];

  // Smart search filter suggestions
  const searchSuggestions = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.includes(searchQuery) ||
          p.storeName.includes(searchQuery) ||
          p.category.includes(searchQuery)
      ).slice(0, 4)
    : [];

  return (
    <header className="w-full bg-[#07132B] text-white sticky top-0 z-50 shadow-md relative overflow-hidden select-none" dir="rtl">
      {/* Volumetric 3D Organic Clouds in Header around Search and Top Area */}
      <div className="absolute -top-10 right-1/4 w-48 h-20 bg-gradient-to-b from-sky-400/20 via-sky-300/10 to-transparent rounded-full blur-2xl pointer-events-none anim-cloud-float-1"></div>
      <div className="absolute -bottom-8 left-1/3 w-64 h-24 bg-gradient-to-t from-sky-500/15 via-blue-400/10 to-transparent rounded-full blur-2xl pointer-events-none anim-cloud-float-2"></div>
      
      {/* Top Browser Simulation Bar (matching reference mockup) */}
      <div className="bg-[#040C1D] border-b border-[#0E1F42] px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" dir="ltr">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline mr-2">منصة غيم سبيس - حضرموت</span>
        </div>

        <div className="flex items-center gap-2 bg-[#0A1838] px-4 py-0.5 rounded-md border border-[#162D60] text-slate-300 font-mono text-[11px] max-w-sm w-full justify-center shadow-inner" dir="ltr">
          <span className="text-[#38BDF8]">🔒</span>
          <span>ghaymspace.com</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span className="font-bold text-[#38BDF8] hidden sm:inline">المكلا • حضرموت</span>
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-0.5 rounded-full bg-[#122245] hover:bg-[#1a2f5e] border border-[#233b70] text-[10px] font-bold text-sky-300 transition flex items-center gap-1 cursor-pointer"
            title="تبديل لغة الواجهة"
          >
            <Globe className="w-3 h-3 text-sky-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20 border-b border-[#142346] gap-4">
          
          {/* Right (RTL): Official Logo & Slogan */}
          <div className="flex items-center gap-3 shrink-0">
            <GhaymLogo
              onClick={() => onNavigate('home')}
              subtitle="Ghaym Space"
              size="md"
            />
          </div>

          {/* Center: Search Input Bar surrounded by soft ambient glow */}
          <div className="flex-1 max-w-2xl mx-2 md:mx-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-sky-400/20 rounded-full blur-xl pointer-events-none"></div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث عن منتجات، متاجر، أو حرفيين...' : 'Search products, stores, artisans...'}
                className="w-full py-2.5 pr-11 pl-4 rounded-full bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 border-none shadow-sm placeholder-gray-400 text-right"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 text-sm">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Smart Search Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-[#0C1A35] border border-[#1E3A70] rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-right animate-fadeIn">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#38BDF8] border-b border-[#1E3A70]/60 flex items-center justify-between">
                  <span>اقتراحات البحث السريع:</span>
                  <Sparkles className="w-3 h-3 text-[#EAB839]" />
                </div>
                {searchSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onMouseDown={() => {
                      onNavigate('products');
                      setSearchQuery(item.name);
                    }}
                    className="p-2 rounded-xl hover:bg-[#162D5A] cursor-pointer flex items-center justify-between gap-2 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h5 className="text-xs font-bold text-white line-clamp-1">{item.name}</h5>
                        <span className="text-[10px] text-gray-300">{item.storeName}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#38BDF8]">
                      {item.price.toLocaleString()} ر.ي
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Left (RTL): User Actions, Wishlist, Cart & Location Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist Heart */}
            <button
              onClick={() => onNavigate('products')}
              aria-label="المفضلة"
              className="text-gray-300 hover:text-white p-2 transition-colors relative hidden sm:flex"
              type="button"
              title="قائمة الرغبات والمفضلة"
            >
              <Heart className="w-5 h-5 text-gray-300 hover:text-rose-400 transition" />
            </button>

            {/* Shopping Cart Icon with Count Badge */}
            <button
              onClick={() => (onOpenCart ? onOpenCart() : onNavigate('cart'))}
              aria-label="سلة التسوق"
              className="text-gray-300 hover:text-white relative p-2 transition-colors"
              type="button"
              title="سلة التسوق"
            >
              <ShoppingCart className="w-5 h-5 text-[#38BDF8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EAB839] text-[#07132B] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Login Button */}
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 bg-[#122245] hover:bg-[#1a2f5e] py-1.5 px-3.5 rounded-full text-xs font-bold transition border border-[#233b70] text-white hover:border-[#38BDF8] shadow-xs active:scale-95"
              title="تسجيل الدخول إلى حسابك"
            >
              <User className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>

            {/* Delivery Location Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-1.5 bg-[#122245] hover:bg-[#1a2f5e] py-1.5 px-3 rounded-full text-xs transition border border-[#233b70]"
                type="button"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <div className="text-right leading-none hidden sm:block">
                  <span className="block text-[9px] text-gray-300">{lang === 'ar' ? 'موقع التوصيل' : 'Delivery'}</span>
                  <span className="font-bold text-white text-[11px]">{selectedLocation}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showLocationMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 text-gray-800 z-50 text-right animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 border-b border-gray-100 flex items-center justify-between">
                    <span>اختر موقع التوصيل</span>
                    <MapPin className="w-3 h-3 text-[#38BDF8]" />
                  </div>
                  {['المكلا', 'فوة', 'الديس', 'الشرج', 'الريان'].map((locName) => (
                    <button
                      key={locName}
                      onClick={() => {
                        if (onOpenLocationModal) onOpenLocationModal(locName);
                        setShowLocationMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition ${
                        selectedLocation.includes(locName)
                          ? 'text-sky-700 bg-sky-50'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{locName}</span>
                      {selectedLocation.includes(locName) && (
                        <Check className="w-3.5 h-3.5 text-sky-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#122245] text-gray-300 md:hidden border border-[#233b70]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sub Navigation Links Row */}
        <nav className="hidden md:flex items-center justify-start space-x-reverse space-x-8 py-3 text-sm font-semibold overflow-x-auto custom-scroll-hidden">
          {navLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`pb-1 px-1 transition-colors relative font-bold ${
                  isActive
                    ? 'text-white border-b-2 border-[#EAB839]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#142346] space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activeNav === link.id
                    ? 'bg-[#EAB839]/20 text-[#EAB839]'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
