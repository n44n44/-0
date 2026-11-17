import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PortalTopBar from './components/PortalTopBar';
import HomePage from './views/HomePage';
import AllStoresPage from './views/AllStoresPage';
import StoreDetailsPage from './views/StoreDetailsPage';
import ProductsPage from './views/ProductsPage';
import ProductDetailsPage from './views/ProductDetailsPage';
import CategoriesPage from './views/CategoriesPage';
import CartPage from './views/CartPage';
import CheckoutPage from './views/CheckoutPage';
import OrderTrackingPage from './views/OrderTrackingPage';
import MerchantDashboard from './views/MerchantDashboard';
import CourierDashboard from './views/CourierDashboard';
import AdminDashboard from './views/AdminDashboard';
import AboutPage from './views/AboutPage';
import ContactPage from './views/ContactPage';
import LoginPage from './views/LoginPage';
import WishlistPage from './views/WishlistPage';

import { Database, Store, Bike, ShieldCheck, Lock, ArrowRight, User, ShieldAlert, AlertTriangle, Key, CheckCircle2, Clock } from 'lucide-react';
import LocationModal from './components/LocationModal';
import SellerModal from './components/SellerModal';
import CustomerAuthModal from './components/CustomerAuthModal';
import CustomerProfileModal from './components/CustomerProfileModal';
import PlatformReviewModal from './components/PlatformReviewModal';
import SupabaseModal from './components/SupabaseModal';
import Toast from './components/Toast';
import LandscapeOrientationEnforcer from './components/LandscapeOrientationEnforcer';

import { PlatformProvider, usePlatform } from './context/PlatformContext';

function ProtectedRouteGate({ title, subtitle, icon: Icon, badgeText, onLogin, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#07132B] via-[#0A162B] to-[#07132B] text-white" dir="rtl">
      <div className="w-full max-w-md bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 mx-auto flex items-center justify-center shadow-lg">
          <Icon className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{badgeText || 'منطقة وصول محمية ومقيدة'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{subtitle}</p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={onLogin}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#EAB839] hover:bg-[#D9A726] text-[#07132B] font-black text-sm shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>تسجيل الدخول / تقديم طلب انضمام</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>

          <button
            onClick={onBack}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            العودة للمنصة الرئيسية (سوق العملاء)
          </button>
        </div>
      </div>
    </div>
  );
}

// Dedicated Security View: Merchant Under Review (Pending Approval)
function MerchantPendingGate({ user, onBack, onLogout }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#07132B] via-[#0A162B] to-[#07132B] text-white" dir="rtl">
      <div className="w-full max-w-lg bg-white/[0.05] border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg animate-pulse">
          <Clock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>طلب انضمام التاجر بانتظار الاعتماد ⏳</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">طلبك قيد المراجعة والاعتماد</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            أهلاً بك يا <strong className="text-white font-bold">{user?.name || 'التاجر الشريك'}</strong>. تم استلام طلب انضمام متجرك <strong className="text-amber-300 font-bold">"{user?.storeName || 'متجرك'}"</strong> بنجاح، وهو يخضع حالياً لتدقيق ومراجعة إدارة غيم سبيس.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/20 border border-white/10 text-right space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-white/10">
            <span className="text-slate-400">اسم المتجر:</span>
            <span className="font-bold text-white">{user?.storeName || 'متجر غير محدد'}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/10">
            <span className="text-slate-400">المالك:</span>
            <span className="font-bold text-white">{user?.name || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/10">
            <span className="text-slate-400">رقم الهاتف:</span>
            <span className="font-mono text-sky-300">{user?.phone || '-'}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">حالة الحساب:</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] border border-amber-500/30">
              قيد المراجعة والتدقيق ⏳
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-[11px] text-sky-200 leading-relaxed text-right">
          💡 لا تفتح لوحة تحكم التاجر قبل موافقة الإدارة الرسمية، وذلك لضمان جودة وأصالة معروضات منصة غيم سبيس. سنقوم بإشعارك عبر الهاتف والمنصة فور تفعيل حسابك.
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onBack}
            className="w-full py-3 px-5 rounded-2xl bg-[#EAB839] hover:bg-[#D9A726] text-[#07132B] font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>العودة للمنصة الرئيسية (سوق العملاء)</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            تسجيل الخروج من هذا الحساب
          </button>
        </div>
      </div>
    </div>
  );
}

