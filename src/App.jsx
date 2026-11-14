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

import { Database, Store, Bike, ShieldCheck, Lock, ArrowRight, User } from 'lucide-react';
import LocationModal from './components/LocationModal';
import SellerModal from './components/SellerModal';
import CustomerAuthModal from './components/CustomerAuthModal';
import CustomerProfileModal from './components/CustomerProfileModal';
import PlatformReviewModal from './components/PlatformReviewModal';
import SupabaseModal from './components/SupabaseModal';
import Toast from './components/Toast';

import { PlatformProvider, usePlatform } from './context/PlatformContext';

function ProtectedRouteGate({ title, subtitle, icon: Icon, badgeText, onLogin, onDemo, onBack }) {
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
            <span>تسجيل الدخول / فتح حساب جديد</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>

          <button
            onClick={onDemo}
            className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-sky-200 border border-white/15 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>⚡ دخول سريع للتجربة (حساب تجريبي)</span>
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

function AppContent() {
  const {
    currentPortal,
    switchPortal,
    customerUser,
    currentMerchantUser,
    currentCourierUser,
    currentAdminUser,
    quickDemoLogin,
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
      if (hash.includes('demo=admin')) quickDemoLogin('admin');

      if (hash.startsWith('#/merchant')) switchPortal('merchant');
      else if (hash.startsWith('#/courier')) switchPortal('courier');
      else if (hash.startsWith('#/admin')) switchPortal('admin');
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


      {/* Floating Platform Rating Controls */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5">
        {currentPortal === 'marketplace' && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#07132B] to-[#122245] hover:brightness-110 text-white border border-[#EAB839]/40 shadow-2xl backdrop-blur-md text-xs font-bold flex items-center gap-2 transition hover:scale-105 active:scale-95 group"
            title="تقييمات وآراء العملاء في منصة غيم سبيس"
          >
            <span className="text-amber-400 group-hover:rotate-12 transition-transform">⭐</span>
            <span>تقييم المنصة</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EAB839] text-[#07132B] text-[10px] font-black">
              4.9
            </span>
          </button>
        )}
      </div>

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

          <Footer onNavigate={(nav) => setCurrentMarketView(nav)} />
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
              subtitle="لوحة تحكم التاجر مخصصة فقط لأصحاب المتاجر والأسر المنتجة لإدارة المنتجات، متابعة المبيعات والطلبات، وحساب الأرباح."
              onLogin={() => {
                setLoginDefaultRole('merchant');
                setCurrentMarketView('login');
                switchPortal('marketplace');
                window.location.hash = '#/';
              }}
              onDemo={() => quickDemoLogin('merchant')}
              onBack={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
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
          {!currentCourierUser ? (
            <ProtectedRouteGate
              icon={Bike}
              title="بوابة كابتن التوصيل محمية 🛵"
              badgeText="أسطول مناديب غيم سبيس المكلا"
              subtitle="هذه اللوحة مخصصة لكباتن أسطول التوصيل المعتمدين في المكلا وحضرموت لاستلام وتوصيل الشحنات والطلبات للعملاء."
              onLogin={() => {
                setLoginDefaultRole('courier');
                setCurrentMarketView('login');
                switchPortal('marketplace');
                window.location.hash = '#/';
              }}
              onDemo={() => quickDemoLogin('courier')}
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

      {/* PORTAL 4: ADMIN DASHBOARD (Guarded & Isolated) */}
      {currentPortal === 'admin' && (
        <div className="flex-1 flex flex-col">
          {!currentAdminUser ? (
            <ProtectedRouteGate
              icon={ShieldCheck}
              title="لوحة الإدارة العامة محمية 🛡️"
              badgeText="منطقة مشفرة لمشرفي النظام"
              subtitle="منطقة محظورة ومخصصة لإدارة منصة غيم سبيس، اعتماد المتاجر وتدقيق المعاملات المالية وتقارير العمليات."
              onLogin={() => {
                setLoginDefaultRole('customer');
                setCurrentMarketView('login');
                switchPortal('marketplace');
                window.location.hash = '#/';
              }}
              onDemo={() => quickDemoLogin('admin')}
              onBack={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
            />
          ) : (
            <AdminDashboard
              onBackToMarket={() => {
                window.location.hash = '#/';
                switchPortal('marketplace');
              }}
              onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
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
