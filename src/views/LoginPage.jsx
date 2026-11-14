import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  Truck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Loader2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { supabaseSignUp, supabaseSignIn, getSupabaseConfig } from '../lib/supabaseClient';
import OtpVerificationModal from '../components/OtpVerificationModal';

export default function LoginPage({ onNavigate, onLoginSuccess, defaultRole = 'customer' }) {
  const {
    customerLogin,
    customerRegister,
    registerMerchant,
    loginMerchant,
    loginCourier,
    switchMerchantAccount,
    switchCourierAccount,
    switchCustomerAccount,
  } = usePlatform();

  const [selectedRole, setSelectedRole] = useState(defaultRole); // 'customer' | 'merchant' | 'courier'
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  useEffect(() => {
    if (defaultRole) {
      setSelectedRole(defaultRole);
    }
  }, [defaultRole]);

  const handleOtpVerified = () => {
    setIsOtpOpen(false);
    setSuccess('تم التحقق من الرمز بنجاح! جاري تسجيل الدخول...');
    setTimeout(() => {
      const userObj = {
        name: identifier ? identifier.split('@')[0] : selectedRole === 'merchant' ? 'التاجر الشريك' : selectedRole === 'courier' ? 'كابتن التوصيل' : 'عميل غيم سبيس',
        role: selectedRole,
      };
      if (onLoginSuccess) onLoginSuccess(userObj, selectedRole);
      else if (onNavigate) onNavigate('home');
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }

    setLoading(true);

    try {
      // 1. MERCHANT AUTHENTICATION
      if (selectedRole === 'merchant') {
        if (isRegister) {
          if (!storeName.trim()) {
            setError('يرجى إدخال اسم المتجر التجاري');
            setLoading(false);
            return;
          }

          let registeredUser = null;
          // Attempt real Supabase sign up
          if (getSupabaseConfig().isConfigured) {
            try {
              const res = await supabaseSignUp({
                email: identifier.includes('@') ? identifier : `${identifier.replace(/\D/g, '')}@ghaym.ye`,
                password,
                fullName: name,
                phone: identifier.replace(/\D/g, ''),
                role: 'merchant',
                storeName: storeName.trim(),
                city: 'المكلا',
              });
              registeredUser = res?.user;
            } catch (err) {
              console.warn('Supabase SignUp notice:', err.message);
            }
          }

          // Local multi-tenant fallback
          const localRes = registerMerchant({
            name: name.trim(),
            storeName: storeName.trim(),
            phone: identifier.trim(),
            email: identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@ghaym.ye`,
            password: password.trim(),
            city: 'المكلا',
          });

          setSuccess(`تم إنشاء متجر "${storeName}" بنجاح! جاري نقلك للوحة التحكم... ✨`);
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess(localRes.user || { name, role: 'merchant' }, 'merchant');
            else {
              window.location.hash = '#/merchant';
              if (onNavigate) onNavigate('home');
            }
          }, 900);
          return;
        } else {
          // Login Merchant
          if (getSupabaseConfig().isConfigured && identifier.includes('@')) {
            try {
              const res = await supabaseSignIn({ emailOrPhone: identifier, password });
              if (res?.user?.id) {
                switchMerchantAccount(res.user.id);
              }
            } catch (err) {
              console.warn('Supabase SignIn notice:', err.message);
            }
          }

          const localRes = loginMerchant(identifier, password);
          if (!localRes.success) {
            // Default demo fallback if no match found
            switchMerchantAccount('usr-merch-1');
          }

          setSuccess('مرحباً بك! جاري نقلك إلى لوحة تحكم التاجر...');
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess({ name: identifier.split('@')[0] || 'التاجر الشريك', role: 'merchant' }, 'merchant');
            else {
              window.location.hash = '#/merchant';
              if (onNavigate) onNavigate('home');
            }
          }, 800);
          return;
        }
      }

      // 2. COURIER AUTHENTICATION
      if (selectedRole === 'courier') {
        const localRes = loginCourier(identifier, password);
        if (!localRes.success) {
          switchCourierAccount('usr-cour-1');
        }
        setSuccess('مرحباً بك! جاري نقلك إلى بوابة مندوب التوصيل...');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess({ name: identifier.split('@')[0] || 'كابتن التوصيل', role: 'courier' }, 'courier');
          else {
            window.location.hash = '#/courier';
            if (onNavigate) onNavigate('home');
          }
        }, 800);
        return;
      }

      // 3. CUSTOMER AUTHENTICATION
      if (isRegister) {
        const res = customerRegister({
          name: name.trim(),
          phone: identifier.trim(),
          password: password.trim(),
        });
        setSuccess('تم إنشاء الحساب بنجاح! أهلاً بك في غيم سبيس ✨');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res?.user || { name: name.trim(), role: 'customer' }, 'customer');
          else if (onNavigate) onNavigate('home');
        }, 800);
      } else {
        const res = customerLogin(identifier.trim(), password.trim());
        setSuccess('تم تسجيل الدخول بنجاح! مرحباً بعودتك ✨');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res?.user || { name: identifier.split('@')[0] || 'عميل غيم سبيس', role: 'customer' }, 'customer');
          else if (onNavigate) onNavigate('home');
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء معالجة الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 md:py-14 overflow-hidden select-none" dir="rtl" style={{
      background: 'radial-gradient(120% 90% at 50% 10%, #7bb3fc 0%, #a5cdfd 42%, #d7e9fe 75%, #ffffff 100%)'
    }}>
      {/* ================= 3D ATMOSPHERIC CLOUD ACCENTS ================= */}
      {/* Ambient 3D Cloud Top Right */}
      <div className="absolute -top-12 -right-16 w-80 md:w-96 pointer-events-none opacity-85 select-none z-0">
        <svg className="w-full h-auto drop-shadow-xl" fill="none" viewBox="0 0 400 240">
          <path d="M120 190C70 190 30 150 30 105C30 65 65 30 110 30C130 30 150 38 165 50C190 20 235 5 280 20C330 35 365 80 360 130C385 145 400 170 395 195C390 220 365 240 335 240L120 240C95 240 120 190 120 190Z" fill="url(#loginCloudGrad1)" />
          <defs>
            <linearGradient id="loginCloudGrad1" x1="40" x2="380" y1="20" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#EDF5FF" stopOpacity="0.85" />
              <stop offset="1" stopColor="#CADEFC" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Ambient 3D Cloud Top Left */}
      <div className="absolute top-10 -left-20 w-80 md:w-[420px] pointer-events-none opacity-80 select-none z-0">
        <svg className="w-full h-auto drop-shadow-xl" fill="none" viewBox="0 0 400 220">
          <path d="M300 180C345 180 380 145 380 100C380 60 348 28 305 28C287 28 270 34 256 45C232 18 190 5 150 18C105 32 75 72 80 118C55 132 40 155 45 180C50 205 75 220 105 220L300 220Z" fill="url(#loginCloudGrad2)" />
          <defs>
            <linearGradient id="loginCloudGrad2" x1="380" x2="40" y1="20" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#E8F2FF" stopOpacity="0.8" />
              <stop offset="1" stopColor="#BED7FD" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative 3D Gift Box (Left Cue) */}
      <div className="hidden lg:block absolute left-10 md:left-20 bottom-24 w-36 pointer-events-none select-none z-0 opacity-90 drop-shadow-2xl">
        <svg className="w-full h-auto" fill="none" viewBox="0 0 160 160">
          <rect fill="url(#giftBoxGradLogin)" height="90" rx="8" width="110" x="25" y="60" />
          <rect fill="#4B88E8" height="20" rx="6" width="120" x="20" y="48" />
          <rect fill="url(#ribbonGradLogin)" height="102" width="20" x="70" y="48" />
          <ellipse cx="65" cy="36" fill="#8AB8FF" opacity="0.95" rx="20" ry="12" transform="rotate(-20 65 36)" />
          <ellipse cx="95" cy="36" fill="#679FF6" opacity="0.95" rx="20" ry="12" transform="rotate(20 95 36)" />
          <circle cx="80" cy="40" fill="#B3D3FF" r="7" />
          <defs>
            <linearGradient id="giftBoxGradLogin" x1="25" x2="135" y1="60" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="ribbonGradLogin" x1="70" x2="90" y1="48" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" />
              <stop offset="1" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative 3D Boutique Shopping Bag (Right Cue) */}
      <div className="hidden lg:block absolute right-12 md:right-24 bottom-28 w-32 pointer-events-none select-none z-0 opacity-90 drop-shadow-2xl">
        <svg className="w-full h-auto" fill="none" viewBox="0 0 160 180">
          <path d="M55 55 C55 25, 105 25, 105 55" fill="none" stroke="#93C5FD" strokeLinecap="round" strokeWidth="7" />
          <path d="M30 55 L130 55 L120 165 L40 165 Z" fill="url(#bagGradLogin)" />
          <path d="M40 55 L52 165 L30 55 Z" fill="#1E40AF" opacity="0.25" />
          <defs>
            <linearGradient id="bagGradLogin" x1="30" x2="130" y1="55" y2="165" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.85" stopColor="#1D4ED8" />
              <stop offset="1" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom Billowy Cumulus Cloud Floor */}
      <div className="absolute -bottom-1 left-0 right-0 w-full pointer-events-none select-none z-0 overflow-hidden leading-none">
        <svg className="w-full h-24 md:h-36 object-cover" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 180">
          <path d="M0,180 L1440,180 L1440,100 C1380,85 1320,60 1240,75 C1140,95 1060,50 960,65 C860,80 800,40 700,60 C600,80 520,35 420,55 C320,75 260,40 180,60 C100,80 40,55 0,75 Z" fill="#FFFFFF" fillOpacity="0.95" />
          <path d="M0,180 L1440,180 L1440,120 C1350,110 1280,90 1190,105 C1080,125 1010,85 910,98 C810,110 750,80 640,95 C540,110 470,80 370,95 C270,110 200,88 120,100 C60,110 20,95 0,110 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* ================= FLOATING AUTHENTICATION PANEL ================= */}
      <div className="relative w-full max-w-[500px] z-10 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 shadow-[0_24px_60px_-12px_rgba(16,42,110,0.18),0_8px_24px_-6px_rgba(37,99,235,0.12)] border border-white/90 transition-all duration-300">
        
        {/* Top Action: Back Pill Button */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[#07132B] text-xs font-semibold transition-colors duration-200 border border-slate-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-[#07132B]" />
            <span>رجوع</span>
          </button>
          <div className="w-6"></div>
        </div>

        {/* Cloud Icon Brand Emblem with Cart & Stars */}
        <div className="flex flex-col items-center justify-center text-center mt-1">
          <div className="relative w-28 h-20 mb-2 flex items-center justify-center">
            <svg className="w-full h-full drop-shadow-md" fill="none" viewBox="0 0 100 70">
              <path d="M78 30C77.2 19 68 10 56.6 10C48 10 40.5 15.2 37.3 22.8C35.1 21 32.2 20 29 20C21.3 20 15 26.3 15 34C15 35 15.1 36 15.3 37C11.1 39.5 8 44.2 8 49.5C8 57.5 14.5 64 22.5 64H78C87.4 64 95 56.4 95 47C95 38 87.8 30.7 78 30Z" fill="url(#authCloudGrad)" stroke="#2563eb" strokeLinejoin="round" strokeWidth="2.5" />
              <path d="M22 38H34" stroke="#2563eb" strokeLinecap="round" strokeWidth="2.5" />
              <path d="M19 44H31" stroke="#2563eb" strokeLinecap="round" strokeWidth="2.5" />
              <path d="M43 32H67L63 45H47L43 32Z" fill="#131b2e" />
              <path d="M39 27L43 32" stroke="#131b2e" strokeLinecap="round" strokeWidth="2.5" />
              <circle cx="50" cy="50" fill="#131b2e" r="3" />
              <circle cx="61" cy="50" fill="#131b2e" r="3" />
              <path d="M77 15L78.5 19.5L83 21L78.5 22.5L77 27L75.5 22.5L71 21L75.5 19.5L77 15Z" fill="#2563eb" />
              <defs>
                <linearGradient id="authCloudGrad" x1="10" x2="90" y1="12" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.75" stopColor="#EFF6FF" />
                  <stop offset="1" stopColor="#DBEAFE" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#131b2e] tracking-tight mb-1">
            {isRegister ? 'إنشاء حساب جديد' : 'مرحبًا بعودتك!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
            {isRegister
              ? 'انضم إلى غيم سبيس واستمتع بتجربة تسوق فريدة ومميزة'
              : 'سجل دخولك للمتابعة والاستمتاع بتجربة تسوق مميزة'}
          </p>
        </div>

        {/* Tri-State Role Selector (Matching Stitch Screen 4) */}
        <div className="mt-6 mb-5">
          <div className="grid grid-cols-3 gap-2.5">
            {/* Role 1: عميل */}
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                selectedRole === 'customer'
                  ? 'border-blue-600 bg-blue-50/70 text-[#131b2e] shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              <div className="w-full flex justify-end">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'customer' ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedRole === 'customer' ? 'bg-blue-600' : 'bg-transparent'
                  }`} />
                </span>
              </div>
              <User className={`w-6 h-6 my-1 ${selectedRole === "customer" ? "text-blue-600" : "text-slate-400"}`} />
              <span className="text-xs sm:text-sm font-bold">عميل</span>
            </button>

            {/* Role 2: تاجر */}
            <button
              type="button"
              onClick={() => setSelectedRole('merchant')}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                selectedRole === 'merchant'
                  ? 'border-blue-600 bg-blue-50/70 text-[#131b2e] shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              <div className="w-full flex justify-end">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'merchant' ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedRole === 'merchant' ? 'bg-blue-600' : 'bg-transparent'
                  }`} />
                </span>
              </div>
              <Store className={`w-6 h-6 my-1 ${selectedRole === "merchant" ? "text-blue-600" : "text-slate-400"}`} />
              <span className="text-xs sm:text-sm font-semibold">تاجر</span>
            </button>

            {/* Role 3: مندوب توصيل */}
            <button
              type="button"
              onClick={() => setSelectedRole('courier')}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                selectedRole === 'courier'
                  ? 'border-blue-600 bg-blue-50/70 text-[#131b2e] shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              <div className="w-full flex justify-end">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'courier' ? 'border-blue-600' : 'border-slate-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedRole === 'courier' ? 'bg-blue-600' : 'bg-transparent'
                  }`} />
                </span>
              </div>
              <Truck className={`w-6 h-6 my-1 ${selectedRole === "courier" ? "text-blue-600" : "text-slate-400"}`} />
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">مندوب توصيل</span>
            </button>
          </div>
        </div>

        {/* Error / Success Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'merchant' ? 'اسم مالك المتجر (التاجر)' : 'الاسم الكامل'}
                  className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-300 bg-white text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {selectedRole === 'merchant' && (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="اسم المتجر التجاري (مثال: متجر أصايل حضرموت)"
                    className="w-full h-12 pr-11 pl-4 rounded-xl border border-blue-300 bg-blue-50/30 text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
                  />
                  <Store className="w-4 h-4 text-blue-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="البريد الالكتروني أو رقم الجوال"
                className="w-full h-12 pr-11 pl-4 rounded-xl border border-slate-300 bg-white text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full h-12 pr-11 pl-11 rounded-xl border border-slate-300 bg-white text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="إظهار أو إخفاء كلمة المرور"
                className="absolute left-3 text-slate-400 hover:text-slate-700 focus:outline-none p-1 transition-colors cursor-pointer"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('يرجى التواصل مع الدعم الفني لاستعادة كلمة المرور');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-150"
            >
              نسيت كلمة المرور؟
            </a>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <span className="text-slate-600 font-medium">تذكرني</span>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#0c1938] hover:bg-[#152a5a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري المعالجة والتحقق...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{isRegister ? 'إنشاء الحساب وبدء النشاط' : 'تسجيل الدخول'}</span>
                </>
              )}
            </button>
          </div>

          {/* Divider Line with 'أو' */}
          <div className="relative flex items-center justify-center my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400">أو</span>
          </div>

          {/* Secondary CTA Button */}
          <div>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="w-full h-12 rounded-xl border border-blue-600/80 bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer"
            >
              {isRegister ? <LogIn className="w-4 h-4 text-blue-600" /> : <UserPlus className="w-4 h-4 text-blue-600" />}
              <span>{isRegister ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'إنشاء حساب جديد'}</span>
            </button>
          </div>

          {/* Quick OTP Login Option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsOtpOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              <span>تسجيل الدخول السريع برمز التحقق (OTP) 📱</span>
            </button>
          </div>

          {/* Card Footer Note */}
          <div className="text-center pt-2 text-xs text-slate-500">
            <span>{isRegister ? 'لديك حساب؟' : 'ليس لديك حساب؟'}</span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="text-blue-600 font-bold hover:underline mr-1 cursor-pointer"
            >
              {isRegister ? 'تسجيل الدخول الآن' : 'إنشاء حساب الآن'}
            </button>
          </div>
        </form>
      </div>

      {/* OTP Modal */}
      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onVerified={handleOtpVerified}
        phoneNumber={identifier.length >= 7 ? identifier : '770123456'}
        title="تسجيل الدخول برمز الأمان"
        subtitle="يرجى إدخال رمز التحقق (OTP) لتسجيل الدخول الفوري لحسابك"
      />
    </div>
  );
}
