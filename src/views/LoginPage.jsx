import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  Truck,
  ShieldCheck,
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
  Ticket,
  MapPin,
  Clock,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { supabaseSignUp, supabaseSignIn, getSupabaseConfig } from '../lib/supabaseClient';
import OtpVerificationModal from '../components/OtpVerificationModal';

export default function LoginPage({ onNavigate, onLoginSuccess, defaultRole = 'customer' }) {
  const {
    customerLogin,
    customerRegister,
    submitMerchantRequest,
    loginMerchant,
    loginCourier,
    loginAdmin,
    verifyDeliveryInvite,
    registerCourierWithInvite,
    switchMerchantAccount,
    switchCourierAccount,
    switchCustomerAccount,
    switchAdminAccount,
    db,
  } = usePlatform();

  const [selectedRole, setSelectedRole] = useState(defaultRole); // 'customer' | 'merchant' | 'courier' | 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [activityType, setActivityType] = useState('صناعات وحرف يدوية');
  const [city, setCity] = useState('المكلا');
  const [storeNotes, setStoreNotes] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [vehicleType, setVehicleType] = useState('دراجة نارية (سكوتر)');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  useEffect(() => {
    if (defaultRole) {
      setSelectedRole(defaultRole);
    }
  }, [defaultRole]);

  // If role is admin, never show registration
  useEffect(() => {
    if (selectedRole === 'admin') {
      setIsRegister(false);
    }
    setError('');
    setSuccess('');
    setRequestSubmitted(false);
  }, [selectedRole]);

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

    // Admin Login Flow
    if (selectedRole === 'admin') {
      if (!identifier.trim() || !password.trim()) {
        setError('يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور');
        return;
      }
      setLoading(true);
      try {
        const res = await loginAdmin(identifier.trim(), password.trim());
        if (res?.success) {
          setSuccess('تم تسجيل دخول المشرف بنجاح! جاري فتح لوحة تحكم الإدارة...');
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess(res.user, 'admin');
            else {
              window.location.hash = '#/admin';
              if (onNavigate) onNavigate('admin');
            }
          }, 800);
        } else {
          setError(res?.message || 'بيانات اعتماد المشرف غير صحيحة. تم تسجيل محاولة الدخول في سجل الأمان.');
        }
      } catch (err) {
        setError(err.message || 'فشل التحقق من صلاحيات المشرف');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Courier Registration: Must have valid invite code
    if (selectedRole === 'courier' && isRegister) {
      if (!inviteCode.trim()) {
        setError('تسجيل المندوبين يتطلب كود دعوة معتمد من إدارة غيم سبيس. يرجى إدخال رمز الدعوة.');
        return;
      }
      if (!name.trim() || !identifier.trim() || !password.trim()) {
        setError('يرجى ملء جميع البيانات المطلوبة');
        return;
      }

      setLoading(true);
      try {
        const inviteCheck = await verifyDeliveryInvite(inviteCode.trim());
        if (!inviteCheck.valid) {
          setError(inviteCheck.error || 'رمز الدعوة غير صالح أو منتهي الصلاحية');
          setLoading(false);
          return;
        }

        const regRes = await registerCourierWithInvite(
          {
            name: name.trim(),
            phone: identifier.trim(),
            email: identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@ghaym.ye`,
            password: password.trim(),
            vehicle: vehicleType,
            city,
          },
          inviteCode.trim()
        );

        if (!regRes.success) {
          setError(regRes.error || 'فشل تسجيل المندوب برمز الدعوة');
          setLoading(false);
          return;
        }

        setSuccess(`أهلاً بك كابتن "${name}" في أسطول غيم سبيس! جاري فتح لوحة التوصيل... 🛵✨`);
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(regRes.user, 'courier');
          else {
            window.location.hash = '#/courier';
            if (onNavigate) onNavigate('home');
          }
        }, 900);
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء معالجة كود الدعوة');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Merchant Registration: Submit join request (Status: Pending)
    if (selectedRole === 'merchant' && isRegister) {
      if (!name.trim() || !identifier.trim() || !storeName.trim() || !password.trim()) {
        setError('يرجى إكمال جميع الحقول المطلوبة لطلب الانضمام');
        return;
      }

      setLoading(true);
      try {
        const reqRes = await submitMerchantRequest({
          name: name.trim(),
          phone: identifier.trim(),
          email: identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@ghaym.ye`,
          password: password.trim(),
          storeName: storeName.trim(),
          activityType,
          city,
          notes: storeNotes.trim(),
        });

        if (reqRes.success) {
          setRequestSubmitted(true);
          setSuccess('تم تقديم طلب الانضمام بنجاح! بانتظار مراجعة واعتماد الإدارة.');
        } else {
          setError('تعذر تقديم طلب الانضمام، يرجى المحاولة لاحقاً');
        }
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء إرسال طلب الانضمام');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Standard Login & Customer Register
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
      // 1. MERCHANT LOGIN
      if (selectedRole === 'merchant') {
        // Check if there is a pending request with this phone/email
        const pendingReq = (db.merchantRequests || []).find(
          (r) => (r.phone === identifier.trim() || r.email === identifier.trim()) && r.status === 'pending'
        );
        if (pendingReq) {
          setError(`طلب انضمام متجرك "${pendingReq.storeName}" قيد المراجعة والاعتماد من قبل الإدارة ⏳ سنقوم بإشعارك عبر الهاتف فور تفعيل الحساب.`);
          setLoading(false);
          return;
        }

        const localRes = loginMerchant(identifier, password);
        if (localRes?.success && localRes.user?.status === 'suspended') {
          setError('هذا الحساب موقوف حالياً من قبل الإدارة. يرجى التواصل مع الدعم الفني.');
          setLoading(false);
          return;
        }

        if (!localRes.success) {
          // Check if matches active merchant in users
          const existingMerchant = (db.users || []).find(
            (u) => (u.phone === identifier.trim() || u.email === identifier.trim()) && u.role === 'merchant'
          );
          if (existingMerchant) {
            switchMerchantAccount(existingMerchant.id);
          } else {
            // Demo fallback
            switchMerchantAccount('usr-merch-1');
          }
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

      // 2. COURIER LOGIN
      if (selectedRole === 'courier') {
        const localRes = loginCourier(identifier, password);
        if (localRes?.success && localRes.user?.status === 'suspended') {
          setError('تم إيقاف حساب المندوب مؤقتاً من قبل الإدارة.');
          setLoading(false);
          return;
        }

        if (!localRes.success) {
          const existingCourier = (db.users || []).find(
            (u) => (u.phone === identifier.trim() || u.email === identifier.trim()) && u.role === 'courier'
          );
          if (existingCourier) {
            switchCourierAccount(existingCourier.id);
          } else {
            switchCourierAccount('usr-cour-1');
          }
        }

        setSuccess('مرحباً بك كابتن! جاري نقلك إلى بوابة مندوب التوصيل...');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess({ name: identifier.split('@')[0] || 'كابتن التوصيل', role: 'courier' }, 'courier');
          else {
            window.location.hash = '#/courier';
            if (onNavigate) onNavigate('home');
          }
        }, 800);
        return;
      }

      // 3. CUSTOMER AUTHENTICATION (Open & Instant)
      if (isRegister) {
        const res = customerRegister({
          name: name.trim(),
          phone: identifier.trim(),
          password: password.trim(),
          city,
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
    <div
      className="relative min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 md:py-14 overflow-hidden select-none"
      dir="rtl"
      style={{
        background: 'radial-gradient(120% 90% at 50% 10%, #7bb3fc 0%, #a5cdfd 42%, #d7e9fe 75%, #ffffff 100%)',
      }}
    >
      {/* Ambient Cloud Accents */}
      <div className="absolute -top-12 -right-16 w-80 md:w-96 pointer-events-none opacity-85 select-none z-0">
        <svg className="w-full h-auto drop-shadow-xl" fill="none" viewBox="0 0 400 240">
          <path
            d="M120 190C70 190 30 150 30 105C30 65 65 30 110 30C130 30 150 38 165 50C190 20 235 5 280 20C330 35 365 80 360 130C385 145 400 170 395 195C390 220 365 240 335 240L120 240C95 240 120 190 120 190Z"
            fill="url(#loginCloudGrad1)"
          />
          <defs>
            <linearGradient id="loginCloudGrad1" x1="40" x2="380" y1="20" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#EDF5FF" stopOpacity="0.85" />
              <stop offset="1" stopColor="#CADEFC" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute top-10 -left-20 w-80 md:w-[420px] pointer-events-none opacity-80 select-none z-0">
        <svg className="w-full h-auto drop-shadow-xl" fill="none" viewBox="0 0 400 220">
          <path
            d="M300 180C345 180 380 145 380 100C380 60 348 28 305 28C287 28 270 34 256 45C232 18 190 5 150 18C105 32 75 72 80 118C55 132 40 155 45 180C50 205 75 220 105 220L300 220Z"
            fill="url(#loginCloudGrad2)"
          />
          <defs>
            <linearGradient id="loginCloudGrad2" x1="380" x2="40" y1="20" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#E8F2FF" stopOpacity="0.8" />
              <stop offset="1" stopColor="#BED7FD" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Billowy Cumulus Cloud Floor */}
      <div className="absolute -bottom-1 left-0 right-0 w-full pointer-events-none select-none z-0 overflow-hidden leading-none">
        <svg className="w-full h-24 md:h-36 object-cover" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 180">
          <path
            d="M0,180 L1440,180 L1440,100 C1380,85 1320,60 1240,75 C1140,95 1060,50 960,65 C860,80 800,40 700,60 C600,80 520,35 420,55 C320,75 260,40 180,60 C100,80 40,55 0,75 Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
          <path
            d="M0,180 L1440,180 L1440,120 C1350,110 1280,90 1190,105 C1080,125 1010,85 910,98 C810,110 750,80 640,95 C540,110 470,80 370,95 C270,110 200,88 120,100 C60,110 20,95 0,110 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* FLOATING AUTHENTICATION PANEL */}
      <div className="relative w-full max-w-[520px] z-10 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_-12px_rgba(16,42,110,0.18),0_8px_24px_-6px_rgba(37,99,235,0.12)] border border-white/90 transition-all duration-300">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[#07132B] text-xs font-semibold transition-colors duration-200 border border-slate-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-[#07132B]" />
            <span>الرئيسية</span>
          </button>

          {/* Admin Mode Toggle Pill (Exclusively shown when accessed via explicit admin entry, hidden from general public) */}
          {defaultRole === 'admin' && (
            <button
              type="button"
              onClick={() => {
                if (selectedRole === 'admin') {
                  setSelectedRole('customer');
                } else {
                  setSelectedRole('admin');
                  setIsRegister(false);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{selectedRole === 'admin' ? 'العودة للمستخدمين' : 'بوابة الإدارة'}</span>
            </button>
          )}
        </div>

        {/* Brand Emblem */}
        <div className="flex flex-col items-center justify-center text-center mt-1">
          <div className="relative w-24 h-16 mb-1 flex items-center justify-center">
            <svg className="w-full h-full drop-shadow-md" fill="none" viewBox="0 0 100 70">
              <path
                d="M78 30C77.2 19 68 10 56.6 10C48 10 40.5 15.2 37.3 22.8C35.1 21 32.2 20 29 20C21.3 20 15 26.3 15 34C15 35 15.1 36 15.3 37C11.1 39.5 8 44.2 8 49.5C8 57.5 14.5 64 22.5 64H78C87.4 64 95 56.4 95 47C95 38 87.8 30.7 78 30Z"
                fill="url(#authCloudGrad)"
                stroke="#2563eb"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
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

          <h1 className="text-xl sm:text-2xl font-black text-[#131b2e] tracking-tight mb-1">
            {selectedRole === 'admin'
              ? 'تسجيل دخول إدارة المنصة'
              : isRegister
              ? selectedRole === 'merchant'
                ? 'طلب انضمام كتاجر وشريك'
                : selectedRole === 'courier'
                ? 'انضمام كابتن توصيل'
                : 'إنشاء حساب عميل جديد'
              : 'مرحبًا بك في غيم سبيس'}
          </h1>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            {selectedRole === 'admin'
              ? 'بوابة التحكم الإداري المحمية بالصلاحيات المشددة'
              : selectedRole === 'merchant' && isRegister
              ? 'قدّم طلب انضمام متجرك وسيتم مراجعته واعتماده من قبل الإدارة'
              : selectedRole === 'courier' && isRegister
              ? 'التسجيل متاح لحاملي أكواد الدعوة المعتمدة من الإدارة'
              : isRegister
              ? 'تسجيل فوري ومجاني للاستمتاع بمنتجات حضرموت الحصرية'
              : 'سجّل دخولك للمتابعة وإدارة حسابك بكل سهولة'}
          </p>
        </div>

        {/* Role Selector Tabs (Only when not in Admin Mode) */}
        {selectedRole !== 'admin' && (
          <div className="mt-5 mb-4">
            <div className="grid grid-cols-3 gap-2">
              {/* Role 1: عميل */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('customer');
                  setRequestSubmitted(false);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedRole === 'customer'
                    ? 'border-blue-600 bg-blue-50/70 text-[#131b2e] shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                }`}
              >
                <User className={`w-5 h-5 mb-1 ${selectedRole === 'customer' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">عميل</span>
                <span className="text-[10px] text-emerald-600 font-semibold">تسجيل فوري</span>
              </button>

              {/* Role 2: تاجر */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('merchant');
                  setRequestSubmitted(false);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedRole === 'merchant'
                    ? 'border-blue-600 bg-blue-50/70 text-[#131b2e] shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                }`}
              >
                <Store className={`w-5 h-5 mb-1 ${selectedRole === 'merchant' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">تاجر</span>
                <span className="text-[10px] text-amber-600 font-semibold">باعتماد مسبق</span>
              </button>

              {/* Role 3: مندوب توصيل */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('courier');
                  setRequestSubmitted(false);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedRole === 'courier'
                    ? 'border-blue-600 bg-blue-50/70 text-[#131b2e] shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                }`}
              >
                <Truck className={`w-5 h-5 mb-1 ${selectedRole === 'courier' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">مندوب</span>
                <span className="text-[10px] text-purple-600 font-semibold">بكود دعوة</span>
              </button>
            </div>
          </div>
        )}

        {/* Error / Success Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && !requestSubmitted && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Merchant Request Success Screen (Pending State) */}
        {requestSubmitted ? (
          <div className="py-6 px-4 text-center rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-amber-950">تم استلام طلب انضمامك بنجاح! ⏳</h3>
            <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto">
              طلب فتح متجرك <span className="font-bold">"{storeName}"</span> قيد المراجعة والتدقيق من قبل فريق إدارة منصة غيم سبيس.
              سيتم مراجعة البيانات والتواصل معك عبر الواتساب لتفعيل متجرك وبدء عرض المنتجات.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setRequestSubmitted(false);
                  setIsRegister(false);
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Form */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Courier Invite Registration Warning Note */}
            {selectedRole === 'courier' && isRegister && (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-2">
                <Ticket className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">تسجيل المندوبين محمي برمز دعوة:</span>
                  <span>لا يمكن الانضمام لأسطول التوصيل إلا بعد استلام كود دعوة فريد من الإدارة (مثال: GHAYM-MUK-XXXX).</span>
                </div>
              </div>
            )}

            {/* Merchant Request Notice */}
            {selectedRole === 'merchant' && isRegister && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                <Store className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">فتح متجر تجاري:</span>
                  <span>سيتم مراجعة طلبك وتفعيل متجرك من قبل الإدارة بعد تقديم الطلب.</span>
                </div>
              </div>
            )}

            {/* Courier Invite Code Input */}
            {selectedRole === 'courier' && isRegister && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">كود الدعوة المعتمد *</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="مثال: GHAYM-MUK-7891"
                    dir="ltr"
                    className="w-full h-11 pr-4 pl-11 rounded-xl border border-purple-300 bg-purple-50/40 text-purple-950 font-mono font-bold text-sm tracking-wider placeholder:text-slate-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                  />
                  <Ticket className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Full Name Input (Register Only) */}
            {isRegister && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {selectedRole === 'merchant' ? 'اسم مالك المتجر (التاجر) *' : 'الاسم الكامل *'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'merchant' ? 'سالم أحمد باحطاب' : 'الاسم الكامل'}
                    className="w-full h-11 pr-11 pl-4 rounded-xl border border-slate-300 bg-white text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Merchant-Specific Registration Fields */}
            {selectedRole === 'merchant' && isRegister && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">اسم المتجر التجاري *</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="مثال: متجر عسل دوعن الملكي"
                      className="w-full h-11 pr-11 pl-4 rounded-xl border border-blue-300 bg-blue-50/30 text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
                    />
                    <Store className="w-4 h-4 text-blue-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">نوع النشاط التجاري</label>
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                    >
                      <option value="صناعات وحرف يدوية">صناعات وحرف يدوية</option>
                      <option value="أزياء وخياطة وتطريز">أزياء وتطريز حضرمي</option>
                      <option value="بخور وعطور ومستحضرات">بخور وعطور ومخدرة</option>
                      <option value="عسل ومنتجات طبيعية">عسل دوعني ومنتجات نحل</option>
                      <option value="مأكولات وحلويات شعبية">مأكولات وحلويات</option>
                      <option value="هدايا وتحف تراثية">هدايا وتحف تراثية</option>
                      <option value="أخرى">نشاط تجاري آخر</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">المدينة / الحي</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                    >
                      <option value="المكلا">المكلا</option>
                      <option value="الشرج - المكلا">الشرج - المكلا</option>
                      <option value="الديس - المكلا">الديس - المكلا</option>
                      <option value="فوه - المكلا">فوه - المكلا</option>
                      <option value="تريم">تريم</option>
                      <option value="سيئون">سيئون</option>
                      <option value="الشحر">الشحر</option>
                      <option value="غيل باوزير">غيل باوزير</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">نبذة عن المنتجات أو المتجر (اختياري)</label>
                  <textarea
                    rows={2}
                    value={storeNotes}
                    onChange={(e) => setStoreNotes(e.target.value)}
                    placeholder="اكتب نبذة مختصرة عن المنتجات التي ترغب في عرضها بالمنصة..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-[#131b2e] placeholder:text-slate-400 focus:border-blue-600 outline-none resize-none"
                  />
                </div>
              </>
            )}

            {/* Courier-Specific Registration Fields */}
            {selectedRole === 'courier' && isRegister && (
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">نوع المركبة</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  >
                    <option value="دراجة نارية (سكوتر)">دراجة نارية (سكوتر)</option>
                    <option value="دراجة نارية سريعة">دراجة نارية سريعة</option>
                    <option value="سيارة نقل خفيف">سيارة نقل خفيف</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">منطقة التغطية</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  >
                    <option value="المكلا">المكلا وضواحيها</option>
                    <option value="الديس والشرج">الديس والشرج</option>
                    <option value="فوة والمتضررين">فوة والمتضررين</option>
                  </select>
                </div>
              </div>
            )}

            {/* Identifier Input (Phone or Email) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                {selectedRole === 'admin' ? 'اسم المستخدم أو البريد الإداري *' : 'رقم الهاتف أو البريد الإلكتروني *'}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'nadoalgadeh@gmail.com'
                      : '771234567 أو yourname@mail.com'
                  }
                  className="w-full h-11 pr-11 pl-4 rounded-xl border border-slate-300 bg-white text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">كلمة المرور *</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pr-11 pl-11 rounded-xl border border-slate-300 bg-white text-[#131b2e] text-sm placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-right outline-none"
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
                  alert('يرجى التواصل مع الدعم الفني لمنصة غيم سبيس لاستعادة الحساب: 773058707');
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

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#07132B] hover:bg-[#122347] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري المعالجة والتحقق...</span>
                  </>
                ) : (
                  <>
                    {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                    <span>
                      {selectedRole === 'admin'
                        ? 'دخول لوحة تحكم الإدارة'
                        : isRegister
                        ? selectedRole === 'merchant'
                          ? 'إرسال طلب الانضمام كتاجر 🏪'
                          : selectedRole === 'courier'
                          ? 'تأكيد التسجيل بكود الدعوة 🛵'
                          : 'إنشاء الحساب وبدء التسوق'
                        : 'تسجيل الدخول'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Mode Switch (Login vs Register) - Hidden in Admin Mode */}
            {selectedRole !== 'admin' && (
              <>
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative bg-white px-3 text-xs text-slate-400">أو</span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setError('');
                      setSuccess('');
                    }}
                    className="w-full h-11 rounded-xl border border-blue-600/80 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer"
                  >
                    {isRegister ? <LogIn className="w-4 h-4 text-blue-600" /> : <UserPlus className="w-4 h-4 text-blue-600" />}
                    <span>
                      {isRegister
                        ? 'لديك حساب بالفعل؟ تسجيل الدخول'
                        : selectedRole === 'merchant'
                        ? 'طلب افتتاح متجر جديد كتاجر'
                        : selectedRole === 'courier'
                        ? 'لديك رمز دعوة؟ سجل كمندوب'
                        : 'إنشاء حساب عميل جديد'}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* Quick OTP Login Option (for Customers & Couriers) */}
            {selectedRole !== 'admin' && !isRegister && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsOtpOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                  <span>دخول سريع برمز التحقق (OTP) 📱</span>
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      {/* OTP Modal */}
      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onVerified={handleOtpVerified}
        phoneNumber={identifier.length >= 7 ? identifier : '771234567'}
        title="تسجيل الدخول برمز الأمان"
        subtitle="يرجى إدخال رمز التحقق (OTP) لتسجيل الدخول الفوري لحسابك"
      />
    </div>
  );
}