// Dedicated Security View: Merchant Request Rejected
function MerchantRejectedGate({ user, onBack, onLogout }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#07132B] via-[#0A162B] to-[#07132B] text-white" dir="rtl">
      <div className="w-full max-w-lg bg-rose-950/20 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-400/10 text-rose-300 border border-rose-400/25 text-xs font-bold">
            <span>حالة الطلب: غير معتمد ❌</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">لم يتم قبول طلب الانضمام</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            عذراً، لم تتم الموافقة على طلب انضمام متجرك <strong className="text-white font-bold">"{user?.storeName || 'متجرك'}"</strong> من قبل إدارة المنصة.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/30 border border-rose-500/20 text-right space-y-2 text-xs">
          <div className="text-slate-400 font-bold mb-1">سبب الرفض المسجل من الإدارة:</div>
          <div className="p-3 rounded-xl bg-rose-900/30 border border-rose-500/20 text-rose-200 text-xs font-medium leading-relaxed">
            {user?.rejectionReason || 'البيانات المدخلة غير مكتملة أو نوع النشاط لا يتوافق مع المعايير الحالية لمنصة غيم سبيس.'}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onBack}
            className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer"
          >
            العودة للمنصة الرئيسية (سوق العملاء)
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 text-xs font-semibold text-rose-400 hover:text-rose-300 transition cursor-pointer"
          >
            تسجيل الخروج والتقديم بحساب آخر
          </button>
        </div>
      </div>
    </div>
  );
}

// Dedicated Security View: Access Denied for authenticated non-admin roles (Customers, Merchants, Couriers)
function AdminAccessDenied({ activeUser, onReturnHome, onReturnPortal }) {
  const roleName =
    activeUser?.role === 'merchant'
      ? 'تاجر (صاحب متجر)'
      : activeUser?.role === 'courier'
      ? 'كابتن توصيل'
      : 'عميل المنصة';

  const portalRoute =
    activeUser?.role === 'merchant'
      ? '#/merchant'
      : activeUser?.role === 'courier'
      ? '#/courier'
      : '#/';

  const portalButtonLabel =
    activeUser?.role === 'merchant'
      ? 'العودة إلى لوحة تحكم التاجر 🏪'
      : activeUser?.role === 'courier'
      ? 'العودة إلى بوابة كابتن التوصيل 🛵'
      : 'العودة إلى سوق غيم سبيس 🛍️';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#07132B] via-[#0A162B] to-[#07132B] text-white" dir="rtl">
      <div className="w-full max-w-lg bg-red-950/20 border border-red-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/25 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>محاولة وصول غير مصرح بها — وصول محظور ⛔</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">غير مصرح بالدخول للوحة المشرف</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            حسابك الحالي <strong className="text-amber-300">({activeUser?.name || 'مستخدم مسجل'})</strong> يحمل صفة <span className="text-sky-300 font-bold">[{roleName}]</span>.
            لوحة الإدارة العامة مقيدة بالكامل وحصرية فقط بالمدير العام المعتمد. لا يمكن ترقية صلاحية الحساب ذاتياً، وتم توثيق هذه المحاولة في سجل التدقيق الأمني.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => onReturnPortal(portalRoute)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{portalButtonLabel}</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>

          <button
            onClick={onReturnHome}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            العودة إلى الصفحة الرئيسية للمنصة
          </button>
        </div>
      </div>
    </div>
  );
}

// Dedicated Security Gate: Secure Admin Credential Gate (No demo bypass, no public registration)
function AdminSecureLoginGate({ onLoginSuccess, onBackToMarket }) {
  const { loginAdmin } = usePlatform();
  const [identifier, setIdentifier] = useState('nadoalgadeh@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم أو البريد الإداري وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAdmin(identifier.trim(), password.trim());
      if (res?.success) {
        setSuccess('تم التحقق بنجاح من صلاحيات المشرف العام! جاري فتح اللوحة...');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res.user);
        }, 600);
      } else {
        setError(res?.message || 'بيانات الدخول الإداري غير صحيحة. تم تسجيل محاولة الدخول في سجل الأمان.');
      }
    } catch (err) {
      setError(err?.message || 'حدث خطأ أثناء الاتصال للتحقق من الصلاحيات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#07132B] via-[#0A162B] to-[#07132B] text-white" dir="rtl">
      <div className="w-full max-w-md bg-white/[0.04] border border-sky-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>بوابة المشرف العام — تسجيل دخول مشفر ومحمي</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">دخول إدارة منصة غيم سبيس</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            منطقة محظورة ومخصصة لإدارة منصة غيم سبيس، اعتماد المتاجر وتدقيق المعاملات المالية. لا يوجد تسجيل عام من هذه الواجهة.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="space-y-4">
          <div className="space-y-1.5 text-right">
            <label className="block text-xs font-bold text-slate-300">
              اسم المستخدم أو البريد الإداري للمشرف *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nadoalgadeh@gmail.com"
                className="w-full h-11 pr-4 pl-4 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-right outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="block text-xs font-bold text-slate-300">
              كلمة مرور المشرف العام *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pr-4 pl-4 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all text-right outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#EAB839] hover:bg-[#D9A726] text-[#07132B] font-black text-sm shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#07132B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Key className="w-4 h-4 text-[#07132B]" />
                <span>التحقق والدخول للوحة المشرف</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onBackToMarket}
            className="text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            العودة للمنصة الرئيسية (سوق العملاء)
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const {
    currentPortal,
    switchPortal,
    customerUser,
    currentMerchantUser,
    currentCourierUser,
    currentAdminUser,
    quickDemoLogin,
    logoutMerchant,
    logoutCourier,
    switchCustomerAccount,
    orders,
    placeOrder,
    toastMessage: contextToastMessage,
    setToastMessage: setContextToastMessage,
    toastType: contextToastType,
  } = usePlatform();

  // Sub-navigation inside Marketplace
  const [currentMarketView, setCurrentMarketView] = useState('home');
  const [loginDefaultRole, setLoginDefaultRole] = useState('customer');
  const [selectedLocation, setSelectedLocation] = useState('المكلا');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize hash for direct portal access without exposing buttons to customer
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      if (hash.includes('demo=merchant')) quickDemoLogin('merchant');
      if (hash.includes('demo=courier')) quickDemoLogin('courier');
      // Admin demo bypass permanently removed for strict security compliance

      if (hash.startsWith('#/merchant')) switchPortal('merchant');
      else if (hash.startsWith('#/courier')) switchPortal('courier');
      else if (hash.startsWith('#/admin')) switchPortal('admin');
      else if (hash.startsWith('#/login') || hash.includes('view=login')) {
        switchPortal('marketplace');
        setCurrentMarketView('login');
      }
      else if (hash.startsWith('#/products') || hash.includes('view=products')) {
        switchPortal('marketplace');
        setCurrentMarketView('products');
      }
      else if (hash.startsWith('#/wishlist') || hash.includes('view=wishlist')) {
        switchPortal('marketplace');
        setCurrentMarketView('wishlist');
      }
      else if (hash.startsWith('#/stores') || hash.includes('view=stores')) {
        switchPortal('marketplace');
        setCurrentMarketView('stores');
      }
      else if (hash.startsWith('#/cart') || hash.includes('view=cart')) {
        switchPortal('marketplace');
        setCurrentMarketView('cart');
      }
      else if (hash.startsWith('#/checkout') || hash.includes('view=checkout')) {
        switchPortal('marketplace');
        setCurrentMarketView('checkout');
      }
      else if (hash.startsWith('#/product-details') || hash.includes('view=product-details')) {
        switchPortal('marketplace');
        setCurrentMarketView('product-details');
      }
      else if (hash === '#/' || !hash) switchPortal('marketplace');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [switchPortal, quickDemoLogin]);

  // Cart state
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      name: 'حقيبة خوص يمنية مطرزة يدوياً',
      storeName: 'تراثيات حضرمية',
      category: 'صناعات يدوية',
      price: 24000,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      description: 'حقيبة خوص يدوية تراثية مطرزة بنقوش هندسية يمنية أصيلة مع حزام جلدي أنيق.',
      quantity: 1,
    },
    {
      id: 'prod-2',
      name: 'مباخر دقة عود مكلاوي أصلي',
      storeName: 'بخور وعطور المكلا',
      category: 'بخور وعطور',
      price: 24000,
      image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
      description: 'مبخرة تقليدية فخارية مع دقة بخور مكلاوي معتق بدهن العود الكمبودي والمسك.',
      quantity: 1,
    },
  ]);

  // Active tracking order
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(() => orders[0]);

  // Cart operations
  const handleAddToCart = (product, openDetails = true) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) } : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    setToastMessage(`تمت إضافة "${product.name}" إلى سلة المشتريات بنجاح 🛍️`);

    // When adding product or clicking on it, open the large interface directly
    if (openDetails) {
      setSelectedProduct(product);
      setCurrentMarketView('product-details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setCurrentMarketView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setToastMessage('تم حذف المنتج من السلة');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleConfirmOrder = (orderData) => {
    const created = placeOrder(orderData);
    setActiveTrackingOrder(created);
    setCartItems([]);
    setToastMessage(`تم تأكيد الطلب #${created.id} بنجاح! جاري تحويلك للتتبع 🛵`);
    setCurrentMarketView('tracking');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#07132B] flex flex-col font-sans" dir="rtl">


      {/* 2. RENDER THE ACTIVE PORTAL */}

      {/* PORTAL 1: CUSTOMER MARKETPLACE */}
      {currentPortal === 'marketplace' && (
        <div className="flex-1 flex flex-col">
          <Header
            activeNav={currentMarketView}
            onNavigate={(nav) => setCurrentMarketView(nav)}
            cartCount={totalCartCount}
            onOpenCart={() => setCurrentMarketView('cart')}
            onOpenLocationModal={(loc) => {
              setSelectedLocation(loc);
              setIsLocationModalOpen(true);
            }}
            selectedLocation={selectedLocation}
            onOpenSellerModal={() => setIsSellerModalOpen(true)}
            customerUser={customerUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenReview={() => setIsReviewModalOpen(true)}
          />

          <main className="flex-1">
            {currentMarketView === 'home' && (
              <HomePage
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onOpenStoreModal={(store) => {
                  setSelectedStore(store);
                  setCurrentMarketView('store-details');
                }}
                onSelectProduct={handleOpenProduct}
                onAddToCart={handleAddToCart}
                onOpenSellerModal={() => setIsSellerModalOpen(true)}
              />
            )}

            {currentMarketView === 'categories' && (
              <CategoriesPage
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onSelectCategory={() => setCurrentMarketView('products')}
              />
            )}

            {currentMarketView === 'products' && (
              <ProductsPage
                onAddToCart={handleAddToCart}
                onSelectProduct={handleOpenProduct}
                onOpenProductModal={handleOpenProduct}
                onNavigate={(nav) => setCurrentMarketView(nav)}
              />
            )}

            {currentMarketView === 'product-details' && (
              <ProductDetailsPage
                product={selectedProduct}
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onAddToCart={(item) => handleAddToCart(item, false)}
                onOpenStoreModal={(store) => {
                  setSelectedStore(store);
                  setCurrentMarketView('store-details');
                }}
              />
            )}

            {currentMarketView === 'stores' && (
              <AllStoresPage
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onOpenStoreModal={(store) => {
                  setSelectedStore(store);
                  setCurrentMarketView('store-details');
                }}
                onAddToCart={handleAddToCart}
                onOpenSellerModal={() => setIsSellerModalOpen(true)}
              />
            )}

            {currentMarketView === 'store-details' && (
              <StoreDetailsPage
                store={selectedStore}
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onAddToCart={handleAddToCart}
                onSelectProduct={handleOpenProduct}
              />
            )}

            {currentMarketView === 'wishlist' && (
              <WishlistPage
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onAddToCart={handleAddToCart}
                onSelectProduct={handleOpenProduct}
              />
            )}

            {currentMarketView === 'cart' && (
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onNavigate={(nav) => setCurrentMarketView(nav)}
              />
            )}

            {currentMarketView === 'checkout' && (
              <CheckoutPage
                cartItems={cartItems}
                onConfirmOrder={handleConfirmOrder}
                onNavigate={(nav) => setCurrentMarketView(nav)}
              />
            )}

            {currentMarketView === 'tracking' && (
              <OrderTrackingPage
                order={activeTrackingOrder || orders[0]}
                onNavigate={(nav) => setCurrentMarketView(nav)}
              />
            )}

            {currentMarketView === 'about' && (
              <AboutPage
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onOpenSellerModal={() => setIsSellerModalOpen(true)}
              />
            )}

            {currentMarketView === 'contact' && (
              <ContactPage onNavigate={(nav) => setCurrentMarketView(nav)} />
            )}

            {currentMarketView === 'login' && (
              <LoginPage
                defaultRole={loginDefaultRole}
                onNavigate={(nav) => setCurrentMarketView(nav)}
                onLoginSuccess={(user, role) => {
                  if (role === 'merchant') {
                    window.location.hash = '#/merchant';
                    switchPortal('merchant');
                  } else if (role === 'courier') {
                    window.location.hash = '#/courier';
                    switchPortal('courier');
                  } else if (role === 'admin') {
                    window.location.hash = '#/admin';
                    switchPortal('admin');
                  } else {
                    if (user?.id && switchCustomerAccount) {
                      switchCustomerAccount(user.id);
                    }
                    setCurrentMarketView('home');
                  }
                }}
              />
            )}
          </main>

          <Footer
            onNavigate={(nav) => setCurrentMarketView(nav)}
            onOpenReview={() => setIsReviewModalOpen(true)}
          />
        </div>
      )}

      {/* PORTAL 2: MERCHANT DASHBOARD (Guarded & Isolated) */}
      {currentPortal === 'merchant' && (
        <div className="flex-1 flex flex-col">
          {!currentMerchantUser ? (
            <ProtectedRouteGate
              icon={Store}
              title="لوحة تحكم التاجر محمية 🏪"
              badgeText="بوابة أصحاب المتاجر والأسر المنتجة"
              subtitle="لوحة تحكم التاجر مخصصة فقط لأصحاب المتاجر والأسر المنتجة المعتمدين. لا تفتح لوحة التحكم قبل موافقة الإدارة الرسمية."
              onLogin={() => {
                setLoginDefaultRole('merchant');
                setCurrentMarketView('login');
                switchPortal('marketplace');
                window.location.hash = '#/';
              }}
              onBack={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
            />
          ) : currentMerchantUser.status === 'pending' || currentMerchantUser.status === 'pending_approval' ? (
            <MerchantPendingGate
              user={currentMerchantUser}
              onBack={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
              onLogout={logoutMerchant}
            />
          ) : currentMerchantUser.status === 'rejected' ? (
            <MerchantRejectedGate
              user={currentMerchantUser}
              onBack={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
              onLogout={logoutMerchant}
            />
          ) : (
            <MerchantDashboard onBackToMarket={() => {
              window.location.hash = '#/';
              switchPortal('marketplace');
            }} />
          )}
        </div>
      )}

      {/* PORTAL 3: COURIER DASHBOARD (Guarded & Isolated) */}
      {currentPortal === 'courier' && (
        <div className="flex-1 flex flex-col">
          {!currentCourierUser || currentCourierUser.role !== 'courier' || currentCourierUser.status !== 'active' ? (
            <ProtectedRouteGate
              icon={Bike}
              title="بوابة كابتن التوصيل محمية 🛵"
              badgeText="أسطول مناديب غيم سبيس المكلا (بنظام كود الدعوة)"
              subtitle="هذه اللوحة مخصصة حصراً لكباتن أسطول التوصيل المعتمدين بكود دعوة رسمي من إدارة غيم سبيس. لا يُسمح بالدخول عبر التسجيل العادي أو بدون كود معتمد."
              onLogin={() => {
                setLoginDefaultRole('courier');
                setCurrentMarketView('login');
                switchPortal('marketplace');
                window.location.hash = '#/';
              }}
              onBack={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
            />
          ) : (
            <CourierDashboard onBackToMarket={() => {
              window.location.hash = '#/';
              switchPortal('marketplace');
            }} />
          )}
        </div>
      )}

      {/* PORTAL 4: ADMIN DASHBOARD (Strict Security Gate & Authoritative Protection) */}
      {currentPortal === 'admin' && (
        <div className="flex-1 flex flex-col">
          {currentAdminUser && currentAdminUser.role === 'admin' && currentAdminUser.status !== 'suspended' ? (
            <AdminDashboard
              onBackToMarket={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            />
          ) : (customerUser || currentMerchantUser || currentCourierUser) ? (
            // Unauthorized persona actively logged in: Strictly denied with security audit logging
            <AdminAccessDenied
              activeUser={currentMerchantUser || currentCourierUser || customerUser}
              onReturnHome={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
              onReturnPortal={(route) => {
                window.location.hash = route;
                if (route.includes('merchant')) switchPortal('merchant');
                else if (route.includes('courier')) switchPortal('courier');
                else switchPortal('marketplace');
              }}
            />
          ) : (
            // Unauthenticated visitor attempting direct URL entry: Strict Credential Gate (No demo bypass, no public signup)
            <AdminSecureLoginGate
              onLoginSuccess={() => {
                switchPortal('admin');
              }}
              onBackToMarket={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
            />
          )}
        </div>
      )}

      {/* GLOBAL MODALS */}
      {/* Supabase Database Connection & Sync Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Platform Review & Customer Testimonials Modal */}
      <PlatformReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Customer Authentication Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
          setToastMessage('مرحباً بك مجدداً في غيم سبيس! تم تسجيل الدخول بنجاح ✨');
        }}
      />

      {/* Customer Profile & Addresses & Orders Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onTrackOrder={(order) => {
          setActiveTrackingOrder(order);
          setIsProfileModalOpen(false);
          switchPortal('marketplace');
          setCurrentMarketView('tracking');
        }}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
      />

      {/* Seller Registration Modal */}
      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onRegisterSuccess={() => {
          setIsSellerModalOpen(false);
          switchPortal('merchant');
        }}
      />

      {/* Toast Alerts */}
      <Toast
        message={toastMessage || contextToastMessage}
        type={toastMessage ? 'cart' : (contextToastType || 'cart')}
        onClose={() => {
          setToastMessage(null);
          if (setContextToastMessage) setContextToastMessage(null);
        }}
      />

      {/* Landscape Orientation Enforcer (Forces horizontal display on mobile) */}
      <LandscapeOrientationEnforcer />
    </div>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}
